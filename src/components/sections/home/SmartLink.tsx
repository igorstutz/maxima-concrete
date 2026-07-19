import Link from "next/link";
import type { ReactNode } from "react";
import { internalLink } from "./legacy";

/** Link interno via next/link; URLs externas abrem em nova aba. */
export function SmartLink({
  href,
  className = "",
  children,
  ariaLabel,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const url = internalLink(href);
  if (url.startsWith("http")) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={url} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
