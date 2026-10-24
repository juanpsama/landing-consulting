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
