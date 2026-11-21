import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Places from "@/components/Places";
import Groups from "@/components/Groups";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Location from "@/components/Location";
import BusinessSchema from "@/components/BusinessSchema";
import Footer from "@/components/Footer";

// "Nuestros masajes": diseño B por defecto; ?masajes=a muestra el acordeón para comparar
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ masajes?: string }> }) {
  const { lang } = await params;
  const { masajes } = await searchParams;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <BusinessSchema lang={lang as Locale} description={t.meta.description} />
      <Hero t={t} lang={lang as Locale} />
      <About t={t} lang={lang as Locale} variant={masajes === "a" ? "a" : "b"} />
      <Places t={t} lang={lang as Locale} />
      <Groups t={t} lang={lang as Locale} />
      <Reviews t={t} lang={lang as Locale} />
      <Location t={t} lang={lang as Locale} />
      <Faq t={t} lang={lang as Locale} />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}
