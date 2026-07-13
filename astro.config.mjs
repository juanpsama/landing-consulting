// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGithubPages ? 'https://juanpsama.github.io' : 'https://grupogarpe.com',
  base: isGithubPages ? '/landing-consulting' : '/',
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [sitemap(
    {
      i18n: {
        defaultLocale: 'es',
        locales: {
          en: 'en-US',
          es: 'es-MX',
        },
      },
    }
  )],

  adapter: cloudflare(),
});