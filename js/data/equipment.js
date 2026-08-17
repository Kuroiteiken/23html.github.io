// Equipment definitions: weapons, armour, shields, and accessories. Each entry
// carries its slot, stat bonuses, damage classes, elemental affinities,
// durability, and the hooks that run when it is equipped or removed. Display
// names and descriptions come from the locale files.

function Eqp() {
  this.name = "nothing";
  this.desc = "";
  this.str = 0;
  this.agl = 0;
  this.int = 0;
  this.spd = 0;
  this.dp = 15;
  this.dpmax = 15;
  this.eff = [];
  this.data = { dscv: false };
  this.cls = [0, 0, 0]; // edge, pierce, blunt
  //this.ccls=[0,0,0];
  this.aff = [0, 0, 0, 0, 0, 0, 0]; //p, a, e, f, w, l, d
  //this.caff = [0,0,0,0,0,0,0];
  //this.maff=[0,0,0,0,0,0,0];
  //this.cmaff=[0,0,0,0,0,0,0];
  this.atype = 0;
  this.ctype = 0;
  this.wtype = 0; // un, srd, axe, knf, spr, hmr, stff
  this.atkmode = 1;
  this.rar = 1;
  this.type = 2;
  this.amount = 1;
  this.stype = 2;
  this.slot = 0;
  this.id = 10000;
  this.important = false;
  this.new = false;
  this.cond = function () {
    return true;
  };
  this.onGet = function () {};
  this.oneq = function () {};
  this.onuneq = function () {};
  this.use = function () {
    equip(this);
  };
}
eqp.dummy = new Eqp();

wpn.stk1 = new Eqp();
wpn.stk1.id = 10001;
wpn.stk1.name = i18n.t("content.wpn.stk1.name");
wpn.stk1.desc = i18n.t("content.wpn.stk1.desc") + dom.dseparator;
wpn.stk1.slot = 1;
wpn.stk1.str = 2;
wpn.stk1.cls = [0, 0, 1];
wpn.stk1.ctype = 2;
wpn.stk1.wtype = 5;
wpn.stk1.dp = wpn.stk1.dpmax = 13;

wpn.stk2 = new Eqp();
wpn.stk2.id = 10002;
wpn.stk2.name = i18n.t("content.wpn.stk2.name");
wpn.stk2.desc = i18n.t("content.wpn.stk2.desc") + dom.dseparator;
wpn.stk2.slot = 1;
wpn.stk2.str = 5;
wpn.stk2.cls = [0, 3, 0];
wpn.stk2.ctype = 1;
wpn.stk2.wtype = 4;
wpn.stk2.dp = wpn.stk2.dpmax = 16;
wpn.stk2.onGet = function () {
  let n = 0;
  for (const a in inv) if (inv[a].id === this.id) n++;
  if (n >= 4) giveRcp(rcp.stksld);
};

wpn.knf1 = new Eqp();
wpn.knf1.id = 10003;
wpn.knf1.name = i18n.t("content.wpn.knf1.name");
wpn.knf1.desc = i18n.t("content.wpn.knf1.desc") + dom.dseparator;
wpn.knf1.slot = 1;
wpn.knf1.str = 4;
wpn.knf1.cls = [0, 0, 2];
wpn.knf1.ctype = 2;
wpn.knf1.wtype = 3;
wpn.knf1.dp = wpn.knf1.dpmax = 31;

wpn.knf2 = new Eqp();
wpn.knf2.id = 10004;
wpn.knf2.name = i18n.t("content.wpn.knf2.name");
wpn.knf2.desc = i18n.t("content.wpn.knf2.desc") + dom.dseparator;
wpn.knf2.slot = 1;
wpn.knf2.str = 7;
wpn.knf2.agl = -1;
wpn.knf2.cls = [3, 2, 1];
wpn.knf2.dp = wpn.knf2.dpmax = 11;
wpn.knf2.wtype = 3;

wpn.ktn1 = new Eqp();
wpn.ktn1.id = 10005;
wpn.ktn1.name = i18n.t("content.wpn.ktn1.name");
wpn.ktn1.desc = i18n.t("content.wpn.ktn1.desc") + dom.dseparator;
wpn.ktn1.slot = 1;
wpn.ktn1.str = 15;
wpn.ktn1.agl = -2;
wpn.ktn1.cls = [4, 1, 2];
wpn.ktn1.dp = wpn.ktn1.dpmax = 21;
wpn.ktn1.wtype = 1;

wpn.ktn2 = new Eqp();
wpn.ktn2.id = 10006;
wpn.ktn2.name = i18n.t("content.wpn.ktn2.name");
wpn.ktn2.desc = i18n.t("content.wpn.ktn2.desc") + dom.dseparator;
wpn.ktn2.slot = 1;
wpn.ktn2.str = 42;
wpn.ktn2.agl = -4;
wpn.ktn2.cls = [5, 3, 2];
wpn.ktn2.dp = wpn.ktn2.dpmax = 17;
wpn.ktn2.wtype = 1;

wpn.trch = new Eqp();
wpn.trch.id = 10007;
wpn.trch.name = i18n.t("content.wpn.trch.name");
wpn.trch.desc =
  i18n.t("content.wpn.trch.desc") +
  dom.dseparator +
  i18n.t("content.wpn.trch.bonus");
wpn.trch.slot = 1;
wpn.trch.str = 2;
wpn.trch.atype = 3;
wpn.trch.aff = [0, 0, 0, 10, 0, 5, 0];
wpn.trch.cls = [0, 0, 3];
wpn.trch.ctype = 2;
wpn.trch.dp = wpn.trch.dpmax = 10;
wpn.trch.degrade = 0.03;
wpn.trch.wtype = 5;
wpn.trch.oneq = function () {
  you.mods.light += 1;
};
wpn.trch.onuneq = function () {
  you.mods.light -= 1;
};
wpn.trch.onDegrade = function () {
  msg(
    i18n.t("runtime.data.equipment.dialogue.your_torch_burned_down_6826c194"),
    "darkgrey",
  );
};

wpn.twg = new Eqp();
wpn.twg.id = 10009;
wpn.twg.name = i18n.t("content.wpn.twg.name");
wpn.twg.desc =
  i18n.t("content.wpn.twg.desc") +
  dom.dseparator +
  i18n.t("content.wpn.twg.bonus");
wpn.twg.slot = 1;
wpn.twg.int = 3;
wpn.twg.cls = [0, 0, 2];
wpn.twg.aff = [0, 1, 0, 0, 0, 3, 5];
wpn.twg.atype = 5;
wpn.twg.atkmode = 2;
wpn.twg.dp = wpn.twg.dpmax = 12;
wpn.twg.wtype = 6;

wpn.dgknf = new Eqp();
wpn.dgknf.id = 10010;
wpn.dgknf.name = i18n.t("content.wpn.dgknf.name");
wpn.dgknf.desc = i18n.t("content.wpn.dgknf.desc") + dom.dseparator;
wpn.dgknf.slot = 1;
wpn.dgknf.str = 11;
wpn.dgknf.cls = [4, 2, 0];
wpn.dgknf.dp = wpn.dgknf.dpmax = 22;
wpn.dgknf.wtype = 3;

wpn.bknf = new Eqp();
wpn.bknf.id = 10011;
wpn.bknf.name = i18n.t("content.wpn.bknf.name");
wpn.bknf.desc = i18n.t("content.wpn.bknf.desc") + dom.dseparator;
wpn.bknf.slot = 1;
wpn.bknf.wtype = 3;

wpn.skknf = new Eqp();
wpn.skknf.id = 10012;
wpn.skknf.name = i18n.t("content.wpn.skknf.name");
wpn.skknf.desc = i18n.t("content.wpn.skknf.desc") + dom.dseparator;
wpn.skknf.slot = 1;
wpn.skknf.wtype = 3;
wpn.skknf.ctype = 1;

wpn.drknf = new Eqp();
wpn.drknf.id = 10013;
wpn.drknf.name = i18n.t("content.wpn.drknf.name");
wpn.drknf.desc = i18n.t("content.wpn.drknf.desc") + dom.dseparator;
wpn.drknf.slot = 1;
wpn.drknf.wtype = 3;

wpn.thknf = new Eqp();
wpn.thknf.id = 10014;
wpn.thknf.name = i18n.t("content.wpn.thknf.name");
wpn.thknf.desc = i18n.t("content.wpn.thknf.desc") + dom.dseparator;
wpn.thknf.slot = 1;
wpn.thknf.wtype = 3;
wpn.thknf.ctype = 1;

wpn.kdknf = new Eqp();
wpn.kdknf.id = 10015;
wpn.kdknf.name = i18n.t("content.wpn.kdknf.name");
wpn.kdknf.desc = i18n.t("content.wpn.kdknf.desc") + dom.dseparator;
wpn.kdknf.slot = 1;
wpn.kdknf.wtype = 3;

wpn.krsnf = new Eqp();
wpn.krsnf.id = 10016;
wpn.krsnf.name = i18n.t("content.wpn.krsnf.name");
wpn.krsnf.desc = i18n.t("content.wpn.krsnf.desc") + dom.dseparator;
wpn.krsnf.slot = 1;
wpn.krsnf.wtype = 3;
wpn.krsnf.ctype = 1;

wpn.cqsnf = new Eqp();
wpn.cqsnf.id = 10017;
wpn.cqsnf.name = i18n.t("content.wpn.cqsnf.name");
wpn.cqsnf.desc = i18n.t("content.wpn.cqsnf.desc") + dom.dseparator;
wpn.cqsnf.slot = 1;
wpn.cqsnf.wtype = 3;
wpn.cqsnf.ctype = 1;

wpn.kkknf = new Eqp();
wpn.kkknf.id = 10018;
wpn.kkknf.name = i18n.t("content.wpn.kkknf.name");
wpn.kkknf.desc = i18n.t("content.wpn.kkknf.desc") + dom.dseparator;
wpn.kkknf.slot = 1;
wpn.kkknf.wtype = 3;

wpn.bdknf = new Eqp();
wpn.bdknf.id = 10019;
wpn.bdknf.name = i18n.t("content.wpn.bdknf.name");
wpn.bdknf.desc = i18n.t("content.wpn.bdknf.desc") + dom.dseparator;
wpn.bdknf.slot = 1;
wpn.bdknf.wtype = 3;

wpn.stknf = new Eqp();
wpn.stknf.id = 10020;
wpn.stknf.name = i18n.t("content.wpn.stknf.name");
wpn.stknf.desc = i18n.t("content.wpn.stknf.desc") + dom.dseparator;
wpn.stknf.slot = 1;
wpn.stknf.wtype = 3;
wpn.stknf.ctype = 1;

wpn.jmknf = new Eqp();
wpn.jmknf.id = 10021;
wpn.jmknf.name = i18n.t("content.wpn.jmknf.name");
wpn.jmknf.desc = i18n.t("content.wpn.jmknf.desc") + dom.dseparator;
wpn.jmknf.slot = 1;
wpn.jmknf.wtype = 3;
wpn.jmknf.ctype = 1;

wpn.skknf = new Eqp();
wpn.skknf.id = 10022;
wpn.skknf.name = i18n.t("content.wpn.skknf.name_2");
wpn.skknf.desc = i18n.t("content.wpn.skknf.desc_2") + dom.dseparator;
wpn.skknf.slot = 1;
wpn.skknf.wtype = 3;

wpn.rbknf = new Eqp();
wpn.rbknf.id = 10023;
wpn.rbknf.name = i18n.t("content.wpn.rbknf.name");
wpn.rbknf.desc = i18n.t("content.wpn.rbknf.desc") + dom.dseparator;
wpn.rbknf.slot = 1;
wpn.rbknf.wtype = 3;

wpn.gaknf = new Eqp();
wpn.gaknf.id = 10024;
wpn.gaknf.name = i18n.t("content.wpn.gaknf.name");
wpn.gaknf.desc = i18n.t("content.wpn.gaknf.desc");
wpn.gaknf.slot = 1;
wpn.gaknf.rar = 3;
wpn.gaknf.wtype = 3;

wpn.ekmw = new Eqp();
wpn.ekmw.id = 10025;
wpn.ekmw.name = i18n.t("content.wpn.ekmw.name");
wpn.ekmw.desc = i18n.t("content.wpn.ekmw.desc") + dom.dseparator;
wpn.ekmw.slot = 1;
wpn.ekmw.ctype = 2;
wpn.ekmw.wtype = 5;

wpn.mnkm = new Eqp();
wpn.mnkm.id = 10026;
wpn.mnkm.name = i18n.t("content.wpn.mnkm.name");
wpn.mnkm.desc = i18n.t("content.wpn.mnkm.desc") + dom.dseparator;
wpn.mnkm.slot = 1;
wpn.mnkm.wtype = 3;

wpn.mkr = new Eqp();
wpn.mkr.id = 10027;
wpn.mkr.name = i18n.t("content.wpn.mkr.name");
wpn.mkr.desc = i18n.t("content.wpn.mkr.desc") + dom.dseparator;
wpn.mkr.slot = 1;
wpn.mkr.wtype = 1;

wpn.wsrd1 = new Eqp();
wpn.wsrd1.id = 10028;
wpn.wsrd1.name = i18n.t("content.wpn.wsrd1.name");
wpn.wsrd1.desc = i18n.t("content.wpn.wsrd1.desc") + dom.dseparator;
wpn.wsrd1.slot = 1;
wpn.wsrd1.str = 7;
wpn.wsrd1.cls = [1, 0, 3];
wpn.wsrd1.dp = wpn.wsrd1.dpmax = 33;
wpn.wsrd1.wtype = 1;
wpn.wsrd1.ctype = 2;

wpn.wsrd2 = new Eqp();
wpn.wsrd2.id = 10029;
wpn.wsrd2.name = i18n.t("content.wpn.wsrd2.name");
wpn.wsrd2.desc = i18n.t("content.wpn.wsrd2.desc") + dom.dseparator;
wpn.wsrd2.slot = 1;
wpn.wsrd2.str = 10;
wpn.wsrd2.cls = [2, 0, 3];
wpn.wsrd2.dp = wpn.wsrd2.dpmax = 41;
wpn.wsrd2.wtype = 1;
wpn.wsrd2.ctype = 2;

wpn.nssrd = new Eqp();
wpn.nssrd.id = 10030;
wpn.nssrd.name = i18n.t("content.wpn.nssrd.name");
wpn.nssrd.desc = i18n.t("content.wpn.nssrd.desc") + dom.dseparator;
wpn.nssrd.slot = 1;
wpn.nssrd.str = 55;
wpn.nssrd.cls = [4, 2, 1];
wpn.nssrd.dp = wpn.nssrd.dpmax = 35;
wpn.nssrd.wtype = 1;

wpn.heyit = new Eqp();
wpn.heyit.id = 10031;
wpn.heyit.name = i18n.t("content.wpn.heyit.name");
wpn.heyit.desc = i18n.t("content.wpn.heyit.desc") + dom.dseparator;

wpn.fksrd = new Eqp();
wpn.fksrd.id = 10032;
wpn.fksrd.name = i18n.t("content.wpn.fksrd.name");
wpn.fksrd.desc = i18n.t("content.wpn.fksrd.desc") + dom.dseparator;
wpn.fksrd.slot = 1;
wpn.fksrd.str = 23;
wpn.fksrd.cls = [2, 0, 4];
wpn.fksrd.dp = wpn.fksrd.dpmax = 33;
wpn.fksrd.wtype = 1;
wpn.fksrd.ctype = 2;

wpn.tkmts = new Eqp();
wpn.tkmts.id = 10033;
wpn.tkmts.name = i18n.t("content.wpn.tkmts.name");
wpn.tkmts.desc = i18n.t("content.wpn.tkmts.desc") + dom.dseparator;
wpn.tkmts.slot = 1;
wpn.tkmts.str = 35;
wpn.tkmts.cls = [2, 1, 5];
wpn.tkmts.dp = wpn.tkmts.dpmax = 40;
wpn.tkmts.wtype = 1;
wpn.tkmts.ctype = 2;

wpn.bsrd = new Eqp();
wpn.bsrd.id = 10034;
wpn.bsrd.name = i18n.t("content.wpn.bsrd.name");
wpn.bsrd.desc = i18n.t("content.wpn.bsrd.desc") + dom.dseparator;
wpn.bsrd.slot = 1;
wpn.bsrd.str = 20;
wpn.bsrd.cls = [2, 3, 3];
wpn.bsrd.dp = wpn.bsrd.dpmax = 38;
wpn.bsrd.wtype = 1;
wpn.bsrd.ctype = 2;

wpn.bdsrd = new Eqp();
wpn.bdsrd.id = 10035;
wpn.bdsrd.name = i18n.t("content.wpn.bdsrd.name");
wpn.bdsrd.desc = i18n.t("content.wpn.bdsrd.desc") + dom.dseparator;
wpn.bdsrd.slot = 1;
wpn.bdsrd.str = 27;
wpn.bdsrd.cls = [2, 3, 3];
wpn.bdsrd.dp = wpn.bdsrd.dpmax = 34;
wpn.bdsrd.wtype = 1;
wpn.bdsrd.ctype = 2;

wpn.bcsrd = new Eqp();
wpn.bcsrd.id = 10036;
wpn.bcsrd.name = i18n.t("content.wpn.bcsrd.name");
wpn.bcsrd.desc = i18n.t("content.wpn.bcsrd.desc") + dom.dseparator;
wpn.bcsrd.slot = 1;
wpn.bcsrd.str = 40;
wpn.bcsrd.cls = [4, 3, 3];
wpn.bcsrd.dp = wpn.bcsrd.dpmax = 34;
wpn.bcsrd.wtype = 1;

wpn.ktsk = new Eqp();
wpn.ktsk.id = 10037; //2
wpn.ktsk.name = i18n.t("content.wpn.ktsk.name");
wpn.ktsk.desc = i18n.t("content.wpn.ktsk.desc") + dom.dseparator;

wpn.crsto = new Eqp();
wpn.crsto.id = 10038; //3
wpn.crsto.name = i18n.t("content.wpn.crsto.name");
wpn.crsto.desc = i18n.t("content.wpn.crsto.desc") + dom.dseparator;

wpn.ksbmr = new Eqp();
wpn.ksbmr.id = 10039; //4
wpn.ksbmr.name = i18n.t("content.wpn.ksbmr.name");
wpn.ksbmr.desc = i18n.t("content.wpn.ksbmr.desc") + dom.dseparator;

wpn.hsmts = new Eqp();
wpn.hsmts.id = 10040; //5
wpn.hsmts.name = i18n.t("content.wpn.hsmts.name");
wpn.hsmts.desc = i18n.t("content.wpn.hsmts.desc") + dom.dseparator;

wpn.kiknif = new Eqp();
wpn.kiknif.id = 10041;
wpn.kiknif.name = i18n.t("content.wpn.kiknif.name");
wpn.kiknif.desc =
  i18n.t("content.wpn.kiknif.desc") +
  dom.dseparator +
  i18n.t("content.wpn.kiknif.bonus");
wpn.kiknif.slot = 1;
wpn.kiknif.str = 24;
wpn.kiknif.cls = [3, 2, 0];
wpn.kiknif.dp = wpn.kiknif.dpmax = 15;
wpn.kiknif.wtype = 3;
wpn.kiknif.oneq = function () {
  skl.cook.p += 0.15;
};
wpn.kiknif.onuneq = function () {
  skl.cook.p -= 0.15;
};

wpn.gamas = new Eqp();
wpn.gamas.id = 10042; //6
wpn.gamas.name = i18n.t("content.wpn.gamas.name");
wpn.gamas.desc = i18n.t("content.wpn.gamas.desc") + dom.dseparator;

wpn.wsdmbld = new Eqp();
wpn.wsdmbld.id = 10043; //7
wpn.wsdmbld.name = i18n.t("content.wpn.wsdmbld.name");
wpn.wsdmbld.desc = i18n.t("content.wpn.wsdmbld.desc") + dom.dseparator;

wpn.kurum = new Eqp();
wpn.kurum.id = 10044; //8
wpn.kurum.name = i18n.t("content.wpn.kurum.name");
wpn.kurum.desc = i18n.t("content.wpn.kurum.desc") + dom.dseparator;

wpn.hrsm = new Eqp();
wpn.hrsm.id = 10045; //9 ice
wpn.hrsm.name = i18n.t("content.wpn.hrsm.name");
wpn.hrsm.desc = i18n.t("content.wpn.hrsm.desc") + dom.dseparator;

wpn.kosgi = new Eqp();
wpn.kosgi.id = 10046; //10
wpn.kosgi.name = i18n.t("content.wpn.kosgi.name");
wpn.kosgi.desc = i18n.t("content.wpn.kosgi.desc") + dom.dseparator;

wpn.shiran = new Eqp();
wpn.shiran.id = 10047; //11
wpn.shiran.name = i18n.t("content.wpn.shiran.name");
wpn.shiran.desc = i18n.t("content.wpn.shiran.desc") + dom.dseparator;

wpn.shnztt = new Eqp();
wpn.shnztt.id = 10048; //12
wpn.shnztt.name = i18n.t("content.wpn.shnztt.name");
wpn.shnztt.desc = i18n.t("content.wpn.shnztt.desc") + dom.dseparator;

wpn.lsrd = new Eqp();
wpn.lsrd.id = 10049;
wpn.lsrd.name = i18n.t("content.wpn.lsrd.name");
wpn.lsrd.desc = i18n.t("content.wpn.lsrd.desc") + dom.dseparator;
wpn.lsrd.slot = 1;
wpn.lsrd.wtype = 1;

wpn.log = new Eqp();
wpn.log.id = 10050;
wpn.log.name = i18n.t("content.wpn.log.name");
wpn.log.desc = i18n.t("content.wpn.log.desc") + dom.dseparator;
wpn.log.slot = 1;
wpn.log.twoh = true;
wpn.log.str = 48;
wpn.log.cls = [-5, -5, 6];
wpn.log.agl = -15;
wpn.log.ctype = 2;
wpn.log.wtype = 5;
wpn.log.dp = wpn.log.dpmax = 68;

wpn.sprw = new Eqp();
wpn.sprw.id = 10051;
wpn.sprw.name = i18n.t("content.wpn.sprw.name");
wpn.sprw.desc = i18n.t("content.wpn.sprw.desc") + dom.dseparator;
wpn.sprw.slot = 1;
wpn.sprw.str = 11;
wpn.sprw.cls = [2, 4, 1];
wpn.sprw.ctype = 1;
wpn.sprw.wtype = 4;
wpn.sprw.dp = wpn.sprw.dpmax = 26;

wpn.gsprw = new Eqp();
wpn.gsprw.id = 10052;
wpn.gsprw.name = i18n.t("content.wpn.gsprw.name");
wpn.gsprw.desc = i18n.t("content.wpn.gsprw.desc") + dom.dseparator;
wpn.gsprw.slot = 1;
wpn.gsprw.str = 27;
wpn.gsprw.cls = [2, 5, 2];
wpn.gsprw.ctype = 1;
wpn.gsprw.wtype = 4;
wpn.gsprw.dp = wpn.gsprw.dpmax = 44;

wpn.scspt1 = new Eqp();
wpn.scspt1.id = 10053;
wpn.scspt1.name = i18n.t("content.wpn.scspt1.name");
wpn.scspt1.desc =
  i18n.t("content.wpn.scspt1.desc") +
  dom.dseparator +
  i18n.t("content.wpn.scspt1.bonus");
wpn.scspt1.slot = 1;
wpn.scspt1.str = 54;
wpn.scspt1.cls = [10, 7, 3];
wpn.scspt1.aff = [0, 0, 0, 25, -35, 0, 0];
wpn.scspt1.dp = wpn.scspt1.dpmax = 75;
wpn.scspt1.wtype = 1;
wpn.scspt1.atype = 3;
wpn.scspt1.rar = 3;

wpn.scspt2 = new Eqp();
wpn.scspt2.id = 10054;
wpn.scspt2.name = i18n.t("content.wpn.scspt2.name");
wpn.scspt2.desc =
  i18n.t("content.wpn.scspt2.desc") +
  dom.dseparator +
  i18n.t("content.wpn.scspt2.bonus");
wpn.scspt2.slot = 1;
wpn.scspt2.str = 52;
wpn.scspt2.cls = [11, 8, 5];
wpn.scspt2.aff = [0, 0, 0, -35, 25, 0, 0];
wpn.scspt2.dp = wpn.scspt2.dpmax = 65;
wpn.scspt2.wtype = 1;
wpn.scspt2.atype = 4;
wpn.scspt2.rar = 3;

wpn.scspt3 = new Eqp();
wpn.scspt3.id = 10055;
wpn.scspt3.name = i18n.t("content.wpn.scspt3.name");
wpn.scspt3.desc =
  i18n.t("content.wpn.scspt3.desc") +
  dom.dseparator +
  i18n.t("content.wpn.scspt3.bonus");
wpn.scspt3.slot = 1;
wpn.scspt3.twoh = true;
wpn.scspt3.str = 108;
wpn.scspt3.cls = [15, 12, 6];
wpn.scspt3.aff = [0, 0, 0, 15, 15, -5, 30];
wpn.scspt3.dp = wpn.scspt3.dpmax = 99;
wpn.scspt3.wtype = 1;
wpn.scspt3.atype = 6;
wpn.scspt3.rar = 4;

wpn.shrsb = new Eqp();
wpn.shrsb.id = 10056;
wpn.shrsb.name = i18n.t("content.wpn.shrsb.name");
wpn.shrsb.desc = i18n.t("content.wpn.shrsb.desc") + dom.dseparator;
wpn.shrsb.slot = 1;
wpn.shrsb.twoh = true;
wpn.shrsb.str = 40;
wpn.shrsb.agl = -11;
wpn.shrsb.cls = [8, 5, 1];
wpn.shrsb.dp = wpn.shrsb.dpmax = 45;
wpn.shrsb.wtype = 3;

wpn.evob = new Eqp();
wpn.evob.id = 10057;
wpn.evob.name = i18n.t("content.wpn.evob.name");
wpn.evob.desc = i18n.t("content.wpn.evob.desc") + dom.dseparator;
wpn.evob.slot = 1;
wpn.evob.str = 1;
wpn.evob.rar = 4;
wpn.evob.dp = wpn.evob.dpmax = 30;
wpn.evob.wtype = 1;
wpn.evob.oneq = function () {
  attachCallback(callback.onDeath, {
    f(victim, killer) {
      you.eqp[0].str += victim.str * 0.00005;
      you.eqp[0].agl += victim.agl * 0.000003;
      you.eqp[0].int += victim.int * 0.000001;
      const d = victim.lvl * 0.001 ** (1 + victim.rnk * 0.01);
      you.eqp[0].dp += d;
      you.eqp[0].dpmax += d;
    },
    id: 10057,
    data: { q: true },
  });
};
wpn.evob.onuneq = function () {
  detachCallback(callback.onDeath, 10057);
};

wpn.mkrdwk = new Eqp();
wpn.mkrdwk.id = 10058;
wpn.mkrdwk.name = i18n.t("content.wpn.mkrdwk.name");
wpn.mkrdwk.desc = i18n.t("content.wpn.mkrdwk.desc") + dom.dseparator;
wpn.mkrdwk.slot = 1;
wpn.mkrdwk.important = true;
wpn.mkrdwk.rar = 2;
wpn.mkrdwk.str = 40;
wpn.mkrdwk.cls = [4, 3, 2];
wpn.mkrdwk.dp = wpn.mkrdwk.dpmax = 48;
wpn.mkrdwk.wtype = 1;

eqp.bnd = new Eqp();
eqp.bnd.id = 20001;
eqp.bnd.name = i18n.t("content.eqp.bnd.name");
eqp.bnd.desc = i18n.t("content.eqp.bnd.desc") + dom.dseparator;
eqp.bnd.slot = 3;
eqp.bnd.str = 3;
eqp.bnd.agl = 1;
eqp.bnd.aff = [1, 0, 1, 4, -2, 0, 0];
eqp.bnd.cls = [1, 0, 2];
eqp.bnd.stype = 3;
eqp.bnd.dp = eqp.bnd.dpmax = 11;

eqp.pnt = new Eqp();
eqp.pnt.id = 20002;
eqp.pnt.name = i18n.t("content.eqp.pnt.name");
eqp.pnt.desc = i18n.t("content.eqp.pnt.desc") + dom.dseparator;
eqp.pnt.slot = 7;
eqp.pnt.str = 4;
eqp.pnt.agl = 2;
eqp.pnt.aff = [2, 0, 3, 4, -1, 0, 0];
eqp.pnt.cls = [2, 1, 1];
eqp.pnt.stype = 3;
eqp.pnt.dp = eqp.pnt.dpmax = 19;

eqp.brc = new Eqp();
eqp.brc.id = 20003;
eqp.brc.name = i18n.t("content.eqp.brc.name");
eqp.brc.desc = i18n.t("content.eqp.brc.desc") + dom.dseparator;
eqp.brc.slot = 5;
eqp.brc.str = 2;
eqp.brc.agl = 1;
eqp.brc.int = 3;
eqp.brc.aff = [0, 0, 0, 0, 0, 0, 0];
eqp.brc.cls = [1, 0, 1];
eqp.brc.stype = 3;
eqp.brc.dp = eqp.brc.dpmax = 11;

eqp.gnt = new Eqp();
eqp.gnt.id = 20004;
eqp.gnt.name = i18n.t("content.eqp.gnt.name");
eqp.gnt.desc = i18n.t("content.eqp.gnt.desc") + dom.dseparator;
eqp.gnt.slot = 5;
eqp.gnt.str = 10;
eqp.gnt.stype = 3;
eqp.gnt.aff = [2, 1, 3, 3, 2, 2, 1];
eqp.gnt.cls = [3, 2, 4];
eqp.gnt.dp = eqp.gnt.dpmax = 24;

eqp.vst = new Eqp();
eqp.vst.id = 20005;
eqp.vst.name = i18n.t("content.eqp.vst.name");
eqp.vst.desc = i18n.t("content.eqp.vst.desc") + dom.dseparator;
eqp.vst.slot = 4;
eqp.vst.str = 6;
eqp.vst.stype = 3;
eqp.vst.aff = [1, 0, 0, 0, 0, 1, 0];
eqp.vst.cls = [3, 1, 1];
eqp.vst.dp = eqp.vst.dpmax = 23;

eqp.thd = new Eqp();
eqp.thd.id = 20006;
eqp.thd.name = i18n.t("content.eqp.thd.name");
eqp.thd.desc = i18n.t("content.eqp.thd.desc");
eqp.thd.slot = 3;
eqp.thd.stype = 3;

eqp.amsk = new Eqp();
eqp.amsk.id = 20007;
eqp.amsk.name = i18n.t("content.eqp.amsk.name");
eqp.amsk.desc = i18n.t("content.eqp.amsk.desc");
eqp.amsk.slot = 3;
eqp.amsk.stype = 3;
eqp.amsk.caff = [1, 0, 0, 20, 0, 0, 0];
eqp.amsk.cls = [5, 5, 5];
eqp.amsk.rar = 2;
eqp.amsk.dp = eqp.amsk.dpmax = 30;
eqp.amsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
  // The fire it symbolises, on the offensive side. Equipment contributions are
  // re-derived on load rather than stored, since save() unequips first, so this
  // cannot accumulate across reloads.
  skl.abf.p += 0.15;
};
eqp.amsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
  skl.abf.p -= 0.15;
};

eqp.bmsk = new Eqp();
eqp.bmsk.id = 20008;
eqp.bmsk.name = i18n.t("content.eqp.bmsk.name");
eqp.bmsk.desc = i18n.t("content.eqp.bmsk.desc");
eqp.bmsk.slot = 3;
eqp.bmsk.stype = 3;
eqp.bmsk.caff = [1, 0, 0, 0, 20, 0, 0];
eqp.bmsk.cls = [5, 5, 5];
eqp.bmsk.rar = 2;
eqp.bmsk.dp = eqp.bmsk.dpmax = 30;
eqp.bmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
  // The water it symbolises, on the offensive side. Equipment contributions are
  // re-derived on load rather than stored, since save() unequips first, so this
  // cannot accumulate across reloads.
  skl.abw.p += 0.15;
};
eqp.bmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
  skl.abw.p -= 0.15;
};

eqp.cmsk = new Eqp();
eqp.cmsk.id = 20009;
eqp.cmsk.name = i18n.t("content.eqp.cmsk.name");
eqp.cmsk.desc = i18n.t("content.eqp.cmsk.desc");
eqp.cmsk.slot = 3;
eqp.cmsk.stype = 3;
eqp.cmsk.caff = [1, 20, 0, 0, 0, 0, 0];
eqp.cmsk.cls = [5, 5, 5];
eqp.cmsk.rar = 2;
eqp.cmsk.dp = eqp.cmsk.dpmax = 30;
eqp.cmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
  // The wind it symbolises, on the offensive side. Equipment contributions are
  // re-derived on load rather than stored, since save() unequips first, so this
  // cannot accumulate across reloads.
  skl.aba.p += 0.15;
};
eqp.cmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
  skl.aba.p -= 0.15;
};

eqp.dmsk = new Eqp();
eqp.dmsk.id = 20010;
eqp.dmsk.name = i18n.t("content.eqp.dmsk.name");
eqp.dmsk.desc = i18n.t("content.eqp.dmsk.desc");
eqp.dmsk.slot = 3;
eqp.dmsk.stype = 3;
eqp.dmsk.caff = [1, 0, 20, 0, 0, 0, 0];
eqp.dmsk.cls = [5, 5, 5];
eqp.dmsk.rar = 2;
eqp.dmsk.dp = eqp.dmsk.dpmax = 30;
eqp.dmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
  // The earth it symbolises, on the offensive side. Equipment contributions are
  // re-derived on load rather than stored, since save() unequips first, so this
  // cannot accumulate across reloads.
  skl.abe.p += 0.15;
};
eqp.dmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
  skl.abe.p -= 0.15;
};

eqp.emsk = new Eqp();
eqp.emsk.id = 20011;
eqp.emsk.name = i18n.t("content.eqp.emsk.name");
eqp.emsk.desc = i18n.t("content.eqp.emsk.desc");
eqp.emsk.slot = 3;
eqp.emsk.stype = 3;
eqp.emsk.caff = [1, 0, 0, 0, 0, 20, 0];
eqp.emsk.cls = [5, 5, 5];
eqp.emsk.rar = 2;
eqp.emsk.dp = eqp.emsk.dpmax = 30;
eqp.emsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
  // The light it symbolises, on the offensive side. Equipment contributions are
  // re-derived on load rather than stored, since save() unequips first, so this
  // cannot accumulate across reloads.
  skl.abl.p += 0.15;
};
eqp.emsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
  skl.abl.p -= 0.15;
};

eqp.fmsk = new Eqp();
eqp.fmsk.id = 20012;
eqp.fmsk.name = i18n.t("content.eqp.fmsk.name");
eqp.fmsk.desc = i18n.t("content.eqp.fmsk.desc");
eqp.fmsk.slot = 3;
eqp.fmsk.stype = 3;
eqp.fmsk.caff = [1, 0, 0, 0, 0, 0, 20];
eqp.fmsk.cls = [5, 5, 5];
eqp.fmsk.rar = 2;
eqp.fmsk.dp = eqp.fmsk.dpmax = 30;
eqp.fmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
  // The dark it symbolises, on the offensive side. Equipment contributions are
  // re-derived on load rather than stored, since save() unequips first, so this
  // cannot accumulate across reloads.
  skl.abd.p += 0.15;
};
eqp.fmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
  skl.abd.p -= 0.15;
};

eqp.nkgd = new Eqp();
eqp.nkgd.id = 20013;
eqp.nkgd.name = i18n.t("content.eqp.nkgd.name");
eqp.nkgd.desc = i18n.t("content.eqp.nkgd.desc") + dom.dseparator;
eqp.nkgd.str = 7;
eqp.nkgd.slot = 3;
eqp.nkgd.stype = 3;
eqp.nkgd.aff = [3, -3, -3, -3, -3, -3, -3];
eqp.nkgd.cls = [4, 4, 4];
eqp.nkgd.dp = eqp.nkgd.dpmax = 35;

eqp.sndl = new Eqp();
eqp.sndl.id = 20014;
eqp.sndl.name = i18n.t("content.eqp.sndl.name");
eqp.sndl.desc = i18n.t("content.eqp.sndl.desc") + dom.dseparator;
eqp.sndl.slot = 7;
eqp.sndl.str = 3;
eqp.sndl.agl = 1;
eqp.sndl.aff = [2, 0, 2, 3, -1, 0, 0];
eqp.sndl.cls = [1, 1, 1];
eqp.sndl.stype = 3;
eqp.sndl.dp = eqp.sndl.dpmax = 12;

eqp.ykkr = new Eqp();
eqp.ykkr.id = 20015;
eqp.ykkr.name = i18n.t("content.eqp.ykkr.name");
eqp.ykkr.desc = i18n.t("content.eqp.ykkr.desc") + dom.dseparator;
eqp.ykkr.slot = 7;
eqp.ykkr.str = 11;
eqp.ykkr.agl = 2;
eqp.ykkr.aff = [3, 5, 15, 7, 3, 0, 0];
eqp.ykkr.cls = [5, 4, 8];
eqp.ykkr.stype = 3;
eqp.ykkr.dp = eqp.ykkr.dpmax = 22;

eqp.tnc = new Eqp();
eqp.tnc.id = 20016;
eqp.tnc.name = i18n.t("content.eqp.tnc.name");
eqp.tnc.desc = i18n.t("content.eqp.tnc.desc") + dom.dseparator;
eqp.tnc.slot = 4;
eqp.tnc.str = 9;
eqp.tnc.stype = 3;
eqp.tnc.aff = [2, 1, -1, 1, 1, 5, 0];
eqp.tnc.cls = [2, 2, 3];
eqp.tnc.dp = eqp.tnc.dpmax = 26;

eqp.rncp = new Eqp();
eqp.rncp.id = 20017;
eqp.rncp.name = i18n.t("content.eqp.rncp.name");
eqp.rncp.desc = i18n.t("content.eqp.rncp.desc") + dom.dseparator;
eqp.rncp.slot = 3;
eqp.rncp.str = 9;
eqp.rncp.aff = [2, 3, 2, 5, 14, 5, -5];
eqp.rncp.cls = [3, 2, 2];
eqp.rncp.stype = 3;
eqp.rncp.dp = eqp.rncp.dpmax = 17;

eqp.rnss = new Eqp();
eqp.rnss.id = 20018;
eqp.rnss.name = i18n.t("content.eqp.rnss.name");
eqp.rnss.desc = i18n.t("content.eqp.rnss.desc") + dom.dseparator;
eqp.rnss.slot = 7;
eqp.rnss.str = 9;
eqp.rnss.agl = 2;
eqp.rnss.aff = [4, 5, 10, 9, 14, 1, 0];
eqp.rnss.cls = [3, 7, 5];
eqp.rnss.stype = 3;
eqp.rnss.dp = eqp.rnss.dpmax = 22;

eqp.hkgd = new Eqp();
eqp.hkgd.id = 20019;
eqp.hkgd.name = i18n.t("content.eqp.hkgd.name");
eqp.hkgd.desc = i18n.t("content.eqp.hkgd.desc") + dom.dseparator;
eqp.hkgd.str = 14;
eqp.hkgd.slot = 3;
eqp.hkgd.stype = 3;
eqp.hkgd.aff = [5, -4, -4, -4, -4, -4, -1];
eqp.hkgd.cls = [5, 5, 7];
eqp.hkgd.dp = eqp.hkgd.dpmax = 28;

eqp.wkss = new Eqp();
eqp.wkss.id = 20020;
eqp.wkss.name = i18n.t("content.eqp.wkss.name");
eqp.wkss.desc = i18n.t("content.eqp.wkss.desc") + dom.dseparator;
eqp.wkss.slot = 7;
eqp.wkss.str = 16;
eqp.wkss.agl = 2;
eqp.wkss.aff = [7, 12, 8, 7, 8, 1, 2];
eqp.wkss.cls = [5, 4, 6];
eqp.wkss.stype = 3;
eqp.wkss.dp = eqp.wkss.dpmax = 22;

eqp.jhmt = new Eqp();
eqp.jhmt.id = 20021;
eqp.jhmt.name = i18n.t("content.eqp.jhmt.name");
eqp.jhmt.desc = i18n.t("content.eqp.jhmt.desc") + dom.dseparator;
eqp.jhmt.str = 18;
eqp.jhmt.slot = 3;
eqp.jhmt.stype = 3;
eqp.jhmt.aff = [8, -5, -5, -5, -5, -5, -5];
eqp.jhmt.cls = [8, 8, 8];
eqp.jhmt.dp = eqp.jhmt.dpmax = 28;

eqp.knkn = new Eqp();
eqp.knkn.id = 20022;
eqp.knkn.name = i18n.t("content.eqp.knkn.name");
eqp.knkn.desc = i18n.t("content.eqp.knkn.desc") + dom.dseparator;
eqp.knkn.slot = 7;
eqp.knkn.str = 19;
eqp.knkn.agl = 2;
eqp.knkn.aff = [3, 4, 7, 15, 10, 3, 2];
eqp.knkn.cls = [3, 3, 3];
eqp.knkn.stype = 3;
eqp.knkn.dp = eqp.knkn.dpmax = 32;

eqp.brbn = new Eqp();
eqp.brbn.id = 20023;
eqp.brbn.name = i18n.t("content.eqp.brbn.name");
eqp.brbn.desc = i18n.t("content.eqp.brbn.desc") + dom.dseparator;
eqp.brbn.slot = 4;
eqp.brbn.str = 33;
eqp.brbn.agl = -4;
eqp.brbn.stype = 3;
eqp.brbn.aff = [4, 7, 5, 19, 21, -15, 15];
eqp.brbn.cls = [8, 5, 8];
eqp.brbn.dp = eqp.brbn.dpmax = 41;

eqp.ovrl = new Eqp();
eqp.ovrl.id = 20024;
eqp.ovrl.name = i18n.t("content.eqp.ovrl.name");
eqp.ovrl.desc = i18n.t("content.eqp.ovrl.desc") + dom.dseparator;
eqp.ovrl.slot = 4;
eqp.ovrl.str = 25;
eqp.ovrl.stype = 3;
eqp.ovrl.aff = [6, 6, 5, 9, 8, 9, 3];
eqp.ovrl.cls = [8, 8, 8];
eqp.ovrl.dp = eqp.ovrl.dpmax = 33;

eqp.prsnu = new Eqp();
eqp.prsnu.id = 20025;
eqp.prsnu.name = i18n.t("content.eqp.prsnu.name");
eqp.prsnu.desc = i18n.t("content.eqp.prsnu.desc") + dom.dseparator;
eqp.prsnu.slot = 4;
eqp.prsnu.str = 40;
eqp.prsnu.stype = 3;
eqp.prsnu.aff = [9, 6, 5, 9, 8, 9, 3];
eqp.prsnu.cls = [10, 10, 5];
eqp.prsnu.dp = eqp.prsnu.dpmax = 38;

eqp.prsna = new Eqp();
eqp.prsna.id = 20026;
eqp.prsna.name = i18n.t("content.eqp.prsna.name");
eqp.prsna.desc = i18n.t("content.eqp.prsna.desc") + dom.dseparator;
eqp.prsna.slot = 4;
eqp.prsna.rar = 2;
eqp.prsna.str = 44;
eqp.prsna.agl = 5;
eqp.prsna.stype = 3;
eqp.prsna.aff = [9, 7, 8, 9, 8, 9, 3];
eqp.prsna.cls = [10, 10, 10];
eqp.prsna.dp = eqp.prsna.dpmax = 38;

eqp.strwks = new Eqp();
eqp.strwks.id = 20027;
eqp.strwks.name = i18n.t("content.eqp.strwks.name");
eqp.strwks.desc = i18n.t("content.eqp.strwks.desc") + dom.dseparator;
eqp.strwks.slot = 3;
eqp.strwks.str = 6;
eqp.strwks.aff = [3, 3, 2, 13, 2, 5, -5];
eqp.strwks.cls = [2, 1, 1];
eqp.strwks.stype = 3;
eqp.strwks.dp = eqp.strwks.dpmax = 18;

eqp.knkls = new Eqp();
eqp.knkls.id = 20028;
eqp.knkls.name = i18n.t("content.eqp.knkls.name");
eqp.knkls.desc =
  i18n.t("content.eqp.knkls.desc") +
  dom.dseparator +
  i18n.t("content.eqp.knkls.bonus");
eqp.knkls.slot = 5;
eqp.knkls.str = 4;
eqp.knkls.undc = 4;
eqp.knkls.aff = [1, 0, 0, 0, 0, 0, 0];
eqp.knkls.cls = [2, 1, 1];
eqp.knkls.stype = 3;
eqp.knkls.dp = eqp.knkls.dpmax = 17;
eqp.knkls.oneq = function () {
  you.mods.undc += this.undc;
};
eqp.knkls.onuneq = function () {
  you.mods.undc -= this.undc;
};

eqp.reedhd = new Eqp();
eqp.reedhd.id = 20029;
eqp.reedhd.name = i18n.t("content.eqp.reedhd.name");
eqp.reedhd.desc = i18n.t("content.eqp.reedhd.desc") + dom.dseparator;
eqp.reedhd.slot = 3;
eqp.reedhd.str = 25;
eqp.reedhd.aff = [4, 1, 7, 13, 2, 9, -5];
eqp.reedhd.cls = [3, 3, 3];
eqp.reedhd.stype = 3;
eqp.reedhd.dp = eqp.reedhd.dpmax = 28;

eqp.ptchct = new Eqp();
eqp.ptchct.id = 20030;
eqp.ptchct.name = i18n.t("content.eqp.ptchct.name");
eqp.ptchct.desc = i18n.t("content.eqp.ptchct.desc") + dom.dseparator;
eqp.ptchct.slot = 4;
eqp.ptchct.str = 14;
eqp.ptchct.stype = 3;
eqp.ptchct.aff = [4, 2, 1, 2, 2, 3, 3];
eqp.ptchct.cls = [1, 4, 4];
eqp.ptchct.dp = eqp.ptchct.dpmax = 40;

eqp.ptchpts = new Eqp();
eqp.ptchpts.id = 20031;
eqp.ptchpts.name = i18n.t("content.eqp.ptchpts.name");
eqp.ptchpts.desc = i18n.t("content.eqp.ptchpts.desc") + dom.dseparator;
eqp.ptchpts.slot = 7;
eqp.ptchpts.str = 12;
eqp.ptchpts.stype = 3;
eqp.ptchpts.aff = [3, 2, 8, 4, 5, 5, 2];
eqp.ptchpts.cls = [3, 5, 5];
eqp.ptchpts.dp = eqp.ptchpts.dpmax = 38;

sld.bkl = new Eqp();
sld.bkl.id = 30001;
sld.bkl.name = i18n.t("content.sld.bkl.name");
sld.bkl.desc = i18n.t("content.sld.bkl.desc") + dom.dseparator;
sld.bkl.slot = 2;
sld.bkl.str = 5;
sld.bkl.aff = [2, 2, 2, 2, 2, 2, 2];
sld.bkl.cls = [2, 2, 2];
sld.bkl.stype = 3;
sld.bkl.dp = sld.bkl.dpmax = 36;

sld.tge = new Eqp();
sld.tge.id = 30002;
sld.tge.name = i18n.t("content.sld.tge.name");
sld.tge.desc = i18n.t("content.sld.tge.desc") + dom.dseparator;
sld.tge.slot = 2;
sld.tge.str = 9;
sld.tge.aff = [4, 3, 3, 3, 3, 3, 3];
sld.tge.cls = [3, 3, 4];
sld.tge.stype = 3;
sld.tge.dp = sld.tge.dpmax = 38;

sld.plt = new Eqp();
sld.plt.id = 30003;
sld.plt.name = i18n.t("content.sld.plt.name");
sld.plt.desc = i18n.t("content.sld.plt.desc");
sld.plt.slot = 2;
sld.plt.str = 15;
sld.plt.aff = [8, 6, 5, 4, 5, 3, 3];
sld.plt.cls = [5, 5, 5];
sld.plt.stype = 3;
sld.plt.dp = sld.plt.dpmax = 41;

sld.qad = new Eqp();
sld.qad.id = 30004;
sld.qad.name = i18n.t("content.sld.qad.name");
sld.qad.desc = i18n.t("content.sld.qad.desc") + dom.dseparator;
sld.qad.slot = 2;
sld.qad.str = 10;
sld.qad.aff = [6, 4, 4, 3, 4, 2, 2];
sld.qad.cls = [4, 4, 3];
sld.qad.dp = sld.qad.dpmax = 34;
sld.qad.stype = 3;

sld.crc = new Eqp();
sld.crc.id = 30005;
sld.crc.name = i18n.t("content.sld.crc.name");
sld.crc.desc = i18n.t("content.sld.crc.desc") + dom.dseparator;
sld.crc.slot = 2;
sld.crc.str = 11;
sld.crc.aff = [6, 5, 4, 3, 4, 2, 2];
sld.crc.cls = [4, 4, 4];
sld.crc.dp = sld.crc.dpmax = 36;
sld.crc.stype = 3;

sld.rnd = new Eqp();
sld.rnd.id = 30006;
sld.rnd.name = i18n.t("content.sld.rnd.name");
sld.rnd.desc = i18n.t("content.sld.rnd.desc") + dom.dseparator;
sld.rnd.slot = 2;
sld.rnd.str = 12;
sld.rnd.aff = [7, 5, 4, 3, 4, 2, 2];
sld.rnd.cls = [5, 4, 4];
sld.rnd.dp = sld.rnd.dpmax = 37;
sld.rnd.stype = 3;

sld.twr = new Eqp();
sld.twr.id = 30007;
sld.twr.name = i18n.t("content.sld.twr.name");
sld.twr.desc = i18n.t("content.sld.twr.desc") + dom.dseparator;
sld.twr.slot = 2;
sld.twr.str = 17;
sld.twr.aff = [11, 7, 6, 5, 6, 3, 3];
sld.twr.cls = [7, 7, 6];
sld.twr.dp = sld.twr.dpmax = 46;
sld.twr.stype = 3;

sld.spk = new Eqp();
sld.spk.id = 30008;
sld.spk.name = i18n.t("content.sld.spk.name");
sld.spk.desc = i18n.t("content.sld.spk.desc") + dom.dseparator;
sld.spk.slot = 2;
sld.spk.str = 13;
sld.spk.aff = [8, 5, 4, 3, 4, 2, 2];
sld.spk.cls = [5, 6, 4];
sld.spk.dp = sld.spk.dpmax = 36;
sld.spk.stype = 3;

sld.kit = new Eqp();
sld.kit.id = 30009;
sld.kit.name = i18n.t("content.sld.kit.name");
sld.kit.desc = i18n.t("content.sld.kit.desc") + dom.dseparator;
sld.kit.slot = 2;
sld.kit.str = 14;
sld.kit.aff = [8, 6, 5, 4, 5, 2, 2];
sld.kit.cls = [6, 6, 4];
sld.kit.dp = sld.kit.dpmax = 40;
sld.kit.stype = 3;

// Declared as a second `sld.kit` with id 30010, so it overwrote the Kite Shield
// above and never existed. It is its own shield: the lid of a cooking pot, and the
// only comic one in the set.
sld.csr = new Eqp();
sld.csr.id = 30010;
sld.csr.name = i18n.t("content.sld.kit.name_2");
sld.csr.desc = i18n.t("content.sld.kit.desc_2") + dom.dseparator;
sld.csr.slot = 2;
sld.csr.stype = 3;
sld.csr.str = 4;
sld.csr.aff = [1, 1, 1, 4, 1, 0, 0];
sld.csr.cls = [1, 1, 3];
sld.csr.dp = sld.csr.dpmax = 12;

sld.htr = new Eqp();
sld.htr.id = 30011;
sld.htr.name = i18n.t("content.sld.htr.name");
sld.htr.desc = i18n.t("content.sld.htr.desc") + dom.dseparator;
sld.htr.slot = 2;
sld.htr.str = 16;
sld.htr.aff = [9, 6, 5, 4, 5, 3, 3];
sld.htr.cls = [7, 6, 5];
sld.htr.dp = sld.htr.dpmax = 42;
sld.htr.stype = 3;

sld.ovl = new Eqp();
sld.ovl.id = 30012;
sld.ovl.name = i18n.t("content.sld.ovl.name");
sld.ovl.desc = i18n.t("content.sld.ovl.desc") + dom.dseparator;
sld.ovl.slot = 2;
sld.ovl.str = 12;
sld.ovl.aff = [7, 5, 5, 3, 4, 2, 2];
sld.ovl.cls = [5, 5, 4];
sld.ovl.dp = sld.ovl.dpmax = 38;
sld.ovl.stype = 3;

// The three shields below are the dojo's level 35, 45 and 50 rewards. They shipped
// as bare stubs -- rarity 4 and nothing else -- so a player who reached level 35
// was handed a rare shield that defended exactly as well as an empty hand. They are
// statted here on the ladder the finished shields already establish: Buckler 5,
// Stake Shield 7, Targe 9, Pelta 15.
sld.knt = new Eqp();
sld.knt.id = 30013;
sld.knt.name = i18n.t("content.sld.knt.name");
sld.knt.desc = i18n.t("content.sld.knt.desc") + dom.dseparator;
sld.knt.rar = 4;
sld.knt.slot = 2;
sld.knt.str = 21;
sld.knt.aff = [12, 6, 7, 7, 6, 3, 3];
sld.knt.cls = [8, 7, 7];
sld.knt.stype = 3;
sld.knt.dp = sld.knt.dpmax = 50;

sld.hpt = new Eqp();
sld.hpt.id = 30014;
sld.hpt.name = i18n.t("content.sld.hpt.name");
sld.hpt.desc = i18n.t("content.sld.hpt.desc") + dom.dseparator;
sld.hpt.rar = 4;
sld.hpt.slot = 2;
sld.hpt.str = 18;
// Bronze over wood: it turns an edge or a point well and conducts lightning, and
// it was never made with anything but men on the other side of it in mind.
sld.hpt.aff = [10, 5, 6, 5, 4, 2, 2];
sld.hpt.cls = [7, 7, 4];
sld.hpt.stype = 3;
sld.hpt.dp = sld.hpt.dpmax = 44;

sld.jrt = new Eqp();
sld.jrt.id = 30015;
sld.jrt.name = i18n.t("content.sld.jrt.name");
sld.jrt.desc = i18n.t("content.sld.jrt.desc") + dom.dseparator;
sld.jrt.rar = 4;
sld.jrt.slot = 2;
sld.jrt.str = 20;
sld.jrt.aff = [11, 6, 6, 6, 6, 3, 3];
sld.jrt.cls = [8, 7, 7];
sld.jrt.dp = sld.jrt.dpmax = 48;
sld.jrt.stype = 3;

sld.drd = new Eqp();
sld.drd.id = 30016;
sld.drd.name = i18n.t("content.sld.drd.name");
sld.drd.desc = i18n.t("content.sld.drd.desc") + dom.dseparator;
sld.drd.rar = 4;
sld.drd.slot = 2;
sld.drd.str = 23;
// The only shield in the game that stands against dark, which is the whole reason
// the instructor keeps it back for the top of the ladder: by the time a student is
// worth it, what they are walking into is under the village rather than in it.
sld.drd.aff = [12, 6, 7, 7, 6, 4, 11];
sld.drd.cls = [8, 8, 8];
sld.drd.stype = 3;
sld.drd.dp = sld.drd.dpmax = 54;

sld.stksld = new Eqp();
sld.stksld.id = 30017;
sld.stksld.name = i18n.t("content.sld.stksld.name");
sld.stksld.desc =
  i18n.t("content.sld.stksld.desc") +
  dom.dseparator +
  i18n.t("content.sld.stksld.bonus");
sld.stksld.slot = 2;
sld.stksld.str = 7;
sld.stksld.aff = [2, 2, 2, 2, 2, 2, 2];
sld.stksld.cls = [3, 3, 3];
sld.stksld.stype = 3;
sld.stksld.dp = sld.stksld.dpmax = 23;
sld.stksld.oneq = function () {
  you.aff[0] += 4;
};
sld.stksld.onuneq = function () {
  you.aff[0] -= 4;
};

acc.strawp = new Eqp();
acc.strawp.id = 40001;
acc.strawp.name = i18n.t("content.acc.strawp.name");
acc.strawp.desc =
  i18n.t("content.acc.strawp.desc") +
  dom.dseparator +
  i18n.t("content.acc.strawp.bonus");
acc.strawp.slot = 8;
acc.strawp.stype = 3;
//acc.strawp.eff[0]=effect.strawp;
acc.strawp.oneq = function () {
  you.sata += 50;
  you.sat += 50;
  you.spda += 1;
};
acc.strawp.onuneq = function () {
  you.sata -= 50;
  you.sat -= 50;
  you.spda -= 1;
};
acc.strawp.onGet = function () {
  if (acc.fmlim.have) {
    giveRcp(rcp.fmlim2);
    this.onGet = function () {};
  }
};

acc.snch = new Eqp();
acc.snch.id = 40002;
acc.snch.name = i18n.t("content.acc.snch.name");
acc.snch.desc =
  i18n.t("content.acc.snch.desc") +
  dom.dseparator +
  i18n.t("content.acc.snch.bonus");
acc.snch.slot = 8;
acc.snch.stype = 3;
acc.snch.eff[0] = effect.snch;
acc.snch.rar = 2;
acc.snch.oneq = function () {
  if (global.flags.savestate === false)
    msg(
      i18n.t(
        "runtime.data.equipment.dialogue.you_feel_closer_to_the_sun_ab467ae5",
      ),
      "gold",
    );
};

acc.mnch = new Eqp();
acc.mnch.id = 40003;
acc.mnch.name = i18n.t("content.acc.mnch.name");
acc.mnch.desc =
  i18n.t("content.acc.mnch.desc") +
  dom.dseparator +
  i18n.t("content.acc.mnch.bonus");
acc.mnch.slot = 8;
acc.mnch.stype = 3;
acc.mnch.eff[0] = effect.mnch;
acc.mnch.rar = 2;
acc.mnch.oneq = function () {
  if (global.flags.savestate === false)
    msg(
      i18n.t(
        "runtime.data.equipment.dialogue.you_feel_closer_to_the_moon_88a50b7a",
      ),
      "gold",
    );
};

acc.mstn = new Eqp();
acc.mstn.id = 40004;
acc.mstn.name = i18n.t("content.acc.mstn.name");
acc.mstn.desc = i18n.t("content.acc.mstn.desc");
acc.mstn.slot = 8;
acc.mstn.stype = 3;
acc.mstn.rar = 2;

acc.bstn = new Eqp();
acc.bstn.id = 40005;
acc.bstn.name = i18n.t("content.acc.bstn.name");
acc.bstn.desc = i18n.t("content.acc.bstn.desc");
acc.bstn.slot = 8;
acc.bstn.stype = 3;
acc.bstn.rar = 2;

acc.sstn = new Eqp();
acc.sstn.id = 40006;
acc.sstn.name = i18n.t("content.acc.sstn.name");
acc.sstn.desc = i18n.t("content.acc.sstn.desc");
acc.sstn.slot = 8;
acc.sstn.stype = 3;
acc.sstn.rar = 2;

acc.srng = new Eqp();
acc.srng.id = 40007;
acc.srng.name = i18n.t("content.acc.srng.name");
acc.srng.desc = i18n.t("content.acc.srng.desc");
acc.srng.slot = 8;
acc.srng.stype = 3;

acc.grng = new Eqp();
acc.grng.id = 40008;
acc.grng.name = i18n.t("content.acc.grng.name");
acc.grng.desc = i18n.t("content.acc.grng.desc");
acc.grng.slot = 8;
acc.grng.stype = 3;

acc.trrng = new Eqp();
acc.trrng.id = 40009;
acc.trrng.name = i18n.t("content.acc.trrng.name");
acc.trrng.desc = i18n.t("content.acc.trrng.desc");
acc.trrng.slot = 8;
acc.trrng.stype = 3;
acc.trrng.rar = 3;

acc.akh = new Eqp();
acc.akh.id = 40010;
acc.akh.name = i18n.t("content.acc.akh.name");
acc.akh.desc = i18n.t("content.acc.akh.desc");
acc.akh.slot = 8;
acc.akh.stype = 3;
acc.akh.rar = 3;

acc.gmph1 = new Eqp();
acc.gmph1.id = 40011;
acc.gmph1.name = i18n.t("content.acc.gmph1.name");
acc.gmph1.desc = i18n.t("content.acc.gmph1.desc");
acc.gmph1.slot = 8;
acc.gmph1.stype = 3;
acc.gmph1.rar = 2;

acc.gmph2 = new Eqp();
acc.gmph2.id = 40012;
acc.gmph2.name = i18n.t("content.acc.gmph2.name");
acc.gmph2.desc = i18n.t("content.acc.gmph2.desc");
acc.gmph2.slot = 8;
acc.gmph2.stype = 3;
acc.gmph2.rar = 3;

acc.gmai1 = new Eqp();
acc.gmai1.id = 40013;
acc.gmai1.name = i18n.t("content.acc.gmai1.name");
acc.gmai1.desc = i18n.t("content.acc.gmai1.desc");
acc.gmai1.slot = 8;
acc.gmai1.stype = 3;
acc.gmai1.rar = 2;

acc.gmai2 = new Eqp();
acc.gmai2.id = 40014;
acc.gmai2.name = i18n.t("content.acc.gmai2.name");
acc.gmai2.desc = i18n.t("content.acc.gmai2.desc");
acc.gmai2.slot = 8;
acc.gmai2.stype = 3;
acc.gmai2.rar = 3;

acc.gmfr1 = new Eqp();
acc.gmfr1.id = 40015;
acc.gmfr1.name = i18n.t("content.acc.gmfr1.name");
acc.gmfr1.desc = i18n.t("content.acc.gmfr1.desc");
acc.gmfr1.slot = 8;
acc.gmfr1.stype = 3;
acc.gmfr1.rar = 2;

acc.gmfr2 = new Eqp();
acc.gmfr2.id = 40016;
acc.gmfr2.name = i18n.t("content.acc.gmfr2.name");
acc.gmfr2.desc = i18n.t("content.acc.gmfr2.desc");
acc.gmfr2.slot = 8;
acc.gmfr2.stype = 3;
acc.gmfr2.rar = 3;

acc.gmea1 = new Eqp();
acc.gmea1.id = 40017;
acc.gmea1.name = i18n.t("content.acc.gmea1.name");
acc.gmea1.desc = i18n.t("content.acc.gmea1.desc");
acc.gmea1.slot = 8;
acc.gmea1.stype = 3;
acc.gmea1.rar = 2;

acc.gmea2 = new Eqp();
acc.gmea2.id = 40018;
acc.gmea2.name = i18n.t("content.acc.gmea2.name");
acc.gmea2.desc = i18n.t("content.acc.gmea2.desc");
acc.gmea2.slot = 8;
acc.gmea2.stype = 3;
acc.gmea2.rar = 3;

acc.gmwt1 = new Eqp();
acc.gmwt1.id = 40019;
acc.gmwt1.name = i18n.t("content.acc.gmwt1.name");
acc.gmwt1.desc = i18n.t("content.acc.gmwt1.desc");
acc.gmwt1.slot = 8;
acc.gmwt1.stype = 3;
acc.gmwt1.rar = 2;

acc.gmwt2 = new Eqp();
acc.gmwt2.id = 40020;
acc.gmwt2.name = i18n.t("content.acc.gmwt2.name");
acc.gmwt2.desc = i18n.t("content.acc.gmwt2.desc");
acc.gmwt2.slot = 8;
acc.gmwt2.stype = 3;
acc.gmwt2.rar = 3;

acc.gmhl1 = new Eqp();
acc.gmhl1.id = 40021;
acc.gmhl1.name = i18n.t("content.acc.gmhl1.name");
acc.gmhl1.desc = i18n.t("content.acc.gmhl1.desc");
acc.gmhl1.slot = 8;
acc.gmhl1.stype = 3;
acc.gmhl1.rar = 2;

acc.gmhl2 = new Eqp();
acc.gmhl2.id = 40022;
acc.gmhl2.name = i18n.t("content.acc.gmhl2.name");
acc.gmhl2.desc = i18n.t("content.acc.gmhl2.desc");
acc.gmhl2.slot = 8;
acc.gmhl2.stype = 3;
acc.gmhl2.rar = 3;

acc.gmdk1 = new Eqp();
acc.gmdk1.id = 40023;
acc.gmdk1.name = i18n.t("content.acc.gmdk1.name");
acc.gmdk1.desc = i18n.t("content.acc.gmdk1.desc");
acc.gmdk1.slot = 8;
acc.gmdk1.stype = 3;
acc.gmdk1.rar = 2;

acc.gmdk2 = new Eqp();
acc.gmdk2.id = 40024;
acc.gmdk2.name = i18n.t("content.acc.gmdk2.name");
acc.gmdk2.desc = i18n.t("content.acc.gmdk2.desc");
acc.gmdk2.slot = 8;
acc.gmdk2.stype = 3;
acc.gmdk2.rar = 3;

acc.wfng = new Eqp();
acc.wfng.id = 40025;
acc.wfng.name = i18n.t("content.acc.wfng.name");
acc.wfng.desc =
  i18n.t("content.acc.wfng.desc") +
  dom.dseparator +
  i18n.t("content.acc.wfng.bonus");
acc.wfng.slot = 8;
acc.wfng.stype = 3;
acc.wfng.oneq = function () {
  you.cmaff[1] += 15;
};
acc.wfng.onuneq = function () {
  you.cmaff[1] -= 15;
};
acc.wfng.onGet = function () {
  if (!rcp.wfar.have) {
    let f = 0;
    for (const a in inv) if (inv[a].id === this.id) f++;
    if (f >= 3) giveRcp(rcp.wfar);
  }
};

acc.wfar = new Eqp();
acc.wfar.id = 40026;
acc.wfar.name = i18n.t("content.acc.wfar.name");
acc.wfar.desc =
  i18n.t("content.acc.wfar.desc") +
  dom.dseparator +
  i18n.t("content.acc.wfar.bonus");
acc.wfar.slot = 8;
acc.wfar.stype = 3;
acc.wfar.rar = 2;
acc.wfar.oneq = function () {
  you.cmaff[1] += 30;
};
acc.wfar.onuneq = function () {
  you.cmaff[1] -= 30;
};

acc.sshl = new Eqp();
acc.sshl.id = 40027;
acc.sshl.name = i18n.t("content.acc.sshl.name");
acc.sshl.desc =
  i18n.t("content.acc.sshl.desc") +
  dom.dseparator +
  i18n.t("content.acc.sshl.bonus");
acc.sshl.slot = 8;
acc.sshl.stype = 3;
acc.sshl.rar = 2;
acc.sshl.oneq = function () {};
acc.sshl.onuneq = function () {};

acc.qill = new Eqp();
acc.qill.id = 40028;
acc.qill.name = i18n.t("content.acc.qill.name");
acc.qill.desc =
  i18n.t("content.acc.qill.desc") +
  dom.dseparator +
  i18n.t("content.acc.qill.bonus");
acc.qill.slot = 8;
acc.qill.stype = 3;
acc.qill.oneq = function () {
  you.agla += 5;
};
acc.qill.onuneq = function () {
  you.agla -= 5;
};
acc.qill.onGet = function () {
  if (acc.bink.have) {
    giveRcp(rcp.mink);
    this.onGet = function () {};
  }
};

acc.bink = new Eqp();
acc.bink.id = 40029;
acc.bink.name = i18n.t("content.acc.bink.name");
acc.bink.desc =
  i18n.t("content.acc.bink.desc") +
  dom.dseparator +
  i18n.t("content.acc.bink.bonus");
acc.bink.slot = 8;
acc.bink.stype = 3;
acc.bink.oneq = function () {
  you.inta += 3;
};
acc.bink.onuneq = function () {
  you.inta -= 3;
};
acc.bink.onGet = function () {
  if (acc.qill.have) {
    giveRcp(rcp.mink);
    this.onGet = function () {};
  }
};

acc.mink = new Eqp();
acc.mink.id = 40030;
acc.mink.name = i18n.t("content.acc.mink.name");
acc.mink.desc =
  i18n.t("content.acc.mink.desc") +
  dom.dseparator +
  i18n.t("content.acc.mink.bonus");
acc.mink.slot = 8;
acc.mink.stype = 3;
acc.mink.rar = 2;
acc.mink.oneq = function () {
  you.inta += 8;
  you.agla += 10;
};
acc.mink.onuneq = function () {
  you.inta -= 8;
  you.agla -= 10;
};

acc.rfot = new Eqp();
acc.rfot.id = 40031;
acc.rfot.name = i18n.t("content.acc.rfot.name");
acc.rfot.desc =
  i18n.t("content.acc.rfot.desc") +
  dom.dseparator +
  i18n.t("content.acc.rfot.bonus");
acc.rfot.slot = 8;
acc.rfot.stype = 3;
acc.rfot.rar = 2;
acc.rfot.oneq = function () {
  you.luck += 2;
};
acc.rfot.onuneq = function () {
  you.luck -= 2;
};

acc.sdl1 = new Eqp();
acc.sdl1.id = 40032;
acc.sdl1.name = i18n.t("content.acc.sdl1.name");
acc.sdl1.desc =
  i18n.t("content.acc.sdl1.desc") +
  dom.dseparator +
  i18n.t("content.acc.sdl1.bonus");
acc.sdl1.slot = 8;
acc.sdl1.stype = 3;
acc.sdl1.oneq = function () {
  you.caff[0] += 5;
};
acc.sdl1.onuneq = function () {
  you.caff[0] -= 5;
};
acc.sdl1.onGet = function () {
  if (acc.bdl1.have && acc.wdl1.have) {
    giveRcp(rcp.gdl1);
    this.onGet = function () {};
  }
};

acc.lckcn = new Eqp();
acc.lckcn.id = 40033;
acc.lckcn.name = i18n.t("content.acc.lckcn.name");
acc.lckcn.desc =
  i18n.t("content.acc.lckcn.desc") +
  dom.dseparator +
  i18n.t("content.acc.lckcn.bonus");
acc.lckcn.slot = 8;
acc.lckcn.stype = 3;
acc.lckcn.oneq = function () {
  you.luck += 3;
};
acc.lckcn.onuneq = function () {
  you.luck -= 3;
};
acc.lckcn.onGet = function () {
  if (acc.cfgn.have) {
    giveRcp(rcp.mnknk);
    this.onGet = function () {};
  }
};

acc.cfgn = new Eqp();
acc.cfgn.id = 40034;
acc.cfgn.name = i18n.t("content.acc.cfgn.name");
acc.cfgn.desc =
  i18n.t("content.acc.cfgn.desc") +
  dom.dseparator +
  i18n.t("content.acc.cfgn.bonus");
acc.cfgn.slot = 8;
acc.cfgn.stype = 3;
acc.cfgn.oneq = function () {
  you.mods.sbonus += 0.05;
};
acc.cfgn.onuneq = function () {
  you.mods.sbonus -= 0.05;
};
acc.cfgn.onGet = function () {
  if (acc.lckcn.have) {
    giveRcp(rcp.mnknk);
    this.onGet = function () {};
  }
};

acc.mnknk = new Eqp();
acc.mnknk.id = 40035;
acc.mnknk.name = i18n.t("content.acc.mnknk.name");
acc.mnknk.desc =
  i18n.t("content.acc.mnknk.desc") +
  dom.dseparator +
  i18n.t("content.acc.mnknk.bonus");
acc.mnknk.slot = 8;
acc.mnknk.stype = 3;
acc.mnknk.rar = 2;
acc.mnknk.oneq = function () {
  you.luck += 4;
  you.mods.sbonus += 0.1;
};
acc.mnknk.onuneq = function () {
  you.luck -= 4;
  you.mods.sbonus -= 0.1;
};

acc.wdl1 = new Eqp();
acc.wdl1.id = 40036;
acc.wdl1.name = i18n.t("content.acc.wdl1.name");
acc.wdl1.desc =
  i18n.t("content.acc.wdl1.desc") +
  dom.dseparator +
  i18n.t("content.acc.wdl1.bonus");
acc.wdl1.ccls = [5, 5, 5];
acc.wdl1.slot = 8;
acc.wdl1.stype = 3;
acc.wdl1.oneq = function () {
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] += this.ccls[afn];
};
acc.wdl1.onuneq = function () {
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] -= this.ccls[afn];
};
acc.wdl1.onGet = function () {
  if (acc.sdl1.have && acc.bdl1.have) {
    giveRcp(rcp.gdl1);
    this.onGet = function () {};
  }
};

acc.gdl1 = new Eqp();
acc.gdl1.id = 40037;
acc.gdl1.name = i18n.t("content.acc.gdl1.name");
acc.gdl1.desc =
  i18n.t("content.acc.gdl1.desc") +
  dom.dseparator +
  i18n.t("content.acc.gdl1.bonus");
acc.gdl1.ccls = [4, 4, 4];
acc.gdl1.slot = 8;
acc.gdl1.stype = 3;
acc.gdl1.rar = 2;
acc.gdl1.oneq = function () {
  you.caff[0] += 3;
  you.caff[6] += 2;
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] += this.ccls[afn];
  you.cmaff[3] += 6;
};
acc.gdl1.onuneq = function () {
  you.caff[0] -= 3;
  you.caff[6] -= 2;
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] -= this.ccls[afn];
  you.cmaff[3] -= 6;
};

acc.rnsn = new Eqp();
acc.rnsn.id = 40038;
acc.rnsn.name = i18n.t("content.acc.rnsn.name");
acc.rnsn.desc = i18n.t("content.acc.rnsn.desc") + dom.dseparator;
acc.rnsn.slot = 8;
acc.rnsn.stype = 3;

acc.hndm = new Eqp();
acc.hndm.id = 40039;
acc.hndm.name = i18n.t("content.acc.hndm.name");
acc.hndm.desc = i18n.t("content.acc.hndm.desc") + dom.dseparator;
acc.hndm.slot = 8;
acc.hndm.stype = 3;

acc.dcpe = new Eqp();
acc.dcpe.id = 40040;
acc.dcpe.name = i18n.t("content.acc.dcpe.name");
acc.dcpe.desc = i18n.t("content.acc.dcpe.desc") + dom.dseparator;
acc.dcpe.slot = 8;
acc.dcpe.stype = 3;

acc.bdl1 = new Eqp();
acc.bdl1.id = 40041;
acc.bdl1.name = i18n.t("content.acc.bdl1.name");
acc.bdl1.desc =
  i18n.t("content.acc.bdl1.desc") +
  dom.dseparator +
  i18n.t("content.acc.bdl1.bonus");
acc.bdl1.slot = 8;
acc.bdl1.stype = 3;
acc.bdl1.oneq = function () {
  you.caff[6] += 5;
  you.cmaff[3] += 5;
};
acc.bdl1.onuneq = function () {
  you.caff[6] -= 5;
  you.cmaff[3] -= 5;
};
acc.bdl1.onGet = function () {
  if (acc.sdl1.have && acc.wdl1.have) {
    giveRcp(rcp.gdl1);
    this.onGet = function () {};
  }
};

acc.fssn = new Eqp();
acc.fssn.id = 40042;
acc.fssn.name = i18n.t("content.acc.fssn.name");
acc.fssn.desc = i18n.t("content.acc.fssn.desc") + dom.dseparator;
acc.fssn.slot = 8;
acc.fssn.stype = 3;

acc.mpst = new Eqp();
acc.mpst.id = 40043;
acc.mpst.name = i18n.t("content.acc.mpst.name");
acc.mpst.desc =
  i18n.t("content.acc.mpst.desc") +
  dom.dseparator +
  i18n.t("content.acc.mpst.bonus");
acc.mpst.slot = 8;
acc.mpst.alchq = 1;
acc.mpst.stype = 3;
acc.mpst.oneq = function () {
  skl.alch.p += 0.05;
};
acc.mpst.onuneq = function () {
  skl.alch.p -= 0.05;
};
acc.mpst.onGet = function () {
  if (acc.mpst.have && acc.mshst.have && acc.mhhst) {
    giveRcp(rcp.alseto);
    this.onGet = function () {};
  }
};

acc.vtmns = new Eqp();
acc.vtmns.id = 40044;
acc.vtmns.name = i18n.t("content.acc.vtmns.name");
acc.vtmns.desc =
  i18n.t("content.acc.vtmns.desc") +
  dom.dseparator +
  i18n.t("content.acc.vtmns.bonus");
acc.vtmns.slot = 8;
acc.vtmns.stype = 3;
acc.vtmns.oneq = function () {
  you.res.poison -= 0.05;
};
acc.vtmns.onuneq = function () {
  you.res.poison += 0.05;
};
acc.vtmns.onGet = function () {
  if (acc.mdcag.have && acc.vtmns.have) {
    giveRcp(rcp.mdcbg);
    this.onGet = function () {};
  }
};

acc.mdcag = new Eqp();
acc.mdcag.id = 40045;
acc.mdcag.name = i18n.t("content.acc.mdcag.name");
acc.mdcag.desc =
  i18n.t("content.acc.mdcag.desc") +
  dom.dseparator +
  i18n.t("content.acc.mdcag.bonus");
acc.mdcag.slot = 8;
acc.mdcag.stype = 3;
acc.mdcag.oneq = function () {
  you.res.bleed -= 0.05;
};
acc.mdcag.onuneq = function () {
  you.res.bleed += 0.05;
};
acc.mdcag.onGet = function () {
  if (acc.mdcag.have && acc.vtmns.have) {
    giveRcp(rcp.mdcbg);
    this.onGet = function () {};
  }
};

acc.mdcbg = new Eqp();
acc.mdcbg.id = 40046;
acc.mdcbg.name = i18n.t("content.acc.mdcbg.name");
acc.mdcbg.desc =
  i18n.t("content.acc.mdcbg.desc") +
  dom.dseparator +
  i18n.t("content.acc.mdcbg.bonus");
acc.mdcbg.slot = 8;
acc.mdcbg.stype = 3;
acc.mdcbg.rar = 2;
acc.mdcbg.oneq = function () {
  you.res.bleed -= 0.08;
  you.res.poison -= 0.08;
};
acc.mdcbg.onuneq = function () {
  you.res.bleed += 0.08;
  you.res.poison += 0.08;
};

acc.mshst = new Eqp();
acc.mshst.id = 40047; //🝪
acc.mshst.name = i18n.t("content.acc.mshst.name");
acc.mshst.desc =
  i18n.t("content.acc.mshst.desc") +
  dom.dseparator +
  i18n.t("content.acc.mshst.bonus");
acc.mshst.slot = 8;
acc.mshst.alchq = 1;
acc.mshst.stype = 3;
acc.mshst.oneq = function () {
  skl.alch.p += 0.1;
};
acc.mshst.onuneq = function () {
  skl.alch.p -= 0.1;
};
acc.mshst.onGet = function () {
  if (acc.mpst.have && acc.mshst.have && acc.mhhst) {
    giveRcp(rcp.alseto);
    this.onGet = function () {};
  }
};

acc.mhhst = new Eqp();
acc.mhhst.id = 40048;
acc.mhhst.name = i18n.t("content.acc.mhhst.name");
acc.mhhst.desc =
  i18n.t("content.acc.mhhst.desc") +
  dom.dseparator +
  i18n.t("content.acc.mhhst.bonus");
acc.mhhst.slot = 8;
acc.mhhst.alchq = 1;
acc.mhhst.stype = 3;
acc.mhhst.oneq = function () {
  skl.alch.p += 0.15;
};
acc.mhhst.onuneq = function () {
  skl.alch.p -= 0.15;
};
acc.mhhst.onGet = function () {
  if (acc.mpst.have && acc.mshst.have && acc.mhhst) {
    giveRcp(rcp.alseto);
    this.onGet = function () {};
  }
};

acc.asfk = new Eqp();
acc.asfk.id = 40049;
acc.asfk.name = i18n.t("content.acc.asfk.name");
acc.asfk.desc =
  i18n.t("content.acc.asfk.desc") +
  dom.dseparator +
  i18n.t("content.acc.asfk.bonus");
acc.asfk.slot = 8;
acc.asfk.stype = 3;
acc.asfk.oneq = function () {
  you.res.ph -= 0.03;
};
acc.asfk.onuneq = function () {
  you.res.ph += 0.03;
};

acc.alseto = new Eqp();
acc.alseto.id = 40050;
acc.alseto.name = i18n.t("content.acc.alseto.name");
acc.alseto.desc =
  i18n.t("content.acc.alseto.desc") +
  dom.dseparator +
  i18n.t("content.acc.alseto.bonus");
acc.alseto.slot = 8;
acc.alseto.alchq = 2;
acc.alseto.stype = 3;
acc.alseto.int = 15;
acc.alseto.rar = 2;
acc.alseto.oneq = function () {
  skl.alch.p += 0.5;
};
acc.alseto.onuneq = function () {
  skl.alch.p -= 0.5;
};

acc.csfk = new Eqp();
acc.csfk.id = 40051;
acc.csfk.name = i18n.t("content.acc.csfk.name");
acc.csfk.desc =
  i18n.t("content.acc.csfk.desc") +
  dom.dseparator +
  i18n.t("content.acc.csfk.bonus");
acc.csfk.slot = 8;
acc.csfk.stype = 3;
acc.csfk.oneq = function () {
  you.caff[6] += 10;
};
acc.csfk.onuneq = function () {
  you.caff[6] -= 10;
};

acc.gsfk = new Eqp();
acc.gsfk.id = 40052;
acc.gsfk.name = i18n.t("content.acc.gsfk.name");
acc.gsfk.desc =
  i18n.t("content.acc.gsfk.desc") +
  dom.dseparator +
  i18n.t("content.acc.gsfk.bonus");
acc.gsfk.slot = 8;
acc.gsfk.stype = 3;
acc.gsfk.rar = 2;
acc.gsfk.oneq = function () {
  you.res.ph -= 0.04;
  you.caff[6] += 35;
};
acc.gsfk.onuneq = function () {
  you.res.ph += 0.04;
  you.caff[6] -= 35;
};

acc.jln1 = new Eqp();
acc.jln1.id = 40053;
acc.jln1.name = i18n.t("content.acc.jln1.name");
acc.jln1.desc =
  i18n.t("content.acc.jln1.desc") +
  dom.dseparator +
  i18n.t("content.acc.jln1.bonus");
acc.jln1.slot = 8;
acc.jln1.stype = 3;
acc.jln1.oneq = function () {
  you.hpa += 400;
};
acc.jln1.onuneq = function () {
  you.hpa -= 400;
};

acc.jln2 = new Eqp();
acc.jln2.id = 40054;
acc.jln2.name = i18n.t("content.acc.jln2.name");
acc.jln2.desc =
  i18n.t("content.acc.jln2.desc") +
  dom.dseparator +
  i18n.t("content.acc.jln2.bonus");
acc.jln2.slot = 8;
acc.jln2.stype = 3;
acc.jln2.oneq = function () {
  you.sat += 100;
  you.sata += 100;
};
acc.jln2.onuneq = function () {
  you.sat -= 100;
  you.sata -= 100;
};

acc.jln3 = new Eqp();
acc.jln3.id = 40055;
acc.jln3.name = i18n.t("content.acc.jln3.name");
acc.jln3.desc =
  i18n.t("content.acc.jln3.desc") +
  dom.dseparator +
  i18n.t("content.acc.jln3.bonus");
acc.jln3.slot = 8;
acc.jln3.stype = 3;
acc.jln3.oneq = function () {
  you.spda += 2;
  you.mods.sdrate += 0.2;
};
acc.jln3.onuneq = function () {
  you.spda -= 2;
  you.mods.sdrate -= 0.2;
};

acc.jln4 = new Eqp();
acc.jln4.id = 40056;
acc.jln4.name = i18n.t("content.acc.jln4.name");
acc.jln4.desc = i18n.t("content.acc.jln4.desc");
acc.jln4.slot = 8;
acc.jln4.stype = 3;
acc.jln4.rar = 2;
acc.jln4.oneq = function () {
  you.spda += 2;
  you.mods.sdrate += 0.2;
};
acc.jln4.onuneq = function () {
  you.spda -= 2;
  you.mods.sdrate -= 0.2;
};

acc.mstone = new Eqp();
acc.mstone.id = 40057;
acc.mstone.name = i18n.t("content.acc.mstone.name");
acc.mstone.desc = i18n.t("content.acc.mstone.desc");
acc.mstone.slot = 8;
acc.mstone.stype = 3;

acc.sstone = new Eqp();
acc.sstone.id = 40058;
acc.sstone.name = i18n.t("content.acc.sstone.name");
acc.sstone.desc = i18n.t("content.acc.sstone.desc");
acc.sstone.slot = 8;
acc.sstone.stype = 3;

acc.cstone = new Eqp();
acc.cstone.id = 40059;
acc.cstone.name = i18n.t("content.acc.cstone.name");
acc.cstone.desc = i18n.t("content.acc.cstone.desc");
acc.cstone.slot = 8;
acc.cstone.stype = 3;
acc.cstone.rar = 2;

acc.coring = new Eqp();
acc.coring.id = 40060;
acc.coring.name = i18n.t("content.acc.coring.name");
acc.coring.desc =
  i18n.t("content.acc.coring.desc") +
  dom.dseparator +
  i18n.t("content.acc.coring.bonus");
acc.coring.slot = 8;
acc.coring.stype = 3;
acc.coring.rar = 2;
acc.coring.oneq = function () {
  you.mods.enmondren += 0.01;
};
acc.coring.onuneq = function () {
  you.mods.enmondren -= 0.01;
};

acc.dticket = new Eqp();
acc.dticket.id = 40061;
acc.dticket.name = i18n.t("content.acc.dticket.name");
acc.dticket.desc =
  i18n.t("content.acc.dticket.desc") +
  dom.dseparator +
  i18n.t("content.acc.dticket.bonus");
acc.dticket.slot = 8;
acc.dticket.stype = 3;
acc.dticket.onGet = function () {
  let b = 0;
  for (const a in inv) if (inv[a].id === this.id) b++;
  if (b >= 5) giveRcp(rcp.dcard1);
};
acc.dticket.oneq = function () {
  you.mods.infsrate -= 0.01;
  recshop();
};
acc.dticket.onuneq = function () {
  you.mods.infsrate += 0.01;
  recshop();
};

acc.dcard1 = new Eqp();
acc.dcard1.id = 40062;
acc.dcard1.name = i18n.t("content.acc.dcard1.name");
acc.dcard1.desc =
  i18n.t("content.acc.dcard1.desc") +
  dom.dseparator +
  i18n.t("content.acc.dcard1.bonus");
acc.dcard1.slot = 8;
acc.dcard1.stype = 3;
acc.dcard1.rar = 2;
acc.dcard1.oneq = function () {
  you.mods.infsrate -= 0.05;
  recshop();
};
acc.dcard1.onuneq = function () {
  you.mods.infsrate += 0.05;
  recshop();
};

acc.rgreed = new Eqp();
acc.rgreed.id = 40063;
acc.rgreed.name = i18n.t("content.acc.rgreed.name");
acc.rgreed.desc =
  i18n.t("content.acc.rgreed.desc") +
  dom.dseparator +
  i18n.t("content.acc.rgreed.bonus");
acc.rgreed.slot = 8;
acc.rgreed.stype = 3;
acc.rgreed.rar = 3;
acc.rgreed.oneq = function () {
  you.mods.infsrate -= 0.1;
  you.mods.enmondren += 0.03;
  recshop();
};
acc.rgreed.onuneq = function () {
  you.mods.infsrate += 0.1;
  you.mods.enmondren -= 0.03;
  recshop();
};

acc.medl1 = new Eqp();
acc.medl1.id = 40064;
acc.medl1.name = i18n.t("content.acc.medl1.name");
acc.medl1.desc = i18n.t("content.acc.medl1.desc");
acc.medl1.slot = 8;
acc.medl1.stype = 3;

acc.medl2 = new Eqp();
acc.medl2.id = 40065;
acc.medl2.name = i18n.t("content.acc.medl2.name");
acc.medl2.desc = i18n.t("content.acc.medl2.desc");
acc.medl2.slot = 8;
acc.medl2.stype = 3;

acc.medl3 = new Eqp();
acc.medl3.id = 40066;
acc.medl3.name = i18n.t("content.acc.medl3.name");
acc.medl3.desc = i18n.t("content.acc.medl3.desc");
acc.medl3.slot = 8;
acc.medl3.stype = 3;
acc.medl3.rar = 2;

acc.medl4 = new Eqp();
acc.medl4.id = 40067;
acc.medl4.name = i18n.t("content.acc.medl4.name");
acc.medl4.desc = i18n.t("content.acc.medl4.desc");
acc.medl4.slot = 8;
acc.medl4.stype = 3;

acc.medl5 = new Eqp();
acc.medl5.id = 40068;
acc.medl5.name = i18n.t("content.acc.medl5.name");
acc.medl5.desc = i18n.t("content.acc.medl5.desc");
acc.medl5.slot = 8;
acc.medl5.stype = 3;

acc.medl6 = new Eqp();
acc.medl6.id = 40069;
acc.medl6.name = i18n.t("content.acc.medl6.name");
acc.medl6.desc = i18n.t("content.acc.medl6.desc");
acc.medl6.slot = 8;
acc.medl6.stype = 3;
acc.medl6.rar = 2;

acc.coindct = new Eqp();
acc.coindct.id = 40070;
acc.coindct.name = i18n.t("content.acc.coindct.name");
acc.coindct.desc =
  i18n.t("content.acc.coindct.desc") +
  dom.dseparator +
  i18n.t("content.acc.coindct.bonus");
acc.coindct.slot = 8;
acc.coindct.stype = 3;
acc.coindct.oneq = function () {
  you.mods.crflt += 0.03;
};
acc.coindct.onuneq = function () {
  you.mods.crflt -= 0.03;
};

acc.slchth = new Eqp();
acc.slchth.id = 40071;
acc.slchth.name = i18n.t("content.acc.slchth.name");
acc.slchth.desc =
  i18n.t("content.acc.slchth.desc") +
  dom.dseparator +
  i18n.t("content.acc.slchth.bonus");
acc.slchth.slot = 8;
acc.slchth.stype = 3;
acc.slchth.oneq = function () {
  you.mods.cpwr += 0.15;
};
acc.slchth.onuneq = function () {
  you.mods.cpwr -= 0.15;
};

acc.rmedlon = new Eqp();
acc.rmedlon.id = 40072;
acc.rmedlon.name = i18n.t("content.acc.rmedlon.name");
acc.rmedlon.desc =
  i18n.t("content.acc.rmedlon.desc") +
  dom.dseparator +
  i18n.t("content.acc.rmedlon.bonus");
acc.rmedlon.slot = 8;
acc.rmedlon.stype = 3;
acc.rmedlon.rar = 2;
acc.rmedlon.oneq = function () {
  you.mods.crflt += 0.06;
};
acc.rmedlon.onuneq = function () {
  you.mods.crflt -= 0.06;
};

acc.mirgmirr = new Eqp();
acc.mirgmirr.id = 40073;
acc.mirgmirr.name = i18n.t("content.acc.mirgmirr.name");
acc.mirgmirr.desc =
  i18n.t("content.acc.mirgmirr.desc") +
  dom.dseparator +
  i18n.t("content.acc.mirgmirr.bonus");
acc.mirgmirr.slot = 8;
acc.mirgmirr.stype = 3;
acc.mirgmirr.oneq = function () {
  you.mods.ddgmod += 0.1;
};
acc.mirgmirr.onuneq = function () {
  you.mods.ddgmod -= 0.1;
};

acc.aihomnt = new Eqp();
acc.aihomnt.id = 40074;
acc.aihomnt.name = i18n.t("content.acc.aihomnt.name");
acc.aihomnt.desc =
  i18n.t("content.acc.aihomnt.desc") +
  dom.dseparator +
  i18n.t("content.acc.aihomnt.bonus");
acc.aihomnt.slot = 8;
acc.aihomnt.stype = 3;
acc.aihomnt.oneq = function () {};
acc.aihomnt.onuneq = function () {};

acc.gourd1 = new Eqp();
acc.gourd1.id = 40075;
acc.gourd1.name = i18n.t("content.acc.gourd1.name");
acc.gourd1.desc =
  i18n.t("content.acc.gourd1.desc") +
  dom.dseparator +
  i18n.t("content.acc.gourd1.bonus");
acc.gourd1.slot = 8;
acc.gourd1.stype = 3;
acc.gourd1.oneq = function () {
  you.sat += 150;
  you.sata += 150;
};
acc.gourd1.onuneq = function () {
  you.sat -= 150;
  you.sata -= 150;
};

acc.stupa = new Eqp();
acc.stupa.id = 40076;
acc.stupa.name = i18n.t("content.acc.stupa.name");
acc.stupa.desc =
  i18n.t("content.acc.stupa.desc") +
  dom.dseparator +
  i18n.t("content.acc.stupa.bonus");
acc.stupa.slot = 8;
acc.stupa.stype = 3;
acc.stupa.oneq = function () {
  you.res.death -= 0.02;
};
acc.stupa.onuneq = function () {
  you.res.death += 0.02;
};

acc.wpeny = new Eqp();
acc.wpeny.id = 40077;
acc.wpeny.name = i18n.t("content.acc.wpeny.name");
acc.wpeny.desc =
  i18n.t("content.acc.wpeny.desc") +
  dom.dseparator +
  i18n.t("content.acc.wpeny.bonus");
acc.wpeny.slot = 8;
acc.wpeny.stype = 3;
acc.wpeny.oneq = function () {
  skl.gred.p += 0.2;
  you.mods.wthexrt++;
};
acc.wpeny.onuneq = function () {
  skl.gred.p -= 0.2;
  you.mods.wthexrt--;
};

acc.rngsgn = new Eqp();
acc.rngsgn.id = 40078;
acc.rngsgn.name = i18n.t("content.acc.rngsgn.name");
acc.rngsgn.desc = i18n.t("content.acc.rngsgn.desc");
acc.rngsgn.slot = 8;
acc.rngsgn.stype = 3;

acc.fmlim = new Eqp();
acc.fmlim.id = 40079;
acc.fmlim.important = true;
acc.fmlim.name = i18n.t("content.acc.fmlim.name");
acc.fmlim.desc =
  i18n.t("content.acc.fmlim.desc") +
  dom.dseparator +
  i18n.t("content.acc.fmlim.bonus");
acc.fmlim.slot = 8;
acc.fmlim.stype = 3;
acc.fmlim.oneq = function () {
  you.hpa += 2;
};
acc.fmlim.onuneq = function () {
  you.hpa -= 2;
};
acc.fmlim.onGet = function () {
  if (acc.strawp.have) {
    giveRcp(rcp.fmlim2);
    this.onGet = function () {};
  }
};

acc.pbrs = new Eqp();
acc.pbrs.id = 40080;
acc.pbrs.name = i18n.t("content.acc.pbrs.name");
acc.pbrs.desc =
  i18n.t("content.acc.pbrs.desc") +
  dom.dseparator +
  i18n.t("content.acc.pbrs.bonus");
acc.pbrs.slot = 8;
acc.pbrs.stype = 3;
acc.pbrs.oneq = function () {
  skl.pet.p += 2;
};
acc.pbrs.onuneq = function () {
  skl.pet.p -= 2;
};

acc.clrpin = new Eqp();
acc.clrpin.id = 40081;
acc.clrpin.name = i18n.t("content.acc.clrpin.name");
acc.clrpin.desc =
  i18n.t("content.acc.clrpin.desc") +
  dom.dseparator +
  i18n.t("content.acc.clrpin.bonus");
acc.clrpin.slot = 8;
acc.clrpin.stype = 3;
acc.clrpin.rar = 4;
acc.clrpin.oneq = function () {
  you.mods.lkdbt += 0.01;
};
acc.clrpin.onuneq = function () {
  you.mods.lkdbt -= 0.01;
};

acc.prtckst = new Eqp();
acc.prtckst.id = 40082;
acc.prtckst.name = i18n.t("content.acc.prtckst.name");
acc.prtckst.desc =
  i18n.t("content.acc.prtckst.desc") +
  dom.dseparator +
  i18n.t("content.acc.prtckst.bonus");
acc.prtckst.slot = 8;
acc.prtckst.stype = 3;
acc.prtckst.rar = 3;
acc.prtckst.oneq = function () {
  skl.cook.p += 2;
  you.mods.ckfre += 1;
};
acc.prtckst.onuneq = function () {
  skl.cook.p -= 2;
  you.mods.ckfre -= 1;
};

acc.ubrlc = new Eqp();
acc.ubrlc.id = 40083;
acc.ubrlc.name = i18n.t("content.acc.ubrlc.name");
acc.ubrlc.desc =
  i18n.t("content.acc.ubrlc.desc") +
  dom.dseparator +
  i18n.t("content.acc.ubrlc.bonus");
acc.ubrlc.slot = 8;
acc.ubrlc.stype = 3;
acc.ubrlc.oneq = function () {
  you.mods.rnprtk += 1;
};
acc.ubrlc.onuneq = function () {
  you.mods.rnprtk -= 1;
};

acc.sltbg = new Eqp();
acc.sltbg.id = 40084;
acc.sltbg.name = i18n.t("content.acc.sltbg.name");
acc.sltbg.desc =
  i18n.t("content.acc.sltbg.desc") +
  dom.dseparator +
  i18n.t("content.acc.sltbg.bonus");
acc.sltbg.slot = 8;
acc.sltbg.stype = 3;
acc.sltbg.oneq = function () {
  you.cmaff[2] += 12;
  you.maff[2] += 8;
};
acc.sltbg.onuneq = function () {
  you.cmaff[2] -= 12;
  you.maff[2] -= 8;
};

acc.chlsbd = new Eqp();
acc.chlsbd.id = 40085;
acc.chlsbd.name = i18n.t("content.acc.chlsbd.name");
acc.chlsbd.desc = function (x, y) {
  return (
    '<div style="color:red">Collected blood: <br><span>0ml</span><span style="display:inline-table;width:130px;border:1px solid darkgrey;margin: 7px;background:linear-gradient(90deg,#690000,red)"><span style="display:block;background-color:black;float:right;width:' +
    (100 - (x.data.bld / x.data.bldmax) * 100) +
    '%">　</span></span><span>' +
    x.data.bldmax +
    "ml</span></div>"
  );
};
acc.chlsbd.slot = 8;
acc.chlsbd.data.bld = 0;
acc.chlsbd.data.bldmax = 200;
acc.chlsbd.stype = 3;
acc.chlsbd.onKill = function (x, y) {
  if ((x.type === 1 || x.type === 0 || x.type === 5) && x.blood) {
    if (y.data.bld + x.blood * 5 > y.data.bldmax) y.data.bld = y.data.bldmax;
    else y.data.bld += x.blood * 5;
  }
};
acc.chlsbd.oneq = function () {
  checksd.push({ f: this.onKill, o: this });
};
acc.chlsbd.onuneq = function () {
  checksd.splice(checksd.indexOf({ f: this.onKill, o: this }), 1);
};

acc.otpin = new Eqp();
acc.otpin.id = 40086;
acc.otpin.name = i18n.t("content.acc.otpin.name");
acc.otpin.desc =
  i18n.t("content.acc.otpin.desc") +
  dom.dseparator +
  i18n.t("content.acc.otpin.bonus");
acc.otpin.slot = 8;
acc.otpin.stype = 3;
acc.otpin.oneq = function () {
  skl.unc.p += 0.1;
  skl.srdc.p += 0.1;
  skl.knfc.p += 0.1;
  skl.axc.p += 0.1;
  skl.plrmc.p += 0.1;
  skl.stfc.p += 0.1;
  skl.bwc.p += 0.1;
  skl.hmrc.p += 0.1;
  you.exp_t += 0.25;
};
acc.otpin.onuneq = function () {
  skl.unc.p -= 0.1;
  skl.srdc.p -= 0.1;
  skl.knfc.p -= 0.1;
  skl.axc.p -= 0.1;
  skl.plrmc.p -= 0.1;
  skl.stfc.p -= 0.1;
  skl.bwc.p -= 0.1;
  skl.hmrc.p -= 0.1;
  you.exp_t -= 0.25;
};

acc.fmlim2 = new Eqp();
acc.fmlim2.id = 40087;
acc.fmlim2.important = true;
acc.fmlim2.name = i18n.t("content.acc.fmlim2.name");
acc.fmlim2.desc =
  i18n.t("content.acc.fmlim2.desc") +
  dom.dseparator +
  i18n.t("content.acc.fmlim2.bonus");
acc.fmlim2.slot = 8;
acc.fmlim2.stype = 3;
acc.fmlim2.oneq = function () {
  you.hpa += 5;
  you.sata += 25;
  you.spda += 1;
};
acc.fmlim2.onuneq = function () {
  you.hpa -= 5;
  you.sata -= 25;
  you.spda -= 1;
};

acc.gpin = new Eqp();
acc.gpin.id = 40088;
acc.gpin.name = i18n.t("content.acc.gpin.name");
acc.gpin.desc =
  i18n.t("content.acc.gpin.desc") +
  dom.dseparator +
  i18n.t("content.acc.gpin.bonus");
acc.gpin.slot = 8;
acc.gpin.stype = 3;
acc.gpin.oneq = function () {
  you.stra += 20;
  you.agla += 5;
};
acc.gpin.onuneq = function () {
  you.stra -= 20;
  you.agla -= 5;
};

acc.ndlb = new Eqp();
acc.ndlb.id = 40089;
acc.ndlb.name = i18n.t("content.acc.ndlb.name");
acc.ndlb.desc =
  i18n.t("content.acc.ndlb.desc") +
  dom.dseparator +
  i18n.t("content.acc.ndlb.bonus");
acc.ndlb.slot = 8;
acc.ndlb.tlrq = 1;
acc.ndlb.stype = 3;
acc.ndlb.oneq = function () {
  skl.tlrng.p += 0.1;
};
acc.ndlb.onuneq = function () {
  skl.tlrng.p -= 0.1;
};

/*Orlandu - "Actonite containing a fragment of Orlandu's skeleton"
Ogimus - "Amethyst containing Ogmious the Guardian's soul"
Balvus - "Chiastrite containing the ashes of Balvus"
Beowulf - "Moon Zircon"
Sigguld - "Fire agate with the soul of Sigguld the Dragoon"
Altema - "Garnet containing Altema the Fallen's spirit"
Haeralis - "Star sapphire with the power of Haeralis the Brave"
Orion - "Black coral holding the hair of Orion the Beast"
Iocus - "Lazurite containing St. Iocus's prayer"
Trinity - "Jade containing the Nordic holy spirits"
Dragonite - "Serpentine containing a dragon's power"
Demonia - "Blood opal containing the blood of devils"

suffering
resentment
*/

////dss////
wpn.stk1.dss = [{ item: item.wdc, amount: 2, q: 1.5, max: 5 }];
wpn.knf1.dss = [{ item: item.wdc, amount: 1, q: 1, max: 2 }];
item.fsh1.dss = [{ item: item.fsh2, amount: 1 }];
eqp.bnd.dss =
  eqp.pnt.dss =
  eqp.brc.dss =
  eqp.vst.dss =
    [{ item: item.cclth, amount: 1, q: 0.5, max: 2 }];
eqp.tnc.dss = [{ item: item.cclth, amount: 2 }];
item.dfish.dss = [{ item: item.fbait1, amount: 1, q: 0.75, max: 3 }];
item.cclth.dss = [{ item: item.thrdnl, amount: 1, q: 1, max: 2 }];
item.dmice1.dss = [{ item: item.sbone, amount: 1, q: 0.6, max: 3 }];
item.dbdc1.dss = [{ item: item.sbone, amount: 1, q: 0.5, max: 2 }];

////misc////
global.wdrop = [{ item: item.lckl, c: 0.0000048 }];
global.rdrop = [
  // g f e
  [{ item: item.lsrd, c: 0.00026 }],
  [{ item: item.lsrd, c: 0.0005 }],
  [
    { item: item.lsrd, c: 0.00098 },
    { item: item.lsstn, c: 0.00023 },
  ],
  [],
  [],
  [],
  [],
];
global.achchk = [
  //1 - you die, 2 - enemy dies
  [
    function (x) {
      if (ttl.ddw.have === false) {
        if ((x.id === 103 || x.id === 102) && x.lvl === 1) {
          giveTitle(ttl.ddw);
        }
      }
    },
  ],
  [
    function (x) {
      if (ttl.kill1.have === false) {
        if (global.stat.akills >= 10000) {
          giveTitle(ttl.kill1);
        }
      }
    },
    function (x) {
      if (ttl.kill2.have === false) {
        if (global.stat.akills >= 50000) {
          giveTitle(ttl.kill2);
        }
      }
    },
    function (x) {
      if (ttl.kill3.have === false) {
        if (global.stat.akills >= 200000) {
          giveTitle(ttl.kill3);
        }
      }
    },
    function (x) {
      if (ttl.kill4.have === false) {
        if (global.stat.akills >= 1000000) {
          giveTitle(ttl.kill4);
        }
      }
    },
    function (x) {
      if (ttl.kill5.have === false) {
        if (global.stat.akills >= 5000000) {
          giveTitle(ttl.kill5);
        }
      }
    },
  ],
];
global.monchk = [
  function (x) {
    if (ttl.mone1.have === false) {
      if (global.stat.moneyg >= GOLD) {
        giveTitle(ttl.mone1);
      }
    }
  },
  //  function(x){if(ttl.mone2.have===false){if(global.stat.moneyg>=GOLD){giveTitle(ttl.mone2)}}},
  //  function(x){if(ttl.mone3.have===false){if(global.stat.moneyg>=GOLD){giveTitle(ttl.mone3)}}},
];
global.ttlschk = [
  function (x) {
    if (ttl.ttsttl1.have === false) {
      if (global.titles.length >= 10) {
        giveTitle(ttl.ttsttl1);
      }
    }
  },
  function (x) {
    if (ttl.ttsttl2.have === false) {
      if (global.titles.length >= 25) {
        giveTitle(ttl.ttsttl2);
      }
    }
  },
  function (x) {
    if (ttl.ttsttl3.have === false) {
      if (global.titles.length >= 50) {
        giveTitle(ttl.ttsttl3);
      }
    }
  },
];

global.shptchk = [
  function (x) {
    if (ttl.shpt1.have === false) {
      if (global.stat.buyt >= 500) {
        giveTitle(ttl.shpt1);
      }
    }
  },
  //  function(x){if(ttl.shpt2.have===false){if(global.stat.buyt>=5000){giveTitle(ttl.shpt2)}}},
  //  function(x){if(ttl.shpt3.have===false){if(global.stat.buyt>=10000){giveTitle(ttl.shpt3)}}},
];
global.cptchk = [
  function (x) {
    if (ttl.cpet1.have === false) {
      if (global.stat.cat_c >= 9999) {
        giveTitle(ttl.cpet1);
      }
    }
  },
];
global.htrchl = [
  function (x) {
    if (ttl.hstr1.have === false) {
      if (x >= 100) {
        giveTitle(ttl.hstr1);
      }
    }
  },
  function (x) {
    if (ttl.hstr2.have === false) {
      if (x >= 250) {
        giveTitle(ttl.hstr2);
      }
    }
  },
  function (x) {
    if (ttl.hstr3.have === false) {
      if (x >= 500) {
        giveTitle(ttl.hstr3);
      }
    }
  },
];
global.nethmchk = [
  function (x) {
    if (ttl.neet.have === false) {
      if (global.stat.athmec >= YEAR) {
        giveTitle(ttl.neet);
      }
    }
  },
  function (x) {
    if (ttl.neet2.have === false) {
      if (global.stat.athmec >= YEAR * 5) {
        giveTitle(ttl.neet2);
      }
    }
  },
  function (x) {
    if (ttl.neet3.have === false) {
      if (global.stat.athmec >= YEAR * 10) {
        giveTitle(ttl.neet3);
      }
    }
  },
];
