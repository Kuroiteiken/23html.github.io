const fs = require("fs");
const { execFile } = require("child_process");
const { createSiteServer } = require("./serve");

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

const server = createSiteServer();
server.listen(0, "127.0.0.1", () => {
  const { port } = server.address();
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--enable-logging=stderr",
    "--log-level=0",
    "--virtual-time-budget=4000",
    "--window-size=900,600",
    "--dump-dom",
    `http://127.0.0.1:${port}/`,
  ];

  execFile(
    browser,
    args,
    { maxBuffer: 5 * 1024 * 1024 },
    (error, stdout, stderr) => {
      server.close();
      if (error) throw error;
      const runtimeErrors = stderr.match(
        /Uncaught|SyntaxError|ReferenceError|TypeError|Failed to load resource/gi,
      );
      if (runtimeErrors) {
        throw new Error(`Browser runtime errors detected:\n${stderr}`);
      }
      if (!stdout.includes('<option value="en">English</option>')) {
        throw new Error("The language selector was not rendered.");
      }
      if (!stdout.includes('id="ctrmg"')) {
        throw new Error("The game interface did not initialize.");
      }
      const scaleMatch = stdout.match(/data-ui-scale="([\d.]+)"/);
      if (!scaleMatch || Number(scaleMatch[1]) >= 1) {
        throw new Error("The game interface did not fit the reduced viewport.");
      }
      const expectedChangelogUrl = `http://127.0.0.1:${port}/changelog/changelog.html`;
      if (!stdout.includes(`href="${expectedChangelogUrl}"`)) {
        throw new Error("The changelog link is not site-base aware.");
      }
      console.log(
        "Language loading, viewport fitting, changelog linking, and game startup verified.",
      );
    },
  );
});
