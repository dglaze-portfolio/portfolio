// @ts-check
import { defineConfig } from 'astro/config';
import rehypeImageLightbox from './scripts/rehype-image-lightbox.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://deannaglaze.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  markdown: {
    rehypePlugins: [rehypeImageLightbox],
  },
});
