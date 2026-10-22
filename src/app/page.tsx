"use client";

import React, { useState } from "react";
import { DualTraceOscilloscope } from "@/components/DualTraceOscilloscope";
import { ExecutiveKpiLedger } from "@/components/ExecutiveKpiLedger";
import { PrecisionInspectorDrawer } from "@/components/PrecisionInspectorDrawer";
import { TopTelemetryBar } from "@/components/TopTelemetryBar";
import { VmPricingMatrix } from "@/components/VmPricingMatrix";
import { WorkloadLedgerTable } from "@/components/WorkloadLedgerTable";
import {
  askFinOpsCopilot,
  dispatchGitOpsPr,
  resolveDynamicVmPricing,
} from "@/lib/hub-client";
import {
  calculatePriceMultiplier,
  DEFAULT_VM_CATALOG,
  INITIAL_WORKLOADS,
} from "@/lib/kustomize";
import {
  CloudProviderId,
  CopilotState,
  InspectorTab,
  PrDispatchResult,
  ThemeMode,
  TraceMode,
  VmSkuPrice,
} from "@/types/finops";

export default function KubeTrimDashboardPage() {
  const [theme, setTheme] = useState<ThemeMode>("obsidian");
  const [activeCluster] = useState<string>("prod-eu-central-1");
  const [traceMode, setTraceMode] = useState<TraceMode>("sawtooth");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("kustomize");
  const [cloudProvider, setCloudProvider] = useState<CloudProviderId>("aws");
  const [cloudRegion, setCloudRegion] = useState<string>("eu-central-1");
  const [dynamicPricing, setDynamicPricing] = useState<boolean>(true);
  const [staticCpuRate, setStaticCpuRate] = useState<number>(0.035);
  const [staticRamRate, setStaticRamRate] = useState<number>(0.0045);
  const [vmCatalog, setVmCatalog] =
    useState<Record<string, VmSkuPrice>>(DEFAULT_VM_CATALOG);
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const [prStatus, setPrStatus] = useState<PrDispatchResult | null>(null);

  const [copilot, setCopilot] = useState<CopilotState>({
    query:
      "Which workload has the highest GPU or CPU waste and is it safe to resize?",
    answer:
      "Based on live telemetry from prod-eu-central-1:\n• ml-inference/qwen-rag-worker (g5.xlarge) wastes $794.50/mo with 6.4% GPU duty cycle (IDLE_GPU).\n• payments/checkout-engine (m6i.xlarge) achieved +$394.30/mo VERIFIED_SAVINGS (2000m -> 450m) with zero OOM or CFS throttle regressions.\n• billing/invoice-aggregator exhibits a 14-day sawtooth memory leak (4 OOMKilled resets); automatic RAM upsizing is BLOCKED by Anomaly Guard.",
    modelUsed: "unsloth/Qwen3.5-9B-GGUF:Q8_0 (llama-server :8080)",
    citations: [
      "snapshot:prod-eu-central-1@snap-aws-t1-c402e",
      "workload:payments/checkout-engine",
      "anomaly:billing/invoice-aggregator",
    ],
    loading: false,
  });

  const priceMultiplier = calculatePriceMultiplier(
    dynamicPricing,
    cloudProvider,
    staticCpuRate
  );

  const totalWasteMonthlyUSD = INITIAL_WORKLOADS.reduce(
    (acc, w) => acc + w.baseWasteUSD * priceMultiplier,
    0
  );
  const realizedMonthlyUSD = INITIAL_WORKLOADS.reduce(
    (acc, w) => acc + w.realizedUSD * priceMultiplier,
    0
  );

  const handleToggleTheme = () => {
    const next: ThemeMode = theme === "obsidian" ? "paper" : "obsidian";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  const handleSelectProvider = async (
    provider: CloudProviderId,
    region: string
  ) => {
    setCloudProvider(provider);
    setCloudRegion(region);
    setDynamicPricing(true);
    const resolved = await resolveDynamicVmPricing(
      activeCluster,
      provider,
      region,
      ["m6i.xlarge", "m7g.large", "g5.xlarge"]
    );
    if (resolved) {
      setVmCatalog(resolved);
    }
  };

  const handleSelectWorkload = (index: number) => {
    setSelectedIndex(index);
    if (INITIAL_WORKLOADS[index].status === "LEAK_SUSPECTED") {
      setTraceMode("sawtooth");
    } else if (INITIAL_WORKLOADS[index].status === "VERIFIED_SAVINGS") {
      setTraceMode("attribution");
    }
  };

  const handleSynthesizePr = async (index: number) => {
    setSelectedIndex(index);
    setInspectorTab("kustomize");
    setPrStatus({
      loading: true,
      message: "Synthesizing Kustomize v5 strategic merge patch...",
    });

    const w = INITIAL_WORKLOADS[index];
    const adjWaste = Number((w.baseWasteUSD * priceMultiplier).toFixed(2));
    const result = await dispatchGitOpsPr(w, adjWaste);
    setPrStatus({
      loading: false,
      branch: result.branch,
      title: result.title,
      url: result.url,
      status: result.status,
    });
  };

  const handleAskCopilot = async () => {
    if (!copilot.query.trim()) return;
    setCopilot((prev) => ({ ...prev, loading: true }));
    const res = await askFinOpsCopilot(copilot.query, activeCluster);
    if (res) {
      setCopilot((prev) => ({
        ...prev,
        answer: res.answer,
        modelUsed: res.modelUsed,
        citations: res.citations,
        loading: false,
      }));
    } else {
      setCopilot((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 py-4 md:px-6 md:py-6">
      <TopTelemetryBar
        activeCluster={activeCluster}
        cloudProvider={cloudProvider}
        dynamicPricing={dynamicPricing}
        staticCpuRate={staticCpuRate}
        theme={theme}
        onToggleDynamicPricing={() => setDynamicPricing((prev) => !prev)}
        onToggleTheme={handleToggleTheme}
      />

      <ExecutiveKpiLedger
        totalWasteMonthlyUSD={totalWasteMonthlyUSD}
        realizedMonthlyUSD={realizedMonthlyUSD}
        efficiencyScore={78.4}
      />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        <DualTraceOscilloscope
          traceMode={traceMode}
          theme={theme}
          onChangeTraceMode={setTraceMode}
        />

        <VmPricingMatrix
          cloudProvider={cloudProvider}
          cloudRegion={cloudRegion}
          dynamicPricing={dynamicPricing}
          staticCpuRate={staticCpuRate}
          staticRamRate={staticRamRate}
          vmCatalog={vmCatalog}
          onSelectProvider={handleSelectProvider}
          onChangeStaticRates={(cpu, ram) => {
            setStaticCpuRate(cpu);
            setStaticRamRate(ram);
          }}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <WorkloadLedgerTable
          workloads={INITIAL_WORKLOADS}
          selectedIndex={selectedIndex}
          priceMultiplier={priceMultiplier}
          theme={theme}
          onSelectWorkload={handleSelectWorkload}
          onSynthesizePr={handleSynthesizePr}
        />

        <PrecisionInspectorDrawer
          selectedWorkload={INITIAL_WORKLOADS[selectedIndex]}
          inspectorTab={inspectorTab}
          prStatus={prStatus}
          copilot={copilot}
          onChangeTab={setInspectorTab}
          onDispatchPr={() => handleSynthesizePr(selectedIndex)}
          onChangeCopilotQuery={(query) =>
            setCopilot((prev) => ({ ...prev, query }))
          }
          onAskCopilot={handleAskCopilot}
        />
      </section>
    </main>
  );
}
