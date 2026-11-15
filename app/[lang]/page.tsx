import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Places from "@/components/Places";
import Groups from "@/components/Groups";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

// Vista previa de la sección 6: ?faq=a | b (se quitará al elegir)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ faq?: string }> }) {
  const { lang } = await params;
  const { faq } = await searchParams;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <About t={t} lang={lang as Locale} />
      <Places t={t} lang={lang as Locale} />
      <Groups t={t} lang={lang as Locale} />
      <Reviews t={t} lang={lang as Locale} />
      <Faq t={t} lang={lang as Locale} variant={faq === "b" ? "b" : "a"} />
      <Footer t={t} lang={lang as Locale} seamless={faq === "b"} />
    </main>
  );
}
