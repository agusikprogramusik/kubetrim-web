import { CloudProviderId, VmSkuPrice, WorkloadTelemetry } from "@/types/finops";

export async function resolveDynamicVmPricing(
  clusterId: string,
  provider: CloudProviderId,
  region: string,
  instanceTypes: string[]
): Promise<Record<string, VmSkuPrice> | null> {
  try {
    const res = await fetch("/api/v1/pricing/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cluster_id: clusterId,
        cloud_provider: provider,
        region,
        instance_types: instanceTypes,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.instance_prices) return null;

    const catalog: Record<string, VmSkuPrice> = {};
    for (const [sku, raw] of Object.entries<Record<string, unknown>>(data.instance_prices)) {
      catalog[sku] = {
        sku,
        vcpu: Number(raw.vcpu ?? 4),
        memoryGiB: Number(raw.memory_gib ?? 16),
        arch: raw.architecture === "arm64" ? "arm64" : "amd64",
        onDemandHourlyUSD: Number(raw.on_demand_hourly_usd ?? 0.192),
        spotHourlyUSD: Number(raw.spot_hourly_usd ?? 0.06),
        derivedVcpuHourlyUSD: Number(raw.derived_vcpu_hourly_usd ?? 0.035),
        derivedRamHourlyUSD: Number(raw.derived_gib_ram_hourly_usd ?? 0.0045),
      };
    }
    return catalog;
  } catch {
    return null;
  }
}

export async function dispatchGitOpsPr(
  w: WorkloadTelemetry,
  adjustedWasteUSD: number
): Promise<{ branch: string; title: string; url: string; status: string }> {
  try {
    const res = await fetch("/api/v1/gitops/pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cluster_id: w.clusterId,
        repository: "agusikprogramusik/env",
        base_branch: "main",
        dry_run: true,
        container: {
          namespace: w.namespace,
          workload_name: w.name,
          workload_kind: w.kind,
          container_name: w.container,
          config_hash: w.configHashT1,
          current_req_cpu_milli: w.reqCPUT1,
          target_req_cpu_milli: w.targetCPU,
          current_req_mem_bytes: w.reqMemMi * 1024 * 1024,
          target_req_mem_bytes: w.targetMemMi * 1024 * 1024,
          current_qos: w.qosCurrent,
          projected_qos: w.qosProjected,
          has_hpa: w.hasHPA,
          monthly_waste_usd: adjustedWasteUSD,
          risk_status: w.status,
        },
      }),
    });
    if (res.ok) {
      const pr = await res.json();
      return {
        branch: pr.branch_name,
        title: pr.title,
        url: pr.pr_url,
        status: pr.status,
      };
    }
  } catch {
    // Fallback to deterministic synthesis if Hub API is offline
  }

  return {
    branch: `kubetrim/optimize-${w.name}`,
    title: `feat(finops): right-size ${w.namespace}/${w.name} (-$${adjustedWasteUSD.toFixed(2)}/mo)`,
    url: "https://github.com/agusikprogramusik/env/pull/dry-run",
    status: "DRY_RUN_READY",
  };
}

export async function askFinOpsCopilot(
  query: string,
  clusterId: string
): Promise<{ answer: string; modelUsed: string; citations: string[] } | null> {
  try {
    const res = await fetch("/api/v1/copilot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, cluster_id: clusterId }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      answer: String(data.answer ?? ""),
      modelUsed: String(data.model_used ?? "unsloth/Qwen3.5-9B-GGUF:Q8_0"),
      citations: Array.isArray(data.citations) ? data.citations : [],
    };
  } catch {
    return null;
  }
}
