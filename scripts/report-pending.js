#!/usr/bin/env node
"use strict";

// Measures whether the pending work recorded in docs/PROPOSALS.md and docs/status.md is still
// pending.
//
// WHY THIS EXISTS
//
// Two requests in the owner's queue turned out to have shipped months earlier -- the fireplace
// buffs and the fire burn debuff -- and they were only caught because the code was read before
// the work started. A recorded list of pending work goes stale silently: nothing fails, and the
// cost is doing something twice or planning around a problem that no longer exists.
//
// So each claim is asked of the game rather than of the document. Run it before picking up any
// of this work:
//
//   node scripts/report-pending.js
//
// It is a report and not a check. Pending work is not a failure, so it never exits non-zero for
// finding some; it exits non-zero only when a claim cannot be measured at all, because a claim
// this file can no longer evaluate is the thing that would let the list rot again.

const { loadGame, bundleSource } = require("../tests/harness");
const stripComments = require("./strip-comments");

// The bundle's own text, needed both for claims about whether code exists and for finding the
// dialogue grants that sourcedIds() counts, so it is read before anything uses it.
const bundle = bundleSource();

const game = loadGame();
const {
  item,
  wpn,
  eqp,
  acc,
  sld,
  creature,
  ttl,
  skl,
  rcp,
  furniture,
  vendor,
  area,
} = game;

const rows = [];
const unmeasurable = [];

function claim(label, expectation, measure) {
  try {
    const { holds, detail } = measure();
    rows.push({ label, expectation, holds, detail });
  } catch (error) {
    unmeasurable.push({ label, error: error.message });
  }
}

// Everything a player could ever be handed, so "has a source" is answerable. A recipe output, a
// vendor's stock, an area drop, or a creature drop.
function sourcedIds() {
  const ids = new Set();
  // The field names are the game's, checked rather than guessed: a recipe's output is `res`, not
  // `give`, and a vendor's catalogue is `items` -- `stock` is what restocking fills at run time
  // and is empty in a freshly loaded game. Reading the wrong field made this report claim all 17
  // shields and six healing items had no source, which was wrong and would have sent someone to
  // fix a problem that does not exist.
  for (const key of Object.keys(rcp)) {
    for (const entry of rcp[key].res ?? []) {
      const thing = entry?.item ?? entry?.thing ?? entry;
      if (thing && thing.id !== undefined) ids.add(thing.id);
    }
  }
  for (const key of Object.keys(vendor)) {
    // `extra` is not always an array -- one vendor carries an object there -- so each source is
    // normalised rather than spread blindly.
    const lists = [vendor[key].items, vendor[key].stock, vendor[key].extra]
      .filter(Array.isArray)
      .flat();
    for (const entry of lists) {
      const thing = entry?.item ?? entry?.thing ?? entry;
      if (thing && thing.id !== undefined) ids.add(thing.id);
    }
  }
  for (const key of Object.keys(area)) {
    for (const entry of area[key].drop ?? []) {
      const thing = entry?.item ?? entry?.thing ?? entry;
      if (thing && thing.id !== undefined) ids.add(thing.id);
    }
  }
  for (const key of Object.keys(creature)) {
    for (const entry of creature[key].drop ?? []) {
      const thing = entry?.item ?? entry?.thing ?? entry;
      if (thing && thing.id !== undefined) ids.add(thing.id);
    }
  }
  // A dialogue grant is a source too, and for some things it is the only one: the whole dojo
  // reward ladder hands its medals and shields over through giveItem in a click handler, so a
  // report that only walked vendors, recipes and drops called them unsourced and kept saying
  // so after they had been wired up. Comments are stripped first, or a grant that was
  // deliberately commented out would count.
  const granted = stripComments(bundle).matchAll(
    /giveItem\(\s*(acc|eqp|wpn|sld|item)\.([A-Za-z0-9_$]+)/g,
  );
  const registries = { acc, eqp, wpn, sld, item };
  for (const [, registryName, key] of granted) {
    const thing = registries[registryName]?.[key];
    if (thing && thing.id !== undefined) ids.add(thing.id);
  }
  return ids;
}

const sourced = sourcedIds();

// Kept under its original name for the claims below that read it.
const source = bundle;

claim(
  "PROPOSALS 5 - resistances do not reduce damage",
  "11 of the 12 res fields are never read by dmg_calc",
  () => {
    const fields = Object.keys(game.you.res);
    // dmg_calc's own text, so a field read anywhere else (giveEff) does not count.
    const start = source.indexOf("function dmg_calc(");
    const end = source.indexOf("\nfunction ", start + 10);
    const body = source.slice(start, end);
    const read = fields.filter((field) => body.includes(`res.${field}`));
    return {
      holds: read.length <= 1,
      detail: `${fields.length} fields, read by dmg_calc: ${read.join(", ") || "none"}`,
    };
  },
);

claim(
  "PROPOSALS 6 - titles written but never granted",
  "there are titles with no grant path",
  () => {
    const names = Object.keys(ttl).filter((key) => ttl[key].id !== undefined);
    const ungranted = names.filter(
      (key) => !new RegExp(`giveTitle\\(\\s*ttl\\.${key}\\b`).test(source),
    );
    return {
      holds: ungranted.length > 0,
      detail: `${ungranted.length} of ${names.length} titles have no giveTitle call: ${ungranted.slice(0, 8).join(", ")}${ungranted.length > 8 ? ", ..." : ""}`,
    };
  },
);

claim(
  "PROPOSALS 7 - shields with no source, and every shield at int 0",
  "some shields cannot be obtained, and none defends against magic",
  () => {
    const keys = Object.keys(sld).filter(
      (key) => typeof sld[key].str === "number",
    );
    const noSource = keys.filter((key) => !sourced.has(sld[key].id));
    const zeroInt = keys.filter((key) => sld[key].int === 0);
    return {
      holds: noSource.length > 0 || zeroInt.length === keys.length,
      detail: `${keys.length} shields; ${noSource.length} with no source (${noSource.slice(0, 8).join(", ")}); ${zeroInt.length} with int 0`,
    };
  },
);

claim(
  "PROPOSALS 8 - healing items with no repeatable source",
  "at least one finished healing item cannot be obtained repeatably",
  () => {
    const healers = Object.keys(item).filter((key) => {
      const use = item[key].use;
      return typeof use === "function" && /you\.hp/.test(String(use));
    });
    const noSource = healers.filter((key) => !sourced.has(item[key].id));
    return {
      holds: noSource.length > 0,
      detail: `${healers.length} items heal; ${noSource.length} have no source: ${noSource.join(", ") || "none"}`,
    };
  },
);

claim(
  "PROPOSALS 9 - recipes nobody can learn",
  "finished recipes have no giveRcp call",
  () => {
    const keys = Object.keys(rcp).filter((key) => rcp[key].id !== undefined);
    const unlearnable = keys.filter(
      (key) => !new RegExp(`giveRcp\\(\\s*rcp\\.${key}\\b`).test(source),
    );
    return {
      holds: unlearnable.length > 0,
      detail: `${unlearnable.length} of ${keys.length} recipes have no giveRcp: ${unlearnable.slice(0, 10).join(", ")}${unlearnable.length > 10 ? ", ..." : ""}`,
    };
  },
);

claim(
  "PROPOSALS 9 - stardust has nothing to do",
  "no recipe consumes item.stdst",
  () => {
    const id = item.stdst?.id;
    const mentioned = /item\.stdst/g;
    const hits = (source.match(mentioned) || []).length;
    const inRecipe = Object.keys(rcp).some((key) =>
      JSON.stringify(rcp[key].req ?? []).includes(String(id)),
    );
    return {
      holds: !inRecipe,
      detail: `item.stdst id ${id}; mentioned ${hits}x in the bundle; consumed by a recipe: ${inRecipe}`,
    };
  },
);

claim(
  "PROPOSALS 13 - furniture nobody can obtain",
  "finished furniture has no giveFurniture call",
  () => {
    const keys = Object.keys(furniture).filter(
      (key) => furniture[key].id !== undefined,
    );
    const unreachable = keys.filter(
      (key) =>
        !new RegExp(`giveFurniture\\(\\s*furniture\\.${key}\\b`).test(source),
    );
    return {
      holds: unreachable.length > 0,
      detail: `${unreachable.length} of ${keys.length} furniture pieces have no giveFurniture: ${unreachable.join(", ") || "none"}`,
    };
  },
);

claim(
  "queue 1 - dojo medals have no stats",
  "the medal accessories carry no bonuses",
  () => {
    const medals = Object.keys(acc).filter((key) => /^medl\d+$/.test(key));
    const statless = medals.filter((key) => {
      const a = acc[key];
      const numbers = ["str", "int", "agl", "spd", "hp", "sat", "crt"].map(
        (f) => a[f] ?? 0,
      );
      // The arrays that matter are caff/ccls/cmaff, not aff/cls: dmg_calc's defending side
      // reads the player-wide arrays and never an accessory's own aff, so a medal with aff
      // set would still do nothing. An empty oneq counts as statless for the same reason --
      // the values only reach the player when the pair is installed.
      const arrays = [a.caff ?? [], a.ccls ?? [], a.cmaff ?? []].flat();
      const inert = String(a.oneq).replace(/\s+/g, " ") === "function () {}";
      return (
        numbers.every((n) => n === 0) && (arrays.every((n) => !n) || inert)
      );
    });
    const noSource = medals.filter((key) => !sourced.has(acc[key].id));
    return {
      holds: statless.length > 0,
      detail: `${medals.length} medals; ${statless.length} with no stats (${statless.join(", ")}); ${noSource.length} with no source`,
    };
  },
);

claim(
  "queue 1 - the three lowest medals have no source",
  "medl1, medl2 and medl3 are granted from nowhere",
  () => {
    // The rest of the ladder is wired: medl4 at the level-40 dojo tier, medl5 at 45, medl6 at
    // 50. These three are the ranks below that, and where they go is a balance decision rather
    // than a gap -- a medal at the level-25 tier changes what a mid-game fighter shrugs off.
    const medals = ["medl1", "medl2", "medl3"];
    const noSource = medals.filter((key) => !sourced.has(acc[key].id));
    return {
      holds: noSource.length > 0,
      detail: `${noSource.length} of ${medals.length} without a grant: ${noSource.join(", ") || "none"}`,
    };
  },
);

claim("queue 4 - no axe exists", "no weapon has wtype 2", () => {
  const axes = Object.keys(wpn).filter((key) => wpn[key].wtype === 2);
  return {
    holds: axes.length === 0,
    detail: `weapons with wtype 2: ${axes.join(", ") || "none"}`,
  };
});

claim(
  "queue 8 - accessory slots locked",
  "no equipment declares slot 6, and every accessory is slot 8",
  () => {
    const slots = new Set();
    for (const registry of [eqp, acc, sld, wpn])
      for (const key of Object.keys(registry)) {
        const slot = registry[key].slot;
        if (slot !== undefined) slots.add(slot);
      }
    const accSlots = new Set(Object.keys(acc).map((key) => acc[key].slot));
    return {
      holds: !slots.has(6),
      detail: `declared slots: ${[...slots].sort((a, b) => a - b).join(", ")}; accessory slots in use: ${[...accSlots].join(", ")}`,
    };
  },
);

claim(
  "queue 3 - skills that grant no perk",
  "trainable skills exist with no milestone",
  () => {
    const keys = Object.keys(skl).filter((key) => skl[key].id !== undefined);
    const bare = keys.filter((key) => !(skl[key].mlstn ?? []).length);
    const trainable = bare.filter((key) =>
      new RegExp(`giveSkExp\\(\\s*skl\\.${key}\\b`).test(source),
    );
    return {
      holds: trainable.length > 0,
      detail: `${keys.length} skills, ${bare.length} with no milestone, ${trainable.length} of those trainable`,
    };
  },
);

claim(
  "refactor P1.4 - the simulation writes to the DOM",
  "js/systems/simulation.js still sets styles and innerHTML",
  () => {
    const fs = require("fs");
    const path = require("path");
    const text = fs.readFileSync(
      path.join(__dirname, "..", "js", "systems", "simulation.js"),
      "utf8",
    );
    const styles = (text.match(/\.style\./g) || []).length;
    const html = (text.match(/innerHTML/g) || []).length;
    return {
      holds: styles > 0 || html > 0,
      detail: `${styles} inline style writes, ${html} innerHTML writes`,
    };
  },
);

// --- report -------------------------------------------------------------------

const stillPending = rows.filter((row) => row.holds);
const settled = rows.filter((row) => !row.holds);

console.log(`Measured ${rows.length} recorded claim(s) against the game.\n`);

if (stillPending.length) {
  console.log(`STILL PENDING (${stillPending.length}):`);
  for (const row of stillPending)
    console.log(`  - ${row.label}\n      ${row.detail}`);
  console.log();
}

if (settled.length) {
  console.log(
    `NO LONGER TRUE (${settled.length}) -- update docs/PROPOSALS.md and docs/status.md:`,
  );
  for (const row of settled)
    console.log(
      `  - ${row.label}\n      expected: ${row.expectation}\n      measured: ${row.detail}`,
    );
  console.log();
}

if (unmeasurable.length) {
  console.error(`COULD NOT MEASURE (${unmeasurable.length}):`);
  for (const row of unmeasurable)
    console.error(`  - ${row.label}: ${row.error}`);
  console.error(
    "\nA claim this report cannot evaluate is how the list goes stale, so this exits non-zero.",
  );
  process.exit(1);
}
