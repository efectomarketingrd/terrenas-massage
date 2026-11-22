import { slugs, type Locale } from "./i18n";

/** Dirección de una página de servicio en cada idioma (domicilio · pareja · grupo). */
export const servicePath = (lang: Locale, id: string) => `/${lang}/${slugs[id as "domicilio" | "pareja" | "grupo"][lang]}`;
