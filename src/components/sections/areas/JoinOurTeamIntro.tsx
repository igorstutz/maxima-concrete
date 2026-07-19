import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

/** Intro da página Join Our Team — type "joinourteam-sec-intro". */
export default function JoinOurTeamIntro({ content }: { content: Record<string, any> }) {
  const stats = [
    { v: content?.stat1Value, l: content?.stat1Label },
    { v: content?.stat2Value, l: content?.stat2Label },
    { v: content?.stat3Value, l: content?.stat3Label },
  ].filter((s) => s.v || s.l);

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <ScrollReveal>
          {content?.eyebrow && (
            <div className="mb-4 inline-flex items-center rounded-full bg-ocean/10 px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-ocean">
                {content.eyebrow}
              </span>
            </div>
          )}
          {content?.title && (
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-[-1px] text-navy md:text-4xl lg:text-5xl">
              {content.title}
            </h2>
          )}
          <div className="mt-8 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {content?.paragraph1 && (
              <p className="text-base leading-relaxed text-gray-600 lg:text-lg">
                {content.paragraph1}
              </p>
            )}
            {content?.paragraph2 && (
              <p className="text-base leading-relaxed text-gray-600 lg:text-lg">
                {content.paragraph2}
              </p>
            )}
          </div>
        </ScrollReveal>
        {stats.length > 0 && (
          <ScrollReveal className="mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t border-gray-200 pt-10 md:grid-cols-3 lg:mt-16 lg:gap-10">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold tracking-[-0.5px] text-ocean lg:text-4xl">
                  {s.v}
                </div>
                <div className="mt-1 text-sm text-gray-600">{s.l}</div>
              </div>
            ))}
          </ScrollReveal>
        )}
      </Container>
    </section>
  );
}
