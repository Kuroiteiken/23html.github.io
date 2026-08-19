// Browser probe for /__test-stone-plate.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// creature.lrck had eleven fields, no area and no scene, and 9000 health
// behind a battle_ai that never takes its turn. This plays what it became:
// a slab in the western corridor that only opens up for a player who has
// already searched the catacombs and found a chisel handle in a heap.

const plateProbe = setInterval(() => {
  if (!document.getElementById("ctrmg")) return;
  if (typeof smove !== "function" || typeof learnLore !== "function") return;
  if (!window.chss || !chss.cata17 || !area.lrck1) return;
  clearInterval(plateProbe);

  const pick = (key) => {
    const want = i18n.t(key).trim();
    return [...document.querySelectorAll(".chs")].find(
      (el) => el.textContent.trim() === want,
    );
  };
  const said = (key) => {
    const el = document.getElementById("chs");
    const head = i18n.t(key).split("<br>")[0];
    return Boolean(el) && el.textContent.indexOf(head) !== -1;
  };
  const checks = {};

  // Areas are saved by position and read back by position, so anything
  // inserted above an existing area silently reassigns every later size.
  // The new one has to be last, and the ones that were already there have
  // to be where they were.
  // Pinned slots rather than "which one is last". The invariant the save format
  // needs is that an area which already existed keeps its position, and every
  // new one goes on the end -- so appending leaves these numbers alone, while
  // inserting anywhere above them moves one and fails here. Asserting that
  // lrck1 is last only held until the next area was appended after it.
  const order = Object.keys(area);
  checks.clgKeepsItsSlot = order.indexOf("clg") === 6;
  checks.cata5aKeepsItsSlot = order.indexOf("cata5a") === 23;
  checks.lrckKeepsItsSlot = order.indexOf("lrck1") === 24;

  // A wall, not a fight: it never takes its turn, and the health is a
  // slab's thickness rather than the authored 9000.
  checks.doesNotFight = creature.lrck.battle_ai() === false;
  checks.setPieceHealth = creature.lrck.hp_r > 0 && creature.lrck.hp_r <= 2000;
  // Bring the right tool. Blunt gets through; an edge skates off; a point
  // finds nothing to open.
  checks.bluntIsBest =
    creature.lrck.cls[0] < creature.lrck.cls[1] &&
    creature.lrck.cls[1] < creature.lrck.cls[2];
  // Construct, and level barely moves it.
  checks.construct = creature.lrck.ctype === 2;
  checks.barelyScales = creature.lrck.stat_p[0] <= 0.2;

  // Optional and earned. Until the sector's scout table has turned up the
  // heap with a chisel handle in it, the slab is just a wall.
  you.mods.light = 1;
  sector.cata1.data.gets[3] = false;
  smove(chss.cata17);
  checks.hiddenBeforeTools = !pick(
    "runtime.world.locations.dialogue.look_at_the_stone_plate",
  );

  sector.cata1.data.gets[3] = true;
  smove(chss.cata17);
  const look = pick("runtime.world.locations.dialogue.look_at_the_stone_plate");
  checks.offeredAfterTools = Boolean(look);
  if (look) look.click();

  const breakIt = pick("runtime.world.locations.dialogue.break_it_open");
  checks.examinedThenBreak =
    said("runtime.world.locations.dialogue.stone_plate_examined") &&
    Boolean(breakIt);
  // Walking away has to be an option, and has to work.
  checks.canLeaveItAlone = Boolean(
    pick("runtime.world.locations.dialogue.leave_it_alone"),
  );
  if (breakIt) breakIt.click();

  checks.fightStarts = global.flags.btl === true;
  checks.rightCreature = global.current_m.id === creature.lrck.id;

  // Broken the way the last swing breaks it.
  area.lrck1.size = 0;
  area.lrck1.onEnd();
  checks.backInTheRoom = global.current_l === chss.cata17;
  // A wall that has been broken stays broken, so the size is not restored
  // the way area.cata5a restores its encounter.
  checks.staysBroken = area.lrck1.size <= 0;
  checks.slabGoneFromChoices = !pick(
    "runtime.world.locations.dialogue.look_at_the_stone_plate",
  );

  const passage = pick("runtime.world.locations.dialogue.the_cut_passage");
  checks.passageOffered = Boolean(passage);
  if (passage) passage.click();
  checks.passageDescribed = said(
    "runtime.world.locations.dialogue.stone_plate_opened",
  );
  checks.loreLearned =
    knowsLore(lore.toolMarks.id) && knowsLore(lore.whoseHand.id);
  // The chisel marks and the hunter's route mark are two different
  // signatures and must not have been written as one.
  checks.distinctFromHunterMark =
    i18n
      .t("content.lore.toolMarks.desc")
      .indexOf(i18n.t("content.lore.threeAndAcross.name")) === -1;

  document.documentElement.dataset.stonePlateVerified = String(
    Object.values(checks).every(Boolean),
  );
  document.documentElement.dataset.stonePlateFailures = Object.keys(checks)
    .filter((name) => !checks[name])
    .join(",");
}, 10);
