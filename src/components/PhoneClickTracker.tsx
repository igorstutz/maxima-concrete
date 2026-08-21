"use client";

import { useEffect } from "react";
import { pushPhoneClick } from "@/lib/analytics";

/**
 * Registra cliques em telefone, que aqui valem tanto quanto formulário —
 * boa parte do cliente liga em vez de escrever.
 *
 * Faz duas coisas por clique:
 *  1. anuncia no dataLayer, para o GTM tratar como conversão (Meta, Google Ads);
 *  2. grava no servidor, para o painel de leads mostrar as ligações por dia e
 *     por posição na página — o que nenhuma ferramenta externa entrega.
 *
 * Escuta na fase de captura no documento inteiro: os botões de telefone estão
 * espalhados em menu, rodapé, hero e seções de contato, e assim nenhum precisa
 * saber que existe medição.
 */
export function PhoneClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const alvo = e.target as HTMLElement | null;
      const link = alvo?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (!href.toLowerCase().startsWith("tel:")) return;

      // Onde na página o clique aconteceu — é o que diferencia "ligou do menu"
      // de "ligou depois de ler a página toda".
      let posicao = "body";
      if (link.closest("header")) posicao = "header";
      else if (link.closest("footer")) posicao = "footer";
      else if (link.closest("form")) posicao = "contact_form";
      else if (link.closest("nav")) posicao = "menu";

      const pagina = window.location.pathname;

      pushPhoneClick({ location: posicao, page: pagina });

      // Envio "atire e esqueça": não pode atrasar a discagem. sendBeacon
      // sobrevive à saída da página, que é exatamente o que acontece aqui.
      try {
        const corpo = JSON.stringify({ location: posicao, page: pagina });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track-call.php", corpo);
        } else {
          fetch("/api/track-call.php", { method: "POST", body: corpo, keepalive: true }).catch(
            () => {},
          );
        }
      } catch {
        /* medição nunca atrapalha a ligação */
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
