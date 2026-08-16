const fs = require("fs");
const path = require("path");

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
fs.writeFileSync(path.join(output, ".nojekyll"), "", "utf8");

console.log("Prepared the GitHub Pages site in dist/.");
