import { CloudProviderId, VmSkuPrice, WorkloadTelemetry } from "@/types/finops";

export const DEFAULT_VM_CATALOG: Record<string, VmSkuPrice> = {
  "m6i.xlarge": {
    sku: "m6i.xlarge",
    vcpu: 4,
    memoryGiB: 16,
    arch: "amd64",
    onDemandHourlyUSD: 0.2074,
    spotHourlyUSD: 0.0664,
    derivedVcpuHourlyUSD: 0.0363,
    derivedRamHourlyUSD: 0.0039,
  },
  "m7g.large": {
    sku: "m7g.large",
    vcpu: 2,
    memoryGiB: 8,
    arch: "arm64",
    onDemandHourlyUSD: 0.0881,
    spotHourlyUSD: 0.0247,
    derivedVcpuHourlyUSD: 0.0308,
    derivedRamHourlyUSD: 0.0033,
  },
  "g5.xlarge": {
    sku: "g5.xlarge",
    vcpu: 4,
    memoryGiB: 16,
    arch: "amd64",
    onDemandHourlyUSD: 1.0865,
    spotHourlyUSD: 0.3803,
    derivedVcpuHourlyUSD: 0.0420,
    derivedRamHourlyUSD: 0.0048,
  },
};

export const INITIAL_WORKLOADS: WorkloadTelemetry[] = [
  {
    idx: "01",
    clusterId: "prod-eu-central-1",
    namespace: "payments",
    name: "checkout-engine",
    kind: "Deployment",
    container: "api",
    sku: "m6i.xlarge",
    arch: "amd64",
    isSpot: false,
    replicas: 6,
    configHashT0: "sha256:9c11b0a4",
    configHashT1: "sha256:2f88e91b",
    reqCPUT0: 2000,
    reqCPUT1: 450,
    targetCPU: 450,
    reqMemMi: 4096,
    targetMemMi: 1024,
    qosCurrent: "Guaranteed",
    qosProjected: "Guaranteed",
    hasHPA: false,
    status: "VERIFIED_SAVINGS",
    baseWasteUSD: 412.8,
    realizedUSD: 394.3,
    oomDelta: 0,
    throttleDelta: "0.4%",
    note: "T0->T1 ConfigHash verified. 1.25x p95 CPU headroom preserved; oom_score_adj=-997.",
  },
  {
    idx: "02",
    clusterId: "prod-eu-central-1",
    namespace: "ml-inference",
    name: "qwen-rag-worker",
    kind: "Deployment",
    container: "vllm-shard",
    sku: "g5.xlarge",
    arch: "amd64",
    isSpot: false,
    replicas: 1,
    configHashT0: "sha256:3e77d192",
    configHashT1: "sha256:3e77d192",
    reqCPUT0: 4000,
    reqCPUT1: 4000,
    targetCPU: 1000,
    reqMemMi: 16384,
    targetMemMi: 8192,
    qosCurrent: "Burstable",
    qosProjected: "Burstable",
    hasHPA: false,
    status: "IDLE_GPU",
    baseWasteUSD: 794.5,
    realizedUSD: 0.0,
    oomDelta: 0,
    throttleDelta: "0.0%",
    note: "NVIDIA A10G GPU average duty cycle 6.4% (<20% threshold) over 14d window.",
  },
  {
    idx: "03",
    clusterId: "prod-eu-central-1",
    namespace: "billing",
    name: "invoice-aggregator",
    kind: "StatefulSet",
    container: "worker",
    sku: "m7g.large",
    arch: "arm64",
    isSpot: false,
    replicas: 3,
    configHashT0: "sha256:6b20f44e",
    configHashT1: "sha256:6b20f44e",
    reqCPUT0: 1500,
    reqCPUT1: 1500,
    targetCPU: 400,
    reqMemMi: 4096,
    targetMemMi: 4096,
    qosCurrent: "Burstable",
    qosProjected: "Burstable",
    hasHPA: false,
    status: "LEAK_SUSPECTED",
    baseWasteUSD: 218.4,
    realizedUSD: 0.0,
    oomDelta: 4,
    throttleDelta: "1.1%",
    note: "14-day sawtooth slope +48.5MiB/h with 4 OOMKilled (exit 137) resets. RAM upsizing BLOCKED.",
  },
  {
    idx: "04",
    clusterId: "prod-eu-central-1",
    namespace: "core-gateway",
    name: "envoy-edge",
    kind: "Deployment",
    container: "proxy",
    sku: "m7g.large",
    arch: "arm64",
    isSpot: true,
    replicas: 4,
    configHashT0: "sha256:1d84e20c",
    configHashT1: "sha256:1d84e20c",
    reqCPUT0: 1000,
    reqCPUT1: 1000,
    targetCPU: 1000,
    reqMemMi: 2048,
    targetMemMi: 768,
    qosCurrent: "Burstable",
    qosProjected: "Burstable",
    hasHPA: true,
    status: "HPA_MANAGED",
    baseWasteUSD: 124.3,
    realizedUSD: 0.0,
    oomDelta: 0,
    throttleDelta: "2.8%",
    note: "HPA_GUARD active on cpu utilization metric. CPU request locked to prevent autoscaler flapping.",
  },
];

export function calculatePriceMultiplier(
  dynamicPricing: boolean,
  provider: CloudProviderId,
  staticCpuRate: number
): number {
  if (!dynamicPricing) {
    const ratio = staticCpuRate > 0 ? staticCpuRate / 0.0363 : 0.88;
    return Math.round(ratio * 1000) / 1000;
  }
  const providerMultipliers: Record<CloudProviderId, number> = {
    aws: 1.0,
    gcp: 0.94,
    azure: 1.02,
    "on-prem": 0.64,
  };
  return providerMultipliers[provider] ?? 1.0;
}

export function synthesizeKustomizePatch(w: WorkloadTelemetry): string {
  const targetMem =
    w.status === "LEAK_SUSPECTED"
      ? `${w.reqMemMi}Mi # LOCKED BY ANOMALY GUARD (SAWTOOTH LEAK)`
      : `${w.targetMemMi}Mi`;
  const targetCPU = w.hasHPA
    ? `${w.reqCPUT1}m # LOCKED BY HPA ANTI-FLAPPING GUARD`
    : `${w.targetCPU}m`;

  return `apiVersion: apps/v1
kind: ${w.kind}
metadata:
  name: ${w.name}
  namespace: ${w.namespace}
  annotations:
    finops.kubetrim.io/config-hash-t0: "${w.configHashT0}"
    finops.kubetrim.io/vm-sku: "${w.sku}"
spec:
  template:
    spec:
      containers:
        - name: ${w.container}
          resources:
            requests:
              cpu: "${targetCPU}"
              memory: "${targetMem}"
            limits:
              cpu: "${w.targetCPU * 2}m"
              memory: "${w.targetMemMi}Mi"`;
}
