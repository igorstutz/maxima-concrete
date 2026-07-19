import Image from "@/components/Image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./sanitize";

interface MaximaStandardContent {
  title?: string;
  subtitle?: string;
  paragraph1?: string;
  paragraph2?: string;
  image?: string;
  backgroundImage?: string;
}

/**
 * type: "maxima-standard" — split full-bleed: painel de texto escuro (esquerda,
 * com imagem de fundo esmaecida opcional) + imagem (direita).
 */
export default function MaximaStandard({ content }: { content: Record<string, any> }) {
  const c = content as MaximaStandardContent;
  const title = c.title || "The Maxima Standard";
  const subtitle = c.subtitle ?? "Where Function Meets Design";
  const image = legacyAsset(c.image);
  const backgroundImage = legacyAsset(c.backgroundImage);

  return (
    <section className="overflow-hidden bg-navy">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_478px]">
        {/* Esquerda – painel escuro de texto com imagem de fundo esmaecida */}
        <div className="relative py-16 sm:py-24">
          {backgroundImage && (
            <>
              <Image
                src={backgroundImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-navy/90" />
            </>
          )}
          {/* O Container não funciona aqui: esta coluna do grid desconta os
              478px da imagem, então a centralização sairia deslocada. O pl
              reproduz a coluna padrão do site medida a partir da viewport:
              350px (menu) + px-8 + max(0, (viewport − 350 − 1200)/2),
              onde viewport = largura desta coluna (100%) + 478px. */}
          <div className="relative px-4 sm:px-6 lg:pl-[calc(350px+2rem+max(0px,(100%+478px-1550px)/2))] lg:pr-10">
            <div className="max-w-[640px]">
              <ScrollReveal>
                <h2
                  className="text-2xl font-semibold leading-[120%] tracking-[-1.28px] text-white md:text-[32px]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
                />
                {subtitle && (
                  <p
                    className="mb-6 mt-1 text-base leading-[130%] tracking-[-0.54px] text-white/90 md:text-[18px]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitle) }}
                  />
                )}
                {c.paragraph1 && (
                  <p
                    className="mb-5 whitespace-pre-line text-sm leading-[160%] tracking-[-0.28px] text-[#E5E7EB]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paragraph1) }}
                  />
                )}
                {c.paragraph2 && (
                  <p
                    className="whitespace-pre-line text-sm leading-[160%] tracking-[-0.28px] text-[#E5E7EB]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paragraph2) }}
                  />
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Direita – imagem */}
        <div className="relative min-h-[260px] bg-navy md:min-h-[360px] lg:min-h-full">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 478px, 100vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
        </div>
      </div>
    </section>
  );
}
