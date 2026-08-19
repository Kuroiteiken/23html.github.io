// Creature definitions. Holds every enemy's stats, elemental affinities, drop
// table, and combat behaviour, plus the kill bookkeeping that feeds the
// bestiary and weapon kill counters.

function Creature() {
  this.name = i18n.t("runtime.data.creatures.interface.default_name");
  this.desc = i18n.t("runtime.data.creatures.interface.default_description");
  this.type = 3; //h,b,u,e,p,d
  this.id = 0;
  this.lvl = 1;
  this.exp = 1;
  this.stat_p = [1, 1, 1, 1]; //hp, str, agl, int
  // Its own pair, not the shared eqp.dummy. Writing `this.eqp = [eqp.dummy, eqp.dummy]`
  // handed every creature a reference to one object, so `creature.bat.eqp[0].aff = [...]`
  // did not equip the bat -- it rewrote the dummy, and the next creature to be defined
  // rewrote it again. All 39 creatures ended up sharing whichever weapon was declared last,
  // and because the player's empty equipment slots are the same dummy, an empty slot was
  // contributing that weapon's aff and cls to the player's own mitigation. A weapon must
  // raise attack and never affect damage taken; an empty slot must do nothing at all.
  this.eqp = [new Eqp(), new Eqp()];
  this.cls = [0, 0, 0];
  this.aff = [0, 0, 0, 0, 0, 0, 0]; //phy air eth fir wtr lgt drk
  this.res = {
    poison: 1,
    burn: 1,
    frost: 1,
    paralize: 1,
    blind: 1,
    sleep: 1,
    curse: 1,
    death: 1,
    bleed: 1,
    ph: 1,
    venom: 1,
    fpoison: 1,
  };
  this.atype = 0;
  this.ctype = 0;
  this.atkmode = 1;
  this.hp = this.hp_r = this.hpmax = 17;
  this.str =
    this.str_r =
    this.agl =
    this.agl_r =
    this.int =
    this.int_r =
    this.spd =
    this.spd_r =
      1;
  this.stra = this.agla = this.inta = this.spda = this.hpa = 0;
  this.strm = this.intm = this.spdm = this.aglm = this.hpm = 1;
  this.crt = 0.008;
  this.dmlt = 1;
  this.rnk = 0;
  this.pts = 1;
  this.eva = 0;
  this.data = { lstdmg: 0, oneshot: true };
  this.stat_r = function () {
    this.stre = this.inte = this.agle = this.spde = this.sate = this.hpe = 1;
    for (const idx in this.eff) this.eff[idx].mods();
    this.str = (this.str_r + this.stra) * this.strm * this.stre;
    this.str_d = this.str;
    this.int = (this.int_r + this.inta) * this.intm * this.inte;
    this.int_d = this.int;
    this.agl = (this.agl_r + this.agla) * this.aglm * this.agle;
    this.agl_d = this.agl;
    this.spd = (this.spd_r + this.spda) * this.spdm * this.spde;
    this.spd_d = this.spd;
    this.hpmax = Math.ceil((this.hp_r + this.hpa) * this.hpm * this.hpe);
    this.dmlt = 1;
    for (const idx in this.eff) {
      if (this.eff[idx].type === 2) {
        this.eff[idx].un();
        this.eff[idx].use(this.eff[idx].y, this.eff[idx].z);
      }
    }
    update_m();
    if (this.hp > this.hpmax) this.hp = this.hpmax;
  };
  this.alive = true;
  this.eff = [];
  this.drop = [];
  this.onDeath = function (killer) {
    callback.onDeath.fire(this, killer);
    this.hp = 0;
    this.alive = false;
    let tt = 0;
    for (const obj in global.bestiary) {
      if (global.bestiary[obj].id === this.id) {
        global.bestiary[obj].kills++;
        break;
      }
      if (++tt === global.bestiary.length)
        global.bestiary.push({ id: this.id, kills: 1 });
    }
    global.stat.akills++;
    global.stat.pts += this.pts;
    if (you.eqp[0].id !== 10000)
      you.eqp[0].data.kills
        ? you.eqp[0].data.kills++
        : (you.eqp[0].data.kills = 1);
    if (this.type !== 2 && this.type !== 4) global.spirits++;
    else if (this.type === 4) global.spirits--;
    if (global.flags.m_blh === false)
      msg(
        i18n.t("runtime.data.creatures.dialogue.died", { name: this.name }),
        "burlywood",
      );
    global.flags.civil = true;
    global.flags.btl = false;
    let df = 1;
    const ld = this.lvl - you.lvl;
    if (ld < 0)
      df = Math.sqrt(Math.abs(ld)) + Math.abs(ld) * 0.1 * Math.abs(ld);
    giveExp(this.exp + (((this.exp * this.lvl) / 10) << 0) / df);
    dropC(this);
    global.s_l = 0;
    if (you.mods.enmondren > 0)
      if (random() < you.mods.enmondren) {
        const aam =
          1 +
          rand(this.lvl << 0, (this.lvl / 4) << 0) **
            ((1 + this.rnk / 5) << 0) *
            you.mods.enmondrts;
        giveWealth(rand((aam * 0.5) << 0 || 1, (aam * 1.5) << 0 || 1));
      }
    if (--global.current_z.size > 0) area_init(global.current_z);
    else {
      if (global.current_z.size <= -1) area_init(global.current_z);
      else {
        msg(
          i18n.t("runtime.data.creatures.dialogue.area_cleared_3e728563"),
          "orange",
        );
        global.current_z.onEnd();
        global.flags.civil = true;
        global.flags.btl = false;
      }
    }
    if (global.flags.to_pause === true) global.flags.btl = false;
    wpndiestt(killer, this);
    if (this.blood) global.stat.bloodt += this.blood;
    for (const a in checksd) checksd[a].f(this, checksd[a].o);
    for (const x in global.achchk[1]) global.achchk[1][x](killer);
    dom.d5_1_1m.update();
    dom.d7m.update();
    kill(this);
  };
  this.onDeathE = function () {
    giveSkExp(skl.war, (this.rnk * 2 - 1) * (1 + this.lvl * 0.05) * 0.1);
  };
  this.battle_ai = function (x, y, z) {
    /*me = this.data;
    if(!me.lasthp) me.lasthp=this.hp;
    me.cdmg = me.lasthp-this.hp;
    me.avgdmg = (me.cdmg+me.lstdmg)/2;
    me.lasthp=this.hp; me.lstdmg=me.cdmg;
    if(this.hp-me.avgdmg<=0) {msg('too scary, running away'); global.flags.btlinterrupt=true;}
    */ return attack(x, y);
  };
}
creature.default = new Creature();
global.current_m = creature.default;

creature.bat = new Creature();
creature.bat.name = i18n.t("content.creature.bat.name");
creature.bat.id = 101;
creature.bat.desc = i18n.t("content.creature.bat.desc");
creature.bat.type = 1;
creature.bat.exp = 8;
creature.bat.hp_r = 39;
creature.bat.blood = 0.0852;
creature.bat.stat_p = [0.5, 1, 1.5, 0.5];
creature.bat.aff = [-5, 25, -5, -5, 10, -5, 5];
creature.bat.cls = [-4, -7, -3];
creature.bat.eqp[0].aff = [0, 12, -10, 0, 0, -5, 5];
creature.bat.eqp[0].cls = [1, 1, 0];
creature.bat.atype = 1;
creature.bat.ctype = 1;
creature.bat.str_r = 2;
creature.bat.agl_r = 10;
creature.bat.spd_r = 2;
creature.bat.drop = [
  { item: item.sbone, chance: 0.1 },
  { item: item.appl, chance: 0.06 },
];
creature.bat.rnk = 3;
creature.bat.pts = 6;

// The first tier of the catacombs. These three were declared with a rank and
// nothing else — no hp, no stats, no drops — so they could not have been put in an
// area even if one had existed. Their numbers are set against the player's actual
// progress rather than against `rnk`, which in this game is Yamato's danger
// classification and not a power curve: creature.skl is rank 7 with 132 hp while
// wolf1 is rank 4 with 400. A player arriving here has just taken down the pack
// leader, so the bats and stirges are a nuisance and the zombie is the wall.
creature.cbat = new Creature();
creature.cbat.id = 109;
creature.cbat.name = i18n.t("content.creature.cbat.name");
creature.cbat.desc = i18n.t("content.creature.cbat.desc");
creature.cbat.type = 1;
creature.cbat.exp = 30;
creature.cbat.hp_r = 180;
creature.cbat.stat_p = [0.9, 1, 1.6, 0.8];
creature.cbat.aff = [16, 30, 0, -8, 6, -40, 44];
creature.cbat.cls = [22, 20, 26];
creature.cbat.eqp[0].aff = [8, 18, 0, -8, 6, -40, 44];
creature.cbat.eqp[0].cls = [5, 6, 5];
creature.cbat.ctype = 1;
creature.cbat.str_r = 16;
creature.cbat.agl_r = 34;
creature.cbat.int_r = 4;
creature.cbat.spd_r = 6;
creature.cbat.eva = 40;
creature.cbat.drop = [{ item: item.sbone, chance: 0.05 }];
creature.cbat.rnk = 3;
creature.cbat.blood = 0.99;
creature.cbat.pts = 12;
creature.cbat.battle_ai = function (x, y, z) {
  if (random() <= 0.35) return attack(x, y, abl.bite);
  return attack(x, y);
};

creature.stirge = new Creature();
creature.stirge.id = 110;
creature.stirge.name = i18n.t("content.creature.stirge.name");
creature.stirge.desc = i18n.t("content.creature.stirge.desc");
creature.stirge.type = 1;
creature.stirge.exp = 45;
creature.stirge.hp_r = 240;
creature.stirge.stat_p = [1, 1.1, 1.45, 0.7];
creature.stirge.aff = [18, 26, 2, -10, 10, -36, 40];
creature.stirge.cls = [26, 24, 30];
creature.stirge.eqp[0].aff = [9, 16, 2, -10, 10, -36, 40];
creature.stirge.eqp[0].cls = [6, 7, 6];
creature.stirge.ctype = 1;
creature.stirge.str_r = 20;
creature.stirge.agl_r = 30;
creature.stirge.int_r = 3;
creature.stirge.spd_r = 5;
creature.stirge.eva = 35;
creature.stirge.drop = [{ item: item.sbone, chance: 0.08 }];
creature.stirge.rnk = 4;
creature.stirge.blood = 0.99;
creature.stirge.pts = 16;
// It feeds by drinking, so it leads with the bite that carries rot.
creature.stirge.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.pbite);
  else if (random() <= 0.25) return attack(x, y, abl.bite);
  return attack(x, y);
};

creature.spd1 = new Creature();
creature.spd1.name = i18n.t("content.creature.spd1.name");
creature.spd1.id = 104;
creature.spd1.desc = i18n.t("content.creature.spd1.desc");
creature.spd1.type = 1;
creature.spd1.exp = 8;
creature.spd1.hp_r = 26;
creature.spd1.stat_p = [0.6, 1.1, 1.6, 1];
creature.spd1.aff = [2, 5, 10, -35, 10, -5, 15];
creature.spd1.cls = [4, 6, -6];
creature.spd1.eqp[0].aff = [3, -5, 5, 0, 0, -5, 5];
creature.spd1.eqp[0].cls = [2, 1, 1];
creature.spd1.str_r = 3;
creature.spd1.agl_r = 8;
creature.spd1.spd_r = 2;
creature.spd1.rnk = 3;
creature.spd1.pts = 5;
creature.spd1.drop = [
  { item: item.ltcc, chance: 0.01 },
  { item: item.thrdnl, chance: 0.1 },
];
creature.spd1.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.pbite, 3);
  return attack(x, y);
};

creature.tdummy = new Creature();
creature.tdummy.id = 103;
creature.tdummy.name = i18n.t("content.creature.tdummy.name");
creature.tdummy.desc = i18n.t("content.creature.tdummy.desc");
creature.tdummy.drop = [
  {
    item: wpn.knf1,
    chance: 0.01,
    cond: () => {
      return you.lvl <= 20;
    },
  },
  {
    item: eqp.brc,
    chance: 0.03,
    cond: () => {
      return you.lvl <= 20;
    },
  },
  { item: item.hrb1, chance: 0.02 },
];
creature.tdummy.aff = [0, 0, 15, -25, -5, -666, 666];
creature.tdummy.stat_p = [0.1, 0.5, 0.4, 0.2];
creature.tdummy.ctype = 2;
creature.tdummy.int_r = 0;
creature.tdummy.rnk = 1;
creature.tdummy.battle_ai = function (x, y, z) {
  if (random() <= 0.001) return attack(x, y, abl.rstab);
  return attack(x, y);
};
creature.tdummy.onDeathE = function () {};

creature.sdummy = new Creature();
creature.sdummy.id = 102;
creature.sdummy.name = i18n.t("content.creature.sdummy.name");
creature.sdummy.desc = i18n.t("content.creature.sdummy.desc");
creature.sdummy.drop = [
  { item: item.sstraw, chance: 0.085 },
  { item: item.hrb1, chance: 0.02 },
];
creature.sdummy.aff = [0, 0, 15, -25, -5, -666, 666];
creature.sdummy.stat_p = [0.25, 0.6, 0.3, 0.2];
creature.sdummy.ctype = 2;
creature.sdummy.int_r = 0;
creature.sdummy.rnk = 1;
creature.sdummy.battle_ai = function (x, y, z) {
  if (random() <= 0.001) return attack(x, y, abl.rstab);
  return attack(x, y);
};
creature.sdummy.onDeathE = function () {};

creature.wdummy = new Creature();
creature.wdummy.id = 112;
creature.wdummy.name = i18n.t("content.creature.wdummy.name");
creature.wdummy.desc = i18n.t("content.creature.wdummy.desc");
creature.wdummy.stat_p = [0.4, 0.8, 0.12, 0.2];
creature.wdummy.aff = [0, 0, 15, -30, 20, -666, 666];
creature.wdummy.cls = [-1, 2, 4];
creature.wdummy.str_r = 3;
creature.wdummy.ctype = 2;
creature.wdummy.rnk = 1;
creature.wdummy.drop = [
  {
    item: eqp.pnt,
    chance: 0.008,
    cond: () => {
      return you.lvl <= 20;
    },
  },
  {
    item: eqp.vst,
    chance: 0.007,
    cond: () => {
      return you.lvl <= 20;
    },
  },
  {
    item: eqp.bnd,
    chance: 0.01,
    cond: () => {
      return you.lvl <= 20;
    },
  },
  { item: item.wdc, chance: 0.03 },
  {
    item: wpn.wsrd2,
    chance: 0.002,
    cond: () => {
      return you.lvl <= 20;
    },
  },
];
creature.wdummy.battle_ai = function (x, y, z) {
  if (random() <= 0.001) return attack(x, y, abl.rstab);
  return attack(x, y);
};
creature.wdummy.onDeathE = function () {};

creature.puppet = new Creature();
creature.puppet.id = 105;
creature.puppet.name = i18n.t("content.creature.puppet.name");
creature.puppet.desc = i18n.t("content.creature.puppet.desc");
creature.puppet.rnk = 5;
creature.puppet.drop = [];
creature.puppet.battle_ai = function (x, y, z) {};

creature.bpuppet = new Creature();
creature.bpuppet.id = 106;
creature.bpuppet.name = i18n.t("content.creature.bpuppet.name");
creature.bpuppet.desc = i18n.t("content.creature.bpuppet.desc");
creature.bpuppet.rnk = 7;
creature.bpuppet.drop = [];
creature.bpuppet.battle_ai = function (x, y, z) {};

creature.doll = new Creature();
creature.doll.id = 107;
creature.doll.name = i18n.t("content.creature.doll.name");
creature.doll.desc = i18n.t("content.creature.doll.desc");
creature.doll.rnk = 6;
creature.doll.drop = [];
creature.doll.battle_ai = function (x, y, z) {};

creature.ndoll = new Creature();
creature.ndoll.id = 108;
creature.ndoll.name = i18n.t("content.creature.ndoll.name");
creature.ndoll.desc = i18n.t("content.creature.ndoll.desc");
creature.ndoll.rnk = 8;
creature.ndoll.drop = [];
creature.ndoll.battle_ai = function (x, y, z) {};

creature.cdoll = new Creature();
creature.cdoll.id = 111;
creature.cdoll.name = i18n.t("content.creature.cdoll.name");
creature.cdoll.desc = i18n.t("content.creature.cdoll.desc");
creature.cdoll.rnk = 12;
creature.cdoll.drop = [];
creature.cdoll.battle_ai = function (x, y, z) {};

// The first thing down there that used to be a person. type = 2 puts it in the
// Undead category the bestiary already has and keeps it out of the spirit count
// that Creature.onDeath keeps for the living; every undead stub was left on the
// constructor default of 3, which reads as Evil. Its resistances are the point of
// the fight: rot does not bleed and cannot be poisoned or frightened to death, but
// it is slow, and it burns.
creature.zomb1 = new Creature();
creature.zomb1.id = 113;
creature.zomb1.name = i18n.t("content.creature.zomb1.name");
creature.zomb1.desc = i18n.t("content.creature.zomb1.desc");
creature.zomb1.type = 2;
creature.zomb1.exp = 90;
creature.zomb1.hp_r = 700;
creature.zomb1.stat_p = [1.6, 1.15, 0.6, 0.4];
creature.zomb1.aff = [24, -6, 8, -30, 4, -52, 62];
creature.zomb1.cls = [34, 30, 44];
creature.zomb1.eqp[0].aff = [12, -6, 8, -30, 4, -52, 62];
creature.zomb1.eqp[0].cls = [8, 8, 10];
creature.zomb1.ctype = 1;
creature.zomb1.str_r = 26;
creature.zomb1.agl_r = 8;
creature.zomb1.int_r = 2;
creature.zomb1.spd_r = 1;
creature.zomb1.eva = 5;
creature.zomb1.res.poison = 0;
creature.zomb1.res.venom = 0;
creature.zomb1.res.bleed = 0.15;
creature.zomb1.res.death = 0.25;
creature.zomb1.res.sleep = 0;
creature.zomb1.res.paralize = 0.2;
creature.zomb1.drop = [
  { item: item.sbone, chance: 0.35 },
  { item: item.cclth, chance: 0.12 },
];
creature.zomb1.rnk = 6;
creature.zomb1.blood = 0.4;
creature.zomb1.pts = 40;
creature.zomb1.battle_ai = function (x, y, z) {
  if (random() <= 0.2) return attack(x, y, abl.bash);
  return attack(x, y);
};

// Older than the order that buried it, and slow enough that the danger is
// entirely in not being able to leave.
creature.mumy = new Creature();
creature.mumy.id = 114;
creature.mumy.name = i18n.t("content.creature.mumy.name");
creature.mumy.desc = i18n.t("content.creature.mumy.desc");
creature.mumy.type = 2;
creature.mumy.exp = 620;
creature.mumy.hp_r = 2400;
creature.mumy.stat_p = [1.8, 1.2, 0.7, 1.3];
creature.mumy.aff = [26, -10, 26, -36, 4, -70, 86];
creature.mumy.cls = [40, 36, 44];
creature.mumy.eqp[0].aff = [18, -10, 26, -36, 4, -70, 86];
creature.mumy.eqp[0].cls = [11, 10, 12];
creature.mumy.ctype = 1;
creature.mumy.str_r = 44;
creature.mumy.agl_r = 14;
creature.mumy.int_r = 22;
creature.mumy.spd_r = 2;
creature.mumy.eva = 6;
creature.mumy.res.poison = 0;
creature.mumy.res.venom = 0;
creature.mumy.res.sleep = 0;
creature.mumy.res.bleed = 0.15;
creature.mumy.res.death = 0.3;
creature.mumy.res.death = 0.2;
creature.mumy.res.frost = 0.4;
creature.mumy.res.paralize = 0.15;
creature.mumy.drop = [
  { item: item.sbone, chance: 0.5 },
  { item: item.cclth, chance: 0.35 },
  { item: item.cn, chance: 0.2 },
];
creature.mumy.rnk = 13;
creature.mumy.blood = 0.2;
creature.mumy.pts = 220;
creature.mumy.battle_ai = function (x, y, z) {
  if (random() <= 0.25) return attack(x, y, abl.bash);
  return attack(x, y);
};

// Its own description already says ghouls lurk in the catacombs, so it has been
// waiting for the region to be reachable. Where the zombie is a wall, this is the
// opposite problem: fast, evasive, and it opens wounds.
creature.ghl = new Creature();
creature.ghl.id = 115;
creature.ghl.name = i18n.t("content.creature.ghl.name");
creature.ghl.desc = i18n.t("content.creature.ghl.desc");
creature.ghl.type = 2;
creature.ghl.exp = 200;
creature.ghl.hp_r = 640;
creature.ghl.stat_p = [1.3, 1.25, 1.5, 0.8];
creature.ghl.aff = [26, 8, 10, -26, 6, -58, 68];
creature.ghl.cls = [40, 36, 42];
creature.ghl.eqp[0].aff = [14, 8, 10, -26, 6, -58, 68];
creature.ghl.eqp[0].cls = [10, 10, 9];
creature.ghl.ctype = 1;
creature.ghl.str_r = 30;
creature.ghl.agl_r = 30;
creature.ghl.int_r = 6;
creature.ghl.spd_r = 4;
creature.ghl.eva = 22;
creature.ghl.res.poison = 0;
creature.ghl.res.venom = 0;
creature.ghl.res.bleed = 0.2;
creature.ghl.res.death = 0.35;
creature.ghl.res.sleep = 0;
creature.ghl.drop = [
  { item: item.sbone, chance: 0.3 },
  { item: item.cclth, chance: 0.1 },
  { item: item.cndl, chance: 0.06 },
];
creature.ghl.rnk = 10;
creature.ghl.blood = 0.5;
creature.ghl.pts = 90;
creature.ghl.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.scrtch);
  else if (random() <= 0.25) return attack(x, y, abl.pbite);
  return attack(x, y);
};

// Borrowed strength rather than its own, and it moves like something that has
// been given more than a body can carry.
creature.ght = new Creature();
creature.ght.id = 116;
creature.ght.name = i18n.t("content.creature.ght.name");
creature.ght.desc = i18n.t("content.creature.ght.desc");
creature.ght.type = 2;
creature.ght.exp = 420;
creature.ght.hp_r = 1100;
creature.ght.stat_p = [1.4, 1.2, 1.5, 1.1];
creature.ght.aff = [26, 14, 22, -24, 6, -66, 80];
creature.ght.cls = [40, 34, 42];
creature.ght.eqp[0].aff = [16, 14, 22, -24, 6, -66, 80];
creature.ght.eqp[0].cls = [10, 9, 11];
creature.ght.ctype = 1;
creature.ght.str_r = 38;
creature.ght.agl_r = 38;
creature.ght.int_r = 14;
creature.ght.spd_r = 5;
creature.ght.eva = 28;
creature.ght.res.poison = 0;
creature.ght.res.venom = 0;
creature.ght.res.sleep = 0;
creature.ght.res.bleed = 0.15;
creature.ght.res.death = 0.3;
creature.ght.res.curse = 0.4;
creature.ght.drop = [
  { item: item.sbone, chance: 0.4 },
  { item: item.cclth, chance: 0.2 },
  { item: item.cndl, chance: 0.1 },
];
creature.ght.rnk = 12;
creature.ght.blood = 0.4;
creature.ght.pts = 150;
creature.ght.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.scrtch);
  else if (random() <= 0.3) return attack(x, y, abl.pbite);
  return attack(x, y);
};

// One that still remembers how it used to fight. Slower than the ghoul and far
// harder to put down, which is what makes the two of them together a problem: you
// cannot deal with either one on its own terms.
creature.zmbf = new Creature();
creature.zmbf.id = 117;
creature.zmbf.name = i18n.t("content.creature.zmbf.name");
creature.zmbf.desc = i18n.t("content.creature.zmbf.desc");
creature.zmbf.type = 2;
creature.zmbf.exp = 160;
creature.zmbf.hp_r = 900;
creature.zmbf.stat_p = [1.5, 1.3, 0.9, 0.5];
creature.zmbf.aff = [28, -4, 8, -28, 4, -54, 64];
creature.zmbf.cls = [38, 34, 46];
creature.zmbf.eqp[0].aff = [15, -4, 8, -28, 4, -54, 64];
creature.zmbf.eqp[0].cls = [11, 10, 12];
creature.zmbf.ctype = 1;
creature.zmbf.str_r = 34;
creature.zmbf.agl_r = 16;
creature.zmbf.int_r = 3;
creature.zmbf.spd_r = 2;
creature.zmbf.eva = 10;
creature.zmbf.res.poison = 0;
creature.zmbf.res.venom = 0;
creature.zmbf.res.bleed = 0.15;
creature.zmbf.res.death = 0.3;
creature.zmbf.res.sleep = 0;
creature.zmbf.res.paralize = 0.2;
creature.zmbf.drop = [
  { item: item.sbone, chance: 0.4 },
  { item: item.cclth, chance: 0.15 },
  { item: item.cp, chance: 0.2 },
];
creature.zmbf.rnk = 9;
creature.zmbf.blood = 0.4;
creature.zmbf.pts = 70;
creature.zmbf.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.bash);
  return attack(x, y);
};

// It kept the training. That is what separates it from the rest: it does not
// simply come at you, it still knows how to open a guard.
creature.zmbk = new Creature();
creature.zmbk.id = 118;
creature.zmbk.name = i18n.t("content.creature.zmbk.name");
creature.zmbk.desc = i18n.t("content.creature.zmbk.desc");
creature.zmbk.type = 2;
creature.zmbk.exp = 460;
creature.zmbk.hp_r = 1600;
creature.zmbk.stat_p = [1.6, 1.2, 1, 0.6];
creature.zmbk.aff = [26, -6, 14, -26, 6, -58, 70];
creature.zmbk.cls = [38, 32, 40];
creature.zmbk.eqp[0].aff = [17, -6, 14, -26, 6, -58, 70];
creature.zmbk.eqp[0].cls = [11, 10, 11];
creature.zmbk.ctype = 1;
creature.zmbk.str_r = 44;
creature.zmbk.agl_r = 24;
creature.zmbk.int_r = 6;
creature.zmbk.spd_r = 3;
creature.zmbk.eva = 12;
creature.zmbk.res.poison = 0;
creature.zmbk.res.venom = 0;
creature.zmbk.res.sleep = 0;
creature.zmbk.res.bleed = 0.15;
creature.zmbk.res.death = 0.3;
creature.zmbk.res.paralize = 0.2;
creature.zmbk.res.frost = 0.5;
creature.zmbk.drop = [
  { item: item.sbone, chance: 0.45 },
  { item: item.cclth, chance: 0.25 },
  { item: item.cp, chance: 0.3 },
  { item: item.cn, chance: 0.15 },
];
creature.zmbk.rnk = 12;
creature.zmbk.blood = 0.4;
creature.zmbk.pts = 170;
creature.zmbk.battle_ai = function (x, y, z) {
  if (random() <= 0.25) return attack(x, y, abl.dstab);
  else if (random() <= 0.3) return attack(x, y, abl.bash);
  return attack(x, y);
};

// It still casts, which is the whole problem: everything else down here has
// to reach you first.
creature.zmbm = new Creature();
creature.zmbm.id = 119;
creature.zmbm.name = i18n.t("content.creature.zmbm.name");
creature.zmbm.desc = i18n.t("content.creature.zmbm.desc");
creature.zmbm.type = 2;
creature.zmbm.exp = 340;
creature.zmbm.hp_r = 700;
creature.zmbm.stat_p = [1.2, 1.1, 0.9, 2.2];
creature.zmbm.aff = [20, 10, 30, -20, 8, -62, 74];
creature.zmbm.cls = [30, 28, 30];
creature.zmbm.eqp[0].aff = [20, 10, 30, -20, 8, -62, 74];
creature.zmbm.eqp[0].cls = [7, 7, 7];
creature.zmbm.ctype = 1;
creature.zmbm.str_r = 22;
creature.zmbm.agl_r = 18;
creature.zmbm.int_r = 40;
creature.zmbm.spd_r = 3;
creature.zmbm.eva = 12;
creature.zmbm.res.poison = 0;
creature.zmbm.res.venom = 0;
creature.zmbm.res.sleep = 0;
creature.zmbm.res.bleed = 0.15;
creature.zmbm.res.death = 0.3;
creature.zmbm.res.paralize = 0.3;
creature.zmbm.drop = [
  { item: item.sbone, chance: 0.35 },
  { item: item.cclth, chance: 0.2 },
  { item: item.cndl, chance: 0.1 },
];
creature.zmbm.rnk = 11;
creature.zmbm.blood = 0.35;
creature.zmbm.pts = 120;
creature.zmbm.battle_ai = function (x, y, z) {
  if (random() <= 0.4) return attack(x, y, abl.spark);
  return attack(x, y);
};

creature.skl = new Creature();
creature.skl.name = i18n.t("content.creature.skl.name");
creature.skl.id = 120;
creature.skl.desc = i18n.t("content.creature.skl.desc");
creature.skl.type = 2;
creature.skl.exp = 15;
creature.skl.hp_r = 132;
creature.skl.stat_p = [1.3, 1.15, 1.05, 0.1];
creature.skl.aff = [12, 20, -4, -11, 31, -33, 51];
creature.skl.cls = [0, 9, -16];
creature.skl.eqp[0].aff = [8, 20, -4, -11, 31, -33, 51];
creature.skl.eqp[0].cls = [2, 5, 5];
creature.skl.ctype = 1;
creature.skl.str_r = 17;
creature.skl.agl_r = 19;
creature.skl.spd_r = 2;
creature.skl.drop = [];
creature.skl.rnk = 7;
creature.skl.pts = 17;

creature.slm1 = new Creature();
creature.slm1.name = i18n.t("content.creature.slm1.name");
creature.slm1.id = 121;
creature.slm1.desc = i18n.t("content.creature.slm1.desc");
creature.slm1.type = 1;
creature.slm1.exp = 3;
creature.slm1.hp_r = 65;
creature.slm1.stat_p = [0.7, 0.8, 1.5, 0.3];
creature.slm1.aff = [5, 5, 15, -20, -15, 25, 34];
creature.slm1.cls = [5, 5, 20];
creature.slm1.eqp[0].aff = [2, 5, 0, -2, 4, 0, 0];
creature.slm1.eqp[0].cls = [1, 1, 1];
creature.slm1.ctype = 2;
creature.slm1.str_r = 2;
creature.slm1.agl_r = 5;
creature.slm1.eva = 6;
creature.slm1.spd_r = 1;
creature.slm1.drop = [
  { item: item.watr, chance: 0.01 },
  { item: item.slm, chance: 0.03 },
  { item: item.jll, chance: 0.01 },
];
creature.slm1.rnk = 2;
creature.slm1.pts = 3;

creature.slm2 = new Creature();
creature.slm2.name = i18n.t("content.creature.slm2.name");
creature.slm2.id = 122;
creature.slm2.desc = i18n.t("content.creature.slm2.desc");
creature.slm2.type = 1;
creature.slm2.exp = 4;
creature.slm2.hp_r = 70;
creature.slm2.stat_p = [0.75, 0.85, 1.5, 0.3];
creature.slm2.aff = [5, 5, 15, -20, -15, 25, 34];
creature.slm2.cls = [4, 4, 22];
creature.slm2.eqp[0].aff = [2, 12, 5, -12, 6, 0, 0];
creature.slm2.eqp[0].cls = [2, 2, 2];
creature.slm2.ctype = 1;
creature.slm2.str_r = 3;
creature.slm2.agl_r = 5;
creature.slm2.eva = 6;
creature.slm2.spd_r = 1;
creature.slm2.drop = [
  { item: item.watr, chance: 0.01 },
  { item: item.slm, chance: 0.04 },
  { item: item.jll, chance: 0.01 },
  { item: acc.jln2, chance: 0.0005 },
];
creature.slm2.rnk = 2;
creature.slm2.pts = 3;

creature.rbt1 = new Creature();
creature.rbt1.name = i18n.t("content.creature.rbt1.name");
creature.rbt1.id = 123;
creature.rbt1.desc = i18n.t("content.creature.rbt1.desc");
creature.rbt1.type = 1;
creature.rbt1.exp = 5;
creature.rbt1.stat_p = [1, 0.9, 2, 0.3];
creature.rbt1.aff = [6, 15, 15, -10, 16, 33, 2];
creature.rbt1.cls = [4, -2, 5];
creature.rbt1.eqp[0].aff = [5, 6, 6, 0, 2, 0, 0];
creature.rbt1.eqp[0].cls = [2, 3, 1];
creature.rbt1.ctype = 1;
creature.rbt1.hp_r = 55;
creature.rbt1.blood = 0.108;
creature.rbt1.str_r = 2;
creature.rbt1.agl_r = 10;
creature.rbt1.eva = 40;
creature.rbt1.spd_r = 2;
creature.rbt1.drop = [
  { item: item.sbone, chance: 0.1 },
  { item: item.rwmt1, chance: 0.06 },
  { item: item.crrt, chance: 0.04 },
  { item: acc.rfot, chance: 0.00004 },
];
creature.rbt1.rnk = 2;
creature.rbt1.pts = 4;

creature.slm3 = new Creature();
creature.slm3.name = i18n.t("content.creature.slm3.name");
creature.slm3.id = 124;
creature.slm3.desc = i18n.t("content.creature.slm3.desc");
creature.slm3.type = 1;
creature.slm3.exp = 8;
creature.slm3.hp_r = 120;
creature.slm3.stat_p = [1.2, 1.2, 2.9, 0.8];
creature.slm3.aff = [15, 5, 15, -10, -5, 55, 34];
creature.slm3.cls = [9, 9, 24];
creature.slm3.eqp[0].aff = [4, 6, 7, -12, 6, 0, 0];
creature.slm3.eqp[0].cls = [4, 4, 4];
creature.slm3.ctype = 1;
creature.slm3.atype = 1;
creature.slm3.str_r = 5;
creature.slm3.agl_r = 8;
creature.slm3.eva = 15;
creature.slm3.spd_r = 2;
creature.slm3.drop = [
  { item: item.watr, chance: 0.03 },
  { item: item.slm, chance: 0.05 },
  { item: item.jll, chance: 0.02 },
];
creature.slm3.rnk = 3;
creature.slm3.pts = 4;

creature.slm4 = new Creature();
creature.slm4.name = i18n.t("content.creature.slm4.name");
creature.slm4.id = 125;
creature.slm4.desc = i18n.t("content.creature.slm4.desc");
creature.slm4.type = 1;
creature.slm4.exp = 10;
creature.slm4.hp_r = 95;
creature.slm4.stat_p = [1.24, 1.23, 2.97, 0.82];
creature.slm4.aff = [15, 5, 15, -10, -5, 55, 34];
creature.slm4.cls = [12, 12, 28];
creature.slm4.eqp[0].aff = [4, 9, 7, -12, 12, 0, 0];
creature.slm4.eqp[0].cls = [6, 5, 4];
creature.slm4.ctype = 2;
creature.slm4.atype = 4;
creature.slm4.str_r = 9;
creature.slm4.agl_r = 9;
creature.slm4.eva = 20;
creature.slm4.spd_r = 2;
creature.slm4.drop = [
  { item: item.watr, chance: 0.035 },
  { item: item.slm, chance: 0.02 },
  { item: item.jll, chance: 0.06 },
];
creature.slm4.rnk = 3;
creature.slm4.pts = 5;

creature.kksh = new Creature(); //u
creature.kksh.name = i18n.t("content.creature.kksh.name");
creature.kksh.id = 126;
creature.kksh.desc = i18n.t("content.creature.kksh.desc");
creature.kksh.exp = 5;
creature.kksh.hp_r = 100;
creature.kksh.stat_p = [1.1, 1.2, 2.9, 0.8];
creature.kksh.aff = [15, 5, 15, -10, -5, 55, 34];
creature.kksh.cls = [9, 9, 35];
creature.kksh.eqp[0].aff = [4, 12, 7, -12, 6, 0, 0];
creature.kksh.eqp[0].cls = [5, 5, 5];
creature.kksh.ctype = 1;
creature.kksh.atype = 1;
creature.kksh.str_r = 5;
creature.kksh.agl_r = 13;
creature.kksh.spd_r = 2;
// Water, slime and jelly: a verbatim copy of a slime's table, which is what a straw
// figure standing in a field is least likely to be carrying. `creature.lsprt` still
// carries the same three lines, which is how both of them got here.
creature.kksh.drop = [
  { item: item.sstraw, chance: 0.85, min: 4, max: 11 },
  { item: item.cclth, chance: 0.3, min: 1, max: 3 },
  { item: item.wdc, chance: 0.25, min: 1, max: 4 },
  { item: item.agrns, chance: 0.1, min: 1, max: 3 },
];
// Set explicitly rather than left to the constructor. The source line is commented //u
// for Undead, but the description says a field guardian turned by the influence of Dark
// and the thing was never alive, so Evil is what it is -- which is also the default it
// was silently running on.
creature.kksh.type = 3;
creature.kksh.pts = 14;
creature.kksh.rnk = 10;

creature.golem1 = new Creature();
creature.golem1.name = i18n.t("content.creature.golem1.name");
creature.golem1.id = 127;
creature.golem1.desc = i18n.t("content.creature.golem1.desc");
creature.golem1.exp = 50;
creature.golem1.hp_r = 500;
creature.golem1.stat_p = [0.05, 0.2, 0.2, 0.2];
creature.golem1.aff = [10, 8, 5, -60, -5, 15, 14];
creature.golem1.cls = [10, 15, 10];
creature.golem1.eqp[0].aff = [9, 5, 25, 6, 6, 2, 13];
creature.golem1.eqp[0].cls = [2, 2, 10];
creature.golem1.ctype = 2;
creature.golem1.str_r = 15;
creature.golem1.agl_r = 30;
creature.golem1.spd_r = 3;
creature.golem1.drop = [
  { item: item.sstraw, chance: 1, min: 13, max: 25 },
  { item: item.lsrd, chance: 1 },
];
creature.golem1.rnk = 4;
creature.golem1.un = true;
creature.golem1.pts = 200;

creature.golem2 = new Creature();
creature.golem2.name = i18n.t("content.creature.golem2.name");
creature.golem2.id = 128;
creature.golem2.desc = i18n.t("content.creature.golem2.desc");
creature.golem2.exp = 60;
creature.golem2.hp_r = 700;
creature.golem2.stat_p = [0.06, 0.25, 0.2, 0.25];
creature.golem2.aff = [11, 8, 5, -60, -5, 15, 14];
creature.golem2.cls = [11, 16, 11];
creature.golem2.eqp[0].aff = [10, 5, 25, 6, 6, 2, 13];
creature.golem2.eqp[0].cls = [3, 3, 11];
creature.golem2.ctype = 2;
creature.golem2.str_r = 18;
creature.golem2.agl_r = 35;
creature.golem2.spd_r = 3;
creature.golem2.rnk = 4;
creature.golem2.un = true;
creature.golem2.drop = [
  { item: item.sstraw, chance: 1, min: 13, max: 25 },
  { item: item.lsrd, chance: 1, min: 2, max: 2 },
  { item: item.rope, chance: 0.1 },
];
creature.golem2.pts = 400;

creature.golem3 = new Creature();
creature.golem3.name = i18n.t("content.creature.golem3.name");
creature.golem3.id = 129;
creature.golem3.desc = i18n.t("content.creature.golem3.desc");
creature.golem3.exp = 80;
creature.golem3.hp_r = 400;
creature.golem3.stat_p = [0.06, 0.3, 0.3, 0.3];
creature.golem3.aff = [11, 8, 5, -60, -5, 15, 14];
creature.golem3.cls = [10, 20, 14];
creature.golem3.eqp[0].aff = [10, 5, 25, 6, 6, 2, 13];
creature.golem3.eqp[0].cls = [3, 3, 14];
creature.golem3.ctype = 2;
creature.golem3.str_r = 21;
creature.golem3.agl_r = 70;
creature.golem3.spd_r = 4;
creature.golem3.rnk = 4;
creature.golem3.un = true;
creature.golem3.drop = [
  { item: item.lsrd, chance: 1, min: 4, max: 4 },
  { item: item.bhd, chance: 0.5, min: 1, max: 4 },
];
creature.golem3.pts = 500;

creature.golem4 = new Creature();
creature.golem4.name = i18n.t("content.creature.golem4.name");
creature.golem4.id = 130;
creature.golem4.desc = i18n.t("content.creature.golem4.desc");
creature.golem4.exp = 120;
creature.golem4.hp_r = 730;
creature.golem4.stat_p = [0.06, 0.3, 0.3, 0.3];
creature.golem4.aff = [19, 8, 5, -60, -5, 15, 14];
creature.golem4.cls = [20, 25, 18];
creature.golem4.eqp[0].aff = [11, 5, 25, 6, 6, 2, 13];
creature.golem4.eqp[0].cls = [3, 3, 13];
creature.golem4.ctype = 2;
creature.golem4.str_r = 25;
creature.golem4.agl_r = 50;
creature.golem4.spd_r = 4;
creature.golem4.rnk = 5;
creature.golem4.un = true;
creature.golem4.pts = 800;
creature.golem4.drop = [{ item: item.lsstn, chance: 1 }];
creature.golem4.battle_ai = function (x, y, z) {
  if (random() <= 0.2) return attack(x, y, abl.bash);
  return attack(x, y);
};

creature.ngtmr1 = new Creature();
creature.ngtmr1.name = i18n.t("content.creature.ngtmr1.name");
creature.ngtmr1.id = 131;
creature.ngtmr1.desc = i18n.t("content.creature.ngtmr1.desc");
creature.ngtmr1.exp = 1;
creature.ngtmr1.hp_r = 100000000;
creature.ngtmr1.stat_p = [0, 0, 0, 0];
creature.ngtmr1.cls = [9999, 9999, 9999];
creature.ngtmr1.str_r = 1;
creature.ngtmr1.agl_r = 1;
creature.ngtmr1.rnk = 0;
creature.ngtmr1.battle_ai = function () {
  return false;
};

// Its own description says its fighting prowess is close to zero and that it
// closes off paths by mimicking a wall, so it is not a fight -- it is a wall the
// player breaks. `battle_ai` returning false is authored intent and is kept: the
// rock never takes its turn, which in the single-hit path means it does not even
// print one. Everything else here is new, because it had eleven fields and none of
// the ones that decide what breaking it feels like.
//
// The numbers say "bring the right tool". `cls` is [blunt, edge, pierce] and higher
// resists more, so the authored [90, 120, 60] had a rock turning aside hammers
// better than spears. Reversed: a maul gets through, an edge skates off, a point
// finds nothing to open. A player with the wrong weapon is slowed rather than
// stopped, because the minimum-landed-damage floor guarantees every swing counts
// for something.
//
// `hp_r` was 9000 with `stat_p[0]` at 1.5, which in this corridor's level band is
// thousands of rounds of no risk whatever for no loot. It is a set piece, so the
// health is the slab's thickness and the growth is a construct's: level barely
// moves it.
creature.lrck = new Creature();
creature.lrck.name = i18n.t("content.creature.lrck.name");
creature.lrck.id = 132;
creature.lrck.desc = i18n.t("content.creature.lrck.desc");
creature.lrck.type = 3;
creature.lrck.exp = 123;
creature.lrck.hp_r = 1400;
creature.lrck.stat_p = [0.05, 0.1, 0.05, 0.05];
// Resists what stone resists. Weak along the seams: ethereal finds them and water
// splits them, which is how stone has always been quarried.
creature.lrck.aff = [18, 0, -15, 22, -8, 0, 6];
creature.lrck.cls = [10, 70, 90];
creature.lrck.eqp[0].aff = [0, 0, 0, 0, 0, 0, 0];
creature.lrck.eqp[0].cls = [0, 0, 0];
creature.lrck.ctype = 2;
// It never attacks, so this is only what it would hit with. Left honest rather than
// at the authored 90, which read as a threat the creature cannot carry out.
creature.lrck.str_r = 10;
creature.lrck.agl_r = 1;
creature.lrck.int_r = 1;
creature.lrck.spd_r = 1;
creature.lrck.pts = 40;
creature.lrck.drop = [];
creature.lrck.rnk = 11;
creature.lrck.battle_ai = function () {
  return false;
};

creature.lsprt = new Creature(); //u
creature.lsprt.name = i18n.t("content.creature.lsprt.name");
creature.lsprt.id = 133;
creature.lsprt.desc = i18n.t("content.creature.lsprt.desc");
creature.lsprt.exp = 5;
creature.lsprt.hp_r = 100;
creature.lsprt.stat_p = [1.1, 1.2, 2.9, 0.8];
creature.lsprt.aff = [15, 5, 15, -10, -5, 55, 34];
creature.lsprt.cls = [9, 9, 35];
creature.lsprt.eqp[0].aff = [4, 12, 7, -12, 6, 0, 0];
creature.lsprt.eqp[0].cls = [5, 5, 5];
creature.lsprt.ctype = 1;
creature.lsprt.atype = 1;
creature.lsprt.str_r = 5;
creature.lsprt.agl_r = 13;
creature.lsprt.spd_r = 2;
// The same slime table the scarecrow had, for the same copy-paste reason. A thing that
// lives inside an oil lamp leaves a lamp behind.
creature.lsprt.drop = [
  { item: item.cndl, chance: 0.4, min: 1, max: 3 },
  { item: wpn.trch, chance: 0.15 },
  { item: item.coal1, chance: 0.2, min: 1, max: 2 },
];
// Phantom, not Undead: it was never alive. Note the constructor's onDeath decrements
// global.spirits for type 4 rather than incrementing it, which is the existing contract
// for this kind and is left alone.
creature.lsprt.type = 4;
creature.lsprt.pts = 16;
// Its description is its design: not sinister by nature, and it enjoys playing pranks.
// So it does not fight so much as put your light out -- which in a mine is the whole
// threat, and it costs the player a torch rather than health. The rest of the time it is
// a weak nuisance. Sinking the light through the torch's own durability means the
// existing degrade message fires and nothing new has to know about darkness.
creature.lsprt.battle_ai = function (x, y) {
  const lamp = you.eqp[1];
  if (random() <= 0.3 && lamp && lamp.dp > 0 && you.mods.light > 0) {
    lamp.dp = 0;
    msg(
      i18n.t("runtime.data.creatures.dialogue.spirit_snuffs_the_light"),
      "darkgrey",
    );
    if (lamp.onDegrade) lamp.onDegrade();
    return 0;
  }
  return attack(x, y);
};
creature.lsprt.rnk = 10;

// The thing at the end of the corridor, and the proof of what is wrong: this
// cannot manifest at all unless the dark ki here is already deep.
creature.dcrps1 = new Creature();
creature.dcrps1.id = 134;
creature.dcrps1.name = i18n.t("content.creature.dcrps1.name");
creature.dcrps1.desc = i18n.t("content.creature.dcrps1.desc");
creature.dcrps1.type = 2;
creature.dcrps1.exp = 1800;
creature.dcrps1.hp_r = 3200;
creature.dcrps1.stat_p = [1.9, 1.25, 1.2, 1.4];
creature.dcrps1.aff = [28, 12, 34, -40, 8, -78, 96];
creature.dcrps1.cls = [40, 34, 44];
creature.dcrps1.eqp[0].aff = [18, 12, 34, -40, 8, -78, 96];
creature.dcrps1.eqp[0].cls = [11, 11, 12];
creature.dcrps1.ctype = 1;
creature.dcrps1.str_r = 50;
creature.dcrps1.agl_r = 30;
creature.dcrps1.int_r = 30;
creature.dcrps1.spd_r = 4;
creature.dcrps1.eva = 18;
creature.dcrps1.res.poison = 0;
creature.dcrps1.res.venom = 0;
creature.dcrps1.res.sleep = 0;
creature.dcrps1.res.bleed = 0;
creature.dcrps1.res.death = 0.1;
creature.dcrps1.res.curse = 0.2;
creature.dcrps1.res.frost = 0.35;
creature.dcrps1.res.paralize = 0.1;
creature.dcrps1.res.blind = 0.2;
creature.dcrps1.drop = [
  { item: item.ess6, chance: 0.35 },
  { item: acc.sstn, chance: 0.15 },
  { item: item.sbone, chance: 0.7 },
  { item: item.cclth, chance: 0.4 },
];
creature.dcrps1.rnk = 15;
creature.dcrps1.blood = 0.05;
creature.dcrps1.pts = 500;
creature.dcrps1.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.spark);
  else if (random() <= 0.3) return attack(x, y, abl.bash);
  else if (random() <= 0.25) return attack(x, y, abl.scrtch);
  return attack(x, y);
};

// Its own description says these do not hurt anyone — they pull pranks — until
// death ki has been on them too long, and then they go frenzied. The whole
// point of this corridor is that something has been at them for a while.
creature.unsctn = new Creature();
creature.unsctn.id = 135;
creature.unsctn.name = i18n.t("content.creature.unsctn.name");
creature.unsctn.desc = i18n.t("content.creature.unsctn.desc");
creature.unsctn.type = 2;
creature.unsctn.exp = 700;
creature.unsctn.hp_r = 1800;
creature.unsctn.stat_p = [1.5, 1.2, 1.6, 0.8];
creature.unsctn.aff = [26, 16, 20, -18, 10, -60, 76];
creature.unsctn.cls = [42, 36, 34];
creature.unsctn.eqp[0].aff = [16, 16, 20, -18, 10, -60, 76];
creature.unsctn.eqp[0].cls = [10, 10, 10];
creature.unsctn.ctype = 1;
creature.unsctn.str_r = 40;
creature.unsctn.agl_r = 40;
creature.unsctn.int_r = 8;
creature.unsctn.spd_r = 5;
creature.unsctn.eva = 30;
creature.unsctn.res.poison = 0;
creature.unsctn.res.venom = 0;
creature.unsctn.res.sleep = 0;
creature.unsctn.res.bleed = 0.15;
creature.unsctn.res.death = 0.3;
creature.unsctn.res.death = 0.1;
creature.unsctn.res.bleed = 0;
creature.unsctn.res.paralize = 0.1;
creature.unsctn.drop = [
  { item: item.sbone, chance: 0.6 },
  { item: item.cp, chance: 0.25 },
];
creature.unsctn.rnk = 14;
creature.unsctn.blood = 0.05;
creature.unsctn.pts = 250;
creature.unsctn.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.rstab);
  else if (random() <= 0.25) return attack(x, y, abl.scrtch);
  return attack(x, y);
};

creature.wolf1 = new Creature();
creature.wolf1.name = i18n.t("content.creature.wolf1.name");
creature.wolf1.id = 136;
creature.wolf1.desc = i18n.t("content.creature.wolf1.desc"); //'Predatorous inhabitants of forests with a proud character. They stalk their prey and hunt in packs';
creature.wolf1.type = 1;
creature.wolf1.exp = 15;
creature.wolf1.hp_r = 400;
creature.wolf1.stat_p = [1.3, 1.15, 1.35, 0.9];
creature.wolf1.aff = [22, 20, -4, -11, 31, -33, 51];
creature.wolf1.cls = [36, 32, 45];
creature.wolf1.eqp[0].aff = [12, 20, -4, -11, 31, -33, 51];
creature.wolf1.eqp[0].cls = [8, 9, 8];
creature.wolf1.ctype = 1;
creature.wolf1.str_r = 20;
creature.wolf1.agl_r = 20;
creature.wolf1.int_r = 10;
creature.wolf1.spd_r = 3;
creature.wolf1.eva = 25;
creature.wolf1.drop = [
  { item: item.sbone, chance: 0.15 },
  { item: item.rwmt1, chance: 0.06 },
  { item: item.wfng, chance: 0.005 },
];
creature.wolf1.rnk = 4;
creature.wolf1.blood = 0.986;
creature.wolf1.pts = 9;
creature.wolf1.battle_ai = function (x, y, z) {
  if (random() <= 0.3) return attack(x, y, abl.bite);
  // This read `abl.scratch`, which does not exist. attack() falls back to
  // abl.default for an undefined ability, so the wolf's scratch silently lost
  // both its bleed chance and its damage bonus, and abl.scrtch was dead code
  // that no creature reached.
  else if (random() <= 0.1) return attack(x, y, abl.scrtch);
  return attack(x, y);
};

creature.slm5 = new Creature();
creature.slm5.name = i18n.t("content.creature.slm5.name");
creature.slm5.id = 137;
creature.slm5.desc = i18n.t("content.creature.slm5.desc");
creature.slm5.type = 1;
creature.slm5.exp = 12;
creature.slm5.hp_r = 220;
creature.slm5.stat_p = [0.5, 1.1, 2.97, 0.6];
creature.slm5.aff = [19, 15, 15, 3, -5, 55, 34];
creature.slm5.cls = [23, 23, 23];
creature.slm5.eqp[0].aff = [4, 9, 7, -12, 12, 0, 0];
creature.slm5.eqp[0].cls = [7, 7, 7];
creature.slm5.ctype = 2;
creature.slm5.atype = 4;
creature.slm5.str_r = 8;
creature.slm5.agl_r = 9;
creature.slm5.eva = 22;
creature.slm5.spd_r = 2;
creature.slm5.drop = [
  { item: item.watr, chance: 0.085 },
  { item: item.slm, chance: 0.03 },
  { item: item.jll, chance: 0.07 },
  { item: acc.jln3, chance: 0.0005 },
];
creature.slm5.rnk = 3;
creature.slm5.pts = 5;
creature.slm5.battle_ai = function (x, y, z) {
  if (random() <= 0.15) return attack(x, y, abl.bash);
  return attack(x, y);
};

// The pack leader Yamato warned about after the wolf hunt. Deliberately not just
// a bigger wolf: every other wolf in the game is a Weakened Wolf, and this is
// the one that is not. What it carries instead is the taint of whatever pushed
// the pack north, which is why its dark affinity and its resistances run so far
// ahead of the rest of its stats, and why it bites with rot.
creature.wolfa1 = new Creature();
creature.wolfa1.name = i18n.t("content.creature.wolfa1.name");
creature.wolfa1.id = 138;
creature.wolfa1.desc = i18n.t("content.creature.wolfa1.desc");
creature.wolfa1.type = 1;
creature.wolfa1.exp = 900;
creature.wolfa1.hp_r = 1300;
creature.wolfa1.stat_p = [1.5, 1.2, 1.4, 1];
creature.wolfa1.aff = [18, 26, 4, -14, 34, -48, 66];
creature.wolfa1.cls = [30, 24, 34];
creature.wolfa1.eqp[0].aff = [14, 26, 4, -14, 34, -48, 66];
creature.wolfa1.eqp[0].cls = [9, 10, 9];
creature.wolfa1.ctype = 1;
creature.wolfa1.str_r = 30;
creature.wolfa1.agl_r = 34;
creature.wolfa1.int_r = 16;
creature.wolfa1.spd_r = 5;
creature.wolfa1.eva = 30;
creature.wolfa1.res.curse = 0.55;
creature.wolfa1.res.death = 0.7;
creature.wolfa1.res.frost = 0.7;
creature.wolfa1.drop = [
  { item: item.wfng, chance: 0.9 },
  { item: item.sbone, chance: 0.5 },
  { item: item.rwmt1, chance: 0.3 },
];
creature.wolfa1.rnk = 7;
creature.wolfa1.blood = 0.986;
creature.wolfa1.pts = 140;
creature.wolfa1.battle_ai = function (x, y, z) {
  if (random() <= 0.25) return attack(x, y, abl.pbite);
  else if (random() <= 0.3) return attack(x, y, abl.bite);
  else if (random() <= 0.2) return attack(x, y, abl.scrtch);
  return attack(x, y);
};
