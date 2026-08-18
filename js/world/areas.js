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
// The endless bout, and the only place in the dojo a student can simply keep
// working. Its dummies were pinned at levels 12, 13 and 10, which is below the
// dojo's own first trial at 20 -- so the moment a student was good enough to be
// sent at a golem, the room they trained in had nothing left to teach them, and
// the reward ladder that now runs to level 50 had nothing behind it at all.
//
// A dojo sets a training dummy to the student in front of it, which is what these
// do now. They stay dummies: their health grows at a tenth of a point a level and
// they are worth linear experience against a cubic requirement, so this is a place
// to practise, never a place to farm.
area.trnf.pop = [
  {
    crt: creature.sdummy,
    lvlmin: 1,
    get lvlmax() {
      return trackingLevel(12, 4, 46);
    },
    c: 0.3,
  },
  {
    crt: creature.tdummy,
    lvlmin: 7,
    get lvlmax() {
      return trackingLevel(13, 0, 50);
    },
    c: 0.3,
  },
  {
    crt: creature.wdummy,
    lvlmin: 8,
    get lvlmax() {
      return trackingLevel(10, 2, 48);
    },
    c: 0.3,
  },
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
// Neither entry declared `c`, so `z_bake` accumulated undefined and baked
// `popc` as [[0, NaN], [NaN, 1]]. Every comparison in `area_init` against NaN is
// false, so no branch would ever have matched: nothing could spawn, `btl` would
// never have been set, and the descent would have fallen through in silence. The
// area has never been reachable, so this has never been visible — but it would
// have been the first thing a player saw the moment it was.
area.clg.pop = [
  { crt: creature.bat, lvlmin: 1, lvlmax: 4, c: 0.5 },
  { crt: creature.spd1, lvlmin: 2, lvlmax: 4, c: 0.5 },
];
area.clg.size = 33;
z_bake(area.clg);
// The joiner's cellar, reached from the marketplace once the boy has said which
// one it is. This handler replaces one that was cut with its quest: it moved the
// player to `chss.q1lwn` and `chss.q1l`, neither of which has ever existed.
//
// The size is not restored here. Cleared means cleared, the way `area.hmbsmnt`
// leaves its own basement at zero, because this is one errand for one family
// rather than a place to grind. It is also why the authored 33 above is not the
// number a player meets: sizes restore positionally from every existing save, so
// `quest.chsls1` sets the descent's length when the boy asks.
area.clg.onEnd = function () {
  // He said the player could keep whatever they found, and meant that there was
  // nothing to find. Offcuts, a few coins off the floor, and the apples.
  roll(item.wdc, 0.5, 2, 6);
  roll(item.appl, 0.4, 1, 3);
  roll(item.cclth, 0.2, 1, 2);
  roll(item.cp, 0.5, 2, 7);
  quest.chsls1.data.cleared = true;
  smove(chss.clgmn, false);
};

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

// The hollow at the far end of the southern forest, where the pack leader dens.
// Appended rather than inserted: load() restores area sizes by position, so the
// order of the definitions above is part of the save format. A single-creature
// population keeps the hollow from becoming another grinding spot, and onEnd
// restores the size so a player who retreats can sweep it again.
area.frstn10a1 = new Area();
area.frstn10a1.id = 119;
area.frstn10a1.name = i18n.t("content.area.frstn10a1.name");
area.frstn10a1.pop = [{ crt: creature.wolfa1, lvlmin: 12, lvlmax: 13, c: 1 }];
area.frstn10a1.size = 8;
z_bake(area.frstn10a1);
area.frstn10a1.onEnd = function () {
  this.size = 8;
  smove(chss.frstn10main);
};
area.frstn10a1.drop = [
  { item: item.sbone, c: 0.08 },
  { item: item.hrb1, c: 0.02 },
];

// The upper catacombs. The 26 rooms held no combat whatever — not one of them
// called area_init and no area existed for them — so wiring only the entrance
// would have opened a large, silent, empty map. This populates the first stretch;
// the deeper corridor stays quiet until its own tier exists, which also makes the
// descent read as a change of depth rather than more of the same.
//
// Appended, like every area above: load() restores sizes by position.
area.cata1a = new Area();
area.cata1a.id = 120;
area.cata1a.name = i18n.t("content.area.cata1a.name");
area.cata1a.pop = [
  { crt: creature.cbat, lvlmin: 9, lvlmax: 12, c: 0.45 },
  { crt: creature.stirge, lvlmin: 10, lvlmax: 13, c: 0.35 },
  { crt: creature.zomb1, lvlmin: 12, lvlmax: 15, c: 0.2 },
];
area.cata1a.size = 26;
z_bake(area.cata1a);
area.cata1a.onEnd = function () {
  // What the village lost turns up down here. The lantern the old man mentioned is
  // wpn.trch, which until now had no drop, recipe, or vendor anywhere in the game.
  roll(item.sbone, 0.5, 1, 4);
  roll(item.cclth, 0.3, 1, 2);
  roll(item.cndl, 0.35, 1, 2);
  roll(wpn.trch, 0.2);
  roll(item.cp, 0.4, 1, 6);
  this.size = rand(12) + 20;
  smove(chss.cata1);
};
area.cata1a.drop = [
  { item: item.sbone, c: 0.05 },
  { item: item.cndl, c: 0.02 },
];

// The eastern ring, past the Web Corridor. Deeper than the entry rooms: the same
// zombies still turn up, but the things that used to fight for a living are here
// too, and a ghoul and a zombie fighter together cannot be handled on either
// one's terms — one is too fast to corner, the other too solid to out-trade.
area.cata2a = new Area();
area.cata2a.id = 121;
area.cata2a.name = i18n.t("content.area.cata2a.name");
area.cata2a.pop = [
  { crt: creature.zomb1, lvlmin: 13, lvlmax: 16, c: 0.35 },
  { crt: creature.zmbf, lvlmin: 14, lvlmax: 18, c: 0.4 },
  { crt: creature.ghl, lvlmin: 15, lvlmax: 19, c: 0.25 },
];
area.cata2a.size = 34;
z_bake(area.cata2a);
area.cata2a.onEnd = function () {
  roll(item.sbone, 0.6, 2, 6);
  roll(item.cclth, 0.4, 1, 3);
  roll(item.cndl, 0.4, 1, 3);
  roll(item.cp, 0.5, 3, 12);
  roll(item.cn, 0.3, 1, 4);
  this.size = rand(14) + 26;
  smove(chss.cata6);
};
area.cata2a.drop = [
  { item: item.sbone, c: 0.06 },
  { item: item.cndl, c: 0.03 },
];

// The long western corridor. The order that built this place is buried along it,
// which is why what walks here still knows how to fight in formation and how to
// cast. Its own descriptions say so: the Zombie Knight belonged to the Knights of
// the Cross and the Zombie Mage to dark mages.
area.cata3a = new Area();
area.cata3a.id = 122;
area.cata3a.name = i18n.t("content.area.cata3a.name");
// A hunting ground of forty rooms rather than a single encounter, and one the
// player has every reason to come back to. Its ceiling follows them from level 30
// on: this is where the dark ki the story is about has been pooling, and what it
// has been working on does not stop at the number someone wrote down.
area.cata3a.pop = [
  {
    crt: creature.zmbm,
    lvlmin: 18,
    get lvlmax() {
      return trackingLevel(22, 8, 38);
    },
    c: 0.3,
  },
  {
    crt: creature.ght,
    lvlmin: 18,
    get lvlmax() {
      return trackingLevel(23, 7, 39);
    },
    c: 0.35,
  },
  {
    crt: creature.zmbk,
    lvlmin: 19,
    get lvlmax() {
      return trackingLevel(24, 6, 40);
    },
    c: 0.35,
  },
];
area.cata3a.size = 40;
z_bake(area.cata3a);
area.cata3a.onEnd = function () {
  roll(item.sbone, 0.7, 3, 8);
  roll(item.cclth, 0.5, 2, 4);
  roll(item.cndl, 0.45, 2, 4);
  roll(item.cn, 0.5, 2, 8);
  roll(item.cq, 0.2, 1, 3);
  this.size = rand(16) + 32;
  smove(chss.cata13);
};
area.cata3a.drop = [
  { item: item.sbone, c: 0.07 },
  { item: item.cndl, c: 0.03 },
  { item: item.cn, c: 0.03 },
];

// The last rooms before the end: the Aging Room and the Eleven Wisemen. Older
// than the order, and the skeletons here are the ones the game says would never
// hurt anybody until death ki had been working on them long enough.
area.cata4a = new Area();
area.cata4a.id = 123;
area.cata4a.name = i18n.t("content.area.cata4a.name");
// The deepest hunting ground in the game, and the highest its ceiling goes: the
// two rooms before the end. Past this the only thing left is the encounter at the
// bottom, which stays exactly as it was written.
area.cata4a.pop = [
  {
    crt: creature.zmbk,
    lvlmin: 21,
    get lvlmax() {
      return trackingLevel(25, 5, 45);
    },
    c: 0.3,
  },
  {
    crt: creature.unsctn,
    lvlmin: 22,
    get lvlmax() {
      return trackingLevel(26, 4, 46);
    },
    c: 0.4,
  },
  {
    crt: creature.mumy,
    lvlmin: 23,
    get lvlmax() {
      return trackingLevel(27, 3, 47);
    },
    c: 0.3,
  },
];
area.cata4a.size = 26;
z_bake(area.cata4a);
area.cata4a.onEnd = function () {
  roll(item.sbone, 0.8, 4, 10);
  roll(item.cclth, 0.6, 2, 5);
  roll(item.cndl, 0.5, 2, 5);
  roll(item.cq, 0.4, 1, 4);
  roll(wpn.trch, 0.15);
  this.size = rand(10) + 22;
  smove(chss.cata23);
};
area.cata4a.drop = [
  { item: item.sbone, c: 0.08 },
  { item: item.cndl, c: 0.04 },
  { item: item.cq, c: 0.02 },
];

// What is standing at the end of the journey, alone. A single population and a
// size of one, so this is an encounter rather than a hunting ground: the quest's
// onDeath hook moves the player back into the room once it falls.
area.cata5a = new Area();
area.cata5a.id = 124;
area.cata5a.name = i18n.t("content.area.cata5a.name");
area.cata5a.pop = [{ crt: creature.dcrps1, lvlmin: 26, lvlmax: 28, c: 1 }];
area.cata5a.size = 1;
z_bake(area.cata5a);
area.cata5a.onEnd = function () {
  // Restored so a player who retreats can come back to it.
  this.size = 1;
  smove(chss.cata25);
};
area.cata5a.drop = [];

// The false wall in the western corridor. Appended, and it has to stay last:
// `save()` writes every area's size in `for...in` order and `load()` reads them back
// positionally, so inserting an area anywhere above this silently reassigns the size
// of every area after it. An older save simply has no slot for this one and it keeps
// the size authored here.
//
// One population and a size of one, like `area.cata5a`: an encounter, not a hunting
// ground. Unlike that one the size is not restored, because a wall that has been
// broken stays broken.
area.lrck1 = new Area();
area.lrck1.id = 125;
area.lrck1.name = i18n.t("content.area.lrck1.name");
area.lrck1.pop = [{ crt: creature.lrck, lvlmin: 20, lvlmax: 22, c: 1 }];
area.lrck1.size = 1;
z_bake(area.lrck1);
area.lrck1.onEnd = function () {
  // What comes down with the slab, and nothing that rewards the swinging: the
  // passage behind it is the point.
  roll(item.sbone, 0.5, 2, 5);
  roll(item.cclth, 0.4, 1, 3);
  roll(wpn.trch, 0.1);
  smove(chss.cata17, false);
};
area.lrck1.drop = [];

// A level band that follows the player upward without ever dropping below what
// was authored for the place. `floor` is the hand-written ceiling, so a player
// arriving for the first time meets exactly the fight that was designed; `behind`
// is how far under the player the band trails, and `cap` is where it stops.
//
// mon_gen reads lvlmin and lvlmax off the live population entry at the moment it
// generates a creature, and z_bake only precomputes the spawn weights, so a
// population entry can express its ceiling as a getter over this.
//
// This exists because the world stopped at level 28 while the dojo's reward ladder
// runs to 50: past the catacombs there was nothing left in the game that could
// give a fight or worthwhile experience. It raises no floor and it makes nothing
// easier -- an over-level creature is worth more experience, not less.
function trackingLevel(floor, behind, cap) {
  const lvl = (you && you.lvl) || 1;
  return Math.max(floor, Math.min(lvl - behind, cap));
}

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
