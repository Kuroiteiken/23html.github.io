const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { createSiteServer } = require("./serve");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT) || 8080;
const watchTargets = [
  "index.html",
  "favicon.ico",
  "ctst.png",
  "laugh6.wav",
  "changelog",
  "css",
  "js",
  "locales",
];

function normalizeRelativePath(filePath) {
  return path
    .relative(root, path.resolve(root, filePath))
    .replaceAll("\\", "/");
}

function shouldRebuild(filePath) {
  const relativePath = normalizeRelativePath(filePath);
  if (
    relativePath === "js/game.js" ||
    relativePath === "dist" ||
    relativePath.startsWith("dist/") ||
    relativePath === "node_modules" ||
    relativePath.startsWith("node_modules/") ||
    relativePath === ".git" ||
    relativePath.startsWith(".git/")
  ) {
    return false;
  }

  return watchTargets.some(
    (target) =>
      relativePath === target || relativePath.startsWith(`${target}/`),
  );
}

function runNodeScript(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, script)], {
      cwd: root,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}.`));
    });
  });
}

async function buildSite() {
  await runNodeScript("scripts/build.js");
  await runNodeScript("scripts/build-site.js");
}

function createBuildQueue({ build, onSuccess, onFailure, debounceMs = 120 }) {
  let timer;
  let building = false;
  let queued = false;
  let changedPaths = new Set();
  let idleResolvers = [];

  const resolveIdle = () => {
    if (building || queued || timer) return;
    const resolvers = idleResolvers;
    idleResolvers = [];
    resolvers.forEach((resolve) => resolve());
  };

  const run = async () => {
    timer = undefined;
    if (building) {
      queued = true;
      return;
    }

    building = true;
    const batch = [...changedPaths];
    changedPaths = new Set();
    try {
      await build(batch);
      onSuccess(batch);
    } catch (error) {
      onFailure(error, batch);
    } finally {
      building = false;
      if (queued || changedPaths.size) {
        queued = false;
        clearTimeout(timer);
        timer = setTimeout(run, debounceMs);
      }
      resolveIdle();
    }
  };

  return {
    request(filePath) {
      changedPaths.add(normalizeRelativePath(filePath));
      if (building) {
        queued = true;
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(run, debounceMs);
    },
    whenIdle() {
      if (!building && !queued && !timer) return Promise.resolve();
      return new Promise((resolve) => idleResolvers.push(resolve));
    },
  };
}

function watchSource(target, onChange) {
  const absoluteTarget = path.join(root, target);
  const recursive = fs.statSync(absoluteTarget).isDirectory();
  return fs.watch(absoluteTarget, { recursive }, (_event, filename) => {
    const changedPath =
      recursive && filename ? path.join(target, filename) : target;
    if (shouldRebuild(changedPath)) onChange(changedPath);
  });
}

async function main() {
  await buildSite();

  const server = createSiteServer({ liveReload: true });
  const queue = createBuildQueue({
    build: buildSite,
    onFailure(error, changedPaths) {
      console.error(
        `Rebuild failed after ${changedPaths.join(", ")}:`,
        error.message,
      );
    },
    onSuccess(changedPaths) {
      console.log(`Rebuilt after ${changedPaths.join(", ")}.`);
      server.broadcastReload();
    },
  });
  const watchers = watchTargets.map((target) =>
    watchSource(target, (changedPath) => queue.request(changedPath)),
  );

  server.listen(port, "127.0.0.1", () => {
    console.log(
      `Echoes Beneath development server: http://127.0.0.1:${server.address().port}`,
    );
    console.log(
      "Watching application sources; successful rebuilds reload the browser.",
    );
  });

  const close = () => {
    watchers.forEach((watcher) => watcher.close());
    server.closeLiveReloadClients();
    server.close(() => process.exit(0));
  };
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { createBuildQueue, shouldRebuild, watchTargets };
