import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { htmlWithBreaks } from "./shared";

/** "Transparency. Accountability. Efficiency." (página Why Maxima) — type "values". */
export default function Values({ content }: { content: Record<string, any> }) {
  const image = content.image || "";
  const overlayTitle =
    content.overlayTitle || "Transparency.\nAccountability.\nEfficiency.";
  const pillars: Array<{ title?: string; paragraphs?: string[] }> =
    content.pillars || [];
  const ctaText = content.ctaText || "Contact Us";
  const ctaLink = content.ctaLink || "#contact";

  const html = (text: string) => (
    <span dangerouslySetInnerHTML={{ __html: htmlWithBreaks(text) }} />
  );

  return (
    <section className="overflow-hidden bg-[linear-gradient(270deg,#222_24.74%,#1C1C1C_98.68%)]">
      <Container className="py-16 md:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Esquerda — imagem com texto sobreposto */}
            <div className="relative min-h-[400px] w-full shrink-0 overflow-hidden rounded-xl md:min-h-[500px] lg:min-h-[640px] lg:w-[55%]">
              {image ? (
                <Image
                  src={legacyAsset(image)}
                  alt="Values background"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[#2a2a2a]" />
              )}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                <h2 className="font-normal leading-[120%] tracking-[-2.08px] text-white [font-size:clamp(32px,4.5vw,52px)]">
                  {html(overlayTitle)}
                </h2>
              </div>
            </div>

            {/* Direita — cards de pilares */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className={`flex flex-1 flex-col gap-7 rounded-[40px] border border-white/10 p-[31px] ${
                    i === 1 ? "bg-transparent" : "bg-white/10"
                  }`}
                >
                  <h3 className="text-xl font-medium leading-6 tracking-[-0.8px] text-white">
                    {pillar.title || ""}
                  </h3>
                  <div className="space-y-2">
                    {(pillar.paragraphs || []).map((p, j) => (
                      <p
                        key={j}
                        className="text-sm leading-[120%] tracking-[-0.56px] text-white/80"
                      >
                        {html(p)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <SmartLink
              href={ctaLink}
              className="inline-flex items-center gap-2 rounded-[10px] border border-white px-7 py-3 text-sm font-medium text-white transition-all hover:bg-white hover:text-[#1C1C1C]"
            >
              {ctaText}
              <ArrowUpRight className="h-4 w-4" />
            </SmartLink>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
