import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cada página tiene una sola dirección por idioma (evita duplicados en Google).
  async redirects() {
    return [
      { source: "/es/book", destination: "/es/reservar", permanent: true },
      { source: "/en/reservar", destination: "/en/book", permanent: true },
      { source: "/es/pay", destination: "/es/pagar", permanent: true },
      { source: "/en/pagar", destination: "/en/pay", permanent: true },
      { source: "/es/privacy", destination: "/es/privacidad", permanent: true },
      { source: "/en/privacidad", destination: "/en/privacy", permanent: true },
    ];
  },
};

export default nextConfig;
