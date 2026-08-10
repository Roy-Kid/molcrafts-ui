---
mol_project:
  name: molcrafts-ui
  language: typescript
  stage: experimental
  specs_path: .claude/specs/
  notes_path: .claude/notes/
  build:
    install: "pnpm install || npm install"
    check: "pnpm typecheck || npm run typecheck"
    test: "pnpm build:registry || npm run build:registry"
  doc:
    style: google
---

# molcrafts-ui

Shared **shadcn registry source** for MolCrafts products (molexp, molvis, molhub).

- Spec: `.claude/specs/molcrafts-ui-registry-01.md`
- Extraction matrix: `docs/extraction-matrix.md`
- Build registry: `pnpm build:registry` → `public/r/`

Do not put product-domain UI (entity dashboards, viewer chrome, agent conversation) here.
