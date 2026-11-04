// Generates the SVG visuals of the GitHub profile README, in the colasnaudi.com theme.
//   node scripts/build.mjs           -> static visuals (header, section titles, footer)
//   node scripts/build.mjs --stats   -> GitHub stats card (needs GH_TOKEN)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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
  const body = `
<defs><clipPath id="card"><rect x="820" y="36" width="344" height="388" rx="28"/></clipPath></defs>
<rect x=".5" y=".5" width="1199" height="459" rx="32" fill="${C.white}" stroke="${C.line}"/>

<!-- mint dashed loop, like the site -->
<path class="loop" d="M-10 440 C 110 420, 210 400, 300 420 S 280 470, 230 456 S 330 400, 480 418 S 700 462, 800 436" stroke="${C.mint}" stroke-width="2" stroke-linecap="round" opacity=".8"/>

<!-- logo + wordmark -->
<g class="in1">
  <rect x="48" y="44" width="40" height="40" rx="11" fill="${C.coral}"/>
  <text x="68" y="71" text-anchor="middle" class="d" font-size="18" letter-spacing="-.6" fill="${C.ink}">CN</text>
  <text x="100" y="72" class="d" font-size="22" letter-spacing="-.6" fill="${C.ink}">colas naudi</text>
</g>

<!-- availability pill -->
<g class="in2">
  <rect x="48" y="140" width="358" height="40" rx="20" fill="${C.soft}"/>
  <circle class="dot" cx="72" cy="160" r="4.5" fill="${C.coral}"/>
  <circle cx="72" cy="160" r="4.5" fill="${C.coral}"/>
  <text x="88" y="165.5" class="b" font-weight="600" font-size="15" fill="${C.ink}">Full-stack developer · Paris &amp; remote</text>
</g>

<!-- headline -->
<g class="in3">
  <text class="d" font-size="64" letter-spacing="-2.6" fill="${C.ink}">
    <tspan x="44" y="262">Web &amp; mobile apps</tspan>
    <tspan x="44" y="330"><tspan fill="${C.coral}">built to last</tspan>.</tspan>
  </text>
</g>
<g class="in4">
  <text x="48" y="384" class="b" font-weight="500" font-size="19" fill="${C.text2}">From idea to production, with React, Next.js, React Native and TypeScript.</text>
</g>

<!-- featured project card -->
<g class="in4">
  <g clip-path="url(#card)">
    <rect x="820" y="36" width="344" height="388" fill="${C.coral}"/>
    <g class="ring">
      <circle cx="1068" cy="120" r="118" stroke="${C.white}" stroke-opacity=".22" stroke-width="22"/>
      <circle cx="1068" cy="120" r="74" fill="${C.white}" fill-opacity=".22"/>
    </g>
    <path class="wave" d="M800 268 C 860 290, 900 250, 960 262 S 1060 230, 1110 236 S 1170 250, 1190 244" stroke="${C.white}" stroke-opacity=".75" stroke-width="2" stroke-linecap="round"/>
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
<g clip-path="url(#f)">
  <rect width="1200" height="260" fill="${C.ink}"/>
  <circle cx="1110" cy="40" r="150" stroke="${C.coral}" stroke-opacity=".9" stroke-width="22"/>
  <circle cx="1110" cy="40" r="92" fill="${C.coral}" fill-opacity=".9"/>
  <path class="wave" d="M-10 220 C 120 190, 220 250, 360 222 S 600 180, 760 214 S 980 250, 1210 200" stroke="${C.mint}" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
</g>
<text x="56" y="70" class="eyebrow" fill="${C.muted}">LET'S TALK</text>
<text x="52" y="130" class="d" font-size="46" letter-spacing="-1.8" fill="${C.white}">What are we <tspan fill="${C.coral}">building</tspan> together?</text>
<g>
  <rect x="56" y="160" width="256" height="48" rx="14" fill="${C.coral}"/>
  <text x="80" y="190" class="b" font-weight="600" font-size="16" fill="${C.ink}">colasnaudi@gmail.com</text>
  <g class="arrow"><text x="280" y="190" class="b" font-weight="600" font-size="16" fill="${C.ink}">→</text></g>
</g>`;
  return svg(1200, 260, css, body);
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
  <rect x="${x}" y="72" width="${tw}" height="120" rx="20" fill="${hl ? C.coral : C.soft}"/>
  <text x="${x + 22}" y="104" class="eyebrow" fill="${C.ink}">${esc(label.toUpperCase())}</text>
  <text x="${x + 20}" y="158" class="d" font-size="46" letter-spacing="-1.6" fill="${C.ink}">${fmt(val)}</text>
  <text x="${x + 22}" y="180" class="b" font-weight="500" font-size="13" fill="${hl ? C.ink : C.text3}">${esc(sub)}</text>
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
  <text x="${cx}" y="${cy + 6}" class="eyebrow" fill="${C.text3}">WEEKLY CONTRIBUTIONS</text>
  <line x1="${cx}" y1="${cy + ch - 34}" x2="${cx + cw}" y2="${cy + ch - 34}" stroke="${C.line}"/>
  <path class="area" d="${area}" fill="${C.peach}" fill-opacity=".55"/>
  <path class="draw" d="${path}" stroke="${C.coral}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <g class="area">
    <circle cx="${peak[0]}" cy="${peak[1]}" r="6" fill="${C.white}" stroke="${C.ink}" stroke-width="2.5"/>
    <text x="${Math.min(peak[0], cx + cw - 80)}" y="${peak[1] - 14}" class="b" font-weight="600" font-size="13" fill="${C.ink}">peak: ${fmt(max)}</text>
  </g>
  <text x="${cx}" y="${cy + ch - 10}" class="b" font-size="13" fill="${C.text3}">12 months ago</text>
  <text x="${cx + cw}" y="${cy + ch - 10}" text-anchor="end" class="b" font-size="13" fill="${C.text3}">this week</text>
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
      const r = `<rect x="${(lx + acc).toFixed(1)}" y="${cy + 28}" width="${Math.max(w - 3, 2).toFixed(1)}" height="18" rx="5" fill="${palette[i]}"/>`;
      acc += w;
      return r;
    })
    .join("");
  const legend = top
    .map(([name, v], i) => {
      const y = cy + 86 + i * 24;
      return `<g class="in${Math.min(i + 1, 4)}">
  <rect x="${lx}" y="${y - 10}" width="12" height="12" rx="3.5" fill="${palette[i]}"/>
  <text x="${lx + 22}" y="${y}" class="b" font-weight="500" font-size="15" fill="${C.ink}">${esc(name)}</text>
  <text x="${lx + lw}" y="${y}" text-anchor="end" class="b" font-size="15" fill="${C.text3}">${((v / total) * 100).toFixed(1)}%</text>
</g>`;
    })
    .join("\n");
  const langs = `
<g>
  <text x="${lx}" y="${cy + 6}" class="eyebrow" fill="${C.text3}">MOST USED LANGUAGES</text>
  <g class="grow">${segs}</g>
  ${legend}
</g>`;

  const updated = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const body = `
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="32" fill="${C.white}" stroke="${C.line}"/>
<text x="${P}" y="50" class="eyebrow" fill="${C.text3}">GITHUB · @${esc(USER.toUpperCase())}</text>
<text x="${W - P}" y="50" text-anchor="end" class="b" font-size="13" fill="${C.muted}">updated ${esc(updated)}</text>
${tileSvg}
${chart}
${langs}`;
  return svg(W, H, css, body);
}

function statsPlaceholder() {
  const css = FONTS.display() + FONTS.body500() + FONTS.body600() + BASE_CSS;
  return svg(1200, 200, css, `
<rect x=".5" y=".5" width="1199" height="199" rx="32" fill="${C.white}" stroke="${C.line}"/>
<text x="48" y="64" class="eyebrow" fill="${C.text3}">GITHUB · @${esc(USER.toUpperCase())}</text>
<text x="46" y="118" class="d" font-size="36" letter-spacing="-1.2" fill="${C.ink}">Stats are <tspan fill="${C.coral}">on their way</tspan>.</text>
<text x="48" y="152" class="b" font-weight="500" font-size="16" fill="${C.text2}">Run the “Update profile” workflow once in the Actions tab to generate this card.</text>`);
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
  write("stats.svg", statsPlaceholder());
}
