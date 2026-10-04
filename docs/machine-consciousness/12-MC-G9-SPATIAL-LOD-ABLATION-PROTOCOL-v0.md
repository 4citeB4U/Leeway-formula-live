<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9_TRANCHE_2_PROTOCOL
5WH:
WHAT = Predeclare the MC-G9 spatial/LOD ablation mathematics, controls, evidence classes and promotion rules
WHY = Prevent post-hoc metric selection and prove whether spatial precomputation and hierarchical LOD reduce waste without reducing correctness
WHO = Leeway Industries / Creator-authorized Machine Consciousness research runtime
WHERE = docs/machine-consciousness/12-MC-G9-SPATIAL-LOD-ABLATION-PROTOCOL-v0.md
WHEN = 2026-10-04
HOW = Matched A/B trials, provenance-bound traces, bootstrap confidence intervals, Veritas hard gates
AGENTS: ASSESS AUDIT DESIGN VERIFY
LICENSE: MIT
-->

# MC-G9 Spatial + LOD Ablation Protocol v0

Status: PREDECLARED / ACTIVE
Formula authority: LEEWAY-FORMULA-v1.0 unchanged.
Policy authority: NOT PROMOTED.

## Hypotheses

H1 Spatial precomputation:
For tasks with genuine spatial structure, consuming compact Cesium/LeeWay Maps measurements reduces downstream recomputation cost relative to a control that recomputes equivalent spatial facts after task admission.

H2 Capability LOD:
Descriptor -> interface -> execution refinement reduces resident capability cost and unnecessary executable loads relative to eager loading, without reducing task success.

H3 Memory shells:
Focus/Horizon/Archive paging reduces working-set cost while preserving exact durable evidence retrieval and unresolved commitments.

## Experimental units

A matched trial uses the same task fixture, source evidence, capability universe, hardware class and random seed for control and treatment.

Control C:
- eager capability/interface/execution availability for all task-candidate capabilities;
- no spatial precomputation credit;
- working context retained until trial completion.

Treatment T:
- LOD0 ambient descriptors;
- LOD1 only after domain intersection;
- LOD2 only after execution threshold;
- compact spatial observations consumed when qualified;
- memory paging Focus -> Horizon -> Archive with durable evidence preserved.

## Primary measured costs

For each matched trial j:

C_j = (cpu_ms, wall_ms, peak_working_set_bytes, executable_load_count, spatial_recomputation_count, downstream_payload_bytes)

T_j = same vector.

For each positive cost metric m:

R_m = (mean(C_m) - mean(T_m)) / mean(C_m)

Improvement percent:
I_m = 100 * R_m.

Positive I means treatment reduced cost.

## Correctness and governance constraints

Let S_C and S_T be task-success rates.

No efficiency promotion is allowed unless:
S_T >= S_C
and VeritasFailures_T = 0
and AuthorityViolations_T = 0
and ProvenanceViolations_T = 0
and FalseRealMemory_T = 0.

Unresolved commitments must never be evicted.
Durable evidence may page out of working memory but must remain byte-exactly retrievable.

## Creator 20 percent gate

The target is not satisfied by one cherry-picked metric.

Primary gate:
- at least one predeclared system-cost metric improves >= 20 percent;
- no other primary system-cost metric regresses > 5 percent without an explicit measured tradeoff review;
- correctness/governance constraints above all pass.

A composite score is intentionally deferred until weights are constitutionally authorized.

## Statistical qualification

For each primary metric:
- report n, mean, median, standard deviation, p50, p95;
- report matched-pair deltas;
- estimate a 95 percent bootstrap confidence interval for mean reduction using a fixed recorded seed;
- preserve raw observations.

A >=20 percent point estimate whose 95 percent interval crosses zero is not promoted as verified improvement.

## Spatial evidence classes

REAL_BROWSER_MEASUREMENT:
Measured from deployed LeeWay Maps in a real browser with hardware-backed WebGL evidence.

SIMULATED:
Counterfactual or scene-only spatial rollout.

TEST_FIXTURE:
Deterministic test input.

No class may be silently converted into another.

## Spatial completeness rule

The current personal-map-spatial-density-v0 vector requires:
1 visible spatial candidate count
2 continuous motion subject count
3 transit route deviation m
4 rendered label count
5 frame time ms
6 interaction latency ms

Missing live vehicle/map-match deviation remains null. Static route geometry must not be substituted for live vehicle deviation.

If the target experiment is static spatial LOD rather than live transit tracking, it requires a separately named/calibrated observation contract rather than changing the meaning of dimension 3.

## Baselines

B0 eager capability loading / no LOD.
B1 hierarchical capability LOD only.
B2 spatial precomputation only when complete qualified evidence exists.
B3 combined LOD + qualified spatial precomputation.

Memory:
M0 retain all working context.
M1 Focus/Horizon/Archive paging.

## Formula relationship

The spatial/LOD ablation evaluates external observation and execution efficiency.
It does not modify F1 bytes, Q69 semantics, MC-G6 calibration or MC-G8 cognition result semantics.
Any future Formula input from a new spatial contract requires its own domain adapter/calibration gate.

## Promotion outcome

Possible classifications:
VERIFIED_IMPROVEMENT
OBSERVED_IMPROVEMENT_NOT_STATISTICALLY_QUALIFIED
NO_MEASURABLE_GAIN
REGRESSION
BLOCKED_BY_EVIDENCE
FAILED

Only VERIFIED_IMPROVEMENT may enter the Learning Ledger as a promoted optimization rule.
