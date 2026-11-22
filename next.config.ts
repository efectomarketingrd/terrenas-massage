import type { NextConfig } from "next";
import { langRedirects } from "./lib/i18n";

const nextConfig: NextConfig = {
  // Fotos de ambiente servidas desde el CDN de Higgsfield (lib/images.ts)
  images: { remotePatterns: [{ protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" }] },
  // Cada página tiene una sola dirección por idioma (evita duplicados en Google).
  async redirects() {
    return langRedirects();
  },
};

export default nextConfig;
