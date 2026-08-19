// Startup and persistence. Declares the global registries every other module
// writes into, holds the game version, and implements save serialization,
// restore, and the boot sequence. This file is concatenated first by
// scripts/build.js, so the globals below exist before any data, system, world,
// or interface module runs.

var dom = {};
var global = {};
var listen = {};
var w_manager = {};
var creature = {};
var offline = {};
var effect = {};
var wpn = {};
var eqp = {};
var acc = {};
var sld = {};
var item = {};
var itemgroup = [item, wpn, eqp, sld, acc];
var rcp = {};
var area = {};
var timers = {};
var chss = {};
var ttl = {};
var skl = {};
var abl = {};
var furniture = {};
var vendor = {};
var quest = {};
var act = {};
var test = {};
var callback = {};
var effector = {};
var planner = {};
plans = [[], [], []];
var sector = {};
var sectors = [];
var check = {};
var checksd = [];
var inv = [];
var furn = [];
var qsts = [];
var dar = [[], [], [], [], []];
you = {};
var home = {};
eqp.dummy = {};
var container = {};
var mastery = {};
const YEAR = 518400;
const MONTH = 43200;
const DAY = 1440;
const WEEK = 10080;
const HOUR = 60;
const SILVER = 100;
const GOLD = 10000;
const tempt = new Date();
global.home_loc = 111;
global.lst_sve = "?";
global.ver = 478;
// The point release within v478. Raised on every deploy that changes something a
// player would notice, so a returning player is told about the four small updates they
// missed rather than only about the last big one.
global.subver = 30;
global.sm = 1;
global.rm = 0;
global.bg_g = global.bg_r = global.bg_b = 255;
global.s_l = 0;
global.spnew = 0;
global.vsnew = 10;
global.uid = 1;
global.wdwidx = 0;
global.menuo = 0;
global.lastmsgc = 0;
global.sinv = [];
global.srcp = [];
global.drdata = {};
global.lw_op = 0;
global.zone_a_p = [];
global.rec_d = [];
global.e_e = [];
global.e_em = [];
global.titles = [];
global.titlese = [];
var acts = [];
global.tstcr = [];
global.atkdftm = [-1, -1, -1];
global.atkdfty = [-1, -1];
global.atkdftydt = {};
global.current_m;
global.current_z;
global.current_l;
global.stat = {
  tick: 0,
  akills: 0,
  fooda: 0,
  foodb: 0,
  foodal: 0,
  foodt: 0,
  ftried: 0,
  moneyg: 0,
  die_p: 0,
  die_p_t: 0,
  ivtntdj: 0,
  athme: 0,
  athmec: 0,
  slvs: 0,
  lgtstk: 0,
  moneysp: 0,
  shppnt: 0,
  exptotl: 0,
  seed1: (((Math.random() * 7e7) << 7) % 7) & 7,
  igtttl: 0,
  msts: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  msks: [0, 0, 0, 0, 0, 0, 0],
  sttime:
    tempt.getFullYear() +
    "/" +
    (tempt.getMonth() + 1) +
    "/" +
    tempt.getDate() +
    " " +
    tempt.getHours() +
    ":" +
    (tempt.getMinutes() >= 10 ? tempt.getMinutes() : "0" + tempt.getMinutes()) +
    ":" +
    (tempt.getSeconds() > 10 ? tempt.getSeconds() : "0" + tempt.getSeconds()),
  buyt: 0,
  rdttl: 0,
  dsst: 0,
  thrt: 0,
  crftt: 0,
  deadt: 0,
  smovet: 0,
  timeslp: 0,
  misst: 0,
  dodgt: 0,
  potnst: 0,
  medst: 0,
  plst: 0,
  jcom: 0,
  qstc: 0,
  popt: 0,
  dsct: 0,
  bloodt: 0,
  rdgtttl: 0,
  cat_c: 0,
  dmgdt: 0,
  dmgrt: 0,
  onesht: 0,
  pts: 0,
  gsvs: 0,
  hbhbsld: 0,
  wsnburst: 50,
  wsnrest: 50,
  indkill: 0,
  coldnt: 0,
  lastver: global.ver,
};
global.hit_a = 0;
global.hit_b = 0;
global.timescale = 1;
global.keytarget;
global.offline_evil_index = 1;
global.flags = {
  btl: false,
  m_freeze: false,
  msd: false,
  m_blh: false,
  crti: false,
  to_pause: false,
  civil: true,
  sleepmode: false,
  nmare: false,
  loadstate: false,
  eshake: false,
  msgtm: false,
  grd_s: true,
  inside: true,
  israin: false,
  issnow: false,
  iscold: false,
  bstu: false,
  blken: false,
  rtcrutch: false,
  savestate: false,
  expatv: false,
  gameone: false,
  tmmode: 1,
  ssngaijin: true,
  rptbncgt: false,
};
global.spirits = 100;
global.bestiary = [{ a: false }];
// Area ids the player has actually stood in, in the order they first did. Kept on
// `global` and written into the `a1` globals object, which is a JSON blob rather than
// a positional segment, so an older save yields undefined and the list simply starts
// empty rather than reading someone else's numbers. Ids are stored rather than keys
// because area ids are stable while the registry's insertion order is the thing the
// save format is already fragile about.
global.regions = [];
global.shortcuts = [];
global.msgs_max = 36;
global.autosave_seconds = 15;
global.locale = i18n.currentLocale;
global.text = {};
global.text.nt = [
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "Oc",
  "No",
  "De",
  "Un",
  "DDe",
  "TDe",
  "QaDe",
  "QiDe",
  "Lc",
];
global.fps = 1;
global.text.wecs = [
  ["grey", "inherit"],
  ["white", "inherit"],
  ["cyan", "cyan"],
  ["lime", "green"],
  ["yellow", "red"],
  ["orange", "orange"],
  ["purple", "white"],
];
global.text.lunarp = i18n.get("gameText.lunarp");
global.text.eranks = [
  "???",
  "--G",
  "-G",
  "G",
  "G+",
  "-F",
  "F",
  "F+",
  "-E",
  "E",
  "E+",
  "-D",
  "D",
  "D+",
  "-C",
  "C",
  "C+",
  "-B",
  "B",
  "B+",
  "--A",
  "-A",
  "A",
  "A+",
  "A++",
  "--S",
  "-S",
  "S",
  "S+",
  "S++",
  "--SS",
  "-SS",
  "SS",
  "SS+",
  "SS++",
  "--SSS",
  "-SSS",
  "SSS",
  "SSS+",
  "SSS++",
];
dom.dseparator = '<div class="dseparator">　</div>';
dom.coincopper = '<small style="color:rgb(255, 116, 63)">●</small>';
dom.coinsilver = '<small style="color:rgb(192, 192, 192)">●</small>';
dom.coingold = '<small style="color:rgb(255, 215, 0)">●</small>';

let viewportFitFrame;

// Breathing room left between the game's bottom row and the save bar below it.
const saveBarGap = 6;

function fitGameToViewport() {
  const layoutWidth = 1280;
  const layoutHeight = 780;
  const viewportPadding = 16;
  const widthScale = (window.innerWidth - viewportPadding) / layoutWidth;
  let heightScale = (window.innerHeight - viewportPadding) / layoutHeight;

  // The save bar is fixed to the viewport's bottom edge rather than flowing after
  // the game, so on a short window the game's own bottom row of tabs ends up
  // touching it. Reserving the bar's height against the nominal layout height
  // overcorrects, because the game's panels stop well short of 780: both slacks
  // then stack into one wide band. Solving against where the content actually ends
  // leaves a fixed, small gap instead, and costs a few pixels of scale rather than
  // the bar's whole height. Both are scaled by the same body zoom, so
  // s * (content + bar) = viewport - gap.
  if (dom.sl && dom.ctrmg) {
    const contentHeight = dom.ctrmg.offsetTop + dom.ctrmg.offsetHeight;
    const barHeight = dom.sl.offsetHeight;
    heightScale = Math.min(
      heightScale,
      (window.innerHeight - saveBarGap) / (contentHeight + barHeight),
    );
  }

  const scale = Math.max(0.1, Math.min(1, widthScale, heightScale));

  document.body.style.zoom = String(scale);
  document.documentElement.dataset.uiScale = scale.toFixed(4);
}

function scheduleGameViewportFit() {
  cancelAnimationFrame(viewportFitFrame);
  viewportFitFrame = requestAnimationFrame(fitGameToViewport);
}

function showStartupError(error) {
  console.error("The saved game could not be loaded.", error);
  if (!dom.error) {
    dom.error = addElement(document.body, "div");
    dom.error.innerHTML = i18n.t(
      "runtime.core.bootstrap.interface.saved_game_load_failed_72860aef",
    );
    dom.error.style.position = "absolute";
    dom.error.style.width = "100%";
    dom.error.style.color = "red";
    dom.error.style.fontSize = "2em";
    dom.error.style.lineHeight = "normal";
    dom.error.style.textAlign = "center";
    dom.error.style.zIndex = 9999;
  }
  dom.error.id = "startup-error";
  dom.error.style.opacity = 1;
}

// The build the player last opened, kept beside the other display preferences
// rather than in the save, so it survives a player who never presses Save and is
// not lost when a save is deleted.
const seenVersionKey = "proto23.seenversion";

// One comparable number from the two. A thousand point releases in a major is more
// than this will ever need, and it keeps the ordering an integer ordering -- as a
// decimal, 478.10 would sort below 478.9.
function versionCode(major, minor) {
  return major * 1000 + (minor || 0);
}

function currentVersionCode() {
  return versionCode(global.ver, global.subver);
}

// How a version reads to a player.
function versionLabel(major, minor) {
  return minor ? major + "." + minor : String(major);
}

function readSeenVersion() {
  try {
    const stored = Number(window.localStorage.getItem(seenVersionKey));
    if (!Number.isFinite(stored) || stored <= 0) return 0;
    // Values written before point releases existed are bare majors -- 477, not
    // 477000. Anything under a thousand is one of those and is promoted, so an
    // existing player is not told about every release since the beginning.
    return stored < 1000 ? versionCode(stored, 0) : stored;
  } catch (error) {
    return 0;
  }
}

function storeSeenVersion(version) {
  try {
    window.localStorage.setItem(seenVersionKey, String(version));
  } catch (error) {
    // Blocked or full storage must never keep the game from starting.
  }
}

// Tells a returning player what changed since the build they last opened. The
// stored key is the authority; the save's own version is the fallback for a
// player who upgraded before the key existed. A first-time player has neither,
// and gets nothing.
function announceNewVersion() {
  const from =
    readSeenVersion() ||
    (global.save_ver ? versionCode(global.save_ver, 0) : 0);
  storeSeenVersion(currentVersionCode());
  if (!from || from >= currentVersionCode()) return false;
  return showReleaseNotes(from);
}

// The boot screen's stages. The loader sets the first two while it is awaiting
// fetches, where the browser gets a paint between each; these last two are set from
// inside the bundle's own synchronous run, so on a fast machine they may never be
// painted before clearLoadingScreen fades the screen out. They are still worth
// setting: a slow machine, a large save, or a migration is exactly when the browser
// does find a frame, and that is exactly when the player is left wondering.
function bootPhase(phase) {
  // The save-format behaviour tests lift migrateSave out of this file and run it in
  // a plain sandbox with no DOM, which is the point of them -- they exercise the real
  // migrations against real numbers. A display helper must not be what stops that.
  if (typeof document === "undefined") return;
  document.documentElement.dataset.bootPhase = phase;
}

function startGame() {
  fitGameToViewport();
  bootPhase("restore");
  try {
    load();
    announceNewVersion();
  } catch (error) {
    showStartupError(error);
    clearLoadingScreen();
  }
  scheduleGameViewportFit();
}

window.addEventListener("resize", scheduleGameViewportFit);

if (document.readyState === "complete") queueMicrotask(startGame);
else window.addEventListener("load", startGame, { once: true });

function save(lvr) {
  const storage = window.localStorage;
  global.flags.savestate = true;
  global.stat.gsvs++;
  let str = "";
  const a = new Date();
  global.lst_sve =
    a.getFullYear() +
    "/" +
    (a.getMonth() + 1) +
    "/" +
    a.getDate() +
    " " +
    a.getHours() +
    ":" +
    (a.getMinutes() >= 10 ? a.getMinutes() : "0" + a.getMinutes()) +
    ":" +
    (a.getSeconds() >= 10 ? a.getSeconds() : "0" + a.getSeconds());
  dom.sl_extra.innerHTML = i18n.t("ui.save.lastSave", {
    date: global.lst_sve,
  });
  const o = [];
  for (const obj in you.eqp) {
    o[obj] = you.eqp[obj];
    unequip(you.eqp[obj], { save: true });
  }
  you.stat_r();
  const freezete = global.flags.m_freeze;
  if (inSector(sector.home)) {
    for (const a in furn) deactivatef(furn[a]);
  }
  global.flags.m_freeze = true;
  for (const a in you.eff) if (you.eff[a].type === 5) you.eff[a].onRemove();
  const yu = {
    name: you.name,
    title: you.title.id,
    lvl: you.lvl,
    exp: you.exp,
    exp_t: you.exp_t,
    skxp: you.skxp,
    sat: you.sat,
    satmax: you.satmax,
    sat_r: you.sat_r,
    hp: you.hp,
    hpmax: you.hpmax,
    hp_r: you.hp_r,
    str: you.str,
    str_r: you.str_r,
    agl: you.agl,
    agl_r: you.agl_r,
    int: you.int,
    int_r: you.int_r,
    spd: you.spd,
    spd_r: you.spd_r,
    luck: you.luck,
    stat_p: you.stat_p,
    wealth: you.wealth,
    crt: you.crt,
    res: you.res,
    mods: you.mods,
    stra: you.stra,
    strm: you.strm,
    inta: you.inta,
    intm: you.intm,
    agla: you.agla,
    aglm: you.aglm,
    spda: you.spda,
    spdm: you.spdm,
    hpa: you.hpa,
    hpm: you.hpm,
    sata: you.sata,
    satm: you.satm,
    cls: you.cls,
    ccls: you.ccls,
    aff: you.aff,
    maff: you.maff,
    caff: you.caff,
    cmaff: you.cmaff,
    karma: you.karma,
    ki: you.ki,
  };
  global.flags.m_freeze = true;
  global.current_a.deactivate();
  dom.ct_bt3.style.backgroundColor = "inherit";
  for (const a in you.eff) if (you.eff[a].type === 5) you.eff[a].onGive();
  str += JSON.stringify(yu);
  str += "|";
  const a4 = [];
  for (const obj in you.eff)
    if (!!you.eff[obj].id) {
      var pw;
      !!you.eff[obj].power ? (pw = you.eff[obj].power) : (pw = 1);
      a4[obj] = { a: you.eff[obj].id, b: you.eff[obj].duration, c: pw };
    }
  global.flags.m_freeze = false;
  str += JSON.stringify(a4);
  str += "|";
  const a6 = [];
  for (const obj in you.skls) {
    a6[obj] = { id: you.skls[obj].id, lvl: you.skls[obj].lvl, mst: [] };
    for (const m in you.skls[obj].mlstn)
      a6[obj].mst[m] = you.skls[obj].mlstn[m].g;
  }
  str += JSON.stringify(a6);
  str += "|";
  const a7 = [];
  for (const obj in skl) a7.push([skl[obj].exp, skl[obj].p]);
  str += JSON.stringify(a7);
  str += "|";
  var datasi = [];
  let nindxdt = 0;
  for (const obj in item)
    if (item[obj].data.tried === true) datasi[nindxdt++] = item[obj].id;
  var datare = [];
  let nindxat = 0;
  for (const obj in item)
    if (item[obj].data.finished === true) datare[nindxat++] = item[obj].id;
  // `a1` is a JSON object rather than a positional segment, so new fields are
  // safe to add: an older save simply yields undefined for them.
  global.stat.lastver = global.ver;
  const a1 = {
    v: global.ver,
    // Mastery levels were never saved, so every level the player bought was
    // lost on reload. Only the level is stored: the stat bonuses `onlevel`
    // applies are already part of the saved additive stats, so replaying them
    // here would double them.
    mastery: Object.fromEntries(
      Object.entries(mastery)
        .filter(([, entry]) => entry.data.lvl > 0)
        .map(([id, entry]) => [id, entry.data.lvl]),
    ),
    // What the player has worked out about the world, as unlocked entry ids.
    lore: global.lore,
    rgn: global.regions,
    uid: global.uid,
    jj: global.stat,
    x: global.current_z.id,
    a: global.rm,
    b: global.sm,
    e: global.flags,
    f: global.spirits,
    g: global.msgs_max,
    i: global.lst_loc,
    j: time.minute,
    k: w_manager.duration,
    l: w_manager.curr.id,
    m: global.lst_sve,
    n: global.bg_r,
    o: global.bg_g,
    p: global.bg_b,
    q: global.bestiary,
    r: global.timehold,
    r2: global.timewold,
    datas: datasi,
    u: global.timescale,
    datar: datare,
    z: global.offline_evil_index,
    drdata: global.drdata,
  };
  str += JSON.stringify(a1);
  str += "|";
  const a2 = [];
  for (const obj in global.rec_d)
    a2[obj] = { id: global.rec_d[obj].id, data: global.rec_d[obj].data };
  str += JSON.stringify(a2);
  str += "|";
  const a3 = [[], [], [], [], [], []];
  for (const obj in o) equip(o[obj], { save: true });
  you.stat_r();
  for (const obj in inv) {
    const expectedIndex = Math.max(
      0,
      Math.min(4, Math.floor(inv[obj].id / 10000)),
    );
    if (expectedIndex === 0) {
      a3[0].push({ id: inv[obj].id, am: inv[obj].amount, data: inv[obj].data });
    } else {
      a3[expectedIndex].push({
        id: inv[obj].id,
        dp: inv[obj].dp,
        toeq: true,
        data: inv[obj].data,
      });
      if (!scanbyuid(you.eqp, inv[obj].data.uid))
        a3[expectedIndex][a3[expectedIndex].length - 1].toeq = false;
    }
  }
  for (const a in item)
    if (item[a].save === true)
      a3[5].push({ item: item[a].id, data: item[a].data });
  str += JSON.stringify(a3);
  str += "|";
  const a5 = [];
  let xx = 0;
  for (const o in area) a5[xx++] = area[o].size;
  str += JSON.stringify(a5);
  str += "|";
  const a8 = dar;
  str += JSON.stringify(a8);
  str += "|";
  const a9 = [];
  for (const obj in furn) a9.push({ id: furn[obj].id, data: furn[obj].data });
  str += JSON.stringify(a9);
  str += "|";
  const a10 = {};
  const a11 = {};
  for (const obj in vendor) {
    const stock = [];
    for (let i = 0; i < vendor[obj].stock.length; i++) {
      stock[i] = [];
      stock[i][0] = vendor[obj].stock[i][0].id;
      stock[i][1] = vendor[obj].stock[i][1];
      stock[i][2] = vendor[obj].stock[i][2];
    }
    a10[obj] = { stock, data: vendor[obj].data };
  }
  str += JSON.stringify(a10);
  str += "|";
  const a12 = [];
  for (const a in global.titles) a12.push(global.titles[a].id); //for(let obj in ttl) if(ttl[obj].have===true) a12.push(ttl[obj].id);
  str += JSON.stringify(a12);
  str += "|";
  const a13 = {};
  for (const s in home) a13[s] = home[s].id;
  str += JSON.stringify(a13);
  str += "|";
  const a14 = [];
  for (const obj in qsts) a14.push({ id: qsts[obj].id, data: qsts[obj].data });
  str += JSON.stringify(a14);
  str += "|";
  const a15 = [];
  for (const obj in acts) a15.push({ id: acts[obj].id, data: acts[obj].data });
  str += JSON.stringify(a15);
  str += "|";
  const a17 = [];
  for (const obj in sector)
    a17.push({ id: sector[obj].id, data: sector[obj].data });
  str += JSON.stringify(a17);
  str += "|";
  const a18 = [];
  for (const obj in container) {
    const cont = [];
    for (const a in container[obj].c)
      cont.push({
        id: container[obj].c[a].item.id,
        data: container[obj].c[a].data,
        am: container[obj].c[a].am,
        dp: container[obj].c[a].dp,
      });
    a18.push({ id: container[obj].id, c: cont });
  }
  str += JSON.stringify(a18);
  str += "|";
  const a19 = [];
  for (const obj in chss)
    if (JSON.stringify(chss[obj].data) !== "{}")
      a19.push({ id: chss[obj].id, data: chss[obj].data });
  str += JSON.stringify(a19);
  str += "|savevalid|";
  const a20 = [];
  for (const a in ttl) if (ttl[a].tget) a20.push(ttl[a].id);
  str += JSON.stringify(a20);
  if (inSector(sector.home)) {
    for (const a in furn) activatef(furn[a]);
  }
  global.flags.m_freeze = true;
  global.current_a.activate();
  global.flags.m_freeze = freezete;
  if (global.flags.busy === true)
    dom.ct_bt3.style.backgroundColor = "darkslategray";
  str = utf8_to_b64(str);
  storage.setItem("v0.3", str);
  global.flags.savestate = false;
  if (!lvr)
    msg(i18n.t("runtime.core.bootstrap.dialogue.game_saved_2cb7f3fc"), "cyan");
  return str;
}

// The loading screen is markup in index.html and styled in css/game.css, so that it
// can paint in the first frame. It used to be built here, sixteen hundred lines into
// a bundle that is itself the slowest thing the page loads -- by the time these lines
// ran, everything the screen was meant to cover had already finished, and fade()
// removed it about fifty milliseconds later. These two lookups are all that is left:
// clearLoadingScreen still fades the same two elements out.
dom.loading = document.getElementById("loading-overlay");
dom.loadingt = document.getElementById("loading-text");

// The save is a positional format: pipe-separated segments with a sentinel at a
// fixed index. Segments 0 to 17 hold JSON, 18 is the sentinel, and 19 was added
// later so an older save may stop before it. A shifted or truncated segment used
// to restore silently as the wrong data, so the shape is checked before anything
// is applied.
const saveSentinelIndex = 18;
const saveSentinel = "savevalid";
const saveJsonSegmentCount = 18;

function describeSaveProblems(segments) {
  const problems = [];
  if (segments.length <= saveSentinelIndex)
    problems.push(
      `expected more than ${saveSentinelIndex} segments, found ${segments.length}`,
    );
  else if (segments[saveSentinelIndex] !== saveSentinel)
    problems.push(
      `segment ${saveSentinelIndex} should be "${saveSentinel}" but is "${segments[saveSentinelIndex]}"`,
    );
  for (let index = 0; index < saveJsonSegmentCount; index++) {
    if (index >= segments.length) break;
    try {
      JSON.parse(segments[index]);
    } catch (err) {
      problems.push(`segment ${index} is not valid JSON`);
    }
  }
  return problems;
}

// Migrations upgrade the parsed globals object of an older save. Each entry
// names the version it upgrades a save TO, so a save reporting a lower version
// runs every later migration in order. Add one here whenever a release changes
// what a field means, rather than guessing at load time.
const saveMigrations = [
  {
    to: 476,
    // Before v476 the idle satiation drain was a base 0.1 that applied with no
    // action running, and the actions panel could leak another 0.1 onto it per
    // run. Both are gone, so the only correct saved value is 0: save() unequips
    // before serializing and deactivates the current action, so equipment and
    // action contributions are re-derived on load and never stored.
    apply(save) {
      if (save.mods && typeof save.mods.sdrate === "number")
        save.mods.sdrate = 0;
    },
  },
  {
    to: 477,
    // v476 still charged the running cost onto mods.sdrate on start and
    // refunded it on stop. Earning a title that lowered mods.runerg mid-run
    // refunded less than it had charged, so a residue stuck to the stored rate
    // and grew with every run. The cost is derived from the action now, which
    // leaves 0 as the only correct stored value again.
    apply(save) {
      if (save.mods && typeof save.mods.sdrate === "number")
        save.mods.sdrate = 0;
    },
  },
  {
    to: 478,
    // v478 grants SPD every ten levels and LUCK every five. A character who
    // levelled before that existed has none of it, and the grants only fire on
    // future level-ups -- so a level 40 save would sit on SPD 1 forever while a
    // fresh character overtook it. This settles up once, to exactly the total the
    // character would have now if the grants had always been there.
    //
    // It is written as "top up to the total" rather than "add the total" so that
    // running it twice cannot double the grant, and so a character who earned some
    // of it legitimately is not paid for the same levels again.
    //
    // levelGrants and levelGrantTotal live in js/systems/simulation.js, which is
    // concatenated after this file. That is safe because this body only runs when a
    // save is loaded, long after the whole bundle has finished executing.
    apply(save) {
      const player = save.player;
      if (!player || typeof player.lvl !== "number") return;
      for (const grant of levelGrants) {
        if (typeof player[grant.stat] !== "number") continue;
        const owed = grant.base + levelGrantTotal(grant, player.lvl);
        if (player[grant.stat] < owed) player[grant.stat] = owed;
      }
      player.stat_r();
    },
  },
];

function migrateSave(globalsSegment, fromVersion) {
  // Say so on the boot screen. A migration is the one part of loading that can take
  // real time and that the player has a reason to care about, and until now it
  // announced itself to the console alone.
  bootPhase("update");
  let applied = 0;
  for (const migration of saveMigrations) {
    if (fromVersion >= migration.to) continue;
    migration.apply(globalsSegment);
    applied++;
  }
  if (applied) {
    console.info(
      `Applied ${applied} save migration(s) from v${fromVersion} to v${global.ver}.`,
    );
    // And in the game, where the player will actually see it. The log is restored at
    // the very end of load(), so this is queued rather than written directly.
    global.pendingMigrationNotice = { applied, fromVersion };
  } else bootPhase("restore");
  return applied;
}

function keepUnreadableSave(saved, problems) {
  if (problems && problems.length)
    console.warn("The save was rejected:\n- " + problems.join("\n- "));
  try {
    window.localStorage.setItem("v0.3.unreadable", saved);
  } catch (err) {
    // The backup is best effort; storage may be full or unavailable.
  }
  const notice = addElement(document.body, "div", "save-unreadable");
  notice.innerHTML = i18n.t("ui.save.unreadable");
  notice.tabIndex = 0;
  notice.setAttribute("role", "button");
  notice.title = i18n.t("ui.common.close");
  const dismiss = () => notice.remove();
  notice.addEventListener("click", dismiss);
  notice.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " " && event.key !== "Escape")
      return;
    event.preventDefault();
    dismiss();
  });
}

function load(dt) {
  const saved = dt || window.localStorage.getItem("v0.3");
  var str = b64_to_utf8(saved);
  if (saved && !str) {
    // The save could not be decoded. Report it, keep the original bytes, and
    // fall through to a new game — the loading screen still has to come down,
    // which is why this cannot simply return.
    keepUnreadableSave(saved);
    clearLoadingScreen();
    return;
  }
  if (str && str != "") {
    dom.error = addElement(document.body, "div");
    dom.error.style.width = "100%";
    dom.error.style.height = "auto";
    dom.error.style.position = "absolute";
    dom.error.style.fontSize = "2em";
    dom.error.style.color = "red";
    dom.error.style.zIndex = 9999;
    dom.error.style.lineHeight = "normal";
    dom.error.style.opacity = 0;
    setTimeout(function () {
      appear(dom.error);
    }, 500);
    dom.error.style.textAlign = "center";
    dom.error.innerHTML = i18n.t(
      "runtime.core.bootstrap.interface.something_broke_perhaps_due_to_stupidity_or_data_446e154f",
    );
    clearInterval(timers.mnch);
    clearInterval(timers.snch);
    clearInterval(timers.autos);
    clearInterval(timers.rdng);
    clearInterval(timers.rdngdots);
    global.menuo = 0;
    // timers.actm is gone: actions advance from ontick() now, so there is no
    // per-action interval left to clear here.
    clearInterval(timers.job1t);
    clearInterval(timers.bstmonupdate);
    clearInterval(timers.rptbncgt);
    global.flags.rptbncgtf = false;
    global.flags.rptbncgt = false;
    str = str.split("|");
    const saveProblems = describeSaveProblems(str);
    if (saveProblems.length) {
      // Nothing has been applied yet, so stopping here leaves the running game
      // untouched and keeps the original bytes for recovery.
      keepUnreadableSave(saved, saveProblems);
      clearLoadingScreen();
      return;
    }
    const yu_s = JSON.parse(str[0]);
    for (const a in ttl) {
      ttl[a].have = false;
      ttl[a].tget = false;
    }
    global.titles = [];
    // A save is exported and shared as a file, so this is the point where somebody
    // else's text enters the game.
    you.name = sanitizePlayerName(yu_s.name);
    for (const o in ttl) if (ttl[o].id === yu_s.title) you.title = ttl[o];
    you.lvl = yu_s.lvl || 1;
    you.exp = yu_s.exp || 0;
    you.exp_t = yu_s.exp_t || 1;
    you.skxp = yu_s.skxp || 1;
    you.expnext_t = you.expnext();
    you.sat = yu_s.sat ?? 200;
    you.satmax = yu_s.satmax || 200;
    you.sat_r = yu_s.sat_r || 200;
    you.sata = yu_s.sata || 0;
    you.satm = yu_s.satm || 1;
    you.ki = yu_s.ki || {};
    you.hp = yu_s.hp ?? 39;
    you.hpmax = yu_s.hpmax || 39;
    you.hp_r = yu_s.hp_r || 39;
    you.hpa = yu_s.hpa || 0;
    you.hpm = yu_s.hpm || 1;
    you.hp = you.hp > you.hpmax ? you.hpmax : you.hp;
    you.str = yu_s.str || 1;
    you.str_r = yu_s.str_r || 1;
    you.stra = yu_s.stra || 0;
    you.strm = yu_s.strm || 1;
    you.agl = yu_s.agl || 1;
    you.agl_r = yu_s.agl_r || 1;
    you.agla = yu_s.agla || 0;
    you.aglm = yu_s.aglm || 1;
    you.int = yu_s.int || 1;
    you.int_r = yu_s.int_r || 1;
    you.inta = yu_s.inta || 0;
    you.intm = yu_s.intm || 1;
    you.spd = yu_s.spd || 1;
    you.spd_r = yu_s.spd_r || 1;
    you.spda = yu_s.spda || 0;
    you.spdm = yu_s.spdm || 1;
    you.cls = yu_s.cls || [0, 0, 0];
    you.ccls = yu_s.ccls || [0, 0, 0];
    you.aff = yu_s.aff || [0, 0, 0, 0, 0, 0, 0];
    you.maff = yu_s.maff || [0, 0, 0, 0, 0, 0, 0];
    you.caff = yu_s.caff || [0, 0, 0, 0, 0, 0, 0];
    you.cmaff = yu_s.cmaff || [0, 0, 0, 0, 0, 0, 0];
    you.luck = yu_s.luck || 1;
    you.stat_p = yu_s.stat_p || [1, 1, 1, 1];
    you.karma = yu_s.karma || 0;
    you.wealth = yu_s.wealth || 0;
    you.crt = yu_s.crt || 0.008;
    global.flags.loadstate = true;
    for (const a in callback)
      for (let b = callback[a].hooks.length - 1; b >= 0; b--)
        if (callback[a].hooks[b].data?.q) callback[a].hooks.splice(b, 1);
    for (const obj in item) {
      item[obj].amount = 0;
      item[obj].have = false;
    }
    inv = [];
    for (const g in yu_s.res) you.res[g] = yu_s.res[g];
    for (const g in yu_s.mods) you.mods[g] = yu_s.mods[g];
    you.eqp = [
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
    for (const a in you.eff) you.eff[a].active = false;
    you.eff = [];
    empty(dom.d101);
    global.e_e = [];
    global.e_em = [];
    empty(dom.d101m);
    global.current_m.eff = [];
    const a4 = JSON.parse(str[1]);
    global.msgs_max = 300;
    empty(dom.mscont);
    global.rec_d = [];
    for (const ba in rcp) {
      rcp[ba].have = false;
    }
    global.flags.loadstate = false;
    const a6 = JSON.parse(str[2]);
    you.skls = [];
    for (const ab in skl) {
      skl[ab].lvl = 0;
      skl[ab].exp = 0;
    }
    for (const a in global.rec_d) global.rec_d[a].have = false;
    global.rec_d = [];
    for (const i in skl)
      for (const ii in skl[i].mlstn) skl[i].mlstn[ii].g = false;
    for (const a in a6)
      for (const b in skl)
        if (a6[a].id === skl[b].id) {
          you.skls.push(skl[b]);
          skl[b].lvl = a6[a].lvl;
          for (const c in a6[a].mst) skl[b].mlstn[c].g = a6[a].mst[c];
          if (skl[b].mlstn)
            for (const d in skl[b].mlstn)
              if (
                skl[b].mlstn[d].g === false &&
                skl[b].mlstn[d].lv <= skl[b].lvl
              ) {
                skl[b].mlstn[d].f();
                skl[b].mlstn[d].g = true;
                msg(
                  i18n.t("runtime.systems.simulation.dialogue.perk_unlocked", {
                    skill: skl[b].name,
                    level: skl[b].mlstn[d].lv,
                  }),
                  "lime",
                  {
                    x: skl[b].name,
                    y: i18n.t(
                      "runtime.systems.simulation.dialogue.perk_details",
                      {
                        level: skl[b].mlstn[d].lv,
                        perk: skl[b].mlstn[d].p,
                      },
                    ),
                  },
                  7,
                );
              }
        }
    var ro = [];
    for (const io in global.rec_d) ro.push(global.rec_d[io].id);
    const a7 = JSON.parse(str[3]);
    let skk = 0;
    for (const obj in skl)
      if (a7[skk]) {
        skl[obj].exp = a7[skk][0] || 0;
        skl[obj].expnext_t = skl[obj].expnext();
        skl[obj].p = a7[skk++][1];
        if (!skl[obj].p) skl[obj].p = 1;
        if (skl[obj].p < 0.99) skl[obj].p += 1;
      }
    global.flags.loadstate = true;
    for (let o = 0; o < a4.length; o++)
      for (const obj in effect)
        if (effect[obj].id === a4[o].a) {
          if (effect[obj].save !== false)
            giveEff(you, effect[obj], a4[o].b, a4[o].c);
          else {
            effect[obj].onRemove();
          }
          continue;
        }
    global.flags.loadstate = false;
    const a1 = JSON.parse(str[4]);
    global.sm = a1.b;
    global.rm = a1.a;
    global.spirits = a1.f;
    global.lst_loc = a1.i;
    global.uid = a1.uid;
    // A save from before the journal had a lore panel has no list, which reads
    // correctly as a player who has not written anything down yet. Unknown ids
    // are dropped so a removed entry cannot leave a blank row behind.
    global.lore = (a1.lore || []).filter((id) => loreById(id));
    // Drop any id no area answers to, the same way the lore list drops entries that
    // no longer exist, so a save from a build with different content cannot put a
    // blank row in the journal.
    global.regions = (a1.rgn || []).filter((id) => areaById(id));
    for (const id in mastery) mastery[id].data.lvl = 0;
    for (const [id, lvl] of Object.entries(a1.mastery || {}))
      if (mastery[id]) mastery[id].data.lvl = lvl;
    revealHiddenMasteries();
    // Which build wrote this save. Saves from before the field was added report
    // 0. A save from a newer build than the running game is reported rather
    // than silently reinterpreted, since its fields may not mean the same thing.
    global.save_ver = a1.v || 0;
    if (global.save_ver > global.ver)
      console.warn(
        `Save was written by v${global.save_ver}, newer than this build (v${global.ver}).`,
      );
    // Migrations run against the state restored so far, which is why they get
    // `you.mods` and `you` itself rather than only the parsed globals segment.
    else
      migrateSave(
        { globals: a1, mods: you.mods, player: you },
        global.save_ver,
      );
    // Older saves stored this as a string, and it is compared numerically.
    global.msgs_max = Math.min(50, Math.max(1, Number(a1.g) || 36));
    dom.ct_bt4_1b.value = global.msgs_max;
    global.flags = {};
    global.sinv = [];
    global.bestiary = a1.q;
    global.timehold = a1.r || (time.minute / DAY) << 0;
    global.timewold = a1.r2 || (time.minute / WEEK) << 0;
    global.lst_sve = a1.m;
    global.timescale = a1.u || 1;
    global.offline_evil_index = a1.z || 1;
    global.drdata = a1.drdata || {};
    for (let gb = 0; gb < a1.datas.length; gb++) {
      for (const itm in item)
        if (item[itm].id === a1.datas[gb]) item[itm].data.tried = true;
    }
    if (a1.datar)
      for (let gb = 0; gb < a1.datar.length; gb++) {
        for (const itm in item)
          if (item[itm].id === a1.datar[gb]) item[itm].data.finished = true;
      }
    time.minute = a1.j;
    timeConv(time);
    for (const w in weather)
      if (weather[w].id === a1.l) setWeather(weather[w], a1.k);
    global.bg_r = a1.n;
    global.bg_g = a1.o;
    global.bg_b = a1.p;
    for (const a in global.stat) global.stat[a] = a1.jj[a] || 0;
    const tempt = new Date();
    if (global.stat.sttime === 0)
      global.stat.sttime =
        tempt.getFullYear() +
        "/" +
        (tempt.getMonth() + 1) +
        "/" +
        tempt.getDate() +
        " " +
        tempt.getHours() +
        ":" +
        (tempt.getMinutes() >= 10
          ? tempt.getMinutes()
          : "0" + tempt.getMinutes()) +
        ":" +
        (tempt.getSeconds() > 10
          ? tempt.getSeconds()
          : "0" + tempt.getSeconds());
    if (global.stat.msts === 0)
      global.stat.msts = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ];
    if (global.stat.msks === 0) global.stat.msks = [0, 0, 0, 0, 0, 0, 0];
    global.stat.wsnburst = 50;
    dom.ctrwin4.style.display = "none";
    dom.ctrwin2.style.display = "none";
    dom.ctrwin1.style.display = "";
    global.lw_op = 0;
    if (global.flags.civil === false && global.flags.btl === true)
      for (const obj in area)
        if (area[obj].id === a1.x) {
          area_init(area[obj]);
          break;
        }
    const a2 = JSON.parse(str[5]);
    for (let o = 0; o < a2.length; o++) {
      for (const obj in rcp)
        if (rcp[obj].id === a2[o].id && rcp[obj].have === false) {
          global.rec_d.push(rcp[obj]);
          rcp[obj].have = true;
          rcp[obj].data = a2[o].data;
        }
    }
    for (let o = 0; o < ro.length; o++) {
      for (const obj in rcp)
        if (rcp[obj].id === ro[o] && rcp[obj].have === false) {
          global.rec_d.push(rcp[obj]);
          rcp[obj].have = true;
        }
    }
    dom.d2.textContent = you.name;
    eqpres();
    unequip(you.eqp[4], { save: true });
    unequip(you.eqp[5], { save: true });
    you.stat_r();
    const a3 = JSON.parse(str[6]);
    global.flags.loadstate = true;
    if (a3[0].length != 0)
      for (let o = 0; o < a3[0].length; o++)
        for (const obj in item) {
          if (item[obj].id === a3[0][o].id) {
            giveItem(item[obj], a3[0][o].am, true, { fi: true });
            inv[o].new = false;
            for (const a in a3[0][o].data) inv[o].data[a] = a3[0][o].data[a];
          }
          continue;
        }
    if (a3[1].length != 0)
      for (let o = 0; o < a3[1].length; o++)
        for (const obj in wpn)
          if (wpn[obj].id === a3[1][o].id) {
            const t = giveItem(wpn[obj], 1, true);
            t.new = false;
            t.dp = a3[1][o].dp;
            for (const a in a3[1][o].data) t.data[a] = a3[1][o].data[a];
            if (a3[1][o].toeq === true) equip(t, { save: true });
            continue;
          }
    if (a3[2].length != 0)
      for (let o = 0; o < a3[2].length; o++)
        for (const obj in eqp)
          if (eqp[obj].id === a3[2][o].id) {
            const t = giveItem(eqp[obj], 1, true);
            t.new = false;
            t.dp = a3[2][o].dp;
            for (const a in a3[2][o].data) t.data[a] = a3[2][o].data[a];
            if (a3[2][o].toeq === true) {
              if (t.slot === 5 && you.eqp[5].id === 10000) t.slot = 6;
              equip(t, { save: true });
            }
          }
    if (a3[3].length != 0)
      for (let o = 0; o < a3[3].length; o++)
        for (const obj in sld)
          if (sld[obj].id === a3[3][o].id) {
            const t = giveItem(sld[obj], 1, true);
            t.new = false;
            t.dp = a3[3][o].dp;
            for (const a in a3[3][o].data) t.data[a] = a3[3][o].data[a];
            if (a3[3][o].toeq === true) equip(t, { save: true });
            continue;
          }
    if (a3[4].length != 0)
      for (let o = 0; o < a3[4].length; o++)
        for (const obj in acc)
          if (acc[obj].id === a3[4][o].id) {
            const t = giveItem(acc[obj], 1, true);
            t.new = false;
            t.dp = a3[4][o].dp;
            for (const a in a3[4][o].data) t.data[a] = a3[4][o].data[a];
            if (a3[4][o].toeq === true) equip(t, { save: true });
            continue;
          }
    if (you.eqp[0].id === 10000) {
      you.eqp[0].cls[2] = (you.lvl / 4) << 0;
      you.eqp[0].aff[0] = (you.lvl / 5) << 0;
      you.eqp[0].ctype = 2;
    }
    const a5 = JSON.parse(str[7]);
    let xx = 0;
    for (const o in area) if (xx < a5.length) area[o].size = a5[xx++];
    const a8 = JSON.parse(str[8]);
    dar = a8;
    if (a8[0].length != 0)
      for (let o = 0; o < a8[0].length; o++)
        for (const obj in item)
          if (item[obj].id === a8[0][o]) item[obj].data.dscv = true;
    if (a8[1].length != 0)
      for (let o = 0; o < a8[1].length; o++)
        for (const obj in wpn)
          if (wpn[obj].id === a8[1][o]) wpn[obj].data.dscv = true;
    if (a8[2].length != 0)
      for (let o = 0; o < a8[2].length; o++)
        for (const obj in eqp)
          if (eqp[obj].id === a8[2][o]) eqp[obj].data.dscv = true;
    if (a8[3].length != 0)
      for (let o = 0; o < a8[3].length; o++)
        for (const obj in sld)
          if (sld[obj].id === a8[3][o]) sld[obj].data.dscv = true;
    if (a8[4].length != 0)
      for (let o = 0; o < a8[4].length; o++)
        for (const obj in acc)
          if (acc[obj].id === a8[4][o]) acc[obj].data.dscv = true;
    if (a3[5].length != 0)
      for (const a in a3[5])
        for (const b in item)
          if (item[b].id === a3[5][a].item) item[b].data = a3[5][a].data;
    for (const a in furniture) furniture[a].active = false;
    for (const a in furn) furn[a].data = {};
    furn = [];
    const a9 = JSON.parse(str[9]);
    for (let a = 0; a < a9.length; a++)
      for (const obj in furniture)
        if (furniture[obj].id === a9[a].id && a9[a].data.amount > 0) {
          furn[a] = furniture[obj];
          furn[a].data = a9[a].data;
        }
    const a10 = JSON.parse(str[10]);
    const a11 = JSON.parse(str[11]);
    global.flags = a1.e;
    global.flags.rdng = false;
    global.flags.civil = true;
    global.flags.btl = false;
    // Never restore into a nightmare. chss data comes back from segment 17 after
    // smove has already re-rendered the location, so a persisted one would return
    // with no choices on screen and no way out.
    global.flags.nmare = false;
    global.current_z = area.nwh;
    global.current_m = creature.default;
    update_m();
    dom.d7m.update();
    global.flags.wkdis = false;
    global.flags.jdgdis = false;
    for (const obj in vendor) {
      if (a10[obj] && a10[obj].stock) {
        vendor[obj].stock = a10[obj].stock;
        vendor[obj].data = a10[obj].data;
        if (!vendor[obj].data.time || vendor[obj].data.time < 0)
          vendor[obj].data.time = 1;
        for (let itm = 0; itm < a10[obj].stock.length; itm++) {
          const k = itemgroup[((a10[obj].stock[itm][0] + 1) / 10000) << 0];
          for (const v in k)
            if (k[v].id === a10[obj].stock[itm][0]) {
              vendor[obj].stock[itm][0] = k[v];
              continue;
            }
        }
      } else {
        restock(vendor[obj]);
      }
    }
    const a12 = JSON.parse(str[11]);
    for (let ttlid = 0; ttlid < a12.length; ttlid++)
      for (const obj in ttl)
        if (ttl[obj].id === a12[ttlid]) {
          global.titles[ttlid] = ttl[obj];
          global.titles[ttlid].have = true;
        }
    for (const obj in global.titlese) global.titles.push(global.titlese[obj]);
    global.titlese = [];
    const a13 = JSON.parse(str[12]);
    for (const s in a13) {
      for (const ss in furn) if (furn[ss].id === a13[s]) home[s] = furn[ss];
    }
    qsts = [];
    const a14 = JSON.parse(str[13]);
    for (const obj in a14)
      for (const q in quest)
        if (quest[q].id === a14[obj].id) {
          qsts[obj] = quest[q];
          qsts[obj].data = a14[obj].data;
          if (qsts[obj].callback) qsts[obj].callback();
        }
    global.current_a = act.default;
    acts = [];
    for (const a in act) {
      act[a].have = false;
      act[a].data = {};
      act[a].active = false;
    }
    const a15 = JSON.parse(str[14]);
    for (const obj in a15)
      for (const q in act)
        if (act[q].id === a15[obj].id) {
          acts[obj] = act[q];
          acts[obj].data = a15[obj].data;
          act[q].have = true;
        }
    for (const a in sectors) sectors[a].onLeave();
    sectors = [];
    const a16 = JSON.parse(str[15]);
    for (const obj in a16)
      for (const q in sector)
        if (sector[q].id === a16[obj].id) {
          if (objempty(a16[obj].data) === false) {
            for (const a in a16[obj].data) sector[q].data[a] = a16[obj].data[a];
          } else if (sector[q].ddata) sector[q].data = sector[q].ddata;
        }
    clearInterval(timers.vndrstkchk);
    for (const obj in chss)
      if (chss[obj].id === a1.i) {
        global.current_l = chss[obj];
        smove(chss[obj], false);
      }
    let a17 = JSON.parse(str[16]);
    for (const a in container) container[a].c = [];
    if (a17[0] && !a17[0].c) {
      a17 = [{ id: 1, c: a17 }];
    }
    for (const a in a17) {
      for (const d in container)
        if (container[d].id === a17[a].id) {
          for (const c in a17[a].c) {
            const k = itemgroup[((a17[a].c[c].id + 1) / 10000) << 0];
            for (const b in k)
              if (k[b].id === a17[a].c[c].id) {
                const ni = {
                  item: k[b],
                  data: a17[a].c[c].data,
                  am: a17[a].c[c].am,
                  dp: a17[a].c[c].dp,
                };
                container[d].c.push(ni);
                break;
              }
          }
          break;
        }
    }
    const a18 = JSON.parse(str[17]);
    for (const obj in a18)
      for (const q in chss)
        if (chss[q].id === a18[obj].id) {
          if (objempty(a18[obj].data) === false) chss[q].data = a18[obj].data;
        }
    if (str[19]) {
      const a19 = JSON.parse(str[19]);
      for (const a in a19)
        for (const b in ttl) if (a19[a] === ttl[b].id) ttl[b].tget = true;
      // Only a save that carried this segment can say which talents are still
      // unapplied. Without it, every held talent is already baked into the
      // restored you.mods, so re-running them would apply the same permanent
      // bonus twice.
      for (const a in ttl) {
        if (ttl[a].have && ttl[a].talent && !ttl[a].tget) {
          ttl[a].talent();
          ttl[a].tget = true;
        }
      }
    } else
      for (const a in ttl) if (ttl[a].have && ttl[a].talent) ttl[a].tget = true;
    isort(global.sm);
    rsort(global.rm);
    rstcrtthg();
    you.stat_r();
    global.spbtsr[global.rm].style.color = "yellow";
    if (global.flags.aw_u) {
      dom.d0.style.display = "";
      dom.d1m.style.display = "";
      dom.inv_ctx.style.display = "";
      dom.gmsgs.style.display = "";
      dom.ct_ctrl.style.display = "";
      dom.ctr_1.style.display = "";
      dom.d_lct.style.display = "";
    }
    dom.ctrwin3.style.display = "none";
    dom.ctrwin5.style.display = "none";
    dom.d5_1_1.update();
    dom.d5_2_1.update();
    dom.d6.update();
    update_d();
    dom.d3.update();
    update_m();
    m_update();
    dom.d7m.update();
    dom.d5_3_1.update();
    if (global.flags.m_freeze === true) dom.m_b_1_c.innerHTML = "×";
    if (global.flags.m_blh === true) dom.m_b_2_c.innerHTML = "×";
    if (global.flags.jnlu)
      dom.ct_bt6.innerHTML = i18n.t("ui.navigation.journal");
    if (global.flags.asbu)
      dom.ct_bt1.innerHTML = i18n.t("ui.navigation.assemble");
    if (global.flags.actsu)
      dom.ct_bt3.innerHTML = i18n.t("ui.navigation.actions");
    if (global.flags.sklu)
      dom.ct_bt2.innerHTML = i18n.t("ui.navigation.skills");
    // `grd_s` rides along in the saved flags, so the control and the rendered
    // gradients have to be brought back in step with it after a restore.
    dom.ct_bt4_41b.checked = global.flags.grd_s === false;
    if (dom.ct_bt4_41b.checked) nograd(true);
    dom.d8m1.innerHTML = i18n.t(
      global.flags.to_pause === true
        ? "runtime.ui.interface.interface.pause_next_battle_nbspon_ff0ff553"
        : "runtime.ui.interface.interface.pause_next_battle_nbspoff_1b765858",
    );
    if (global.flags.m_un === true) {
      dom.mn_2.style.display = "";
      dom.mn_4.style.display = "";
      dom.mn_3.style.display = "";
      if (global.stat.mndrgnu) dom.mn_1.style.display = "";
      m_update();
    }
    wManager();
    dom.d_moon.innerHTML = global.text.lunarp[getLunarPhase()][0];
    addDesc(
      dom.d_moon,
      null,
      2,
      i18n.t("runtime.core.bootstrap.description.lunar_phase_0004b314"),
      global.text.lunarp[getLunarPhase()][1],
    );
    wdrseason(global.flags.ssngaijin);
    if (global.flags.isday === false) dom.d_moon.style.display = "";
    else dom.d_moon.style.display = "none";
    dom.sl_extra.innerHTML = i18n.t("ui.save.lastSave", {
      date: global.lst_sve,
    });
    dom.nthngdsp.style.display = "none";
    dom.ctrwin6.style.display = "none";
    invbtsrst();
    dom.d_time.innerHTML =
      "<small>" +
      getDay(global.flags.tmmode || 2) +
      "</small> " +
      timeDisp(time);
    global.flags.loadstate = false;
    global.flags.savestate = false;
    global.flags.ttlscrnopn = false;
    global.flags.expatv = false;
    global.flags.impatv = false;
    global.flags.expatv = false;
  }
  if (!global.flags.stbxinifld) {
    addToContainer(home.trunk, eqp.gnt);
    addToContainer(home.trunk, acc.fmlim);
    addToContainer(home.trunk, wpn.bdsrd);
    addToContainer(home.trunk, item.toolbx);
    addToContainer(home.trunk, sld.tge);
    addToContainer(home.trunk, item.bonig);
    global.flags.stbxinifld = true;
  }
  // A stored background preference outranks whatever the save carried, since it
  // is the more recent explicit choice; without one, apply the save's values.
  if (!restoreBackgroundPreference()) applyBackground();
  // A dialog takes itself out of the document when it closes and clears the flag in its
  // own onClose, so closing it is the whole teardown -- reaching into document.body for a
  // node the dialog owns is what left a window behind that could neither close nor reopen.
  if (dom.bkssttbd?.open) dom.bkssttbd.close();
  if (global.flags.expatv) {
    empty(dom.ct_bt4_5a_nc);
    document.body.removeChild(dom.ct_bt4_5a_nc);
    kill(dom.ct_bt4_5a_nc);
  }
  if (global.flags.impatv) {
    empty(dom.ct_bt4_5b_nc);
    document.body.removeChild(dom.ct_bt4_5b_nc);
    kill(dom.ct_bt4_5b_nc);
  }
  if (dom.error) {
    empty(dom.error);
    document.body.removeChild(dom.error);
    kill(dom.error);
  }
  // Autosave is a preference rather than run state, so a stored choice wins
  // over whatever the save carried. This also re-arms the timer and, unlike the
  // previous code, unchecks the box when autosave is off.
  restoreAutosavePreference();
  //if(global.flags.msgtm===true)dom.ct_bt4_61b.checked=true;
  ////patch things
  if (skl.pet.lvl >= 10) giveTitle(ttl.pet3);
  if (item.amrthsck.data.finished) giveRcp(rcp.appljc);
  ////////////////
  // Restore history last: load() empties the log while it rebuilds the world,
  // so anything put back before this point would be wiped again.
  restoreMessageLog();
  // A migration touched the save. Said here rather than earlier because load() empties
  // the log while it rebuilds the world, so anything written before this is wiped.
  if (global.pendingMigrationNotice) {
    msg(
      i18n.t("ui.boot.migrationApplied", {
        from: global.pendingMigrationNotice.fromVersion,
        to: global.ver,
      }),
      "orange",
    );
    delete global.pendingMigrationNotice;
  }
  clearLoadingScreen();
}

function clearLoadingScreen() {
  if (dom.loading) {
    fade(dom.loading, 5, true);
    delete dom.loading;
  }
  if (dom.loadingt) {
    fade(dom.loadingt, 5, true);
    delete dom.loadingt;
  }
}
