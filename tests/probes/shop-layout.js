// Browser probe for /__test-shop-layout.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const shopLayoutProbe = setInterval(() => {
  if (
    !document.getElementById("ctrmg") ||
    typeof chs_spec !== "function" ||
    typeof rendershopitem !== "function" ||
    typeof restock !== "function" ||
    typeof vendor === "undefined" ||
    !vendor.grc1
  )
    return;
  clearInterval(shopLayoutProbe);

  // Stock is generated when a vendor restocks, so a fresh game has none.
  restock(vendor.grc1);
  chs_spec(4, vendor.grc1);

  const panel = dom.ch_1.getBoundingClientRect();
  const list = dom.ch_1h.getBoundingClientRect();
  const footer = dom.ch_1c.getBoundingClientRect();
  const price = dom.ch_1e.getBoundingClientRect();
  const reputation = dom.ch_2e.getBoundingClientRect();

  // The readouts belong on the bottom edge of the shop panel, directly
  // below the stock list rather than floating short of it.
  const footerOnBottom = Math.abs(footer.bottom - panel.bottom) <= 1;
  const footerBelowList = Math.abs(footer.top - list.bottom) <= 1;
  const footerVisible = footer.height >= 8;
  const readoutsInside =
    price.left >= footer.left - 1 &&
    price.bottom <= footer.bottom + 1 &&
    reputation.right <= footer.right + 1 &&
    reputation.bottom <= footer.bottom + 1;
  const readoutsSeparated = price.right <= reputation.left;
  const priceShown = dom.ch_1e.textContent.includes("%");
  const reputationShown = dom.ch_2e.textContent.trim().length > 0;

  // A shop with more stock than fits must scroll inside the list instead
  // of pushing the footer out of the panel.
  for (let extra = 0; extra < 60; extra++)
    rendershopitem(dom.ch_1h, vendor.grc1.stock[0], vendor.grc1);
  const grownPanel = dom.ch_1.getBoundingClientRect();
  const grownFooter = dom.ch_1c.getBoundingClientRect();
  const footerHeldBottom =
    Math.abs(grownFooter.bottom - grownPanel.bottom) <= 1;
  const listScrolls = dom.ch_1h.scrollHeight > dom.ch_1h.clientHeight + 1;

  const checks = {
    footerOnBottom,
    footerBelowList,
    footerVisible,
    readoutsInside,
    readoutsSeparated,
    priceShown,
    reputationShown,
    footerHeldBottom,
    listScrolls,
  };
  document.documentElement.dataset.shopLayoutVerified = String(
    Object.values(checks).every(Boolean),
  );
  document.documentElement.dataset.shopLayoutFailures = Object.keys(checks)
    .filter((name) => !checks[name])
    .join(",");
  const parent = dom.ch_1.parentElement;
  document.documentElement.dataset.shopLayoutMetrics = [
    "panelClient=" + dom.ch_1.clientHeight,
    "parentClient=" + parent.clientHeight,
    "parentStyleHeight=" + getComputedStyle(parent).height,
    "parentInline=" + (parent.style.height || "(none)"),
    "panelStyleHeight=" + getComputedStyle(dom.ch_1).height,
    "listClient=" + dom.ch_1h.clientHeight,
    "listScroll=" + dom.ch_1h.scrollHeight,
    "rows=" + dom.ch_1h.children.length,
    "parentId=" + (parent.id || "(none)"),
  ].join(" ");
}, 10);
