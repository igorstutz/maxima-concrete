/**
 * Eventos de conversão do site.
 *
 * O site não conhece Meta, GA4 nem qualquer ferramenta: ele apenas anuncia no
 * dataLayer que um lead foi enviado. Quem traduz isso em tag (Pixel do Meta,
 * conversão do Google Ads, GA4) é o Google Tag Manager — assim mudar de
 * ferramenta é configuração no painel do GTM, sem tocar no código nem publicar
 * o site de novo.
 *
 * `leadId` é gerado aqui e enviado junto ao servidor no mesmo envio. Quando a
 * API de Conversões do Meta entrar (envio servidor-a-servidor), ela usa esse
 * mesmo identificador como `event_id`: é o que faz o Meta entender que o evento
 * do navegador e o do servidor são o MESMO lead, em vez de contar dois.
 */

type LeadEvent = {
  /** Qual formulário enviou: "contact" | "join_our_team" */
  form: string;
  /** Caminho da página onde o formulário foi enviado */
  page: string;
  /** Identificador único deste envio, compartilhado com o servidor */
  leadId: string;
};

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
 * Anuncia o lead no dataLayer. Nunca lança: medição com problema não pode
 * interferir no envio do formulário, que é o que realmente importa.
 */
export function pushLeadEvent({ form, page, leadId }: LeadEvent): void {
  try {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: "generate_lead",
      form_id: form,
      form_location: page,
      lead_id: leadId,
    });
  } catch {
    /* silêncio de propósito */
  }
}
