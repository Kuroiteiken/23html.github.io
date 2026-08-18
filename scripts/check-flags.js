#!/usr/bin/env node
"use strict";

// A gate that can never open.
//
// `chss.bsmnthm1` showed the "examine your surroundings" choice behind
// `if (!global.flags.bsmntchck)`, and nothing in this repository's history has ever
// written that flag. The branch was therefore always taken, which was lucky: the
// only call to `giveAction(act.scout)` in the entire game lives inside it, so
// "fixing" the flag by setting it on a first examine would have stranded any player
// who took the chest and left -- no search action, and with it no marketplace table
// and no catacomb finds.
//
// Either way round, a flag read as a condition and never written is a bug. Left
// unwritten it is a condition that is really a constant, and someone eventually
// makes it a real gate without knowing what is behind it. Written nowhere by
// mistake, it is a feature that silently never turns on.
//
// `global.flags` is a plain object extended by assignment all over these sources, so
// there is no declaration list to check against; the reads and the writes have to be
// found in the text. Comments are stripped first, because commented-out scenes are
// everywhere here and their flags are not live.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const sources = require("./sources");
const stripComments = require("./strip-comments");

const READ = /global\.flags\.([A-Za-z_$][\w$]*)/g;
// `=` not followed by `=` is an assignment rather than a comparison, and `++`/`--`
// count as writes too. `+=` and friends are matched by the same first character.
const WRITE =
  /global\.flags\.([A-Za-z_$][\w$]*)\s*(?:[-+*/|&^]?=[^=]|\+\+|--)/g;
// Keys given an initial value in the `global.flags` object literal are written by
// that literal, which is how the two dozen flags the game boots with are declared.
const LITERAL = /global\.flags\s*=\s*\{[\s\S]*?\n\};/;
const LITERAL_KEY = /^\s{2}([A-Za-z_$][\w$]*):/gm;

const reads = new Map();
const writes = new Set();
let text = "";

for (const rel of sources) {
  const stripped = stripComments(fs.readFileSync(path.join(root, rel), "utf8"));
  text += stripped + "\n";
  for (const m of stripped.matchAll(READ))
    if (!reads.has(m[1])) {
      const line = stripped.slice(0, m.index).split("\n").length;
      reads.set(m[1], `${rel}:${line}`);
    }
  for (const m of stripped.matchAll(WRITE)) writes.add(m[1]);
}

const literal = text.match(LITERAL);
if (!literal)
  throw new Error(
    "The global.flags object literal was not found, so its declared keys cannot be counted as writes.",
  );
for (const m of literal[0].matchAll(LITERAL_KEY)) writes.add(m[1]);

const unwritten = [...reads.keys()].filter((name) => !writes.has(name)).sort();

if (unwritten.length) {
  const lines = unwritten.map(
    (name) => `  global.flags.${name}  ${reads.get(name)}`,
  );
  throw new Error(
    `${unwritten.length} flag(s) are read but never written anywhere:\n${lines.join(
      "\n",
    )}\n\nEither write the flag where it should be set, or drop the condition. A gate\nthat can never open is not a gate, and the next person to "complete" it will not\nknow what is behind it.`,
  );
}

console.log(
  `Validated ${reads.size} game flags: every one read as a condition is written somewhere.`,
);
