// Imprime en JSON las políticas de cada idioma (lo usa scripts/policies-pdf.js).
import { dictionaries } from "../lib/content";
const o: Record<string, unknown> = {};
for (const l of ["es", "en", "fr"] as const) o[l] = dictionaries[l].policies;
console.log(JSON.stringify(o));
