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
