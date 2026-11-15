"use client";

import { useState } from "react";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/site";
import { googleProfile, reviews } from "@/lib/reviews";
import InView from "./InView";
import { Arrow } from "./Icons";

function Stars({ size = 15 }: { size?: number }) {
  return (
    <span className="rv__stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size}>
          <path d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4-3.9 5.5-.8Z" />
        </svg>
      ))}
    </span>
  );
}

// Sección 5 · Opiniones reales de Google en cinta animada (nunca inventar opiniones).
// La cinta se detiene al tocarla o con el botón; con "reducir movimiento" queda quieta y deslizable.
export default function Reviews({ t, lang }: { t: Dict; lang: Locale }) {
  const c = t.reviewsSec;
  const [paused, setPaused] = useState(false);
  const [touching, setTouching] = useState(false);
  const rating = lang === "es" ? String(googleProfile.rating).replace(".", ",") : String(googleProfile.rating);

  return (
    <section id="opiniones" className="sec rv">
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
        </InView>

        <a className="rv__sum" href={googleProfile.url} target="_blank" rel="noopener noreferrer">
          <b>{rating}</b>
          <span>
            <Stars size={17} />
            <small>
              {googleProfile.count} {c.count}
            </small>
          </span>
          <svg className="rv__g" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h6a5.1 5.1 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-7.9Z" />
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.4-.4-2s.1-1.4.4-2V7.1H2A11 11 0 0 0 2 17l3.7-2.9Z" />
            <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2 7.1L5.7 10C6.6 7.4 9.1 5.4 12 5.4Z" />
          </svg>
        </a>

        <div
          className={`rv__marquee ${paused || touching ? "is-paused" : ""}`}
          onTouchStart={() => setTouching(true)}
          onTouchEnd={() => setTimeout(() => setTouching(false), 2500)}
        >
          <div className="rv__belt">
            {[0, 1].map((copy) => (
              <div key={copy} className="rv__lane" aria-hidden={copy === 1}>
                {reviews.map((r) => {
                  const tr = r.lang !== lang ? c.translated[r.lang as keyof typeof c.translated] : "";
                  return (
                    <figure key={r.name} className="rv__card">
                      <Stars />
                      <blockquote>“{r[lang]}”</blockquote>
                      <figcaption>
                        <span className="rv__avatar" aria-hidden="true">
                          {r.name[0]}
                        </span>
                        <span>
                          <b>{r.name}</b>
                          <small>Google{tr ? ` · ${tr}` : ""}</small>
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="rv__pause" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>
          {paused ? `▶ ${c.play}` : `❚❚ ${c.pause}`}
        </button>

        <div className="rv__links">
          <a href={googleProfile.url} target="_blank" rel="noopener noreferrer">
            {c.all} <Arrow size={14} />
          </a>
          <a href={googleProfile.url} target="_blank" rel="noopener noreferrer">
            {c.write} <Arrow size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
