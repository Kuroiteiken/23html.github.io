// Browser probe for /__test-nav-keyboard.html, read by scripts/serve.js and injected into
// the deployed index.html. Runs in the page, not in Node.
//
// The five top-level panel buttons are divs with a click listener. They had no place in the
// tab order, no role, and no keydown, so the whole of the game's navigation was mouse-only
// while the save bar below it was fully reachable. They now carry tabIndex and role and
// activate on Enter and Space -- by dispatching a real click, because each button binds its
// own handler and there is no single action to call.
//
// So the probe presses Enter on one and checks the panel it opens actually opened. Asserting
// the attributes alone would pass on a button whose keydown does nothing.

const navProbe = setInterval(() => {
  if (
    typeof dom === "undefined" ||
    !dom.ct_bt7 ||
    !document.getElementById("ctrmg")
  )
    return;
  clearInterval(navProbe);
  const root = document.documentElement;

  // The navigation is hidden until the game opens it (global.flags.aw_u), and a hidden
  // element cannot take focus -- so the row is shown here. This is the state a player past
  // the opening is in; without it the probe would be measuring a display:none div.
  global.flags.aw_u = true;
  dom.ct_ctrl.style.display = "";

  const buttons = [dom.ct_bt1, dom.ct_bt2, dom.ct_bt3, dom.ct_bt6, dom.ct_bt7];
  root.dataset.navReachable = String(
    buttons.every(
      (b) => b.tabIndex === 0 && b.getAttribute("role") === "button",
    ),
  );

  // Settings, because it is the one panel that does not depend on a progress flag.
  const settings = dom.ctrwin4;
  const wasOpen = settings && getComputedStyle(settings).display !== "none";
  root.dataset.navPanelStartedClosed = String(!wasOpen);

  dom.ct_bt7.focus();
  root.dataset.navTookFocus = String(document.activeElement === dom.ct_bt7);
  dom.ct_bt7.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    }),
  );

  setTimeout(() => {
    root.dataset.navEnterOpenedPanel = String(
      !!settings && getComputedStyle(settings).display !== "none",
    );
    // And Space must behave the same way, since a div gives neither for free.
    const focusRing = getComputedStyle(dom.ct_bt7).borderColor;
    root.dataset.navBorderColour = focusRing;
  }, 60);
}, 10);
