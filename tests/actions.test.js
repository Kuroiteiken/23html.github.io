// Behaviour tests for the run action's activate/deactivate pair.
//
// The pair adjusts shared modifiers with += and -=, so calling either side twice
// leaves the modifier permanently wrong. That is exactly what happened: the
// actions panel rebuilt its container without removing the previous rows, so a
// second copy of every row stayed live and one click could run activate twice
// while stopping refunded once. These tests pin the guards that make the pair
// idempotent regardless of how the caller behaves.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const espree = require("espree");

const root = path.dirname(__dirname);
const actions = fs.readFileSync(
  path.join(root, "js", "systems", "actions.js"),
  "utf8",
);

// The run action's handlers, lifted out of the bundle by the property they
// assign. Everything they call is stubbed below.
const wanted = new Set([
  "act.demo.activate",
  "act.demo.deactivate",
  "act.demo.use",
]);

function extractRunAction() {
  const ast = espree.parse(actions, { ecmaVersion: "latest", range: true });
  const parts = [];
  const found = new Set();
  for (const node of ast.body) {
    if (
      node.type !== "ExpressionStatement" ||
      node.expression.type !== "AssignmentExpression" ||
      node.expression.left.type !== "MemberExpression"
    )
      continue;
    const target = actions.slice(...node.expression.left.range);
    if (wanted.has(target)) {
      parts.push(actions.slice(...node.range));
      found.add(target);
    }
  }
  const missing = [...wanted].filter((name) => !found.has(name));
  assert.deepEqual(
    missing,
    [],
    `actions.js no longer assigns: ${missing.join(", ")}`,
  );
  return parts.join("\n");
}

function sandbox() {
  const messages = [];
  const context = {
    act: { demo: { active: false } },
    you: {
      mods: { sdrate: 0.1, stdstps: 1, runerg: 1 },
      sat: 100,
      eqp: { 6: { dp: 10 } },
    },
    timers: {},
    i18n: { t: (key) => key },
    msg: (text) => messages.push(text),
    giveEff: () => {},
    removeEff: () => {},
    giveExp: () => {},
    giveSkExp: () => {},
    skl: { walk: {} },
    effect: { run: {} },
    clearInterval: () => {},
    setInterval: () => 1,
  };
  vm.createContext(context);
  vm.runInContext(extractRunAction(), context);
  return context;
}

test("starting and stopping leaves the modifiers exactly as they were", () => {
  const ctx = sandbox();
  const before = { ...ctx.you.mods };

  ctx.act.demo.activate();
  ctx.act.demo.deactivate();

  assert.deepEqual(ctx.you.mods, before);
});

test("running raises the energy drain while active", () => {
  const ctx = sandbox();
  ctx.act.demo.activate();
  assert.equal(ctx.you.mods.sdrate, 0.2);
  assert.equal(ctx.act.demo.active, true);
});

test("activating twice does not stack the energy cost", () => {
  // Two live rows for the same action used to do exactly this.
  const ctx = sandbox();
  ctx.act.demo.activate();
  ctx.act.demo.activate();
  assert.equal(ctx.you.mods.sdrate, 0.2, "the cost is applied once");
  assert.equal(ctx.you.mods.stdstps, 1.5);
});

test("a doubled start followed by one stop leaves nothing behind", () => {
  const ctx = sandbox();
  const before = { ...ctx.you.mods };

  ctx.act.demo.activate();
  ctx.act.demo.activate();
  ctx.act.demo.deactivate();

  assert.deepEqual(
    ctx.you.mods,
    before,
    "this is the leak that inflated the drain by 0.1 per run",
  );
});

test("deactivating when not running refunds nothing", () => {
  const ctx = sandbox();
  const before = { ...ctx.you.mods };
  ctx.act.demo.deactivate();
  assert.deepEqual(ctx.you.mods, before);
  assert.equal(ctx.act.demo.active, false);
});

test("many start/stop cycles do not drift", () => {
  const ctx = sandbox();
  const before = { ...ctx.you.mods };
  for (let cycle = 0; cycle < 25; cycle++) {
    ctx.act.demo.activate();
    ctx.act.demo.deactivate();
  }
  assert.deepEqual(ctx.you.mods, before);
});

test("the refund scales with runerg the same way the cost did", () => {
  // A title that lowers runerg between start and stop would otherwise refund a
  // different amount than it charged.
  const ctx = sandbox();
  ctx.act.demo.activate();
  const charged = ctx.you.mods.sdrate - 0.1;
  ctx.act.demo.deactivate();
  assert.equal(charged, 0.1);
  assert.equal(ctx.you.mods.sdrate, 0.1);
});
