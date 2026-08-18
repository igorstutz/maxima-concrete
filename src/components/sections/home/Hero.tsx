import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { heroPicture } from "@/lib/hero-image";
import { SmartLink } from "./SmartLink";

interface HeroContent {
  title?: string;
  tagline?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
}

const HERO_ALT =
  "Custom concrete driveway and outdoor living space by Maxima Concrete in Ohio";


export default function Hero({ content }: { content: Record<string, any> }) {
  const c = content as HeroContent;

  // Algumas seções "hero" do CMS não têm imagem (ex.: projectmap_page) —
  // nesse caso usamos fundo navy sólido em vez de <picture>.
  const { imgProps, mobileProps } = heroPicture({
    desktop: c.backgroundImage,
    mobile: c.backgroundImageMobile,
    alt: HERO_ALT,
  });

  return (
    <section
      id="home"
      className={`relative min-h-[85vh] overflow-hidden lg:min-h-screen ${
        imgProps ? "" : "bg-navy"
      }`}
    >
      {/* Imagem de fundo com zoom lento (igual ao original) */}
      {imgProps && (
        <picture>
          {mobileProps && (
            // Sem `type`: o srcset mistura formatos (variantes webp e, quando
            // nenhuma cobre a largura pedida, o arquivo original .jpg), então
            // declarar um MIME fixo faria o navegador descartar o candidato
            // certo. O `media` sozinho já faz a seleção.
            <source
              media="(max-width: 768px)"
              srcSet={mobileProps.srcSet}
              sizes="100vw"
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...imgProps}
            alt={HERO_ALT}
            fetchPriority="high"
            loading="eager"
            className="animate-hero-zoom absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}

      {/* Overlay escuro + gradiente para baixo */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b from-stone-900/0 to-stone-900" />

      {/* Conteúdo ancorado embaixo */}
      <div className="relative z-10 flex min-h-[85vh] items-end pb-16 pt-28 lg:min-h-screen lg:pb-24">
        <Container className="w-full">
          <div className="flex max-w-[480px] flex-col items-start gap-4 lg:gap-5">
            <h1 className="text-shadow-hero text-2xl font-medium leading-tight text-white md:text-3xl lg:text-4xl lg:leading-10">
              {c.title}
            </h1>

            {c.tagline && (
              <p className="-mt-2 whitespace-pre-line text-lg font-light leading-snug tracking-[-0.4px] text-white/90 md:text-xl lg:-mt-3 lg:text-[22px]">
                {c.tagline}
              </p>
            )}

            {c.subtitle && (
              <p className="whitespace-pre-line text-[16px] font-normal leading-[130%] tracking-[-0.96px] text-white md:text-[20px] lg:max-w-96">
                {c.subtitle}
              </p>
            )}

            <div className="flex flex-col items-start gap-3">
              {c.ctaText && (
                <SmartLink
                  href={c.ctaLink}
                  className="gradient-navy inline-flex items-center justify-center gap-2.5 rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
                >
                  {c.ctaText}
                  <ArrowRight className="h-3 w-3" />
                </SmartLink>
              )}

              {c.secondaryCtaText && (
                <SmartLink
                  href={c.secondaryCtaLink}
                  className="inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-white px-5 py-2.5 text-sm font-medium text-navy transition-all hover:brightness-95"
                >
                  {c.secondaryCtaText}
                  <ArrowRight className="h-3 w-3" />
                </SmartLink>
              )}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
