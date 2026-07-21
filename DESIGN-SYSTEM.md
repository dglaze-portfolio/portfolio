# Design system

Palette: **"Instrument gradient" direction (3c)** — a continuous vertical
magenta-tinted dark gradient with glass surfaces on the home page, magenta
signal on cool neutrals on inner pages (from the Claude Design "Home Page
Directions" exploration).
The styling is a three-layer token system. The rule that keeps it
maintainable: **each layer only references the layer below it.**

```
┌────────────────────────────────────────────────┐
│ 3. Component styles (.astro <style> blocks)    │  reference semantic tokens only
├────────────────────────────────────────────────┤
│ 2. Semantic tokens (src/styles/theme.css)      │  --color-bg, --card-radius…
├────────────────────────────────────────────────┤
│ 1. Primitives (src/styles/tokens.css)          │  --neutral-500, --magenta-400…
└────────────────────────────────────────────────┘
```

## The layers

### 1. Primitives — `src/styles/tokens.css`

Raw values: the cool-neutral ramp (`--neutral-0…900`), the magenta signal
ramp (`--magenta-50…800`, 400 is the base), status colors (`--state-*`,
hue-separated from magenta on purpose), dark-surface values (`--dark-*`),
a fluid type scale, spacing, radii, shadows, motion, layout widths.

### 2. Semantic tokens — `src/styles/theme.css`

Purpose-named tokens: surfaces (`--color-bg`, `--color-bg-raised`,
`--color-bg-subtle`), text roles, accent roles, three border tiers
(`-divider` decorative / default / `-control` operable), and component
tokens (`--card-*`, `--button-*`, `--chip-*`, `--footer-*`).

### 3. Component styles

Scoped `<style>` blocks in each `.astro` component, plus shared utilities
(`.container`, `.section`, `.eyebrow`, `.prose`, `.button`,
`.button--secondary`) in `src/styles/global.css`.

## The gradient page (home)

The home page is one continuous canvas: `BaseLayout` gets
`theme="gradient"`, which puts `data-theme="dark"` + `.page-gradient` on
`<body>`. The canvas is `--gradient-page` (a seven-stop vertical magenta
gradient); every surface becomes translucent **glass** (`--glass-*`
primitives → `--card-bg`, `--color-bg-raised`, etc.); the header goes
translucent-dark with blur and the footer transparent. Component styles
don't change at all — only tokens remap.

On the gradient page the accent gets *more* restrained, not less:
eyebrows and ornamental numerals drop to quiet gray
(`--eyebrow-color` / `--color-ornament`), and magenta appears only on the
active-nav underline, primary buttons, the one metric chip, and links.

`data-theme="dark"` also works on any individual section of a light page
if a dark band is ever needed again.

```astro
<BaseLayout theme="gradient">   <!-- 3c: whole page on the gradient -->
```

## Accent usage rules (from the palette spec — do not break these)

1. **Accent appears at most three times per viewport.**
2. **Accent never sets headings or body copy.**
3. Every accent instance means the system is acting, waiting, or offering
   the primary next step (e.g. the primary button, the active-nav
   underline, one highlight chip).
4. Status colors (`--color-status-*`) are hue-separated from magenta so
   state is never confused with interaction.
5. `--color-border-divider` is decorative only (fails WCAG 1.4.11 on
   purpose). Anything a person can operate uses `--color-border-control`
   (3:1).
6. Contrast notes: don't put `--magenta-400` text on `--color-bg-subtle`
   (4.45:1) — use `--color-accent-on-subtle` (magenta-600). Accent text
   on tint backgrounds uses `--color-text-on-tint`.

## Common changes

**Tune the accent** — edit the `--magenta-*` ramp in `tokens.css`; every
semantic role follows.

**Change fonts** — swap the `@fontsource-variable/*` imports in
`src/layouts/BaseLayout.astro` and the `--font-display`/`--font-body`
primitives.

**Add a dark section** — add `data-theme="dark"` to the section and style
with semantic tokens as usual.

## Claude Design sync

The design system lives as preview cards in the **"Deanna Glaze
Portfolio"** project on claude.ai/design. Cards are generated from the
real token files by `scripts/build-ds-bundle.mjs` (output: `ds-bundle/`,
git-ignored). After changing tokens or components: run the script, then
sync the changed files to the project.
