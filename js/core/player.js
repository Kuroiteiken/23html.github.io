// Player state. Defines the `You` constructor, the derived-stat recalculation
// that folds equipment, titles, and effects into the visible values, and the
// death and revival flow. Loaded after the data modules so the titles, skills,
// and items referenced here already exist.

function You() {
  this.name = i18n.t("runtime.core.player.interface.name");
  this.title = ttl.new;
  this.desc = i18n.t("runtime.core.player.interface.description");
  this.id = -1;
  this.type = 0;
  this.rank = function () {
    return Math.ceil(
      50000000000000 *
        (1 /
          ((this.agl + this.str + you.eqp[0].str + this.spd + this.int) ** 2 /
            Math.sqrt(
              ((this.agl + this.str + this.int + this.spd / this.lvl) * 512) /
                (this.luck * 0.1 + 1),
            ))),
    );
  };
  this.rnk = 0;
  this.lvl = 1;
  this.exp = 0;
  this.expnext = function () {
    return this.lvl * (this.lvl * 2) ** 2 + this.lvl ** 2;
  };
  this.expnext_t = this.expnext();
  this.exp_t = 1;
  // Multiplies everything giveSkExp hands a skill. Separate from skl.p, which is the
  // skill's own permanent rate: this one is the player's, and it is the only place a
  // temporary effect can raise mastery gain without banking itself into the save.
  this.skxp = 1;
  this.efficiency = function () {
    let g = skl.fmn.use();
    g = g >= 0.6 ? 0.6 : g;
    const e =
      ((0.8 - g) * this.sat) / this.satmax + (0.2 + g) + you.mods.sbonus;
    return e < 0 ? 0 : e;
  };
  this.mods = {
    sbonus: 0,
    // No action, no drain. Running adds its cost scaled by mods.runerg, and
    // combat, weather, and effects subtract satiation directly.
    sdrate: 0,
    infsrate: 1,
    enmondren: 0,
    enmondrts: 1,
    ddgmod: 0,
    rdgrt: 1,
    cpwr: 1,
    crflt: 0,
    wthexrt: 0,
    tstl: 0,
    lkdbt: 0,
    ckfre: 0,
    rnprtk: 0,
    light: 0,
    // Set by holding a pickaxe, read by the mine. Derived from equipment the way
    // `light` is, so it is never saved and can never drift out of step with what the
    // player is actually carrying.
    mine: 0,
    undc: 0,
    petxp: 0.005,
    stdstps: 1,
    survinf: 0,
    runerg: 1,
  };
  this.ki = {};
  this.sat = this.satmax = this.sat_r = 200;
  this.hpmax = 39;
  this.hp = this.hp_r = 39;
  this.str =
    this.str_r =
    this.agl =
    this.agl_r =
    this.int =
    this.int_r =
    this.spd =
    this.spd_r =
    this.str_d =
    this.agl_d =
    this.int_d =
      1;
  this.stra = this.agla = this.inta = this.spda = this.hpa = this.sata = 0;
  this.strm = this.intm = this.spdm = this.aglm = this.hpm = this.satm = 1;
  this.stat_p = [1, 1, 1, 1];
  this.res = {
    poison: 1,
    burn: 1,
    frost: 1,
    paralize: 1,
    blind: 1,
    sleep: 1,
    curse: 1,
    death: 1,
    bleed: 1,
    ph: 1,
    venom: 1,
    fpoison: 1,
  };
  this.cls = [0, 0, 0];
  this.ccls = [0, 0, 0];
  this.aff = [0, 0, 0, 0, 0, 0, 0];
  this.maff = [0, 0, 0, 0, 0, 0, 0];
  this.caff = [0, 0, 0, 0, 0, 0, 0];
  this.cmaff = [0, 0, 0, 0, 0, 0, 0];
  this.dmlt = 1;
  this.luck = 1;
  this.karma = 0;
  this.crt = 0.008;
  this.wealth = 0;
  this.eva = 0;
  this.atkmode = 1;
  this.alive = true;
  this.eqp = [
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
    eqp.dummy,
  ];
  this.eff = [];
  this.skls = [];
  this.drop = [{ item: item.death_b, chance: 1 }];
  this.onDeath = function (killer) {
    if (you.res.death < 1 && random() >= you.res.death) {
      msg(
        i18n.t("runtime.core.player.dialogue.you_avoid_death_d751acb1"),
        "lightgrey",
      );
      you.hp = Math.ceil(you.hpmax * 0.1);
    } else {
      callback.onDeath.fire(this, killer);
      this.alive = false;
      this.hp = 1;
      if (!killer) killer = creature.default;
      if (global.current_a.id !== act.default.id)
        deactivateAct(global.current_a);
      global.flags.work = false;
      you.sat / you.satmax > 0.3
        ? giveSkExp(skl.dth, killer.rnk * 10 + 1)
        : giveSkExp(skl.dth, killer.rnk + 1);
      // A higher Death skill preserves more satiation, but the multiplier is
      // kept inside (0, 0.95] so dying can never refund satiation and can never
      // push it below zero.
      if (this.sat > 0) this.sat *= Math.min(0.95, 0.45 * (1 + skl.dth.use()));
      giveItem(item.death_b);
      dom.d5_1_1.update();
      global.s_l = 0;
      global.stat.deadt++;
      for (const x in global.achchk[0]) global.achchk[0][x](killer);
      clearInterval(timers.rdng);
      clearInterval(timers.rdngdots);
      global.flags.rdng = false;
      clearInterval(timers.job1t);
      clearInterval(timers.bstmonupdate);
      for (const o in this.eff) removeEff(this.eff[o]);
      global.flags.btl = false;
      global.flags.civil = true;
      global.current_z.onDeath();
      if (sector.home.data.smkp > 0) {
        smove(chss.lsmain1, false);
        msg(
          i18n.t(
            "runtime.core.player.dialogue.you_ran_out_of_your_smoked_up_house_a870053b",
          ),
          "grey",
        );
      } else smove(chss.hbed, false);
      global.current_z = area.nwh;
      dom.hit_c();
      dom.d7m.update();
    }
  };
  this.onDeathE = function () {};
  this.ai = function () {};
  this.battle_ai = function (x, y, z) {
    return attack(x, y);
  };
  this.stat_r = function () {
    this.stre = this.inte = this.agle = this.spde = this.sate = this.hpe = 1;
    for (const idx in this.eff) this.eff[idx].mods();
    this.str = (this.str_r + this.stra) * this.strm * this.stre;
    this.str_d = this.str;
    this.int = (this.int_r + this.inta) * this.intm * this.inte;
    this.int_d = this.int;
    this.agl = (this.agl_r + this.agla) * this.aglm * this.agle;
    this.agl_d = this.agl;
    this.spd = (this.spd_r + this.spda) * this.spdm * this.spde;
    this.spd_d = this.spd;
    this.hpmax = Math.ceil((this.hp_r + this.hpa) * this.hpm * this.hpe);
    this.satmax = Math.ceil((this.sat_r + this.sata) * this.satm * this.sate);
    // Sharpening included, so the panel agrees with the damage. str_d is the
    // displayed figure only -- dmg_calc reads str and eqp[0].str and never this.
    this.str_d += weaponPower(this.eqp[0]);
    this.dmlt = 1;
    for (const obj in this.eqp) {
      this.int_d += this.eqp[obj].int;
      this.agl_d += this.eqp[obj].agl;
      this.spd += this.eqp[obj].spd;
    }
    for (const idx in this.eff) {
      if (this.eff[idx].type === 2) {
        this.eff[idx].un();
        this.eff[idx].use(this.eff[idx].y, this.eff[idx].z);
      }
    }
    dom.d6.update();
    update_db();
    if (you.hp > you.hpmax) you.hp = you.hpmax;
    dom.d5_1_1.update();
  };
}
you = new You();
you.eqp[0].ctype = 2;
giveTitle(ttl.new, true);
you.ai = function () {
  //if(you.hp*100/you.hpmax<50) item.hrb1.use();
  //if(you.sat*100/you.satmax<90) item.appl.use();
};

// The player types their own name, and it is drawn in the HUD, in the hover
// description beside it, and in every combat line that mentions them. Those three
// surfaces are built as HTML, so a name is the one piece of player-authored text that
// reaches an innerHTML. On its own that is only self-inflicted -- but a save is
// exported and shared as a file, so a name from somebody else's save would run in the
// reader's page, and the message log persists under its own storage key, so it would
// keep running after a reload.
//
// Both halves are closed: the characters that could open a tag are removed here, at
// every point a name enters the game, and the HUD writes it with textContent. Length is
// bounded on the input element rather than here, so an existing save keeps the name it
// has.
function sanitizePlayerName(raw) {
  return String(raw ?? "").replace(/[<>&]/g, "");
}
