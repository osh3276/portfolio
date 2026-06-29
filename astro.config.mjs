// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import rehypePrism from 'rehype-prism-plus';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	site: 'https://gooosexe.github.io',

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx()],

	markdown: {
		processor: unified({ rehypePlugins: [rehypePrism] }),
		syntaxHighlight: false,
	},

	adapter: vercel(),
});
