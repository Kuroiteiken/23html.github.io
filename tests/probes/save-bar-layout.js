// Browser probe for /__test-save-bar-layout.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const saveBarLayoutProbe = setInterval(() => {
  const bar = document.getElementById("sl");
  const controls = document.getElementById("save-bar-controls");
  if (!document.getElementById("ctrmg") || !bar || !controls) return;
  clearInterval(saveBarLayoutProbe);
  const barBounds = bar.getBoundingClientRect();
  const controlBounds = [...controls.children].map((child) =>
    child.getBoundingClientRect(),
  );
  const controlsSeparated = controlBounds.every(
    (bounds, index) =>
      index === 0 || bounds.left >= controlBounds[index - 1].right,
  );
  const controlsInsideBar = controlBounds.every(
    (bounds) =>
      bounds.left >= barBounds.left &&
      bounds.right <= barBounds.right &&
      bounds.top >= barBounds.top &&
      bounds.bottom <= barBounds.bottom,
  );
  const collapseFollowsSaveAndLoad =
    bar.children[0]?.id === "save-game" &&
    bar.children[1]?.id === "load-game" &&
    bar.children[2]?.id === "save-bar-collapse";

  // The bar is fixed to the viewport's bottom edge, so it has to clear the
  // game's own bottom row by a slight gap without leaving a wide empty band
  // above itself. Removing the reservation entirely took the gap to zero and
  // the tabs ended up touching the bar, so it is back and this asserts it.
  const gameBounds = document.getElementById("ctrmg").getBoundingClientRect();
  const scale = Number(document.documentElement.dataset.uiScale) || 1;
  const gapAboveBar = (barBounds.top - gameBounds.bottom) / scale;
  const clearsGame = gapAboveBar >= 0;
  // Only meaningful while the game is scaled down to fit. On a window
  // tall enough to need no scaling the bar just sits on the viewport's
  // bottom edge, wherever that falls.
  const gapIsSlight = scale >= 1 || gapAboveBar <= 24;

  document.documentElement.dataset.saveBarControlsSeparated = String(
    controlsSeparated && controlsInsideBar && collapseFollowsSaveAndLoad,
  );
  document.documentElement.dataset.saveBarClearsGame = String(
    clearsGame && gapIsSlight,
  );
  document.documentElement.dataset.saveBarGap = gapAboveBar.toFixed(1);
}, 10);
