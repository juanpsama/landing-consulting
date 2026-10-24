# Project: landing-consulting Full-Spectrum Audit & Optimization

## Architecture
- Framework: Pure Astro SSG + TypeScript + Tailwind CSS v4 on Cloudflare Pages
- Locales: `es` (default), `en` via Astro built-in i18n
- Data: `src/data/services.json`, `src/i18n/ui.ts`
- Zero Client Hydration, static compilation (`npm run build` -> `dist/`)

## Feature Inventory
| # | Feature / Area | Scope | Subagent / Milestone | Status |
|---|----------------|-------|----------------------|--------|
| 1 | Baseline Build Verification | npm run build exit code 0 | Worker (59859bf5-4317-4a29-a1df-5ceaf8e8e291) | DONE (verified exit 0) |
| 2 | TypeScript & Type Safety, i18n & Data | src/i18n/, src/data/, global types | Explorer 1 (2f15a6f6-8b69-4c8d-aa96-28e25903e07e) | DONE (18 findings delivered) |
| 3 | Components, Frontmatter & Dead Code | src/components/, src/layouts/, src/pages/[locale]/, public/ | Explorer 2 (7b28104c-2245-4d67-9f7e-36dea6c075a3) | DONE (22 findings delivered) |
| 4 | API Endpoints & Cloudflare Handlers | src/pages/api/, redirects, wrangler.jsonc | Explorer 3 (7b68571f-5d4c-469c-bc21-98d067a5a82a) | DONE (15 findings delivered) |
| 5 | Synthesis & Prioritized Report Generation | Consolidated optimization report | Orchestrator | DONE (OPTIMIZATION_REPORT.md) |
| 6 | Adversarial Review & Line-by-Line Challenge | Reviewer & Challenger verification | Reviewer (APPROVE) / Challenger (Hardened) | DONE |
| 7 | Final Build Integrity Attestation | Verify post-audit build exit code 0 | Worker (23499abd) | DONE (verified exit 0, clean git) |

## Code Layout
- `src/components/`: Astro UI components
- `src/layouts/`: Base layouts (Layout.astro)
- `src/pages/`: Pages and API endpoints
- `src/i18n/`: Translations dictionary and utility helpers
- `src/data/`: JSON static data sources
- `src/styles/`: Tailwind v4 theme and global CSS
