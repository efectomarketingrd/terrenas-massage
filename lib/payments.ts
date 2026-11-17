// ─────────────────────────────────────────────────────────────
// FORMAS DE PAGO — "Paga tu masaje" (/es/pagar · /en/pay)
// Un medio sin enlace ("") no se muestra en la web. Para activarlo, pega su enlace aquí.
// ─────────────────────────────────────────────────────────────
export const payments = {
  remitly: "https://remitly.com/pay/omarh1185",
  wise: "", // pendiente: enlace de pago de Wise
  cardLink: "", // pendiente: enlace de pago para tarjetas dominicanas
  // Datos para transferencia bancaria (pendiente). Ejemplo:
  // bank: { holder: "Nombre del titular", bank: "Banco Popular", accounts: [{ cur: "RD$", type: "Ahorro", number: "000000000" }] },
  bank: null as null | { holder: string; bank: string; id?: string; accounts: { cur: "RD$" | "US$"; type: string; number: string }[] },
};

export const payPath = (lang: "es" | "en", code = "") => `/${lang}/${lang === "es" ? "pagar" : "pay"}${code ? `?c=${code}` : ""}`;
