# Extraction matrix — what lives in molcrafts-ui

Inventory date: 2026-08-10. Sources: `molexp/ui`, `molvis/page`, `molvis/plugin`, `molhub/apps/web`.

## Legend

| Tag | Meaning |
|-----|---------|
| **shipped** | In registry (`public/r/*.json`) after one-shot migrate |
| **v2** | Later product-pattern convergence |
| **stay** | Never share — product- or domain-specific |
| **plugin** | Keep on `@molcrafts/molvis/plugin` *package surface*; source may already be here |

---

## Evaluation: CSS — can it be extracted?

**Yes, partially — constitution only. Not the full product `tailwind.css`.**

Both molexp and molvis already document the same split in their CSS headers:

> Products share the MolCrafts visual **constitution** (type scale, spacing, radius, status vocabulary, motion) — never this **palette**.

| Layer | Extract? | Where |
|-------|----------|--------|
| Type scale (`text-micro` … `text-display`) | **Yes** | `tokens` registry item |
| Radius roles (`control` / `panel` / `overlay` / `checkbox`) | **Yes** | `tokens` |
| Control geometry (`h-control`, toolbar, dialog-sm/md, …) | **Yes** (shared names) | `tokens` |
| Motion tokens + ease | **Yes** | `tokens` |
| Status **roles** (`--status-running`, soft/foreground ramps) | **Yes** (shared values OK) | `tokens` |
| Semantic color **slots** (`--background`, `--accent`, …) | **Yes** as slot names + neutral scaffold | `tokens` |
| Product brand palette (`--molexp-*` violet, `--molvis-*` teal) | **No** | product `tailwind.css` |
| Product surface naming (`surface` vs `panel` / `canvas`) | **No** (map into slots) | product |
| Diff colors, chart geometry, scientific animations | **No** | product |
| Full `@import "tailwindcss"` app stylesheet | **No** | product entry CSS |

**Ship shape:** `src/styles/tokens.css` = constitution. Products rebind `--accent` / surfaces to brand, keep product-only extras.

**`cn` companion:** `utils` uses `extendTailwindMerge` so `text-body` / `rounded-control` / `h-control` merge correctly (molvis already had this; molexp did not — shared source fixes both).

---

## Evaluation: plugin “cell” — can it be extracted?

**There is no `Cell` component in molvis plugin.**

`molvis/plugin/src/ui/` exports only three primitives:

| File | Role | Extract? |
|------|------|----------|
| `button.tsx` | Control button | **Yes** → registry `button` (same canary as apps) |
| `checkbox.tsx` | Checkbox | **Yes** → registry `checkbox` |
| `select.tsx` | Select | **Yes** → registry `select` |

Public package API (`@molcrafts/molvis/plugin/ui`) **stays** as the plugin runtime surface so plugins keep a stable import path and peer deps. Longer term: plugin package is **built from** or **re-exports** registry sources — not a second design system.

| Name that might mean “cell” | Decision |
|-----------------------------|----------|
| Plugin UI trio (button/checkbox/select) | **shipped** here; plugin package rewires later |
| `TableCell` / table primitives | **shipped** as part of `table` (not a separate plugin cell) |
| Viewer grid / structure “cell” chrome | **stay** — domain, not shadcn |

`contract_tokens.ts` stays in plugin (runtime CSS-var contract for embed hosts).

---

## Registry inventory (shipped this migrate)

### Foundation

| Item | Type | Notes |
|------|------|-------|
| `utils` | lib | constitution-aware `cn` |
| `tokens` | style | CSS constitution |

### Primitives (30)

`button` · `badge` · `input` · `label` · `tabs` · `tooltip` · `dialog` · `dropdown-menu` · `select` · `checkbox` · `separator` · `scroll-area` · `popover` · `slider` · `card` · `table` · `sheet` · `skeleton` · `textarea` · `alert-dialog` · `accordion` · `collapsible` · `context-menu` · `switch` · `empty-state` · `code` · `number-field` · `progress-spinner` · `resizable` · `command`

Sources: molexp `components/ui/*` primary; molvis-only adds `switch`, `empty-state`, `number-field`.

### Blocks (2)

| Item | Notes |
|------|-------|
| `settings-section` | `SettingsSection` + `SettingsRow` |
| `settings-shell` | left-nav settings shell |

---

## Explicit non-goals (stay in products)

| Item | Why |
|------|-----|
| `confirm-dialog` | molexp confirm bus wrapper |
| `tree` | FS explorer semantics |
| `markdown` / `thinking-block` / `tool-call-row` | agent chrome |
| `toast` | molexp status-bar façade → `reportStatus` |
| `WorkbenchAction` / `ViewerAction` | product action vocabulary (v2 converge) |
| Entity / dashboard / molq pages | domain |
| 3D / viewer pipeline UI | domain |
| Product brand palettes | brand identity |

---

## Product rewire (done 2026-08-10)

1. **components.json** — molexp/ui, molvis/page, molvis/plugin register `@molcrafts` → `file:../../../molcrafts-ui/public/r/{name}.json`
2. **Sources synced** via `npm run sync:products` (registry → product local files; products still own the tree)
3. **CSS** — products import vendored `constitution-theme.css` + `constitution-base.css`; brand palette stays product-local
4. **molvis plugin** — button/checkbox/select + utils synced; package export path unchanged
5. **Stay product-owned** — molexp confirm-dialog/tree/markdown/toast/…; molvis page `resizable` (different panel API)

Re-sync after registry edits:

```bash
cd ~/work/molcrafts/molcrafts-ui && npm run build:registry && npm run sync:products
```

---

## Drift note

`button` / `checkbox` / `select` still **byte-differ** across molexp, molvis/page, and molvis/plugin (import path / radix package style). Registry sources are **molexp-primary** (unified `radix-ui` package where molexp already used it; classic `@radix-ui/*` where molexp used that). First product rewire should treat registry as truth and drop local forks.
