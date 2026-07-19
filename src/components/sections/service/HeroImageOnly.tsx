import Image from "@/components/Image";
import { legacyAsset } from "@/components/sections/home/legacy";

/** hero-image-only — faixa de imagem full-width (242px), sem texto nem botões. */
export default function HeroImageOnly({ content }: { content: Record<string, any> }) {
  const image = legacyAsset(content?.image);

  return (
    <section className="relative h-[242px] w-full overflow-hidden bg-navy">
      {image && (
        <Image
          src={image}
          alt="Hero banner"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
    </section>
  );
}
