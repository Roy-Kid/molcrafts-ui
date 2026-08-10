# Acceptance — molcrafts-ui-registry-01

Binding “done” contract for the shared registry scaffold and v0 readiness.

| id | type | criterion | verify |
|----|------|-----------|--------|
| AC-001 | structural | Repo exists at `~/work/molcrafts/molcrafts-ui` with git, README, `registry.json`, `components.json`, `src/lib/utils.ts`, `src/styles/tokens.css` | path + file list |
| AC-002 | structural | `docs/extraction-matrix.md` lists every molexp∩molvis primitive with v0/v1/v2/stay | doc review |
| AC-003 | build | `pnpm build:registry` (or `npm run build:registry`) writes `public/r/registry.json` and at least `public/r/button.json` | command exit 0 + files |
| AC-004 | schema | Each built item JSON has `name`, `type`, `files` (non-empty) | script or manual jq |
| AC-005 | canary | `button` source lives under `src/components/ui/button.tsx` and is referenced by registry | path + registry item |
| AC-006 | tokens | `tokens.css` defines background/foreground/accent/border/ring (or documented aliases) | file content |
| AC-007 | consumer-doc | README documents `registries.molcrafts` snippet for product apps | README section |
| AC-008 | scope | Acceptance does **not** require molexp/molvis/molhub PRs merged | process |
| AC-009 | type:unit | Optional: `cn()` merges classes without throwing | node/rstest if present |
| AC-010 | type:docs | Extraction matrix marks agent-only and viewer-only as **stay** | doc review |

## Non-criteria (explicitly not required)

- Full v0 batch of all 15 primitives landed in one PR  
- Hosted production URL live  
- molvis-plugin rewritten to import from this package  
- Visual regression screenshots  

## Done when

AC-001–AC-008 pass. AC-009 optional. AC-010 required with AC-002.
