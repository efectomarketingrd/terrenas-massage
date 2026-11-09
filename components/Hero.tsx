import Image from "next/image";
import type { Dict } from "@/lib/content";
import { bookPath, waLink, type Locale } from "@/lib/site";
import { fmtRd, fmtUsd, fromPrice } from "@/lib/prices";
import Header from "./Header";
import { Arrow, Clock, WaIcon } from "./Icons";
import { Ripples, Waves } from "./Water";

// Portada: noche completa con el logo grande, ondas de agua y reserva visible sin desplazarse.
export default function Hero({ t, lang }: { t: Dict; lang: Locale }) {
  return (
    <section className="hA">
      <Header t={t} lang={lang} tone="dark" logo={false} />
      <Ripples />
      <div className="hA__body rise">
        <p className="eyebrow">{t.hero.eyebrow}</p>
        <Image className="hA__logo" src="/brand/terrenas-massage-blanco.png" alt="Terrenas Massage · Relax your body" width={824} height={180} priority sizes="(max-width: 480px) 82vw, 380px" />
        <h1 className="hA__title">{t.hero.title}</h1>
        <p className="hA__text">{t.hero.text}</p>
        <div className="btns">
          <a className="btn btn--teal" href={bookPath(lang)}>
            {t.hero.book} <Arrow />
          </a>
          <a className="btn btn--ghost" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer">
            <WaIcon /> {t.hero.wa}
          </a>
        </div>
        <ul className="meta">
          <li>
            <Clock /> {t.hero.open}
          </li>
          <li>
            <p className="price-line">
              {t.hero.from} <b>{fmtRd(fromPrice)}</b> <span>· {fmtUsd(fromPrice)}</span> {t.hero.perPerson}
            </p>
          </li>
        </ul>
      </div>
      <a className="hA__scroll" href="#experiencias" aria-label={t.hero.scroll}>
        <span />
      </a>
      <Waves edge />
    </section>
  );
}
