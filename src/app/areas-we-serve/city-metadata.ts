import type { Metadata } from "next";
import type { ServiceArea } from "@/components/sections/areas/service-areas";

/**
 * Metadata de uma página de cidade, incluindo a imagem de compartilhamento
 * própria daquela cidade (a mesma foto usada no card de /areas-we-serve).
 *
 * As imagens ficam em `public/images/og/cities/<slug>.jpg`, em 1200x630 e em
 * JPEG — WhatsApp e vários clientes de e-mail não renderizam WebP no preview
 * de link, que é justamente onde essa imagem aparece.
 */
export function cityMetadata(area: ServiceArea): Metadata {
  const title = `Maxima Concrete - Concrete Contractor in ${area.name}, OH`;
  const description =
    area.intro ||
    `Maxima Concrete delivers premium concrete driveways, patios, and outdoor living spaces across ${area.name}, Ohio.`;
  const url = `/areas-we-serve/${area.slug}/`;
  const image = {
    url: `/images/og/cities/${area.slug}.jpg`,
    width: 1200,
    height: 630,
    alt: `Maxima Concrete in ${area.name}, Ohio`,
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: area.headline || title,
      description,
      url,
      type: "website",
      locale: "en_US",
      siteName: "Maxima Concrete",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: area.headline || title,
      description,
      images: [image.url],
    },
  };
}
