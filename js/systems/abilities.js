// Combat ability definitions. Each ability describes one attack a creature or
// the player can perform: its damage class, elemental affinity, and the phrases
// used to narrate it in the combat log. Damage itself is resolved by
// `dmg_calc` in the simulation module.

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
abl.bite.atrg = i18n.t("runtime.systems.abilities.combat.bites_player");
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
abl.rstab.atrg = i18n.t("runtime.systems.abilities.combat.rusty_stab_player");
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
abl.scrtch.atrg = i18n.t("runtime.systems.abilities.combat.scratches_player");
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
abl.spark.atrg = i18n.t("runtime.systems.abilities.combat.electrocutes_player");
abl.spark.btrg = i18n.t("runtime.systems.abilities.combat.electrocutes_enemy");
abl.spark.cls = 1;
abl.spark.aff = 1;
abl.spark.stt = 2;
abl.spark.affp = 25;
abl.spark.f = function (x, y) {
  return dmg_calc(x, y, this) * 1.2;
};

abl.dstab = new Ability(5);
abl.dstab.name = i18n.t("content.abl.dstab.name");
abl.dstab.atrg = i18n.t("runtime.systems.abilities.combat.double_stabs_player");
abl.dstab.btrg = i18n.t("runtime.systems.abilities.combat.double_stabs_enemy");
abl.dstab.cls = 1;
abl.dstab.f = function (x, y) {
  return dmg_calc(x, y, this) * 0.7 + dmg_calc(x, y, this) * 0.7;
};

abl.pbite = new Ability(6);
abl.pbite.name = i18n.t("content.abl.pbite.name");
abl.pbite.atrg = i18n.t("runtime.systems.abilities.combat.poison_bites_player");
abl.pbite.cls = 1;
abl.pbite.f = function (x, y, z) {
  if (random() < 0.25) {
    if (random() < y.res.poison) giveEff(y, effect.psn, 15, z || 3);
  }
  return dmg_calc(x, y, this) * 1.15;
};

abl.bash = new Ability(7);
abl.bash.name = i18n.t("content.abl.bash.name");
abl.bash.atrg = i18n.t("runtime.systems.abilities.combat.bashes_player");
abl.bash.cls = 2;
abl.bash.f = function (x, y) {
  return dmg_calc(x, y, this) * 1.3;
};
