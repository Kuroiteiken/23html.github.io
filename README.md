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

Format source files with:

```sh
npm run format
```

Do not edit `js/game.js` or `dist/` directly.

## Languages

English strings live in `locales/en.json`; available languages are registered in
`locales/manifest.json`. The language can be changed under Settings and is stored
independently from game saves.

To add a language such as Turkish:

1. Copy `locales/en.json` to `locales/tr.json` and translate its values without
   changing keys.
2. Add the locale code, display name, and file to `locales/manifest.json`.
3. Run `npm run format`, `npm run build`, and `npm run check`.

Missing keys in another language fall back to English.

## Changelogs

- `changelog/changelog.html`: game releases, content additions, and
  player-facing changes
- `CHANGELOG.md`: code, architecture, tooling, documentation, and deployment
  changes

## GitHub Pages

Changes pushed to `main` are built and validated by
`.github/workflows/deploy-pages.yml`, which publishes the `dist/` directory. In
the repository settings, select **Pages → Build and deployment → Source → GitHub
Actions** once.

The maintained deployment is
[`https://kuroiteiken.github.io/23html.github.io/`](https://kuroiteiken.github.io/23html.github.io/).
The upstream project also runs at
[`https://23html.github.io/`](https://23html.github.io/). Because forks and
project Pages sites may be hosted below a repository path, internal links must be
relative or resolved against `document.baseURI`; root-relative paths such as
`/changelog/...` are not portable.

The canonical development instructions for repository agents are in the root
`AGENTS.md` file.
