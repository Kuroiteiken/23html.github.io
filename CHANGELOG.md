# Repository changelog

[Türkçe](CHANGELOG.TR.md)

This file records codebase, architecture, tooling, documentation, and deployment
changes. Player-facing game content and release notes belong in
`changelog/changelog.html`.

## [Unreleased]

### Added

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
- Added reviewed Turkish terminology expectations that protect mastery names and
  other high-risk contextual translations from regression.
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
