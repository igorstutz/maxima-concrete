// Executa a "ordem de cópia" gravada pelo painel em
// src/content/settings/copy-section.json e copia uma seção de uma página para
// outra, com conteúdo e tudo.
//
// Por que existe: o Sveltia edita um arquivo JSON por vez e só duplica itens
// dentro da mesma lista — não há como levar uma seção para outra página pelo
// painel. Aqui o painel só grava a escolha (from/to); o GitHub Actions
// (.github/workflows/copy-section.yml) roda este script, que faz a cópia,
// devolve o resultado no campo `status` e regenera o config.yml (a página de
// destino pode ter ganhado um tipo de seção que ela ainda não tinha, e sem
// isso o painel não saberia editar a seção nova).
//
// Rodar à mão: node _extraction/apply-copy-section.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { labelFor } from "./page-labels.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PAGES_DIR = join(ROOT, "src", "content", "pages");
const ORDER_FILE = join(ROOT, "src", "content", "settings", "copy-section.json");

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const writeJson = (p, obj) => writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");

const now = () =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/New_York",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

/** Grava o resultado no arquivo de ordem e encerra. */
function finish(order, status, { clear = false } = {}) {
  const next = { ...order, status };
  if (clear) {
    next.from = "";
    next.to = "";
  }
  // Ordem fixa das chaves, para o diff ficar estável.
  writeJson(ORDER_FILE, { from: next.from, to: next.to, status: next.status });
  console.log(status);
  process.exit(0);
}

const order = readJson(ORDER_FILE);
const from = (order.from || "").trim();
const to = (order.to || "").trim();

if (!from && !to) {
  console.log("Nenhuma cópia pedida (from/to vazios).");
  process.exit(0);
}
if (!from || !to) {
  finish(order, `⚠ ${now()} — escolha as DUAS coisas: a seção de origem e a página de destino.`);
}

// pageKey → arquivo, lendo a pasta inteira (o nome do arquivo nem sempre é o pageKey).
const pageFiles = readdirSync(PAGES_DIR).filter((f) => f.endsWith(".json"));
const byPageKey = new Map();
for (const file of pageFiles) {
  const page = readJson(join(PAGES_DIR, file));
  byPageKey.set(page.pageKey, { file, page });
}

const [fromPageKey, fromSectionKey] = from.split("::");
const source = byPageKey.get(fromPageKey);
const target = byPageKey.get(to);

if (!source) finish(order, `❌ ${now()} — a página de origem "${fromPageKey}" não existe mais.`, { clear: true });
if (!target) finish(order, `❌ ${now()} — a página de destino "${to}" não existe mais.`, { clear: true });

const section = source.page.sections.find((s) => s.key === fromSectionKey);
if (!section) {
  finish(
    order,
    `❌ ${now()} — a seção escolhida não existe mais em ${labelFor(fromPageKey)}. Escolha outra na lista.`,
    { clear: true }
  );
}

// Cópia independente: a partir daqui, editar uma não mexe na outra. As imagens
// continuam apontando para os mesmos arquivos em public/images (trocar a foto
// da cópia é escolher outro arquivo, o que não afeta a origem).
const copy = JSON.parse(JSON.stringify(section));

const usedKeys = new Set(target.page.sections.map((s) => s.key));
let newKey = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
while (usedKeys.has(newKey)) newKey = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
copy.key = newKey;

// Label repetido na mesma página confunde na hora de arrastar — numera a cópia.
const baseLabel = (copy.label || copy.type || "Section").trim();
const usedLabels = new Set(target.page.sections.map((s) => (s.label || "").trim()));
if (usedLabels.has(baseLabel)) {
  let n = 2;
  while (usedLabels.has(`${baseLabel} (${n})`)) n++;
  copy.label = `${baseLabel} (${n})`;
}

// Sempre no fim da página: quem pediu a cópia arrasta para o lugar certo no
// painel (mesmo comportamento do CMS antigo ao acrescentar seções).
target.page.sections.push(copy);
writeJson(join(PAGES_DIR, target.file), target.page);

// A página de destino pode ter recebido um tipo de seção que ela não tinha; o
// config.yml lista os tipos por página, então precisa ser regerado.
execFileSync("node", [join(HERE, "generate-cms-config.mjs")], { stdio: "inherit" });

finish(
  order,
  `✅ ${now()} — "${copy.label}" copiada de ${labelFor(fromPageKey)} para ${labelFor(to)}. ` +
    `Abra a página ${labelFor(to)} em Pages: a seção está no FIM da lista, ` +
    `é só arrastar para o lugar certo e salvar.`,
  { clear: true }
);
