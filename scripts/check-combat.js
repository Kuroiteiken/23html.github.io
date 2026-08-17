#!/usr/bin/env node
"use strict";

// Every creature the game can spawn, checked for the one statting mistake that
// makes content unplayable rather than merely hard: armour so high that the player
// cannot damage it at all.
//
// WHY THIS EXISTS
//
// A creature's `aff` and `cls` are not percentages. When the player attacks,
// dmg_calc subtracts
//
//   def.str * (100 + def.aff[weapon.atype] * 5 + def.cls[weapon.ctype] * 5) / 100
//
// from the attack, so `cls: [58, 52, 66]` does not mean "58% resistant" -- it
// multiplies the creature's entire STR by 3.9 before subtracting it. Damage is then
// floored at zero. Once that term passes the player's whole attack output the
// creature stops taking damage, silently, with no error anywhere in the game. That
// is how the pack leader at the hollow shipped unkillable, and most of the deep
// undead behind it.
//
// WHAT IS CHECKED
//
// Not "can a player of level N win", which needs a model of the player's skills,
// equipment and titles that no static check can honestly pin down. Instead the
// budget is derived from the content the original game shipped and played fine:
//
//   mitigation = creature STR at its spawn level * its best-case class multiplier
//
// "Best-case" because the player picks the weapon: a creature may be nearly immune
// to edges as long as a point or a hammer gets through. The steepest thing the
// original game ever asked for is measured at startup and used as the ceiling, so
// this check cannot drift from its own justification.
//
// The rule that follows from it: a creature's aff and cls are a flavour dial, not a
// depth dial. Depth belongs in hp_r, str_r and stat_p, which enter the damage
// formula linearly instead of as a multiplier.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

// Creatures that are deliberately unfightable, each with its reason. A creature is
// only exempt if it is justified here, never silently.
const EXEMPT = {
  // 100,000,000 hp and a battle_ai that never attacks. A nightmare to wake from,
  // not a fight to win. Tracked in docs/PROPOSALS.md.
  ngtmr1: "the nightmare is escaped, not defeated",
  // 9000 hp and a battle_ai that returns false.
  lrck: "the mimic has no working battle_ai",
};

// The creatures that came with the game, before any content was added to it. They
// define the budget, so they are exempt from it by construction -- if one of them
// ever fails, the measurement is wrong rather than the creature.
const ORIGINAL = new Set([
  "slm1",
  "slm2",
  "slm3",
  "slm4",
  "slm5",
  "wolf1",
  "golem1",
  "golem2",
  "golem3",
  "golem4",
  "skl",
  "kksh",
  "lsprt",
  "sdummy",
  "tdummy",
  "wdummy",
  "default",
]);

// Headroom over the steepest original creature. Small on purpose: the point is that
// depth is expressed through health and strength, not through the multiplier.
const BUDGET_HEADROOM = 1.15;

// Levels below this are ignored when measuring the budget. At level 1 a creature is
// all base and no curve, so dividing by the level produces a ceiling that says
// nothing about the game past the tutorial.
const BUDGET_FLOOR_LEVEL = 4;

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function parseCreatures(source) {
  const names = [
    ...source.matchAll(/^creature\.([A-Za-z0-9_]+) = new Creature\(\);/gm),
  ].map((m) => m[1]);
  const lines = source.split("\n");
  const out = {};
  for (const name of names) {
    const body = lines
      .filter((line) => line.startsWith(`creature.${name}.`))
      .join("\n");
    const num = (key) => {
      const m = body.match(new RegExp(`\\.${key} = (-?[0-9.]+)`));
      return m ? Number(m[1]) : undefined;
    };
    const own = (key) => {
      const m = body.match(
        new RegExp(`^creature\\.${name}\\.${key} = \\[([^\\]]+)\\]`, "m"),
      );
      return m ? m[1].split(",").map((v) => Number(v.trim())) : undefined;
    };
    // The weapon arrays live on `creature.x.eqp[0].aff`, so the key itself carries
    // regex metacharacters and is passed already escaped.
    const arrayOf = (escapedKey) => {
      const m = body.match(
        new RegExp(
          `^creature\\.${name}\\.${escapedKey} = \\[([^\\]]+)\\]`,
          "m",
        ),
      );
      return m ? m[1].split(",").map((v) => Number(v.trim())) : undefined;
    };
    out[name] = {
      name,
      hp_r: num("hp_r"),
      str_r: num("str_r") ?? 1,
      atype: num("atype") ?? 0,
      ctype: num("ctype") ?? 0,
      aff: own("aff") ?? [0, 0, 0, 0, 0, 0, 0],
      cls: own("cls") ?? [0, 0, 0],
      stat_p: own("stat_p") ?? [1, 1, 1, 1],
      eqpAff: arrayOf("eqp\\[0\\]\\.aff") ?? [0, 0, 0, 0, 0, 0, 0],
      eqpCls: arrayOf("eqp\\[0\\]\\.cls") ?? [0, 0, 0],
    };
  }
  return out;
}

// Every population entry the game can roll, with the area it belongs to. A ceiling
// written as a getter tracks the player, and `trackingLevel(floor, ...)` names the
// authored ceiling as its first argument -- that floor is what a first arrival meets.
function parsePopulations(source) {
  const entries = [];
  const areas = [...source.matchAll(/^area\.([a-z0-9]+) = new Area\(\);/gm)];
  const pattern =
    /crt: creature\.([A-Za-z0-9_]+),\s*(?:\n\s*)?lvlmin: (\d+),\s*(?:\n\s*)?(?:lvlmax: (\d+)|get lvlmax\(\) \{\s*\n\s*return trackingLevel\((\d+),)/g;
  for (const match of source.matchAll(pattern)) {
    const before = areas.filter((a) => a.index < match.index);
    entries.push({
      area: before.length ? before[before.length - 1][1] : "?",
      creature: match[1],
      lvlmin: Number(match[2]),
      lvlmax: Number(match[3] ?? match[4]),
    });
  }
  return entries;
}

// lvlup, js/systems/simulation.js. STR gains randf(t * stat_p[1], 2 * t * stat_p[1]),
// whose expected value is the midpoint.
function strAtLevel(creature, lvl) {
  return creature.str_r + 1.5 * Math.max(0, lvl - 1) * creature.stat_p[1];
}

// The player chooses the weapon class, so the creature's armour is only as strong as
// its weakest of the three. Physical is the attack type for effectively every weapon
// in the game, so aff[0] applies throughout.
function bestClassMultiplier(creature) {
  const physical = creature.aff[0] * 5;
  return Math.min(...creature.cls.map((c) => 100 + physical + c * 5)) / 100;
}

function mitigation(creature, lvl) {
  return strAtLevel(creature, lvl) * bestClassMultiplier(creature);
}

// The other half of the same mistake. A creature's own attack is
//
//   str * (100 + eqp[0].aff[atype] * 10 + eqp[0].cls[ctype] * 10) / 100
//
// at TEN times each, not five, and those are the creature's weapon arrays -- not the
// resistance arrays that share their shape. Copying one into the other makes a
// creature that shrugs off a blow also land one ten times harder. Being unable to
// damage something is the louder failure, but being flattened in three blows by a
// chapter's first boss is the same error wearing the other coat.
function attackPower(creature, lvl) {
  const weaponAff = creature.eqpAff[creature.atype] ?? 0;
  const weaponCls = creature.eqpCls[creature.ctype] ?? 0;
  return (
    (strAtLevel(creature, lvl) * (100 + weaponAff * 10 + weaponCls * 10)) / 100
  );
}

const creatures = parseCreatures(read("js/data/creatures.js"));
const populations = parsePopulations(read("js/world/areas.js"));

if (populations.length < 40) {
  console.error(
    `check-combat: parsed only ${populations.length} population entries, which cannot be right. The parser has drifted from js/world/areas.js.`,
  );
  process.exit(1);
}

// Measure the budget from the original creatures, at every level any area spawns
// them at, so the ceiling is a fact about shipped content rather than a guess.
let steepest = 0;
let steepestAt = "";
let steepestAttack = 0;
let steepestAttackAt = "";
for (const entry of populations) {
  if (!ORIGINAL.has(entry.creature)) continue;
  // area.tst is a developer test bench, not content anybody plays, and its level 1
  // skeleton would otherwise set the budget on its own.
  if (entry.area === "tst") continue;
  const creature = creatures[entry.creature];
  if (!creature || creature.hp_r === undefined) continue;
  for (const lvl of new Set([entry.lvlmin, entry.lvlmax])) {
    // A per-level ratio taken at level 1 or 2 is dominated by the creature's flat
    // base rather than its curve, which makes a nonsense ceiling out of the
    // weakest thing in the game.
    if (lvl < BUDGET_FLOOR_LEVEL) continue;
    const perLevel = mitigation(creature, lvl) / lvl;
    if (perLevel > steepest) {
      steepest = perLevel;
      steepestAt = `${entry.creature} at level ${lvl} in area.${entry.area}`;
    }
    const attackPerLevel = attackPower(creature, lvl) / lvl;
    if (attackPerLevel > steepestAttack) {
      steepestAttack = attackPerLevel;
      steepestAttackAt = `${entry.creature} at level ${lvl} in area.${entry.area}`;
    }
  }
}

if (steepest <= 0) {
  console.error(
    "check-combat: could not measure a budget from the original creatures. Has js/world/areas.js stopped spawning them?",
  );
  process.exit(1);
}

const budgetPerLevel = steepest * BUDGET_HEADROOM;
const attackBudgetPerLevel = steepestAttack * BUDGET_HEADROOM;

const problems = [];
const checked = new Set();

for (const entry of populations) {
  const creature = creatures[entry.creature];
  if (!creature || creature.hp_r === undefined) continue; // unstatted stub
  if (EXEMPT[entry.creature] || ORIGINAL.has(entry.creature)) continue;
  checked.add(entry.creature);

  // The floor of the band is what a first arrival meets, and the ceiling is what a
  // returning player meets on the same visit. Both have to be beatable.
  for (const lvl of new Set([entry.lvlmin, entry.lvlmax])) {
    if (lvl < 1) continue;
    const hits = attackPower(creature, lvl);
    const hitsAllowed = attackBudgetPerLevel * lvl;
    if (hits > hitsAllowed) {
      const weaponAff = creature.eqpAff[creature.atype] ?? 0;
      const weaponCls = creature.eqpCls[creature.ctype] ?? 0;
      problems.push(
        `area.${entry.area} / ${entry.creature} at level ${lvl}: hits for ${hits.toFixed(0)} against a budget of ${hitsAllowed.toFixed(0)}.\n` +
          `      STR ${strAtLevel(creature, lvl).toFixed(0)} multiplied by ${((100 + weaponAff * 10 + weaponCls * 10) / 100).toFixed(2)} from its weapon (eqp[0].aff[${creature.atype}] ${weaponAff}, eqp[0].cls[${creature.ctype}] ${weaponCls}, at ten times each).\n` +
          `      Check that its own resistance array was not copied into its weapon's -- wolf1 resists physical at 22 and attacks with 12.`,
      );
    }

    const value = mitigation(creature, lvl);
    const allowed = budgetPerLevel * lvl;
    if (value <= allowed) continue;
    const multiplier = bestClassMultiplier(creature);
    const str = strAtLevel(creature, lvl);
    // What would bring it inside the budget, so fixing it is arithmetic rather
    // than trial and error.
    const targetMultiplier = allowed / str;
    const worstClass = Math.max(...creature.cls);
    const roomFromCls =
      (targetMultiplier * 100 - 100 - creature.aff[0] * 5) / 5;
    problems.push(
      `area.${entry.area} / ${entry.creature} at level ${lvl}: mitigation ${value.toFixed(0)} against a budget of ${allowed.toFixed(0)}.\n` +
        `      STR ${str.toFixed(0)} multiplied by ${multiplier.toFixed(2)} (aff[0] ${creature.aff[0]}, cls ${JSON.stringify(creature.cls)}, best class wins).\n` +
        `      To fit: bring the multiplier to ${targetMultiplier.toFixed(2)} or under -- with aff[0] ${creature.aff[0]} that needs a class value of ${Math.floor(roomFromCls)} or lower on its softest side (currently ${worstClass} at the hardest), or lower str_r / stat_p[1].`,
    );
  }
}

console.log(
  `check-combat: budgets measured from the original creatures -- ${steepest.toFixed(1)} mitigation per level (${steepestAt}) and ${steepestAttack.toFixed(1)} attack per level (${steepestAttackAt}), allowed up to ${budgetPerLevel.toFixed(1)} and ${attackBudgetPerLevel.toFixed(1)}.`,
);

if (problems.length > 0) {
  console.error("\nCreatures statted past what the player can cut through:\n");
  for (const problem of problems) console.error("  " + problem);
  console.error(
    `\n${problems.length} problem(s) across ${checked.size} added creatures. ` +
      `aff and cls are multiplied by 5 into a creature's defence, so they are not ` +
      `percentages and they are not where depth belongs -- put depth in hp_r, str_r ` +
      `and stat_p, which the damage formula treats linearly.`,
  );
  process.exit(1);
}

console.log(
  `check-combat: all ${checked.size} added creatures across ${populations.length} population entries stay inside it.`,
);
