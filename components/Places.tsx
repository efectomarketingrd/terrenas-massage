"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import { bookPath, mapsUrl, type Locale } from "@/lib/site";
import InView from "./InView";
import { Arrow, Check, ExpIcon, Pin } from "./Icons";
import { Waves } from "./Water";

type K = "spa" | "villa";

// Sección 3 · En el spa o en tu villa
export default function Places({ t, lang, variant = "a" }: { t: Dict; lang: Locale; variant?: "a" | "b" | "c" }) {
  const c = t.places;
  const [tab, setTab] = useState<K>("spa");
  const href = (k: K) => bookPath(lang, `tipo=${k === "spa" ? "individual" : "domicilio"}`);

  const Body = ({ k, dark = false }: { k: K; dark?: boolean }) => {
    const p = c[k];
    return (
      <>
        <div className="pl__head">
          <span className="pl__icon">
            <ExpIcon k={k === "spa" ? "individual" : "domicilio"} size={26} />
          </span>
          <div>
            <h3 className="pl__t">{p.t}</h3>
            <p className="pl__d">{p.d}</p>
          </div>
        </div>
        <ul className="pl__list">
          {p.items.map((it) => (
            <li key={it}>
              <Check /> <span>{it}</span>
            </li>
          ))}
        </ul>
        {k === "spa" && (
          <a className="pl__map" href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Pin /> <span>{c.spa.where}</span> <b>{c.spa.map} ↗</b>
          </a>
        )}
        <a className={`btn ${dark ? "btn--teal" : "btn--night"} pl__cta`} href={href(k)}>
          {p.cta} <Arrow size={14} />
        </a>
      </>
    );
  };

  return (
    <section id="lugar" className={`sec pl pl--${variant}`}>
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="sec__lead">{c.lead}</p>
        </InView>

        {/* A · Pestañas */}
        {variant === "a" && (
          <InView className="pl__tabs">
            <div className="seg" role="tablist" aria-label={c.title}>
              {(["spa", "villa"] as K[]).map((k) => (
                <button key={k} type="button" role="tab" id={`pl-tab-${k}`} aria-controls={`pl-panel-${k}`} aria-selected={tab === k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>
                  {c[k].tab}
                </button>
              ))}
            </div>
            <div className="pl__card" role="tabpanel" id={`pl-panel-${tab}`} aria-labelledby={`pl-tab-${tab}`} key={tab}>
              <Body k={tab} />
            </div>
          </InView>
        )}

        {/* B · Dos tarjetas: spa clara, villa noche */}
        {variant === "b" && (
          <InView className="pl__stack">
            <div className="pl__card">
              <Body k="spa" />
            </div>
            <div className="pl__card pl__card--dark">
              <Waves cls="waves--card" />
              <Body k="villa" dark />
            </div>
          </InView>
        )}

        {/* C · Comparación lado a lado */}
        {variant === "c" && (
          <InView className="pl__cmp">
            {(["spa", "villa"] as K[]).map((k) => (
              <div key={k} className={`pl__col ${k === "villa" ? "pl__col--dark" : ""}`}>
                <span className="pl__icon">
                  <ExpIcon k={k === "spa" ? "individual" : "domicilio"} size={24} />
                </span>
                <h3 className="pl__t">{c[k].tab}</h3>
                <ul className="pl__list pl__list--sm">
                  {c[k].items.slice(0, 3).map((it) => (
                    <li key={it}>
                      <Check size={14} /> <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <a className={`btn btn--sm ${k === "villa" ? "btn--teal" : "btn--night"}`} href={href(k)}>
                  {lang === "es" ? "Reservar" : "Book"}
                </a>
              </div>
            ))}
          </InView>
        )}
      </div>
    </section>
  );
}
