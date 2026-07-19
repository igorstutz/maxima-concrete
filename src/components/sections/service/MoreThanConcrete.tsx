import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

/**
 * more-than-concrete — faixa escura com título grande à esquerda e texto à
 * direita (MoreThanConcreteRenderer). Defaults idênticos ao renderer antigo.
 */
export default function MoreThanConcrete({ content }: { content: Record<string, any> }) {
  const title = content?.title || "More Than Concrete,\nIt's Confidence.";
  const description =
    content?.description ||
    "Whether it's a custom driveway, patio, or complete backyard transformation, Maxima Concrete delivers lasting beauty and performance.\nWe don't just pour concrete — we build trust, one project at a time.";

  return (
    <section className="w-full bg-[#1E1E1E] py-16 md:py-20">
      <Container>
        <ScrollReveal>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:items-center md:gap-10">
            <h2 className="whitespace-pre-line text-left text-[clamp(28px,4vw,40px)] font-medium leading-[115%] tracking-[-1.6px] text-white">
              {title}
            </h2>
            <p className="whitespace-pre-line text-left text-[14px] font-medium leading-normal tracking-[-0.56px] text-white">
              {description}
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
