import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { photos } from "@/lib/images";
import { alternates } from "@/lib/i18n";
import { dictionaries, type Dict } from "@/lib/content";
import { bookPath, locales, site, waLink, type Locale } from "@/lib/site";
import { servicePath } from "@/lib/services";
import { couple, fmtRd, fmtUsd, home } from "@/lib/prices";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import InView from "@/components/InView";
import { Ripples } from "@/components/Water";
import { Arrow, Check, ExpIcon, WaIcon } from "@/components/Icons";

// Páginas por servicio: /es/masaje-a-domicilio · /es/masaje-en-pareja · /es/masajes-para-grupos (y sus versiones en inglés).
export const dynamicParams = false;

type Svc = Dict["services"]["items"][number];

export function generateStaticParams() {
  return locales.flatMap((lang) => dictionaries[lang].services.items.map((s) => ({ lang, service: s.slug })));
}

const find = (lang: Locale, slug: string) => dictionaries[lang].services.items.find((s) => s.slug === slug);


export async function generateMetadata({ params }: { params: Promise<{ lang: string; service: string }> }): Promise<Metadata> {
  const { lang, service } = await params;
  if (!locales.includes(lang as Locale)) return {};
  const s = find(lang as Locale, service);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDesc,
    alternates: { canonical: servicePath(lang as Locale, s.id), languages: alternates((l) => servicePath(l, s.id)) },
    openGraph: { title: s.metaTitle, description: s.metaDesc, url: servicePath(lang as Locale, s.id), images: [{ url: "/og.png", width: 1200, height: 630 }] },
  };
}

type Row = { label: string; cells: { k: string; v: number; from?: boolean }[] };

// Tabla de precios de cada servicio, calculada desde lib/prices.ts
function priceRows(t: Dict, s: Svc): { unit: string; rows: Row[] } {
  const c = t.services;
  const m = Object.fromEntries(t.about.massages.map((x) => [x.k, x.t]));
  const mins = (n: number) => `${n} ${c.min}`;
  if (s.id === "domicilio")
    return {
      unit: c.perPerson,
      rows: [
        { label: m.relajante, cells: [{ k: mins(60), v: home.relajante[60] }, { k: mins(90), v: home.relajante[90] }] },
        { label: `${m.profundo} · ${m.descontracturante}`, cells: [{ k: mins(60), v: home.profundo[60] }, { k: mins(90), v: home.profundo[90] }] },
      ],
    };
  if (s.id === "pareja")
    return {
      unit: c.forTwo,
      rows: [
        { label: `Basic · ${m.relajante}`, cells: [{ k: mins(60), v: couple.basic.relajante[60] }, { k: mins(90), v: couple.basic.relajante[90] }] },
        { label: `Basic · ${m.profundo}`, cells: [{ k: mins(60), v: couple.basic.profundo[60] }, { k: mins(90), v: couple.basic.profundo[90] }] },
        { label: "Premium", cells: [{ k: mins(60), v: couple.premium[60] }] },
      ],
    };
  return {
    unit: c.perPerson,
    rows: [
      // Grupos solo a domicilio (la cabina del spa es para 1 o 2 personas)
      { label: t.places.villa.tab, cells: [{ k: c.from, v: home.relajante[60], from: true }] },
    ],
  };
}

export default async function ServicePage({ params }: { params: Promise<{ lang: string; service: string }> }) {
  const { lang: l, service } = await params;
  if (!locales.includes(l as Locale)) notFound();
  const lang = l as Locale;
  const t = dictionaries[lang];
  const s = find(lang, service);
  if (!s) notFound();
  const c = t.services;
  const alt = alternates((l) => servicePath(l, s.id));
  const book = bookPath(lang, s.query);
  const { unit, rows } = priceRows(t, s);
  const photoKey = s.id === "domicilio" ? "villa" : s.id === "pareja" ? "pareja" : "grupo";
  const icon = s.id === "domicilio" ? "domicilio" : s.id === "pareja" ? "pareja" : "grupo";

  // Datos para Google: el servicio, sus precios y la ruta de navegación
  const allCells = rows.flatMap((r) => r.cells.map((x) => ({ ...x, label: r.label })));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.title,
        description: s.metaDesc,
        serviceType: s.eyebrow,
        url: `${site.url}${servicePath(lang, s.id)}`,
        areaServed: ["Las Terrenas", "El Limón"].map((name) => ({ "@type": "Place", name })),
        provider: { "@id": `${site.url}/#spa`, "@type": "DaySpa", name: site.name },
        offers: allCells.map((x) => ({
          "@type": "Offer",
          name: `${x.label} · ${x.k}`,
          price: x.v,
          priceCurrency: "DOP",
          ...(x.from ? { priceSpecification: { "@type": "PriceSpecification", minPrice: x.v, priceCurrency: "DOP" } } : {}),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.breadcrumb, item: `${site.url}/${lang}` },
          { "@type": "ListItem", position: 2, name: s.eyebrow, item: `${site.url}${servicePath(lang, s.id)}` },
        ],
      },
    ],
  };

  return (
    <main className="sv">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="bkp__top sv__top">
        <Header t={t} lang={lang} tone="dark" alts={alt} />
        <Ripples />
        <div className="wrap bkp__head rise">
          <span className="sv__icon">
            <ExpIcon k={icon} size={26} />
          </span>
          <p className="eyebrow">{s.eyebrow}</p>
          <h1 className="bkp__title">{s.title}</h1>
          <p className="bkp__lead">{s.lead}</p>
          <ul className="sv__chips">
            {s.chips.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="btns sv__btns">
            <a className="btn btn--teal" href={book}>
              {s.book} <Arrow />
            </a>
            <a className="btn btn--ghost" href={waLink(s.waMsg)} target="_blank" rel="noopener noreferrer">
              <WaIcon /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <figure className="ph ph--sv">
          <Image src={photos[photoKey].src} alt={t.photosAlt[photoKey]} width={photos[photoKey].w} height={photos[photoKey].h} sizes="(max-width: 680px) 92vw, 600px" priority />
        </figure>

        {/* Qué incluye */}
        <InView className="sv__card sv__inc">
          <h2 className="sv__h">{c.includesTitle}</h2>
          <ul>
            {s.includes.map((x, i) => (
              <li key={x} style={{ "--i": i } as React.CSSProperties}>
                <Check /> <span>{x}</span>
              </li>
            ))}
          </ul>
          {s.notice && <p className="sv__notice">{s.notice}</p>}
        </InView>

        {/* Precios */}
        <InView className="sv__card sv__price">
          <h2 className="sv__h">
            {c.pricesTitle} <small>· {unit}</small>
          </h2>
          <div className="sv__rows">
            {rows.map((r) => (
              <div key={r.label} className="sv__row" style={{ "--i": 0 } as React.CSSProperties}>
                <p className="sv__rl">{r.label}</p>
                <div className="sv__cells">
                  {r.cells.map((x) => (
                    <div key={x.k} className="sv__cell">
                      <span>{x.k}</span>
                      <b>{fmtRd(x.v)}</b>
                      <small>{fmtUsd(x.v)}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="sv__pnote">{s.priceNote}</p>
          <a className="btn btn--teal sv__pbtn" href={book}>
            {s.book} <Arrow size={14} />
          </a>
        </InView>

        {/* Cómo funciona */}
        <InView className="sv__steps">
          <h2 className="sv__h">{c.stepsTitle}</h2>
          <ol>
            {s.steps.map((x, i) => (
              <li key={x.t} style={{ "--i": i } as React.CSSProperties}>
                <span className="sv__n">{i + 1}</span>
                <span>
                  <b>{x.t}</b>
                  <span>{x.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </InView>
      </div>

      <Reviews t={t} lang={lang} />
      <Faq t={t} lang={lang} items={s.faq} title={c.faqTitle} book={book} />

      {/* Otros servicios */}
      <section className="sec sv__more">
        <div className="wrap">
          <h2 className="sv__h">{c.moreTitle}</h2>
          <div className="sv__others">
            {c.items
              .filter((x) => x.id !== s.id)
              .map((x) => (
                <a key={x.id} href={servicePath(lang, x.id)} className="sv__other">
                  <span className="sv__oicon">
                    <ExpIcon k={x.id === "domicilio" ? "domicilio" : x.id === "pareja" ? "pareja" : "grupo"} size={22} />
                  </span>
                  <span>
                    <b>{x.eyebrow}</b>
                    <span>{x.card}</span>
                  </span>
                  <Arrow size={14} />
                </a>
              ))}
            <a href={`/${lang}#masajes`} className="sv__other">
              <span className="sv__oicon">
                <ExpIcon k="individual" size={22} />
              </span>
              <span>
                <b>{t.about.eyebrow}</b>
                <span>{t.about.massages.map((x) => x.t).join(" · ")}</span>
              </span>
              <Arrow size={14} />
            </a>
          </div>
        </div>
      </section>

      <Footer t={t} lang={lang} alts={alt} />
    </main>
  );
}
