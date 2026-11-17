// Texto del servicio elegido (se usa en la agenda y en "Paga tu masaje").
import type { Dict } from "./content";
import type { BookType, Level, Minutes, Pressure } from "./prices";

export type ServiceSel = {
  type: BookType;
  massage: Pressure;
  level: Level;
  min: Minutes;
  ritual: "basic" | "premium";
  place: "spa" | "domicilio";
  people: number;
  zone: "terrenas" | "limon" | "samana";
};

export function serviceLabel(t: Dict, s: ServiceSel, extras = false) {
  const b = t.booking;
  const m = t.massages;
  const parts: string[] = [b.types[s.type].t];
  if (s.type === "pareja") {
    parts.push(`Ritual Connection ${b.ritualOpts[s.ritual].t}`);
    if (s.ritual === "basic") parts.push(m.names[s.massage]);
  } else {
    parts.push(m.names[s.massage]);
    if (s.type === "individual" || (s.type === "grupo" && s.place === "spa")) parts.push(m.levels[s.level]);
  }
  parts.push(`${s.type === "pareja" && s.ritual === "premium" ? 60 : s.min} min`);
  if (extras) {
    if ((s.type === "grupo" || s.type === "domicilio") && s.people > 1) parts.push(`${s.people} ${b.people.toLowerCase()}`);
    if (s.type === "domicilio" || (s.type === "grupo" && s.place === "domicilio")) parts.push(b.zones[s.zone]);
  }
  return parts.join(" · ");
}
