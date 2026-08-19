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

> **The rural region and the mine are designed.** See [REGIONS.md](REGIONS.md) for
> what opens each one, what the player is expected to take away, and what closes it.
> The scarecrow and the lamp spirit are no longer blocked; they are scheduled there.

## Queued by the repository owner

Everything the owner has asked for that is not finished yet, recorded here before work
starts so nothing is lost between sessions. An item leaves this list when it ships, and
what it did goes into the changelog and, if it touches the story, into
[STORY.md](STORY.md).

> **These entries were researched against the code after they were recorded, and the
> research changed several of them.** Two turned out to be already shipped. Four rested on a
> premise that measurement contradicted. Two one-word bugs found along the way are already
> fixed in v478.30. Each entry below says what the measurement found, because a request
> written from memory and a request written from the code are not the same request.

### 5. Are the resistance fields read in combat? — **answered: mostly no**

**Status:** answered. What follows from it is a decision.

The `res` object has 12 fields, identical on the player (`js/core/player.js:89-102`) and on
every creature. **Eleven of the twelve are never read by `dmg_calc` at all.** They gate
whether an effect is applied, not how much damage gets through — `giveEff` consults them, the
damage path does not.

And the three things the request names live in three different systems, only one of which is
a `res` field:

- **Pain resistance** is `res.ph`, and it is the one field with a live reader.
- **Undead resistance** is not a `res` field. It is `you.maff` / `you.cmaff` indexed by a
  creature's `type`, which `dmg_calc` does read.
- **Dark defence** is not a `res` field either. It is `aff[6]`, the dark element slot in the
  affinity arrays.

So the honest answer is: resistances do not reduce damage, with one exception; two of the
three things named are not resistances. Whether they _should_ reduce damage is the decision,
and it interacts with entry 4 — the mitigation term is already the dominant number in the
formula.

**One unambiguous bug found while measuring:** `js/data/skills.js:499`, a milestone writing
`you.res.ph += 0.01`. The sign is inverted relative to how `res.ph` is consumed. Confirm the
direction before changing it; it is one line either way.

### 6. Titles: 26 already written, translated, and never granted

**Status:** agreed, and cheaper than it looked.

The request was "titles need improvement and additions". The measurement says the problem is
not additions. **23 of the 108 titles have no grant
path at all** -- measured by `npm run pending`, which is the figure to trust over any
number written here by hand. The four biggest families already have live saved counters, so connecting them
is wiring rather than design. `js/data/equipment.js:2730-2731` is part of this: two grants
left in a comment, both testing the same `moneyg >= GOLD` condition `ttl.mone1` already uses,
so uncommenting them as they stand would fire all three together.

This is the project's own rule with nothing added: connect what is finished before writing
more.

### 7. Shields: the ranks, the seven with no source, and `eqp.dummy`

**Status:** agreed. The draft premise is stale; the `eqp.dummy` half is exactly right.

"Eleven of the fourteen shields shipped with `str 0`" was never quite the shape of it and is
no longer true at all: there are **seventeen** shields, none at `str 0`, running from `csr` at
4 to `drd` at 23 with `aff[0]` and `cls` filled in throughout — finished in commit `ee65ee8`.

What is actually left:

- **Eleven of the seventeen have no source** — no recipe, no vendor, no drop: `bkl`, `plt`,
  `twr`, `spk`, `kit`, `csr`, `ovl`, `knt` and three more.
- **Every one of the seventeen has `int 0`**, so in the magic branch of `dmg_calc`, where a
  shield contributes through `you.eqp[1].int`, no shield in the game defends against a spell.
- The `eqp.dummy` problem in queue item 6 of [status.md](status.md) stands as recorded, and
  "a shield always reduces damage" cannot be made true until it is cleaned up.

### 8. The healing items with no repeatable source

**Status:** agreed — a fix.

Measured across all 352 items: six instant-heal items, three that raise maximum HP, and no
HP-regeneration effect anywhere in the game. The specific gap the request points at is real and larger than one item: **four healing items
have no source at all** -- `lifedr`, `hptn2`, `hptn3` and `hptn4`. `hptn1` and the rest are
reachable. Four recipes, or a vendor line, closes it.

### 9. Crafting: 19 finished recipes nobody can learn, and stardust

**Status:** agreed.

62 recipes exist. The measurement found the diversification problem is not where the request
put it: **19 finished, fully translated recipes have no path by which a player can learn
them.** Connect those first — again the project's own rule — and the remaining gap is about
nine everyday cooking lines.

`item.stdst` is worse than "left with nothing to do": **zero of the 62 recipes touch it**, and
its entire `use()` is one message. The cheapest correct fix reuses `effect.cdlt`, which
already exists.

### 10. A perk for every skill up to level 15 — **needs a decision on scope**

**Status:** needs a decision. The two bugs beside it are already fixed.

The premise is partly false in the way that matters most: **level 15 is not a modest floor,
it is deep endgame.** `expnext()` is identical for all 60 skills, and cumulative experience
runs 716 at level 5, 47,986 at level 10, and **1,151,201 at level 15** — against typical
grants of 0.2 to 0.6 per action. The existing design already knows this: of 143 milestone
entries at level ≤ 15, 69 sit at levels 1-5 and only 6 sit anywhere in 12-14.

The cost depends entirely on the reading, so this needs the owner to pick one:

| Reading                                            | New entries | New locale strings |
| -------------------------------------------------- | ----------- | ------------------ |
| At least one perk per skill by level 15            | 32          | ~64                |
| Match existing density across the bare skills      | ~230        | ~460               |
| Fill levels 1-15 for the 23 that already have some | 202         | ~404               |
| A perk at every level 1-15 for all 60 skills       | 757         | ~1,514             |

The last is a content mill and does not justify itself by the project's own standard.

**Also measured:** five skills can never leave level 0 (`bwc`, `hvt`, `glg`, `mntnc`, `swm`),
and four of them are referenced nowhere outside `skills.js` — inert definitions. `bwc`'s
experience _rate_ is raised in five places, all of which multiply zero. Giving these perks
before giving them an experience path would be writing perks nothing can trigger.

**Fixed in v478.30, both found here:** `skl.hvt.type` was written inside the `skl.hst` block,
leaving `skl.hst.type` unset — Harvesting was the only type 0 skill and sorted alone. And two
milestones wrote `you.eqp_t`, which does not exist, so Gluttony's level 10 and Death's level 5
advertised an EXP bonus and delivered NaN.

**Correction to the constraint recorded above:** the list of fields a milestone may write is
wider than `stra`/`agla`/`inta`/`spda`/`hpa`/`sata`. `exp_t`, `luck` and the whole `mods`
object are saved too — measured writes across all 146 entries: `exp_t` 43, `hpa` 38, `stra`
32, `agla` 25, `sata` 23, `mods.sbonus` 7, `inta` 6, `mods.cpwr` 3, `luck` 2, `spda` 1.

### 11. Weapon-mastery titles — **mostly already built**

**Status:** needs a decision on the one part that is new.

Both halves of the request already exist. **22 weapon-mastery titles are in the game, and 13
of them already carry a mastery gain-rate bonus.** What does _not_ exist is the conditional
the request implies: making that bonus depend on the title being _worn_. That is the only new
part, and it is a design decision rather than a gap.

### 12. ~~A burn debuff on fire damage~~ — **already shipped**

**Status:** closed. Nothing to build.

Shipped in commit `c19c781`, "Let fire actually burn: a real burning effect, and a chance to
catch". A fire hit rolls a chance to apply a burning effect that drains the creature's health
over time — precisely what the request describes. Verified end to end in both locales. The
only open detail is a `?? 1` guard in the effect's own code, which is a robustness note rather
than a feature.

### 13. Furniture — **two thirds already shipped**

**Status:** agreed on the remaining third.

Shipped in commit `ea8fa22` (2026-08-18, "Notice which bed you own, and make a lit fire worth
sleeping beside"): beds exist, `furniture.bed1` upward, and the "crouch on the floor" line
already changes when the player owns one, with the healing rate rising by grade.

What is left is the third the request also asked for: **two finished, named furniture pieces
that no player can obtain.** Connecting them is the whole of it.

### 14. ~~A fireplace worth lighting~~ — **already shipped**

**Status:** closed. Nothing to build.

Every clause of this request is in the game, across two commits both dated 2026-08-18:
`ea8fa22` for the lit fire's healing and energy gain, and `00295f7` ("Leave a night by the
fire on the player: the Rested effect") for the timed buff after sleeping beside it. Working
in both locales. The only open item is a wrong comment.

### 15. Unlimited clearing — **the cap mostly does not exist**

**Status:** needs a decision, and it is smaller than it looked.

Measured over all 31 areas: **21 of the 31 re-arm themselves on clear**, so clearing is
already unlimited for most of the world. And the "clear it N times, then it opens" pattern the
request asks for **already ships twice** elsewhere in the game.

**Partly done in v478.33.** The owner asked for the endless-hunting pattern -- the one the west
has had all along, where a cleared region opens a sibling area with `size -1` that reports the
infinity glyph instead of a count -- to reach the south and the fields. `area.frstn9a2` and
`area.nfld3` do that now, unlocked by clearing their bounded siblings once.

**Decided and done in v478.34.** The owner asked for the mine and the catacombs as well, and
for the catacombs to get something in the middle rather than at the depth -- their five areas
climb from level 9 to 28, so an endless ground at the bottom would only serve a player who had
already finished. `area.cata6a` carries the middle corridors' population and opens when they are
cleared; `area.mine4` carries the level above the deep cut and opens when the deep cut is.
`area.nfld4` was added alongside them for the scarecrows specifically, since the fields' general
endless ground has no scarecrow in its population.

Six regions have one now. Nothing here is outstanding.
That is a content decision and needs no save migration — which removes the reason this was
paired with the accessory slots.

### 16. Scouting elsewhere — **wired in 12 places, with two bugs**

**Status:** agreed on the bugs; the extension is a smaller job than stated.

"Used nowhere else" is false: scouting is wired into **12 places** — 7 locations and 5 sectors
carry scout tables, and on a fresh game 52 of the 82 registered scenes can reach one.

Underneath the wrong premise are two real bugs with no design question attached:

- a forest that reports itself searched while having no table at all, and
- a coal mine whose scout path cannot be completed.

Fix those two first; extending scouting further is then a content choice rather than a
mechanic.

### 17. Side stories, continued

**Status:** proposed. The hooks are listed under "Side stories still owed" below, which the
brief's count of eight is measured against.

One decision from the owner is recorded here as **closed** rather than pending: the effect
strip in the player panel overlapping the LUCK readout is **accepted as it is** -- it reads as
information, and that is enough. No change. It is kept in writing because a later reader would
otherwise see the overlap and treat it as a bug nobody had noticed.

### 18. The surfaces the dark redesign skipped

**Status:** agreed — the owner asked for this directly, and one item of it already shipped
in v478.29 (the save transfer dialogs and `#save-bar-restore`).

Audited with five lenses over `css/game.css` and `js/ui/` — palette, hand-built overlays,
keyboard reach, hover/focus states, structure — with every candidate finding re-read by a
separate pass told to refute it. Nineteen survived. Ordered by how visible the result is
to a player.

1. **The tooltip frame** (`css/game.css:974-989` `#dscr`, `730-733` `#d_l`). A
   `5px lightgrey` border with a black outline outside it, over an interior already
   darkened to `#333`/`#111`. This is the most frequently shown surface in the game and
   the widest light band left on screen. Match `.game-modal`'s frame order
   (`border: 3px solid #050912; outline: 2px solid #6676bd`), `color: white` →
   `rgb(188 254 254)`, and the `#d_l` divider `darkgrey` → `#526988`. Note `#dscr` has no
   `box-sizing`, so 5px → 3px narrows the panel by 4px; `positionDescription` measures
   `offsetWidth`, so it adapts on its own.
2. **The main navigation** (`css/game.css:308-314`): five top-level panel buttons with an
   `orchid` border, no `tabIndex`, no `role`, no `keydown`, and no `.ct_bts:focus-visible`
   rule. Border → `#3848c0`; the keyboard half follows the pattern already used by
   `dom.sl_kill`.
3. **The title-picker window** (`js/ui/interface.js:58-99`): a hand-built `div` at a fixed
   `top: 50px / left: 81px`, with a literal copy of the `--list-row` value, and **no way to
   cancel** — the only thing that closes it also writes `you.title`. Rebuild on
   `createGameModal`. This carries a real bug with it: `js/core/bootstrap.js:1503` clears
   `global.flags.ttlscrnopn` on load without removing the DOM node, leaving a window that
   can neither be closed nor reopened.
4. **The inventory row chips** (`.del_b`, `.dss_b`, `.eq_l`/`.eq_r`, `.spc_a`). The whole
   cluster predates the redesign — `royalblue` under `#f80`, a `lime` hover border, and
   `.dss_b:hover` turning the chip light grey with grey text on it. Two separate jobs: the
   palette (low risk, but the `royalblue`/`crimson` values are written inline in JS at
   `js/ui/interface.js:5037/5042/5062/5067`, so CSS alone will not hold), and keyboard
   reach (high risk — the chips are built on `mouseenter` and destroyed on `mouseleave`, so
   making them reachable means rebuilding the row mechanism).
5. **The inventory panel's grey rules** (`css/game.css:1208-1212`, `1219-1225`, `136-140`):
   plain `grey` borders framing a panel whose every other line is `#3848c0`/`#44c`/`#249`.
   `.bts_b` is shared with the skills window, so the change shows in both — which is the
   intent.
6. **The settings panel**, three small things: the language `<select>` drops a white list
   over the dark panel (`css/game.css:340-343`; note author `option` colours are honoured
   on Windows Chromium/Firefox and ignored by macOS native menus); the Export/Import row
   halves carry an inline `1px lightgrey solid` border (`js/ui/interface.js:2590`, `2664`)
   left over from the windows that were replaced in v478.29 — and removing it must restore
   `.opt_va`'s `border-left` column divider; and the background-preset chips have no hover
   or focus state of their own, though their fills are a **preview of the colour** and must
   not be touched.
7. **The read-books window** (`js/ui/interface.js:1767-1776`): `#210445` behind a
   `solid lime 1px` border, no title bar, no close control, no Escape — any click inside it
   closes the list. Rebuild on `createGameModal`; the rarity colours in its rows are
   semantic and move across unchanged.
8. **`chs()` choice rows** (`js/ui/interface.js:5255`): the game is played through these —
   roughly 706 calls in `js/world/locations.js` — and the only way to activate one is a
   mouse click. The visual redesign reached them; the keyboard did not. Two things make
   this medium-to-high risk rather than a one-line fix: the factory's own `click` listener
   is not the action path (each caller binds its own), so Enter/Space has to dispatch a
   real `click` event; and `clr_chs()` tears the rows down and rebuilds them constantly, so
   focus needs a strategy or a keyboard user restarts from the top after every choice.
9. **Status-effect icons** (`css/game.css:300-307`): an invisible `black` base border and a
   `lime` hover, where the redesign settled on `#71e6b1`. Palette only — the verification
   pass established these are not controls: the enemy-panel copies have no listener at all,
   and the player-panel one calls `e.onClick()`, which is a no-op for every effect in the
   game.
10. **`#rptbn:hover`** (`css/game.css:1409-1421`): `lightgrey`, and **dead** — the control
    writes its own background inline on creation and on every click, so the rule never
    paints. The player never sees the light grey, but the control also has no hover
    feedback at all while its neighbours do.
11. **`input:focus { outline: none }`** (`css/game.css:104-106`): an unqualified type
    selector removing the focus ring from every input in the game, written before
    `:focus-visible` existed. The redesign has had to climb over it one element at a time.
    `#nch` and `.opt_v` have no border and no background, so a keyboard user cannot see
    which field they are in at all. Narrow it rather than deleting it.
12. **`.i18n-load-error`** (`css/game.css:16-24`): a white card with `#900` text, sitting
    directly beside `#save-unreadable`, which was converted to the dark error palette
    (`#3a1a18` / `#a32219` / `#ffb4ae`). Last because it is invisible in practice: the
    loader never removes the boot overlay, and `#loading-overlay` at `z-index: 9997` covers
    the card — which is a separate bug worth noting, since a player whose locale files fail
    sees a stuck loading screen rather than the message.

**Deliberately not changed:** `positionDescription`'s measurement and pixel writing;
`MS Gothic`, which is the project's typeface rather than a deviation; every rarity, tier,
durability and drop-chance colour, and the per-effect inline colours on the status icons,
all of which are data encoding; `#rptbn`'s `#a11`/`green` pair and `.eq_*`'s `crimson`,
which carry on/off and "equipped in this hand" state; the background-preset fills; and
anything inside a comment.

**Already exists:** `createGameModal`, the three `--list-*` tokens, the save bar's
border/gradient/hover as the reference for chrome, and `dom.sl_kill` as the reference for
giving a span keyboard reach.

**Applied in v478.30:** items 1, 5, 6a, 6b, 7, 9, 10 and 12 above, each pinned in
`tests/check-game-regressions.js` so the rule cannot return. Item 7 gained behaviour as well
as palette: the read-books list used to close on any click inside it, and its load-time
teardown removed the node by hand while clearing the flag, which is how a window that
neither closed nor reopened could be left behind.

What is left is items 2, 3, 4, 8 and 11 -- the title-picker window (which needs a decision,
because giving it a cancel path changes the flow), the inventory chip cluster whose colours
are written inline in JavaScript, and everything to do with keyboard reach, including
`chs()`.

**Has to be new:** a `.ct_bts:focus-visible` rule, a focus strategy for `chs()` rows
across a rebuild, and a decision on item 4's second half, which is a row rewrite rather
than a restyle.

### 19. Casters kill in one hit, and nothing defends against them

**Status:** needs a decision. The measurement is done; the correction is a balance change.

Found by extending `scripts/check-combat.js` to measure the abilities a creature's `battle_ai`
can actually reach, rather than `abl.default` alone. It had never looked at anything else, which
is why this survived.

**What was measured**, all through the real `dmg_calc` and each ability's own `f()`:

| Creature | Ability     | Level | Hits for | Budget |
| -------- | ----------- | ----- | -------- | ------ |
| `zmbm`   | `abl.spark` | 18    | 935      | 337    |
| `zmbm`   | `abl.spark` | 22    | 1063     | 412    |
| `dcrps1` | `abl.spark` | 26    | 792      | 487    |
| `dcrps1` | `abl.spark` | 28    | 833      | 525    |
| `zmbk`   | `abl.dstab` | 19    | 396      | 356    |
| `zmbf`   | `abl.bash`  | 14    | 270      | 262    |

A level-20 player has **421 hp**. `creature.zmbm.battle_ai` rolls `abl.spark` on **40% of its
swings**, and `zmbm` is 30% of the population in `area.cata3a` -- the middle of the catacombs.
`creature.dcrps1` rolls it on 30% and is the whole population of `area.cata5a`.

**Where the number comes from.** `abl.spark` carries `affp 25`, and the magic branch of `dmg_calc`
multiplies `atk.affp` by **fifteen** where the physical branch uses ten. `abl.spark.f` then scales
the result by `1.2`. So `(100 + 25 * 15) / 100` is a 4.75x multiplier before the scaling.

**And nothing on the player's side answers it.** In that branch a shield contributes through
`you.eqp[1].int`, and every one of the seventeen shields has `int 0`. Giving the Hoplite `int 18`
moves 487 to 473 -- 3%. So the shield gap in entry 7 is real but it is not the lever here.

**The decision.** Three candidates, and they are not exclusive:

1. Lower `abl.spark.affp` from 25 toward the physical abilities' range. This is the single
   smallest edit and it moves every caster at once.
2. Bring the magic branch's `affp * 15` down to the physical branch's `* 10`, which is a
   consistency argument as much as a balance one.
3. Give shields and armour real `int` values so the magic branch has a defence to read, which is
   worth doing regardless but is not sufficient alone.

Until one is chosen, the pairs are recorded in `KNOWN_OVER_BUDGET` in `scripts/check-combat.js`,
so the check reports what is known and still fails on anything new. Do not add to that list to
make a new creature pass.

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

**Status:** half shipped. Repair and sharpening are in -- see
[STORY.md](STORY.md). What is left is the mining half and the rescue.

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

Re-measured through the real `dmg_calc` with `tests/harness.js`, on the character this
was originally written against — STR 50, chest armour STR 12 at full durability with
physical affinity 5 and edge resistance 4, Shield skill 10, `sld.hpt` (the Hoplite
Shield, STR 18), against an attack term of 100:

| Outer factor             | Unshielded damage taken | With the Hoplite Shield |
| ------------------------ | ----------------------- | ----------------------- |
| As it ships (armour `-`) | 37.0                    | 27.0                    |
| Corrected (armour `+`)   | 0.0                     | 0.0                     |

**The corrected figures recorded here before were wrong, and being wrong changed the
decision.** They said 9.9 and 1.0 — roughly four times more survivable. The measurement
says zero and zero: with the sign corrected, the mitigation term exceeds the whole attack
and the result is floored, so this creature stops being able to damage this player at all.
`minimumLandedDamage` is deliberately only applied to the player's outgoing damage, so
nothing floors a creature's blow at a minimum on the way in.

That is not a rebalance to weigh, it is a change that cannot be made on its own. It only
becomes possible alongside lowering the flat `def.str * eff` term, which is what actually
dominates the mitigation — and the size of that reduction has to be derived from this
measurement rather than guessed.

Reproduce it: the scenario is a probe against `dmg_calc(creature, you, abl.default)` with
`global.target` set to the struck piece; flipping the sign is a one-character edit in
`js/systems/combat.js` at both `100 - global.target.cls[att.ctype]` sites.

**Already exists:** the two terms, and a regression test pinning the shield half so
it cannot silently revert.

**Has to be new:** a decision, and if taken, a pass over creature damage.

---

## Side stories still owed

The brief asks for at least eight. Three are in: **The Man Who Said Nothing** (the
nervous man at the market), **The Nightmare** (see [STORY.md](STORY.md)), and the
marketplace's own search table. These are the hooks still sitting in the sources:

| Hook                | What exists                                                                                                                  | What it wants                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **The lamp spirit** | `creature.lsprt`, statted, described as haunting oil lamps in mines.                                                         | Mines — see the blacksmith proposal.                 |
| **The dolls**       | `puppet`, `bpuppet`, `doll`, `ndoll`, `cdoll`: five creatures about possession and dark rituals, all stubs, all unreachable. | Stats, and someone performing the rituals.           |
| **The seven keys**  | Seven key items with no lock anywhere in the game.                                                                           | Locks. A dungeon of named rooms is the obvious home. |

---

## Smaller things worth not losing

- **The message board's statue encounter still only looks in the inventory.** The four
  statues are furniture now, and `chss.mbrd` scans `inv` inside a `for` loop whose body
  _is_ the encounter, so widening it to include a placed one means restructuring the
  loop rather than changing a condition. A statue standing in the house does not
  currently count towards the girl with emerald green eyes; carrying one does. Xiao
  Xiao already accepts either.

- **`chss.bsmnthm1.data.gets` has two entries but the third scout result writes
  `gets[2]`,** so that find is never latched as already taken.
- **`rnk` above 9 gets no rank drop.** `ar = ((rnk - 1) / 3) << 0` indexes
  `global.rdrop`, which only has tiers 0 to 2 populated, so every deep creature
  relies entirely on its own drop table.
- **`item.svial1`** builds a throwaway area with a skeleton in it. Unclear whether
  that is finished or abandoned.
- **`vendor[*].dfl`** is assigned on four of the five vendors and read nowhere.
- **Stats rise on a level and on certain item uses, and that is the whole design.**
  There is no unspent-point pool anywhere in `js/` and none is wanted, so the
  milestone grants in `levelGrants` are the shape this takes.
