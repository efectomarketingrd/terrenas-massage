import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locales, slugs, type Locale } from "@/lib/i18n";

// Páginas públicas en los tres idiomas, enlazadas entre sí para Google.
const pages: { path: (l: Locale) => string; priority: number }[] = [
  { path: (l) => `/${l}`, priority: 1 },
  { path: (l) => `/${l}/${slugs.book[l]}`, priority: 0.9 },
  { path: (l) => `/${l}/${slugs.domicilio[l]}`, priority: 0.9 },
  { path: (l) => `/${l}/${slugs.pareja[l]}`, priority: 0.9 },
  { path: (l) => `/${l}/${slugs.grupo[l]}`, priority: 0.8 },
  { path: (l) => `/${l}/${slugs.pay[l]}`, priority: 0.5 },
  { path: (l) => `/${l}/${slugs.privacy[l]}`, priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return pages.flatMap((p) =>
    locales.map((l) => ({
      url: `${site.url}${p.path(l)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.priority,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}${p.path(x)}`])) },
    })),
  );
}
