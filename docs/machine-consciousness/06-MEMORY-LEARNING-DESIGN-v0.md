<!--
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC2_DESIGN

5WH:
WHAT = Define MC-2 episodic memory and semantic-model learning baseline
WHY = Prove experience storage and model adaptation before integrating learning into policy, replay or Formula execution
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = docs/machine-consciousness/06-MEMORY-LEARNING-DESIGN-v0.md
WHEN = MC-2
HOW = Hash-chained episodic memory + test-only audited feedback + pre-update predictive log-loss comparison against fixed control

AGENTS:
ASSESS
AUDIT
DESIGN
VERIFY

LICENSE:
MIT
-->

# MC-2 Memory + Learning Design v0

Status: CANDIDATE IMPLEMENTATION

## Purpose

MC-2 adds M09 Learning Engine and M10 Memory Fabric without altering the verified MC-1 cognition simulator.

The MC-1 receipts remain the source experience. MC-2 consumes them.

## Memory split

### Episodic memory

Stores immutable references to individual cognition cycles.

Every entry contains:
- cycle state hash;
- provenance;
- scenario/world/cycle;
- observation/action/result summary;
- learning mode;
- feedback class;
- semantic-model hash before/after;
- previous memory-entry hash;
- current memory-entry hash.

This forms a deterministic hash chain.

### Semantic memory

Stores the learned environment-model parameters:
- estimated sensor reliability;
- transition probabilities for inspect;
- transition probabilities for commit;
- update count;
- prior strength;
- forgetting factor;
- model hash.

## Learning boundary

The first learner uses:

ORACLE_SUPERVISED_TEST_ONLY

It is allowed to read auditWorldState only because this phase is verifying the learning mechanism inside a simulator.

It is NOT evidence that a production cognition agent can access hidden state.

This feedback class must never be silently renamed REAL or autonomous.

## Learning rule

Initial semantic model equals the MC-1 agent model.

Sensor reliability uses decayed two-outcome counts:
- match observation to audited hidden state;
- mismatch observation to audited hidden state.

Transition rows use decayed two-outcome counts:
- before hidden state;
- requested action;
- after hidden state.

Prior strength = 20.
Forgetting factor = 0.96.

The model is scored BEFORE each update.

That prevents the learner from receiving credit for an observation it has already trained on.

## Predeclared metrics

Negative log likelihood:

sensor_nll = -ln P(observed sensor correctness | model_before)

transition_nll = -ln P(actual next state | audited state, action, model_before)

combined_nll = sensor_nll + transition_nll

Lower is better.

## Scenario windows

stationary:
cycles 20-63

changing:
cycles 20-63, after drift begins at cycle 16

noisy:
cycles 12-63

misleading:
cycles 10-15, exactly the corruption window

## MC-G2 acceptance

Required:

1. noisy sensor NLL improves by at least 5 percent vs fixed no-learning control;
2. misleading-window sensor NLL improves by at least 5 percent;
3. changing-world transition NLL improves vs fixed control;
4. stationary combined-NLL regression is no worse than 5 percent;
5. episodic memory hash chains verify;
6. provenance violations = 0;
7. source MC-1 cognition receipts remain unchanged;
8. Formula execution remains NOT_EXECUTED.

## Expected limitation

A continuously adaptive model can overfit a stationary world whose initial parameters are already correct.

Stationary regression is therefore measured explicitly.

If the regression approaches or exceeds the 5-percent boundary, the next repair is evidence-gated learning/change detection—not hiding the regression.

## Formula boundary

MC-2 does not call runtime-state-v1 or LEEWAY-FORMULA-v1.0.

Learning evidence may inform later calibration and cognition design, but it does not authorize Formula execution.
