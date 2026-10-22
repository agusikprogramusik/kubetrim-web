"use client";

import React from "react";
import { synthesizeKustomizePatch } from "@/lib/kustomize";
import {
  CopilotState,
  InspectorTab,
  PrDispatchResult,
  WorkloadTelemetry,
} from "@/types/finops";

interface PrecisionInspectorDrawerProps {
  selectedWorkload: WorkloadTelemetry;
  inspectorTab: InspectorTab;
  prStatus: PrDispatchResult | null;
  copilot: CopilotState;
  onChangeTab: (tab: InspectorTab) => void;
  onDispatchPr: () => void;
  onChangeCopilotQuery: (q: string) => void;
  onAskCopilot: () => void;
}

export function PrecisionInspectorDrawer({
  selectedWorkload,
  inspectorTab,
  prStatus,
  copilot,
  onChangeTab,
  onDispatchPr,
  onChangeCopilotQuery,
  onAskCopilot,
}: PrecisionInspectorDrawerProps) {
  return (
    <div className="swiss-cell lg:col-span-5 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-hairline)]">
          <div>
            <span className="font-mono-tech text-xs text-[var(--text-muted)] block">
              07 // PRECISION INSPECTOR &amp; RAG COPILOT
            </span>
            <h2 className="font-editorial text-2xl mt-0.5">
              {selectedWorkload.namespace}/{selectedWorkload.name}
            </h2>
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => onChangeTab("kustomize")}
              className={`mech-btn ${
                inspectorTab === "kustomize" ? "active-btn" : ""
              }`}
            >
              <span>KUSTOMIZE v5</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTab("copilot")}
              className={`mech-btn ${
                inspectorTab === "copilot" ? "active-btn" : ""
              }`}
            >
              <span>FINOPS COPILOT</span>
            </button>
          </div>
        </div>

        {inspectorTab === "kustomize" ? (
          <>
            <div className="mb-3 p-3 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] font-mono-tech text-xs">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1">
                <span>
                  TELEMETRY VERDICT // {selectedWorkload.configHashT0} -&gt;{" "}
                  {selectedWorkload.configHashT1}
                </span>
                <span>VM: {selectedWorkload.sku}</span>
              </div>
              <div className="text-[var(--text-primary)]">
                {selectedWorkload.note}
              </div>
            </div>

            <pre className="p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] font-mono-tech text-xs overflow-x-auto leading-relaxed text-[var(--accent-primary)]">
              {synthesizeKustomizePatch(selectedWorkload)}
            </pre>

            {prStatus && (
              <div className="mt-3 p-3 border border-[var(--accent-primary)] bg-[var(--bg-elevated)] font-mono-tech text-xs">
                {prStatus.loading ? (
                  <span>{prStatus.message}</span>
                ) : (
                  <>
                    <div className="font-bold text-[var(--accent-primary)]">
                      ✓ GITOPS PR SYNTHESIZED ({prStatus.status})
                    </div>
                    <div className="mt-1">BRANCH: {prStatus.branch}</div>
                    <div className="text-[var(--text-muted)]">
                      {prStatus.title}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] font-mono-tech text-xs">
              <div className="text-[10px] text-[var(--text-muted)] mb-1">
                ACTIVE MODEL // {copilot.modelUsed}
              </div>
              <div className="whitespace-pre-line leading-relaxed text-[var(--text-primary)]">
                {copilot.answer}
              </div>
              <div className="mt-2 pt-2 border-t border-[var(--border-hairline)] flex flex-wrap gap-1.5">
                {copilot.citations.map((cit) => (
                  <span
                    key={cit}
                    className="text-[10px] px-1.5 py-0.5 border border-[var(--border-hairline)] text-[var(--accent-primary)]"
                  >
                    {cit}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={copilot.query}
                onChange={(e) => onChangeCopilotQuery(e.target.value)}
                placeholder="Ask FinOps Copilot about cluster waste, VM SKUs, or OOM risk..."
                className="flex-1 px-3 py-2 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono-tech text-xs focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={onAskCopilot}
                className="mech-btn active-btn"
              >
                <span>{copilot.loading ? "..." : "QUERY RAG"}</span>
                <span className="mech-arrow">[ -&gt; ]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between font-mono-tech text-[11px] text-[var(--text-muted)]">
        <span>ZERO-MUTATION GITOPS // READ-ONLY RBAC</span>
        <button type="button" onClick={onDispatchPr} className="mech-btn">
          <span>DISPATCH 1-CLICK PR</span>
          <span className="mech-arrow">[ -&gt; ]</span>
        </button>
      </div>
    </div>
  );
}
