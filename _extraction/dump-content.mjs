// Extrai todo o conteúdo ao vivo do CMS (Supabase) do site atual da Maxima Concrete.
// Gera: site_content.json, custom_sections.json e um resumo por página.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const URL_BASE = "https://hehehpxwazvtvattiyxl.supabase.co/rest/v1";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaGVocHh3YXp2dHZhdHRpeXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwOTE1NTYsImV4cCI6MjA4MTY2NzU1Nn0.IEGXAshqXIoTakf7D0IhgVlh1vw4dHpK9Si3oeA3SI8";

const HEADERS = { apikey: ANON, Authorization: `Bearer ${ANON}` };
const OUT = dirname(fileURLToPath(import.meta.url));

async function fetchAll(table, select, order) {
  const rows = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const res = await fetch(
      `${URL_BASE}/${table}?select=${select}&order=${order}`,
      { headers: { ...HEADERS, Range: `${from}-${from + page - 1}` } }
    );
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`);
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < page) break;
  }
  return rows;
}

const siteContent = await fetchAll("site_content", "section_key,content,updated_at", "section_key.asc");
const customSections = await fetchAll("custom_sections", "page_key,section_key,section_label,position", "page_key.asc,position.asc");

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "site_content.json"), JSON.stringify(siteContent, null, 2));
writeFileSync(join(OUT, "custom_sections.json"), JSON.stringify(customSections, null, 2));

// Resumo: seções por página, na ordem
const byPage = {};
for (const r of customSections) {
  (byPage[r.page_key] ??= []).push(`${r.position}. ${r.section_key} (${r.section_label ?? ""})`);
}
writeFileSync(join(OUT, "pages-summary.json"), JSON.stringify(byPage, null, 2));

// Inventário de imagens referenciadas no conteúdo
const imgs = new Set();
const walk = (v) => {
  if (typeof v === "string") {
    for (const m of v.matchAll(/https?:\/\/[^\s"')]+?\.(?:png|jpe?g|webp|avif|gif|svg|mp4|webm)/gi)) imgs.add(m[0]);
  } else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === "object") Object.values(v).forEach(walk);
};
walk(siteContent);
writeFileSync(join(OUT, "image-urls.txt"), [...imgs].sort().join("\n"));

console.log(`site_content: ${siteContent.length} linhas`);
console.log(`custom_sections: ${customSections.length} linhas (${Object.keys(byPage).length} páginas)`);
console.log(`imagens/vídeos referenciados: ${imgs.size}`);
