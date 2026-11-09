import { dictionaries } from "@/lib/content";
import { waLink, type Locale } from "@/lib/site";
import Hero from "@/components/Hero";
import { WaIcon } from "@/components/Icons";

// Vista previa: ?portada=a | b | c (se quitará al elegir la portada)
export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ portada?: string }> }) {
  const { lang } = await params;
  const { portada } = await searchParams;
  const t = dictionaries[lang as Locale];
  const v = portada === "b" || portada === "c" ? portada : "a";
  return (
    <main>
      <Hero variant={v} t={t} lang={lang as Locale} />
      <div id="masajes" className="next-placeholder" />
      <a className="wa-float" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <WaIcon size={26} />
      </a>
    </main>
  );
}
