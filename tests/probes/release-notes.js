// Browser probe for /__test-release-notes.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// Written before the load event fires, so startGame() sees a player whose
// last visit was an older build.

localStorage.setItem("proto23.seenversion", "475");
const releaseNotesProbe = setInterval(() => {
  if (!document.getElementById("ctrmg")) return;
  clearInterval(releaseNotesProbe);

  const dialogs = [...document.querySelectorAll("dialog.game-modal")];
  const notice = dialogs.find((dialog) =>
    dialog.querySelector(".release-notes__list"),
  );
  const shown = Boolean(notice && notice.open);
  const items = notice
    ? notice.querySelectorAll(".release-notes__list li").length
    : 0;
  const buttons = notice ? notice.querySelectorAll(".game-modal__button") : [];
  const localized =
    notice &&
    notice.textContent.includes("475") &&
    notice.textContent.includes("v477");
  // A notice has nothing to cancel, and nothing destructive to warn about.
  const singleNeutralButton =
    buttons.length === 1 &&
    !buttons[0].className.includes("--danger") &&
    document.activeElement === buttons[0];
  const fits =
    notice &&
    notice.getBoundingClientRect().top >= 0 &&
    notice.getBoundingClientRect().bottom <= window.innerHeight + 1;
  // The version is recorded before rendering, so it never repeats. What is
  // stored is the version CODE, major * 1000 + point release, because a
  // decimal would sort 478.10 below 478.9.
  const recorded =
    localStorage.getItem("proto23.seenversion") ===
    String(global.ver * 1000 + global.subver);
  // The value this probe wrote was a bare major, which is what every build
  // before point releases existed stored. It has to be promoted rather than
  // read as a code, or a returning player is told about every release there
  // has ever been -- and the notice above proves it was read as v475 and not
  // as something in the year 475000.
  const promoted = notice && notice.textContent.includes("475");

  const checks = {
    shown,
    localized,
    singleNeutralButton,
    fits,
    recorded,
    promoted,
  };
  document.documentElement.dataset.releaseNotesVerified = String(
    Object.values(checks).every(Boolean) && items >= 3,
  );
  document.documentElement.dataset.releaseNotesFailures = Object.keys(checks)
    .filter((name) => !checks[name])
    .concat(items >= 3 ? [] : ["items=" + items])
    .join(",");
}, 10);
