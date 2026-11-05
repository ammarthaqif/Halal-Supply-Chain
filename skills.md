# HalalChain Malaysia — System Skills & Domain Specification

**Platform**: HalalChain Malaysia — Farm-to-Table Supply Chain Traceability Platform  
**Developer**: Ammar Thaqif (`ammarthaqif.ar@gmail.com`)  
**Standards Compliance**: Malaysian Halal Standard MS 1500:2019 & MS 2400:2019 (Halalan-Toyyiban Assurance)  
**Primary Beneficiaries**: Local Malaysian Restaurant Owners, Abattoirs, Cold-Chain Carriers & Consumers  

---

## 1. Domain & Regulatory Ecosystem Skills

### A. Malaysian Halal Frameworks
- **MS 1500:2019 (Halal Food)**: Regulates slaughter conditions (*Dhabh*), slaughterer certification by JAKIM, throat severance (*Halkum* [trachea], *Mari'* [esophagus], and bilateral *Wadajain* [jugular & carotid vessels]), continuous *Tasmiyah* recitation, and prohibition of non-halal animal contamination.
- **MS 2400:2019 (Halalan-Toyyiban Supply Chain & Logistics)**: Mandates dedicated halal transport fleets, prohibition of co-mingling with non-halal or haram cargo, *Sertu/Samak* ritual cleansing protocols for reefer compartments, and continuous temperature logging (chilled $0^\circ\text{C}$ to $+4^\circ\text{C}$, frozen $\le -18^\circ\text{C}$).
- **Recognized Foreign Halal Certification Bodies (FHCB)**: Integration with JAKIM-recognized global bodies (e.g. Halal Certification Authority Australia - HCAA) for authenticated imports (Wagyu, Black Angus) with MAQIS port clearances.

---

## 2. Cryptographic Blockchain & Merkle Root Architecture

### A. Consensus & Ledger Hashing
- **Algorithm**: SHA-256 computed on `index | timestamp | previousHash | merkleRoot | nonce`.
- **Merkle Tree Proofs**: Deterministic binary tree hashing of all consignment transaction events per block.
- **Consortium Proof-of-Authority (PoA)**: Blocks validated and signed by simulated institutional nodes:
  - `NODE-JAKIM-PUTRAJAYA` (National Halal Root Node)
  - `NODE-DVS-PERAK-02` (Department of Veterinary Services)
  - `NODE-JAIS-HALAL-04` (State Religious Authorities)
  - `NODE-MAQIS-PORTKLANG-01` (Malaysian Quarantine & Inspection Services)

### B. Anti-Cartel Tamper Detection
- The ledger includes an active integrity audit engine (`verifyBlockchainIntegrity`).
- Simulating a fraudulent alteration in any block breaks the SHA-256 cascade and immediately invalidates all child blocks, protecting restaurants from meat cartel adulteration.

---

## 3. Shipment QR Generation & Immutable Record Protocol

- **Unique QR Generation**: Every consignment batch (`currentBatch.batchNumber`) generates a unique mathematical QR matrix encoding a deep-link verification URL:
  ```
  https://<domain>/?batch=<BATCH_NUMBER>&view=immutable-record
  ```
- **Public Scan Resolution**: When scanned by a recipient restaurant or consumer smartphone, the URL parameters are automatically resolved by `App.tsx`, immediately surfacing the **Immutable Blockchain Shipment Record** with block height, hash, validator signatures, and temperature logs.
- **Packaging Label Export**: Abattoirs and farms can export the unique batch QR code directly as a vector `.svg` file for meat carton tagging.

---

## 4. Export Compliance Report & PDF System

- **Print-Friendly CSS (`@media print`)**: Hides website headers, navigation links, and controls, formatting the document with official Malaysian government and auditor styling.
- **SPHM Ready Dossier**: Formatted for the official *Sijil Pengesahan Halal Malaysia* (SPHM) restaurant inspection workflow, featuring:
  - Complete 5-stage chronological audit ledger (Farm $\rightarrow$ Slaughterhouse $\rightarrow$ Cold Chain $\rightarrow$ Hub $\rightarrow$ Restaurant)
  - Abattoir registration numbers & slaughterer JAKIM IDs
  - DVS veterinary health permits & feed organic certifications
  - Reefer truck license plates & tamper-evident seal numbers
  - Official sign-off blocks for auditor and restaurant executive chef
  - Instant JSON audit ledger download for compliance databases

---

## 5. AI Halal Compliance Auditor (Gemini 3.8 Flash)

- **Endpoint**: `/api/gemini/halal-audit`
- **Model**: `gemini-3.8-flash` via `@google/genai` TypeScript SDK
- **Audit Categories**:
  1. *Ingredient Screening*: Checks emulsifiers (E471, E472), gelatin sources, cochineal (E120), animal rennet, and alcohol solvent thresholds ($<0.5\%$).
  2. *Cold-Chain Anomaly Check*: Evaluates temperature excursion breaches against MS 2400 Toyyiban bacterial limits.
  3. *FHCB Accreditation*: Checks foreign abattoir compliance with JAKIM mutual recognition list.
- **High-Demand Fallback**: Includes resilient exponential backoff and a built-in MS 1500:2019 rules engine that activates instantly if remote AI services experience transient upstream load.

---

## 6. Vercel & GitHub Actions Deployment

- **Node.js Compatibility**: Configured for Node.js 20+ and npm 10+.
- **Vercel**: Native `vercel.json` configured with SPA rewrites to `/index.html`.
- **GitHub Actions**: `.github/workflows/deploy.yml` runs automated `npm ci`, `npm run lint`, and `npm run build` on every push to `main`/`master`.
- **Lockfile Discipline**: Validated `package-lock.json` with zero ERESOLVE peer conflicts.
