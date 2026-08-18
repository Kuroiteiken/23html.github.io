#!/usr/bin/env node
"use strict";

// A reference to a registry entry that was never defined does not fail loudly in
// this codebase. `giveItem(item.sp4)` reads `.slot` off undefined, throws inside a
// dialogue click handler, and the only symptom is that the scene never advances --
// the choice stays on screen and the player can click it again and again. That is
// exactly how the level 35 dojo reward shipped broken. This check makes the class
// of mistake impossible to commit again.
//
// It resolves every `<registry>.<key>` mentioned as an argument to a granting
// function against the keys those registries actually define.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const sources = require("./sources");
const stripComments = require("./strip-comments");

// Registries that hold content records looked up by key. Every one of these is a
// plain object literal populated by `<registry>.<key> = ...` at load time.
const REGISTRIES = [
  "item",
  "acc",
  "sld",
  "wpn",
  "arm",
  "eqp",
  "creature",
  "area",
  "sector",
  "chss",
  "quest",
  "ttl",
  "skl",
  "abl",
  "furn",
  "lore",
];

// Call sites whose arguments must resolve. These are the ones where a bad
// reference throws rather than merely reading as undefined.
const GRANTS = [
  "giveItem",
  "giveEqp",
  "giveFurniture",
  "giveTitle",
  "giveQuest",
  "learnLore",
  "area_init",
  "smove",
  "mon_gen",
];

const defined = new Map(REGISTRIES.map((r) => [r, new Set()]));
const files = [];

for (const rel of sources) {
  const abs = path.join(root, rel);
  const text = stripComments(fs.readFileSync(abs, "utf8"));
  files.push({ rel, text });
  const assign = new RegExp(
    "^\\s*(" + REGISTRIES.join("|") + ")\\.([A-Za-z0-9_$]+)\\s*=",
    "gm",
  );
  let m;
  while ((m = assign.exec(text)) !== null) defined.get(m[1]).add(m[2]);
}

const problems = [];
const call = new RegExp("\\b(" + GRANTS.join("|") + ")\\s*\\(([^()]*)\\)", "g");
const ref = new RegExp(
  "\\b(" + REGISTRIES.join("|") + ")\\.([A-Za-z0-9_$]+)",
  "g",
);

for (const { rel, text } of files) {
  let m;
  while ((m = call.exec(text)) !== null) {
    const line = text.slice(0, m.index).split("\n").length;
    let r;
    while ((r = ref.exec(m[2])) !== null) {
      const [, registry, key] = r;
      if (defined.get(registry).has(key)) continue;
      problems.push(
        `${rel}:${line}  ${m[1]}(... ${registry}.${key} ...) is never defined`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error("Unresolved content references:\n");
  for (const p of problems) console.error("  " + p);
  console.error(
    `\n${problems.length} unresolved reference(s). Each one throws at runtime and` +
      " leaves the scene it is in stuck on screen.",
  );
  process.exit(1);
}

console.log(
  `check-refs: every reference in ${GRANTS.length} granting calls resolves across ${files.length} sources.`,
);
