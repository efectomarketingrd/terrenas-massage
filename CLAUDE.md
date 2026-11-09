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

- Inicio aprobado: 1) Portada A (noche completa, logo grande, ondas) · 2) Experiencias (4 tarjetas con precio desde).
- Sección 3 Masajes: opción B (3 tarjetas + Básico/Premium y 60/90). Botones llevan a la agenda con el masaje preseleccionado.
- Agenda: `/es/reservar` · `/en/book` (`components/BookingWizard.tsx`, días/horas en `lib/agenda.ts`). Envío por WhatsApp y correo (mailto).
- Políticas aprobadas (`lib/content.ts` → `policies`), visibles en la agenda y en `/es/reservar#politicas`.
- Agenda: horas cada 60 min (9:00–19:00); el cliente indica su país (opcional).
- Pie de página (`components/Footer.tsx`) en inicio y reservas.
- Pendiente: reestructurar el centro del inicio para no repetir lo que ya hace la agenda.
- Pendiente: duración de los complementos Premium, fotos (se generarán).
