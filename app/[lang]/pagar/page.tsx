import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionaries } from "@/lib/content";
import { bookPath, locales, waLink, type Locale } from "@/lib/site";
import { fmtTime } from "@/lib/agenda";
import { fmtRd, fmtUsd } from "@/lib/prices";
import { payments, payPath } from "@/lib/payments";
import { readReserva } from "@/lib/reserva";
import { serviceLabel } from "@/lib/service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyBtn from "@/components/CopyBtn";
import { Ripples } from "@/components/Water";
import { Arrow, WaIcon } from "@/components/Icons";

// "Paga tu masaje": con ?c=<código> muestra la reserva del cliente; sin código, las formas de pago.
export async function generateMetadata({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ c?: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const { c } = await searchParams;
  if (!locales.includes(lang as Locale)) return {};
  const t = dictionaries[lang as Locale];
  return {
    title: t.pay.metaTitle,
    description: t.pay.lead,
    alternates: { canonical: payPath(lang as Locale), languages: { es: payPath("es"), en: payPath("en") } },
    // la página personal no se indexa
    robots: c ? { index: false, follow: false } : undefined,
  };
}

export default async function PayPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ c?: string }> }) {
  const { lang: l } = await params;
  if (!locales.includes(l as Locale)) notFound();
  const lang = l as Locale;
  const t = dictionaries[lang];
  const p = t.pay;
  const code = (await searchParams).c ?? "";
  const r = code ? readReserva(code) : null;

  const loc = lang === "es" ? "es-DO" : "en-US";
  const day = r
    ? (() => {
        const [y, m, d] = r.d.split("-").map(Number);
        const s = new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
        return s.charAt(0).toUpperCase() + s.slice(1);
      })()
    : "";
  const amount = r ? (r.due > 0 ? r.due : r.t) : 0;
  const svc = r ? serviceLabel(t, r.sel, true) : "";
  const dom = r ? r.sel.type === "domicilio" || (r.sel.type === "grupo" && r.sel.place === "domicilio") : false;
  const proofText = r
    ? `${p.proofMsg}\n\n${p.name}: ${r.n}\n${p.service}: ${svc}\n${p.when}: ${day}, ${fmtTime(r.h, lang)}\n${r.due > 0 ? p.dueNow : p.total}: ${fmtRd(amount)} (${fmtUsd(amount)})`
    : p.proofMsg;
  const other = lang === "es" ? "en" : "es";

  const methods = [
    { k: "cash", show: true },
    { k: "remitly", show: !!payments.remitly },
    { k: "card", show: !!payments.cardLink },
    { k: "bank", show: true },
  ].filter((m) => m.show);

  return (
    <main className="bkp pay">
      <div className="bkp__top">
        <Header t={t} lang={lang} tone="dark" altHref={payPath(other, code)} />
        <Ripples />
        <div className="wrap bkp__head rise">
          <p className="eyebrow">{p.eyebrow}</p>
          <h1 className="bkp__title">{p.title}</h1>
          <p className="bkp__lead">{p.lead}</p>
        </div>
      </div>

      <div className="wrap pay__wrap">
        {r && (
          <section className="pay__res rise" aria-label={p.yours}>
            <p className={`pay__status ${r.ok ? "is-ok" : ""}`}>{r.ok ? `✓ ${p.confirmed}` : p.pending}</p>
            <h2 className="pay__h">{p.yours}</h2>
            <dl className="pay__dl">
              <div>
                <dt>{p.name}</dt>
                <dd>{r.n}</dd>
              </div>
              <div>
                <dt>{p.service}</dt>
                <dd>{svc}</dd>
              </div>
              <div>
                <dt>{p.when}</dt>
                <dd>
                  {day} · {fmtTime(r.h, lang)}
                </dd>
              </div>
              <div>
                <dt>{p.place}</dt>
                <dd>{dom ? p.places.dom : p.places.spa}</dd>
              </div>
              <div>
                <dt>{p.total}</dt>
                <dd>
                  {fmtRd(r.t)} · {fmtUsd(r.t)}
                  {r.est ? <small>{p.estimate}</small> : null}
                </dd>
              </div>
            </dl>
            <div className="pay__due">
              <small>{r.due > 0 ? p.dueNow : p.total}</small>
              <b>{fmtRd(amount)}</b>
              <span>
                {p.amountUsd} {fmtUsd(amount)}
              </span>
              <p>{dom ? p.dueDom : r.due > 0 ? p.dueDeposit : p.dueLater}</p>
            </div>
          </section>
        )}

        <section className="pay__methods" aria-label={p.methods}>
          <h2 className="pay__h">{p.methods}</h2>
          {methods.map((m, i) => (
            <article key={m.k} className={`pay__m pay__m--${m.k}`} style={{ "--i": i } as React.CSSProperties}>
              <span className="pay__n">{i + 1}</span>
              <div className="pay__mb">
                {m.k === "cash" && (
                  <>
                    <h3>{p.cash.t}</h3>
                    <p>{p.cash.d}</p>
                  </>
                )}
                {m.k === "remitly" && (
                  <>
                    <h3>{p.remitly.t}</h3>
                    <p>{p.remitly.d}</p>
                    <div className="pay__acct" role="note">
                      <span className="pay__avatar" aria-hidden="true">
                        {payments.remitlyAccount.initials}
                      </span>
                      <div>
                        <small>{p.remitly.noticeT}</small>
                        <b>{payments.remitlyAccount.name}</b>
                        <span>{payments.remitlyAccount.handle}</span>
                      </div>
                      <p>{p.remitly.notice}</p>
                    </div>
                    <ol className="pay__steps">
                      {p.remitly.steps.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ol>
                    <a className="btn btn--night btn--sm" href={payments.remitly} target="_blank" rel="noopener noreferrer">
                      {p.remitly.btn} <Arrow size={14} />
                    </a>
                  </>
                )}
                {m.k === "card" && (
                  <>
                    <h3>{p.card.t}</h3>
                    <p>{p.card.d}</p>
                    <a className="btn btn--night btn--sm" href={payments.cardLink} target="_blank" rel="noopener noreferrer">
                      {p.card.btn} <Arrow size={14} />
                    </a>
                  </>
                )}
                {m.k === "bank" && (
                  <>
                    <h3>{p.bank.t}</h3>
                    {payments.bank ? (
                      <dl className="pay__bank">
                        <div>
                          <dt>{p.bank.holder}</dt>
                          <dd>{payments.bank.holder}</dd>
                          <CopyBtn text={payments.bank.holder} label={p.bank.copy} done={p.bank.copied} />
                        </div>
                        <div>
                          <dt>{p.bank.bank}</dt>
                          <dd>{payments.bank.bank}</dd>
                        </div>
                        {payments.bank.id && (
                          <div>
                            <dt>{p.bank.id}</dt>
                            <dd>{payments.bank.id}</dd>
                            <CopyBtn text={payments.bank.id} label={p.bank.copy} done={p.bank.copied} />
                          </div>
                        )}
                        {payments.bank.accounts.map((a) => (
                          <div key={a.number}>
                            <dt>
                              {p.bank.account} {a.cur} · {a.type}
                            </dt>
                            <dd className="pay__num">{a.number}</dd>
                            <CopyBtn text={a.number} label={p.bank.copy} done={p.bank.copied} />
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p>
                        <a href={waLink(lang === "es" ? "Hola, ¿me envían los datos para la transferencia del pago de mi masaje?" : "Hi, could you send me the bank details to pay for my massage?")} target="_blank" rel="noopener noreferrer">
                          {p.bank.pending}
                        </a>
                      </p>
                    )}
                  </>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="pay__proof">
          <h2>{p.proofTitle}</h2>
          <p>{p.proofText}</p>
          <a className="btn btn--teal" href={waLink(proofText)} target="_blank" rel="noopener noreferrer">
            <WaIcon /> {p.proofBtn}
          </a>
        </section>

        {!r && (
          <p className="pay__nores">
            {p.noRes}{" "}
            <a href={bookPath(lang)}>
              {p.book} <Arrow size={13} />
            </a>
          </p>
        )}
      </div>
      <Footer t={t} lang={lang} altHref={payPath(other, code)} />
    </main>
  );
}
