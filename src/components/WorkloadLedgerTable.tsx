"use client";

import React from "react";
import { RiskStatus, ThemeMode, WorkloadTelemetry } from "@/types/finops";

interface WorkloadLedgerTableProps {
  workloads: WorkloadTelemetry[];
  selectedIndex: number;
  priceMultiplier: number;
  theme: ThemeMode;
  onSelectWorkload: (index: number) => void;
  onSynthesizePr: (index: number) => void;
}

function getStatusBadgeClass(status: RiskStatus, theme: ThemeMode): string {
  if (theme === "paper") {
    switch (status) {
      case "VERIFIED_SAVINGS":
        return "border-[#FF4F00] text-[#FF4F00]";
      case "IDLE_GPU":
        return "border-[#D97706] text-[#D97706]";
      case "LEAK_SUSPECTED":
        return "border-[#C81E1E] text-[#C81E1E]";
      case "HPA_MANAGED":
        return "border-[#62605B] text-[#62605B]";
    }
  }
  switch (status) {
    case "VERIFIED_SAVINGS":
      return "border-[#D4FF00] text-[#D4FF00]";
    case "IDLE_GPU":
      return "border-[#F59E0B] text-[#F59E0B]";
    case "LEAK_SUSPECTED":
      return "border-[#FF3B30] text-[#FF3B30]";
    case "HPA_MANAGED":
      return "border-[#8E929F] text-[#8E929F]";
  }
}

export function WorkloadLedgerTable({
  workloads,
  selectedIndex,
  priceMultiplier,
  theme,
  onSelectWorkload,
  onSynthesizePr,
}: WorkloadLedgerTableProps) {
  return (
    <div className="swiss-cell lg:col-span-7 p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-hairline)]">
        <div>
          <span className="font-mono-tech text-xs text-[var(--text-muted)] block">
            06 // WORKLOAD RIGHT-SIZING LEDGER
          </span>
          <h2 className="font-editorial text-2xl mt-0.5">
            Audited Containers &amp; GitOps Dispatch
          </h2>
        </div>
        <span className="font-mono-tech text-xs text-[var(--text-muted)]">
          CLICK ROW TO INSPECT // {workloads.length} WORKLOADS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-hairline)] font-mono-tech text-[11px] text-[var(--text-muted)] uppercase">
              <th className="py-2.5 pr-2">IDX</th>
              <th className="py-2.5 px-2">WORKLOAD (NS/KIND)</th>
              <th className="py-2.5 px-2">NODE VM SKU</th>
              <th className="py-2.5 px-2">CPU / MEM DELTA</th>
              <th className="py-2.5 px-2">STATUS</th>
              <th className="py-2.5 px-2 text-right">WASTE / MO</th>
              <th className="py-2.5 pl-2 text-right">GITOPS ACTION</th>
            </tr>
          </thead>
          <tbody className="font-mono-tech text-xs">
            {workloads.map((w, idx) => {
              const adjWaste = (w.baseWasteUSD * priceMultiplier).toFixed(2);
              const isSelected = idx === selectedIndex;

              return (
                <tr
                  key={w.idx}
                  onClick={() => onSelectWorkload(idx)}
                  className={`workload-row ${isSelected ? "selected-row" : ""}`}
                >
                  <td className="py-3.5 pr-2 text-[var(--text-muted)]">
                    {w.idx} //
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="font-bold text-[var(--text-primary)]">
                      {w.namespace}/{w.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {w.kind} • {w.replicas} rep • QoS: {w.qosProjected}
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div>{w.sku}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {w.arch}
                      {w.isSpot ? " • SPOT" : ""}
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <div>
                      CPU: {w.reqCPUT0}m -&gt;{" "}
                      <span className="text-[var(--accent-primary)]">
                        {w.targetCPU}m
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      RAM: {w.reqMemMi}Mi -&gt; {w.targetMemMi}Mi
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <span
                      className={`font-mono-tech text-[11px] px-2 py-0.5 border ${getStatusBadgeClass(
                        w.status,
                        theme
                      )}`}
                    >
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold">
                    ${adjWaste}
                  </td>
                  <td className="py-3.5 pl-2 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSynthesizePr(idx);
                      }}
                      className="mech-btn"
                    >
                      <span>
                        {w.status === "LEAK_SUSPECTED"
                          ? "INSPECT LOCK"
                          : "SYNTHESIZE PR"}
                      </span>
                      <span className="mech-arrow">[ -&gt; ]</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
