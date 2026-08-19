// The panels that draw a list of things and what each one costs: the smith's bench,
// the general store's counter, what the player is selling, the furniture on offer, and
// the two sides of a storage trunk.
//
// Grouped by what they are rather than by which shop they belong to -- every function
// here builds one row, reads the item again when the row is clicked rather than trusting
// what was drawn, and leaves the arithmetic to the crafting and container systems. The
// refactor plan called this file shops.js; it is panels.js because the furniture list
// sits in the middle of the same block and does the same job, and splitting it out would
// have been a cut made to match a name.
//
// Split out of js/ui/interface.js and concatenated after it. Nothing here is called
// while the interface is being built -- a panel is drawn when the player opens it.

// One line of the sharpening list. A failed attempt takes the fee and changes nothing:
// the weapon is never destroyed and never set back, because losing a blade to a dice
// roll at a shop belongs in a different game.
function rendersharpenitem(root, line) {
  const row = addElement(root, "div", "bst_entrh", "bst_entr");
  row.style.backgroundColor = "rgb(10,30,54)";
  addDesc(row, line.obj);
  const left = addElement(row, "div", null, "bst_entr1");
  left.style.width = "62%";
  left.innerHTML =
    line.obj.name +
    sharpenSuffix(line.obj) +
    " <small style='color:grey'>" +
    Math.round(sharpenChance(line.obj) * 100) +
    "%</small>";
  const right = addElement(row, "div", null, "bst_entr2");
  right.style.width = "36%";
  right.style.textAlign = "right";
  const cost = sharpenCost(line.obj);
  right.innerHTML = formatw(cost);
  if (you.wealth < cost) {
    right.style.color = "red";
    row.style.backgroundColor = "rgb(68,26,38)";
  }
  row.addEventListener("click", () => {
    const due = sharpenCost(line.obj);
    if (you.wealth < due) {
      msg(i18n.t("ui.smith.cannotAfford"), "red");
      return;
    }
    spend(due);
    if (random() < sharpenChance(line.obj)) {
      line.obj.data.plus = sharpenLevel(line.obj) + 1;
      msg(
        i18n.t("ui.smith.sharpened", {
          item: line.obj.name,
          plus: line.obj.data.plus,
        }),
        "lime",
      );
    } else {
      msg(i18n.t("ui.smith.sharpenFailed", { item: line.obj.name }), "orange");
    }
    you.stat_r();
    isort(global.sm);
    openSmithBench(1);
  });
  return row;
}

// One line of the smith's bench: what is worn, and what putting it right costs.
// Re-reads the item when clicked rather than trusting what was drawn, because
// durability keeps falling while the panel is open if a fight is running.
// Open the smith's bench and leave a way out of it. chs_spec begins with clr_chs(),
// which empties the choice column -- so the Return choice has to be added after the
// panel, every time, and both the scene and the rows that rebuild it need the same
// thing. Rebuilding the whole scene instead put the player back at his greeting after
// every repair.
function openSmithBench(mode) {
  global.smithmode = mode;
  chs_spec(7, null);
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
    "",
    "",
    null,
    null,
    null,
    true,
  ).addEventListener("click", () => {
    global.smithmode = 0;
    smove(chss.smith, false);
  });
}

function renderrepairitem(root, line) {
  const row = addElement(root, "div", "bst_entrh", "bst_entr");
  row.style.backgroundColor = "rgb(10,30,54)";
  addDesc(row, line.obj);
  const left = addElement(row, "div", null, "bst_entr1");
  left.style.width = "70%";
  left.innerHTML =
    line.obj.name +
    " <small style='color:grey'>" +
    ((line.obj.dp * 10) << 0) / 10 +
    "/" +
    line.obj.dpmax +
    "</small>" +
    (line.worn ? " <small style='color:#f80'>E</small>" : "");
  const right = addElement(row, "div", null, "bst_entr2");
  right.style.width = "28%";
  right.style.textAlign = "right";
  const cost = repairCost(line.obj);
  right.innerHTML = formatw(cost);
  if (you.wealth < cost) {
    right.style.color = "red";
    row.style.backgroundColor = "rgb(68,26,38)";
  }
  row.addEventListener("click", () => {
    const due = repairCost(line.obj);
    if (due <= 0 || you.wealth < due) {
      msg(i18n.t("ui.smith.cannotAfford"), "red");
      return;
    }
    spend(due);
    line.obj.dp = line.obj.dpmax;
    msg(i18n.t("ui.smith.repaired", { item: line.obj.name }), "lime");
    you.stat_r();
    openSmithBench(0);
  });
  return row;
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
