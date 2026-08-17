// Behaviour tests for the run action's cost and its activate/deactivate pair.
//
// The running cost used to be charged onto you.mods.sdrate on start and
// refunded on stop. That leaked twice: once when a duplicated panel row ran
// activate two times against a single stop, and again when earning a title that
// lowered mods.runerg mid-run made the refund smaller than the charge. The
// residue stuck to the stored rate and was written to the save, so the drain
// climbed a little with every run. The cost is derived from the action now, and
// these tests pin both that and the idempotence of what is still paired.

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
  "act.demo.drain",
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
      mods: { sdrate: 0, stdstps: 1, runerg: 1 },
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
    // An action must not run a timer of its own. A background tab throttles
    // setInterval to roughly once a minute, so the action would stop making
    // progress while ontick() replayed the time everything else had missed.
    setInterval: () => {
      throw new Error("an action must not schedule its own interval");
    },
  };
  vm.createContext(context);
  vm.runInContext(extractRunAction(), context);
  return context;
}

test("running costs nothing until it is started", () => {
  const ctx = sandbox();
  assert.equal(ctx.act.demo.drain(), 0);
});

test("running costs 0.1 per tick at full energy upkeep", () => {
  const ctx = sandbox();
  ctx.act.demo.activate();
  assert.equal(ctx.act.demo.drain(), 0.1);
  assert.equal(ctx.act.demo.active, true);
});

test("stopping ends the cost entirely", () => {
  const ctx = sandbox();
  ctx.act.demo.activate();
  ctx.act.demo.deactivate();
  assert.equal(ctx.act.demo.drain(), 0);
});

test("the title discounts come off the 0.1 cost, not off a stored rate", () => {
  // The two running titles lower mods.runerg by 0.05 and 0.15, which the player
  // reads as a 5% and a 15% discount on the running cost.
  const ctx = sandbox();
  ctx.act.demo.activate();

  ctx.you.mods.runerg = 0.95;
  assert.equal(Math.round(ctx.act.demo.drain() * 1000) / 1000, 0.095);

  ctx.you.mods.runerg = 0.85;
  assert.equal(Math.round(ctx.act.demo.drain() * 1000) / 1000, 0.085);

  ctx.you.mods.runerg = 0.8;
  assert.equal(Math.round(ctx.act.demo.drain() * 1000) / 1000, 0.08);
});

test("earning a discount mid-run leaves no residue behind", () => {
  // This is the leak the derived cost exists to prevent: the charge happened at
  // runerg 1 and the refund would have happened at 0.85, keeping the difference
  // on the stored rate for good.
  const ctx = sandbox();
  const before = { ...ctx.you.mods };

  ctx.act.demo.activate();
  ctx.you.mods.runerg = 0.85;
  ctx.act.demo.deactivate();

  assert.equal(ctx.you.mods.sdrate, before.sdrate);
  assert.equal(ctx.act.demo.drain(), 0);
});

test("the stored rate is never touched by running at all", () => {
  const ctx = sandbox();
  ctx.act.demo.activate();
  assert.equal(ctx.you.mods.sdrate, 0, "the cost is derived, not accumulated");
  ctx.act.demo.deactivate();
  assert.equal(ctx.you.mods.sdrate, 0);
});

test("a lasting rate from equipment survives a run untouched", () => {
  // Accessories such as acc.jln3 add to the stored rate in a matched pair, so
  // running must neither consume nor inflate what they contribute.
  const ctx = sandbox();
  ctx.you.mods.sdrate = 0.2;

  ctx.act.demo.activate();
  assert.equal(ctx.you.mods.sdrate, 0.2);
  assert.equal(ctx.act.demo.drain(), 0.1);

  ctx.act.demo.deactivate();
  assert.equal(ctx.you.mods.sdrate, 0.2);
});

test("starting and stopping leaves the modifiers exactly as they were", () => {
  const ctx = sandbox();
  const before = { ...ctx.you.mods };

  ctx.act.demo.activate();
  ctx.act.demo.deactivate();

  assert.deepEqual(ctx.you.mods, before);
});

test("activating twice does not stack the paired modifiers", () => {
  // Two live rows for the same action used to do exactly this.
  const ctx = sandbox();
  ctx.act.demo.activate();
  ctx.act.demo.activate();
  assert.equal(ctx.you.mods.stdstps, 1.5, "the step bonus is applied once");
});

test("a doubled start followed by one stop leaves nothing behind", () => {
  const ctx = sandbox();
  const before = { ...ctx.you.mods };

  ctx.act.demo.activate();
  ctx.act.demo.activate();
  ctx.act.demo.deactivate();

  assert.deepEqual(ctx.you.mods, before);
  assert.equal(ctx.act.demo.drain(), 0);
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

test("cycles with a changing discount do not drift either", () => {
  const ctx = sandbox();
  const discounts = [1, 0.95, 0.85, 0.8];
  for (let cycle = 0; cycle < 25; cycle++) {
    ctx.act.demo.activate();
    ctx.you.mods.runerg = discounts[cycle % discounts.length];
    ctx.act.demo.deactivate();
  }
  assert.equal(ctx.you.mods.sdrate, 0);
  assert.equal(ctx.you.mods.stdstps, 1);
});

test("starting an action schedules no timer of its own", () => {
  // The sandbox's setInterval throws, so this passes only while progress is
  // driven from ontick(). A background tab throttles intervals to roughly once a
  // minute, which is what used to stop running and scouting from advancing.
  const ctx = sandbox();
  assert.doesNotThrow(() => ctx.act.demo.activate());
  assert.doesNotThrow(() => ctx.act.demo.use());
  assert.doesNotThrow(() => ctx.act.demo.deactivate());
});
