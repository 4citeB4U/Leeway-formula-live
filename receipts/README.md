# Receipt & Evidence Index

Receipts are the subterranean evidence layer.

## Repository receipt

- `LEEWAY-FORMULA-LIVE-CENTRALIZATION-GATE-1-20260922.json`

## Runtime Formula receipts referenced by published experiments

The experiment JSONs preserve runtime receipt paths returned by the live Formula service. Examples include:

- model Formula evaluations,
- CPU/GPU closed-loop evaluations,
- GPU mode evaluations,
- Fold6 storage pre/post Formula evaluations,
- Fold6 media Formula evaluations.

## Important distinction

A JSON experiment record that **references** a runtime receipt is not itself the raw runtime receipt.

Where raw runtime receipt bytes have not yet been synchronized into this repository, status is:

[
\boxed{RECEIPT\ REFERENCED\;\ne\;RAW\ RECEIPT\ COPIED}
]

This repository will not fabricate missing raw receipt files.

## Evidence hierarchy

1. **Authority** — identity/version/hash/Golden contract.
2. **Experiment record** — workload, measurements, comparison.
3. **Runtime receipt** — Formula execution evidence.
4. **Veritas result** — whether the acceptance gate passed.
5. **Failure record** — negative evidence and blocker.
6. **Learning record** — only after verification.

## Where to look

- `/authority` — canonical/live identity records
- `/experiments` — measured experiment JSONs
- `/receipts` — synchronized receipt artifacts/index
- `/docs/EVIDENCE-STATUS.md` — current proof status
- `/docs/FAILURES-AND-REPAIRS.md` — rejected paths and repairs

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
