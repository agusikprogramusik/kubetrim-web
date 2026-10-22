export type ThemeMode = "obsidian" | "paper";
export type TraceMode = "attribution" | "sawtooth";
export type InspectorTab = "kustomize" | "copilot";
export type CloudProviderId = "aws" | "gcp" | "azure" | "on-prem";

export type RiskStatus =
  | "VERIFIED_SAVINGS"
  | "IDLE_GPU"
  | "LEAK_SUSPECTED"
  | "HPA_MANAGED";

export interface VmSkuPrice {
  sku: string;
  vcpu: number;
  memoryGiB: number;
  arch: "amd64" | "arm64";
  onDemandHourlyUSD: number;
  spotHourlyUSD: number;
  derivedVcpuHourlyUSD: number;
  derivedRamHourlyUSD: number;
}

export interface WorkloadTelemetry {
  idx: string;
  clusterId: string;
  namespace: string;
  name: string;
  kind: "Deployment" | "StatefulSet" | "DaemonSet";
  container: string;
  sku: string;
  arch: "amd64" | "arm64";
  isSpot: boolean;
  replicas: number;
  configHashT0: string;
  configHashT1: string;
  reqCPUT0: number;
  reqCPUT1: number;
  targetCPU: number;
  reqMemMi: number;
  targetMemMi: number;
  qosCurrent: "Guaranteed" | "Burstable" | "BestEffort";
  qosProjected: "Guaranteed" | "Burstable" | "BestEffort";
  hasHPA: boolean;
  status: RiskStatus;
  baseWasteUSD: number;
  realizedUSD: number;
  oomDelta: number;
  throttleDelta: string;
  note: string;
}

export interface PrDispatchResult {
  loading: boolean;
  branch?: string;
  title?: string;
  url?: string;
  status?: string;
  message?: string;
}

export interface CopilotState {
  query: string;
  answer: string;
  modelUsed: string;
  citations: string[];
  loading: boolean;
}
