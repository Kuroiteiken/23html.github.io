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
          document.documentElement.dataset.saveBarControlsSeparated = String(
            controlsSeparated &&
              controlsInsideBar &&
              collapseFollowsSaveAndLoad,
          );
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
