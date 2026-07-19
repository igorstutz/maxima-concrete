import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./sanitize";

interface WhyChooseItem {
  title?: string;
  description?: string;
}

interface WhyChooseMCContent {
  title?: string;
  subtitle?: string;
  items?: WhyChooseItem[];
  image?: string;
}

/** type: "why-choose-mc" — título + checklist 2x2 + imagem destacada com overlay. */
export default function WhyChooseMC({ content }: { content: Record<string, any> }) {
  const c = content as WhyChooseMCContent;
  const title = c.title || "Why Choose <b>Maxima Concrete</b>";
  const items = c.items ?? [];
  const image = legacyAsset(c.image);

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <ScrollReveal>
          <h2
            className="mb-6 whitespace-pre-line text-2xl font-medium leading-[115%] tracking-[-1.36px] text-[#494948] md:mb-8 md:text-[34px]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
          />
          {c.subtitle && (
            <p
              className="mb-10 max-w-[700px] text-sm leading-[150%] tracking-[-0.32px] text-[#494948] md:mb-12 md:text-base"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.subtitle) }}
            />
          )}
        </ScrollReveal>

        {items.length > 0 && (
          <ScrollReveal>
            <div className="mb-10 grid grid-cols-1 gap-x-10 gap-y-7 md:mb-14 md:grid-cols-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <p className="text-sm leading-[165%] tracking-[-0.14px] text-[#323232]">
                    <span className="font-semibold text-navy">{item.title}</span>
                    {item.title && item.description
                      ? item.title.trim().endsWith(":")
                        ? " "
                        : " — "
                      : ""}
                    <span
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description || "") }}
                    />
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {image ? (
          <ScrollReveal direction="scale">
            <div className="relative mx-auto aspect-[856/270] w-full max-w-[856px] overflow-hidden rounded-[30px]">
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 1024px) 856px, 100vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,79,132,0)_23.1%,rgba(4,28,45,0.83)_96.38%)]" />
            </div>
          </ScrollReveal>
        ) : (
          <div className="mx-auto aspect-[856/270] w-full max-w-[856px] rounded-[30px] bg-gray-100" />
        )}
      </Container>
    </section>
  );
}
