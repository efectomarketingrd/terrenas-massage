import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionaries } from "@/lib/content";
import { bookPath, locales, type Locale } from "@/lib/site";
import Header from "@/components/Header";
import BookingWizard from "@/components/BookingWizard";
import { Ripples } from "@/components/Water";
import Footer from "@/components/Footer";
import Policies from "@/components/Policies";
import { alternates } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) return {};
  const t = dictionaries[lang as Locale];
  return {
    title: t.booking.metaTitle,
    description: t.booking.lead,
    alternates: { canonical: bookPath(lang as Locale), languages: alternates((l) => bookPath(l)) },
  };
}

export default async function BookPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang } = await params;
  const sp = await searchParams;
  const query = Object.fromEntries(Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string"));
  if (!locales.includes(lang as Locale)) notFound();
  const t = dictionaries[lang as Locale];
  return (
    <main className="bkp">
      <div className="bkp__top">
        <Header t={t} lang={lang as Locale} tone="dark" alts={alternates((l) => bookPath(l))} />
        <Ripples />
        <div className="wrap bkp__head rise">
          <p className="eyebrow">{t.booking.eyebrow}</p>
          <h1 className="bkp__title">{t.booking.title}</h1>
          <p className="bkp__lead">{t.booking.lead}</p>
        </div>
      </div>
      <div className="wrap">
        <BookingWizard t={t} lang={lang as Locale} msgT={lang === "fr" ? dictionaries.es : undefined} query={query} />
        <Policies t={t} />
      </div>
      <Footer t={t} lang={lang as Locale} alts={alternates((l) => bookPath(l))} />
    </main>
  );
}
