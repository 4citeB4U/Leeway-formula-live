# LeeWay Automation Runtime Formula Mapping — Candidate v0

This mapping captures the automation knowledge promoted during Phase 4 without changing canonical Formula mathematics.

## Deterministic automation model

```text
typed event
→ deterministic ECA guard
→ authority gate
→ canonical Formula decision
→ durable scheduler/queue
→ workflow/handler
→ verification
→ Veritas
→ receipt
```

The runtime may use min-heap due ordering, monotonic in-process timing, durable UTC schedule state, typed event sources, guarded predicates and deterministic workflows. Those are runtime mechanisms, not a replacement Formula.

## Candidate dimensions

1. trigger_integrity
2. guard_determinism
3. authority_integrity
4. schedule_queue_stability
5. execution_verification
6. recovery_provider_health

Numeric ranges remain uncalibrated.

## Rejected shortcuts

- locally invented F8 equations or thresholds;
- universal timing constants;
- simulated hardware success labeled physical success;
- automatic HIGH/CRITICAL remediation without dedicated authority and verification;
- provider/API success promoted to Veritas without required post-state evidence.
