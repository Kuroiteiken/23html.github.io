// Browser probe for /__test-player-name-safety.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// The player's name is the one piece of player-authored text the game draws, and it
// reaches three surfaces that are built as HTML: the HUD, the hover description beside
// it, and every combat line that names them. A save is exported and shared as a file,
// and the message log persists under its own storage key, so a name carrying a tag is
// not merely a player's own problem -- it would run in the page of whoever opened that
// save, and keep running after a reload.
//
// So the probe types a name that would execute if either protection were missing, and
// records what actually happened: whether a script element exists in the HUD, whether an
// injected handler ever ran, and what the name became.

const nameProbe = setInterval(() => {
  const field = document.getElementById("nch");
  if (!field || !document.getElementById("ctrmg")) return;
  clearInterval(nameProbe);
  const root = document.documentElement;

  // A payload that runs on its own the moment it is parsed as markup, so nothing has to
  // be clicked for the failure to show.
  window.__nameProbeFired = false;
  const payload = '<img src=x onerror="window.__nameProbeFired = true">';

  field.dispatchEvent(new Event("focusin"));
  field.value = payload;
  field.dispatchEvent(new Event("focusout"));

  const hud = document.querySelector("#player-panel .d2 div");
  root.dataset.nameStored = you.name;
  root.dataset.nameHudHtml = hud ? hud.innerHTML : "MISSING";
  root.dataset.nameHudText = hud ? hud.textContent : "MISSING";
  // The two ways it could have gone wrong, asked separately: markup built in the HUD,
  // and a handler that actually ran.
  root.dataset.nameHudHasElement = String(hud ? hud.children.length > 0 : true);
  root.dataset.nameStoredHasBracket = String(/[<>]/.test(you.name));

  // The name also travels through the combat log. Written here through the same msg()
  // the game uses, with the stored name, to check the log does not build it as markup
  // either -- msg() composes HTML on purpose for its colours, so what matters is that
  // the name arriving there can no longer carry a tag.
  clearMessageLog();
  msg(you.name);
  const row = dom.mscont.lastElementChild;
  root.dataset.nameLogHasElement = String(
    row ? row.querySelectorAll("img").length > 0 : true,
  );

  setTimeout(() => {
    root.dataset.nameProbeFired = String(window.__nameProbeFired === true);
  }, 100);
}, 10);
