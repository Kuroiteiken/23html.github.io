#!/usr/bin/env node
"use strict";

// Every creature the game can spawn, checked for the one statting mistake that
// makes content unplayable rather than merely hard: armour so high that the player
// cannot damage it at all, or an attack so high that it kills in a blow.
//
// WHY THIS EXISTS
//
// A creature's `aff` and `cls` are not percentages. When the player attacks,
// dmg_calc subtracts
//
//   def.str * (100 + def.aff[atype] * 5 + def.cls[ctype] * 5) / 100
//
// from the swing, so `cls: [58, 52, 66]` does not mean "58% resistant" -- it
// multiplies the creature's entire STR by 3.9 before subtracting it. Once that term
// passes the player's whole attack output the creature stops taking real damage,
// silently, with no error anywhere in the game. That is how the pack leader at the
// hollow shipped unkillable, and most of the deep undead behind it.
//
// WHY IT NO LONGER REWRITES THE FORMULA
//
// The formula above is quoted here to explain the failure, but nothing in this file
// computes it any more. This check used to parse js/data/creatures.js with regular
// expressions and reimplement the mitigation term in its own words -- and that copy
// had already drifted from the game: dmg_calc now floors a landed blow at a share
// of the swing (minimumLandedDamage) and lets weapon mastery pierce class
// resistance, and the copy knew about neither. So the check the agent instructions
// call critical was validating a formula the game had stopped using, and it stayed
// green while doing it, because both halves of its comparison used the same wrong
// arithmetic.
//
// tests/harness.js loads the real bundle, so the terms below come out of the real
// dmg_calc by measuring it rather than by restating it:
//
//   mitigation = (what a blow does to this creature with its armour stripped)
//              - (what the same blow does to it as statted)
//
// The two calls differ only in the creature's armour, so the difference IS the
// subtracted term, whatever dmg_calc currently does around it. The attack term is
// read the same way, by striking a player whose own defences have been zeroed.
//
// WHAT IS CHECKED
//
// Not "can a player of level N win", which needs a model of skills, equipment and
// titles that no static check can honestly pin down -- and note that the measurement
// above deliberately needs no such model, because both calls cancel everything that
// is not the creature. The budget is derived from the content the original game
// shipped and played fine:
//
//   mitigation = creature STR at its spawn level * its best-case class multiplier
//
// "Best-case" because the player picks the weapon: a creature may be nearly immune
// to edges as long as a point or a hammer gets through. The steepest thing the
// original game ever asks for is measured at startup and used as the ceiling, so
// this check cannot drift from its own justification.
//
// The rule that follows from it: a creature's aff and cls are a flavour dial, not a
// depth dial. Depth belongs in hp_r, str_r and stat_p, which enter the damage
// formula linearly instead of as a multiplier.

const { loadGame } = require("../tests/harness");

// Headroom over the steepest original creature. Small on purpose: the point is that
// depth is expressed through health and strength, not through the multiplier.
const BUDGET_HEADROOM = 1.15;

// Levels below this are ignored when measuring the budget. At level 1 a creature is
// all base and no curve, so dividing by the level produces a ceiling that says
// nothing about the game past the tutorial.
const BUDGET_FLOOR_LEVEL = 4;

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
  "wolf1",
  "wolfa1",
  "rat1",
  "rat2",
  "bat1",
  "sdummy",
  "tdummy",
  "wdummy",
  "default",
  "cbat",
  "stirge",
  // The test bench's skeleton. Written as skl1 until the harness made this list
  // checkable against the real registry and showed there is no such creature. A
  // Set entry matching nothing is silently inert, which is why the names below it
  // are reported rather than quietly kept.
  "skl",
  "zmb1",
  "gho1",
]);

// One weapon per damage class, all of them physical (atype 0), which is the attack
// type effectively every weapon in the game uses. The player chooses the class, so
// a creature is only as armoured as its softest side and the smallest of the three
// mitigations is the one that counts.
const REFERENCE_WEAPONS = ["knf2", "stk2", "stk1"];

// The probe's strength. Large enough that dmg_calc's landed-blow floor can never be
// what a measurement returns -- if the floor were reached, the difference between
// the two calls would stop being the mitigation term and start being an artefact of
// the floor. It does not model a player: it cancels out of the subtraction.
const PROBE_STRENGTH = 1e7;

// Areas whose contents are not content. Excluded from the checks as well as from
// the budget: nobody plays them, and a bench creature statted to be convenient
// would either set the ceiling or fail against it.
const BENCH_AREAS = new Set(["tst"]);

const game = loadGame();
const { creature, area, abl, wpn, deepCopy, lvlup, dmg_calc } = game;

// A name in ORIGINAL or EXEMPT that matches no creature exempts nothing, and does
// it in silence. Reported rather than thrown: which creature a stale name meant is
// a content decision, and a wrong guess here would move the budget.
const unknownNames = [...ORIGINAL, ...Object.keys(EXEMPT)].filter(
  (name) => !creature[name],
);
if (unknownNames.length > 0) {
  console.warn(
    `check-combat: ${unknownNames.length} name(s) in ORIGINAL/EXEMPT match no creature and are therefore inert -- ${unknownNames.join(", ")}.`,
  );
}

// Every roll lands on its midpoint, so lvlup gives the expected stat gain and
// dmg_calc's critical-hit roll never fires. The real lvlup and the real dmg_calc
// still run; only the randomness is pinned, so these figures are reproducible.
game.random = () => 0.5;

// The player is a shared global that lvlup writes into cumulatively, so every
// measurement starts from this snapshot. deepCopy keeps functions by reference, so
// a restored player still has its own stat_r and efficiency.
const pristinePlayer = deepCopy(game.you);

// A player-shaped probe rather than a player. Its own defences are flattened so the
// creature's attack term arrives unopposed, and its strength is set after stat_r so
// nothing recomputes it away.
function probe(weaponKey) {
  const you = game.you;
  Object.assign(you, deepCopy(pristinePlayer));
  you.eqp[0] = wpn[weaponKey];
  you.stat_r();
  you.str = PROBE_STRENGTH;
  you.hp = you.hpmax;
  you.sat = you.satmax;
  you.caff = you.caff.map(() => 0);
  you.ccls = you.ccls.map(() => 0);
  you.cmaff = you.cmaff.map(() => 0);
  return you;
}

function spawn(key, lvl) {
  const mob = deepCopy(creature[key]);
  if (lvl > 1) lvlup(mob, lvl - 1);
  mob.stat_r();
  mob.hp = mob.hpmax;
  return mob;
}

function stripArmour(mob) {
  mob.str = 0;
  mob.aff = mob.aff.map(() => 0);
  mob.cls = mob.cls.map(() => 0);
  return mob;
}

// The subtracted term, read out of the real dmg_calc: the same blow, by the same
// probe, against the same creature with and without its armour. Everything that is
// not the creature's armour is identical between the two calls and cancels.
function mitigation(key, lvl) {
  let best = null;
  for (const weaponKey of REFERENCE_WEAPONS) {
    const you = probe(weaponKey);
    const armoured = spawn(key, lvl);
    game.global.current_m = armoured;
    const withArmour = dmg_calc(you, armoured, abl.default);
    const bare = stripArmour(spawn(key, lvl));
    game.global.current_m = bare;
    const withoutArmour = dmg_calc(you, bare, abl.default);
    const value = withoutArmour - withArmour;
    // Smallest wins: the player picks the class that gets through.
    if (best === null || value < best.value)
      best = { value, weaponKey, ctype: wpn[weaponKey].ctype };
  }
  return best;
}

// The creature's own output, struck against a probe with nothing left to resist it.
// attack() picks the armour slot with `2 + rand(4)`, so all four are measured and
// the worst is kept: the player does not choose which piece is hit.
function attackPower(key, lvl) {
  let worst = null;
  const you = probe(REFERENCE_WEAPONS[0]);
  you.str = 0;
  const mob = spawn(key, lvl);
  game.global.current_m = mob;
  for (let slot = 2; slot <= 5; slot++) {
    const piece = you.eqp[slot];
    game.global.target = stripArmour(deepCopy(piece));
    game.global.t_n = slot;
    const value = dmg_calc(mob, you, abl.default);
    if (worst === null || value > worst.value) worst = { value, slot };
  }
  return worst;
}

// --- Populations -------------------------------------------------------------

// Read off the real area objects, so a `get lvlmax()` that tracks the player is
// resolved by the game rather than matched by a regular expression.
const creatureKeyOf = new Map(
  Object.entries(creature).map(([key, value]) => [value, key]),
);

const populations = [];
for (const [areaKey, zone] of Object.entries(area)) {
  if (!Array.isArray(zone.pop)) continue;
  for (const entry of zone.pop) {
    const key = creatureKeyOf.get(entry.crt);
    if (!key) continue;
    populations.push({
      area: areaKey,
      creature: key,
      lvlmin: Number(entry.lvlmin),
      lvlmax: Number(entry.lvlmax),
      chance: entry.c,
    });
  }
}

if (populations.length < 40) {
  console.error(
    `check-combat: found only ${populations.length} population entries, which cannot be right. Has js/world/areas.js stopped declaring pop arrays?`,
  );
  process.exit(1);
}

// z_bake sums these into popc, so one entry with no usable chance stops the whole
// area spawning anything. Cheap to check while the areas are already in hand.
const chanceless = populations.filter(
  (entry) => entry.chance === undefined || Number.isNaN(Number(entry.chance)),
);
if (chanceless.length > 0) {
  console.error("\nPopulation entries with no usable spawn chance:\n");
  for (const entry of chanceless)
    console.error(
      `  area.${entry.area} / ${entry.creature}: c is not a number`,
    );
  console.error(
    "\nz_bake sums these into popc, so one of them stops the area spawning anything at all.",
  );
  process.exit(1);
}

function levelsOf(entry) {
  return [...new Set([entry.lvlmin, entry.lvlmax])].filter(
    (lvl) => Number.isFinite(lvl) && lvl >= 1,
  );
}

// --- Budget ------------------------------------------------------------------

let steepest = 0;
let steepestAt = "";
let steepestAttack = 0;
let steepestAttackAt = "";
for (const entry of populations) {
  if (!ORIGINAL.has(entry.creature)) continue;
  if (BENCH_AREAS.has(entry.area)) continue;
  for (const lvl of levelsOf(entry)) {
    // A per-level ratio taken at level 1 or 2 is dominated by the creature's flat
    // base rather than its curve, which makes a nonsense ceiling out of the
    // weakest thing in the game.
    if (lvl < BUDGET_FLOOR_LEVEL) continue;
    const perLevel = mitigation(entry.creature, lvl).value / lvl;
    if (perLevel > steepest) {
      steepest = perLevel;
      steepestAt = `${entry.creature} at level ${lvl} in area.${entry.area}`;
    }
    const attackPerLevel = attackPower(entry.creature, lvl).value / lvl;
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

// --- Checks ------------------------------------------------------------------

const problems = [];
const checked = new Set();

for (const entry of populations) {
  if (EXEMPT[entry.creature] || ORIGINAL.has(entry.creature)) continue;
  if (BENCH_AREAS.has(entry.area)) continue;
  if (creature[entry.creature].hp_r === undefined) continue; // unstatted stub
  checked.add(entry.creature);

  // The floor of the band is what a first arrival meets, and the ceiling is what a
  // returning player meets on the same visit. Both have to be beatable.
  for (const lvl of levelsOf(entry)) {
    const mob = creature[entry.creature];
    const hits = attackPower(entry.creature, lvl);
    const hitsAllowed = attackBudgetPerLevel * lvl;
    if (hits.value > hitsAllowed) {
      problems.push(
        `area.${entry.area} / ${entry.creature} at level ${lvl}: hits for ${hits.value.toFixed(0)} against a budget of ${hitsAllowed.toFixed(0)}.\n` +
          `      Measured through dmg_calc against an undefended target, worst struck slot eqp[${hits.slot}].\n` +
          `      Its weapon's eqp[0].aff[${mob.atype}] and eqp[0].cls[${mob.ctype}] enter the attack at ten times each.\n` +
          `      Check that its own resistance array was not copied into its weapon's -- wolf1 resists physical at 22 and attacks with 12.`,
      );
    }

    const value = mitigation(entry.creature, lvl);
    const allowed = budgetPerLevel * lvl;
    if (value.value <= allowed) continue;
    // What would bring it inside the budget, so fixing it is arithmetic rather
    // than trial and error. The relation between cls and the subtracted term is
    // stated in the agent instructions and is what the measurement above confirms.
    const worstClass = Math.max(...mob.cls);
    const shrink = allowed / value.value;
    problems.push(
      `area.${entry.area} / ${entry.creature} at level ${lvl}: mitigation ${value.value.toFixed(0)} against a budget of ${allowed.toFixed(0)}.\n` +
        `      Measured through dmg_calc as the difference a ${value.weaponKey} blow makes with and without its armour (class ${value.ctype}, the softest of the three).\n` +
        `      aff ${JSON.stringify(mob.aff)}, cls ${JSON.stringify(mob.cls)}: both enter the subtracted term at five times each.\n` +
        `      To fit, the term has to come down to ${(shrink * 100).toFixed(0)}% of what it is -- lower the class value on its softest side (currently ${worstClass} at the hardest), lower aff[0], or lower str_r / stat_p[1].`,
    );
  }
}

console.log(
  `check-combat: budgets measured through the real dmg_calc -- ${steepest.toFixed(1)} mitigation per level (${steepestAt}) and ${steepestAttack.toFixed(1)} attack per level (${steepestAttackAt}), allowed up to ${budgetPerLevel.toFixed(1)} and ${attackBudgetPerLevel.toFixed(1)}.`,
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
