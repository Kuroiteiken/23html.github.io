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
