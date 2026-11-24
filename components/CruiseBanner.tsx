"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cruise, cruisePrice, routeOrder, stopImg } from "@/lib/cruise";
import { slugs } from "@/lib/i18n";
import type { Locale } from "@/lib/site";
import { Arrow } from "./Icons";

// Tarjeta interactiva del inicio: experiencia para cruceristas (lleva a la página completa).
// La ruta de 6 paradas se recorre sola cada 2,4 s; con «reducir movimiento» queda fija.
const imgs = ["popy", "bonita", "ballenas", "pescadores", "popy", "mirador"] as const;

export default function CruiseBanner({ lang }: { lang: Locale }) {
  const c = cruise[lang];
  const k = c.card;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % routeOrder.length), 2400);
    return () => clearInterval(id);
  }, [paused]);

  const id = routeOrder[i];
  return (
    <section className="sec czc-sec" aria-label={k.title}>
      <div className="wrap">
        <a
          className="czc"
          href={`/${lang}/${slugs.cruise[lang]}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="czc__img">
            {imgs.map((im, n) => (
              <Image key={n} src={stopImg[im]} alt="" width={2048} height={1152} sizes="(max-width: 680px) 92vw, 600px" className={n === i ? "is-on" : ""} />
            ))}
            <span className="czc__tag">{k.eyebrow}</span>
            <span className="czc__stop">
              <b>{i + 1}</b> {c.stops[id].t}
            </span>
          </div>
          <div className="czc__body">
            <h2>{k.title}</h2>
            <p>{k.text}</p>
            <ol className="czc__route" aria-hidden="true">
              {routeOrder.map((r, n) => (
                <li key={r} className={n === i ? "is-on" : n < i ? "is-past" : ""}>
                  <span>{n + 1}</span>
                </li>
              ))}
            </ol>
            <ul className="czc__facts">
              {k.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="czc__foot">
              <span>
                {c.from} <b>US${cruisePrice.person}</b> {c.perPerson}
              </span>
              <em>
                {c.banner.cta} <Arrow size={14} />
              </em>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
