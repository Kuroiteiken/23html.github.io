const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const test = require("node:test");
const { createBuildQueue, shouldRebuild } = require("../scripts/dev");
const { createSiteServer } = require("../scripts/serve");

const root = path.dirname(__dirname);

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

function requestText(port, pathname) {
  return new Promise((resolve, reject) => {
    const request = http.get(
      { host: "127.0.0.1", path: pathname, port },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.once("end", () =>
          resolve({
            body,
            headers: response.headers,
            status: response.statusCode,
          }),
        );
      },
    );
    request.once("error", reject);
  });
}

function receiveReload(port, broadcastReload) {
  return new Promise((resolve, reject) => {
    let body = "";
    let settled = false;
    const timeout = setTimeout(
      () => finish(new Error("Timed out waiting for the live-reload event.")),
      2000,
    );

    function finish(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      request?.destroy();
      if (error) reject(error);
      else resolve(body);
    }

    const request = http.get(
      { host: "127.0.0.1", path: "/__dev/events", port },
      (response) => {
        if (response.statusCode !== 200) {
          finish(new Error(`Unexpected SSE status: ${response.statusCode}`));
          return;
        }
        if (
          !response.headers["content-type"]?.startsWith("text/event-stream")
        ) {
          finish(new Error("The live-reload endpoint is not an SSE stream."));
          return;
        }

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
          if (
            body.includes("event: ready") &&
            !body.includes("event: reload")
          ) {
            broadcastReload();
          }
          if (body.includes("event: reload")) finish();
        });
        response.once("error", finish);
      },
    );
    request.once("error", finish);
  });
}

test("shouldRebuild accepts application sources and rejects generated output", () => {
  assert.equal(shouldRebuild("js/core/player.js"), true);
  assert.equal(shouldRebuild("css/game.css"), true);
  assert.equal(shouldRebuild("locales/en.json"), true);
  assert.equal(shouldRebuild(path.join(root, "index.html")), true);
  assert.equal(shouldRebuild("js/game.js"), false);
  assert.equal(shouldRebuild("dist/js/game.js"), false);
  assert.equal(shouldRebuild(path.join(root, "dist", "js", "game.js")), false);
});

test("build queue coalesces changes and calls onSuccess after each build", async () => {
  const batches = [];
  const events = [];
  const failures = [];
  let startFirstBuild;
  let finishFirstBuild;
  const firstBuildStarted = new Promise((resolve) => {
    startFirstBuild = resolve;
  });
  const firstBuildCanFinish = new Promise((resolve) => {
    finishFirstBuild = resolve;
  });
  const queue = createBuildQueue({
    async build(batch) {
      batches.push(batch);
      events.push("build:start");
      if (batches.length === 1) {
        startFirstBuild();
        await firstBuildCanFinish;
      }
      events.push("build:end");
    },
    debounceMs: 5,
    onFailure(error) {
      failures.push(error);
    },
    onSuccess() {
      events.push("success");
    },
  });

  queue.request("js/core/player.js");
  queue.request("css/game.css");
  await firstBuildStarted;
  queue.request("locales/en.json");
  queue.request("locales/tr.json");
  finishFirstBuild();
  await queue.whenIdle();
  await new Promise((resolve) => setTimeout(resolve, 20));

  assert.deepEqual(failures, []);
  assert.equal(batches.length, 2);
  assert.deepEqual(
    new Set(batches[0]),
    new Set(["js/core/player.js", "css/game.css"]),
  );
  assert.deepEqual(
    new Set(batches[1]),
    new Set(["locales/en.json", "locales/tr.json"]),
  );
  assert.deepEqual(events, [
    "build:start",
    "build:end",
    "success",
    "build:start",
    "build:end",
    "success",
  ]);
});

test("live-reload server injects its client and publishes reload over SSE", async (t) => {
  const server = createSiteServer({ liveReload: true });
  t.after(async () => {
    server.closeLiveReloadClients();
    if (server.listening) await close(server);
  });
  const port = await listen(server);

  const page = await requestText(port, "/");
  assert.equal(page.status, 200);
  assert.equal(page.headers["cache-control"], "no-store");
  assert.match(page.body, /id="proto23-live-reload"/);
  assert.match(page.body, /new EventSource\("\/__dev\/events"\)/);

  const stream = await receiveReload(port, () => server.broadcastReload());
  assert.match(stream, /event: ready\ndata: connected/);
  assert.match(stream, /event: reload\ndata: \d+/);
});
