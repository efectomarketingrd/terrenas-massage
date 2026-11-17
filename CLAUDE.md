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
- A domicilio: solo Las Terrenas y El Limón; resto de la provincia de Samaná solo para grupos grandes bajo solicitud. En hoteles, resorts y residenciales el cliente debe avisar antes a la administración (algunos no permiten servicios externos): aparece en spa/villa, preguntas, agenda y políticas.

## Estado

- Inicio, orden aprobado: 1) Portada · 2) Nuestros masajes SIN precios (`components/About.tsx`; diseño B en vivo: selector de 6 servicios + tarjeta animada que pasa sola cada 6 s hasta que el visitante toca uno; `?masajes=a` = acordeón para comparar; se quitó "Por qué elegirnos") · 3) En el spa o en tu villa (pestañas, aprobado) · 4) Grupos y eventos con 3 pasos (`components/Groups.tsx`, aprobado) · 5) Opiniones de Google en cinta animada (`components/Reviews.tsx`, aprobado) · 6) Preguntas frecuentes + cierre en tarjeta (`components/Faq.tsx`, aprobado; incluye datos FAQPage para Google) · Pie. Inicio completo.
- Menú: enlaces a #masajes, #lugar, #grupos, #opiniones, #preguntas. Rutas de idioma desconocidas → 404 (`dynamicParams = false`). Ícono en `app/icon.png`. Imagen para compartir: `public/og.png` (1200×630, logo blanco sobre azul noche).
- Datos para Google: `components/BusinessSchema.tsx` (DaySpa: dirección, teléfono, horario 9–19 todos los días, pagos, zonas, Instagram y perfil de Google). Facebook: https://www.facebook.com/profile.php?id=61576134364193 (en datos de Google y pie). Dominio terrenasmassage.com conectado en Vercel (plan Pro); www y vercel.app redirigen (308) al dominio; `site.url` = https://terrenasmassage.com.
- Sin precios en el inicio (salvo el "desde" de la portada): los precios y selectores viven en la agenda.
- Opiniones reales en `lib/reviews.ts` (4,9 ★, 20 opiniones; perfil https://share.google/vdUnDXdpuNsyRW4Yq). Nunca inventar opiniones.
- Grupos: hasta 8 masajistas a la vez (el cliente elige; sujeto a disponibilidad) y tipo de evento en la agenda.
- Agenda: `/es/reservar` · `/en/book` (`components/BookingWizard.tsx`, días/horas en `lib/agenda.ts`). Envío por WhatsApp y correo (mailto).
- Políticas aprobadas (`lib/content.ts` → `policies`), visibles en la agenda y en `/es/reservar#politicas` como tarjeta desplegable (`components/Policies.tsx`; se abre sola con #politicas).
- Agenda: paso 2 con calendario mensual como la clínica (lunes primero, leyenda disponible/no disponible) + horas cada 60 min (9:00–19:00); la agenda acepta reservas con 30 min de anticipación (`minNotice`) aunque los textos dicen 1 hora, y si es con menos de 1 h el mensaje avisa al spa para confirmar; recuadro azul noche que destaca horario y 1 h de anticipación; el cliente indica su país (opcional).
- Pie de página (`components/Footer.tsx`) en inicio y reservas.
- Con "reducir movimiento" todo lo que entra animado (.js-anim) se muestra sin animación (regla en globals.css); comprobar que no quede nada invisible.
- Pendiente: duración de los complementos Premium, fotos (se generarán).
