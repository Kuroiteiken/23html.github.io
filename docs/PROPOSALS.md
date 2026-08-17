# Proposals

[Türkçe](PROPOSALS.TR.md)

Things worth building that are not built yet. Nothing here is in the game — that is
the whole point of the file. Once a proposal ships it moves to
[docs/STORY.md](STORY.md) as fact and comes out of here.

Each entry says what it is, what already exists to hang it on, and what genuinely
has to be new. That second part matters: the project's rule is to connect finished
content before inventing more, so a proposal that needs a lot of new material has
to justify it.

Status is one of **proposed** (written down, not agreed), **agreed** (we decided to
do it), or **in progress**.

---

## Regions

### 1. Below the crack — where Dein went

**Status:** proposed, and recommended as the next region.

Chapter IV ends on a wall at the end of the catacombs that was cut through from the
far side, with warm air coming up out of the passage beyond it and a hunter's mark
one wet season old beside the opening. The player cannot follow it yet.

This is the least invented region available, because the game has already promised
it twice over:

- The cut wall and the warm passage exist in `chss.cata25` as written text.
- The nervous man at the market has just named a **second** way down — the old drain
  by the mill — which is what Dein actually asked him about. So the region already
  has two entrances from two different directions, both established in dialogue.
- Dein's arc wants exactly what the brief asks for: traces rather than a reveal.
  Abandoned camps, broken equipment, marks that contradict each other, some
  suggesting he died and some that he did not.

**Already exists:** the cut wall, the mill drain, the mark, the broken sword tip,
`global.flags.deintrail`, four open questions in the lore panel that this answers or
sharpens (`whatDeinSought`, `catacombsForgotten`, `underTheSouth`, `whyTheEast`).

**Has to be new:** the scenes themselves, one or two creature tiers, and whatever is
at the bottom. The remaining creature stubs — the doll and puppet family, `lrck` the
mimic that pretends to be a wall, `lsprt` the lamp spirit that haunts mine lamps —
are all thematically underground and all currently unreachable, so the population
may not need inventing at all.

**Why this one first:** its entrances, its hooks and most of its bestiary are
already sitting in the sources. It closes the Dein thread the story is currently
standing on.

### 2. The east

**Status:** proposed, later.

Yamato has said "we're going east soon" since long before this fork, and he has now
sent word east twice — once after the pack leader and once the night he learns his
deputy went under the village. The debt is explicit and getting louder.

**Already exists:** the promise, in his own dialogue, three times over.

**Has to be new:** effectively everything. A new region, a new cast, its own economy
and its own quest chain. This is a chapter-sized piece of work rather than a
connection, which is why it should follow the Dein arc rather than interrupt it.

---

## Systems

### 3. The blacksmith

**Status:** proposed.

A smith the player rescues, who then becomes a standing service. The rescue is the
quest; the service is the reward, which is a better shape than a smith who is simply
present from the start.

What the smith would do:

- **Repair.** Durability already exists on every piece of equipment (`dp`/`dpmax`),
  degrades in play, and there is currently nothing in the game that restores it.
  A weapon whose durability runs out is simply spent. This is the strongest part of
  the proposal: it fixes a dead end the game already has.
- **Buy materials.** The player accumulates bone, cloth, coal and ore-like junk with
  no buyer.
- **Sell an anvil** as furniture. The furniture system exists (`furn`, `giveFurniture`,
  the storage box and fireplace are both furniture), and the fireplace already takes
  fuel — so an anvil that consumes coal has a working precedent to copy.

What it needs that does not exist:

- A **smithing skill**, and a **mining skill** to feed it.
- A **pickaxe**, and somewhere to use it. Note that `item.coal1` and `item.coal2`
  already exist and the catacombs are full of rock, so the mining half has a home
  without a new region.

**Already exists:** durability with no repair anywhere, the furniture and fuel
system, coal and charcoal as items, a fireplace that consumes fuel, `skl` as an
extensible registry, and roughly 35 unreachable weapons that a smith could
plausibly be the source of.

**Has to be new:** two skills, the smith's scenes and dialogue, the pickaxe, the
anvil's recipes, and the rescue quest.

**Note on scope:** this is three features wearing one coat — repair, mining, and
crafting-at-an-anvil. Repair alone is worth shipping on its own, and it is the piece
that closes an existing dead end rather than opening a new one. Suggest doing it
first and treating mining and the anvil as a second step.

---

## Balance decisions, not fixes

### 4. Armour's class resistance is counted twice, with opposite signs

**Status:** proposed, and needs a decision rather than a patch.

In the branch of `dmg_calc` that runs when a creature attacks the player, the
struck armour's class resistance appears inside the mitigation as
`100 + armour.cls[ctype] * 5 * ta` and again outside it as
`100 - armour.cls[ctype] * 5 * shdc * ta`, where `shdc` is `1 + skl.shdc.lvl / 20`.
The two mostly cancel, and the outer one scales with the Shield skill, which has no
business scaling armour at all.

The shield half of that outer factor was a plain bug and is fixed: a shield's
affinity now scales the shield's own share of the mitigation. The armour half is
deliberately left alone, because it is doing real work. It is the only thing keeping
combat dangerous.

Measured on a level-35-ish character — STR 50, chest armour STR 12 at full
durability with physical affinity 5 and edge resistance 4, Shield skill 10, against
an attack term of 100:

| Outer factor             | Unshielded damage taken | With the Hoplite Shield |
| ------------------------ | ----------------------- | ----------------------- |
| As it ships (armour `-`) | 36.9                    | 26.9                    |
| Corrected (armour `+`)   | 9.9                     | 1.0                     |

So correcting it makes an unshielded player roughly four times more survivable and
floors damage at 1 for anyone carrying a shield. That is not a fix, it is a
rebalance of every fight in the game, and it should be a deliberate choice — most
likely alongside lowering the flat `def.str * eff` term, which is what actually
dominates the mitigation.

**Already exists:** the two terms, and a regression test pinning the shield half so
it cannot silently revert.

**Has to be new:** a decision, and if taken, a pass over creature damage.

---

## Side stories still owed

The brief asks for at least eight. One is in (**The Man Who Said Nothing**, the
nervous man at the market). These are the hooks already sitting in the sources:

| Hook                       | What exists                                                                                                                                                                                       | What it wants                                                                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **The Nightmare**          | Fully written and commented out at `chss.hbed.onStay`: sleeping in your own bed could pull you into a nightmare area against `creature.ngtmr1`, with the line "Your sins are crawling up on you". | Restoring it as written would trap the player — the creature has 100,000,000 hp and a `battle_ai` that never attacks, so the fight can be neither won nor lost. Needs a real exit, and it now has a reason to exist: the player has been breathing death ki. |
| **The damp cellar**        | `area.clg` is defined and populated and never initialised once. Its completion handler called two scenes that do not exist, so its quest was cut.                                                 | A scene to reach it from, and a new completion handler.                                                                                                                                                                                                      |
| **The scarecrow**          | `creature.kksh`, fully statted, dark-corrupted, described as ambushing — and in no area.                                                                                                          | Somewhere with fields.                                                                                                                                                                                                                                       |
| **The mimic**              | `creature.lrck`, 9000 hp, `battle_ai` returns false, described as pretending to be a wall in caves and dungeons.                                                                                  | A wall to be, underground.                                                                                                                                                                                                                                   |
| **The lamp spirit**        | `creature.lsprt`, statted, described as haunting oil lamps in mines.                                                                                                                              | Mines — see the blacksmith proposal.                                                                                                                                                                                                                         |
| **The dolls**              | `puppet`, `bpuppet`, `doll`, `ndoll`, `cdoll`: five creatures about possession and dark rituals, all stubs, all unreachable.                                                                      | Stats, and someone performing the rituals.                                                                                                                                                                                                                   |
| **The seven keys**         | Seven key items with no lock anywhere in the game.                                                                                                                                                | Locks. A dungeon of named rooms is the obvious home.                                                                                                                                                                                                         |
| **The marketplace sector** | `sector.vmain1` is attached to seven scenes with its entire scout table commented out.                                                                                                            | Uncommenting and finishing it.                                                                                                                                                                                                                               |

---

## Smaller things worth not losing

- **The player panel's effect strip overlaps the LUCK readout.** Confirmed by
  measurement: from the first icon, and it covers the text entirely at ten or more
  effects. There is no free space to move it into — the panel is a fixed 310px and
  its in-flow column already reaches the strip's band — so it needs a deliberate
  layout decision rather than a nudge.
- **`chss.bsmnthm1.data.gets` has two entries but the third scout result writes
  `gets[2]`,** so that find is never latched as already taken.
- **`global.flags.bsmntchck`** gates the basement's "Examine your surroundings"
  choice and is never assigned anywhere.
- **Weapon-mastery titles.** `srd3`, `srd4`, `lnc3`, `hmr3`, `axc3`, `sld3`–`sld5`
  have no grant path. They want kill-count milestones, which the stat-milestone table
  added in v476 can already express.
- **`rnk` above 9 gets no rank drop.** `ar = ((rnk - 1) / 3) << 0` indexes
  `global.rdrop`, which only has tiers 0 to 2 populated, so every deep creature
  relies entirely on its own drop table.
- **`item.svial1`** builds a throwaway area with a skeleton in it. Unclear whether
  that is finished or abandoned.
- **`vendor[*].dfl`** is assigned on four of the five vendors and read nowhere.
- **Eleven of the fourteen shields are still stubs** — `qad`, `crc`, `rnd`, `twr`,
  `spk`, both `kit` entries, `htr`, `ovl` and `jrt` all carry `str = 0` and no
  resistances, so any of them would defend exactly as well as an empty hand. The
  three the dojo awards are done; these have no source either way, so they are
  content waiting for a vendor or a drop rather than a bug.
- **A stat-point pool does not exist.** Nothing in `js/` keeps unspent points, so
  "spend a point on a stat every few levels" would be a new system rather than a
  wiring job. The milestone grants in `levelGrants` are the cheap version of it and
  are already in.
