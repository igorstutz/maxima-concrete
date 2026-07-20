import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { HubCtaButton } from "@/components/sections/hub/shared";

interface PaverOfferContent {
  title?: string;
  icon?: string;
  items?: string[];
  paragraph?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

/**
 * paver-offer — faixa escura com ícone + título, lista de benefícios em bullets,
 * parágrafo e um CTA branco à direita de uma divisória. Imagem de fundo escurecida.
 */
export default function PaverOffer({ content }: { content: Record<string, any> }) {
  const c = content as PaverOfferContent;
  const items = c.items || [];
  const backgroundImage = legacyAsset(c.backgroundImage);

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a]">
      {backgroundImage && (
        <Image src={backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 py-16 md:py-24">
        <Container>
          <ScrollReveal className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              {c.icon && (
                <Image
                  src={legacyAsset(c.icon)}
                  alt=""
                  width={48}
                  height={48}
                  className="h-9 w-auto shrink-0 md:h-12"
                />
              )}
              <h2 className="whitespace-pre-line text-3xl font-light leading-tight tracking-[-1px] text-white md:text-5xl">
                {c.title}
              </h2>
            </div>

            {items.length > 0 && (
              <ul className="mb-8 space-y-2.5">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/90 md:text-lg">
                    <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {c.paragraph && (
              <p className="mb-10 max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/80 md:text-base">
                {c.paragraph}
              </p>
            )}

            <div className="flex items-center gap-6">
              <div className="hidden flex-1 border-t border-white/40 md:block" />
              <HubCtaButton text={c.ctaText} link={c.ctaLink} variant="light" />
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
