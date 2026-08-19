// Browser probe for /__test-window-panels.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// Every panel rendered into #ctrm_2 asked for a percentage of a container
// with no height, so each grew with its contents instead of scrolling and
// pushed the choices below it off the bottom of the screen.

const windowPanelProbe = setInterval(() => {
  const gameWindow = document.getElementById("ctrmg");
  if (!gameWindow || typeof chs_spec !== "function") return;
  if (typeof giveItem !== "function" || typeof restock !== "function") return;
  clearInterval(windowPanelProbe);

  // Far more items than any of these panels can show at once.
  const stock = Object.keys(item)
    .map((key) => item[key])
    .filter((entry) => entry && entry.id && entry.name)
    .slice(0, 70);
  for (const entry of stock) giveItem(entry, 2);

  const windowBounds = gameWindow.getBoundingClientRect();
  const results = {};

  function measure(name, panel, lists) {
    const bounds = panel.getBoundingClientRect();
    results[name] = {
      fits: bounds.bottom <= windowBounds.bottom + 1,
      scrolls: lists.some((list) => list.scrollHeight > list.clientHeight + 1),
      clipped: lists.every(
        (list) => list.getBoundingClientRect().bottom <= bounds.bottom + 1,
      ),
    };
  }

  restock(vendor.grc1);
  chs_spec(4, vendor.grc1);
  // The grocer's own stock is short enough to fit, and giveItem above
  // filled the player's bag rather than the shelf, so the shelf is padded
  // here to get past the point where it has to scroll.
  for (let extra = 0; extra < 60; extra++)
    rendershopitem(dom.ch_1h, vendor.grc1.stock[0], vendor.grc1);
  measure("shop", dom.ch_1, [dom.ch_1h]);

  chs_spec(3, { c: [], name: "box" });
  measure("trunk", dom.ch_1a, [dom.invp1, dom.invp2]);

  const failures = [];
  for (const name of Object.keys(results))
    for (const check of Object.keys(results[name]))
      if (!results[name][check]) failures.push(name + ":" + check);

  document.documentElement.dataset.windowPanelsVerified = String(
    failures.length === 0 && Object.keys(results).length === 2,
  );
  document.documentElement.dataset.windowPanelFailures = failures.join(",");
}, 10);
