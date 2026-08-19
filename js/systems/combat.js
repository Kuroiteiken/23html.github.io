// Combat. Resolves a round between two combatants, the blows inside it, what a blow
// is worth, and the wear a weapon takes for landing one.
//
// This lived in the middle of js/ui/interface.js, between the inventory drawing and
// the recipe panel, which is why the agent instructions had to describe the damage
// formula as being somewhere inside an 8,000-line interface file. Nothing here draws
// anything: the messages go out through msg(), and the two floating-number effects
// this used to sit beside (dumb, mf) stayed in the interface where they belong.
//
// Concatenated after js/ui/interface.js and before js/world/locations.js. Everything
// below is called at run time rather than at definition time, so the interface
// helpers it uses -- msg, addDesc, updateInv -- are hoisted by then. The functions in
// js/systems/simulation.js it calls (doSingleAttack, printHitMessage,
// playerWeaponMastery, cansee) come later in the bundle for the same reason.

function allbuff(who) {
  who.stat_r();
  for (const g in who.eff)
    if (who.eff[g].type === 1) who.eff[g].use(who.eff[g].y, who.eff[g].z);
  if (who.id === you.id) {
    let dm = skl.fgt.use();
    if (you.eqp[0].twoh === true) dm += skl.twoh.use();
    you.str += dm;
    you.int += dm;
    usePlayerWeaponSkill();
  }
}

function fght(att, def) {
  /*if(global.flags.btlinterrupt===true){
    msg('battle interrupted');if(global.current_z.size>0) {area_init(global.current_z);global.current_z.size--;}else if(global.current_z.size===-1)area_init(global.current_z);else {msg('Area cleared','orange');global.current_z.onEnd();global.flags.civil=true;global.flags.btl=false;}; dom.d7m.update(); global.flags.btlinterrupt=false; return;
  }*/
  if (!att.alive || !def.alive) {
    return;
  }
  if (global.flags.smkactv) {
    global.flags.smkactv = false;
    return;
  }
  att.stat_r();
  def.stat_r();
  for (const g in att.eff)
    if (att.eff[g].type === 1) att.eff[g].use(att.eff[g].y, att.eff[g].z);
  for (const g in def.eff)
    if (def.eff[g].type === 1) def.eff[g].use(def.eff[g].y, def.eff[g].z);
  if (att.spd > 0 && def.spd > 0) {
    global.s_l += Math.abs(att.spd - def.spd);
  } else {
    global.s_l = Math.abs(att.spd - def.spd);
  }
  let inn, sc;
  if (att.spd >= def.spd || att.spd <= 0) {
    inn = att;
    sc = def;
  } else {
    inn = def;
    sc = att;
  }
  global.miss = 0;
  const isyouinn = inn.id === you.id;
  //if(isyouinn===false){if(random()<.9){console.log('stealth active'); inn=att; sc=def}}
  if (inn.spd > 0) {
    if (global.s_l / sc.spd >= 2) {
      let acc_dmg = 0;
      let hts = 0;
      global.flags.multih = true;
      for (let ii = 0; ii < Math.ceil(global.s_l / sc.spd); ii++) {
        hts++;
        acc_dmg += inn.battle_ai(inn, sc);
        if (sc.hp <= 0) break;
      }
      global.flags.multih = false;
      if (att.id === you.id && acc_dmg >= sc.hpmax) global.stat.onesht++;
      if (global.flags.m_blh === false && hts - global.miss > 0) {
        if (hts === 1) printHitMessage(inn.name, acc_dmg, !isyouinn);
        else printMultihitMessage(hts, inn.name, acc_dmg, !isyouinn);
      } else if (global.flags.m_blh === false)
        msg(
          i18n.t("runtime.ui.interface.dialogue.combat_missed", {
            name: inn.name,
          }),
          "grey",
        );
      if (sc.hp <= 0 && sc.alive === true) {
        global.atkdfty = [3, global.atkdftydt];
        sc.onDeath(inn);
        sc.onDeathE(inn);
      }
      global.s_l = global.s_l % sc.spd;
    } else {
      doSingleAttack(inn, sc, isyouinn);
    }
  }
  if (!sc.alive) {
    you.stat_r();
    return;
  }
  // The slower combatant's blow, resolved inline. This was a setTimeout of
  // 500 / global.fps, which a background tab throttles to roughly once a minute: the
  // tick replayed sixty rounds while sixty of these callbacks queued up and landed
  // later in a clump, so whichever side was slower effectively stopped attacking. At
  // low levels that side is the player, which made a hidden-tab fight deadlier than
  // the same fight watched. A queued blow was also thrown away outright whenever the
  // area ended in between, since attack() returns early on !global.flags.btl.
  //
  // Both halves of a round now resolve inside the tick that started it, the way the
  // first half already did. The btl check is gone with the timer: nothing can change
  // it between the !sc.alive return above and this line in the same frame. Do not
  // turn this back into a timer.
  doSingleAttack(sc, inn, !isyouinn);
  you.stat_r();
}

function attack(att, def, atk, power) {
  if (!global.flags.btl) return;
  allbuff(att);
  allbuff(def);
  atk = atk || abl.default;
  const isyou = att.id === you.id;
  global.mabl = atk;
  let dmg;
  let hit;
  let dk = false;
  const a = 2 + rand(4);
  if (isyou === true) {
    wpnhitstt();
    hit = hit_calc(1);
    giveSkExp(skl.fgt, def.rnk);
    dk = global.flags.isdark && !cansee();
    if (dk) hit *= 0.3 + skl.ntst.lvl * 0.07;
  } else hit = hit_calc(2);
  global.target = you.eqp[a];
  global.t_n = a;
  if (rand(100) < hit) {
    global.target_g = a;
    if (isyou === true) {
      const t = you.eqp[0].dp > 0 ? 1 : 0.5;
      switch (you.eqp[0].wtype) {
        case 0:
          giveSkExp(skl.unc, t);
          break;
        case 1:
          giveSkExp(skl.srdc, t);
          break;
        case 2:
          giveSkExp(skl.axc, t);
          break;
        case 3:
          giveSkExp(skl.knfc, t);
          break;
        case 4:
          giveSkExp(skl.plrmc, t);
          break;
        case 5:
          giveSkExp(skl.hmrc, t);
          break;
        case 6:
          giveSkExp(skl.stfc, t);
          break;
      }
      if (dk) giveSkExp(skl.ntst, 0.1);
      // Carrying a shield trains the arm holding it, not only the blows it stops.
      // The only grant used to be in the branch below, where a creature's blow
      // lands on the player -- so a player who was not being hit never trained the
      // one skill that makes carrying a shield worth anything. A quarter of the
      // rate blocking gives, since blocking is still the real lesson.
      if (you.eqp[1].id !== 10000 && !you.eqp[0].twoh)
        giveSkExp(skl.shdc, 0.05);
      if (you.mods.tstl > 0) {
        itm = select(def.drop);
        if (
          random() <
          (itm.chance + (itm.chance / 100) * you.luck) * 0.01 * skl.stel.use()
        ) {
          giveItem(itm.item);
          giveSkExp(skl.stel, (1 / itm.chance) * 10);
        } else giveSkExp(skl.stel, 1);
      }
    } else {
      if (you.eqp[1].id !== 10000 && !you.eqp[0].twoh) giveSkExp(skl.shdc, 0.2);
      you.stat_r();
      if (you.mods.ddgmod !== 0)
        if (random() < you.mods.ddgmod) {
          global.miss++;
          if (
            global.flags.m_blh === false &&
            !global.flags.multih &&
            global.flags.m_blh === false
          )
            msg(
              i18n.t("runtime.ui.interface.dialogue.combat_missed", {
                name: att.name,
              }),
              "grey",
            );
          global.flags.msd = true;
          giveSkExp(skl.evas, 0.5);
          return 0;
        }
    }
    dmg = Math.round(atk.f(att, def, power));
    def.hp -= dmg;
    // A blow that landed with fire behind it can set what it hit alight. dmg_calc
    // leaves the element it resolved in global.atype_d, and 3 is fire; a torch and the
    // Scorpion Sceptre are the two weapons in the game that carry it, plus any ability
    // whose own aff says so.
    //
    // The chance rises with how hard the blow was relative to what it hit, so a
    // scratch rarely catches and a heavy hit usually does, and it is checked against
    // the target's own res.burn -- a value every creature in the game has carried
    // since before this fork with nothing ever reading it, because there was no burn
    // to resist. The fire then does a fraction of the blow per tick, which is what
    // keeps it a follow-up rather than a second attack.
    if (dmg > 0 && global.atype_d === 3) {
      const share = def.hpmax > 0 ? dmg / def.hpmax : 0;
      const catches = Math.min(0.5, 0.12 + share * 2) * (def.res.burn ?? 1);
      if (random() < catches)
        giveEff(def, effect.brn, 6, Math.max(1, Math.ceil(dmg * 0.15)));
    }
    global.flags.msd = false;
    if (
      global.flags.m_blh === false &&
      !global.flags.multih &&
      global.flags.m_blh === false
    )
      printHitMessage(att.name, dmg, att.id === you.id ? false : true);
    if (isyou === true) {
      dom.d8_2.innerHTML = i18n.t("ui.hud.criticalChance", {
        chance:
          Math.round(
            you.mods.crflt * 1000 +
              ((you.crt * (2 - (you.sat / you.satmax + you.mods.sbonus) * 2) +
                you.crt) *
                (you.luck / 25 + 1) +
                skl.seye.use()) *
                1000,
          ) / 10,
      });
      if (you.eqp[0].id != 10000)
        you.eqp[0].dp > 0 ? (you.eqp[0].dp -= 0.008) : (you.eqp[0].dp = 0);
      global.stat.dmgdt += dmg;
      if (global.flags.eshake === true) {
        dom.d1m.style.left = parseInt(global.special_x) + rand(-3, 3) + "px";
        dom.d1m.style.top = parseInt(global.special_y) + rand(-3, 3) + "px";
        setTimeout(() => {
          dom.d1m.style.left = parseInt(global.special_x) + "px";
          dom.d1m.style.top = parseInt(global.special_y) + "px";
        }, 60);
      }
    } else {
      if (global.target.id !== 10000)
        global.target.dp > 0
          ? (global.target.dp -= 0.008)
          : (global.target.dp = 0);
      if (you.eqp[1].id !== 10000)
        you.eqp[1].dp > 0 ? (you.eqp[1].dp -= 0.008) : (you.eqp[1].dp = 0);
      if (dmg > 0) giveSkExp(skl.painr, 1);
      if (global.target.id === 10000 && dmg > 0)
        giveSkExp(skl.tghs, dmg * 0.05);
      global.stat.dmgrt += dmg;
    }
  } else {
    global.miss++;
    global.stat.misst++;
    if (
      global.flags.m_blh === false &&
      !global.flags.multih &&
      global.flags.m_blh === false
    )
      msg(
        i18n.t("runtime.ui.interface.dialogue.combat_missed", {
          name: att.name,
        }),
        "grey",
      );
    global.flags.msd = true;
    if (dk) giveSkExp(skl.ntst, 0.01);
    if (!isyou) global.stat.dodgt++;
  }
  update_d();
  if (!global.flags.multih) {
    if (isyou && dmg >= def.hpmax) global.stat.onesht++;
    if (def.hp <= 0 && def.alive === true) {
      global.atkdfty = [3, global.atkdftydt];
      def.onDeath(att);
      def.onDeathE(att);
    }
  }
  return dmg || 0;
}

function tattack(pow, type, e) {
  let dmg;
  const ddat = skl.thr.use();
  const m = global.current_m;
  global.atkdftm[0] = type;
  let agl_bonus = 0;
  const spd = m.spd > 0 ? m.spd : 0;
  for (let i = 0; i < you.eqp.length; i++) agl_bonus += you.eqp[i].agl;
  const hit =
    (((you.agl + agl_bonus / 2) * you.efficiency()) / (spd * 5 + m.agl)) * 130 +
    5 +
    ddat.b;
  giveSkExp(skl.thr, e);
  giveSkExp(skl.fgt, skl.thr.lvl * 5 + 1);
  if (rand(100) < hit) {
    dmg = Math.round(
      ((1 + you.str_r * 0.05) * (you.efficiency() + 1) * pow * (ddat.a + 1)) /
        2,
    );
    global.stat.dmgdt += dmg;
    if (!global.flags.m_blh)
      msg(
        i18n.t("runtime.ui.interface.dialogue.player_hit", {
          enemy: global.current_m.name,
          damage: dmg,
        }),
        "yellow",
      );
    global.current_m.hp -= dmg;
    if (m.hp <= 0 && m.alive === true) {
      m.onDeath(you);
      m.onDeathE();
    }
    dom.d5_1_1m.update();
    if (global.flags.eshake === true) {
      dom.d1m.style.left = parseInt(global.special_x) + rand(-3, 3) + "px";
      dom.d1m.style.top = parseInt(global.special_y) + rand(-3, 3) + "px";
      setTimeout(() => {
        dom.d1m.style.left = parseInt(global.special_x) + "px";
        dom.d1m.style.top = parseInt(global.special_y) + "px";
      }, 60);
    }
  } else {
    if (global.flags.m_blh === false)
      msg(
        i18n.t("runtime.ui.interface.dialogue.combat_missed", {
          name: you.name,
        }),
        "grey",
      );
  }
}

function dmg_calc(att, def, atk) {
  const isyou = att.id === you.id;
  const atea = atk.aff || isyou ? att.eqp[0].atype : att.atype;
  const atcs = atk.class || isyou ? att.eqp[0].ctype : att.ctype;
  global.atype_d = atk.aff || att.atype;
  const ta =
    effect.tarnish.active === true
      ? 0.7
      : effect.prostasia.active === true
        ? 1.3
        : 1;
  const eff = you.efficiency();
  let dmg = 0;
  let b = 1;
  if (atk.stt === 1) {
    if (isyou === true) {
      global.atype_d = atk.aff || you.eqp[0].atype;
      global.atkdftm = [atea, atcs, 0];
      const b = you.luck / 25 + 1;
      let undc = 0;
      if (you.eqp[0].id === 10000) undc = you.mods.undc;
      // Held on its own so the landed-blow floor below has something to take a
      // share of. The expression is otherwise unchanged.
      const swing =
        ((att.str * eff +
          ((weaponPower(att.eqp[0]) + undc) *
            (att.eqp[0].dp / att.eqp[0].dpmax) *
            0.9 +
            0.1) *
            (att.eqp[0].id === 10000 ? 1 : ta)) *
          (100 +
            (att.eqp[0].aff[atea] * 10 +
              atk.affp * 10 +
              att.eqp[0].cls[atcs] * 10 +
              att.maff[global.current_m.type] * 10 +
              att.aff[atea] * 10) *
              (att.eqp[0].id === 10000 ? 1 : ta))) /
        100;
      // Mastery in the weapon being held also tells against the target's armour, not
      // only on the player's own strength. Training a weapon taught you where the
      // gaps in a guard are, so each level takes a point off the class resistance
      // that would otherwise be multiplied by five into the subtracted term. It
      // cannot take it below zero: mastery finds the weak point, it does not turn
      // armour into a liability.
      //
      // This exists because the strength bonus alone left the whole of a creature's
      // armour standing whatever the player knew, and armour is subtracted flat --
      // so against a well-armoured target a trained weapon and an untrained one came
      // to nearly the same nothing.
      const pierced = Math.max(0, def.cls[atcs] - playerWeaponMastery().lvl);
      dmg =
        swing - (def.str * (100 + def.aff[atea] * 5 + pierced * 5)) / 100 + 1;
      // See minimumLandedDamage: a hit that connected must be worth something, or a
      // creature whose armour exceeds the player's whole output becomes immune rather
      // than merely hard, silently and permanently.
      const floor = minimumLandedDamage(swing);
      if (dmg < floor) dmg = floor;
    } else {
      // A shield's affinity scales the shield's own contribution, the way armour's
      // affinity scales armour's just below and the way a creature's scales its own
      // in the branch above. It used to be subtracted from the mitigation instead,
      // and from the sum of armour *and* shield rather than from the shield alone,
      // which inverted the whole point of carrying one: with a statted shield and
      // any Shield skill the term went negative, so a better shield and more
      // training in the skill that uses it both raised the damage taken.
      //
      // The outer factor is left exactly as it was on purpose. Armour's class
      // resistance appears in it a second time with the opposite sign, which is a
      // real bug of its own, but it is also what currently keeps combat dangerous
      // at all -- correcting it as well makes an unshielded player take a quarter
      // of the damage they take today. That is a balance decision rather than a
      // fix, so it is written up in docs/PROPOSALS.md instead of made here.
      const shdc = 1 + skl.shdc.lvl / 20;
      const shield =
        ((((you.eqp[1].str * shdc * (you.eqp[1].dp / you.eqp[1].dpmax) * 0.6 +
          0.4) *
          ta) /
          2) *
          (100 + you.eqp[1].aff[att.atype] * 5 * shdc)) /
        100;
      dmg =
        (att.str *
          (100 +
            att.eqp[0].aff[att.atype] * 10 +
            atk.affp * 10 +
            att.eqp[0].cls[att.ctype] * 10)) /
          100 -
        ((((def.str * eff +
          global.target.str *
            ((global.target.dp / global.target.dpmax) * 0.85 + 0.15) *
            ta) *
          (100 +
            global.target.aff[att.atype] * 5 * ta +
            global.target.cls[att.ctype] * 5 * ta +
            you.caff[att.atype] * 10 +
            you.cmaff[global.current_m.type] * 10 +
            you.ccls[att.ctype] * 10)) /
          100 +
          shield) *
          (100 - global.target.cls[att.ctype] * 5 * shdc * ta)) /
          100;
      b = 1;
    }
  } else if (atk.stt === 2) {
    if (isyou === true) {
      global.atype_d = atk.aff || you.eqp[0].atype;
      const b = you.luck / 20 + 1;
      dmg =
        ((att.int * eff +
          (att.eqp[0].int * (att.eqp[0].dp / att.eqp[0].dpmax) * 0.9 + 0.1) *
            (att.eqp[0].id === 10000 ? 1 : ta)) *
          (100 +
            (att.eqp[0].aff[atea] * 10 +
              atk.affp * 10 +
              att.eqp[0].cls[atcs] * 10 +
              att.maff[global.current_m.type] * 10 +
              att.aff[atea] * 10) *
              (att.eqp[0].id === 10000 ? 1 : ta))) /
          100 -
        (def.int * (100 + def.aff[atea] * 5 + def.cls[atcs] * 5)) / 100 +
        1;
    } else {
      // Same correction as the physical branch above, and the same deliberate
      // decision to leave the outer factor alone.
      const shdc = 1 + skl.shdc.lvl / 20;
      const shield =
        ((((you.eqp[1].int * shdc * (you.eqp[1].dp / you.eqp[1].dpmax) * 0.6 +
          0.4) *
          ta) /
          2) *
          (100 + you.eqp[1].aff[att.atype] * 5 * shdc)) /
        100;
      dmg =
        (att.int *
          (100 +
            att.eqp[0].aff[att.atype] * 15 +
            atk.affp * 15 +
            att.eqp[0].cls[att.ctype] * 5)) /
          100 -
        ((((def.int * eff +
          global.target.int *
            ((global.target.dp / global.target.dpmax) * 0.85 + 0.15) *
            ta) *
          (100 +
            global.target.aff[att.atype] * 5 * ta +
            global.target.cls[att.ctype] * 5 * ta +
            you.caff[att.atype] * 10 +
            you.cmaff[global.current_m.type] * 10 +
            you.ccls[att.ctype] * 10)) /
          100 +
          shield) *
          (100 - global.target.cls[att.ctype] * 5 * shdc * ta)) /
          100;
      b = 1;
    }
  }
  const ran = random();
  let c = 0;
  if (isyou === true) c = skl.seye.use();
  const ctr_r =
    (att.crt * (2 - (you.sat / you.satmax + you.mods.sbonus) * 2) + att.crt) *
      b +
    c +
    you.mods.crflt;
  if (isyou === false && dmg > 0) {
    switch (global.atype_d) {
      case 1:
        giveSkExp(skl.aba, dmg * 0.01);
        break;
      case 2:
        giveSkExp(skl.abe, dmg * 0.01);
        break;
      case 3:
        giveSkExp(skl.abf, dmg * 0.01);
        break;
      case 4:
        giveSkExp(skl.abw, dmg * 0.01);
        break;
      case 5:
        giveSkExp(skl.abl, dmg * 0.01);
        break;
      case 6:
        giveSkExp(skl.abd, dmg * 0.01);
        break;
    }
    global.atkdftydt.a = atea;
    global.atkdftydt.c = atcs;
    global.atkdftydt.id = att.id;
  }
  // Pain Resistance, and only when the player is the one being hit. Clamped through
  // the same helper the poison and corruption resistances use: painr.use() is
  // lvl * 0.004, so it reaches 1 at level 250 and passes it above that, which would
  // turn the multiplier negative. Damage is floored at zero further down so it could
  // never actually heal, but a resistance that silently becomes total immunity is not a
  // resistance -- and js/data/effects.js already carries this exact clamp with the
  // comment explaining why, for skills that cross the same line at level 20.
  const pn = isyou === true ? 1 : resistanceFactor(skl.painr.use());
  dmg = dmg * def.res.ph * pn;
  if (ran < ctr_r) {
    let cpw = 1;
    let dmod = 1;
    let cbst = 1;
    if (isyou === true) {
      giveSkExp(skl.seye, 1);
      cpw = you.mods.cpwr;
      cbst = 1 + skl.war.use();
      dom.d1m.style.left = parseInt(global.special_x) + rand(-3, 3) + "px";
      dom.d1m.style.top = parseInt(global.special_y) + rand(-3, 3) + "px";
      setTimeout(() => {
        dom.d1m.style.left = parseInt(global.special_x) + "px";
        dom.d1m.style.top = parseInt(global.special_y) + "px";
      }, 60);
    } else {
      giveSkExp(skl.dngs, 1);
      sk = skl.dngs.use();
      dmod = 1 - sk * (sk > 25 ? 0.01 : 0.02);
    }
    if (dmg <= 0) dmg = 0;
    cdmg = dmg * randf(1.9 * cpw, 2.1 * cpw) * 0.5 * dmod * cbst;
    global.flags.crti = true;
    return dmg + cdmg <= 1
      ? rand(1, 5)
      : Math.ceil((dmg + cdmg) * att.dmlt * randf(0.9, 1.1)) + rand(1, 5);
  } else return dmg > 0 ? Math.ceil(dmg * att.dmlt * randf(0.9, 1.1)) : 0;
}

// A blow the player landed must never come to nothing. Mitigation is subtracted flat
// from the attack and the result is floored at zero, so a creature whose armour
// happens to exceed the player's whole output stops taking damage entirely -- not
// slowly, not for a little, but never, with no message and no error. The combat log
// reads "x5(5) total 0" and there is nothing to do but leave.
//
// This is the safety net rather than the balance: a landed hit returns a small share
// of what it was worth, so a fight that is far too hard is a long fight instead of an
// impossible one. It is deliberately only the player's outgoing damage. Flooring what
// a creature deals to the player would mean armour could never fully stop anything,
// which is the opposite of what armour is for.
const MINIMUM_LANDED_SHARE = 0.05;

function minimumLandedDamage(attackTerm) {
  return Math.max(1, Math.floor(attackTerm * MINIMUM_LANDED_SHARE));
}

function hit_calc(tp) {
  if (tp === 1) {
    let agl_bonus = 0;
    const spd = global.current_m.spd > 0 ? global.current_m.spd : 0;
    for (let i = 0; i < you.eqp.length; i++) agl_bonus += you.eqp[i].agl;
    //return (200 + ((you.agl+agl_bonus)*you.efficiency()) - (global.current_m.spd+global.current_m.agl+100/(100*you.efficiency())*100));
    return (
      (((you.agl + agl_bonus / 2) * you.efficiency()) /
        (spd + global.current_m.agl + global.current_m.eva)) *
        130 +
      5
    );
  } else if (tp === 2) {
    let agl_bonus = 0;
    const spd = you.spd > 0 ? you.spd : 0;
    for (let i = 0; i < you.eqp.length; i++) agl_bonus += you.eqp[i].agl;
    return (
      (global.current_m.agl /
        ((spd + you.agl + agl_bonus / 2) * you.efficiency())) *
        100 +
      10 -
      skl.evas.lvl
    );
    //return (210 + global.current_m.agl - (you.spd+you.agl+100*(100*you.efficiency())/100));
  }
}

function wpnhitstt() {
  switch (you.eqp[0].wtype) {
    case 0:
      global.stat.msts[0][0]++;
      break;
    case 1:
      global.stat.msts[1][0]++;
      break;
    case 2:
      global.stat.msts[2][0]++;
      break;
    case 3:
      global.stat.msts[3][0]++;
      break;
    case 4:
      global.stat.msts[4][0]++;
      break;
    case 5:
      global.stat.msts[5][0]++;
      break;
    case 6:
      global.stat.msts[6][0]++;
      break;
    case 7:
      global.stat.msts[7][0]++;
      break;
  }
}

function wpndiestt(killer, me) {
  switch (killer.eqp[0].wtype) {
    case 0:
      global.stat.msts[0][1]++;
      break;
    case 1:
      global.stat.msts[1][1]++;
      break;
    case 2:
      global.stat.msts[2][1]++;
      break;
    case 3:
      global.stat.msts[3][1]++;
      break;
    case 4:
      global.stat.msts[4][1]++;
      break;
    case 5:
      global.stat.msts[5][1]++;
      break;
    case 6:
      global.stat.msts[6][1]++;
      break;
    case 7:
      global.stat.msts[7][1]++;
      break;
  }
  switch (me.type) {
    case 0:
      global.stat.msks[0]++;
      break;
    case 1:
      global.stat.msks[1]++;
      break;
    case 2:
      global.stat.msks[2]++;
      break;
    case 3:
      global.stat.msks[3]++;
      break;
    case 4:
      global.stat.msks[4]++;
      break;
    case 5:
      global.stat.msks[5]++;
      break;
  }
}
