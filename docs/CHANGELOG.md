# Repository changelog

[Türkçe](CHANGELOG.TR.md)

This file records codebase, architecture, tooling, documentation, and deployment
changes. Player-facing game content and release notes belong in
`changelog/changelog.html`.

## [Unreleased]

### v478 — statting that cannot silently break

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
