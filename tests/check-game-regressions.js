const fs = require("fs");
const path = require("path");
const espree = require("espree");

const root = path.dirname(__dirname);
const locations = fs.readFileSync(
  path.join(root, "js", "world", "locations.js"),
  "utf8",
);

const moonBloomLeaveHandler =
  /chss\.frstn1a4\.onLeave\s*=\s*function\s*\(\)\s*{\s*area\.frstn1a4\.size\s*=\s*rand\(5\)\s*-\s*20;\s*};/;

if (!moonBloomLeaveHandler.test(locations)) {
  throw new Error(
    "Moon Bloom regression: leaving frstn1a4 must reduce its randomized area size by 20.",
  );
}

console.log("Validated the Moon Bloom area-size regression fix.");

const interfaceSource = fs.readFileSync(
  path.join(root, "js", "ui", "interface.js"),
  "utf8",
);
const combatPanelLayout = [
  /addElement\(document\.body, "div", "player-panel", "d combat-panel"\)/,
  /addElement\(document\.body, "div", "enemy-panel", "d combat-panel"\)/,
  /dom\.d1m\.style\.top\s*=\s*"8px"/,
  /dom\.d1m\.style\.left\s*=\s*"457px"/,
];

if (!combatPanelLayout.every((pattern) => pattern.test(interfaceSource))) {
  throw new Error(
    "Combat layout regression: player and enemy panels need unique identities and pixel-based enemy coordinates.",
  );
}

console.log("Validated the player/enemy combat-panel positioning contract.");

const tooltipPositioning = [
  /function positionDescription\(c\)/,
  /global\.dscr\.style\.left\s*=\s*`\$\{Math\.max\(gap, left\)\}px`/,
  /global\.dscr\.style\.top\s*=\s*`\$\{Math\.max\(gap, top\)\}px`/,
  /dm\.addEventListener\("mousemove", \(a\) => \{\s*positionDescription\(a\);/,
];

if (!tooltipPositioning.every((pattern) => pattern.test(interfaceSource))) {
  throw new Error(
    "Tooltip regression: hover descriptions need pixel-based, viewport-aware pointer positioning.",
  );
}

const equipmentSource = fs.readFileSync(
  path.join(root, "js", "data", "equipment.js"),
  "utf8",
);
const itemSource = fs.readFileSync(
  path.join(root, "js", "data", "items.js"),
  "utf8",
);
const staticEquipmentDescription =
  /\b(?:wpn|eqp|sld|acc)\.\w+\.desc\s*=\s*["'`]/;
const staticItemDescription = /\bitem\.\w+\.desc\s*=\s*["'`]/;

if (
  staticEquipmentDescription.test(equipmentSource) ||
  staticItemDescription.test(itemSource)
) {
  throw new Error(
    "Localization regression: static item and equipment descriptions must come from locale JSON.",
  );
}

console.log(
  "Validated hover-description positioning and item/equipment-description localization.",
);

const saveBarLayout = [
  /addElement\(dom\.sl, "div", "save-bar-controls"\)/,
  /addElement\(dom\.sl, "span", "save-game", "sl"\)[\s\S]*addElement\(dom\.sl, "span", "load-game", "sl"\)[\s\S]*addElement\(dom\.sl, "span", "save-bar-collapse", "sl"\)/,
  /addElement\(dom\.autosve, "input", "autosave-toggle"\)/,
];

if (!saveBarLayout.every((pattern) => pattern.test(interfaceSource))) {
  throw new Error(
    "Save-bar regression: collapse must follow save/load, while autosave, version, and delete share an explicit layout group.",
  );
}

console.log("Validated the grouped save-bar control structure.");

const bootstrapSource = fs.readFileSync(
  path.join(root, "js", "core", "bootstrap.js"),
  "utf8",
);
const playerSource = fs.readFileSync(
  path.join(root, "js", "core", "player.js"),
  "utf8",
);
const playerNamePersistence = [
  /this\.name\s*=\s*i18n\.t\("runtime\.core\.player\.interface\.name"\)/,
  /const yu\s*=\s*{\s*name:\s*you\.name,/,
  /you\.name\s*=\s*yu_s\.name;/,
];

if (
  !playerNamePersistence[0].test(playerSource) ||
  !playerNamePersistence
    .slice(1)
    .every((pattern) => pattern.test(bootstrapSource))
) {
  throw new Error(
    "Save regression: the localized player name must remain only a new-game default and custom names must round-trip through save/load.",
  );
}

console.log("Validated custom player-name save/load persistence.");

const gameCss = fs.readFileSync(path.join(root, "css", "game.css"), "utf8");
const uiSafetyContracts = [
  /addElement\(\s*document\.body,\s*"dialog",\s*"save-delete-modal",\s*"game-modal"/,
  /dom\.save_delete_modal\.showModal\(\)/,
  /dom\.save_delete_modal\.addEventListener\("cancel"/,
  /dom\.save_delete_modal\.addEventListener\("close"/,
  /localStorage\.removeItem\("v0\.3"\);\s*window\.location\.reload\(\);/,
  /i18n\.t\("runtime\.ui\.interface\.dialogue\.combat_missed"/,
  /addElement\(dom\.m_control, "small", "message-log-clear", "bts_m"\)/,
];

if (
  !uiSafetyContracts.every((pattern) => pattern.test(interfaceSource)) ||
  /window\.(?:alert|confirm)\(/.test(interfaceSource) ||
  /document\.body\.removeAttribute\("style"\)/.test(interfaceSource) ||
  /\.name \+ " missed"/.test(interfaceSource) ||
  !/\.bts_m_b:empty\s*{\s*display: none;\s*}/.test(gameCss) ||
  !/\.game-modal::backdrop\s*{/.test(gameCss) ||
  !/\.game-modal__button--danger\s*{/.test(gameCss)
) {
  throw new Error(
    "UI safety regression: themes must preserve scale, save deletion must use the accessible game modal, combat misses must localize, and empty log indicators must stay hidden.",
  );
}

console.log(
  "Validated theme, modal save deletion, combat log, and log-control contracts.",
);

const localizedLocationText = [
  /i18n\.get\(\s*"runtime\.world\.locations\.dialogue\.free_meal_eating_sounds"/,
  /i18n\.get\(\s*"runtime\.world\.locations\.dialogue\.free_meal_reactions"/,
  /i18n\.t\("runtime\.world\.locations\.dialogue\.reading_progress"/,
  /i18n\.t\("runtime\.world\.locations\.dialogue\.reading_duration_hours"/,
  /i18n\.t\("runtime\.world\.locations\.dialogue\.reading_duration_minutes"/,
  /i18n\.t\("runtime\.world\.locations\.dialogue\.enter_the_basement"/,
  /i18n\.t\("runtime\.world\.locations\.dialogue\.examine_basement_door"/,
];
const forbiddenLocationText = [
  "That was good!",
  "Delicious!",
  '"Enter the basement"',
  '"Examine basement door"',
  "You are reading <span",
  "hours to finish",
  "minutes to finish",
];

if (
  !localizedLocationText.every((pattern) => pattern.test(locations)) ||
  forbiddenLocationText.some((text) => locations.includes(text))
) {
  throw new Error(
    "Location localization regression: meal reactions, reading progress, and basement actions must come from locale JSON.",
  );
}

const backgroundPresetLayout = [
  /addElement\(\s*dom\.ct_bt4_03,\s*"div",\s*"background-presets",\s*"opt_v"/,
  /"background-preset"/,
  /#background-presets\s*{[^}]*display: grid;[^}]*gap: 4px;/s,
  /\.background-preset\s*{[^}]*box-sizing: border-box;[^}]*min-width: 0;/s,
];

if (
  !backgroundPresetLayout.every((pattern) =>
    pattern.test(interfaceSource + gameCss),
  )
) {
  throw new Error(
    "Settings layout regression: background preset controls need bounded, separated grid cells.",
  );
}

console.log(
  "Validated localized location text and separated background preset controls.",
);

const localizedBedText = [
  /i18n\.get\(\s*"runtime\.world\.locations\.dialogue\.bed_unconscious_messages"/,
  /i18n\.get\(\s*"runtime\.world\.locations\.dialogue\.bed_cat_rest_messages"/,
  /i18n\.t\("runtime\.world\.locations\.dialogue\.bed_rest_summary"/,
];
const forbiddenBedText = [
  "You lost consciousness...",
  "You have been knocked out...",
  "You passed out...",
  ". Your cat is resting next to you",
  ". You feel warm",
  "Great way to pass time",
];

if (
  !localizedBedText.every((pattern) => pattern.test(locations)) ||
  forbiddenBedText.some((text) => locations.includes(text))
) {
  throw new Error(
    "Bed localization regression: unconsciousness, cat-rest, and rest-summary text must come from locale JSON.",
  );
}

function collectJavaScriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectJavaScriptFiles(entryPath);
    return entry.name.endsWith(".js") && entry.name !== "game.js"
      ? [entryPath]
      : [];
  });
}

function walkSyntax(node, visit) {
  if (!node || typeof node !== "object") return;
  visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value))
      value.forEach((child) => walkSyntax(child, visit));
    else if (value && typeof value === "object" && value.type)
      walkSyntax(value, visit);
  }
}

const rawTextSelections = [];
for (const file of collectJavaScriptFiles(path.join(root, "js"))) {
  const source = fs.readFileSync(file, "utf8");
  const syntax = espree.parse(source, {
    ecmaVersion: "latest",
    loc: true,
    sourceType: "script",
  });
  walkSyntax(syntax, (node) => {
    if (
      node.type !== "CallExpression" ||
      node.callee?.type !== "Identifier" ||
      node.callee.name !== "select" ||
      node.arguments[0]?.type !== "ArrayExpression"
    )
      return;
    const containsWords = node.arguments[0].elements.some(
      (element) =>
        element?.type === "Literal" &&
        typeof element.value === "string" &&
        /[A-Za-z]{2}/.test(element.value),
    );
    if (containsWords)
      rawTextSelections.push(
        `${path.relative(root, file)}:${node.loc.start.line}`,
      );
  });
}

if (rawTextSelections.length) {
  throw new Error(
    `Localization regression: text-valued select arrays must come from locale JSON: ${rawTextSelections.join(", ")}`,
  );
}

console.log("Validated localized bed text and randomized text selections.");

const simulationSource = fs.readFileSync(
  path.join(root, "js", "systems", "simulation.js"),
  "utf8",
);
const plannerSource = fs.readFileSync(
  path.join(root, "js", "systems", "planner.js"),
  "utf8",
);
const localizedDayComparison = /getDay\([^)]*\)\s*={2,3}\s*["'][^"']+["']/;

if (
  !/function isDay\(dayIndex\)\s*{\s*return time\.day % 7 === dayIndex;\s*}/.test(
    simulationSource,
  ) ||
  !/if \(isDay\(6\)\) global\.flags\.djmlet = true;/.test(plannerSource) ||
  !/i18n\.t\("runtime\.world\.locations\.dialogue\.weekly_free_meals"\)/.test(
    locations,
  ) ||
  /col\("Sunday"/.test(locations) ||
  localizedDayComparison.test(plannerSource) ||
  localizedDayComparison.test(locations)
) {
  throw new Error(
    "Calendar regression: gameplay must compare locale-independent day indexes, not translated day labels.",
  );
}

console.log("Validated locale-independent calendar gameplay checks.");

const titlesSource = fs.readFileSync(
  path.join(root, "js", "data", "titles.js"),
  "utf8",
);

if (
  /you\.agml\b/.test(bootstrapSource) ||
  !/aglm: you\.aglm,/.test(bootstrapSource)
) {
  throw new Error(
    "Save regression: the AGL multiplier must be serialized from you.aglm, not the misspelled you.agml.",
  );
}

if (
  !/for \(const o in area\)\s*if \(xx < a5\.length\) area\[o\]\.size = a5\[xx\+\+\];/.test(
    bootstrapSource,
  )
) {
  throw new Error(
    "Save regression: area sizes must be restored by array length so an area of size 0 cannot desynchronize the counter.",
  );
}

const objectIndexedSplice =
  /\.splice\(\s*(?:callback\[a\]\.)?(?:callback\.)?hooks\[[a-z]+\]\s*,/;

if (
  objectIndexedSplice.test(titlesSource) ||
  objectIndexedSplice.test(bootstrapSource) ||
  !/callback\.hooks\.splice\(a, 1\)/.test(titlesSource) ||
  !/callback\[a\]\.hooks\.splice\(b, 1\)/.test(bootstrapSource)
) {
  throw new Error(
    "Callback regression: hooks must be removed by numeric index, never by passing the hook object to splice.",
  );
}

if (
  !/this\.sat \*= Math\.min\(0\.95, 0\.45 \* \(1 \+ skl\.dth\.use\(\)\)\)/.test(
    playerSource,
  )
) {
  throw new Error(
    "Death regression: satiation loss must reward the Death skill and stay clamped below a full refund.",
  );
}

if (
  !/dom\.d8m1\.innerHTML = i18n\.t\(\s*global\.flags\.to_pause === true/.test(
    bootstrapSource,
  )
) {
  throw new Error(
    "Load regression: the pause-next-battle label must be resynchronized from the restored flag.",
  );
}

const guardedBaseStats = [
  /you\.str_r = yu_s\.str_r \|\| 1;/,
  /you\.agl_r = yu_s\.agl_r \|\| 1;/,
  /you\.int_r = yu_s\.int_r \|\| 1;/,
  /you\.spd_r = yu_s\.spd_r \|\| 1;/,
  /you\.luck = yu_s\.luck \|\| 1;/,
  /you\.wealth = yu_s\.wealth \|\| 0;/,
  /you\.stat_p = yu_s\.stat_p \|\| \[1, 1, 1, 1\];/,
  /you\.sat = yu_s\.sat \?\? 200;/,
  /you\.hp = yu_s\.hp \?\? 39;/,
];

if (!guardedBaseStats.every((pattern) => pattern.test(bootstrapSource))) {
  throw new Error(
    "Load regression: base stats need defaults so a damaged save cannot restore undefined values.",
  );
}

if (
  /"v0\.2a"/.test(interfaceSource) ||
  !/storage\.setItem\("v0\.3", t\)/.test(interfaceSource)
) {
  throw new Error(
    "Import regression: imported saves must persist to the live v0.3 storage key.",
  );
}

if (
  !/function keepUnreadableSave\(saved, problems\)/.test(bootstrapSource) ||
  !/window\.localStorage\.setItem\("v0\.3\.unreadable", saved\)/.test(
    bootstrapSource,
  ) ||
  !/i18n\.t\("ui\.save\.unreadable"\)/.test(bootstrapSource)
) {
  throw new Error(
    "Save regression: an unreadable save must be preserved as a backup and reported to the player.",
  );
}

const effectsSource = fs.readFileSync(
  path.join(root, "js", "data", "effects.js"),
  "utf8",
);
const unclampedResistance =
  /\(\s*1 - skl\.[a-z0-9_]+\.(?:use\(\)|lvl \* [0-9.]+)/;

if (
  !/function resistanceFactor\(reduction\) \{\s*return Math\.min\(1, Math\.max\(0, 1 - reduction\)\);/.test(
    effectsSource,
  ) ||
  unclampedResistance.test(effectsSource)
) {
  throw new Error(
    "Resistance regression: damage reductions must go through resistanceFactor so a high resistance skill cannot heal the target.",
  );
}

console.log("Validated save, load, callback, and death-penalty regressions.");
console.log("Validated clamped resistance damage reductions.");

// Release notes are announced from a preference key rather than the save, so a
// player who never presses Save still sees them once, and deleting a save does
// not replay them. The version is stored before the notes are shown so a failure
// to render cannot show them again on the next launch either.
const versionAnnouncement = [
  /const seenVersionKey = "proto23\.seenversion"/,
  /function announceNewVersion\(\)/,
  /readSeenVersion\(\) \|\| global\.save_ver \|\| 0/,
  /storeSeenVersion\(global\.ver\);\s*\n\s*if \(!from \|\| from >= global\.ver\) return false/,
  /load\(\);\s*\n\s*announceNewVersion\(\)/,
];

if (!versionAnnouncement.every((pattern) => pattern.test(bootstrapSource))) {
  throw new Error(
    "Version announcement regression: the last-seen build must come from the preference key, be recorded before the notes render, and stay silent for a first-time player.",
  );
}

if (
  !/const releaseNotes = \[/.test(interfaceSource) ||
  !/i18n\.get\("ui\.releaseNotes\.v477"\)/.test(interfaceSource) ||
  !/showCancel: false/.test(interfaceSource)
) {
  throw new Error(
    "Version announcement regression: release notes must read spelled-out locale keys and open as a single-button notice.",
  );
}

// A message colour drawn at random has to stay readable on the log's own dark
// background. The marketplace crier used rand() on each rgb channel, so it
// regularly printed a line the player could not see at all.
if (
  /rgb\("\s*\+\s*rand\(/.test(locations) ||
  !/"hsl\(" \+ rand\(359\) \+ ", 75%, 70%\)"/.test(locations)
) {
  throw new Error(
    "Message-colour regression: a randomised message colour must fix its lightness, or it can come out as dark as the log background.",
  );
}

console.log("Validated readable randomised message colours.");

console.log("Validated the new-version announcement and its stored key.");

const sharedConfirmModal = [
  // The option list is allowed to grow — release notes reuse the dialog with a
  // single neutral button — but these four have to stay part of the contract.
  /function showConfirmModal\(\{[\s\S]*?\btitle,[\s\S]*?\bmessage,[\s\S]*?\bconfirmLabel,[\s\S]*?\bonConfirm,?[\s\S]*?\}\)/,
  /addElement\(document\.body, "dialog", null, "game-modal"\)/,
  /modal\.showModal\(\)/,
  /modal\.addEventListener\("cancel"/,
  /modal\.addEventListener\("close"/,
  /i18n\.t\("ui\.inventory\.delete\.confirmAction"\)/,
  /i18n\.t\("ui\.inventory\.disassemble\.confirmAction"\)/,
];

if (
  !sharedConfirmModal.every((pattern) => pattern.test(interfaceSource)) ||
  /style\.width = document\.body\.clientWidth/.test(interfaceSource) ||
  /1300 \/ 2 - 195/.test(interfaceSource)
) {
  throw new Error(
    "Confirmation regression: item destroy and disassemble must use the shared accessible modal, not hand-positioned unitless overlays.",
  );
}

const callbackHooks = [
  /callback\.onDeath = new callbackManager\(1\)/,
  /callback\.onLevel = new callbackManager\(2\)/,
  /callback\.onEnterArea = new callbackManager\(3\)/,
  /callback\.onCraft = new callbackManager\(4\)/,
  /callback\.onQuestComplete = new callbackManager\(5\)/,
  /this\.fire = function \(\.\.\.args\)/,
];
const questSource = fs.readFileSync(
  path.join(root, "js", "data", "quests.js"),
  "utf8",
);
const craftingSource = fs.readFileSync(
  path.join(root, "js", "systems", "crafting.js"),
  "utf8",
);

if (
  !callbackHooks.every((pattern) => pattern.test(titlesSource)) ||
  !/callback\.onQuestComplete\.fire\(q\)/.test(questSource) ||
  !/callback\.onCraft\.fire\(rc\)/.test(craftingSource) ||
  // onLevel carries how many levels were gained, so a subscriber can tell a real
  // level-up from the t === 0 call that resets a level 1 creature's stats.
  !/callback\.onLevel\.fire\(p, t\)/.test(simulationSource) ||
  !/callback\.onEnterArea\.fire\(area\)/.test(interfaceSource)
) {
  throw new Error(
    "Callback regression: the shared dispatcher must expose the death, level, area, craft, and quest hooks and fire each of them.",
  );
}

// onLevel had no subscribers for the whole life of the callback registry, so the
// milestone grants are the only thing standing between SPD and LUCK growing and
// them sitting on 1 for an entire playthrough. Each part is asserted separately:
// the grant table, the subscriber that pays it out, the guard that keeps creature
// level-ups from claiming it, and the migration that settles up with an existing
// character.
const levelGrantParts = [
  /stat: "spd_r",\s*\n\s*(?:\/\/.*\n\s*)*every: 10,/,
  /stat: "luck",\s*\n\s*(?:\/\/.*\n\s*)*every: 5,/,
  /attachCallback\(callback\.onLevel, \{/,
  /if \(who\.id !== you\.id \|\| !gained\) return;/,
  /you\[grant\.stat\] \+= grant\.amount;/,
  /function levelGrantTotal\(grant, lvl\)/,
];

if (!levelGrantParts.every((pattern) => pattern.test(simulationSource))) {
  throw new Error(
    "Progression regression: the level milestone grants must define SPD every ten levels and LUCK every five, and pay them out from an onLevel subscriber that ignores creatures.",
  );
}

if (
  !/to: 478,/.test(bootstrapSource) ||
  !/for \(const grant of levelGrants\)/.test(bootstrapSource) ||
  !/player: you/.test(bootstrapSource)
) {
  throw new Error(
    "Progression regression: the v478 migration must top an existing character up to the SPD and LUCK the milestone grants owe them, which needs the player passed to migrateSave.",
  );
}

// The three shields the dojo awards at levels 35, 45 and 50 shipped as stubs with
// no stats, and a shield's affinity was subtracted from the player's protection
// rather than added to its own share -- so a statted shield made things worse.
for (const shield of ["hpt", "knt", "drd"]) {
  const str = equipmentSource.match(
    new RegExp(`sld\\.${shield}\\.str = (\\d+);`),
  );
  if (!str || Number(str[1]) <= 15) {
    throw new Error(
      `Reward regression: sld.${shield} is a dojo reward and must be statted above the Pelta Shield's 15, not left as a stub.`,
    );
  }
  if (!new RegExp(`sld\\.${shield}\\.aff = \\[`).test(equipmentSource)) {
    throw new Error(
      `Reward regression: sld.${shield} must declare its own resistances.`,
    );
  }
}

// The world's monster levels stopped at 28 while the dojo's reward ladder runs to
// 50. Bands that follow the player were added to the endless training bout and the
// two deep catacomb hunting grounds. The floors must stay authored, so a first
// arrival still meets the fight that was designed, and the single-encounter boss
// at the bottom must not scale at all.
const areasSource = fs.readFileSync(
  path.join(root, "js", "world", "areas.js"),
  "utf8",
);

if (
  !/function trackingLevel\(floor, behind, cap\)/.test(areasSource) ||
  !/return Math\.max\(floor, Math\.min\(lvl - behind, cap\)\);/.test(
    areasSource,
  ) ||
  (areasSource.match(/get lvlmax\(\) \{/g) || []).length < 9
) {
  throw new Error(
    "World level regression: the training bout and the deep catacombs must express their ceilings as bands that follow the player, floored at the authored value.",
  );
}

if (!/crt: creature\.dcrps1, lvlmin: 26, lvlmax: 28/.test(areasSource)) {
  throw new Error(
    "World level regression: the encounter at the end of the catacombs is a fixed fight and must not track the player's level.",
  );
}

// Selling. The sell price is derived from the same vendor supply lines the shops
// buy from, and it has to stay well under them: if it ever reached the buy price
// there would be an unbounded money loop through any vendor's stock.
const craftingSourceForSelling = fs.readFileSync(
  path.join(root, "js", "systems", "crafting.js"),
  "utf8",
);

if (
  !/function sellBasePrice\(itm\)/.test(craftingSourceForSelling) ||
  !/function itemSellValue\(itm\)/.test(craftingSourceForSelling) ||
  !/function sellableInventory\(\)/.test(craftingSourceForSelling) ||
  !/const rate = Math\.min\(0\.45, 0\.2 \+ skl\.trad\.use\(\)\);/.test(
    craftingSourceForSelling,
  )
) {
  throw new Error(
    "Selling regression: the sell price must be derived from the vendor supply lines and capped below the buy side.",
  );
}

if (
  !/if \(obj\.important === true\) continue;/.test(craftingSourceForSelling) ||
  !/if \(obj\.slot && wearing\(obj\)\) continue;/.test(craftingSourceForSelling)
) {
  throw new Error(
    "Selling regression: quest items and equipped items must never appear on the sell list.",
  );
}

// A vendor with no markup priced its entire stock as NaN, which passed the
// affordability check and turned the player's purse into NaN when spent.
if (!/^  this\.infl = 1;$/m.test(craftingSourceForSelling)) {
  throw new Error(
    "Vendor regression: the Vendor constructor must default its price multiplier, or a vendor that sets none prices everything as NaN.",
  );
}

if (
  !/\(100 \+ you\.eqp\[1\]\.aff\[att\.atype\] \* 5 \* shdc\)/.test(
    interfaceSource,
  ) ||
  /100 -\s*\n\s*\(you\.eqp\[1\]\.aff\[att\.atype\]/.test(interfaceSource)
) {
  throw new Error(
    "Shield regression: a shield's affinity must scale the shield's own share of the mitigation, not be subtracted from the total.",
  );
}

if (
  !/v: global\.ver,/.test(bootstrapSource) ||
  !/global\.save_ver = a1\.v \|\| 0;/.test(bootstrapSource) ||
  !/global\.stat\.lastver = global\.ver;/.test(bootstrapSource)
) {
  throw new Error(
    "Save regression: the writing game version must be recorded in the save and read back on load.",
  );
}

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sharingMetadata = [
  /<title>Echoes Beneath<\/title>/,
  /<meta\s+name="description"/,
  /<meta\s+name="theme-color" content="#002840" \/>/,
  /<meta\s+property="og:title" content="Echoes Beneath" \/>/,
  /<meta\s+property="og:description"/,
  /<meta\s+property="og:image" content="icons\/og-image\.jpg" \/>/,
  /<meta\s+name="twitter:card"/,
  /<link rel="shortcut icon" href="favicon\.ico"/,
  /<link\s+rel="icon"[^>]*href="icons\/icon-192\.png"/,
  /<link rel="apple-touch-icon" href="icons\/apple-touch-icon\.png" \/>/,
];

if (
  !sharingMetadata.every((pattern) => pattern.test(indexHtml)) ||
  /Proto23/.test(indexHtml)
) {
  throw new Error(
    "Metadata regression: index.html must present the game as Echoes Beneath and carry its description, theme colour, icons, and Open Graph tags.",
  );
}

for (const icon of [
  "favicon.ico",
  "icons/icon-192.png",
  "icons/apple-touch-icon.png",
  "icons/og-image.jpg",
]) {
  if (!fs.existsSync(path.join(root, icon)))
    throw new Error(`Metadata regression: ${icon} is referenced but missing.`);
}

if (
  !/const directories = \["changelog", "css", "icons", "locales"\];/.test(
    fs.readFileSync(path.join(root, "scripts", "build-site.js"), "utf8"),
  )
) {
  throw new Error(
    "Deploy regression: the icons directory must be copied into the published site.",
  );
}

const messageLogHistory = [
  /const messageLogStorageKey = "proto23\.messagelog";/,
  /function trimMessageLog\(\)/,
  /function storeMessageLog\(\)/,
  /function restoreMessageLog\(\)/,
  /function clearMessageLog\(\)/,
  /dom\.m_b_3\.addEventListener\("click", clearMessageLog\);/,
  /window\.localStorage\.removeItem\(messageLogStorageKey\)/,
  /dom\.ct_bt4_1b\.max = 50;/,
];

if (
  !messageLogHistory.every((pattern) => pattern.test(interfaceSource)) ||
  !/restoreMessageLog\(\);\s*clearLoadingScreen\(\);/.test(bootstrapSource) ||
  /while \(dom\.gmsgs\.children\[1\]\.children\.length > global\.msgs_max/.test(
    interfaceSource,
  )
) {
  throw new Error(
    "Message log regression: the log must keep its history under its own storage key, trim through the shared helper, and be cleared with it.",
  );
}

const themePreference = [
  /const themeStorageKey = "proto23\.theme";/,
  /function applyBackground\(\)/,
  /function storeBackground\(\)/,
  /function restoreBackgroundPreference\(\)/,
  /setBackground\(255, 255, 255, false\)/,
  /setBackground\(18, 18, 46, false\)/,
];

if (
  !themePreference.every((pattern) => pattern.test(interfaceSource)) ||
  !/if \(!restoreBackgroundPreference\(\)\) applyBackground\(\);/.test(
    bootstrapSource,
  )
) {
  throw new Error(
    "Theme regression: the background preference must persist outside the save and be reapplied on load.",
  );
}

console.log(
  "Validated the shared confirmation modal, callback hooks, save version, and sharing metadata.",
);
const autosavePreference = [
  /const autosaveStorageKey = "proto23\.autosave";/,
  /const autosaveDefaultSeconds = 15;/,
  /function restartAutosave\(\)/,
  /clearInterval\(timers\.autos\);\s*if \(global\.flags\.autosave !== true\) return;/,
  /dom\.autosves\.checked = global\.flags\.autosave === true;/,
  /i18n\.t\("ui\.settings\.autosaveInterval"\)/,
];

if (
  !autosavePreference.every((pattern) => pattern.test(interfaceSource)) ||
  /}, 30000\);/.test(interfaceSource) ||
  /}, 30000\);/.test(bootstrapSource) ||
  !/restoreAutosavePreference\(\);/.test(bootstrapSource)
) {
  throw new Error(
    "Autosave regression: the interval must come from one configurable preference, rebuild the timer on change, and resynchronize its control on load.",
  );
}

// The sort bar used to be laid over the list, which meant the list had to
// reserve room for it and, because its own height was a percentage of a wrapper
// with no height, a long inventory scrolled the whole panel instead — carrying
// the filter row off the top and burying the bar. The panel is a flex column
// now: both bars are fixed and only the list scrolls, so what has to be locked is
// that neither bar can flex away and that the list can actually shrink.
const inventoryPanel = [
  /#inv \{[^}]*display: flex;[^}]*flex-direction: column;[^}]*overflow: hidden;/s,
  /#inv_body \{[^}]*min-height: 0;[^}]*flex: 1 1 auto;/s,
  /#inv_control \{[^}]*flex: 0 0 auto;/s,
  /#inv_ctx_b \{[^}]*min-height: 0;[^}]*flex: 1 1 auto;/s,
  /#inv_control_b \{[^}]*flex: 0 0 auto;/s,
  /#inv_con \{[^}]*min-height: 0;[^}]*overflow: auto;[^}]*flex: 1 1 auto;/s,
];

if (
  !inventoryPanel.every((pattern) => pattern.test(gameCss)) ||
  /#inv_control_b \{[^}]*position: absolute;/s.test(gameCss) ||
  /#inv_con \{[^}]*height: 86%;/s.test(gameCss)
) {
  throw new Error(
    "Inventory regression: the filter row and sort bar must stay pinned while only the item list scrolls, so the panel has to remain a flex column with a shrinkable list.",
  );
}

console.log("Validated message-log history and background preference storage.");
console.log("Validated the autosave preference and inventory panel layout.");

// Skill milestones are saved positionally -- save() writes
// `a6[obj].mst[m] = you.skls[obj].mlstn[m].g` -- so a new milestone must be appended
// to its array, never inserted in level order. Inserting one shifts every granted
// flag after it and re-fires milestones the player already holds. The eight
// weapon-mastery titles above tier two are granted this way, so this has to hold.
const skillsSource = fs.readFileSync(
  path.join(root, "js", "data", "skills.js"),
  "utf8",
);

for (const skill of ["srdc", "axc", "plrmc", "hmrc", "shdc"]) {
  // Located by index rather than by a constructed pattern: the identifiers here
  // contain no regex metacharacters, and plain string work cannot be broken by an
  // escaping mistake.
  const opens = `skl.${skill}.mlstn = [`;
  const start = skillsSource.indexOf(opens);
  const end = start < 0 ? -1 : skillsSource.indexOf("\n];", start);
  if (start < 0 || end < 0) {
    throw new Error(
      `Milestone regression: skl.${skill} has no mlstn array, but it grants a weapon-mastery title.`,
    );
  }
  const body = skillsSource.slice(start + opens.length, end);
  const levels = [...body.matchAll(/lv: (\d+)/g)].map((m) => Number(m[1]));
  if (levels.length < 7) {
    throw new Error(
      `Milestone regression: skl.${skill} has only ${levels.length} milestones; the tiers above two are missing their grant path.`,
    );
  }
  // The originals run to level 11 and the added ones start at 15, so the added ones
  // must sit at the end. Checking the whole array is ascending would be stricter
  // than the save format needs and would forbid a legitimate future insert.
  const firstAdded = levels.findIndex((lv) => lv >= 15);
  if (
    firstAdded === -1 ||
    firstAdded !== levels.length - levels.filter((lv) => lv >= 15).length
  ) {
    throw new Error(
      `Milestone regression: the added milestones on skl.${skill} are not at the end of the array (${levels.join(", ")}). The granted flags are saved by index.`,
    );
  }
}

// Every one of those titles must actually carry the talent that speeds its mastery
// up, or the milestone hands over a cosmetic name.
const masteryTalents = {
  srd3: "srdc",
  srd4: "srdc",
  axc3: "axc",
  lnc3: "plrmc",
  hmr3: "hmrc",
  sld3: "shdc",
  sld4: "shdc",
  sld5: "shdc",
};

for (const [title, skill] of Object.entries(masteryTalents)) {
  const talent = `ttl.${title}.talent = function () {\n  skl.${skill}.p += `;
  if (!titlesSource.includes(talent)) {
    throw new Error(
      `Title regression: ttl.${title} must raise skl.${skill}.p, which is what makes it more than a name.`,
    );
  }
  if (!titlesSource.includes(`ttl.${title}.tdesc = i18n.t(`)) {
    throw new Error(
      `Title regression: ttl.${title} has a talent with nothing telling the player what it does.`,
    );
  }
  if (!skillsSource.includes(`giveTitle(ttl.${title})`)) {
    throw new Error(
      `Title regression: ttl.${title} has no grant path in js/data/skills.js.`,
    );
  }
}

// A shield trains its skill while it is carried, not only when a blow lands on the
// player -- the grant used to exist solely in the branch where a creature hits you.
if (
  (interfaceSource.match(/giveSkExp\(skl\.shdc, [0-9.]+\)/g) || []).length < 2
) {
  throw new Error(
    "Shield regression: shield mastery must also be trained while the player attacks with a shield in hand, not only when a creature's blow lands.",
  );
}

// Every shield has to defend. Eleven of the fourteen shipped with str 0, which made
// them worth exactly as much as an empty hand.
if (/^sld\.[a-z0-9]+\.str = 0;$/m.test(equipmentSource)) {
  throw new Error(
    "Shield regression: a shield is left at str 0, which defends no better than an empty hand.",
  );
}

console.log(
  "Validated weapon-mastery grant paths, positional milestone ordering, and statted shields.",
);
