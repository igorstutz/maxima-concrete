import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

interface PositionItem {
  title?: string;
  type?: string;
  location?: string;
  description?: string;
}

/** Vagas abertas da página Join Our Team — type "joinourteam-sec-positions". */
export default function JoinOurTeamPositions({
  content,
}: {
  content: Record<string, any>;
}) {
  const items: PositionItem[] = Array.isArray(content?.items) ? content.items : [];
  const applyLink: string = content?.applyLink || "#apply";
  const applyLabel: string = content?.applyLabel || "Apply now";

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <ScrollReveal className="mb-10 max-w-3xl lg:mb-14">
          {content?.eyebrow && (
            <div className="mb-4 inline-flex items-center rounded-full bg-ocean/10 px-3 py-1">
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
        <div className="space-y-4">
          {items.map((it, i) => (
            <ScrollReveal key={i}>
              <div className="group flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 transition-all hover:border-ocean hover:shadow-[0_8px_24px_-12px_rgba(13,93,147,0.25)] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-7">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {it.type && (
                      <span className="inline-flex items-center rounded-full bg-ocean/10 px-2.5 py-0.5 text-xs font-medium text-ocean">
                        {it.type}
                      </span>
                    )}
                    {it.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" /> {it.location}
                      </span>
                    )}
                  </div>
                  {it.title && (
                    <h3 className="text-xl font-semibold leading-snug text-navy lg:text-2xl">
                      {it.title}
                    </h3>
                  )}
                  {it.description && (
                    <p className="mt-1.5 text-sm text-gray-600 lg:text-base">
                      {it.description}
                    </p>
                  )}
                </div>
                <a
                  href={applyLink}
                  className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ocean"
                >
                  {applyLabel} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </ScrollReveal>
          ))}
          {items.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              No open positions at the moment.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
