// Geometría del mapa esquemático de Las Terrenas (página de cruceristas y PDF de paradas).
import { routeOrder, stopGeo, type StopId } from "./cruise";

export const W = 360;
export const H = 260;
const LON0 = -69.585;
const LON1 = -69.52;
const LAT0 = 19.288;
const LAT1 = 19.332;
export const proj = ([lat, lon]: [number, number]) => [((lon - LON0) / (LON1 - LON0)) * W, ((LAT1 - lat) / (LAT1 - LAT0)) * H] as const;

export const P = Object.fromEntries(routeOrder.map((id) => [id, proj(stopGeo[id])])) as Record<StopId, readonly [number, number]>;
const ENTRY: [number, number] = [196, 262];
const EXIT: [number, number] = [118, 262];
const VIA: [number, number] = [262, 132]; // regreso por el interior hacia el boulevard

// Ruta: puerto → spa → Playa Bonita → Las Ballenas → Pescadores → Punta Popy → mirador → puerto
const q = (a: readonly [number, number], b: readonly [number, number], bend = 0.18) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return `Q${(mx - dy * bend).toFixed(1)},${(my + dx * bend).toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
};
export const PATH = [
  `M${ENTRY[0]},${ENTRY[1]}`,
  q(ENTRY, P.spa, 0.1),
  q(P.spa, P.bonita, 0.12),
  q(P.bonita, P.ballenas, 0.15),
  q(P.ballenas, P.pescadores, 0.2),
  q(P.pescadores, P.popy, 0.15),
  q(P.popy, VIA, -0.1),
  q(VIA, P.mirador, -0.12),
  q(P.mirador, EXIT, 0.1),
].join(" ");

