import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

/**
 * trust — seção preta com título em 3 linhas + descrição à esquerda e imagem à
 * direita (DrivewaysPageTrustRenderer).
 */
export default function Trust({ content }: { content: Record<string, any> }) {
  const titleLine1 = content?.titleLine1 || "";
  const titleLine2 = content?.titleLine2 || "";
  const titleLine3 = content?.titleLine3 || "";
  const description = content?.description || "";
  const image = legacyAsset(content?.image);

  return (
    <section className="w-full bg-black py-10 sm:py-14 md:py-16 lg:py-24">
      <Container>
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:gap-12">
          {/* Coluna esquerda — texto */}
          <ScrollReveal className="flex-1 lg:pr-8">
            <h2 className="mb-4 text-2xl font-medium leading-[1.2] tracking-[-0.5px] text-white sm:mb-6 sm:text-[28px] md:text-[32px]">
              {titleLine1}
              <br />
              {titleLine2}
              <br />
              {titleLine3}
            </h2>
            {/* Descrição — suporta <b> */}
            <p
              className="text-xs leading-[1.7] text-white/80 sm:text-sm [&>b]:font-semibold [&>b]:text-white"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          </ScrollReveal>

          {/* Divisores */}
          <div className="hidden h-[300px] w-px bg-white/20 lg:block" />
          <div className="my-2 h-px w-full bg-white/20 lg:hidden" />

          {/* Coluna direita — imagem */}
          <ScrollReveal direction="right" className="w-full flex-1 lg:pl-8">
            <div className="relative h-[200px] overflow-hidden rounded-xl sm:h-[240px] sm:rounded-2xl md:h-[280px] lg:h-[320px]">
              {image && (
                <Image
                  src={image}
                  alt="Maxima Concrete project"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
