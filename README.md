# KGUINTERNATIONAL // TAVUS.IO × NHIL.NET
**The Sovereign Human Computing & No-Human-In-The-Loop (NHIL) Enterprise Automation Platform**

> *"We are way beyond static models. We are engineering living worlds in code now. Generated at runtime."*

---

## 🏛️ Architectural Overview

`kguinternational/tavus.io` synthesizes **Personified Application Layers (PALs)** and **Conversational Video Interfaces (CVI)** with the **NHIL Spec-Driven Enterprise Automation** ecosystem (`nhil.net`).

### 1. Foundation Sovereign SI Models
- **PHOENIX-S4 (Sovereign Render Core)**: Real-time 60 FPS emotional micro-expression and cranial kinematics synthesis generated dynamically at runtime.
- **RAVEN-S1 (Private KGU Empathy Engine Matrix)**: Multimodal visual and somatosensory context engine that sees, hears, and interprets human intent.
- **SPARROW-S1 (Sovereign Timing Protocol)**: Sub-150ms full-duplex conversational cadence over the Sovereign Transport Protocol.

### 2. Code-as-Geometry (Astra / Three.js Runtime 3D Core)
Located at [`src/components/ProceduralAvatarCanvas.tsx`](./src/components/ProceduralAvatarCanvas.tsx):
- **Zero External 3D Asset Files**: 100% mathematical runtime instantiation (zero `.gltf`, `.obj`, or `.mp4` static files).
- **Hierarchical Modular Sub-Assemblies**:
  1. `chassisGroup`: Cranial `THREE.LatheGeometry` shell + custom 2D `THREE.Shape` extruded collar base.
  2. `neuralCoreGroup`: Harmonic icosahedral nucleus + octahedral wireframe field.
  3. `opticVisorGroup`: Raven-S1 multimodal torus visor + dual optic sensors.
  4. `acousticGroup`: Counter-rotating harmonic rings + closed `THREE.CatmullRomCurve3` `THREE.TubeGeometry` neural conduits.
  5. `fastenersGroup`: `THREE.InstancedMesh` rendering 48 orbital synaptic fasteners with real-time radial phase modulation.
- **Interactive Exploded View (`explodeFactor` 0.00 – 1.00)**: Real-time inspection slider translating each sub-assembly along its inspection vector.

### 3. NHIL Spec-Driven Enterprise Automation (`nhil.net`)
- **2-Node Micro-Sprint Architecture**: Forces citizen developers to build, execute, and pin deterministic 2-node micro-sprints (`docs/system/n8n-guardrails/micro-sprint-architecture.md`).
- **Automated NHIL Workflow Reviewer SI (`POST /api/review-workflow`)**: Audits workflow JSON payloads for:
  1. **Micro-Sprint Node Bound**
  2. **Idempotency Guarantee** (`idempotencyKey` / `upsert` verification)
  3. **Autonomous Error Route** (`onError` / `continueOnFail` / dead-letter vault)
  4. **Sovereign Data & Loop Guard** (Zero PII leakage or recursive webhook loops)
- **5-Day Enterprise Bootcamp & Operations (`docs/ops/`)**: Complete curriculum (`bootcamp_curriculum.md`) and executive pitch script (`sales_deck.md`).

---

## 🔒 Security-First Architecture (Phase 0 Verified)
- Strict HTTP Security Headers configured in [`next.config.ts`](./next.config.ts) (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`).
- Per-IP sliding window rate limiting (`30 req/min`) and payload size bounds on all REST API endpoints.
- Local development and production servers bound explicitly to `127.0.0.1`.

---

## 🚀 Quickstart

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000` to launch the interactive Draggable Sovereign OS Workspace.
