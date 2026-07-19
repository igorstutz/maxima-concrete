import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

/** Intro "Built on Trust" da página Why Maxima — type "why-maxima-intro". */
export default function WhyMaximaIntro({ content }: { content: Record<string, any> }) {
  const subtitle: string = content?.subtitle || "WHY MAXIMA?";
  const title: string = content?.title || "Built on Trust.\nDriven by Precision.";
  const paragraph1: string = content?.paragraph1 || "";
  const paragraph2: string = content?.paragraph2 || "";
  const buttonText: string = content?.buttonText || "Contact Us";
  const buttonLink: string = content?.buttonLink || "/contact-us";
  const image1: string = legacyAsset(content?.image1);
  const image2: string = legacyAsset(content?.image2);

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-20 lg:py-28">
      <Container>
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-16">
          {/* Esquerda — texto */}
          <ScrollReveal className="min-w-0 flex-1">
            <p className="mb-3 text-sm font-normal uppercase tracking-[2.2px] text-[#494948] md:mb-4 md:text-xl">
              {subtitle}
            </p>
            <h2 className="mb-5 whitespace-pre-line text-[28px] font-normal leading-[115%] tracking-[-1.92px] text-[#494948] md:mb-8 md:text-5xl">
              {title}
            </h2>
            {paragraph1 && (
              <p
                className="mb-4 text-sm font-medium tracking-[-0.56px] text-[#484848] md:mb-5"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(paragraph1) }}
              />
            )}
            {paragraph2 && (
              <p
                className="mb-6 text-sm font-medium tracking-[-0.56px] text-[#484848] md:mb-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(paragraph2) }}
              />
            )}
            {buttonText && (
              <SmartLink
                href={buttonLink}
                className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
              >
                {buttonText}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </SmartLink>
            )}
          </ScrollReveal>

          {/* Direita — duas imagens sobrepostas */}
          <ScrollReveal
            direction="right"
            className="relative min-h-[250px] w-full flex-1 sm:min-h-[350px] md:min-h-[474px]"
          >
            {image1 && (
              <div className="absolute right-0 top-0 z-10 h-[220px] w-[75%] max-w-[535px] overflow-hidden rounded-xl shadow-xl sm:h-[320px] sm:w-[80%] md:h-[474px]">
                <Image
                  src={image1}
                  alt="Maxima Concrete craftsmanship"
                  fill
                  sizes="(min-width: 1024px) 535px, 80vw"
                  className="object-cover"
                />
              </div>
            )}
            {image2 && (
              <div className="absolute bottom-0 left-0 z-20 h-[150px] w-[45%] max-w-[241px] overflow-hidden rounded-xl border-4 border-white shadow-2xl sm:h-[200px] sm:w-[50%] md:h-[250px]">
                <Image
                  src={image2}
                  alt="Maxima Concrete team at work"
                  fill
                  sizes="241px"
                  className="object-cover"
                />
              </div>
            )}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
