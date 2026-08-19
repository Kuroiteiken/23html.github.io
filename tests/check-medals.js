// The dojo's rank medals, checked as behaviour.
//
// All six shipped inert: no stats, no oneq, and "proc" where the description belongs. So
// acc.medl5, handed over at level 45 for clearing the ninth trial, was a reward that did
// nothing, and the other five were the same thing without even a grant site. This pins the
// three properties that were missing, each measured rather than read off the source.
//
// 1. Worn only. oneq followed by onuneq has to leave every resistance array exactly where
//    it started. Without that a medal keeps paying after it comes off, which is the defect
//    the titles still have.
// 2. No dead indices. Of thirty-nine creatures, thirty-three attack with atype 0, four with
//    air and two with water; earth, fire, light and dark are used by nothing, and no
//    creature is type 0 or type 5. A resistance value on any of those is a bonus line the
//    player can never feel -- a quieter version of the original bug. The live sets are
//    measured from the creature registry here, so adding a fire-breathing creature later
//    widens what is allowed instead of failing.
// 3. The printed bonus matches the object. The strings were generated from the values once;
//    this keeps them from drifting apart afterwards.
//
// Plus the ladder itself: medl5 carries no family term and is the one every player who
// reaches level 45 owns, so it has to reduce damage from every creature sampled, and
// medl6, the last rank, has to be at least as good as medl5 everywhere.
const { loadGame } = require("./harness");

const KEYS = ["medl1", "medl2", "medl3", "medl4", "medl5", "medl6"];

// Creature, its level, and a player level that would plausibly be fighting it. Matching the
// two matters: a level-45 player takes zero from a level-8 wolf, and a zero baseline makes
// "the medal reduced the damage" impossible to assert.
const SAMPLES = [
  { mob: "wolf1", mobLvl: 8, lvl: 10, label: "wolf1 8 vs player 10 (beast)" },
  { mob: "zmbk", mobLvl: 20, lvl: 25, label: "zmbk 20 vs player 25 (undead)" },
  {
    mob: "dcrps1",
    mobLvl: 28,
    lvl: 35,
    label: "dcrps1 28 vs player 35 (undead)",
  },
];

// Which array each printed label reads from, so the text can be checked against the object.
// caff and cmaff are indexed; ccls is positional.
const LABELS = [
  { en: "Physical DEF", tr: "Fiziksel SAV", array: "caff", index: 0 },
  { en: "Air RES", tr: "Hava DİRENÇ", array: "caff", index: 1 },
  { en: "Water RES", tr: "Su DİRENÇ", array: "caff", index: 4 },
  { en: "Edged DEF", tr: "Kesici SAV", array: "ccls", index: 0 },
  { en: "Piercing DEF", tr: "Delici SAV", array: "ccls", index: 1 },
  { en: "Blunt DEF", tr: "Künt SAV", array: "ccls", index: 2 },
  { en: "Beast Class DEF", tr: "Canavar Sınıfı SAV", array: "cmaff", index: 1 },
  {
    en: "Undead Class DEF",
    tr: "Ölümsüz Sınıfı SAV",
    array: "cmaff",
    index: 2,
  },
  {
    en: "Elemental Class DEF",
    tr: "Element Sınıfı SAV",
    array: "cmaff",
    index: 3,
  },
  { en: "Plant Class DEF", tr: "Bitki Sınıfı SAV", array: "cmaff", index: 4 },
];

const failures = [];
function fail(message) {
  failures.push(message);
  console.error(`  FAIL ${message}`);
}

const game = loadGame();
const { you, acc, creature } = game;

// ---------------------------------------------------------------- worn only

console.log(
  "worn only -- oneq then onuneq returns every array to where it was",
);
for (const key of KEYS) {
  const medal = acc[key];
  const snapshot = () => JSON.stringify([you.caff, you.ccls, you.cmaff]);
  const before = snapshot();
  medal.oneq();
  const during = snapshot();
  medal.onuneq();
  const after = snapshot();
  if (during === before)
    fail(`${key}: oneq changed nothing, so the medal is inert`);
  else if (after !== before)
    fail(
      `${key}: onuneq did not undo oneq\n    before ${before}\n    after  ${after}`,
    );
  else console.log(`  ok   ${key}`);
}

// -------------------------------------------------------------- live indices

const liveAtype = new Set(Object.values(creature).map((c) => c.atype));
const liveType = new Set(Object.values(creature).map((c) => c.type));

console.log("");
console.log(
  `no value on an index nothing rolls (live atype ${[...liveAtype].sort().join(",")}; live type ${[...liveType].sort().join(",")})`,
);
for (const key of KEYS) {
  const medal = acc[key];
  const dead = [];
  medal.caff.forEach((v, i) => {
    if (v && !liveAtype.has(i)) dead.push(`caff[${i}]=${v}`);
  });
  medal.cmaff.forEach((v, i) => {
    if (v && !liveType.has(i)) dead.push(`cmaff[${i}]=${v}`);
  });
  if (dead.length)
    fail(`${key}: resistance nothing can trigger -- ${dead.join(", ")}`);
  else console.log(`  ok   ${key}`);
}

// ------------------------------------------------------- text matches object

console.log("");
console.log("the printed bonus agrees with the values on the object");
const locales = {
  en: require("../locales/en.json"),
  tr: require("../locales/tr.json"),
};
for (const key of KEYS) {
  const medal = acc[key];
  for (const [code, locale] of Object.entries(locales)) {
    const node = locale.content.acc[key];
    if (!node || typeof node.bonus !== "string") {
      fail(`${key} (${code}): no bonus string`);
      continue;
    }
    if (/^\s*(proc|işlem)\s*$/i.test(node.desc || "")) {
      fail(`${key} (${code}): description is still the placeholder`);
      continue;
    }
    const stripped = node.bonus.replace(/<[^>]*>/g, "\n");
    let mismatched = null;
    for (const entry of LABELS) {
      const expected = medal[entry.array][entry.index];
      const found = new RegExp(
        `${entry[code].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\+(\\d+)`,
      ).exec(stripped);
      const printed = found ? Number(found[1]) : 0;
      if (printed !== expected) {
        mismatched = `${entry[code]}: text says +${printed}, object has +${expected}`;
        break;
      }
    }
    if (mismatched) fail(`${key} (${code}): ${mismatched}`);
  }
}
if (!failures.length)
  console.log(`  ok   all ${KEYS.length} medals, both locales`);

// ------------------------------------------------------------- damage taken

// A fresh context per blow: oneq writes onto the player, so reusing one would stack.
function blow(medalKey, sample) {
  const g = loadGame();
  g.random = () => 0.5;
  const mob = g.deepCopy(g.creature[sample.mob]);
  mob.stat_r();
  g.lvlup(mob, sample.mobLvl);
  mob.stat_r();
  g.global.current_m = mob;
  g.you.stat_r();
  g.lvlup(g.you, sample.lvl);
  g.you.stat_r();
  g.you.caff = g.you.caff.map(() => 0);
  g.you.ccls = g.you.ccls.map(() => 0);
  g.you.cmaff = g.you.cmaff.map(() => 0);
  const armour = g.deepCopy(g.eqp.dummy);
  armour.str = 25;
  armour.dp = armour.dpmax = 100;
  armour.aff = [4, 1, 7, 13, 2, 9, -5];
  armour.cls = [3, 3, 3];
  g.global.target = armour;
  g.global.t_n = 3;
  const shield = g.deepCopy(g.sld.hpt);
  shield.dp = shield.dpmax;
  g.you.eqp[1] = shield;
  if (medalKey) g.acc[medalKey].oneq();
  return g.dmg_calc(mob, g.you, g.abl.default);
}

console.log("");
console.log(
  "damage taken, player matched to the creature, hoplite shield, chest struck",
);
for (const sample of SAMPLES) {
  const base = blow(null, sample);
  if (base <= 0) {
    fail(`${sample.label}: baseline blow is ${base}, nothing to reduce`);
    continue;
  }
  const taken = {};
  const row = KEYS.map((key) => {
    taken[key] = blow(key, sample);
    const pct = ((1 - taken[key] / base) * 100).toFixed(1);
    return `${key} -${pct.padStart(4)}%`;
  });
  console.log(
    `  ${sample.label.padEnd(30)} base ${base.toFixed(1).padStart(6)}  ${row.join("  ")}`,
  );
  if (taken.medl5 >= base)
    fail(
      `${sample.label}: medl5 did not reduce the blow (${taken.medl5} vs ${base})`,
    );
  if (taken.medl6 > taken.medl5)
    fail(
      `${sample.label}: medl6 is the last rank but takes more than medl5 (${taken.medl6} vs ${taken.medl5})`,
    );
}

console.log("");
if (failures.length) {
  console.error(`${failures.length} medal check(s) failed.`);
  process.exit(1);
}
console.log(
  `Validated ${KEYS.length} dojo medals across ${SAMPLES.length} matchups.`,
);
