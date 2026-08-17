// Area definitions: the explorable zones behind each location. An area holds
// its creature population, its remaining size, its drop table, and the handler
// that runs when the player finishes exploring it. Area sizes are part of the
// save, so their order here must stay stable.

function Area() {
  this.name = i18n.t("content.area.nwh.name");
  this.id = 0;
  this.pop = [];
  this.size = 10;
  this.drop = [];
  this.onEnd = function () {};
  this.onDeath = function () {};
}

area.nwh = new Area();
area.nwh.id = 101;
area.nwh.name = i18n.t("content.area.nwh.name");
area.nwh.pop = [{ crt: creature.default, lvlmin: 1, lvlmax: 1, c: 1 }];
area.nwh.size = 1;
z_bake(area.nwh);
global.current_z = area.nwh;

area.trn = new Area();
area.trn.id = 102;
area.trn.name = i18n.t("content.area.trn.name");
area.trn.pop = [
  { crt: creature.sdummy, lvlmin: 1, lvlmax: 9, c: 0.3 },
  { crt: creature.tdummy, lvlmin: 4, lvlmax: 8, c: 0.3 },
  { crt: creature.wdummy, lvlmin: 3, lvlmax: 5, c: 0.3 },
];
area.trn.size = 10000;
z_bake(area.trn);
area.trn.onEnd = function () {
  this.size = -1;
  giveTitle(ttl.thr);
  global.flags.trnex1 = true;
  smove(chss.t3, false);
};
area.trn.drop = [
  { item: item.appl, c: 0.02 },
  {
    item: acc.gpin,
    c: 0.00012,
    cond: () => {
      return ttl.tqtm.tget;
    },
  },
];

area.trnf = new Area();
// This read `area.trn.id`, which overwrote the training area's own id of 102
// and left this area on the constructor default of 0.
area.trnf.id = 107;
area.trnf.name = i18n.t("content.area.trnf.name");
area.trnf.pop = [
  { crt: creature.sdummy, lvlmin: 1, lvlmax: 12, c: 0.3 },
  { crt: creature.tdummy, lvlmin: 7, lvlmax: 13, c: 0.3 },
  { crt: creature.wdummy, lvlmin: 8, lvlmax: 10, c: 0.3 },
];
area.trnf.size = -1;
z_bake(area.trnf);
area.trnf.protected = true;
area.trnf.drop = [
  {
    item: acc.gpin,
    c: 0.00012,
    cond: () => {
      return ttl.tqtm.tget;
    },
  },
];

area.trn1 = new Area();
area.trn1.id = 103;
area.trn1.name = i18n.t("content.area.trn1.name");
area.trn1.pop = [
  { crt: creature.sdummy, lvlmin: 1, lvlmax: 1, c: 0.5 },
  { crt: creature.tdummy, lvlmin: 1, lvlmax: 1, c: 0.5 },
];
area.trn1.size = 10;
z_bake(area.trn1);
area.trn1.onEnd = function () {
  smove(chss.t2, false);
  global.flags.tr1_win = true;
};
area.trn1.onDeath = function () {
  if (!global.flags.dj1end) global.flags.nbtfail = true;
};
area.trn1.drop = [{ item: item.appl, c: 0.28 }];

area.trn2 = new Area();
area.trn2.id = 104;
area.trn2.name = i18n.t("content.area.trn2.name");
area.trn2.pop = [
  { crt: creature.sdummy, lvlmin: 1, lvlmax: 3, c: 0.4 },
  { crt: creature.tdummy, lvlmin: 1, lvlmax: 3, c: 0.6 },
];
area.trn2.size = 20;
z_bake(area.trn2);
area.trn2.onEnd = function () {
  smove(chss.t2, false);
  global.flags.tr2_win = true;
};
area.trn2.onDeath = function () {
  if (!global.flags.dj1end) global.flags.nbtfail = true;
};
area.trn2.drop = [{ item: item.appl, c: 0.28 }];

area.trn3 = new Area();
area.trn3.id = 105;
area.trn3.name = i18n.t("content.area.trn3.name");
area.trn3.pop = [
  { crt: creature.sdummy, lvlmin: 3, lvlmax: 5, c: 0.35 },
  { crt: creature.tdummy, lvlmin: 2, lvlmax: 3, c: 0.45 },
  { crt: creature.wdummy, lvlmin: 1, lvlmax: 1, c: 0.25 },
];
area.trn3.size = 50;
z_bake(area.trn3);
area.trn3.onEnd = function () {
  smove(chss.t2, false);
  global.flags.tr3_win = true;
};
area.trn3.onDeath = function () {
  if (!global.flags.dj1end) global.flags.nbtfail = true;
};
area.trn3.drop = [{ item: item.appl, c: 0.28 }];

area.clg = new Area();
area.clg.id = 106;
area.clg.name = i18n.t("content.area.clg.name");
area.clg.pop = [
  { crt: creature.bat, lvlmin: 1, lvlmax: 4 },
  { crt: creature.spd1, lvlmin: 2, lvlmax: 4 },
];
area.clg.size = 33;
z_bake(area.clg);
// This area belongs to a quest that was cut: its completion handler moved the
// player to `chss.q1lwn` and `chss.q1l`, neither of which exists, so it would
// throw the moment the area became reachable. The area itself is kept because
// it is finished content; whoever wires it back in writes the handler then.
// See docs/STORY.md.

area.tst = new Area();
area.tst.id = 108;
area.tst.name = i18n.t("content.area.tst.name");
area.tst.pop = [{ crt: creature.skl, lvlmin: 1, lvlmax: 1, c: 1 }];
area.tst.size = -1;
z_bake(area.tst);
area.tst.onEnd = function () {};

area.frstn1a2 = new Area();
area.frstn1a2.id = 109;
area.frstn1a2.name = i18n.t("content.area.frstn1a2.name");
area.frstn1a2.pop = [
  { crt: creature.rbt1, lvlmin: 1, lvlmax: 5, c: 0.2 },
  { crt: creature.slm1, lvlmin: 1, lvlmax: 6, c: 0.4 },
  { crt: creature.slm2, lvlmin: 1, lvlmax: 6, c: 0.4 },
];
area.frstn1a2.size = 60;
z_bake(area.frstn1a2);
area.frstn1a2.onEnd = function () {
  roll(item.acrn, 0.2, 1, 3);
  roll(item.wbrs, 0.2, 1, 3);
  roll(item.cp, 0.5, 1, 5);
  roll(wpn.knf2, 0.06);
  roll(wpn.ktn1, 0.04);
  roll(item.hrb1, 0.6, 1, 4);
  roll(wpn.stk1, 0.3);
  roll(item.sbone, 0.1, 1, 3);
  giveItem(item.wbrs, rand(1, 2));
  roll(item.wdc, 1, 7, 22);
  roll(item.spb, 0.7);
  roll(item.pcn, 0.1, 1, 2);
  this.size = rand(40) + 30;
  smove(chss.frstn1a2);
};
area.frstn1a2.drop = [
  { item: item.hrb1, c: 0.02 },
  { item: item.wdc, c: 0.05 },
];

area.hmbsmnt = new Area();
area.hmbsmnt.id = 110;
area.hmbsmnt.name = i18n.t("content.area.hmbsmnt.name");
area.hmbsmnt.pop = [
  { crt: creature.bat, lvlmin: 10, lvlmax: 17, c: 0.5 },
  { crt: creature.spd1, lvlmin: 10, lvlmax: 17, c: 0.5 },
];
area.hmbsmnt.size = 10;
z_bake(area.hmbsmnt);
area.hmbsmnt.onEnd = function () {
  smove(chss.bsmnthm1, false);
};
area.hmbsmnt.drop = [
  { item: item.cp, c: 0.05 },
  { item: item.lcn, c: 0.003 },
  { item: item.cn, c: 0.02 },
  { item: item.cd, c: 0.01 },
  { item: item.wdc, c: 0.08 },
  { item: acc.wpeny, c: 0.001 },
];

area.trne1 = new Area();
area.trne1.id = 111;
area.trne1.name = i18n.t("content.area.trne1.name");
area.trne1.pop = [{ crt: creature.golem1, lvlmin: 20, lvlmax: 20, c: 1 }];
area.trne1.size = 1;
z_bake(area.trne1);
area.trne1.protected = true;
area.trne1.onEnd = function () {
  this.size = 1;
  if (!global.flags.trne1e1) smove(chss.trne1e1, false);
  else smove(chss.t3, false);
};

area.frstn2a2 = new Area();
area.frstn2a2.id = 112;
area.frstn2a2.name = i18n.t("content.area.frstn2a2.name");
area.frstn2a2.pop = [
  { crt: creature.rbt1, lvlmin: 1, lvlmax: 7, c: 0.25 },
  { crt: creature.slm1, lvlmin: 1, lvlmax: 8, c: 0.2 },
  { crt: creature.slm2, lvlmin: 1, lvlmax: 8, c: 0.2 },
  { crt: creature.slm3, lvlmin: 1, lvlmax: 5, c: 0.25 },
];
area.frstn2a2.size = 50;
z_bake(area.frstn2a2);
area.frstn2a2.onEnd = function () {
  roll(item.acrn, 0.2, 1, 3);
  roll(item.cp, 0.2, 1, 8);
  roll(wpn.knf2, 0.03);
  roll(wpn.ktn1, 0.04);
  roll(item.hrb1, 0.4, 2, 5);
  roll(wpn.stk1, 0.4);
  roll(item.sbone, 0.2, 1, 3);
  giveItem(item.wbrs, rand(1, 3));
  roll(item.wdc, 1, 5, 17);
  roll(item.spb, 0.6);
  roll(item.pcn, 0.3, 1, 3);
  if (!global.flags.wp2sgt) roll(item.wp2s, 0.2);
  this.size = rand(50) + 40;
  if (!global.flags.frstn1a3u) {
    msg(
      i18n.t(
        "runtime.world.areas.dialogue.you_have_discovered_a_new_hunting_area_d1406ac6",
      ),
      "lime",
    );
    global.flags.frstn1a3u = true;
    smove(chss.frstn1main);
  } else smove(chss.frstn1a2);
};
area.frstn2a2.drop = [
  { item: item.hrb1, c: 0.03 },
  { item: item.wdc, c: 0.06 },
];

area.trne2 = new Area();
area.trne2.id = 113;
area.trne2.name = i18n.t("content.area.trne2.name");
area.trne2.pop = [{ crt: creature.golem2, lvlmin: 23, lvlmax: 23, c: 1 }];
area.trne2.size = 1;
z_bake(area.trne2);
area.trne2.protected = true;
area.trne2.onEnd = function () {
  this.size = 1;
  if (!global.flags.trne2e1) smove(chss.trne2e1, false);
  else smove(chss.t3, false);
};

area.trne3 = new Area();
area.trne3.id = 114;
area.trne3.name = i18n.t("content.area.trne3.name");
area.trne3.pop = [{ crt: creature.golem3, lvlmin: 25, lvlmax: 25, c: 1 }];
area.trne3.size = 1;
z_bake(area.trne3);
area.trne3.protected = true;
area.trne3.onEnd = function () {
  this.size = 1;
  if (!global.flags.trne3e1) smove(chss.trne3e1, false);
  else smove(chss.t3, false);
};

area.frstn1a3 = new Area();
area.frstn1a3.id = 115;
area.frstn1a3.name = i18n.t("content.area.frstn1a3.name");
area.frstn1a3.pop = [
  { crt: creature.rbt1, lvlmin: 3, lvlmax: 8, c: 0.35 },
  { crt: creature.slm1, lvlmin: 3, lvlmax: 9, c: 0.15 },
  { crt: creature.slm2, lvlmin: 3, lvlmax: 9, c: 0.15 },
  { crt: creature.slm3, lvlmin: 2, lvlmax: 5, c: 0.2 },
];
area.frstn1a3.size = -1;
z_bake(area.frstn1a3);
area.frstn1a3.protected = true;
area.frstn1a3.drop = [
  { item: item.hrb1, c: 0.009 },
  { item: item.wdc, c: 0.025 },
  { item: item.acrn, c: 0.001 },
  { item: item.mshr, c: 0.002 },
  { item: item.cp, c: 0.002 },
  { item: wpn.knf2, c: 0.00009 },
  { item: wpn.ktn1, c: 0.00006 },
  { item: wpn.stk1, c: 0.0007 },
  { item: item.sbone, c: 0.0009 },
  { item: item.wbrs, c: 0.003 },
  { item: item.spb, c: 0.0004 },
  { item: item.pcn, c: 0.001 },
  { item: item.fwd1, c: 0.0009 },
];

area.frstn1a4 = new Area();
area.frstn1a4.id = 116;
area.frstn1a4.name = i18n.t("content.area.frstn1a4.name");
area.frstn1a4.pop = [{ crt: creature.slm4, lvlmin: 9, lvlmax: 11, c: 1 }];
area.frstn1a4.size = 25;
z_bake(area.frstn1a4);
area.frstn1a4.protected = true;
area.frstn1a4.drop = [
  { item: item.cp, c: 0.006 },
  { item: wpn.stk1, c: 0.0009 },
  { item: item.sbone, c: 0.0005 },
];
area.frstn1a4.onEnd = function () {
  chss.frstn1a4.sl();
};

area.trne4 = new Area();
area.trne4.id = 117;
area.trne4.name = i18n.t("content.area.trne4.name");
area.trne4.pop = [{ crt: creature.golem4, lvlmin: 28, lvlmax: 28, c: 1 }];
area.trne4.size = 1;
z_bake(area.trne4);
area.trne4.protected = true;
area.trne4.onEnd = function () {
  this.size = 1;
  if (!global.flags.trne4e1) smove(chss.trne4e1, false);
  else smove(chss.t3, false);
  giveTitle(ttl.aptc);
};

area.frstn9a1 = new Area();
area.frstn9a1.id = 118;
area.frstn9a1.name = i18n.t("content.area.frstn9a1.name");
area.frstn9a1.pop = [
  { crt: creature.wolf1, lvlmin: 7, lvlmax: 8, c: 0.25 },
  { crt: creature.slm5, lvlmin: 10, lvlmax: 11, c: 0.75 },
];
area.frstn9a1.size = 48;
z_bake(area.frstn9a1);
area.frstn9a1.onEnd = function () {
  roll(item.acrn, 0.2, 1, 5);
  roll(item.mshr, 0.35, 1, 3);
  roll(wpn.stk1, 0.15);
  roll(item.sbone, 0.3, 1, 3);
  roll(item.wdc, 1, 5, 17);
  roll(item.appl, 0.25, 2, 5);
  roll(item.pcn, 0.5, 1, 3);
  this.size = rand(20) + 40;
  smove(chss.frstn3main);
};
area.frstn9a1.drop = [
  { item: item.hrb1, c: 0.03 },
  { item: item.wdc, c: 0.06 },
];

function z_bake(area) {
  let c = 0;
  let d = 0;
  const b = [];
  const e = [];
  let s = 0;
  for (let i = 0; i < area.pop.length; i++) c += area.pop[i].c;
  d = 1 - c;
  for (let i = 0; i < area.pop.length; i++)
    b[i] = (d / c) * area.pop[i].c + area.pop[i].c;
  for (let i = 0; i < b.length; i++) {
    if (i === 0) {
      e[i] = [0, b[i]];
      s = b[i];
    } else if (i === b.length - 1) e[i] = [s, 1];
    else {
      e[i] = [s, b[i] + s];
      s += b[i];
    }
  }
  area.popc = e;
}
