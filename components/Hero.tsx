import Image from "next/image";
import type { Dict } from "@/lib/content";
import { waLink, type Locale } from "@/lib/site";
import { fmtRd, fmtUsd, fromPrice } from "@/lib/prices";
import Header from "./Header";
import Greeting from "./Greeting";
import { Arrow, Clock, ExpIcon, Pin, WaIcon } from "./Icons";

type Props = { t: Dict; lang: Locale };

function Waves({ cls = "" }: { cls?: string }) {
  return (
    <svg className={`waves ${cls}`} viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
      <path className="wave wave--1" d="M-40 70 C 40 50, 120 92, 200 70 S 360 48, 440 70 L 440 120 L -40 120 Z" />
      <path className="wave wave--2" d="M-40 84 C 50 68, 130 104, 210 86 S 370 70, 440 88 L 440 120 L -40 120 Z" />
      <path className="wave wave--3" d="M-40 98 C 60 88, 140 112, 220 100 S 380 90, 440 102 L 440 120 L -40 120 Z" />
    </svg>
  );
}

function Ripples() {
  return (
    <span className="ripples" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Price({ t }: Props) {
  return (
    <p className="price-line">
      {t.hero.from} <b>{fmtRd(fromPrice)}</b> <span>· {fmtUsd(fromPrice)}</span> {t.hero.perPerson}
    </p>
  );
}

/* ── Opción A · Noche completa ─────────────────────────── */
function HeroA({ t, lang }: Props) {
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
          <a className="btn btn--teal" href={`/${lang}#reservar`}>
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
            <Price t={t} lang={lang} />
          </li>
        </ul>
      </div>
      <a className="hA__scroll" href="#masajes" aria-label={t.hero.scroll}>
        <span />
      </a>
      <Waves />
    </section>
  );
}

/* ── Opción B · App clara + tarjeta noche ──────────────── */
function HeroB({ t, lang }: Props) {
  return (
    <section className="hB">
      <Header t={t} lang={lang} tone="light" />
      <div className="hB__body">
        <div className="rise">
          <Greeting g={t.greet} />
          <h1 className="hB__title">{t.hero.titleAlt}</h1>
          <p className="hB__open">
            <Clock /> {t.hero.open}
          </p>
        </div>
        <div className="hB__card rise rise--2">
          <Ripples />
          <p className="eyebrow">{t.hero.cardKicker}</p>
          <p className="hB__cardTitle">{t.hero.cardTitle}</p>
          <Price t={t} lang={lang} />
          <div className="btns">
            <a className="btn btn--teal" href={`/${lang}#reservar`}>
              {t.hero.book} <Arrow />
            </a>
            <a className="btn btn--ghost btn--icon" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WaIcon size={20} />
            </a>
          </div>
          <Waves cls="waves--card" />
        </div>
        <ul className="hB__exp rise rise--3">
          {t.exp.map((e) => (
            <li key={e.k}>
              <a href={`/${lang}#${e.k}`}>
                <ExpIcon k={e.k} />
                <b>{e.t}</b>
                <span>{e.d}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Opción C · Piedras y agua + hoja inferior ─────────── */
function HeroC({ t, lang }: Props) {
  return (
    <section className="hC">
      <Header t={t} lang={lang} tone="dark" logo={false} />
      <div className="hC__art" aria-hidden="true">
        <svg viewBox="0 0 300 220" className="stones">
          <defs>
            <radialGradient id="st" cx="40%" cy="30%" r="80%">
              <stop offset="0" stopColor="#3a4a78" />
              <stop offset="0.6" stopColor="#141c4a" />
              <stop offset="1" stopColor="#0a1038" />
            </radialGradient>
            <linearGradient id="rim" x1="0" x2="1">
              <stop offset="0" stopColor="#219ebc" stopOpacity="0" />
              <stop offset="0.5" stopColor="#219ebc" stopOpacity="0.9" />
              <stop offset="1" stopColor="#219ebc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="rings">
            <ellipse cx="150" cy="182" rx="40" ry="8" />
            <ellipse cx="150" cy="182" rx="40" ry="8" />
            <ellipse cx="150" cy="182" rx="40" ry="8" />
          </g>
          <g className="stack">
            <ellipse cx="150" cy="166" rx="62" ry="18" fill="url(#st)" />
            <path d="M92 160 Q150 150 208 160" stroke="url(#rim)" strokeWidth="1.2" fill="none" />
            <ellipse cx="150" cy="134" rx="48" ry="15" fill="url(#st)" />
            <path d="M106 129 Q150 120 194 129" stroke="url(#rim)" strokeWidth="1.1" fill="none" />
            <ellipse cx="150" cy="107" rx="35" ry="12" fill="url(#st)" />
            <path d="M119 103 Q150 95 181 103" stroke="url(#rim)" strokeWidth="1" fill="none" />
            <ellipse cx="150" cy="85" rx="23" ry="9" fill="url(#st)" />
            <path d="M131 82 Q150 76 169 82" stroke="url(#rim)" strokeWidth="0.9" fill="none" />
          </g>
          <g className="steam">
            <path d="M140 66 C 132 54, 148 46, 140 32" />
            <path d="M158 62 C 150 50, 166 42, 158 26" />
          </g>
        </svg>
        <Image className="hC__logo" src="/brand/terrenas-massage-blanco.png" alt="" width={824} height={180} priority sizes="240px" />
      </div>
      <div className="hC__sheet rise rise--2">
        <p className="eyebrow eyebrow--dark">{t.hero.eyebrow}</p>
        <h1 className="hC__title">{t.hero.title}</h1>
        <p className="hC__text">{t.hero.text}</p>
        <div className="btns btns--stack">
          <a className="btn btn--night" href={`/${lang}#reservar`}>
            {t.hero.book} <Arrow />
          </a>
          <a className="btn btn--line" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer">
            <WaIcon /> {t.hero.wa}
          </a>
        </div>
        <ul className="meta meta--dark">
          <li>
            <Clock /> {t.hero.open}
          </li>
          <li>
            <Pin /> {t.hero.place}
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function Hero({ variant, ...p }: Props & { variant: "a" | "b" | "c" }) {
  if (variant === "b") return <HeroB {...p} />;
  if (variant === "c") return <HeroC {...p} />;
  return <HeroA {...p} />;
}
