import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";

/**
 * hero-minimal — imagem full-width com gradiente inferior, título, subtítulo,
 * descrição e link "voltar" opcional (fiel ao HeroMinimalRenderer antigo).
 */
export default function HeroMinimal({ content }: { content: Record<string, any> }) {
  const title = content?.title || "";
  const subtitle = content?.subtitle || "";
  const description = content?.description || "";
  const background = legacyAsset(content?.backgroundImage);
  const backgroundMobile = legacyAsset(content?.backgroundImageMobile);

  const raw = content?.overlayOpacity;
  const opacity = typeof raw === "number" ? raw : raw != null ? Number(raw) : 40;
  const clamped = Math.max(0, Math.min(100, Number.isNaN(opacity) ? 40 : opacity)) / 100;

  const showBackLink = Boolean(content?.backLink || content?.backLabel);

  return (
    <section className="relative h-[340px] w-full overflow-hidden bg-navy md:h-[380px] lg:h-[400px]">
      {background && (
        <Image
          src={background}
          alt={title || "Hero background"}
          fill
          priority
          sizes="100vw"
          className={`object-cover ${backgroundMobile ? "hidden md:block" : ""}`}
        />
      )}
      {backgroundMobile && (
        <Image
          src={backgroundMobile}
          alt={title || "Hero background"}
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
      )}

      {/* Overlay escuro (controlado pelo CMS) */}
      <div
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: clamped }}
      />
      {/* Gradiente inferior para legibilidade do texto */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Título + voltar */}
      <div className="absolute inset-x-0 bottom-0 pb-8 lg:pb-10">
        <Container>
          <div className="flex flex-col items-start gap-3">
            <h1 className="text-2xl font-medium leading-tight text-white md:text-4xl lg:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base font-normal leading-[130%] tracking-[-0.64px] text-white md:text-2xl">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="max-w-[340px] text-sm font-normal leading-snug text-white/85 md:max-w-[420px] md:text-[15px]">
                {description}
              </p>
            )}
            {showBackLink && (
              <SmartLink
                href={content?.backLink || "/gallery"}
                className="group inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:brightness-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
                >
                  <path
                    d="M8.25 11.25L5.25 8.25M5.25 8.25L8.25 5.25M5.25 8.25L11.25 8.25M0.749999 8.25C0.749999 12.3921 4.10786 15.75 8.25 15.75C12.3921 15.75 15.75 12.3921 15.75 8.25C15.75 4.10786 12.3921 0.75 8.25 0.75C4.10786 0.75 0.749999 4.10786 0.749999 8.25Z"
                    stroke="white"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-normal tracking-[-0.52px] text-[#CACACA] transition-colors duration-300 group-hover:text-white">
                  {content?.backLabel || "Back to Gallery"}
                </span>
              </SmartLink>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}
