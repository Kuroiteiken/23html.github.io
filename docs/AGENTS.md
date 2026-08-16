# Agent instructions

[Türkçe çeviri](AGENTS.TR.md)

This file is the single canonical project reference for every agent working in
this repository. The root `AGENTS.md` is only a pointer to this file, kept so
agent tooling that looks for it at the repository root still resolves. Do not
create any other `AGENTS.md` file. Make instruction changes only in this file,
then keep `AGENTS.TR.md` synchronized as its Turkish translation.

## Project boundaries

- Reference documents live in `docs/`. Only `README.md`, `README.TR.md`, and the
  root `AGENTS.md` pointer stay at the repository root.
- `changelog/changelog.html` contains only player-facing game releases, content
  additions, and gameplay changes. Add an entry there for every general game
  development change.
- `docs/CHANGELOG.md` contains code, architecture, tooling, documentation, and
  deployment changes.
- `docs/ROADMAP.md` holds the fork integration roadmap and its phases.
- `docs/STORY.md` records the quest chain, where the story currently ends, and
  the content that exists but is not yet reachable. Update it whenever story
  content is added or a previously unreachable system is wired in.
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
9. Accumulate related changes when useful. Before starting a comprehensive or
   high-risk development phase, finish the current stable batch, update its
   changelogs, run the required tests, and create a descriptive checkpoint
   commit. This is standing authorization for those clean checkpoint commits.
   Never push until the repository owner gives an explicit final instruction.
10. Add or update regression tests for every bug fix and behavior change. A
    deploy must not proceed while relevant loading, cache, save, locale, or UI
    scenarios remain untested or failing.
11. When player-facing strings are added or changed, scan the complete related
    source group for remaining raw strings, migrate them through
    `locales/en.json` and `locales/tr.json`, and add regression coverage for the
    migrated scope.

## Compatibility rules

- Do not change the save key, serialized field order, or Base64 compatibility
  without an explicit migration.
- Preserve the source order in `scripts/build.js`; the legacy game depends on
  global function-hoisting behavior.
- Moving globals into module scope or enabling strict mode requires a separate,
  deliberate migration.
- Keep files in UTF-8 and do not introduce mojibake.
- Every new or changed player-facing string must come from `locales/en.json` and
  `locales/tr.json`, be referenced through `i18n.t()` or `i18n.get()`, and
  preserve its translation key across locales. Do not introduce player-facing
  raw strings in JavaScript or HTML.
- Have a language-aware agent contextually review machine-assisted translations,
  especially abbreviations, calendar terms, directions, statistics, equipment,
  and other short or polysemous labels. Translate what the source abbreviation
  means in context; never expand it into an unrelated literal word.
- Keep the Turkish game glossary consistent: translate gameplay `perk` as
  `yetenek`, not `avantaj`, including names, descriptions, and unlock messages.
- Have a language-aware agent contextually review every new or changed locale
  key, not only bulk machine-assisted translations.
- Keep the established Turkish gameplay terms stable. Translate `perk` as
  “Avantaj”; do not render it as “Yetenek”, which the skills panel already uses.
- Write Turkish action labels as imperatives, not verbal nouns. In Turkish the
  `-ma`/`-me` suffix is both a verbal noun and the negative imperative, so a
  menu entry translated as a verbal noun reads as an instruction not to do the
  thing: “Satın alma” reads as “do not buy”, and the correct label is “Satın
  al”. Check every action label, button, and choice for this collision.
- Review dialogue and action labels together with their source-code scene,
  adjacent messages, and resulting game behavior. Do not approve an isolated
  dictionary translation when the interaction gives the phrase a narrower
  meaning; lock high-risk corrections in the translation expectation tests.
- Evaluate sentence structure as part of that contextual review: verify subject
  and object roles, word order, tone, and how placeholders join the surrounding
  text. Preserving a token is not sufficient if the rendered sentence becomes
  ungrammatical. For example, a fireplace message containing `{fuel}` must read
  naturally for every fuel value inserted into it; apply this principle to all
  placeholder-based text rather than treating that example as a special case.
- Treat a translation key rendered literally in the UI, message log, tooltip,
  hover content, or any other player-facing surface as a bug. Prevent this with
  fallback tests, locale-schema/key-parity tests, and browser tests that exercise
  the affected surface.
- A completed broad localization audit is only a snapshot. Any later source or
  locale change invalidates the reviewed status of its affected scope, so scan
  and contextually review that scope again. The earlier 2,177-locale-entry and
  255-raw-string audit is recorded as the reason for this recurring workflow,
  not as a permanent completion milestone.
- Register new locale files in `locales/manifest.json`; non-English locales may
  rely on the English fallback while translations are incomplete.
- Make behavior changes only when they are within the user's requested scope.
- Increment the integer game version for meaningful release milestones that
  contain bug fixes, features, or player-facing additions, and add a matching
  `previousーcurrent` section at the top of `changelog/changelog.html`. Accumulate
  small related fixes and UI refinements in the current release entry instead of
  creating a version for every minor change. Trivial documentation, formatting,
  or wording-only changes do not require a version increment.
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
