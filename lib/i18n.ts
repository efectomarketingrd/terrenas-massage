// Idiomas del sitio y direcciones de cada página en cada idioma (sin dependencias: lo usa también next.config.ts).
export const locales = ["es", "en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const langNames: Record<Locale, string> = { es: "Español", en: "English", fr: "Français" };
export const intlLocale: Record<Locale, string> = { es: "es-DO", en: "en-US", fr: "fr-FR" };
export const ogLocale: Record<Locale, string> = { es: "es_DO", en: "en_US", fr: "fr_FR" };

/** Nombre de cada página fija en cada idioma. */
export const slugs = {
  book: { es: "reservar", en: "book", fr: "reserver" },
  pay: { es: "pagar", en: "pay", fr: "payer" },
  privacy: { es: "privacidad", en: "privacy", fr: "confidentialite" },
  domicilio: { es: "masaje-a-domicilio", en: "in-villa-massage", fr: "massage-a-domicile" },
  pareja: { es: "masaje-en-pareja", en: "couples-massage", fr: "massage-en-duo" },
  grupo: { es: "masajes-para-grupos", en: "group-massage", fr: "massages-pour-groupes" },
} as const satisfies Record<string, Record<Locale, string>>;

/** Redirecciones 308: el nombre de una página en otro idioma lleva al nombre correcto (p. ej. /fr/book → /fr/reserver). */
export function langRedirects() {
  const out: { source: string; destination: string; permanent: true }[] = [];
  for (const page of Object.values(slugs))
    for (const l of locales)
      for (const wrong of new Set(Object.values(page)))
        if (wrong !== page[l]) out.push({ source: `/${l}/${wrong}`, destination: `/${l}/${page[l]}`, permanent: true });
  return out;
}

/** Direcciones de la misma página en todos los idiomas. */
export const alternates = (path: (l: Locale) => string) => Object.fromEntries(locales.map((l) => [l, path(l)])) as Record<Locale, string>;
