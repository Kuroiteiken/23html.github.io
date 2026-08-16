///////////////////////////////////////////
//EFF
///////////////////////////////////////////

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
effect.test1.name = "Beast killer";
effect.test1.desc =
  "Attacks against beast type creatures are 30% more effective";
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
  msg("You feel ready for the future", "ornage");
};

effect.psn = new Effect();
effect.psn.id = 1;
effect.psn.name = "Poison";
effect.psn.desc = "Depletes health each second";
effect.psn.type = 3;
effect.psn.atype = 1;
effect.psn.duration = 5;
effect.psn.x = "毒";
effect.psn.c = "red";
effect.psn.b = "darkmagenta";
effect.psn.onGive = function (x, y) {
  if (!this.active) {
    if (this.target.id === you.id)
      msg("You have been poisoned!", "darkmagenta");
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
      dmg *= Math.ceil(1 - skl.poisr.use());
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
effect.vnm.name = "Venom";
effect.vnm.desc = "Depletes health each second";
effect.vnm.type = 3;
effect.vnm.atype = 1;
effect.vnm.duration = 15;
effect.vnm.x = "毒";
effect.vnm.c = "blue";
effect.vnm.b = "red";
effect.vnm.onGive = function (x, y) {
  if (!this.active) {
    if (this.target.id === you.id)
      msg("You have been badly poisoned!", "darkmagenta");
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
      dmg *= Math.ceil(1 - skl.poisr.use() * 0.3);
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
effect.psnwrd.name = "Poison block";
effect.psnwrd.desc = "Weak poisons have no effect on you";
effect.psnwrd.type = 3;
effect.psnwrd.duration = 600;
effect.psnwrd.x = "＋";
effect.psnwrd.c = "lime";
effect.psnwrd.b = "darkmagenta";
effect.psnwrd.onGive = function () {
  msg("You feel safer", "lime");
};
effect.psnwrd.use = function () {
  if (--this.duration === 0) {
    removeEff(this);
    this.duration = 600;
  }
};

effect.psnwrd2 = new Effect();
effect.psnwrd2.id = 4;
effect.psnwrd2.name = "Venom block";
effect.psnwrd2.desc = "Severe poisons have no effect on you";
effect.psnwrd2.type = 3;
effect.psnwrd2.duration = 600;
effect.psnwrd2.x = "＋";
effect.psnwrd2.c = "lime";
effect.psnwrd2.b = "magenta";
effect.psnwrd2.onGive = function () {
  msg("You feel much safer", "lime");
};
effect.psnwrd2.use = function () {
  if (--this.duration === 0) {
    removeEff(this);
    this.duration = 600;
  }
};

effect.imm = new Effect();
effect.imm.id = 5;
effect.imm.name = "Immortality";
effect.imm.desc = "Eternal life";
effect.imm.type = 2;
effect.imm.duration = 0;
effect.imm.x = "￥";
effect.imm.c = "gold";
effect.imm.b = "navy";
effect.imm.use = function () {};

effect.snch = new Effect();
effect.snch.id = 6;
effect.snch.name = "Sun blessing";
effect.snch.desc = "You are blessed by Sun";
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
effect.mnch.name = "Moon blessing";
effect.mnch.desc = "You are blessed by Moon";
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
effect.fpn.name = "Food poisoning";
effect.fpn.desc = "From eating something bad";
effect.fpn.type = 3;
effect.fpn.duration = 30;
effect.fpn.x = "«";
effect.fpn.c = "lime";
effect.fpn.b = "grey";
effect.fpn.onGive = function () {
  msg(select(["You feel bad inside", "Your stomach bothers you"]), "green");
};
effect.fpn.use = function (y, z) {
  if (you.sat > 0) giveSkExp(skl.fdpnr, 1);
  giveSkExp(skl.painr, 1);
  this.duration--;
  const dmg = randf(1, 3) * (1 - skl.fdpnr.use());
  if (you.sat > 0) you.sat - dmg >= 0 ? (you.sat -= dmg) : (you.sat = 0);
  dom.d5_1_1.update();
  if (this.duration === 0) {
    removeEff(this);
    this.duration = 30;
  }
};

effect.wet = new Effect();
effect.wet.id = 9;
effect.wet.name = "Wet";
effect.wet.desc = "You're drenched in water";
effect.wet.type = 3;
effect.wet.duration = 5;
effect.wet.x = "雨";
effect.wet.c = "cyan";
effect.wet.b = "blue";
effect.wet.onGive = function () {
  if (this.target.id === you.id) {
    msg("Your clothes get soaked", "cyan", null, null, "blue");
    global.flags.iswet = true;
  }
};
effect.wet.onRemove = function () {
  msg("You dry up", "orange");
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
effect.fplc.name = "Fireplace Aura";
effect.fplc.desc = "You're feeling the warmth of the fireplace";
effect.fplc.type = 3;
effect.fplc.duration = 2;
effect.fplc.x = "火";
effect.fplc.c = "yellow";
effect.fplc.b = "crimson";
effect.fplc.onGive = function () {
  msg("You feel the warmth of the fireplace", "orange");
};
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
effect.fplc.onGive = function () {
  you.mods.ckfre += 1;
};
effect.fplc.onRemove = function () {
  you.mods.ckfre -= 1;
};

effect.cdlt = new Effect();
effect.cdlt.id = 11;
effect.cdlt.name = "Candlelight";
effect.cdlt.desc = "You're carrying a candle. The surroundings are lit up";
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
effect.tst2.name = "STR+";
effect.tst2.desc = "STR+";
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
effect.slep.name = "Sleep";
effect.slep.desc = "You are fast asleep";
effect.slep.type = 4;
effect.slep.duration = -1;
effect.slep.x = "z";
effect.slep.c = "white";
effect.slep.b = "dimgray";
effect.slep.use = function () {};

effect.bled = new Effect();
effect.bled.id = 14;
effect.bled.name = "Bleeding";
effect.bled.desc = "Depletes health each second";
effect.bled.type = 3;
effect.bled.atype = 1;
effect.bled.duration = 5;
effect.bled.x = "血";
effect.bled.c = "red";
effect.bled.b = "darkred";
effect.bled.onGive = function (x, y) {
  if (!this.active) {
    if (this.target.id === you.id) msg("You're losing blood!", "red");
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
    dmg *= Math.ceil(1 - skl.bledr.use());
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
effect.tarnish.name = "Tarnished";
effect.tarnish.desc = "Equipment usability -30%";
effect.tarnish.type = 4;
effect.tarnish.duration = -1;
effect.tarnish.x = "≠";
effect.tarnish.c = "purple";
effect.tarnish.b = "grey";
effect.tarnish.onGive = function () {
  msg("Your equipment cracks", "purple");
};
effect.tarnish.use = function (y, z) {};

effect.prostasia = new Effect();
effect.prostasia.id = 16;
effect.prostasia.name = "Prostasía";
effect.prostasia.desc = "Equipment usability +30%";
effect.prostasia.type = 4;
effect.prostasia.duration = -1;
effect.prostasia.x = "≒";
effect.prostasia.c = "midnightblue";
effect.prostasia.b = "skyblue";
effect.prostasia.onGive = function () {
  msg("You feel secure", "skyblue");
};
effect.prostasia.use = function (y, z) {};

effect.incsk = new Effect();
effect.incsk.id = 17;
effect.incsk.name = "Incense Aroma";
effect.incsk.desc = "Your senses are enhanced";
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
effect.run.name = "Running";
effect.run.desc = "You're jogging";
effect.run.type = 4;
effect.run.duration = -1;
effect.run.x = "走";
effect.run.c = "black";
effect.run.b = "skyblue";

effect.drunk = new Effect();
effect.drunk.id = 19;
effect.drunk.name = "Inebriated";
effect.drunk.desc = "You're feeling drunk from alcohol";
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
  msg("You're feeling tipsy", "chocolate");
};
effect.drunk.onRemove = function () {
  msg("You sober up", "orange");
};

effect.virus = new Effect();
effect.virus.id = 20;
effect.virus.name = "Virus";
effect.virus.desc = "You are contaminated";
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
  msg("You feel bad", "grey");
};
effect.virus.onRemove = function () {
  msg("You feel better", "orange");
};

effect.scout = new Effect();
effect.scout.id = 21;
effect.scout.name = "Investigating";
effect.scout.desc = "You're exploring your surroundings";
effect.scout.type = 4;
effect.scout.duration = -1;
effect.scout.x = "ǔ";
effect.scout.c = "aquamarine";
effect.scout.b = "teal";

effect.invgrt = new Effect();
effect.invgrt.id = 22;
effect.invgrt.name = "Invigorate";
effect.invgrt.desc = "Your joints feel flexible";
effect.invgrt.type = 3;
effect.invgrt.duration = -1;
effect.invgrt.x = "ℐ";
effect.invgrt.c = "yellowgreen";
effect.invgrt.b = "darkgreen";
effect.invgrt.onGive = function () {
  if (!this.active) {
    msg(
      this.target.id === you.id
        ? "You become nimble"
        : this.target.name + " becomes nimble",
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
effect.fei1.name = "Fei poisoning";
effect.fei1.desc = "Fei impurities attack your flesh";
effect.fei1.type = 3;
effect.fei1.duration = 60;
effect.fei1.x = "⇔";
effect.fei1.c = "magenta";
effect.fei1.b = "#520090";
effect.fei1.onGive = function (x, y) {
  if (!this.active) {
    msg(
      "Your body is fighting against the impurities",
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
  const dmg = (this.power * 5 * (1 - skl.crptr.lvl * 0.05)) << 0;
  global.stat.dmgrt += dmg;
  if (you.hp - dmg > 0) you.hp -= dmg;
  else {
    you.hp = 0;
    removeEff(this);
    you.onDeath();
    global.atkdfty = [2, 4];
    msg("You fail to purify the pill", "darkgrey");
  }
  dom.d5_1_1.update();
  if (this.duration === 0) {
    removeEff(this, this.target);
    this.duration = 5;
    msg("You have successfully purified the pill!", "lime");
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
effect.cold.name = "Cold";
effect.cold.desc = "You're freezing";
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
    msg("You feel colder", "blue", null, null, "cyan");
};
effect.cold.onRemove = function () {
  if (this.target.id === you.id) msg("You're warming up", "orange");
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
effect.smoke.name = "Smoke";
effect.smoke.desc = "Thick smoke abstructs your lungs";
effect.smoke.type = 3;
effect.smoke.duration = 5;
effect.smoke.x = "煙";
effect.smoke.c = "grey";
effect.smoke.b = "lightgrey";
effect.smoke.onGive = function () {
  if (this.target.id === you.id) {
    msg("You breathe heavily", "grey");
  }
};
effect.smoke.onRemove = function () {
  msg("Your lungs feel lighter", "orange");
};
effect.smoke.use = function () {
  if (this.target.id === you.id) {
    if (random() < 0.1) {
      msg(
        select(["*Cough..*", "*Hack..*", "*Cough-cough..*", "*Khe..*"], "grey"),
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
effect.fbite.name = "Hypothermia";
effect.fbite.desc = "Your limbs are suffering from frostbites";
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
    msg("Sharp pain stings you", "red", null, null, "cyan");
};
effect.fbite.onRemove = function () {
  if (this.target.id === you.id) {
    msg("You aren't freezing anymore", "orange");
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
