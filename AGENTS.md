# AGENTS.md — landing-garpe-astro

## Quick start

```sh
npm install            # Node >=22.12 required
npm run dev            # dev server at localhost:4321
npm run build          # static output → dist/
npm run preview        # preview built site
node --test tests/icons-migration.test.mjs  # icons regression tests
node --test tests/chaos-icons.test.mjs      # chaos & resilience tests
```

Verification steps: execute `node --test tests/*.test.mjs` and `npm run build` (catches Astro/TS/SSR errors).

## Architecture

- **Pure Astro SSG & Islands** — no JS framework on static pages, zero client hydration for presentational components. Preact used only on interactive islands (e.g., `ContactForm.tsx`).
- **Astro built-in i18n** — configured in `astro.config.mjs` (`i18n` block). Both locales use URL prefixes: `/es/` (default) and `/en/`. Root `/` is a static redirect page → `/es/`. See `astro.config.mjs.i18n`.
- **Locale-aware components** — use `Astro.currentLocale` (not manual URL parsing). The `src/i18n/utils.ts` only has a `useTranslations()` lookup helper; routing helpers are from `astro:i18n` (`getRelativeLocaleUrl`).
- **Tailwind v4** via `@tailwindcss/vite` plugin. No `tailwind.config.*` or PostCSS config. Custom tokens in `src/styles/global.css` under `@theme {}` (brand colors, font-family, radius).
- **Iconography Standard** — `@phosphor-icons/web` imported locally via `src/styles/global.css` (`regular`, `bold`, `fill`). Rendered via `<i class="ph ph-*"></i>` (or `ph-bold`, `ph-fill`). Zero client hydration, zero `set:html`, zero external CDNs.
- **Page flow:** `src/pages/[locale]/index.astro` (dynamic route with `getStaticPaths` returning `['es', 'en']`) → `src/layouts/Layout.astro` (NavBar, hero, ServicesSection, Footer). Props cascaded from page through Layout to children.

## Key files & what lives where

| Purpose | File |
|---------|------|
| i18n config (locales, default, prefix) | `astro.config.mjs` — `i18n` block |
| UI copy (nav/hero/footer labels) | `src/i18n/ui.ts` — bilingual key-value map |
| Translation lookup | `src/i18n/utils.ts` — `useTranslations()` helper |
| Service content | `src/data/services.json` — bilingual, separate from UI copy (uses `ph-*` icon classes) |
| Icons & Typography | `@phosphor-icons/web` imported in `src/styles/global.css` (no loose SVGs, no `set:html`) |
| Design reference | `DESIGN.md` — color tokens, typography, spacing, component specs |
| ADRs | `docs/adr/*.md` — Architecture Decision Records |
| Specs / tasks | `specs/*.md` — markdown specs for features (may be untracked) |

## Gotchas

- **`site` config required** — `astro.config.mjs.site` must be set to the production URL for hreflang `href` values (absolute URLs required by spec).
- **No content collections.** `.astro/collections/` is empty; data comes from JSON files + i18n maps.
- **No `.env` usage.** No `import.meta.env` references anywhere.
- **Icon convention:** Always use `@phosphor-icons/web` classes (`<i class="ph ph-..."></i>`). Do not import raw SVGs via `?raw` nor inject with `set:html`. Do not load fonts from external CDNs (e.g. jsDelivr). Ensure `services.json` has 1:1 parity between `es` and `en` icon keys.
