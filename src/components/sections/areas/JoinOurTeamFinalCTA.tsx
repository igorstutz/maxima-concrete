import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";

/** CTA final da página Join Our Team — type "joinourteam-sec-final-cta". */
export default function JoinOurTeamFinalCTA({
  content,
}: {
  content: Record<string, any>;
}) {
  const ctaLink: string = content?.ctaLink || "#apply";
  const secondaryCtaLink: string = content?.secondaryCtaLink || "#contact";
  // mailto:/tel:/#âncora não passam pelo next/link
  const isPlainAnchor = (href: string) =>
    href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");

  const primaryClasses =
    "inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-surface";
  const secondaryClasses =
    "inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10";

  return (
    <section
      id="apply"
      className="scroll-mt-20 bg-gradient-to-br from-navy via-[#072B45] to-ocean py-16 lg:py-24"
    >
      <Container>
        <ScrollReveal>
          {content?.title && (
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-[-1px] text-white md:text-4xl lg:text-5xl">
              {content.title}
            </h2>
          )}
          {content?.description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 lg:text-lg">
              {content.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {content?.ctaText &&
              (isPlainAnchor(ctaLink) ? (
                <a href={ctaLink} className={primaryClasses}>
                  {content.ctaText} <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <SmartLink href={ctaLink} className={primaryClasses}>
                  {content.ctaText} <ArrowRight className="h-4 w-4" />
                </SmartLink>
              ))}
            {content?.secondaryCtaText &&
              (isPlainAnchor(secondaryCtaLink) ? (
                <a href={secondaryCtaLink} className={secondaryClasses}>
                  {content.secondaryCtaText}
                </a>
              ) : (
                <SmartLink href={secondaryCtaLink} className={secondaryClasses}>
                  {content.secondaryCtaText}
                </SmartLink>
              ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
