"use client";

import { useState } from "react";
import { cruise, cruisePrice, cruiseTotal } from "@/lib/cruise";
import { waLink, type Locale } from "@/lib/site";
import { WaIcon } from "./Icons";

// Formulario de reserva para cruceristas → WhatsApp. El mensaje llega SIEMPRE en español (la recepción no habla francés).
const ES_MASSAGE = { relajante: "Relajante", profundo: "Profundo", descontracturante: "Descontracturante" } as const;
type M = keyof typeof ES_MASSAGE;

export default function CruiseBook({ lang }: { lang: Locale }) {
  const c = cruise[lang];
  const f = c.form;
  const [pkg, setPkg] = useState<"person" | "couple">("person");
  const [people, setPeople] = useState(2);
  const [massage, setMassage] = useState<M>("relajante");
  const [min, setMin] = useState<60 | 90>(60);
  const [ship, setShip] = useState("");
  const [date, setDate] = useState("");
  const [arrive, setArrive] = useState("");
  const [aboard, setAboard] = useState("");
  const [name, setName] = useState("");
  const [tried, setTried] = useState(false);

  const n = pkg === "couple" ? 2 : people;
  const total = cruiseTotal(pkg, n, massage, min);
  const deposit = Math.round(total * cruisePrice.deposit);
  const ok = name.trim().length > 1 && ship.trim().length > 1 && !!date;

  const msg = () =>
    [
      "Hola, quiero reservar la experiencia para cruceristas (masaje + recorrido por Las Terrenas).",
      lang === "en" ? "🇬🇧 Cliente de habla inglesa" : lang === "fr" ? "🇫🇷 Cliente de habla francesa" : null,
      "",
      `Experiencia: ${pkg === "couple" ? "Ritual Connection para dos" : "Relax & Explore"}`,
      `Personas: ${n}`,
      `Masaje: ${ES_MASSAGE[massage]} ${min} min`,
      `Barco: ${ship.trim()}`,
      `Fecha: ${date}`,
      arrive || aboard ? `Llegada del barco: ${arrive || "?"} · Límite de embarque: ${aboard || "?"}` : null,
      `Nombre: ${name.trim()}`,
      "",
      `Total estimado: US$${total} (anticipo 50 %: US$${deposit})`,
    ]
      .filter((l) => l !== null)
      .join("\n");

  const field = (bad: boolean) => `bk-field ${tried && bad ? "is-err" : ""}`;

  return (
    <form className="cz-form" onSubmit={(e) => e.preventDefault()}>
      <div className="cz-seg cz-seg--light" role="group" aria-label={f.pkg}>
        {(["person", "couple"] as const).map((k) => (
          <button key={k} type="button" aria-pressed={pkg === k} onClick={() => setPkg(k)}>
            {f.pkgs[k]}
          </button>
        ))}
      </div>

      <div className="cz-form__grid">
        {pkg === "person" && (
          <label className="bk-field">
            <span className="ms__label">{f.people}</span>
            <select className="bk-input" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
              {Array.from({ length: cruisePrice.max - cruisePrice.min + 1 }, (_, i) => i + cruisePrice.min).map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="bk-field">
          <span className="ms__label">{f.massage}</span>
          <select className="bk-input" value={massage} onChange={(e) => setMassage(e.target.value as M)}>
            {(Object.keys(ES_MASSAGE) as M[]).map((k) => (
              <option key={k} value={k}>
                {f.massages[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="bk-field">
          <span className="ms__label">{f.length}</span>
          <select className="bk-input" value={min} onChange={(e) => setMin(Number(e.target.value) as 60 | 90)}>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
          </select>
        </label>
        <label className={field(ship.trim().length < 2)}>
          <span className="ms__label">{f.ship} *</span>
          <input className="bk-input" value={ship} placeholder={f.shipPh} onChange={(e) => setShip(e.target.value)} />
        </label>
        <label className={field(!date)}>
          <span className="ms__label">{f.date} *</span>
          <input className="bk-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="bk-field">
          <span className="ms__label">{f.arrive}</span>
          <input className="bk-input" type="time" value={arrive} onChange={(e) => setArrive(e.target.value)} />
        </label>
        <label className="bk-field">
          <span className="ms__label">{f.aboard}</span>
          <input className="bk-input" type="time" value={aboard} onChange={(e) => setAboard(e.target.value)} />
        </label>
        <label className={`${field(name.trim().length < 2)} cz-form__wide`}>
          <span className="ms__label">{f.name} *</span>
          <input className="bk-input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div className="cz-total">
        <span>
          <small>{f.total}</small>
          <b>US${total}</b>
        </span>
        <span>
          <small>{f.deposit}</small>
          <b>US${deposit}</b>
        </span>
      </div>
      {tried && !ok && <p className="bk-err">{f.err}</p>}
      <a
        className="btn btn--teal cz-send"
        href={ok ? waLink(msg()) : "#"}
        target={ok ? "_blank" : undefined}
        rel="noopener noreferrer"
        data-track={ok ? "booking_whatsapp" : undefined}
        onClick={(e) => {
          if (!ok) {
            e.preventDefault();
            setTried(true);
          }
        }}
      >
        <WaIcon /> {f.send}
      </a>
    </form>
  );
}
