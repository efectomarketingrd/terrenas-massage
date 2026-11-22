"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import { bookPath, mapsUrl, type Locale } from "@/lib/site";
import { servicePath } from "@/lib/services";
import InView from "./InView";
import { Arrow, Check, ExpIcon, Pin } from "./Icons";

type K = "spa" | "villa";

// Sección 3 · En el spa o en tu villa (pestañas)
export default function Places({ t, lang }: { t: Dict; lang: Locale }) {
  const c = t.places;
  const [tab, setTab] = useState<K>("spa");
  const href = (k: K) => bookPath(lang, `tipo=${k === "spa" ? "individual" : "domicilio"}`);

  const Body = ({ k }: { k: K }) => {
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
        <a className="btn btn--night pl__cta" href={href(k)}>
          {p.cta} <Arrow size={14} />
        </a>
        {k === "villa" && (
          <a className="sv-more" href={servicePath(lang, "domicilio")}>
            {c.villa.more} <Arrow size={13} />
          </a>
        )}
      </>
    );
  };

  return (
    <section id="lugar" className="sec pl">
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="sec__lead">{c.lead}</p>
        </InView>

        {/* A · Pestañas */}
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

      </div>
    </section>
  );
}
