#!/usr/bin/env node
"use strict";

// A shop that sells money.
//
// Five items in this game hand wealth back when they are used -- Penny, Nickel, Dime,
// Quarter and Large Copper Coin are old currency the player cashes in. Putting one of
// those on a vendor's shelf for less than it pays back is an infinite money press: buy,
// use, buy again. The smith shipped with `item.cq` at 12 against a payout of 25, and
// vendor prices are multiplied by the vendor's own inflation on top, so the shelf price
// was 16 and every purchase was nine coins of profit, four to twenty per restock.
//
// The comparison here is against the base price rather than the inflated one, which is
// the stricter test: every vendor's `infl` is above 1, so anything that fails against
// the base would fail worse on the shelf.
//
// This is a straight text scan rather than a load of the bundle, because the bundle
// needs a DOM. Comments are stripped first so a commented-out shelf does not count.

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const stripComments = require("./strip-comments");

const items = stripComments(
  fs.readFileSync(path.join(root, "js", "data", "items.js"), "utf8"),
);
const crafting = stripComments(
  fs.readFileSync(path.join(root, "js", "systems", "crafting.js"), "utf8"),
);

// Every item whose use() gives wealth, and how much it gives.
const payout = new Map();
const starts = [
  ...items.matchAll(/^item\.([A-Za-z0-9_$]+) = new Item\(\);/gm),
].map((m) => [m[1], m.index]);
for (let i = 0; i < starts.length; i++) {
  const body = items.slice(
    starts[i][1],
    i + 1 < starts.length ? starts[i + 1][1] : items.length,
  );
  const gives = body.match(/giveWealth\((\d+)/);
  if (gives) payout.set(starts[i][0], Number(gives[1]));
}

if (!payout.size)
  throw new Error(
    "check-economy: found no items that pay wealth when used, which means the scan is broken rather than that the game changed.",
  );

const problems = [];
for (const block of crafting.matchAll(
  /vendor\.([A-Za-z0-9_$]+)\.items = \[([\s\S]*?)\n\];/g,
)) {
  const vendor = block[1];
  for (const line of block[2].split("\n")) {
    const sold = line.match(/item: item\.([A-Za-z0-9_$]+),\s*p: (\d+)/);
    if (!sold || !payout.has(sold[1])) continue;
    const price = Number(sold[2]);
    const pays = payout.get(sold[1]);
    if (pays >= price)
      problems.push(
        `  vendor.${vendor} sells item.${sold[1]} for ${price}, and using one gives ${pays} back.`,
      );
  }
}

if (problems.length) {
  throw new Error(
    `${problems.length} vendor line(s) sell money for less than it is worth:\n${problems.join(
      "\n",
    )}\n\nBuy, use, repeat. Take the item off the shelf, or price it above what it pays.`,
  );
}

console.log(
  `check-economy: no vendor sells any of the ${payout.size} wealth-paying items below face value.`,
);
