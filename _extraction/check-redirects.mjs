// Confere, contra um site no ar, se cada endereço do site antigo (Wix) chega à
// página certa do site novo — e se o resto do comportamento de erro está de pé.
//
// Uso:
//   node _extraction/check-redirects.mjs https://maximaconcrete.igorstutz.online
//   node _extraction/check-redirects.mjs https://maximaconcrete.com
//
// O mapa aqui é a mesma fonte das regras em public/.htaccess: ao mexer num,
// mexa no outro.
const BASE = (process.argv[2] || "https://maximaconcrete.igorstutz.online").replace(/\/$/, "");

const MAPA = {
  "/about": "/why-maxima/",
  "/about/areas-served": "/areas-we-serve/",
  "/about/contact": "/contact-us/",
  "/about/contact/thank-you": "/contact-us/",
  "/about/delewareohio": "/areas-we-serve/delaware/",
  "/about/newalbanyohio": "/areas-we-serve/new-albany/",
  "/about/financing": "/financing/",
  "/about/reviews": "/reviews/",
  "/career": "/join-our-team/",
  "/thanks": "/",
  "/copy-of-thanks": "/",
  "/outdoor-living-thank-you": "/",
  "/concrete": "/why-maxima/",
  "/concrete/approaches": "/services/approaches/",
  "/concrete/basement": "/services/basement-floors/",
  "/concrete/curbandgutter": "/services/curbs-gutters/",
  "/concrete/driveway": "/services/driveways/",
  "/concrete/garages": "/services/garage-floors/",
  "/concrete/patios": "/services/patios/",
  "/concrete/porches": "/services/porches/",
  "/concrete/sidewalks": "/services/sidewalks/",
  "/concrete/slabs": "/services/slabs/",
  "/concrete/steps": "/services/steps/",
  "/concrete/structuralsupport": "/services/footers/",
  "/driveways-and-patios": "/services/driveways/",
  "/concretefinishes": "/finishes/",
  "/concretefinishes/broomfinish": "/finishes/broom/",
  "/concretefinishes/buffwashfinish": "/finishes/buff-wash-exposed/",
  "/concretefinishes/coloredfinish": "/finishes/colored-broom/",
  "/concretefinishes/smoothfinish": "/finishes/smooth/",
  "/concretefinishes/stampedfinish": "/finishes/stamped-colored/",
  "/concretefinishes/concretespecs": "/why-maxima/concrete-specifications/",
  "/commercial/commercial-concrete": "/commercial-concrete/",
  "/commercial/commercial-pavers": "/commercial/",
  "/commercial/commercial-pools": "/commercial-pools/",
  "/outdoor-living": "/services/outdoor-living/",
  "/outdoor-living/lighting": "/services/outdoor-lighting/",
  "/outdoor-living/outdoorkitchens": "/services/outdoor-kitchens/",
  "/outdoor-living/shelters": "/services/shelters/",
  "/outdoorlivinglandingpage": "/services/outdoor-living/",
  "/paverandstones": "/finishes/paver/",
  "/paverandstones/pavertypes": "/finishes/paver/",
  "/paverandstones/paverapproach": "/services/approaches/",
  "/paverandstones/paverdriveway": "/services/driveways/driveways-paver/",
  "/paverandstones/paverpatio": "/services/patios/patios-paver/",
  "/paverandstones/paverfirepit": "/services/fire-pits/",
  "/paverandstones/paverfireplaces": "/services/fireplaces/",
  "/paverandstones/paverporch": "/services/porches/",
  "/paverandstones/paversidewalk": "/services/sidewalks/",
  "/paverandstones/paversteps": "/services/steps/",
  "/paverandstones/retainingwall": "/services/retaining-walls/",
  "/paverandstones/walls": "/services/seating-walls/",
  "/pools": "/services/pool-decks-surrounds/",
  "/pools-landing-page": "/services/pool-decks-surrounds/",
  "/pools/contractorservices": "/commercial-pools/",
  "/pools/subcontract-services": "/commercial-pools/",
  "/portfolio": "/gallery/",
  "/portfolio/commercial-photos": "/gallery/commercial/",
  "/portfolio/driveways": "/gallery/driveways/",
  "/portfolio/garagesandbarns-photos": "/gallery/garage-floor-barn/",
  "/portfolio/patios-photos": "/gallery/patios/",
  "/portfolio/patios-photos/broomfinishconcretepatio-photos": "/gallery/patios/",
  "/portfolio/patios-photos/stampedandcoloredpatio-photos": "/gallery/patios/",
  "/portfolio/pavers": "/gallery/pavers/",
  "/portfolio/pools-photos": "/gallery/pools/",
  "/portfolio/porchandsteps-photos": "/gallery/porches-steps/",
  "/portfolio/sportcourt-photos": "/gallery/sport-court/",
  "/portfolio/walkways-photos": "/gallery/sidewalks/",
  "/sportcourts": "/services/sports-courts/",
  // Endereços do site Lovable, que já existiam antes deste mapa
  "/services/driveways-concrete": "/services/driveways/driveways-concrete/",
  "/services/patios-paver": "/services/patios/patios-paver/",
  "/real-reviews": "/reviews/",
};

const UA = { "user-agent": "Mozilla/5.0 (checagem de redirects Maxima)" };

/** Segue os redirects na mão para ver a cadeia inteira. */
async function seguir(url, limite = 5) {
  const cadeia = [];
  let atual = url;
  for (let i = 0; i < limite; i++) {
    const r = await fetch(atual, { redirect: "manual", headers: UA });
    cadeia.push({ url: atual, status: r.status });
    const destino = r.headers.get("location");
    if (!destino) break;
    atual = new URL(destino, atual).href;
  }
  return { final: atual, cadeia };
}

let ok = 0;
const problemas = [];

for (const [de, esperado] of Object.entries(MAPA)) {
  const { final, cadeia } = await seguir(BASE + de);
  const caminhoFinal = new URL(final).pathname;
  const statusFinal = cadeia[cadeia.length - 1].status;
  const primeiro = cadeia[0].status;

  const chegouCerto = caminhoFinal === esperado;
  const permanente = primeiro === 301;
  const paginaBoa = statusFinal === 200;

  if (chegouCerto && permanente && paginaBoa) {
    ok++;
  } else {
    problemas.push({
      de,
      esperado,
      chegou: caminhoFinal,
      primeiro,
      statusFinal,
      saltos: cadeia.length - 1,
    });
  }
}

console.log(`\n${BASE}`);
console.log(`redirects conferidos: ${Object.keys(MAPA).length}`);
console.log(`  corretos: ${ok}`);
console.log(`  com problema: ${problemas.length}`);
for (const p of problemas) {
  console.log(`    ${p.de}`);
  console.log(`       esperado ${p.esperado} · chegou ${p.chegou} · primeiro status ${p.primeiro} · final ${p.statusFinal} · ${p.saltos} salto(s)`);
}

// Comportamentos de borda que também precisam estar certos
console.log("\nborda:");
const inexistente = await seguir(BASE + "/pagina-que-nunca-existiu");
console.log(
  `  página inexistente -> ${new URL(inexistente.final).pathname} (${inexistente.cadeia[0].status})` +
    (new URL(inexistente.final).pathname === "/" ? "  ok: vai para a home" : "  ATENÇÃO: deveria ir para a home"),
);

const arquivo = await fetch(BASE + "/images/arquivo-que-nao-existe.webp", { redirect: "manual", headers: UA });
console.log(
  `  arquivo inexistente -> status ${arquivo.status}` +
    (arquivo.status === 404 ? "  ok: 404 de verdade" : "  ATENÇÃO: deveria ser 404, não redirect"),
);

process.exit(problemas.length ? 1 : 0);
