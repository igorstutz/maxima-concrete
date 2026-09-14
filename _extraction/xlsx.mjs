// Leitor mínimo de .xlsx, sem dependências.
//
// Um .xlsx é um ZIP de XMLs. O Node já traz o inflate (zlib.inflateRawSync), então
// ler a planilha é descompactar duas entradas do ZIP e varrer o XML — bem mais barato
// que arrastar uma biblioteca de planilha para dentro do projeto só por causa disso.
import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

/** Descompacta o ZIP inteiro em um Map<nome do arquivo, Buffer>. */
function unzip(buf) {
  // Fim do diretório central (EOCD): assinatura 0x06054b50, procurada de trás para frente.
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 66_000; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("não é um arquivo .xlsx válido (EOCD não encontrado)");

  const count = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16);
  const files = new Map();

  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) break;
    const method = buf.readUInt16LE(ptr + 10);
    const compSize = buf.readUInt32LE(ptr + 20);
    const nameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOff = buf.readUInt32LE(ptr + 42);
    const name = buf.toString("utf8", ptr + 46, ptr + 46 + nameLen);

    // O cabeçalho local repete nome e extra com tamanhos próprios — os do diretório
    // central não servem para achar onde os dados começam.
    const lNameLen = buf.readUInt16LE(localOff + 26);
    const lExtraLen = buf.readUInt16LE(localOff + 28);
    const start = localOff + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(start, start + compSize);
    files.set(name, method === 0 ? raw : inflateRawSync(raw));

    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

/** Texto de um nó XML: remove marcação interna e resolve as entidades. */
const text = (xml) =>
  xml
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&"); // por último, senão "&amp;lt;" vira "<"

/**
 * Lê a primeira aba e devolve as linhas como objetos por letra de coluna:
 * `[{ A: "…", B: "…", C: "…" }, …]`, incluindo o cabeçalho.
 */
export function readSheet(path) {
  const files = unzip(readFileSync(path));

  // A ordem das abas está no workbook; a primeira r:id aponta para o arquivo real.
  const wb = files.get("xl/workbook.xml")?.toString("utf8") ?? "";
  const rels = files.get("xl/_rels/workbook.xml.rels")?.toString("utf8") ?? "";
  const firstRid = /<sheet[^>]*r:id="([^"]+)"/.exec(wb)?.[1];
  const target = firstRid
    ? new RegExp(`Id="${firstRid}"[^>]*Target="([^"]+)"`).exec(rels)?.[1]
    : null;
  const sheetName = target
    ? `xl/${target.replace(/^\/?xl\//, "").replace(/^\//, "")}`
    : "xl/worksheets/sheet1.xml";
  const sheetXml = (files.get(sheetName) ?? files.get("xl/worksheets/sheet1.xml"))?.toString("utf8");
  if (!sheetXml) throw new Error(`aba não encontrada em ${path}`);

  const sharedXml = files.get("xl/sharedStrings.xml")?.toString("utf8") ?? "";
  const shared = [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => text(m[1]));

  const rows = [];
  for (const rowMatch of sheetXml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = {};
    for (const cell of rowMatch[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g)) {
      const type = /t="([^"]+)"/.exec(cell[2])?.[1];
      const value = /<v>([\s\S]*?)<\/v>/.exec(cell[3]);
      cells[cell[1]] =
        type === "s" ? (shared[Number(value?.[1])] ?? "")
        : type === "inlineStr" ? text(cell[3])
        : (value?.[1] ?? "");
    }
    rows.push(cells);
  }
  return rows;
}
