// Location scenes. A `Chs` is one place the player can stand: `sl()` rebuilds
// its description and choices every time the scene is shown, while `onEnter`,
// `onLeave`, and `onScout` react to movement. This is where the game's dialogue
// and branching live; all of its text comes from the locale files.

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
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_training_area_815c8f3c"));
  chs(i18n.t("runtime.world.locations.dialogue.kid_711a26c9"), true);
  chs(
    i18n.t("runtime.world.locations.dialogue.text_32bd7431"),
    false,
  ).addEventListener("click", function () {
    global.time += DAY;
    appear(dom.ctr_1);
    chs(
      i18n.t("runtime.world.locations.dialogue.quit_daydreaming_48a41a63"),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.text_1a178459"),
      false,
    ).addEventListener("click", function () {
      appear(dom.d0);
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.you_have_training_to_complete_c3fd5228",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.text_4feb141e"),
        false,
      ).addEventListener("click", function () {
        appear(dom.inv_ctx);
        appear(dom.d_lct);
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.grab_your_stuff_and_get_to_it_30c7a736",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.text_32bd7431"),
          false,
        ).addEventListener("click", function () {
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
  chs(
    i18n.t("runtime.world.locations.dialogue.select_the_difficulty_a7b05b96"),
    true,
  );
  if (!global.flags.tr1_win)
    chs(
      i18n.t("runtime.world.locations.dialogue.easiest_d6b2bd65"),
      false,
    ).addEventListener("click", function () {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.you_are_fighting_training_dummies_eef3513b",
        ),
        true,
      );
      if (!global.flags.dm1ap) {
        appear(dom.d1m);
        global.flags.dm1ap = true;
      }
      area_init(area.trn1);
    });
  if (!global.flags.tr2_win)
    chs(
      i18n.t("runtime.world.locations.dialogue.easy_de6aae2a"),
      false,
    ).addEventListener("click", function () {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.you_are_fighting_training_dummies_eef3513b",
        ),
        true,
      );
      if (!global.flags.dm1ap) {
        appear(dom.d1m);
        global.flags.dm1ap = true;
      }
      area_init(area.trn2);
    });
  if (!global.flags.tr3_win)
    chs(
      i18n.t("runtime.world.locations.dialogue.normal_6f63d66b"),
      false,
    ).addEventListener("click", function () {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.you_are_fighting_training_dummies_eef3513b",
        ),
        true,
      );
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
    i18n.t("runtime.world.locations.dialogue.instructor_course_reward", {
      praise: select(
        i18n.get("runtime.world.locations.dialogue.instructor_praise_words"),
      ),
      work: select(
        i18n.get("runtime.world.locations.dialogue.instructor_work_words"),
      ),
    }),
    true,
    "lime",
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.text_8c5251db"),
    false,
  ).addEventListener("click", function () {
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
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_lobby_12a158eb"));
  global.lst_loc = 104;
  global.flags.inside = true;
  if (global.flags.nbtfail) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.instructor_you_got_beaten_up_by_an_inanimated_2fd73765",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.text_32bd7431"),
      false,
    ).addEventListener("click", () => {
      global.flags.nbtfail = false;
      clr_chs();
      smove(chss.tdf, false);
      giveItem(item.hrb1, 4);
    });
  } else {
    if (!global.flags.dj1end) {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.instructor_your_training_is_over_for_today_you_e20cacb5",
        ),
        true,
      );
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.practitioner_skillbook_swords_2f6fa1d3",
        ),
        false,
      ).addEventListener("click", () => {
        giveItem(item.skl1);
        global.flags.dj1end = true;
        smove(chss.lsmain1);
      });
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.practitioner_skillbook_knives_6cb1269b",
        ),
        false,
      ).addEventListener("click", () => {
        giveItem(item.skl2);
        global.flags.dj1end = true;
        smove(chss.lsmain1);
      });
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.practitioner_skillbook_axes_51ce8119",
        ),
        false,
      ).addEventListener("click", () => {
        giveItem(item.skl3);
        global.flags.dj1end = true;
        smove(chss.lsmain1);
      });
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.practitioner_skillbook_spears_49100035",
        ),
        false,
      ).addEventListener("click", () => {
        giveItem(item.skl4);
        global.flags.dj1end = true;
        smove(chss.lsmain1);
      });
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.practitioner_skillbook_hammers_424e5e04",
        ),
        false,
      ).addEventListener("click", () => {
        giveItem(item.skl5);
        global.flags.dj1end = true;
        smove(chss.lsmain1);
      });
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.practitioner_skillbook_martial_7b89708c",
        ),
        false,
      ).addEventListener("click", () => {
        giveItem(item.skl6);
        global.flags.dj1end = true;
        smove(chss.lsmain1);
      });
    } else if (global.flags.trnex1 === true && !global.flags.trnex2) {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.instructor_hahahhha_what_a_great_disciple_that_s_d95a898e",
        ),
        true,
        "yellow",
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.thanks_teacher_158a25cb"),
        false,
      ).addEventListener("click", () => {
        giveItem(acc.snch);
        smove(chss.lsmain1);
        global.flags.trnex2 = true;
      });
    } else {
      chs(
        select(
          i18n.get(
            "runtime.world.locations.dialogue.dojo_return_ambient_messages",
          ),
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.dojo_infoboard_dc95eca7"),
        false,
      ).addEventListener("click", () => {
        smove(chss.djinf, false);
      });
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.destroy_more_dummies_2b79894d",
        ),
        false,
      ).addEventListener("click", () => {
        smove(chss.return1, false);
      });
      if (
        global.flags.dj1end === true &&
        you.lvl >= 10 &&
        !global.flags.trne1e1
      )
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.challenge_a_stronger_opponent_6540be2d",
          ),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.you_are_facing_a_golem_2a40fb70",
            ),
            true,
          );
          area_init(area.trne1);
          chs(
            i18n.t("runtime.world.locations.dialogue.escape_89cacdd9"),
            false,
          ).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.trne1e1 && !global.flags.trne2e1)
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.challenge_an_even_stronger_opponent_4841c396",
          ),
          false,
          "cornflowerblue",
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.you_are_facing_a_golem_2a40fb70",
            ),
            true,
          );
          area_init(area.trne2);
          chs(
            i18n.t("runtime.world.locations.dialogue.escape_89cacdd9"),
            false,
          ).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.trne2e1 && !global.flags.trne3e1)
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.challenge_a_dangerous_opponent_c519e57f",
          ),
          false,
          "crimson",
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.you_are_facing_a_golem_2a40fb70",
            ),
            true,
          );
          area_init(area.trne3);
          chs(
            i18n.t("runtime.world.locations.dialogue.escape_89cacdd9"),
            false,
          ).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.trne3e1 && !global.flags.trne4e1)
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.challenge_a_powerful_opponent_dce1cf24",
          ),
          false,
          "red",
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.you_are_facing_a_golem_2a40fb70",
            ),
            true,
          );
          area_init(area.trne4);
          chs(
            i18n.t("runtime.world.locations.dialogue.escape_89cacdd9"),
            false,
          ).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.dj1end)
        chs(
          i18n.t("runtime.world.locations.dialogue.turn_in_dojo_gear_727d77c2"),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.instructor_you_can_return_whatever_you_punched_off_b5d4b377",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.return_the_rags_8c543641"),
            false,
          ).addEventListener("click", () => {
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
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_there_s_nothing_i_can_take_from_cbe89691",
                ),
                true,
              );
            else {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_return_items_offer",
                  { amount: dlr, coin: dom.coincopper },
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                msg(
                  i18n.t(
                    "runtime.world.locations.interface.items_returned_to_dojo",
                    { count: stash.length },
                  ),
                  "ghostwhite",
                );
                global.stat.ivtntdj += stash.length;
                giveWealth(dlr);
                for (const a in stash) removeItem(stash[a]);
                if (global.stat.ivtntdj >= 300) giveTitle(ttl.tqtm);
                smove(chss.t3, false);
              });
            }
            chs(
              i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
              false,
            ).addEventListener("click", () => {
              smove(chss.t3, false);
            });
          });
          chs(
            i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
            false,
          ).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (global.flags.djmlet && isDay(6)) {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.grab_a_serving_of_free_food_e8073a5c",
          ),
          false,
          "lime",
        ).addEventListener("click", () => {
          if (isDay(6)) {
            msg(
              select(
                i18n.get(
                  "runtime.world.locations.dialogue.free_meal_eating_sounds",
                ),
              ),
              "lime",
            );
            msg(
              select(
                i18n.get(
                  "runtime.world.locations.dialogue.free_meal_reactions",
                ),
              ),
              "lime",
            );
            you.sat = you.satmax;
            giveSkExp(skl.glt, 42);
            dom.d5_3_1.update();
            global.flags.djmlet = false;
            smove(chss.t3, false);
            return;
          } else {
            msg(
              i18n.t(
                "runtime.world.locations.dialogue.too_late_for_that_5d0f7819",
              ),
              "yellow",
            );
            global.flags.djmlet = false;
            smove(chss.t3, false);
            return;
          }
        });
      }
      if (global.flags.dj1end === true)
        chs(
          i18n.t("runtime.world.locations.dialogue.level_advancement_4ca3b39b"),
          false,
          "orange",
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.instructor_if_you_put_effort_into_training_you_3e98d3a9",
            ),
            true,
          );
          if (!global.flags.dj1rw1 && you.lvl >= 5) {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.level_5_reward_bb82c159",
              ),
              false,
            ).addEventListener("click", () => {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_this_is_a_good_start_congratulations_keep_ebad1e30",
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
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
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.level_10_reward_2865a8f3",
              ),
              false,
              "royalblue",
            ).addEventListener("click", () => {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_you_seem_to_not_neglect_your_training_45376b43",
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw2 = true;
                giveWealth(100);
                giveItem(item.sp2, 2);
                smove(chss.t3, false);
              });
            });
          }
          if (
            !global.flags.dj1rw3 &&
            global.flags.dj1rw2 === true &&
            you.lvl >= 15
          ) {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.level_15_reward_d6da78f8",
              ),
              false,
              "lime",
            ).addEventListener("click", () => {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_you_re_slowly_growing_into_a_fine_c87f1850",
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw3 = true;
                giveWealth(200);
                giveItem(item.sp3, 1);
                giveItem(eqp.tnc);
                giveItem(item.lifedr);
                giveItem(eqp.knkls);
                giveItem(eqp.knkls);
                smove(chss.t3, false);
              });
            });
          }
          if (
            !global.flags.dj1rw4 &&
            global.flags.dj1rw3 === true &&
            you.lvl >= 20
          ) {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.level_20_reward_585a031f",
              ),
              false,
              "gold",
            ).addEventListener("click", () => {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_time_to_start_getting_serious_keep_working_141f8a27",
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw4 = true;
                giveWealth(300);
                giveItem(wpn.tkmts);
                smove(chss.t3, false);
              });
            });
          }
          if (
            !global.flags.dj1rw5 &&
            global.flags.dj1rw4 === true &&
            you.lvl >= 25
          ) {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.level_25_reward_37ab359f",
              ),
              false,
              "orange",
            ).addEventListener("click", () => {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_you_re_almost_ready_to_face_real_9dd4dd18",
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw5 = true;
                giveWealth(350);
                giveItem(acc.mnch);
                smove(chss.t3, false);
              });
            });
          }
          if (
            !global.flags.dj1rw6 &&
            global.flags.dj1rw5 === true &&
            you.lvl >= 30
          ) {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.level_30_reward_adbeb6d4",
              ),
              false,
              "crimson",
            ).addEventListener("click", () => {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.instructor_you_are_almost_as_strong_as_an_31267196",
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw6 = true;
                giveWealth(400);
                giveItem(item.stthbm1);
                giveItem(item.stthbm4);
                giveItem(item.stthbm3);
                giveItem(item.stthbm2);
                smove(chss.t3, false);
              });
            });
          }
          // The ladder used to stop at 30, which is roughly where the story now
          // starts rather than ends: a player opening the catacombs is past it.
          // These four tiers keep the instructor relevant without raising combat
          // numbers — every item here already existed in the game with no drop,
          // recipe, or vendor, and what they give is training speed, survivability
          // and reach rather than damage.
          if (
            !global.flags.dj1rw7 &&
            global.flags.dj1rw6 === true &&
            you.lvl >= 35
          ) {
            chs(
              i18n.t("runtime.world.locations.dialogue.level_35_reward"),
              false,
              "crimson",
            ).addEventListener("click", () => {
              chs(
                i18n.t("runtime.world.locations.dialogue.instructor_level_35"),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw7 = true;
                giveWealth(500);
                giveItem(sld.hpt);
                giveItem(item.sp3, 2);
                smove(chss.t3, false);
              });
            });
          }
          if (
            !global.flags.dj1rw8 &&
            global.flags.dj1rw7 === true &&
            you.lvl >= 40
          ) {
            chs(
              i18n.t("runtime.world.locations.dialogue.level_40_reward"),
              false,
              "crimson",
            ).addEventListener("click", () => {
              chs(
                i18n.t("runtime.world.locations.dialogue.instructor_level_40"),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw8 = true;
                giveWealth(600);
                // The Sword Medal raises experience and mastery gain rather than
                // any stat, which is the only kind of gift this man would give.
                giveItem(acc.otpin);
                smove(chss.t3, false);
              });
            });
          }
          if (
            !global.flags.dj1rw9 &&
            global.flags.dj1rw8 === true &&
            you.lvl >= 45
          ) {
            chs(
              i18n.t("runtime.world.locations.dialogue.level_45_reward"),
              false,
              "crimson",
            ).addEventListener("click", () => {
              chs(
                i18n.t("runtime.world.locations.dialogue.instructor_level_45"),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw9 = true;
                giveWealth(750);
                giveItem(acc.medl5);
                giveItem(sld.knt);
                smove(chss.t3, false);
              });
            });
          }
          if (
            !global.flags.dj1rw10 &&
            global.flags.dj1rw9 === true &&
            you.lvl >= 50
          ) {
            chs(
              i18n.t("runtime.world.locations.dialogue.level_50_reward"),
              false,
              "crimson",
            ).addEventListener("click", () => {
              chs(
                i18n.t("runtime.world.locations.dialogue.instructor_level_50"),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_997df079"),
                false,
                "lime",
              ).addEventListener("click", () => {
                global.flags.dj1rw10 = true;
                giveWealth(900);
                giveItem(sld.drd);
                giveItem(item.stthbm1, 2);
                giveItem(item.sp3, 3);
                smove(chss.t3, false);
              });
            });
          }
          chs(
            i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
            false,
          ).addEventListener("click", () => {
            smove(chss.t3, false);
          });
        });
      if (item.htrdvr.have)
        chs(
          i18n.t("runtime.world.locations.dialogue.deliver_the_crate_ecb57a6e"),
          false,
          "lightblue",
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.instructor_yamato_sent_something_great_timing_on_that_74864748",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.accept_997df079"),
            false,
            "lime",
          ).addEventListener("click", () => {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.instructor_hold_it_that_s_not_all_catch_413e5ef0",
              ),
              true,
            );
            chs(
              i18n.t("runtime.world.locations.dialogue.accept_x2_77cf376d"),
              false,
              "lime",
            ).addEventListener("click", () => {
              giveWealth(50);
              giveItem(item.key0);
              removeItem(item.htrdvr);
              smove(chss.t3, false);
            });
          });
        });
      chs(
        i18n.t("runtime.world.locations.dialogue.go_outside_8fb69e89"),
        false,
      ).addEventListener("click", () => {
        smove(chss.lsmain1);
      });
      if (global.flags.trne4e1 && !global.flags.trne4e1b) {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.instructor_once_again_choose_the_skillbook_of_specialization_f56c651e",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.bladesman_manual_ad62ed67"),
          false,
        ).addEventListener("click", () => {
          giveItem(item.skl1a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.assassin_manual_e0e6c1b5"),
          false,
        ).addEventListener("click", () => {
          giveItem(item.skl2a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.axeman_manual_54ade8d7"),
          false,
        ).addEventListener("click", () => {
          giveItem(item.skl3a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.lancer_manual_364f0729"),
          false,
        ).addEventListener("click", () => {
          giveItem(item.skl4a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.clubber_manual_83b83bf5"),
          false,
        ).addEventListener("click", () => {
          giveItem(item.skl5a);
          global.flags.trne4e1b = true;
          smove(chss.lsmain1);
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.brawler_manual_60f7cd5a"),
          false,
        ).addEventListener("click", () => {
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
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_infoboard_bb14066b"));
  global.lst_loc = 160;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.useful_information_regarding_dojo_is_written_here_what_a34185c0",
    ),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.get_stronger_e548f7c8"),
    false,
  ).addEventListener("click", () => {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.fight_dummies_provided_by_dojo_to_improve_your_1b6b7ebf",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.graduate_0327a071"),
    false,
  ).addEventListener("click", () => {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.when_you_are_confident_in_your_skills_try_0342714c",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.claim_your_rewards_153f54d3"),
    false,
  ).addEventListener("click", () => {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.as_long_as_you_keep_gaining_experience_and_22acce4c",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.get_your_grub_at_the_canteen_39a14ea2",
    ),
    false,
  ).addEventListener("click", () => {
    chs(i18n.t("runtime.world.locations.dialogue.weekly_free_meals"), true);
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.measure_your_power_26da9fa0"),
    false,
  ).addEventListener("click", () => {
    const v = chs(
      i18n.t("runtime.world.locations.dialogue.hand_strength_intro", {
        dummy: col(
          i18n.t("runtime.world.locations.dialogue.indestructible_dummy_name"),
          "orange",
        ),
      }),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.give_it_a_try_7616a870"),
      false,
    ).addEventListener("click", () => {
      you.stat_r();
      const hs = handStr();
      v.innerHTML = i18n.t(
        "runtime.world.locations.interface.hand_strength_result",
        {
          impact: select(
            i18n.get(
              "runtime.world.locations.interface.hand_strength_impact_messages",
            ),
          ),
          value: col(
            i18n.t("runtime.world.locations.interface.hand_strength_value_kg", {
              value: format3(hs.toString()),
            }),
            "springgreen",
          ),
        },
      );
      for (const x in global.htrchl) global.htrchl[x](hs);
    });
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.djinf, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.t3, false);
  });
};

chss.trne1e1 = new Chs();
chss.trne1e1.id = 124;
chss.trne1e1.sl = () => {
  global.flags.inside = true;
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_training_area_815c8f3c"));
  global.lst_loc = 124;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.instructor_great_job_smashing_that_golem_this_golem_d7da8bdd",
    ),
    true,
  );
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.proceed_with_your_training_e30e3823",
    ),
    false,
  ).addEventListener("click", () => {
    giveItem(item.hptn1, 10);
    global.flags.trne1e1 = true;
    smove(chss.t3);
  });
};

chss.trne2e1 = new Chs();
chss.trne2e1.id = 125;
chss.trne2e1.sl = () => {
  global.flags.inside = true;
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_training_area_815c8f3c"));
  global.lst_loc = 125;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.instructor_just_like_that_keep_it_up_you_f067b0e8",
    ),
    true,
  );
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.proceed_with_your_training_e30e3823",
    ),
    false,
  ).addEventListener("click", () => {
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
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_training_area_815c8f3c"));
  global.lst_loc = 126;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.instructor_that_was_a_tough_one_but_you_ab56f2ec",
    ),
    true,
  );
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.proceed_with_your_training_e30e3823",
    ),
    false,
  ).addEventListener("click", () => {
    giveItem(item.scrlw);
    global.flags.trne3e1 = true;
    smove(chss.t3);
  });
};

chss.trne4e1 = new Chs();
chss.trne4e1.id = 162;
chss.trne4e1.sl = () => {
  global.flags.inside = true;
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_training_area_815c8f3c"));
  global.lst_loc = 162;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.instructor_as_expected_you_have_what_it_takes_453d231b",
    ),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.finish_training_08524f68"),
    false,
    "lime",
  ).addEventListener("click", () => {
    global.flags.trne4e1 = true;
    smove(chss.t3);
  });
};

chss.return1 = new Chs();
chss.return1.id = 105;
chss.return1.sl = () => {
  global.flags.inside = true;
  d_loc(i18n.t("runtime.world.locations.dialogue.dojo_training_area_815c8f3c"));
  global.lst_loc = 105;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.punch_as_many_as_you_want_aff9824a",
    ),
    true,
  );
  if (!global.flags.trnex2) area_init(area.trn);
  else area_init(area.trnf);
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_into_lobby_c01abc6d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.t3);
  });
};

chss.frstn1main = new Chs();
chss.frstn1main.id = 113;
chss.frstn1main.sl = () => {
  global.flags.inside = false;
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.western_woods_the_wooden_gate_6d95b13d",
    ),
  );
  global.lst_loc = 113;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.you_re_out_in_the_forest_you_can_4c0bd702",
    ),
    true,
  );
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.enter_the_hunter_s_lodge_48cdabe6",
    ),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn1b1);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.delve_inside_the_forest_9a70616a"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn1a1);
  });
  if (global.flags.frstn1a3u)
    chs(
      i18n.t("runtime.world.locations.dialogue.hunt_indefinitely_3500bd58"),
      false,
    ).addEventListener("click", () => {
      smove(chss.frstn1a3);
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

chss.frstn1a3 = new Chs();
chss.frstn1a3.id = 130;
addtosector(sector.forest1, chss.frstn1a3);
chss.frstn1a3.sl = () => {
  global.flags.inside = false;
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.western_woods_they_re_nearby_254d8ded",
    ),
  );
  global.lst_loc = 130;
  chs(
    i18n.t("runtime.world.locations.dialogue.the_woods_are_silent_aa9a58f4"),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.western_woods_round_branches_405a8c38",
    ),
  );
  if (area.frstn1a4.size > 0) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.something_ambushes_you_3fa3c6ce",
      ),
      true,
      "red",
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.escape_89cacdd9"),
      false,
    ).addEventListener("click", () => {
      smove(chss.frstn1main);
    });
  } else {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.you_never_knew_this_secluded_area_was_here_9af8dc89",
      ),
      true,
    );
    if (!global.flags.frstnskltg)
      chs(
        i18n.t("runtime.world.locations.dialogue.look_around_9af25f74"),
        false,
      ).addEventListener("click", () => {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.you_see_something_sticking_out_from_the_ground_cb6a5826",
          ),
          true,
        );
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.examine_whatever_that_might_be_28ef01e8",
          ),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.indeed_bones_skeletal_remains_of_a_person_to_b589e864",
            ),
            true,
          );
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.see_if_you_can_salvage_anything_4b03eef4",
            ),
            false,
          ).addEventListener("click", () => {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.there_isn_t_much_you_can_take_with_5d1a1083",
              ),
              true,
            );
            chs(
              i18n.t("runtime.world.locations.dialogue.make_a_grave_22679247"),
              false,
            ).addEventListener("click", () => {
              global.flags.frstnskltg = true;
              giveItem(wpn.mkrdwk);
              you.karma += 3;
              you.luck++;
              msg(
                i18n.t(
                  "runtime.world.locations.dialogue.your_good_deed_improved_your_karma_28bfe04d",
                ),
                "gold",
              );
              msg(
                i18n.t(
                  "runtime.world.locations.dialogue.luck_increased_1_8381dca2",
                ),
                "gold",
              );
              chss.frstn1a4.sl();
            });
          });
        });
      });
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.frstn1main);
    });
  }
};
chss.frstn1a4.onEnter = function () {
  if (area.frstn1a4.size > 0) area_init(area.frstn1a4);
};
chss.frstn1a4.onLeave = function () {
  area.frstn1a4.size = rand(5) - 20;
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
        i18n.t(
          "runtime.world.locations.dialogue.you_discover_a_pouch_half_etched_into_the_7a514c42",
        ),
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
      msg(
        i18n.t("runtime.world.locations.dialogue.you_found_moonbloom_904169a6"),
        "lime",
      );
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.western_woods_hunter_s_lodge_375ce411",
    ),
  );
  if (wearingany(wpn.mkrdwk) && !global.flags.wkrtndrt) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_you_why_do_you_have_4a33054f",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.text_1a178459"),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.head_hunter_yamato_the_sword_where_did_you_56743233",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.give_explanation_53888e16"),
        false,
      ).addEventListener("click", () => {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.head_hunter_yamato_the_body_in_the_forest_056f33cb",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.text_4d2a1161"),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_then_one_day_he_staight_5fcb9352",
            ),
            true,
          );
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.express_your_condolences_to_the_deceased_fd9258a8",
            ),
            false,
          ).addEventListener("click", () => {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.head_hunter_yamato_alright_enough_your_sentiment_is_e98eabd3",
              ),
              true,
            );
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.part_with_the_sword_99ff1458",
              ),
              false,
            ).addEventListener("click", () => {
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.head_hunter_yamato_here_take_this_for_your_3222b577",
                ),
                true,
              );
              chs(
                i18n.t("runtime.world.locations.dialogue.accept_bb54db51"),
                false,
                "lime",
              ).addEventListener("click", () => {
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
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_hm_your_face_is_unfamiliar_177b5ce3",
      ),
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
          select(
            i18n.get(
              "runtime.world.locations.dialogue.head_hunter_busy_ambient_messages",
            ),
          ),
          true,
        )
      : chs(
          select(
            i18n.get(
              "runtime.world.locations.dialogue.head_hunter_room_ambient_messages",
            ),
          ),
          true,
        );
  chs(
    i18n.t("runtime.world.locations.dialogue.ask_about_the_jobs_aef7fe7e"),
    false,
    "yellow",
  ).addEventListener("click", () => {
    smove(chss.frstn1b1j, false);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.tell_me_something_3cda67ac"),
    false,
  ).addEventListener("click", () => {
    smove(chss.htrtch0, false);
  });
  if (quest.fwd1.data.done === true) {
    chs(
      i18n.t("runtime.world.locations.dialogue.sell_firewood_action", {
        coin: dom.coincopper,
      }),
      false,
    ).addEventListener("click", () => {
      smove(chss.frstn1b1s, false);
    });
  }
  if (item.hbtsvr.have)
    chs(
      i18n.t("runtime.world.locations.dialogue.deliver_the_satchel_351d1ef5"),
      false,
      "lightblue",
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.head_hunter_yamato_delivery_back_that_s_unexpected_4df2e734",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.ok_34e8049c"),
        false,
      ).addEventListener("click", () => {
        giveItem(item.htrdvr);
        removeItem(item.hbtsvr);
        smove(chss.frstn1main);
      });
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.exit_24c04d4e"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn1main);
  });
  if (
    quest.fwd1.data.done === true &&
    quest.hnt1.data.done === true &&
    !global.flags.frstn1b1g1
  ) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_first_weapon_advice",
        {
          noticeBoard: col(
            i18n.t("runtime.world.locations.dialogue.notice_board_name"),
            "lime",
          ),
        },
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.thanks_cd2477f0"),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.head_hunter_yamato_one_more_thing_i_ll_fa1df277",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.got_it_249b0afe"),
        false,
      ).addEventListener("click", () => {
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
    i18n.t(
      "runtime.world.locations.dialogue.head_hunter_yamato_what_do_you_want_to_9d8109c1",
    ),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.about_monsters_70301f7c"),
    false,
  ).addEventListener("click", () => {
    smove(chss.htrtch1, false);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.what_are_monster_ranks_f4347c5c"),
    false,
  ).addEventListener("click", () => {
    learnLore("monsterRanks");
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_ranking_is_a_way_to_566a276d",
      ),
      true,
      0,
      0,
      0,
      0,
      ".9em",
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.htrtch0, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn1b1, false);
  });
};

chss.htrtch1 = new Chs();
chss.htrtch1.id = 163;
chss.htrtch1.sl = () => {
  global.flags.inside = true;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.head_hunter_yamato_monsters_you_say_there_are_d377d759",
    ),
    true,
    0,
    0,
    0,
    0,
    ".8em",
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.about_humans_50c28c02"),
    false,
    0,
    0,
    0,
    0,
    ".8em",
    0,
    "15px",
  ).addEventListener("click", () => {
    learnLore("creatureKinds");
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_humans_and_demihumans_fall_into_a4099cf4",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.htrtch1, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.about_beasts_24b4fd35"),
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
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_beasts_are_your_usual_normal_14817f19",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.htrtch1, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.about_undead_465749d0"),
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
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_undead_as_you_could_already_b4e6cec5",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.htrtch1, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.about_evil_4465a5e7"),
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
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_beings_that_are_artificially_made_c4728579",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.htrtch1, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.about_phantoms_7d9782cb"),
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
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_souls_of_the_dead_ethereal_6b1fe808",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.htrtch1, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.about_dragons_301076c2"),
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
      i18n.t(
        "runtime.world.locations.dialogue.head_hunter_yamato_dragons_are_legendary_creatures_that_e62e35b2",
      ),
      true,
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.htrtch1, false);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.htrtch0, false);
  });
};

chss.frstn1b1s = new Chs();
chss.frstn1b1s.id = 121;
chss.frstn1b1s.sl = () => {
  global.flags.inside = true;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.head_hunter_yamato_i_ll_fetch_you_15_de0c0a5f",
    ),
    true,
  );
  const fwd = item.fwd1.have ? item.fwd1.amount : 0;
  if (fwd >= 1)
    chs(
      i18n.t("runtime.world.locations.dialogue.sell_1_piece_e82b7d38"),
      false,
      "lightgrey",
    ).addEventListener("click", () => {
      item.fwd1.amount -= 1;
      if (item.fwd1.amount <= 0) removeItem(item.fwd1);
      giveWealth(15);
      smove(chss.frstn1b1s, false);
    });
  if (fwd >= 5)
    chs(
      i18n.t("runtime.world.locations.dialogue.sell_5_piece_cc905423"),
      false,
      "lime",
    ).addEventListener("click", () => {
      item.fwd1.amount -= 5;
      if (item.fwd1.amount <= 0) removeItem(item.fwd1);
      giveWealth(75);
      smove(chss.frstn1b1s, false);
    });
  if (fwd >= 10)
    chs(
      i18n.t("runtime.world.locations.dialogue.sell_10_pieces_f1289740"),
      false,
      "cyan",
    ).addEventListener("click", () => {
      item.fwd1.amount -= 10;
      if (item.fwd1.amount <= 0) removeItem(item.fwd1);
      giveWealth(150);
      smove(chss.frstn1b1s, false);
    });
  if (fwd >= 1)
    chs(
      i18n.t("runtime.world.locations.dialogue.sell_everything_8e937e77"),
      false,
      "orange",
    ).addEventListener("click", () => {
      giveWealth(item.fwd1.amount * 15);
      item.fwd1.amount = 0;
      removeItem(item.fwd1);
      smove(chss.frstn1b1s, false);
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn1b1, false);
  });
};

chss.frstn1b1j = new Chs();
chss.frstn1b1j.id = 119;
chss.frstn1b1j.sl = () => {
  global.flags.inside = true;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.head_hunter_yamato_here_is_what_s_available_4a2dc94a",
    ),
    true,
  );
  if (quest.fwd1.data.done && quest.hnt1.data.done) {
    if (!quest.lmfstkil1.data.started && !quest.lmfstkil1.data.done) {
      chs(
        i18n.t("runtime.world.locations.dialogue.monster_eradication_dfc537e2"),
        false,
      ).addEventListener("click", () => {
        if (you.lvl < 20 || !global.flags.trne4e1) {
          msg(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_don_t_even_think_about_847df129",
            ),
          );
          return;
        }
        if (!quest.lmfstkil1.data.started) {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_what_s_this_your_aura_43ad5fb7",
            ),
            true,
            "yellow",
            0,
            0,
            0,
            ".9em",
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.accept_997df079"),
            false,
            "lime",
          ).addEventListener("click", () => {
            giveQst(quest.lmfstkil1);
            global.flags.frst1u = true;
            giveItem(item.bstr);
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.head_hunter_yamato_hunt_down_all_the_wolves_b6a08f0c",
              ),
              true,
            );
            chs(
              i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
              false,
            ).addEventListener("click", () => {
              smove(chss.frstn1b1, false);
            });
          });
          chs(
            i18n.t("runtime.world.locations.dialogue.refuse_b896d9e7"),
            false,
            "crimson",
          ).addEventListener("click", () => {
            smove(chss.frstn1b1, false);
          });
        }
      });
    } else if (quest.lmfstkil1.data.started) {
      if (quest.lmfstkil1.data.mkilled < 35) {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.head_hunter_yamato_having_troubles_with_the_task_2e2b3c7b",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
          false,
        ).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
        return;
      } else
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.head_hunter_yamato_what_is_that_fire_in_481e49e7",
          ),
          true,
        );
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.report_the_sounds_you_heard_d336eb33",
        ),
        false,
        "lime",
      ).addEventListener("click", () => {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.head_hunter_yamato_that_isn_t_good_sounds_e7b3c648",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.accept_the_reward_d2c12b50"),
          false,
          "lime",
        ).addEventListener("click", () => {
          finishQst(quest.lmfstkil1);
          smove(chss.frstn1main);
        });
      });
    }
  }
  // The board used to render nothing but its header once the wolf hunt was done,
  // which made an empty board the real end of the game. Yamato promised to send
  // for the player; this is where he keeps that promise. A save made before the
  // promise was recorded has no day to wait for, so it is treated as already due.
  if (quest.lmfstkil1.data.done) {
    const promisedOn = quest.lmfstkil1.data.rday;
    // One night, which is what he actually asks for. This required the date to
    // change twice, so a player who did as they were told and slept once came back
    // to an empty board. A day is 1440 minutes and the bed runs time at five times
    // normal, so sleeping it off is a few minutes of real time; staying awake for
    // it is about twenty-four.
    const due = promisedOn === undefined || time.day > promisedOn;
    if (!quest.pckld1.data.started && !quest.pckld1.data.done) {
      if (!due)
        chs(
          i18n.t("runtime.world.locations.dialogue.yamato_rest_first"),
          true,
          "yellow",
        );
      else
        chs(
          i18n.t("runtime.world.locations.dialogue.pack_leader_posting"),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t("runtime.world.locations.dialogue.yamato_pack_leader_brief"),
            true,
            "yellow",
            0,
            0,
            0,
            ".9em",
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.accept_997df079"),
            false,
            "lime",
          ).addEventListener("click", () => {
            giveQst(quest.pckld1);
            // He is telling the player why, not just what.
            learnLore("wolvesPushed");
            smove(chss.frstn1b1, false);
          });
          chs(
            i18n.t("runtime.world.locations.dialogue.refuse_b896d9e7"),
            false,
            "crimson",
          ).addEventListener("click", () => {
            smove(chss.frstn1b1, false);
          });
        });
    } else if (quest.pckld1.data.started) {
      if (!quest.pckld1.data.killed) {
        chs(
          i18n.t("runtime.world.locations.dialogue.yamato_pack_leader_waiting"),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
          false,
        ).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
        return;
      }
      chs(
        i18n.t("runtime.world.locations.dialogue.yamato_pack_leader_report"),
        true,
        "yellow",
        0,
        0,
        0,
        ".9em",
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.accept_the_reward_d2c12b50"),
        false,
        "lime",
      ).addEventListener("click", () => {
        finishQst(quest.pckld1);
        global.flags.undercity1 = true;
        smove(chss.frstn1main);
      });
    }
  }
  // Chapter III's payoff. Yamato said to come back before touching whatever the
  // player found, and this is where he is told. It is also where the game says out
  // loud that going under the village unlit is not a plan, because nothing else
  // ever tells the player that and the only light they can buy is a candle.
  if (
    quest.undcty1.data.started &&
    !quest.undcty1.data.done &&
    undercitySignsFound()
  ) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.report_what_is_under_the_village",
      ),
      false,
      "lime",
    ).addEventListener("click", () => {
      chs(
        i18n.t("runtime.world.locations.dialogue.yamato_undercity_briefing"),
        true,
        "yellow",
        0,
        0,
        0,
        ".9em",
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.accept_the_reward_d2c12b50"),
        false,
        "lime",
      ).addEventListener("click", () => {
        finishQst(quest.undcty1);
        global.flags.undercity2 = true;
        smove(chss.frstn1main);
      });
    });
  }
  // Chapter IV. Once the player has actually been down, Yamato wants to know how
  // far it goes.
  if (
    quest.undcty1.data.done &&
    !quest.undcty2.data.started &&
    !quest.undcty2.data.done
  )
    chs(
      i18n.t("runtime.world.locations.dialogue.how_far_down_posting"),
      false,
      "yellow",
    ).addEventListener("click", () => {
      chs(
        i18n.t("runtime.world.locations.dialogue.yamato_how_far_down_brief"),
        true,
        "yellow",
        0,
        0,
        0,
        ".9em",
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.accept_997df079"),
        false,
        "lime",
      ).addEventListener("click", () => {
        giveQst(quest.undcty2);
        smove(chss.frstn1b1, false);
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.maybe_next_time_b3689181"),
        false,
      ).addEventListener("click", () => {
        smove(chss.frstn1b1, false);
      });
    });
  else if (quest.undcty2.data.started && !quest.undcty2.data.done) {
    if (!quest.undcty2.data.killed) {
      chs(
        i18n.t("runtime.world.locations.dialogue.yamato_how_far_down_waiting"),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
        false,
      ).addEventListener("click", () => {
        smove(chss.frstn1b1, false);
      });
      return;
    }
    chs(
      i18n.t("runtime.world.locations.dialogue.report_the_mark_on_the_wall"),
      false,
      "lime",
    ).addEventListener("click", () => {
      chs(
        i18n.t("runtime.world.locations.dialogue.yamato_dein_reveal"),
        true,
        "yellow",
        0,
        0,
        0,
        ".9em",
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.accept_the_reward_d2c12b50"),
        false,
        "lime",
      ).addEventListener("click", () => {
        finishQst(quest.undcty2);
        global.flags.deintrail = true;
        learnLore("deinWasHere", "whatDeinSought", "whyTheEast");
        smove(chss.frstn1main);
      });
    });
  }
  if (!quest.fwd1.data.done) {
    chs(
      i18n.t("runtime.world.locations.dialogue.firewood_gathering_0fea8bf3"),
      false,
    ).addEventListener("click", () => {
      if (!quest.fwd1.data.started) {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.head_hunter_yamato_while_coal_is_not_easy_5b075367",
          ),
          true,
          "yellow",
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.accept_997df079"),
          false,
          "lime",
        ).addEventListener("click", () => {
          giveQst(quest.fwd1);
          learnLore("theLodge");
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_great_i_will_be_awaiting_c85db166",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
            false,
          ).addEventListener("click", () => {
            smove(chss.frstn1b1, false);
          });
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.refuse_b896d9e7"),
          false,
          "crimson",
        ).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      } else {
        if (!item.fwd1.have)
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_if_you_find_your_task_6cb3a6f9",
            ),
            true,
          );
        else if (item.fwd1.amount < 10)
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.firewood_quest_remaining",
              { remaining: 10 - item.fwd1.amount },
            ),
            true,
          );
        else
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_if_you_got_requested_firewood_e04f5159",
            ),
            true,
          );
        if (item.fwd1.amount >= 10) {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.hand_over_firewood_07fb7ba5",
            ),
            false,
            "lime",
          ).addEventListener("click", () => {
            reduce(item.fwd1, 10);
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.head_hunter_yamato_very_good_you_didn_t_d6c91e12",
              ),
              true,
            );
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.accept_the_reward_d2c12b50",
              ),
              false,
              "lime",
            ).addEventListener("click", () => {
              finishQst(quest.fwd1);
            });
          });
        }
        chs(
          i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
          false,
        ).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      }
    });
  }
  if (!quest.hnt1.data.done) {
    chs(
      i18n.t("runtime.world.locations.dialogue.hunting_for_meat_3d4eebe6"),
      false,
    ).addEventListener("click", () => {
      if (!quest.hnt1.data.started) {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.head_hunter_yamato_if_you_want_to_survive_8c7ed203",
          ),
          true,
          "yellow",
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.accept_997df079"),
          false,
          "lime",
        ).addEventListener("click", () => {
          giveQst(quest.hnt1);
          learnLore("theLodge");
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_great_i_will_be_awaiting_c85db166",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
            false,
          ).addEventListener("click", () => {
            smove(chss.frstn1b1, false);
          });
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.refuse_b896d9e7"),
          false,
          "crimson",
        ).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      } else {
        if (!item.fwd1.have)
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_if_you_find_your_task_6cb3a6f9",
            ),
            true,
          );
        else if (item.rwmt1.amount < 10)
          chs(
            i18n.t("runtime.world.locations.dialogue.meat_quest_remaining", {
              remaining: 10 - item.rwmt1.amount,
            }),
            true,
          );
        else
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.head_hunter_yamato_if_you_have_everything_already_2a155b80",
            ),
            true,
          );
        if (item.rwmt1.amount >= 10) {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.turn_in_raw_meat_4bf803f6",
            ),
            false,
            "lime",
          ).addEventListener("click", () => {
            reduce(item.rwmt1, 10);
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.head_hunter_yamato_well_done_hunting_down_animals_d874ff95",
              ),
              true,
            );
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.accept_the_reward_d2c12b50",
              ),
              false,
              "lime",
            ).addEventListener("click", () => {
              finishQst(quest.hnt1);
              smove(chss.frstn1b1, false);
            });
          });
        }
        chs(
          i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
          false,
        ).addEventListener("click", () => {
          smove(chss.frstn1b1, false);
        });
      }
    });
  }
  //blabla

  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn1b1, false);
  });
};

chss.frstn1a1 = new Chs();
chss.frstn1a1.id = 114;
addtosector(sector.forest1, chss.frstn1a1);
chss.frstn1a1.sl = () => {
  global.flags.inside = false;
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.western_woods_the_yellow_path_2bbe9906",
    ),
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.the_woods_are_silent_aa9a58f4"),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.western_woods_the_underbushes_afed62d3",
    ),
  );
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.you_scavenged_some_goods_from_this_forest_area_f56d5649",
    ),
    true,
  );
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.go_further_into_the_forest_800e5650",
    ),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn2a1);
  });
  if (global.flags.frstnscgr)
    chs(
      i18n.t("runtime.world.locations.dialogue.enter_the_hidden_path_f81c1288"),
      false,
      "grey",
    ).addEventListener("click", () => {
      smove(chss.frstn1a4);
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
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
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.you_uncover_a_hidden_passage_a019a2c0",
        ),
        "lime",
      );
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.western_woods_the_shaded_path_4ac9cfbc",
    ),
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.the_woods_are_silent_aa9a58f4"),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.southern_forest_the_oaken_gate_49be8e43",
    ),
  );
  global.lst_loc = 168;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.the_air_here_feels_intimidating_b2cb9777",
    ),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.explore_the_depths_fe504412"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn9a1m);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

chss.frstn9a1m = new Chs();
chss.frstn9a1m.id = 169;
chss.frstn9a1m.sl = () => {
  global.flags.inside = false;
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.southern_forest_the_foliage_80d0fac8",
    ),
  );
  global.lst_loc = 169;
  chs(
    i18n.t("runtime.world.locations.dialogue.this_place_looks_dark_a6f528d6"),
    true,
  );
  // The foliage was a terminal grinding area. Taking Yamato's second commission
  // opens the way past it, so the two-scene south finally has a destination.
  if (quest.pckld1.data.started || quest.pckld1.data.done)
    chs(
      i18n.t("runtime.world.locations.dialogue.follow_the_trail_deeper"),
      false,
    ).addEventListener("click", () => {
      smove(chss.frstn10main);
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn3main);
  });
};
chss.frstn9a1m.onEnter = function () {
  area_init(area.frstn9a1);
};

// The pack leader's hollow. Yamato asks the player to look before killing, so the
// room leads with what is written on the ground and keeps the fight behind a
// deliberate choice. After the kill the same scene reports the aftermath instead,
// and the crack it describes is the question Chapter III answers.
chss.frstn10main = new Chs();
chss.frstn10main.id = 170;
chss.frstn10main.sl = () => {
  global.flags.inside = false;
  d_loc(i18n.t("runtime.world.locations.dialogue.southern_forest_the_hollow"));
  global.lst_loc = 170;
  if (quest.pckld1.data.killed) {
    learnLore("leaderNotWeak", "leaderFacedCrack", "underTheSouth");
    chs(
      i18n.t("runtime.world.locations.dialogue.hollow_aftermath"),
      true,
      "yellow",
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.report_back_to_the_lodge"),
      false,
      "lime",
    ).addEventListener("click", () => {
      smove(chss.frstn1b1j);
    });
  } else {
    chs(i18n.t("runtime.world.locations.dialogue.hollow_signs"), true);
    chs(
      i18n.t("runtime.world.locations.dialogue.search_the_hollow"),
      false,
    ).addEventListener("click", () => {
      area_init(area.frstn10a1);
    });
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
    smove(chss.frstn9a1m);
  });
};

chss.lsmain1 = new Chs();
chss.lsmain1.id = 106;
addtosector(sector.vcent, chss.lsmain1);
addtosector(sector.vmain1, chss.lsmain1);
chss.lsmain1.sl = () => {
  global.flags.inside = false;
  d_loc(i18n.t("runtime.world.locations.dialogue.village_center_9264705d"));
  global.lst_loc = 106;
  if (isWeather(weather.sunny) || isWeather(weather.clear))
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.the_surroundings_are_flourishing_with_life_nothing_bad_9820b704",
      ),
      true,
    );
  else if (
    isWeather(weather.cloudy) ||
    isWeather(weather.overcast) ||
    isWeather(weather.stormy)
  )
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.you_have_a_feeling_it_might_rain_soon_e4390155",
      ),
      true,
    );
  else if (
    isWeather(weather.storm) ||
    isWeather(weather.rain) ||
    isWeather(weather.drizzle)
  )
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.the_rain_feels_surprisingly_refreshing_78d41eb7",
      ),
      true,
    );
  else if (isWeather(weather.heavyrain) || isWeather(weather.thunder))
    chs(
      i18n.t("runtime.world.locations.dialogue.heavy_rain_flooded_streets", {
        extra:
          getHour() > 6 && getHour() < 21
            ? i18n.t(
                "runtime.world.locations.dialogue.heavy_rain_daytime_suffix",
              )
            : "",
      }),
      true,
    );
  else if (isWeather(weather.misty) || isWeather(weather.foggy))
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.can_t_see_a_meter_in_front_of_59a55bb8",
      ),
      true,
    );
  chs(
    i18n.t("runtime.world.locations.dialogue.check_the_message_board_1e8cdc1c"),
    false,
  ).addEventListener("click", () => {
    smove(chss.mbrd, false);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.enter_dojo_d0023ec5"),
    false,
  ).addEventListener("click", () => {
    smove(chss.t3);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.enter_southern_forest_8582e8e8"),
    false,
  ).addEventListener("click", () => {
    if (!global.flags.frst1u)
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.gate_guard_nothing_for_you_to_do_there_2d0a3214",
        ),
        "yellow",
      );
    else {
      if (!global.flags.frst1um) {
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.gate_guard_you_were_given_permission_to_proceed_5738109f",
          ),
          "yellow",
        );
        global.flags.frst1um = true;
      }
      smove(chss.frstn3main);
    }
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.enter_western_woods_2ca7f1d8"),
    false,
  ).addEventListener("click", () => {
    if (you.lvl >= 6) smove(chss.frstn1main);
    else
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.gate_guard_it_is_too_dangerous_for_you_a457413b",
        ),
        "yellow",
      );
  });
  //  chs('"=> Visit Pill Tower"',false).addEventListener('click',()=>{
  //    smove(chss.pltwr1);
  //  });
  if (global.flags.mkplc1u === true)
    chs(
      i18n.t("runtime.world.locations.dialogue.visit_marketplace_b1170d3e"),
      false,
    ).addEventListener("click", () => {
      smove(chss.mrktvg1);
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.go_home_1fea35fb"),
    false,
    "green",
  ).addEventListener("click", () => {
    smove(chss.home);
  });
  if (!global.flags.scrtgltt)
    chs(
      i18n.t("runtime.world.locations.dialogue.food_stand_7b76597c"),
      false,
    ).addEventListener("click", () => {
      if (skl.trad.lvl >= 2 && random() < 0.2) global.flags.scrtglti = true;
      if (global.flags.scrtglti === true) {
        chs(i18n.t("runtime.world.locations.dialogue.text_6eae3a5b"), true);
        chs(
          i18n.t("runtime.world.locations.dialogue.text_5bab61eb"),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.passerby_looking_for_the_foodstand_guy_he_took_814f3bc4",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.well_then_1aa6e0a2"),
            false,
          ).addEventListener("click", () => {
            global.flags.scrtgltt = true;
            smove(chss.lsmain1, false);
          });
        });
      } else smove(chss.vndr1, false);
    });
  if (random() < 0.15)
    chs(
      i18n.t("runtime.world.locations.dialogue.shady_kid_6c0aa84d"),
      false,
      "springgreen",
    ).addEventListener("click", () => {
      smove(chss.vndrkd1, false);
    });

  // chs('"test"',false,'red').addEventListener('click',()=>{
  //   chss.tst.sl();
  // });
  if (!global.flags.catget)
    chs(
      i18n.t("runtime.world.locations.dialogue.approach_the_cat_615ce225"),
      false,
    ).addEventListener("click", () => {
      smove(chss.cat1);
      if (!global.stat.cat_c) global.stat.cat_c = 0;
    });
  if (!global.flags.mkplc1u) {
    if (
      global.flags.dj1end === true &&
      global.flags.pmfspmkm1 !== true &&
      random() < 0.4
    ) {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.paper_boy_hey_this_is_for_you_44337a5e",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.text_5bab61eb"),
        false,
      ).addEventListener("click", () => {
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.village_center_marketplace_a6fb36a7",
    ),
  );
  global.lst_loc = 127;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.the_marketplace_feels_busy_aa346819",
    ),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.grocery_shop_b72af719"),
    false,
    "gold",
  ).addEventListener("click", () => {
    smove(chss.grc1);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.general_store_4e5f55b9"),
    false,
    "gold",
  ).addEventListener("click", () => {
    smove(chss.gens1);
  });
  if (global.flags.phai1udt)
    chs(
      i18n.t("runtime.world.locations.dialogue.herbalist_fbb59938"),
      false,
      "gold",
    ).addEventListener("click", () => {
      smove(chss.pha1);
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.nervous_guy_f59691fc"),
    false,
  ).addEventListener("click", () => {
    smove(chss.fdwrg1qt);
  });

  if (global.flags.grddtjb)
    chs(
      i18n.t("runtime.world.locations.dialogue.checkpoint_14922c64"),
      false,
      "hotpink",
    ).addEventListener("click", () => {
      if (getHour() >= 7 && getHour() <= 10) {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.lookout_guard_here_for_work_you_won_t_48dab34f",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.alright_a43737e6"),
          false,
        ).addEventListener("click", () => {
          if (getHour() >= 7 && getHour() <= 10) {
            giveQst(quest.grds1);
            smove(chss.jbgd1);
          } else {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.lookout_guard_too_damn_late_next_time_don_d5325925",
              ),
              true,
            );
            chs(
              i18n.t("runtime.world.locations.dialogue.ah_01a50814"),
              false,
            ).addEventListener("click", () => {
              smove(chss.lsmain1);
            });
          }
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.maybe_not_4436a58e"),
          false,
        ).addEventListener("click", () => {
          smove(chss.mrktvg1);
        });
      } else {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.lookout_guard_if_you_want_work_come_at_c51fe475",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
          false,
        ).addEventListener("click", () => {
          smove(chss.mrktvg1);
        });
      }
    });
  // Chapter III, the second sign. The old man told the player they would be
  // laughed at here, and they are — but the market contradicts itself, and the
  // contradictions are the point. Nobody in the village is a witness; they are
  // people with opinions.
  if (
    quest.undcty1.data.started &&
    !quest.undcty1.data.signs.includes("market")
  )
    chs(
      i18n.t("runtime.world.locations.dialogue.ask_around_the_market"),
      false,
      "yellow",
    ).addEventListener("click", () => {
      chs(
        i18n.t("runtime.world.locations.dialogue.market_rumours"),
        true,
        "yellow",
        0,
        0,
        0,
        ".9em",
      );
      learnLore("lockedCellar");
      findUndercitySign("market");
      chs(
        i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
        false,
      ).addEventListener("click", () => {
        smove(chss.mrktvg1, false);
      });
    });
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.return_back_to_the_village_center_f78bf32b",
    ),
    false,
  ).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};
chss.mrktvg1.onEnter = function () {
  if (!timers.mktwawa1)
    timers.mktwawa1 = setInterval(function () {
      if (random() < 0.1) {
        if (!global.text.mktwawa1)
          global.text.mktwawa1 = i18n.get("gameText.mktwawa1");
        msg(
          i18n.format(select(global.text.mktwawa1), { amount: rand(15) }),
          // The crier drew a fully random rgb(), which regularly landed on a
          // colour as dark as the message log's own rgb(36, 21, 59) background
          // and left the line unreadable. The hue still changes every shout —
          // that variety is the whole point of a marketplace — but lightness and
          // saturation are fixed where the text stays legible.
          "hsl(" + rand(359) + ", 75%, 70%)",
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.village_center_marketplace_entry_gate_d83b4644",
    ),
  );
  global.lst_loc = 159;
  const c = chs(
    i18n.t(
      "runtime.world.locations.dialogue.you_are_standing_on_guard_duty_this_isn_dae82c19",
    ),
    true,
  );
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
  chs(
    i18n.t("runtime.world.locations.dialogue.be_bored_67b14685"),
    false,
  ).addEventListener("click", () => {
    msg(
      select(i18n.get("runtime.world.locations.dialogue.guard_bored_messages")),
      "lightgrey",
    );
  });
  // The post had no exit at all: the player was held here until the shift ended
  // at 20:00. Leaving early simply forfeits the pay.
  chs(
    i18n.t("runtime.world.locations.dialogue.leave_guard_post"),
    false,
  ).addEventListener("click", () => {
    clearInterval(timers.job1t);
    clearInterval(timers.rdngdots);
    global.flags.work = false;
    msg(
      i18n.t("runtime.world.locations.dialogue.guard_post_abandoned"),
      "lightgrey",
    );
    smove(chss.mrktvg1);
  });
};
chss.jbgd1.onEnter = function () {
  timers.job1t = setInterval(() => {
    if (getHour() >= 20) {
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.lookout_guard_work_s_done_for_today_you_b11ed2ce",
        ),
      );
      finishQst(quest.grds1);
      global.flags.work = false;
      clearInterval(timers.job1t);
      smove(chss.home);
    } else {
      giveSkExp(skl.ptnc, 0.08);
      if (random() <= 0.01)
        msg(
          select(
            i18n.get("runtime.world.locations.dialogue.guard_bored_messages"),
          ),
          "lightgrey",
        );
      if (random() <= 0.0005 + skl.seye.lvl * 0.0002) {
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.a_passerby_dropped_a_coin_sweet_fbb80e82",
          ),
          "lime",
        );
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
  d_loc(i18n.t("runtime.world.locations.dialogue.marketplace_stalls_e2ed2335"));
  // Once Yamato has named Dein, this man has something to say — but only to a
  // player who once left him alone instead of pressing him. That is what
  // flags.fdwrgkind has been recording all this time.
  if (
    global.flags.deintrail &&
    global.flags.fdwrgkind &&
    !quest.nrvs1.data.done
  ) {
    if (!quest.nrvs1.data.started) {
      chs(
        i18n.t("runtime.world.locations.dialogue.nervous_guy_approaches"),
        true,
        "yellow",
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.hear_him_out"),
        false,
        "lime",
      ).addEventListener("click", () => {
        giveQst(quest.nrvs1);
        smove(chss.fdwrg1qt, false);
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.walk_away_10f56939"),
        false,
      ).addEventListener("click", () => {
        smove(chss.mrktvg1, false);
      });
      return;
    }
    chs(
      i18n.t("runtime.world.locations.dialogue.nervous_guy_confession"),
      true,
      "yellow",
      0,
      0,
      0,
      ".9em",
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.ask_what_he_wanted"),
      false,
      "lime",
    ).addEventListener("click", () => {
      chs(
        i18n.t("runtime.world.locations.dialogue.nervous_guy_second_way"),
        true,
        "gold",
        0,
        0,
        0,
        ".9em",
      );
      quest.nrvs1.data.heard = true;
      learnLore("secondWayIn");
      chs(
        i18n.t("runtime.world.locations.dialogue.tell_him_it_is_not_his_fault"),
        false,
        "lime",
      ).addEventListener("click", () => {
        finishQst(quest.nrvs1);
        smove(chss.mrktvg1, false);
      });
    });
    return;
  }
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.nervous_guy_argh_what_am_i_gonna_do_128a87bb",
    ),
    true,
  );
  // He is a hook for later story work rather than a quest giver, so pressing
  // him only ever earns patience, and backing off is what the game rewards.
  chs(
    i18n.t("runtime.world.locations.dialogue.nervous_guy_ask"),
    false,
  ).addEventListener("click", () => {
    msg(
      select(
        i18n.get(
          "runtime.world.locations.dialogue.nervous_guy_brushoff_messages",
        ),
      ),
      "lightgrey",
    );
    giveSkExp(skl.ptnc, 1);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.nervous_guy_leave_alone"),
    false,
  ).addEventListener("click", () => {
    if (!global.flags.fdwrgkind) {
      global.flags.fdwrgkind = true;
      you.karma++;
      msg(
        i18n.t("runtime.world.locations.dialogue.nervous_guy_kindness"),
        "lime",
      );
    }
    smove(chss.mrktvg1, false);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.walk_away_10f56939"),
    false,
  ).addEventListener("click", () => {
    smove(chss.mrktvg1, false);
  });
};

chss.grc1 = new Chs();
chss.grc1.id = 128;
chss.grc1.effectors = [{ e: effector.shop }];
chss.grc1.sl = () => {
  global.flags.inside = true;
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.marketplace_grocery_shop_aa1c7f40",
    ),
  );
  global.lst_loc = 128;
  chs(
    i18n.t("runtime.world.locations.dialogue.grocery_old_lady_greeting", {
      greeting: select(
        i18n.get("runtime.world.locations.dialogue.grocery_old_lady_greetings"),
      ),
    }),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.purchase_20fc044d"),
    false,
    "orange",
  ).addEventListener("click", () => {
    chs_spec(4, vendor.grc1);
    vendor.grc1.restocked = false;
    clearInterval(timers.vndrstkchk);
    timers.vndrstkchk = setInterval(function () {
      if (vendor.grc1.restocked === true) {
        clearInterval(timers.vndrstkchk);
        vendor.grc1.restocked = false;
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.we_re_restocking_step_out_for_a_minute_20bfc037",
          ),
        );
        smove(chss.mrktvg1, false);
      }
    });
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
      "",
      "",
      null,
      null,
      null,
      true,
    ).addEventListener("click", () => {
      smove(chss.grc1, false);
      clearInterval(timers.vndrstkchk);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
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
        select(
          i18n.get(
            "runtime.world.locations.dialogue.market_coin_find_messages",
          ),
        ),
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.marketplace_shabby_general_store_fb5064cb",
    ),
  );
  global.lst_loc = 129;
  chs(
    i18n.t("runtime.world.locations.dialogue.sleeping_shopkeeper_greeting", {
      greeting: select(
        i18n.get(
          "runtime.world.locations.dialogue.sleeping_shopkeeper_greetings",
        ),
      ),
    }),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.purchase_20fc044d"),
    false,
    "orange",
  ).addEventListener("click", () => {
    chs_spec(4, vendor.gens1);
    vendor.gens1.restocked = false;
    clearInterval(timers.vndrstkchk);
    timers.vndrstkchk = setInterval(function () {
      if (vendor.gens1.restocked === true) {
        clearInterval(timers.vndrstkchk);
        vendor.gens1.restocked = false;
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.we_re_restocking_step_out_for_a_minute_20bfc037",
          ),
        );
        smove(chss.mrktvg1, false);
      }
    });
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
      "",
      "",
      null,
      null,
      null,
      true,
    ).addEventListener("click", () => {
      smove(chss.gens1, false);
      clearInterval(timers.vndrstkchk);
    });
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.sell_goods_action"),
    false,
    "orange",
  ).addEventListener("click", () => {
    smove(chss.gensell, false);
  });
  if (item.wvbkt.have)
    chs(
      i18n.t("runtime.world.locations.dialogue.sell_straw_baskets_action", {
        coin: dom.coincopper,
      }),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.sleeping_shopkeeper_basket_offer",
          { coin: dom.coincopper },
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.sell_your_goods_df98aadf"),
        false,
        "lime",
      ).addEventListener("click", () => {
        if (item.wvbkt.amount > 0) {
          giveWealth(item.wvbkt.amount * 15);
          item.wvbkt.amount = 0;
          removeItem(item.wvbkt);
          smove(chss.gens1, false);
        } else {
          smove(chss.gens1, false);
          msg(i18n.t("runtime.world.locations.dialogue.text_5bab61eb"));
        }
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.maybe_next_time_b3689181"),
        false,
      ).addEventListener("click", () => {
        smove(chss.gens1, false);
      });
    });
  // Chapter III. The old man has been saying for a month that something is
  // digging under the village, and the only place the game ever said it was
  // behind the infestation offer below — which needs a badly infested basement
  // and takes on the order of a hundred in-game days to unlock. Yamato's
  // pack-leader report sends the player here on purpose, so this asks him
  // directly and needs nothing but that word.
  if (global.flags.undercity1 && !quest.undcty1.data.done)
    chs(
      i18n.t("runtime.world.locations.dialogue.ask_about_the_digging"),
      false,
      "yellow",
    ).addEventListener("click", () => {
      learnLore("itDigs", "whatDigs");
      chs(
        i18n.t("runtime.world.locations.dialogue.shopkeeper_digging_account"),
        true,
        "yellow",
        0,
        0,
        0,
        ".9em",
      );
      if (!quest.undcty1.data.started) {
        chs(
          i18n.t("runtime.world.locations.dialogue.accept_997df079"),
          false,
          "lime",
        ).addEventListener("click", () => {
          giveQst(quest.undcty1);
          // His account is the first sign, so listening to him counts for
          // something even before the player goes looking.
          findUndercitySign("cellar");
          smove(chss.gens1, false);
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.maybe_next_time_b3689181"),
          false,
        ).addEventListener("click", () => {
          smove(chss.gens1, false);
        });
      } else {
        findUndercitySign("cellar");
        chs(
          i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
          false,
        ).addEventListener("click", () => {
          smove(chss.gens1, false);
        });
      }
    });
  if (area.hmbsmnt.size >= 1000 && global.flags.hbs1 && !global.flags.bmntsmkgt)
    chs(
      i18n.t("runtime.world.locations.dialogue.infestation_problem_84399037"),
      false,
      "grey",
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.sleeping_shopkeeper_basement_smoke_offer",
          { coin: dom.coinsilver },
        ),
        true,
      );
      if (you.wealth >= SILVER * 5)
        chs(
          i18n.t("runtime.world.locations.dialogue.sounds_good_b5ba5cc9"),
          false,
          "lime",
        ).addEventListener("click", () => {
          if (you.wealth < SILVER * 5) return;
          spend(SILVER * 5);
          giveItem(item.bmsmktt);
          global.flags.bmntsmkgt = true;
          smove(chss.gens1, false);
        });
      chs(
        i18n.t("runtime.world.locations.dialogue.too_expensive_d4abf831"),
        false,
      ).addEventListener("click", () => {
        smove(chss.gens1, false);
      });
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
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
        select(
          i18n.get(
            "runtime.world.locations.dialogue.market_coin_find_messages",
          ),
        ),
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

// Selling. Until now the only things the game would buy back were firewood, straw
// baskets and cure grass, each written out by hand at the one vendor who wanted it
// -- so everything else a hunter came home with had no buyer at all and the only
// thing to do with it was destroy it. The general store buys anything, which is
// what a general store is for.
//
// Its own scene rather than a nested dialogue, so that selling one thing returns to
// the list with the rest of it still there.
chss.gensell = new Chs();
chss.gensell.id = 171;
chss.gensell.effectors = [{ e: effector.shop }];
chss.gensell.sl = () => {
  global.flags.inside = true;
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.marketplace_shabby_general_store_fb5064cb",
    ),
  );
  global.lst_loc = 171;
  // The list itself is a bounded, scrolling panel built by chs_spec, the same as
  // the shop's stock. Rendering one choice per item instead let a full inventory
  // run off the bottom of the window.
  chs_spec(6, vendor.gens1);
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
    "",
    "",
    null,
    null,
    null,
    true,
  ).addEventListener("click", () => {
    smove(chss.gens1, false);
  });
};

chss.pha1 = new Chs();
chss.pha1.id = 166;
chss.pha1.effectors = [{ e: effector.shop }];
chss.pha1.sl = () => {
  global.flags.inside = true;
  d_loc(
    i18n.t("runtime.world.locations.dialogue.marketplace_herbalist_a5ede720"),
  );
  global.lst_loc = 166;
  chs(
    i18n.t("runtime.world.locations.dialogue.herbalist_greeting", {
      greeting: select(
        i18n.get("runtime.world.locations.dialogue.herbalist_greetings"),
      ),
    }),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.purchase_20fc044d"),
    false,
    "orange",
  ).addEventListener("click", () => {
    chs_spec(4, vendor.pha1);
    vendor.pha1.restocked = false;
    clearInterval(timers.vndrstkchk);
    timers.vndrstkchk = setInterval(function () {
      if (vendor.pha1.restocked === true) {
        clearInterval(timers.vndrstkchk);
        vendor.pha1.restocked = false;
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.we_re_restocking_step_out_for_a_minute_20bfc037",
          ),
        );
        smove(chss.mrktvg1, false);
      }
    });
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
      "",
      "",
      null,
      null,
      null,
      true,
    ).addEventListener("click", () => {
      smove(chss.pha1, false);
      clearInterval(timers.vndrstkchk);
    });
  });
  if (item.hrb1.amount >= 50)
    chs(
      i18n.t("runtime.world.locations.dialogue.sell_cure_grass_action", {
        coin: dom.coincopper,
      }),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t("runtime.world.locations.dialogue.herbalist_cure_grass_offer", {
          coin: dom.coincopper,
        }),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.sell_your_goods_df98aadf"),
        false,
        "lime",
      ).addEventListener("click", () => {
        if (item.hrb1.amount >= 50) {
          global.stat.hbhbsld++;
          giveWealth(15);
          item.hrb1.amount -= 50;
          reduce(item.hrb1);
          if (global.stat.hbhbsld >= 7 && !global.flags.hbhbgft) {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.herbalist_you_were_such_a_great_help_bringing_54533523",
              ),
              true,
            );
            chs(
              i18n.t("runtime.world.locations.dialogue.accept_997df079"),
              false,
              "lime",
            ).addEventListener("click", () => {
              giveItem(item.hptn1, 15);
              giveItem(item.hptn2, 3);
              vendor.pha1.data.rep =
                vendor.pha1.data.rep + 10 > 100
                  ? 100
                  : vendor.pha1.data.rep + 10;
              msg(
                i18n.t(
                  "runtime.world.locations.dialogue.the_herbalist_likes_you_a_bit_more_d2c5b9ed",
                ),
                "lime",
              );
              global.flags.hbhbgft = true;
              smove(chss.pha1, false);
              return;
            });
          }
          if (item.hrb1.amount < 50) smove(chss.pha1, false);
        } else {
          smove(chss.pha1, false);
          msg(i18n.t("runtime.world.locations.dialogue.text_5bab61eb"));
        }
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.rather_not_42a4bfe4"),
        false,
      ).addEventListener("click", () => {
        smove(chss.pha1, false);
      });
    });
  if (item.htrsvr.have)
    chs(
      i18n.t("runtime.world.locations.dialogue.deliver_the_bag_5e408fc4"),
      false,
      "lightblue",
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.herbalist_and_who_might_you_be_ohhhh_aren_8b3adab0",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.i_can_do_it_551d1ec2"),
        false,
      ).addEventListener("click", () => {
        removeItem(item.htrsvr);
        giveItem(item.atd1, 3);
        giveItem(item.hptn1, 10);
        giveItem(item.psnwrd);
        giveItem(item.hptn2);
        giveItem(item.hbtsvr);
        smove(chss.pha1);
      });
    });

  chs(
    i18n.t("runtime.world.locations.dialogue.return_back_57c1bb08"),
    false,
  ).addEventListener("click", () => {
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
        select(
          i18n.get(
            "runtime.world.locations.dialogue.market_coin_find_messages",
          ),
        ),
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.village_center_street_food_stand_f1a65bda",
    ),
  );
  global.lst_loc = 116;
  vendor.stvr1.restocked = false;
  clearInterval(timers.vndrstkchk);
  timers.vndrstkchk = setInterval(function () {
    if (vendor.stvr1.restocked === true) {
      clearInterval(timers.vndrstkchk);
      vendor.stvr1.restocked = false;
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.we_re_restocking_step_out_for_a_minute_20bfc037",
        ),
      );
      smove(chss.lsmain1, false);
    }
  });
  const hi = i18n.t("runtime.world.locations.dialogue.street_merchant_welcome");
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
        dom.vndr1.innerHTML = i18n.t(
          "runtime.world.locations.interface.sorry_you_can_t_afford_that_30498aa1",
        );
        timers.shopcant = setTimeout(() => {
          dom.vndr1.innerHTML = hi;
        }, 1000);
      }
    });
    addDesc(dom.vndrs, itm[0]);
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
    false,
  ).addEventListener("click", () => {
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
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.village_center_child_trader_4d0ce6b3",
    ),
  );
  global.lst_loc = 123;
  vendor.kid1.restocked = false;
  clearInterval(timers.vndrstkchk);
  timers.vndrstkchk = setInterval(function () {
    if (vendor.kid1.restocked === true) {
      clearInterval(timers.vndrstkchk);
      vendor.kid1.restocked = false;
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.you_step_out_for_a_moment_i_m_7f577a2c",
        ),
      );
      smove(chss.lsmain1, false);
    }
  });
  const hi = i18n.t("runtime.world.locations.dialogue.child_trader_welcome");
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
        dom.vndr1.innerHTML = i18n.t(
          "runtime.world.locations.interface.bring_money_next_time_7a51ad8c",
        );
        timers.shopcant = setTimeout(() => {
          dom.vndr1.innerHTML = hi;
        }, 1000);
      }
    });
    addDesc(dom.vndrs, itm[0]);
  }
  if (skl.fgt.lvl >= 5 && !global.flags.vndrkd1sp1)
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.show_me_something_better_62a6331a",
      ),
      false,
      "darkgrey",
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.child_trader_hidden_book_offer",
          { coin: dom.coinsilver },
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.give_me_53bbe1b0"),
        false,
        "lime",
      ).addEventListener("click", () => {
        if (you.wealth >= 300) {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.there_ya_go_enjoy_9ad43329",
            ),
            true,
          );
          global.flags.vndrkd1sp1 = true;
          giveItem(item.fgtsb1);
          spend(300);
          chs(
            i18n.t("runtime.world.locations.dialogue.sweet_purchase_46422d21"),
            false,
          ).addEventListener("click", () => {
            smove(chss.lsmain1, false);
          });
        } else {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.no_money_no_goods_don_t_waste_my_b58c6055",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
            false,
          ).addEventListener("click", () => {
            smove(chss.lsmain1, false);
          });
        }
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.nah_5ee4d9da"),
        false,
        "Red",
      ).addEventListener("click", () => {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.no_worries_i_ll_keep_it_for_you_c57f533f",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
          false,
        ).addEventListener("click", () => {
          smove(chss.lsmain1, false);
        });
      });
    });
  else if (
    global.stat.moneyg >= 1000 &&
    !global.flags.vndrkd1sp2 &&
    global.flags.vndrkd1sp1
  )
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.show_me_something_better_62a6331a",
      ),
      false,
      "darkgrey",
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.child_trader_second_hidden_offer",
          { coin: dom.coinsilver },
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.yes_please_d512bcf0"),
        false,
        "lime",
      ).addEventListener("click", () => {
        if (you.wealth >= 500) {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.deal_successfully_made_fc4331e1",
            ),
            true,
          );
          global.flags.vndrkd1sp2 = true;
          giveItem(item.bfsnwt);
          spend(500);
          chs(
            i18n.t("runtime.world.locations.dialogue.score_8246cde9"),
            false,
          ).addEventListener("click", () => {
            smove(chss.lsmain1, false);
          });
        } else {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.no_money_no_goods_don_t_waste_my_b58c6055",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
            false,
          ).addEventListener("click", () => {
            smove(chss.lsmain1, false);
          });
        }
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.nah_5ee4d9da"),
        false,
        "Red",
      ).addEventListener("click", () => {
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.no_worries_i_ll_keep_it_for_you_c57f533f",
          ),
          true,
        );
        chs(
          i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
          false,
        ).addEventListener("click", () => {
          smove(chss.lsmain1, false);
        });
      });
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
    false,
  ).addEventListener("click", () => {
    smove(chss.lsmain1, false);
  });
};
chss.vndrkd1.onLeave = function () {
  clearInterval(timers.vndrstkchk);
};

chss.tstauto = new Chs();
chss.tstauto.id = -1;
chss.tstauto.sl = () => {
  d_loc(i18n.t("runtime.world.locations.dialogue.test_auto_9fc15263"));
  global.lst_loc = -1;
  dom.testauto = chs(
    i18n.t("runtime.world.locations.dialogue.test_984816fd"),
    true,
  );
  if (!global.flags.testauto_1 || global.flags.testauto_1 === false)
    chs(
      i18n.t("runtime.world.locations.dialogue.run_b1b39260"),
      false,
    ).addEventListener("click", () => {
      global.flags.testauto_1 = true;
      timers.testauto1 = setInterval(() => {
        dom.testauto.innerHTML = rand(9999999);
      }, 1000);
      chss.tstauto.sl();
    });
  else
    chs(
      i18n.t("runtime.world.locations.dialogue.stop_9e253470"),
      false,
    ).addEventListener("click", () => {
      global.flags.testauto_1 = false;
      chss.tstauto.sl();
      clearInterval(timers.testauto1);
    });
  chs(
    i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
    false,
  ).addEventListener("click", () => {
    chss.lsmain1.sl();
  });
};

chss.tst = new Chs();
chss.tst.id = -1;
chss.tst.sl = () => {
  d_loc(i18n.t("runtime.world.locations.dialogue.test_640ab2ba"));
  global.lst_loc = -1;
  dom.tst = chs(i18n.t("runtime.world.locations.dialogue.test_984816fd"), true);
  global.flags.btl = true;
  global.flags.civil = false;
  area_init(area.tst);
  chs(
    i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
    false,
  ).addEventListener("click", () => {
    chss.lsmain1.sl();
  });
};

function showCatPetReaction(anchor, reaction) {
  const reactionElement = addElement(
    document.body,
    "span",
    null,
    "cat-pet-reaction",
  );
  reactionElement.textContent = reaction;

  const scale = Number.parseFloat(document.body.style.zoom) || 1;
  const measuredAnchorRect = anchor.getBoundingClientRect();
  const anchorRect = {
    left: measuredAnchorRect.left / scale,
    top: measuredAnchorRect.top / scale,
    width: measuredAnchorRect.width / scale,
  };
  const viewportWidth = window.innerWidth / scale;
  const viewportMargin = 8 / scale;
  const anchorGap = 6 / scale;
  const maximumLeft = Math.max(
    viewportMargin,
    viewportWidth - reactionElement.offsetWidth - viewportMargin,
  );
  const left = Math.min(
    maximumLeft,
    Math.max(
      viewportMargin,
      anchorRect.left + (anchorRect.width - reactionElement.offsetWidth) / 2,
    ),
  );
  const top = Math.max(
    viewportMargin,
    anchorRect.top - reactionElement.offsetHeight - anchorGap,
  );

  reactionElement.style.left = left + "px";
  reactionElement.style.top = top + "px";
  reactionElement.style.setProperty(
    "--cat-reaction-rise",
    Math.min(48, Math.max(0, top - viewportMargin)) + "px",
  );

  const removeReaction = () => {
    clearTimeout(cleanupTimer);
    reactionElement.remove();
  };
  reactionElement.addEventListener("animationend", removeReaction, {
    once: true,
  });
  const cleanupTimer = setTimeout(removeReaction, 2400);
}

chss.cat1 = new Chs();
chss.cat1.id = 107;
addtosector(sector.vcent, chss.cat1);
addtosector(sector.vmain1, chss.cat1);
chss.cat1.sl = () => {
  d_loc(i18n.t("runtime.world.locations.dialogue.village_center_cat_7ac96bff")); //global.lst_loc = 107;
  const w = !global.stat.cat_c
    ? chs(
        i18n.t("runtime.world.locations.dialogue.there_is_a_cat_1b5af153"),
        true,
      )
    : chs(
        i18n.t("runtime.world.locations.interface.cat_pet_count", {
          count: global.stat.cat_c,
        }),
        true,
      );
  chs(
    i18n.t("runtime.world.locations.dialogue.pet_the_cat_80e6fbdc"),
    false,
  ).addEventListener("click", (x) => {
    showCatPetReaction(
      x.currentTarget,
      select([":3", "'w'", "'ω'", "(=・∀・=)", "*ﾟヮﾟ"]),
    );
    global.stat.cat_c++;
    if (global.stat.cat_c < 333) skl.pet.use();
    w.innerHTML = i18n.t("runtime.world.locations.interface.cat_pet_count", {
      count: global.stat.cat_c,
    });
    if (global.stat.cat_c >= 100) {
      if (!global.flags.cat_g) {
        clr_chs(2);
        global.flags.cat_g = true;
        chs(
          i18n.t("runtime.world.locations.dialogue.text_010cc1f8"),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.cat_wants_to_tag_along_cd2ba7dc",
            ),
            true,
          );
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.take_it_with_you_3aac4be9",
            ),
            false,
          ).addEventListener("click", () => {
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
            msg(
              i18n.t(
                "runtime.world.locations.dialogue.the_cat_decided_to_move_into_your_house_59b78318",
              ),
              "lime",
            );
            smove(chss.lsmain1);
          });
          chs(
            i18n.t("runtime.world.locations.dialogue.leave_it_as_is_b08b1981"),
            false,
          ).addEventListener("click", () => {
            smove(chss.lsmain1);
          });
        });
        chs(
          i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
          false,
        ).addEventListener("click", () => {
          smove(chss.lsmain1);
        });
      }
    }
  });
  if (global.stat.cat_c >= 100) {
    chs(
      i18n.t("runtime.world.locations.dialogue.text_010cc1f8"),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.cat_wants_to_tag_along_cd2ba7dc",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.take_it_with_you_3aac4be9"),
        false,
      ).addEventListener("click", () => {
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
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.the_cat_decided_to_move_into_your_house_59b78318",
          ),
          "lime",
        );
        smove(chss.lsmain1);
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.leave_it_as_is_b08b1981"),
        false,
      ).addEventListener("click", () => {
        smove(chss.lsmain1);
      });
    });
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.lsmain1);
  });
};

global.text.mbrdtt = i18n.get("gameText.mbrdtt");

chss.mbrd = new Chs();
chss.mbrd.id = 108;
addtosector(sector.vcent, chss.mbrd);
addtosector(sector.vmain1, chss.mbrd);
chss.mbrd.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.village_center_message_board_f7afa0da",
    ),
  );
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
            i18n.t(
              "runtime.world.locations.dialogue.you_notice_a_little_girl_with_emerald_green_7f452e97",
            ),
            true,
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.text_1a178459"),
            false,
          ).addEventListener("click", () => {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.xiao_xiao_hey_hey_what_are_those_dolls_98e52c9a",
              ),
              true,
            );
            chs(
              i18n.t("runtime.world.locations.dialogue.alright_a43737e6"),
              false,
            ).addEventListener("click", () => {
              global.flags.glqtdltn = true;
              smove(chss.mbrd, false);
            });
          });
        }
        return;
      }
      break;
    }
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.message_board_you_can_find_jobs_or_other_7da2f5ea",
    ),
    true,
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.explore_the_posts_79dc1614"),
    false,
  ).addEventListener("click", () => {
    chs(select(global.text.mbrdtt), true);
    chs(
      i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
      false,
    ).addEventListener("click", () => {
      smove(chss.mbrd, false);
    });
  });
  if (global.flags.frstn1b1g1) {
    chs(
      i18n.t("runtime.world.locations.dialogue.notice_4_f35f6eb5"),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.it_says_here_looking_for_a_anyone_with_4523efd8",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.huh_df76ec94"),
        false,
      ).addEventListener("click", () => {
        global.flags.grddtjb = true;
        smove(chss.mbrd);
      });
    });
    chs(
      i18n.t("runtime.world.locations.dialogue.warning_aed1555d"),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.dangerous_beasts_were_sighted_in_vicinity_of_the_a33affe2",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.i_see_ccf4fd83"),
        false,
      ).addEventListener("click", () => {
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
    chs(
      i18n.t("runtime.world.locations.dialogue.xiao_xiao_e5346004"),
      false,
    ).addEventListener("click", () => {
      smove(chss.xpgdqt1, false);
    });
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.go_back_b9dc1fb2"),
    false,
  ).addEventListener("click", () => {
    smove(chss.lsmain1, false);
  });
};

chss.xpgdqt1 = new Chs();
chss.xpgdqt1.id = 167;
addtosector(sector.vcent, chss.xpgdqt1);
addtosector(sector.vmain1, chss.xpgdqt1);
chss.xpgdqt1.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.village_center_message_board_f7afa0da",
    ),
  );
  global.lst_loc = 166;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.xiao_xiao_what_is_it_what_is_it_7d8a6d88",
    ),
    true,
  );
  const dl1 = findbyid(inv, acc.wdl1.id);
  const dl2 = findbyid(inv, acc.sdl1.id);
  const dl3 = findbyid(inv, acc.bdl1.id);
  const dl4 = findbyid(inv, acc.gdl1.id);
  if (dl1) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.show_xiao_xiao_a_wooden_doll_702c4e01",
      ),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.xiao_xiao_nooooo_it_s_ugly_a96a14ae",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.take_it_back_40dc3e38"),
        false,
      ).addEventListener("click", () => {
        smove(chss.xpgdqt1, false);
      });
    });
  }
  if (dl2) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.show_xiao_xiao_a_straw_doll_c16b52ae",
      ),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.xiao_xiao_nooooo_it_s_creepy_4def24eb",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.take_it_back_40dc3e38"),
        false,
      ).addEventListener("click", () => {
        smove(chss.xpgdqt1, false);
      });
    });
  }
  if (dl3) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.show_xiao_xiao_a_bone_doll_aedf44d2",
      ),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.xiao_xiao_nooooo_it_s_scary_679be07b",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.take_it_back_40dc3e38"),
        false,
      ).addEventListener("click", () => {
        smove(chss.xpgdqt1, false);
      });
    });
  }
  if (dl4) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.show_xiao_xiao_a_soul_doll_9140cb5e",
      ),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.xiao_xiao_waai_thank_you_i_love_it_48a28997",
        ),
        true,
      );
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.claim_your_hardearned_reward_1ed71094",
        ),
        false,
      ).addEventListener("click", () => {
        removeItem(dl4);
        global.flags.glqtdldn = true;
        global.offline_evil_index -= 0.002;
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.you_feel_more_peaceful_04e11bf4",
          ),
          "gold",
        );
        giveItem(acc.ubrlc);
        smove(chss.mbrd, false);
      });
    });
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
    smove(chss.mbrd, false);
  });
};

chss.trd = new Chs();
chss.trd.id = 109;
chss.trd.sl = function (b, x) {
  function readingProgress(remaining) {
    const usesHours = remaining > HOUR;
    const count = usesHours ? (remaining / HOUR) << 0 : remaining << 0;
    const duration = usesHours
      ? i18n.t("runtime.world.locations.dialogue.reading_duration_hours", {
          count,
        })
      : i18n.t("runtime.world.locations.dialogue.reading_duration_minutes", {
          count,
        });
    return i18n.t("runtime.world.locations.dialogue.reading_progress", {
      book: b.name,
      duration,
    });
  }

  global.flags.rdng = true;
  const rd = skl.rdg.use();
  b.data.timep = b.data.timep || 0;
  b.cmax =
    (b.data.time * (1 / (1 + rd / 10))) / you.mods.rdgrt -
    (1 / (1 + rd / 10) - 1) / you.mods.rdgrt;
  let c = b.cmax - b.data.timep;
  if (c < 0) c = 0;
  dom.trdc = chs("", true);
  dom.trd = addElement(dom.trdc, "span");
  dom.trd.innerHTML = readingProgress(c);
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
  // Reading advances by elapsed wall-clock seconds rather than one step per
  // callback, so a throttled background tab no longer stalls the book.
  let readingLastAt = Date.now();
  timers.rdng = setInterval(() => {
    const now = Date.now();
    let steps = Math.floor((now - readingLastAt) / 1000);
    if (steps < 1) return;
    if (steps > 600) steps = 600;
    readingLastAt += steps * 1000;
    for (let step = 0; step < steps; step++) {
      global.stat.rdgtttl++;
      const rd = skl.rdg.use();
      giveSkExp(skl.rdg, x || 1);
      b.cmax =
        (b.data.time * (1 / (1 + rd / 10))) / you.mods.rdgrt -
        (1 / (1 + rd / 10) - 1) / you.mods.rdgrt;
      let c = b.cmax - b.data.timep;
      if (c < 0) c = 0;
      dom.trd.innerHTML = readingProgress(c);
      if (++b.data.timep >= b.cmax) {
        clearInterval(timers.rdng);
        clearInterval(timers.rdngdots);
        global.stat.rdttl++;
        global.flags.rdng = false;
        for (const gg in chss)
          if (chss[gg].id === global.lst_loc) chss[gg].sl();
        b.use();
        reduce(b);
        b.data.timep = 0;
        return;
      }
    }
  }, 1000);
  chs(
    i18n.t("runtime.world.locations.dialogue.stop_reading_90693f3a"),
    false,
  ).addEventListener("click", () => {
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
  d_loc(i18n.t("runtime.world.locations.dialogue.your_home_03e89418"));
  global.lst_loc = 111;
  if (!global.flags.catget || sector.home.data.smkp > 0)
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.your_humble_abode_you_can_rest_here_d6c4fff3",
      ),
      true,
    );
  else {
    if (!global.text.hmcttt) global.text.hmcttt = i18n.get("gameText.hmcttt");
    chs(
      i18n.t("runtime.world.locations.dialogue.home_safe_rest_summary", {
        extra: select(global.text.hmcttt),
      }),
      true,
    );
  }
  if (!global.flags.hbgget)
    chs(
      i18n.t("runtime.world.locations.dialogue.examine_your_bag_2f8e4a92"),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.something_you_ve_forgotten_to_grab_before_there_05ac630a",
        ),
        true,
      );
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.better_take_this_with_you_ce82bcdb",
        ),
        false,
      ).addEventListener("click", () => {
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
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.crash_down_and_take_a_nap_108f2e2c",
    ),
    false,
  ).addEventListener("click", () => {
    if (sector.home.data.smkp > 0) {
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.this_isn_t_time_for_sleep_a6911b18",
        ),
        "red",
      );
      return;
    }
    smove(chss.hbed, false);
  });
  if (!global.flags.chbdfst)
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.examine_your_hidden_stash_fb02e041",
      ),
      false,
    ).addEventListener("click", () => {
      chs(
        i18n.t(
          "runtime.world.locations.dialogue.you_reach_for_a_small_red_box_which_d63eb7b0",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.grab_the_contents_3ff92bbe"),
        false,
      ).addEventListener("click", () => {
        giveItem(item.ywlt);
        giveItem(item.pdeedhs);
        global.flags.chbdfst = true;
        smove(chss.home, false);
      });
    });
  chs(
    global.flags.hbs1 === true
      ? i18n.t("runtime.world.locations.dialogue.enter_the_basement")
      : i18n.t("runtime.world.locations.dialogue.examine_basement_door"),
    false,
  ).addEventListener("click", () => {
    if (!global.flags.hbs1) {
      if (item.key0.have) {
        msg(
          i18n.t("runtime.world.locations.dialogue.click_da9e93d9"),
          "lightgrey",
        );
        msg_add(
          i18n.t(
            "runtime.world.locations.dialogue.the_door_has_opened_61b00f24",
          ),
          "lime",
        );
        global.flags.hbs1 = true;
        smove(chss.home, false);
      } else
        msg(i18n.t("runtime.world.locations.dialogue.it_s_locked_fa34cbc0"));
    } else smove(chss.bsmnthm1, false);
  });
  if (global.flags.hsedchk)
    chs(
      i18n.t("runtime.world.locations.dialogue.furniture_list_ad8ce9d9"),
      false,
      "orange",
      "",
      1,
      8,
    ).addEventListener("click", () => {
      chs_spec(2);
      global.wdwidx = 1;
      chs(
        i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
        false,
      ).addEventListener("click", () => {
        smove(chss.home, false);
      });
    });
  if (scanbyid(furn, furniture.frplc.id)) {
    chs(
      i18n.t("runtime.world.locations.dialogue.examine_fireplace_86d8ade3"),
      false,
    ).addEventListener("click", () => {
      smove(chss.ofrplc, false);
    });
  }
  if (scanbyid(furn, furniture.strgbx.id)) {
    chs(
      i18n.t("runtime.world.locations.dialogue.access_storagebox_d2101360"),
      false,
    ).addEventListener("click", () => {
      smove(chss.sboxhm, false);
    });
  }
  if (global.flags.catget) {
    tcat = findbyid(furn, furniture.cat.id);
    tcat.data.mood = tcat.data.mood || 1;
    chs(
      i18n.t("runtime.world.locations.dialogue.check_on_cat_4517636a"),
      false,
    ).addEventListener("click", () => {
      if (sector.home.data.smkp > 0) {
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.your_cat_went_outside_94b256cc",
          ),
          "yellow",
        );
        return;
      }
      chs_spec(1);
      if (tcat.data.named === false)
        chs(
          i18n.t("runtime.world.locations.dialogue.rename_e0cf0ffd"),
          false,
        ).addEventListener("click", () => {
          chs(
            i18n.t(
              "runtime.world.locations.dialogue.give_your_cat_a_name_can_t_rename_a617a367",
            ),
            true,
          );
          const inp = addElement(dom.ctr_2, "input", "chs");
          inp.style.textAlign = "center";
          inp.style.color = "white";
          inp.style.fontFamily = "MS Gothic";
          chs(
            i18n.t("runtime.world.locations.dialogue.accept_997df079"),
            false,
            "lime",
          ).addEventListener("click", () => {
            if (inp.value == "" || inp.value.search(/ *$/) === 0)
              msg(
                i18n.t(
                  "runtime.world.locations.dialogue.actually_give_it_a_name_maybe_f1195505",
                ),
                "springgreen",
              );
            else if (inp.value.search(/[Kk][Ii][Rr][Ii]/) === 0) {
              msg(
                i18n.t("runtime.world.locations.dialogue.hey_now_o_0d139e89"),
                "crimson",
              );
              dom.gmsgs.children[1].lastChild.style.fontSize = "2em";
            } else {
              tcat.data.name = inp.value;
              tcat.data.named = true;
            }
            smove(chss.home, false);
          });
          chs(
            i18n.t("runtime.world.locations.dialogue.decline_cf19fd47"),
            false,
            "red",
          ).addEventListener("click", () => {
            smove(chss.home, false);
          });
        });
      dom.ctspcl = chs(
        i18n.t("runtime.world.locations.dialogue.pet_named_cat_action", {
          name: tcat.data.name,
        }),
        false,
      );
      dom.ctspcl.addEventListener("click", (x) => {
        global.stat.cat_c++;
        for (const x in global.cptchk) global.cptchk[x]();
        showCatPetReaction(
          x.currentTarget,
          tcat.data.mood > 0.2
            ? select([":3", "'w'", "'ω'", "(=・∀・=)", "*ﾟヮﾟ"])
            : select(["¦3", "ーωー", "( ˘ω˘)", "(´-ω-`)", "(。-∀-)"]),
        );
        tcat.data.mood = tcat.data.mood - 0.01 <= 0 ? 0 : tcat.data.mood - 0.01;
        if (tcat.data.mood >= 0.01) skl.pet.use();
      });
      chs(
        i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
        false,
      ).addEventListener("click", () => {
        smove(chss.home, false);
        clearInterval(timers.caupd);
      });
    });
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.go_outside_8fb69e89"),
    false,
  ).addEventListener("click", () => {
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
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.oh_you_forgot_you_had_this_around_790a5c93",
        ),
        "orange",
      );
      giveItem(wpn.kiknif);
      chss.home.data.gets[0] = true;
    },
    exp: 30,
  },
  {
    c: 0.01,
    f: () => {
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.there_was_a_coin_stuck_between_the_floor_223573db",
        ),
        "orange",
      );
      giveItem(item.lcn);
      chss.home.data.gets[1] = true;
    },
    exp: 3,
  },
];
chss.home.onScout = function () {
  scoutGeneric(this);
};

global.text.bssel = i18n.get("gameText.bssel");
global.text.bsseldark = i18n.get("gameText.bsseldark");

chss.bsmnthm1 = new Chs();
chss.bsmnthm1.id = 158;
addtosector(sector.home, chss.bsmnthm1);
chss.bsmnthm1.effectors = [{ e: effector.dark }];
chss.bsmnthm1.sl = () => {
  d_loc(i18n.t("runtime.world.locations.dialogue.your_home_basement_6a35a8b0"));
  global.lst_loc = 158;
  if (area.hmbsmnt.size > 0) {
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.argh_this_place_is_infested_9787e9d1",
      ),
      true,
      "red",
    );
    area_init(area.hmbsmnt);
  } else {
    if (!cansee())
      chs(
        i18n.t("runtime.world.locations.dialogue.basement_darkness_warning", {
          description: select(global.text.bsseldark),
        }),
        true,
        "darkgrey",
      );
    else {
      chs(select(global.text.bssel), true);
      if (!global.flags.bsmntchck)
        chs(
          i18n.t(
            "runtime.world.locations.dialogue.examine_your_surroundings_bfd27add",
          ),
          false,
        ).addEventListener("click", () => {
          if (!cansee()) {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.your_light_went_off_3ea9ffc4",
              ),
              true,
              "darkgrey",
            );
            chs(
              i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
              false,
            ).addEventListener("click", () => {
              smove(chss.home, false);
            });
          } else {
            chs(
              i18n.t(
                "runtime.world.locations.dialogue.basement_debris_search",
                {
                  chestHint: !global.flags.bsmntchstgt
                    ? i18n.t(
                        "runtime.world.locations.dialogue.basement_giant_chest_hint",
                      )
                    : "",
                },
              ),
              true,
              "orange",
            );
            if (!global.flags.bsmntchstgt)
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.seek_significance_of_a_massive_container_23a96f3f",
                ),
                false,
              ).addEventListener("click", () => {
                chs(
                  i18n.t(
                    "runtime.world.locations.dialogue.it_looks_like_an_ordinary_coffer_except_it_a3d4e2ff",
                  ),
                  true,
                );
                chs(
                  i18n.t(
                    "runtime.world.locations.dialogue.do_exactly_that_81f140cd",
                  ),
                  false,
                  "lime",
                ).addEventListener("click", () => {
                  global.flags.bsmntchstgt = true;
                  giveFurniture(furniture.strgbx);
                  smove(chss.home, false);
                  msg(
                    i18n.t(
                      "runtime.world.locations.dialogue.phew_that_felt_like_a_workout_you_won_cdfe328c",
                    ),
                    "orange",
                  );
                  msg(
                    i18n.t(
                      "runtime.world.locations.dialogue.your_muscles_feel_stronger_e119ebaf",
                    ),
                    "lime",
                  );
                  msg(
                    i18n.t(
                      "runtime.world.locations.dialogue.str_increased_by_1_permanently_c7a659ee",
                    ),
                    "lime",
                  );
                  you.sat *= 0.5;
                  you.stra++;
                  you.stat_r();
                });
              });
            if (!global.flags.bsmntsctgt)
              chs(
                i18n.t(
                  "runtime.world.locations.dialogue.rummage_through_rubble_aefbe619",
                ),
                false,
              ).addEventListener("click", () => {
                chs(
                  i18n.t(
                    "runtime.world.locations.dialogue.indeed_simply_glancing_over_the_rubble_won_t_b07d2843",
                  ),
                  true,
                );
                chs(
                  i18n.t(
                    "runtime.world.locations.dialogue.prepare_for_further_examination_054dee7d",
                  ),
                  false,
                ).addEventListener("click", () => {
                  global.flags.bsmntsctgt = true;
                  giveAction(act.scout);
                  global.current_a.deactivate();
                  global.current_a = act.default;
                  smove(chss.bsmnthm1, false);
                });
              });
            chs(
              i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
              false,
            ).addEventListener("click", () => {
              smove(chss.bsmnthm1, false);
            });
          }
        });
      // Chapter III. All of this needs light, which is the point: the old man told
      // the player to go and look at their own cellar wall properly, and you
      // cannot look at anything down here without a candle lit.
      if (
        quest.undcty1.data.started &&
        !quest.undcty1.data.signs.includes("home")
      )
        chs(
          i18n.t("runtime.world.locations.dialogue.examine_the_old_wall"),
          false,
          "yellow",
        ).addEventListener("click", () => {
          chs(
            i18n.t("runtime.world.locations.dialogue.basement_wall_examined"),
            true,
            "yellow",
            0,
            0,
            0,
            ".9em",
          );
          learnLore("mortarPushed");
          findUndercitySign("home");
          chs(
            i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
            false,
          ).addEventListener("click", () => {
            smove(chss.bsmnthm1, false);
          });
        });
      // Yamato asked to be told before the player touched whatever they found, so
      // the wall stays shut until he has been told and has said his piece.
      else if (global.flags.undercity2 && !quest.undcty1.data.opened)
        chs(
          i18n.t("runtime.world.locations.dialogue.break_through_the_wall"),
          false,
          "crimson",
        ).addEventListener("click", () => {
          chs(
            i18n.t("runtime.world.locations.dialogue.basement_wall_opened"),
            true,
            "crimson",
            0,
            0,
            0,
            ".9em",
          );
          chs(
            i18n.t("runtime.world.locations.dialogue.take_it_down"),
            false,
            "lime",
          ).addEventListener("click", () => {
            quest.undcty1.data.opened = true;
            smove(chss.bsmnthm1, false);
          });
          chs(
            i18n.t("runtime.world.locations.dialogue.leave_it_standing"),
            false,
          ).addEventListener("click", () => {
            smove(chss.bsmnthm1, false);
          });
        });
      if (quest.undcty1.data.opened)
        chs(
          i18n.t("runtime.world.locations.dialogue.go_down_into_the_dark"),
          false,
          "crimson",
        ).addEventListener("click", () => {
          smove(chss.catamn);
        });
    }
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.return_5ced966d"),
    false,
  ).addEventListener("click", () => {
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
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.you_found_a_pouch_with_some_coins_3326e8dc",
        ),
        "lime",
      );
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
        i18n.t(
          "runtime.world.locations.dialogue.you_found_a_pile_of_scattered_firewood_some_748a88f7",
        ),
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
        i18n.t(
          "runtime.world.locations.dialogue.among_the_rabble_and_remains_of_collapsed_bookshelves_793ca3a6",
        ),
        true,
      );
      chs(
        i18n.t("runtime.world.locations.dialogue.i_m_taking_this_45f828ff"),
        false,
      ).addEventListener("click", () => {
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
  d_loc(i18n.t("runtime.world.locations.dialogue.your_home_bed_fa15732f"));
  global.lst_loc = 112;
  let extra = "";
  if (you.alive === false) {
    chs(
      select(
        i18n.get("runtime.world.locations.dialogue.bed_unconscious_messages"),
      ),
      true,
    );
    you.alive = true;
  } else {
    if (global.flags.catget)
      extra = select(
        i18n.get("runtime.world.locations.dialogue.bed_cat_rest_messages"),
      );
    chs(
      i18n.t("runtime.world.locations.dialogue.bed_rest_summary", { extra }),
      true,
    );
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.get_up_3fdf06df"),
    false,
  ).addEventListener("click", () => {
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
  d_loc(
    i18n.t("runtime.world.locations.dialogue.your_home_fireplace_9a8e298d"),
  );
  const fire = findbyid(furn, furniture.frplc.id);
  global.lst_loc = 117;
  //dom.d_lctt.innerHTML+='<span style="color:orange;font-size:1.2em">&nbspⓞ<span>'
  const its = [];
  if (findbyid(inv, item.fwd1.id))
    its.push([
      findbyid(inv, item.fwd1.id),
      i18n.t("runtime.world.locations.fireplaceFuel.firewood"),
      30,
    ]);
  if (findbyid(inv, item.coal1.id))
    its.push([
      findbyid(inv, item.coal1.id),
      i18n.t("runtime.world.locations.fireplaceFuel.coal"),
      300,
    ]);
  if (findbyid(inv, item.coal2.id))
    its.push([
      findbyid(inv, item.coal2.id),
      i18n.t("runtime.world.locations.fireplaceFuel.charcoal"),
      300,
    ]);
  if (findbyid(inv, wpn.stk1.id))
    its.push([
      findbyid(inv, wpn.stk1.id),
      i18n.t("runtime.world.locations.fireplaceFuel.stick"),
      15,
    ]);
  if (!global.text.fplcextra)
    global.text.fplcextra = i18n.get("gameText.fplcextra");
  if (!global.text.frplcfrextra)
    global.text.frplcfrextra = i18n.get("gameText.frplcfrextra");
  let textra0;
  if (fire.data.fuel === 0) textra0 = "";
  else if (fire.data.fuel <= 60) textra0 = global.text.frplcfrextra[0];
  else if (fire.data.fuel >= 130 && fire.data.fuel <= 300)
    textra0 = global.text.frplcfrextra[1];
  else if (fire.data.fuel >= 300 && fire.data.fuel <= 540)
    textra0 = global.text.frplcfrextra[2];
  else if (fire.data.fuel >= 540) textra0 = global.text.frplcfrextra[3];
  dom.frpls = chs(
    i18n.t("runtime.world.locations.dialogue.fireplace_summary", {
      extra: select(global.text.fplcextra),
      fuelStatus: textra0,
    }),
    true,
  );
  if (!global.flags.fplcgtwd)
    chs(
      i18n.t(
        "runtime.world.locations.dialogue.retrieve_spare_firewood_you_have_a_feeling_you_f63de8d0",
      ),
      false,
    ).addEventListener("click", function () {
      msg(
        i18n.t(
          "runtime.world.locations.dialogue.you_have_some_lying_around_nearby_df6fd35e",
        ),
        "orange",
      );
      global.flags.fplcgtwd = true;
      giveItem(item.fwd1, 3);
      smove(chss.ofrplc, false);
    });
  for (const a in its) {
    chs(
      i18n.format(
        select(
          i18n.get(
            "runtime.world.locations.dialogue.fireplace_add_fuel_actions",
          ),
        ),
        { fuel: its[a][1] },
      ),
      false,
    ).addEventListener("click", function () {
      its[a][0].amount--;
      // The clamp compared the new total against the value of the single piece
      // just added, and `fuel + piece > piece` is true whenever there is any fuel
      // at all -- so the fire was *assigned* the piece's own value every time. A
      // stick worth 15 thrown onto a coal fire worth 300 took it down to 15, and
      // the fire could never hold more than its largest single piece. That made
      // the "blazing" and "roaring" states below, which want 300 and 540,
      // unreachable by anything but one enormous log.
      //
      // A day's worth of burning is the ceiling. effect.fplc.use reads the fuel as
      // the effect's remaining duration in ticks, and a tick is a minute, so this
      // is the same DAY the calendar uses.
      fire.data.fuel = Math.min(DAY, fire.data.fuel + its[a][2]);
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
    chs(
      i18n.t("runtime.world.locations.dialogue.light_a_fire_70f7d31e"),
      false,
      "orange",
    ).addEventListener("click", () => {
      if (effect.fplc.active)
        msg(
          i18n.t(
            "runtime.world.locations.dialogue.fire_is_already_on_d499af67",
          ),
          "orange",
        );
      else {
        afire.data.fuel--;
        fire.data.fuel += 16;
      }
    });
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.step_away_ea751560"),
    false,
  ).addEventListener("click", () => {
    smove(chss.home, false);
  });
};

chss.sboxhm = new Chs();
chss.sboxhm.id = 131;
addtosector(sector.home, chss.sboxhm);
chss.sboxhm.sl = () => {
  d_loc(
    i18n.t("runtime.world.locations.dialogue.your_home_storage_box_e6684975"),
  );
  //  chs('"Your botomless storage container, full of your belongings"',true)
  chs_spec(3, home.trunk);
  chs(
    i18n.t("runtime.world.locations.dialogue.step_away_6ca5c8a5"),
    false,
    "",
    "",
    null,
    null,
    null,
    true,
  ).addEventListener("click", () => {
    smove(chss.home, false);
  });
};

global.text.catasound = i18n.get("gameText.catasound");

chss.catamn = new Chs();
chss.catamn.id = 132;
addtosector(sector.cata1, chss.catamn);
chss.catamn.sl = () => {
  d_loc(
    i18n.t("runtime.world.locations.dialogue.catacombs_the_entryway_f1be91b5"),
  );
  global.lst_loc = 132;
  chs(
    i18n.t(
      "runtime.world.locations.dialogue.you_have_entered_the_catacombs_b8074062",
    ),
    true,
    "lightgrey",
    "black",
  );
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata1);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.exit_24c04d4e"),
    false,
  ).addEventListener("click", () => {
    // This used to come up in the village centre, which was the only sign that
    // the region was orphaned rather than unfinished: nothing led down, and what
    // led up arrived somewhere the player had never left from. The way out is now
    // the way in.
    smove(chss.bsmnthm1);
  });
};

chss.cata1 = new Chs();
chss.cata1.id = 133;
addtosector(sector.cata1, chss.cata1);
chss.cata1.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_casket_service_54a382dc",
    ),
  );
  global.lst_loc = 133;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata13);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata2);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.catamn);
  });
};

chss.cata2 = new Chs();
chss.cata2.id = 134;
addtosector(sector.cata1, chss.cata2);
chss.cata2.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_mourning_hall_7108173a",
    ),
  );
  global.lst_loc = 134;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata1);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata3);
  });
};

chss.cata3 = new Chs();
chss.cata3.id = 135;
addtosector(sector.cata1, chss.cata3);
chss.cata3.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_last_breath_1c3a13b1",
    ),
  );
  global.lst_loc = 135;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata4);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata2);
  });
};

chss.cata4 = new Chs();
chss.cata4.id = 136;
addtosector(sector.cata1, chss.cata4);
chss.cata4.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_tunnel_of_the_dead_175fc32a",
    ),
  );
  global.lst_loc = 136;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata5);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata3);
  });
};

chss.cata5 = new Chs();
chss.cata5.id = 137;
addtosector(sector.cata1, chss.cata5);
chss.cata5.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_movement_below_63215d59",
    ),
  );
  global.lst_loc = 137;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata6, false);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata12);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata4);
  });
};

chss.cata6 = new Chs();
chss.cata6.id = 138;
addtosector(sector.cata1, chss.cata6);
chss.cata6.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_web_corridor_deeaf7ac",
    ),
  );
  global.lst_loc = 138;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata7);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata5);
  });
};

chss.cata7 = new Chs();
chss.cata7.id = 139;
addtosector(sector.cata1, chss.cata7);
chss.cata7.sl = () => {
  d_loc(
    i18n.t("runtime.world.locations.dialogue.catacombs_grievance_5e05c597"),
  );
  global.lst_loc = 139;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata8);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata6);
  });
};

chss.cata8 = new Chs();
chss.cata8.id = 140;
addtosector(sector.cata1, chss.cata8);
chss.cata8.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_forgotten_post_02fdf9b5",
    ),
  );
  global.lst_loc = 140;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata9);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata7);
  });
};

chss.cata9 = new Chs();
chss.cata9.id = 141;
addtosector(sector.cata1, chss.cata9);
chss.cata9.sl = () => {
  d_loc(
    i18n.t("runtime.world.locations.dialogue.catacombs_withered_hand_83f16c0e"),
  );
  global.lst_loc = 141;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata8);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata10);
  });
};

chss.cata10 = new Chs();
chss.cata10.id = 142;
addtosector(sector.cata1, chss.cata10);
chss.cata10.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_rusted_arc_8223ac87",
    ),
  );
  global.lst_loc = 142;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata9);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata11);
  });
};

chss.cata11 = new Chs();
chss.cata11.id = 143;
addtosector(sector.cata1, chss.cata11);
chss.cata11.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_old_one_s_destination_7795619b",
    ),
  );
  global.lst_loc = 143;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata10);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata12);
  });
};

chss.cata12 = new Chs();
chss.cata12.id = 144;
addtosector(sector.cata1, chss.cata12);
chss.cata12.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_thawing_candles_5bbb55d1",
    ),
  );
  global.lst_loc = 144;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata11);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata5);
  });
};

chss.cata13 = new Chs();
chss.cata13.id = 145;
addtosector(sector.cata1, chss.cata13);
chss.cata13.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_endless_echoes_556de87e",
    ),
  );
  global.lst_loc = 145;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata14);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata1);
  });
};

chss.cata14 = new Chs();
chss.cata14.id = 146;
addtosector(sector.cata1, chss.cata14);
chss.cata14.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_dusty_underpass_2e5053c3",
    ),
  );
  global.lst_loc = 146;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata15);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata13);
  });
};

chss.cata15 = new Chs();
chss.cata15.id = 147;
addtosector(sector.cata1, chss.cata15);
chss.cata15.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_light_s_corner_682954e6",
    ),
  );
  global.lst_loc = 147;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata16);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata14);
  });
};

chss.cata16 = new Chs();
chss.cata16.id = 148;
addtosector(sector.cata1, chss.cata16);
chss.cata16.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_son_s_last_visit_82b43ea9",
    ),
  );
  global.lst_loc = 148;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata17);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata15);
  });
};

chss.cata17 = new Chs();
chss.cata17.id = 149;
addtosector(sector.cata1, chss.cata17);
chss.cata17.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_stone_plate_4b2290e4",
    ),
  );
  global.lst_loc = 149;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata18);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata16);
  });
};

chss.cata18 = new Chs();
chss.cata18.id = 150;
addtosector(sector.cata1, chss.cata18);
chss.cata18.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_cracked_passageway_45316ad0",
    ),
  );
  global.lst_loc = 150;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata19);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata17);
  });
};

chss.cata19 = new Chs();
chss.cata19.id = 151;
addtosector(sector.cata1, chss.cata19);
chss.cata19.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_limited_leeway_f2743a66",
    ),
  );
  global.lst_loc = 151;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata20);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata18);
  });
};

chss.cata20 = new Chs();
chss.cata20.id = 152;
addtosector(sector.cata1, chss.cata20);
chss.cata20.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_brittle_turn_16750cd7",
    ),
  );
  global.lst_loc = 152;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata19);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata21);
  });
};

chss.cata21 = new Chs();
chss.cata21.id = 153;
addtosector(sector.cata1, chss.cata21);
chss.cata21.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_bright_ray_above_2b1ab006",
    ),
  );
  global.lst_loc = 153;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata20);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata22);
  });
};

chss.cata22 = new Chs();
chss.cata22.id = 154;
addtosector(sector.cata1, chss.cata22);
chss.cata22.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_nowhere_to_run_05519955",
    ),
  );
  global.lst_loc = 154;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata21);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata23);
  });
};

chss.cata23 = new Chs();
chss.cata23.id = 155;
addtosector(sector.cata1, chss.cata23);
chss.cata23.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_aging_room_7856a318",
    ),
  );
  global.lst_loc = 155;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata22);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_south_2d25f660"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata24);
  });
};

chss.cata24 = new Chs();
chss.cata24.id = 156;
addtosector(sector.cata1, chss.cata24);
chss.cata24.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_eleven_wisemen_c3327aac",
    ),
  );
  global.lst_loc = 156;
  chs(select(global.text.catasound), true, "lightgrey", "black");
  chs(
    i18n.t("runtime.world.locations.dialogue.move_north_9fb42425"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata23);
  });
  chs(
    i18n.t("runtime.world.locations.dialogue.move_west_1a3e6864"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata25);
  });
};

chss.cata25 = new Chs();
chss.cata25.id = 157;
addtosector(sector.cata1, chss.cata25);
chss.cata25.sl = () => {
  d_loc(
    i18n.t(
      "runtime.world.locations.dialogue.catacombs_the_end_of_journey_5607474f",
    ),
  );
  global.lst_loc = 157;
  // The room the map has always ended on, and now the place Chapter IV lands. It
  // reads in three states: the ambient corridor before the player is looking for
  // anything, the thing that is standing here once they are, and what is written
  // on the wall behind it afterwards.
  if (!quest.undcty2.data.started)
    chs(select(global.text.catasound), true, "lightgrey", "black");
  else if (!quest.undcty2.data.killed) {
    chs(
      i18n.t("runtime.world.locations.dialogue.journey_end_guardian"),
      true,
      "crimson",
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.face_what_stands_here"),
      false,
      "crimson",
    ).addEventListener("click", () => {
      area_init(area.cata5a);
    });
  } else {
    learnLore(
      "deathKiPooling",
      "cameThrough",
      "warmAir",
      "catacombsForgotten",
      "threeAndAcross",
      "whoCameFirst",
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.journey_end_aftermath"),
      true,
      "yellow",
    );
    chs(
      i18n.t("runtime.world.locations.dialogue.journey_end_deins_mark"),
      true,
      "gold",
    );
  }
  chs(
    i18n.t("runtime.world.locations.dialogue.move_east_4c32e954"),
    false,
  ).addEventListener("click", () => {
    smove(chss.cata24);
  });
};

// The catacombs held no combat at all: not one of the twenty-six rooms called
// area_init and no area existed for them. Depth is expressed by which area a room
// initialises rather than by making one population stronger, so the entry rooms
// and the eastern ring feel like different places. The long western corridor is
// still quiet until its own tier is statted.
for (const room of [chss.cata1, chss.cata2, chss.cata3, chss.cata4, chss.cata5])
  room.onEnter = function () {
    area_init(area.cata1a);
  };

for (const room of [
  chss.cata6,
  chss.cata7,
  chss.cata8,
  chss.cata9,
  chss.cata10,
  chss.cata11,
  chss.cata12,
])
  room.onEnter = function () {
    area_init(area.cata2a);
  };

// The western corridor, and then the two rooms before the end. cata25 is not in
// either list: what stands there is an encounter the room itself offers, not a
// population to walk into.
for (const room of [
  chss.cata13,
  chss.cata14,
  chss.cata15,
  chss.cata16,
  chss.cata17,
  chss.cata18,
  chss.cata19,
  chss.cata20,
  chss.cata21,
  chss.cata22,
])
  room.onEnter = function () {
    learnLore("theOrder", "deadMovingNow");
    area_init(area.cata3a);
  };

for (const room of [chss.cata23, chss.cata24])
  room.onEnter = function () {
    area_init(area.cata4a);
  };
