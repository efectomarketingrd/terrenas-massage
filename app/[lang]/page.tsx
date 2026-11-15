import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Places from "@/components/Places";
import Footer from "@/components/Footer";

// Vista previa de la sección 2: ?masajes=a | b | c (se quitará al elegir)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ masajes?: string }> }) {
  const { lang } = await params;
  const { masajes } = await searchParams;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <About t={t} lang={lang as Locale} variant={masajes === "b" || masajes === "c" ? masajes : "a"} />
      <Places t={t} lang={lang as Locale} variant="a" />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}
