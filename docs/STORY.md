# Story state

[Türkçe](STORY.TR.md)

This document records what the story currently is, where it stops, and which
finished content exists in the sources but cannot be reached. It is the basis
for continuing the story, and it must be updated whenever story content is added
or a previously unreachable system is wired in.

Everything below was verified against the sources; no part of it is planned or
aspirational unless it appears under [Continuing the story](#continuing-the-story).

## The quest chain

Five quests are defined in `js/data/quests.js`. Four are reachable.

| Quest       | Name                | Given at                           | Requires                                                | Reward                                          |
| ----------- | ------------------- | ---------------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| `test`      | placeholder         | nowhere — no `giveQst` call exists | —                                                       | —                                               |
| `fwd1`      | Firewood Gathering  | Hunter's Lodge job board           | Reaching the lodge; the village gate needs level 6      | 100 wealth, `sld.bkl`, 15,000 exp, karma        |
| `hnt1`      | First Hunt          | Hunter's Lodge job board           | none, runs parallel to `fwd1`                           | 130 wealth, 10× `item.jrk1`, 12,000 exp, karma  |
| `grds1`     | Guarding Duty       | Marketplace checkpoint             | Notice board post 4, which needs `fwd1` + `hnt1`; 7–10h | 65 wealth, 3,000 exp, repeatable                |
| `lmfstkil1` | Monster Eradication | Hunter's Lodge job board           | `fwd1` + `hnt1`, level 20, and beating dojo Golem 4     | 300 wealth, `wpn.gsprw`, `eqp.nkgd`, 18,000 exp |

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
                                                          ── STORY ENDS HERE ──
```

## Where the story stops

The 35th wolf kill fires a callback that moves the player to the Southern
Forest gate. Reporting back at the lodge completes `lmfstkil1` and returns the
player to the Western Woods gate. Yamato's closing line is:

> "…As for you, go and have a good hard earned rest, you have done very well.
> Expect to be contacted later for further monster subjugation."

That contact never comes. There is no ending, no epilogue, and no end flag. From
that point the job board renders its header and a single "Return" choice, because
every posting condition is false. **A permanently empty job board is the real end
of the game.**

The region the final quest unlocks is two scenes deep: the Southern Forest gate
and one respawning hunting area. Neither is attached to a sector, so the south
has no exploration or ambient layer at all.

### Other dead ends

- `chss.jbgd1`, the guard duty post, has **no exit choice**. The player is held
  there until the hour reaches 20.
- `chss.frstn9a1m` is a terminal grind area whose population respawns forever.
- `chss.cata25` terminates the catacomb map, which is unreachable regardless.

## The Head Hunter

Yamato is the story's only sustained character and its natural spine. He runs
the Western Woods lodge, gives three of the four reachable quests, and holds a
lore hub covering monster ranks G through SSS and six creature categories.

His dialogue makes three promises the game does not keep:

1. **"Expect to be contacted later for further monster subjugation."** No further
   subjugation exists.
2. **"We're going east soon."** No eastern sector, area, or scene exists.
3. **"Might have been the leader of the pack, furious about death of his
   underlings. This matter will need to be resolved quickly."** No pack leader
   exists.

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

| Asset                   | Amount             | State                                                                                                                                                                           |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Catacombs**           | 26 finished scenes | `sector.cata1`, `chss.catamn` and `cata1`–`cata25`. Named rooms, 14 ambient lines, a darkness effector, an 11,000-point exploration track. **Nothing in the game links to it.** |
| **Undead bestiary**     | 20 creatures       | Zombies, ghouls, ghasts, mummies, puppets, dolls, cave bats, stirges and more. None appears in any area population.                                                             |
| **Damp cellar**         | 1 area             | `area.clg`, populated, but never initialized. Its completion handler calls two scenes that do not exist.                                                                        |
| **Marketplace sector**  | 1 sector           | `sector.vmain1` is attached to seven scenes but its entire scout table and handler are commented out.                                                                           |
| **Titles**              | 32 of 108          | No grant path. Includes **Wolf Slayer**, and the three job titles despite the game already counting completed jobs.                                                             |
| **Items and equipment** | 310 of 544         | No drop, recipe, or vendor source. Includes 7 keys, 6 essences, 6 masks, 6 medals, 16 elemental charms, 13 of 14 shields, ~35 weapons, and roughly 150 foods.                   |

The clusters line up with each other in a way that is hard to read as
coincidence: a dark 26-room dungeon, a torch that nothing sells, seven keys with
no locks, and a complete undead bestiary with nowhere to spawn. This was
prepared as one region and never connected.

## Defects in story code

These are bugs, not design gaps, and should be fixed independently of any story
work.

- `js/world/areas.js` — an `area.trn.id` assignment sits inside the `area.trnf`
  block. It overwrites the training area's id and leaves `area.trnf.id` at 0.
- `js/world/locations.js` — guard duty completion increments
  `global.flags.jcom`, which does not exist, instead of `global.stat.jcom`. The
  result is `NaN`, and the job counter the interface already displays never
  advances.
- `js/world/areas.js` — `area.clg.onEnd` calls `chss.q1lwn` and `chss.q1l`,
  neither of which is defined. It would throw if the area were ever reachable.
- `chss.jbgd1` has no exit choice.

## Continuing the story

The cheapest continuation does not require inventing a new region. It requires
connecting the one that is already finished, and paying off promises the
dialogue has already made.

### Step 1 — Reachable rewards for what the player already did

No new content, no new scenes. Grant the titles the game already earns:
**Wolf Slayer** for the wolf quest, and the three job titles from the existing
completed-job counter once its `NaN` bug is fixed. Fix the area id collision, the
`area.clg` crash, and give guard duty an exit. Restore the commented-out
marketplace sector.

### Step 2 — The undercity

The hook is already written. The basement shopkeeper says:

> "Something is drilling underground right into people's homes… Some speculate
> there's a monster cave nearby, but nothing has been found yet."

This is the contact Yamato promised. The player's own basement is the natural
entrance, and one link from `chss.bsmnthm1` into `chss.catamn` opens 26 rooms, a
darkness mechanic, and 20 idle creatures at once. It also gives the torch a
reason to be sold and the keys a reason to exist.

Narratively this closes the loop without touching the opening: the player is
contacted, as promised, about something digging under the village, and the
answer is beneath their own house.

### Step 3 — The pack leader

The final quest already ends on this hook. One boss creature and one area at the
end of the Southern Forest resolves it and gives the two-scene southern region a
destination. The southern scenes also need to be attached to a sector so the
region gains an exploration layer.

### Step 4 — East, and Dein

Yamato's "we're going east soon" and the unresolved search for Dein are the two
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
