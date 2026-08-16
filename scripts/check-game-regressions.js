const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const locations = fs.readFileSync(
  path.join(root, "js", "world", "locations.js"),
  "utf8",
);

const moonBloomLeaveHandler =
  /chss\.frstn1a4\.onLeave\s*=\s*function\s*\(\)\s*{\s*area\.frstn1a4\.size\s*=\s*rand\(5\)\s*-\s*20;\s*};/;

if (!moonBloomLeaveHandler.test(locations)) {
  throw new Error(
    "Moon Bloom regression: leaving frstn1a4 must reduce its randomized area size by 20.",
  );
}

console.log("Validated the Moon Bloom area-size regression fix.");

const interfaceSource = fs.readFileSync(
  path.join(root, "js", "ui", "interface.js"),
  "utf8",
);
const combatPanelLayout = [
  /addElement\(document\.body, "div", "player-panel", "d combat-panel"\)/,
  /addElement\(document\.body, "div", "enemy-panel", "d combat-panel"\)/,
  /dom\.d1m\.style\.top\s*=\s*"8px"/,
  /dom\.d1m\.style\.left\s*=\s*"457px"/,
];

if (!combatPanelLayout.every((pattern) => pattern.test(interfaceSource))) {
  throw new Error(
    "Combat layout regression: player and enemy panels need unique identities and pixel-based enemy coordinates.",
  );
}

console.log("Validated the player/enemy combat-panel positioning contract.");

const tooltipPositioning = [
  /function positionDescription\(c\)/,
  /global\.dscr\.style\.left\s*=\s*`\$\{Math\.max\(gap, left\)\}px`/,
  /global\.dscr\.style\.top\s*=\s*`\$\{Math\.max\(gap, top\)\}px`/,
  /dm\.addEventListener\("mousemove", \(a\) => \{\s*positionDescription\(a\);/,
];

if (!tooltipPositioning.every((pattern) => pattern.test(interfaceSource))) {
  throw new Error(
    "Tooltip regression: hover descriptions need pixel-based, viewport-aware pointer positioning.",
  );
}

const equipmentSource = fs.readFileSync(
  path.join(root, "js", "data", "equipment.js"),
  "utf8",
);
const staticEquipmentDescription = /\b(?:wpn|eqp|sld)\.\w+\.desc\s*=\s*["'`]/;

if (staticEquipmentDescription.test(equipmentSource)) {
  throw new Error(
    "Localization regression: static equipment descriptions must come from locale JSON.",
  );
}

console.log(
  "Validated hover-description positioning and equipment-description localization.",
);

const saveBarLayout = [
  /addElement\(dom\.sl, "div", "save-bar-controls"\)/,
  /addElement\(dom\.sl_controls, "span", null, "sl"\)/,
  /addElement\(dom\.autosve, "input", "autosave-toggle"\)/,
];

if (!saveBarLayout.every((pattern) => pattern.test(interfaceSource))) {
  throw new Error(
    "Save-bar regression: autosave, collapse, version, and delete controls must share an explicit layout group.",
  );
}

console.log("Validated the grouped save-bar control structure.");
