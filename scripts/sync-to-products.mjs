#!/usr/bin/env node
/**
 * Copy registry sources into sibling product apps (molexp / molvis).
 *
 * Usage (from molcrafts-ui root):
 *   node scripts/sync-to-products.mjs
 *
 * Expects sibling layout:
 *   molcrafts/
 *     molcrafts-ui/
 *     molexp/
 *     molvis/
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

const SHARED_UI = [
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

// page-owned: resizable (usePanelRef + layout API differs from molexp)
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

async function main() {
  // ── molexp ──────────────────────────────────────────────
  console.log("molexp");
  const molexpUi = path.join(molcrafts, "molexp/ui/src/components/ui");
  for (const name of SHARED_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(molexpUi, `${name}.tsx`));
  }
  await copy(path.join(srcLib, "utils.ts"), path.join(molcrafts, "molexp/ui/src/lib/utils.ts"));
  await copy(
    path.join(srcBlocks, "settings-shell.tsx"),
    path.join(molcrafts, "molexp/ui/src/components/settings/SettingsShell.tsx"),
  );
  await copy(
    path.join(srcBlocks, "settings-section.tsx"),
    path.join(molcrafts, "molexp/ui/src/components/settings/SettingsSection.tsx"),
  );
  // constitution CSS vendored for stable relative imports
  await copy(
    path.join(srcStyles, "constitution-base.css"),
    path.join(molcrafts, "molexp/ui/src/styles/constitution-base.css"),
  );
  await copy(
    path.join(srcStyles, "constitution-theme.css"),
    path.join(molcrafts, "molexp/ui/src/styles/constitution-theme.css"),
  );

  // ── molvis page ─────────────────────────────────────────
  console.log("molvis/page");
  const pageUi = path.join(molcrafts, "molvis/page/src/components/ui");
  for (const name of MOLVIS_PAGE_UI) {
    await copy(path.join(srcUi, `${name}.tsx`), path.join(pageUi, `${name}.tsx`));
  }
  await copy(path.join(srcLib, "utils.ts"), path.join(molcrafts, "molvis/page/src/lib/utils.ts"));
  await copy(
    path.join(srcStyles, "constitution-base.css"),
    path.join(molcrafts, "molvis/page/src/styles/constitution-base.css"),
  );
  await copy(
    path.join(srcStyles, "constitution-theme.css"),
    path.join(molcrafts, "molvis/page/src/styles/constitution-theme.css"),
  );

  // Settings block → layout (keep molvis path; source from registry)
  const section = await readFile(path.join(srcBlocks, "settings-section.tsx"), "utf8");
  await write(
    path.join(molcrafts, "molvis/page/src/ui/layout/SettingsSection.tsx"),
    section,
  );

  // ── molvis plugin ───────────────────────────────────────
  console.log("molvis/plugin");
  const pluginUi = path.join(molcrafts, "molvis/plugin/src/ui");
  for (const name of PLUGIN_UI) {
    let text = await readFile(path.join(srcUi, `${name}.tsx`), "utf8");
    text = text.replaceAll('from "@/lib/utils"', 'from "../utils"');
    await write(path.join(pluginUi, `${name}.tsx`), text);
  }
  // plugin cn stays self-contained (no host path); use registry utils body
  let utils = await readFile(path.join(srcLib, "utils.ts"), "utf8");
  utils =
    "/**\n * Constitution-aware cn — synced from molcrafts-ui.\n * Keep in sync via: molcrafts-ui `npm run sync:products`.\n */\n" +
    utils;
  await write(path.join(molcrafts, "molvis/plugin/src/utils.ts"), utils);

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
