///////////////////////////////////////////
//ABL
///////////////////////////////////////////

function Ability(id) {
  this.name = "";
  this.id = id || 0;
  this.atrg = " -> ";
  this.btrg = " -> ";
  this.cls;
  this.aff;
  this.affp = 0;
  this.stt = 1;
  this.f = function (x, y) {
    return dmg_calc(x, y, this);
  };
}
abl.default = new Ability();

abl.bite = new Ability(1);
abl.bite.name = i18n.t("content.abl.bite.name");
abl.bite.atrg = ' <span style="color:hotpink">bites you</span> -> ';
abl.bite.f = function (x, y, z) {
  if (random() < 0.15) {
    const f = findbyid(y.eff, effect.bled.id);
    if (random() < y.res.bleed) {
      giveEff(y, effect.bled, 10, z || 4);
      if (f) f.duration += 6;
    }
  }
  return dmg_calc(x, y, this) * 1.15;
};

abl.rstab = new Ability(2);
abl.rstab.name = i18n.t("content.abl.rstab.name");
abl.rstab.atrg =
  ' <span style="color:magenta">stabs you with something rusty</span> -> ';
abl.rstab.cls = 1;
abl.rstab.f = function (x, y) {
  if (you.res.poison >= random()) {
    if (effect.psn.active === false) giveEff(you, effect.psn, 5, 1);
    else effect.psn.duration += 5;
  }
  return dmg_calc(x, y, this) * 1.1;
};

abl.scrtch = new Ability(3);
abl.scrtch.name = i18n.t("content.abl.scrtch.name");
abl.scrtch.atrg = ' <span style="color:hotpink">scratches you</span> -> ';
abl.scrtch.cls = 0;
abl.scrtch.f = function (x, y, z) {
  if (random() < 0.05) {
    const f = findbyid(y.eff, effect.bled.id);
    if (random() < y.res.bleed) {
      giveEff(y, effect.bled, 5, z || 3);
      if (f) f.duration += 3;
    }
  }
  return dmg_calc(x, y, this) * 1.1;
};

abl.spark = new Ability(4);
abl.spark.name = i18n.t("content.abl.spark.name");
abl.spark.atrg = ' <span style="color:yellow">electrocutes you</span> -> ';
abl.spark.btrg = ' <span style="color:yellow">electrocute the enemy</span> -> ';
abl.spark.cls = 1;
abl.spark.aff = 1;
abl.spark.stt = 2;
abl.spark.affp = 25;
abl.spark.f = function (x, y) {
  return dmg_calc(x, y, this) * 1.2;
};

abl.dstab = new Ability(5);
abl.dstab.name = i18n.t("content.abl.dstab.name");
abl.dstab.atrg = ' <span style="color:pink">doublestabs you</span> -> ';
abl.dstab.btrg =
  ' <span style="color:pink">You doublestab the enemy</span> -> ';
abl.dstab.cls = 1;
abl.dstab.f = function (x, y) {
  return dmg_calc(x, y, this) * 0.7 + dmg_calc(x, y, this) * 0.7;
};

abl.pbite = new Ability(6);
abl.pbite.name = i18n.t("content.abl.pbite.name");
abl.pbite.atrg = ' <span style="color:magenta">bites you</span> -> ';
abl.pbite.cls = 1;
abl.pbite.f = function (x, y, z) {
  if (random() < 0.25) {
    if (random() < y.res.poison) giveEff(y, effect.psn, 15, z || 3);
  }
  return dmg_calc(x, y, this) * 1.15;
};

abl.bash = new Ability(7);
abl.bash.name = i18n.t("content.abl.bash.name");
abl.bash.atrg = ' <span style="color:lightgrey">bashes you</span> -> ';
abl.bash.cls = 2;
abl.bash.f = function (x, y) {
  return dmg_calc(x, y, this) * 1.3;
};
