# Proto23

[Türkçe](README.TR.md)

Proto23 is an early-stage browser game that does not require a backend. This
repository also contains the static site published through GitHub Pages.

## Getting started

Requirements: Node.js 22 or later and npm.

```sh
npm install
npm run build
```

Because locale JSON files are loaded with `fetch`, serve the generated site over
HTTP instead of opening `dist/index.html` directly:

```sh
npm run serve
```

Then open `http://127.0.0.1:8080`.

## Source structure

- `css/`: game styles
- `js/core/`: startup, save/load, and player state
- `js/data/`: item, equipment, skill, quest, and creature definitions
- `js/systems/`: action, crafting, effect, simulation, and planning systems
- `js/ui/`: interface and rendering code
- `js/world/`: areas, sectors, and locations
- `js/utils/`: random-number and encoding helpers
- `locales/`: locale registry and JSON translation files
- `scripts/`: bundle and deployment-output tools

The legacy game expects all function declarations to be available before
initialization starts. Therefore, `js/game.js` is a generated browser bundle.
After editing source files, rebuild the bundle and GitHub Pages output:

```sh
npm run build
```

Run code checks with:

```sh
npm run check
npm run test:browser
```

The browser regression suite covers delayed assets, consistent cache-busting
versions, Turkish startup, cached-profile reloads, malformed-save recovery,
viewport fitting, save-bar layout, locale-independent calendar behavior, and
project-path changelog links. It also verifies theme scaling, message-log control
bounds, separated background preset controls, and safe confirmed save deletion.
The deletion modal checks cover localization, focus restoration, Escape,
backdrop cancellation, viewport fit, and preference preservation. Bug fixes and
behavior changes must extend the relevant regression coverage before deployment.

The integer game version is incremented at meaningful release milestones that
contain fixes, features, or player-facing additions. Small related fixes and UI
refinements are accumulated in the current release entry instead of receiving a
new version each. The newest `changelog/changelog.html` range must end at the
same version; automated checks reject a mismatch. Formatting or
documentation-only changes do not require a version increment.

Format source files with:

```sh
npm run format
```

Related changes may be accumulated. Ask the repository owner for explicit
approval before creating a commit or pushing; neither action is automatic.

Do not edit `js/game.js` or `dist/` directly.

## Languages

English strings live in `locales/en.json`, and the complete Turkish translation
lives in `locales/tr.json`; available languages are registered in
`locales/manifest.json`. The language can be changed under Settings and is stored
independently from game saves. Locale validation requires every registered
language to preserve the full English key structure, interpolation placeholders,
and HTML formatting tokens.

Machine-assisted translations require a context review by a language-aware
agent. Abbreviations and short or polysemous labels must preserve their actual UI
meaning; for example, English `Sun.` in a weekday list means Sunday rather than
the astronomical sun. Dialogue and action labels must also be checked against
their surrounding scene, adjacent messages, and resulting game behavior;
high-risk corrections belong in `tests/translation-expectations.tr.json`.

For testing or sharing a language directly, use the `lang` query parameter, such
as `?lang=tr`. A valid query selection applies to that page load; changes made in
Settings remain the persistent preference.

To add another language such as German:

1. Copy `locales/en.json` to `locales/de.json` and translate its values without
   changing keys.
2. Add the locale code, display name, and file to `locales/manifest.json`.
3. Run `npm run format`, `npm run build`, and `npm run check`.

Missing keys in another language fall back to English.

## Changelogs

- `changelog/changelog.html`: game releases, content additions, and
  player-facing changes
- `docs/CHANGELOG.md`: code, architecture, tooling, documentation, and
  deployment changes

## GitHub Pages

Changes pushed to `main` are built and validated by
`.github/workflows/deploy-pages.yml`, which publishes the `dist/` directory. In
the repository settings, select **Pages → Build and deployment → Source → GitHub
Actions** once.

The deployment build adds a content hash to CSS, JavaScript, and locale requests
so a new release cannot become stuck by mixing cached assets from an older
release.

The maintained deployment is
[`https://kuroiteiken.github.io/23html.github.io/`](https://kuroiteiken.github.io/23html.github.io/).
The upstream project also runs at
[`https://23html.github.io/`](https://23html.github.io/). Because forks and
project Pages sites may be hosted below a repository path, internal links must be
relative or resolved against `document.baseURI`; root-relative paths such as
`/changelog/...` are not portable.

## Documentation

Reference documents live in `docs/`; only this guide and its Turkish
translation stay at the repository root.

- `docs/AGENTS.md`: the canonical development instructions for repository
  agents. The root `AGENTS.md` is a pointer kept only so agent tooling that
  looks for it at the root still resolves.
- `docs/ROADMAP.md`: the fork integration roadmap and its phases.
- `docs/STORY.md`: the current state of the quest chain, the story's end point,
  and the content that exists but is not yet reachable.
- `docs/CHANGELOG.md`: repository changes.

Every document has a `.TR.md` Turkish counterpart that must be kept in sync.
