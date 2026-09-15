/**
 * Atribuição de leads — de onde veio quem entra em contato.
 *
 * ## Por que existe
 * O GA4 e o Meta sabem de onde vem o TRÁFEGO, mas cada um só enxerga o que lhe
 * interessa e nenhum dos dois consegue dizer "este lead, com este nome e este
 * telefone, chegou por um anúncio do Google em março e voltou pelo Instagram em
 * abril". Quem fecha a venda precisa exatamente disso. Este módulo guarda a
 * jornada no próprio navegador e a anexa ao lead no momento da conversão.
 *
 * ## Como é otimizado
 * Navegação anônima não gera requisição nenhuma: a jornada fica em
 * `localStorage` e viaja junto do formulário ou do clique de ligar. O servidor
 * só é chamado UMA vez por sessão (não por página), para registrar a visita e
 * renovar o cookie. É o mesmo desenho dos campos ocultos que HubSpot e Marketo
 * põem nos formulários, pela mesma razão: é o mais barato que existe.
 *
 * ## Identidade
 * O identificador é o `maxima-visitor-id` que o site já criava para o Pixel —
 * um só, para a atribuição e a medição nunca contarem visitantes diferentes.
 * Além do localStorage ele vai para um cookie primeiro-parte renovado PELO
 * SERVIDOR (ver `public/api/track.php`): o Safari limita a 7 dias os cookies
 * escritos por JavaScript, mas não os que chegam num cabeçalho `Set-Cookie`, e
 * sem isso todo visitante de iPhone viraria "novo" a cada semana.
 *
 * Nada aqui é dado pessoal: o identificador é aleatório e a jornada só guarda
 * páginas e origens. Nome e telefone entram apenas no lead, pelo formulário.
 */

const CHAVE_ID = "maxima-visitor-id"; // o mesmo do layout.tsx (Pixel)
const CHAVE_DADOS = "maxima-attribution";
const CHAVE_SESSAO = "maxima-session";
const COOKIE_ID = "_mxvid";

/** Sessão expira com 30 min de inatividade — a convenção do GA4. */
const SESSAO_MS = 30 * 60 * 1000;

/** Tetos do que fica guardado, para o payload não crescer sem limite. */
const MAX_TOUCHPOINTS = 30;
const MAX_PAGINAS = 60;

export type Toque = {
  /** Quando a sessão começou. */
  ts: string;
  /** Canal já classificado, que é o que o painel agrupa. */
  channel: string;
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  /** Identificador do clique no anúncio, quando houver (gclid, fbclid...). */
  click_id?: string;
  /** Página de entrada da sessão. */
  landing: string;
  /** De onde veio, quando fora do site. */
  referrer?: string;
};

export type Jornada = {
  v: 1;
  vid: string;
  /** Primeira origem conhecida — nunca sobrescrita. */
  first: Toque;
  /** Origem mais recente. */
  last: Toque;
  /**
   * Última origem que não foi acesso direto. É o modelo que as ferramentas
   * usam por padrão, porque "direto" quase sempre é alguém voltando por um
   * caminho que já tinha sido pago antes — creditar o direto apagaria a
   * campanha que de fato trouxe a pessoa.
   */
  lastNonDirect?: Toque;
  sessions: number;
  /** Uma entrada por sessão, da mais antiga para a mais nova. */
  touchpoints: Toque[];
  /** Páginas vistas, para reconstruir o caminho até o contato. */
  pages: { ts: string; path: string }[];
  /** Primeira visita registrada. */
  createdAt: string;
};

// --- classificação ----------------------------------------------------------

const BUSCADORES =
  /(^|\.)(google|bing|yahoo|duckduckgo|ecosia|baidu|yandex|ask|aol|brave)\./i;
const SOCIAIS =
  /(^|\.)(facebook|fb|instagram|linkedin|twitter|x|t\.co|tiktok|youtube|pinterest|reddit|nextdoor|threads)\./i;
const EMAIL = /(^|\.)(mail|outlook|webmail)\./i;

/** Os parâmetros de clique pago, do mais específico para o mais genérico. */
const CLICK_IDS: { param: string; channel: string; source: string; medium: string }[] = [
  { param: "gclid", channel: "Google Ads", source: "google", medium: "cpc" },
  { param: "gbraid", channel: "Google Ads", source: "google", medium: "cpc" },
  { param: "wbraid", channel: "Google Ads", source: "google", medium: "cpc" },
  { param: "msclkid", channel: "Microsoft Ads", source: "bing", medium: "cpc" },
  { param: "ttclid", channel: "TikTok Ads", source: "tiktok", medium: "paid_social" },
  { param: "li_fat_id", channel: "LinkedIn Ads", source: "linkedin", medium: "paid_social" },
  { param: "fbclid", channel: "Meta Ads", source: "facebook", medium: "paid_social" },
];

const limpa = (v: string | null | undefined, max = 120) =>
  (v ?? "").toString().trim().slice(0, max);

/** "facebook" -> "Facebook"; mantém siglas curtas em maiúsculas. */
function bonito(s: string): string {
  if (!s) return s;
  if (s.length <= 3) return s.toUpperCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * De onde veio esta visita.
 *
 * A ordem importa e é a que as ferramentas de medição usam: identificador de
 * clique pago primeiro (é o único sinal que não mente), depois a UTM que a
 * campanha declarou, e só então o referrer — que é um palpite, porque o
 * navegador esconde cada vez mais essa informação.
 */
export function classificar(url: URL, referrer: string): Toque {
  const p = url.searchParams;
  const agora = new Date().toISOString();
  const landing = url.pathname + (url.search ? url.search.slice(0, 200) : "");

  const utmSource = limpa(p.get("utm_source")).toLowerCase();
  const utmMedium = limpa(p.get("utm_medium")).toLowerCase();
  const campanha = limpa(p.get("utm_campaign")) || limpa(p.get("utm_id"));
  const term = limpa(p.get("utm_term"));
  const content = limpa(p.get("utm_content"));

  const base = {
    ts: agora,
    campaign: campanha || undefined,
    term: term || undefined,
    content: content || undefined,
    landing,
    referrer: referrer ? limpa(referrer, 200) : undefined,
  };

  // 1. Clique pago identificado — não depende de a campanha ter posto UTM.
  for (const c of CLICK_IDS) {
    const valor = p.get(c.param);
    if (!valor) continue;
    // Instagram e Facebook chegam os dois com fbclid; a UTM desempata.
    const ehInsta = /instagram|ig/.test(utmSource);
    return {
      ...base,
      channel: c.param === "fbclid" && ehInsta ? "Instagram Ads" : c.channel,
      source: utmSource || c.source,
      medium: utmMedium || c.medium,
      click_id: `${c.param}:${limpa(valor, 100)}`,
    };
  }

  // 2. UTM declarada pela campanha.
  if (utmMedium || utmSource) {
    const porMeio = (): string => {
      if (/^(cpc|ppc|paid|paidsearch|paid_search|sem|display|banner|cpm)$/.test(utmMedium)) {
        if (/google/.test(utmSource)) return "Google Ads";
        if (/facebook|meta|fb/.test(utmSource)) return "Meta Ads";
        if (/instagram|ig/.test(utmSource)) return "Instagram Ads";
        if (/bing|microsoft/.test(utmSource)) return "Microsoft Ads";
        return `Paid — ${bonito(utmSource || "other")}`;
      }
      if (/paid.?social|social.?paid/.test(utmMedium)) {
        if (/instagram|ig/.test(utmSource)) return "Instagram Ads";
        if (/facebook|meta|fb/.test(utmSource)) return "Meta Ads";
        return `Paid — ${bonito(utmSource || "social")}`;
      }
      if (/^(email|e-mail|newsletter|mail)$/.test(utmMedium)) return "Email";
      if (/social/.test(utmMedium)) return "Organic Social";
      if (/^organic$/.test(utmMedium)) return "Organic Search";
      if (/^referral$/.test(utmMedium)) return "Referral";
      if (/^(qr|qrcode|print|flyer|yard|sign|offline)$/.test(utmMedium)) return "Offline";
      return `Campaign — ${bonito(utmSource || utmMedium)}`;
    };
    return { ...base, channel: porMeio(), source: utmSource || "(not set)", medium: utmMedium || "(not set)" };
  }

  // 3. Referrer.
  let host = "";
  try {
    host = referrer ? new URL(referrer).hostname.toLowerCase() : "";
  } catch {
    host = "";
  }
  const proprio = host === "" || host.endsWith("maximaconcrete.com") || host === url.hostname;

  if (proprio) {
    return { ...base, channel: "Direct", source: "(direct)", medium: "(none)", referrer: undefined };
  }
  if (BUSCADORES.test(host)) {
    return { ...base, channel: "Organic Search", source: host.replace(/^www\./, ""), medium: "organic" };
  }
  if (SOCIAIS.test(host)) {
    return { ...base, channel: "Organic Social", source: host.replace(/^www\./, ""), medium: "social" };
  }
  if (EMAIL.test(host)) {
    return { ...base, channel: "Email", source: host.replace(/^www\./, ""), medium: "email" };
  }
  return { ...base, channel: "Referral", source: host.replace(/^www\./, ""), medium: "referral" };
}

// --- armazenamento ----------------------------------------------------------

function leia<T>(chave: string): T | null {
  try {
    const cru = localStorage.getItem(chave);
    return cru ? (JSON.parse(cru) as T) : null;
  } catch {
    return null; // modo privativo, cookies bloqueados: medição nunca quebra a página
  }
}

function grave(chave: string, valor: unknown): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem espaço ou sem permissão — segue sem medir */
  }
}

function cookie(nome: string): string {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${nome}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : "";
  } catch {
    return "";
  }
}

function novoId(): string {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    /* segue no fallback */
  }
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Identificador do visitante, na ordem de quem sobrevive mais tempo: cookie
 * renovado pelo servidor, depois localStorage, e só então um novo.
 */
export function visitorId(): string {
  const doCookie = cookie(COOKIE_ID);
  let id = "";
  try {
    id = localStorage.getItem(CHAVE_ID) || "";
  } catch {
    /* ignora */
  }
  const escolhido = doCookie || id || novoId();
  if (escolhido !== id) {
    try {
      localStorage.setItem(CHAVE_ID, escolhido);
    } catch {
      /* ignora */
    }
  }
  return escolhido;
}

/** Sessão corrente, ou null se expirou. */
function sessaoViva(): { id: string; at: number; channel: string } | null {
  const s = leia<{ id: string; at: number; channel: string }>(CHAVE_SESSAO);
  if (!s || typeof s.at !== "number") return null;
  return Date.now() - s.at < SESSAO_MS ? s : null;
}

export type ResultadoVisita = { jornada: Jornada; novaSessao: boolean; toque: Toque };

/**
 * Registra a visita: abre sessão quando preciso, atualiza primeira/última
 * origem e devolve a jornada. Idempotente dentro da mesma sessão.
 */
export function registrarVisita(): ResultadoVisita | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const toque = classificar(url, document.referrer || "");
  const vid = visitorId();

  const anterior = sessaoViva();
  // Campanha nova abre sessão nova mesmo dentro dos 30 min: é a regra do GA4, e
  // sem ela um clique em anúncio logo depois de uma visita orgânica não apareceria.
  const mudouCampanha = !!anterior && toque.channel !== "Direct" && toque.channel !== anterior.channel;
  const novaSessao = !anterior || mudouCampanha;

  grave(CHAVE_SESSAO, {
    id: novaSessao ? novoId() : anterior!.id,
    at: Date.now(),
    channel: novaSessao ? toque.channel : anterior!.channel,
  });

  let j = leia<Jornada>(CHAVE_DADOS);
  if (!j || j.v !== 1 || !j.first) {
    j = {
      v: 1,
      vid,
      first: toque,
      last: toque,
      lastNonDirect: toque.channel === "Direct" ? undefined : toque,
      sessions: 1,
      touchpoints: [toque],
      pages: [],
      createdAt: toque.ts,
    };
  } else if (novaSessao) {
    j.vid = vid;
    j.last = toque;
    // "Direto" não apaga a campanha anterior: quem volta digitando o endereço
    // continua tendo sido trazido pelo anúncio que viu antes.
    if (toque.channel !== "Direct") j.lastNonDirect = toque;
    j.sessions = (j.sessions ?? 0) + 1;
    j.touchpoints = [...(j.touchpoints ?? []), toque].slice(-MAX_TOUCHPOINTS);
  } else {
    j.vid = vid;
  }

  grave(CHAVE_DADOS, j);
  return { jornada: j, novaSessao, toque };
}

/** Acrescenta uma página vista à jornada (inclusive nas trocas de rota). */
export function registrarPagina(path: string): void {
  if (typeof window === "undefined") return;
  const j = leia<Jornada>(CHAVE_DADOS);
  if (!j) return;
  const pages = j.pages ?? [];
  const ultima = pages[pages.length - 1];
  if (ultima?.path === path) return; // não conta a mesma página duas vezes seguidas
  j.pages = [...pages, { ts: new Date().toISOString(), path: limpa(path, 160) }].slice(-MAX_PAGINAS);
  grave(CHAVE_DADOS, j);
}

/**
 * O que viaja junto da conversão. Compacto de propósito: vai em campo oculto de
 * formulário e em `sendBeacon`, os dois com limite de tamanho.
 */
export function payloadAtribuicao(): string {
  if (typeof window === "undefined") return "";
  const j = leia<Jornada>(CHAVE_DADOS);
  if (!j) return "";
  const enxuto = (t?: Toque) =>
    t && {
      ts: t.ts,
      channel: t.channel,
      source: t.source,
      medium: t.medium,
      campaign: t.campaign,
      term: t.term,
      content: t.content,
      click_id: t.click_id,
      landing: t.landing,
      referrer: t.referrer,
    };
  try {
    return JSON.stringify({
      vid: j.vid,
      first: enxuto(j.first),
      last: enxuto(j.last),
      lastNonDirect: enxuto(j.lastNonDirect),
      sessions: j.sessions,
      // Só o essencial de cada toque: o painel mostra a linha do tempo, não precisa
      // repetir termo e conteúdo de anúncio em todas as entradas.
      touchpoints: (j.touchpoints ?? []).map((t) => ({
        ts: t.ts,
        channel: t.channel,
        source: t.source,
        campaign: t.campaign,
        landing: t.landing,
      })),
      pages: (j.pages ?? []).slice(-30),
      createdAt: j.createdAt,
      // Cookies do Meta: é com eles que a API de Conversões casa o lead com o
      // clique no anúncio. Já existem na página; aqui só viajam junto.
      fbp: cookie("_fbp") || undefined,
      fbc: cookie("_fbc") || undefined,
    });
  } catch {
    return "";
  }
}

/** A jornada como está guardada (usada pelo aviso de depuração, se preciso). */
export function jornadaAtual(): Jornada | null {
  if (typeof window === "undefined") return null;
  return leia<Jornada>(CHAVE_DADOS);
}
