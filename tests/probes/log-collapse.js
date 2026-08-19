// Browser probe for /__test-log-collapse.html, read by scripts/serve.js and
// injected into the deployed index.html. Runs in the page, not in Node.
//
// Repeated log lines must fold into one row with a tally. Exercised through the
// real msg() rather than by inspecting source, because the first attempt at this
// compared against the wrong element and shipped looking correct.

const logProbe = setInterval(() => {
  if (!document.getElementById("ctrmg") || typeof msg !== "function") return;
  clearInterval(logProbe);
  const root = document.documentElement;
  clearMessageLog();
  const rows = () => dom.mscont.children.length;
  msg("aaa");
  msg("aaa");
  msg("aaa");
  root.dataset.logCollapsedRows = String(rows());
  const tally = dom.mscont.lastElementChild.querySelector(".msg-repeat");
  root.dataset.logCollapsedTally = tally ? tally.innerHTML : "";
  msg("bbb");
  root.dataset.logDistinctRows = String(rows());
  msg("ccc");
  msg_add(" and more");
  msg("ccc");
  root.dataset.logAppendedRows = String(rows());
}, 10);
