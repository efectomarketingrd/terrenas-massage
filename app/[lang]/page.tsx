import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Places from "@/components/Places";
import Groups from "@/components/Groups";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import BusinessSchema from "@/components/BusinessSchema";
import Footer from "@/components/Footer";

// Vista previa de "Nuestros masajes": ?masajes=a | b (se quitará al elegir)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ masajes?: string }> }) {
  const { lang } = await params;
  const { masajes } = await searchParams;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <BusinessSchema lang={lang as Locale} description={t.meta.description} />
      <Hero t={t} lang={lang as Locale} />
      <About t={t} lang={lang as Locale} variant={masajes === "b" ? "b" : "a"} />
      <Places t={t} lang={lang as Locale} />
      <Groups t={t} lang={lang as Locale} />
      <Reviews t={t} lang={lang as Locale} />
      <Faq t={t} lang={lang as Locale} />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}
