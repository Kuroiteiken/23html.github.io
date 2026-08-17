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

          document.documentElement.dataset.battleRowsStacked = String(
            stacked && bothInsidePanel && readoutStaysOneLine,
          );
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
          // game's own bottom row without leaving a wide empty band above itself.
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
          // The version is recorded before rendering, so it never repeats.
          const recorded =
            localStorage.getItem("proto23.seenversion") === String(global.ver);

          const checks = { shown, localized, singleNeutralButton, fits, recorded };
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
