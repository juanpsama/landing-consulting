// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGithubPages ? 'https://juanpsama.github.io' : 'https://grupogarpe.com',
  base: isGithubPages ? '/landing-consulting' : '/',
  trailingSlash: 'never',
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
});