import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fotos de ambiente servidas desde el CDN de Higgsfield (lib/images.ts)
  images: { remotePatterns: [{ protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" }] },
  // Cada página tiene una sola dirección por idioma (evita duplicados en Google).
  async redirects() {
    return [
      { source: "/es/book", destination: "/es/reservar", permanent: true },
      { source: "/en/reservar", destination: "/en/book", permanent: true },
      { source: "/es/pay", destination: "/es/pagar", permanent: true },
      { source: "/en/pagar", destination: "/en/pay", permanent: true },
      { source: "/es/in-villa-massage", destination: "/es/masaje-a-domicilio", permanent: true },
      { source: "/en/masaje-a-domicilio", destination: "/en/in-villa-massage", permanent: true },
      { source: "/es/couples-massage", destination: "/es/masaje-en-pareja", permanent: true },
      { source: "/en/masaje-en-pareja", destination: "/en/couples-massage", permanent: true },
      { source: "/es/group-massage", destination: "/es/masajes-para-grupos", permanent: true },
      { source: "/en/masajes-para-grupos", destination: "/en/group-massage", permanent: true },
      { source: "/es/privacy", destination: "/es/privacidad", permanent: true },
      { source: "/en/privacidad", destination: "/en/privacy", permanent: true },
    ];
  },
};

export default nextConfig;
