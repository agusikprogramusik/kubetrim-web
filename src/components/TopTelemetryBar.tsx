"use client";

import React from "react";
import { CloudProviderId, ThemeMode } from "@/types/finops";

interface TopTelemetryBarProps {
  activeCluster: string;
  cloudProvider: CloudProviderId;
  dynamicPricing: boolean;
  staticCpuRate: number;
  theme: ThemeMode;
  onToggleDynamicPricing: () => void;
  onToggleTheme: () => void;
}

export function TopTelemetryBar({
  activeCluster,
  cloudProvider,
  dynamicPricing,
  staticCpuRate,
  theme,
  onToggleDynamicPricing,
  onToggleTheme,
}: TopTelemetryBarProps) {
  return (
    <header className="swiss-cell px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="font-mono-tech text-xs tracking-widest uppercase px-2 py-1 border border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
          00 // KUBETRIM WEB v0.1.0-dev
        </span>
        <div>
          <span className="font-editorial text-2xl tracking-tight">
            Tactile FinOps &amp; Attribution Control Plane
          </span>
          <span className="font-mono-tech text-xs text-[var(--text-muted)] ml-3">
            CLUSTER: {activeCluster} // SCHEMA: v1
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleDynamicPricing}
          className={`mech-btn ${dynamicPricing ? "active-btn" : ""}`}
        >
          <span>
            PRICING //{" "}
            {dynamicPricing
              ? `DYNAMIC HUB VM (${cloudProvider.toUpperCase()})`
              : `STATIC LOCK ($${staticCpuRate.toFixed(3)}/vCPU)`}
          </span>
          <span className="mech-arrow">[ &lt;-&gt; ]</span>
        </button>

        <button type="button" onClick={onToggleTheme} className="mech-btn">
          <span>
            SURFACE // {theme === "obsidian" ? "OBSIDIAN DARK" : "WARM PAPER"}
          </span>
          <span className="mech-arrow">[ -&gt; ]</span>
        </button>
      </div>
    </header>
  );
}
