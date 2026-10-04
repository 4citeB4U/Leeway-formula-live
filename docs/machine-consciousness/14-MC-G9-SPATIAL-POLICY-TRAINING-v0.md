<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9_SPATIAL_POLICY_TRAINING
5WH:
WHAT = Train and verify the Machine Consciousness belief-to-policy bridge after spatial evidence improved belief accuracy
WHY = MC-G9 spatial ablation reduced prediction error 58.36% but did not improve preferred-state outcomes
WHO = Leeway Industries / Creator-authorized Machine Consciousness research runtime
WHERE = docs/machine-consciousness/14-MC-G9-SPATIAL-POLICY-TRAINING-v0.md
WHEN = 2026-10-04
HOW = Matched worlds -> spatial belief -> candidate policy valuation -> train/holdout parameter search -> canonical Formula execution -> Veritas
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
-->

# MC-G9 Spatial Belief -> Policy Training v0

Status: ACTIVE RESEARCH / NO POLICY PROMOTION

## Proven starting evidence

Previous controlled ablation:
- spatial OFF Brier = 0.11507056651515558
- spatial ON Brier = 0.04791044248670661
- prediction improvement = 58.36429424339675%
- preferred-state delta = -0.048828125 percentage points
- OFF and ON 16x6 cognition windows both executed through canonical LEEWAY-FORMULA-v1.0 and produced different Formula result hashes.

Therefore spatial evidence is causally useful for belief accuracy in the simulator, but improved belief has not yet been shown to improve action policy.

## Frozen authority

No changes to:
- LEEWAY-FORMULA-v1.0 engine bytes
- Q69/QB64 semantics
- runtime-state-v1 adapter
- MC-G6 cognition calibration
- F1 Golden vector

## Training target

Train only the bridge from spatially informed belief to candidate policy valuation.

Candidate research-only augmentation:

G_spatial(a) = G_base(a) + lambda * C_spatial(a | b_t)

where:
- G_base is the existing expected-free-energy candidate policy value;
- lambda >= 0 is a research parameter;
- C_spatial is a bounded spatial consequence term derived from the spatially informed belief and the candidate action;
- lower G remains preferred under the existing softmax policy rule.

This equation is experimental policy-training math, not a modification of the Golden Formula.

## Train / holdout discipline

Worlds are split before parameter selection:
- TRAIN: worlds 0..95
- HOLDOUT: worlds 96..191

Candidate lambda values are predeclared:
0, 0.05, 0.10, 0.20, 0.35, 0.50, 0.75, 1.00, 1.50, 2.00.

Select lambda on TRAIN only by highest preferred-state rate, tie-broken by lower Brier score, then lower lambda.

Run the selected lambda exactly once on HOLDOUT.

## Hard acceptance

Promotion candidate only if HOLDOUT satisfies all:
1. preferred-state rate improves by >= 1.0 percentage point versus spatial-ON lambda=0;
2. Brier score does not regress by > 5% relative;
3. no Formula integrity regression;
4. no invalid/non-finite cognition dimensions;
5. no false-real memory promotion;
6. matched stochastic schedule is preserved;
7. Formula outputs for representative 16x6 windows are executed and receipts preserved.

If policy outcome does not improve, classification is NO_POLICY_GAIN and the spatial channel remains prediction/diagnostic evidence only.

## Evidence locations

Raw experiment artifacts: qualified non-system <LEEWAY_ROOT> workspace on E:.
Governed source/docs/receipts: GitHub Leeway-formula-live research branch.
Public site projection: only after Veritas promotion.
