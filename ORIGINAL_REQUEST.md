# Original User Request

## Initial Request — 2026-10-23T21:15:19Z

You are the Project Orchestrator for landing-consulting.

Working directory: C:\Users\elvat\Documents\Dev\1_Trabajo\landing-consulting
Integrity mode: development

## Task Overview
Comprehensive code-level audit and optimization analysis for landing-consulting (Astro server/SSG + TypeScript + Tailwind CSS v4 on Cloudflare Pages) to identify high-impact refactoring opportunities with zero UI/styling alterations.

## Requirements

### R1. Full-Spectrum Code Audit
Analyze the codebase across all non-UI layers:
- **TypeScript & Type Safety:** Missing or loose types (any, unvalidated JSON data imports, interface centralization).
- **Component Script Optimization:** Redundant computation in Astro frontmatter, unnecessary imports, and dead code.
- **i18n & Data Handling:** Inefficient lookup patterns in src/i18n/utils.ts, src/data/, and redundant JSON loading.
- **API Endpoints & Cloudflare Handlers:** Error handling, input validation, and async hygiene in src/pages/api/contact.ts, src/pages/api/vcard/, and redirect routes.

### R2. Prioritized Optimization Report
Generate a structured report categorizing opportunities into:
1. **Dead Code & Unused Assets:** Unreferenced imports, dead routines, or unneeded dependencies.
2. **Type Hardening & Correctness:** Exact types for props, collections, and external bindings.
3. **Runtime & Build Efficiency:** Frontmatter deduplication, bundle size improvements, and Cloudflare Worker optimization.
4. **Actionable Implementation Plan:** Ranked by impact and safety, ready for phased execution by clean-coder.

### R3. Strict Visual & Invariance Guardrails
Under no circumstances modify visual elements, Tailwind classes, CSS tokens in src/styles/global.css, or HTML layout structure.

## Acceptance Criteria

### Build & Verification Integrity
- npm run build passes with exit code 0 before and after any analysis.
- Zero Astro or TypeScript diagnostic errors introduced.

### Audit Quality & Comprehensiveness
- Every component and utility in src/ is audited with specific file links and line references.
- Concrete code snippets showing the current inefficient pattern and the proposed optimized pattern.
- Zero changes to UI layout, typography, or styling rules.

Please coordinate the analysis, track progress in progress.md and BRIEFING.md, and synthesize the final optimization report. Report back with your findings and report path when complete.

## Follow-up — 2026-10-24T21:55:01Z

This is a single self-contained fix; keep it small and focused. Transform the mobile presentation of `sistemas-de-ventas#demos` from a long, stacked vertical list of 6 demo cards into a fluid, touch-friendly horizontal carousel with native CSS scroll-snap, pagination dots/indicators, and swipe peek cues, while preserving the clean multi-column grid layout on tablet and desktop screens (`md:`/`lg:`).

Working directory: C:\Users\elvat\Documents\Dev\1_Trabajo\landing-consulting
Integrity mode: development

## Requirements

### R1. Mobile Carousel Transformation (`sistemas-de-ventas#demos`)
On mobile viewports (`< 768px`), present the 6 demo cards in a smooth horizontal scroll container using native CSS scroll-snap. Each card should occupy ~85-90% of the viewport width with a peek of the subsequent card visible, inviting horizontal swiping without clutter or vertical bloat.

### R2. Touch Navigation Indicators & Active State Sync
Provide visual pagination dots beneath the carousel that automatically highlight the active card as the user scrolls. Clicking/tapping any indicator dot smoothly scrolls to the corresponding card. Keep touch targets compliant with minimum mobile sizing standards (≥ 44px).

### R3. Desktop Grid Preservation & Build Verification
Ensure the desktop and tablet layout (`≥ 768px`) remains an organized 2-to-3 column grid with zero layout regression. Preserve all existing card content, simulated WhatsApp message styling, and tracking attributes (`data-track`). The project must compile cleanly with `npm run build` exiting with code 0.

## Acceptance Criteria

### Mobile Interaction & Touch UX
- [ ] On viewports under 768px, demo cards snap cleanly on horizontal scroll without overflowing the page viewport.
- [ ] Visual indicator dots update dynamically based on the currently visible card in the viewport.
- [ ] Tapping an indicator dot smoothly scrolls the container to that specific card.
- [ ] The next card's edge is partially visible (peek effect) to clearly signal swipe availability.

### Responsiveness & Architecture
- [ ] On screens ≥ 768px (`md:` breakpoint), the horizontal carousel transitions into the standard multi-column grid, hiding the mobile dots.
- [ ] Zero third-party runtime package dependencies added (pure Tailwind CSS + native browser APIs).
- [ ] All `data-track` attributes (`demo_install_*`, `demo_external_*`) remain functional and correctly positioned.
- [ ] `npm run build` exits with code 0 and 0 build errors.
