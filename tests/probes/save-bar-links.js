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
  // The source link came out browser-blue and turned purple once it had been opened: .sl_link
  // set the underline but no colour, so the user agent's own :link and :visited rules won.
  // The version link only escaped because #game-version happened to set a colour of its own,
  // which is why this compares the two rather than checking one in isolation.
  //
  // :visited cannot be measured from script -- getComputedStyle deliberately reports the
  // unvisited colour for privacy -- so what is measured here is the resting colour the two
  // links resolve to and the fact that it is not the user agent's.
  //
  // Measured before the focus check below, not after: focusing the link matches
  // .sl_link:focus-visible and the first version of this read the focused colour off one link
  // and the resting colour off the other, then reported the CSS as broken when it was correct.
  const sourceColour = getComputedStyle(source).color;
  const versionColour = version ? getComputedStyle(version).color : "";
  root.dataset.barSourceColour = sourceColour;
  root.dataset.barLinkColoursMatch = String(sourceColour === versionColour);
  // rgb(0, 0, 238) is the user agent's unvisited link blue and rgb(85, 26, 139) its visited
  // purple. Either one means the bar's own colour never reached the element.
  root.dataset.barSourceNotUaColour = String(
    sourceColour !== "rgb(0, 0, 238)" && sourceColour !== "rgb(85, 26, 139)",
  );

  // An <a href> is focusable without help; this checks it was not made unreachable.
  source.focus();
  root.dataset.barSourceFocusable = String(document.activeElement === source);
  // Both links share the underline class, so they read as links beside the buttons.
  root.dataset.barSourceUnderlined = String(
    getComputedStyle(source).textDecorationLine.includes("underline"),
  );
}, 10);
