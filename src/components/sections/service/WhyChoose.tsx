import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";

const ICON_CLASS = "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white";

/** Ícones inline do renderer antigo (package/layers/grid/clipboard). */
function IconSvg({ iconType }: { iconType: string }) {
  switch (iconType) {
    case "layers":
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25m11.142 0l-5.571 3-5.571-3"
          />
        </svg>
      );
    case "grid":
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
      );
    case "clipboard":
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "package":
    default:
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>
      );
  }
}

/**
 * why-choose — seção com gradiente azul escuro, título/descrição à esquerda e
 * grade de benefícios com ícones à direita (DrivewaysPageWhyChooseRenderer).
 */
export default function WhyChoose({ content }: { content: Record<string, any> }) {
  const title = content?.title || "";
  const description = content?.description || "";
  const benefits: any[] = content?.benefits || [];

  return (
    <section
      className="relative w-full py-12 md:py-16 lg:py-24"
      style={{ background: "linear-gradient(270deg, #034673 -7.67%, #041826 98.82%), #000" }}
    >
      <Container>
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-16">
          {/* Bloco esquerdo — título e descrição */}
          <ScrollReveal className="flex flex-shrink-0 flex-col lg:w-[340px] xl:w-[400px]">
            <h2 className="mb-4 whitespace-pre-line text-2xl font-light leading-[1.2] tracking-[-1px] text-white sm:mb-6 md:text-[32px] lg:text-[42px]">
              {title}
            </h2>
            <p className="text-xs leading-relaxed text-white/80 sm:text-sm md:text-[15px]">
              {description}
            </p>
          </ScrollReveal>

          {/* Divisores */}
          <div className="hidden w-px flex-shrink-0 self-stretch bg-white/20 lg:block" />
          <div className="h-px w-full bg-white/20 lg:hidden" />

          {/* Bloco direito — grade de benefícios */}
          <ScrollReveal direction="right" className="flex-1">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4">
              {benefits.map((benefit: any, index: number) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-2 sm:mb-4">
                    {benefit.customIcon ? (
                      <Image
                        src={legacyAsset(benefit.customIcon)}
                        alt={benefit.title || ""}
                        width={56}
                        height={56}
                        className="h-10 w-10 object-contain brightness-0 invert sm:h-12 sm:w-12 md:h-14 md:w-14"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12 md:h-14 md:w-14">
                        <IconSvg iconType={benefit.iconType || "package"} />
                      </div>
                    )}
                  </div>
                  {benefit.title && (
                    <h3 className="mb-1 text-[11px] font-semibold leading-tight text-white sm:mb-2 sm:text-xs md:text-sm">
                      {benefit.title}
                    </h3>
                  )}
                  <p className="text-[10px] leading-relaxed text-white/70 sm:text-[11px] md:text-xs">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
