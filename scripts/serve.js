const fs = require("fs");
const http = require("http");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..", "dist");
const probeRoot = path.resolve(__dirname, "..", "tests", "probes");
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

    // Every /__test-<name>.html route is one file under tests/probes/. The file holds
    // the browser code alone; this wraps it in a script tag and injects it into the
    // deployed index.html.
    //
    // It used to be sixteen near-identical blocks written out here, 1,831 of this
    // file's 1,961 lines, each holding its probe inside a template literal. A template
    // literal is invisible to node --check and to eslint, so a typo in a probe could
    // only be found by running it. As files they are checked with everything else.
    if (
      options.enableTestRoutes &&
      pathname.startsWith("/__test-") &&
      pathname.endsWith(".html")
    ) {
      const name = pathname.slice("/__test-".length, -".html".length);
      // Restricted rather than resolved-and-checked: the name goes into a file path, and
      // a permissive rule here would turn this route into a way to read any file on disk.
      if (!/^[a-z0-9-]+$/.test(name)) {
        response.writeHead(400, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("Probe names are lowercase letters, digits and hyphens.");
        return;
      }
      const probePath = path.join(probeRoot, `${name}.js`);
      if (!fs.existsSync(probePath)) {
        response.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end(`No probe at tests/probes/${name}.js`);
        return;
      }
      const probe = fs.readFileSync(probePath, "utf8");
      const index = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
      const script = `<script>\n${probe}\n</script>`;

      // A probe that has to run before any of the game exists says so in its header.
      // Everything else goes in ahead of </body>, which is after the loader tag and so
      // after the bundle has been asked for.
      if (probe.includes("// inject: before-loader")) {
        const loaderAt = index.indexOf('<script src="js/i18n-loader.js');
        if (loaderAt < 0) {
          response.writeHead(500, {
            "Content-Type": "text/plain; charset=utf-8",
          });
          response.end("index.html no longer has the loader script tag.");
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(index.slice(0, loaderAt) + script + index.slice(loaderAt));
        return;
      }

      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(index.replace("</body>", `${script}</body>`));
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
