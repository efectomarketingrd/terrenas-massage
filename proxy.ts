import { NextResponse, type NextRequest } from "next/server";

// La dirección principal abre en el idioma del teléfono del visitante (español o inglés).
export function proxy(req: NextRequest) {
  // El verificador de Search Console y el lector de íconos de Google leen la portada sin seguir la redirección: se les muestra /es directamente.
  if (/Google-Site-Verification|Google-Favicon|GoogleOther/i.test(req.headers.get("user-agent") || "")) {
    return NextResponse.rewrite(new URL("/es", req.url));
  }
  const accept = req.headers.get("accept-language") || "";
  const first = accept.split(",")[0]?.trim().toLowerCase() || "";
  const lang = first.startsWith("es") ? "es" : first.startsWith("fr") ? "fr" : first ? "en" : "es";
  return NextResponse.redirect(new URL(`/${lang}`, req.url));
}

export const config = { matcher: ["/"] };
