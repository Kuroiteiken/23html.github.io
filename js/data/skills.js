// Skill definitions. Each skill owns its experience curve, a `use()` formula
// that other systems call to read the skill's current effect, and a milestone
// table that grants stat bonuses, titles, or recipes on level-up. `use()`
// returns raw scaling values, so callers are responsible for clamping them
// before applying them to damage or resource costs.

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
skl.fgt.name = i18n.t("content.skl.fgt.name");
skl.fgt.desc =
  i18n.t("content.skl.fgt.desc") +
  dom.dseparator +
  i18n.t("content.skl.fgt.bonus");
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
    p: i18n.t("content.skl.fgt.mlstn.lv2"),
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.stat_r();
      giveTitle(ttl.cvl);
    },
    g: false,
    p: i18n.t("content.skl.fgt.mlstn.lv5"),
  },
  {
    lv: 8,
    f: () => {
      you.exp_t += 0.02;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.fgt.mlstn.lv8"),
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
    p: i18n.t("content.skl.fgt.mlstn.lv10"),
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
    p: i18n.t("content.skl.fgt.mlstn.lv11"),
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
    p: i18n.t("content.skl.fgt.mlstn.lv12"),
  },
  {
    lv: 13,
    f: () => {
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.fgt.mlstn.lv13"),
  },
  {
    lv: 14,
    f: () => {
      you.exp_t += 0.06;
    },
    g: false,
    p: i18n.t("content.skl.fgt.mlstn.lv14"),
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
    p: i18n.t("content.skl.fgt.mlstn.lv15"),
  },
];

skl.unc = new Skill();
skl.unc.id = 102;
skl.unc.type = 1;
skl.unc.name = i18n.t("content.skl.unc.name");
skl.unc.bname = i18n.t("content.skl.unc.bname");
skl.unc.desc =
  i18n.t("content.skl.unc.desc") +
  dom.dseparator +
  i18n.t("content.skl.unc.bonus");
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
    p: i18n.t("content.skl.unc.mlstn.lv2"),
  },
  {
    lv: 5,
    f: () => {
      you.agla += 1;
      you.stat_r();
      giveTitle(ttl.pbg);
    },
    g: false,
    p: i18n.t("content.skl.unc.mlstn.lv5"),
  },
  {
    lv: 8,
    f: () => {
      you.exp_t += 0.01;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.unc.mlstn.lv8"),
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
    p: i18n.t("content.skl.unc.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.unc.mlstn.lv11"),
  },
];
skl.srdc = new Skill();
skl.srdc.id = 103;
skl.srdc.type = 1;
skl.srdc.name = i18n.t("content.skl.srdc.name");
skl.srdc.bname = i18n.t("content.skl.srdc.bname");
skl.srdc.desc =
  i18n.t("content.skl.srdc.desc") +
  dom.dseparator +
  i18n.t("content.skl.srdc.bonus");
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
    p: i18n.t("content.skl.srdc.mlstn.lv1"),
  },
  {
    lv: 3,
    f: () => {
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.srdc.mlstn.lv3"),
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
    p: i18n.t("content.skl.srdc.mlstn.lv5"),
  },
  {
    lv: 8,
    f: () => {
      you.exp_t += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.srdc.mlstn.lv8"),
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
    p: i18n.t("content.skl.srdc.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.srdc.mlstn.lv11"),
  },
  {
    lv: 15,
    f: () => {
      giveTitle(ttl.srd3);
    },
    g: false,
    p: i18n.t("content.skl.srdc.mlstn.lv15"),
  },
  {
    lv: 20,
    f: () => {
      giveTitle(ttl.srd4);
    },
    g: false,
    p: i18n.t("content.skl.srdc.mlstn.lv20"),
  },
];

skl.knfc = new Skill();
skl.knfc.id = 104;
skl.knfc.type = 1;
skl.knfc.name = i18n.t("content.skl.knfc.name");
skl.knfc.bname = i18n.t("content.skl.knfc.bname");
skl.knfc.desc =
  i18n.t("content.skl.knfc.desc") +
  dom.dseparator +
  i18n.t("content.skl.knfc.bonus");
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
    p: i18n.t("content.skl.knfc.mlstn.lv2"),
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.01;
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.knfc.mlstn.lv3"),
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.stat_r();
      giveTitle(ttl.plm);
    },
    g: false,
    p: i18n.t("content.skl.knfc.mlstn.lv5"),
  },
  {
    lv: 8,
    f: () => {
      you.stra += 1;
      you.agla += 1;
      you.exp_t += 0.02;
    },
    g: false,
    p: i18n.t("content.skl.knfc.mlstn.lv8"),
  },
  {
    lv: 10,
    f: () => {
      you.mods.cpwr += 0.1;
      giveTitle(ttl.knf);
    },
    g: false,
    p: i18n.t("content.skl.knfc.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.knfc.mlstn.lv11"),
  },
];

skl.axc = new Skill();
skl.axc.id = 105;
skl.axc.type = 1;
skl.axc.name = i18n.t("content.skl.axc.name");
skl.axc.bname = i18n.t("content.skl.axc.bname");
skl.axc.desc =
  i18n.t("content.skl.axc.desc") +
  dom.dseparator +
  i18n.t("content.skl.axc.bonus");
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
    p: i18n.t("content.skl.axc.mlstn.lv2"),
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.02;
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.axc.mlstn.lv3"),
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
    p: i18n.t("content.skl.axc.mlstn.lv5"),
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
    p: i18n.t("content.skl.axc.mlstn.lv8"),
  },
  {
    lv: 10,
    f: () => {
      you.mods.sbonus += 0.02;
      you.stat_p[1] += 0.05;
      giveTitle(ttl.axc2);
    },
    g: false,
    p: i18n.t("content.skl.axc.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.axc.mlstn.lv11"),
  },
  {
    lv: 15,
    f: () => {
      giveTitle(ttl.axc3);
    },
    g: false,
    p: i18n.t("content.skl.axc.mlstn.lv15"),
  },
];

skl.plrmc = new Skill();
skl.plrmc.id = 106;
skl.plrmc.type = 1;
skl.plrmc.name = i18n.t("content.skl.plrmc.name");
skl.plrmc.bname = i18n.t("content.skl.plrmc.bname");
skl.plrmc.desc =
  i18n.t("content.skl.plrmc.desc") +
  dom.dseparator +
  i18n.t("content.skl.plrmc.bonus");
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
    p: i18n.t("content.skl.plrmc.mlstn.lv2"),
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.01;
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.plrmc.mlstn.lv3"),
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
    p: i18n.t("content.skl.plrmc.mlstn.lv5"),
  },
  {
    lv: 8,
    f: () => {
      you.stra += 2;
      you.exp_t += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.plrmc.mlstn.lv8"),
  },
  {
    lv: 10,
    f: () => {
      you.res.ph += 0.01;
      giveTitle(ttl.lnc2);
    },
    g: false,
    p: i18n.t("content.skl.plrmc.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.plrmc.mlstn.lv11"),
  },
  {
    lv: 15,
    f: () => {
      giveTitle(ttl.lnc3);
    },
    g: false,
    p: i18n.t("content.skl.plrmc.mlstn.lv15"),
  },
];

skl.hmrc = new Skill();
skl.hmrc.id = 107;
skl.hmrc.type = 1;
skl.hmrc.name = i18n.t("content.skl.hmrc.name");
skl.hmrc.bname = i18n.t("content.skl.hmrc.bname");
skl.hmrc.desc =
  i18n.t("content.skl.hmrc.desc") +
  dom.dseparator +
  i18n.t("content.skl.hmrc.bonus");
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
    p: i18n.t("content.skl.hmrc.mlstn.lv2"),
  },
  {
    lv: 4,
    f: () => {
      you.stra += 1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.hmrc.mlstn.lv4"),
  },
  {
    lv: 5,
    f: () => {
      you.stra += 1;
      you.stat_r();
      giveTitle(ttl.stk);
    },
    g: false,
    p: i18n.t("content.skl.hmrc.mlstn.lv5"),
  },
  {
    lv: 8,
    f: () => {
      you.stra += 1;
      you.exp_t += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.hmrc.mlstn.lv8"),
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
    p: i18n.t("content.skl.hmrc.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.03;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.hmrc.mlstn.lv11"),
  },
  {
    lv: 15,
    f: () => {
      giveTitle(ttl.hmr3);
    },
    g: false,
    p: i18n.t("content.skl.hmrc.mlstn.lv15"),
  },
];

skl.stfc = new Skill();
skl.stfc.id = 108;
skl.stfc.type = 1;
skl.stfc.name = i18n.t("content.skl.stfc.name");
skl.stfc.bname = i18n.t("content.skl.stfc.bname");
skl.stfc.desc = i18n.t("content.skl.stfc.desc");
skl.stfc.use = function (x, y) {
  you.int += (you.int / 100) * (this.lvl * 5);
};

skl.shdc = new Skill();
skl.shdc.id = 109;
skl.shdc.type = 1;
skl.shdc.name = i18n.t("content.skl.shdc.name");
skl.shdc.bname = i18n.t("content.skl.shdc.bname");
skl.shdc.desc = i18n.t("content.skl.shdc.desc");
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
    p: i18n.t("content.skl.shdc.mlstn.lv2"),
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
    p: i18n.t("content.skl.shdc.mlstn.lv4"),
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
    p: i18n.t("content.skl.shdc.mlstn.lv5"),
  },
  {
    lv: 8,
    f: () => {
      you.agla += 2;
      you.exp_t += 0.05;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.shdc.mlstn.lv8"),
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
    p: i18n.t("content.skl.shdc.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      skl.fgt.p += 0.08;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.shdc.mlstn.lv11"),
  },
  {
    lv: 15,
    f: () => {
      giveTitle(ttl.sld3);
    },
    g: false,
    p: i18n.t("content.skl.shdc.mlstn.lv15"),
  },
  {
    lv: 20,
    f: () => {
      giveTitle(ttl.sld4);
    },
    g: false,
    p: i18n.t("content.skl.shdc.mlstn.lv20"),
  },
  {
    lv: 25,
    f: () => {
      giveTitle(ttl.sld5);
    },
    g: false,
    p: i18n.t("content.skl.shdc.mlstn.lv25"),
  },
];

skl.sleep = new Skill();
skl.sleep.id = 110;
skl.sleep.type = 4;
skl.sleep.name = i18n.t("content.skl.sleep.name");
skl.sleep.desc =
  i18n.t("content.skl.sleep.desc") +
  dom.dseparator +
  i18n.t("content.skl.sleep.bonus");
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
    p: i18n.t("content.skl.sleep.mlstn.lv2"),
  },
  {
    lv: 4,
    f: () => {
      you.hpa += 5;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: i18n.t("content.skl.sleep.mlstn.lv4"),
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
    p: i18n.t("content.skl.sleep.mlstn.lv5"),
  },
  {
    lv: 6,
    f: () => {
      you.hpa += 12;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: i18n.t("content.skl.sleep.mlstn.lv6"),
  },
  {
    lv: 7,
    f: () => {
      you.hpa += 15;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: i18n.t("content.skl.sleep.mlstn.lv7"),
  },
  {
    lv: 8,
    f: () => {
      you.hpa += 20;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: i18n.t("content.skl.sleep.mlstn.lv8"),
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
    p: i18n.t("content.skl.sleep.mlstn.lv9"),
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
    p: i18n.t("content.skl.sleep.mlstn.lv10"),
  },
  {
    lv: 11,
    f: () => {
      you.hpa += 35;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: i18n.t("content.skl.sleep.mlstn.lv11"),
  },
  {
    lv: 12,
    f: () => {
      you.hpa += 50;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: i18n.t("content.skl.sleep.mlstn.lv12"),
  },
];

skl.seye = new Skill();
skl.seye.id = 111;
skl.seye.type = 3;
skl.seye.name = i18n.t("content.skl.seye.name");
skl.seye.desc =
  i18n.t("content.skl.seye.desc") +
  dom.dseparator +
  i18n.t("content.skl.seye.bonus");
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
    p: i18n.t("content.skl.seye.mlstn.lv1"),
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
    p: i18n.t("content.skl.seye.mlstn.lv3"),
  },
  {
    lv: 4,
    f: () => {
      skl.scout.p += 0.05;
      you.mods.cpwr += 0.02;
      you.exp_t += 0.06;
    },
    g: false,
    p: i18n.t("content.skl.seye.mlstn.lv4"),
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
    p: i18n.t("content.skl.seye.mlstn.lv5"),
  },
  {
    lv: 6,
    f: () => {
      skl.evas.p += 0.08;
      you.mods.cpwr += 0.08;
      skl.war.p += 0.07;
    },
    g: false,
    p: i18n.t("content.skl.seye.mlstn.lv6"),
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
    p: i18n.t("content.skl.seye.mlstn.lv7"),
  },
  {
    lv: 8,
    f: () => {
      you.aff[0] += 5;
      giveTitle(ttl.seye3);
    },
    g: false,
    p: i18n.t("content.skl.seye.mlstn.lv8"),
  },
];

skl.pet = new Skill();
skl.pet.id = 112;
skl.pet.type = 10;
skl.pet.name = i18n.t("content.skl.pet.name");
skl.pet.desc =
  i18n.t("content.skl.pet.desc") +
  dom.dseparator +
  i18n.t("content.skl.pet.bonus");
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
    p: i18n.t("content.skl.pet.mlstn.lv2"),
  },
  {
    lv: 4,
    f: () => {
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.pet.mlstn.lv4"),
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
    p: i18n.t("content.skl.pet.mlstn.lv5"),
  },
  {
    lv: 6,
    f: () => {
      you.hpa += 33;
      you.stat_r();
      dom.d5_1_1.update();
    },
    g: false,
    p: i18n.t("content.skl.pet.mlstn.lv6"),
  },
  {
    lv: 7,
    f: () => {
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.pet.mlstn.lv7"),
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
    p: i18n.t("content.skl.pet.mlstn.lv8"),
  },
  {
    lv: 9,
    f: () => {
      skl.unc.p += 0.1;
    },
    g: false,
    p: i18n.t("content.skl.pet.mlstn.lv9"),
  },
  {
    lv: 10,
    f: () => {
      you.inta += 3;
      giveTitle(ttl.pet3);
    },
    g: false,
    p: i18n.t("content.skl.pet.mlstn.lv10"),
  },
];

skl.walk = new Skill();
skl.walk.id = 113;
skl.walk.type = 4;
skl.walk.name = i18n.t("content.skl.walk.name");
skl.walk.desc = i18n.t("content.skl.walk.desc");
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
    p: i18n.t("content.skl.walk.mlstn.lv1"),
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.wlk);
      you.hpa += 5;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.walk.mlstn.lv3"),
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
    p: i18n.t("content.skl.walk.mlstn.lv4"),
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
    p: i18n.t("content.skl.walk.mlstn.lv5"),
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
    p: i18n.t("content.skl.walk.mlstn.lv6"),
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
    p: i18n.t("content.skl.walk.mlstn.lv7"),
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
    p: i18n.t("content.skl.walk.mlstn.lv8"),
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
    p: i18n.t("content.skl.walk.mlstn.lv9"),
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
    p: i18n.t("content.skl.walk.mlstn.lv10"),
  },
];

skl.dice = new Skill();
skl.dice.id = 114;
skl.dice.type = 10;
skl.dice.name = i18n.t("content.skl.dice.name");
skl.dice.desc = i18n.t("content.skl.dice.desc");
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
    p: i18n.t("content.skl.dice.mlstn.lv1"),
  },
  {
    lv: 3,
    f: () => {
      you.agla += 2;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.dice.mlstn.lv3"),
  },
  //{lv:10,f:()=>{you.spda+=1;you.stat_r();},g:false,p:"SPD +1"},
];

skl.glt = new Skill();
skl.glt.id = 115;
skl.glt.type = 4;
skl.glt.name = i18n.t("content.skl.glt.name");
skl.glt.desc = i18n.t("content.skl.glt.desc");
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
    p: i18n.t("content.skl.glt.mlstn.lv1"),
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
    p: i18n.t("content.skl.glt.mlstn.lv2"),
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
    p: i18n.t("content.skl.glt.mlstn.lv3"),
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
    p: i18n.t("content.skl.glt.mlstn.lv4"),
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
    p: i18n.t("content.skl.glt.mlstn.lv5"),
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
    p: i18n.t("content.skl.glt.mlstn.lv6"),
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
    p: i18n.t("content.skl.glt.mlstn.lv7"),
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
    p: i18n.t("content.skl.glt.mlstn.lv8"),
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
    p: i18n.t("content.skl.glt.mlstn.lv9"),
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
    p: i18n.t("content.skl.glt.mlstn.lv10"),
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
    p: i18n.t("content.skl.glt.mlstn.lv11"),
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
    p: i18n.t("content.skl.glt.mlstn.lv12"),
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
    p: i18n.t("content.skl.glt.mlstn.lv13"),
  },
];

skl.rdg = new Skill();
skl.rdg.id = 116;
skl.rdg.type = 4;
skl.rdg.name = i18n.t("content.skl.rdg.name");
skl.rdg.desc =
  i18n.t("content.skl.rdg.desc") +
  dom.dseparator +
  i18n.t("content.skl.rdg.bonus");
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
    p: i18n.t("content.skl.rdg.mlstn.lv2"),
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.ilt);
      you.exp_t += 0.02;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.rdg.mlstn.lv3"),
  },
  {
    lv: 4,
    f: () => {
      you.exp_t += 0.02;
      you.inta += 1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.rdg.mlstn.lv4"),
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
    p: i18n.t("content.skl.rdg.mlstn.lv5"),
  },
];

skl.cook = new Skill();
skl.cook.id = 117;
skl.cook.type = 5;
skl.cook.name = i18n.t("content.skl.cook.name");
skl.cook.desc =
  i18n.t("content.skl.cook.desc") +
  dom.dseparator +
  i18n.t("content.skl.cook.bonus");
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
    p: i18n.t("content.skl.cook.mlstn.lv1"),
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
    p: i18n.t("content.skl.cook.mlstn.lv2"),
  },
  //              {lv:3,f:()=>{you.exp_t+=0.02;you.inta+=1;you.stat_r();},g:false,p:"INT +1, EXP Gain +2%"},
  //              {lv:4,f:()=>{giveTitle(ttl.cck);you.inta+=1;you.exp_t+=0.03;you.stat_r();},g:false,p:"EXP Gain +3%, INT +1, New Title"},
];

skl.mdt = new Skill();
skl.mdt.id = 118;
skl.mdt.type = 4;
skl.mdt.name = i18n.t("content.skl.mdt.name");
skl.mdt.desc = i18n.t("content.skl.mdt.desc");
skl.mdt.use = function (x, y) {
  return this.lvl;
};

skl.crft = new Skill();
skl.crft.id = 119;
skl.crft.type = 5;
skl.crft.name = i18n.t("content.skl.crft.name");
skl.crft.desc =
  i18n.t("content.skl.crft.desc") +
  dom.dseparator +
  i18n.t("content.skl.crft.bonus");
skl.crft.use = function (x, y) {
  giveSkExp(this, x || 1);
  return this.lvl || 1;
};

skl.alch = new Skill();
skl.alch.id = 120;
skl.alch.type = 5;
skl.alch.name = i18n.t("content.skl.alch.name");
skl.alch.desc = i18n.t("content.skl.alch.desc");
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
    p: i18n.t("content.skl.alch.mlstn.lv1"),
  },
];

skl.thr = new Skill();
skl.thr.id = 121;
skl.thr.type = 2;
skl.thr.name = i18n.t("content.skl.thr.name");
skl.thr.desc =
  i18n.t("content.skl.thr.desc") +
  dom.dseparator +
  i18n.t("content.skl.thr.bonus");
skl.thr.use = function (x, y) {
  return { a: this.lvl / 10, b: this.lvl * 5 };
};

skl.bwc = new Skill();
skl.bwc.id = 122;
skl.bwc.type = 1;
skl.bwc.name = i18n.t("content.skl.bwc.name");
skl.bwc.bname = i18n.t("content.skl.bwc.bname");
skl.bwc.desc = i18n.t("content.skl.bwc.desc");
skl.bwc.use = function (x, y) {
  you.str += (you.str / 100) * (this.lvl * 5);
};

skl.ntst = new Skill();
skl.ntst.id = 123;
skl.ntst.type = 3;
skl.ntst.name = i18n.t("content.skl.ntst.name");
skl.ntst.desc =
  i18n.t("content.skl.ntst.desc") +
  dom.dseparator +
  i18n.t("content.skl.ntst.bonus");
skl.ntst.use = function (x, y) {
  giveSkExp(this, x || 1);
};

skl.evas = new Skill();
skl.evas.id = 124;
skl.evas.type = 3;
skl.evas.name = i18n.t("content.skl.evas.name");
skl.evas.desc = i18n.t("content.skl.evas.desc");
skl.evas.use = function (x, y) {
  giveSkExp(this, x || 1);
};

skl.gred = new Skill();
skl.gred.id = 125;
skl.gred.type = 4;
skl.gred.name = i18n.t("content.skl.gred.name");
skl.gred.desc = i18n.t("content.skl.gred.desc");
skl.gred.use = function (x, y) {
  return true;
};

skl.dngs = new Skill();
skl.dngs.id = 126;
skl.dngs.type = 3;
skl.dngs.name = i18n.t("content.skl.dngs.name");
skl.dngs.desc =
  i18n.t("content.skl.dngs.desc") +
  dom.dseparator +
  i18n.t("content.skl.dngs.bonus");
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
    p: i18n.t("content.skl.dngs.mlstn.lv1"),
  },
  {
    lv: 2,
    f: () => {
      you.agla += 1;
      you.stat_r();
      skl.painr.p += 0.03;
    },
    g: false,
    p: i18n.t("content.skl.dngs.mlstn.lv2"),
  },
  {
    lv: 3,
    f: () => {
      giveTitle(ttl.dngs1);
      skl.fgt.p += 0.1;
    },
    g: false,
    p: i18n.t("content.skl.dngs.mlstn.lv3"),
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
    p: i18n.t("content.skl.dngs.mlstn.lv4"),
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
    p: i18n.t("content.skl.dngs.mlstn.lv5"),
  },
];

skl.painr = new Skill();
skl.painr.id = 127;
skl.painr.type = 6;
skl.painr.name = i18n.t("content.skl.painr.name");
skl.painr.sp = ".66em";
skl.painr.desc =
  i18n.t("content.skl.painr.desc") +
  dom.dseparator +
  i18n.t("content.skl.painr.bonus");
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
    p: i18n.t("content.skl.painr.mlstn.lv1"),
  },
  {
    lv: 3,
    f: () => {
      you.exp_t += 0.02;
      you.agla += 1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.painr.mlstn.lv3"),
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
    p: i18n.t("content.skl.painr.mlstn.lv5"),
  },
  {
    lv: 6,
    f: () => {
      skl.dngs.p += 0.1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.painr.mlstn.lv6"),
  },
];

skl.poisr = new Skill();
skl.poisr.id = 128;
skl.poisr.type = 6;
skl.poisr.name = i18n.t("content.skl.poisr.name");
skl.poisr.sp = "0.66em";
skl.poisr.desc =
  i18n.t("content.skl.poisr.desc") +
  dom.dseparator +
  i18n.t("content.skl.poisr.bonus");
skl.poisr.use = function (x, y) {
  return this.lvl * 0.01;
};

skl.fdpnr = new Skill();
skl.fdpnr.id = 129;
skl.fdpnr.type = 4;
skl.fdpnr.name = i18n.t("content.skl.fdpnr.name");
skl.fdpnr.desc =
  i18n.t("content.skl.fdpnr.desc") +
  dom.dseparator +
  i18n.t("content.skl.fdpnr.bonus");
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
    p: i18n.t("content.skl.fdpnr.mlstn.lv1"),
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
    p: i18n.t("content.skl.fdpnr.mlstn.lv2"),
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
    p: i18n.t("content.skl.fdpnr.mlstn.lv3"),
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
    p: i18n.t("content.skl.fdpnr.mlstn.lv5"),
  },
  {
    lv: 6,
    f: () => {
      skl.rtr.p += 0.15;
      you.stra += 2;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.fdpnr.mlstn.lv6"),
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
    p: i18n.t("content.skl.fdpnr.mlstn.lv7"),
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
    p: i18n.t("content.skl.fdpnr.mlstn.lv8"),
  },
];

skl.war = new Skill();
skl.war.id = 130;
skl.war.type = 3;
skl.war.name = i18n.t("content.skl.war.name");
skl.war.desc =
  i18n.t("content.skl.war.desc") +
  dom.dseparator +
  i18n.t("content.skl.war.bonus");
skl.war.use = function (x, y) {
  return this.lvl * 0.005;
};

skl.stel = new Skill();
skl.stel.id = 131;
skl.stel.type = 3;
skl.stel.name = i18n.t("content.skl.stel.name");
skl.stel.desc = i18n.t("content.skl.stel.desc");
skl.stel.use = function (x, y) {
  return this.lvl * 0.05;
};

skl.dth = new Skill();
skl.dth.id = 132;
skl.dth.type = 4;
skl.dth.name = i18n.t("content.skl.dth.name");
skl.dth.desc =
  i18n.t("content.skl.dth.desc") +
  dom.dseparator +
  i18n.t("content.skl.dth.bonus");
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
    p: i18n.t("content.skl.dth.mlstn.lv1"),
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
    p: i18n.t("content.skl.dth.mlstn.lv3"),
  },
  {
    lv: 5,
    f: () => {
      you.eqp_t += 0.05;
      skl.tghs.p += 0.1;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.dth.mlstn.lv5"),
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
    p: i18n.t("content.skl.dth.mlstn.lv7"),
  },
  {
    lv: 9,
    f: () => {
      skl.painr.p += 0.1;
      you.sata += 15;
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.dth.mlstn.lv9"),
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
    p: i18n.t("content.skl.dth.mlstn.lv10"),
  },
];

skl.rtr = new Skill();
skl.rtr.id = 133;
skl.rtr.type = 3;
skl.rtr.name = i18n.t("content.skl.rtr.name");
skl.rtr.desc = i18n.t("content.skl.rtr.desc");
skl.rtr.use = function (x, y) {
  return this.lvl;
};

skl.fmn = new Skill();
skl.fmn.id = 134;
skl.fmn.type = 4;
skl.fmn.name = i18n.t("content.skl.fmn.name");
skl.fmn.desc =
  i18n.t("content.skl.fmn.desc") +
  dom.dseparator +
  i18n.t("content.skl.fmn.bonus");
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
    p: i18n.t("content.skl.fmn.mlstn.lv1"),
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
    p: i18n.t("content.skl.fmn.mlstn.lv3"),
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
    p: i18n.t("content.skl.fmn.mlstn.lv5"),
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
    p: i18n.t("content.skl.fmn.mlstn.lv7"),
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
    p: i18n.t("content.skl.fmn.mlstn.lv9"),
  },
  {
    lv: 10,
    f: () => {
      giveTitle(ttl.fmn3);
      dom.d5_3_1.update();
      you.stat_r();
    },
    g: false,
    p: i18n.t("content.skl.fmn.mlstn.lv10"),
  },
];

skl.abw = new Skill();
skl.abw.id = 135;
skl.abw.type = 7;
skl.abw.name = i18n.t("content.skl.abw.name");
skl.abw.sp = "0.66em";
skl.abw.desc =
  i18n.t("content.skl.abw.desc") +
  dom.dseparator +
  i18n.t("content.skl.abw.bonus");
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
skl.abf.name = i18n.t("content.skl.abf.name");
skl.abf.sp = "0.66em";
skl.abf.desc =
  i18n.t("content.skl.abf.desc") +
  dom.dseparator +
  i18n.t("content.skl.abf.bonus");
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
skl.aba.name = i18n.t("content.skl.aba.name");
skl.aba.sp = "0.66em";
skl.aba.desc =
  i18n.t("content.skl.aba.desc") +
  dom.dseparator +
  i18n.t("content.skl.aba.bonus");
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
skl.abe.name = i18n.t("content.skl.abe.name");
skl.abe.sp = "0.66em";
skl.abe.desc =
  i18n.t("content.skl.abe.desc") +
  dom.dseparator +
  i18n.t("content.skl.abe.bonus");
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
skl.abl.name = i18n.t("content.skl.abl.name");
skl.abl.sp = "0.66em";
skl.abl.desc =
  i18n.t("content.skl.abl.desc") +
  dom.dseparator +
  i18n.t("content.skl.abl.bonus");
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
skl.abd.name = i18n.t("content.skl.abd.name");
skl.abd.sp = "0.66em";
skl.abd.desc =
  i18n.t("content.skl.abd.desc") +
  dom.dseparator +
  i18n.t("content.skl.abd.bonus");
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
skl.hvt.name = i18n.t("content.skl.hvt.name");
skl.hvt.desc = i18n.t("content.skl.hvt.desc");
skl.hvt.use = function (x, y) {
  return this.lvl;
};

skl.glg = new Skill();
skl.glg.id = 142;
skl.glg.type = 8;
skl.glg.name = i18n.t("content.skl.glg.name");
skl.glg.desc = i18n.t("content.skl.glg.desc");
skl.glg.use = function (x, y) {
  return this.lvl;
};

skl.mng = new Skill();
skl.mng.id = 143;
skl.mng.type = 8;
skl.mng.name = i18n.t("content.skl.mng.name");
skl.mng.desc = i18n.t("content.skl.mng.desc");
skl.mng.use = function (x, y) {
  return this.lvl;
};

skl.mntnc = new Skill();
skl.mntnc.id = 144;
skl.mntnc.type = 9;
skl.mntnc.name = i18n.t("content.skl.mntnc.name");
skl.mntnc.desc = i18n.t("content.skl.mntnc.desc");
skl.mntnc.use = function (x, y) {
  return this.lvl;
};

skl.rccln = new Skill();
skl.rccln.id = 145;
skl.rccln.type = 9;
skl.rccln.name = i18n.t("content.skl.rccln.name");
skl.rccln.desc = i18n.t("content.skl.rccln.desc");
skl.rccln.use = function (x, y) {
  return this.lvl;
};

skl.bledr = new Skill();
skl.bledr.id = 146;
skl.bledr.type = 6;
skl.bledr.name = i18n.t("content.skl.bledr.name");
skl.bledr.sp = "0.66em";
skl.bledr.desc =
  i18n.t("content.skl.bledr.desc") +
  dom.dseparator +
  i18n.t("content.skl.bledr.bonus");
skl.bledr.use = function (x, y) {
  return this.lvl * 0.01;
};

skl.twoh = new Skill();
skl.twoh.id = 147;
skl.twoh.type = 1;
skl.twoh.name = i18n.t("content.skl.twoh.name");
skl.twoh.bname = i18n.t("content.skl.twoh.bname");
skl.twoh.desc =
  i18n.t("content.skl.twoh.desc") +
  dom.dseparator +
  i18n.t("content.skl.twoh.bonus");
skl.twoh.use = function (x, y) {
  giveSkExp(this, 1);
  return you.str * (this.lvl * 0.0125);
};

skl.trad = new Skill();
skl.trad.id = 148;
skl.trad.type = 3;
skl.trad.name = i18n.t("content.skl.trad.name");
skl.trad.desc =
  i18n.t("content.skl.trad.desc") +
  dom.dseparator +
  i18n.t("content.skl.trad.bonus");
skl.trad.use = function (x, y) {
  return this.lvl * 0.005;
};
skl.trad.onLevel = function () {
  recshop();
};

skl.swm = new Skill();
skl.swm.id = 149;
skl.swm.type = 3;
skl.swm.name = i18n.t("content.skl.swm.name");
skl.swm.desc = i18n.t("content.skl.swm.desc");
skl.swm.use = function (x, y) {
  return this.lvl;
};

skl.dssmb = new Skill();
skl.dssmb.id = 150;
skl.dssmb.type = 3;
skl.dssmb.name = i18n.t("content.skl.dssmb.name");
skl.dssmb.desc =
  i18n.t("content.skl.dssmb.desc") +
  dom.dseparator +
  i18n.t("content.skl.dssmb.bonus");
skl.dssmb.use = function (x, y) {
  return this.lvl;
};

skl.tghs = new Skill();
skl.tghs.id = 151;
skl.tghs.type = 2;
skl.tghs.name = i18n.t("content.skl.tghs.name");
skl.tghs.desc =
  i18n.t("content.skl.tghs.desc") +
  dom.dseparator +
  i18n.t("content.skl.tghs.bonus");
skl.tghs.use = function (x, y) {
  return this.lvl;
};
skl.tghs.onLevel = function () {
  you.cmaff[0] += Math.ceil(this.lvl / 3 + 1);
};

skl.drka = new Skill();
skl.drka.id = 152;
skl.drka.type = 4;
skl.drka.name = i18n.t("content.skl.drka.name");
skl.drka.desc = i18n.t("content.skl.drka.desc");
skl.drka.use = function (x, y) {
  return this.lvl;
};

skl.tpgrf = new Skill();
skl.tpgrf.id = 153;
skl.tpgrf.type = 4;
skl.tpgrf.name = i18n.t("content.skl.tpgrf.name");
skl.tpgrf.desc = i18n.t("content.skl.tpgrf.desc");
skl.tpgrf.use = function (x, y) {
  return this.lvl;
};

skl.ptnc = new Skill();
skl.ptnc.id = 154;
skl.ptnc.type = 4;
skl.ptnc.name = i18n.t("content.skl.ptnc.name");
skl.ptnc.desc = i18n.t("content.skl.ptnc.desc");
skl.ptnc.use = function (x, y) {
  return this.lvl;
};

skl.scout = new Skill();
skl.scout.id = 155;
skl.scout.type = 4;
skl.scout.name = i18n.t("content.skl.scout.name");
skl.scout.desc = i18n.t("content.skl.scout.desc");
skl.scout.use = function (x, y) {
  return this.lvl;
};

skl.jdg = new Skill();
skl.jdg.id = 156;
skl.jdg.type = 4;
skl.jdg.name = i18n.t("content.skl.jdg.name");
skl.jdg.desc = i18n.t("content.skl.jdg.desc");
skl.jdg.use = function (x, y) {
  return this.lvl;
};

skl.tlrng = new Skill();
skl.tlrng.id = 157;
skl.tlrng.type = 5;
skl.tlrng.name = i18n.t("content.skl.tlrng.name");
skl.tlrng.desc = i18n.t("content.skl.tlrng.desc");
skl.tlrng.use = function (x, y) {
  giveSkExp(this, x || 1);
  return this.lvl || 1;
};

skl.crptr = new Skill();
skl.crptr.id = 158;
skl.crptr.type = 6;
skl.crptr.name = i18n.t("content.skl.crptr.name");
skl.crptr.sp = ".66em";
skl.crptr.desc =
  i18n.t("content.skl.crptr.desc") +
  dom.dseparator +
  i18n.t("content.skl.crptr.bonus");

skl.hst = new Skill();
skl.hst.id = 159;
skl.hvt.type = 8;
skl.hst.name = i18n.t("content.skl.hst.name");
skl.hst.desc =
  i18n.t("content.skl.hst.desc") +
  dom.dseparator +
  i18n.t("content.skl.hst.bonus");
skl.hst.use = function (x, y) {
  return this.lvl;
};

skl.coldr = new Skill();
skl.coldr.id = 160;
skl.coldr.type = 6;
skl.coldr.name = i18n.t("content.skl.coldr.name");
skl.coldr.sp = ".66em";
skl.coldr.desc =
  i18n.t("content.skl.coldr.desc") +
  dom.dseparator +
  i18n.t("content.skl.coldr.bonus");
skl.coldr.use = function (x, y) {
  return this.lvl * 0.004;
};
