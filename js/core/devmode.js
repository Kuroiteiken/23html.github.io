// Temporary development tooling, reached by opening the game with ?devMode=true in the
// address bar. It exists to make the slow parts of testing fast -- waiting a day for a
// vendor to restock, grinding to the level a piece of content is gated behind, walking to
// the scene that content sits in -- and it is meant to come out before the game is
// announced.
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
// gets deployed, so while this is active there is a red box on screen that cannot be closed,
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

  // Beside the message log, measured from the log's own box rather than written as a
  // coordinate. Two reasons: the log ends at about x=1285 in a layout that is nominally
  // 1280 wide, so there is no fixed column to the right to hard-code, and #gmsgs carries
  // `resize: both` -- the player can drag it -- so a fixed left would come unstuck the
  // moment anyone did. offsetWidth includes the log's padding and border.
  // The log starts hidden -- interface.js sets display:none on it until global.flags.aw_u --
  // and a display:none element measures 0 by 0. Placing against that pinned the panel to
  // x=8 and it stayed there, so a zero box means "not measurable yet, leave it alone" and the
  // ResizeObserver below re-places it the moment the log appears. CSS carries a corner
  // position as the starting point for that wait.
  function placeBesideLog() {
    const log = dom.gmsgs;
    if (!log || !log.offsetWidth || !log.offsetHeight) return;
    panel.style.left = `${log.offsetLeft + log.offsetWidth + 8}px`;
    panel.style.top = `${log.offsetTop}px`;
  }
  placeBesideLog();
  window.addEventListener("resize", placeBesideLog);
  if (typeof ResizeObserver !== "undefined" && dom.gmsgs) {
    // Fires on hidden-to-visible as well as on a drag of the log's resize handle.
    new ResizeObserver(placeBesideLog).observe(dom.gmsgs);
  }

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

  tool(
    "Learn all lore",
    "Unlocks every journal entry, including the questions later chapters are built to answer. The panel is hard to review otherwise -- most of it is gated behind story beats.",
    () => {
      const keys = Object.keys(lore);
      learnLore.apply(null, keys);
      return `Journal now holds ${global.lore.length} of ${keys.length} entries.`;
    },
  );

  tool(
    "Save/load round trip",
    "Saves and immediately reloads. The save format is positional, so a field written in the wrong order corrupts quietly -- this surfaces it straight away instead of on someone else's machine.",
    () => {
      const before = { lvl: you.lvl, wealth: you.wealth, minute: time.minute };
      save();
      load();
      const same =
        you.lvl === before.lvl &&
        you.wealth === before.wealth &&
        time.minute === before.minute;
      return same
        ? "Round trip clean: level, purse and clock survived."
        : `Round trip CHANGED something: level ${before.lvl}->${you.lvl}, purse ${before.wealth}->${you.wealth}, minute ${before.minute}->${time.minute}.`;
    },
  );

  // One command field rather than a field per registry. Grants an item, jumps to a scene,
  // awards a title, unlocks a journal entry, or sets a mastery's level, dispatched on the
  // registry the key names.
  //
  // Everything is looked up dynamically on purpose: scripts/report-pending.js counts
  // literal giveItem(acc.medl5) calls as a source of an item, so a hardcoded grant in dev
  // tooling would make an unobtainable item report itself as obtainable.
  const commandRow = addElement(body, "div", null, "dev-mode-row");
  const commandInput = addElement(commandRow, "input", null, "dev-mode-input");
  commandInput.type = "text";
  commandInput.placeholder = "acc.medl5";
  commandInput.title = [
    "registry.key, then Enter:",
    "  item|eqp|wpn|sld|acc.key   grant it",
    "  chss.key                   go to that scene",
    "  ttl.key                    award that title",
    "  lore.key                   unlock that journal entry",
    "  skl.key 10                 set that mastery's level",
  ].join("\n");
  const commandButton = addElement(commandRow, "button", null, "dev-mode-tool");
  commandButton.type = "button";
  commandButton.textContent = "Run";

  function runCommand() {
    const typed = commandInput.value.trim();
    if (!typed) {
      report("Type registry.key. Hover the field for the list.");
      return;
    }
    // A trailing number is an argument: "skl.shdc 10".
    const spaced = typed.split(/\s+/);
    const target = spaced[0];
    const argument = spaced.length > 1 ? Number(spaced[1]) : undefined;
    const dot = target.indexOf(".");
    if (dot < 1) {
      report('Type registry.key, for example "acc.medl5".');
      return;
    }
    const registryName = target.slice(0, dot);
    const key = target.slice(dot + 1);

    const grantRegistries = { item, eqp, wpn, sld, acc };
    const handlers = {
      chss: (thing) => {
        smove(thing);
        return `Moved to ${registryName}.${key}.`;
      },
      ttl: (thing) => {
        giveTitle(thing);
        return `Gave title ${thing.name}.`;
      },
      lore: () => {
        const learned = learnLore(key);
        return learned
          ? `Unlocked lore.${key}.`
          : `lore.${key} was already known.`;
      },
      skl: (thing) => {
        if (!Number.isFinite(argument)) {
          return `skl.${key} needs a level: "skl.${key} 10".`;
        }
        thing.lvl = argument;
        return `${thing.name} is level ${thing.lvl}.`;
      },
    };

    const registry = grantRegistries[registryName]
      ? grantRegistries[registryName]
      : { chss, ttl, lore, skl }[registryName];
    if (!registry) {
      report(
        `No registry named "${registryName}". Try ${[...Object.keys(grantRegistries), "chss", "ttl", "lore", "skl"].join(", ")}.`,
      );
      return;
    }
    const thing = registry[key];
    if (!thing) {
      report(`${registryName} has no "${key}".`);
      return;
    }
    try {
      if (handlers[registryName]) {
        report(handlers[registryName](thing));
      } else {
        giveItem(thing);
        report(`Gave ${thing.name}.`);
      }
    } catch (error) {
      report(`Failed: ${error && error.message ? error.message : error}`);
    }
  }

  commandButton.addEventListener("click", runCommand);
  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runCommand();
    }
    // The game binds number keys to quick item use, so a key pressed in this field must not
    // reach it.
    event.stopPropagation();
  });

  return true;
}
