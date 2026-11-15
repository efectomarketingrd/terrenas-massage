import type { Locale } from "@/lib/site";
import { site, bookPath } from "@/lib/site";
import { googleProfile } from "@/lib/reviews";

// Datos estructurados (schema.org) del spa para Google. No se ven en la página.
// Deben coincidir con el perfil de Google: nombre, dirección, teléfono y horario.
export default function BusinessSchema({ lang, description }: { lang: Locale; description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "DaySpa",
    "@id": `${site.url}/#spa`,
    name: site.name,
    slogan: "Relax your body",
    description,
    url: `${site.url}/${lang}`,
    logo: `${site.url}/brand/terrenas-massage-turquesa.png`,
    image: `${site.url}/brand/terrenas-massage-turquesa.png`,
    telephone: "+1-829-371-0276",
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Blvd. Turístico del Atlántico, sector La Ceiba, edificio #6, segundo nivel",
      addressLocality: "Las Terrenas",
      addressRegion: "Samaná",
      postalCode: "32000",
      addressCountry: "DO",
    },
    hasMap: googleProfile.url,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    priceRange: "RD$3,500 – RD$15,000",
    currenciesAccepted: "DOP, USD, EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, Zelle",
    areaServed: [
      { "@type": "Place", name: "Las Terrenas" },
      { "@type": "Place", name: "El Limón" },
    ],
    availableLanguage: ["Spanish", "English"],
    potentialAction: {
      "@type": "ReserveAction",
      target: `${site.url}${bookPath(lang)}`,
    },
    sameAs: [site.instagram, googleProfile.url],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
