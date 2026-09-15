"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { registrarPagina, registrarVisita } from "@/lib/attribution";

/**
 * Liga a atribuição ao site: abre a sessão, conta as páginas vistas e avisa o
 * servidor UMA vez por sessão.
 *
 * Uma vez por sessão, e não por página, é a decisão de desempenho que sustenta
 * o resto: navegar pelo site não gera requisição nenhuma, e mesmo assim o
 * caminho inteiro até o contato fica guardado — ele viaja junto do formulário
 * ou do clique de ligar, quando a conversão acontece. O beacon de sessão existe
 * só para dois fins que o navegador não resolve sozinho: saber quantas visitas
 * NÃO viraram lead (sem isso não há taxa de conversão por canal) e renovar o
 * cookie do visitante pelo servidor, que é o que faz o Safari parar de zerar o
 * histórico a cada 7 dias.
 */
export function AttributionTracker() {
  const pathname = usePathname();
  const jaAbriu = useRef(false);

  useEffect(() => {
    // Painel interno fora da medição, pela mesma razão que o GTM já é barrado
    // lá: visita da equipe entraria como tráfego e sujaria a atribuição.
    if (pathname?.startsWith("/admin")) return;

    const r = registrarVisita();
    if (!r) return;
    registrarPagina(window.location.pathname);

    if (!r.novaSessao || jaAbriu.current) return;
    jaAbriu.current = true;

    // Sessão nova: um aviso ao servidor, fora do caminho crítico da página.
    const enviar = () => {
      try {
        const corpo = JSON.stringify({
          vid: r.jornada.vid,
          sessions: r.jornada.sessions,
          first_seen: r.jornada.createdAt,
          ...r.toque,
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track.php", new Blob([corpo], { type: "application/json" }));
        } else {
          fetch("/api/track.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: corpo,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        /* medição nunca atrapalha a navegação */
      }
    };

    // Espera o navegador ficar ocioso: a primeira tela não divide banda com isto.
    if ("requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, o?: object) => void })
        .requestIdleCallback(enviar, { timeout: 4000 });
    } else {
      setTimeout(enviar, 1200);
    }
    // `pathname` fora das dependências de propósito: a sessão abre uma vez só,
    // e as páginas seguintes são contadas pelo efeito de baixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trocas de rota (o site navega sem recarregar) também são páginas vistas.
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return; // a primeira já entrou no efeito acima
    }
    if (pathname?.startsWith("/admin")) return;
    registrarVisita(); // renova o relógio da sessão
    registrarPagina(pathname || "/");
  }, [pathname]);

  return null;
}
