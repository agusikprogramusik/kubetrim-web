import assert from "node:assert/strict";
import {
  calculatePriceMultiplier,
  INITIAL_WORKLOADS,
  synthesizeKustomizePatch,
} from "../kustomize";

function runTests() {
  // 1. Dynamic vs Static pricing multiplier
  const awsMult = calculatePriceMultiplier(true, "aws", 0.035);
  assert.equal(awsMult, 1.0, "AWS dynamic multiplier should be 1.0");

  const gcpMult = calculatePriceMultiplier(true, "gcp", 0.035);
  assert.equal(gcpMult, 0.94, "GCP dynamic multiplier should be 0.94");

  const staticMult = calculatePriceMultiplier(false, "aws", 0.0363);
  assert.equal(staticMult, 1.0, "Static override at 0.0363 should yield 1.0 ratio");

  // 2. Kustomize v5 patch synthesis & Anomaly Guardrails
  const checkout = INITIAL_WORKLOADS[0];
  const checkoutPatch = synthesizeKustomizePatch(checkout);
  assert.ok(checkoutPatch.includes('cpu: "450m"'), "Expected right-sized 450m CPU in checkout patch");
  assert.ok(checkoutPatch.includes('finops.kubetrim.io/vm-sku: "m6i.xlarge"'), "Expected VM SKU annotation");

  // 3. Sawtooth Memory Leak guardrail blocks memory upsizing
  const leakWorkload = INITIAL_WORKLOADS[2];
  const leakPatch = synthesizeKustomizePatch(leakWorkload);
  assert.ok(
    leakPatch.includes("LOCKED BY ANOMALY GUARD (SAWTOOTH LEAK)"),
    "Expected sawtooth leak workload to lock memory request"
  );

  // 4. HPA Anti-Flapping guardrail locks CPU request
  const hpaWorkload = INITIAL_WORKLOADS[3];
  const hpaPatch = synthesizeKustomizePatch(hpaWorkload);
  assert.ok(
    hpaPatch.includes("LOCKED BY HPA ANTI-FLAPPING GUARD"),
    "Expected HPA-managed workload to lock CPU request"
  );

  console.log("✓ All kubetrim-web FinOps & Kustomize unit tests passed.");
}

runTests();
