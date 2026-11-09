import { dictionaries } from "@/lib/content";
import { waLink, type Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import Experiences from "@/components/Experiences";
import Massages from "@/components/Massages";
import { WaIcon } from "@/components/Icons";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = dictionaries[lang as Locale];
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <Experiences t={t} />
      <Massages t={t} lang={lang as Locale} />
      <div id="pareja" className="next-placeholder" />
      <a className="wa-float" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <WaIcon size={26} />
      </a>
    </main>
  );
}
