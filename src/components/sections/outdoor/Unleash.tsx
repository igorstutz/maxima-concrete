import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

interface UnleashItem {
  boldTitle?: string;
  text?: string;
}

/**
 * Section type: `unleash` — dark band, title + lead, checklist with bold
 * titles and a closing sentence.
 */
export default function Unleash({ content }: { content: Record<string, any> }) {
  const title = content?.title || "";
  const description = content?.description || "";
  const items: UnleashItem[] = content?.items || [];
  const closingText = content?.closingText || "";

  return (
    <section className="bg-[#2A2A2A] py-12 sm:py-16 md:py-20 lg:py-24">
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-[32px] font-medium leading-[120%] tracking-tight text-white">
            {title}
          </h2>
          {description && (
            <p className="mb-8 text-[22px] font-light leading-[130%] tracking-tight text-white">
              {description}
            </p>
          )}
          <div className="mb-8 space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <p className="text-[14px] font-normal leading-relaxed text-white/90">
                  <span className="font-bold">{item.boldTitle}</span> {item.text}
                </p>
              </div>
            ))}
          </div>
          {closingText && (
            <p className="text-[22px] font-normal leading-[130%] tracking-tight text-white">
              {closingText}
            </p>
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}
