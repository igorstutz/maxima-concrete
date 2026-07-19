// Analisa o dump do site_content: distribuição de _sectionType e formato dos campos.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const rows = JSON.parse(readFileSync(join(HERE, "site_content.json"), "utf8"));
const sections = JSON.parse(readFileSync(join(HERE, "custom_sections.json"), "utf8"));

const usedKeys = new Set(sections.map((s) => s.section_key));

const shape = (v, depth = 0) => {
  if (v === null) return "null";
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    return depth > 1 ? "array" : `array<${shape(v[0], depth + 1)}>`;
  }
  if (typeof v === "object") {
    if (depth > 1) return "object";
    return "{" + Object.keys(v).slice(0, 12).join(",") + "}";
  }
  if (typeof v === "string") return v.length > 80 ? "text" : "string";
  return typeof v;
};

const byType = {};
let noType = [];
for (const r of rows) {
  const c = r.content ?? {};
  const t = c._sectionType ?? "(sem _sectionType)";
  if (t === "(sem _sectionType)") noType.push(r.section_key);
  const entry = (byType[t] ??= { count: 0, exampleKey: r.section_key, fields: {} });
  entry.count++;
  for (const [k, v] of Object.entries(c)) {
    if (k === "_sectionType") continue;
    entry.fields[k] ??= shape(v);
  }
}

const summary = Object.fromEntries(
  Object.entries(byType).sort((a, b) => b[1].count - a[1].count)
);
writeFileSync(join(HERE, "section-types.json"), JSON.stringify(summary, null, 2));

// linhas do site_content que não estão em nenhuma página (órfãs) e vice-versa
const contentKeys = new Set(rows.map((r) => r.section_key));
const missing = [...usedKeys].filter((k) => !contentKeys.has(k));
writeFileSync(
  join(HERE, "keys-report.json"),
  JSON.stringify(
    {
      totalContent: rows.length,
      totalUsedInPages: usedKeys.size,
      semSectionType: noType,
      usadasSemConteudo: missing,
    },
    null,
    2
  )
);

console.log(`tipos de seção: ${Object.keys(summary).length}`);
for (const [t, e] of Object.entries(summary)) console.log(`  ${e.count}\t${t}`);
console.log(`sem _sectionType: ${noType.length}; usadas sem conteúdo: ${missing.length}`);
