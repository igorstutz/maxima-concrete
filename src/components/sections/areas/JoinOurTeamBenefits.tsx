import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

interface BenefitItem {
  title?: string;
  description?: string;
}

/** Benefícios da página Join Our Team — type "joinourteam-sec-benefits". */
export default function JoinOurTeamBenefits({
  content,
}: {
  content: Record<string, any>;
}) {
  const items: BenefitItem[] = Array.isArray(content?.items) ? content.items : [];

  return (
    <section className="bg-surface py-16 lg:py-24">
      <Container>
        <ScrollReveal className="mb-10 max-w-3xl lg:mb-14">
          {content?.eyebrow && (
            <div className="mb-4 inline-flex items-center rounded-full border border-ocean/15 bg-white px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-ocean">
                {content.eyebrow}
              </span>
            </div>
          )}
          {content?.title && (
            <h2 className="text-3xl font-bold leading-tight tracking-[-1px] text-navy md:text-4xl lg:text-5xl">
              {content.title}
            </h2>
          )}
          {content?.description && (
            <p className="mt-4 text-base leading-relaxed text-gray-600 lg:text-lg">
              {content.description}
            </p>
          )}
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((it, i) => (
            <ScrollReveal key={i} delay={Math.min(i % 3, 2)} className="flex">
              <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 transition-colors hover:border-ocean/30 lg:p-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10 font-bold text-ocean">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {it.title && (
                  <h3 className="text-lg font-semibold leading-snug text-navy lg:text-xl">
                    {it.title}
                  </h3>
                )}
                {it.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 lg:text-base">
                    {it.description}
                  </p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
