import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Places from "@/components/Places";
import Groups from "@/components/Groups";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

// Vista previa de la sección 5: ?opiniones=a | b | c (se quitará al elegir)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ opiniones?: string }> }) {
  const { lang } = await params;
  const { opiniones } = await searchParams;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <About t={t} lang={lang as Locale} />
      <Places t={t} lang={lang as Locale} />
      <Groups t={t} lang={lang as Locale} />
      <Reviews t={t} lang={lang as Locale} variant={opiniones === "b" || opiniones === "c" ? opiniones : "a"} />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}
