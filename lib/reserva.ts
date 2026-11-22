// Enlace personal de la reserva: los datos viajan dentro del enlace (sin base de datos), en forma corta.
// Solo lo necesario para mostrar el resumen y el pago: nunca teléfono, correo ni dirección.
// https://terrenasmassage.com/r/<código>  →  /<idioma>/pagar?c=<código>
import { site, type Locale } from "./site";
import type { ServiceSel } from "./service";

export type Reserva = {
  l: Locale;
  n: string; // nombre (solo el primero, para acortar)
  sel: ServiceSel; // servicio en códigos; el texto se arma en la página
  d: string; // fecha AAAA-MM-DD
  h: string; // hora HH:MM
  t: number; // total RD$
  due: number; // a pagar ahora RD$ (0 = al llegar al spa)
  est: 0 | 1; // total estimado (grupos)
  ok: 0 | 1; // 1 = disponibilidad confirmada
};

const TYPES = ["individual", "pareja", "domicilio", "grupo"] as const;
const PRESS = ["relajante", "profundo", "descontracturante"] as const;
const ZONES = ["terrenas", "limon", "samana"] as const;

const toB64Url = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64Url = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));

// Código del servicio en 7 caracteres + personas: tipo, masaje, nivel, minutos, ritual, lugar, zona
export function reservaCode(r: Reserva) {
  const s = r.sel;
  const svc =
    TYPES.indexOf(s.type).toString() +
    PRESS.indexOf(s.massage) +
    (s.level === "premium" ? 1 : 0) +
    (s.min === 90 ? 1 : 0) +
    (s.ritual === "premium" ? 1 : 0) +
    (s.place === "domicilio" ? 1 : 0) +
    ZONES.indexOf(s.zone);
  const first = r.n.trim().split(/\s+/)[0]?.replace(/~/g, "").slice(0, 20) ?? "";
  const flags = (r.est ? 1 : 0) | (r.ok ? 2 : 0);
  const parts = [({ es: "s", en: "e", fr: "f" } as const)[r.l] + flags, first, svc + s.people.toString(36), r.d.slice(2).replace(/-/g, "") + r.h.replace(":", ""), r.t.toString(36), r.due.toString(36)];
  return toB64Url(parts.join("~"));
}

export const reservaUrl = (r: Reserva) => `${site.url}/r/${reservaCode(r)}`;

export function readReserva(code: string): Reserva | null {
  try {
    const p = fromB64Url(code).split("~");
    if (p.length < 6) return null;
    const [lf, n, sv, dh, t, due] = p;
    if (!/^\d{7}[0-9a-z]+$/.test(sv) || !/^\d{10}$/.test(dh)) return null;
    const flags = Number(lf.slice(1)) || 0;
    const num = (i: number) => Number(sv[i]);
    return {
      l: lf[0] === "e" ? "en" : lf[0] === "f" ? "fr" : "es",
      n,
      sel: {
        type: TYPES[num(0)] ?? "individual",
        massage: PRESS[num(1)] ?? "relajante",
        level: num(2) ? "premium" : "basico",
        min: num(3) ? 90 : 60,
        ritual: num(4) ? "premium" : "basic",
        place: num(5) ? "domicilio" : "spa",
        zone: ZONES[num(6)] ?? "terrenas",
        people: parseInt(sv.slice(7), 36) || 1,
      },
      d: `20${dh.slice(0, 2)}-${dh.slice(2, 4)}-${dh.slice(4, 6)}`,
      h: `${dh.slice(6, 8)}:${dh.slice(8, 10)}`,
      t: parseInt(t, 36) || 0,
      due: parseInt(due, 36) || 0,
      est: flags & 1 ? 1 : 0,
      ok: flags & 2 ? 1 : 0,
    };
  } catch {
    return null;
  }
}
