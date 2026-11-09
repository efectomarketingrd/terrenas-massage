"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import { waLink } from "@/lib/site";
import { fmtRd, fmtUsd, individual, type Level, type Minutes, type Pressure } from "@/lib/prices";
import InView from "./InView";
import { WaIcon } from "./Icons";

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

export default function Massages({ t, variant }: { t: Dict; variant: "a" | "b" | "c" }) {
  const c = t.massages;
  const [p, setP] = useState<Pressure>("relajante");
  const [lv, setLv] = useState<Level>("basico");
  const [m, setM] = useState<Minutes>(60);

  const book = (pp: Pressure, l: Level, mm: Minutes) =>
    waLink(c.waMsg.replace("{m}", c.names[pp]).replace("{l}", c.levels[l]).replace("{min}", String(mm)).replace("{p}", fmtRd(individual[pp][l][mm])));

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

        {/* A · Calculadora: eliges y ves un solo precio */}
        {variant === "a" && (
          <InView className="ms-a">
            <p className="ms__label">{c.pressureLabel}</p>
            <div className="ms-a__press">
              {pressures.map((v) => (
                <button key={v} type="button" aria-pressed={p === v} className={p === v ? "is-on" : ""} onClick={() => setP(v)}>
                  <Dots n={pressureLevel[v]} label={c.press[v]} />
                  <b>{c.names[v]}</b>
                  <span>{c.press[v]}</span>
                </button>
              ))}
            </div>
            <div className="ms-a__row">
              <div>
                <p className="ms__label">{c.levelLabel}</p>
                {lvSeg}
              </div>
              <div>
                <p className="ms__label">{c.minLabel}</p>
                {mSeg}
              </div>
            </div>
            {premiumNote}
            <div className="ms-a__total">
              <div>
                <p className="ms-a__sum">
                  {c.names[p]} · {c.levels[lv]} · {m} min
                </p>
                <p className="ms-a__price" aria-live="polite">
                  <b>{fmtRd(individual[p][lv][m])}</b> <span>{fmtUsd(individual[p][lv][m])}</span>
                </p>
                <p className="ms-a__pp">{c.perPerson}</p>
              </div>
              <a className="btn btn--teal" href={book(p, lv, m)} target="_blank" rel="noopener noreferrer">
                <WaIcon /> {c.book}
              </a>
            </div>
          </InView>
        )}

        {/* B · Tres tarjetas con interruptores comunes */}
        {variant === "b" && (
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
                    <a className="btn btn--teal btn--sm" href={book(v, lv, m)} target="_blank" rel="noopener noreferrer">
                      {c.bookShort}
                    </a>
                  </div>
                </article>
              ))}
            </InView>
            <p className="ms__foot">{c.perPersonNote}</p>
          </>
        )}

        {/* C · Tabla de precios con pestañas Básico / Premium */}
        {variant === "c" && (
          <InView className="ms-c">
            {lvSeg}
            {premiumNote}
            <table className="ms-c__table">
              <thead>
                <tr>
                  <th scope="col">{c.massage}</th>
                  <th scope="col">60 min</th>
                  <th scope="col">90 min</th>
                </tr>
              </thead>
              <tbody>
                {pressures.map((v) => (
                  <tr key={v}>
                    <th scope="row">
                      <b>{c.names[v]}</b>
                      <span>{c.press[v]}</span>
                    </th>
                    {mins.map((mm) => (
                      <td key={mm}>
                        <b>{fmtRd(individual[v][lv][mm])}</b>
                        <span>{fmtUsd(individual[v][lv][mm])}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="ms__foot">{c.perPersonNote}</p>
            <a className="btn btn--teal ms-c__btn" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer">
              <WaIcon /> {c.book}
            </a>
          </InView>
        )}
      </div>
    </section>
  );
}
