# AGENTS.md — landing-garpe-astro

## Quick start

```sh
npm install            # Node >=22.12 required
npm run dev            # dev server at localhost:4321
npm run build          # static output → dist/
npm run preview        # preview built site
```

No lint, format, typecheck, or test commands exist. `npm run build` is the only verification step (catches Astro/TS errors).

## Architecture

- **Pure Astro SSG** — no JS framework, zero client hydration. No SSR adapter.
- **Astro built-in i18n** — configured in `astro.config.mjs` (`i18n` block). Both locales use URL prefixes: `/es/` (default) and `/en/`. Root `/` is a static redirect page → `/es/`. See `astro.config.mjs.i18n`.
- **Locale-aware components** — use `Astro.currentLocale` (not manual URL parsing). The `src/i18n/utils.ts` only has a `useTranslations()` lookup helper; routing helpers are from `astro:i18n` (`getRelativeLocaleUrl`).
- **Tailwind v4** via `@tailwindcss/vite` plugin. No `tailwind.config.*` or PostCSS config. Custom tokens in `src/styles/global.css` under `@theme {}` (brand colors, font-family, radius).
- **Page flow:** `src/pages/[locale]/index.astro` (dynamic route with `getStaticPaths` returning `['es', 'en']`) → `src/layouts/Layout.astro` (NavBar, hero, ServicesSection, Footer). Props cascaded from page through Layout to children.

## Key files & what lives where

| Purpose | File |
|---------|------|
| i18n config (locales, default, prefix) | `astro.config.mjs` — `i18n` block |
| UI copy (nav/hero/footer labels) | `src/i18n/ui.ts` — bilingual key-value map |
| Translation lookup | `src/i18n/utils.ts` — `useTranslations()` helper |
| Service content | `src/data/services.json` — bilingual, separate from UI copy |
| Icons | `src/assets/icons/*.svg` — inline SVGs imported with `?raw`, rendered via `set:html` |
| Design reference | `DESIGN.md` — color tokens, typography, spacing, component specs |
| Specs / tasks | `specs/*.md` — markdown specs for features (may be untracked) |

## Gotchas

- **`site` config required** — `astro.config.mjs.site` must be set to the production URL for hreflang `href` values (absolute URLs required by spec).
- **No content collections.** `.astro/collections/` is empty; data comes from JSON files + i18n maps.
- **No `.env` usage.** No `import.meta.env` references anywhere.
