type P = { size?: number };

export function WaIcon({ size = 18 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="ic-fill">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm5.8 14.03c-.24.68-1.42 1.31-1.95 1.36-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.11-1.48-1.11-2.82 0-1.35.7-2.01.96-2.28.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.23.54.77 1.87.84 2.01.07.13.11.29.02.47-.09.18-.13.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.88.27.13.45.2.51.31.07.11.07.65-.17 1.33Z" />
    </svg>
  );
}

export function IgIcon({ size = 18 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="ic-line">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" />
    </svg>
  );
}

export function Arrow({ size = 16 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="ic-line">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Clock({ size = 15 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="ic-line">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function Pin({ size = 15 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="ic-line">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

// Iconos de las 4 experiencias
export function ExpIcon({ k, size = 26 }: { k: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className="ic-line">
      {k === "individual" && (
        <>
          <circle cx="16" cy="9" r="3.6" />
          <path d="M4 22.5h24M7 22.5c0-3.4 4-5.6 9-5.6s9 2.2 9 5.6M6 26h20" />
        </>
      )}
      {k === "pareja" && (
        <>
          <circle cx="11" cy="10" r="3.2" />
          <circle cx="21" cy="10" r="3.2" />
          <path d="M4.5 24c0-4 3-6.5 6.5-6.5 2 0 3.7.8 5 2.1 1.3-1.3 3-2.1 5-2.1 3.5 0 6.5 2.5 6.5 6.5" />
        </>
      )}
      {k === "domicilio" && (
        <>
          <path d="M5 15 16 6l11 9" />
          <path d="M8 13.5V26h16V13.5" />
          <path d="M13 26v-6.5h6V26" />
        </>
      )}
      {k === "grupo" && (
        <>
          <circle cx="16" cy="9.5" r="3" />
          <circle cx="7.5" cy="12.5" r="2.5" />
          <circle cx="24.5" cy="12.5" r="2.5" />
          <path d="M10 25c0-3.6 2.7-6 6-6s6 2.4 6 6M2.5 24c0-2.8 2-4.6 5-4.6M29.5 24c0-2.8-2-4.6-5-4.6" />
        </>
      )}
    </svg>
  );
}
