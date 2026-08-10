# @molcrafts/ui — shared shadcn registry for MolCrafts

**Source of truth** for design tokens and shadcn-style React primitives shared by
**molexp**, **molvis**, and **molhub**.

This is **not** a traditional opaque npm component library as the only
distribution path. Following [shadcn registry](https://ui.shadcn.com/docs/registry):

1. Author components here as source.
2. `pnpm build:registry` → static JSON under `public/r/`.
3. Product apps install with:

```bash
npx shadcn@latest add @molcrafts/button
```

Optional npm package `@molcrafts/ui` may ship **tokens + `cn` + a thin
re-export surface for plugin runtimes** (e.g. molvis plugins); product apps
should prefer the registry so they keep local ownership of UI source.

## Spec

- Design: [`.claude/specs/molcrafts-ui-registry-01.md`](.claude/specs/molcrafts-ui-registry-01.md)
- Acceptance: [`.claude/specs/molcrafts-ui-registry-01.acceptance.md`](.claude/specs/molcrafts-ui-registry-01.acceptance.md)
- Extraction matrix: [docs/extraction-matrix.md](docs/extraction-matrix.md)

## Quick start (registry authors)

```bash
cd ~/work/molcrafts/molcrafts-ui
pnpm install
pnpm build:registry   # writes public/r/*.json
pnpm dev:registry     # optional static server for /r
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

**Scaffold + spec.** v0 component migration is tracked in the acceptance
criteria; do not treat this package as production-complete until AC-001+ pass.
