// Item definitions: consumables, crafting materials, books, and quest items.
// Each entry carries its stack behaviour, rarity, and the `use` handler that
// runs when the player consumes or reads it. Display names and descriptions
// come from the locale files.

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

// Eating. One hundred and eighty-six of the game's food items had this same handler
// copied into them -- twelve lines each, differing only in the gluttony level they
// train -- which meant a change to how eating works had to be made in 186 places, and
// missing one of them was a near certainty.
//
// They arrived in two spellings, differing only in whether `this.amount--` came
// before or after the readout and the message. That difference is invisible:
// dom.d5_3_1.update() reads you.sat, you.satmax and you.efficiency() and never looks
// at the stack the food came from, and the message reads this.val. So both spellings
// are this one function, and tests/fingerprint.js records what every item's use
// handler does, which is how that was confirmed rather than assumed.
function eatUse(gluttony) {
  // A plain function, not an arrow: `this` has to be the item being eaten.
  return function () {
    you.sat + this.val > you.satmax
      ? (you.sat = you.satmax)
      : (you.sat += this.val);
    skl.glt.use(gluttony);
    global.stat.fooda++;
    this.amount--;
    dom.d5_3_1.update();
    msg(
      i18n.t("runtime.data.items.dialogue.restored_energy", {
        amount: this.val,
      }),
      "lime",
    );
  };
}

item.rcs = new Item();
item.rcs.id = 3000;
item.rcs.name = i18n.t("content.item.rcs.name");
item.rcs.desc = i18n.t("content.item.rcs.desc");
item.rcs.stype = 4;
item.rcs.rar = 3;
item.rcs.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.placeholder_ff554353"));
};

item.hrb1 = new Item();
item.hrb1.id = 3001;
item.hrb1.name = i18n.t("content.item.hrb1.name");
item.hrb1.val = 7;
item.hrb1.desc = i18n.t("content.item.hrb1.desc", {
  separator: dom.dseparator,
  val: item.hrb1.val,
});
item.hrb1.stype = 4;
item.hrb1.use = function () {
  global.stat.medst++;
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  this.amount--;
  dom.d5_1_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_hp", { amount: this.val }),
    "lime",
  );
};
item.hrb1.onGet = function () {
  if (this.amount >= 50) {
    giveRcp(rcp.hlstw);
    this.onGet = function () {};
  }
};

item.atd1 = new Item();
item.atd1.id = 3002;
item.atd1.name = i18n.t("content.item.atd1.name");
item.atd1.desc = i18n.t("content.item.atd1.desc", {
  separator: dom.dseparator,
});
item.atd1.stype = 4;
item.atd1.use = function () {
  global.stat.medst++;
  if (effect.psn.active === true) {
    if (effect.psn.duration - 30 <= 0) {
      removeEff(effect.psn);
      msg(
        i18n.t("runtime.data.items.dialogue.you_feel_better_922794ba"),
        "lime",
      );
    } else {
      effect.psn.duration -= 30;
      msg(
        i18n.t("runtime.data.items.dialogue.you_feel_a_little_better_d1ae91f7"),
        "lightgreen",
      );
    }
  } else
    msg(
      i18n.t("runtime.data.items.dialogue.tastes_like_medicine_aece0794"),
      "lightblue",
    );
  this.amount--;
};

item.psnwrd = new Item();
item.psnwrd.id = 3003;
item.psnwrd.name = i18n.t("content.item.psnwrd.name");
item.psnwrd.desc = i18n.t("content.item.psnwrd.desc", {
  separator: dom.dseparator,
});
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
item.hlpd.name = i18n.t("content.item.hlpd.name");
item.hlpd.val = 16;
item.hlpd.desc = i18n.t("content.item.hlpd.desc", {
  separator: dom.dseparator,
  val: item.hlpd.val,
});
item.hlpd.stype = 4;
item.hlpd.use = function () {
  global.stat.medst++;
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  this.amount--;
  dom.d5_1_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_hp", { amount: this.val }),
    "lime",
  );
};

item.smm = new Item();
item.smm.id = 3005;
item.smm.name = i18n.t("content.item.smm.name");
item.smm.desc = i18n.t("content.item.smm.desc", { separator: dom.dseparator });
item.smm.stype = 4;
item.smm.use = function () {
  global.stat.medst++;
  if (effect.fpn.active === true) {
    if (effect.fpn.duration - 30 <= 0) {
      removeEff(effect.fpn);
      msg(
        i18n.t("runtime.data.items.dialogue.you_feel_better_922794ba"),
        "lime",
      );
    } else {
      effect.fpn.duration -= 30;
      msg(
        i18n.t("runtime.data.items.dialogue.you_feel_a_little_better_d1ae91f7"),
        "lightgreen",
      );
    }
  } else
    msg(
      i18n.t("runtime.data.items.dialogue.tastes_like_medicine_aece0794"),
      "lightblue",
    );
  this.amount--;
};

item.sp1 = new Item();
item.sp1.id = 3006;
item.sp1.name = i18n.t("content.item.sp1.name");
item.sp1.desc = i18n.t("content.item.sp1.desc", { separator: dom.dseparator });
item.sp1.stype = 4;
item.sp1.use = function () {
  giveExp(500, true, true, true);
  global.stat.plst++;
  global.stat.medst++;
  this.amount--;
};

item.sp2 = new Item();
item.sp2.id = 3007;
item.sp2.name = i18n.t("content.item.sp2.name");
item.sp2.desc = i18n.t("content.item.sp2.desc", { separator: dom.dseparator });
item.sp2.stype = 4;
item.sp2.use = function () {
  giveExp(2500, true, true, true);
  global.stat.plst++;
  global.stat.medst++;
  this.amount--;
};

item.sp3 = new Item();
item.sp3.id = 3008;
item.sp3.name = i18n.t("content.item.sp3.name");
item.sp3.desc = i18n.t("content.item.sp3.desc", { separator: dom.dseparator });
item.sp3.stype = 4;
item.sp3.use = function () {
  giveExp(15000, true, true, true);
  global.stat.plst++;
  global.stat.medst++;
  this.amount--;
};

item.lsrd = new Item();
item.lsrd.id = 3009;
item.lsrd.name = i18n.t("content.item.lsrd.name");
item.lsrd.desc = i18n.t("content.item.lsrd.desc", {
  separator: dom.dseparator,
});
item.lsrd.stype = 4;
item.lsrd.use = function () {
  you.hpmax += 2;
  you.hp += 2;
  you.hpa += 2;
  dom.d5_1_1.update();
  msg(
    i18n.t(
      "runtime.data.items.dialogue.hp_increased_by_2_permanently_47bc1cf3",
    ),
    "hotpink",
  );
  this.amount--;
};

item.hptn1 = new Item();
item.hptn1.id = 3010;
item.hptn1.name = i18n.t("content.item.hptn1.name");
item.hptn1.val = 50;
item.hptn1.desc = i18n.t("content.item.hptn1.desc", {
  separator: dom.dseparator,
  val: item.hptn1.val,
});
item.hptn1.stype = 4;
item.hptn1.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_hp", { amount: this.val }),
    "lime",
  );
};

item.lckl = new Item();
item.lckl.id = 3011;
item.lckl.name = i18n.t("content.item.lckl.name");
item.lckl.desc = i18n.t("content.item.lckl.desc", {
  separator: dom.dseparator,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.your_luck_increases_6143dc15"),
    "gold",
  );
  this.amount--;
};

item.wstn1 = new Item();
item.wstn1.id = 3012;
item.wstn1.name = i18n.t("content.item.wstn1.name");
item.wstn1.desc = i18n.t("content.item.wstn1.desc", {
  separator: dom.dseparator,
});
item.wstn1.stype = 4;
item.wstn1.use = function (x) {
  if (you.eqp[0].id === 10000)
    msg(
      i18n.t("runtime.data.items.dialogue.repair_what_35f41b95"),
      "lightgrey",
    );
  else {
    you.eqp[0].dp + 2 >= you.eqp[0].dpmax
      ? (you.eqp[0].dp = you.eqp[0].dpmax)
      : (you.eqp[0].dp += 2);
    msg(
      i18n.t("runtime.data.items.dialogue.repaired_item", {
        item: you.eqp[0].name,
      }),
      "yellow",
    );
    this.amount--;
  }
};

item.bdgh = new Item();
item.bdgh.id = 3013;
item.bdgh.name = i18n.t("content.item.bdgh.name");
item.bdgh.desc = i18n.t("content.item.bdgh.desc", {
  separator: dom.dseparator,
});
item.bdgh.stype = 4;
item.bdgh.use = function () {
  if (!effect.bled.active) {
    msg(
      i18n.t("runtime.data.items.dialogue.you_re_not_bleeding_116fa1df"),
      "orange",
    );
    return;
  }
  const f = findbyid(you.eff, effect.bled.id);
  if (f.duration - 20 <= 0) removeEff(f, f.target);
  else f.duration -= 20;
  msg(
    i18n.t("runtime.data.items.dialogue.you_bandage_your_wounds_9c79ad92"),
    "lime",
  );
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
item.amshrm.name = i18n.t("content.item.amshrm.name");
item.amshrm.desc = i18n.t("content.item.amshrm.desc", {
  separator: dom.dseparator,
});
item.amshrm.stype = 4;
item.amshrm.rar = 4;
item.amshrm.use = function (x) {
  you.stra += 5;
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_feel_the_surge_of_strength_4d678a89",
    ),
    "crimson",
  );
  msg(i18n.t("runtime.data.items.dialogue.str_5_4db1c060"), "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.akhrb = new Item();
item.akhrb.id = 3015;
item.akhrb.name = i18n.t("content.item.akhrb.name");
item.akhrb.desc = i18n.t("content.item.akhrb.desc", {
  separator: dom.dseparator,
});
item.akhrb.stype = 4;
item.akhrb.rar = 2;
item.akhrb.use = function (x) {
  if (this.disabled !== true) {
    this.disabled = true;
    if (random() < 0.005) {
      msg(
        i18n.t(
          "runtime.data.items.dialogue.you_managed_to_consume_it_e5134e97",
        ),
        "lime",
      );
      giveSkExp(skl.glt, rand(100, 355 * (skl.glt.lvl * 0.2 + 1)));
      you.sat *= 0.2;
      this.amount--;
    } else {
      msg(
        select(i18n.get("runtime.data.items.dialogue.nausea_reactions")),
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
item.cndl.name = i18n.t("content.item.cndl.name");
item.cndl.desc = i18n.t("content.item.cndl.desc");
item.cndl.stype = 4;
item.cndl.use = function (x) {
  if (!effect.cdlt.active) giveEff(you, effect.cdlt);
  else effect.cdlt.duration = 360;
  this.amount--;
};

item.incsk = new Item();
item.incsk.id = 3017;
item.incsk.name = i18n.t("content.item.incsk.name");
item.incsk.desc = i18n.t("content.item.incsk.desc", {
  separator: dom.dseparator,
});
item.incsk.stype = 4;
item.incsk.use = function (x) {
  if (effect.incsk.active === true) effect.insck.duration = 600;
  else giveEff(you, effect.incsk);
  this.amount--;
};

item.sp0a = new Item();
item.sp0a.id = 3018;
item.sp0a.name = i18n.t("content.item.sp0a.name");
item.sp0a.desc = i18n.t("content.item.sp0a.desc", {
  separator: dom.dseparator,
});
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
item.smkbmb.name = i18n.t("content.item.smkbmb.name");
item.smkbmb.desc = i18n.t("content.item.smkbmb.desc", {
  separator: dom.dseparator,
});
item.smkbmb.stype = 4;
item.smkbmb.use = function () {
  if (global.flags.civil === true && global.flags.btl === false) {
    msg(
      i18n.t("runtime.data.items.dialogue.you_re_not_in_combat_8f5b9b04"),
      "red",
    );
    return;
  }
  if (
    global.current_z.size === 1 ||
    global.current_z.size === 0 ||
    global.current_z.isboss
  ) {
    msg(
      i18n.t("runtime.data.items.dialogue.you_can_t_pass_this_enemy_7df5335c"),
      "red",
    );
    return;
  } else {
    msg(
      i18n.t("runtime.data.items.dialogue.puff_67d0eacb"),
      "black",
      null,
      null,
      "lightgrey",
    );
    global.flags.smkactv = true;
    global.current_z.size--;
    area_init(global.current_z);
    dom.d7m.update();
    this.amount--;
  }
};

item.svial1 = new Item();
item.svial1.id = 3020;
item.svial1.name = i18n.t("content.item.svial1.name");
item.svial1.desc = i18n.t("content.item.svial1.desc");
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
      msg(
        i18n.t("runtime.data.items.dialogue.unable_to_summon_40bd9724"),
        "red",
      );
      return;
    }
    const ta = new Area();
    ta.id = -1;
    ta.name = i18n.t("content.area.nwh.name");
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
    msg(
      i18n.t(
        "runtime.data.items.dialogue.the_creature_arises_from_the_ground_8918e66b",
      ),
      "white",
      null,
      null,
      "red",
    );
    this.amount--;
  } else
    msg(
      i18n.t("runtime.data.items.dialogue.you_re_already_in_a_battle_a707b4b2"),
      "red",
    );
};

item.mpwdr = new Item();
item.mpwdr.id = 3021;
item.mpwdr.name = i18n.t("content.item.mpwdr.name");
item.mpwdr.desc = i18n.t("content.item.mpwdr.desc", {
  separator: dom.dseparator,
});
item.mpwdr.stype = 4;
item.mpwdr.use = function () {
  if (
    global.current_z.protected ||
    global.current_z.id <= 101 ||
    global.current_z.size <= 1
  ) {
    msg(
      i18n.t("runtime.data.items.dialogue.unable_to_use_it_here_2c7ad5d5"),
      "red",
    );
    return;
  }
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_spread_some_powder_on_the_ground_5dd5ace6",
    ),
    "lime",
    null,
    null,
    "brown",
  );
  global.current_z.size += 5;
  dom.d7m.update();
  this.amount--;
};

item.smbpll = new Item();
item.smbpll.id = 3022;
item.smbpll.name = i18n.t("content.item.smbpll.name");
item.smbpll.desc = i18n.t("content.item.smbpll.desc", {
  separator: dom.dseparator,
});
item.smbpll.stype = 4;
item.smbpll.use = function (x) {
  if (
    global.flags.btl ||
    // This runs ontick 1,080 times in a plain loop. With btl false during a
    // nightmare it would otherwise replay eighteen in-game hours in one click.
    global.flags.nmare ||
    global.flags.rdng ||
    global.flags.isshop ||
    global.flags.busy ||
    global.flags.work
  ) {
    msg(
      i18n.t("runtime.data.items.dialogue.you_can_t_sleep_now_cb2b1002"),
      "red",
    );
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
item.lifedr.name = i18n.t("content.item.lifedr.name");
item.lifedr.desc = i18n.t("content.item.lifedr.desc", {
  separator: dom.dseparator,
});
item.lifedr.stype = 4;
item.lifedr.rar = 2;
item.lifedr.use = function () {
  you.stat_p[0] += 0.03;
  you.hpmax += 40;
  you.hp += 40;
  you.hpa += 40;
  dom.d5_1_1.update();
  msg(
    i18n.t(
      "runtime.data.items.dialogue.hp_increased_by_40_permanently_c94012ef",
    ),
    "hotpink",
  );
  msg(
    i18n.t("runtime.data.items.dialogue.hp_potential_grows_95fbb1e6"),
    "pink",
  );
  this.amount--;
};

item.mnblm = new Item();
item.mnblm.id = 3024;
item.mnblm.name = i18n.t("content.item.mnblm.name");
item.mnblm.desc = i18n.t("content.item.mnblm.desc", {
  separator: dom.dseparator,
});
item.mnblm.stype = 4;
item.mnblm.rar = 2;
item.mnblm.use = function () {
  you.satmax += 2;
  you.sat += 2;
  you.sata += 2;
  dom.d5_3_1.update();
  msg(
    i18n.t(
      "runtime.data.items.dialogue.sat_increased_by_2_permanently_fd289123",
    ),
    "hotpink",
  );
  this.amount--;
};

item.hptn2 = new Item();
item.hptn2.id = 3025;
item.hptn2.name = i18n.t("content.item.hptn2.name");
item.hptn2.val = 450;
item.hptn2.desc = i18n.t("content.item.hptn2.desc", {
  separator: dom.dseparator,
  val: item.hptn2.val,
});
item.hptn2.stype = 4;
item.hptn2.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_hp", { amount: this.val }),
    "lime",
  );
};

item.hptn3 = new Item();
item.hptn3.id = 3026;
item.hptn3.name = i18n.t("content.item.hptn3.name");
item.hptn3.val = 2100;
item.hptn3.desc = i18n.t("content.item.hptn3.desc", {
  separator: dom.dseparator,
  val: item.hptn3.val,
});
item.hptn3.stype = 4;
item.hptn3.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_hp", { amount: this.val }),
    "lime",
  );
};

item.hptn4 = new Item();
item.hptn4.id = 3027;
item.hptn4.name = i18n.t("content.item.hptn4.name");
item.hptn4.val = 7900;
item.hptn4.desc = i18n.t("content.item.hptn4.desc", {
  separator: dom.dseparator,
  val: item.hptn4.val,
});
item.hptn4.stype = 4;
item.hptn4.rar = 2;
item.hptn4.use = function () {
  you.hp + this.val > you.hpmax ? (you.hp = you.hpmax) : (you.hp += this.val);
  global.stat.potnst++;
  global.stat.medst++;
  this.amount--;
  dom.d5_1_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_hp", { amount: this.val }),
    "lime",
  );
};

item.lsstn = new Item();
item.lsstn.id = 3028;
item.lsstn.name = i18n.t("content.item.lsstn.name");
item.lsstn.desc = i18n.t("content.item.lsstn.desc", {
  separator: dom.dseparator,
});
item.lsstn.stype = 4;
item.lsstn.use = function () {
  you.hpmax += 25;
  you.hp += 25;
  you.hpa += 25;
  dom.d5_1_1.update();
  msg(
    i18n.t(
      "runtime.data.items.dialogue.hp_increased_by_25_permanently_6f014202",
    ),
    "hotpink",
  );
  this.amount--;
};

item.bltrt = new Item();
item.bltrt.id = 3029;
item.bltrt.name = i18n.t("content.item.bltrt.name");
item.bltrt.desc = i18n.t("content.item.bltrt.desc", {
  separator: dom.dseparator,
});
item.bltrt.stype = 4;
item.bltrt.rar = 2;
item.bltrt.use = function () {
  you.sat + 100 > you.satmax ? (you.sat = you.satmax) : (you.sat += 100);
  dom.d5_3_1.update();
  this.amount--;
  msg(
    i18n.t("runtime.data.items.dialogue.restored_100_energy_07d2786a"),
    "lime",
  );
};

item.feip1 = new Item();
item.feip1.id = 3030;
item.feip1.name = i18n.t("content.item.feip1.name");
item.feip1.desc = i18n.t("content.item.feip1.desc");
item.feip1.stype = 4;
item.feip1.use = function () {
  giveEff(you, effect.fei1, 60, 1);
  this.amount--;
  global.stat.plst++;
};

item.stthbm1 = new Item();
item.stthbm1.id = 3031;
item.stthbm1.name = i18n.t("content.item.stthbm1.name");
item.stthbm1.desc = i18n.t("content.item.stthbm1.desc", {
  separator: dom.dseparator,
});
item.stthbm1.stype = 4;
item.stthbm1.rar = 2;
item.stthbm1.use = function (x) {
  you.stra += 1;
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_feel_the_surge_of_strength_4d678a89",
    ),
    "crimson",
  );
  msg(i18n.t("runtime.data.items.dialogue.str_1_7aeb277c"), "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.stthbm2 = new Item();
item.stthbm2.id = 3032;
item.stthbm2.name = i18n.t("content.item.stthbm2.name");
item.stthbm2.desc = i18n.t("content.item.stthbm2.desc", {
  separator: dom.dseparator,
});
item.stthbm2.stype = 4;
item.stthbm2.rar = 2;
item.stthbm2.use = function (x) {
  you.spda += 1;
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_feel_the_surge_of_strength_4d678a89",
    ),
    "crimson",
  );
  msg(i18n.t("runtime.data.items.dialogue.spd_1_fa4d7c5a"), "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.stthbm3 = new Item();
item.stthbm3.id = 3033;
item.stthbm3.name = i18n.t("content.item.stthbm3.name");
item.stthbm3.desc = i18n.t("content.item.stthbm3.desc", {
  separator: dom.dseparator,
});
item.stthbm3.stype = 4;
item.stthbm3.rar = 2;
item.stthbm3.use = function (x) {
  you.inta += 1;
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_feel_the_surge_of_strength_4d678a89",
    ),
    "crimson",
  );
  msg(i18n.t("runtime.data.items.dialogue.int_1_07a5a667"), "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.stthbm4 = new Item();
item.stthbm4.id = 3034;
item.stthbm4.name = i18n.t("content.item.stthbm4.name");
item.stthbm4.desc = i18n.t("content.item.stthbm4.desc", {
  separator: dom.dseparator,
});
item.stthbm4.stype = 4;
item.stthbm4.rar = 2;
item.stthbm4.use = function (x) {
  you.agla += 1;
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_feel_the_surge_of_strength_4d678a89",
    ),
    "crimson",
  );
  msg(i18n.t("runtime.data.items.dialogue.agl_1_baf3f699"), "lime");
  you.stat_r();
  update_d();
  this.amount--;
};

item.bmsmktt = new Item();
item.bmsmktt.id = 3035;
item.bmsmktt.name = i18n.t("content.item.bmsmktt.name");
item.bmsmktt.desc = i18n.t("content.item.bmsmktt.desc");
item.bmsmktt.stype = 4;
item.bmsmktt.use = function () {
  if (global.current_l.id !== 111) {
    msg(
      i18n.t(
        "runtime.data.items.dialogue.this_isn_t_the_best_place_to_use_ef82ee13",
      ),
      "red",
    );
    return;
  }
  area.hmbsmnt.size = 0;
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_toss_a_cluster_down_your_basement_and_bc18775a",
    ),
    "yellow",
  );
  dom.d_lctt.innerHTML += i18n.t("runtime.data.items.interface.nbsp_e9caec8e");
  sector.home.data.smkp = 900;
  sector.home.data.smkt = time.minute;
  this.amount--;
};

item.appl = new Item();
item.appl.id = 1;
item.appl.name = i18n.t("content.item.appl.name");
item.appl.val = 7;
item.appl.desc = i18n.t("content.item.appl.desc", {
  separator: dom.dseparator,
  val: item.appl.val,
});
item.appl.stype = 4;
item.appl.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  this.amount--;
  dom.d5_3_1.update();
  skl.glt.use(2);
  global.stat.fooda++;
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.brd = new Item();
item.brd.id = 2;
item.brd.name = i18n.t("content.item.brd.name");
item.brd.val = 14;
item.brd.desc = i18n.t("content.item.brd.desc", {
  separator: dom.dseparator,
  val: item.brd.val,
});
item.brd.stype = 4;
item.brd.rot = [0.15, 0.25, 0.05, 0.15];
item.brd.use = eatUse(2);
item.brd.onChange = function (x, y) {
  if (y) return [item.spb, x];
  giveItem(item.spb, x);
};

item.crrt = new Item();
item.crrt.id = 3;
item.crrt.name = i18n.t("content.item.crrt.name");
item.crrt.val = 5;
item.crrt.desc = i18n.t("content.item.crrt.desc", {
  separator: dom.dseparator,
  val: item.crrt.val,
});
item.crrt.stype = 4;
item.crrt.use = eatUse(1);
item.crrt.onGet = function () {
  if (this.amount >= 20) {
    giveRcp(rcp.bcrrt);
    this.onGet = function () {};
  }
};

item.potat = new Item();
item.potat.id = 4;
item.potat.name = i18n.t("content.item.potat.name");
item.potat.val = 7;
item.potat.desc = i18n.t("content.item.potat.desc", {
  separator: dom.dseparator,
  val: item.potat.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.eggn = new Item();
item.eggn.id = 5;
item.eggn.name = i18n.t("content.item.eggn.name");
item.eggn.val = 4;
item.eggn.desc = i18n.t("content.item.eggn.desc", {
  separator: dom.dseparator,
  val: item.eggn.val,
});
item.eggn.stype = 4;
item.eggn.use = eatUse(2);

item.mlkn = new Item();
item.mlkn.id = 6;
item.mlkn.name = i18n.t("content.item.mlkn.name");
item.mlkn.val = 8;
item.mlkn.desc = i18n.t("content.item.mlkn.desc", {
  separator: dom.dseparator,
  val: item.mlkn.val,
});
item.mlkn.stype = 4;
item.mlkn.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(2);
  global.stat.foodb++;
  this.amount--;
  dom.d5_3_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.rwmt1 = new Item();
item.rwmt1.id = 7;
item.rwmt1.name = i18n.t("content.item.rwmt1.name");
item.rwmt1.val = 11;
item.rwmt1.desc = i18n.t("content.item.rwmt1.desc", {
  separator: dom.dseparator,
  val: item.rwmt1.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};
item.rwmt1.onChange = function (x, y) {
  if (y) return [item.rtnmt, x];
  giveItem(item.rtnmt, x);
};

item.rice = new Item();
item.rice.id = 8;
item.rice.name = i18n.t("content.item.rice.name");
item.rice.val = 2;
item.rice.desc = i18n.t("content.item.rice.desc", {
  separator: dom.dseparator,
  val: item.rice.val,
});
item.rice.stype = 4;
item.rice.use = eatUse(2);

item.borc = new Item();
item.borc.id = 9;
item.borc.name = i18n.t("content.item.borc.name");
item.borc.val = 18;
item.borc.desc = i18n.t("content.item.borc.desc", {
  separator: dom.dseparator,
  val: item.borc.val,
});
item.borc.stype = 4;
item.borc.use = eatUse(3);

item.begg = new Item();
item.begg.id = 10;
item.begg.name = i18n.t("content.item.begg.name");
item.begg.val = 7;
item.begg.desc = i18n.t("content.item.begg.desc", {
  separator: dom.dseparator,
  val: item.begg.val,
});
item.begg.stype = 4;
item.begg.use = eatUse(2);

item.kit = new Item();
item.kit.id = 11;
item.kit.name = i18n.t("content.item.kit.name");
item.kit.val = 800;
item.kit.desc = i18n.t("content.item.kit.desc", {
  separator: dom.dseparator,
  val: item.kit.val,
});
item.kit.stype = 4;
item.kit.rar = 4;
item.kit.use = eatUse(390);

item.bac = new Item();
item.bac.id = 12;
item.bac.name = i18n.t("content.item.bac.name");
item.bac.val = 12;
item.bac.desc = i18n.t("content.item.bac.desc", {
  separator: dom.dseparator,
  val: item.bac.val,
});
item.bac.stype = 4;
item.bac.use = eatUse(6);

item.bgt = new Item();
item.bgt.id = 13;
item.bgt.name = i18n.t("content.item.bgt.name");
item.bgt.val = 17;
item.bgt.desc = i18n.t("content.item.bgt.desc", {
  separator: dom.dseparator,
  val: item.bgt.val,
});
item.bgt.stype = 4;
item.bgt.use = eatUse(4);

item.bhd = new Item();
item.bhd.id = 14;
item.bhd.name = i18n.t("content.item.bhd.name");
item.bhd.val = 6;
item.bhd.desc = i18n.t("content.item.bhd.desc", {
  separator: dom.dseparator,
  val: item.bhd.val,
});
item.bhd.stype = 4;
item.bhd.use = eatUse(8);

item.spb = new Item();
item.spb.id = 15;
item.spb.name = i18n.t("content.item.spb.name");
item.spb.val = 8;
item.spb.desc = i18n.t("content.item.spb.desc", {
  separator: dom.dseparator,
  val: item.spb.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wsb = new Item();
item.wsb.id = 16;
item.wsb.name = i18n.t("content.item.wsb.name");
item.wsb.val = 11;
item.wsb.desc = i18n.t("content.item.wsb.desc", {
  separator: dom.dseparator,
  val: item.wsb.val,
});
item.wsb.stype = 4;
item.wsb.use = eatUse(7);

item.onn = new Item();
item.onn.id = 17;
item.onn.name = i18n.t("content.item.onn.name");
item.onn.val = 3;
item.onn.desc = i18n.t("content.item.onn.desc", {
  separator: dom.dseparator,
  val: item.onn.val,
});
item.onn.stype = 4;
item.onn.use = eatUse(8);

item.sgr = new Item();
item.sgr.id = 18;
item.sgr.name = i18n.t("content.item.sgr.name");
item.sgr.val = 1;
item.sgr.desc = i18n.t("content.item.sgr.desc", {
  separator: dom.dseparator,
  val: item.sgr.val,
});
item.sgr.stype = 4;
item.sgr.use = eatUse(1);

item.wht = new Item();
item.wht.id = 19;
item.wht.name = i18n.t("content.item.wht.name");
item.wht.val = 1;
item.wht.desc = i18n.t("content.item.wht.desc", {
  separator: dom.dseparator,
  val: item.wht.val,
});
item.wht.stype = 4;
item.wht.use = eatUse(1);

item.tmt = new Item();
item.tmt.id = 20;
item.tmt.name = i18n.t("content.item.tmt.name");
item.tmt.val = 8;
item.tmt.desc = i18n.t("content.item.tmt.desc", {
  separator: dom.dseparator,
  val: item.tmt.val,
});
item.tmt.stype = 4;
item.tmt.use = eatUse(2);

item.cbg = new Item();
item.cbg.id = 21;
item.cbg.name = i18n.t("content.item.cbg.name");
item.cbg.val = 12;
item.cbg.desc = i18n.t("content.item.cbg.desc", {
  separator: dom.dseparator,
  val: item.cbg.val,
});
item.cbg.stype = 4;
item.cbg.use = eatUse(2);

item.mshr = new Item();
item.mshr.id = 22;
item.mshr.name = i18n.t("content.item.mshr.name");
item.mshr.val = 5;
item.mshr.desc = i18n.t("content.item.mshr.desc", {
  separator: dom.dseparator,
  val: item.mshr.val,
});
item.mshr.stype = 4;
item.mshr.use = eatUse(2);

item.bnn = new Item();
item.bnn.id = 23;
item.bnn.name = i18n.t("content.item.bnn.name");
item.bnn.val = 8;
item.bnn.desc = i18n.t("content.item.bnn.desc", {
  separator: dom.dseparator,
  val: item.bnn.val,
});
item.bnn.stype = 4;
item.bnn.use = eatUse(1);

item.wbrs = new Item();
item.wbrs.id = 24;
item.wbrs.name = i18n.t("content.item.wbrs.name");
item.wbrs.val = 7;
item.wbrs.desc = i18n.t("content.item.wbrs.desc", {
  separator: dom.dseparator,
  val: item.wbrs.val,
});
item.wbrs.stype = 4;
item.wbrs.use = eatUse(1);

item.strwb = new Item();
item.strwb.id = 25;
item.strwb.name = i18n.t("content.item.strwb.name");
item.strwb.val = 18;
item.strwb.desc = i18n.t("content.item.strwb.desc", {
  separator: dom.dseparator,
  val: item.strwb.val,
});
item.strwb.stype = 4;
item.strwb.use = eatUse(3);

item.orng = new Item();
item.orng.id = 26;
item.orng.name = i18n.t("content.item.orng.name");
item.orng.val = 9;
item.orng.desc = i18n.t("content.item.orng.desc", {
  separator: dom.dseparator,
  val: item.orng.val,
});
item.orng.stype = 4;
item.orng.use = eatUse(5);

item.ches = new Item();
item.ches.id = 27;
item.ches.name = i18n.t("content.item.ches.name");
item.ches.val = 13;
item.ches.desc = i18n.t("content.item.ches.desc", {
  separator: dom.dseparator,
  val: item.ches.val,
});
item.ches.stype = 4;
item.ches.use = eatUse(5);

item.ltcc = new Item();
item.ltcc.id = 28;
item.ltcc.name = i18n.t("content.item.ltcc.name");
item.ltcc.val = 2;
item.ltcc.desc = i18n.t("content.item.ltcc.desc", {
  separator: dom.dseparator,
  val: item.ltcc.val,
});
item.ltcc.stype = 4;
item.ltcc.use = eatUse(2);

item.brly = new Item();
item.brly.id = 29;
item.brly.name = i18n.t("content.item.brly.name");
item.brly.val = 2;
item.brly.desc = i18n.t("content.item.brly.desc", {
  separator: dom.dseparator,
  val: item.brly.val,
});
item.brly.stype = 4;
item.brly.use = eatUse(1);

item.grlc = new Item();
item.grlc.id = 30;
item.grlc.name = i18n.t("content.item.grlc.name");
item.grlc.val = 6;
item.grlc.desc = i18n.t("content.item.grlc.desc", {
  separator: dom.dseparator,
  val: item.grlc.val,
});
item.grlc.stype = 4;
item.grlc.use = eatUse(9);

item.pmpk = new Item();
item.pmpk.id = 31;
item.pmpk.name = i18n.t("content.item.pmpk.name");
item.pmpk.val = 12;
item.pmpk.desc = i18n.t("content.item.pmpk.desc", {
  separator: dom.dseparator,
  val: item.pmpk.val,
});
item.pmpk.stype = 4;
item.pmpk.use = eatUse(3);

item.lmn = new Item();
item.lmn.id = 32;
item.lmn.name = i18n.t("content.item.lmn.name");
item.lmn.val = 8;
item.lmn.desc = i18n.t("content.item.lmn.desc", {
  separator: dom.dseparator,
  val: item.lmn.val,
});
item.lmn.stype = 4;
item.lmn.use = eatUse(10);

item.grp = new Item();
item.grp.id = 33;
item.grp.name = i18n.t("content.item.grp.name");
item.grp.val = 8;
item.grp.desc = i18n.t("content.item.grp.desc", {
  separator: dom.dseparator,
  val: item.grp.val,
});
item.grp.stype = 4;
item.grp.use = eatUse(2);

item.pnpl = new Item();
item.pnpl.id = 34;
item.pnpl.name = i18n.t("content.item.pnpl.name");
item.pnpl.val = 12;
item.pnpl.desc = i18n.t("content.item.pnpl.desc", {
  separator: dom.dseparator,
  val: item.pnpl.val,
});
item.pnpl.stype = 4;
item.pnpl.use = eatUse(3);

item.rsmt = new Item();
item.rsmt.id = 35;
item.rsmt.name = i18n.t("content.item.rsmt.name");
item.rsmt.val = 15;
item.rsmt.rot = [0.1, 0.25, 0.05, 0.15];
item.rsmt.desc = i18n.t("content.item.rsmt.desc", {
  separator: dom.dseparator,
  val: item.rsmt.val,
});
item.rsmt.stype = 4;
item.rsmt.use = eatUse(4);

item.tbrwd = new Item();
item.tbrwd.id = 36;
item.tbrwd.name = i18n.t("content.item.tbrwd.name");
item.tbrwd.val = 20;
item.tbrwd.desc = i18n.t("content.item.tbrwd.desc", {
  separator: dom.dseparator,
  val: item.tbrwd.val,
});
item.tbrwd.stype = 4;
item.tbrwd.use = eatUse(7);

item.htbrwd = new Item();
item.htbrwd.id = 37;
item.htbrwd.name = i18n.t("content.item.htbrwd.name");
item.htbrwd.val = 16;
item.htbrwd.desc = i18n.t("content.item.htbrwd.desc", {
  separator: dom.dseparator,
  val: item.htbrwd.val,
});
item.htbrwd.stype = 4;
item.htbrwd.use = eatUse(5);

item.segg = new Item();
item.segg.id = 38;
item.segg.name = i18n.t("content.item.segg.name");
item.segg.val = 20;
item.segg.desc = i18n.t("content.item.segg.desc", {
  separator: dom.dseparator,
  val: item.segg.val,
});
item.segg.stype = 4;
item.segg.use = eatUse(7);

item.irntl = new Item();
item.irntl.id = 39;
item.irntl.name = i18n.t("content.item.irntl.name");
item.irntl.val = 31;
item.irntl.desc = i18n.t("content.item.irntl.desc", {
  separator: dom.dseparator,
  val: item.irntl.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wine1 = new Item();
item.wine1.id = 40;
item.wine1.name = i18n.t("content.item.wine1.name");
item.wine1.val = 12;
item.wine1.desc = i18n.t("content.item.wine1.desc", {
  separator: dom.dseparator,
  val: item.wine1.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wines1 = new Item();
item.wines1.id = 41;
item.wines1.name = i18n.t("content.item.wines1.name");
item.wines1.val = 100;
item.wines1.desc = i18n.t("content.item.wines1.desc", {
  separator: dom.dseparator,
  val: item.wines1.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wines2 = new Item();
item.wines2.id = 42;
item.wines2.name = i18n.t("content.item.wines2.name");
item.wines2.val = 100;
item.wines2.desc = i18n.t("content.item.wines2.desc", {
  separator: dom.dseparator,
  val: item.wines2.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wines3 = new Item();
item.wines3.id = 43;
item.wines3.name = i18n.t("content.item.wines3.name");
item.wines3.val = 100;
item.wines3.desc = i18n.t("content.item.wines3.desc", {
  separator: dom.dseparator,
  val: item.wines3.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wines4 = new Item();
item.wines4.id = 44;
item.wines4.name = i18n.t("content.item.wines4.name");
item.wines4.val = 100;
item.wines4.desc = i18n.t("content.item.wines4.desc", {
  separator: dom.dseparator,
  val: item.wines4.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wines5 = new Item();
item.wines5.id = 45;
item.wines5.name = i18n.t("content.item.wines5.name");
item.wines5.val = 100;
item.wines5.desc = i18n.t("content.item.wines5.desc", {
  separator: dom.dseparator,
  val: item.wines5.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.acrn = new Item();
item.acrn.id = 46;
item.acrn.name = i18n.t("content.item.acrn.name");
item.acrn.val = 4;
item.acrn.desc = i18n.t("content.item.acrn.desc", {
  separator: dom.dseparator,
  val: item.acrn.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.wine2 = new Item();
item.wine2.id = 47;
item.wine2.name = i18n.t("content.item.wine2.name");
item.wine2.val = 24;
item.wine2.desc = i18n.t("content.item.wine2.desc", {
  separator: dom.dseparator,
  val: item.wine2.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.winec1 = new Item();
item.winec1.id = 48;
item.winec1.name = i18n.t("content.item.winec1.name");
item.winec1.val = 8;
item.winec1.desc = i18n.t("content.item.winec1.desc", {
  separator: dom.dseparator,
  val: item.winec1.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.winec2 = new Item();
item.winec2.id = 49;
item.winec2.name = i18n.t("content.item.winec2.name");
item.winec2.val = 12;
item.winec2.desc = i18n.t("content.item.winec2.desc", {
  separator: dom.dseparator,
  val: item.winec2.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
  if (effect.drunk.active === false) giveEff(you, effect.drunk, 60);
  else effect.drunk.duration += 35;
};

item.ske = new Item();
item.ske.id = 50;
item.ske.name = i18n.t("content.item.ske.name");
item.ske.val = 31;
item.ske.desc = i18n.t("content.item.ske.desc", {
  separator: dom.dseparator,
  val: item.ske.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.pske = new Item();
item.pske.id = 51;
item.pske.name = i18n.t("content.item.pske.name");
item.pske.val = 51;
item.pske.desc = i18n.t("content.item.pske.desc", {
  separator: dom.dseparator,
  val: item.pske.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.cbun1 = new Item();
item.cbun1.id = 52;
item.cbun1.name = i18n.t("content.item.cbun1.name");
item.cbun1.val = 19;
item.cbun1.desc = i18n.t("content.item.cbun1.desc", {
  separator: dom.dseparator,
  val: item.cbun1.val,
});
item.cbun1.stype = 4;
item.cbun1.use = eatUse(4);

item.cbun2 = new Item();
item.cbun2.id = 53;
item.cbun2.name = i18n.t("content.item.cbun2.name");
item.cbun2.val = 29;
item.cbun2.desc = i18n.t("content.item.cbun2.desc", {
  separator: dom.dseparator,
  val: item.cbun2.val,
});
item.cbun2.stype = 4;
item.cbun2.use = eatUse(6);

item.cbun3 = new Item();
item.cbun3.id = 54;
item.cbun3.name = i18n.t("content.item.cbun3.name");
item.cbun3.val = 34;
item.cbun3.desc = i18n.t("content.item.cbun3.desc", {
  separator: dom.dseparator,
  val: item.cbun3.val,
});
item.cbun3.stype = 4;
item.cbun3.rar = 2;
item.cbun3.use = eatUse(8);

item.scak = new Item();
item.scak.id = 55;
item.scak.name = i18n.t("content.item.scak.name");
item.scak.val = 39;
item.scak.desc = i18n.t("content.item.scak.desc", {
  separator: dom.dseparator,
  val: item.scak.val,
});
item.scak.stype = 4;
item.scak.use = eatUse(13);

item.atrt = new Item();
item.atrt.id = 56;
item.atrt.name = i18n.t("content.item.atrt.name");
item.atrt.val = 29;
item.atrt.desc = i18n.t("content.item.atrt.desc", {
  separator: dom.dseparator,
  val: item.atrt.val,
});
item.atrt.stype = 4;
item.atrt.use = eatUse(8);

item.strt = new Item();
item.strt.id = 57;
item.strt.name = i18n.t("content.item.strt.name");
item.strt.val = 38;
item.strt.desc = i18n.t("content.item.strt.desc", {
  separator: dom.dseparator,
  val: item.strt.val,
});
item.strt.stype = 4;
item.strt.rar = 2;
item.strt.use = eatUse(10);

item.ccak = new Item();
item.ccak.id = 58;
item.ccak.name = i18n.t("content.item.ccak.name");
item.ccak.val = 52;
item.ccak.desc = i18n.t("content.item.ccak.desc", {
  separator: dom.dseparator,
  val: item.ccak.val,
});
item.ccak.stype = 4;
item.ccak.rar = 2;
item.ccak.use = eatUse(15);

item.icrm = new Item();
item.icrm.id = 59;
item.icrm.name = i18n.t("content.item.icrm.name");
item.icrm.val = 19;
item.icrm.desc = i18n.t("content.item.icrm.desc", {
  separator: dom.dseparator,
  val: item.icrm.val,
});
item.icrm.stype = 4;
item.icrm.use = eatUse(8);

item.lnch1 = new Item();
item.lnch1.id = 60;
item.lnch1.name = i18n.t("content.item.lnch1.name");
item.lnch1.val = 40;
item.lnch1.desc = i18n.t("content.item.lnch1.desc", {
  separator: dom.dseparator,
  val: item.lnch1.val,
});
item.lnch1.stype = 4;
item.lnch1.use = eatUse(12);

item.lnch2 = new Item();
item.lnch2.id = 61;
item.lnch2.name = i18n.t("content.item.lnch2.name");
item.lnch2.val = 47;
item.lnch2.desc = i18n.t("content.item.lnch2.desc", {
  separator: dom.dseparator,
  val: item.lnch2.val,
});
item.lnch2.stype = 4;
item.lnch2.rar = 2;
item.lnch2.use = eatUse(15);

item.lnch3 = new Item();
item.lnch3.id = 62;
item.lnch3.name = i18n.t("content.item.lnch3.name");
item.lnch3.val = 58;
item.lnch3.desc = i18n.t("content.item.lnch3.desc", {
  separator: dom.dseparator,
  val: item.lnch3.val,
});
item.lnch3.stype = 4;
item.lnch3.rar = 2;
item.lnch3.use = eatUse(22);

item.orgs = new Item();
item.orgs.id = 63;
item.orgs.name = i18n.t("content.item.orgs.name");
item.orgs.val = 20;
item.orgs.desc = i18n.t("content.item.orgs.desc", {
  separator: dom.dseparator,
  val: item.orgs.val,
});
item.orgs.stype = 4;
item.orgs.use = eatUse(7);

item.fsh1 = new Item();
item.fsh1.id = 65;
item.fsh1.name = i18n.t("content.item.fsh1.name");
item.fsh1.val = 15;
item.fsh1.desc = i18n.t("content.item.fsh1.desc", {
  separator: dom.dseparator,
  val: item.fsh1.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.fsh2 = new Item();
item.fsh2.id = 66;
item.fsh2.name = i18n.t("content.item.fsh2.name");
item.fsh2.val = 6;
item.fsh2.desc = i18n.t("content.item.fsh2.desc", {
  separator: dom.dseparator,
  val: item.fsh2.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.ffsh1 = new Item();
item.ffsh1.id = 67;
item.ffsh1.name = i18n.t("content.item.ffsh1.name");
item.ffsh1.val = 19;
item.ffsh1.desc = i18n.t("content.item.ffsh1.desc", {
  separator: dom.dseparator,
  val: item.ffsh1.val,
});
item.ffsh1.stype = 4;
item.ffsh1.use = eatUse(4);

item.ffsh2 = new Item();
item.ffsh2.id = 68;
item.ffsh2.name = i18n.t("content.item.ffsh2.name");
item.ffsh2.val = 42;
item.ffsh2.desc = i18n.t("content.item.ffsh2.desc", {
  separator: dom.dseparator,
  val: item.ffsh2.val,
});
item.ffsh2.stype = 4;
item.ffsh2.rar = 2;
item.ffsh2.use = eatUse(10);

item.ssm = new Item();
item.ssm.id = 69;
item.ssm.name = i18n.t("content.item.ssm.name");
item.ssm.val = 17;
item.ssm.desc = i18n.t("content.item.ssm.desc", {
  separator: dom.dseparator,
  val: item.ssm.val,
});
item.ssm.stype = 4;
item.ssm.rar = 2;
item.ssm.use = eatUse(8);

item.dssm = new Item();
item.dssm.id = 70;
item.dssm.name = i18n.t("content.item.dssm.name");
item.dssm.val = 43; // fish soy cucum lettuc
item.dssm.desc = i18n.t("content.item.dssm.desc", {
  separator: dom.dseparator,
  val: item.dssm.val,
});
item.dssm.stype = 4;
item.dssm.rar = 2;
item.dssm.use = eatUse(15);

item.mkzs = new Item();
item.mkzs.id = 71;
item.mkzs.name = i18n.t("content.item.mkzs.name");
item.mkzs.val = 35;
item.mkzs.desc = i18n.t("content.item.mkzs.desc", {
  separator: dom.dseparator,
  val: item.mkzs.val,
});
item.mkzs.stype = 4;
item.mkzs.rar = 2;
item.mkzs.use = eatUse(17);

item.nori = new Item();
item.nori.id = 72;
item.nori.name = i18n.t("content.item.nori.name");
item.nori.val = 10;
item.nori.desc = i18n.t("content.item.nori.desc", {
  separator: dom.dseparator,
  val: item.nori.val,
});
item.nori.stype = 4;
item.nori.use = eatUse(3);

item.fnori = new Item();
item.fnori.id = 73;
item.fnori.name = i18n.t("content.item.fnori.name");
item.fnori.val = 20;
item.fnori.desc = i18n.t("content.item.fnori.desc", {
  separator: dom.dseparator,
  val: item.fnori.val,
});
item.fnori.stype = 4;
item.fnori.use = eatUse(7);

item.swtch1 = new Item();
item.swtch1.id = 74;
item.swtch1.name = i18n.t("content.item.swtch1.name");
item.swtch1.val = 40;
item.swtch1.desc = i18n.t("content.item.swtch1.desc", {
  separator: dom.dseparator,
  val: item.swtch1.val,
});
item.swtch1.stype = 4;
item.swtch1.use = eatUse(5);

item.jll = new Item();
item.jll.id = 75;
item.jll.name = i18n.t("content.item.jll.name");
item.jll.val = 6;
item.jll.desc = i18n.t("content.item.jll.desc", {
  separator: dom.dseparator,
  val: item.jll.val,
});
item.jll.stype = 4;
item.jll.use = eatUse(4);

item.flr = new Item();
item.flr.id = 76;
item.flr.name = i18n.t("content.item.flr.name");
item.flr.val = 1;
item.flr.desc = i18n.t("content.item.flr.desc", {
  separator: dom.dseparator,
  val: item.flr.val,
});
item.flr.stype = 4;
item.flr.use = eatUse(2);

item.pcns = new Item();
item.pcns.id = 77;
item.pcns.name = i18n.t("content.item.pcns.name");
item.pcns.val = 4;
item.pcns.desc = i18n.t("content.item.pcns.desc", {
  separator: dom.dseparator,
  val: item.pcns.val,
});
item.pcns.stype = 4;
item.pcns.use = eatUse(2);

item.dgh = new Item();
item.dgh.id = 78;
item.dgh.name = i18n.t("content.item.dgh.name");
item.dgh.val = 4;
item.dgh.desc = i18n.t("content.item.dgh.desc", {
  separator: dom.dseparator,
  val: item.dgh.val,
});
item.dgh.stype = 4;
item.dgh.use = eatUse(3);

item.hzlnt = new Item();
item.hzlnt.id = 79;
item.hzlnt.name = i18n.t("content.item.hzlnt.name");
item.hzlnt.val = 6;
item.hzlnt.desc = i18n.t("content.item.hzlnt.desc", {
  separator: dom.dseparator,
  val: item.hzlnt.val,
});
item.hzlnt.stype = 4;
item.hzlnt.use = eatUse(2);

item.hpck = new Item();
item.hpck.id = 80;
item.hpck.name = i18n.t("content.item.hpck.name");
item.hpck.val = 33;
item.hpck.desc = i18n.t("content.item.hpck.desc", {
  separator: dom.dseparator,
  val: item.hpck.val,
});
item.hpck.stype = 4;
item.hpck.rar = 2;
item.hpck.use = eatUse(6);

item.dfrt = new Item();
item.dfrt.id = 81;
item.dfrt.name = i18n.t("content.item.dfrt.name");
item.dfrt.val = 12;
item.dfrt.desc = i18n.t("content.item.dfrt.desc", {
  separator: dom.dseparator,
  val: item.dfrt.val,
});
item.dfrt.stype = 4;
item.dfrt.use = eatUse(2);

item.brdb = new Item();
item.brdb.id = 82;
item.brdb.name = i18n.t("content.item.brdb.name");
item.brdb.val = 4;
item.brdb.desc = i18n.t("content.item.brdb.desc", {
  separator: dom.dseparator,
  val: item.brdb.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.spcn = new Item();
item.spcn.id = 83; //Pukusakina
item.spcn.name = i18n.t("content.item.spcn.name");
item.spcn.val = 5;
item.spcn.desc = i18n.t("content.item.spcn.desc", {
  separator: dom.dseparator,
  val: item.spcn.val,
});
item.spcn.stype = 4;
item.spcn.use = eatUse(2);

item.hney = new Item();
item.hney.id = 84;
item.hney.name = i18n.t("content.item.hney.name");
item.hney.val = 11;
item.hney.desc = i18n.t("content.item.hney.desc", {
  separator: dom.dseparator,
  val: item.hney.val,
});
item.hney.stype = 4;
item.hney.use = eatUse(2);

item.brise = new Item();
item.brise.id = 85;
item.brise.name = i18n.t("content.item.brise.name");
item.brise.val = 8;
item.brise.desc = i18n.t("content.item.brise.desc", {
  separator: dom.dseparator,
  val: item.brise.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.steak = new Item();
item.steak.id = 86;
item.steak.name = i18n.t("content.item.steak.name");
item.steak.val = 50;
item.steak.desc = i18n.t("content.item.steak.desc", {
  separator: dom.dseparator,
  val: item.steak.val,
});
item.steak.stype = 4;
item.steak.rar = 2;
item.steak.use = eatUse(15);

item.spc1 = new Item();
item.spc1.id = 87;
item.spc1.name = i18n.t("content.item.spc1.name");
item.spc1.val = 2;
item.spc1.desc = i18n.t("content.item.spc1.desc", {
  separator: dom.dseparator,
  val: item.spc1.val,
});
item.spc1.stype = 4;
item.spc1.rar = 2;
item.spc1.use = eatUse(7);

item.cnmn = new Item();
item.cnmn.id = 88;
item.cnmn.name = i18n.t("content.item.cnmn.name");
item.cnmn.val = 3;
item.cnmn.desc = i18n.t("content.item.cnmn.desc", {
  separator: dom.dseparator,
  val: item.cnmn.val,
});
item.cnmn.stype = 4;
item.cnmn.use = eatUse(6);

item.bttr = new Item();
item.bttr.id = 89;
item.bttr.name = i18n.t("content.item.bttr.name");
item.bttr.val = 8;
item.bttr.desc = i18n.t("content.item.bttr.desc", {
  separator: dom.dseparator,
  val: item.bttr.val,
});
item.bttr.stype = 4;
item.bttr.use = eatUse(3);

item.cnmnb = new Item();
item.cnmnb.id = 90;
item.cnmnb.name = i18n.t("content.item.cnmnb.name");
item.cnmnb.val = 36;
item.cnmnb.desc = i18n.t("content.item.cnmnb.desc", {
  separator: dom.dseparator,
  val: item.cnmnb.val,
});
item.cnmnb.stype = 4;
item.cnmnb.rar = 2;
item.cnmnb.use = eatUse(9);

item.brth = new Item();
item.brth.id = 91;
item.brth.name = i18n.t("content.item.brth.name");
item.brth.val = 16;
item.brth.desc = i18n.t("content.item.brth.desc", {
  separator: dom.dseparator,
  val: item.brth.val,
});
item.brth.stype = 4;
item.brth.use = eatUse(4);

item.eggsp = new Item();
item.eggsp.id = 92;
item.eggsp.name = i18n.t("content.item.eggsp.name");
item.eggsp.val = 46;
item.eggsp.desc = i18n.t("content.item.eggsp.desc", {
  separator: dom.dseparator,
  val: item.eggsp.val,
});
item.eggsp.stype = 4;
item.eggsp.rar = 2;
item.eggsp.use = eatUse(10);

item.scln = new Item();
item.scln.id = 93;
item.scln.name = i18n.t("content.item.scln.name");
item.scln.val = 4;
item.scln.desc = i18n.t("content.item.scln.desc", {
  separator: dom.dseparator,
  val: item.scln.val,
});
item.scln.stype = 4;
item.scln.use = eatUse(10);

item.crmchd = new Item();
item.crmchd.id = 94;
item.crmchd.name = i18n.t("content.item.crmchd.name");
item.crmchd.val = 62;
item.crmchd.desc = i18n.t("content.item.crmchd.desc", {
  separator: dom.dseparator,
  val: item.crmchd.val,
});
item.crmchd.stype = 4;
item.crmchd.rar = 2;
item.crmchd.use = eatUse(10);

item.chklt = new Item();
item.chklt.id = 95;
item.chklt.name = i18n.t("content.item.chklt.name");
item.chklt.val = 9;
item.chklt.desc = i18n.t("content.item.chklt.desc", {
  separator: dom.dseparator,
  val: item.chklt.val,
});
item.chklt.stype = 4;
item.chklt.use = eatUse(3);

item.fegg = new Item();
item.fegg.id = 96;
item.fegg.name = i18n.t("content.item.fegg.name");
item.fegg.val = 9;
item.fegg.desc = i18n.t("content.item.fegg.desc", {
  separator: dom.dseparator,
  val: item.fegg.val,
});
item.fegg.stype = 4;
item.fegg.use = eatUse(2);

item.crn = new Item();
item.crn.id = 97;
item.crn.name = i18n.t("content.item.crn.name");
item.crn.val = 3;
item.crn.desc = i18n.t("content.item.crn.desc", {
  separator: dom.dseparator,
  val: item.crn.val,
});
item.crn.stype = 4;
item.crn.use = eatUse(5);

item.bcrn = new Item();
item.bcrn.id = 98;
item.bcrn.name = i18n.t("content.item.bcrn.name");
item.bcrn.val = 25;
item.bcrn.desc = i18n.t("content.item.bcrn.desc", {
  separator: dom.dseparator,
  val: item.bcrn.val,
});
item.bcrn.stype = 4;
item.bcrn.use = eatUse(6);

item.pcrn = new Item();
item.pcrn.id = 99;
item.pcrn.name = i18n.t("content.item.pcrn.name");
item.pcrn.val = 10;
item.pcrn.desc = i18n.t("content.item.pcrn.desc", {
  separator: dom.dseparator,
  val: item.pcrn.val,
});
item.pcrn.stype = 4;
item.pcrn.use = eatUse(2);

item.cpcrn = new Item();
item.cpcrn.id = 100;
item.cpcrn.name = i18n.t("content.item.cpcrn.name");
item.cpcrn.val = 15;
item.cpcrn.desc = i18n.t("content.item.cpcrn.desc", {
  separator: dom.dseparator,
  val: item.cpcrn.val,
});
item.cpcrn.stype = 4;
item.cpcrn.use = eatUse(4);

item.fbrd = new Item();
item.fbrd.id = 101;
item.fbrd.name = i18n.t("content.item.fbrd.name");
item.fbrd.val = 12;
item.fbrd.desc = i18n.t("content.item.fbrd.desc", {
  separator: dom.dseparator,
  val: item.fbrd.val,
});
item.fbrd.stype = 4;
item.fbrd.use = eatUse(2);

item.gcce = new Item();
item.gcce.id = 102;
item.gcce.name = i18n.t("content.item.gcce.name");
item.gcce.val = 25;
item.gcce.desc = i18n.t("content.item.gcce.desc", {
  separator: dom.dseparator,
  val: item.gcce.val,
});
item.gcce.stype = 4;
item.gcce.rar = 2;
item.gcce.use = eatUse(5);

item.bcrc = new Item();
item.bcrc.id = 103;
item.bcrc.name = i18n.t("content.item.bcrc.name");
item.bcrc.val = 12;
item.bcrc.desc = i18n.t("content.item.bcrc.desc", {
  separator: dom.dseparator,
  val: item.bcrc.val,
});
item.bcrc.stype = 4;
item.bcrc.use = eatUse(3);

item.snkb = new Item();
item.snkb.id = 104;
item.snkb.name = i18n.t("content.item.snkb.name");
item.snkb.val = 30;
item.snkb.desc = i18n.t("content.item.snkb.desc", {
  separator: dom.dseparator,
  val: item.snkb.val,
});
item.snkb.stype = 4;
item.snkb.use = eatUse(5);

item.dmtp = new Item();
item.dmtp.id = 105;
item.dmtp.name = i18n.t("content.item.dmtp.name");
item.dmtp.val = 60;
item.dmtp.desc = i18n.t("content.item.dmtp.desc", {
  separator: dom.dseparator,
  val: item.dmtp.val,
});
item.dmtp.rar = 2;
item.dmtp.stype = 4;
item.dmtp.use = eatUse(41);

item.lkmc = new Item();
item.lkmc.id = 106;
item.lkmc.name = i18n.t("content.item.lkmc.name");
item.lkmc.val = 29;
item.lkmc.desc = i18n.t("content.item.lkmc.desc", {
  separator: dom.dseparator,
  val: item.lkmc.val,
});
item.lkmc.stype = 4;
item.lkmc.use = eatUse(4);

item.vgsn = new Item();
item.vgsn.id = 107;
item.vgsn.name = i18n.t("content.item.vgsn.name");
item.vgsn.val = 35;
item.vgsn.desc = i18n.t("content.item.vgsn.desc", {
  separator: dom.dseparator,
  val: item.vgsn.val,
});
item.vgsn.stype = 4;
item.vgsn.use = eatUse(9);

item.stgp = new Item();
item.stgp.id = 108;
item.stgp.name = i18n.t("content.item.stgp.name");
item.stgp.val = 55;
item.stgp.desc = i18n.t("content.item.stgp.desc", {
  separator: dom.dseparator,
  val: item.stgp.val,
});
item.stgp.stype = 4;
item.stgp.use = eatUse(18);

item.tdpps = new Item();
item.tdpps.id = 109;
item.tdpps.name = i18n.t("content.item.tdpps.name");
item.tdpps.val = 33;
item.tdpps.desc = i18n.t("content.item.tdpps.desc", {
  separator: dom.dseparator,
  val: item.tdpps.val,
});
item.tdpps.stype = 4;
item.tdpps.use = eatUse(4);

item.chstn = new Item();
item.chstn.id = 110;
item.chstn.name = i18n.t("content.item.chstn.name");
item.chstn.val = 5;
item.chstn.desc = i18n.t("content.item.chstn.desc", {
  separator: dom.dseparator,
  val: item.chstn.val,
});
item.chstn.stype = 4;
item.chstn.use = eatUse(1);

item.prfd = new Item();
item.prfd.id = 111;
item.prfd.name = i18n.t("content.item.prfd.name");
item.prfd.val = 22;
item.prfd.desc = i18n.t("content.item.prfd.desc", {
  separator: dom.dseparator,
  val: item.prfd.val,
});
item.prfd.stype = 4;
item.prfd.rar = 0;
item.prfd.use = eatUse(8);

item.brmt = new Item();
item.brmt.id = 112;
item.brmt.name = i18n.t("content.item.brmt.name");
item.brmt.val = 7;
item.brmt.desc = i18n.t("content.item.brmt.desc", {
  separator: dom.dseparator,
  val: item.brmt.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.mbsps = new Item();
item.mbsps.id = 113;
item.mbsps.name = i18n.t("content.item.mbsps.name");
item.mbsps.val = 52;
item.mbsps.desc = i18n.t("content.item.mbsps.desc", {
  separator: dom.dseparator,
  val: item.mbsps.val,
});
item.mbsps.stype = 4;
item.mbsps.use = eatUse(66);

item.spgt = new Item();
item.spgt.id = 114;
item.spgt.name = i18n.t("content.item.spgt.name");
item.spgt.val = 33;
item.spgt.desc = i18n.t("content.item.spgt.desc", {
  separator: dom.dseparator,
  val: item.spgt.val,
});
item.spgt.stype = 4;
item.spgt.use = eatUse(5);

item.mnj1 = new Item();
item.mnj1.id = 115;
item.mnj1.name = i18n.t("content.item.mnj1.name");
item.mnj1.val = 26;
item.mnj1.desc = i18n.t("content.item.mnj1.desc", {
  separator: dom.dseparator,
  val: item.mnj1.val,
});
item.mnj1.stype = 4;
item.mnj1.use = eatUse(4);

item.mnj2 = new Item();
item.mnj2.id = 116;
item.mnj2.name = i18n.t("content.item.mnj2.name");
item.mnj2.val = 38;
item.mnj2.desc = i18n.t("content.item.mnj2.desc", {
  separator: dom.dseparator,
  val: item.mnj2.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.ntea1 = new Item();
item.ntea1.id = 117;
item.ntea1.name = i18n.t("content.item.ntea1.name");
item.ntea1.val = 26;
item.ntea1.desc = i18n.t("content.item.ntea1.desc", {
  separator: dom.dseparator,
  val: item.ntea1.val,
});
item.ntea1.rar = 2;
item.ntea1.stype = 4;
item.ntea1.use = eatUse(3);

item.jrk1 = new Item();
item.jrk1.id = 118;
item.jrk1.name = i18n.t("content.item.jrk1.name");
item.jrk1.val = 18;
item.jrk1.desc = i18n.t("content.item.jrk1.desc", {
  separator: dom.dseparator,
  val: item.jrk1.val,
});
item.jrk1.stype = 4;
item.jrk1.use = eatUse(2);

item.jrk2 = new Item();
item.jrk2.id = 119;
item.jrk2.name = i18n.t("content.item.jrk2.name");
item.jrk2.val = 30;
item.jrk2.desc = i18n.t("content.item.jrk2.desc", {
  separator: dom.dseparator,
  val: item.jrk2.val,
});
item.jrk2.stype = 4;
item.jrk2.use = eatUse(5);

item.ongr = new Item();
item.ongr.id = 120;
item.ongr.name = i18n.t("content.item.ongr.name");
item.ongr.val = 25;
item.ongr.desc = i18n.t("content.item.ongr.desc", {
  separator: dom.dseparator,
  val: item.ongr.val,
});
item.ongr.stype = 4;
item.ongr.use = eatUse(2);

item.rbmb = new Item();
item.rbmb.id = 121;
item.rbmb.name = i18n.t("content.item.rbmb.name");
item.rbmb.val = 33;
item.rbmb.desc = i18n.t("content.item.rbmb.desc", {
  separator: dom.dseparator,
  val: item.rbmb.val,
});
item.rbmb.stype = 4;
item.rbmb.use = eatUse(4);

item.mchii = new Item();
item.mchii.id = 122;
item.mchii.name = i18n.t("content.item.mchii.name");
item.mchii.val = 22;
item.mchii.desc = i18n.t("content.item.mchii.desc", {
  separator: dom.dseparator,
  val: item.mchii.val,
});
item.mchii.stype = 4;
item.mchii.use = eatUse(8);

item.mchai = new Item();
item.mchai.id = 123;
item.mchai.name = i18n.t("content.item.mchai.name");
item.mchai.val = 29;
item.mchai.desc = i18n.t("content.item.mchai.desc", {
  separator: dom.dseparator,
  val: item.mchai.val,
});
item.mchai.stype = 4;
item.mchai.use = eatUse(12);

item.igum = new Item();
item.igum.id = 124;
item.igum.name = i18n.t("content.item.igum.name");
item.igum.val = 17;
item.igum.desc = i18n.t("content.item.igum.desc", {
  separator: dom.dseparator,
  val: item.igum.val,
});
item.igum.stype = 4;
item.igum.use = eatUse(3);

item.msoop = new Item();
item.msoop.id = 125;
item.msoop.name = i18n.t("content.item.msoop.name");
item.msoop.val = 37;
item.msoop.desc = i18n.t("content.item.msoop.desc", {
  separator: dom.dseparator,
  val: item.msoop.val,
});
item.msoop.stype = 4;
item.msoop.use = eatUse(4);

item.rmn1 = new Item();
item.rmn1.id = 126;
item.rmn1.name = i18n.t("content.item.rmn1.name");
item.rmn1.val = 41;
item.rmn1.desc = i18n.t("content.item.rmn1.desc", {
  separator: dom.dseparator,
  val: item.rmn1.val,
});
item.rmn1.stype = 4;
item.rmn1.use = eatUse(6);

item.rmn2 = new Item();
item.rmn2.id = 127;
item.rmn2.name = i18n.t("content.item.rmn2.name");
item.rmn2.val = 44;
item.rmn2.desc = i18n.t("content.item.rmn2.desc", {
  separator: dom.dseparator,
  val: item.rmn2.val,
});
item.rmn2.stype = 4;
item.rmn2.use = eatUse(5);

item.rmn3 = new Item();
item.rmn3.id = 128;
item.rmn3.name = i18n.t("content.item.rmn3.name");
item.rmn3.val = 48;
item.rmn3.desc = i18n.t("content.item.rmn3.desc", {
  separator: dom.dseparator,
  val: item.rmn3.val,
});
item.rmn3.stype = 4;
item.rmn3.use = eatUse(9);

item.sqdyak = new Item();
item.sqdyak.id = 129;
item.sqdyak.name = i18n.t("content.item.sqdyak.name");
item.sqdyak.val = 43;
item.sqdyak.desc = i18n.t("content.item.sqdyak.desc", {
  separator: dom.dseparator,
  val: item.sqdyak.val,
});
item.sqdyak.stype = 4;
item.sqdyak.use = eatUse(7);

item.mtbeer = new Item();
item.mtbeer.id = 130;
item.mtbeer.name = i18n.t("content.item.mtbeer.name");
item.mtbeer.val = 18;
item.mtbeer.desc = i18n.t("content.item.mtbeer.desc", {
  separator: dom.dseparator,
  val: item.mtbeer.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.dbeer = new Item();
item.dbeer.id = 131;
item.dbeer.name = i18n.t("content.item.dbeer.name");
item.dbeer.val = 15;
item.dbeer.desc = i18n.t("content.item.dbeer.desc", {
  separator: dom.dseparator,
  val: item.dbeer.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.ootee = new Item();
item.ootee.id = 132;
item.ootee.name = i18n.t("content.item.ootee.name");
item.ootee.val = 25;
item.ootee.desc = i18n.t("content.item.ootee.desc", {
  separator: dom.dseparator,
  val: item.ootee.val,
});
item.ootee.stype = 4;
item.ootee.use = function () {
  you.sat + this.val > you.satmax
    ? (you.sat = you.satmax)
    : (you.sat += this.val);
  skl.glt.use(3);
  global.stat.foodb++;
  this.amount--;
  dom.d5_3_1.update();
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.krcsal = new Item();
item.krcsal.id = 133;
item.krcsal.name = i18n.t("content.item.krcsal.name");
item.krcsal.val = 49;
item.krcsal.desc = i18n.t("content.item.krcsal.desc", {
  separator: dom.dseparator,
  val: item.krcsal.val,
});
item.krcsal.stype = 4;
item.krcsal.use = eatUse(6);

item.emdm = new Item();
item.emdm.id = 134;
item.emdm.name = i18n.t("content.item.emdm.name");
item.emdm.val = 21;
item.emdm.desc = i18n.t("content.item.emdm.desc", {
  separator: dom.dseparator,
  val: item.emdm.val,
});
item.emdm.stype = 4;
item.emdm.use = eatUse(2);

item.skplt = new Item();
item.skplt.id = 135;
item.skplt.name = i18n.t("content.item.skplt.name");
item.skplt.val = 61;
item.skplt.desc = i18n.t("content.item.skplt.desc", {
  separator: dom.dseparator,
  val: item.skplt.val,
});
item.skplt.stype = 4;
item.skplt.rar = 2;
item.skplt.use = eatUse(10);

item.skwre = new Item();
item.skwre.id = 136;
item.skwre.name = i18n.t("content.item.skwre.name");
item.skwre.val = 39;
item.skwre.desc = i18n.t("content.item.skwre.desc", {
  separator: dom.dseparator,
  val: item.skwre.val,
});
item.skwre.stype = 4;
item.skwre.use = eatUse(7);

item.smfro = new Item();
item.smfro.id = 137;
item.smfro.name = i18n.t("content.item.smfro.name");
item.smfro.val = 34;
item.smfro.desc = i18n.t("content.item.smfro.desc", {
  separator: dom.dseparator,
  val: item.smfro.val,
});
item.smfro.stype = 4;
item.smfro.use = eatUse(6);

item.fsqdnr = new Item();
item.fsqdnr.id = 138;
item.fsqdnr.name = i18n.t("content.item.fsqdnr.name");
item.fsqdnr.val = 44;
item.fsqdnr.desc = i18n.t("content.item.fsqdnr.desc", {
  separator: dom.dseparator,
  val: item.fsqdnr.val,
});
item.fsqdnr.stype = 4;
item.fsqdnr.use = eatUse(6);

item.sltyak = new Item();
item.sltyak.id = 139;
item.sltyak.name = i18n.t("content.item.sltyak.name");
item.sltyak.val = 39;
item.sltyak.desc = i18n.t("content.item.sltyak.desc", {
  separator: dom.dseparator,
  val: item.sltyak.val,
});
item.sltyak.stype = 4;
item.sltyak.use = eatUse(8);

item.jcmncc = new Item();
item.jcmncc.id = 140;
item.jcmncc.name = i18n.t("content.item.jcmncc.name");
item.jcmncc.val = 45;
item.jcmncc.desc = i18n.t("content.item.jcmncc.desc", {
  separator: dom.dseparator,
  val: item.jcmncc.val,
});
item.jcmncc.stype = 4;
item.jcmncc.use = eatUse(6);

item.sbeanf = new Item();
item.sbeanf.id = 141;
item.sbeanf.name = i18n.t("content.item.sbeanf.name");
item.sbeanf.val = 37;
item.sbeanf.desc = i18n.t("content.item.sbeanf.desc", {
  separator: dom.dseparator,
  val: item.sbeanf.val,
});
item.sbeanf.stype = 4;
item.sbeanf.use = eatUse(4);

item.mgpch = new Item();
item.mgpch.id = 142;
item.mgpch.name = i18n.t("content.item.mgpch.name");
item.mgpch.val = 29;
item.mgpch.desc = i18n.t("content.item.mgpch.desc", {
  separator: dom.dseparator,
  val: item.mgpch.val,
});
item.mgpch.stype = 4;
item.mgpch.use = eatUse(3);

item.maitake = new Item();
item.maitake.id = 143;
item.maitake.name = i18n.t("content.item.maitake.name");
item.maitake.val = 7;
item.maitake.desc = i18n.t("content.item.maitake.desc", {
  separator: dom.dseparator,
  val: item.maitake.val,
});
item.maitake.stype = 4;
item.maitake.use = eatUse(2);

item.odens = new Item();
item.odens.id = 144;
item.odens.name = i18n.t("content.item.odens.name");
item.odens.val = 40;
item.odens.desc = i18n.t("content.item.odens.desc", {
  separator: dom.dseparator,
  val: item.odens.val,
});
item.odens.stype = 4;
item.odens.use = eatUse(5);

item.onign1 = new Item();
item.onign1.id = 145;
item.onign1.name = i18n.t("content.item.onign1.name");
item.onign1.val = 30;
item.onign1.desc = i18n.t("content.item.onign1.desc", {
  separator: dom.dseparator,
  val: item.onign1.val,
});
item.onign1.stype = 4;
item.onign1.use = eatUse(3);

item.onign2 = new Item();
item.onign2.id = 146;
item.onign2.name = i18n.t("content.item.onign2.name");
item.onign2.val = 36;
item.onign2.desc = i18n.t("content.item.onign2.desc", {
  separator: dom.dseparator,
  val: item.onign2.val,
});
item.onign2.stype = 4;
item.onign2.use = eatUse(4);

item.onign3 = new Item();
item.onign3.id = 147;
item.onign3.name = i18n.t("content.item.onign3.name");
item.onign3.val = 38;
item.onign3.desc = i18n.t("content.item.onign3.desc", {
  separator: dom.dseparator,
  val: item.onign3.val,
});
item.onign3.stype = 4;
item.onign3.use = eatUse(5);

item.syakis = new Item();
item.syakis.id = 148;
item.syakis.name = i18n.t("content.item.syakis.name");
item.syakis.val = 50;
item.syakis.desc = i18n.t("content.item.syakis.desc", {
  separator: dom.dseparator,
  val: item.syakis.val,
});
item.syakis.stype = 4;
item.syakis.use = eatUse(9);

item.kkbin = new Item();
item.kkbin.id = 149;
item.kkbin.name = i18n.t("content.item.kkbin.name");
item.kkbin.val = 25;
item.kkbin.desc = i18n.t("content.item.kkbin.desc", {
  separator: dom.dseparator,
  val: item.kkbin.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
  this.amount--;
};

item.blsho = new Item();
item.blsho.id = 150;
item.blsho.name = i18n.t("content.item.blsho.name");
item.blsho.val = 39;
item.blsho.desc = i18n.t("content.item.blsho.desc", {
  separator: dom.dseparator,
  val: item.blsho.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
  this.amount--;
};

item.scwhi = new Item();
item.scwhi.id = 151;
item.scwhi.name = i18n.t("content.item.scwhi.name");
item.scwhi.val = 40;
item.scwhi.desc = i18n.t("content.item.scwhi.desc", {
  separator: dom.dseparator,
  val: item.scwhi.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
  this.amount--;
};

item.cham1 = new Item();
item.cham1.id = 152;
item.cham1.name = i18n.t("content.item.cham1.name");
item.cham1.val = 45;
item.cham1.desc = i18n.t("content.item.cham1.desc", {
  separator: dom.dseparator,
  val: item.cham1.val,
});
item.cham1.stype = 4;
item.cham1.use = eatUse(8);

item.cham2 = new Item();
item.cham2.id = 153;
item.cham2.name = i18n.t("content.item.cham2.name");
item.cham2.val = 48;
item.cham2.desc = i18n.t("content.item.cham2.desc", {
  separator: dom.dseparator,
  val: item.cham2.val,
});
item.cham2.stype = 4;
item.cham2.rar = 2;
item.cham2.use = eatUse(11);

item.cham3 = new Item();
item.cham3.id = 154;
item.cham3.name = i18n.t("content.item.cham3.name");
item.cham3.val = 42;
item.cham3.desc = i18n.t("content.item.cham3.desc", {
  separator: dom.dseparator,
  val: item.cham3.val,
});
item.cham3.stype = 4;
item.cham3.use = eatUse(14);

item.cham4 = new Item();
item.cham4.id = 155;
item.cham4.name = i18n.t("content.item.cham4.name");
item.cham4.val = 26;
item.cham4.desc = i18n.t("content.item.cham4.desc", {
  separator: dom.dseparator,
  val: item.cham4.val,
});
item.cham4.stype = 4;
item.cham4.use = eatUse(7);

item.sudon1 = new Item();
item.sudon1.id = 156;
item.sudon1.name = i18n.t("content.item.sudon1.name");
item.sudon1.val = 47;
item.sudon1.desc = i18n.t("content.item.sudon1.desc", {
  separator: dom.dseparator,
  val: item.sudon1.val,
});
item.sudon1.stype = 4;
item.sudon1.use = eatUse(9);

item.sudon2 = new Item();
item.sudon2.id = 157;
item.sudon2.name = i18n.t("content.item.sudon2.name");
item.sudon2.val = 42;
item.sudon2.desc = i18n.t("content.item.sudon2.desc", {
  separator: dom.dseparator,
  val: item.sudon2.val,
});
item.sudon2.stype = 4;
item.sudon2.use = eatUse(8);

item.sudon3 = new Item();
item.sudon3.id = 158;
item.sudon3.name = i18n.t("content.item.sudon3.name");
item.sudon3.val = 50;
item.sudon3.desc = i18n.t("content.item.sudon3.desc", {
  separator: dom.dseparator,
  val: item.sudon3.val,
});
item.sudon3.stype = 4;
item.sudon3.rar = 2;
item.sudon3.use = eatUse(10);

item.sudon4 = new Item();
item.sudon4.id = 159;
item.sudon4.name = i18n.t("content.item.sudon4.name");
item.sudon4.val = 25;
item.sudon4.desc = i18n.t("content.item.sudon4.desc", {
  separator: dom.dseparator,
  val: item.sudon4.val,
});
item.sudon4.stype = 4;
item.sudon4.use = eatUse(6);

item.goza = new Item();
item.goza.id = 160;
item.goza.name = i18n.t("content.item.goza.name");
item.goza.val = 37;
item.goza.desc = i18n.t("content.item.goza.desc", {
  separator: dom.dseparator,
  val: item.goza.val,
});
item.goza.stype = 4;
item.goza.use = eatUse(5);

item.dfrch = new Item();
item.dfrch.id = 161;
item.dfrch.name = i18n.t("content.item.dfrch.name");
item.dfrch.val = 48;
item.dfrch.desc = i18n.t("content.item.dfrch.desc", {
  separator: dom.dseparator,
  val: item.dfrch.val,
});
item.dfrch.stype = 4;
item.dfrch.use = eatUse(9);

item.ynasl = new Item();
item.ynasl.id = 162;
item.ynasl.name = i18n.t("content.item.ynasl.name");
item.ynasl.val = 29;
item.ynasl.desc = i18n.t("content.item.ynasl.desc", {
  separator: dom.dseparator,
  val: item.ynasl.val,
});
item.ynasl.stype = 4;
item.ynasl.use = eatUse(5);

item.ramen1 = new Item();
item.ramen1.id = 163;
item.ramen1.name = i18n.t("content.item.ramen1.name");
item.ramen1.val = 40;
item.ramen1.desc = i18n.t("content.item.ramen1.desc", {
  separator: dom.dseparator,
  val: item.ramen1.val,
});
item.ramen1.stype = 4;
item.ramen1.use = eatUse(7);

item.ramen2 = new Item();
item.ramen2.id = 164;
item.ramen2.name = i18n.t("content.item.ramen2.name");
item.ramen2.val = 42;
item.ramen2.desc = i18n.t("content.item.ramen2.desc", {
  separator: dom.dseparator,
  val: item.ramen2.val,
});
item.ramen2.stype = 4;
item.ramen2.use = eatUse(8);

item.ramen3 = new Item();
item.ramen3.id = 165;
item.ramen3.name = i18n.t("content.item.ramen3.name");
item.ramen3.val = 50;
item.ramen3.desc = i18n.t("content.item.ramen3.desc", {
  separator: dom.dseparator,
  val: item.ramen3.val,
});
item.ramen3.stype = 4;
item.ramen3.use = eatUse(10);

item.ramen4 = new Item();
item.ramen4.id = 166;
item.ramen4.name = i18n.t("content.item.ramen4.name");
item.ramen4.val = 66;
item.ramen4.desc = i18n.t("content.item.ramen4.desc", {
  separator: dom.dseparator,
  val: item.ramen4.val,
});
item.ramen4.stype = 4;
item.ramen4.rare = 2;
item.ramen4.use = eatUse(12);

item.bffbl = new Item();
item.bffbl.id = 167;
item.bffbl.name = i18n.t("content.item.bffbl.name");
item.bffbl.val = 48;
item.bffbl.desc = i18n.t("content.item.bffbl.desc", {
  separator: dom.dseparator,
  val: item.bffbl.val,
});
item.bffbl.stype = 4;
item.bffbl.use = eatUse(7);

item.sposs = new Item();
item.sposs.id = 168;
item.sposs.name = i18n.t("content.item.sposs.name");
item.sposs.val = 33;
item.sposs.desc = i18n.t("content.item.sposs.desc", {
  separator: dom.dseparator,
  val: item.sposs.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
  this.amount--;
};

item.soban1 = new Item();
item.soban1.id = 169;
item.soban1.name = i18n.t("content.item.soban1.name");
item.soban1.val = 40;
item.soban1.desc = i18n.t("content.item.soban1.desc", {
  separator: dom.dseparator,
  val: item.soban1.val,
});
item.soban1.stype = 4;
item.soban1.use = eatUse(6);

item.soban2 = new Item();
item.soban2.id = 170;
item.soban2.name = i18n.t("content.item.soban2.name");
item.soban2.val = 44;
item.soban2.desc = i18n.t("content.item.soban2.desc", {
  separator: dom.dseparator,
  val: item.soban2.val,
});
item.soban2.stype = 4;
item.soban2.use = eatUse(8);

item.soban3 = new Item();
item.soban3.id = 171;
item.soban3.name = i18n.t("content.item.soban3.name");
item.soban3.val = 46;
item.soban3.desc = i18n.t("content.item.soban3.desc", {
  separator: dom.dseparator,
  val: item.soban3.val,
});
item.soban3.stype = 4;
item.soban3.use = eatUse(9);

item.soban4 = new Item();
item.soban4.id = 172;
item.soban4.name = i18n.t("content.item.soban4.name");
item.soban4.val = 48;
item.soban4.desc = i18n.t("content.item.soban4.desc", {
  separator: dom.dseparator,
  val: item.soban4.val,
});
item.soban4.stype = 4;
item.soban4.use = eatUse(10);

item.soban5 = new Item();
item.soban5.id = 173;
item.soban5.name = i18n.t("content.item.soban5.name");
item.soban5.val = 52;
item.soban5.desc = i18n.t("content.item.soban5.desc", {
  separator: dom.dseparator,
  val: item.soban5.val,
});
item.soban5.stype = 4;
item.soban5.use = eatUse(11);

item.soban6 = new Item();
item.soban6.id = 174;
item.soban6.name = i18n.t("content.item.soban6.name");
item.soban6.val = 60;
item.soban6.desc = i18n.t("content.item.soban6.desc", {
  separator: dom.dseparator,
  val: item.soban6.val,
});
item.soban6.stype = 4;
item.soban6.rar = 2;
item.soban6.use = eatUse(15);

item.soban7 = new Item();
item.soban7.id = 175;
item.soban7.name = i18n.t("content.item.soban7.name");
item.soban7.val = 50;
item.soban7.desc = i18n.t("content.item.soban7.desc", {
  separator: dom.dseparator,
  val: item.soban7.val,
});
item.soban7.stype = 4;
item.soban7.use = eatUse(9);

item.katubo = new Item();
item.katubo.id = 176;
item.katubo.name = i18n.t("content.item.katubo.name");
item.katubo.val = 58;
item.katubo.desc = i18n.t("content.item.katubo.desc", {
  separator: dom.dseparator,
  val: item.katubo.val,
});
item.katubo.stype = 4;
item.katubo.use = eatUse(11);

item.curry1 = new Item();
item.curry1.id = 177;
item.curry1.name = i18n.t("content.item.curry1.name");
item.curry1.val = 50;
item.curry1.desc = i18n.t("content.item.curry1.desc", {
  separator: dom.dseparator,
  val: item.curry1.val,
});
item.curry1.stype = 4;
item.curry1.use = eatUse(14);

item.soban8 = new Item();
item.soban8.id = 178;
item.soban8.name = i18n.t("content.item.soban8.name");
item.soban8.val = 56;
item.soban8.desc = i18n.t("content.item.soban8.desc", {
  separator: dom.dseparator,
  val: item.soban8.val,
});
item.soban8.stype = 4;
item.soban8.use = eatUse(8);

item.yktr = new Item();
item.yktr.id = 179;
item.yktr.name = i18n.t("content.item.yktr.name");
item.yktr.val = 48;
item.yktr.desc = i18n.t("content.item.yktr.desc", {
  separator: dom.dseparator,
  val: item.yktr.val,
});
item.yktr.stype = 4;
item.yktr.use = eatUse(6);

item.tegs = new Item();
item.tegs.id = 180;
item.tegs.name = i18n.t("content.item.tegs.name");
item.tegs.val = 45;
item.tegs.desc = i18n.t("content.item.tegs.desc", {
  separator: dom.dseparator,
  val: item.tegs.val,
});
item.tegs.stype = 4;
item.tegs.use = eatUse(5);

item.tamag = new Item();
item.tamag.id = 181;
item.tamag.name = i18n.t("content.item.tamag.name");
item.tamag.val = 15;
item.tamag.desc = i18n.t("content.item.tamag.desc", {
  separator: dom.dseparator,
  val: item.tamag.val,
});
item.tamag.stype = 4;
item.tamag.use = eatUse(3);

item.magr = new Item();
item.magr.id = 182;
item.magr.name = i18n.t("content.item.magr.name");
item.magr.val = 26;
item.magr.desc = i18n.t("content.item.magr.desc", {
  separator: dom.dseparator,
  val: item.magr.val,
});
item.magr.stype = 4;
item.magr.use = eatUse(5);

item.ameb = new Item();
item.ameb.id = 183;
item.ameb.name = i18n.t("content.item.ameb.name");
item.ameb.val = 24;
item.ameb.desc = i18n.t("content.item.ameb.desc", {
  separator: dom.dseparator,
  val: item.ameb.val,
});
item.ameb.stype = 4;
item.ameb.use = eatUse(4);

item.engw = new Item();
item.engw.id = 184;
item.engw.name = i18n.t("content.item.engw.name");
item.engw.val = 32;
item.engw.desc = i18n.t("content.item.engw.desc", {
  separator: dom.dseparator,
  val: item.engw.val,
});
item.engw.stype = 4;
item.engw.use = eatUse(5);

item.skmsk = new Item();
item.skmsk.id = 185;
item.skmsk.name = i18n.t("content.item.skmsk.name");
item.skmsk.val = 30;
item.skmsk.desc = i18n.t("content.item.skmsk.desc", {
  separator: dom.dseparator,
  val: item.skmsk.val,
});
item.skmsk.stype = 4;
item.skmsk.use = eatUse(8);

item.namatk = new Item();
item.namatk.id = 186;
item.namatk.name = i18n.t("content.item.namatk.name");
item.namatk.val = 29;
item.namatk.desc = i18n.t("content.item.namatk.desc", {
  separator: dom.dseparator,
  val: item.namatk.val,
});
item.namatk.stype = 4;
item.namatk.use = eatUse(7);

item.hirame = new Item();
item.hirame.id = 187;
item.hirame.name = i18n.t("content.item.hirame.name");
item.hirame.val = 37;
item.hirame.desc = i18n.t("content.item.hirame.desc", {
  separator: dom.dseparator,
  val: item.hirame.val,
});
item.hirame.stype = 4;
item.hirame.use = eatUse(9);

item.shmaj = new Item();
item.shmaj.id = 188;
item.shmaj.name = i18n.t("content.item.shmaj.name");
item.shmaj.val = 33;
item.shmaj.desc = i18n.t("content.item.shmaj.desc", {
  separator: dom.dseparator,
  val: item.shmaj.val,
});
item.shmaj.stype = 4;
item.shmaj.use = eatUse(6);

item.kndma = new Item();
item.kndma.id = 189;
item.kndma.name = i18n.t("content.item.kndma.name");
item.kndma.val = 38;
item.kndma.desc = i18n.t("content.item.kndma.desc", {
  separator: dom.dseparator,
  val: item.kndma.val,
});
item.kndma.stype = 4;
item.kndma.use = eatUse(7);

item.ikura = new Item();
item.ikura.id = 190;
item.ikura.name = i18n.t("content.item.ikura.name");
item.ikura.val = 40;
item.ikura.desc = i18n.t("content.item.ikura.desc", {
  separator: dom.dseparator,
  val: item.ikura.val,
});
item.ikura.stype = 4;
item.ikura.use = eatUse(10);

item.akagi = new Item();
item.akagi.id = 191;
item.akagi.name = i18n.t("content.item.akagi.name");
item.akagi.val = 37;
item.akagi.desc = i18n.t("content.item.akagi.desc", {
  separator: dom.dseparator,
  val: item.akagi.val,
});
item.akagi.stype = 4;
item.akagi.use = eatUse(8);

item.otor = new Item();
item.otor.id = 192;
item.otor.name = i18n.t("content.item.otor.name");
item.otor.val = 45;
item.otor.desc = i18n.t("content.item.otor.desc", {
  separator: dom.dseparator,
  val: item.otor.val,
});
item.otor.stype = 4;
item.otor.rar = 2;
item.otor.use = eatUse(12);

item.awabi = new Item();
item.awabi.id = 193;
item.awabi.name = i18n.t("content.item.awabi.name");
item.awabi.val = 56;
item.awabi.desc = i18n.t("content.item.awabi.desc", {
  separator: dom.dseparator,
  val: item.awabi.val,
});
item.awabi.stype = 4;
item.awabi.rar = 2;
item.awabi.use = eatUse(13);

item.uni = new Item();
item.uni.id = 194;
item.uni.name = i18n.t("content.item.uni.name");
item.uni.val = 60;
item.uni.desc = i18n.t("content.item.uni.desc", {
  separator: dom.dseparator,
  val: item.uni.val,
});
item.uni.stype = 4;
item.uni.rar = 3;
item.uni.use = eatUse(16);

item.klbi1 = new Item();
item.klbi1.id = 195;
item.klbi1.name = i18n.t("content.item.klbi1.name");
item.klbi1.val = 48;
item.klbi1.desc = i18n.t("content.item.klbi1.desc", {
  separator: dom.dseparator,
  val: item.klbi1.val,
});
item.klbi1.stype = 4;
item.klbi1.use = eatUse(10);

item.klbi2 = new Item();
item.klbi2.id = 196;
item.klbi2.name = i18n.t("content.item.klbi2.name");
item.klbi2.val = 55;
item.klbi2.desc = i18n.t("content.item.klbi2.desc", {
  separator: dom.dseparator,
  val: item.klbi2.val,
});
item.klbi2.stype = 4;
item.klbi2.rar = 2;
item.klbi2.use = eatUse(25);

item.srln1 = new Item();
item.srln1.id = 197;
item.srln1.name = i18n.t("content.item.srln1.name");
item.srln1.val = 52;
item.srln1.desc = i18n.t("content.item.srln1.desc", {
  separator: dom.dseparator,
  val: item.srln1.val,
});
item.srln1.stype = 4;
item.srln1.use = eatUse(12);

item.srln2 = new Item();
item.srln2.id = 198;
item.srln2.name = i18n.t("content.item.srln2.name");
item.srln2.val = 66;
item.srln2.desc = i18n.t("content.item.srln2.desc", {
  separator: dom.dseparator,
  val: item.srln2.val,
});
item.srln2.stype = 4;
item.srln2.rar = 2;
item.srln2.use = eatUse(28);

item.sfdpl = new Item();
item.sfdpl.id = 199;
item.sfdpl.name = i18n.t("content.item.sfdpl.name");
item.sfdpl.val = 57;
item.sfdpl.desc = i18n.t("content.item.sfdpl.desc", {
  separator: dom.dseparator,
  val: item.sfdpl.val,
});
item.sfdpl.stype = 4;
item.sfdpl.use = eatUse(38);

item.kmchc = new Item();
item.kmchc.id = 200;
item.kmchc.name = i18n.t("content.item.kmchc.name");
item.kmchc.val = 63;
item.kmchc.desc = i18n.t("content.item.kmchc.desc", {
  separator: dom.dseparator,
  val: item.kmchc.val,
});
item.kmchc.stype = 4;
item.kmchc.use = eatUse(20);

item.stnkbb = new Item();
item.stnkbb.id = 201;
item.stnkbb.name = i18n.t("content.item.stnkbb.name");
item.stnkbb.val = 68;
item.stnkbb.desc = i18n.t("content.item.stnkbb.desc", {
  separator: dom.dseparator,
  val: item.stnkbb.val,
});
item.stnkbb.stype = 4;
item.stnkbb.use = eatUse(32);

item.spcbef = new Item();
item.spcbef.id = 202;
item.spcbef.name = i18n.t("content.item.spcbef.name");
item.spcbef.val = 49;
item.spcbef.desc = i18n.t("content.item.spcbef.desc", {
  separator: dom.dseparator,
  val: item.spcbef.val,
});
item.spcbef.stype = 4;
item.spcbef.use = eatUse(39);

item.binigiri = new Item();
item.binigiri.id = 203;
item.binigiri.name = i18n.t("content.item.binigiri.name");
item.binigiri.val = 88;
item.binigiri.desc = i18n.t("content.item.binigiri.desc", {
  separator: dom.dseparator,
  val: item.binigiri.val,
});
item.binigiri.stype = 4;
item.binigiri.rar = 3;
item.binigiri.use = eatUse(48);

item.infpdps = new Item();
item.infpdps.id = 204;
item.infpdps.name = i18n.t("content.item.infpdps.name");
item.infpdps.val = 66;
item.infpdps.desc = i18n.t("content.item.infpdps.desc", {
  separator: dom.dseparator,
  val: item.infpdps.val,
});
item.infpdps.stype = 4;
item.infpdps.rar = 3;
item.infpdps.use = eatUse(62);

item.daikn = new Item();
item.daikn.id = 205;
item.daikn.name = i18n.t("content.item.daikn.name");
item.daikn.val = 6;
item.daikn.desc = i18n.t("content.item.daikn.desc", {
  separator: dom.dseparator,
  val: item.daikn.val,
});
item.daikn.stype = 4;
item.daikn.use = eatUse(3);

item.bonig = new Item();
item.bonig.id = 206;
item.bonig.name = i18n.t("content.item.bonig.name");
item.bonig.val = 19;
item.bonig.desc = i18n.t("content.item.bonig.desc", {
  separator: dom.dseparator,
  val: item.bonig.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
  this.amount--;
};

item.wdaikn = new Item();
item.wdaikn.id = 207;
item.wdaikn.name = i18n.t("content.item.wdaikn.name");
item.wdaikn.val = 4;
item.wdaikn.desc = i18n.t("content.item.wdaikn.desc", {
  separator: dom.dseparator,
  val: item.wdaikn.val,
});
item.wdaikn.stype = 4;
item.wdaikn.rar = 0;
item.wdaikn.use = eatUse(4);

item.oppr = new Item();
item.oppr.id = 208;
item.oppr.name = i18n.t("content.item.oppr.name");
item.oppr.val = 42;
item.oppr.desc = i18n.t("content.item.oppr.desc", {
  separator: dom.dseparator,
  val: item.oppr.val,
});
item.oppr.stype = 4;
item.oppr.rar = 2;
item.oppr.use = eatUse(42);

item.jdaik = new Item();
item.jdaik.id = 209;
item.jdaik.name = i18n.t("content.item.jdaik.name");
item.jdaik.val = 50;
item.jdaik.desc = i18n.t("content.item.jdaik.desc", {
  separator: dom.dseparator,
  val: item.jdaik.val,
});
item.jdaik.stype = 4;
item.jdaik.rar = 2;
item.jdaik.use = eatUse(35);

item.bmshrm = new Item();
item.bmshrm.id = 210;
item.bmshrm.name = i18n.t("content.item.bmshrm.name");
item.bmshrm.val = 33;
item.bmshrm.desc = i18n.t("content.item.bmshrm.desc", {
  separator: dom.dseparator,
  val: item.bmshrm.val,
});
item.bmshrm.stype = 4;
item.bmshrm.rar = 2;
item.bmshrm.use = eatUse(16);

item.hlstw = new Item();
item.hlstw.id = 211;
item.hlstw.name = i18n.t("content.item.hlstw.name");
item.hlstw.val = 18;
item.hlstw.desc = i18n.t("content.item.hlstw.desc", {
  separator: dom.dseparator,
  val: item.hlstw.val,
});
item.hlstw.stype = 4;
item.hlstw.use = eatUse(8);

item.bcrrt = new Item();
item.bcrrt.id = 212;
item.bcrrt.name = i18n.t("content.item.bcrrt.name");
item.bcrrt.val = 9;
item.bcrrt.desc = i18n.t("content.item.bcrrt.desc", {
  separator: dom.dseparator,
  val: item.bcrrt.val,
});
item.bcrrt.stype = 4;
item.bcrrt.use = eatUse(5);

item.jsdch = new Item();
item.jsdch.id = 213;
item.jsdch.name = i18n.t("content.item.jsdch.name");
item.jsdch.val = 27;
item.jsdch.desc = i18n.t("content.item.jsdch.desc", {
  separator: dom.dseparator,
  val: item.jsdch.val,
});
item.jsdch.stype = 4;
item.jsdch.use = eatUse(12);

item.agrns = new Item();
item.agrns.id = 214;
item.agrns.name = i18n.t("content.item.agrns.name");
item.agrns.val = 3;
item.agrns.desc = i18n.t("content.item.agrns.desc", {
  separator: dom.dseparator,
  val: item.agrns.val,
});
item.agrns.stype = 4;
item.agrns.use = eatUse(5);
item.agrns.onGet = function () {
  if (this.amount >= 10) {
    giveRcp(rcp.wsb);
    this.onGet = function () {};
  }
};

item.eggfrc = new Item();
item.eggfrc.id = 215;
item.eggfrc.name = i18n.t("content.item.eggfrc.name");
item.eggfrc.val = 33;
item.eggfrc.desc = i18n.t("content.item.eggfrc.desc", {
  separator: dom.dseparator,
  val: item.eggfrc.val,
});
item.eggfrc.stype = 4;
item.eggfrc.use = eatUse(9);

item.thme = new Item();
item.thme.id = 216;
item.thme.name = i18n.t("content.item.thme.name");
item.thme.val = 2;
item.thme.desc = i18n.t("content.item.thme.desc", {
  separator: dom.dseparator,
  val: item.thme.val,
});
item.thme.stype = 4;
item.thme.use = eatUse(3);

item.wldhrbs = new Item();
item.wldhrbs.id = 217;
item.wldhrbs.name = i18n.t("content.item.wldhrbs.name");
item.wldhrbs.val = 1;
item.wldhrbs.desc = i18n.t("content.item.wldhrbs.desc", {
  separator: dom.dseparator,
  val: item.wldhrbs.val,
});
item.wldhrbs.stype = 4;
item.wldhrbs.use = eatUse(3);

item.meffg = new Item();
item.meffg.id = 218;
item.meffg.name = i18n.t("content.item.meffg.name");
item.meffg.val = 28;
item.meffg.desc = i18n.t("content.item.meffg.desc", {
  separator: dom.dseparator,
  val: item.meffg.val,
});
item.meffg.stype = 4;
item.meffg.use = eatUse(10);

item.rtnmt = new Item();
item.rtnmt.id = 219;
item.rtnmt.name = i18n.t("content.item.rtnmt.name");
item.rtnmt.val = 4;
item.rtnmt.rar = 0;
item.rtnmt.desc = i18n.t("content.item.rtnmt.desc", {
  separator: dom.dseparator,
  val: item.rtnmt.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.appljc = new Item();
item.appljc.id = 220;
item.appljc.name = i18n.t("content.item.appljc.name");
item.appljc.val = 18;
item.appljc.desc = i18n.t("content.item.appljc.desc", {
  separator: dom.dseparator,
  val: item.appljc.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.frtplp = new Item();
item.frtplp.id = 221;
item.frtplp.name = i18n.t("content.item.frtplp.name");
item.frtplp.val = 9;
item.frtplp.rot = [0.05, 0.15, 0.05, 0.15];
item.frtplp.desc = i18n.t("content.item.frtplp.desc", {
  separator: dom.dseparator,
  val: item.frtplp.val,
});
item.frtplp.stype = 4;
item.frtplp.use = eatUse(4);

item.klngbr = new Item();
item.klngbr.id = 222;
item.klngbr.name = i18n.t("content.item.klngbr.name");
item.klngbr.val = 52;
item.klngbr.desc = i18n.t("content.item.klngbr.desc", {
  separator: dom.dseparator,
  val: item.klngbr.val,
});
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
  msg(
    i18n.t("runtime.data.items.dialogue.restored_energy", { amount: this.val }),
    "lime",
  );
};

item.sbone = new Item();
item.sbone.id = 5000;
item.sbone.name = i18n.t("content.item.sbone.name");
item.sbone.desc = i18n.t("content.item.sbone.desc");
item.sbone.stype = 5;
item.sbone.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.you_rattle_the_bone_c275b048"));
};
item.sbone.onGet = function () {
  if (this.amount >= 50) {
    giveRcp(rcp.bdl1);
    this.onGet = function () {};
  }
};

item.death_b = new Item();
item.death_b.id = 5001;
item.death_b.name = i18n.t("content.item.death_b.name");
item.death_b.desc = i18n.t("content.item.death_b.desc");
item.death_b.stype = 5;
item.death_b.use = function () {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.looking_at_this_fills_you_with_bad_memories_917d676f",
    ),
  );
};

item.sstraw = new Item();
item.sstraw.id = 5002;
item.sstraw.name = i18n.t("content.item.sstraw.name");
item.sstraw.desc = i18n.t("content.item.sstraw.desc");
item.sstraw.stype = 5;
item.sstraw.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.you_put_one_in_your_mouth_5e64fdec"));
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
item.d6.name = i18n.t("content.item.d6.name");
item.d6.desc = i18n.t("content.item.d6.desc");
item.d6.stype = 5;
item.d6.rar = 2;
item.d6.use = function () {
  const r = rand(1, 6);
  global.stat.die_p += r;
  global.stat.die_p_t += r;
  msg(i18n.t("runtime.data.items.dialogue.roll_result", { result: r }));
  skl.dice.use(1);
  if (random() < 0.05) {
    this.amount--;
    msg(
      i18n.t(
        "runtime.data.items.dialogue.the_die_crumbles_in_your_hands_4b8a8092",
      ),
      "Magenta",
    );
  }
};

item.cp = new Item();
item.cp.id = 5004;
item.cp.name = i18n.t("content.item.cp.name");
item.cp.desc = i18n.t("content.item.cp.desc");
item.cp.stype = 4;
item.cp.use = function (x) {
  giveWealth(1, false, true);
  this.amount--;
  dumb(x);
};

item.lcn = new Item();
item.lcn.id = 5005;
item.lcn.name = i18n.t("content.item.lcn.name");
item.lcn.desc = i18n.t("content.item.lcn.desc");
item.lcn.stype = 4;
item.lcn.use = function (x) {
  giveWealth(20, false, true);
  this.amount--;
  dumb(x);
};

item.cn = new Item();
item.cn.id = 5006;
item.cn.name = i18n.t("content.item.cn.name");
item.cn.desc = i18n.t("content.item.cn.desc");
item.cn.stype = 4;
item.cn.use = function (x) {
  giveWealth(5, false, true);
  this.amount--;
  dumb(x);
};

item.cd = new Item();
item.cd.id = 5007;
item.cd.name = i18n.t("content.item.cd.name");
item.cd.desc = i18n.t("content.item.cd.desc");
item.cd.stype = 4;
item.cd.use = function (x) {
  giveWealth(10, false, true);
  this.amount--;
  dumb(x);
};

item.cq = new Item();
item.cq.id = 5008;
item.cq.name = i18n.t("content.item.cq.name");
item.cq.desc = i18n.t("content.item.cq.desc");
item.cq.stype = 4;
item.cq.use = function (x) {
  giveWealth(25, false, true);
  this.amount--;
  dumb(x);
};

// The deep cut's own material. The game had no ore of any kind; this is the first, and
// it stays a material rather than becoming equipment, because a region that pays in
// numbers is the kind of region this project has been careful not to build.
item.iron1 = new Item();
item.iron1.id = 5066;
item.iron1.name = i18n.t("content.item.iron1.name");
item.iron1.desc = i18n.t("content.item.iron1.desc");
item.iron1.stype = 5;
item.iron1.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.ore_is_dead_weight"), "grey");
};

item.watr = new Item();
item.watr.id = 5009;
item.watr.name = i18n.t("content.item.watr.name");
item.watr.desc = i18n.t("content.item.watr.desc");
item.watr.stype = 5;
item.watr.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.you_took_a_sip_d791463e"), "aqua");
};

item.psb = new Item();
item.psb.id = 5010;
item.psb.name = i18n.t("content.item.psb.name");
item.psb.desc = i18n.t("content.item.psb.desc");
item.psb.stype = 5;
item.psb.isf = true;
item.psb.parent = furniture.psb;
item.psb.use = function () {
  const f = giveFurniture(furniture.psb);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.wdc = new Item();
item.wdc.id = 5011;
item.wdc.name = i18n.t("content.item.wdc.name");
item.wdc.desc = i18n.t("content.item.wdc.desc");
item.wdc.stype = 5;
item.wdc.onGet = function () {
  if (this.amount >= 10) giveRcp(rcp.wbdl);
  if (this.amount >= 50) {
    giveRcp(rcp.wdl1);
    this.onGet = function () {};
  }
};
item.wdc.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.ouch_a31f5ae5"));
};

item.bgl = new Item();
item.bgl.id = 5012;
item.bgl.name = i18n.t("content.item.bgl.name");
item.bgl.desc = i18n.t("content.item.bgl.desc");
item.bgl.stype = 4;
item.bgl.use = function () {
  this.amount--;
};

item.salt = new Item();
item.salt.id = 5013;
item.salt.name = i18n.t("content.item.salt.name");
item.salt.desc = i18n.t("content.item.salt.desc");
item.salt.stype = 5;
item.salt.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.it_stings_your_tongue_6036572a"),
    "silver",
  );
};

item.slm = new Item();
item.slm.id = 5014;
item.slm.name = i18n.t("content.item.slm.name");
item.slm.desc = i18n.t("content.item.slm.desc");
item.slm.stype = 5;
item.slm.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.sticky_c85ef212"), "silver");
};

item.tlvs = new Item();
item.tlvs.id = 5015;
item.tlvs.name = i18n.t("content.item.tlvs.name");
item.tlvs.desc = i18n.t("content.item.tlvs.desc");
item.tlvs.stype = 5;
item.tlvs.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.they_feel_just_dry_enough_3f261762"),
    "blue",
  );
};

item.key1 = new Item();
item.key1.id = 5016;
item.key1.name = i18n.t("content.item.key1.name");
item.key1.desc = i18n.t("content.item.key1.desc");
item.key1.stype = 5;
item.key1.use = function () {};

item.key2 = new Item();
item.key2.id = 5017;
item.key2.name = i18n.t("content.item.key2.name");
item.key2.desc = i18n.t("content.item.key2.desc");
item.key2.stype = 5;
item.key2.use = function () {};

item.key3 = new Item();
item.key3.id = 5018;
item.key3.name = i18n.t("content.item.key3.name");
item.key3.desc = i18n.t("content.item.key3.desc");
item.key3.stype = 5;
item.key3.use = function () {};

item.key4 = new Item();
item.key4.id = 5019;
item.key4.name = i18n.t("content.item.key4.name");
item.key4.desc = i18n.t("content.item.key4.desc");
item.key4.stype = 5;
item.key4.use = function () {};

item.key5 = new Item();
item.key5.id = 5020;
item.key5.name = i18n.t("content.item.key5.name");
item.key5.desc = i18n.t("content.item.key5.desc");
item.key5.stype = 5;
item.key5.use = function () {};

item.key6 = new Item();
item.key6.id = 5021;
item.key6.name = i18n.t("content.item.key6.name");
item.key6.desc = i18n.t("content.item.key6.desc");
item.key6.stype = 5;
item.key6.use = function () {};

item.key7 = new Item();
item.key7.id = 5022;
item.key7.name = i18n.t("content.item.key7.name");
item.key7.desc = i18n.t("content.item.key7.desc");
item.key7.stype = 5;
item.key7.use = function () {};

item.key0 = new Item();
item.key0.id = 5023;
item.key0.name = i18n.t("content.item.key0.name");
item.key0.desc = function () {
  return i18n.t(
    global.flags.hbs1
      ? "content.item.key0.desc_basement"
      : "content.item.key0.desc",
  );
};
item.key0.stype = 5;
item.key0.use = function () {
  msg(
    global.flags.hbs1
      ? i18n.t("runtime.data.items.dialogue.basement_key_survived")
      : i18n.t("runtime.data.items.dialogue.basement_key_familiar"),
    "lightgrey",
  );
};

item.ywlt = new Item();
item.ywlt.id = 5024;
item.ywlt.name = i18n.t("content.item.ywlt.name");
item.ywlt.desc = i18n.t("content.item.ywlt.desc", {
  separator: dom.dseparator,
});
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
item.hnhn.name = i18n.t("content.item.hnhn.name");
item.hnhn.desc = i18n.t("content.item.hnhn.desc");
item.hnhn.stype = 5;
item.hnhn.rar = 2;
item.hnhn.isf = true;
item.hnhn.parent = furniture.hnhn;
item.hnhn.use = function () {
  const f = giveFurniture(furniture.hnhn);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.pcn = new Item();
item.pcn.id = 5026;
item.pcn.name = i18n.t("content.item.pcn.name");
item.pcn.desc = i18n.t("content.item.pcn.desc");
item.pcn.stype = 4;
item.pcn.use = function (x) {
  msg(
    select(i18n.get("runtime.data.items.dialogue.pine_cone_reactions")),
    "lightgrey",
  );
  if (random() <= 0.3 + skl.dice.lvl * 0.03) {
    msg_add(
      i18n.t(
        "runtime.data.items.dialogue.you_have_discovered_some_pine_nuts_inside_c8e13cc5",
      ),
      "lime",
    );
    giveItem(item.pcns, rand(1, 3));
    giveSkExp(skl.dice, 2);
  } else {
    msg_add(
      i18n.t("runtime.data.items.dialogue.the_cone_was_empty_984432d9"),
      "grey",
    );
    giveSkExp(skl.dice, 0.5);
  }
  this.amount--;
};

item.pbl = new Item();
item.pbl.id = 5027;
item.pbl.name = i18n.t("content.item.pbl.name");
item.pbl.desc = i18n.t("content.item.pbl.desc", { separator: dom.dseparator });
item.pbl.stype = 2;
item.pbl.c = "yellow";
item.pbl.use = function () {
  if (this.disabled !== true) {
    this.disabled = true;
    if (global.flags.civil === true || global.flags.btl === false) {
      msg(
        i18n.t("runtime.data.items.dialogue.threw_item", { item: this.name }),
        "grey",
      );
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
item.ptng1.name = i18n.t("content.item.ptng1.name");
item.ptng1.desc = i18n.t("content.item.ptng1.desc");
item.ptng1.stype = 5;
item.ptng1.isf = true;
item.ptng1.parent = furniture.ptng1;
item.ptng1.use = function () {
  const f = giveFurniture(furniture.ptng1);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.fwd1 = new Item();
item.fwd1.id = 5029;
item.fwd1.name = i18n.t("content.item.fwd1.name");
item.fwd1.desc = i18n.t("content.item.fwd1.desc");
item.fwd1.stype = 5;
item.fwd1.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.donk_it_sounds_hollow_2f0edb78"),
    "ghostwhite",
  );
};
item.fwd1.onGet = function () {
  if (this.amount >= 60) {
    giveRcp(rcp.fwdpile);
    this.onGet = function () {};
  }
};

item.coal1 = new Item();
item.coal1.id = 5030;
item.coal1.name = i18n.t("content.item.coal1.name");
item.coal1.desc = i18n.t("content.item.coal1.desc");
item.coal1.stype = 5;
item.coal1.use = function () {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_can_picture_it_smoldering_inside_your_fireplace_f520e088",
    ),
    "grey",
  );
};

item.coal2 = new Item();
item.coal2.id = 5031;
item.coal2.name = i18n.t("content.item.coal2.name");
item.coal2.desc = i18n.t("content.item.coal2.desc");
item.coal2.stype = 5;
item.coal2.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.your_hands_get_all_dirty_623de076"),
    "black",
    null,
    null,
    "lightgrey",
  );
};

item.cndl2 = new Item();
item.cndl2.id = 5032;
item.cndl2.name = i18n.t("content.item.cndl2.name");
item.cndl2.desc = i18n.t("content.item.cndl2.desc");

item.skl = new Item();
item.skl.id = 5033;
item.skl.name = i18n.t("content.item.skl.name");
item.skl.desc = i18n.t("content.item.skl.desc");
item.skl.stype = 5;
item.skl.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.it_looks_menacing_e63dad3f"),
    "purple",
    null,
    null,
    "lightgrey",
  );
};

global.text.kntsct = i18n.get("gameText.kntsct");

item.rope = new Item();
item.rope.id = 5034;
item.rope.name = i18n.t("content.item.rope.name");
item.rope.desc = i18n.t("content.item.rope.desc");
item.rope.stype = 5;
item.rope.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.knot_practice", {
      knot: select(global.text.kntsct),
    }),
    "springgreen",
  );
};

item.mcps = new Item();
item.mcps.id = 5035;
item.mcps.name = i18n.t("content.item.mcps.name");
item.mcps.desc = i18n.t("content.item.mcps.desc", {
  separator: dom.dseparator,
});
item.mcps.stype = 2;
item.mcps.c = "yellow";
item.mcps.use = function () {
  if (this.disabled !== true) {
    this.disabled = true;
    if (global.flags.civil === true || global.flags.btl === false) {
      msg(
        i18n.t("runtime.data.items.dialogue.threw_item", { item: this.name }),
        "grey",
      );
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
item.stdst.name = i18n.t("content.item.stdst.name");
item.stdst.desc = i18n.t("content.item.stdst.desc");
item.stdst.stype = 5;
item.stdst.use = function (x) {
  msg(
    i18n.t("runtime.data.items.dialogue.it_is_glittering_6f4600df"),
    "gold",
    null,
    null,
    "darkblue",
  );
};

item.gcre1 = new Item();
item.gcre1.id = 5037;
item.gcre1.name = i18n.t("content.item.gcre1.name");
item.gcre1.desc = i18n.t("content.item.gcre1.desc");
item.gcre1.stype = 5;
item.gcre1.use = function (x) {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_notice_specks_of_dull_light_flickering_inside_be3f2669",
    ),
  );
};

item.wvbkt = new Item();
item.wvbkt.id = 5038;
item.wvbkt.name = i18n.t("content.item.wvbkt.name");
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
item.tbwr1.name = i18n.t("content.item.tbwr1.name");
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
item.ess1.name = i18n.t("content.item.ess1.name");
item.ess1.desc = i18n.t("content.item.ess1.desc");
item.ess1.stype = 5;
item.ess1.rar = 2;

item.ess2 = new Item();
item.ess2.id = 5041;
item.ess2.name = i18n.t("content.item.ess2.name");
item.ess2.desc = i18n.t("content.item.ess2.desc");
item.ess2.stype = 5;
item.ess2.rar = 2;

item.ess3 = new Item();
item.ess3.id = 5042;
item.ess3.name = i18n.t("content.item.ess3.name");
item.ess3.desc = i18n.t("content.item.ess3.desc");
item.ess3.stype = 5;
item.ess3.rar = 2;

item.ess4 = new Item();
item.ess4.id = 5043;
item.ess4.name = i18n.t("content.item.ess4.name");
item.ess4.desc = i18n.t("content.item.ess4.desc");
item.ess4.stype = 5;
item.ess4.rar = 2;

item.ess5 = new Item();
item.ess5.id = 5044;
item.ess5.name = i18n.t("content.item.ess5.name");
item.ess5.desc = i18n.t("content.item.ess5.desc");
item.ess5.stype = 5;
item.ess5.rar = 2;

item.ess6 = new Item();
item.ess6.id = 5045;
item.ess6.name = i18n.t("content.item.ess6.name");
item.ess6.desc = i18n.t("content.item.ess6.desc");
item.ess6.stype = 5;
item.ess6.rar = 2;

item.toolbx = new Item();
item.toolbx.id = 5046;
item.toolbx.name = i18n.t("content.item.toolbx.name");
item.toolbx.desc = i18n.t("content.item.toolbx.desc", {
  separator: dom.dseparator,
});
item.toolbx.stype = 5;
item.toolbx.use = function () {
  if (random() < 0.1)
    msg(
      i18n.t("runtime.data.items.dialogue.you_almost_dropped_the_box_32b8bcbf"),
      "orange",
    );
  else
    msg(
      i18n.t(
        "runtime.data.items.dialogue.dozens_of_tools_tumble_inside_as_you_shake_f1d77206",
      ),
      "yellow",
    );
};

item.cpdst = new Item();
item.cpdst.id = 5047;
item.cpdst.name = i18n.t("content.item.cpdst.name");
item.cpdst.desc = i18n.t("content.item.cpdst.desc");
item.cpdst.stype = 5;
item.cpdst.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.disgusting_1a84669d"), "lightgrey");
};

item.cclth = new Item();
item.cclth.id = 5048;
item.cclth.name = i18n.t("content.item.cclth.name");
item.cclth.desc = i18n.t("content.item.cclth.desc");
item.cclth.stype = 5;
item.cclth.use = function () {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.can_you_even_work_with_something_this_worthless_e20df5ed",
    ),
    "lightgrey",
  );
};

item.thrdnl = new Item();
item.thrdnl.id = 5049;
item.thrdnl.name = i18n.t("content.item.thrdnl.name");
item.thrdnl.desc = i18n.t("content.item.thrdnl.desc");
item.thrdnl.stype = 5;
item.thrdnl.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.it_doesn_t_seem_very_sturdy_6f181af0"),
    "lightgrey",
  );
};
item.thrdnl.onGet = function () {
  if (this.amount >= 100) {
    giveRcp(rcp.cyrn);
    this.onGet = function () {};
  }
};

item.sktbad = new Item();
item.sktbad.id = 5050;
item.sktbad.name = i18n.t("content.item.sktbad.name");
item.sktbad.desc = i18n.t("content.item.sktbad.desc");
item.sktbad.stype = 5;
item.sktbad.isf = true;
item.sktbad.parent = furniture.sktbad;
item.sktbad.use = function () {
  const f = giveFurniture(furniture.sktbad);
  if (inSector(sector.home)) activatef(f);
  this.amount--;
};

item.bblkt = new Item();
item.bblkt.id = 5051;
item.bblkt.name = i18n.t("content.item.bblkt.name");
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
item.spillw.name = i18n.t("content.item.spillw.name");
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
item.cyrn.name = i18n.t("content.item.cyrn.name");
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
item.dfish.name = i18n.t("content.item.dfish.name");
item.dfish.desc = i18n.t("content.item.dfish.desc");
item.dfish.stype = 5;
item.dfish.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.gross_a275005b"), "lightgrey");
};

item.fbait1 = new Item();
item.fbait1.id = 5055;
item.fbait1.name = i18n.t("content.item.fbait1.name");
item.fbait1.desc = i18n.t("content.item.fbait1.desc");
item.fbait1.stype = 5;
item.fbait1.use = function () {};

item.htrdvr = new Item();
item.htrdvr.id = 5056;
item.htrdvr.name = i18n.t("content.item.htrdvr.name");
item.htrdvr.desc = i18n.t("content.item.htrdvr.desc");
item.htrdvr.stype = 5;
item.htrdvr.use = function () {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_resist_the_temptation_to_open_it_a3dcba1c",
    ),
    "lightgrey",
  );
};

item.htrsvr = new Item();
item.htrsvr.id = 5057;
item.htrsvr.name = i18n.t("content.item.htrsvr.name");
item.htrsvr.desc = i18n.t("content.item.htrsvr.desc");
item.htrsvr.stype = 5;
item.htrsvr.use = function () {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.strong_aroma_eminating_from_this_bag_makes_your_b812f240",
    ),
    "orange",
  );
};

item.hbtsvr = new Item();
item.hbtsvr.id = 5058;
item.hbtsvr.name = i18n.t("content.item.hbtsvr.name");
item.hbtsvr.desc = i18n.t("content.item.hbtsvr.desc");
item.hbtsvr.stype = 5;
item.hbtsvr.use = function () {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_ll_be_in_trouble_of_you_break_2dcc0005",
    ),
    "lightgrey",
  );
};

item.fwdpile = new Item();
item.fwdpile.id = 5059;
item.fwdpile.name = i18n.t("content.item.fwdpile.name");
item.fwdpile.desc = i18n.t("content.item.fwdpile.desc");
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
item.lprmt.name = i18n.t("content.item.lprmt.name");
item.lprmt.desc = i18n.t("content.item.lprmt.desc");
item.lprmt.stype = 5;
item.lprmt.rar = 2;
item.lprmt.use = function () {
  msg(
    i18n.t("runtime.data.items.dialogue.you_feel_pride_holding_this_052787a2"),
    "green",
  );
};

item.bed2 = new Item();
item.bed2.id = 5061;
item.bed2.name = i18n.t("content.item.bed2.name");
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
item.wfng.name = i18n.t("content.item.wfng.name");
item.wfng.desc = i18n.t("content.item.wfng.desc");
item.wfng.stype = 5;
item.wfng.use = function () {
  msg(
    i18n.t(
      "runtime.data.items.dialogue.you_may_prick_your_finger_if_you_mishandle_99d5f11a",
    ),
    "lightgrey",
  );
};
item.wfng.onGet = function () {
  if (this.amount >= 10) giveRcp(rcp.wfng);
};

item.bookgen = new Item();
item.bookgen.id = 5063;
item.bookgen.name = i18n.t("content.item.bookgen.name");
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
item.dmice1.name = i18n.t("content.item.dmice1.name");
item.dmice1.desc = i18n.t("content.item.dmice1.desc");
item.dmice1.stype = 5;
item.dmice1.rar = 0;
item.dmice1.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.yeah_9450d6a3"), "grey");
};

item.dbdc1 = new Item();
item.dbdc1.id = 5065;
item.dbdc1.name = i18n.t("content.item.dbdc1.name");
item.dbdc1.desc = i18n.t("content.item.dbdc1.desc");
item.dbdc1.stype = 5;
item.dbdc1.rar = 0;
item.dbdc1.use = function () {
  msg(i18n.t("runtime.data.items.dialogue.indeed_2cbbd1b7"), "grey");
};

item.ip1 = new Item();
item.ip1.id = 9000;
item.ip1.name = i18n.t("content.item.ip1.name");
item.ip1.desc = i18n.t("content.item.ip1.desc");
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
item.skl1.name = i18n.t("content.item.skl1.name");
item.skl1.desc = i18n.t("content.item.skl1.desc", {
  separator: dom.dseparator,
});
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
item.skl2.name = i18n.t("content.item.skl2.name");
item.skl2.desc = i18n.t("content.item.skl2.desc", {
  separator: dom.dseparator,
});
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
item.skl3.name = i18n.t("content.item.skl3.name");
item.skl3.desc = i18n.t("content.item.skl3.desc", {
  separator: dom.dseparator,
});
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
item.skl4.name = i18n.t("content.item.skl4.name");
item.skl4.desc = i18n.t("content.item.skl4.desc", {
  separator: dom.dseparator,
});
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
item.skl5.name = i18n.t("content.item.skl5.name");
item.skl5.desc = i18n.t("content.item.skl5.desc", {
  separator: dom.dseparator,
});
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
item.skl6.name = i18n.t("content.item.skl6.name");
item.skl6.desc = i18n.t("content.item.skl6.desc", {
  separator: dom.dseparator,
});
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
item.bstr.name = i18n.t("content.item.bstr.name");
item.bstr.rar = 2;
item.bstr.desc = i18n.t("content.item.bstr.desc", {
  separator: dom.dseparator,
});
item.bstr.stype = 4;
item.bstr.data.time = HOUR * 17;
item.bstr.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      msg(
        i18n.t("runtime.data.items.dialogue.bestiary_unlocked_2ece8a9b"),
        "cyan",
      );
      this.data.read = false;
      this.amount--;
      global.flags.bstu = true;
      this.data.finished = true;
      if (dom.jlbrw1s2) dom.jlbrw1s2.innerHTML = i18n.t("ui.panels.bestiary");
    } else chss.trd.sl(this);
  }
};

item.tbrwdb = new Item();
item.tbrwdb.id = 9008;
item.tbrwdb.name = i18n.t("content.item.tbrwdb.name");
item.tbrwdb.rar = 2;
item.tbrwdb.desc = i18n.t("content.item.tbrwdb.desc");
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

global.text.mscbkatxt = i18n.get("gameText.mscbkatxt");

item.msc1 = new Item();
item.msc1.id = 9009;
item.msc1.name = i18n.t("content.item.msc1.name");
item.msc1.data.bid = _rand(global.text.mscbkatxt.length - 1);
item.msc1.data.exp = _rand(500, 10000);
item.msc1.save = true;
item.msc1.desc = function () {
  return i18n.t("content.item.msc1.desc", {
    separator: dom.dseparator,
    extra: global.text.mscbkatxt[this.data.bid],
  });
};
item.msc1.stype = 4;
item.msc1.data.time = HOUR * 6;
item.msc1.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      giveExp(this.data.exp || 500, true, true, true);
      this.data.bid = rand(global.text.mscbkatxt.length - 1);
      this.data.exp = rand(500, 5000);
      this.desc = i18n.t("content.item.msc1.desc", {
        separator: dom.dseparator,
        extra: global.text.mscbkatxt[item.msc1.data.bid],
      });
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
item.bcpn.name = i18n.t("content.item.bcpn.name");
item.bcpn.rar = 2;
item.bcpn.desc = i18n.t("content.item.bcpn.desc");
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
item.mdc1.name = i18n.t("content.item.mdc1.name");
item.mdc1.desc = i18n.t("content.item.mdc1.desc");
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
      if (dt === 0)
        msg(
          i18n.t(
            "runtime.data.items.dialogue.you_haven_t_learned_anything_new_c64d232a",
          ),
          "lightgrey",
        );
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.dmkbk = new Item();
item.dmkbk.id = 9012;
item.dmkbk.name = i18n.t("content.item.dmkbk.name");
item.dmkbk.desc = i18n.t("content.item.dmkbk.desc");
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
      if (dt === 0)
        msg(
          i18n.t(
            "runtime.data.items.dialogue.you_haven_t_learned_anything_new_c64d232a",
          ),
          "lightgrey",
        );
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.scrlw = new Item();
item.scrlw.id = 9013;
item.scrlw.name = i18n.t("content.item.scrlw.name");
item.scrlw.desc = i18n.t("content.item.scrlw.desc");
item.scrlw.stype = 4;
item.scrlw.data.time = HOUR * 3;
item.scrlw.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      let dt = 0;
      dt += giveRcp(rcp.hptn1);
      this.data.finished = true;
      if (dt === 0)
        msg(
          i18n.t(
            "runtime.data.items.dialogue.you_already_know_how_to_make_lesser_potions_d77c7b1d",
          ),
          "lightgrey",
        );
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.wp2s = new Item();
item.wp2s.id = 9014;
item.wp2s.name = i18n.t("content.item.wp2s.name");
item.wp2s.desc = i18n.t("content.item.wp2s.desc");
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
      if (dt === 0)
        msg(
          i18n.t(
            "runtime.data.items.dialogue.you_already_know_how_to_sharpen_sticks_dcee0801",
          ),
          "lightgrey",
        );
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.shppmf = new Item();
item.shppmf.id = 9015;
item.shppmf.name = i18n.t("content.item.shppmf.name");
item.shppmf.desc = i18n.t("content.item.shppmf.desc");
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
      msg(
        i18n.t(
          "runtime.data.items.dialogue.right_you_could_go_to_the_marketplace_dd0b11b4",
        ),
        "lime",
      );
      if (global.current_l.id === chss.lsmain1.id) smove(chss.lsmain1, false);
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.amrthsck = new Item();
item.amrthsck.id = 9016;
item.amrthsck.name = i18n.t("content.item.amrthsck.name");
item.amrthsck.desc = i18n.t("content.item.amrthsck.desc");
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
      if (dt === 0)
        msg(
          i18n.t(
            "runtime.data.items.dialogue.you_haven_t_learned_anything_new_c64d232a",
          ),
          "lightgrey",
        );
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.skl1a = new Item();
item.skl1a.id = 9017;
item.skl1a.name = i18n.t("content.item.skl1a.name");
item.skl1a.rar = 2;
item.skl1a.desc = i18n.t("content.item.skl1a.desc", {
  separator: dom.dseparator,
});
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
item.skl2a.name = i18n.t("content.item.skl2a.name");
item.skl2a.rar = 2;
item.skl2a.desc = i18n.t("content.item.skl2a.desc", {
  separator: dom.dseparator,
});
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
item.skl3a.name = i18n.t("content.item.skl3a.name");
item.skl3a.rar = 2;
item.skl3a.desc = i18n.t("content.item.skl3a.desc", {
  separator: dom.dseparator,
});
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
item.skl4a.name = i18n.t("content.item.skl4a.name");
item.skl4a.rar = 2;
item.skl4a.desc = i18n.t("content.item.skl4a.desc", {
  separator: dom.dseparator,
});
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
item.skl5a.name = i18n.t("content.item.skl5a.name");
item.skl5a.rar = 2;
item.skl5a.desc = i18n.t("content.item.skl5a.desc", {
  separator: dom.dseparator,
});
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
item.skl6a.name = i18n.t("content.item.skl6a.name");
item.skl6a.rar = 2;
item.skl6a.desc = i18n.t("content.item.skl6a.desc", {
  separator: dom.dseparator,
});
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
item.brdbn.name = i18n.t("content.item.brdbn.name");
item.brdbn.desc = i18n.t("content.item.brdbn.desc");
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
      if (dt === 0)
        msg(
          i18n.t(
            "runtime.data.items.dialogue.you_haven_t_learned_anything_new_c64d232a",
          ),
          "lightgrey",
        );
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.bfsnwt = new Item();
item.bfsnwt.id = 9024;
item.bfsnwt.name = i18n.t("content.item.bfsnwt.name");
item.bfsnwt.desc = i18n.t("content.item.bfsnwt.desc");
item.bfsnwt.stype = 4;
item.bfsnwt.data.time = HOUR * 4;
item.bfsnwt.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      let dt = 0;
      dt += giveRcp(rcp.ptchpts);
      dt += giveRcp(rcp.ptchct);
      if (dt === 0)
        msg(
          i18n.t(
            "runtime.data.items.dialogue.you_haven_t_learned_anything_new_c64d232a",
          ),
          "lightgrey",
        );
      this.data.read = false;
      this.amount--;
    } else chss.trd.sl(this);
  }
};

item.pdeedhs = new Item();
item.pdeedhs.id = 9025;
item.pdeedhs.name = i18n.t("content.item.pdeedhs.name");
item.pdeedhs.rar = 2;
item.pdeedhs.desc = i18n.t("content.item.pdeedhs.desc", {
  separator: dom.dseparator,
});
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
item.fgtsb1.name = i18n.t("content.item.fgtsb1.name");
item.fgtsb1.desc = i18n.t("content.item.fgtsb1.desc", {
  separator: dom.dseparator,
});
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
item.jnlbk.name = i18n.t("content.item.jnlbk.name");
item.jnlbk.desc = i18n.t("content.item.jnlbk.desc", {
  separator: dom.dseparator,
});
item.jnlbk.stype = 4;
item.jnlbk.data.time = HOUR * 4;
item.jnlbk.use = function () {
  if (canRead()) {
    if (this.data.timep >= this.cmax) {
      msg(
        i18n.t("runtime.data.items.dialogue.journal_unlocked_01c245e7"),
        "cyan",
      );
      this.data.read = false;
      this.amount--;
      global.flags.jnlu = true;
      this.data.finished = true;
      dom.ct_bt6.innerHTML = i18n.t("ui.navigation.journal");
    } else chss.trd.sl(this);
  }
};
