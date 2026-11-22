import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Páginas públicas en los dos idiomas, enlazadas entre sí para Google.
const pages = [
  { es: "/es", en: "/en", priority: 1 },
  { es: "/es/reservar", en: "/en/book", priority: 0.9 },
  { es: "/es/pagar", en: "/en/pay", priority: 0.5 },
  { es: "/es/masaje-a-domicilio", en: "/en/in-villa-massage", priority: 0.9 },
  { es: "/es/masaje-en-pareja", en: "/en/couples-massage", priority: 0.9 },
  { es: "/es/masajes-para-grupos", en: "/en/group-massage", priority: 0.8 },
  { es: "/es/privacidad", en: "/en/privacy", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return pages.flatMap((p) =>
    (["es", "en"] as const).map((l) => ({
      url: `${site.url}${p[l]}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.priority,
      alternates: { languages: { es: `${site.url}${p.es}`, en: `${site.url}${p.en}` } },
    })),
  );
}
