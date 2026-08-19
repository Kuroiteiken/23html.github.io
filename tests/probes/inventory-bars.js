// Browser probe for /__test-inventory-bars.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const inventoryBarsProbe = setInterval(() => {
  const panel = document.getElementById("inv");
  const list = document.getElementById("inv_con");
  if (!document.getElementById("ctrmg") || !panel || !list) return;
  if (typeof giveItem !== "function" || typeof isort !== "function") return;
  clearInterval(inventoryBarsProbe);

  panel.style.display = "";

  // Long enough that the list cannot possibly fit, which is when the
  // filter row used to scroll off the top and the sort bar got buried.
  const stock = Object.keys(item)
    .map((key) => item[key])
    .filter((entry) => entry && entry.id && entry.name)
    .slice(0, 60);
  for (const entry of stock) giveItem(entry, 3);
  isort(1);

  const filters = document.getElementById("inv_control");
  const bottom = document.getElementById("inv_control_b");
  const money = document.getElementById("mn");

  const panelBounds = panel.getBoundingClientRect();
  const filterBounds = filters.getBoundingClientRect();
  const listBounds = list.getBoundingClientRect();
  const bottomBounds = bottom.getBoundingClientRect();
  const moneyBounds = money.getBoundingClientRect();

  const rowCount = list.children.length;
  // Both bars fully inside the panel, and the list strictly between them.
  const filtersVisible =
    filterBounds.top >= panelBounds.top - 0.5 &&
    filterBounds.bottom <= panelBounds.bottom + 0.5 &&
    filterBounds.height > 0;
  const bottomVisible =
    bottomBounds.bottom <= panelBounds.bottom + 0.5 &&
    bottomBounds.top >= panelBounds.top - 0.5 &&
    bottomBounds.height > 0;
  const listBetweenBars =
    listBounds.top >= filterBounds.bottom - 0.5 &&
    listBounds.bottom <= bottomBounds.top + 0.5;
  // The list scrolls inside itself rather than scrolling the panel.
  const listScrolls = list.scrollHeight > list.clientHeight + 1;
  const panelDoesNotScroll = panel.scrollHeight <= panel.clientHeight + 1;
  // Scrolling the list to the end must not move either bar.
  list.scrollTop = list.scrollHeight;
  const barsHeldAfterScroll =
    Math.abs(filters.getBoundingClientRect().top - filterBounds.top) <= 0.5 &&
    Math.abs(bottom.getBoundingClientRect().bottom - bottomBounds.bottom) <=
      0.5;
  const moneyInsideBar =
    moneyBounds.right <= bottomBounds.right + 0.5 &&
    moneyBounds.top >= bottomBounds.top - 0.5 &&
    moneyBounds.bottom <= bottomBounds.bottom + 0.5;

  const checks = {
    filtersVisible,
    bottomVisible,
    listBetweenBars,
    listScrolls,
    panelDoesNotScroll,
    barsHeldAfterScroll,
    moneyInsideBar,
  };
  document.documentElement.dataset.inventoryBarsVerified = String(
    Object.values(checks).every(Boolean) && rowCount >= 20,
  );
  document.documentElement.dataset.inventoryBarsFailures = Object.keys(checks)
    .filter((name) => !checks[name])
    .concat(rowCount >= 20 ? [] : ["rows=" + rowCount])
    .join(",");
}, 10);
