// Confere se todo `type` usado em src/content/pages/*.json tem componente no registry.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PAGES = join(ROOT, "src", "content", "pages");
const REGISTRY = join(ROOT, "src", "components", "sections", "registry.tsx");

const registrySrc = readFileSync(REGISTRY, "utf8");
const body = registrySrc.slice(registrySrc.indexOf("SECTION_REGISTRY"));
const keys = new Set(
  [...body.matchAll(/^\s+(?:"([^"]+)"|([a-zA-Z][\w-]*)):\s/gm)].map((m) => m[1] ?? m[2])
);
const SKIP = new Set(["footer", "explorer"]);

const missing = new Map();
for (const file of readdirSync(PAGES)) {
  const page = JSON.parse(readFileSync(join(PAGES, file), "utf8"));
  for (const s of page.sections) {
    if (SKIP.has(s.type) || keys.has(s.type)) continue;
    if (!missing.has(s.type)) missing.set(s.type, []);
    missing.get(s.type).push(`${page.pageKey}:${s.key}`);
  }
}

if (missing.size === 0) {
  console.log(`OK — todos os tipos cobertos (${keys.size} no registry).`);
} else {
  console.log("TIPOS SEM COMPONENTE:");
  for (const [t, uses] of missing) console.log(`  ${t} → ${uses.join(", ")}`);
  process.exitCode = 1;
}
