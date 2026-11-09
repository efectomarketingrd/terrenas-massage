import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

// Vista previa de la sección de servicios: ?servicios=a | b (se quitará al elegir)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ servicios?: string }> }) {
  const { lang } = await params;
  const { servicios } = await searchParams;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <Services t={t} lang={lang as Locale} variant={servicios === "b" ? "b" : "a"} />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}
