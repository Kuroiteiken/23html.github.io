// Browser probe for /__test-dev-mode.html. Runs in the page, not in Node.
//
// Dev mode was asked for under two constraints: it has to come out cleanly before the game is
// announced, and it must not be openable from the console. Neither is something source review
// can settle -- "there is no writable global" is a claim about the running page -- so this
// measures both, and the same probe is loaded twice by the browser test: once with
// ?devMode=true and once without.
//
// What is checked without the flag is the important half. A dev panel that only appears with
// the flag is a feature; one that a player can reach is a hole in the build.

const devModeProbe = setInterval(() => {
  if (typeof dom === "undefined" || !document.getElementById("ctrmg")) return;
  clearInterval(devModeProbe);
  const root = document.documentElement;

  const flagged =
    new URL(window.location.href).searchParams.get("devMode") === "true";
  root.dataset.devFlagged = String(flagged);

  // Is the panel on screen? Asked of the document rather than of any variable, because this is
  // what a player would actually be able to reach.
  const panel = document.getElementById("dev-mode");
  root.dataset.devPanelExists = String(!!panel);
  root.dataset.devPanelVisible = String(
    !!panel &&
      getComputedStyle(panel).display !== "none" &&
      getComputedStyle(panel).visibility !== "hidden",
  );
  // The marker has to be legible while it is up, or a dev build stops looking like one.
  root.dataset.devMarkerText = panel
    ? (panel.textContent || "").includes("DEV MODE").toString()
    : "false";
  root.dataset.devToolCount = String(
    panel ? panel.querySelectorAll(".dev-mode-tool").length : 0,
  );

  // ---- the console cannot open it ----
  //
  // Three ways someone would try, all attempted here rather than argued about.

  // 1. Assigning the flag. It is a top-level const, so this must throw in strict mode or be
  //    silently ignored in sloppy mode -- either way the value must not change.
  let assignRefused = false;
  try {
    // eslint-disable-next-line no-global-assign, no-implicit-globals
    DEV_MODE_ACTIVE = true;
    assignRefused = DEV_MODE_ACTIVE !== true || flagged;
  } catch (error) {
    assignRefused = true;
  }
  root.dataset.devAssignRefused = String(assignRefused);

  // 2. Setting a global the game might read. There must not be one -- the flag lives in a
  //    const, not on `global` or `window`, so nothing picks this up.
  window.devMode = true;
  if (typeof global !== "undefined") global.devMode = true;

  // 3. Rewriting the address and re-running the initialiser. initDevMode reads the value
  //    captured while the bundle was evaluating, so a URL changed afterwards is not consulted.
  let builtByConsole = false;
  try {
    window.history.pushState({}, "", "?devMode=true");
    initDevMode();
    builtByConsole = !!document.getElementById("dev-mode");
  } catch (error) {
    builtByConsole = false;
  }
  // With the flag already on, the panel was there before any of this and one panel is still
  // the right answer; without it, nothing above may have produced one.
  root.dataset.devConsoleCannotOpen = String(flagged ? true : !builtByConsole);
  root.dataset.devPanelCount = String(
    document.querySelectorAll("#dev-mode").length,
  );

  // ---- the tools do what they say ----
  //
  // Only meaningful with the flag on. Each is driven by clicking the button, not by calling
  // the function, because the functions are deliberately not reachable from here either.
  if (!panel) {
    root.dataset.devToolsRan = "skipped";
    return;
  }

  const buttons = [...panel.querySelectorAll(".dev-mode-tool")];
  function clickTool(label) {
    const button = buttons.find((b) => b.textContent.trim() === label);
    if (!button) return false;
    button.click();
    return true;
  }

  // Restocking: every vendor's stock is emptied first, so a non-empty stock afterwards is the
  // vendor's own restock path having run rather than a leftover.
  let vendorsWithStock = 0;
  let vendorCount = 0;
  for (const key in vendor) {
    vendorCount++;
    vendor[key].stock = [];
  }
  clickTool("Restock markets");
  for (const key in vendor) {
    if (Array.isArray(vendor[key].stock) && vendor[key].stock.length > 0)
      vendorsWithStock++;
  }
  root.dataset.devVendorCount = String(vendorCount);
  root.dataset.devVendorsRestocked = String(vendorsWithStock);
  root.dataset.devRestockWorked = String(vendorsWithStock > 0);

  // Beside the log. The log is display:none until global.flags.aw_u, exactly like the save
  // bar, and the first version of this measured it hidden: a 0x0 box made "the panel is right
  // of the log" and "their tops line up" pass trivially against zero, and the panel really was
  // pinned to x=8. So the log is shown first, and dev-log-measurable is a required assertion --
  // without it this whole section can go back to passing for the wrong reason.
  //
  // offsetLeft/offsetWidth/offsetTop rather than getBoundingClientRect: the game sets
  // document.body.style.zoom to fit the viewport, so client rectangles are scaled and a
  // pixel threshold on them means something different at every window size.
  global.flags.aw_u = true;
  dom.gmsgs.style.display = "";
  const log = dom.gmsgs;
  window.dispatchEvent(new Event("resize"));

  root.dataset.devLogMeasurable = String(
    log.offsetWidth > 0 && log.offsetHeight > 0,
  );
  root.dataset.devLogWidth = String(log.offsetWidth);
  root.dataset.devPanelRightOfLog = String(
    panel.offsetLeft >= log.offsetLeft + log.offsetWidth,
  );
  root.dataset.devPanelNearLog = String(
    panel.offsetLeft - (log.offsetLeft + log.offsetWidth) < 40,
  );
  root.dataset.devPanelTopsAlign = String(
    Math.abs(panel.offsetTop - log.offsetTop) < 4,
  );

  // Glued: widening the log has to move the panel with it. #gmsgs is resize: both, so this is
  // something a person can do by dragging.
  const leftBefore = panel.offsetLeft;
  const widthBefore = log.offsetWidth;
  log.style.width = `${log.offsetWidth + 60}px`;
  window.dispatchEvent(new Event("resize"));
  const leftAfter = panel.offsetLeft;
  root.dataset.devLogWidthBefore = String(widthBefore);
  root.dataset.devLogWidthAfter = String(log.offsetWidth);
  root.dataset.devPanelLeftBefore = String(leftBefore);
  root.dataset.devPanelLeftAfter = String(leftAfter);
  root.dataset.devPanelStyleLeft = panel.style.left;
  root.dataset.devPanelFollowsLog = String(leftAfter - leftBefore >= 50);
  log.style.width = "";
  window.dispatchEvent(new Event("resize"));

  const minuteBefore = time.minute;
  clickTool("Advance one day");
  root.dataset.devDayAdvanced = String(time.minute - minuteBefore === 1440);

  const levelBefore = you.lvl;
  clickTool("+5 levels");
  root.dataset.devLevelsGiven = String(you.lvl - levelBefore === 5);

  you.hp = 1;
  clickTool("Full heal");
  root.dataset.devHealed = String(you.hp === you.hpmax);

  // The command field, driven the way a tester would: type, press Enter, read the status line.
  function runCommand(text) {
    const input = panel.querySelector(".dev-mode-input");
    input.value = text;
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    return (
      document.getElementById("dev-mode-status").textContent || ""
    ).trim();
  }

  runCommand("acc.medl5");
  // `inv` is the inventory array -- declared `var inv = []` in bootstrap.js. Guessed as
  // `you.items` first, which is undefined, and the probe threw: the third time in this work
  // that a field name was assumed from its meaning rather than read from the source.
  root.dataset.devGrantWorked = String(
    inv.some((it) => it && it.id === acc.medl5.id),
  );

  runCommand("skl.shdc 12");
  root.dataset.devSkillSet = String(skl.shdc.lvl === 12);

  const loreBefore = global.lore.length;
  runCommand("lore.underTheSouth");
  root.dataset.devLoreLearned = String(global.lore.length > loreBefore);

  root.dataset.devBadCommandReported = String(
    runCommand("nosuch.thing").includes("No registry"),
  );

  const allLore = [...panel.querySelectorAll(".dev-mode-tool")].find(
    (b) => b.textContent.trim() === "Learn all lore",
  );
  allLore.click();
  root.dataset.devAllLoreLearned = String(
    global.lore.length >= Object.keys(lore).length,
  );

  root.dataset.devStatus = (
    document.getElementById("dev-mode-status")?.textContent || ""
  ).trim();
  root.dataset.devToolsRan = "true";
}, 10);
