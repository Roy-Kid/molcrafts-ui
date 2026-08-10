#!/usr/bin/env node
/**
 * Minimal registry builder (v0).
 *
 * Emits public/r/{name}.json for each item in registry.json plus a flattened
 * public/r/registry.json catalog. Compatible enough for local `shadcn add`
 * experiments; can be replaced by `npx shadcn@latest build` when ready.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "r");

const registry = JSON.parse(await readFile(path.join(root, "registry.json"), "utf8"));

await mkdir(outDir, { recursive: true });

const built = [];

for (const item of registry.items ?? []) {
  const files = [];
  for (const f of item.files ?? []) {
    const abs = path.join(root, f.path);
    const content = await readFile(abs, "utf8");
    files.push({
      path: f.path,
      type: f.type ?? item.type,
      content,
    });
  }

  const payload = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
  };

  const outPath = path.join(outDir, `${item.name}.json`);
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  built.push({ name: item.name, type: item.type, title: item.title });
  console.log("wrote", path.relative(root, outPath));
}

const catalog = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: registry.name,
  homepage: registry.homepage,
  items: built.map((b) => ({
    name: b.name,
    type: b.type,
    title: b.title,
  })),
};

await writeFile(path.join(outDir, "registry.json"), JSON.stringify(catalog, null, 2) + "\n", "utf8");
console.log("wrote public/r/registry.json (", built.length, "items )");
