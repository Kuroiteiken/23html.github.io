/////plans/////
function Plan() {
  this.id = 0;
  this.f = function () {};
  this.data = {};
  this.destroy = function () {
    plans.splice(plans.indexOf(this), 1);
  };
}

planner.test = new Plan();
planner.test.id = 1;
planner.test.data = { date: 42 };
planner.test.f = function () {
  if (time.minute >= this.data.date) {
    msg("done");
    this.destroy();
  }
};

planner.chkrot = new Plan();
planner.chkrot.id = 1;
planner.chkrot.data = { items: [] };
planner.chkrot.f = function () {
  for (const a in planner.chkrot.data.items) {
    const itm = planner.chkrot.data.items[a];
    let wmod = 1;
    if (getSeason() === 2) wmod = 0.5;
    else if (getSeason() === 4) wmod = 2.5;
    itm.data.rottil += randf(itm.rot[0] / wmod, itm.rot[1] / wmod);
    if (itm.data.rottil >= 1) {
      const am = (itm.amount * randf(itm.rot[2], itm.rot[3]) + 1) << 0;
      itm.data.rottil--;
      itm.amount -= am;
      if (itm.stype === global.sm) updateInv(global.sinv.indexOf(itm));
      else if (global.sm === 1) updateInv(inv.indexOf(itm));
      if (itm.amount <= 0) {
        planner.chkrot.data.items.splice(
          planner.chkrot.data.items.indexOf(itm),
        );
        removeItem(itm);
      }
      msg(
        'Your <span style="color:cyan">x' +
          am +
          '</span> <span style="color: orange">' +
          itm.name +
          "</span> " +
          select(["rotted away", "went bad", "spoiled"]) +
          "!",
        "yellow",
        null,
        null,
        "green",
      );
      if (itm.onChange) itm.onChange(am);
    }
  }
};

planner.imorph = new Plan();
planner.imorph.id = 1;
planner.imorph.data = { items: [] };
planner.imorph.f = function () {
  for (const a in planner.imorph.data.items) {
    planner.imorph.data.items[a].alttype =
      planner.imorph.data.items[a].alttype || 1;
    switch (planner.imorph.data.items[a].alttype) {
      case 1:
        const itm = planner.imorph.data.items[a];
        let wmod = 1;
        switch (getSeason()) {
          case 2:
            wmod = 0.5;
            break;
          case 4:
            wmod = 2.5;
            break;
        }
        itm.data.rottil += randf(itm.rot[0] / wmod, itm.rot[1] / wmod);
        if (itm.data.rottil >= 1) {
          const am = (itm.amount * randf(itm.rot[2], itm.rot[3]) + 1) << 0;
          itm.data.rottil--;
          reduce(itm, am);
          if (itm.amount <= 0)
            planner.imorph.data.items.splice(
              planner.imorph.data.items.indexOf(itm),
            );
          msg(
            'Your <span style="color:cyan">x' +
              am +
              '</span> <span style="color: orange">' +
              itm.name +
              "</span> " +
              select(["rotted away", "went bad", "spoiled"]) +
              "!",
            "yellow",
            null,
            null,
            "green",
          );
          if (itm.onChange) itm.onChange(am);
        }
        break;
    }
  }
};
addPlan(planner.imorph);

planner.cchk = new Plan();
planner.cchk.id = 1;
planner.cchk.f = function () {
  for (const a in container.home_strg.c) {
    if (container.home_strg.c[a].item.rot) {
      const itm = container.home_strg.c[a].item;
      const data = container.home_strg.c[a].data;
      let wmod = 1;
      switch (getSeason()) {
        case 2:
          wmod = 0.25;
          break;
        case 4:
          wmod = 1.25;
          break;
      }
      data.rottil += randf(itm.rot[0] / wmod, itm.rot[1] / wmod);
      if (data.rottil >= 1) {
        const am = (itm.amount * randf(itm.rot[2], itm.rot[3]) + 1) << 0;
        data.rottil--;
        container.home_strg.c[a].am -= am;
        if (container.home_strg.c[a].am <= 0)
          removeFromContainer(container.home_strg, container.home_strg.c[a]);
        if (itm.onChange) {
          const nitm = itm.onChange(am, true);
          let citm = false;
          for (const b in container.home_strg.c)
            if (container.home_strg.c[b].item.id === nitm[0].id) {
              citm = container.home_strg.c[b];
              break;
            }
          if (citm) citm.am += nitm[1];
          else addToContainer(container.home_strg, nitm[0], nitm[1]);
        }
        iftrunkopenc();
      }
    }
  }
};
addPlan(planner.cchk);

planner.itmwear = new Plan();
planner.itmwear.data = { items: [] };
planner.itmwear.f = function () {
  for (const a in planner.itmwear.data.items) {
    const itm = planner.itmwear.data.items[a];
    if (itm.dp - itm.degrade < 0) itm.dp = 0;
    else itm.dp -= itm.degrade;
    if (itm.dp <= 0) {
      itm.onDegrade();
      planner.itmwear.data.items.splice(
        planner.itmwear.data.items.indexOf(itm),
      );
      removeItem(itm);
    }
  }
};
addPlan(planner.itmwear);

planner.djfood = new Plan();
planner.djfood.id = 1;
planner.djfood.f = function () {
  if (getDay(1) === "Sunday") global.flags.djmlet = true;
};
addPlan(planner.djfood);

planner.areafillw = new Plan();
planner.areafillw.id = 2;
planner.areafillw.f = function () {
  area.hmbsmnt.size += rand(5, 15);
};
addPlan(planner.areafillw);

planner.zrespawn = new Plan();
planner.zrespawn.id = 1;
planner.zrespawn.f = function () {
  if (random() <= 0.03 && global.flags.catget) {
    const things = [
      { t: item.dmice1, c: 0.25 },
      { t: item.dbdc1, c: 0.25 },
      { t: item.d6, c: 0.05 },
      { t: item.mcps, c: 0.2 },
      { t: item.pcn, c: 0.2 },
      { t: item.cp, c: 0.4 },
    ];
    for (const a in things)
      if (random() <= things[a].c) sector.home.data.ctlt.push(things[a].t.id);
  }
};
addPlan(planner.zrespawn);

function addElement(parent_element, elem, id, cls) {
  const newelem = document.createElement(elem);
  if (id) newelem.id = id;
  if (cls) newelem.className = cls;
  parent_element.appendChild(newelem);
  return newelem;
}

function deepCopy(o) {
  let copy = o,
    k;
  if (o && typeof o === "object") {
    copy = Object.prototype.toString.call(o) === "[object Array]" ? [] : {};
    for (const k in o) {
      copy[k] = deepCopy(o[k]);
    }
  }
  return copy;
}

function copy(o) {
  const res = {};
  for (const a in o) res[a] = o[a];
  return res;
}

function empty(dom) {
  while (dom.lastChild) {
    dom.removeChild(dom.lastChild);
  }
}

test.maps = {};
test.maps.cellsize = 20;
test.maps.mapdata = [];
test.maps.mapdata[0] = {};
test.maps.mapdata[0].data = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 2, 3, 1, 1, 3, 2, 0, 1],
  [1, 2, 3, 1, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 1, 0, 1, 1, 1, 2, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 3, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
];
test.maps.mapdata[0].c = ["white", "grey", "red", "ghostwhite"];
test.maps.mapdata[0].d = ["corridor", "wall", "secret", "secret enter"];
