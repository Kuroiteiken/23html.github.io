const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { createSiteServer } = require("./serve");

const gameVersion = Number(
  fs
    .readFileSync(
      path.resolve(__dirname, "..", "js", "core", "bootstrap.js"),
      "utf8",
    )
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

    const recovery = await runChrome(
      `${baseUrl}/__test/corrupt-save`,
      profiles[1],
    );
    assertNoUnexpectedErrors(recovery.stderr, true);
    assertCommonStartup(recovery.stdout, port);
    if (!recovery.stdout.includes('id="startup-error"')) {
      throw new Error("A malformed save did not show the recovery message.");
    }

    assertVersionedRequests(requests);
    console.log(
      "Slow assets, version consistency, Turkish startup, cached reload, malformed-save recovery, viewport fitting, changelog linking, and mobile changelog layout verified.",
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
