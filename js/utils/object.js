// Object helpers. `deepCopy` is what the game clones a creature or a save fragment
// with; `copy` is its one-level form.
//
// deepCopy recurses on `typeof o === "object"`, so a function is carried across by
// reference rather than duplicated. That is what lets a copied creature keep its own
// stat_r and battle_ai, and the checks under scripts/ rely on it when they spawn one.
//
// Moved out of js/systems/planner.js, where they sat below the daily plans for no
// reason other than that is where they were first written.

function deepCopy(o) {
  let copy = o,
    k;
  if (o && typeof o === "object") {
    copy = Object.prototype.toString.call(o) === "[object Array]" ? [] : {};
    for (const k in o) {
      copy[k] = deepCopy(o[k]);
    }
  }
  return copy;
}

function copy(o) {
  const res = {};
  for (const a in o) res[a] = o[a];
  return res;
}
