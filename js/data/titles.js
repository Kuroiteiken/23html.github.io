// Title definitions and the game's callback hooks. A title is cosmetic unless
// it defines a `talent()`, which is applied once when the title is first
// earned. The `callbackManager` at the end of this file is the shared event
// mechanism other systems subscribe to; `callback.onDeath` is currently its
// only hook.

function Title(id) {
  this.name;
  this.id = id || 0;
  this.desc;
  this.have = false;
  this.tget = false;
  this.rar = 1;
  this.onGet = function () {};
}

ttl.new = new Title(0);
ttl.new.name = i18n.t("content.ttl.new.name");
ttl.new.desc = i18n.t("content.ttl.new.desc");

ttl.inn = new Title(1);
ttl.inn.name = i18n.t("content.ttl.inn.name");
ttl.inn.desc = i18n.t("content.ttl.inn.desc");

ttl.thr = new Title(2);
ttl.thr.name = i18n.t("content.ttl.thr.name");
ttl.thr.rar = 1;
ttl.thr.rars = true;
ttl.thr.desc = i18n.t("content.ttl.thr.desc");

ttl.wsl = new Title(3);
ttl.wsl.name = i18n.t("content.ttl.wsl.name");
ttl.wsl.desc = i18n.t("content.ttl.wsl.desc");

ttl.knf = new Title(4);
ttl.knf.name = i18n.t("content.ttl.knf.name");
ttl.knf.rar = 2;
ttl.knf.desc = i18n.t("content.ttl.knf.desc");

ttl.bll = new Title(5);
ttl.bll.name = i18n.t("content.ttl.bll.name");
ttl.bll.rar = 2;
ttl.bll.desc = i18n.t("content.ttl.bll.desc");

ttl.cvl = new Title(6);
ttl.cvl.name = i18n.t("content.ttl.cvl.name");
ttl.cvl.desc = i18n.t("content.ttl.cvl.desc");

ttl.stk = new Title(7);
ttl.stk.name = i18n.t("content.ttl.stk.name");
ttl.stk.desc = i18n.t("content.ttl.stk.desc");

ttl.fgt = new Title(8);
ttl.fgt.name = i18n.t("content.ttl.fgt.name");
ttl.fgt.rar = 2;
ttl.fgt.desc = i18n.t("content.ttl.fgt.desc");

ttl.pbg = new Title(9);
ttl.pbg.name = i18n.t("content.ttl.pbg.name");
ttl.pbg.desc = i18n.t("content.ttl.pbg.desc");

ttl.brw = new Title(10);
ttl.brw.name = i18n.t("content.ttl.brw.name");
ttl.brw.desc = i18n.t("content.ttl.brw.desc");

ttl.stb = new Title(11);
ttl.stb.name = i18n.t("content.ttl.stb.name");
ttl.stb.rar = 3;
ttl.stb.desc = i18n.t("content.ttl.stb.desc");

ttl.slp1 = new Title(12);
ttl.slp1.name = i18n.t("content.ttl.slp1.name");
ttl.slp1.desc = i18n.t("content.ttl.slp1.desc");

ttl.slp2 = new Title(13);
ttl.slp2.name = i18n.t("content.ttl.slp2.name");
ttl.slp2.rar = 2;
ttl.slp2.desc = i18n.t("content.ttl.slp2.desc");

ttl.slp3 = new Title(14);
ttl.slp3.name = i18n.t("content.ttl.slp3.name");
ttl.slp3.rar = 3;
ttl.slp3.desc = i18n.t("content.ttl.slp3.desc");

ttl.tcvl = new Title(15);
ttl.tcvl.name = i18n.t("content.ttl.tcvl.name");
ttl.tcvl.rar = 2;
ttl.tcvl.desc = i18n.t("content.ttl.tcvl.desc");

ttl.plm = new Title(16);
ttl.plm.name = i18n.t("content.ttl.plm.name");
ttl.plm.desc = i18n.t("content.ttl.plm.desc");

ttl.wlk = new Title(17);
ttl.wlk.name = i18n.t("content.ttl.wlk.name");
ttl.wlk.desc = i18n.t("content.ttl.wlk.desc");
ttl.wlk.talent = function () {
  you.mods.runerg -= 0.05;
};
// The running discount belongs to mods.runerg, which talent() already lowers and
// which scales the run cost every time it is applied. This onGet also poked
// sdrate directly, permanently, and only if the player happened to be running
// when the title was earned.
ttl.wlk.tdesc = i18n.t("content.ttl.wlk.tdesc");

ttl.eat1 = new Title(18);
ttl.eat1.name = i18n.t("content.ttl.eat1.name");
ttl.eat1.desc = i18n.t("content.ttl.eat1.desc");

ttl.eat2 = new Title(19);
ttl.eat2.name = i18n.t("content.ttl.eat2.name");
ttl.eat2.rar = 2;
ttl.eat2.desc = i18n.t("content.ttl.eat2.desc");

ttl.eat4 = new Title(20);
ttl.eat4.name = i18n.t("content.ttl.eat4.name");
ttl.eat4.rar = 4;
ttl.eat4.desc = i18n.t("content.ttl.eat4.desc");

ttl.eat5 = new Title(21);
ttl.eat5.name = i18n.t("content.ttl.eat5.name");
ttl.eat5.rar = 5;
ttl.eat5.desc = i18n.t("content.ttl.eat5.desc");

ttl.cck = new Title(22);
ttl.cck.name = i18n.t("content.ttl.cck.name");
ttl.cck.desc = i18n.t("content.ttl.cck.desc");

ttl.rok = new Title(23);
ttl.rok.name = i18n.t("content.ttl.rok.name");
ttl.rok.rar = 3;
ttl.rok.desc = i18n.t("content.ttl.rok.desc");

ttl.rnr = new Title(24);
ttl.rnr.name = i18n.t("content.ttl.rnr.name");
ttl.rnr.rar = 3;
ttl.rnr.desc = i18n.t("content.ttl.rnr.desc");

ttl.jgg = new Title(25);
ttl.jgg.name = i18n.t("content.ttl.jgg.name");
ttl.jgg.rar = 2;
ttl.jgg.desc = i18n.t("content.ttl.jgg.desc");
ttl.jgg.talent = function () {
  you.mods.runerg -= 0.15;
};
ttl.jgg.tdesc = i18n.t("content.ttl.jgg.tdesc");

ttl.spn = new Title(26);
ttl.spn.name = i18n.t("content.ttl.spn.name");
ttl.spn.rar = 4;
ttl.spn.desc = i18n.t("content.ttl.spn.desc");

ttl.ilt = new Title(27);
ttl.ilt.name = i18n.t("content.ttl.ilt.name");
ttl.ilt.desc = i18n.t("content.ttl.ilt.desc");

ttl.und = new Title(28);
ttl.und.name = i18n.t("content.ttl.und.name");
ttl.und.rar = 2;
ttl.und.desc = i18n.t("content.ttl.und.desc");

ttl.aaa = new Title(29);
ttl.aaa.name = i18n.t("content.ttl.aaa.name");
ttl.aaa.desc = i18n.t("content.ttl.aaa.desc");

ttl.eat3 = new Title(30);
ttl.eat3.name = i18n.t("content.ttl.eat3.name");
ttl.eat3.rar = 3;
ttl.eat3.desc = i18n.t("content.ttl.eat3.desc");

ttl.srd1 = new Title(31);
ttl.srd1.name = i18n.t("content.ttl.srd1.name");
ttl.srd1.desc = i18n.t("content.ttl.srd1.desc");

ttl.srd2 = new Title(32);
ttl.srd2.name = i18n.t("content.ttl.srd2.name");
ttl.srd2.rar = 2;
ttl.srd2.desc = i18n.t("content.ttl.srd2.desc");

ttl.srd3 = new Title(33);
ttl.srd3.name = i18n.t("content.ttl.srd3.name");
ttl.srd3.rar = 3;
ttl.srd3.desc = i18n.t("content.ttl.srd3.desc");

ttl.srd4 = new Title(34);
ttl.srd4.name = i18n.t("content.ttl.srd4.name");
ttl.srd4.rar = 4;
ttl.srd4.desc = i18n.t("content.ttl.srd4.desc");

ttl.lnc1 = new Title(35);
ttl.lnc1.name = i18n.t("content.ttl.lnc1.name");
ttl.lnc1.desc = i18n.t("content.ttl.lnc1.desc");

ttl.lnc2 = new Title(36);
ttl.lnc2.name = i18n.t("content.ttl.lnc2.name");
ttl.lnc2.rar = 2;
ttl.lnc2.desc = i18n.t("content.ttl.lnc2.desc");

ttl.lnc3 = new Title(37);
ttl.lnc3.name = i18n.t("content.ttl.lnc3.name");
ttl.lnc3.rar = 3;
ttl.lnc3.desc = i18n.t("content.ttl.lnc3.desc");

ttl.hmr2 = new Title(38);
ttl.hmr2.name = i18n.t("content.ttl.hmr2.name");
ttl.hmr2.rar = 2;
ttl.hmr2.desc = i18n.t("content.ttl.hmr2.desc");

ttl.hmr3 = new Title(39);
ttl.hmr3.name = i18n.t("content.ttl.hmr3.name");
ttl.hmr3.rar = 3;
ttl.hmr3.desc = i18n.t("content.ttl.hmr3.desc");

ttl.kill1 = new Title(40);
ttl.kill1.name = i18n.t("content.ttl.kill1.name");
ttl.kill1.desc = i18n.t("content.ttl.kill1.desc");

ttl.rspn1 = new Title(41);
ttl.rspn1.name = i18n.t("content.ttl.rspn1.name");
ttl.rspn1.desc = i18n.t("content.ttl.rspn1.desc");

ttl.rfpn1 = new Title(42);
ttl.rfpn1.name = i18n.t("content.ttl.rfpn1.name");
ttl.rfpn1.desc = i18n.t("content.ttl.rfpn1.desc");

ttl.rfpn2 = new Title(43);
ttl.rfpn2.name = i18n.t("content.ttl.rfpn2.name");
ttl.rfpn2.rar = 2;
ttl.rfpn2.desc = i18n.t("content.ttl.rfpn2.desc");
ttl.rfpn2.talent = function () {
  you.mods.survinf++;
};
ttl.rfpn2.tdesc = i18n.t("content.ttl.rfpn2.tdesc");

ttl.rfpn3 = new Title(44);
ttl.rfpn3.name = i18n.t("content.ttl.rfpn3.name");
ttl.rfpn3.rar = 3;
ttl.rfpn3.desc = i18n.t("content.ttl.rfpn3.desc");

ttl.tqtm = new Title(45);
ttl.tqtm.name = i18n.t("content.ttl.tqtm.name");
ttl.tqtm.rars = true;
ttl.tqtm.desc = i18n.t("content.ttl.tqtm.desc");
ttl.tqtm.talent = function () {
  /*(:*/
};
ttl.tqtm.tdesc = i18n.t("content.ttl.tqtm.tdesc");

ttl.ddw = new Title(46);
ttl.ddw.name = i18n.t("content.ttl.ddw.name");
ttl.ddw.rar = 0;
ttl.ddw.rars = true;
ttl.ddw.desc = i18n.t("content.ttl.ddw.desc");

ttl.neet = new Title(47);
ttl.neet.name = i18n.t("content.ttl.neet.name");
ttl.neet.rars = true;
ttl.neet.desc = i18n.t("content.ttl.neet.desc");

ttl.aptc = new Title(48);
ttl.aptc.name = i18n.t("content.ttl.aptc.name");
ttl.aptc.rar = 2;
ttl.aptc.desc = i18n.t("content.ttl.aptc.desc");

ttl.sld1 = new Title(49);
ttl.sld1.name = i18n.t("content.ttl.sld1.name");
ttl.sld1.desc = i18n.t("content.ttl.sld1.desc");

ttl.sld2 = new Title(50);
ttl.sld2.name = i18n.t("content.ttl.sld2.name");
ttl.sld2.rar = 2;
ttl.sld2.desc = i18n.t("content.ttl.sld2.desc");

ttl.sld3 = new Title(51);
ttl.sld3.name = i18n.t("content.ttl.sld3.name");
ttl.sld3.rar = 3;
ttl.sld3.desc = i18n.t("content.ttl.sld3.desc");

ttl.sld4 = new Title(52);
ttl.sld4.name = i18n.t("content.ttl.sld4.name");
ttl.sld4.rar = 4;
ttl.sld4.desc = i18n.t("content.ttl.sld4.desc");

ttl.seye1 = new Title(53);
ttl.seye1.name = i18n.t("content.ttl.seye1.name");
ttl.seye1.desc = i18n.t("content.ttl.seye1.desc");

ttl.seye2 = new Title(54);
ttl.seye2.name = i18n.t("content.ttl.seye2.name");
ttl.seye2.rar = 2;
ttl.seye2.desc = i18n.t("content.ttl.seye2.desc");

ttl.pet1 = new Title(55);
ttl.pet1.name = i18n.t("content.ttl.pet1.name");
ttl.pet1.desc = i18n.t("content.ttl.pet1.desc");

ttl.pet2 = new Title(56);
ttl.pet2.name = i18n.t("content.ttl.pet2.name");
ttl.pet2.rar = 2;
ttl.pet2.desc = i18n.t("content.ttl.pet2.desc");

ttl.dngs1 = new Title(57);
ttl.dngs1.name = i18n.t("content.ttl.dngs1.name");
ttl.dngs1.desc = i18n.t("content.ttl.dngs1.desc");

ttl.dngs2 = new Title(58);
ttl.dngs2.name = i18n.t("content.ttl.dngs2.name");
ttl.dngs2.rar = 2;
ttl.dngs2.desc = i18n.t("content.ttl.dngs2.desc");

ttl.rtr1 = new Title(59);
ttl.rtr1.name = i18n.t("content.ttl.rtr1.name");
ttl.rtr1.rar = 1;
ttl.rtr1.desc = i18n.t("content.ttl.rtr1.desc");

ttl.ddcd = new Title(60);
ttl.ddcd.name = i18n.t("content.ttl.ddcd.name");
ttl.ddcd.rar = 0;
ttl.ddcd.rars = true;
ttl.ddcd.desc = i18n.t("content.ttl.ddcd.desc");

ttl.neet2 = new Title(61);
ttl.neet2.name = i18n.t("content.ttl.neet2.name");
ttl.neet2.rar = 2;
ttl.neet2.rars = true;
ttl.neet2.desc = i18n.t("content.ttl.neet2.desc");

ttl.neet3 = new Title(62);
ttl.neet3.name = i18n.t("content.ttl.neet3.name");
ttl.neet3.rar = 3;
ttl.neet3.rars = true;
ttl.neet3.desc = i18n.t("content.ttl.neet3.desc");

ttl.coo1 = new Title(63);
ttl.coo1.name = i18n.t("content.ttl.coo1.name");
ttl.coo1.desc = i18n.t("content.ttl.coo1.desc");

ttl.kill2 = new Title(64);
ttl.kill2.name = i18n.t("content.ttl.kill2.name");
ttl.kill2.rar = 2;
ttl.kill2.desc = i18n.t("content.ttl.kill2.desc");

ttl.kill3 = new Title(65);
ttl.kill3.name = i18n.t("content.ttl.kill3.name");
ttl.kill3.rar = 3;
ttl.kill3.desc = i18n.t("content.ttl.kill3.desc");

ttl.kill4 = new Title(66);
ttl.kill4.name = i18n.t("content.ttl.kill4.name");
ttl.kill4.rar = 4;
ttl.kill4.desc = i18n.t("content.ttl.kill4.desc");

ttl.kill5 = new Title(67);
ttl.kill5.name = i18n.t("content.ttl.kill5.name");
ttl.kill5.rar = 5;
ttl.kill5.desc = i18n.t("content.ttl.kill5.desc");

ttl.axc1 = new Title(68);
ttl.axc1.name = i18n.t("content.ttl.axc1.name");
ttl.axc1.desc = i18n.t("content.ttl.axc1.desc");

ttl.axc2 = new Title(69);
ttl.axc2.name = i18n.t("content.ttl.axc2.name");
ttl.axc2.desc = i18n.t("content.ttl.axc2.desc");

ttl.axc3 = new Title(70);
ttl.axc3.name = i18n.t("content.ttl.axc3.name");
ttl.axc3.rar = 3;
ttl.axc3.desc = i18n.t("content.ttl.axc3.desc");

ttl.dth1 = new Title(71);
ttl.dth1.name = i18n.t("content.ttl.dth1.name");
ttl.dth1.desc = i18n.t("content.ttl.dth1.desc");

ttl.dth2 = new Title(72);
ttl.dth2.name = i18n.t("content.ttl.dth2.name");
ttl.dth2.rar = 2;
ttl.dth2.desc = i18n.t("content.ttl.dth2.desc");

ttl.dth3 = new Title(73);
ttl.dth3.name = i18n.t("content.ttl.dth3.name");
ttl.dth3.rar = 3;
ttl.dth3.desc = i18n.t("content.ttl.dth3.desc");

ttl.sld5 = new Title(74);
ttl.sld5.name = i18n.t("content.ttl.sld5.name");
ttl.sld5.rar = 5;
ttl.sld5.desc = i18n.t("content.ttl.sld5.desc");

ttl.seye3 = new Title(75);
ttl.seye3.name = i18n.t("content.ttl.seye3.name");
ttl.seye3.rar = 3;
ttl.seye3.desc = i18n.t("content.ttl.seye3.desc");

ttl.fmn1 = new Title(76);
ttl.fmn1.name = i18n.t("content.ttl.fmn1.name");
ttl.fmn1.desc = i18n.t("content.ttl.fmn1.desc");

ttl.fmn2 = new Title(77);
ttl.fmn2.name = i18n.t("content.ttl.fmn2.name");
ttl.fmn2.rar = 2;
ttl.fmn2.desc = i18n.t("content.ttl.fmn2.desc");

ttl.fmn3 = new Title(78);
ttl.fmn3.name = i18n.t("content.ttl.fmn3.name");
ttl.fmn3.rar = 3;
ttl.fmn3.desc = i18n.t("content.ttl.fmn3.desc");

ttl.shpt1 = new Title(79);
ttl.shpt1.name = i18n.t("content.ttl.shpt1.name");
ttl.shpt1.desc = i18n.t("content.ttl.shpt1.desc");

ttl.shpt2 = new Title(80);
ttl.shpt2.name = i18n.t("content.ttl.shpt2.name");
ttl.shpt2.rar = 2;
ttl.shpt2.desc = i18n.t("content.ttl.shpt2.desc");

ttl.shpt3 = new Title(81);
ttl.shpt3.name = i18n.t("content.ttl.shpt3.name");
ttl.shpt3.rar = 3;
ttl.shpt3.desc = i18n.t("content.ttl.shpt3.desc");

ttl.mone1 = new Title(82);
ttl.mone1.name = i18n.t("content.ttl.mone1.name");
ttl.mone1.desc = i18n.t("content.ttl.mone1.desc");

ttl.mone2 = new Title(83);
ttl.mone2.name = i18n.t("content.ttl.mone2.name");
ttl.mone2.rar = 2;
ttl.mone2.desc = i18n.t("content.ttl.mone2.desc");

ttl.mone3 = new Title(84);
ttl.mone3.name = i18n.t("content.ttl.mone3.name");
ttl.mone3.rar = 3;
ttl.mone3.desc = i18n.t("content.ttl.mone3.desc");

ttl.geti1 = new Title(85);
ttl.geti1.name = i18n.t("content.ttl.geti1.name");
ttl.geti1.desc = i18n.t("content.ttl.geti1.desc");

ttl.geti2 = new Title(86);
ttl.geti2.name = i18n.t("content.ttl.geti2.name");
ttl.geti2.rar = 2;
ttl.geti2.desc = i18n.t("content.ttl.geti2.desc");

ttl.geti3 = new Title(87);
ttl.geti3.name = i18n.t("content.ttl.geti3.name");
ttl.geti3.rar = 3;
ttl.geti3.desc = i18n.t("content.ttl.geti3.desc");

ttl.geti4 = new Title(88);
ttl.geti4.name = i18n.t("content.ttl.geti4.name");
ttl.geti4.rar = 4;
ttl.geti4.desc = i18n.t("content.ttl.geti4.desc");

ttl.tghs1 = new Title(89);
ttl.tghs1.name = i18n.t("content.ttl.tghs1.name");
ttl.tghs1.desc = i18n.t("content.ttl.tghs1.desc");

ttl.tghs2 = new Title(90);
ttl.tghs2.name = i18n.t("content.ttl.tghs2.name");
ttl.tghs2.rar = 2;
ttl.tghs2.desc = i18n.t("content.ttl.tghs2.desc");

ttl.tghs3 = new Title(91);
ttl.tghs3.name = i18n.t("content.ttl.tghs3.name");
ttl.tghs3.rar = 3;
ttl.tghs3.desc = i18n.t("content.ttl.tghs3.desc");

ttl.dth4 = new Title(92);
ttl.dth4.name = i18n.t("content.ttl.dth4.name");
ttl.dth4.rar = 4;
ttl.dth4.desc = i18n.t("content.ttl.dth4.desc");

ttl.ttsttl1 = new Title(93);
ttl.ttsttl1.name = i18n.t("content.ttl.ttsttl1.name");
ttl.ttsttl1.desc = i18n.t("content.ttl.ttsttl1.desc");

ttl.ttsttl2 = new Title(94);
ttl.ttsttl2.name = i18n.t("content.ttl.ttsttl2.name");
ttl.ttsttl2.rar = 2;
ttl.ttsttl2.desc = i18n.t("content.ttl.ttsttl2.desc");

ttl.ttsttl3 = new Title(95);
ttl.ttsttl3.name = i18n.t("content.ttl.ttsttl3.name");
ttl.ttsttl3.rar = 3;
ttl.ttsttl3.desc = i18n.t("content.ttl.ttsttl3.desc");

ttl.ttsttl4 = new Title(96);
ttl.ttsttl4.name = i18n.t("content.ttl.ttsttl4.name");
ttl.ttsttl4.rar = 4;
ttl.ttsttl4.desc = i18n.t("content.ttl.ttsttl4.desc");

ttl.hstr1 = new Title(97);
ttl.hstr1.name = i18n.t("content.ttl.hstr1.name");
ttl.hstr1.desc = i18n.t("content.ttl.hstr1.desc");

ttl.hstr2 = new Title(98);
ttl.hstr2.name = i18n.t("content.ttl.hstr2.name");
ttl.hstr2.rar = 2;
ttl.hstr2.desc = i18n.t("content.ttl.hstr2.desc");

ttl.hstr3 = new Title(99);
ttl.hstr3.name = i18n.t("content.ttl.hstr3.name");
ttl.hstr3.rar = 3;
ttl.hstr3.desc = i18n.t("content.ttl.hstr3.desc");

ttl.hstr4 = new Title(100);
ttl.hstr4.name = i18n.t("content.ttl.hstr4.name");
ttl.hstr4.rar = 4;
ttl.hstr4.desc = i18n.t("content.ttl.hstr4.desc");

ttl.cpet1 = new Title(101);
ttl.cpet1.name = i18n.t("content.ttl.cpet1.name");
ttl.cpet1.rar = 2;
ttl.cpet1.desc = i18n.t("content.ttl.cpet1.desc");

ttl.jbs1 = new Title(102);
ttl.jbs1.name = i18n.t("content.ttl.jbs1.name");
ttl.jbs1.desc = i18n.t("content.ttl.jbs1.desc");

ttl.jbs2 = new Title(103);
ttl.jbs2.name = i18n.t("content.ttl.jbs2.name");
ttl.jbs2.rar = 2;
ttl.jbs2.desc = i18n.t("content.ttl.jbs2.desc");

ttl.jbs3 = new Title(104);
ttl.jbs3.name = i18n.t("content.ttl.jbs3.name");
ttl.jbs3.rar = 3;
ttl.jbs3.desc = i18n.t("content.ttl.jbs3.desc");

ttl.pet3 = new Title(105);
ttl.pet3.name = i18n.t("content.ttl.pet3.name");
ttl.pet3.rar = 3;
ttl.pet3.desc = i18n.t("content.ttl.pet3.desc");

ttl.ndthextr = new Title(106);
ttl.ndthextr.name = i18n.t("content.ttl.ndthextr.name");
ttl.ndthextr.rar = 0;
ttl.ndthextr.rars = true;
ttl.ndthextr.desc = i18n.t("content.ttl.ndthextr.desc");

ttl.indkill = new Title(107);
ttl.indkill.name = i18n.t("content.ttl.indkill.name");
ttl.indkill.rar = 2;
ttl.indkill.rars = true;
ttl.indkill.desc = i18n.t("content.ttl.indkill.desc");

function Weather(id) {
  this.name = "?";
  this.id = id || -1;
  this.ontick = function () {};
}
var weather = {};

weather.sunny = new Weather(100);
weather.sunny.name = i18n.t("content.weather.sunny.name");
weather.sunny.c = "yellow";
weather.cloudy = new Weather(101);
weather.cloudy.name = i18n.t("content.weather.cloudy.name");
weather.cloudy.c = "ghostwhite";
weather.stormy = new Weather(102);
weather.stormy.name = i18n.t("content.weather.stormy.name");
weather.stormy.c = "#bdbdbd";
weather.overcast = new Weather(103);
weather.overcast.name = i18n.t("content.weather.overcast.name");
weather.overcast.c = "lightgrey";
weather.storm = new Weather(104);
weather.storm.name = i18n.t("content.weather.storm.name");
weather.storm.frain = true;
weather.storm.c = "lightgrey";
weather.storm.bc = "#5a5a5a";
weather.thunder = new Weather(105);
weather.thunder.name = i18n.t("content.weather.thunder.name");
weather.thunder.frain = true;
weather.thunder.c = "yellow";
weather.thunder.bc = "#5a5a5a";
weather.rain = new Weather(106);
weather.rain.name = i18n.t("content.weather.rain.name");
weather.rain.c = "cyan";
weather.rain.bc = "#2a3971";
weather.rain.frain = true;
weather.heavyrain = new Weather(107);
weather.heavyrain.name = i18n.t("content.weather.heavyrain.name");
weather.heavyrain.frain = true;
weather.heavyrain.c = "cyan";
weather.heavyrain.bc = "#4d5eb3";
weather.misty = new Weather(108);
weather.misty.name = i18n.t("content.weather.misty.name");
weather.misty.bc = "#244b68";
weather.foggy = new Weather(109);
weather.foggy.name = i18n.t("content.weather.foggy.name");
weather.foggy.bc = "#7c8b9a";
weather.drizzle = new Weather(110);
weather.drizzle.name = i18n.t("content.weather.drizzle.name");
weather.drizzle.bc = "254863";
weather.drizzle.frain = true;
weather.clear = new Weather(111);
weather.clear.name = i18n.t("content.weather.clear.name");
weather.snow = new Weather(112);
weather.snow.name = i18n.t("content.weather.snow.name");
weather.snow.c = "white";
weather.snow.bc = "#aaa";
weather.snow.fsnow = true;
weather.sstorm = new Weather(113);
weather.sstorm.name = i18n.t("content.weather.sstorm.name");
weather.sstorm.c = "white";
weather.sstorm.bc = "#88a";
weather.sstorm.fsnow = true;

weather.storm.ontick =
  weather.rain.ontick =
  weather.heavyrain.ontick =
  weather.drizzle.ontick =
    function () {
      if (global.flags.inside === false) {
        if (effect.wet.active === false && !you.mods.rnprtk)
          giveEff(you, effect.wet, 5);
        const f = findbyid(global.current_m.eff, effect.wet.id);
        if (!f || f.active === false) giveEff(global.current_m, effect.wet, 5);
      }
    };

weather.thunder.ontick = function () {
  if (global.flags.inside === false) {
    if (effect.wet.active === false && !you.mods.rnprtk)
      giveEff(you, effect.wet, 5);
    const f = findbyid(global.current_m.eff, effect.wet.id);
    if (!f || f.active === false) giveEff(global.current_m, effect.wet, 5);
    if (random() < 0.0009) {
      global.stat.lgtstk++;
      msg(
        i18n.t(
          "runtime.data.titles.dialogue.you_were_struck_by_lightning_abd1e6bf",
        ),
        "black",
        null,
        null,
        "yellow",
      );
      const d = (200 / (1 + skl.aba.lvl * 0.05)) << 0;
      if (you.hp - d < 0) {
        global.atkdfty[0] = 1;
        you.hp = 0;
        you.onDeath();
        giveSkExp(skl.painr, 300);
        giveSkExp(skl.dth, 100);
      } else {
        you.hp -= d;
        giveSkExp(skl.painr, 170);
      }
      giveSkExp(skl.aba, 30);
      dom.d5_1_1.update();
    }
  }
};

// Titles that track a running total. Each entry names the statistic, the
// threshold, and the title it awards. Ten of these titles shipped with a name
// and no grant path at all, even though the game was already counting what they
// describe: completed jobs, items collected, and damage survived. Granted
// titles are skipped, so checkStatMilestones is cheap enough to run on the tick.
const statMilestones = [
  { stat: "jcom", at: 5, title: "jbs1" },
  { stat: "jcom", at: 25, title: "jbs2" },
  { stat: "jcom", at: 100, title: "jbs3" },
  { stat: "igtttl", at: 500, title: "geti1" },
  { stat: "igtttl", at: 5000, title: "geti2" },
  { stat: "igtttl", at: 50000, title: "geti3" },
  { stat: "igtttl", at: 250000, title: "geti4" },
  { stat: "dmgrt", at: 5000, title: "tghs1" },
  { stat: "dmgrt", at: 50000, title: "tghs2" },
  { stat: "dmgrt", at: 500000, title: "tghs3" },
];

function checkStatMilestones() {
  for (const milestone of statMilestones) {
    const title = ttl[milestone.title];
    if (!title || title.have) continue;
    if ((global.stat[milestone.stat] || 0) >= milestone.at) giveTitle(title);
  }
}

function callbackManager(id) {
  this.id = id || 0;
  this.hooks = [];
  this.fire = function (...args) {
    // Iterate a copy: a hook may detach itself, or another hook, while the
    // event is still being delivered.
    const hooks = this.hooks.slice();
    for (let a = 0; a < hooks.length; a++) hooks[a].f(...args);
  };
}

// Event hooks the rest of the game subscribes to through attachCallback. A hook
// is `{ f, id, data }`; a hook whose `data.q` is true is owned by a quest and is
// cleared before a save is restored. Add a hook here rather than introducing a
// second dispatch mechanism alongside this one.
callback.onDeath = new callbackManager(1); // (victim, killer)
callback.onLevel = new callbackManager(2); // (who)
callback.onEnterArea = new callbackManager(3); // (area)
callback.onCraft = new callbackManager(4); // (recipe)
callback.onQuestComplete = new callbackManager(5); // (quest)

function attachCallback(callback, what, data) {
  callback.hooks.push(what);
}

function detachCallback(callback, what) {
  for (let a = callback.hooks.length - 1; a >= 0; a--)
    if (callback.hooks[a].id === what) callback.hooks.splice(a, 1);
}

/*attachCallback(callback.onDeath,{
  f:function(victim, killer){
    if(victim.id===112) this.data.a++
    if(this.data.a===5) msg("KILLED FIVE",'yellow')
  },
  id:50,
  data:{a:0,q:true}
})*/

function Time() {
  this.minute = 0;
  this.hour = 0;
  this.day = 0;
  this.month = 0;
  this.year = 0;
}

time = new Time();
time.minute = 338144100;
global.text.d_l = i18n.get("gameText.d_l");
global.text.d_s = i18n.get("gameText.d_s");
global.text.d_j = i18n.get("gameText.d_j");
