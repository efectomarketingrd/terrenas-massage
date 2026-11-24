// Genera los PDF de políticas (es, en, fr) en public/docs a partir de lib/content.
// Uso: NODE_PATH=<carpeta con playwright-core y qrcode>/node_modules node scripts/policies-pdf.js
// Volver a ejecutar cada vez que cambien las políticas.
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const QR = require("qrcode");
const { chromium } = require("playwright-core");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public/docs");
fs.mkdirSync(OUT, { recursive: true });
const pol = JSON.parse(execSync("npx -y tsx scripts/policies-data.ts", { cwd: ROOT }).toString());
const font = (w) => "file://" + ROOT + `/node_modules/@fontsource/open-sans/files/open-sans-latin-${w}-normal.woff2`;
const logo = "data:image/png;base64," + fs.readFileSync(ROOT + "/public/brand/terrenas-massage-blanco.png").toString("base64");

const T = {
  es: {
    file: "politicas-terrenas-massage.pdf", eyebrow: "Antes de tu cita", title: "Políticas del spa",
    lead: "Para que tu masaje sea tranquilo para ti y para todos. Por favor, léelas con calma.",
    essTitle: "Lo esencial", ess: ["10 min antes de tu cita", "Sin arena ni calzado sucio", "Totalmente aseado para el masaje", "Respeto al personal"],
    important: "Importante", accept: "Al reservar, aceptas estas políticas.",
    thanks: "Gracias por ayudarnos a cuidar un espacio limpio, tranquilo y respetuoso.",
    web: "/es/reservar#politicas", qrText: "Pulse aquí para ver las políticas en la web",
    wa: "Escríbenos por WhatsApp", waMsg: "Hola, tengo una pregunta sobre las políticas del spa.",
    hours: "Todos los días, feriados incluidos · 9:00 a. m. – 7:00 p. m.", updated: "Vigentes desde el 23 de noviembre de 2026",
  },
  en: {
    file: "policies-terrenas-massage.pdf", eyebrow: "Before your appointment", title: "Spa policies",
    lead: "So your massage is relaxing for you and for everyone. Please take a moment to read them.",
    essTitle: "The essentials", ess: ["10 min before your appointment", "No sand or dirty shoes", "Fully clean for your massage", "Respect for our staff"],
    important: "Important", accept: "By booking, you accept these policies.",
    thanks: "Thank you for helping us keep a clean, calm and respectful space.",
    web: "/en/book#politicas", qrText: "Tap here to see the policies online",
    wa: "Message us on WhatsApp", waMsg: "Hola, tengo una pregunta sobre las políticas del spa. (I speak English)",
    hours: "Every day, holidays included · 9:00 a.m. – 7:00 p.m.", updated: "Effective November 23, 2026",
  },
  fr: {
    file: "conditions-terrenas-massage.pdf", eyebrow: "Avant votre rendez-vous", title: "Conditions du spa",
    lead: "Pour que votre massage soit paisible, pour vous comme pour tous. Merci de les lire attentivement.",
    essTitle: "L'essentiel", ess: ["10 min avant votre rendez-vous", "Ni sable ni chaussures sales", "Parfaitement propre pour le massage", "Respect envers le personnel"],
    important: "Important", accept: "En réservant, vous acceptez ces conditions.",
    thanks: "Merci de nous aider à préserver un espace propre, calme et respectueux.",
    web: "/fr/reserver#politicas", qrText: "Touchez ici pour voir les conditions en ligne",
    wa: "Écrivez-nous sur WhatsApp", waMsg: "Bonjour ! Tengo una pregunta sobre las políticas del spa. (Hablo francés)",
    hours: "Tous les jours, jours fériés inclus · 9 h 00 – 19 h 00", updated: "En vigueur depuis le 23 novembre 2026",
  },
};

// Íconos de línea (24×24), uno por política en el orden de lib/content.
const S = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const icons = [
  S('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>'), // confirmación
  S('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>'), // puntualidad
  S('<path d="M7 4c2 0 3 2 3 5s-1 6-3 6-3-3-3-6 1-5 3-5Z"/><path d="M17 8c2 0 3 2 3 5s-1 6-3 6-3-3-3-6 1-5 3-5Z"/><path d="M3 21 21 3"/>'), // higiene: pies tachados
  S('<path d="M12 21s-7-4.4-9-9.2C1.6 8.4 3.6 5 7 5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.4 0 5.4 3.4 4 6.8-2 4.8-9 9.2-9 9.2Z"/>'), // respeto
  S('<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>'), // cambios
  S('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'), // a domicilio
  S('<ellipse cx="12" cy="18" rx="8" ry="3"/><ellipse cx="12" cy="12.5" rx="6" ry="2.5"/><ellipse cx="12" cy="7.5" rx="4" ry="2"/>'), // premium/grupos: piedras
  S('<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 15h2"/>'), // pagos
];
const essIcons = [icons[1], icons[2],
  S('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>'),
  icons[3]];
const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.9-2.8-1.2-4.6-4.1-4.7-4.3-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.2 1.3Z"/></svg>';

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function html(lang) {
  const t = T[lang], p = pol[lang];
  const url = "https://terrenasmassage.com" + t.web;
  const qr = await QR.toString(url, { type: "svg", margin: 0, color: { dark: "#050a30", light: "#ffffff" } });
  const wa = `https://wa.me/18293710276?text=${encodeURIComponent(t.waMsg)}`;
  const cards = p.items.map((it, i) => {
    const imp = i === 2 || i === 3;
    return `<section class="card${imp ? " imp" : ""}">
      <div class="ic">${icons[i]}</div>
      <div class="tx"><div class="row"><span class="n">${i + 1}</span><h2>${esc(it.t)}</h2>${imp ? `<span class="badge">${t.important}</span>` : ""}</div>
      <p>${esc(it.d)}</p></div></section>`;
  }).join("");
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  @font-face{font-family:OS;font-weight:400;src:url(${font(400)})}
  @font-face{font-family:OS;font-weight:600;src:url(${font(600)})}
  @font-face{font-family:OS;font-weight:700;src:url(${font(700)})}
  @font-face{font-family:OS;font-weight:800;src:url(${font(800)})}
  *{box-sizing:border-box;margin:0}
  html,body{width:440px;background:#f4f6fc;font-family:OS,sans-serif;color:#050a30;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  a{color:inherit;text-decoration:none}
  .hero{position:relative;background:#050a30;color:#fff;padding:34px 28px 64px;overflow:hidden}
  .hero .logo{height:58px;display:block}
  .hero .eb{margin-top:26px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8fd3e6;font-weight:700}
  .hero h1{font-size:30px;line-height:1.15;font-weight:800;margin-top:6px}
  .hero .lead{font-size:13.5px;line-height:1.55;color:#c9d3ea;margin-top:10px;max-width:330px}
  .hero svg.deco{position:absolute;right:-30px;top:20px;width:190px;opacity:.9}
  .hero svg.wave{position:absolute;left:0;bottom:-1px;width:100%;height:46px;display:block}
  .wrap{padding:0 20px 28px;margin-top:-20px;position:relative}
  .ess{background:#fff;border-radius:18px;padding:16px 16px 14px;box-shadow:0 8px 24px rgba(5,10,48,.08)}
  .ess h3{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#177a93;font-weight:800;margin-bottom:12px}
  .ess .g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .ess .e{display:flex;align-items:center;gap:9px;background:#eef8fb;border-radius:12px;padding:9px 10px}
  .ess .e .i{flex:none;width:30px;height:30px;border-radius:50%;background:#219ebc;color:#fff;display:grid;place-items:center}
  .ess .e .i svg{width:17px;height:17px}
  .ess .e span{font-size:12px;line-height:1.3;font-weight:600}
  .card{display:flex;gap:13px;background:#fff;border-radius:16px;padding:15px 15px 15px 14px;margin-top:12px;border:1px solid #e3e8f4;break-inside:avoid}
  .card.imp{border:1.5px solid #219ebc;background:linear-gradient(180deg,#f2fbfd,#fff)}
  .card .ic{flex:none;width:42px;height:42px;border-radius:13px;background:#e6f5f9;color:#177a93;display:grid;place-items:center}
  .card.imp .ic{background:#219ebc;color:#fff}
  .card .ic svg{width:23px;height:23px}
  .card .tx{flex:1;min-width:0}
  .row{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
  .n{font-size:11px;font-weight:800;color:#177a93}
  h2{font-size:15.5px;font-weight:800;line-height:1.25}
  .badge{font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:#050a30;color:#fff;border-radius:99px;padding:3px 8px}
  .card p{font-size:12.6px;line-height:1.58;color:#2c3350;margin-top:5px}
  .ok{margin-top:18px;background:#219ebc;color:#fff;border-radius:16px;padding:16px 18px;display:flex;gap:12px;align-items:center}
  .ok svg{flex:none;width:30px;height:30px}
  .ok b{display:block;font-size:14.5px;font-weight:800}
  .ok span{font-size:12.3px;line-height:1.45;color:#eafaff}
  .foot{margin-top:14px;background:#fff;border-radius:16px;padding:16px;display:flex;gap:14px;align-items:center;border:1px solid #e3e8f4}
  .qr{flex:none;text-align:center;width:108px}
  .qr svg{width:96px;height:96px;display:block;margin:0 auto}
  .qr span{display:block;font-size:10px;line-height:1.3;color:#177a93;font-weight:700;margin-top:6px;text-decoration:underline}
  .ct{flex:1;min-width:0;font-size:11.8px;line-height:1.5;color:#2c3350}
  .btn{display:inline-flex;align-items:center;gap:7px;background:#187c95;color:#fff;border-radius:99px;padding:8px 13px;font-weight:700;font-size:12px;margin-bottom:9px}
  .btn svg{width:15px;height:15px}
  .ct .web{color:#177a93;font-weight:700;text-decoration:underline}
  .up{text-align:center;font-size:10.5px;color:#6b7391;margin-top:14px}
  </style></head><body>
  <header class="hero">
    <svg class="deco" viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <circle cx="120" cy="80" r="70" stroke="#219ebc" stroke-opacity=".25"/>
      <circle cx="120" cy="80" r="48" stroke="#219ebc" stroke-opacity=".35"/>
      <ellipse cx="120" cy="128" rx="44" ry="13" fill="#219ebc" fill-opacity=".35"/>
      <ellipse cx="120" cy="106" rx="32" ry="10" fill="#219ebc" fill-opacity=".55"/>
      <ellipse cx="120" cy="88" rx="21" ry="8" fill="#8fd3e6" fill-opacity=".8"/>
      <path d="M150 60c10-22 30-24 40-20-6 14-22 26-40 20Z" fill="#8fd3e6" fill-opacity=".55"/>
      <path d="M150 60c12-10 22-14 32-16" stroke="#050a30" stroke-opacity=".4"/>
    </svg>
    <img class="logo" src="${logo}" alt="Terrenas Massage">
    <div class="eb">${t.eyebrow}</div>
    <h1>${t.title}</h1>
    <p class="lead">${t.lead}</p>
    <svg class="wave" viewBox="0 0 440 46" preserveAspectRatio="none"><path d="M0 26c60-20 120-20 180 0s130 22 200 2c25-7 45-9 60-8v26H0Z" fill="#f4f6fc"/></svg>
  </header>
  <main class="wrap">
    <div class="ess"><h3>${t.essTitle}</h3><div class="g">
      ${t.ess.map((e, i) => `<div class="e"><div class="i">${essIcons[i]}</div><span>${e}</span></div>`).join("")}
    </div></div>
    ${cards}
    <div class="ok">${S('<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>').replace('stroke="currentColor"', 'stroke="#fff"')}
      <div><b>${t.accept}</b><span>${t.thanks}</span></div></div>
    <div class="foot">
      <a class="qr" href="${url}">${qr}<span>${t.qrText}</span></a>
      <div class="ct">
        <a class="btn" href="${wa}">${waIcon}${t.wa}</a><br>
        <b>Terrenas Massage</b><br>
        Blvd. Turístico del Atlántico, La Ceiba, edif. #6, 2.º nivel, Las Terrenas<br>
        ${t.hours}<br>
        <a class="web" href="https://terrenasmassage.com/${lang}">terrenasmassage.com</a> · +1 (829) 371-0276
      </div>
    </div>
    <p class="up">${t.updated}</p>
  </main></body></html>`;
}

(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
  const pg = await b.newPage({ viewport: { width: 440, height: 900 } });
  for (const lang of ["es", "en", "fr"]) {
    const f = path.join(require("os").tmpdir(), `pol-${lang}.html`);
    fs.writeFileSync(f, await html(lang));
    await pg.goto("file://" + f);
    await pg.evaluate(() => document.fonts.ready);
    const h = await pg.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
    await pg.pdf({ path: path.join(OUT, T[lang].file), width: "440px", height: h + 2 + "px", printBackground: true, pageRanges: "1" });
    console.log(lang, h);
  }
  await b.close();
})();
