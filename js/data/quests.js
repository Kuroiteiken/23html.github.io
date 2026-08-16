///////////////////////////////////////////
//QST
///////////////////////////////////////////

function Quest() {
  this.name = "dummy";
  this.desc = "dummy";
  this.cond = "dummy";
  this.tracker = function () {};
  this.fpending = function () {};
  this.init = function () {};
  this.check = function () {};
  this.id = 0;
  this.rwd = function () {};
  this.data = { started: false, done: false, pending: false, toup: false };
}

quest.test = new Quest();
quest.test.id = 1;
quest.test.name = "test";
quest.test.desc = "find 10";
quest.test.init = function () {
  this.data.itm = item.rwmt1;
  this.data.started = true;
};
quest.test.tracker = function () {
  if (this.data.itm.amount >= 10) this.data.pending = true;
  else {
    this.data.pending = false;
    this.data.toup = true;
  }
};
quest.test.fpending = function () {
  msg("10 item found");
  this.data.toup = false;
};
quest.test.rwd = function () {
  this.data.done = true;
  this.data.pending = false;
  msg("done");
};

quest.fwd1 = new Quest();
quest.fwd1.id = 2;
quest.fwd1.name = "Firewood Gathering";
quest.fwd1.rar = 1;
quest.fwd1.desc = "Secure 10 bundles of firewood for hunter Yamato";
quest.fwd1.loc = "Western Woods, Hunter's Lodge";
quest.fwd1.rwd = function () {
  you.karma++;
  giveWealth(100);
  giveItem(sld.bkl);
  smove(chss.frstn1b1, false);
  giveExp(15000, true, true, true);
};
quest.fwd1.goals = function () {
  let c;
  if (item.fwd1.amount >= 10) c = "lime";
  else if (item.fwd1.amount < 10 && item.fwd1.amount > 0) c = "yellow";
  else if (item.fwd1.amount <= 0) c = "red";
  const txt =
    'Firewood collected: <span style="color: ' +
    c +
    '">' +
    item.fwd1.amount +
    "/10</span>";
  return [txt];
};
quest.fwd1.goalsf = function () {
  return ['Firewood collected: <span style="color:lime">10/10</span>'];
};

quest.hnt1 = new Quest();
quest.hnt1.id = 3;
quest.hnt1.name = "First Hunt";
quest.hnt1.rar = 1;
quest.hnt1.desc = "Hunt for 10 peices of meat for hunter Yamato";
quest.hnt1.loc = "Western Woods, Hunter's Lodge";
quest.hnt1.rwd = function () {
  you.karma++;
  giveWealth(130);
  giveItem(item.jrk1, 10);
  giveExp(12000, true, true, true);
};
quest.hnt1.goals = function () {
  let c;
  if (item.rwmt1.amount >= 10) c = "lime";
  else if (item.rwmt1.amount < 10 && item.rwmt1.amount > 0) c = "yellow";
  else if (item.rwmt1.amount <= 0) c = "red";
  const txt =
    'Raw meat collected: <span style="color: ' +
    c +
    '">' +
    item.rwmt1.amount +
    "/10</span>";
  return [txt];
};
quest.hnt1.goalsf = function () {
  return ['Raw meat collected: <span style="color:lime">10/10</span>'];
};

quest.grds1 = new Quest();
quest.grds1.id = 4;
quest.grds1.name = "Guarding Duty";
quest.grds1.rar = 1;
quest.grds1.loc = "Village Center, Marketplace Entry Gate";
quest.grds1.desc =
  "You were tasked with guarding duty to watch over marketplace";
quest.grds1.data.t = 0;
quest.grds1.repeatable = true;
quest.grds1.rwd = function () {
  this.data.t++;
  giveWealth(65);
  giveExp(3000, true, true, true);
  global.stat.jcom++;
};
quest.grds1.goals = function () {
  return [
    'Guard the gate until 8PM (<span style="color:yellow">in progress</span>)',
  ];
};
quest.grds1.goalsf = function () {
  return ['Guard the gate until 8PM (<span style="color:lime">done!</span>)'];
};

quest.lmfstkil1 = new Quest();
quest.lmfstkil1.id = 5;
quest.lmfstkil1.name = "Monster Eradication";
quest.lmfstkil1.rar = 1;
quest.lmfstkil1.loc = "Western Woods, Hunter's Lodge";
quest.lmfstkil1.desc =
  "Dangerous monsters have invaded the southern forest and terrorizing the villagers. Get rid of them!";
quest.lmfstkil1.data = { t: 0, mkilled: 0 };
quest.lmfstkil1.init = function () {
  this.callback();
};
quest.lmfstkil1.callback = function () {
  if (!quest.lmfstkil1.data.done)
    attachCallback(callback.onDeath, {
      f(victim, killer) {
        if (victim.id === creature.wolf1.id) quest.lmfstkil1.data.mkilled++;
        if (
          quest.lmfstkil1.data.mkilled &&
          !quest.lmfstkil1.data.weird1 &&
          quest.lmfstkil1.data.mkilled >= 35
        ) {
          msg("You hear a piercing wail", "red");
          quest.lmfstkil1.data.weird1 = true;
          smove(chss.frstn3main);
        }
      },
      id: 1005,
      data: { q: true },
    });
};
quest.lmfstkil1.rwd = function () {
  this.data.t++;
  giveWealth(300);
  giveItem(wpn.gsprw);
  giveItem(eqp.nkgd);
  giveExp(18000, true, true, true);
  detachCallback(callback.onDeath, 1005);
};
quest.lmfstkil1.goals = function () {
  let c;
  if (quest.lmfstkil1.data.mkilled >= 35) c = "lime";
  else if (quest.lmfstkil1.data.mkilled < 35) c = "yellow";
  const txt =
    'Wolves killed: <span style="color: ' +
    c +
    '">' +
    quest.lmfstkil1.data.mkilled +
    "/35</span>";
  return [txt];
};
quest.lmfstkil1.goalsf = function () {
  return ['Wolves killed: <span style="color:lime">35/35</span>'];
};

////////////////////////////////////////////

function giveQst(q) {
  if (!q.data.started) {
    q.init();
    q.data.started = true;
    msg(
      (q.repeatable ? '<span style="color:cyan">Repeatable</span> q' : "Q") +
        "uest accepted: " +
        '<span style="color:orange">"' +
        q.name +
        '"</span>',
      "lightblue",
      q,
      8,
    );
    let have = false;
    for (const a in qsts)
      if (qsts[a].id === q.id) {
        have = true;
        break;
      }
    if (!have) qsts.push(q);
  }
}

function finishQst(q) {
  if (q.data.started) {
    q.data.done = true;
    q.data.started = false;
    q.data.pending = false;
    msg("Quest completed: ", "lime");
    msg_add('"' + q.name + '"', "orange");
    q.rwd();
    global.stat.qstc++;
  }
}

global.text.alcohol_d = [
  "You drank some alcohol. You feel warm inside.",
  "You drank alcohol. Party on!",
  "You drank lots of alcohol. Are those white mice?",
  "You drank unholy amounts of alcohol. But what do you care?",
  "You embalmed yourself alive with so much alcohol, that even undead will leave your dead body alone.",
];
