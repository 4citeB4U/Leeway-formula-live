<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.ADAPTIVE_SPATIAL_TRUST
5WH:
WHAT = Train adaptive spatial trust for Formula-native Machine Consciousness
WHY = Fixed lambda=2 improved held-out policy outcomes, but live consciousness must scale trust with evidence reliability and uncertainty
WHO = Leeway Industries / Creator-authorized Machine Consciousness research runtime
WHERE = docs/machine-consciousness/15-MC-G9-ADAPTIVE-SPATIAL-TRUST-v0.md
WHEN = 2026-10-04
HOW = Train bounded lambda_t policy on reliability/uncertainty/risk/error contexts, freeze on holdout, execute representative cognition through canonical Formula
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
-->

# MC-G9 Adaptive Spatial Trust v0

Status: ACTIVE RESEARCH / PREDECLARED

## Objective

Replace the fixed experimental lambda=2 policy bridge with an adaptive trust function:

lambda_t = f(r_s, U_t, R_t, E_t, Q_t)

where:
- r_s = spatial evidence reliability;
- U_t = posterior uncertainty;
- R_t = current risk;
- E_t = recent prediction error;
- Q_t = evidence qualification state.

Q_t is a hard gate:
- VERIFIED/qualified evidence may receive lambda_t > 0;
- unverified, incomplete or provenance-invalid evidence forces lambda_t = 0.

## Candidate family

Research-only bounded form:

lambda_t = Q_t * lambda_max * r_s^p * (1 + a*U_t + b*R_t + c*E_t) / Z

then clamp to [0, lambda_max].

Parameters are selected on training worlds only. Holdout worlds are never used for selection.

## Acceptance

Compared with fixed lambda=2 on unseen holdout contexts:
1. aggregate preferred-state rate must not regress;
2. low-reliability contexts must improve or reduce harmful over-trust;
3. qualified high-reliability contexts must retain the fixed-lambda policy gain within 1 percentage point;
4. Brier error may not regress >5%;
5. unqualified evidence must produce lambda_t=0;
6. Golden Formula and MC regression remain PASS;
7. representative adaptive cognition window must execute through canonical Formula.

No live-PC deployment until this gate passes.
