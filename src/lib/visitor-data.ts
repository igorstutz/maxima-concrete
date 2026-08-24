/**
 * Guarda no navegador os dados de contato de quem já enviou um formulário, para
 * que os PageViews seguintes desse visitante deixem de ser anônimos.
 *
 * Por que isso melhora a nota de correspondência do Meta: um PageView normal
 * carrega só IP, user agent e os cookies do Pixel. Quando a pessoa já se
 * identificou uma vez, dá para enviar também e-mail, telefone, nome e CEP nas
 * visitas seguintes — que é o que o Meta pede para casar o evento com uma
 * pessoa real. Vale para quem volta ao site, não para a primeira visita: para
 * visitante que nunca interagiu, não existe dado nenhum a enviar, e nenhuma
 * técnica muda isso.
 *
 * Os valores ficam apenas no aparelho de quem preencheu, em texto — quem aplica
 * o hash antes de enviar ao Meta é o próprio Pixel, dentro do GTM.
 */

const CHAVE = "maxima-visitor";
/** Meio ano: o ciclo de decisão de uma obra é longo, e o dado envelhece pouco. */
const VALIDADE_MS = 180 * 24 * 60 * 60 * 1000;

export type VisitorData = {
  email_address?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
};

type Guardado = { at: number; data: VisitorData };

/** Grava o que sabemos do visitante depois de um envio bem-sucedido. */
export function saveVisitorData(data: VisitorData): void {
  try {
    const limpo: VisitorData = {};
    for (const [k, v] of Object.entries(data)) {
      const valor = (v ?? "").toString().trim();
      if (valor) limpo[k as keyof VisitorData] = valor;
    }
    if (!Object.keys(limpo).length) return;
    localStorage.setItem(CHAVE, JSON.stringify({ at: Date.now(), data: limpo }));
  } catch {
    /* navegador sem armazenamento: segue sem isso */
  }
}

/** O que sabemos do visitante, ou null. Descarta registro vencido. */
export function readVisitorData(): VisitorData | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const guardado = JSON.parse(bruto) as Guardado;
    if (!guardado?.data || typeof guardado.at !== "number") return null;
    if (Date.now() - guardado.at > VALIDADE_MS) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    return guardado.data;
  } catch {
    return null;
  }
}
