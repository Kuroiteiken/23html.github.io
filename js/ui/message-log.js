// The message log: writing a line, folding a repeat into a tally, and keeping the
// history across a reload.
//
// The log is rendered straight into the DOM, so its history is kept by serializing the
// rendered rows rather than by storing the messages. It has its own storage key instead
// of living inside the save, which is why it survives a reload the player did not save
// before. Restored rows are plain markup: a hover description attached to a live message
// is not part of its HTML and does not come back with it.
//
// Split out of js/ui/interface.js. Everything here runs when something has happened
// rather than while the interface is being built, so nothing in this file is called at
// definition time.

// The message log is rendered straight into the DOM, so its history is kept by
// serializing the rendered rows. It lives under its own storage key rather than
// inside the save, which is why it survives a reload without the player having
// saved. Restored rows are plain markup: hover descriptions attached to a live
// message are not part of its HTML and are not restored with it.
const messageLogStorageKey = "proto23.messagelog";
let messageLogWriteTimer;

function trimMessageLog() {
  const limit = Number(global.msgs_max) || 1;
  while (dom.mscont.children.length > limit)
    dom.mscont.removeChild(dom.mscont.children[0]);
}

function storeMessageLog() {
  // Messages can arrive several times per tick, so coalesce the writes.
  clearTimeout(messageLogWriteTimer);
  messageLogWriteTimer = setTimeout(() => {
    try {
      const rows = [];
      for (const row of dom.mscont.children) rows.push(row.innerHTML);
      window.localStorage.setItem(messageLogStorageKey, JSON.stringify(rows));
    } catch (err) {
      // Keeping the history is best effort; storage may be full.
    }
  }, 400);
}

function restoreMessageLog() {
  let rows = null;
  try {
    rows = JSON.parse(window.localStorage.getItem(messageLogStorageKey));
  } catch (err) {
    rows = null;
  }
  if (!Array.isArray(rows) || !rows.length) return;
  for (const html of rows.slice(-(Number(global.msgs_max) || 1))) {
    const row = addElement(dom.mscont, "div", null, "msg");
    row.innerHTML = html;
  }
  dom.mscont.scrollTop = dom.mscont.scrollHeight;
}

function clearMessageLog() {
  empty(dom.mscont);
  clearTimeout(messageLogWriteTimer);
  try {
    window.localStorage.removeItem(messageLogStorageKey);
  } catch (err) {
    // Nothing to clear if storage is unavailable.
  }
}

function msg(txt, c, dsc, type, bc, chck) {
  if (global.flags.m_freeze === false && global.flags.loadstate === false) {
    trimMessageLog();
    const msg = addElement(dom.mscont, "div", null, "msg");
    if (global.flags.msgtm) {
      const now = new Date();
      const g = addElement(msg, "small");
      g.innerHTML =
        "[" +
        (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) +
        ":" +
        (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
        ":" +
        (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()) +
        "]";
      g.style.backgroundColor = "#242848";
      g.style.display = "flex";
    }
    const mtxt = addElement(msg, "span");
    if (dsc) {
      if (type) addDesc(msg, dsc, type);
      else addDesc(msg, dsc);
    }
    //let nt = new String(); for(let a in txt){nt+=txt[a].charCodeAt()!==32?String.fromCharCode(41216-txt[a].charCodeAt()):' '}; txt=nt;
    if (c)
      mtxt.innerHTML =
        "<span style=color:" +
        c +
        (bc ? ";background-color:" + bc : "") +
        ">" +
        txt +
        "</span>";
    else mtxt.innerHTML = txt;
    // Collapse a repeat into the line above it. Crafting a stack of forty, or a fight
    // that lands the same blow twenty times, otherwise fills the whole log with one
    // sentence and pushes everything worth reading out of it -- and the log only keeps
    // global.msgs_max lines, so the repeats were actively destroying history.
    //
    // The author tried this once and left it commented out here. It needs three things
    // that attempt did not have: the comparison must be against the row still on
    // screen rather than a global that msg_add also writes; the row must remember its
    // own original text, since a collapsed row's innerHTML no longer equals what was
    // asked for; and a row that msg_add has already appended to must be left alone,
    // or the counter lands in the middle of somebody else's sentence.
    // The new row is already appended by addElement above, so mscont.lastElementChild
    // IS this row. The one to compare against is its sibling.
    const previous = msg.previousElementSibling;
    if (
      previous &&
      previous.dataset.repeatOf === mtxt.innerHTML &&
      !previous.dataset.appended
    ) {
      const count = Number(previous.dataset.repeatCount || 1) + 1;
      previous.dataset.repeatCount = String(count);
      const tally =
        previous.querySelector(".msg-repeat") ||
        addElement(previous, "small", null, "msg-repeat");
      tally.innerHTML = "x" + count;
      dom.mscont.removeChild(msg);
      dom.mscont.scrollTop = dom.mscont.scrollHeight;
      storeMessageLog();
      return;
    }
    msg.dataset.repeatOf = mtxt.innerHTML;
    dom.mscont.scrollTop = dom.mscont.scrollHeight;
    storeMessageLog();
    global.lastmsg = msg.innerHTML;
  }
}

function _msg(txt, c, dsc, type, bc, chck) {
  trimMessageLog();
  const msg = addElement(dom.mscont, "div", null, "msg");
  if (dsc) {
    if (type) addDesc(msg, dsc, type);
    else addDesc(msg, dsc);
  }
  if (c)
    msg.innerHTML =
      "<span style=color:" +
      c +
      (bc ? ";background-color:" + bc : "") +
      ">" +
      txt +
      "</span>";
  else msg.innerHTML = txt;
  dom.mscont.scrollTop = dom.mscont.scrollHeight;
  storeMessageLog();
}

function msg_add(txt, c, bc, shd) {
  if (global.flags.m_freeze === false && global.flags.loadstate === false) {
    let bac = "";
    let b = "";
    if (bc) bac = "background-color:" + bc;
    if (shd) b = "text-shadow:" + shd.toString();
    else b = "";
    // Mark the row so the repeat collapser in msg() leaves it alone. A level-up writes
    // one msg and then four msg_adds onto the same line; folding a later repeat into
    // that would put an "x2" in the middle of somebody else's sentence.
    const appendTarget =
      dom.gmsgs.children[1].children[dom.gmsgs.children[1].children.length - 1];
    if (appendTarget) appendTarget.dataset.appended = "true";
    if (c)
      dom.gmsgs.children[1].children[
        dom.gmsgs.children[1].children.length - 1
      ].innerHTML +=
        '<span style=\"color:' +
        c +
        ";" +
        bac +
        ";" +
        b +
        '\">' +
        txt +
        "</span>";
    else
      dom.gmsgs.children[1].children[
        dom.gmsgs.children[1].children.length - 1
      ].innerHTML += txt;
    dom.mscont.scrollTop = dom.mscont.scrollHeight;
    storeMessageLog();
  }
}
