// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import rehypeImageLightbox from './scripts/rehype-image-lightbox.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://deannaglaze.com',
  trailingSlash: 'never',
  // The site stays fully prerendered; the adapter exists solely so the
  // one server route (/api/contact, prerender = false) can run as a
  // Vercel function. Everything else builds to static HTML as before.
  adapter: vercel(),
  // Astro's built-in CSRF origin check misfires behind Vercel's proxy
  // (it reconstructs the request URL with the wrong scheme, so every
  // legitimate form post gets "Cross-site POST form submissions are
  // forbidden"). Disabled here; /api/contact does its own host-based
  // origin check instead, which is proxy-tolerant.
  security: { checkOrigin: false },
  build: {
    format: 'file',
  },
  markdown: {
    rehypePlugins: [rehypeImageLightbox],
  },
});
