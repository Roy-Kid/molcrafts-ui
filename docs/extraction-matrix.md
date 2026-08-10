# Extraction matrix — what to pull into molcrafts-ui

Inventory date: 2026-08-10. Sources: `molexp/ui`, `molvis/page`, `molvis/plugin`, `molhub/apps/web`.

## Legend

| Tag | Meaning |
|-----|---------|
| **v0** | First registry ship — extract now |
| **v1** | After tokens + v0 stable |
| **v2** | Product-pattern blocks |
| **stay** | Never share — product- or domain-specific |
| **plugin** | Keep on `@molcrafts/molvis/plugin` (runtime boundary), optionally *built from* this registry later |

## Intersection (present in ≥2 products)

| Item | molexp | molvis page | molvis plugin | molhub | Decision | Notes |
|------|:------:|:-----------:|:-------------:|:------:|----------|-------|
| `button` | ✓ | ✓ | ✓ | ✓ | **v0** | Class strings already nearly identical (`rounded-control`, accent tokens) |
| `badge` | ✓ | ✓ | | ✓ | **v0** | Status colors must come from shared tokens |
| `input` | ✓ | ✓ | | ✓ | **v0** | |
| `label` | ✓ | ✓ | | | **v0** | |
| `tabs` | ✓ | ✓ | | ✓ | **v0** | |
| `tooltip` | ✓ | ✓ | | ✓ | **v0** | |
| `dialog` | ✓ | ✓ | | | **v0** | |
| `dropdown-menu` | ✓ | ✓ | | | **v0** | |
| `select` | ✓ | ✓ | ✓ | | **v0** | Plugin peer-dep; sync source here |
| `checkbox` | ✓ | ✓ | ✓ | | **v0** | Plugin peer-dep |
| `separator` | ✓ | ✓ | | | **v0** | |
| `scroll-area` | ✓ | ✓ | | | **v0** | |
| `popover` | ✓ | ✓ | | | **v0** | |
| `slider` | ✓ | ✓ | | | **v0** | |
| `resizable` | ✓ | ✓ | | | **v1** | Heavier dep; used less |
| `code` | ✓ | ✓ | | ✓ | **v1** | Product typography variants differ slightly |
| `empty-state` | | ✓ | | ✓ | **v1** | molexp uses entity `EmptyState` instead — unify later |
| `switch` | | ✓ | | | **v1** | Add to registry; molexp should adopt |
| `cn` / utils | ✓ | ✓ | ✓ | ✓ | **v0** | Single implementation |
| CSS tokens (`--color-*`, control radius) | ✓ | ✓ | ✓ | partial | **v0** | `registry:base` or `tokens` item |

## molexp-only candidates

| Item | Decision | Why |
|------|----------|-----|
| `card` | **v1** | Useful shell; Settings login already uses it |
| `table` | **v1** | Dense scientific tables — share once tokens settle |
| `sheet` | **v1** | Mobile/nav patterns |
| `skeleton` | **v1** | Loading language |
| `textarea` | **v1** | Forms |
| `alert-dialog` | **v1** | Destructive confirm |
| `command` | **v2** | Command palette; couples to product search |
| `accordion` / `collapsible` | **v1** | General layout |
| `context-menu` | **v1** | Tree menus |
| `toast` | **v2** | Wire often product-specific (provider placement) |
| `confirm-dialog` | **stay** | molexp wrapper around alert-dialog + app confirm bus |
| `tree` | **stay** | FS explorer semantics, not primitive |
| `markdown` / `thinking-block` / `tool-call-row` | **stay** | Agent chrome |
| `progress-spinner` | **v1** → merge with status motion | Prefer tokenized status spinner |

## Product blocks (not raw shadcn)

| Item | Source | Decision | Why |
|------|--------|----------|-----|
| `SettingsShell` / `SettingsSection` / `SettingsRow` | molexp | **v1 block** | Explicitly designed for multi-product settings; molvis has a near-clone |
| `WorkbenchAction` / `WorkbenchIconAction` | molexp | **v2 block** | Product action vocabulary; molvis has `ViewerAction` — **generalize later**, don’t force one name in v0 |
| `WorkbenchStatusStrip` / Heartbeat | molexp | **stay** (v2 reassess) | Couples to molexp status bus + remote cache API |
| `ViewerAction` / `ViewerToolbar` | molvis | **stay** | Viewer-domain chrome |
| Entity `Dashboard` / `EntityPage` | molexp | **stay** | Domain layout |
| `MolqRunTab` | molexp | **stay** | Product plugin |

## Explicit non-goals for extraction

- Domain pages, OpenAPI clients, agent conversation chrome  
- 3D/viewer pipeline UI  
- Full design-token unification of scientific status colors in v0 (v0 ships *structure* of tokens; full parity is v1)  
- Replacing molvis-plugin’s npm UI surface overnight (migrate sources, keep package API)

## Recommended pull order

1. **v0:** `cn` + token CSS + button, badge, input, label, tabs, tooltip, dialog, dropdown-menu, select, checkbox, separator, scroll-area, popover, slider  
2. **v1:** card, table, sheet, skeleton, textarea, alert-dialog, accordion, collapsible, context-menu, switch, empty-state, code, Settings\* blocks  
3. **v2:** Workbench/Viewer action vocabulary convergence, toast, command  

## Drift note (2026-08-10)

`button.tsx` class strings in molexp, molvis/page, and molvis/plugin are already nearly byte-identical (`rounded-control`, accent tokens). That makes **button the lowest-risk first extraction** and a canary for the registry pipeline.
