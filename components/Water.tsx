// Elementos de agua de la marca: ondas inferiores y ondas circulares.
export function Waves({ cls = "", edge = false }: { cls?: string; edge?: boolean }) {
  return (
    <svg className={`waves ${cls}`} viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
      <path className="wave wave--1" d="M-40 70 C 40 50, 120 92, 200 70 S 360 48, 440 70 L 440 120 L -40 120 Z" />
      <path className="wave wave--2" d="M-40 84 C 50 68, 130 104, 210 86 S 370 70, 440 88 L 440 120 L -40 120 Z" />
      <path className="wave wave--3" d="M-40 98 C 60 88, 140 112, 220 100 S 380 90, 440 102 L 440 120 L -40 120 Z" />
      {/* Borde final del color de la sección siguiente, para una transición suave */}
      {edge && <path className="wave wave--edge" d="M0 110 C 100 102, 200 118, 300 108 S 380 104, 400 108 L 400 121 L 0 121 Z" />}
    </svg>
  );
}

export function Ripples({ cls = "" }: { cls?: string }) {
  return (
    <span className={`ripples ${cls}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
