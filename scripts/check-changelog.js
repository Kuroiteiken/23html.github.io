const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const changelog = fs.readFileSync(
  path.join(root, "changelog", "changelog.html"),
  "utf8",
);

const requiredPatterns = [
  [/<meta name="viewport"/, "responsive viewport metadata"],
  [/<header class="page-header">/, "page header"],
  [/<main class="changelog"/, "release-history main region"],
  [/<footer class="page-footer">/, "page footer"],
  [/<a class="back-link" href="\.\.\/">/, "project-path-safe game link"],
  [/@media \(max-width: 600px\)/, "mobile layout"],
  [/dataset\.horizontalOverflow/, "runtime horizontal-overflow reporting"],
];

for (const [pattern, description] of requiredPatterns) {
  if (!pattern.test(changelog)) {
    throw new Error(`Changelog is missing ${description}.`);
  }
}

const releases = [
  ...changelog.matchAll(
    /<article class="release(?: release-latest)?" data-version="(\d+)">/g,
  ),
].map((match) => Number(match[1]));

if (releases.length < 20) {
  throw new Error(
    `Expected at least 20 release cards, found ${releases.length}.`,
  );
}
if (
  !releases.every(
    (version, index) => index === 0 || version < releases[index - 1],
  )
) {
  throw new Error("Changelog release cards are not in newest-first order.");
}

const releaseHeaders = (changelog.match(/class="release-header"/g) ?? [])
  .length;
const releaseBodies = (changelog.match(/class="release-changes"/g) ?? [])
  .length;
if (releaseHeaders !== releases.length || releaseBodies !== releases.length) {
  throw new Error(
    "Every changelog release must have a header and change body.",
  );
}

console.log(`Validated ${releases.length} responsive changelog release cards.`);
