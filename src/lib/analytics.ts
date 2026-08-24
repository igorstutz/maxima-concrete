/**
 * Eventos de conversão do site.
 *
 * O site não conhece Meta, Google Ads nem GA4: ele apenas anuncia no dataLayer
 * que um lead foi enviado. Quem traduz isso em tag é o Google Tag Manager —
 * assim trocar de ferramenta é configuração no painel do GTM, sem tocar no
 * código nem publicar o site de novo.
 *
 * `leadId` é gerado aqui e enviado junto ao servidor no mesmo envio. Quando a
 * API de Conversões do Meta entrar (envio servidor-a-servidor), ela usa esse
 * mesmo identificador como `event_id`: é o que faz o Meta entender que o evento
 * do navegador e o do servidor são o MESMO lead, em vez de contar dois.
 *
 * `user_data` existe para as conversões aprimoradas (enhanced conversions) do
 * Google Ads e para o Meta. Ele precisa vir daqui porque, no momento em que o
 * evento dispara, o formulário já foi trocado pela tela de agradecimento — não
 * há mais campo no HTML para o GTM ler. Os valores seguem em texto no
 * dataLayer e é o GTM que aplica o hash antes de enviar a qualquer plataforma.
 */

type LeadFields = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  zip?: string;
};

type LeadEvent = {
  /** Qual formulário enviou: "contact" | "join_our_team" */
  form: string;
  /** Caminho da página onde o formulário foi enviado */
  page: string;
  /** Identificador único deste envio, compartilhado com o servidor */
  leadId: string;
  /** Dados de contato, para as conversões aprimoradas */
  fields?: LeadFields;
};

/**
 * Clique em telefone. Vale como conversão: boa parte do cliente liga em vez de
 * preencher formulário. O GTM decide o que fazer com isso (Meta, Google Ads).
 */
export function pushPhoneClick({ location, page }: { location: string; page: string }): void {
  try {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "phone_click", click_location: location, page_path: page });
  } catch {
    /* silêncio de propósito */
  }
}

/** Identificador do envio. Usa a API do navegador quando disponível. */
export function newLeadId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* segue para o alternativo */
  }
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Telefone no formato que o Google e o Meta esperam (E.164): dígitos com o
 * código do país. Sem isso a taxa de correspondência das conversões aprimoradas
 * cai — "(614) 384-5917" e "+16143845917" não casam do outro lado.
 */
export function toE164(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`; // número dos EUA sem o país
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

/**
 * Anuncia o lead no dataLayer. Nunca lança: medição com problema não pode
 * interferir no envio do formulário, que é o que realmente importa.
 */
export function pushLeadEvent({ form, page, leadId, fields }: LeadEvent): void {
  try {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];

    const email = (fields?.email || "").trim().toLowerCase();
    const phone = toE164(fields?.phone || "");

    w.dataLayer.push({
      event: "generate_lead",
      form_id: form,
      form_location: page,
      lead_id: leadId,
      // Nomes conforme a documentação do Google, para o mapeamento no GTM ser direto.
      user_data: {
        email_address: email,
        phone_number: phone,
        address: {
          first_name: (fields?.firstName || "").trim(),
          last_name: (fields?.lastName || "").trim(),
          postal_code: (fields?.zip || "").trim(),
          country: "US",
        },
      },
    });
  } catch {
    /* silêncio de propósito */
  }
}
