// Extrai as tabelas auxiliares: projects (mapa), service_areas (cidades), google_reviews.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const URL_BASE = "https://hehehpxwazvtvattiyxl.supabase.co/rest/v1";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaGVocHh3YXp2dHZhdHRpeXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwOTE1NTYsImV4cCI6MjA4MTY2NzU1Nn0.IEGXAshqXIoTakf7D0IhgVlh1vw4dHpK9Si3oeA3SI8";
const HEADERS = { apikey: ANON, Authorization: `Bearer ${ANON}` };
const OUT = dirname(fileURLToPath(import.meta.url));

async function dump(table, order) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${URL_BASE}/${table}?select=*${order ? `&order=${order}` : ""}`, {
      headers: { ...HEADERS, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) {
      console.log(`${table}: HTTP ${res.status} — ${(await res.text()).slice(0, 200)}`);
      return null;
    }
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < 1000) break;
  }
  writeFileSync(join(OUT, `${table}.json`), JSON.stringify(rows, null, 2));
  console.log(`${table}: ${rows.length} linhas`);
  return rows;
}

await dump("projects", "created_at.asc");
await dump("service_areas");
await dump("google_reviews");
await dump("google_business_config");
