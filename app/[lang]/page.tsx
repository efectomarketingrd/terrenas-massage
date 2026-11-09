import { dictionaries } from "@/lib/content";
import { waLink, type Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import Experiences from "@/components/Experiences";
import Massages from "@/components/Massages";
import { WaIcon } from "@/components/Icons";

// Vista previa de la sección de masajes: ?masajes=a | b | c (se quitará al elegir)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ masajes?: string }> }) {
  const { lang } = await params;
  const { masajes } = await searchParams;
  const t = dictionaries[lang as Locale];
  const mv = masajes === "a" || masajes === "c" ? masajes : "b";
  return (
    <main>
      <Hero t={t} lang={lang as Locale} />
      <Experiences t={t} />
      <Massages t={t} variant={mv} />
      <div id="pareja" className="next-placeholder" />
      <a className="wa-float" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <WaIcon size={26} />
      </a>
    </main>
  );
}
