"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import { bookPath, type Locale } from "@/lib/site";
import { fmtRd, fmtUsd, individual, type Level, type Minutes, type Pressure } from "@/lib/prices";
import InView from "./InView";

const pressures: Pressure[] = ["relajante", "profundo", "descontracturante"];
const levels: Level[] = ["basico", "premium"];
const mins: Minutes[] = [60, 90];

function Seg<T extends string | number>({ value, opts, label, onChange, name }: { value: T; opts: { v: T; l: string }[]; label: string; onChange: (v: T) => void; name: string }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {opts.map((o) => (
        <button key={String(o.v)} type="button" role="radio" aria-checked={o.v === value} className={o.v === value ? "is-on" : ""} onClick={() => onChange(o.v)} name={name}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

// Indicador de presión (1–3 puntos)
function Dots({ n, label }: { n: number; label: string }) {
  return (
    <span className="dots" aria-label={label}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? "is-on" : ""} />
      ))}
    </span>
  );
}

const pressureLevel: Record<Pressure, number> = { relajante: 1, profundo: 3, descontracturante: 2 };

export default function Massages({ t, lang }: { t: Dict; lang: Locale }) {
  const c = t.massages;
  const [lv, setLv] = useState<Level>("basico");
  const [m, setM] = useState<Minutes>(60);

  const book = (pp: Pressure, l: Level, mm: Minutes) =>
    bookPath(lang, `tipo=individual&masaje=${pp}&nivel=${l}&min=${mm}`);

  const lvSeg = <Seg name="lv" label={c.levelLabel} value={lv} onChange={setLv} opts={levels.map((v) => ({ v, l: c.levels[v] }))} />;
  const mSeg = <Seg name="min" label={c.minLabel} value={m} onChange={setM} opts={mins.map((v) => ({ v, l: `${v} min` }))} />;
  const premiumNote = (
    <p className={`ms__premium ${lv === "premium" ? "is-on" : ""}`}>
      <b>{c.levels.premium}:</b> {c.premiumAdds}
    </p>
  );

  return (
    <section id="masajes" className="sec ms">
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="sec__lead">{c.lead}</p>
        </InView>

        {/* B · Tres tarjetas con interruptores comunes */}
        <>
            <div className="ms-b__ctrl">
              {lvSeg}
              {mSeg}
            </div>
            {premiumNote}
            <InView className="ms-b__list">
              {pressures.map((v, i) => (
                <article key={v} className="ms-b__card" style={{ "--i": i } as React.CSSProperties}>
                  <div className="ms-b__top">
                    <h3>{c.names[v]}</h3>
                    <Dots n={pressureLevel[v]} label={c.press[v]} />
                  </div>
                  <p className="ms-b__desc">{c.desc[v]}</p>
                  <div className="ms-b__foot">
                    <p className="ms-b__price" aria-live="polite">
                      <b>{fmtRd(individual[v][lv][m])}</b> <span>{fmtUsd(individual[v][lv][m])}</span>
                    </p>
                    <a className="btn btn--teal btn--sm" href={book(v, lv, m)}>
                      {c.bookShort}
                    </a>
                  </div>
                </article>
              ))}
            </InView>
            <p className="ms__foot">{c.perPersonNote}</p>
        </>

      </div>
    </section>
  );
}
