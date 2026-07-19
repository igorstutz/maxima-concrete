// Converte o dump do Supabase (site_content + custom_sections) em arquivos
// src/content/pages/<page>.json no modelo Maxima Pools:
//   { "pageKey": "...", "sections": [{ key, label, type, content }] }
// - `type` é o tipo canônico do layout (lógica do CustomSection original:
//   match exato OU sufixo depois de "-sec-", com normalização legada "-page-").
// - URLs de imagem do Supabase storage/externas são reescritas para /images/...
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT_DIR = join(ROOT, "src", "content", "pages");

const siteContent = JSON.parse(readFileSync(join(HERE, "site_content.json"), "utf8"));
const customSections = JSON.parse(readFileSync(join(HERE, "custom_sections.json"), "utf8"));
const urlMap = JSON.parse(readFileSync(join(HERE, "url-map.json"), "utf8"));

const contentByKey = new Map(siteContent.map((r) => [r.section_key, r.content ?? {}]));

// --- normalização de tipo (portada de src/lib/sectionType.ts + CustomSection.tsx) ---
const LEGACY_PREFIXES = [
  "driveways","patios","footers","sportscourts","sidewalks","garagefloors",
  "steps","curbsgutters","approaches","basementfloors","retainingwalls",
  "seatingwalls","firepits","fireplaces","outdoorliving","outdoorlighting",
  "outdoorkitchens","shelters",
];
const EXACT_TYPES = new Set([
  "hero","why-maxima","services","gallery","pool-decks","driveways","patios",
  "outdoor-living","recent-projects","contact","instagram","reviews","faq",
  "find-work","trust-global","city-hero","city-approach",
  "joinourteam-sec-intro","joinourteam-sec-benefits",
  "joinourteam-sec-positions","joinourteam-sec-final-cta",
]);

function normalizeLegacy(raw) {
  if (raw.startsWith("gallery-page-")) return raw.replace("gallery-page-", "gallery_page-sec-");
  for (const p of LEGACY_PREFIXES) {
    if (raw.startsWith(`${p}-page-`)) return raw.replace(`${p}-page-`, `${p}-sec-`);
  }
  return raw;
}

function canonicalType(rawType, sectionKey, pageKey) {
  if (rawType && typeof rawType === "string") {
    const norm = normalizeLegacy(rawType);
    if (EXACT_TYPES.has(norm)) return norm;
    const m = norm.match(/-sec-(.+)$/);
    // "why-maxima" via sufixo é um layout DIFERENTE do exato (home) — desambigua.
    if (m) return m[1] === "why-maxima" ? "why-maxima-service" : m[1];
    return norm;
  }
  // Sem _sectionType: seções fixas legadas (componentes por chave no site antigo).
  // Home usa a própria section_key (hero, why_maxima, services, ...).
  if (pageKey === "home") return sectionKey.replaceAll("_", "-");
  // Padrão "<pageKey>_<nome>" das seções seedadas (ex.: commercial_page_hero).
  const ownedByPage = sectionKey.startsWith(`${pageKey}_`);
  let derived = ownedByPage
    ? sectionKey.slice(pageKey.length + 1).replaceAll("_", "-")
    : sectionKey.replaceAll("_", "-");
  // Chaves com "-sec-" embutido (ex.: driveways_sec_final_cta) → sufixo.
  const emb = derived.match(/-sec-(.+)$/);
  if (emb) derived = emb[1];
  // Página comercial tinha componentes próprios — mantém a família distinta
  // (apenas para as seções da própria página; find_work/trust_global são globais).
  if (pageKey === "commercial_page" && ownedByPage) return `commercial-${derived}`;
  // Fora da home, o layout "why maxima" é o de página de serviço.
  if (derived === "why-maxima") return "why-maxima-service";
  return derived;
}

// --- reescrita de URLs para caminhos locais ---
let rewritten = 0;
let unmapped = new Set();
const rewriteUrls = (v) => {
  if (typeof v === "string") {
    return v.replace(
      /https?:\/\/[^\s"')]+?\.(?:png|jpe?g|webp|avif|gif|svg|mp4|webm)/gi,
      (url) => {
        if (urlMap[url]) { rewritten++; return urlMap[url]; }
        unmapped.add(url);
        return url;
      }
    );
  }
  if (Array.isArray(v)) return v.map(rewriteUrls);
  if (v && typeof v === "object")
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, rewriteUrls(x)]));
  return v;
};

// --- montagem por página ---
const byPage = new Map();
for (const row of customSections) {
  if (!byPage.has(row.page_key)) byPage.set(row.page_key, []);
  byPage.get(row.page_key).push(row);
}

mkdirSync(OUT_DIR, { recursive: true });
const typeCount = {};
for (const [pageKey, rows] of byPage) {
  rows.sort((a, b) => a.position - b.position);
  const sections = rows.map((r) => {
    const raw = contentByKey.get(r.section_key) ?? {};
    const { _sectionType, ...rest } = raw;
    const type = canonicalType(_sectionType, r.section_key, pageKey);
    typeCount[type] = (typeCount[type] ?? 0) + 1;
    return {
      key: r.section_key,
      label: r.section_label ?? "",
      type,
      content: rewriteUrls(rest),
    };
  });
  writeFileSync(
    join(OUT_DIR, `${pageKey}.json`),
    JSON.stringify({ pageKey, sections }, null, 2)
  );
}

// conteúdo não vinculado a páginas (ex.: footer, configs globais)
const usedKeys = new Set(customSections.map((r) => r.section_key));
const orphans = siteContent.filter((r) => !usedKeys.has(r.section_key));
writeFileSync(
  join(HERE, "orphan-content.json"),
  JSON.stringify(
    orphans.map((r) => ({ key: r.section_key, content: rewriteUrls(r.content) })),
    null, 2
  )
);

writeFileSync(join(HERE, "canonical-types.json"), JSON.stringify(
  Object.fromEntries(Object.entries(typeCount).sort((a, b) => b[1] - a[1])), null, 2
));

console.log(`páginas geradas: ${byPage.size}`);
console.log(`tipos canônicos distintos: ${Object.keys(typeCount).length}`);
console.log(`URLs reescritas: ${rewritten}; sem mapeamento: ${unmapped.size}`);
console.log(`conteúdo órfão (fora de páginas): ${orphans.length}`);
if (unmapped.size) writeFileSync(join(HERE, "unmapped-urls.txt"), [...unmapped].join("\n"));
