// Browser probe for /__test-ui-safety.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const uiSafetyLayoutProbe = setInterval(() => {
  const messageControls = document.getElementById("m_control");
  const clearButton = document.getElementById("message-log-clear");
  const backgroundPresets = document.getElementById("background-presets");
  if (
    !document.getElementById("ctrmg") ||
    !messageControls ||
    !clearButton ||
    !backgroundPresets ||
    !dom.ct_bt4_03b2 ||
    !dom.sl_kill
  )
    return;
  clearInterval(uiSafetyLayoutProbe);

  document.getElementById("gmsgs").style.display = "";
  const messageBounds = messageControls.getBoundingClientRect();
  const messageChildren = [...messageControls.children];
  const messageChildBounds = messageChildren.map((child) =>
    child.getBoundingClientRect(),
  );
  const messageControlsFit = messageChildBounds.every(
    (bounds, index) =>
      bounds.left >= messageBounds.left &&
      bounds.right <= messageBounds.right &&
      bounds.top >= messageBounds.top &&
      bounds.bottom <= messageBounds.bottom &&
      (index === 0 || bounds.left >= messageChildBounds[index - 1].right),
  );
  const emptyIndicatorsHidden = [
    ...document.querySelectorAll(".bts_m_b:empty"),
  ].every((indicator) => getComputedStyle(indicator).display === "none");

  dom.ctrwin4.style.display = "";
  const presetContainerBounds = backgroundPresets.getBoundingClientRect();
  const presetBounds = [...backgroundPresets.children].map((preset) =>
    preset.getBoundingClientRect(),
  );
  const backgroundPresetsSeparated = presetBounds.every(
    (bounds, index) =>
      bounds.left >= presetContainerBounds.left &&
      bounds.right <= presetContainerBounds.right &&
      bounds.top >= presetContainerBounds.top &&
      bounds.bottom <= presetContainerBounds.bottom &&
      (index === 0 || bounds.left > presetBounds[index - 1].right),
  );

  const scaleBeforeTheme = document.body.style.zoom;
  const playerWidthBeforeTheme = document
    .getElementById("player-panel")
    .getBoundingClientRect().width;
  dom.ct_bt4_03b2.click();
  const themePreservedScale =
    document.body.style.zoom === scaleBeforeTheme &&
    document.getElementById("player-panel").getBoundingClientRect().width ===
      playerWidthBeforeTheme;

  localStorage.setItem("v0.3", "test-save");
  localStorage.setItem("proto23.locale", "tr");
  dom.sl_kill.focus();
  dom.sl_kill.click();
  const modal = document.getElementById("save-delete-modal");
  const modalBounds = modal.getBoundingClientRect();
  const modalOpenedAndFitted =
    modal.open &&
    document.activeElement === dom.save_delete_cancel &&
    modalBounds.left >= 0 &&
    modalBounds.top >= 0 &&
    modalBounds.right <= window.innerWidth &&
    modalBounds.bottom <= window.innerHeight;
  const modalTextLocalized =
    dom.save_delete_title.textContent ===
      i18n.t("ui.settings.deleteSaveTitle") &&
    dom.save_delete_message.textContent ===
      i18n.t("ui.settings.deleteSaveConfirm") &&
    dom.save_delete_cancel.textContent === i18n.t("ui.settings.cancelDelete") &&
    dom.save_delete_confirm.textContent === i18n.t("ui.settings.confirmDelete");

  dom.save_delete_cancel.click();
  const cancelPreservedSave =
    !modal.open &&
    localStorage.getItem("v0.3") === "test-save" &&
    document.activeElement === dom.sl_kill;

  dom.sl_kill.click();
  modal.dispatchEvent(new Event("cancel", { cancelable: true }));
  const escapePreservedSave =
    !modal.open && localStorage.getItem("v0.3") === "test-save";

  dom.sl_kill.click();
  modal.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      clientX: modalBounds.left - 1,
      clientY: modalBounds.top - 1,
    }),
  );
  const backdropPreservedSave =
    !modal.open && localStorage.getItem("v0.3") === "test-save";
  localStorage.removeItem("v0.3");

  const localizedMiss =
    i18n.t("runtime.ui.interface.dialogue.combat_missed", {
      name: "Düşman",
    }) === "Düşman ıskaladı";

  document.documentElement.dataset.uiSafetyVerified = String(
    messageControlsFit &&
      emptyIndicatorsHidden &&
      backgroundPresetsSeparated &&
      themePreservedScale &&
      modalOpenedAndFitted &&
      modalTextLocalized &&
      cancelPreservedSave &&
      escapePreservedSave &&
      backdropPreservedSave &&
      localizedMiss,
  );
  document.documentElement.dataset.backgroundPresetsSeparated = String(
    backgroundPresetsSeparated,
  );
  document.documentElement.dataset.saveDeleteModalVerified = String(
    modalOpenedAndFitted &&
      modalTextLocalized &&
      cancelPreservedSave &&
      escapePreservedSave &&
      backdropPreservedSave,
  );
}, 10);
