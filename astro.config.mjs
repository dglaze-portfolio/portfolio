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
  build: {
    format: 'file',
  },
  markdown: {
    rehypePlugins: [rehypeImageLightbox],
  },
});
