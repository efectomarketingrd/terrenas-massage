import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import Experiences from "@/components/Experiences";
import Massages from "@/components/Massages";
import Footer from "@/components/Footer";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <Experiences t={t} />
      <Massages t={t} lang={lang as Locale} />
      <Footer t={t} lang={lang as Locale} />
    </main>
  );
}
