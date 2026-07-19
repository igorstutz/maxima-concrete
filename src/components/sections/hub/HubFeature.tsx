import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { HubCtaButton } from "./shared";

interface HubFeatureContent {
  title?: string;
  paragraphs?: string[];
  tagline?: string;
  taglineDescription?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

/** Hub Feature — imagem de fundo escura, copy longa sobre um sub-serviço, CTA. */
export default function HubFeature({ content }: { content: Record<string, any> }) {
  const c = content as HubFeatureContent;
  const paragraphs = c.paragraphs || [];
  const backgroundImage = legacyAsset(c.backgroundImage);

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a]">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 py-16 md:py-24">
        <Container>
          <ScrollReveal className="max-w-2xl">
            <h2 className="mb-8 whitespace-pre-line text-3xl font-light leading-tight tracking-[-1px] text-white md:text-5xl">
              {c.title}
            </h2>
            <div className="mb-8 space-y-5">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="whitespace-pre-line text-sm leading-relaxed text-white/90 md:text-base"
                >
                  {p}
                </p>
              ))}
            </div>
            {c.tagline && (
              <p className="mb-1 text-sm font-semibold text-white md:text-base">
                {c.tagline}
              </p>
            )}
            {c.taglineDescription && (
              <p className="mb-10 text-sm text-white/90 md:text-base">
                {c.taglineDescription}
              </p>
            )}
            <div className="flex items-center gap-6">
              <div className="hidden flex-1 border-t border-white/50 md:block" />
              <HubCtaButton text={c.ctaText} link={c.ctaLink} variant="light" />
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
