"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/content";

// Políticas en una tarjeta que se abre al tocarla (se abre sola si se llega con #politicas).
export default function Policies({ t }: { t: Dict }) {
  const c = t.policies;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#politicas") setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  return (
    <section id="politicas" className="pol">
      <p className="eyebrow">{c.eyebrow}</p>
      <div className={`pol__card ${open ? "is-open" : ""}`}>
        <button type="button" className="pol__head" aria-expanded={open} aria-controls="pol-body" onClick={() => setOpen((v) => !v)}>
          <span className="pol__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" className="ic-line">
              <path d="M7 3h7l5 5v13H7z" />
              <path d="M14 3v5h5M10 13h6M10 17h4" />
            </svg>
          </span>
          <span className="pol__txt">
            <b>{c.title}</b>
            <small>
              {c.hint} · {open ? c.close : c.open}
            </small>
          </span>
          <em className="ab__plus" aria-hidden="true" />
        </button>
        <div id="pol-body" className="pol__body" hidden={!open}>
          <ol>
            {c.items.map((p, i) => (
              <li key={p.t}>
                <span className="pol__n">{i + 1}</span>
                <div>
                  <b>{p.t}</b>
                  <p>{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
