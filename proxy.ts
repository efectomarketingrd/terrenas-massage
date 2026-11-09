import { NextResponse, type NextRequest } from "next/server";

// La dirección principal abre en el idioma del teléfono del visitante (español o inglés).
export function proxy(req: NextRequest) {
  const accept = req.headers.get("accept-language") || "";
  const first = accept.split(",")[0]?.trim().toLowerCase() || "";
  const lang = first.startsWith("es") ? "es" : first ? "en" : "es";
  return NextResponse.redirect(new URL(`/${lang}`, req.url));
}

export const config = { matcher: ["/"] };
