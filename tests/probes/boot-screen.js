// Browser probe for /__test-boot-screen.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// inject: before-loader
//
// Injected immediately before index.html's loader script tag: late enough that the
// boot screen's markup has been parsed, early enough that nothing of the game
// exists yet. Placing it right after <body> ran it before the overlay's own divs
// had been read, which is not the question being asked.
//
// The boot screen has to be in the markup, not built by the bundle, or it
// cannot appear until the thing it is covering has already finished loading.
// So this probe records what exists BEFORE any of the game's code runs, then
// waits for the game to be up and checks the screen was taken away again.
// Injected immediately before the loader's own script tag: late enough that the
// boot screen's markup has been parsed, early enough that nothing of the game
// exists yet. Placing it right after <body> ran it before the overlay's own
// divs had been read, which is not the question being asked.

(() => {
  const overlay = document.getElementById("loading-overlay");
  const text = document.getElementById("loading-text");
  const root = document.documentElement;
  // Read at once: this script is in the page's own markup, ahead of the
  // loader, so nothing of the game exists yet.
  const early = {
    overlay: !!overlay,
    text: !!text,
    phase: root.dataset.bootPhase || "",
    lang: root.dataset.bootLang || "",
    // The one the player is not reading must be removed by CSS, and the one
    // they are must have real words in it rather than an unresolved token.
    shown: text
      ? [...text.querySelectorAll("[lang]")]
          .filter((el) => getComputedStyle(el).display !== "none")
          .map((el) => el.textContent.trim())
          .join(" | ")
      : "",
  };
  root.dataset.bootEarlyOverlay = String(early.overlay && early.text);
  root.dataset.bootEarlyPhase = early.phase;
  root.dataset.bootEarlyLang = early.lang;
  root.dataset.bootEarlyText = early.shown;
  root.dataset.bootEarlyHasToken = String(early.shown.includes("{{"));
  const done = setInterval(() => {
    if (!document.getElementById("ctrmg")) return;
    clearInterval(done);
    // fade() removes the element on the fifth tick of a 10ms interval, so
    // give it room rather than racing it.
    setTimeout(() => {
      root.dataset.bootScreenGone = String(
        !document.getElementById("loading-overlay") &&
          !document.getElementById("loading-text"),
      );
    }, 200);
  }, 10);
})();
