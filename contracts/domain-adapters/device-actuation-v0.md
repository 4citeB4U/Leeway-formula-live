# LeeWay Device Actuation Domain Adapter — Candidate v0

**Status:** CANDIDATE / NOT CALIBRATED / FORMULA EVALUATION NOT EXECUTED  
**Formula authority:** `4citeB4U/Leeway-formula-live`  
**Execution authority:** `4citeB4U/LEEWAY-DEVICE-BRIDGE`

## Purpose

Map closed-loop physical-device evidence into the canonical `runtime-state-v1` Formula input without embedding a second Formula engine inside Device Bridge.

This adapter is intentionally non-numeric until calibration campaigns establish authorized ranges.

## Six ordered dimensions

1. **transport_integrity** — packet/frame integrity, delivery/ACK evidence, protocol error state.
2. **authorization_integrity** — owner authority, platform permission, provider authorization, replay protection.
3. **readback_convergence** — observed physical/logical post-state agreement with requested target.
4. **latency_margin** — measured completion time relative to a protocol/device-specific calibrated timeout budget.
5. **failsafe_readiness** — availability and verification state of the device-specific safe recovery action.
6. **provider_health** — health/availability of the selected provider, controller, bridge, or physical transport.

## Calibration law

No universal timeout values are authorized here.

Each device/protocol mapping MUST supply:
- units;
- observation cadence;
- measured baseline distribution;
- calibrated safe operating range;
- timeout derivation;
- failure semantics;
- read-back source;
- fail-safe source;
- provenance and qualification evidence.

A value such as 50 ms, 150 ms, 250 ms, 500 ms, or 1200 ms is a **candidate test parameter** until measured on the actual device/provider path.

## Formula mapping state

```text
mappingId: leeway-device-actuation-v0
adapterId: runtime-state-v1
dimensions: 6
historyRowsRequired: 16
calibrationStatus: NOT_CALIBRATED
authorizationStatus: CANDIDATE
FORMULA EVALUATION: NOT EXECUTED
```

## Acceptance path

```text
intent
→ authority gate
→ Formula staging
→ Device Bridge provider
→ command dispatch
→ fresh read-back
→ expected/observed comparison
→ fail-safe on non-convergence
→ Veritas
→ receipt
```

## Hard rules

- API success is not physical proof.
- ACK is not sufficient when the device exposes authoritative post-state.
- No universal timeout is inferred across protocols.
- Fail-safe behavior must be device-specific and independently qualified.
- Safety-critical vehicle, drone, powertrain, lock, valve, breaker, or high-energy actuation remains BLOCKED until a dedicated safety envelope and physical qualification exist.
- Historical fixtures and simulated loopback tests do not prove live hardware behavior.

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
