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

if (!fs.existsSync(siteRoot)) {
  throw new Error("dist/ is missing. Run npm run build first.");
}

function createSiteServer(options = {}) {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");
    const pathname = decodeURIComponent(requestUrl.pathname);
    options.onRequest?.(requestUrl);

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
          document.documentElement.dataset.saveBarControlsSeparated = String(
            controlsSeparated && controlsInsideBar,
          );
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${saveBarProbe}</body>`));
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

      response.writeHead(200, {
        "Content-Type":
          mimeTypes[path.extname(filePath)] ?? "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(response);
    };

    const delay = Number(options.assetDelayMs) || 0;
    if (delay && /\.(?:css|js|json)$/.test(filePath)) {
      setTimeout(sendResponse, delay);
    } else {
      sendResponse();
    }
  });
}

if (require.main === module) {
  createSiteServer().listen(port, "127.0.0.1", () => {
    console.log(`Proto23 is available at http://127.0.0.1:${port}`);
  });
}

module.exports = { createSiteServer };
