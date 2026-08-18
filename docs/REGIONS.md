# Regional design: the north, and the mine

[Türkçe](REGIONS.TR.md) · [Story](STORY.md) · [Proposals](PROPOSALS.md)

Two new regions, agreed with the owner: a rural region north of the village, and a
mine reached through it. This document is the contract for both — what opens each
one, what the player is expected to get out of it, and what closes it. Nothing here
is built until it is written down here first, because the last two regions that went
in without a written ending are the ones this file exists to avoid repeating.

## Standing rules for both

1. **Nothing existing moves.** The west and south woods, the village, the catacombs
   and their scenes are finished and are not touched. The east stays reserved: Yamato
   has promised an eastern expedition three times and that is a chapter, not a
   region.
2. **New areas are appended, never inserted.** `save()` writes every area's size in
   `for...in` order and `load()` reads them back positionally, so an area added above
   an existing one silently reassigns the size of every area after it.
3. **Every population entry declares `c`.** Omitting it makes `z_bake` accumulate
   undefined and bake `NaN` into `popc`, and every comparison `area_init` makes
   against `NaN` is false, so nothing can ever spawn. This is not hypothetical: it is
   what kept the damp cellar empty for the entire life of the project.
4. **Every scene draws its own exits.** `smove` has a net that hands the player a way
   back when a scene leaves neither a fight nor a single choice on screen, and the
   browser suite asserts that net never fires. It is a net, not a policy.
5. **Rewards are access and knowledge, not numbers.** A new region may hand out a
   tool, a skill's grant path, a recipe, or a clue. It does not hand out a weapon that
   makes the existing game trivial.
6. **Progression opens on things the player did, not on levels.** Every gate below is
   a lore entry, a quest state, a skill threshold or an item — something earned and
   visible in the journal — so a player always knows why a door is shut.

## Why north

The west and the south are woods and both are finished. The east is spoken for. The
village itself already talks about a countryside it has never had: a **mill**
(`nervous_guy_second_way`), a **grain store** and **wolves in it**
(`market_rumours`), **livestock** being injured (the message board), a **well** that
has been coming up cloudy for three weeks, and a **harvest**. Four of those are
one-line mentions of places that do not exist on any map in the game.

North is the only direction not already spent, and the fields are where the village's
food and water come from. That also gives the region a reason to open that is not
"there is a new area now": when the well goes bad, the village looks upstream.

## Region 1 — The North Fields

### Opening

| Gate                                       | Requirement                                                                 |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| The north road appears at the village gate | `knowsLore(25)` — `towardTheWell`, earned by going down the joiner's cellar |
| The work is offered                        | A message board notice: the harvest hands have stopped coming in            |

The cellar side story ends with the player holding four points — the old man's
cellar, the family two doors down, the houses by the well, and the joiner's — and the
observation that the well has been cloudy for three weeks. That is the beat where the
village's water becomes a question the player is carrying. The road north opens on
that, not on a level.

### Scenes

| Scene                 | What it is                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| The Well Road         | The way out of the village north, and the well itself. Not a fight — a place to look at the water  |
| The Stubble Fields    | First hunting ground. Low band, cut and gleaned, nothing standing to hide behind                   |
| The Mill              | A place and a person. The miller, the wheel, and the **old drain** the nervous man told Dein about |
| The Scarecrow's Field | Where the straw figures are. `creature.kksh`                                                       |
| The Grain Store       | The wolves in the grain store, finally somewhere                                                   |
| The Low Hills         | The far edge, and the way to the mine                                                              |

### Expectations

The player should come out of the north with:

- A reason the fields went bad that is the main story rather than a local problem.
  `creature.kksh`'s own description says it was **once protector of fields** and
  **turned to evil by the influence of Dark**. The dark ki that has been pooling
  under the village (`deathKiPooling`, id 12) has reached the roots. The region is a
  symptom of the thing the player is already chasing.
- A working relationship with one person who is not a hunter. The miller is a
  tradesman whose livelihood is the village's bread, and he is the second person after
  the joiner to be more use to the player than the market's opinions were.
- The mill's old drain, which is the only reason the mine is reachable at all.
- No new power. The north pays in access and in one recipe's worth of food.

### Ending

The fields are made safe enough to bring the harvest in, and that is stated plainly
rather than left implied. What the player takes away is that whatever is under the
village is **not staying under the village** — it has reached the fields, and the
fields are upstream of the well everybody drinks from.

The north does **not** answer what is doing it. That question is already open in the
journal as `whoseHand` (id 27) and the mine is where it is answered.

## Region 2 — The Mine

The mine is not an invention either. Two pieces of text already in the game point
straight at it:

- `secondWayIn` (id 24): Dein _"asked about a second way down — one that did not go
  through the burial ground. He already knew the catacombs were there, and he wanted
  around them."_
- `nervous_guy_second_way`: _"I told him about the old drain by the mill, because it
  was the only hole I know of."_ And in `nervous_guy_confession`, what Dein bought was
  _"Rope. Lamp oil. A box of chalk."_

Lamp oil is what a mine takes. The mill is in the fields. So the drain by the mill is
the join between the two new regions, and the mine is where Dein was going. The
player is following a fourteen-month-old shopping list.

### Opening

| Gate                             | Requirement                                    |
| -------------------------------- | ---------------------------------------------- |
| The hills road appears           | The north's harvest arc closed                 |
| The mine mouth can be opened     | A **pickaxe**, bought from the smith           |
| The player can work stone at all | `skl.mng`, granted by the first successful dig |

`skl.mng` — "Mining", _"Ability to extract materials from stones and mountains"_ —
already exists in `js/data/skills.js` with no grant path and no reader anywhere in the
game. The mine is what it was written for. The pickaxe is new and comes from the smith,
which also gives the smith the second half he was always owed.

### Progression inside

Three depths, each opening on the last. This is the "ilerleyiş" the owner asked for:
the mine is not one area with a level range, it is three places that have to be earned
in order.

| Depth                 | Opens on               | What is down there                                                                                                                          | What it pays                                                  |
| --------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **The Adit**          | Having the pickaxe     | The worked-out top level. Coal — `item.coal1` and `item.coal2` already exist and already burn in the fireplace                              | The Mining skill's first levels, and fuel worth carrying home |
| **The Flooded Level** | A Mining threshold     | Standing water. The mine's water and the village's cloudy well are the same water, and this is where the player can see that for themselves | The connection between the two regions, and a lore clue       |
| **The Deep Cut**      | Getting past the water | Ore, the lamp spirits in the old lamps, and at the bottom the place where the level was broken into **from below**                          | The answer to `whoseHand`, and Dein's own marks               |

### The lamp spirit

`creature.lsprt` — _"Small fire sprites that manifest inside oil lamps located in mines
and other places with low human activity. While not sinister by nature, they enjoy
playing pranks on people."_

It is currently a byte-for-byte duplicate of the scarecrow's stat block, which is to
say it has no design at all. Its description is the design: **not sinister, and it
plays pranks.** So it is not a hostile grind. It puts your light out. The mine is dark,
`cansee()` already gates on carrying a light, and the joiner's cellar has already
taught the player that being in the dark underground is a real state and not a
cosmetic one. A creature whose whole personality is snuffing your lamp is a hazard
worth walking around rather than a health bar.

### Ending

The player stands at the bottom of the deep cut, at a hole that was opened from the
far side, and understands why a hunter with money asked a turnip seller for a way
under the village that did not go through the burial ground.

The mine **does not** answer what happened to Dein. That stays open on purpose — it is
the door to the east, and the east is a chapter.

## Verified assets — what exists, so nothing gets invented twice

Measured against the sources rather than assumed. Anything not listed here has to be
built.

### Creatures

There is **no rat, bird, crow, boar, dog or livestock creature in the game at all**, so
the roster below is what the north has to be built from. That is a constraint on the
design rather than a shopping list: five creatures is enough for six scenes.

| Creature               | id        | State                                                   | Use                                                                                                                                                                  |
| ---------------------- | --------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kksh` Scarecrow       | 126       | Fully statted, spawns nowhere                           | The Scarecrow's Field. Its drop table is a verbatim copy of a slime's — water, slime, jelly — which is wrong for a straw figure and gets replaced with `item.sstraw` |
| `rbt1` Wild Rabbit     | 123       | Statted, already in three woods areas                   | The Stubble Fields. Its own description says _plains and woods_, and it drops `item.crrt`                                                                            |
| `slm1` / `slm2` Slimes | 121 / 122 | Statted, in the woods                                   | The Stubble Fields, low band                                                                                                                                         |
| `wolf1` Weakened Wolf  | 136       | Statted, one area at 7-8                                | The Grain Store. `market_rumours` already remembers wolves getting into it                                                                                           |
| `lsprt` Lamp Spirit    | 133       | A byte-for-byte duplicate of the scarecrow's stat block | The mine. Needs a real design, and its description is the design                                                                                                     |
| `lrck` Locked Rock     | 132       | Done, in `area.lrck1` at 20-22                          | Already placed. The mine reaches the same stone from the other side                                                                                                  |

The five dolls are **not** free content: no health, no stats, and a `battle_ai` with an
empty body. They stay out of both regions.

### Skills

`skl.mng` "Mining" (id 143, `type = 8`) exists and is completely inert — no
`giveSkExp`, no reader, nothing. So does `skl.glg` "Geology", _ability to identify
precious minerals_, sitting unused directly beside it. Both belong to the mine. All
three `type = 8` skills are stubs, so there is no working example of the class to copy
from; `skl.scout`, which `scoutGeneric` drives, is the nearest thing.

### Items and tools

**There is no pickaxe, ore, ingot, anvil or smelter anywhere in the game.** All of that
is new. `item.coal1` and `item.coal2` already exist and already burn in the fireplace,
and `coal1` has no source at all — the Adit is its source.

`wpn.trch` is the template for the pickaxe: a real `slot = 1` tool with token combat
numbers, a low `dp`, a `degrade` rate, its own `onDegrade` message, and — the part that
matters — `oneq` / `onuneq` toggling a `you.mods.*` flag the rest of the game gates on.
`you.mods.light` is exactly that, and it is what `cansee()` reads.

Farmland items that already exist and need no invention: `crrt`, `rice`, `brly`,
`agrns`, `sstraw`, `watr`, `wbrs`, `mshr`, `acrn`.

### Attach points

| What           | Where                                                                                                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The north road | `chss.lsmain1` (id 106). Its `sl()` is a flat sequence of `chs()` calls with no ordering dependency, so a new choice after _Go home_ disturbs nothing                                                                                                      |
| The notice     | `chss.mbrd` (id 108), as a top-level `if (global.flags.X)` block mirroring _Notice #4_. **Careful:** the Xiao Xiao encounter sits inside a `for...in inv` loop that returns out of `sl()` entirely when it fires, so on that pass no notice renders at all |
| The pickaxe    | `chss.smith` (id 172) grants nothing today and has no vendor. It gets one                                                                                                                                                                                  |
| The mill drain | `global.flags.deintrail` already exists, is set at the lodge and read at the nervous man's stall. The drain is already flagged; it simply has nowhere to lead                                                                                              |

### Free ids

chss **174** (and the unused holes at 110 and 122) · area **126** · quest **11** ·
creature **139** · lore **28** · item **5066** in the materials band · wpn **10059**
(and the hole at 10008) · `callback.onDeath` hook **1008** · sector **6**.

`area.lrck1` is the twenty-fifth and last area definition. Every new area goes after
it.

## Build order

Each step is a shippable release on its own, with its own tests, and none of them
leaves the game in a state where a player can walk into an unfinished room.

1. **The smith sells.** He has no vendor at all today. Give him one and put the pickaxe
   in it. First, because it is worth having on its own and because the mine cannot
   open without it.
2. **The north road and the fields.** A north sector, the well road, the stubble
   fields, and the notice that opens them. Rabbit and slime bands only — no scarecrow
   yet, so the first release is a place before it is a story.
3. **The scarecrow.** Its field, and its drop table corrected off the slime's.
4. **The mill and the grain store.** The miller, the wolves, and the old drain found
   but not yet passable.
5. **The mine's first depth.** The Adit, coal, and `skl.mng`'s grant path.
6. **The flooded level**, and the well's water finally explained.
7. **The deep cut**, the lamp spirits, and `whoseHand` answered.

## What this closes

| Owed before                                                                   | Closed by                |
| ----------------------------------------------------------------------------- | ------------------------ |
| The scarecrow had no field, farm, meadow or rural sector anywhere in the game | Region 1                 |
| The lamp spirit had no mine, shaft, ore or pickaxe anywhere in the game       | Region 2                 |
| `skl.mng` existed with no grant path and no reader                            | Region 2, the Adit       |
| The smith's second half — mining, a pickaxe, an anvil                         | Region 2's opening       |
| `market_rumours`' grain store, the message board's livestock, the mill        | Region 1                 |
| `secondWayIn` pointed at a drain by a mill that did not exist                 | The join between the two |

## What this deliberately does not touch

- **The east.** Reserved, chapter-sized, and promised in dialogue three times.
- **The catacombs' western corridor.** The owner has a written room-by-room design for
  `cata13`–`cata25`; the mine reaches the same stone from the other side and stops
  there.
- **What happened to Dein.** Named as off-limits in the owner's own plan.
- **The dolls.** Five creatures running entirely on constructor defaults, and no tier
  to anchor them to yet. Still owed, still unscheduled.
