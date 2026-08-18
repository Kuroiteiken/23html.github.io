// Sectors: the regions that group locations together. A sector tracks which of
// its locations the player has discovered and carries the shared state that
// applies to every location inside it.

function Sector() {
  this.id = 0;
  this.group = [0];
  this.data = {};
  this.active = false;
  this.onEnter = function () {};
  this.onLeave = function () {};
  this.onStay = function () {};
  this.onMove = function () {};
  this.onScout = function () {};
}

function addtosector(sector, loc) {
  sector.group.push(loc.id);
  loc.sector.push(sector);
}

function inSector(sector) {
  for (const a in global.current_l.sector)
    if (global.current_l.sector[a].id === sector.id) return true;
}

sector.home = new Sector();
sector.home.id = 1;
sector.home.inside = true;
sector.home.ddata = {};
sector.home.onEnter = function () {
  const fire = findbyid(furn, furniture.frplc.id);
  for (const f in furn) activatef(furn[f]);
  if (this.data.smkp > 0) {
    dom.d_lctt.innerHTML += i18n.t(
      "runtime.world.sectors.interface.nbsp_e9caec8e",
    );
    const re = time.minute - this.data.smkt;
    this.data.smkp -= re;
  }
};

sector.home.data = {
  scoutm: 100,
  scout: 0,
  scoutf: false,
  gets: [false],
  gotmod: 0,
  smkp: 0,
  ctlt: [],
};
sector.home.scout = [
  {
    c: 0.1,
    cond: () => {
      if (sector.home.data.ctlt.length != 0) return true;
    },
    f: () => {
      const i = select(sector.home.data.ctlt);
      msg(
        select(i18n.get("runtime.world.sectors.dialogue.cat_gift_messages")),
        "lime",
      );
      const k = itemgroup[((i + 1) / 10000) << 0];
      for (const v in k) if (k[v].id === i) giveItem(k[v]);
      sector.home.data.ctlt.splice(sector.home.data.ctlt.indexOf(i), 1);
    },
    exp: 2,
  },
];
sector.home.onScout = function () {
  scoutGeneric(this);
};

sector.home.onMove = function () {
  if (this.data.smkp > 0) {
    dom.d_lctt.innerHTML += i18n.t(
      "runtime.world.sectors.interface.nbsp_e9caec8e",
    );
  }
};

sector.home.onLeave = function () {
  global.stat.athmec = 0;
  if (effect.fplc.active === true) removeEff(effect.fplc);
  this.data.smkt = time.minute;
  for (const f in furn) deactivatef(furn[f]);
};

sector.home.onStay = function () {
  if (this.data.smkp > 0) {
    if (effect.smoke.active) effect.smoke.duration = 26;
    else giveEff(you, effect.smoke, 26);
    if (--this.data.smkp <= 0) smove(global.current_l);
  }
  if (global.flags.catget) giveSkExp(skl.pet, you.mods.petxp);
  global.stat.athme += global.timescale;
  global.stat.athmec += global.timescale;
  for (const x in global.nethmchk) global.nethmchk[x]();
  const fire = findbyid(furn, furniture.frplc.id);

  if (effect.fplc.active === false && fire.data.fuel > 0)
    giveEff(you, effect.fplc, fire.data.fuel);
  if (fire.data.fuel > 0) {
    if (effect.fplc.active === false) giveEff(you, effect.fplc, 2);
    const afire = findbyid(furn, furniture.fwdpile.id);
    if (afire && fire.data.fuel <= 2 && afire.data.fuel > 0) {
      fire.data.fuel += 30;
      afire.data.fuel--;
    }
  }
};

sector.vcent = new Sector();
sector.vcent.id = 2;
sector.vcent.onStay = function () {
  if (
    random() < 0.03 &&
    !isWeather(weather.sstorm) &&
    !isWeather(weather.heavyrain) &&
    !isWeather(weather.thunder) &&
    getHour() > 8 &&
    getHour() < 20
  ) {
    if (!global.text.vlg1) global.text.vlg1 = i18n.get("gameText.vlg1");
    if (!global.text.vlg1s) global.text.vlg1s = i18n.get("gameText.vlg1s");
    msg(
      getSeason() === 4 ? select(global.text.vlg1s) : select(global.text.vlg1),
      "yellow",
    );
  }
};

sector.forest1 = new Sector();
sector.forest1.id = 3;
sector.forest1.data = { scoutm: 7000, scout: 0, scoutf: false };
sector.forest1.onStay = function () {
  if (!this.data.scoutf) {
    if (this.data.scout <= this.data.scoutm) {
      if (global.flags.btl || act.scout.active === true) {
        this.data.scout += 0.1;
        giveSkExp(skl.tpgrf, 0.001);
      }
    } else {
      msg(
        i18n.t("runtime.world.sectors.dialogue.area_explored_82dc9682"),
        "lime",
      );
      this.data.scoutf = true;
      giveExp(7000, true, true, true);
    }
  }
};

// The southern forest. Three finished scenes and two populated areas, attached to no
// sector at all, which is why the whole region had no searching, no exploration track
// and no ambience -- the west has had all three since before this fork. The pack leader
// is main-story content now, so the south being a pair of bare corridors was the last
// thing about it that still read as a temporary quest venue.
//
// Its own track rather than a share of `sector.forest1`: the west is levels 1 to 11 and
// the south starts where the west stops, so one counter across both would finish the
// south's exploration on the strength of walking the west.
sector.forest2 = new Sector();
sector.forest2.id = 6;
sector.forest2.data = {
  scoutm: 9000,
  scout: 0,
  scoutf: false,
  // One slot per entry below. Two shipped bugs in this file came from an array that
  // declared fewer slots than the code wrote to.
  gets: [false, false, false],
  gotmod: 0,
};
sector.forest2.scout = [
  {
    c: 0.05,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.south_forest_mast"), "lime");
      giveItem(item.acrn, rand(3, 9));
      giveItem(item.mshr, rand(1, 4));
      sector.forest2.data.gets[0] = true;
    },
    exp: 20,
  },
  {
    c: 0.04,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.south_forest_kill"), "lime");
      giveItem(item.sbone, rand(2, 5));
      giveItem(item.wfng, rand(1, 2));
      sector.forest2.data.gets[1] = true;
    },
    exp: 30,
  },
  {
    c: 0.03,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.south_forest_snare"), "gold");
      giveItem(item.rope, rand(1, 2));
      giveItem(item.cclth, rand(1, 3));
      sector.forest2.data.gets[2] = true;
    },
    exp: 35,
  },
];
sector.forest2.onScout = function () {
  scoutGeneric(this);
};
sector.forest2.onStay = function () {
  if (!this.data.scoutf) {
    if (this.data.scout <= this.data.scoutm) {
      if (global.flags.btl || act.scout.active === true) {
        this.data.scout += 0.1;
        giveSkExp(skl.tpgrf, 0.001);
      }
    } else {
      msg(
        i18n.t("runtime.world.sectors.dialogue.area_explored_82dc9682"),
        "lime",
      );
      this.data.scoutf = true;
      giveExp(9000, true, true, true);
    }
  }
};

// The north: the well road and the fields the village eats out of. What searching a
// harvested field turns up is what the lifters missed and what the hedges dropped, so
// that is what this table holds. Nothing here is worth much on its own, which is the
// point of gleaning.
sector.north = new Sector();
sector.north.id = 7;
sector.north.data = {
  scoutm: 5000,
  scout: 0,
  scoutf: false,
  gets: [false, false, false],
  gotmod: 0,
};
sector.north.scout = [
  {
    c: 0.05,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.north_gleaning"), "lime");
      giveItem(item.agrns, rand(2, 6));
      giveItem(item.brly, rand(1, 4));
      sector.north.data.gets[0] = true;
    },
    exp: 20,
  },
  {
    c: 0.04,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.north_hedge"), "lime");
      giveItem(item.wbrs, rand(2, 5));
      giveItem(item.crrt, rand(1, 3));
      sector.north.data.gets[1] = true;
    },
    exp: 25,
  },
  {
    c: 0.03,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.north_left_behind"), "gold");
      giveItem(item.sstraw, rand(3, 8));
      giveItem(item.cclth, rand(1, 2));
      sector.north.data.gets[2] = true;
    },
    exp: 30,
  },
];
sector.north.onScout = function () {
  scoutGeneric(this);
};
sector.north.onStay = function () {
  if (!this.data.scoutf) {
    if (this.data.scout <= this.data.scoutm) {
      if (global.flags.btl || act.scout.active === true) {
        this.data.scout += 0.1;
        giveSkExp(skl.tpgrf, 0.001);
      }
    } else {
      msg(
        i18n.t("runtime.world.sectors.dialogue.area_explored_82dc9682"),
        "lime",
      );
      this.data.scoutf = true;
      giveExp(8000, true, true, true);
    }
  }
};

sector.cata1 = new Sector();
sector.cata1.id = 4;
sector.cata1.inside = true;
sector.cata1.effectors = [{ e: effector.dark }];
// The 11,000-point track was authored and then left inert: there was no `scout`
// table and no onScout, so canScout() had nothing to offer and the counter could
// never advance. What the rooms are full of is what the village has been losing,
// so that is what searching them turns up. scoutGeneric refuses to run in the
// dark, which means every find here costs candle time.
sector.cata1.data = {
  scoutm: 11000,
  scout: 0,
  scoutf: false,
  gets: [false, false, false, false],
  gotmod: 0,
};
sector.cata1.scout = [
  {
    c: 0.05,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.catacombs_candles"), "lime");
      giveItem(item.cndl, rand(1, 3));
      sector.cata1.data.gets[0] = true;
    },
    exp: 25,
  },
  {
    c: 0.04,
    f: () => {
      msg(
        i18n.t("runtime.world.sectors.dialogue.catacombs_grave_coins"),
        "lime",
      );
      giveItem(item.cp, rand(2, 9));
      giveItem(item.cn, rand(1, 4));
      sector.cata1.data.gets[1] = true;
    },
    exp: 20,
  },
  {
    // The lantern the old shopkeeper said went missing. wpn.trch had no drop,
    // recipe, or vendor anywhere in the game before this.
    c: 0.03,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.catacombs_lantern"), "gold");
      giveItem(wpn.trch);
      sector.cata1.data.gets[2] = true;
    },
    exp: 45,
  },
  {
    c: 0.03,
    f: () => {
      msg(
        i18n.t("runtime.world.sectors.dialogue.catacombs_stolen_tools"),
        "lime",
      );
      giveItem(item.sbone, rand(1, 3));
      giveItem(item.cclth, rand(1, 2));
      sector.cata1.data.gets[3] = true;
    },
    exp: 30,
  },
];
sector.cata1.onScout = function () {
  scoutGeneric(this);
};

// The marketplace. This table was written and then commented out, with its strings
// inline in English, and the sector was left attached to seven scenes that could not
// be searched: the village centre, the marketplace itself, two vendors, the cat, the
// message board and the guard post. What a market loses is small change and the
// things nobody would buy, so that is what searching one turns up.
//
// Four defects in the commented original are fixed rather than carried over: the
// inline English literals are gone; `gets` declares both slots its entries write,
// where the original declared one and wrote `gets[1]`; the second entry was a
// duplicate of the first rather than a second thing to find; and `c: .11` is down to
// the .01 the three shop scenes use, since eleven percent a search is not a find, it
// is an income.
sector.vmain1 = new Sector();
sector.vmain1.id = 5;
sector.vmain1.data = {
  scoutm: 400,
  scout: 0,
  scoutf: false,
  gets: [false, false],
  gotmod: 0,
};
sector.vmain1.scout = [
  {
    c: 0.01,
    f: () => {
      msg(
        select(
          i18n.get(
            "runtime.world.locations.dialogue.market_coin_find_messages",
          ),
        ),
        "lime",
      );
      giveItem(select([item.cp, item.cn, item.cq, item.cd]));
      sector.vmain1.data.gets[0] = true;
    },
    exp: 5,
  },
  {
    c: 0.01,
    f: () => {
      msg(i18n.t("runtime.world.sectors.dialogue.market_discard"), "lightgrey");
      giveItem(item.sktbad);
      sector.vmain1.data.gets[1] = true;
    },
    exp: 4,
  },
];
sector.vmain1.onScout = function () {
  scoutGeneric(this);
};

function giveCrExp(skl, am, lvl) {
  if (!lvl || skl.lvl < lvl) giveSkExp(skl, am);
}
