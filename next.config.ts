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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maximaconcrete.com",
      },
    ],
  },
};

export default nextConfig;
