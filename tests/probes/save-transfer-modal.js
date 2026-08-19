// Browser probe for /__test-save-transfer-modal.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// The export and import panels were hand-built overlays: absolutely positioned at
// top 370px / left 330px, lightgrey on a black border, dragged by their own title bar.
// They sat outside the game's look, could not be closed with Escape, took no focus, and
// hung off the edge of a small viewport. They are dialogs on the shared shell now, so
// this checks the things the shell is what provides: that it is a real <dialog> carrying
// the game's own styling, that it holds the save rather than merely opening, that Escape
// closes it, that closing removes it from the document rather than hiding it, and that
// the reopen flag is cleared so the panel can be opened a second time.

const transferProbe = setInterval(() => {
  // Guarded on the bundle's own globals before reading them: this script is injected into
  // the page and starts ticking before js/game.js has run, so `dom` does not exist yet.
  if (typeof dom === "undefined" || !document.getElementById("ctrmg")) return;
  const exportButton = dom.ct_bt4_5a;
  if (!exportButton) return;
  clearInterval(transferProbe);
  const root = document.documentElement;

  exportButton.click();
  // Narrowed to the wide variant: the save-deletion dialog is also a .game-modal and it
  // sits in the document closed, so a bare selector finds that one first.
  const dialog = document.querySelector("dialog.game-modal--wide");
  root.dataset.transferIsDialog = String(!!dialog);
  root.dataset.transferIsOpen = String(!!dialog && dialog.open);
  root.dataset.transferIsWide = String(
    !!dialog && dialog.classList.contains("game-modal--wide"),
  );
  // The old windows were positioned in pixels from the top left of the document. A
  // dialog is centred by the browser, so nothing here should be setting either.
  root.dataset.transferInlineTop = dialog
    ? dialog.style.top || "none"
    : "MISSING";

  const field = dialog && dialog.querySelector(".game-modal__field");
  // A save string is base64 and long; the marker is what load() checks for, so its
  // presence is what says the field holds a real save rather than an empty box.
  const decoded = field ? b64_to_utf8(field.value) : "";
  root.dataset.transferHasSave = String(/savevalid/.test(decoded));
  const buttonLabels = dialog
    ? [...dialog.querySelectorAll(".game-modal__button")].map((b) =>
        b.textContent.trim(),
      )
    : [];
  root.dataset.transferButtonCount = String(buttonLabels.length);
  root.dataset.transferButtons = buttonLabels.join("|");
  // The clipboard is not reachable in a headless run, so what is checked is that the
  // button exists and that pressing it neither throws nor leaves the field empty -- the
  // refusal path is the one a real profile is most likely to take anyway.
  const copyButton = dialog
    ? [...dialog.querySelectorAll(".game-modal__button")].find(
        (b) => b.textContent.trim() === i18n.t("ui.settings.copyToClipboard"),
      )
    : null;
  root.dataset.transferHasCopy = String(!!copyButton);
  if (copyButton) {
    copyButton.click();
    root.dataset.transferCopyKeptField = String(
      /savevalid/.test(b64_to_utf8(field.value)),
    );
  }

  // Escape, which the hand-built window could not do at all.
  dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
  setTimeout(() => {
    root.dataset.transferClosedAndRemoved = String(
      !document.querySelector("dialog.game-modal--wide"),
    );
    // The flag has to be cleared by the close, or the panel can only ever be opened once
    // per page load -- which is how the original window behaved when its own X was
    // missed.
    root.dataset.transferFlagCleared = String(global.flags.expatv === false);

    // And the import side opens on the same shell.
    dom.ct_bt4_5b.click();
    const importDialog = document.querySelector("dialog.game-modal--wide");
    root.dataset.transferImportIsDialog = String(!!importDialog);
    root.dataset.transferImportHasField = String(
      !!importDialog && !!importDialog.querySelector(".game-modal__field"),
    );
    root.dataset.transferImportHasChooser = String(
      !!importDialog && !!importDialog.querySelector("input[type=file]"),
    );
    const pasteButton = importDialog
      ? [...importDialog.querySelectorAll(".game-modal__button")].find(
          (b) =>
            b.textContent.trim() === i18n.t("ui.settings.pasteFromClipboard"),
        )
      : null;
    root.dataset.transferHasPaste = String(!!pasteButton);
    // Pressing it with no clipboard permission must say so in the field rather than
    // throwing or importing nothing silently.
    if (pasteButton) {
      pasteButton.click();
      setTimeout(() => {
        const importField = importDialog.querySelector(".game-modal__field");
        root.dataset.transferPasteSpoke = String(
          !!importField && importField.value.trim().length > 0,
        );
      }, 60);
    }
  }, 50);
}, 10);
