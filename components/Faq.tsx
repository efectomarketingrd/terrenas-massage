"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import { bookPath, waLink, type Locale } from "@/lib/site";
import InView from "./InView";
import { Arrow, WaIcon } from "./Icons";
import { Ripples } from "./Water";

// Sección 6 · Preguntas frecuentes + cierre "¿Listo para relajarte?"
// En las páginas de servicio recibe sus propias preguntas (items) y el enlace de reserva (book).
export default function Faq({ t, lang, items, title, book }: { t: Dict; lang: Locale; items?: { q: string; a: string }[]; title?: string; book?: string }) {
  const f = t.faq;
  const list = items ?? f.items;
  const c = t.closing;
  const [open, setOpen] = useState(0);

  // Datos estructurados para Google (preguntas frecuentes)
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };

  const closing = (
    <div className="cl cl--card">
      <Ripples />
      <h2 className="cl__t">{c.title}</h2>
      <p className="cl__d">{c.text}</p>
      <div className="cl__btns">
        <a className="btn btn--teal" href={book ?? bookPath(lang)}>
          {c.book} <Arrow size={14} />
        </a>
        <a className="btn btn--ghost" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer">
          <WaIcon /> {c.wa}
        </a>
      </div>
    </div>
  );

  return (
    <section id="preguntas" className="sec fq">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <div className="wrap">
          <InView className="sec__head">
            <p className="eyebrow">{f.eyebrow}</p>
            <h2 className="sec__title">{title ?? f.title}</h2>
          </InView>
          <div className="fq__list">
            {list.map((it, i) => {
              const on = open === i;
              return (
                <div key={it.q} className={`fq__item ${on ? "is-open" : ""}`}>
                  <button type="button" aria-expanded={on} aria-controls={`fq-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    <span>{it.q}</span>
                    <em className="ab__plus" aria-hidden="true" />
                  </button>
                  <div id={`fq-${i}`} className="fq__a" hidden={!on}>
                    <p>{it.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <a className="fq__pol" href={`${bookPath(lang)}#politicas`}>
            {f.policies} <Arrow size={14} />
          </a>
          {closing}
        </div>
      </section>
  );
}
