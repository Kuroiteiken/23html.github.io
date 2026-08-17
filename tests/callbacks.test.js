// Behaviour tests for the shared callback dispatcher. These run the real
// functions rather than asserting how the source reads.
//
// The dispatcher lives in js/data/titles.js inside the concatenated global-scope
// bundle, so the three functions and the `callback.on*` assignments are lifted
// out by name and evaluated on their own. None of them touches the DOM.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const espree = require("espree");

const root = path.dirname(__dirname);
const titles = fs.readFileSync(
  path.join(root, "js", "data", "titles.js"),
  "utf8",
);

const wantedFunctions = new Set([
  "callbackManager",
  "attachCallback",
  "detachCallback",
]);

function extractDispatcher() {
  const ast = espree.parse(titles, { ecmaVersion: "latest", range: true });
  const found = new Set();
  const parts = [];
  const hooks = [];

  for (const node of ast.body) {
    if (
      node.type === "FunctionDeclaration" &&
      wantedFunctions.has(node.id.name)
    ) {
      parts.push(titles.slice(...node.range));
      found.add(node.id.name);
      continue;
    }
    // `callback.onDeath = new callbackManager(1);` and its siblings.
    if (
      node.type === "ExpressionStatement" &&
      node.expression.type === "AssignmentExpression" &&
      node.expression.left.type === "MemberExpression" &&
      node.expression.left.object.name === "callback" &&
      node.expression.right.type === "NewExpression" &&
      node.expression.right.callee.name === "callbackManager"
    ) {
      parts.push(titles.slice(...node.range));
      hooks.push(node.expression.left.property.name);
    }
  }

  const missing = [...wantedFunctions].filter((name) => !found.has(name));
  assert.deepEqual(
    missing,
    [],
    `titles.js no longer declares: ${missing.join(", ")}`,
  );
  return { source: parts.join("\n"), hooks };
}

function sandbox() {
  const { source, hooks } = extractDispatcher();
  const context = { callback: {} };
  vm.createContext(context);
  vm.runInContext(source, context);
  const api = vm.runInContext(
    "({ callbackManager, attachCallback, detachCallback, callback })",
    context,
  );
  return { ...api, hooks };
}

test("every documented hook exists and has its own id", () => {
  const { callback, hooks } = sandbox();
  assert.deepEqual(hooks.sort(), [
    "onCraft",
    "onDeath",
    "onEnterArea",
    "onLevel",
    "onQuestComplete",
  ]);
  const ids = hooks.map((name) => callback[name].id);
  assert.equal(new Set(ids).size, ids.length, "hook ids must be distinct");
});

test("a fresh hook starts with no subscribers and fires harmlessly", () => {
  const { callback } = sandbox();
  assert.deepEqual(callback.onLevel.hooks, []);
  assert.doesNotThrow(() => callback.onLevel.fire({}));
});

test("fire passes every argument through to each subscriber", () => {
  const { callback, attachCallback } = sandbox();
  const seen = [];
  attachCallback(callback.onDeath, {
    f: (...args) => seen.push(args),
    id: 1,
    data: {},
  });
  attachCallback(callback.onDeath, {
    f: (...args) => seen.push(args),
    id: 2,
    data: {},
  });

  const victim = { name: "victim" };
  const killer = { name: "killer" };
  callback.onDeath.fire(victim, killer);

  assert.deepEqual(seen, [
    [victim, killer],
    [victim, killer],
  ]);
});

test("detachCallback removes the hook with the given id, not the first one", () => {
  const { callback, attachCallback, detachCallback } = sandbox();
  const order = [];
  attachCallback(callback.onCraft, {
    f: () => order.push("keep"),
    id: 10,
    data: {},
  });
  attachCallback(callback.onCraft, {
    f: () => order.push("drop"),
    id: 20,
    data: {},
  });

  detachCallback(callback.onCraft, 20);
  callback.onCraft.fire();

  assert.deepEqual(
    order,
    ["keep"],
    "the surviving hook is the one not detached",
  );
  assert.equal(callback.onCraft.hooks.length, 1);
});

test("detachCallback removes every hook sharing an id", () => {
  const { callback, attachCallback, detachCallback } = sandbox();
  attachCallback(callback.onEnterArea, { f: () => {}, id: 7, data: {} });
  attachCallback(callback.onEnterArea, { f: () => {}, id: 7, data: {} });
  attachCallback(callback.onEnterArea, { f: () => {}, id: 8, data: {} });

  detachCallback(callback.onEnterArea, 7);

  assert.deepEqual(
    callback.onEnterArea.hooks.map((hook) => hook.id),
    [8],
  );
});

test("detaching an id that is not subscribed changes nothing", () => {
  const { callback, attachCallback, detachCallback } = sandbox();
  attachCallback(callback.onLevel, { f: () => {}, id: 3, data: {} });
  detachCallback(callback.onLevel, 99);
  assert.equal(callback.onLevel.hooks.length, 1);
});

test("a hook that detaches itself while firing does not skip the rest", () => {
  // The quest hooks do exactly this: the reward handler detaches the listener
  // that fired it. Iterating the live array would have skipped whatever came
  // after the removed entry.
  const { callback, attachCallback, detachCallback } = sandbox();
  const order = [];
  attachCallback(callback.onQuestComplete, {
    f: () => {
      order.push("first");
      detachCallback(callback.onQuestComplete, 1);
    },
    id: 1,
    data: {},
  });
  attachCallback(callback.onQuestComplete, {
    f: () => order.push("second"),
    id: 2,
    data: {},
  });

  callback.onQuestComplete.fire();

  assert.deepEqual(order, ["first", "second"]);
  assert.deepEqual(
    callback.onQuestComplete.hooks.map((hook) => hook.id),
    [2],
  );
});

test("hooks are independent of each other", () => {
  const { callback, attachCallback } = sandbox();
  let deaths = 0;
  attachCallback(callback.onDeath, { f: () => deaths++, id: 1, data: {} });

  callback.onLevel.fire({});
  callback.onCraft.fire({});

  assert.equal(
    deaths,
    0,
    "firing one hook must not reach another's subscribers",
  );
});
