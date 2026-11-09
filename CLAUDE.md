# Terrenas Massage — sitio web

Spa en Las Terrenas, Samaná, R.D. (marca hermana de la clínica Maxilo Aesthetic Implants, mismo edificio, 2.º nivel).

- Repositorio: https://github.com/efectomarketingrd/terrenas-massage (rama `main`)
- Stack: Next.js 16 (App Router), TypeScript, CSS propio en `app/globals.css`, sin librerías de UI.
- Commits con autor `Efecto Marketing <efectomarketingrd@gmail.com>`.

```bash
npm install
npm run dev
npm run build && npx next start -p 3200
```

## Marca (separada de la clínica)

- Colores: turquesa `#219ebc`, blanco frío `#f4f6fc`, azul noche `#050a30`.
- Tipografía: Open Sans (self-hosted con @fontsource). La principal ("MADE A venue Personal Use") es de uso personal: NO cargarla; usar el logo en imagen (`public/brand/`).
- Lema: RELAX YOUR BODY.
- Nada de mensajes médicos. No nombrar la clínica en la web. No incluir a Efecto Marketing (ni equipo ni crédito).

## Reglas de diseño

- Mobile first. Sin scroll horizontal en iPhone SE, iPhone 13 y Pixel 7.
- Animaciones sutiles con alternativa `prefers-reduced-motion`.
- Trabajo sección por sección, con opciones y recomendación antes de decidir.
- `/` redirige al idioma del teléfono (`proxy.ts`); cambio de idioma con `<a>` (recarga completa).

## Datos

- `lib/site.ts` — contacto, WhatsApp 18293710276, horario (todos los días, feriados incluidos, 9:00–19:00; 19:00 es la última hora de inicio).
- `lib/prices.ts` — precios RD$ y US$ (tasa `usdRate`).
- `lib/content.ts` — todos los textos ES/EN.
- A domicilio: solo Las Terrenas y El Limón; resto de la provincia de Samaná solo para grupos grandes bajo solicitud.

## Estado

- Inicio, orden aprobado: 1) Portada · 2) Servicios (diseño A: ritual y grupos a lo ancho) · 3) En el spa o en tu villa (opciones A/B/C en `?lugar=`) · 4) Grupos y eventos · 5) Opiniones de Google · 6) Preguntas frecuentes + cierre · Pie.
- Se quitaron "Elige tu experiencia" y "Elige tu masaje" (repetían la agenda).
- Opiniones reales en `lib/reviews.ts` (4,9 ★, 20 opiniones; perfil https://share.google/vdUnDXdpuNsyRW4Yq). Nunca inventar opiniones.
- Grupos: hasta 8 masajistas a la vez (el cliente elige; sujeto a disponibilidad) y tipo de evento en la agenda.
- Agenda: `/es/reservar` · `/en/book` (`components/BookingWizard.tsx`, días/horas en `lib/agenda.ts`). Envío por WhatsApp y correo (mailto).
- Políticas aprobadas (`lib/content.ts` → `policies`), visibles en la agenda y en `/es/reservar#politicas`.
- Agenda: horas cada 60 min (9:00–19:00); el cliente indica su país (opcional).
- Pie de página (`components/Footer.tsx`) en inicio y reservas.
- Pendiente: duración de los complementos Premium, fotos (se generarán).
