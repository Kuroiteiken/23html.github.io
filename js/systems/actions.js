///////////////////////////////////////////
//ACT
///////////////////////////////////////////

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
act.demo.name = "Run";
act.demo.desc = function () {
  return (
    "Run within this area to improve your physique" +
    dom.dseparator +
    '<span style="color:pink">Exp +0.5/s</span><br><span style="color:skyblue">Trains Walking</span><br><span style="color:crimson">Energy Consumption +0.1\/s</span>'
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
    if (l !== false) msg("This isn't the best place to run around", "red");
    return false;
  }
};
act.demo.use = function () {
  giveExp(0.5, true, true);
  if (you.sat > 0) giveSkExp(skl.walk, 1.5);
  else giveSkExp(skl.walk, 0.5);
  you.eqp[6].dp = you.eqp[6].dp - 0.005 < 0 ? 0 : you.eqp[6].dp - 0.005;
};
act.demo.activate = function () {
  msg("You start running", "orange");
  this.active = true;
  you.mods.sdrate += 0.1 * you.mods.runerg;
  you.mods.stdstps += 0.5;
  clearInterval(timers.actm);
  giveEff(you, effect.run);
  timers.actm = setInterval(() => {
    this.use();
  }, 1000);
};
act.demo.deactivate = function () {
  msg("You stop", "skyblue");
  clearInterval(timers.actm);
  this.active = false;
  removeEff(effect.run);
  you.mods.sdrate -= 0.1 * you.mods.runerg;
  you.mods.stdstps -= 0.5;
};

act.scout = new Action();
act.scout.id = 2;
act.scout.name = "Investigate";
act.scout.desc = function () {
  return "Thoroughly examine current area in search for hidden passages, treasure, secrets or anything of interest";
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
    if (l !== false) msg("You're too occupied with something else", "red");
    return false;
  }
};
act.scout.activate = function () {
  msg("You begin to look around", "springgreen");
  this.active = true;
  clearInterval(timers.actm);
  giveEff(you, effect.scout);
  let t = 2;
  for (const a in global.current_l.sector) {
    const m = canScout(global.current_l.sector[a]);
    if (m === 1) t = m;
  }
  if (canScout(global.current_l) === 1 || t === 1)
    msg("You sense something", "white");
  timers.actm = setInterval(() => {
    this.use();
  }, 1000);
};

act.scout.use = function () {
  if (global.flags.isdark && !cansee()) {
    deactivateAct(this);
    msg("You can't see anything", "grey");
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
    msg("There doesn't seem to be anything of interest around..", "lightgrey");
    deactivateAct(this);
  } else if (a1 >= 2 && a2 >= 2) {
    msg("You have already explored this area", "lightgrey");
    deactivateAct(this);
  }
};
act.scout.deactivate = function () {
  msg("You stop", "skyblue");
  clearInterval(timers.actm);
  this.active = false;
  removeEff(effect.scout);
};

act.demo2 = new Action();
act.demo2.id = -3;
act.demo2.name = "Selfharm";
act.demo2.type = 2;
act.demo2.desc = function () {
  return "Injure yourself";
};
act.demo2.use = function () {
  const f = findbyid(you.eff, effect.bled.id);
  if (!f) {
    msg(
      "You " +
        select(["stab", "slash"]) +
        " your " +
        select(["hand", "chest", "leg", "palm", "arm", "foot"]),
      "red",
    );
  } else msg("You're already injured", "orange");
  giveEff(you, effect.bled, 10, 1);
};

function giveAction(a) {
  if (a.have === false) {
    if (!global.flags.actsu) {
      global.flags.actsu = true;
      dom.ct_bt3.innerHTML = "actions";
    }
    msg(
      'You learned a new action: <span style="color:tomato">"' +
        a.name +
        '"</span>',
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
