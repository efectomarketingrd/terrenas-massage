"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Dict } from "@/lib/content";
import { site, waLink, type Locale } from "@/lib/site";
import { bookableDays, fmtTime, timesFor, ymd, nowDR } from "@/lib/agenda";
import { fmtRd, fmtUsd, quote, type BookType, type Level, type Minutes, type Pressure, type Sel } from "@/lib/prices";
import { ExpIcon, WaIcon } from "./Icons";

const TYPES: BookType[] = ["individual", "pareja", "domicilio", "grupo"];
const PRESS: Pressure[] = ["relajante", "profundo", "descontracturante"];
type Occasion = "none" | "valentin" | "cumple" | "aniversario" | "otra";
type Zone = "terrenas" | "limon" | "samana";

function Chips<T extends string | number>({ value, opts, onChange, label }: { value: T; opts: { v: T; l: string; d?: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="bk-chips" role="radiogroup" aria-label={label}>
      {opts.map((o) => (
        <button key={String(o.v)} type="button" role="radio" aria-checked={o.v === value} className={o.v === value ? "is-on" : ""} onClick={() => onChange(o.v)}>
          <b>{o.l}</b>
          {o.d && <span>{o.d}</span>}
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bk-field">
      <p className="ms__label">{label}</p>
      {children}
    </div>
  );
}

export default function BookingWizard({ t, lang }: { t: Dict; lang: Locale }) {
  const b = t.booking;
  const m = t.massages;
  const q = useSearchParams();
  const top = useRef<HTMLDivElement>(null);

  // Preselección desde los botones de la web: ?tipo=individual&masaje=profundo&nivel=premium&min=90
  const pre = <T extends string>(k: string, ok: readonly T[], d: T): T => {
    const v = q.get(k) as T | null;
    return v && ok.includes(v) ? v : d;
  };

  const [step, setStep] = useState(1);
  const [type, setType] = useState<BookType>(pre("tipo", TYPES, "individual"));
  const [massage, setMassage] = useState<Pressure>(pre("masaje", PRESS, "relajante"));
  const [level, setLevel] = useState<Level>(pre("nivel", ["basico", "premium"] as const, "basico"));
  const [min, setMin] = useState<Minutes>(q.get("min") === "90" ? 90 : 60);
  const [ritual, setRitual] = useState<"basic" | "premium">(pre("ritual", ["basic", "premium"] as const, "basic"));
  const [occasion, setOccasion] = useState<Occasion>("none");
  const [people, setPeople] = useState(1);
  const [place, setPlace] = useState<"spa" | "domicilio">("spa");
  const [zone, setZone] = useState<Zone>("terrenas");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [daysShown, setDaysShown] = useState(12);
  const [days, setDays] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [accept, setAccept] = useState(false);
  const [tried, setTried] = useState(false);

  // Las fechas dependen de la hora actual: se calculan en el navegador.
  useEffect(() => setDays(bookableDays()), []);

  // Reglas por tipo de servicio
  useEffect(() => {
    if (type === "pareja" && massage === "descontracturante") setMassage("relajante");
    if (type === "pareja" && ritual === "premium") setMin(60);
    if (type === "domicilio") setPeople((p) => Math.min(Math.max(p, 1), 6));
    if (type === "grupo") setPeople((p) => Math.max(p, 3));
    if (type !== "grupo" && zone === "samana") setZone("terrenas");
  }, [type, ritual, massage, zone]);

  const atHome = type === "domicilio" || (type === "grupo" && place === "domicilio");
  const sel: Sel = { type, massage, level, min, ritual, people, place };
  const price = quote(sel);
  const times = date ? timesFor(date) : [];

  const go = (n: number) => {
    setTried(false);
    setStep(n);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const valid2 = !!date && !!time && times.includes(time);
  const valid3 = form.name.trim().length > 1 && form.phone.replace(/\D/g, "").length >= 7 && (!atHome || form.address.trim().length > 3) && accept;

  // Etiquetas
  const dayLabel = (d: string, long = false) => {
    const [y, mo, da] = d.split("-").map(Number);
    const dt = new Date(Date.UTC(y, mo - 1, da, 12));
    const today = ymd(nowDR());
    const tomorrow = ymd(new Date(nowDR().getTime() + 86400000));
    const loc = lang === "es" ? "es-DO" : "en-US";
    const wd = dt.toLocaleDateString(loc, { weekday: long ? "long" : "short", timeZone: "UTC" });
    const md = dt.toLocaleDateString(loc, { day: "numeric", month: long ? "long" : "short", timeZone: "UTC" });
    const rel = d === today ? b.today : d === tomorrow ? b.tomorrow : "";
    return { wd: rel || wd, md, full: `${rel ? rel + ", " : ""}${wd} ${md}` };
  };

  const serviceText = useMemo(() => {
    const parts: string[] = [b.types[type].t];
    if (type === "pareja") {
      parts.push(`Ritual Connection ${b.ritualOpts[ritual].t}`);
      if (ritual === "basic") parts.push(m.names[massage]);
    } else {
      parts.push(m.names[massage]);
      if (type === "individual" || (type === "grupo" && place === "spa")) parts.push(m.levels[level]);
    }
    parts.push(`${type === "pareja" && ritual === "premium" ? 60 : min} min`);
    return parts.join(" · ");
  }, [b, m, type, ritual, massage, place, level, min]);

  const priceText = () => {
    const base = `${fmtRd(price.total)} (${fmtUsd(price.total)})`;
    if (type === "pareja") return `${base} ${b.forTwo}`;
    if (price.total !== price.unit) return `${base} · ${people} × ${fmtRd(price.unit)}${price.estimate ? ` · ${b.estimate}` : ""}`;
    return base;
  };

  const message = () => {
    const L = [
      b.msgTitle,
      "",
      `${b.service}: ${serviceText}`,
      type === "grupo" || type === "domicilio" ? `${b.people}: ${people}` : "",
      type === "grupo" ? `${b.place} ${b.places[place]}` : "",
      atHome ? `${b.zone}: ${b.zones[zone]}` : "",
      type === "pareja" && occasion !== "none" ? `${b.occasion.split("(")[0].trim()} ${b.occasions[occasion]}` : "",
      `${b.total}: ${priceText()}`,
      `${b.when}: ${date ? dayLabel(date, true).full : ""}, ${time ? fmtTime(time, lang) : ""}`,
      "",
      `${b.name}: ${form.name}`,
      `${b.phone}: ${form.phone}`,
      form.email ? `${b.email.replace(/ \(.*\)/, "")}: ${form.email}` : "",
      atHome ? `${b.address}: ${form.address}` : "",
      form.notes ? `${b.notes.replace(/ \(.*\)/, "")}: ${form.notes}` : "",
    ];
    return L.filter((l, i) => l !== "" || L[i - 1] !== "").join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };

  const mailHref = () => `mailto:${site.email}?subject=${encodeURIComponent(`${b.msgTitle} · ${form.name}`)}&body=${encodeURIComponent(message())}`;

  const next = (ok: boolean, n: number) => (ok ? go(n) : setTried(true));

  return (
    <div className="bk" ref={top}>
      {/* Progreso */}
      <ol className="bk-steps" aria-label={b.stepOf.replace("{n}", String(step))}>
        {b.steps.map((s, i) => (
          <li key={s} className={i + 1 === step ? "is-on" : i + 1 < step ? "is-done" : ""} aria-current={i + 1 === step ? "step" : undefined}>
            <span>{i + 1}</span>
            <b>{s}</b>
          </li>
        ))}
      </ol>

      {/* ── Paso 1 · Servicio ── */}
      {step === 1 && (
        <div className="bk-panel" key="s1">
          <Field label={b.type}>
            <div className="bk-types" role="radiogroup" aria-label={b.type}>
              {TYPES.map((k) => (
                <button key={k} type="button" role="radio" aria-checked={type === k} className={type === k ? "is-on" : ""} onClick={() => setType(k)}>
                  <ExpIcon k={k} size={26} />
                  <b>{b.types[k].t}</b>
                  <span>{b.types[k].d}</span>
                </button>
              ))}
            </div>
          </Field>

          {type === "pareja" && (
            <Field label={b.ritual}>
              <Chips label={b.ritual} value={ritual} onChange={setRitual} opts={(["basic", "premium"] as const).map((v) => ({ v, l: b.ritualOpts[v].t, d: b.ritualOpts[v].d }))} />
            </Field>
          )}

          {!(type === "pareja" && ritual === "premium") && (
            <Field label={b.massage}>
              <Chips
                label={b.massage}
                value={massage}
                onChange={setMassage}
                opts={PRESS.filter((p) => type !== "pareja" || p !== "descontracturante").map((v) => ({ v, l: m.names[v], d: m.press[v] }))}
              />
            </Field>
          )}

          {type === "grupo" && (
            <Field label={b.place}>
              <Chips label={b.place} value={place} onChange={setPlace} opts={(["spa", "domicilio"] as const).map((v) => ({ v, l: b.places[v] }))} />
            </Field>
          )}

          <div className="bk-row">
            {(type === "individual" || (type === "grupo" && place === "spa")) && (
              <Field label={b.level}>
                <Chips label={b.level} value={level} onChange={setLevel} opts={(["basico", "premium"] as const).map((v) => ({ v, l: m.levels[v] }))} />
              </Field>
            )}
            {!(type === "pareja" && ritual === "premium") && (
              <Field label={b.minutes}>
                <Chips label={b.minutes} value={min} onChange={setMin} opts={([60, 90] as const).map((v) => ({ v, l: `${v} min` }))} />
              </Field>
            )}
          </div>

          {(type === "domicilio" || type === "grupo") && (
            <Field label={b.people}>
              <div className="bk-count">
                <button type="button" aria-label="−" onClick={() => setPeople((p) => Math.max(type === "grupo" ? 3 : 1, p - 1))}>
                  −
                </button>
                <output aria-live="polite">{people}</output>
                <button type="button" aria-label="+" onClick={() => setPeople((p) => Math.min(type === "grupo" ? 40 : 6, p + 1))}>
                  +
                </button>
              </div>
            </Field>
          )}

          {atHome && (
            <Field label={b.zone}>
              <Chips label={b.zone} value={zone} onChange={setZone} opts={(type === "grupo" ? (["terrenas", "limon", "samana"] as const) : (["terrenas", "limon"] as const)).map((v) => ({ v, l: b.zones[v] }))} />
            </Field>
          )}

          {type === "pareja" && (
            <Field label={b.occasion}>
              <select className="bk-input" value={occasion} onChange={(e) => setOccasion(e.target.value as Occasion)}>
                {(Object.keys(b.occasions) as Occasion[]).map((k) => (
                  <option key={k} value={k}>
                    {b.occasions[k]}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {type === "pareja" && ritual === "premium" && <p className="bk-note">{b.premium60}</p>}
          {(type === "individual" || (type === "grupo" && place === "spa")) && level === "premium" && <p className="bk-note">{b.premiumNote}</p>}
          {type === "domicilio" && <p className="bk-note">{b.homeNote}</p>}
          {type === "grupo" && <p className="bk-note">{b.groupNote}</p>}

          <div className="bk-bar">
            <div className="bk-price" aria-live="polite">
              <small>{price.estimate ? b.estimate : b.total}</small>
              <b>{fmtRd(price.total)}</b>
              <span>
                {fmtUsd(price.total)}
                {type === "pareja" ? ` · ${b.forTwo}` : price.total !== price.unit ? ` · ${people} × ${fmtRd(price.unit)}` : ` · ${b.perPerson}`}
              </span>
            </div>
            <button type="button" className="btn btn--teal" onClick={() => go(2)}>
              {b.next}
            </button>
          </div>
        </div>
      )}

      {/* ── Paso 2 · Fecha y hora ── */}
      {step === 2 && (
        <div className="bk-panel" key="s2">
          <Field label={b.date}>
            <div className="bk-days">
              {days.slice(0, daysShown).map((d) => {
                const l = dayLabel(d);
                return (
                  <button key={d} type="button" aria-pressed={date === d} className={date === d ? "is-on" : ""} onClick={() => { setDate(d); setTime(""); }}>
                    <span>{l.wd}</span>
                    <b>{l.md}</b>
                  </button>
                );
              })}
            </div>
            {daysShown < days.length && (
              <button type="button" className="bk-more" onClick={() => setDaysShown((n) => n + 12)}>
                {lang === "es" ? "Ver más días" : "More days"}
              </button>
            )}
          </Field>

          {date && (
            <Field label={b.time}>
              {times.length ? (
                <div className="bk-times">
                  {times.map((tm) => (
                    <button key={tm} type="button" aria-pressed={time === tm} className={time === tm ? "is-on" : ""} onClick={() => setTime(tm)}>
                      {fmtTime(tm, lang)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="bk-note">{b.noTimes}</p>
              )}
            </Field>
          )}
          <p className="bk-note">{b.timeNote}</p>
          {tried && !valid2 && <p className="bk-err">{b.required}</p>}

          <div className="bk-nav">
            <button type="button" className="btn btn--line" onClick={() => go(1)}>
              {b.back}
            </button>
            <button type="button" className="btn btn--teal" onClick={() => next(valid2, 3)}>
              {b.next}
            </button>
          </div>
        </div>
      )}

      {/* ── Paso 3 · Datos ── */}
      {step === 3 && (
        <div className="bk-panel" key="s3">
          {(
            [
              ["name", b.name, "text", "name", true],
              ["phone", b.phone, "tel", "tel", true],
              ["email", b.email, "email", "email", false],
            ] as const
          ).map(([k, label, type_, ac, req]) => (
            <label key={k} className={`bk-field ${tried && req && !form[k].trim() ? "is-err" : ""}`}>
              <span className="ms__label">
                {label}
                {req && " *"}
              </span>
              <input className="bk-input" type={type_} autoComplete={ac} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </label>
          ))}
          {atHome && (
            <label className={`bk-field ${tried && form.address.trim().length < 4 ? "is-err" : ""}`}>
              <span className="ms__label">{b.address} *</span>
              <input className="bk-input" type="text" autoComplete="street-address" placeholder={b.addressPh} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </label>
          )}
          <label className="bk-field">
            <span className="ms__label">{b.notes}</span>
            <textarea className="bk-input" rows={3} placeholder={b.notesPh} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>

          <details className="bk-policies">
            <summary>{b.seePolicies}</summary>
            <ul>
              {t.policies.items.map((p) => (
                <li key={p.t}>
                  <b>{p.t}.</b> {p.d}
                </li>
              ))}
            </ul>
          </details>
          <label className={`bk-check ${tried && !accept ? "is-err" : ""}`}>
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
            <span>{b.accept}</span>
          </label>
          {tried && !valid3 && <p className="bk-err">{b.required}</p>}

          <div className="bk-nav">
            <button type="button" className="btn btn--line" onClick={() => go(2)}>
              {b.back}
            </button>
            <button type="button" className="btn btn--teal" onClick={() => next(valid3, 4)}>
              {b.next}
            </button>
          </div>
        </div>
      )}

      {/* ── Paso 4 · Resumen ── */}
      {step === 4 && (
        <div className="bk-panel" key="s4">
          <h2 className="bk-h">{b.summary}</h2>
          <dl className="bk-sum">
            <div>
              <dt>
                {b.service}
                <button type="button" onClick={() => go(1)}>{b.edit}</button>
              </dt>
              <dd>
                {serviceText}
                {(type === "grupo" || type === "domicilio") && ` · ${people} ${b.people.toLowerCase()}`}
                {atHome && ` · ${b.zones[zone]}`}
                {type === "pareja" && occasion !== "none" && ` · ${b.occasions[occasion]}`}
              </dd>
            </div>
            <div>
              <dt>
                {b.when}
                <button type="button" onClick={() => go(2)}>{b.edit}</button>
              </dt>
              <dd>
                {dayLabel(date, true).full} · {fmtTime(time, lang)}
              </dd>
            </div>
            <div>
              <dt>
                {b.who}
                <button type="button" onClick={() => go(3)}>{b.edit}</button>
              </dt>
              <dd>
                {form.name} · {form.phone}
                {form.email && ` · ${form.email}`}
                {atHome && <><br />{form.address}</>}
              </dd>
            </div>
          </dl>
          <div className="bk-total">
            <small>{price.estimate ? b.estimate : b.total}</small>
            <b>{fmtRd(price.total)}</b>
            <span>
              {fmtUsd(price.total)}
              {type === "pareja" ? ` · ${b.forTwo}` : price.total !== price.unit ? ` · ${people} × ${fmtRd(price.unit)}` : ""}
            </span>
          </div>
          <p className="bk-note">{b.pay}</p>
          <div className="bk-send">
            <a className="btn btn--teal" href={waLink(message())} target="_blank" rel="noopener noreferrer">
              <WaIcon /> {b.sendWa}
            </a>
            <a className="btn btn--line" href={mailHref()}>
              {b.sendMail}
            </a>
          </div>
          <p className="bk-note bk-note--c">{b.sentNote}</p>
          <button type="button" className="bk-more" onClick={() => go(3)}>
            {b.back}
          </button>
        </div>
      )}
    </div>
  );
}
