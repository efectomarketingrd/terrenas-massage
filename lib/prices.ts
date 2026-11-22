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

// Ritual Connection · pareja (precio total para dos).
// Basic = 2 × el precio individual Básico del masaje elegido (relajante o profundo); Premium, precio fijo de 60 min.
export const couple = {
  basic: {
    relajante: { 60: individual.relajante.basico[60] * 2, 90: individual.relajante.basico[90] * 2 }, // RD$7,000 · RD$9,000
    profundo: { 60: individual.profundo.basico[60] * 2, 90: individual.profundo.basico[90] * 2 }, // RD$9,000 · RD$11,000
  },
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
/** Turno de cabina en el spa (grupos): la cabina es para 2 personas; los turnos van seguidos. */
export type Turn = { massage: Pressure; min: Minutes; n: 1 | 2 };

/** Descuento de grupo: 10 % desde 10 personas. */
export const groupDiscount = { minPeople: 10, rate: 0.1 };

export type Sel = {
  turns?: Turn[];
  type: BookType;
  massage: Pressure;
  level: Level;
  min: Minutes;
  ritual: "basic" | "premium";
  people: number;
  place: "spa" | "domicilio";
};

const homeKey = (m: Pressure) => (m === "relajante" ? "relajante" : "profundo");

/** Devuelve el total en RD$ (ya con el descuento de grupo), el precio unitario, el descuento aplicado y si es un estimado. */
export function quote(s: Sel): { total: number; unit: number; estimate: boolean; discount: number } {
  switch (s.type) {
    case "individual": {
      const u = individual[s.massage][s.level][s.min];
      return { total: u, unit: u, estimate: false, discount: 0 };
    }
    case "pareja": {
      const u = s.ritual === "premium" ? couple.premium[60] : couple.basic[s.massage === "profundo" ? "profundo" : "relajante"][s.min];
      return { total: u, unit: u, estimate: false, discount: 0 };
    }
    case "domicilio": {
      const u = home[homeKey(s.massage)][s.min];
      return { total: u * s.people, unit: u, estimate: false, discount: 0 };
    }
    case "grupo": {
      // En el spa: suma de cada turno (precio individual Básico por persona); a domicilio: precio a domicilio × personas
      const gross =
        s.place === "spa" && s.turns?.length
          ? s.turns.reduce((sum, t) => sum + individual[t.massage].basico[t.min] * t.n, 0)
          : home[homeKey(s.massage)][s.min] * s.people;
      const discount = s.people >= groupDiscount.minPeople ? Math.round(gross * groupDiscount.rate) : 0;
      return { total: gross - discount, unit: Math.round(gross / Math.max(1, s.people)), estimate: false, discount };
    }
  }
}
