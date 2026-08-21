"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Decide quem recebe o menu flutuante e o rodapé.
 *
 * Eles pertencem ao site público. O painel interno em /admin é ferramenta de
 * trabalho: o menu de 350px cobriria a tabela de leads e o rodapé cheio de
 * chamadas para orçamento não tem função nenhuma ali.
 *
 * O menu e o rodapé continuam renderizados no servidor e chegam aqui como
 * props — este componente só escolhe se entram na página.
 */
export function SiteChrome({
  nav,
  footer,
  children,
}: {
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const paginaInterna = (pathname || "").startsWith("/admin");

  return (
    <>
      {!paginaInterna && nav}
      {children}
      {!paginaInterna && footer}
    </>
  );
}
