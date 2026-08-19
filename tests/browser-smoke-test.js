const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { createSiteServer } = require("../scripts/serve");

const root = path.dirname(__dirname);

const gameVersion = Number(
  fs
    .readFileSync(path.join(root, "js", "core", "bootstrap.js"), "utf8")
    .match(/global\.ver\s*=\s*(\d+);/)[1],
);

const candidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const browser = candidates.find(fs.existsSync);

if (!browser) {
  throw new Error(
    "Chrome or Chromium was not found. Set CHROME_PATH to its executable.",
  );
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function runChrome(url, userDataDirectory, windowSize = "900,600") {
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--enable-logging=stderr",
    "--log-level=0",
    "--virtual-time-budget=8000",
    `--window-size=${windowSize}`,
    `--user-data-dir=${userDataDirectory}`,
    "--dump-dom",
    url,
  ];

  return new Promise((resolve, reject) => {
    execFile(
      browser,
      args,
      { maxBuffer: 8 * 1024 * 1024 },
      (error, stdout, stderr) =>
        error ? reject(error) : resolve({ stdout, stderr }),
    );
  });
}

function assertCommonStartup(stdout, port) {
  if (!stdout.includes('<option value="en">English</option>')) {
    throw new Error("The English language option was not rendered.");
  }
  if (!stdout.includes('<option value="tr">Türkçe</option>')) {
    throw new Error("The Turkish language option was not rendered.");
  }
  if (!stdout.includes('id="ctrmg"')) {
    throw new Error("The game interface did not initialize.");
  }
  if (!stdout.includes(`>v${gameVersion}</a>`)) {
    throw new Error("The expected game version was not rendered.");
  }
  if (
    stdout.includes('id="loading-overlay"') ||
    stdout.includes('id="loading-text"')
  ) {
    throw new Error("The loading screen did not clear after startup.");
  }
  const scaleMatch = stdout.match(/data-ui-scale="([\d.]+)"/);
  if (!scaleMatch || Number(scaleMatch[1]) >= 1) {
    throw new Error("The game interface did not fit the reduced viewport.");
  }
  const expectedChangelogUrl = `http://127.0.0.1:${port}/changelog/changelog.html`;
  if (!stdout.includes(`href="${expectedChangelogUrl}"`)) {
    throw new Error("The changelog link is not site-base aware.");
  }
}

function assertNoUnexpectedErrors(stderr, allowSaveRecovery = false) {
  const runtimeErrors = stderr
    .split(/\r?\n/)
    .filter((line) =>
      /Uncaught|SyntaxError|ReferenceError|TypeError|Failed to load resource/i.test(
        line,
      ),
    )
    .filter(
      (line) =>
        !allowSaveRecovery ||
        !line.includes("The saved game could not be loaded"),
    );
  if (runtimeErrors.length) {
    throw new Error(
      `Browser runtime errors detected:\n${runtimeErrors.join("\n")}`,
    );
  }
}

function assertVersionedRequests(requests) {
  const requiredPaths = [
    "/css/game.css",
    "/js/i18n-loader.js",
    "/js/game.js",
    "/locales/manifest.json",
    "/locales/en.json",
    "/locales/tr.json",
  ];
  const versions = requiredPaths.map((requiredPath) => {
    const request = requests.find(({ pathname }) => pathname === requiredPath);
    if (!request) {
      throw new Error(`Expected asset request missing: ${requiredPath}`);
    }
    const version = request.searchParams.get("v");
    if (!/^[a-f0-9]{12}$/.test(version ?? "")) {
      throw new Error(`Asset request is not versioned: ${request.href}`);
    }
    return version;
  });
  if (new Set(versions).size !== 1) {
    throw new Error("A deployment mixed assets from different versions.");
  }
}

async function main() {
  const requests = [];
  const server = createSiteServer({
    assetDelayMs: 250,
    enableTestRoutes: true,
    onRequest: (url) => requests.push(new URL(url)),
  });
  const profiles = [
    fs.mkdtempSync(path.join(os.tmpdir(), "proto23-browser-")),
    fs.mkdtempSync(path.join(os.tmpdir(), "proto23-recovery-")),
    fs.mkdtempSync(path.join(os.tmpdir(), "proto23-localization-")),
  ];

  try {
    const port = await listen(server);
    const baseUrl = `http://127.0.0.1:${port}`;

    const turkishFirstRequest = requests.length;
    const turkish = await runChrome(`${baseUrl}/?lang=tr`, profiles[0]);
    assertNoUnexpectedErrors(turkish.stderr);
    assertCommonStartup(turkish.stdout, port);
    if (!turkish.stdout.includes('<html lang="tr"')) {
      throw new Error("The Turkish locale was not loaded.");
    }
    if (!turkish.stdout.includes(">Ayarlar</div>")) {
      throw new Error("The Turkish interface text was not rendered.");
    }

    // A locale the manifest marks complete is served without English underneath it, so
    // en.json must not be asked for at all -- it is 348 KB, and check-i18n.js proves
    // there is not one key in it a Turkish page would read. Asserted on the requests the
    // server actually saw, because the saving is the request that does not happen and
    // nothing in the rendered page could show it.
    const turkishRequests = requests.slice(turkishFirstRequest);
    if (
      !turkishRequests.some(({ pathname }) => pathname === "/locales/tr.json")
    ) {
      throw new Error(
        "The Turkish page did not request tr.json, so this scenario is not measuring what it claims.",
      );
    }
    const fallbackFetch = turkishRequests.find(
      ({ pathname }) => pathname === "/locales/en.json",
    );
    if (fallbackFetch) {
      throw new Error(
        "The Turkish page fetched en.json as a fallback. locales/manifest.json marks tr complete, so the loader must skip it -- that request is 348 KB the player waits for and never reads a key from.",
      );
    }

    // index.html preloads the bundle so its transfer overlaps the locale requests
    // instead of starting after them. The hint and the loader's own request have to be
    // the same URL, version included, or the 1.2 MB file is fetched twice -- which
    // would be slower than not preloading it at all.
    const bundleRequests = turkishRequests.filter(
      ({ pathname }) => pathname === "/js/game.js",
    );
    if (bundleRequests.length === 0) {
      throw new Error("The page never requested the bundle.");
    }
    const bundleVersions = new Set(bundleRequests.map(({ search }) => search));
    if (bundleVersions.size !== 1) {
      throw new Error(
        `The preload hint and the loader asked for different bundle URLs (${[...bundleVersions].join(" and ")}), so it is downloaded twice rather than once.`,
      );
    }

    const cachedReload = await runChrome(`${baseUrl}/?lang=en`, profiles[0]);
    assertNoUnexpectedErrors(cachedReload.stderr);
    assertCommonStartup(cachedReload.stdout, port);
    if (!cachedReload.stdout.includes('<html lang="en"')) {
      throw new Error("The cached-profile reload did not load English.");
    }

    // The list surfaces are custom properties applied from JavaScript. A token that does
    // not resolve leaves the declaration invalid, so a row loses its background entirely
    // and nothing throws -- it would read as a styling accident nobody introduced.
    const listSurfaces = await runChrome(
      `${baseUrl}/__test-list-surfaces.html`,
      profiles[0],
    );
    assertNoUnexpectedErrors(listSurfaces.stderr);
    assertCommonStartup(listSurfaces.stdout, port);
    if (!listSurfaces.stdout.includes('data-list-surfaces-resolved="true"')) {
      throw new Error(
        "A --list-* custom property did not resolve to a colour. Every list in the game reads these, so a row would be drawn with no background at all.",
      );
    }
    if (!listSurfaces.stdout.includes('data-list-row="rgb(10, 30, 54)"')) {
      throw new Error(
        "--list-row is not the colour every list row used to be given literally. The token replaced twenty copies of rgb(10,30,54); changing its value changes every list at once.",
      );
    }

    // The player's name is the only player-authored text the game draws, and it reaches
    // surfaces built as HTML. A save is a shared file, so this is not only a player's own
    // problem. The probe types a payload that runs the moment it is parsed as markup.
    const nameSafety = await runChrome(
      `${baseUrl}/__test-player-name-safety.html`,
      profiles[0],
    );
    assertNoUnexpectedErrors(nameSafety.stderr);
    assertCommonStartup(nameSafety.stdout, port);
    if (!nameSafety.stdout.includes('data-name-probe-fired="false"')) {
      throw new Error(
        "A tag typed into the player's name executed. The name is drawn in the HUD, in its hover description and in the combat log, and a save is exported as a file -- so this runs in the page of whoever opens that save.",
      );
    }
    if (!nameSafety.stdout.includes('data-name-hud-has-element="false"')) {
      throw new Error(
        "The HUD built the player's name as markup. It must be written with textContent.",
      );
    }
    if (!nameSafety.stdout.includes('data-name-stored-has-bracket="false"')) {
      throw new Error(
        "The stored player name still contains < or >. sanitizePlayerName must strip them where the name enters the game, so the hover description and the combat log are safe too.",
      );
    }
    if (!nameSafety.stdout.includes('data-name-log-has-element="false"')) {
      throw new Error(
        "The combat log built an element out of the player's name.",
      );
    }

    // The export and import panels were hand-positioned overlays outside the game's own
    // look, with no Escape and no focus handling. They are dialogs on the shared shell
    // now, so what is checked is what the shell provides.
    const transferModal = await runChrome(
      `${baseUrl}/__test-save-transfer-modal.html`,
      profiles[0],
    );
    assertNoUnexpectedErrors(transferModal.stderr);
    assertCommonStartup(transferModal.stdout, port);
    for (const [flag, complaint] of [
      [
        "transfer-is-dialog",
        "the export panel is not a <dialog> on the shared shell",
      ],
      ["transfer-is-open", "the export dialog did not open modally"],
      [
        "transfer-is-wide",
        "the export dialog is missing game-modal--wide, so its field has no room",
      ],
      [
        "transfer-has-save",
        "the export dialog opened without the save in its field",
      ],
      [
        "transfer-closed-and-removed",
        "Escape did not close the export dialog, or closing left it in the document",
      ],
      [
        "transfer-flag-cleared",
        "closing the export dialog left global.flags.expatv set, so it cannot be opened again",
      ],
      [
        "transfer-import-is-dialog",
        "the import panel is not a <dialog> on the shared shell",
      ],
      ["transfer-import-has-field", "the import dialog has no paste field"],
      ["transfer-import-has-chooser", "the import dialog has no file chooser"],
      [
        "transfer-has-copy",
        "the export dialog has no copy button, so a player on a locked-down profile has to select the text by hand",
      ],
      [
        "transfer-copy-kept-field",
        "pressing copy emptied or corrupted the field it was meant to copy from",
      ],
      ["transfer-has-paste", "the import dialog has no paste button"],
      [
        "transfer-paste-spoke",
        "pressing paste with no clipboard permission left the field silent instead of saying so",
      ],
    ]) {
      if (!transferModal.stdout.includes(`data-${flag}="true"`)) {
        throw new Error(`Save transfer regression: ${complaint}.`);
      }
    }
    if (!transferModal.stdout.includes('data-transfer-inline-top="none"')) {
      throw new Error(
        "The save transfer dialog sets an inline top offset. It was positioned at 370px from the document top, which is what put it off the edge of a small viewport; a dialog is centred by the browser.",
      );
    }

    // The game's navigation was mouse-only: five divs with click listeners, no tab order, no
    // role, no keydown, while the save bar below them was fully reachable.
    const navKeyboard = await runChrome(
      `${baseUrl}/__test-nav-keyboard.html`,
      profiles[0],
    );
    assertNoUnexpectedErrors(navKeyboard.stderr);
    assertCommonStartup(navKeyboard.stdout, port);
    for (const [flag, complaint] of [
      [
        "nav-reachable",
        "a panel button is missing its tab index or its button role",
      ],
      [
        "nav-panel-started-closed",
        "the settings panel was already open, so this scenario proves nothing",
      ],
      ["nav-took-focus", "a panel button cannot take focus"],
      [
        "nav-enter-opened-panel",
        "pressing Enter on a panel button did not open its panel -- the attributes are there but the key does nothing",
      ],
    ]) {
      if (!navKeyboard.stdout.includes(`data-${flag}="true"`)) {
        throw new Error(`Navigation keyboard regression: ${complaint}.`);
      }
    }

    const mobileChangelog = await runChrome(
      `${baseUrl}/changelog/changelog.html`,
      profiles[0],
      "430,900",
    );
    assertNoUnexpectedErrors(mobileChangelog.stderr);
    if (!mobileChangelog.stdout.includes('data-horizontal-overflow="false"')) {
      throw new Error("The changelog overflows the mobile viewport.");
    }
    if (!mobileChangelog.stdout.includes('class="release release-latest"')) {
      throw new Error("The changelog release cards were not rendered.");
    }

    const combatLayout = await runChrome(
      `${baseUrl}/__test-combat-layout.html?lang=en`,
      profiles[0],
    );
    assertNoUnexpectedErrors(combatLayout.stderr);
    assertCommonStartup(combatLayout.stdout, port);
    if (!combatLayout.stdout.includes('data-combat-panels-separated="true"')) {
      throw new Error("The enemy panel overlaps the player panel.");
    }
    if (!combatLayout.stdout.includes('data-battle-rows-stacked="true"')) {
      const gap = combatLayout.stdout.match(/data-battle-row-gap="([^"]*)"/);
      const failures = combatLayout.stdout.match(
        /data-battle-row-failures="([^"]*)"/,
      );
      throw new Error(
        `The strips at the bottom of the enemy panel do not stack: ${failures?.[1] ?? "probe incomplete"} (control-to-readout gap ${gap?.[1] ?? "?"}px)`,
      );
    }

    const tooltipLayout = await runChrome(
      `${baseUrl}/__test-tooltip-layout.html?lang=en`,
      profiles[0],
    );
    assertNoUnexpectedErrors(tooltipLayout.stderr);
    assertCommonStartup(tooltipLayout.stdout, port);
    if (!tooltipLayout.stdout.includes('data-tooltip-positioned="true"')) {
      const diagnostics = tooltipLayout.stdout.match(
        /data-tooltip-(?:below|in-viewport|first-bounds|edge-bounds)="[^"]*"/g,
      );
      throw new Error(
        `The hover description does not follow the pointer within the viewport: ${diagnostics?.join(" ") ?? "probe incomplete"}`,
      );
    }
    if (!tooltipLayout.stdout.includes('data-item-footer-verified="true"')) {
      const failures = tooltipLayout.stdout.match(
        /data-item-footer-failures="([^"]*)"/,
      );
      throw new Error(
        `An item tooltip's kill counter, rarity row, and durability gauge collide: ${failures?.[1] || "probe incomplete"}`,
      );
    }

    // The boot screen has to be painted before any of the game's own code runs, which
    // is the whole reason it moved from bootstrap.js into index.html. Turkish, so the
    // build-time string injection is exercised on the locale that is not the default.
    const bootScreen = await runChrome(
      `${baseUrl}/__test-boot-screen.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(bootScreen.stderr);
    assertCommonStartup(bootScreen.stdout, port);
    if (!bootScreen.stdout.includes('data-boot-early-overlay="true"')) {
      throw new Error(
        "The loading screen must exist in the markup, before any of the game's code runs.",
      );
    }
    if (!bootScreen.stdout.includes('data-boot-early-phase="locales"')) {
      throw new Error(
        "The first boot stage must be on the page from the first frame, or there is nothing for the CSS to show while the locale files download.",
      );
    }
    if (!bootScreen.stdout.includes('data-boot-early-lang="tr"')) {
      throw new Error(
        "The boot screen must resolve its language before the game exists, from the URL or the stored preference.",
      );
    }
    if (bootScreen.stdout.includes('data-boot-early-has-token="true"')) {
      throw new Error(
        "The boot screen shipped with an unresolved {{boot:...}} token: scripts/build-site.js did not fill it from the locale files.",
      );
    }
    const bootText = bootScreen.stdout.match(/data-boot-early-text="([^"]*)"/);
    if (!bootText || !bootText[1].trim()) {
      throw new Error(
        "The boot screen painted with no visible text; CSS has hidden both languages.",
      );
    }
    if (!bootScreen.stdout.includes('data-boot-screen-gone="true"')) {
      throw new Error(
        "The loading screen is still on the page after the game finished loading.",
      );
    }

    // Repeated log lines fold into one row. Run through the real msg(), because the
    // first attempt at this compared the new row against itself and so never folded
    // anything, while looking entirely correct in the source.
    const logCollapse = await runChrome(
      `${baseUrl}/__test-log-collapse.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(logCollapse.stderr);
    assertCommonStartup(logCollapse.stdout, port);
    if (!logCollapse.stdout.includes('data-log-collapsed-rows="1"')) {
      const got = logCollapse.stdout.match(/data-log-collapsed-rows="([^"]*)"/);
      throw new Error(
        `Three identical messages must leave one row in the log, not ${got?.[1] ?? "?"}.`,
      );
    }
    if (!logCollapse.stdout.includes('data-log-collapsed-tally="x3"')) {
      const got = logCollapse.stdout.match(
        /data-log-collapsed-tally="([^"]*)"/,
      );
      throw new Error(
        `The collapsed row must be tallied x3, not "${got?.[1] ?? ""}".`,
      );
    }
    if (!logCollapse.stdout.includes('data-log-distinct-rows="2"')) {
      throw new Error("A different message must start its own row.");
    }
    if (!logCollapse.stdout.includes('data-log-appended-rows="4"')) {
      const got = logCollapse.stdout.match(/data-log-appended-rows="([^"]*)"/);
      throw new Error(
        `A row msg_add has appended to must not absorb a later repeat: expected 4 rows, got ${got?.[1] ?? "?"}.`,
      );
    }

    const saveBarLayout = await runChrome(
      `${baseUrl}/__test-save-bar-layout.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(saveBarLayout.stderr);
    assertCommonStartup(saveBarLayout.stdout, port);
    if (
      !saveBarLayout.stdout.includes('data-save-bar-controls-separated="true"')
    ) {
      throw new Error("The save-bar controls overlap or leave the footer.");
    }
    if (!saveBarLayout.stdout.includes('data-save-bar-clears-game="true"')) {
      const gap = saveBarLayout.stdout.match(/data-save-bar-gap="([^"]*)"/);
      throw new Error(
        `The save bar must clear the game's bottom row by a slight gap, not cover it or float far above it: measured ${gap?.[1] ?? "?"}px`,
      );
    }

    const uiSafety = await runChrome(
      `${baseUrl}/__test-ui-safety.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(uiSafety.stderr);
    assertCommonStartup(uiSafety.stdout, port);
    if (!uiSafety.stdout.includes('data-ui-safety-verified="true"')) {
      throw new Error(
        "Theme scaling, background presets, save deletion modal, localized misses, or message-log controls regressed.",
      );
    }
    if (!uiSafety.stdout.includes('data-background-presets-separated="true"')) {
      throw new Error("The background preset controls overlap or touch.");
    }
    if (!uiSafety.stdout.includes('data-save-delete-modal-verified="true"')) {
      throw new Error(
        "The save deletion modal does not fit, localize, or cancel safely.",
      );
    }

    const lorePanel = await runChrome(
      `${baseUrl}/__test-lore-panel.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(lorePanel.stderr);
    assertCommonStartup(lorePanel.stdout, port);
    if (!lorePanel.stdout.includes('data-lore-panel-verified="true"')) {
      const failures = lorePanel.stdout.match(
        /data-lore-panel-failures="([^"]*)"/,
      );
      throw new Error(
        `The journal's knowledge panel does not record what the player has learned: ${failures?.[1] || "probe incomplete"}`,
      );
    }

    const cellarStory = await runChrome(
      `${baseUrl}/__test-cellar-story.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(cellarStory.stderr);
    assertCommonStartup(cellarStory.stdout, port);
    if (!cellarStory.stdout.includes('data-cellar-story-verified="true"')) {
      const failures = cellarStory.stdout.match(
        /data-cellar-story-failures="([^"]*)"/,
      );
      throw new Error(
        `The damp cellar side story cannot be played through: ${failures?.[1] || "probe incomplete"}`,
      );
    }

    const stonePlate = await runChrome(
      `${baseUrl}/__test-stone-plate.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(stonePlate.stderr);
    assertCommonStartup(stonePlate.stdout, port);
    if (!stonePlate.stdout.includes('data-stone-plate-verified="true"')) {
      const failures = stonePlate.stdout.match(
        /data-stone-plate-failures="([^"]*)"/,
      );
      throw new Error(
        `The stone plate cannot be found, broken, or read: ${failures?.[1] || "probe incomplete"}`,
      );
    }

    const windowPanels = await runChrome(
      `${baseUrl}/__test-window-panels.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(windowPanels.stderr);
    assertCommonStartup(windowPanels.stdout, port);
    if (!windowPanels.stdout.includes('data-window-panels-verified="true"')) {
      const failures = windowPanels.stdout.match(
        /data-window-panel-failures="([^"]*)"/,
      );
      throw new Error(
        `A window panel grows with its contents instead of scrolling: ${failures?.[1] || "probe incomplete"}`,
      );
    }

    const inventoryBars = await runChrome(
      `${baseUrl}/__test-inventory-bars.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(inventoryBars.stderr);
    assertCommonStartup(inventoryBars.stdout, port);
    if (!inventoryBars.stdout.includes('data-inventory-bars-verified="true"')) {
      const failures = inventoryBars.stdout.match(
        /data-inventory-bars-failures="([^"]*)"/,
      );
      throw new Error(
        `A long inventory pushes its filter row or sort bar out of the panel: ${failures?.[1] || "probe incomplete"}`,
      );
    }

    const releaseNotes = await runChrome(
      `${baseUrl}/__test-release-notes.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(releaseNotes.stderr);
    assertCommonStartup(releaseNotes.stdout, port);
    if (!releaseNotes.stdout.includes('data-release-notes-verified="true"')) {
      const failures = releaseNotes.stdout.match(
        /data-release-notes-failures="([^"]*)"/,
      );
      throw new Error(
        `A player returning from an older build was not shown what changed: ${failures?.[1] || "probe incomplete"}`,
      );
    }

    const shopLayout = await runChrome(
      `${baseUrl}/__test-shop-layout.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(shopLayout.stderr);
    assertCommonStartup(shopLayout.stdout, port);
    if (!shopLayout.stdout.includes('data-shop-layout-verified="true"')) {
      const failures = shopLayout.stdout.match(
        /data-shop-layout-failures="([^"]*)"/,
      );
      const metrics = shopLayout.stdout.match(
        /data-shop-layout-metrics="([^"]*)"/,
      );
      throw new Error(
        `The shop buying price and reputation readouts left the bottom of the panel: ${failures?.[1] || "probe incomplete"} (${metrics?.[1] || "no metrics"})`,
      );
    }

    const saveDeleteReload = await runChrome(
      `${baseUrl}/__test-save-delete-reload.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(saveDeleteReload.stderr);
    assertCommonStartup(saveDeleteReload.stdout, port);
    if (!saveDeleteReload.stdout.includes('data-save-delete-reloaded="true"')) {
      throw new Error(
        "Confirmed save deletion did not reload into a fresh game while preserving the locale.",
      );
    }

    const calendarLocale = await runChrome(
      `${baseUrl}/__test-calendar-locale.html?lang=tr`,
      profiles[0],
    );
    assertNoUnexpectedErrors(calendarLocale.stderr);
    assertCommonStartup(calendarLocale.stdout, port);
    if (!calendarLocale.stdout.includes('data-calendar-locale-safe="true"')) {
      throw new Error(
        "Turkish calendar labels changed locale-independent Sunday behavior.",
      );
    }

    const localizationIntegrity = await runChrome(
      `${baseUrl}/__test-localization-integrity.html`,
      profiles[2],
    );
    assertNoUnexpectedErrors(localizationIntegrity.stderr);
    assertCommonStartup(localizationIntegrity.stdout, port);
    if (
      !localizationIntegrity.stdout.includes('data-locale-key-leak-free="true"')
    ) {
      const details = localizationIntegrity.stdout.match(
        /data-locale-key-leak-details="[^"]*"/,
      );
      throw new Error(
        `A literal locale key reached visible UI, log, or hover text: ${details?.[0] ?? "probe incomplete"}`,
      );
    }
    if (
      !localizationIntegrity.stdout.includes(
        'data-player-name-persistence="true"',
      )
    ) {
      const details = localizationIntegrity.stdout.match(
        /data-player-name-details="[^"]*"/,
      );
      throw new Error(
        `The custom player name was replaced during save/load or locale reload: ${details?.[0] ?? "probe incomplete"}`,
      );
    }

    const recovery = await runChrome(
      `${baseUrl}/__test/corrupt-save`,
      profiles[1],
    );
    assertNoUnexpectedErrors(recovery.stderr, true);
    assertCommonStartup(recovery.stdout, port);
    // This fixture decodes but has the wrong shape, so it is rejected by the
    // segment check before anything is restored. It used to reach JSON.parse and
    // throw, which surfaced as the startup error instead; being caught up front
    // means the save is backed up rather than partially applied.
    if (!recovery.stdout.includes('id="save-unreadable"')) {
      throw new Error(
        "A malformed save was not reported before the restore began.",
      );
    }

    const unreadable = await runChrome(
      `${baseUrl}/__test/unreadable-save`,
      profiles[1],
    );
    assertNoUnexpectedErrors(unreadable.stderr, true);
    // assertCommonStartup also fails if the loading screen is still up, which
    // is the regression this scenario exists to catch: reporting the unreadable
    // save must not skip the startup teardown.
    assertCommonStartup(unreadable.stdout, port);
    if (!unreadable.stdout.includes('id="save-unreadable"')) {
      throw new Error(
        "An unreadable save did not report itself to the player.",
      );
    }

    assertVersionedRequests(requests);
    console.log(
      "Slow assets, version consistency, Turkish startup without an English fallback fetch, a bundle preloaded once rather than twice, cached reload, list surface tokens, player-name safety, save transfer dialogs, keyboard navigation, malformed-save recovery, unreadable-save reporting, combat-panel separation, hover-description positioning, save-bar layout and clearance, the first-frame boot screen, collapsed log repeats, separated background presets, theme scaling, styled save-deletion modal, fresh-start reload after deletion, localized combat misses, message-log controls, locale-independent calendar behavior, locale-key rendering safety, player-name persistence, viewport fitting, the journal knowledge panel, the damp cellar side story, the stone plate, scrolling window panels, pinned inventory bars, new-version release notes, shop footer layout, changelog linking, and mobile changelog layout verified.",
    );
  } finally {
    if (server.listening) await close(server);
    profiles.forEach((profile) => fs.rmSync(profile, { recursive: true }));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
