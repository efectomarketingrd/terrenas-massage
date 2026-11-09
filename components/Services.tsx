import type { Dict } from "@/lib/content";
import { bookPath, type Locale } from "@/lib/site";
import { couple, fmtRd, fmtUsd, fromPrice, home } from "@/lib/prices";
import InView from "./InView";
import { Arrow, ExpIcon } from "./Icons";
import { Ripples } from "./Water";

// Sección 2 · Servicios: qué ofrecemos y un enlace directo a la agenda con el servicio ya elegido.
export default function Services({ t, lang, variant = "a" }: { t: Dict; lang: Locale; variant?: "a" | "b" }) {
  const c = t.services;
  const price: Record<string, { rd: number | null; note: string }> = {
    individual: { rd: fromPrice, note: c.perPerson },
    pareja: { rd: couple.basic[60], note: c.forTwo },
    domicilio: { rd: home.relajante[60], note: c.perPerson },
    grupo: { rd: null, note: "" },
  };

  const Price = ({ k }: { k: string }) => {
    const p = price[k];
    return (
      <p className="sv__price">
        {p.rd ? (
          <>
            <small>{c.from}</small> <b>{fmtRd(p.rd)}</b> <span>{fmtUsd(p.rd)} · {p.note}</span>
          </>
        ) : (
          <b>{c.groupDeal}</b>
        )}
      </p>
    );
  };

  return (
    <section id="servicios" className={`sec sv sv--${variant}`}>
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
        </InView>
        <InView className="sv__list">
          {c.items.map((e, i) => {
            const star = e.k === "pareja";
            return (
              <article key={e.k} id={e.k} className={`sv__card ${star ? "sv__card--star" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                {star && <Ripples />}
                <div className="sv__top">
                  <span className="sv__icon">
                    <ExpIcon k={e.k} size={26} />
                  </span>
                  {star && <span className="sv__badge">{c.featured}</span>}
                </div>
                <div className="sv__body">
                  <h3 className="sv__name">{e.t}</h3>
                  <p className="sv__desc">{e.d}</p>
                </div>
                <div className="sv__foot">
                  <Price k={e.k} />
                  <a className={`btn btn--sm ${star ? "btn--teal" : "btn--night"}`} href={bookPath(lang, `tipo=${e.k}`)}>
                    {e.k === "grupo" ? c.quote : c.book} <Arrow size={14} />
                  </a>
                </div>
              </article>
            );
          })}
        </InView>
      </div>
    </section>
  );
}
