import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { legacyAsset } from "@/components/sections/home/legacy";
import { CtaButton, sanitizeHtml } from "./shared";

/**
 * Section type: `outdoor-kitchen` — full-bleed background image with dark
 * overlay; text on the left, options panel on solid navy on the right.
 */
export default function OutdoorKitchen({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const description = content?.description || "";
  const image = legacyAsset(content?.image);
  const optionsTitle = content?.optionsTitle || "";
  const options: string[] = content?.options || [];
  const bottomText = content?.bottomText || "";
  const ctaText = content?.ctaText || "";
  const ctaLink = content?.ctaLink || "#contact";

  const optionsPanel = (
    <>
      {optionsTitle && (
        <p className="text-[14px] font-semibold leading-[120%] text-[#F3F3F3]">
          {optionsTitle}
        </p>
      )}
      {options.length > 0 && (
        <ul className="space-y-1.5">
          {options.map((opt, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
              <span className="text-[13px] font-normal leading-[140%] text-[#F3F3F3] lg:text-[14px]">
                {opt}
              </span>
            </li>
          ))}
        </ul>
      )}
      {bottomText && (
        <p
          className="pt-1 text-[13px] font-semibold leading-[120%] text-[#F3F3F3] lg:text-[14px]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(bottomText) }}
        />
      )}
      <CtaButton
        text={ctaText}
        link={ctaLink}
        variant="white"
        className="self-start px-5 py-2.5"
      />
    </>
  );

  return (
    <section className="relative w-full overflow-hidden bg-[#1A1A1A]">
      {/* Full-bleed background image + navy overlay */}
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/55 via-navy/75 to-navy/90" />

      {/* Mobile layout */}
      <div className="relative z-10 lg:hidden">
        <Container className="space-y-5 py-10">
          <h2
            className="text-[24px] font-normal leading-[120%] tracking-tight text-[#F3F3F3]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
          />
          {description && (
            <p className="text-[13px] font-normal leading-[120%] text-[#F3F3F3]">
              {description}
            </p>
          )}
        </Container>
        <div className="bg-navy">
          <Container className="flex flex-col gap-4 py-10">{optionsPanel}</Container>
        </div>
      </div>

      {/* Desktop layout — two flush columns */}
      <div className="relative z-10 hidden lg:block">
        <Container>
          <div className="flex items-stretch">
            {/* Left column — transparent, image shows through */}
            <div className="flex w-[62%] flex-col justify-center space-y-4 py-12 pr-14">
              <h2
                className="text-[32px] font-normal leading-[120%] tracking-tight text-[#F3F3F3]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
              />
              {description && (
                <p className="max-w-[420px] text-[14px] font-normal leading-[120%] text-[#F3F3F3]">
                  {description}
                </p>
              )}
            </div>

            {/* Right column — solid navy panel */}
            <div className="flex w-[38%] flex-col justify-center gap-4 bg-navy py-10 pl-8 pr-10">
              {optionsPanel}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
