///////////////////////////////////////////
//EQP
///////////////////////////////////////////

function Eqp() {
  this.name = "nothing";
  this.desc = "";
  this.str = 0;
  this.agl = 0;
  this.int = 0;
  this.spd = 0;
  this.dp = 15;
  this.dpmax = 15;
  this.eff = [];
  this.data = { dscv: false };
  this.cls = [0, 0, 0]; // edge, pierce, blunt
  //this.ccls=[0,0,0];
  this.aff = [0, 0, 0, 0, 0, 0, 0]; //p, a, e, f, w, l, d
  //this.caff = [0,0,0,0,0,0,0];
  //this.maff=[0,0,0,0,0,0,0];
  //this.cmaff=[0,0,0,0,0,0,0];
  this.atype = 0;
  this.ctype = 0;
  this.wtype = 0; // un, srd, axe, knf, spr, hmr, stff
  this.atkmode = 1;
  this.rar = 1;
  this.type = 2;
  this.amount = 1;
  this.stype = 2;
  this.slot = 0;
  this.id = 10000;
  this.important = false;
  this.new = false;
  this.cond = function () {
    return true;
  };
  this.onGet = function () {};
  this.oneq = function () {};
  this.onuneq = function () {};
  this.use = function () {
    equip(this);
  };
}
eqp.dummy = new Eqp();

wpn.stk1 = new Eqp();
wpn.stk1.id = 10001;
wpn.stk1.name = "A Stick";
wpn.stk1.desc = "Your favorite weapon!" + dom.dseparator;
wpn.stk1.slot = 1;
wpn.stk1.str = 2;
wpn.stk1.cls = [0, 0, 1];
wpn.stk1.ctype = 2;
wpn.stk1.wtype = 5;
wpn.stk1.dp = wpn.stk1.dpmax = 13;

wpn.stk2 = new Eqp();
wpn.stk2.id = 10002;
wpn.stk2.name = "Sharpened Stick";
wpn.stk2.desc =
  "Long stick with a sharpened end. Watch out, you may hurt someone with it" +
  dom.dseparator;
wpn.stk2.slot = 1;
wpn.stk2.str = 5;
wpn.stk2.cls = [0, 3, 0];
wpn.stk2.ctype = 1;
wpn.stk2.wtype = 4;
wpn.stk2.dp = wpn.stk2.dpmax = 16;
wpn.stk2.onGet = function () {
  let n = 0;
  for (const a in inv) if (inv[a].id === this.id) n++;
  if (n >= 4) giveRcp(rcp.stksld);
};

wpn.knf1 = new Eqp();
wpn.knf1.id = 10003;
wpn.knf1.name = "Wooden Knife";
wpn.knf1.desc =
  "Lost kid's toy. The relic of many playground battles" + dom.dseparator;
wpn.knf1.slot = 1;
wpn.knf1.str = 4;
wpn.knf1.cls = [0, 0, 2];
wpn.knf1.ctype = 2;
wpn.knf1.wtype = 3;
wpn.knf1.dp = wpn.knf1.dpmax = 31;

wpn.knf2 = new Eqp();
wpn.knf2.id = 10004;
wpn.knf2.name = "Rusty Dagger";
wpn.knf2.desc =
  "Used up useless knife. More of a blunt weapon in it's current state" +
  dom.dseparator;
wpn.knf2.slot = 1;
wpn.knf2.str = 7;
wpn.knf2.agl = -1;
wpn.knf2.cls = [3, 2, 1];
wpn.knf2.dp = wpn.knf2.dpmax = 11;
wpn.knf2.wtype = 3;

wpn.ktn1 = new Eqp();
wpn.ktn1.id = 10005;
wpn.ktn1.name = "Rusty Katana";
wpn.ktn1.desc =
  "Old worthless blade, forgotten for ages. It falls apart as you attempt to swing it" +
  dom.dseparator;
wpn.ktn1.slot = 1;
wpn.ktn1.str = 15;
wpn.ktn1.agl = -2;
wpn.ktn1.cls = [4, 1, 2];
wpn.ktn1.dp = wpn.ktn1.dpmax = 21;
wpn.ktn1.wtype = 1;

wpn.ktn2 = new Eqp();
wpn.ktn2.id = 10006;
wpn.ktn2.name = "Red Katana";
wpn.ktn2.desc =
  "Polished rusty katana. Still nearly useless in a fight" + dom.dseparator;
wpn.ktn2.slot = 1;
wpn.ktn2.str = 42;
wpn.ktn2.agl = -4;
wpn.ktn2.cls = [5, 3, 2];
wpn.ktn2.dp = wpn.ktn2.dpmax = 17;
wpn.ktn2.wtype = 1;

wpn.trch = new Eqp();
wpn.trch.id = 10007;
wpn.trch.name = "Torch";
wpn.trch.desc =
  "Used to light up dark places or for burning up thing" +
  dom.dseparator +
  '<span style="color:yellow;background-color:crimson">Fire DMG +10</span><br>';
wpn.trch.slot = 1;
wpn.trch.str = 2;
wpn.trch.atype = 3;
wpn.trch.aff = [0, 0, 0, 10, 0, 5, 0];
wpn.trch.cls = [0, 0, 3];
wpn.trch.ctype = 2;
wpn.trch.dp = wpn.trch.dpmax = 10;
wpn.trch.degrade = 0.03;
wpn.trch.wtype = 5;
wpn.trch.oneq = function () {
  you.mods.light += 1;
};
wpn.trch.onuneq = function () {
  you.mods.light -= 1;
};
wpn.trch.onDegrade = function () {
  msg("Your torch burned down", "darkgrey");
};

wpn.twg = new Eqp();
wpn.twg.id = 10009;
wpn.twg.name = "Dry Twig";
wpn.twg.desc =
  "With this you can pretend you're a wizard" +
  dom.dseparator +
  '<span style="color:lightgoldenrodyellow;text-shadow:gold 0px 0px 5px">Light DMG +3</span><br>';
wpn.twg.slot = 1;
wpn.twg.int = 3;
wpn.twg.cls = [0, 0, 2];
wpn.twg.aff = [0, 1, 0, 0, 0, 3, 5];
wpn.twg.atype = 5;
wpn.twg.atkmode = 2;
wpn.twg.dp = wpn.twg.dpmax = 12;
wpn.twg.wtype = 6;

wpn.dgknf = new Eqp();
wpn.dgknf.id = 10010;
wpn.dgknf.name = "Dagger";
wpn.dgknf.desc =
  "Simple knife used by wayfarers. Not a combat weapon, has a minor domestic use" +
  dom.dseparator;
wpn.dgknf.slot = 1;
wpn.dgknf.str = 11;
wpn.dgknf.cls = [4, 2, 0];
wpn.dgknf.dp = wpn.dgknf.dpmax = 22;
wpn.dgknf.wtype = 3;

wpn.bknf = new Eqp();
wpn.bknf.id = 10011;
wpn.bknf.name = "Battle Knife";
wpn.bknf.desc = "A good dagger for the novice" + dom.dseparator;
wpn.bknf.slot = 1;
wpn.bknf.wtype = 3;

wpn.skknf = new Eqp();
wpn.skknf.id = 10012;
wpn.skknf.name = "Scramasax";
wpn.skknf.desc = "A good knife for both combat and daily use" + dom.dseparator;
wpn.skknf.slot = 1;
wpn.skknf.wtype = 3;
wpn.skknf.ctype = 1;

wpn.drknf = new Eqp();
wpn.drknf.id = 10013;
wpn.drknf.name = "Dirk";
wpn.drknf.desc = "A steady knife you can depend on" + dom.dseparator;
wpn.drknf.slot = 1;
wpn.drknf.wtype = 3;

wpn.thknf = new Eqp();
wpn.thknf.id = 10014;
wpn.thknf.name = "Throwing Knife";
wpn.thknf.desc = "A finely honed throwing knife" + dom.dseparator;
wpn.thknf.slot = 1;
wpn.thknf.wtype = 3;
wpn.thknf.ctype = 1;

wpn.kdknf = new Eqp();
wpn.kdknf.id = 10015;
wpn.kdknf.name = "Kudi";
wpn.kdknf.desc = "A dangerous dagger with a curved blade" + dom.dseparator;
wpn.kdknf.slot = 1;
wpn.kdknf.wtype = 3;

wpn.krsnf = new Eqp();
wpn.krsnf.id = 10016;
wpn.krsnf.name = "Kris";
wpn.krsnf.desc = "An exotic dagger with a wavy blade" + dom.dseparator;
wpn.krsnf.slot = 1;
wpn.krsnf.wtype = 3;
wpn.krsnf.ctype = 1;

wpn.cqsnf = new Eqp();
wpn.cqsnf.id = 10017;
wpn.cqsnf.name = "Cinquedea";
wpn.cqsnf.desc = "The knife of theives" + dom.dseparator;
wpn.cqsnf.slot = 1;
wpn.cqsnf.wtype = 3;
wpn.cqsnf.ctype = 1;

wpn.kkknf = new Eqp();
wpn.kkknf.id = 10018;
wpn.kkknf.name = "Khukuri";
wpn.kkknf.desc = "A knife with a heavy, curved blade" + dom.dseparator;
wpn.kkknf.slot = 1;
wpn.kkknf.wtype = 3;

wpn.bdknf = new Eqp();
wpn.bdknf.id = 10019;
wpn.bdknf.name = "Baselard";
wpn.bdknf.desc =
  "A battle knife with a flat, thin blade, perfect for deploying fast attacks" +
  dom.dseparator;
wpn.bdknf.slot = 1;
wpn.bdknf.wtype = 3;

wpn.stknf = new Eqp();
wpn.stknf.id = 10020;
wpn.stknf.name = "Stiletto";
wpn.stknf.desc = "A stabbing dagger with a thin, sharp blade" + dom.dseparator;
wpn.stknf.slot = 1;
wpn.stknf.wtype = 3;
wpn.stknf.ctype = 1;

wpn.jmknf = new Eqp();
wpn.jmknf.id = 10021;
wpn.jmknf.name = "Jamadhar";
wpn.jmknf.desc =
  "An exotic dagger with three blades in one hilt" + dom.dseparator;
wpn.jmknf.slot = 1;
wpn.jmknf.wtype = 3;
wpn.jmknf.ctype = 1;

wpn.skknf = new Eqp();
wpn.skknf.id = 10022;
wpn.skknf.name = "Soul Kiss";
wpn.skknf.desc = "Cursed knife capable of rapturing the soul" + dom.dseparator;
wpn.skknf.slot = 1;
wpn.skknf.wtype = 3;

wpn.rbknf = new Eqp();
wpn.rbknf.id = 10023;
wpn.rbknf.name = "Ribsplitter";
wpn.rbknf.desc = "Unusualy long knife with a curved tip" + dom.dseparator;
wpn.rbknf.slot = 1;
wpn.rbknf.wtype = 3;

wpn.gaknf = new Eqp();
wpn.gaknf.id = 10024;
wpn.gaknf.name = "Glacialdra";
wpn.gaknf.desc = "";
wpn.gaknf.slot = 1;
wpn.gaknf.rar = 3;
wpn.gaknf.wtype = 3;

wpn.ekmw = new Eqp();
wpn.ekmw.id = 10025;
wpn.ekmw.name = "Ekimnekuwa";
wpn.ekmw.desc =
  'Also known as "Hiking Stick". Sturdy, used for support while travelling on foot in forests, mountains, through the snow, water, or any other difficult to navigate landscape' +
  dom.dseparator;
wpn.ekmw.slot = 1;
wpn.ekmw.ctype = 2;
wpn.ekmw.wtype = 5;

wpn.mnkm = new Eqp();
wpn.mnkm.id = 10026;
wpn.mnkm.name = "Menokamakiri";
wpn.mnkm.desc =
  "Short knife, designed for women. Light and durable, functions like a hunting knife" +
  dom.dseparator;
wpn.mnkm.slot = 1;
wpn.mnkm.wtype = 3;

wpn.mkr = new Eqp();
wpn.mkr.id = 10027;
wpn.mkr.name = "Makiri";
wpn.mkr.desc = "Short sword" + dom.dseparator;
wpn.mkr.slot = 1;
wpn.mkr.wtype = 1;

wpn.wsrd1 = new Eqp();
wpn.wsrd1.id = 10028;
wpn.wsrd1.name = "Wooden Sword";
wpn.wsrd1.desc =
  "Simple long sword carved from light wood. Easy to handle and is suitable as amateurish training weapon" +
  dom.dseparator;
wpn.wsrd1.slot = 1;
wpn.wsrd1.str = 7;
wpn.wsrd1.cls = [1, 0, 3];
wpn.wsrd1.dp = wpn.wsrd1.dpmax = 33;
wpn.wsrd1.wtype = 1;
wpn.wsrd1.ctype = 2;

wpn.wsrd2 = new Eqp();
wpn.wsrd2.id = 10029;
wpn.wsrd2.name = "Bamboo Training Sword";
wpn.wsrd2.desc =
  "A training sword for kenjutsu lessons. Designed in the late Edo period, it is strung together from four bamboo planks. The ruthless chief of a female bandit group named Danfu is known to wield it" +
  dom.dseparator;
wpn.wsrd2.slot = 1;
wpn.wsrd2.str = 10;
wpn.wsrd2.cls = [2, 0, 3];
wpn.wsrd2.dp = wpn.wsrd2.dpmax = 41;
wpn.wsrd2.wtype = 1;
wpn.wsrd2.ctype = 2;

wpn.nssrd = new Eqp();
wpn.nssrd.id = 10030;
wpn.nssrd.name = "Short Sword";
wpn.nssrd.desc =
  "Short crude sword designed for self-defence. It's not that useful in battle, especially in unskilled hands" +
  dom.dseparator;
wpn.nssrd.slot = 1;
wpn.nssrd.str = 55;
wpn.nssrd.cls = [4, 2, 1];
wpn.nssrd.dp = wpn.nssrd.dpmax = 35;
wpn.nssrd.wtype = 1;

wpn.heyit = new Eqp();
wpn.heyit.id = 10031;
wpn.heyit.name = "Heiyoto";
wpn.heyit.desc =
  "Nothing flashy or noticeable about his sword. It reflects the samurai spirit" +
  dom.dseparator;

wpn.fksrd = new Eqp();
wpn.fksrd.id = 10032;
wpn.fksrd.name = "Fake Sword";
wpn.fksrd.desc =
  "The sword is made of bamboo. Poorer ronin sometimes pretend to be full-fledged samurai with this" +
  dom.dseparator;
wpn.fksrd.slot = 1;
wpn.fksrd.str = 23;
wpn.fksrd.cls = [2, 0, 4];
wpn.fksrd.dp = wpn.fksrd.dpmax = 33;
wpn.fksrd.wtype = 1;
wpn.fksrd.ctype = 2;

wpn.tkmts = new Eqp();
wpn.tkmts.id = 10033;
wpn.tkmts.name = "Takemitsu";
wpn.tkmts.desc =
  "This reinforced sword is made of bamboo. Not much as a weapon, but makes you seem stronger" +
  dom.dseparator;
wpn.tkmts.slot = 1;
wpn.tkmts.str = 35;
wpn.tkmts.cls = [2, 1, 5];
wpn.tkmts.dp = wpn.tkmts.dpmax = 40;
wpn.tkmts.wtype = 1;
wpn.tkmts.ctype = 2;

wpn.bsrd = new Eqp();
wpn.bsrd.id = 10034;
wpn.bsrd.name = "Blunt Sword";
wpn.bsrd.desc =
  "This is the blunt sword used as a bad example of a knife in demonstration sales for housewives. Good luck trying to cut onions with this" +
  dom.dseparator;
wpn.bsrd.slot = 1;
wpn.bsrd.str = 20;
wpn.bsrd.cls = [2, 3, 3];
wpn.bsrd.dp = wpn.bsrd.dpmax = 38;
wpn.bsrd.wtype = 1;
wpn.bsrd.ctype = 2;

wpn.bdsrd = new Eqp();
wpn.bdsrd.id = 10035;
wpn.bdsrd.name = "Dull Sword";
wpn.bdsrd.desc =
  "A sword designed for mass production by reducing labor and material cost down to a minimum. It may look like a sword, but it's not really fit to cut anything. The manual suggests it be used to cut radishes" +
  dom.dseparator;
wpn.bdsrd.slot = 1;
wpn.bdsrd.str = 27;
wpn.bdsrd.cls = [2, 3, 3];
wpn.bdsrd.dp = wpn.bdsrd.dpmax = 34;
wpn.bdsrd.wtype = 1;
wpn.bdsrd.ctype = 2;

wpn.bcsrd = new Eqp();
wpn.bcsrd.id = 10036;
wpn.bcsrd.name = "Crappy Sword";
wpn.bcsrd.desc =
  'This sword is sold at the 100 Cout store under the name "Big Loss". You get what you pay for. There are even competitions to see who can sharpen this sword the best' +
  dom.dseparator;
wpn.bcsrd.slot = 1;
wpn.bcsrd.str = 40;
wpn.bcsrd.cls = [4, 3, 3];
wpn.bcsrd.dp = wpn.bcsrd.dpmax = 34;
wpn.bcsrd.wtype = 1;

wpn.ktsk = new Eqp();
wpn.ktsk.id = 10037; //2
wpn.ktsk.name = "Kotesaki";
wpn.ktsk.desc =
  "A light sword a ight-heartet guy begged the swordsmith to make. He thought his sword would make him more popular with the ladies. He managed to rack up some wins by cheating, but the ladies still don't like him" +
  dom.dseparator;

wpn.crsto = new Eqp();
wpn.crsto.id = 10038; //3
wpn.crsto.name = "Cristo";
wpn.crsto.desc =
  "A samurai wrongly imprisoned for a crime he didn't commit carved this weapon from his cell walls. He did this in a secret from the guards, but by the time he finished, his sentence was over" +
  dom.dseparator;

wpn.ksbmr = new Eqp();
wpn.ksbmr.id = 10039; //4
wpn.ksbmr.name = "Komusubimaru";
wpn.ksbmr.desc =
  'A swordsman who loves sumo made this sword to cheer on his favorite sumo wrestler. But the name "Komusubi" is a low rank in sumo. It was bad luck, and the wrestler never got promoted' +
  dom.dseparator;

wpn.hsmts = new Eqp();
wpn.hsmts.id = 10040; //5
wpn.hsmts.name = "Hasemitsu";
wpn.hsmts.desc =
  "A swordsmith created this blade as he danced around bragging about his skill. You may think he was just screwing around, but this sword is actually quiet nice" +
  dom.dseparator;

wpn.kiknif = new Eqp();
wpn.kiknif.id = 10041;
wpn.kiknif.name = "Kitchen Knife";
wpn.kiknif.desc =
  "A knife originally used to cut fish, not people. It's not a sword, but ordering one won't get you yelled at" +
  dom.dseparator +
  '<span style="color:deeppink">Cooking EXP gain +15%</span><br>';
wpn.kiknif.slot = 1;
wpn.kiknif.str = 24;
wpn.kiknif.cls = [3, 2, 0];
wpn.kiknif.dp = wpn.kiknif.dpmax = 15;
wpn.kiknif.wtype = 3;
wpn.kiknif.oneq = function () {
  skl.cook.p += 0.15;
};
wpn.kiknif.onuneq = function () {
  skl.cook.p -= 0.15;
};

wpn.gamas = new Eqp();
wpn.gamas.id = 10042; //6
wpn.gamas.name = "Gama";
wpn.gamas.desc =
  "A man's wife who had a face that resembles a frog died, so he hired a medium to do a seance to summon his wife's spirit. But the medium summoned the spirit of some toad. The husband used this sword to kill the medium" +
  dom.dseparator;

wpn.wsdmbld = new Eqp();
wpn.wsdmbld.id = 10043; //7
wpn.wsdmbld.name = "Wisdom Blade";
wpn.wsdmbld.desc =
  "This is the sword used by a serial killer that struck fear in Edo. The killer stole his family sword to do his killing, so you can imagine that things got weird at the house when they found the sword missing" +
  dom.dseparator;

wpn.kurum = new Eqp();
wpn.kurum.id = 10044; //8
wpn.kurum.name = "Kuruma";
wpn.kurum.desc =
  "This is the sword used by a great tengu when he taught Ushiwakamaru how to fight at Mt. Kuruma. Ushiwakamaru is trained to fight and also became great at the pommel horse" +
  dom.dseparator;

wpn.hrsm = new Eqp();
wpn.hrsm.id = 10045; //9 ice
wpn.hrsm.name = "Harusame";
wpn.hrsm.desc =
  "A sword made in the quiet rain in spring. It is easy to wield and can be chewy. When dried, it won't be as sharp, but putting water turns it back to normal" +
  dom.dseparator;

wpn.kosgi = new Eqp();
wpn.kosgi.id = 10046; //10
wpn.kosgi.name = "Kosugi";
wpn.kosgi.desc =
  "A sword used by the famous ninja who left the country and took and extremely dangerous mission. This sword encompasses his very being" +
  dom.dseparator;

wpn.shiran = new Eqp();
wpn.shiran.id = 10047; //11
wpn.shiran.name = "Shiran";
wpn.shiran.desc =
  "Its name comes from its purple orchid-like accessory. The true etymology of the sword is a mystery to even its swordsmith" +
  dom.dseparator;

wpn.shnztt = new Eqp();
wpn.shnztt.id = 10048; //12
wpn.shnztt.name = "Shinzanto";
wpn.shnztt.desc =
  "Those who wield this sword also command the shaky nervousness of the rookie blacksmith who crafted it" +
  dom.dseparator;

wpn.lsrd = new Eqp();
wpn.lsrd.id = 10049;
wpn.lsrd.name = "Light Sword";
wpn.lsrd.desc =
  "A basic, easy to wield civilian-level light sword" + dom.dseparator;
wpn.lsrd.slot = 1;
wpn.lsrd.wtype = 1;

wpn.log = new Eqp();
wpn.log.id = 10050;
wpn.log.name = "Log";
wpn.log.desc =
  "A massive heavy tree log. How did you even think about swinging it as a weapon?" +
  dom.dseparator;
wpn.log.slot = 1;
wpn.log.twoh = true;
wpn.log.str = 48;
wpn.log.cls = [-5, -5, 6];
wpn.log.agl = -15;
wpn.log.ctype = 2;
wpn.log.wtype = 5;
wpn.log.dp = wpn.log.dpmax = 68;

wpn.sprw = new Eqp();
wpn.sprw.id = 10051;
wpn.sprw.name = "Spear";
wpn.sprw.desc =
  "Long piece of wood with a sharp metal chunk at the end of it. Couldn't get simpler than that" +
  dom.dseparator;
wpn.sprw.slot = 1;
wpn.sprw.str = 11;
wpn.sprw.cls = [2, 4, 1];
wpn.sprw.ctype = 1;
wpn.sprw.wtype = 4;
wpn.sprw.dp = wpn.sprw.dpmax = 26;

wpn.gsprw = new Eqp();
wpn.gsprw.id = 10052;
wpn.gsprw.name = "Guard Spear";
wpn.gsprw.desc =
  "Basic and easy to wield spear used in self-defence" + dom.dseparator;
wpn.gsprw.slot = 1;
wpn.gsprw.str = 27;
wpn.gsprw.cls = [2, 5, 2];
wpn.gsprw.ctype = 1;
wpn.gsprw.wtype = 4;
wpn.gsprw.dp = wpn.gsprw.dpmax = 44;

wpn.scspt1 = new Eqp();
wpn.scspt1.id = 10053;
wpn.scspt1.name = "Red Hand";
wpn.scspt1.desc =
  "Burning sword that looks like a scissors blade. Its flames can evaporate any liquid" +
  dom.dseparator +
  '<span style="color:orange;text-shadow:red 0px 0px 5px,red 0px 0px 5px">Fire Affinity +25</span><br>';
wpn.scspt1.slot = 1;
wpn.scspt1.str = 54;
wpn.scspt1.cls = [10, 7, 3];
wpn.scspt1.aff = [0, 0, 0, 25, -35, 0, 0];
wpn.scspt1.dp = wpn.scspt1.dpmax = 75;
wpn.scspt1.wtype = 1;
wpn.scspt1.atype = 3;
wpn.scspt1.rar = 3;

wpn.scspt2 = new Eqp();
wpn.scspt2.id = 10054;
wpn.scspt2.name = "Blue Hand";
wpn.scspt2.desc =
  "Freezing sword that looks like a scissors blade. Its edge can calm the fieriest fire" +
  dom.dseparator +
  '<span style="color:cyan;text-shadow:blue 0px 0px 5px,blue 0px 0px 5px">Water Affinity +25</span><br>';
wpn.scspt2.slot = 1;
wpn.scspt2.str = 52;
wpn.scspt2.cls = [11, 8, 5];
wpn.scspt2.aff = [0, 0, 0, -35, 25, 0, 0];
wpn.scspt2.dp = wpn.scspt2.dpmax = 65;
wpn.scspt2.wtype = 1;
wpn.scspt2.atype = 4;
wpn.scspt2.rar = 3;

wpn.scspt3 = new Eqp();
wpn.scspt3.id = 10055;
wpn.scspt3.name = "Fate Cutters";
wpn.scspt3.desc =
  "Two swords combined together, forming a scissors-shaped weapon. It is said a mad blacksmith created this blade to hunt demigods" +
  dom.dseparator +
  '<span style="color:mediumorchid;text-shadow:darkblue 0px 0px 5px,darkblue 0px 0px 5px">Dark Affinity +30</span><br>';
wpn.scspt3.slot = 1;
wpn.scspt3.twoh = true;
wpn.scspt3.str = 108;
wpn.scspt3.cls = [15, 12, 6];
wpn.scspt3.aff = [0, 0, 0, 15, 15, -5, 30];
wpn.scspt3.dp = wpn.scspt3.dpmax = 99;
wpn.scspt3.wtype = 1;
wpn.scspt3.atype = 6;
wpn.scspt3.rar = 4;

wpn.shrsb = new Eqp();
wpn.shrsb.id = 10056;
wpn.shrsb.name = "Shears";
wpn.shrsb.desc =
  "Massive gardening shears, for tiding up the bushes and other decorative flora. A murderer in the past was known to commit atrocities with a similar tool" +
  dom.dseparator;
wpn.shrsb.slot = 1;
wpn.shrsb.twoh = true;
wpn.shrsb.str = 40;
wpn.shrsb.agl = -11;
wpn.shrsb.cls = [8, 5, 1];
wpn.shrsb.dp = wpn.shrsb.dpmax = 45;
wpn.shrsb.wtype = 3;

wpn.evob = new Eqp();
wpn.evob.id = 10057;
wpn.evob.name = "Sword Of Evolution";
wpn.evob.desc =
  "This living blade can absorb the blood and souls of defeated foes, it gets sharper with each kill" +
  dom.dseparator;
wpn.evob.slot = 1;
wpn.evob.str = 1;
wpn.evob.rar = 4;
wpn.evob.dp = wpn.evob.dpmax = 30;
wpn.evob.wtype = 1;
wpn.evob.oneq = function () {
  attachCallback(callback.onDeath, {
    f(victim, killer) {
      you.eqp[0].str += victim.str * 0.00005;
      you.eqp[0].agl += victim.agl * 0.000003;
      you.eqp[0].int += victim.int * 0.000001;
      const d = victim.lvl * 0.001 ** (1 + victim.rnk * 0.01);
      you.eqp[0].dp += d;
      you.eqp[0].dpmax += d;
    },
    id: 10057,
    data: { q: true },
  });
};
wpn.evob.onuneq = function () {
  detachCallback(callback.onDeath, 10057);
};

wpn.mkrdwk = new Eqp();
wpn.mkrdwk.id = 10058;
wpn.mkrdwk.name = "Marked Wakizashi";
wpn.mkrdwk.desc =
  "Old wakizashi variant with red hilt. Scarred and chipped blade hints that it was used rather heavily in the past" +
  dom.dseparator;
wpn.mkrdwk.slot = 1;
wpn.mkrdwk.important = true;
wpn.mkrdwk.rar = 2;
wpn.mkrdwk.str = 40;
wpn.mkrdwk.cls = [4, 3, 2];
wpn.mkrdwk.dp = wpn.mkrdwk.dpmax = 48;
wpn.mkrdwk.wtype = 1;

eqp.bnd = new Eqp();
eqp.bnd.id = 20001;
eqp.bnd.name = "Bandana";
eqp.bnd.desc =
  "Thin cloth bandana. It protects your face from sweat" + dom.dseparator;
eqp.bnd.slot = 3;
eqp.bnd.str = 3;
eqp.bnd.agl = 1;
eqp.bnd.aff = [1, 0, 1, 4, -2, 0, 0];
eqp.bnd.cls = [1, 0, 2];
eqp.bnd.stype = 3;
eqp.bnd.dp = eqp.bnd.dpmax = 11;

eqp.pnt = new Eqp();
eqp.pnt.id = 20002;
eqp.pnt.name = "Dojo Pants";
eqp.pnt.desc = "Perfect for morning runs" + dom.dseparator;
eqp.pnt.slot = 7;
eqp.pnt.str = 4;
eqp.pnt.agl = 2;
eqp.pnt.aff = [2, 0, 3, 4, -1, 0, 0];
eqp.pnt.cls = [2, 1, 1];
eqp.pnt.stype = 3;
eqp.pnt.dp = eqp.pnt.dpmax = 19;

eqp.brc = new Eqp();
eqp.brc.id = 20003;
eqp.brc.name = "Bandage";
eqp.brc.desc = "Simple handwraps" + dom.dseparator;
eqp.brc.slot = 5;
eqp.brc.str = 2;
eqp.brc.agl = 1;
eqp.brc.int = 3;
eqp.brc.aff = [0, 0, 0, 0, 0, 0, 0];
eqp.brc.cls = [1, 0, 1];
eqp.brc.stype = 3;
eqp.brc.dp = eqp.brc.dpmax = 11;

eqp.gnt = new Eqp();
eqp.gnt.id = 20004;
eqp.gnt.name = "Gauntlet";
eqp.gnt.desc =
  "Tough leather gauntlet that covers your entire hand. May prevent you from losing fingers" +
  dom.dseparator;
eqp.gnt.slot = 5;
eqp.gnt.str = 10;
eqp.gnt.stype = 3;
eqp.gnt.aff = [2, 1, 3, 3, 2, 2, 1];
eqp.gnt.cls = [3, 2, 4];
eqp.gnt.dp = eqp.gnt.dpmax = 24;

eqp.vst = new Eqp();
eqp.vst.id = 20005;
eqp.vst.name = "Linen Vest";
eqp.vst.desc = "You'll feel chilly without sleeves" + dom.dseparator;
eqp.vst.slot = 4;
eqp.vst.str = 6;
eqp.vst.stype = 3;
eqp.vst.aff = [1, 0, 0, 0, 0, 1, 0];
eqp.vst.cls = [3, 1, 1];
eqp.vst.dp = eqp.vst.dpmax = 23;

eqp.thd = new Eqp();
eqp.thd.id = 20006;
eqp.thd.name = "Yellow Hood";
eqp.thd.desc = "";
eqp.thd.slot = 3;
eqp.thd.stype = 3;

eqp.amsk = new Eqp();
eqp.amsk.id = 20007;
eqp.amsk.name = "Wolf Mask";
eqp.amsk.desc =
  'A cute wolf mask.<br>It symbolizes <span style="color:orange;text-shadow:red 0px 0px 5px,red 0px 0px 5px">Fire</span>';
eqp.amsk.slot = 3;
eqp.amsk.stype = 3;
eqp.amsk.caff = [1, 0, 0, 20, 0, 0, 0];
eqp.amsk.cls = [5, 5, 5];
eqp.amsk.rar = 2;
eqp.amsk.dp = eqp.amsk.dpmax = 30;
eqp.amsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
};
eqp.amsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
};

eqp.bmsk = new Eqp();
eqp.bmsk.id = 20008;
eqp.bmsk.name = "Frog Mask";
eqp.bmsk.desc =
  'A cute frog mask.<br>It symbolizes <span style="color:cyan;text-shadow:blue 0px 0px 5px,blue 0px 0px 5px">Water</span>';
eqp.bmsk.slot = 3;
eqp.bmsk.stype = 3;
eqp.bmsk.caff = [1, 0, 0, 0, 20, 0, 0];
eqp.bmsk.cls = [5, 5, 5];
eqp.bmsk.rar = 2;
eqp.bmsk.dp = eqp.bmsk.dpmax = 30;
eqp.bmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
};
eqp.bmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
};

eqp.cmsk = new Eqp();
eqp.cmsk.id = 20009;
eqp.cmsk.name = "Cat Mask";
eqp.cmsk.desc =
  'A cute cat mask. <br>It symbolizes <span style="color:lime;text-shadow:green 0px 0px 5px,green 0px 0px 5px">Wind</span>';
eqp.cmsk.slot = 3;
eqp.cmsk.stype = 3;
eqp.cmsk.caff = [1, 20, 0, 0, 0, 0, 0];
eqp.cmsk.cls = [5, 5, 5];
eqp.cmsk.rar = 2;
eqp.cmsk.dp = eqp.cmsk.dpmax = 30;
eqp.cmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
};
eqp.cmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
};

eqp.dmsk = new Eqp();
eqp.dmsk.id = 20010;
eqp.dmsk.name = "Dog Mask";
eqp.dmsk.desc =
  'A cute dog mask. <br>It symbolizes <span style="color:gold;text-shadow:orange 0px 0px 5px,orange 0px 0px 5px">Bravery</span>';
eqp.dmsk.slot = 3;
eqp.dmsk.stype = 3;
eqp.dmsk.caff = [1, 0, 20, 0, 0, 0, 0];
eqp.dmsk.cls = [5, 5, 5];
eqp.dmsk.rar = 2;
eqp.dmsk.dp = eqp.dmsk.dpmax = 30;
eqp.dmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
};
eqp.dmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
};

eqp.emsk = new Eqp();
eqp.emsk.id = 20011;
eqp.emsk.name = "Fox Mask";
eqp.emsk.desc =
  'A cute fox mask. <br>It symbolizes <span style="color:lightgoldenrodyellow;text-shadow:gold 0px 0px 5px">Light</span>';
eqp.emsk.slot = 3;
eqp.emsk.stype = 3;
eqp.emsk.caff = [1, 0, 0, 0, 0, 20, 0];
eqp.emsk.cls = [5, 5, 5];
eqp.emsk.rar = 2;
eqp.emsk.dp = eqp.emsk.dpmax = 30;
eqp.emsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
};
eqp.emsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
};

eqp.fmsk = new Eqp();
eqp.fmsk.id = 20012;
eqp.fmsk.name = "Devil Mask";
eqp.fmsk.desc =
  'A viscous devil mask. <br>It symbolizes <span style="color:mediumorchid;text-shadow:darkblue 0px 0px 5px,darkblue 0px 0px 5px">Darkness</span>';
eqp.fmsk.slot = 3;
eqp.fmsk.stype = 3;
eqp.fmsk.caff = [1, 0, 0, 0, 0, 0, 20];
eqp.fmsk.cls = [5, 5, 5];
eqp.fmsk.rar = 2;
eqp.fmsk.dp = eqp.fmsk.dpmax = 30;
eqp.fmsk.oneq = function () {
  for (const afn in this.caff) you.caff[afn] += this.caff[afn];
};
eqp.fmsk.onuneq = function () {
  for (const afn in this.caff) you.caff[afn] -= this.caff[afn];
};

eqp.nkgd = new Eqp();
eqp.nkgd.id = 20013;
eqp.nkgd.name = "Neck Guard";
eqp.nkgd.desc =
  "Metal plating worn around the neck. Minor protection from direct frontal attacks" +
  dom.dseparator;
eqp.nkgd.str = 7;
eqp.nkgd.slot = 3;
eqp.nkgd.stype = 3;
eqp.nkgd.aff = [3, -3, -3, -3, -3, -3, -3];
eqp.nkgd.cls = [4, 4, 4];
eqp.nkgd.dp = eqp.nkgd.dpmax = 35;

eqp.sndl = new Eqp();
eqp.sndl.id = 20014;
eqp.sndl.name = "Sandals";
eqp.sndl.desc =
  "Cheap unremarkable sandals made from light leather. Aren't even that comfortable to wear" +
  dom.dseparator;
eqp.sndl.slot = 7;
eqp.sndl.str = 3;
eqp.sndl.agl = 1;
eqp.sndl.aff = [2, 0, 2, 3, -1, 0, 0];
eqp.sndl.cls = [1, 1, 1];
eqp.sndl.stype = 3;
eqp.sndl.dp = eqp.sndl.dpmax = 12;

eqp.ykkr = new Eqp();
eqp.ykkr.id = 20015;
eqp.ykkr.name = "Yukker";
eqp.ykkr.desc =
  "Warm deerskin boots, worn by civilians and hunters during winter for maximum protection from cold and environmental hazards" +
  dom.dseparator;
eqp.ykkr.slot = 7;
eqp.ykkr.str = 11;
eqp.ykkr.agl = 2;
eqp.ykkr.aff = [3, 5, 15, 7, 3, 0, 0];
eqp.ykkr.cls = [5, 4, 8];
eqp.ykkr.stype = 3;
eqp.ykkr.dp = eqp.ykkr.dpmax = 22;

eqp.tnc = new Eqp();
eqp.tnc.id = 20016;
eqp.tnc.name = "Tunic";
eqp.tnc.desc =
  "A simple, short-sleeved shirt. It's somewhat short in length and tailored to snugly fit the wearer's body" +
  dom.dseparator;
eqp.tnc.slot = 4;
eqp.tnc.str = 9;
eqp.tnc.stype = 3;
eqp.tnc.aff = [2, 1, -1, 1, 1, 5, 0];
eqp.tnc.cls = [2, 2, 3];
eqp.tnc.dp = eqp.tnc.dpmax = 26;

eqp.rncp = new Eqp();
eqp.rncp.id = 20017;
eqp.rncp.name = "Rain Cap";
eqp.rncp.desc =
  "The cap with the wide brim for keeping the rain from the wearer's eyes" +
  dom.dseparator;
eqp.rncp.slot = 3;
eqp.rncp.str = 9;
eqp.rncp.aff = [2, 3, 2, 5, 14, 5, -5];
eqp.rncp.cls = [3, 2, 2];
eqp.rncp.stype = 3;
eqp.rncp.dp = eqp.rncp.dpmax = 17;

eqp.rnss = new Eqp();
eqp.rnss.id = 20018;
eqp.rnss.name = "Rain Shoes";
eqp.rnss.desc =
  "Simple shoes made from tree rubber. Sturdy and longlasting, they protect one's toes from cold" +
  dom.dseparator;
eqp.rnss.slot = 7;
eqp.rnss.str = 9;
eqp.rnss.agl = 2;
eqp.rnss.aff = [4, 5, 10, 9, 14, 1, 0];
eqp.rnss.cls = [3, 7, 5];
eqp.rnss.stype = 3;
eqp.rnss.dp = eqp.rnss.dpmax = 22;

eqp.hkgd = new Eqp();
eqp.hkgd.id = 20019;
eqp.hkgd.name = "Headguard";
eqp.hkgd.desc =
  "A simple and light helmet that provides minimal protection against falling debris and the like" +
  dom.dseparator;
eqp.hkgd.str = 14;
eqp.hkgd.slot = 3;
eqp.hkgd.stype = 3;
eqp.hkgd.aff = [5, -4, -4, -4, -4, -4, -1];
eqp.hkgd.cls = [5, 5, 7];
eqp.hkgd.dp = eqp.hkgd.dpmax = 28;

eqp.wkss = new Eqp();
eqp.wkss.id = 20020;
eqp.wkss.name = "Worker Shoes";
eqp.wkss.desc =
  "Safety shoes for laborers. The metal reinforcement offers dependable protection for the toes" +
  dom.dseparator;
eqp.wkss.slot = 7;
eqp.wkss.str = 16;
eqp.wkss.agl = 2;
eqp.wkss.aff = [7, 12, 8, 7, 8, 1, 2];
eqp.wkss.cls = [5, 4, 6];
eqp.wkss.stype = 3;
eqp.wkss.dp = eqp.wkss.dpmax = 22;

eqp.jhmt = new Eqp();
eqp.jhmt.id = 20021;
eqp.jhmt.name = "Junk Helmet";
eqp.jhmt.desc =
  "A helmet clobbled together from scrap material. It looks terribly heavy but provides good protection around the head and neck" +
  dom.dseparator;
eqp.jhmt.str = 18;
eqp.jhmt.slot = 3;
eqp.jhmt.stype = 3;
eqp.jhmt.aff = [8, -5, -5, -5, -5, -5, -5];
eqp.jhmt.cls = [8, 8, 8];
eqp.jhmt.dp = eqp.jhmt.dpmax = 28;

eqp.knkn = new Eqp();
eqp.knkn.id = 20022;
eqp.knkn.name = "Knit Knee-Highs";
eqp.knkn.desc =
  "Long boots woven from linen. Light and breathable, so they're comfortable when it's hot" +
  dom.dseparator;
eqp.knkn.slot = 7;
eqp.knkn.str = 19;
eqp.knkn.agl = 2;
eqp.knkn.aff = [3, 4, 7, 15, 10, 3, 2];
eqp.knkn.cls = [3, 3, 3];
eqp.knkn.stype = 3;
eqp.knkn.dp = eqp.knkn.dpmax = 32;

eqp.brbn = new Eqp();
eqp.brbn.id = 20023;
eqp.brbn.name = "Burnouns";
eqp.brbn.desc =
  "A long, hooded cloak. Protetcs the wearer from both the scorching sun and chilling cold" +
  dom.dseparator;
eqp.brbn.slot = 4;
eqp.brbn.str = 33;
eqp.brbn.agl = -4;
eqp.brbn.stype = 3;
eqp.brbn.aff = [4, 7, 5, 19, 21, -15, 15];
eqp.brbn.cls = [8, 5, 8];
eqp.brbn.dp = eqp.brbn.dpmax = 41;

eqp.ovrl = new Eqp();
eqp.ovrl.id = 20024;
eqp.ovrl.name = "Overalls";
eqp.ovrl.desc =
  "Work clothes made of heavy cloth that cover the entire body. Protects from bumps and scratches" +
  dom.dseparator;
eqp.ovrl.slot = 4;
eqp.ovrl.str = 25;
eqp.ovrl.stype = 3;
eqp.ovrl.aff = [6, 6, 5, 9, 8, 9, 3];
eqp.ovrl.cls = [8, 8, 8];
eqp.ovrl.dp = eqp.ovrl.dpmax = 33;

eqp.prsnu = new Eqp();
eqp.prsnu.id = 20025;
eqp.prsnu.name = "Prison Uniform";
eqp.prsnu.desc =
  "Made of ugly, coarse cloth, this garment's sturdiness is its only redeeming trait. It holds up well under what washing it does get" +
  dom.dseparator;
eqp.prsnu.slot = 4;
eqp.prsnu.str = 40;
eqp.prsnu.stype = 3;
eqp.prsnu.aff = [9, 6, 5, 9, 8, 9, 3];
eqp.prsnu.cls = [10, 10, 5];
eqp.prsnu.dp = eqp.prsnu.dpmax = 38;

eqp.prsna = new Eqp();
eqp.prsna.id = 20026;
eqp.prsna.name = "Prison Apparel";
eqp.prsna.desc =
  "It looks just like any other prison uniform, but the neck, sleeves and elbows have been made far more comfortable with soft threads" +
  dom.dseparator;
eqp.prsna.slot = 4;
eqp.prsna.rar = 2;
eqp.prsna.str = 44;
eqp.prsna.agl = 5;
eqp.prsna.stype = 3;
eqp.prsna.aff = [9, 7, 8, 9, 8, 9, 3];
eqp.prsna.cls = [10, 10, 10];
eqp.prsna.dp = eqp.prsna.dpmax = 38;

eqp.strwks = new Eqp();
eqp.strwks.id = 20027;
eqp.strwks.name = "Straw Kasa";
eqp.strwks.desc =
  "A Sando-gasa is made by weaving straw together. Great for boys who are too embarrassed to use a parasol" +
  dom.dseparator;
eqp.strwks.slot = 3;
eqp.strwks.str = 6;
eqp.strwks.aff = [3, 3, 2, 13, 2, 5, -5];
eqp.strwks.cls = [2, 1, 1];
eqp.strwks.stype = 3;
eqp.strwks.dp = eqp.strwks.dpmax = 18;

eqp.knkls = new Eqp();
eqp.knkls.id = 20028;
eqp.knkls.name = "Knuckles";
eqp.knkls.desc =
  "Leather bands that cover fingers" +
  dom.dseparator +
  'Unarmed STR: <span style="color:lime">+4</span><br>';
eqp.knkls.slot = 5;
eqp.knkls.str = 4;
eqp.knkls.undc = 4;
eqp.knkls.aff = [1, 0, 0, 0, 0, 0, 0];
eqp.knkls.cls = [2, 1, 1];
eqp.knkls.stype = 3;
eqp.knkls.dp = eqp.knkls.dpmax = 17;
eqp.knkls.oneq = function () {
  you.mods.undc += this.undc;
};
eqp.knkls.onuneq = function () {
  you.mods.undc -= this.undc;
};

eqp.reedhd = new Eqp();
eqp.reedhd.id = 20029;
eqp.reedhd.name = "Reed Hood";
eqp.reedhd.desc =
  "A hat that covers the face of Zen monks made from woven reed. Wearing this doesn't necessarily make you a monk, though" +
  dom.dseparator;
eqp.reedhd.slot = 3;
eqp.reedhd.str = 25;
eqp.reedhd.aff = [4, 1, 7, 13, 2, 9, -5];
eqp.reedhd.cls = [3, 3, 3];
eqp.reedhd.stype = 3;
eqp.reedhd.dp = eqp.reedhd.dpmax = 28;

eqp.ptchct = new Eqp();
eqp.ptchct.id = 20030;
eqp.ptchct.name = "Patchwork Coat";
eqp.ptchct.desc =
  "Coat stitched together from patches of cloth of various sizes and thickness. Somewhat durable but looks desperate" +
  dom.dseparator;
eqp.ptchct.slot = 4;
eqp.ptchct.str = 14;
eqp.ptchct.stype = 3;
eqp.ptchct.aff = [4, 2, 1, 2, 2, 3, 3];
eqp.ptchct.cls = [1, 4, 4];
eqp.ptchct.dp = eqp.ptchct.dpmax = 40;

eqp.ptchpts = new Eqp();
eqp.ptchpts.id = 20031;
eqp.ptchpts.name = "Patchwork Pants";
eqp.ptchpts.desc =
  "Crude attempt at pants, very baggy looking and somewhat uncomfortable to wear. Potential holes near stitch areas make your lower body shiver when it's windy" +
  dom.dseparator;
eqp.ptchpts.slot = 7;
eqp.ptchpts.str = 12;
eqp.ptchpts.stype = 3;
eqp.ptchpts.aff = [3, 2, 8, 4, 5, 5, 2];
eqp.ptchpts.cls = [3, 5, 5];
eqp.ptchpts.dp = eqp.ptchpts.dpmax = 38;

sld.bkl = new Eqp();
sld.bkl.id = 30001;
sld.bkl.name = "Buckler";
sld.bkl.desc =
  "Tiny shield that is supposed to be strapped onto an arm. Low defence, but provides high mobility" +
  dom.dseparator;
sld.bkl.slot = 2;
sld.bkl.str = 5;
sld.bkl.aff = [2, 2, 2, 2, 2, 2, 2];
sld.bkl.cls = [2, 2, 2];
sld.bkl.stype = 3;
sld.bkl.dp = sld.bkl.dpmax = 36;

sld.tge = new Eqp();
sld.tge.id = 30002;
sld.tge.name = "Targe";
sld.tge.desc = "Simple square shield with reinforced corners" + dom.dseparator;
sld.tge.slot = 2;
sld.tge.str = 9;
sld.tge.aff = [4, 3, 3, 3, 3, 3, 3];
sld.tge.cls = [3, 3, 4];
sld.tge.stype = 3;
sld.tge.dp = sld.tge.dpmax = 38;

sld.plt = new Eqp();
sld.plt.id = 30003;
sld.plt.name = "Pelta Shield";
sld.plt.desc =
  "Triangular shield composed of several layers of wood banded together, making it a little on the heavy side";
sld.plt.slot = 2;
sld.plt.str = 15;
sld.plt.aff = [8, 6, 5, 4, 5, 3, 3];
sld.plt.cls = [5, 5, 5];
sld.plt.stype = 3;
sld.plt.dp = sld.plt.dpmax = 41;

sld.qad = new Eqp();
sld.qad.id = 30004;
sld.qad.name = "Quad Shield";
sld.qad.desc = "";
sld.qad.slot = 2;
sld.qad.str = 0;
sld.qad.stype = 3;

sld.crc = new Eqp();
sld.crc.id = 30005;
sld.crc.name = "Circle Shield";
sld.crc.desc = "";
sld.crc.slot = 2;
sld.crc.str = 0;
sld.crc.stype = 3;

sld.rnd = new Eqp();
sld.rnd.id = 30006;
sld.rnd.name = "Round Shield";
sld.rnd.desc = "";
sld.rnd.slot = 2;
sld.rnd.str = 0;
sld.rnd.stype = 3;

sld.twr = new Eqp();
sld.twr.id = 30007;
sld.twr.name = "Tower Shield";
sld.twr.desc = "";
sld.twr.slot = 2;
sld.twr.str = 0;
sld.twr.stype = 3;

sld.spk = new Eqp();
sld.spk.id = 30008;
sld.spk.name = "Spiked Shield";
sld.spk.desc = "";
sld.spk.slot = 2;
sld.spk.str = 0;
sld.spk.stype = 3;

sld.kit = new Eqp();
sld.kit.id = 30009;
sld.kit.name = "Kite Shield";
sld.kit.desc = "";
sld.kit.slot = 2;
sld.kit.str = 0;
sld.kit.stype = 3;

sld.kit = new Eqp();
sld.kit.id = 30010;
sld.kit.name = "Casserole Shield";
sld.kit.desc = "";
sld.kit.slot = 2;
sld.kit.str = 0;
sld.kit.stype = 3;

sld.htr = new Eqp();
sld.htr.id = 30011;
sld.htr.name = "Heater Shield";
sld.htr.desc = "";
sld.htr.slot = 2;
sld.htr.str = 0;
sld.htr.stype = 3;

sld.ovl = new Eqp();
sld.ovl.id = 30012;
sld.ovl.name = "Oval Shield";
sld.ovl.desc = "";
sld.ovl.slot = 2;
sld.ovl.str = 0;
sld.ovl.stype = 3;

sld.knt = new Eqp();
sld.knt.id = 30013;
sld.knt.name = "Knight Shield";
sld.knt.desc = "";
sld.knt.rar = 4;
sld.knt.slot = 2;
sld.knt.str = 0;
sld.knt.stype = 3;

sld.hpt = new Eqp();
sld.hpt.id = 30014;
sld.hpt.name = "Hoplite Shield";
sld.hpt.desc = "";
sld.hpt.rar = 4;
sld.hpt.slot = 2;
sld.hpt.str = 0;
sld.hpt.stype = 3;

sld.jrt = new Eqp();
sld.jrt.id = 30015;
sld.jrt.name = "Jazeraint Shield";
sld.jrt.desc = "";
sld.jrt.rar = 4;
sld.jrt.slot = 2;
sld.jrt.str = 0;
sld.jrt.stype = 3;

sld.drd = new Eqp();
sld.drd.id = 30016;
sld.drd.name = "Dread Shield";
sld.drd.desc = "";
sld.drd.rar = 4;
sld.drd.slot = 2;
sld.drd.str = 0;
sld.drd.stype = 3;

sld.stksld = new Eqp();
sld.stksld.id = 30017;
sld.stksld.name = "Stake Shield";
sld.stksld.desc =
  "Not actually a shield, but a row of spiky wood stakes tightly packed together to form a square panel. It's a bit heavy" +
  dom.dseparator +
  '<span style="color:hotpink">Physical ATK +4</span><br>';
sld.stksld.slot = 2;
sld.stksld.str = 7;
sld.stksld.aff = [2, 2, 2, 2, 2, 2, 2];
sld.stksld.cls = [3, 3, 3];
sld.stksld.stype = 3;
sld.stksld.dp = sld.stksld.dpmax = 23;
sld.stksld.oneq = function () {
  you.aff[0] += 4;
};
sld.stksld.onuneq = function () {
  you.aff[0] -= 4;
};

acc.strawp = new Eqp();
acc.strawp.id = 40001;
acc.strawp.name = "Straw Pendant";
acc.strawp.desc =
  "You made this yourself!" +
  dom.dseparator +
  "<span style='color:green'><span style='color:lime'> +50 </span> to max energy<br><span style=\"color: lime\">SPD +1</span></span>";
acc.strawp.slot = 8;
acc.strawp.stype = 3;
//acc.strawp.eff[0]=effect.strawp;
acc.strawp.oneq = function () {
  you.sata += 50;
  you.sat += 50;
  you.spda += 1;
};
acc.strawp.onuneq = function () {
  you.sata -= 50;
  you.sat -= 50;
  you.spda -= 1;
};
acc.strawp.onGet = function () {
  if (acc.fmlim.have) {
    giveRcp(rcp.fmlim2);
    this.onGet = function () {};
  }
};

acc.snch = new Eqp();
acc.snch.id = 40002;
acc.snch.name = "Sun Charm";
acc.snch.desc =
  "Little charm with a piece of power of the Sun imbued into it. It absorbs Sun energy" +
  dom.dseparator +
  "<span style='color:gold'>Raises stats during day</span>";
acc.snch.slot = 8;
acc.snch.stype = 3;
acc.snch.eff[0] = effect.snch;
acc.snch.rar = 2;
acc.snch.oneq = function () {
  if (global.flags.savestate === false)
    msg("You feel closer to the Sun..", "gold");
};

acc.mnch = new Eqp();
acc.mnch.id = 40003;
acc.mnch.name = "Moon Charm";
acc.mnch.desc =
  "Little charm with a piece of power of the Moon imbued into it. It absorbs Moon energy" +
  dom.dseparator +
  "<span style='color:cyan'>Raises stats during night</span>";
acc.mnch.slot = 8;
acc.mnch.stype = 3;
acc.mnch.eff[0] = effect.mnch;
acc.mnch.rar = 2;
acc.mnch.oneq = function () {
  if (global.flags.savestate === false)
    msg("You feel closer to the Moon..", "gold");
};

acc.mstn = new Eqp();
acc.mstn.id = 40004;
acc.mstn.name = "Mana Stone";
acc.mstn.desc = "Gem imbued with raw arcanic power";
acc.mstn.slot = 8;
acc.mstn.stype = 3;
acc.mstn.rar = 2;

acc.bstn = new Eqp();
acc.bstn.id = 40005;
acc.bstn.name = "Blood Stone";
acc.bstn.desc = "Gem imbued with the power of blood";
acc.bstn.slot = 8;
acc.bstn.stype = 3;
acc.bstn.rar = 2;

acc.sstn = new Eqp();
acc.sstn.id = 40006;
acc.sstn.name = "Soul Stone";
acc.sstn.desc = "Gem with a fraction of a soul trapped inside of it";
acc.sstn.slot = 8;
acc.sstn.stype = 3;
acc.sstn.rar = 2;

acc.srng = new Eqp();
acc.srng.id = 40007;
acc.srng.name = "Silver Ring";
acc.srng.desc =
  "Simple ring made of silver. It is used as a base for making enchanted accessories";
acc.srng.slot = 8;
acc.srng.stype = 3;

acc.grng = new Eqp();
acc.grng.id = 40008;
acc.grng.name = "Gold Ring";
acc.grng.desc =
  "Valuable ring made of gold. Has high vanity value and can be improved by setting gems into it";
acc.grng.slot = 8;
acc.grng.stype = 3;

acc.trrng = new Eqp();
acc.trrng.id = 40009;
acc.trrng.name = "Trinity";
acc.trrng.desc =
  "Rings were given to the Knights in ancient times, as a symbol of loyalty. Strenghtens mind and body";
acc.trrng.slot = 8;
acc.trrng.stype = 3;
acc.trrng.rar = 3;

acc.akh = new Eqp();
acc.akh.id = 40010;
acc.akh.name = "Ankh";
acc.akh.desc = "A symbol of life ☥";
acc.akh.slot = 8;
acc.akh.stype = 3;
acc.akh.rar = 3;

acc.gmph1 = new Eqp();
acc.gmph1.id = 40011;
acc.gmph1.name = "Titan Malachite";
acc.gmph1.desc =
  "Malachite with a Titan's soul bound inside. Slightly increases the power of direct attacks";
acc.gmph1.slot = 8;
acc.gmph1.stype = 3;
acc.gmph1.rar = 2;

acc.gmph2 = new Eqp();
acc.gmph2.id = 40012;
acc.gmph2.name = "Talos Feldspar";
acc.gmph2.desc =
  "Feldspar imbued with the dark powers of Talos. Increases the power of direct attacks";
acc.gmph2.slot = 8;
acc.gmph2.stype = 3;
acc.gmph2.rar = 3;

acc.gmai1 = new Eqp();
acc.gmai1.id = 40013;
acc.gmai1.name = "Sylphid Topaz";
acc.gmai1.desc =
  "Topaz imbued with the power of the Sylphs. Slightly increases air affinity";
acc.gmai1.slot = 8;
acc.gmai1.stype = 3;
acc.gmai1.rar = 2;

acc.gmai2 = new Eqp();
acc.gmai2.id = 40014;
acc.gmai2.name = "Djinn Amber";
acc.gmai2.desc =
  "Amber imbued with the power of Sylphs. Increases air affinity";
acc.gmai2.slot = 8;
acc.gmai2.stype = 3;
acc.gmai2.rar = 3;

acc.gmfr1 = new Eqp();
acc.gmfr1.id = 40015;
acc.gmfr1.name = "Salamander Ruby";
acc.gmfr1.desc =
  "Ruby imbued with the power of the Salamanders. Slightly increases fire affinity";
acc.gmfr1.slot = 8;
acc.gmfr1.stype = 3;
acc.gmfr1.rar = 2;

acc.gmfr2 = new Eqp();
acc.gmfr2.id = 40016;
acc.gmfr2.name = "Ifrit Carnelian";
acc.gmfr2.desc =
  "Carnelian imbued with the power of Ifrit. Increases fire affinity";
acc.gmfr2.slot = 8;
acc.gmfr2.stype = 3;
acc.gmfr2.rar = 3;

acc.gmea1 = new Eqp();
acc.gmea1.id = 40017;
acc.gmea1.name = "Gnome Emerald";
acc.gmea1.desc =
  "Emerald imbued with the power of the Gnomes. Slightly increases earth affinity";
acc.gmea1.slot = 8;
acc.gmea1.stype = 3;
acc.gmea1.rar = 2;

acc.gmea2 = new Eqp();
acc.gmea2.id = 40018;
acc.gmea2.name = "Dao Moonstone";
acc.gmea2.desc =
  "Moonstone imbued with the power of Dao. Increases earth affinity";
acc.gmea2.slot = 8;
acc.gmea2.stype = 3;
acc.gmea2.rar = 3;

acc.gmwt1 = new Eqp();
acc.gmwt1.id = 40019;
acc.gmwt1.name = "Undine Jasper";
acc.gmwt1.desc =
  "Jasper imbued with the power of the Undines. Slightly increases water affinity";
acc.gmwt1.slot = 8;
acc.gmwt1.stype = 3;
acc.gmwt1.rar = 2;

acc.gmwt2 = new Eqp();
acc.gmwt2.id = 40020;
acc.gmwt2.name = "Marid Aquamarine";
acc.gmwt2.desc =
  "Aquamarine imbued with the power of Marid. Increases water affinity";
acc.gmwt2.slot = 8;
acc.gmwt2.stype = 3;
acc.gmwt2.rar = 3;

acc.gmhl1 = new Eqp();
acc.gmhl1.id = 40021;
acc.gmhl1.name = "Angel Pearl";
acc.gmhl1.desc =
  "Pearl imbued with the power of the angels. Slightly increases light affinity";
acc.gmhl1.slot = 8;
acc.gmhl1.stype = 3;
acc.gmhl1.rar = 2;

acc.gmhl2 = new Eqp();
acc.gmhl2.id = 40022;
acc.gmhl2.name = "Seraphim Diamond";
acc.gmhl2.desc =
  "Diamond with a seraph's soul bound inside. Increases light affinity";
acc.gmhl2.slot = 8;
acc.gmhl2.stype = 3;
acc.gmhl2.rar = 3;

acc.gmdk1 = new Eqp();
acc.gmdk1.id = 40023;
acc.gmdk1.name = "Morlock Jet";
acc.gmdk1.desc =
  "Jet stone sealed with Morlock's magical power. Slightly increases dark affinity";
acc.gmdk1.slot = 8;
acc.gmdk1.stype = 3;
acc.gmdk1.rar = 2;

acc.gmdk2 = new Eqp();
acc.gmdk2.id = 40024;
acc.gmdk2.name = "Berial Blackpearl";
acc.gmdk2.desc =
  "Blackpearl with Berial's soul bound inside. Increases dark affinity";
acc.gmdk2.slot = 8;
acc.gmdk2.stype = 3;
acc.gmdk2.rar = 3;

acc.wfng = new Eqp();
acc.wfng.id = 40025;
acc.wfng.name = "Wolf Fang Necklace";
acc.wfng.desc =
  "Menacing fang of the wolf, in the form of a pendant. Wearing this can help to repell and scare away minor beasts" +
  dom.dseparator +
  '<span style="color:orange">Beast Class DEF +15</span>';
acc.wfng.slot = 8;
acc.wfng.stype = 3;
acc.wfng.oneq = function () {
  you.cmaff[1] += 15;
};
acc.wfng.onuneq = function () {
  you.cmaff[1] -= 15;
};
acc.wfng.onGet = function () {
  if (!rcp.wfar.have) {
    let f = 0;
    for (const a in inv) if (inv[a].id === this.id) f++;
    if (f >= 3) giveRcp(rcp.wfar);
  }
};

acc.wfar = new Eqp();
acc.wfar.id = 40026;
acc.wfar.name = "Wolf Array";
acc.wfar.desc =
  "Array composed of interlinked fangs of the wolf. Used by hunters as a mean of protection agains wildlife" +
  dom.dseparator +
  '<span style="color:orange">Beast Class DEF +30</span>';
acc.wfar.slot = 8;
acc.wfar.stype = 3;
acc.wfar.rar = 2;
acc.wfar.oneq = function () {
  you.cmaff[1] += 30;
};
acc.wfar.onuneq = function () {
  you.cmaff[1] -= 30;
};

acc.sshl = new Eqp();
acc.sshl.id = 40027;
acc.sshl.name = "Star Shell";
acc.sshl.desc =
  "A little shell with a fraction of power of Space within it. It radiates incomprehencible energy when you touch it" +
  dom.dseparator +
  "<span style='color:gold'>Raises stats+";
acc.sshl.slot = 8;
acc.sshl.stype = 3;
acc.sshl.rar = 2;
acc.sshl.oneq = function () {};
acc.sshl.onuneq = function () {};

acc.qill = new Eqp();
acc.qill.id = 40028;
acc.qill.name = "Quill";
acc.qill.desc =
  "Feather of a large bird, turned into a writing tool " +
  dom.dseparator +
  '<span style="color:lime">AGL +5</span>';
acc.qill.slot = 8;
acc.qill.stype = 3;
acc.qill.oneq = function () {
  you.agla += 5;
};
acc.qill.onuneq = function () {
  you.agla -= 5;
};
acc.qill.onGet = function () {
  if (acc.bink.have) {
    giveRcp(rcp.mink);
    this.onGet = function () {};
  }
};

acc.bink = new Eqp();
acc.bink.id = 40029;
acc.bink.name = "Black Ink";
acc.bink.desc =
  "Pitch black Ink, useful in writing. Stains left by it will never come off" +
  dom.dseparator +
  '<span style="color:lime">INT +3</span>';
acc.bink.slot = 8;
acc.bink.stype = 3;
acc.bink.oneq = function () {
  you.inta += 3;
};
acc.bink.onuneq = function () {
  you.inta -= 3;
};
acc.bink.onGet = function () {
  if (acc.qill.have) {
    giveRcp(rcp.mink);
    this.onGet = function () {};
  }
};

acc.mink = new Eqp();
acc.mink.id = 40030;
acc.mink.name = "Magic Ink";
acc.mink.desc =
  "Glowing magic ink, used for writing magical and runic inscriptions. " +
  dom.dseparator +
  '<span style="color:lime">INT +8</span><br><span style="color:lime">AGL +10</span>';
acc.mink.slot = 8;
acc.mink.stype = 3;
acc.mink.rar = 2;
acc.mink.oneq = function () {
  you.inta += 8;
  you.agla += 10;
};
acc.mink.onuneq = function () {
  you.inta -= 8;
  you.agla -= 10;
};

acc.rfot = new Eqp();
acc.rfot.id = 40031;
acc.rfot.name = "Rabbit Foot";
acc.rfot.desc =
  "Lucky charm made from a foot of a rabbit. Wearing this gives you a strange feeling of satisfaction" +
  dom.dseparator +
  '<span style="color:gold">LUCK +2</span>';
acc.rfot.slot = 8;
acc.rfot.stype = 3;
acc.rfot.rar = 2;
acc.rfot.oneq = function () {
  you.luck += 2;
};
acc.rfot.onuneq = function () {
  you.luck -= 2;
};

acc.sdl1 = new Eqp();
acc.sdl1.id = 40032;
acc.sdl1.name = "Straw Effigy";
acc.sdl1.desc =
  "Small handcrafted straw doll. Dolls of this type are used to bind with the souls of the living. Appropriate for Curses and Dark Magic manipulation" +
  dom.dseparator +
  '<span style="color:hotpink">Physical DEF +5</span>';
acc.sdl1.slot = 8;
acc.sdl1.stype = 3;
acc.sdl1.oneq = function () {
  you.caff[0] += 5;
};
acc.sdl1.onuneq = function () {
  you.caff[0] -= 5;
};
acc.sdl1.onGet = function () {
  if (acc.bdl1.have && acc.wdl1.have) {
    giveRcp(rcp.gdl1);
    this.onGet = function () {};
  }
};

acc.lckcn = new Eqp();
acc.lckcn.id = 40033;
acc.lckcn.name = "Lucky Coin";
acc.lckcn.desc =
  "Special little coin, unlike any other. You have a feeling you should hold onto it" +
  dom.dseparator +
  '<span style="color:gold">LUCK +3</span>';
acc.lckcn.slot = 8;
acc.lckcn.stype = 3;
acc.lckcn.oneq = function () {
  you.luck += 3;
};
acc.lckcn.onuneq = function () {
  you.luck -= 3;
};
acc.lckcn.onGet = function () {
  if (acc.cfgn.have) {
    giveRcp(rcp.mnknk);
    this.onGet = function () {};
  }
};

acc.cfgn = new Eqp();
acc.cfgn.id = 40034;
acc.cfgn.name = "Cat Figurine";
acc.cfgn.desc =
  "Small figurine of a cat. It eminates powerful energy" +
  dom.dseparator +
  '<span style="color:deeppink">Energy Effectiveness +5%</span>';
acc.cfgn.slot = 8;
acc.cfgn.stype = 3;
acc.cfgn.oneq = function () {
  you.mods.sbonus += 0.05;
};
acc.cfgn.onuneq = function () {
  you.mods.sbonus -= 0.05;
};
acc.cfgn.onGet = function () {
  if (acc.lckcn.have) {
    giveRcp(rcp.mnknk);
    this.onGet = function () {};
  }
};

acc.mnknk = new Eqp();
acc.mnknk.id = 40035;
acc.mnknk.name = "Maneki-Neko";
acc.mnknk.desc =
  "Little statue of a Divine Cat holding a Coin. This treasure is rumored to bring luck and prosperity to its owner" +
  dom.dseparator +
  '<span style="color:gold">LUCK +4</span><br><span style="color:deeppink">Energy Effectiveness +10%</span>';
acc.mnknk.slot = 8;
acc.mnknk.stype = 3;
acc.mnknk.rar = 2;
acc.mnknk.oneq = function () {
  you.luck += 4;
  you.mods.sbonus += 0.1;
};
acc.mnknk.onuneq = function () {
  you.luck -= 4;
  you.mods.sbonus -= 0.1;
};

acc.wdl1 = new Eqp();
acc.wdl1.id = 40036;
acc.wdl1.name = "Wood Effigy";
acc.wdl1.desc =
  "Small wooden doll with flexible joints. This type can be used, with Dark enchantment, to take control of living things." +
  dom.dseparator +
  '<span style="color:crimson">Piercing DEF +5</span><br><span style="color:crimson">Edged DEF +5</span><br><span style="color:crimson">Blunt DEF +5</span>';
acc.wdl1.ccls = [5, 5, 5];
acc.wdl1.slot = 8;
acc.wdl1.stype = 3;
acc.wdl1.oneq = function () {
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] += this.ccls[afn];
};
acc.wdl1.onuneq = function () {
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] -= this.ccls[afn];
};
acc.wdl1.onGet = function () {
  if (acc.sdl1.have && acc.bdl1.have) {
    giveRcp(rcp.gdl1);
    this.onGet = function () {};
  }
};

acc.gdl1 = new Eqp();
acc.gdl1.id = 40037;
acc.gdl1.name = "Soul Puppet";
acc.gdl1.desc =
  "Dolls that could be remotely controlled by one's soul. Employed by spies to infiltrate enemy lines unnoticed" +
  dom.dseparator +
  '<span style="color:crimson">Piercing DEF +4</span><br><span style="color:crimson">Edged DEF +4</span><br><span style="color:crimson">Blunt DEF +4</span><br><span style="color:thistle;text-shadow:blueviolet 0px 0px 5px">Dark RES +6</span><br><span style="color:royalblue;text-shadow:blueviolet 0px 0px 5px">Evil Class DEF +2</span><br><span style="color:hotpink">Physical DEF +3</span>';
acc.gdl1.ccls = [4, 4, 4];
acc.gdl1.slot = 8;
acc.gdl1.stype = 3;
acc.gdl1.rar = 2;
acc.gdl1.oneq = function () {
  you.caff[0] += 3;
  you.caff[6] += 2;
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] += this.ccls[afn];
  you.cmaff[3] += 6;
};
acc.gdl1.onuneq = function () {
  you.caff[0] -= 3;
  you.caff[6] -= 2;
  for (let afn = 0; afn < this.ccls.length; afn++)
    you.ccls[afn] -= this.ccls[afn];
  you.cmaff[3] -= 6;
};

acc.rnsn = new Eqp();
acc.rnsn.id = 40038;
acc.rnsn.name = "Rain Stone";
acc.rnsn.desc =
  "This stone, eroded by years of rain, can actually mimic rain to fool plants and animals. For this reason, it's in high demand for horticultural use" +
  dom.dseparator +
  "";
acc.rnsn.slot = 8;
acc.rnsn.stype = 3;

acc.hndm = new Eqp();
acc.hndm.id = 40039;
acc.hndm.name = "Fey Hound Mane";
acc.hndm.desc =
  "A tuft of a fey hound's mane, said to ward off evil. It raises resistance to heat and cold" +
  dom.dseparator +
  "";
acc.hndm.slot = 8;
acc.hndm.stype = 3;

acc.dcpe = new Eqp();
acc.dcpe.id = 40040;
acc.dcpe.name = "Deception Eye";
acc.dcpe.desc =
  "A mysterious gem. It feels like it's looking at something, but you can't really tell" +
  dom.dseparator +
  "";
acc.dcpe.slot = 8;
acc.dcpe.stype = 3;

acc.bdl1 = new Eqp();
acc.bdl1.id = 40041;
acc.bdl1.name = "Bone Doll";
acc.bdl1.desc =
  "A small doll carved from beast bone. It's a charm that protects the wearer from evil" +
  dom.dseparator +
  '<span style="color:thistle;text-shadow:blueviolet 0px 0px 5px">Dark RES +5</span><br><span style="color:royalblue;text-shadow:blueviolet 0px 0px 5px">Evil Class DEF +5</span>';
acc.bdl1.slot = 8;
acc.bdl1.stype = 3;
acc.bdl1.oneq = function () {
  you.caff[6] += 5;
  you.cmaff[3] += 5;
};
acc.bdl1.onuneq = function () {
  you.caff[6] -= 5;
  you.cmaff[3] -= 5;
};
acc.bdl1.onGet = function () {
  if (acc.sdl1.have && acc.wdl1.have) {
    giveRcp(rcp.gdl1);
    this.onGet = function () {};
  }
};

acc.fssn = new Eqp();
acc.fssn.id = 40042;
acc.fssn.name = "Bonefish Spine";
acc.fssn.desc =
  "A spine taken from a bonefish, which are still keen in undeath. It's said to raise spiritual awareness of the holder" +
  dom.dseparator +
  "";
acc.fssn.slot = 8;
acc.fssn.stype = 3;

acc.mpst = new Eqp();
acc.mpst.id = 40043;
acc.mpst.name = "Mortar and Pestle";
acc.mpst.desc =
  "A basic stone bowl and a pounder used to mince and crush herbs, seeds, bones and other pharmaceutical oddities" +
  dom.dseparator +
  '<span style="color:deeppink">Alchemy EXP gain +5%</span><br><br><small style="color:deeppink">Alchemy quality:<span style="color:orange"> 1</span></small>';
acc.mpst.slot = 8;
acc.mpst.alchq = 1;
acc.mpst.stype = 3;
acc.mpst.oneq = function () {
  skl.alch.p += 0.05;
};
acc.mpst.onuneq = function () {
  skl.alch.p -= 0.05;
};
acc.mpst.onGet = function () {
  if (acc.mpst.have && acc.mshst.have && acc.mhhst) {
    giveRcp(rcp.alseto);
    this.onGet = function () {};
  }
};

acc.vtmns = new Eqp();
acc.vtmns.id = 40044;
acc.vtmns.name = "Vitamins";
acc.vtmns.desc =
  "A bottle of powerful vitamins, which grant one's body incresed vitality" +
  dom.dseparator +
  '<span style="color:limegreen">Poison resist +5%</span>';
acc.vtmns.slot = 8;
acc.vtmns.stype = 3;
acc.vtmns.oneq = function () {
  you.res.poison -= 0.05;
};
acc.vtmns.onuneq = function () {
  you.res.poison += 0.05;
};
acc.vtmns.onGet = function () {
  if (acc.mdcag.have && acc.vtmns.have) {
    giveRcp(rcp.mdcbg);
    this.onGet = function () {};
  }
};

acc.mdcag = new Eqp();
acc.mdcag.id = 40045;
acc.mdcag.name = "Adhesive Bandage";
acc.mdcag.desc =
  "Bandage, boiled in hot water and sterilized using herbs" +
  dom.dseparator +
  '<span style="color:chartreuse">Bleed resist +5%</span>';
acc.mdcag.slot = 8;
acc.mdcag.stype = 3;
acc.mdcag.oneq = function () {
  you.res.bleed -= 0.05;
};
acc.mdcag.onuneq = function () {
  you.res.bleed += 0.05;
};
acc.mdcag.onGet = function () {
  if (acc.mdcag.have && acc.vtmns.have) {
    giveRcp(rcp.mdcbg);
    this.onGet = function () {};
  }
};

acc.mdcbg = new Eqp();
acc.mdcbg.id = 40046;
acc.mdcbg.name = "Medicated Bandage";
acc.mdcbg.desc =
  "Sterile bandage soaked in strong medical solution" +
  dom.dseparator +
  '<span style="color:chartreuse">Bleed resist +8%</span><br><span style="color:limegreen">Poison resist +8%</span>';
acc.mdcbg.slot = 8;
acc.mdcbg.stype = 3;
acc.mdcbg.rar = 2;
acc.mdcbg.oneq = function () {
  you.res.bleed -= 0.08;
  you.res.poison -= 0.08;
};
acc.mdcbg.onuneq = function () {
  you.res.bleed += 0.08;
  you.res.poison += 0.08;
};

acc.mshst = new Eqp();
acc.mshst.id = 40047; //🝪
acc.mshst.name = "Retort";
acc.mshst.desc =
  "Alchemical vessel used for distilling, important for vapor separation" +
  dom.dseparator +
  '<span style="color:deeppink">Alchemy EXP gain +10%</span><br><br><small style="color:deeppink">Alchemy quality:<span style="color:orange"> 1</span></small>';
acc.mshst.slot = 8;
acc.mshst.alchq = 1;
acc.mshst.stype = 3;
acc.mshst.oneq = function () {
  skl.alch.p += 0.1;
};
acc.mshst.onuneq = function () {
  skl.alch.p -= 0.1;
};
acc.mshst.onGet = function () {
  if (acc.mpst.have && acc.mshst.have && acc.mhhst) {
    giveRcp(rcp.alseto);
    this.onGet = function () {};
  }
};

acc.mhhst = new Eqp();
acc.mhhst.id = 40048;
acc.mhhst.name = "Alembic";
acc.mhhst.desc =
  "Alchemical vessel used in distilling, especially useful for cooling" +
  dom.dseparator +
  '<span style="color:deeppink">Alchemy EXP gain +15%</span><br><br><small style="color:deeppink">Alchemy quality:<span style="color:orange"> 1</span></small>';
acc.mhhst.slot = 8;
acc.mhhst.alchq = 1;
acc.mhhst.stype = 3;
acc.mhhst.oneq = function () {
  skl.alch.p += 0.15;
};
acc.mhhst.onuneq = function () {
  skl.alch.p -= 0.15;
};
acc.mhhst.onGet = function () {
  if (acc.mpst.have && acc.mshst.have && acc.mhhst) {
    giveRcp(rcp.alseto);
    this.onGet = function () {};
  }
};

acc.asfk = new Eqp();
acc.asfk.id = 40049;
acc.asfk.name = "Alchemical Flask";
acc.asfk.desc =
  "A sealed flask with some vicious limegreen bubbling liquid moving inside. Opening this thing is a very bad idea" +
  dom.dseparator +
  '<span style="color:chartreuse">Damage reduction +3%</span>';
acc.asfk.slot = 8;
acc.asfk.stype = 3;
acc.asfk.oneq = function () {
  you.res.ph -= 0.03;
};
acc.asfk.onuneq = function () {
  you.res.ph += 0.03;
};

acc.alseto = new Eqp();
acc.alseto.id = 40050;
acc.alseto.name = "Basic Alchemy Set";
acc.alseto.desc =
  "Wide variety of aberrant glassware and precision tools for all types of entry level alchemy-based manipulations. A necessity for making basic medicine, pills, poisons, elixirs and everything inbetween" +
  dom.dseparator +
  '<span style="color:deeppink">Alchemy EXP gain +50%</span><br><br><small style="color:deeppink">Alchemy quality:<span style="color:orange"> 2</span></small><br><br>';
acc.alseto.slot = 8;
acc.alseto.alchq = 2;
acc.alseto.stype = 3;
acc.alseto.int = 15;
acc.alseto.rar = 2;
acc.alseto.oneq = function () {
  skl.alch.p += 0.5;
};
acc.alseto.onuneq = function () {
  skl.alch.p -= 0.5;
};

acc.csfk = new Eqp();
acc.csfk.id = 40051;
acc.csfk.name = "Corrupt Flask";
acc.csfk.desc =
  "Glass container with an evil essence trapped inside of it. It is trying to break free" +
  dom.dseparator +
  '<span style="color:thistle;text-shadow:blueviolet 0px 0px 5px">Dark RES +10</span>';
acc.csfk.slot = 8;
acc.csfk.stype = 3;
acc.csfk.oneq = function () {
  you.caff[6] += 10;
};
acc.csfk.onuneq = function () {
  you.caff[6] -= 10;
};

acc.gsfk = new Eqp();
acc.gsfk.id = 40052;
acc.gsfk.name = "Plague Flask";
acc.gsfk.desc =
  "Locked vessel containing a volatile tissue sample from the plague beast. Should be handled with extreme care and must not be unsealed under any circumstances" +
  dom.dseparator +
  '<span style="color:chartreuse">Damage reduction +4%</span><br><span style="color:thistle;text-shadow:blueviolet 0px 0px 5px">Dark RES +35</span>';
acc.gsfk.slot = 8;
acc.gsfk.stype = 3;
acc.gsfk.rar = 2;
acc.gsfk.oneq = function () {
  you.res.ph -= 0.04;
  you.caff[6] += 35;
};
acc.gsfk.onuneq = function () {
  you.res.ph += 0.04;
  you.caff[6] -= 35;
};

acc.jln1 = new Eqp();
acc.jln1.id = 40053;
acc.jln1.name = "Life Jelly";
acc.jln1.desc =
  "Concentrated red jelly. Improves life force" +
  dom.dseparator +
  '<span style="color:chartreuse">MAX HP +400</span>';
acc.jln1.slot = 8;
acc.jln1.stype = 3;
acc.jln1.oneq = function () {
  you.hpa += 400;
};
acc.jln1.onuneq = function () {
  you.hpa -= 400;
};

acc.jln2 = new Eqp();
acc.jln2.id = 40054;
acc.jln2.name = "Stamina Jelly";
acc.jln2.desc =
  "Concentrated green jelly. Improves stamina" +
  dom.dseparator +
  '<span style="color:chartreuse">MAX SAT +100</span>';
acc.jln2.slot = 8;
acc.jln2.stype = 3;
acc.jln2.oneq = function () {
  you.sat += 100;
  you.sata += 100;
};
acc.jln2.onuneq = function () {
  you.sat -= 100;
  you.sata -= 100;
};

acc.jln3 = new Eqp();
acc.jln3.id = 40055;
acc.jln3.name = "Vital Jelly";
acc.jln3.desc =
  "Concentrated blue jelly. Improves metabolism" +
  dom.dseparator +
  '<span style="color:chartreuse">SPD +2</span><br><span style="color:crimson">Energy Consumtion +0.2\/s</span>';
acc.jln3.slot = 8;
acc.jln3.stype = 3;
acc.jln3.oneq = function () {
  you.spda += 2;
  you.mods.sdrate += 0.2;
};
acc.jln3.onuneq = function () {
  you.spda -= 2;
  you.mods.sdrate -= 0.2;
};

acc.jln4 = new Eqp();
acc.jln4.id = 40056;
acc.jln4.name = "Grand Gelatin";
acc.jln4.desc = "proc";
acc.jln4.slot = 8;
acc.jln4.stype = 3;
acc.jln4.rar = 2;
acc.jln4.oneq = function () {
  you.spda += 2;
  you.mods.sdrate += 0.2;
};
acc.jln4.onuneq = function () {
  you.spda -= 2;
  you.mods.sdrate -= 0.2;
};

acc.mstone = new Eqp();
acc.mstone.id = 40057;
acc.mstone.name = "Moon Stone";
acc.mstone.desc = "proc";
acc.mstone.slot = 8;
acc.mstone.stype = 3;

acc.sstone = new Eqp();
acc.sstone.id = 40058;
acc.sstone.name = "Sun Stone";
acc.sstone.desc = "proc";
acc.sstone.slot = 8;
acc.sstone.stype = 3;

acc.cstone = new Eqp();
acc.cstone.id = 40059;
acc.cstone.name = "Celestial Stone";
acc.cstone.desc = "proc";
acc.cstone.slot = 8;
acc.cstone.stype = 3;
acc.cstone.rar = 2;

acc.coring = new Eqp();
acc.coring.id = 40060;
acc.coring.name = "Coin Ring";
acc.coring.desc =
  "Golden ring whith runic engraving of a coin on it. Rumored to attract wealth " +
  dom.dseparator +
  '<span style="color:orange">Defeated enemies occasionally drop money</span>';
acc.coring.slot = 8;
acc.coring.stype = 3;
acc.coring.rar = 2;
acc.coring.oneq = function () {
  you.mods.enmondren += 0.01;
};
acc.coring.onuneq = function () {
  you.mods.enmondren -= 0.01;
};

acc.dticket = new Eqp();
acc.dticket.id = 40061;
acc.dticket.name = "Discount Ticket";
acc.dticket.desc =
  "Small ticket that allows you to buy things for cheaper, if you show it to the shopkeeper. Sometimes given to random customers for promotional purposes " +
  dom.dseparator +
  '<span style="color:thistle">Shop price reduction -1%</span>';
acc.dticket.slot = 8;
acc.dticket.stype = 3;
acc.dticket.onGet = function () {
  let b = 0;
  for (const a in inv) if (inv[a].id === this.id) b++;
  if (b >= 5) giveRcp(rcp.dcard1);
};
acc.dticket.oneq = function () {
  you.mods.infsrate -= 0.01;
  recshop();
};
acc.dticket.onuneq = function () {
  you.mods.infsrate += 0.01;
  recshop();
};

acc.dcard1 = new Eqp();
acc.dcard1.id = 40062;
acc.dcard1.name = "Discount Card";
acc.dcard1.desc =
  "A card given to the most loyal customers in popular shops" +
  dom.dseparator +
  '<span style="color:thistle">Shop price reduction -5%</span>';
acc.dcard1.slot = 8;
acc.dcard1.stype = 3;
acc.dcard1.rar = 2;
acc.dcard1.oneq = function () {
  you.mods.infsrate -= 0.05;
  recshop();
};
acc.dcard1.onuneq = function () {
  you.mods.infsrate += 0.05;
  recshop();
};

acc.rgreed = new Eqp();
acc.rgreed.id = 40063;
acc.rgreed.name = "Ring of Greed";
acc.rgreed.desc =
  "Expensive ring employed by rich merchants and gamblers. Makes you seem like a symbol of authority, brings tremendous luck and helps during negotiations" +
  dom.dseparator +
  '<span style="color:orange">Defeated enemies sometimes drop money</span><br><span style="color:gold">+15% dropped money</span><br><span style="color:thistle">Shop price reduction -10%</span>';
acc.rgreed.slot = 8;
acc.rgreed.stype = 3;
acc.rgreed.rar = 3;
acc.rgreed.oneq = function () {
  you.mods.infsrate -= 0.1;
  you.mods.enmondren += 0.03;
  recshop();
};
acc.rgreed.onuneq = function () {
  you.mods.infsrate += 0.1;
  you.mods.enmondren -= 0.03;
  recshop();
};

acc.medl1 = new Eqp();
acc.medl1.id = 40064;
acc.medl1.name = "Moon Medal";
acc.medl1.desc = "proc";
acc.medl1.slot = 8;
acc.medl1.stype = 3;

acc.medl2 = new Eqp();
acc.medl2.id = 40065;
acc.medl2.name = "Little Light Medal";
acc.medl2.desc = "proc";
acc.medl2.slot = 8;
acc.medl2.stype = 3;

acc.medl3 = new Eqp();
acc.medl3.id = 40066;
acc.medl3.name = "Moonlight Medal";
acc.medl3.desc = "proc";
acc.medl3.slot = 8;
acc.medl3.stype = 3;
acc.medl3.rar = 2;

acc.medl4 = new Eqp();
acc.medl4.id = 40067;
acc.medl4.name = "White Boar Medal";
acc.medl4.desc = "proc";
acc.medl4.slot = 8;
acc.medl4.stype = 3;

acc.medl5 = new Eqp();
acc.medl5.id = 40068;
acc.medl5.name = "Jade Skin Medal";
acc.medl5.desc = "proc";
acc.medl5.slot = 8;
acc.medl5.stype = 3;

acc.medl6 = new Eqp();
acc.medl6.id = 40069;
acc.medl6.name = "White Jade Medal";
acc.medl6.desc = "proc";
acc.medl6.slot = 8;
acc.medl6.stype = 3;
acc.medl6.rar = 2;

acc.coindct = new Eqp();
acc.coindct.id = 40070;
acc.coindct.name = "Coin of Deceit";
acc.coindct.desc =
  "Crooked tainted coin with seemingly evil aura floating about it" +
  dom.dseparator +
  '<span style="color:royalblue">Crit Chance +3%</span>';
acc.coindct.slot = 8;
acc.coindct.stype = 3;
acc.coindct.oneq = function () {
  you.mods.crflt += 0.03;
};
acc.coindct.onuneq = function () {
  you.mods.crflt -= 0.03;
};

acc.slchth = new Eqp();
acc.slchth.id = 40071;
acc.slchth.name = "Silencing Sheath";
acc.slchth.desc =
  "Light conciealed sheath for storing small knives and other assassin tools. Unconspicous and easy to use, it is favoured by the agents of the Underworld" +
  dom.dseparator +
  '<span style="color:mediumpurple">Crit Damage +15%</span>';
acc.slchth.slot = 8;
acc.slchth.stype = 3;
acc.slchth.oneq = function () {
  you.mods.cpwr += 0.15;
};
acc.slchth.onuneq = function () {
  you.mods.cpwr -= 0.15;
};

acc.rmedlon = new Eqp();
acc.rmedlon.id = 40072;
acc.rmedlon.name = "Ruin Medallion";
acc.rmedlon.desc =
  "Evil Medallion imbued with the curse of misforture. Brings terrible luck to everyone around its bearer" +
  dom.dseparator +
  '<span style="color:royalblue">Crit Chance +6%</span>';
acc.rmedlon.slot = 8;
acc.rmedlon.stype = 3;
acc.rmedlon.rar = 2;
acc.rmedlon.oneq = function () {
  you.mods.crflt += 0.06;
};
acc.rmedlon.onuneq = function () {
  you.mods.crflt -= 0.06;
};

acc.mirgmirr = new Eqp();
acc.mirgmirr.id = 40073;
acc.mirgmirr.name = "Mirage Mirror";
acc.mirgmirr.desc =
  "Mirror of clouded darkness. It bends light around you." +
  dom.dseparator +
  '<span style="color:royalblue">Reduces enemy aggression<br>Auto Dodge +10%</span>';
acc.mirgmirr.slot = 8;
acc.mirgmirr.stype = 3;
acc.mirgmirr.oneq = function () {
  you.mods.ddgmod += 0.1;
};
acc.mirgmirr.onuneq = function () {
  you.mods.ddgmod -= 0.1;
};

acc.aihomnt = new Eqp();
acc.aihomnt.id = 40074;
acc.aihomnt.name = "Airia Hair Ornament";
acc.aihomnt.desc =
  "An ornament made of light magic ore. Wraps the wearer with a thin magic barrier" +
  dom.dseparator +
  '<span style="color:royalblue">Reduces enemy aggression<br>Magic DEF +15</span>';
acc.aihomnt.slot = 8;
acc.aihomnt.stype = 3;
acc.aihomnt.oneq = function () {};
acc.aihomnt.onuneq = function () {};

acc.gourd1 = new Eqp();
acc.gourd1.id = 40075;
acc.gourd1.name = "Gourd";
acc.gourd1.desc =
  "One of the oldest crop plants in existence. You can use it to store water... or sake" +
  dom.dseparator +
  '<span style="color:chartreuse">Max SAT +150</span>';
acc.gourd1.slot = 8;
acc.gourd1.stype = 3;
acc.gourd1.oneq = function () {
  you.sat += 150;
  you.sata += 150;
};
acc.gourd1.onuneq = function () {
  you.sat -= 150;
  you.sata -= 150;
};

acc.stupa = new Eqp();
acc.stupa.id = 40076;
acc.stupa.name = "Stupa";
acc.stupa.desc =
  "Stupa are long boards placed next to graves to pay respects to the dead. They are usually to be written with an ink brush" +
  dom.dseparator +
  '<span style="color:ghostwhite;text-shadow:0px 0px 5px royalblue">Keeps your soul in the mortal world</span><br><span style="color:ghostwhite;text-shadow:0px 0px 5px royalblue">+2% Chance To Avoid Death</span>';
acc.stupa.slot = 8;
acc.stupa.stype = 3;
acc.stupa.oneq = function () {
  you.res.death -= 0.02;
};
acc.stupa.onuneq = function () {
  you.res.death += 0.02;
};

acc.wpeny = new Eqp();
acc.wpeny.id = 40077;
acc.wpeny.name = "Penny of Wealth";
acc.wpeny.desc =
  "An extra shiny penny, that looks like it's made of gold. It probably isn't, but you feel richer just by holding it" +
  dom.dseparator +
  '<span style="color:orange">Picking a coin gives you an extra coin<br><span style="color:gold">Greed EXP gain +20%</span></span>';
acc.wpeny.slot = 8;
acc.wpeny.stype = 3;
acc.wpeny.oneq = function () {
  skl.gred.p += 0.2;
  you.mods.wthexrt++;
};
acc.wpeny.onuneq = function () {
  skl.gred.p -= 0.2;
  you.mods.wthexrt--;
};

acc.rngsgn = new Eqp();
acc.rngsgn.id = 40078;
acc.rngsgn.name = "Signet Ring";
acc.rngsgn.desc =
  "A gold and silver ring with a wide stamp attached to the band. A long time ago, the stamp was legible, but now the pattern is too worn to discern its former use";
acc.rngsgn.slot = 8;
acc.rngsgn.stype = 3;

acc.fmlim = new Eqp();
acc.fmlim.id = 40079;
acc.fmlim.important = true;
acc.fmlim.name = "Family Heirloom";
acc.fmlim.desc =
  "A treasure passed down in your family. This plain looking medalion doesn't look anything special, it appears incomplete with an empty socket in the center. You fail to see any value in this piece of junk" +
  dom.dseparator +
  '<span style="color:chartreuse">MAX HP +2</span>';
acc.fmlim.slot = 8;
acc.fmlim.stype = 3;
acc.fmlim.oneq = function () {
  you.hpa += 2;
};
acc.fmlim.onuneq = function () {
  you.hpa -= 2;
};
acc.fmlim.onGet = function () {
  if (acc.strawp.have) {
    giveRcp(rcp.fmlim2);
    this.onGet = function () {};
  }
};

acc.pbrs = new Eqp();
acc.pbrs.id = 40080;
acc.pbrs.name = "Pet Brush";
acc.pbrs.desc =
  "Special brush designed for tending to fur of the animals. Cats especially enjoy being brushed by this tool" +
  dom.dseparator +
  '<span style="color:deeppink">Petting EXP gain +200%</span>';
acc.pbrs.slot = 8;
acc.pbrs.stype = 3;
acc.pbrs.oneq = function () {
  skl.pet.p += 2;
};
acc.pbrs.onuneq = function () {
  skl.pet.p -= 2;
};

acc.clrpin = new Eqp();
acc.clrpin.id = 40081;
acc.clrpin.name = "Clover Pin";
acc.clrpin.desc =
  "Small golden pin in a shape of a clover. Senior gamblers wear these pins to display their prestige and status" +
  dom.dseparator +
  '<span style="color:gold">Minor chance for an enemy dropped item to duplicate</span>';
acc.clrpin.slot = 8;
acc.clrpin.stype = 3;
acc.clrpin.rar = 4;
acc.clrpin.oneq = function () {
  you.mods.lkdbt += 0.01;
};
acc.clrpin.onuneq = function () {
  you.mods.lkdbt -= 0.01;
};

acc.prtckst = new Eqp();
acc.prtckst.id = 40082;
acc.prtckst.name = "Portable Cooking Set";
acc.prtckst.desc =
  "Box-sized kit containing every crucial cooking utencil you may need for comfortable and effortless foodmaking session anywhere at any time, complimented with variously sized knives, cutting boards, pots and even everlasting fire burner" +
  dom.dseparator +
  '<span style="color:deeppink">Cooking EXP gain +200%</span><br><span style="color:springgreen">Allows cooking everywhere</span>';
acc.prtckst.slot = 8;
acc.prtckst.stype = 3;
acc.prtckst.rar = 3;
acc.prtckst.oneq = function () {
  skl.cook.p += 2;
  you.mods.ckfre += 1;
};
acc.prtckst.onuneq = function () {
  skl.cook.p -= 2;
  you.mods.ckfre -= 1;
};

acc.ubrlc = new Eqp();
acc.ubrlc.id = 40083;
acc.ubrlc.name = "Umbrella";
acc.ubrlc.desc =
  "Light umbrella with a cloud pattern. Young masters and ladies carry these to display their carefree nature" +
  dom.dseparator +
  '<span style="color:cyan;background-color:blue">Prevents you from getting rained on</span>';
acc.ubrlc.slot = 8;
acc.ubrlc.stype = 3;
acc.ubrlc.oneq = function () {
  you.mods.rnprtk += 1;
};
acc.ubrlc.onuneq = function () {
  you.mods.rnprtk -= 1;
};

acc.sltbg = new Eqp();
acc.sltbg.id = 40084;
acc.sltbg.name = "Bag of Salt";
acc.sltbg.desc =
  "Little canvas bag filled with salt. Commoners believe that spreading salt can repel evil, so you can keep some on yourself for protection" +
  dom.dseparator +
  '<span style="color:tomato;text-shadow:blueviolet 0px 0px 5px">Undead Class DEF +12</span><br><span style="color:tomato;text-shadow:blueviolet 0px 0px 5px">Undead Class ATK +8</span>';
acc.sltbg.slot = 8;
acc.sltbg.stype = 3;
acc.sltbg.oneq = function () {
  you.cmaff[2] += 12;
  you.maff[2] += 8;
};
acc.sltbg.onuneq = function () {
  you.cmaff[2] -= 12;
  you.maff[2] -= 8;
};

acc.chlsbd = new Eqp();
acc.chlsbd.id = 40085;
acc.chlsbd.name = "Chalice";
acc.chlsbd.desc = function (x, y) {
  return (
    '<div style="color:red">Collected blood: <br><span>0ml</span><span style="display:inline-table;width:130px;border:1px solid darkgrey;margin: 7px;background:linear-gradient(90deg,#690000,red)"><span style="display:block;background-color:black;float:right;width:' +
    (100 - (x.data.bld / x.data.bldmax) * 100) +
    '%">　</span></span><span>' +
    x.data.bldmax +
    "ml</span></div>"
  );
};
acc.chlsbd.slot = 8;
acc.chlsbd.data.bld = 0;
acc.chlsbd.data.bldmax = 200;
acc.chlsbd.stype = 3;
acc.chlsbd.onKill = function (x, y) {
  if ((x.type === 1 || x.type === 0 || x.type === 5) && x.blood) {
    if (y.data.bld + x.blood * 5 > y.data.bldmax) y.data.bld = y.data.bldmax;
    else y.data.bld += x.blood * 5;
  }
};
acc.chlsbd.oneq = function () {
  checksd.push({ f: this.onKill, o: this });
};
acc.chlsbd.onuneq = function () {
  checksd.splice(checksd.indexOf({ f: this.onKill, o: this }), 1);
};

acc.otpin = new Eqp();
acc.otpin.id = 40086;
acc.otpin.name = "Sword Medal";
acc.otpin.desc =
  "Wearable ornament in the shape of a sword. Even if ranking the lowest, it serves as a proof of one's affiliation with dojo and martial arts in general" +
  dom.dseparator +
  '<span style="color:magenta"> EXP Gain +25%<br>All masteries EXP Gain +10%</span>';
acc.otpin.slot = 8;
acc.otpin.stype = 3;
acc.otpin.oneq = function () {
  skl.unc.p += 0.1;
  skl.srdc.p += 0.1;
  skl.knfc.p += 0.1;
  skl.axc.p += 0.1;
  skl.plrmc.p += 0.1;
  skl.stfc.p += 0.1;
  skl.bwc.p += 0.1;
  skl.hmrc.p += 0.1;
  you.exp_t += 0.25;
};
acc.otpin.onuneq = function () {
  skl.unc.p -= 0.1;
  skl.srdc.p -= 0.1;
  skl.knfc.p -= 0.1;
  skl.axc.p -= 0.1;
  skl.plrmc.p -= 0.1;
  skl.stfc.p -= 0.1;
  skl.bwc.p -= 0.1;
  skl.hmrc.p -= 0.1;
  you.exp_t -= 0.25;
};

acc.fmlim2 = new Eqp();
acc.fmlim2.id = 40087;
acc.fmlim2.important = true;
acc.fmlim2.name = "Family Heirloom+";
acc.fmlim2.desc =
  "You reinforced your family pendant's string with straw to prevent possible breaking. It looks even more lame like this" +
  dom.dseparator +
  '<span style="color:chartreuse">MAX HP +5<br>Max SAT +25<br>SPD +1</span>';
acc.fmlim2.slot = 8;
acc.fmlim2.stype = 3;
acc.fmlim2.oneq = function () {
  you.hpa += 5;
  you.sata += 25;
  you.spda += 1;
};
acc.fmlim2.onuneq = function () {
  you.hpa -= 5;
  you.sata -= 25;
  you.spda -= 1;
};

acc.gpin = new Eqp();
acc.gpin.id = 40088;
acc.gpin.name = "Fighter Insignia";
acc.gpin.desc =
  "Ring tempered by unending fighter spirit, was formerly owned by a rookie knight" +
  dom.dseparator +
  '<span style="color:chartreuse">STR +20<br>AGL +5</span>';
acc.gpin.slot = 8;
acc.gpin.stype = 3;
acc.gpin.oneq = function () {
  you.stra += 20;
  you.agla += 5;
};
acc.gpin.onuneq = function () {
  you.stra -= 20;
  you.agla -= 5;
};

acc.ndlb = new Eqp();
acc.ndlb.id = 40089;
acc.ndlb.name = "Wooden Needle";
acc.ndlb.desc =
  "Very primitive needle crafted from tough wood. Despite its simplicity, the craftsmanship is quiet nice" +
  dom.dseparator +
  '<span style="color:magenta">Tailoring EXP Gain +10%</span><br><br><small style="color:deeppink">Tailoring quality:<span style="color:orange"> 1</span></small>';
acc.ndlb.slot = 8;
acc.ndlb.tlrq = 1;
acc.ndlb.stype = 3;
acc.ndlb.oneq = function () {
  skl.tlrng.p += 0.1;
};
acc.ndlb.onuneq = function () {
  skl.tlrng.p -= 0.1;
};

/*Orlandu - "Actonite containing a fragment of Orlandu's skeleton"
Ogimus - "Amethyst containing Ogmious the Guardian's soul"
Balvus - "Chiastrite containing the ashes of Balvus"
Beowulf - "Moon Zircon"
Sigguld - "Fire agate with the soul of Sigguld the Dragoon"
Altema - "Garnet containing Altema the Fallen's spirit"
Haeralis - "Star sapphire with the power of Haeralis the Brave"
Orion - "Black coral holding the hair of Orion the Beast"
Iocus - "Lazurite containing St. Iocus's prayer"
Trinity - "Jade containing the Nordic holy spirits"
Dragonite - "Serpentine containing a dragon's power"
Demonia - "Blood opal containing the blood of devils"

suffering
resentment
*/

////dss////
wpn.stk1.dss = [{ item: item.wdc, amount: 2, q: 1.5, max: 5 }];
wpn.knf1.dss = [{ item: item.wdc, amount: 1, q: 1, max: 2 }];
item.fsh1.dss = [{ item: item.fsh2, amount: 1 }];
eqp.bnd.dss =
  eqp.pnt.dss =
  eqp.brc.dss =
  eqp.vst.dss =
    [{ item: item.cclth, amount: 1, q: 0.5, max: 2 }];
eqp.tnc.dss = [{ item: item.cclth, amount: 2 }];
item.dfish.dss = [{ item: item.fbait1, amount: 1, q: 0.75, max: 3 }];
item.cclth.dss = [{ item: item.thrdnl, amount: 1, q: 1, max: 2 }];
item.dmice1.dss = [{ item: item.sbone, amount: 1, q: 0.6, max: 3 }];
item.dbdc1.dss = [{ item: item.sbone, amount: 1, q: 0.5, max: 2 }];

////misc////
global.wdrop = [{ item: item.lckl, c: 0.0000048 }];
global.rdrop = [
  // g f e
  [{ item: item.lsrd, c: 0.00026 }],
  [{ item: item.lsrd, c: 0.0005 }],
  [
    { item: item.lsrd, c: 0.00098 },
    { item: item.lsstn, c: 0.00023 },
  ],
  [],
  [],
  [],
  [],
];
global.achchk = [
  //1 - you die, 2 - enemy dies
  [
    function (x) {
      if (ttl.ddw.have === false) {
        if ((x.id === 103 || x.id === 102) && x.lvl === 1) {
          giveTitle(ttl.ddw);
        }
      }
    },
  ],
  [
    function (x) {
      if (ttl.kill1.have === false) {
        if (global.stat.akills >= 10000) {
          giveTitle(ttl.kill1);
        }
      }
    },
    function (x) {
      if (ttl.kill2.have === false) {
        if (global.stat.akills >= 50000) {
          giveTitle(ttl.kill2);
        }
      }
    },
    function (x) {
      if (ttl.kill3.have === false) {
        if (global.stat.akills >= 200000) {
          giveTitle(ttl.kill3);
        }
      }
    },
    function (x) {
      if (ttl.kill4.have === false) {
        if (global.stat.akills >= 1000000) {
          giveTitle(ttl.kill4);
        }
      }
    },
    function (x) {
      if (ttl.kill5.have === false) {
        if (global.stat.akills >= 5000000) {
          giveTitle(ttl.kill5);
        }
      }
    },
  ],
];
global.monchk = [
  function (x) {
    if (ttl.mone1.have === false) {
      if (global.stat.moneyg >= GOLD) {
        giveTitle(ttl.mone1);
      }
    }
  },
  //  function(x){if(ttl.mone2.have===false){if(global.stat.moneyg>=GOLD){giveTitle(ttl.mone2)}}},
  //  function(x){if(ttl.mone3.have===false){if(global.stat.moneyg>=GOLD){giveTitle(ttl.mone3)}}},
];
global.ttlschk = [
  function (x) {
    if (ttl.ttsttl1.have === false) {
      if (global.titles.length >= 10) {
        giveTitle(ttl.ttsttl1);
      }
    }
  },
  function (x) {
    if (ttl.ttsttl2.have === false) {
      if (global.titles.length >= 25) {
        giveTitle(ttl.ttsttl2);
      }
    }
  },
  function (x) {
    if (ttl.ttsttl3.have === false) {
      if (global.titles.length >= 50) {
        giveTitle(ttl.ttsttl3);
      }
    }
  },
];

global.shptchk = [
  function (x) {
    if (ttl.shpt1.have === false) {
      if (global.stat.buyt >= 500) {
        giveTitle(ttl.shpt1);
      }
    }
  },
  //  function(x){if(ttl.shpt2.have===false){if(global.stat.buyt>=5000){giveTitle(ttl.shpt2)}}},
  //  function(x){if(ttl.shpt3.have===false){if(global.stat.buyt>=10000){giveTitle(ttl.shpt3)}}},
];
global.cptchk = [
  function (x) {
    if (ttl.cpet1.have === false) {
      if (global.stat.cat_c >= 9999) {
        giveTitle(ttl.cpet1);
      }
    }
  },
];
global.htrchl = [
  function (x) {
    if (ttl.hstr1.have === false) {
      if (x >= 100) {
        giveTitle(ttl.hstr1);
      }
    }
  },
  function (x) {
    if (ttl.hstr2.have === false) {
      if (x >= 250) {
        giveTitle(ttl.hstr2);
      }
    }
  },
  function (x) {
    if (ttl.hstr3.have === false) {
      if (x >= 500) {
        giveTitle(ttl.hstr3);
      }
    }
  },
];
global.nethmchk = [
  function (x) {
    if (ttl.neet.have === false) {
      if (global.stat.athmec >= YEAR) {
        giveTitle(ttl.neet);
      }
    }
  },
  function (x) {
    if (ttl.neet2.have === false) {
      if (global.stat.athmec >= YEAR * 5) {
        giveTitle(ttl.neet2);
      }
    }
  },
  function (x) {
    if (ttl.neet3.have === false) {
      if (global.stat.athmec >= YEAR * 10) {
        giveTitle(ttl.neet3);
      }
    }
  },
];
