///////////////////////////////////////////
//ITM
///////////////////////////////////////////

function Item() {
  this.name = "dummy";
  this.desc = "";
  this.eff = [];
  this.data = { dscv: false };
  this.amount = 0;
  this.type = 1;
  this.stype = 1;
  this.rar = 1;
  this.new = false;
  this.have = false;
  this.important = false;
  this.onGet = function () {};
  this.use = function () {};
}

item.rcs = new Item();
item.rcs.id = 3000;
item.rcs.name = "Reality shot";
item.rcs.desc = "Amplifies surrounding awareness and perception senses";
item.rcs.stype = 4;
item.rcs.rar = 3;
item.rcs.use = function () {
  msg("placeholder");
};

item.hrb1 = new Item();
item.hrb1.id = 3001;
item.hrb1.name = "Cure Grass";
item.hrb1.val = 7;
item.hrb1.desc =
  "Herb with minor healing properties. Has to be processed before use. Can somewhat speed up recovery of tiny cuts and bruises if applied directly" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hrb1.val +
  " </span>health";
item.hrb1.stype = 4;
item.hrb1.use = function () {
  global.stat.medst++;
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  this.amount--;
  dom.d5_1_1.update();
  msg("Restored " + this.val + " hp", "lime");
};
item.hrb1.onGet = function () {
  if (this.amount >= 50) {
    giveRcp(rcp.hlstw);
    this.onGet = function () {};
  }
};

item.atd1 = new Item();
item.atd1.id = 3002;
item.atd1.name = "Herbal Antidote";
item.atd1.desc =
  "Bundle of certain common herbs, mixed together. Tastes incredibly bitter, but helps to detoxify blood from containments" +
  dom.dseparator +
  "<span style='color:lime'> Neautralizes the effects of weak poisons </span>";
item.atd1.stype = 4;
item.atd1.use = function () {
  global.stat.medst++;
  if (effect.psn.active === true) {
    if (effect.psn.duration - 30 <= 0) {
      removeEff(effect.psn);
      msg("You feel better", "lime");
    } else {
      effect.psn.duration -= 30;
      msg("You feel a little better", "lightgreen");
    }
  } else msg("Tastes like medicine..", "lightblue");
  this.amount--;
};

item.psnwrd = new Item();
item.psnwrd.id = 3003;
item.psnwrd.name = "Poison Ward";
item.psnwrd.desc =
  "Solution developed to protect residents from diseases during times of plague" +
  dom.dseparator +
  "<span style='color:lime'> Grants invulnerability to poisons for a few hours </span>";
item.psnwrd.stype = 4;
item.psnwrd.rar = 2;
item.psnwrd.use = function () {
  global.stat.medst++;
  if (effect.psnwrd.active === false) giveEff(you, effect.psnwrd, 600);
  else effect.psnwrd.duration = 600;
  this.amount--;
};

item.hlpd = new Item();
item.hlpd.id = 3004;
item.hlpd.name = "Low-grade Healing Powder";
item.hlpd.val = 16;
item.hlpd.desc =
  "Finely crushed cure grass. Used as a base to make weak medicine" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hlpd.val +
  " </span>health";
item.hlpd.stype = 4;
item.hlpd.use = function () {
  global.stat.medst++;
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  this.amount--;
  dom.d5_1_1.update();
  msg("Restored " + this.val + " hp", "lime");
};

item.smm = new Item();
item.smm.id = 3005;
item.smm.name = "Stomach Medicine";
item.smm.desc =
  "Mixture of ginger, bittervine,  and other herbs. Destroys toxins in one's body" +
  dom.dseparator +
  "<span style='color:lime'> Alliviates food poisoning </span>";
item.smm.stype = 4;
item.smm.use = function () {
  global.stat.medst++;
  if (effect.fpn.active === true) {
    if (effect.fpn.duration - 30 <= 0) {
      removeEff(effect.fpn);
      msg("You feel better", "lime");
    } else {
      effect.fpn.duration -= 30;
      msg("You feel a little better", "lightgreen");
    }
  } else msg("Tastes like medicine..", "lightblue");
  this.amount--;
};

item.sp1 = new Item();
item.sp1.id = 3006;
item.sp1.name = "Low-grade Spirit Pill";
item.sp1.desc =
  "Tiny cheap spirit pill, made from condensed Ki. Lowest type, given to weak people and children to nourish their bodies." +
  dom.dseparator +
  "<span style='color:orange'> Grants +500 EXP </span>";
item.sp1.stype = 4;
item.sp1.use = function () {
  giveExp(500, true, true, true);
  global.stat.plst++;
  global.stat.medst++;
  this.amount--;
};

item.sp2 = new Item();
item.sp2.id = 3007;
item.sp2.name = "Mid-grade Spirit Pill";
item.sp2.desc =
  "Small cheap spirit pill, made from condensed Ki. Developed to help young martial artists to go through their training" +
  dom.dseparator +
  "<span style='color:orange'> Grants +2500 EXP </span>";
item.sp2.stype = 4;
item.sp2.use = function () {
  giveExp(2500, true, true, true);
  global.stat.plst++;
  global.stat.medst++;
  this.amount--;
};

item.sp3 = new Item();
item.sp3.id = 3008;
item.sp3.name = "High-grade Spirit Pill";
item.sp3.desc =
  "Small spirit pill, made from condensed Ki. Given to young warriors as energy supplement" +
  dom.dseparator +
  "<span style='color:orange'> Grants +15000 EXP </span>";
item.sp3.stype = 4;
item.sp3.use = function () {
  giveExp(15000, true, true, true);
  global.stat.plst++;
  global.stat.medst++;
  this.amount--;
};

item.lsrd = new Item();
item.lsrd.id = 3009;
item.lsrd.name = "Life Shard";
item.lsrd.desc =
  "A fragment of living energy, trapped within a crystallic shell. Absorbing these slightly increases lifespan" +
  dom.dseparator +
  "<span style='color:hotpink'> Increases HP by +2 permanently </span>";
item.lsrd.stype = 4;
item.lsrd.use = function () {
  you.hpmax += 2;
  you.hp += 2;
  you.hpa += 2;
  dom.d5_1_1.update();
  msg("HP increased by +2 permanently", "hotpink");
  this.amount--;
};

item.hptn1 = new Item();
item.hptn1.id = 3010;
item.hptn1.name = "Lesser Healing Potion";
item.hptn1.val = 50;
item.hptn1.desc =
  "Weakest healing potion you can possibly find. Nearly useless for actual healing, but can act as a headache reliever" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hptn1.val +
  " </span>health";
item.hptn1.stype = 4;
item.hptn1.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg("Restored " + this.val + " hp", "lime");
};

item.lckl = new Item();
item.lckl.id = 3011;
item.lckl.name = "Lucky Clover";
item.lckl.desc =
  "Clover of the rare breed. Whoever is able to find even one will be blessed by the Gods of Luck" +
  dom.dseparator +
  '<span style="color: red">L</span><span style="color: orange">U</span><span style="color: gold">C</span><span style="color: YELLOW">K +1</span>';
item.lckl.stype = 4;
item.lckl.rar = 4;
item.lckl.onGet = function () {
  if (this.amount >= 7) {
    giveRcp(rcp.clrpin);
    this.onGet = function () {};
  }
};
item.lckl.use = function (x) {
  you.luck += 1;
  msg("Your Luck Increases!", "gold");
  this.amount--;
};

item.wstn1 = new Item();
item.wstn1.id = 3012;
item.wstn1.name = "Grey Whetsone";
item.wstn1.desc =
  "Cheap and crude piece of whetstone. Not nearly good enough to maintain the life of a weapon, you can at least scrap off dirt and blood with it" +
  dom.dseparator +
  '<span style="color: lightgreen">Repairs equipped Weapon for <span style="color: lime">+2 DP</span></span>';
item.wstn1.stype = 4;
item.wstn1.use = function (x) {
  if (you.eqp[0].id === 10000) msg("Repair what?...", "lightgrey");
  else {
    you.eqp[0].dp + 2 >= you.eqp[0].dpmax
      ? (you.eqp[0].dp = you.eqp[0].dpmax)
      : (you.eqp[0].dp += 2);
    msg("You've repaired " + you.eqp[0].name + " slightly", "yellow");
    this.amount--;
  }
};

item.bdgh = new Item();
item.bdgh.id = 3013;
item.bdgh.name = "Bandage";
item.bdgh.desc =
  "Clean piece of thin sturdy cloth, perfect for wrapping and securing open wounds" +
  dom.dseparator +
  '<span style="color:lime">Somewhat stops bleeding</span>';
item.bdgh.stype = 4;
item.bdgh.use = function () {
  if (!effect.bled.active) {
    msg("You're not bleeding", "orange");
    return;
  }
  const f = findbyid(you.eff, effect.bled.id);
  if (f.duration - 20 <= 0) removeEff(f, f.target);
  else f.duration -= 20;
  msg("You bandage your wounds", "lime");
  this.amount--;
};
item.bdgh.onGet = function () {
  if (this.amount >= 5) {
    giveRcp(rcp.mdcag);
    this.onGet = function () {};
  }
};

item.amshrm = new Item();
item.amshrm.id = 3014;
item.amshrm.name = "Asura Mushroom";
item.amshrm.desc =
  "The ultimate mushroom of the mushroom world. Eating it makes you feel a mysterious kind of vitality" +
  dom.dseparator +
  '<span style="color: springgreen">Permanently increases STR by +5</span>';
item.amshrm.stype = 4;
item.amshrm.rar = 4;
item.amshrm.use = function (x) {
  you.stra += 5;
  msg("You feel the surge of strength!", "crimson");
  msg("STR +5!", "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.akhrb = new Item();
item.akhrb.id = 3015;
item.akhrb.name = "Aspha Herb";
item.akhrb.desc =
  "Diet-oriented vegetable with misleading effect. It was such a terrible taste and bitter texture that no one would willingly eat them" +
  dom.dseparator +
  '<span style="color: orange">Makes you feel bad</span>';
item.akhrb.stype = 4;
item.akhrb.rar = 2;
item.akhrb.use = function (x) {
  if (this.disabled !== true) {
    this.disabled = true;
    if (random() < 0.005) {
      msg("You managed to consume it", "lime");
      giveSkExp(skl.glt, rand(100, 355 * (skl.glt.lvl * 0.2 + 1)));
      you.sat *= 0.2;
      this.amount--;
    } else {
      msg(
        select([
          "You retch..",
          "You feel like vomiting..",
          "You feel sick..",
          "Your insides turn just by looking at this thing..",
          "You immidiately spit it out..",
          "Your body rejects this..",
          "Your body screams..",
        ]),
        "grey",
      );
    }
    setTimeout(() => {
      this.disabled = false;
    }, 200);
  }
};

item.cndl = new Item();
item.cndl.id = 3016;
item.cndl.name = "Candle";
item.cndl.desc = "A tall wax candle, made to burn for a very long time";
item.cndl.stype = 4;
item.cndl.use = function (x) {
  if (!effect.cdlt.active) giveEff(you, effect.cdlt);
  else effect.cdlt.duration = 360;
  this.amount--;
};

item.incsk = new Item();
item.incsk.id = 3017;
item.incsk.name = "Incense Stick";
item.incsk.desc =
  "A stick of aromatic incense. It calms your soul and mind" +
  dom.dseparator +
  '<span style="color: skyblue">Doubles meditation gain<br>Doubles cultivation gain</span>';
item.incsk.stype = 4;
item.incsk.use = function (x) {
  if (effect.incsk.active === true) effect.insck.duration = 600;
  else giveEff(you, effect.incsk);
  this.amount--;
};

item.sp0a = new Item();
item.sp0a.id = 3018;
item.sp0a.name = "Spirit Opening Powder";
item.sp0a.desc =
  "Powder refined from blood of the wyrm. Has potential to improve internal energy" +
  dom.dseparator +
  "<span style='color:orange'> Grants +95000 EXP </span><br><span style='color:deeppink'>EXP Gain +1%</span>";
item.sp0a.stype = 4;
item.sp0a.rar = 2;
item.sp0a.use = function () {
  global.stat.medst++;
  giveExp(95000, true, true, true);
  you.exp_t += 0.01;
  this.amount--;
};

item.smkbmb = new Item();
item.smkbmb.id = 3019;
item.smkbmb.name = "Smoke Bomb";
item.smkbmb.desc =
  "Pellets that release thick smog when crushed. Can create a smokescreen to help you escape from danger" +
  dom.dseparator +
  "<span style='color:springgreen'>Bypasses current enemy</span>";
item.smkbmb.stype = 4;
item.smkbmb.use = function () {
  if (global.flags.civil === true && global.flags.btl === false) {
    msg("You're not in combat!", "red");
    return;
  }
  if (
    global.current_z.size === 1 ||
    global.current_z.size === 0 ||
    global.current_z.isboss
  ) {
    msg("You can't pass this enemy!", "red");
    return;
  } else {
    clearInterval(timers.btl);
    clearInterval(timers.btl2);
    msg("*Puff*", "black", null, null, "lightgrey");
    global.flags.smkactv = true;
    global.current_z.size--;
    area_init(global.current_z);
    dom.d7m.update();
    this.amount--;
  }
};

item.svial1 = new Item();
item.svial1.id = 3020;
item.svial1.name = "Skeleton Vial";
item.svial1.desc = "Summons a lvl 10 Skeleton";
item.svial1.stype = 4;
item.svial1.use = function () {
  if (global.flags.civil === true && global.flags.btl === false) {
    if (
      global.flags.sleepmode ||
      global.flags.rdng ||
      global.flags.isshop ||
      global.flags.busy ||
      global.flags.work
    ) {
      msg("Unable to summon!", "red");
      return;
    }
    const ta = new Area();
    ta.id = -1;
    ta.name = "Somewhere";
    ta.pop = [{ crt: creature.skl, lvlmin: 10, lvlmax: 10, c: 1 }];
    ta.protected = true;
    ta.onEnd = function () {
      area_init(area.nwh);
      global.flags.civil = true;
      global.flags.btl = false;
    };
    global.flags.civil = false;
    global.flags.btl = true;
    ta.size = 1;
    z_bake(ta);
    area_init(ta);
    dom.d7m.update();
    msg("The creature arises from the ground!", "white", null, null, "red");
    this.amount--;
  } else msg("You're already in a battle!", "red");
};

item.mpwdr = new Item();
item.mpwdr.id = 3021;
item.mpwdr.name = "Monster Powder";
item.mpwdr.desc =
  "Dried and grounded sunbloom mixed with red salts, it emits aura often mistaken for soul energy that attracts nearby creatures<br>" +
  dom.dseparator +
  "<span style='color:seagreen'>Increases area size by 5</span>";
item.mpwdr.stype = 4;
item.mpwdr.use = function () {
  if (
    global.current_z.protected ||
    global.current_z.id <= 101 ||
    global.current_z.size <= 1
  ) {
    msg("Unable to use it here!", "red");
    return;
  }
  msg("You spread some powder on the ground", "lime", null, null, "brown");
  global.current_z.size += 5;
  dom.d7m.update();
  this.amount--;
};

item.smbpll = new Item();
item.smbpll.id = 3022;
item.smbpll.name = "Slumber Pill";
item.smbpll.desc =
  "Pill with a strong sedative effect. Normally used by sick and old people to treat insomnia, if they can afford it. Has other uses if you are creative enough" +
  dom.dseparator +
  "<span style='color:lightgrey'>Makes you sleep through 18 hours in an instant</span>";
item.smbpll.stype = 4;
item.smbpll.use = function (x) {
  if (
    global.flags.btl ||
    global.flags.rdng ||
    global.flags.isshop ||
    global.flags.busy ||
    global.flags.work
  ) {
    msg("You can't sleep now!", "red");
    return;
  } else {
    let b = 0.1;
    const s = HOUR * 18;
    if (!global.flags.sleepmode) giveEff(you, effect.slep);
    else if (global.current_l.id === 112) b += home.bed.sq;
    global.stat.plst++;
    for (let a = 0; a < s; a++) {
      giveSkExp(skl.sleep, 0.1);
      ontick();
    }
    if (!global.flags.sleepmode) removeEff(effect.slep);
  }
  this.amount--;
};

item.lifedr = new Item();
item.lifedr.id = 3023;
item.lifedr.name = "Life Drop";
item.lifedr.desc =
  "A single drop of revitalizing liquid. Consuming even such a meager amount has a miraclous effect on the lifeforce of a mortal" +
  dom.dseparator +
  "<span style='color:hotpink'> Increases HP by +40 permanently </span><br><span style='color:lime'>HP growth rate +2%</span>";
item.lifedr.stype = 4;
item.lifedr.rar = 2;
item.lifedr.use = function () {
  you.stat_p[0] += 0.03;
  you.hpmax += 40;
  you.hp += 40;
  you.hpa += 40;
  dom.d5_1_1.update();
  msg("HP increased by +40 permanently", "hotpink");
  msg("HP potential grows!", "pink");
  this.amount--;
};

item.mnblm = new Item();
item.mnblm.id = 3024;
item.mnblm.name = "Moonbloom";
item.mnblm.desc =
  "A yellow flower which is said to bud on new moons. The flower' nectar is the favourite of spirits and is effective for recovering from exhaustion, but only by refining it into a pill or elixir is it possible to draw out its full potential, which makes it prized by alchemists" +
  dom.dseparator +
  "<span style='color:hotpink'> Increases SAT by +2 permanently </span>";
item.mnblm.stype = 4;
item.mnblm.rar = 2;
item.mnblm.use = function () {
  you.satmax += 2;
  you.sat += 2;
  you.sata += 2;
  dom.d5_3_1.update();
  msg("SAT increased by +2 permanently", "hotpink");
  this.amount--;
};

item.hptn2 = new Item();
item.hptn2.id = 3025;
item.hptn2.name = "Minor Healing Potion";
item.hptn2.val = 450;
item.hptn2.desc =
  "Healing potion with weak healing powers. It is usually used by commoners as first aid before deciding whether to go see a doctor or not" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hptn2.val +
  " </span>health";
item.hptn2.stype = 4;
item.hptn2.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg("Restored " + this.val + " hp", "lime");
};

item.hptn3 = new Item();
item.hptn3.id = 3026;
item.hptn3.name = "Healing Potion";
item.hptn3.val = 2100;
item.hptn3.desc =
  "Startand healing potion of common quality. It can heal wounds, bruises, burns, sprains and other minor injuries. Novice adventurers and hunters should carry a few of these at all times" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hptn3.val +
  " </span>health";
item.hptn3.stype = 4;
item.hptn3.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg("Restored " + this.val + " hp", "lime");
};

item.hptn4 = new Item();
item.hptn4.id = 3027;
item.hptn4.name = "Major Healing Potion";
item.hptn4.val = 7900;
item.hptn4.desc =
  "Potions given to the knights in times of war. Can heal moderate wounds and dull out the pain. These potions sneak their way into the market by all kinds of illegal means, yet actually selling them isn't prohibited" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hptn4.val +
  " </span>health";
item.hptn4.stype = 4;
item.hptn4.rar = 2;
item.hptn4.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg("Restored " + this.val + " hp", "lime");
};

item.lsstn = new Item();
item.lsstn.id = 3028;
item.lsstn.name = "Life Stone";
item.lsstn.desc =
  "Life vessel that lost its energy and became impure, now looks like an ordinary small pebble and serves very little purpose. Can be absorbed for minor health benefits" +
  dom.dseparator +
  "<span style='color:hotpink'> Increases HP by +25 permanently </span>";
item.lsstn.stype = 4;
item.lsstn.use = function () {
  you.hpmax += 25;
  you.hp += 25;
  you.hpa += 25;
  dom.d5_1_1.update();
  msg("HP increased by +25 permanently", "hotpink");
  this.amount--;
};

item.bltrt = new Item();
item.bltrt.id = 3029;
item.bltrt.name = "Bloat Root";
item.bltrt.desc =
  "Unremarkable looking grey root that is bland and tasteless, but eating it makes you feel full. It doesn't seem to have any other qualities, hovewer" +
  dom.dseparator +
  "Restores<span style='color:lime'> 100 </span>energy";
item.bltrt.stype = 4;
item.bltrt.rar = 2;
item.bltrt.use = function () {
  you.sat + 100 > you.satmax ? (you.sat = you.satmax) : (you.sat += 100);
  dom.d5_3_1.update();
  this.amount--;
  msg("Restored 100 energy", "lime");
};

item.feip1 = new Item();
item.feip1.id = 3030;
item.feip1.name = "Fei Pill";
item.feip1.desc =
  "When an alchemist miserably fails to produce a pill, this waste is created. Compound of ruined medical materials is full of poison and impurities, it can be used to kill those with weak constitution. However, it is not useless, and can be absorbed for raw ki if one endures the pain and survives after consuming it";
item.feip1.stype = 4;
item.feip1.use = function () {
  giveEff(you, effect.fei1, 60, 1);
  this.amount--;
  global.stat.plst++;
};

item.stthbm1 = new Item();
item.stthbm1.id = 3031;
item.stthbm1.name = "Morgia";
item.stthbm1.desc =
  "Herb of might. This fiery herb is rumored to improve muscle density" +
  dom.dseparator +
  '<span style="color: springgreen">Permanently increases STR by +1</span>';
item.stthbm1.stype = 4;
item.stthbm1.rar = 2;
item.stthbm1.use = function (x) {
  you.stra += 1;
  msg("You feel the surge of strength!", "crimson");
  msg("STR +1", "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.stthbm2 = new Item();
item.stthbm2.id = 3032;
item.stthbm2.name = "Springsweed";
item.stthbm2.desc =
  "Herb of swiftness. Loved by Serpents, this herb slightly raises one's reaction time" +
  dom.dseparator +
  '<span style="color: springgreen">Permanently increases SPD by +1</span>';
item.stthbm2.stype = 4;
item.stthbm2.rar = 2;
item.stthbm2.use = function (x) {
  you.spda += 1;
  msg("You feel the surge of strength!", "crimson");
  msg("SPD +1", "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.stthbm3 = new Item();
item.stthbm3.id = 3033;
item.stthbm3.name = "Clearbane";
item.stthbm3.desc =
  "Herb of clarity. This herb is often used in making of high quality incense" +
  dom.dseparator +
  '<span style="color: springgreen">Permanently increases INT by +1</span>';
item.stthbm3.stype = 4;
item.stthbm3.rar = 2;
item.stthbm3.use = function (x) {
  you.inta += 1;
  msg("You feel the surge of strength!", "crimson");
  msg("INT +1", "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.stthbm4 = new Item();
item.stthbm4.id = 3034;
item.stthbm4.name = "Drakevine";
item.stthbm4.desc =
  "Herb of flexibility. There are rumors of an old hermit growing these herbs under the hidden mountain" +
  dom.dseparator +
  '<span style="color: springgreen">Permanently increases AGL by +1</span>';
item.stthbm4.stype = 4;
item.stthbm4.rar = 2;
item.stthbm4.use = function (x) {
  you.agla += 1;
  msg("You feel the surge of strength!", "crimson");
  msg("AGL +1", "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.bmsmktt = new Item();
item.bmsmktt.id = 3035;
item.bmsmktt.name = "Smoke Pellet Cluster";
item.bmsmktt.desc =
  "Repurposed smoke bomb, made by concentrating multiple volatile components together, making the moke several times more hazardous, but not enough to cause real damage to a living person. Since the ignition period from such a modification is much longer, it has fewer uses than a regular smoke bomb";
item.bmsmktt.stype = 4;
item.bmsmktt.use = function () {
  if (global.current_l.id !== 111) {
    msg("This isn't the best place to use this", "red");
    return;
  }
  area.hmbsmnt.size = 0;
  msg(
    "You toss a cluster down your basement and hear a distant shrill",
    "yellow",
  );
  dom.d_lctt.innerHTML +=
    '<span style="color:grey;font-size:1.2em">&nbsp煙<span>';
  sector.home.data.smkp = 900;
  sector.home.data.smkt = time.minute;
  this.amount--;
};

item.appl = new Item();
item.appl.id = 1;
item.appl.name = "Apple";
item.appl.val = 7;
item.appl.desc =
  "Juicy red fruit. Makes a fine breakfast if you have nothing else..." +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.appl.val +
  " </span>energy";
item.appl.stype = 4;
item.appl.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  this.amount--;
  dom.d5_3_1.update();
  skl.glt.use(2);
  global.stat.fooda++;
  msg("Restored " + this.val + " energy", "lime");
};

item.brd = new Item();
item.brd.id = 2;
item.brd.name = "Bread";
item.brd.val = 14;
item.brd.desc =
  "Simple loaf of bread, baked with care. It's crunchy and smells nice" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.brd.val +
  " </span>energy";
item.brd.stype = 4;
item.brd.rot = [0.15, 0.25, 0.05, 0.15];
item.brd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};
item.brd.onChange = function (x, y) {
  if (y) return [item.spb, x];
  giveItem(item.spb, x);
};

item.crrt = new Item();
item.crrt.id = 3;
item.crrt.name = "Carrot";
item.crrt.val = 5;
item.crrt.desc =
  "It gets very sweet when boiled" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.crrt.val +
  " </span>energy";
item.crrt.stype = 4;
item.crrt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(1);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};
item.crrt.onGet = function () {
  if (this.amount >= 20) {
    giveRcp(rcp.bcrrt);
    this.onGet = function () {};
  }
};

item.potat = new Item();
item.potat.id = 4;
item.potat.name = "Potato";
item.potat.val = 7;
item.potat.desc =
  "Universal vegetable that can be prepared in hundreds different ways" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.potat.val +
  " </span>energy";
item.potat.stype = 4;
item.potat.use = function () {
  if (random() < 0.1) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.eggn = new Item();
item.eggn.id = 5;
item.eggn.name = "Egg";
item.eggn.val = 4;
item.eggn.desc =
  "Whole chicken egg, very nutritious" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.eggn.val +
  " </span>energy";
item.eggn.stype = 4;
item.eggn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mlkn = new Item();
item.mlkn.id = 6;
item.mlkn.name = "Milk";
item.mlkn.val = 8;
item.mlkn.desc =
  "Power potion for your bones" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mlkn.val +
  " </span>energy";
item.mlkn.stype = 4;
item.mlkn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.foodb++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.rwmt1 = new Item();
item.rwmt1.id = 7;
item.rwmt1.name = "Raw Meat";
item.rwmt1.val = 11;
item.rwmt1.desc =
  "Edible part of some animal, has to be cooked before consumption" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rwmt1.val +
  " </span>energy";
item.rwmt1.stype = 4;
item.rwmt1.rot = [0.25, 0.45, 0.1, 0.2];
item.rwmt1.onGet = function () {
  if (this.amount >= 5) {
    giveRcp(rcp.rsmt);
    this.onGet = function () {};
  }
};
item.rwmt1.use = function () {
  if (random() < 0.15) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};
item.rwmt1.onChange = function (x, y) {
  if (y) return [item.rtnmt, x];
  giveItem(item.rtnmt, x);
};

item.rice = new Item();
item.rice.id = 8;
item.rice.name = "Rice";
item.rice.val = 2;
item.rice.desc =
  "Clean rice grains. Healthy and delicious when cooked, but awful to eat in dry state" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rice.val +
  " </span>energy";
item.rice.stype = 4;
item.rice.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.borc = new Item();
item.borc.id = 9;
item.borc.name = "Steamed Rice";
item.borc.val = 18;
item.borc.desc =
  "Fluffy rice. Simple dish that tastes good" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.borc.val +
  " </span>energy";
item.borc.stype = 4;
item.borc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.begg = new Item();
item.begg.id = 10;
item.begg.name = "Boiled Egg";
item.begg.val = 7;
item.begg.desc =
  "Hard/soft-boiled egg, you aren't sure. Will fill you up either way" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.begg.val +
  " </span>energy";
item.begg.stype = 4;
item.begg.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.kit = new Item();
item.kit.id = 11;
item.kit.name = "Kikatsugan";
item.kit.val = 800;
item.kit.desc =
  "Ninja ration consisting mostly of cereals that, according to esoteric scrolls, <span style='color:orange'>\"Could sustain one in both mind and body with only three grains per day\"</span>" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.kit.val +
  " </span>energy";
item.kit.stype = 4;
item.kit.rar = 4;
item.kit.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(390);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.bac = new Item();
item.bac.id = 12;
item.bac.name = "Bacon";
item.bac.val = 12;
item.bac.desc =
  "The food of kings" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bac.val +
  " </span>energy";
item.bac.stype = 4;
item.bac.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.bgt = new Item();
item.bgt.id = 13;
item.bgt.name = "Baguette";
item.bgt.val = 17;
item.bgt.desc =
  "A very long bread" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bgt.val +
  " </span>energy";
item.bgt.stype = 4;
item.bgt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.bhd = new Item();
item.bhd.id = 14;
item.bhd.name = "Hardtack";
item.bhd.val = 6;
item.bhd.desc =
  "A dry and virtually tasteless bread product capable of remaining edible without spoilage for vast lengths of time" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bhd.val +
  " </span>energy";
item.bhd.stype = 4;
item.bhd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.spb = new Item();
item.spb.id = 15;
item.spb.name = "Spoiled Bread";
item.spb.val = 8;
item.spb.desc =
  " Piece of old stale bread covered in mold. Takes courage to eat" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.spb.val +
  " </span>energy";
item.spb.stype = 4;
item.spb.rar = 0;
item.spb.use = function () {
  if (random() < 0.4) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(17);
  global.stat.fooda++;
  global.stat.foodt++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wsb = new Item();
item.wsb.id = 16;
item.wsb.name = "Wastebread";
item.wsb.val = 11;
item.wsb.desc =
  "When flour becomes a commodity to deal with, wayfarers and the poor resort to mix it with leftovers of other ingredients and bake it all into bread" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wsb.val +
  " </span>energy";
item.wsb.stype = 4;
item.wsb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.onn = new Item();
item.onn.id = 17;
item.onn.name = "Onion";
item.onn.val = 3;
item.onn.desc =
  "Vegetable cultivated since ancient times. Enhances the dish in various ways, also makes you cry" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.onn.val +
  " </span>energy";
item.onn.stype = 4;
item.onn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.sgr = new Item();
item.sgr.id = 18;
item.sgr.name = "Sugar";
item.sgr.val = 1;
item.sgr.desc =
  "Sweet little crystals. Kids love treats made out of them" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sgr.val +
  " </span>energy";
item.sgr.stype = 4;
item.sgr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(1);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wht = new Item();
item.wht.id = 19;
item.wht.name = "Wheat";
item.wht.val = 1;
item.wht.desc =
  "Raw wheat. While not very tasty, powder made out of them is the main ingredient in breadmaking" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wht.val +
  " </span>energy";
item.wht.stype = 4;
item.wht.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(1);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.tmt = new Item();
item.tmt.id = 20;
item.tmt.name = "Tomato";
item.tmt.val = 8;
item.tmt.desc =
  "Soursweet juicy edible, has many uses in cooking. Rumored to be poisonous" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.tmt.val +
  " </span>energy";
item.tmt.stype = 4;
item.tmt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.cbg = new Item();
item.cbg.id = 21;
item.cbg.name = "Cabbage";
item.cbg.val = 12;
item.cbg.desc =
  "Crisp layered vegetable. Used in variety of dishes" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cbg.val +
  " </span>energy";
item.cbg.stype = 4;
item.cbg.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mshr = new Item();
item.mshr.id = 22;
item.mshr.name = "Mushroom";
item.mshr.val = 5;
item.mshr.desc =
  "Common edible mushroom. When cooked with the right ingredients, the flavour of this mushroom is not so common" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mshr.val +
  " </span>energy";
item.mshr.stype = 4;
item.mshr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.bnn = new Item();
item.bnn.id = 23;
item.bnn.name = "Banana";
item.bnn.val = 8;
item.bnn.desc =
  "Fruit full of potassium. Originaly cultivated as staple food, but eventually gained popularity" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bnn.val +
  " </span>energy";
item.bnn.stype = 4;
item.bnn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(1);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wbrs = new Item();
item.wbrs.id = 24;
item.wbrs.name = "Wild Berries";
item.wbrs.val = 7;
item.wbrs.desc =
  "Wide selection of various edible berries collected from the forest" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wbrs.val +
  " </span>energy";
item.wbrs.stype = 4;
item.wbrs.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(1);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.strwb = new Item();
item.strwb.id = 25;
item.strwb.name = "Strawberry";
item.strwb.val = 18;
item.strwb.desc =
  "Heap of plump red berries. They are sweet and popular with children and royalty" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.strwb.val +
  " </span>energy";
item.strwb.stype = 4;
item.strwb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.orng = new Item();
item.orng.id = 26;
item.orng.name = "Orange";
item.orng.val = 9;
item.orng.desc =
  "Fragnant citruis, can be either sour or sweet depending where it was cultivated" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.orng.val +
  " </span>energy";
item.orng.stype = 4;
item.orng.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ches = new Item();
item.ches.id = 27;
item.ches.name = "Cheese";
item.ches.val = 13;
item.ches.desc =
  "Fermented cow milk. Despite having strong smell it is a tasty and popular product. Can be eaten raw" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ches.val +
  " </span>energy";
item.ches.stype = 4;
item.ches.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ltcc = new Item();
item.ltcc.id = 28;
item.ltcc.name = "Lettuce";
item.ltcc.val = 2;
item.ltcc.desc =
  "Watery leaves, usually used in salads" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ltcc.val +
  " </span>energy";
item.ltcc.stype = 4;
item.ltcc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.brly = new Item();
item.brly.id = 29;
item.brly.name = "Barley";
item.brly.val = 2;
item.brly.desc =
  "Grainy cereal used for malting. A staple of brewing everywhere. It can also be ground into flour" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.brly.val +
  " </span>energy";
item.brly.stype = 4;
item.brly.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(1);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.grlc = new Item();
item.grlc.id = 30;
item.grlc.name = "Garlic";
item.grlc.val = 6;
item.grlc.desc =
  "A pungent garlic, popular as a seasoning for its strong flavor" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.grlc.val +
  " </span>energy";
item.grlc.stype = 4;
item.grlc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.pmpk = new Item();
item.pmpk.id = 31;
item.pmpk.name = "Pumpkin";
item.pmpk.val = 12;
item.pmpk.desc =
  "A large vegetable, about the size of your head. Not very tasty raw, but is great for cooking" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.pmpk.val +
  " </span>energy";
item.pmpk.stype = 4;
item.pmpk.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.lmn = new Item();
item.lmn.id = 32;
item.lmn.name = "Lemon";
item.lmn.val = 8;
item.lmn.desc =
  "Very sour citrus. Can be eaten if you really want" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.lmn.val +
  " </span>energy";
item.lmn.stype = 4;
item.lmn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.grp = new Item();
item.grp.id = 33;
item.grp.name = "Grapes";
item.grp.val = 8;
item.grp.desc =
  "A cluster of juicy grapes. If you ferment them they'll turn into wine" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.grp.val +
  " </span>energy";
item.grp.stype = 4;
item.grp.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.pnpl = new Item();
item.pnpl.id = 34;
item.pnpl.name = "Pineapple";
item.pnpl.val = 12;
item.pnpl.desc =
  "A large, spiky pineapple. A bit sour, though" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.pnpl.val +
  " </span>energy";
item.pnpl.stype = 4;
item.pnpl.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.rsmt = new Item();
item.rsmt.id = 35;
item.rsmt.name = "Roasted Meat";
item.rsmt.val = 15;
item.rsmt.rot = [0.1, 0.25, 0.05, 0.15];
item.rsmt.desc =
  "Simple slab of meat, roasted on an open fire without any seasoning. Tastes pretty good nonetheless" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rsmt.val +
  " </span>energy";
item.rsmt.stype = 4;
item.rsmt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.tbrwd = new Item();
item.tbrwd.id = 36;
item.tbrwd.name = "Tea";
item.tbrwd.val = 20;
item.tbrwd.desc =
  "The beverage of gentlemen everywhere, made from applying hot water to leaves of the tea plant. Often used during the ceremonies as a social supplement" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.tbrwd.val +
  " </span>energy";
item.tbrwd.stype = 4;
item.tbrwd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.htbrwd = new Item();
item.htbrwd.id = 37;
item.htbrwd.name = "Herbal Tea";
item.htbrwd.val = 16;
item.htbrwd.desc =
  "Healthy beverage brewed from various herbs, has a powerful relaxation effect" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.htbrwd.val +
  " </span>energy";
item.htbrwd.stype = 4;
item.htbrwd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.segg = new Item();
item.segg.id = 38;
item.segg.name = "Scrambled Eggs";
item.segg.val = 20;
item.segg.desc =
  "Fluffy and delicious scrambled eggs" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.segg.val +
  " </span>energy";
item.segg.stype = 4;
item.segg.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.irntl = new Item();
item.irntl.id = 39;
item.irntl.name = "Indigo Rantil";
item.irntl.val = 31;
item.irntl.desc =
  "Wierd wine mixed with whiskey and rum" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.irntl.val +
  " </span>energy";
item.irntl.stype = 4;
item.irntl.rar = 2;
item.irntl.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(17);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 21);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 130);
  else effect.drunk.duration += 75;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wine1 = new Item();
item.wine1.id = 40;
item.wine1.name = "One-year Wine";
item.wine1.val = 12;
item.wine1.desc =
  "Barely reached the standard, maybe you should keep it for longer" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wine1.val +
  " </span>energy";
item.wine1.stype = 4;
item.wine1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 5);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 60);
  else effect.drunk.duration += 35;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wines1 = new Item();
item.wines1.id = 41;
item.wines1.name = "Valens";
item.wines1.val = 100;
item.wines1.desc =
  "A Celtic red wine with delicate, yet robust, flavour" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wines1.val +
  " </span>energy";
item.wines1.stype = 4;
item.wines1.rar = 4;
item.wines1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(100);
  global.stat.foodb++;
  global.stat.foodal++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wines2 = new Item();
item.wines2.id = 42;
item.wines2.name = "Prudens";
item.wines2.val = 100;
item.wines2.desc =
  "The most elegant red wine, with gentle flavour and bouquet" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wines2.val +
  " </span>energy";
item.wines2.stype = 4;
item.wines2.rar = 4;
item.wines2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(100);
  global.stat.foodb++;
  global.stat.foodal++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wines3 = new Item();
item.wines3.id = 43;
item.wines3.name = "Volare";
item.wines3.val = 100;
item.wines3.desc =
  "A Celtic white wine known for its honey-like fragrance" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wines3.val +
  " </span>energy";
item.wines3.stype = 4;
item.wines3.rar = 4;
item.wines3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(100);
  global.stat.foodb++;
  global.stat.foodal++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wines4 = new Item();
item.wines4.id = 44;
item.wines4.name = "Audentia";
item.wines4.val = 100;
item.wines4.desc =
  "A Celtic quality sweet wine allowed to age to perfection" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wines4.val +
  " </span>energy";
item.wines4.stype = 4;
item.wines4.rar = 4;
item.wines4.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(100);
  global.stat.foodb++;
  global.stat.foodal++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wines5 = new Item();
item.wines5.id = 45;
item.wines5.name = "Virtus";
item.wines5.val = 100;
item.wines5.desc =
  "A sparkling wine made from a blend of three grapes" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wines5.val +
  " </span>energy";
item.wines5.stype = 4;
item.wines5.rar = 4;
item.wines5.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(100);
  global.stat.foodb++;
  global.stat.foodal++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.acrn = new Item();
item.acrn.id = 46;
item.acrn.name = "Acorn";
item.acrn.val = 4;
item.acrn.desc =
  "A handful of acorns, still in their shells. Squirrels like them, but they're not very good for you to eat in this state" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.acrn.val +
  " </span>energy";
item.acrn.stype = 4;
item.acrn.use = function () {
  if (random() < 0.4) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wine2 = new Item();
item.wine2.id = 47;
item.wine2.name = "Three-year Wine";
item.wine2.val = 24;
item.wine2.desc =
  "Delicious wine kept for more than 3 years" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wine2.val +
  " </span>energy";
item.wine2.stype = 4;
item.wine2.rar = 2;
item.wine2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(17);
  global.stat.foodal++;
  global.stat.foodb++;
  giveSkExp(skl.drka, 12);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 90);
  else effect.drunk.duration += 45;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.winec1 = new Item();
item.winec1.id = 48;
item.winec1.name = "Cheap Red Wine";
item.winec1.val = 8;
item.winec1.desc =
  "Very rough wine made from fermeted fruit" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.winec1.val +
  " </span>energy";
item.winec1.stype = 4;
item.winec1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 5);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 55);
  else effect.drunk.duration += 33;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.winec2 = new Item();
item.winec2.id = 49;
item.winec2.name = "Cheap White Wine";
item.winec2.val = 12;
item.winec2.desc =
  "Light wine, prepared only recently" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.winec2.val +
  " </span>energy";
item.winec2.stype = 4;
item.winec2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 8);
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 60);
  else effect.drunk.duration += 35;
};

item.ske = new Item();
item.ske.id = 50;
item.ske.name = "Sake";
item.ske.val = 31;
item.ske.desc =
  "Eastern rice wine, popular past-time drink" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ske.val +
  " </span>energy";
item.ske.stype = 4;
item.ske.rar = 2;
item.ske.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(25);
  global.stat.foodal++;
  global.stat.foodb++;
  giveSkExp(skl.drka, 25);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 180);
  else effect.drunk.duration += 115;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.pske = new Item();
item.pske.id = 51;
item.pske.name = "Premium Sake";
item.pske.val = 51;
item.pske.desc =
  "Rich Sake with strong foundation, flavorful and fragnant. Valued in high society for its presige status" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.pske.val +
  " </span>energy";
item.pske.stype = 4;
item.pske.rar = 3;
item.pske.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(65);
  global.stat.foodal++;
  global.stat.foodb++;
  giveSkExp(skl.drka, 150);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 380);
  else effect.drunk.duration += 190;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.cbun1 = new Item();
item.cbun1.id = 52;
item.cbun1.name = "Steamed Bun";
item.cbun1.val = 19;
item.cbun1.desc =
  "Plain round bun, very soft and filling" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cbun1.val +
  " </span>energy";
item.cbun1.stype = 4;
item.cbun1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.cbun2 = new Item();
item.cbun2.id = 53;
item.cbun2.name = "Red Bean Bun";
item.cbun2.val = 29;
item.cbun2.desc =
  "Bun with red beans added to it, resulting in rich flavour" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cbun2.val +
  " </span>energy";
item.cbun2.stype = 4;
item.cbun2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.cbun3 = new Item();
item.cbun3.id = 54;
item.cbun3.name = "Pork Bun";
item.cbun3.val = 34;
item.cbun3.desc =
  "Delicious treat with pork meat inside of it, fine addition to your dinner" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cbun3.val +
  " </span>energy";
item.cbun3.stype = 4;
item.cbun3.rar = 2;
item.cbun3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.scak = new Item();
item.scak.id = 55;
item.scak.name = "Strawberry Shortcake";
item.scak.val = 39;
item.scak.desc =
  "Sweet cake with cream and strawberries, has a soft texture and melts in your mouth" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.scak.val +
  " </span>energy";
item.scak.stype = 4;
item.scak.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(13);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.atrt = new Item();
item.atrt.id = 56;
item.atrt.name = "Apple Tart";
item.atrt.val = 29;
item.atrt.desc =
  "Crunchy small cake baked with apples" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.atrt.val +
  " </span>energy";
item.atrt.stype = 4;
item.atrt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.strt = new Item();
item.strt.id = 57;
item.strt.name = "Strawberry Tart";
item.strt.val = 38;
item.strt.desc =
  "Sweet pastry with strawberries added on top" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.strt.val +
  " </span>energy";
item.strt.stype = 4;
item.strt.rar = 2;
item.strt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ccak = new Item();
item.ccak.id = 58;
item.ccak.name = "Cheesecake";
item.ccak.val = 52;
item.ccak.desc =
  "Delicious sweet dessert prepared in multiple layers. With fruit jam on top!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ccak.val +
  " </span>energy";
item.ccak.stype = 4;
item.ccak.rar = 2;
item.ccak.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(15);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.icrm = new Item();
item.icrm.id = 59;
item.icrm.name = "Ice Cream";
item.icrm.val = 19;
item.icrm.desc =
  "A sweet, frozen food made of milk with rich amounts of sugar. Gets very popular during Summer" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.icrm.val +
  " </span>energy";
item.icrm.stype = 4;
item.icrm.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.lnch1 = new Item();
item.lnch1.id = 60;
item.lnch1.name = "Bacon and Eggs";
item.lnch1.val = 40;
item.lnch1.desc =
  "Breakfast of choice and a part of your morning ritual, very filling" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.lnch1.val +
  " </span>energy";
item.lnch1.stype = 4;
item.lnch1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.lnch2 = new Item();
item.lnch2.id = 61;
item.lnch2.name = "Morning Set";
item.lnch2.val = 47;
item.lnch2.desc =
  "Eggs and toast. Goes best with Coffee" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.lnch2.val +
  " </span>energy";
item.lnch2.stype = 4;
item.lnch2.rar = 2;
item.lnch2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(15);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.lnch3 = new Item();
item.lnch3.id = 62;
item.lnch3.name = "Lunch Set";
item.lnch3.val = 58;
item.lnch3.desc =
  "Hefty combination of meat, eggs and a toast." +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.lnch3.val +
  " </span>energy";
item.lnch3.stype = 4;
item.lnch3.rar = 2;
item.lnch3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(22);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.orgs = new Item();
item.orgs.id = 63;
item.orgs.name = "Onion Rings";
item.orgs.val = 20;
item.orgs.desc =
  "Golden slices of onion, buttered and fried in flour. Crunchy!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.orgs.val +
  " </span>energy";
item.orgs.stype = 4;
item.orgs.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.fsh1 = new Item();
item.fsh1.id = 65;
item.fsh1.name = "Fish";
item.fsh1.val = 15;
item.fsh1.desc =
  "Freshly caught fish. Makes a passable meal raw" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.fsh1.val +
  " </span>energy";
item.fsh1.stype = 4;
item.fsh1.use = function () {
  if (random() < 0.1) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.fsh2 = new Item();
item.fsh2.id = 66;
item.fsh2.name = "Fish Fillet";
item.fsh2.val = 6;
item.fsh2.desc =
  "The fillet of fish, ready to be cooked" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.fsh2.val +
  " </span>energy";
item.fsh2.stype = 4;
item.fsh2.use = function () {
  if (random() < 0.05) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ffsh1 = new Item();
item.ffsh1.id = 67;
item.ffsh1.name = "Cooked Fish";
item.ffsh1.val = 19;
item.ffsh1.desc =
  "Evenly fried delicious fish. It has a very deicious aroma" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ffsh1.val +
  " </span>energy";
item.ffsh1.stype = 4;
item.ffsh1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ffsh2 = new Item();
item.ffsh2.id = 68;
item.ffsh2.name = "Batter Fried Fish";
item.ffsh2.val = 42;
item.ffsh2.desc =
  "A delicious golden brown serving of crispy fried fish" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ffsh2.val +
  " </span>energy";
item.ffsh2.stype = 4;
item.ffsh2.rar = 2;
item.ffsh2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ssm = new Item();
item.ssm.id = 69;
item.ssm.name = "Sashimi";
item.ssm.val = 17;
item.ssm.desc =
  "Little fish slices, served with tangly dip sauce" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ssm.val +
  " </span>energy";
item.ssm.stype = 4;
item.ssm.rar = 2;
item.ssm.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.dssm = new Item();
item.dssm.id = 70;
item.dssm.name = "Deluxe Sashimi";
item.dssm.val = 43; // fish soy cucum lettuc
item.dssm.desc =
  "Delicious slivers of thinly sliced raw fish and tasty vegetables" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.dssm.val +
  " </span>energy";
item.dssm.stype = 4;
item.dssm.rar = 2;
item.dssm.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(15);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mkzs = new Item();
item.mkzs.id = 71;
item.mkzs.name = "Makizushi";
item.mkzs.val = 35;
item.mkzs.desc =
  "Delicious fish slices wrapped in tasty sushi rice and rolled up in a healthy nori" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mkzs.val +
  " </span>energy";
item.mkzs.stype = 4;
item.mkzs.rar = 2;
item.mkzs.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(17);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.nori = new Item();
item.nori.id = 72;
item.nori.name = "Nori";
item.nori.val = 10;
item.nori.desc =
  "Pages of dried seaweed, very healthy and tastes like ocean" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.nori.val +
  " </span>energy";
item.nori.stype = 4;
item.nori.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.fnori = new Item();
item.fnori.id = 73;
item.fnori.name = "Fried Nori";
item.fnori.val = 20;
item.fnori.desc =
  "Sheets of nori friend with salt, giving it an entirely new taste. An incredibly delicios and popular snack" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.fnori.val +
  " </span>energy";
item.fnori.stype = 4;
item.fnori.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.swtch1 = new Item();
item.swtch1.id = 74;
item.swtch1.name = "Sandwich";
item.swtch1.val = 40;
item.swtch1.desc =
  "Two peices of bread and a slice of cheese inbetween. Simple and tasty" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.swtch1.val +
  " </span>energy";
item.swtch1.stype = 4;
item.swtch1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.jll = new Item();
item.jll.id = 75;
item.jll.name = "Jelly";
item.jll.val = 6;
item.jll.desc =
  "Should you really be eating this stuff?" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.jll.val +
  " </span>energy";
item.jll.stype = 4;
item.jll.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.flr = new Item();
item.flr.id = 76;
item.flr.name = "Flour";
item.flr.val = 1;
item.flr.desc =
  "This enriched white flour is useful for baking" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.flr.val +
  " </span>energy";
item.flr.stype = 4;
item.flr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.pcns = new Item();
item.pcns.id = 77;
item.pcns.name = "Pine Nuts";
item.pcns.val = 4;
item.pcns.desc =
  "A handful of tasty crunchy nuts from a pinecone" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.pcns.val +
  " </span>energy";
item.pcns.stype = 4;
item.pcns.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.dgh = new Item();
item.dgh.id = 78;
item.dgh.name = "Dough";
item.dgh.val = 4;
item.dgh.desc =
  "Flour mixed with water, kneaded into a gooey paste.  This dough can be used to bake bread more efficiently than with just flour" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.dgh.val +
  " </span>energy";
item.dgh.stype = 4;
item.dgh.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.hzlnt = new Item();
item.hzlnt.id = 79;
item.hzlnt.name = "Hazelnuts";
item.hzlnt.val = 6;
item.hzlnt.desc =
  "Popular forest nuts, still in their shells. They smell like the woods they come from" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hzlnt.val +
  " </span>energy";
item.hzlnt.stype = 4;
item.hzlnt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.hpck = new Item();
item.hpck.id = 80;
item.hpck.name = "Hippo Cookie";
item.hpck.val = 33;
item.hpck.desc =
  "Soft cookies in a shape of a cute hippo, baked with milk and hazelnuts. Very popular with children and adults alike" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hpck.val +
  " </span>energy";
item.hpck.stype = 4;
item.hpck.rar = 2;
item.hpck.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.dfrt = new Item();
item.dfrt.id = 81;
item.dfrt.name = "Dried Fruit";
item.dfrt.val = 12;
item.dfrt.desc =
  "Fruit roughly chopped and sun-dried, prepared as marching rations for the rangers" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.dfrt.val +
  " </span>energy";
item.dfrt.stype = 4;
item.dfrt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.brdb = new Item();
item.brdb.id = 82;
item.brdb.name = "Burnt Bread";
item.brdb.val = 4;
item.brdb.desc =
  "Completely ruined and unappetizing loaf of charred bread. You can still eat it, but you probably won't enjoy it" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.brdb.val +
  " </span>energy";
item.brdb.stype = 4;
item.brdb.rar = 0;
item.brdb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  global.stat.foodt++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.spcn = new Item();
item.spcn.id = 83; //Pukusakina
item.spcn.name = "Soft Windflower";
item.spcn.val = 5;
item.spcn.desc =
  "Wild vegetable that goes well with meat. " +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.spcn.val +
  " </span>energy";
item.spcn.stype = 4;
item.spcn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.hney = new Item();
item.hney.id = 84;
item.hney.name = "Honey";
item.hney.val = 11;
item.hney.desc =
  "Sweet sticky syrup that bees make. Can be turned into candy, but also very good by itself" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hney.val +
  " </span>energy";
item.hney.stype = 4;
item.hney.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.brise = new Item();
item.brise.id = 85;
item.brise.name = "Bad Rice";
item.brise.val = 8;
item.brise.desc =
  "Old spoiled rice that's gone bad and turned yellow. Desperate food" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.brise.val +
  " </span>energy";
item.brise.stype = 4;
item.brise.rar = 0;
item.brise.use = function () {
  if (random() < 0.75) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(16);
  global.stat.fooda++;
  global.stat.foodt++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.steak = new Item();
item.steak.id = 86;
item.steak.name = "Steak";
item.steak.val = 50;
item.steak.desc =
  "Quality steak seared to perfection with a sprinkle of salt and generous twist of pepper. The delicious aroma is enough to make you drool" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.steak.val +
  " </span>energy";
item.steak.stype = 4;
item.steak.rar = 2;
item.steak.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(15);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.spc1 = new Item();
item.spc1.id = 87;
item.spc1.name = "Black Pepper";
item.spc1.val = 2;
item.spc1.desc =
  "Small black berries with pungent aroma. Perfect for spicing food up" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.spc1.val +
  " </span>energy";
item.spc1.stype = 4;
item.spc1.rar = 2;
item.spc1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.cnmn = new Item();
item.cnmn.id = 88;
item.cnmn.name = "Cinnamon";
item.cnmn.val = 3;
item.cnmn.desc =
  "Bark sticks from the Cinnamon tree. Fragnant and good for your health" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cnmn.val +
  " </span>energy";
item.cnmn.stype = 4;
item.cnmn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.bttr = new Item();
item.bttr.id = 89;
item.bttr.name = "Butter";
item.bttr.val = 8;
item.bttr.desc =
  "Small brick of creamy butter, made from churned cow milk " +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bttr.val +
  " </span>energy";
item.bttr.stype = 4;
item.bttr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.cnmnb = new Item();
item.cnmnb.id = 90;
item.cnmnb.name = "Cinnamon Bun";
item.cnmnb.val = 36;
item.cnmnb.desc =
  "Fluffy sweet pastry bun with aromatic cinnamon powder sprinkled on top of it. Rare treat everyone can enjoy " +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cnmnb.val +
  " </span>energy";
item.cnmnb.stype = 4;
item.cnmnb.rar = 2;
item.cnmnb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.brth = new Item();
item.brth.id = 91;
item.brth.name = "Broth";
item.brth.val = 16;
item.brth.desc =
  "Tasty and healthy meat broth. Used mainly for cooking soups, but can be consumed as is" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.brth.val +
  " </span>energy";
item.brth.stype = 4;
item.brth.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.eggsp = new Item();
item.eggsp.id = 92;
item.eggsp.name = "Egg Soup";
item.eggsp.val = 46;
item.eggsp.desc =
  "Popular soup made from delicious broth and eggs. It's a great meal to start your day with" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.eggsp.val +
  " </span>energy";
item.eggsp.stype = 4;
item.eggsp.rar = 2;
item.eggsp.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.scln = new Item();
item.scln.id = 93;
item.scln.name = "Scallion";
item.scln.val = 4;
item.scln.desc =
  "Green scallions, also known as spring onions. Slightly spicy and fragnant, they help to bring out the taste of the soups" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.scln.val +
  " </span>energy";
item.scln.stype = 4;
item.scln.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.crmchd = new Item();
item.crmchd.id = 94;
item.crmchd.name = "Creamy Chowder";
item.crmchd.val = 62;
item.crmchd.desc =
  "Delicious meat howder with milk, cheese and potato flakes. You can practically taste the chef's skill" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.crmchd.val +
  " </span>energy";
item.crmchd.stype = 4;
item.crmchd.rar = 2;
item.crmchd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.chklt = new Item();
item.chklt.id = 95;
item.chklt.name = "Chocolate";
item.chklt.val = 9;
item.chklt.desc =
  "Ground cacao beans solidified into a sweet, tasty treat" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.chklt.val +
  " </span>energy";
item.chklt.stype = 4;
item.chklt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.fegg = new Item();
item.fegg.id = 96;
item.fegg.name = "Fried Egg";
item.fegg.val = 9;
item.fegg.desc =
  "An egg, simply fried as is. It's pretty good" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.fegg.val +
  " </span>energy";
item.fegg.stype = 4;
item.fegg.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.crn = new Item();
item.crn.id = 97;
item.crn.name = "Corn";
item.crn.val = 3;
item.crn.desc =
  "Golden kernels, attached to a cob. Practically inedible like this" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.crn.val +
  " </span>energy";
item.crn.stype = 4;
item.crn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.bcrn = new Item();
item.bcrn.id = 98;
item.bcrn.name = "Butter Corn";
item.bcrn.val = 25;
item.bcrn.desc =
  "Golden brown corn fried in generous amount of butter. Very tasty" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bcrn.val +
  " </span>energy";
item.bcrn.stype = 4;
item.bcrn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.pcrn = new Item();
item.pcrn.id = 99;
item.pcrn.name = "Popcorn";
item.pcrn.val = 10;
item.pcrn.desc =
  "Corn kernels, roasted under high heat. They make a *pop* sound and explode into little edible clouds" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.pcrn.val +
  " </span>energy";
item.pcrn.stype = 4;
item.pcrn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.cpcrn = new Item();
item.cpcrn.id = 100;
item.cpcrn.name = "Salted Popcorn";
item.cpcrn.val = 15;
item.cpcrn.desc =
  "Regular popcorn, but slightly salted for extra taste" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cpcrn.val +
  " </span>energy";
item.cpcrn.stype = 4;
item.cpcrn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.fbrd = new Item();
item.fbrd.id = 101;
item.fbrd.name = "Flatbread";
item.fbrd.val = 12;
item.fbrd.desc =
  "Primitive unleavened bread" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.fbrd.val +
  " </span>energy";
item.fbrd.stype = 4;
item.fbrd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.gcce = new Item();
item.gcce.id = 102;
item.gcce.name = "Ginger Cookie";
item.gcce.val = 25;
item.gcce.desc =
  "Spiced cookies baked from a batter of flour, molasses and ginger powder" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.gcce.val +
  " </span>energy";
item.gcce.stype = 4;
item.gcce.rar = 2;
item.gcce.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.bcrc = new Item();
item.bcrc.id = 103;
item.bcrc.name = "Bone Cracker";
item.bcrc.val = 12;
item.bcrc.desc =
  "Bones of some kind, baked until crisp" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bcrc.val +
  " </span>energy";
item.bcrc.stype = 4;
item.bcrc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.snkb = new Item();
item.snkb.id = 104;
item.snkb.name = "Snack Bar";
item.snkb.val = 30;
item.snkb.desc =
  "Fruit, sugar, and grain meal mixed and molded before being backed into a stcik-shaped pastry" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.snkb.val +
  " </span>energy";
item.snkb.stype = 4;
item.snkb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.dmtp = new Item();
item.dmtp.id = 105;
item.dmtp.name = "Deluxe Meat Pie";
item.dmtp.val = 60;
item.dmtp.desc =
  "Premium pie with abudance of various meats, best eaten hot! Extremely filling" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.dmtp.val +
  " </span>energy";
item.dmtp.rar = 2;
item.dmtp.stype = 4;
item.dmtp.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(41);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.lkmc = new Item();
item.lkmc.id = 106;
item.lkmc.name = "Lokum";
item.lkmc.val = 29;
item.lkmc.desc =
  "Grain meal cooked down, mixed with mashed fruits and then cooled to produce a soft candy" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.lkmc.val +
  " </span>energy";
item.lkmc.stype = 4;
item.lkmc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.vgsn = new Item();
item.vgsn.id = 107;
item.vgsn.name = "Vegetable Sandwich";
item.vgsn.val = 35;
item.vgsn.desc =
  "A sandwich with sliced cucumber filling. Tastes slightly bland" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.vgsn.val +
  " </span>energy";
item.vgsn.stype = 4;
item.vgsn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.stgp = new Item();
item.stgp.id = 108;
item.stgp.name = "Stargazing Pie";
item.stgp.val = 55;
item.stgp.desc =
  "A pie containing a whole fish romantically gazing up at the stars" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.stgp.val +
  " </span>energy";
item.stgp.stype = 4;
item.stgp.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(18);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.tdpps = new Item();
item.tdpps.id = 109;
item.tdpps.name = "Tallow Drops";
item.tdpps.val = 33;
item.tdpps.desc =
  "Nourishing tallow, molded into lozenges. Subtly sweet" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.tdpps.val +
  " </span>energy";
item.tdpps.stype = 4;
item.tdpps.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.chstn = new Item();
item.chstn.id = 110;
item.chstn.name = "Chestnuts";
item.chstn.val = 5;
item.chstn.desc =
  "Delicious acorns which release more flavour the more one chews on them" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.chstn.val +
  " </span>energy";
item.chstn.stype = 4;
item.chstn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(1);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.prfd = new Item();
item.prfd.id = 111;
item.prfd.name = "Prison Food";
item.prfd.val = 22;
item.prfd.desc =
  "This jail level delicacy is nutritious, generously portioned and inexpensive. But it doesn't taste good" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.prfd.val +
  " </span>energy";
item.prfd.stype = 4;
item.prfd.rar = 0;
item.prfd.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.brmt = new Item();
item.brmt.id = 112;
item.brmt.name = "Burnt Meat";
item.brmt.val = 7;
item.brmt.desc =
  "Coal-looking overcooked chunk of meat. Mildly nutritious but awful to eat" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.brmt.val +
  " </span>energy";
item.brmt.stype = 4;
item.brmt.rar = 0;
item.brmt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  global.stat.foodt++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mbsps = new Item();
item.mbsps.id = 113;
item.mbsps.name = "Mebaspa Sandwich";
item.mbsps.val = 52;
item.mbsps.desc =
  "Ordinary bread with meatballs and spaghetti put in it, it's extremely high on cholesterol. Weird skeleton kid invented this dish" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mbsps.val +
  " </span>energy";
item.mbsps.stype = 4;
item.mbsps.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(66);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.spgt = new Item();
item.spgt.id = 114;
item.spgt.name = "Spaghetti and Meatballs";
item.spgt.val = 33;
item.spgt.desc =
  "Long noodles with meat and meatsauce. Renown food from some far off land" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.spgt.val +
  " </span>energy";
item.spgt.stype = 4;
item.spgt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mnj1 = new Item();
item.mnj1.id = 115;
item.mnj1.name = "Manjū";
item.mnj1.val = 26;
item.mnj1.desc =
  "Popular traditional eastern confection, kneaded boiled bun with the variety of sweet fillings within in" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mnj1.val +
  " </span>energy";
item.mnj1.stype = 4;
item.mnj1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mnj2 = new Item();
item.mnj2.id = 116;
item.mnj2.name = "Alcoholic Manjū";
item.mnj2.val = 38;
item.mnj2.desc =
  "Manjū bun with delicious sake added to it" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mnj2.val +
  " </span>energy";
item.mnj2.rar = 2;
item.mnj2.stype = 4;
item.mnj2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 10);
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ntea1 = new Item();
item.ntea1.id = 117;
item.ntea1.name = "Landen Flower Tea";
item.ntea1.val = 26;
item.ntea1.desc =
  "Rare herbal tea created by a talented pharmacist. It calms and relaxes those who drink it." +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ntea1.val +
  " </span>energy";
item.ntea1.rar = 2;
item.ntea1.stype = 4;
item.ntea1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.jrk1 = new Item();
item.jrk1.id = 118;
item.jrk1.name = "Beef Jerky";
item.jrk1.val = 18;
item.jrk1.desc =
  "Perfectly dried strips of meat. The taste is not bad, this jerky can be kept edible for years" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.jrk1.val +
  " </span>energy";
item.jrk1.stype = 4;
item.jrk1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.jrk2 = new Item();
item.jrk2.id = 119;
item.jrk2.name = "Spicy Jerky";
item.jrk2.val = 30;
item.jrk2.desc =
  "Valuable jerky, enriched and improved. Salted and spiced into a filling and tasty travel food" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.jrk2.val +
  " </span>energy";
item.jrk2.stype = 4;
item.jrk2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ongr = new Item();
item.ongr.id = 120;
item.ongr.name = "Onigiri";
item.ongr.val = 25;
item.ongr.desc =
  "A simple portable food consisting of cooked rice rolled into a ball and seasoned with salt" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ongr.val +
  " </span>energy";
item.ongr.stype = 4;
item.ongr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.rbmb = new Item();
item.rbmb.id = 121;
item.rbmb.name = "Rice Bomb";
item.rbmb.val = 33;
item.rbmb.desc =
  "A grilled onigiri with a miso-ginger glaze that creates explosion of flavour" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rbmb.val +
  " </span>energy";
item.rbmb.stype = 4;
item.rbmb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mchii = new Item();
item.mchii.id = 122;
item.mchii.name = "Mochi";
item.mchii.val = 22;
item.mchii.desc =
  "Dumpling made with kneaded mochi rice flour" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mchii.val +
  " </span>energy";
item.mchii.stype = 4;
item.mchii.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mchai = new Item();
item.mchai.id = 123;
item.mchai.name = "Kuzumochi";
item.mchai.val = 29;
item.mchai.desc =
  "Variation of mochi, made by glazing grilled rice flour with kudzu sauce" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mchai.val +
  " </span>energy";
item.mchai.stype = 4;
item.mchai.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.igum = new Item();
item.igum.id = 124;
item.igum.name = "Ice Gummy";
item.igum.val = 17;
item.igum.desc =
  "A refreshing snack made from larvae suspended in fruit juice gelatin" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.igum.val +
  " </span>energy";
item.igum.stype = 4;
item.igum.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.msoop = new Item();
item.msoop.id = 125;
item.msoop.name = "Mushroom Soup";
item.msoop.val = 37;
item.msoop.desc =
  "Refreshing soup made of chopped mushrooms, potatoes and onions boiled together" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.msoop.val +
  " </span>energy";
item.msoop.stype = 4;
item.msoop.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.rmn1 = new Item();
item.rmn1.id = 126;
item.rmn1.name = "Chashu Ramen";
item.rmn1.val = 41;
item.rmn1.desc =
  "This ramen features fresh soy sauce broth and deliciously textured chashu pork " +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rmn1.val +
  " </span>energy";
item.rmn1.stype = 4;
item.rmn1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.rmn2 = new Item();
item.rmn2.id = 127;
item.rmn2.name = "Miso Ramen";
item.rmn2.val = 44;
item.rmn2.desc =
  "Miso and pork mixed with spicy vegetables makes for a succulent soup you'd want to eat again" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rmn2.val +
  " </span>energy";
item.rmn2.stype = 4;
item.rmn2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.rmn3 = new Item();
item.rmn3.id = 128;
item.rmn3.name = "Tonkotsu Ramen";
item.rmn3.val = 48;
item.rmn3.desc =
  "This delicious tonkotsu ramen is a rich pork-infused soup made from finest ingredients" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rmn3.val +
  " </span>energy";
item.rmn3.stype = 4;
item.rmn3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.sqdyak = new Item();
item.sqdyak.id = 129;
item.sqdyak.name = "Squid Yakisoba";
item.sqdyak.val = 43;
item.sqdyak.desc =
  "Tender, delicious yakisoba noodles are combined with tasty squid making a filling and enjoyable meal" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sqdyak.val +
  " </span>energy";
item.sqdyak.stype = 4;
item.sqdyak.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.mtbeer = new Item();
item.mtbeer.id = 130;
item.mtbeer.name = "Malt Beer";
item.mtbeer.val = 18;
item.mtbeer.desc =
  "This beer has a pleasant aftertaste and depth of flavor that only 100% barley malts can provide" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mtbeer.val +
  " </span>energy";
item.mtbeer.stype = 4;
item.mtbeer.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(18);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 8);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 40);
  else effect.drunk.duration += 20;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.dbeer = new Item();
item.dbeer.id = 131;
item.dbeer.name = "Draft Beer";
item.dbeer.val = 15;
item.dbeer.desc =
  "A medium-sized mug of draft beet that many like to start with. Its creamy head and crisp taste are perfect after a day of hard work " +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.dbeer.val +
  " </span>energy";
item.dbeer.stype = 4;
item.dbeer.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(19);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 6);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 52);
  else effect.drunk.duration += 31;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.ootee = new Item();
item.ootee.id = 132;
item.ootee.name = "Oolong Tea";
item.ootee.val = 25;
item.ootee.desc =
  "Oolong tea, famous for its thick, rich flavor and light aftertaste, is the quintessential non-alcoholic drink. Enjoy its exquisite fragrance and flavor" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ootee.val +
  " </span>energy";
item.ootee.stype = 4;
item.ootee.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.foodb++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.krcsal = new Item();
item.krcsal.id = 133;
item.krcsal.name = "Kotchori Salad";
item.krcsal.val = 49;
item.krcsal.desc =
  "Kotchori salad brimming with eastern bunching onions! The peppery dressing drizzled on top and pungent onion flavor match all manners of drings" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.krcsal.val +
  " </span>energy";
item.krcsal.stype = 4;
item.krcsal.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.emdm = new Item();
item.emdm.id = 134;
item.emdm.name = "Edamame";
item.emdm.val = 21;
item.emdm.desc =
  "These soybeans in a pod are pretty much the default snack when drinking" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.emdm.val +
  " </span>energy";
item.emdm.stype = 4;
item.emdm.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.skplt = new Item();
item.skplt.id = 135;
item.skplt.name = "Skewer Platter";
item.skplt.val = 61;
item.skplt.desc =
  "A plate of five different skewers. The secret to their popularity is the special spicy miso" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.skplt.val +
  " </span>energy";
item.skplt.stype = 4;
item.skplt.rar = 2;
item.skplt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.skwre = new Item();
item.skwre.id = 136;
item.skwre.name = "Eastern Chicken Skewer";
item.skwre.val = 39;
item.skwre.desc =
  "Chicken sourced from domestic farms makes for a firm, juicy kebab with unique richness of flavor" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.skwre.val +
  " </span>energy";
item.skwre.stype = 4;
item.skwre.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.smfro = new Item();
item.smfro.id = 137;
item.smfro.name = "Smelt Fish with Roe";
item.smfro.val = 34;
item.smfro.desc =
  "The burst of flavor from the roe with over many who try this perfectly grilled with delicacy" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.smfro.val +
  " </span>energy";
item.smfro.stype = 4;
item.smfro.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.fsqdnr = new Item();
item.fsqdnr.id = 138;
item.fsqdnr.name = "Fried Squid with Nori";
item.fsqdnr.val = 44;
item.fsqdnr.desc =
  "A dish found on the meny of many izakaya. Fans can never get enough of the nori fragrance and firm squid flesh" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.fsqdnr.val +
  " </span>energy";
item.fsqdnr.stype = 4;
item.fsqdnr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.sltyak = new Item();
item.sltyak.id = 139;
item.sltyak.name = "Salted Yakisoba";
item.sltyak.val = 39;
item.sltyak.desc =
  "This addictive yakisoba dish mixes a rich, salty sauce with piquant eastern onions, and can be eaten as a meal or a snack with drinks" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sltyak.val +
  " </span>energy";
item.sltyak.stype = 4;
item.sltyak.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.jcmncc = new Item();
item.jcmncc.id = 140;
item.jcmncc.name = "Juicy Mince Cutlet";
item.jcmncc.val = 45;
item.jcmncc.desc =
  "This popular mince cutlet is packed with meaty goodness that fills your mouth each time you take a bite" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.jcmncc.val +
  " </span>energy";
item.jcmncc.stype = 4;
item.jcmncc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.sbeanf = new Item();
item.sbeanf.id = 141;
item.sbeanf.name = "Stir-Fried Bean Sprouts";
item.sbeanf.val = 37;
item.sbeanf.desc =
  "A simple dish taht cahmpiions the humble bean sprout, accented with a peppery punch. Once you start earing it, it's hard to put down" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sbeanf.val +
  " </span>energy";
item.sbeanf.stype = 4;
item.sbeanf.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.mgpch = new Item();
item.mgpch.id = 142;
item.mgpch.name = "Mango & Peach Sherbet";
item.mgpch.val = 29;
item.mgpch.desc =
  "No matter how much you've already eaten, it's always seary to make room for this tropical sherbet dessert" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.mgpch.val +
  " </span>energy";
item.mgpch.stype = 4;
item.mgpch.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.maitake = new Item();
item.maitake.id = 143;
item.maitake.name = "Maitake";
item.maitake.val = 7;
item.maitake.desc =
  "Maitake mushrooms are a delectable addition to hotpots" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.maitake.val +
  " </span>energy";
item.maitake.stype = 4;
item.maitake.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.odens = new Item();
item.odens.id = 144;
item.odens.name = "Oden Soup";
item.odens.val = 40;
item.odens.desc =
  "There is more than enough of this piping hot oden assortment to satisfy your hunger. Perfect for a colkd winter evening" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.odens.val +
  " </span>energy";
item.odens.stype = 4;
item.odens.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.onign1 = new Item();
item.onign1.id = 145;
item.onign1.name = "Seaweed Onigiri";
item.onign1.val = 30;
item.onign1.desc =
  "Seaweed boiled in soy sauce is in the center of this onigiri" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.onign1.val +
  " </span>energy";
item.onign1.stype = 4;
item.onign1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.onign2 = new Item();
item.onign2.id = 146;
item.onign2.name = "Tuna Onigiri";
item.onign2.val = 36;
item.onign2.desc =
  "This nigiri has tuna dressing with maynnaise in the middle" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.onign2.val +
  " </span>energy";
item.onign2.stype = 4;
item.onign2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.onign3 = new Item();
item.onign3.id = 147;
item.onign3.name = "Salmon Onigiri";
item.onign3.val = 38;
item.onign3.desc =
  "Old standard salmon onigiri, belowed by old and young for generations" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.onign3.val +
  " </span>energy";
item.onign3.stype = 4;
item.onign3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.syakis = new Item();
item.syakis.id = 148;
item.syakis.name = "Special Yakisoba";
item.syakis.val = 50;
item.syakis.desc =
  "Yakisoba with cabbage and pork. The smell of the sauce is mouth-watering" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.syakis.val +
  " </span>energy";
item.syakis.stype = 4;
item.syakis.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.kkbin = new Item();
item.kkbin.id = 149;
item.kkbin.name = "Kakubin";
item.kkbin.val = 25;
item.kkbin.desc =
  "The most popular whisky in the East. It has a sweet aroma and is thick on the palate, with a smooth, rich taste" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.kkbin.val +
  " </span>energy";
item.kkbin.stype = 4;
item.kkbin.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(21);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 11);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 80);
  else effect.drunk.duration += 50;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.blsho = new Item();
item.blsho.id = 150;
item.blsho.name = "Barley Shochu";
item.blsho.val = 39;
item.blsho.desc =
  "This barley shochy has a dry state popular with experienced drinkers" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.blsho.val +
  " </span>energy";
item.blsho.stype = 4;
item.blsho.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(23);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 21);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 72);
  else effect.drunk.duration += 36;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.scwhi = new Item();
item.scwhi.id = 151;
item.scwhi.name = "Scotch Whisky";
item.scwhi.val = 40;
item.scwhi.desc =
  "This whisky has a high alcohol content, so be careful not to drink too much" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.scwhi.val +
  " </span>energy";
item.scwhi.stype = 4;
item.scwhi.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(30);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 24);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 140);
  else effect.drunk.duration += 70;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.cham1 = new Item();
item.cham1.id = 152;
item.cham1.name = "Satoyu Champon";
item.cham1.val = 45;
item.cham1.desc =
  "The flavors of Satoyu condensed into one dish. The rich soup is made with fresh vegetables and a wealth of of ohter ingredients" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cham1.val +
  " </span>energy";
item.cham1.stype = 4;
item.cham1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.cham2 = new Item();
item.cham2.id = 153;
item.cham2.name = "Vegetable Champon";
item.cham2.val = 48;
item.cham2.desc =
  "This dish features seven different vegetables, and contains double the cabbage, bean sprouts, and onionof the standard champion" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cham2.val +
  " </span>energy";
item.cham2.stype = 4;
item.cham2.rar = 2;
item.cham2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(11);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.cham3 = new Item();
item.cham3.id = 154;
item.cham3.name = "Spicy Champon";
item.cham3.val = 42;
item.cham3.desc =
  "Eye-popping champon with homemade spicy miso" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cham3.val +
  " </span>energy";
item.cham3.stype = 4;
item.cham3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(14);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.cham4 = new Item();
item.cham4.id = 155;
item.cham4.name = "Light Champon";
item.cham4.val = 26;
item.cham4.desc =
  "A small serving of champon that is popular with women. Just the thing when you are only a little hungry" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.cham4.val +
  " </span>energy";
item.cham4.stype = 4;
item.cham4.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.sudon1 = new Item();
item.sudon1.id = 156;
item.sudon1.name = "Satoyu Saraudon";
item.sudon1.val = 47;
item.sudon1.desc =
  "Extra thin, crispy deep-fried noodles packed with flavor, and topped with vegetable in a thick, silky sauce that melts in your mouth " +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sudon1.val +
  " </span>energy";
item.sudon1.stype = 4;
item.sudon1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.sudon2 = new Item();
item.sudon2.id = 157;
item.sudon2.name = "Vegetable Saraudon";
item.sudon2.val = 42;
item.sudon2.desc =
  "A sister dish to the popular Vegetable Champon. Eat it with a dressing of your choice" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sudon2.val +
  " </span>energy";
item.sudon2.stype = 4;
item.sudon2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.sudon3 = new Item();
item.sudon3.id = 158;
item.sudon3.name = "Thick Saraudon";
item.sudon3.val = 50;
item.sudon3.desc =
  "Soft, thisk, flavorsome noodle make for a filling treat. Big plate is enough to satiate you for a whole day!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sudon3.val +
  " </span>energy";
item.sudon3.stype = 4;
item.sudon3.rar = 2;
item.sudon3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.sudon4 = new Item();
item.sudon4.id = 159;
item.sudon4.name = "Light Saraudon";
item.sudon4.val = 25;
item.sudon4.desc =
  "A small plate of udon that hits the spot when you feel like a snack" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sudon4.val +
  " </span>energy";
item.sudon4.stype = 4;
item.sudon4.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.goza = new Item();
item.goza.id = 160;
item.goza.name = "Gyoza";
item.goza.val = 37;
item.goza.desc =
  "Fried dumplings with a rich meat filling. The skin has rice flour blended in for amazing crispiness" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.goza.val +
  " </span>energy";
item.goza.stype = 4;
item.goza.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.dfrch = new Item();
item.dfrch.id = 161;
item.dfrch.name = "Deep Fried Chicken";
item.dfrch.val = 48;
item.dfrch.desc =
  "Fried chicken made with thigh meat. it's crunchy on the outside and juicy in the middle. Finger-smacking good!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.dfrch.val +
  " </span>energy";
item.dfrch.stype = 4;
item.dfrch.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.ynasl = new Item();
item.ynasl.id = 162;
item.ynasl.name = "Yuona Salad";
item.ynasl.val = 29;
item.ynasl.desc =
  "Thin, deep-fried noodles topped with dressing and fresh vegetables" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ynasl.val +
  " </span>energy";
item.ynasl.stype = 4;
item.ynasl.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.ramen1 = new Item();
item.ramen1.id = 163;
item.ramen1.name = "Shoyu Ramen";
item.ramen1.val = 40;
item.ramen1.desc =
  "Famous shoyu ramen. Thick soba noodles in the soy sauce based soup, improved with rich selection of vegetables. Delicious!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ramen1.val +
  " </span>energy";
item.ramen1.stype = 4;
item.ramen1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.ramen2 = new Item();
item.ramen2.id = 164;
item.ramen2.name = "Negi Ramen";
item.ramen2.val = 42;
item.ramen2.desc =
  "Classic shoyu ramen topped with piquant eastern onions" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ramen2.val +
  " </span>energy";
item.ramen2.stype = 4;
item.ramen2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.ramen3 = new Item();
item.ramen3.id = 165;
item.ramen3.name = "Chashu Ramen";
item.ramen3.val = 50;
item.ramen3.desc =
  "Tasty ramen topped with succulent, thin slices of roast pork" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ramen3.val +
  " </span>energy";
item.ramen3.stype = 4;
item.ramen3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.ramen4 = new Item();
item.ramen4.id = 166;
item.ramen4.name = "Negi Chashu Ramen";
item.ramen4.val = 66;
item.ramen4.desc =
  "This exquisit ramen features a hefty helping of spicy eastern onions and slices of roast pork" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ramen4.val +
  " </span>energy";
item.ramen4.stype = 4;
item.ramen4.rare = 2;
item.ramen4.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.bffbl = new Item();
item.bffbl.id = 167;
item.bffbl.name = "Beef Bowl";
item.bffbl.val = 48;
item.bffbl.desc =
  "A hearty beef bowl made with top quality eastern beef" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bffbl.val +
  " </span>energy";
item.bffbl.stype = 4;
item.bffbl.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.sposs = new Item();
item.sposs.id = 168;
item.sposs.name = "Sweet Potato Shochu";
item.sposs.val = 33;
item.sposs.desc =
  "A sweet potato shochu that succeeds in bringing out the flavors of its ingredients" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sposs.val +
  " </span>energy";
item.sposs.stype = 4;
item.sposs.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(26);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 20);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 92);
  else effect.drunk.duration += 41;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban1 = new Item();
item.soban1.id = 169;
item.soban1.name = "Soba in Hot Broth";
item.soban1.val = 40;
item.soban1.desc =
  "This house classic features freshly-boiled soba noodles served in a piping hot homemade soup" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban1.val +
  " </span>energy";
item.soban1.stype = 4;
item.soban1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban2 = new Item();
item.soban2.id = 170;
item.soban2.name = "Chilled Soba";
item.soban2.val = 44;
item.soban2.desc =
  "Delicious soba noodles rinsed in water after cooking to stop them becoming too soft, served with a special dipping sauce" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban2.val +
  " </span>energy";
item.soban2.stype = 4;
item.soban2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban3 = new Item();
item.soban3.id = 171;
item.soban3.name = "Chilled Tanuki Soba";
item.soban3.val = 46;
item.soban3.desc =
  "Freshly cooked soba noodles topped with chilled sauce and bits of fried tenpura batter. This is a firm favourite among population" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban3.val +
  " </span>energy";
item.soban3.stype = 4;
item.soban3.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban4 = new Item();
item.soban4.id = 172;
item.soban4.name = "Chilled Kitsune Soba";
item.soban4.val = 48;
item.soban4.desc =
  "Freshly cooked soba noodles topped with chilled sauce and house made fried tofu cut into easy-to-eat pieces" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban4.val +
  " </span>energy";
item.soban4.stype = 4;
item.soban4.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban5 = new Item();
item.soban5.id = 173;
item.soban5.name = "Egg & Tenpura Soba";
item.soban5.val = 52;
item.soban5.desc =
  "Hot soba noodles served with soft-boiled egg and vegetable tenpura. This dish is a perennial favorite" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban5.val +
  " </span>energy";
item.soban5.stype = 4;
item.soban5.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(11);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban6 = new Item();
item.soban6.id = 174;
item.soban6.name = "Special Fuji Soba";
item.soban6.val = 60;
item.soban6.desc =
  'Hot soba noodles topped with a lavish amount of fried tenpura batter and fried tofu, along with soft-bioled egg and "kamaboko" fish cake' +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban6.val +
  " </span>energy";
item.soban6.stype = 4;
item.soban6.rar = 2;
item.soban6.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(15);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban7 = new Item();
item.soban7.id = 175;
item.soban7.name = "Yuzu Chicken & Spinach Soba";
item.soban7.val = 50;
item.soban7.desc =
  "A vibrant dish of hot soba noodles topped with spinach and pieces of steamed chicken, accented with the subtle fragrance of yuzu" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban7.val +
  " </span>energy";
item.soban7.stype = 4;
item.soban7.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.katubo = new Item();
item.katubo.id = 176;
item.katubo.name = "Fried Pork Cutlet Bowl";
item.katubo.val = 58;
item.katubo.desc =
  "This classic dish features a thick, crunchy pork cutlet topped with sauce and lightly cooked egg. It is made to order for maximum freshness" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.katubo.val +
  " </span>energy";
item.katubo.stype = 4;
item.katubo.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(11);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.curry1 = new Item();
item.curry1.id = 177;
item.curry1.name = "Curry & Rice";
item.curry1.val = 50;
item.curry1.desc =
  "Mild curry and rice. This curry is made with the house's special roux and sauce, and is petfect for those who don't like too much spice" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.curry1.val +
  " </span>energy";
item.curry1.stype = 4;
item.curry1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(14);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.soban8 = new Item();
item.soban8.id = 178;
item.soban8.name = "Pickled Ginger Soba";
item.soban8.val = 56;
item.soban8.desc =
  "Hot soba noodles served with tenpura containing copious amounts of red pickled ginger for a pleasant meal that warms the soul" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.soban8.val +
  " </span>energy";
item.soban8.stype = 4;
item.soban8.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.yktr = new Item();
item.yktr.id = 179;
item.yktr.name = "Yakitori";
item.yktr.val = 48;
item.yktr.desc =
  "This charcoal-grilled chicken on a skewer has a savory smell that is out of this world" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.yktr.val +
  " </span>energy";
item.yktr.stype = 4;
item.yktr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.tegs = new Item();
item.tegs.id = 180;
item.tegs.name = "Tuna & Egg Sandwich";
item.tegs.val = 45;
item.tegs.desc =
  "This sandwich features an egg-mayo mix with tuna on white bread" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.tegs.val +
  " </span>energy";
item.tegs.stype = 4;
item.tegs.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.tamag = new Item();
item.tamag.id = 181;
item.tamag.name = "Tamago";
item.tamag.val = 15;
item.tamag.desc =
  "Delicate and tasty egg sushi" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.tamag.val +
  " </span>energy";
item.tamag.stype = 4;
item.tamag.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.magr = new Item();
item.magr.id = 182;
item.magr.name = "Maguro";
item.magr.val = 26;
item.magr.desc =
  "Top-grade bluefin tuna sushi" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.magr.val +
  " </span>energy";
item.magr.stype = 4;
item.magr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.ameb = new Item();
item.ameb.id = 183;
item.ameb.name = "Ama-Ebi";
item.ameb.val = 24;
item.ameb.desc =
  "This tender, sweet shrimp will melt in your mouth. It's unbelievably fresh!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ameb.val +
  " </span>energy";
item.ameb.stype = 4;
item.ameb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.engw = new Item();
item.engw.id = 184;
item.engw.name = "Engawa";
item.engw.val = 32;
item.engw.desc =
  "Tastiest engawa sushi made from eastern flounder" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.engw.val +
  " </span>energy";
item.engw.stype = 4;
item.engw.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.skmsk = new Item();
item.skmsk.id = 185;
item.skmsk.name = "Seki Mackerel";
item.skmsk.val = 30;
item.skmsk.desc =
  "Not all mackerel are created equal. This premium mackerel is packed with tasty fish oil" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.skmsk.val +
  " </span>energy";
item.skmsk.stype = 4;
item.skmsk.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.namatk = new Item();
item.namatk.id = 186;
item.namatk.name = "Namatako";
item.namatk.val = 29;
item.namatk.desc =
  "Octopus sushi of the highest grade. The more you chew, the better it tastes. That's proof of quality" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.namatk.val +
  " </span>energy";
item.namatk.stype = 4;
item.namatk.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.hirame = new Item();
item.hirame.id = 187;
item.hirame.name = "Hirame";
item.hirame.val = 37;
item.hirame.desc =
  "This halibut is a popular sushi topping. Its sweet white meat doesn't have a trace of fishiness" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hirame.val +
  " </span>energy";
item.hirame.stype = 4;
item.hirame.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.shmaj = new Item();
item.shmaj.id = 188;
item.shmaj.name = "Shima-Aji";
item.shmaj.val = 33;
item.shmaj.desc =
  "The king of horse mackerel! It's a summer fish best eaten as sashimi or sushi" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.shmaj.val +
  " </span>energy";
item.shmaj.stype = 4;
item.shmaj.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(6);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.kndma = new Item();
item.kndma.id = 189;
item.kndma.name = "Kinmedai";
item.kndma.val = 38;
item.kndma.desc =
  " The shiny color of this splendid alfonsino is a feast for the eyes. It's fatty and melts in your mouth" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.kndma.val +
  " </span>energy";
item.kndma.stype = 4;
item.kndma.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(7);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.ikura = new Item();
item.ikura.id = 190;
item.ikura.name = "Ikura";
item.ikura.val = 40;
item.ikura.desc =
  " Top quality salmon roe wrapped in nori. The best there is!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.ikura.val +
  " </span>energy";
item.ikura.stype = 4;
item.ikura.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.akagi = new Item();
item.akagi.id = 191;
item.akagi.name = "Akagai";
item.akagi.val = 37;
item.akagi.desc =
  'Popular sushi toping made from ark clams. Also known as "bloody clams" because they have red blood' +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.akagi.val +
  " </span>energy";
item.akagi.stype = 4;
item.akagi.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.otor = new Item();
item.otor.id = 192;
item.otor.name = "Otoro";
item.otor.val = 45;
item.otor.desc =
  "This is the richest cut from the top-grade bluefin tuna. The taste alone will leave you hungry for more" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.otor.val +
  " </span>energy";
item.otor.stype = 4;
item.otor.rar = 2;
item.otor.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.awabi = new Item();
item.awabi.id = 193;
item.awabi.name = "Awabi";
item.awabi.val = 56;
item.awabi.desc =
  "Highest quality abalone with the taste out of this world. Premium snack for those who can afford it" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.awabi.val +
  " </span>energy";
item.awabi.stype = 4;
item.awabi.rar = 2;
item.awabi.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(13);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.uni = new Item();
item.uni.id = 194;
item.uni.name = "Uni";
item.uni.val = 60;
item.uni.desc =
  "Exquisit sea urchin meat of the most excellent kind, wrapped in nori. As fresh as can be" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.uni.val +
  " </span>energy";
item.uni.stype = 4;
item.uni.rar = 3;
item.uni.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(16);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.klbi1 = new Item();
item.klbi1.id = 195;
item.klbi1.name = "Kalbi";
item.klbi1.val = 48;
item.klbi1.desc =
  "This beef rib meat is popular for its incredibly rich flavor" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.klbi1.val +
  " </span>energy";
item.klbi1.stype = 4;
item.klbi1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.klbi2 = new Item();
item.klbi2.id = 196;
item.klbi2.name = "Grade A Kalbi";
item.klbi2.val = 55;
item.klbi2.desc =
  "Top-grade meat is selected from only the rarest, choicest cuts of beef rib" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.klbi2.val +
  " </span>energy";
item.klbi2.stype = 4;
item.klbi2.rar = 2;
item.klbi2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(25);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.srln1 = new Item();
item.srln1.id = 197;
item.srln1.name = "Sirloin";
item.srln1.val = 52;
item.srln1.desc =
  "Light and relatively low fat sirloin beef steak with spices" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.srln1.val +
  " </span>energy";
item.srln1.stype = 4;
item.srln1.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.srln2 = new Item();
item.srln2.id = 198;
item.srln2.name = "Grade A Sirloin";
item.srln2.val = 66;
item.srln2.desc =
  "Incredible top-grade beef sirloin prized for its unparalleled taste and quality" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.srln2.val +
  " </span>energy";
item.srln2.stype = 4;
item.srln2.rar = 2;
item.srln2.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(28);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.sfdpl = new Item();
item.sfdpl.id = 199;
item.sfdpl.name = "Seafood Platter";
item.sfdpl.val = 57;
item.sfdpl.desc =
  "A plate of the sea's delicious bounty, including shrimp, scallops, and squid" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.sfdpl.val +
  " </span>energy";
item.sfdpl.stype = 4;
item.sfdpl.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(38);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.kmchc = new Item();
item.kmchc.id = 200;
item.kmchc.name = "Kimchi Combo";
item.kmchc.val = 63;
item.kmchc.desc =
  "A tantalizing combo dish of kimchi made from eastern cabbage, cucumbers, daikon and more" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.kmchc.val +
  " </span>energy";
item.kmchc.stype = 4;
item.kmchc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(20);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.stnkbb = new Item();
item.stnkbb.id = 201;
item.stnkbb.name = "Stone Cooked Bibimbap";
item.stnkbb.val = 68;
item.stnkbb.desc =
  "Very hot bowl of bibimbap with special spicy sweed kochujang sauce. Roasted to a golden brown for an irresistable taste" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.stnkbb.val +
  " </span>energy";
item.stnkbb.stype = 4;
item.stnkbb.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(32);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.spcbef = new Item();
item.spcbef.id = 202;
item.spcbef.name = "Spicy Beef Soup";
item.spcbef.val = 49;
item.spcbef.desc =
  "Spicy hot beef soup with rice and noodles. It has a very homemade feeling to it" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.spcbef.val +
  " </span>energy";
item.spcbef.stype = 4;
item.spcbef.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(39);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.binigiri = new Item();
item.binigiri.id = 203;
item.binigiri.name = "Giant Nigiri";
item.binigiri.val = 88;
item.binigiri.desc =
  "This nigiri looks way to big to eat. Who made this thing?" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.binigiri.val +
  " </span>energy";
item.binigiri.stype = 4;
item.binigiri.rar = 3;
item.binigiri.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(48);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.infpdps = new Item();
item.infpdps.id = 204;
item.infpdps.name = "Inferno Pepper Dumpling";
item.infpdps.val = 66;
item.infpdps.desc =
  "These special dumplings are so hot and addictive that you won't be able to talk for a week" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.infpdps.val +
  " </span>energy";
item.infpdps.stype = 4;
item.infpdps.rar = 3;
item.infpdps.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(62);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.daikn = new Item();
item.daikn.id = 205;
item.daikn.name = "Daikon";
item.daikn.val = 6;
item.daikn.desc =
  "A still-juicy daikon radish. It's not spicy and can be eaten raw" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.daikn.val +
  " </span>energy";
item.daikn.stype = 4;
item.daikn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.bonig = new Item();
item.bonig.id = 206;
item.bonig.name = "Rotten Onigiri";
item.bonig.val = 19;
item.bonig.desc =
  "This riceball has gone bad. You normally wouldn't eat this, but when you run out of food even this looks delicious" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bonig.val +
  " </span>energy";
item.bonig.stype = 4;
item.bonig.rar = 0;
item.bonig.use = function () {
  if (random() < 0.8) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(20);
  global.stat.fooda++;
  global.stat.foodt++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.wdaikn = new Item();
item.wdaikn.id = 207;
item.wdaikn.name = "Wihered Daikon";
item.wdaikn.val = 4;
item.wdaikn.desc =
  "A daikon radish that has withered in the sun. It's still edible, but it's kinda sad" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wdaikn.val +
  " </span>energy";
item.wdaikn.stype = 4;
item.wdaikn.rar = 0;
item.wdaikn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.oppr = new Item();
item.oppr.id = 208;
item.oppr.name = "Oni Pepper";
item.oppr.val = 42;
item.oppr.desc =
  "An extremely spicy pepper that makes you erupt in sweat and make an expression like an oni. It hurts more coming out than going in" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.oppr.val +
  " </span>energy";
item.oppr.stype = 4;
item.oppr.rar = 2;
item.oppr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(42);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.jdaik = new Item();
item.jdaik.id = 209;
item.jdaik.name = "Jumbo Daikon";
item.jdaik.val = 50;
item.jdaik.desc =
  "A huge, rare daikon radish. Stews made with this daikon are delicious. You can put some miso paste on it to eat raw" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.jdaik.val +
  " </span>energy";
item.jdaik.stype = 4;
item.jdaik.rar = 2;
item.jdaik.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(35);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.bmshrm = new Item();
item.bmshrm.id = 210;
item.bmshrm.name = "Big Mushroom";
item.bmshrm.val = 33;
item.bmshrm.desc =
  "A big, juicy mushroom that sucked up lots of nutrients. It doesn't taste ordinary. It can be stewed, roasted, fried or eaten raw" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bmshrm.val +
  " </span>energy";
item.bmshrm.stype = 4;
item.bmshrm.rar = 2;
item.bmshrm.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(16);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.hlstw = new Item();
item.hlstw.id = 211;
item.hlstw.name = "Healing Stew";
item.hlstw.val = 18;
item.hlstw.desc =
  "Tasteless soup made by boiling heaps of cure grass in water. Healing only in name, it is known that exposing cure grass to high temperatures destroys any healing properties of the product" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.hlstw.val +
  " </span>energy";
item.hlstw.stype = 4;
item.hlstw.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(8);
  global.stat.fooda++;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
  this.amount--;
};

item.bcrrt = new Item();
item.bcrrt.id = 212;
item.bcrrt.name = "Boiled Carrot";
item.bcrrt.val = 9;
item.bcrrt.desc =
  "Regular carrot, boiled in water. It is sweet but not all that tasty, actually" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.bcrrt.val +
  " </span>energy";
item.bcrrt.stype = 4;
item.bcrrt.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.jsdch = new Item();
item.jsdch.id = 213;
item.jsdch.name = "Jelly Sandwich";
item.jsdch.val = 27;
item.jsdch.desc =
  "Awful sandwich that doesn't taste like anything. It is filling, at the very least" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.jsdch.val +
  " </span>energy";
item.jsdch.stype = 4;
item.jsdch.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(12);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.agrns = new Item();
item.agrns.id = 214;
item.agrns.name = "Assorted Grains";
item.agrns.val = 3;
item.agrns.desc =
  "Buckwheat, sunflower seeds, oats, rye... Various grains, seeds and nuts in very small quantities as such making them not very useful for pretty much anything" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.agrns.val +
  " </span>energy";
item.agrns.stype = 4;
item.agrns.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(5);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};
item.agrns.onGet = function () {
  if (this.amount >= 10) {
    giveRcp(rcp.wsb);
    this.onGet = function () {};
  }
};

item.eggfrc = new Item();
item.eggfrc.id = 215;
item.eggfrc.name = "Egg Fried Rice";
item.eggfrc.val = 33;
item.eggfrc.desc =
  "Stir fried egg cooked together with golden rice. Excellent and refreshing dish" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.eggfrc.val +
  " </span>energy";
item.eggfrc.stype = 4;
item.eggfrc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(9);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.thme = new Item();
item.thme.id = 216;
item.thme.name = "Thyme";
item.thme.val = 2;
item.thme.desc =
  "A stalk of aromatic thyme, often used in medicine as a complimentary herb. Can be made into a relaxing tea or antiseptic" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.thme.val +
  " </span>energy";
item.thme.stype = 4;
item.thme.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.wldhrbs = new Item();
item.wldhrbs.id = 217;
item.wldhrbs.name = "Wild Herbs";
item.wldhrbs.val = 1;
item.wldhrbs.desc =
  "A tasty collection of wild herbs including violet, sassafras, mint, clover, purslane, and fireweed" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.wldhrbs.val +
  " </span>energy";
item.wldhrbs.stype = 4;
item.wldhrbs.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.meffg = new Item();
item.meffg.id = 218;
item.meffg.name = "Meat Effigy";
item.meffg.val = 28;
item.meffg.desc =
  "Strange edible effigy made of who knows what. It tastes like regular jerky" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.meffg.val +
  " </span>energy";
item.meffg.stype = 4;
item.meffg.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(10);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.rtnmt = new Item();
item.rtnmt.id = 219;
item.rtnmt.name = "Rotten Meat";
item.rtnmt.val = 4;
item.rtnmt.rar = 0;
item.rtnmt.desc =
  "Greenish grey organic mass that was once something edible, now isn't good for pretty much anything" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.rtnmt.val +
  " </span>energy";
item.rtnmt.stype = 4;
item.rtnmt.rot = [0.4, 0.8, 0.3, 0.6];
item.rtnmt.use = function () {
  if (random() < 0.45) {
    if (effect.fpn.active === false) giveEff(you, effect.fpn, rand(15, 35));
    else effect.fpn.duration += rand(5, 25);
  }
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(13);
  global.stat.fooda++;
  global.stat.foodt++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.appljc = new Item();
item.appljc.id = 220;
item.appljc.name = "Apple Juice";
item.appljc.val = 18;
item.appljc.desc =
  "Freshly-squeezed from real apples!" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.appljc.val +
  " </span>energy";
item.appljc.stype = 4;
item.appljc.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.fooda++;
  global.stat.foodb++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.frtplp = new Item();
item.frtplp.id = 221;
item.frtplp.name = "Juice Pulp";
item.frtplp.val = 9;
item.frtplp.rot = [0.05, 0.15, 0.05, 0.15];
item.frtplp.desc =
  "Left-over byproduct from juicing the fruit.  Not very tasty, but contains a lot of healthy fiber" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.frtplp.val +
  " </span>energy";
item.frtplp.stype = 4;
item.frtplp.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(4);
  global.stat.fooda++;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.klngbr = new Item();
item.klngbr.id = 222;
item.klngbr.name = "Kaoliang";
item.klngbr.val = 52;
item.klngbr.desc =
  "Strong traditional liquor with a tangy taste and important role during social gatherings" +
  dom.dseparator +
  "Restores<span style='color:lime'> " +
  item.klngbr.val +
  " </span>energy";
item.klngbr.stype = 4;
item.klngbr.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(35);
  global.stat.foodb++;
  global.stat.foodal++;
  giveSkExp(skl.drka, 25);
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 80);
  else effect.drunk.duration += 40;
  this.amount--;
  dom.d5_3_1.update();
  msg("Restored " + this.val + " energy", "lime");
};

item.sbone = new Item();
item.sbone.id = 5000;
item.sbone.name = "Small Bone";
item.sbone.desc = "Brittle bone of some animal";
item.sbone.stype = 5;
item.sbone.use = function () {
  msg("You rattle the bone");
};
item.sbone.onGet = function () {
  if (this.amount >= 50) {
    giveRcp(rcp.bdl1);
    this.onGet = function () {};
  }
};

item.death_b = new Item();
item.death_b.id = 5001;
item.death_b.name = "Death Badge";
item.death_b.desc = "Awarded by fate for dying. Congratulations";
item.death_b.stype = 5;
item.death_b.use = function () {
  msg("Looking at this fills you with bad memories");
};

item.sstraw = new Item();
item.sstraw.id = 5002;
item.sstraw.name = "Strand Of Straw";
item.sstraw.desc = "This fell out of a dummy when you punched it to death";
item.sstraw.stype = 5;
item.sstraw.use = function () {
  msg("You put one in your mouth...");
};
item.sstraw.onGet = function () {
  if (this.amount >= 30) giveRcp(rcp.strwks);
  if (this.amount >= 40) giveRcp(rcp.wvbkt);
  if (this.amount >= 50) {
    giveRcp(rcp.sdl1);
    this.onGet = function () {};
  }
};

item.d6 = new Item();
item.d6.id = 5003;
item.d6.name = "Red Die";
item.d6.desc = "Die with 6 sides. Brings luck";
item.d6.stype = 5;
item.d6.rar = 2;
item.d6.use = function () {
  const r = rand(1, 6);
  global.stat.die_p += r;
  global.stat.die_p_t += r;
  msg('You roll <span style="color:red">' + r + "</span>");
  skl.dice.use(1);
  if (random() < 0.05) {
    this.amount--;
    msg("The die crumbles in your hands", "Magenta");
  }
};

item.cp = new Item();
item.cp.id = 5004;
item.cp.name = "Penny";
item.cp.desc =
  "A single penny, outdated form of currency. For some reason it's still in circulation";
item.cp.stype = 4;
item.cp.use = function (x) {
  giveWealth(1, false, true);
  this.amount--;
  dumb(x);
};

item.lcn = new Item();
item.lcn.id = 5005;
item.lcn.name = "Large Copper Coin";
item.lcn.desc =
  "Local currency in a form of a heavy coin. Poor people can eat for a whole day with a few of those";
item.lcn.stype = 4;
item.lcn.use = function (x) {
  giveWealth(20, false, true);
  this.amount--;
  dumb(x);
};

item.cn = new Item();
item.cn.id = 5006;
item.cn.name = "Nickel";
item.cn.desc =
  "Small nickel, outdated form of currency. It was worth much more in the past";
item.cn.stype = 4;
item.cn.use = function (x) {
  giveWealth(5, false, true);
  this.amount--;
  dumb(x);
};

item.cd = new Item();
item.cd.id = 5007;
item.cd.name = "Dime";
item.cd.desc = "Round copper dime. Still shiny";
item.cd.stype = 4;
item.cd.use = function (x) {
  giveWealth(10, false, true);
  this.amount--;
  dumb(x);
};

item.cq = new Item();
item.cq.id = 5008;
item.cq.name = "Quarter";
item.cq.desc =
  "Very large coin, made of copper. Not much worth as money, but collected and used by poor blacksmiths for resmelting into tools";
item.cq.stype = 4;
item.cq.use = function (x) {
  giveWealth(25, false, true);
  this.amount--;
  dumb(x);
};

item.watr = new Item();
item.watr.id = 5009;
item.watr.name = "Water";
item.watr.desc = "Regular drinkable water";
item.watr.stype = 5;
item.watr.use = function () {
  msg("You took a sip", "aqua");
};

item.psb = new Item();
item.psb.id = 5010;
item.psb.name = "Pleasant Sleep Blanket";
item.psb.desc = "Soft warm blanket. It makes you sleep better";
item.psb.stype = 5;
item.psb.use = function () {};

item.wdc = new Item();
item.wdc.id = 5011;
item.wdc.name = "Wood Splint";
item.wdc.desc = "A small chipped piece of wood. Not very useful by itself";
item.wdc.stype = 5;
item.wdc.onGet = function () {
  if (this.amount >= 10) giveRcp(rcp.wbdl);
  if (this.amount >= 50) {
    giveRcp(rcp.wdl1);
    this.onGet = function () {};
  }
};
item.wdc.use = function () {
  msg("Ouch");
};

item.bgl = new Item();
item.bgl.id = 5012;
item.bgl.name = "Bag of lost items";
item.bgl.desc = "Lost possession of waifarers and travellers";
item.bgl.stype = 4;
item.bgl.use = function () {
  this.amount--;
};

item.salt = new Item();
item.salt.id = 5013;
item.salt.name = "Salt";
item.salt.desc =
  "Rock salt crushed into tiny crystals. Yuck! You surely wouldn't want to eat this. It's good for preserving perishable foods and cooking, though";
item.salt.stype = 5;
item.salt.use = function () {
  msg("It stings your tongue", "silver");
};

item.slm = new Item();
item.slm.id = 5014;
item.slm.name = "Slime";
item.slm.desc =
  "Clear blob of slime. Used in elementary alchemy to make adhesives. Also acts as a base for some potions";
item.slm.stype = 5;
item.slm.use = function () {
  msg("Sticky..", "silver");
};

item.tlvs = new Item();
item.tlvs.id = 5015;
item.tlvs.name = "Tea leaves";
item.tlvs.desc = "A pinch of fragnant tea leaves, ready for brewing";
item.tlvs.stype = 5;
item.tlvs.use = function () {
  msg("They feel just dry enough", "blue");
};

item.key1 = new Item();
item.key1.id = 5016;
item.key1.name = "Bronze Key";
item.key1.desc = "";
item.key1.stype = 5;
item.key1.use = function () {};

item.key2 = new Item();
item.key2.id = 5017;
item.key2.name = "Iron Key";
item.key2.desc = "";
item.key2.stype = 5;
item.key2.use = function () {};

item.key3 = new Item();
item.key3.id = 5018;
item.key3.name = "Silver Key";
item.key3.desc = "";
item.key3.stype = 5;
item.key3.use = function () {};

item.key4 = new Item();
item.key4.id = 5019;
item.key4.name = "Gold Key";
item.key4.desc = "";
item.key4.stype = 5;
item.key4.use = function () {};

item.key5 = new Item();
item.key5.id = 5020;
item.key5.name = "Platinum Key";
item.key5.desc = "";
item.key5.stype = 5;
item.key5.use = function () {};

item.key6 = new Item();
item.key6.id = 5021;
item.key6.name = "Steel Key";
item.key6.desc = "";
item.key6.stype = 5;
item.key6.use = function () {};

item.key7 = new Item();
item.key7.id = 5022;
item.key7.name = "Crimson Key";
item.key7.desc = "";
item.key7.stype = 5;
item.key7.use = function () {};

item.key0 = new Item();
item.key0.id = 5023;
item.key0.name = "Rusty Key";
item.key0.desc = function () {
  return (
    "Scummy old key. " +
    (global.flags.hbs1
      ? "You can open your basement with it"
      : "What could it be for?")
  );
};
item.key0.stype = 5;
item.key0.use = function () {
  msg(
    global.flags.hbs1
      ? "Thankfully it didn't break apart when you used it"
      : "It looks familiar...",
    "lightgrey",
  );
};

item.ywlt = new Item();
item.ywlt.id = 5024;
item.ywlt.name = "Woven Wallet";
item.ywlt.desc =
  "This is your personal wallet, you received it as a gift" +
  dom.dseparator +
  "<span style='color:orange'>You can feel coinage inside</spam>";
item.ywlt.stype = 4;
item.ywlt.rar = 2;
item.ywlt.use = function (x) {
  giveItem(item.cd, 2);
  giveItem(item.cq, 1);
  giveItem(item.cn, 1);
  giveItem(item.cp, rand(2, 10));
  this.amount--;
  global.flags.m_un = true;
  appear(dom.mn_2);
  appear(dom.mn_4);
  appear(dom.mn_3);
};

item.hnhn = new Item();
item.hnhn.id = 5025;
item.hnhn.name = "Teruterubōzu";
item.hnhn.desc =
  "Holy talisman. Leave it out on the rain to gain blessing of good fortune";
item.hnhn.stype = 5;
item.hnhn.rar = 2;
item.hnhn.use = function (x) {};

item.pcn = new Item();
item.pcn.id = 5026;
item.pcn.name = "Pinecone";
item.pcn.desc =
  "A spiny pod from a pine tree.  Dry seeds rattle around inside when you shake it";
item.pcn.stype = 4;
item.pcn.use = function (x) {
  msg(select(["*Crack..* ", "*Crunch..* ", "*Pop..* "]), "lightgrey");
  if (random() <= 0.3 + skl.dice.lvl * 0.03) {
    msg_add("You have discovered some pine nuts inside!", "lime");
    giveItem(item.pcns, rand(1, 3));
    giveSkExp(skl.dice, 2);
  } else {
    msg_add("The cone was empty..", "grey");
    giveSkExp(skl.dice, 0.5);
  }
  this.amount--;
};

item.pbl = new Item();
item.pbl.id = 5027;
item.pbl.name = "Pebble";
item.pbl.desc =
  "A tiny useless stone, found everywhere. Can be thrown to create distraction" +
  dom.dseparator +
  '<span style="color:yellow">+5 Throwing Damage</span>';
item.pbl.stype = 2;
item.pbl.c = "yellow";
item.pbl.use = function () {
  if (this.disabled !== true) {
    this.disabled = true;
    if (global.flags.civil === true || global.flags.btl === false) {
      msg("You threw " + this.name + " into the distance", "grey");
      giveSkExp(skl.thr, 1);
    } else tattack(5, 1, 1);
    this.amount--;
    setTimeout(
      () => {
        this.disabled = false;
      },
      500 / (skl.thr.lvl || 1),
    );
  }
};

item.ptng1 = new Item();
item.ptng1.id = 5028;
item.ptng1.name = "Tattered Painting";
item.ptng1.desc =
  "Scratched up and faded painting of a lady. It's nearly impossible to recognize any details";
item.ptng1.stype = 5;
item.ptng1.use = function () {};

item.fwd1 = new Item();
item.fwd1.id = 5029;
item.fwd1.name = "Firewood";
item.fwd1.desc =
  "Type of dry wood, prepared for easy burning. Useful at camps or during winter";
item.fwd1.stype = 5;
item.fwd1.use = function () {
  msg("*Donk* ..It sounds hollow", "ghostwhite");
};
item.fwd1.onGet = function () {
  if (this.amount >= 60) {
    giveRcp(rcp.fwdpile);
    this.onGet = function () {};
  }
};

item.coal1 = new Item();
item.coal1.id = 5030;
item.coal1.name = "Coal";
item.coal1.desc =
  "Black rocks of fossilized organic mass. This coal burns for a very long time";
item.coal1.stype = 5;
item.coal1.use = function () {
  msg("You can picture it smoldering inside your fireplace", "grey");
};

item.coal2 = new Item();
item.coal2.id = 5031;
item.coal2.name = "Charcoal";
item.coal2.desc =
  "Coal made from carefuly burning quality wood for lengths of time. This coal cinders for a very long time";
item.coal2.stype = 5;
item.coal2.use = function () {
  msg("Your hands get all dirty", "black", null, null, "lightgrey");
};

item.cndl2 = new Item();
item.cndl2.id = 5032;
item.cndl2.name = "placehold";
item.cndl2.desc = "hldplace";

item.skl = new Item();
item.skl.id = 5033;
item.skl.name = "Skull";
item.skl.desc =
  "Mostly undamaged human skull, taken from some unlucky corpse. It is used in various ways by all sorts of dark sorcerers, witches and alchemists";
item.skl.stype = 5;
item.skl.use = function () {
  msg("It looks menacing", "purple", null, null, "lightgrey");
};

global.text.kntsct = [
  "Adjustable bend",
  "Adjustable grip hitch",
  "Albright special",
  "Alpine Butterfly",
  "Anchor bend",
  "Angle's loop ",
  "Arbor knot",
  "Artillery loop",
  "Ashley's bend",
  "Axle hitch",
  "Bachmann knot",
  "Bag knot",
  "Bait loop",
  "Barrel knot",
  "Basket weave knot",
  "Becket hitch ",
  "Beer knot",
  "Bimini twist",
  "Blackwall hitch",
  "Blake's hitch",
  "Blood knot",
  "Boa knot",
  "Boling knot",
  "Boom hitch",
  "Bourchier knot",
  "Heraldic knot",
  "Bumper knot",
  "Bunny ears",
  "Butterfly loop",
  "Carrick bend",
  "Cat's paw",
  "Catshank",
  "Celtic button knot",
  "Chain sinnet",
  "Chair knot",
  "Clove hitch",
  "Constrictor knot",
  "Cow hitch",
  "Crown knot",
  "Double loop",
  "Dogshank",
  "Diamond knot",
  "Dropper loop",
  "Death knot",
  "Eye splice",
  "Falconer's knot",
  "Farmer's loop",
  "Fiador knot",
  "Figure-eight knot",
  "Fisherman's bend",
  "Friendship knot",
  "Hackamore",
  "Garda hitch",
  "Grief knot",
  "Gordian knot",
  "Grantchester knot",
  "Ground-line hitch",
  "Gripping sailor's hitch",
  "Halter hitch",
  "Handcuff knot",
  "Hangman's noose",
  "Highpoint hitch",
  "Highwayman's hitch",
  "Hitching tie",
  "Hunter's bend",
  "Icicle hitch",
  "Jamming knot",
  "Killick hitch",
  "Klemheist knot",
  "Knot of isis",
  "Lariat loop",
  "Lighterman's hitch",
  "Lineman\s loop",
  "Lissajous knot",
  "Lobster buoy hitch",
  "Magnus hitch",
  "Marlinespike hitch",
  "Midshipman's hitch",
  "Miller's knot",
  "Monkey's fist",
  "Mountaineer's coil",
  "Munter hitch",
  "Nail knot",
  "Ossel hitch",
  "Overhand bend",
  "Palomar knot",
  "Pile hitch",
  "Pipe hitch",
  "Pretzel link knot",
  "Power cinch",
  "Racking bend",
  "Reef knot",
  "Reever Knot",
  "Rolling hitch",
  "Round turn",
  "Running bowline",
  "Sailor's hitch",
  "Sheepshank",
  "Shoelace knot",
  "Simple knot",
  "Slip knot",
  "Snell knot",
  "Snuggle hitch",
  "Span loop",
  "Square knot",
  "Strangle knot",
  "Surgeon's loop",
  "Tape knot",
  "Thief knot",
  "Transom knot",
  "Thumb knot",
  "Threefoil knot",
  "Trident loop",
  "Trilene knot",
  "Triple crown knot",
  "True lover's knot",
  "Turle knot",
  "Versatackle knot",
  "Underhand knot",
  "Underwriter's knot",
  "Uni knot",
  "Wall and crown knot",
  "Water knot",
  "Windsor knot",
  "Yosemite bowlin",
  "Zeppelin bend",
];

item.rope = new Item();
item.rope.id = 5034;
item.rope.name = "Rope";
item.rope.desc = "A length of sturdy rope, for tying things up";
item.rope.stype = 5;
item.rope.use = function () {
  msg(
    'You practiced knot tying for a short while and made <span style="color:orange">"' +
      select(global.text.kntsct) +
      '"</span>!',
    "springgreen",
  );
};

item.mcps = new Item();
item.mcps.id = 5035;
item.mcps.name = "Clay Milk Cap";
item.mcps.desc =
  "Milk caps made from packed clay. Children like to play with these" +
  dom.dseparator +
  '<span style="color:yellow">+9 Throwing Damage</span>';
item.mcps.stype = 2;
item.mcps.c = "yellow";
item.mcps.use = function () {
  if (this.disabled !== true) {
    this.disabled = true;
    if (global.flags.civil === true || global.flags.btl === false) {
      msg("You threw " + this.name + " into the distance", "grey");
      giveSkExp(skl.thr, 1);
    } else tattack(9, 1, 1);
    this.amount--;
    setTimeout(
      () => {
        this.disabled = false;
      },
      500 / (skl.thr.lvl || 1),
    );
  }
};

item.stdst = new Item();
item.stdst.id = 5036;
item.stdst.name = "Stardust";
item.stdst.desc =
  "Tiny bits of solar pieces that came from the Sky. They shine in darkness and hold the energy of stars";
item.stdst.stype = 5;
item.stdst.use = function (x) {
  msg("It is glittering", "gold", null, null, "darkblue");
};

item.gcre1 = new Item();
item.gcre1.id = 5037;
item.gcre1.name = "Lesser Golem Core";
item.gcre1.desc =
  "Exhausted power core of a golem. It has nearly no use anymore, the entire energy supply of this thing has been used up";
item.gcre1.stype = 5;
item.gcre1.use = function (x) {
  msg("You notice specks of dull light flickering inside");
};

item.wvbkt = new Item();
item.wvbkt.id = 5038;
item.wvbkt.name = "Straw Basket";
item.wvbkt.desc = furniture.wvbkt.desc;
item.wvbkt.stype = 4;
item.wvbkt.isf = true;
item.wvbkt.parent = furniture.wvbkt;
item.wvbkt.use = function (x) {
  giveFurniture(furniture.wvbkt);
  this.amount--;
};

item.tbwr1 = new Item();
item.tbwr1.id = 5039;
item.tbwr1.name = "Wooden Tableware";
item.tbwr1.desc = furniture.tbwr1.desc;
item.tbwr1.stype = 4;
item.tbwr1.isf = true;
item.tbwr1.parent = furniture.tbwr1;
item.tbwr1.use = function (x) {
  const f = giveFurniture(furniture.tbwr1);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.ess1 = new Item();
item.ess1.id = 5040;
item.ess1.name = "Essence of Air";
item.ess1.desc = "Spirit shard of concentrated Wind power";
item.ess1.stype = 5;
item.ess1.rar = 2;

item.ess2 = new Item();
item.ess2.id = 5041;
item.ess2.name = "Essence of Earth";
item.ess2.desc = "Spirit shard of concentrated Geo power";
item.ess2.stype = 5;
item.ess2.rar = 2;

item.ess3 = new Item();
item.ess3.id = 5042;
item.ess3.name = "Essence of Flames";
item.ess3.desc = "Spirit shard of concentrated Fire power";
item.ess3.stype = 5;
item.ess3.rar = 2;

item.ess4 = new Item();
item.ess4.id = 5043;
item.ess4.name = "Essence of Water";
item.ess4.desc = "Spirit shard of concentrated Aqua power";
item.ess4.stype = 5;
item.ess4.rar = 2;

item.ess5 = new Item();
item.ess5.id = 5044;
item.ess5.name = "Essence of Light";
item.ess5.desc = "Spirit shard of concentrated Holy power";
item.ess5.stype = 5;
item.ess5.rar = 2;

item.ess6 = new Item();
item.ess6.id = 5045;
item.ess6.name = "Essence of Night";
item.ess6.desc = "Spirit shard of concentrated Demonic power";
item.ess6.stype = 5;
item.ess6.rar = 2;

item.toolbx = new Item();
item.toolbx.id = 5046;
item.toolbx.name = "Toolbox";
item.toolbx.desc =
  "Metal box with a variety of fine tools inside, multipurpose knives, mallets, pincers, chisels and a few more. Used for precision work and tinkering with simple and complex objects" +
  dom.dseparator +
  '<span style="color:chartreuse">Allows deconstruction of items and equipment when kept in inventory</span>';
item.toolbx.stype = 5;
item.toolbx.use = function () {
  if (random() < 0.1) msg("You almost dropped the box..", "orange");
  else msg("Dozens of tools tumble inside as you shake it", "yellow");
};

item.cpdst = new Item();
item.cpdst.id = 5047;
item.cpdst.name = "Corpse Dust";
item.cpdst.desc =
  "Dust derived from the remains of the deciesed, often used for witchcraft and enchantments";
item.cpdst.stype = 5;
item.cpdst.use = function () {
  msg("Disgusting", "lightgrey");
};

item.cclth = new Item();
item.cclth.id = 5048;
item.cclth.name = "Cheap Cloth";
item.cclth.desc =
  "A poor quality swatch of cloth. Unstitches when you so much as breathe on it";
item.cclth.stype = 5;
item.cclth.use = function () {
  msg("Can you even work with something this worthless?", "lightgrey");
};

item.thrdnl = new Item();
item.thrdnl.id = 5049;
item.thrdnl.name = "Thread";
item.thrdnl.desc =
  "A small quantity of thread that could be used in sewing and tailoring projects";
item.thrdnl.stype = 5;
item.thrdnl.use = function () {
  msg("It doesn't seem very sturdy", "lightgrey");
};
item.thrdnl.onGet = function () {
  if (this.amount >= 100) {
    giveRcp(rcp.cyrn);
    this.onGet = function () {};
  }
};

item.sktbad = new Item();
item.sktbad.id = 5050;
item.sktbad.name = "Mistake";
item.sktbad.desc =
  "A failed product of an unskilled artisan. Once destined to become something worty of display, this mangled mess is repulsive to look at";
item.sktbad.stype = 5;
item.sktbad.use = function () {
  msg("Better put this away", "lightgrey");
};

item.bblkt = new Item();
item.bblkt.id = 5051;
item.bblkt.name = "Ragwork Blanket";
item.bblkt.desc = furniture.bblkt.desc;
item.bblkt.stype = 4;
item.bblkt.isf = true;
item.bblkt.parent = furniture.bblkt;
item.bblkt.use = function (x) {
  const f = giveFurniture(furniture.bblkt);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.spillw = new Item();
item.spillw.id = 5052;
item.spillw.name = "Straw Pillow";
item.spillw.desc = furniture.spillw.desc;
item.spillw.stype = 4;
item.spillw.isf = true;
item.spillw.parent = furniture.spillw;
item.spillw.use = function (x) {
  const f = giveFurniture(furniture.spillw);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.cyrn = new Item();
item.cyrn.id = 5053;
item.cyrn.name = "Yarn Ball";
item.cyrn.desc = furniture.cyrn.desc;
item.cyrn.stype = 4;
item.cyrn.isf = true;
item.cyrn.parent = furniture.cyrn;
item.cyrn.use = function (x) {
  const f = giveFurniture(furniture.cyrn);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.dfish = new Item();
item.dfish.id = 5054;
item.dfish.name = "Dead Fish";
item.dfish.desc =
  "Carcass of some fish, looking bad, grey and dead. Can be dismantled into fishbait";
item.dfish.stype = 5;
item.dfish.use = function () {
  msg("Gross!", "lightgrey");
};

item.fbait1 = new Item();
item.fbait1.id = 5055;
item.fbait1.name = "Bait";
item.fbait1.desc =
  "Organic remains rolled into a ball, favoured by fish and other aquatic population";
item.fbait1.stype = 5;
item.fbait1.use = function () {};

item.htrdvr = new Item();
item.htrdvr.id = 5056;
item.htrdvr.name = "Hunter's Crate";
item.htrdvr.desc =
  "Heavy wooden crate you were asked to deliver to dojo. It is sealed shut and you can't look inside. It smells faintly of meat, spices and mushrooms. Probably filled with preserved dry produce";
item.htrdvr.stype = 5;
item.htrdvr.use = function () {
  msg("You resist the temptation to open it", "lightgrey");
};

item.htrsvr = new Item();
item.htrsvr.id = 5057;
item.htrsvr.name = "Hunter's Bag";
item.htrsvr.desc =
  "Heavy canvas bag you were asked to deliver to the herbalist. It is filled with separated bundles of various herbs you can't identify. You'd rather not touch anything inside as it looks dangerously poisonous";
item.htrsvr.stype = 5;
item.htrsvr.use = function () {
  msg("Strong aroma eminating from this bag makes your head spin", "orange");
};

item.hbtsvr = new Item();
item.hbtsvr.id = 5058;
item.hbtsvr.name = "Herbalist's Satchel";
item.hbtsvr.desc =
  "Heavy leather satchel you were asked to deliver to the head hunter. Hundreds of vials clang Violently no matter how carefully you attempt to carry it";
item.hbtsvr.stype = 5;
item.hbtsvr.use = function () {
  msg("You'll be in trouble of you break anything inside", "lightgrey");
};

item.fwdpile = new Item();
item.fwdpile.id = 5059;
item.fwdpile.name = "Firewood Pile";
item.fwdpile.desc =
  "Stockpile of firewood neatly packed together for easy storage";
item.fwdpile.stype = 4;
item.fwdpile.isf = true;
item.fwdpile.parent = furniture.fwdpile;
item.fwdpile.use = function (x) {
  const f = giveFurniture(furniture.fwdpile);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.lprmt = new Item();
item.lprmt.id = 5060;
item.lprmt.name = "Travel Permit";
item.lprmt.desc =
  "Written document used in your village. Acts as a proof of one's strength, meaning the owner has the ability to protect himself when leaving the village, you will need this when going out. Nearly every adult you know has this";
item.lprmt.stype = 5;
item.lprmt.rar = 2;
item.lprmt.use = function () {
  msg("You feel pride holding this", "green");
};

item.bed2 = new Item();
item.bed2.id = 5061;
item.bed2.name = "Plain Bed";
item.bed2.desc = furniture.bed2.desc;
item.bed2.stype = 4;
item.bed2.isf = true;
item.bed2.parent = furniture.bed2;
item.bed2.use = function (x) {
  const f = giveFurniture(furniture.bed2);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.wfng = new Item();
item.wfng.id = 5062;
item.wfng.name = "Wolf Fang";
item.wfng.desc = "Clear and sharp fang of a predator. It still looks dangerous";
item.wfng.stype = 5;
item.wfng.use = function () {
  msg("You may prick your finger if you mishandle it", "lightgrey");
};
item.wfng.onGet = function () {
  if (this.amount >= 10) giveRcp(rcp.wfng);
};

item.bookgen = new Item();
item.bookgen.id = 5063;
item.bookgen.name = "Book";
item.bookgen.desc = furniture.bookgen.desc;
item.bookgen.stype = 4;
item.bookgen.isf = true;
item.bookgen.parent = furniture.bookgen;
item.bookgen.use = function (x) {
  const f = giveFurniture(furniture.bookgen);
  if (inSector(sector.home) && !f.active) activatef(f);
  this.amount--;
};

item.dmice1 = new Item();
item.dmice1.id = 5064;
item.dmice1.name = "Dead Mouse";
item.dmice1.desc =
  "Vermin hunted by your cat, now proudly displayed before you";
item.dmice1.stype = 5;
item.dmice1.rar = 0;
item.dmice1.use = function () {
  msg("Yeah..", "grey");
};

item.dbdc1 = new Item();
item.dbdc1.id = 5065;
item.dbdc1.name = "Dead Bird";
item.dbdc1.desc = "A proof of loyalty brought to you by your cat";
item.dbdc1.stype = 5;
item.dbdc1.rar = 0;
item.dbdc1.use = function () {
  msg("Indeed..", "grey");
};

item.ip1 = new Item();
item.ip1.id = 9000;
item.ip1.name = '"Idea paper"';
item.ip1.desc =
  "Tiny scrap of paper with information. You wrote it yourself to remember things.";
item.ip1.stype = 4;
item.ip1.data.time = HOUR;
item.ip1.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      giveRcp(rcp.strawp);
      giveRcp(rcp.hlpd);
      giveRcp(rcp.borc);
      giveRcp(rcp.begg);
      this.amount--;
      this.data.read = false;
      this.data.finished = true;
    } else chss.trd.sl(this, 0.2);
  }
};

item.skl1 = new Item();
item.skl1.id = 9001;
item.skl1.name = "P Skillbook (Swords)";
item.skl1.desc =
  "Entry level practitioner skillbook about sword combat" +
  dom.dseparator +
  '<span style="color:deeppink">Sword Mastery EXP gain +5%</span>';
item.skl1.stype = 4;
item.skl1.data.time = HOUR * 4;
item.skl1.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.srdc, 150);
      skl.srdc.p += 0.05;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this, 0.5);
  }
};

item.skl2 = new Item();
item.skl2.id = 9002;
item.skl2.name = "P Skillbook (Knives)";
item.skl2.desc =
  "Entry level practitioner skillbook about knife combat" +
  dom.dseparator +
  '<span style="color:deeppink">Knife Mastery EXP gain +5%</span>';
item.skl2.stype = 4;
item.skl2.data.time = HOUR * 4;
item.skl2.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.knfc, 150);
      skl.knfc.p += 0.05;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this, 0.5);
  }
};

item.skl3 = new Item();
item.skl3.id = 9003;
item.skl3.name = "P Skillbook (Axes)";
item.skl3.desc =
  "Entry level practitioner skillbook about axe combat" +
  dom.dseparator +
  '<span style="color:deeppink">Axe Mastery EXP gain +5%</span>';
item.skl3.stype = 4;
item.skl3.data.time = HOUR * 4;
item.skl3.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.axc, 150);
      skl.axc.p += 0.05;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this, 0.5);
  }
};

item.skl4 = new Item();
item.skl4.id = 9004;
item.skl4.name = "P Skillbook (Spears)";
item.skl4.desc =
  "Entry level practitioner skillbook about spear combat" +
  dom.dseparator +
  '<span style="color:deeppink">Polearm Mastery EXP gain +5%</span>';
item.skl4.stype = 4;
item.skl4.data.time = HOUR * 4;
item.skl4.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.plrmc, 150);
      skl.plrmc.p += 0.05;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this, 0.5);
  }
};

item.skl5 = new Item();
item.skl5.id = 9005;
item.skl5.name = "P Skillbook (Hammers)";
item.skl5.desc =
  "Entry level practitioner skillbook about hammer combat" +
  dom.dseparator +
  '<span style="color:deeppink">Hammer Mastery EXP gain +5%</span>';
item.skl5.stype = 4;
item.skl5.data.time = HOUR * 4;
item.skl5.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.hmrc, 150);
      skl.hmrc.p += 0.05;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this, 0.5);
  }
};

item.skl6 = new Item();
item.skl6.id = 9006;
item.skl6.name = "P Skillbook (Martial)";
item.skl6.desc =
  "Entry level practitioner skillbook about unarmed combat" +
  dom.dseparator +
  '<span style="color:deeppink">Martial Mastery EXP gain +5%</span>';
item.skl6.stype = 4;
item.skl6.data.time = HOUR * 4;
item.skl6.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.unc, 150);
      skl.unc.p += 0.05;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this, 0.5);
  }
};

item.bstr = new Item();
item.bstr.id = 9007;
item.bstr.name = '"Animalis Vicipaedia"';
item.bstr.rar = 2;
item.bstr.desc =
  "Heavy Hunter's Encyclopedia. There are a few entries about wild life, beasts, and mythical creatures you can encounter, the other pages are blank. You feel the urge to fill them in" +
  dom.dseparator +
  '<span style="color:lime">Unlocks Bestiary</span>';
item.bstr.stype = 4;
item.bstr.data.time = HOUR * 17;
item.bstr.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      msg("Bestiary Unlocked!", "cyan");
      this.data.read = false;
      this.amount--;
      global.flags.bstu = true;
      this.data.finished = true;
      if (dom.jlbrw1s2) dom.jlbrw1s2.innerHTML = "B E S T I A R Y";
    } else chss.trd.sl(this);
  }
};

item.tbrwdb = new Item();
item.tbrwdb.id = 9008;
item.tbrwdb.name = '"The Art of Teabrewing"';
item.tbrwdb.rar = 2;
item.tbrwdb.desc =
  "Informative little book in detail describing the ways of teamaking, starting from precise amounts and proportions, specific water temperatures, correct tableware, to the defferent styles and etiquette";
item.tbrwdb.stype = 4;
item.tbrwdb.data.time = HOUR * 26;
item.tbrwdb.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      giveRcp(rcp.tbrwd);
      this.data.finished = true;
      this.data.read = false;
      this.amount--;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

global.text.mscbkatxt = [
  "This fairy tale is about a wolf who eats so much salted meat she becomes trapped in the butcher's cellar.",
  "In this traditional story of beastly intrigue a clever fox convinces an elderly lion to kill a derogatory wolf.",
  "This is an illustrated fairy tale book about a conversation between a mouse and a cat.",
  "An amusing collection of stories featuring a Thunder God on the cover.",
  "This is a well illustrated fairy tale about a war between the birds and the beasts, with particulars on the wartime conduct and eventual fate of the bat.",
  'This book, titled "The Rattlesnake\'s Vengeance" is a collection of local myths and legends.',
  "This fairy tale book is a regional variant of a tale of friendship between the Demon and the Angel",
  'This fairy tale book is entitled "Little Red Cap".  It details a red-cloaked child\'s various encounters with talking wolves.',
  "A collection of ghost stories warning about the dangers of stealing from the dead.",
  "A book of culinary fairy tales.  The cover features an orange fairy juggling a lemon, a lime, and a tangerine slimes.",
  "A book of fables about people who change into birds.",
  'This compendium of amusing folk tales about the devil is titled "Hell\'s Kettle: Legends of the Devil."',
  'This charming book of fables is titled, "The Crystal Mountain and the Princess."',
  "This is a collection of fairy tale stories warning against the consequences of extreme greed.",
  "In this fairy tale a strong man frightens an ogre by squeezing water out of a stone.",
  'This book of rustic folk tales bears the title: "How to Shout Down the Devil."',
  'The title of this book is "Village Folk-tales of Darion."  It includes fables about logical errors and foolish misjudgements of the village men.',
  'This book of folk tales is titled, "The Girl with the Ugly Name, and Other Stories."',
  'Titled "The Fleeing Pancake", this collection of silly folk tales is suitable for small children.',
];

item.msc1 = new Item();
item.msc1.id = 9009;
item.msc1.name = '"Book of Fairy Tales"';
item.msc1.data.bid = _rand(global.text.mscbkatxt.length - 1);
item.msc1.data.exp = _rand(500, 10000);
item.msc1.save = true;
item.msc1.desc = function () {
  return (
    "An amusing collection of folklore featuring the usual cast of fairies and demons" +
    dom.dseparator +
    '<span style="color:limegreen">' +
    global.text.mscbkatxt[this.data.bid] +
    "</span>"
  );
};
item.msc1.stype = 4;
item.msc1.data.time = HOUR * 6;
item.msc1.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      giveExp(this.data.exp || 500, true, true, true);
      this.data.bid = rand(global.text.mscbkatxt.length - 1);
      this.data.exp = rand(500, 5000);
      this.desc =
        "An amusing collection of folklore featuring the usual cast of fairies and demons" +
        dom.dseparator +
        '<span style="color:limegreen">' +
        global.text.mscbkatxt[item.msc1.data.bid] +
        "</span>";
      this.data.time = this.data.timep = rand(2, 10) * HOUR;
      this.data.bid = rand(global.text.mscbkatxt.length - 1);
      this.data.finished = true;
      this.data.read = false;
      this.amount--;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.bcpn = new Item();
item.bcpn.id = 9010;
item.bcpn.name = '"Cooking with Poison"';
item.bcpn.rar = 2;
item.bcpn.desc =
  "A leatherbound book with an embossed cauldron on the cover. Inside it describes ways to purify food through alchemy";
item.bcpn.stype = 4;
item.bcpn.data.time = HOUR * 30;
item.bcpn.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.data.finished = true;
      this.data.read = false;
      this.amount--;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.mdc1 = new Item();
item.mdc1.id = 9011;
item.mdc1.name = '"First Aid Manual"';
item.mdc1.desc =
  "Tiny red pocket-sized guide to emergency care, covers basic bandaging and wound treating";
item.mdc1.stype = 4;
item.mdc1.data.time = HOUR * 12;
item.mdc1.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      let dt = 0;
      dt += giveRcp(rcp.bdgh);
      dt += giveRcp(rcp.mdcag);
      dt += giveRcp(rcp.hptn1);
      this.data.finished = true;
      giveItem(item.bookgen);
      if (dt === 0) msg("You haven't learned anything new...", "lightgrey");
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.dmkbk = new Item();
item.dmkbk.id = 9012;
item.dmkbk.name = '"Dollmaker\'s Handbook"';
item.dmkbk.desc =
  "A very short manual filled with illustrations about primitive dollmaking. The instructions are easy to understand so children could make the dolls too. Looks like there was a chapter dedicated to sewing, now it's almost entirely missing";
item.dmkbk.stype = 4;
item.dmkbk.data.time = HOUR * 12;
item.dmkbk.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      giveItem(item.bookgen);
      let dt = 0;
      dt += giveRcp(rcp.sdl1);
      dt += giveRcp(rcp.wdl1);
      dt += giveRcp(rcp.gdl1);
      dt += giveRcp(rcp.bdl1);
      dt += giveRcp(rcp.cyrn);
      this.data.finished = true;
      if (dt === 0) msg("You haven't learned anything new...", "lightgrey");
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.scrlw = new Item();
item.scrlw.id = 9013;
item.scrlw.name = '"Ragged Parchment"';
item.scrlw.desc =
  "Scummy sheet of paper tainted with something teal. Some kinds of materials are listed here";
item.scrlw.stype = 4;
item.scrlw.data.time = HOUR * 3;
item.scrlw.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      let dt = 0;
      dt += giveRcp(rcp.hptn1);
      this.data.finished = true;
      if (dt === 0)
        msg("You already know how to make lesser potions", "lightgrey");
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.wp2s = new Item();
item.wp2s.id = 9014;
item.wp2s.name = '"Rotten Illustration"';
item.wp2s.desc =
  "Found this within old bushery, it looks like a drawing of something in charcoal";
item.wp2s.onGet = function () {
  global.flags.wp2sgt = true;
};
item.wp2s.stype = 4;
item.wp2s.data.time = HOUR * 2;
item.wp2s.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      let dt = 0;
      dt += giveRcp(rcp.wp2);
      this.data.finished = true;
      if (dt === 0) msg("You already know how to sharpen sticks", "lightgrey");
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.shppmf = new Item();
item.shppmf.id = 9015;
item.shppmf.name = '"Pamphlet"';
item.shppmf.desc =
  "This was shoved onto you by someone on the streets. Store names, discount prices, hot items... An entire wall of advertisements in tiny letters, to fit as much of it as possible on this piece of paper. It is a good idea to memorize the addresses";
item.shppmf.onGet = function () {
  global.flags.pmfspmkm1 = true;
};
item.shppmf.stype = 4;
item.shppmf.data.time = HOUR * 3;
item.shppmf.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      global.flags.mkplc1u = true;
      this.data.finished = true;
      msg("Right, you could go to the marketplace", "lime");
      if (global.current_l.id === chss.lsmain1.id) smove(chss.lsmain1, false);
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.amrthsck = new Item();
item.amrthsck.id = 9016;
item.amrthsck.name = '"Guide To Living By Yourself"';
item.amrthsck.desc =
  'Looks like a page from someone\'s notebook, marked "H", poorly written in bad handwriting. It lists several simple things you can cook and make from widely available cheap materials';
item.amrthsck.stype = 4;
item.amrthsck.data.time = HOUR * 12;
item.amrthsck.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      giveItem(item.bookgen);
      let dt = 0;
      dt += giveRcp(rcp.bcrrt);
      dt += giveRcp(rcp.bcrc);
      dt += giveRcp(rcp.hlstw);
      dt += giveRcp(rcp.rsmt);
      dt += giveRcp(rcp.segg);
      dt += giveRcp(rcp.jsdch);
      dt += giveRcp(rcp.appljc);
      dt += giveRcp(rcp.bblkt);
      dt += giveRcp(rcp.spillw);
      this.data.finished = true;
      if (dt === 0) msg("You haven't learned anything new...", "lightgrey");
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.skl1a = new Item();
item.skl1a.id = 9017;
item.skl1a.name = '"Bladesman Manual"';
item.skl1a.rar = 2;
item.skl1a.desc =
  "Technique book full of fundamental knowledge about swordfighting" +
  dom.dseparator +
  '<span style="color:deeppink">Sword Mastery EXP gain +15%</span>';
item.skl1a.stype = 4;
item.skl1a.data.time = HOUR * 14;
item.skl1a.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.srdc, 3250);
      skl.srdc.p += 0.15;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.skl2a = new Item();
item.skl2a.id = 9018;
item.skl2a.name = '"Assassin Manual"';
item.skl2a.rar = 2;
item.skl2a.desc =
  "Technique book full of fundamental knowledge about kinfefighting" +
  dom.dseparator +
  '<span style="color:deeppink">Knife Mastery EXP gain +15%</span>';
item.skl2a.stype = 4;
item.skl2a.data.time = HOUR * 14;
item.skl2a.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.knfc, 3250);
      skl.knfc.p += 0.15;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.skl3a = new Item();
item.skl3a.id = 9019;
item.skl3a.name = '"Axeman Manual"';
item.skl3a.rar = 2;
item.skl3a.desc =
  "Technique book full of fundamental knowledge about axefighting" +
  dom.dseparator +
  '<span style="color:deeppink">Axe Mastery EXP gain +15%</span>';
item.skl3a.stype = 4;
item.skl3a.data.time = HOUR * 14;
item.skl3a.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.axc, 150);
      skl.axc.p += 0.05;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.skl4a = new Item();
item.skl4a.id = 9020;
item.skl4a.name = '"Lancer Manual"';
item.skl4a.rar = 2;
item.skl4a.desc =
  "Technique book full of fundamental knowledge about spearfighting" +
  dom.dseparator +
  '<span style="color:deeppink">Polearm Mastery EXP gain +15%</span>';
item.skl4a.stype = 4;
item.skl4a.data.time = HOUR * 14;
item.skl4a.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.plrmc, 3250);
      skl.plrmc.p += 0.15;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.skl5a = new Item();
item.skl5a.id = 9021;
item.skl5a.name = '"Clubber Manual"';
item.skl5a.rar = 2;
item.skl5a.desc =
  "Technique book full of fundamental knowledge about bluntfighting" +
  dom.dseparator +
  '<span style="color:deeppink">Hammer Mastery EXP gain +15%</span>';
item.skl5a.stype = 4;
item.skl5a.data.time = HOUR * 14;
item.skl5a.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.hmrc, 3250);
      skl.hmrc.p += 0.15;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.skl6a = new Item();
item.skl6a.id = 9022;
item.skl6a.name = '"Brawler Manual"';
item.skl6a.rar = 2;
item.skl6a.desc =
  "Technique book full of fundamental knowledge about fistfighting" +
  dom.dseparator +
  '<span style="color:deeppink">Martial Mastery EXP gain +15%</span>';
item.skl6a.stype = 4;
item.skl6a.data.time = HOUR * 14;
item.skl6a.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      giveSkExp(skl.unc, 3250);
      skl.unc.p += 0.15;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.brdbn = new Item();
item.brdbn.id = 9023;
item.brdbn.name = '"Your First Bread"';
item.brdbn.desc =
  "Very primitive instruction booklet about making simple breads. The way it's written, it looks very similar to manuals given to slaves and servants at the beginning of their service, if they are able to read";
item.brdbn.stype = 4;
item.brdbn.data.time = HOUR * 7;
item.brdbn.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      let dt = 0;
      dt += giveRcp(rcp.flr);
      dt += giveRcp(rcp.dgh);
      dt += giveRcp(rcp.brd);
      this.data.finished = true;
      giveItem(item.bookgen);
      if (dt === 0) msg("You haven't learned anything new...", "lightgrey");
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.bfsnwt = new Item();
item.bfsnwt.id = 9024;
item.bfsnwt.name = '"Beggar Fashion"';
item.bfsnwt.desc =
  "Some nonsence illustration with a name, featuring a group of peasants in rags posing awkwardly. What even is this?";
item.bfsnwt.stype = 4;
item.bfsnwt.data.time = HOUR * 4;
item.bfsnwt.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      let dt = 0;
      dt += giveRcp(rcp.ptchpts);
      dt += giveRcp(rcp.ptchct);
      if (dt === 0) msg("You haven't learned anything new...", "lightgrey");
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.pdeedhs = new Item();
item.pdeedhs.id = 9025;
item.pdeedhs.name = '"Property Deed"';
item.pdeedhs.rar = 2;
item.pdeedhs.desc =
  "This old looking legal document indentifies you as a sole owner of this broken down hut you live in. It was passed down to you by your ancestors, you speculate" +
  dom.dseparator +
  '<span style="color:lime">Allows you to list and examine your possessions</span>';
item.pdeedhs.stype = 4;
item.pdeedhs.data.time = 30;
item.pdeedhs.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      global.flags.hsedchk = true;
      if (global.current_l.id === 111) smove(chss.home, false);
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.fgtsb1 = new Item();
item.fgtsb1.id = 9026;
item.fgtsb1.name = '"Street Fighting"';
item.fgtsb1.desc =
  "Someone's observational notes of street gangs and their violent encounters. There's an amusing essay about dirty tricks in the front section" +
  dom.dseparator +
  '<span style="color:deeppink">Fighting EXP gain +15%</span>';
item.fgtsb1.stype = 4;
item.fgtsb1.data.time = HOUR * 6;
item.fgtsb1.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      this.amount--;
      skl.fgt.p += 0.15;
      this.data.read = false;
      this.data.finished = true;
      giveItem(item.bookgen);
    } else chss.trd.sl(this);
  }
};

item.jnlbk = new Item();
item.jnlbk.id = 9027;
item.jnlbk.name = '"Empty Journal"';
item.jnlbk.desc =
  "Dusty old tome, pure as snow and untainted by ink. Feels like it was purified by magic. When you gaze upon it, you are compelled to record your encounters and anything else that you find important and crucial for your adventures" +
  dom.dseparator +
  '<span style="color:lime">Unlocks Journal</span>';
item.jnlbk.stype = 4;
item.jnlbk.data.time = HOUR * 4;
item.jnlbk.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      msg("Journal Unlocked!", "cyan");
      this.data.read = false;
      this.amount--;
      global.flags.jnlu = true;
      this.data.finished = true;
      dom.ct_bt6.innerHTML = "journal";
    } else chss.trd.sl(this);
  }
};
