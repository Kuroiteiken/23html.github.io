const fs = require("fs");
const path = require("path");

const root = path.dirname(__dirname);
const bootstrap = fs.readFileSync(
  path.join(root, "js", "core", "bootstrap.js"),
  "utf8",
);
const changelog = fs.readFileSync(
  path.join(root, "changelog", "changelog.html"),
  "utf8",
);

const versionMatch = bootstrap.match(/global\.ver\s*=\s*(\d+);/);
const subversionMatch = bootstrap.match(/global\.subver\s*=\s*(\d+);/);
// The range's end may now carry a point release -- v477 → v478.1 -- so the minor is
// optional here and checked against global.subver when it is present. Without the
// optional group the trailing ".1" made `v(\d+)<\/span>` backtrack into matching the
// wrong pair of numbers and report the range as 477-477.
const releaseMatch = changelog.match(
  /<article class="release release-latest" data-version="(\d+)">[\s\S]*?<span class="release-range">v(\d+)[\s\S]*?v(\d+)(?:\.(\d+))?<\/span>/,
);

if (!versionMatch)
  throw new Error("Game version was not found in bootstrap.js");
if (!subversionMatch)
  throw new Error("Game point release was not found in bootstrap.js");
if (!releaseMatch)
  throw new Error("Latest game release was not found in changelog.html");

const gameVersion = Number(versionMatch[1]);
const gameSubversion = Number(subversionMatch[1]);
const releaseVersion = Number(releaseMatch[1]);
const releaseStart = Number(releaseMatch[2]);
const releaseEnd = Number(releaseMatch[3]);
const releaseEndPoint = releaseMatch[4] ? Number(releaseMatch[4]) : 0;

if (
  releaseVersion !== gameVersion ||
  releaseEnd !== gameVersion ||
  releaseStart !== gameVersion - 1 ||
  releaseEndPoint !== gameSubversion
) {
  throw new Error(
    `Version mismatch: game is v${gameVersion}.${gameSubversion}, latest changelog range ends at ${releaseEnd}.${releaseEndPoint} and starts at ${releaseStart}`,
  );
}

// Every point release the game can announce must have somewhere to be read from, in
// both languages, or a player is shown an empty list.
const interfaceSource = fs.readFileSync(
  path.join(root, "js", "ui", "interface.js"),
  "utf8",
);
const announced = [
  ...interfaceSource.matchAll(
    /\{\s*major: (\d+),\s*minor: (\d+),\s*read: \(\) => i18n\.get\("([^"]+)"\)/g,
  ),
].map((m) => ({ major: Number(m[1]), minor: Number(m[2]), key: m[3] }));

if (
  !announced.some(
    (entry) => entry.major === gameVersion && entry.minor === gameSubversion,
  )
) {
  throw new Error(
    `Release notes regression: v${gameVersion}.${gameSubversion} has no entry in releaseNotes, so a returning player is told nothing about it.`,
  );
}

for (const locale of ["en", "tr"]) {
  const messages = JSON.parse(
    fs.readFileSync(path.join(root, "locales", `${locale}.json`), "utf8"),
  );
  for (const entry of announced) {
    const value = entry.key
      .split(".")
      .reduce((node, part) => (node ? node[part] : undefined), messages);
    if (!Array.isArray(value) || value.length === 0) {
      throw new Error(
        `Release notes regression: ${entry.key} is missing or empty in locales/${locale}.json, so v${entry.major}.${entry.minor} would announce an empty list.`,
      );
    }
  }
}

console.log(
  `Validated game version v${gameVersion}.${gameSubversion}, its changelog range, and release notes for ${announced.length} release(s) in both languages.`,
);
