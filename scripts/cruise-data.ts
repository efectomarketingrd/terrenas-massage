// Imprime en JSON los textos y el mapa de la experiencia para cruceristas (lo usa scripts/cruise-pdf.js).
import { cruise, cruiseDocs, cruisePrice, routeOrder, usefulPlaces, mapsSearch } from "../lib/cruise";
import { H, P, PATH, W, proj } from "../lib/cruise-map";
import { slugs } from "../lib/i18n";
console.log(
  JSON.stringify({
    cruise,
    docs: cruiseDocs,
    price: cruisePrice,
    order: routeOrder,
    map: { W, H, P, PATH },
    places: usefulPlaces.map((p) => ({ ...p, xy: proj(p.geo), url: mapsSearch(p.q) })),
    slugs: slugs.cruise,
  }),
);
