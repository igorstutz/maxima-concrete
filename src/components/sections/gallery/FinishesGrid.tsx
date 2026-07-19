import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";

interface FinishItem {
  slug: string;
  name: string;
  description: string;
  image: string;
}

/**
 * Default finish cards (parity with the old site's hardcoded DEFAULT_FINISHES;
 * the CMS content on finishes_page only overrides heading/subheading/CTA).
 * Two images were downloaded locally; the remaining three still point to the
 * old Supabase storage (identical copies where noted).
 */
const DEFAULT_FINISHES: FinishItem[] = [
  {
    slug: "broom",
    name: "Broom Finish",
    description:
      "Classic textured finish for slip resistance on driveways, sidewalks and patios.",
    // Local copy of 1772214127546-fsb5zk.webp (the CMS "smooth" file is a byte-identical copy chain)
    image:
      "/images/cms/uploads/1772214127546-fsb5zk_copy_1773271864478_h87jpd_copy_1773272697162_utdi2.webp",
  },
  {
    slug: "colored-broom",
    name: "Colored Broom",
    description:
      "Integral-colored broom finish that adds warmth and curb appeal to any flatwork.",
    // Local copy of ...-fsb5zk_copy_..._h87jpd.webp (same copy chain)
    image:
      "/images/cms/uploads/1772214127546-fsb5zk_copy_1773271864478_h87jpd_copy_1773272697162_utdi2.webp",
  },
  {
    slug: "stamped-colored",
    name: "Stamped & Colored",
    description:
      "Decorative stamped concrete that mimics stone, brick and wood with rich color.",
    // Not downloaded locally yet — still served from the old CMS storage
    image:
      "https://hehehpxwazvtvattiyxl.supabase.co/storage/v1/object/public/cms-images/uploads/1778531676044-vjf95k.webp",
  },
  {
    slug: "smooth",
    name: "Smooth Finish",
    description:
      "Sleek troweled surface perfect for modern patios, garage floors and indoor slabs.",
    image:
      "/images/cms/uploads/1772214127546-fsb5zk_copy_1773271864478_h87jpd_copy_1773272697162_utdi2.webp",
  },
  {
    slug: "buff-wash-exposed",
    name: "Buff Wash & Exposed Aggregate",
    description:
      "Reveals the natural beauty of stone aggregate for a durable, textured look.",
    image: "/images/cms/uploads/1778533291033-fl6wv.webp",
  },
];

/**
 * Finishes hub — heading + card grid of the five concrete finishes, each
 * linking to its /finishes/<slug> detail page. CMS `items` can override
 * name/description/image by index (slug is fixed, routes are hardcoded).
 */
export default function FinishesGrid({
  content,
}: {
  content: Record<string, any>;
}) {
  const heading = content?.heading || "Our Concrete Finishes";
  const subheading =
    content?.subheading ||
    "From classic broom to decorative stamped concrete, explore the finish options Maxima Concrete delivers across Central Ohio.";
  const cardCtaText = content?.cardCtaText || "See more";
  const overrides: Partial<FinishItem>[] = Array.isArray(content?.items)
    ? content.items
    : [];

  const finishes: FinishItem[] = DEFAULT_FINISHES.map((d, i) => ({
    ...d,
    ...(overrides[i] || {}),
    slug: d.slug, // slug is fixed (routes hardcoded)
  }));

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <Container>
        {(heading || subheading) && (
          <ScrollReveal>
            <div className="mb-12 max-w-2xl md:mb-16">
              {heading && (
                <h2 className="text-3xl font-light tracking-tight text-navy md:text-5xl">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
                  {subheading}
                </p>
              )}
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3">
          {finishes.map((finish, index) => (
            <ScrollReveal
              key={finish.slug}
              delay={(index % 3) + 1}
              className="flex"
            >
              <article className="flex w-full flex-col">
                <SmartLink
                  href={`/finishes/${finish.slug}`}
                  ariaLabel={`Learn more about ${finish.name}`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100"
                >
                  {finish.image ? (
                    <Image
                      src={finish.image}
                      alt={`${finish.name} concrete finish by Maxima Concrete`}
                      fill
                      sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                      No image
                    </div>
                  )}
                </SmartLink>
                <h3 className="mt-5 text-xl font-semibold text-ocean md:text-2xl">
                  {finish.name}
                </h3>
                {finish.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
                    {finish.description}
                  </p>
                )}
                <SmartLink
                  href={`/finishes/${finish.slug}`}
                  className="gradient-navy mt-4 inline-flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
                >
                  {cardCtaText}
                  <ArrowUpRight className="h-4 w-4" />
                </SmartLink>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
