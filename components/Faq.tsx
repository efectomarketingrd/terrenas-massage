"use client";

import { useState } from "react";
import Image from "next/image";
import type { Dict } from "@/lib/content";
import { bookPath, waLink, type Locale } from "@/lib/site";
import InView from "./InView";
import { Arrow, WaIcon } from "./Icons";
import { Ripples } from "./Water";

// Sección 6 · Preguntas frecuentes + cierre "¿Listo para relajarte?"
export default function Faq({ t, lang, variant = "a" }: { t: Dict; lang: Locale; variant?: "a" | "b" }) {
  const f = t.faq;
  const c = t.closing;
  const [open, setOpen] = useState(0);

  // Datos estructurados para Google (preguntas frecuentes)
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: f.items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };

  const closing = (
    <div className={`cl ${variant === "b" ? "cl--band" : "cl--card"}`}>
      <Ripples />
      {variant === "b" && <Image className="cl__logo" src="/brand/terrenas-massage-blanco.png" alt="" width={824} height={180} sizes="220px" />}
      <h2 className="cl__t">{c.title}</h2>
      <p className="cl__d">{c.text}</p>
      <div className="cl__btns">
        <a className="btn btn--teal" href={bookPath(lang)}>
          {c.book} <Arrow size={14} />
        </a>
        <a className="btn btn--ghost" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer">
          <WaIcon /> {c.wa}
        </a>
      </div>
    </div>
  );

  return (
    <>
      <section id="preguntas" className="sec fq">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <div className="wrap">
          <InView className="sec__head">
            <p className="eyebrow">{f.eyebrow}</p>
            <h2 className="sec__title">{f.title}</h2>
          </InView>
          <div className="fq__list">
            {f.items.map((it, i) => {
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
          {variant === "a" && closing}
        </div>
      </section>
      {variant === "b" && closing}
    </>
  );
}
