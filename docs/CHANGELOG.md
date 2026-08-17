# Repository changelog

[Türkçe](CHANGELOG.TR.md)

This file records codebase, architecture, tooling, documentation, and deployment
changes. Player-facing game content and release notes belong in
`changelog/changelog.html`.

## [Unreleased]

### v476 — stability and follow-through

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
