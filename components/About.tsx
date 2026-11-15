"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import { bookPath, type Locale } from "@/lib/site";
import InView from "./InView";
import { Arrow, WhyIcon } from "./Icons";

// Sección 2 · Nuestros masajes: acordeón informativo + por qué elegirnos. Sin precios (están en la agenda).
export default function About({ t, lang }: { t: Dict; lang: Locale }) {
  const c = t.about;
  const [open, setOpen] = useState<string>(c.massages[0].k);

  const Dots = ({ n }: { n: number }) => (
    <span className="ab__dots" aria-label={`${c.pressure} ${n}/3`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? "is-on" : ""} />
      ))}
    </span>
  );

  const massageHref = (k: string) => bookPath(lang, `tipo=individual&masaje=${k}`);
  const extraHref = (k: string) => bookPath(lang, k === "premium" ? "tipo=individual&nivel=premium" : `tipo=${k}`);

  const Why = () => (
    <div className="ab__why">
      <h3 className="ab__h3">{c.whyTitle}</h3>
      <ul>
        {c.why.map((w) => (
          <li key={w.k}>
            <span className="ab__wicon">
              <WhyIcon k={w.k} />
            </span>
            <b>{w.t}</b>
            <span>{w.d}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section id="masajes" className="sec ab">
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="sec__lead">{c.lead}</p>
        </InView>

        {/* B · Acordeón con todos los servicios */}
        <>
            <InView className="ab__acc">
              {[...c.massages.map((m) => ({ k: m.k, t: m.t, d: m.d, ideal: m.ideal, p: m.p, href: massageHref(m.k), cta: c.book })), ...c.extras.map((e) => ({ k: e.k, t: e.t, d: e.d, ideal: "", p: 0, href: extraHref(e.k), cta: lang === "es" ? "Reservar" : "Book" }))].map((it) => {
                const on = open === it.k;
                return (
                  <div key={it.k} className={`ab__item ${on ? "is-open" : ""}`}>
                    <button type="button" aria-expanded={on} aria-controls={`ab-${it.k}`} onClick={() => setOpen(on ? "" : it.k)}>
                      <span>{it.t}</span>
                      {it.p > 0 && <Dots n={it.p} />}
                      <em className="ab__plus" aria-hidden="true" />
                    </button>
                    <div id={`ab-${it.k}`} className="ab__panel" hidden={!on}>
                      <p className="ab__desc">{it.d}</p>
                      {it.ideal && (
                        <p className="ab__ideal">
                          <b>{c.idealFor}:</b> {it.ideal}
                        </p>
                      )}
                      <a className="ab__link" href={it.href}>
                        {it.cta} <Arrow size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </InView>
            <InView>
              <Why />
            </InView>
          </>

      </div>
    </section>
  );
}
