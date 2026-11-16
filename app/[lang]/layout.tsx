import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "../globals.css";
import { dictionaries } from "@/lib/content";
import { locales, site, type Locale } from "@/lib/site";

// Solo existen /es y /en: cualquier otra ruta de primer nivel da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#050a30" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) return {};
  const t = dictionaries[lang as Locale];
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: `/${lang}`, languages: { es: "/es", en: "/en", "x-default": "/en" } },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "es" ? "es_DO" : "en_US",
      url: `/${lang}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Terrenas Massage · Relax your body" }],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description, images: ["/og.png"] },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
