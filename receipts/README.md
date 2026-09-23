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
