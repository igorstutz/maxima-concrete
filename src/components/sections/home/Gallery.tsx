import { ChevronRight } from "lucide-react";
import Image from "@/components/Image";
import { SnapCarousel } from "@/components/SnapCarousel";
import { legacyAsset } from "./legacy";
import { SmartLink } from "./SmartLink";

interface GalleryContent {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  images?: string[];
}

/**
 * Gallery (home) — linha full-bleed (16px de cada borda), como no site original:
 * o card esquerdo passa POR TRÁS do menu flutuante e o carrossel encosta na
 * borda direita. O TEXTO do card cai na coluna padrão do site via cálculo:
 * alvo = 350px (menu) + px-8 (32px) + max(0, (viewport − 350 − 1200)/2);
 * dentro do card (que começa em 16px e mede viewport − 546px),
 * padding-left = alvo − 16px, com viewport = 100% + 546px.
 */
export default function Gallery({ content }: { content: Record<string, any> }) {
  const c = content as GalleryContent;
  const backgroundImage =
    legacyAsset(c.backgroundImage) || "/images/assets/gallery-section.webp";
  const images = (c.images ?? []).map(legacyAsset);

  return (
    <section id="gallery" className="px-4 py-6">
      <div className="flex flex-col gap-6 lg:h-[520px] lg:flex-row">
        {/* Card esquerdo — imagem única de fundo + texto na coluna padrão */}
        <div className="relative flex min-h-[400px] flex-1 flex-col justify-center overflow-hidden rounded-xl lg:min-h-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative flex flex-col gap-4 px-6 py-8 lg:gap-6 lg:py-10 lg:pl-[calc(366px+max(0px,(100%-1004px)/2))] lg:pr-10">
            <h2 className="text-4xl font-normal text-white lg:text-[36px]">{c.title}</h2>
            <p className="max-w-[600px] text-sm font-medium text-white md:text-base">
              {c.description}
            </p>
            <SmartLink
              href={c.ctaLink}
              className="gradient-navy flex w-fit items-center justify-center gap-2.5 rounded-[5px] px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:brightness-110"
            >
              {c.ctaText}
              <ChevronRight className="h-4 w-4" />
            </SmartLink>
          </div>
        </div>

        {/* Coluna direita — carrossel (encosta a ~16px da borda direita) */}
        <div className="w-full shrink-0 lg:w-[490px]">
          <SnapCarousel
            controls="overlay-bottom"
            trackClassName="h-[300px] gap-4 md:h-[400px] lg:h-[520px]"
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-full w-full shrink-0 snap-start overflow-hidden rounded-[14px]"
              >
                <Image
                  src={image}
                  alt={`Maxima Concrete project — gallery image ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 490px, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </SnapCarousel>
        </div>
      </div>
    </section>
  );
}
