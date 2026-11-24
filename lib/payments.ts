import { slugs, type Locale } from "./i18n";
// ─────────────────────────────────────────────────────────────
// FORMAS DE PAGO — "Paga tu masaje" (/es/pagar · /en/pay)
// Un medio sin enlace ("") no se muestra en la web. Para activarlo, pega su enlace aquí.
// ─────────────────────────────────────────────────────────────
export const payments = {
  remitly: "https://remitly.com/pay/omarh1185",
  // Cómo aparece la cuenta al abrir Remitly (se avisa en la web para que el cliente no se sorprenda)
  remitlyAccount: { name: "OMAR H", handle: "@omarh1185", initials: "OH" },
  cardLink: "", // pendiente: enlace de pago para tarjetas dominicanas
  // Datos para transferencia bancaria. La cédula del titular NO se publica: el cliente la pide por WhatsApp (Omar, 23 nov 2026).
  bank: {
    holder: "Fatima Hernández",
    bank: "Banco Popular",
    email: "terrenasmassagerd@gmail.com",
    accounts: [{ cur: "RD$", type: "Ahorro", number: "823433727" }],
  } as null | { holder: string; bank: string; email?: string; id?: string; accounts: { cur: "RD$" | "US$"; type: string; number: string }[] },
};

export const payPath = (lang: Locale, code = "") => `/${lang}/${slugs.pay[lang]}${code ? `?c=${code}` : ""}`;
