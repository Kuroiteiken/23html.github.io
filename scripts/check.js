#!/usr/bin/env node
"use strict";

// Everything `npm run check` runs, as a list rather than as one line in package.json.
//
// That line had grown to seventeen commands joined by &&, which cost more than looking
// untidy: adding a check meant editing a string, a failure told you nothing about which of
// the seventeen it was beyond whatever the tool itself printed, and nothing said how long
// any of it took. As a list each step has a name, the runner says which one failed and
// stops there, and the summary shows where the time goes.
//
// Order matters and is not alphabetical:
//
//   1. The bundle has to parse before anything tries to load it.
//   2. The checks that read the game come next, cheapest first, so a broken registry is
//      reported before a two-minute browser run would have been started.
//   3. The behaviour tests follow.
//   4. Lint and formatting last: they are about the source rather than the product, so a
//      real defect should never be reported after a missing semicolon.
//
// `npm run check -- --only=combat` runs the steps whose name contains "combat", which is
// what you want while iterating on one of them.

const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

// Windows ships the local tools as .cmd shims, which cannot be spawned without a shell.
// Node scripts are run through this process's own executable, so they need no shell at all.
const needsShell = process.platform === "win32";
const bin = (name) => path.join(root, "node_modules", ".bin", name);

const node = (script, ...args) => ({
  command: process.execPath,
  args: [script, ...args],
  shell: false,
});
const tool = (name, ...args) => ({
  command: needsShell ? `"${bin(name)}"` : bin(name),
  args,
  shell: needsShell,
});

const STEPS = [
  {
    name: "bundle-syntax",
    why: "the concatenated bundle has to parse before anything loads it",
    ...node("--check", "js/game.js"),
  },
  {
    name: "changelog",
    why: "a release with no entry tells a returning player nothing",
    ...node("tests/check-changelog.js"),
  },
  {
    name: "regressions",
    why: "the contracts that have broken before",
    ...node("tests/check-game-regressions.js"),
  },
  {
    name: "i18n",
    why: "locale parity, formatting tokens, and the completeness flag the loader trusts",
    ...node("tests/check-i18n.js"),
  },
  {
    name: "refs",
    why: "a granted item that was never defined throws inside a click handler",
    ...node("scripts/check-refs.js"),
  },
  {
    name: "flags",
    why: "a flag nothing sets is a scene nobody can reach",
    ...node("scripts/check-flags.js"),
  },
  {
    name: "economy",
    why: "a vendor selling below face value is free money",
    ...node("scripts/check-economy.js"),
  },
  {
    name: "combat",
    why: "creatures statted past what the player can fight, measured through the real dmg_calc",
    ...node("scripts/check-combat.js"),
  },
  {
    name: "shared-state",
    why: "two registry entries holding one mutable object",
    ...node("tests/check-shared-state.js"),
  },
  {
    name: "version",
    why: "an announced release with no notes shows the player an empty list",
    ...node("tests/check-version.js"),
  },
  {
    name: "test-dev-server",
    why: "the dev server's routes and live reload",
    ...node("--test", "tests/dev-server.test.js"),
  },
  {
    name: "test-save",
    why: "save format and migrations, against real numbers",
    ...node("--test", "tests/save-format.test.js"),
  },
  {
    name: "test-callbacks",
    why: "the callback manager's attach/detach pairing",
    ...node("--test", "tests/callbacks.test.js"),
  },
  {
    name: "test-actions",
    why: "the run action's cost and the idempotence of its start/stop pair",
    ...node("--test", "tests/actions.test.js"),
  },
  {
    name: "eslint",
    why: "source rules",
    ...tool("eslint", "js", "scripts", "tests"),
  },
  {
    name: "stylelint",
    why: "stylesheet rules",
    ...tool("stylelint", "css/game.css"),
  },
  {
    name: "format",
    why: "every supported file is Prettier-clean",
    ...tool("prettier", "--check", ".", "--ignore-path", ".gitignore"),
  },
];

const only = process.argv
  .slice(2)
  .filter((argument) => argument.startsWith("--only="))
  .map((argument) => argument.slice("--only=".length).toLowerCase());

const steps = only.length
  ? STEPS.filter((step) => only.some((needle) => step.name.includes(needle)))
  : STEPS;

if (only.length && steps.length === 0) {
  console.error(
    `No check matches ${only.join(", ")}. Available: ${STEPS.map((s) => s.name).join(", ")}`,
  );
  process.exit(1);
}

const started = Date.now();
const timings = [];

for (const step of steps) {
  const at = Date.now();
  const result = spawnSync(step.command, step.args, {
    cwd: root,
    stdio: "inherit",
    shell: step.shell,
  });
  const took = Date.now() - at;
  timings.push({ name: step.name, took });

  if (result.error) {
    console.error(
      `\ncheck: could not run ${step.name}: ${result.error.message}`,
    );
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(
      `\ncheck: ${step.name} failed (${step.why}).` +
        `\n       Re-run just this one with: npm run check -- --only=${step.name}`,
    );
    process.exit(result.status ?? 1);
  }
}

const total = Date.now() - started;
const slowest = [...timings].sort((a, b) => b.took - a.took).slice(0, 3);
console.log(
  `\ncheck: ${timings.length} step(s) passed in ${(total / 1000).toFixed(1)}s.` +
    ` Slowest: ${slowest.map((s) => `${s.name} ${(s.took / 1000).toFixed(1)}s`).join(", ")}.`,
);
