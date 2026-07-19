import { ArrowUpRight } from "lucide-react";
import { SmartLink } from "@/components/sections/home/SmartLink";

/**
 * Only allows <b>/<strong>/<br> coming from the CMS — parity with
 * `sanitizeHtml` from the old site (src/lib/sanitizeHtml.ts).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<(?!\/?(b|strong|br)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}

const CTA_VARIANTS = {
  /** ocean -> navy gradient (primary button of the old site) */
  gradient: "gradient-navy text-white hover:opacity-90",
  /** white button used over dark imagery */
  white: "bg-white text-navy hover:bg-white/90",
  /** white outlined button (Dream Kitchen) */
  outline: "border border-white text-white hover:bg-white/10",
} as const;

/**
 * CTA shared by the outdoor family sections. Padding is passed via
 * className so each section can keep the exact spacing of the old renderers.
 */
export function CtaButton({
  text,
  link,
  variant = "gradient",
  className = "px-6 py-3",
}: {
  text?: string;
  link?: string;
  variant?: keyof typeof CTA_VARIANTS;
  className?: string;
}) {
  if (!text) return null;
  return (
    <SmartLink
      href={link || "#contact"}
      className={`inline-flex items-center gap-2.5 rounded-[10px] text-sm font-medium transition-all duration-300 ${CTA_VARIANTS[variant]} ${className}`}
    >
      {text}
      <ArrowUpRight className="h-4 w-4" />
    </SmartLink>
  );
}
