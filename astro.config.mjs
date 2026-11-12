import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Served from the GitHub user site https://cheoc.github.io/ at the root.
// SITE_URL and BASE_PATH override these, e.g. for a project-site copy.
const DEFAULT_SITE = 'https://cheoc.github.io';
const DEFAULT_BASE = '/';

export default defineConfig({
  site: process.env.SITE_URL ?? DEFAULT_SITE,
  base: process.env.BASE_PATH ?? DEFAULT_BASE,
  trailingSlash: 'always',
  integrations: [mdx()],
  // Code blocks stay in the page's own colours.
  markdown: { syntaxHighlight: false },
});
