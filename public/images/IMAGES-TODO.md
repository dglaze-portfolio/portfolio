# Image migration checklist

All images below are currently **placeholders**. The originals are hosted on
Squarespace's CDN — download each one (open the URL in a browser, right-click →
Save As), then save it over the placeholder path listed. Keep the filenames the
same and nothing else needs to change.

> Tip: do this before you cancel Squarespace — the CDN URLs stop working when
> the subscription ends.

## Home

| Save as | Original |
| --- | --- |
| `images/home/deanna.png` | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/b04489da-a8b8-40e4-b59b-4afbce5385af/deanna.png |
| `images/home/process-ai.png` | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/75ef3e32-0cf4-4b56-a96c-b96788a62a83/Process-AI.png |

## About

| Save as | Original |
| --- | --- |
| `images/about/portrait.jpg` | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/5df9f08d-228b-4f48-86a0-91534e6abd98/IMG_2763.JPG |
| `images/about/gallery-01.jpg` ("What the hell kind of bird…") | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1614548445114-WGM813S0CNPBC7I6R6JM/image-asset.jpeg |
| `images/about/gallery-02.jpg` ("Cerulean Sunday") | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1613948965056-9I4B70O70UWEGI77637I/image-asset.jpeg |
| `images/about/gallery-03.jpg` (Le Guin quote) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1612135381649-MT6E8NK50QJ32SJDQBIW/image-asset.jpeg |
| `images/about/gallery-04.jpg` ("basket of adorables") | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1613116033379-DGZYQT8YOAQZV0TRU6PE/image-asset.jpeg |
| `images/about/gallery-05.jpg` (sunset) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-3MI37NNC70P9YH0NR7NT/image-asset.jpeg |
| `images/about/gallery-06.jpg` (gossiping trees) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-8D00SFS3NL6Q0RLKCZVT/image-asset.jpeg |
| `images/about/gallery-07.jpg` (Mary Oliver quote) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-01LRQNYPRMY4GM439EAB/image-asset.jpeg |
| `images/about/gallery-08.jpg` (2021 Terrierist) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-7A4CIOK9DVLKW425J2QI/image-asset.jpeg |
| `images/about/gallery-09.jpg` (sunset) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-SKRAXIHN181BOSSE90RT/image-asset.jpeg |
| `images/about/gallery-10.jpg` (sunset) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-V0T576PKKW1A92ETTJYI/image-asset.jpeg |
| `images/about/gallery-11.jpg` (room at peace) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-F657IVE92PK7P5KWPN16/image-asset.jpeg |
| `images/about/gallery-12.jpg` (RI sunset) | https://images.squarespace-cdn.com/content/v1/4ff46bb2e4b0b15e996e819b/1610827064840-5WVHN1WNXO2XT7LPWTTD/image-asset.jpeg |

## Work / case study images (optional but recommended)

Case study images go through **Astro's build-time optimizer** (resized,
cropped, converted to WebP automatically), so save one full-size original per
image — no need to export cropped variants for the home page or Work grid.

Save them under `src/assets/work/<slug>/`, one folder per case study
(folders already exist):

```
src/assets/work/
├── lotic/
├── loft/
├── vp/
├── amazon/
└── amazon-convergence/
```

**Cover image** — save as e.g. `src/assets/work/lotic/cover.png`, then set in
the matching file under `src/content/work/` (path is relative to the .md file):

```yaml
cover: ../../assets/work/lotic/cover.png
coverAlt: Screens from the Lotic well-being platform
```

The same source file is used everywhere: cropped to 8:5 thumbnails on the home
showcase and Work grid, and shown full-width (uncropped, responsive srcset) on
the case study page. Export at ~2200px wide or larger for best results.

**In-page images** — save to the same folder and reference them relatively in
the case study markdown; they're optimized too:

```markdown
![Alpha onboarding flow](../../assets/work/lotic/alpha-flow.png)
```

Export these from the live case study pages (they weren't all fetchable during
migration).

> Home and About images above stay in `public/images/` (served as-is) since
> they're already wired up; they can be migrated to `src/assets/` later if
> optimization is wanted there too.
