// Browser probe for /__test-localization-integrity.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

(() => {
  const phaseKey = "test.localization-integrity.phase";
  const stateKey = "test.localization-integrity.state";
  const customName = "Kayra Özel";
  const changedName = "Changed after save";
  const collectLocaleKeyLeaks = () => {
    msg(i18n.t("runtime.core.bootstrap.dialogue.game_saved_2cb7f3fc"), "cyan");
    dscr({ clientX: 220, clientY: 220 }, wpn.stk1);
    const log = document.getElementById("gmsgs");
    const surfaces = [
      ["ui", document.body.innerText],
      ["log", log?.textContent || ""],
      ["hover", global.dscr?.textContent || ""],
    ];
    const localeKeyPattern =
      /\b(?:runtime|content|ui|gameText)\.[A-Za-z0-9_.-]+/g;
    return surfaces.flatMap(([surface, text]) =>
      [...text.matchAll(localeKeyPattern)].map(
        (match) => i18n.currentLocale + ":" + surface + ":" + match[0],
      ),
    );
  };
  const probe = setInterval(() => {
    if (
      !document.getElementById("ctrmg") ||
      document.getElementById("loading-overlay") ||
      typeof save !== "function" ||
      typeof load !== "function" ||
      typeof dscr !== "function" ||
      typeof msg !== "function" ||
      !window.i18n ||
      !window.you ||
      !window.dom?.d2
    )
      return;

    const phase = localStorage.getItem(phaseKey);
    const state = JSON.parse(localStorage.getItem(stateKey) || "{}");
    if (!phase) {
      state.newGameUsedLocaleName =
        you.name === i18n.t("runtime.core.player.interface.name");
      you.name = customName;
      dom.d2.textContent = customName;
      const savedGame = save(true);
      you.name = changedName;
      dom.d2.textContent = changedName;
      load(savedGame);
      state.saveLoadPreservedName =
        you.name === customName && dom.d2.textContent === customName;
      localStorage.setItem(stateKey, JSON.stringify(state));
      localStorage.setItem(phaseKey, "turkish");
      i18n.setLocale("tr");
      return;
    }

    if (phase === "turkish") {
      state.turkishReloadPreservedName =
        i18n.currentLocale === "tr" &&
        you.name === customName &&
        dom.d2.textContent === customName;
      state.turkishLocaleKeyLeaks = collectLocaleKeyLeaks();
      localStorage.setItem(stateKey, JSON.stringify(state));
      localStorage.setItem(phaseKey, "english");
      i18n.setLocale("en");
      return;
    }

    clearInterval(probe);
    state.englishReloadPreservedName =
      i18n.currentLocale === "en" &&
      you.name === customName &&
      dom.d2.textContent === customName;

    const leaks = [
      ...(state.turkishLocaleKeyLeaks || []),
      ...collectLocaleKeyLeaks(),
    ];
    const namePreserved =
      state.newGameUsedLocaleName &&
      state.saveLoadPreservedName &&
      state.turkishReloadPreservedName &&
      state.englishReloadPreservedName;

    document.documentElement.dataset.localeKeyLeakFree = String(
      leaks.length === 0,
    );
    document.documentElement.dataset.localeKeyLeakDetails =
      leaks.slice(0, 5).join(",") || "none";
    document.documentElement.dataset.playerNamePersistence =
      String(namePreserved);
    document.documentElement.dataset.playerNameDetails = JSON.stringify(state);
    localStorage.removeItem(phaseKey);
    localStorage.removeItem(stateKey);
  }, 10);
})();
