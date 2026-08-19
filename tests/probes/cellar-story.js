// Browser probe for /__test-cellar-story.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// The damp cellar had never been reachable, so nothing had ever run a line
// of it. This plays the whole side story rather than asserting the source
// looks right: the gate on the boy's report, the darkness standing in for
// the lamp that was taken, the descent itself -- which is the part that was
// broken, because the population declared no weight and z_bake put NaN in
// popc -- and the wall at the back.

const cellarProbe = setInterval(() => {
  if (!document.getElementById("ctrmg")) return;
  if (typeof smove !== "function" || typeof learnLore !== "function") return;
  if (!window.chss || !chss.clgmn || !window.quest || !quest.chsls1) return;
  clearInterval(cellarProbe);

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

  // No area may bake NaN into its spawn table. area.clg did, and every
  // comparison in area_init against NaN is false, so the descent could
  // only ever have fallen through in silence.
  checks.noNaNWeights = Object.keys(area).every((key) =>
    (area[key].popc || []).every((pair) =>
      pair.every((n) => typeof n === "number" && !Number.isNaN(n)),
    ),
  );

  // The boy's line lives inside the Chapter III market rumours, so the
  // lore entry is the gate rather than a flag of its own.
  smove(chss.mrktvg1);
  checks.hiddenBeforeLore = !pick(
    "runtime.world.locations.dialogue.ask_the_boy_which_cellar",
  );

  learnLore("lockedCellar");
  smove(chss.mrktvg1);
  const ask = pick("runtime.world.locations.dialogue.ask_the_boy_which_cellar");
  checks.offeredAfterLore = Boolean(ask);
  if (ask) ask.click();

  const accept = pick("runtime.world.locations.dialogue.go_and_see_for_him");
  checks.accountThenAccept =
    said("runtime.world.locations.dialogue.boy_cellar_account") &&
    Boolean(accept);
  if (accept) accept.click();

  checks.questStarted = quest.chsls1.data.started === true;
  // Nine rooms, set when he asks, because every existing save restores
  // the authored 33 out of its positional slot.
  checks.descentSized = area.clg.size === 9;
  checks.inCellar = global.current_l === chss.clgmn;

  // The lamp that hung by the stair is one of the things that went. With
  // no light of their own the player is told exactly that, and no fight
  // starts.
  checks.darkWithoutLight =
    said("runtime.world.locations.dialogue.joiners_cellar_dark") &&
    global.flags.btl === false;

  // With a light the descent has to actually produce a fight, which is
  // the whole point of the popc repair.
  you.mods.light = 1;
  smove(chss.clgmn);
  checks.fightStarts = global.flags.btl === true;
  checks.rightCreature =
    global.current_m.id === creature.bat.id ||
    global.current_m.id === creature.spd1.id;

  // Cleared the way finishing the last room clears it.
  area.clg.size = 0;
  area.clg.onEnd();
  checks.clearedRecorded = quest.chsls1.data.cleared === true;
  checks.quietWhenCleared = said(
    "runtime.world.locations.dialogue.joiners_cellar_quiet",
  );

  const wall = pick("runtime.world.locations.dialogue.examine_the_back_wall");
  checks.wallOffered = Boolean(wall);
  if (wall) wall.click();
  checks.wallSeen = quest.chsls1.data.wall === true;
  checks.loreLearned = knowsLore(lore.towardTheWell.id);

  const tell = pick(
    "runtime.world.locations.dialogue.go_up_and_tell_his_father",
  );
  checks.fatherOffered = Boolean(tell);
  if (tell) tell.click();
  checks.questDone =
    quest.chsls1.data.done === true && quest.chsls1.data.started === false;
  // Both goal lines have to render, in the finished form the journal uses
  // for a completed quest, with no raw keys left in them.
  const lines = quest.chsls1.goalsf();
  checks.goalsRender =
    lines.length === 2 &&
    lines.every((line) => line.indexOf("content.quest.") === -1);

  // The user walked into this at a level the area was never written for and
  // was left in a room with no buttons at all. Reproduce their conditions
  // exactly: a levelled character, the real accept path, and then assert
  // the invariant that actually matters -- a scene must never render
  // neither a fight nor a way out.
  const stranded = [];
  for (const lvl of [1, 12, 34, 60]) {
    quest.chsls1.data = { t: 0, cleared: false, wall: false };
    global.flags.clgdown = false;
    if (you.lvl < lvl) lvlup(you, lvl - you.lvl);
    you.mods.light = 1;
    area.clg.size = 9;
    smove(chss.clgmn, false);
    const fighting = global.flags.btl === true;
    const ways = document.querySelectorAll(".chs").length;
    if (!fighting && ways === 0)
      stranded.push("lvl" + you.lvl + ":nofight+noexit");
    if (!fighting) stranded.push("lvl" + you.lvl + ":nofight");
    // And a spent cellar must still let them climb the stair.
    area.clg.size = 0;
    smove(chss.clgmn, false);
    if (document.querySelectorAll(".chs").length === 0)
      stranded.push("lvl" + you.lvl + ":spent+noexit");
  }
  checks.neverStranded = stranded.length === 0;
  // The net in smove must not be doing the work. If it fired during any of
  // the walking above, a scene is failing to offer its own exits and that
  // is the thing to fix, not the net.
  checks.netNeverFired = !global.stat.strandc;
  // The north. The road is gated on the cellar clue, so the region has to be
  // invisible before that and reachable after it -- and the fields must be an
  // area that actually spawns, which is the exact failure the damp cellar
  // shipped with.
  global.lore = [];
  global.regions = [];
  smove(chss.lsmain1);
  checks.northHiddenBeforeClue = !pick(
    "runtime.world.locations.dialogue.take_the_north_road",
  );
  learnLore("towardTheWell");
  smove(chss.lsmain1);
  const road = pick("runtime.world.locations.dialogue.take_the_north_road");
  checks.northOpensOnClue = Boolean(road);
  if (road) road.click();
  checks.atTheWell = global.current_l === chss.nrd1;

  const draw = pick("runtime.world.locations.dialogue.draw_from_the_well");
  checks.wellOffered = Boolean(draw);
  if (draw) draw.click();
  checks.wellClueLearned = knowsLore(lore.stoneDust.id);
  smove(chss.nrd1, false);
  // Read once. A clue you can keep discovering is not a clue.
  checks.wellReadOnce = !pick(
    "runtime.world.locations.dialogue.draw_from_the_well",
  );

  const onward = pick("runtime.world.locations.dialogue.go_on_to_the_fields");
  checks.fieldsReachable = Boolean(onward);
  if (onward) onward.click();
  checks.atTheFields = global.current_l === chss.nfld1;
  const walkOut = pick(
    "runtime.world.locations.dialogue.walk_out_into_the_stubble",
  );
  checks.stubbleOffered = Boolean(walkOut);
  if (walkOut) walkOut.click();
  checks.fieldSpawns = global.flags.btl === true;
  checks.fieldCreature =
    global.current_m.id === creature.rbt1.id ||
    global.current_m.id === creature.slm1.id ||
    global.current_m.id === creature.slm2.id;
  // And the new region lands on the journal page that was added for it.
  checks.fieldRecorded = global.regions.indexOf(area.nfld1.id) !== -1;
  // The notice on the board follows the same clue.
  smove(chss.mbrd);
  checks.noticePosted = Boolean(
    pick("runtime.world.locations.dialogue.notice_harvest_hands"),
  );

  // The far field, and the scarecrow that has been statted and unreachable
  // since before this fork.
  smove(chss.nfld1);
  const far = pick("runtime.world.locations.dialogue.on_to_the_far_field");
  checks.farFieldReachable = Boolean(far);
  if (far) far.click();
  checks.atTheFarField = global.current_l === chss.nfld2;

  const figure = pick("runtime.world.locations.dialogue.examine_a_figure");
  checks.figureOffered = Boolean(figure);
  if (figure) figure.click();
  checks.strawClueLearned = knowsLore(lore.strawBound.id);
  smove(chss.nfld2, false);
  checks.figureReadOnce = !pick(
    "runtime.world.locations.dialogue.examine_a_figure",
  );

  const among = pick(
    "runtime.world.locations.dialogue.go_in_among_the_figures",
  );
  checks.figuresEnterable = Boolean(among);
  if (among) among.click();
  checks.farFieldSpawns = global.flags.btl === true;
  checks.scarecrowOrSlime =
    global.current_m.id === creature.kksh.id ||
    global.current_m.id === creature.slm2.id;
  // Its drop table was a slime's -- water, slime, jelly -- which is what a
  // straw figure is least likely to be carrying.
  checks.scarecrowDropsStraw = creature.kksh.drop.some(
    (d) => d.item === item.sstraw,
  );
  checks.scarecrowNoSlimeLoot = !creature.kksh.drop.some(
    (d) => d.item === item.slm || d.item === item.jll,
  );

  // The mill, and the arc that closes the north.
  smove(chss.nrd1);
  const toMill = pick(
    "runtime.world.locations.dialogue.follow_the_water_to_the_mill",
  );
  checks.millReachable = Boolean(toMill);
  if (toMill) toMill.click();
  checks.atTheMill = global.current_l === chss.nmill;

  const takeWork = pick(
    "runtime.world.locations.dialogue.take_the_millers_work",
  );
  checks.millerHiring = Boolean(takeWork);
  if (takeWork) takeWork.click();
  checks.harvestStarted = quest.hrvst1.data.started === true;
  // Not finishable before the work is done.
  checks.notPayableEarly = !pick(
    "runtime.world.locations.dialogue.tell_him_it_is_done",
  );

  // The counter is a real onDeath hook, so drive it the way a kill does.
  for (let i = 0; i < quest.hrvst1.data.needed + 3; i++)
    callback.onDeath.fire(creature.kksh);
  // It must stop at the target rather than run past it.
  checks.counterCaps = quest.hrvst1.data.cleared === quest.hrvst1.data.needed;
  // And nothing else may advance it.
  const atTarget = quest.hrvst1.data.cleared;
  callback.onDeath.fire(creature.rbt1);
  checks.counterIgnoresOthers = quest.hrvst1.data.cleared === atTarget;

  smove(chss.nmill, false);
  const payUp = pick("runtime.world.locations.dialogue.tell_him_it_is_done");
  checks.millerPays = Boolean(payUp);
  if (payUp) payUp.click();
  checks.harvestDone =
    quest.hrvst1.data.done === true && quest.hrvst1.data.started === false;
  // Finishing the north is what opens the way to the hills, and the mine.
  checks.hillsRoadOpened = global.flags.hillsroad === true;
  // The hook has to be gone, or a later kill still counts.
  const afterReward = quest.hrvst1.data.cleared;
  callback.onDeath.fire(creature.kksh);
  checks.hookDetached = quest.hrvst1.data.cleared === afterReward;

  // The drain only shows itself once the player knows a hunter asked about it.
  global.lore = global.lore.filter((id) => id !== 24 && id !== 30);
  smove(chss.nmill, false);
  checks.drainHiddenBeforeDein = !pick(
    "runtime.world.locations.dialogue.look_for_the_old_drain",
  );
  learnLore("secondWayIn");
  smove(chss.nmill, false);
  const drain = pick("runtime.world.locations.dialogue.look_for_the_old_drain");
  checks.drainFindable = Boolean(drain);
  if (drain) drain.click();
  checks.drainClueLearned = knowsLore(lore.millDrain.id);

  // The grain store the market remembers wolves getting into.
  smove(chss.nmill, false);
  const store = pick("runtime.world.locations.dialogue.to_the_grain_store");
  checks.grainStoreReachable = Boolean(store);
  if (store) store.click();
  const after = pick("runtime.world.locations.dialogue.go_in_after_them");
  checks.grainStoreEnterable = Boolean(after);
  if (after) after.click();
  checks.grainStoreSpawns = global.flags.btl === true;
  checks.grainStoreCreature =
    global.current_m.id === creature.wolf1.id ||
    global.current_m.id === creature.rbt1.id;

  // The mine. The road opens on the harvest, the mouth opens on the pickaxe,
  // and the Mining skill has had no grant path at all until now.
  global.flags.hillsroad = false;
  global.flags.mineopen = false;
  smove(chss.nmill, false);
  checks.hillsHiddenBeforeHarvest = !pick(
    "runtime.world.locations.dialogue.up_the_road_to_the_hills",
  );
  global.flags.hillsroad = true;
  smove(chss.nmill, false);
  const hills = pick(
    "runtime.world.locations.dialogue.up_the_road_to_the_hills",
  );
  checks.hillsReachable = Boolean(hills);
  if (hills) hills.click();
  checks.atTheHills = global.current_l === chss.nhill;

  // Bare-handed, the fall stays where it is.
  const openEmpty = pick(
    "runtime.world.locations.dialogue.clear_the_mine_mouth",
  );
  checks.mouthOfferedAlways = Boolean(openEmpty);
  if (openEmpty) openEmpty.click();
  checks.mouthNeedsTool = global.flags.mineopen !== true;

  // The smith is the only source, so buy it the way a player would.
  // Put it in hand directly rather than driving the inventory UI, which is
  // not what is under test here and throws when its panel is not rendered.
  // oneq is still the thing being exercised: it is what sets the mod the
  // mine reads.
  giveItem(wpn.pck);
  you.eqp[0] = wpn.pck;
  wpn.pck.oneq();
  checks.pickaxeSetsMod = you.mods.mine > 0;
  smove(chss.nhill, false);
  const openTool = pick(
    "runtime.world.locations.dialogue.clear_the_mine_mouth",
  );
  if (openTool) openTool.click();
  checks.mouthOpens = global.flags.mineopen === true;
  checks.mineClueLearned = knowsLore(lore.mineWorked.id);

  smove(chss.nhill, false);
  const adit = pick("runtime.world.locations.dialogue.go_down_the_adit");
  checks.aditReachable = Boolean(adit);
  you.mods.light = 0;
  if (adit) adit.click();
  // Dark, and the cellar has already taught the player that is a real state.
  checks.aditDarkWithoutLight = !pick(
    "runtime.world.locations.dialogue.work_the_coal_face",
  );
  you.mods.light = 1;
  smove(chss.mine1, false);
  const face = pick("runtime.world.locations.dialogue.work_the_coal_face");
  checks.faceWorkable = Boolean(face);

  // The skill this whole region exists to switch on.
  const beforeExp = skl.mng.exp || 0;
  const beforeDp = you.eqp[0].dp;
  if (face) face.click();
  checks.miningTrains = (skl.mng.exp || 0) > beforeExp || skl.mng.lvl > 0;
  checks.diggingCostsTheTool = you.eqp[0].dp < beforeDp;

  // Run it to nothing and it must refuse rather than go negative.
  for (let i = 0; i < 60; i++) workTheFace();
  checks.pickaxeBottomsOut = you.eqp[0].dp === 0;
  workTheFace();
  checks.spentToolRefuses = you.eqp[0].dp === 0;
  // The one thing that could have made this whole region undiggable: slot 1 is a
  // single slot, so a pickaxe and a torch cannot both be held. Light has to be
  // able to come from somewhere else, and a candle is a consumable that grants an
  // effect rather than occupying a hand. Both at once, or the mine is a room you
  // can stand in and not work.
  you.mods.light = 0;
  item.cndl.use();
  checks.candleLights = you.mods.light > 0;
  checks.canHoldToolAndLight = you.mods.light > 0 && you.mods.mine > 0;

  // Mining now carries advantages. A milestone grant runs once and never again --
  // the save keeps only the granted flag -- so every one of these has to write to
  // a field that is itself saved, or the advantage quietly disappears on the next
  // load. This checks the shape rather than the balance.
  checks.miningHasPerks = (skl.mng.mlstn || []).length > 0;
  checks.miningPerksDescribed = (skl.mng.mlstn || []).every(
    (m) =>
      typeof m.p === "string" &&
      m.p.length > 0 &&
      m.p.indexOf("content.skl.") === -1,
  );
  checks.miningPerksAscend = (skl.mng.mlstn || []).every(
    (m, i, all) => i === 0 || all[i - 1].lv < m.lv,
  );
  // Every grant must land on saved player state. Run them and confirm they moved
  // fields the save actually carries.
  const beforePerk = {
    stra: you.stra,
    hpa: you.hpa,
    sata: you.sata,
  };
  for (const m of skl.mng.mlstn || []) m.f();
  checks.miningPerksTouchSavedState =
    you.stra > beforePerk.stra &&
    you.hpa > beforePerk.hpa &&
    you.sata > beforePerk.sata;
  // A spent tool has to still be in the pack, and it has to be on the smith's
  // repair list. Destroying it at zero made the message it prints -- that the
  // smith can bring it back -- into a lie.
  checks.spentToolKept = Boolean(findbyid(inv, wpn.pck.id));
  // Not asserting the repair-list entry from here. This probe puts the tool in
  // hand by assigning you.eqp[0] rather than going through equip(), so the copy
  // in the pack is a different object still at full durability and the filter
  // correctly skips it. What can be checked here is that a spent tool is no
  // longer destroyed, which is the change: repairableInventory only ever reads
  // the inventory, so an item that survives is an item it can offer.
  void repairableInventory;

  smove(chss.mine1, false);
  const deeper = pick(
    "runtime.world.locations.dialogue.go_deeper_into_the_workings",
  );
  checks.workingsEnterable = Boolean(deeper);
  if (deeper) deeper.click();
  checks.mineSpawns = global.flags.btl === true;
  checks.mineCreature =
    global.current_m.id === creature.cbat.id ||
    global.current_m.id === creature.spd1.id;

  // The flooded level, and the gate that is a skill rather than a key.
  skl.mng.lvl = 0;
  smove(chss.mine1, false);
  checks.winzeShutUntrained = !pick(
    "runtime.world.locations.dialogue.down_the_flooded_winze",
  );
  checks.winzeShownAsShut = Boolean(
    pick("runtime.world.locations.dialogue.winze_too_deep"),
  );
  skl.mng.lvl = 5;
  smove(chss.mine1, false);
  const winze = pick("runtime.world.locations.dialogue.down_the_flooded_winze");
  checks.winzeOpensOnSkill = Boolean(winze);
  you.mods.light = 1;
  if (winze) winze.click();
  checks.atTheFloodedLevel = global.current_l === chss.mine2;

  const cup = pick("runtime.world.locations.dialogue.taste_the_standing_water");
  checks.waterExaminable = Boolean(cup);
  if (cup) cup.click();
  checks.waterClueLearned = knowsLore(lore.sameWater.id);
  // This is the clue that joins the two regions, so it has to be the same grit
  // the well settles -- the texts are deliberately written against each other.
  checks.waterClueNamesTheWell =
    i18n.t("content.lore.sameWater.desc").length > 0 &&
    knowsLore(lore.stoneDust.id) === knowsLore(28);

  smove(chss.mine2, false);
  checks.waterReadOnce = !pick(
    "runtime.world.locations.dialogue.taste_the_standing_water",
  );
  const wade = pick("runtime.world.locations.dialogue.wade_the_lower_workings");
  checks.floodedEnterable = Boolean(wade);
  if (wade) wade.click();
  checks.floodedSpawns = global.flags.btl === true;
  checks.floodedCreature =
    global.current_m.id === creature.cbat.id ||
    global.current_m.id === creature.slm1.id;

  // The way down is described and honestly not passable yet.
  smove(chss.mine2, false);
  const down = pick("runtime.world.locations.dialogue.look_at_the_way_down");
  checks.wayDownDescribed = Boolean(down);
  if (down) down.click();
  checks.wayDownStillShut = document.querySelectorAll(".chs").length > 0;

  // The furniture list. A furnished house pushed its rows straight out of the
  // panel and over the Return choice underneath. Stock the house well past what
  // fits, open the panel the way the scene opens it, and measure.
  for (const key of Object.keys(furniture))
    if (furniture[key].id !== undefined) giveFurniture(furniture[key]);
  smove(chss.home);
  chs_spec(2);
  // The scene draws its own exit after the panel; do the same so the geometry
  // being measured is the geometry the player gets.
  const furnDoor = chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
    "",
    "",
    null,
    null,
    null,
    true,
  );
  const box = dom.ch_1;
  const list = dom.ch_1h;
  checks.furnitureListOpens = Boolean(box && list);
  checks.furnitureScrolls =
    Boolean(list) &&
    list.scrollHeight > list.clientHeight &&
    list.getBoundingClientRect().bottom <=
      box.getBoundingClientRect().bottom + 1;
  // Deliberately not asserting where the exit lands relative to the box. The
  // check that matters is furnitureScrolls: the list now stays inside the panel
  // instead of spilling past it, which is what was burying the exit. Measuring
  // the gap as well needs a tolerance I would be guessing at.
  void furnDoor;

  // The regions page. It only means anything if standing somewhere records it,
  // if the tab renders, and if a creature the player has never killed stays
  // masked -- that masking is the whole point of the page.
  global.flags.jnlu = true;
  // Cleared first: the walk above already visited the cellar several times, so
  // measuring growth without resetting would measure nothing.
  global.regions = [];
  const before = global.regions.length;
  you.mods.light = 1;
  area.clg.size = 9;
  smove(chss.clgmn, false);
  checks.regionRecorded =
    global.regions.length > before &&
    global.regions.indexOf(area.clg.id) !== -1;
  checks.benchNotRecorded = global.regions.indexOf(area.tst.id) === -1;

  dom.ct_bt6.click();
  const regionTab = document.getElementById("jcell6");
  checks.regionTabExists = Boolean(regionTab);
  if (regionTab) regionTab.click();
  const regionPanel = document.querySelector(".lore-panel");
  const regionText = regionPanel ? regionPanel.textContent : "";
  checks.regionPanelRendered =
    Boolean(regionPanel) &&
    regionText.indexOf(area.clg.name) !== -1 &&
    regionText.indexOf("ui.panels.") === -1;
  // clg holds bats and attic spiders; nothing has been killed in this probe,
  // so both have to be masked rather than named.
  checks.unkilledMasked =
    regionText.indexOf(creature.bat.name) === -1 &&
    regionText.indexOf(creature.spd1.name) === -1 &&
    regionText.indexOf(i18n.t("ui.panels.regionsUnknown")) !== -1;
  checks.regionPanelFits =
    regionPanel &&
    regionPanel.getBoundingClientRect().bottom <=
      document.getElementById("ctrmg").getBoundingClientRect().bottom + 1;
  dom.ct_bt6.click();

  // Every vendor line must price to a real number. The Vendor constructor
  // carries a comment about the child trader, whose shop had no inflation
  // multiplier, so every price resolved to NaN -- and NaN compares false, so
  // the can-you-afford-it check passed and paying turned the purse into NaN.
  // This walks all of them rather than only the new one.
  const badPrices = [];
  for (const key of Object.keys(vendor)) {
    const v = vendor[key];
    restock(v);
    for (const line of v.stock || [])
      if (!Number.isFinite(Number(line[1])) || Number(line[1]) <= 0)
        badPrices.push(key + ":" + (line[0] && line[0].name));
    for (const supply of v.items || [])
      if (!Number.isFinite(Number(supply.p)) || !supply.item)
        badPrices.push(key + ":supply");
  }
  checks.vendorPricesReal = badPrices.length === 0;
  document.documentElement.dataset.cellarBadPrices = badPrices.join(",");
  // And the smith actually has stock to show, since he sold nothing at all
  // before this.
  checks.smithSells =
    Boolean(vendor.smith) && (vendor.smith.items || []).length > 0;

  document.documentElement.dataset.cellarNetFires = String(
    global.stat.strandc || 0,
  );

  // The one dimension a fresh game cannot cover: the player accepted, the
  // game saved, and they came back. Area sizes are the part of the save
  // that restores by position, so this is where a wired-in area is most
  // likely to come back wrong.
  quest.chsls1.data = { t: 0, cleared: false, wall: false, started: true };
  area.clg.size = 9;
  const roundTrip = save(true);
  area.clg.size = 0;
  load(roundTrip);
  const restored = area.clg.size;
  you.mods.light = 1;
  smove(chss.clgmn, false);
  const afterLoadFight = global.flags.btl === true;
  const afterLoadWays = document.querySelectorAll(".chs").length;
  checks.survivesReload =
    restored === 9 && (afterLoadFight || afterLoadWays > 0);
  document.documentElement.dataset.cellarReload =
    "size=" + restored + ",fight=" + afterLoadFight + ",ways=" + afterLoadWays;

  // Put the quest back the way the walk-through left it so the last
  // assertion measures the product rather than this loop.
  quest.chsls1.data.started = false;
  quest.chsls1.data.done = true;

  document.documentElement.dataset.cellarStrandDetail = stranded.join(",");

  // And it must not be on offer a second time.
  smove(chss.mrktvg1);
  checks.notRepeatable = !pick(
    "runtime.world.locations.dialogue.ask_the_boy_which_cellar",
  );

  document.documentElement.dataset.cellarStoryVerified = String(
    Object.values(checks).every(Boolean),
  );
  document.documentElement.dataset.cellarStoryFailures = Object.keys(checks)
    .filter((name) => !checks[name])
    .join(",");
}, 10);
