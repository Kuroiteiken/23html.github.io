// Temporary development tooling, reached by opening the game with ?devMode=true in the
// address bar. It exists to make the slow parts of testing fast -- waiting a day for a
// vendor to restock, grinding to the level a piece of content is gated behind -- and it is
// meant to come out before the game is announced.
//
// Two properties it has to hold, both from the constraint it was asked for under: it must
// come out cleanly, and it must not be openable from the console.
//
// 1. One switch. Setting DEV_MODE_ENABLED to false turns off every dev feature at once,
//    including the marker, and leaves nothing behind that a player can reach. Removing the
//    feature entirely is then two more edits: delete this file and its line in
//    scripts/sources.js. Nothing outside this file knows what any of the tools are.
//
// 2. Nothing to flip at run time. The flag is read from the address bar once, while the
//    bundle is still evaluating, into a top-level const. A const can be read from the
//    console but not assigned, so there is no `global.devMode = true` to set. The tools are
//    inner functions of initDevMode rather than global names, so none of them can be called
//    directly either, and initDevMode -- the one global this file adds -- reads the value
//    captured at load rather than looking at the URL again, so rewriting the address with
//    history.pushState afterwards does nothing. Turning dev mode on means reloading with the
//    query string in the address bar, deliberately.
//
// The panel is deliberately loud. A dev build that looks like a normal build is one that
// gets deployed, so while this is active there is a red bar on screen that cannot be closed,
// only collapsed.

// The single switch. false disables dev mode completely.
const DEV_MODE_ENABLED = true;

// Read once, at load. `typeof window` is checked because the test harness loads this bundle
// into a Node vm context that has no address bar, and a throw here would take the whole
// bundle down -- which is how a missing sector broke every check that loads the game.
const DEV_MODE_ACTIVE =
  DEV_MODE_ENABLED &&
  typeof window !== "undefined" &&
  typeof window.location !== "undefined" &&
  new URL(window.location.href).searchParams.get("devMode") === "true";

// Built once. startGame calls this after load(), so the player and the vendors exist.
function initDevMode() {
  if (!DEV_MODE_ACTIVE) return false;
  if (document.getElementById("dev-mode")) return false;

  const panel = addElement(document.body, "div", "dev-mode", null);
  const header = addElement(panel, "div", "dev-mode-header", null);
  const title = addElement(header, "span", null, "dev-mode-title");
  title.textContent = "DEV MODE";
  const collapse = addElement(header, "button", null, "dev-mode-collapse");
  collapse.type = "button";
  collapse.textContent = "−";
  collapse.title =
    "Collapse. Dev mode stays on until the page is reloaded without the flag.";

  const body = addElement(panel, "div", "dev-mode-body", null);
  const status = addElement(panel, "div", "dev-mode-status", null);
  status.textContent = "Ready.";

  collapse.addEventListener("click", () => {
    const collapsed = panel.classList.toggle("dev-mode--collapsed");
    collapse.textContent = collapsed ? "+" : "−";
  });

  function report(text) {
    status.textContent = text;
  }

  // Every tool runs behind this, so a throw inside one reports itself in the panel instead
  // of dying silently in a click handler the way the rest of the game's buttons would.
  function tool(label, hint, run) {
    const button = addElement(body, "button", null, "dev-mode-tool");
    button.type = "button";
    button.textContent = label;
    button.title = hint;
    button.addEventListener("click", () => {
      try {
        report(run() || "Done.");
      } catch (error) {
        report(`Failed: ${error && error.message ? error.message : error}`);
      }
    });
    return button;
  }

  tool(
    "Restock markets",
    "Runs each vendor's own restock, rather than reimplementing it: sets the countdown to one day and calls onDayPass, which restocks, resets the timer and fires onRestock and extra.",
    () => {
      let restocked = 0;
      for (const key in vendor) {
        const vnd = vendor[key];
        if (!vnd.data || typeof vnd.onDayPass !== "function") continue;
        vnd.data.time = 1;
        vnd.onDayPass();
        restocked++;
      }
      return `Restocked ${restocked} vendor(s).`;
    },
  );

  tool(
    "Advance one day",
    "Adds a day to the minute count. The day-pass hooks fire on the next tick, once, the same as a day passing normally.",
    () => {
      time.minute += 1440;
      return `Day advanced. Minute is now ${time.minute}.`;
    },
  );

  tool("+1000 mon", "Straight into the purse, no multipliers applied.", () => {
    giveWealth(1000);
    return "Gave 1000.";
  });

  tool(
    "+5 levels",
    "Five calls' worth of levelling in one, through the game's own lvlup, so the stat rolls are the real ones.",
    () => {
      lvlup(you, 5);
      you.stat_r();
      return `Now level ${you.lvl}.`;
    },
  );

  tool("Full heal", "Health and stamina back to maximum.", () => {
    you.hp = you.hpmax;
    you.sat = you.satmax;
    return "Healed.";
  });

  // Grants by registry and key, looked up at click time from a string the tester types.
  // Deliberately not written as giveItem(acc.medl5): scripts/report-pending.js counts
  // literal giveItem calls as a source of an item, so a hardcoded grant in here would make
  // an unobtainable item report itself as obtainable.
  const grantRow = addElement(body, "div", null, "dev-mode-row");
  const grantInput = addElement(grantRow, "input", null, "dev-mode-input");
  grantInput.type = "text";
  grantInput.placeholder = "acc.medl5";
  grantInput.title =
    "registry.key -- one of item, eqp, wpn, sld, acc. Enter grants it.";
  const grantButton = addElement(grantRow, "button", null, "dev-mode-tool");
  grantButton.type = "button";
  grantButton.textContent = "Grant";

  function grant() {
    const typed = grantInput.value.trim();
    const parts = typed.split(".");
    if (parts.length !== 2) {
      report('Type registry.key, for example "acc.medl5".');
      return;
    }
    const registries = { item, eqp, wpn, sld, acc };
    const registry = registries[parts[0]];
    if (!registry) {
      report(
        `No registry named "${parts[0]}". Try ${Object.keys(registries).join(", ")}.`,
      );
      return;
    }
    const thing = registry[parts[1]];
    if (!thing) {
      report(`${parts[0]} has no "${parts[1]}".`);
      return;
    }
    try {
      giveItem(thing);
      report(`Gave ${thing.name}.`);
    } catch (error) {
      report(`Failed: ${error && error.message ? error.message : error}`);
    }
  }

  grantButton.addEventListener("click", grant);
  grantInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      grant();
    }
    // The game binds number keys to quick item use, so a key pressed in this field must not
    // reach it.
    event.stopPropagation();
  });

  return true;
}
