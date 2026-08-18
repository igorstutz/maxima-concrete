// Converte para WebP as imagens pesadas que o painel recebe (JPEG/PNG), troca
// as referências no conteúdo e limpa sobras antigas.
//
// Por que existe: o Sveltia sobe o arquivo como veio da câmera/celular — fotos
// de 3 MB e 4000 px entram cruas no repositório e vão inteiras para o deploy.
// O site já serve variantes menores, mas o arquivo original continua sendo o
// maior candidato do srcset e ocupa espaço em todo deploy.
//
// Roda pelo GitHub Actions (.github/workflows/optimize-images.yml) a cada
// upload e também sob demanda, pela ferramenta "Otimizar imagens" do painel.
// Rodar à mão: node _extraction/optimize-images.mjs [--apply]
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync, statSync, unlinkSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const APPLY = process.argv.includes("--apply");

const QUALITY = 85;
const MAX_WIDTH = 2560;
// Sobras com menos de uma semana ficam: pode ser foto que alguém subiu e ainda
// vai usar numa página.
const ORFA_DIAS = 7;

const STATUS_FILE = join(ROOT, "src", "content", "settings", "optimize-images.json");

// Fora do processo, de propósito:
// - /images/og: prévia de link das 46 páginas de cidade, montada por template
//   string em city-metadata.ts (nenhuma busca por texto acha essas referências)
//   e WhatsApp/Facebook não exibem WebP em og:image;
// - /images/logo: o logo do painel é citado no config.yml, fora de src/;
// - ícones e favicons: precisam continuar PNG.
const PRESERVAR = [
  /\/images\/og\//i,
  /\/images\/logo\//i,
  /og-image/i,
  /favicon/i,
  /icon-\d/i,
  /apple-touch-icon/i,
];

const collect = (dir, re) => {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name).replace(/\\/g, "/");
      if (e.isDirectory()) walk(p);
      else if (re.test(e.name)) out.push(p);
    }
  })(dir);
  return out;
};

const git = (args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
// `collect` devolve caminhos absolutos, então o relative é direto a partir de
// public/ — passar por join(ROOT, file) aqui produziria um caminho inválido e a
// troca de referências não acharia nada.
const PUBLIC = join(ROOT, "public");
const url = (file) => "/" + relative(PUBLIC, file).replace(/\\/g, "/");

/** nome-do-arquivo legível na URL: sem espaços, parênteses ou acentos. */
const sanitizar = (nome) =>
  nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ---------- onde o conteúdo cita imagens ----------
// Além de src/, entram o painel (config.yml cita o logo) e os scripts de
// _extraction — um arquivo citado só ali seria tratado como sobra e apagado.
const arquivosTexto = [
  ...collect(join(ROOT, "src"), /\.(tsx?|json|css|md)$/i),
  ...collect(join(ROOT, "public/admin"), /\.(yml|yaml|html)$/i),
  ...collect(join(ROOT, "_extraction"), /\.(mjs|json)$/i),
];
const textos = new Map(arquivosTexto.map((f) => [f, readFileSync(f, "utf8")]));
const haystack = [...textos.values()].join("\n");

const usada = (file) => {
  const u = url(file);
  const nome = file.split("/").pop();
  return haystack.includes(u) || haystack.includes(encodeURI(u)) || haystack.includes(nome);
};

// ---------- imagens candidatas ----------
const pesadas = collect(join(ROOT, "public/images"), /\.(jpe?g|png)$/i).filter(
  (p) => !PRESERVAR.some((re) => re.test(url(p))),
);

const convertidas = [];
const apagadas = [];
const mantidas = [];
let bytesAntes = 0;
let bytesDepois = 0;

for (const file of pesadas) {
  const tamanho = statSync(file).size;

  if (!usada(file)) {
    // Sobra: só sai depois da carência, medida pela data do commit que a trouxe.
    let dias = Infinity;
    try {
      const ts = Number(git(["log", "-1", "--format=%ct", "--", relative(ROOT, file).replace(/\\/g, "/")]));
      if (ts) dias = (Date.now() / 1000 - ts) / 86400;
    } catch {
      /* sem histórico: trata como antiga */
    }
    if (dias < ORFA_DIAS) {
      mantidas.push({ file, tamanho, dias });
      continue;
    }
    apagadas.push({ file, tamanho });
    bytesAntes += tamanho;
    if (APPLY) unlinkSync(file);
    continue;
  }

  const meta = await sharp(file).metadata();
  const destinoBase = join(dirname(file), sanitizar(file.split("/").pop()));
  let destino = `${destinoBase}.webp`;
  let n = 2;
  while (existsSync(destino)) destino = `${destinoBase}-${n++}.webp`;

  const buf = await sharp(file)
    .resize({ width: Math.min(meta.width || MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toBuffer();

  bytesAntes += tamanho;
  bytesDepois += buf.length;
  convertidas.push({ de: url(file), para: url(destino), antes: tamanho, depois: buf.length });

  if (APPLY) {
    writeFileSync(destino, buf);
    // Troca as referências: caminho cru e caminho com %20 (o painel grava os
    // dois formatos dependendo de onde o nome tem espaço).
    const antigo = url(file);
    const novo = url(destino);
    let trocas = 0;
    for (const [arquivo, conteudo] of textos) {
      if (!conteudo.includes(antigo) && !conteudo.includes(encodeURI(antigo))) continue;
      const atualizado = conteudo.split(encodeURI(antigo)).join(novo).split(antigo).join(novo);
      textos.set(arquivo, atualizado);
      writeFileSync(arquivo, atualizado);
      trocas++;
    }
    // Se a imagem está em uso mas nenhuma referência mudou, algo não bate — e
    // apagar o original aqui deixaria a página apontando para um arquivo que
    // não existe. Melhor parar e deixar tudo como está.
    if (trocas === 0) {
      unlinkSync(destino);
      console.error(
        `\n❌ ${antigo}: nenhuma referência encontrada para trocar. ` +
          `Nada foi apagado. Verifique como esse caminho aparece no conteúdo.`,
      );
      process.exit(1);
    }
    unlinkSync(file);
  }
}

// ---------- relatório ----------
const mb = (b) => (b / 1048576).toFixed(1);
console.log(`${APPLY ? "APLICANDO" : "SIMULAÇÃO"}`);
console.log(`  convertidas para WebP: ${convertidas.length} (${mb(convertidas.reduce((s, c) => s + c.antes, 0))} MB -> ${mb(bytesDepois)} MB)`);
for (const c of convertidas) console.log(`    ${c.de.split("/").pop()} -> ${c.para.split("/").pop()}  (${mb(c.antes)} -> ${mb(c.depois)} MB)`);
console.log(`  sobras apagadas: ${apagadas.length} (${mb(apagadas.reduce((s, a) => s + a.tamanho, 0))} MB)`);
console.log(`  sobras recentes mantidas (< ${ORFA_DIAS} dias): ${mantidas.length}`);

if (APPLY && (convertidas.length || apagadas.length)) {
  // As variantes e o painel precisam refletir os arquivos novos.
  execFileSync("node", [join(HERE, "generate-image-variants.mjs"), "--apply"], { stdio: "inherit", cwd: ROOT });
  execFileSync("node", [join(HERE, "generate-cms-config.mjs")], { stdio: "inherit", cwd: ROOT });
}

if (APPLY) {
  const agora = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/New_York",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
  const economia = bytesAntes - bytesDepois;
  const status = convertidas.length || apagadas.length
    ? `✅ ${agora} — ${convertidas.length} imagem(ns) convertida(s) para WebP e ${apagadas.length} sobra(s) removida(s). ` +
      `Economia: ${mb(economia)} MB.` +
      (mantidas.length ? ` ${mantidas.length} imagem(ns) enviada(s) nos últimos ${ORFA_DIAS} dias foram mantidas, mesmo sem uso em nenhuma página.` : "")
    : `✅ ${agora} — nada a fazer: todas as imagens já estão otimizadas.`;
  writeJson(STATUS_FILE, { run: false, status });
  console.log(`  ${status}`);
}

function writeJson(p, obj) {
  writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}
