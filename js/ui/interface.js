// Interface construction and rendering. Builds the panels, inventory, crafting
// and settings windows, hover tooltips, message log, and save bar, and holds
// the update functions the rest of the game calls to refresh them. This module
// runs after the data and world modules, so everything it renders already
// exists by the time the DOM is built.

dom.d0 = addElement(document.body, "div", "player-panel", "d combat-panel");
if (!global.flags.aw_u) dom.d0.style.display = "none";
dom.d1 = addElement(dom.d0, "div");
dom.d101 = addElement(dom.d0, "div", "se_i");
dom.d2c = addElement(dom.d1, "div", null, "d2");
dom.d2 = addElement(dom.d2c, "div");
dom.d2.innerHTML = you.name;
dom.d2_a = addElement(dom.d2c, "input", "nch");
dom.d2_a.addEventListener("focusin", function () {
  dom.d2_a.value = you.name;
  you.name = "";
  dom.d2.innerHTML = "　";
});
dom.d2_a.addEventListener("focusout", function () {
  you.name = dom.d2_a.value;
  dom.d2_a.value = "";
  dom.d2.innerHTML = you.name;
});
addDesc(dom.d2c, null, 2, you.name, you.desc);
dom.d3 = addElement(dom.d1, "div", null, "d3");
dom.d3.innerHTML = i18n.t("ui.hud.levelTitle", {
  level: you.lvl,
  title: you.title.name,
});
// Rarity colouring for titles. This lived only inside the hover description, so
// the selection list showed every title in the same colour and a second- or
// third-class title was indistinguishable from a common one until the player
// hovered each row in turn. Shared now, so the list and the tooltip cannot drift.
function titleRarityStyle(rar) {
  switch (rar) {
    case 0:
      return { color: "grey", shadow: "" };
    case 2:
      return { color: "cyan", shadow: "0px 0px 1px blue" };
    case 3:
      return { color: "lime", shadow: "0px 0px 2px lime" };
    case 4:
      return { color: "yellow", shadow: "0px 0px 3px orange" };
    case 5:
      return { color: "orange", shadow: "0px 0px 2px crimson,0px 0px 5px red" };
    default:
      return { color: "", shadow: "" };
  }
}

dom.d3.addEventListener("click", function () {
  if (!global.flags.ttlscrnopn) {
    global.flags.ttlscrnopn = true;
    dom.ttlcont = addElement(document.body, "div", "youttlc");
    dom.ttlhead = addElement(dom.ttlcont, "div", "youttlh");
    dom.ttlhead.innerHTML = i18n.t(
      "runtime.ui.interface.interface.select_your_title_95546199",
    );
    dom.ttlbd = addElement(dom.ttlcont, "div");
    dom.ttlbd.style.overflow = "auto";
    dom.ttlbd.style.maxHeight = window.innerHeight - 130 + "px";
    for (const obj in global.titles) {
      this.ttlent = addElement(dom.ttlbd, "div", null, "youttl");
      const title = global.titles[obj];
      if (obj === 0) this.ttlent.style.borderTop = "";
      this.ttlent.innerHTML = '"' + title.name + '"';
      if (global.titles[obj].talent)
        this.ttlent.innerHTML += i18n.t(
          "runtime.ui.interface.interface.text_967e8514",
        );
      const rarity = titleRarityStyle(title.rar);
      this.ttlent.style.color = rarity.color;
      this.ttlent.style.textShadow = rarity.shadow;
      // The rank was only ever readable by hovering the row. Added after the
      // innerHTML writes above, which would otherwise discard the element.
      this.ttlrank = addElement(this.ttlent, "small", null, "youttl__rank");
      this.ttlrank.innerHTML = i18n.t("ui.titles.rankBadge", {
        rank: title.id === 0 ? 0 : title.rar,
      });
      if (title.rars === true) this.ttlrank.innerHTML += "★";
      addDesc(this.ttlent, title, 5);
      this.ttlent.addEventListener("click", function () {
        you.title = title;
        empty(dom.ttlcont);
        document.body.removeChild(dom.ttlcont);
        dom.d3.innerHTML = i18n.t("ui.hud.levelTitle", {
          level: you.lvl,
          title: you.title.name,
        });
        empty(global.dscr);
        global.dscr.style.display = "none";
        global.flags.ttlscrnopn = false;
      });
    }
  }
});
addDesc(dom.d3, you.title, 5, true);
//dom.d5 = addElement(dom.d1,'div','d5'); ???????
dom.d5_1 = addElement(dom.d1, "div", null, "hp");
dom.d5_2 = addElement(dom.d1, "div", null, "exp");
dom.d5_3 = addElement(dom.d1, "div", null, "en");
addDesc(
  dom.d5_1,
  null,
  2,
  i18n.t("runtime.ui.interface.description.health_3703cd21"),
  function () {
    return i18n.t("ui.statDescriptions.health", {
      potential: (you.stat_p[0] * 100) << 0,
    });
  },
  true,
);
addDesc(
  dom.d5_2,
  null,
  2,
  i18n.t("runtime.ui.interface.description.experience_5b5aafe6"),
  function () {
    return i18n.t("ui.statDescriptions.experience", {
      potential: (you.exp_t * 100) << 0,
      current: (you.exp_t * 100 * you.efficiency()) << 0,
    });
  },
  true,
);
addDesc(
  dom.d5_3,
  null,
  2,
  i18n.t("runtime.ui.interface.description.energy_meter_b53c9846"),
  function () {
    const lose = Math.round(satiationDrain() * 1000) / 1000;
    return i18n.t("ui.statDescriptions.energy", {
      effectiveness: ((you.mods.sbonus + 1) * 100) << 0,
      consumption: lose,
    });
  },
  true,
);
dom.d5_1_1 = addElement(dom.d5_1, "div", "hpp");
dom.d5_2_1 = addElement(dom.d5_2, "div", "expp");
dom.d5_3_1 = addElement(dom.d5_3, "div", "enn");
dom.d6 = addElement(dom.d1, "div", "d6");
addDesc(
  dom.d6,
  null,
  2,
  i18n.t("runtime.ui.interface.description.power_rank_0f6b6c76"),
  i18n.t(
    "runtime.ui.interface.description.your_power_position_in_this_realm_the_lower_72d8a837",
  ),
);
dom.d4 = addElement(dom.d1, "div", "d4");
dom.d4_1 = addElement(dom.d4, "span", null, "dd");
dom.d4_2 = addElement(dom.d4, "span", null, "dd");
dom.d4_3 = addElement(dom.d4, "span", null, "dd");
dom.d4_4 = addElement(dom.d4, "span", null, "dd");
addDesc(
  dom.d4_1,
  null,
  2,
  i18n.t("runtime.ui.interface.description.physical_strength_9965efa3"),
  function () {
    return i18n.t("ui.statDescriptions.strength", {
      potential: (you.stat_p[1] * 100) << 0,
    });
  },
  true,
);
addDesc(
  dom.d4_2,
  null,
  2,
  i18n.t("runtime.ui.interface.description.agility_0fc9a6ed"),
  function () {
    return i18n.t("ui.statDescriptions.agility", {
      potential: (you.stat_p[2] * 100) << 0,
    });
  },
  true,
);
addDesc(
  dom.d4_3,
  null,
  2,
  i18n.t("runtime.ui.interface.description.mental_acuity_7e567d10"),
  function () {
    return i18n.t("ui.statDescriptions.intelligence", {
      potential: (you.stat_p[3] * 100) << 0,
    });
  },
  true,
);
addDesc(
  dom.d4_4,
  null,
  2,
  i18n.t("runtime.ui.interface.description.speed_2d2cb022"),
  i18n.t(
    "runtime.ui.interface.description.allows_for_faster_attacks_and_multihit_combos_aa1a7430",
  ),
);
dom.d7 = addElement(dom.d1, "div", "eq_w");
dom.d7_1 = addElement(dom.d7, "div", null, "ddd_2");
dom.d7_slot_1 = addElement(dom.d7_1, "div", null, "ddd_1");
dom.d7_slot_1.innerHTML = i18n.t(
  "runtime.ui.interface.interface.weapon_ead53368",
);
dom.d7_slot_1.style.color = "grey";
dom.d7_slot_2 = addElement(dom.d7_1, "div", null, "ddd_1");
dom.d7_slot_2.innerHTML = i18n.t(
  "runtime.ui.interface.interface.shield_08271419",
);
dom.d7_slot_2.style.color = "grey";
dom.d7_2 = addElement(dom.d7, "div", null, "ddd_2");
dom.d7_slot_3 = addElement(dom.d7_2, "div", null, "ddd_1");
dom.d7_slot_3.innerHTML = i18n.t(
  "runtime.ui.interface.interface.head_e5ffd15b",
);
dom.d7_slot_3.style.color = "grey";
dom.d7_slot_4 = addElement(dom.d7_2, "div", null, "ddd_1");
dom.d7_slot_4.innerHTML = i18n.t(
  "runtime.ui.interface.interface.body_718a7e8a",
);
dom.d7_slot_4.style.color = "grey";
dom.d7_3 = addElement(dom.d7, "div", null, "ddd_2");
dom.d7_slot_5 = addElement(dom.d7_3, "div", null, "ddd_1");
dom.d7_slot_5.innerHTML = i18n.t(
  "runtime.ui.interface.interface.l_arm_f647d25e",
);
dom.d7_slot_5.style.color = "grey";
dom.d7_slot_6 = addElement(dom.d7_3, "div", null, "ddd_1");
dom.d7_slot_6.innerHTML = i18n.t(
  "runtime.ui.interface.interface.r_arm_8182b52d",
);
dom.d7_slot_6.style.color = "grey";
dom.d7_4 = addElement(dom.d7, "div", null, "ddd_2");
dom.d7_slot_7 = addElement(dom.d7_4, "div", null, "ddd_1");
dom.d7_slot_7.innerHTML = i18n.t(
  "runtime.ui.interface.interface.legs_29518d04",
);
dom.d7_slot_7.style.color = "grey";
dom.d7_slot_8 = addElement(dom.d7_4, "div", null, "ddd_1");
dom.d7_slot_8.innerHTML = i18n.t(
  "runtime.ui.interface.interface.accessory_962403f6",
);
dom.d7_slot_8.style.color = "grey";
dom.d7_5 = addElement(dom.d7, "div", null, "ddd_2");
dom.d7_5.style.borderBottom = "solid 2px rgb(12,86,195)";
dom.d7_slot_9 = addElement(dom.d7_5, "div", null, "ddd_1");
dom.d7_slot_9.innerHTML = i18n.t(
  "runtime.ui.interface.interface.locked_d8b8028c",
);
dom.d7_slot_9.style.color = "grey";
dom.d7_slot_10 = addElement(dom.d7_5, "div", null, "ddd_1");
dom.d7_slot_10.innerHTML = i18n.t(
  "runtime.ui.interface.interface.locked_d8b8028c",
);
dom.d7_slot_10.style.color = "grey";
dom.d8 = addElement(dom.d1, "div");
dom.d8.style.fontSize = ".9em";
dom.d8.style.paddingTop = "5px";
dom.d8_2 = addElement(dom.d1, "div");
dom.d8_2.style.fontSize = ".7em";
if (typeof InstallTrigger == "undefined") dom.d8_2.style.paddingTop = "5px";
dom.d8_2.innerHTML = i18n.t("ui.hud.criticalChance", {
  chance: (you.mods.crflt + you.crt) * 100,
});
// Luck sits with the derived chances rather than with the combat stats: it is
// not a stat the player trains, and it feeds the critical and drop rolls shown
// on this line.
dom.d8_3 = addElement(dom.d1, "div");
dom.d8_3.style.fontSize = ".7em";
addDesc(
  dom.d8_3,
  null,
  2,
  i18n.t("ui.statDescriptions.luckTitle"),
  i18n.t("ui.statDescriptions.luck"),
);
dom.d7_slot_3.addEventListener("mouseenter", function () {
  global._tad = this.innerHTML;
  this.innerHTML = i18n.t("ui.hud.defense", {
    value: Math.round(
      you.eqp[2].str * (you.eqp[2].dp / you.eqp[2].dpmax) +
        you.str_r +
        you.eqp[1].str * (you.eqp[1].dp / you.eqp[1].dpmax),
    ),
  });
});
dom.d7_slot_3.addEventListener("mouseleave", function () {
  this.innerHTML = global._tad;
});
dom.d7_slot_4.addEventListener("mouseenter", function () {
  global._tad = this.innerHTML;
  this.innerHTML = i18n.t("ui.hud.defense", {
    value: Math.round(
      you.eqp[3].str * (you.eqp[3].dp / you.eqp[3].dpmax) +
        you.str_r +
        you.eqp[1].str * (you.eqp[1].dp / you.eqp[1].dpmax),
    ),
  });
});
dom.d7_slot_4.addEventListener("mouseleave", function () {
  this.innerHTML = global._tad;
});
dom.d7_slot_5.addEventListener("mouseenter", function () {
  global._tad = this.innerHTML;
  this.innerHTML = i18n.t("ui.hud.defense", {
    value: Math.round(
      you.eqp[4].str * (you.eqp[4].dp / you.eqp[4].dpmax) +
        you.str_r +
        you.eqp[1].str * (you.eqp[1].dp / you.eqp[1].dpmax),
    ),
  });
});
dom.d7_slot_5.addEventListener("mouseleave", function () {
  this.innerHTML = global._tad;
});
dom.d7_slot_6.addEventListener("mouseenter", function () {
  global._tad = this.innerHTML;
  this.innerHTML = i18n.t("ui.hud.defense", {
    value: Math.round(
      you.eqp[5].str * (you.eqp[5].dp / you.eqp[5].dpmax) +
        you.str_r +
        you.eqp[1].str * (you.eqp[1].dp / you.eqp[1].dpmax),
    ),
  });
});
dom.d7_slot_6.addEventListener("mouseleave", function () {
  this.innerHTML = global._tad;
});
dom.d7_slot_7.addEventListener("mouseenter", function () {
  global._tad = this.innerHTML;
  this.innerHTML = i18n.t("ui.hud.defense", {
    value: Math.round(
      you.eqp[6].str * (you.eqp[6].dp / you.eqp[6].dpmax) +
        you.str_r +
        you.eqp[1].str * (you.eqp[1].dp / you.eqp[1].dpmax),
    ),
  });
});
dom.d7_slot_7.addEventListener("mouseleave", function () {
  this.innerHTML = global._tad;
});
dom.d1m = addElement(document.body, "div", "enemy-panel", "d combat-panel");
if (!global.flags.aw_u) dom.d1m.style.display = "none";
dom.d101m = addElement(dom.d1m, "div", "se_i");
dom.d1m.style.top = "8px";
dom.d1m.style.left = "457px";
dom.d1m.style.position = "absolute";
// Three strips share the bottom of the enemy panel: these effect icons, the
// battle control row (#bbts, bottom 25px) and the area readout (#ainfo, bottom
// 5px). #se_i contributes bottom:5px and this only ever set a top offset, so the
// box stretched across both rows below it while its 20px icons stayed top-aligned
// — and they landed on the control row from the very first effect an enemy
// carried, which in rain or cold is every enemy that spawns. A definite row
// height keeps this a row, and 255px leaves 2px of air above #bbts.
dom.d101m.style.top = "255px";
dom.d101m.style.height = "20px";
global.special_x = dom.d1m.style.left;
global.special_y = dom.d1m.style.top;

/*dom.d1m.addEventListener('mousedown',function(){
  this.style.left=parseInt(global.special_x)+rand(-5,5)+'px';
  this.style.top=parseInt(global.special_y)+rand(-5,5)+'px';
});
dom.d1m.addEventListener('mouseup',function(){
  this.style.left=parseInt(global.special_x)+'px';
  this.style.top=parseInt(global.special_y)+'px';
});*/
dom._d23m = addElement(dom.d1m, "div");
addDesc(dom._d23m, null, 3, global.current_m.name, global.current_m.desc);
dom.d2m = addElement(dom._d23m, "div", null, "d2");
dom.d3m = addElement(dom._d23m, "div", null, "d3m");
dom.d5_1m = addElement(dom.d1m, "div", null, "hp");
dom.d5_2m = addElement(dom.d1m, "div", null, "exp");
dom.d5_1_1m = addElement(dom.d5_1m, "div", "hpp");
dom.d5_2_1m = addElement(dom.d5_2m, "div");
dom.d5_1_1m.update = function () {
  this.innerHTML = i18n.t("ui.hud.health", {
    current: format3(global.current_m.hp.toString()),
    max: format3(global.current_m.hpmax.toString()),
  });
  dom.d5_1m.style.width =
    (100 * global.current_m.hp) / global.current_m.hpmax + "%";
};
dom.d4m = addElement(dom.d1m, "div", "d4");
dom.d4_1m = addElement(dom.d4m, "span", null, "dd");
dom.d4_2m = addElement(dom.d4m, "span", null, "dd");
dom.d4_3m = addElement(dom.d4m, "span", null, "dd");
dom.d4_4m = addElement(dom.d4m, "span", null, "dd");
dom.d9m = addElement(dom.d1m, "div");
dom.d9m.update = function () {
  this.innerHTML = i18n.t("ui.hud.rank", {
    rank: global.text.eranks[global.current_m.rnk],
  });
  if (global.current_m.rnk <= 4) this.style.color = "lightgrey";
  else if (global.current_m.rnk > 4 && global.current_m.rnk <= 7)
    this.style.color = "white";
  else if (global.current_m.rnk > 7 && global.current_m.rnk <= 10)
    this.style.color = "lightblue";
  else if (global.current_m.rnk > 10 && global.current_m.rnk <= 13)
    this.style.color = "lightgreen";
  else if (global.current_m.rnk > 13 && global.current_m.rnk <= 16)
    this.style.color = "lime";
  else if (global.current_m.rnk > 16 && global.current_m.rnk <= 19)
    this.style.color = "yellow";
};
dom.d9m.style.borderBottom = "#545299 dotted 2px";
dom.d9m.style.backgroundColor = "#272744";
dom.d8m_c = addElement(dom.d1m, "small", "bbts");
dom.d8m1 = addElement(dom.d8m_c, "div", null, "bbts");
dom.d8m1.innerHTML = i18n.t(
  "runtime.ui.interface.interface.pause_next_battle_nbspoff_1b765858",
);
dom.d8m1.addEventListener("click", function () {
  if (global.flags.to_pause === true) {
    if (!global.flags.civil) global.flags.btl = true;
    global.flags.to_pause = false;
    this.innerHTML = i18n.t(
      "runtime.ui.interface.interface.pause_next_battle_nbspoff_1b765858",
    );
  } else {
    global.flags.to_pause = true;
    this.innerHTML = i18n.t(
      "runtime.ui.interface.interface.pause_next_battle_nbspon_ff0ff553",
    );
  }
});
dom.d8m2 = addElement(dom.d8m_c, "div", null, "bbts");
dom.d8m2.innerHTML = i18n.t(
  "runtime.ui.interface.interface.resume_the_fight_76300b23",
);
dom.d8m2.style.right = "0px";
dom.d8m2.style.position = "absolute";
dom.d8m2.addEventListener("click", function () {
  if (!global.flags.civil) global.flags.btl = true;
});
dom.d7m_c = addElement(dom.d1m, "div", "ainfo");
dom.d7m = addElement(dom.d7m_c, "small");
dom.d7m.update = function () {
  this.innerHTML = i18n.t("ui.hud.area", {
    area: global.current_z.name,
    remaining: global.current_z.size >= 0 ? global.current_z.size : "∞",
  });
};
dom.d7m.update();
dom.inv_ctx = addElement(document.body, "div", "inv");
if (!global.flags.aw_u) dom.inv_ctx.style.display = "none";
dom.inventory = addElement(dom.inv_ctx, "div", "inv_body");
dom.inv_control = addElement(dom.inventory, "div", "inv_control");
dom.inv_btn_1 = addElement(dom.inv_control, "div", null, "bts");
dom.inv_btn_2 = addElement(dom.inv_control, "div", null, "bts");
dom.inv_btn_3 = addElement(dom.inv_control, "div", null, "bts");
dom.inv_btn_4 = addElement(dom.inv_control, "div", null, "bts");
dom.inv_btn_5 = addElement(dom.inv_control, "div", null, "bts");
dom.inv_ctx_b = addElement(dom.inventory, "div", "inv_ctx_b");
dom.inv_control_b = addElement(dom.inv_ctx, "div", "inv_control_b");
dom.inv_btn_1_b = addElement(dom.inv_control_b, "div", null, "bts_b");
dom.inv_btn_2_b = addElement(dom.inv_control_b, "div", null, "bts_b");
dom.inv_btn_3_b = addElement(dom.inv_control_b, "div", null, "bts_b");
dom.mn = addElement(dom.inv_control_b, "div", "mn");
dom.mn_1 = addElement(dom.mn, "small", "mnb");
dom.mn_1.innerHTML = "㊧0";
dom.mn_2 = addElement(dom.mn, "small", "mnb");
dom.mn_2.innerHTML = "●0";
dom.mn_3 = addElement(dom.mn, "small", "mnb");
dom.mn_3.innerHTML = "●0";
dom.mn_4 = addElement(dom.mn, "small", "mnb");
dom.mn_4.innerHTML = "●0";
dom.mn_1.style.textShadow = "red -1px 1px 0px, crimson 2px 0px 0px";
dom.mn_1.style.backgroundColor = "darkred";
dom.mn_1.style.color = "chartreuse";
dom.mn_2.style.color = "#ffd700";
dom.mn_2.style.backgroundColor = "664200";
dom.mn_3.style.color = "#c0c0c0";
dom.mn_3.style.backgroundColor = "383838";
dom.mn_4.style.color = "#ff743f";
dom.mn_4.style.backgroundColor = "662617";
dom.mn_1.style.opacity = 0;
dom.mn_2.style.display = "none";
dom.mn_3.style.display = "none";
dom.mn_4.style.display = "none";
dom.ctrmg = addElement(document.body, "div", "ctrmg");
dom.ctrmg_ca = addElement(dom.ctrmg, "div");
dom.ctrmg_cb = addElement(dom.ctrmg, "div");
dom.ctrwin1 = addElement(dom.ctrmg_cb, "div");
dom.ctrwin1.style.display = "";
dom.ctrwin2 = addElement(dom.ctrmg_cb, "div", null, "ctrwinbx");
dom.ctrwin2.style.display = "none";
dom.ctrwin3 = addElement(dom.ctrmg_cb, "div", null, "ctrwinbx");
dom.ctrwin3.style.display = "none";
dom.ctrwin4 = addElement(dom.ctrmg_cb, "div", null, "ctrwinbx");
dom.ctrwin4.style.display = "none";
dom.ctrwin5 = addElement(dom.ctrmg_cb, "div", null, "ctrwinbx");
dom.ctrwin5.style.display = "none";
dom.ctrwin6 = addElement(dom.ctrmg_cb, "div", null, "ctrwinbx");
dom.ctrwin6.style.display = "none";
dom.ctrwin7 = addElement(dom.ctrmg_cb, "div", null, "ctrwinbx");
dom.ctrwin7.style.display = "none";
dom.nthngdsp = addElement(dom.ctrmg_cb, "div");
dom.nthngdsp.style.top = "200px";
dom.nthngdsp.style.left = "210px";
dom.nthngdsp.style.position = "relative";
dom.nthngdsp.style.color = "grey";
dom.nthngdsp.innerHTML = i18n.t("ui.panels.nothingHere");
dom.nthngdsp.style.display = "none";
dom.ctr_1 = addElement(dom.ctrmg_ca, "div", "ctrm_1");
if (!global.flags.aw_u) dom.ctr_1.style.display = "none";
dom.ctr_1a = addElement(dom.ctr_1, "div");
dom.d_weather = addElement(dom.ctr_1a, "div", "ctr_w");
dom.d_weathers = addElement(dom.d_weather, "small");
dom.d_weathert = addElement(dom.d_weather, "span");
dom.d_weathers.style.marginRight = "5px";
dom.d_weathers.addEventListener("click", () => {
  global.flags.ssngaijin = !global.flags.ssngaijin;
  wdrseason(global.flags.ssngaijin);
});
dom.d_moon = addElement(dom.d_weather, "span");
dom.d_anomaly = addElement(dom.d_weather, "span");
dom.d_anomaly.innerHTML = "";
if (typeof InstallTrigger == "undefined") {
  dom.d_anomaly.style.float = "right";
  dom.d_anomaly.style.top = "-4px";
  dom.d_anomaly.style.position = "relative";
  dom.d_moon.style.float = "right";
  dom.d_moon.style.top = "-4px";
  dom.d_moon.style.position = "relative";
}
dom.d_time = addElement(dom.ctr_1a, "div", "ctr_t");
dom.d_time.addEventListener("click", function () {
  if (global.flags.tmmode >= 3) global.flags.tmmode = 1;
  else global.flags.tmmode++;
  this.innerHTML =
    "<small>" + getDay(global.flags.tmmode) + "</small> " + timeDisp(time);
});
dom.d_lct = addElement(dom.ctr_1a, "div", "ctr_l");
dom.d_lct.style.display = "none";
dom.d_lct.innerHTML = i18n.t("ui.world.location");
dom.d_lctc = addElement(dom.d_lct, "div");
dom.d_lctc.style.fontSize = "0.85em";
dom.d_lctc.style.paddingTop = "7px";
dom.d_lctc.style.marginLeft = "-1px";
dom.d_lctc.style.display = "flex";
dom.d_lctt = addElement(dom.d_lctc, "span");
dom.d_lctte = addElement(dom.d_lctc, "span");
dom.ctr_2 = addElement(dom.ctrwin1, "div", "ctrm_2");
dom.ct_ctrl = addElement(dom.ctrmg, "div", "ct_ctrl");
if (!global.flags.aw_u) dom.ct_ctrl.style.display = "none";
dom.ct_bt1 = addElement(dom.ct_ctrl, "div", null, "ct_bts");
dom.ct_bt1.innerHTML = global.flags.asbu
  ? i18n.t("ui.navigation.assemble")
  : i18n.t("ui.common.unknown");
dom.ct_bt2 = addElement(dom.ct_ctrl, "div", null, "ct_bts");
dom.ct_bt2.innerHTML = global.flags.sklu
  ? i18n.t("ui.navigation.skills")
  : i18n.t("ui.common.unknown");
dom.ct_bt3 = addElement(dom.ct_ctrl, "div", null, "ct_bts");
dom.ct_bt3.innerHTML = global.flags.actsu
  ? i18n.t("ui.navigation.actions")
  : i18n.t("ui.common.unknown");
//dom.ct_bt4 = addElement(dom.ct_ctrl ,'div',null,'ct_bts'); dom.ct_bt4.innerHTML = '';
//dom.ct_bt5 = addElement(dom.ct_ctrl ,'div',null,'ct_bts'); dom.ct_bt5.innerHTML = '';
dom.ct_bt6 = addElement(dom.ct_ctrl, "div", null, "ct_bts");
dom.ct_bt6.innerHTML = global.flags.jnlu
  ? i18n.t("ui.navigation.journal")
  : i18n.t("ui.common.unknown");
dom.ct_bt7 = addElement(dom.ct_ctrl, "div", null, "ct_bts");
dom.ct_bt7.innerHTML = i18n.t("ui.navigation.settings");
dom.ct_bt1.style.borderLeft = "none";
dom.ct_bt7.style.borderRight = "none";

dom.ct_bt7.addEventListener("click", () => {
  dom.nthngdsp.style.display = "none";
  if (global.lw_op === 7) {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "";
    global.lw_op = 0;
    clearInterval(timers.sklupdate);
    clearInterval(timers.bstmonupdate);
  } else {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin1.style.display = "none";
    dom.ctrwin2.style.display = "none";
    global.lw_op = 7;
  }
  clearInterval(timers.sklupdate);
  clearInterval(timers.bstmonupdate);
});
dom.ct_bt1.addEventListener("click", () => {
  dom.nthngdsp.style.display = "none";
  if (global.lw_op === 1) {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "";
    global.lw_op = 0;
    clearInterval(timers.sklupdate);
    clearInterval(timers.bstmonupdate);
  } else {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "";
    dom.ctrwin1.style.display = "none";
    global.lw_op = 1;
    if (global.rec_d.length > 0) {
      dom.ct_bt1_c.style.display = "";
      rsort(global.rm);
      clearInterval(timers.sklupdate);
      clearInterval(timers.bstmonupdate);
    } else {
      dom.ct_bt1_c.style.display = "none";
      dom.nthngdsp.style.display = "";
    }
  }
});

dom.ct_bt3.addEventListener("click", () => {
  dom.nthngdsp.style.display = "none";
  if (global.lw_op === 3) {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "";
    global.lw_op = 0;
    clearInterval(timers.sklupdate);
    clearInterval(timers.bstmonupdate);
  } else {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "none";
    global.lw_op = 3;
    empty(dom.ctrwin5);
    if (acts.length > 0) {
      this.acch = addElement(dom.ctrwin5, "div");
      this.acch.innerHTML = i18n.t("ui.panels.actionList");
      this.acch.style.padding = "2px";
      this.acch.style.textAlign = "center";
      this.acch.style.backgroundColor = "#050730";
      this.acch_e = addElement(this.acch, "div");
      this.acch_e.style.float = "right";
      this.acch_e.style.display = "flex";
      this.acch_e.style.position = "relative";
      this.acch_e.style.top = "-6px";
      this.acch_e.style.right = "-2px";
      this.acch_e.style.height = "20px";
      // empty(dom.ctrwin5) above already detached the previous container, so the
      // row list is rebuilt from scratch here. Reusing a stored reference would
      // keep pointing at that detached node and render every row off-screen.
      dom.acccon = addElement(dom.ctrwin5, "div");
      for (const a in acts) {
        renderAct(acts[a]);
      }
    } else dom.nthngdsp.style.display = "";
  }
});

function renderAct(a) {
  this.accm = addElement(dom.acccon, "div", null, "skwmmc");
  a.t = this.accm;
  addDesc(this.accm, null, 2, a.name, a.desc());
  this.accm.innerHTML = a.name;
  this.accm.style.textAlign = "center";
  this.accm.style.display = "block";
  if (acts.length - 1 === acts.indexOf(a))
    this.accm.style.borderBottom = "1px solid #46a";
  if (a.cond(false) !== true) this.accm.style.color = "grey";
  if (a.active === true) this.accm.style.color = "lime";
  this.accm.addEventListener("click", function () {
    switch (a.type) {
      case 1:
        if (a.cond() === true && a.id !== global.current_a.id) {
          activateAct(a);
          this.style.color = "lime";
        } else if (a.id === global.current_a.id) {
          deactivateAct(global.current_a);
          this.style.color = "inherit";
        }
        break;
      case 2:
        if (a.cond() === true) a.use();
        break;
      case 3:
        break;
    }
    for (const a in acts) refreshAct(acts[a].t, acts[a]);
  });
}
function refreshAct(e, a) {
  e.style.color = "inherit";
  if (a.cond(false) !== true) e.style.color = "grey";
  if (a.active === true) e.style.color = "lime";
}

function activateAct(actn) {
  global.current_a.deactivate();
  actn.activate();
  global.current_a = actn;
  global.flags.busy = true;
  dom.ct_bt3.style.backgroundColor = "darkslategray";
}

function deactivateAct(actn) {
  actn.deactivate();
  global.current_a = act.default;
  global.flags.busy = false;
  dom.ct_bt3.style.backgroundColor = "inherit";
  for (const a in acts) refreshAct(acts[a].t, acts[a]);
}

dom.ct_bt2.addEventListener("click", function () {
  dom.nthngdsp.style.display = "none";
  if (global.lw_op === 2) {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "";
    global.lw_op = 0;
    clearInterval(timers.sklupdate);
    clearInterval(timers.bstmonupdate);
  } else {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "none";
    global.lw_op = 2;
    if (you.skls.length > 0) {
      dom.nthngdsp.style.display = "none";
      empty(dom.ctrwin3);
      this.skwm = addElement(dom.ctrwin3, "div");
      this.skwm.innerHTML = i18n.t("ui.panels.skillList");
      this.skwm.style.padding = "2px";
      this.skwm.style.textAlign = "center";
      this.skwm.style.backgroundColor = "#050730";
      this.skwm_e = addElement(this.skwm, "div");
      this.skwm_e.style.float = "right";
      this.skwm_e.style.display = "flex";
      this.skwm_e.style.position = "relative";
      this.skwm_e.style.top = "-6px";
      this.skwm_e.style.right = "-2px";
      this.skwm_e.style.height = "20px";
      this.skwm_e_btn_1_b = addElement(this.skwm_e, "div", null, "bts_b");
      this.skwm_e_btn_1_b.innerHTML = "A-Z";
      this.skwm_e_btn_1_b.style.border = "1px solid #46a";
      this.skwm_e_btn_2_b = addElement(this.skwm_e, "div", null, "bts_b");
      this.skwm_e_btn_2_b.innerHTML = i18n.t(
        "runtime.ui.interface.interface.tpe_73346027",
      );
      this.skwm_e_btn_2_b.style.border = "1px solid #46a";
      this.skwm_e_btn_3_b = addElement(this.skwm_e, "div", null, "bts_b");
      this.skwm_e_btn_3_b.innerHTML = i18n.t(
        "runtime.ui.interface.interface.lvl_381b972e",
      );
      this.skwm_e_btn_3_b.style.border = "1px solid #46a";
      this.skwm_e_btn_1_b.addEventListener("click", function () {
        if (global.flags.ssort_a === true) {
          you.skls.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          global.flags.ssort_a = false;
        } else {
          you.skls.sort(function (a, b) {
            if (a.name > b.name) return -1;
            if (a.name < b.name) return 1;
            return 0;
          });
          global.flags.ssort_a = true;
        }
        empty(dom.skcon);
        for (let m = 0; m < you.skls.length; m++) {
          renderSkl(you.skls[m]);
          if (m === you.skls.length - 1)
            dom.skcon.children[m].style.borderBottom = "1px solid #46a";
        }
      });
      this.skwm_e_btn_2_b.addEventListener("click", function () {
        if (global.flags.ssort_b === true) {
          you.skls.sort(function (a, b) {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
          });
          global.flags.ssort_b = false;
        } else {
          you.skls.sort(function (a, b) {
            if (a.type > b.type) return -1;
            if (a.type < b.type) return 1;
            if (a.id > b.id) return -1;
            if (a.id < b.id) return 1;
            return 0;
          });
          global.flags.ssort_b = true;
        }
        empty(dom.skcon);
        for (let m = 0; m < you.skls.length; m++) {
          renderSkl(you.skls[m]);
          if (m === you.skls.length - 1)
            dom.skcon.children[m].style.borderBottom = "1px solid #46a";
        }
      });
      this.skwm_e_btn_3_b.addEventListener("click", function () {
        if (global.flags.ssort_b === true) {
          you.skls.sort(function (a, b) {
            if (a.lvl < b.lvl) return -1;
            if (a.lvl > b.lvl) return 1;
            if (a.exp < b.exp) return -1;
            if (a.exp > b.exp) return 1;
            return 0;
          });
          global.flags.ssort_b = false;
        } else {
          you.skls.sort(function (a, b) {
            if (a.lvl > b.lvl) return -1;
            if (a.lvl < b.lvl) return 1;
            if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
            return 0;
          });
          global.flags.ssort_b = true;
        }
        empty(dom.skcon);
        for (let m = 0; m < you.skls.length; m++) {
          renderSkl(you.skls[m]);
          if (m === you.skls.length - 1)
            dom.skcon.children[m].style.borderBottom = "1px solid #46a";
        }
      });
      addDesc(
        this.skwm_e_btn_1_b,
        null,
        2,
        i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
        i18n.t("runtime.ui.interface.description.alphabetically_0c8123ce"),
      );
      addDesc(
        this.skwm_e_btn_2_b,
        null,
        2,
        i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
        i18n.t("runtime.ui.interface.description.by_type_b2f54970"),
      );
      addDesc(
        this.skwm_e_btn_3_b,
        null,
        2,
        i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
        i18n.t("runtime.ui.interface.description.by_levels_9a64c295"),
      );
      dom.skcon = addElement(dom.ctrwin3, "div");
      dom.skcon.style.overflow = "auto";
      dom.skcon.style.height = "335px";
      dom.skcon.style.width = "100%";
      for (let m = 0; m < you.skls.length; m++) {
        renderSkl(you.skls[m]);
        if (m === you.skls.length - 1)
          dom.skcon.children[m].style.borderBottom = "1px solid #46a";
      }
      const sklsize = you.skls.length;
      timers.sklupdate = setInterval(() => {
        if (sklsize < you.skls.length) {
          empty(dom.skcon);
          for (let m = 0; m < you.skls.length; m++) {
            renderSkl(you.skls[m]);
            if (m === you.skls.length - 1)
              dom.skcon.children[m].style.borderBottom = "1px solid #46a";
          }
        }
        for (let n = 1; n < you.skls.length + 1; n++) {
          dom.skcon.children[n - 1].children[0].innerHTML = i18n.t(
            "ui.hud.skillLevel",
            { skill: you.skls[n - 1].name, level: you.skls[n - 1].lvl },
          );
          dom.skcon.children[n - 1].children[0].style.fontSize =
            you.skls[n - 1].sp;
          dom.skcon.children[n - 1].children[1].innerHTML = i18n.t(
            "ui.hud.skillExperience",
            {
              current: formatw(Math.floor(you.skls[n - 1].exp)),
              max: formatw(you.skls[n - 1].expnext_t),
            },
          );
          dom.skcon.children[n - 1].children[2].children[0].style.width =
            (you.skls[n - 1].exp / you.skls[n - 1].expnext_t) * 100 + "%";
          //if(you.skls[n-1].lastupd&&you.skls[n-1].lastupd-time.minute>=1) dom.skcon.children[n-1].children[2].children[0].style.backgroundColor='limegreen'; else dom.skcon.children[n-1].children[2].children[0].style.backgroundColor='yellow';
        }
      }, 1000);
    } else dom.nthngdsp.style.display = "";
  }
});
dom.ct_bt6.addEventListener("click", function () {
  if (!global.flags.jnlu) return;
  dom.nthngdsp.style.display = "none";
  if (global.lw_op === 6) {
    dom.ctrwin6.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "";
    global.lw_op = 0;
    clearInterval(timers.sklupdate);
    clearInterval(timers.bstmonupdate);
  } else {
    dom.ctrwin6.style.display = "";
    dom.ctrwin5.style.display = "none";
    dom.ctrwin4.style.display = "none";
    dom.ctrwin3.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "none";
    global.lw_op = 6;
    empty(dom.ctrwin6);
    this.jlbl = addElement(dom.ctrwin6, "div");
    this.jlbl.innerHTML = i18n.t("ui.panels.journal");
    this.jlbl.style.padding = "2px";
    this.jlbl.style.textAlign = "center";
    this.jlbl.style.backgroundColor = "#050730";
    this.jlbl.style.borderBottom = "1px solid rgb(12,86,195)";
    this.jlmain = addElement(dom.ctrwin6, "div");
    this.jlmain.style.height = "336px";
    this.jlmain.style.background =
      "linear-gradient(0deg, rgb(35, 67, 125), rgb(19, 18, 97))";
    this.jlbod = addElement(this.jlmain, "div");
    this.jlbrw1 = addElement(this.jlbod, "div", null, "jrow");
    dom.jlbrw1s1 = addElement(this.jlbrw1, "div", "jcell1", "jcell");
    dom.jlbrw1s2 = addElement(this.jlbrw1, "div", "jcell2", "jcell");
    this.jlbrw2 = addElement(this.jlbod, "div", null, "jrow");
    this.jlbrw2s1 = addElement(this.jlbrw2, "div", "jcell3", "jcell");
    this.jlbrw2s2 = addElement(this.jlbrw2, "div", "jcell4", "jcell");
    this.jlbod.style.height = "100px";
    this.jlbod.style.width = "100%";
    dom.jlbrw1s1.innerHTML = i18n.t("ui.panels.quests");
    dom.jlbrw1s2.innerHTML =
      global.flags.bstu === true
        ? i18n.t("ui.panels.bestiary")
        : "????????????";
    // This slot has rendered "????????????" with nothing behind it since before
    // this fork. It holds what the player has worked out about the world, and it
    // needs no unlock of its own: the journal is the thing you read, and the
    // journal is already gated behind finding and reading item.jnlbk. Entries
    // accumulate from the start of the game whether or not the player can open
    // this yet, the same way quests and statistics do.
    this.jlbrw2s1.innerHTML = i18n.t("ui.panels.lore");
    this.jlbrw2s2.innerHTML = i18n.t("ui.panels.statistics");
    this.jlbrw2s1.addEventListener("click", () => {
      empty(dom.ctrwin6);
      global.lw_op = -1;
      renderLore();
    });
    dom.jlbrw1s1.addEventListener("click", () => {
      empty(dom.ctrwin6);
      global.lw_op = -1;
      // In progress first, then anything not finished, then what is done. Within a
      // group, the order the quests were taken in, which is their id order.
      //
      // This replaces a comparator that was not one: it tested a's state against b's
      // id and returned undefined for every other pair, which sort() reads as "equal".
      // A comparator that is neither antisymmetric nor transitive gives an ordering
      // the specification does not define, which is why the list came out with a
      // finished quest above an active one and no discernible rule anywhere.
      const questOrder = (q) =>
        q.data.started === true ? 0 : q.data.done === true ? 2 : 1;
      qsts.sort(function (a, b) {
        return questOrder(a) - questOrder(b) || a.id - b.id;
      });
      dom.qstbody = addElement(dom.ctrwin6, "div");
      this.qstlbl = addElement(dom.qstbody, "div");
      this.qstlbl.innerHTML = i18n.t("ui.panels.questList");
      this.qstlbl.style.textAlign = "center";
      this.qstlbl.style.padding = "7px";
      this.qstlbl.style.background = "linear-gradient(180deg,#182347,#13152f)";
      for (const a in qsts) {
        let c,
          rarc,
          rarts = "";
        switch (qsts[a].rar) {
          case 0: {
            rarc = "grey";
            break;
          }
          case 1: {
            rarc = "white";
            break;
          }
          case 2: {
            rarts = "0px 0px 1px blue";
            rarc = "cyan";
            break;
          }
          case 3: {
            rarts = "0px 0px 2px lime";
            rarc = "lime";
            break;
          }
          case 4: {
            rarts = "0px 0px 3px orange";
            rarc = "yellow";
            break;
          }
          case 5: {
            rarts = "0px 0px 2px crimson,0px 0px 5px red";
            rarc = "orange";
            break;
          }
          case 6: {
            rarts = "1px 1px 1px black,0px 0px 2px purple";
            rarc = "purple";
            break;
          }
          case 7: {
            rarts = "hotpink 1px 1px .1em,cyan -1px -1px .1em";
            rarc = "black";
            break;
          }
        }
        if (qsts[a].data.done) c = "green";
        if (qsts[a].data.started) c = "cyan";
        this.qstcell = addElement(dom.qstbody, "div", null, "skwmmc");
        this.qstcell.innerHTML = qsts[a].name;
        this.qstcell.style.color = c;
        this.qstcell.style.textAlign = "center";
        this.qstcell.style.display = "block";
        let rar = "";
        for (let i = 0; i < qsts[a].rar; i++) rar += " ★ ";
        this.qstcell.innerHTML +=
          ' <small style="font-size:.6em;color:' +
          rarc +
          ";text-shadow:" +
          rarts +
          '">' +
          rar +
          "</small>";
        if (qsts[a].repeatable)
          this.qstcell.innerHTML += i18n.t(
            "runtime.ui.interface.interface.text_e3f09280",
          );
        if (qsts.length - 1 == Number(a))
          this.qstcell.style.borderBottom = "1px solid #46a";
        this.qstcell.addEventListener("click", function () {
          empty(dom.qstbody);
          this.qmain = addElement(dom.qstbody, "div");
          this.qmain.style.height = "359px";
          this.qmain.style.width = "100%";
          this.qmain.style.background =
            "linear-gradient(180deg,#040b2d,#29071c)";
          this.qmain.style.textAlign = "center";
          this.qlabl = addElement(this.qmain, "small");
          this.qlabl.innerHTML =
            "#" +
            qsts[a].id +
            ": " +
            qsts[a].name +
            ' [<small style="color:' +
            rarc +
            ";text-shadow:" +
            rarts +
            '">' +
            rar +
            "</small>]" +
            (qsts[a].data.done && !qsts[a].data.started
              ? i18n.t("ui.quest.status.completed")
              : i18n.t("ui.quest.status.inProgress"));
          this.qlabl.style.padding = "6px";
          this.qlabl.style.borderBottom = "dotted 2px #2b408a";
          this.qlabl.style.backgroundColor = "#12152f";
          this.qlabl.style.display = "inherit";
          this.qstatba = addElement(this.qmain, "small");
          this.qstatba.innerHTML = i18n.t("ui.quest.location", {
            location: qsts[a].loc,
          });
          this.qstatba.style.borderBottom = "1px solid #2b408a";
          this.qstatba.style.display = "block";
          this.qdsc = addElement(this.qmain, "div");
          this.qdsc.innerHTML = qsts[a].desc;
          this.qdsc.style.padding = "12px";
          this.qdsc.style.borderBottom = "dotted 2px #2b408a";
          this.qdsc.style.color = "#f7ff82";
          this.qtodo = addElement(this.qmain, "div");
          const goals =
            qsts[a].data.done && !qsts[a].data.started
              ? qsts[a].goalsf()
              : qsts[a].goals();
          this.qtodo.style.padding = "6px";
          this.qtodo.innerHTML = i18n.t(
            "runtime.ui.interface.interface.objectives_0421b15e",
          );
          this.qtodo.style.color = "#ffc319";
          this.qtodo.style.backgroundColor = "#12152f";
          this.qgoalbod = addElement(this.qmain, "div");
          this.qgoalbod.style.borderBottom = "dotted 2px #2b408a";
          for (const b in goals) {
            this.qtodoitm = addElement(this.qgoalbod, "div");
            this.qtodoitm.style.padding = "4px";
            this.qtodoitm.style.fontSize = "smaller";
            this.qtodoitm.style.backgroundColor = "#182247";
            this.qtodoitm.style.borderTop = "1px solid #3b3158";
            this.qtodoitm.innerHTML = goals[b];
          }
          this.qstatbak = addElement(this.qmain, "div", "qtrtn");
          this.qstatbak.innerHTML = i18n.t(
            "runtime.ui.interface.interface.return_9e4bb9d7",
          );
          this.qstatbak.addEventListener("click", () => {
            dom.jlbrw1s1.click();
          });
        });
      }
    });
    dom.jlbrw1s2.addEventListener("click", function () {
      if (!global.flags.bstu) return;
      empty(dom.ctrwin6);
      global.lw_op = -1;
      const bst_entr_case = addElement(dom.ctrwin6, "div");
      bst_entr_case.style.height = windowPanelHeight(0.84);
      bst_entr_case.style.backgroundColor = "rgb(0,20,44)";
      bst_entr_case.style.overflow = "auto";
      this.bst_entr_head = addElement(bst_entr_case, "div", null, "bst_entr");
      this.bst_entr_head.style.textAlign = "center";
      this.bst_entr_head.style.paddingTop = "3px";
      this.bst_entr_head.style.paddingBottom = "3px";
      this.bst_entr_head1 = addElement(
        this.bst_entr_head,
        "div",
        null,
        "bst_entr1",
      );
      this.bst_entr_head1.innerHTML = i18n.t(
        "runtime.ui.interface.interface.name_6ae99955",
      );
      this.bst_entr_head2 = addElement(
        this.bst_entr_head,
        "div",
        null,
        "bst_entr2",
      );
      this.bst_entr_head2.innerHTML = i18n.t(
        "runtime.ui.interface.interface.rank_9f0d6627",
      );
      this.bst_entr_head3 = addElement(
        this.bst_entr_head,
        "div",
        null,
        "bst_entr3",
      );
      this.bst_entr_head3.innerHTML = i18n.t(
        "runtime.ui.interface.interface.kills_4b11e02d",
      );
      for (let ii = 1; ii < global.bestiary.length; ii++) {
        let mon;
        for (const id in creature)
          if (creature[id].id === global.bestiary[ii].id) mon = creature[id];
        this.bst_entr_m_case = addElement(
          bst_entr_case,
          "div",
          "bst_entrh",
          "bst_entr",
        );
        this.bst_entr_m_case.style.backgroundColor = "rgb(10,30,54)";
        // The encyclopedia listed only a name, a rank, and a kill count. Every
        // creature already carries a localized description, so hovering an
        // entry now shows what the book actually says about it.
        addDesc(this.bst_entr_m_case, mon);
        this.bst_entr_m_e1 = addElement(
          this.bst_entr_m_case,
          "div",
          null,
          "bst_entr1",
        );
        this.bst_entr_m_e1.innerHTML = mon.name;
        this.bst_entr_m_e2 = addElement(
          this.bst_entr_m_case,
          "div",
          null,
          "bst_entr2",
        );
        this.bst_entr_m_e2.innerHTML = global.text.eranks[mon.rnk];
        if (mon.rnk <= 4) this.bst_entr_m_e2.style.color = "lightgrey";
        else if (mon.rnk > 4 && mon.rnk <= 7)
          this.bst_entr_m_e2.style.color = "white";
        else if (mon.rnk > 7 && mon.rnk <= 10)
          this.bst_entr_m_e2.style.color = "lightblue";
        else if (mon.rnk > 10 && mon.rnk <= 13)
          this.bst_entr_m_e2.style.color = "lightgreen";
        else if (mon.rnk > 13 && mon.rnk <= 16)
          this.bst_entr_m_e2.style.color = "lime";
        else if (mon.rnk > 16 && mon.rnk <= 19)
          this.bst_entr_m_e2.style.color = "yellow";
        this.bst_entr_m_e3 = addElement(
          this.bst_entr_m_case,
          "div",
          null,
          "bst_entr3",
        );
        this.bst_entr_m_e3.innerHTML = global.bestiary[ii].kills;
        addDesc(this.bst_entr_m_case, mon, 10);
      }
      let monsize = global.bestiary.length;
      timers.bstmonupdate = setInterval(function () {
        if (monsize < global.bestiary.length) {
          for (let ii = monsize; ii < global.bestiary.length; ii++) {
            let mon;
            for (const id in creature)
              if (creature[id].id === global.bestiary[ii].id)
                mon = creature[id];
            this.bst_entr_m_case = addElement(
              bst_entr_case,
              "div",
              "bst_entrh",
              "bst_entr",
            );
            this.bst_entr_m_case.style.backgroundColor = "rgb(10,30,54)";
            this.bst_entr_m_e1 = addElement(
              this.bst_entr_m_case,
              "div",
              null,
              "bst_entr1",
            );
            this.bst_entr_m_e1.innerHTML = mon.name;
            this.bst_entr_m_e2 = addElement(
              this.bst_entr_m_case,
              "div",
              null,
              "bst_entr2",
            );
            this.bst_entr_m_e2.innerHTML = global.text.eranks[mon.rnk];
            if (mon.rnk <= 4) this.bst_entr_m_e2.style.color = "lightgrey";
            else if (mon.rnk > 4 && mon.rnk <= 7)
              this.bst_entr_m_e2.style.color = "white";
            else if (mon.rnk > 7 && mon.rnk <= 10)
              this.bst_entr_m_e2.style.color = "lightblue";
            else if (mon.rnk > 10 && mon.rnk <= 13)
              this.bst_entr_m_e2.style.color = "lightgreen";
            else if (mon.rnk > 13 && mon.rnk <= 16)
              this.bst_entr_m_e2.style.color = "lime";
            else if (mon.rnk > 16 && mon.rnk <= 19)
              this.bst_entr_m_e2.style.color = "yellow";
            this.bst_entr_m_e3 = addElement(
              this.bst_entr_m_case,
              "div",
              null,
              "bst_entr3",
            );
            this.bst_entr_m_e3.innerHTML = global.bestiary[ii].kills;
            addDesc(this.bst_entr_m_case, mon, 10);
          }
          monsize = global.bestiary.length;
        }
        for (let ii = 1; ii < global.bestiary.length; ii++) {
          let mon;
          for (const id in creature)
            if (creature[id].id === global.bestiary[ii].id) mon = creature[id];
          bst_entr_case.children[ii].children[2].innerHTML =
            global.bestiary[ii].kills;
        }
      }, 1000);
    });
    this.jlbrw2s2.addEventListener("click", function () {
      empty(dom.ctrwin6);
      global.lw_op = -1;
      dom.ch_1 = addElement(dom.ctrwin6, "div");
      dom.ch_1.style.height = "359px";
      dom.ch_1.style.background =
        "linear-gradient(0deg, rgb(24, 18, 51), rgb(0, 44, 87))";
      dom.flsthdr = addElement(dom.ch_1, "div");
      dom.flsthdr.innerHTML = i18n.t("ui.panels.stats");
      dom.flsthdr.style.background =
        "linear-gradient(0deg,rgb(21, 17, 49),rgb(0, 42, 85))";
      dom.flsthdr.style.borderBottom = "1px #44c dashed";
      dom.flsthdr.style.padding = "2px";
      dom.flsthdr.style.fontSize = "small";
      dom.flsthdr.style.height = "18px";
      dom.statbod = addElement(dom.ch_1, "div");
      dom.statbod.style.overflow = "auto";
      dom.statbod.style.maxHeight = "93%";
      dom.statbod.style.background =
        "linear-gradient(90deg,rgb(1,1,87),rgb(55,7,57))";
      dom.ch_1.style.textAlign = "center";
      dom.tccon = addElement(dom.statbod, "small", null, "sttc");
      dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
      dom.tcright = addElement(dom.tccon, "div", null, "sttr");
      dom.tcleft.innerHTML = i18n.t(
        "runtime.ui.interface.interface.game_start_time_afd7c4c3",
      );
      dom.tcright.innerHTML = global.stat.sttime;
      /*dom.tccon=addElement(dom.statbod,'small',null,'sttc'); dom.tcleft=addElement(dom.tccon,'div',null,'sttl'); dom.tcright=addElement(dom.tccon,'div',null,'sttr');
    dom.tcleft.innerHTML='Time passed'; let br=global.stat.tick;dom.tcright.innerHTML=(br>=86400?(br/(86400)<<0+' Days '):'')+(br%86400>=3600?(((br%86400/3600)<<0)%24+':'):'')+(br%3600<60?'00':(br%3600>=600?(br%3600/60)<<0:'0'+(br%3600/60)<<0))+(':'+(br%360<60?'0'+br%60:br%60));*/
      dom.tccon = addElement(dom.statbod, "small", null, "sttc");
      dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
      dom.tcright = addElement(dom.tccon, "div", null, "sttr");
      dom.tcleft.innerHTML = i18n.t(
        "runtime.ui.interface.interface.ingame_time_passed_0ceb54c8",
      );
      const br = time.minute - 338143959;
      dom.tcright.innerHTML =
        (br >= YEAR
          ? '<span style="color:orange">' +
            ((br / YEAR) << 0) +
            "</span> " +
            i18n.t("ui.time.years") +
            " "
          : "") +
        (br >= MONTH
          ? '<span style="color:yellow">' +
            (((br / MONTH) << 0) % 12) +
            "</span> " +
            i18n.t("ui.time.months") +
            " "
          : "") +
        (br >= DAY
          ? '<span style="color:lime">' +
            (((br / DAY) << 0) % 30) +
            "</span> " +
            i18n.t("ui.time.days") +
            " "
          : "") +
        (((br / HOUR) % 24) << 0) +
        ":" +
        (br % 60 < 10 ? "0" + (br % 60) : br % 60);
      dom.tcright.style.fontSize = ".9em";
      if (global.stat.gsvs > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.game_saves_38d7360c",
        );
        dom.tcright.innerHTML += global.stat.gsvs;
      }
      if (global.stat.athme > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.total_time_spent_at_home_5becc0cc",
        );
        const br = global.stat.athme;
        dom.tcright.innerHTML =
          (br >= YEAR
            ? '<span style="color:orange">' +
              ((br / YEAR) << 0) +
              "</span> " +
              i18n.t("ui.time.years") +
              " "
            : "") +
          (br >= MONTH
            ? '<span style="color:yellow">' +
              (((br / MONTH) << 0) % 12) +
              "</span> " +
              i18n.t("ui.time.months") +
              " "
            : "") +
          (br >= DAY
            ? '<span style="color:lime">' +
              (((br / DAY) << 0) % 30) +
              "</span> " +
              i18n.t("ui.time.days") +
              " "
            : "") +
          (((br / HOUR) % 24) << 0) +
          ":" +
          (br % 60 < 10 ? "0" + (br % 60) : br % 60);
      }
      if (global.stat.timeslp > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.time_slept_f32d21d0",
        );
        const br = global.stat.timeslp;
        dom.tcright.innerHTML =
          (br >= YEAR
            ? '<span style="color:orange">' +
              ((br / YEAR) << 0) +
              "</span> " +
              i18n.t("ui.time.years") +
              " "
            : "") +
          (br >= MONTH
            ? '<span style="color:yellow">' +
              (((br / MONTH) << 0) % 12) +
              "</span> " +
              i18n.t("ui.time.months") +
              " "
            : "") +
          (br >= DAY
            ? '<span style="color:lime">' +
              (((br / DAY) << 0) % 30) +
              "</span> " +
              i18n.t("ui.time.days") +
              " "
            : "") +
          (((br / HOUR) % 24) << 0) +
          ":" +
          (br % 60 < 10 ? "0" + (br % 60) : br % 60);
      }
      if (global.stat.lgtstk > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.times_struck_by_lightning_64e90c46",
        );
        dom.tcright.innerHTML =
          '<span style="color:black;background-color:yellow">' +
          global.stat.lgtstk +
          "</span>";
      }
      if (global.stat.qstc > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.quests_completed_352a6c6b",
        );
        dom.tcright.innerHTML = global.stat.qstc;
      }
      if (global.stat.jcom > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.jobs_completed_769d6741",
        );
        dom.tcright.innerHTML = global.stat.jcom;
      }
      if (global.stat.dsct > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.discoveries_made_80f1f18f",
        );
        dom.tcright.innerHTML = global.stat.dsct;
      }
      if (global.stat.smovet > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.times_walked_52c707fc",
        );
        dom.tcright.innerHTML = global.stat.smovet;
      }
      if (global.stat.cat_c > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.cat_pets_13e98483",
        );
        dom.tcright.innerHTML = global.stat.cat_c;
      }
      if (global.stat.fooda > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.food_consumed_8ade8fd6",
        );
        dom.tcright.innerHTML = global.stat.fooda;
      }
      if (global.stat.foodt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.bad_food_consumed_79c65472",
        );
        dom.tcright.innerHTML = global.stat.foodt;
      }
      if (global.stat.foodb > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.drinks_consumed_967828dd",
        );
        dom.tcright.innerHTML = global.stat.foodb;
      }
      if (global.stat.foodal > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.alcohol_consumed_c3f76191",
        );
        dom.tcright.innerHTML = global.stat.foodal;
      }
      if (global.stat.ftried > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.unique_food_tried_ad2a126b",
        );
        dom.tcright.innerHTML = global.stat.ftried;
      }
      if (global.stat.medst > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.medicine_used_2e4d8e40",
        );
        dom.tcright.innerHTML = global.stat.medst;
      }
      // Potions are counted in `potnst`, which items.js increments in four places.
      // This read `potst`, which nothing writes, so the row never appeared at all.
      if (global.stat.potnst > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.potions_consumed_fa286d01",
        );
        dom.tcright.innerHTML = global.stat.potnst;
      }
      if (global.stat.plst > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.pills_consumed_8bd14564",
        );
        dom.tcright.innerHTML = global.stat.plst;
      }
      if (global.stat.igtttl > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.items_picked_up_062ce88b",
        );
        dom.tcright.innerHTML = global.stat.igtttl;
      }
      if (global.stat.dsst > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.items_disassembled_0abf00e5",
        );
        dom.tcright.innerHTML = global.stat.dsst;
      }
      if (global.stat.thrt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.items_thrown_away_de61d0a3",
        );
        dom.tcright.innerHTML = global.stat.thrt;
      }
      if (global.stat.crftt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.items_crafted_e6c30733",
        );
        dom.tcright.innerHTML = global.stat.crftt;
      }
      if (global.rec_d.length > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.recipes_unlocked_fb5f556a",
        );
        dom.tcright.innerHTML = global.rec_d.length;
      }
      if (you.skls.length > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.skills_unlocked_a1940691",
        );
        dom.tcright.innerHTML = you.skls.length;
      }
      if (global.titles.length > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.titles_unlocked_90d8b0a2",
        );
        dom.tcright.innerHTML = global.titles.length;
      }
      if (global.stat.exptotl > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.total_exp_gained_225c96af",
        );
        dom.tcright.innerHTML = formatw(global.stat.exptotl);
      }
      if (global.stat.slvs > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.total_skill_levels_54b6f497",
        );
        dom.tcright.innerHTML = global.stat.slvs;
      }
      if (global.stat.moneyg > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.money_acquired_15a2104f",
        );
        dom.ch_etn2_1 = addElement(dom.tcright, "span");
        dom.ch_etn2_1.style.width = "33.3%";
        dom.ch_etn2_2 = addElement(dom.tcright, "span");
        dom.ch_etn2_2.style.width = "33.3%";
        dom.ch_etn2_3 = addElement(dom.tcright, "span");
        dom.ch_etn2_3.style.width = "33.3%";
        const p = global.stat.moneyg;
        if (p >= GOLD) {
          dom.ch_etn2_1.innerHTML = dom.coingold + ((p / GOLD) << 0);
          dom.ch_etn2_1.style.backgroundColor = "rgb(102, 66, 0)";
        }
        if (p >= SILVER && p % GOLD >= SILVER) {
          dom.ch_etn2_2.innerHTML =
            dom.coinsilver + (((p / SILVER) % SILVER) << 0);
          dom.ch_etn2_2.style.backgroundColor = "rgb(56, 56, 56)";
        }
        if (p < SILVER || (p > SILVER && p % SILVER > 0)) {
          dom.ch_etn2_3.innerHTML = dom.coincopper + ((p % SILVER) << 0);
          dom.ch_etn2_3.style.backgroundColor = "rgb(102, 38, 23)";
        }
      }
      if (global.stat.moneysp > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.money_spent_in_shops_fa19d59b",
        );
        dom.ch_etn2_1 = addElement(dom.tcright, "span");
        dom.ch_etn2_1.style.width = "33.3%";
        dom.ch_etn2_2 = addElement(dom.tcright, "span");
        dom.ch_etn2_2.style.width = "33.3%";
        dom.ch_etn2_3 = addElement(dom.tcright, "span");
        dom.ch_etn2_3.style.width = "33.3%";
        const p = global.stat.moneysp;
        if (p >= GOLD) {
          dom.ch_etn2_1.innerHTML = dom.coingold + ((p / GOLD) << 0);
          dom.ch_etn2_1.style.backgroundColor = "rgb(102, 66, 0)";
        }
        if (p >= SILVER && p % GOLD >= SILVER) {
          dom.ch_etn2_2.innerHTML =
            dom.coinsilver + (((p / SILVER) % SILVER) << 0);
          dom.ch_etn2_2.style.backgroundColor = "rgb(56, 56, 56)";
        }
        if (p < SILVER || (p > SILVER && p % SILVER > 0)) {
          dom.ch_etn2_3.innerHTML = dom.coincopper + ((p % SILVER) << 0);
          dom.ch_etn2_3.style.backgroundColor = "rgb(102, 38, 23)";
        }
      }
      if (global.stat.buyt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.goods_bought_093022ba",
        );
        dom.tcright.innerHTML = global.stat.buyt;
      }
      if (global.stat.rdttl > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.books_read_52d39e00",
        );
        dom.tcright.innerHTML = global.stat.rdttl;
        addDesc(
          dom.tccon,
          null,
          2,
          i18n.t("runtime.ui.interface.description.info_4b631f69"),
          i18n.t(
            "runtime.ui.interface.description.click_to_list_known_books_0d0a2b7a",
          ),
        );
        dom.tccon.addEventListener("click", function () {
          if (!global.flags.bksstt) {
            global.flags.bksstt = true;
            dom.bkssttbd = addElement(document.body, "div", null, "bksstt");
            dom.bkssttbd.addEventListener("click", function () {
              empty(dom.bkssttbd);
              document.body.removeChild(dom.bkssttbd);
              global.flags.bksstt = false;
              global.dscr.style.display = "none";
            });
            const bks = [];
            for (const a in item) if (item[a].data.finished) bks.push(item[a]);
            for (const a in bks) {
              dom.bkssttcell = addElement(dom.bkssttbd, "div", null, "blssttc");
              dom.bkssttcell.innerHTML = bks[a].name;
              addDesc(dom.bkssttcell, bks[a]);
              switch (bks[a].rar) {
                case 0: {
                  dom.bkssttcell.style.color = "grey";
                  break;
                }
                case 1: {
                  dom.bkssttcell.style.color = "rgb(188,254,254)";
                  break;
                }
                case 2: {
                  dom.bkssttcell.style.textShadow = "0px 0px 1px blue";
                  dom.bkssttcell.style.color = "cyan";
                  break;
                }
                case 3: {
                  dom.bkssttcell.style.textShadow = "0px 0px 2px lime";
                  dom.bkssttcell.style.color = "lime";
                  break;
                }
                case 4: {
                  dom.bkssttcell.style.textShadow = "0px 0px 3px orange";
                  dom.bkssttcell.style.color = "yellow";
                  break;
                }
                case 5: {
                  dom.bkssttcell.style.textShadow =
                    "0px 0px 2px crimson,0px 0px 5px red";
                  dom.bkssttcell.style.color = "orange";
                  break;
                }
                case 6: {
                  dom.bkssttcell.style.textShadow =
                    "1px 1px 1px black,0px 0px 2px purple";
                  dom.bkssttcell.style.color = "purple";
                  break;
                }
              }
            }
          }
        });
      }
      if (global.stat.rdgtttl > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.total_reading_time_bba346f7",
        );
        const br = global.stat.rdgtttl;
        dom.tcright.innerHTML =
          (br >= YEAR
            ? '<span style="color:orange">' +
              ((br / YEAR) << 0) +
              "</span> " +
              i18n.t("ui.time.years") +
              " "
            : "") +
          (br >= MONTH
            ? '<span style="color:yellow">' +
              (((br / MONTH) << 0) % 12) +
              "</span> " +
              i18n.t("ui.time.months") +
              " "
            : "") +
          (br >= DAY
            ? '<span style="color:lime">' +
              (((br / DAY) << 0) % 30) +
              "</span> " +
              i18n.t("ui.time.days") +
              " "
            : "") +
          (((br / HOUR) % 24) << 0) +
          ":" +
          (br % 60 < 10 ? "0" + (br % 60) : br % 60);
      }
      if (global.stat.indkill > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t("ui.statistics.indirectKills");
        dom.tcright.innerHTML = global.stat.indkill;
      }
      if (global.stat.pts > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t("ui.statistics.threatCleared");
        dom.tcright.innerHTML = formatw(global.stat.pts);
      }
      if (global.stat.bloodt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t("ui.statistics.bloodSpilled");
        dom.tcright.innerHTML = Math.round(global.stat.bloodt * 100) / 100;
      }
      if (global.stat.shppnt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t("ui.statistics.shopStanding");
        dom.tcright.innerHTML = Math.round(global.stat.shppnt * 10) / 10;
      }
      if (global.stat.popt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.times_description_window_appeared_7790bb32",
        );
        dom.tcright.innerHTML = global.stat.popt;
      }
      if (global.stat.dmgdt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.total_damage_dealt_66d3566d",
        );
        dom.tcright.innerHTML = formatw(global.stat.dmgdt);
      }
      if (global.stat.dmgrt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.total_damage_recieved_57eb3280",
        );
        dom.tcright.innerHTML = formatw(global.stat.dmgrt);
      }
      if (global.stat.deadt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.times_died_e52fe16e",
        );
        dom.tcright.innerHTML = global.stat.deadt;
      }
      if (global.stat.deadt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.last_cause_of_casualty_e46940a7",
        );
        dom.tcright.innerHTML = getlastd();
      }
      if (global.stat.akills > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.total_kills_0d62f478",
        );
        dom.tcright.innerHTML = global.stat.akills;
      }
      if (global.stat.onesht > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.times_killed_with_a_single_hit_d7c50b46",
        );
        dom.tcright.innerHTML = global.stat.onesht;
      }
      if (global.stat.misst > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.times_missed_the_attack_f1e62ec1",
        );
        dom.tcright.innerHTML = global.stat.misst;
      }
      if (global.stat.dodgt > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.times_dodged_the_attack_0eda75e1",
        );
        dom.tcright.innerHTML = global.stat.dodgt;
      }
      if (global.stat.msks[0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.humanoid_class_foes_slayed_773fcf22",
        );
        dom.tcright.innerHTML = global.stat.msks[0];
      }
      if (global.stat.msks[1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.beast_class_foes_slayed_8eb77737",
        );
        dom.tcright.innerHTML = global.stat.msks[1];
      }
      if (global.stat.msks[2] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.undead_class_foes_slayed_527de597",
        );
        dom.tcright.innerHTML = global.stat.msks[2];
      }
      if (global.stat.msks[3] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.evil_class_foes_slayed_224857cb",
        );
        dom.tcright.innerHTML = global.stat.msks[3];
      }
      if (global.stat.msks[4] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.phantom_class_foes_slayed_603e18c4",
        );
        dom.tcright.innerHTML = global.stat.msks[4];
      }
      if (global.stat.msks[5] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.dragon_class_foes_slayed_2874beb8",
        );
        dom.tcright.innerHTML = global.stat.msks[5];
      }
      if (global.stat.msts[0][0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.unarmed_attacks_7276903b",
        );
        dom.tcright.innerHTML = global.stat.msts[0][0];
      }
      if (global.stat.msts[0][1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.unarmed_kills_b2c71768",
        );
        dom.tcright.innerHTML = global.stat.msts[0][1];
      }
      if (global.stat.msts[1][0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.sword_attacks_81c7c1fc",
        );
        dom.tcright.innerHTML = global.stat.msts[1][0];
      }
      if (global.stat.msts[1][1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.sword_kills_b8c42371",
        );
        dom.tcright.innerHTML = global.stat.msts[1][1];
      }
      if (global.stat.msts[2][0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.axe_attacks_11a294f1",
        );
        dom.tcright.innerHTML = global.stat.msts[2][0];
      }
      if (global.stat.msts[2][1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.axe_kills_dcd1bfdb",
        );
        dom.tcright.innerHTML = global.stat.msts[2][1];
      }
      if (global.stat.msts[3][0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.dagger_attacks_793083c6",
        );
        dom.tcright.innerHTML = global.stat.msts[3][0];
      }
      if (global.stat.msts[3][1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.dagger_kills_b69d15e2",
        );
        dom.tcright.innerHTML = global.stat.msts[3][1];
      }
      if (global.stat.msts[4][0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.polearm_spear_attacks_332e5572",
        );
        dom.tcright.innerHTML = global.stat.msts[4][0];
      }
      if (global.stat.msts[4][1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.polearm_spear_kills_da0fc89f",
        );
        dom.tcright.innerHTML = global.stat.msts[4][1];
      }
      if (global.stat.msts[5][0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.hammer_club_attacks_300c4b65",
        );
        dom.tcright.innerHTML = global.stat.msts[5][0];
      }
      if (global.stat.msts[5][1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.hammer_club_kills_7fc41152",
        );
        dom.tcright.innerHTML = global.stat.msts[5][1];
      }
      if (global.stat.msts[6][0] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.staff_attacks_8846056f",
        );
        dom.tcright.innerHTML = global.stat.msts[6][0];
      }
      if (global.stat.msts[6][1] > 0) {
        dom.tccon = addElement(dom.statbod, "small", null, "sttc");
        dom.tcleft = addElement(dom.tccon, "div", null, "sttl");
        dom.tcright = addElement(dom.tccon, "div", null, "sttr");
        dom.tcleft.innerHTML = i18n.t(
          "runtime.ui.interface.interface.staff_kills_7427e778",
        );
        dom.tcright.innerHTML = global.stat.msts[6][1];
      }
    });
  }
});

dom.ct_bt1_c = addElement(dom.ctrwin2, "div", "crf_c");
dom.ct_bt1_1_ncont = addElement(dom.ct_bt1_c, "div");
dom.ct_bt1_1_ncont.style.height = "100%";
dom.ct_bt1_1_ncont.style.width = "45%";
dom.ct_bt1_1_cont = addElement(dom.ct_bt1_1_ncont, "div");
dom.ct_bt1_1 = addElement(dom.ct_bt1_1_ncont, "div", "crf_l");
dom.ct_bt1_1.style.height = "343px";
dom.ct_bt1_1.style.width = "100%";
dom.ct_bt1_1_cont.style.bottom = 0;
dom.ct_bt1_1_cont.style.borderBottom = "1px solid cornflowerblue ";
dom.ct_bt1_1_cont.style.display = "flex";
dom.ct_bt1_1_cont_a = addElement(dom.ct_bt1_1_cont, "small", null, "crf_c_bts");
dom.ct_bt1_1_cont_c = addElement(dom.ct_bt1_1_cont, "small", null, "crf_c_bts");
dom.ct_bt1_1_cont_b = addElement(dom.ct_bt1_1_cont, "small", null, "crf_c_bts");
dom.ct_bt1_1_cont_d = addElement(dom.ct_bt1_1_cont, "small", null, "crf_c_bts");
dom.ct_bt1_1_cont_e = addElement(dom.ct_bt1_1_cont, "small", null, "crf_c_bts");
dom.ct_bt1_1_cont_f = addElement(dom.ct_bt1_1_cont, "small", null, "crf_c_bts");
dom.ct_bt1_1_cont_f.style.borderRight = "none";
16;
dom.ct_bt1_1_cont_a.style.backgroundColor = "darkslategrey";
dom.ct_bt1_1_cont_b.style.backgroundColor = "#332e12";
dom.ct_bt1_1_cont_c.style.backgroundColor = "#1c3319";
dom.ct_bt1_1_cont_d.style.backgroundColor = "#b73c0d";
dom.ct_bt1_1_cont_e.style.backgroundColor = "#313254";
dom.ct_bt1_1_cont_f.style.backgroundColor = "#5155d6";
dom.ct_bt1_1_cont_a.addEventListener("click", function () {
  rstcrtthg();
  this.style.color = "yellow";
  rsort(0);
});
dom.ct_bt1_1_cont_b.addEventListener("click", function () {
  rstcrtthg();
  this.style.color = "yellow";
  rsort(1);
});
dom.ct_bt1_1_cont_c.addEventListener("click", function () {
  rstcrtthg();
  this.style.color = "yellow";
  rsort(2);
});
dom.ct_bt1_1_cont_d.addEventListener("click", function () {
  rstcrtthg();
  this.style.color = "yellow";
  rsort(3);
});
dom.ct_bt1_1_cont_e.addEventListener("click", function () {
  rstcrtthg();
  this.style.color = "yellow";
  rsort(4);
});
dom.ct_bt1_1_cont_f.addEventListener("click", function () {
  rstcrtthg();
  this.style.color = "yellow";
  rsort(5);
});
global.spbtsr = [
  dom.ct_bt1_1_cont_a,
  dom.ct_bt1_1_cont_b,
  dom.ct_bt1_1_cont_c,
  dom.ct_bt1_1_cont_d,
  dom.ct_bt1_1_cont_e,
  dom.ct_bt1_1_cont_f,
];
dom.ct_bt1_1_cont_a.innerHTML = i18n.t(
  "runtime.ui.interface.interface.all_6b42874e",
);
dom.ct_bt1_1_cont_b.innerHTML = i18n.t(
  "runtime.ui.interface.interface.fod_c78b7665",
);
dom.ct_bt1_1_cont_c.innerHTML = i18n.t(
  "runtime.ui.interface.interface.med_17311526",
);
dom.ct_bt1_1_cont_d.innerHTML = i18n.t(
  "runtime.ui.interface.interface.wep_22decc29",
);
dom.ct_bt1_1_cont_e.innerHTML = i18n.t(
  "runtime.ui.interface.interface.eqp_7d14e156",
);
dom.ct_bt1_1_cont_f.innerHTML = i18n.t(
  "runtime.ui.interface.interface.mat_0a9e7cda",
);
addDesc(
  dom.ct_bt1_1_cont_a,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.all_6a720856"),
);
addDesc(
  dom.ct_bt1_1_cont_b,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.food_35b25929"),
);
addDesc(
  dom.ct_bt1_1_cont_c,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.medicine_tools_db6a5b00"),
);
addDesc(
  dom.ct_bt1_1_cont_d,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.weapons_f32d0645"),
);
addDesc(
  dom.ct_bt1_1_cont_e,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.equipment_accessories_6556234d"),
);
addDesc(
  dom.ct_bt1_1_cont_f,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.materials_misc_2a802c9a"),
);
dom.ct_bt1_2 = addElement(dom.ct_bt1_c, "div", "crf_r");
dom.ct_bt4_0 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_0a = addElement(dom.ct_bt4_0, "div", null, "opt_t");
dom.ct_bt4_0a.innerHTML = i18n.t("ui.settings.language");
dom.ct_bt4_0b = addElement(dom.ct_bt4_0, "select", null, "opt_v");
for (const locale of i18n.availableLocales) {
  const option = addElement(dom.ct_bt4_0b, "option");
  option.value = locale.code;
  option.textContent = locale.name;
}
dom.ct_bt4_0b.value = i18n.currentLocale;
dom.ct_bt4_0b.addEventListener("change", function () {
  i18n.setLocale(this.value);
});
// Autosave is a preference too, so it lives beside the other preferences rather
// than only inside the save. The interval was previously a 30000 literal
// duplicated between the toggle and the load path, which meant nothing could
// change it and the toggle leaked a timer whenever it was switched on twice.
const autosaveStorageKey = "proto23.autosave";
const autosaveDefaultSeconds = 15;
const autosaveMinSeconds = 5;
const autosaveMaxSeconds = 600;

function autosaveSeconds() {
  return Math.min(
    autosaveMaxSeconds,
    Math.max(
      autosaveMinSeconds,
      Number(global.autosave_seconds) || autosaveDefaultSeconds,
    ),
  );
}

function restartAutosave() {
  clearInterval(timers.autos);
  if (global.flags.autosave !== true) return;
  timers.autos = setInterval(function () {
    save(true);
  }, autosaveSeconds() * 1000);
}

function storeAutosavePreference() {
  try {
    window.localStorage.setItem(
      autosaveStorageKey,
      JSON.stringify({
        enabled: global.flags.autosave === true,
        seconds: autosaveSeconds(),
      }),
    );
  } catch (err) {
    // Storing the preference is best effort.
  }
}

function restoreAutosavePreference() {
  let stored = null;
  try {
    stored = JSON.parse(window.localStorage.getItem(autosaveStorageKey));
  } catch (err) {
    stored = null;
  }
  if (stored) {
    global.flags.autosave = stored.enabled === true;
    global.autosave_seconds = stored.seconds;
  }
  global.autosave_seconds = autosaveSeconds();
  dom.autosves.checked = global.flags.autosave === true;
  dom.ct_bt4_11b.value = global.autosave_seconds;
  restartAutosave();
}

dom.ct_bt4_1 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_1a = addElement(dom.ct_bt4_1, "div", null, "opt_t");
dom.ct_bt4_1a.innerHTML = i18n.t("ui.settings.messageLogLimit");
dom.ct_bt4_1b = addElement(dom.ct_bt4_1, "input", null, "opt_v");
dom.ct_bt4_1b.value = global.msgs_max;
dom.ct_bt4_1b.type = "number";
dom.ct_bt4_1b.min = 1;
dom.ct_bt4_1b.max = 50;
// This limit governs both how many messages stay on screen and how many are
// kept in history, so raising it lengthens what survives a reload.
dom.ct_bt4_1b.addEventListener("change", function () {
  const limit = Math.min(50, Math.max(1, Number(this.value) || 1));
  this.value = limit;
  global.msgs_max = limit;
  trimMessageLog();
  storeMessageLog();
});

dom.ct_bt4_11 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_11a = addElement(dom.ct_bt4_11, "div", null, "opt_t");
dom.ct_bt4_11a.innerHTML = i18n.t("ui.settings.autosaveInterval");
dom.ct_bt4_11b = addElement(dom.ct_bt4_11, "input", null, "opt_v");
dom.ct_bt4_11b.type = "number";
dom.ct_bt4_11b.min = autosaveMinSeconds;
dom.ct_bt4_11b.max = autosaveMaxSeconds;
dom.ct_bt4_11b.value = autosaveSeconds();
dom.ct_bt4_11b.addEventListener("change", function () {
  global.autosave_seconds = Number(this.value);
  this.value = autosaveSeconds();
  global.autosave_seconds = autosaveSeconds();
  // Rebuild immediately so a shorter interval takes effect without a reload.
  restartAutosave();
  storeAutosavePreference();
});

function rstcrtthg() {
  for (const a in global.spbtsr) global.spbtsr[a].style.color = "inherit";
}

// The background is a display preference rather than part of a run, so it is
// stored under its own key like the language is. Keeping it only inside the
// save meant the choice survived a reload only if the player happened to save
// afterwards.
const themeStorageKey = "proto23.theme";

function applyBackground() {
  if (global.flags.bgspc) {
    document.body.style.background = "linear-gradient(180deg,#000,#123)";
    const special = i18n.t("runtime.ui.interface.interface.spcl_a4cfc73e");
    dom.ct_bt4_31b.innerHTML = special;
    dom.ct_bt4_32b.innerHTML = special;
    dom.ct_bt4_33b.innerHTML = special;
  } else {
    document.body.style.background = "";
    document.body.style.backgroundColor =
      "rgb(" + global.bg_r + "," + global.bg_g + "," + global.bg_b + ")";
    dom.ct_bt4_31b.innerHTML = global.bg_r;
    dom.ct_bt4_32b.innerHTML = global.bg_g;
    dom.ct_bt4_33b.innerHTML = global.bg_b;
  }
  dom.ct_bt4_21b.value = global.bg_r;
  dom.ct_bt4_22b.value = global.bg_g;
  dom.ct_bt4_23b.value = global.bg_b;
}

function storeBackground() {
  try {
    window.localStorage.setItem(
      themeStorageKey,
      JSON.stringify({
        r: Number(global.bg_r),
        g: Number(global.bg_g),
        b: Number(global.bg_b),
        special: global.flags.bgspc === true,
      }),
    );
  } catch (err) {
    // Storing the preference is best effort; storage may be unavailable.
  }
}

function setBackground(r, g, b, special) {
  global.flags.bgspc = special === true;
  if (!global.flags.bgspc) {
    global.bg_r = r;
    global.bg_g = g;
    global.bg_b = b;
  }
  applyBackground();
  storeBackground();
}

// Returns whether a stored preference was found, so callers can fall back to
// whatever the save carried for players who never changed the background.
function restoreBackgroundPreference() {
  let stored = null;
  try {
    stored = JSON.parse(window.localStorage.getItem(themeStorageKey));
  } catch (err) {
    stored = null;
  }
  if (!stored) return false;
  global.flags.bgspc = stored.special === true;
  if (!global.flags.bgspc) {
    global.bg_r = stored.r;
    global.bg_g = stored.g;
    global.bg_b = stored.b;
  }
  applyBackground();
  return true;
}

dom.ct_bt4_2 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_2a = addElement(dom.ct_bt4_2, "div", null, "opt_t");
dom.ct_bt4_2a.innerHTML = i18n.t("ui.settings.backgroundColor");
dom.ct_bt4_21b = addElement(dom.ct_bt4_2, "input", null, "opt_v");
dom.ct_bt4_21b.value = global.bg_r;
dom.ct_bt4_21b.type = "range";
dom.ct_bt4_21b.min = 0;
dom.ct_bt4_21b.max = 255;
dom.ct_bt4_21b.style.width = "85px";
dom.ct_bt4_21b.style.height = "16px";
dom.ct_bt4_21b.addEventListener("input", function () {
  setBackground(this.value, global.bg_g, global.bg_b, false);
});
dom.ct_bt4_22b = addElement(dom.ct_bt4_2, "input", null, "opt_v");
dom.ct_bt4_22b.value = global.bg_g;
dom.ct_bt4_22b.type = "range";
dom.ct_bt4_21b.style.height = "16px";
dom.ct_bt4_22b.style.height = "16px";
dom.ct_bt4_22b.min = 0;
dom.ct_bt4_22b.max = 255;
dom.ct_bt4_22b.style.width = "85px";
dom.ct_bt4_22b.style.left = "367px";
dom.ct_bt4_22b.addEventListener("input", function () {
  setBackground(global.bg_r, this.value, global.bg_b, false);
});
dom.ct_bt4_23b = addElement(dom.ct_bt4_2, "input", null, "opt_v");
dom.ct_bt4_23b.value = global.bg_b;
dom.ct_bt4_23b.type = "range";
dom.ct_bt4_21b.style.height = "16px";
dom.ct_bt4_23b.style.height = "16px";
dom.ct_bt4_23b.min = 0;
dom.ct_bt4_23b.max = 255;
dom.ct_bt4_23b.style.width = "85px";
dom.ct_bt4_23b.style.left = "459px";
dom.ct_bt4_23b.addEventListener("input", function () {
  setBackground(global.bg_r, global.bg_g, this.value, false);
});

dom.ct_bt4_3 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_3a = addElement(dom.ct_bt4_3, "div", null, "opt_t");
dom.ct_bt4_3a.innerHTML = "　";
dom.ct_bt4_31b = addElement(dom.ct_bt4_3, "div", null, "opt_v");
dom.ct_bt4_31b.style.textAlign = "center";
dom.ct_bt4_31b.style.width = "83px";
dom.ct_bt4_31b.innerHTML = global.bg_r || 255;
dom.ct_bt4_32b = addElement(dom.ct_bt4_3, "div", null, "opt_v");
dom.ct_bt4_32b.style.textAlign = "center";
dom.ct_bt4_32b.style.width = "83px";
dom.ct_bt4_32b.innerHTML = global.bg_g || 255;
dom.ct_bt4_32b.style.left = "367px";
dom.ct_bt4_33b = addElement(dom.ct_bt4_3, "div", null, "opt_v");
dom.ct_bt4_33b.style.textAlign = "center";
dom.ct_bt4_33b.style.width = "83px";
dom.ct_bt4_33b.innerHTML = global.bg_b || 255;
dom.ct_bt4_33b.style.left = "459px";

dom.ct_bt4_03 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_03a = addElement(dom.ct_bt4_03, "div", null, "opt_t");
dom.ct_bt4_03a.innerHTML = i18n.t("ui.settings.backgroundPresets");
dom.ct_bt4_03b = addElement(
  dom.ct_bt4_03,
  "div",
  "background-presets",
  "opt_v",
);
dom.ct_bt4_03b1 = addElement(
  dom.ct_bt4_03b,
  "small",
  null,
  "background-preset",
);
dom.ct_bt4_03b2 = addElement(
  dom.ct_bt4_03b,
  "small",
  null,
  "background-preset",
);
dom.ct_bt4_03b3 = addElement(
  dom.ct_bt4_03b,
  "small",
  null,
  "background-preset",
);
dom.ct_bt4_03b4 = addElement(
  dom.ct_bt4_03b,
  "small",
  null,
  "background-preset",
);
dom.ct_bt4_03b1.innerHTML = i18n.t("ui.settings.presets.white");
dom.ct_bt4_03b2.innerHTML = i18n.t("ui.settings.presets.grey");
dom.ct_bt4_03b3.innerHTML = i18n.t("ui.settings.presets.night");
dom.ct_bt4_03b4.innerHTML = i18n.t("ui.settings.presets.special");
dom.ct_bt4_03b1.style.color = "#000";
dom.ct_bt4_03b1.style.backgroundColor = "white";
dom.ct_bt4_03b2.style.color = "lightgrey";
dom.ct_bt4_03b2.style.backgroundColor = "#666";
dom.ct_bt4_03b3.style.color = "yellow";
dom.ct_bt4_03b3.style.backgroundColor = "rgb(18,18,46)";
dom.ct_bt4_03b4.style.background = "linear-gradient(180deg,#000,#123)";
dom.ct_bt4_03b1.addEventListener("click", function () {
  setBackground(255, 255, 255, false);
});
dom.ct_bt4_03b2.addEventListener("click", function () {
  setBackground(188, 188, 188, false);
});
dom.ct_bt4_03b3.addEventListener("click", function () {
  setBackground(18, 18, 46, false);
});
dom.ct_bt4_03b4.addEventListener("click", function () {
  setBackground(global.bg_r, global.bg_g, global.bg_b, true);
});

// Apply the stored preference now that every control exists. With no stored
// preference the values carried by the save are used instead.
restoreBackgroundPreference();

dom.ct_bt4_4 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_4a = addElement(dom.ct_bt4_4, "div", null, "opt_t");
dom.ct_bt4_4a.innerHTML = i18n.t("ui.settings.destroyGradients");
dom.ct_bt4_41b = addElement(dom.ct_bt4_4, "input", null, "opt_toggle");
dom.ct_bt4_41b.type = "checkbox";
// `nograd(true)` flattens the gradients and records `grd_s = false`, so the box
// being checked means "gradients destroyed". Read the box rather than the flag:
// deriving the action from the flag desynchronises the two as soon as the flag
// is restored from a save without the box being updated.
dom.ct_bt4_41b.addEventListener("change", function () {
  nograd(this.checked);
});
dom.ct_bt4_5 = addElement(dom.ctrwin4, "div", null, "opt_c");
dom.ct_bt4_5a = addElement(dom.ct_bt4_5, "div", null, "opt_ta");
dom.ct_bt4_5b = addElement(dom.ct_bt4_5, "div", null, "opt_va");
dom.ct_bt4_5a.innerHTML = i18n.t("ui.settings.export");
dom.ct_bt4_5a.style.border = "1px lightgrey solid";
dom.ct_bt4_5a.addEventListener("click", function () {
  if (!global.flags.expatv) {
    t = save(true);
    global.flags.expatv = true;
    dom.ct_bt4_5a_nc = addElement(document.body, "div");
    dom.ct_bt4_5a_nc.style.position = "absolute";
    dom.ct_bt4_5a_nc.style.padding = "2px";
    dom.ct_bt4_5a_nc.style.top = "370px";
    dom.ct_bt4_5a_nc.style.left = "330px";
    dom.ct_bt4_5a_nc.style.width = "600px";
    dom.ct_bt4_5a_nc.style.height = "400px";
    dom.ct_bt4_5a_nc.style.border = "2px solid black";
    dom.ct_bt4_5a_nc.style.backgroundColor = "lightgrey";
    dom.ct_bt4_5a_nh = addElement(dom.ct_bt4_5a_nc, "div");
    dom.ct_bt4_5a_nh.style.height = "20px";
    dom.ct_bt4_5a_nh.style.borderBottom = "2px solid black";
    dom.ct_bt4_5a_nhv = addElement(dom.ct_bt4_5a_nh, "div");
    dom.ct_bt4_5a_nhv.style.float = "left";
    dom.ct_bt4_5a_nhv.style.marginRight = "6px";
    dom.ct_bt4_5a_nhv.style.backgroundColor = "grey";
    dom.ct_bt4_5a_nhv.innerHTML = i18n.t("ui.settings.exportAsText");
    dom.ct_bt4_5a_nhv.addEventListener("click", function () {
      dom.ct_bt4_5a_nbc.value = t;
    });
    dom.ct_bt4_5a_nhz = addElement(dom.ct_bt4_5a_nh, "div");
    dom.ct_bt4_5a_nhz.style.float = "left";
    dom.ct_bt4_5a_nhz.style.backgroundColor = "grey";
    dom.ct_bt4_5a_nhz.innerHTML = i18n.t("ui.settings.exportAsFile");
    dom.ct_bt4_5a_nhz.addEventListener("click", function () {
      const a = new Date();
      const temp = document.createElement("a");
      temp.href = "data:text/plain;charset=utf-8," + t;
      let n = you.name;
      if (/(<.*>)|(\(.*\))/.test(you.name)) n = "";
      temp.download =
        n +
        " - v" +
        global.ver +
        " - " +
        (a.getFullYear() +
          "/" +
          (a.getMonth() + 1) +
          "/" +
          a.getDate() +
          " " +
          a.getHours() +
          "_" +
          (a.getMinutes() >= 10 ? a.getMinutes() : "0" + a.getMinutes()) +
          "_" +
          (a.getSeconds() >= 10 ? a.getSeconds() : "0" + a.getSeconds())) +
        " [Echoes Beneath]";
      temp.click();
    });
    dom.ct_bt4_5a_nhx = addElement(dom.ct_bt4_5a_nh, "div");
    draggable(dom.ct_bt4_5a_nh, dom.ct_bt4_5a_nc);
    dom.ct_bt4_5a_nhx.innerHTML = "✖";
    dom.ct_bt4_5a_nhx.style.float = "right";
    dom.ct_bt4_5a_nhx.style.backgroundColor = "red";
    dom.ct_bt4_5a_nhx.addEventListener("click", function () {
      global.flags.expatv = false;
      empty(dom.ct_bt4_5a_nc);
      document.body.removeChild(dom.ct_bt4_5a_nc);
      kill(dom.ct_bt4_5a_nc);
    });
    dom.ct_bt4_5a_nb = addElement(dom.ct_bt4_5a_nc, "div");
    dom.ct_bt4_5a_nbc = addElement(dom.ct_bt4_5a_nb, "textArea");
    dom.ct_bt4_5a_nbc.style.fontFamily = "MS Gothic";
    dom.ct_bt4_5a_nbc.style.width = "100%";
    dom.ct_bt4_5a_nbc.style.height = "378px";
    dom.ct_bt4_5a_nbc.style.overflow = "auto";
  }
});
dom.ct_bt4_5b.innerHTML = i18n.t("ui.settings.import");
dom.ct_bt4_5b.style.border = "1px lightgrey solid";
dom.ct_bt4_5b.addEventListener("click", function () {
  if (!global.flags.impatv) {
    global.flags.impatv = true;
    dom.ct_bt4_5b_nc = addElement(document.body, "div");
    dom.ct_bt4_5b_nc.style.position = "absolute";
    dom.ct_bt4_5b_nc.style.padding = "2px";
    dom.ct_bt4_5b_nc.style.top = "370px";
    dom.ct_bt4_5b_nc.style.left = "330px";
    dom.ct_bt4_5b_nc.style.width = "600px";
    dom.ct_bt4_5b_nc.style.height = "400px";
    dom.ct_bt4_5b_nc.style.border = "2px solid black";
    dom.ct_bt4_5b_nc.style.backgroundColor = "lightgrey";
    dom.ct_bt4_5b_nh = addElement(dom.ct_bt4_5b_nc, "div");
    dom.ct_bt4_5b_nh.style.height = "20px";
    dom.ct_bt4_5b_nh.style.borderBottom = "2px solid black";
    dom.ct_bt4_5b_nhv = addElement(dom.ct_bt4_5b_nh, "div");
    draggable(dom.ct_bt4_5b_nh, dom.ct_bt4_5b_nc);
    dom.ct_bt4_5b_nhv.style.float = "left";
    dom.ct_bt4_5b_nhv.style.backgroundColor = "grey";
    dom.ct_bt4_5b_nhv.innerHTML = i18n.t("ui.settings.importAsText");
    dom.ct_bt4_5b_nhv.style.marginRight = "6px";
    dom.ct_bt4_5b_nhv.addEventListener("click", function () {
      if (dom.ct_bt4_5b_nbc.value == "" || dom.ct_bt4_5b_nbc.value == "?") {
        dom.ct_bt4_5b_nbc.value = "?";
        return;
      }
      const storage = window.localStorage;
      const t = dom.ct_bt4_5b_nbc.value;
      bt = b64_to_utf8(dom.ct_bt4_5b_nbc.value);
      if (/savevalid/g.test(bt)) {
        storage.setItem("v0.3", t);
        load(t);
        global.flags.impatv = false;
        empty(dom.ct_bt4_5b_nc);
        document.body.removeChild(dom.ct_bt4_5b_nc);
        kill(dom.ct_bt4_5b_nc);
      } else {
        dom.ct_bt4_5b_nbc.value = i18n.t("ui.settings.saveInvalid");
        return;
      }
    });
    dom.ct_bt4_5b_nhx = addElement(dom.ct_bt4_5b_nh, "div");
    dom.ct_bt4_5b_nhx.innerHTML = "✖";
    dom.ct_bt4_5b_nhx.style.float = "right";
    dom.ct_bt4_5b_nhx.style.backgroundColor = "red";
    dom.ct_bt4_5b_nhx.addEventListener("click", function () {
      global.flags.impatv = false;
      empty(dom.ct_bt4_5b_nc);
      document.body.removeChild(dom.ct_bt4_5b_nc);
    });
    dom.ct_bt4_5b_nhz = addElement(dom.ct_bt4_5b_nh, "div");
    dom.ct_bt4_5b_nhz.style.float = "left";
    dom.ct_bt4_5b_nhz.style.backgroundColor = "grey";
    dom.ct_bt4_5b_nhz.innerHTML = i18n.t("ui.settings.loadFile");
    dom.ct_bt4_5b_nhz2 = addElement(dom.ct_bt4_5b_nhz, "input");
    dom.ct_bt4_5b_nhz2.innerHTML = "323";
    dom.ct_bt4_5b_nhz2.accept = ".txt";
    dom.ct_bt4_5b_nhz2.type = "file";
    dom.ct_bt4_5b_nhz2.style.opacity = 0;
    dom.ct_bt4_5b_nhz2.style.position = "absolute";
    dom.ct_bt4_5b_nhz2.style.left = "128px";
    dom.ct_bt4_5b_nhz2.style.width = "81px";
    dom.ct_bt4_5b_nhz2.style.top = 0;
    dom.ct_bt4_5b_nhz2.style.height = "18px";
    dom.ct_bt4_5b_nhz2.addEventListener("change", function () {
      const r = new FileReader();
      r.readAsText(this.files[0]);
      const storage = window.localStorage;
      r.addEventListener("load", function () {
        const t = b64_to_utf8(r.result);
        if (/savevalid/g.test(t)) {
          dom.ct_bt4_5b_nbc.value = i18n.t("ui.settings.loadSuccessful");
          storage.setItem("v0.3", r.result);
          load(r.result);
          global.flags.impatv = false;
          empty(dom.ct_bt4_5b_nc);
          document.body.removeChild(dom.ct_bt4_5b_nc);
          kill(dom.ct_bt4_5b_nc);
        } else {
          dom.ct_bt4_5b_nbc.value = i18n.t("ui.settings.saveInvalid");
          return;
        }
      });
    });
    dom.ct_bt4_5b_nb = addElement(dom.ct_bt4_5b_nc, "div");
    dom.ct_bt4_5b_nbc = addElement(dom.ct_bt4_5b_nb, "textArea");
    dom.ct_bt4_5b_nbc.style.fontFamily = "MS Gothic";
    dom.ct_bt4_5b_nbc.style.width = "100%";
    dom.ct_bt4_5b_nbc.style.height = "378px";
    dom.ct_bt4_5b_nbc.style.overflow = "auto";
  }
});
/*
dom.ct_bt4_6 = addElement(dom.ctrwin4,'div',null,'opt_c');
dom.ct_bt4_6a = addElement(dom.ct_bt4_6,'div',null,'opt_t');
dom.ct_bt4_6a.innerHTML = 'Attach timestamp to messages';
dom.ct_bt4_61b = addElement(dom.ct_bt4_6,'input',null,'opt_v'); dom.ct_bt4_61b.type='checkbox';
dom.ct_bt4_61b.addEventListener('click',()=>{global.flags.msgtm=!global.flags.msgtm});*/

dom.gmsgs = addElement(document.body, "div", "gmsgs");
dom.mstt = addElement(dom.gmsgs, "div", "mstt");
if (!global.flags.aw_u) dom.gmsgs.style.display = "none";
dom.mstt.style.textAlign = "center";
dom.mstt.innerHTML = i18n.t("ui.panels.messageLog");
dom.mstt.style.fontSize = "1.1em";
dom.mstt.style.borderBottom = "dashed 2px RoyalBlue";
dom.mscont = addElement(dom.gmsgs, "div", "mscont");
dom.m_control = addElement(dom.gmsgs, "div", "m_control");
dom.m_b_1 = addElement(dom.m_control, "small", "message-log-freeze", "bts_m");
dom.m_b_1.innerHTML = i18n.t(
  "runtime.ui.interface.interface.freeze_messagelog_5b9b78fb",
);
dom.m_b_1_c = addElement(dom.m_b_1, "span", null, "bts_m_b");
dom.m_b_1.addEventListener("click", () => {
  if (global.flags.m_freeze === false) {
    global.flags.m_freeze = true;
    dom.m_b_1_c.innerHTML = "×";
  } else {
    global.flags.m_freeze = false;
    dom.m_b_1_c.innerHTML = "";
  }
});

dom.m_b_2 = addElement(dom.m_control, "small", "combat-log-toggle", "bts_m");
dom.m_b_2.innerHTML = i18n.t(
  "runtime.ui.interface.interface.stop_combatlog_6a75a8e3",
);
dom.m_b_2_c = addElement(dom.m_b_2, "span", null, "bts_m_b");
dom.m_b_2.addEventListener("click", () => {
  if (global.flags.m_blh === false) {
    global.flags.m_blh = true;
    dom.m_b_2_c.innerHTML = "×";
  } else {
    global.flags.m_blh = false;
    dom.m_b_2_c.innerHTML = "";
  }
});
dom.m_b_3 = addElement(dom.m_control, "small", "message-log-clear", "bts_m");
dom.m_b_3.innerHTML = i18n.t("runtime.ui.interface.interface.clr_ea010417");
dom.m_b_3.style.borderRight = "none";
dom.m_b_3.style.textAlign = "center";
dom.m_b_3.addEventListener("click", clearMessageLog);

addDesc(
  dom.inv_btn_1,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.all_6a720856"),
);
addDesc(
  dom.inv_btn_2,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.weapons_f32d0645"),
);
addDesc(
  dom.inv_btn_3,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.armor_b1fc5d10"),
);
addDesc(
  dom.inv_btn_4,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.comestibles_c238700e"),
);
addDesc(
  dom.inv_btn_5,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.materials_other_0846a0b9"),
);
addDesc(
  dom.inv_btn_1_b,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.alphabetically_0c8123ce"),
);
addDesc(
  dom.inv_btn_2_b,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.by_amount_25d4ecd4"),
);
addDesc(
  dom.inv_btn_3_b,
  null,
  2,
  i18n.t("runtime.ui.interface.description.filter_d7decf1a"),
  i18n.t("runtime.ui.interface.description.by_type_b2f54970"),
);

global.dscr = addElement(document.body, "div", "dscr");
global.dscr.style.display = "none";

function invbtsrst() {
  dom.inv_btn_1.removeAttribute("style");
  dom.inv_btn_2.removeAttribute("style");
  dom.inv_btn_3.removeAttribute("style");
  dom.inv_btn_4.removeAttribute("style");
  dom.inv_btn_5.removeAttribute("style");
  switch (global.sm) {
    case 1:
      dom.inv_btn_1.style.color = "black";
      dom.inv_btn_1.style.backgroundColor = "yellow";
      break;
    case 2:
      dom.inv_btn_2.style.color = "black";
      dom.inv_btn_2.style.backgroundColor = "yellow";
      break;
    case 3:
      dom.inv_btn_3.style.color = "black";
      dom.inv_btn_3.style.backgroundColor = "yellow";
      break;
    case 4:
      dom.inv_btn_4.style.color = "black";
      dom.inv_btn_4.style.backgroundColor = "yellow";
      break;
    case 5:
      dom.inv_btn_5.style.color = "black";
      dom.inv_btn_5.style.backgroundColor = "yellow";
      break;
  }
}

dom.inv_btn_1.innerHTML = i18n.t("runtime.ui.interface.interface.all_6b42874e");
dom.inv_btn_2.innerHTML = i18n.t("runtime.ui.interface.interface.wpn_41ac14b2");
dom.inv_btn_3.innerHTML = i18n.t("runtime.ui.interface.interface.eqp_7d14e156");
dom.inv_btn_4.innerHTML = i18n.t("runtime.ui.interface.interface.use_7dcf46a0");
dom.inv_btn_5.innerHTML = i18n.t(
  "runtime.ui.interface.interface.other_957c024b",
);
dom.inv_btn_1_b.innerHTML = "A-Z";
dom.inv_btn_2_b.innerHTML = "1-9";
dom.inv_btn_3_b.innerHTML = i18n.t(
  "runtime.ui.interface.interface.tpe_73346027",
);
dom.inv_con = addElement(dom.inv_ctx_b, "div", "inv_con");
dom.inv_con.style.padding = "8px";
/*dom.inv_con.addEventListener('scroll',function(){
  for(a in this.children) {if(this.children[a].offsetTop-this.scrollTop+19<0) this.children[a].style.display='none'; else dom.inv_con[a].style.display='';}
});*/
dom.inv_btn_1.addEventListener("click", function () {
  isort(1);
  invbtsrst();
});
dom.inv_btn_2.addEventListener("click", function () {
  isort(2);
  invbtsrst();
});
dom.inv_btn_3.addEventListener("click", function () {
  isort(3);
  invbtsrst();
});
dom.inv_btn_4.addEventListener("click", function () {
  isort(4);
  invbtsrst();
});
dom.inv_btn_5.addEventListener("click", function () {
  isort(5);
  invbtsrst();
});
dom.inv_btn_1_b.addEventListener("click", function () {
  if (global.flags.sort_a === true) {
    inv.sort(function (a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    global.flags.sort_a = false;
  } else {
    inv.sort(function (a, b) {
      if (a.name > b.name) return -1;
      if (a.name < b.name) return 1;
      return 0;
    });
    global.flags.sort_a = true;
  }
  iftrunkopenc(1);
  isort(global.sm);
});
dom.inv_btn_2_b.addEventListener("click", function () {
  if (global.flags.sort_b === true) {
    inv.sort(function (a, b) {
      if (a.amount < b.amount) return -1;
      if (a.amount > b.amount) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    global.flags.sort_b = false;
  } else {
    inv.sort(function (a, b) {
      if (a.amount > b.amount) return -1;
      if (a.amount < b.amount) return 1;
      if (a.name > b.name) return -1;
      if (a.name < b.name) return 1;
      return 0;
    });
    global.flags.sort_b = true;
  }
  iftrunkopenc(1);
  isort(global.sm);
});
dom.inv_btn_3_b.addEventListener("click", function () {
  if (global.flags.sort_c === true) {
    inv.sort(function (a, b) {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    global.flags.sort_c = false;
  } else {
    inv.sort(function (a, b) {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      if (a.name > b.name) return -1;
      if (a.name < b.name) return 1;
      return 0;
    });
    global.flags.sort_c = true;
  }
  iftrunkopenc(1);
  isort(global.sm);
});
dom.d3.update = function () {
  this.innerHTML = i18n.t("ui.hud.levelTitle", {
    level: you.lvl,
    title: you.title.name,
  });
};
dom.d5_1_1.update = function () {
  this.innerHTML = i18n.t("ui.hud.health", {
    current: format3(you.hp.toString()),
    max: format3(you.hpmax.toString()),
  });
  dom.d5_1.style.width = (100 * you.hp) / you.hpmax + "%";
};
dom.d5_2_1.update = function () {
  this.innerHTML = i18n.t("ui.hud.experience", {
    current: format3(Math.round(you.exp).toString()),
    max: format3(you.expnext_t.toString()),
  });
  dom.d5_2.style.width = (100 * you.exp) / you.expnext_t + "%";
};
dom.d5_2_1.update();
dom.d5_3_1.update = function () {
  this.innerHTML = i18n.t("ui.hud.energy", {
    current: format3(Math.round(you.sat).toString()),
    max: format3(you.satmax.toString()),
    efficiency: Math.round(you.efficiency() * 100),
  });
  dom.d5_3.style.width =
    you.sat >= 0 ? (100 * you.sat) / you.satmax + "%" : "0%";
};
dom.d6.update = function () {
  this.innerHTML = i18n.t("ui.hud.rank", {
    rank: format3(you.rank().toString()),
  });
};
dom.d6.update();
dom.hit_c = function () {
  let hit_a = hit_calc(1);
  let hit_b = hit_calc(2);
  const drk = global.flags.isdark && !cansee();
  if (hit_a > 100) hit_a = 100;
  else if (hit_a < 0) hit_a = 0;
  if (hit_b > 100) hit_b = 100;
  else if (hit_b < 0) hit_b = 0;
  dom.d8.innerHTML = i18n.t("ui.hud.hitAndDodgeChance", {
    hit:
      '<span style="color:' +
      (drk ? "darkgrey" : "") +
      '">' +
      Math.round(hit_a * (drk ? 0.3 + skl.ntst.lvl * 0.07 : 1)) +
      "%</span>",
    dodge: 100 - Math.round(hit_b) + "%",
    modifier:
      you.mods.ddgmod !== 0
        ? '(<span style="color:orange">' + you.mods.ddgmod * 100 + "%</span>)"
        : "",
  });
};

dom.sl = addElement(document.body, "div", "sl", "noselect");
dom.sl.style.zIndex = 10000;
dom.sl_s = addElement(dom.sl, "span", "save-game", "sl");
dom.sl_s.innerHTML = i18n.t("runtime.ui.interface.interface.save_13a4a113");
dom.sl_s.addEventListener("click", () => {
  save();
  const j = addElement(dom.sl, "span");
  j.style.fontSize = ".9em";
  j.style.padding = "3px";
  j.innerHTML = i18n.t("runtime.ui.interface.interface.saved_19d5b4ec");
  fade(j);
  setTimeout(() => {
    dom.sl.removeChild(j);
  }, 500);
});
dom.sl_l = addElement(dom.sl, "span", "load-game", "sl");
dom.sl_l.innerHTML = i18n.t("runtime.ui.interface.interface.load_5dbc716c");
dom.sl_l.addEventListener("click", () => load(null, true));
dom.sl_h = addElement(dom.sl, "span", "save-bar-collapse", "sl");
dom.sl_h.innerHTML = ">>";
dom.sl_h.addEventListener("click", () => {
  dom.sl.style.display = "none";
  if (dom.sl_h_n) empty(dom.sl_h_n);
  dom.sl_h_n = addElement(document.body, "span", "save-bar-restore", "sl");
  dom.sl_h_n.innerHTML = "<<";
  dom.sl_h_n.addEventListener("click", () => {
    dom.sl.style.display = "";
    empty(dom.sl_h_n);
    document.body.removeChild(dom.sl_h_n);
  });
});
dom.sl_extra = addElement(dom.sl, "span", "save-status", "sl");
dom.sl_extra.style.borderLeft = "none";
dom.sl_extra.innerHTML = i18n.t(
  "runtime.ui.interface.interface.game_not_saved_626be345",
);
dom.sl_controls = addElement(dom.sl, "div", "save-bar-controls");
dom.autosve = addElement(dom.sl_controls, "span", null, "sl");
dom.autosve.innerHTML = i18n.t(
  "runtime.ui.interface.interface.autosave_ff6ad920",
);
dom.autosves = addElement(dom.autosve, "input", "autosave-toggle");
dom.autosves.type = "checkbox";
dom.autosves.addEventListener("change", function () {
  global.flags.autosave = this.checked;
  restartAutosave();
  storeAutosavePreference();
});

dom.vrs = addElement(dom.sl_controls, "a", "game-version", "sl");
dom.vrs.innerHTML = "v" + global.ver;
dom.vrs.style.textDecoration = "underline";
dom.vrs.href = new URL("changelog/changelog.html", document.baseURI).href;
dom.vrs.target = "_blank";
dom.vrs.rel = "noopener";
dom.sl_kill = addElement(dom.sl_controls, "span", null, "sl");
dom.sl_kill.innerHTML = i18n.t(
  "runtime.ui.interface.interface.delete_the_save_b765bc3d",
);
dom.sl_kill.tabIndex = 0;
dom.sl_kill.setAttribute("role", "button");

// Shared confirmation dialog. Builds a native <dialog> using the same
// `game-modal` styling as the save-deletion modal, so every confirmation in the
// game is keyboard accessible, dismissable with Escape or a backdrop click, and
// returns focus to whatever opened it. The dialog is removed from the DOM once
// it closes, so callers can open one per interaction without leaking elements.
let confirmModalCount = 0;

function showConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  // A notice has nothing to cancel and nothing destructive to warn about, so it
  // gets a single neutral button instead of the cancel/danger pair.
  showCancel = true,
  danger = true,
}) {
  confirmModalCount++;
  const titleId = "confirm-modal-title-" + confirmModalCount;
  const messageId = "confirm-modal-message-" + confirmModalCount;
  const modal = addElement(document.body, "dialog", null, "game-modal");
  modal.setAttribute("aria-labelledby", titleId);
  modal.setAttribute("aria-describedby", messageId);
  modal.setAttribute("aria-modal", "true");

  const header = addElement(modal, "div", null, "game-modal__header");
  const heading = addElement(header, "strong", titleId);
  heading.textContent = title;
  const body = addElement(modal, "p", messageId, "game-modal__message");
  body.innerHTML = message;

  const actions = addElement(modal, "div", null, "game-modal__actions");
  let cancel = null;
  if (showCancel) {
    cancel = addElement(actions, "button", null, "game-modal__button");
    cancel.type = "button";
    cancel.textContent = i18n.t("ui.common.cancel");
  }
  const confirm = addElement(
    actions,
    "button",
    null,
    danger
      ? "game-modal__button game-modal__button--danger"
      : "game-modal__button",
  );
  confirm.type = "button";
  confirm.textContent = confirmLabel;

  const restoreFocus = document.activeElement;
  function close() {
    if (modal.open) modal.close();
  }
  if (cancel) cancel.addEventListener("click", close);
  confirm.addEventListener("click", () => {
    close();
    onConfirm();
  });
  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  modal.addEventListener("click", (event) => {
    if (event.target !== modal) return;
    const bounds = modal.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      close();
  });
  modal.addEventListener("close", () => {
    modal.remove();
    restoreFocus?.focus();
  });

  modal.showModal();
  (cancel || confirm).focus();
  return modal;
}

// Player-facing notes for releases the player may not have seen. The text lives
// in the locale files so both languages stay in step; this table only says which
// versions have notes and where to read them from, spelled out one key at a time
// so the localization check can still verify them.
const releaseNotes = [
  {
    version: 477,
    read: () => i18n.get("ui.releaseNotes.v477"),
  },
];

// Shows what changed since the build the player last opened. Returns whether
// anything was worth showing, so the caller can tell "nothing new" from "shown".
function showReleaseNotes(fromVersion) {
  const unseen = releaseNotes
    .filter(
      (entry) => entry.version > fromVersion && entry.version <= global.ver,
    )
    .sort((a, b) => b.version - a.version);
  if (!unseen.length) return false;

  const sections = unseen.map((entry) => {
    const notes = entry.read();
    const items = (Array.isArray(notes) ? notes : [notes])
      .map((note) => "<li>" + note + "</li>")
      .join("");
    return (
      '<strong class="release-notes__version">v' +
      entry.version +
      '</strong><ul class="release-notes__list">' +
      items +
      "</ul>"
    );
  });

  showConfirmModal({
    title: i18n.t("ui.releaseNotes.title"),
    message:
      '<span class="release-notes__intro">' +
      i18n.t("ui.releaseNotes.intro", { from: fromVersion }) +
      "</span>" +
      sections.join(""),
    confirmLabel: i18n.t("ui.releaseNotes.dismiss"),
    onConfirm: () => {},
    showCancel: false,
    danger: false,
  });
  return true;
}

dom.save_delete_modal = addElement(
  document.body,
  "dialog",
  "save-delete-modal",
  "game-modal",
);
dom.save_delete_modal.setAttribute("aria-labelledby", "save-delete-title");
dom.save_delete_modal.setAttribute("aria-describedby", "save-delete-message");
dom.save_delete_modal.setAttribute("aria-modal", "true");
dom.save_delete_header = addElement(
  dom.save_delete_modal,
  "div",
  null,
  "game-modal__header",
);
dom.save_delete_title = addElement(
  dom.save_delete_header,
  "strong",
  "save-delete-title",
);
dom.save_delete_title.textContent = i18n.t("ui.settings.deleteSaveTitle");
dom.save_delete_message = addElement(
  dom.save_delete_modal,
  "p",
  "save-delete-message",
  "game-modal__message",
);
dom.save_delete_message.textContent = i18n.t("ui.settings.deleteSaveConfirm");
dom.save_delete_actions = addElement(
  dom.save_delete_modal,
  "div",
  null,
  "game-modal__actions",
);
dom.save_delete_cancel = addElement(
  dom.save_delete_actions,
  "button",
  "save-delete-cancel",
  "game-modal__button",
);
dom.save_delete_cancel.type = "button";
dom.save_delete_cancel.textContent = i18n.t("ui.settings.cancelDelete");
dom.save_delete_confirm = addElement(
  dom.save_delete_actions,
  "button",
  "save-delete-confirm",
  "game-modal__button game-modal__button--danger",
);
dom.save_delete_confirm.type = "button";
dom.save_delete_confirm.textContent = i18n.t("ui.settings.confirmDelete");

let saveDeleteRestoreFocus;
function closeSaveDeleteModal() {
  if (dom.save_delete_modal.open) dom.save_delete_modal.close();
}
function openSaveDeleteModal() {
  saveDeleteRestoreFocus = document.activeElement;
  if (!dom.save_delete_modal.open) dom.save_delete_modal.showModal();
  dom.save_delete_cancel.focus();
}

dom.sl_kill.addEventListener("click", openSaveDeleteModal);
dom.sl_kill.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openSaveDeleteModal();
});
dom.save_delete_cancel.addEventListener("click", closeSaveDeleteModal);
dom.save_delete_modal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeSaveDeleteModal();
});
dom.save_delete_modal.addEventListener("click", (event) => {
  if (event.target !== dom.save_delete_modal) return;
  const bounds = dom.save_delete_modal.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    closeSaveDeleteModal();
});
dom.save_delete_modal.addEventListener("close", () => {
  saveDeleteRestoreFocus?.focus();
  saveDeleteRestoreFocus = null;
});
dom.save_delete_confirm.addEventListener("click", () => {
  localStorage.removeItem("v0.3");
  window.location.reload();
});

function update_db() {
  dom.d4_1.innerHTML = i18n.t("ui.hud.stat", {
    stat: i18n.t("ui.hud.abbr.str"),
    value: Math.round(you.str_d),
  });
  dom.d4_2.innerHTML = i18n.t("ui.hud.stat", {
    stat: i18n.t("ui.hud.abbr.agl"),
    value: Math.round(you.agl_d),
  });
  dom.d4_3.innerHTML = i18n.t("ui.hud.stat", {
    stat: i18n.t("ui.hud.abbr.int"),
    value: Math.round(you.int_d),
  });
  dom.d4_4.innerHTML = i18n.t("ui.hud.stat", {
    stat: i18n.t("ui.hud.abbr.spd"),
    value: you.spd,
  });
  dom.d8_3.innerHTML = i18n.t("ui.hud.stat", {
    stat: i18n.t("ui.hud.abbr.luck"),
    value: Math.round(you.luck),
  });
}
update_db();

function update_d() {
  dom.d5_1_1m.innerHTML = i18n.t("ui.hud.health", {
    current: format3(global.current_m.hp.toString()),
    max: format3(global.current_m.hpmax.toString()),
  });
  dom.d5_1m.style.width =
    (100 * global.current_m.hp) / global.current_m.hpmax + "%";
  dom.hit_c();
  dom.d5_3_1.update();
  dom.d5_1_1.update();
}
update_d();

global.text.mtp = i18n.get("gameText.mtp");

function update_m() {
  dom.d2m.innerHTML = global.current_m.name;
  let mtp = global.text.mtp[global.current_m.type];
  if (global.current_m.id >= 1)
    mtp += global.current_m.sex === true ? " ♂" : " ♀";
  dom.d3m.innerHTML = i18n.t("ui.hud.levelTitle", {
    level: global.current_m.lvl,
    title: mtp,
  });
  dom.d4_1m.innerHTML = i18n.t("ui.hud.stat", {
    stat: "STR",
    value: Math.round(global.current_m.str),
  });
  dom.d4_2m.innerHTML = i18n.t("ui.hud.stat", {
    stat: "AGL",
    value: Math.round(global.current_m.agl),
  });
  dom.d4_3m.innerHTML = i18n.t("ui.hud.stat", {
    stat: "INT",
    value: Math.round(global.current_m.int),
  });
  dom.d4_4m.innerHTML = i18n.t("ui.hud.stat", {
    stat: "SPD",
    value: global.current_m.spd,
  });
  dom.d9m.update();
}

testz = new Area();
testz.apop = 4000;
testz.bpop = 6000;
testz.vsize = 10000;
global.zone_a_p[0] = testz;

function offline_a() {
  global.offline_evil_index = 0;
  for (const i in global.zone_a_p) {
    const zone = global.zone_a_p[i];
    const apower = (zone.apop / zone.bpop) * 2;
    zone.vsize += zone.vsize * 0.0008 + 5;
    zone.apop +=
      zone.apop *
      (randf(Math.log(zone.apop) * 0.8, Math.log(zone.apop) * 1.2) / 1000);
    zone.bpop +=
      zone.bpop *
      (randf(Math.log(zone.bpop) * 0.8, Math.log(zone.bpop) * 1.2) / 1000);
    if (zone.apop > 0) zone.vsize -= Math.log2(zone.apop) * 2;
    else zone.bpop -= rand(20, 50);
    if (zone.bpop > 0) zone.apop -= zone.bpop / rand(40, 100);
    if (zone.vsize < 0) zone.apop -= rand(20, 50);
    global.offline_evil_index += zone.bpop;
    console.log(
      "docile: " +
        zone.apop +
        " predator: " +
        zone.bpop +
        " forest: " +
        zone.vsize,
    );
  }
  global.offline_evil_index = Math.sqrt(global.offline_evil_index + 2100) / 45;
}

function positionDescription(c) {
  const scale = Number.parseFloat(document.body.style.zoom) || 1;
  const gap = 16 / scale;
  const cursorX = c.clientX / scale;
  const cursorY = c.clientY / scale;
  const viewportWidth = window.innerWidth / scale;
  const viewportHeight = window.innerHeight / scale;
  const tooltipWidth = global.dscr.offsetWidth;
  const tooltipHeight = global.dscr.offsetHeight;
  let left = cursorX + gap;
  let top = cursorY + gap;

  if (left + tooltipWidth + gap > viewportWidth) {
    left = cursorX - tooltipWidth - gap;
  }
  if (top + tooltipHeight + gap > viewportHeight) {
    top = cursorY - tooltipHeight - gap;
  }

  global.dscr.style.left = `${Math.max(gap, left)}px`;
  global.dscr.style.top = `${Math.max(gap, top)}px`;
}

function dscr(c, what, type, ttl, dsc, id) {
  id = id || 0;
  global.dscr.style.display = "";
  empty(global.dscr);
  if (!type || type === 1) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = what.name;
    switch (what.rar) {
      case 0: {
        this.label.style.color = "grey";
        break;
      }
      case 2: {
        this.label.style.textShadow = "0px 0px 1px blue";
        this.label.style.color = "cyan";
        break;
      }
      case 3: {
        this.label.style.textShadow = "0px 0px 2px lime";
        this.label.style.color = "lime";
        break;
      }
      case 4: {
        this.label.style.textShadow = "0px 0px 3px orange";
        this.label.style.color = "yellow";
        break;
      }
      case 5: {
        this.label.style.textShadow = "0px 0px 2px crimson,0px 0px 5px red";
        this.label.style.color = "orange";
        break;
      }
      case 6: {
        this.label.style.textShadow = "1px 1px 1px black,0px 0px 2px purple";
        this.label.style.color = "purple";
        break;
      }
    }
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML =
      typeof what.desc === "function" ? what.desc(what) : what.desc;
    if (what.slot > 0) {
      if (what.slot === 1) {
        if (what.str > 0)
          this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
            stat: "STR",
            value: "<span style='color:lime'> +" + what.str + "</span><br>",
          });
        else if (what.str < 0)
          this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
            stat: "STR",
            value: "<span style='color:red'>" + what.str + "</span><br>",
          });
      } else {
        if (what.str > 0)
          this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
            stat: "DEF",
            value: "<span style='color:lime'> +" + what.str + "</span><br>",
          });
        else if (what.str < 0)
          this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
            stat: "DEF",
            value: "<span style='color:red'>" + what.str + "</span><br>",
          });
      }
      if (what.agl > 0)
        this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
          stat: "AGL",
          value: "<span style='color:lime'> +" + what.agl + "</span><br>",
        });
      else if (what.agl < 0)
        this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
          stat: "AGL",
          value: "<span style='color:red'>" + what.agl + "</span><br>",
        });
      if (what.int > 0)
        this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
          stat: "INT",
          value: "<span style='color:lime'> +" + what.int + "</span><br>",
        });
      else if (what.int < 0)
        this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
          stat: "INT",
          value: "<span style='color:red'>" + what.int + "</span><br>",
        });
      if (what.spd > 0)
        this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
          stat: "SPD",
          value: "<span style='color:lime'> +" + what.spd + "</span><br>",
        });
      else if (what.spd < 0)
        this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
          stat: "SPD",
          value: "<span style='color:red'>" + what.spd + "</span><br>",
        });

      if (what.slot < 8) {
        // Label, gauge, and number sit side by side. The number used to be
        // rendered inside the coloured fill bar, where it was unreadable at the
        // yellow and green levels and drifted as the bar shortened.
        this.dp_c = addElement(global.dscr, "div", "dr_l");
        this.dp_t = addElement(this.dp_c, "small", null, "durability-label");
        this.dp_t.innerHTML = i18n.t("ui.itemDescription.durability");
        this.dp_track = addElement(
          this.dp_c,
          "small",
          null,
          "durability-track",
        );
        this.dp_m = addElement(this.dp_track, "small", "dp_m");
        this.dp_mn = addElement(this.dp_c, "small", null, "durability-value");
        this.dp_mn.innerHTML = ((what.dp * 10) << 0) / 10 + "\/" + what.dpmax;
        const dp = (what.dp * 100) / what.dpmax;
        this.dp_m.style.width = dp + "%";
        if (dp >= 90) this.dp_m.style.backgroundColor = "royalblue";
        else if (dp < 90 && dp >= 70) this.dp_m.style.backgroundColor = "green";
        else if (dp < 70 && dp >= 35)
          this.dp_m.style.backgroundColor = "yellow";
        else if (dp < 35 && dp >= 10)
          this.dp_m.style.backgroundColor = "orange";
        else if (dp < 10) this.dp_m.style.backgroundColor = "red";
        clearInterval(timers.dp_tmr);
        timers.dp_tmr = setInterval(function () {
          const dp = (what.dp * 100) / what.dpmax;
          this.dp_mn.innerHTML = ((what.dp * 10) << 0) / 10 + "\/" + what.dpmax;
          this.dp_m.style.width = dp + "%";
          if (dp >= 90) this.dp_m.style.backgroundColor = "royalblue";
          else if (dp < 90 && dp >= 70)
            this.dp_m.style.backgroundColor = "green";
          else if (dp < 70 && dp >= 35)
            this.dp_m.style.backgroundColor = "yellow";
          else if (dp < 35 && dp >= 10)
            this.dp_m.style.backgroundColor = "orange";
          else if (dp < 10) this.dp_m.style.backgroundColor = "red";
        }, 1000);
      }
      this.sltic = addElement(global.dscr, "div", "intfffx");
      this.sltic.style.textAlign = "left";
      const slti = addElement(this.sltic, "small");
      slti.innerHTML = i18n.t("runtime.ui.interface.interface.class_c947dcb8");
      if (!!what.wtype) {
        switch (what.wtype) {
          case 0:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.unarmed_9276105c",
            );
            break;
          case 1:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.sword_4a126f43",
            );
            break;
          case 2:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.axe_7ed611de",
            );
            break;
          case 3:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.knife_7ac760d1",
            );
            break;
          case 4:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.spear_polearm_f11359fb",
            );
            break;
          case 5:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.club_hammer_de4ce44b",
            );
            break;
          case 6:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.staff_wand_37a828e4",
            );
            break;
          case 7:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.bow_crossbow_a68f019b",
            );
            break;
        }
      } else {
        switch (what.slot) {
          case 2:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.shield_08271419",
            );
            break;
          case 3:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.head_e5ffd15b",
            );
            break;
          case 4:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.body_718a7e8a",
            );
            break;
          case 5:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.hands_1f8e3c7c",
            );
            break;
          case 6:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.hands_1f8e3c7c",
            );
            break;
          case 7:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.legs_29518d04",
            );
            break;
          case 8:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.accessory_962403f6",
            );
            break;
          case 9:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.accessory_962403f6",
            );
            break;
          case 10:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.accessory_962403f6",
            );
            break;
        }
      }
      if (what.twoh === true) slti.innerHTML += " (2H)";
      if (what.slot === 1)
        switch (what.ctype) {
          case 0:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.edged_f4c33c1a",
            );
            break;
          case 1:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.piercing_f88ebf1b",
            );
            break;
          case 2:
            slti.innerHTML += i18n.t(
              "runtime.ui.interface.interface.blunt_dfa0d57a",
            );
            break;
        }
      if (what.data.kills) {
        const sp = addElement(
          this.sltic,
          "small",
          null,
          "item-description-kills",
        );
        sp.innerHTML = i18n.t("ui.itemDescription.kills", {
          kills: col(what.data.kills, "yellow"),
        });
        clearInterval(timers.wpnkilsch);
        timers.wpnkilsch = setInterval(function () {
          sp.innerHTML = i18n.t("ui.itemDescription.kills", {
            kills: col(what.data.kills, "yellow"),
          });
        }, 1000);
      }
    } else {
      this.sltic = addElement(global.dscr, "div");
      this.sltic.style.textAlign = "left";
      const slti = addElement(this.sltic, "small");
      slti.innerHTML = i18n.t("runtime.ui.interface.interface.class_c947dcb8");
      if (what.isf === true) {
        slti.innerHTML += i18n.t(
          "runtime.ui.interface.interface.furniture_fe8691c1",
        );
        this.text.innerHTML +=
          dom.dseparator + i18n.t("ui.itemDescription.addToFurnitureList");
        if (what.parent) {
          let owned = false;
          const sp = addElement(this.sltic, "small");
          sp.style.position = "absolute";
          sp.style.right = "6px";
          for (const a in furn)
            if (furn[a].id === what.parent.id) {
              owned = true;
              break;
            }
          sp.innerHTML = i18n.t("ui.itemDescription.owned", {
            color: owned ? "lime" : "red",
            state: i18n.t(
              owned ? "ui.common.yesLowercase" : "ui.common.noLowercase",
            ),
          });
        }
      } else if (what.id < 3000) {
        slti.innerHTML += i18n.t(
          "runtime.ui.interface.interface.food_35b25929",
        );
        if (what.rot)
          slti.innerHTML += "(" + i18n.t("ui.itemDescription.perishable") + ")";
      } else if (what.id >= 3000 && what.id < 5000)
        slti.innerHTML += i18n.t(
          "runtime.ui.interface.interface.medicine_tool_c2e6c5a1",
        );
      else if (what.id >= 5000 && what.id < 9000)
        slti.innerHTML += i18n.t(
          "runtime.ui.interface.interface.material_misc_15fe1f96",
        );
      else
        slti.innerHTML += i18n.t(
          "runtime.ui.interface.interface.book_f69f2330",
        );
    }
    if (what.id < 3000) {
      dom.dtrd = addElement(this.sltic, "small");
      dom.dtrd.innerHTML = i18n.t(
        "runtime.ui.interface.interface.tried_3b655872",
      );
      dom.dtrd.style.position = "relative";
      dom.dtrd.style.right = "1px";
      dom.dtrd.style.float = "right";
      if (what.data.tried === true)
        dom.dtrd.innerHTML += i18n.t(
          "runtime.ui.interface.interface.yes_d0868e8f",
        );
      else
        dom.dtrd.innerHTML += i18n.t(
          "runtime.ui.interface.interface.never_40f2f2a5",
        );
    }
    if (what.id >= 9000 && what.id < 10000) {
      dom.dtrd = addElement(this.sltic, "small");
      dom.dtrd.innerHTML = i18n.t(
        "runtime.ui.interface.interface.read_a91c5789",
      );
      dom.dtrd.style.position = "relative";
      dom.dtrd.style.right = "1px";
      dom.dtrd.style.float = "right";
      if (what.data.finished === true)
        dom.dtrd.innerHTML += i18n.t(
          "runtime.ui.interface.interface.yes_d0868e8f",
        );
      else
        dom.dtrd.innerHTML += i18n.t(
          "runtime.ui.interface.interface.never_40f2f2a5",
        );
    }
    this.rar_c = addElement(global.dscr, "div", "d_l", "item-rarity");
    // The durability gauge is absolutely pinned to this row's right-hand corner,
    // so the stars have to stop short of it. Only equipment carries one.
    if (what.slot < 8) this.rar_c.classList.add("item-rarity--with-gauge");
    this.rar = addElement(this.rar_c, "small");
    this.rar.innerHTML = i18n.t(
      "runtime.ui.interface.interface.rarity_d2a5dcc5",
    );
    this.rar.style.position = "relative";
    this.rar.style.float = "left";
    for (let i = 0; i < what.rar; i++) this.rar.innerHTML += " ★ ";
    dom.dscshe = addElement(global.dscr, "div"); //dom.dscshe.innerHTML = dom.dseparator+'2323'; dom.dscshe.style.paddingTop="20px";
    global.shiftitem = { item: what };
  } else if (type === 2) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = ttl;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = dsc;
  } else if (type === 3) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = global.current_m.name;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = global.current_m.desc;
  } else if (type === 4) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = ttl;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = dsc;
    dom.gde = addElement(global.dscr, "small");
    // Was "relavite", which the browser discarded silently.
    dom.gde.style.position = "relative";
    dom.gde.style.float = "left";
    dom.gde.innerHTML = i18n.t(
      "runtime.ui.interface.interface.duration_34776f74",
    );
    if (what.duration !== -1) dom.gde.innerHTML += what.duration;
    else dom.gde.innerHTML += "∞";
    if (what.power) {
      dom.gde1 = addElement(global.dscr, "small");
      dom.gde1.style.position = "relavite";
      dom.gde1.style.float = "right";
      dom.gde1.innerHTML = i18n.t(
        "runtime.ui.interface.interface.power_0eb78a04",
      );
      dom.gde1.innerHTML += what.power;
    }
    clearInterval(timers.inup);
    timers.inup = setInterval(function () {
      dom.gde.innerHTML = i18n.t(
        "runtime.ui.interface.interface.duration_34776f74",
      );
      if (what.duration !== -1) dom.gde.innerHTML += what.duration;
      else dom.gde.innerHTML += "∞";
    }, 200);
  } else if (type === 5) {
    const t = ttl === true ? you.title : what;
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = t.name;
    const rarity = titleRarityStyle(t.rar);
    this.label.style.color = rarity.color;
    this.label.style.textShadow = rarity.shadow;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = t.desc;
    if (t.talent)
      this.text.innerHTML +=
        dom.dseparator +
        i18n.t("ui.itemDescription.talentEffect", { effect: t.tdesc });
    this.dl = addElement(global.dscr, "small");
    this.dl.style.position = "relative";
    this.dl.style.display = "flex";
    this.dl.innerHTML =
      i18n.t("runtime.ui.interface.interface.rank_b4d80d7b") +
      (ttl === true
        ? you.title.id === 0
          ? "0"
          : you.title.rar
        : what.id === 0
          ? "0"
          : what.rar);
    if (
      (ttl === true && you.title.rars === true) ||
      (!ttl && what.rars === true)
    )
      this.dl.innerHTML += "★";
  } else if (type === 6) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = !!what.bname ? what.bname : what.name;
    this.sp = addElement(this.label, "small");
    this.sp.style.position = "absolute";
    this.sp.style.right = "6px";
    this.sp.innerHTML = "Ｐ: " + col(Math.round(what.p * 100) + "%", "magenta");
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = what.desc;
    if (!!what.mlstn) {
      this.prks = addElement(global.dscr, "div", "d_l");
      this.prks.innerHTML = i18n.t(
        "runtime.ui.interface.interface.perks_unlocked_456164aa",
      );
      this.prks.style.color = "cyan";
      for (let k = 0; k < what.mlstn.length; k++)
        if (what.mlstn[k].g === true) {
          this.prk = addElement(global.dscr, "div", "d_t");
          this.prk.innerHTML = i18n.t("ui.itemDescription.perkLevel", {
            level: what.mlstn[k].lv,
            perk: what.mlstn[k].p,
          });
        } else {
          this.prk = addElement(global.dscr, "div", "d_t");
          this.prk.innerHTML = i18n.t("ui.itemDescription.perkLevel", {
            level: what.mlstn[k].lv,
            perk: "??????????",
          });
          return;
        }
    }
  } else if (type === 7) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = what.x;
    this.label.style.color = "tomato";
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = what.y;
  } else if (type === 8) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = what.name;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = what.desc;
    this.dl = addElement(global.dscr, "small");
    this.dl.style.position = "relative";
    this.dl.style.display = "flex";
    this.dl.innerHTML = i18n.t("runtime.ui.interface.interface.rank_b4d80d7b");
    this.db = addElement(this.dl, "div");
    for (let i = 0; i < what.rar; i++) this.db.innerHTML += "★";
    this.db.style.paddingTop = "12px";
    this.db.style.paddingLeft = "6px";
    switch (what.rar) {
      case 0: {
        this.label.style.color = this.db.style.color = "grey";
        break;
      }
      case 2: {
        this.label.style.textShadow = this.db.style.textShadow =
          "0px 0px 1px blue";
        this.label.style.color = this.db.style.color = "cyan";
        break;
      }
      case 3: {
        this.label.style.textShadow = this.db.style.textShadow =
          "0px 0px 2px lime";
        this.label.style.color = this.db.style.color = "lime";
        break;
      }
      case 4: {
        this.label.style.textShadow = this.db.style.textShadow =
          "0px 0px 3px orange";
        this.label.style.color = this.db.style.color = "yellow";
        break;
      }
      case 5: {
        this.label.style.textShadow = this.db.style.textShadow =
          "0px 0px 2px crimson,0px 0px 5px red";
        this.label.style.color = this.db.style.color = "orange";
        break;
      }
      case 6: {
        this.label.style.textShadow = this.db.style.textShadow =
          "1px 1px 1px black,0px 0px 2px purple";
        this.label.style.color = this.db.style.color = "purple";
        break;
      }
      case 7: {
        this.label.style.textShadow = this.db.style.textShadow =
          "hotpink 1px 1px .1em,cyan -1px -1px .1em";
        this.label.style.color = this.db.style.color = "black";
        break;
      }
    }
  } else if (type === 9) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = what.name;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML =
      typeof what.desc === "function" ? what.desc(what) : what.desc;
  } else if (type === 10) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = what.name;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = what.desc + dom.dseparator;
    const t = Object.keys(global.drdata);
    const ids = [];
    for (const a in t) ids[a] = Number(t[a].substring(1));
    this.o = addElement(this.text, "small");
    this.o.innerHTML = i18n.t(
      "runtime.ui.interface.interface.drop_table_8e203830",
    );
    this.o.style.color = "cyan";
    let thing = false;
    for (const a in ids) {
      if (ids[a] === what.id || what.un) {
        const dt = global.drdata[Object.keys(global.drdata)[a]];
        thing = true;
        for (const b in what.drop) {
          this.dbig = addElement(this.text, "div");
          this.dbig.style.display = "flex";
          this.dbig.style.border = "#1f72a2 1px solid";
          this.dbig.style.backgroundColor = "#202031";
          this.dcell1 = addElement(this.dbig, "div");
          this.dcell2 = addElement(this.dbig, "div");
          this.dbig.style.textAlign = "center";
          this.dcell1.style.width = "80%";
          this.dcell1.style.borderRight = "#1f72a2 1px solid";
          this.dcell2.style.width = "20%";
          if (b != what.drop.length - 1) this.dbig.style.borderBottom = "none";
          this.dcell2.innerHTML =
            ((what.drop[b].chance * 100000000) << 0) / 1000000 + "%";
          if (what.drop[b].chance >= 0.05) this.dcell2.style.color = "lime";
          else if (what.drop[b].chance < 0.05 && what.drop[b].chance > 0.01)
            this.dcell2.style.color = "yellow";
          else if (what.drop[b].chance <= 0.01 && what.drop[b].chance > 0.001)
            this.dcell2.style.color = "orange";
          else if (what.drop[b].chance <= 0.001)
            this.dcell2.style.color = "crimson";
          if (dt[b] || what.un) {
            this.dcell1.innerHTML += what.drop[b].item.name;
            if (what.drop[b].cond && !what.drop[b].cond()) {
              this.dcell1.style.textDecoration = "line-through";
              this.dcell1.style.color = "red";
            }
            switch (what.rar) {
              case 0: {
                this.dcell1.style.color = "grey";
                break;
              }
              case 2: {
                this.dcell1.style.textShadow = "0px 0px 1px blue";
                this.dcell1.style.color = "cyan";
                break;
              }
              case 3: {
                this.dcell1.style.textShadow = "0px 0px 2px lime";
                this.dcell1.style.color = "lime";
                break;
              }
              case 4: {
                this.dcell1.style.textShadow = "0px 0px 3px orange";
                this.dcell1.style.color = "yellow";
                break;
              }
              case 5: {
                this.dcell1.style.textShadow =
                  "0px 0px 2px crimson,0px 0px 5px red";
                this.dcell1.style.color = "orange";
                break;
              }
              case 6: {
                this.dcell1.style.textShadow =
                  "1px 1px 1px black,0px 0px 2px purple";
                this.dcell1.style.color = "purple";
                break;
              }
            }
            if (what.drop[b].max) {
              this.dcell1b = addElement(this.dcell1, "small");
              this.dcell1b.style.color = "inherit";
              this.dcell1b.style.position = "absolute";
              this.dcell1b.style.right = "70px";
              this.dcell1b.style.paddingTop = "2px";
              this.dcell1b.innerHTML = what.drop[b].max;
              if (what.drop[b].min && what.drop[b].min !== what.drop[b].max)
                this.dcell1b.innerHTML += "-" + what.drop[b].min;
            }
          } else {
            this.dcell1.innerHTML = "???????????";
            this.dcell1.style.color = "yellow";
          }
        }
        break;
      }
    }
    if (!thing) {
      for (const b in what.drop) {
        this.dbig = addElement(this.text, "div");
        this.dbig.style.display = "flex";
        this.dbig.style.border = "#1f72a2 1px solid";
        this.dbig.style.backgroundColor = "#202031";
        this.dcell1 = addElement(this.dbig, "div");
        this.dcell2 = addElement(this.dbig, "div");
        this.dbig.style.textAlign = "center";
        this.dcell1.style.width = "80%";
        this.dcell1.style.borderRight = "#1f72a2 1px solid";
        this.dcell2.style.width = "20%";
        if (b != what.drop.length - 1) this.dbig.style.borderBottom = "none";
        this.dcell1.innerHTML = "???????????";
        this.dcell1.style.color = "yellow";
        this.dcell2.innerHTML =
          ((what.drop[b].chance * 100000000) << 0) / 1000000 + "%";
        if (what.drop[b].chance >= 0.05) this.dcell2.style.color = "lime";
        else if (what.drop[b].chance < 0.05 && what.drop[b].chance > 0.01)
          this.dcell2.style.color = "yellow";
        else if (what.drop[b].chance <= 0.01 && what.drop[b].chance > 0.001)
          this.dcell2.style.color = "orange";
        else if (what.drop[b].chance <= 0.001)
          this.dcell2.style.color = "crimson";
      }
    }
  } else if (type === 12) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = ttl;
    this.text = addElement(global.dscr, "div", "d_t");
    this.text.innerHTML = typeof dsc === "function" ? dsc(what) : dsc;
  }
  positionDescription(c);
}

// The message log is rendered straight into the DOM, so its history is kept by
// serializing the rendered rows. It lives under its own storage key rather than
// inside the save, which is why it survives a reload without the player having
// saved. Restored rows are plain markup: hover descriptions attached to a live
// message are not part of its HTML and are not restored with it.
const messageLogStorageKey = "proto23.messagelog";
let messageLogWriteTimer;

function trimMessageLog() {
  const limit = Number(global.msgs_max) || 1;
  while (dom.mscont.children.length > limit)
    dom.mscont.removeChild(dom.mscont.children[0]);
}

function storeMessageLog() {
  // Messages can arrive several times per tick, so coalesce the writes.
  clearTimeout(messageLogWriteTimer);
  messageLogWriteTimer = setTimeout(() => {
    try {
      const rows = [];
      for (const row of dom.mscont.children) rows.push(row.innerHTML);
      window.localStorage.setItem(messageLogStorageKey, JSON.stringify(rows));
    } catch (err) {
      // Keeping the history is best effort; storage may be full.
    }
  }, 400);
}

function restoreMessageLog() {
  let rows = null;
  try {
    rows = JSON.parse(window.localStorage.getItem(messageLogStorageKey));
  } catch (err) {
    rows = null;
  }
  if (!Array.isArray(rows) || !rows.length) return;
  for (const html of rows.slice(-(Number(global.msgs_max) || 1))) {
    const row = addElement(dom.mscont, "div", null, "msg");
    row.innerHTML = html;
  }
  dom.mscont.scrollTop = dom.mscont.scrollHeight;
}

function clearMessageLog() {
  empty(dom.mscont);
  clearTimeout(messageLogWriteTimer);
  try {
    window.localStorage.removeItem(messageLogStorageKey);
  } catch (err) {
    // Nothing to clear if storage is unavailable.
  }
}

function msg(txt, c, dsc, type, bc, chck) {
  if (global.flags.m_freeze === false && global.flags.loadstate === false) {
    trimMessageLog();
    const msg = addElement(dom.mscont, "div", null, "msg");
    if (global.flags.msgtm) {
      const now = new Date();
      const g = addElement(msg, "small");
      g.innerHTML =
        "[" +
        (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) +
        ":" +
        (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
        ":" +
        (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()) +
        "]";
      g.style.backgroundColor = "#242848";
      g.style.display = "flex";
    }
    const mtxt = addElement(msg, "span");
    if (dsc) {
      if (type) addDesc(msg, dsc, type);
      else addDesc(msg, dsc);
    }
    //let nt = new String(); for(let a in txt){nt+=txt[a].charCodeAt()!==32?String.fromCharCode(41216-txt[a].charCodeAt()):' '}; txt=nt;
    if (c)
      mtxt.innerHTML =
        "<span style=color:" +
        c +
        (bc ? ";background-color:" + bc : "") +
        ">" +
        txt +
        "</span>";
    else mtxt.innerHTML = txt;
    dom.mscont.scrollTop = dom.mscont.scrollHeight;
    storeMessageLog();
    global.lastmsg = msg.innerHTML;
    //if(true) {if(msg.innerHTML==global.lstmsg) msg.innerHTML=global.lastmsg+'('+(++global.lastmsgc)+')';
    //  else {global.lastmsg=msg.innerHTML;global.lastmsgc=0;}} else global.lastmsg=msg.innerHTML;
  }
}

function _msg(txt, c, dsc, type, bc, chck) {
  trimMessageLog();
  const msg = addElement(dom.mscont, "div", null, "msg");
  if (dsc) {
    if (type) addDesc(msg, dsc, type);
    else addDesc(msg, dsc);
  }
  if (c)
    msg.innerHTML =
      "<span style=color:" +
      c +
      (bc ? ";background-color:" + bc : "") +
      ">" +
      txt +
      "</span>";
  else msg.innerHTML = txt;
  dom.mscont.scrollTop = dom.mscont.scrollHeight;
  storeMessageLog();
}

function msg_add(txt, c, bc, shd) {
  if (global.flags.m_freeze === false && global.flags.loadstate === false) {
    let bac = "";
    let b = "";
    if (bc) bac = "background-color:" + bc;
    if (shd) b = "text-shadow:" + shd.toString();
    else b = "";
    if (c)
      dom.gmsgs.children[1].children[
        dom.gmsgs.children[1].children.length - 1
      ].innerHTML +=
        '<span style=\"color:' +
        c +
        ";" +
        bac +
        ";" +
        b +
        '\">' +
        txt +
        "</span>";
    else
      dom.gmsgs.children[1].children[
        dom.gmsgs.children[1].children.length - 1
      ].innerHTML += txt;
    dom.mscont.scrollTop = dom.mscont.scrollHeight;
    storeMessageLog();
  }
}

function format(thing, what) {
  msg(i18n.t("runtime.ui.interface.dialogue.whw_06a9c666"));
}

function appear(dom) {
  if (!!dom) {
    let tmr = 0;
    dom.style.opacity = 0;
    dom.style.display = "";
    const a = setInterval(() => {
      tmr++;
      dom.style.opacity = tmr / 100;
      if (tmr === 100) clearInterval(a);
    }, 10);
  }
}

function fade(dom, timer, del) {
  let tmr = timer || 50;
  dom.style.opacity = 1;
  dom.style.display = "";
  const a = setInterval(() => {
    tmr--;
    dom.style.opacity = tmr / (timer || 50);
    if (tmr === 0) {
      clearInterval(a);
      if (del === true) {
        document.body.removeChild(dom);
      }
    }
  }, 10);
}

function addDesc(dm, what, type, ttl, dsc, f, id) {
  dm.addEventListener("mouseenter", (a) => {
    dscr(a, what, type, ttl, f === true ? dsc() : dsc, id);
    giveSkExp(skl.rdg, 0.002);
    global.stat.popt++;
    global.curwds = this;
    global.shiftid = id;
    if (global.kkey === 1) descsinfo(global.shiftid);
  });
  dm.addEventListener("mousemove", (a) => {
    positionDescription(a);
  });
  dm.addEventListener("mouseleave", () => {
    global.shiftid = 0;
    empty(global.dscr);
    global.dscr.style.display = "none";
    clearInterval(timers.inup);
    clearInterval(timers.dp_tmr);
    clearInterval(timers.wpnkilsch);
    if (dom.dscshe) dom.dscshe.innerHTML = "";
  });
}

global.t_n = 0;

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
          ((att.eqp[0].str + undc) * (att.eqp[0].dp / att.eqp[0].dpmax) * 0.9 +
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
  const pn = isyou === true ? 1 : 1 - skl.painr.use();
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

function dumb(x) {
  if (x) {
    const arr = [];
    for (let m = 0; m < 5; m++) {
      arr[m] = {};
      arr[m].obj = addElement(document.body, "span", null, "shn");
      arr[m].obj.style.pointerEvents = "none";
      arr[m].obj.innerHTML = select(["x", "X", "*", "#", "$"]);
      arr[m].obj.style.top = "-55px";
      arr[m].obj.style.left = "-55px";
      arr[m].posx = x.clientX;
      arr[m].posy = x.clientY;
      arr[m].accx = rand(-10, 10);
      arr[m].accy = rand(15, 25);
    }
    let t = 0;
    const g = setInterval(() => {
      t++;
      for (let m = 0; m < 5; m++) {
        arr[m].obj.style.top = arr[m].posy - (arr[m].accy - t) * t * 0.4 + "px";
        arr[m].obj.style.left = arr[m].posx + arr[m].accx * t * 0.5 + "px";
        arr[m].obj.style.opacity = (30 - t) / 30;
      }
      if (t === 30) {
        clearInterval(g);
        for (let m = 0; m < 5; m++) document.body.removeChild(arr[m].obj);
      }
    }, 20);
  }
}

function mf(num, index) {
  const d = addElement(document.body, "small");
  const c = ["rgb(255, 116, 63)", "rgb(192, 192, 192)", "rgb(255, 215, 0)"];
  d.style.position = "absolute";
  d.style.opacity = 1;
  d.style.width = "100px";
  d.style.top = "755px";
  d.style.left = 328 - 50 * index + "px";
  d.innerHTML =
    '<span style="color: ' +
    c[index - 1] +
    '">●</span><span style="color: rgb(255,70,70)">' +
    num +
    "</span>";
  let t = 0;
  const g = setInterval(() => {
    t++;
    d.style.top = parseInt(d.style.top) - 2 + "px";
    d.style.opacity = (30 - t) / 30;
    if (t === 30) {
      clearInterval(g);
      document.body.removeChild(d);
    }
  }, 30);
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

function renderRcp(rcp) {
  dom.ct_bt1_1_mc = addElement(dom.ct_bt1_1, "div", null, "crf_lg");
  dom.ct_bt1_1_mc.style.position = "relative";
  this.ct_bt1_1_m = addElement(dom.ct_bt1_1_mc, "span");
  rcp._t = this.ct_bt1_1_m;
  if (typeof InstallTrigger !== "undefined") {
    this.ct_bt1_1_m.style.paddingTop = 0;
    this.ct_bt1_1_m.style.paddingBottom = 0;
  }
  this.ct_bt1_1_m.innerHTML = rcp.name;
  let test = make(rcp, true);
  let safe = false;
  if (test.y.length != rcp.rec.length || test.o[0] === 2)
    this.ct_bt1_1_m.style.color = "grey";
  if (dom.spcldom && rcp.id === dom.spcldom.rcp.id) {
    dom.rcpcurar = addElement(dom.ct_bt1_1_mc, "span");
    dom.rcpcurar.innerHTML = "⋗⋗";
    dom.spcldom = dom.ct_bt1_1_mc;
    dom.spcldom.rcp = rcp;
    dom.rcpcurar.style.position = "absolute";
    dom.rcpcurar.style.right = "2px";
    dom.rcpcurar.style.color = "rgb(188,254,254)";
  }
  dom.ct_bt1_1_mc.addEventListener("mouseenter", function () {
    test = make(rcp, true);
    global.curr_r = rcp;
    empty(dom.ct_bt1_2);
    this.ct_bt1_2a = addElement(
      dom.ct_bt1_2,
      "div",
      null,
      "crafting-requirements-title",
    );
    this.ct_bt1_2a.innerHTML = i18n.t(
      "runtime.ui.interface.interface.reagents_required_345c3a08",
    );
    this.ct_bt1_2a.style.textAlign = "center";
    this.ct_bt1_2a.style.borderBottom = "1px solid #3e4092";
    if (skl.crft.lvl > 0) {
      this.ct_bt1_2at = addElement(dom.ct_bt1_2, "div", "rptbn");
      if (!global.flags.rptbncgt) {
        this.ct_bt1_2at.style.backgroundColor = "#a11";
        this.ct_bt1_2at.innerHTML = "";
      } else {
        this.ct_bt1_2at.style.backgroundColor = "green";
        this.ct_bt1_2at.innerHTML = "‣";
      }
      const tm =
        5000 - (skl.crft.lvl * 350 + skl.ptnc.lvl * 150) < 300
          ? 300
          : 5000 - (skl.crft.lvl * 350 + skl.ptnc.lvl * 150);
      addDesc(
        this.ct_bt1_2at,
        {
          name: i18n.t("ui.crafting.repeatable.name"),
          desc() {
            return i18n.t("ui.crafting.repeatable.currentSpeed", {
              seconds: (tm / 1000).toFixed(2),
            });
          },
        },
        9,
      );
      this.ct_bt1_2at.addEventListener("click", function () {
        if (global.flags.rptbncgt) {
          clearInterval(timers.rptbncgt);
          global.flags.rptbncgtf = false;
          this.style.backgroundColor = "#a11";
          this.innerHTML = "";
        } else {
          this.style.backgroundColor = "green";
          this.innerHTML = "‣";
        }
        global.flags.rptbncgt = !global.flags.rptbncgt;
      });
    }
    rcp._t2 = [];
    for (let g = 0; g < rcp.rec.length; g++) {
      this.ct_bt1_2bc = addElement(
        dom.ct_bt1_2,
        "small",
        null,
        "crafting-reagent-row",
      );
      this.ct_bt1_2bc1 = addElement(this.ct_bt1_2bc, "div", null, "rgt_ics");
      this.ct_bt1_2bc2 = addElement(this.ct_bt1_2bc, "div", null, "rgt_ics");
      rcp._t2[g] = this.ct_bt1_2bc2;
      if (rcp.rec[g].item.data.dscv === true) {
        this.ct_bt1_2bc1.innerHTML = rcp.rec[g].item.name;
        addDesc(this.ct_bt1_2bc, rcp.rec[g].item);
      } else this.ct_bt1_2bc1.innerHTML = "?????????";
      this.ct_bt1_2bc1.style.paddingLeft = "8px";
      let num = 0;
      if (test.z.length > 0) num = test.z[g];
      if (test.z[g] >= rcp.rec[g].amount || test.b[g] === true) {
        this.ct_bt1_2bc2.style.color = "lime";
        num = rcp.rec[g].item.slot ? test.z[g] : rcp.rec[g].item.amount;
      } else {
        this.ct_bt1_2bc2.style.color = "grey";
        num = rcp.rec[g].item.slot ? test.z[g] : rcp.rec[g].item.amount;
      }
      let n = "";
      if (test.z[g] > 0 && rcp.rec[g].item.slot) {
        for (const r in test.r)
          for (const b in you.eqp)
            if (
              you.eqp[b].data.uid === test.r[r].data.uid &&
              you.eqp[b].id !== 10000
            ) {
              n = '<small style="color:orange">[E]</small>';
              continue;
            }
      }
      if (test.z[g] >= rcp.rec[g].amount || test.b[g] === true)
        this.ct_bt1_2bc2.style.color = "lime";
      else this.ct_bt1_2bc2.style.color = "grey";
      if (rcp.rec[g].return === true) this.ct_bt1_2bc2.innerHTML = "∞";
      else
        this.ct_bt1_2bc2.innerHTML = rcp.rec[g].amount + " / " + num + " " + n;
      this.ct_bt1_2bc2.style.borderRight = "none";
      this.ct_bt1_2bc2.style.textAlign = "center";
    }
    this.ct_bt1_2c = addElement(
      dom.ct_bt1_2,
      "div",
      null,
      "crafting-section-title",
    );
    this.ct_bt1_2c.innerHTML = i18n.t(
      "runtime.ui.interface.interface.output_1029d676",
    );
    for (const g in rcp.res) {
      this.ct_bt1_2cc = addElement(
        dom.ct_bt1_2,
        "small",
        null,
        "crafting-output-row",
      );
      this.ct_bt1_2cc1 = addElement(this.ct_bt1_2cc, "div", "toh", "rgt_ics");
      this.ct_bt1_2cc2 = addElement(this.ct_bt1_2cc, "div", null, "rgt_ics");
      if (rcp.allow === true) {
        this.ct_bt1_2cc1.innerHTML = rcp.res[g].item.name;
        if (!!rcp.res[g].amount_max) {
          this.ct_bt1_2cc2.innerHTML =
            rcp.res[g].amount + "~" + rcp.res[g].amount_max;
        } else this.ct_bt1_2cc2.innerHTML = rcp.res[g].amount;
        addDesc(this.ct_bt1_2cc1, rcp.res[g].item);
        this.ct_bt1_2cc2.style.color = "lime";
      } else {
        this.ct_bt1_2cc1.innerHTML = "?????????";
        this.ct_bt1_2cc2.innerHTML = "???";
        this.ct_bt1_2cc2.style.color = "grey";
      }
      this.ct_bt1_2cc2.style.textAlign = "center";
      this.ct_bt1_2cc2.style.borderRight = "none";
      this.ct_bt1_2cc1.style.paddingLeft = "8px";
    }
    if (rcp.srect != null) {
      const l = test.o.length;
      this.ct_bt1_3c = addElement(
        dom.ct_bt1_2,
        "div",
        null,
        "crafting-section-title",
      );
      this.ct_bt1_3c.innerHTML = i18n.t(
        "runtime.ui.interface.interface.tools_needed_9b4a1645",
      );
      this.ct_bt1_3cc = addElement(
        dom.ct_bt1_2,
        "small",
        null,
        "crafting-tools-list",
      );
      if (l > 1) {
        for (const nu in test.o) {
          if (test.o[nu] === 1)
            this.ct_bt1_3cc.innerHTML +=
              '<span style="color:lime">' +
              rcp.srect[nu] +
              "</span>" +
              (l - 1 == nu ? "" : ", ");
          else if (test.o[nu] === 2)
            this.ct_bt1_3cc.innerHTML +=
              '<span style="color:red">' +
              rcp.srect[nu] +
              "</span>" +
              (l - 1 == nu ? "" : ", ");
        }
      } else {
        if (test.o[0] === 1) this.ct_bt1_3cc.style.color = "lime";
        else if (test.o[0] === 2) this.ct_bt1_3cc.style.color = "red";
        this.ct_bt1_3cc.innerHTML += rcp.srect[0];
      }
    }
  });
  dom.ct_bt1_1_mc.addEventListener("mouseenter", function () {
    if (dom.rcpcurar) dom.spcldom.removeChild(dom.rcpcurar);
    dom.rcpcurar = addElement(this, "span");
    dom.rcpcurar.innerHTML = "⋗⋗";
    dom.spcldom = this;
    dom.spcldom.rcp = rcp;
    dom.rcpcurar.style.position = "absolute";
    dom.rcpcurar.style.right = "2px";
    dom.rcpcurar.style.color = "rgb(188,254,254)";
  });
  dom.ct_bt1_1_mc.addEventListener("click", function () {
    test = make(rcp, true);
    if (rcp.rec.length === test.y.length && test.o[0] !== 2) safe = true;
    if (global.flags.rptbncgt) {
      _fcraft(rcp, safe);
      global.crrpsat = rcp;
      clearInterval(timers.rptbncgt);
      global.flags.rptbncgtf = true;
      if (safe)
        timers.rptbncgt = setInterval(
          () => {
            _fcraft(global.crrpsat, safe);
            giveSkExp(skl.ptnc, 0.05);
            refreshRcp(global.curr_r);
          },
          5000 - (skl.crft.lvl * 350 + skl.ptnc.lvl * 150) < 300
            ? 300
            : 5000 - (skl.crft.lvl * 350 + skl.ptnc.lvl * 150),
        );
    } else _fcraft(rcp, safe);
    refreshRcp(rcp);
  });
}

function refreshRcp(fl) {
  if (global.rm === 0 || !global.rm) {
    for (const a in global.rec_d)
      _refreshRcpCnt(global.rec_d[a], global.rec_d[a]._t);
  } else {
    for (const a in global.srcp)
      _refreshRcpCnt(global.srcp[a], global.srcp[a]._t);
  }
  const t2 = fl._t2;
  const test = make(fl, true);
  for (const g in fl.rec) {
    if (!t2) break;
    let n = "";
    if (test.z[g] > 0 && fl.rec[g].item.slot) {
      for (const r in test.r)
        for (const b in you.eqp)
          if (
            you.eqp[b].data.uid === test.r[r].data.uid &&
            you.eqp[b].id !== 10000
          ) {
            n = '<small style="color:orange">[E]</small>';
            continue;
          }
    }
    let num = 0;
    if (test.z.length > 0) num = test.z[g];
    if (test.z[g] >= fl.rec[g].amount || test.b[g] === true) {
      t2[g].style.color = "lime";
      num = fl.rec[g].item.slot ? test.z[g] : fl.rec[g].item.amount;
    } else {
      t2[g].style.color = "grey";
      num = fl.rec[g].item.slot ? test.z[g] : fl.rec[g].item.amount;
    }
    t2[g].innerHTML = fl.rec[g].amount + " / " + num + " " + n;
  }
}

function _refreshRcpCnt(r, t, t2) {
  const test = make(r, true);
  if (test.y.length != r.rec.length || test.o[0] === 2) t.style.color = "grey";
  else t.style.color = "rgb(188,254,254)";
}

function _fcraft(what, safe) {
  if (safe) {
    safe = false;
    if (global.flags.sleepmode === true) {
      msg(
        i18n.t(
          "runtime.ui.interface.dialogue.you_may_want_to_wake_up_first_014dee64",
        ),
        "red",
      );
      return;
    }
    if (global.flags.btl === true) {
      msg(
        i18n.t(
          "runtime.ui.interface.dialogue.you_re_too_busy_fighting_711d00d5",
        ),
        "red",
      );
      return;
    }
    if (global.flags.rdng === true) {
      msg(
        i18n.t(
          "runtime.ui.interface.dialogue.you_re_too_occupied_with_reading_4af580dc",
        ),
        "red",
      );
      return;
    }
    if (global.flags.busy === true) {
      msg(
        i18n.t(
          "runtime.ui.interface.dialogue.you_re_too_busy_with_something_else_643f3a8b",
        ),
        "red",
      );
      return;
    }
    const ntest = make(what, true);
    for (let g = 0; g < what.rec.length; g++) {
      if (what.rec.length === ntest.y.length && ntest.o[0] !== 2) safe = true;
    }
    if (safe) {
      make(what);
      global.stat.crftt++;
      iftrunkopen(1);
    } else {
      if (global.flags.rptbncgtf) {
        clearInterval(timers.rptbncgt);
        global.flags.rptbncgtf = false;
      }
    }
  }
}

function renderSkl(skl) {
  this.skwmmc = addElement(dom.skcon, "div", null, "skwmmc");
  addDesc(this.skwmmc, skl, 6);
  this.skwmm1 = addElement(this.skwmmc, "small");
  if (skl.sp) this.skwmm1.style.fontSize = skl.sp;
  this.skwmm1.style.width = "32%";
  this.skwmm1.innerHTML = i18n.t("ui.hud.skillLevel", {
    skill: skl.name,
    level: skl.lvl,
  });
  this.skwmm1.style.borderRight = "1px solid #46a";
  this.skwmm2 = addElement(this.skwmmc, "small");
  this.skwmm2.innerHTML = i18n.t("ui.hud.skillExperiencePadded", {
    current: formatw(Math.round(skl.exp)),
    max: formatw(skl.expnext_t),
  });
  this.skwmm2.style.borderRight = "1px solid #46a";
  this.skwmm2.style.fontSize = ".8em";
  this.skwmm2.style.width = "170px";
  this.skwmm3c = addElement(this.skwmmc, "div");
  this.skwmm3 = addElement(this.skwmm3c, "div");
  this.skwmm3c.style.width = "197px";
  this.skwmm3.innerHTML = "　";
  this.skwmm3.style.marginLeft = "2px";
  this.skwmm3.style.width = (skl.exp / skl.expnext_t) * 100 + "%";
  //if(skl.lastupd&&skl.lastupd-time.minute>=1) this.skwmm3.style.backgroundColor='limegreen'; else this.skwmm3.style.backgroundColor='yellow';
  this.skwmm3.style.backgroundColor = "yellow";
}

function area_init(area) {
  if (area.size !== 0) {
    callback.onEnterArea.fire(area);
    if (area.id !== 101) {
      const rnd = random();
      for (const obj in area.pop)
        if (rnd >= area.popc[obj][0] && rnd <= area.popc[obj][1])
          if (!area.pop[obj].cond || area.pop[obj].cond() === true) {
            global.flags.civil = false;
            global.flags.btl = true;
            global.current_z = area;
            const temp = area.pop[obj];
            const newobj =
              temp.crt.id === creature.default.id
                ? creature.default
                : mon_gen(temp.crt);
            lvlup(newobj, rand(temp.lvlmin - 1, temp.lvlmax - 1));
            //newobj.data.lasthp=newobj.hp;
            global.current_m = newobj;
            update_m();
            dom.d5_1_1m.update();
            if (!!dom.d7m) dom.d7m.update(); //dom.d5m.update();
            return newobj;
          } else area_init(area);
    }
  } else msg(i18n.t("runtime.ui.interface.dialogue.nobody_s_here_52a3d2f7"));
  if (!!dom.d7m) dom.d7m.update();
  update_m();
  dom.d5_1_1m.update();
}

function mon_gen(crt) {
  crt.eff = [];
  global.e_em = [];
  empty(dom.d101m);
  const newobj = copy(crt);
  newobj.drop = crt.drop;
  if (!global.flags.inside) {
    if (global.flags.israin) giveEff(newobj, effect.wet, 5);
    if (global.flags.iscold) giveEff(newobj, effect.cold, 25);
  }
  newobj.sex = random() < 0.5;
  return newobj;
}

function giveEff(target, e, d, y, z) {
  if (target.id !== 0) {
    let ef = e;
    if (target.id !== you.id) {
      ef = {};
      for (const g in e) ef[g] = e[g];
    }
    if (target.id === you.id || global.flags.btl) {
      const p = findbyid(target.eff, e.id);
      if (!p || !p.active) {
        if (d) ef.duration = d;
        ef.y = y;
        ef.z = z;
        if (ef.x) eff_d(ef, ef.x, ef.c, ef.b, target);
        ef.target = target;
        target.eff.push(ef);
      }
      ef.onGive(d, y, z);
      ef.active = true;
    }
    effdfix();
    target.stat_r();
    return e;
  }
}

function removeEff(e, t) {
  if (e.active === true) {
    if (e.x) {
      if (e.target.id === you.id) {
        node = global.e_e.indexOf(e);
        dom.d101.removeChild(dom.d101.children[node]);
        global.e_e.splice(node, 1);
        if (dom.d101.children.length > you.eff.length) empty(dom.d101);
      } else {
        node = global.e_em.indexOf(e);
        dom.d101m.removeChild(dom.d101m.children[node]);
        global.e_em.splice(node, 1);
        if (dom.d101m.children.length > e.target.eff.length) empty(dom.d101m);
      }
      e.onRemove();
      global.dscr.style.display = "none";
    }
    e.target.eff.splice(e.target.eff.indexOf(e), 1);
    e.active = false;
    clearInterval(timers.inup);
    effdfix();
  }
  e.target.stat_r();
}

function effdfix() {
  if (you.eff.length >= 21) {
    dom.d7.style.height = "104px";
    for (let i = 0; i < document.getElementsByClassName("se_ia").length; i++)
      document.getElementsByClassName("se_ia")[i].style.display =
        "inline-block";
    document.getElementById("se_i").style.display = "block";
  } else {
    dom.d7.style.height = "125px";
    for (let i = 0; i < document.getElementsByClassName("se_ia").length; i++)
      document.getElementsByClassName("se_ia")[i].style.display = "";
    document.getElementById("se_i").style.display = "flex";
  }
}

function eff_d(e, s, c, b, tgt) {
  if (tgt.id === you.id) {
    const ic = addElement(dom.d101, "div", null, "se_ia");
    ic.innerHTML = s;
    ic.style.color = c;
    ic.style.backgroundColor = b;
    ic.addEventListener("click", () => {
      e.onClick();
    });
    addDesc(ic, e, 4, e.name, e.desc);
    if (e.duration !== 0) global.e_e.push(e);
  } else {
    const ic = addElement(dom.d101m, "div", null, "se_ia");
    ic.innerHTML = s;
    ic.style.color = c;
    ic.style.backgroundColor = b;
    addDesc(ic, e, 4, e.name, e.desc);
    if (e.duration !== 0) global.e_em.push(e);
  }
}

function equip(w, flags) {
  if (!w.data || !w.data.uid) return;
  if (w.data.uid === you.eqp[w.slot - 1].data.uid) {
    unequip(w, { save: true });
    if (w.twoh === true) {
      dom.d7_slot_2.innerHTML = i18n.t(
        "runtime.ui.interface.interface.shield_08271419",
      );
      dom.d7_slot_2.style.color = "grey";
    }
    isort(global.sm);
  } else {
    if (w.req && !w.req() && !global.flags.loadstate) {
      msg(
        i18n.t("runtime.ui.interface.dialogue.requirenments_not_met_6225b526"),
        "red",
      );
      return;
    }
    /*switch(w.slot){
      case 5 :{
        if(you.eqp[4].id===10000) you.eqp[4]=w; else if(you.eqp[5].id===10000) {you.eqp[5]=w;w.slot=6} else {unequip(you.eqp[4]);you.eqp[4]=w}
      } break;
      case 6 :{
        if(you.eqp[5].id===10000) you.eqp[5]=w; else if(you.eqp[4].id===10000) {you.eqp[4]=w;w.slot=5} else {unequip(you.eqp[5]);you.eqp[5]=w}
      } break;
    default: {unequip(you.eqp[w.slot-1]); you.eqp[w.slot-1] = w;}; break
    }*/ unequip(you.eqp[w.slot - 1]);
    you.eqp[w.slot - 1] = w;
    if (w.twoh === true) {
      if (you.eqp[1].id !== 10000) unequip(you.eqp[1]);
    } else if (you.eqp[1].id !== 10000 && you.eqp[0].twoh === true)
      unequip(you.eqp[0]);
    if (w.eff.length > 0)
      for (let k = 0; k < w.eff.length; k++) {
        w.eff[k].use(w.eff[k].y, w.eff[k].z);
        giveEff(you, w.eff[k]);
      }
    w.oneq();
    if (w.degrade) planner.itmwear.data.items.push(w);
    if (w.slot === 1) you.atkmode = w.atkmode;
    w.wc = global.text.wecs[w.rar][0]; //w.wbc=global.text.wecs[w.rar][1];
    let spst;
    switch (w.rar) {
      case 2:
        spst = "0px 0px 2px blue";
        break;
      case 3:
        spst = "0px 0px 2px lime";
        break;
      case 4:
        spst = "0px 0px 3px orange";
        break;
      case 5:
        spst = "0px 0px 2px crimson,0px 0px 5px red";
        break;
      case 6:
        spst = "1px 1px 1px black,0px 0px 2px purple";
        break;
    }
    switch (w.slot - 1) {
      case 0:
        {
          dom.d7_slot_1.removeAttribute("style");
          dom.d7_slot_1.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_1.style.color = w.wc;
            dom.d7_slot_1.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_1.style.backgroundColor = w.wbc;
        }
        break;
      case 1:
        {
          dom.d7_slot_2.removeAttribute("style");
          dom.d7_slot_2.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_2.style.color = w.wc;
            dom.d7_slot_2.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_2.style.backgroundColor = w.wbc;
        }
        break;
      case 2:
        {
          dom.d7_slot_3.removeAttribute("style");
          dom.d7_slot_3.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_3.style.color = w.wc;
            dom.d7_slot_3.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_3.style.backgroundColor = w.wbc;
        }
        break;
      case 3:
        {
          dom.d7_slot_4.removeAttribute("style");
          dom.d7_slot_4.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_4.style.color = w.wc;
            dom.d7_slot_4.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_4.style.backgroundColor = w.wbc;
        }
        break;
      case 4:
        {
          dom.d7_slot_5.removeAttribute("style");
          dom.d7_slot_5.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_5.style.color = w.wc;
            dom.d7_slot_5.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_5.style.backgroundColor = w.wbc;
        }
        break;
      case 5:
        {
          dom.d7_slot_6.removeAttribute("style");
          dom.d7_slot_6.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_6.style.color = w.wc;
            dom.d7_slot_6.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_6.style.backgroundColor = w.wbc;
        }
        break;
      case 6:
        {
          dom.d7_slot_7.removeAttribute("style");
          dom.d7_slot_7.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_7.style.color = w.wc;
            dom.d7_slot_7.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_7.style.backgroundColor = w.wbc;
        }
        break;
      case 7:
        {
          dom.d7_slot_8.removeAttribute("style");
          dom.d7_slot_8.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_8.style.color = w.wc;
            dom.d7_slot_8.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_8.style.backgroundColor = w.wbc;
        }
        break;
      case 8:
        {
          dom.d7_slot_9.removeAttribute("style");
          dom.d7_slot_9.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_9.style.color = w.wc;
            dom.d7_slot_9.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_9.style.backgroundColor = w.wbc;
        }
        break;
      case 9:
        {
          dom.d7_slot_10.removeAttribute("style");
          dom.d7_slot_10.innerHTML = you.eqp[w.slot - 1].name;
          if (!!w.wc) {
            dom.d7_slot_10.style.color = w.wc;
            dom.d7_slot_10.style.textShadow = spst;
          }
          if (!!w.wbc) dom.d7_slot_10.style.backgroundColor = w.wbc;
        }
        break;
    }
    if (w.twoh === true) {
      dom.d7_slot_2.innerHTML = you.eqp[0].name;
      dom.d7_slot_2.removeAttribute("style");
      dom.d7_slot_2.style.color = "lightgrey";
    } else {
      if (you.eqp[1].id === 10000) {
        dom.d7_slot_2.innerHTML = i18n.t(
          "runtime.ui.interface.interface.shield_08271419",
        );
        dom.d7_slot_2.removeAttribute("style");
        dom.d7_slot_2.style.color = "grey";
      }
    }
    if (!flags || !flags.save) {
      you.stat_r();
      update_d();
      isort(global.sm);
    }
  }
}

function unequip(w, flags) {
  if (!w.data || !w.data.uid) return;
  if (w.eff.length > 0)
    for (let k = 0; k < w.eff.length; k++) {
      w.eff[k].un();
      removeEff(w.eff[k]);
    }
  w.onuneq();
  you.eqp[w.slot - 1] = eqp.dummy;
  if (w.degrade)
    planner.itmwear.data.items.splice(planner.itmwear.data.items.indexOf(w), 1);
  switch (w.slot - 1) {
    case 0:
      {
        dom.d7_slot_1.innerHTML = i18n.t(
          "runtime.ui.interface.interface.weapon_ead53368",
        );
        dom.d7_slot_1.removeAttribute("style");
        dom.d7_slot_1.style.color = "grey";
        you.eqp[0].cls[2] = (you.lvl / 5) << 0;
        you.eqp[0].aff[0] = (you.lvl / 8) << 0;
        you.eqp[0].ctype = 2;
      }
      break;
    case 1:
      {
        dom.d7_slot_2.innerHTML = i18n.t(
          "runtime.ui.interface.interface.shield_08271419",
        );
        dom.d7_slot_2.removeAttribute("style");
        dom.d7_slot_2.style.color = "grey";
      }
      break;
    case 2:
      {
        dom.d7_slot_3.innerHTML = i18n.t(
          "runtime.ui.interface.interface.head_e5ffd15b",
        );
        dom.d7_slot_3.removeAttribute("style");
        dom.d7_slot_3.style.color = "grey";
      }
      break;
    case 3:
      {
        dom.d7_slot_4.innerHTML = i18n.t(
          "runtime.ui.interface.interface.body_718a7e8a",
        );
        dom.d7_slot_4.removeAttribute("style");
        dom.d7_slot_4.style.color = "grey";
      }
      break;
    case 4:
      {
        dom.d7_slot_5.innerHTML = i18n.t(
          "runtime.ui.interface.interface.l_arm_e461bf1f",
        );
        dom.d7_slot_5.removeAttribute("style");
        dom.d7_slot_5.style.color = "grey";
      }
      break;
    case 5:
      {
        dom.d7_slot_6.innerHTML = i18n.t(
          "runtime.ui.interface.interface.r_arm_e703a4ec",
        );
        dom.d7_slot_6.removeAttribute("style");
        dom.d7_slot_6.style.color = "grey";
      }
      break;
    case 6:
      {
        dom.d7_slot_7.innerHTML = i18n.t(
          "runtime.ui.interface.interface.legs_29518d04",
        );
        dom.d7_slot_7.removeAttribute("style");
        dom.d7_slot_7.style.color = "grey";
      }
      break;
    case 7:
      {
        dom.d7_slot_8.innerHTML = i18n.t(
          "runtime.ui.interface.interface.accessory_962403f6",
        );
        dom.d7_slot_8.removeAttribute("style");
        dom.d7_slot_8.style.color = "grey";
      }
      break;
    case 8:
      {
        dom.d7_slot_9.innerHTML = i18n.t(
          "runtime.ui.interface.interface.accessory_962403f6",
        );
        dom.d7_slot_9.removeAttribute("style");
        dom.d7_slot_9.style.color = "grey";
      }
      break;
    case 9:
      {
        dom.d7_slot_10.innerHTML = i18n.t(
          "runtime.ui.interface.interface.accessory_962403f6",
        );
        dom.d7_slot_10.removeAttribute("style");
        dom.d7_slot_10.style.color = "grey";
      }
      break;
  }
  if (!flags || !flags.save) {
    you.stat_r();
    update_d();
  }
}

function eqpres() {
  dom.d7_slot_1.innerHTML = i18n.t(
    "runtime.ui.interface.interface.weapon_ead53368",
  );
  dom.d7_slot_1.removeAttribute("style");
  dom.d7_slot_1.style.color = "grey";
  dom.d7_slot_2.innerHTML = i18n.t(
    "runtime.ui.interface.interface.shield_08271419",
  );
  dom.d7_slot_2.removeAttribute("style");
  dom.d7_slot_2.style.color = "grey";
  dom.d7_slot_3.innerHTML = i18n.t(
    "runtime.ui.interface.interface.head_e5ffd15b",
  );
  dom.d7_slot_3.removeAttribute("style");
  dom.d7_slot_3.style.color = "grey";
  dom.d7_slot_4.innerHTML = i18n.t(
    "runtime.ui.interface.interface.body_718a7e8a",
  );
  dom.d7_slot_4.removeAttribute("style");
  dom.d7_slot_4.style.color = "grey";
  dom.d7_slot_5.innerHTML = i18n.t(
    "runtime.ui.interface.interface.l_arm_e461bf1f",
  );
  dom.d7_slot_5.removeAttribute("style");
  dom.d7_slot_5.style.color = "grey";
  dom.d7_slot_6.innerHTML = i18n.t(
    "runtime.ui.interface.interface.r_arm_e703a4ec",
  );
  dom.d7_slot_6.removeAttribute("style");
  dom.d7_slot_6.style.color = "grey";
  dom.d7_slot_7.innerHTML = i18n.t(
    "runtime.ui.interface.interface.legs_29518d04",
  );
  dom.d7_slot_7.removeAttribute("style");
  dom.d7_slot_7.style.color = "grey";
  dom.d7_slot_8.innerHTML = i18n.t(
    "runtime.ui.interface.interface.accessory_962403f6",
  );
  dom.d7_slot_8.removeAttribute("style");
  dom.d7_slot_8.style.color = "grey";
  //    dom.d7_slot_9.innerHTML = 'Accessory';dom.d7_slot_9.removeAttribute('style');dom.d7_slot_9.style.color='grey'
  //    dom.d7_slot_10.innerHTML = 'Accessory';dom.d7_slot_10.removeAttribute('style');dom.d7_slot_10.style.color='grey'
}

function giveRcp(rcp) {
  if (!global.flags.asbu) {
    global.flags.asbu = true;
    dom.ct_bt1.innerHTML = i18n.t("ui.navigation.assemble");
  }
  if (rcp.have === false) {
    global.rec_d.push(rcp);
    rcp.have = true;
    if (global.lw_op === 1) rsort(global.rm);
    msg(
      i18n.t("runtime.ui.interface.dialogue.new_blueprint_unlocked_8d90820c"),
      "cyan",
    );
    msg_add('"' + rcp.name + '"', "orange");
    return 1;
  } else return 0;
}

function giveWealth(val, mes, f) {
  if (you.mods.wthexrt !== 0 && f) val += 1;
  you.wealth += val;
  global.stat.moneyg += val;
  for (const x in global.monchk) global.monchk[x]();
  if (!global.stat.mndrgnu && you.wealth >= 100000000) {
    global.stat.mndrgnu = true;
    appear(dom.mn_1);
  }
  m_update();
  giveSkExp(skl.gred, val * 0.01);
  if (mes !== false) {
    msg(i18n.t("runtime.ui.interface.dialogue.text_a979ef10"), "gold");
    if (val >= GOLD) msg_add(" ●" + ((val / GOLD) << 0), "rgb(255, 215, 0)");
    if (val >= SILVER && val % GOLD >= SILVER)
      msg_add(" ●" + (((val / SILVER) % SILVER) << 0), "rgb(192, 192, 192)");
    if (val < SILVER || (val > SILVER && val % SILVER > 0))
      msg_add(" ●" + ((val % SILVER) << 0), "rgb(255, 116, 63)");
  }
  recshop();
}

function spend(m) {
  if (you.wealth < m) return;
  you.wealth -= m;
  global.stat.moneysp += m;
  m_update();
}

function giveItem(obj, am, ignore, flag) {
  am = am || 1;
  if (!!obj.slot) {
    let nitm;
    for (let p = 0; p < am; p++) {
      obj.new = true;
      obj.data.uid = ++global.uid;
      const tmp = obj;
      obj.data.dscv = true;
      obj.have = true;
      nitm = copy(obj);
      nitm.data = deepCopy(obj.data);
      nitm.eff = tmp.eff;
      if (tmp.dss) nitm.dss = tmp.dss;
      inv.push(nitm);
      msg(
        i18n.t("runtime.ui.interface.dialogue.new_item_obtained_single", {
          item: nitm.name,
        }),
        "cyan",
        obj,
      );
      obj.onGet();
      if (global.sm === nitm.stype) global.sinv.push(nitm);
      if (nitm.stype === global.sm || global.sm === 1) renderItem(nitm);
      const g = (obj.id / 10000) << 0;
      if (!scan(dar[g], obj.id)) dar[g].push(obj.id);
      if (flag && flag.fl) iftrunkopen(1);
      else iftrunkopenc(1);
      if (!global.flags.loadstate && !ignore) global.stat.igtttl += am;
    }
    return nitm;
  }
  if (!obj.have) {
    obj.new = true;
    if (global.flags.blken === true) {
      global.spnew++;
      clearInterval(timers.nsblk);
      timers.nsblk = setInterval(function () {
        const a = document.querySelectorAll(".blinks");
        const g = a.length;
        for (let i = 0; i < g; i++) a[i].style.opacity = global.vsnew / 10;
        if (--global.vsnew < 0) global.vsnew = 10;
      }, 100);
    }
    obj.have = true;
    obj.data.dscv = true;
    inv.push(obj);
    obj.amount += am;
    msg(
      i18n.t("runtime.ui.interface.dialogue.new_item_obtained", {
        item: obj.name,
        amount: am,
      }),
      "cyan",
      obj,
    );
    obj.onGet();
    if (global.sm === obj.stype) global.sinv.push(obj);
    if (obj.stype === global.sm || global.sm === 1) renderItem(obj);
  } else {
    obj.amount += am;
    msg(
      i18n.t("runtime.ui.interface.dialogue.item_acquired", {
        item: obj.name,
        amount: am,
      }),
      "cyan",
      obj,
    );
    if (global.sm === 1) updateInv(inv.indexOf(obj));
    else if (global.sm === obj.stype) updateInv(global.sinv.indexOf(obj));
    obj.onGet();
  }
  const g = (obj.id / 10000) << 0;
  if (!scan(dar[g], obj.id)) dar[g].push(obj.id);
  if (obj.multif) for (let a = 0; a < am; a++) obj.multif();
  if (obj.rot) {
    let thave = false;
    for (const a in planner.imorph.data.items)
      if (planner.imorph.data.items[a].id === obj.id) {
        thave = true;
        break;
      }
    if (!thave) {
      planner.imorph.data.items.push(obj);
      obj.data.rottil = 0;
    }
  }
  if (flag && !flag.fi && flag.fl) iftrunkopen(1);
  else iftrunkopenc(1);
  if (!global.flags.loadstate && !ignore) global.stat.igtttl += am;
  return obj;
}

function listen_k(e) {
  global.keytarget = e.target;
  if (e.which === 46) {
    for (const obj in global.shortcuts)
      if (global.shortcuts[obj][0] === global.keyobj.data.skey)
        global.shortcuts.splice(
          global.shortcuts.indexOf(global.shortcuts[obj]),
          1,
        );
    global.keytarget.children[0].innerHTML = global.keyobj.name;
    global.keyobj.data.skey = null;
  } else if (
    (e.which >= 47 && e.which <= 90) ||
    (e.which >= 96 && e.which <= 105)
  ) {
    global.keytarget.children[0].innerHTML =
      global.keyobj.name +
      "<small> {" +
      String.fromCharCode(global.keyobj.data.skey) +
      "}</small>";
    if (global.keyobj.data.skey > 0 && e.which !== global.keyobj.data.skey) {
      for (const obje in global.shortcuts) {
        if (global.shortcuts[obje][2].data.skey === global.keyobj.data.skey) {
          global.shortcuts[obje][2].data.skey = null;
          global.shortcuts.splice(
            global.shortcuts.indexOf(global.shortcuts[obje]),
            1,
          );
        }
      }
    }
    let tg;
    for (const obj in global.shortcuts) {
      if (e.which === global.shortcuts[obj][0]) {
        global.shortcuts[obj][2].data.skey = null;
        global.shortcuts.splice(
          global.shortcuts.indexOf(global.shortcuts[obj]),
          1,
        );
      }
    }
    global.keyobj.data.skey = e.which;
    global.shortcuts.push([e.which, global.keyobj.id, global.keyobj]);
    global.shortcuts[global.shortcuts.length - 1][2].data.skey = e.which;
    isort(global.sm);
  }
}

document.body.addEventListener("keydown", function (e) {
  if (global.flags.kfocus !== true) {
    for (const obj in global.shortcuts)
      if (e.which === global.shortcuts[obj][0]) {
        g = global.shortcuts[obj][2];
        if (g.amount > 0 || !!g.slot) {
          g.use();
          reduce(g);
          iftrunkopenc(1);
          if (g.id < 3000 && !g.data.tried) {
            g.data.tried = true;
            global.stat.ftried += 1;
          }
          break;
        }
      }
  }
  if (!global.flags.shifton && (e.which === 69 || e.which === 16)) {
    global.flags.shifton = true;
    global.kkey = 1;
    descsinfo(global.shiftid);
  }
});

document.body.addEventListener("keyup", function (e) {
  if (e.which === 69 || e.which === 16) {
    global.flags.shifton = false;
    if (dom.dscshe) dom.dscshe.innerHTML = "";
    global.kkey = -1;
  }
});

function descsinfo(id) {
  if (id === 100)
    if (global.shiftitem.item.rot && you.mods.survinf > 0) {
      const itm = global.shiftitem.item;
      let ds, rs, dt, rt, c;
      switch (you.mods.survinf) {
        case 1:
          ds = Math.ceil(itm.amount * ((itm.rot[2] + itm.rot[3]) / 2));
          rs = itm.data.rottil;
          dt = "";
          rt = "";
          c = "";
          if (ds < 5) dt = i18n.t("ui.inventory.freshness.quantity.couple");
          else if (ds < 10) dt = i18n.t("ui.inventory.freshness.quantity.few");
          else if (ds < 30) dt = i18n.t("ui.inventory.freshness.quantity.some");
          else if (ds < 50)
            dt = i18n.t("ui.inventory.freshness.quantity.multiple");
          else if (ds < 100)
            dt = i18n.t("ui.inventory.freshness.quantity.dozens");
          else dt = i18n.t("ui.inventory.freshness.quantity.many");
          if (rs < 0.1) {
            rt = i18n.t("ui.inventory.freshness.state.veryFresh");
            c = "lime";
          } else if (rs < 0.2) {
            rt = i18n.t("ui.inventory.freshness.state.fresh");
            c = "limegreen";
          } else if (rs < 0.5) {
            rt = i18n.t("ui.inventory.freshness.state.aging");
            c = "yellow";
          } else if (rs < 0.75) {
            rt = i18n.t("ui.inventory.freshness.state.goingBadSoon");
            c = "grey";
          } else if (rs < 1) {
            rt = i18n.t("ui.inventory.freshness.state.almostDecayed");
            c = "red";
          }
          if (rs < 0.5)
            dom.dscshe.innerHTML =
              dom.dseparator +
              i18n.t("ui.inventory.freshness.foodLooks", {
                color: c,
                state: rt,
              });
          else
            dom.dscshe.innerHTML =
              dom.dseparator +
              i18n.t("ui.inventory.freshness.unitsLook", {
                quantity: dt,
                color: c,
                state: rt,
              });
          break;
        case 2:
          ds = Math.ceil(itm.amount * ((itm.rot[2] + itm.rot[3]) / 2));
          rs = Math.ceil(
            (1 - itm.data.rottil) / ((itm.rot[0] + itm.rot[1]) / 2),
          );
          dom.dscshe.innerHTML =
            dom.dseparator +
            i18n.t("ui.inventory.freshness.decayEstimate", {
              amount: ds,
              days: rs,
            });
          break;
      }
      dom.dscshe.style.paddingTop = "20px";
    }
}

function renderItem(obj) {
  const inv_slot_c = addElement(dom.inv_con, "div", null, "noout");
  const inv_slot = addElement(inv_slot_c, "div", null, "inv_slot noout");
  /*switch(obj.wtype){
    case 1:var z= icon(inv_slot,2,1,18,18);z.style.paddingRight="2px";break;
    case 2:var z= icon(inv_slot,4,1,18,18);z.style.paddingRight="2px";break;
    case 3:var z= icon(inv_slot,3,1,18,18);z.style.paddingRight="2px";break;
  }*/
  const inv_name = addElement(inv_slot, "span");
  inv_name.innerHTML = obj.name;
  if (!!obj.data.skey)
    inv_name.innerHTML +=
      "<small> {" + String.fromCharCode(obj.data.skey) + "}</small>";
  if (obj.new === true)
    inv_name.innerHTML += i18n.t("runtime.ui.interface.interface.new_4722a9bf");
  inv_slot_c.addEventListener("mouseenter", function () {
    global.keyobj = obj;
    inv_slot.tabIndex = 0;
    inv_slot.focus();
    inv_slot.addEventListener("keydown", listen_k);
    global.flags.kfocus = true;
    if (obj.important === false && obj.slot) {
      dom.inv_del = addElement(inv_slot_c, "span", null, "del_b");
      dom.inv_del.innerHTML = "x";
      addDesc(
        dom.inv_del,
        null,
        2,
        i18n.t("runtime.ui.interface.description.throw_away_1e7f6dff"),
        i18n.t("ui.inventory.delete.description", { item: obj.name }),
      );
      dom.inv_del.addEventListener("click", () => {
        if (obj.data.uid === you.eqp[obj.slot - 1].data.uid) {
          showConfirmModal({
            title: i18n.t("ui.inventory.delete.title"),
            message: i18n.t("ui.inventory.delete.confirm", { item: obj.name }),
            confirmLabel: i18n.t("ui.inventory.delete.confirmAction"),
            onConfirm: () => {
              giveSkExp(skl.rccln, 2 ** obj.rar * 5 - 9.5);
              giveSkExp(skl.thr, 0.5);
              global.stat.thrt++;
              removeItem(obj);
            },
          });
        } else {
          giveSkExp(skl.rccln, 2 ** obj.rar * 5 - 9.5);
          removeItem(obj);
          giveSkExp(skl.thr, 0.5);
          global.stat.thrt++;
          empty(global.dscr);
        }
      });
    }
    if (obj.slot === 5 || obj.slot === 6) {
      dom.eq_l = addElement(inv_slot_c, "small", null, "eq_l");
      dom.eq_l.innerHTML = "L";
      addDesc(dom.eq_l, obj);
      dom.eq_l.addEventListener("click", () => {
        if (
          obj.data.uid !== you.eqp[4].data.uid &&
          obj.data.uid !== you.eqp[5].data.uid
        ) {
          obj.slot = 5;
          equip(obj);
        } else if (
          obj.data.uid !== you.eqp[4].data.uid &&
          obj.data.uid === you.eqp[5].data.uid
        ) {
          unequip(obj);
          obj.slot = 5;
          equip(obj);
        } else {
          unequip(obj);
          dom.eq_l.style.backgroundColor = "royalblue";
          this.children[0].removeChild(this.children[0].lastChild);
        }
      });
      if (obj.data.uid === you.eqp[4].data.uid)
        dom.eq_l.style.backgroundColor = "crimson";
      dom.eq_r = addElement(inv_slot_c, "small", null, "eq_r");
      dom.eq_r.innerHTML = "R";
      addDesc(dom.eq_r, obj);
      dom.eq_r.addEventListener("click", () => {
        if (
          obj.data.uid !== you.eqp[4].data.uid &&
          obj.data.uid !== you.eqp[5].data.uid
        ) {
          obj.slot = 6;
          equip(obj);
        } else if (
          obj.data.uid === you.eqp[4].data.uid &&
          obj.data.uid !== you.eqp[5].data.uid
        ) {
          unequip(obj);
          obj.slot = 6;
          equip(obj);
        } else {
          unequip(obj);
          dom.eq_r.style.backgroundColor = "royalblue";
          this.children[0].removeChild(this.children[0].lastChild);
        }
      });
      if (obj.data.uid === you.eqp[5].data.uid)
        dom.eq_r.style.backgroundColor = "crimson";
    }
    if (obj.dss && item.toolbx.have) {
      dom.inv_dss = addElement(inv_slot_c, "span", null, "dss_b");
      dom.inv_dss.innerHTML = "∥";
      if (!obj.slot) dom.inv_dss.style.left = "242px";
      else if (obj.slot === 5 || obj.slot === 6)
        dom.inv_dss.style.left = "208px";
      let t = "";
      for (const a in obj.dss) {
        let am = obj.dss[a].amount;
        if (obj.dss[a].q) am = (am + am * (obj.dss[a].q * skl.dssmb.lvl)) << 0;
        if (obj.dss[a].max) if (am > obj.dss[a].max) am = obj.dss[a].max;
        let c = 1;
        if (obj.slot) c = obj.dp / obj.dpmax;
        am = Math.ceil(am / (2 - c));
        t +=
          '<br><span style="color:orange">' +
          obj.dss[a].item.name +
          ': <span style="color:' +
          (obj.dss[a].max && obj.dss[a].max === am ? "lime" : "lightblue") +
          '">' +
          am +
          "</span></span>";
      }
      addDesc(
        dom.inv_dss,
        null,
        2,
        i18n.t("runtime.ui.interface.description.disassemble_f96ef843"),
        i18n.t("ui.inventory.disassemble.description", {
          item: obj.name,
          results: t,
        }),
      );
      dom.inv_dss.addEventListener("click", () => {
        if (obj.slot && obj.data.uid === you.eqp[obj.slot - 1].data.uid) {
          showConfirmModal({
            title: i18n.t("ui.inventory.disassemble.title"),
            message: i18n.t("ui.inventory.disassemble.confirmEquipped", {
              item: obj.name,
            }),
            confirmLabel: i18n.t("ui.inventory.disassemble.confirmAction"),
            onConfirm: () => disassembleGeneric(obj),
          });
        } else disassembleGeneric(obj);
      });
    }
  });
  inv_slot_c.addEventListener("mouseleave", function () {
    inv_slot.tabIndex = -1;
    inv_slot.removeEventListener("keydown", listen_k);
    global.keyobj = 0;
    global.flags.kfocus = false;
    if (obj.important === false && obj.slot)
      inv_slot_c.removeChild(dom.inv_del);
    if (obj.dss && item.toolbx.have) inv_slot_c.removeChild(dom.inv_dss);
    if (obj.slot === 5 || obj.slot === 6) {
      inv_slot_c.removeChild(dom.eq_r);
      inv_slot_c.removeChild(dom.eq_l);
    }
  });
  if (obj.slot && scanbyuid(you.eqp, obj.data.uid) === true) {
    dom.spc_a = addElement(inv_slot, "small", null, "spc_a");
    dom.spc_a.innerHTML = "E";
  }
  if (!obj.slot) {
    const s_am = addElement(inv_slot, "small", null, "s_am");
    s_am.innerHTML = " x" + obj.amount;
    inv_slot.addEventListener("mouseenter", function () {
      global.flags.kfocus = true;
      this.tabIndex = 0;
      this.focus();
      global.keyobj = obj;
      this.addEventListener("keydown", listen_k);
    });
    inv_slot.addEventListener("mouseleave", function () {
      global.flags.kfocus = false;
      this.tabIndex = -1;
      global.keyobj = 0;
      this.removeEventListener("keydown", listen_k);
    });
  }
  if (!!obj.c || !!obj.bc) {
    if (!!obj.c) inv_name.style.color = obj.c;
    if (!!obj.bc) inv_name.style.backgroundColor = obj.bc;
  } else {
    switch (obj.stype) {
      case 2:
        inv_name.style.color = "rgb(255,192,5)";
        break;
      case 3:
        inv_name.style.color = "rgb(0,235,255)";
        break;
      case 4:
        inv_name.style.color = "rgb(44,255,44)";
        break;
    }
  }
  addDesc(inv_slot, obj, null, null, null, null, 100);
  inv_slot.addEventListener("click", function (x) {
    if (obj.amount > 0 || !!obj.slot) {
      obj.use(x);
      if (!obj.slot) reduce(obj);
      if (obj.id < 3000 && !obj.data.tried) {
        obj.data.tried = true;
        global.stat.ftried += 1;
        if (global.dscr.style.display != "none")
          dom.dtrd.innerHTML = i18n.t(
            "runtime.ui.interface.interface.tried_yes_d9eff930",
          );
      }
    }
  });
  inv_slot.addEventListener("mouseleave", function () {
    if (obj.new === true) {
      obj.new = false;
      clearTimeout(timers.nsblk);
      inv_name.innerHTML = obj.name;
    }
  });
}

function updateInv(slot) {
  if (global.sm === 1)
    dom.inv_con.children[slot].children[0].children[1].innerHTML =
      " x" + inv[slot].amount;
  else
    dom.inv_con.children[slot].children[0].children[1].innerHTML =
      " x" + global.sinv[slot].amount;
}

function removeItem(obj, flag) {
  if (obj.slot) if (wearing(obj)) unequip(obj);
  if (obj.data.skey) {
    for (const s in global.shortcuts)
      if (obj.data.skey === global.shortcuts[s][0]) {
        global.shortcuts.splice(global.shortcuts.indexOf(obj.data.skey), 1);
        continue;
      }
  }
  let idx;
  if (global.sm === 1) {
    idx = inv.indexOf(obj);
    dom.inv_con.removeChild(dom.inv_con.children[idx]);
  } else if (global.sm === obj.stype) {
    idx = global.sinv.indexOf(obj);
    dom.inv_con.removeChild(dom.inv_con.children[idx]);
    global.sinv.splice(idx, 1);
  }
  global.dscr.style.display = "none";
  inv.splice(inv.indexOf(obj), 1);
  obj.have = false;
  if (obj.rot)
    for (const a in planner.imorph.data.items)
      if (planner.imorph.data.items[a].id === obj.id) {
        planner.imorph.data.items.splice(
          planner.imorph.data.items.indexOf(obj),
        );
      }
  if (global.lw_op === 1) rsort(global.rm);
  if (flag && flag.fl) iftrunkopen(1);
  else iftrunkopenc(1);
  if (obj.slot) kill(obj);
}

function m_update() {
  dom.mn_1.innerHTML = "㊧" + ((you.wealth / 100000000) << 0);
  dom.mn_2.innerHTML = "●" + (((you.wealth / 10000) % 10000) << 0);
  dom.mn_3.innerHTML = "●" + (((you.wealth / 100) % 100) << 0);
  dom.mn_4.innerHTML = "●" + ((you.wealth % 100) << 0);
}

function chs(txt, f, c, bc, iconx, icony, size, ignore, slimsize) {
  if (f === true) {
    clr_chs();
    dom.ch_1 = addElement(dom.ctr_2, "div", "chs");
    dom.ch_1.innerHTML = txt;
  } else {
    dom.ch_1 = addElement(dom.ctr_2, "div", null, "chs");
    dom.ch_1.innerHTML = txt;
  }
  if (!!iconx) {
    dom.ch_1.insertBefore(icon(dom.ch_1, iconx, icony), dom.ch_1.firstChild);
  }
  if (c) dom.ch_1.style.color = c;
  if (bc) dom.ch_1.style.backgroundColor = bc;
  if (size) dom.ch_1.style.fontSize = size;
  if (slimsize) dom.ch_1.style.height = slimsize;
  if (!ignore) global.menuo = 0;
  dom.ch_1.addEventListener("click", () => {
    clearInterval(timers.rptbncgt);
    global.flags.rptbncgtf = false;
    if (!global.flags.jdgdis) {
      global.flags.jdgdis = true;
      giveSkExp(skl.jdg, 0.1);
      setTimeout(() => {
        global.flags.jdgdis = false;
      }, 500);
    }
  });
  return dom.ch_1;
}

global.text.cfc = i18n.get("gameText.cfc");
global.text.cfp = i18n.get("gameText.cfp");
global.text.cln = i18n.get("gameText.cln");

// The containers these panels are rendered into — #ctrm_2 and the .ctrwinbx
// windows — declare no height of their own, so a percentage height on anything
// placed inside them never resolves. Every such panel behaved as `auto`: it grew
// with its contents, its own overflow:auto never had anything to clip, and the
// choices rendered after it were pushed off the bottom of the screen. #ctrmg is
// the window and does have a fixed height, so panel heights are taken from there.
function windowPanelHeight(share) {
  return Math.round(dom.ctrmg.clientHeight * share) + "px";
}

function renderLoreEntry(root, entry, kind) {
  const row = addElement(root, "div", null, "lore-entry lore-entry--" + kind);
  const title = addElement(row, "div", null, "lore-entry__title");
  title.innerHTML = entry.name;
  const body = addElement(row, "div", null, "lore-entry__body");
  body.innerHTML = entry.desc;
  return row;
}

// The journal's lore panel: what the player has worked out, and what they have
// not. Clues first, then the open questions with their answers folded in where one
// has been earned. A question with no answer is left standing rather than hidden,
// because the point of showing it is that the player can see the shape of what
// they still do not know.
function renderLore() {
  const known = loreKnown();
  const panel = addElement(dom.ctrwin6, "div", null, "lore-panel");
  panel.style.height = windowPanelHeight(0.84);

  const heading = addElement(panel, "div", null, "lore-heading");
  heading.innerHTML = i18n.t("ui.panels.lore");

  const body = addElement(panel, "div", null, "lore-body");

  if (!known.clues.length && !known.questions.length) {
    const empty_ = addElement(body, "div", null, "lore-open");
    empty_.innerHTML = i18n.t("ui.lore.nothingYet");
  }

  if (known.clues.length) {
    const section = addElement(body, "div", null, "lore-section");
    section.innerHTML = i18n.t("ui.lore.known");
    for (const entry of known.clues) renderLoreEntry(body, entry, "clue");
  }

  if (known.questions.length) {
    const section = addElement(body, "div", null, "lore-section");
    section.innerHTML = i18n.t("ui.lore.questions");
    for (const item of known.questions) {
      renderLoreEntry(body, item.entry, "question");
      if (item.answer) renderLoreEntry(body, item.answer, "answer");
      else {
        const open = addElement(body, "div", null, "lore-open");
        open.innerHTML = i18n.t("ui.lore.unanswered");
      }
    }
  }

  const back = addElement(panel, "div", "qtrtn");
  back.innerHTML = i18n.t("runtime.ui.interface.interface.return_9e4bb9d7");
  back.addEventListener("click", () => {
    dom.ct_bt6.click();
  });
}

function chs_spec(type, x) {
  switch (type) {
    case 1:
      {
        clr_chs();
        const c = findbyid(furn, furniture.cat.id);
        const br = time.minute - c.data.age;
        dom.ch_1 = addElement(dom.ctr_2, "div", "chs");
        dom.ch_1.style.height = "200px";
        dom.ch_1_1 = addElement(dom.ch_1, "div", null, "chs_s");
        dom.ch_1_1.innerHTML = i18n.t("ui.cat.name", {
          name: c.data.name,
          sex: c.data.sex === true ? "♂" : "♀",
        });
        dom.ch_1_1.style.marginTop = "-17px";
        dom.ch_1_12 = addElement(dom.ch_1, "div", null, "chs_s");
        dom.ch_1_12.innerHTML = i18n.t("ui.cat.dayOfBirth", {
          date:
            ((br / YEAR) << 0) +
            "/" +
            ((((br / MONTH) << 0) % 12) + 1) +
            "/" +
            ((((br / DAY) << 0) % 30) + 1),
        });
        dom.ch_1_2 = addElement(dom.ch_1, "div", null, "chs_s");
        dom.ch_1_2.innerHTML = i18n.t("ui.cat.age", {
          age:
            (c.data.age >= YEAR
              ? '<span style="color:orange">' +
                ((c.data.age / YEAR) << 0) +
                "</span> " +
                i18n.t("ui.time.years") +
                " "
              : "") +
            (c.data.age >= MONTH
              ? '<span style="color:yellow">' +
                (((c.data.age / MONTH) << 0) % 12) +
                "</span> " +
                i18n.t("ui.time.months") +
                " "
              : "") +
            (c.data.age >= DAY
              ? '<span style="color:lime">' +
                (((c.data.age / DAY) << 0) % 30) +
                "</span> " +
                i18n.t("ui.time.days") +
                " "
              : ""),
        });
        dom.ch_1_3 = addElement(dom.ch_1, "div", null, "chs_s");
        dom.ch_1_3.innerHTML = i18n.t("ui.cat.patternAndColor", {
          pattern: global.text.cfp[c.data.p],
          color: global.text.cfc[c.data.c],
        });
        dom.ch_1_4 = addElement(dom.ch_1, "div", null, "chs_s");
        dom.ch_1_4.innerHTML = i18n.t("ui.cat.likes", {
          first: global.text.cln[c.data.l1],
          second: global.text.cln[c.data.l2],
        });
        timers.caupd = setInterval(() => {
          dom.ch_1_2.innerHTML = i18n.t("ui.cat.age", {
            age:
              (c.data.age >= YEAR
                ? '<span style="color:orange">' +
                  ((c.data.age / YEAR) << 0) +
                  "</span> " +
                  i18n.t("ui.time.years") +
                  " "
                : "") +
              (c.data.age >= MONTH
                ? '<span style="color:yellow">' +
                  (((c.data.age / MONTH) << 0) % 12) +
                  "</span> " +
                  i18n.t("ui.time.months") +
                  " "
                : "") +
              (c.data.age >= DAY
                ? '<span style="color:lime">' +
                  (((c.data.age / DAY) << 0) % 30) +
                  "</span> " +
                  i18n.t("ui.time.days") +
                  " "
                : ""),
          });
        }, 1000);
      }
      break;
    case 2:
      {
        clr_chs();
        dom.ch_1 = addElement(dom.ctr_2, "div");
        dom.ch_1.style.height = windowPanelHeight(0.76);
        dom.ch_1.style.backgroundColor = "rgb(0,20,44)";
        dom.flsthdr = addElement(dom.ch_1, "div");
        dom.flsthdra = addElement(dom.flsthdr, "div");
        dom.flsthdr.style.display = "flex";
        dom.flsthdra.innerHTML = i18n.t(
          "runtime.ui.interface.interface.furniture_owned_7537016a",
        );
        dom.flsthdra.style.position = "relative";
        dom.flsthdra.style.left = "120px";
        dom.flsthdr.style.borderBottom = "1px #44c solid";
        dom.flsthdr.style.padding = "2px";
        dom.flsthdrbc = addElement(dom.flsthdr, "div");
        dom.flsthdrb = addElement(dom.flsthdrbc, "small");
        dom.flsthdrb.innerHTML = i18n.t(
          "runtime.ui.interface.interface.home_rating_10df78c8",
        );
        dom.flsthdrbc.style.left = "237px";
        dom.flsthdrb.style.paddingLeft = "6px";
        dom.flsthdrbc.style.position = "relative";
        dom.flsthdrbc.style.borderLeft = "1px solid rgb(68, 68, 204)";
        dom.flsthdrbb = addElement(dom.flsthdrbc, "small");
        dom.flsthdrbb.style.color = "lime";
        let v = 0;
        for (const a in furn)
          if (furn[a].v) {
            if (furn[a].multv) v += furn[a].v * furn[a].amount;
            else v += furn[a].v;
          }
        dom.flsthdrbb.innerHTML = v;
        dom.ch_1h = addElement(dom.ch_1, "div", null);
        dom.ch_1h.style.textAlign = "left";
        dom.ch_1h.style.display = "block";
        for (const a in furn) {
          renderFurniture(furn[a]);
        }
      }
      break;
    case 3:
      {
        clr_chs();
        global.menuo = 3;
        global.cchest = x;
        dom.ch_1a = addElement(dom.ctr_2, "div");
        dom.ch_1a.style.height = windowPanelHeight(0.745);
        dom.ch_1a.style.backgroundColor = "rgb(0,20,44)";
        dom.ch_1a.style.display = "flex";
        dom.ch_1a.style.overflow = "hidden";
        dom.ch_1a.style.position = "relative";
        dom.invp1 = addElement(dom.ch_1a, "div");
        dom.invp2 = addElement(dom.ch_1a, "div");
        dom.invp1.style.width = dom.invp2.style.width = "50%";
        // Each side scrolls on its own, so a long inventory cannot push the box's
        // own contents off the panel and the two lists do not drag each other.
        dom.invp1.style.overflow = dom.invp2.style.overflow = "auto";
        dom.invp1.style.boxSizing = dom.invp2.style.boxSizing = "border-box";
        dom.invp2noth = addElement(dom.ctr_2, "div");
        dom.invp2noth.style.top = "150px";
        dom.invp2noth.style.position = "absolute";
        dom.invp2noth.style.color = "grey";
        dom.invp2noth.innerHTML = i18n.t(
          "runtime.ui.interface.interface.nothing_in_the_box_yet_fbe1b207",
        );
        dom.invp2noth.style.left = "301px";
        dom.invp2noth.style.pointerEvents = "none";
        for (const obj in inv) rendertrunkitem(dom.invp1, inv[obj]);
        for (const obj in x.c)
          rendertrunkitem(dom.invp2, x.c[obj].item, {
            right: true,
            nit: {
              item: x.c[obj].item,
              data: x.c[obj].data,
              am: x.c[obj].am,
              dp: x.c[obj].dp,
            },
          });
        if (x.c.length > 0) dom.invp2noth.style.display = "none";
        if (inv.length >= 21) dom.invp2noth.style.left = "301px";
        else dom.invp2noth.style.left = "314px";
      }
      break;
    case 4:
      {
        clr_chs();
        global.menuo = 4;
        global.shprf = x;
        dom.ch_1 = addElement(dom.ctr_2, "div");
        // The panel asked for 76% of #ctrm_2, which declares no height of its
        // own, so the percentage never resolved and neither did the 87% and 5%
        // below it. Everything behaved as `auto`: the list grew with the stock
        // and the footer collapsed to nothing, because it holds only floats.
        // Taking the share from the window gives the column something definite
        // to divide up.
        dom.ch_1.style.height = windowPanelHeight(0.76);
        dom.ch_1.style.backgroundColor = "rgb(0,20,44)";
        // With a definite height the list can take whatever is left over and the
        // footer stays on the bottom edge whatever the shop stocks.
        dom.ch_1.style.display = "flex";
        dom.ch_1.style.flexDirection = "column";
        dom.flsthdr = addElement(dom.ch_1, "div");
        dom.flsthdr.innerHTML = x.name;
        dom.flsthdr.style.borderBottom = "1px #44c solid";
        dom.flsthdr.style.padding = "2px";
        dom.flsthdr.style.flexShrink = "0";
        dom.ch_1h = addElement(dom.ch_1, "div");
        dom.ch_1h.style.textAlign = "left";
        dom.ch_1h.style.display = "block";
        dom.ch_1h.style.flex = "1";
        // Without this a flex item refuses to shrink below its content, so a
        // long stock list would push the footer out of the panel instead of
        // scrolling inside it.
        dom.ch_1h.style.minHeight = "0";
        dom.ch_1h.style.overflow = "auto";
        if (dom.ch_etn) empty(dom.ch_etn);
        for (const it in x.stock) {
          rendershopitem(dom.ch_1h, x.stock[it], x);
        }
        dom.ch_1c = addElement(dom.ch_1, "div");
        dom.ch_1c.style.backgroundColor = "rgb(10, 30, 54)";
        // Both readouts are floated, so the strip needs a height of its own or it
        // would collapse to nothing.
        dom.ch_1c.style.height = "5%";
        dom.ch_1c.style.minHeight = "1.2em";
        dom.ch_1c.style.flexShrink = "0";
        dom.ch_1c.style.width = "100%";
        dom.ch_1e = addElement(dom.ch_1c, "small"); //dom.ch_1e.style.border='1px solid #9485ed';
        dom.ch_1e.style.float = dom.ch_1e.style.textAlign = "left";
        dom.ch_2e = addElement(dom.ch_1c, "small"); //dom.ch_1e.style.border='1px solid #9485ed';
        dom.ch_2e.style.float = dom.ch_2e.style.textAlign = "right";
        dom.ch_2e.style.paddingRight = "6px";
        //dom.ch_1e1 = addElement(dom.ch_1e,'input'); dom.ch_1e1.style.height="18px";dom.ch_1e1.style.width="40px";
        //dom.ch_1e1.style.textAlign='center'; dom.ch_1e1.style.color='white'; dom.ch_1e1.style.fontFamily='MS Gothic';
        //dom.ch_1e1.style.backgroundColor='transparent'
        dom.ch_1e.innerHTML =
          i18n.t("ui.shop.buyingPrice") +
          '<span style="color:lime">' +
          Math.round(
            (you.mods.infsrate - skl.trad.use()) *
              x.infl *
              (1 - (Math.sqrt(x.data.rep) ** 1.3 + 0.05) * 0.01) *
              global.offline_evil_index *
              10000,
          ) /
            100 +
          "%</span>";
        dom.ch_2e.innerHTML =
          i18n.t("ui.shop.reputation") + col(x.data.rep << 0, "lime");
      }
      break;
    case 5:
      {
      }
      break;
    // Selling. Built the same way as the shop above rather than as a run of
    // top-level choices: a bare chs() per item grows #ctrm_2, which declares no
    // height and no overflow, so a full inventory ran straight off the bottom of
    // the panel and over the game's own tabs.
    case 6:
      {
        clr_chs();
        global.menuo = 6;
        global.shprf = x;
        dom.ch_1 = addElement(dom.ctr_2, "div");
        dom.ch_1.style.height = windowPanelHeight(0.76);
        dom.ch_1.style.backgroundColor = "rgb(0,20,44)";
        dom.ch_1.style.display = "flex";
        dom.ch_1.style.flexDirection = "column";
        dom.flsthdr = addElement(dom.ch_1, "div");
        dom.flsthdr.innerHTML = x.name;
        dom.flsthdr.style.borderBottom = "1px #44c solid";
        dom.flsthdr.style.padding = "2px";
        dom.flsthdr.style.flexShrink = "0";
        dom.ch_1h = addElement(dom.ch_1, "div");
        dom.ch_1h.style.textAlign = "left";
        dom.ch_1h.style.display = "block";
        dom.ch_1h.style.flex = "1";
        // A flex item will not shrink below its content without this, so a long
        // list would push the footer out instead of scrolling inside it.
        dom.ch_1h.style.minHeight = "0";
        dom.ch_1h.style.overflow = "auto";
        const lines = sellableInventory();
        if (lines.length === 0) {
          const none = addElement(dom.ch_1h, "div", null, "chs_s");
          none.innerHTML = i18n.t("ui.shop.sellNothing");
        } else for (const line of lines) rendersellitem(dom.ch_1h, line, x);
        dom.ch_1c = addElement(dom.ch_1, "div");
        dom.ch_1c.style.backgroundColor = "rgb(10, 30, 54)";
        dom.ch_1c.style.height = "5%";
        dom.ch_1c.style.minHeight = "1.2em";
        dom.ch_1c.style.flexShrink = "0";
        dom.ch_1c.style.width = "100%";
        dom.ch_1e = addElement(dom.ch_1c, "small");
        dom.ch_1e.style.float = dom.ch_1e.style.textAlign = "left";
        dom.ch_1e.innerHTML =
          i18n.t("ui.shop.sellingPrice") +
          '<span style="color:lime">' +
          Math.round(Math.min(0.45, 0.2 + skl.trad.use()) * 10000) / 100 +
          "%</span>";
        dom.ch_2e = addElement(dom.ch_1c, "small");
        dom.ch_2e.style.float = dom.ch_2e.style.textAlign = "right";
        dom.ch_2e.style.paddingRight = "6px";
        dom.ch_2e.innerHTML =
          i18n.t("ui.shop.reputation") + col(x.data.rep << 0, "lime");
      }
      break;
  }
  return dom.ch_1;
}

// One line of the sell list: what it is on the left, what he pays on the right.
// Selling re-reads the stack when clicked rather than trusting what was drawn,
// because an action running in the background can consume from the inventory
// between this row being rendered and the player pressing it.
function rendersellitem(root, line, vnd) {
  const row = addElement(root, "div", "bst_entrh", "bst_entr");
  row.style.backgroundColor = "rgb(10,30,54)";
  addDesc(row, line.obj);
  const left = addElement(row, "div", null, "bst_entr1");
  left.style.width = "74%";
  left.innerHTML = line.obj.name + (line.obj.slot ? "" : " x" + line.amount);
  switch (line.obj.stype) {
    case 2:
      left.style.color = "rgb(255,192,5)";
      break;
    case 3:
      left.style.color = "rgb(0,235,255)";
      break;
    case 4:
      left.style.color = "rgb(44,255,44)";
      break;
  }
  const right = addElement(row, "div", null, "bst_entr2");
  right.style.width = "24%";
  right.style.textAlign = "right";
  right.innerHTML = formatw(line.total);
  row.addEventListener("click", () => {
    const amount = line.obj.slot ? 1 : line.obj.amount;
    if (!(amount > 0)) {
      smove(chss.gensell, false);
      return;
    }
    const paid = itemSellValue(line.obj) * amount;
    const sold = line.obj.name;
    if (!line.obj.slot) line.obj.amount = 0;
    removeItem(line.obj);
    giveWealth(paid);
    // Trading with him is how he comes to know you, the same as buying is.
    vnd.data.rep += Math.min(0.5, paid / 2000);
    msg(
      i18n.t("runtime.world.locations.dialogue.sell_goods_sold", {
        item: sold,
        amount,
      }),
      "lime",
    );
    // Rebuild the scene, not just the panel. chs_spec starts with clr_chs(), which
    // clears the Return choice the scene added after it -- calling it directly left
    // the list on screen with no way back out.
    smove(chss.gensell, false);
  });
  return row;
}

//linear-gradient(0deg,rgb(1,1,111),rgb(22,222,22))

function renderFurniture(frn) {
  dom.ch_etn = addElement(dom.ch_1h, "div", "bst_entrh", "bst_entr");
  dom.ch_etn.style.backgroundColor = "rgb(10,30,54)";
  dom.ch_etn1 = addElement(dom.ch_etn, "div", null, "bst_entr1");
  dom.ch_etn1.innerHTML = frn.name;
  switch (frn.id) {
    case home.bed.id:
      dom.ch_etn1.innerHTML += i18n.t(
        "runtime.ui.interface.interface.z_f0e0067f",
      );
      break;
    case home.pilw && home.pilw.id:
      dom.ch_etn1.innerHTML += i18n.t(
        "runtime.ui.interface.interface.zp_f04e2799",
      );
      break;
    case home.blkt && home.blkt.id:
      dom.ch_etn1.innerHTML += i18n.t(
        "runtime.ui.interface.interface.zb_ad57335a",
      );
      break;
    case home.tbw && home.tbw.id:
      dom.ch_etn1.innerHTML += i18n.t(
        "runtime.ui.interface.interface.t_95f70e90",
      );
      break;
  }
  dom.ch_etn.addEventListener("mouseenter", function () {
    if (frn.removable === true) {
      dom.chsfdel = addElement(this.children[0], "div", null, "del_b");
      dom.chsfdel.innerHTML = "x";
      dom.chsfdel.style.right = "5px";
      dom.chsfdel.style.top = "19px";
      dom.chsfdel.addEventListener("click", function () {
        frn.data.amount--;
        frn.onRemove();
        if (frn.data.amount === 0) {
          deactivatef(frn);
          frn.onDestroy();
          global.dscr.style.display = "none";
          furn.splice(furn.indexOf(frn), 1);
          chs_spec(2);
          chs(
            i18n.t("runtime.ui.interface.dialogue.return_5ced966d"),
            false,
          ).addEventListener("click", () => {
            smove(chss.home, false);
          });
        } else
          this.parentElement.parentElement.children[1].innerHTML =
            "x" + frn.data.amount;
        let v = 0;
        for (const a in furn)
          if (furn[a].v) {
            if (furn[a].multv) v += furn[a].v * furn[a].amount;
            else v += furn[a].v;
          }
        dom.flsthdrbb.innerHTML = v;
      });
    }
  });
  dom.ch_etn.addEventListener("mouseleave", function () {
    if (frn.removable === true) this.children[0].removeChild(dom.chsfdel);
  });
  dom.ch_etn.addEventListener("click", function () {
    frn.onSelect(); //this.dispatchEvent(new window.Event('mouseenter'))
  });
  dom.ch_etn2 = addElement(dom.ch_etn, "div", null, "bst_entr2");
  dom.ch_etn2.innerHTML = "x" + frn.data.amount;
  dom.ch_etn2.style.width = "6%";
  addDesc(dom.ch_etn, frn, 9);
}

function recshop() {
  if (global.menuo === 4) {
    empty(dom.ch_1h);
    for (const it in global.shprf.stock) {
      rendershopitem(dom.ch_1h, global.shprf.stock[it], global.shprf);
    }
    dom.ch_1e.innerHTML =
      i18n.t("ui.shop.buyingPrice") +
      '<span style="color:lime">' +
      Math.round(
        (you.mods.infsrate - skl.trad.use()) *
          global.shprf.infl *
          (1 - (Math.sqrt(global.shprf.data.rep) ** 1.3 + 0.05) * 0.01) *
          global.offline_evil_index *
          10000,
      ) /
        100 +
      "%</span>";
    dom.ch_2e.innerHTML =
      i18n.t("ui.shop.reputation") + col(global.shprf.data.rep << 0, "lime");
  }
}

function rendershopitem(root, itm, vnd) {
  dom.ch_etn = addElement(root, "div", "bst_entrh", "bst_entr");
  dom.ch_etn.style.backgroundColor = "rgb(10,30,54)";
  addDesc(dom.ch_etn, itm[0]);
  dom.ch_etn1 = addElement(dom.ch_etn, "div", null, "bst_entr1");
  dom.ch_etn1.style.width = "79%";
  dom.ch_etn1n = addElement(dom.ch_etn1, "div");
  dom.ch_etn1n.innerHTML = itm[0].name;
  dom.ch_etn1n.style.width = "305px";
  dom.ch_etn1b = addElement(dom.ch_etn1, "div");
  dom.ch_etn1.style.display = "flex";
  dom.ch_etn1b.style.display = "inline-flex";
  dom.ch_etn1b.style.position = "absolute";
  // Unitless numbers are invalid CSS lengths and are dropped, which used to
  // collapse this block back to its static position on top of the item name.
  dom.ch_etn1b.style.right = "6px";
  dom.ch_etn1b.style.textAlign = "center";
  dom.ch_etn1b.style.backgroundColor = "rgb(20,50,84)";
  const p = Math.ceil(
    itm[2] *
      (you.mods.infsrate - skl.trad.use()) *
      vnd.infl *
      (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
      global.offline_evil_index,
  );
  switch (itm[0].stype) {
    case 2:
      dom.ch_etn1n.style.color = "rgb(255,192,5)";
      break;
    case 3:
      dom.ch_etn1n.style.color = "rgb(0,235,255)";
      break;
    case 4:
      dom.ch_etn1n.style.color = "rgb(44,255,44)";
      break;
  }
  dom.ch_etn2 = addElement(dom.ch_etn, "div", null, "bst_entr2");
  dom.ch_etn2.style.display = "flex";
  dom.ch_etn2.style.width = "22%";
  dom.ch_etn2.style.textAlign = "left";
  if (you.wealth < p) {
    dom.ch_etn2.style.color = "red";
    dom.ch_etn.style.backgroundColor = "rgb(68,26,38)";
  }
  dom.ch_etn2_1 = addElement(dom.ch_etn2, "span");
  dom.ch_etn2_1.style.width = "33.3%";
  dom.ch_etn2_2 = addElement(dom.ch_etn2, "span");
  dom.ch_etn2_2.style.width = "33.3%";
  dom.ch_etn2_3 = addElement(dom.ch_etn2, "span");
  dom.ch_etn2_3.style.width = "33.3%";
  if (p >= GOLD) {
    dom.ch_etn2_1.innerHTML = dom.coingold + ((p / GOLD) << 0);
    dom.ch_etn2_1.style.backgroundColor = "rgb(102, 66, 0)";
  }
  if (p >= SILVER && p % GOLD >= SILVER) {
    dom.ch_etn2_2.innerHTML = dom.coinsilver + (((p / SILVER) % SILVER) << 0);
    dom.ch_etn2_2.style.backgroundColor = "rgb(56, 56, 56)";
  }
  if (p < SILVER || (p > SILVER && p % SILVER > 0)) {
    dom.ch_etn2_3.innerHTML = dom.coincopper + ((p % SILVER) << 0);
    dom.ch_etn2_3.style.backgroundColor = "rgb(102, 38, 23)";
  }
  dom.ch_etn3 = addElement(dom.ch_etn, "div", null, "bst_entr3");
  dom.ch_etn3.style.width = "14%";
  dom.ch_etn3.style.color = "lime";
  dom.ch_etn3.innerHTML = itm[1];
  if (itm[1] === 0) {
    dom.ch_etn3.innerHTML = i18n.t(
      "runtime.ui.interface.interface.sold_out_553a41f8",
    );
    dom.ch_etn1n.style.color = "grey";
    dom.ch_etn2.style.color = "grey";
    dom.ch_etn3.style.color = "grey";
  }
  dom.ch_etn.addEventListener("mouseenter", function () {
    dom.ch_etn1b1 = addElement(
      this.children[0].children[1],
      "small",
      null,
      "ch_entbb",
    );
    dom.ch_etn1b1.innerHTML = "1";
    dom.ch_etn1b2 = addElement(
      this.children[0].children[1],
      "small",
      null,
      "ch_entbb",
    );
    dom.ch_etn1b2.innerHTML = "5";
    dom.ch_etn1b3 = addElement(
      this.children[0].children[1],
      "small",
      null,
      "ch_entbb",
    );
    dom.ch_etn1b3.innerHTML = "10";
    dom.ch_etn1b4 = addElement(
      this.children[0].children[1],
      "small",
      null,
      "ch_entbb",
    );
    dom.ch_etn1b4.innerHTML = "M";
    buycbs(itm, vnd);
    dom.ch_etn1b1.addEventListener("click", function () {
      const el = this.parentElement.parentElement.parentElement;
      const p = Math.ceil(
        itm[2] *
          (you.mods.infsrate - skl.trad.use()) *
          vnd.infl *
          (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
          global.offline_evil_index,
      );
      if (you.wealth >= p && itm[1] > 0) {
        itm[1]--;
        giveItem(itm[0]);
        spend(p);
        m_update();
        giveSkExp(skl.gred, itm[2] * 0.05);
        giveSkExp(skl.trad, itm[2] ** (1 + itm[0].rar * 0.1) * 0.05);
        if (p >= GOLD) mf(-Math.ceil((p - GOLD) / GOLD), 3);
        if (p >= SILVER) mf(-Math.ceil(((p - SILVER) / SILVER) % 100), 2);
        mf(-p % 100, 1);
        global.stat.buyt++;
        if (random() < 0.0008) {
          giveItem(acc.dticket);
          msg(
            i18n.t(
              "runtime.ui.interface.dialogue.thank_you_for_your_patronage_1b0cefa7",
            ),
            "gold",
            null,
            null,
            "magenta",
          );
        }
        global.stat.shppnt += p * 0.01;
        vnd.data.rep += itm[2] * 0.0004 * vnd.repsc;
        if (vnd.data.rep > 100) vnd.data.rep = 100;
        if (itm[1] === 0) {
          el.children[2].innerHTML = i18n.t(
            "runtime.ui.interface.interface.sold_out_553a41f8",
          );
          el.children[2].style.color =
            el.children[0].children[0].style.color =
            el.children[1].style.color =
              "grey";
        } else el.children[2].innerHTML = itm[1];
      }
      buycbs(itm, vnd);
    });
    dom.ch_etn1b2.addEventListener("click", function () {
      const el = this.parentElement.parentElement.parentElement;
      const p = Math.ceil(
        itm[2] *
          (you.mods.infsrate - skl.trad.use()) *
          vnd.infl *
          (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
          global.offline_evil_index,
      );
      if (you.wealth >= p * 5 && itm[1] >= 5) {
        itm[1] -= 5;
        giveItem(itm[0], 5);
        spend(p * 5);
        m_update();
        giveSkExp(skl.gred, itm[2] * 5 * 0.05);
        giveSkExp(skl.trad, itm[2] ** (1 + itm[0].rar * 0.1) * 0.05 * 5);
        if (p * 5 >= GOLD) mf(-Math.ceil((p * 5 - GOLD) / GOLD), 3);
        if (p * 5 >= SILVER)
          mf(-Math.ceil(((p * 5 - SILVER) / SILVER) % 100), 2);
        mf((-p * 5) % 100, 1);
        global.stat.buyt += 5;
        if (random() < 0.004) {
          giveItem(acc.dticket);
          msg(
            i18n.t(
              "runtime.ui.interface.dialogue.thank_you_for_your_patronage_1b0cefa7",
            ),
            "gold",
            null,
            null,
            "magenta",
          );
        }
        global.stat.shppnt += p * 0.01;
        vnd.data.rep += itm[2] * (5 * (1 + 0.05)) * 0.0004 * vnd.repsc;
        if (vnd.data.rep > 100) vnd.data.rep = 100;
        if (itm[1] === 0) {
          el.children[2].innerHTML = i18n.t(
            "runtime.ui.interface.interface.sold_out_553a41f8",
          );
          el.children[2].style.color =
            el.children[0].children[0].style.color =
            el.children[1].style.color =
              "grey";
        } else el.children[2].innerHTML = itm[1];
      }
      buycbs(itm, vnd);
    });
    dom.ch_etn1b3.addEventListener("click", function () {
      const el = this.parentElement.parentElement.parentElement;
      const p = Math.ceil(
        itm[2] *
          (you.mods.infsrate - skl.trad.use()) *
          vnd.infl *
          (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
          global.offline_evil_index,
      );
      if (you.wealth >= p * 10 && itm[1] >= 10) {
        itm[1] -= 10;
        giveItem(itm[0], 10);
        spend(p * 10);
        m_update();
        giveSkExp(skl.gred, itm[2] * 10 * 0.05);
        giveSkExp(skl.trad, itm[2] ** (1 + itm[0].rar * 0.1) * 0.05 * 10);
        if (p * 10 >= GOLD) mf(-Math.ceil((p * 10 - GOLD) / GOLD), 3);
        if (p * 10 >= SILVER)
          mf(-Math.ceil(((p * 10 - SILVER) / SILVER) % 100), 2);
        mf((-p * 10) % 100, 1);
        global.stat.buyt += 10;
        if (random() < 0.008) {
          giveItem(acc.dticket);
          msg(
            i18n.t(
              "runtime.ui.interface.dialogue.thank_you_for_your_patronage_1b0cefa7",
            ),
            "gold",
            null,
            null,
            "magenta",
          );
        }
        global.stat.shppnt += p * 0.01;
        vnd.data.rep += itm[2] * (10 * (1 + 0.1)) * 0.0004 * vnd.repsc;
        if (vnd.data.rep > 100) vnd.data.rep = 100;
        if (itm[1] === 0) {
          el.children[2].innerHTML = i18n.t(
            "runtime.ui.interface.interface.sold_out_553a41f8",
          );
          el.children[2].style.color =
            el.children[0].children[0].style.color =
            el.children[1].style.color =
              "grey";
        } else el.children[2].innerHTML = itm[1];
      }
      buycbs(itm, vnd);
    });
    dom.ch_etn1b4.addEventListener("click", function () {
      const el = this.parentElement.parentElement.parentElement;
      const p = Math.ceil(
        itm[2] *
          (you.mods.infsrate - skl.trad.use()) *
          vnd.infl *
          (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
          global.offline_evil_index,
      );
      let max = (you.wealth / p) << 0;
      if (max > itm[1]) max = itm[1];
      if (you.wealth >= p && itm[1] > 0) {
        itm[1] -= max;
        giveItem(itm[0], max);
        spend(p * max);
        m_update();
        giveSkExp(skl.gred, itm[2] * max * 0.05);
        giveSkExp(skl.trad, itm[2] ** (1 + itm[0].rar * 0.1) * 0.05 * max);
        if (p * max >= GOLD) mf(-Math.ceil((p * max - GOLD) / GOLD), 3);
        if (p * max >= SILVER)
          mf(-Math.ceil(((p * max - SILVER) / SILVER) % 100), 2);
        mf((-p * max) % 100, 1);
        global.stat.buyt += max;
        if (random() < 0.0008 * max) {
          giveItem(acc.dticket);
          msg(
            i18n.t(
              "runtime.ui.interface.dialogue.thank_you_for_your_patronage_1b0cefa7",
            ),
            "gold",
            null,
            null,
            "magenta",
          );
        }
        global.stat.shppnt += p * 0.01;
        vnd.data.rep += itm[2] * (max * (1 + max * 0.01)) * 0.0004 * vnd.repsc;
        if (vnd.data.rep > 100) vnd.data.rep = 100;
        if (itm[1] === 0) {
          el.children[2].innerHTML = i18n.t(
            "runtime.ui.interface.interface.sold_out_553a41f8",
          );
          el.children[2].style.color =
            el.children[0].children[0].style.color =
            el.children[1].style.color =
              "grey";
        } else el.children[2].innerHTML = itm[1];
      }
      buycbs(itm, vnd);
    });
  });
  dom.ch_etn.addEventListener("mouseleave", function () {
    empty(this.children[0].children[1]);
  });
  dom.ch_etn1n.addEventListener("click", function () {
    const el = this.parentElement.parentElement;
    const p = Math.ceil(
      itm[2] *
        (you.mods.infsrate - skl.trad.use()) *
        vnd.infl *
        (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
        global.offline_evil_index,
    );
    if (you.wealth >= p && itm[1] > 0) {
      itm[1]--;
      giveItem(itm[0]);
      spend(p);
      m_update();
      giveSkExp(skl.gred, itm[2] * 0.05);
      giveSkExp(skl.trad, itm[2] ** (1 + itm[0].rar * 0.1) * 0.05);
      if (p >= GOLD) mf(-Math.ceil((p - GOLD) / GOLD), 3);
      if (p >= SILVER) mf(-Math.ceil(((p - SILVER) / SILVER) % 100), 2);
      mf(-p % 100, 1);
      global.stat.buyt++;
      if (random() < 0.0008) {
        giveItem(acc.dticket);
        msg(
          i18n.t(
            "runtime.ui.interface.dialogue.thank_you_for_your_patronage_1b0cefa7",
          ),
          "gold",
          null,
          null,
          "magenta",
        );
      }
      global.stat.shppnt += p * 0.01;
      vnd.data.rep += itm[2] * 0.0004 * vnd.repsc;
      if (vnd.data.rep > 100) vnd.data.rep = 100;
      if (itm[1] === 0) {
        el.children[2].innerHTML = i18n.t(
          "runtime.ui.interface.interface.sold_out_553a41f8",
        );
        el.children[2].style.color =
          this.style.color =
          el.children[1].style.color =
            "grey";
      } else el.children[2].innerHTML = itm[1];
    }
    buycbs(itm, vnd);
  });
}

function buycbs(itm, vnd) {
  const p = Math.ceil(
    itm[2] *
      (you.mods.infsrate - skl.trad.use()) *
      vnd.infl *
      (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
      global.offline_evil_index,
  );
  if (you.wealth < p || itm[1] <= 0) dom.ch_etn1b1.style.color = "grey";
  if (you.wealth < p * 5 || itm[1] < 5) dom.ch_etn1b2.style.color = "grey";
  if (you.wealth < p * 10 || itm[1] < 10) dom.ch_etn1b3.style.color = "grey";
  if (you.wealth < p || itm[1] <= 0) dom.ch_etn1b4.style.color = "grey";
  dom.ch_1e.innerHTML =
    i18n.t("ui.shop.buyingPrice") +
    '<span style="color:lime">' +
    Math.round(
      (you.mods.infsrate - skl.trad.use()) *
        vnd.infl *
        (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
        global.offline_evil_index *
        10000,
    ) /
      100 +
    "%</span>";
  dom.ch_2e.innerHTML =
    i18n.t("ui.shop.reputation") + col(vnd.data.rep << 0, "lime");
  for (let i = 0; i < vnd.stock.length; i++) {
    if (
      you.wealth <
      Math.ceil(
        vnd.stock[i][2] *
          (you.mods.infsrate - skl.trad.use()) *
          vnd.infl *
          (1 - (Math.sqrt(vnd.data.rep) ** 1.3 + 0.05) * 0.01) *
          global.offline_evil_index,
      )
    ) {
      dom.ch_1h.children[i].children[1].style.color = "red";
      dom.ch_1h.children[i].style.backgroundColor = "rgb(68,26,38)";
    }
  }
  for (const x in global.shptchk) global.shptchk[x](); //put it here for now
}
for (const x in global.cptchk) global.cptchk[x]();

function rendertrunkitem(root, item, ni) {
  if (!ni) {
    ni = {};
    ni.right = false;
  }
  const trunk = global.cchest;
  dom.invp1_con = addElement(root, "div", null, "trkitm");
  ni.right === true
    ? (dom.invp1_con.style.borderLeft = "1px rgb(204, 68, 68) solid")
    : (dom.invp1_con.style.borderRight = "1px rgb(204, 68, 68) solid");
  if (ni.right === true) {
    const c = copy(item);
    c.data = ni.nit.data;
    c.dp = ni.nit.dp;
    addDesc(dom.invp1_con, c);
  } else addDesc(dom.invp1_con, item);
  dom.invp1_s = addElement(dom.invp1_con, "small");
  dom.invp2_s = addElement(dom.invp1_con, "small");
  dom.invp1_s.style.marginLeft = (ni.right ? 23 : 3) + "px";
  dom.invp1_s.innerHTML = item.name;
  dom.invp2_s.style.right = (ni.right ? 3 : 20) + "px";
  dom.invp2_s.innerHTML = !item.slot
    ? "x" + (ni.right === true ? ni.nit.am : item.amount)
    : "";
  dom.invp2_s.style.position = "absolute";
  if (!!item.c || !!item.bc) {
    if (!!item.c) dom.invp1_s.style.color = item.c;
    if (!!item.bc) dom.invp1_s.style.backgroundColor = item.bc;
  } else {
    switch (item.stype) {
      case 2:
        dom.invp1_s.style.color = "rgb(255,192,5)";
        break;
      case 3:
        dom.invp1_s.style.color = "rgb(0,235,255)";
        break;
      case 4:
        dom.invp1_s.style.color = "rgb(44,255,44)";
        break;
    }
  }

  dom.invp1_con.addEventListener("mouseenter", function () {
    dom.invp1_op2 = addElement(
      this,
      "small",
      null,
      ni.right ? "atrkmove2" : "atrkmove",
    );
    dom.invp1_op2.innerHTML = ni.right ? "<<" : ">>";
    dom.invp1_op2.addEventListener("mouseenter", function () {
      global.flags.rtcrutch = true;
    }); //ugly hack
    dom.invp1_op2.addEventListener("mouseleave", function () {
      global.flags.rtcrutch = false;
    }); //self to self: revisit later V:
    dom.invp1_op2.addEventListener("click", function () {
      let scann = false;
      let titem;
      if (ni.right === false) {
        for (const a in trunk.c) {
          if (trunk.c[a].item.id === item.id && !item.slot) {
            scann = true;
            titem = trunk.c[a];
            break;
          }
        }
        if (scann === false) {
          const nit = addToContainer(trunk, item, item.amount);
          item.amount = 0;
          titem = nit;
          if (item.amount <= 0 || item.slot) {
            dom.invp1.removeChild(dom.invp1.children[inv.indexOf(item)]);
            removeItem(item, { fl: true });
          } else if (global.sm === 1) updateInv(inv.indexOf(item));
          else if (global.sm === item.stype)
            updateInv(global.sinv.indexOf(item));
        } else {
          titem.am += item.amount;
          item.amount = 0;
          if (item.amount <= 0) {
            dom.invp1.removeChild(dom.invp1.children[inv.indexOf(item)]);
            removeItem(item, { fl: true });
          } else if (global.sm === 1) updateInv(inv.indexOf(item));
          else if (global.sm === item.stype)
            updateInv(global.sinv.indexOf(item));
        }
        if (titem.item.onTIn) titem.item.onTIn(trunk, titem); //  big stack moves into container
      } else {
        for (const a in inv) {
          if (inv[a].id === item.id && !item.slot) {
            scann = true;
            titem = inv[a];
            break;
          }
        }
        if (scann === false) {
          let fin;
          if (ni.nit.item.slot) {
            for (const a in trunk.c) {
              if (trunk.c[a].data.uid === ni.nit.data.uid) {
                fin = trunk.c[a];
                break;
              }
            }
          } else {
            for (const a in trunk.c) {
              if (trunk.c[a].item.id === ni.nit.item.id) {
                fin = trunk.c[a];
                break;
              }
            }
          }
          const g = giveItem(ni.nit.item, ni.nit.am, true, { fl: true });
          g.data = ni.nit.data;
          g.dp = ni.nit.dp;
          dom.invp2.removeChild(dom.invp2.children[trunk.c.indexOf(fin)]);
          removeFromContainer(trunk, fin);
          rendertrunkitem(dom.invp1, g);
          if (trunk.c.length === 0) global.dscr.style.display = "none";
        } else {
          titem.amount += ni.nit.am;
          let fin;
          for (const a in trunk.c) {
            if (trunk.c[a].item.id === ni.nit.item.id) {
              fin = trunk.c[a];
              break;
            }
          }
          dom.invp2.removeChild(dom.invp2.children[trunk.c.indexOf(fin)]);
          removeFromContainer(trunk, fin);
          if (trunk.c.length === 0) global.dscr.style.display = "none";
          if (global.sm === 1) updateInv(inv.indexOf(item));
          else if (global.sm === item.stype)
            updateInv(global.sinv.indexOf(item));
        }
        if (ni.nit.item.onTOut) ni.nit.item.onTOut(trunk, ni.nit); //  big stack moves out of container
      }
      iftrunkopen();
    });
  });
  dom.invp1_con.addEventListener("mouseleave", function () {
    empty(this.children[2]);
    this.removeChild(this.children[2]);
  });
  dom.invp1_con.addEventListener("click", function () {
    if (global.flags.rtcrutch === true) {
      this.children[0].click();
      return;
    } else {
      scann = false;
      let titem;
      if (ni.right === false) {
        for (const a in trunk.c) {
          if (trunk.c[a].item.id === item.id && !item.slot) {
            scann = true;
            titem = trunk.c[a];
            break;
          }
        }
        if (scann === false) {
          const nit = addToContainer(trunk, item);
          item.amount--;
          titem = nit;
          if (item.amount <= 0) {
            dom.invp1.removeChild(dom.invp1.children[inv.indexOf(item)]);
            removeItem(item, { fl: true });
          } else if (global.sm === 1) updateInv(inv.indexOf(item));
          else if (global.sm === item.stype)
            updateInv(global.sinv.indexOf(item));
        } else {
          titem.am++;
          item.amount--;
          if (item.amount <= 0 || item.slot) {
            dom.invp1.removeChild(dom.invp1.children[inv.indexOf(item)]);
            removeItem(item, { fl: true });
          } else if (global.sm === 1) updateInv(inv.indexOf(item));
          else if (global.sm === item.stype)
            updateInv(global.sinv.indexOf(item));
        }
        if (titem.item.onTIn) titem.item.onTIn(trunk, titem); //  1 item moves into container
      } else {
        for (const a in inv) {
          if (inv[a].id === item.id && !item.slot) {
            scann = true;
            titem = inv[a];
            break;
          }
        }
        if (scann === false) {
          let fin;
          if (ni.nit.item.slot) {
            for (const a in trunk.c) {
              if (trunk.c[a].data.uid === ni.nit.data.uid) {
                fin = trunk.c[a];
                break;
              }
            }
          } else {
            for (const a in trunk.c) {
              if (trunk.c[a].item.id === ni.nit.item.id) {
                fin = trunk.c[a];
                break;
              }
            }
          }
          const g = giveItem(ni.nit.item, 1, true, { fl: true });
          g.data = ni.nit.data;
          g.dp = ni.nit.dp;
          rendertrunkitem(dom.invp1, g);
          if (--fin.am <= 0) {
            dom.invp2.removeChild(dom.invp2.children[trunk.c.indexOf(fin)]);
            removeFromContainer(trunk, fin);
          }
          if (trunk.c.length === 0) global.dscr.style.display = "none";
        } else {
          titem.amount++;
          let fin;
          for (const a in trunk.c) {
            if (trunk.c[a].item.id === ni.nit.item.id) {
              fin = trunk.c[a];
              break;
            }
          }
          if (--fin.am <= 0) {
            dom.invp2.removeChild(dom.invp2.children[trunk.c.indexOf(fin)]);
            removeFromContainer(trunk, fin);
          }
          if (trunk.c.length === 0) global.dscr.style.display = "none";
          if (global.sm === 1) updateInv(inv.indexOf(item));
          else if (global.sm === item.stype)
            updateInv(global.sinv.indexOf(item));
        }
        if (ni.nit.item.onTOut) ni.nit.item.onTOut(trunk, ni.nit); //  1 item moves out of container
      }
      iftrunkopen();
    }
  });
}

function updateTrunkItem(root, idx, item, am) {
  if (root.children[idx])
    root.children[idx].children[1].innerHTML = item.slot ? "" : "x" + am;
}

function updateTrunkLeftItem(item, kill) {
  if (global.menuo === 3) {
    for (const a in inv)
      if (
        (inv[a].data.uid && inv[a].data.uid === item.data.uid) ||
        inv[a].id === item.id
      ) {
        if (kill)
          dom.invp1.removeChild(dom.invp1.children[inv.indexOf(inv[a])]);
        else {
          dom.invp1.children[inv.indexOf(inv[a])].children[1].innerHTML =
            item.slot ? "" : "x" + item.amount;
        }
      }
  }
}

function iftrunkopen(side) {
  if (global.menuo === 3) {
    const trunk = global.cchest;
    if (!side || side === 1)
      for (const obj in inv)
        updateTrunkItem(dom.invp1, obj, inv[obj], inv[obj].amount);
    if (!side || side === 2)
      for (const obj in trunk.c)
        updateTrunkItem(dom.invp2, obj, trunk.c[obj].item, trunk.c[obj].am);
    if (trunk.length === 0) dom.invp2noth.style.display = "";
    else dom.invp2noth.style.display = "none";
  }
}

function iftrunkopenc(side) {
  if (global.menuo === 3) {
    const trunk = global.cchest;
    if (!side || side === 1) {
      empty(dom.invp1);
      for (const obj in inv) rendertrunkitem(dom.invp1, inv[obj]);
    }
    if (!side || side === 2) {
      empty(dom.invp2);
      for (const obj in trunk.c)
        rendertrunkitem(dom.invp2, trunk.c[obj].item, {
          right: true,
          nit: {
            item: trunk.c[obj].item,
            data: trunk.c[obj].data,
            am: trunk.c[obj].am,
            dp: trunk.c[obj].dp,
          },
        });
    }
    if (trunk.length === 0) dom.invp2noth.style.display = "";
    else dom.invp2noth.style.display = "none";
  }
}

function addToContainer(cont, thing, am, data) {
  let it = thing;
  if (thing.slot) it = deepCopy(thing);
  const r = {
    item: it,
    am: am || 1,
    data: data || thing.data,
    dp: thing.slot ? thing.dp : 0,
  };
  if (r.item.slot) r.data.uid = ++global.uid;
  cont.c.push(r);
  if (global.menuo == 3)
    rendertrunkitem(dom.invp2, r.item, {
      right: true,
      nit: { item: r.item, data: r.data, am: r.am, dp: r.dp },
    });
  return r;
}

function removeFromContainer(cont, item, find) {
  if (find) {
    for (const a in cont.c)
      if (cont.c.indexOf(cont.c[a]) === cont.c.indexOf(item)) {
        cont.c.splice(cont.c.indexOf(item), 1);
        break;
      }
  } else cont.c.splice(cont.c.indexOf(item), 1);
}

function clr_chs(index) {
  if (!index) empty(dom.ctr_2);
  else dom.ctr_2.removeChild(dom.ctr_2.children[index]);
}

function smove(where, lv) {
  global.flags.busy = false;
  global.flags.work = false;
  global.wdwidx = 0;
  if (global.flags.loadstate) return;
  if (!global.flags.wkdis) {
    global.flags.wkdis = true;
    if (lv !== false) giveSkExp(skl.walk, 0.25);
    setTimeout(() => {
      global.flags.wkdis = false;
    }, 500);
  }
  you.eqp[6].dp = you.eqp[6].dp - 0.08 < 0 ? 0 : you.eqp[6].dp - 0.08;
  let flg = false;
  const und = [];
  for (const c in global.current_l.sector) {
    for (const a in where.sector) {
      for (const b in where.sector[a].group)
        if (
          where.sector[a].group[b] === global.current_l.id &&
          where.sector[a].id === global.current_l.sector[c].id
        )
          flg = true;
    }
    if (flg === false) {
      global.current_l.sector[c].onLeave();
      deactivateEffectors(global.current_l.sector[c].effectors);
      sectors.splice(sectors.indexOf(global.current_l.sector[c]));
    } else flg = false;
  }
  global.current_l.onLeave();
  deactivateEffectors(global.current_l.effectors);
  global.flags.civil = true;
  global.flags.btl = false;
  global.current_z = area.nwh;
  dom.d7m.update();
  global.stat.smovet++;
  global.flags.inside = false;
  for (const a in where.sector) {
    if (where.sector[a].inside || where.inside) global.flags.inside = true;
  }
  clr_chs();
  activateEffectors(where.effectors);
  where.sl();
  global.current_l = where;
  for (const a in sectors) sectors[a].onMove();
  global.current_a.deactivate();
  global.current_a = act.default;
  dom.ct_bt3.style.backgroundColor = "inherit";
  for (const a in global.current_l.sector)
    if (!scanbyid(sectors, global.current_l.sector[a].id)) {
      sectors.push(global.current_l.sector[a]);
      global.current_l.sector[a].onEnter();
      activateEffectors(global.current_l.sector[a].effectors);
    }
  global.current_l.onEnter();
  rfeff(global.current_l);
  if (global.flags.btl === false) {
    global.current_m = creature.default;
    global.current_m.eff = [];
    empty(dom.d101m);
    dom.d5_1_1m.update();
    update_m();
  }
}

function giveFurniture(frt, l, show) {
  const frn = l === true ? copy(frt) : frt;
  if (show !== false)
    msg(
      i18n.t("runtime.ui.interface.dialogue.furniture_acquired", {
        furniture: frt.name,
      }),
      "yellow",
      frt,
      9,
    );
  if (scanbyid(furn, frn.id)) frn.data.amount++;
  else {
    furn.push(frn);
    frn.data.amount++;
  }
  frn.onGive();
  if (global.wdwidx === 1) {
    empty(dom.ch_1h);
    for (const a in furn) renderFurniture(furn[a]);
  }
  let v = 0;
  for (const a in furn)
    if (furn[a].v) {
      if (furn[a].multv) v += furn[a].v * furn[a].amount;
      else v += furn[a].v;
    }
  if (dom.flsthdrbb) dom.flsthdrbb.innerHTML = v;
  return frn;
}

function activatef(f) {
  if (!f.active) {
    f.activate();
    f.active = true;
  }
}

function deactivatef(f) {
  if (f.active) {
    f.deactivate();
    f.active = false;
  }
}

global._preig = addElement(document.body, "img");
global._preig.src = "ctst.png"; //global._preig.crossOrigin = "Anonymous"; global._preig.src='http://127.0.0.1:8887/ctst.png';
global._preic = addElement(document.body, "canvas");
global._preic_tmain = global._preic.getContext("2d");
global._preic2 = addElement(document.body, "canvas");
global._preic2_tmain = global._preic2.getContext("2d");
global._preic2.width = 512;
global._preic2.height = 512;
global._preig.onload = function () {
  global._preic_tmain.drawImage(global._preig, 0, 0);
  global._preic2_tmain.imageSmoothingEnabled = false;
  global._preic2_tmain.drawImage(global._preig, 0, 0, 400, 400);
};
document.body.removeChild(global._preig);
document.body.removeChild(global._preic);
document.body.removeChild(global._preic2);

function icon(root, x, y, sx, sy, sz) {
  //sz=2
  if (window.location.pathname.length === 1) {
    sx = sx || 16;
    sy = sy || 16;
    var div = addElement(root, "canvas");
    div.width = sx;
    div.height = sy;
    const data = global._preic_tmain.getImageData(
      x * sx - sx,
      y * sy - sy,
      sx,
      sy,
    );
    div.getContext("2d").putImageData(data, 0, 0);
    //    let temp = addElement(root,'canvas'); temp.width=sx;temp.height=sy;
    //    let data = global._preic_tmain.getImageData(x*sx-sx,y*sy-sy,sx,sy);
    //    temp.getContext('2d').putImageData(data,0,0);
    //    var div = addElement(root,'canvas'); div.width=sx*sz;div.height=sy*sz;
    //    div.getContext('2d').imageSmoothingEnabled=false;
    //    div.getContext('2d').drawImage(temp,0,0,sx,sy,0,0,sx*sz,sy*sz);
  } else div = addElement(root, "span");
  return div;
}
