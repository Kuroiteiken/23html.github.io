const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const bootstrap = fs.readFileSync(
  path.join(root, "js", "core", "bootstrap.js"),
  "utf8",
);
const changelog = fs.readFileSync(
  path.join(root, "changelog", "changelog.html"),
  "utf8",
);

const versionMatch = bootstrap.match(/global\.ver\s*=\s*(\d+);/);
const releaseMatch = changelog.match(
  /<article class="release release-latest" data-version="(\d+)">[\s\S]*?<span class="release-range">v(\d+)[\s\S]*?v(\d+)<\/span>/,
);

if (!versionMatch)
  throw new Error("Game version was not found in bootstrap.js");
if (!releaseMatch)
  throw new Error("Latest game release was not found in changelog.html");

const gameVersion = Number(versionMatch[1]);
const releaseVersion = Number(releaseMatch[1]);
const releaseStart = Number(releaseMatch[2]);
const releaseEnd = Number(releaseMatch[3]);

if (
  releaseVersion !== gameVersion ||
  releaseEnd !== gameVersion ||
  releaseStart !== gameVersion - 1
) {
  throw new Error(
    `Version mismatch: game is v${gameVersion}, latest changelog range is ${releaseStart}-${releaseEnd}`,
  );
}

console.log(
  `Validated game version v${gameVersion} against the HTML changelog.`,
);
