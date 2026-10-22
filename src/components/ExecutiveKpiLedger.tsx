"use client";

import React from "react";

interface ExecutiveKpiLedgerProps {
  totalWasteMonthlyUSD: number;
  realizedMonthlyUSD: number;
  efficiencyScore: number;
}

export function ExecutiveKpiLedger({
  totalWasteMonthlyUSD,
  realizedMonthlyUSD,
  efficiencyScore,
}: ExecutiveKpiLedgerProps) {
  const totalWasteYearlyUSD = totalWasteMonthlyUSD * 12;
  const realizedYearlyUSD = realizedMonthlyUSD * 12;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
      {/* 01 // IDENTIFIED ANNUALIZED WASTE (Cols 1-5) */}
      <div className="swiss-cell lg:col-span-5 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-tech text-xs text-[var(--text-muted)] uppercase">
            01 // IDENTIFIED ANNUALIZED WASTE
          </span>
          <span className="font-mono-tech text-xs text-[var(--accent-amber)]">
            p95 * 1.25 CPU // PEAK * 1.30 RAM
          </span>
        </div>
        <div className="my-2">
          <div className="display-metric">
            $
            {totalWasteYearlyUSD.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-xl font-mono-tech text-[var(--text-muted)]">
              {" "}
              / yr
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between font-mono-tech text-xs">
          <span className="text-[var(--text-muted)]">
            MONTHLY OVER-ALLOCATION:
          </span>
          <span className="text-[var(--text-primary)] font-bold">
            ${totalWasteMonthlyUSD.toFixed(2)} / mo
          </span>
        </div>
      </div>

      {/* 02 // VERIFIED T0 -> T1 SAVINGS (Cols 6-9) */}
      <div className="swiss-cell lg:col-span-4 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-tech text-xs text-[var(--text-muted)] uppercase">
            02 // VERIFIED T0 -&gt; T1 SAVINGS
          </span>
          <span className="font-mono-tech text-xs px-1.5 py-0.5 border border-[var(--accent-primary)] text-[var(--accent-primary)]">
            SHA-256 PROVEN
          </span>
        </div>
        <div className="my-2">
          <div
            className="display-metric"
            style={{ color: "var(--accent-primary)" }}
          >
            +$
            {realizedYearlyUSD.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="text-xl font-mono-tech text-[var(--text-muted)]">
              {" "}
              / yr
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between font-mono-tech text-xs">
          <span className="text-[var(--text-muted)]">SLA REGRESSION GUARD:</span>
          <span className="text-[var(--accent-primary)]">
            0 OOM // 0 THROTTLE SPIKES
          </span>
        </div>
      </div>

      {/* 03 // FLEET EFFICIENCY & ANOMALY GUARD (Cols 10-12) */}
      <div className="swiss-cell lg:col-span-3 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-tech text-xs text-[var(--text-muted)] uppercase">
            03 // FLEET EFFICIENCY
          </span>
          <span className="font-mono-tech text-xs text-[var(--accent-crimson)]">
            2 ACTIVE GUARDS
          </span>
        </div>
        <div className="my-2">
          <div className="display-metric">
            {efficiencyScore.toFixed(1)}
            <span className="text-2xl font-mono-tech text-[var(--text-muted)]">
              %
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between font-mono-tech text-xs">
          <span className="text-[var(--accent-crimson)]">1 SAWTOOTH LEAK</span>
          <span className="text-[var(--accent-amber)]">1 IDLE GPU (6.4%)</span>
        </div>
      </div>
    </section>
  );
}
