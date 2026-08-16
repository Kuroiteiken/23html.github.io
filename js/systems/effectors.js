///////////////////////////////////////////
//EFFECTORS
///////////////////////////////////////////
function Effector() {
  this.id = 0;
  this.x = "@";
  this.c = "white";
  this.active = false;
  this.activate = function () {};
  this.deactivate = function () {};
  this.use = function () {};
}

effector.dark = new Effector();
effector.dark.activate = function () {
  global.flags.isdark = true;
};
effector.dark.deactivate = function () {
  global.flags.isdark = false;
};
effector.dark.x = "闇";
effector.dark.c = "darkgrey";

effector.shop = new Effector();
effector.shop.activate = function () {
  global.flags.isshop = true;
};
effector.shop.deactivate = function () {
  global.flags.isshop = false;
};
effector.shop.x = "$";
effector.shop.c = "gold";

function activateEffectors(e) {
  if (!e) return;
  for (const a in e)
    if (!e[a].e.active && (!e[a].c || e[a].c() === true)) {
      e[a].e.activate();
      e[a].e.active = true;
    }
}

function deactivateEffectors(e) {
  if (!e) return;
  for (const a in e)
    if (e[a].e.active) {
      e[a].e.deactivate();
      e[a].e.active = false;
    }
}

function runEffectors(e) {
  if (!e) return;
  for (const a in e) e[a].e.use();
}
