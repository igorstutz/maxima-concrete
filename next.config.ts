import type { NextConfig } from "next";

// Alvos de build (mesmo esquema do Maxima Pools):
//   - Preview GitHub Pages:  GITHUB_PAGES=true npm run build  (basePath = /maxima-concrete)
//   - Hostinger / raiz:      npm run build                    (basePath = vazio)
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? "/maxima-concrete" : "",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? "/maxima-concrete" : "",
  },
  images: {
    // Export estático não tem otimização em runtime: sem isso o Next serviria
    // o arquivo original em qualquer contexto (uma foto de 1920px dentro de um
    // card de 260px). O loader troca pela variante gerada por
    // `_extraction/generate-image-variants.mjs` e o Next monta o srcset.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [480, 828, 1280, 1920],
    imageSizes: [256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maximaconcrete.com",
      },
    ],
  },
};

export default nextConfig;
