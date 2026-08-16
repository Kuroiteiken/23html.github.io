# Agent instructions

[Türkçe çeviri](AGENTS.TR.md)

This file is the single canonical project reference for every agent working in
this repository. Do not create nested `AGENTS.md` files. Make instruction changes
only in this file, then keep `AGENTS.TR.md` synchronized as its Turkish
translation.

## Project boundaries

- `changelog/changelog.html` contains only player-facing game releases, content
  additions, and gameplay changes.
- The root `CHANGELOG.md` contains code, architecture, tooling, documentation,
  and deployment changes.
- `README.md` is the English developer guide; `README.TR.md` is its Turkish
  translation.
- `js/game.js` and `dist/` are generated outputs and must not be edited directly.

## Source layout

- `css/`: source styles.
- `js/core/`: startup, save/load, and player state.
- `js/data/`: game-content definitions.
- `js/systems/`: game systems.
- `js/ui/`: DOM and rendering code.
- `js/utils/`: general helpers.
- `js/world/`: areas, sectors, and locations.
- `scripts/`: build and deployment-output tools.

## Required workflow

1. Edit the relevant source file, never a generated output.
2. Add player-facing or developer-facing changes to the correct changelog.
3. Keep English Markdown files and their `.TR.md` translations synchronized.
4. Run `npm run format`.
5. Run `npm run build` to regenerate the bundle and `dist/` output.
6. Run `npm run check`.
7. When possible, open `dist/index.html` in a real browser and check for runtime
   errors.

## Compatibility rules

- Do not change the save key, serialized field order, or Base64 compatibility
  without an explicit migration.
- Preserve the source order in `scripts/build.js`; the legacy game depends on
  global function-hoisting behavior.
- Moving globals into module scope or enabling strict mode requires a separate,
  deliberate migration.
- Keep files in UTF-8 and do not introduce mojibake.
- Make behavior changes only when they are within the user's requested scope.

## Deployment

- GitHub Pages must use GitHub Actions as its source.
- A push to `main` triggers `.github/workflows/deploy-pages.yml`.
- Only `dist/` is uploaded as the Pages artifact.
