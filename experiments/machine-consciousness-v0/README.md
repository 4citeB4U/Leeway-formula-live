# Machine Consciousness v0 — deterministic cognition simulator

Status: EXPERIMENTAL / NON-LLM / FORMULA NOT EXECUTED

This experiment implements MC-1 from the approved machine-consciousness plan:
- two hidden states;
- noisy sensor;
- two bounded actions;
- deterministic seeded stochastic transitions;
- Bayesian belief update;
- prediction and precision-weighted error;
- candidate free-energy-rate valence;
- information gain;
- bounded policy selection;
- action/result separation;
- immutable cycle hashes;
- SIMULATED provenance.

The six emitted metrics match the candidate machine-consciousness awareness adapter: H, PE, V, IG, selected-policy G, and global-access ratio B.

## Compute funnel

Independent simulated worlds are parallel-safe. campaign.mjs benchmarks 1/2/4 worker lanes on the actual host and chooses the fastest measured lane. It then runs 128-world batches and stops after robust 0.5%/99.5% candidate ranges remain within a 2% normalized delta for three consecutive batches after the fourth batch.

This is compute governance, not a Formula result. The campaign does not call LEEWAY-FORMULA-v1.0.

## Run

node --test tests/simulator.test.mjs
node campaign.mjs

Outputs:
- outputs/compute-benchmark.json
- outputs/campaign-summary.json
- outputs/calibration-candidate.json
- outputs/sample-cycles.jsonl

## Claim boundary

Candidate ranges are measured simulator evidence only. They remain unapproved until Veritas, ablation, malformed-input/provenance-negative tests and explicit domain-adapter calibration acceptance. Formula execution remains NOT_EXECUTED.