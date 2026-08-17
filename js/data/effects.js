// Status effect definitions and their per-tick handlers: poison, bleeding,
// corruption, food poisoning, and the temporary buffs applied by items, food,
// and weather. Loaded before creatures and equipment so both can reference
// `effect.*` entries directly.

// Resistance skills scale linearly with level, so an unclamped `1 - use()`
// crosses zero once the skill passes its break-even level and turns damage
// negative, which heals the target instead of hurting it. Food-poison
// resistance reaches that point at level 20 and corruption resistance at level
// 20, so every resistance multiplier is clamped to the 0-1 range here.
function resistanceFactor(reduction) {
  return Math.min(1, Math.max(0, 1 - reduction));
}

function Effect() {
  this.name = "dummy";
  this.desc = "";
  this.type = 0; // 1 - on attack; 2 - on stat refersh; 3 - on tick; 4 - decor? 5 - stat mod? 6 - tickstat
  this.x;
  this.c;
  this.b;
  this.y;
  this.z;
  this.target;
  this.duration;
  this.timer_o;
  this.active = false;
  this.use = function (y, z) {};
  this.un = function (x, y, z) {};
  this.mods = function () {};
  this.onGive = function () {};
  this.onRemove = function (x) {};
  this.onClick = function () {};
}

effect.test1 = new Effect();
effect.test1.name = i18n.t("content.effect.test1.name");
effect.test1.desc = i18n.t("content.effect.test1.desc");
effect.test1.type = 1;
effect.test1.use = function () {
  if (global.current_m.type === 1) {
    you.str = Math.round(you.str * 1.3);
  }
};

effect.bk1 = new Effect();
effect.bk1.type = 1;
effect.bk1.use = function () {
  if (global.current_m.type === 1) {
    you.dmlt += 0.2;
  }
};

effect.strawp = new Effect();
effect.strawp.type = 2;
effect.strawp.use = function () {
  you.satmax += 50;
  you.sat += 50;
};
effect.strawp.un = function () {
  you.sat -= 50;
};
effect.strawp.noGive = function () {
  msg(
    i18n.t(
      "runtime.data.effects.dialogue.you_feel_ready_for_the_future_d0497623",
    ),
    "ornage",
  );
};

effect.psn = new Effect();
effect.psn.id = 1;
effect.psn.name = i18n.t("content.effect.psn.name");
effect.psn.desc = i18n.t("content.effect.psn.desc");
effect.psn.type = 3;
effect.psn.atype = 1;
effect.psn.duration = 5;
effect.psn.x = "毒";
effect.psn.c = "red";
effect.psn.b = "darkmagenta";
effect.psn.onGive = function (x, y) {
  if (!this.active) {
    if (this.target.id === you.id)
      msg(
        i18n.t("runtime.data.effects.dialogue.you_have_been_poisoned_d4b8ac62"),
        "darkmagenta",
      );
  } else {
    this.y = Math.ceil((this.y + y) / 2);
    this.duration += (x * 0.7) << 0;
  }
};

effect.psn.use = function (y, z) {
  this.duration--;
  var dmg = y || 1;
  this.power = y;
  if (this.target.id === you.id) {
    if (effect.psnwrd.active === false) {
      giveSkExp(skl.poisr, this.power * 0.1);
      dmg *= Math.ceil(resistanceFactor(skl.poisr.use()));
      giveSkExp(skl.painr, this.power * 0.05);
      global.stat.dmgrt += dmg;
      if (you.hp - dmg > 0) you.hp -= dmg;
      else {
        you.hp = 0;
        removeEff(this);
        this.duration = 5;
        you.onDeath();
        global.atkdfty = [2, 1];
      }
      dom.d5_1_1.update();
    }
  } else {
    if (this.target.hp - dmg > 0) this.target.hp -= dmg;
    else {
      this.target.hp = 0;
      removeEff(this, this.target);
      this.duration = 5;
      global.atkdftm = [-1, -1, 1];
      this.target.onDeath(you);
      global.stat.indkill++;
    }
    dom.d5_1_1m.update();
  }
  if (this.duration === 0) {
    removeEff(this, this.target);
    this.duration = 5;
  }
};

effect.vnm = new Effect();
effect.vnm.id = 2;
effect.vnm.name = i18n.t("content.effect.vnm.name");
effect.vnm.desc = i18n.t("content.effect.vnm.desc");
effect.vnm.type = 3;
effect.vnm.atype = 1;
effect.vnm.duration = 15;
effect.vnm.x = "毒";
effect.vnm.c = "blue";
effect.vnm.b = "red";
effect.vnm.onGive = function (x, y) {
  if (!this.active) {
    if (this.target.id === you.id)
      msg(
        i18n.t(
          "runtime.data.effects.dialogue.you_have_been_badly_poisoned_3e6191d1",
        ),
        "darkmagenta",
      );
  } else {
    this.y = Math.ceil((this.y + y) / 1.5);
    this.duration += (x * 0.5) << 0;
  }
};

effect.vnm.use = function (y, z) {
  this.duration--;
  var dmg = y;
  this.power = y;
  if (this.target.id === you.id) {
    if (effect.psnwrd2.active === false) {
      giveSkExp(skl.poisr, this.power * 0.1);
      dmg *= Math.ceil(resistanceFactor(skl.poisr.use() * 0.3));
      giveSkExp(skl.painr, this.power * 0.2);
      global.stat.dmgrt += dmg;
      if (you.hp - dmg > 0) you.hp -= dmg;
      else {
        you.hp = 0;
        removeEff(this);
        this.duration = 5;
        you.onDeath();
        global.atkdfty = [2, 2];
      }
      dom.d5_1_1.update();
    }
  } else {
    if (this.target.hp - dmg > 0) this.target.hp -= dmg;
    else {
      this.target.hp = 0;
      removeEff(this, this.target);
      this.duration = 5;
      global.atkdftm = [-1, -1, 1];
      this.target.onDeath(you);
      global.stat.indkill++;
    }
    dom.d5_1_1m.update();
  }
  if (this.duration === 0) {
    removeEff(this, this.target);
    this.duration = 5;
  }
};

effect.psnwrd = new Effect();
effect.psnwrd.id = 3;
effect.psnwrd.name = i18n.t("content.effect.psnwrd.name");
effect.psnwrd.desc = i18n.t("content.effect.psnwrd.desc");
effect.psnwrd.type = 3;
effect.psnwrd.duration = 600;
effect.psnwrd.x = "＋";
effect.psnwrd.c = "lime";
effect.psnwrd.b = "darkmagenta";
effect.psnwrd.onGive = function () {
  msg(i18n.t("runtime.data.effects.dialogue.you_feel_safer_cf35e360"), "lime");
};
effect.psnwrd.use = function () {
  if (--this.duration === 0) {
    removeEff(this);
    this.duration = 600;
  }
};

effect.psnwrd2 = new Effect();
effect.psnwrd2.id = 4;
effect.psnwrd2.name = i18n.t("content.effect.psnwrd2.name");
effect.psnwrd2.desc = i18n.t("content.effect.psnwrd2.desc");
effect.psnwrd2.type = 3;
effect.psnwrd2.duration = 600;
effect.psnwrd2.x = "＋";
effect.psnwrd2.c = "lime";
effect.psnwrd2.b = "magenta";
effect.psnwrd2.onGive = function () {
  msg(
    i18n.t("runtime.data.effects.dialogue.you_feel_much_safer_881c6b9f"),
    "lime",
  );
};
effect.psnwrd2.use = function () {
  if (--this.duration === 0) {
    removeEff(this);
    this.duration = 600;
  }
};

effect.imm = new Effect();
effect.imm.id = 5;
effect.imm.name = i18n.t("content.effect.imm.name");
effect.imm.desc = i18n.t("content.effect.imm.desc");
effect.imm.type = 2;
effect.imm.duration = 0;
effect.imm.x = "￥";
effect.imm.c = "gold";
effect.imm.b = "navy";
effect.imm.use = function () {};

effect.snch = new Effect();
effect.snch.id = 6;
effect.snch.name = i18n.t("content.effect.snch.name");
effect.snch.desc = i18n.t("content.effect.snch.desc");
effect.snch.type = 2;
effect.snch.eq = true;
effect.snch.duration = -1;
effect.snch.x = "☼";
effect.snch.c = "gold";
effect.snch.b = "blue";
effect.snch.onGive = function () {
  if (global.flags.loadstate) {
    you.str += 5;
    you.sat += 100;
    you.spd += 1;
    you.hpmax += 100;
    you.satmax += 100;
    you.int += 5;
    you.str_d += 5;
    you.agl_d += 5;
    you.agl += 5;
    you.int_d += 5;
    global.flags.snch = true;
  }
};
effect.snch.use = function () {
  if (global.flags.isday === true) {
    if (!global.flags.snch) {
      you.str += 5;
      you.sat += 100;
      you.spd += 1;
      you.hpmax += 100;
      you.satmax += 100;
      you.int += 5;
      you.str_d += 5;
      you.agl_d += 5;
      you.agl += 5;
      you.int_d += 5;
      global.flags.snch = true;
    }
  }
  timers.snch = setInterval(function () {
    if (global.flags.isday === true) {
      if (!global.flags.snch) {
        you.str += 5;
        you.sat += 100;
        you.spd += 1;
        you.hpmax += 100;
        you.satmax += 100;
        you.int += 5;
        you.str_d += 5;
        you.agl_d += 5;
        you.agl += 5;
        you.int_d += 5;
        global.flags.snch = true;
        update_d();
      }
    } else {
      if (global.flags.snch === true) {
        effect.snch.un();
        you.stat_r();
        update_d();
      }
    }
  }, 1000);
};
effect.snch.un = function () {
  clearInterval(timers.snch);
  if (global.flags.snch === true) {
    you.sat -= 100;
    global.flags.snch = false;
  }
};

effect.mnch = new Effect();
effect.mnch.id = 7;
effect.mnch.name = i18n.t("content.effect.mnch.name");
effect.mnch.desc = i18n.t("content.effect.mnch.desc");
effect.mnch.type = 2;
effect.mnch.eq = true;
effect.mnch.duration = -1;
effect.mnch.x = "☽";
effect.mnch.c = "gold";
effect.mnch.b = "purple";
effect.mnch.onGive = function () {
  if (global.flags.loadstate) {
    you.str += 5;
    you.sat += 100;
    you.spd += 1;
    you.hpmax += 100;
    you.satmax += 100;
    you.int += 5;
    you.str_d += 5;
    you.agl_d += 5;
    you.agl += 5;
    you.int_d += 5;
    global.flags.mnch = true;
  }
};
effect.mnch.use = function () {
  if (global.flags.isday === false) {
    if (!global.flags.mnch) {
      you.str += 5;
      you.sat += 100;
      you.spd += 1;
      you.hpmax += 100;
      you.satmax += 100;
      you.int += 5;
      you.str_d += 5;
      you.agl_d += 5;
      you.agl += 5;
      you.int_d += 5;
      global.flags.mnch = true;
    }
  }
  timers.mnch = setInterval(function () {
    if (global.flags.isday === false) {
      if (!global.flags.mnch) {
        you.str += 5;
        you.sat += 100;
        you.spd += 1;
        you.hpmax += 100;
        you.satmax += 100;
        you.int += 5;
        you.str_d += 5;
        you.agl_d += 5;
        you.agl += 5;
        you.int_d += 5;
        global.flags.mnch = true;
        update_d();
      }
    } else {
      if (global.flags.mnch === true) {
        effect.mnch.un();
        you.stat_r();
        update_d();
      }
    }
  }, 1000);
};
effect.mnch.un = function () {
  clearInterval(timers.mnch);
  if (global.flags.mnch === true) {
    you.sat -= 100;
    global.flags.mnch = false;
  }
};

effect.fpn = new Effect();
effect.fpn.id = 8;
effect.fpn.name = i18n.t("content.effect.fpn.name");
effect.fpn.desc = i18n.t("content.effect.fpn.desc");
effect.fpn.type = 3;
effect.fpn.duration = 30;
effect.fpn.x = "«";
effect.fpn.c = "lime";
effect.fpn.b = "grey";
effect.fpn.onGive = function () {
  msg(
    select(i18n.get("runtime.data.effects.dialogue.food_poison_reactions")),
    "green",
  );
};
effect.fpn.use = function (y, z) {
  if (you.sat > 0) giveSkExp(skl.fdpnr, 1);
  giveSkExp(skl.painr, 1);
  this.duration--;
  const dmg = randf(1, 3) * resistanceFactor(skl.fdpnr.use());
  if (you.sat > 0) you.sat - dmg >= 0 ? (you.sat -= dmg) : (you.sat = 0);
  dom.d5_1_1.update();
  if (this.duration === 0) {
    removeEff(this);
    this.duration = 30;
  }
};

effect.wet = new Effect();
effect.wet.id = 9;
effect.wet.name = i18n.t("content.effect.wet.name");
effect.wet.desc = i18n.t("content.effect.wet.desc");
effect.wet.type = 3;
effect.wet.duration = 5;
effect.wet.x = "雨";
effect.wet.c = "cyan";
effect.wet.b = "blue";
effect.wet.onGive = function () {
  if (this.target.id === you.id) {
    msg(
      i18n.t("runtime.data.effects.dialogue.your_clothes_get_soaked_2088c971"),
      "cyan",
      null,
      null,
      "blue",
    );
    global.flags.iswet = true;
  }
};
effect.wet.onRemove = function () {
  msg(i18n.t("runtime.data.effects.dialogue.you_dry_up_c0ca7368"), "orange");
  global.flags.iswet = false;
};
effect.wet.use = function () {
  if (
    global.flags.inside === false &&
    global.flags.israin === true &&
    !you.mods.rnprtk
  )
    this.duration += 6;
  if (this.target.id === you.id) {
    if (you.sat > 0) giveSkExp(skl.abw, 0.05);
    effect.fplc.active === true ? (this.duration -= 15) : this.duration--;
  } else this.duration--;
  if (this.duration > 600) this.duration = 600;
  if (this.duration <= 0) {
    removeEff(this, this.target);
    this.duration = 5;
  }
};

effect.fplc = new Effect();
effect.fplc.id = 10;
effect.fplc.save = false;
effect.fplc.name = i18n.t("content.effect.fplc.name");
effect.fplc.desc = i18n.t("content.effect.fplc.desc");
effect.fplc.type = 3;
effect.fplc.duration = 2;
effect.fplc.x = "火";
effect.fplc.c = "yellow";
effect.fplc.b = "crimson";
effect.fplc.use = function () {
  var fire = findbyid(furn, furniture.frplc.id);
  this.duration = fire.data.fuel;
  giveSkExp(skl.abf, 0.2);
  if (this.duration === 0) {
    removeEff(this);
    this.duration = 2;
    rsort(global.rm);
  }
};
// There were two `onGive` assignments here. The first printed "you feel the warmth
// of the fireplace" and the second, fifteen lines below it, replaced the whole
// function -- so the message had never once been shown and the key sat unused in
// both locale files. They are one handler now.
effect.fplc.onGive = function () {
  msg(
    i18n.t(
      "runtime.data.effects.dialogue.you_feel_the_warmth_of_the_fireplace_a514ffb8",
    ),
    "orange",
  );
  you.mods.ckfre += 1;
};
effect.fplc.onRemove = function () {
  you.mods.ckfre -= 1;
};

effect.cdlt = new Effect();
effect.cdlt.id = 11;
effect.cdlt.name = i18n.t("content.effect.cdlt.name");
effect.cdlt.desc = i18n.t("content.effect.cdlt.desc");
effect.cdlt.type = 3;
effect.cdlt.duration = 360;
effect.cdlt.x = "❛";
effect.cdlt.c = "gold";
effect.cdlt.b = "#440205";
effect.cdlt.use = function () {
  if (--this.duration === 0) {
    removeEff(this);
    this.duration = 360;
  }
};
effect.cdlt.onGive = function () {
  you.mods.light += 1;
};
effect.cdlt.onRemove = function () {
  you.mods.light -= 1;
};

effect.tst2 = new Effect();
effect.tst2.id = 12;
effect.tst2.name = i18n.t("content.effect.tst2.name");
effect.tst2.desc = i18n.t("content.effect.tst2.desc");
effect.tst2.type = 2;
effect.tst2.duration = 0;
effect.tst2.x = "X";
effect.tst2.c = "RED";
effect.tst2.b = "WHITE";
effect.tst2.use = function () {
  you.str *= 0.5;
  you.str_d *= 0.5;
};

effect.slep = new Effect();
effect.slep.id = 13;
effect.slep.name = i18n.t("content.effect.slep.name");
effect.slep.desc = i18n.t("content.effect.slep.desc");
effect.slep.type = 4;
effect.slep.duration = -1;
effect.slep.x = "z";
effect.slep.c = "white";
effect.slep.b = "dimgray";
effect.slep.use = function () {};

effect.bled = new Effect();
effect.bled.id = 14;
effect.bled.name = i18n.t("content.effect.bled.name");
effect.bled.desc = i18n.t("content.effect.bled.desc");
effect.bled.type = 3;
effect.bled.atype = 1;
effect.bled.duration = 5;
effect.bled.x = "血";
effect.bled.c = "red";
effect.bled.b = "darkred";
effect.bled.onGive = function (x, y) {
  if (!this.active) {
    if (this.target.id === you.id)
      msg(
        i18n.t("runtime.data.effects.dialogue.you_re_losing_blood_6ed3825e"),
        "red",
      );
  } else {
    this.y = Math.ceil(this.y + y * 0.2 + 1);
    this.duration += (x * 0.9) << 0;
  }
};
effect.bled.use = function (y, z) {
  this.duration--;
  this.power = y;
  let dmg = this.power;
  dmg = Math.ceil(rand(dmg * 0.6, dmg * 1.4));
  if (this.target.id === you.id) {
    giveSkExp(skl.bledr, this.power * 0.1);
    dmg *= Math.ceil(resistanceFactor(skl.bledr.use()));
    global.stat.dmgrt += dmg;
    if (you.hp - dmg > 0) you.hp -= dmg;
    else {
      you.hp = 0;
      removeEff(this);
      this.duration = 5;
      you.onDeath();
      global.atkdfty = [2, 3];
    }
    dom.d5_1_1.update();
  } else {
    if (this.target.hp - dmg > 0) this.target.hp -= dmg;
    else {
      this.target.hp = 0;
      removeEff(this, this.target);
      this.duration = 5;
      this.target.onDeath(you);
      global.stat.indkill++;
    }
  }
  if (this.duration === 0) {
    removeEff(this, this.target);
    this.duration = 5;
  }
};
effect.bled.onClick = function () {
  return;
  let it;
  if (item.bdgh.have) item.bdgh.use();
};

effect.tarnish = new Effect();
effect.tarnish.id = 15;
effect.tarnish.name = i18n.t("content.effect.tarnish.name");
effect.tarnish.desc = i18n.t("content.effect.tarnish.desc");
effect.tarnish.type = 4;
effect.tarnish.duration = -1;
effect.tarnish.x = "≠";
effect.tarnish.c = "purple";
effect.tarnish.b = "grey";
effect.tarnish.onGive = function () {
  msg(
    i18n.t("runtime.data.effects.dialogue.your_equipment_cracks_18f328b3"),
    "purple",
  );
};
effect.tarnish.use = function (y, z) {};

effect.prostasia = new Effect();
effect.prostasia.id = 16;
effect.prostasia.name = i18n.t("content.effect.prostasia.name");
effect.prostasia.desc = i18n.t("content.effect.prostasia.desc");
effect.prostasia.type = 4;
effect.prostasia.duration = -1;
effect.prostasia.x = "≒";
effect.prostasia.c = "midnightblue";
effect.prostasia.b = "skyblue";
effect.prostasia.onGive = function () {
  msg(
    i18n.t("runtime.data.effects.dialogue.you_feel_secure_3750f780"),
    "skyblue",
  );
};
effect.prostasia.use = function (y, z) {};

effect.incsk = new Effect();
effect.incsk.id = 17;
effect.incsk.name = i18n.t("content.effect.incsk.name");
effect.incsk.desc = i18n.t("content.effect.incsk.desc");
effect.incsk.type = 3;
effect.incsk.duration = 600;
effect.incsk.x = "Í";
effect.incsk.c = "gold";
effect.incsk.b = "#440205";
effect.incsk.use = function () {
  if (--this.duration === 0) {
    removeEff(this);
    this.duration = 600;
  }
};

effect.run = new Effect();
effect.run.id = 18;
effect.run.name = i18n.t("content.effect.run.name");
effect.run.desc = i18n.t("content.effect.run.desc");
effect.run.type = 4;
effect.run.duration = -1;
effect.run.x = "走";
effect.run.c = "black";
effect.run.b = "skyblue";

effect.drunk = new Effect();
effect.drunk.id = 19;
effect.drunk.name = i18n.t("content.effect.drunk.name");
effect.drunk.desc = i18n.t("content.effect.drunk.desc");
effect.drunk.type = 5;
effect.drunk.duration = 15;
effect.drunk.x = "酒";
effect.drunk.c = "darkred";
effect.drunk.b = "orange";
effect.drunk.use = function () {
  if (--this.duration === 0) removeEff(this);
};
effect.drunk.mods = function () {
  you.agle /= 1 + (0.4 - skl.drka.lvl * 0.03);
  you.stre *= 1 + (0.2 + skl.drka.lvl * 0.02);
  you.inte /= 1 + (0.5 - skl.drka.lvl * 0.04);
};
effect.drunk.onGive = function () {
  msg(
    i18n.t("runtime.data.effects.dialogue.you_re_feeling_tipsy_3440e021"),
    "chocolate",
  );
};
effect.drunk.onRemove = function () {
  msg(i18n.t("runtime.data.effects.dialogue.you_sober_up_193d9180"), "orange");
};

effect.virus = new Effect();
effect.virus.id = 20;
effect.virus.name = i18n.t("content.effect.virus.name");
effect.virus.desc = i18n.t("content.effect.virus.desc");
effect.virus.type = 5;
effect.virus.duration = -1;
effect.virus.x = "⁑";
effect.virus.c = "black";
effect.virus.b = "lightgrey";
effect.virus.use = function () {};
effect.virus.mods = function () {
  you.agle /= 1.1;
  you.stre /= 1.1;
  you.sat -= 70;
  you.sata -= 70;
};
effect.virus.onGive = function () {
  msg(i18n.t("runtime.data.effects.dialogue.you_feel_bad_eee8ec96"), "grey");
};
effect.virus.onRemove = function () {
  msg(
    i18n.t("runtime.data.effects.dialogue.you_feel_better_922794ba"),
    "orange",
  );
};

effect.scout = new Effect();
effect.scout.id = 21;
effect.scout.name = i18n.t("content.effect.scout.name");
effect.scout.desc = i18n.t("content.effect.scout.desc");
effect.scout.type = 4;
effect.scout.duration = -1;
effect.scout.x = "ǔ";
effect.scout.c = "aquamarine";
effect.scout.b = "teal";

effect.invgrt = new Effect();
effect.invgrt.id = 22;
effect.invgrt.name = i18n.t("content.effect.invgrt.name");
effect.invgrt.desc = i18n.t("content.effect.invgrt.desc");
effect.invgrt.type = 3;
effect.invgrt.duration = -1;
effect.invgrt.x = "ℐ";
effect.invgrt.c = "yellowgreen";
effect.invgrt.b = "darkgreen";
effect.invgrt.onGive = function () {
  if (!this.active) {
    msg(
      this.target.id === you.id
        ? i18n.t("runtime.data.effects.dialogue.player_becomes_nimble")
        : i18n.t("runtime.data.effects.dialogue.target_becomes_nimble", {
            name: this.target.name,
          }),
      "green",
    );
    this.target.aglm += 0.3;
  }
};
effect.invgrt.onRemove = function () {
  this.target.aglm -= 0.3;
};
effect.invgrt.use = function () {
  if (--this.duration === 0) {
    removeEff(this);
    this.duration = 5;
  }
};

effect.fei1 = new Effect();
effect.fei1.id = 23;
effect.fei1.name = i18n.t("content.effect.fei1.name");
effect.fei1.desc = i18n.t("content.effect.fei1.desc");
effect.fei1.type = 3;
effect.fei1.duration = 60;
effect.fei1.x = "⇔";
effect.fei1.c = "magenta";
effect.fei1.b = "#520090";
effect.fei1.onGive = function (x, y) {
  if (!this.active) {
    msg(
      i18n.t(
        "runtime.data.effects.dialogue.your_body_is_fighting_against_the_impurities_58ff2fef",
      ),
      "darkmagenta",
      null,
      null,
      "grey",
    );
    this.power = y;
  } else {
    this.power += y;
    this.duration += 30;
  }
};
effect.fei1.use = function (y) {
  this.duration--;
  giveSkExp(skl.crptr, 1);
  giveSkExp(skl.painr, this.power);
  const dmg = (this.power * 5 * resistanceFactor(skl.crptr.lvl * 0.05)) << 0;
  global.stat.dmgrt += dmg;
  if (you.hp - dmg > 0) you.hp -= dmg;
  else {
    you.hp = 0;
    removeEff(this);
    you.onDeath();
    global.atkdfty = [2, 4];
    msg(
      i18n.t(
        "runtime.data.effects.dialogue.you_fail_to_purify_the_pill_19c25e6c",
      ),
      "darkgrey",
    );
  }
  dom.d5_1_1.update();
  if (this.duration === 0) {
    removeEff(this, this.target);
    this.duration = 5;
    msg(
      i18n.t(
        "runtime.data.effects.dialogue.you_have_successfully_purified_the_pill_be7b91df",
      ),
      "lime",
    );
    giveExp(
      this.power * 5000 + (this.power > 1 ? this.power * 0.15 * 5000 : 0),
      true,
      true,
      true,
    );
  }
};

effect.cold = new Effect();
effect.cold.id = 24;
effect.cold.name = i18n.t("content.effect.cold.name");
effect.cold.desc = i18n.t("content.effect.cold.desc");
effect.cold.type = 5;
effect.cold.duration = 5;
effect.cold.x = "冷";
effect.cold.c = "#88a";
effect.cold.b = "#eef";
effect.cold.mods = function () {
  you.agle /= 1.1;
  you.stre /= 1.1;
  you.hpe /= 1.1;
  you.sate /= 1.05;
};
effect.cold.onGive = function () {
  if (this.target.id === you.id)
    msg(
      i18n.t("runtime.data.effects.dialogue.you_feel_colder_e1a2ce62"),
      "blue",
      null,
      null,
      "cyan",
    );
};
effect.cold.onRemove = function () {
  if (this.target.id === you.id)
    msg(
      i18n.t("runtime.data.effects.dialogue.you_re_warming_up_7001397a"),
      "orange",
    );
};
effect.cold.use = function () {
  if (this.target.id === you.id) {
    giveSkExp(skl.abw, 0.01);
    giveSkExp(skl.coldr, 0.01);
    effect.fplc.active === true ? (this.duration -= 15) : this.duration--;
    effect.wet.active ? (global.stat.coldnt += 6) : (global.stat.coldnt += 2);
    if (effect.fbite.active) effect.fbite.duration += 5;
    else if (global.stat.coldnt >= 460) giveEff(you, effect.fbite, 20);
    if (global.stat.coldnt > 0) global.stat.coldnt--;
  } else this.duration--;
  if (this.duration > 600) this.duration = 600;
  if (this.duration <= 0) {
    removeEff(this, this.target);
    this.duration = 5;
  }
};

effect.smoke = new Effect();
effect.smoke.id = 25;
effect.smoke.name = i18n.t("content.effect.smoke.name");
effect.smoke.desc = i18n.t("content.effect.smoke.desc");
effect.smoke.type = 3;
effect.smoke.duration = 5;
effect.smoke.x = "煙";
effect.smoke.c = "grey";
effect.smoke.b = "lightgrey";
effect.smoke.onGive = function () {
  if (this.target.id === you.id) {
    msg(
      i18n.t("runtime.data.effects.dialogue.you_breathe_heavily_8c0f968b"),
      "grey",
    );
  }
};
effect.smoke.onRemove = function () {
  msg(
    i18n.t("runtime.data.effects.dialogue.your_lungs_feel_lighter_8420cdef"),
    "orange",
  );
};
effect.smoke.use = function () {
  if (this.target.id === you.id) {
    if (random() < 0.1) {
      msg(
        select(i18n.get("runtime.data.effects.dialogue.cough_reactions")),
        "grey",
      );
      giveSkExp(skl.painr, rand(0.5, 5));
      if (you.hp > 50) you.hp -= rand(5, 35) + you.hp * rand(0.01, 0.05);
      dom.d5_1_1.update();
    }
  }
  this.duration--;
  if (this.duration <= 0) {
    removeEff(this, this.target);
    this.duration = 5;
  }
};

effect.fbite = new Effect();
effect.fbite.id = 26;
effect.fbite.name = i18n.t("content.effect.fbite.name");
effect.fbite.desc = i18n.t("content.effect.fbite.desc");
effect.fbite.type = 5;
effect.fbite.duration = 5;
effect.fbite.x = "凍";
effect.fbite.c = "red";
effect.fbite.b = "#aaf";
effect.fbite.mods = function () {
  you.agle /= 1.15;
  you.stre /= 1.2;
  you.hpe /= 1.2;
  you.sate /= 1.1;
};
effect.fbite.onGive = function () {
  if (this.target.id === you.id)
    msg(
      i18n.t("runtime.data.effects.dialogue.sharp_pain_stings_you_307985a8"),
      "red",
      null,
      null,
      "cyan",
    );
};
effect.fbite.onRemove = function () {
  if (this.target.id === you.id) {
    msg(
      i18n.t(
        "runtime.data.effects.dialogue.you_aren_t_freezing_anymore_8a412ad4",
      ),
      "orange",
    );
    global.stat.coldnt = 0;
  }
};
effect.fbite.use = function () {
  if (this.target.id === you.id) {
    giveSkExp(skl.coldr, 0.05);
    effect.fplc.active === true ? (this.duration -= 5) : this.duration--;
    if (random() < 0.3) {
      giveSkExp(skl.painr, rand(0.2, 1));
      if (you.hp > 50) you.hp -= rand(5, 20);
      dom.d5_1_1.update();
    }
  } else this.duration--;
  if (this.duration > 900) this.duration = 900;
  if (this.duration <= 0) {
    removeEff(this, this.target);
    this.duration = 5;
  }
};
