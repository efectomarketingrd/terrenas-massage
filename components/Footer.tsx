import Image from "next/image";
import type { Dict } from "@/lib/content";
import { bookPath, mapsUrl, site, waLink, type Locale } from "@/lib/site";
import { Clock, IgIcon, Mail, Pin, WaIcon } from "./Icons";
import { Waves } from "./Water";

export default function Footer({ t, lang, altHref }: { t: Dict; lang: Locale; altHref?: string }) {
  const f = t.footer;
  const other = lang === "es" ? "en" : "es";
  return (
    <>
      <footer className="ft">
        <Waves cls="waves--top" />
        <div className="wrap ft__grid">
          <div className="ft__brand">
            <Image src="/brand/terrenas-massage-blanco.png" alt="Terrenas Massage · Relax your body" width={824} height={180} sizes="200px" />
            <p>{f.about}</p>
            <div className="ft__social">
              <a href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WaIcon size={20} />
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${site.igHandle}`}>
                <IgIcon size={20} />
              </a>
              <a href={`mailto:${site.email}`} aria-label={site.email}>
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h2 className="ft__h">{f.explore}</h2>
            <ul className="ft__links">
              <li><a href={`/${lang}`}>{t.nav.home}</a></li>
              <li><a href={bookPath(lang)}>{t.nav.book}</a></li>
              <li><a href={`${bookPath(lang)}#politicas`}>{f.policies}</a></li>
              <li><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h2 className="ft__h">{f.contact}</h2>
            <p className="ft__line">
              <Pin /> <a href={mapsUrl} target="_blank" rel="noopener noreferrer">{f.address}</a>
            </p>
            <p className="ft__line">
              <WaIcon size={15} /> <a href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer">{site.phone}</a>
            </p>
            <p className="ft__line">
              <Mail /> <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className="ft__line">
              <IgIcon size={15} /> <a href={site.instagram} target="_blank" rel="noopener noreferrer">{site.igHandle}</a>
            </p>
          </div>

          <div>
            <h2 className="ft__h">{f.hours}</h2>
            <p className="ft__line">
              <Clock /> <span>{f.hoursText}<br /><b>{f.hoursRange}</b><br /><small>{f.hoursNote}</small></span>
            </p>
            <a className="btn btn--teal ft__btn" href={bookPath(lang)}>{t.nav.book}</a>
          </div>
        </div>
        <div className="wrap ft__bottom">
          <span>© {new Date().getFullYear()} {site.name}. {f.rights}</span>
          <a href={altHref ?? `/${other}`} hrefLang={other}>{f.lang}</a>
        </div>
      </footer>

      <a className="wa-float" href={waLink(t.waMsg)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <WaIcon size={26} />
      </a>
    </>
  );
}
