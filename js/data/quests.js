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
