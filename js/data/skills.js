///////////////////////////////////////////
//SKL
///////////////////////////////////////////

function Skill() {
  this.name = "";
  this.desc = "";
  this.exp = 0;
  this.lvl = 0;
  this.type = 0;
  this.p = 1;
  this.sp;
  this.expnext = function () {
    return Math.round(50 + (this.lvl + 1) ** Math.log(9 * this.lvl + 1));
  };
  this.expnext_t = this.expnext(); ///(i*.12)
  this.onLevel = function () {};
  this.onGive = function (x) {};
  this.use = function (x, y) {};
}

skl.fgt = new Skill();
skl.fgt.id = 101;
skl.fgt.type = 1;
skl.fgt.name = "Fighting";
skl.fgt.desc =
  "Ability to perform better in a fight" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases overall attack power</small>';
skl.fgt.use = function (x, y) {
  return you.str * (this.lvl * 0.02);
};
skl.fgt.mlstn = [
  {
    lv: 2,
    f: () => {
      you.exp_t += 0.02;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +2%",
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.stat_r();
      giveTitle(ttl.cvl);
    },
    g: false,
    p: "STR +1, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.exp_t += 0.02;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +3%",
  },
  {
    lv: 10,
    f: () => {
      you.exp_t += 0.05;
      you.mods.sbonus += 0.01;
      you.stat_r();
      giveTitle(ttl.tcvl);
    },
    g: false,
    p: "EXP Gain +5%, Energy Effectiveness +1%, New Title",
  },
  {
    lv: 11,
    f() {
      skl.unc.p += 0.1;
      skl.srdc.p += 0.1;
      skl.knfc.p += 0.1;
      skl.axc.p += 0.1;
      skl.plrmc.p += 0.1;
      skl.stfc.p += 0.1;
      skl.bwc.p += 0.1;
      skl.hmrc.p += 0.1;
    },
    g: false,
    p: "All Masteries EXP Gain +10%",
  },
  {
    lv: 12,
    f: () => {
      giveTitle(ttl.fgt);
      you.stra += 1;
      skl.war.p += 0.05;
      you.stat_r();
    },
    g: false,
    p: "STR +1, War EXP Gain +5%, New Title",
  },
  {
    lv: 13,
    f: () => {
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: "AGL +2",
  },
  {
    lv: 14,
    f: () => {
      you.exp_t += 0.06;
    },
    g: false,
    p: "EXP Gain +6%",
  },
  {
    lv: 15,
    f: () => {
      you.exp_t += 0.08;
      skl.unc.p += 0.1;
      skl.srdc.p += 0.1;
      skl.knfc.p += 0.1;
      skl.axc.p += 0.1;
      skl.plrmc.p += 0.1;
      skl.stfc.p += 0.1;
      skl.bwc.p += 0.1;
      skl.hmrc.p += 0.1;
      giveTitle(ttl.rok);
    },
    g: false,
    p: "EXP Gain +8%, All Masteries EXP Gain +10%, New Title",
  },
];

skl.unc = new Skill();
skl.unc.id = 102;
skl.unc.type = 1;
skl.unc.name = "Unarmed M";
skl.unc.bname = "Unarmed Mastery";
skl.unc.desc =
  "Mastery of unarmed combat" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases attack power when fighting unarmed</small>';
skl.unc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 6);
};
skl.unc.mlstn = [
  {
    lv: 2,
    f: () => {
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "STR +1",
  },
  {
    lv: 5,
    f: () => {
      you.agla += 1;
      you.stat_r();
      giveTitle(ttl.pbg);
    },
    g: false,
    p: "AGL +1, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.exp_t += 0.01;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +1%",
  },
  {
    lv: 10,
    f: () => {
      you.exp_t += 0.05;
      you.mods.sbonus += 0.02;
      you.stat_r();
      giveTitle(ttl.bll);
    },
    g: false,
    p: "EXP Gain +5%, Energy Effectiveness +2%, New Title",
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: "Fighting EXP Gain +3%",
  },
];
skl.srdc = new Skill();
skl.srdc.id = 103;
skl.srdc.type = 1;
skl.srdc.name = "Sword M";
skl.srdc.bname = "Sword Mastery";
skl.srdc.desc =
  "Ability to fight using swords" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases attack power when holding a sword</small>';
skl.srdc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 5);
};
skl.srdc.mlstn = [
  {
    lv: 1,
    f: () => {
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "STR +1",
  },
  {
    lv: 3,
    f: () => {
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "AGL +1",
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.agla += 1;
      you.stat_r();
      giveTitle(ttl.srd1);
    },
    g: false,
    p: "STR +1, AGL +1, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.exp_t += 0.03;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +3%",
  },
  {
    lv: 10,
    f: () => {
      you.exp_t += 0.05;
      you.mods.sbonus += 0.01;
      you.stat_r();
      giveTitle(ttl.srd2);
    },
    g: false,
    p: "EXP Gain +5%, Energy Effectiveness +1%, New Title",
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: "Fighting EXP Gain +3%",
  },
];

skl.knfc = new Skill();
skl.knfc.id = 104;
skl.knfc.type = 1;
skl.knfc.name = "Knife M";
skl.knfc.bname = "Knife Mastery";
skl.knfc.desc =
  "Ability to fight using knives and daggers" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases attack power when holding a knife</small>';
skl.knfc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 5);
};
skl.knfc.mlstn = [
  {
    lv: 2,
    f: () => {
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "AGL +1",
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.01;
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: "AGL +2, EXP Gain +1%",
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.stat_r();
      giveTitle(ttl.plm);
    },
    g: false,
    p: "STR +1, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.stra += 1;
      you.agla += 1;
      you.exp_t += 0.02;
    },
    g: false,
    p: "AGL +1, STR +1, EXP Gain +2%",
  },
  {
    lv: 10,
    f: () => {
      you.mods.cpwr += 0.1;
      giveTitle(ttl.knf);
    },
    g: false,
    p: "Critical Damage +10%, New Title",
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: "Fighting EXP Gain +3%",
  },
];

skl.axc = new Skill();
skl.axc.id = 105;
skl.axc.type = 1;
skl.axc.name = "Axe M";
skl.axc.bname = "Axe Mastery";
skl.axc.desc =
  "Ability to fight using axes" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases attack power when holding an axe</small>';
skl.axc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 5);
};
skl.axc.mlstn = [
  {
    lv: 2,
    f: () => {
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "STR +1",
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.02;
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "STR +1, EXP Gain +2%",
  },
  {
    lv: 5,
    f: () => {
      you.hpa += 30;
      you.ccls[2] += 1;
      you.stat_r();
      giveTitle(ttl.axc1);
    },
    g: false,
    p: "HP +30, Blunt DEF +1, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.stra += 1;
      you.agla += 1;
      you.exp_t += 0.02;
      you.stat_r();
    },
    g: false,
    p: "AGL +1, STR +1, EXP Gain +2%",
  },
  {
    lv: 10,
    f: () => {
      you.mods.sbonus += 0.02;
      you.stat_p[1] += 0.05;
      giveTitle(ttl.axc2);
    },
    g: false,
    p: "Energy Effectiveness +2%, STR training Potential +5%, New Title",
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: "Fighting EXP Gain +3%",
  },
];

skl.plrmc = new Skill();
skl.plrmc.id = 106;
skl.plrmc.type = 1;
skl.plrmc.name = "Polearm M";
skl.plrmc.bname = "Polearm Mastery";
skl.plrmc.desc =
  "Ability to fight using polearms and lances" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases attack power when holding a spear/polearm</small>';
skl.plrmc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 5);
};
skl.plrmc.mlstn = [
  {
    lv: 2,
    f: () => {
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "AGL +1",
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.01;
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "AGL +1, EXP Gain +1%",
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.ccls[1] += 1;
      you.stat_r();
      giveTitle(ttl.lnc1);
    },
    g: false,
    p: "STR +1, Pierce DEF +1, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.stra += 2;
      you.exp_t += 0.03;
      you.stat_r();
    },
    g: false,
    p: "STR +2, EXP Gain +3%",
  },
  {
    lv: 10,
    f: () => {
      you.res.ph += 0.01;
      giveTitle(ttl.lnc2);
    },
    g: false,
    p: "Physical Resistance +1%, New Title",
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: "Fighting EXP Gain +3%",
  },
];

skl.hmrc = new Skill();
skl.hmrc.id = 107;
skl.hmrc.type = 1;
skl.hmrc.name = "Hammer M";
skl.hmrc.bname = "Hammer Mastery";
skl.hmrc.desc =
  "Ability to fight using blunt weaponry" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases attack power when holding a club/hammer</small>';
skl.hmrc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 5);
};
skl.hmrc.mlstn = [
  {
    lv: 2,
    f: () => {
      you.exp_t += 0.01;
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "AGL +1, EXP Gain +1%",
  },
  {
    lv: 4,
    f: () => {
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "STR +1",
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.stat_r();
      giveTitle(ttl.stk);
    },
    g: false,
    p: "STR +1, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.stra += 1;
      you.exp_t += 0.03;
      you.stat_r();
    },
    g: false,
    p: "STR +1, EXP Gain +3%",
  },
  {
    lv: 10,
    f: () => {
      you.stra += 3;
      you.exp_t += 0.03;
      you.stat_r();
      giveTitle(ttl.hmr2);
    },
    g: false,
    p: "STR +3, EXP Gain +3%, New Title",
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: "Fighting EXP Gain +3%",
  },
];

skl.stfc = new Skill();
skl.stfc.id = 108;
skl.stfc.type = 1;
skl.stfc.name = "Staff M";
skl.stfc.bname = "Staff Mastery";
skl.stfc.desc = "Ability to fight using staves and wands";
skl.stfc.use = function (x, y) {
  you.int += (you.int / 100) * (this.lvl * 5);
};

skl.shdc = new Skill();
skl.shdc.id = 109;
skl.shdc.type = 1;
skl.shdc.name = "Shield M";
skl.shdc.bname = "Shield Mastery";
skl.shdc.desc = "Ability to use shields better";
skl.shdc.use = function (x, y) {
  giveSkExp(this, x || 1);
  you.str += (you.str / 100) * (this.lvl * 5);
  you.int += (you.int / 100) * (this.lvl * 3);
};
skl.shdc.mlstn = [
  {
    lv: 2,
    f: () => {
      you.exp_t += 0.03;
      skl.painr.p += 0.01;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +3%, Pain Resistance EXP Gain +1%",
  },
  {
    lv: 4,
    f: () => {
      you.hpa += 12;
      skl.painr.p += 0.02;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "HP +12, Pain Resistance EXP Gain +2%",
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.stat_r();
      giveTitle(ttl.sld1);
      skl.painr.p += 0.07;
    },
    g: false,
    p: "STR +1, Pain Resistance EXP Gain +7%, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.agla += 2;
      you.exp_t += 0.05;
      you.stat_r();
    },
    g: false,
    p: "AGL +2, EXP Gain +5%",
  },
  {
    lv: 10,
    f: () => {
      you.hpa += 30;
      you.stra += 2;
      you.agla += 2;
      you.exp_t += 0.05;
      you.stat_r();
      giveTitle(ttl.sld2);
    },
    g: false,
    p: "HP +30, STR +2, AGL +2, New Title",
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.08;
      you.stat_r();
    },
    g: false,
    p: "Fighting EXP Gain +8%",
  },
];

skl.sleep = new Skill();
skl.sleep.id = 110;
skl.sleep.type = 4;
skl.sleep.name = "Sleeping";
skl.sleep.desc =
  "The rest of Body" +
  dom.dseparator +
  '<small style="color:darkorange">Increases health gain during sleep</small>';
skl.sleep.use = function (x, y) {
  giveSkExp(this, x.sq || 1);
  return 5 * this.lvl * x.sq;
};
skl.sleep.mlstn = [
  {
    lv: 2,
    f: () => {
      you.hpa += 2;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +2",
  },
  {
    lv: 4,
    f: () => {
      you.hpa += 5;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +5",
  },
  {
    lv: 5,
    f: () => {
      skl.ptnc.p += 0.05;
      giveTitle(ttl.slp1);
      you.hpa += 10;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +10, Patience EXP Gain +5%, New Title",
  },
  {
    lv: 6,
    f: () => {
      you.hpa += 12;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +12",
  },
  {
    lv: 7,
    f: () => {
      you.hpa += 15;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +15",
  },
  {
    lv: 8,
    f: () => {
      you.hpa += 20;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +20",
  },
  {
    lv: 9,
    f: () => {
      skl.ptnc.p += 0.1;
      you.hpa += 25;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "Patience EXP Gain +10%, HP +25",
  },
  {
    lv: 10,
    f: () => {
      giveTitle(ttl.slp2);
      skl.dth.p += 0.1;
      you.hpa += 30;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +30, Death EXP Gain +10%, New Title",
  },
  {
    lv: 11,
    f: () => {
      you.hpa += 35;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +35",
  },
  {
    lv: 12,
    f: () => {
      you.hpa += 50;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +50",
  },
];

skl.seye = new Skill();
skl.seye.id = 111;
skl.seye.type = 3;
skl.seye.name = "Sharp Eye";
skl.seye.desc =
  "Ability to notice weak points" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases critical probability</small>';
skl.seye.use = function (x, y) {
  return this.lvl * 0.003;
};
skl.seye.mlstn = [
  {
    lv: 1,
    f: () => {
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "AGL +1",
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.seye1);
      you.stra += 1;
      you.exp_t += 0.04;
      you.stat_r();
    },
    g: false,
    p: "STR +1, EXP Gain +4%, New Title",
  },
  {
    lv: 4,
    f: () => {
      skl.scout.p += 0.05;
      you.mods.cpwr += 0.02;
      you.exp_t += 0.06;
    },
    g: false,
    p: "Perception EXP Gain +5%, Critical Damage +2%, EXP Gain +6%",
  },
  {
    lv: 5,
    f: () => {
      skl.unc.p += 0.05;
      skl.fgt.p += 0.05;
      skl.srdc.p += 0.05;
      skl.knfc.p += 0.05;
      skl.axc.p += 0.05;
      skl.plrmc.p += 0.05;
      skl.stfc.p += 0.05;
      skl.bwc.p += 0.05;
      skl.hmrc.p += 0.05;
      you.stat_r();
      giveTitle(ttl.seye2);
    },
    g: false,
    p: "All Masteries EXP Gain +5%, Fighting EXP Gain +5%, New Title",
  },
  {
    lv: 6,
    f: () => {
      skl.evas.p += 0.08;
      you.mods.cpwr += 0.08;
      skl.war.p += 0.07;
    },
    g: false,
    p: "Evasion EXP Gain +8%, Critical Damage +8%, War EXP Gain +7%",
  },
  {
    lv: 7,
    f: () => {
      skl.scout.p += 0.1;
      you.mods.sbonus += 0.01;
      you.stra += 2;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +7%, STR +2, Perception EXP Gain +10%, Energy Effectiveness +1%",
  },
  {
    lv: 8,
    f: () => {
      you.aff[0] += 5;
      giveTitle(ttl.seye3);
    },
    g: false,
    p: "Physical ATK +5, New Title",
  },
];

skl.pet = new Skill();
skl.pet.id = 112;
skl.pet.type = 10;
skl.pet.name = "Patting";
skl.pet.desc =
  "Mastery of petting animals" +
  dom.dseparator +
  '<small style="color:darkorange">Makes animals love you</small>';
skl.pet.use = function (x, y) {
  giveSkExp(this, x || 1);
};
skl.pet.mlstn = [
  {
    lv: 2,
    f: () => {
      you.luck += 1;
      you.stat_r();
    },
    g: false,
    p: "LUCK +1",
  },
  {
    lv: 4,
    f: () => {
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "AGL +1",
  },
  {
    lv: 5,
    f: () => {
      you.agla += 1;
      you.mods.sbonus += 0.01;
      you.stat_r();
      giveTitle(ttl.pet1);
    },
    g: false,
    p: "Energy Effectiveness +1%, New Title",
  },
  {
    lv: 6,
    f: () => {
      you.hpa += 33;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: "HP +33",
  },
  {
    lv: 7,
    f: () => {
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: "AGL +2",
  },
  {
    lv: 8,
    f: () => {
      you.exp_t += 0.1;
      you.cmaff[1] += 3;
      you.stat_r();
      giveTitle(ttl.pet2);
    },
    g: false,
    p: "EXP Gain +10%, Beast Class DEF +3, New Title",
  },
  {
    lv: 9,
    f: () => {
      skl.unc.p += 0.1;
    },
    g: false,
    p: "Unarmed Mastery EXP gain +10%",
  },
  {
    lv: 10,
    f: () => {
      you.inta += 3;
      giveTitle(ttl.pet3);
    },
    g: false,
    p: "INT +3, New Title",
  },
];

skl.walk = new Skill();
skl.walk.id = 113;
skl.walk.type = 4;
skl.walk.name = "Walking";
skl.walk.desc = "Ability to walk";
skl.walk.use = function (x, y) {
  giveSkExp(this, 0.5);
};
skl.walk.mlstn = [
  {
    lv: 1,
    f: () => {
      you.agla += 1;
      you.stat_r();
      giveAction(act.demo);
    },
    g: false,
    p: "AGL +1",
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.wlk);
      you.hpa += 5;
      you.stat_r();
    },
    g: false,
    p: "HP +5, New Title",
  },
  {
    lv: 4,
    f: () => {
      you.hpa += 8;
      you.sata += 6;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "HP +8, SAT +6",
  },
  {
    lv: 5,
    f: () => {
      giveTitle(ttl.jgg);
      you.hpa += 10;
      you.sata += 8;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "HP +10, SAT +8, New Title",
  },
  {
    lv: 6,
    f: () => {
      you.exp_t += 0.03;
      you.hpa += 12;
      you.stat_r();
      you.stat_p[0] += 0.03;
      dom.d5_3_1.update();
    },
    g: false,
    p: "HP +12, EXP Gain +3%, HP Training Potential +3%",
  },
  {
    lv: 7,
    f: () => {
      skl.tghs.p += 0.1;
      you.exp_t += 0.03;
      you.sata += 10;
      you.stat_r();
      you.stra += 1;
      you.stat_p[1] += 0.03;
      dom.d5_3_1.update();
    },
    g: false,
    p: "Toughness EXP Gain +10%, STR +1, SAT +10, EXP Gain +3%, STR Training Potential +3%",
  },
  {
    lv: 8,
    f: () => {
      skl.evas.p += 0.05;
      you.exp_t += 0.03;
      you.hpa += 15;
      you.stat_r();
      you.agla += 2;
      you.stat_p[2] += 0.03;
      dom.d5_3_1.update();
    },
    g: false,
    p: "Evasion EXP Gain +5%, HP +15, AGL +2, EXP Gain +3%, AGL Training Potential +3%",
  },
  {
    lv: 9,
    f: () => {
      you.exp_t += 0.06;
      you.hpa += 8;
      you.sata += 8;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "HP +8, SAT +8, EXP Gain +6%",
  },
  {
    lv: 10,
    f: () => {
      giveTitle(ttl.rnr);
      you.spda += 1;
      you.hpa += 10;
      you.sata += 10;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "HP +10, SAT 10, SPD +1, New Title",
  },
];

skl.dice = new Skill();
skl.dice.id = 114;
skl.dice.type = 10;
skl.dice.name = "Gambling";
skl.dice.desc = "Skill of chances";
skl.dice.use = function (x, y) {
  giveSkExp(this, x || 1);
};
skl.dice.mlstn = [
  {
    lv: 1,
    f: () => {
      you.luck += 1;
      you.stat_r();
    },
    g: false,
    p: "LUCK +1",
  },
  {
    lv: 3,
    f: () => {
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: "AGL +2",
  },
  //{lv:10,f:()=>{you.spda+=1;you.stat_r();},g:false,p:"SPD +1"},
];

skl.glt = new Skill();
skl.glt.id = 115;
skl.glt.type = 4;
skl.glt.name = "Gluttony";
skl.glt.desc = "Mastery of eating";
skl.glt.use = function (x, y) {
  giveSkExp(this, x || 1);
  return this.lvl || 1;
};
skl.glt.mlstn = [
  {
    lv: 1,
    f() {
      you.sata += 5;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +5",
  },
  {
    lv: 2,
    f: () => {
      you.sata += 5;
      you.hpa += 5;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +5, HP +5",
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.eat1);
      you.sata += 10;
      you.hpa += 5;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +10, HP +5, New Title",
  },
  {
    lv: 4,
    f: () => {
      skl.fdpnr.p += 0.05;
      you.sata += 10;
      you.hpa += 5;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +10, HP +5, Survival EXP Gain +5%",
  },
  {
    lv: 5,
    f: () => {
      you.sata += 10;
      you.hpa += 10;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +10, HP +10",
  },
  {
    lv: 6,
    f: () => {
      you.sata += 10;
      you.hpa += 15;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +10, HP +15",
  },
  {
    lv: 7,
    f: () => {
      giveTitle(ttl.eat2);
      you.sata += 10;
      you.hpa += 20;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +10, HP +20, New Title",
  },
  {
    lv: 8,
    f: () => {
      you.sata += 15;
      you.hpa += 25;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +15, HP +25",
  },
  {
    lv: 9,
    f: () => {
      skl.fdpnr.p += 0.15;
      you.sata += 15;
      you.hpa += 35;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +15, HP +35, Survival EXP Gain +15%",
  },
  {
    lv: 10,
    f: () => {
      you.eqp_t += 0.13;
      giveTitle(ttl.eat3);
      you.sata += 20;
      you.hpa += 40;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "EXP Gain +13%, SAT +20, HP +40, New Title",
  },
  {
    lv: 11,
    f: () => {
      you.sata += 25;
      you.hpa += 50;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +25, HP +50",
  },
  {
    lv: 12,
    f: () => {
      you.sata += 25;
      you.hpa += 60;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +25, HP +60",
  },
  {
    lv: 13,
    f: () => {
      you.sata += 25;
      you.hpa += 70;
      you.stat_r();
      dom.d5_3_1.update();
    },
    g: false,
    p: "SAT +25, HP +70",
  },
];

skl.rdg = new Skill();
skl.rdg.id = 116;
skl.rdg.type = 4;
skl.rdg.name = "Literacy";
skl.rdg.desc =
  "Understanding of meaning behind texts" +
  dom.dseparator +
  '<small style="color:darkorange">Improves reading speed</small>';
skl.rdg.use = function (x, y) {
  return this.lvl;
};
skl.rdg.mlstn = [
  {
    lv: 2,
    f: () => {
      you.inta += 1;
      you.stat_r();
    },
    g: false,
    p: "INT +1",
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.ilt);
      you.exp_t += 0.02;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +2%, New Title",
  },
  {
    lv: 4,
    f: () => {
      you.exp_t += 0.02;
      you.inta += 1;
      you.stat_r();
    },
    g: false,
    p: "INT +1, EXP Gain +2%",
  },
  {
    lv: 5,
    f: () => {
      giveTitle(ttl.und);
      you.inta += 1;
      you.exp_t += 0.03;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +3%, INT +1, New Title",
  },
];

skl.cook = new Skill();
skl.cook.id = 117;
skl.cook.type = 5;
skl.cook.name = "Cooking";
skl.cook.desc =
  "The art of Cooking" +
  dom.dseparator +
  '<small style="color:darkorange">Reduces chances to cook a failed product</small>';
skl.cook.use = function (x, y) {
  giveSkExp(this, x || 1);
  return this.lvl || 1;
};
skl.cook.mlstn = [
  {
    lv: 1,
    f: () => {
      you.inta += 1;
      you.agla += 1;
      giveRcp(rcp.rsmt);
      giveRcp(rcp.segg);
      you.stat_r();
    },
    g: false,
    p: "INT +1, AGL +1",
  },
  {
    lv: 2,
    f: () => {
      giveTitle(ttl.coo1);
      giveRcp(rcp.bcrc);
      giveRcp(rcp.bcrrt);
      you.exp_t += 0.05;
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "STR +1, EXP Gain +5%, New Title",
  },
  //              {lv:3,f:()=>{you.exp_t+=0.02;you.inta+=1;you.stat_r();},g:false,p:"INT +1, EXP Gain +2%"},
  //              {lv:4,f:()=>{giveTitle(ttl.cck);you.inta+=1;you.exp_t+=0.03;you.stat_r();},g:false,p:"EXP Gain +3%, INT +1, New Title"},
];

skl.mdt = new Skill();
skl.mdt.id = 118;
skl.mdt.type = 4;
skl.mdt.name = "Meditation";
skl.mdt.desc = "The rest of Mind";
skl.mdt.use = function (x, y) {
  return this.lvl;
};

skl.crft = new Skill();
skl.crft.id = 119;
skl.crft.type = 5;
skl.crft.name = "Crafting";
skl.crft.desc =
  "The art of Creation" +
  dom.dseparator +
  '<small style="color:darkorange">Makes autocrafting faster</small>';
skl.crft.use = function (x, y) {
  giveSkExp(this, x || 1);
  return this.lvl || 1;
};

skl.alch = new Skill();
skl.alch.id = 120;
skl.alch.type = 5;
skl.alch.name = "Alchemy";
skl.alch.desc = "Knowledge of medicine and alchemical transmutation";
skl.alch.use = function (x, y) {
  giveSkExp(this, x || 1);
  return this.lvl || 1;
};
skl.alch.mlstn = [
  {
    lv: 1,
    f: () => {
      you.inta += 1;
      giveRcp(rcp.hptn1);
    },
    g: false,
    p: "INT +1",
  },
];

skl.thr = new Skill();
skl.thr.id = 121;
skl.thr.type = 2;
skl.thr.name = "Throwing";
skl.thr.desc =
  "Mastery of throwing" +
  dom.dseparator +
  '<small style="color:darkorange">Decreases waiting time between throws<br>Slightly increases throwing damage</small>';
skl.thr.use = function (x, y) {
  return { a: this.lvl / 10, b: this.lvl * 5 };
};

skl.bwc = new Skill();
skl.bwc.id = 122;
skl.bwc.type = 1;
skl.bwc.name = "Ranged M";
skl.bwc.bname = "Ranged Mastery";
skl.bwc.desc = "Ability to utilize bows and crossbows in combat";
skl.bwc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 5);
};

skl.ntst = new Skill();
skl.ntst.id = 123;
skl.ntst.type = 3;
skl.ntst.name = "Nightsight";
skl.ntst.desc =
  "Ability to see better in the darkness" +
  dom.dseparator +
  '<small style="color:darkorange">Mitigates hit penalty while fighting in darkness</small>';
skl.ntst.use = function (x, y) {
  giveSkExp(this, x || 1);
};

skl.evas = new Skill();
skl.evas.id = 124;
skl.evas.type = 3;
skl.evas.name = "Evasion";
skl.evas.desc = "Ability to dodge attacks";
skl.evas.use = function (x, y) {
  giveSkExp(this, x || 1);
};

skl.gred = new Skill();
skl.gred.id = 125;
skl.gred.type = 4;
skl.gred.name = "Greed";
skl.gred.desc = "The power of possessions";
skl.gred.use = function (x, y) {
  return true;
};

skl.dngs = new Skill();
skl.dngs.id = 126;
skl.dngs.type = 3;
skl.dngs.name = "Danger Sense";
skl.dngs.desc =
  "Ability to detect and avoid danger" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly decreases critical damage received</small>';
skl.dngs.use = function (x, y) {
  return this.lvl;
};
skl.dngs.mlstn = [
  {
    lv: 1,
    f: () => {
      you.exp_t += 0.03;
    },
    g: false,
    p: "EXP Gain +3%",
  },
  {
    lv: 2,
    f: () => {
      you.agla += 1;
      you.stat_r();
      skl.painr.p += 0.03;
    },
    g: false,
    p: "AGL +1, Pain Resistance EXP Gain +3%",
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.dngs1);
      skl.fgt.p += 0.1;
    },
    g: false,
    p: "Fighting EXP Gain +10%, New Title",
  },
  {
    lv: 4,
    f: () => {
      skl.evas.p += 0.1;
      you.exp_t += 0.05;
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +5%, Evasion EXP Gain +10%, STR +1",
  },
  {
    lv: 5,
    f: () => {
      giveTitle(ttl.dngs2);
      skl.seye.p += 0.1;
      you.mods.sbonus += 0.01;
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: "AGL +2, Energy Effectiveness +1%, Sharp Eye EXP Gain +10%, New Title",
  },
];

skl.painr = new Skill();
skl.painr.id = 127;
skl.painr.type = 6;
skl.painr.name = "Pain Resistance";
skl.painr.sp = ".66em";
skl.painr.desc =
  "Ability to tolerate physical harm" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly decreases damage received</small>';
skl.painr.use = function (x, y) {
  return this.lvl * 0.004;
};
skl.painr.mlstn = [
  {
    lv: 1,
    f: () => {
      you.exp_t += 0.01;
    },
    g: false,
    p: "EXP Gain +1%",
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.02;
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +2%, AGL +1",
  },
  {
    lv: 5,
    f: () => {
      giveTitle(ttl.rspn1);
      you.stra += 1;
      you.exp_t += 0.05;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +5%, STR +1, New Title",
  },
  {
    lv: 6,
    f: () => {
      skl.dngs.p += 0.1;
      you.stat_r();
    },
    g: false,
    p: "Danger Sense EXP Gain +10%",
  },
];

skl.poisr = new Skill();
skl.poisr.id = 128;
skl.poisr.type = 6;
skl.poisr.name = "Poison Resistance";
skl.poisr.sp = "0.66em";
skl.poisr.desc =
  "Ability to tolerate harmful poisons" +
  dom.dseparator +
  '<small style="color:darkorange">Increases probability to avoid being poisoned</small>';
skl.poisr.use = function (x, y) {
  return this.lvl * 0.01;
};

skl.fdpnr = new Skill();
skl.fdpnr.id = 129;
skl.fdpnr.type = 4;
skl.fdpnr.name = "Survival";
skl.fdpnr.desc =
  "Ability to safely digest dangerous food" +
  dom.dseparator +
  '<small style="color:darkorange">Reduces energy loss from food poisoning</small>';
skl.fdpnr.use = function (x, y) {
  return this.lvl * 0.05;
};
skl.fdpnr.mlstn = [
  {
    lv: 1,
    f: () => {
      you.exp_t += 0.03;
    },
    g: false,
    p: "EXP Gain +3%",
  },
  {
    lv: 2,
    f: () => {
      you.sata += 15;
      you.hpa += 30;
      skl.glt.p += 0.05;
      dom.d5_3_1.update();
      you.stat_r();
    },
    g: false,
    p: "SAT +15, HP +30, Gluttony EXP Gain +5%",
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.rfpn1);
      skl.drka.p += 0.1;
      you.exp_t += 0.05;
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +5%, STR +1, Drinking EXP Gain +10%, New Title",
  },
  {
    lv: 5,
    f: () => {
      giveTitle(ttl.rfpn2);
      you.exp_t += 0.07;
      skl.painr.p += 0.1;
      skl.glt.p += 0.1;
    },
    g: false,
    p: "EXP Gain +7%, Pain Resistance EXP Gain +10%, Gluttony EXP Gain +10%, New Title",
  },
  {
    lv: 6,
    f: () => {
      skl.rtr.p += 0.15;
      you.stra += 2;
      you.stat_r();
    },
    g: false,
    p: "Elusion EXP Gain +15%, STR +2, HP +100",
  },
  {
    lv: 7,
    f: () => {
      you.exp_t += 0.1;
      you.stra += 1;
      skl.poisr.p += 0.1;
      skl.glt.p += 0.15;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +10%, STR +1, Poison Resistance EXP Gain +10%, Gluttony EXP Gain +15%,",
  },
  {
    lv: 8,
    f: () => {
      giveTitle(ttl.rfpn3);
      you.res.ph -= 0.01;
      skl.poisr.p += 0.2;
      skl.painr.p += 0.2;
    },
    g: false,
    p: "Damage Reduction +1%, Pain Resistance EXP Gain +20%, Poison Resistance EXP Gain +20%, New Title",
  },
];

skl.war = new Skill();
skl.war.id = 130;
skl.war.type = 3;
skl.war.name = "War";
skl.war.desc =
  "Mastery of destruction and military tactics" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases crit damage</small>';
skl.war.use = function (x, y) {
  return this.lvl * 0.005;
};

skl.stel = new Skill();
skl.stel.id = 131;
skl.stel.type = 3;
skl.stel.name = "Stealing";
skl.stel.desc = "Ability to pilfer";
skl.stel.use = function (x, y) {
  return this.lvl * 0.05;
};

skl.dth = new Skill();
skl.dth.id = 132;
skl.dth.type = 4;
skl.dth.name = "Death";
skl.dth.desc =
  "Ability to cling to your fate" +
  dom.dseparator +
  '<small style="color:darkorange">Reduces energy loss on death</small>';
skl.dth.use = function (x, y) {
  return this.lvl * 0.1;
};
skl.dth.mlstn = [
  {
    lv: 1,
    f: () => {
      you.hpa += 20;
      you.stat_r();
    },
    g: false,
    p: "HP +20",
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.03;
      skl.painr.p += 0.05;
      giveTitle(ttl.dth1);
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +3%, Pain Resistance EXP Gain +5%, New Title",
  },
  {
    lv: 5,
    f: () => {
      you.eqp_t += 0.05;
      skl.tghs.p += 0.1;
      you.stat_r();
    },
    g: false,
    p: "EXP Gain +5%, Toughness EXP Gain +10%",
  },
  {
    lv: 7,
    f: () => {
      skl.dngs.p += 0.15;
      you.stra += 2;
      giveTitle(ttl.dth2);
      you.stat_r();
    },
    g: false,
    p: "STR +2, Danger Sense EXP Gain +15%, New Title",
  },
  {
    lv: 9,
    f: () => {
      skl.painr.p += 0.1;
      you.sata += 15;
      you.stat_r();
    },
    g: false,
    p: "SAT +15, Pain Resistance EXP Gain +10%, New Title",
  },
  {
    lv: 10,
    f: () => {
      skl.fdpnr.p += 0.1;
      skl.dngs.p += 0.15;
      you.stra += 2;
      giveTitle(ttl.dth3);
      you.stat_r();
    },
    g: false,
    p: "Survival EXP Gain +10%, , New Title",
  },
];

skl.rtr = new Skill();
skl.rtr.id = 133;
skl.rtr.type = 3;
skl.rtr.name = "Elusion";
skl.rtr.desc = "Ability to escape danger";
skl.rtr.use = function (x, y) {
  return this.lvl;
};

skl.fmn = new Skill();
skl.fmn.id = 134;
skl.fmn.type = 4;
skl.fmn.name = "Famine";
skl.fmn.desc =
  "Ability to go by without any sustenance" +
  dom.dseparator +
  '<small style="color:darkorange">Increases lower energy effectiveness bonus</small>';
skl.fmn.use = function (x, y) {
  return this.lvl * 0.01;
};
skl.fmn.mlstn = [
  {
    lv: 1,
    f: () => {
      you.exp_t += 0.01;
    },
    g: false,
    p: "EXP Gain +1%",
  },
  {
    lv: 3,
    f: () => {
      you.sata += 5;
      you.hpa += 5;
      skl.glt.p += 0.03;
      giveTitle(ttl.fmn1);
      dom.d5_3_1.update();
      you.stat_r();
    },
    g: false,
    p: "SAT +5, HP +5, Gluttony EXP Gain +3%, New Title",
  },
  {
    lv: 5,
    f: () => {
      you.stra++;
      skl.tghs.p += 0.03;
      dom.d5_3_1.update();
      you.stat_r();
    },
    g: false,
    p: "STR +1, Toughness EXP Gain +3%",
  },
  {
    lv: 7,
    f: () => {
      you.agla += 2;
      skl.fdpnr.p += 0.15;
      you.hpa += 15;
      giveTitle(ttl.fmn2);
      dom.d5_3_1.update();
      you.stat_r();
    },
    g: false,
    p: "AGL +2, HP +15, Survival EXP Gain +15%, New Title",
  },
  {
    lv: 9,
    f: () => {
      you.sata += 10;
      skl.glt.p += 0.07;
      skl.dth.p += 0.05;
      dom.d5_3_1.update();
      you.stat_r();
    },
    g: false,
    p: "SAT +10, Death EXP Gain +5%, Gluttony EXP Gain +7%",
  },
  {
    lv: 10,
    f: () => {
      giveTitle(ttl.fmn3);
      dom.d5_3_1.update();
      you.stat_r();
    },
    g: false,
    p: ", New Title",
  },
];

skl.abw = new Skill();
skl.abw.id = 135;
skl.abw.type = 7;
skl.abw.name = "Water Absorption";
skl.abw.sp = "0.66em";
skl.abw.desc =
  "Ability to absorb Water Ki and assimilate it within your body" +
  dom.dseparator +
  '<small style="color:darkorange">Reduces energy loss when wet<br>Provides minor protection from water-based attacks</small>';
skl.abw.use = function (x, y) {
  return this.lvl;
};
skl.abw.onLevel = function () {
  you.cmaff[3] += Math.ceil(this.lvl / 3 + 1);
};
skl.abw.onGive = function (x) {
  if (!you.ki["w"]) you.ki["w"] = x;
  else you.ki["w"] += x;
};

skl.abf = new Skill();
skl.abf.id = 136;
skl.abf.type = 7;
skl.abf.name = "Fire Absorption";
skl.abf.sp = "0.66em";
skl.abf.desc =
  "Ability to absorb Fire Ki and assimilate it within your body" +
  dom.dseparator +
  '<small style="color:darkorange">Provides minor protection from fire-based attacks</small>';
skl.abf.use = function (x, y) {
  return this.lvl;
};
skl.abf.onLevel = function () {
  you.cmaff[4] += Math.ceil(this.lvl / 3 + 1);
};
skl.abf.onGive = function (x) {
  if (!you.ki["f"]) you.ki["f"] = x;
  else you.ki["f"] += x;
};

skl.aba = new Skill();
skl.aba.id = 137;
skl.aba.type = 7;
skl.aba.name = "Air Absorption";
skl.aba.sp = "0.66em";
skl.aba.desc =
  "Ability to absorb Air Ki and assimilate it within your body" +
  dom.dseparator +
  '<small style="color:darkorange">Provides minor protection from air-based attacks</small>';
skl.aba.use = function (x, y) {
  return this.lvl;
};
skl.aba.onLevel = function () {
  you.cmaff[1] += Math.ceil(this.lvl / 3 + 1);
};
skl.aba.onGive = function (x) {
  if (!you.ki["a"]) you.ki["a"] = x;
  else you.ki["a"] += x;
};

skl.abe = new Skill();
skl.abe.id = 138;
skl.abe.type = 7;
skl.abe.name = "Earth Absorption";
skl.abe.sp = "0.66em";
skl.abe.desc =
  "Ability to absorb Earth Ki and assimilate it within your body" +
  dom.dseparator +
  '<small style="color:darkorange">Provides minor protection from earth-based attacks</small>';
skl.abe.use = function (x, y) {
  return this.lvl;
};
skl.abe.onLevel = function () {
  you.cmaff[2] += Math.ceil(this.lvl / 3 + 1);
};
skl.abe.onGive = function (x) {
  if (!you.ki["e"]) you.ki["e"] = x;
  else you.ki["e"] += x;
};

skl.abl = new Skill();
skl.abl.id = 139;
skl.abl.type = 7;
skl.abl.name = "Light Absorption";
skl.abl.sp = "0.66em";
skl.abl.desc =
  "Ability to absorb Holy Ki and assimilate it within your body" +
  dom.dseparator +
  '<small style="color:darkorange">Provides minor protection from holy attacks</small>';
skl.abl.use = function (x, y) {
  return this.lvl;
};
skl.abl.onLevel = function () {
  you.cmaff[5] += Math.ceil(this.lvl / 3 + 1);
};
skl.abl.onGive = function (x) {
  if (!you.ki["l"]) you.ki["l"] = x;
  else you.ki["l"] += x;
};

skl.abd = new Skill();
skl.abd.id = 140;
skl.abd.type = 7;
skl.abd.name = "Dark Absorption";
skl.abd.sp = "0.66em";
skl.abd.desc =
  "Ability to absorb Dark Ki and assimilate it within your body" +
  dom.dseparator +
  '<small style="color:darkorange">Provides minor protection from Dark attacks</small>';
skl.abd.use = function (x, y) {
  return this.lvl;
};
skl.abd.onLevel = function () {
  you.cmaff[6] += Math.ceil(this.lvl / 3 + 1);
};
skl.abd.onGive = function (x) {
  if (!you.ki["d"]) you.ki["d"] = x;
  else you.ki["d"] += x;
};

skl.hvt = new Skill();
skl.hvt.id = 141;
skl.hvt.type = 8;
skl.hvt.name = "Foraging";
skl.hvt.desc = "Ability to harvest gifts of Nature";
skl.hvt.use = function (x, y) {
  return this.lvl;
};

skl.glg = new Skill();
skl.glg.id = 142;
skl.glg.type = 8;
skl.glg.name = "Geology";
skl.glg.desc = "Knowledge and ability to identify precious minerals";
skl.glg.use = function (x, y) {
  return this.lvl;
};

skl.mng = new Skill();
skl.mng.id = 143;
skl.mng.type = 8;
skl.mng.name = "Mining";
skl.mng.desc = "Ability to extract materials from stones and mountains";
skl.mng.use = function (x, y) {
  return this.lvl;
};

skl.mntnc = new Skill();
skl.mntnc.id = 144;
skl.mntnc.type = 9;
skl.mntnc.name = "Maintanence";
skl.mntnc.desc = "Ability to repair damaged equipment";
skl.mntnc.use = function (x, y) {
  return this.lvl;
};

skl.rccln = new Skill();
skl.rccln.id = 145;
skl.rccln.type = 9;
skl.rccln.name = "Temperance";
skl.rccln.desc = "Ability to resist temptation of worldly possessions";
skl.rccln.use = function (x, y) {
  return this.lvl;
};

skl.bledr = new Skill();
skl.bledr.id = 146;
skl.bledr.type = 6;
skl.bledr.name = "Bleeding Resistance";
skl.bledr.sp = "0.66em";
skl.bledr.desc =
  "Ability to keep going with blood loss" +
  dom.dseparator +
  '<small style="color:darkorange">Wounds bleed less</small>';
skl.bledr.use = function (x, y) {
  return this.lvl * 0.01;
};

skl.twoh = new Skill();
skl.twoh.id = 147;
skl.twoh.type = 1;
skl.twoh.name = "Two Handed M";
skl.twoh.bname = "Two Handed Mastery";
skl.twoh.desc =
  "Ability to fight using heavy two handed weapons" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly increases attack power when holding a two handed weapon</small>';
skl.twoh.use = function (x, y) {
  giveSkExp(this, 1);
  return you.str * (this.lvl * 0.0125);
};

skl.trad = new Skill();
skl.trad.id = 148;
skl.trad.type = 3;
skl.trad.name = "Trading";
skl.trad.desc =
  "Ability to exchange wealth for goods and services" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly shifts shop prices in your favour</small>';
skl.trad.use = function (x, y) {
  return this.lvl * 0.005;
};
skl.trad.onLevel = function () {
  recshop();
};

skl.swm = new Skill();
skl.swm.id = 149;
skl.swm.type = 3;
skl.swm.name = "Swimming";
skl.swm.desc = "Ability to dive and traverse waters";
skl.swm.use = function (x, y) {
  return this.lvl;
};

skl.dssmb = new Skill();
skl.dssmb.id = 150;
skl.dssmb.type = 3;
skl.dssmb.name = "Disassembly";
skl.dssmb.desc =
  "Ability to deconstruct goods into raw spare parts" +
  dom.dseparator +
  '<small style="color:darkorange">Increases yield from deconstructed items</small>';
skl.dssmb.use = function (x, y) {
  return this.lvl;
};

skl.tghs = new Skill();
skl.tghs.id = 151;
skl.tghs.type = 2;
skl.tghs.name = "Toughness";
skl.tghs.desc =
  "Durability of one's body" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly improves physical defence</small>';
skl.tghs.use = function (x, y) {
  return this.lvl;
};
skl.tghs.onLevel = function () {
  you.cmaff[0] += Math.ceil(this.lvl / 3 + 1);
};

skl.drka = new Skill();
skl.drka.id = 152;
skl.drka.type = 4;
skl.drka.name = "Drinking";
skl.drka.desc = "Ability to tolerate and enjoy alcoholic beverages";
skl.drka.use = function (x, y) {
  return this.lvl;
};

skl.tpgrf = new Skill();
skl.tpgrf.id = 153;
skl.tpgrf.type = 4;
skl.tpgrf.name = "Topography";
skl.tpgrf.desc = "Knowledge of land surfaces";
skl.tpgrf.use = function (x, y) {
  return this.lvl;
};

skl.ptnc = new Skill();
skl.ptnc.id = 154;
skl.ptnc.type = 4;
skl.ptnc.name = "Patience";
skl.ptnc.desc = "Ability to endure forms of suffering without complaint";
skl.ptnc.use = function (x, y) {
  return this.lvl;
};

skl.scout = new Skill();
skl.scout.id = 155;
skl.scout.type = 4;
skl.scout.name = "Perception";
skl.scout.desc =
  "Ability to see the unseen and better understand your surroundings";
skl.scout.use = function (x, y) {
  return this.lvl;
};

skl.jdg = new Skill();
skl.jdg.id = 156;
skl.jdg.type = 4;
skl.jdg.name = "Judgement";
skl.jdg.desc = "Ability to evaluate your choices";
skl.jdg.use = function (x, y) {
  return this.lvl;
};

skl.tlrng = new Skill();
skl.tlrng.id = 157;
skl.tlrng.type = 5;
skl.tlrng.name = "Tailoring";
skl.tlrng.desc = "Abillity to sew and create produce out of cloth";
skl.tlrng.use = function (x, y) {
  giveSkExp(this, x || 1);
  return this.lvl || 1;
};

skl.crptr = new Skill();
skl.crptr.id = 158;
skl.crptr.type = 6;
skl.crptr.name = "Corruption Resistance";
skl.crptr.sp = ".66em";
skl.crptr.desc =
  "Ability to resist the corruption of flesh" +
  dom.dseparator +
  '<small style="color:darkorange">Mitigates corruption and fei damage</small>';

skl.hst = new Skill();
skl.hst.id = 159;
skl.hvt.type = 8;
skl.hst.name = "Harvesting";
skl.hst.desc =
  "Ability to find and collect usable materials from the surroundings" +
  dom.dseparator +
  '<small style="color:darkorange">Increases chances of obtaining area loot</small>';
skl.hst.use = function (x, y) {
  return this.lvl;
};

skl.coldr = new Skill();
skl.coldr.id = 160;
skl.coldr.type = 6;
skl.coldr.name = "Cold Resistance";
skl.coldr.sp = ".66em";
skl.coldr.desc =
  "Ability to tolerate harsh and cold temperatures" +
  dom.dseparator +
  '<small style="color:darkorange">Slightly decreases energy loss when cold</small>';
skl.coldr.use = function (x, y) {
  return this.lvl * 0.004;
};
