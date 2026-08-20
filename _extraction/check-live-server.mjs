// Testa o site no servidor de produção ANTES de o DNS apontar para lá.
//
// Conecta direto no IP e apresenta o domínio real no cabeçalho Host, então o
// servidor responde com o vhost e o .htaccess de verdade.
//
// Vai por HTTP de propósito: nesta fase o domínio ainda não tem certificado, e
// uma conexão TLS com esse nome é recusada pelo servidor. O `.htaccess` força
// HTTPS, então cada salto para `https://<domínio>/algo` é seguido por HTTP no
// mesmo caminho — o que se está validando aqui são as regras de reescrita e o
// conteúdo, não o certificado (esse é o passo seguinte, na virada).
//
// Uso: node _extraction/check-live-server.mjs 157.173.208.145 maximaconcrete.com
import { request } from "node:http";

const IP = process.argv[2] || "157.173.208.145";
const HOST = process.argv[3] || "maximaconcrete.com";

function buscar(caminho) {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        host: IP,
        path: caminho,
        method: "GET",
        headers: { Host: HOST, "User-Agent": "Mozilla/5.0 (checagem pre-DNS)" },
        timeout: 20000,
      },
      (res) => {
        let corpo = "";
        res.setEncoding("utf8");
        res.on("data", (c) => {
          if (corpo.length < 4000) corpo += c;
        });
        res.on("end", () => resolve({ status: res.statusCode, location: res.headers.location, corpo }));
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

/**
 * Segue a cadeia de redirects sempre no mesmo servidor. Salto para https no
 * próprio domínio é tratado como o mesmo caminho (ver nota no topo).
 */
async function seguir(caminho, limite = 6) {
  let atual = caminho;
  const cadeia = [];
  for (let i = 0; i < limite; i++) {
    const r = await buscar(atual);
    cadeia.push({ caminho: atual, status: r.status });
    if (!r.location) return { cadeia, final: atual, corpo: r.corpo, status: r.status };

    const destino = new URL(r.location, `http://${HOST}${atual}`);
    const mesmoDominio = destino.hostname === HOST || destino.hostname === `www.${HOST}`;
    if (!mesmoDominio) return { cadeia, final: destino.href, corpo: "", status: r.status, externo: true };

    const proximo = destino.pathname + destino.search;
    // Só o esquema mudou (http -> https) no mesmo caminho: já validado, segue.
    if (proximo === atual && cadeia.length > 1) {
      return { cadeia, final: atual, corpo: r.corpo, status: r.status };
    }
    atual = proximo;
  }
  return { cadeia, final: atual, corpo: "", status: 0 };
}

const titulo = (html) => (html.match(/<title>([^<]*)<\/title>/i) || [, ""])[1].trim();

console.log(`\nservidor ${IP} respondendo como ${HOST}\n`);

// 1. A home carrega o site novo?
const home = await seguir("/");
console.log(`home: ${home.cadeia.map((c) => c.status).join(" -> ")}  título: "${titulo(home.corpo)}"`);

// 2. Amostra de páginas de cada tipo
const PAGINAS = [
  "/services/driveways/",
  "/services/patios/patios-paver/",
  "/finishes/stamped-colored/",
  "/gallery/",
  "/areas-we-serve/delaware/",
  "/commercial-pools/",
  "/reviews/",
  "/why-maxima/concrete-specifications/",
];
let paginasOk = 0;
for (const p of PAGINAS) {
  const r = await seguir(p);
  const bom = r.status === 200 && titulo(r.corpo).length > 0;
  if (bom) paginasOk++;
  else console.log(`  FALHOU ${p}: status ${r.status}`);
}
console.log(`páginas conferidas: ${paginasOk}/${PAGINAS.length}`);

// 3. Redirects do site antigo
const REDIRECTS = {
  "/concrete/driveway": "/services/driveways/",
  "/concretefinishes/stampedfinish": "/finishes/stamped-colored/",
  "/portfolio/patios-photos": "/gallery/patios/",
  "/paverandstones/paverpatio": "/services/patios/patios-paver/",
  "/about/reviews": "/reviews/",
  "/career": "/join-our-team/",
  "/pools": "/services/pool-decks-surrounds/",
  "/sportcourts": "/services/sports-courts/",
};
let redirOk = 0;
for (const [de, esperado] of Object.entries(REDIRECTS)) {
  const r = await seguir(de);
  const chegou = r.final.startsWith("http") ? new URL(r.final).pathname : r.final;
  if (chegou === esperado && r.status === 200) redirOk++;
  else console.log(`  FALHOU ${de}: esperado ${esperado}, chegou ${chegou} (status ${r.status})`);
}
console.log(`redirects conferidos: ${redirOk}/${Object.keys(REDIRECTS).length}`);

// 4. Bordas
const inexistente = await seguir("/pagina-que-nunca-existiu");
const caminhoFinal = inexistente.final.startsWith("http") ? new URL(inexistente.final).pathname : inexistente.final;
console.log(`página inexistente -> ${caminhoFinal} ${caminhoFinal === "/" ? "(ok: home)" : "(ATENÇÃO)"}`);

const arquivo = await buscar("/images/nao-existe-mesmo.webp");
console.log(`arquivo inexistente -> ${arquivo.status} ${arquivo.status === 404 ? "(ok: 404 real)" : "(ATENÇÃO: deveria ser 404)"}`);

const form = await buscar("/api/submit.php");
console.log(`formulário (GET em submit.php) -> ${form.status} ${form.status === 405 || form.status === 400 || form.status === 200 ? "(ok: PHP executando)" : "(ATENÇÃO: PHP pode não estar ativo)"}`);

const painel = await buscar("/admin/cms/index.html");
console.log(`painel de conteúdo -> ${painel.status} ${painel.status === 200 ? "(ok)" : "(ATENÇÃO)"}`);

const sitemap = await buscar("/sitemap.xml");
console.log(`sitemap -> ${sitemap.status} ${sitemap.status === 200 ? "(ok)" : "(ATENÇÃO)"}`);
