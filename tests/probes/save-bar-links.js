// Browser probe for /__test-save-bar-links.html, read by scripts/serve.js and injected into the
// deployed index.html. Runs in the page, not in Node.
//
// The save bar carries two links now: the version, which opens the changelog, and the source,
// which leaves for GitHub. The static check already requires the source URL to match
// package.json's repository field; what it cannot see is whether the link is actually in the bar,
// reachable, and labelled in the player's language. A link built into a container that is
// display:none, or one whose text came back as a raw translation key, would pass every check that
// reads the source.

const linksProbe = setInterval(() => {
  if (typeof dom === "undefined" || !dom.sl_controls) return;
  if (!document.getElementById("ctrmg")) return;
  clearInterval(linksProbe);
  const root = document.documentElement;

  // The bar is hidden until the game opens it, the same as the navigation row.
  global.flags.aw_u = true;
  dom.sl.style.display = "";

  const source = document.getElementById("game-source");
  const version = document.getElementById("game-version");
  root.dataset.barSourceExists = String(!!source);
  root.dataset.barVersionExists = String(!!version);
  if (!source) return;

  root.dataset.barSourceHref = source.getAttribute("href") || "";
  root.dataset.barSourceRel = source.getAttribute("rel") || "";
  root.dataset.barSourceTarget = source.getAttribute("target") || "";
  root.dataset.barSourceText = source.textContent.trim();
  // A translation that did not resolve renders as its own key, which is a bug the project treats
  // as player-facing. The key contains a dot; a real label does not.
  root.dataset.barSourceLabelled = String(
    source.textContent.trim().length > 0 &&
      !source.textContent.includes("ui.save."),
  );
  // Inside the bar rather than merely somewhere in the document, and visible with it.
  root.dataset.barSourceInBar = String(dom.sl.contains(source));
  root.dataset.barSourceVisible = String(
    getComputedStyle(source).display !== "none" &&
      getComputedStyle(source).visibility !== "hidden",
  );
  // An <a href> is focusable without help; this checks it was not made unreachable.
  source.focus();
  root.dataset.barSourceFocusable = String(document.activeElement === source);
  // Both links share the underline class, so they read as links beside the buttons.
  root.dataset.barSourceUnderlined = String(
    getComputedStyle(source).textDecorationLine.includes("underline"),
  );
}, 10);
