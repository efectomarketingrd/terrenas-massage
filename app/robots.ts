import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Todo el sitio se puede rastrear, menos los enlaces personales de reserva (/r/…).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/r/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
