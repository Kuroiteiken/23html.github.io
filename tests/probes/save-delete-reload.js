// Browser probe for /__test-save-delete-reload.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.

const saveDeleteReloadProbe = setInterval(() => {
  if (
    !document.getElementById("ctrmg") ||
    !dom.sl_kill ||
    !dom.save_delete_confirm
  )
    return;
  clearInterval(saveDeleteReloadProbe);

  const phaseKey = "test.save-delete-reload.phase";
  if (sessionStorage.getItem(phaseKey) === "awaiting-reload") {
    sessionStorage.removeItem(phaseKey);
    document.documentElement.dataset.saveDeleteReloaded = String(
      localStorage.getItem("v0.3") === null &&
        localStorage.getItem("proto23.locale") === "tr" &&
        global.flags.gameone === false &&
        global.lst_loc === 101 &&
        global.current_l === chss.t1,
    );
    return;
  }

  localStorage.setItem("v0.3", "test-save");
  localStorage.setItem("proto23.locale", "tr");
  sessionStorage.setItem(phaseKey, "awaiting-reload");
  dom.sl_kill.click();
  dom.save_delete_confirm.click();
}, 10);
