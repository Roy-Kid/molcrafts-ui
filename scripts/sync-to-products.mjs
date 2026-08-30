#!/usr/bin/env node
/**
 * Copy registry sources into sibling product apps (molexp / molvis / molhub).
 *
 * Usage (from molcrafts-ui root):
 *   node scripts/sync-to-products.mjs
 *
 * Expects sibling layout:
 *   molcrafts/
 *     molcrafts-ui/
 *     molexp/
 *     molvis/
 *     molhub/
 */

import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const molcrafts = path.resolve(root, "..");
const srcUi = path.join(root, "src/components/ui");
const srcBlocks = path.join(root, "src/components/blocks");
const srcLib = path.join(root, "src/lib");
const srcStyles = path.join(root, "src/styles");

/** Full workbench set (molexp). */
const MOLEXP_UI = [
  "accordion",
  "alert-dialog",
  "badge",
  "button",
  "card",
  "checkbox",
  "code",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "empty-state",
  "input",
  "label",
  "number-field",
  "popover",
  "progress-spinner",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "switch",
  "table",
  "tabs",
  "textarea",
  "tooltip",
];

/** molvis page — resizable stays page-owned (usePanelRef API). */
const MOLVIS_PAGE_UI = [
  "badge",
  "button",
  "checkbox",
  "code",
  "dialog",
  "dropdown-menu",
  "empty-state",
  "input",
  "label",
  "number-field",
  "popover",
  "scroll-area",
  "select",
  "separator",
  "slider",
  "switch",
  "tabs",
  "tooltip",
];

const PLUGIN_UI = ["button", "checkbox", "select"];

/**
 * molhub registry web — shared foundation only.
 * Product-owned: badge (BadgeTone domain vocabulary), input (search density),
 * tabs (line-default registry chrome). Everything else from the registry.
 */
const MOLHUB_UI = ["button", "code", "empty-state", "tooltip"];

async function copy(from, to) {
  await mkdir(path.dirname(to), { recursive: true });
  await copyFile(from, to);
  console.log("  →", path.relative(molcrafts, to));
}

async function write(to, content) {
  await mkdir(path.dirname(to), { recursive: true });
  await writeFile(to, content, "utf8");
  console.log("  →", path.relative(molcrafts, to));
}

async function vendorConstitution(productStylesDir) {
  await copy(
    path.join(srcStyles, "constitution-base.css"),
    path.join(productStylesDir, "constitution-base.css"),
  );
  await copy(
    path.join(srcStyles, "constitution-theme.css"),
    path.join(productStylesDir, "constitution-theme.css"),
  );
}

async function main() {
  // ── molexp (apps/web — monorepo workbench; was molexp/ui) ──
  console.log("molexp/apps/web");
  const molexpUi = path.join(molcrafts, "molexp/apps/web/src/components/ui");
  for (const name of MOLEXP_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(molexpUi, `${name}.tsx`));
  }
  await copy(
    path.join(srcLib, "utils.ts"),
    path.join(molcrafts, "molexp/apps/web/src/lib/utils.ts"),
  );
  await copy(
    path.join(srcBlocks, "settings-shell.tsx"),
    path.join(molcrafts, "molexp/apps/web/src/components/settings/SettingsShell.tsx"),
  );
  await copy(
    path.join(srcBlocks, "settings-section.tsx"),
    path.join(molcrafts, "molexp/apps/web/src/components/settings/SettingsSection.tsx"),
  );
  await vendorConstitution(path.join(molcrafts, "molexp/apps/web/src/styles"));

  // ── molvis page ─────────────────────────────────────────
  console.log("molvis/page");
  const pageUi = path.join(molcrafts, "molvis/page/src/components/ui");
  for (const name of MOLVIS_PAGE_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(pageUi, `${name}.tsx`));
  }
  await copy(path.join(srcLib, "utils.ts"), path.join(molcrafts, "molvis/page/src/lib/utils.ts"));
  await vendorConstitution(path.join(molcrafts, "molvis/page/src/styles"));
  const section = await readFile(path.join(srcBlocks, "settings-section.tsx"), "utf8");
  await write(path.join(molcrafts, "molvis/page/src/ui/layout/SettingsSection.tsx"), section);
  // Edge rail (bottom pull-up / future L-R). molvis already has usePointerDrag.
  let edgePanel = await readFile(path.join(srcBlocks, "edge-panel.tsx"), "utf8");
  edgePanel = edgePanel.replaceAll(
    'from "@/hooks/use-pointer-drag"',
    'from "@/hooks/usePointerDrag"',
  );
  await write(
    path.join(molcrafts, "molvis/page/src/components/viewer/EdgePanel.tsx"),
    edgePanel,
  );

  // ── molvis plugin ───────────────────────────────────────
  console.log("molvis/plugin");
  const pluginUi = path.join(molcrafts, "molvis/plugin/src/ui");
  for (const name of PLUGIN_UI) {
    let text = await readFile(path.join(srcUi, `${name}.tsx`), "utf8");
    text = text.replaceAll('from "@/lib/utils"', 'from "../utils"');
    await write(path.join(pluginUi, `${name}.tsx`), text);
  }
  let utils = await readFile(path.join(srcLib, "utils.ts"), "utf8");
  utils =
    "/**\n * Constitution-aware cn — synced from molcrafts-ui.\n * Keep in sync via: molcrafts-ui `npm run sync:products`.\n */\n" +
    utils;
  await write(path.join(molcrafts, "molvis/plugin/src/utils.ts"), utils);

  // ── molhub web ──────────────────────────────────────────
  console.log("molhub/apps/web");
  const hubUi = path.join(molcrafts, "molhub/apps/web/app/src/components/ui");
  for (const name of MOLHUB_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(hubUi, `${name}.tsx`));
  }
  await copy(
    path.join(srcLib, "utils.ts"),
    path.join(molcrafts, "molhub/apps/web/app/src/lib/utils.ts"),
  );
  await vendorConstitution(path.join(molcrafts, "molhub/apps/web/app/src/styles"));

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
