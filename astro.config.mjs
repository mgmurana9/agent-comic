// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// Deploys to Cloudflare Workers (not Pages): the site has one server route,
// /api/submit. Everything else is prerendered. See STOP-SEQUENCE-HANDOFF.md §3.
export default defineConfig({
  site: 'https://stop-sequence.com',
  output: 'static',
  // No sessions, no runtime image binding: nothing here needs KV or Cloudflare Images.
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  trailingSlash: 'ignore',
  prefetch: true,
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  image: {
    layout: 'constrained',
  },
  security: {
    csp: {
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com'],
      },
    },
  },
  // Archivo (variable wdth + wght) for everything; Shantell Sans for comic lettering.
  fonts: [
    {
      name: 'Archivo',
      cssVariable: '--font-archivo',
      provider: fontProviders.local(),
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/archivo-latin-standard-normal.woff2'], weight: '100 900', style: 'normal' },
          { src: ['./src/assets/fonts/archivo-latin-standard-italic.woff2'], weight: '100 900', style: 'italic' },
        ],
      },
    },
    {
      name: 'Shantell Sans',
      cssVariable: '--font-shantell',
      provider: fontProviders.local(),
      fallbacks: ['sans-serif'],
      options: {
        variants: [{ src: ['./src/assets/fonts/shantell-sans-latin-wght-normal.woff2'], weight: '300 800', style: 'normal' }],
      },
    },
  ],
  env: {
    schema: {
      // Fine-grained PAT: Issues read/write on this one repo, nothing else.
      GITHUB_ISSUES_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_REPO: envField.string({ context: 'server', access: 'public', default: 'mgmurana9/agent-comic' }),
    },
  },
});
