// Quest definitions and the accept/complete lifecycle. Each quest tracks its
// own progress in `data`, reports it through `goals()` and `goalsf()`, and
// grants its rewards through `rwd()`. Quests that watch for world events attach
// themselves to the callback hooks declared in js/data/titles.js.

function Quest() {
  this.name = "dummy";
  this.desc = "dummy";
  this.cond = "dummy";
  this.tracker = function () {};
  this.fpending = function () {};
  this.init = function () {};
  this.check = function () {};
  this.id = 0;
  this.rwd = function () {};
  this.data = { started: false, done: false, pending: false, toup: false };
}

quest.test = new Quest();
quest.test.id = 1;
quest.test.name = i18n.t("content.quest.test.name");
quest.test.desc = i18n.t("content.quest.test.desc");
quest.test.init = function () {
  this.data.itm = item.rwmt1;
  this.data.started = true;
};
quest.test.tracker = function () {
  if (this.data.itm.amount >= 10) this.data.pending = true;
  else {
    this.data.pending = false;
    this.data.toup = true;
  }
};
quest.test.fpending = function () {
  msg(i18n.t("runtime.data.quests.dialogue.10_item_found_897eabe9"));
  this.data.toup = false;
};
quest.test.rwd = function () {
  this.data.done = true;
  this.data.pending = false;
  msg(i18n.t("runtime.data.quests.dialogue.done_e5fd9cfe"));
};

quest.fwd1 = new Quest();
quest.fwd1.id = 2;
quest.fwd1.name = i18n.t("content.quest.fwd1.name");
quest.fwd1.rar = 1;
quest.fwd1.desc = i18n.t("content.quest.fwd1.desc");
quest.fwd1.hint = i18n.t("content.quest.fwd1.hint");
quest.fwd1.loc = i18n.t(
  "runtime.world.locations.dialogue.western_woods_hunter_s_lodge_375ce411",
);
quest.fwd1.rwd = function () {
  you.karma++;
  giveWealth(100);
  giveItem(sld.bkl);
  smove(chss.frstn1b1, false);
  giveExp(15000, true, true, true);
};
quest.fwd1.goals = function () {
  let c;
  if (item.fwd1.amount >= 10) c = "lime";
  else if (item.fwd1.amount < 10 && item.fwd1.amount > 0) c = "yellow";
  else if (item.fwd1.amount <= 0) c = "red";
  return [
    i18n.t("content.quest.fwd1.goal", {
      color: c,
      current: item.fwd1.amount,
      required: 10,
    }),
  ];
};
quest.fwd1.goalsf = function () {
  return [
    i18n.t("content.quest.fwd1.goal", {
      color: "lime",
      current: 10,
      required: 10,
    }),
  ];
};

quest.hnt1 = new Quest();
quest.hnt1.id = 3;
quest.hnt1.name = i18n.t("content.quest.hnt1.name");
quest.hnt1.rar = 1;
quest.hnt1.desc = i18n.t("content.quest.hnt1.desc");
quest.hnt1.hint = i18n.t("content.quest.hnt1.hint");
quest.hnt1.loc = i18n.t(
  "runtime.world.locations.dialogue.western_woods_hunter_s_lodge_375ce411",
);
quest.hnt1.rwd = function () {
  you.karma++;
  giveWealth(130);
  giveItem(item.jrk1, 10);
  giveExp(12000, true, true, true);
};
quest.hnt1.goals = function () {
  let c;
  if (item.rwmt1.amount >= 10) c = "lime";
  else if (item.rwmt1.amount < 10 && item.rwmt1.amount > 0) c = "yellow";
  else if (item.rwmt1.amount <= 0) c = "red";
  return [
    i18n.t("content.quest.hnt1.goal", {
      color: c,
      current: item.rwmt1.amount,
      required: 10,
    }),
  ];
};
quest.hnt1.goalsf = function () {
  return [
    i18n.t("content.quest.hnt1.goal", {
      color: "lime",
      current: 10,
      required: 10,
    }),
  ];
};

quest.grds1 = new Quest();
quest.grds1.id = 4;
quest.grds1.name = i18n.t("content.quest.grds1.name");
quest.grds1.rar = 1;
quest.grds1.loc = i18n.t(
  "runtime.world.locations.dialogue.village_center_marketplace_entry_gate_d83b4644",
);
quest.grds1.desc = i18n.t("content.quest.grds1.desc");
quest.grds1.hint = i18n.t("content.quest.grds1.hint");
quest.grds1.data.t = 0;
quest.grds1.repeatable = true;
quest.grds1.rwd = function () {
  this.data.t++;
  giveWealth(65);
  giveExp(3000, true, true, true);
  global.stat.jcom++;
};
quest.grds1.goals = function () {
  return [
    i18n.t("content.quest.grds1.goal", {
      color: "yellow",
      state: i18n.t("content.quest.grds1.stateInProgress"),
    }),
  ];
};
quest.grds1.goalsf = function () {
  return [
    i18n.t("content.quest.grds1.goal", {
      color: "lime",
      state: i18n.t("content.quest.grds1.stateDone"),
    }),
  ];
};

quest.lmfstkil1 = new Quest();
quest.lmfstkil1.id = 5;
quest.lmfstkil1.name = i18n.t("content.quest.lmfstkil1.name");
quest.lmfstkil1.rar = 1;
quest.lmfstkil1.loc = i18n.t(
  "runtime.world.locations.dialogue.western_woods_hunter_s_lodge_375ce411",
);
quest.lmfstkil1.desc = i18n.t("content.quest.lmfstkil1.desc");
quest.lmfstkil1.hint = i18n.t("content.quest.lmfstkil1.hint");
quest.lmfstkil1.data = { t: 0, mkilled: 0 };
quest.lmfstkil1.init = function () {
  this.callback();
};
quest.lmfstkil1.callback = function () {
  if (!quest.lmfstkil1.data.done)
    attachCallback(callback.onDeath, {
      f(victim, killer) {
        if (victim.id === creature.wolf1.id) quest.lmfstkil1.data.mkilled++;
        if (
          quest.lmfstkil1.data.mkilled &&
          !quest.lmfstkil1.data.weird1 &&
          quest.lmfstkil1.data.mkilled >= 35
        ) {
          msg(
            i18n.t(
              "runtime.data.quests.dialogue.you_hear_a_piercing_wail_6db06040",
            ),
            "red",
          );
          quest.lmfstkil1.data.weird1 = true;
          smove(chss.frstn3main);
        }
      },
      id: 1005,
      data: { q: true },
    });
};
quest.lmfstkil1.rwd = function () {
  this.data.t++;
  giveWealth(300);
  giveItem(wpn.gsprw);
  giveItem(eqp.nkgd);
  giveExp(18000, true, true, true);
  // The Wolf Slayer title existed but had no grant path, even though this is
  // the quest that has the player hunt down a wolf pack.
  giveTitle(ttl.wsl);
  // The wail the player heard is the question this leaves behind.
  learnLore("wolvesTurned");
  // Yamato closes this quest promising to send for the player later. The day the
  // promise was made is recorded so the lodge can honour it after a rest rather
  // than the moment the reward is taken.
  this.data.rday = time.day;
  detachCallback(callback.onDeath, 1005);
};
quest.lmfstkil1.goals = function () {
  let c;
  if (quest.lmfstkil1.data.mkilled >= 35) c = "lime";
  else if (quest.lmfstkil1.data.mkilled < 35) c = "yellow";
  return [
    i18n.t("content.quest.lmfstkil1.goal", {
      color: c,
      current: quest.lmfstkil1.data.mkilled,
      required: 35,
    }),
  ];
};
quest.lmfstkil1.goalsf = function () {
  return [
    i18n.t("content.quest.lmfstkil1.goal", {
      color: "lime",
      current: 35,
      required: 35,
    }),
  ];
};

// The wolf hunt ends on Yamato's own hook: the wail the player heard might have
// been the leader of the pack. This is that hook paid off. It is also the first
// quest that treats the player as a hunter Yamato relies on rather than a
// rookie working a board.
quest.pckld1 = new Quest();
quest.pckld1.id = 6;
quest.pckld1.name = i18n.t("content.quest.pckld1.name");
quest.pckld1.rar = 2;
quest.pckld1.loc = i18n.t(
  "runtime.world.locations.dialogue.western_woods_hunter_s_lodge_375ce411",
);
quest.pckld1.desc = i18n.t("content.quest.pckld1.desc");
quest.pckld1.hint = i18n.t("content.quest.pckld1.hint");
quest.pckld1.data = { t: 0, killed: false };
quest.pckld1.init = function () {
  this.callback();
};
// Rebuilt on load the same way the wolf hunt's hook is: load() drops every hook
// marked with `q` and then calls each started quest's callback again.
quest.pckld1.callback = function () {
  if (!quest.pckld1.data.done)
    attachCallback(callback.onDeath, {
      f(victim) {
        if (victim.id !== creature.wolfa1.id || quest.pckld1.data.killed)
          return;
        quest.pckld1.data.killed = true;
        msg(i18n.t("runtime.data.quests.dialogue.pack_leader_falls"), "orange");
        smove(chss.frstn10main);
      },
      id: 1006,
      data: { q: true },
    });
};
quest.pckld1.rwd = function () {
  this.data.t++;
  giveWealth(600);
  // The Wolf Mask had no source at all. The pack leader is the one creature in
  // the game it belongs to.
  giveItem(eqp.amsk);
  giveExp(26000, true, true, true);
  detachCallback(callback.onDeath, 1006);
};
quest.pckld1.goals = function () {
  return [
    i18n.t("content.quest.pckld1.goal", {
      color: quest.pckld1.data.killed ? "lime" : "yellow",
      state: i18n.t(
        quest.pckld1.data.killed
          ? "content.quest.pckld1.stateDone"
          : "content.quest.pckld1.stateInProgress",
      ),
    }),
  ];
};
quest.pckld1.goalsf = function () {
  return [
    i18n.t("content.quest.pckld1.goal", {
      color: "lime",
      state: i18n.t("content.quest.pckld1.stateDone"),
    }),
  ];
};

// Chapter III. The pack leader's report sends the player to the old shopkeeper by
// the cellars, who has been saying for a month that something is digging under
// people's homes and has been called a drunk for it. This one is an investigation
// rather than a hunt: the player gathers signs around the village, in any order,
// and only once enough of them line up does the last one — their own cellar —
// become something they can act on.
//
// Signs are recorded by id rather than by count so a scene can never award the
// same one twice, however many times the player revisits it.
const undercitySigns = [
  "cellar", // the shopkeeper's own account of what his neighbours report
  "market", // what the marketplace is saying, and what has gone missing
  "home", // the player's basement: the wall that is no longer sound
];

function findUndercitySign(sign) {
  const q = quest.undcty1;
  if (!q.data.started || q.data.done) return false;
  if (!undercitySigns.includes(sign)) return false;
  if (q.data.signs.includes(sign)) return false;
  q.data.signs.push(sign);
  msg(
    i18n.t("runtime.data.quests.dialogue.undercity_sign_found", {
      current: q.data.signs.length,
      required: undercitySigns.length,
    }),
    "white",
    q,
    8,
  );
  return true;
}

function undercitySignsFound() {
  return quest.undcty1.data.signs.length >= undercitySigns.length;
}

quest.undcty1 = new Quest();
quest.undcty1.id = 7;
quest.undcty1.name = i18n.t("content.quest.undcty1.name");
quest.undcty1.rar = 2;
quest.undcty1.loc = i18n.t(
  "runtime.world.locations.dialogue.village_center_9264705d",
);
quest.undcty1.desc = i18n.t("content.quest.undcty1.desc");
quest.undcty1.hint = i18n.t("content.quest.undcty1.hint");
quest.undcty1.data = { t: 0, signs: [], opened: false };
quest.undcty1.rwd = function () {
  this.data.t++;
  giveWealth(250);
  giveExp(9000, true, true, true);
};
quest.undcty1.goals = function () {
  const found = quest.undcty1.data.signs.length;
  return [
    i18n.t("content.quest.undcty1.goal", {
      color: found >= undercitySigns.length ? "lime" : found ? "yellow" : "red",
      current: found,
      required: undercitySigns.length,
    }),
  ];
};
quest.undcty1.goalsf = function () {
  return [
    i18n.t("content.quest.undcty1.goal", {
      color: "lime",
      current: undercitySigns.length,
      required: undercitySigns.length,
    }),
  ];
};

// Chapter IV. The player has been down and come back, so Yamato wants to know how
// far it goes. The corridor answers that; what is standing at the end of it
// answers why any of this is happening now, because a Disaster Corpse cannot
// manifest at all unless the dark ki in a place is already deep — its own
// description says so. And the last thing the player finds there is not a monster.
quest.undcty2 = new Quest();
quest.undcty2.id = 8;
quest.undcty2.name = i18n.t("content.quest.undcty2.name");
quest.undcty2.rar = 3;
quest.undcty2.loc = i18n.t(
  "runtime.world.locations.dialogue.western_woods_hunter_s_lodge_375ce411",
);
quest.undcty2.desc = i18n.t("content.quest.undcty2.desc");
quest.undcty2.hint = i18n.t("content.quest.undcty2.hint");
quest.undcty2.data = { t: 0, killed: false };
quest.undcty2.init = function () {
  this.callback();
};
quest.undcty2.callback = function () {
  if (!quest.undcty2.data.done)
    attachCallback(callback.onDeath, {
      f(victim) {
        if (victim.id !== creature.dcrps1.id || quest.undcty2.data.killed)
          return;
        quest.undcty2.data.killed = true;
        msg(
          i18n.t("runtime.data.quests.dialogue.the_end_falls_quiet"),
          "orange",
        );
        smove(chss.cata25);
      },
      id: 1007,
      data: { q: true },
    });
};
quest.undcty2.rwd = function () {
  this.data.t++;
  giveWealth(1400);
  // The Ruin Medallion had no drop, recipe, or vendor anywhere in the game, and
  // there is no ruin in it older than this one.
  giveItem(acc.rmedlon);
  giveExp(52000, true, true, true);
  detachCallback(callback.onDeath, 1007);
};
quest.undcty2.goals = function () {
  return [
    i18n.t("content.quest.undcty2.goal", {
      color: quest.undcty2.data.killed ? "lime" : "yellow",
      state: i18n.t(
        quest.undcty2.data.killed
          ? "content.quest.undcty2.stateDone"
          : "content.quest.undcty2.stateInProgress",
      ),
    }),
  ];
};
quest.undcty2.goalsf = function () {
  return [
    i18n.t("content.quest.undcty2.goal", {
      color: "lime",
      state: i18n.t("content.quest.undcty2.stateDone"),
    }),
  ];
};

// Side story. The nervous man at the market stalls has stood there since before
// this fork with nothing behind him: pressing him earns patience and backing off
// earns karma, and that was all. The game already remembers which one you did, in
// global.flags.fdwrgkind, and it has never once used it.
//
// So this is what that flag was for. Once Yamato has named Dein, the man comes to
// the player rather than the other way round — and only if the player was the one
// who let him alone. Being decent to someone who could do nothing for you is the
// entry condition, which is the only kind of reward a flag like that should buy.
quest.nrvs1 = new Quest();
quest.nrvs1.id = 9;
quest.nrvs1.name = i18n.t("content.quest.nrvs1.name");
quest.nrvs1.rar = 2;
quest.nrvs1.loc = i18n.t(
  "runtime.world.locations.dialogue.marketplace_stalls_e2ed2335",
);
quest.nrvs1.desc = i18n.t("content.quest.nrvs1.desc");
quest.nrvs1.hint = i18n.t("content.quest.nrvs1.hint");
quest.nrvs1.data = { t: 0, heard: false };
quest.nrvs1.rwd = function () {
  this.data.t++;
  you.karma++;
  giveWealth(180);
  giveExp(11000, true, true, true);
};
quest.nrvs1.goals = function () {
  return [
    i18n.t("content.quest.nrvs1.goal", {
      color: quest.nrvs1.data.heard ? "lime" : "yellow",
      state: i18n.t(
        quest.nrvs1.data.heard
          ? "content.quest.nrvs1.stateDone"
          : "content.quest.nrvs1.stateInProgress",
      ),
    }),
  ];
};
quest.nrvs1.goalsf = function () {
  return [
    i18n.t("content.quest.nrvs1.goal", {
      color: "lime",
      state: i18n.t("content.quest.nrvs1.stateDone"),
    }),
  ];
};

// The boy at the market, whose report is the third of Chapter III's signs. He is
// not asking for the chisels back — they are not in the cellar and the player will
// find out where they went much later, in the catacombs. He is asking to be
// believed, which is why the goal is to look rather than to retrieve.
quest.chsls1 = new Quest();
quest.chsls1.id = 10;
quest.chsls1.name = i18n.t("content.quest.chsls1.name");
quest.chsls1.rar = 1;
quest.chsls1.loc = i18n.t(
  "runtime.world.locations.dialogue.village_center_marketplace_a6fb36a7",
);
quest.chsls1.desc = i18n.t("content.quest.chsls1.desc");
quest.chsls1.hint = i18n.t("content.quest.chsls1.hint");
quest.chsls1.data = { t: 0, cleared: false, wall: false };
quest.chsls1.rwd = function () {
  this.data.t++;
  // He is paid what a joiner pays for a morning's work, not what a set of nine
  // chisels is worth. The reward the quest is actually about is the last line of
  // what he says.
  you.karma++;
  giveWealth(140);
  giveExp(9000, true, true, true);
};
quest.chsls1.goals = function () {
  return [
    i18n.t("content.quest.chsls1.goalCellar", {
      color: quest.chsls1.data.cleared ? "lime" : "yellow",
      state: i18n.t(
        quest.chsls1.data.cleared
          ? "content.quest.chsls1.stateCellarDone"
          : "content.quest.chsls1.stateCellarInProgress",
      ),
    }),
    i18n.t("content.quest.chsls1.goalWall", {
      color: quest.chsls1.data.wall ? "lime" : "yellow",
      state: i18n.t(
        quest.chsls1.data.wall
          ? "content.quest.chsls1.stateWallDone"
          : "content.quest.chsls1.stateWallInProgress",
      ),
    }),
  ];
};
quest.chsls1.goalsf = function () {
  return [
    i18n.t("content.quest.chsls1.goalCellar", {
      color: "lime",
      state: i18n.t("content.quest.chsls1.stateCellarDone"),
    }),
    i18n.t("content.quest.chsls1.goalWall", {
      color: "lime",
      state: i18n.t("content.quest.chsls1.stateWallDone"),
    }),
  ];
};

// The miller's work, and the close of the north. He has been paying nine a day for
// three weeks with nobody taking it, and the reason is standing in his far field. This
// is what makes the region an arc rather than two hunting grounds: it opens on a clue,
// it is finished by clearing the thing that stopped the harvest, and it says plainly
// that the harvest came in.
quest.hrvst1 = new Quest();
quest.hrvst1.id = 11;
quest.hrvst1.name = i18n.t("content.quest.hrvst1.name");
quest.hrvst1.rar = 2;
quest.hrvst1.loc = i18n.t("runtime.world.locations.dialogue.north_fields_mill");
quest.hrvst1.desc = i18n.t("content.quest.hrvst1.desc");
quest.hrvst1.hint = i18n.t("content.quest.hrvst1.hint");
quest.hrvst1.data = { t: 0, cleared: 0, needed: 12 };
quest.hrvst1.init = function () {
  this.callback();
};
// Rebuilt on load the way the other counting quests are: load() drops every hook marked
// with `q` and then calls each started quest's callback again.
quest.hrvst1.callback = function () {
  if (!quest.hrvst1.data.done)
    attachCallback(callback.onDeath, {
      f(victim) {
        if (victim.id !== creature.kksh.id) return;
        if (quest.hrvst1.data.cleared >= quest.hrvst1.data.needed) return;
        if (++quest.hrvst1.data.cleared === quest.hrvst1.data.needed)
          msg(i18n.t("runtime.data.quests.dialogue.field_is_clear"), "lime");
      },
      id: 1008,
      data: { q: true },
    });
};
quest.hrvst1.rwd = function () {
  this.data.t++;
  you.karma++;
  giveWealth(320);
  giveExp(14000, true, true, true);
  // The way on to the hills, and from there the mine. The north is what opens it.
  global.flags.hillsroad = true;
  detachCallback(callback.onDeath, 1008);
};
quest.hrvst1.goals = function () {
  const done = quest.hrvst1.data.cleared >= quest.hrvst1.data.needed;
  return [
    i18n.t("content.quest.hrvst1.goal", {
      color: done ? "lime" : "yellow",
      count: quest.hrvst1.data.cleared,
      needed: quest.hrvst1.data.needed,
    }),
  ];
};
quest.hrvst1.goalsf = function () {
  return [
    i18n.t("content.quest.hrvst1.goal", {
      color: "lime",
      count: quest.hrvst1.data.needed,
      needed: quest.hrvst1.data.needed,
    }),
  ];
};

////////////////////////////////////////////

function giveQst(q) {
  if (!q.data.started) {
    q.init();
    q.data.started = true;
    msg(
      i18n.t(
        q.repeatable
          ? "runtime.data.quests.dialogue.repeatable_quest_accepted"
          : "runtime.data.quests.dialogue.quest_accepted",
        { quest: q.name },
      ),
      "lightblue",
      q,
      8,
    );
    let have = false;
    for (const a in qsts)
      if (qsts[a].id === q.id) {
        have = true;
        break;
      }
    if (!have) qsts.push(q);
  }
}

function finishQst(q) {
  if (q.data.started) {
    q.data.done = true;
    q.data.started = false;
    q.data.pending = false;
    msg(
      i18n.t("runtime.data.quests.dialogue.quest_completed_36971938"),
      "lime",
    );
    msg_add('"' + q.name + '"', "orange");
    q.rwd();
    global.stat.qstc++;
    callback.onQuestComplete.fire(q);
  }
}

global.text.alcohol_d = i18n.get("gameText.alcohol_d");
