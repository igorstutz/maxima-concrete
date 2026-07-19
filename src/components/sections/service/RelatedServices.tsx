import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";

/**
 * related-services — imagem de fundo com overlay navy, título e pílulas de
 * serviços relacionados (RelatedServicesRenderer).
 */
export default function RelatedServices({ content }: { content: Record<string, any> }) {
  const title = content?.title || "";
  const backgroundImage = legacyAsset(content?.backgroundImage);
  const services: { label: string; link?: string }[] = content?.services || [];

  return (
    <section className="relative w-full overflow-hidden bg-navy py-16 md:py-20 lg:py-24">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      {/* Overlay escuro */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(4, 28, 45, 0.75) 0%, rgba(4, 28, 45, 0.85) 100%)",
        }}
      />

      <div className="relative z-10">
        <Container>
          <ScrollReveal>
            {title && (
              <h2 className="mb-6 text-[26px] font-medium leading-[120%] tracking-[-1.28px] text-white md:mb-8 md:text-[32px]">
                {title}
              </h2>
            )}

            {services.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {services.map((service, index) => (
                  <SmartLink
                    key={index}
                    href={service.link || "#"}
                    className="rounded-full border border-white/35 px-5 py-2 text-[13px] font-medium leading-[120%] tracking-[-0.56px] text-white transition-all hover:scale-105 hover:bg-white/10 md:text-[14px]"
                  >
                    {service.label}
                  </SmartLink>
                ))}
              </div>
            )}
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
