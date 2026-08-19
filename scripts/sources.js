// The source files that make up the game, in the order they must be concatenated.
// The bundle is one global scope, so this order is load order: a file may only
// reference a value from an earlier file at definition time.
//
// Shared by scripts/build.js and the checks under scripts/, so a new source file
// is registered once.
module.exports = [
  "js/core/bootstrap.js",
  "js/utils/dom.js",
  "js/utils/object.js",
  "js/data/titles.js",
  "js/data/effects.js",
  "js/data/furniture.js",
  "js/data/quests.js",
  "js/data/lore.js",
  "js/data/skills.js",
  "js/data/items.js",
  "js/data/equipment.js",
  "js/core/player.js",
  "js/data/creatures.js",
  "js/systems/abilities.js",
  "js/systems/effectors.js",
  "js/world/areas.js",
  "js/world/sectors.js",
  "js/systems/containers.js",
  "js/systems/crafting.js",
  "js/systems/actions.js",
  "js/ui/interface.js",
  "js/systems/combat.js",
  "js/world/locations.js",
  "js/systems/simulation.js",
  "js/systems/planner.js",
  "js/ui/map-and-mastery.js",
  "js/utils/random.js",
  "js/utils/encoding.js",
];
