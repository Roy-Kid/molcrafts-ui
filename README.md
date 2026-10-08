# @molcrafts/ui — shared shadcn registry for MolCrafts

**Source of truth** for the MolCrafts visual constitution and shadcn-style React
primitives shared by **molexp**, **molvis**, and **molhub**.

This is **not** only an opaque npm component library. Following
[shadcn registry](https://ui.shadcn.com/docs/registry):

1. Author components here as source.
2. `npm run build:registry` → static JSON under `public/r/`.
3. Product apps install with:

```bash
npx shadcn@latest add @molcrafts/button
```

Optional npm package may later ship **tokens + `cn` + thin re-exports** for
plugin runtimes; product apps should prefer the registry so they keep local
ownership of UI source after install.

## What’s in the registry (35 items)

| Kind | Items |
|------|--------|
| Foundation | `utils`, `tokens` |
| Primitives | button, badge, input, label, tabs, tooltip, dialog, dropdown-menu, select, checkbox, separator, scroll-area, popover, slider, card, table, sheet, skeleton, textarea, alert-dialog, accordion, collapsible, context-menu, switch, empty-state, code, number-field, progress-spinner, resizable, command |
| Blocks | `settings-section`, `settings-shell`, `edge-panel` (pull-from-edge rail; includes `use-pointer-drag`) |

### CSS: extract constitution, not brand

`tokens` ships the shared **constitution** (type scale, radius, control geometry,
motion, status roles, semantic slots). Product brand palettes (`--molexp-*`,
`--molvis-*`) stay in product repos and rebind `--accent` / surfaces.

### Plugin UI: no Cell type

`molvis/plugin/src/ui` is only **button / checkbox / select**. Those three are
in this registry. There is no separate “plugin cell” primitive; table cells
live under `table`. Plugin package API stays for runtime; sources converge here.

See [docs/extraction-matrix.md](docs/extraction-matrix.md) for the full matrix.

## Spec

- Design: [`.claude/specs/molcrafts-ui-registry-01.md`](.claude/specs/molcrafts-ui-registry-01.md)
- Acceptance: [`.claude/specs/molcrafts-ui-registry-01.acceptance.md`](.claude/specs/molcrafts-ui-registry-01.acceptance.md)
- Extraction matrix: [docs/extraction-matrix.md](docs/extraction-matrix.md)

## Quick start (registry authors)

```bash
cd ~/work/molcrafts/molcrafts-ui
npm install
npm run build:registry   # writes public/r/*.json
npm run dev:registry     # optional static server for /r
```

## Product consumers

In each app’s `components.json`:

```json
{
  "registries": {
    "molcrafts": {
      "url": "https://ui.molcrafts.dev/r/{name}.json"
    }
  }
}
```

Until hosted, use a local path or GitHub raw URL during bootstrap.

## Status

**Registry + product rewire complete** for **molexp**, **molvis** (page + plugin),
and **molhub** web (local `file:` registry, `sync:products`, constitution CSS).

```bash
npm run build:registry
npm run sync:products   # push sources into sibling molexp / molvis / molhub trees
```

## CI

| workflow | fast tier (a feature-branch push to MolCrafts) | full tier (every fork push; dev / master / main on MolCrafts; PRs, tags, dispatches) | upstream only |
|---|---|---|---|
| `lint.yml` | `lint / typecheck` (`npm run typecheck`) | same | — |
| `test.yml` | `test / context`, `test / registry` (`npm run build:registry`; `public/r/` must match) | same | — |

A pull request inside a fork skips the jobs its push already ran. Shared setup
is `MolCrafts/molcrafts-ci/actions/<name>@master`. Nothing here is released or deployed; products pull items with
`sync:products` or `shadcn add`.
