import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { alternates, slugs } from "@/lib/i18n";
import { dictionaries } from "@/lib/content";
import { locales, policiesPdf, site, waLink, type Locale } from "@/lib/site";
import { cruise, cruiseDocs, cruisePrice, stopImg } from "@/lib/cruise";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import InView from "@/components/InView";
import CruiseRoute from "@/components/CruiseRoute";
import CruiseBook from "@/components/CruiseBook";
import { Ripples } from "@/components/Water";
import { Arrow, Check, WaIcon } from "@/components/Icons";

// Experiencia para cruceristas de Port Samaná: /es/cruceros · /en/cruise-excursion · /fr/excursion-croisiere
const path = (l: Locale) => `/${l}/${slugs.cruise[l]}`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) return {};
  const c = cruise[lang as Locale];
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: { canonical: path(lang as Locale), languages: alternates(path) },
    openGraph: { title: c.metaTitle, description: c.metaDesc, url: path(lang as Locale), images: [{ url: "/og.png", width: 1200, height: 630 }] },
  };
}

const SAFE_ICONS = [
  "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z M8.5 12l2.5 2.5 4.5-5",
  "M5 17h14M6 17l1.5-6h9L18 17M8 11l1.2-3.5h5.6L16 11M7.5 20a1.5 1.5 0 1 0 0-.01M16.5 20a1.5 1.5 0 1 0 0-.01",
  "M4 5h16v11H9l-5 4z M8 10h8",
  "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
];

export default async function CruisePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  if (!locales.includes(l as Locale)) notFound();
  const lang = l as Locale;
  const t = dictionaries[lang];
  const c = cruise[lang];
  const alt = alternates(path);
  // WhatsApp rápido: siempre en español para la recepción
  const wa = waLink(`Hola, quiero información sobre la experiencia para cruceristas (masaje + recorrido por Las Terrenas). ${c.langNote}`.trim());

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: c.title,
        description: c.metaDesc,
        url: `${site.url}${path(lang)}`,
        touristType: "Cruise passengers",
        provider: { "@id": `${site.url}/#spa`, "@type": "DaySpa", name: site.name },
        itinerary: { "@type": "ItemList", itemListElement: Object.values(c.stops).map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.t })) },
        offers: [
          { "@type": "Offer", name: c.prices[0].t, price: cruisePrice.person, priceCurrency: "USD" },
          { "@type": "Offer", name: c.prices[1].t, price: cruisePrice.couple, priceCurrency: "USD" },
        ],
      },
    ],
  };

  return (
    <main className="sv cz">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="bkp__top sv__top">
        <Header t={t} lang={lang} tone="dark" alts={alt} />
        <Ripples />
        <div className="wrap bkp__head rise">
          <span className="sv__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" className="ic-line">
              <path d="M3 17h18l-2 4H5z M6 17V9h12v8 M9 9V5h6v4 M2 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" />
            </svg>
          </span>
          <p className="eyebrow">{c.eyebrow}</p>
          <h1 className="bkp__title">{c.title}</h1>
          <p className="bkp__lead">{c.lead}</p>
          <ul className="sv__chips">
            {c.chips.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="cz-from">
            {c.from} <b>US${cruisePrice.person}</b> {c.perPerson}
          </p>
          <div className="btns sv__btns">
            <a className="btn btn--teal" href="#reservar">
              {c.book} <Arrow />
            </a>
            <a className="btn btn--ghost" href={wa} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click">
              <WaIcon /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <figure className="ph ph--sv">
          <Image src={stopImg.popy} alt={c.stops.popy.t} width={2048} height={1152} sizes="(max-width: 680px) 92vw, 600px" priority />
        </figure>

        {/* Qué incluye */}
        <InView className="sv__card sv__inc">
          <h2 className="sv__h">{c.includesTitle}</h2>
          <ul>
            {c.includes.map((x, i) => (
              <li key={x} style={{ "--i": i } as React.CSSProperties}>
                <Check /> <span>{x}</span>
              </li>
            ))}
          </ul>
        </InView>

        {/* Ruta interactiva */}
        <section className="sv__card cz-card" id="ruta">
          <h2 className="sv__h">{c.routeTitle}</h2>
          <p className="cz-lead">{c.routeLead}</p>
          <CruiseRoute lang={lang} />
        </section>

        {/* Cómo es tu día */}
        <InView className="sv__steps cz-day">
          <h2 className="sv__h">{c.dayTitle}</h2>
          <ol>
            {c.day.map((x, i) => (
              <li key={x.h} style={{ "--i": i } as React.CSSProperties}>
                <span className="cz-day__t">{x.t}</span>
                <span>
                  <b>{x.h}</b>
                  {x.d && <span>{x.d}</span>}
                </span>
              </li>
            ))}
          </ol>
          <p className="sv__pnote">{c.dayNote}</p>
        </InView>

        {/* Precios */}
        <InView className="sv__card cz-prices">
          <h2 className="sv__h">{c.pricesTitle}</h2>
          <ul>
            {c.prices.map((p) => (
              <li key={p.t}>
                <span>
                  <b>{p.t}</b>
                  <small>{p.d}</small>
                </span>
                <em>{p.v}</em>
              </li>
            ))}
          </ul>
          {c.priceNotes.map((x) => (
            <p key={x} className="sv__pnote">
              {x}
            </p>
          ))}
          <p className="cz-spots">{c.spots}</p>
        </InView>

        {/* Reserva */}
        <section className="sv__card cz-card" id="reservar">
          <h2 className="sv__h">{c.formTitle}</h2>
          <CruiseBook lang={lang} />
        </section>

        {/* Seguridad */}
        <section className="cz-safe">
          <h2 className="sv__h">{c.safetyTitle}</h2>
          <p className="cz-lead">{c.safetyLead}</p>
          <div className="cz-safe__grid">
            {c.safety.map((x, i) => (
              <div key={x.t} className="cz-safe__i">
                <svg viewBox="0 0 24 24" width="22" height="22" className="ic-line" aria-hidden="true">
                  <path d={SAFE_ICONS[i]} />
                </svg>
                <b>{x.t}</b>
                <span>{x.d}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Cancelaciones */}
        <section className="sv__card cz-cancel">
          <h2 className="sv__h">{c.cancelTitle}</h2>
          <ul>
            {c.cancel.map((x) => (
              <li key={x}>
                <Check /> <span>{x}</span>
              </li>
            ))}
          </ul>
          <a className="pdf-link" href={policiesPdf[lang]} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="18" height="18" className="ic-line" aria-hidden="true">
              <path d="M7 3h7l5 5v13H7z" />
              <path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5" />
            </svg>
            {c.downloads.policies}
          </a>
        </section>

        {/* Información útil (también en el mapa) */}
        <section className="sv__card cz-help">
          <h2 className="sv__h">{c.infoTitle}</h2>
          <p className="cz-lead">{c.infoLead}</p>
          <a className="btn btn--night cz-help__btn" href="#info">
            {c.layers.info} <Arrow size={14} />
          </a>
        </section>

        {/* Descargas */}
        <section className="cz-dl">
          <h2 className="sv__h">{c.downloads.title}</h2>
          <div>
            {[
              [cruiseDocs[lang].flyer, c.downloads.flyer],
              [cruiseDocs[lang].stops, c.downloads.stops],
            ].map(([href, label]) => (
              <a key={href} className="pdf-link pdf-link--card" href={href} target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="18" height="18" className="ic-line" aria-hidden="true">
                  <path d="M7 3h7l5 5v13H7z" />
                  <path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5" />
                </svg>
                <span>
                  <b>{label}</b>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>

      <Faq t={t} lang={lang} items={c.faq} title={c.faqTitle} book="#reservar" />
      <Footer t={t} lang={lang} alts={alt} />
    </main>
  );
}
