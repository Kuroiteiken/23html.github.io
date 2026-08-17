# Story state

[Türkçe](STORY.TR.md)

This document records what the story currently is, where it stops, and which
finished content exists in the sources but cannot be reached. It is the basis
for continuing the story, and it must be updated whenever story content is added
or a previously unreachable system is wired in.

Everything below was verified against the sources; no part of it is planned or
aspirational unless it appears under [Continuing the story](#continuing-the-story).

## The quest chain

Six quests are defined in `js/data/quests.js`. Five are reachable.

| Quest       | Name                | Given at                           | Requires                                                | Reward                                          |
| ----------- | ------------------- | ---------------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| `test`      | placeholder         | nowhere — no `giveQst` call exists | —                                                       | —                                               |
| `fwd1`      | Firewood Gathering  | Hunter's Lodge job board           | Reaching the lodge; the village gate needs level 6      | 100 wealth, `sld.bkl`, 15,000 exp, karma        |
| `hnt1`      | First Hunt          | Hunter's Lodge job board           | none, runs parallel to `fwd1`                           | 130 wealth, 10× `item.jrk1`, 12,000 exp, karma  |
| `grds1`     | Guarding Duty       | Marketplace checkpoint             | Notice board post 4, which needs `fwd1` + `hnt1`; 7–10h | 65 wealth, 3,000 exp, repeatable                |
| `lmfstkil1` | Monster Eradication | Hunter's Lodge job board           | `fwd1` + `hnt1`, level 20, and beating dojo Golem 4     | 300 wealth, `wpn.gsprw`, `eqp.nkgd`, 18,000 exp |
| `pckld1`    | The Pack Leader     | Hunter's Lodge job board           | `lmfstkil1` done, and one more in-game day since        | 600 wealth, `eqp.amsk`, 26,000 exp              |

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
                                                                    ▼
                                                    ── STORY STOPS HERE, on the
                                                       crack under the hollow ──
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

**The story now stops on a question rather than an empty board:** the crack is
too narrow to follow. Reaching what is below it is Chapter III, and the entrance
is meant to be the player's own basement.

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

## Content that exists but cannot be reached

This is the important part. The game is not short of content; it is short of
connections.

| Asset                   | Amount             | State                                                                                                                                                                                                                                 |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Catacombs**           | 26 finished scenes | `sector.cata1`, `chss.catamn` and `cata1`–`cata25`, ids 132–157. Named rooms, 14 ambient lines, a darkness effector on the sector, an 11,000-point track. Still **nothing links in**, and see below: the rooms hold no combat at all. |
| **Undead bestiary**     | 20 creatures       | Zombies, ghouls, ghasts, mummies, puppets, dolls, cave bats, stirges and more. None appears in any area population, and most are **stubs**: no `hp_r`, no stats, no drops, and left at `type = 3` (Evil) rather than 2 (Undead).      |
| **Damp cellar**         | 1 area             | `area.clg`, populated, but never initialized.                                                                                                                                                                                         |
| **Marketplace sector**  | 1 sector           | `sector.vmain1` is attached to seven scenes but its entire scout table and handler are commented out.                                                                                                                                 |
| **Titles**              | 22 of 108          | No grant path. What remains is almost entirely weapon-mastery tiers (`srd3`, `srd4`, `lnc3`, `hmr3`, `axc3`, `sld3`–`sld5`), which want kill-count milestones rather than story work.                                                 |
| **Items and equipment** | ~309 of 544        | No drop, recipe, or vendor source. Includes 7 keys, 6 essences, 5 remaining masks, 6 medals, 16 elemental charms, 13 of 14 shields, ~35 weapons, and roughly 150 foods.                                                               |

### What the catacombs actually lack

Worth stating precisely, because it changes the size of Chapter IV. The 26 rooms
are fully written and fully interconnected — every internal edge is reciprocal,
with `cata1` as a hub, an east ring (`5→6→7→8→9→10→11→12→5`) and a west corridor
(`13`→`25`) — but:

- **No room calls `area_init`, and no area exists for them.** The dungeon has
  zero combat population. Wiring an entrance alone would open 26 empty rooms.
- No room declares `effectors`, `onEnter`, `onScout`, `scout` or `data`. The
  darkness comes from `sector.cata1` only.
- `chss.catamn`'s exit already leads to `chss.lsmain1` (village centre), with no
  reciprocal link back, which is why the region reads as orphaned rather than
  unfinished.

The clusters line up with each other in a way that is hard to read as
coincidence: a dark 26-room dungeon, a torch that nothing sells, seven keys with
no locks, and a complete undead bestiary with nowhere to spawn. This was
prepared as one region and never connected.

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
- `sector.cata1.data.scoutm` is 11,000, but the sector has no `scout` table and
  no `onScout`, so the track can never advance.

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

### Step 3 — The undercity

The hook is already written. The basement shopkeeper says:

> "Something is drilling underground right into people's homes… Some speculate
> there's a monster cave nearby, but nothing has been found yet."

Yamato's report now points the player straight at him, which matters because the
line's own condition (`area.hmbsmnt.size >= 1000`) is close to unreachable.

The player's own basement is the natural entrance: one link from
`chss.bsmnthm1` into `chss.catamn` opens 26 rooms and the darkness mechanic. It
also gives the torch a reason to be sold and the keys a reason to exist.

Unlike Step 2, this step is not only wiring. The rooms hold no combat, so the
undead have to be given real stats, `type = 2`, and drop tables, and at least one
area has to exist for them to populate. `sector.cata1`'s 11,000-point track wants
a scout table to become the exploration layer the rooms were clearly written for.

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
