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
          player.style.display = "";
          enemy.style.display = "";
          requestAnimationFrame(() => {
            const playerBounds = player.getBoundingClientRect();
            const enemyBounds = enemy.getBoundingClientRect();
            document.documentElement.dataset.combatPanelsSeparated = String(
              enemyBounds.left >= playerBounds.right &&
              playerBounds.left < enemyBounds.left
            );
            clearInterval(combatLayoutProbe);
          });
        }, 10);
      </script>`;
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${layoutProbe}</body>`));
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
