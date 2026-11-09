import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Places from "@/components/Places";
import Footer from "@/components/Footer";

// Vista previa de la sección 3: ?lugar=a | b | c (se quitará al elegir)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ lugar?: string }> }) {
  const { lang } = await params;
  const { lugar } = await searchParams;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <Services t={t} lang={lang as Locale} />
      <Places t={t} lang={lang as Locale} variant={lugar === "b" || lugar === "c" ? lugar : "a"} />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}
