// Browser probe for /__test-combat-layout.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const combatLayoutProbe = setInterval(() => {
  const player = document.getElementById("player-panel");
  const enemy = document.getElementById("enemy-panel");
  if (!player || !enemy || !document.getElementById("ctrmg")) return;
  global.flags.btl = false;
  player.style.display = "";
  player.style.left = "8px";
  enemy.style.display = "";
  enemy.style.left = "457px";
  enemy.style.top = "8px";
  const playerBounds = player.getBoundingClientRect();
  const enemyBounds = enemy.getBoundingClientRect();
  document.documentElement.dataset.combatPanelsSeparated = String(
    enemyBounds.left >= playerBounds.right &&
      playerBounds.left < enemyBounds.left,
  );

  // The battle control row and the area readout are both anchored to the
  // bottom of the enemy panel, so they have to stack rather than cover
  // each other. Forced here with the longest area name the game defines
  // plus an infinite size, which is what used to wrap the readout onto a
  // second line and bury the row.
  const longest = Object.keys(area)
    .map((key) => area[key].name || "")
    .reduce((a, b) => (b.length > a.length ? b : a), "");
  global.current_z = { name: longest, size: -1 };
  dom.d7m.update();

  // Populate the enemy's effect strip. eff_d routes by target, and in rain
  // or cold every enemy that spawns is given one of these, so a populated
  // strip is the normal case rather than an edge case.
  for (const eff of [effect.wet, effect.cold, effect.psn])
    eff_d(eff, eff.x, eff.c, eff.b, { id: -999 });

  const controls = document.getElementById("bbts");
  const areaInfo = document.getElementById("ainfo");
  const controlBounds = controls.getBoundingClientRect();
  const areaBounds = areaInfo.getBoundingClientRect();
  const scale = Number(document.documentElement.dataset.uiScale) || 1;
  const stacked = areaBounds.top >= controlBounds.bottom - 0.5;
  const bothInsidePanel =
    controlBounds.top >= enemyBounds.top - 0.5 &&
    areaBounds.bottom <= enemyBounds.bottom + 0.5;
  const readoutStaysOneLine =
    areaInfo.getBoundingClientRect().height / scale <= 20;

  // The enemy's effect icons are a third strip in the same corner and must
  // stack above the control row rather than being painted over by it.
  const enemyStrip = enemy.querySelector("#se_i");
  const icons = [...enemyStrip.querySelectorAll(".se_ia")];
  const iconBounds = icons.map((icon) => icon.getBoundingClientRect());
  const iconsClearControls =
    iconBounds.length > 0 &&
    iconBounds.every((bounds) => bounds.bottom <= controlBounds.top + 0.5);
  const iconsInsidePanel = iconBounds.every(
    (bounds) => bounds.top >= enemyBounds.top - 0.5,
  );

  const battleChecks = {
    stacked,
    bothInsidePanel,
    readoutStaysOneLine,
    iconsClearControls,
    iconsInsidePanel,
  };
  document.documentElement.dataset.battleRowsStacked = String(
    Object.values(battleChecks).every(Boolean),
  );
  document.documentElement.dataset.battleRowFailures = Object.keys(battleChecks)
    .filter((name) => !battleChecks[name])
    .concat("icons=" + icons.length)
    .join(",");
  document.documentElement.dataset.battleRowGap = (
    (areaBounds.top - controlBounds.bottom) /
    scale
  ).toFixed(1);
  clearInterval(combatLayoutProbe);
}, 10);
