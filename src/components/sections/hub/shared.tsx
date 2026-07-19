import { ArrowUpRight } from "lucide-react";
import { SmartLink } from "@/components/sections/home/SmartLink";

/**
 * Botão padrão das páginas hub — paridade visual com o HubCtaButton do site
 * antigo, mas como link real (SmartLink) em vez de button+navigate.
 */
export function HubCtaButton({
  text,
  link,
  variant = "dark",
}: {
  text?: string;
  link?: string;
  variant?: "dark" | "light";
}) {
  if (!text) return null;
  const styles =
    variant === "dark"
      ? "bg-[#0B3049] text-white hover:bg-ocean"
      : "bg-white text-ocean hover:bg-gray-100";
  return (
    <SmartLink
      href={link || "#contact"}
      className={`inline-flex items-center gap-2 ${styles} rounded-lg px-6 py-3 text-sm font-medium shadow-md transition-colors duration-300 md:text-base`}
    >
      {text}
      <ArrowUpRight className="h-4 w-4" />
    </SmartLink>
  );
}

/**
 * Botão branco das seções "Why Maxima" (simple/sports/detailed) — paridade
 * com o botão inline do site antigo (texto navy, hover translúcido).
 */
export function WhyMaximaCtaButton({
  text,
  link,
}: {
  text?: string;
  link?: string;
}) {
  if (!text) return null;
  return (
    <SmartLink
      href={link || "#contact"}
      className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-medium text-navy transition-colors hover:bg-white/90 sm:px-6 sm:py-3 sm:text-sm"
    >
      {text}
      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    </SmartLink>
  );
}

/** Só permite <b>/<strong> vindos do CMS (paridade com o site antigo). */
export const sanitizeHtml = (html: string): string =>
  html
    .replace(/<(?!\/?(b|strong)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
