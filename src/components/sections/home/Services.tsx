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
    <section id="services" className="relative py-6">
      {/* Fundo do cartão azul: sangra até ~16px das bordas da viewport,
          passando POR TRÁS do menu flutuante (como no site original).
          Só o fundo sangra — o conteúdo permanece na coluna padrão. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-4 inset-y-6 rounded-xl"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(180deg, #034673 0%, #041826 100%)",
        }}
      />
      <Container className="relative">
        <div className="flex flex-col gap-8 px-0 py-10 md:gap-14 md:py-16">
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
          <SnapCarousel controls="below" trackClassName="gap-4 px-1 py-4">
            {items.map((item, index) => (
              <SmartLink
                key={index}
                href={item.link}
                className="group relative block h-[220px] w-[160px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-white/60 shadow-[1px_6px_11.1px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-xl md:h-[298px] md:w-[220px]"
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
                  <span className="h-2 w-2 shrink-0 bg-white" aria-hidden="true" />
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
              className="flex w-fit items-center justify-center gap-2.5 rounded-[5px] bg-[linear-gradient(90deg,#FFFFFF_0%,#E8E8E8_100%)] px-5 py-2.5 text-center text-sm font-medium text-[#1D3F5E] transition-all hover:brightness-95"
            >
              {c.ctaText}
              <span className="h-2 w-2 shrink-0 bg-[#1D3F5E]" aria-hidden="true" />
            </SmartLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
