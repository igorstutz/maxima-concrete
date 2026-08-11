import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { SnapCarousel } from "@/components/SnapCarousel";
import { SmartLink } from "./SmartLink";

interface ServiceItem {
  name: string;
  image?: string;
  link?: string;
}

interface ServicesContent {
  titleWhite?: string;
  titleGray?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  items?: ServiceItem[];
}

export default function Services({ content }: { content: Record<string, any> }) {
  const c = content as ServicesContent;
  const items = c.items ?? [];

  return (
    // Fundo full-bleed, sem margem lateral nem cantos arredondados, com o
    // mesmo gradiente da seção "Lighting Solutions" (style-options) — diagonal
    // em 263deg, sem a camada preta que a home usava antes.
    <section
      id="services"
      className="relative w-full"
      style={{ background: "linear-gradient(263deg, #06253A 46.16%, #000D16 68.33%)" }}
    >
      <Container>
        <div className="flex flex-col gap-8 py-10 md:gap-14 md:py-16">
          {/* Título */}
          <h2 className="m-0 text-left text-2xl font-medium leading-tight md:leading-[43.2px] lg:text-[36px]">
            <span className="flex flex-wrap items-center gap-2 text-white">
              {c.titleWhite}
              <Image
                src="/images/assets/plus-icon.svg"
                alt=""
                width={32}
                height={32}
                className="h-6 w-6 shrink-0 md:h-8 md:w-8"
              />
            </span>
            <span className="mt-1 block text-2xl text-[#CACACA] lg:text-[32px]">
              {c.titleGray}
            </span>
          </h2>

          {/* Carrossel de serviços */}
          {/* No mobile o card fica centralizado (o padding lateral é metade da
              sobra) e as setas vão para as laterais; no desktop volta ao
              alinhamento à esquerda. */}
          <SnapCarousel
            controls="overlay-sides"
            trackClassName="gap-4 py-4 px-[max(0.25rem,calc(50%-125px))] md:px-1"
          >
            {items.map((item, index) => (
              <SmartLink
                key={index}
                href={item.link}
                className="group relative block h-[320px] w-[250px] shrink-0 snap-center overflow-hidden rounded-[14px] border border-white/60 shadow-[1px_6px_11.1px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-xl md:h-[360px] md:w-[268px] md:snap-start"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_100%)]" />
                <div className="gradient-navy absolute bottom-0 left-1/2 flex w-[calc(100%+10px)] -translate-x-1/2 items-center justify-center gap-2.5 rounded-[10px] px-3 py-2 transition-all duration-300 group-hover:brightness-110 md:px-5 md:py-2.5">
                  <span className="text-center text-sm font-normal text-white md:text-base">
                    {item.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white" />
                </div>
              </SmartLink>
            ))}
          </SnapCarousel>

          {/* Texto de apoio + CTA */}
          <div className="flex w-full max-w-[724px] flex-col gap-6 md:gap-9">
            <div className="flex flex-col gap-3 md:gap-[15px]">
              <p className="text-xl font-normal text-white md:text-2xl lg:text-[32px]">
                {c.heading}
              </p>
              <p className="text-sm font-medium text-[#CACACA] md:text-base">
                {c.description}
              </p>
            </div>
            <SmartLink
              href={c.ctaLink}
              className="flex w-fit items-center justify-center gap-2.5 whitespace-nowrap rounded-[5px] bg-[linear-gradient(90deg,#FFFFFF_0%,#E8E8E8_100%)] px-5 py-2.5 text-center text-sm font-medium text-[#1D3F5E] transition-all hover:brightness-95"
            >
              {c.ctaText}
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </SmartLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
