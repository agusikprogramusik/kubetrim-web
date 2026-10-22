"use client";

import React from "react";
import { CloudProviderId, VmSkuPrice } from "@/types/finops";

interface VmPricingMatrixProps {
  cloudProvider: CloudProviderId;
  cloudRegion: string;
  dynamicPricing: boolean;
  staticCpuRate: number;
  staticRamRate: number;
  vmCatalog: Record<string, VmSkuPrice>;
  onSelectProvider: (provider: CloudProviderId, region: string) => void;
  onChangeStaticRates: (cpuRate: number, ramRate: number) => void;
}

const PROVIDERS: Array<{ id: CloudProviderId; label: string; region: string }> = [
  { id: "aws", label: "AWS", region: "eu-central-1" },
  { id: "gcp", label: "GCP", region: "europe-west1" },
  { id: "azure", label: "AZURE", region: "westeurope" },
  { id: "on-prem", label: "ON-PREM", region: "dc-eu-central" },
];

export function VmPricingMatrix({
  cloudProvider,
  cloudRegion,
  dynamicPricing,
  staticCpuRate,
  staticRamRate,
  vmCatalog,
  onSelectProvider,
  onChangeStaticRates,
}: VmPricingMatrixProps) {
  return (
    <div className="swiss-cell lg:col-span-4 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-hairline)]">
          <div>
            <span className="font-mono-tech text-xs text-[var(--text-muted)] block">
              05 // BIDIRECTIONAL VM PRICING API
            </span>
            <h2 className="font-editorial text-2xl mt-0.5">
              Cluster Node SKU Rates
            </h2>
          </div>
          <span className="font-mono-tech text-[11px] px-2 py-0.5 border border-[var(--border-hairline)]">
            {dynamicPricing ? "HUB LIVE SYNC" : "STATIC OVERRIDE"}
          </span>
        </div>

        {/* Cloud Provider Selector */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectProvider(p.id, p.region)}
              className={`mech-btn justify-center ${
                cloudProvider === p.id && dynamicPricing ? "active-btn" : ""
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Optional Static Rate Inputs when Static Override is active */}
        {!dynamicPricing && (
          <div className="grid grid-cols-2 gap-2 mb-3 p-2.5 border border-[var(--accent-amber)] bg-[var(--bg-elevated)] font-mono-tech text-xs">
            <label className="block">
              <span className="text-[10px] text-[var(--text-muted)] block">
                STATIC vCPU ($/h)
              </span>
              <input
                type="number"
                step="0.005"
                value={staticCpuRate}
                onChange={(e) =>
                  onChangeStaticRates(Number(e.target.value) || 0.035, staticRamRate)
                }
                className="w-full mt-1 px-2 py-1 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] text-[var(--text-muted)] block">
                STATIC GiB RAM ($/h)
              </span>
              <input
                type="number"
                step="0.001"
                value={staticRamRate}
                onChange={(e) =>
                  onChangeStaticRates(staticCpuRate, Number(e.target.value) || 0.0045)
                }
                className="w-full mt-1 px-2 py-1 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)]"
              />
            </label>
          </div>
        )}

        {/* Discovered Node VM Instance Types */}
        <div className="space-y-2 font-mono-tech text-xs">
          {Object.values(vmCatalog).map((vm) => {
            const effVcpu = dynamicPricing ? vm.derivedVcpuHourlyUSD : staticCpuRate;
            const effRam = dynamicPricing ? vm.derivedRamHourlyUSD : staticRamRate;
            const effNodeHourly = dynamicPricing
              ? vm.onDemandHourlyUSD
              : vm.vcpu * staticCpuRate + vm.memoryGiB * staticRamRate;

            return (
              <div
                key={vm.sku}
                className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[var(--text-primary)]">
                    {vm.sku}{" "}
                    <span className="text-[var(--text-muted)] font-normal">
                      ({vm.arch} // {vm.vcpu}vCPU {vm.memoryGiB}GiB)
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    vCPU: ${effVcpu.toFixed(4)}/h | GiB: ${effRam.toFixed(4)}/h
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[var(--accent-primary)] font-bold">
                    ${effNodeHourly.toFixed(4)}/h
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Spot: ${vm.spotHourlyUSD.toFixed(4)}/h
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-hairline)] font-mono-tech text-[11px] text-[var(--text-muted)] flex items-center justify-between">
        <span>API: POST /api/v1/pricing/resolve</span>
        <span>REGION: {cloudRegion}</span>
      </div>
    </div>
  );
}
