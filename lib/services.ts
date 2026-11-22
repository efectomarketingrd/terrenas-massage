import { dictionaries } from "./content";
import type { Locale } from "./site";

/** Dirección de una página de servicio en cada idioma (domicilio · pareja · grupo). */
export const servicePath = (lang: Locale, id: string) =>
  `/${lang}/${dictionaries[lang].services.items.find((s) => s.id === id)?.slug ?? ""}`;
