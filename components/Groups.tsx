import type { Dict } from "@/lib/content";
import { bookPath, waLink, type Locale } from "@/lib/site";
import { servicePath } from "@/lib/services";
import Image from "next/image";
import { photos } from "@/lib/images";
import InView from "./InView";
import { Arrow, ExpIcon, WaIcon } from "./Icons";
import { Ripples, Waves } from "./Water";

// Sección 4 · Grupos y eventos (con los 3 pasos)
export default function Groups({ t, lang }: { t: Dict; lang: Locale }) {
  const c = t.groups;
  const buttons = (
    <div className="gr__btns">
      <a className="btn btn--teal" href={bookPath(lang, "tipo=grupo")}>
        {c.cta} <Arrow size={14} />
      </a>
      <a className="btn btn--ghost" href={waLink(c.waMsg)} target="_blank" rel="noopener noreferrer">
        <WaIcon /> {c.wa}
      </a>
    </div>
  );
  return (
    <section id="grupos" className="gr">
      <Ripples />
      <div className="wrap gr__wrap">
        <InView className="gr__head">
          <span className="gr__icon">
            <ExpIcon k="grupo" size={28} />
          </span>
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="gr__text">{c.text}</p>
          <ul className="gr__tags">
            {c.tags.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </InView>

        <figure className="ph ph--gr">
          <Image src={photos.grupo.src} alt={t.photosAlt.grupo} width={photos.grupo.w} height={photos.grupo.h} sizes="(max-width: 680px) 92vw, 600px" />
        </figure>

        <InView className="gr__steps">
            <p className="gr__stitle">{c.stepsTitle}</p>
            <ol>
              {c.steps.map((s, i) => (
                <li key={s.t} style={{ "--i": i } as React.CSSProperties}>
                  <span>{i + 1}</span>
                  <div>
                    <b>{s.t}</b>
                    <p>{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </InView>

        <p className="gr__note">{c.note}</p>
        {buttons}
        <a className="sv-more sv-more--light" href={servicePath(lang, "grupo")}>
          {c.more} <Arrow size={13} />
        </a>
      </div>
      <Waves edge />
    </section>
  );
}
