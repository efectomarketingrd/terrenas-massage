"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import { bookPath, type Locale } from "@/lib/site";
import InView from "./InView";
import { Arrow, ExpIcon, WhyIcon } from "./Icons";
import { Ripples } from "./Water";

// Sección 2 · Nuestros masajes: información y calidad, sin precios (los precios están en la agenda).
export default function About({ t, lang, variant = "a" }: { t: Dict; lang: Locale; variant?: "a" | "b" | "c" }) {
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

  const Why = ({ compact = false }: { compact?: boolean }) => (
    <div className={`ab__why ${compact ? "ab__why--compact" : ""}`}>
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
    <section id="masajes" className={`sec ab ab--${variant}`}>
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="sec__lead">{c.lead}</p>
        </InView>

        {/* A · Tarjetas de masajes + extras + por qué elegirnos */}
        {variant === "a" && (
          <>
            <InView className="ab__list">
              {c.massages.map((m, i) => (
                <article key={m.k} className="ab__card" style={{ "--i": i } as React.CSSProperties}>
                  <div className="ab__top">
                    <h3 className="ab__name">{m.t}</h3>
                    <Dots n={m.p} />
                  </div>
                  <p className="ab__desc">{m.d}</p>
                  <p className="ab__ideal">
                    <b>{c.idealFor}:</b> {m.ideal}
                  </p>
                  <a className="ab__link" href={massageHref(m.k)}>
                    {c.book} <Arrow size={14} />
                  </a>
                </article>
              ))}
            </InView>
            <InView className="ab__extras">
              {c.extras.map((e, i) => (
                <a key={e.k} href={extraHref(e.k)} className={`ab__extra ${e.k === "pareja" ? "ab__extra--star" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                  {e.k === "pareja" && <Ripples />}
                  <span className="ab__xicon">{e.k === "premium" ? <WhyIcon k="premium" /> : <ExpIcon k={e.k} size={24} />}</span>
                  <span className="ab__xbody">
                    <b>{e.t}</b>
                    <span>{e.d}</span>
                  </span>
                  <Arrow size={15} />
                </a>
              ))}
            </InView>
            <InView>
              <Why />
            </InView>
          </>
        )}

        {/* B · Acordeón con todos los servicios */}
        {variant === "b" && (
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
        )}

        {/* C · Primero la calidad, luego los masajes en lista breve */}
        {variant === "c" && (
          <>
            <InView>
              <Why compact />
            </InView>
            <InView className="ab__brief">
              {c.massages.map((m) => (
                <a key={m.k} href={massageHref(m.k)} className="ab__row">
                  <span className="ab__rowt">
                    <b>{m.t}</b>
                    <Dots n={m.p} />
                  </span>
                  <span className="ab__rowd">{m.ideal}</span>
                  <Arrow size={15} />
                </a>
              ))}
              {c.extras.map((e) => (
                <a key={e.k} href={extraHref(e.k)} className="ab__row ab__row--x">
                  <span className="ab__rowt">
                    <b>{e.t}</b>
                  </span>
                  <span className="ab__rowd">{e.d}</span>
                  <Arrow size={15} />
                </a>
              ))}
            </InView>
          </>
        )}
      </div>
    </section>
  );
}
