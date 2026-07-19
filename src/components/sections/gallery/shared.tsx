import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { SmartLink } from "@/components/sections/home/SmartLink";

/** Only allow <b>/<strong>/<br> coming from the CMS (parity with the old site). */
export const sanitizeHtml = (html: string): string =>
  (html || "")
    .replace(/<(?!\/?(b|strong|br)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");

/** Standard gradient CTA (ocean→navy) used across gallery/finishes sections. */
export function GradientCta({
  text,
  link,
  className = "",
}: {
  text?: string;
  link?: string;
  className?: string;
}) {
  if (!text) return null;
  return (
    <SmartLink
      href={link || "#contact"}
      className={`gradient-navy inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:brightness-110 md:px-6 md:py-3 ${className}`}
    >
      {text}
      <ArrowUpRight className="h-4 w-4" />
    </SmartLink>
  );
}

/** Render CMS `**bold**` markers as <strong> (parity with the old renderer). */
export function renderBoldText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
