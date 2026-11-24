// Genera los PDF de la experiencia para cruceristas (volante A5 + paradas del recorrido) en es, en y fr, en public/docs.
// Uso: NODE_PATH=<carpeta con playwright-core y qrcode>/node_modules node scripts/cruise-pdf.js
// Los textos, precios y la ruta salen de lib/cruise.ts y lib/cruise-map.ts: si cambian, volver a ejecutar.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const QR = require("qrcode");
const { chromium } = require("playwright-core");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public");
const D = JSON.parse(execSync("npx -y tsx scripts/cruise-data.ts", { cwd: ROOT }).toString());
const font = (w) => "file://" + ROOT + `/node_modules/@fontsource/open-sans/files/open-sans-latin-${w}-normal.woff2`;
const logo = "data:image/png;base64," + fs.readFileSync(ROOT + "/public/brand/terrenas-massage-blanco.png").toString("base64");
const SITE = "https://terrenasmassage.com";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const L = {
  es: { qrBook: "Pulse aquí para reservar", qrRoute: "Pulse aquí para ver la ruta interactiva", wa: "Reservar por WhatsApp", routeShort: "El recorrido", sos: "Emergencias", stopsTitle: "Paradas del recorrido", sea: "Océano Atlántico", web: "Ruta interactiva, precios y reservas" },
  en: { qrBook: "Tap here to book", qrRoute: "Tap here for the interactive route", wa: "Book on WhatsApp", routeShort: "The route", sos: "Emergencies", stopsTitle: "Tour stops", sea: "Atlantic Ocean", web: "Interactive route, prices and booking" },
  fr: { qrBook: "Touchez ici pour réserver", qrRoute: "Touchez ici pour l'itinéraire interactif", wa: "Réserver sur WhatsApp", routeShort: "Le parcours", sos: "Urgences", stopsTitle: "Arrêts du parcours", sea: "Océan Atlantique", web: "Itinéraire interactif, tarifs et réservation" },
};

// Viñetas ilustradas de cada parada (SVG propio, sin fotos de terceros)
const V = {
  spa: `<rect width="80" height="56" rx="12" fill="#e6f5f9"/><ellipse cx="40" cy="44" rx="20" ry="5" fill="#8fd3e4"/><ellipse cx="40" cy="35" rx="15" ry="5" fill="#219ebc"/><ellipse cx="40" cy="27" rx="11" ry="4.5" fill="#187c95"/><ellipse cx="40" cy="20" rx="7" ry="3.5" fill="#050a30"/><path d="M56 14c4-5 9-5 12-3-3 4-8 6-12 3z" fill="#4f8a52"/>`,
  bonita: `<rect width="80" height="56" rx="12" fill="#e6f5f9"/><rect y="0" width="80" height="26" rx="12" fill="#bfe6f0"/><path d="M0 26h80v30H0z" fill="#f6e7c1"/><path d="M0 26c10 3 20-3 30 0s20 3 30 0 14-2 20 0" stroke="#219ebc" stroke-width="2" fill="none"/><path d="M58 48c1-9 1-16-1-24" stroke="#6b8f5e" stroke-width="2" fill="none"/><path d="M57 24c-6-3-11 0-12 3M57 24c6-3 11 0 12 3M57 24c-3-6-8-7-11-5M57 24c3-6 8-7 11-5" stroke="#4f8a52" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="18" cy="12" r="6" fill="#ffd57a"/>`,
  ballenas: `<rect width="80" height="56" rx="12" fill="#bfe6f0"/><path d="M0 40h80v16H0z" fill="#219ebc" opacity=".35"/><path d="M8 40c4-9 14-9 18 0zM30 40c5-12 17-12 22 0zM56 40c4-8 12-8 16 0z" fill="#4f8a52"/><path d="M0 42c10 3 20-3 30 0s20 3 30 0 14-2 20 0" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M40 14c2 4 1 7-1 9m1-9c-3 1-6 0-7-2m7 2c3 1 6 0 7-2" stroke="#050a30" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  pescadores: `<rect width="80" height="56" rx="12" fill="#e6f5f9"/><path d="M0 40h80v16H0z" fill="#f6e7c1"/><path d="M14 40V26h22v14z" fill="#ffd57a"/><path d="M10 27l15-11 15 11z" fill="#c08a4a"/><path d="M40 40V28h18v12z" fill="#8fd3e4"/><path d="M37 29l12-9 12 9z" fill="#c08a4a"/><path d="M56 48h20l-4 4H60z" fill="#d64550"/><path d="M66 48V38" stroke="#050a30" stroke-width="1.5"/>`,
  popy: `<rect width="80" height="56" rx="12" fill="#bfe6f0"/><path d="M0 34h80v22H0z" fill="#219ebc" opacity=".45"/><path d="M0 36c10 3 20-3 30 0s20 3 30 0 14-2 20 0" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M44 8c10-2 18 4 20 10-8-4-16-4-20-10z" fill="#d64550"/><path d="M50 15l-6 22" stroke="#050a30" stroke-width="1" /><path d="M14 50c1-9 0-16-2-22" stroke="#6b8f5e" stroke-width="2" fill="none"/><path d="M12 28c-6-3-10 0-11 3M12 28c6-3 10 0 11 3M12 28c-3-6-7-7-10-5M12 28c3-6 7-7 10-5" stroke="#4f8a52" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  mirador: `<rect width="80" height="56" rx="12" fill="#e6f5f9"/><rect width="80" height="22" rx="12" fill="#bfe6f0"/><path d="M0 22h80v6H0z" fill="#219ebc" opacity=".5"/><path d="M0 56V36c14-12 26-6 40-14s28 0 40-8v42z" fill="#4f8a52"/><path d="M0 56V44c16-8 30-2 44-8s24-2 36-6v26z" fill="#6b8f5e"/><path d="M10 42h22M12 42v6M20 42v6M28 42v6" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="64" cy="10" r="5" fill="#ffd57a"/>`,
};
const vig = (id, w = 80) => `<svg viewBox="0 0 80 56" width="${w}" height="${(w * 56) / 80}" aria-hidden="true">${V[id]}</svg>`;
const check = `<svg viewBox="0 0 24 24" width="13" height="13"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#187c95" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const waIcon = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.9-2.8-1.2-4.6-4.1-4.7-4.3-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.2 1.3Z"/></svg>';
const ICON = {
  health: "M-3.5,-1.2h2.3v-2.3h2.4v2.3h2.3v2.4h-2.3v2.3h-2.4v-2.3h-2.3z",
  police: "M0,-4 3.6,-2.6v2.2c0,2.4-1.6,4-3.6,4.8-2-.8-3.6-2.4-3.6-4.8v-2.2z",
  pharmacy: "M-3.4,1.4 1.4,-3.4a1.9,1.9 0 0 1 2.7,2.7L-0.7,4.1a1.9,1.9 0 0 1-2.7-2.7z",
};
const KCOL = { health: "#d64550", police: "#24479b", pharmacy: "#2c8a52" };

const css = (w) => `
@font-face{font-family:OS;font-weight:400;src:url(${font(400)})}
@font-face{font-family:OS;font-weight:600;src:url(${font(600)})}
@font-face{font-family:OS;font-weight:700;src:url(${font(700)})}
@font-face{font-family:OS;font-weight:800;src:url(${font(800)})}
*{box-sizing:border-box;margin:0}
html,body{width:${w}px;background:#f4f6fc;font-family:OS,sans-serif;color:#050a30;-webkit-print-color-adjust:exact;print-color-adjust:exact}
a{color:inherit;text-decoration:none}`;

function mapSvg(lang, info) {
  const { W, H, P, PATH } = D.map;
  const c = D.cruise[lang];
  const pins = D.order.map((id, i) => `<g transform="translate(${P[id][0].toFixed(1)} ${P[id][1].toFixed(1)})"><circle r="9" fill="${id === "spa" ? "#050a30" : "#fff"}" stroke="${id === "spa" ? "#050a30" : "#187c95"}" stroke-width="2.5"/><text y="3.4" text-anchor="middle" font-size="9.5" font-weight="800" fill="${id === "spa" ? "#fff" : "#177a93"}">${i + 1}</text></g>`).join("");
  const pois = info ? D.places.map((p) => `<g transform="translate(${p.xy[0].toFixed(1)} ${p.xy[1].toFixed(1)})"><rect x="-7" y="-7" width="14" height="14" rx="4" fill="${KCOL[p.kind]}" stroke="#fff" stroke-width="1.4"/><path d="${ICON[p.kind]}" fill="#fff"/></g>`).join("") : "";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">
  <rect width="${W}" height="${H}" fill="#eaf3ea"/>
  <path d="M0,200 C60,170 110,190 150,175 S250,150 360,185 V260 H0Z" fill="#d6e8d3"/>
  <path d="M0,235 C70,210 140,230 200,215 S300,205 360,225 V260 H0Z" fill="#c4dec0"/>
  <path d="M0,0 H360 V36 C330,40 300,42 268,44 S215,46 190,42 S150,50 125,64 S80,86 52,92 S18,96 0,98Z" fill="#9fd6e4"/>
  <path d="M0,98 C18,96 30,95 52,92 S100,76 125,64 S165,44 190,42 S240,46 268,44 S330,40 360,36" fill="none" stroke="#f6e7c1" stroke-width="5" stroke-linecap="round"/>
  <text x="14" y="20" font-size="9" font-style="italic" font-weight="600" fill="#fff">${L[lang].sea}</text>
  <path d="${PATH}" fill="none" stroke="rgba(5,10,48,.12)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${PATH}" fill="none" stroke="#187c95" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${info ? 'opacity=".4"' : ""}/>
  <g ${info ? 'opacity=".45"' : ""}>${pins}</g>${pois}
  <text x="${W / 2}" y="${H - 8}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#050a30">↕ ${esc(c.fromPort)}</text>
  </svg>`;
}

async function qr(url) {
  return QR.toString(url, { type: "svg", margin: 0, color: { dark: "#050a30", light: "#ffffff" } });
}
const waLink = (lang) => `https://wa.me/18293710276?text=${encodeURIComponent(`Hola, quiero reservar la experiencia para cruceristas (masaje + recorrido por Las Terrenas). ${D.cruise[lang].langNote}`.trim())}`;

// ───────── Volante A5 ─────────
async function flyer(lang) {
  const c = D.cruise[lang];
  const url = `${SITE}/${lang}/${D.slugs[lang]}#reservar`;
  const q = await qr(url);
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(c.title)} · Terrenas Massage</title><style>${css(559)}
  @page{size:148mm 210mm;margin:0}
  body{height:794px;overflow:hidden;display:flex;flex-direction:column}
  .top{position:relative;background:#050a30;color:#fff;padding:20px 24px 44px;overflow:hidden}
  .top .logo{height:38px}
  .eb{margin-top:14px;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#8fd3e4;font-weight:800}
  h1{font-size:21px;line-height:1.15;font-weight:800;margin-top:4px;max-width:330px}
  .lead{font-size:10px;line-height:1.45;color:#c9d3ea;margin-top:6px;max-width:300px}
  .chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px;max-width:none;position:relative}
  .chips span{border:1px solid rgba(255,255,255,.25);border-radius:99px;padding:3px 8px;font-size:8.5px;font-weight:700}
  .scene{position:absolute;right:-6px;top:56px;width:220px}
  .wave{position:absolute;left:0;bottom:-1px;width:100%;height:30px}
  .body{padding:0 20px 14px;margin-top:-12px;position:relative;flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:7px}
  .card{background:#fff;border-radius:14px;padding:9px 13px;box-shadow:0 6px 16px rgba(5,10,48,.07);border:1px solid #e3e8f4}
  .h{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#177a93;font-weight:800;margin-bottom:6px}
  .inc{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px}
  .inc div{display:grid;grid-template-columns:13px 1fr;gap:5px;font-size:9.2px;line-height:1.35}
  .route{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;text-align:center}
  .route div{font-size:8.3px;line-height:1.25;font-weight:700}
  .route svg{display:block;margin:0 auto 2px;border-radius:8px}
  .route b{display:inline-grid;place-items:center;width:15px;height:15px;border-radius:50%;background:#187c95;color:#fff;font-size:8px;margin-bottom:2px}
  .prices{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .p{background:#050a30;color:#fff;border-radius:12px;padding:9px 11px}
  .p small{display:block;font-size:8.5px;color:#8fd3e4;font-weight:700}
  .p b{font-size:19px;font-weight:800}
  .p span{display:block;font-size:8.3px;color:#c9d3ea;margin-top:1px}
  .extra{font-size:8.4px;color:#4d5577;margin-top:6px;line-height:1.45}
  .bottom{display:flex;gap:12px;align-items:center;background:#fff;border-radius:14px;padding:11px 13px;border:1.5px solid #219ebc}
  .qr{flex:none;width:86px;text-align:center}
  .qr svg{width:78px;height:78px;display:block;margin:0 auto}
  .qr span{display:block;font-size:8px;line-height:1.25;color:#177a93;font-weight:800;text-decoration:underline;margin-top:4px}
  .ct{flex:1;font-size:9px;line-height:1.5;color:#2c3350}
  .btn{display:inline-flex;align-items:center;gap:6px;background:#187c95;color:#fff;border-radius:99px;padding:6px 12px;font-weight:800;font-size:10px;margin-bottom:6px}
  .ct b{color:#050a30}
  </style></head><body>
  <header class="top">
    <svg class="scene" viewBox="0 0 220 150" aria-hidden="true">
      <circle cx="160" cy="40" r="26" fill="#ffd57a" opacity=".9"/>
      <path d="M40 98h150l-12 16H58z" fill="#f4f6fc"/><path d="M62 98V84h104v14" fill="#f4f6fc"/><path d="M84 84V72h62v12" fill="#f4f6fc"/>
      <path d="M70 90h90M92 78h48" stroke="#219ebc" stroke-width="3" stroke-dasharray="6 5"/>
      <path d="M110 72V60h10v12" fill="#d64550"/>
      <path d="M0 118c20 6 40-6 60 0s40 6 60 0 40-6 60 0 30 4 40 0v32H0z" fill="#219ebc" opacity=".55"/>
      <path d="M30 150c2-20 1-34-3-48" stroke="#8fd3e4" stroke-width="3" fill="none"/>
      <path d="M27 102c-11-5-19 0-21 5M27 102c11-5 19 0 21 5M27 102c-5-10-14-12-19-8M27 102c5-10 14-12 19-8" stroke="#4fa26a" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>
    <img class="logo" src="${logo}" alt="Terrenas Massage">
    <div class="eb">${esc(c.eyebrow)}</div>
    <h1>${esc(c.title)}</h1>
    <p class="lead">${esc(c.lead)}</p>
    <div class="chips">${c.chips.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
    <svg class="wave" viewBox="0 0 559 30" preserveAspectRatio="none"><path d="M0 16c80-14 160-14 240 0s170 16 260 2c25-4 45-5 59-4v16H0Z" fill="#f4f6fc"/></svg>
  </header>
  <main class="body">
    <div class="card"><div class="h">${esc(c.includesTitle)}</div><div class="inc">${c.includes.map((x) => `<div>${check}<span>${esc(x)}</span></div>`).join("")}</div></div>
    <div class="card"><div class="h">${esc(L[lang].routeShort)}</div><div class="route">${D.order.map((id, i) => `<div>${vig(id, 54)}<b>${i + 1}</b><br>${esc(c.stops[id].t)}</div>`).join("")}</div></div>
    <div class="card"><div class="h">${esc(c.pricesTitle)}</div>
      <div class="prices">
        <div class="p"><small>${esc(c.prices[0].t)}</small><b>US$${D.price.person}</b><span>${esc(c.perPerson)}</span></div>
        <div class="p"><small>${esc(c.prices[1].t)}</small><b>US$${D.price.couple}</b><span>${esc(c.prices[1].v.replace(/^US\$\d+\s*|^\d+\s*US\$\s*/, ""))}</span></div>
      </div>
      <p class="extra">${esc(c.prices[2].t)}: ${esc(c.prices[2].v)} · ${esc(c.prices[3].t)}: ${esc(c.prices[3].v)}<br>${c.priceNotes.map(esc).join(" ")}</p>
    </div>
    <div class="bottom">
      <a class="qr" href="${url}">${q}<span>${esc(L[lang].qrBook)}</span></a>
      <div class="ct">
        <a class="btn" href="${waLink(lang)}">${waIcon}${esc(L[lang].wa)}</a><br>
        <b>Terrenas Massage</b> · +1 (829) 371-0276<br>
        Blvd. Turístico del Atlántico, La Ceiba, edif. #6, 2.º nivel, Las Terrenas<br>
        <a href="${SITE}/${lang}/${D.slugs[lang]}" style="color:#177a93;font-weight:700;text-decoration:underline">terrenasmassage.com</a> · ${esc(L[lang].web)}
      </div>
    </div>
  </main></body></html>`;
}

// ───────── Paradas del recorrido (página larga para el teléfono) ─────────
async function stops(lang) {
  const c = D.cruise[lang];
  const url = `${SITE}/${lang}/${D.slugs[lang]}#ruta`;
  const q = await qr(url);
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(L[lang].stopsTitle)} · Terrenas Massage</title><style>${css(440)}
  .top{position:relative;background:#050a30;color:#fff;padding:28px 24px 54px;overflow:hidden}
  .top .logo{height:46px}
  .eb{margin-top:18px;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#8fd3e4;font-weight:800}
  h1{font-size:26px;line-height:1.15;font-weight:800;margin-top:6px}
  .lead{font-size:12.5px;line-height:1.55;color:#c9d3ea;margin-top:8px}
  .wave{position:absolute;left:0;bottom:-1px;width:100%;height:40px}
  .wrap{padding:0 18px 26px;margin-top:-18px;position:relative}
  .card{background:#fff;border-radius:18px;padding:14px;margin-top:12px;border:1px solid #e3e8f4}
  .h2{font-size:16px;font-weight:800;margin:0 0 10px}
  .map{border-radius:14px;overflow:hidden;border:1px solid #e3e8f4}
  .stop{display:grid;grid-template-columns:92px 1fr;gap:12px;align-items:start;break-inside:avoid}
  .stop+.stop{margin-top:12px;padding-top:12px;border-top:1px solid #eef1f8}
  .stop svg{border-radius:12px}
  .n{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:800;color:#177a93}
  .n span{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#187c95;color:#fff}
  .stop h3{font-size:14.5px;font-weight:800;margin:4px 0 3px}
  .stop p{font-size:11.8px;line-height:1.5;color:#2c3350}
  .day li{display:grid;grid-template-columns:52px 1fr;gap:10px;align-items:start;font-size:11.8px;line-height:1.45;margin-top:8px;list-style:none}
  .day ol{padding:0}
  .t{display:grid;place-items:center;height:24px;border-radius:8px;background:#050a30;color:#fff;font-size:10.5px;font-weight:800}
  .day small{display:block;color:#4d5577}
  .note{font-size:10.5px;line-height:1.5;color:#4d5577;margin-top:10px}
  .safe{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .safe div{background:#f4f6fc;border-radius:12px;padding:10px}
  .safe b{display:block;font-size:11.5px}
  .safe span{font-size:10.5px;line-height:1.45;color:#4d5577}
  .list li{display:grid;grid-template-columns:14px 1fr;gap:7px;font-size:11.3px;line-height:1.5;color:#2c3350;margin-top:5px;list-style:none}
  .list{padding:0}
  .sos{display:flex;align-items:center;gap:10px;background:#fdecee;color:#a3242e;border-radius:12px;padding:9px 12px;font-weight:800;font-size:12px}
  .sos b{font-size:18px}
  .pl{display:grid;grid-template-columns:22px 1fr auto;gap:9px;align-items:center;background:#f4f6fc;border-radius:12px;padding:8px 10px;margin-top:7px}
  .pl b{font-size:11.5px;display:block}
  .pl small{font-size:10px;color:#4d5577}
  .pl a{font-size:10.5px;font-weight:800;color:#177a93;text-decoration:underline}
  .foot{display:flex;gap:14px;align-items:center}
  .qr{flex:none;width:104px;text-align:center}
  .qr svg{width:92px;height:92px;display:block;margin:0 auto}
  .qr span{display:block;font-size:9.5px;line-height:1.3;color:#177a93;font-weight:800;text-decoration:underline;margin-top:5px}
  .ct{flex:1;font-size:11px;line-height:1.5;color:#2c3350}
  .btn{display:inline-flex;align-items:center;gap:7px;background:#187c95;color:#fff;border-radius:99px;padding:8px 13px;font-weight:800;font-size:11.5px;margin-bottom:8px}
  </style></head><body>
  <header class="top">
    <img class="logo" src="${logo}" alt="Terrenas Massage">
    <div class="eb">${esc(c.eyebrow)}</div>
    <h1>${esc(L[lang].stopsTitle)}</h1>
    <p class="lead">${esc(c.title)}</p>
    <svg class="wave" viewBox="0 0 440 40" preserveAspectRatio="none"><path d="M0 22c60-20 120-20 180 0s130 22 200 2c25-7 45-9 60-8v24H0Z" fill="#f4f6fc"/></svg>
  </header>
  <div class="wrap">
    <div class="card"><div class="h2">${esc(c.routeTitle)}</div><div class="map">${mapSvg(lang, false)}</div><p class="note">${esc(c.schematic)}</p></div>
    <div class="card">${D.order.map((id, i) => `<div class="stop">${vig(id, 92)}<div><div class="n"><span>${i + 1}</span>${esc(c.stops[id].time)}</div><h3>${esc(c.stops[id].t)}</h3><p>${esc(c.stops[id].d)}</p></div></div>`).join("")}</div>
    <div class="card day"><div class="h2">${esc(c.dayTitle)}</div><ol>${c.day.map((x) => `<li><span class="t">${esc(x.t)}</span><span><b>${esc(x.h)}</b>${x.d ? `<small>${esc(x.d)}</small>` : ""}</span></li>`).join("")}</ol><p class="note">${esc(c.dayNote)}</p></div>
    <div class="card"><div class="h2">${esc(c.safetyTitle)}</div><div class="safe">${c.safety.map((x) => `<div><b>${esc(x.t)}</b><span>${esc(x.d)}</span></div>`).join("")}</div></div>
    <div class="card"><div class="h2">${esc(c.cancelTitle)}</div><ul class="list">${c.cancel.map((x) => `<li>${check}<span>${esc(x)}</span></li>`).join("")}</ul></div>
    <div class="card"><div class="h2">${esc(c.infoTitle)}</div>
      <a class="sos" href="tel:911"><b>9-1-1</b> ${esc(L[lang].sos)}</a>
      <div class="map" style="margin-top:10px">${mapSvg(lang, true)}</div>
      ${D.places.map((p) => `<div class="pl"><svg viewBox="-8 -8 16 16" width="22" height="22"><rect x="-7" y="-7" width="14" height="14" rx="4" fill="${KCOL[p.kind]}"/><path d="${ICON[p.kind]}" fill="#fff"/></svg><span><b>${esc(p.name)}</b><small>${esc(c.kinds[p.kind])}${p.h24 ? " · " + esc(c.h24) : ""}</small></span><a href="${p.url}">${esc(c.directions)}</a></div>`).join("")}
    </div>
    <div class="card foot">
      <a class="qr" href="${url}">${q}<span>${esc(L[lang].qrRoute)}</span></a>
      <div class="ct"><a class="btn" href="${waLink(lang)}">${waIcon}${esc(L[lang].wa)}</a><br><b>Terrenas Massage</b> · +1 (829) 371-0276<br>Blvd. Turístico del Atlántico, La Ceiba, edif. #6, 2.º nivel, Las Terrenas</div>
    </div>
  </div></body></html>`;
}

(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
  for (const lang of ["es", "en", "fr"]) {
    // Volante A5
    let pg = await b.newPage({ viewport: { width: 559, height: 794 } });
    let f = path.join(os.tmpdir(), `cz-flyer-${lang}.html`);
    fs.writeFileSync(f, await flyer(lang));
    await pg.goto("file://" + f);
    await pg.evaluate(() => document.fonts.ready);
    const over = await pg.evaluate(() => document.documentElement.scrollHeight);
    await pg.pdf({ path: OUT + D.docs[lang].flyer, width: "148mm", height: "210mm", printBackground: true, pageRanges: "1" });
    if (process.env.SHOTS) await pg.screenshot({ path: `${process.env.SHOTS}/flyer-${lang}.png` });
    await pg.close();
    // Paradas
    pg = await b.newPage({ viewport: { width: 440, height: 900 } });
    f = path.join(os.tmpdir(), `cz-stops-${lang}.html`);
    fs.writeFileSync(f, await stops(lang));
    await pg.goto("file://" + f);
    await pg.evaluate(() => document.fonts.ready);
    const h = await pg.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
    await pg.pdf({ path: OUT + D.docs[lang].stops, width: "440px", height: h + 2 + "px", printBackground: true, pageRanges: "1" });
    if (process.env.SHOTS) {
      await pg.setViewportSize({ width: 440, height: h });
      await pg.screenshot({ path: `${process.env.SHOTS}/stops-${lang}.png`, fullPage: true });
    }
    await pg.close();
    console.log(lang, "flyer content height", over, "stops", h);
  }
  await b.close();
})();
