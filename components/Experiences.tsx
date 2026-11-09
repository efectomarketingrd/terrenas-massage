import type { Dict } from "@/lib/content";
import { couple, fmtRd, fmtUsd, fromPrice, home } from "@/lib/prices";
import InView from "./InView";
import { Arrow, ExpIcon } from "./Icons";

// Sección 2 · Elige tu experiencia (4 tarjetas que llevan a cada servicio)
export default function Experiences({ t }: { t: Dict }) {
  const c = t.experiences;
  const from: Record<string, number | null> = {
    individual: fromPrice,
    pareja: couple.basic[60],
    domicilio: home.relajante[60],
    grupo: null,
  };
  return (
    <section id="experiencias" className="sec exp">
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
        </InView>
        <InView className="exp__grid">
          {c.items.map((e, i) => {
            const p = from[e.k];
            return (
              <a key={e.k} href={`#${e.k === "individual" ? "masajes" : e.k}`} className="exp__card" style={{ "--i": i } as React.CSSProperties}>
                <span className="exp__icon">
                  <ExpIcon k={e.k} size={28} />
                </span>
                <b className="exp__name">{e.t}</b>
                <span className="exp__desc">{e.d}</span>
                <span className="exp__price">
                  {p ? (
                    <>
                      {c.from} <b>{fmtRd(p)}</b>
                      <small>{fmtUsd(p)}{e.k === "pareja" ? ` · ${c.forTwo}` : ""}</small>
                    </>
                  ) : (
                    <b>{c.groupDeal}</b>
                  )}
                </span>
                <span className="exp__go" aria-hidden="true">
                  <Arrow size={15} />
                </span>
              </a>
            );
          })}
        </InView>
      </div>
    </section>
  );
}
