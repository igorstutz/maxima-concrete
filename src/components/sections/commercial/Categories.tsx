import { ArrowRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./sanitize";

interface CategoryCard {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  ctaText?: string;
}

interface CommercialCategoriesContent {
  title?: string;
  subtitle?: string;
  cards?: CategoryCard[];
}

const DEFAULT_CARDS: CategoryCard[] = [
  {
    title: "Commercial Pools",
    description:
      "Custom-built commercial pools engineered for safety, durability, and visual impact.",
    image: "",
    link: "/commercial-pools",
    ctaText: "Explore Commercial Pools",
  },
  {
    title: "Commercial Concrete",
    description:
      "Heavy-duty concrete services for parking lots, sidewalks, and commercial properties.",
    image: "",
    link: "/commercial-concrete",
    ctaText: "Explore Commercial Concrete",
  },
];

/** type: "commercial-categories" — dois cards grandes linkando às subpáginas comerciais. */
export default function Categories({ content }: { content: Record<string, any> }) {
  const c = content as CommercialCategoriesContent;
  const title = c.title || "Our Commercial Solutions";
  const subtitle =
    c.subtitle ?? "Specialized concrete services tailored to your business needs.";
  const cards =
    Array.isArray(c.cards) && c.cards.length > 0 ? c.cards : DEFAULT_CARDS;

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <ScrollReveal>
          <div className="mb-10 text-center md:mb-14">
            <h2
              className="text-2xl font-semibold leading-[120%] tracking-[-1.28px] text-navy md:text-[32px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
            />
            {subtitle && (
              <p
                className="mx-auto mt-3 max-w-[640px] text-base leading-[150%] text-gray-600 md:text-[18px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitle) }}
              />
            )}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {cards.map((card, idx) => (
            <ScrollReveal key={idx} delay={idx}>
              <SmartLink
                href={card.link || "#"}
                className="group relative block overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-200">
                  {card.image ? (
                    <Image
                      src={legacyAsset(card.image)}
                      alt={card.title || ""}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-ocean to-navy" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,28,45,0)_40%,rgba(4,28,45,0.75)_100%)]" />
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="mb-2 text-xl font-semibold leading-[125%] tracking-[-0.96px] text-navy md:text-[24px]">
                    {card.title}
                  </h3>
                  <p className="mb-5 text-sm leading-[155%] text-gray-600 md:text-[15px]">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-ocean transition-all group-hover:gap-3 md:text-[15px]">
                    {card.ctaText || "Learn more"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </SmartLink>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
