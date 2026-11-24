import type { Locale } from "./i18n";

// Experiencia para cruceristas de Port Samaná (Arroyo Barril): masaje + recorrido por Las Terrenas.
// Precios en US$ acordados con Omar el 23 nov 2026. Ruta y precio del taxista pendientes de confirmar con él:
// si cambia el orden de las paradas, se edita `stops` (el mapa y los PDF se arman desde aquí).

export const cruisePrice = { person: 159, couple: 299, deep: 20, long: 25, min: 2, max: 6, deposit: 0.5, spotsPerDay: 8 };

const cdn = "https://d8j0ntlcm91z4.cloudfront.net/user_3LZ8my4o5R9prXx0ZTCU28u6qVU/";
// Ilustraciones provisionales (Higgsfield, acuarela) hasta tener fotos reales de cada parada.
export const stopImg = {
  bonita: `${cdn}hf_20261124_024031_19b04541-6b97-4163-a120-fe7e1830abb7.png`,
  ballenas: `${cdn}hf_20261124_024031_2aacc7ef-f817-4a97-a058-eec521d1312e.png`,
  pescadores: `${cdn}hf_20261124_024031_614070e3-a139-4c2c-b8fa-ff359b5b6ac9.png`,
  popy: `${cdn}hf_20261124_024031_00f8e66d-3879-4e59-a51f-64f993b019ea.png`,
  mirador: `${cdn}hf_20261124_024031_2bc69559-a46b-4eae-8efb-d27a724784f5.png`,
};

export type StopId = "spa" | keyof typeof stopImg;
// Coordenadas aproximadas (el mapa es un esquema, no a escala)
export const stopGeo: Record<StopId, [number, number]> = {
  spa: [19.3045, -69.5488],
  bonita: [19.3165, -69.5725],
  ballenas: [19.3233, -69.5497],
  pescadores: [19.3228, -69.5423],
  popy: [19.3232, -69.5305],
  mirador: [19.2955, -69.5585],
};
export const routeOrder: StopId[] = ["spa", "bonita", "ballenas", "pescadores", "popy", "mirador"];

// Lugares útiles (datos públicos; verificar con el spa antes de imprimir)
export type PlaceKind = "health" | "police" | "pharmacy";
export const usefulPlaces: { kind: PlaceKind; name: string; geo: [number, number]; h24?: boolean; q: string }[] = [
  { kind: "health", name: "Centro Galeno Integral Las Terrenas", geo: [19.3188, -69.5392], h24: true, q: "Centro Galeno Integral Las Terrenas" },
  { kind: "health", name: "Clínica Especializada Internacional Las Terrenas", geo: [19.3077, -69.5474], h24: true, q: "Clinica Especializada Internacional Las Terrenas" },
  { kind: "police", name: "POLITUR (Policía de Turismo)", geo: [19.31, -69.5642], q: "POLITUR Las Terrenas" },
  { kind: "police", name: "Policía Nacional · Las Terrenas", geo: [19.3215, -69.5398], q: "Policia Nacional Las Terrenas" },
  { kind: "pharmacy", name: "Farmacia Carol", geo: [19.3214, -69.5408], h24: true, q: "Farmacia Carol Las Terrenas" },
];
// PDF de la experiencia (public/docs; se generan con scripts/cruise-pdf.js)
export const cruiseDocs: Record<Locale, { flyer: string; stops: string }> = {
  es: { flyer: "/docs/volante-cruceros-terrenas-massage.pdf", stops: "/docs/paradas-recorrido-las-terrenas.pdf" },
  en: { flyer: "/docs/cruise-flyer-terrenas-massage.pdf", stops: "/docs/las-terrenas-tour-stops.pdf" },
  fr: { flyer: "/docs/flyer-croisiere-terrenas-massage.pdf", stops: "/docs/arrets-parcours-las-terrenas.pdf" },
};
export const mapsSearch = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

type Txt = {
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string;
  lead: string;
  chips: string[];
  from: string;
  perPerson: string;
  book: string;
  includesTitle: string;
  includes: string[];
  routeTitle: string;
  routeLead: string;
  layers: { route: string; info: string };
  play: string;
  schematic: string;
  fromPort: string;
  stops: Record<StopId, { t: string; d: string; time: string }>;
  dayTitle: string;
  day: { t: string; h: string; d?: string }[];
  dayNote: string;
  pricesTitle: string;
  prices: { t: string; d: string; v: string }[];
  priceNotes: string[];
  spots: string;
  formTitle: string;
  form: {
    pkg: string;
    pkgs: { person: string; couple: string };
    people: string;
    massage: string;
    massages: { relajante: string; profundo: string; descontracturante: string };
    length: string;
    ship: string;
    shipPh: string;
    date: string;
    arrive: string;
    aboard: string;
    name: string;
    total: string;
    deposit: string;
    send: string;
    err: string;
  };
  safetyTitle: string;
  safetyLead: string;
  safety: { t: string; d: string }[];
  cancelTitle: string;
  cancel: string[];
  infoTitle: string;
  infoLead: string;
  kinds: Record<PlaceKind, string>;
  h24: string;
  emergency: string;
  directions: string;
  downloads: { title: string; flyer: string; stops: string; policies: string };
  faqTitle: string;
  faq: { q: string; a: string }[];
  langNote: string;
  footer: string;
  banner: { tag: string; t: string; cta: string };
  card: { eyebrow: string; title: string; text: string; facts: string[] };
};

export const cruise: Record<Locale, Txt> = {
  es: {
    metaTitle: "Excursión para cruceristas en Samaná: masaje + recorrido por Las Terrenas · Terrenas Massage",
    metaDesc: "Desde Port Samaná (Arroyo Barril): transporte privado, masaje de 60 min, recorrido por las playas de Las Terrenas y regreso garantizado al barco. Desde US$159.",
    eyebrow: "Port Samaná · Arroyo Barril",
    title: "Masaje + recorrido por Las Terrenas para cruceristas",
    lead: "Te recogemos en el puerto, recibes tu masaje y te llevamos por las playas más bonitas de Las Terrenas. Volvemos al barco con tiempo de sobra.",
    chips: ["Regreso garantizado al barco", "Agua fría y snacks gratis", "2 a 6 personas", "≈ 4 horas"],
    from: "Desde",
    perPerson: "por persona",
    book: "Reservar mi experiencia",
    includesTitle: "Qué incluye",
    includes: [
      "Transporte privado ida y vuelta desde Port Samaná (Arroyo Barril), con conductor de confianza",
      "Masaje relajante de 60 minutos en Terrenas Massage",
      "Recorrido por Playa Bonita, Las Ballenas, el Pueblo de los Pescadores y Punta Popy",
      "Parada para fotos en el mirador del Boulevard Turístico del Atlántico",
      "Nevera con agua fría y snacks en el vehículo, cortesía del spa",
      "Regreso al puerto al menos 1 hora antes de la hora límite de embarque",
    ],
    routeTitle: "Tu ruta",
    routeLead: "Toca cada parada para ver qué vas a encontrar. Activa «Información útil» para ver centros médicos, policía y farmacias.",
    layers: { route: "Ruta", info: "Información útil" },
    play: "Ver el recorrido",
    schematic: "Esquema de Las Terrenas, no a escala",
    fromPort: "Desde y hacia Port Samaná · ≈ 46 min",
    stops: {
      spa: { t: "Terrenas Massage", d: "Tu masaje de 60 minutos en nuestra cabina, en el segundo nivel. Al llegar, te recibimos en la recepción de la planta baja.", time: "≈ 70 min" },
      bonita: { t: "Playa Bonita", d: "«La playa bonita», y lo es: arena dorada, palmeras y calma, a pocos kilómetros al oeste del centro.", time: "≈ 10 min" },
      ballenas: { t: "Playa Las Ballenas", d: "Sus tres islotes recuerdan el lomo de las ballenas. Agua tranquila y turquesa gracias a la barrera de coral.", time: "≈ 10 min" },
      pescadores: { t: "Pueblo de los Pescadores", d: "Donde llegaban los botes de los pescadores, hoy una fila de restaurantes y bares de colores frente al mar.", time: "≈ 15 min" },
      popy: { t: "Punta Popy", d: "Un largo tramo de playa con palmas de coco, favorito de los kitesurfistas.", time: "≈ 10 min" },
      mirador: { t: "Mirador del Boulevard", d: "La vista de la costa norte de Samaná: el Atlántico, las montañas y los cocoteros. La última foto, de camino al puerto.", time: "≈ 10 min" },
    },
    dayTitle: "Cómo es tu día",
    day: [
      { t: "0:00", h: "Te recogemos en el puerto", d: "Tu conductor te espera en Port Samaná (Arroyo Barril)." },
      { t: "0:45", h: "Llegada al spa" },
      { t: "0:55", h: "Tu masaje de 60 minutos" },
      { t: "2:00", h: "Recorrido por Las Terrenas", d: "Playa Bonita, Las Ballenas, Pueblo de los Pescadores y Punta Popy." },
      { t: "3:15", h: "Mirador del Boulevard", d: "Última foto, de camino al puerto." },
      { t: "≈ 4:00", h: "De vuelta en el puerto", d: "Al menos 1 hora antes de la hora límite de embarque." },
    ],
    dayNote: "Tiempos aproximados para 2 personas. Con 3 a 6 personas los masajes van por turnos de 2 y el día dura un poco más; si el tiempo se acorta, se omiten paradas, nunca la hora de regreso.",
    pricesTitle: "Precios",
    prices: [
      { t: "Relax & Explore", d: "Masaje relajante 60 min + recorrido + transporte", v: "US$159 por persona" },
      { t: "Ritual Connection para dos", d: "Masaje en pareja, lado a lado + recorrido + transporte", v: "US$299 por pareja" },
      { t: "Masaje profundo o descontracturante", d: "En lugar del relajante", v: "+US$20 por persona" },
      { t: "90 minutos de masaje", d: "Si el horario del barco lo permite", v: "+US$25 por persona" },
    ],
    priceNotes: ["Mínimo 2 personas por reserva, máximo 6 por grupo.", "Se confirma con el 50 % por adelantado; el resto, el día de la experiencia."],
    spots: "Cupos limitados: nuestra cabina recibe 2 personas a la vez.",
    formTitle: "Reserva tu experiencia",
    form: {
      pkg: "Experiencia",
      pkgs: { person: "Relax & Explore (por persona)", couple: "Ritual Connection para dos" },
      people: "Personas",
      massage: "Masaje",
      massages: { relajante: "Relajante", profundo: "Profundo", descontracturante: "Descontracturante" },
      length: "Duración",
      ship: "Barco",
      shipPh: "Ej.: MSC Opera",
      date: "Fecha de la escala",
      arrive: "Hora de llegada del barco",
      aboard: "Hora límite para volver a bordo",
      name: "Nombre y apellido",
      total: "Total estimado",
      deposit: "Anticipo (50 %)",
      send: "Enviar por WhatsApp",
      err: "Completa los campos marcados.",
    },
    safetyTitle: "Seguridad y tranquilidad",
    safetyLead: "Estás de visita por pocas horas: nos ocupamos de que todo salga bien.",
    safety: [
      { t: "Regreso garantizado", d: "Te dejamos en el puerto al menos 1 hora antes de la hora límite de embarque. Si hace falta, se acorta el recorrido, nunca el margen de regreso." },
      { t: "Conductor de confianza", d: "Un solo conductor te acompaña todo el día: te recoge, te espera durante el masaje y te lleva de vuelta." },
      { t: "Siempre comunicados", d: "Tienes nuestro WhatsApp durante toda la experiencia para cualquier cambio o imprevisto." },
      { t: "Hidratación", d: "Agua fría y snacks en el vehículo. Usa protector solar y ropa ligera." },
    ],
    cancelTitle: "Cancelaciones y cambios",
    cancel: [
      "Si cancelas con 48 horas o más de anticipación, te devolvemos el anticipo.",
      "Con menos de 48 horas, el anticipo no es reembolsable.",
      "Si tu barco no llega a Port Samaná o la naviera cambia la escala, te devolvemos el anticipo completo.",
      "Si el barco llega con retraso, adaptamos el recorrido; si no hay tiempo seguro para el masaje y el regreso, te devolvemos el anticipo.",
    ],
    infoTitle: "Información útil en Las Terrenas",
    infoLead: "Para cualquier emergencia, marca 9-1-1 (gratis). Estos son los centros médicos, la policía y una farmacia 24 horas en Las Terrenas:",
    kinds: { health: "Centro médico", police: "Policía", pharmacy: "Farmacia" },
    h24: "24 horas",
    emergency: "Emergencias: 9-1-1",
    directions: "Cómo llegar",
    downloads: { title: "Descargas", flyer: "Volante de la experiencia (PDF)", stops: "Paradas del recorrido (PDF)", policies: "Políticas del spa (PDF)" },
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Y si mi barco llega tarde?", a: "Escríbenos por WhatsApp. Adaptamos el recorrido para que vuelvas a tiempo; si no hay tiempo seguro para el masaje y el regreso, te devolvemos el anticipo." },
      { q: "¿Cuánto tarda el viaje desde el puerto?", a: "Unos 46 minutos desde Port Samaná (Arroyo Barril) hasta el spa en Las Terrenas." },
      { q: "¿Qué debo llevar?", a: "Ropa cómoda, protector solar y tu identificación del barco. Nosotros ponemos el agua fría y los snacks." },
      { q: "¿Cómo se paga?", a: "El 50 % al reservar (transferencia, Remitly o enlace de pago) y el resto el día de la experiencia, en efectivo (US$, € o RD$) o con tarjeta." },
      { q: "¿Pueden venir niños?", a: "El masaje es para adultos. Escríbenos si viajas en familia y vemos la mejor opción." },
    ],
    langNote: "",
    footer: "Para cruceristas",
    card: { eyebrow: "Nuevo · Port Samaná", title: "¿Llegas en crucero?", text: "Masaje + recorrido por las playas de Las Terrenas, con transporte desde el puerto y regreso garantizado al barco.", facts: ["≈ 4 h", "2–6 personas", "Agua y snacks gratis"] },
    banner: { tag: "Nuevo", t: "¿Llegas en crucero a Samaná? Masaje + recorrido por Las Terrenas, con regreso garantizado al barco.", cta: "Ver la experiencia" },
  },
  en: {
    metaTitle: "Samaná cruise excursion: massage + Las Terrenas beach tour · Terrenas Massage",
    metaDesc: "From Port Samaná (Arroyo Barril): private transport, 60-min massage, a tour of Las Terrenas' beaches and guaranteed return to your ship. From US$159.",
    eyebrow: "Port Samaná · Arroyo Barril",
    title: "Massage + Las Terrenas beach tour for cruise guests",
    lead: "We pick you up at the port, you enjoy your massage, and we drive you along the most beautiful beaches of Las Terrenas. Back on board with plenty of time to spare.",
    chips: ["Guaranteed return to your ship", "Free cold water & snacks", "2 to 6 guests", "≈ 4 hours"],
    from: "From",
    perPerson: "per person",
    book: "Book my experience",
    includesTitle: "What's included",
    includes: [
      "Private round-trip transport from Port Samaná (Arroyo Barril) with a trusted driver",
      "60-minute relaxing massage at Terrenas Massage",
      "Tour of Playa Bonita, Las Ballenas, the Fishermen's Village and Punta Popy",
      "Photo stop at the Atlantic Tourist Boulevard lookout",
      "Cooler with cold water and snacks in the car, on the spa",
      "Back at the port at least 1 hour before all-aboard time",
    ],
    routeTitle: "Your route",
    routeLead: "Tap each stop to see what you'll find. Turn on “Useful info” to see clinics, police and pharmacies.",
    layers: { route: "Route", info: "Useful info" },
    play: "Play the route",
    schematic: "Schematic map of Las Terrenas, not to scale",
    fromPort: "To and from Port Samaná · ≈ 46 min",
    stops: {
      spa: { t: "Terrenas Massage", d: "Your 60-minute massage in our cabin on the second floor. We welcome you at the ground-floor reception.", time: "≈ 70 min" },
      bonita: { t: "Playa Bonita", d: "“The pretty beach” — and it is: golden sand, palm trees and calm, a few kilometers west of town.", time: "≈ 10 min" },
      ballenas: { t: "Playa Las Ballenas", d: "Its three islets look like the backs of whales. Calm turquoise water thanks to the coral reef.", time: "≈ 10 min" },
      pescadores: { t: "Fishermen's Village", d: "Where the fishing boats used to land — now a row of colorful restaurants and bars on the beach.", time: "≈ 15 min" },
      popy: { t: "Punta Popy", d: "A long stretch of beach lined with coconut palms, a favorite of kitesurfers.", time: "≈ 10 min" },
      mirador: { t: "Boulevard Lookout", d: "Views over Samaná's north coast: the Atlantic, the mountains and the palm groves. Your last photo, on the way to the port.", time: "≈ 10 min" },
    },
    dayTitle: "Your day",
    day: [
      { t: "0:00", h: "Pick-up at the port", d: "Your driver meets you at Port Samaná (Arroyo Barril)." },
      { t: "0:45", h: "Arrival at the spa" },
      { t: "0:55", h: "Your 60-minute massage" },
      { t: "2:00", h: "Las Terrenas tour", d: "Playa Bonita, Las Ballenas, Fishermen's Village and Punta Popy." },
      { t: "3:15", h: "Boulevard lookout", d: "Last photo, on the way to the port." },
      { t: "≈ 4:00", h: "Back at the port", d: "At least 1 hour before all-aboard time." },
    ],
    dayNote: "Approximate times for 2 guests. With 3 to 6 guests, massages run in turns of 2 and the day takes a little longer; if time runs short, we skip stops — never the return margin.",
    pricesTitle: "Prices",
    prices: [
      { t: "Relax & Explore", d: "60-min relaxing massage + tour + transport", v: "US$159 per person" },
      { t: "Ritual Connection for two", d: "Side-by-side couples massage + tour + transport", v: "US$299 per couple" },
      { t: "Deep tissue or knot-release massage", d: "Instead of relaxing", v: "+US$20 per person" },
      { t: "90-minute massage", d: "If your ship's schedule allows", v: "+US$25 per person" },
    ],
    priceNotes: ["Minimum 2 guests per booking, maximum 6 per group.", "Confirmed with a 50% deposit; the rest is paid on the day."],
    spots: "Limited spots: our cabin welcomes 2 guests at a time.",
    formTitle: "Book your experience",
    form: {
      pkg: "Experience",
      pkgs: { person: "Relax & Explore (per person)", couple: "Ritual Connection for two" },
      people: "Guests",
      massage: "Massage",
      massages: { relajante: "Relaxing", profundo: "Deep tissue", descontracturante: "Knot release" },
      length: "Length",
      ship: "Ship",
      shipPh: "e.g. MSC Opera",
      date: "Port day",
      arrive: "Ship arrival time",
      aboard: "All-aboard time",
      name: "Full name",
      total: "Estimated total",
      deposit: "Deposit (50%)",
      send: "Send on WhatsApp",
      err: "Please fill in the marked fields.",
    },
    safetyTitle: "Safety & peace of mind",
    safetyLead: "You're only here for a few hours — we make sure everything goes smoothly.",
    safety: [
      { t: "Guaranteed return", d: "We drop you at the port at least 1 hour before all-aboard time. If needed, we shorten the tour — never the return margin." },
      { t: "Trusted driver", d: "One driver stays with you all day: picks you up, waits during your massage and takes you back." },
      { t: "Always in touch", d: "You have our WhatsApp throughout the experience for any change or unexpected event." },
      { t: "Stay hydrated", d: "Cold water and snacks in the car. Wear sunscreen and light clothing." },
    ],
    cancelTitle: "Cancellations & changes",
    cancel: [
      "Cancel 48 hours or more ahead and we refund your deposit.",
      "With less than 48 hours' notice, the deposit is non-refundable.",
      "If your ship doesn't call at Port Samaná or the cruise line changes the itinerary, we refund your full deposit.",
      "If your ship arrives late, we adapt the tour; if there isn't safe time for the massage and the return, we refund your deposit.",
    ],
    infoTitle: "Useful info in Las Terrenas",
    infoLead: "For any emergency, dial 9-1-1 (free). These are the medical centers, police and a 24-hour pharmacy in Las Terrenas:",
    kinds: { health: "Medical center", police: "Police", pharmacy: "Pharmacy" },
    h24: "24 hours",
    emergency: "Emergencies: 9-1-1",
    directions: "Directions",
    downloads: { title: "Downloads", flyer: "Experience flyer (PDF)", stops: "Tour stops (PDF)", policies: "Spa policies (PDF)" },
    faqTitle: "FAQ",
    faq: [
      { q: "What if my ship arrives late?", a: "Message us on WhatsApp. We adapt the tour so you're back on time; if there isn't safe time for the massage and the return, we refund your deposit." },
      { q: "How long is the drive from the port?", a: "About 46 minutes from Port Samaná (Arroyo Barril) to the spa in Las Terrenas." },
      { q: "What should I bring?", a: "Comfortable clothes, sunscreen and your ship ID card. We provide the cold water and snacks." },
      { q: "How do I pay?", a: "50% when booking (bank transfer, Remitly or payment link) and the rest on the day, in cash (US$, € or RD$) or by card." },
      { q: "Can children come?", a: "The massage is for adults. Message us if you're traveling as a family and we'll find the best option." },
    ],
    langNote: "(I speak English)",
    footer: "Cruise guests",
    card: { eyebrow: "New · Port Samaná", title: "Arriving by cruise ship?", text: "Massage + a tour of Las Terrenas' beaches, with transport from the port and guaranteed return to your ship.", facts: ["≈ 4 h", "2–6 guests", "Free water & snacks"] },
    banner: { tag: "New", t: "Arriving by cruise ship in Samaná? Massage + Las Terrenas beach tour, with guaranteed return to your ship.", cta: "See the experience" },
  },
  fr: {
    metaTitle: "Excursion croisière à Samaná : massage + tour de Las Terrenas · Terrenas Massage",
    metaDesc: "Depuis Port Samaná (Arroyo Barril) : transport privé, massage de 60 min, tour des plages de Las Terrenas et retour garanti au bateau. À partir de 159 US$.",
    eyebrow: "Port Samaná · Arroyo Barril",
    title: "Massage + tour de Las Terrenas pour croisiéristes",
    lead: "Nous venons vous chercher au port, vous profitez de votre massage, puis nous vous emmenons sur les plus belles plages de Las Terrenas. Retour à bord avec une belle marge.",
    chips: ["Retour garanti au bateau", "Eau fraîche et snacks offerts", "2 à 6 personnes", "≈ 4 heures"],
    from: "À partir de",
    perPerson: "par personne",
    book: "Réserver mon expérience",
    includesTitle: "Ce qui est inclus",
    includes: [
      "Transport privé aller-retour depuis Port Samaná (Arroyo Barril) avec un chauffeur de confiance",
      "Massage relaxant de 60 minutes chez Terrenas Massage",
      "Tour de Playa Bonita, Las Ballenas, le Village des Pêcheurs et Punta Popy",
      "Arrêt photo au belvédère du Boulevard Touristique de l'Atlantique",
      "Glacière avec eau fraîche et snacks dans le véhicule, offerte par le spa",
      "Retour au port au moins 1 heure avant l'heure limite d'embarquement",
    ],
    routeTitle: "Votre itinéraire",
    routeLead: "Touchez chaque arrêt pour découvrir ce qui vous attend. Activez « Infos utiles » pour voir les centres médicaux, la police et les pharmacies.",
    layers: { route: "Itinéraire", info: "Infos utiles" },
    play: "Voir le parcours",
    schematic: "Plan schématique de Las Terrenas, pas à l'échelle",
    fromPort: "Depuis et vers Port Samaná · ≈ 46 min",
    stops: {
      spa: { t: "Terrenas Massage", d: "Votre massage de 60 minutes dans notre cabine, au deuxième étage. Nous vous accueillons à la réception du rez-de-chaussée.", time: "≈ 70 min" },
      bonita: { t: "Playa Bonita", d: "La « jolie plage », et elle l'est : sable doré, palmiers et calme, à quelques kilomètres à l'ouest du centre.", time: "≈ 10 min" },
      ballenas: { t: "Playa Las Ballenas", d: "Ses trois îlots rappellent le dos des baleines. Eau calme et turquoise grâce à la barrière de corail.", time: "≈ 10 min" },
      pescadores: { t: "Village des Pêcheurs", d: "Là où accostaient les barques des pêcheurs, aujourd'hui une rangée de restaurants et de bars colorés face à la mer.", time: "≈ 15 min" },
      popy: { t: "Punta Popy", d: "Une longue plage bordée de cocotiers, la préférée des kitesurfeurs.", time: "≈ 10 min" },
      mirador: { t: "Belvédère du Boulevard", d: "La vue sur la côte nord de Samaná : l'Atlantique, les montagnes et les cocotiers. La dernière photo, en route vers le port.", time: "≈ 10 min" },
    },
    dayTitle: "Votre journée",
    day: [
      { t: "0 h 00", h: "Prise en charge au port", d: "Votre chauffeur vous attend à Port Samaná (Arroyo Barril)." },
      { t: "0 h 45", h: "Arrivée au spa" },
      { t: "0 h 55", h: "Votre massage de 60 minutes" },
      { t: "2 h 00", h: "Tour de Las Terrenas", d: "Playa Bonita, Las Ballenas, Village des Pêcheurs et Punta Popy." },
      { t: "3 h 15", h: "Belvédère du Boulevard", d: "Dernière photo, en route vers le port." },
      { t: "≈ 4 h 00", h: "Retour au port", d: "Au moins 1 heure avant l'heure limite d'embarquement." },
    ],
    dayNote: "Horaires approximatifs pour 2 personnes. De 3 à 6 personnes, les massages se font par tours de 2 et la journée est un peu plus longue ; si le temps manque, nous supprimons des arrêts, jamais la marge de retour.",
    pricesTitle: "Tarifs",
    prices: [
      { t: "Relax & Explore", d: "Massage relaxant 60 min + tour + transport", v: "159 US$ par personne" },
      { t: "Ritual Connection à deux", d: "Massage en duo côte à côte + tour + transport", v: "299 US$ par couple" },
      { t: "Massage profond ou décontractant", d: "À la place du relaxant", v: "+20 US$ par personne" },
      { t: "Massage de 90 minutes", d: "Si l'horaire du bateau le permet", v: "+25 US$ par personne" },
    ],
    priceNotes: ["Minimum 2 personnes par réservation, maximum 6 par groupe.", "Confirmé avec un acompte de 50 % ; le reste le jour de l'expérience."],
    spots: "Places limitées : notre cabine accueille 2 personnes à la fois.",
    formTitle: "Réservez votre expérience",
    form: {
      pkg: "Expérience",
      pkgs: { person: "Relax & Explore (par personne)", couple: "Ritual Connection à deux" },
      people: "Personnes",
      massage: "Massage",
      massages: { relajante: "Relaxant", profundo: "Profond", descontracturante: "Décontractant" },
      length: "Durée",
      ship: "Bateau",
      shipPh: "Ex. : MSC Opera",
      date: "Date de l'escale",
      arrive: "Heure d'arrivée du bateau",
      aboard: "Heure limite d'embarquement",
      name: "Nom et prénom",
      total: "Total estimé",
      deposit: "Acompte (50 %)",
      send: "Envoyer par WhatsApp",
      err: "Veuillez remplir les champs indiqués.",
    },
    safetyTitle: "Sécurité et sérénité",
    safetyLead: "Vous n'êtes là que pour quelques heures : nous veillons à ce que tout se passe bien.",
    safety: [
      { t: "Retour garanti", d: "Nous vous déposons au port au moins 1 heure avant l'heure limite d'embarquement. Si nécessaire, nous raccourcissons le tour, jamais la marge de retour." },
      { t: "Chauffeur de confiance", d: "Un seul chauffeur vous accompagne toute la journée : il vous prend en charge, vous attend pendant le massage et vous ramène." },
      { t: "Toujours joignables", d: "Vous avez notre WhatsApp pendant toute l'expérience pour tout changement ou imprévu." },
      { t: "Hydratation", d: "Eau fraîche et snacks dans le véhicule. Pensez à la crème solaire et à des vêtements légers." },
    ],
    cancelTitle: "Annulations et modifications",
    cancel: [
      "Si vous annulez 48 heures ou plus à l'avance, nous remboursons l'acompte.",
      "À moins de 48 heures, l'acompte n'est pas remboursable.",
      "Si votre bateau ne fait pas escale à Port Samaná ou si la compagnie modifie l'itinéraire, nous remboursons l'acompte en totalité.",
      "Si le bateau arrive en retard, nous adaptons le tour ; s'il n'y a pas assez de temps pour le massage et le retour en toute sécurité, nous remboursons l'acompte.",
    ],
    infoTitle: "Infos utiles à Las Terrenas",
    infoLead: "En cas d'urgence, composez le 9-1-1 (gratuit). Voici les centres médicaux, la police et une pharmacie ouverte 24 h/24 à Las Terrenas :",
    kinds: { health: "Centre médical", police: "Police", pharmacy: "Pharmacie" },
    h24: "24 h/24",
    emergency: "Urgences : 9-1-1",
    directions: "Itinéraire",
    downloads: { title: "Téléchargements", flyer: "Flyer de l'expérience (PDF)", stops: "Arrêts du parcours (PDF)", policies: "Conditions du spa (PDF)" },
    faqTitle: "Questions fréquentes",
    faq: [
      { q: "Et si mon bateau arrive en retard ?", a: "Écrivez-nous sur WhatsApp. Nous adaptons le tour pour que vous rentriez à l'heure ; s'il n'y a pas assez de temps pour le massage et le retour, nous remboursons l'acompte." },
      { q: "Combien de temps dure le trajet depuis le port ?", a: "Environ 46 minutes de Port Samaná (Arroyo Barril) jusqu'au spa à Las Terrenas." },
      { q: "Que dois-je apporter ?", a: "Des vêtements confortables, de la crème solaire et votre carte de bord. Nous fournissons l'eau fraîche et les snacks." },
      { q: "Comment payer ?", a: "50 % à la réservation (virement, Remitly ou lien de paiement) et le reste le jour même, en espèces (US$, € ou RD$) ou par carte." },
      { q: "Les enfants peuvent-ils venir ?", a: "Le massage est réservé aux adultes. Écrivez-nous si vous voyagez en famille et nous trouverons la meilleure option." },
    ],
    langNote: "(Hablo francés)",
    footer: "Croisiéristes",
    card: { eyebrow: "Nouveau · Port Samaná", title: "Vous arrivez en croisière ?", text: "Massage + tour des plages de Las Terrenas, avec transport depuis le port et retour garanti au bateau.", facts: ["≈ 4 h", "2 à 6 personnes", "Eau et snacks offerts"] },
    banner: { tag: "Nouveau", t: "Vous arrivez en croisière à Samaná ? Massage + tour de Las Terrenas, retour au bateau garanti.", cta: "Voir l'expérience" },
  },
};

/** Total estimado en US$ según la experiencia elegida. */
export function cruiseTotal(pkg: "person" | "couple", people: number, massage: string, min: 60 | 90) {
  const n = pkg === "couple" ? 2 : people;
  const base = pkg === "couple" ? cruisePrice.couple : cruisePrice.person * n;
  const extra = (massage !== "relajante" ? cruisePrice.deep : 0) + (min === 90 ? cruisePrice.long : 0);
  return base + extra * n;
}
