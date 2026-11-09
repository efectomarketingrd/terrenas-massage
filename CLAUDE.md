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
- Sección 3 Masajes: 3 opciones en vista previa (`/es?masajes=a|b|c`), pendiente elegir. Botones de reservar van a WhatsApp hasta que exista la agenda.
- Pendiente: duración de los complementos Premium, aprobar política de cancelación, fotos (se generarán).
