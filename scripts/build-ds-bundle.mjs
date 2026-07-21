import fs from 'node:fs';
import path from 'node:path';

const SITE = new URL('..', import.meta.url).pathname;
const OUT = new URL('../ds-bundle', import.meta.url).pathname;

const tokens = fs
  .readFileSync(path.join(SITE, 'src/styles/tokens.css'), 'utf8')
  .replace(/@import[^;]+;/g, '');
const theme = fs.readFileSync(path.join(SITE, 'src/styles/theme.css'), 'utf8');

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@100..900&display=swap" rel="stylesheet">`;

const BASE = `
/* Google-Fonts names override the fontsource names used in production */
:root {
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  padding: 24px;
}
h1,h2,h3,h4 {
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}
a { color: var(--color-link); }
.eyebrow {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-accent);
}
.ds-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-muted);
}
.ds-section { margin-block-start: 28px; }
.ds-section:first-child { margin-block-start: 0; }
.ds-section > h2 { font-size: var(--text-md); margin-block-end: 12px; }
`;

function page({ group, name, subtitle, width, height }, css, body) {
  const meta = [
    `group="${group}"`,
    `name="${name}"`,
    subtitle ? `subtitle="${subtitle}"` : '',
    `width="${width}"`,
    height ? `height="${height}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `<!-- @dsCard ${meta} -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name}</title>${FONTS}
<style>
${tokens}
${theme}
${BASE}
${css}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

const files = {};

/* ---------------- Colors ---------------- */
const ramps = {
  neutral: ['0','25','50','100','200','300','500','600','800','900'],
  magenta: ['50','100','200','300','400','600','800'],
  state: ['confirmed','review','stopped'],
  dark: ['page','surface','fill','border','border-control','text-muted','text-secondary','text-primary'],
};
const rampHtml = Object.entries(ramps)
  .map(
    ([name, steps]) => `
  <div class="ds-section"><h2>--${name}-*</h2>
  <div class="ramp">${steps
    .map(
      (s) =>
        `<div class="swatch"><div class="chip" style="background:var(--${name}-${s})"></div><span class="ds-label">${s}</span></div>`
    )
    .join('')}</div></div>`
  )
  .join('');
const semantic = [
  'color-bg','color-bg-raised','color-bg-subtle','color-bg-inverse',
  'color-text','color-text-secondary','color-text-muted',
  'color-accent','color-accent-strong','color-accent-subtle',
  'color-status-confirmed','color-status-review','color-status-stopped',
  'color-border','color-link',
];
files['tokens/colors.html'] = page(
  { group: 'Colors', name: 'Color tokens', subtitle: 'Primitive ramps + semantic roles (auto dark mode)', width: 900, height: 760 },
  `.ramp { display: flex; gap: 6px; flex-wrap: wrap; }
   .swatch { text-align: center; }
   .chip { width: 52px; height: 40px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
   .sem { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
   .sem .chip { width: 100%; height: 44px; }`,
  `<div class="ds-section"><h2>Semantic (use these in components)</h2>
   <div class="sem">${semantic
     .map(
       (t) =>
         `<div class="swatch"><div class="chip" style="background:var(--${t})"></div><span class="ds-label">--${t}</span></div>`
     )
     .join('')}</div></div>
   ${rampHtml}`
);

/* ---------------- Typography ---------------- */
const scale = ['3xl','2xl','xl','lg','md','base','sm','xs'];
files['tokens/typography.html'] = page(
  { group: 'Type', name: 'Type scale', subtitle: 'Fraunces display + Inter body, fluid clamp() sizes', width: 900, height: 720 },
  `.spec { display: grid; gap: 18px; }
   .row { display: grid; grid-template-columns: 90px 1fr; gap: 16px; align-items: baseline; border-block-end: 1px solid var(--color-border); padding-block-end: 14px; }
   .sample-display { font-family: var(--font-display); font-weight: var(--weight-semibold); letter-spacing: var(--tracking-tight); line-height: var(--leading-tight); }
   .sample-body { font-family: var(--font-body); line-height: var(--leading-normal); }`,
  `<div class="spec">
   ${scale
     .map(
       (s, i) =>
         `<div class="row"><span class="ds-label">--text-${s}</span><span class="${i < 4 ? 'sample-display' : 'sample-body'}" style="font-size:var(--text-${s})">Complex things, made clear</span></div>`
     )
     .join('')}
   <div class="row"><span class="ds-label">.eyebrow</span><span class="eyebrow">Methodology</span></div>
   <div class="row"><span class="ds-label">body copy</span><p class="sample-body" style="max-width:60ch">I start with people and outcomes. Research frames the problem and shapes measurable goals. I turn insights into a roadmap and make sure strategy shows up in what ships.</p></div>
   </div>`
);

/* ---------------- Spacing / radii / elevation ---------------- */
files['tokens/spacing.html'] = page(
  { group: 'Spacing', name: 'Space, radius & elevation', subtitle: '4px-grid space scale, radii, shadows', width: 900, height: 640 },
  `.bars { display: grid; gap: 8px; }
   .barrow { display: grid; grid-template-columns: 90px 1fr; align-items: center; gap: 12px; }
   .bar { height: 14px; background: var(--color-accent); border-radius: 2px; }
   .boxes { display: flex; gap: 20px; align-items: flex-end; flex-wrap: wrap; }
   .box { width: 110px; height: 80px; background: var(--color-bg-raised); border: 1px solid var(--color-border); display: grid; place-items: end center; padding-block-end: 6px; }`,
  `<div class="ds-section"><h2>Space scale</h2><div class="bars">
   ${[1,2,3,4,5,6,7,8,9]
     .map(
       (n) =>
         `<div class="barrow"><span class="ds-label">--space-${n}</span><div class="bar" style="width:var(--space-${n})"></div></div>`
     )
     .join('')}</div></div>
   <div class="ds-section"><h2>Radii</h2><div class="boxes">
   ${['sm','md','lg']
     .map((r) => `<div class="box" style="border-radius:var(--radius-${r})"><span class="ds-label">--radius-${r}</span></div>`)
     .join('')}
   <div class="box" style="border-radius:var(--radius-full);width:80px;height:80px"><span class="ds-label">full</span></div></div></div>
   <div class="ds-section"><h2>Elevation</h2><div class="boxes">
   ${['sm','md','lg']
     .map((s) => `<div class="box" style="border:none;box-shadow:var(--shadow-${s});border-radius:var(--radius-md)"><span class="ds-label">--shadow-${s}</span></div>`)
     .join('')}</div></div>`
);

/* ---------------- Button ---------------- */
files['components/button.html'] = page(
  { group: 'Components', name: 'Button', subtitle: 'Primary pill + secondary outline, light & dark', width: 560, height: 320 },
  `.button { display: inline-flex; align-items: center; gap: 8px; padding: var(--space-3) var(--space-6); background: var(--button-bg); color: var(--button-text); font-weight: var(--weight-semibold); font-size: var(--text-sm); text-decoration: none; border-radius: var(--button-radius); transition: background var(--duration-fast) var(--ease-out); }
   .button:hover { background: var(--button-bg-hover); }
   .button--secondary { background: transparent; border: 1.5px solid var(--button-2-border); color: var(--button-2-text); }
   .rowset { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
   .darkband { margin-top: 20px; padding: 20px; border-radius: var(--radius-md); background: var(--gradient-page); }`,
  `<div class="rowset">
     <a class="button" href="#">Explore the work →</a>
     <a class="button button--secondary" href="#">About me</a>
   </div>
   <div class="darkband" data-theme="dark">
     <div class="rowset">
       <a class="button" href="#">Explore the work →</a>
       <a class="button button--secondary" href="#">About me</a>
     </div>
   </div>
   <p class="ds-label" style="margin-top:14px">tokens: --button-bg · --button-bg-hover · --button-text · --button-2-border · --button-2-text</p>`
);

/* ---------------- Value card ---------------- */
files['components/value-card.html'] = page(
  { group: 'Components', name: 'Value card', subtitle: 'Homepage "how I work" pillars', width: 460, height: 340 },
  `.value-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--card-radius); padding: var(--space-6); box-shadow: var(--card-shadow); max-width: 380px; }
   .value-card__title { font-size: var(--text-lg); }
   .value-card__title::after { content: ''; display: block; width: 2.5rem; height: 3px; margin-block-start: var(--space-3); background: var(--color-accent); border-radius: var(--radius-full); }
   .value-card__body { margin-block-start: var(--space-4); color: var(--color-text-secondary); }`,
  `<article class="value-card">
     <h3 class="value-card__title">Evidence-led product strategy</h3>
     <p class="value-card__body">I start with people and outcomes. Research frames the problem and shapes measurable goals.</p>
   </article>`
);

/* ---------------- Work card ---------------- */
files['components/work-card.html'] = page(
  { group: 'Components', name: 'Work card', subtitle: 'Case study tile on /work', width: 420, height: 540 },
  `.work-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--card-radius); overflow: hidden; box-shadow: var(--card-shadow); max-width: 360px; transition: box-shadow var(--duration-base) var(--ease-out); }
   .work-card:hover { box-shadow: var(--card-shadow-hover); }
   .work-card a { display: block; color: inherit; text-decoration: none; }
   .media { aspect-ratio: 8/5; display: grid; place-items: center; font-family: var(--font-display); font-size: var(--text-3xl); color: var(--neutral-600); background: linear-gradient(135deg, var(--neutral-50), var(--neutral-100)); }
   .body { padding: var(--space-5); }
   .title { margin-block-start: var(--space-2); font-size: var(--text-lg); }
   .tagline { margin-block-start: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-sm); }
   .cta { display: inline-block; margin-block-start: var(--space-4); font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-link); }`,
  `<article class="work-card"><a href="#">
     <div class="media" aria-hidden="true">V</div>
     <div class="body">
       <p class="eyebrow">Virgin Pulse</p>
       <h3 class="title">Modular, scalable platform strategy</h3>
       <p class="tagline">Transforming a B2B2C wellness platform into a configurable health management solution.</p>
       <span class="cta">Read case study →</span>
     </div></a>
   </article>`
);

/* ---------------- Site header ---------------- */
files['components/site-header.html'] = page(
  { group: 'Components', name: 'Site header', subtitle: 'Sticky, blurred, active-page underline', width: 1100, height: 140 },
  `body { padding: 0; }
   .header { background: var(--header-bg); backdrop-filter: blur(12px); border-block-end: 1px solid var(--header-border); }
   .inner { display: flex; align-items: center; justify-content: space-between; min-height: 4rem; padding-inline: var(--container-pad); }
   .brand { font-family: var(--font-display); font-size: var(--text-md); font-weight: var(--weight-bold); color: var(--color-text); text-decoration: none; }
   .nav { display: flex; gap: var(--space-5); list-style: none; margin: 0; padding: 0; }
   .nav a { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--color-text-secondary); text-decoration: none; padding-block: var(--space-2); border-block-end: 2px solid transparent; }
   .nav a[aria-current='page'] { color: var(--color-text); border-block-end-color: var(--color-accent); }`,
  `<header class="header"><div class="inner">
     <a class="brand" href="#">Deanna Glaze</a>
     <ul class="nav">
       <li><a href="#" aria-current="page">Home</a></li>
       <li><a href="#">Work</a></li>
       <li><a href="#">About</a></li>
       <li><a href="#">Design Resources</a></li>
     </ul>
   </div></header>`
);

/* ---------------- Site footer ---------------- */
files['components/site-footer.html'] = page(
  { group: 'Components', name: 'Site footer', subtitle: 'Slim dark bar — brand + social', width: 1100, height: 280 },
  `body { padding: 0; }
   .footer { background: var(--footer-bg); color: var(--footer-text); padding: var(--space-7) var(--container-pad) var(--space-5); }
   .inner { display: flex; align-items: center; justify-content: space-between; gap: var(--space-6); flex-wrap: wrap; }
   .brand { font-family: var(--font-display); font-size: var(--text-md); font-weight: var(--weight-bold); }
   .tag { margin-block-start: var(--space-2); font-size: var(--text-sm); color: var(--footer-text-muted); max-width: 36ch; }
   ul { list-style: none; margin: 0; padding: 0; display: flex; gap: var(--space-5); }
   ul a { color: var(--footer-text-secondary); font-size: var(--text-sm); text-decoration: none; }
   .meta { margin-block-start: var(--space-6); font-size: var(--text-xs); color: var(--footer-text-muted); }`,
  `<footer class="footer">
     <div class="inner">
       <div><p class="brand">Deanna Glaze</p><p class="tag">Making complex things clear with words, systems, and AI strategy.</p></div>
       <ul><li><a href="#">LinkedIn</a></li><li><a href="#">Instagram</a></li></ul>
     </div>
     <p class="meta">© 2026 Deanna Glaze. All rights reserved.</p>
   </footer>`
);

/* ---------------- Hero (dark band) ---------------- */
files['components/hero.html'] = page(
  { group: 'Components', name: 'Hero', subtitle: '3c gradient canvas, glass circle, accent on buttons only', width: 1200, height: 560 },
  `body { padding: 0; background: var(--gradient-page); }
   .hero { color: var(--color-text); display: grid; grid-template-columns: 1.55fr 0.9fr; gap: var(--space-8); align-items: center; padding: var(--space-8) var(--space-7); }
   .eyebrow-hero { display: inline-flex; align-items: center; gap: 9px; font-size: 0.8125rem; font-weight: var(--weight-semibold); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: var(--space-5); }
   .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-text-muted); }
   .hero h1 { font-size: var(--text-3xl); line-height: var(--leading-hero); max-width: 16ch; }
   .hero h1 em { font-style: italic; }
   .sub { margin-top: var(--space-6); font-size: var(--text-md); color: var(--color-text-secondary); max-width: 52ch; }
   .actions { display: flex; gap: var(--space-4); margin-top: var(--space-7); }
   .button { display: inline-flex; align-items: center; gap: 8px; padding: var(--space-3) var(--space-6); background: var(--button-bg); color: var(--button-text); font-weight: var(--weight-semibold); font-size: var(--text-sm); text-decoration: none; border-radius: var(--button-radius); }
   .button--secondary { background: transparent; border: 1.5px solid var(--button-2-border); color: var(--button-2-text); }
   .circle { width: 240px; height: 240px; border-radius: 50%; background: var(--color-bg-raised); border: 1px solid var(--color-border-control); display: grid; place-items: center; justify-self: center; }
   .monogram { font-family: var(--font-display); font-size: 5rem; font-weight: var(--weight-semibold); color: var(--color-text); }`,
  `<section class="hero" data-theme="dark">
     <div>
       <p class="eyebrow-hero"><span class="dot"></span>Product Design Leader · AI-UX</p>
       <h1>I make complex things clear with words, systems, and <em>AI strategy</em>.</h1>
       <p class="sub">Two decades leading UX research, design teams, and product strategy — now helping teams ship AI experiences people actually trust.</p>
       <div class="actions"><a class="button" href="#">Explore the work →</a><a class="button button--secondary" href="#">About me</a></div>
     </div>
     <div class="circle"><span class="monogram">DG</span></div>
   </section>`
);

/* ---------------- Work row (home showcase) ---------------- */
files['components/work-row.html'] = page(
  { group: 'Components', name: 'Work row', subtitle: 'Glass rows on the gradient — accent only on the metric chip', width: 1200, height: 560 },
  `body { background: var(--gradient-page); }
   .row { display: grid; grid-template-columns: 300px 1fr auto; gap: var(--space-6); align-items: center; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--card-radius); padding: var(--space-5); box-shadow: var(--card-shadow); text-decoration: none; color: inherit; margin-bottom: var(--space-5); }
   .media { aspect-ratio: 8/5; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: var(--color-bg-subtle); border: 1px solid var(--color-border); }
   .initial { font-family: var(--font-display); font-size: 3rem; font-weight: var(--weight-semibold); color: var(--color-text-secondary); }
   .row-eyebrow { font-size: var(--text-xs); font-weight: var(--weight-semibold); letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-text-muted); }
   .row h3 { margin-top: var(--space-2); font-size: var(--text-lg); }
   .row p.tag { margin-top: var(--space-3); font-size: var(--text-sm); color: var(--color-text-secondary); max-width: 60ch; }
   .chips { display: flex; gap: var(--space-2); margin-top: var(--space-4); flex-wrap: wrap; }
   .chip { font-size: var(--text-xs); font-weight: var(--weight-medium); color: var(--chip-text); background: var(--chip-bg); border-radius: var(--radius-full); padding: 5px 12px; }
   .chip--accent { font-weight: var(--weight-semibold); color: var(--chip-accent-text); background: var(--chip-accent-bg); }
   .num { font-family: var(--font-display); font-size: 2.5rem; color: var(--color-ornament); }`,
  `<div data-theme="dark">
   <a class="row" href="#">
     <div class="media"><span class="initial">L</span></div>
     <div>
       <p class="row-eyebrow">Lotic · AI product</p>
       <h3>From concept to market in 90 days</h3>
       <p class="tag">Launching an AI-powered well-being insights platform under aggressive timelines.</p>
       <div class="chips"><span class="chip">AI product strategy</span><span class="chip">Conversational UI</span><span class="chip chip--accent">+27% prompt completion</span></div>
     </div>
     <span class="num">01</span>
   </a>
   <a class="row" href="#">
     <div class="media"><span class="initial">V</span></div>
     <div>
       <p class="row-eyebrow">Virgin Pulse · Platform strategy</p>
       <h3>Modular, scalable platform strategy</h3>
       <p class="tag">Transforming a B2B2C wellness platform into a configurable health management solution.</p>
       <div class="chips"><span class="chip">Design strategy</span><span class="chip">Service blueprint</span></div>
     </div>
     <span class="num">02</span>
   </a>
   </div>`
);

/* ---------------- CTA section ---------------- */
files['components/cta-section.html'] = page(
  { group: 'Components', name: 'CTA section', subtitle: "Let's-connect closer on every page", width: 900, height: 380 },
  `.cta { text-align: center; padding: var(--space-7) var(--space-5); }
   .cta p { margin-block-start: var(--space-4); color: var(--color-text-secondary); font-size: var(--text-md); }
   .button { display: inline-block; margin-block-start: var(--space-6); padding: var(--space-3) var(--space-6); background: var(--button-bg); color: var(--button-text); font-weight: var(--weight-semibold); text-decoration: none; border-radius: var(--button-radius); }`,
  `<section class="cta">
     <h2>Let's connect</h2>
     <p>Interested in collaborating or learning more about my work? Let's chat.</p>
     <a class="button" href="#">Let's chat</a>
   </section>`
);

/* ---------------- Case study header ---------------- */
files['components/case-study-header.html'] = page(
  { group: 'Components', name: 'Case study header', subtitle: 'Subtle surface, eyebrow, meta list', width: 1000, height: 460 },
  `body { padding: 0; }
   .case { background: var(--color-bg-subtle); padding: var(--space-7) var(--space-6); }
   .case h1 { margin-block-start: var(--space-3); font-size: var(--text-2xl); max-width: 24ch; }
   .tagline { margin-block-start: var(--space-4); font-size: var(--text-md); color: var(--color-text-secondary); max-width: 56ch; }
   dl { display: flex; gap: var(--space-6); margin-block-start: var(--space-6); }
   dt { font-size: var(--text-xs); font-weight: var(--weight-semibold); letter-spacing: var(--tracking-wide); text-transform: uppercase; color: var(--color-text-muted); }
   dd { margin: var(--space-1) 0 0; font-size: var(--text-sm); }`,
  `<header class="case">
     <p class="eyebrow">Virgin Pulse</p>
     <h1>Modular, scalable platform strategy</h1>
     <p class="tagline">Transforming Virgin Pulse's B2B2C wellness platform into a comprehensive, configurable health management solution.</p>
     <dl>
       <div><dt>Role</dt><dd>UX Director</dd></div>
       <div><dt>Focus</dt><dd>Design strategy · User research · Service design</dd></div>
     </dl>
   </header>`
);

/* ---------------- Prose ---------------- */
files['components/prose.html'] = page(
  { group: 'Type', name: 'Prose (long-form)', subtitle: 'Case study body styles', width: 760, height: 760 },
  `.prose { max-width: var(--container-narrow); }
   .prose > * + * { margin-block-start: var(--space-5); }
   .prose h2 { font-size: var(--text-xl); margin-block-start: var(--space-6); }
   .prose ul { padding-inline-start: 1.25em; }
   .prose li + li { margin-block-start: var(--space-2); }
   .prose blockquote { border-inline-start: 3px solid var(--color-accent); padding-inline-start: var(--space-5); color: var(--color-text-secondary); font-style: italic; }`,
  `<div class="prose">
     <h2>Approach</h2>
     <p><strong>Research-driven insights.</strong> Conducted surveys with over 200 members and performed stack ranking exercises to identify priority features for both clients and end users.</p>
     <ul>
       <li>Launched a highly configurable platform supporting expanded offerings.</li>
       <li>Modular design strategy streamlined client onboarding.</li>
     </ul>
     <blockquote>Show me what's wrong so I can quickly fix it.</blockquote>
   </div>`
);

/* ---------------- write everything ---------------- */
for (const [rel, content] of Object.entries(files)) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
// source-of-truth token files travel with the design system
fs.mkdirSync(path.join(OUT, 'styles'), { recursive: true });
fs.copyFileSync(path.join(SITE, 'src/styles/tokens.css'), path.join(OUT, 'styles/tokens.css'));
fs.copyFileSync(path.join(SITE, 'src/styles/theme.css'), path.join(OUT, 'styles/theme.css'));
fs.writeFileSync(
  path.join(OUT, 'README.md'),
  `# Deanna Glaze Portfolio — Design System

Source of truth lives in the dg-website repo (src/styles/tokens.css + theme.css).
The preview cards here are generated from those files. Components: button,
value card, work card, site header/footer, hero, CTA section, case study
header, prose. Groups: Colors, Type, Spacing, Components.
`
);
console.log('Wrote', Object.keys(files).length + 3, 'files to', OUT);
