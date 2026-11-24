"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Dict } from "@/lib/content";
import { bookPath, type Locale } from "@/lib/site";
import { langNames, locales, slugs } from "@/lib/i18n";

export default function Header({ t, lang, tone = "dark", logo = true, alts }: { t: Dict; lang: Locale; tone?: "dark" | "light"; logo?: boolean; alts?: Partial<Record<Locale, string>> }) {
  const [open, setOpen] = useState(false);
  // El menú se dibuja directamente en <body>: dentro de la cabecera, algunos navegadores
  // del iPhone (p. ej. el de WhatsApp) lo recortaban al tamaño de la portada.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const others = locales.filter((l) => l !== lang);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const links = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}#masajes`, label: t.nav.massages },
    { href: `/${lang}#lugar`, label: t.nav.places },
    { href: `/${lang}#grupos`, label: t.nav.groups },
    { href: `/${lang}#opiniones`, label: t.nav.reviews },
    { href: `/${lang}#ubicacion`, label: t.nav.location },
    { href: `/${lang}#preguntas`, label: t.nav.faq },
    { href: `/${lang}/${slugs.pay[lang]}`, label: t.nav.pay },
  ];
  return (
    <header className={`hd hd--${tone} ${logo ? "" : "hd--nologo"}`}>
      <Link href={`/${lang}`} className="hd__logo" aria-label="Terrenas Massage">
        <Image
          src={tone === "dark" ? "/brand/terrenas-massage-blanco.png" : "/brand/terrenas-massage-turquesa.png"}
          alt="Terrenas Massage"
          width={824}
          height={180}
          priority
          sizes="150px"
        />
      </Link>
      <div className="hd__right">
        {/* Enlace normal (recarga completa) para que el otro idioma abra arriba */}
        {others.map((l) => (
          <a key={l} className="hd__lang" href={alts?.[l] ?? `/${l}`} hrefLang={l} lang={l} aria-label={`${l.toUpperCase()} · ${langNames[l]}`}>
            {l.toUpperCase()}
          </a>
        ))}
        <button type="button" className="hd__burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>
          <span className="sr">{t.nav.menu}</span>
          <i />
          <i />
        </button>
      </div>
      {mounted && createPortal(
      <div id="menu" className={`menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button type="button" className="menu__close" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
          {t.nav.close} ✕
        </button>
        <nav>
          {links.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ "--i": i } as React.CSSProperties} tabIndex={open ? 0 : -1}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--teal menu__book" href={bookPath(lang)} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          {t.nav.book}
        </a>
      </div>,
        document.body,
      )}
    </header>
  );
}
