// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import rehypePrism from 'rehype-prism-plus';

// https://astro.build/config
export default defineConfig({
    site: 'https://gooosexe.github.io',
  
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()],
  
  markdown: {
    rehypePlugins: [rehypePrism],
    syntaxHighlight: false
  }
});