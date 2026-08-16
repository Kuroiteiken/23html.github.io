const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
const files = ["index.html", "favicon.ico", "ctst.png", "laugh6.wav"];
const directories = ["changelog", "css", "locales"];

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
const deployedIndexPath = path.join(output, "index.html");
const deployedIndex = fs
  .readFileSync(deployedIndexPath, "utf8")
  .replace("css/game.css", `css/game.css?v=${assetVersion}`)
  .replace("js/i18n-loader.js", `js/i18n-loader.js?v=${assetVersion}`);
fs.writeFileSync(deployedIndexPath, deployedIndex, "utf8");
fs.writeFileSync(path.join(output, ".nojekyll"), "", "utf8");

console.log("Prepared the GitHub Pages site in dist/.");
