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

const wanted = new Set([
  "saveSentinelIndex",
  "saveSentinel",
  "saveJsonSegmentCount",
  "describeSaveProblems",
  "saveMigrations",
  "migrateSave",
]);

function extractSaveHelpers() {
  const ast = espree.parse(bootstrap, { ecmaVersion: "latest", range: true });
  const found = new Set();
  const parts = [];
  for (const node of ast.body) {
    if (node.type === "FunctionDeclaration" && wanted.has(node.id.name)) {
      parts.push(bootstrap.slice(...node.range));
      found.add(node.id.name);
    }
    if (node.type === "VariableDeclaration") {
      const names = node.declarations
        .map((declaration) => declaration.id.name)
        .filter((name) => wanted.has(name));
      if (names.length) {
        parts.push(bootstrap.slice(...node.range));
        names.forEach((name) => found.add(name));
      }
    }
  }
  const missing = [...wanted].filter((name) => !found.has(name));
  assert.deepEqual(
    missing,
    [],
    `bootstrap.js no longer declares: ${missing.join(", ")}`,
  );
  return parts.join("\n");
}

function sandbox() {
  const messages = [];
  const context = {
    // The bundle's own `global` object, not Node's.
    global: { ver: 500 },
    console: {
      info: (message) => messages.push(message),
      warn: (message) => messages.push(message),
    },
  };
  vm.createContext(context);
  vm.runInContext(extractSaveHelpers(), context);
  const api = vm.runInContext(
    "({ describeSaveProblems, migrateSave, saveMigrations, saveSentinelIndex })",
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

test("an empty migration table changes nothing", () => {
  const { api } = sandbox();
  const payload = { v: 1 };
  assert.equal(api.migrateSave(payload, 1), 0);
  assert.deepEqual(payload, { v: 1 });
});

test("only migrations newer than the save are applied, in order", () => {
  const { api, messages } = sandbox();
  const order = [];
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
  api.saveMigrations.push(
    { to: 300, apply: () => order.push(300) },
    { to: 400, apply: () => order.push(400) },
  );

  assert.equal(api.migrateSave({}, 0), 2);
  assert.deepEqual(order, [300, 400]);
});
