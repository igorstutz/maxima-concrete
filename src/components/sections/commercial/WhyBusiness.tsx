import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { getWhyBusinessIcon } from "./whyBusinessIcons";
import { sanitizeHtml } from "./sanitize";

interface WhyBusinessItem {
  iconIndex?: number;
  text?: string;
}

interface CommercialWhyBusinessContent {
  title?: string;
  image?: string;
  items?: WhyBusinessItem[];
  closing?: string;
  logos?: string[];
}

/**
 * type: "commercial-why-business" — título + lista com ícones à esquerda,
 * imagem à direita e marquee de logos de clientes embaixo.
 */
export default function WhyBusiness({ content }: { content: Record<string, any> }) {
  const c = content as CommercialWhyBusinessContent;
  const title = c.title || "Why Businesses Choose <b>Maxima Concrete</b>";
  const image = legacyAsset(c.image);
  const items = c.items ?? [];
  const logos = c.logos ?? [];
  // Duplica os logos para o loop contínuo do marquee
  const marqueeLogos = logos.length > 0 ? [...logos, ...logos] : [];

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Esquerda: título + itens + fechamento */}
          <ScrollReveal className="flex flex-col">
            <h2
              className="text-[clamp(26px,3.4vw,36px)] font-medium leading-[115%] tracking-[-1.44px] text-[#494948] lg:max-w-[471px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
            />

            {items.length > 0 && (
              <ul className="mt-8 flex flex-col gap-3">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      {getWhyBusinessIcon(item.iconIndex ?? 0)}
                    </span>
                    <p className="text-[14px] font-medium leading-[193%] tracking-[-0.14px] text-[#323232] lg:max-w-[423px]">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {c.closing && (
              <p
                className="mt-8 text-[14px] font-semibold leading-[150%] tracking-[-0.56px] text-[#494948] lg:max-w-[439px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.closing) }}
              />
            )}
          </ScrollReveal>

          {/* Direita: imagem */}
          <ScrollReveal className="flex justify-center lg:justify-end" direction="left">
            {image ? (
              <Image
                src={image}
                alt=""
                width={429}
                height={386}
                sizes="(min-width: 1024px) 429px, 100vw"
                className="h-auto w-full rounded-2xl object-cover lg:h-[386px] lg:w-[429px]"
                loading="lazy"
              />
            ) : (
              <div className="h-[280px] w-full rounded-2xl bg-gray-100 lg:h-[386px] lg:w-[429px]" />
            )}
          </ScrollReveal>
        </div>

        {/* Marquee de logos */}
        {marqueeLogos.length > 0 && (
          <div className="mt-16 overflow-hidden md:mt-20">
            <div
              className="wbc-marquee flex w-max items-center gap-12 whitespace-nowrap md:gap-16"
            >
              {marqueeLogos.map((logo, idx) => (
                <Image
                  key={idx}
                  src={logo}
                  alt=""
                  width={160}
                  height={64}
                  className="h-12 w-auto shrink-0 object-contain md:h-16"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </Container>

      <style>{`
        @keyframes wbcMarqueeKf { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .wbc-marquee { animation: wbcMarqueeKf 30s linear infinite; }
      `}</style>
    </section>
  );
}
