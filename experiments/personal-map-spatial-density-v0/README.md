# Personal Maps Spatial Density Formula Gate

This experiment consumes real browser traces produced by LeeWay Maps with `?spatialMeasure=1`.

## Gate order

1. Capture at least three **headful, real-GPU** traces with `scripts/qa-spatial-formula-capture.mjs`.
2. Run `calibrate.mjs` on those traces. It creates a candidate range profile only.
3. Replay/ablate the same traces against the deterministic baseline.
4. Creator reviews and explicitly promotes the candidate to `PERSONAL_MAP_SPATIAL_DENSITY_ACCEPTED_CALIBRATION`.
5. Only then may `first-execution.mjs` call the canonical Formula endpoint.
6. Formula output remains EXECUTED/UNVERIFIED until the selected policy is shown to improve measured performance without reducing truth fidelity.

Historical fixtures and software-GL traces are not accepted as calibration evidence.

<!-- LEEWAY UNIVERSAL FORMULA GOVERNANCE BEGIN -->

# LeeWay Universal Formula Governance

Authority: Creator and LeeWay Standards.
Formula identity: LEEWAY-FORMULA-v1.0.

The canonical LeeWay Formula is mandatory throughout
the entire LeeWay ecosystem.

Every current and future application, capability,
agent, worker, employee, model, provider, adapter,
automation and integration inherits this requirement.

All applicable interactions, responses, decisions,
actions, revisions, executions, computations, model
inferences, resource allocations, information transfers,
memory operations, storage operations and deployments
must consume the canonical Formula through their
authorized and qualified domain contracts.

Formula availability, documentation, configuration,
health and historical results do not constitute actual
Formula consumption for a new operation.

Recover relevant authorized memory before substantive
work. Preserve identity, provenance, Formula integrity,
authorization, original receipts and verified learning.

Never invent observations, adapter mappings, mathematical
results, execution evidence or independent verification.

No application may bypass applicable Formula governance
by dispatching directly to a provider.

Every new application and capability must demonstrate
applicable Formula consumption before production admission.

Preserve the existing authority hierarchy:

Creator > Standards > Root of Trust > Runtime Fabric >
Agent Lee > Harness > Formula > skills/models/tools >
execution > Veritas > Receipt Authority > Learning Ledger.

Execute the complete engineering loop:

INVESTIGATE > DIAGNOSE > PLAN > IMPLEMENT > TEST >
VALIDATE > REPAIR > RETEST > VERIFY > EVIDENCE >
CHECKPOINT > CONTINUE.

Documentation compliance does not establish executable
enforcement or production admission.

<!-- LEEWAY UNIVERSAL FORMULA GOVERNANCE END -->
