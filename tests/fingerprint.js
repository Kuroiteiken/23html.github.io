#!/usr/bin/env node
"use strict";

// A behaviour fingerprint of the whole bundle, printed to stdout.
//
// WHAT IT IS FOR
//
// Moving code between the files under js/ is supposed to change nothing: the build
// concatenates them into one scope, so a function is where it is only for a reader's
// benefit. "Supposed to" is not evidence, though, and this codebase makes the move
// riskier than it looks -- source order is load order, the interface builds itself at
// definition time, and a `const` moved above its first use fails where a `function`
// would not.
//
// So a move is verified rather than trusted:
//
//   node tests/fingerprint.js > before.txt        # npm run fingerprint --silent
//   ... make the move, npm run build ...
//   node tests/fingerprint.js > after.txt
//   diff before.txt after.txt      # any output at all means the move was not pure
//
// This is what confirmed js/systems/combat.js and js/utils/{dom,object}.js came out
// of their old homes without changing anything: 1,440 lines of output, identical.
//
// WHAT IT COVERS
//
// Every global function name, so a lost or renamed one shows. Every registry's key
// list, so a content record that failed to define itself shows. The numeric shape of
// items, weapons, equipment and creatures, so a changed stat shows. The damage path
// itself across creatures, levels and weapon classes, which is the part with the most
// arithmetic and the least visible failure mode. And every item's use handler, called
// against a fixed player, recording what it changed -- which is what makes a rewrite
// of those handlers checkable rather than merely plausible.
//
// It is deliberately NOT a test: there is no expected output to store, because the
// figures are meant to change whenever behaviour legitimately changes. It answers one
// question -- "did this refactor change anything?" -- and answers it by comparison.

const { loadGame } = require("./harness");

const game = loadGame();
// Pinned so the fingerprint is reproducible. Every roll lands on its midpoint, which
// makes lvlup deterministic and keeps dmg_calc's critical roll from firing.
game.random = () => 0.5;

const out = [];
const say = (...parts) => out.push(parts.join(" "));

const REGISTRIES = [
  "item",
  "wpn",
  "eqp",
  "acc",
  "sld",
  "creature",
  "area",
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
  "sector",
  "lore",
  "container",
  "mastery",
];

// Fields worth watching on a content record. Anything undefined is skipped, so the
// list can name more than any one registry uses.
const FIELDS = [
  "id",
  "val",
  "str",
  "int",
  "agl",
  "spd",
  "dp",
  "dpmax",
  "hp_r",
  "str_r",
  "rar",
  "stype",
  "type",
  "atype",
  "ctype",
  "wtype",
  "slot",
  "lvl",
  "exp",
  "stat_p",
  "aff",
  "cls",
  "price",
];

const CLASS_WEAPONS = ["knf2", "stk2", "stk1"];
const LEVELS = [1, 5, 12, 25];

say(
  "globals:",
  Object.keys(game)
    .filter((key) => typeof game[key] === "function")
    .sort()
    .join(","),
);

for (const registry of REGISTRIES) {
  const records = game[registry];
  if (!records) {
    say(registry, "MISSING");
    continue;
  }
  const keys = Object.keys(records).sort();
  say(registry, keys.length, keys.join(","));
}

for (const registry of ["item", "wpn", "eqp", "creature"]) {
  for (const key of Object.keys(game[registry]).sort()) {
    const record = game[registry][key];
    if (!record || typeof record !== "object") continue;
    const shape = FIELDS.filter((field) => record[field] !== undefined)
      .map((field) => `${field}=${JSON.stringify(record[field])}`)
      .join(" ");
    say(`${registry}.${key}`, shape, `name=${record.name}`);
  }
}

const pristinePlayer = game.deepCopy(game.you);

function player(weaponKey, lvl) {
  const you = game.you;
  Object.assign(you, game.deepCopy(pristinePlayer));
  you.eqp[0] = game.wpn[weaponKey];
  you.stat_r();
  if (lvl > 1) game.lvlup(you, lvl - 1);
  you.stat_r();
  you.hp = you.hpmax;
  you.sat = you.satmax;
  return you;
}

function spawn(key, lvl) {
  const mob = game.deepCopy(game.creature[key]);
  if (lvl > 1) game.lvlup(mob, lvl - 1);
  mob.stat_r();
  mob.hp = mob.hpmax;
  return mob;
}

// Errors are recorded rather than thrown: a call that starts failing is exactly the
// kind of difference this is here to surface, and stopping at the first one would
// hide the rest.
function attempt(f) {
  try {
    return f();
  } catch (error) {
    return `ERR:${error.message}`;
  }
}

for (const key of Object.keys(game.creature).sort()) {
  if (game.creature[key].hp_r === undefined) continue; // unstatted stub
  for (const lvl of LEVELS) {
    for (const weaponKey of CLASS_WEAPONS) {
      const you = player(weaponKey, lvl);
      const mob = spawn(key, lvl);
      game.global.current_m = mob;
      const damage = attempt(() => game.dmg_calc(you, mob, game.abl.default));
      const chance = attempt(() => game.hit_calc(1));
      say("dmg", key, lvl, weaponKey, damage, "hit", chance);
      game.global.target = you.eqp[3];
      say(
        "cdmg",
        key,
        lvl,
        weaponKey,
        attempt(() => game.dmg_calc(mob, you, game.abl.default)),
      );
    }
  }
}

// --- item use handlers ------------------------------------------------------
//
// Each handler is called against the same fixed player and the same stock, and what it
// changed is recorded: the player's own numbers, the stack it consumed from, the stat
// counters it bumped, whether it refreshed the energy readout, and the last line it
// wrote to the log. Failures are recorded, not thrown, for the reason given above.
const WATCHED_PLAYER = [
  "sat",
  "satmax",
  "hp",
  "hpmax",
  "luck",
  "wealth",
  "str_r",
  "int_r",
  "agl_r",
  "spd_r",
  "exp",
  "karma",
  "ki",
];

// msg() builds a row and writes the coloured text into a span inside it, so the text
// is one level down rather than on the row itself.
function logText(node) {
  let text = node.innerHTML || "";
  for (const child of node.children) text += logText(child);
  return text;
}

function fixedPlayer() {
  const you = game.you;
  Object.assign(you, game.deepCopy(pristinePlayer));
  you.stat_r();
  you.satmax = 100;
  you.hpmax = 100;
  you.sat = 40;
  you.hp = 40;
  return you;
}

for (const key of Object.keys(game.item).sort()) {
  const record = game.item[key];
  if (typeof record.use !== "function") {
    say("use", key, "NO-HANDLER");
    continue;
  }
  const you = fixedPlayer();
  record.amount = 5;
  // Emptied first: the log is capped at msgs_max, so once it is full a handler that
  // writes one line and a handler that writes none both leave the row count alone.
  // Cleared, both the count and the text below mean something.
  game.clearMessageLog();
  const statBefore = JSON.stringify(game.global.stat);
  const readoutBefore = game.dom.d5_3_1.innerHTML;
  const outcome = attempt(() => {
    record.use();
    return "ok";
  });
  const after = JSON.parse(statBefore);
  const now = game.global.stat;
  const bumped = Object.keys(now)
    .filter(
      (field) => JSON.stringify(now[field]) !== JSON.stringify(after[field]),
    )
    .sort()
    .map((field) => `${field}=${JSON.stringify(now[field])}`)
    .join(",");
  say(
    "use",
    key,
    outcome,
    "amount=" + record.amount,
    WATCHED_PLAYER.map(
      (field) => `${field}=${JSON.stringify(you[field])}`,
    ).join(" "),
    "stat[" + bumped + "]",
    "readoutChanged=" + (game.dom.d5_3_1.innerHTML !== readoutBefore),
    "logRows=" + game.dom.mscont.children.length,
    "log=" + JSON.stringify(logText(game.dom.mscont)),
  );
}

say(
  "minLanded:",
  [0, 1, 10, 100, 1000, 12345]
    .map((n) => game.minimumLandedDamage(n))
    .join(","),
);
say("MINIMUM_LANDED_SHARE:", game.MINIMUM_LANDED_SHARE);

console.log(out.join("\n"));
