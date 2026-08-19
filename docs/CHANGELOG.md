# Repository changelog

[Türkçe](CHANGELOG.TR.md)

This file records codebase, architecture, tooling, documentation, and deployment
changes. Player-facing game content and release notes belong in
`changelog/changelog.html`.

## [Unreleased]

### v478 — statting that cannot silently break

- Gave `chss.smith` a vendor. He had none: he repaired and sharpened what the player
  already owned and sold nothing, while twelve of the game's seventeen shields had no
  source anywhere -- no vendor, no drop, no recipe. The four light ones plus a heater,
  a gauntlet, a headguard, `item.coal1` and `item.cq` are on his counter now, priced
  level with the general store rather than above it. `item.coal1` is worth calling out:
  it was the one item in the game with no source at all while its own description says
  it burns for a long time and the fireplace already accepted it as fuel.
- Vendor state is saved by key rather than positionally (`a10[obj]`) and the restore is
  guarded on `a10[obj] && a10[obj].stock`, so a new vendor cannot disturb an existing
  save, and `onDayPass` runs over `for (const vnd in vendor)` so it restocks with no
  registration step. Verified both before adding it.
- Left `dfl` off the smith deliberately. Four vendors set it and nothing in the game
  reads it; `repsc` is the only one of the pair with a reader. Copying a dead field to
  match a pattern is how dead fields spread.
- The browser suite now restocks every vendor and asserts each line prices to a finite
  positive number. The Vendor constructor already carries a comment about the child
  trader, whose shop had no inflation multiplier, so every price resolved to NaN -- and
  because NaN compares false the affordability check passed and paying turned the
  player's purse into NaN. The check covers all vendors rather than only the new one.
- Added `docs/REGIONS.md` and `docs/REGIONS.TR.md`: the design contract for the rural
  region and the mine, with the criteria that open each step, what the player is meant
  to take away, and what closes each arc. Linked from both proposal docs.

- Gave `creature.lrck` the eleven fields it was missing and put it in the game as a
  false wall in `chss.cata17`, the Stone Plate, gated on `sector.cata1.data.gets[3]` --
  the scout find that puts a chisel handle in the player's hands. `area.lrck1` (id 125)
  is new and is appended last, because `save()` writes area sizes in `for...in` order
  and `load()` reads them back positionally.
- Kept `creature.lrck.battle_ai` returning false. Its own description says its fighting
  prowess is close to zero and that it blocks paths by mimicking a wall, so not taking a
  turn is authored intent rather than an oversight; what was wrong was `hp_r = 9000` with
  `stat_p[0]` at 1.5, which in that corridor's band is thousands of rounds of no risk for
  no loot. It is a set piece now: 1400 health, a construct's growth, and `ctype = 2`.
- Reversed its `cls`. The authored [90, 120, 60] had a rock turning aside hammers better
  than spears; [10, 70, 90] means a maul gets through, an edge skates off and a point
  finds nothing to open. A player with the wrong weapon is slowed, not stopped, because
  the minimum-landed-damage floor guarantees every swing counts.
- Added `toolMarks` (id 26, clue) and `whoseHand` (id 27, question), both Chapter IV.
  They are deliberately not written on `threeAndAcross`: that is a hunter's route mark
  cut with a good blade, and these are one-handed chisel strokes in a space too tight to
  swing. Two signatures, two hands, and the browser probe asserts the texts do not
  collapse into one.
- Added a `__test-stone-plate.html` probe: the gate, the slab, the fight, the walk-away
  choice, the passage and both lore entries, plus assertions that the new area is last in
  the registry and that `area.clg` keeps its slot. That last one failed first time --
  `clg` is the seventh definition, not the sixth -- which is exactly what the assertion
  is for.

- Added `scripts/check-flags.js` to `npm run check`. It fails any `global.flags` entry
  that is read as a condition and written nowhere. The baseline is clean, so the check
  needs no allowances: it exists to stop the list growing again.
- Removed the `if (!global.flags.bsmntchck)` gate on the basement's "examine your
  surroundings" choice. Nothing in this repository's history has ever written that flag,
  so the branch was always taken -- which was lucky rather than correct. The only call to
  `giveAction(act.scout)` in the entire game sits inside it, so setting the flag on a
  first examine would have permanently stranded any player who took the storage chest
  and left: no search action, and with it no marketplace scout table and no catacomb
  finds. The two one-off choices inside the branch carry their own flags, which is where
  the once-only behaviour belongs. No behaviour changes; a trap is removed.
- `chss.bsmnthm1.data.gets` declares three slots to match its three scout entries. The
  third was writing `gets[2]` into an array declared with two. It worked -- a missing
  index reads as undefined, both `canScout` and `scoutGeneric` test against `!== true`,
  and this `data` is saved as a JSON object rather than a positional segment -- but
  `sector.vmain1` had the same defect one slot lower, so it is worth the declaration
  saying what the code does.
- Extracted `stripComments` from `scripts/check-refs.js` into `scripts/strip-comments.js`,
  shared with the new flag check so the two cannot drift on what counts as live code.
- Verified the third item in the plan's technical-fixes list: `sector.cata1`'s scout
  table is live with four entries and `onScout`, and what `docs/STORY.md` says about it
  is accurate. No change needed.

- Wired `area.clg`, the damp cellar, into the game as the near end of Chapter III's
  missing-chisels thread, reached from the marketplace once the boy's report has been
  read. `quest.chsls1` (id 10) and `chss.clgmn` (id 173) are new; the area itself is
  untouched apart from its population and a completion handler, because it was already
  finished content. No new area was defined, so the positional area-size slots in the
  save format are unchanged.
- Fixed `area.clg.pop`: neither entry declared `c`, so `z_bake` accumulated undefined
  and baked `popc` as `[[0, NaN], [NaN, 1]]`. Every comparison in `area_init` against
  NaN is false, so no branch could ever match -- nothing would spawn, `global.flags.btl`
  would never be set, and the descent would fall through in silence. The area has never
  been reachable, so this has never been visible, but it would have been the first thing
  a player met the moment it was.
- The descent's length is set when the quest is accepted rather than authored on the
  area, because area sizes restore positionally and every existing save already carries
  the authored 33 in that slot.
- Added `towardTheWell` (lore id 25, a Chapter III clue). It is what the cellar visit
  is for: the old man's list, the joiner's cellar and the cloudy well are four points,
  and the player is left to put them together.
- Added a `__test-cellar-story.html` probe and a browser check that plays the side
  story end to end -- the lore gate, the darkness that stands in for the stolen lamp,
  the descent, the wall, and the turn-in -- plus an assertion that no area anywhere
  bakes NaN into `popc`. Verified by reverting the population fix and confirming the
  probe names `noNaNWeights,fightStarts,rightCreature`, rather than trusting that the
  source looked right.

- Added `scripts/check-combat.js` to `npm run check`. It measures two budgets from
  the creatures the original game shipped -- mitigation per level and attack per
  level -- and fails any creature added since that goes past either with 15% headroom.
  It does not model the player's skills, equipment or titles, because no static check
  can honestly pin those down; anchoring on shipped, playable content is what makes a
  failure mean "this is mis-statted" rather than "the model is pessimistic". Both
  budgets currently come out on `wolf1` at level 7 in the western woods: 16.0 and 13.4.
- The budget measurement excludes `area.tst`, a developer bench rather than content,
  and any level below 4. The first attempt included both and produced an attack ceiling
  of 39.1 per level set by a level 1 skeleton, which flagged nothing at all.
- Added `scripts/check-refs.js` to `npm run check`. It resolves every registry
  reference passed to a granting call -- `giveItem`, `giveQuest`, `smove`, `area_init`
  and five others -- against the keys those registries define. A bad reference throws
  inside a dialogue click handler, so the only symptom is that the scene never
  advances and the choice can be clicked again; that is how a dojo reward shipped
  handing out the same shield indefinitely. The checker strips comments with a small
  state machine, because commented-out scenes are everywhere in these sources and
  their references are not live.
- Moved the bundle's source list to `scripts/sources.js` so `scripts/build.js` and the
  checks share one copy.
- Added a v478 save migration that tops an existing character up to the SPD and LUCK
  the new level milestones owe them. It is written as "top up to the total" rather
  than "add the total", so running it twice cannot double the grant and a character
  already ahead on gear is not dragged down. `migrateSave` now receives `you` itself
  rather than only the parsed globals and `you.mods`.
- `callback.onLevel` has its first subscriber since the callback registry was written.
  It also carries how many levels were gained, because a level 1 creature is generated
  through `lvlup` with `t === 0` and a subscriber that grants something has to tell
  that apart from a real level-up.
- Level milestones added to a skill are appended to their `mlstn` array rather than
  inserted in level order. `save()` writes the granted flags positionally, as
  `a6[obj].mst[m] = mlstn[m].g`, so an insert would shift every flag after it and
  re-fire milestones a player already holds.
- Population ceilings can now be getters. `mon_gen` reads `lvlmin` and `lvlmax` off the
  live population entry when it generates a creature and `z_bake` only precomputes the
  spawn weights, so a band can follow the player without touching either.
- `docs/AGENTS.md` and its Turkish twin gained the creature-statting rule, and lost a
  contradiction: they told the reader to translate `perk` as "yetenek" fifteen lines
  above telling them to translate it as "Avantaj" and never "Yetenek".
- Regression coverage added for the level milestone grants and their positional
  ordering, the weapon-mastery grant paths and talents, the shield mitigation term, the
  world-level bands and the fixed encounter that must not scale, the sell valuation and
  its cap below the buy side, and that no shield is left at `str = 0`. The
  save-format behaviour tests now lift `levelGrants` and `levelGrantTotal` out of
  `js/systems/simulation.js` so the migration is exercised against real numbers.
- `Vendor()` defaults its price multiplier. One vendor set none and there was no
  default, so every price in that shop resolved to `NaN`, the affordability check
  passed because `NaN` compares false, and spending it turned the player's purse into
  `NaN`.
- The save bar no longer shrinks the game to reserve room for itself, and the browser
  scenario that pinned that now asserts what matters -- the bar must not cover the
  game's bottom row -- with a pixel of tolerance, since the two are meant to meet and
  sub-pixel rounding through body zoom must not read as a collision.
- `docs/PROPOSALS.md` now carries every outstanding request from the repository owner,
  recorded before work starts, and the balance decision this work deliberately did not
  take: armour's class resistance is counted twice in the mitigation term with opposite
  signs, and correcting it alongside the shield half takes an unshielded player from
  36.9 damage taken to 9.9.
- The Pages deploy skips Markdown-only pushes. `scripts/build-site.js` copies
  `index.html`, three root assets, and the `changelog/`, `css/`, `icons/` and
  `locales/` directories -- no `.md` file ever reaches `dist/`, so a documentation
  push was rebuilding, checking and redeploying a byte-identical site. `paths-ignore`
  lists both `**.md` and `**.MD`, because path filters are case-sensitive and `docs/`
  still holds two files written with the uppercase extension. `workflow_dispatch` is
  untouched, so a deploy can still be forced by hand.
- Added `docs/refactorplan.md`, a measured refactoring review of the repository. Its
  first finding is that `scripts/check-combat.js` rewrites the damage formula rather
  than calling `dmg_calc`, so the check these instructions call critical validates a
  copy that can drift away from the game in silence.

- `tests/harness.js` loads the real bundle into a Node vm context and hands back its
  global scope, so a check can ask the game what it does instead of asking the source
  text what it looks like. It costs 57 ms, and the game does not start: bootstrap.js
  sees `document.readyState` as "loading", registers its load listener and stops
  there, so the registries are built while load(), the tick and the save restore are
  not. The one trap it documents is the one that cost the most to find -- passing
  Node's intrinsics (Math, Date, Number) into the context is not a convenience but a
  bug, because a vm realm owns its own, and a number created inside the bundle then
  fails `a[0].constructor === Number`. The Mersenne Twister in js/utils/random.js
  branches on exactly that and recurses into setSeed until the stack goes.
- `scripts/check-combat.js` no longer rewrites the damage formula. It had already
  drifted from the game: dmg_calc floors a landed blow at a share of the swing and
  lets weapon mastery pierce class resistance, and the copy knew about neither -- so
  the check the agent instructions call critical was validating a formula the game
  had stopped using, and staying green while it did, because both halves of its
  comparison shared the same stale arithmetic. The mitigation term is now read out of
  the real dmg_calc as the difference between a blow against the creature and the
  same blow against the same creature with its armour stripped. The two calls differ
  only in the armour, so the difference IS the subtracted term and no model of the
  player is needed: everything that is not the creature cancels. Calibration is
  unchanged and that is the proof -- the old check measured 16.0 mitigation per level
  at wolf1 level 7 with a budget of 18.4, and so does this one. The attack term moved
  from 13.4 to 14.7 because the old one omitted the shield contribution entirely.
- Checking that list against the real registry immediately found that five of the
  seventeen names in ORIGINAL match no creature at all -- rat1, rat2, bat1, zmb1,
  gho1 -- and a sixth, skl1, was the test bench's skeleton written wrongly. A Set
  entry that matches nothing exempts nothing, silently, so those names had been doing
  no work. skl1 is corrected; the rest are reported as a warning rather than guessed
  at, because which creature a stale name meant is a content decision. The check also
  covers 20 added creatures now rather than 15, the extra ones being what the regular
  expression could not see.
- Declared `espree` in devDependencies. Four test files require it and it was only
  ever present as a transitive dependency of eslint, so a version of eslint that
  dropped it, or an install through a stricter package manager, would have taken out
  a third of the suite and with it the deploy.
- The Pages workflow skips Markdown-only pushes and is bounded. `paths-ignore` lists
  both `**.md` and `**.MD` because path filters are case-sensitive; the build and
  deploy jobs carry `timeout-minutes` so a hung headless Chrome ends in minutes
  rather than burning a runner for six hours; and the checkout no longer persists
  credentials, since nothing here pushes back to the repository.
- Removed the four references to `docs/ROADMAP.md`, which no longer exists.
- Added `docs/refactorplan.md`, a measured refactoring review, and rewrote
  `docs/status.md` as a session handover that reads the two together.

- Combat moved out of the interface. js/systems/combat.js now holds allbuff, fght,
  attack, tattack, dmg_calc, the landed-blow floor, hit_calc and the two weapon-wear
  helpers -- 691 lines that used to sit in js/ui/interface.js between the inventory
  drawing and the recipe panel, which is why the agent instructions had to describe
  the damage formula as being somewhere inside an 8,000-line interface file. It is
  8,000 lines of interface no longer. dumb and mf stayed behind: both draw a floating
  number, so they are interface however close they sat to the arithmetic.
- addElement and empty are in js/utils/dom.js, deepCopy and copy in
  js/utils/object.js. They were at the bottom of js/systems/planner.js between the
  daily plans and the test maps, which is nowhere anyone would look for the helper
  the entire interface is built out of.
- Both moves are verified rather than trusted. tests/fingerprint.js reduces the
  bundle's behaviour to a text -- every global function name, every registry's keys,
  the numeric shape of every item, weapon, piece of equipment and creature, and the
  damage path across creatures, levels and weapon classes -- and the output before
  and after each move is identical, 1,440 lines of it. It is deliberately not a test:
  there is no expected output to store, because the figures should change whenever
  behaviour legitimately changes. It answers one question, by comparison.
- The combat move broke five assertions in check-game-regressions.js and not one of
  them was about anything a player could notice: they read the text of
  js/ui/interface.js and the text had moved. They are bound to the whole bundle now,
  through a new bundleSource, and so are the bans beside them. A ban is only a ban if
  it holds everywhere -- checked against one file it merely says the mistake is not in
  that file -- and a contract about behaviour is about the program rather than about
  which file currently holds the function. Later moves will not break these.
- The two locale files are requested together instead of one after the other. A
  Turkish player used to pay a full round trip for English before the request for
  Turkish was even made, and neither file depends on the other. Dropping the English
  fetch entirely is a separate change: it needs a per-locale completeness flag in the
  manifest, even though check-i18n already proves the parity that would justify it.

- One hundred and eighty-six food items stopped carrying their own copy of the eating
  handler. `item.brd.use = eatUse(2);` is the whole of it now, and js/data/items.js is
  5,437 lines rather than 7,639. Twelve lines copied into 186 places meant a change to
  how eating works had to be made 186 times, and missing one of them was a near
  certainty rather than a risk.
- The count is 186 and not the 221 the review predicted, because the shapes were
  inventoried with espree before anything was rewritten rather than counted by
  grepping for the satiation line. Thirty distinct shapes carry that line; two of them
  hold 119 and 67 items, and the remaining 35 items are spread across 28 shapes that
  each do something of their own. Those were left alone. The rewrite asserts both
  member counts before it touches anything, so a shape that has drifted since stops it
  instead of being rewritten blindly.
- The two big shapes differed only in whether `this.amount--` fell before or after the
  readout and the message, and that difference is invisible rather than merely
  probably-harmless: dom.d5_3_1.update() reads you.sat, you.satmax and
  you.efficiency() and never looks at the stack the food came from, and the message
  reads this.val. Both spellings are one function now.
- tests/fingerprint.js covers use handlers, which is what made the rewrite checkable
  instead of plausible. Every item's use is called against a fixed player and what it
  changed is recorded: the player's own numbers, the stack it consumed from, the stat
  counters it bumped, whether it refreshed the energy readout, and the text of the line
  it wrote to the log. 352 handlers, no failures, and the output before and after the
  rewrite differs by exactly one line -- the new eatUse appearing in the list of global
  functions. The log is emptied before each call, because it is capped at msgs_max and
  a full log makes a row count meaningless.

- The sixteen browser probes are files under tests/probes/ instead of template literals
  inside scripts/serve.js, which is 193 lines now rather than 1,961. The probes were 93%
  of that file: sixteen near-identical blocks, each reading index.html, building one
  template and injecting it. One generic route does that now, taking the name from the
  path and the injection point from the probe's own header.
- The point is not the line count. A template literal is invisible to node --check and
  to eslint, so a typo in a probe could only be found by running it -- and a probe only
  runs when the browser suite reaches it. As files they are linted and formatted with
  everything else, and a syntax error fails the check.
- Extracting them mechanically was safe because the shapes were inventoried first: not
  one of the sixteen templates interpolates, and every block had the same five
  statements. The exception is boot-screen, which injects before the loader tag rather
  than before </body> because it has to record what exists before any of the game's code
  runs. That is now a `// inject: before-loader` line in its header, which the route
  reads.
- The reasoning written above each probe moved with it. The extractor collected the
  comments inside each block but outside its template and put them at the top of the
  file, so nothing that explained why a probe measures what it measures was left behind.
- The probe name goes into a file path, so it is restricted to lowercase letters, digits
  and hyphens rather than resolved and then checked. A permissive rule there would have
  turned this route into a way to read any file on disk.
- /__test/corrupt-save and /__test/unreadable-save stayed in serve.js. Neither uses
  index.html -- each returns its own small document -- so neither fits the generic route.

- A Turkish player no longer downloads en.json. Every locale in locales/manifest.json
  carries a `complete` flag now, and the loader skips the fallback file entirely for a
  locale that has it -- 348 KB the player used to wait for and never read a single key
  from, because check-i18n.js has always required full parity.
- `complete` is a checked fact rather than a promise: check-i18n.js fails the build if a
  locale claiming it is missing even one key, and says what to do about it -- translate
  them, or drop the flag, which is what makes the loader fetch English again.
- That also settled a contradiction. The agent instructions say non-English locales may
  rely on the English fallback while their translations are incomplete, but check-i18n
  demanded full parity from every locale, so the allowance could not be used. The line
  is in the right place now: a key English does not have is always wrong -- nothing reads
  it, and it is a typo or a leftover -- while a key English has and a locale does not is
  wrong only if that locale claims to be complete.
- index.html preloads the bundle. The loader can only inject js/game.js after the locale
  files arrive, because content modules call i18n.t() while defining themselves, so the
  largest file the page loads was also the last one asked for. A preload downloads
  without executing, which leaves that order alone and overlaps the 1.2 MB transfer with
  the locale requests.
- build-site.js stamps the preload hint with the same ?v= as everything else, and that is
  not a detail: if the hint and the loader's own request are not the same URL the browser
  treats them as two resources and fetches the bundle twice, which is worse than not
  preloading at all.
- Both changes are covered by browser assertions on the requests the server actually
  saw, because in each case the thing to verify is a request that does not happen or one
  that happens only once -- neither is visible in the rendered page. Both assertions were
  confirmed to fail when the protection they describe is removed.

- The three surfaces every list in the game is built from are custom properties defined
  once in css/game.css: --list-well for a list's container, --list-row for a row inside
  it, and --list-row-denied for a row the player cannot afford. They were written out
  twenty times across two files, and in two spellings of the same colour --
  rgb(10,30,54) and rgb(10, 30, 54) -- which is what a repeated literal turns into given
  long enough. JavaScript sets them as style.backgroundColor = "var(--list-row)", which
  is valid in an inline style.
- Only those three. rgb(255,192,5), rgb(0,235,255) and rgb(44,255,44) are a scale chosen
  by an item's stype, and #e8421c is the weather readout's background; naming them
  without establishing what they mean risks a token whose name is wrong, and a wrongly
  named token is worse than a literal because it misleads the next reader and then gets
  used in the wrong place.
- Both halves of that are protected, because this change fails invisibly. A custom
  property that does not resolve makes the declaration invalid, so a row gets no
  background at all rather than the wrong one, and nothing throws -- it would read as a
  styling accident nobody introduced. check-game-regressions.js requires the three
  definitions and fails if any of the six literal spellings comes back, which is how a
  new panel copied from an old one would reintroduce them. tests/probes/list-surfaces.js
  applies each token the way the game applies it and reads it back through
  getComputedStyle. Both were confirmed to fail when a token name is misspelt.
- js/ui/interface.js is 6,075 lines, down from 8,689. Hover descriptions are in
  js/ui/tooltip.js, the message log in js/ui/message-log.js, the shop, smith, sell,
  furniture and trunk rows in js/ui/panels.js, and combat in js/systems/combat.js.
- tooltip.js is concatenated before interface.js rather than after it, unlike the others,
  and that is the one real ordering rule here: a function declaration hoists across the
  whole concatenated scope but a const does not. addDesc is called twenty-six times while
  the interface is built, and the file owns two const label tables, so a const read by an
  earlier file's definition-time code would be a ReferenceError.
- The preferences block stayed where it is for the same reason, stated rather than
  discovered later: autosaveSeconds, applyBackground and restoreBackgroundPreference are
  not adjacent, DOM construction runs between them, restoreBackgroundPreference is called
  at definition time, and the block owns const themeStorageKey and const
  autosaveStorageKey. Separating it means splitting the DOM construction too.

- The requests the repository owner queued are in docs/PROPOSALS.md and its Turkish
  counterpart, written down before any of them is started, which is the rule the owner
  set: everything goes into PROPOSALS first, comes out when it ships, and what it did goes
  to the changelog and to STORY.md if it touched the story. They are recorded as requests
  rather than plans until each is filled in against the code, and the file says so.
- One of them is a question rather than a feature -- whether the resistance fields are read
  at all during combat -- and it is ordered first because two other entries depend on its
  answer. Work resting on an unanswered question gets done twice.
- One is recorded as closed rather than pending: the effect strip overlapping the LUCK
  readout in the player panel is accepted as it is.
- docs/status.md turns the owner's pasted list into a queue with a status per item and an
  ordering rule that is dependency and risk rather than the order they were written: the
  question first, then the fixes to content that already exists, then additions that do not
  touch the save format, and last the two that need a v479 migration -- which are worth
  combining, since one migration is cheaper than two.
- The line references in that file were re-measured after this session's moves, because
  four of them pointed into js/ui/interface.js at code that is now in js/systems/combat.js.
  Two entries changed more than their numbers. The armour double-count is two branches with
  two appearances each, at combat.js:438/444 and 490/496, not the four unrelated lines
  recorded before. And the skill-type mistake is not what it was written as: skl.hvt.type is
  set twice, correctly at skills.js:2050 and again inside the skl.hst block at 2277, so what
  is actually wrong is that skl.hst.type is never set at all. Each entry now carries a grep
  pattern as well as a line, because a pattern survives a move and a number does not.
- README.md and README.TR.md describe the source layout as it is now, including why
  scripts/sources.js order is load order and which file has to come first because of it.

- The dark redesign was audited for the surfaces it skipped, which the owner asked for
  directly. Five lenses over css/game.css and js/ui/ -- palette, hand-built overlays,
  keyboard reach, hover and focus states, structure -- with every candidate finding re-read
  by a separate pass whose job was to refute it. Nineteen survived, and they are entry 18 in
  docs/PROPOSALS.md, ordered by how visible each one is to a player rather than by which
  lens found it, because one edit often fixes several.
- The largest is the tooltip frame: a 5px lightgrey border with a black outline outside it,
  around an interior that had already been darkened. It is the most frequently shown surface
  in the game. After it: five navigation buttons with an orchid border and no keyboard
  reach, two more hand-built windows that should be dialogs, the inventory row chips as an
  un-migrated cluster rather than one skipped chip, and an `input:focus { outline: none }`
  written before :focus-visible existed that the redesign has been climbing over one element
  at a time.
- Two findings are worth having for reasons other than colour. The title-picker window has
  no way to cancel -- the only thing that closes it also writes you.title -- and
  bootstrap.js:1503 clears its open flag on load without removing the node, leaving a window
  that can neither be closed nor reopened. And #rptbn:hover is dead: the control writes its
  own background inline on creation and on every click, so the rule never paints, which
  means the control has no hover feedback at all rather than the wrong one.
- The armour double-count figures in PROPOSALS.md were wrong, and being wrong changed the
  decision they were recorded to inform. They said correcting the sign makes an unshielded
  player roughly four times more survivable: 36.9 damage taken becoming 9.9, and 1.0 with a
  shield. Measured through the real dmg_calc with tests/harness.js, in the scenario the note
  itself specifies, it is 37.0 becoming 0.0 -- and 27.0 becoming 0.0 with the Hoplite. With
  the sign corrected the mitigation exceeds the whole attack and the result floors, so the
  creature stops being able to damage the player at all; minimumLandedDamage is deliberately
  only applied to the player's outgoing damage, so nothing floors a blow on the way in. It
  is not a rebalance to weigh but a change that cannot be made alone, and the size of the
  compensating cut to `def.str * eff` has to come from this measurement rather than a guess.
- The shield premise was out of date too. "Eleven of the fourteen shields shipped with
  str 0" is no longer true: there are seventeen and not one has str 0, running from 4 to 23
  with aff[0] and cls filled in. What the measurement did find is that every one of them has
  int 0, so in the magic branch of dmg_calc no shield in the game defends against a spell.

- The seven most visible findings from the audit are applied. #dscr, the hover panel, takes
  .game-modal's frame order -- a 3px #050912 border with a 2px #6676bd outline outside it --
  with rgb(188 254 254) text, the palette's shadow, and #526988 for its inner divider. It was
  the surface the game shows most often and the widest pale band left on screen. Narrowing
  the border from 5px to 3px needed no other change, because positionDescription measures
  offsetWidth.
- The status-effect icons' base border went from black, which is invisible on a dark panel,
  to #526988, and their hover from lime to #71e6b1. Each icon's per-effect inline colour is
  data encoding and is untouched.
- The language picker's dropped list uses var(--list-well) and rgb(188 254 254) rather than
  `background: white; color: black`. Recorded with it: author colours on <option> are
  honoured by Chromium and Firefox on Windows and ignored by macOS native popup menus, so the
  fix is right where it applies but cannot be enforced everywhere.
- The Export and Import row halves carry an .opt_transfer class. Their inline
  `1px lightgrey solid` borders were left over from the windows replaced in v478.29, and they
  were also overwriting .opt_va's column divider; the class restores both the palette and the
  divider.
- #rptbn:hover gives a border and an outline instead of a background. The control writes its
  own background inline on creation and on every click, so the old rule never painted: the
  player never saw the light grey, but the button had no hover feedback either.
- .i18n-load-error takes the dark error palette that #save-unreadable, directly beside it in
  the stylesheet, already used.
- None of the seven is merely fixed; each is banned. check-game-regressions.js fails if any
  of those rules returns, because the way they would come back is a new panel copied from an
  old one -- which is how they spread in the first place. Confirmed to fail when one is put
  back.

- The read-books list is a dialog on the shared shell rather than a div pinned at
  left 445px / top 370px behind a lime hairline. It gains a title, a close button, Escape,
  focus handling and a body that scrolls; the rarity colours in its rows are semantic and
  moved across unchanged. The behaviour it gains matters more than the look: it used to close
  on ANY click inside it, so reading an entry and dismissing the list were the same gesture.
- Its teardown on load is now `if (dom.bkssttbd?.open) dom.bkssttbd.close()`. It used to
  clear the flag and remove the node from document.body by hand, which is a way to leave a
  window that neither closes nor reopens -- the dialog owns its own removal, so closing it is
  the whole teardown.
- The two bars framing the inventory panel and the divider between the buttons in the lower
  one were plain grey while every other line in that panel is #3848c0 / #44c / #249. They
  carry no state -- nograd() only changes a background and never touches a border. `.bts_b` is
  shared with the skills window, so the change shows in both, which is the intent.
- Both are pinned. The read-books dialog is pinned statically rather than with a probe,
  because the list only exists once a book has been read and the probe could not arrange that
  reliably; the shell's own behaviour is already covered by
  tests/probes/save-transfer-modal.js. Saying which of the two it is matters more than the
  count of tests.

- The thirteen requests the owner queued were researched against the code before any of them
  became a plan in PROPOSALS -- measured through the harness rather than recalled. The research
  changed several entries and closed two outright.
- **Two were already shipped.** The burn debuff on fire damage went in with c19c781; the
  fireplace's healing rate, energy gain and the Rested buff after sleeping beside it went in
  with ea8fa22 and 00295f7, both dated 2026-08-18. Two thirds of the furniture request is in
  the same commit. Writing those into PROPOSALS as plans without measuring would have meant
  building three things that already exist.
- **Four premises were contradicted by measurement.** "A perk for every skill up to level 15":
  level 15 is 1,151,201 cumulative experience against grants of 0.2 to 0.6 per action -- deep
  endgame rather than a modest floor, and the existing design already knows it, with 69 of 143
  milestone entries sitting at levels 1-5. "Unlimited clearing after N clears": 21 of the 31
  areas already re-arm themselves on clear, and the unlock pattern ships twice elsewhere.
  "Scouting is used nowhere else": it is wired into 12 places. "Let us give weapon-mastery
  titles": 22 exist and 13 already carry a gain-rate bonus.
- **The real work is not where the requests point, but in finished content that was never
  connected.** 26 titles are written and translated in both locales and have no grant path. 19
  recipes are finished, translated and unlearnable. hptn2 is balanced and has no repeatable
  source. Seven of the seventeen shields have no source at all, and every one of them has
  int 0, so no shield defends against a spell in the magic branch of dmg_calc. Zero of the 62
  recipes touch item.stdst. The project's own rule already says to do this first.
- **The resistance question is answered, and the answer is no.** Eleven of the 12 res fields
  are never read by dmg_calc -- they gate whether an effect is applied, not how much damage
  gets through. And two of the three things the owner named are not res fields at all: undead
  resistance is you.maff / you.cmaff, and dark defence is aff[6]. Only pain resistance
  (res.ph) is a res field, and it is the only one with a live reader.
- **The constraint list in CLAUDE.md was incomplete.** The saved fields a milestone may write
  are not just stra/agla/inta/spda/hpa/sata; exp_t, luck and the whole mods object are saved
  too. Measured writes across all 146 entries: exp_t 43, hpa 38, stra 32, agla 25, sata 23,
  mods.sbonus 7, inta 6, mods.cpwr 3, luck 2, spda 1.

- The repository is `Kuroiteiken/Echoes-Beneath`, renamed from `23html.github.io`, so the
  maintained deployment is now `https://kuroiteiken.github.io/Echoes-Beneath/`. Updated in
  docs/AGENTS.md, its Turkish counterpart, and both READMEs. The upstream URL
  `https://23html.github.io/` is a different repository and is unchanged, as are the fork
  attributions further down this file -- those record where a fix was found, not a dependency.
- Nothing in the code needed changing, and that is worth recording as the reason rather than
  the outcome. There is not one root-relative path in the project: the changelog link is built
  with `new URL("changelog/changelog.html", document.baseURI)`, the loader derives every URL
  from its own script src, and changelog.html links with `href="../"`. The rule in
  docs/AGENTS.md that forbids hard-coding `/changelog/...` is what made a rename a
  documentation edit. Saves survive it too: localStorage is keyed by origin, and the origin
  did not change -- only the path below it.

- Creature() gives each creature its own equipment. It was `this.eqp = [eqp.dummy, eqp.dummy]`
  -- a reference to one shared object -- so every `creature.X.eqp[0].aff = [...]` in
  js/data/creatures.js rewrote that object rather than equipping that creature. All 39
  creatures ended up sharing whichever weapon was declared last: measured, `creature.bat` and
  `creature.cbat` were literally the same object, both carrying `aff [14,26,4,-14,34,-48,66]`
  and `cls [9,10,9]`.
- The same bug reached the player, which is the half that mattered more. The player's empty
  equipment slots are eqp.dummy too, and dmg_calc reads the struck slot's aff and cls into the
  mitigation -- so an empty slot was contributing a creature weapon's affinities to the
  player's own defence. Measured against an attack term of 100: a struck empty slot absorbed
  9 of 50 damage. A weapon must raise attack and never affect damage taken, and an empty slot
  must do nothing at all.
- The combat budget held, which is the reason this could ship as a fix rather than a rebalance.
  scripts/check-combat.js measures both terms through the real dmg_calc: mitigation per level
  is unchanged at 16.0, and attack per level moved from 14.7 to 14.2 with the steepest creature
  changing from wolf1 at level 7 to wolfa1 at level 12 -- creatures now use their own weapons
  rather than the strongest one any of them declared. All 20 added creatures stay inside the
  budget.
- Pinned in check-game-regressions.js, on the source with comments stripped -- the comment
  explaining the fix quotes the broken line, which is the second time that has caught me out
  in this session and the reason scripts/strip-comments.js exists.

- tests/check-shared-state.js closes the class of bug the shared eqp.dummy belonged to, rather
  than only the one instance of it. It walks 21 registries and compares mutable fields by
  identity: two entries holding the same array or object is the fault, whatever the source
  looks like. Scanned after the Creature() fix, exactly one sharing remains and it is
  deliberate -- the player's ten empty equipment slots all hold eqp.dummy, one object standing
  for "nothing equipped". That is named in the check as an allowed case rather than filtered
  away silently, and it is only safe while the dummy stays inert, so the second half of the
  check requires eqp.dummy to have str 0, int 0, and zeroed aff and cls.
- Worth stating what the scan did NOT find, because the concern was that this was widespread:
  after Creature(), no other registry entry shares a mutable object with another. The
  constructors for items, equipment, skills, effects and the rest all build their own arrays.
  The bug was one line, and the check is there because one line is all it takes.
- `npm run check` is scripts/check.js rather than seventeen commands joined by && in
  package.json. The line was 492 characters, which cost more than tidiness: adding a step meant
  editing a string, a failure said nothing about which of the seventeen it was, and nothing
  reported where the time went. Each step now has a name and a one-line reason, the runner names
  the failing step and prints the command to re-run just it, and the summary reports the three
  slowest. Seventeen steps, 15.3 seconds, of which Prettier is 8.1.
- The order is deliberate and written down in the file: the bundle has to parse before anything
  loads it, then the checks that read the game cheapest-first so a broken registry is reported
  before a slow step starts, then the behaviour tests, and lint and formatting last -- a real
  defect should never be reported after a missing semicolon. `npm run check -- --only=combat`
  runs the steps whose name matches, which is what you want while iterating on one.
- The four `test:*` scripts the old chain called are gone from package.json. They existed to be
  chained; the runner calls `node --test` directly, and nothing in the docs or the workflow
  referenced them.

- actions/setup-node moved from v6 to v7 in the Pages workflow. There was no reason for it to
  be a version behind: checkout, configure-pages, upload-pages-artifact and deploy-pages were
  all already on their latest major, and setup-node had simply been left. Checked before
  changing rather than assumed -- the real tag list from `git ls-remote` confirms v7 is current,
  and the v7 README's only migration note is an internal move to ESM, with `node-version: 24`
  and `cache: npm` behaving exactly as before.

- The save bar links to the repository, beside the version number that opens the changelog. It
  is an <a> with target="_blank" and rel="noopener noreferrer" -- the second half matters because
  this link leaves the site, and the referrer would otherwise hand the deployment path of the
  page the player is on to a third party. Opening in a new tab is not cosmetic either: following
  it in place would abandon an unsaved run.
- The URL is written into the bundle because the page cannot derive it -- document.baseURI gives
  the Pages host, not the GitHub one -- so package.json gained a repository field and
  check-game-regressions.js requires the two to agree. That is the protection the deployment URL
  did not have when the repository was renamed: four documents had to be found and edited by
  hand, and nothing would have failed if one had been missed.
- Both links now share an .sl_link class for the underline rather than the version link carrying
  it as an inline style, which is what happens to a one-off when it stops being one.
- Covered from both sides. The static check pins the URL against package.json and requires the
  rel and target; tests/probes/save-bar-links.js checks the link is inside the bar, visible with
  it, focusable, underlined, and labelled in the player's language rather than showing a raw
  translation key. Both halves confirmed to fail when broken.

### v477 — the tick, the journal, and the catacombs

- Moved action progress onto `ontick()`. Running and scouting advanced on timers of
  their own, which a browser throttles to about once a minute in a background tab, so
  they quietly stopped making progress while the rest of the world caught up. An action
  must not run a timer of its own; `tests/actions.test.js` asserts that.
- Rewrote the tick as a catch-up loop with a backlog ceiling of eight hours and a
  12 ms budget per frame, so returning to a background tab replays the gap as fast as
  the machine allows rather than a minute at a time. If the player died while away, the
  remainder is discarded rather than fought from a corpse.
- Derived the running energy cost from the action instead of accumulating it onto
  `mods.sdrate`. Charging on start and refunding on stop left a residue whenever a
  title lowered `mods.runerg` mid-run, and `save()` persisted it. A v477 migration
  clears the stored value, which is 0 by construction now.
- Added `js/data/lore.js` to the bundle, with `global.lore` saved in the `a1` globals
  object. `learnLore()` is idempotent and silent until the journal is open.
- Added `windowPanelHeight(share)`. A percentage height inside a container that
  declares none behaves as `auto`, which is why the shop's stock list grew with its
  stock and its footer collapsed to nothing. Taking the share from the window gives the
  column something definite to divide.
- Added a seen-version key, `proto23.seenversion`, kept separately from the save so a
  returning player is told what changed even if they never press Save, and a first-time
  player is not.
- Six creature stubs statted and typed as Undead, five areas appended to
  `js/world/areas.js` for the catacombs, and `sector.cata1`'s scout table filled in.
  Areas are appended because their sizes are restored positionally.
- Turkish: seven pairs of distinct things that shared one name, and eleven machine
  mistranslations of catacomb room titles that had never been reachable and so had
  never been read.

### v476 — stability and follow-through

- Save mastery levels. They were never written to the save, so every level the
  player bought was lost on reload. Only the level is stored: the stat bonuses
  `onlevel` applies are already part of the saved additive stats, so replaying
  them would double them. Added to the `a1` globals object, which is JSON and
  therefore safe to extend without disturbing segment order.
- Completed the mastery tree. Observation and Reflexes were spendable but had no
  description and no `onlevel`, so they consumed levels and granted nothing.
  Both now describe themselves and grant stats, and each locked node explains
  its requirement instead of showing `????????`.
- Revealed `hstr1`, a hidden single-level branch that nothing ever unhid, so the
  `linkfrom` rule that unlocks the other branches could never reach it. It is
  now named Second Wind and appears once Physical Training and Athletics are
  both fully mastered, rechecked after a save is restored.
- Granted ten titles that shipped with a name, an empty description, and no
  grant path, even though the game was already counting exactly what they
  describe. `statMilestones` maps completed jobs to the three job titles, items
  collected to the four collecting titles, and damage survived to the three
  toughness titles, and gives all ten a description.
- Added `tests/callbacks.test.js`, eight behaviour tests over the shared
  dispatcher: hook identity, argument pass-through, detaching by id rather than
  position, detaching every hook sharing an id, detaching an absent id, hook
  independence, and that a hook detaching itself mid-fire does not skip the rest
  — which is what the quest hooks actually do.
- Validate the save's shape before restoring any of it. The format is positional
  — pipe-separated segments with a `savevalid` sentinel at index 18 — so a
  shifted or truncated save used to restore as the wrong data, or throw partway
  through and leave the game half-loaded. `describeSaveProblems` now checks the
  segment count, the sentinel, and that segments 0–17 parse as JSON; a failure
  backs the original bytes up and reports them without applying anything. The
  segment added later at index 19 stays optional.
- Added a version-keyed migration table, `saveMigrations`, applied to the parsed
  globals when a save predates a change. It is empty today; the point is that
  the next release that changes a field's meaning has somewhere to declare it
  instead of guessing at load time.
- Added `tests/save-format.test.js`, the first behaviour test in the suite. It
  lifts the save-format helpers out of the bundle and runs them against real
  save strings, asserting what they do rather than how the source reads. Nine
  cases cover the well-formed save, the optional trailing segment, a missing
  sentinel, truncation, single and multiple bad segments, and that migrations
  run only when newer than the save and in order. Wired into `npm run check`.
- The malformed-save browser scenario now asserts the pre-restore rejection
  rather than the startup error it used to reach by throwing.

- Gave the bestiary something to read. Every entry now shows the creature's own
  localized description on hover; the panel previously listed only a name, a
  rank, and a kill count, while the unlocking item promises an encyclopedia.
- Assigned ranks to the 16 creatures still on the constructor default of `0`,
  which the bestiary renders as `???`. They are graded against the existing
  scale, where slimes sit at 1–4 and the dojo golems at 10–11. This was almost
  half the roster, and all of it is the catacomb undead.
- Lowered the message log ceiling from 120 to 50. A longer log cost more in
  storage and DOM work than it returned; the default stays at 36.

### Added

- Added `showConfirmModal`, a shared confirmation dialog built on the native
  `<dialog>` element and the existing `game-modal` styling, with Escape and
  backdrop dismissal, focus restoration, and removal from the DOM on close.
- Added the `onLevel`, `onEnterArea`, `onCraft`, and `onQuestComplete` hooks to
  the existing `callbackManager` and gave it a variadic `fire`, so game systems
  have subscription points without introducing a second dispatch mechanism.
- Added the writing game version to the save payload and read it back into
  `global.save_ver` on load, so future changes can migrate saves deliberately. A
  save written by a newer build is now reported instead of silently
  reinterpreted.
- Added a page description, theme colour, and Open Graph tags to `index.html` so
  a shared link renders as more than a bare title.
- Added `docs/STORY.md` and `docs/STORY.TR.md` recording the quest chain, where
  the story stops, and the finished content that cannot currently be reached.
- Added three favicon proposals under `docs/favicon/`, drawn from the palette
  already used by `css/game.css`.
- Added browser regression coverage for message-log control bounds, hidden empty
  state indicators, theme scale preservation, localized missed-attack messages,
  and the styled save-deletion modal, including cancel, Escape, backdrop, focus,
  viewport, localization, and locale-preference preservation checks.
- Added source and browser regression coverage for separated background preset
  controls and localized meal, reading-progress, and basement text.
- Added locale validation for contextual Turkish weekday abbreviations and
  browser coverage for language-independent Sunday gameplay.
- Added Turkish browser layout coverage that rejects overlapping or overflowing
  bottom save-bar controls.
- Added browser regression coverage for pointer-following hover descriptions at
  normal and viewport-edge positions.
- Added a source regression check that rejects direct static equipment
  descriptions outside locale JSON.
- Added a browser layout regression scenario that reveals both combat panels and
  verifies their rendered rectangles do not overlap.
- Added a regression check that locks the Moon Bloom area-size update to the
  corrected subtraction behavior.
- Added structural regression validation for the responsive HTML changelog and
  its project-path-safe navigation.
- Added delayed-asset, cached-profile reload, malformed-save recovery, version
  consistency, and rendered-version regression coverage.
- Added automated agreement checks between the integer game version and newest
  HTML changelog release range.
- Added reviewed Turkish terminology expectations that protect mastery names,
  scene-specific actions, ambiguous content names, and other high-risk
  contextual translations from regression.
- Added deployment-time content hashes for CSS, JavaScript, and locale assets.
- Added direct locale selection through the optional `lang` query parameter and
  browser coverage for a complete Turkish startup.
- Added repository-wide Prettier checking, including the game HTML changelog.
- Added a complete Turkish locale containing the full interface, game content,
  descriptions, dialogue, and runtime message schema.
- Added locale-schema and formatting-token validation for every registered
  non-English language.
- Added JSON-based internationalization with `locales/en.json`, locale discovery,
  English fallback, and a persistent language selector under Settings.
- Added locale validation and a local HTTP server for testing JSON-loaded builds.
- Added `AGENTS.md` as the single canonical project reference for all agents.
- Added Turkish translations for the README, agent instructions, and repository
  changelog as `.TR.md` files.
- Added Prettier, Stylelint, and ESLint for source formatting and validation.
- Added an automated GitHub Pages build, validation, and deployment workflow.
- Added a build step that prepares deployable static files under `dist/`.

### Changed

- Separated the four background preset controls into bounded grid cells so their
  translated labels no longer touch.
- Replaced the browser-native save deletion prompt with an accessible,
  keyboard-aware confirmation modal styled to match the game interface.
- Moved free-meal sounds and reactions, book reading progress and duration text,
  and basement actions from `locations.js` into synchronized locale values.
- Moved 56 static accessory descriptions and 52 formatted bonus details from
  JavaScript into synchronized English and Turkish locale values.
- Moved the save-bar collapse control immediately after Save and Load while
  retaining autosave, version, and deletion in the trailing action group.
- Replaced hardcoded English missed-attack log concatenation with an interpolated
  locale message.
- Replaced translated weekday-string comparisons with a locale-independent day
  index helper for weekly game events.
- Required language-aware agent review for abbreviations and other short or
  polysemous machine-assisted translations.
- Audited 2,177 Turkish content, runtime, and location values against their
  English source and game-code usage, correcting 255 high-confidence literal,
  inverted, polysemous, terminology, and narrator-voice errors.
- Required dialogue and action reviews to include the surrounding scene,
  adjacent messages, and resulting game behavior instead of isolated dictionary
  meaning.
- Changed the repository workflow to require owner approval before every commit
  or push, allowing related work to accumulate between milestones.
- Rebuilt the bottom save bar around an explicit flexible control group instead
  of fixed offsets that collide with translated labels.
- Updated the release policy to group small related fixes and UI refinements into
  the current changelog release instead of incrementing every minor change.
- Incremented the game to v474 for hover-description positioning and equipment
  localization fixes.
- Moved 83 remaining static weapon, armor, and shield descriptions, including
  eight formatted bonus labels, from JavaScript into synchronized English and
  Turkish locale keys.
- Incremented the game to v473 for the combat-panel positioning fix.
- Replaced duplicate combat-panel IDs with explicit player/enemy identities and a
  shared styling class.
- Incremented the game to v472 for the Moon Bloom bug fix.
- Redesigned `changelog/changelog.html` as a responsive, accessible release-card
  timeline with clearer version, date, warning, and navigation hierarchy.
- Incremented the game to v471 and documented when fixes, features, and additions
  require a version increment.
- Contextually reviewed and corrected 123 machine-translated Turkish entries,
  including weapon masteries, ambiguous item names, titles, and statistics labels.
- Expanded the required workflow so behavior changes cannot deploy without
  relevant regression coverage.
- Registered Turkish in the Settings language selector and documented periodic
  changelog-first commit and push requirements.
- Made the fixed-layout interface scale down automatically to fit smaller browser
  viewports.
- Documented the maintained and upstream GitHub Pages URLs, portable internal-link
  requirements, viewport expectations, changelog policy, and response-language
  preference.
- Moved shared interface labels, 22 reusable game-text collections, 1,242 content
  names/descriptions, and 726 reusable runtime messages out of JavaScript and into
  the English locale file.
- Split the monolithic `index.html` into CSS, functional JavaScript sources, and
  a small HTML entry point.
- Grouped JavaScript sources under `core`, `data`, `systems`, `ui`, `utils`, and
  `world` responsibilities.
- Formatted legacy CSS and fixed invalid measurements, typos, and non-standard
  declarations.
- Updated JavaScript and CSS with behavior-preserving modern syntax.

### Fixed

- Fixed the agility multiplier being serialized from a misspelled property, which
  silently reset it to `1` on every save and load. Reported by the
  `lgxnders/proto-homage` fork.
- Fixed area size restoration skipping the counter for an area of size `0`, which
  shifted every following area onto the wrong size. Reported by the
  `MercuriusXeno/23html.github.io` fork.
- Inverted and clamped the death satiation penalty so a higher Death skill
  preserves more satiation. The previous formula reached total loss at Death
  skill level 10 and produced negative satiation beyond it. Direction taken from
  the `tioluko/23html.github.io` fork, with the clamp added here because the
  fork's formula refunds satiation past skill level 12.
- Resynchronized the pause-next-battle label from the restored flag when a save
  is loaded. Reported by the `MercuriusXeno/23html.github.io` fork.
- Added defaults for base statistics, satiation, and health during load so a
  damaged save cannot restore undefined values.
- Fixed callback detachment passing the hook object to `splice` where an index
  belongs, which removed the first hook instead of the matching one. Corrected in
  both `detachCallback` and the quest hook cleanup performed during load.
- Pointed save import at the live `v0.3` storage key instead of the unused
  `v0.2a` key, so an imported save survives a reload.
- Preserved an unreadable save under a backup key and reported it to the player
  instead of silently starting a new game over it.
- Finished the localization sweep. Quest objectives and locations, six furniture
  descriptions with their bonus lines, four title talents, three action
  descriptions, the mastery panel, and the last stray area names now read from
  the locale files. No player-facing English literal remains in live source: the
  only English left is console output and `js/i18n-loader.js`, which by
  definition runs before the locales exist.
- Corrected eight Turkish choice labels written as verbal nouns, which read as
  the negative imperative. `"Satın alma"` on the shop action means both
  "purchasing" and "do not buy"; the same shape appeared on the reward claim,
  the message board, and five other clickable choices. Five of them were also in
  the formal plural while the rest of the game uses the singular.
- Extracted `masteryDescription` and `masteryStatLine`, since the strength and
  agility masteries duplicated the same markup. A mastery now declares the stats
  it grants and the line is assembled from the shared HUD abbreviations.
- Implemented `mastery.agl1.onlevel`, which did not exist, so levelling the
  agility mastery granted nothing. Its description also listed strength's
  bonuses and read strength's level. It now grants AGL and SAT and describes
  itself.
- Gave the nervous man at the market stalls something to do. The scene had one
  line and one exit; pressing him now trains Patience and backing off grants
  karma once. He remains a hook for later story work rather than a quest giver.
- Fixed the nervous man being called "Sinirli Adam" (irritable) in his own
  dialogue while the choice that opens the scene calls him "Gergin Adam".
- Derived game ticks from elapsed wall-clock time instead of counting callbacks.
  Browsers throttle background timers, and after a few minutes hidden drop them
  to roughly once a minute, so the world genuinely stopped rather than merely
  rendering less often. Missed ticks are replayed on return, capped per frame
  and in total so a long absence cannot lock the game up. Book reading advances
  the same way.
- Fixed `area.trnf` never receiving an identifier: the assignment named
  `area.trn`, overwriting the training area's own id and leaving this one on the
  constructor default.
- Removed `area.clg.onEnd`, which moved the player to two scenes that do not
  exist and would have thrown as soon as the area became reachable. The area is
  kept as unfinished content; see `docs/STORY.md`.
- Granted `ttl.wsl` when the wolf-hunt quest completes. The title existed but
  had no grant path, on the one quest that is about hunting a wolf pack.
- Fixed the completed-jobs counter incrementing a non-existent
  `global.flags.jcom` alongside the real `global.stat.jcom`, producing `NaN`.
- Fixed guard duty calling `clearInterval(this)` inside an arrow function, where
  `this` is not the timer handle, so the shift timer kept running afterwards.
- Gave the guard post an exit. It had no outgoing choice at all, so the player
  was held there until 8PM.
- Made autosave configurable and moved it into a `proto23.autosave` preference.
  The interval was a `30000` literal duplicated between the toggle and the load
  path, so nothing could change it; the toggle also created a second interval
  without clearing the first, and the load path only ever ticked the checkbox
  on. There is now one `restartAutosave` helper, a Settings row for the
  interval, and a default of 15 seconds.
- Reserved room below the inventory list for the sort bar positioned over it, so
  the last rows of a long inventory are no longer hidden underneath it.
- Rebuilt the durability readout as a label, a gauge, and a number placed beside
  each other. The number was rendered inside the coloured fill bar, where it was
  unreadable against the yellow and green levels and drifted as the bar
  shortened. The label moved from the machine-extracted `runtime.*` abbreviation
  "DP" to a translated `ui.itemDescription.durability`.
- Renamed the student skill books after the masteries they teach, so an item and
  its skill panel entry use the same words.
- Corrected the Turkish for "Shady Kid", which used the shadow sense of the word
  rather than the suspicious one. "The Shaded Path" keeps the shadow sense,
  which is correct there.
- Gave the message log a history that survives a reload. The log was rendered
  straight into the DOM with no backing store and was emptied on every load, so
  nothing outlived a refresh. Rendered rows are now serialized under a
  `proto23.messagelog` key, restored at the end of `load()`, and cleared by the
  log's own clear control. The existing message log limit governs both how many
  rows stay on screen and how many are kept, and its ceiling rose from 100 to 120. Restored rows are plain markup, so hover descriptions attached to a live
  message are not carried over.
- Silenced the build scripts under the dev server's watch loop, which reran them
  on every save. Both accept `--quiet`, and `scripts/dev.js` passes it.
- Renamed the Head Hunter to "Kelle Avcısı" in Turkish, with the possessive
  suffixes the title needs in context.
- Moved the background preference into its own `proto23.theme` storage key and
  routed every preset and slider through a shared `setBackground` helper. The
  preference previously lived only in the save payload, so it was remembered
  only if the player saved after changing it, and the numeric readouts were
  never resynchronized on load. A stored preference now outranks the value the
  save carries.
- Closed the changelog tab when returning to the game instead of navigating,
  which used to open a second copy of the game whose autosave competed with the
  first. A changelog opened directly by the player keeps the plain link.
- Gave the settings rows vertical padding and centred their controls.
- Synchronized `tests/translation-expectations.tr.json` with the reviewed
  capitalization of the HUD labels.
- Added `px` units to 104 style assignments that passed bare numbers. A unitless
  CSS length is invalid and is discarded silently, so each of these declarations
  had no effect. This single class of defect caused the invisible destroy
  confirmation, the shop quantity buttons landing on top of the item name, and
  the unreadable durability readout. Five remaining bare assignments are
  legitimate: `skl.sp` already holds `".66em"`, `chs()`'s `size` and `slimsize`
  parameters are never passed by any caller, and one is inside a comment.
- Replaced the duplicated tooltip placement in `js/ui/map-and-mastery.js` with a
  call to `positionDescription`. The copy assigned unitless values and therefore
  never moved the tooltip at all.
- Moved every remaining hardcoded string in `js/data/skills.js` into the locale
  files: 134 perk labels, 36 descriptions, and 10 mastery names, adding 216 keys
  per locale. Milestone labels are keyed as `content.skl.<id>.mlstn.lv<N>`.
- Localized the stat abbreviations in the top bar, which were English literals
  in the source while the perk text used Turkish ones.
- Added a Luck readout beside the critical chance line. Luck is raised by titles
  and skill milestones and feeds the critical and drop rolls, but had no display
  anywhere in the interface.
- Fixed the loading screen never clearing when a save could not be decoded. The
  report-and-continue path returned before the startup teardown ran. Added a
  browser scenario covering an undecodable save, which the existing
  malformed-save scenario did not reach because its fixture decodes cleanly and
  only fails to parse.
- Fixed the "destroy gradients" setting deriving its action from the saved flag
  instead of the checkbox, and restored both the control and the rendered
  gradients when a save is loaded.
- Gave the gradient and autosave checkboxes a themed control, replacing a native
  checkbox that carried the class written for `<select>` elements.
- Renamed the game to **Echoes Beneath** in every player-facing surface: the
  page title, the sharing metadata, the changelog page, and the exported save
  filename. This fork began as a fork of the upstream `Proto23` game and keeps
  that name for the repository. `Proto23` also remains in technical identifiers,
  specifically the npm package name, the `proto23.locale` preference key, the
  live-reload script id, and test fixture prefixes, so existing saves and stored
  language preferences keep working.
- Replaced the placeholder favicon with an icon generated from `assets/icon.png`,
  and added a 192px icon, an Apple touch icon, and a share image under `icons/`,
  which the deployment now publishes.
- Replaced the hand-positioned overlays behind the destroy and disassemble
  confirmations with the shared modal. Both used unitless CSS values and a
  hard-coded 1300px centre, so they rendered off-screen or with no size at all.
- Moved the reference documentation into `docs/`, leaving the developer guide
  and a root `AGENTS.md` pointer that agent tooling still discovers.
- Clamped every resistance damage reduction through a shared `resistanceFactor`
  helper. Resistance skills scale linearly, so the previous `1 - use()`
  multipliers crossed zero and inverted: food-poison and corruption resistance
  turned their damage negative past level 20, restoring satiation and health
  instead of reducing the loss.
- Hid empty message-log state markers, aligned their active state inside the
  toggle buttons, and kept the clear control within the message panel.
- Prevented background sliders and presets from removing the body zoom used to
  fit the complete interface into the viewport.
- Added a localized confirmation before save deletion and limited deletion to the
  game save so the language preference remains intact.
- Fixed `Sun.` being translated as the astronomical “Güneş” instead of the
  Turkish Sunday abbreviation “Paz.”.
- Fixed Sunday-only dojo meal behavior depending on the English display label.
- Moved the hardcoded weekly dojo meal announcement into synchronized English
  and Turkish locale values.
- Fixed the autosave label, collapse control, version link, and delete action
  merging together in the bottom information bar.
- Corrected the Turkish save-deleted confirmation text.
- Fixed hover descriptions being anchored over the character panel because
  unitless CSS coordinates were rejected in standards mode.
- Made hover descriptions account for UI scaling, follow the pointer, and flip
  away from viewport edges without overflowing the visible screen.
- Fixed the enemy panel falling back to the player's top-left position in HTML5
  standards mode by adding pixel units to its coordinates.
- Fixed the Moon Bloom area leave handler by changing its randomized size update
  from `rand(5) + 20` to `rand(5) - 20`.
- Added a visible localized recovery message when save decoding fails before the
  legacy loader can create its own error panel.
- Prevented the loading overlay from remaining indefinitely when a legacy or
  malformed saved game throws during startup.
- Prevented browsers from mixing stale runtime and locale assets after a Pages
  deployment.
- Fixed the in-game changelog link on GitHub Pages deployments hosted below a
  repository project path.
- Preserved legacy global function-hoisting behavior by generating a single
  browser bundle from the separated sources.
- Prevented development dependencies from being included in the GitHub Pages
  artifact.
