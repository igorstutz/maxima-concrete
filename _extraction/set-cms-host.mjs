/**
 * Aponta o painel Sveltia para o host em que ele está publicado.
 *
 * O config.yml versionado nasce apontando para produção (maximaconcrete.com).
 * O mesmo build também vai para a homologação, onde `base_url` precisa ser o
 * host de lá — é a partir dele que o CMS monta a URL do proxy OAuth, e o
 * GitHub recusa um redirect_uri de outro domínio.
 *
 * Uso (depois do `next build`, sobre a pasta exportada):
 *   node _extraction/set-cms-host.mjs https://maximaconcrete.igorstutz.online
 *
 * Mexe apenas em out/admin/cms/config.yml — o arquivo do repositório
 * (public/admin/cms/config.yml) continua com o valor de produção.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const host = (process.argv[2] || process.env.CMS_SITE_URL || "").trim().replace(/\/+$/, "");

if (!/^https:\/\/[a-z0-9.-]+$/i.test(host)) {
  console.error(`set-cms-host: host inválido: "${host}" (esperado algo como https://exemplo.com)`);
  process.exit(1);
}

const file = resolve("out/admin/cms/config.yml");
const original = readFileSync(file, "utf8");

let changed = 0;
const updated = original
  .replace(/^(\s*base_url:\s*).*$/m, (_, prefix) => (changed++, `${prefix}"${host}"`))
  .replace(/^(\s*site_url:\s*).*$/m, (_, prefix) => (changed++, `${prefix}"${host}"`));

if (changed !== 2) {
  console.error(`set-cms-host: esperava trocar base_url e site_url, troquei ${changed}. config.yml mudou de formato?`);
  process.exit(1);
}

writeFileSync(file, updated);
console.log(`set-cms-host: painel apontado para ${host}`);
