# MC-3 — Operational Workspace and Self-Model Design v0

Status: DESIGN CANDIDATE
Formula: NOT EXECUTED

## Purpose

MC-3 adds M11 Global Workspace and M12 Self-Model.

The goal is not to declare subjective consciousness. The goal is to make one cognition state globally inspectable across required modules and make the machine's statements about itself testable against runtime evidence.

## Part A — Global workspace

Every completed cognition cycle already has stateHash.

MC-3 introduces a workspace envelope:

- workspaceId
- cycleStateHash
- requiredModules
- acknowledgements
- missingModules
- broadcastSequence
- createdAtLogicalCycle
- workspaceHash

Initial required modules:

- perception
- belief
- prediction
- valuation
- policy
- memory
- self-model
- veritas

Every acknowledgement must contain the exact same cycleStateHash.

A module acknowledging another hash does not count.

Global access:

B_t = valid acknowledgements / required modules

This replaces the simulator's synthetic acknowledgement ratio with inspectable module evidence.

## Part B — Factual self-model

The self-model is not personality text.

It is a structured runtime claim set:

identity:
- agent/system identity
- runtime version
- project phase

capabilities:
- active modules
- available sensors
- available actions
- current learning mode

authority:
- allowed action classes
- denied action classes
- Formula execution state

resources:
- memory episode count
- semantic model hash
- workspace status

epistemic:
- current belief distribution
- uncertainty
- last prediction error
- known blockers

history:
- last cycle hash
- last requested action
- last result
- last learning update class

Every self-model field is either:
VERIFIED_FROM_RUNTIME
DERIVED
UNKNOWN

No field may claim VERIFIED_FROM_RUNTIME without a matching runtime probe/evidence function.

## Self-model consistency

For categorical facts:
exact equality.

For numeric state:
declared tolerance.

For probabilistic self-beliefs later:
Jensen-Shannon consistency may be introduced, but MC-3 does not need to force every factual field into a probability distribution.

Self-model accuracy:

C_self = verified_correct_claims / verifiable_claims

Unknown claims are not counted as correct.

## Workspace negative tests

- wrong state hash acknowledgement -> rejected
- duplicate module acknowledgement -> does not increase B
- unknown module -> rejected
- missing required module -> B < 1
- acknowledgement after workspace sealed -> rejected

## Self-model negative tests

- claim Formula EXECUTED while project state says NOT_EXECUTED -> FAIL
- claim unavailable capability -> FAIL
- claim wrong semantic model hash -> FAIL
- claim wrong last action/result -> FAIL
- UNKNOWN represented as VERIFIED -> FAIL

## MC-G3 acceptance

- deterministic workspace construction;
- all required modules can acknowledge one immutable state hash;
- B is recomputable from acknowledgements;
- negative acknowledgement tests pass;
- self-model is generated from runtime evidence, not prose inference;
- self-model factual accuracy = 1.0 in qualified runs;
- deliberately corrupted self-model is detected;
- Formula remains NOT_EXECUTED;
- MC-G1 and MC-G2 tests continue to pass.

Passing MC-G3 establishes operational global access and factual self-model integrity only.
