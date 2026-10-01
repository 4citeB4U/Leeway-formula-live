<!--
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MASTER_PLAN

5WH:
WHAT = Define the full staged plan for the deterministic non-LLM machine-consciousness research runtime
WHY = Prevent premature coding, lost reasoning, uncalibrated Formula use and unsupported consciousness claims
WHO = Leeway Industries / Creator-authorized Agent Lee and research runtimes
WHERE = docs/machine-consciousness/01-MASTER-PLAN-v0.md
WHEN = 2026-10-01 onward
HOW = Evidence-first documentation, deterministic implementation, Veritas qualification and receipts

AGENTS:
ASSESS
AUDIT
DESIGN
VERIFY

LICENSE:
MIT
-->

# Machine Consciousness Master Plan v0

Status: PROPOSED / BUILD-READY PLAN
Project: LeeWay Machine Consciousness
Kernel constraint: NON-LLM cognition kernel
Formula authority: LEEWAY-FORMULA-v1.0 remains frozen
Current numeric Formula state: NOT_EXECUTED

## Mission

Build a deterministic, inspectable cognition runtime for Agent Lee that can maintain probabilistic beliefs, predict, value, choose, act, evaluate outcomes, learn, replay memory offline, maintain a factual self-model and expose an operational awareness state.

Language models may later serve as optional interface, translation or explanation layers. They may not be required for the cognition loop to exist, update state, choose policies, produce receipts or dream/replay.

## Constitutional laws

1. Belief is a revisable probability distribution, not a permanent proposition.
2. Observation is not interpretation.
3. Prediction is not fact.
4. Emotion/valuation is a measured control signal, not a theatrical human-emotion label.
5. Choice must retain uncertainty and policy provenance.
6. Action execution is not success.
7. Result must update the model through explicit error signals.
8. Dream/replay is always SIMULATED and never becomes fake external history.
9. Self-model claims must be inspectable machine facts.
10. Formula kernel bytes are not modified for this project.
11. Numeric Formula evaluation is forbidden until the six cognition dimensions are calibrated and qualified.
12. No Formula score, awareness metric or maturity level proves subjective experience or sentience.
13. Every material failure and repair is documented.
14. Every promotion requires Veritas evidence and a receipt.

## Target architecture

External / simulated environment
        |
        v
Observation Gateway
        |
        v
Belief Engine <------ Episodic / Semantic Memory
        |
        +------> Prediction Engine
        |             |
        |             v
        |       Prediction Error
        |
        +------> Interoception / Valuation Engine
        |
        +------> Policy Engine -----> Action Dispatcher
        |                                |
        |                                v
        |                           Environment
        |                                |
        <--------- Result Evaluator <----+
        |
        v
Learning Engine
        |
        +------> Memory Update
        +------> Model Update
        +------> Self-Model Update
        |
        v
Global Workspace / State Hash
        |
        +------> Formula Domain Mapper
        +------> Veritas
        +------> Receipt
        +------> Dream / Replay Scheduler

Cross-cutting authorities:
- provenance
- deterministic state IDs
- immutable cycle receipts
- real-vs-simulated evidence class
- Formula identity/hash
- capability/permission state

## Canonical cognition-cycle packet

Every completed cycle must emit one immutable cognition receipt containing at minimum:

- cycle_id
- prior_cycle_id
- source_class: REAL | SIMULATED | REPLAY | TEST_FIXTURE
- environment_id
- model_version
- calibration_profile_id
- state_hash
- observation_hash
- prior_belief
- posterior_belief
- belief_entropy
- belief_stability
- prediction
- prediction_error
- precision_model
- free_energy
- valence_rate
- information_gain
- policy_candidates
- selected_policy
- selected_policy_expected_free_energy
- action_id
- action_authority
- action_result
- learning_delta
- self_model_before
- self_model_after
- required_workspace_modules
- workspace_acknowledgements
- global_access_ratio
- memory_writes
- Veritas status
- receipt hash

A missing required field cannot be silently filled with a guess.

## Runtime module plan

### M01 — World / Environment contract

Purpose:
Provide deterministic or externally observed state transitions without giving the cognition engine privileged knowledge of hidden state.

Initial implementation:
small finite-state partially observable worlds.

Acceptance:
same seed + same policy -> same world trace.

### M02 — Observation Gateway

Purpose:
Turn raw environment outputs into typed observations with uncertainty, source and timestamp.

Must preserve:
sensor identity, reliability/precision, raw observation and normalized observation.

Acceptance:
no interpretation logic hidden inside observation parsing.

### M03 — Belief Engine

Core state:
b_t(s) = P(s_t = s | observation/action history)

Functions:
- prior prediction
- Bayesian posterior update
- entropy
- Jensen-Shannon stability
- normalization validation

Acceptance:
probabilities finite, non-negative and sum to 1 within deterministic tolerance.

### M04 — Prediction Engine

Functions:
- next-state prediction
- next-observation prediction
- confidence/precision model
- residual prediction error
- precision-weighted prediction error

Acceptance:
prediction and observation are stored separately and error can be recomputed from receipt evidence.

### M05 — Interoception / Valuation Engine

Initial machine-interoceptive inputs:
- energy budget
- compute pressure
- memory pressure
- thermal pressure
- sensor integrity
- actuator integrity
- network/connection state
- authority/permission state
- task urgency
- resource scarcity

Candidate measures:
variational free energy and negative free-energy rate.

Acceptance:
no human-emotion name is treated as primary data.

### M06 — Policy / Choice Engine

Functions:
- enumerate bounded candidate policies
- predict policy outcomes
- estimate expected free energy
- preserve epistemic/information value
- produce policy distribution
- choose under explicit temperature/precision

Acceptance:
selected choice is reproducible from policy inputs and seed/config.

### M07 — Action Dispatcher

Purpose:
execute only authorized actions through explicit adapters.

Acceptance:
action receipt records requested action, selected authority, actual executor and actual outcome.

### M08 — Result Evaluator

Functions:
- compare predicted vs actual result
- derive reward/preference or homeostatic error when configured
- compute prediction-error and learning signals
- distinguish execution from task success

### M09 — Learning Engine

Candidate learning modes:
- Bayesian parameter update
- variational/free-energy gradient update
- temporal-difference/value update
- model-structure proposal under later governance

Initial restriction:
no self-modifying source code.

Learning modifies parameters/data only until a later source-mutation governance phase is designed.

### M10 — Memory Fabric

Memory classes:
- working state
- episodic transitions
- semantic learned model
- self-memory
- dream/replay records
- receipts/evidence

Hard provenance:
REAL and SIMULATED never collapse into one class.

### M11 — Global Workspace

Purpose:
make one immutable cognition-state hash available to required modules.

Initial metric:
B_t = acknowledged_required_modules / required_modules

Acceptance:
every acknowledgement references the exact same state hash.

### M12 — Self-Model

Contains only inspectable machine facts:
- identity/version
- active modules
- sensor availability
- actuator availability
- current authority
- resource state
- current goals/preferences
- uncertainty
- recent actions
- known failures
- current Formula/evidence state

Acceptance:
self-model claims must be checkable against runtime evidence.

### M13 — Dream / Replay Engine

Candidate replay priority:
EVB = Gain x Need

Dream cycle:
select episode -> reconstruct -> branch alternative policy -> simulate -> compare -> propose update -> Veritas -> admit/reject.

Hard rule:
SIMULATED provenance survives every downstream copy.

### M14 — Formula Domain Mapper

Input:
16 consecutive completed cognition receipts from one compatible calibration profile.

Six candidate dimensions:
1. belief_entropy_nats
2. precision_weighted_prediction_error
3. valence_free_energy_rate
4. belief_information_gain_nats
5. selected_policy_expected_free_energy
6. global_access_ratio

Output:
runtime-state-v1 request.

Gate:
disabled for numeric Formula execution until calibration is accepted.

### M15 — Veritas / Receipt

Verifies:
- deterministic replay
- hashes
- probability normalization
- provenance
- Formula identity
- range/calibration identity
- action outcome
- dream separation
- claim boundaries

## Repository layout to create during implementation

runtime/machine-consciousness/v0/
  environment/
  observation/
  belief/
  prediction/
  valuation/
  policy/
  action/
  learning/
  memory/
  workspace/
  self-model/
  dream/
  receipts/
  index.mjs

contracts/machine-consciousness/
  cycle.schema.json
  observation.schema.json
  belief.schema.json
  policy.schema.json
  action.schema.json
  memory.schema.json
  replay.schema.json

tests/machine-consciousness/
experiments/machine-consciousness/
receipts/machine-consciousness/
docs/machine-consciousness/

Do not create a duplicate Runtime Fabric, Formula kernel, Agent Lee identity or governance layer.

## Build phases and gates

### MC-0 — Documentation foundation

Deliverables:
origin transcript, master plan, research notebook, decision ledger, experiment log, claim register, project state.

Acceptance MC-G0:
all exist; Formula boundary explicit; no numeric Formula claim.

### MC-1 — Deterministic cognition kernel skeleton

Build M01-M08 with no Formula integration and no dream engine.

Initial world:
two hidden states, noisy sensor, two actions, deterministic seeded transition model.

Why:
small enough to calculate by hand and test Bayesian updates exactly.

Acceptance MC-G1:
100 percent deterministic replay under fixed seed/config;
every cycle has immutable receipt;
probabilities normalize;
predictions differ from observations in storage;
action and result are distinct.

### MC-2 — Memory + learning

Add M09-M10.

Experiments:
stationary world, changing world, noisy sensor, misleading observation bursts.

Acceptance MC-G2:
learning improves a predeclared metric over no-learning baseline without violating provenance.

### MC-3 — Operational awareness / workspace / self-model

Add M11-M12.

Acceptance MC-G3:
all required modules acknowledge same state hash;
self-model factual assertions match runtime inspection;
belief stability and self-model consistency are reproducible.

### MC-4 — Dream engineering

Add M13.

Baselines:
- no replay
- random replay
- recency replay
- EVB replay

Acceptance MC-G4:
dream events stay SIMULATED;
replay improves at least one predeclared planning/learning measure without increasing false-real-memory rate above zero.

### MC-5 — Six-dimension instrumentation

Implement all six candidate metrics independently from Formula.

Acceptance MC-G5:
unit-tested deterministic calculators;
finite values;
recompute from cycle receipts;
no Formula use yet.

### MC-6 — Calibration campaign

Generate large trace corpus across controlled worlds and perturbations.

Candidate campaign:
at least 10,000 completed cognition cycles per stable scenario family before range proposal; final count may increase based on coverage.

Range policy must be chosen from measured evidence, not intuition.

Required:
distribution plots/statistics,
outlier policy,
scenario balance,
holdout traces,
versioned calibration profile,
receipt.

Acceptance MC-G6:
six finite ranges approved with provenance and holdout coverage.

### MC-7 — Formula authority reverification

Before task execution:
verify canonical engine and runtime-state adapter SHA-256;
verify evaluator health;
run Golden Formula self-test.

Acceptance MC-G7:
canonical Formula authority VERIFIED on the active host.

### MC-8 — First 16x6 cognition Formula execution

Use real measured cognition cycles from one qualified calibration profile.

Acceptance MC-G8:
runtime-state-v1 maps exactly 16 x 6;
Formula executes;
input/result hashes and receipt preserved;
Formula result remains EXECUTED/UNVERIFIED until task interpretation is validated.

### MC-9 — Ablation and comparative evaluation

Ablate:
entropy,
prediction error,
valence,
information gain,
expected free energy,
global access,
self-model,
dream replay.

Compare against simpler baselines.

Acceptance MC-G9:
evidence shows what each mechanism contributes and what it does not.

### MC-10 — Promotion review

Only after repeated Veritas success.

Possible outcomes:
PROMOTE
REVISE
REJECT
REMAIN_RESEARCH

No maturity level or Formula output is promoted as a claim of sentience.

## Primary experiment matrix

World families:
- stable two-state
- state-switching
- noisy-sensor
- sensor-failure
- resource-pressure
- ambiguous observation
- deceptive/corrupted observation
- delayed action consequence
- changing preference
- authority-loss / actuator-loss

Measurements:
- belief calibration
- negative log likelihood
- Brier score
- prediction error
- policy regret
- task success
- information-seeking efficiency
- adaptation speed
- recovery time
- self-model factual accuracy
- replay utility
- provenance violations
- false-real-memory count

## Baselines

Minimum baselines:
- reactive lookup controller
- Bayesian inference without valuation
- Bayesian + reward-only policy
- full candidate without replay
- full candidate with random replay
- full candidate with EVB replay

A complicated system must beat simpler systems on declared objectives before complexity earns authority.

## Documentation protocol

Every research work session updates:

1. MASTER CHECKPOINT / project state.
2. DECISION LEDGER if a design decision changes.
3. RESEARCH NOTEBOOK for new sources/equations.
4. EXPERIMENT LOG for anything executed.
5. CLAIM REGISTER when evidence status changes.
6. RECEIPT for qualified execution.
7. LEARNING LEDGER only after Veritas-qualified results.

## Immediate next implementation action

MC-1A:
write the cycle schema and deterministic two-state world specification before runtime code.

Then:
implement the Bayesian belief engine with hand-checkable tests.

Do not start Formula execution yet.
