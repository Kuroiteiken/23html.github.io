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

The generated site can be opened locally from `dist/index.html`.

## Source structure

- `css/`: game styles
- `js/core/`: startup, save/load, and player state
- `js/data/`: item, equipment, skill, quest, and creature definitions
- `js/systems/`: action, crafting, effect, simulation, and planning systems
- `js/ui/`: interface and rendering code
- `js/world/`: areas, sectors, and locations
- `js/utils/`: random-number and encoding helpers
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
```

Format source files with:

```sh
npm run format
```

Do not edit `js/game.js` or `dist/` directly.

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

The canonical development instructions for repository agents are in the root
`AGENTS.md` file.
