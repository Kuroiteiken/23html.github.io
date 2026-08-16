const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const localeRoot = path.join(root, "locales");
const manifest = JSON.parse(
  fs.readFileSync(path.join(localeRoot, "manifest.json"), "utf8"),
);
const defaultLocale = manifest.locales.find(
  ({ code }) => code === manifest.defaultLocale,
);

if (!defaultLocale) {
  throw new Error(
    "The default locale is not registered in locales/manifest.json",
  );
}

for (const locale of manifest.locales) {
  const localePath = path.join(localeRoot, locale.file);
  if (!fs.existsSync(localePath)) {
    throw new Error(`Missing locale file: ${locale.file}`);
  }
  const messages = JSON.parse(fs.readFileSync(localePath, "utf8"));
  if (messages.meta?.code !== locale.code) {
    throw new Error(`Locale code mismatch in ${locale.file}`);
  }
}

const english = JSON.parse(
  fs.readFileSync(path.join(localeRoot, defaultLocale.file), "utf8"),
);

function collectLeaves(value, path = "", leaves = new Map()) {
  if (typeof value === "string") {
    leaves.set(path, value);
    return leaves;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectLeaves(item, `${path}[${index}]`, leaves),
    );
    return leaves;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) =>
      collectLeaves(item, path ? `${path}.${key}` : key, leaves),
    );
  }
  return leaves;
}

function formattingTokens(value) {
  return [...value.matchAll(/\{[^}]+\}|<\/?[A-Za-z][^>]*>|&[A-Za-z0-9#]+;/g)]
    .map((match) => match[0])
    .sort();
}

const englishLeaves = collectLeaves(english);
for (const locale of manifest.locales) {
  if (locale.code === manifest.defaultLocale) continue;
  const messages = JSON.parse(
    fs.readFileSync(path.join(localeRoot, locale.file), "utf8"),
  );
  const leaves = collectLeaves(messages);
  const contentPaths = [...englishLeaves.keys()].filter(
    (key) => key !== "meta.code" && key !== "meta.name",
  );
  const missing = contentPaths.filter((key) => !leaves.has(key));
  const extra = [...leaves.keys()].filter(
    (key) =>
      key !== "meta.code" && key !== "meta.name" && !englishLeaves.has(key),
  );
  if (missing.length || extra.length) {
    throw new Error(
      `${locale.file} schema mismatch. Missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"}`,
    );
  }

  const unsafeFormatting = contentPaths.filter(
    (key) =>
      JSON.stringify(formattingTokens(englishLeaves.get(key))) !==
      JSON.stringify(formattingTokens(leaves.get(key))),
  );
  if (unsafeFormatting.length) {
    throw new Error(
      `${locale.file} changed formatting tokens: ${unsafeFormatting.join(", ")}`,
    );
  }
}

const sourceRoots = [
  "js/core",
  "js/data",
  "js/systems",
  "js/ui",
  "js/utils",
  "js/world",
  "js/i18n-loader.js",
];
const referencedKeys = new Set();

function getPath(source, key) {
  return key.split(".").reduce((value, part) => value?.[part], source);
}

function collectSourceFiles(entry) {
  const absolute = path.join(root, entry);
  if (fs.statSync(absolute).isFile()) return [absolute];
  return fs
    .readdirSync(absolute, { withFileTypes: true })
    .flatMap((item) =>
      item.isDirectory()
        ? collectSourceFiles(path.join(entry, item.name))
        : item.name.endsWith(".js")
          ? [path.join(absolute, item.name)]
          : [],
    );
}

for (const file of sourceRoots.flatMap(collectSourceFiles)) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/i18n\.(?:get|t)\(\s*"([^"]+)"/g)) {
    referencedKeys.add(match[1]);
  }
}

const missingKeys = [...referencedKeys].filter(
  (key) => getPath(english, key) === undefined,
);
if (missingKeys.length) {
  throw new Error(`Missing English locale keys: ${missingKeys.join(", ")}`);
}

console.log(
  `Validated ${manifest.locales.length} locale and ${referencedKeys.size} translation keys.`,
);
