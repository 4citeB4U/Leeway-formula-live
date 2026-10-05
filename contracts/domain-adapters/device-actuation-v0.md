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
