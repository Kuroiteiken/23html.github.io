#!/usr/bin/env node
"use strict";

// Registry entries must not share a mutable object with each other.
//
// WHY THIS EXISTS
//
// `Creature()` used to read `this.eqp = [eqp.dummy, eqp.dummy]` -- a reference to one shared
// object rather than a fresh pair. So every `creature.X.eqp[0].aff = [...]` in
// js/data/creatures.js did not equip that creature; it rewrote the one object all 39 of them
// pointed at, and whichever weapon was declared last is what every creature in the game swung.
// creature.bat and creature.cbat were literally the same object.
//
// The half that mattered more reached the player: the player's empty equipment slots are that
// same dummy, and dmg_calc reads a struck slot's aff and cls into the mitigation term. So an
// empty slot was contributing a creature weapon's affinities to the player's own defence --
// measured, 9 of 50 damage against an attack term of 100.
//
// That failure is invisible in every way that matters. Nothing throws, the code reads
// correctly at a glance, and the symptom is a balance oddity nobody can trace to a line. It is
// also the cheapest possible mistake to make again: one `= sharedThing` in a constructor.
//
// So it is checked by identity rather than by reading code. Two registry entries holding the
// same array or object is the bug, whatever the source looks like.

const { loadGame } = require("./harness");

const game = loadGame();

const REGISTRIES = [
  "item",
  "wpn",
  "eqp",
  "acc",
  "sld",
  "creature",
  "area",
  "sector",
  "chss",
  "skl",
  "abl",
  "ttl",
  "effect",
  "rcp",
  "furniture",
  "quest",
  "vendor",
  "act",
  "lore",
  "container",
  "mastery",
];

// Mutable per-entry state. Writing to one entry's copy must never be visible from another's.
const FIELDS = [
  "aff",
  "cls",
  "caff",
  "maff",
  "cmaff",
  "ccls",
  "res",
  "data",
  "eff",
  "eqp",
  "stat_p",
  "drop",
  "pop",
  "mlstn",
  "mods",
  "req",
  "give",
  "stock",
  "effectors",
];

// The player's ten equipment slots all hold eqp.dummy, and that is deliberate: one object
// standing for "nothing equipped". It is only safe while the dummy stays inert, which the
// second half of this check enforces, so it is named here rather than hidden by the filter.
const ALLOWED_SHARING = [
  {
    what: "the player's empty equipment slots",
    matches: (holder) => /^you\.eqp\[\d+\]$/.test(holder),
  },
];

const holders = new Map();

function note(value, where) {
  if (!value || typeof value !== "object") return;
  if (!holders.has(value)) holders.set(value, []);
  holders.get(value).push(where);
}

for (const registry of REGISTRIES) {
  const records = game[registry];
  if (!records) continue;
  for (const key of Object.keys(records)) {
    const record = records[key];
    if (!record || typeof record !== "object") continue;
    for (const field of FIELDS) {
      if (Object.hasOwn(record, field))
        note(record[field], `${registry}.${key}.${field}`);
    }
    // One level down: a creature's eqp is an array of equipment, and that array's contents are
    // where the original bug lived.
    if (Array.isArray(record.eqp)) {
      record.eqp.forEach((piece, index) => {
        if (!piece || typeof piece !== "object") return;
        note(piece, `${registry}.${key}.eqp[${index}]`);
        for (const field of ["aff", "cls", "data"]) {
          if (Object.hasOwn(piece, field))
            note(piece[field], `${registry}.${key}.eqp[${index}].${field}`);
        }
      });
    }
  }
}

game.you.eqp.forEach((piece, index) => note(piece, `you.eqp[${index}]`));
for (const field of FIELDS) {
  if (Object.hasOwn(game.you, field)) note(game.you[field], `you.${field}`);
}

const problems = [];
for (const [, where] of holders) {
  if (where.length < 2) continue;
  const allowed = ALLOWED_SHARING.find((rule) => where.every(rule.matches));
  if (allowed) continue;
  problems.push(where);
}

if (problems.length > 0) {
  console.error("\nRegistry entries sharing one mutable object:\n");
  for (const where of problems) {
    console.error(`  ${where.length} holders: ${where.slice(0, 8).join(", ")}`);
    if (where.length > 8)
      console.error(`      ... and ${where.length - 8} more`);
  }
  console.error(
    "\nEach of these is one object with several owners, so writing through any one of them" +
      "\nchanges the others. Build a fresh value per entry -- `new Eqp()`, `[]`, `{}` -- rather" +
      "\nthan assigning a shared one in the constructor.",
  );
  process.exit(1);
}

// The dummy is shared by design, so it has to stay inert. If anything ever gives it stats, every
// empty slot on the player starts defending them -- which is the bug this file was written for,
// arriving from the other direction.
const dummy = game.eqp.dummy;
const dirty = [];
if (dummy.str !== 0) dirty.push(`str ${dummy.str}`);
if (dummy.int !== 0) dirty.push(`int ${dummy.int}`);
if (dummy.aff.some((value) => value !== 0))
  dirty.push(`aff ${JSON.stringify(dummy.aff)}`);
if (dummy.cls.some((value) => value !== 0))
  dirty.push(`cls ${JSON.stringify(dummy.cls)}`);

if (dirty.length > 0) {
  console.error(
    `\neqp.dummy carries stats: ${dirty.join(", ")}.\n\n` +
      "Every empty equipment slot on the player is this object, and dmg_calc reads a struck\n" +
      "slot's aff and cls into the mitigation term -- so these values make an empty slot defend\n" +
      "the player. An empty slot must be worth nothing.",
  );
  process.exit(1);
}

// --- endless areas, and where a new area may be added ------------------------
//
// An area whose size is -1 never runs out, and the HUD prints the infinity glyph for it rather
// than a count. There is one per region that has one, and each is unlocked by clearing its
// bounded sibling once.
//
// The order check is the important half. save() writes area sizes positionally by walking the
// registry in for...in order and load() reads them back by index, so a new area may only ever be
// appended. Inserting one in the middle shifts the sizes of every save in existence -- silently,
// because nothing about a shifted number looks wrong.
const areaKeys = Object.keys(game.area);
// area.tst is the developer bench, excluded here for the same reason
// scripts/check-combat.js excludes it: nobody plays it, and it is not content.
const BENCH_AREAS = new Set(["tst"]);
const endless = areaKeys.filter(
  (key) => game.area[key].size === -1 && !BENCH_AREAS.has(key),
);
if (endless.length === 0) {
  console.error(
    "No area has size -1, so nothing in the world is endless and the infinity readout in the HUD is unreachable.",
  );
  process.exit(1);
}
for (const key of endless) {
  if (game.area[key].protected !== true) {
    console.error(
      `area.${key} has size -1 but is not protected, so something can re-arm it and it stops being endless.`,
    );
    process.exit(1);
  }
}

// The areas appended most recently, named so that appending another in front of them fails here
// rather than surprising someone later. Add to this list when you append; never reorder it.
const LAST_APPENDED = [
  "mine1",
  "mine2",
  "mine3",
  "frstn9a2",
  "nfld3",
  "nfld4",
  "cata6a",
  "mine4",
];
const tail = areaKeys.slice(-LAST_APPENDED.length);
if (tail.join(",") !== LAST_APPENDED.join(",")) {
  console.error(
    `The end of the area registry is ${tail.join(", ")} where it should be ${LAST_APPENDED.join(", ")}.`,
  );
  console.error(
    "save() writes area sizes by position, so an area added anywhere but the end shifts every size in every existing save.",
  );
  console.error(
    "If you appended one, add it to LAST_APPENDED in tests/check-shared-state.js. If you inserted one, move it to the end instead.",
  );
  process.exit(1);
}

console.log(
  `check-shared-state: no registry entry shares a mutable object across ${REGISTRIES.length} registries, eqp.dummy is inert, and ${endless.length} endless area(s) sit at the end of the registry.`,
);
