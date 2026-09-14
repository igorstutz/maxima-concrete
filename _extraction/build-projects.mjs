// Planilha do mapa -> src/content/data/projects.json (os pinos do mapa).
//
// Fonte: _extraction/project-map.xlsx
//   A  WORK FULL ADDRESS  endereço com número — usado só para geocodificar aqui.
//   B  WORK ADDRESS       rua sem número — é o que o pino mostra.
//   C  WORK DONE          serviços feitos na obra — título do pino.
//
// A coluna A NÃO entra no JSON gerado: esse arquivo é importado pelos componentes
// do mapa, ou seja, chega inteiro ao navegador. Guardar o número da casa ali
// entregaria o endereço de ~2.600 clientes a quem abrisse as ferramentas do
// desenvolvedor. A planilha já vem sem número na coluna B exatamente por isso.
//
// Coordenadas: geocodificador do US Census em lote (fonte oficial de logradouro
// americano, devolve o ZIP junto), com a base já geocodificada do CMS antigo e o
// Nominatim como reserva para o punhado que sobra. O resultado fica em
// geocode-cache.json, versionado com as chaves em hash — assim uma planilha nova
// só geocodifica os endereços inéditos.
//
// Uso:
//   node _extraction/build-projects.mjs                 (geocodifica o que faltar)
//   node _extraction/build-projects.mjs --dry-run       (não escreve nada, só relata)
//   node _extraction/build-projects.mjs --offline       (só cache + base antiga)
//   node _extraction/build-projects.mjs --retry-failed  (tenta de novo quem falhou)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readSheet } from "./xlsx.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const XLSX = join(HERE, "project-map.xlsx");
const CACHE_FILE = join(HERE, "geocode-cache.json");
const LEGACY_FILE = join(HERE, "projects.json");
const OUT_FILE = join(ROOT, "src", "content", "data", "projects.json");

const DRY_RUN = process.argv.includes("--dry-run");
const OFFLINE = process.argv.includes("--offline");
const RETRY_FAILED = process.argv.includes("--retry-failed");

// Ohio inteiro, com folga. A geocodificação erra feio quando o endereço está
// incompleto ("Main Street" existe em todo estado) — fora desta caixa, descarta.
const OHIO_BOX = { minLat: 38.2, maxLat: 42.4, minLng: -85.2, maxLng: -80.3 };
const inOhio = (lat, lng) =>
  lat >= OHIO_BOX.minLat && lat <= OHIO_BOX.maxLat &&
  lng >= OHIO_BOX.minLng && lng <= OHIO_BOX.maxLng;

// --- normalização -----------------------------------------------------------

const SUFFIXES = {
  st: "street", str: "street", rd: "road", dr: "drive", ave: "avenue", av: "avenue",
  ct: "court", cir: "circle", ln: "lane", blvd: "boulevard", pl: "place",
  pkwy: "parkway", ter: "terrace", trl: "trail", hwy: "highway", sq: "square",
};

/** Espaços colapsados, sem tabulação e sem o sufixo de país (a planilha mistura USA/EUA). */
const tidy = (s) =>
  String(s ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[,\s]+(USA|EUA|United States)\.?$/i, "")
    .replace(/\bOhio\b/g, "OH")
    .trim()
    .replace(/,$/, "");

// Sufixos de via por extenso, para consertar os endereços digitados sem vírgula.
const SUFFIX_WORDS =
  "Street|Road|Drive|Avenue|Court|Lane|Boulevard|Place|Circle|Parkway|Terrace|" +
  "Trail|Highway|Square|Way|Loop|Run|Crossing|Pike|Row|Path|Bend|Ridge|Point|Park";

// O que vem depois do sufixo tem de ser "Cidade, OH" para a vírgula ser inserida.
// Sem essa trava, "Norwell Drive East, Upper Arlington" virava "Norwell Drive,
// East, ..." e "Slate Run Dr" virava "Slate Run, Dr" — o sufixo faz parte do
// nome da rua muito mais vezes do que separa rua de cidade.
const CITY_TAIL = "(?=[A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*, ?OH\\b)";

/**
 * Rótulo do pino, a partir da coluna B. A planilha foi digitada à mão ao longo de
 * anos, então parte dos registros separa rua e cidade por ponto ou por nada
 * ("Sherwood Ave. Marysville", "Brianna Drive Blacklick"). Vira vírgula, senão o
 * pino mostra uma linha que não parece um endereço.
 */
function streetLabel(raw) {
  return tidy(raw)
    // "Sherwood Ave. Marysville, OH" -> "Sherwood Ave, Marysville, OH"
    .replace(new RegExp(`\\b([A-Z][A-Za-z]{0,6})\\.\\s+${CITY_TAIL}`, "g"), "$1, ")
    // "Brianna Drive Blacklick, OH" -> "Brianna Drive, Blacklick, OH"
    .replace(new RegExp(`\\b(${SUFFIX_WORDS})\\s+${CITY_TAIL}`, "g"), "$1, ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .trim()
    .replace(/^[a-z]/, (ch) => ch.toUpperCase());
}

/**
 * Chave de um endereço: normaliza (minúsculas, sem pontuação, sufixos por extenso,
 * sem ZIP) e resume em hash.
 *
 * O hash não é capricho: o cache de geocodificação é versionado, e o repositório é
 * público. Guardar "1328 hills-miller road delaware oh" como chave publicaria no
 * GitHub o endereço completo dos clientes — exatamente o que a planilha sem número
 * de casa existe para evitar. As coordenadas já são públicas no mapa; o texto do
 * endereço é que não pode ser.
 */
const addressKey = (s) => {
  const normalized = tidy(s)
    .toLowerCase()
    .replace(/\b\d{5}(-\d{4})?\b/g, " ")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => SUFFIXES[w] ?? w)
    .join(" ");
  return createHash("sha1").update(normalized).digest("hex").slice(0, 16);
};

// O último número de cinco dígitos: o ZIP vem no fim do endereço, e assim um
// número de casa com cinco dígitos nunca é confundido com ele.
const zipFrom = (s) => String(s ?? "").match(/\b4[0-9]{4}\b/g)?.pop() ?? "";

// --- 1. planilha ------------------------------------------------------------

const sheet = readSheet(XLSX);
const header = sheet[0] ?? {};
if (!/full address/i.test(header.A ?? "") || !/work done/i.test(header.C ?? "")) {
  throw new Error(
    `cabeçalho inesperado em project-map.xlsx (A="${header.A}", B="${header.B}", C="${header.C}") — ` +
      "esperado A=WORK FULL ADDRESS, B=WORK ADDRESS, C=WORK DONE",
  );
}

// Uma obra por endereço: a planilha tem uma linha por serviço, então o mesmo
// imóvel aparece repetido. Os serviços são unidos em um pino só ("Driveway,
// Patio, Steps") — é como os títulos já apareciam no mapa.
const byAddress = new Map();
for (const row of sheet.slice(1)) {
  const full = tidy(row.A);
  const label = streetLabel(row.B);
  if (!full || !label) continue;
  const key = addressKey(full);
  let entry = byAddress.get(key);
  if (!entry) {
    entry = { full, label, services: new Set(), zip: zipFrom(row.B) };
    byAddress.set(key, entry);
  }
  for (const service of String(row.C ?? "").split(",")) {
    const s = service.trim();
    if (s) entry.services.add(s);
  }
}

// --- 2. coordenadas ---------------------------------------------------------

const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};

// Base do CMS antigo: os mesmos endereços já geocodificados uma vez. Reaproveitar
// evita milhares de chamadas repetidas ao Nominatim (e faz o script rodar em minutos).
const legacy = new Map();
if (existsSync(LEGACY_FILE)) {
  for (const p of JSON.parse(readFileSync(LEGACY_FILE, "utf8"))) {
    if (!p.lat || !p.lng || !p.address) continue;
    const key = addressKey(`${p.address}, ${p.city}, ${p.state}`);
    if (!legacy.has(key)) legacy.set(key, p);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Partes do endereço para o geocodificador: o número da casa vem da coluna A e o
 * resto da coluna B, que é a mesma linha sem o número e com a pontuação mais
 * regular. Devolve null quando não dá para separar rua de cidade (uns 20 registros
 * da planilha, que caem no Nominatim em texto livre).
 */
function addressParts(entry) {
  const number = /^(\d+[A-Za-z]?)\b/.exec(entry.full)?.[1];
  const parts = entry.label.split(",").map((s) => s.trim()).filter(Boolean);
  if (!number || parts.length < 2 || /^OH\b/.test(parts[1])) return null;
  return { street: `${number} ${parts[0]}`, city: parts[1], zip: entry.zip };
}

/** Uma linha de CSV com os campos entre aspas (nomes de rua têm vírgula e aspas não). */
const csvField = (s) => `"${String(s ?? "").replace(/"/g, "")}"`;

/** Divide uma linha de CSV respeitando as aspas — a coluna de coordenada é "lon,lat". */
function csvSplit(line) {
  const out = [];
  let field = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) {
      out.push(field);
      field = "";
    } else field += ch;
  }
  out.push(field);
  return out;
}

/**
 * Geocodificador do US Census, em lote.
 *
 * É a fonte certa para endereço americano: bate com a base oficial de logradouros,
 * devolve o ZIP junto e aceita milhares de endereços por requisição — contra o
 * Nominatim, que erra ~40% destes endereços e exige uma requisição por vez a 1/s.
 * Resposta (CSV, fora de ordem): id, entrada, Match/No_Match, tipo, endereço
 * normalizado, "lon,lat", id TIGER, lado da rua.
 */
async function censusBatch(batch) {
  const csv = batch
    .map(({ index, parts }) =>
      [index, csvField(parts.street), csvField(parts.city), csvField("OH"), csvField(parts.zip)]
        .join(","),
    )
    .join("\n");

  const form = new FormData();
  form.set("benchmark", "Public_AR_Current");
  form.set("addressFile", new Blob([csv], { type: "text/csv" }), "addresses.csv");

  const res = await fetch("https://geocoding.geo.census.gov/geocoder/locations/addressbatch", {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(300_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const found = new Map();
  for (const line of (await res.text()).split("\n")) {
    if (!line.trim()) continue;
    const cols = csvSplit(line.trim());
    if (cols[2] !== "Match") continue; // No_Match, ou Tie (ambíguo demais)
    const [lng, lat] = cols[5].split(",").map(Number);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !inOhio(lat, lng)) continue;
    found.set(Number(cols[0]), { lat, lng, zip: zipFrom(cols[4]) });
  }
  return found;
}

/** Nominatim exige User-Agent identificando a aplicação e no máximo 1 req/s. */
async function geocode(params) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    format: "json", limit: "1", countrycodes: "us", addressdetails: "1", ...params,
  }).toString();
  const res = await fetch(url, {
    headers: { "User-Agent": "maximaconcrete.com project-map builder (one-off)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.length) return null;
  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    zip: data[0].address?.postcode?.slice(0, 5) ?? "",
  };
}

/**
 * Consultas a tentar, da mais precisa para a mais tolerante.
 *
 * A busca estruturada (street/city/state) acerta muito mais que o texto livre em
 * endereço americano com número de casa — o texto livre erra sempre que a rua não
 * está no OSM com o nome exato digitado na planilha. A última tentativa é a rua sem
 * número: põe o pino na via certa, que já é toda a precisão que o mapa mostra.
 */
function queriesFor(entry) {
  const out = [];
  const parts = entry.full.split(",").map((s) => s.trim()).filter(Boolean);
  const street = parts[0];
  // "1328 Hills-Miller Road, Delaware, OH 43015" -> city = penúltima parte
  const cityPart = parts.length >= 3 ? parts[parts.length - 2] : null;

  if (cityPart && /^\d/.test(street)) {
    const zip = entry.zip;
    out.push({ street, city: cityPart, state: "Ohio", ...(zip ? { postalcode: zip } : {}) });
  }
  out.push({ q: entry.full });

  // Rua sem número, estruturada e depois em texto livre.
  const label = entry.label.split(",").map((s) => s.trim()).filter(Boolean);
  if (label.length >= 2) {
    out.push({ street: label[0], city: label[1], state: "Ohio" });
  }
  out.push({ q: `${entry.label}, USA` });
  return out;
}

const stats = { cache: 0, census: 0, legacy: 0, nominatim: 0, failed: 0, offBox: 0 };
const failures = [];
const saveCache = () => {
  if (!DRY_RUN) writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1));
};

// Quem não tem coordenada é um endereço que nenhum geocodificador conhece (em geral
// rua de loteamento novo, ainda fora do TIGER e do OSM). Fica gravado no cache assim
// mesmo: sem isso, toda regeração gastaria centenas de requisições nos mesmos
// endereços perdidos. `--retry-failed` tenta de novo, quando as bases forem atualizadas.
const resolved = (key) => cache[key] && (RETRY_FAILED ? cache[key].lat : true);

const todo = [...byAddress].filter(([key]) => !resolved(key));
stats.cache = byAddress.size - todo.length;
console.log(`${byAddress.size} obras; ${todo.length} sem coordenada em cache`);

// 2a. Censo, em lotes.
if (todo.length && !OFFLINE) {
  const batch = [];
  for (const [i, [, entry]] of todo.entries()) {
    const parts = addressParts(entry);
    if (parts) batch.push({ index: i, parts });
  }
  const CHUNK = 500;
  for (let start = 0; start < batch.length; start += CHUNK) {
    const chunk = batch.slice(start, start + CHUNK);
    try {
      const found = await censusBatch(chunk);
      for (const [index, coord] of found) {
        cache[todo[index][0]] = { ...coord, src: "census" };
        stats.census++;
      }
      console.log(
        `  censo ${start + chunk.length}/${batch.length} enviados, ${stats.census} resolvidos`,
      );
      saveCache();
    } catch (e) {
      console.log(`  ! lote do censo a partir de ${start}: ${e.message}`);
    }
  }
}

// 2b. O que o censo não achou: base antiga e, por último, Nominatim (1 req/s).
const leftovers = todo.filter(([key]) => !cache[key]?.lat);
if (leftovers.length) console.log(`${leftovers.length} endereços restantes`);

for (const [key, entry] of leftovers) {
  const old = legacy.get(key);
  if (old && inOhio(old.lat, old.lng)) {
    cache[key] = { lat: old.lat, lng: old.lng, zip: old.zip_code || "", src: "legacy" };
    stats.legacy++;
    continue;
  }
  if (OFFLINE) {
    failures.push(entry.label);
    stats.failed++;
    continue; // sem rede não dá para dizer que o endereço não existe — não marca no cache
  }

  let hit = null;
  for (const query of queriesFor(entry)) {
    try {
      const r = await geocode(query);
      await sleep(1100);
      if (r && inOhio(r.lat, r.lng)) {
        hit = r;
        break;
      }
      if (r) stats.offBox++;
    } catch (e) {
      await sleep(2000);
      console.log(`  ! ${entry.label}: ${e.message}`);
    }
  }
  if (hit) {
    cache[key] = { ...hit, src: "nominatim" };
    stats.nominatim++;
  } else {
    cache[key] = { src: "none" };
    failures.push(entry.label);
    stats.failed++;
  }
  const done = stats.nominatim + stats.failed;
  if (done > 0 && done % 25 === 0) {
    console.log(`  nominatim ${done}/${leftovers.length - stats.legacy}`);
    saveCache();
  }
}
saveCache();

// --- 3. saída ---------------------------------------------------------------

const round = (n) => Math.round(n * 1e5) / 1e5; // ~1 m; encurta bastante o JSON

const projects = [];
const missing = [];
for (const [key, entry] of byAddress) {
  const coord = cache[key];
  if (!coord?.lat) {
    missing.push(entry.label); // sem coordenada não há pino
    continue;
  }
  projects.push({
    work: [...entry.services].join(", ") || "Concrete",
    street: entry.label,
    zip: entry.zip || coord.zip || "",
    lat: round(coord.lat),
    lng: round(coord.lng),
  });
}

if (!DRY_RUN) {
  writeFileSync(OUT_FILE, JSON.stringify(projects));
  writeFileSync(join(HERE, "geocode-failures.txt"), missing.join("\n") + (missing.length ? "\n" : ""));
}

console.log(
  `\nlinhas na planilha: ${sheet.length - 1} | obras (endereços únicos): ${byAddress.size}` +
    `\ncoordenadas: cache ${stats.cache}, censo ${stats.census}, base antiga ${stats.legacy}` +
    `, nominatim ${stats.nominatim}` +
    `\nsem coordenada: ${missing.length}${stats.offBox ? ` (${stats.offBox} resultados fora de Ohio)` : ""}` +
    (failures.length ? ` — ${failures.length} nesta rodada` : "") +
    `\npinos gerados: ${projects.length}, com ZIP: ${projects.filter((p) => p.zip).length}` +
    (DRY_RUN ? "\n(dry-run: nada escrito)" : `\n-> ${OUT_FILE}`),
);
