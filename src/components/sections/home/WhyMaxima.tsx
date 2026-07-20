import { Clock, Star, Users, ArrowRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "./SmartLink";
import WhyMaximaCarousel from "./WhyMaximaCarousel";

interface WhyMaximaContent {
  questionTitle?: string;
  tagline?: string;
  description1?: string;
  description2?: string;
  benefit1?: string;
  benefit2?: string;
  benefit3?: string;
  ctaText?: string;
  ctaLink?: string;
  mainImage?: string;
  images?: string[];
}

// Só permite <b>/<strong> vindos do CMS (paridade com o site antigo).
const sanitizeHtml = (html: string): string =>
  html
    .replace(/<(?!\/?(b|strong)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");

const BENEFIT_ICONS = [Clock, Star, Users];

export default function WhyMaxima({ content }: { content: Record<string, any> }) {
  const c = content as WhyMaximaContent;
  const questionTitle = c.questionTitle || "What sets Maxima Concrete apart?";
  const [before, after] = questionTitle.includes("Maxima Concrete")
    ? questionTitle.split("Maxima Concrete")
    : [questionTitle, undefined];
  const benefits = [c.benefit1, c.benefit2, c.benefit3].filter(Boolean) as string[];
  const carouselImages = (c.images?.filter(Boolean) as string[] | undefined)?.length
    ? (c.images!.filter(Boolean) as string[])
    : c.mainImage
      ? [c.mainImage]
      : [];

  return (
    <section id="why-maxima" className="bg-white py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:gap-8">
          {/* Coluna esquerda — título + imagem + tagline */}
          <ScrollReveal className="flex flex-1 flex-col items-center gap-5 md:max-w-[643px]">
            <h2 className="w-full text-center text-xl font-medium leading-8 text-ocean md:text-left md:text-2xl md:leading-10">
              {before}
              {after !== undefined && (
                <>
                  <span className="font-semibold">Maxima Concrete</span>
                  {after}
                </>
              )}
            </h2>
            <WhyMaximaCarousel images={carouselImages} />
            <p className="text-center text-lg font-medium leading-6 text-zinc-700 md:text-2xl md:leading-7">
              {c.tagline}
            </p>
          </ScrollReveal>

          {/* Coluna direita — descrições, benefícios, selos e CTA */}
          <ScrollReveal
            direction="right"
            className="flex flex-1 flex-col items-center justify-start gap-5 md:mt-14 md:max-w-[400px] md:items-start"
          >
            <div className="w-full text-center md:text-left">
              <p
                className="mb-2 text-sm font-medium leading-5 text-zinc-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.description1 || "") }}
              />
              <p
                className="text-base font-semibold leading-6 text-zinc-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.description2 || "") }}
              />
            </div>

            <div className="flex w-full flex-col items-center gap-3.5 md:items-start">
              {benefits.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[i] || Star;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon className="h-5 w-5 shrink-0 text-ocean" />
                    <span className="text-lg font-medium leading-7 text-ocean md:text-xl md:leading-8">
                      {benefit}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex w-full items-center justify-center gap-5 md:justify-start">
              <Image
                src="/images/assets/licensed-insured.png"
                alt="Licensed & Insured badge"
                width={112}
                height={56}
                className="h-14 w-28 object-contain"
              />
              <Image
                src="/images/assets/rating_A+.png"
                alt="BBB A+ rating badge"
                width={64}
                height={56}
                className="h-14 w-16 object-contain"
              />
            </div>

            <SmartLink
              href={c.ctaLink}
              className="gradient-navy inline-flex items-center gap-2.5 rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {c.ctaText}
              <ArrowRight className="h-3 w-3" />
            </SmartLink>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
