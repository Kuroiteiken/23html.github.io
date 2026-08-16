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

    const turkish = await runChrome(`${baseUrl}/?lang=tr`, profiles[0]);
    assertNoUnexpectedErrors(turkish.stderr);
    assertCommonStartup(turkish.stdout, port);
    if (!turkish.stdout.includes('<html lang="tr"')) {
      throw new Error("The Turkish locale was not loaded.");
    }
    if (!turkish.stdout.includes(">Ayarlar</div>")) {
      throw new Error("The Turkish interface text was not rendered.");
    }

    const cachedReload = await runChrome(`${baseUrl}/?lang=en`, profiles[0]);
    assertNoUnexpectedErrors(cachedReload.stderr);
    assertCommonStartup(cachedReload.stdout, port);
    if (!cachedReload.stdout.includes('<html lang="en"')) {
      throw new Error("The cached-profile reload did not load English.");
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
    if (!recovery.stdout.includes('id="startup-error"')) {
      throw new Error("A malformed save did not show the recovery message.");
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
      "Slow assets, version consistency, Turkish startup, cached reload, malformed-save recovery, unreadable-save reporting, combat-panel separation, hover-description positioning, save-bar layout, separated background presets, theme scaling, styled save-deletion modal, fresh-start reload after deletion, localized combat misses, message-log controls, locale-independent calendar behavior, locale-key rendering safety, player-name persistence, viewport fitting, changelog linking, and mobile changelog layout verified.",
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
