// Furniture definitions for the player's home. Each piece can be installed into
// a home slot, ticks with the world clock, and grants bonuses or unlocks
// actions while it remains in place.

function Furniture() {
  this.name = "";
  this.desc = "";
  this.data = {};
  this.id = 0;
  this.removable = false;
  this.use = function () {};
  this.onGive = function () {};
  this.onSelect = function () {};
  this.onRemove = function () {};
  this.onDestroy = function () {};
  this.activate = function () {};
  this.deactivate = function () {};
}

furniture.cat = new Furniture();
furniture.cat.id = 2;
furniture.cat.name = i18n.t("content.furniture.cat.name");
furniture.cat.desc = i18n.t("content.furniture.cat.desc");
furniture.cat.data = {
  age: DAY * 15,
  c: 0,
  p: 0,
  l1: 0,
  l2: 0,
  amount: 0,
  named: false,
  sex: false,
  name: i18n.t("content.furniture.cat.name"),
  mood: 1,
};
furniture.cat.v = 1;
furniture.cat.use = function () {
  this.data.age += global.timescale;
  this.data.mood = this.data.mood > 1 ? 1 : this.data.mood + 0.002;
};

furniture.frplc = new Furniture();
furniture.frplc.id = 3;
furniture.frplc.name = i18n.t("content.furniture.frplc.name");
furniture.frplc.desc = i18n.t("content.furniture.frplc.desc");
furniture.frplc.data = { fuel: 0, amount: 0 };
furniture.frplc.v = 3;
furniture.frplc.use = function () {
  if (this.data.fuel > 0) this.data.fuel--;
};

furniture.bed1 = new Furniture();
furniture.bed1.id = 4;
furniture.bed1.name = i18n.t("content.furniture.bed1.name");
furniture.bed1.desc = i18n.t("content.furniture.bed1.desc");
furniture.bed1.data = { amount: 0 };
furniture.bed1.sq = 0.1;
furniture.bed1.v = 1;
furniture.bed1.onGive = function () {
  if (!home.bed || home.bed.sq < this.sq) home.bed = this;
};

furniture.bed2 = new Furniture();
furniture.bed2.id = 5;
furniture.bed2.removable = true;
furniture.bed2.name = i18n.t("content.furniture.bed2.name");
furniture.bed2.desc = i18n.t("content.furniture.bed2.desc");
furniture.bed2.data = { amount: 0 };
furniture.bed2.sq = 1;
furniture.bed2.v = 5;
furniture.bed2.onGive = function () {
  if (!home.bed || home.bed.sq < this.sq) home.bed = this;
};
furniture.bed2.onRemove = function () {
  home.bed = furniture.bed1;
  giveItem(item.bed2, 1, true);
};

furniture.tbwr1 = new Furniture();
furniture.tbwr1.id = 6;
furniture.tbwr1.removable = true;
furniture.tbwr1.name = i18n.t("content.furniture.tbwr1.name");
furniture.tbwr1.desc =
  i18n.t("content.furniture.tbwr1.desc") +
  dom.dseparator +
  i18n.t("content.furniture.tbwr1.bonus");
furniture.tbwr1.data = { amount: 0 };
furniture.tbwr1.sq = 1;
furniture.tbwr1.v = 3;
furniture.tbwr1.activate = function () {
  if (home.tbw.id === this.id) skl.glt.p += 0.05;
};
furniture.tbwr1.deactivate = function () {
  if (home.tbw.id === this.id) skl.glt.p -= 0.05;
};
furniture.tbwr1.onGive = function () {
  if (!home.tbw || home.tbw.sq < this.sq) home.tbw = this;
};
furniture.tbwr1.onRemove = function () {
  giveItem(item.tbwr1, 1, true);
};

furniture.tbwr2 = new Furniture();
furniture.tbwr2.id = 7;
furniture.tbwr2.removable = true;
furniture.tbwr2.name = i18n.t("content.furniture.tbwr2.name");
furniture.tbwr2.desc = i18n.t("content.furniture.tbwr2.desc");
furniture.tbwr2.data = { amount: 0 };
furniture.tbwr2.v = 9;
furniture.tbwr2.onGive = function () {};

furniture.tbwr3 = new Furniture();
furniture.tbwr3.id = 8;
furniture.tbwr3.removable = true;
furniture.tbwr3.name = i18n.t("content.furniture.tbwr3.name");
furniture.tbwr3.desc = i18n.t("content.furniture.tbwr3.desc");
furniture.tbwr3.data = { amount: 0 };
furniture.tbwr3.v = 21;
furniture.tbwr3.onGive = function () {};

furniture.wvbkt = new Furniture();
furniture.wvbkt.id = 9;
furniture.wvbkt.removable = true;
furniture.wvbkt.name = i18n.t("content.furniture.wvbkt.name");
furniture.wvbkt.desc = i18n.t("content.furniture.wvbkt.desc");
furniture.wvbkt.data = { amount: 0 };
furniture.wvbkt.onRemove = function () {
  giveItem(item.wvbkt, 1, true);
};

furniture.strgbx = new Furniture();
furniture.strgbx.id = 10;
furniture.strgbx.name = i18n.t("content.furniture.strgbx.name");
furniture.strgbx.desc = i18n.t("content.furniture.strgbx.desc");
furniture.strgbx.data = { amount: 0 };
furniture.strgbx.v = 2;

furniture.bblkt = new Furniture();
furniture.bblkt.id = 11;
furniture.bblkt.removable = true;
furniture.bblkt.name = i18n.t("content.furniture.bblkt.name");
furniture.bblkt.desc =
  i18n.t("content.furniture.bblkt.desc") +
  dom.dseparator +
  i18n.t("content.furniture.bblkt.bonus");
furniture.bblkt.data = { amount: 0 };
furniture.bblkt.sq = 1;
furniture.bblkt.v = 2;
furniture.bblkt.activate = function () {
  if (home.blkt.id === this.id) skl.sleep.p += 0.5;
};
furniture.bblkt.deactivate = function () {
  if (home.blkt.id === this.id) skl.sleep.p -= 0.5;
};
furniture.bblkt.onGive = function () {
  if (!home.blkt || home.blkt.sq < this.sq) home.blkt = this;
};
furniture.bblkt.onRemove = function () {
  giveItem(item.bblkt, 1, true);
};

furniture.spillw = new Furniture();
furniture.spillw.id = 12;
furniture.spillw.removable = true;
furniture.spillw.name = i18n.t("content.furniture.spillw.name");
furniture.spillw.desc =
  i18n.t("content.furniture.spillw.desc") +
  dom.dseparator +
  i18n.t("content.furniture.spillw.bonus");
furniture.spillw.data = { amount: 0 };
furniture.spillw.sq = 1;
furniture.spillw.v = 3;
furniture.spillw.activate = function () {
  if (home.pilw.id === this.id) skl.sleep.p += 0.3;
};
furniture.spillw.deactivate = function () {
  if (home.pilw.id === this.id) skl.sleep.p -= 0.3;
};
furniture.spillw.onGive = function () {
  if (!home.pilw || home.pilw.sq < this.sq) home.pilw = this;
};
furniture.spillw.onRemove = function () {
  giveItem(item.spillw, 1, true);
};

furniture.cyrn = new Furniture();
furniture.cyrn.id = 13;
furniture.cyrn.removable = true;
furniture.cyrn.name = i18n.t("content.furniture.cyrn.name");
furniture.cyrn.desc =
  i18n.t("content.furniture.cyrn.desc") +
  dom.dseparator +
  i18n.t("content.furniture.cyrn.bonus");
furniture.cyrn.data = { amount: 0 };
furniture.cyrn.v = 3;
furniture.cyrn.activate = function () {
  skl.pet.p += 0.15;
  you.mods.petxp += 0.25;
};
furniture.cyrn.deactivate = function () {
  skl.pet.p -= 0.15;
  you.mods.petxp -= 0.25;
};
furniture.cyrn.onRemove = function () {
  giveItem(item.cyrn, 1, true);
};

furniture.fwdpile = new Furniture();
furniture.fwdpile.id = 14;
furniture.fwdpile.removable = true;
furniture.fwdpile.name = i18n.t("content.furniture.fwdpile.name");
furniture.fwdpile.desc = function () {
  return (
    i18n.t("content.furniture.fwdpile.desc") +
    dom.dseparator +
    i18n.t("content.furniture.fwdpile.bonus") +
    '<div style="color:yellow"><br>' +
    i18n.t("content.furniture.fwdpile.supply") +
    ' <br><span>0</span><span style="display:inline-table;width:130px;border:1px solid darkgrey;margin: 7px;background-color:orange"><span style="display:block;background-color:black;float:right;width:' +
    (100 - (this.data.fuel / (this.data.amount * 5)) * 100) +
    '%">　</span></span><span>' +
    5 * this.data.amount +
    "</span></div>"
  );
};
furniture.fwdpile.data = { amount: 0, fuel: 5 };
furniture.fwdpile.v = 5;
furniture.fwdpile.onRemove = function () {
  giveItem(item.fwdpile, 1, true);
};
furniture.fwdpile.onSelect = function () {
  const f = item.fwd1;
  if (f.amount === 0) {
    msg(
      i18n.t("runtime.data.furniture.dialogue.no_firewood_b95f4dfa"),
      "orange",
    );
    return;
  }
  if (this.data.fuel === this.data.amount * 5) {
    msg(
      i18n.t("runtime.data.furniture.dialogue.firewood_pile_is_full_c10ca17f"),
      "cyan",
    );
    return;
  } else {
    let n = this.data.amount * 5 - this.data.fuel;
    if (f.amount < n) n = f.amount;
    this.data.fuel += n;
    reduce(f, n);
  }
};

furniture.bookgen = new Furniture();
furniture.bookgen.id = 15;
furniture.bookgen.removable = true;
furniture.bookgen.name = i18n.t("content.furniture.bookgen.name");
furniture.bookgen.desc = function () {
  return (
    i18n.t("content.furniture.bookgen.desc") +
    dom.dseparator +
    i18n.t("content.furniture.bookgen.bonus") +
    '<br><br><small style="color:deeppink">' +
    i18n.t("content.furniture.bookgen.current") +
    '<span style="color:orange"> +' +
    Math.round(furniture.bookgen.data.p * 100) +
    "%</span></small>"
  );
};
furniture.bookgen.data = { amount: 0, p: 0 };
furniture.bookgen.v = 0.1;
furniture.bookgen.activate = function () {
  skl.rdg.p += this.data.p;
};
furniture.bookgen.deactivate = function () {
  skl.rdg.p -= this.data.p;
};
furniture.bookgen.onGive = function () {
  if (inSector(sector.home) && this.active) skl.rdg.p += 0.01;
  this.data.p += 0.01;
};
furniture.bookgen.onRemove = function () {
  giveItem(item.bookgen, 1, true);
  if (inSector(sector.home) && this.active) skl.rdg.p -= 0.01;
  this.data.p -= 0.01;
};

// A better blanket than furniture.bblkt, and one the game already described. Claims
// the same home.blkt slot on quality, so owning both is not owning two.
furniture.psb = new Furniture();
furniture.psb.id = 16;
furniture.psb.name = i18n.t("content.furniture.psb.name");
furniture.psb.desc =
  i18n.t("content.furniture.psb.desc") +
  dom.dseparator +
  i18n.t("content.furniture.psb.bonus");
furniture.psb.data = { amount: 0 };
furniture.psb.v = 4;
furniture.psb.sq = 1.5;
furniture.psb.removable = true;
furniture.psb.activate = function () {
  if (home.blkt && home.blkt.id === this.id) skl.sleep.p += 0.8;
};
furniture.psb.deactivate = function () {
  if (home.blkt && home.blkt.id === this.id) skl.sleep.p -= 0.8;
};
furniture.psb.onGive = function () {
  if (!home.blkt || home.blkt.sq < this.sq) home.blkt = this;
};
furniture.psb.onRemove = function () {
  giveItem(item.psb, 1, true);
};

// The talisman asks to be hung where the weather reaches it, which is what it says.
furniture.hnhn = new Furniture();
furniture.hnhn.id = 17;
furniture.hnhn.name = i18n.t("content.furniture.hnhn.name");
furniture.hnhn.desc =
  i18n.t("content.furniture.hnhn.desc") +
  dom.dseparator +
  i18n.t("content.furniture.hnhn.bonus");
furniture.hnhn.data = { amount: 0 };
furniture.hnhn.v = 3;
furniture.hnhn.removable = true;
furniture.hnhn.activate = function () {
  you.luck += 2;
  you.stat_r();
};
furniture.hnhn.deactivate = function () {
  you.luck -= 2;
  you.stat_r();
};
furniture.hnhn.onRemove = function () {
  giveItem(item.hnhn, 1, true);
};

// Two display pieces. They raise the home's rating and nothing else, which is what
// decoration is for -- and the rating is the one number in the game that has never
// had anything to feed it beyond the furniture that came with the house.
furniture.ptng1 = new Furniture();
furniture.ptng1.id = 18;
furniture.ptng1.name = i18n.t("content.furniture.ptng1.name");
furniture.ptng1.desc = i18n.t("content.furniture.ptng1.desc");
furniture.ptng1.data = { amount: 0 };
furniture.ptng1.v = 4;
furniture.ptng1.removable = true;
furniture.ptng1.onRemove = function () {
  giveItem(item.ptng1, 1, true);
};

furniture.sktbad = new Furniture();
furniture.sktbad.id = 19;
furniture.sktbad.name = i18n.t("content.furniture.sktbad.name");
furniture.sktbad.desc = i18n.t("content.furniture.sktbad.desc");
furniture.sktbad.data = { amount: 0 };
furniture.sktbad.v = 2;
furniture.sktbad.removable = true;
furniture.sktbad.onRemove = function () {
  giveItem(item.sktbad, 1, true);
};
