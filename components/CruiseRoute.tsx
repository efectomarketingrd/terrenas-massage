"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cruise, mapsSearch, routeOrder, stopImg, usefulPlaces, type PlaceKind, type StopId } from "@/lib/cruise";
import type { Locale } from "@/lib/site";

// Mapa esquemático de Las Terrenas (no a escala) con la ruta del recorrido y la capa de información útil.
import { H, P, PATH, W, proj } from "@/lib/cruise-map";

const ICON: Record<PlaceKind, string> = {
  health: "M-3.5,-1.2h2.3v-2.3h2.4v2.3h2.3v2.4h-2.3v2.3h-2.4v-2.3h-2.3z",
  police: "M0,-4 3.6,-2.6v2.2c0,2.4-1.6,4-3.6,4.8-2-.8-3.6-2.4-3.6-4.8v-2.2z",
  pharmacy: "M-3.4,1.4 1.4,-3.4a1.9,1.9 0 0 1 2.7,2.7L-0.7,4.1a1.9,1.9 0 0 1-2.7-2.7z",
};

export default function CruiseRoute({ lang }: { lang: Locale }) {
  const c = cruise[lang];
  const [active, setActive] = useState<StopId>("spa");
  const [info, setInfo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const timers = useRef<number[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  // La ruta se dibuja sola la primera vez que el mapa entra en pantalla
  useEffect(() => {
    const el = mapRef.current;
    if (!el || !("IntersectionObserver" in window)) return setDrawn(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setDrawn(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // #info (botón «Información útil» de la página) abre la capa de información y lleva al mapa
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#info") {
        setInfo(true);
        mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const play = () => {
    timers.current.forEach(clearTimeout);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setInfo(false);
    if (reduce) return setActive("spa");
    setPlaying(false);
    requestAnimationFrame(() => setPlaying(true));
    routeOrder.forEach((id, i) => timers.current.push(window.setTimeout(() => setActive(id), 300 + i * 1100)));
    timers.current.push(window.setTimeout(() => setPlaying(false), 300 + routeOrder.length * 1100 + 400));
  };

  const pick = (id: StopId) => {
    timers.current.forEach(clearTimeout);
    setPlaying(false);
    setActive(id);
  };

  const s = c.stops[active];
  const n = routeOrder.indexOf(active) + 1;

  return (
    <div className="cz-route">
      <div className="cz-route__bar">
        <div className="cz-seg" role="group" aria-label={c.routeTitle}>
          <button type="button" aria-pressed={!info} onClick={() => setInfo(false)}>
            {c.layers.route}
          </button>
          <button type="button" aria-pressed={info} onClick={() => setInfo(true)}>
            {c.layers.info}
          </button>
        </div>
        <button type="button" className="cz-play" onClick={play}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
          {c.play}
        </button>
      </div>

      <div ref={mapRef} className={`cz-map ${drawn ? "is-drawn" : ""} ${playing ? "is-playing" : ""} ${info ? "is-info" : ""}`}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={c.schematic}>
          <defs>
            <linearGradient id="czSea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#219ebc" stopOpacity=".55" />
              <stop offset="1" stopColor="#8fd3e4" stopOpacity=".55" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="#eaf3ea" />
          {/* Colinas */}
          <path d="M0,200 C60,170 110,190 150,175 S250,150 360,185 V260 H0Z" fill="#d6e8d3" />
          <path d="M0,235 C70,210 140,230 200,215 S300,205 360,225 V260 H0Z" fill="#c4dec0" />
          {/* Mar (costa norte) */}
          <path d="M0,0 H360 V36 C330,40 300,42 268,44 S215,46 190,42 S150,50 125,64 S80,86 52,92 S18,96 0,98Z" fill="url(#czSea)" />
          <path d="M0,98 C18,96 30,95 52,92 S100,76 125,64 S165,44 190,42 S240,46 268,44 S330,40 360,36" fill="none" stroke="#f6e7c1" strokeWidth="5" strokeLinecap="round" />
          <text x="24" y="26" className="cz-map__sea">{{ es: "Océano Atlántico", en: "Atlantic Ocean", fr: "Océan Atlantique" }[lang]}</text>
          {/* Palmeras sencillas */}
          {[
            [40, 104], [92, 86], [168, 56], [214, 58], [258, 58], [330, 50],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} className="cz-palm">
              <path d="M0,10 C1,5 1,2 0,-2" stroke="#6b8f5e" strokeWidth="1.3" fill="none" />
              <path d="M0,-2 c-4,-2 -7,0 -8,2 M0,-2 c4,-2 7,0 8,2 M0,-2 c-2,-4 -5,-5 -7,-4 M0,-2 c2,-4 5,-5 7,-4" stroke="#4f8a52" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          ))}
          {/* Hacia el puerto */}
          <text x={W / 2} y={H - 8} textAnchor="middle" className="cz-map__port">
            ↕ {c.fromPort}
          </text>

          {/* Ruta */}
          <path d={PATH} className="cz-map__shadow" pathLength={1} />
          <path d={PATH} className="cz-map__path" pathLength={1} />

          {/* Paradas */}
          {routeOrder.map((id, i) => {
            const [x, y] = P[id];
            const on = id === active;
            return (
              <g
                key={id}
                className={`cz-pin ${on ? "is-on" : ""} ${id === "spa" ? "is-spa" : ""}`}
                transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                onClick={() => pick(id)}
                role="button"
                tabIndex={0}
                aria-label={`${i + 1}. ${c.stops[id].t}`}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(id)}
              >
                <circle r="13" className="cz-pin__halo" />
                <circle r="9" className="cz-pin__dot" />
                <text y="3.4" textAnchor="middle">
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Información útil */}
          {usefulPlaces.map((p) => {
            const [x, y] = proj(p.geo);
            return (
              <g key={p.name} className={`cz-poi cz-poi--${p.kind}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <title>{p.name}</title>
                <rect x="-7" y="-7" width="14" height="14" rx="4" />
                <path d={ICON[p.kind]} />
              </g>
            );
          })}
        </svg>
        <p className="cz-map__note">{c.schematic}</p>
      </div>

      {!info ? (
        <>
          {/* Parada elegida */}
          <article className="cz-stop" key={active} aria-live="polite">
            {active !== "spa" && (
              <div className="cz-stop__img">
                <Image src={stopImg[active]} alt={s.t} width={2048} height={1152} sizes="(max-width: 680px) 92vw, 600px" />
              </div>
            )}
            <div className="cz-stop__body">
              <p className="cz-stop__n">
                <span>{n}</span> {s.time}
              </p>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </article>
          {/* Lista de paradas */}
          <ol className="cz-stops">
            {routeOrder.map((id, i) => (
              <li key={id}>
                <button type="button" className={id === active ? "is-on" : ""} onClick={() => pick(id)} aria-pressed={id === active}>
                  <span>{i + 1}</span> {c.stops[id].t}
                </button>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="cz-info">
          <a className="cz-sos" href="tel:911">
            <b>9-1-1</b> {c.emergency.replace(/:.*/, "")}
          </a>
          <ul>
            {usefulPlaces.map((p) => (
              <li key={p.name} className={`cz-info__i cz-info__i--${p.kind}`}>
                <svg viewBox="-8 -8 16 16" width="26" height="26" aria-hidden="true">
                  <rect x="-7" y="-7" width="14" height="14" rx="4" />
                  <path d={ICON[p.kind]} />
                </svg>
                <span>
                  <b>{p.name}</b>
                  <small>
                    {c.kinds[p.kind]}
                    {p.h24 ? ` · ${c.h24}` : ""}
                  </small>
                </span>
                <a href={mapsSearch(p.q)} target="_blank" rel="noopener noreferrer">
                  {c.directions}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
