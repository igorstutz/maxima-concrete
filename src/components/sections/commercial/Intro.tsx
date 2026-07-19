import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./sanitize";

interface CommercialIntroContent {
  image?: string;
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
}

/** type: "commercial-intro" — imagem à esquerda + texto à direita, fundo branco. */
export default function Intro({ content }: { content: Record<string, any> }) {
  const c = content as CommercialIntroContent;
  const image = legacyAsset(c.image);
  const title = c.title || "We Take Your Business Seriously";

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Esquerda – Imagem */}
          <ScrollReveal className="flex justify-center lg:justify-start">
            {image ? (
              <Image
                src={image}
                alt={title}
                width={550}
                height={347}
                sizes="(min-width: 1024px) 550px, 100vw"
                className="aspect-[550/347] w-full rounded-xl object-cover md:rounded-2xl lg:h-[347px] lg:w-[550px]"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[550/347] w-full rounded-xl bg-gray-100 md:rounded-2xl lg:h-[347px] lg:w-[550px]" />
            )}
          </ScrollReveal>

          {/* Direita – Texto */}
          <ScrollReveal className="flex flex-col justify-center">
            <h2 className="mb-4 w-full text-2xl font-medium leading-[120%] tracking-[-1.6px] text-[#494948] md:mb-6 md:text-[32px] lg:max-w-[335px]">
              {title}
            </h2>
            {c.paragraph1 && (
              <p
                className="mb-4 w-full whitespace-pre-line text-sm font-normal leading-[145%] tracking-[-0.56px] text-[#494948] lg:max-w-[316px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paragraph1) }}
              />
            )}
            {c.paragraph2 && (
              <p
                className="w-full whitespace-pre-line text-sm font-normal leading-[145%] tracking-[-0.56px] text-[#494948] lg:max-w-[316px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paragraph2) }}
              />
            )}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
