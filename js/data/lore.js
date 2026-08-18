// The journal's fourth panel. The game reserved a slot for it long before this
// fork — the tab has always rendered "????????????" with nothing behind it — and
// what belongs there is what the player has actually worked out about the world.
//
// Three kinds of entry:
//   clue      something observed, and the reason it matters
//   question  something the story has opened and not yet closed
//   answer    closes one named question, and is only readable once earned
//
// Nothing is granted for free. Every entry is unlocked at the beat that
// establishes it, so the panel is a record of what this player has seen rather
// than a summary of the plot. Questions left open here are the ones later chapters
// are built to answer, which is also why they are worth showing: the player can
// see the shape of what they do not know.

const loreClue = 1;
const loreQuestion = 2;
const loreAnswer = 3;

// Unlocked entry ids. Kept on `global` and written into the `a1` globals object,
// which is a JSON blob rather than a positional segment, so an older save simply
// yields undefined and starts empty.
global.lore = [];

function LoreEntry(id, kind, chapter) {
  this.id = id;
  this.kind = kind;
  this.chapter = chapter;
  // Set on answers: the question id this closes.
  this.answers = 0;
}

const lore = {};

// Names and descriptions are bound at definition time with spelled-out keys, the
// way every other content type does it. A key built by concatenation at render
// time cannot be verified by the localization check.
function defineLore(key, id, kind, chapter, answers) {
  const entry = new LoreEntry(id, kind, chapter);
  if (answers) entry.answers = answers;
  entry.key = key;
  lore[key] = entry;
  return entry;
}

// What the game already teaches and then keeps nowhere. Yamato's lore hub explains
// the whole monster rank scale and the six kinds of creature, and until now that
// existed only as dialogue the player read once and could never look up again.
// These are chapter 0 so they sort first, and they are what opens the panel: a
// player taking their first job at the lodge has something to write down, rather
// than waiting until the wolf hunt is over.
defineLore("theLodge", 21, loreClue, 0);
lore.theLodge.name = i18n.t("content.lore.theLodge.name");
lore.theLodge.desc = i18n.t("content.lore.theLodge.desc");
defineLore("monsterRanks", 22, loreClue, 0);
lore.monsterRanks.name = i18n.t("content.lore.monsterRanks.name");
lore.monsterRanks.desc = i18n.t("content.lore.monsterRanks.desc");
defineLore("creatureKinds", 23, loreClue, 0);
lore.creatureKinds.name = i18n.t("content.lore.creatureKinds.name");
lore.creatureKinds.desc = i18n.t("content.lore.creatureKinds.desc");

// Chapter I and II — the wolves.
defineLore("wolvesTurned", 1, loreQuestion, 1);
lore.wolvesTurned.name = i18n.t("content.lore.wolvesTurned.name");
lore.wolvesTurned.desc = i18n.t("content.lore.wolvesTurned.desc");
defineLore("wolvesPushed", 2, loreAnswer, 2, 1);
lore.wolvesPushed.name = i18n.t("content.lore.wolvesPushed.name");
lore.wolvesPushed.desc = i18n.t("content.lore.wolvesPushed.desc");
defineLore("leaderNotWeak", 3, loreClue, 2);
lore.leaderNotWeak.name = i18n.t("content.lore.leaderNotWeak.name");
lore.leaderNotWeak.desc = i18n.t("content.lore.leaderNotWeak.desc");
defineLore("leaderFacedCrack", 4, loreClue, 2);
lore.leaderFacedCrack.name = i18n.t("content.lore.leaderFacedCrack.name");
lore.leaderFacedCrack.desc = i18n.t("content.lore.leaderFacedCrack.desc");
defineLore("underTheSouth", 5, loreQuestion, 2);
lore.underTheSouth.name = i18n.t("content.lore.underTheSouth.name");
lore.underTheSouth.desc = i18n.t("content.lore.underTheSouth.desc");

// Chapter III — the village.
defineLore("itDigs", 6, loreClue, 3);
lore.itDigs.name = i18n.t("content.lore.itDigs.name");
lore.itDigs.desc = i18n.t("content.lore.itDigs.desc");
defineLore("lockedCellar", 7, loreClue, 3);
lore.lockedCellar.name = i18n.t("content.lore.lockedCellar.name");
lore.lockedCellar.desc = i18n.t("content.lore.lockedCellar.desc");
defineLore("mortarPushed", 8, loreClue, 3);
lore.mortarPushed.name = i18n.t("content.lore.mortarPushed.name");
lore.mortarPushed.desc = i18n.t("content.lore.mortarPushed.desc");
defineLore("towardTheWell", 25, loreClue, 3);
lore.towardTheWell.name = i18n.t("content.lore.towardTheWell.name");
lore.towardTheWell.desc = i18n.t("content.lore.towardTheWell.desc");
// The answer to "whose hand is holding the chisel?", which the catacombs opened. It
// closes that question and deliberately opens nothing about what became of him: that is
// the east, and the east is a chapter.
defineLore("theHandWasHis", 33, loreAnswer, 3, 27);
lore.theHandWasHis.name = i18n.t("content.lore.theHandWasHis.name");
lore.theHandWasHis.desc = i18n.t("content.lore.theHandWasHis.desc");
defineLore("sameWater", 32, loreClue, 3);
lore.sameWater.name = i18n.t("content.lore.sameWater.name");
lore.sameWater.desc = i18n.t("content.lore.sameWater.desc");
defineLore("mineWorked", 31, loreClue, 3);
lore.mineWorked.name = i18n.t("content.lore.mineWorked.name");
lore.mineWorked.desc = i18n.t("content.lore.mineWorked.desc");
defineLore("millDrain", 30, loreClue, 3);
lore.millDrain.name = i18n.t("content.lore.millDrain.name");
lore.millDrain.desc = i18n.t("content.lore.millDrain.desc");
defineLore("strawBound", 29, loreClue, 3);
lore.strawBound.name = i18n.t("content.lore.strawBound.name");
lore.strawBound.desc = i18n.t("content.lore.strawBound.desc");
defineLore("stoneDust", 28, loreClue, 3);
lore.stoneDust.name = i18n.t("content.lore.stoneDust.name");
lore.stoneDust.desc = i18n.t("content.lore.stoneDust.desc");
defineLore("whatDigs", 9, loreQuestion, 3);
lore.whatDigs.name = i18n.t("content.lore.whatDigs.name");
lore.whatDigs.desc = i18n.t("content.lore.whatDigs.desc");

// Chapter IV — the catacombs.
defineLore("theOrder", 10, loreClue, 4);
lore.theOrder.name = i18n.t("content.lore.theOrder.name");
lore.theOrder.desc = i18n.t("content.lore.theOrder.desc");
defineLore("deadMovingNow", 11, loreQuestion, 4);
lore.deadMovingNow.name = i18n.t("content.lore.deadMovingNow.name");
lore.deadMovingNow.desc = i18n.t("content.lore.deadMovingNow.desc");
defineLore("deathKiPooling", 12, loreAnswer, 4, 11);
lore.deathKiPooling.name = i18n.t("content.lore.deathKiPooling.name");
lore.deathKiPooling.desc = i18n.t("content.lore.deathKiPooling.desc");
defineLore("cameThrough", 13, loreAnswer, 4, 9);
lore.cameThrough.name = i18n.t("content.lore.cameThrough.name");
lore.cameThrough.desc = i18n.t("content.lore.cameThrough.desc");
defineLore("warmAir", 14, loreClue, 4);
lore.warmAir.name = i18n.t("content.lore.warmAir.name");
lore.warmAir.desc = i18n.t("content.lore.warmAir.desc");
defineLore("catacombsForgotten", 15, loreQuestion, 4);
lore.catacombsForgotten.name = i18n.t("content.lore.catacombsForgotten.name");
lore.catacombsForgotten.desc = i18n.t("content.lore.catacombsForgotten.desc");
defineLore("threeAndAcross", 16, loreClue, 4);
lore.threeAndAcross.name = i18n.t("content.lore.threeAndAcross.name");
lore.threeAndAcross.desc = i18n.t("content.lore.threeAndAcross.desc");
defineLore("whoCameFirst", 17, loreQuestion, 4);
lore.whoCameFirst.name = i18n.t("content.lore.whoCameFirst.name");
lore.whoCameFirst.desc = i18n.t("content.lore.whoCameFirst.desc");
defineLore("deinWasHere", 18, loreAnswer, 4, 17);
lore.deinWasHere.name = i18n.t("content.lore.deinWasHere.name");
lore.deinWasHere.desc = i18n.t("content.lore.deinWasHere.desc");
defineLore("whatDeinSought", 19, loreQuestion, 4);
lore.whatDeinSought.name = i18n.t("content.lore.whatDeinSought.name");
lore.whatDeinSought.desc = i18n.t("content.lore.whatDeinSought.desc");
defineLore("toolMarks", 26, loreClue, 4);
lore.toolMarks.name = i18n.t("content.lore.toolMarks.name");
lore.toolMarks.desc = i18n.t("content.lore.toolMarks.desc");
defineLore("whoseHand", 27, loreQuestion, 4);
lore.whoseHand.name = i18n.t("content.lore.whoseHand.name");
lore.whoseHand.desc = i18n.t("content.lore.whoseHand.desc");
defineLore("whyTheEast", 20, loreQuestion, 4);
lore.whyTheEast.name = i18n.t("content.lore.whyTheEast.name");
lore.whyTheEast.desc = i18n.t("content.lore.whyTheEast.desc");

// Side stories can answer main-line questions too, which is the point of keeping
// the questions in one place rather than per-quest.
defineLore("secondWayIn", 24, loreAnswer, 5, 19);
lore.secondWayIn.name = i18n.t("content.lore.secondWayIn.name");
lore.secondWayIn.desc = i18n.t("content.lore.secondWayIn.desc");

function knowsLore(id) {
  return global.lore.indexOf(id) !== -1;
}

function loreById(id) {
  for (const key in lore) if (lore[key].id === id) return lore[key];
  return null;
}

// Records one or more entries. Takes keys rather than ids so the call sites read
// as what they mean, and is idempotent: a scene the player revisits cannot
// announce the same discovery twice.
function learnLore() {
  let learned = 0;
  for (let a = 0; a < arguments.length; a++) {
    const entry = lore[arguments[a]];
    if (!entry || knowsLore(entry.id)) continue;
    global.lore.push(entry.id);
    learned++;
  }
  if (!learned) return false;
  // Entries are recorded from the start of the game, but announcing an addition to
  // a journal the player has not found yet would be nonsense. They will be waiting
  // in the panel when the journal opens.
  if (global.flags.jnlu)
    msg(
      i18n.t("runtime.data.lore.dialogue.journal_updated", { count: learned }),
      "plum",
    );
  return true;
}

function loreAnswerFor(questionId) {
  for (const key in lore) {
    const entry = lore[key];
    if (entry.kind === loreAnswer && entry.answers === questionId) return entry;
  }
  return null;
}

// Everything the player knows, in story order, with each question carrying its
// answer when one has been earned.
function loreKnown() {
  const clues = [];
  const questions = [];
  for (const key in lore) {
    const entry = lore[key];
    if (!knowsLore(entry.id)) continue;
    if (entry.kind === loreClue) clues.push(entry);
    else if (entry.kind === loreQuestion) {
      const answer = loreAnswerFor(entry.id);
      questions.push({
        entry,
        answer: answer && knowsLore(answer.id) ? answer : null,
      });
    }
  }
  const byChapter = (a, b) =>
    (a.chapter || 0) - (b.chapter || 0) || a.id - b.id;
  clues.sort(byChapter);
  questions.sort((a, b) => byChapter(a.entry, b.entry));
  return { clues, questions };
}
