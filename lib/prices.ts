// Precios en RD$. El equivalente en US$ se calcula con la tasa de abajo (redondeado a múltiplos de 5).
export const usdRate = 61.5;

export const usd = (rd: number) => Math.max(5, Math.round(rd / usdRate / 5) * 5);
export const fmtRd = (n: number) => `RD$${n.toLocaleString("en-US")}`;
export const fmtUsd = (rd: number) => `US$${usd(rd)}`;

export type Pressure = "relajante" | "profundo" | "descontracturante";
export type Level = "basico" | "premium";
export type Minutes = 60 | 90;

// Masajes individuales en cabina, precio por persona
export const individual: Record<Pressure, Record<Level, Record<Minutes, number>>> = {
  relajante: { basico: { 60: 3500, 90: 4500 }, premium: { 60: 4500, 90: 6000 } },
  profundo: { basico: { 60: 4500, 90: 5500 }, premium: { 60: 6000, 90: 7000 } },
  descontracturante: { basico: { 60: 4500, 90: 5500 }, premium: { 60: 6000, 90: 7000 } },
};

// Ritual Connection · pareja (precio total para dos)
export const couple = {
  basic: { 60: 7000, 90: 9000 },
  premium: { 60: 15000 },
};

// A domicilio (Las Terrenas y El Limón)
export const home: Record<"relajante" | "profundo", Record<Minutes, number>> = {
  relajante: { 60: 5000, 90: 7500 },
  profundo: { 60: 6000, 90: 8000 }, // también descontracturante
};

export const fromPrice = individual.relajante.basico[60];

// ── Cálculo del precio de una reserva ─────────────────────
export type BookType = "individual" | "pareja" | "domicilio" | "grupo";
export type Sel = {
  type: BookType;
  massage: Pressure;
  level: Level;
  min: Minutes;
  ritual: "basic" | "premium";
  people: number;
  place: "spa" | "domicilio";
};

const homeKey = (m: Pressure) => (m === "relajante" ? "relajante" : "profundo");

/** Devuelve el total en RD$, el precio unitario y si es un estimado (grupos). */
export function quote(s: Sel): { total: number; unit: number; estimate: boolean } {
  switch (s.type) {
    case "individual": {
      const u = individual[s.massage][s.level][s.min];
      return { total: u, unit: u, estimate: false };
    }
    case "pareja": {
      const u = s.ritual === "premium" ? couple.premium[60] : couple.basic[s.min];
      return { total: u, unit: u, estimate: false };
    }
    case "domicilio": {
      const u = home[homeKey(s.massage)][s.min];
      return { total: u * s.people, unit: u, estimate: false };
    }
    case "grupo": {
      const u = s.place === "spa" ? individual[s.massage][s.level][s.min] : home[homeKey(s.massage)][s.min];
      return { total: u * s.people, unit: u, estimate: true };
    }
  }
}
