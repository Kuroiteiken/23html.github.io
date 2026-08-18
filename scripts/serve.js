const fs = require("fs");
const http = require("http");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..", "dist");
const port = Number(process.env.PORT) || 8080;
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".wav": "audio/wav",
};

const liveReloadClient = `<script id="proto23-live-reload">
  (() => {
    const events = new EventSource("/__dev/events");
    events.addEventListener("reload", () => window.location.reload());
  })();
</script>`;

function createSiteServer(options = {}) {
  if (!fs.existsSync(siteRoot)) {
    throw new Error("dist/ is missing. Run npm run build first.");
  }

  const liveReloadClients = new Set();
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(requestUrl.pathname);
    options.onRequest?.(requestUrl);

    if (options.liveReload && pathname === "/__dev/events") {
      response.writeHead(200, {
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream; charset=utf-8",
      });
      response.write("event: ready\ndata: connected\n\n");
      liveReloadClients.add(response);
      request.on("close", () => liveReloadClients.delete(response));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test/corrupt-save") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(`<!doctype html>
        <meta charset="UTF-8">
        <script>
          localStorage.setItem("v0.3", "bm90LWpzb258YnJva2Vu");
          location.replace("/?lang=tr");
        </script>`);
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test/unreadable-save") {
      // Not decodable at all, unlike /__test/corrupt-save which decodes and
      // then fails to parse. This exercises the backup-and-report path.
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(`<!doctype html>
        <meta charset="UTF-8">
        <script>
          localStorage.setItem("v0.3", "!!!!");
          location.replace("/?lang=tr");
        </script>`);
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-log-collapse.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      // Repeated log lines must fold into one row with a tally. Exercised through the
      // real msg() rather than by inspecting source, because the first attempt at this
      // compared against the wrong element and shipped looking correct.
      const probe = `<script>
        const logProbe = setInterval(() => {
          if (!document.getElementById("ctrmg") || typeof msg !== "function") return;
          clearInterval(logProbe);
          const root = document.documentElement;
          clearMessageLog();
          const rows = () => dom.mscont.children.length;
          msg("aaa");
          msg("aaa");
          msg("aaa");
          root.dataset.logCollapsedRows = String(rows());
          const tally = dom.mscont.lastElementChild.querySelector(".msg-repeat");
          root.dataset.logCollapsedTally = tally ? tally.innerHTML : "";
          msg("bbb");
          root.dataset.logDistinctRows = String(rows());
          msg("ccc");
          msg_add(" and more");
          msg("ccc");
          root.dataset.logAppendedRows = String(rows());
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", probe + "</body>"));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-boot-screen.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      // The boot screen has to be in the markup, not built by the bundle, or it
      // cannot appear until the thing it is covering has already finished loading.
      // So this probe records what exists BEFORE any of the game's code runs, then
      // waits for the game to be up and checks the screen was taken away again.
      const bootProbe = `<script>
        (() => {
          const overlay = document.getElementById("loading-overlay");
          const text = document.getElementById("loading-text");
          const root = document.documentElement;
          // Read at once: this script is in the page's own markup, ahead of the
          // loader, so nothing of the game exists yet.
          const early = {
            overlay: !!overlay,
            text: !!text,
            phase: root.dataset.bootPhase || "",
            lang: root.dataset.bootLang || "",
            // The one the player is not reading must be removed by CSS, and the one
            // they are must have real words in it rather than an unresolved token.
            shown: text
              ? [...text.querySelectorAll("[lang]")]
                  .filter((el) => getComputedStyle(el).display !== "none")
                  .map((el) => el.textContent.trim())
                  .join(" | ")
              : "",
          };
          root.dataset.bootEarlyOverlay = String(early.overlay && early.text);
          root.dataset.bootEarlyPhase = early.phase;
          root.dataset.bootEarlyLang = early.lang;
          root.dataset.bootEarlyText = early.shown;
          root.dataset.bootEarlyHasToken = String(early.shown.includes("{{"));
          const done = setInterval(() => {
            if (!document.getElementById("ctrmg")) return;
            clearInterval(done);
            // fade() removes the element on the fifth tick of a 10ms interval, so
            // give it room rather than racing it.
            setTimeout(() => {
              root.dataset.bootScreenGone = String(
                !document.getElementById("loading-overlay") &&
                  !document.getElementById("loading-text"),
              );
            }, 200);
          }, 10);
        })();
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      // Injected immediately before the loader's own script tag: late enough that the
      // boot screen's markup has been parsed, early enough that nothing of the game
      // exists yet. Placing it right after <body> ran it before the overlay's own
      // divs had been read, which is not the question being asked.
      const loaderAt = index.indexOf('<script src="js/i18n-loader.js');
      if (loaderAt < 0) {
        response.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("index.html no longer has the loader script tag.");
        return;
      }
      response.end(
        index.slice(0, loaderAt) + bootProbe + index.slice(loaderAt),
      );
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-combat-layout.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const layoutProbe = `<script>
        const combatLayoutProbe = setInterval(() => {
          const player = document.getElementById("player-panel");
          const enemy = document.getElementById("enemy-panel");
          if (!player || !enemy || !document.getElementById("ctrmg")) return;
          global.flags.btl = false;
          player.style.display = "";
          player.style.left = "8px";
          enemy.style.display = "";
          enemy.style.left = "457px";
          enemy.style.top = "8px";
          const playerBounds = player.getBoundingClientRect();
          const enemyBounds = enemy.getBoundingClientRect();
          document.documentElement.dataset.combatPanelsSeparated = String(
            enemyBounds.left >= playerBounds.right &&
            playerBounds.left < enemyBounds.left
          );

          // The battle control row and the area readout are both anchored to the
          // bottom of the enemy panel, so they have to stack rather than cover
          // each other. Forced here with the longest area name the game defines
          // plus an infinite size, which is what used to wrap the readout onto a
          // second line and bury the row.
          const longest = Object.keys(area)
            .map((key) => area[key].name || "")
            .reduce((a, b) => (b.length > a.length ? b : a), "");
          global.current_z = { name: longest, size: -1 };
          dom.d7m.update();

          // Populate the enemy's effect strip. eff_d routes by target, and in rain
          // or cold every enemy that spawns is given one of these, so a populated
          // strip is the normal case rather than an edge case.
          for (const eff of [effect.wet, effect.cold, effect.psn])
            eff_d(eff, eff.x, eff.c, eff.b, { id: -999 });

          const controls = document.getElementById("bbts");
          const areaInfo = document.getElementById("ainfo");
          const controlBounds = controls.getBoundingClientRect();
          const areaBounds = areaInfo.getBoundingClientRect();
          const scale = Number(document.documentElement.dataset.uiScale) || 1;
          const stacked = areaBounds.top >= controlBounds.bottom - 0.5;
          const bothInsidePanel =
            controlBounds.top >= enemyBounds.top - 0.5 &&
            areaBounds.bottom <= enemyBounds.bottom + 0.5;
          const readoutStaysOneLine =
            areaInfo.getBoundingClientRect().height / scale <= 20;

          // The enemy's effect icons are a third strip in the same corner and must
          // stack above the control row rather than being painted over by it.
          const enemyStrip = enemy.querySelector("#se_i");
          const icons = [...enemyStrip.querySelectorAll(".se_ia")];
          const iconBounds = icons.map((icon) => icon.getBoundingClientRect());
          const iconsClearControls =
            iconBounds.length > 0 &&
            iconBounds.every((bounds) => bounds.bottom <= controlBounds.top + 0.5);
          const iconsInsidePanel = iconBounds.every(
            (bounds) => bounds.top >= enemyBounds.top - 0.5,
          );

          const battleChecks = {
            stacked,
            bothInsidePanel,
            readoutStaysOneLine,
            iconsClearControls,
            iconsInsidePanel,
          };
          document.documentElement.dataset.battleRowsStacked = String(
            Object.values(battleChecks).every(Boolean),
          );
          document.documentElement.dataset.battleRowFailures = Object.keys(
            battleChecks,
          )
            .filter((name) => !battleChecks[name])
            .concat("icons=" + icons.length)
            .join(",");
          document.documentElement.dataset.battleRowGap = (
            (areaBounds.top - controlBounds.bottom) /
            scale
          ).toFixed(1);
          clearInterval(combatLayoutProbe);
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${layoutProbe}</body>`));
      return;
    }

    if (
      options.enableTestRoutes &&
      pathname === "/__test-tooltip-layout.html"
    ) {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const tooltipProbe = `<script>
        const tooltipLayoutProbe = setInterval(() => {
          if (!document.getElementById("ctrmg") || typeof dscr !== "function") {
            return;
          }
          clearInterval(tooltipLayoutProbe);
          const firstPointer = { clientX: 220, clientY: 220 };
          dscr(firstPointer, null, 2, "Tooltip", "Localized description");
          const firstBounds = document
            .getElementById("dscr")
            .getBoundingClientRect();
          const floatsBelowPointer =
            firstBounds.left > firstPointer.clientX &&
            firstBounds.top > firstPointer.clientY;
          const edgePointer = {
            clientX: window.innerWidth - 2,
            clientY: window.innerHeight - 2,
          };
          dscr(edgePointer, null, 2, "Tooltip", "Localized description");
          const edgeBounds = document
            .getElementById("dscr")
            .getBoundingClientRect();
          const staysInViewport =
            edgeBounds.left >= 0 &&
            edgeBounds.top >= 0 &&
            edgeBounds.right <= window.innerWidth &&
            edgeBounds.bottom <= window.innerHeight;
          document.documentElement.dataset.tooltipBelow =
            String(floatsBelowPointer);
          document.documentElement.dataset.tooltipInViewport =
            String(staysInViewport);
          document.documentElement.dataset.tooltipFirstBounds = [
            firstBounds.left,
            firstBounds.top,
            firstBounds.right,
            firstBounds.bottom,
          ].join(",");
          document.documentElement.dataset.tooltipEdgeBounds = [
            edgeBounds.left,
            edgeBounds.top,
            edgeBounds.right,
            edgeBounds.bottom,
          ].join(",");
          document.documentElement.dataset.tooltipPositioned = String(
            floatsBelowPointer && staysInViewport,
          );

          // An item tooltip's last rows used to fight over one corner: the rarity
          // row sits there in normal flow while the kill counter and the
          // durability gauge were both pinned to it absolutely.
          const weapon = wpn.bsrd;
          weapon.data = Object.assign({}, weapon.data, { kills: 148 });
          weapon.rar = 5;
          dscr(firstPointer, weapon, 1);

          const tooltip = document.getElementById("dscr");
          const tooltipBounds = tooltip.getBoundingClientRect();
          const kills = tooltip.querySelector(".item-description-kills");
          const classRow = document.getElementById("intfffx");
          const rarity = tooltip.querySelector(".item-rarity");
          const gauge = document.getElementById("dr_l");

          const killBounds = kills.getBoundingClientRect();
          const classBounds = classRow.getBoundingClientRect();
          const rarityBounds = rarity.getBoundingClientRect();
          const gaugeBounds = gauge.getBoundingClientRect();
          const rarityText = rarity.querySelector("small").getBoundingClientRect();

          const killsShown = killBounds.width > 0 && kills.textContent.includes("148");
          // On the class row, not on top of the rarity row.
          const killsOnClassRow =
            killBounds.top >= classBounds.top - 0.5 &&
            killBounds.bottom <= classBounds.bottom + 0.5;
          const killsClearOfRarity =
            killBounds.bottom <= rarityBounds.top + 0.5;
          // Held against the right edge rather than the left.
          const killsHeldRight =
            killBounds.right <= tooltipBounds.right + 0.5 &&
            killBounds.right > tooltipBounds.left + (tooltipBounds.width * 2) / 3;
          // The stars stop before the gauge instead of running under it.
          const rarityClearOfGauge = rarityText.right <= gaugeBounds.left + 0.5;
          const rowsInsideTooltip =
            classBounds.top >= tooltipBounds.top - 0.5 &&
            rarityBounds.bottom <= tooltipBounds.bottom + 0.5;

          const checks = {
            killsShown,
            killsOnClassRow,
            killsClearOfRarity,
            killsHeldRight,
            rarityClearOfGauge,
            rowsInsideTooltip,
          };
          document.documentElement.dataset.itemFooterVerified = String(
            Object.values(checks).every(Boolean),
          );
          document.documentElement.dataset.itemFooterFailures = Object.keys(checks)
            .filter((name) => !checks[name])
            .join(",");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${tooltipProbe}</body>`));
      return;
    }

    if (
      options.enableTestRoutes &&
      pathname === "/__test-save-bar-layout.html"
    ) {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const saveBarProbe = `<script>
        const saveBarLayoutProbe = setInterval(() => {
          const bar = document.getElementById("sl");
          const controls = document.getElementById("save-bar-controls");
          if (!document.getElementById("ctrmg") || !bar || !controls) return;
          clearInterval(saveBarLayoutProbe);
          const barBounds = bar.getBoundingClientRect();
          const controlBounds = [...controls.children].map((child) =>
            child.getBoundingClientRect(),
          );
          const controlsSeparated = controlBounds.every(
            (bounds, index) =>
              index === 0 || bounds.left >= controlBounds[index - 1].right,
          );
          const controlsInsideBar = controlBounds.every(
            (bounds) =>
              bounds.left >= barBounds.left &&
              bounds.right <= barBounds.right &&
              bounds.top >= barBounds.top &&
              bounds.bottom <= barBounds.bottom,
          );
          const collapseFollowsSaveAndLoad =
            bar.children[0]?.id === "save-game" &&
            bar.children[1]?.id === "load-game" &&
            bar.children[2]?.id === "save-bar-collapse";

          // The bar is fixed to the viewport's bottom edge, so it has to clear the
          // game's own bottom row by a slight gap without leaving a wide empty band
          // above itself. Removing the reservation entirely took the gap to zero and
          // the tabs ended up touching the bar, so it is back and this asserts it.
          const gameBounds = document
            .getElementById("ctrmg")
            .getBoundingClientRect();
          const scale = Number(document.documentElement.dataset.uiScale) || 1;
          const gapAboveBar = (barBounds.top - gameBounds.bottom) / scale;
          const clearsGame = gapAboveBar >= 0;
          // Only meaningful while the game is scaled down to fit. On a window
          // tall enough to need no scaling the bar just sits on the viewport's
          // bottom edge, wherever that falls.
          const gapIsSlight = scale >= 1 || gapAboveBar <= 24;

          document.documentElement.dataset.saveBarControlsSeparated = String(
            controlsSeparated &&
              controlsInsideBar &&
              collapseFollowsSaveAndLoad,
          );
          document.documentElement.dataset.saveBarClearsGame = String(
            clearsGame && gapIsSlight,
          );
          document.documentElement.dataset.saveBarGap = gapAboveBar.toFixed(1);
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${saveBarProbe}</body>`));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-ui-safety.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const uiSafetyProbe = `<script>
        const uiSafetyLayoutProbe = setInterval(() => {
          const messageControls = document.getElementById("m_control");
          const clearButton = document.getElementById("message-log-clear");
          const backgroundPresets =
            document.getElementById("background-presets");
          if (
            !document.getElementById("ctrmg") ||
            !messageControls ||
            !clearButton ||
            !backgroundPresets ||
            !dom.ct_bt4_03b2 ||
            !dom.sl_kill
          ) return;
          clearInterval(uiSafetyLayoutProbe);

          document.getElementById("gmsgs").style.display = "";
          const messageBounds = messageControls.getBoundingClientRect();
          const messageChildren = [...messageControls.children];
          const messageChildBounds = messageChildren.map((child) =>
            child.getBoundingClientRect(),
          );
          const messageControlsFit = messageChildBounds.every(
            (bounds, index) =>
              bounds.left >= messageBounds.left &&
              bounds.right <= messageBounds.right &&
              bounds.top >= messageBounds.top &&
              bounds.bottom <= messageBounds.bottom &&
              (index === 0 ||
                bounds.left >= messageChildBounds[index - 1].right),
          );
          const emptyIndicatorsHidden = [
            ...document.querySelectorAll(".bts_m_b:empty"),
          ].every((indicator) => getComputedStyle(indicator).display === "none");

          dom.ctrwin4.style.display = "";
          const presetContainerBounds =
            backgroundPresets.getBoundingClientRect();
          const presetBounds = [...backgroundPresets.children].map((preset) =>
            preset.getBoundingClientRect(),
          );
          const backgroundPresetsSeparated = presetBounds.every(
            (bounds, index) =>
              bounds.left >= presetContainerBounds.left &&
              bounds.right <= presetContainerBounds.right &&
              bounds.top >= presetContainerBounds.top &&
              bounds.bottom <= presetContainerBounds.bottom &&
              (index === 0 || bounds.left > presetBounds[index - 1].right),
          );

          const scaleBeforeTheme = document.body.style.zoom;
          const playerWidthBeforeTheme = document
            .getElementById("player-panel")
            .getBoundingClientRect().width;
          dom.ct_bt4_03b2.click();
          const themePreservedScale =
            document.body.style.zoom === scaleBeforeTheme &&
            document.getElementById("player-panel").getBoundingClientRect()
              .width === playerWidthBeforeTheme;

          localStorage.setItem("v0.3", "test-save");
          localStorage.setItem("proto23.locale", "tr");
          dom.sl_kill.focus();
          dom.sl_kill.click();
          const modal = document.getElementById("save-delete-modal");
          const modalBounds = modal.getBoundingClientRect();
          const modalOpenedAndFitted =
            modal.open &&
            document.activeElement === dom.save_delete_cancel &&
            modalBounds.left >= 0 &&
            modalBounds.top >= 0 &&
            modalBounds.right <= window.innerWidth &&
            modalBounds.bottom <= window.innerHeight;
          const modalTextLocalized =
            dom.save_delete_title.textContent ===
              i18n.t("ui.settings.deleteSaveTitle") &&
            dom.save_delete_message.textContent ===
              i18n.t("ui.settings.deleteSaveConfirm") &&
            dom.save_delete_cancel.textContent ===
              i18n.t("ui.settings.cancelDelete") &&
            dom.save_delete_confirm.textContent ===
              i18n.t("ui.settings.confirmDelete");

          dom.save_delete_cancel.click();
          const cancelPreservedSave =
            !modal.open &&
            localStorage.getItem("v0.3") === "test-save" &&
            document.activeElement === dom.sl_kill;

          dom.sl_kill.click();
          modal.dispatchEvent(new Event("cancel", { cancelable: true }));
          const escapePreservedSave =
            !modal.open && localStorage.getItem("v0.3") === "test-save";

          dom.sl_kill.click();
          modal.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              clientX: modalBounds.left - 1,
              clientY: modalBounds.top - 1,
            }),
          );
          const backdropPreservedSave =
            !modal.open && localStorage.getItem("v0.3") === "test-save";
          localStorage.removeItem("v0.3");

          const localizedMiss =
            i18n.t("runtime.ui.interface.dialogue.combat_missed", {
              name: "Düşman",
            }) === "Düşman ıskaladı";

          document.documentElement.dataset.uiSafetyVerified = String(
            messageControlsFit &&
              emptyIndicatorsHidden &&
              backgroundPresetsSeparated &&
              themePreservedScale &&
              modalOpenedAndFitted &&
              modalTextLocalized &&
              cancelPreservedSave &&
              escapePreservedSave &&
              backdropPreservedSave &&
              localizedMiss,
          );
          document.documentElement.dataset.backgroundPresetsSeparated =
            String(backgroundPresetsSeparated);
          document.documentElement.dataset.saveDeleteModalVerified = String(
            modalOpenedAndFitted &&
              modalTextLocalized &&
              cancelPreservedSave &&
              escapePreservedSave &&
              backdropPreservedSave,
          );
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${uiSafetyProbe}</body>`));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-lore-panel.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const loreProbe = `<script>
        const loreProbe = setInterval(() => {
          if (!document.getElementById("ctrmg") || !dom.ct_bt6) return;
          if (typeof learnLore !== "function") return;
          clearInterval(loreProbe);

          // The journal button is inert until the journal is unlocked, which a
          // fresh game has not done yet.
          global.flags.jnlu = true;

          // Open the journal with nothing learned: the panel must still be
          // reachable and must say so rather than showing a blank box.
          dom.ct_bt6.click();
          document.getElementById("jcell3").click();
          const emptyState = Boolean(document.querySelector(".lore-open"));
          const emptyEntries = document.querySelectorAll(".lore-entry").length;
          dom.ct_bt6.click();

          // A clue, a question that gets answered, and a question left open.
          learnLore("itDigs", "whatDigs", "cameThrough", "whyTheEast");
          const stored = global.lore.slice();

          dom.ct_bt6.click();
          const tabLabel = document.getElementById("jcell3").textContent;
          document.getElementById("jcell3").click();

          const panel = document.querySelector(".lore-panel");
          const entries = [...document.querySelectorAll(".lore-entry")];
          const openRows = [...document.querySelectorAll(".lore-open")];
          const answers = [...document.querySelectorAll(".lore-entry--answer")];
          const questions = [
            ...document.querySelectorAll(".lore-entry--question"),
          ];
          const text = panel ? panel.textContent : "";

          const checks = {
            // Reachable as soon as the journal is, and honest when empty.
            emptyStateShown: emptyState && emptyEntries === 0,
            tabNamed: tabLabel.indexOf("?") !== 0 && tabLabel.length > 0,
            panelRendered: Boolean(panel),
            // Four learned: one clue, two questions, one answer.
            entryCount: entries.length === 4,
            questionCount: questions.length === 2,
            answerShown: answers.length === 1,
            // The unanswered question is marked as such; the answered one is not.
            openMarked: openRows.length === 1,
            // Nothing unlearned leaks in.
            noUnknownLeak:
              text.indexOf(lore.deinWasHere.name) === -1 &&
              text.indexOf(lore.theOrder.name) === -1,
            // Bound at definition time, so no raw keys on screen.
            noRawKeys: text.indexOf("content.lore.") === -1,
            fitsPanel:
              panel &&
              panel.getBoundingClientRect().bottom <=
                document.getElementById("ctrmg").getBoundingClientRect()
                  .bottom + 1,
            // Idempotent: revisiting a scene cannot record the same thing twice.
            idempotent:
              learnLore("itDigs") === false &&
              global.lore.length === stored.length,
          };

          document.documentElement.dataset.lorePanelVerified = String(
            Object.values(checks).every(Boolean),
          );
          document.documentElement.dataset.lorePanelFailures = Object.keys(checks)
            .filter((name) => !checks[name])
            .join(",");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${loreProbe}</body>`));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-cellar-story.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      // The damp cellar had never been reachable, so nothing had ever run a line
      // of it. This plays the whole side story rather than asserting the source
      // looks right: the gate on the boy's report, the darkness standing in for
      // the lamp that was taken, the descent itself -- which is the part that was
      // broken, because the population declared no weight and z_bake put NaN in
      // popc -- and the wall at the back.
      const cellarProbe = `<script>
        const cellarProbe = setInterval(() => {
          if (!document.getElementById("ctrmg")) return;
          if (typeof smove !== "function" || typeof learnLore !== "function")
            return;
          if (!window.chss || !chss.clgmn || !window.quest || !quest.chsls1)
            return;
          clearInterval(cellarProbe);

          const pick = (key) => {
            const want = i18n.t(key).trim();
            return [...document.querySelectorAll(".chs")].find(
              (el) => el.textContent.trim() === want,
            );
          };
          const said = (key) => {
            const el = document.getElementById("chs");
            const head = i18n.t(key).split("<br>")[0];
            return Boolean(el) && el.textContent.indexOf(head) !== -1;
          };
          const checks = {};

          // No area may bake NaN into its spawn table. area.clg did, and every
          // comparison in area_init against NaN is false, so the descent could
          // only ever have fallen through in silence.
          checks.noNaNWeights = Object.keys(area).every((key) =>
            (area[key].popc || []).every((pair) =>
              pair.every((n) => typeof n === "number" && !Number.isNaN(n)),
            ),
          );

          // The boy's line lives inside the Chapter III market rumours, so the
          // lore entry is the gate rather than a flag of its own.
          smove(chss.mrktvg1);
          checks.hiddenBeforeLore = !pick(
            "runtime.world.locations.dialogue.ask_the_boy_which_cellar",
          );

          learnLore("lockedCellar");
          smove(chss.mrktvg1);
          const ask = pick(
            "runtime.world.locations.dialogue.ask_the_boy_which_cellar",
          );
          checks.offeredAfterLore = Boolean(ask);
          if (ask) ask.click();

          const accept = pick(
            "runtime.world.locations.dialogue.go_and_see_for_him",
          );
          checks.accountThenAccept =
            said("runtime.world.locations.dialogue.boy_cellar_account") &&
            Boolean(accept);
          if (accept) accept.click();

          checks.questStarted = quest.chsls1.data.started === true;
          // Nine rooms, set when he asks, because every existing save restores
          // the authored 33 out of its positional slot.
          checks.descentSized = area.clg.size === 9;
          checks.inCellar = global.current_l === chss.clgmn;

          // The lamp that hung by the stair is one of the things that went. With
          // no light of their own the player is told exactly that, and no fight
          // starts.
          checks.darkWithoutLight =
            said("runtime.world.locations.dialogue.joiners_cellar_dark") &&
            global.flags.btl === false;

          // With a light the descent has to actually produce a fight, which is
          // the whole point of the popc repair.
          you.mods.light = 1;
          smove(chss.clgmn);
          checks.fightStarts = global.flags.btl === true;
          checks.rightCreature =
            global.current_m.id === creature.bat.id ||
            global.current_m.id === creature.spd1.id;

          // Cleared the way finishing the last room clears it.
          area.clg.size = 0;
          area.clg.onEnd();
          checks.clearedRecorded = quest.chsls1.data.cleared === true;
          checks.quietWhenCleared = said(
            "runtime.world.locations.dialogue.joiners_cellar_quiet",
          );

          const wall = pick(
            "runtime.world.locations.dialogue.examine_the_back_wall",
          );
          checks.wallOffered = Boolean(wall);
          if (wall) wall.click();
          checks.wallSeen = quest.chsls1.data.wall === true;
          checks.loreLearned = knowsLore(lore.towardTheWell.id);

          const tell = pick(
            "runtime.world.locations.dialogue.go_up_and_tell_his_father",
          );
          checks.fatherOffered = Boolean(tell);
          if (tell) tell.click();
          checks.questDone =
            quest.chsls1.data.done === true &&
            quest.chsls1.data.started === false;
          // Both goal lines have to render, in the finished form the journal uses
          // for a completed quest, with no raw keys left in them.
          const lines = quest.chsls1.goalsf();
          checks.goalsRender =
            lines.length === 2 &&
            lines.every((line) => line.indexOf("content.quest.") === -1);

          // The user walked into this at a level the area was never written for and
          // was left in a room with no buttons at all. Reproduce their conditions
          // exactly: a levelled character, the real accept path, and then assert
          // the invariant that actually matters -- a scene must never render
          // neither a fight nor a way out.
          const stranded = [];
          for (const lvl of [1, 12, 34, 60]) {
            quest.chsls1.data = { t: 0, cleared: false, wall: false };
            global.flags.clgdown = false;
            if (you.lvl < lvl) lvlup(you, lvl - you.lvl);
            you.mods.light = 1;
            area.clg.size = 9;
            smove(chss.clgmn, false);
            const fighting = global.flags.btl === true;
            const ways = document.querySelectorAll(".chs").length;
            if (!fighting && ways === 0)
              stranded.push("lvl" + you.lvl + ":nofight+noexit");
            if (!fighting) stranded.push("lvl" + you.lvl + ":nofight");
            // And a spent cellar must still let them climb the stair.
            area.clg.size = 0;
            smove(chss.clgmn, false);
            if (document.querySelectorAll(".chs").length === 0)
              stranded.push("lvl" + you.lvl + ":spent+noexit");
          }
          checks.neverStranded = stranded.length === 0;
          // The net in smove must not be doing the work. If it fired during any of
          // the walking above, a scene is failing to offer its own exits and that
          // is the thing to fix, not the net.
          checks.netNeverFired = !global.stat.strandc;
          // The north. The road is gated on the cellar clue, so the region has to be
          // invisible before that and reachable after it -- and the fields must be an
          // area that actually spawns, which is the exact failure the damp cellar
          // shipped with.
          global.lore = [];
          global.regions = [];
          smove(chss.lsmain1);
          checks.northHiddenBeforeClue = !pick(
            "runtime.world.locations.dialogue.take_the_north_road",
          );
          learnLore("towardTheWell");
          smove(chss.lsmain1);
          const road = pick(
            "runtime.world.locations.dialogue.take_the_north_road",
          );
          checks.northOpensOnClue = Boolean(road);
          if (road) road.click();
          checks.atTheWell = global.current_l === chss.nrd1;

          const draw = pick("runtime.world.locations.dialogue.draw_from_the_well");
          checks.wellOffered = Boolean(draw);
          if (draw) draw.click();
          checks.wellClueLearned = knowsLore(lore.stoneDust.id);
          smove(chss.nrd1, false);
          // Read once. A clue you can keep discovering is not a clue.
          checks.wellReadOnce = !pick(
            "runtime.world.locations.dialogue.draw_from_the_well",
          );

          const onward = pick(
            "runtime.world.locations.dialogue.go_on_to_the_fields",
          );
          checks.fieldsReachable = Boolean(onward);
          if (onward) onward.click();
          checks.atTheFields = global.current_l === chss.nfld1;
          const walkOut = pick(
            "runtime.world.locations.dialogue.walk_out_into_the_stubble",
          );
          checks.stubbleOffered = Boolean(walkOut);
          if (walkOut) walkOut.click();
          checks.fieldSpawns = global.flags.btl === true;
          checks.fieldCreature =
            global.current_m.id === creature.rbt1.id ||
            global.current_m.id === creature.slm1.id ||
            global.current_m.id === creature.slm2.id;
          // And the new region lands on the journal page that was added for it.
          checks.fieldRecorded = global.regions.indexOf(area.nfld1.id) !== -1;
          // The notice on the board follows the same clue.
          smove(chss.mbrd);
          checks.noticePosted = Boolean(
            pick("runtime.world.locations.dialogue.notice_harvest_hands"),
          );

          // The far field, and the scarecrow that has been statted and unreachable
          // since before this fork.
          smove(chss.nfld1);
          const far = pick("runtime.world.locations.dialogue.on_to_the_far_field");
          checks.farFieldReachable = Boolean(far);
          if (far) far.click();
          checks.atTheFarField = global.current_l === chss.nfld2;

          const figure = pick("runtime.world.locations.dialogue.examine_a_figure");
          checks.figureOffered = Boolean(figure);
          if (figure) figure.click();
          checks.strawClueLearned = knowsLore(lore.strawBound.id);
          smove(chss.nfld2, false);
          checks.figureReadOnce = !pick(
            "runtime.world.locations.dialogue.examine_a_figure",
          );

          const among = pick(
            "runtime.world.locations.dialogue.go_in_among_the_figures",
          );
          checks.figuresEnterable = Boolean(among);
          if (among) among.click();
          checks.farFieldSpawns = global.flags.btl === true;
          checks.scarecrowOrSlime =
            global.current_m.id === creature.kksh.id ||
            global.current_m.id === creature.slm2.id;
          // Its drop table was a slime's -- water, slime, jelly -- which is what a
          // straw figure is least likely to be carrying.
          checks.scarecrowDropsStraw = creature.kksh.drop.some(
            (d) => d.item === item.sstraw,
          );
          checks.scarecrowNoSlimeLoot = !creature.kksh.drop.some(
            (d) => d.item === item.slm || d.item === item.jll,
          );

          // The mill, and the arc that closes the north.
          smove(chss.nrd1);
          const toMill = pick(
            "runtime.world.locations.dialogue.follow_the_water_to_the_mill",
          );
          checks.millReachable = Boolean(toMill);
          if (toMill) toMill.click();
          checks.atTheMill = global.current_l === chss.nmill;

          const takeWork = pick(
            "runtime.world.locations.dialogue.take_the_millers_work",
          );
          checks.millerHiring = Boolean(takeWork);
          if (takeWork) takeWork.click();
          checks.harvestStarted = quest.hrvst1.data.started === true;
          // Not finishable before the work is done.
          checks.notPayableEarly = !pick(
            "runtime.world.locations.dialogue.tell_him_it_is_done",
          );

          // The counter is a real onDeath hook, so drive it the way a kill does.
          for (let i = 0; i < quest.hrvst1.data.needed + 3; i++)
            callback.onDeath.fire(creature.kksh);
          // It must stop at the target rather than run past it.
          checks.counterCaps =
            quest.hrvst1.data.cleared === quest.hrvst1.data.needed;
          // And nothing else may advance it.
          const atTarget = quest.hrvst1.data.cleared;
          callback.onDeath.fire(creature.rbt1);
          checks.counterIgnoresOthers = quest.hrvst1.data.cleared === atTarget;

          smove(chss.nmill, false);
          const payUp = pick(
            "runtime.world.locations.dialogue.tell_him_it_is_done",
          );
          checks.millerPays = Boolean(payUp);
          if (payUp) payUp.click();
          checks.harvestDone =
            quest.hrvst1.data.done === true &&
            quest.hrvst1.data.started === false;
          // Finishing the north is what opens the way to the hills, and the mine.
          checks.hillsRoadOpened = global.flags.hillsroad === true;
          // The hook has to be gone, or a later kill still counts.
          const afterReward = quest.hrvst1.data.cleared;
          callback.onDeath.fire(creature.kksh);
          checks.hookDetached = quest.hrvst1.data.cleared === afterReward;

          // The drain only shows itself once the player knows a hunter asked about it.
          global.lore = global.lore.filter((id) => id !== 24 && id !== 30);
          smove(chss.nmill, false);
          checks.drainHiddenBeforeDein = !pick(
            "runtime.world.locations.dialogue.look_for_the_old_drain",
          );
          learnLore("secondWayIn");
          smove(chss.nmill, false);
          const drain = pick(
            "runtime.world.locations.dialogue.look_for_the_old_drain",
          );
          checks.drainFindable = Boolean(drain);
          if (drain) drain.click();
          checks.drainClueLearned = knowsLore(lore.millDrain.id);

          // The grain store the market remembers wolves getting into.
          smove(chss.nmill, false);
          const store = pick("runtime.world.locations.dialogue.to_the_grain_store");
          checks.grainStoreReachable = Boolean(store);
          if (store) store.click();
          const after = pick("runtime.world.locations.dialogue.go_in_after_them");
          checks.grainStoreEnterable = Boolean(after);
          if (after) after.click();
          checks.grainStoreSpawns = global.flags.btl === true;
          checks.grainStoreCreature =
            global.current_m.id === creature.wolf1.id ||
            global.current_m.id === creature.rbt1.id;

          // The mine. The road opens on the harvest, the mouth opens on the pickaxe,
          // and the Mining skill has had no grant path at all until now.
          global.flags.hillsroad = false;
          global.flags.mineopen = false;
          smove(chss.nmill, false);
          checks.hillsHiddenBeforeHarvest = !pick(
            "runtime.world.locations.dialogue.up_the_road_to_the_hills",
          );
          global.flags.hillsroad = true;
          smove(chss.nmill, false);
          const hills = pick(
            "runtime.world.locations.dialogue.up_the_road_to_the_hills",
          );
          checks.hillsReachable = Boolean(hills);
          if (hills) hills.click();
          checks.atTheHills = global.current_l === chss.nhill;

          // Bare-handed, the fall stays where it is.
          const openEmpty = pick(
            "runtime.world.locations.dialogue.clear_the_mine_mouth",
          );
          checks.mouthOfferedAlways = Boolean(openEmpty);
          if (openEmpty) openEmpty.click();
          checks.mouthNeedsTool = global.flags.mineopen !== true;

          // The smith is the only source, so buy it the way a player would.
          // Put it in hand directly rather than driving the inventory UI, which is
          // not what is under test here and throws when its panel is not rendered.
          // oneq is still the thing being exercised: it is what sets the mod the
          // mine reads.
          giveItem(wpn.pck);
          you.eqp[0] = wpn.pck;
          wpn.pck.oneq();
          checks.pickaxeSetsMod = you.mods.mine > 0;
          smove(chss.nhill, false);
          const openTool = pick(
            "runtime.world.locations.dialogue.clear_the_mine_mouth",
          );
          if (openTool) openTool.click();
          checks.mouthOpens = global.flags.mineopen === true;
          checks.mineClueLearned = knowsLore(lore.mineWorked.id);

          smove(chss.nhill, false);
          const adit = pick("runtime.world.locations.dialogue.go_down_the_adit");
          checks.aditReachable = Boolean(adit);
          you.mods.light = 0;
          if (adit) adit.click();
          // Dark, and the cellar has already taught the player that is a real state.
          checks.aditDarkWithoutLight = !pick(
            "runtime.world.locations.dialogue.work_the_coal_face",
          );
          you.mods.light = 1;
          smove(chss.mine1, false);
          const face = pick("runtime.world.locations.dialogue.work_the_coal_face");
          checks.faceWorkable = Boolean(face);

          // The skill this whole region exists to switch on.
          const beforeExp = skl.mng.exp || 0;
          const beforeDp = you.eqp[0].dp;
          if (face) face.click();
          checks.miningTrains = (skl.mng.exp || 0) > beforeExp || skl.mng.lvl > 0;
          checks.diggingCostsTheTool = you.eqp[0].dp < beforeDp;

          // Run it to nothing and it must refuse rather than go negative.
          for (let i = 0; i < 60; i++) workTheFace();
          checks.pickaxeBottomsOut = you.eqp[0].dp === 0;
          workTheFace();
          checks.spentToolRefuses = you.eqp[0].dp === 0;

          smove(chss.mine1, false);
          const deeper = pick(
            "runtime.world.locations.dialogue.go_deeper_into_the_workings",
          );
          checks.workingsEnterable = Boolean(deeper);
          if (deeper) deeper.click();
          checks.mineSpawns = global.flags.btl === true;
          checks.mineCreature =
            global.current_m.id === creature.cbat.id ||
            global.current_m.id === creature.spd1.id;

          // The furniture list. A furnished house pushed its rows straight out of the
          // panel and over the Return choice underneath. Stock the house well past what
          // fits, open the panel the way the scene opens it, and measure.
          for (const key of Object.keys(furniture))
            if (furniture[key].id !== undefined) giveFurniture(furniture[key]);
          smove(chss.home);
          chs_spec(2);
          // The scene draws its own exit after the panel; do the same so the geometry
          // being measured is the geometry the player gets.
          const furnDoor = chs(
            i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
            false,
            "",
            "",
            null,
            null,
            null,
            true,
          );
          const box = dom.ch_1;
          const list = dom.ch_1h;
          checks.furnitureListOpens = Boolean(box && list);
          checks.furnitureScrolls =
            Boolean(list) &&
            list.scrollHeight > list.clientHeight &&
            list.getBoundingClientRect().bottom <=
              box.getBoundingClientRect().bottom + 1;
          // Deliberately not asserting where the exit lands relative to the box. The
          // check that matters is furnitureScrolls: the list now stays inside the panel
          // instead of spilling past it, which is what was burying the exit. Measuring
          // the gap as well needs a tolerance I would be guessing at.
          void furnDoor;

          // The regions page. It only means anything if standing somewhere records it,
          // if the tab renders, and if a creature the player has never killed stays
          // masked -- that masking is the whole point of the page.
          global.flags.jnlu = true;
          // Cleared first: the walk above already visited the cellar several times, so
          // measuring growth without resetting would measure nothing.
          global.regions = [];
          const before = global.regions.length;
          you.mods.light = 1;
          area.clg.size = 9;
          smove(chss.clgmn, false);
          checks.regionRecorded =
            global.regions.length > before &&
            global.regions.indexOf(area.clg.id) !== -1;
          checks.benchNotRecorded = global.regions.indexOf(area.tst.id) === -1;

          dom.ct_bt6.click();
          const regionTab = document.getElementById("jcell6");
          checks.regionTabExists = Boolean(regionTab);
          if (regionTab) regionTab.click();
          const regionPanel = document.querySelector(".lore-panel");
          const regionText = regionPanel ? regionPanel.textContent : "";
          checks.regionPanelRendered =
            Boolean(regionPanel) &&
            regionText.indexOf(area.clg.name) !== -1 &&
            regionText.indexOf("ui.panels.") === -1;
          // clg holds bats and attic spiders; nothing has been killed in this probe,
          // so both have to be masked rather than named.
          checks.unkilledMasked =
            regionText.indexOf(creature.bat.name) === -1 &&
            regionText.indexOf(creature.spd1.name) === -1 &&
            regionText.indexOf(i18n.t("ui.panels.regionsUnknown")) !== -1;
          checks.regionPanelFits =
            regionPanel &&
            regionPanel.getBoundingClientRect().bottom <=
              document.getElementById("ctrmg").getBoundingClientRect().bottom + 1;
          dom.ct_bt6.click();

          // Every vendor line must price to a real number. The Vendor constructor
          // carries a comment about the child trader, whose shop had no inflation
          // multiplier, so every price resolved to NaN -- and NaN compares false, so
          // the can-you-afford-it check passed and paying turned the purse into NaN.
          // This walks all of them rather than only the new one.
          const badPrices = [];
          for (const key of Object.keys(vendor)) {
            const v = vendor[key];
            restock(v);
            for (const line of v.stock || [])
              if (!Number.isFinite(Number(line[1])) || Number(line[1]) <= 0)
                badPrices.push(key + ":" + (line[0] && line[0].name));
            for (const supply of v.items || [])
              if (!Number.isFinite(Number(supply.p)) || !supply.item)
                badPrices.push(key + ":supply");
          }
          checks.vendorPricesReal = badPrices.length === 0;
          document.documentElement.dataset.cellarBadPrices = badPrices.join(",");
          // And the smith actually has stock to show, since he sold nothing at all
          // before this.
          checks.smithSells =
            Boolean(vendor.smith) && (vendor.smith.items || []).length > 0;

          document.documentElement.dataset.cellarNetFires = String(
            global.stat.strandc || 0,
          );

          // The one dimension a fresh game cannot cover: the player accepted, the
          // game saved, and they came back. Area sizes are the part of the save
          // that restores by position, so this is where a wired-in area is most
          // likely to come back wrong.
          quest.chsls1.data = { t: 0, cleared: false, wall: false, started: true };
          area.clg.size = 9;
          const roundTrip = save(true);
          area.clg.size = 0;
          load(roundTrip);
          const restored = area.clg.size;
          you.mods.light = 1;
          smove(chss.clgmn, false);
          const afterLoadFight = global.flags.btl === true;
          const afterLoadWays = document.querySelectorAll(".chs").length;
          checks.survivesReload =
            restored === 9 && (afterLoadFight || afterLoadWays > 0);
          document.documentElement.dataset.cellarReload =
            "size=" + restored + ",fight=" + afterLoadFight + ",ways=" + afterLoadWays;

          // Put the quest back the way the walk-through left it so the last
          // assertion measures the product rather than this loop.
          quest.chsls1.data.started = false;
          quest.chsls1.data.done = true;


          document.documentElement.dataset.cellarStrandDetail = stranded.join(",");

          // And it must not be on offer a second time.
          smove(chss.mrktvg1);
          checks.notRepeatable = !pick(
            "runtime.world.locations.dialogue.ask_the_boy_which_cellar",
          );

          document.documentElement.dataset.cellarStoryVerified = String(
            Object.values(checks).every(Boolean),
          );
          document.documentElement.dataset.cellarStoryFailures = Object.keys(
            checks,
          )
            .filter((name) => !checks[name])
            .join(",");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${cellarProbe}</body>`));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-stone-plate.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      // creature.lrck had eleven fields, no area and no scene, and 9000 health
      // behind a battle_ai that never takes its turn. This plays what it became:
      // a slab in the western corridor that only opens up for a player who has
      // already searched the catacombs and found a chisel handle in a heap.
      const plateProbe = `<script>
        const plateProbe = setInterval(() => {
          if (!document.getElementById("ctrmg")) return;
          if (typeof smove !== "function" || typeof learnLore !== "function")
            return;
          if (!window.chss || !chss.cata17 || !area.lrck1) return;
          clearInterval(plateProbe);

          const pick = (key) => {
            const want = i18n.t(key).trim();
            return [...document.querySelectorAll(".chs")].find(
              (el) => el.textContent.trim() === want,
            );
          };
          const said = (key) => {
            const el = document.getElementById("chs");
            const head = i18n.t(key).split("<br>")[0];
            return Boolean(el) && el.textContent.indexOf(head) !== -1;
          };
          const checks = {};

          // Areas are saved by position and read back by position, so anything
          // inserted above an existing area silently reassigns every later size.
          // The new one has to be last, and the ones that were already there have
          // to be where they were.
          // Pinned slots rather than "which one is last". The invariant the save format
          // needs is that an area which already existed keeps its position, and every
          // new one goes on the end -- so appending leaves these numbers alone, while
          // inserting anywhere above them moves one and fails here. Asserting that
          // lrck1 is last only held until the next area was appended after it.
          const order = Object.keys(area);
          checks.clgKeepsItsSlot = order.indexOf("clg") === 6;
          checks.cata5aKeepsItsSlot = order.indexOf("cata5a") === 23;
          checks.lrckKeepsItsSlot = order.indexOf("lrck1") === 24;

          // A wall, not a fight: it never takes its turn, and the health is a
          // slab's thickness rather than the authored 9000.
          checks.doesNotFight = creature.lrck.battle_ai() === false;
          checks.setPieceHealth =
            creature.lrck.hp_r > 0 && creature.lrck.hp_r <= 2000;
          // Bring the right tool. Blunt gets through; an edge skates off; a point
          // finds nothing to open.
          checks.bluntIsBest =
            creature.lrck.cls[0] < creature.lrck.cls[1] &&
            creature.lrck.cls[1] < creature.lrck.cls[2];
          // Construct, and level barely moves it.
          checks.construct = creature.lrck.ctype === 2;
          checks.barelyScales = creature.lrck.stat_p[0] <= 0.2;

          // Optional and earned. Until the sector's scout table has turned up the
          // heap with a chisel handle in it, the slab is just a wall.
          you.mods.light = 1;
          sector.cata1.data.gets[3] = false;
          smove(chss.cata17);
          checks.hiddenBeforeTools = !pick(
            "runtime.world.locations.dialogue.look_at_the_stone_plate",
          );

          sector.cata1.data.gets[3] = true;
          smove(chss.cata17);
          const look = pick(
            "runtime.world.locations.dialogue.look_at_the_stone_plate",
          );
          checks.offeredAfterTools = Boolean(look);
          if (look) look.click();

          const breakIt = pick("runtime.world.locations.dialogue.break_it_open");
          checks.examinedThenBreak =
            said("runtime.world.locations.dialogue.stone_plate_examined") &&
            Boolean(breakIt);
          // Walking away has to be an option, and has to work.
          checks.canLeaveItAlone = Boolean(
            pick("runtime.world.locations.dialogue.leave_it_alone"),
          );
          if (breakIt) breakIt.click();

          checks.fightStarts = global.flags.btl === true;
          checks.rightCreature = global.current_m.id === creature.lrck.id;

          // Broken the way the last swing breaks it.
          area.lrck1.size = 0;
          area.lrck1.onEnd();
          checks.backInTheRoom = global.current_l === chss.cata17;
          // A wall that has been broken stays broken, so the size is not restored
          // the way area.cata5a restores its encounter.
          checks.staysBroken = area.lrck1.size <= 0;
          checks.slabGoneFromChoices = !pick(
            "runtime.world.locations.dialogue.look_at_the_stone_plate",
          );

          const passage = pick("runtime.world.locations.dialogue.the_cut_passage");
          checks.passageOffered = Boolean(passage);
          if (passage) passage.click();
          checks.passageDescribed = said(
            "runtime.world.locations.dialogue.stone_plate_opened",
          );
          checks.loreLearned =
            knowsLore(lore.toolMarks.id) && knowsLore(lore.whoseHand.id);
          // The chisel marks and the hunter's route mark are two different
          // signatures and must not have been written as one.
          checks.distinctFromHunterMark =
            i18n
              .t("content.lore.toolMarks.desc")
              .indexOf(i18n.t("content.lore.threeAndAcross.name")) === -1;

          document.documentElement.dataset.stonePlateVerified = String(
            Object.values(checks).every(Boolean),
          );
          document.documentElement.dataset.stonePlateFailures = Object.keys(
            checks,
          )
            .filter((name) => !checks[name])
            .join(",");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${plateProbe}</body>`));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-window-panels.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      // Every panel rendered into #ctrm_2 asked for a percentage of a container
      // with no height, so each grew with its contents instead of scrolling and
      // pushed the choices below it off the bottom of the screen.
      const windowPanelProbe = `<script>
        const windowPanelProbe = setInterval(() => {
          const gameWindow = document.getElementById("ctrmg");
          if (!gameWindow || typeof chs_spec !== "function") return;
          if (typeof giveItem !== "function" || typeof restock !== "function")
            return;
          clearInterval(windowPanelProbe);

          // Far more items than any of these panels can show at once.
          const stock = Object.keys(item)
            .map((key) => item[key])
            .filter((entry) => entry && entry.id && entry.name)
            .slice(0, 70);
          for (const entry of stock) giveItem(entry, 2);

          const windowBounds = gameWindow.getBoundingClientRect();
          const results = {};

          function measure(name, panel, lists) {
            const bounds = panel.getBoundingClientRect();
            results[name] = {
              fits: bounds.bottom <= windowBounds.bottom + 1,
              scrolls: lists.some(
                (list) => list.scrollHeight > list.clientHeight + 1,
              ),
              clipped: lists.every(
                (list) =>
                  list.getBoundingClientRect().bottom <= bounds.bottom + 1,
              ),
            };
          }

          restock(vendor.grc1);
          chs_spec(4, vendor.grc1);
          // The grocer's own stock is short enough to fit, and giveItem above
          // filled the player's bag rather than the shelf, so the shelf is padded
          // here to get past the point where it has to scroll.
          for (let extra = 0; extra < 60; extra++)
            rendershopitem(dom.ch_1h, vendor.grc1.stock[0], vendor.grc1);
          measure("shop", dom.ch_1, [dom.ch_1h]);

          chs_spec(3, { c: [], name: "box" });
          measure("trunk", dom.ch_1a, [dom.invp1, dom.invp2]);

          const failures = [];
          for (const name of Object.keys(results))
            for (const check of Object.keys(results[name]))
              if (!results[name][check]) failures.push(name + ":" + check);

          document.documentElement.dataset.windowPanelsVerified = String(
            failures.length === 0 && Object.keys(results).length === 2,
          );
          document.documentElement.dataset.windowPanelFailures =
            failures.join(",");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${windowPanelProbe}</body>`));
      return;
    }

    if (
      options.enableTestRoutes &&
      pathname === "/__test-inventory-bars.html"
    ) {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const inventoryProbe = `<script>
        const inventoryBarsProbe = setInterval(() => {
          const panel = document.getElementById("inv");
          const list = document.getElementById("inv_con");
          if (!document.getElementById("ctrmg") || !panel || !list) return;
          if (typeof giveItem !== "function" || typeof isort !== "function") return;
          clearInterval(inventoryBarsProbe);

          panel.style.display = "";

          // Long enough that the list cannot possibly fit, which is when the
          // filter row used to scroll off the top and the sort bar got buried.
          const stock = Object.keys(item)
            .map((key) => item[key])
            .filter((entry) => entry && entry.id && entry.name)
            .slice(0, 60);
          for (const entry of stock) giveItem(entry, 3);
          isort(1);

          const filters = document.getElementById("inv_control");
          const bottom = document.getElementById("inv_control_b");
          const money = document.getElementById("mn");

          const panelBounds = panel.getBoundingClientRect();
          const filterBounds = filters.getBoundingClientRect();
          const listBounds = list.getBoundingClientRect();
          const bottomBounds = bottom.getBoundingClientRect();
          const moneyBounds = money.getBoundingClientRect();

          const rowCount = list.children.length;
          // Both bars fully inside the panel, and the list strictly between them.
          const filtersVisible =
            filterBounds.top >= panelBounds.top - 0.5 &&
            filterBounds.bottom <= panelBounds.bottom + 0.5 &&
            filterBounds.height > 0;
          const bottomVisible =
            bottomBounds.bottom <= panelBounds.bottom + 0.5 &&
            bottomBounds.top >= panelBounds.top - 0.5 &&
            bottomBounds.height > 0;
          const listBetweenBars =
            listBounds.top >= filterBounds.bottom - 0.5 &&
            listBounds.bottom <= bottomBounds.top + 0.5;
          // The list scrolls inside itself rather than scrolling the panel.
          const listScrolls = list.scrollHeight > list.clientHeight + 1;
          const panelDoesNotScroll =
            panel.scrollHeight <= panel.clientHeight + 1;
          // Scrolling the list to the end must not move either bar.
          list.scrollTop = list.scrollHeight;
          const barsHeldAfterScroll =
            Math.abs(
              filters.getBoundingClientRect().top - filterBounds.top,
            ) <= 0.5 &&
            Math.abs(
              bottom.getBoundingClientRect().bottom - bottomBounds.bottom,
            ) <= 0.5;
          const moneyInsideBar =
            moneyBounds.right <= bottomBounds.right + 0.5 &&
            moneyBounds.top >= bottomBounds.top - 0.5 &&
            moneyBounds.bottom <= bottomBounds.bottom + 0.5;

          const checks = {
            filtersVisible,
            bottomVisible,
            listBetweenBars,
            listScrolls,
            panelDoesNotScroll,
            barsHeldAfterScroll,
            moneyInsideBar,
          };
          document.documentElement.dataset.inventoryBarsVerified = String(
            Object.values(checks).every(Boolean) && rowCount >= 20,
          );
          document.documentElement.dataset.inventoryBarsFailures = Object.keys(
            checks,
          )
            .filter((name) => !checks[name])
            .concat(rowCount >= 20 ? [] : ["rows=" + rowCount])
            .join(",");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${inventoryProbe}</body>`));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-release-notes.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      // Written before the load event fires, so startGame() sees a player whose
      // last visit was an older build.
      const releaseNotesProbe = `<script>
        localStorage.setItem("proto23.seenversion", "475");
        const releaseNotesProbe = setInterval(() => {
          if (!document.getElementById("ctrmg")) return;
          clearInterval(releaseNotesProbe);

          const dialogs = [...document.querySelectorAll("dialog.game-modal")];
          const notice = dialogs.find((dialog) =>
            dialog.querySelector(".release-notes__list"),
          );
          const shown = Boolean(notice && notice.open);
          const items = notice
            ? notice.querySelectorAll(".release-notes__list li").length
            : 0;
          const buttons = notice
            ? notice.querySelectorAll(".game-modal__button")
            : [];
          const localized =
            notice &&
            notice.textContent.includes("475") &&
            notice.textContent.includes("v477");
          // A notice has nothing to cancel, and nothing destructive to warn about.
          const singleNeutralButton =
            buttons.length === 1 &&
            !buttons[0].className.includes("--danger") &&
            document.activeElement === buttons[0];
          const fits =
            notice &&
            notice.getBoundingClientRect().top >= 0 &&
            notice.getBoundingClientRect().bottom <= window.innerHeight + 1;
          // The version is recorded before rendering, so it never repeats. What is
          // stored is the version CODE, major * 1000 + point release, because a
          // decimal would sort 478.10 below 478.9.
          const recorded =
            localStorage.getItem("proto23.seenversion") ===
            String(global.ver * 1000 + global.subver);
          // The value this probe wrote was a bare major, which is what every build
          // before point releases existed stored. It has to be promoted rather than
          // read as a code, or a returning player is told about every release there
          // has ever been -- and the notice above proves it was read as v475 and not
          // as something in the year 475000.
          const promoted = notice && notice.textContent.includes("475");

          const checks = {
            shown,
            localized,
            singleNeutralButton,
            fits,
            recorded,
            promoted,
          };
          document.documentElement.dataset.releaseNotesVerified = String(
            Object.values(checks).every(Boolean) && items >= 3,
          );
          document.documentElement.dataset.releaseNotesFailures = Object.keys(
            checks,
          )
            .filter((name) => !checks[name])
            .concat(items >= 3 ? [] : ["items=" + items])
            .join(",");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${releaseNotesProbe}</body>`));
      return;
    }

    if (options.enableTestRoutes && pathname === "/__test-shop-layout.html") {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const shopLayoutProbe = `<script>
        const shopLayoutProbe = setInterval(() => {
          if (
            !document.getElementById("ctrmg") ||
            typeof chs_spec !== "function" ||
            typeof rendershopitem !== "function" ||
            typeof restock !== "function" ||
            typeof vendor === "undefined" ||
            !vendor.grc1
          ) return;
          clearInterval(shopLayoutProbe);

          // Stock is generated when a vendor restocks, so a fresh game has none.
          restock(vendor.grc1);
          chs_spec(4, vendor.grc1);

          const panel = dom.ch_1.getBoundingClientRect();
          const list = dom.ch_1h.getBoundingClientRect();
          const footer = dom.ch_1c.getBoundingClientRect();
          const price = dom.ch_1e.getBoundingClientRect();
          const reputation = dom.ch_2e.getBoundingClientRect();

          // The readouts belong on the bottom edge of the shop panel, directly
          // below the stock list rather than floating short of it.
          const footerOnBottom = Math.abs(footer.bottom - panel.bottom) <= 1;
          const footerBelowList = Math.abs(footer.top - list.bottom) <= 1;
          const footerVisible = footer.height >= 8;
          const readoutsInside =
            price.left >= footer.left - 1 &&
            price.bottom <= footer.bottom + 1 &&
            reputation.right <= footer.right + 1 &&
            reputation.bottom <= footer.bottom + 1;
          const readoutsSeparated = price.right <= reputation.left;
          const priceShown = dom.ch_1e.textContent.includes("%");
          const reputationShown = dom.ch_2e.textContent.trim().length > 0;

          // A shop with more stock than fits must scroll inside the list instead
          // of pushing the footer out of the panel.
          for (let extra = 0; extra < 60; extra++)
            rendershopitem(dom.ch_1h, vendor.grc1.stock[0], vendor.grc1);
          const grownPanel = dom.ch_1.getBoundingClientRect();
          const grownFooter = dom.ch_1c.getBoundingClientRect();
          const footerHeldBottom =
            Math.abs(grownFooter.bottom - grownPanel.bottom) <= 1;
          const listScrolls =
            dom.ch_1h.scrollHeight > dom.ch_1h.clientHeight + 1;

          const checks = {
            footerOnBottom,
            footerBelowList,
            footerVisible,
            readoutsInside,
            readoutsSeparated,
            priceShown,
            reputationShown,
            footerHeldBottom,
            listScrolls,
          };
          document.documentElement.dataset.shopLayoutVerified = String(
            Object.values(checks).every(Boolean),
          );
          document.documentElement.dataset.shopLayoutFailures = Object.keys(
            checks,
          )
            .filter((name) => !checks[name])
            .join(",");
          const parent = dom.ch_1.parentElement;
          document.documentElement.dataset.shopLayoutMetrics = [
            "panelClient=" + dom.ch_1.clientHeight,
            "parentClient=" + parent.clientHeight,
            "parentStyleHeight=" + getComputedStyle(parent).height,
            "parentInline=" + (parent.style.height || "(none)"),
            "panelStyleHeight=" + getComputedStyle(dom.ch_1).height,
            "listClient=" + dom.ch_1h.clientHeight,
            "listScroll=" + dom.ch_1h.scrollHeight,
            "rows=" + dom.ch_1h.children.length,
            "parentId=" + (parent.id || "(none)"),
          ].join(" ");
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${shopLayoutProbe}</body>`));
      return;
    }

    if (
      options.enableTestRoutes &&
      pathname === "/__test-save-delete-reload.html"
    ) {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const saveDeleteReloadProbe = `<script>
        const saveDeleteReloadProbe = setInterval(() => {
          if (
            !document.getElementById("ctrmg") ||
            !dom.sl_kill ||
            !dom.save_delete_confirm
          ) return;
          clearInterval(saveDeleteReloadProbe);

          const phaseKey = "test.save-delete-reload.phase";
          if (sessionStorage.getItem(phaseKey) === "awaiting-reload") {
            sessionStorage.removeItem(phaseKey);
            document.documentElement.dataset.saveDeleteReloaded = String(
              localStorage.getItem("v0.3") === null &&
                localStorage.getItem("proto23.locale") === "tr" &&
                global.flags.gameone === false &&
                global.lst_loc === 101 &&
                global.current_l === chss.t1,
            );
            return;
          }

          localStorage.setItem("v0.3", "test-save");
          localStorage.setItem("proto23.locale", "tr");
          sessionStorage.setItem(phaseKey, "awaiting-reload");
          dom.sl_kill.click();
          dom.save_delete_confirm.click();
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${saveDeleteReloadProbe}</body>`));
      return;
    }

    if (
      options.enableTestRoutes &&
      pathname === "/__test-calendar-locale.html"
    ) {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const calendarProbe = `<script>
        const calendarLocaleProbe = setInterval(() => {
          if (
            !document.getElementById("ctrmg") ||
            typeof isDay !== "function" ||
            typeof getDay !== "function"
          ) return;
          clearInterval(calendarLocaleProbe);
          const previousDay = time.day;
          time.day = 6;
          document.documentElement.dataset.calendarLocaleSafe = String(
            isDay(6) && getDay(1) === "Pazar" && getDay(2) === "Paz.",
          );
          time.day = previousDay;
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${calendarProbe}</body>`));
      return;
    }

    if (
      options.enableTestRoutes &&
      pathname === "/__test-localization-integrity.html"
    ) {
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const localizationIntegrityProbe = `<script>
        (() => {
          const phaseKey = "test.localization-integrity.phase";
          const stateKey = "test.localization-integrity.state";
          const customName = "Kayra Özel";
          const changedName = "Changed after save";
          const collectLocaleKeyLeaks = () => {
            msg(
              i18n.t("runtime.core.bootstrap.dialogue.game_saved_2cb7f3fc"),
              "cyan",
            );
            dscr({ clientX: 220, clientY: 220 }, wpn.stk1);
            const log = document.getElementById("gmsgs");
            const surfaces = [
              ["ui", document.body.innerText],
              ["log", log?.textContent || ""],
              ["hover", global.dscr?.textContent || ""],
            ];
            const localeKeyPattern =
              /\b(?:runtime|content|ui|gameText)\.[A-Za-z0-9_.-]+/g;
            return surfaces.flatMap(([surface, text]) =>
              [...text.matchAll(localeKeyPattern)].map(
                (match) => i18n.currentLocale + ":" + surface + ":" + match[0],
              ),
            );
          };
          const probe = setInterval(() => {
            if (
              !document.getElementById("ctrmg") ||
              document.getElementById("loading-overlay") ||
              typeof save !== "function" ||
              typeof load !== "function" ||
              typeof dscr !== "function" ||
              typeof msg !== "function" ||
              !window.i18n ||
              !window.you ||
              !window.dom?.d2
            ) return;

            const phase = localStorage.getItem(phaseKey);
            const state = JSON.parse(localStorage.getItem(stateKey) || "{}");
            if (!phase) {
              state.newGameUsedLocaleName =
                you.name === i18n.t("runtime.core.player.interface.name");
              you.name = customName;
              dom.d2.textContent = customName;
              const savedGame = save(true);
              you.name = changedName;
              dom.d2.textContent = changedName;
              load(savedGame);
              state.saveLoadPreservedName =
                you.name === customName && dom.d2.textContent === customName;
              localStorage.setItem(stateKey, JSON.stringify(state));
              localStorage.setItem(phaseKey, "turkish");
              i18n.setLocale("tr");
              return;
            }

            if (phase === "turkish") {
              state.turkishReloadPreservedName =
                i18n.currentLocale === "tr" &&
                you.name === customName &&
                dom.d2.textContent === customName;
              state.turkishLocaleKeyLeaks = collectLocaleKeyLeaks();
              localStorage.setItem(stateKey, JSON.stringify(state));
              localStorage.setItem(phaseKey, "english");
              i18n.setLocale("en");
              return;
            }

            clearInterval(probe);
            state.englishReloadPreservedName =
              i18n.currentLocale === "en" &&
              you.name === customName &&
              dom.d2.textContent === customName;

            const leaks = [
              ...(state.turkishLocaleKeyLeaks || []),
              ...collectLocaleKeyLeaks(),
            ];
            const namePreserved =
              state.newGameUsedLocaleName &&
              state.saveLoadPreservedName &&
              state.turkishReloadPreservedName &&
              state.englishReloadPreservedName;

            document.documentElement.dataset.localeKeyLeakFree = String(
              leaks.length === 0,
            );
            document.documentElement.dataset.localeKeyLeakDetails =
              leaks.slice(0, 5).join(",") || "none";
            document.documentElement.dataset.playerNamePersistence =
              String(namePreserved);
            document.documentElement.dataset.playerNameDetails = JSON.stringify(state);
            localStorage.removeItem(phaseKey);
            localStorage.removeItem(stateKey);
          }, 10);
        })();
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(
        index.replace("</body>", `${localizationIntegrityProbe}</body>`),
      );
      return;
    }

    const requestedPath = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.resolve(siteRoot, `.${requestedPath}`);

    const sendResponse = () => {
      if (
        !filePath.startsWith(`${siteRoot}${path.sep}`) ||
        !fs.existsSync(filePath)
      ) {
        response.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("Not found");
        return;
      }

      const headers = {
        "Content-Type":
          mimeTypes[path.extname(filePath)] ?? "application/octet-stream",
      };
      if (options.liveReload) headers["Cache-Control"] = "no-store";

      if (options.liveReload && path.extname(filePath) === ".html") {
        const html = fs.readFileSync(filePath, "utf8");
        response.writeHead(200, headers);
        response.end(
          html.includes("</body>")
            ? html.replace("</body>", `${liveReloadClient}</body>`)
            : `${html}${liveReloadClient}`,
        );
        return;
      }

      response.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(response);
    };

    const delay = Number(options.assetDelayMs) || 0;
    if (delay && /\.(?:css|js|json)$/.test(filePath)) {
      setTimeout(sendResponse, delay);
    } else {
      sendResponse();
    }
  });

  server.broadcastReload = () => {
    for (const client of liveReloadClients) {
      client.write(`event: reload\ndata: ${Date.now()}\n\n`);
    }
  };

  server.closeLiveReloadClients = () => {
    for (const client of liveReloadClients) client.end();
    liveReloadClients.clear();
  };

  return server;
}

if (require.main === module) {
  createSiteServer().listen(port, "127.0.0.1", () => {
    console.log(`Echoes Beneath is available at http://127.0.0.1:${port}`);
  });
}

module.exports = { createSiteServer };
