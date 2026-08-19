// Hover descriptions: the panel that follows the pointer, what it says about an item,
// an effect or a creature, and the helper every caller attaches it with.
//
// Concatenated BEFORE js/ui/interface.js, which is the one ordering constraint in this
// file. addDesc is called twenty-six times while the interface is being built, and the
// two label tables below are `const` -- a function declaration hoists across the whole
// concatenated scope but a const does not, so a const read from an earlier file's
// definition-time code is a ReferenceError. Everything else here runs when the pointer
// moves, so it does not care where it sits.
//
// positionDescription reads global.dscr, which js/ui/interface.js creates. That is a
// run-time read and therefore fine.

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

// What a piece of equipment does beyond its three stats. The tooltip listed STR,
// AGL, INT and SPD and stopped there, so every resistance in the game was invisible:
// the Wolf Mask has always given twenty points of fire protection and read as though
// it were decoration, and the shields' class values -- the whole reason one shield
// differs from another -- were never shown at all. Nothing here changes a number; it
// says out loud what the numbers already were.
//
// Three arrays are involved and they mean different things:
//   aff  on a shield or armour is what IT resists, by element
//   cls  is what it resists by the attacker's weapon class
//   caff is a resistance it grants the player directly, which is how the masks work
const elementLabels = [
  "ui.elements.physical",
  "ui.elements.air",
  "ui.elements.earth",
  "ui.elements.fire",
  "ui.elements.water",
  "ui.elements.light",
  "ui.elements.dark",
];
const damageClassLabels = [
  "ui.damageClasses.edge",
  "ui.damageClasses.pierce",
  "ui.damageClasses.blunt",
];

function effectLine(label, value) {
  const colour = value > 0 ? "lime" : "red";
  const sign = value > 0 ? "+" : "";
  return i18n.t("ui.itemDescription.stat", {
    stat: label,
    value: "<span style='color:" + colour + "'>" + sign + value + "</span><br>",
  });
}

function equipmentEffectLines(what) {
  // Bound at call time rather than at load, so the list follows a locale change.
  // check-i18n wants a spelled-out literal in every i18n.t call, which is why the
  // keys are enumerated above and read back by index here.
  const elements = elementLabels.map((key) => i18n.t(key));
  const classes = damageClassLabels.map((key) => i18n.t(key));
  let out = "";
  for (let i = 0; i < elements.length; i++) {
    const own = (what.aff && what.aff[i]) || 0;
    const granted = (what.caff && what.caff[i]) || 0;
    const total = own + granted;
    if (total !== 0) out += effectLine(elements[i], total);
  }
  for (let i = 0; i < classes.length; i++) {
    const value = (what.cls && what.cls[i]) || 0;
    if (value !== 0) out += effectLine(classes[i], value);
  }
  return out;
}

function dscr(c, what, type, ttl, dsc, id) {
  id = id || 0;
  global.dscr.style.display = "";
  empty(global.dscr);
  if (!type || type === 1) {
    this.label = addElement(global.dscr, "div", "d_l");
    this.label.innerHTML = what.name + sharpenSuffix(what);
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
        // Sharpened strength, and what the sharpening is adding, shown separately so
        // the work the player paid for is legible rather than folded into one number.
        const sharpened = Math.round(weaponPower(what) * 10) / 10;
        if (what.str > 0)
          this.text.innerHTML += i18n.t("ui.itemDescription.stat", {
            stat: "STR",
            value:
              "<span style='color:lime'> +" +
              sharpened +
              "</span>" +
              (sharpened > what.str
                ? " <small style='color:#8fe3ff'>(" +
                  what.str +
                  " +" +
                  Math.round((sharpened - what.str) * 10) / 10 +
                  ")</small>"
                : "") +
              "<br>",
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
      this.text.innerHTML += equipmentEffectLines(what);

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
        const killLine = () => {
          let line = i18n.t("ui.itemDescription.kills", {
            kills: col(what.data.kills, "yellow"),
          });
          const rank = weaponKillRank(what);
          if (rank > 0)
            line +=
              "<br>" +
              i18n.t("ui.itemDescription.killRank", {
                rank: col(killRankNumeral(rank), "gold"),
                bonus: col("+" + Math.round(rank * 5) + "%", "lime"),
              });
          const next = weaponNextKillRank(what);
          if (next !== null)
            line +=
              "<br>" +
              i18n.t("ui.itemDescription.killRankNext", {
                remaining: col(next - what.data.kills, "yellow"),
              });
          return line;
        };
        sp.innerHTML = killLine();
        clearInterval(timers.wpnkilsch);
        timers.wpnkilsch = setInterval(function () {
          sp.innerHTML = killLine();
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
