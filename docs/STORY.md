# Story state

[Türkçe](STORY.TR.md)

This document records what the story currently is, where it stops, and which
finished content exists in the sources but cannot be reached. It is the basis
for continuing the story, and it must be updated whenever story content is added
or a previously unreachable system is wired in.

What is _proposed_ rather than built lives in [docs/PROPOSALS.md](PROPOSALS.md) —
the next regions, the blacksmith, and the side stories still owed.

Everything below was verified against the sources; no part of it is planned or
aspirational unless it appears under [Continuing the story](#continuing-the-story).

## The quest chain

Nine quests are defined in `js/data/quests.js`. Eight are reachable.

| Quest       | Name                     | Given at                            | Requires                                                | Reward                                          |
| ----------- | ------------------------ | ----------------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| `test`      | placeholder              | nowhere — no `giveQst` call exists  | —                                                       | —                                               |
| `fwd1`      | Firewood Gathering       | Hunter's Lodge job board            | Reaching the lodge; the village gate needs level 6      | 100 wealth, `sld.bkl`, 15,000 exp, karma        |
| `hnt1`      | First Hunt               | Hunter's Lodge job board            | none, runs parallel to `fwd1`                           | 130 wealth, 10× `item.jrk1`, 12,000 exp, karma  |
| `grds1`     | Guarding Duty            | Marketplace checkpoint              | Notice board post 4, which needs `fwd1` + `hnt1`; 7–10h | 65 wealth, 3,000 exp, repeatable                |
| `lmfstkil1` | Monster Eradication      | Hunter's Lodge job board            | `fwd1` + `hnt1`, level 20, and beating dojo Golem 4     | 300 wealth, `wpn.gsprw`, `eqp.nkgd`, 18,000 exp |
| `pckld1`    | The Pack Leader          | Hunter's Lodge job board            | `lmfstkil1` done, and one more in-game day since        | 600 wealth, `eqp.amsk`, 26,000 exp              |
| `undcty1`   | Beneath the Village      | The general store's old shopkeeper  | `pckld1` done, which sets `global.flags.undercity1`     | 250 wealth, 9,000 exp, and the way down         |
| `undcty2`   | The End of Journey       | Hunter's Lodge job board            | `undcty1` done                                          | 1,400 wealth, `acc.rmedlon`, 52,000 exp         |
| `nrvs1`     | The Man Who Said Nothing | The nervous man, marketplace stalls | `undcty2` done **and** the player once left him alone   | 180 wealth, karma, 11,000 exp                   |

Completing `fwd1` and `hnt1` together triggers a gate scene at the lodge that
grants `wpn.dgknf` and the satchel `item.htrsvr`, and sets the flags that open
the village notice board and the herbalist.

### Dependency order

```
dojo training  ─────────────► dojo golems ──► trne4e1 flag
                                                   │
village gate (level 6) ──► Western Woods ──► Hunter's Lodge
                                                   │
                        ┌──────────────────────────┴──────────────────┐
                        ▼                                             ▼
                  fwd1 Firewood                                 hnt1 First Hunt
                        └──────────────► both done ◄────────────────┘
                                             │
                    ┌────────────────────────┼──────────────────────┐
                    ▼                        ▼                      ▼
              notice board            satchel side-chain      lmfstkil1
                    │                                          (needs level 20
                    ▼                                           + trne4e1)
              grds1 (repeatable)                                    │
                                                                    ▼
                                                          Southern Forest opens
                                                          35 × wolf kills
                                                                    │
                                                     Yamato records the day he
                                                     promised to send for you
                                                                    │
                                                       one in-game day later
                                                                    ▼
                                                          pckld1 The Pack Leader
                                                          hollow past the foliage
                                                          1 × creature.wolfa1
                                                                    │
                                                        sets flags.undercity1
                                                                    │
                                                                    ▼
                                                          undcty1 Beneath the Village
                                                          3 signs, any order:
                                                            shopkeeper's account
                                                            the marketplace
                                                            your own cellar wall
                                                                    │
                                                          report to Yamato
                                                        sets flags.undercity2
                                                                    │
                                                                    ▼
                                                          break through the wall
                                                          chss.bsmnthm1 ──► chss.catamn
                                                          26 rooms
                                                                    │
                                                                    ▼
                                                          undcty2 The End of Journey
                                                          the western corridor
                                                          1 × creature.dcrps1
                                                                    │
                                                          a cut wall, warm air, and
                                                          a hunter's mark one wet
                                                          season old
                                                                    │
                                                          report to Yamato
                                                        sets flags.deintrail
                                                                    │
                                                                    ▼
                                                    ── STORY STOPS HERE, on Dein ──
```

## Where the story stops

Chapter I and II are implemented. The 35th wolf kill still moves the player to
the Southern Forest gate, and reporting back completes `lmfstkil1`; that reward
now also records `quest.lmfstkil1.data.rday`, the in-game day Yamato promised to
send for the player. One day later the job board carries his second commission
instead of rendering an empty header.

`pckld1` opens a third southern scene, `chss.frstn10main`, past the foliage. The
hollow leads with what is written on the ground — a wolf's own cracked skull,
claw marks above any wolf's reach, cold air rising out of the rock — and keeps
the fight behind a deliberate "Search the hollow" choice, because Yamato asks the
player to look before killing. `creature.wolfa1` is the only wolf in the game
that is not a _Weakened Wolf_; the existing description of `wolf1` already says
those wolves were "affected by a disease" and are far less dangerous than "its
healthy counterpart", so the leader is that counterpart, carrying weeks-old rot
in its jaw.

Killing it turns the same scene into its aftermath: the leader died facing the
crack, not facing the player. Yamato's report pays off the hunt, hands over the
Wolf Mask, points at the shopkeeper who has been complaining about digging under
the village for a month, and says he will send word east.

### Chapter III — Beneath the Village

Implemented as `quest.undcty1`. The crack under the hollow is too narrow to
follow, so the way down is the one the dialogue had already pointed at for a
month.

Yamato's report sets `global.flags.undercity1`, which opens a conversation with
the general store's old shopkeeper. This matters mechanically as well as
narratively: his "something is drilling underground right into people's homes"
line existed only inside the infestation offer, behind
`area.hmbsmnt.size >= 1000` — a gate that opens after roughly a hundred in-game
days. The story now reaches it on Yamato's word alone.

The quest is an investigation of three signs, gathered in any order and recorded
by name so no scene can award one twice:

| Sign     | Where                        | What it establishes                                                                                                                      |
| -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `cellar` | the shopkeeper, `chss.gens1` | it digs rather than scratches; it started at the old wall and spread toward the well; what goes missing is tools and a lantern, not food |
| `market` | `chss.mrktvg1`               | three adults contradict each other and mock the old man; a boy mentions his father's chisels went out of a **locked** cellar             |
| `home`   | `chss.bsmnthm1`              | two stones pushed proud from the inside, mortar gone to powder on the player's side, moving air colder than the season                   |

Reporting to Yamato completes the quest and sets `global.flags.undercity2`, which
is what unlocks breaking the wall down — he had asked to be told before the
player touched anything. That conversation is also where the game finally says
out loud that going under the village unlit is not a plan, and tells the player
to buy candles, because nothing else in the game ever explains darkness.

### Where it stops now

In the upper catacombs. `chss.catamn` is reachable from the basement, and its own
exit — which used to come up in the village centre, the clearest sign the region
was orphaned rather than unfinished — now returns to the basement the player came
from.

Twelve of the twenty-six rooms are populated, in two tiers. The entry rooms
(`cata1`–`cata5`) run `area.cata1a` — cave bats, stirges, and the first thing down
there that used to be a person. The eastern ring past the Web Corridor
(`cata6`–`cata12`) runs `area.cata2a`, which adds the ones that still remember how
to fight.

Searching works down here too, now that `sector.cata1` has the scout table its
11,000-point track was written for. What it turns up is what the village has been
losing, including the shopkeeper's lantern. It costs candle time: `scoutGeneric`
refuses to run in the dark, like everything else.

### Chapter IV — The End of Journey

All twenty-six rooms are populated now, in four tiers, each a different area
rather than one population scaled up: the entry rooms, the eastern ring, the
western corridor (`area.cata3a` — the order that built this place is buried along
it, which is why what walks there still knows how to fight in formation and how to
cast), and the two rooms before the end (`area.cata4a`, older than the order).

`chss.cata25`, The End Of Journey, has always been the last node on the map, and is
now where the chapter lands. It reads in three states: the ambient corridor before
the player is looking for anything, `creature.dcrps1` standing in it once they are,
and afterwards what is behind where it stood.

The Disaster Corpse answers _why now_, and the answer was already written into the
game: its own description says these manifest purely from death ki, in places where
dark ki is already extremely concentrated. It cannot be there unless something has
been pooling it. The same idea explains the corridor's skeletons — `unsctn` harms
nobody, by its own description, **until** death ki has worked on it long enough.

Behind it the wall has been cut through from the far side, the dust is still pale,
and the air rising out of the passage beyond is warm rather than cold. Whatever has
been digging under the village did not start here; it came through here.

Beside the opening is a hunter's mark: three strokes and a cross-cut, weathered
along one edge only, so one wet season old. Wedged in the crack under it is the
broken tip of a sword, in better steel than the player owns.

Reporting it is where Yamato stops being controlled. Three-and-across is not a
route mark: it is what his deputy cut to say he had gone on alone and was not
coming back the same way — half of it taught, half invented so Yamato would know it
was him and nobody else. Dein has been under their feet for fourteen months, and
Yamato had stopped looking. He sends word east that night and says that this time
it is not a courtesy.

### Other dead ends

- `chss.frstn9a1m` remains a respawning grind area, but it is no longer terminal:
  it carries the choice into the hollow once `pckld1` is started.
- `chss.cata25` terminates the catacomb map, which is unreachable regardless.
- The shopkeeper line that Chapter III depends on sits behind
  `area.hmbsmnt.size >= 1000` in `chss.gens1`. The basement refills by
  `rand(5, 15)` per day from a base of 10, so that gate takes on the order of a
  hundred in-game days to open. Chapter III has to surface the hook properly
  rather than rely on it.

## The Head Hunter

Yamato is the story's only sustained character and its natural spine. He runs
the Western Woods lodge, gives four of the five reachable quests, and holds a
lore hub covering monster ranks G through SSS and six creature categories.

His dialogue made three promises. Two are now kept:

1. **"Expect to be contacted later for further monster subjugation."** Kept: the
   day of the promise is recorded, and `pckld1` appears on the board a day later.
2. **"We're going east soon."** Still unpaid. No eastern sector, area, or scene
   exists. His pack-leader report now states it as an intention — he will send
   word east because two hunters will not be enough — which sharpens the debt
   rather than settling it.
3. **"Might have been the leader of the pack, furious about death of his
   underlings. This matter will need to be resolved quickly."** Kept:
   `creature.wolfa1` dens in the hollow, and the reason it left its territory is
   the question Chapter III inherits.

He also has a self-contained arc around a marked sword belonging to Dein, the
missing deputy chief, which ends with the sword confiscated and a search
promised. That search is never resolved either.

His lore lectures name 24 creature types that have no implementation: wild boar,
mimics, ogres, harpies, minotaurs, beastmen, orcs, goblins, bandits, demons,
imps, possessed weapons and armour, gremlins, devils, sprites, elementals,
wraiths, necromancers, reanimated beasts, dragons, wyverns, wyrms, lizardmen,
and draconids. The monster rank scale he teaches is never surfaced anywhere in
the interface, even though `item.bstr` claims to unlock a bestiary.

## What the player can see of all this

The journal's fourth panel — the tab that rendered `????????????` with nothing
behind it since before this fork — now holds what the player has worked out:
clues found, questions the story has opened, and answers earned. It needs no
unlock of its own, because the journal is already gated behind finding and reading
`item.jnlbk`, and entries accumulate from the first hour whether or not the player
can open it yet. Twenty-four entries exist, of which four are questions the later
chapters are built to answer.

It also finally keeps Yamato's lore hub: the monster rank scale from G to SSS and
the six kinds of creature were taught in dialogue the player read once and could
never look up again.

## Content that exists but cannot be reached

This is the important part. The game is not short of content; it is short of
connections.

| Asset                   | Amount             | State                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Catacombs**           | 26 finished scenes | **Fully reachable and fully populated**, in four tiers: `cata1a` entry rooms, `cata2a` eastern ring, `cata3a` western corridor, `cata4a` deep rooms, plus `cata5a` for the encounter at the end. `sector.cata1`'s 11,000-point track is live.                                                                                                                                                                                                                                              |
| **Undead bestiary**     | 9 of 20 creatures  | Eleven are statted, typed as Undead, and reachable: `cbat`, `stirge`, `zomb1`, `zmbf`, `ghl`, `zmbm`, `ght`, `zmbk`, `mumy`, `unsctn`, `dcrps1`. What remains are the doll and puppet family — `puppet`, `bpuppet`, `doll`, `ndoll`, `cdoll` — plus `lrck`, `lsprt`, `kksh` and `ngtmr1`, which are statted but belong to no area.                                                                                                                                                         |
| **Damp cellar**         | 1 area             | `area.clg`, populated, but never initialized.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Marketplace sector**  | 1 sector           | **Finished.** Its table had been written and commented out, leaving seven scenes unsearchable; the village centre and the market now turn up small change and the things nobody would buy.                                                                                                                                                                                                                                                                                                 |
| **Titles**              | 22 of 108          | No grant path. What remains is almost entirely weapon-mastery tiers (`srd3`, `srd4`, `lnc3`, `hmr3`, `axc3`, `sld3`–`sld5`), which want kill-count milestones rather than story work.                                                                                                                                                                                                                                                                                                      |
| **Items and equipment** | ~308 of 544        | No drop, recipe, or vendor source. `wpn.trch`, the torch, now drops from the upper catacombs — it was the only light source in the game that nothing sold. Still unsourced: 7 keys, 6 essences, 5 masks, 6 medals, 16 elemental charms, ~35 weapons, roughly 150 foods. Three of the fourteen shields now come from the dojo ladder; the Hoplite, Knight and Dread shields had been listed as rare with no stats at all, so the level 35 reward defended exactly as well as an empty hand. |

### What the catacombs were missing

Kept because it is what made Chapter IV the size it was. The 26 rooms were fully
written and fully interconnected — every internal edge reciprocal, with `cata1` as
a hub, an east ring (`5→6→7→8→9→10→11→12→5`) and a west corridor (`13`→`25`) — and
yet:

- **No room called `area_init`, and no area existed for them.** The dungeon had
  zero combat population, so wiring an entrance alone would have opened 26 empty
  rooms. Five areas were written for them and every room now initialises one.
- No room declared `effectors`, `onEnter`, `onScout`, `scout` or `data`. The
  darkness came from `sector.cata1` alone.
- `chss.catamn`'s exit led to `chss.lsmain1` (village centre) with no reciprocal
  link back, which is why the region read as orphaned rather than unfinished. It
  returns to the cellar it is entered from now.

The clusters lined up in a way that is hard to read as coincidence: a dark 26-room
dungeon, a torch that nothing sold, seven keys with no locks, and a complete undead
bestiary with nowhere to spawn. It was prepared as one region and never connected.

### A note on three bugs of one shape

Worth keeping, because it cost three separate fixes to see it. Each of these was a
handler that undid itself on an event the teardown prevented from ever firing:

- The sell list and the smith's bench rebuilt themselves by calling `chs_spec`, which
  begins by emptying the choice column -- taking the scene's own Return choice with it
  and leaving the player with no way out.
- A hover description belongs to the row under the pointer. Tearing the rows down while
  the pointer is still on one means that row's `mouseleave` never fires, so the
  description hung on screen.
- Hovering an inventory row sets `global.flags.kfocus`, which gates the shortcut keys
  off so that pressing 1 assigns rather than uses. Emptying the list removes the hovered
  row, `mouseleave` never fires, and every shortcut goes quiet -- which showed up in
  combat, because a fight calls `isort` constantly through `giveItem`, `removeItem` and
  `reduce`.

The cure is the same each time: undo it where the destruction happens, not where the
pointer happens to be. Anything added here that attaches state on hover should be
written that way from the start.

## Defects in story code

These were bugs rather than design gaps. All of them are now fixed; the list is
kept because each one shaped the content around it.

- `js/world/areas.js` — an `area.trn.id` assignment sat inside the `area.trnf`
  block, overwriting the training area's id and leaving `area.trnf.id` at 0.
- `js/data/quests.js` — guard duty completion incremented `global.flags.jcom`,
  which does not exist, instead of `global.stat.jcom`. The result was `NaN`, and
  the job counter the interface already displayed never advanced.
- `js/world/areas.js` — `area.clg.onEnd` called `chss.q1lwn` and `chss.q1l`,
  neither of which is defined. It would have thrown if the area were reachable.
- `chss.jbgd1` had no exit choice, holding the player until hour 20.
- `js/data/creatures.js` — `creature.wolf1.battle_ai` attacked with
  `abl.scratch`, which does not exist. `attack()` falls back to `abl.default`
  for an undefined ability, so the wolf the player kills thirty-five of silently
  lost its scratch's bleed chance and damage bonus, and `abl.scrtch` was dead
  code no creature reached.

### Still open

- `chss.bsmnthm1.data.gets` has two entries but the third scout result writes
  `gets[2]`, so that find is never latched as already taken.
- `global.flags.bsmntchck`, the gate on the basement's "Examine your
  surroundings" choice, is never assigned anywhere.
- The seven keys still have no locks. A dungeon of named rooms is where they
  would belong, and the catacombs are now that dungeon.
- `vendor[*].dfl` is set on four of the five vendors and read nowhere.

## Continuing the story

The cheapest continuation does not require inventing a new region. It requires
connecting the one that is already finished, and paying off promises the
dialogue has already made.

### Step 1 — Reachable rewards for what the player already did — **done**

Wolf Slayer is granted by `lmfstkil1`. The job titles are granted by stat
milestones now that the completed-job counter increments the field the interface
reads. The area id collision, the `area.clg` crash, the missing guard-duty exit
and the wolf's undefined scratch are all fixed. The commented-out marketplace
sector is still commented out.

### Step 2 — The pack leader — **done (Chapter I and II)**

Implemented as `quest.pckld1`, `creature.wolfa1`, `area.frstn10a1` and
`chss.frstn10main`. See [Where the story stops](#where-the-story-stops). This
was moved ahead of the undercity deliberately: making the pack leader the first
symptom rather than a side errand gives the wolves a cause, and the cause is what
Chapter III investigates.

The southern scenes are still not attached to a sector, so the south has no
exploration or ambient layer.

### Step 3 — The undercity — **opened (Chapter III)**

The way down exists: `quest.undcty1`, the three signs, and the wall in the
player's own cellar. See [Chapter III](#chapter-iii--beneath-the-village).

What darkness turned out to be, which shaped the whole chapter:

- `cansee()` is `(global.flags.isdark && you.mods.light > 0) || skl.ntst.lvl >= 12`.
  Without light the player's accuracy is multiplied by `0.3 + skl.ntst.lvl * 0.07`,
  scouting refuses to run, and the basement will not even describe itself.
- Only two things grant `mods.light`. `wpn.trch`, the torch, had **no source
  anywhere in the game** — it now drops from the upper catacombs, which is also
  the payoff for the lantern the shopkeeper says went missing. `effect.cdlt` comes
  from `item.cndl`, a candle, which the general store already sells, and it lasts
  360 ticks.
- So the intended way in is consumable light on a timer, which is a real
  constraint rather than a nuisance — and nothing in the game explained it. That
  is why Yamato's briefing says it out loud.

### Step 3b — The rest of the catacombs

The entry rooms and the eastern ring are done. Depth is expressed by which area a
room initialises rather than by scaling one population, so the two stretches read
as different places: the ring adds `zmbf`, too solid to out-trade, and `ghl`, too
fast to corner, and neither can be handled on the other's terms.

`sector.cata1`'s exploration track is live. Its four finds are what the village has
been losing — candles, grave coins, a chisel handle in a heap of bone and rag, and
the lantern the shopkeeper said was taken, which is `wpn.trch`. Searching costs
candle time, because `scoutGeneric` refuses to run in the dark.

The western corridor is done as well: `cata13` through `cata25`, ending at The End
Of Journey, with `ght`, `zmbk`, `zmbm` and `mumy` statted against the player's
progress rather than against `rnk` — which is Yamato's danger classification and not
a power curve, `creature.skl` being rank 7 with 132 hp while `wolf1` is rank 4 with
400 — and all of them `type = 2` so the bestiary files them as Undead.

Two things that shaped how they were statted, worth keeping:

- `rnk` drives the rank-drop tier through `ar = ((rnk - 1) / 3) << 0` into
  `global.rdrop`, and only tiers 0, 1 and 2 are populated. Anything from rank 10
  to 21 gets no rank drop at all, so every deep tier carries its rewards in its
  own drop table.
- `cata3a` and `cata4a` are hunting grounds of forty and twenty-six rooms, so the
  player has every reason to come back to them. Their ceilings follow the player
  into the mid forties, floored at the level that was authored — see below.

What is left is the seven keys, which still have no locks.

### A note on the room names

The twenty-six rooms had never been reachable, so nobody had read their Turkish.
Eleven titles were mechanical mistranslations and are now corrected: _Web
Corridor_ had been read as the internet rather than a spider's, _Forgotten Post_ as
mail rather than a sentry's station, _The Stone Plate_ as dinnerware rather than a
slab, _The Brittle Turn_ as something crispy, and _Son's Last Visit_ had gained a
possessive that made it the player's own son.

## Progression, and how far the world reaches

The story's own numbers had stopped agreeing with each other. The dojo instructor
hands out rewards to level 50 and level 50 costs 6,042,925 experience, while the
highest monster level anywhere in the game was 28 — `area.trne4`'s golem and the
corpse at the bottom of the catacombs. Past Chapter IV there was nothing left that
could give a fight or worthwhile experience.

What was done about it, all of it under the rule that connecting beats inflating:

- **The dojo's endless bout tracks the student.** Its dummies were pinned at levels
  12, 13 and 10 — below the dojo's own first trial at 20 — so the moment a student
  was good enough to be sent at a golem, the room they trained in had nothing left
  to teach them. Their health grows at a tenth of a point a level against a cubic
  experience requirement, so it stays a place to practise rather than a place to
  farm.
- **The two deep catacomb hunting grounds follow the player** into the mid forties.
  That is where the story already says the dark ki has been pooling, so what it has
  been working on not stopping at a hand-written number is the premise rather than
  a concession to it. Every band is floored at the authored level, so a first
  descent meets exactly the fight that was designed, and the encounter at the very
  bottom does not scale at all.
- **SPD and LUCK grow.** SPD is what makes attacks miss — `hit_calc(2)` divides the
  attacker's accuracy by `you.spd + you.agl + agl_bonus / 2` — and nothing in the
  game had ever raised it: `stat_p`'s fourth entry is never read and `lvlup` never
  touched `spd_r`, so it sat on 1 for an entire playthrough. It gains a point every
  ten levels; LUCK gains one every five, which lifts the critical chance and every
  drop roll in the game.
- Both are paid out from a subscriber to `callback.onLevel`, which is what that hook
  was for. It had been constructed, documented and fired on every level gain since
  the callback registry was written, with no subscribers at all.
- **A shield defends.** A shield's resistances were subtracted from the player's
  protection rather than added to its own share of it, and taken off the armour's
  share as well, so a better shield and more Shield training both raised the damage
  taken. Statting the three shields the dojo awards is what exposed it.
- **The general store buys what the player is carrying**, priced from the same
  vendor supply lines the shops sell from and well under them. Before this the only
  things in the game with a buyer were firewood, straw baskets and cure grass.

One balance question is deliberately left open rather than decided here, and is
written up in [PROPOSALS.md](PROPOSALS.md): armour's class resistance appears twice
in the mitigation term with opposite signs, and correcting it drops an unshielded
player's damage taken to roughly a quarter of what it is today.

## What the village became

The chapters gave the village a story. This is what it gained as a place to live in,
which is the other half of why a player stays there.

**A smith at the market.** Durability sits on every piece of equipment, wears down in
play, and nothing in the game restored it -- a weapon that ran out was spent, its
damage collapsing to the flat fallback the formula uses for an empty hand. That was a
dead end a player could walk into and not out of, and it is closed. He also sharpens a
weapon +1 through +9, dearer and less certain as it climbs, and a failed attempt never
destroys or sets back the blade. The level lives on the item's `data`, because
restoring a save rebuilds each item from the registry and copies only `dp` and `data`
onto it.

He stands at the market rather than being rescued. The rescue is the better story and
is still owed -- see [PROPOSALS.md](PROPOSALS.md) -- but a dead end should not wait for
a quest to be built around it.

**The house is worth furnishing.** The fireplace could not accumulate fuel at all: a
stick thrown on a coal fire replaced it, so the blazing and roaring states the game
describes were unreachable. It holds a day's burning now, resting beside a lit one
heals half again as fast and returns a little energy, and sleeping a full night by it
leaves you Rested for twelve hours after. Four more pieces of furniture come from items
that already existed with names in both languages and no way on earth to obtain one --
including a blanket whose own description had always claimed it helps you sleep.

The four statues moved out of the accessory slot and into the house. The game had been
asking the player to wear a straw effigy.

**The marketplace can be searched.** `sector.vmain1` was attached to seven scenes with
its whole scout table commented out, so the search action had exactly one place in the
game to be used. What a market loses is small change and the things nobody would buy.

**The nightmare happens.** It had been written and commented out since before this fork
and could not have been enabled as it stood: `creature.ngtmr1` has a hundred million
health and a `battle_ai` that returns false, so the fight it started could be neither
won nor lost -- the player would have been held in their own bed until they closed the
tab.

It is not a fight now. `area_init` switches the battle on and the flag is turned
straight back off, so no round ever resolves. That also closes the hazard rather than
the symptom: a live fight against something that never attacks is unbounded
weapon-mastery experience at no cost. The exit is one choice that always works and
costs the rest of the night; staying trains Patience and Dark Absorption and it thins
out by itself after ten hours.

It is gated on having stood at the end of the catacombs. Lore is monotonic and saved,
unlike a quest flag, so the nightmare can only reach a player the story has already
explained it to -- which is the whole reason it is worth having: the player has been
breathing death ki, and this is the bill.

### Step 4 — East, and Dein

Yamato's "we're going east soon" — which his pack-leader report now states as an
intention rather than an aside — and the unresolved search for Dein are the two
threads that need genuinely new content. They are the right place to write an
original arc, once the finished content above is connected.

### Rules for this work

- The opening is not changed. Everything here attaches after the current
  content.
- New player-facing text goes into `locales/en.json` and `locales/tr.json`; the
  Turkish text is written natively rather than translated.
- Do not add power to close a gap. Connecting existing content is preferred over
  raising numbers.
- Update this document whenever a section above stops being accurate.
