import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

/** "Serving Central Ohio and Beyond" (página Why Maxima) — type "areas". */
export default function Areas({ content }: { content: Record<string, any> }) {
  const title = content.title || "Serving Central Ohio and Beyond";
  const subtitle =
    content.subtitle ||
    "We proudly serve homeowners and businesses across the following counties:";
  const areas: string[] = content.areas || [];
  const backgroundImage = content.backgroundImage || "";
  const trustIcons: string[] = content.trustIcons || [];
  const bottomTitle = content.bottomTitle || "Not sure if we serve your area?";
  const bottomDescription =
    content.bottomDescription ||
    "Contact us to discuss your project — we often travel beyond our main service radius for select installations.";
  const ctaText = content.ctaText || "Contact Us";
  const ctaLink = content.ctaLink || "#contact";

  const html = (text: string) =>
    text && (text.includes("<b>") || text.includes("<strong>") || text.includes("<br")) ? (
      <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />
    ) : (
      text
    );

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <Image
            src={legacyAsset(backgroundImage)}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Container className="relative z-10 py-16 md:py-24 lg:py-32">
        <ScrollReveal>
          <h2 className="mb-3 font-medium leading-[115%] tracking-[-1.92px] text-white [font-size:clamp(32px,4vw,48px)] md:mb-4">
            {html(title)}
          </h2>
          <p className="mb-6 tracking-[-0.84px] text-white/80 [font-size:clamp(16px,2.5vw,21px)] md:mb-8">
            {html(subtitle)}
          </p>

          {areas.length > 0 && (
            <ul className="mb-10 space-y-1 md:mb-14">
              {areas.map((area, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm font-medium leading-[175%] tracking-[-0.7px] text-white"
                >
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                  {html(area)}
                </li>
              ))}
            </ul>
          )}

          <div className="mb-10 h-px w-full max-w-[756px] bg-white/40 md:mb-14" />

          {trustIcons.length > 0 && (
            <div className="mb-10 flex flex-wrap items-center gap-6 md:mb-14 md:gap-10">
              {trustIcons.map((icon, i) => (
                <Image
                  key={i}
                  src={legacyAsset(icon)}
                  alt="Trust badge"
                  width={120}
                  height={48}
                  className="h-8 w-auto object-contain brightness-0 invert sm:h-10 md:h-12"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
            <p className="max-w-[240px] shrink-0 font-medium leading-[130%] tracking-[-0.96px] text-white [font-size:clamp(18px,2.5vw,24px)]">
              {html(bottomTitle)}
            </p>
            <p className="max-w-[356px] text-sm font-medium tracking-[-0.56px] text-white">
              {html(bottomDescription)}
            </p>
            <SmartLink
              href={ctaLink}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
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
