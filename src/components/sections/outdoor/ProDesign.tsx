import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

interface PillItem {
  bold?: string;
  text?: string;
}

const DEFAULT_ITEMS: PillItem[] = [
  { bold: "Drainage & Grading", text: "Prevent pooling and water damage." },
  {
    bold: "Gas, Water & Electrical Connections",
    text: "Installed safely and to code.",
  },
  {
    bold: "Lighting & Power Integration",
    text: "Perfect for appliances and ambience.",
  },
  {
    bold: "Structural Craftsmanship",
    text: "Built with reinforced concrete or precision-laid pavers.",
  },
];

/**
 * Section type: `pro-design` — full-bleed background photo with dark overlay,
 * eyebrow + title + description and a list of pill-outlined items.
 */
export default function ProDesign({
  content,
}: {
  content: Record<string, any>;
}) {
  const eyebrow = content?.eyebrow || "by Maxima Concrete";
  const title = content?.title || "Professional Design & Installation";
  const description =
    content?.description ||
    "Our expert team ensures your outdoor kitchen is as <b>safe and functional</b> as it is beautiful.";
  const listTitle = content?.listTitle || "What We Handle:";
  const backgroundImage = legacyAsset(content?.backgroundImage);
  const overlayOpacity =
    content?.overlayOpacity !== undefined ? content.overlayOpacity : 70;
  const items: PillItem[] = content?.items || DEFAULT_ITEMS;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
        />
      </div>

      <div className="relative z-10">
        <Container className="py-20 md:py-28">
          <ScrollReveal>
            <p className="mb-2 text-[20px] font-light leading-[115%] tracking-tight text-white">
              {eyebrow}
            </p>

            <h2 className="mb-4 text-3xl font-medium leading-[120%] tracking-tight text-white md:text-[40px]">
              {title}
            </h2>

            <p
              className="mb-8 max-w-[700px] text-[16px] font-normal leading-[140%] text-[#F3F3F3]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />

            <h3 className="mb-6 text-[24px] font-semibold leading-[120%] tracking-tight text-[#F3F3F3]">
              {listTitle}
            </h3>
          </ScrollReveal>

          <div className="flex max-w-[750px] flex-col gap-4">
            {items.map((item, i) => (
              <ScrollReveal key={i} delay={Math.min(i + 1, 4)}>
                <div className="flex items-center gap-3 rounded-[33px] border border-white px-6 py-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                  <p className="text-sm leading-[140%] text-white">
                    <span className="font-semibold">{item.bold}</span> {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
