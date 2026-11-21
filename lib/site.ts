// Datos generales del spa. Cambia aquí y se actualiza en toda la web.
export const site = {
  name: "Terrenas Massage",
  tagline: "Relax your body",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://terrenasmassage.com",
  email: "terrenasmassagerd@gmail.com",
  phone: "+1 (829) 371-0276",
  whatsapp: "18293710276",
  instagram: "https://www.instagram.com/terrenasmassage/",
  igHandle: "@terrenasmassage",
  facebook: "https://www.facebook.com/profile.php?id=61576134364193",
  address: {
    street: "Blvd. Turístico del Atlántico, sector La Ceiba, edificio #6, segundo nivel",
    locality: "Las Terrenas",
    region: "Samaná",
    postalCode: "32000",
    country: "DO",
  },
  // Todos los días, feriados incluidos. 19:00 es la última hora de inicio.
  hours: { open: "09:00", lastStart: "19:00" },
};

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/** Página de reservas en cada idioma (/es/reservar · /en/book). */
export const bookPath = (lang: Locale, q = "") => `/${lang}/${lang === "es" ? "reservar" : "book"}${q ? `?${q}` : ""}`;

// Perfil de Google del spa (abre el lugar exacto en Google Maps, con la ruta).
export const mapsUrl = "https://share.google/vdUnDXdpuNsyRW4Yq";

/**
 * Medición para anuncios (SEM). Pegar aquí los códigos cuando existan las cuentas:
 * - ga4: ID de Google Analytics 4 (G-XXXXXXX)
 * - googleAds: ID de Google Ads (AW-XXXXXXXXX) y las etiquetas de cada conversión
 * - metaPixel: ID del píxel de Meta (solo números)
 * Mientras estén vacíos no se carga nada ni aparece el aviso de cookies.
 */
export const tracking = {
  ga4: "",
  googleAds: "",
  adsLabels: { booking: "", contact: "" },
  metaPixel: "",
};
