# Agent instructions

[Türkçe çeviri](AGENTS.TR.md)

This file is the single canonical project reference for every agent working in
this repository. Do not create nested `AGENTS.md` files. Make instruction changes
only in this file, then keep `AGENTS.TR.md` synchronized as its Turkish
translation.

## Project boundaries

- `changelog/changelog.html` contains only player-facing game releases, content
  additions, and gameplay changes. Add an entry there for every general game
  development change.
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
- `locales/`: locale registry and JSON translation files.
- `scripts/`: build and deployment-output tools.

## Required workflow

1. Edit the relevant source file, never a generated output.
2. Add player-facing or developer-facing changes to the correct changelog.
3. Keep English Markdown files and their `.TR.md` translations synchronized.
4. Run `npm run format` so every supported repository file, including
   `changelog/changelog.html`, is formatted with Prettier.
5. Run `npm run build` to regenerate the bundle and `dist/` output.
6. Run `npm run check`.
7. Run `npm run test:browser` when Chrome or Chromium is available.
8. Before every commit and push, update both the player-facing HTML changelog and
   the English/Turkish repository changelogs for the changes being published.
9. Create and push periodic milestone commits during ongoing development after
   the required changelog updates and validation succeed.

## Compatibility rules

- Do not change the save key, serialized field order, or Base64 compatibility
  without an explicit migration.
- Preserve the source order in `scripts/build.js`; the legacy game depends on
  global function-hoisting behavior.
- Moving globals into module scope or enabling strict mode requires a separate,
  deliberate migration.
- Keep files in UTF-8 and do not introduce mojibake.
- Put new player-facing shared UI text in `locales/en.json`, reference it through
  `i18n.t()` or `i18n.get()`, and preserve translation keys across locales.
- Register new locale files in `locales/manifest.json`; non-English locales may
  rely on the English fallback while translations are incomplete.
- Make behavior changes only when they are within the user's requested scope.
- Design UI changes to keep the complete fixed-layout game visible in the
  viewport where practical, and test them at reduced viewport sizes.
- Reply to the repository owner in Turkish. On forks, follow the current user's
  language preference.

## Deployment

- GitHub Pages must use GitHub Actions as its source.
- A push to `main` triggers `.github/workflows/deploy-pages.yml`.
- Only `dist/` is uploaded as the Pages artifact.
- The maintained deployment is `https://kuroiteiken.github.io/23html.github.io/`;
  the upstream deployment is `https://23html.github.io/`.
- Internal links must work both at a domain root and below a GitHub Pages project
  path. Do not hard-code root-relative paths such as `/changelog/...`; use a
  document-base-aware URL or a relative URL.
- Keep deploy asset versioning intact so HTML, JavaScript, CSS, and locale files
  from different releases cannot be mixed by browser caches.
