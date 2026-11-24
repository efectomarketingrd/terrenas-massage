"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dict } from "@/lib/content";
import { site, waLink, type Locale } from "@/lib/site";
import { reservaUrl } from "@/lib/reserva";
import { getOrigin } from "@/lib/track";
import { intlLocale } from "@/lib/i18n";
import { serviceLabel, type ServiceSel } from "@/lib/service";
import { agenda, bookableDays, fmtTime, minutesUntil, timesFor, ymd, nowDR } from "@/lib/agenda";
import { fmtRd, fmtUsd, quote, type BookType, type Level, type Minutes, type Pressure, type Sel, type Turn, type GroupPerson, buildTurns } from "@/lib/prices";
import { Clock, ExpIcon, PayIcon, WaIcon } from "./Icons";
import { Ripples } from "./Water";

const TYPES: BookType[] = ["individual", "pareja", "domicilio", "grupo"];
const PRESS: Pressure[] = ["relajante", "profundo", "descontracturante"];
type Occasion = "none" | "valentin" | "cumple" | "aniversario" | "otra";
type Zone = "terrenas" | "limon" | "samana";
type EventT = "none" | "boda" | "cumple" | "empresa" | "produccion" | "otro";

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

// msgT: textos del mensaje que recibe el spa (en la versión francesa llega en español: recepción no habla francés).
// query: parámetros de la dirección (?tipo=…), leídos en el servidor para que la agenda llegue ya dibujada (sin saltos al cargar).
export default function BookingWizard({ t, lang, msgT, query = {} }: { t: Dict; lang: Locale; msgT?: Dict; query?: Record<string, string> }) {
  const b = t.booking;
  const mt = msgT ?? t;
  const mb = mt.booking;
  const msgLang: Locale = msgT ? "es" : lang;
  const m = t.massages;
  const q = { get: (k: string) => query[k] ?? null };
  const top = useRef<HTMLDivElement>(null);

  // Preselección desde los botones de la web: ?tipo=individual&masaje=profundo&nivel=premium&min=90
  const pre = <T extends string>(k: string, ok: readonly T[], d: T): T => {
    const v = q.get(k) as T | null;
    return v && ok.includes(v) ? v : d;
  };

  const [step, setStep] = useState(1);
  const [type, setType] = useState<BookType>(pre("tipo", TYPES, "individual"));
  // Lugar obligatorio: no viene marcado salvo que la dirección lo indique (?tipo=domicilio · ?lugar=spa|villa)
  const [where, setWhere] = useState<"spa" | "villa" | null>(() => {
    const tipo = q.get("tipo");
    const lugar = q.get("lugar");
    if (lugar === "spa" || lugar === "villa") return lugar;
    if (tipo === "domicilio") return "villa";
    if (tipo === "individual" || tipo === "pareja") return "spa";
    return null;
  });
  const [massage, setMassage] = useState<Pressure>(pre("masaje", PRESS, "relajante"));
  const [level, setLevel] = useState<Level>(pre("nivel", ["basico", "premium"] as const, "basico"));
  const [min, setMin] = useState<Minutes>(q.get("min") === "90" ? 90 : 60);
  const [ritual, setRitual] = useState<"basic" | "premium">(pre("ritual", ["basic", "premium"] as const, "basic"));
  const [occasion, setOccasion] = useState<Occasion>("none");
  const [people, setPeople] = useState(1);
  const [place, setPlace] = useState<"spa" | "domicilio">(q.get("lugar") === "villa" ? "domicilio" : "spa");
  // Grupos: cuántas personas quieren cada masaje y duración (mínimo 3 en total)
  const [mix, setMix] = useState<Record<Pressure, Record<Minutes, number>>>({
    relajante: { 60: 3, 90: 0 },
    profundo: { 60: 0, 90: 0 },
    descontracturante: { 60: 0, 90: 0 },
  });
  const [zone, setZone] = useState<Zone>("terrenas");
  const [therapists, setTherapists] = useState(2);
  const [event, setEvent] = useState<EventT>("none");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [cursor, setCursor] = useState(() => {
    const n = nowDR();
    return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), 1));
  });
  const [form, setForm] = useState({ name: "", phone: "", email: "", country: "", address: "", notes: "" });
  const [accept, setAccept] = useState(false);
  const [tried, setTried] = useState(false);

  // Las fechas dependen de la hora actual: se calculan en el navegador.
  useEffect(() => {
    const d = bookableDays();
    setDays(d);
    if (d[0]) setCursor(new Date(Date.UTC(Number(d[0].slice(0, 4)), Number(d[0].slice(5, 7)) - 1, 1)));
  }, []);

  // Reglas por tipo de servicio
  useEffect(() => {
    if (type === "pareja" && massage === "descontracturante") setMassage("relajante");
    if (type === "pareja" && ritual === "premium") setMin(60);
    if (type === "domicilio") setPeople((p) => Math.min(Math.max(p, 1), 6));
    if (type !== "grupo" && zone === "samana") setZone("terrenas");
    setTherapists((n) => Math.min(Math.max(n, type === "grupo" ? 2 : 1), Math.min(8, Math.max(people, type === "grupo" ? 3 : 1))));
  }, [type, ritual, massage, zone, people]);

  // Calendario mensual (semana empieza en lunes); fechas como "AAAA-MM-DD" en hora de R.D.
  const openSet = useMemo(() => new Set(days), [days]);
  const loc = intlLocale[lang];
  const monthLabel = cursor.toLocaleDateString(loc, { month: "long", year: "numeric", timeZone: "UTC" });
  const cells = useMemo(() => {
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth();
    const offset = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
    const dim = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const out: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= dim; d++) out.push(ymd(new Date(Date.UTC(y, m, d))));
    while (out.length % 7) out.push(null);
    return out;
  }, [cursor]);
  const monthKey = (d: Date) => d.getUTCFullYear() * 12 + d.getUTCMonth();
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const canPrev = !!firstDay && monthKey(cursor) > monthKey(new Date(firstDay + "T12:00:00Z"));
  const canNext = !!lastDay && monthKey(cursor) < monthKey(new Date(lastDay + "T12:00:00Z"));

  const atHome = type === "domicilio" || (type === "grupo" && place === "domicilio");
  // Grupo en el spa: la cabina es para 2 personas → turnos seguidos de 1 o 2 personas (sin tiempo entre turnos)
  const spaGroup = type === "grupo" && place === "spa";
  const groupTotal = PRESS.reduce((sum, k) => sum + mix[k][60] + mix[k][90], 0);
  const groupMax = spaGroup ? 22 : 40;
  useEffect(() => {
    if (type === "grupo") setPeople(groupTotal);
  }, [type, groupTotal]);
  const bump = (k: Pressure, mn: Minutes, d: 1 | -1) =>
    setMix((prev) => {
      if (d > 0 && groupTotal >= groupMax) return prev;
      return { ...prev, [k]: { ...prev[k], [mn]: Math.max(0, prev[k][mn] + d) } };
    });
  const persons: GroupPerson[] = PRESS.flatMap((k) => ([60, 90] as const).flatMap((mn) => Array.from({ length: mix[k][mn] }, () => ({ massage: k, min: mn }))));
  const turns: Turn[] = spaGroup ? buildTurns(persons) : [];
  // Texto de un turno: «Pareja · Relajante 60 min + Profundo 60 min»
  const turnDesc = (tn: Turn, B: typeof b, names: typeof m.names) =>
    `${tn.p.length === 2 ? B.pairLabel : B.types.individual.t} · ${tn.p.map((x) => `${names[x.massage]} ${x.min}\u00a0min`).join(" + ")}`;
  // Resumen de los masajes del grupo: «Relajante 60 min × 2»
  const mixLines = (names: typeof m.names) =>
    PRESS.flatMap((k) => ([60, 90] as const).filter((mn) => mix[k][mn] > 0).map((mn) => `${names[k]} ${mn} min × ${mix[k][mn]}`));
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const addMin = (t: string, m: number) => {
    const x = toMin(t) + m;
    return `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
  };
  const offsets = turns.map((_, i) => turns.slice(0, i).reduce((s, x) => s + x.min, 0));

  const isGroup = type === "grupo";
  const sel: Sel = {
    type,
    massage: isGroup && persons[0] ? persons[0].massage : massage,
    level: isGroup ? "basico" : level,
    min: isGroup && persons[0] ? persons[0].min : min,
    ritual,
    people,
    place,
    persons: isGroup ? persons : undefined,
  };
  const price = quote(sel);
  const times = date ? timesFor(date) : [];

  // Grupos en el spa: cada turno tiene su hora (mismo día). Se proponen seguidos desde la primera hora en que caben todos;
  // el cliente puede cambiar cualquiera. La cabina no puede tener dos turnos a la vez y ninguno empieza después de la última hora.
  const lastStartMin = toMin(agenda.lastStart);
  const [tSel, setTSel] = useState<string[]>([]);
  const turnSig = turns.map((x) => `${x.min}-${x.p.length}`).join(",");
  useEffect(() => {
    if (!spaGroup || !date) {
      setTSel([]);
      return;
    }
    const before = turns.slice(0, -1).reduce((s, x) => s + x.min, 0);
    const start = timesFor(date).find((tm) => toMin(tm) + before <= lastStartMin);
    setTSel(start ? turns.map((_, i) => addMin(start, offsets[i])) : turns.map(() => ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaGroup, date, turnSig]);
  const overlaps = (s: number, i: number) => tSel.some((o, j) => j !== i && !!o && !!turns[j] && s < toMin(o) + turns[j].min && toMin(o) < s + turns[i].min);
  const optsFor = (i: number) => {
    if (!date || !turns[i]) return [];
    const grid = timesFor(date);
    const first = grid[0] ? toMin(grid[0]) : 0;
    const ends = tSel.map((o, j) => (j !== i && o && turns[j] ? addMin(o, turns[j].min) : "")).filter((e) => e && toMin(e) >= first);
    return Array.from(new Set([...grid, ...ends]))
      .filter((tm) => toMin(tm) <= lastStartMin && !overlaps(toMin(tm), i))
      .sort((a, b) => toMin(a) - toMin(b));
  };
  const turnTimes = spaGroup ? turns.map((_, i) => tSel[i] ?? "") : [];
  // Orden por hora para el mensaje y el resumen
  const turnOrder = turns.map((_, i) => i).sort((a, b) => toMin(turnTimes[a] || "99:99") - toMin(turnTimes[b] || "99:99"));
  useEffect(() => {
    if (!spaGroup) return;
    const firstT = [...tSel].filter(Boolean).sort((a, b) => toMin(a) - toMin(b))[0] ?? "";
    setTime(firstT);
  }, [spaGroup, tSel]);

  const go = (n: number) => {
    setTried(false);
    setStep(n);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const valid2 = spaGroup
    ? !!date && turns.length > 0 && turns.every((x, i) => !!tSel[i] && toMin(tSel[i]) <= lastStartMin && !overlaps(toMin(tSel[i]), i))
    : !!date && !!time && times.includes(time);
  const valid3 = form.name.trim().length > 1 && form.phone.replace(/\D/g, "").length >= 7 && (!atHome || form.address.trim().length > 3) && accept;

  // Etiquetas
  const dayLabel = (d: string, long = false, L: Locale = lang, B = b) => {
    const [y, mo, da] = d.split("-").map(Number);
    const dt = new Date(Date.UTC(y, mo - 1, da, 12));
    const today = ymd(nowDR());
    const tomorrow = ymd(new Date(nowDR().getTime() + 86400000));
    const loc = intlLocale[L];
    const wd = dt.toLocaleDateString(loc, { weekday: long ? "long" : "short", timeZone: "UTC" });
    const md = dt.toLocaleDateString(loc, { day: "numeric", month: long ? "long" : "short", timeZone: "UTC" });
    const rel = d === today ? B.today : d === tomorrow ? B.tomorrow : "";
    return { wd: rel || wd, md, full: `${rel ? rel + ", " : ""}${wd} ${md}` };
  };

  const svcSel: ServiceSel = { type, massage, level, min, ritual, place, people, zone };
  const serviceText = serviceLabel(t, svcSel);

  const priceText = (B = b) => {
    const base = `${fmtRd(price.total)} (${fmtUsd(price.total)})`;
    if (type === "pareja") return `${base} ${B.forTwo}`;
    if (type === "grupo") return `${base} · ${people} ${B.people.toLowerCase()}${price.discount ? ` · ${B.discount}: −${fmtRd(price.discount)}` : ""}`;
    if (price.total !== price.unit) return `${base} · ${people} × ${fmtRd(price.unit)}${price.estimate ? ` · ${B.estimate}` : ""}`;
    return base;
  };

  // Monto a pagar por adelantado: domicilio 100 %; Ritual Premium y grupos 50 %; en el spa, al llegar.
  const due = type === "domicilio" ? price.total : type === "grupo" || (type === "pareja" && ritual === "premium") ? Math.round(price.total / 2) : 0;
  const confirmUrl = () =>
    date && time
      ? reservaUrl({ l: lang, n: form.name, sel: svcSel, d: date, h: time, t: price.total, due, est: price.estimate ? 1 : 0, ok: 1 })
      : "";

  const message = () => {
    const origin = getOrigin();
    const short = date && time ? minutesUntil(date, time) < agenda.recommendedNotice : false;
    // null = línea que no aplica (se quita); "" = línea en blanco a propósito
    const L = ([
      mb.msgTitle,
      msgT ? mb.frClient : null,
      short ? mb.shortNotice : null,
      "",
      `${mb.whereLabel}: ${mb.whereMsg[atHome ? "villa" : "spa"]}`,
      `${mb.service}: ${serviceLabel(mt, svcSel)}`,
      ...(isGroup ? [mb.mixMsg, ...mixLines(mt.massages.names).map((l) => `• ${l}`)] : []),
      ...(spaGroup ? [mb.turnsMsg, ...turnOrder.map((i, k) => `${k + 1}) ${fmtTime(turnTimes[i], msgLang)} · ${turnDesc(turns[i], mb, mt.massages.names)}`)] : []),
      type === "grupo" || type === "domicilio" ? `${mb.people}: ${people}` : null,
      type === "grupo" && !spaGroup ? `${mb.therapists}: ${therapists}` : null,
      type === "grupo" ? `${mb.event}: ${mb.events[event]}` : null,
      atHome ? `${mb.zone}: ${mb.zones[zone]}` : null,
      type === "pareja" && occasion !== "none" ? `${mb.occasion.split("(")[0].trim()} ${mb.occasions[occasion]}` : null,
      `${mb.total}: ${priceText(mb)}`,
      `${mb.when}: ${date ? dayLabel(date, true, msgLang, mb).full : ""}, ${time ? fmtTime(time, msgLang) : ""}`,
      "",
      `${mb.name}: ${form.name}`,
      `${mb.phone}: ${form.phone}`,
      form.email ? `${mb.email.replace(/ \(.*\)/, "")}: ${form.email}` : null,
      form.country ? `${mb.country}: ${form.country}` : null,
      atHome ? `${mb.address}: ${form.address}` : null,
      form.notes ? `${mb.notes.replace(/ \(.*\)/, "")}: ${form.notes}` : null,
      origin ? `${mb.origin}: ${origin}` : null,
      "",
      `${mt.pay.confirmLink}`,
      confirmUrl(),
    ] as (string | null)[]).filter((l): l is string => l !== null);
    return L.filter((l, i) => l !== "" || L[i - 1] !== "").join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };

  const mailHref = () => `mailto:${site.email}?subject=${encodeURIComponent(`${mb.msgTitle} · ${form.name}`)}&body=${encodeURIComponent(message())}`;

  const next = (ok: boolean, n: number) => (ok ? go(n) : setTried(true));

  const pickWhere = (w: "spa" | "villa") => {
    setWhere(w);
    setPlace(w === "villa" ? "domicilio" : "spa");
    if (w === "villa" && type !== "grupo") setType("domicilio");
    if (w === "spa" && type === "domicilio") setType("individual");
    setTried(false);
  };
  // El spa tiene una sola cabina, para 2 personas: los grupos en el spa van por turnos seguidos.
  const typesHere: BookType[] = where === "villa" ? ["domicilio", "grupo"] : ["individual", "pareja", "grupo"];

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
          <Field label={b.where}>
            <div className={`bk-types bk-where ${tried && !where ? "is-err" : ""}`} role="radiogroup" aria-label={b.where}>
              {(["spa", "villa"] as const).map((k) => (
                <button key={k} type="button" role="radio" aria-checked={where === k} className={where === k ? "is-on" : ""} onClick={() => pickWhere(k)}>
                  <ExpIcon k={k === "spa" ? "individual" : "domicilio"} size={26} />
                  <b>{b.whereOpts[k].t}</b>
                  <span>{b.whereOpts[k].d}</span>
                </button>
              ))}
            </div>
            {tried && !where && <p className="bk-err">{b.whereErr}</p>}
          </Field>

          {where && (
          <>
          <Field label={b.type}>
            <div className="bk-types" role="radiogroup" aria-label={b.type}>
              {typesHere.map((k) => (
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

          {!(type === "pareja" && ritual === "premium") && !isGroup && (
            <Field label={b.massage}>
              <Chips
                label={b.massage}
                value={massage}
                onChange={setMassage}
                opts={PRESS.filter((p) => type !== "pareja" || p !== "descontracturante").map((v) => ({ v, l: m.names[v], d: m.press[v] }))}
              />
            </Field>
          )}

          <div className="bk-row">
            {type === "individual" && (
              <Field label={b.level}>
                <Chips label={b.level} value={level} onChange={setLevel} opts={(["basico", "premium"] as const).map((v) => ({ v, l: m.levels[v] }))} />
              </Field>
            )}
            {!(type === "pareja" && ritual === "premium") && !isGroup && (
              <Field label={b.minutes}>
                <Chips label={b.minutes} value={min} onChange={setMin} opts={([60, 90] as const).map((v) => ({ v, l: `${v} min` }))} />
              </Field>
            )}
          </div>

          {isGroup && (
            <Field label={b.mixTitle}>
              <p className="bk-note">{b.mixNote}</p>
              <div className={`bk-mix ${tried && groupTotal < 3 ? "is-err" : ""}`} role="group" aria-label={b.mixTitle}>
                <div className="bk-mix__head" aria-hidden="true">
                  <span />
                  <span>60 min</span>
                  <span>90 min</span>
                </div>
                {PRESS.map((k) => (
                  <div className="bk-mix__row" key={k}>
                    <span className="bk-mix__name">
                      <b>{m.names[k]}</b>
                      <small>{m.press[k]}</small>
                    </span>
                    {([60, 90] as const).map((mn) => (
                      <span className={`bk-mix__c ${mix[k][mn] ? "is-on" : ""}`} key={mn}>
                        <button type="button" aria-label={`− ${m.names[k]} ${mn} min`} onClick={() => bump(k, mn, -1)} disabled={!mix[k][mn]}>
                          −
                        </button>
                        <output aria-live="polite">{mix[k][mn]}</output>
                        <button type="button" aria-label={`+ ${m.names[k]} ${mn} min`} onClick={() => bump(k, mn, 1)} disabled={groupTotal >= groupMax}>
                          +
                        </button>
                      </span>
                    ))}
                  </div>
                ))}
                <div className="bk-mix__total">
                  <span>
                    {b.mixTotal}
                    <small>{b.mixRange.replace("{max}", String(groupMax))}</small>
                  </span>
                  <b>
                    {groupTotal} {groupTotal === 1 ? b.personOne : b.people.toLowerCase()}
                  </b>
                </div>
              </div>
              <button type="button" className="bk-mix__add" onClick={() => bump("relajante", 60, 1)} disabled={groupTotal >= groupMax}>
                <span aria-hidden="true">+</span> {b.mixAdd}
              </button>
              {tried && groupTotal < 3 && <p className="bk-err">{b.mixErr}</p>}
            </Field>
          )}

          {type === "domicilio" && (
            <Field label={b.people}>
              <div className="bk-count">
                <button type="button" aria-label="−" onClick={() => setPeople((p) => Math.max(1, p - 1))}>
                  −
                </button>
                <output aria-live="polite">{people}</output>
                <button type="button" aria-label="+" onClick={() => setPeople((p) => Math.min(6, p + 1))}>
                  +
                </button>
              </div>
            </Field>
          )}

          {spaGroup && (
            <Field label={b.turnsTitle}>
              <p className="bk-note">{b.turnsNote}</p>
              <ol className="bk-turns">
                {turns.map((tn, i) => (
                  <li key={i}>
                    <span className="bk-turns__n">{i + 1}</span>
                    <span className="bk-turns__who">
                      {b.turn} {i + 1} · {tn.p.length === 2 ? b.pairLabel : b.types.individual.t}
                    </span>
                    <span className="bk-turns__what">{tn.p.map((x) => `${m.names[x.massage]} ${x.min}\u00a0min`).join(" + ")}</span>
                  </li>
                ))}
              </ol>
            </Field>
          )}

          {type === "grupo" && (
            <>
              {!spaGroup && (
              <Field label={b.therapists}>
                <div className="bk-count">
                  <button type="button" aria-label="−" onClick={() => setTherapists((n) => Math.max(1, n - 1))}>
                    −
                  </button>
                  <output aria-live="polite">{therapists}</output>
                  <button type="button" aria-label="+" onClick={() => setTherapists((n) => Math.min(8, people, n + 1))}>
                    +
                  </button>
                </div>
                <p className="bk-note bk-note--mt">{b.therapistsNote}</p>
              </Field>
              )}
              <Field label={b.event}>
                <select className="bk-input" value={event} onChange={(e) => setEvent(e.target.value as EventT)}>
                  {(Object.keys(b.events) as EventT[]).map((k) => (
                    <option key={k} value={k}>
                      {b.events[k]}
                    </option>
                  ))}
                </select>
              </Field>
            </>
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
          {type === "individual" && level === "premium" && <p className="bk-note">{b.premiumNote}</p>}
          {type === "domicilio" && <p className="bk-note">{b.homeNote}</p>}
          </>
          )}

          <div className="bk-bar">
            {where ? (
            <div className="bk-price" aria-live="polite">
              <small>{price.estimate ? b.estimate : b.total}</small>
              <b>{fmtRd(price.total)}</b>
              <span>
                {fmtUsd(price.total)}
                {type === "pareja" ? ` · ${b.forTwo}` : type === "grupo" ? ` · ${people} ${b.people.toLowerCase()}${price.discount ? " · −10 %" : ""}` : price.total !== price.unit ? ` · ${people} × ${fmtRd(price.unit)}` : ` · ${b.perPerson}`}
              </span>
            </div>
            ) : (
              // Sin lugar elegido: la barra indica qué falta (el total aparece al elegir)
              <p className="bk-bar__hint">
                <span aria-hidden="true">↑</span> {b.whereHint}
              </p>
            )}
            <button type="button" className={`btn btn--teal ${where ? "" : "is-dim"}`} onClick={() => next(!!where && (!isGroup || groupTotal >= 3), 2)}>
              {b.next}
            </button>
          </div>
        </div>
      )}

      {/* ── Paso 2 · Fecha y hora (calendario mensual como en la clínica) ── */}
      {step === 2 && (
        <div className="bk-panel" key="s2">
          <div className="bk-open" role="note">
            <span className="bk-open__ico" aria-hidden="true">
              <Clock size={22} />
            </span>
            <div>
              <p className="bk-open__t">{b.openTitle}</p>
              <p className="bk-open__h">{b.openHours}</p>
            </div>
            <ul>
              {b.openNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>

          <div className="cal">
            <div className="cal__head">
              <span className="cal__month">{monthLabel}</span>
              <div>
                <button type="button" aria-label={b.prevMonth} disabled={!canPrev} onClick={() => setCursor(new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() - 1, 1)))}>
                  ‹
                </button>
                <button type="button" aria-label={b.nextMonth} disabled={!canNext} onClick={() => setCursor(new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1)))}>
                  ›
                </button>
              </div>
            </div>
            <div className="cal__grid" key={ymd(cursor)}>
              {[1, 2, 3, 4, 5, 6, 0].map((i) => (
                <span className="cal__dow" key={i}>
                  {b.days[i]}
                </span>
              ))}
              {cells.map((d, i) => {
                if (!d) return <span key={i} />;
                const ok = openSet.has(d);
                return (
                  <button
                    type="button"
                    key={d}
                    disabled={!ok}
                    style={{ "--c": i } as React.CSSProperties}
                    className={`cal__day ${ok ? "is-open" : ""} ${date === d ? "is-on" : ""}`}
                    aria-pressed={date === d}
                    aria-label={dayLabel(d, true).full}
                    onClick={() => {
                      setDate(d);
                      setTime("");
                    }}
                  >
                    {Number(d.slice(8))}
                  </button>
                );
              })}
            </div>
            <div className="cal__legend">
              <span>
                <i className="dot dot--open" /> {b.legendOpen}
              </span>
              <span>
                <i className="dot dot--closed" /> {b.legendClosed}
              </span>
            </div>
          </div>

          <div className="bk-times-wrap">
            {!date ? (
              <p className="bk-note">{b.pickDay}</p>
            ) : (
              <div key={date} className="bk-in">
                {spaGroup ? (
                  <>
                    <p className="times__title">
                      {b.turnTimesTitle} · {dayLabel(date, true).full}
                    </p>
                    {tSel.some(Boolean) ? (
                      <>
                        <p className="bk-note">{b.turnTimesHint}</p>
                        <ol className="bk-tt">
                          {turns.map((tn, i) => (
                            <li key={i}>
                              <span className="bk-turns__n">{i + 1}</span>
                              <span className="bk-tt__what">
                                <b>{tn.p.length === 2 ? b.pairLabel : b.types.individual.t}</b>
                                <small>{tn.p.map((x) => `${m.names[x.massage]} ${x.min}\u00a0min`).join(" + ")}</small>
                              </span>
                              <select
                                className="bk-input"
                                aria-label={`${b.turn} ${i + 1}`}
                                value={tSel[i] || ""}
                                onChange={(e) => setTSel((prev) => prev.map((v, k) => (k === i ? e.target.value : v)))}
                              >
                                {!tSel[i] && <option value="">—</option>}
                                {optsFor(i).map((tm) => (
                                  <option key={tm} value={tm}>
                                    {fmtTime(tm, lang)}
                                  </option>
                                ))}
                              </select>
                            </li>
                          ))}
                        </ol>
                      </>
                    ) : (
                      <p className="bk-note">{b.noTimesGroup}</p>
                    )}
                  </>
                ) : (
                  <>
                <p className="times__title">
                  {b.available} {dayLabel(date, true).full}
                </p>
                {times.length ? (
                  <div className="bk-times">
                    {times.map((tm, i) => (
                      <button key={tm} type="button" style={{ "--i": i } as React.CSSProperties} aria-pressed={time === tm} className={time === tm ? "is-on" : ""} onClick={() => setTime(tm)}>
                        {fmtTime(tm, lang)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="bk-note">{b.noTimes}</p>
                )}
                  </>
                )}
              </div>
            )}
          </div>
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
          <label className="bk-field">
            <span className="ms__label">{b.country}</span>
            <input className="bk-input" type="text" autoComplete="country-name" list="bk-countries" placeholder={b.countryPh} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <datalist id="bk-countries">
              {({
                es: ["República Dominicana", "Francia", "Italia", "España", "Estados Unidos", "Canadá", "Alemania", "Suiza", "Bélgica", "Reino Unido", "Países Bajos", "Argentina", "Colombia", "Venezuela", "Puerto Rico"],
                en: ["Dominican Republic", "France", "Italy", "Spain", "United States", "Canada", "Germany", "Switzerland", "Belgium", "United Kingdom", "Netherlands", "Argentina", "Colombia", "Venezuela", "Puerto Rico"],
                fr: ["France", "Belgique", "Suisse", "Canada", "République dominicaine", "Italie", "Espagne", "États-Unis", "Allemagne", "Royaume-Uni", "Pays-Bas", "Luxembourg"],
              }[lang]).map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
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
                {b.whereLabel}
                <button type="button" onClick={() => go(1)}>{b.edit}</button>
              </dt>
              <dd>{b.whereMsg[atHome ? "villa" : "spa"]}</dd>
            </div>
            <div>
              <dt>
                {b.service}
                <button type="button" onClick={() => go(1)}>{b.edit}</button>
              </dt>
              <dd>
                {serviceText}
                {(type === "grupo" || type === "domicilio") && people > 1 && ` · ${people} ${b.people.toLowerCase()}`}
                {type === "grupo" && !spaGroup && ` · ${therapists} ${b.therapists.toLowerCase()}`}
                {type === "grupo" && ` · ${b.events[event]}`}
                {isGroup && !spaGroup && (
                  <ol className="bk-sum__turns">
                    {mixLines(m.names).map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ol>
                )}
                {spaGroup && (
                  <ol className="bk-sum__turns">
                    {turnOrder.map((i) => (
                      <li key={i}>
                        {turnTimes[i] ? `${fmtTime(turnTimes[i], lang)} · ` : ""}
                        {turnDesc(turns[i], b, m.names)}
                      </li>
                    ))}
                  </ol>
                )}
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
                {form.country && ` · ${form.country}`}
                {atHome && <><br />{form.address}</>}
              </dd>
            </div>
          </dl>
          {/* Ticket con el precio */}
          <div className="tk">
            <div className="tk__top">
              <Ripples />
              <small>{price.estimate ? b.estimate : b.total}</small>
              <b>{fmtRd(price.total)}</b>
              <span>
                ≈ {fmtUsd(price.total)}
                {type === "pareja" ? ` · ${b.forTwo}` : type === "grupo" ? ` · ${people} ${b.people.toLowerCase()}${price.discount ? " · −10 %" : ""}` : price.total !== price.unit ? ` · ${people} × ${fmtRd(price.unit)}` : ` · ${b.perPerson}`}
              </span>
            </div>
            <div className="tk__cut" aria-hidden="true" />
            <div className="tk__bot">
              {due > 0 && due === price.total ? (
                <span className="tk__lbl tk__lbl--warn">{b.payFull}</span>
              ) : due > 0 ? (
                <>
                  <span className="tk__lbl">{type === "domicilio" ? b.payNow : b.deposit50}</span>
                  <b className="tk__due">
                    {fmtRd(due)} <small>≈ {fmtUsd(due)}</small>
                  </b>
                  {spaGroup && <small className="tk__alt">{b.groupPayAlt}</small>}
                </>
              ) : (
                <span className="tk__lbl tk__lbl--ok">✓ {b.payLater}</span>
              )}
            </div>
          </div>

          {/* Formas de pago */}
          <div className="bk-pay">
            <p className="ms__label">{b.howPay}</p>
            <ul className="bk-pay__chips">
              {(["cash", "card", "bank", "remitly"] as const).map((k, i) => (
                <li key={k} style={{ "--i": i } as React.CSSProperties}>
                  <PayIcon k={k} />
                  <span>{b.payChips[k]}</span>
                </li>
              ))}
            </ul>
            <p className="bk-note">{atHome ? `${t.pay.dueDom} ${b.payChipsNote}` : b.payChipsNote}</p>
          </div>

          <div className="bk-send">
            <a className="btn btn--teal" href={waLink(message())} target="_blank" rel="noopener noreferrer" data-track="booking_whatsapp">
              <WaIcon /> {b.sendWa}
            </a>
            <a className="btn btn--line" href={mailHref()} data-track="booking_email">
              {b.sendMail}
            </a>
          </div>

          {/* Qué pasa después */}
          <div className="bk-next">
            <p className="ms__label">{b.nextTitle}</p>
            <ol>
              {b.nextSteps.map((x, i) => (
                <li key={x}>
                  <span>{i + 1}</span>
                  {x}
                </li>
              ))}
            </ol>
          </div>
          <button type="button" className="bk-more" onClick={() => go(3)}>
            {b.back}
          </button>
        </div>
      )}
    </div>
  );
}
