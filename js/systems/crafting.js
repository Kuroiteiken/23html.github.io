///////////////////////////////////////////
//REC
///////////////////////////////////////////

function Recipe() {
  this.name = "";
  this.locked = true;
  this.allow = true;
  this.have = false;
  this.rec = [];
  this.res = [];
  this.srec = function () {};
  this.srece = false;
  this.srect = null;
  this.onmake = function () {};
  this.type = 0;
}

rcp.test = new Recipe();
rcp.test.id = 101;
rcp.test.name = "Test";
rcp.test.rec = [
  { item: acc.dticket, amount: 1 },
  { item: acc.dticket, amount: 1 },
];
rcp.test.res = [{ item: item.sbone, amount: 991 }];

rcp.wp2 = new Recipe();
rcp.wp2.id = 102;
rcp.wp2.name = "Sharpened Stick";
rcp.wp2.type = 3;
rcp.wp2.rec = [{ item: wpn.stk1, amount: 1 }];
rcp.wp2.res = [{ item: wpn.stk2, amount: 1 }];
rcp.wp2.onmake = function () {
  giveCrExp(skl.crft, 0.5, 1);
};
rcp.wp2.srect = ["Any sharp tool"];
rcp.wp2.srec = [
  function () {
    for (const hh in inv)
      if (inv[hh].ctype === 0 && inv[hh].cls[0] >= 2) return true;
  },
];

rcp.strawp = new Recipe();
rcp.strawp.id = 103;
rcp.strawp.name = "Straw Pendant";
rcp.strawp.type = 4;
rcp.strawp.rec = [{ item: item.sstraw, amount: 5 }];
rcp.strawp.res = [{ item: acc.strawp, amount: 1 }];
rcp.strawp.onmake = function () {
  giveCrExp(skl.crft, 0.1, 1);
};

rcp.hlpd = new Recipe();
rcp.hlpd.id = 104;
rcp.hlpd.name = "Low-grade Healing Powder";
rcp.hlpd.type = 2;
rcp.hlpd.rec = [{ item: item.hrb1, amount: 3 }];
rcp.hlpd.res = [{ item: item.hlpd, amount: 1 }];
rcp.hlpd.onmake = function () {
  giveCrExp(skl.alch, 0.2, 1);
};

rcp.borc = new Recipe();
rcp.borc.id = 105;
rcp.borc.name = "Boiled Rice";
rcp.borc.type = 1;
rcp.borc.rec = [
  { item: item.rice, amount: 2 },
  { item: item.watr, amount: 2 },
];
rcp.borc.res = [{ item: item.borc, amount: 1 }];
rcp.borc.onmake = function () {
  giveCrExp(skl.cook, 0.5, 1);
};
rcp.borc.srect = ["Nearby firesource"];
rcp.borc.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.begg = new Recipe();
rcp.begg.id = 106;
rcp.begg.name = "Boiled Egg";
rcp.begg.type = 1;
rcp.begg.rec = [
  { item: item.eggn, amount: 1 },
  { item: item.watr, amount: 2 },
];
rcp.begg.res = [{ item: item.begg, amount: 1 }];
rcp.begg.onmake = function () {
  giveCrExp(skl.cook, 0.2, 1);
};
rcp.begg.srect = ["Nearby firesource"];
rcp.begg.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.trr = new Recipe();
rcp.trr.id = 107;
rcp.trr.name = "Trinity";
rcp.trr.type = 4;
rcp.trr.rec = [
  { item: acc.mstn, amount: 1 },
  { item: acc.srng, amount: 1 },
  { item: acc.bstn, amount: 1 },
  { item: acc.mstn, amount: 1 },
];
rcp.trr.res = [{ item: acc.trrng, amount: 1 }];

rcp.rsmt = new Recipe();
rcp.rsmt.id = 108;
rcp.rsmt.name = "Roasted Meat";
rcp.rsmt.type = 1;
rcp.rsmt.rec = [{ item: item.rwmt1, amount: 1 }];
rcp.rsmt.res = [{ item: item.rsmt, amount: 1 }];
rcp.rsmt.cmake = function () {
  const rn = random() + skl.cook.lvl * 0.1;
  if (rn >= 0.3) giveItem(rcp.rsmt.res[0].item);
  else {
    giveItem(item.brmt);
    msg("It didn't turn out very well...", "black", null, null, "lightgrey");
  }
  giveCrExp(skl.cook, 0.2, 1);
};
rcp.rsmt.srect = ["Nearby firesource"];
rcp.rsmt.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.segg = new Recipe();
rcp.segg.id = 109;
rcp.segg.name = "Scrambled Eggs";
rcp.segg.type = 1;
rcp.segg.rec = [{ item: item.eggn, amount: 2 }];
rcp.segg.res = [{ item: item.segg, amount: 1 }];
rcp.segg.onmake = function () {
  giveCrExp(skl.cook, 1, 2);
};
rcp.segg.srect = ["Nearby firesource"];
rcp.segg.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.lnch1 = new Recipe();
rcp.lnch1.id = 110;
rcp.lnch1.name = "Bacon and Eggs";
rcp.lnch1.type = 1;
rcp.lnch1.rec = [
  { item: item.eggn, amount: 2 },
  { item: item.bac, amount: 1 },
];
rcp.lnch1.res = [{ item: item.lnch1, amount: 1 }];
rcp.lnch1.onmake = function () {
  giveCrExp(skl.cook, 5, 3);
};
rcp.lnch1.srect = ["Nearby firesource"];
rcp.lnch1.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.lnch2 = new Recipe();
rcp.lnch2.id = 111;
rcp.lnch2.name = "Morning Set";
rcp.lnch2.type = 1;
rcp.lnch2.rec = [
  { item: item.eggn, amount: 2 },
  { item: item.brd, amount: 1 },
];
rcp.lnch2.res = [{ item: item.lnch2, amount: 1 }];
rcp.lnch2.onmake = function () {
  giveCrExp(skl.cook, 8, 3);
};
rcp.lnch2.srect = ["Nearby firesource"];
rcp.lnch2.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.lnch3 = new Recipe();
rcp.lnch3.id = 112;
rcp.lnch3.name = "Lunch Set";
rcp.lnch3.type = 1;
rcp.lnch3.rec = [
  { item: item.eggn, amount: 2 },
  { item: item.brd, amount: 1 },
  { item: item.rwmt1, amount: 1 },
];
rcp.lnch3.res = [{ item: item.lnch3, amount: 1 }];
rcp.lnch3.onmake = function () {
  giveCrExp(skl.cook, 10, 4);
};
rcp.lnch3.srect = ["Nearby firesource"];
rcp.lnch3.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.orgs = new Recipe();
rcp.orgs.id = 113;
rcp.orgs.name = "Onion Rings";
rcp.orgs.type = 1;
rcp.orgs.rec = [
  { item: item.flr, amount: 2 },
  { item: item.onn, amount: 1 },
];
rcp.orgs.res = [{ item: item.orgs, amount: 1 }];
rcp.orgs.onmake = function () {
  giveCrExp(skl.cook, 8, 4);
};
rcp.orgs.srect = ["Nearby firesource"];
rcp.orgs.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.ffsh1 = new Recipe();
rcp.ffsh1.id = 114;
rcp.ffsh1.name = "Cooked Fish";
rcp.ffsh1.type = 1;
rcp.ffsh1.rec = [{ item: item.fsh1, amount: 1 }];
rcp.ffsh1.res = [{ item: item.ffsh1, amount: 1 }];
rcp.ffsh1.onmake = function () {
  giveCrExp(skl.cook, 2, 2);
};
rcp.ffsh1.srect = ["Nearby firesource"];
rcp.ffsh1.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.ffsh2 = new Recipe();
rcp.ffsh2.id = 115;
rcp.ffsh2.name = "Batter Fried Fish";
rcp.ffsh2.type = 1;
rcp.ffsh2.rec = [
  { item: item.fsh2, amount: 1 },
  { item: item.flr, amount: 1 },
  { item: item.eggn, amount: 1 },
  { item: item.salt, amount: 1 },
];
rcp.ffsh2.res = [{ item: item.ffsh2, amount: 1 }];
rcp.ffsh2.onmake = function () {
  giveCrExp(skl.cook, 12, 5);
};
rcp.ffsh2.srect = ["Nearby firesource"];
rcp.ffsh2.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.fnori = new Recipe();
rcp.fnori.id = 116;
rcp.fnori.name = "Fried Nori";
rcp.fnori.type = 1;
rcp.fnori.rec = [
  { item: item.nori, amount: 1 },
  { item: item.salt, amount: 1 },
];
rcp.fnori.res = [{ item: item.fnori, amount: 1 }];
rcp.fnori.onmake = function () {
  giveCrExp(skl.cook, 4, 4);
};
rcp.fnori.srect = ["Nearby firesource"];
rcp.fnori.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.cbun1 = new Recipe();
rcp.cbun1.id = 117;
rcp.cbun1.name = "Steamed Bun";
rcp.cbun1.type = 1;
rcp.cbun1.rec = [
  { item: item.watr, amount: 1 },
  { item: item.salt, amount: 1 },
  { item: item.dgh, amount: 1 },
];
rcp.cbun1.res = [{ item: item.cbun1, amount: 1 }];
rcp.cbun1.onmake = function () {
  giveCrExp(skl.cook, 5, 3);
};
rcp.cbun1.srect = ["Nearby firesource"];
rcp.cbun1.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.dgh = new Recipe();
rcp.dgh.id = 118;
rcp.dgh.name = "Dough";
rcp.dgh.type = 1;
rcp.dgh.rec = [
  { item: item.watr, amount: 1 },
  { item: item.flr, amount: 3 },
];
rcp.dgh.res = [{ item: item.dgh, amount: 1 }];
rcp.dgh.onmake = function () {
  giveCrExp(skl.cook, 0.5, 2);
};

rcp.flr = new Recipe();
rcp.flr.id = 119;
rcp.flr.name = "Flour";
rcp.flr.type = 1;
rcp.flr.rec = [{ item: item.wht, amount: 1 }];
rcp.flr.res = [{ item: item.flr, amount: 2 }];
rcp.flr.onmake = function () {
  giveCrExp(skl.cook, 0.2, 2);
};

rcp.wbdl = new Recipe();
rcp.wbdl.id = 120;
rcp.wbdl.name = "Small Wood Bundle";
rcp.wbdl.type = 5;
rcp.wbdl.rec = [{ item: item.wdc, amount: 25 }];
rcp.wbdl.res = [{ item: item.fwd1, amount: 1 }];
rcp.wbdl.onmake = function () {
  giveCrExp(skl.crft, 0.5, 1);
};

rcp.sshl = new Recipe();
rcp.sshl.id = 121;
rcp.sshl.name = "Star Shell";
rcp.sshl.type = 4;
rcp.sshl.rec = [
  { item: acc.snch, amount: 1 },
  { item: acc.mnch, amount: 1 },
];
rcp.sshl.res = [{ item: acc.sshl, amount: 1 }];
rcp.sshl.onmake = function () {
  giveCrExp(skl.crft, 10);
};

rcp.hptn1 = new Recipe();
rcp.hptn1.id = 122;
rcp.hptn1.name = "Lesser Healing Potion";
rcp.hptn1.type = 2;
rcp.hptn1.rec = [
  { item: item.slm, amount: 1 },
  { item: item.hlpd, amount: 2 },
];
rcp.hptn1.res = [{ item: item.hptn1, amount: 1 }];
rcp.hptn1.onmake = function () {
  giveCrExp(skl.alch, 1, 2);
};

rcp.hpck = new Recipe();
rcp.hpck.id = 123;
rcp.hpck.name = "Hippo Cookie";
rcp.hpck.type = 1;
rcp.hpck.rec = [
  { item: item.flr, amount: 1 },
  { item: item.hzlnt, amount: 1 },
  { item: item.sgr, amount: 1 },
  { item: item.mlkn, amount: 1 },
];
rcp.hpck.res = [{ item: item.hpck, amount: 1 }];
rcp.hpck.onmake = function () {
  giveCrExp(skl.cook, 7, 4);
};
rcp.hpck.srect = ["Nearby firesource"];
rcp.hpck.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.sdl1 = new Recipe();
rcp.sdl1.id = 124;
rcp.sdl1.name = "Straw Effigy";
rcp.sdl1.type = 4;
rcp.sdl1.rec = [{ item: item.sstraw, amount: 50 }];
rcp.sdl1.res = [{ item: acc.sdl1, amount: 1 }];
rcp.sdl1.onmake = function () {
  giveCrExp(skl.crft, 3, 2);
};

rcp.mnknk = new Recipe();
rcp.mnknk.id = 125;
rcp.mnknk.name = "Maneki-Neko";
rcp.mnknk.type = 4;
rcp.mnknk.rec = [
  { item: acc.cfgn, amount: 1 },
  { item: acc.lckcn, amount: 1 },
];
rcp.mnknk.res = [{ item: acc.mnknk, amount: 1 }];
rcp.mnknk.onmake = function () {
  giveCrExp(skl.crft, 25);
};

rcp.wdl1 = new Recipe();
rcp.wdl1.id = 126;
rcp.wdl1.name = "Wood Effigy";
rcp.wdl1.type = 4;
rcp.wdl1.rec = [{ item: item.wdc, amount: 40 }];
rcp.wdl1.res = [{ item: acc.wdl1, amount: 1 }];
rcp.wdl1.onmake = function () {
  giveCrExp(skl.crft, 3, 2);
};
rcp.wdl1.srect = ["Any sharp tool"];
rcp.wdl1.srec = [
  function () {
    for (const hh in inv)
      if (inv[hh].ctype === 0 && inv[hh].cls[0] >= 2) return true;
  },
];

rcp.gdl1 = new Recipe();
rcp.gdl1.id = 127;
rcp.gdl1.name = "Soul Puppet";
rcp.gdl1.type = 4;
rcp.gdl1.rec = [
  { item: acc.wdl1, amount: 1 },
  { item: acc.sdl1, amount: 1 },
  { item: acc.bdl1, amount: 1 },
  { item: item.lsrd, amount: 5 },
];
rcp.gdl1.res = [{ item: acc.gdl1, amount: 1 }];
rcp.gdl1.onmake = function () {
  giveCrExp(skl.crft, 5, 2);
};

rcp.tbrwd = new Recipe();
rcp.tbrwd.id = 128;
rcp.tbrwd.name = "Tea";
rcp.tbrwd.type = 1;
rcp.tbrwd.rec = [
  { item: item.tlvs, amount: 1 },
  { item: item.watr, amount: 1 },
];
rcp.tbrwd.res = [{ item: item.tbrwd, amount: 1 }];
rcp.tbrwd.onmake = function () {
  giveCrExp(skl.cook, 1);
};

rcp.brd = new Recipe();
rcp.brd.id = 129;
rcp.brd.name = "Bread";
rcp.brd.type = 1;
rcp.brd.rec = [{ item: item.dgh, amount: 1 }];
rcp.brd.res = [{ item: item.brd, amount: 1 }];
rcp.brd.cmake = function () {
  const rn = random() + skl.cook.lvl * 0.05;
  if (rn >= 0.25) giveItem(rcp.brd.res[0].item);
  else {
    giveItem(item.brdb);
    msg("It didn't turn out very well...", "black", null, null, "lightgrey");
  }
  giveCrExp(skl.cook, 2, 3);
};
rcp.brd.srect = ["Nearby firesource"];
rcp.brd.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.steak = new Recipe();
rcp.steak.id = 130;
rcp.steak.name = "Steak";
rcp.steak.type = 1;
rcp.steak.rec = [
  { item: item.salt, amount: 1 },
  { item: item.rwmt1, amount: 1 },
  { item: item.spc1, amount: 1 },
];
rcp.steak.res = [{ item: item.steak, amount: 1 }];
rcp.steak.onmake = function () {
  giveCrExp(skl.cook, 7);
};
rcp.steak.srect = ["Nearby firesource", "Cooking lvl: 3"];
rcp.steak.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
  function () {
    if (skl.cook.lvl === 3) return true;
  },
];

rcp.cnmnb = new Recipe();
rcp.cnmnb.id = 131;
rcp.cnmnb.name = "Cinnamon Bun";
rcp.cnmnb.type = 1;
rcp.cnmnb.rec = [
  { item: item.sgr, amount: 1 },
  { item: item.bttr, amount: 1 },
  { item: item.cnmn, amount: 1 },
  { item: item.wht, amount: 1 },
];
rcp.cnmnb.res = [{ item: item.cnmnb, amount: 1 }];
rcp.cnmnb.onmake = function () {
  giveCrExp(skl.cook, 6, 5);
};
rcp.cnmnb.srect = ["Nearby firesource"];
rcp.cnmnb.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.brth = new Recipe();
rcp.brth.id = 132;
rcp.brth.name = "Broth";
rcp.brth.type = 1;
rcp.brth.rec = [
  { item: item.watr, amount: 2 },
  { item: item.rwmt1, amount: 1 },
];
rcp.brth.res = [{ item: item.brth, amount: 1 }];
rcp.brth.onmake = function () {
  giveCrExp(skl.cook, 0.5, 2);
};
rcp.brth.srect = ["Nearby firesource"];
rcp.brth.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.eggsp = new Recipe();
rcp.eggsp.id = 133;
rcp.eggsp.name = "Egg Soup";
rcp.eggsp.type = 1;
rcp.eggsp.rec = [
  { item: item.brth, amount: 1 },
  { item: item.eggn, amount: 2 },
  { item: item.salt, amount: 1 },
  { item: item.scln, amount: 1 },
];
rcp.eggsp.res = [{ item: item.eggsp, amount: 1 }];
rcp.eggsp.onmake = function () {
  giveCrExp(skl.cook, 5, 4);
};
rcp.eggsp.srect = ["Nearby firesource"];
rcp.eggsp.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.crmchd = new Recipe();
rcp.crmchd.id = 134;
rcp.crmchd.name = "Creamy Chowder";
rcp.crmchd.type = 1;
rcp.crmchd.rec = [
  { item: item.mlkn, amount: 1 },
  { item: item.ches, amount: 1 },
  { item: item.rwmt1, amount: 1 },
  { item: item.potat, amount: 1 },
];
rcp.crmchd.res = [{ item: item.crmchd, amount: 1 }];
rcp.crmchd.onmake = function () {
  giveCrExp(skl.cook, 15);
};
rcp.crmchd.srect = ["Nearby firesource"];
rcp.crmchd.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.mink = new Recipe();
rcp.mink.id = 135;
rcp.mink.name = "Magic Ink";
rcp.mink.type = 4;
rcp.mink.rec = [
  { item: acc.qill, amount: 1 },
  { item: acc.bink, amount: 1 },
];
rcp.mink.res = [{ item: acc.mink, amount: 1 }];
rcp.mink.onmake = function () {
  giveCrExp(skl.crft, 2.5, 4);
};

rcp.msoop = new Recipe();
rcp.msoop.id = 136;
rcp.msoop.name = "Mushroom Soup";
rcp.msoop.type = 1;
rcp.msoop.rec = [
  { item: item.watr, amount: 2 },
  { item: item.mshr, amount: 2 },
  { item: item.potat, amount: 1 },
  { item: item.onn, amount: 1 },
];
rcp.msoop.res = [{ item: item.msoop, amount: 1 }];
rcp.msoop.onmake = function () {
  giveCrExp(skl.cook, 4, 3);
};
rcp.msoop.srect = ["Nearby firesource"];
rcp.msoop.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.jln4 = new Recipe();
rcp.jln4.id = 137;
rcp.jln4.name = "Grand Gelatin";
rcp.jln4.type = 4;
rcp.jln4.rec = [
  { item: acc.jln1, amount: 1 },
  { item: acc.jln2, amount: 1 },
  { item: acc.jln3, amount: 1 },
];
rcp.jln4.res = [{ item: acc.jln4, amount: 1 }];
rcp.jln4.onmake = function () {
  giveCrExp(skl.crft, 15);
};

rcp.strwks = new Recipe();
rcp.strwks.id = 138;
rcp.strwks.name = "Straw Kasa";
rcp.strwks.type = 4;
rcp.strwks.rec = [{ item: item.sstraw, amount: 30 }];
rcp.strwks.res = [{ item: eqp.strwks, amount: 1 }];
rcp.strwks.onmake = function () {
  giveCrExp(skl.crft, 3, 2);
};

rcp.bdl1 = new Recipe();
rcp.bdl1.id = 139;
rcp.bdl1.name = "Bone Doll";
rcp.bdl1.type = 4;
rcp.bdl1.rec = [{ item: item.sbone, amount: 30 }];
rcp.bdl1.res = [{ item: acc.bdl1, amount: 1 }];
rcp.bdl1.onmake = function () {
  giveCrExp(skl.crft, 3, 2);
};
rcp.bdl1.srect = ["Any sharp tool"];
rcp.bdl1.srec = [
  function () {
    for (const hh in inv)
      if (inv[hh].ctype === 0 && inv[hh].cls[0] >= 2) return true;
  },
];

rcp.wvbkt = new Recipe();
rcp.wvbkt.id = 140;
rcp.wvbkt.name = "Straw Basket";
rcp.wvbkt.type = 5;
rcp.wvbkt.rec = [{ item: item.sstraw, amount: 40 }];
rcp.wvbkt.res = [{ item: item.wvbkt, amount: 1 }];
rcp.wvbkt.onmake = function () {
  giveCrExp(skl.crft, 3, 2);
};

rcp.hlstw = new Recipe();
rcp.hlstw.id = 141;
rcp.hlstw.name = "Healing Stew";
rcp.hlstw.type = 1;
rcp.hlstw.rec = [
  { item: item.watr, amount: 2 },
  { item: item.hrb1, amount: 28 },
];
rcp.hlstw.res = [{ item: item.hlstw, amount: 1 }];
rcp.hlstw.onmake = function () {
  giveCrExp(skl.cook, 1, 2);
};
rcp.hlstw.srect = ["Nearby firesource"];
rcp.hlstw.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.bcrc = new Recipe();
rcp.bcrc.id = 142;
rcp.bcrc.name = "Bone Cracker";
rcp.bcrc.type = 1;
rcp.bcrc.rec = [{ item: item.sbone, amount: 25 }];
rcp.bcrc.res = [{ item: item.bcrc, amount: 1 }];
rcp.bcrc.onmake = function () {
  giveCrExp(skl.cook, 1.7, 3);
};
rcp.bcrc.srect = ["Nearby firesource"];
rcp.bcrc.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.bcrrt = new Recipe();
rcp.bcrrt.id = 143;
rcp.bcrrt.name = "Boiled Carrot";
rcp.bcrrt.type = 1;
rcp.bcrrt.rec = [
  { item: item.crrt, amount: 1 },
  { item: item.watr, amount: 1 },
];
rcp.bcrrt.res = [{ item: item.bcrrt, amount: 1 }];
rcp.bcrrt.onmake = function () {
  giveCrExp(skl.cook, 0.3, 2);
};
rcp.bcrrt.srect = ["Nearby firesource"];
rcp.bcrrt.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.jsdch = new Recipe();
rcp.jsdch.id = 144;
rcp.jsdch.name = "Jelly Sandwich";
rcp.jsdch.type = 1;
rcp.jsdch.rec = [
  { item: item.jll, amount: 1 },
  { item: item.brd, amount: 1 },
  { item: item.ltcc, amount: 1 },
];
rcp.jsdch.res = [{ item: item.jsdch, amount: 1 }];
rcp.jsdch.onmake = function () {
  giveCrExp(skl.cook, 0.8, 2);
};

rcp.dcard1 = new Recipe();
rcp.dcard1.id = 145;
rcp.dcard1.name = "Discount Card";
rcp.dcard1.type = 4;
rcp.dcard1.rec = [{ item: acc.dticket, amount: 5 }];
rcp.dcard1.res = [{ item: acc.dcard1, amount: 1 }];
rcp.dcard1.onmake = function () {
  giveCrExp(skl.crft, 16);
};

rcp.wsb = new Recipe();
rcp.wsb.id = 146;
rcp.wsb.name = "Wastebread";
rcp.wsb.type = 1;
rcp.wsb.rec = [{ item: item.agrns, amount: 3 }];
rcp.wsb.res = [{ item: item.wsb, amount: 1 }];
rcp.wsb.onmake = function () {
  giveCrExp(skl.cook, 0.5, 3);
};

rcp.stksld = new Recipe();
rcp.stksld.id = 147;
rcp.stksld.name = "Stake Shield";
rcp.stksld.type = 4;
rcp.stksld.rec = [{ item: wpn.stk2, amount: 4 }];
rcp.stksld.res = [{ item: sld.stksld, amount: 1 }];
rcp.stksld.onmake = function () {
  giveCrExp(skl.crft, 2.5, 2);
};

rcp.clrpin = new Recipe();
rcp.clrpin.id = 148;
rcp.clrpin.name = "Clover Pin";
rcp.clrpin.type = 4;
rcp.clrpin.rec = [{ item: item.lckl, amount: 7 }];
rcp.clrpin.res = [{ item: acc.clrpin, amount: 1 }];
rcp.clrpin.onmake = function () {
  giveCrExp(skl.crft, 77);
};

rcp.ptchct = new Recipe();
rcp.ptchct.id = 149;
rcp.ptchct.name = "Patchwork Coat";
rcp.ptchct.type = 4;
rcp.ptchct.rec = [
  { item: item.cclth, amount: 11 },
  { item: item.thrdnl, amount: 4 },
];
rcp.ptchct.res = [{ item: eqp.ptchct, amount: 1 }];
rcp.ptchct.onmake = function () {
  giveCrExp(skl.crft, 3, 2);
  giveCrExp(skl.tlrng, 2, 1);
};
rcp.ptchct.srect = ["Tailoring tool lvl: 1"];
rcp.ptchct.srec = [
  function () {
    for (const hh in inv) if (inv[hh].tlrq >= 1) return true;
  },
];

rcp.ptchpts = new Recipe();
rcp.ptchpts.id = 150;
rcp.ptchpts.name = "Patchwork Pants";
rcp.ptchpts.type = 4;
rcp.ptchpts.rec = [
  { item: item.cclth, amount: 9 },
  { item: item.thrdnl, amount: 3 },
];
rcp.ptchpts.res = [{ item: eqp.ptchpts, amount: 1 }];
rcp.ptchpts.onmake = function () {
  giveCrExp(skl.crft, 2, 2);
  giveCrExp(skl.tlrng, 3, 1);
};
rcp.ptchpts.srect = ["Tailoring tool lvl: 1"];
rcp.ptchpts.srec = [
  function () {
    for (const hh in inv) if (inv[hh].tlrq >= 1) return true;
  },
];

rcp.bblkt = new Recipe();
rcp.bblkt.id = 151;
rcp.bblkt.name = "Ragwork Blanket";
rcp.bblkt.type = 5;
rcp.bblkt.rec = [
  { item: item.cclth, amount: 40 },
  { item: item.thrdnl, amount: 18 },
];
rcp.bblkt.res = [{ item: item.bblkt, amount: 1 }];
rcp.bblkt.onmake = function () {
  giveCrExp(skl.crft, 4, 2);
  giveCrExp(skl.tlrng, 7, 1);
};
rcp.bblkt.srect = ["Tailoring tool lvl: 1"];
rcp.bblkt.srec = [
  function () {
    for (const hh in inv) if (inv[hh].tlrq >= 1) return true;
  },
];

rcp.spillw = new Recipe();
rcp.spillw.id = 152;
rcp.spillw.name = "Straw Pillow";
rcp.spillw.type = 5;
rcp.spillw.rec = [
  { item: item.cclth, amount: 15 },
  { item: item.thrdnl, amount: 8 },
  { item: item.sstraw, amount: 80 },
];
rcp.spillw.res = [{ item: item.spillw, amount: 1 }];
rcp.spillw.onmake = function () {
  giveCrExp(skl.crft, 3, 2);
  giveCrExp(skl.tlrng, 4, 1);
};

rcp.alseto = new Recipe();
rcp.alseto.id = 153;
rcp.alseto.name = "Basic Alchemy Set";
rcp.alseto.type = 4;
rcp.alseto.rec = [
  { item: acc.mpst, amount: 1 },
  { item: acc.mshst, amount: 1 },
  { item: acc.mhhst, amount: 1 },
];
rcp.alseto.res = [{ item: acc.alseto, amount: 1 }];
rcp.alseto.onmake = function () {
  giveCrExp(skl.crft, 15, 2);
};

rcp.mdcag = new Recipe();
rcp.mdcag.id = 154;
rcp.mdcag.name = "Adhesive Bandage";
rcp.mdcag.type = 4;
rcp.mdcag.rec = [
  { item: item.bdgh, amount: 1 },
  { item: item.watr, amount: 5 },
  { item: item.hrb1, amount: 50 },
  { item: item.slm, amount: 10 },
];
rcp.mdcag.res = [{ item: acc.mdcag, amount: 1 }];
rcp.mdcag.onmake = function () {
  giveCrExp(skl.alch, 2, 2);
};

rcp.mdcbg = new Recipe();
rcp.mdcbg.id = 155;
rcp.mdcbg.name = "Medicated Bandage";
rcp.mdcbg.type = 4;
rcp.mdcbg.rec = [
  { item: acc.mdcag, amount: 1 },
  { item: acc.vtmns, amount: 1 },
  { item: item.hptn1, amount: 8 },
];
rcp.mdcbg.res = [{ item: acc.mdcbg, amount: 1 }];
rcp.mdcbg.onmake = function () {
  giveCrExp(skl.alch, 3, 2);
};

rcp.cyrn = new Recipe();
rcp.cyrn.id = 156;
rcp.cyrn.name = "Yarn Ball";
rcp.cyrn.type = 5;
rcp.cyrn.rec = [{ item: item.thrdnl, amount: 200 }];
rcp.cyrn.res = [{ item: item.cyrn, amount: 1 }];
rcp.cyrn.onmake = function () {
  giveCrExp(skl.crft, 4, 2);
};

rcp.fwdpile = new Recipe();
rcp.fwdpile.id = 157;
rcp.fwdpile.name = "Firewood Pile";
rcp.fwdpile.type = 5;
rcp.fwdpile.rec = [{ item: item.fwd1, amount: 60 }];
rcp.fwdpile.res = [{ item: item.fwdpile, amount: 1 }];
rcp.fwdpile.onmake = function () {
  giveCrExp(skl.crft, 5, 2);
};

rcp.fmlim2 = new Recipe();
rcp.fmlim2.id = 158;
rcp.fmlim2.name = "Family Heirloom+";
rcp.fmlim2.type = 4;
rcp.fmlim2.rec = [
  { item: acc.strawp, amount: 1 },
  { item: acc.fmlim, amount: 1 },
];
rcp.fmlim2.res = [{ item: acc.fmlim2, amount: 1 }];
rcp.fmlim2.onmake = function () {
  giveCrExp(skl.crft, 5, 2);
};

rcp.appljc = new Recipe();
rcp.appljc.id = 159;
rcp.appljc.name = "Apple Juice";
rcp.appljc.type = 1;
rcp.appljc.rec = [{ item: item.appl, amount: 3 }];
rcp.appljc.res = [
  { item: item.appljc, amount: 1 },
  { item: item.frtplp, amount: 1 },
];
rcp.appljc.onmake = function () {
  giveCrExp(skl.cook, 0.5, 2);
};

rcp.bdgh = new Recipe();
rcp.bdgh.id = 160;
rcp.bdgh.name = "Bandage";
rcp.bdgh.type = 2;
rcp.bdgh.rec = [
  { item: item.cclth, amount: 1 },
  { item: item.watr, amount: 3 },
];
rcp.bdgh.res = [{ item: item.bdgh, amount: 1 }];
rcp.bdgh.onmake = function () {
  giveCrExp(skl.crft, 0.5, 2);
};
rcp.bdgh.srect = ["Nearby firesource"];
rcp.bdgh.srec = [
  function () {
    if (you.mods.ckfre > 0) return true;
  },
];

rcp.wfng = new Recipe();
rcp.wfng.id = 161;
rcp.wfng.name = "Wolf Fang Necklace";
rcp.wfng.type = 4;
rcp.wfng.rec = [
  { item: item.wfng, amount: 5 },
  { item: item.thrdnl, amount: 1 },
];
rcp.wfng.res = [{ item: acc.wfng, amount: 1 }];
rcp.wfng.onmake = function () {
  giveCrExp(skl.crft, 5, 3);
};

rcp.wfar = new Recipe();
rcp.wfar.id = 162;
rcp.wfar.name = "Wolf Array";
rcp.wfar.type = 4;
rcp.wfar.rec = [{ item: acc.wfng, amount: 3 }];
rcp.wfar.res = [{ item: acc.wfar, amount: 1 }];
rcp.wfar.onmake = function () {
  giveCrExp(skl.crft, 10, 3);
};

function evaluateSpecialRequirementsForRecipe(recipe) {
  if (recipe.srect == null) {
    return [0];
  }

  const results = [];
  for (const i in recipe.srec) {
    results[i] = recipe.srec[i]() === true ? 1 : 2;
  }
  return results;
}

function scan2(arr, val, am) {
  for (let o = 0; o < arr.length + 1; o++) {
    if (o === arr.length) return { a: false, b: arr[o] };
    if (arr[o].id === val.id && arr[o].amount >= am)
      return { a: true, b: arr[o] };
    else continue;
  }
}

function canMake(rc, times) {
  const missing = [];
  const has = [];
  const z = [];
  const b = [];
  let r = [];
  const o = evaluateSpecialRequirementsForRecipe(rc);
  for (let i = 0; i < rc.rec.length; i++) {
    let sc = {};
    if (!rc.rec[i].item.slot) {
      sc = scan2(inv, rc.rec[i].item, rc.rec[i].amount * times);
      z.push(rc.rec[i].item.amount * times);
    } else {
      const ar = findworst(inv, rc.rec[i].item);
      if (ar.length >= rc.rec[i].amount * times) sc.a = true;
      z.push(ar.length);
      r = ar;
    }
    if (!sc.a) {
      missing.push(rc.rec[i].item);
      b.push(false);
    } else {
      has.push(rc.rec[i].item);
      b.push(true);
    }
  }
  for (const a in global.tstcr) global.tstcr[a].testc = false;
  return {
    x: missing,
    y: has,
    z,
    o,
    success: missing.length === 0 && !o.includes(2),
    b,
    r,
  };
}

function make(rc, rp, times) {
  times = times || 1;
  const check = canMake(rc, times);
  if (rp || !check.success) {
    return check;
  }
  for (let k = 0; k < times; k++) {
    for (let j = 0; j < rc.rec.length; j++) {
      if (rc.rec[j].return) continue;
      if (!rc.rec[j].item.slot) {
        const itemToAlter = scan2(inv, rc.rec[j].item, rc.rec[j].amount).b;
        itemToAlter.amount -= rc.rec[j].amount;
        if (itemToAlter.amount === 0) removeItem(itemToAlter);
      } else {
        const ar = findworst(inv, rc.rec[j].item);
        const finar = [];
        for (let m = 0; m < rc.rec[j].amount; m++) finar.push(ar[m]);
        for (const m in finar) removeItem(finar[m]);
      }
    }
    if (!!rc.cmake) {
      rc.cmake();
    } else {
      for (const itm in rc.res) {
        if (!rc.res[itm].amount_max)
          giveItem(rc.res[itm].item, rc.res[itm].amount);
        else {
          giveItem(
            rc.res[itm].item,
            rand(rc.res[itm].amount, rc.res[itm].amount_max),
          );
        }
      }
      rc.onmake();
    }
  }
  isort(global.sm);
}

function Vendor() {
  this.name = "";
  this.items = [];
  this.stock = [];
  this.data = { time: 1, rep: 0 };
  this.timeorig = 1;
  this.restocked = false;
  this.extra = function () {};
  this.onRestock = function () {
    this.restocked = true;
  };
  this.onDayPass = function () {
    if (--this.data.time === 0) {
      restock(this);
      this.data.time = this.timeorig;
      this.onRestock();
      this.extra();
    }
  };
}

vendor.stvr1 = new Vendor();
vendor.stvr1.name = "Street Vendor";
vendor.stvr1.infl = 2;
vendor.stvr1.dfl = 0.3;
vendor.stvr1.items = [
  { item: item.cbun1, p: 6, c: 0.8, min: 1, max: 4 },
  { item: item.strwb, p: 8, c: 0.01, min: 1, max: 8 },
  { item: item.cbun2, p: 7, c: 0.5, min: 1, max: 4 },
  { item: item.brd, p: 5, c: 1, min: 4, max: 8 },
];

vendor.kid1 = new Vendor();
vendor.kid1.name = "Child Trader";
vendor.kid1.items = [
  { item: item.pbl, p: 1, c: 1, min: 10, max: 50 },
  { item: item.mcps, p: 2, c: 0.3, min: 6, max: 16 },
  { item: item.spb, p: 3, c: 0.8, min: 2, max: 8 },
  { item: item.bonig, p: 11, c: 0.2, min: 2, max: 5 },
];

vendor.grc1 = new Vendor();
vendor.grc1.name = "Grocery Shop";
vendor.grc1.data.time = vendor.grc1.timeorig = 3;
vendor.grc1.infl = 1.15;
vendor.grc1.dfl = 0.3;
vendor.grc1.data.rep = 10;
vendor.grc1.repsc = 8;
vendor.grc1.items = [
  { item: item.rice, p: 4, c: 1, min: 40, max: 50 },
  { item: item.eggn, p: 7, c: 1, min: 8, max: 32 },
  { item: item.onn, p: 8, c: 1, min: 5, max: 12 },
  { item: item.salt, p: 25, c: 0.3, min: 2, max: 7 },
  { item: item.grlc, p: 14, c: 0.15, min: 1, max: 8 },
  { item: item.wht, p: 5, c: 1, min: 13, max: 29 },
  { item: item.ltcc, p: 8, c: 0.6, min: 3, max: 6 },
  { item: item.mlkn, p: 10, c: 0.4, min: 2, max: 4 },
  { item: item.appl, p: 5, c: 0.8, min: 5, max: 20 },
  { item: item.brd, p: 12, c: 0.85, min: 3, max: 10 },
  { item: item.bgt, p: 17, c: 0.35, min: 1, max: 6 },
  { item: item.rwmt1, p: 31, c: 0.25, min: 4, max: 8 },
  { item: item.agrns, p: 8, c: 0.2, min: 10, max: 30 },
  { item: item.watr, p: 2, c: 0.85, min: 20, max: 70 },
];
vendor.grc1.extra = function () {
  if (random() < 0.2) chss.grc1.data.gets[0] = false;
};

vendor.gens1 = new Vendor();
vendor.gens1.name = "General Store";
vendor.gens1.time = vendor.gens1.timeorig = 3;
vendor.gens1.infl = 1.2;
vendor.gens1.dfl = 0.2;
vendor.gens1.data.rep = 5;
vendor.gens1.repsc = 4;
vendor.gens1.items = [
  { item: item.fwd1, p: 25, c: 1, min: 8, max: 20 },
  { item: item.coal2, p: 80, c: 0.5, min: 2, max: 5 },
  { item: item.amrthsck, p: 360, c: 0.2, min: 1, max: 1 },
  { item: item.dmkbk, p: 390, c: 0.15, min: 1, max: 1 },
  { item: item.wsb, p: 16, c: 0.7, min: 5, max: 11 },
  { item: wpn.wsrd1, p: 35, c: 0.6, min: 1, max: 3 },
  { item: eqp.rncp, p: 60, c: 0.3, min: 1, max: 3 },
  { item: eqp.rnss, p: 70, c: 0.3, min: 1, max: 3 },
  { item: eqp.tnc, p: 56, c: 0.3, min: 1, max: 3 },
  { item: eqp.sndl, p: 32, c: 0.3, min: 1, max: 6 },
  { item: wpn.bsrd, p: 100, c: 0.3, min: 1, max: 2 },
  { item: wpn.sprw, p: 130, c: 0.3, min: 1, max: 3 },
  { item: item.wine1, p: 116, c: 0.2, min: 1, max: 7 },
  { item: item.rope, p: 100, c: 0.65, min: 1, max: 6 },
  { item: item.msc1, p: 110, c: 0.25, min: 1, max: 4 },
  { item: item.tbwr1, p: 130, c: 0.65, min: 1, max: 4 },
  { item: item.bed2, p: 500, c: 0.45, min: 1, max: 1 },
  { item: item.cndl, p: 200, c: 0.55, min: 1, max: 2 },
  { item: item.cclth, p: 7, c: 0.85, min: 15, max: 50 },
  { item: item.thrdnl, p: 2, c: 0.85, min: 3, max: 70 },
  { item: acc.ndlb, p: 50, c: 0.73, min: 1, max: 15 },
];
vendor.gens1.extra = function () {
  if (random() < 0.2) chss.gens1.data.gets[0] = false;
};

vendor.pha1 = new Vendor();
vendor.pha1.name = "Herbalist";
vendor.pha1.time = vendor.pha1.timeorig = 2;
vendor.pha1.infl = 1.25;
vendor.pha1.dfl = 0.2;
vendor.pha1.data.rep = 5;
vendor.pha1.repsc = 6;
vendor.pha1.items = [
  { item: item.sp1, p: 20, c: 1, min: 3, max: 15 },
  { item: item.sp2, p: 230, c: 0.8, min: 2, max: 10 },
  { item: item.sp3, p: 690, c: 0.7, min: 1, max: 5 },
  { item: item.bdgh, p: 6, c: 0.9, min: 5, max: 15 },
  { item: acc.vtmns, p: 150, c: 0.5, min: 1, max: 3 },
  { item: acc.mpst, p: 100, c: 0.8, min: 1, max: 6 },
  { item: acc.mshst, p: 480, c: 0.6, min: 1, max: 1 },
  { item: acc.mhhst, p: 600, c: 0.4, min: 1, max: 1 },
  { item: item.hptn1, p: 20, c: 1, min: 8, max: 35 },
  { item: item.atd1, p: 40, c: 0.7, min: 4, max: 13 },
  { item: item.psnwrd, p: 400, c: 0.25, min: 2, max: 5 },
  { item: item.smm, p: 70, c: 0.75, min: 2, max: 8 },
  { item: item.mdc1, p: 150, c: 0.75, min: 1, max: 1 },
];
vendor.pha1.extra = function () {
  if (random() < 0.2) chss.pha1.data.gets[0] = false;
};

function restock(vnd) {
  vnd.stock = [];
  shuffle(vnd.items);
  for (let ims = 0; ims < vnd.items.length; ims++) {
    if (
      (!vnd.items[ims].cond || vnd.items[ims].cond() === true) &&
      random() <= vnd.items[ims].c
    )
      vnd.stock.push([
        vnd.items[ims].item,
        rand(vnd.items[ims].min, vnd.items[ims].max),
        vnd.items[ims].p,
      ]);
    vnd.stock.sort(function (a, b) {
      if (a[0].id < b[0].id) return -1;
      if (a[0].id > b[0].id) return 1;
      return 0;
    });
  }
}

function shuffle(arr) {
  const copy = [];
  let index = 0;
  for (const a in arr) copy[a] = arr[a];
  while (copy.length != 0) {
    const val = rand(copy.length - 1);
    arr[index++] = copy[val];
    copy.splice(val, 1);
  }
}
