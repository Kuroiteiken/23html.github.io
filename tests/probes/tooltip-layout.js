// Browser probe for /__test-tooltip-layout.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const tooltipLayoutProbe = setInterval(() => {
  if (!document.getElementById("ctrmg") || typeof dscr !== "function") {
    return;
  }
  clearInterval(tooltipLayoutProbe);
  const firstPointer = { clientX: 220, clientY: 220 };
  dscr(firstPointer, null, 2, "Tooltip", "Localized description");
  const firstBounds = document.getElementById("dscr").getBoundingClientRect();
  const floatsBelowPointer =
    firstBounds.left > firstPointer.clientX &&
    firstBounds.top > firstPointer.clientY;
  const edgePointer = {
    clientX: window.innerWidth - 2,
    clientY: window.innerHeight - 2,
  };
  dscr(edgePointer, null, 2, "Tooltip", "Localized description");
  const edgeBounds = document.getElementById("dscr").getBoundingClientRect();
  const staysInViewport =
    edgeBounds.left >= 0 &&
    edgeBounds.top >= 0 &&
    edgeBounds.right <= window.innerWidth &&
    edgeBounds.bottom <= window.innerHeight;
  document.documentElement.dataset.tooltipBelow = String(floatsBelowPointer);
  document.documentElement.dataset.tooltipInViewport = String(staysInViewport);
  document.documentElement.dataset.tooltipFirstBounds = [
    firstBounds.left,
    firstBounds.top,
    firstBounds.right,
    firstBounds.bottom,
  ].join(",");
  document.documentElement.dataset.tooltipEdgeBounds = [
    edgeBounds.left,
    edgeBounds.top,
    edgeBounds.right,
    edgeBounds.bottom,
  ].join(",");
  document.documentElement.dataset.tooltipPositioned = String(
    floatsBelowPointer && staysInViewport,
  );

  // An item tooltip's last rows used to fight over one corner: the rarity
  // row sits there in normal flow while the kill counter and the
  // durability gauge were both pinned to it absolutely.
  const weapon = wpn.bsrd;
  weapon.data = Object.assign({}, weapon.data, { kills: 148 });
  weapon.rar = 5;
  dscr(firstPointer, weapon, 1);

  const tooltip = document.getElementById("dscr");
  const tooltipBounds = tooltip.getBoundingClientRect();
  const kills = tooltip.querySelector(".item-description-kills");
  const classRow = document.getElementById("intfffx");
  const rarity = tooltip.querySelector(".item-rarity");
  const gauge = document.getElementById("dr_l");

  const killBounds = kills.getBoundingClientRect();
  const classBounds = classRow.getBoundingClientRect();
  const rarityBounds = rarity.getBoundingClientRect();
  const gaugeBounds = gauge.getBoundingClientRect();
  const rarityText = rarity.querySelector("small").getBoundingClientRect();

  const killsShown = killBounds.width > 0 && kills.textContent.includes("148");
  // On the class row, not on top of the rarity row.
  const killsOnClassRow =
    killBounds.top >= classBounds.top - 0.5 &&
    killBounds.bottom <= classBounds.bottom + 0.5;
  const killsClearOfRarity = killBounds.bottom <= rarityBounds.top + 0.5;
  // Held against the right edge rather than the left.
  const killsHeldRight =
    killBounds.right <= tooltipBounds.right + 0.5 &&
    killBounds.right > tooltipBounds.left + (tooltipBounds.width * 2) / 3;
  // The stars stop before the gauge instead of running under it.
  const rarityClearOfGauge = rarityText.right <= gaugeBounds.left + 0.5;
  const rowsInsideTooltip =
    classBounds.top >= tooltipBounds.top - 0.5 &&
    rarityBounds.bottom <= tooltipBounds.bottom + 0.5;

  const checks = {
    killsShown,
    killsOnClassRow,
    killsClearOfRarity,
    killsHeldRight,
    rarityClearOfGauge,
    rowsInsideTooltip,
  };
  document.documentElement.dataset.itemFooterVerified = String(
    Object.values(checks).every(Boolean),
  );
  document.documentElement.dataset.itemFooterFailures = Object.keys(checks)
    .filter((name) => !checks[name])
    .join(",");
}, 10);
