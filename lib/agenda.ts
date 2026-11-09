// ─────────────────────────────────────────────────────────────
// AGENDA DEL SPA — aquí se controlan los días y las horas disponibles.
// Cualquier cambio en este archivo se publica en la web al subirlo a GitHub.
// ─────────────────────────────────────────────────────────────

export const agenda = {
  // Abierto todos los días, feriados incluidos.
  open: "09:00",
  lastStart: "19:00", // última hora en que puede INICIAR un masaje
  step: 60, // minutos entre una hora y la siguiente (9:00, 10:00 … 19:00)

  // Anticipación mínima para reservar (minutos)
  minNotice: 60,

  // Hasta cuántos días hacia adelante se puede reservar
  maxDaysAhead: 60,

  // Días CERRADOS (por ejemplo, vacaciones o mantenimiento). Formato "AAAA-MM-DD".
  // Ejemplo: ["2026-12-25"]
  closedDates: [] as string[],

  // Horas OCUPADAS en un día concreto (para no ofrecerlas).
  // Ejemplo: { "2026-11-20": ["10:00", "10:30"] }
  blockedSlots: {} as Record<string, string[]>,
};

// Las Terrenas no cambia de horario: UTC-4 todo el año.
const DR_OFFSET_MIN = -4 * 60;

/** Fecha y hora actuales en República Dominicana, como objeto Date "local" (usar getUTC*). */
export function nowDR() {
  return new Date(Date.now() + DR_OFFSET_MIN * 60000);
}

export const pad = (n: number) => String(n).padStart(2, "0");
export const ymd = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Todas las horas de inicio del día (09:00 … 19:00). */
export function allTimes() {
  const out: string[] = [];
  for (let m = toMin(agenda.open); m <= toMin(agenda.lastStart); m += agenda.step) out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  return out;
}

/** Horas disponibles para una fecha ("AAAA-MM-DD"), respetando la anticipación mínima. */
export function timesFor(date: string) {
  if (agenda.closedDates.includes(date)) return [];
  const blocked = agenda.blockedSlots[date] || [];
  const now = nowDR();
  const today = ymd(now);
  const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  return allTimes().filter((t) => !blocked.includes(t) && (date !== today || toMin(t) >= nowMin + agenda.minNotice));
}

/** Próximos días reservables (incluye hoy si aún quedan horas). */
export function bookableDays() {
  const now = nowDR();
  const days: string[] = [];
  for (let i = 0; i <= agenda.maxDaysAhead; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i));
    const key = ymd(d);
    if (timesFor(key).length) days.push(key);
  }
  return days;
}

/** "14:30" → "2:30 p. m." / "2:30 pm" */
export function fmtTime(t: string, lang: "es" | "en") {
  const [h, m] = t.split(":").map(Number);
  const h12 = ((h + 11) % 12) + 1;
  const suf = h < 12 ? (lang === "es" ? "a.\u00a0m." : "am") : lang === "es" ? "p.\u00a0m." : "pm";
  return `${h12}:${pad(m)}\u00a0${suf}`;
}
