function Chs() {
  this.ttl;
  this.sl = function () {};
  this.data = {};
  this.onStay = function () {};
  this.onEnter = function () {};
  this.onLeave = function () {};
  this.onScout = function () {};
  this.sector = [];
}

chss.t1 = new Chs();
chss.t1.id = 101;
chss.t1.sl = function () {
  global.lst_loc = 101;
  global.flags.inside = true;
  d_loc("Dojo, training area");
  chs("???: Kid", true);
  chs('"..."', false).addEventListener("click", function () {
    global.time += DAY;
    appear(dom.ctr_1);
    chs("???: Quit daydreaming", true);
    chs('"?"', false).addEventListener("click", function () {
      appear(dom.d0);
      chs("???: You have training to complete", true);
      chs('"!"', false).addEventListener("click", function () {
        appear(dom.inv_ctx);
        appear(dom.d_lct);
        chs("???: Grab your stuff and get to it", true);
        chs('"..."', false).addEventListener("click", function () {
          appear(dom.ct_ctrl);
          smove(chss.tdf, false);
          giveItem(wpn.stk1);
          giveItem(item.hrb1, 15);
          global.flags.aw_u = true;
        });
      });
    });
  });
};
if (global.flags.gameone === false) {
  global.current_l = chss.t1;
  smove(chss.t1);
  giveFurniture(furniture.frplc, null, false);
  const _b = giveFurniture(furniture.bed1, null, false);
  home.bed = _b;
}

chss.tdf = new Chs();
chss.tdf.id = 102;
chss.tdf.sl = function () {
  global.lst_loc = 102;
  global.flags.inside = true;
  clr_chs();
  if (!global.flags.dmap) {
    appear(dom.gmsgs);
    global.flags.dmap = true;
  }
  chs('"Select the difficulty"', true);
  if (!global.flags.tr1_win)
    chs('"Easiest"', false).addEventListener("click", function () {
      chs('"You are fighting training dummies"', true);
      if (!global.flags.dm1ap) {
        appear(dom.d1m);
        global.flags.dm1ap = true;
      }
      area_init(area.trn1);
    });
  if (!global.flags.tr2_win)
    chs('"Easy"', false).addEventListener("click", function () {
      chs('"You are fighting training dummies"', true);
      if (!global.flags.dm1ap) {
        appear(dom.d1m);
        global.flags.dm1ap = true;
      }
      area_init(area.trn2);
    });
  if (!global.flags.tr3_win)
    chs('"Normal"', false).addEventListener("click", function () {
      chs('"You are fighting training dummies"', true);
      if (!global.flags.dm1ap) {
        appear(dom.d1m);
        global.flags.dm1ap = true;
      }
      area_init(area.trn3);
    });
};
chss.tdf.onEnter = function () {
  area_init(area.nwh);
};

chss.t2 = new Chs();
chss.t2.id = 103;
chss.t2.sl = function () {
  global.lst_loc = 103;
  global.flags.inside = true;
  chs(
    '"Instructor: ' +
      select(["Good", "Nice", "Great", "Excellent"]) +
      " " +
      select(["job", "work"]) +
      " kid! Here's the reward for completing the course\"",
    true,
    "lime",
  );
  chs('"->"', false).addEventListener("click", function () {
    if (global.flags.tr1_win === true && !global.flags.rwd1) {
      global.flags.rwd1 = true;
      giveItem(item.appl, 4);
      giveItem(item.hrb1, 5);
      smove(chss.tdf);
    } else if (global.flags.tr2_win === true && !global.flags.rwd2) {
      global.flags.rwd2 = true;
      giveItem(item.brd, 2);
      giveItem(item.hrb1, 5);
      giveItem(eqp.sndl);
      smove(chss.tdf);
    } else if (global.flags.tr3_win === true && !global.flags.rwd3) {
      global.flags.rwd3 = true;
      const itm = giveItem(eqp.vst);
      itm.dp *= 0.7;
      if (global.flags.m_un === true) giveItem(item.cp, 10);
    }
    if (!global.flags.tr3_win || !global.flags.tr2_win || !global.flags.tr1_win)
      smove(chss.tdf);
    else {
      smove(chss.t3);
      giveTitle(ttl.inn);
    }
  });
};

chss.t3 = new Chs();
chss.t3.id = 104;
chss.t3.sl = () => {
  global.flags.inside = true;
  d_loc("Dojo, lobby");
  global.lst_loc = 104;
  global.flags.inside = true;
  if (global.flags.nbtfail) {
    chs(
      '"Instructor: You got beaten up by an inanimated dummy?! Pay attention to your condition!"',
      true,
    );
    chs('"..."', false).addEventListener("click", () => {
      global.flags.nbtfail = false;
      clr_chs();
      smove(chss.tdf, false);
      giveItem(item.hrb1, 4);
    });
  } else {
    if (!global.flags.dj1end) {
      chs(
        '"Instructor: Your training is over for today, you did well. As a reward, select one of these skill manuals to practice. The better your understanding, the stronger you will be in battle"',
        true,
      );
      chs('"Practitioner Skillbook (Swords)"', false).addEventListener(
        "click",
        () => {
          giveItem(item.skl1);
          global.flags.dj1end = true;
          smove(chss.lsmain1);
        },
      );
      chs('"Practitioner Skillbook (Knives)"', false).addEventListener(
        "click",
        () => {
          giveItem(item.skl2);
          global.flags.dj1end = true;
          smove(chss.lsmain1);
        },
      );
      chs('"Practitioner Skillbook (Axes)"', false).addEventListener(
        "click",
        () => {
          giveItem(item.skl3);
          global.flags.dj1end = true;
          smove(chss.lsmain1);
        },
      );
      chs('"Practitioner Skillbook (Spears)"', false).addEventListener(
        "click",
        () => {
          giveItem(item.skl4);
          global.flags.dj1end = true;
          smove(chss.lsmain1);
        },
      );
      chs('"Practitioner Skillbook (Hammers)"', false).addEventListener(
        "click",
        () => {
          giveItem(item.skl5);
          global.flags.dj1end = true;
          smove(chss.lsmain1);
        },
      );
      chs('"Practitioner Skillbook (Martial)"', false).addEventListener(
        "click",
        () => {
          giveItem(item.skl6);
          global.flags.dj1end = true;
          smove(chss.lsmain1);
        },
      );
    } else if (global.flags.trnex1 === true && !global.flags.trnex2) {
      chs(
        "\"Instructor: Hahahhha! What a great disciple! That's not the dedication most of the other disciples have! Take this, it'll help you in your future endeavours\"",
        true,
        "yellow",
      );
      chs('"Thanks teacher!"', false).addEventListener("click", () => {
        giveItem(acc.snch);
        smove(chss.lsmain1);
        global.flags.trnex2 = true;
      });
    } else {
      chs(
        select([
          '"Instructor: Back already?"',
          "You notice other dojo disciples diligently train",
          "Pieces of broken training dummies are scattered on the floor",
        ]),
        true,
      );
      chs('"Dojo infoboard"', false).addEventListener("click", () => {
        smove(chss.djinf, false);
      });
      chs('"Destroy more dummies"', false).addEventListener("click", () => {
        smove(chss.return1, false);
      });
      if (
        global.flags.dj1end === true &&
        you.lvl >= 10 &&
        !global.flags.trne1e1
      )
        chs('"Challenge a stronger opponent"', false).addEventListener(
          "click",
          () => {
            chs('"You are facing a golem"', true);
            area_init(area.trne1);
            chs('"<= Escape"', false).addEventListener("click", () => {
              smove(chss.t3, false);
            });
          },
        );
      if (global.flags.trne1e1 && !global.flags.trne2e1)
        chs(
          '"Challenge an even stronger opponent"',
          false,
          "cornflowerblue",
        ).addEventListener("click", () => {
          chs('"You are facing a golem"', true);
          area_init(area.trne2);
          chs('"<= Escape"', false).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.trne2e1 && !global.flags.trne3e1)
        chs(
          '"Challenge a dangerous opponent"',
          false,
          "crimson",
        ).addEventListener("click", () => {
          chs('"You are facing a golem"', true);
          area_init(area.trne3);
          chs('"<= Escape"', false).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.trne3e1 && !global.flags.trne4e1)
        chs('"Challenge a powerful opponent"', false, "red").addEventListener(
          "click",
          () => {
            chs('"You are facing a golem"', true);
            area_init(area.trne4);
            chs('"<= Escape"', false).addEventListener("click", () => {
              smove(chss.t3, false);
            });
          },
        );
      if (global.flags.dj1end)
        chs('"Turn in dojo gear"', false).addEventListener("click", () => {
          chs(
            "\"Instructor: You can return whatever you punched off of dummies and get coin for it, it's dojo's equipment after all. Or you can keep and use for it yourself, the choice is yours\"",
            true,
          );
          chs('"Return the rags"', false).addEventListener("click", () => {
            let dlr = 0;
            stash = [];
            verify = true;
            for (const a in inv) {
              if (
                inv[a].id === wpn.knf1.id &&
                you.eqp[0].data.uid !== inv[a].data.uid
              ) {
                stash.push(inv[a]);
                dlr += 1;
              }
            }
            for (const a in inv) {
              if (
                inv[a].id === wpn.wsrd2.id &&
                you.eqp[0].data.uid !== inv[a].data.uid
              ) {
                stash.push(inv[a]);
                dlr += 3;
              }
            }
            for (const a in inv) {
              if (inv[a].id === eqp.brc.id) {
                verify = true;
                for (const b in you.eqp)
                  if (you.eqp[b].data.uid === inv[a].data.uid) verify = false;
                if (verify === true) {
                  stash.push(inv[a]);
                  dlr += 1;
                }
              }
            }
            for (const a in inv) {
              if (inv[a].id === eqp.vst.id) {
                verify = true;
                for (const b in you.eqp)
                  if (you.eqp[b].data.uid === inv[a].data.uid) verify = false;
                if (verify === true) {
                  stash.push(inv[a]);
                  dlr += 1;
                }
              }
            }
            for (const a in inv) {
              if (inv[a].id === eqp.pnt.id) {
                verify = true;
                for (const b in you.eqp)
                  if (you.eqp[b].data.uid === inv[a].data.uid) verify = false;
                if (verify === true) {
                  stash.push(inv[a]);
                  dlr += 1;
                }
              }
            }
            for (const a in inv) {
              if (inv[a].id === eqp.bnd.id) {
                verify = true;
                for (const b in you.eqp)
                  if (you.eqp[b].data.uid === inv[a].data.uid) verify = false;
                if (verify === true) {
                  stash.push(inv[a]);
                  dlr += 1;
                }
              }
            }
            if (dlr === 0)
              chs('"Instructor: There\'s nothing I can take from you"', true);
            else {
              chs(
                '"Instructor: For all your stuff I can fetch you ' +
                  dlr +
                  " " +
                  dom.coincopper +
                  ' copper. How does that sound?"',
                true,
              );
              chs('"Accept"', false, "lime").addEventListener("click", () => {
                msg(
                  stash.length + " Items returned back to dojo",
                  "ghostwhite",
                );
                global.stat.ivtntdj += stash.length;
                giveWealth(dlr);
                for (const a in stash) removeItem(stash[a]);
                if (global.stat.ivtntdj >= 300) giveTitle(ttl.tqtm);
                smove(chss.t3, false);
              });
            }
            chs('"<= Go back"', false).addEventListener("click", () => {
              smove(chss.t3, false);
            });
          });
          chs('"<= Go back"', false).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.djmlet && getDay(1) == "Sunday") {
        chs('"Grab a serving of free food"', false, "lime").addEventListener(
          "click",
          () => {
            if (getDay(1) == "Sunday") {
              msg(select(["*Chow*", "*Munch*", "*Crunch*", "*Gulp*"]), "lime");
              msg(
                select([
                  "That was good!",
                  "Delicious!",
                  "A little dry but, that will do",
                  "Tasty!",
                  "Phew, I needed that!",
                ]),
                "lime",
              );
              you.sat = you.satmax;
              giveSkExp(skl.glt, 42);
              dom.d5_3_1.update();
              global.flags.djmlet = false;
              smove(chss.t3, false);
              return;
            } else {
              msg("Too late for that", "yellow");
              global.flags.djmlet = false;
              smove(chss.t3, false);
              return;
            }
          },
        );
      }
      if (global.flags.dj1end === true)
        chs('"Level Advancement"', false, "orange").addEventListener(
          "click",
          () => {
            chs(
              '"Instructor: If you put effort into training you will get rewards as long as you are still a disciple of this hall. After every 5 levels you reach, come here and recieve your share! You might get something really useful if you continue to improve your skills"',
              true,
            );
            if (!global.flags.dj1rw1 && you.lvl >= 5) {
              chs('"Level 5 reward"', false).addEventListener("click", () => {
                chs(
                  '"Instructor: This is a good start, congratulations! Keep working hard!"',
                  true,
                );
                chs('"Accept"', false, "lime").addEventListener("click", () => {
                  global.flags.dj1rw1 = true;
                  giveWealth(25);
                  giveItem(item.sp1, 5);
                  smove(chss.t3, false);
                });
              });
            }
            if (
              !global.flags.dj1rw2 &&
              global.flags.dj1rw1 === true &&
              you.lvl >= 10
            ) {
              chs('"Level 10 reward"', false, "royalblue").addEventListener(
                "click",
                () => {
                  chs(
                    '"Instructor: You seem to not neglect your training, good job! Keep working hard!"',
                    true,
                  );
                  chs('"Accept"', false, "lime").addEventListener(
                    "click",
                    () => {
                      global.flags.dj1rw2 = true;
                      giveWealth(100);
                      giveItem(item.sp2, 2);
                      smove(chss.t3, false);
                    },
                  );
                },
              );
            }
            if (
              !global.flags.dj1rw3 &&
              global.flags.dj1rw2 === true &&
              you.lvl >= 15
            ) {
              chs('"Level 15 reward"', false, "lime").addEventListener(
                "click",
                () => {
                  chs(
                    '"Instructor: You\'re slowly growing into a fine young warrior! Keep working hard!"',
                    true,
                  );
                  chs('"Accept"', false, "lime").addEventListener(
                    "click",
                    () => {
                      global.flags.dj1rw3 = true;
                      giveWealth(200);
                      giveItem(item.sp3, 1);
                      giveItem(eqp.tnc);
                      giveItem(item.lifedr);
                      giveItem(eqp.knkls);
                      giveItem(eqp.knkls);
                      smove(chss.t3, false);
                    },
                  );
                },
              );
            }
            if (
              !global.flags.dj1rw4 &&
              global.flags.dj1rw3 === true &&
              you.lvl >= 20
            ) {
              chs('"Level 20 reward"', false, "gold").addEventListener(
                "click",
                () => {
                  chs(
                    '"Instructor: Time to start getting serious! Keep working hard!"',
                    true,
                  );
                  chs('"Accept"', false, "lime").addEventListener(
                    "click",
                    () => {
                      global.flags.dj1rw4 = true;
                      giveWealth(300);
                      giveItem(wpn.tkmts);
                      smove(chss.t3, false);
                    },
                  );
                },
              );
            }
            if (
              !global.flags.dj1rw5 &&
              global.flags.dj1rw4 === true &&
              you.lvl >= 25
            ) {
              chs('"Level 25 reward"', false, "orange").addEventListener(
                "click",
                () => {
                  chs(
                    '"Instructor: You\'re almost ready to face real dangers of the outside world! Keep working hard!"',
                    true,
                  );
                  chs('"Accept"', false, "lime").addEventListener(
                    "click",
                    () => {
                      global.flags.dj1rw5 = true;
                      giveWealth(350);
                      giveItem(acc.mnch);
                      smove(chss.t3, false);
                    },
                  );
                },
              );
            }
            if (
              !global.flags.dj1rw6 &&
              global.flags.dj1rw5 === true &&
              you.lvl >= 30
            ) {
              chs('"Level 30 reward"', false, "crimson").addEventListener(
                "click",
                () => {
                  chs(
                    '"Instructor: You are almost as strong as an average adult! Good job kid and Keep working hard! Maybe you can defend this village one day"',
                    true,
                  );
                  chs('"Accept"', false, "lime").addEventListener(
                    "click",
                    () => {
                      global.flags.dj1rw6 = true;
                      giveWealth(400);
                      giveItem(item.stthbm1);
                      giveItem(item.stthbm4);
                      giveItem(item.stthbm3);
                      giveItem(item.stthbm2);
                      smove(chss.t3, false);
                    },
                  );
                },
              );
            }
            chs('"<= Return"', false).addEventListener("click", () => {
              smove(chss.t3, false);
            });
          },
        );
      if (item.htrdvr.have)
        chs('"Deliver the crate"', false, "lightblue").addEventListener(
          "click",
          () => {
            chs(
              "\"Instructor: Yamato sent something? Great timing on that, we were getting very close to running out already. This will be turned into rations for you lads, you better don't forget to thank our hunters properly next time you see them, as they work hard to bring food to people's tables. Here, small compensation for your timely delivery\"",
              true,
            );
            chs('"Accept"', false, "lime").addEventListener("click", () => {
              chs(
                "\"Instructor: Hold it, that's not all, catch this as well, i believe it is yours. You won't be as lucky next time and lose your possessions for good if you leave them around again, pay better attention to where your stuff is\"",
                true,
              );
              chs('"Accept x2"', false, "lime").addEventListener(
                "click",
                () => {
                  giveWealth(50);
                  giveItem(item.key0);
                  removeItem(item.htrdvr);
                  smove(chss.t3, false);
                },
              );
            });
          },
        );
      chs('"<= Go outside"', false).addEventListener("click", () => {
        smove(chss.lsmain1);
      });
      if (global.flags.trne4e1 && !global.flags.trne4e1b) {
        chs(
          '"Instructor: Once again, choose the skillbook of specialization you are interested in. Doesn\'t mean you have to stick with it to the bitter end, but it will help you train"',
          true,
        );
        chs('"Bladesman Manual"', false).addEventListener("click", () => {
          giveItem(item.skl1a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs('"Assassin Manual"', false).addEventListener("click", () => {
          giveItem(item.skl2a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs('"Axeman Manual"', false).addEventListener("click", () => {
          giveItem(item.skl3a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs('"Lancer Manual"', false).addEventListener("click", () => {
          giveItem(item.skl4a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs('"Clubber Manual"', false).addEventListener("click", () => {
          giveItem(item.skl5a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs('"Brawler Manual"', false).addEventListener("click", () => {
          giveItem(item.skl6a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
      }
    }
  }
};
chss.t3.onEnter = function () {
  area_init(area.nwh);
};

chss.djinf = new Chs();
chss.djinf.id = 160;
chss.djinf.sl = () => {
  global.flags.inside = true;
  d_loc("Dojo, Infoboard");
  global.lst_loc = 160;
  chs(
    "Useful information regarding dojo is written here. What will you read?",
    true,
  );
  chs('"Get stronger!"', false).addEventListener("click", () => {
    chs(
      "Fight dummies provided by dojo to improve your physique and weapon skills! Destroy them and grab their stuff, or vanquish thousands for a special reward! The doors of our dojo is open for everyone willing to lead the path of a warrior",
      true,
    );
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs('"Graduate!"', false).addEventListener("click", () => {
    chs(
      "When you are confident in your skills, try your fist at fighting powerful golems! How much beating can you withstand?",
      true,
    );
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs('"Claim your rewards!"', false).addEventListener("click", () => {
    chs(
      "As long as you keep gaining experience and train hard, dojo will provide you with gifts and money! Don't miss out!",
      true,
    );
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs('"Get your grub at the canteen!"', false).addEventListener(
    "click",
    () => {
      chs(
        "Our generous dojo provides " +
          col("Free Meals", "lime") +
          " to every attending low-class disciple every " +
          col("Sunday", "yellow") +
          "! Get in time for your weekly menu!",
        true,
      );
      chs('"<= Return"', false).addEventListener("click", () => {
        smove(chss.djinf, false);
      });
    },
  );
  chs('"Measure your power!"', false).addEventListener("click", () => {
    const v = chs(
      "Try out punching this " +
        col("Indestructable Dummy", "orange") +
        " to measure the power of your fist!",
      true,
    );
    chs('"Give it a try"', false).addEventListener("click", () => {
      you.stat_r();
      const hs = handStr();
      v.innerHTML =
        select(["Wham!", "Slap!", "Hit!", "Punch!", "Hack!"]) +
        ' Your approximate hand strength is measured in: <br><br><span style="border:1px dashed yellow;padding:6px">' +
        col(format3(hs.toString()) + "kg", "springgreen") +
        "</span><br><br>";
      for (const x in global.htrchl) global.htrchl[x](hs);
    });
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.t3, false);
  });
};

chss.trne1e1 = new Chs();
chss.trne1e1.id = 124;
chss.trne1e1.sl = () => {
  global.flags.inside = true;
  d_loc("Dojo, training area");
  global.lst_loc = 124;
  chs(
    "Instructor: Great job smashing that golem! This golem is one of the weakest types around, but even he can become a huge trouble if you're not giving it your best. Now, grab this and proceed with your training",
    true,
  );
  chs('"Proceed with your training"', false).addEventListener("click", () => {
    giveItem(item.hptn1, 10);
    global.flags.trne1e1 = true;
    smove(chss.t3);
  });
};

chss.trne2e1 = new Chs();
chss.trne2e1.id = 125;
chss.trne2e1.sl = () => {
  global.flags.inside = true;
  d_loc("Dojo, training area");
  global.lst_loc = 125;
  chs(
    "Instructor: Just like that, keep it up. You are starting to stand much longer in fights, such an improvement from when you just arrived here! You deserver your praise, but don't get complacent",
    true,
  );
  chs('"Proceed with your training"', false).addEventListener("click", () => {
    giveItem(wpn.fksrd);
    giveItem(acc.otpin);
    global.flags.trne2e1 = true;
    smove(chss.t3);
  });
};

chss.trne3e1 = new Chs();
chss.trne3e1.id = 126;
chss.trne3e1.sl = () => {
  global.flags.inside = true;
  d_loc("Dojo, training area");
  global.lst_loc = 126;
  chs(
    "Instructor: That was a tough one, but you still managed to crush it! You are getting close to finishing a second course. Don't give up!",
    true,
  );
  chs('"Proceed with your training"', false).addEventListener("click", () => {
    giveItem(item.scrlw);
    global.flags.trne3e1 = true;
    smove(chss.t3);
  });
};

chss.trne4e1 = new Chs();
chss.trne4e1.id = 162;
chss.trne4e1.sl = () => {
  global.flags.inside = true;
  d_loc("Dojo, training area");
  global.lst_loc = 162;
  chs(
    'Instructor: <span style="color:lime">As expected, you have what it takes to protect yourself! And with that, you have finished the second entry course of this dojo, job well done! Soon, you will be able to step out of the village and take on serious jobs that will let you explore the land. You better prepare yourself well before that happens!</span>',
    true,
  );
  chs('"Finish training"', false, "lime").addEventListener("click", () => {
    global.flags.trne4e1 = true;
    smove(chss.t3);
  });
};

chss.return1 = new Chs();
chss.return1.id = 105;
chss.return1.sl = () => {
  global.flags.inside = true;
  d_loc("Dojo, training area");
  global.lst_loc = 105;
  chs("Punch as many as you want", true);
  if (!global.flags.trnex2) area_init(area.trn);
  else area_init(area.trnf);
  chs('"<= Return back into lobby"', false).addEventListener("click", () => {
    smove(chss.t3);
  });
};

chss.frstn1main = new Chs();
chss.frstn1main.id = 113;
chss.frstn1main.sl = () => {
  global.flags.inside = false;
  d_loc("Western Woods, The Wooden Gate");
  global.lst_loc = 113;
  chs("You're out in the forest. You can hunt here", true);
  chs('"=> Enter the Hunter\'s lodge"', false).addEventListener("click", () => {
    smove(chss.frstn1b1);
  });
  chs('"=> Delve inside the forest"', false).addEventListener("click", () => {
    smove(chss.frstn1a1);
  });
  if (global.flags.frstn1a3u)
    chs('"=> Hunt indefinitely"', false).addEventListener("click", () => {
      smove(chss.frstn1a3);
    });
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

chss.frstn1a3 = new Chs();
chss.frstn1a3.id = 130;
addtosector(sector.forest1, chss.frstn1a3);
chss.frstn1a3.sl = () => {
  global.flags.inside = false;
  d_loc("Western Woods, They're Nearby");
  global.lst_loc = 130;
  chs("The woods are silent", true);
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.frstn1main);
  });
};
chss.frstn1a3.onEnter = function () {
  area_init(area.frstn1a3);
};

chss.frstn1a4 = new Chs();
chss.frstn1a4.id = 161;
addtosector(sector.forest1, chss.frstn1a4);
chss.frstn1a4.sl = () => {
  global.flags.inside = false;
  d_loc("Western Woods, Round Branches");
  if (area.frstn1a4.size > 0) {
    chs("Something ambushes you!", true, "red");
    chs('"<= Escape"', false).addEventListener("click", () => {
      smove(chss.frstn1main);
    });
  } else {
    chs("You never knew this secluded area was here", true);
    if (!global.flags.frstnskltg)
      chs('"Look around"', false).addEventListener("click", () => {
        chs(
          "You see something sticking out from the ground in the grass over there. Bones?",
          true,
        );
        chs('"Examine whatever that might be"', false).addEventListener(
          "click",
          () => {
            chs(
              "Indeed, bones. Skeletal remains of a person to be exact. Looks like he died long time ago, much of everything rotted off, even metallic bits of whatever armor he was wearing have fallen apart.",
              true,
            );
            chs('"See if you can salvage anything"', false).addEventListener(
              "click",
              () => {
                chs(
                  "There isn't much you can take with you, except for the sword on the skeleton'\s hip, still inside its half-desintegrated sheath. What was the cause of his death? He wasn't in a fight judging by the state of the sword. Was he poisoned? Or caught by surprise? Couldn't leave this place for whatever reason? You are not sure. The least you can do is honor the deceased by burying his remains",
                  true,
                );
                chs('"Make a grave"', false).addEventListener("click", () => {
                  global.flags.frstnskltg = true;
                  giveItem(wpn.mkrdwk);
                  you.karma += 3;
                  you.luck++;
                  msg("Your good deed improved your karma!", "gold");
                  msg("LUCK Increased +1", "gold");
                  chss.frstn1a4.sl();
                });
              },
            );
          },
        );
      });
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.frstn1main);
    });
  }
};
chss.frstn1a4.onEnter = function () {
  if (area.frstn1a4.size > 0) area_init(area.frstn1a4);
};
chss.frstn1a4.onLeave = function () {
  area.frstn1a4.size = rand(5) + 20;
};
chss.frstn1a4.data = {
  scoutm: 600,
  scout: 0,
  scoutf: false,
  gets: [false],
  gotmod: 0,
};
chss.frstn1a4.scout = [
  {
    c: 0.009,
    f: () => {
      msg(
        "You discover a pouch half-etched into the ground and covered by a rock. It probably belonged to the corpse",
        "lime",
      );
      giveItem(item.mnblm, 3);
      chss.frstn1a4.data.gets[0] = true;
    },
    exp: 35,
  },
  {
    c: 0.0005,
    cond: () => {
      if (getHour() >= 0 && getHour() <= 3 && getLunarPhase() === 0)
        return true;
    },
    f: () => {
      msg("You found Moonbloom!", "lime");
      giveItem(item.mnblm);
    },
    exp: 10,
  },
];
chss.frstn1a4.onScout = function () {
  scoutGeneric(this);
};

chss.frstn1b1 = new Chs();
chss.frstn1b1.id = 118;
chss.frstn1b1.sl = () => {
  global.flags.inside = true;
  d_loc("Western Woods, Hunter's Lodge");
  if (wearingany(wpn.mkrdwk) && !global.flags.wkrtndrt) {
    chs(
      '<span style="color:limegreen">Head Hunter Yamato</span>: You! Why do you have that?',
      true,
    );
    chs('"?"', false).addEventListener("click", () => {
      chs(
        '<span style="color:limegreen">Head Hunter Yamato</span>: The sword! Where did you get it!?',
        true,
      );
      chs("Give explanation", false).addEventListener("click", () => {
        chs(
          '<span style="color:limegreen">Head Hunter Yamato</span>: The body in the forest, you say... Dammit! Our scouts are worthless if it takes someone like you to make such an important discovery! *sigh..* This sword you\'re holding once belonged to our deputy chief - Dein. You might have not met him before if you never set your foot out of the village, he was a promising and talented young soldier who were assigned to such an remote settlement for his field training',
          true,
        );
        chs("=>", false).addEventListener("click", () => {
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: Then one day he staight up vanished, without letting anyone know, and he was well respected and cared for our people all the same. Of course, being a part of the military would prevent him from disclosing his plans and duties, but it is highly doubtful a special task from the higher command would be the reason of his abscence. All of his belongins, personal items and possessions are still there, where he left them. Lad knew how to fight and wield a sword, I do not for once believe a man of his caliber would perish and die like this, the corpse you speak of might not be his...',
            true,
          );
          chs(
            "Express your condolences to the deceased",
            false,
          ).addEventListener("click", () => {
            chs(
              '<span style="color:limegreen">Head Hunter Yamato</span>: Alright, enough. Your sentiment is appreciated, but let us hope Dein still draws breath out there. This entire precident calls for investigation, a team of hunters will be dispatched shortly and you keep yourself alert too. And I will be taking that from your hands, thank you for bringing it here. Time will tell wether this sword becomes a memento or returns to its rightful owner',
              true,
            );
            chs("Part with the sword", false).addEventListener("click", () => {
              chs(
                '<span style="color:limegreen">Head Hunter Yamato</span>: Here, take this for your trouble',
                true,
              );
              chs("Accept", false, "lime").addEventListener("click", () => {
                removeItem(findbyid(inv, wpn.mkrdwk.id));
                giveWealth(300);
                global.flags.wkrtndrt = true;
                smove(chss.frstn1b1, false);
              });
            });
          });
        });
      });
    });
    return;
  }
  if (!global.flags.frstn1b1int) {
    chs(
      "<span style=\"color:limegreen\">Head Hunter Yamato</span>: Hm? Your face is unfamiliar. Might be your first time around here I take it? These are the Western Woods, or simply the western part of the forest. Spots here are very meek and mild on danger and resources, it is perfect for newbies like you. You are free to come and hunt as much as you like. Consider doing some of the available jobs while you're at it. Won't pay much, but you can be of help to the people.",
      true,
      "orange",
      null,
      null,
      null,
      ".9em",
    );
    global.flags.frstn1b1int = true;
  } else
    global.flags.wkrtndrt && random() > 0.5
      ? chs(
          select([
            "You sight the hunter thinking deeply about something",
            "You hear mumbling",
          ]),
          true,
        )
      : chs(
          select([
            "You see a variety of bows and other hunting tools arranged on the table and hanging from the walls",
            "You notice head hunter maintaining his hunting gear",
            "The smell of beef jerky assaults your nose",
          ]),
          true,
        );
  chs('"!Ask about the jobs"', false, "yellow").addEventListener(
    "click",
    () => {
      smove(chss.frstn1b1j, false);
    },
  );
  chs('"Tell me something"', false).addEventListener("click", () => {
    smove(chss.htrtch0, false);
  });
  if (quest.fwd1.data.done === true) {
    chs('"Sell firewood ' + dom.coincopper + '"', false).addEventListener(
      "click",
      () => {
        smove(chss.frstn1b1s, false);
      },
    );
  }
  if (item.hbtsvr.have)
    chs('"Deliver the satchel"', false, "lightblue").addEventListener(
      "click",
      () => {
        chs(
          "<span style=\"color:limegreen\">Head Hunter Yamato</span>: Delivery back? That's unexpected! Put this here, let me examine it... I see, we're going east soon, then... Well, that's not for you to worry about, hhah! There is another thing. You wait here a moment<br>.......<br><br> Heeere we go! Get this crate to the dojo since you're going in that direction anyway. They'll know what to do with it. Go now, go",
          true,
        );
        chs('"Ok"', false).addEventListener("click", () => {
          giveItem(item.htrdvr);
          removeItem(item.hbtsvr);
          smove(chss.frstn1main);
        });
      },
    );
  chs('"<= Exit"', false).addEventListener("click", () => {
    smove(chss.frstn1main);
  });
  if (
    quest.fwd1.data.done === true &&
    quest.hnt1.data.done === true &&
    !global.flags.frstn1b1g1
  ) {
    chs(
      "<span style=\"color:limegreen\">Head Hunter Yamato</span>: You're still going around without a proper weapon? That won't do, catch this. It isn't much, but a bit better than you being nearly emptyhanded. Once you return back you should check the " +
        col("Notice Board", "lime") +
        " by the village center, you never know if something important is happening in the ouskirts that you aren't aware of, but it will almost certainly be written there. You may find a job offer or two, or see pleads of fellow villagers asking for help with mundane things, consider those as well",
      true,
    );
    chs('"Thanks!"', false).addEventListener("click", () => {
      chs(
        "<span style=\"color:limegreen\">Head Hunter Yamato</span>: One more thing. I'll ask you to do this very easy, little job. Grab this bag and get it to the village's herbalist. You know where the herbalist is? Here are the directions, listen well: head to the marketplace and look for a very unremarkable little building with a sign that looks like a vial. Like those vials they use in alchemy, those ones. The building is located a little further back from the road, in the shade, so you may simply forget it exists if you aren't specifically looking for it, you keep your eyes peeled. Now go, you should have no problem getting there",
        true,
      );
      chs('"Got it"', false).addEventListener("click", () => {
        global.flags.frstn1b1g1 = true;
        giveItem(wpn.dgknf);
        giveItem(item.htrsvr);
        smove(chss.frstn1b1, false);
        global.flags.phai1udt = true;
      });
    });
  }
};

chss.htrtch0 = new Chs();
chss.htrtch0.id = 164;
chss.htrtch0.sl = () => {
  global.flags.inside = true;
  chs(
    '<span style="color:limegreen">Head Hunter Yamato</span>: What do you want to ask, kid? Want to know how to butcher a carcass? Khahhahhah! *cough*',
    true,
  );
  chs('"About monsters"', false).addEventListener("click", () => {
    smove(chss.htrtch1, false);
  });
  chs('"What are monster ranks?"', false).addEventListener("click", () => {
    chs(
      '<div style="line-height:16px"><span style="color:limegreen">Head Hunter Yamato</span>: Ranking is a way to separate monsters by their relative danger level, they go as following:<div style="border: darkblue 1px solid;background-color:#0b1c3c;margin:10px;"><div><span style="color:lighgrey">G - Can be dealth with by able people</span></div><div><span style="color:white">F - Can be dealth with by male adults</span></div><div><span style="color:lightgreen">E - Village Crisis</span></div><div><span style="color:lime">D - Townside Crisis</span></div><div><span style="color:yellow">C - Citywide Crisis</span></div><div><span style="color:orange">B - National Crisis</span></div><div><span style="color:crimson">A - Continental Threat</span></div><div><span style="color:gold;text-shadow: 0px 0px 2px red,0px 0px 2px red,0px 0px 2px red">S - Global Crisis</span></div><div><span style="color:black;text-shadow:hotpink 1px 1px .1em,cyan -1px -1px .1em">SS - World Disaster</span></div><div><span style="color:white;text-shadow:2px 0px 2px red,-2px 0px 2px magenta,0px 2px 2px cyan,0px -2px 2px yellow,0px 0px 2px gold">SSS - Universal Calamity</div></div>We haven\'t experienced anything stronger than the E rank in all history of our village. Whatever is above the A rank is completely unheard of, and only partially mentioned in ancient texts. That\'s the realm of gods, world destroyers and higher beings that our mortal souls are unlikely to ever face</div>',
      true,
      0,
      0,
      0,
      0,
      ".9em",
    );
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.htrtch0, false);
    });
  });
  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.frstn1b1, false);
  });
};

chss.htrtch1 = new Chs();
chss.htrtch1.id = 163;
chss.htrtch1.sl = () => {
  global.flags.inside = true;
  chs(
    '<div style="line-height:14px"><span style="color:limegreen">Head Hunter Yamato</span>: Monsters, you say? There are many and they are around, terrorizing peaceful folk in the outside world. Our remote parts don\'t see much of that, these lands are tame. Not without dangers, of course, you meet a wild boar in the forest - a single wrong move and its tusks are in your guts and that is it, end of the fool. Or those pesky slimes, while don\'t look menacing and pose little danger, they sometimes gather and destroy the fields by melting crops and soil. We have it good but starvation is worse than any monster, at times. *cough* anyway, anything living and non-living you meet can be separated into 6 categories:<br>Human, Beast, Undead, Evil, Phantom, Dragon</div>',
    true,
    0,
    0,
    0,
    0,
    ".8em",
  );
  chs('"About Humans"', false, 0, 0, 0, 0, ".8em", 0, "15px").addEventListener(
    "click",
    () => {
      chs(
        '<span style="color:limegreen">Head Hunter Yamato</span>: Humans and Demihumans fall into the same class. People like you and me, beastmen, orcs, goblins... Mostly creatures intelligent enough to walk on their two, use tools, form societies, make settlements, trade and speak on their own violition. You will encounter and perhaps fight them as bandits, criminals, members of the opposing factions and armies, whoever you disagree with. Always be on your guard, humanoids are cunning and skilled, versatile and very adaptive. Yet, they have mushy bodies. One correct strike and you get an advantage',
        true,
      );
      chs('"<= Return"', false).addEventListener("click", () => {
        smove(chss.htrtch1, false);
      });
    },
  );
  chs('"About Beasts"', false, 0, 0, 0, 0, ".8em", 0, "15px").addEventListener(
    "click",
    () => {
      chs(
        '<span style="color:limegreen">Head Hunter Yamato</span>: Beasts are your usual, normal wildlife like wolves, slimes, mimics, or prone to being evil Demihumans with low intelligence and high level of aggression like ogres, harpies, minotaurs. While animals are dumb, never underestimate a wild beast. With their thick skin and natural weapons like fangs and claws, they pose a major threat when driven into a desperate state. Fire works very well against the most, especially those with fur and feathers, keep that in mind next time you go hunting',
        true,
      );
      chs('"<= Return"', false).addEventListener("click", () => {
        smove(chss.htrtch1, false);
      });
    },
  );
  chs('"About Undead"', false, 0, 0, 0, 0, ".8em", 0, "15px").addEventListener(
    "click",
    () => {
      chs(
        '<span style="color:limegreen">Head Hunter Yamato</span>: Undead, as you could already tell, are living dead. Reanimated remains of humans and beasts by the influence of natural forces or a skilled necromancer. Even if they completely lack intelligence and wander around aimlessly, controlled bodies of the dead get strenghtened by Dark magic and gain unnatural resilience and power as a result. It doesn\'t prevent them from being hurt by fire or Holy powers, hovewer. You can deal with lesser fragile skeletal beings quickly if you bash them with something blunt',
        true,
      );
      chs('"<= Return"', false).addEventListener("click", () => {
        smove(chss.htrtch1, false);
      });
    },
  );
  chs('"About Evil"', false, 0, 0, 0, 0, ".8em", 0, "15px").addEventListener(
    "click",
    () => {
      chs(
        '<span style="color:limegreen">Head Hunter Yamato</span>: Beings that are artificially made or existences who are inherently evil, can be classified as such. Demons, imps, golems, possessed weapons and armor, gremlins, devils and much of anything else that comes out from the Underworld. They are extremely dangerous and seek destruction all that they come across',
        true,
      );
      chs('"<= Return"', false).addEventListener("click", () => {
        smove(chss.htrtch1, false);
      });
    },
  );
  chs(
    '"About Phantoms"',
    false,
    0,
    0,
    0,
    0,
    ".8em",
    0,
    "15px",
  ).addEventListener("click", () => {
    chs(
      '<span style="color:limegreen">Head Hunter Yamato</span>: Souls of the dead, ethereal beings, manifestations of powers or other apparitions can all be called Phantoms. They take forms of wisp and sprites, benevolent or twisted elementals or spirits and wraiths that terrorize the living. They are difficult or sometimes outright impossible to hurt using normal physical means, magic or exorcism would be a preferred way of dealing with such enemies',
      true,
    );
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.htrtch1, false);
    });
  });
  chs('"About Dragons"', false, 0, 0, 0, 0, ".8em", 0, "15px").addEventListener(
    "click",
    () => {
      chs(
        '<span style="color:limegreen">Head Hunter Yamato</span>: Dragons are legendary creatures that possess evil and cunning intellect. Through some unknown means many dragons in ancient times were reduced to subspecies of wyverns and wyrms, or outright bastard draconids like lizardmen, and other beings with Dragon bloodline. The power of said bloodline grants them superior defence against magic and energy abilities, their physical toughness is also no joke',
        true,
      );
      chs('"<= Return"', false).addEventListener("click", () => {
        smove(chss.htrtch1, false);
      });
    },
  );
  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.htrtch0, false);
  });
};

chss.frstn1b1s = new Chs();
chss.frstn1b1s.id = 121;
chss.frstn1b1s.sl = () => {
  global.flags.inside = true;
  chs(
    '<span style="color:limegreen">Head Hunter Yamato</span>: I\'ll fetch you 15 copper per bundle! How many do you want to sell?',
    true,
  );
  const fwd = item.fwd1.have ? item.fwd1.amount : 0;
  if (fwd >= 1)
    chs('"Sell 1 piece"', false, "lightgrey").addEventListener("click", () => {
      item.fwd1.amount -= 1;
      if (item.fwd1.amount <= 0) removeItem(item.fwd1);
      giveWealth(15);
      smove(chss.frstn1b1s, false);
    });
  if (fwd >= 5)
    chs('"Sell 5 piece"', false, "lime").addEventListener("click", () => {
      item.fwd1.amount -= 5;
      if (item.fwd1.amount <= 0) removeItem(item.fwd1);
      giveWealth(75);
      smove(chss.frstn1b1s, false);
    });
  if (fwd >= 10)
    chs('"Sell 10 pieces"', false, "cyan").addEventListener("click", () => {
      item.fwd1.amount -= 10;
      if (item.fwd1.amount <= 0) removeItem(item.fwd1);
      giveWealth(150);
      smove(chss.frstn1b1s, false);
    });
  if (fwd >= 1)
    chs('"Sell Everything"', false, "orange").addEventListener("click", () => {
      giveWealth(item.fwd1.amount * 15);
      item.fwd1.amount = 0;
      removeItem(item.fwd1);
      smove(chss.frstn1b1s, false);
    });
  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.frstn1b1, false);
  });
};

chss.frstn1b1j = new Chs();
chss.frstn1b1j.id = 119;
chss.frstn1b1j.sl = () => {
  global.flags.inside = true;
  chs(
    '<span style="color:limegreen">Head Hunter Yamato</span>: Here is what\'s available, take a look',
    true,
  );
  if (quest.fwd1.data.done && quest.hnt1.data.done) {
    if (!quest.lmfstkil1.data.started && !quest.lmfstkil1.data.done) {
      chs('"Monster eradication"', false).addEventListener("click", () => {
        if (you.lvl < 20 || !global.flags.trne4e1) {
          msg(
            '<span style="color:limegreen">Head Hunter Yamato</span>: Don\'t even think about it, you will not be sent to your death. Go back and train, dojo has everything you need',
          );
          return;
        }
        if (!quest.lmfstkil1.data.started) {
          chs(
            "<span style=\"color:limegreen\">Head Hunter Yamato</span>: What's this? Your aura has changed since we last met! All the martial training you went through certainly hasn't gone to waste, this kid is definitely isn't a pushover anymore, hah! If you have the guts to take on the next task, listen well - southern forest is becoming more and more dangerous, lethal beasts keep crawling in from the farther plains, making it very difficult to do any sort of work in the south. Looks like wolves this time. Some fear, at this rate, they might reach and assault the village, and that will have need to be dealth with. This is a dangerous issue, and you will have to have courage to take it on, but in turn it will serve you as great real battle experience. Other lads have already signed up, as well. Are you willing?",
            true,
            "yellow",
            0,
            0,
            0,
            ".9em",
          );
          chs('"Accept"', false, "lime").addEventListener("click", () => {
            giveQst(quest.lmfstkil1);
            global.flags.frst1u = true;
            giveItem(item.bstr);
            chs(
              '<span style="color:limegreen">Head Hunter Yamato</span>: Hunt down all the wolves you find and return once you destroy at least 35 of them. You will also want this, every hunter should keep his personal notes close. And prepare medicinal bandages, just in case. Be careful, and good luck',
              true,
            );
            chs('"<= Return"', false).addEventListener("click", () => {
              smove(chss.frstn1b1, false);
            });
          });
          chs('"Refuse"', false, "crimson").addEventListener("click", () => {
            smove(chss.frstn1b1, false);
          });
        }
      });
    } else if (quest.lmfstkil1.data.started) {
      if (quest.lmfstkil1.data.mkilled < 35) {
        chs(
          '<span style="color:limegreen">Head Hunter Yamato</span>: Having troubles with the task?',
          true,
        );
        chs('"<= Return"', false).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
        return;
      } else
        chs(
          '<span style="color:limegreen">Head Hunter Yamato</span>: What is that fire in your eyes? Can it be you are done already?',
          true,
        );
      chs('"Report the sounds you heard"', false, "lime").addEventListener(
        "click",
        () => {
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: That isn\'t good, sounds like trouble... Might have been the leader of the pack, furious about death of his underlings. This matter will need to be resolved quickly. As for you, go and have a good hard earned rest, you have done very well. Expect to be contacted later for further monster subjugation',
            true,
          );
          chs('"Accept the reward"', false, "lime").addEventListener(
            "click",
            () => {
              finishQst(quest.lmfstkil1);
              smove(chss.frstn1main);
            },
          );
        },
      );
    }
  }
  if (!quest.fwd1.data.done) {
    chs('"Firewood gathering"', false).addEventListener("click", () => {
      if (!quest.fwd1.data.started) {
        chs(
          '<span style="color:limegreen">Head Hunter Yamato</span>: While coal is not easy to obtain around here, good burnable wood is always in demand. Your job this time is to collect and bring about 10 bundles of firewood, keep an eye out while you\'re strolling out in the forest. Your deed will help the villagers, and you will get something out of it as well',
          true,
          "yellow",
        );
        chs('"Accept"', false, "lime").addEventListener("click", () => {
          giveQst(quest.fwd1);
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: Great! I will be awaiting your return',
            true,
          );
          chs('"<= Return"', false).addEventListener("click", () => {
            smove(chss.frstn1b1, false);
          });
        });
        chs('"Refuse"', false, "crimson").addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      } else {
        if (!item.fwd1.have)
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: If you find your task too difficult, go back to the training grounds',
            true,
          );
        else if (item.fwd1.amount < 10)
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: You found some already? You still need ' +
              (10 - item.fwd1.amount) +
              " more bundles of firewood to finish the task",
            true,
          );
        else
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: If you got requested firewood, turn it in',
            true,
          );
        if (item.fwd1.amount >= 10) {
          chs('"Hand over firewood"', false, "lime").addEventListener(
            "click",
            () => {
              reduce(item.fwd1, 10);
              chs(
                "<span style=\"color:limegreen\">Head Hunter Yamato</span>: Very good, you didn't disappoint. You can never have enough burning material, be it for cooking or warmth, or anything else. Here, this is for you. And some monetary compensation for the job well done. Oh, by the way, I'll buy any spare firewood off of you if you need some coin",
                true,
              );
              chs('"Accept the reward"', false, "lime").addEventListener(
                "click",
                () => {
                  finishQst(quest.fwd1);
                },
              );
            },
          );
        }
        chs('"<= Return"', false).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      }
    });
  }
  if (!quest.hnt1.data.done) {
    chs('"Hunting for meat"', false).addEventListener("click", () => {
      if (!quest.hnt1.data.started) {
        chs(
          '<span style="color:limegreen">Head Hunter Yamato</span>: If you want to survive, you will need to eat. Prove that you can handle yourself in the wilderness by hunting down wildlife. 10 piece of fresh meat should be enough, bring them to me for the evaluation',
          true,
          "yellow",
        );
        chs('"Accept"', false, "lime").addEventListener("click", () => {
          giveQst(quest.hnt1);
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: Great! I will be awaiting your return',
            true,
          );
          chs('"<= Return"', false).addEventListener("click", () => {
            smove(chss.frstn1b1, false);
          });
        });
        chs('"Refuse"', false, "crimson").addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      } else {
        if (!item.fwd1.have)
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: If you find your task too difficult, go back to the training grounds',
            true,
          );
        else if (item.rwmt1.amount < 10)
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: Oh, so you managed to hunt down some of the animals. You still need ' +
              (10 - item.rwmt1.amount) +
              " more chunks of meat to end he job. Hurry up before it goes bad!",
            true,
          );
        else
          chs(
            '<span style="color:limegreen">Head Hunter Yamato</span>: If you have everything already, leave it here',
            true,
          );
        if (item.rwmt1.amount >= 10) {
          chs('"Turn in raw meat"', false, "lime").addEventListener(
            "click",
            () => {
              reduce(item.rwmt1, 10);
              chs(
                '<span style="color:limegreen">Head Hunter Yamato</span>: Well done! Hunting down animals and stockpiling food that way is always a good precaution. Cooking or drying raw meat is generally a better idea than consuming it raw, give that a piece of mind if you\'re not sure what to do with the stuff you have.<br>All in all, you deserve a reward',
                true,
              );
              chs('"Accept the reward"', false, "lime").addEventListener(
                "click",
                () => {
                  finishQst(quest.hnt1);
                  smove(chss.frstn1b1, false);
                },
              );
            },
          );
        }
        chs('"<= Return"', false).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      }
    });
  }
  //blabla

  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.frstn1b1, false);
  });
};

chss.frstn1a1 = new Chs();
chss.frstn1a1.id = 114;
addtosector(sector.forest1, chss.frstn1a1);
chss.frstn1a1.sl = () => {
  global.flags.inside = false;
  d_loc("Western Woods, The Yellow Path");
  chs("The woods are silent", true);
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.frstn1main);
  });
};
chss.frstn1a1.onEnter = function () {
  area_init(area.frstn1a2);
};

chss.frstn1a2 = new Chs();
chss.frstn1a2.id = 115;
addtosector(sector.forest1, chss.frstn1a2);
chss.frstn1a2.sl = () => {
  global.lst_loc = 115;
  global.flags.inside = false;
  d_loc("Western Woods, The Underbushes");
  chs("You scavenged some goods from this forest area", true);
  chs('"=> Go further into the forest"', false).addEventListener(
    "click",
    () => {
      smove(chss.frstn2a1);
    },
  );
  if (global.flags.frstnscgr)
    chs('"\-\-> Enter the hidden path"', false, "grey").addEventListener(
      "click",
      () => {
        smove(chss.frstn1a4);
      },
    );
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.frstn1main);
  });
};
chss.frstn1a2.data = {
  scoutm: 320,
  scout: 0,
  scoutf: false,
  gets: [false],
  gotmod: 0,
};
chss.frstn1a2.scout = [
  {
    c: 0.008,
    f: () => {
      msg("You uncover a hidden passage!", "lime");
      global.flags.frstnscgr = true;
      smove(chss.frstn1a4);
      chss.frstn1a2.data.gets[0] = true;
    },
    exp: 66,
  },
];
chss.frstn1a2.onScout = function () {
  scoutGeneric(this);
};

chss.frstn2a1 = new Chs();
chss.frstn2a1.id = 120;
addtosector(sector.forest1, chss.frstn2a1);
chss.frstn2a1.sl = () => {
  global.flags.inside = false;
  d_loc("Western Woods, The Shaded Path");
  chs("The woods are silent", true);
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.frstn1main);
  });
};
chss.frstn2a1.onEnter = function () {
  area_init(area.frstn2a2);
};

chss.frstn3main = new Chs();
chss.frstn3main.id = 168;
chss.frstn3main.sl = () => {
  global.flags.inside = false;
  d_loc("Southern Forest, The Oaken Gate");
  global.lst_loc = 168;
  chs("The air here feels intimidating", true);
  chs('"=> Explore the depths"', false).addEventListener("click", () => {
    smove(chss.frstn9a1m);
  });
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

chss.frstn9a1m = new Chs();
chss.frstn9a1m.id = 169;
chss.frstn9a1m.sl = () => {
  global.flags.inside = false;
  d_loc("Southern Forest, The Foliage");
  global.lst_loc = 169;
  chs("This place looks dark", true);
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.frstn3main);
  });
};
chss.frstn9a1m.onEnter = function () {
  area_init(area.frstn9a1);
};

chss.lsmain1 = new Chs();
chss.lsmain1.id = 106;
addtosector(sector.vcent, chss.lsmain1);
addtosector(sector.vmain1, chss.lsmain1);
chss.lsmain1.sl = () => {
  global.flags.inside = false;
  d_loc("Village Center");
  global.lst_loc = 106;
  if (isWeather(weather.sunny) || isWeather(weather.clear))
    chs(
      "The surroundings are flourishing with life, nothing bad can happen",
      true,
    );
  else if (
    isWeather(weather.cloudy) ||
    isWeather(weather.overcast) ||
    isWeather(weather.stormy)
  )
    chs("You have a feeling it might rain soon", true);
  else if (
    isWeather(weather.storm) ||
    isWeather(weather.rain) ||
    isWeather(weather.drizzle)
  )
    chs("The rain feels surprisingly refreshing", true);
  else if (isWeather(weather.heavyrain) || isWeather(weather.thunder))
    chs(
      "It's pouring so hard the streets are completely flooded. There's noone around " +
        (getHour() > 6 && getHour() < 21 ? "except for a few kids" : ""),
      true,
    );
  else if (isWeather(weather.misty) || isWeather(weather.foggy))
    chs("Can't see a meter in front of you with all this fog", true);
  chs('"=> Check the Message Board"', false).addEventListener("click", () => {
    smove(chss.mbrd, false);
  });
  chs('"=> Enter Dojo"', false).addEventListener("click", () => {
    smove(chss.t3);
  });
  chs('"=> Enter Southern forest"', false).addEventListener("click", () => {
    if (!global.flags.frst1u)
      msg('Gate Guard: "Nothing for you to do there. Scram!"', "yellow");
    else {
      if (!global.flags.frst1um) {
        msg(
          'Gate Guard: "You were given permission to proceed. Go on"',
          "yellow",
        );
        global.flags.frst1um = true;
      }
      smove(chss.frstn3main);
    }
  });
  chs('"=> Enter Western Woods"', false).addEventListener("click", () => {
    if (you.lvl >= 6) smove(chss.frstn1main);
    else
      msg(
        'Gate Guard: "It is too dangerous for you to leave at this moment. Come back when you train a bit"',
        "yellow",
      );
  });
  //  chs('"=> Visit Pill Tower"',false).addEventListener('click',()=>{
  //    smove(chss.pltwr1);
  //  });
  if (global.flags.mkplc1u === true)
    chs('"=> Visit Marketplace"', false).addEventListener("click", () => {
      smove(chss.mrktvg1);
    });
  chs('"=> Go home"', false, "green").addEventListener("click", () => {
    smove(chss.home);
  });
  if (!global.flags.scrtgltt)
    chs('"=> Food stand"', false).addEventListener("click", () => {
      if (skl.trad.lvl >= 2 && random() < 0.2) global.flags.scrtglti = true;
      if (global.flags.scrtglti === true) {
        chs("...", true);
        chs("?", false).addEventListener("click", () => {
          chs(
            '"Passerby: Looking for the foodstand guy? He took his stuff and went South. That one supposedly travels from place to place to sell the food he makes, doubt we\'ll see him back any time soon"',
            true,
          );
          chs("Well then..", false).addEventListener("click", () => {
            global.flags.scrtgltt = true;
            smove(chss.lsmain1, false);
          });
        });
      } else smove(chss.vndr1, false);
    });
  if (random() < 0.15)
    chs('"=> Shady Kid"', false, "springgreen").addEventListener(
      "click",
      () => {
        smove(chss.vndrkd1, false);
      },
    );

  // chs('"test"',false,'red').addEventListener('click',()=>{
  //   chss.tst.sl();
  // });
  if (!global.flags.catget)
    chs('"=> Approach the cat"', false).addEventListener("click", () => {
      smove(chss.cat1);
      if (!global.stat.cat_c) global.stat.cat_c = 0;
    });
  if (!global.flags.mkplc1u) {
    if (
      global.flags.dj1end === true &&
      global.flags.pmfspmkm1 !== true &&
      random() < 0.4
    ) {
      chs("Paper Boy: Hey, this is for you!", true);
      chs("?", false).addEventListener("click", () => {
        giveItem(item.shppmf);
        smove(chss.lsmain1, false);
      });
    }
  }
};

chss.mrktvg1 = new Chs();
chss.mrktvg1.id = 127;
addtosector(sector.vmain1, chss.mrktvg1);
chss.mrktvg1.sl = () => {
  global.flags.inside = false;
  d_loc("Village Center, Marketplace");
  global.lst_loc = 127;
  chs("The marketplace feels busy", true);
  chs('"Grocery Shop =>"', false, "gold").addEventListener("click", () => {
    smove(chss.grc1);
  });
  chs('"General Store =>"', false, "gold").addEventListener("click", () => {
    smove(chss.gens1);
  });
  if (global.flags.phai1udt)
    chs('"Herbalist =>"', false, "gold").addEventListener("click", () => {
      smove(chss.pha1);
    });
  chs('"Nervous Guy =>"', false).addEventListener("click", () => {
    smove(chss.fdwrg1qt);
  });

  if (global.flags.grddtjb)
    chs('"Checkpoint"', false, "hotpink").addEventListener("click", () => {
      if (getHour() >= 7 && getHour() <= 10) {
        chs(
          "Lookout Guard: Here for work? You won't have to do much, just stand there near the gate and look intimidating. You're not doing any fighting if someone dangerous comes around, that would be dealth by Us, your militia. Your shift ends at 8PM, sign up now and go",
          true,
        );
        chs('"Alright..."', false).addEventListener("click", () => {
          if (getHour() >= 7 && getHour() <= 10) {
            giveQst(quest.grds1);
            smove(chss.jbgd1);
          } else {
            chs(
              "Lookout Guard: Too damn late, next time don't stand there like a decoration wasting everyone's time",
              true,
            );
            chs('"Ah..."', false).addEventListener("click", () => {
              smove(chss.lsmain1);
            });
          }
        });
        chs('"<= Maybe not"', false).addEventListener("click", () => {
          smove(chss.mrktvg1);
        });
      } else {
        chs(
          "Lookout Guard: If you want work come at the time that's stated in the notice and not a minute late!",
          true,
        );
        chs('"<= Return"', false).addEventListener("click", () => {
          smove(chss.mrktvg1);
        });
      }
    });
  chs('"<= Return back to the village Center"', false).addEventListener(
    "click",
    () => {
      smove(chss.lsmain1);
    },
  );
};
chss.mrktvg1.onEnter = function () {
  if (!timers.mktwawa1)
    timers.mktwawa1 = setInterval(function () {
      if (random() < 0.1) {
        if (!global.text.mktwawa1)
          global.text.mktwawa1 = [
            '<small>"...for that price? Are you cr..."</small>',
            '<small>"...no, go by yourself..."</small>',
            "<small>\"...right, I'll take " +
              rand(15) +
              ', put them in..."</small>',
            '<small>"...is this really?..."</small>',
            '<small>"...never seen this thing..."</small>',
            '<small>"...is this real?..."</small>',
            '<small>"...yeah, he said it\'s there..."</small>',
            '<small>"...mama!!..."</small>',
            '<small>"...right, coming next evening. You should probably p..."</small>',
            '<small>"...stop pushing!..."</small>',
            '<small>"...what a scam..."</small>',
            '<small>"...this isn\'t even fresh!..."</small>',
            '<small>"...why is this so expensive?..."</small>',
            '<small>"...I won\'t lower it further!..."</small>',
            '<small>"...I\'ll come back, just wait for a minute..."</small>',
            '<small>"...break time!..."</small>',
            '<small>"...who said so? Gotta be a lie..."</small>',
            '<small>"...whatever, I\'m not buying..."</small>',
            '<small>"...turn right and then..."</small>',
            '<small>"...check for yourself then..."</small>',
            '<small>"...she\'ll return shortly. As for you..."</small>',
            '<small>"...deal!..."</small>',
            '<small>"...try a different one..."</small>',
            '<small>"...buy it! You won\'t regret it!..."</small>',
            '<small>"Oh no! I dropped it in the forest!..."</small>',
          ];
        msg(
          select(global.text.mktwawa1),
          "rgb(" + rand(255) + "," + rand(255) + "," + rand(255) + ")",
        );
      }
    }, 1000);
};
chss.mrktvg1.onLeave = function () {
  clearInterval(timers.mktwawa1);
  delete timers.mktwawa1;
};

chss.jbgd1 = new Chs();
chss.jbgd1.id = 159;
chss.jbgd1.sl = () => {
  global.flags.inside = false;
  d_loc("Village Center, Marketplace Entry Gate");
  global.lst_loc = 159;
  const c = chs("You are standing on guard duty. This isn't very fun", true);
  global.flags.work = true;
  dom.trddots = addElement(c, "span");
  dom.trddots.frames = ["", ".", "..", "..."];
  dom.trddots.frame = 0;
  dom.trddots.style.position = "absolute";
  clearInterval(timers.rdngdots);
  timers.rdngdots = setInterval(() => {
    dom.trddots.innerHTML =
      dom.trddots.frames[
        (dom.trddots.frame = dom.trddots.frame > 2 ? 0 : ++dom.trddots.frame)
      ];
  }, 333);
  chs('"Be bored"', false).addEventListener("click", () => {
    msg(
      select([
        "Right...",
        "This is boring",
        "*whistle*",
        "Ah...",
        "...",
        "Yeah...",
        "Mhm...",
        "Yawn..",
      ]),
      "lightgrey",
    );
  });
};
chss.jbgd1.onEnter = function () {
  timers.job1t = setInterval(() => {
    if (getHour() >= 20) {
      msg(
        "Lookout Guard: Work's done for today, you have performed your duty just well and earned your salary, take it. You are advised to go straight home after you check out",
      );
      finishQst(quest.grds1);
      global.flags.work = false;
      clearInterval(this);
      smove(chss.home);
      global.flags.jcom++;
    } else {
      giveSkExp(skl.ptnc, 0.08);
      if (random() <= 0.01)
        msg(
          select([
            "Right...",
            "This is boring",
            "*whistle*",
            "Ah...",
            "...",
            "Yeah...",
            "Mhm...",
            "Yawn...",
          ]),
          "lightgrey",
        );
      if (random() <= 0.0005 + skl.seye.lvl * 0.0002) {
        msg("A passerby dropped a coin. Sweet!", "lime");
        giveItem(select([item.cp, item.lcn, item.cn, item.cd, item.cq]));
        giveSkExp(skl.seye, 20);
      }
    }
  }, 1000);
};
chss.jbgd1.onLeave = function () {
  clearInterval(timers.job1t);
  global.flags.work = false;
};

chss.fdwrg1qt = new Chs();
chss.fdwrg1qt.id = 165;
chss.fdwrg1qt.sl = () => {
  d_loc("Marketplace, Stalls");
  chs(
    '"<span style="color:cyan">Nervous Guy:</span> Argh, what am I gonna do now! How could this... Uh? S-sorry, can\'t talk right now, please leave me be. Ahh damn it..."<div style="color: darkgrey">The man then proceeds to fidget in unrest</div>',
    true,
  );
  chs('"<= Walk away"', false).addEventListener("click", () => {
    smove(chss.mrktvg1, false);
  });
};

chss.grc1 = new Chs();
chss.grc1.id = 128;
chss.grc1.effectors = [{ e: effector.shop }];
chss.grc1.sl = () => {
  global.flags.inside = true;
  d_loc("Marketplace, Grocery Shop");
  global.lst_loc = 128;
  chs(
    "Old Lady: " +
      select([
        "These are very fresh, buy some!",
        "Freshest vegetables for the lowest price!",
        "Try a few and you'll want even more!",
      ]),
    true,
  );
  chs('"Purchase"', false, "orange").addEventListener("click", () => {
    chs_spec(4, vendor.grc1);
    vendor.grc1.restocked = false;
    clearInterval(timers.vndrstkchk);
    timers.vndrstkchk = setInterval(function () {
      if (vendor.grc1.restocked === true) {
        clearInterval(timers.vndrstkchk);
        vendor.grc1.restocked = false;
        msg("We're restocking, step out for a minute");
        smove(chss.mrktvg1, false);
      }
    });
    chs('"<= Return"', false, "", "", null, null, null, true).addEventListener(
      "click",
      () => {
        smove(chss.grc1, false);
        clearInterval(timers.vndrstkchk);
      },
    );
  });
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.mrktvg1);
  });
};
chss.grc1.data = {
  scoutm: 200,
  scout: 0,
  scoutf: false,
  gets: [false],
  gotmod: 0,
};
chss.grc1.scout = [
  {
    c: 0.01,
    f: () => {
      msg(
        select([
          "You notice a coin on the ground!",
          "You pick a coin from under the counter",
          "You snatch a coin while no one is looking",
        ]),
        "lime",
      );
      giveItem(select([item.cp, item.cn, item.cq, item.cd]));
      chss.grc1.data.gets[0] = true;
    },
    exp: 5,
  },
];
chss.grc1.onScout = function () {
  scoutGeneric(this);
};

chss.gens1 = new Chs();
chss.gens1.id = 129;
chss.gens1.effectors = [{ e: effector.shop }];
chss.gens1.sl = () => {
  global.flags.inside = true;
  d_loc("Marketplace, Shabby General Store");
  global.lst_loc = 129;
  chs(
    "Sleeping Old Man: " +
      select([
        "...Welcome",
        "...",
        "zzz...",
        "A customer? Pick what you want",
        "Take your time",
      ]),
    true,
  );
  chs('"Purchase"', false, "orange").addEventListener("click", () => {
    chs_spec(4, vendor.gens1);
    vendor.gens1.restocked = false;
    clearInterval(timers.vndrstkchk);
    timers.vndrstkchk = setInterval(function () {
      if (vendor.gens1.restocked === true) {
        clearInterval(timers.vndrstkchk);
        vendor.gens1.restocked = false;
        msg("We're restocking, step out for a minute");
        smove(chss.mrktvg1, false);
      }
    });
    chs('"<= Return"', false, "", "", null, null, null, true).addEventListener(
      "click",
      () => {
        smove(chss.gens1, false);
        clearInterval(timers.vndrstkchk);
      },
    );
  });
  if (item.wvbkt.have)
    chs('"Sell straw baskets ' + dom.coincopper + '"', false).addEventListener(
      "click",
      () => {
        chs(
          "Sleeping Old Man: You made these, kid? Hahaha, alright, i'll take them off your hands. 15 " +
            dom.coincopper +
            " each!",
          true,
        );
        chs('"Sell your goods"', false, "lime").addEventListener(
          "click",
          () => {
            if (item.wvbkt.amount > 0) {
              giveWealth(item.wvbkt.amount * 15);
              item.wvbkt.amount = 0;
              removeItem(item.wvbkt);
              smove(chss.gens1, false);
            } else {
              smove(chss.gens1, false);
              msg("?");
            }
          },
        );
        chs('"<= Maybe next time"', false).addEventListener("click", () => {
          smove(chss.gens1, false);
        });
      },
    );
  if (area.hmbsmnt.size >= 1000 && global.flags.hbs1 && !global.flags.bmntsmkgt)
    chs("Infestation problem", false, "grey").addEventListener("click", () => {
      chs(
        "Sleeping Old Man: Your basement is in bad shape? Same been happening to the other folks lately, it's not just you. Something is drilling through the underground right into people's homes! And then you get a cellar full of rats. A complete travesty! Some speculate there's a monster cave nearby, but nothing was found yet. But don't fret, there is a solution for you - you smoke the pests out. Light this bag and toss it in, the deeper the better. Your entire place will be filled with smog, so you will have to leave and stay out for a few hours, then you'll have a clean and monster free basement at your disposal. 5 " +
          dom.coinsilver +
          " silver the price",
        true,
      );
      if (you.wealth >= SILVER * 5)
        chs('"Sounds good"', false, "lime").addEventListener("click", () => {
          if (you.wealth < SILVER * 5) return;
          spend(SILVER * 5);
          giveItem(item.bmsmktt);
          global.flags.bmntsmkgt = true;
          smove(chss.gens1, false);
        });
      chs('"<= Too expensive"', false).addEventListener("click", () => {
        smove(chss.gens1, false);
      });
    });
  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.mrktvg1);
  });
};
chss.gens1.data = {
  scoutm: 200,
  scout: 0,
  scoutf: false,
  gets: [false],
  gotmod: 0,
};
chss.gens1.scout = [
  {
    c: 0.01,
    f: () => {
      msg(
        select([
          "You notice a coin on the ground!",
          "You pick a coin from under the counter",
          "You snatch a coin while no one is looking",
        ]),
        "lime",
      );
      giveItem(select([item.cp, item.cn, item.cq, item.cd]));
      chss.gens1.data.gets[0] = true;
    },
    exp: 5,
  },
];
chss.gens1.onScout = function () {
  scoutGeneric(this);
};

chss.pha1 = new Chs();
chss.pha1.id = 166;
chss.pha1.effectors = [{ e: effector.shop }];
chss.pha1.sl = () => {
  global.flags.inside = true;
  d_loc("Marketplace, Herbalist");
  global.lst_loc = 166;
  chs(
    "Herbalist: " +
      select([
        "Injured? Come in, I'll give you a check up",
        "Yes yes..",
        "Don't neglect your well being, stack on anything you will need",
      ]),
    true,
  );
  chs('"Purchase"', false, "orange").addEventListener("click", () => {
    chs_spec(4, vendor.pha1);
    vendor.pha1.restocked = false;
    clearInterval(timers.vndrstkchk);
    timers.vndrstkchk = setInterval(function () {
      if (vendor.pha1.restocked === true) {
        clearInterval(timers.vndrstkchk);
        vendor.pha1.restocked = false;
        msg("We're restocking, step out for a minute");
        smove(chss.mrktvg1, false);
      }
    });
    chs('"<= Return"', false, "", "", null, null, null, true).addEventListener(
      "click",
      () => {
        smove(chss.pha1, false);
        clearInterval(timers.vndrstkchk);
      },
    );
  });
  if (item.hrb1.amount >= 50)
    chs('"Sell cure grass ' + dom.coincopper + '"', false).addEventListener(
      "click",
      () => {
        chs(
          "Herbalist: Yes indeed, if you have any cure grass to sell, by all means bring it here, you can never have too much. I will take bundles of 50 for 15 " +
            dom.coincopper,
          true,
        );
        chs('"Sell your goods"', false, "lime").addEventListener(
          "click",
          () => {
            if (item.hrb1.amount >= 50) {
              global.stat.hbhbsld++;
              giveWealth(15);
              item.hrb1.amount -= 50;
              reduce(item.hrb1);
              if (global.stat.hbhbsld >= 7 && !global.flags.hbhbgft) {
                chs(
                  "Herbalist: You were such a great help bringing all this cure grass to me! Take this, as a bonus",
                  true,
                );
                chs('"Accept"', false, "lime").addEventListener("click", () => {
                  giveItem(item.hptn1, 15);
                  giveItem(item.hptn2, 3);
                  vendor.pha1.data.rep =
                    vendor.pha1.data.rep + 10 > 100
                      ? 100
                      : vendor.pha1.data.rep + 10;
                  msg("The Herbalist likes you a bit more", "lime");
                  global.flags.hbhbgft = true;
                  smove(chss.pha1, false);
                  return;
                });
              }
              if (item.hrb1.amount < 50) smove(chss.pha1, false);
            } else {
              smove(chss.pha1, false);
              msg("?");
            }
          },
        );
        chs('"<= Rather not"', false).addEventListener("click", () => {
          smove(chss.pha1, false);
        });
      },
    );
  if (item.htrsvr.have)
    chs('"Deliver the bag"', false, "lightblue").addEventListener(
      "click",
      () => {
        chs(
          "Herbalist: And who might you be? Ohhhh, aren't you that dojo kid who's learning the art of hunting from the head himself? Come in come in, welcome! What is it you wish to deliver? Ah! Wonderful, excellent, this will last for plenty of time. Thank you for coming all this way in timely manner, you've been a great help. I will give you these to sample, as a reward, they will be useful to you. Oh, and one simple request, if you don't mind. Give this to him when you meet next time, it is very important that he gets it.",
          true,
        );
        chs('"I can do it!"', false).addEventListener("click", () => {
          removeItem(item.htrsvr);
          giveItem(item.atd1, 3);
          giveItem(item.hptn1, 10);
          giveItem(item.psnwrd);
          giveItem(item.hptn2);
          giveItem(item.hbtsvr);
          smove(chss.pha1);
        });
      },
    );

  chs('"<= Return back"', false).addEventListener("click", () => {
    smove(chss.mrktvg1);
  });
};
chss.pha1.data = {
  scoutm: 200,
  scout: 0,
  scoutf: false,
  gets: [false],
  gotmod: 0,
};
chss.pha1.scout = [
  {
    c: 0.01,
    f: () => {
      msg(
        select([
          "You notice a coin on the ground!",
          "You pick a coin from under the counter",
          "You snatch a coin while no one is looking",
        ]),
        "lime",
      );
      giveItem(select([item.cp, item.cn, item.cq, item.cd]));
      chss.pha1.data.gets[0] = true;
    },
    exp: 5,
  },
];
chss.pha1.onScout = function () {
  scoutGeneric(this);
};

chss.vndr1 = new Chs();
chss.vndr1.id = 116;
chss.vndr1.effectors = [{ e: effector.shop }];
addtosector(sector.vcent, chss.vndr1);
addtosector(sector.vmain1, chss.vndr1);
chss.vndr1.sl = () => {
  d_loc("Village Center, Street Food Stand");
  global.lst_loc = 116;
  vendor.stvr1.restocked = false;
  clearInterval(timers.vndrstkchk);
  timers.vndrstkchk = setInterval(function () {
    if (vendor.stvr1.restocked === true) {
      clearInterval(timers.vndrstkchk);
      vendor.stvr1.restocked = false;
      msg("We're restocking, step out for a minute");
      smove(chss.lsmain1, false);
    }
  });
  const hi = "Street Merchant Ran: Welcome! What would you like?";
  dom.vndr1 = chs(hi, true);
  for (let ost = 0; ost < vendor.stvr1.stock.length; ost++) {
    const itm = vendor.stvr1.stock[ost];
    dom.vndrs = chs(
      itm[0].name +
        ' <small style="color:rgb(255, 116, 63)">' +
        itm[2] +
        "●</small> x" +
        itm[1],
      false,
    );
    dom.vndrs.addEventListener("click", function () {
      if (you.wealth - itm[2] >= 0) {
        spend(itm[2]);
        mf(-itm[2], 1);
        m_update();
        giveItem(itm[0]);
        global.stat.buyt++;
        if (--itm[1] === 0) {
          clr_chs(vendor.stvr1.stock.indexOf(itm) + 1);
          vendor.stvr1.stock.splice(vendor.stvr1.stock.indexOf(itm), 1);
          empty(global.dscr);
          global.dscr.style.display = "none";
        } else
          this.innerHTML =
            itm[0].name +
            ' <small style="color:rgb(255, 116, 63)">' +
            itm[2] +
            "●</small> x" +
            itm[1];
      } else {
        clearTimeout(timers.shopcant);
        dom.vndr1.innerHTML = "Sorry you can't afford that!";
        timers.shopcant = setTimeout(() => {
          dom.vndr1.innerHTML = hi;
        }, 1000);
      }
    });
    addDesc(dom.vndrs, itm[0]);
  }
  chs('"<= Go back"', false).addEventListener("click", () => {
    smove(chss.lsmain1, false);
    clearInterval(timers.vndrstkchk);
  });
};

chss.vndrkd1 = new Chs();
chss.vndrkd1.id = 123;
chss.vndrkd1.shop = true;
addtosector(sector.vcent, chss.vndrkd1);
addtosector(sector.vmain1, chss.vndrkd1);
chss.vndrkd1.sl = () => {
  d_loc("Village Center, Child Trader");
  global.lst_loc = 123;
  vendor.kid1.restocked = false;
  clearInterval(timers.vndrstkchk);
  timers.vndrstkchk = setInterval(function () {
    if (vendor.kid1.restocked === true) {
      clearInterval(timers.vndrstkchk);
      vendor.kid1.restocked = false;
      msg("You, step out for a moment, I'm getting new stuff");
      smove(chss.lsmain1, false);
    }
  });
  const hi = "Hey, I've got some good stuff for you";
  dom.vndr1 = chs(hi, true);
  for (let ost = 0; ost < vendor.kid1.stock.length; ost++) {
    const itm = vendor.kid1.stock[ost];
    dom.vndrs = chs(
      itm[0].name +
        ' <small style="color:rgb(255, 116, 63)">' +
        itm[2] +
        "●</small> x" +
        itm[1],
      false,
    );
    dom.vndrs.addEventListener("click", function () {
      if (you.wealth - itm[2] >= 0) {
        spend(itm[2]);
        mf(-itm[2], 1);
        m_update();
        giveItem(itm[0]);
        global.stat.buyt++;
        if (--itm[1] === 0) {
          clr_chs(vendor.kid1.stock.indexOf(itm) + 1);
          vendor.kid1.stock.splice(vendor.kid1.stock.indexOf(itm), 1);
          empty(global.dscr);
          global.dscr.style.display = "none";
        } else
          this.innerHTML =
            itm[0].name +
            ' <small style="color:rgb(255, 116, 63)">' +
            itm[2] +
            "●</small> x" +
            itm[1];
      } else {
        clearTimeout(timers.shopcant);
        dom.vndr1.innerHTML = "Bring money next time";
        timers.shopcant = setTimeout(() => {
          dom.vndr1.innerHTML = hi;
        }, 1000);
      }
    });
    addDesc(dom.vndrs, itm[0]);
  }
  if (skl.fgt.lvl >= 5 && !global.flags.vndrkd1sp1)
    chs('"Show me something better"', false, "darkgrey").addEventListener(
      "click",
      () => {
        chs(
          "So you want something from the hidden stash, huh? Good eye! You are one of the dojo runts, I've got just what someone like you needs. One book, 3 silver" +
            dom.coinsilver +
            ". So, watcha say?",
          true,
        );
        chs('"Give me"', false, "lime").addEventListener("click", () => {
          if (you.wealth >= 300) {
            chs('"There ya go, enjoy"', true);
            global.flags.vndrkd1sp1 = true;
            giveItem(item.fgtsb1);
            spend(300);
            chs('"Sweet purchase!"', false).addEventListener("click", () => {
              smove(chss.lsmain1, false);
            });
          } else {
            chs("No money - no goods! Don't waste my time!", true);
            chs('"<= Go back"', false).addEventListener("click", () => {
              smove(chss.lsmain1, false);
            });
          }
        });
        chs('"<= Nah"', false, "Red").addEventListener("click", () => {
          chs("No worries, I'll keep it for you", true);
          chs('"<= Go back"', false).addEventListener("click", () => {
            smove(chss.lsmain1, false);
          });
        });
      },
    );
  else if (
    global.stat.moneyg >= 1000 &&
    !global.flags.vndrkd1sp2 &&
    global.flags.vndrkd1sp1
  )
    chs('"Show me something better"', false, "darkgrey").addEventListener(
      "click",
      () => {
        chs(
          "Alright, there's something else for you, snatched from some sleeping guy and I bet would be useful for you. Similar deal, 5 silver" +
            dom.coinsilver,
          true,
        );
        chs('"Yes please"', false, "lime").addEventListener("click", () => {
          if (you.wealth >= 500) {
            chs('"Deal successfully made"', true);
            global.flags.vndrkd1sp2 = true;
            giveItem(item.bfsnwt);
            spend(500);
            chs('"Score!"', false).addEventListener("click", () => {
              smove(chss.lsmain1, false);
            });
          } else {
            chs("No money - no goods! Don't waste my time!", true);
            chs('"<= Go back"', false).addEventListener("click", () => {
              smove(chss.lsmain1, false);
            });
          }
        });
        chs('"<= Nah"', false, "Red").addEventListener("click", () => {
          chs("No worries, I'll keep it for you", true);
          chs('"<= Go back"', false).addEventListener("click", () => {
            smove(chss.lsmain1, false);
          });
        });
      },
    );
  chs('"<= Go back"', false).addEventListener("click", () => {
    smove(chss.lsmain1, false);
  });
};
chss.vndrkd1.onLeave = function () {
  clearInterval(timers.vndrstkchk);
};

chss.tstauto = new Chs();
chss.tstauto.id = -1;
chss.tstauto.sl = () => {
  d_loc("Test auto");
  global.lst_loc = -1;
  dom.testauto = chs("TEST", true);
  if (!global.flags.testauto_1 || global.flags.testauto_1 === false)
    chs("Run", false).addEventListener("click", () => {
      global.flags.testauto_1 = true;
      timers.testauto1 = setInterval(() => {
        dom.testauto.innerHTML = rand(9999999);
      }, 1000);
      chss.tstauto.sl();
    });
  else
    chs("Stop", false).addEventListener("click", () => {
      global.flags.testauto_1 = false;
      chss.tstauto.sl();
      clearInterval(timers.testauto1);
    });
  chs('"<= Go back"', false).addEventListener("click", () => {
    chss.lsmain1.sl();
  });
};

chss.tst = new Chs();
chss.tst.id = -1;
chss.tst.sl = () => {
  d_loc("Test");
  global.lst_loc = -1;
  dom.tst = chs("TEST", true);
  global.flags.btl = true;
  global.flags.civil = false;
  area_init(area.tst);
  chs('"<= Go back"', false).addEventListener("click", () => {
    chss.lsmain1.sl();
  });
};

chss.cat1 = new Chs();
chss.cat1.id = 107;
addtosector(sector.vcent, chss.cat1);
addtosector(sector.vmain1, chss.cat1);
chss.cat1.sl = () => {
  d_loc("Village Center, Cat"); //global.lst_loc = 107;
  const w = !global.stat.cat_c
    ? chs("There is a cat.", true)
    : chs("There is a cat. Pets: " + global.stat.cat_c, true);
  chs('"Pet the cat"', false).addEventListener("click", (x) => {
    const a = addElement(document.body, "span");
    a.style.pointerEvents = "none";
    a.style.position = "absolute";
    a.style.color = "lime";
    a.innerHTML = select([":3", "'w'", "'ω'", "(=・∀・=)", "*ﾟヮﾟ"]);
    a.style.top = -55;
    a.style.left = -55;
    a.style.fontSize = "1.25em";
    a.style.textShadow = "2px 2px 1px blue";
    a.posx = x.clientX - 20;
    a.posy = x.clientY - 20;
    a.spos = randf(-1, 1);
    let t = 0;
    const g = setInterval(() => {
      t++;
      a.style.top = a.posy - 2 * t;
      a.style.left = a.posx + Math.sin(t / 5 + a.spos) * 15;
      a.style.opacity = (110 - t) / 110;
      if (t === 110) {
        clearInterval(g);
        document.body.removeChild(a);
      }
    }, 20);
    global.stat.cat_c++;
    if (global.stat.cat_c < 333) skl.pet.use();
    w.innerHTML = "There is a cat. Pets: " + global.stat.cat_c;
    if (global.stat.cat_c >= 100) {
      if (!global.flags.cat_g) {
        clr_chs(2);
        global.flags.cat_g = true;
        chs('"???"', false).addEventListener("click", () => {
          chs("Cat wants to tag along", true);
          chs('"Take it with you"', false).addEventListener("click", () => {
            const cat = giveFurniture(furniture.cat, true, false);
            cat.data.sex = rand(1);
            cat.data.c = rand(global.text.cfc.length - 1);
            cat.data.p = rand(global.text.cfp.length - 1);
            cat.data.l1 = rand(global.text.cln.length - 1);
            let tg = rand(global.text.cln.length - 1);
            do {
              tg = rand(global.text.cln.length - 1);
            } while (tg === cat.data.l1);
            cat.data.l2 = rand(global.text.cln.length - 1);
            global.flags.catget = true;
            msg("The cat decided to move into your house!", "lime");
            smove(chss.lsmain1);
          });
          chs('"Leave it as is"', false).addEventListener("click", () => {
            smove(chss.lsmain1);
          });
        });
        chs('"<= Return"', false).addEventListener("click", () => {
          smove(chss.lsmain1);
        });
      }
    }
  });
  if (global.stat.cat_c >= 100) {
    chs('"???"', false).addEventListener("click", () => {
      chs("Cat wants to tag along", true);
      chs('"Take it with you"', false).addEventListener("click", () => {
        const cat = giveFurniture(furniture.cat, true, false);
        cat.data.sex = rand(1);
        cat.data.c = rand(global.text.cfc.length - 1);
        cat.data.p = rand(global.text.cfp.length - 1);
        cat.data.l1 = rand(global.text.cln.length - 1);
        let tg = rand(global.text.cln.length - 1);
        do {
          tg = rand(global.text.cln.length - 1);
        } while (tg === cat.data.l1);
        cat.data.l2 = rand(global.text.cln.length - 1);
        global.flags.catget = true;
        msg("The cat decided to move into your house!", "lime");
        smove(chss.lsmain1);
      });
      chs('"Leave it as is"', false).addEventListener("click", () => {
        smove(chss.lsmain1);
      });
    });
  }
  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

global.text.mbrdtt = [
  '"If you do not work your hours daily, you will not get any dessert"',
  '"Do your job well and you will be rewarded"',
  "There is a report of a missing cat",
  "There is a section of useless gossip",
  "This is an  advertisement for fresh vegetables",
  "This is an advertisement for dojo membership",
  "This is an advertisement for wooden furniture",
  "This is an advertisement for dried meat",
  "This is an advertisement for joining the militia",
  '"The Hunter Association offers you a large variety of boxes full of smoked meat and furs"',
  "This is an advertisement for herbal medicine",
  "This is an advertisement for wine kegs",
  "This is an advertisement for farming equipment",
  "This is an advertisement for carpentery supplies",
  '"All the children must return home by 8PM!"',
  "This is an advertisement for smithing orders",
  "This is an advertisement for cooking courses",
  "This is an advertisement for bottled water",
  "This is an advertisement for knitting advices",
  "This is an advertisement for cleaning services",
  "This is a warning to stay away from fortune tellers",
  "This is an advertisement for woven straw baskets",
  "This is an advertisement for hemp clothing",
];

chss.mbrd = new Chs();
chss.mbrd.id = 108;
addtosector(sector.vcent, chss.mbrd);
addtosector(sector.vmain1, chss.mbrd);
chss.mbrd.sl = () => {
  d_loc("Village Center, Message Board");
  global.lst_loc = 108;
  for (const a in inv)
    if (
      inv[a].id === acc.wdl1.id ||
      inv[a].id === acc.sdl1.id ||
      inv[a].id === acc.bdl1.id ||
      inv[a].id === acc.gdl1.id
    ) {
      if (
        !global.flags.glqtdltn &&
        getHour() < 20 &&
        getHour() > 8 &&
        random() < 0.15
      ) {
        {
          chs(
            "You notice a little girl with emerald green hair approach you",
            true,
          );
          chs('"?"', false).addEventListener("click", () => {
            chs(
              '<span style="color:lime">Xiao Xiao</span>: "Hey, hey, what are those dolls you carry? Make one for me!!"',
              true,
            );
            chs('"Alright..."', false).addEventListener("click", () => {
              global.flags.glqtdltn = true;
              smove(chss.mbrd, false);
            });
          });
        }
        return;
      }
      break;
    }
  chs("Message Board<br>You can find jobs or other stuff here", true);
  chs('"Explore the posts"', false).addEventListener("click", () => {
    chs(select(global.text.mbrdtt), true);
    chs('"<= Return"', false).addEventListener("click", () => {
      smove(chss.mbrd, false);
    });
  });
  if (global.flags.frstn1b1g1) {
    chs('"Notice #4"', false).addEventListener("click", () => {
      chs(
        'It says here:<br><span style="color:orange">Looking for a anyone with free time to assist local militia with guarding duty. Apply at the checkpoint near marketplace area between 7AM and 10AM"</span>',
        true,
      );
      chs('"Huh.."', false).addEventListener("click", () => {
        global.flags.grddtjb = true;
        smove(chss.mbrd);
      });
    });
    chs('"Warning!"', false).addEventListener("click", () => {
      chs(
        'Dangerous beasts were sighted in vicinity of the Southern Forest. These reports are likely linked to the cause of livestock and locals getting injured, therefore, to avoid further casualties, entry into the forest is prohibited to those without permit or high enough self-defence ability until the situation is resolved<br><br><div style="text-align:right">一Head of The Guard, Hitoshi</div>',
        true,
      );
      chs('"I see"', false).addEventListener("click", () => {
        smove(chss.mbrd);
      });
    });
  }
  if (
    global.flags.glqtdltn &&
    !global.flags.glqtdldn &&
    getHour() < 20 &&
    getHour() > 8
  ) {
    chs('"Xiao Xiao =>"', false).addEventListener("click", () => {
      smove(chss.xpgdqt1, false);
    });
  }
  chs('"<= Go back"', false).addEventListener("click", () => {
    smove(chss.lsmain1, false);
  });
};

chss.xpgdqt1 = new Chs();
chss.xpgdqt1.id = 167;
addtosector(sector.vcent, chss.xpgdqt1);
addtosector(sector.vmain1, chss.xpgdqt1);
chss.xpgdqt1.sl = () => {
  d_loc("Village Center, Message Board");
  global.lst_loc = 166;
  chs(
    '<span style="color:lime">Xiao Xiao</span>: "What is it what is it?"',
    true,
  );
  const dl1 = findbyid(inv, acc.wdl1.id);
  const dl2 = findbyid(inv, acc.sdl1.id);
  const dl3 = findbyid(inv, acc.bdl1.id);
  const dl4 = findbyid(inv, acc.gdl1.id);
  if (dl1) {
    chs('"Show Xiao Xiao a wooden doll"', false).addEventListener(
      "click",
      () => {
        chs(
          '<span style="color:lime">Xiao Xiao</span>: "Nooooo it\'s ugly!!"',
          true,
        );
        chs('"<= Take it back"', false).addEventListener("click", () => {
          smove(chss.xpgdqt1, false);
        });
      },
    );
  }
  if (dl2) {
    chs('"Show Xiao Xiao a straw doll"', false).addEventListener(
      "click",
      () => {
        chs(
          '<span style="color:lime">Xiao Xiao</span>: "Nooooo it\'s creepy!!"',
          true,
        );
        chs('"<= Take it back"', false).addEventListener("click", () => {
          smove(chss.xpgdqt1, false);
        });
      },
    );
  }
  if (dl3) {
    chs('"Show Xiao Xiao a bone doll"', false).addEventListener("click", () => {
      chs(
        '<span style="color:lime">Xiao Xiao</span>: "Nooooo it\'s scary!!"',
        true,
      );
      chs('"<= Take it back"', false).addEventListener("click", () => {
        smove(chss.xpgdqt1, false);
      });
    });
  }
  if (dl4) {
    chs('"Show Xiao Xiao a soul doll"', false).addEventListener("click", () => {
      chs(
        '<span style="color:lime">Xiao Xiao</span>: "Waai thank you! I love it! I\'ll give you this! Here, take!"<br><br><span style="color:lightgrey">The girl happily runs away with her new toy</span>',
        true,
      );
      chs('"Claim your hardearned reward"', false).addEventListener(
        "click",
        () => {
          removeItem(dl4);
          global.flags.glqtdldn = true;
          global.offline_evil_index -= 0.002;
          msg("You feel more peaceful", "gold");
          giveItem(acc.ubrlc);
          smove(chss.mbrd, false);
        },
      );
    });
  }
  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.mbrd, false);
  });
};

chss.trd = new Chs();
chss.trd.id = 109;
chss.trd.sl = function (b, x) {
  global.flags.rdng = true;
  const rd = skl.rdg.use();
  b.data.timep = b.data.timep || 0;
  b.cmax =
    (b.data.time * (1 / (1 + rd / 10))) / you.mods.rdgrt -
    (1 / (1 + rd / 10) - 1) / you.mods.rdgrt;
  let c = b.cmax - b.data.timep;
  if (c < 0) c = 0;
  let ttxt;
  if (c > HOUR) ttxt = ((c / HOUR) << 0) + "</span> hours to finish";
  else ttxt = (c << 0) + "</span> minutes to finish";
  dom.trdc = chs("", true);
  dom.trd = addElement(dom.trdc, "span");
  dom.trd.innerHTML =
    'You are reading <span style="color:orange">' +
    b.name +
    '</span><br>It will take you about <span style="color:lime">' +
    ttxt;
  dom.trddots = addElement(dom.trdc, "span");
  dom.trddots.frames = ["", ".", "..", "..."];
  dom.trddots.frame = 0;
  dom.trddots.style.position = "absolute";
  timers.rdngdots = setInterval(() => {
    dom.trddots.innerHTML =
      dom.trddots.frames[
        (dom.trddots.frame = dom.trddots.frame > 2 ? 0 : ++dom.trddots.frame)
      ];
  }, 333);
  timers.rdng = setInterval(() => {
    global.stat.rdgtttl++;
    const rd = skl.rdg.use();
    giveSkExp(skl.rdg, x || 1);
    b.cmax =
      (b.data.time * (1 / (1 + rd / 10))) / you.mods.rdgrt -
      (1 / (1 + rd / 10) - 1) / you.mods.rdgrt;
    let c = b.cmax - b.data.timep;
    if (c < 0) c = 0;
    let ttxt;
    if (c > HOUR) ttxt = ((c / HOUR) << 0) + "</span> hours to finish";
    else ttxt = (c << 0) + "</span> minutes to finish";
    dom.trd.innerHTML =
      'You are reading <span style="color:orange">' +
      b.name +
      '</span><br>It will take you about <span style="color:lime">' +
      ttxt;
    if (++b.data.timep >= b.cmax) {
      clearInterval(timers.rdng);
      clearInterval(timers.rdngdots);
      global.stat.rdttl++;
      global.flags.rdng = false;
      for (const gg in chss) if (chss[gg].id === global.lst_loc) chss[gg].sl();
      b.use();
      reduce(b);
      b.data.timep = 0;
    }
  }, 1000);
  chs('"Stop reading"', false).addEventListener("click", () => {
    clearInterval(timers.rdng);
    clearInterval(timers.rdngdots);
    global.flags.rdng = false;
    for (const gg in chss) if (chss[gg].id === global.lst_loc) chss[gg].sl();
  });
};

chss.home = new Chs();
chss.home.id = 111;
addtosector(sector.home, chss.home);
chss.home.sl = () => {
  d_loc("Your Home");
  global.lst_loc = 111;
  if (!global.flags.catget || sector.home.data.smkp > 0)
    chs("Your humble abode. You can rest here. ", true);
  else {
    if (!global.text.hmcttt)
      global.text.hmcttt = [
        "Your cat comes out to greet you!",
        "",
        "You hear rustling",
        "Meow",
      ];
    chs(
      "You feel safe. You can rest here. " + select(global.text.hmcttt),
      true,
    );
  }
  if (!global.flags.hbgget)
    chs('"Examine your bag"', false).addEventListener("click", () => {
      chs(
        "Something you've forgotten to grab before. There's a pack of food and some junk idea paper.",
        true,
      );
      chs("Better take this with you", false).addEventListener("click", () => {
        global.flags.hbgget = true;
        giveItem(eqp.bnd);
        giveItem(item.ip1);
        giveItem(item.watr, 10);
        giveItem(wpn.wsrd1);
        giveItem(item.eggn, 3);
        giveItem(item.mlkn, 2);
        giveItem(item.rice, 5);
        giveItem(item.brd, 50);
        smove(chss.home, false);
      });
    });
  chs('"Crash down and take a nap"', false).addEventListener("click", () => {
    if (sector.home.data.smkp > 0) {
      msg("This isn't time for sleep", "red");
      return;
    }
    smove(chss.hbed, false);
  });
  if (!global.flags.chbdfst)
    chs('"Examine your hidden stash"', false).addEventListener("click", () => {
      chs(
        "You reach for a small red box which you keep your valuables in, it is time to take it out",
        true,
      );
      chs("Grab the contents", false).addEventListener("click", () => {
        giveItem(item.ywlt);
        giveItem(item.pdeedhs);
        global.flags.chbdfst = true;
        smove(chss.home, false);
      });
    });
  chs(
    global.flags.hbs1 === true
      ? '"Enter the basement"'
      : '"Examine basement door"',
    false,
  ).addEventListener("click", () => {
    if (!global.flags.hbs1) {
      if (item.key0.have) {
        msg("*click...* ", "lightgrey");
        msg_add("The door has opened", "lime");
        global.flags.hbs1 = true;
        smove(chss.home, false);
      } else msg("It's locked");
    } else smove(chss.bsmnthm1, false);
  });
  if (global.flags.hsedchk)
    chs(' "Furniture list"', false, "orange", "", 1, 8).addEventListener(
      "click",
      () => {
        chs_spec(2);
        global.wdwidx = 1;
        chs('"<= Return"', false).addEventListener("click", () => {
          smove(chss.home, false);
        });
      },
    );
  if (scanbyid(furn, furniture.frplc.id)) {
    chs('"Examine Fireplace"', false).addEventListener("click", () => {
      smove(chss.ofrplc, false);
    });
  }
  if (scanbyid(furn, furniture.strgbx.id)) {
    chs('"Access Storagebox"', false).addEventListener("click", () => {
      smove(chss.sboxhm, false);
    });
  }
  if (global.flags.catget) {
    tcat = findbyid(furn, furniture.cat.id);
    tcat.data.mood = tcat.data.mood || 1;
    chs('"Check on Cat"', false).addEventListener("click", () => {
      if (sector.home.data.smkp > 0) {
        msg("Your cat went outside", "yellow");
        return;
      }
      chs_spec(1);
      if (tcat.data.named === false)
        chs('"Rename"', false).addEventListener("click", () => {
          chs(
            "Give your cat a name!<br><small>(can't rename later!)</small>",
            true,
          );
          const inp = addElement(dom.ctr_2, "input", "chs");
          inp.style.textAlign = "center";
          inp.style.color = "white";
          inp.style.fontFamily = "MS Gothic";
          chs('"Accept"', false, "lime").addEventListener("click", () => {
            if (inp.value == "" || inp.value.search(/ *$/) === 0)
              msg("Actually give it a name, maybe?", "springgreen");
            else if (inp.value.search(/[Kk][Ii][Rr][Ii]/) === 0) {
              msg("Hey now! o:<", "crimson");
              dom.gmsgs.children[1].lastChild.style.fontSize = "2em";
            } else {
              tcat.data.name = inp.value;
              tcat.data.named = true;
            }
            smove(chss.home, false);
          });
          chs('"Decline"', false, "red").addEventListener("click", () => {
            smove(chss.home, false);
          });
        });
      dom.ctspcl = chs('"Pet ' + tcat.data.name + '"', false);
      dom.ctspcl.addEventListener("click", (x) => {
        const a = addElement(document.body, "span");
        global.stat.cat_c++;
        for (const x in global.cptchk) global.cptchk[x]();
        a.style.pointerEvents = "none";
        a.style.position = "absolute";
        a.style.color = "lime";
        a.innerHTML =
          tcat.data.mood > 0.2
            ? select([":3", "'w'", "'ω'", "(=・∀・=)", "*ﾟヮﾟ"])
            : select(["¦3", "ーωー", "( ˘ω˘)", "(´-ω-`)", "(。-∀-)"]);
        a.style.top = -55;
        a.style.left = -55;
        a.style.fontSize = "1.25em";
        a.style.textShadow = "2px 2px 1px blue";
        a.posx = x.clientX - 20;
        a.posy = x.clientY - 20;
        a.spos = randf(-1, 1);
        let t = 0;
        const g = setInterval(() => {
          t++;
          a.style.top = a.posy - 2 * t;
          a.style.left = a.posx + Math.sin(t / 5 + a.spos) * 15;
          a.style.opacity = (110 - t) / 110;
          if (t === 110) {
            clearInterval(g);
            document.body.removeChild(a);
          }
        }, 20);
        tcat.data.mood = tcat.data.mood - 0.01 <= 0 ? 0 : tcat.data.mood - 0.01;
        if (tcat.data.mood >= 0.01) skl.pet.use();
      });
      chs('"<= Return"', false).addEventListener("click", () => {
        smove(chss.home, false);
        clearInterval(timers.caupd);
      });
    });
  }
  chs('"<= Go outside"', false).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

chss.home.data = {
  scoutm: 1200,
  scout: 0,
  scoutf: false,
  gets: [false, false],
  gotmod: 0,
};
chss.home.scout = [
  {
    c: 0.006,
    f: () => {
      msg("Oh, you forgot you had this around", "orange");
      giveItem(wpn.kiknif);
      chss.home.data.gets[0] = true;
    },
    exp: 30,
  },
  {
    c: 0.01,
    f: () => {
      msg("There was a coin stuck between the floor boards", "orange");
      giveItem(item.lcn);
      chss.home.data.gets[1] = true;
    },
    exp: 3,
  },
];
chss.home.onScout = function () {
  scoutGeneric(this);
};

global.text.bssel = [
  "Ack! There's dust and cobweb everywhere in this place",
  "Spiderweb lands on your face as you enter",
  "Various broken garbage is littered around",
  "You step on some glass shards and crush them",
];
global.text.bsseldark = [
  "Ack! Something touches you from the darkness",
  "You step in and something crunches underneath",
  "You feel like something moved in front of you",
  "You touched cobweb and felt gross",
];

chss.bsmnthm1 = new Chs();
chss.bsmnthm1.id = 158;
addtosector(sector.home, chss.bsmnthm1);
chss.bsmnthm1.effectors = [{ e: effector.dark }];
chss.bsmnthm1.sl = () => {
  d_loc("Your Home, Basement");
  global.lst_loc = 158;
  if (area.hmbsmnt.size > 0) {
    chs("Argh! This place is infested!", true, "red");
    area_init(area.hmbsmnt);
  } else {
    if (!cansee())
      chs(
        select(global.text.bsseldark) +
          ". You can't see anything in this darkness, it'll be better if you find a lightsource",
        true,
        "darkgrey",
      );
    else {
      chs(select(global.text.bssel), true);
      if (!global.flags.bsmntchck)
        chs('"Examine your surroundings"', false).addEventListener(
          "click",
          () => {
            if (!cansee()) {
              chs("Your light went off..", true, "darkgrey");
              chs('"<= Return"', false).addEventListener("click", () => {
                smove(chss.home, false);
              });
            } else {
              chs(
                "You glance around and find mountains of broken crates, shelves, boxes, furniture and other decaying goods. Don't expect to find anything of great value amongst this trash. Perhaps you can salvage at least something if you look careful enough" +
                  (!global.flags.bsmntchstgt
                    ? ", like that giant chest over there"
                    : ""),
                true,
                "orange",
              );
              if (!global.flags.bsmntchstgt)
                chs(
                  '"Seek significance of a massive container"',
                  false,
                ).addEventListener("click", () => {
                  chs(
                    "It looks like an ordinary coffer, except it's unusually big and has a padlock, which thankfully isn't locked. You get a brilliant idea to carry this hunk-a-junk upstairs",
                    true,
                  );
                  chs('"Do exactly that"', false, "lime").addEventListener(
                    "click",
                    () => {
                      global.flags.bsmntchstgt = true;
                      giveFurniture(furniture.strgbx);
                      smove(chss.home, false);
                      msg(
                        "Phew! That felt like a workout! You won't need to descend into that awful basement anymore if you wish to access the Big Box",
                        "orange",
                      );
                      msg("Your muscles feel stronger!", "lime");
                      msg("STR increased by +1 permanently", "lime");
                      you.sat *= 0.5;
                      you.stra++;
                      you.stat_r();
                    },
                  );
                });
              if (!global.flags.bsmntsctgt)
                chs('"Rummage through rubble"', false).addEventListener(
                  "click",
                  () => {
                    chs(
                      "Indeed, simply glancing over the rubble won\'t reveal you any hidden secrets, you think you better investigate everything carefully",
                      true,
                    );
                    chs(
                      '"Prepare for further examination"',
                      false,
                    ).addEventListener("click", () => {
                      global.flags.bsmntsctgt = true;
                      giveAction(act.scout);
                      global.current_a.deactivate();
                      global.current_a = act.default;
                      smove(chss.bsmnthm1, false);
                    });
                  },
                );
              chs('"<= Return"', false).addEventListener("click", () => {
                smove(chss.bsmnthm1, false);
              });
            }
          },
        );
    }
  }
  chs('"<= Return"', false).addEventListener("click", () => {
    smove(chss.home, false);
  });
};
chss.bsmnthm1.data = {
  scoutm: 900,
  scout: 0,
  scoutf: false,
  gets: [false, false],
  gotmod: 0,
};
chss.bsmnthm1.scout = [
  {
    c: 0.01,
    f: () => {
      msg("You found a pouch with some coins!", "lime");
      giveItem(item.cp, rand(1, 5));
      giveItem(item.cn, rand(1, 5));
      giveItem(item.cq, rand(1, 5));
      chss.bsmnthm1.data.gets[0] = true;
    },
    exp: 40,
  },
  {
    c: 0.03,
    f: () => {
      msg(
        "You found a pile of scattered firewood, some logs seem useful but others have rotted completely. You decide to grab them anyway",
      );
      giveItem(item.fwd1, rand(2, 4));
      giveItem(item.wdc, (45, 90));
      chss.bsmnthm1.data.gets[1] = true;
    },
    exp: 10,
  },
  {
    c: 0.03,
    f: () => {
      chs(
        "Among the rabble and remains of collapsed bookshelves you decide to confirm if anything survived. Rotten and soaked in basement juices books seems unsalvagable, bookshelves as well, you can't even tell if they are made of wood anymore. One of the books was incased into a small mound formed by rocks and sand, it seems surprisingly fine",
        true,
      );
      chs('"<= I\'m taking this"', false).addEventListener("click", () => {
        chss.bsmnthm1.data.gets[2] = true;
        giveItem(item.jnlbk);
        deactivateAct(global.current_a);
        smove(chss.bsmnthm1, false);
      });
    },
    exp: 15,
  },
];
chss.bsmnthm1.onScout = function () {
  scoutGeneric(this);
};

chss.hbed = new Chs();
chss.hbed.id = 112;
addtosector(sector.home, chss.hbed);
chss.hbed.sl = () => {
  d_loc("Your Home, Bed");
  global.lst_loc = 112;
  let extra = "";
  if (you.alive === false) {
    chs(
      select([
        "You lost consciousness...",
        "You have been knocked out...",
        "You passed out...",
      ]),
      true,
    );
    you.alive = true;
  } else {
    if (global.flags.catget)
      extra = select([". Your cat is resting next to you", ". You feel warm"]);
    chs("Great way to pass time" + extra, true);
  }
  chs('"<= Get up"', false).addEventListener("click", () => {
    for (const i in chss) if (chss[i].id === global.home_loc) smove(chss[i]);
  });
};
chss.hbed.onStay = function () {
  const hpr =
    (skl.sleep.use(home.bed) + (global.flags.catget ? 5 : 1) + 1) << 0;
  if (!effect.fei1.active && you.hp < you.hpmax) {
    you.hp + hpr <= you.hpmax ? (you.hp += hpr) : (you.hp = you.hpmax);
    dom.d5_1_1.update();
  }
  // if(global.current_z.id!==-666&&random()<.00001){
  //   let ta = new Area(); ta.id=-666;
  //   ta.name = 'Nightmare';
  //   ta.pop = [{crt:creature.ngtmr1,lvlmin:you.lvl,lvlmax:you.lvl,c:1}]; ta.protected=true;
  //   ta.onEnd=function(){area_init(area.nwh);global.flags.civil=true; global.flags.btl=false;}; global.flags.civil=false; global.flags.btl=true;
  //   ta.size = 1; z_bake(ta); area_init(ta); dom.d7m.update(); msg('Your sins are crawling up on you','red')
  //}
};
chss.hbed.onEnter = function () {
  global.flags.sleepmode = true;
  if (effect.slep.active === false) giveEff(you, effect.slep);
  global.timescale = 5;
};
chss.hbed.onLeave = function () {
  global.flags.sleepmode = false;
  global.timescale = 1;
  removeEff(effect.slep);
};

chss.ofrplc = new Chs();
chss.ofrplc.id = 117;
addtosector(sector.home, chss.ofrplc);
chss.ofrplc.sl = () => {
  d_loc("Your Home, Fireplace");
  const fire = findbyid(furn, furniture.frplc.id);
  global.lst_loc = 117;
  //dom.d_lctt.innerHTML+='<span style="color:orange;font-size:1.2em">&nbspⓞ<span>'
  const its = [];
  if (findbyid(inv, item.fwd1.id))
    its.push([findbyid(inv, item.fwd1.id), "some firewood", 30]);
  if (findbyid(inv, item.coal1.id))
    its.push([findbyid(inv, item.coal1.id), "some coal", 300]);
  if (findbyid(inv, item.coal2.id))
    its.push([findbyid(inv, item.coal2.id), "some charcoal", 300]);
  if (findbyid(inv, wpn.stk1.id))
    its.push([findbyid(inv, wpn.stk1.id), "a stick", 15]);
  if (!global.text.fplcextra)
    global.text.fplcextra = [
      "You'll need fire if you want to get some cooking done",
      "You can warm up here if you light it up",
    ];
  if (!global.text.frplcfrextra)
    global.text.frplcfrextra = [
      "You notice the fire flickering slightly",
      "Tiny fire is warming up the room",
      "Comfy fire lights up the surroundings",
      "Bright flame is roaring inside the Fireplace",
    ];
  let textra0;
  if (fire.data.fuel === 0) textra0 = "";
  else if (fire.data.fuel <= 60) textra0 = global.text.frplcfrextra[0];
  else if (fire.data.fuel >= 130 && fire.data.fuel <= 300)
    textra0 = global.text.frplcfrextra[1];
  else if (fire.data.fuel >= 300 && fire.data.fuel <= 540)
    textra0 = global.text.frplcfrextra[2];
  else if (fire.data.fuel >= 540) textra0 = global.text.frplcfrextra[3];
  dom.frpls = chs(
    "Comfy fireplace. " + (select(global.text.fplcextra) + "<br>" + textra0),
    true,
  );
  if (!global.flags.fplcgtwd)
    chs(
      '"Retrieve spare firewood. You have a feeling you\'ll need it"',
      false,
    ).addEventListener("click", function () {
      msg("You have some lying around nearby", "orange");
      global.flags.fplcgtwd = true;
      giveItem(item.fwd1, 3);
      smove(chss.ofrplc, false);
    });
  for (const a in its) {
    chs(
      '"' + select(["Toss ", "Throw "]) + its[a][1] + ' into the fireplace"',
      false,
    ).addEventListener("click", function () {
      its[a][0].amount--;
      fire.data.fuel =
        fire.data.fuel + its[a][2] > its[a][2]
          ? its[a][2]
          : fire.data.fuel + its[a][2];
      if (fire.data.fuel <= its[a][2])
        dom.frpls.innerHTML = global.text.frplcfrextra[0];
      else if (fire.data.fuel >= 130 && fire.data.fuel <= 300)
        dom.frpls.innerHTML = global.text.frplcfrextra[1];
      else if (fire.data.fuel >= 300 && fire.data.fuel <= 540)
        dom.frpls.innerHTML = global.text.frplcfrextra[2];
      else if (fire.data.fuel >= 540)
        dom.frpls.innerHTML = global.text.frplcfrextra[3];
      if (its[a][0].amount <= 0) {
        removeItem(its[a][0]);
        dom.ctr_2.removeChild(this);
      } else if (global.sm === 1) updateInv(inv.indexOf(its[a][0]));
      else if (global.sm === its[a][0])
        updateInv(global.sinv.indexOf(its[a][0]));
    });
  }
  const afire = findbyid(furn, furniture.fwdpile.id);
  if (afire && afire.data.fuel > 0) {
    chs('"Light a fire"', false, "orange").addEventListener("click", () => {
      if (effect.fplc.active) msg("Fire is already on", "orange");
      else {
        afire.data.fuel--;
        fire.data.fuel += 16;
      }
    });
  }
  chs('"<= Step away"', false).addEventListener("click", () => {
    smove(chss.home, false);
  });
};

chss.sboxhm = new Chs();
chss.sboxhm.id = 131;
addtosector(sector.home, chss.sboxhm);
chss.sboxhm.sl = () => {
  d_loc("Your Home, Storage Box");
  //  chs('"Your botomless storage container, full of your belongings"',true)
  chs_spec(3, home.trunk);
  chs('"<= Step Away"', false, "", "", null, null, null, true).addEventListener(
    "click",
    () => {
      smove(chss.home, false);
    },
  );
};

global.text.catasound = [
  "You are hearing weird sounds",
  "Crunching sound echoes",
  "Your feet sink into the muddy ground",
  "You hear wailing",
  "Something growls in the distance",
  "Damp stagnant air of the underground makes it difficult to breathe",
  "You hear bones",
  "You notice something move in the darkness",
  "You feel sinister aura",
  "Aged walls have something written on them, but you are unable to decipher what it is",
  "Bone bits are littered on the ground",
  "Old rotting cloth is hanging from the walls",
  "Something rusty sparkes from below",
  "old stale air fills your lungs",
];

chss.catamn = new Chs();
chss.catamn.id = 132;
addtosector(sector.cata1, chss.catamn);
chss.catamn.sl = () => {
  d_loc("Catacombs, The Entryway");
  global.lst_loc = 132;
  chs('"You have entered the Catacombs"', true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata1);
  });
  chs('"<= Exit"', false).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

chss.cata1 = new Chs();
chss.cata1.id = 133;
addtosector(sector.cata1, chss.cata1);
chss.cata1.sl = () => {
  d_loc("Catacombs, The Casket Service");
  global.lst_loc = 133;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata13);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata2);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.catamn);
  });
};

chss.cata2 = new Chs();
chss.cata2.id = 134;
addtosector(sector.cata1, chss.cata2);
chss.cata2.sl = () => {
  d_loc("Catacombs, The Mourning Hall");
  global.lst_loc = 134;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata1);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata3);
  });
};

chss.cata3 = new Chs();
chss.cata3.id = 135;
addtosector(sector.cata1, chss.cata3);
chss.cata3.sl = () => {
  d_loc("Catacombs, The Last Breath");
  global.lst_loc = 135;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata4);
  });
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata2);
  });
};

chss.cata4 = new Chs();
chss.cata4.id = 136;
addtosector(sector.cata1, chss.cata4);
chss.cata4.sl = () => {
  d_loc("Catacombs, Tunnel of the Dead");
  global.lst_loc = 136;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata5);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata3);
  });
};

chss.cata5 = new Chs();
chss.cata5.id = 137;
addtosector(sector.cata1, chss.cata5);
chss.cata5.sl = () => {
  d_loc("Catacombs, Movement Below");
  global.lst_loc = 137;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata6, false);
  });
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata12);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata4);
  });
};

chss.cata6 = new Chs();
chss.cata6.id = 138;
addtosector(sector.cata1, chss.cata6);
chss.cata6.sl = () => {
  d_loc("Catacombs, The Web Corridor");
  global.lst_loc = 138;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata7);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata5);
  });
};

chss.cata7 = new Chs();
chss.cata7.id = 139;
addtosector(sector.cata1, chss.cata7);
chss.cata7.sl = () => {
  d_loc("Catacombs, Grievance");
  global.lst_loc = 139;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata8);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata6);
  });
};

chss.cata8 = new Chs();
chss.cata8.id = 140;
addtosector(sector.cata1, chss.cata8);
chss.cata8.sl = () => {
  d_loc("Catacombs, Forgotten Post");
  global.lst_loc = 140;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata9);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata7);
  });
};

chss.cata9 = new Chs();
chss.cata9.id = 141;
addtosector(sector.cata1, chss.cata9);
chss.cata9.sl = () => {
  d_loc("Catacombs, Withered Hand");
  global.lst_loc = 141;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata8);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata10);
  });
};

chss.cata10 = new Chs();
chss.cata10.id = 142;
addtosector(sector.cata1, chss.cata10);
chss.cata10.sl = () => {
  d_loc("Catacombs, The Rusted Arc");
  global.lst_loc = 142;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata9);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata11);
  });
};

chss.cata11 = new Chs();
chss.cata11.id = 143;
addtosector(sector.cata1, chss.cata11);
chss.cata11.sl = () => {
  d_loc("Catacombs, Old One's Destination");
  global.lst_loc = 143;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata10);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata12);
  });
};

chss.cata12 = new Chs();
chss.cata12.id = 144;
addtosector(sector.cata1, chss.cata12);
chss.cata12.sl = () => {
  d_loc("Catacombs, Thawing Candles");
  global.lst_loc = 144;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata11);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata5);
  });
};

chss.cata13 = new Chs();
chss.cata13.id = 145;
addtosector(sector.cata1, chss.cata13);
chss.cata13.sl = () => {
  d_loc("Catacombs, The Endless Echoes");
  global.lst_loc = 145;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata14);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata1);
  });
};

chss.cata14 = new Chs();
chss.cata14.id = 146;
addtosector(sector.cata1, chss.cata14);
chss.cata14.sl = () => {
  d_loc("Catacombs, The Dusty Underpass");
  global.lst_loc = 146;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata15);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata13);
  });
};

chss.cata15 = new Chs();
chss.cata15.id = 147;
addtosector(sector.cata1, chss.cata15);
chss.cata15.sl = () => {
  d_loc("Catacombs, Light's Corner");
  global.lst_loc = 147;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata16);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata14);
  });
};

chss.cata16 = new Chs();
chss.cata16.id = 148;
addtosector(sector.cata1, chss.cata16);
chss.cata16.sl = () => {
  d_loc("Catacombs, Son's Last Visit");
  global.lst_loc = 148;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata17);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata15);
  });
};

chss.cata17 = new Chs();
chss.cata17.id = 149;
addtosector(sector.cata1, chss.cata17);
chss.cata17.sl = () => {
  d_loc("Catacombs, The Stone Plate");
  global.lst_loc = 149;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata18);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata16);
  });
};

chss.cata18 = new Chs();
chss.cata18.id = 150;
addtosector(sector.cata1, chss.cata18);
chss.cata18.sl = () => {
  d_loc("Catacombs, Cracked Passageway");
  global.lst_loc = 150;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata19);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata17);
  });
};

chss.cata19 = new Chs();
chss.cata19.id = 151;
addtosector(sector.cata1, chss.cata19);
chss.cata19.sl = () => {
  d_loc("Catacombs, The Limited Leeway");
  global.lst_loc = 151;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata20);
  });
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata18);
  });
};

chss.cata20 = new Chs();
chss.cata20.id = 152;
addtosector(sector.cata1, chss.cata20);
chss.cata20.sl = () => {
  d_loc("Catacombs, The Brittle Turn");
  global.lst_loc = 152;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata19);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata21);
  });
};

chss.cata21 = new Chs();
chss.cata21.id = 153;
addtosector(sector.cata1, chss.cata21);
chss.cata21.sl = () => {
  d_loc("Catacombs, Bright Ray Above");
  global.lst_loc = 153;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata20);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata22);
  });
};

chss.cata22 = new Chs();
chss.cata22.id = 154;
addtosector(sector.cata1, chss.cata22);
chss.cata22.sl = () => {
  d_loc("Catacombs, Nowhere To Run");
  global.lst_loc = 154;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata21);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata23);
  });
};

chss.cata23 = new Chs();
chss.cata23.id = 155;
addtosector(sector.cata1, chss.cata23);
chss.cata23.sl = () => {
  d_loc("Catacombs, The Aging Room");
  global.lst_loc = 155;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata22);
  });
  chs('"↓ Move South"', false).addEventListener("click", () => {
    smove(chss.cata24);
  });
};

chss.cata24 = new Chs();
chss.cata24.id = 156;
addtosector(sector.cata1, chss.cata24);
chss.cata24.sl = () => {
  d_loc("Catacombs, Eleven Wisemen");
  global.lst_loc = 156;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"↑ Move North"', false).addEventListener("click", () => {
    smove(chss.cata23);
  });
  chs('"← Move West"', false).addEventListener("click", () => {
    smove(chss.cata25);
  });
};

chss.cata25 = new Chs();
chss.cata25.id = 157;
addtosector(sector.cata1, chss.cata25);
chss.cata25.sl = () => {
  d_loc("Catacombs, The End Of Journey");
  global.lst_loc = 157;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs('"→ Move East"', false).addEventListener("click", () => {
    smove(chss.cata24);
  });
};
