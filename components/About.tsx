"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/content";
import { bookPath, type Locale } from "@/lib/site";
import InView from "./InView";
import { Arrow, MassageIcon } from "./Icons";
import { Ripples, Waves } from "./Water";

// Sección 2 · Nuestros masajes (sin precios: están en la agenda).
// Diseño B (selector + tarjeta animada) por defecto; ?masajes=a muestra el acordeón para comparar.
export default function About({ t, lang, variant = "b" }: { t: Dict; lang: Locale; variant?: "a" | "b" }) {
  const c = t.about;
  const bookWord = lang === "es" ? "Reservar" : "Book";
  const items = [
    ...c.massages.map((m) => ({ k: m.k, t: m.t, tag: m.tag, d: m.d, ideal: m.ideal, p: m.p, href: bookPath(lang, `tipo=individual&masaje=${m.k}`), cta: c.book })),
    ...c.extras.map((e) => ({
      k: e.k,
      t: e.t,
      tag: e.tag,
      d: e.d,
      ideal: "",
      p: 0,
      href: bookPath(lang, e.k === "premium" ? "tipo=individual&nivel=premium" : `tipo=${e.k}`),
      cta: bookWord,
    })),
  ];
  const [open, setOpen] = useState<string>(items[0].k);
  const [sel, setSel] = useState<string>(items[0].k);
  const [dir, setDir] = useState<1 | -1>(1);
  const [auto, setAuto] = useState(true); // pasa sola hasta que el visitante toque un servicio
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const cur = items.find((i) => i.k === sel) ?? items[0];
  const idx = items.findIndex((i) => i.k === sel);
  const AUTO_MS = 6000;

  const choose = (k: string, user = true) => {
    const n = items.findIndex((i) => i.k === k);
    setDir(n >= idx ? 1 : -1);
    setSel(k);
    if (user) setAuto(false);
  };

  // Solo avanza sola mientras la sección está en pantalla y sin "reducir movimiento"
  useEffect(() => {
    const el = box.current;
    if (!el || variant !== "b") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [variant]);

  useEffect(() => {
    if (!auto || !visible || variant !== "b") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setDir(1);
      setSel(items[(idx + 1) % items.length].k);
    }, AUTO_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, visible, sel, variant]);

  // Medidor de presión: se llena con animación al mostrarse
  const Meter = ({ n, light = false }: { n: number; light?: boolean }) => (
    <span className={`ab__meter ${light ? "ab__meter--light" : ""}`} aria-label={`${c.pressure} ${n}/3`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? "is-on" : ""} style={{ "--m": i } as React.CSSProperties} />
      ))}
    </span>
  );

  return (
    <section id="masajes" className={`sec ab ab--${variant}`}>
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="sec__lead">{c.lead}</p>
        </InView>

        {/* A · Acordeón animado */}
        {variant === "a" && (
          <InView className="ab__acc">
            {items.map((it, i) => {
              const on = open === it.k;
              return (
                <div key={it.k} className={`ab__item ${on ? "is-open" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                  <button type="button" className="ab__btn" aria-expanded={on} aria-controls={`ab-${it.k}`} onClick={() => setOpen(on ? "" : it.k)}>
                    <span className="ab__ico">
                      <MassageIcon k={it.k} />
                    </span>
                    <span className="ab__ttl">
                      <b>{it.t}</b>
                      <small>{it.tag}</small>
                    </span>
                    <em className="ab__plus" aria-hidden="true" />
                  </button>
                  <div id={`ab-${it.k}`} className="ab__wrapP" inert={!on}>
                    <div className="ab__panel">
                      {it.p > 0 && (
                        <div className="ab__press">
                          <span>{c.pressure}</span>
                          <Meter n={it.p} />
                        </div>
                      )}
                      <p className="ab__desc">{it.d}</p>
                      {it.ideal && (
                        <p className="ab__ideal">
                          <b>{c.idealFor}:</b> {it.ideal}
                        </p>
                      )}
                      <a className="btn btn--night btn--sm ab__cta" href={it.href}>
                        {it.cta} <Arrow size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </InView>
        )}

        {/* B · Selector de iconos + tarjeta grande animada */}
        {variant === "b" && (
          <div ref={box}>
            <InView className="ab__tabsB">
              <div className="ab__chips" role="tablist" aria-label={c.title}>
                {items.map((it, i) => (
                  <button
                    key={it.k}
                    type="button"
                    role="tab"
                    aria-selected={sel === it.k}
                    aria-controls="ab-card"
                    className={sel === it.k ? "is-on" : ""}
                    style={{ "--i": i } as React.CSSProperties}
                    onClick={() => choose(it.k)}
                  >
                    <span className="ab__chipIco">
                      <MassageIcon k={it.k} size={22} />
                    </span>
                    <span className="ab__chipT">{it.t}</span>
                    {sel === it.k && auto && visible && <span className="ab__timer" key={`t-${sel}`} style={{ "--ms": `${AUTO_MS}ms` } as React.CSSProperties} aria-hidden="true" />}
                  </button>
                ))}
              </div>
              <div id="ab-card" role="tabpanel" aria-live="polite" className={`ab__card ${dir === 1 ? "ab__card--fwd" : "ab__card--back"}`} key={cur.k}>
                <Ripples />
                <div className="ab__cardTop">
                  <span className="ab__cardIco">
                    <MassageIcon k={cur.k} size={28} />
                  </span>
                  <div>
                    <h3>{cur.t}</h3>
                    <p>{cur.tag}</p>
                  </div>
                </div>
                {cur.p > 0 && (
                  <div className="ab__press ab__press--light">
                    <span>{c.pressure}</span>
                    <Meter n={cur.p} light />
                  </div>
                )}
                <p className="ab__cardD">{cur.d}</p>
                {cur.ideal && (
                  <p className="ab__cardIdeal">
                    <b>{c.idealFor}:</b> {cur.ideal}
                  </p>
                )}
                <a className="btn btn--teal ab__cardCta" href={cur.href}>
                  {cur.cta} <Arrow size={14} />
                </a>
                <Waves cls="waves--card" />
              </div>
            </InView>
          </div>
        )}
      </div>
    </section>
  );
}
