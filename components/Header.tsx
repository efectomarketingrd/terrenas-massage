"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/site";

export default function Header({ t, lang, tone = "dark", logo = true }: { t: Dict; lang: Locale; tone?: "dark" | "light"; logo?: boolean }) {
  const [open, setOpen] = useState(false);
  const other = lang === "es" ? "en" : "es";
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const links = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}#masajes`, label: t.nav.massages },
    { href: `/${lang}#pareja`, label: t.nav.couple },
    { href: `/${lang}#domicilio`, label: t.nav.home_service },
    { href: `/${lang}#info`, label: t.nav.info },
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
        <a className="hd__lang" href={`/${other}`} hrefLang={other} aria-label={t.nav.lang}>
          {t.nav.langShort}
        </a>
        <button type="button" className="hd__burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>
          <span className="sr">{t.nav.menu}</span>
          <i />
          <i />
        </button>
      </div>
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
        <a className="btn btn--teal menu__book" href={`/${lang}#reservar`} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          {t.nav.book}
        </a>
      </div>
    </header>
  );
}
