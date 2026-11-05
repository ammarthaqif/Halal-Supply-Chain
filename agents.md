# HalalChain Malaysia — Agent Instructions & Engineering Constitution

**Project**: HalalChain Malaysia — Farm-to-Table Halal Traceability Platform  
**Original Developer**: Ammar Thaqif (`ammarthaqif.ar@gmail.com`)  
**Repository Architecture**: Full-Stack TypeScript (React 19 + Vite 8 + Tailwind CSS v4 + Express backend with Gemini 3.8 Flash)  

---

## 1. Developer Attribution & Governance

- All future modifications and commits must respect and preserve the developer attribution:
  - **Developer**: Ammar Thaqif (`ammarthaqif.ar@gmail.com`)
  - **Organization**: HalalChain Malaysia Consortium
- The footer in `src/App.tsx`, `package.json`, `metadata.json`, and the official SPHM compliance report header must retain this authorship.

---

## 2. Dependency & Lockfile Discipline

- **No Lockfile Drifts**: When installing or updating npm packages, always ensure `package-lock.json` is updated via `npm i --package-lock-only` or `npm install`.
- **Peer Dependency Guardrail**: `vite@^8.3.0` requires `esbuild@^0.27.0 || ^0.28.0`. Do **not** downgrade `esbuild` to `^0.25.0` or it will cause `npm error ERESOLVE` in GitHub Actions CI (`npm ci`) and Vercel.
- **Node & Express**: The application runs dual-mode:
  - Full-stack dev/production server via `server.ts` (`tsx server.ts` or `node server.ts`).
  - Production static client bundle in `dist/` deployable on Vercel or any CDN with SPA rewrites configured in `vercel.json`.

---

## 3. Core Feature Contracts

### A. Traceability & Export Compliance Report
- `TraceabilityTimelineView.tsx` provides an **"Export Compliance Report"** button that generates a clean, official, print-friendly PDF summary of each batch's journey and JAKIM certification status.
- Print styles must use `@media print` with `.no-print` hiding web controls, preserving clean white backgrounds, high-contrast borders, and signature sign-off blocks.

### B. Unique Shipment QR Codes & Immutable Record Scans
- Each batch must generate a unique mathematical QR code encoding:
  `${window.location.origin}/?batch=${batch.batchNumber}&view=immutable-record`
- When visited or scanned, `App.tsx` must parse `?batch=` and `&view=immutable-record`, auto-selecting the batch and rendering the **Immutable Blockchain Shipment Record** modal.
- The QR component must offer vector `.svg` download for packaging labels.

### C. Anti-Slop UI & Design System Rules
- **Top Bar Contract**: Exactly 3 zones (wordmark brand, single-line text nav links, 1 primary action button).
- **Zero-Pill Metadata**: Do not wrap informational labels (dates, counts, IDs) in colored candy pills; use clean inline typography with `·` or `/` separators.
- **Tabular Figures**: Always format block hashes, transaction IDs, timestamps, and temperatures with `font-mono tabular-nums`.

---

## 4. CI/CD & Deployment Checklist

Before merging changes:
1. `npm run lint` (`tsc --noEmit`) must exit with code 0.
2. `npm run build` (`vite build`) must compile cleanly to `dist/`.
3. `npm ci` must succeed without warnings using `.github/workflows/deploy.yml`.
4. `vercel.json` rewrites must stay in sync with SPA routing.
