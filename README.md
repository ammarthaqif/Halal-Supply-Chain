# HalalChain Malaysia 🥩📦

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Standards](https://img.shields.io/badge/Standards-MS_1500%3A2019_%26_MS_2400-emerald.svg)](#1-regulatory-standards)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![CI](https://img.shields.io/badge/GitHub_Actions-Verified-success.svg?logo=github-actions&logoColor=white)](#6-cicd--deployment)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy_Ready-black.svg?logo=vercel&logoColor=white)](#vercel-deployment)

> **Cryptographic Blockchain-Verified Supply Chain & Procurement Platform for Malaysian Restaurants**  
> Ensuring 100% transparent provenance from certified farms and JAKIM slaughterhouses to the dining table.

Developed by **Ammar Thaqif** ([ammarthaqif.ar@gmail.com](mailto:ammarthaqif.ar@gmail.com))

---

## 📖 Overview

In Malaysia, finding authenticated halal sources of meat and groceries for restaurant owners has historically been difficult, opaque, and susceptible to counterfeit meat cartels and cross-contamination.

**HalalChain Malaysia** provides an end-to-end supply chain traceability platform built in strict compliance with:
- **MS 1500:2019**: General principles for Halal food production, slaughter regulations (*Dhabh*), and hygiene.
- **MS 2400:2019**: Halalan-Toyyiban supply chain management, dedicated cold-chain logistics, and *Sertu/Samak* cleansing verification.

---

## ✨ Key Features

### 1. Verified Halal Wholesale Marketplace
- Direct sourcing portal for Malaysian restaurateurs across Kuala Lumpur, Selangor, Perak, Pahang, Penang, and Johor.
- Real-time Cold-Chain IoT temperature monitoring (Chilled $0^\circ\text{C}$ to $+4^\circ\text{C}$, Frozen $\le -18^\circ\text{C}$) and direct pricing in Ringgit Malaysia (RM).
- Pre-seeded consignments: Perak Grass-Fed Brahman Beef, Selangor Organic Kampung Chicken, Australian Wagyu (JAKIM-recognized FHCB - HCAA), and Penang Artisanal Halal Spices.

### 2. Interactive Farm-to-Table Traceability Timeline
- Detailed 5-stage verification stepper:
  1. **Farm Origin**: Livestock RFID ear-tag, DVS veterinary clearance, 100% vegetarian feed certification.
  2. **Halal Slaughter (RPA)**: Certified Muslim slaughterer name & JAKIM ID, continuous *Tasmiyah*, and complete cut verification of *Halkum*, *Mari'*, and *Wadajain*.
  3. **Dedicated Halal Cold Chain**: Reefer vehicle plate, *Sertu* sanitization record, and live IoT temperature log.
  4. **Distribution Hub**: Consignment receipt and tamper-evident smart seal.
  5. **Restaurant Kitchen**: Chef acceptance, cold room logging, and restaurant audit records.

### 3. Export Compliance Report (PDF Summary)
- Formats a clean, official, print-friendly compliance dossier ready for the official **JAKIM SPHM** (*Sijil Pengesahan Halal Malaysia*) restaurant premises audit.
- Features one-click **"Print / Save as PDF"** (with `@media print` rules hiding web controls) and **"Download JSON"** for digital ledger backup.

### 4. Unique Shipment QR Codes
- Generates a unique vector QR code for each shipment linking to:
  ```
  https://<domain>/?batch=<BATCH_NUMBER>&view=immutable-record
  ```
- Instant public verification when scanned with any smartphone, opening the **Immutable Blockchain Shipment Record** with block hashes, Merkle root, and regulatory credentials.
- Vector `.svg` label export for abattoir meat cartons.

### 5. Consortium Blockchain Explorer & Fraud Tamper Simulator
- Inspects block headers, parent SHA-256 hashes, Merkle root trees, nonces, and validator signatures from JAKIM, DVS, JAIS, and MAQIS.
- **Interactive Fraud Simulator**: Simulates malicious data alteration in Block #2 to demonstrate how cryptographic consensus immediately detects tampered records and breaks the chain.

### 6. AI Halal Compliance Auditor (Gemini 3.8 Flash)
- Powered by the `@google/genai` TypeScript SDK on a secure server-side Express proxy.
- Evaluates supplier ingredient lists for hidden porcine derivatives, emulsifiers (E471, E472), gelatin, cochineal (E120), and cold-chain thermal breaches.
- Built-in resilient timeout handling and offline MS 1500:2019 expert rules fallback.

### 7. Smart Contract Escrow Dashboard
- Dedicated portal displaying live escrow statuses, total funds locked in Ringgit Malaysia (RM), and disbursed supplier settlements.
- **4 Autonomous Release Invariants**:
  1. *Kitchen Geofence Arrival* (Confirmed via delivery coordinates).
  2. *Cold-Chain Invariant* (Continuous sensor check ensuring chilled cuts never exceed $+4.0^\circ\text{C}$ and frozen cuts stay $\le -15.0^\circ\text{C}$).
  3. *Tamper-Evident Smart Seal* (Hardware seal ID matches block-level genesis record).
  4. *Chef Acceptance QR Scan* (Kitchen receipt verification).
- Interactive simulators for testing successful verified fund disbursement and automated full refund on cold-chain breach.

### 8. Producer Minting & Visual Certificate Expiry Warning
- Dedicated wizard for certified farms and abattoirs to sign and mine new consignments.
- **Visual Warning System for Approaching Expiration**:
  - Live calculation of days remaining on associated JAKIM halal certificates.
  - **Amber Alert ($\le 30$ days)**: Flags imminent expiration, mandating urgent SPHM renewal.
  - **Red Blocker ($< 0$ days)**: Blocks consignment minting if the abattoir's JAKIM certification has lapsed under MS 1500:2019 Clause 4.2.1.
  - Interactive simulator buttons to test valid, expiring (15d), and expired (-5d) scenarios.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Backend / Proxy**: [Express 4](https://expressjs.com/), [TSX](https://github.com/privatenumber/tsx)
- **AI Engine**: [Google GenAI SDK (@google/genai)](https://www.npmjs.com/package/@google/genai) with `gemini-3.8-flash`
- **Cryptography**: SHA-256, Merkle Trees, Proof-of-Authority consensus model
- **CI/CD & Hosting**: GitHub Actions (`deploy.yml`), [Vercel](https://vercel.com/) (`vercel.json`)

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher (or `bun` / `pnpm`)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/halalchain-malaysia.git
cd halalchain-malaysia
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
*(Optional: If testing AI audit features locally, add your `GEMINI_API_KEY`. If omitted, the system seamlessly uses the built-in MS 1500:2019 intelligent rules fallback).*

### 4. Start Development Server
```bash
npm run dev
```
The application will launch at: [http://localhost:3000](http://localhost:3000)

### 5. Build for Production
```bash
npm run build
```
Build output will be bundled in the `dist/` directory.

### 6. Run Code Quality Checks
```bash
npm run lint
npm test
```

---

## 🌐 Deployment Guidelines

### Vercel Deployment (Zero Configuration)
This project is configured with `vercel.json` for one-click static SPA deployment:
1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**.

### GitHub Actions CI
The included `.github/workflows/deploy.yml` runs on every push to `main`/`master`:
- Automatically validates clean `npm ci` installation.
- Executes `npm run lint` (`tsc --noEmit`).
- Executes `npm run build` (`vite build`).

---

## 🔒 Security & Secret Governance

- **Zero Secrets Committed**: No private tokens, API keys, or confidential credentials exist in source files or git history.
- The `.gitignore` strictly excludes `.env*` files (except the safe placeholder `.env.example`).
- Server-side API keys (`process.env.GEMINI_API_KEY`) are kept isolated on the server and are never exposed to browser bundles.

---

## 🤝 Development Guidelines for Future Contributors

1. **Lockfile Integrity**: Always use `npm install` or `npm i --package-lock-only` to keep `package-lock.json` in sync.
2. **Peer Dependencies**: Maintain `esbuild@^0.28.0` alongside Vite 8 to prevent npm `ERESOLVE` conflicts.
3. **Frontend Discipline**: Follow the zero-pill typography and single-elevation card principles described in `agents.md`.
4. **Attribution**: Preserve the developer credit in the footer and compliance documentation.

Refer to [`DEVELOPMENT.md`](DEVELOPMENT.md), [`skills.md`](skills.md), and [`agents.md`](agents.md) for detailed architecture specifications.

---

## 👤 Developer & Maintainer

**Ammar Thaqif**  
- Email: [ammarthaqif.ar@gmail.com](mailto:ammarthaqif.ar@gmail.com)  
- Role: Lead Architect & Developer  
- Project: HalalChain Malaysia Consortium  

---

## 📄 License

This project is licensed under the [Apache-2.0 License](LICENSE).
