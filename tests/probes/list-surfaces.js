// Browser probe for /__test-list-surfaces.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// The three surfaces every list is built from are CSS custom properties now, set from
// JavaScript as style.backgroundColor = "var(--list-row)". That fails silently in the
// worst way: a name that does not resolve leaves the declaration invalid, so the row
// gets no background at all rather than the wrong one, and nothing throws. A misspelt
// token would look like a styling accident nobody introduced.
//
// So each one is applied the way the game applies it and read back through
// getComputedStyle. An unresolved token comes back as rgba(0, 0, 0, 0).

const surfaceProbe = setInterval(() => {
  if (!document.getElementById("ctrmg")) return;
  clearInterval(surfaceProbe);
  const root = document.documentElement;
  const probe = document.createElement("div");
  document.body.appendChild(probe);

  const resolved = {};
  for (const token of ["--list-well", "--list-row", "--list-row-denied"]) {
    probe.style.backgroundColor = `var(${token})`;
    resolved[token] = getComputedStyle(probe).backgroundColor;
  }
  probe.remove();

  root.dataset.listWell = resolved["--list-well"];
  root.dataset.listRow = resolved["--list-row"];
  root.dataset.listRowDenied = resolved["--list-row-denied"];
  root.dataset.listSurfacesResolved = String(
    Object.values(resolved).every(
      (colour) => colour && colour !== "rgba(0, 0, 0, 0)",
    ),
  );
}, 10);
