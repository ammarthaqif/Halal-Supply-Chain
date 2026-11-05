# HalalChain Malaysia — Development Dossier & Maintainer Guide

**Project**: HalalChain Malaysia — Farm-to-Table Halal Supply Chain Traceability Platform  
**Lead Developer**: Ammar Thaqif (`ammarthaqif.ar@gmail.com`)  
**Regulatory Frameworks**: Malaysian Halal Standards MS 1500:2019 & MS 2400:2019 (Halalan-Toyyiban Assurance)  
**Repository Architecture**: Full-Stack TypeScript (React 19, Vite 8, Tailwind CSS v4, Express, @google/genai SDK)  

---

## 1. Problem Statement & Architecture Vision

In Malaysia, local restaurant owners—ranging from traditional *mamak* establishments and boutique cafes to high-end steakhouses—face critical challenges sourcing guaranteed halal meat and grocery lots. Historical controversies surrounding counterfeit meat syndicates and the co-mingling of non-certified animal carcasses highlighted the urgent necessity for **end-to-end cryptographic transparency**.

HalalChain Malaysia resolves this through a multi-tiered architecture:
1. **Cryptographic Immutability**: Hashing every event from livestock origin to dining table into SHA-256 chained blocks with Merkle tree verification.
2. **Regulatory Grounding & Visual Expiry Guardrails**: Direct alignment with JAKIM (*Jabatan Kemajuan Islam Malaysia*) regulations and DVS (*Jabatan Perkhidmatan Veterinar*) permits, with a live visual warning system alerting producers if an abattoir's certificate is expiring within 30 days or blocking minting if expired under MS 1500:2019 Clause 4.2.1.
3. **Smart Contract Escrow Dashboard**: Real-time monitoring of locked funds (RM), active consignments in transit, and a 4-trigger release matrix (Kitchen geofence, continuous cold-chain temperature thresholds, intact tamper seals, and chef QR scan receipts).
4. **Instant Public Auditing**: Unique batch QR codes for cartons that deep-link directly to immutable on-chain records and printable SPHM compliance reports.

---

## 2. Specialized Agent Roles in System Construction

During the iterative engineering of this platform, specialized development roles were executed:

### A. Regulatory & Standards Architect
- **Mission**: Codified Malaysian Halal Standard **MS 1500:2019** (Halal Food) and **MS 2400:2019** (Halal Supply Chain & Logistics) into TypeScript interfaces.
- **Implemented Contracts**:
  - Slaughter requirements: Continuous *Tasmiyah* recitation, slaughterer JAKIM certification ID, and mandatory severance of *Halkum* (trachea), *Mari'* (esophagus), and bilateral *Wadajain* (jugular/carotid vessels).
  - Logistics requirements: Dedicated halal reefer fleet, *Sertu/Samak* cleansing records, and storage classification limits (Chilled: $0^\circ\text{C}$ to $+4^\circ\text{C}$, Frozen: $\le -18^\circ\text{C}$).

### B. Blockchain & Cryptography Engineer
- **Mission**: Built an in-browser and server-compatible cryptographic consensus ledger without third-party RPC bloat.
- **Implemented Modules**:
  - `src/services/cryptoLedger.ts`: Native SHA-256 calculation with bitwise fallback, Merkle tree root calculation, and PoA block mining.
  - Interactive **Tamper Simulator**: Intentionally mutates consignment records in Block #2 to demonstrate cascading hash invalidation to auditors and restaurant owners.

### C. Frontend & UX Systems Engineer
- **Mission**: Designed a production-grade, zero-slop enterprise interface following the strict **Frontend Design Constitution**.
- **Implemented Principles**:
  - **Top Bar Contract**: Clean 3-zone layout (single-element wordmark, 5 single-line navigation links, 1 primary action button).
  - **Zero-Pill Metadata**: Replaced generic badge pills with clean inline typography separated by `·` or `/`.
  - **Print-Friendly PDF Engine**: Implemented `@media print` stylesheets enabling one-click generation of the official **JAKIM SPHM Audit Passport**.
  - **Mathematical SVG QR Generator**: Implemented `BatchQRCode.tsx`, generating vector QR matrices encoding direct verification URLs with vector `.svg` label downloads.

### D. AI Intelligence & Resilience Specialist
- **Mission**: Integrated the server-side `@google/genai` TypeScript SDK with `gemini-3.8-flash` to evaluate complex supplier invoices and cold-chain sensor streams.
- **Implemented Safeguards**:
  - Structured JSON response schemas (`responseSchema`) enforcing type-safe audit outputs.
  - Resilience protocol with 5-second `Promise.race` timeouts and an offline MS 1500:2019 expert rules fallback to handle cloud model demand spikes (503).

### E. DevOps & Release Engineer
- **Mission**: Guaranteed 100% build reliability across npm, GitHub Actions, and Vercel.
- **Key Interventions**:
  - Resolved `npm error ERESOLVE` by aligning `esbuild` to `^0.28.0` for Vite 8 compatibility.
  - Synchronized `package-lock.json` with 0 vulnerabilities.
  - Configured `.github/workflows/deploy.yml` for automated CI/CD and `vercel.json` for seamless static SPA deployments.

---

## 3. Tools & Technologies Utilized

| Tool / Library | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.0.1` | Core reactive UI engine with modern hooks architecture |
| **TypeScript** | `^7.0.2` | End-to-end static typing and contract enforcement |
| **Vite** | `^8.3.0` | Next-generation frontend bundler and dev server |
| **Tailwind CSS** | `^4.3.3` | Utility-first styling with `@custom-variant dark` support |
| **Express** | `^4.21.2` | Full-stack server proxy for secure server-side API routes |
| **@google/genai** | `^2.4.0` | Official Google GenAI SDK for Gemini 3.8 Flash audits |
| **Lucide React** | `^0.546.0` | Iconography for affordances and operational states |
| **Native Web Crypto** | Standard | SHA-256 cryptographic digest computation |

---

## 4. Documentation for Future Maintainers

### A. Adding New Verified Consignments
To add new default batches, edit `INITIAL_BATCHES` in `src/services/cryptoLedger.ts`. Ensure:
1. `batchNumber` adheres to `MY-<CATEGORY>-<YEAR>-<STATE>-<ID>`.
2. `events` contains sequential stages: `FARM_ORIGIN` $\rightarrow$ `HALAL_SLAUGHTER` $\rightarrow$ `COLD_CHAIN` $\rightarrow$ `DISTRIBUTION` $\rightarrow$ `RESTAURANT_KITCHEN`.
3. An associated transaction is included in `createInitialBlockchain()`.

### B. Connecting Real Blockchain RPC Nodes
To bridge this ledger to an external enterprise network (e.g., Hyperledger Fabric, Polygon, or Ethereum):
1. In `src/services/cryptoLedger.ts`, replace `mineNewBlock` with an asynchronous JSON-RPC call or smart contract invocation (`ethers.js` or `@hyperledger/fabric-gateway`).
2. Maintain the transaction payload structure defined in `src/types/blockchain.ts` to ensure compatibility with `TraceabilityTimelineView`.

### C. Security & Secret Governance
- **Zero Secrets in Repository**: Never commit `.env` files, API keys, or private keys to source control.
- `process.env.GEMINI_API_KEY` is injected strictly server-side by the runtime environment.
- The client communicates solely via `/api/*` endpoints and never receives the raw API token.

---

## 5. Contact & Maintainer Attribution

- **Developer**: Ammar Thaqif
- **Email**: `ammarthaqif.ar@gmail.com`
- **Consortium**: HalalChain Malaysia Consortium
