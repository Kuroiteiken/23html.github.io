const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
const files = ["index.html", "favicon.ico", "ctst.png", "laugh6.wav"];
const directories = ["changelog", "css", "icons", "locales"];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "js"), { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), {
    recursive: true,
  });
}

fs.copyFileSync(
  path.join(root, "js", "game.js"),
  path.join(output, "js", "game.js"),
);
fs.copyFileSync(
  path.join(root, "js", "i18n-loader.js"),
  path.join(output, "js", "i18n-loader.js"),
);

const versionHash = crypto.createHash("sha256");
for (const asset of [
  "css/game.css",
  "js/game.js",
  "js/i18n-loader.js",
  "locales/manifest.json",
  ...fs
    .readdirSync(path.join(root, "locales"))
    .filter((file) => file.endsWith(".json"))
    .map((file) => `locales/${file}`),
]) {
  versionHash.update(fs.readFileSync(path.join(root, asset)));
}
const assetVersion = versionHash.digest("hex").slice(0, 12);
// The boot screen in index.html is markup rather than JavaScript, because it has to
// paint before the bundle exists -- but i18n does not exist that early either, so its
// text cannot come through i18n.t(). Both languages are therefore written into the
// page here, straight out of the locale files, and CSS removes the one the player is
// not reading. That keeps the project rule intact: the strings still live only in
// locales/*.json, and nothing is hand-copied into the HTML where it could drift.
//
// A token that does not resolve is a hard error rather than a page shipping with
// "{{boot:...}}" printed across it.
function fillBootStrings(html) {
  const messages = {};
  for (const code of ["en", "tr"]) {
    messages[code] = JSON.parse(
      fs.readFileSync(path.join(root, "locales", code + ".json"), "utf8"),
    );
  }
  return html.replace(/\{\{boot:([\w.]+):(\w+)\}\}/g, (match, key, code) => {
    const value = key
      .split(".")
      .reduce((node, part) => (node ? node[part] : undefined), messages[code]);
    if (typeof value !== "string") {
      throw new Error(
        `index.html asks for ${key} in ${code}, which locales/${code}.json does not define.`,
      );
    }
    return value;
  });
}

const deployedIndexPath = path.join(output, "index.html");
const deployedIndex = fs
  .readFileSync(deployedIndexPath, "utf8")
  // Matched on the attribute rather than the bare filename. String.replace takes the
  // first occurrence, so a comment or a description that happened to mention the file
  // earlier in the page would take the version stamp instead of the tag that needs it
  // -- which is exactly what happened once the boot screen's inline script was added
  // above them, and it shipped a page whose bundle could never be cache-busted.
  .replace('href="css/game.css"', `href="css/game.css?v=${assetVersion}"`)
  .replace(
    'src="js/i18n-loader.js"',
    `src="js/i18n-loader.js?v=${assetVersion}"`,
  );
const localizedIndex = fillBootStrings(deployedIndex);
fs.writeFileSync(deployedIndexPath, localizedIndex, "utf8");
fs.writeFileSync(path.join(output, ".nojekyll"), "", "utf8");

// The asset version is written where the running page can read it back. Every
// request the loader makes already carries ?v=, so css, the bundle and the locale
// files can never be served stale -- but index.html itself carries no version and is
// the one file a browser or CDN will happily keep. A player who reloads then gets
// yesterday's index.html, which asks for yesterday's ?v=, and nothing about the
// deploy reaches them however many times they refresh. This file is what lets the
// page notice that and fix itself; GitHub Pages serves no cache headers we could set
// instead. It is deliberately tiny so fetching it costs nothing.
fs.writeFileSync(
  path.join(output, "version.json"),
  JSON.stringify({ assetVersion }) + "\n",
  "utf8",
);

// The dev server rebuilds on every save, so it runs the build quietly and
// prints its own single line instead.
if (!process.argv.includes("--quiet"))
  console.log("Prepared the GitHub Pages site in dist/.");
