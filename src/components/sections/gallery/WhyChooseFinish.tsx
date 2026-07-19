import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

interface WhyChooseItem {
  label?: string;
  text?: string;
}

/**
 * "Why Choose a <finish>?" — dark full-bleed section with a title and a
 * list of paragraphs led by a bold label.
 */
export default function WhyChooseFinish({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const items: WhyChooseItem[] = content?.items || [];

  return (
    <section className="relative w-full bg-[#2A2A2A] py-16 sm:py-24">
      <Container>
        <ScrollReveal>
          {title && (
            <h2 className="mb-6 text-2xl font-medium leading-[115%] tracking-[-1.6px] text-white sm:text-3xl md:mb-10 md:text-[40px]">
              {title}
            </h2>
          )}

          {items.length > 0 && (
            <div className="flex max-w-[700px] flex-col gap-5 md:gap-8">
              {items.map((item, index) => (
                <p
                  key={index}
                  className="text-sm font-normal leading-[170%] tracking-[-0.48px] text-white md:text-base"
                >
                  {item.label && <strong className="font-bold">{item.label}</strong>}
                  {item.label && item.text ? " " : ""}
                  {item.text}
                </p>
              ))}
            </div>
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}
