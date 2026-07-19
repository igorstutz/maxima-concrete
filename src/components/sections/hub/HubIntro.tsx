import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { HubCtaButton } from "./shared";

interface HubIntroContent {
  title?: string;
  leadText?: string;
  paragraph1?: string;
  paragraph2?: string;
  imageTop?: string;
  imageBottom?: string;
  ctaText?: string;
  ctaLink?: string;
}

/** Hub Intro — seção clara, heading + lead, duas imagens e dois parágrafos, CTA. */
export default function HubIntro({ content }: { content: Record<string, any> }) {
  const c = content as HubIntroContent;
  const imageTop = legacyAsset(c.imageTop);
  const imageBottom = legacyAsset(c.imageBottom);

  return (
    <section className="bg-white">
      <Container className="space-y-10 py-14 md:py-20">
        <ScrollReveal>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="mb-5 whitespace-pre-line text-3xl font-medium leading-tight tracking-[-1px] text-navy md:text-4xl">
                {c.title}
              </h2>
              {c.leadText && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#3A4A56] md:text-base">
                  {c.leadText}
                </p>
              )}
            </div>
            {imageTop && (
              <div className="relative h-56 w-full overflow-hidden rounded-lg md:h-64">
                <Image
                  src={imageTop}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {imageBottom && (
              <div className="relative h-56 w-full overflow-hidden rounded-lg md:h-64">
                <Image
                  src={imageBottom}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-5">
              {c.paragraph1 && (
                <p className="whitespace-pre-line text-justify text-sm leading-relaxed text-[#3A4A56] md:text-base">
                  {c.paragraph1}
                </p>
              )}
              {c.paragraph2 && (
                <p className="whitespace-pre-line text-justify text-sm leading-relaxed text-[#3A4A56] md:text-base">
                  {c.paragraph2}
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>

        <HubCtaButton text={c.ctaText} link={c.ctaLink} variant="dark" />
      </Container>
    </section>
  );
}
