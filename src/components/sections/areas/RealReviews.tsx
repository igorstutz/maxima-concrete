import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { htmlWithBreaks } from "./shared";

interface ReviewItem {
  name?: string;
  text?: string;
  image?: string;
}

/** Depoimentos reais com fotos redondas — type "real-reviews". */
export default function RealReviews({ content }: { content: Record<string, any> }) {
  const title: string = content?.title || "";
  const backgroundImage: string = legacyAsset(content?.backgroundImage);
  const overlayOpacity: number = content?.overlayOpacity ?? 75;
  const reviews: ReviewItem[] = Array.isArray(content?.reviews) ? content.reviews : [];
  const bottomText: string =
    content?.bottomText ?? "See more great reviews of our company on";
  const bottomLogos: string[] = Array.isArray(content?.bottomLogos)
    ? content.bottomLogos
    : [];

  return (
    <section className="relative overflow-hidden">
      {/* Fundo full-bleed + overlay */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
      />

      <div className="relative z-10 py-12 md:py-20 lg:py-28">
        <Container>
          {title && (
            <ScrollReveal>
              <h2
                className="mb-8 max-w-[900px] text-left text-lg font-medium leading-[120%] tracking-[-1.24px] text-white md:mb-16 md:text-[28px]"
                dangerouslySetInnerHTML={{ __html: htmlWithBreaks(title) }}
              />
            </ScrollReveal>
          )}

          {/* Grade de depoimentos */}
          <div className="grid max-w-[950px] grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 md:gap-y-12">
            {reviews.map((review, index) => (
              <ScrollReveal
                key={index}
                delay={Math.min(index % 2, 2)}
                className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left"
              >
                {review.image && (
                  <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full sm:h-[100px] sm:w-[100px] md:h-[144px] md:w-[144px]">
                    <Image
                      src={legacyAsset(review.image)}
                      alt={review.name || "Customer review"}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {review.name && (
                    <p className="mb-1.5 text-base font-medium tracking-[-0.64px] text-white">
                      {review.name}
                    </p>
                  )}
                  {review.text && (
                    <p className="text-[13px] leading-[145%] tracking-[-0.56px] text-white">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Barra de logos */}
          <div className="mt-10 flex flex-col flex-wrap items-center justify-start gap-3 sm:flex-row md:mt-20 md:gap-6">
            {bottomText && (
              <p className="text-center text-sm font-medium leading-[120%] tracking-[-0.96px] text-white sm:text-left md:text-2xl">
                {bottomText}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 md:gap-6">
              {bottomLogos.map((logo, i) => (
                <Image
                  key={i}
                  src={legacyAsset(logo)}
                  alt="Review platform"
                  width={160}
                  height={40}
                  className="h-6 w-auto object-contain brightness-0 invert sm:h-8 md:h-10"
                />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
