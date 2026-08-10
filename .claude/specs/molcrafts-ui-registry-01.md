---
slug: molcrafts-ui-registry-01
title: MolCrafts shared shadcn registry (molcrafts-ui)
status: approved
created: 2026-08-10
product: molcrafts-ui
language: zh
---

# molcrafts-ui-registry-01 — 跨产品 shadcn Registry

## Summary

在 `~/work/molcrafts/molcrafts-ui` 建立 **MolCrafts 共享 UI 源仓 + shadcn Registry**，使 **molexp / molvis / molhub** 用同一套 tokens 与 primitives 维护方式：源码在此仓维护，`shadcn build` 产出 `/r/{name}.json`，各产品通过 `npx shadcn add @molcrafts/<name>` 安装到本地（产品仍拥有拷贝后的源码）。

本 spec 覆盖：仓库骨架、registry 契约、**抽取评估（见 docs/extraction-matrix.md）**、v0 组件清单与产品接入步骤。不包含把三端全部迁完的大爆炸重构。

## Domain basis

- shadcn 官方模型：CLI 拷贝源码，不是唯一 npm 黑盒依赖。跨仓共享的官方方式是 **Custom Registry**（[Introduction](https://ui.shadcn.com/docs/registry)、[Getting Started](https://ui.shadcn.com/docs/registry/getting-started)、[Namespaces](https://ui.shadcn.com/docs/registry/namespace)）。
- MolCrafts 现状：三端各自 `components/ui/*` fork；molvis 另有 `@molcrafts/molvis/plugin/ui` npm 面（插件 runtime 边界）。button 类名已高度同构（`rounded-control` / accent tokens），适合作为 canary。
- 科学产品 UI 额外约束：status 色、control 高度、信息密度（见 molexp/molvis 的 `tailwind` token 约定）必须进 **shared tokens**，否则 primitives 共享无效。

## Design

### 1. 仓库职责

| 路径 | 职责 |
|------|------|
| `registry.json` | Registry 目录（name / homepage / items） |
| `src/components/ui/*` | 权威 primitive 源码 |
| `src/components/blocks/*` | 跨产品块（SettingsShell 等，v1） |
| `src/lib/utils.ts` | `cn()` |
| `src/styles/tokens.css` | CSS 变量 / 控制尺寸 token |
| `public/r/` | `shadcn build` 输出（可部署静态站） |
| `docs/extraction-matrix.md` | 抽取评估（living doc） |
| `.claude/specs/*` | 本设计与验收 |

可选后续：`packages/ui` npm 发布 **tokens + cn** 给 plugin runtime；**不以 npm 作为产品 app 的主分发路径**。

### 2. 分发与消费

```
molcrafts-ui (source)
    shadcn build → public/r/*.json
         │
         ├─ molexp/ui   components.json registries.molcrafts
         ├─ molvis/page components.json registries.molcrafts
         └─ molhub/web  components.json registries.molcrafts
```

各产品：

```json
"registries": {
  "molcrafts": { "url": "https://ui.molcrafts.dev/r/{name}.json" }
}
```

开发期可用 `file:` / `localhost` / GitHub raw。

### 3. 抽取原则（Reuse decision）

对 inventory 中每个候选：

| 判定 | 条件 |
|------|------|
| **extract** | ≥2 产品使用，或明确将成为设计系统一部分；无领域 API |
| **later** | 有用但依赖重 / 变体未收敛 |
| **stay** | 绑定单一产品领域、路由、OpenAPI、agent/viewer 专用 |

**Reuse 结论（摘要）** — 全表见 `docs/extraction-matrix.md`：

- **v0 extract：** cn + tokens + button, badge, input, label, tabs, tooltip, dialog, dropdown-menu, select, checkbox, separator, scroll-area, popover, slider  
- **v1：** card, table, sheet, skeleton, textarea, alert-dialog, accordion, collapsible, context-menu, switch, empty-state, code, **SettingsShell/Section/Row**  
- **v2：** WorkbenchAction ↔ ViewerAction 收敛、toast、command  
- **stay：** tree, markdown, thinking-block, tool-call-row, confirm-dialog 总线、Entity/Dashboard、Molq\*、Viewer\* 工具条、StatusStrip（先留 molexp）

### 4. 与 molvis-plugin 的关系

- **短期：** plugin 继续 export `@molcrafts/molvis/plugin/ui`（打包 externals 不变）。  
- **中期：** plugin 内 button/select/checkbox **改为从本 registry 同源**（拷贝或 build 脚本同步），避免两套源。  
- **禁止：** 把 SettingsShell 塞进 molvis-plugin（SDK 边界污染）。

### 5. Token 策略

v0 建立统一 token 文件（命名对齐现有 molexp/molvis）：

- surfaces: `background`, `foreground`, `card`, `muted`, `accent`, `border`, `ring`  
- control: `--radius-control`, `--height-control*`（或现有 `h-control` 映射）  
- status: `status-running|succeeded|failed|warning`（v0 可先占位，v1 与三端色值对齐）

产品 CSS `@import` registry tokens，再叠产品专用变量。

### 6. 版本与变更

- Registry item 变更：源仓 PR + build；消费方 `shadcn add @molcrafts/<name> --overwrite` 或 CI 同步 job。  
- 不保证 semver 对“拷贝源码”的二进制兼容；用 **changelog + item 描述** 沟通 breaking。  
- 源仓 git tag 可选标记 registry 发布点。

## Files（仓库骨架）

```
molcrafts-ui/
  README.md
  package.json
  components.json                 # 源仓自身 shadcn 配置
  registry.json                   # 入口 catalog
  src/
    components/ui/                # v0 primitives（逐步填入）
    components/blocks/            # v1+
    lib/utils.ts
    styles/tokens.css
  public/r/                       # build 输出（可 gitignore 或提交）
  scripts/build-registry.mjs
  docs/extraction-matrix.md
  .claude/specs/
    molcrafts-ui-registry-01.md
    molcrafts-ui-registry-01.acceptance.md
  .gitignore
```

## Tasks

1. **Scaffold** 仓库：package.json、components.json、tokens.css、cn、gitignore、README  
2. **Registry catalog** 写 `registry.json`（v0 items 列表，文件可先 stub 或从 molexp 拷 button canary）  
3. **Build pipeline** `pnpm build:registry` → `public/r/{name}.json` + root catalog  
4. **Canary extract** 从 molexp 拷入 `button` + `utils`，build 成功，本地 `shadcn add` dry-run  
5. **v0 batch** 按 extraction-matrix 拉齐 intersection primitives（实现可分多 PR）  
6. **Consumer wiring doc** 文档：molexp / molvis / molhub 的 `components.json` 片段与迁移清单  
7. **molvis-plugin sync plan** 文档：如何从本仓同步 plugin ui 三件套（不强制本 spec 内改 molvis）

## Testing

- `pnpm build:registry` 退出 0；`public/r/button.json` 存在且符合 registry-item schema 关键字段  
- `registry.json` items 与 `public/r` 一一对应（脚本 assert）  
- Canary：临时目录 `shadcn add` 从 `file://` 或 localhost 安装 button 成功  
- 单元：`cn()` 简单用例（可选）  
- 不要求三产品 e2e 在本仓运行

## Out of scope

- 一次迁完所有 molexp-only / molvis-only 组件  
- 强制删除各产品本地 `components/ui`  
- 设计 Figma 文件  
- 强制 npm 发布 `@molcrafts/ui` 作为主路径  
- molhub/molvis 代码改动（仅文档约定；实际接线另开产品 PR）  
- `ui/.screenshots` 等本地资产

## Open questions（非阻塞）

- 托管域名：`ui.molcrafts.dev` vs GitHub Pages vs Cloudflare  
- `public/r` 是否提交 git（小团队可提交；CI 生成亦可）  
- Workbench vs Viewer 命名收敛时间表（v2）
