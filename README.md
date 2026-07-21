# deannaglaze.com

Portfolio site for Deanna Glaze. Built with [Astro](https://astro.build),
styled with a token-based design system (see `DESIGN-SYSTEM.md`), deployed on
Vercel. Fully static — no client-side JavaScript is shipped.

## Quick start

```bash
npm install     # once
npm run dev     # local dev server at http://localhost:4321
npm run build   # production build into dist/
npm run preview # preview the production build locally
```

## Project structure

```
├── public/                  # served as-is at the site root
│   ├── favicon.svg
│   └── images/              # all site images (see images/IMAGES-TODO.md)
├── src/
│   ├── styles/              # design system (tokens → theme → global)
│   ├── data/site.ts         # site name, nav, social links — edit once
│   ├── content/work/        # ★ case studies live here as Markdown
│   ├── components/          # header, footer, hero, cards, CTA
│   ├── layouts/             # page shell + case study template
│   └── pages/               # one file per route
├── DESIGN-SYSTEM.md         # how the token system works + how to retheme
└── astro.config.mjs
```

## Everyday tasks

### Add or edit a case study

Create/edit a Markdown file in `src/content/work/`. The filename is the URL
(`vp.md` → `/work/vp` — these match the old Squarespace slugs on purpose).
Frontmatter:

```yaml
---
title: 'Case study title'
tagline: 'One-sentence summary shown on cards and under the title.'
client: 'Company name'
role: 'Your role'
skills: [Design strategy, User research]
order: 3          # position on the Work page (lower = first)
cover: /images/work/example-cover.png   # optional
coverAlt: 'Description of the cover image'
draft: false      # true hides it from the site
---

## Section heading

Body copy in plain Markdown…
```

That's it — the Work index, the page itself, and navigation all update
automatically.

### Update nav / social links / site title

Everything lives in `src/data/site.ts`.

### Change colors, fonts, spacing

See `DESIGN-SYSTEM.md`. Short version: semantic tokens in
`src/styles/theme.css` control the look; you rarely need to touch anything
else.

### Replace placeholder images

See `public/images/IMAGES-TODO.md` — it lists every placeholder and the
original Squarespace CDN URL to download before the subscription ends.

## Deploying to Vercel

1. Push this folder to a Git repository (GitHub is easiest):
   ```bash
   git init && git add -A && git commit -m "Initial site"
   ```
   Then create a repo on github.com and follow its "push an existing
   repository" instructions.
2. In [vercel.com](https://vercel.com) → **Add New → Project**, import the
   repo. Vercel auto-detects Astro — accept the defaults and deploy. Every
   `git push` after that deploys automatically, with preview URLs for
   branches.

### Pointing deannaglaze.com at Vercel

1. In the Vercel project → **Settings → Domains**, add `deannaglaze.com`
   (and `www.deannaglaze.com`). Vercel shows you the DNS records it needs.
2. Where you make the DNS change depends on where the domain is registered
   (check Squarespace → Settings → Domains). If the domain is **registered
   through Squarespace**, either update its DNS records to Vercel's values or
   transfer the domain out to a registrar you prefer. If it's registered
   elsewhere and just pointed at Squarespace, update the A/CNAME records at
   that registrar to Vercel's values.
3. Wait for DNS to propagate (minutes to a few hours). Verify the new site is
   live, then cancel the Squarespace subscription — **after** downloading all
   images per `IMAGES-TODO.md`.

### Old URLs

Page paths were kept identical to the Squarespace site (`/work/vp`,
`/designresources`, …) so existing links and search engine results keep
working without redirects.
