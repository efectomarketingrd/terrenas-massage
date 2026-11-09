// Todos los textos ES/EN. Para cambiar un texto, se cambia aquí.
import type { Locale } from "./site";

const es = {
  meta: {
    title: "Terrenas Massage · Spa y masajes en Las Terrenas",
    description:
      "Masajes relajantes, profundos y descontracturantes en Las Terrenas, Samaná. Ritual en pareja, servicio a domicilio y grupos. Abierto todos los días de 9 a. m. a 7 p. m.",
  },
  nav: {
    home: "Inicio",
    massages: "Masajes",
    couple: "Ritual Connection",
    home_service: "A domicilio",
    info: "Información",
    book: "Reservar",
    menu: "Menú",
    close: "Cerrar",
    lang: "English",
    langShort: "EN",
  },
  greet: { morning: "Buenos días", afternoon: "Buenas tardes", evening: "Buenas noches" },
  hero: {
    eyebrow: "Spa · Las Terrenas",
    title: "Un momento solo para ti",
    titleAlt: "Relaja tu cuerpo en Las Terrenas",
    text: "Masajes en cabina, en pareja o en tu villa. Elige tu masaje, mira el precio y reserva en un minuto.",
    book: "Reservar masaje",
    wa: "WhatsApp",
    open: "Abierto todos los días · 9 a. m. – 7 p. m.",
    from: "Desde",
    perPerson: "por persona",
    place: "Las Terrenas y El Limón",
    scroll: "Descubre",
    cardKicker: "Reserva en 4 pasos",
    cardTitle: "Tu masaje, a tu ritmo",
  },
  exp: [
    { k: "individual", t: "Individual", d: "En cabina" },
    { k: "pareja", t: "En pareja", d: "Ritual Connection" },
    { k: "domicilio", t: "A domicilio", d: "Villa u hotel" },
    { k: "grupo", t: "Grupos", d: "Desde 10% menos" },
  ],
  waMsg: "Hola, quiero reservar un masaje en Terrenas Massage.",
};

export type Dict = typeof es;

const en: Dict = {
  meta: {
    title: "Terrenas Massage · Spa & massage in Las Terrenas",
    description:
      "Relaxing, deep tissue and knot-relief massages in Las Terrenas, Samaná. Couples ritual, in-villa massage and groups. Open daily, 9 am to 7 pm.",
  },
  nav: {
    home: "Home",
    massages: "Massages",
    couple: "Ritual Connection",
    home_service: "At your villa",
    info: "Info",
    book: "Book",
    menu: "Menu",
    close: "Close",
    lang: "Español",
    langShort: "ES",
  },
  greet: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
  hero: {
    eyebrow: "Spa · Las Terrenas",
    title: "A moment just for you",
    titleAlt: "Relax your body in Las Terrenas",
    text: "In-room, couples or at your villa. Pick your massage, see the price and book in a minute.",
    book: "Book a massage",
    wa: "WhatsApp",
    open: "Open daily · 9 am – 7 pm",
    from: "From",
    perPerson: "per person",
    place: "Las Terrenas & El Limón",
    scroll: "Discover",
    cardKicker: "Book in 4 steps",
    cardTitle: "Your massage, your pace",
  },
  exp: [
    { k: "individual", t: "Individual", d: "In our room" },
    { k: "pareja", t: "Couples", d: "Ritual Connection" },
    { k: "domicilio", t: "At your villa", d: "Villa or hotel" },
    { k: "grupo", t: "Groups", d: "From 10% off" },
  ],
  waMsg: "Hi, I'd like to book a massage at Terrenas Massage.",
};

export const dictionaries: Record<Locale, Dict> = { es, en };
