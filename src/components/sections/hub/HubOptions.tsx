import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { HubCtaButton } from "./shared";

interface HubOption {
  image?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HubOptionsContent {
  title?: string;
  description?: string;
  options?: HubOption[];
}

/** Hub Options — cards grandes linkando para as sub-páginas (ex.: Concrete vs Paver). */
export default function HubOptions({ content }: { content: Record<string, any> }) {
  const c = content as HubOptionsContent;
  const options = c.options || [];

  return (
    <section className="bg-[#F4F6F8]">
      <Container className="py-14 md:py-20">
        <ScrollReveal className="mb-10 max-w-2xl">
          <h2 className="mb-4 whitespace-pre-line text-3xl font-medium leading-tight tracking-[-1px] text-navy md:text-4xl">
            {c.title}
          </h2>
          {c.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#3A4A56] md:text-base">
              {c.description}
            </p>
          )}
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {options.map((option, i) => (
            <ScrollReveal
              key={i}
              delay={i}
              className="group relative flex min-h-[420px] items-end overflow-hidden rounded-2xl bg-[linear-gradient(160deg,var(--color-ocean)_0%,var(--color-navy)_100%)] shadow-lg"
            >
              {option.image && (
                <Image
                  src={legacyAsset(option.image)}
                  alt={option.title || ""}
                  fill
                  sizes="(min-width: 768px) 580px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="relative z-10 w-full p-7 md:p-8">
                <h3 className="mb-3 text-2xl font-medium tracking-[-0.5px] text-white md:text-3xl">
                  {option.title}
                </h3>
                {option.description && (
                  <p className="mb-6 text-sm leading-relaxed text-white/85 md:text-base">
                    {option.description}
                  </p>
                )}
                <HubCtaButton
                  text={option.ctaText}
                  link={option.ctaLink}
                  variant="light"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
