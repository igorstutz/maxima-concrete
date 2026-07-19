import type { ReactNode } from "react";

/**
 * Container padrão ÚNICO de todo o site — a correção do maior problema do
 * site original, onde cada seção calculava a própria largura.
 *
 * O menu lateral flutuante ocupa 350px no desktop (lg+). Este componente
 * reserva esse espaço UMA vez e centraliza o conteúdo no espaço restante,
 * de modo que todas as seções alinhem exatamente nas mesmas colunas.
 *
 * O fundo da seção (cor/imagem) deve ficar no <section> externo, que
 * continua full-bleed; apenas o conteúdo passa por aqui.
 */
interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** "default" 1200px · "wide" 1400px (footer) · "narrow" 768px (texto corrido) */
  width?: "default" | "wide" | "narrow";
}

const MAX_WIDTH = {
  default: "max-w-[1200px]",
  wide: "max-w-[1400px]",
  narrow: "max-w-3xl",
} as const;

export function Container({
  children,
  className = "",
  width = "default",
}: ContainerProps) {
  return (
    <div className="w-full lg:pl-[350px]">
      <div
        className={`mx-auto w-full ${MAX_WIDTH[width]} px-4 sm:px-6 lg:px-8 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
