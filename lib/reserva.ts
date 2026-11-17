// Enlace personal de la reserva: los datos viajan dentro del enlace (sin base de datos).
// Solo lo necesario para mostrar el resumen y el pago: nunca teléfono, correo ni dirección.
// https://terrenasmassage.com/r/<código>  →  /<idioma>/pagar?c=<código>
import { site, type Locale } from "./site";

export type Reserva = {
  l: Locale; // idioma
  n: string; // nombre del cliente
  s: string; // servicio (texto ya armado en el idioma de la reserva)
  d: string; // fecha AAAA-MM-DD
  h: string; // hora HH:MM
  dom: 0 | 1; // a domicilio
  t: number; // total en RD$
  due: number; // monto a pagar ahora en RD$ (0 = al llegar al spa)
  est: 0 | 1; // total estimado (grupos: el precio final se confirma)
  ok: 0 | 1; // 1 = enlace de confirmación (disponibilidad confirmada por el spa)
};

const toB64Url = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromB64Url = (s: string) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

const clean = (s: string) => s.replace(/~/g, "-").replace(/\s+/g, " ").trim();

export function reservaCode(r: Reserva) {
  const flags = (r.dom ? 1 : 0) | (r.est ? 2 : 0) | (r.ok ? 4 : 0);
  const parts = [r.l === "en" ? "e" : "s", clean(r.n).slice(0, 40), clean(r.s).slice(0, 160), r.d.slice(2).replace(/-/g, ""), r.h.replace(":", ""), flags.toString(36), r.t.toString(36), r.due.toString(36)];
  return toB64Url(parts.join("~"));
}

export const reservaUrl = (r: Reserva) => `${site.url}/r/${reservaCode(r)}`;

export function readReserva(code: string): Reserva | null {
  try {
    const p = fromB64Url(code).split("~");
    if (p.length < 8) return null;
    const [l, n, s, d, h, f, t, due] = p;
    const flags = parseInt(f, 36) || 0;
    if (!/^\d{6}$/.test(d) || !/^\d{4}$/.test(h)) return null;
    return {
      l: l === "e" ? "en" : "es",
      n,
      s,
      d: `20${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4, 6)}`,
      h: `${h.slice(0, 2)}:${h.slice(2)}`,
      dom: flags & 1 ? 1 : 0,
      est: flags & 2 ? 1 : 0,
      ok: flags & 4 ? 1 : 0,
      t: parseInt(t, 36) || 0,
      due: parseInt(due, 36) || 0,
    };
  } catch {
    return null;
  }
}
