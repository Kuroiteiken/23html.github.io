// Action definitions: the ongoing activities the player can start, such as
// training, working, and resting. Only one action runs at a time, tracked by
// `global.current_a`; `cond()` decides whether it can be started, and
// `activate`/`deactivate` set it up and tear it down. Progress itself is driven
// by ontick(), which calls the active action's `use()` once per tick — an action
// must not run a timer of its own, because a background tab throttles those to
// roughly once a minute and the action would silently stop making progress while
// the rest of the world replayed the time it had missed.

function Action() {
  this.name = "dummy";
  this.desc = "dummy";
  this.id = 0;
  this.type = 1;
  this.data = {};
  this.have = false;
  this.active = false;
  this.cond = function () {
    return true;
  };
  this.use = function () {};
  this.activate = function () {};
  this.deactivate = function () {};
}
act.default = new Action();
global.current_a = act.default;

//tendon transformation scripture
//third inner cultivation
//heavenly dragon arts
//eff iron determination / golden rule / wisdom of crisis
//arhat/deep sitting arhat/raised bowl arhat/raised pagoda arhat/meditating arhat/overseas arhat/elephant riding arhat/taming tiger arhat/taming dragon arhat/

act.demo = new Action();
act.demo.id = 1;
act.demo.name = i18n.t("content.act.demo.name");
act.demo.desc = function () {
  return (
    i18n.t("content.act.demo.desc") +
    dom.dseparator +
    i18n.t("content.act.demo.bonus")
  );
};
act.demo.cond = function (l) {
  if (
    !global.flags.btl &&
    global.flags.civil &&
    !global.flags.inside &&
    !global.flags.sleepmode &&
    !global.flags.rdng &&
    !global.flags.isshop &&
    !global.flags.work
  )
    return true;
  else {
    if (l !== false)
      msg(
        i18n.t(
          "runtime.systems.actions.dialogue.this_isn_t_the_best_place_to_run_d917d32b",
        ),
        "red",
      );
    return false;
  }
};
act.demo.use = function () {
  giveExp(0.5, true, true);
  if (you.sat > 0) giveSkExp(skl.walk, 1.5);
  else giveSkExp(skl.walk, 0.5);
  you.eqp[6].dp = you.eqp[6].dp - 0.005 < 0 ? 0 : you.eqp[6].dp - 0.005;
};
// Satiation cost of running, derived on demand instead of being added to
// you.mods.sdrate on start and subtracted again on stop. A charge/refund pair
// leaks whenever the two sides disagree: earning a title that lowers
// mods.runerg mid-run refunded less than it had charged, and the difference
// stuck to the stored rate for good — including in the save, because save()
// stops the action and stores whatever the refund left behind. Deriving the
// cost makes the leak impossible rather than merely unlikely.
act.demo.drain = function () {
  return this.active ? 0.1 * you.mods.runerg : 0;
};
act.demo.activate = function () {
  // stdstps is still adjusted in a pair, so activating twice without an
  // intervening stop would stack it. The guards make the pair idempotent
  // whatever the caller does.
  if (this.active) return;
  msg(
    i18n.t("runtime.systems.actions.dialogue.you_start_running_d11dfd8c"),
    "orange",
  );
  this.active = true;
  you.mods.stdstps += 0.5;
  // Progress is driven by ontick() rather than an interval of this action's own,
  // so it keeps advancing while the tab is in the background.
  giveEff(you, effect.run);
};
act.demo.deactivate = function () {
  if (!this.active) return;
  msg(i18n.t("runtime.systems.actions.dialogue.you_stop_45fed8fc"), "skyblue");
  this.active = false;
  removeEff(effect.run);
  you.mods.stdstps -= 0.5;
};

act.scout = new Action();
act.scout.id = 2;
act.scout.name = i18n.t("content.act.scout.name");
act.scout.desc = function () {
  return i18n.t("content.act.scout.desc");
};
act.scout.cond = function (l) {
  if (global.flags.isdark && !cansee()) {
    return false;
  }
  if (
    !global.flags.btl &&
    global.flags.civil &&
    !global.flags.sleepmode &&
    !global.flags.rdng
  )
    return true;
  else {
    if (l !== false)
      msg(
        i18n.t(
          "runtime.systems.actions.dialogue.you_re_too_occupied_with_something_else_c39d0a50",
        ),
        "red",
      );
    return false;
  }
};
act.scout.activate = function () {
  msg(
    i18n.t(
      "runtime.systems.actions.dialogue.you_begin_to_look_around_d36c4e13",
    ),
    "springgreen",
  );
  this.active = true;
  giveEff(you, effect.scout);
  let t = 2;
  for (const a in global.current_l.sector) {
    const m = canScout(global.current_l.sector[a]);
    if (m === 1) t = m;
  }
  if (canScout(global.current_l) === 1 || t === 1)
    msg(
      i18n.t("runtime.systems.actions.dialogue.you_sense_something_ca7deb6c"),
      "white",
    );
};

act.scout.use = function () {
  if (global.flags.isdark && !cansee()) {
    deactivateAct(this);
    msg(
      i18n.t(
        "runtime.systems.actions.dialogue.you_can_t_see_anything_5275568b",
      ),
      "grey",
    );
    return;
  }
  const a1 = canScout(global.current_l);
  const a2c = [];
  for (const a in global.current_l.sector)
    a2c.push(canScout(global.current_l.sector[a]));
  let a2 = 3;
  for (const a in a2c)
    if (a2c[a] !== 3) {
      if (a2c[a] === 1) {
        a2 = 1;
        break;
      } else a2 = 2;
    }
  if (a1 === 1) global.current_l.onScout();
  if (a2 === 1) {
    for (const a in global.current_l.sector)
      if (canScout(global.current_l.sector[a]) === 1)
        global.current_l.sector[a].onScout();
  }
  if (a1 === 3 && a2 === 3) {
    msg(
      i18n.t(
        "runtime.systems.actions.dialogue.there_doesn_t_seem_to_be_anything_of_737e54b8",
      ),
      "lightgrey",
    );
    deactivateAct(this);
  } else if (a1 >= 2 && a2 >= 2) {
    msg(
      i18n.t(
        "runtime.systems.actions.dialogue.you_have_already_explored_this_area_b8d27079",
      ),
      "lightgrey",
    );
    deactivateAct(this);
  }
};
act.scout.deactivate = function () {
  msg(i18n.t("runtime.systems.actions.dialogue.you_stop_45fed8fc"), "skyblue");
  this.active = false;
  removeEff(effect.scout);
};

act.demo2 = new Action();
act.demo2.id = -3;
act.demo2.name = i18n.t("content.act.demo2.name");
act.demo2.type = 2;
act.demo2.desc = function () {
  return i18n.t("content.act.demo2.desc");
};
act.demo2.use = function () {
  const f = findbyid(you.eff, effect.bled.id);
  if (!f) {
    msg(
      i18n.t("runtime.systems.actions.dialogue.self_injury", {
        action: select(
          i18n.get("runtime.systems.actions.dialogue.self_injury_actions"),
        ),
        bodyPart: select(
          i18n.get("runtime.systems.actions.dialogue.self_injury_body_parts"),
        ),
      }),
      "red",
    );
  } else
    msg(
      i18n.t(
        "runtime.systems.actions.dialogue.you_re_already_injured_46390abb",
      ),
      "orange",
    );
  giveEff(you, effect.bled, 10, 1);
};

function giveAction(a) {
  if (a.have === false) {
    if (!global.flags.actsu) {
      global.flags.actsu = true;
      dom.ct_bt3.innerHTML = i18n.t("ui.navigation.actions");
    }
    msg(
      i18n.t("runtime.systems.actions.dialogue.new_action_learned", {
        action: a.name,
      }),
      "lime",
      a,
      9,
    );
    a.have = true;
    acts.push(a);
    if (acts.length >= 1 && dom.acccon) {
      empty(dom.acccon);
      for (const a in acts) renderAct(acts[a]);
    }
  }
}
