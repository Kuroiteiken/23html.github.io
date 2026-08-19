// Browser probe for /__test-lore-panel.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const loreProbe = setInterval(() => {
  if (!document.getElementById("ctrmg") || !dom.ct_bt6) return;
  if (typeof learnLore !== "function") return;
  clearInterval(loreProbe);

  // The journal button is inert until the journal is unlocked, which a
  // fresh game has not done yet.
  global.flags.jnlu = true;

  // Open the journal with nothing learned: the panel must still be
  // reachable and must say so rather than showing a blank box.
  dom.ct_bt6.click();
  document.getElementById("jcell3").click();
  const emptyState = Boolean(document.querySelector(".lore-open"));
  const emptyEntries = document.querySelectorAll(".lore-entry").length;
  dom.ct_bt6.click();

  // A clue, a question that gets answered, and a question left open.
  learnLore("itDigs", "whatDigs", "cameThrough", "whyTheEast");
  const stored = global.lore.slice();

  dom.ct_bt6.click();
  const tabLabel = document.getElementById("jcell3").textContent;
  document.getElementById("jcell3").click();

  const panel = document.querySelector(".lore-panel");
  const entries = [...document.querySelectorAll(".lore-entry")];
  const openRows = [...document.querySelectorAll(".lore-open")];
  const answers = [...document.querySelectorAll(".lore-entry--answer")];
  const questions = [...document.querySelectorAll(".lore-entry--question")];
  const text = panel ? panel.textContent : "";

  const checks = {
    // Reachable as soon as the journal is, and honest when empty.
    emptyStateShown: emptyState && emptyEntries === 0,
    tabNamed: tabLabel.indexOf("?") !== 0 && tabLabel.length > 0,
    panelRendered: Boolean(panel),
    // Four learned: one clue, two questions, one answer.
    entryCount: entries.length === 4,
    questionCount: questions.length === 2,
    answerShown: answers.length === 1,
    // The unanswered question is marked as such; the answered one is not.
    openMarked: openRows.length === 1,
    // Nothing unlearned leaks in.
    noUnknownLeak:
      text.indexOf(lore.deinWasHere.name) === -1 &&
      text.indexOf(lore.theOrder.name) === -1,
    // Bound at definition time, so no raw keys on screen.
    noRawKeys: text.indexOf("content.lore.") === -1,
    fitsPanel:
      panel &&
      panel.getBoundingClientRect().bottom <=
        document.getElementById("ctrmg").getBoundingClientRect().bottom + 1,
    // Idempotent: revisiting a scene cannot record the same thing twice.
    idempotent:
      learnLore("itDigs") === false && global.lore.length === stored.length,
  };

  document.documentElement.dataset.lorePanelVerified = String(
    Object.values(checks).every(Boolean),
  );
  document.documentElement.dataset.lorePanelFailures = Object.keys(checks)
    .filter((name) => !checks[name])
    .join(",");
}, 10);
