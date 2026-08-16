# Repository changelog

[Türkçe](CHANGELOG.TR.md)

This file records codebase, architecture, tooling, documentation, and deployment
changes. Player-facing game content and release notes belong in
`changelog/changelog.html`.

## [Unreleased]

### Added

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

- Fixed the in-game changelog link on GitHub Pages deployments hosted below a
  repository project path.
- Preserved legacy global function-hoisting behavior by generating a single
  browser bundle from the separated sources.
- Prevented development dependencies from being included in the GitHub Pages
  artifact.
