# KubeTrim Web

> **Avant-Garde Tactile Editorial & Precision UI Executive FinOps Dashboard for Kubernetes**
> *Version: `0.1.0-dev` | Stack: `Node 26 LTS` • `Next.js 16 (App Router)` • `React 19` • `TypeScript 5.9` • `TailwindCSS v4`*

`kubetrim-web` is the dedicated frontend repository for the KubeTrim ecosystem, connecting to [`kubetrim-hub`](../kubetrim-hub) (`:8090`) and visualizing telemetry ingested from [`kubetrim`](../kubetrim) CLI/Agents.

---

## 🎨 October 2026 Design System ("Tactile Editorial & Precision UI")

Built in strict compliance with [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) and [`AGENTS.md`](./AGENTS.md):
- **Palettes:** **Obsidian Industrial Dark** (`#0B0C0E` canvas, `#121316` surface, `#22242A` hairlines, `#D4FF00` Acid Lime accent) & toggleable **Warm Analog Light** (`#F6F5F0` paper canvas, `#141413` ink, `#E6E4DD` stone hairlines, `#FF4F00` International Orange accent).
- **Typography Trio:** `Instrument Serif` (fluid `clamp()` headlines & financial metrics, `-0.03em` tracking) + `Plus Jakarta Sans` (operational UI) + `JetBrains Mono` (`tabular-nums`, indices `01 //`, `ConfigHash`, VM SKUs).
- **Spatial Architecture:** 12-column Asymmetric Swiss Blueprint Grid with exposed `1px solid` structural hairlines, top-edge inner highlights (`inset 0 1px 0 0`), and fixed SVG `fractalNoise` overlay (`0.035` opacity).
- **Zero AI/SaaS Clichés:** Zero indigo/purple gradients, zero symmetrical 3-column icon cards, zero blurry outer drop shadows.

---

## 🏛️ Modular React 19 Component Architecture

```text
kubetrim-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Google Fonts trio + fixed SVG fractalNoise overlay
│   │   ├── globals.css                     # TailwindCSS v4 + Obsidian/Paper CSS tokens & bezier rules
│   │   └── page.tsx                        # Main 12-column Swiss Blueprint Dashboard container
│   ├── components/
│   │   ├── TopTelemetryBar.tsx             # 00 // Cluster selector, Dynamic/Static Pricing & Theme toggles
│   │   ├── ExecutiveKpiLedger.tsx          # 01-03 // Asymmetric KPI cells (Waste, Verified ROI, Efficiency)
│   │   ├── DualTraceOscilloscope.tsx       # 04 // SVG T0->T1 Attribution Curve & 14-Day Sawtooth Leak Trace
│   │   ├── VmPricingMatrix.tsx             # 05 // Bidirectional Cloud & VM SKU Pricing Matrix (AWS/GCP/Azure)
│   │   ├── WorkloadLedgerTable.tsx         # 06 // Right-sizing table with mechanical fill-wipe actions
│   │   └── PrecisionInspectorDrawer.tsx    # 07 // Live Kustomize v5 Patch Synthesizer & Qwen3.5-9B RAG Copilot
│   ├── lib/
│   │   ├── hub-client.ts                   # Typed REST client for kubetrim-hub (:8090/api/v1/*)
│   │   └── kustomize.ts                    # Client-side Kustomize v5 strategic merge patch previewer
│   └── types/
│       └── finops.ts                       # Canonical TypeScript interfaces matching kubetrim-hub domain
├── Dockerfile                              # Multi-stage Node 26 Alpine production build
├── next.config.ts                          # Next.js 16 config & /api/v1 proxy rewrites
├── package.json
└── tsconfig.json
```
