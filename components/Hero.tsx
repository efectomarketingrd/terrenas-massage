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
      {/* El logo se pinta sin animación (es el elemento principal que mide Google); el resto entra suave */}
      <div className="hA__body">
        <h1 className="eyebrow rise">{t.hero.eyebrow}</h1>
        <Image className="hA__logo" src="/brand/terrenas-massage-blanco.png" alt="Terrenas Massage · Relax your body" width={824} height={180} priority fetchPriority="high" sizes="(max-width: 480px) 82vw, 380px" />
        <p className="hA__title rise rise--2">{t.hero.title}</p>
        <p className="hA__text rise rise--2">{t.hero.text}</p>
        <div className="btns rise rise--3">
          <a className="btn btn--teal" href={bookPath(lang)}>
            {t.hero.book} <Arrow />
          </a>
          <a className="btn btn--ghost" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer">
            <WaIcon /> {t.hero.wa}
          </a>
        </div>
        <ul className="meta rise rise--3">
          <li>
            <Clock /> {t.hero.open}
          </li>
          <li>
            <p className="price-line">
              {t.hero.from} <b>{fmtRd(fromPrice)}</b> <span>· {fmtUsd(fromPrice)}</span> {t.hero.perPerson}
            </p>
          </li>
        </ul>
        <p className="hA__for rise rise--3">{t.hero.forWho}</p>
      </div>
      <a className="hA__scroll" href="#masajes" aria-label={t.hero.scroll}>
        <span />
      </a>
      <Waves edge />
    </section>
  );
}
