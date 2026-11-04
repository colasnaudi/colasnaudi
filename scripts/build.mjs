// Generates the SVG visuals of the GitHub profile README, in the colasnaudi.com theme.
//   node scripts/build.mjs           -> static visuals (header, section titles, footer)
//   node scripts/build.mjs --stats   -> GitHub stats card (needs GH_TOKEN)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets");
const USER = process.env.GH_USER || "colasnaudi";
mkdirSync(OUT, { recursive: true });

// ---------- theme (colasnaudi.com) ----------
const C = {
  ink: "#16181A",
  ink2: "#2E3236",
  text2: "#464B4F",
  text3: "#5A5F63",
  muted: "#B5BABE",
  line: "#E3E6E8",
  soft: "#F1F3F2",
  coral: "#FF5A36",
  coralDark: "#A8300C",
  peach: "#FFD0BD",
  peach2: "#FFBFA6",
  cream: "#F6E8D7",
  mint: "#9FD8CF",
  mintLight: "#D3E9E5",
  white: "#FFFFFF",
};

// dark mode (GitHub dark): cards blend with the page instead of glowing white
const D = {
  card: "#151B23",
  line: "#2A313C",
  soft: "#212830",
  ink: "#F0F3F6",
  text2: "#B7BDC6",
  text3: "#8D96A0",
  muted: "#6E7681",
};

const font = (file) =>
  readFileSync(join(OUT, "fonts", file)).toString("base64");
const FONTS = {
  display: () =>
    `@font-face{font-family:'Bricolage';font-weight:800;src:url(data:font/woff2;base64,${font("bricolage-grotesque-latin-800-normal.woff2")}) format('woff2')}`,
  body400: () =>
    `@font-face{font-family:'DMSans';font-weight:400;src:url(data:font/woff2;base64,${font("dm-sans-latin-400-normal.woff2")}) format('woff2')}`,
  body500: () =>
    `@font-face{font-family:'DMSans';font-weight:500;src:url(data:font/woff2;base64,${font("dm-sans-latin-500-normal.woff2")}) format('woff2')}`,
  body600: () =>
    `@font-face{font-family:'DMSans';font-weight:600;src:url(data:font/woff2;base64,${font("dm-sans-latin-600-normal.woff2")}) format('woff2')}`,
};
const BASE_CSS = `
  .d{font-family:'Bricolage','Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;font-weight:800}
  .b{font-family:'DMSans','DM Sans',ui-sans-serif,system-ui,sans-serif}
  .eyebrow{font-family:'DMSans','DM Sans',ui-sans-serif,system-ui,sans-serif;font-weight:600;font-size:13px;letter-spacing:.78px}
  .in1,.in2,.in3,.in4{animation:in .9s cubic-bezier(.2,.8,.2,1) backwards}
  .in1{animation-delay:.05s}.in2{animation-delay:.2s}.in3{animation-delay:.35s}.in4{animation-delay:.5s}
  @keyframes in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  .bg{fill:${C.white}} .ln{stroke:${C.line}} .sf{fill:${C.soft}} .k{fill:${C.ink}} .k2{fill:${C.text2}} .k3{fill:${C.text3}} .km{fill:${C.muted}} .ks{stroke:${C.ink}}
  @media (prefers-color-scheme: dark){
    .bg{fill:${D.card}} .ln{stroke:${D.line}} .sf{fill:${D.soft}} .k{fill:${D.ink}} .k2{fill:${D.text2}} .k3{fill:${D.text3}} .km{fill:${D.muted}} .ks{stroke:${D.ink}}
  }
`;
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const svg = (w, h, css, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">\n<style>${css}</style>\n${body}\n</svg>\n`;
const write = (name, content) => {
  writeFileSync(join(OUT, name), content);
  console.log(`wrote assets/${name} (${(content.length / 1024).toFixed(0)} KB)`);
};

// ---------- header ----------
function header() {
  const css =
    FONTS.display() + FONTS.body500() + FONTS.body600() + BASE_CSS +
    `
  .wave{stroke-dasharray:8 8;animation:dash 2.4s linear infinite}
  @keyframes dash{to{stroke-dashoffset:-32}}
  .ring{transform-origin:1068px 120px;animation:breathe 6s ease-in-out infinite}
  @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  .dot{transform-origin:72px 160px;animation:ping 1.8s ease-out infinite}
  @keyframes ping{0%{transform:scale(1);opacity:.6}100%{transform:scale(3.2);opacity:0}}
  .loop{stroke-dasharray:7 9;animation:dash 3s linear infinite}
  `;
  const LOOP = "M-10 438 C 150 456, 330 418, 520 438 S 760 440, 770 330 S 700 170, 660 220 S 720 300, 800 210 S 900 120, 1210 150";
  const body = `
<defs><clipPath id="card"><rect x="820" y="36" width="344" height="388" rx="28"/></clipPath></defs>
<rect x=".5" y=".5" width="1199" height="459" rx="32" class="bg ln"/>

<!-- mint dashed loop: drawn first so every component sits on top of it; it runs
     under the text, loops in the empty space and disappears behind the featured card -->
<path class="loop" d="${LOOP}" stroke="${C.mint}" stroke-width="2" stroke-linecap="round" opacity=".8"/>

<!-- logo + wordmark -->
<g class="in1">
  <rect x="48" y="44" width="40" height="40" rx="11" fill="${C.coral}"/>
  <text x="68" y="71" text-anchor="middle" class="d" font-size="18" letter-spacing="-.6" fill="${C.ink}">CN</text>
  <text x="100" y="72" class="d k" font-size="22" letter-spacing="-.6">colas naudi</text>
</g>

<!-- availability pill -->
<g class="in2">
  <rect x="48" y="140" width="358" height="40" rx="20" class="sf"/>
  <circle class="dot" cx="72" cy="160" r="4.5" fill="${C.coral}"/>
  <circle cx="72" cy="160" r="4.5" fill="${C.coral}"/>
  <text x="88" y="165.5" class="b k" font-weight="600" font-size="15">Full-stack developer · Paris &amp; remote</text>
</g>

<!-- headline -->
<g class="in3">
  <text class="d k" font-size="64" letter-spacing="-2.6">
    <tspan x="44" y="262">Web &amp; mobile apps</tspan>
    <tspan x="44" y="330"><tspan fill="${C.coral}">built to last</tspan>.</tspan>
  </text>
</g>
<g class="in4">
  <text x="48" y="384" class="b k2" font-weight="500" font-size="19">From idea to production, with React, Next.js, React Native and TypeScript.</text>
</g>

<!-- featured project card -->
<g class="in4">
  <g clip-path="url(#card)">
    <rect x="820" y="36" width="344" height="388" fill="${C.coral}"/>
    <g class="ring">
      <circle cx="1068" cy="120" r="118" stroke="${C.white}" stroke-opacity=".22" stroke-width="22"/>
      <circle cx="1068" cy="120" r="74" fill="${C.white}" fill-opacity=".22"/>
    </g>
  </g>
  <text x="852" y="84" class="eyebrow" fill="${C.ink}">FEATURED PROJECT</text>
  <text x="848" y="352" class="d" font-size="66" letter-spacing="-2.4" fill="${C.ink}">+15,000</text>
  <text class="b" font-weight="500" font-size="16" fill="${C.ink}">
    <tspan x="852" y="384">downloads on Besta, the ticketing</tspan>
    <tspan x="852" y="406">app I co-founded</tspan>
  </text>
</g>`;
  return svg(1200, 460, css, body);
}

// ---------- section titles (adapt to light / dark mode) ----------
function section(num, eyebrow, before, accent, after = "") {
  const css =
    FONTS.display() + FONTS.body600() + BASE_CSS +
    `
  .t{fill:${C.ink}} .e{fill:${C.text3}} .bar{fill:${C.ink}}
  @media (prefers-color-scheme: dark){ .t{fill:#F0F3F6} .e{fill:${C.muted}} .bar{fill:#F0F3F6} }
  `;
  const body = `
<g class="in1">
  <rect x="2" y="20" width="10" height="10" rx="3" fill="${C.coral}"/>
  <text x="22" y="30" class="eyebrow e">${esc(num)} · ${esc(eyebrow)}</text>
</g>
<g class="in2">
  <text x="0" y="82" class="d t" font-size="44" letter-spacing="-1.6">${esc(before)}<tspan fill="${C.coral}">${esc(accent)}</tspan>${esc(after)}</text>
</g>`;
  return svg(1200, 104, css, body);
}

// ---------- footer ----------
function footer() {
  const css =
    FONTS.display() + FONTS.body500() + FONTS.body600() + BASE_CSS +
    `
  .wave{stroke-dasharray:8 8;animation:dash 2.4s linear infinite}
  @keyframes dash{to{stroke-dashoffset:-32}}
  .arrow{animation:nudge 1.6s ease-in-out infinite}
  @keyframes nudge{0%,100%{transform:none}50%{transform:translateX(6px)}}
  `;
  const body = `
<defs><clipPath id="f"><rect width="1200" height="260" rx="32"/></clipPath></defs>
<rect x=".5" y=".5" width="1199" height="259" rx="32" class="bg ln"/>
<g clip-path="url(#f)">
  <circle cx="1110" cy="40" r="150" stroke="${C.coral}" stroke-opacity=".9" stroke-width="22"/>
  <circle cx="1110" cy="40" r="92" fill="${C.coral}" fill-opacity=".9"/>
  <path class="wave" d="M-10 220 C 120 190, 220 250, 360 222 S 600 180, 760 214 S 980 250, 1210 200" stroke="${C.mint}" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
</g>
<text x="56" y="70" class="eyebrow k3">LET'S TALK</text>
<text x="52" y="130" class="d k" font-size="46" letter-spacing="-1.8">What are we <tspan fill="${C.coral}">building</tspan> together?</text>
<g>
  <rect x="56" y="160" width="256" height="48" rx="14" fill="${C.coral}"/>
  <text x="80" y="190" class="b" font-weight="600" font-size="16" fill="${C.ink}">colasnaudi@gmail.com</text>
  <g class="arrow">${arrowRight(278, 184, C.ink)}</g>
</g>`;
  return svg(1200, 260, css, body);
}

// ---------- text measuring (advance widths extracted from the embedded fonts) ----------
const METRICS = JSON.parse(readFileSync(join(OUT, "fonts", "metrics.json"), "utf8"));
const fontKey = (weight) => (weight === "display" ? "display" : `b${weight}`);
function measure(text, weight, size, ls = 0) {
  const m = METRICS[fontKey(weight)];
  let w = 0;
  for (const ch of text) w += (m.w[ch] ?? 560) / m.upm * size + ls;
  return w;
}
// Rich text: "**bold**" segments switch to the strong style. Returns lines of [text, strong] runs.
function wrap(text, { weight, size, width, strongWeight = weight }) {
  const words = [];
  text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).forEach((part) => {
    const strong = part.startsWith("**");
    const raw = strong ? part.slice(2, -2) : part;
    raw.split(/(\s+)/).forEach((w) => {
      if (!w) return;
      if (/^\s+$/.test(w)) words.push({ space: true, strong });
      else words.push({ t: w, strong });
    });
  });
  const lines = [[]];
  let x = 0;
  const wOf = (t, strong) => measure(t, strong ? strongWeight : weight, size);
  for (const w of words) {
    const line = lines[lines.length - 1];
    if (w.space) { if (line.length) { line.push({ t: " ", strong: w.strong }); x += wOf(" ", w.strong); } continue; }
    const ww = wOf(w.t, w.strong);
    if (x + ww > width && line.length) {
      while (line.length && line[line.length - 1].t === " ") line.pop();
      lines.push([{ t: w.t, strong: w.strong }]);
      x = ww;
    } else { line.push({ t: w.t, strong: w.strong }); x += ww; }
  }
  // merge runs of the same style
  return lines.map((l) => l.reduce((acc, r) => {
    const last = acc[acc.length - 1];
    if (last && last.strong === r.strong) last.t += r.t; else acc.push({ ...r });
    return acc;
  }, []));
}
function textBlock(lines, { x, y, lh, weight, size, cls, strongWeight = weight, strongCls }) {
  return lines.map((runs, i) =>
    `<text x="${x}" y="${(y + i * lh).toFixed(1)}" class="${cls}" font-weight="${weight}" font-size="${size}">` +
    runs.map((r) => r.strong
      ? `<tspan font-weight="${strongWeight}"${strongCls ? ` class="${strongCls}"` : ""}>${esc(r.t)}</tspan>`
      : esc(r.t)).join("") + `</text>`).join("\n");
}
// arrows are drawn: the font subsets have no arrow glyph
const arrowRight = (x, y, color, s = 1) =>
  `<path d="M${x} ${y}h${12 * s}m${-5 * s} ${-5 * s}l${5 * s} ${5 * s}l${-5 * s} ${5 * s}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
const arrowUpRight = (x, y, color) =>
  `<path d="M${x} ${y + 10}L${x + 10} ${y}M${x + 2.5} ${y}H${x + 10}V${y + 7.5}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---------- buttons ----------
// variant "coral": always coral. variant "ink": ink in light mode, light in dark mode.
function button(label, { variant = "ink", icon = "external" } = {}) {
  const H = 40, padX = 18, size = 14.5, gap = 9, iconW = icon === "external" ? 10 : 12;
  const tw = measure(label, 600, size);
  const W = Math.ceil(padX + tw + gap + iconW + padX);
  const coral = variant === "coral";
  const css = FONTS.body600() + BASE_CSS + `
  .bb{fill:${coral ? C.coral : C.ink}} .bf{fill:${coral ? C.ink : C.white}} .bs{stroke:${coral ? C.ink : C.white}}
  ${coral ? "" : `@media (prefers-color-scheme: dark){ .bb{fill:${D.soft};stroke:#3A424D} .bf{fill:${D.ink}} .bs{stroke:${D.ink}} }`}
  .ic{animation:nudge 1.8s ease-in-out infinite}
  @keyframes nudge{0%,100%{transform:none}50%{transform:translate(${icon === "external" ? "2px,-2px" : "3px,0"})}}
  `;
  const ix = padX + tw + gap;
  const iconSvg = icon === "external"
    ? arrowUpRight(ix, H / 2 - 5, "").replace('stroke=""', 'class="bs"')
    : arrowRight(ix, H / 2, "").replace('stroke=""', 'class="bs"');
  return svg(W, H, css, `
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12.5" class="bb"/>
<text x="${padX}" y="${H / 2 + 5}" class="b bf" font-weight="600" font-size="${size}">${esc(label)}</text>
<g class="ic">${iconSvg}</g>`);
}

// ---------- about ----------
const ABOUT = {
  paragraphs: [
    "I'm a full-stack developer based in **Paris**, originally from the French Basque Country.",
    "I enjoy building digital products **end to end**, from architecture and backend development to user interfaces, mobile applications and deployment.",
    "I'm particularly interested in **product engineering**: understanding a problem, designing a solution and taking it all the way to production.",
    "My main areas of focus are **React, Next.js, TypeScript, React Native** and backend development.",
  ],
  facts: [
    ["EDUCATION", "Master MIAGE", "Université Toulouse Capitole"],
    ["EXPERIENCE", "4 years of work-study", "NOBATEK/INEF4 and Cegedim Assurances"],
    ["ENTREPRENEURSHIP", "Co-founder of Besta", "A digital product studio"],
    ["INDEPENDENT PRODUCT", "Building Cueflow", "A macOS app for DJs"],
  ],
  now: "Open to full-stack developer opportunities",
};
function about() {
  const W = 1200, P = 56, lw = 600, rx = 712, rw = W - P - rx;
  const css = FONTS.display() + FONTS.body400() + FONTS.body600() + BASE_CSS + `
  .dot{transform-box:fill-box;transform-origin:center;animation:ping 1.8s ease-out infinite}
  @keyframes ping{0%{transform:scale(1);opacity:.6}100%{transform:scale(3.2);opacity:0}}
  `;
  // left column
  let y = P + 40;
  const left = [];
  ABOUT.paragraphs.forEach((p, i) => {
    const lines = wrap(p, { weight: 400, strongWeight: 600, size: 20, width: lw });
    left.push(`<g class="in${Math.min(i + 1, 4)}">` + textBlock(lines, { x: P, y, lh: 31, weight: 400, size: 20, cls: "b k2", strongWeight: 600, strongCls: "k" }) + `</g>`);
    y += lines.length * 31 + 20;
  });
  const leftH = y - 20 - 31 + 10;
  // right column (facts panel)
  let ry = P + 36;
  const right = [];
  ABOUT.facts.forEach(([k, v, sub], i) => {
    right.push(`<g class="in${Math.min(i + 1, 4)}">
  <text x="${rx + 32}" y="${ry}" class="eyebrow k3">${esc(k)}</text>
  <text x="${rx + 32}" y="${ry + 27}" class="d k" font-size="21" letter-spacing="-.5">${esc(v)}</text>
  <text x="${rx + 32}" y="${ry + 50}" class="b k2" font-weight="400" font-size="15">${esc(sub)}</text>
</g>`);
    ry += 84;
    if (i < ABOUT.facts.length - 1) right.push(`<line x1="${rx + 32}" y1="${ry - 26}" x2="${rx + rw - 32}" y2="${ry - 26}" class="ln"/>`);
  });
  ry -= 8;
  const nowY = ry;
  right.push(`<g class="in4">
  <rect x="${rx + 20}" y="${nowY}" width="${rw - 40}" height="48" rx="16" fill="${C.coral}"/>
  <circle class="dot" cx="${rx + 42}" cy="${nowY + 24}" r="5" fill="${C.ink}"/>
  <circle cx="${rx + 42}" cy="${nowY + 24}" r="5" fill="${C.ink}"/>
  <text x="${rx + 58}" y="${nowY + 29.5}" class="b" font-weight="600" font-size="15" fill="${C.ink}">${esc(ABOUT.now)}</text>
</g>`);
  const panelH = nowY + 48 + 20 - P;
  const H = Math.max(leftH, panelH) + 2 * P - 36;
  const panelY = P - 16;
  return svg(W, H, css, `
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="32" class="bg ln"/>
<rect x="${rx}" y="${panelY}" width="${rw}" height="${H - 2 * panelY}" rx="24" class="sf"/>
${left.join("\n")}
${right.join("\n")}`);
}

// ---------- projects ----------
const PROJECTS = [
  {
    file: "cueflow", name: "Cueflow", eyebrow: "INDEPENDENT PRODUCT · BETA", accent: C.mint,
    tagline: "A macOS app made by a DJ, for DJs.",
    desc: "Started as a tool to improve my own DJ workflow, now tested in beta by around ten DJs, from beginners to experienced users.",
    bullets: [
      "Native macOS application built with Swift",
      "Product designed around real DJ workflows",
      "Licence management and payment flows",
      "Preparing the launch of a paid perpetual licence",
    ],
    tags: ["macOS", "Swift", "Stripe", "Product development"],
    link: { label: "Visit Cueflow", href: "https://cueflow.colasnaudi.com" },
  },
  {
    file: "besta", name: "Besta", eyebrow: "CO-FOUNDER · 15,000+ DOWNLOADS", accent: C.coral,
    tagline: "Event discovery and ticketing platform.",
    desc: "A mobile app for events and outings across the South-West of France, plus pro and admin tools for organisers and venues.",
    bullets: [
      "Cross-platform mobile app, built and maintained",
      "Professional back-office and admin area",
      "Subscriptions, ticketing and checkout with Stripe",
      "Product, technical architecture and delivery",
    ],
    tags: ["React Native", "Next.js", "TypeScript", "Supabase", "PostgreSQL", "Prisma", "Stripe"],
    link: { label: "Visit besta-app.fr", href: "https://besta-app.fr" },
  },
  {
    file: "jobhunter", name: "Job Hunter", eyebrow: "PERSONAL PROJECT · LIVE", accent: C.peach2,
    tagline: "An AI-powered job-search assistant.",
    desc: "Designed to centralise job opportunities and make the application process easier to manage.",
    bullets: [
      "Aggregates job offers from multiple sources",
      "Ranks opportunities and prepares applications",
      "AI assistance for application writing",
      "Inbox sync to keep application statuses up to date",
    ],
    tags: ["Next.js", "TypeScript", "AI", "Google Apps Script"],
    link: { label: "Visit Job Hunter", href: "https://jobhunter.colasnaudi.com" },
  },
  {
    file: "orbit", name: "ORBIT", eyebrow: "CEGEDIM ASSURANCES · AI TOOLING", accent: C.coralDark,
    tagline: "AI-assisted development tool.",
    desc: "Analyses Jira tickets by gathering context from multiple sources and document formats. My contributions:",
    bullets: [
      "Jira integration through a custom MCP server",
      "Information extraction from text and office documents",
      "Screenshot processing with Claude Vision",
      "Structuring context for ticket analysis",
    ],
    tags: ["MCP", "Jira", "GitLab", "Claude Vision", "JavaScript"],
  },
  {
    file: "lna", name: "LNA Natation", eyebrow: "CLIENT PROJECT · WITH BESTA", accent: C.mintLight,
    tagline: "iOS / Android app and web back-office.",
    desc: "A digital platform for the Ligue Nouvelle-Aquitaine de Natation.",
    bullets: [
      "Cross-platform mobile application",
      "Web back-office to manage and publish content",
      "WordPress integration through the REST API",
    ],
    tags: ["React Native", "Next.js", "WordPress REST API", "Firebase"],
  },
  {
    file: "nobatek", name: "NOBATEK/INEF4", eyebrow: "R&D · SUSTAINABLE CONSTRUCTION", accent: C.peach,
    tagline: "Software in a research and innovation environment.",
    desc: "Four years of work-study building tools for sustainable construction research.",
    bullets: [
      "Web applications for energy monitoring",
      "Unity flood simulation of Dordrecht for a European project",
      "iPad AR app showing a building's digital model on site",
    ],
    tags: ["Python", "JavaScript", "C#", "Unity", "PostgreSQL", "SQLite", "SPARQL", "AR"],
  },
];

const CARD = { W: 600, M: 8, P: 36 }; // M: transparent margin, so images placed side by side get a gutter
function layoutProject(p) {
  const { W, P } = CARD, cw = W - 2 * P, out = [];
  let y = P;
  // eyebrow pill
  const ew = measure(p.eyebrow, 600, 13, 0.78);
  out.push(`<g class="in1">
  <rect x="${P}" y="${y}" width="${(ew + 46).toFixed(1)}" height="30" rx="15" class="sf"/>
  <rect x="${P + 13}" y="${y + 10}" width="10" height="10" rx="3" fill="${p.accent === C.mintLight ? C.mint : p.accent}"/>
  <text x="${P + 32}" y="${y + 19.5}" class="eyebrow k">${esc(p.eyebrow)}</text>
</g>`);
  y += 30 + 56;
  out.push(`<text x="${P - 2}" y="${y}" class="d k in2" font-size="44" letter-spacing="-1.6">${esc(p.name)}</text>`);
  y += 36;
  const tl = wrap(p.tagline, { weight: 600, size: 19, width: cw });
  out.push(`<g class="in2">${textBlock(tl, { x: P, y, lh: 26, weight: 600, size: 19, cls: "b k" })}</g>`);
  y += (tl.length - 1) * 26 + 28;
  const dl = wrap(p.desc, { weight: 400, size: 16, width: cw });
  out.push(`<g class="in3">${textBlock(dl, { x: P, y, lh: 24, weight: 400, size: 16, cls: "b k2" })}</g>`);
  y += (dl.length - 1) * 24 + 22;
  out.push(`<line x1="${P}" y1="${y}" x2="${W - P}" y2="${y}" class="ln in3"/>`);
  y += 32;
  const bl = [];
  for (const b of p.bullets) {
    const lines = wrap(b, { weight: 500, size: 15.5, width: cw - 22 });
    bl.push(`<rect x="${P}" y="${y - 9}" width="8" height="8" rx="2.5" fill="${C.coral}"/>`);
    bl.push(textBlock(lines, { x: P + 22, y, lh: 22, weight: 500, size: 15.5, cls: "b k" }));
    y += lines.length * 22 + 10;
  }
  out.push(`<g class="in3">${bl.join("\n")}</g>`);
  y += 14;
  // tag pills
  let tx = P;
  const tags = [];
  for (const t of p.tags) {
    const w = measure(t, 500, 13.5) + 26;
    if (tx + w > W - P) { tx = P; y += 38; }
    tags.push(`<rect x="${tx.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="30" rx="10" class="sf"/>
<text x="${(tx + 13).toFixed(1)}" y="${y + 19.7}" class="b k" font-weight="500" font-size="13.5">${esc(t)}</text>`);
    tx += w + 8;
  }
  out.push(`<g class="in4">${tags.join("\n")}</g>`);
  y += 30;
  return { body: out.join("\n"), contentH: y + P };
}
function projectCard(p, H) {
  const { W, M, P } = CARD;
  const { body } = layoutProject(p);
  let link = "";
  if (p.link) {
    const tw = measure(p.link.label, 600, 15);
    const bw = 22 + tw + 10 + 10 + 22, by = H - P - 46;
    link = `<g class="in4">
  <rect x="${P}" y="${by}" width="${bw.toFixed(1)}" height="46" rx="15" fill="${C.coral}"/>
  <text x="${P + 22}" y="${by + 28.5}" class="b" font-weight="600" font-size="15" fill="${C.ink}">${esc(p.link.label)}</text>
  <g class="ic">${arrowUpRight(P + 22 + tw + 10, by + 18, C.ink)}</g>
</g>`;
  }
  const ringFill = p.accent;
  const css = FONTS.display() + FONTS.body400() + FONTS.body500() + FONTS.body600() + BASE_CSS + `
  .ring{transform-origin:${W - 30}px 10px;animation:breathe 6s ease-in-out infinite}
  @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  .ic{animation:nudge 1.8s ease-in-out infinite}
  @keyframes nudge{0%,100%{transform:none}50%{transform:translate(2px,-2px)}}
  `;
  return svg(W + 2 * M, H + 2 * M, css, `
<g transform="translate(${M} ${M})">
<defs><clipPath id="c"><rect width="${W}" height="${H}" rx="28"/></clipPath></defs>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="28" class="bg ln"/>
<g clip-path="url(#c)"><g class="ring">
  <circle cx="${W - 30}" cy="10" r="96" stroke="${ringFill}" stroke-opacity=".9" stroke-width="18"/>
  <circle cx="${W - 30}" cy="10" r="56" fill="${ringFill}" fill-opacity=".9"/>
</g></g>
${body}
${link}
</g>`);
}
function projects() {
  const out = [];
  for (let i = 0; i < PROJECTS.length; i += 2) {
    const row = PROJECTS.slice(i, i + 2);
    const H = Math.max(...row.map((p) => layoutProject(p).contentH + (p.link ? 46 + 28 : 0)));
    for (const p of row) out.push([`project-${p.file}.svg`, projectCard(p, H)]);
  }
  return out;
}

// ---------- tech stack ----------
const STACK = [
  ["FRONTEND & MOBILE", "react,nextjs,ts,js,tailwind,html,css,swift"],
  ["BACKEND & DATA", "nodejs,java,spring,postgres,supabase,prisma,firebase,py"],
  ["TOOLS & INFRA", "git,github,gitlab,docker,vercel,figma,postman,wordpress"],
];
async function stack() {
  const W = 1200, P = 32, gap = 20, colW = (W - 2 * P - 2 * gap) / 3, H = 272;
  const cols = await Promise.all(STACK.map(async ([label, icons], i) => {
    const get = async (theme) => {
      const res = await fetch(`https://skillicons.dev/icons?i=${icons}&theme=${theme}&perline=4`);
      if (!res.ok) throw new Error(`skillicons: ${res.status}`);
      return res.text();
    };
    const [src, srcDark] = await Promise.all([get("light"), get("dark")]);
    const vb = src.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const iw = 280, ih = iw * (+vb[2] / +vb[1]);
    const x = P + i * (colW + gap);
    return `<g class="in${i + 1}">
  <rect x="${x}" y="${P}" width="${colW}" height="${H - 2 * P}" rx="24" class="sf"/>
  <text x="${x + colW / 2}" y="${P + 40}" text-anchor="middle" class="eyebrow k3">${esc(label)}</text>
  <image class="il" x="${(x + (colW - iw) / 2).toFixed(1)}" y="${P + 62}" width="${iw}" height="${ih.toFixed(1)}" href="data:image/svg+xml;base64,${Buffer.from(src).toString("base64")}"/>
  <image class="id" x="${(x + (colW - iw) / 2).toFixed(1)}" y="${P + 62}" width="${iw}" height="${ih.toFixed(1)}" href="data:image/svg+xml;base64,${Buffer.from(srcDark).toString("base64")}"/>
</g>`;
  }));
  const css = FONTS.body600() + BASE_CSS +
    `.id{display:none} @media (prefers-color-scheme: dark){ .il{display:none} .id{display:inline} }`;
  return svg(W, H, css, `
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="32" class="bg ln"/>
${cols.join("\n")}`);
}

// ---------- stats ----------
async function gql(query, variables) {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error("GH_TOKEN is missing");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "profile-stats" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchStats() {
  const data = await gql(
    `query($login:String!){
      user(login:$login){
        followers{totalCount}
        contributionsCollection{
          totalCommitContributions totalPullRequestContributions totalIssueContributions restrictedContributionsCount
          contributionCalendar{ totalContributions weeks{ contributionDays{ contributionCount date } } }
        }
        repositories(ownerAffiliations:OWNER,isFork:false,first:100,orderBy:{field:PUSHED_AT,direction:DESC}){
          totalCount
          nodes{ stargazerCount languages(first:10,orderBy:{field:SIZE,direction:DESC}){ edges{ size node{ name } } } }
        }
      }
    }`,
    { login: USER },
  );
  const u = data.user;
  const cc = u.contributionsCollection;
  const langs = {};
  let stars = 0;
  for (const r of u.repositories.nodes) {
    stars += r.stargazerCount;
    for (const e of r.languages.edges) langs[e.node.name] = (langs[e.node.name] || 0) + e.size;
  }
  return {
    contributions: cc.contributionCalendar.totalContributions,
    commits: cc.totalCommitContributions + cc.restrictedContributionsCount,
    prs: cc.totalPullRequestContributions,
    repos: u.repositories.totalCount,
    stars,
    weeks: cc.contributionCalendar.weeks.map((w) => w.contributionDays.reduce((s, d) => s + d.contributionCount, 0)),
    langs,
  };
}

const fmt = (n) => n.toLocaleString("en-US");

function statsCard(s) {
  const W = 1200, H = 480, P = 48;
  const css =
    FONTS.display() + FONTS.body400() + FONTS.body500() + FONTS.body600() + BASE_CSS +
    `
  .draw{stroke-dasharray:3000;animation:draw 2.2s cubic-bezier(.4,0,.2,1) .3s backwards}
  @keyframes draw{from{stroke-dashoffset:3000}}
  .area{animation:fade 1s ease 1.4s backwards}
  @keyframes fade{from{opacity:0}}
  .grow{transform-box:fill-box;transform-origin:left;animation:grow 1.2s cubic-bezier(.2,.8,.2,1) .4s backwards}
  @keyframes grow{from{transform:scaleX(0)}}
  .ar{fill:${C.peach};fill-opacity:.55}
  @media (prefers-color-scheme: dark){ .ar{fill:${C.coral};fill-opacity:.16} }
  `;

  // tiles
  const tiles = [
    ["Contributions", s.contributions, "last 12 months"],
    ["Commits", s.commits, "last 12 months"],
    ["Pull requests", s.prs, "last 12 months"],
    ["Public repos", s.repos, `${fmt(s.stars)} stars`],
  ];
  const tw = (W - 2 * P - 3 * 16) / 4;
  const tileSvg = tiles
    .map(([label, val, sub], i) => {
      const x = P + i * (tw + 16);
      const hl = i === 0;
      return `<g class="in${Math.min(i + 1, 4)}">
  <rect x="${x}" y="72" width="${tw}" height="120" rx="20" ${hl ? `fill="${C.coral}"` : `class="sf"`}/>
  <text x="${x + 22}" y="104" class="eyebrow${hl ? "" : " k"}" fill="${C.ink}">${esc(label.toUpperCase())}</text>
  <text x="${x + 20}" y="158" class="d${hl ? "" : " k"}" font-size="46" letter-spacing="-1.6" fill="${C.ink}">${fmt(val)}</text>
  <text x="${x + 22}" y="180" class="b${hl ? "" : " k3"}" font-weight="500" font-size="13" fill="${C.ink}">${esc(sub)}</text>
</g>`;
    })
    .join("\n");

  // weekly contributions chart
  const cx = P, cy = 236, cw = 640, ch = 220;
  const weeks = s.weeks.slice(-52);
  const max = Math.max(1, ...weeks);
  const pts = weeks.map((v, i) => [cx + (i / Math.max(1, weeks.length - 1)) * cw, cy + ch - 34 - (v / max) * (ch - 70)]);
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = `${path} L ${cx + cw} ${cy + ch - 34} L ${cx} ${cy + ch - 34} Z`;
  const peak = pts[weeks.indexOf(max)];
  const chart = `
<g>
  <text x="${cx}" y="${cy + 6}" class="eyebrow k3">WEEKLY CONTRIBUTIONS</text>
  <line x1="${cx}" y1="${cy + ch - 34}" x2="${cx + cw}" y2="${cy + ch - 34}" class="ln"/>
  <path class="area ar" d="${area}"/>
  <path class="draw" d="${path}" stroke="${C.coral}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <g class="area">
    <circle cx="${peak[0]}" cy="${peak[1]}" r="6" class="bg ks" stroke-width="2.5"/>
    <text x="${Math.min(peak[0], cx + cw - 80)}" y="${peak[1] - 14}" class="b k" font-weight="600" font-size="13">peak: ${fmt(max)}</text>
  </g>
  <text x="${cx}" y="${cy + ch - 10}" class="b k3" font-size="13">12 months ago</text>
  <text x="${cx + cw}" y="${cy + ch - 10}" text-anchor="end" class="b k3" font-size="13">this week</text>
</g>`;

  // languages
  const lx = 736, lw = W - P - lx;
  const total = Object.values(s.langs).reduce((a, b) => a + b, 0) || 1;
  let top = Object.entries(s.langs).sort((a, b) => b[1] - a[1]);
  const rest = top.slice(5).reduce((a, [, v]) => a + v, 0);
  top = top.slice(0, 5);
  if (rest > 0) top.push(["Other", rest]);
  const palette = [C.coral, C.ink, C.mint, C.peach2, C.coralDark, C.muted];
  let acc = 0;
  const segs = top
    .map(([name, v], i) => {
      const w = (v / total) * lw;
      const r = `<rect x="${(lx + acc).toFixed(1)}" y="${cy + 28}" width="${Math.max(w - 3, 2).toFixed(1)}" height="18" rx="5" fill="${palette[i]}"${palette[i] === C.ink ? ` class="k"` : ""}/>`;
      acc += w;
      return r;
    })
    .join("");
  const legend = top
    .map(([name, v], i) => {
      const y = cy + 86 + i * 24;
      return `<g class="in${Math.min(i + 1, 4)}">
  <rect x="${lx}" y="${y - 10}" width="12" height="12" rx="3.5" fill="${palette[i]}"${palette[i] === C.ink ? ` class="k"` : ""}/>
  <text x="${lx + 22}" y="${y}" class="b k" font-weight="500" font-size="15">${esc(name)}</text>
  <text x="${lx + lw}" y="${y}" text-anchor="end" class="b k3" font-size="15">${((v / total) * 100).toFixed(1)}%</text>
</g>`;
    })
    .join("\n");
  const langs = `
<g>
  <text x="${lx}" y="${cy + 6}" class="eyebrow k3">MOST USED LANGUAGES</text>
  <g class="grow">${segs}</g>
  ${legend}
</g>`;

  const updated = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const body = `
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="32" class="bg ln"/>
<text x="${P}" y="50" class="eyebrow k3">GITHUB · @${esc(USER.toUpperCase())}</text>
<text x="${W - P}" y="50" text-anchor="end" class="b km" font-size="13">updated ${esc(updated)}</text>
${tileSvg}
${chart}
${langs}`;
  return svg(W, H, css, body);
}

function statsPlaceholder() {
  const css = FONTS.display() + FONTS.body500() + FONTS.body600() + BASE_CSS;
  return svg(1200, 200, css, `
<rect x=".5" y=".5" width="1199" height="199" rx="32" class="bg ln"/>
<text x="48" y="64" class="eyebrow k3">GITHUB · @${esc(USER.toUpperCase())}</text>
<text x="46" y="118" class="d k" font-size="36" letter-spacing="-1.2">Stats are <tspan fill="${C.coral}">on their way</tspan>.</text>
<text x="48" y="152" class="b k2" font-weight="500" font-size="16">Run the “Update profile” workflow once in the Actions tab to generate this card.</text>`);
}

// ---------- main ----------
if (process.argv.includes("--stats")) {
  const s = process.env.MOCK ? JSON.parse(readFileSync(process.env.MOCK, "utf8")) : await fetchStats();
  write("stats.svg", statsCard(s));
} else {
  write("header.svg", header());
  write("title-about.svg", section("01", "ABOUT", "Developer, co-founder, ", "and a bit of a designer."));
  write("title-projects.svg", section("02", "SELECTED WORK", "Projects ", "in production", "."));
  write("title-stack.svg", section("03", "TECH STACK", "My everyday ", "tools", "."));
  write("title-activity.svg", section("04", "GITHUB ACTIVITY", "What I've been ", "shipping", "."));
  write("footer.svg", footer());
  write("about.svg", about());
  for (const [name, content] of projects()) write(name, content);
  write("stack.svg", await stack());
  write("btn-malt.svg", button("Find me on Malt", { variant: "coral" }));
  write("btn-portfolio.svg", button("Portfolio"));
  write("btn-linkedin.svg", button("LinkedIn"));
  write("btn-email.svg", button("colasnaudi@gmail.com", { icon: "arrow" }));
  // never overwrite the real card generated by the workflow
  if (!existsSync(join(OUT, "stats.svg"))) write("stats.svg", statsPlaceholder());
}
