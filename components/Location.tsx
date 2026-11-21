import type { Dict } from "@/lib/content";
import { mapsUrl, site, waLink, type Locale } from "@/lib/site";
import InView from "./InView";
import { Arrow, Clock, Pin, WaIcon } from "./Icons";

// Mapa ilustrado (no a escala): mar, bulevar, parque del letrero, supermercados y el edificio con el spa en el 2.º nivel.
function MapArt() {
  return (
    <svg className="lc-map__art" viewBox="0 0 360 220" aria-hidden="true">
      <defs>
        <linearGradient id="lcSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3e4" />
          <stop offset="1" stopColor="#c9ebf3" />
        </linearGradient>
      </defs>
      <rect width="360" height="220" fill="#eef2fa" />
      <path d="M0 0h360v44c-40 10-70 2-110 8s-70 18-120 10S30 48 0 56z" fill="url(#lcSea)" />
      <path className="lc-wave" d="M20 26c20-6 40 6 60 0s40-6 60 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className="lc-wave lc-wave--2" d="M200 20c20-6 40 6 60 0s40-6 60 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Calles */}
      <g className="lc-roads" stroke="#fff" strokeLinecap="round" fill="none">
        <path pathLength={1} d="M-10 120 C 80 112, 160 128, 370 116" strokeWidth="14" />
        <path pathLength={1} d="M150 230 C 152 180, 170 140, 176 64" strokeWidth="10" />
        <path pathLength={1} d="M250 230 C 248 190, 262 150, 300 118" strokeWidth="8" />
      </g>
      {/* Parque con el letrero de bienvenida */}
      <g className="lc-poi" style={{ "--p": 0 } as React.CSSProperties}>
        <rect x="196" y="134" width="56" height="38" rx="8" fill="#cfe6dd" />
        <circle cx="208" cy="148" r="7" fill="#a6d1c1" />
        <circle cx="240" cy="160" r="8" fill="#a6d1c1" />
        <rect x="216" y="144" width="18" height="9" rx="2" fill="#fff" stroke="#219ebc" strokeWidth="1.4" />
      </g>
      {/* Supermercados */}
      <g className="lc-poi" style={{ "--p": 1 } as React.CSSProperties}>
        <rect x="64" y="72" width="40" height="28" rx="6" fill="#dfe6f3" />
        <path d="M74 82h20l-3 9H77z" fill="none" stroke="#219ebc" strokeWidth="1.6" strokeLinejoin="round" />
      </g>
      <g className="lc-poi" style={{ "--p": 2 } as React.CSSProperties}>
        <rect x="276" y="60" width="40" height="28" rx="6" fill="#dfe6f3" />
        <path d="M286 70h20l-3 9h-14z" fill="none" stroke="#219ebc" strokeWidth="1.6" strokeLinejoin="round" />
      </g>
      {/* Edificio de dos niveles con el spa arriba */}
      <g className="lc-poi" style={{ "--p": 3 } as React.CSSProperties}>
        <rect x="108" y="140" width="36" height="34" rx="3" fill="#fff" stroke="#c8d2e6" />
        <rect x="108" y="140" width="36" height="16" rx="3" fill="#219ebc" opacity="0.9" />
        <text x="126" y="152" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">2</text>
      </g>
      {/* Pin */}
      <g className="lc-pin">
        <ellipse className="lc-pin__ring" cx="126" cy="178" rx="16" ry="6" fill="none" stroke="#219ebc" strokeWidth="2" />
        <ellipse className="lc-pin__ring lc-pin__ring--2" cx="126" cy="178" rx="16" ry="6" fill="none" stroke="#219ebc" strokeWidth="2" />
        <g className="lc-pin__drop">
          <path d="M126 136c-12-16-20-26-20-36a20 20 0 1 1 40 0c0 10-8 20-20 36z" fill="#050a30" />
          <circle cx="126" cy="100" r="8" fill="#8fd3e4" />
        </g>
      </g>
    </svg>
  );
}

function RefIcon({ k }: { k: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {k === "park" && (
        <>
          <circle cx="8" cy="9" r="4" />
          <circle cx="16" cy="8" r="3.4" />
          <path d="M8 13v7M16 11.4V20M4 20h16" />
        </>
      )}
      {k === "shop" && (
        <>
          <path d="M3 5h2.4l2.2 10h10.2L20 8H6.4" />
          <circle cx="9" cy="19" r="1.4" />
          <circle cx="17" cy="19" r="1.4" />
        </>
      )}
      {k === "car" && (
        <>
          <path d="M4 15.5V12l2-5h12l2 5v3.5" />
          <path d="M3 15.5h18v2.5H3z" />
          <circle cx="7.5" cy="18" r="1.6" />
          <circle cx="16.5" cy="18" r="1.6" />
        </>
      )}
    </svg>
  );
}

// Sección · Cómo llegar
export default function Location({ t }: { t: Dict; lang: Locale }) {
  const c = t.location;
  return (
    <section id="ubicacion" className="sec lc">
      <div className="wrap">
        <InView className="sec__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="sec__title">{c.title}</h2>
          <p className="sec__lead">{c.lead}</p>
        </InView>

        <InView className="lc-mapbox">
        <a className="lc-map" href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapArt />
          <span className="lc-map__card">
            <strong>{c.mapTitle}</strong>
            <span>
              {site.address.street}, {site.address.locality}
            </span>
            <span className="btn btn--night lc-map__btn">
              {c.mapBtn} <Arrow size={14} />
            </span>
          </span>
        </a>
        </InView>

        <ul className="lc-chips">
          <li>
            <Pin /> {c.chips[0]}
          </li>
          <li>
            <RefIcon k="car" /> {c.chips[1]}
          </li>
          <li>
            <Clock /> {c.chips[2]}
          </li>
        </ul>

        <InView className="lc-refs">
          <h3 className="lc-h3">{c.refsTitle}</h3>
          <ul>
            {c.refs.map((r, i) => (
              <li key={r.k} style={{ "--i": i } as React.CSSProperties}>
                <span className="lc-refs__ico">
                  <RefIcon k={r.k} />
                </span>
                <span>
                  <b>{r.t}</b>
                  <span>{r.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </InView>

        <InView className="lc-arrive">
          <h3 className="lc-h3">{c.arriveTitle}</h3>
          <ol>
            {c.arrive.map((s, i) => (
              <li key={s.t} style={{ "--i": i } as React.CSSProperties}>
                <span className="lc-arrive__n">{i + 1}</span>
                <span>
                  <b>{s.t}</b>
                  <span>{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </InView>

        <a className="btn btn--line lc-help" href={waLink(c.waMsg)} target="_blank" rel="noopener noreferrer">
          <WaIcon /> {c.help}
        </a>
      </div>
    </section>
  );
}
