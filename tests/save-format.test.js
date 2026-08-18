// Behaviour tests for the save-format guards. Unlike the regression checks,
// which assert that source text still looks a certain way, these run the real
// functions against real save strings and assert what they do.
//
// The game is one concatenated global-scope bundle that needs a DOM, so the
// save-format helpers are lifted out of js/core/bootstrap.js by name and
// evaluated on their own. They are pure apart from console output, which the
// sandbox captures.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const espree = require("espree");

const root = path.dirname(__dirname);
const bootstrap = fs.readFileSync(
  path.join(root, "js", "core", "bootstrap.js"),
  "utf8",
);

const simulation = fs.readFileSync(
  path.join(root, "js", "systems", "simulation.js"),
  "utf8",
);

const wanted = new Set([
  "saveSentinelIndex",
  "saveSentinel",
  "saveJsonSegmentCount",
  "describeSaveProblems",
  "saveMigrations",
  "migrateSave",
  "bootPhase",
]);

// The v478 migration tops a character up to the SPD and LUCK the level milestones
// owe them, and the table it reads lives in simulation.js. Lifting it too is what
// makes the migration testable against real numbers rather than only counted.
const wantedFromSimulation = new Set(["levelGrants", "levelGrantTotal"]);

function extractDeclarations(source, names, label) {
  const ast = espree.parse(source, { ecmaVersion: "latest", range: true });
  const found = new Set();
  const parts = [];
  for (const node of ast.body) {
    if (node.type === "FunctionDeclaration" && names.has(node.id.name)) {
      parts.push(source.slice(...node.range));
      found.add(node.id.name);
    }
    if (node.type === "VariableDeclaration") {
      const declared = node.declarations
        .map((declaration) => declaration.id.name)
        .filter((name) => names.has(name));
      if (declared.length) {
        parts.push(source.slice(...node.range));
        declared.forEach((name) => found.add(name));
      }
    }
  }
  const missing = [...names].filter((name) => !found.has(name));
  assert.deepEqual(
    missing,
    [],
    `${label} no longer declares: ${missing.join(", ")}`,
  );
  return parts.join("\n");
}

function extractSaveHelpers() {
  return [
    extractDeclarations(bootstrap, wanted, "bootstrap.js"),
    extractDeclarations(simulation, wantedFromSimulation, "simulation.js"),
  ].join("\n");
}

function sandbox() {
  const messages = [];
  const context = {
    // The bundle's own `global` object, not Node's.
    global: { ver: 500 },
    // levelGrants labels its entries at definition time, which is what the i18n
    // key checker requires. The labels are only ever shown in a message.
    i18n: { t: (key) => key },
    console: {
      info: (message) => messages.push(message),
      warn: (message) => messages.push(message),
    },
  };
  vm.createContext(context);
  vm.runInContext(extractSaveHelpers(), context);
  const api = vm.runInContext(
    "({ describeSaveProblems, migrateSave, saveMigrations, saveSentinelIndex, levelGrants, levelGrantTotal })",
    context,
  );
  return { api, messages };
}

// A save the game would actually accept: JSON in segments 0-17, the sentinel at
// 18, and the segment added later at 19.
function wellFormedSegments() {
  const segments = [];
  for (let index = 0; index < 18; index++)
    segments.push(JSON.stringify({ index }));
  segments.push("savevalid");
  segments.push(JSON.stringify([1, 2, 3]));
  return segments;
}

test("a well-formed save reports no problems", () => {
  const { api } = sandbox();
  assert.deepEqual(api.describeSaveProblems(wellFormedSegments()), []);
});

test("the trailing segment added later may be absent", () => {
  const { api } = sandbox();
  const segments = wellFormedSegments().slice(0, 19);
  assert.deepEqual(api.describeSaveProblems(segments), []);
});

test("a missing sentinel is reported and names its segment", () => {
  const { api } = sandbox();
  const segments = wellFormedSegments();
  segments[api.saveSentinelIndex] = "notthesentinel";
  const problems = api.describeSaveProblems(segments);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /segment 18/);
});

test("a truncated save is reported rather than partially accepted", () => {
  const { api } = sandbox();
  const problems = api.describeSaveProblems(["{}", "{}"]);
  assert.ok(problems.length >= 1);
  assert.match(problems[0], /found 2/);
});

test("a segment that is not JSON is reported by index", () => {
  const { api } = sandbox();
  const segments = wellFormedSegments();
  segments[7] = "{not json";
  const problems = api.describeSaveProblems(segments);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /segment 7 is not valid JSON/);
});

test("every malformed segment is reported, not just the first", () => {
  const { api } = sandbox();
  const segments = wellFormedSegments();
  segments[3] = "nope";
  segments[11] = "also nope";
  const problems = api.describeSaveProblems(segments);
  assert.equal(problems.length, 2);
});

test("a save from the current build needs no migration", () => {
  const { api } = sandbox();
  const payload = { mods: { sdrate: 0.4 } };
  assert.equal(api.migrateSave(payload, 500), 0);
  assert.equal(payload.mods.sdrate, 0.4, "nothing is touched");
});

test("a pre-v476 save has every later migration applied", () => {
  // Before v476 the saved drain rate was the retired base of 0.1, plus anything
  // the actions panel leaked onto it. Equipment and action contributions are
  // never stored, so zero is the only correct value.
  const { api } = sandbox();
  const payload = { mods: { sdrate: 0.3, runerg: 1 } };
  assert.equal(api.migrateSave(payload, 475), 3);
  assert.equal(payload.mods.sdrate, 0);
  assert.equal(payload.mods.runerg, 1, "other modifiers are left alone");
});

test("the v477 migration clears the residue left by mid-run discounts", () => {
  // A v476 save charged the running cost onto the stored rate and refunded it
  // at whatever mods.runerg had become, so the difference accumulated there.
  const { api } = sandbox();
  const payload = { mods: { sdrate: 0.145, runerg: 0.85 } };
  assert.equal(api.migrateSave(payload, 476), 2);
  assert.equal(payload.mods.sdrate, 0);
  assert.equal(payload.mods.runerg, 0.85, "the earned discount itself is kept");
});

test("the v478 migration pays an existing character the milestones it owes", () => {
  const { api } = sandbox();
  // A level 37 character from before the grants existed: three SPD milestones at
  // 10, 20 and 30, and seven LUCK milestones at 5 through 35, on top of the 1
  // each stat starts on.
  let recomputed = 0;
  const player = {
    lvl: 37,
    spd_r: 1,
    luck: 1,
    stat_r: () => recomputed++,
  };
  assert.equal(api.migrateSave({ player }, 477), 1);
  assert.equal(player.spd_r, 4);
  assert.equal(player.luck, 8);
  assert.equal(recomputed, 1, "the derived stats are recomputed once");
});

test("the v478 migration never takes anything away or pays twice", () => {
  const { api } = sandbox();
  // Already ahead of the schedule, from equipment or a title rather than levels.
  const ahead = { lvl: 12, spd_r: 9, luck: 20, stat_r: () => {} };
  api.migrateSave({ player: ahead }, 477);
  assert.equal(ahead.spd_r, 9, "a higher value is left alone");
  assert.equal(ahead.luck, 20);

  // Running it a second time tops up to the same total rather than adding again.
  const twice = { lvl: 20, spd_r: 1, luck: 1, stat_r: () => {} };
  api.migrateSave({ player: twice }, 477);
  const spd = twice.spd_r;
  const luck = twice.luck;
  api.migrateSave({ player: twice }, 477);
  assert.equal(twice.spd_r, spd, "SPD is not paid a second time");
  assert.equal(twice.luck, luck, "LUCK is not paid a second time");
});

test("the v478 migration tolerates a save with no player state", () => {
  const { api } = sandbox();
  assert.doesNotThrow(() => api.migrateSave({}, 100));
  assert.doesNotThrow(() => api.migrateSave({ player: {} }, 100));
  // A character whose stats were never serialized is skipped rather than seeded.
  const partial = { lvl: 30, stat_r: () => {} };
  api.migrateSave({ player: partial }, 477);
  assert.equal(partial.spd_r, undefined);
  assert.equal(partial.luck, undefined);
});

test("the v476 migration tolerates a save with no modifiers", () => {
  const { api } = sandbox();
  assert.doesNotThrow(() => api.migrateSave({}, 100));
  assert.doesNotThrow(() => api.migrateSave({ mods: {} }, 100));
});

test("only migrations newer than the save are applied, in order", () => {
  const { api, messages } = sandbox();
  const order = [];
  // Replace the real table so the ordering rule is tested on its own.
  api.saveMigrations.splice(0);
  api.saveMigrations.push(
    {
      to: 300,
      apply(payload) {
        order.push(300);
        payload.early = true;
      },
    },
    {
      to: 400,
      apply(payload) {
        order.push(400);
        payload.late = true;
      },
    },
  );

  const payload = {};
  const applied = api.migrateSave(payload, 350);

  assert.equal(applied, 1, "only the migration above the save version runs");
  assert.deepEqual(order, [400]);
  assert.deepEqual(payload, { late: true });
  assert.ok(
    messages.some((message) => /save migration/.test(message)),
    "applying a migration is reported",
  );
});

test("a save older than every migration runs all of them in order", () => {
  const { api } = sandbox();
  const order = [];
  api.saveMigrations.splice(0);
  api.saveMigrations.push(
    { to: 300, apply: () => order.push(300) },
    { to: 400, apply: () => order.push(400) },
  );

  assert.equal(api.migrateSave({}, 0), 2);
  assert.deepEqual(order, [300, 400]);
});
