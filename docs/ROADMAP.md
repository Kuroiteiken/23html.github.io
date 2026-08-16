# Fork integration roadmap

[Türkçe](ROADMAP.TR.md)

This roadmap plans what to adopt from three independent forks of the upstream
Proto23 project and how to apply it to this repository's own structure. It is a
planning document; no source change has been made for it yet.

Reference forks, used only as they stand in git:

- [`tioluko/23html.github.io`](https://github.com/tioluko/23html.github.io)
- [`lgxnders/proto-homage`](https://github.com/lgxnders/proto-homage)
- [`MercuriusXeno/23html.github.io`](https://github.com/MercuriusXeno/23html.github.io)

## Decisions that shape this plan

These are settled and every phase below follows them.

- **No power creep.** The November 2024 tuning in `MercuriusXeno` includes a
  commit named "Cheater edition". Only clear corrections are adopted. The target
  is a game that is neither punishing nor boring.
- **The opening stays as it is.** The `lgxnders` intro is not adopted. Its later
  story progression may be adapted as context for content that comes after the
  current opening.
- **Story first, content second.** Most entities already exist; the story flow
  around them does not. Adoption is aimed at that gap.
- **Forks are references, not upstreams.** Nothing is merged. Their published
  state in git is the only source, and all three are now dormant.
- **Attribution goes in the changelog.** No repository in this family carries a
  licence file, so each adopted fix or addition names its source fork and commit
  in `CHANGELOG.md`.
- **Publication comes last.** The repository is public and playable, but it has
  not been announced. It will be announced once this roadmap is finished.

## Where the project stands

All four repositories descend from the same two upstream commits of October 2022
and diverged completely afterwards. Because the shared history is only those two
commits, `git merge` and `git cherry-pick` are not usable. Every adoption here is
a manual port into this repository's own structure.

| Repository          | Architecture             |       Code | Commits | Latest  | Character         |
| ------------------- | ------------------------ | ---------: | ------: | ------- | ----------------- |
| `23html` (upstream) | single `index.html`      |     14,768 |       2 | 2022-10 | Abandoned         |
| `tioluko`           | `index.html` plus CSS    |     14,840 |      14 | 2025-05 | Bug-fix copy      |
| `lgxnders`          | Vite and ESM `src/`      |     22,791 |     108 | 2026-06 | New story, WIP    |
| `MercuriusXeno`     | TypeScript and esbuild   |     18,837 |     106 | 2026-07 | Refactor          |
| **This repository** | **JS modules, i18n, CI** | **~34.5k** |  **12** | 2026-08 | **Tooling-first** |

This repository is the only one with localization, regression tests, a build
pipeline, and continuous deployment. None of the three forks has any of them.

### The real imbalance

Counting the current sources tells the story more precisely than the totals do.

| Dimension      | Current state                                         | Assessment    |
| -------------- | ----------------------------------------------------- | ------------- |
| Items          | `js/data/items.js`, 7,434 lines                       | Rich          |
| Locations      | `js/world/locations.js`, 5,331 lines, 69 scenes       | Rich          |
| Creatures      | `js/data/creatures.js`, 776 lines                     | Adequate      |
| Titles         | 108 defined, **4 with a mechanical effect**           | Mostly unused |
| Quests         | **5 in total**                                        | Nearly absent |
| Callback hooks | `callbackManager` exists, **only `callback.onDeath`** | Minimal       |

The game is content-rich and story-poor. That is the gap the forks can help
close, and it is why Phase 5 matters more than the size of its section suggests.

## Confirmed defects still present here

Verified against the current working tree. None carries a localization cost.

| #   | Symptom                                           | Location                       | Cause                                                                                                                                | Source      |
| --- | ------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1   | AGL multiplier resets to 1 on every save and load | `js/core/bootstrap.js:391`     | `aglm: you.agml` misspells the property, so `undefined` is serialized; the loader at `:672` then falls back to `1`                   | `lgxnders`  |
| 2   | Area sizes drift on load                          | `js/core/bootstrap.js:962`     | `if (a5[xx])` skips both the assignment and the counter for an area of size `0`; the save side at `:503` always advances the counter | `mercurius` |
| 3   | Destroy and disassemble dialogs are broken        | `js/ui/interface.js:5726,5887` | Unitless CSS values, a hard-coded `1300 / 2` centre, absolute positioning, and no stacking context                                   | `lgxnders`  |
| 4   | "Pause next battle" label is wrong after loading  | `js/core/bootstrap.js:1001`    | `global.flags = a1.e` restores the flag, but `dom.d8m1` and the `btl` state are not resynchronized                                   | `mercurius` |
| 5   | Base stats have no fallback on a corrupted save   | `js/core/bootstrap.js:660-690` | Additive and multiplier fields guard with `\|\| 0` and `\|\| 1`; the base fields `str`, `agl`, `int`, `spd`, `luck`, `wealth` do not | `lgxnders`  |
| 6   | Death satiation penalty grows with skill          | `js/core/player.js:139`        | `sat *= 0.55 * (1 - skl.dth.use())` punishes a higher Death skill                                                                    | `tioluko`   |
| 7   | `detachCallback` removes the wrong hook           | `js/data/titles.js:674-678`    | `splice(callback.hooks[a], 1)` passes the hook object where an index belongs; it coerces to `0`, so the first hook goes instead      | **own**     |

Defect 5 is restated for this codebase. The `lgxnders` fix targets their own
rewritten loader; the equivalent risk here sits on the base stat fields, not on
the additive ones.

Defect 7 was found while reviewing the callback system for Phase 4. It is not a
fork finding. It currently affects `quest.lmfstkil1.rwd()`, the only caller of
`detachCallback`.

Defect 6 is confirmed for adoption: dying should not punish the Death skill, and
a resurrection may leave the character fed.

## Localization gate

Every fork keeps player-facing text inside the source. This repository does not.
Any adopted line therefore costs work in three places: the source, the English
key in `locales/en.json`, and the Turkish translation in `locales/tr.json`. A
missing key fails `npm run check`.

Keys follow `content.<type>.<id>.<field>`, for example `content.wpn.stk1.name`.
Registered types: `creature`, `effect`, `wpn`, `eqp`, `sld`, `acc`, `furniture`,
`item`, `quest`, `skl`, `ttl`, `weather`, `abl`, `act`, `rcp`, `vendor`,
`mastery`, and `area`.

### Two existing gaps that block story work

Both must be closed before Phase 5, because new quests would otherwise multiply
the problem.

- **Quest goal text bypasses i18n.** `goals()` and `goalsf()` in
  `js/data/quests.js` return hard-coded English, for example
  `"Firewood collected: …"` and `"Wolves killed: …"`.
- **Title talent text bypasses i18n.** `tdesc` values in `js/data/titles.js` are
  hard-coded English, for example `"Running consumes 5% less energy"`.

Neither is caught by `tests/check-i18n.js`, which compares key structure between
locales and cannot see a string that never became a key.

## GitHub Pages

The current flow was reviewed end to end. `.github/workflows/deploy-pages.yml`
builds on a push to `main`, runs `npm run check` and `npm run test:browser`, then
uploads `dist/` and deploys. Permissions are minimal and concurrency is set so a
deploy is never cancelled midway.

What already works and needs no change:

- **Cache busting is sound.** `scripts/build-site.js` hashes `css/game.css`,
  `js/game.js`, `js/i18n-loader.js`, and every locale file into one asset
  version, then rewrites `index.html`. `js/i18n-loader.js` reads that version
  from its own script URL and propagates it to the game bundle, the manifest, and
  each locale request, so a release cannot mix cached assets.
- **`.nojekyll` is written** into `dist/`.
- **The smoke test fails loudly** when no browser is found rather than skipping,
  and `ubuntu-latest` ships `/usr/bin/google-chrome`, which is on the candidate
  list.

Three gaps worth closing before the game is announced:

| Gap                          | Detail                                                                                                                                        | When                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| No pull-request validation   | The workflow triggers only on push to `main` and `workflow_dispatch`. A public repository that others may fork gets no CI on incoming changes | Phase 0             |
| No sharing metadata          | `index.html` has no `description`, Open Graph, or `theme-color` tags. A shared link renders as a bare title                                   | Before announcement |
| Deploy output is not checked | `npm run check` validates sources; nothing asserts that `dist/` itself loads. The smoke test runs against a local server                      | Phase 1             |

## Phase 0 — Preparation

No source change and no version increment.

- Add the three forks as read-only remotes so `git log` and `git show` can serve
  as the reference. Never merge or pull from them.
- Pin the recovered balance work of `MercuriusXeno`. The November 2024 branch tip
  is `fe96bc0^`; the work was discarded in June 2025 by the commit "Putting
  everything back to vanilla" but remains reachable. It is the only source that
  Phase 2 draws on.
- Add a `pull_request` trigger to the workflow that runs build and check without
  deploying.
- Commit the current working-tree changes, including the `scripts/` to `tests/`
  reorganization, so later adoption diffs stay readable.

## Phase 1 — Defect fixes

Low risk, no localization cost, target version 475. All seven defects above.

- **Start with 1 and 2.** Neither alters the save format; both correct load
  behaviour, and 2 also repairs saves that are already inconsistent.
- **Defect 3 reuses what already exists.** This repository already has a proper
  modal: `dom.save_delete_modal` is a native `<dialog>` with `showModal()`, the
  `game-modal` class family, ARIA wiring, backdrop dismissal, and focus restore.
  The task is to extract a reusable
  `showConfirmModal({ title, message, confirmLabel, onConfirm })` helper from it
  and reroute both the destroy and the disassemble dialog through it. The
  `lgxnders` patch, which only repairs the inline styles, is not needed.
- **Defect 7 is independent** of the others and can go first if convenient.
- Per `AGENTS.md`, every fix extends `tests/check-game-regressions.js` or
  `tests/browser-smoke-test.js` before deployment.

The extracted modal helper is the reusable piece this phase leaves behind; later
phases use it wherever a confirmation is needed.

## Phase 2 — Corrections and measured balance

Medium risk, low localization cost, target version 476. Drawn from the recovered
November 2024 work, filtered against the no-power-creep decision.

### Adopt — clear corrections

| Change             | Detail                                                                                  | Why it qualifies                                                            |
| ------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Drop-rate typo     | `global.wdrop` for `lckl`, `.0000048` to `.000048`                                      | A missing zero, not a tuning choice                                         |
| Rare drop coverage | `mnblm` and `stthbm1`–`4` added to `global.rdrop`                                       | Removes the single-area dependency for Moon Bloom                           |
| Death satiation    | `0.55 * (1 - dth)` to `0.45 * (1 + dth)`                                                | Defect 6; the current formula penalises the skill it should reward          |
| INT-scaled healing | Shared `healingEfficacy()` and `healingFunction()` bound to `hrb1`, `hlpd`, `hptn1`–`4` | Makes INT meaningful outside crafting and shows the real number in tooltips |

The healing change is the only one here with a localization cost: descriptions
become functions that report the computed amount, so their keys need
interpolation placeholders. The loader already supports that.

### Evaluate individually — measure, then decide

None of these is adopted on the fork's authority. Each is a separate, measurable
change.

| Change                  | Detail                                                                | Consideration                                              |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| Training-dummy drop cap | `you.lvl <= 20` to `50`                                               | Reduces an early-game bottleneck without raising numbers   |
| Area sizes              | `frstn1a2` 60→20, `frstn2a2` 50→20, `frstn9a1` 48→28, `hmbsmnt` 10→50 | Shortens grind loops; unmeasurable until defect 2 is fixed |
| `creature.tdummy.id`    | `103` to `102`                                                        | Adopt only if a real collision is confirmed                |

### Do not adopt

The skill experience curve change, `log(9 * lvl + 1)` to `log(6 * lvl + 1)`, is
left out. It is a global acceleration of every skill at once, which is exactly
the power creep this plan excludes.

## Phase 3 — Content and progression depth

Medium risk, high localization cost, target versions 477 and 478. Three steps, in
increasing cost order.

### Phase 3a — Title effects

The highest value for the lowest risk, and it needs no new infrastructure. The
talent system is already built and wired: `bootstrap.js:1119` and
`simulation.js:1270` apply `talent()`, and `interface.js:3522` renders `tdesc`
through `ui.itemDescription.talentEffect`.

Of 108 titles, only 4 carry an effect. The remaining 104 are flavour text for
milestones the player has already earned. Giving them modest, thematic effects
rewards existing progress rather than inflating it, which fits the no-power-creep
rule better than any numeric tuning would.

Prerequisite: move the existing `tdesc` strings into `locales/`, then add keys
alongside each new talent.

### Phase 3b — Complete the patchwork set

Add `eqp.ptchhd`, `eqp.ptchglv`, `rcp.ptchhd`, and `rcp.ptchglv`, and let the
`item.bfsnwt` notebook teach the new recipes. This closes gaps in a set that
already exists, so it needs no new system and fits the current progression curve.

`wpn.axe1` from the same fork is **not** adopted; it is an unrelated weapon that
adds nothing the set needs.

Once the set is complete, consider a **set bonus** when every piece is equipped
together. That is an addition of this project's own design rather than a port,
and it gives the completed set a reason to exist beyond its individual stats.

### Phase 3c — Fill the skill milestone tables

`MercuriusXeno` populated milestone tables that are still empty here: `skl.mdt`,
`skl.crft`, `skl.thr`, `skl.ntst`, and an extended `skl.alch`. Empty tables mean
those skills currently level with no reward at all, so filling them corrects an
omission rather than adding power.

The same work also inserts intermediate steps at levels 3, 4, 6, 9, and 12 into
tables that already have entries. Those are deferred: they are denser rewards on
skills that already pay out, which is where power creep would enter.

Every step carries a `p:` label, so this is the most translation-heavy item in
the roadmap. Fill the empty tables first and stop there.

## Phase 4 — Architecture

Reassessed against this codebase rather than against the forks' own structure.
Two of the three items from the first draft did not survive that review.

### Extend the existing callback system

`js/data/titles.js` already defines `callbackManager`, `attachCallback`, and
`detachCallback`, but only one hook exists: `callback.onDeath`, with four call
sites. This is the codebase's own event mechanism.

The `MercuriusXeno` event bus is **not** adopted. Importing it would create a
second, parallel dispatch system alongside this one. The equivalent gain comes
from adding hooks to what is already here — points such as level-up, area entry,
crafting, and quest completion are what Phase 5 will need.

Fix defect 7 first; extending a dispatcher whose detach path removes the wrong
entry would spread the bug.

### Add a scene helper for new content only

The options-object pattern from `lgxnders`, `new Chs({ id, sl })`, was
overestimated in the first draft. Measured against this repository, the per-scene
boilerplate is roughly four lines across 69 scenes, well under 300 of the 5,331
lines in `js/world/locations.js`. The bulk of that file is scene content, which
the pattern does not touch.

So the existing 69 scenes are **not** rewritten. A large mechanical diff across a
file under active editing would cost review time and return almost nothing. The
pattern is worth adopting only as a helper for the new scenes Phase 5 adds, where
it genuinely improves readability.

### CSS tokens and semantic class names

This item stands. The `MercuriusXeno` repository ships
`docs/frontend-refactoring.md` and `docs/CLASS_MAP.md`, ready-made tables mapping
cryptic names such as `inv_slot`, `crf_lg`, and `opt_c` to semantic equivalents.
They apply directly to `css/game.css`, and the work is mechanical and testable.

### Not adopted

A full TypeScript migration would require rewriting the build, the locale loader,
the test suite, and deployment. `AGENTS.md` also treats module scope and strict
mode as a separate deliberate migration, since the bundle depends on global
function hoisting and the source order in `scripts/build.js`. JSDoc with
`checkJs` remains available later at a fraction of the cost.

## Phase 5 — Story

The largest phase, and the one the project actually needs. The opening is not
touched.

### Where the story currently stops

Five quests exist. Three of them, `fwd1`, `hnt1`, and `lmfstkil1`, are anchored
at **Western Woods, Hunter's Lodge**; `grds1` sits at the Village Center
marketplace gate; `test` is a placeholder. After `lmfstkil1` the thread simply
ends, even though the world, items, and creatures continue well past it.

### Why `lgxnders` fits here specifically

Their Western Woods expansion attaches to the same lodge. The note their player
finds is signed _"Head Hunter, Yamato"_ and is posted on the lodge door — the
exact building this repository's three quests already revolve around. They give
that hunter a name, a reason for being absent, and a direction he has gone.

That is a usable hook that costs nothing narratively: it does not touch the
opening, it does not contradict anything established, and it turns an existing
quest hub into a thread that continues. Their river, riverman, and shack sequence
sits further along the same route and can be adapted as later context.

The recommendation is to adapt the **thread and its anchor points**, written
natively in Turkish and English rather than translated, and to leave their prose,
placeholders, and `@Todo` markers behind.

### Prerequisites

- Close both localization gaps named above; new quests would otherwise multiply
  hard-coded English.
- Land the Phase 4 callback hooks, since quest progression needs more than
  `onDeath`.
- Have the scene helper available for the new locations.

## Excluded on purpose

Each of these is a known problem on the fork's own branch and would slip in
unnoticed during a bulk port.

| Item                          | Reason                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `skl.fdpnr` level 1           | `MercuriusXeno` sets `exp_t += 0.3` while the label still reads `+3%`; a ten-fold slip left over from testing |
| Skill experience curve        | A global acceleration of every skill; excluded by the no-power-creep decision                                 |
| Intermediate milestones       | Denser rewards on skills that already pay out; deferred for the same reason                                   |
| `wpn.axe1`                    | Unrelated to the patchwork set and not needed                                                                 |
| `You.rank()` scale factor     | `lgxnders` changed `50000000000000` to `850727696967670912` with no stated rationale                          |
| `skl.sleep.use`               | `lgxnders` reduced `5 * lvl * x.sq` to `5 * this.level` and left `//@Todo fix errors with x`                  |
| Fireplace handling            | `lgxnders` commented it out entirely behind `/* @Todo fix fire */`                                            |
| The `lgxnders` opening        | The current opening stays; only later story context is adapted                                                |
| `lgxnders` story items        | `item.sp4` grants 185,000,000 EXP; tuned to their opening and unbalanced without it                           |
| The `MercuriusXeno` event bus | Would duplicate the existing `callbackManager`                                                                |
| Rewriting the 69 scenes       | Large mechanical diff, negligible gain                                                                        |
| Full TypeScript migration     | Would require rewriting build, locale loader, tests, and deployment                                           |
| All of `tioluko`              | One change is already applied here, one moved to Phase 2, and its CSS split is weaker than ours               |

## Attribution

No repository in this family carries a licence file, and all three forks are now
dormant. Each adopted fix and addition names its source fork and commit in
`CHANGELOG.md`. That is both the correct practice and the only way to trace an
adoption later.
