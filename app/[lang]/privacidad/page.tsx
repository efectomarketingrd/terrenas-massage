import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionaries } from "@/lib/content";
import { locales, privacyPath, site, waLink, type Locale } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ripples } from "@/components/Water";
import { Mail, WaIcon } from "@/components/Icons";
import { alternates } from "@/lib/i18n";

// Política de privacidad (/es/privacidad · /en/privacy)
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) return {};
  const t = dictionaries[lang as Locale];
  return {
    title: t.privacy.metaTitle,
    description: t.privacy.metaDesc,
    alternates: { canonical: privacyPath(lang as Locale), languages: alternates((l) => privacyPath(l)) },
  };
}

type Sec = { t: string; p?: string[]; li?: string[]; p2?: string[] };

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  if (!locales.includes(l as Locale)) notFound();
  const lang = l as Locale;
  const t = dictionaries[lang];
  const c = t.privacy;
  const alt = alternates((l) => privacyPath(l));
  return (
    <main className="bkp">
      <div className="bkp__top">
        <Header t={t} lang={lang} tone="dark" alts={alt} />
        <Ripples />
        <div className="wrap bkp__head rise">
          <p className="eyebrow">{c.eyebrow}</p>
          <h1 className="bkp__title">{c.title}</h1>
          <p className="bkp__lead">{c.lead}</p>
        </div>
      </div>
      <div className="wrap">
        <article className="pv">
          <p className="pv__date">{c.updated}</p>
          {(c.sections as Sec[]).map((s, i) => (
            <section key={s.t} className="pv__sec">
              <h2>
                <span>{i + 1}</span> {s.t}
              </h2>
              {s.p?.map((x) => <p key={x}>{x}</p>)}
              {s.li && (
                <ul>
                  {s.li.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              )}
              {s.p2?.map((x) => <p key={x}>{x}</p>)}
            </section>
          ))}
        </article>

        <div className="pv__contact">
          <p className="pv__ct">{c.contactTitle}</p>
          <a className="btn btn--teal" href={waLink(c.waMsg)} target="_blank" rel="noopener noreferrer">
            <WaIcon /> {c.wa}
          </a>
          <a className="pv__mail" href={`mailto:${site.email}`}>
            <Mail /> {site.email}
          </a>
        </div>
      </div>
      <Footer t={t} lang={lang} alts={alt} />
    </main>
  );
}
