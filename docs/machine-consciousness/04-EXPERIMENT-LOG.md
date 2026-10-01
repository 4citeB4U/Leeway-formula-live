<!--
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.EXPERIMENT_LOG

5WH:
WHAT = Record every machine-consciousness experiment, test campaign and validation result
WHY = Make PASS and FAIL equally reusable evidence and prevent undocumented experimentation
WHO = Leeway Industries / Creator-authorized Agent Lee and research runtimes
WHERE = docs/machine-consciousness/04-EXPERIMENT-LOG.md
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

# Experiment Log

## E-000 — Candidate architecture staging
Date: 2026-10-01
State: PASS_FOR_CANDIDATE_ARTIFACTS

Executed:
- recovered canonical Formula identity and pins;
- staged machine-consciousness-awareness-v0 domain adapter;
- created mathematical architecture document;
- re-fetched exact candidate files on qualified Android workstation;
- parsed candidate JSON;
- hashed candidate artifacts.

Result:
candidate architecture exists; Formula not executed.

Receipt:
receipts/MACHINE-CONSCIOUSNESS-AWARENESS-CANDIDATE-v0-20261001.json

## E-001 — Documentation integrity repair
Date: 2026-10-01
State: PASS_AFTER_REPAIR

Observation:
the first human-readable math Markdown used backslash sequences that were interpreted as control characters by the generation path.

Diagnosis:
presentation-layer escaping bug; JSON candidate contract remained valid.

Repair:
rewrite mathematical document with renderer-safe plain equations and validate for control characters after commit.

First validation result:
FAIL — validator required explicit MC-G10 acceptance language and found only the MC-10 phase heading.

Failure boundary:
documentation completeness only; no cognition runtime or Formula execution occurred.

Repair action:
add explicit Acceptance MC-G10 criteria and rerun the entire documentation validation.

Acceptance:
no unexpected C0 control characters; core equation tokens readable; all planned gate identifiers MC-G0 through MC-G10 represented where applicable.

Final validation:
PASS on exact commit fd73ebca95e45291bf4a382d54cfc5d9ec3fb333.

Verified on qualified Android workstation:
- project-state JSON parsed;
- Formula execution remained NOT_EXECUTED;
- origin transcript required anchors present;
- master plan contains MC-G0 through MC-G10;
- repaired math document contains required equation anchors and no unexpected control characters;
- canonical Formula engine SHA-256 matched 6502791bba909d7481db3a204f3cbf67b1dc06a4b76a73c797d709408341d63e.

Result:
MC-G0 PASS.

## Planned E-010 — Two-state hand-checkable cognition world

Goal:
prove cycle semantics before adding learning or Formula.

World:
two hidden states;
two observations with configurable sensor error;
two actions;
seeded transitions.

Tests:
Bayesian posterior by hand;
entropy;
prediction;
prediction error;
cycle receipt determinism.

Formula:
NOT USED.

## Planned E-020 — Learning baseline campaign

Compare:
no learning;
Bayesian parameter learning;
optional TD/value learning.

Primary question:
does the learning engine improve declared prediction/task metrics without corrupting provenance?

## Planned E-030 — Workspace/self-model campaign

Question:
can all required modules acknowledge one immutable state hash and can the self-model stay factually aligned with runtime inspection?

## Planned E-040 — Replay campaign

Compare:
no replay;
random replay;
recency replay;
EVB replay.

Hard negative:
false-real-memory count must remain zero.

## Planned E-050 — Calibration campaign

Collect distributions for six Formula bridge dimensions across scenario families.

No Formula task execution until calibration acceptance.

## Executed E-010 — Two-state hand-checkable cognition world

Status:
PASS — MC-G1 deterministic simulator gate.

Implementation:
experiments/machine-consciousness-v0/

Evidence:
- fixed seed/config exact replay;
- posterior probabilities finite, non-negative and normalized;
- prediction stored separately from observation;
- requested action stored separately from result;
- six candidate metrics finite;
- every cycle permanently marked SIMULATED;
- every cycle carries a SHA-256 state hash.

Verification:
7/7 Node tests PASS on the qualified Android workstation.

Compute funnel:
Android exposed four schedulable CPUs to Termux, but empirical worker benchmarking showed this small kernel was fastest with one worker:
- 1 worker: 463.816 ms / 10,240 cycles;
- 2 workers: 523.453 ms;
- 4 workers: 616.106 ms.
Checksums matched across all worker counts.

Interpretation:
parallelism is available but worker overhead exceeds benefit for this workload. The compute controller therefore selects serial execution.

Calibration campaign:
- 5 scenario families;
- 768 simulated worlds;
- 24,576 cognition cycles;
- robust candidate ranges converged after 6 batches;
- maximum campaign ceiling was 131,072 cycles;
- convergence stopping avoided 106,496 cycles (81.25%).

Formula:
NOT_EXECUTED. Candidate metric ranges are measured simulator evidence only and are not yet an authorized domain calibration.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G1-SIMULATOR-20261001.json

## Preliminary E-050 — Calibration campaign

Status:
CANDIDATE RANGES MEASURED / NOT ACCEPTED.

The six awareness dimensions now have measured simulator distributions across stationary, changing, noisy, misleading and module-dropout worlds. These ranges remain candidate evidence pending ablation, malformed-input/provenance-negative testing, broader scenario coverage and explicit Veritas calibration acceptance.

No canonical Formula task result is claimed.

## Executed E-020 — Memory + learning baseline

Status:
PASS — MC-G2 within ORACLE_SUPERVISED_TEST_ONLY boundary.

Exact source commit validated:
d965713ae82e8962ceca25708225606138c1ed12

Validation host:
qualified Android workstation.

Tests:
15/15 PASS including MC-G1 regression tests.

Campaign:
- 4 scenario families;
- 1,024 simulated worlds;
- 65,536 cognition cycles;
- Formula NOT_EXECUTED.

Measured relative improvements:
- noisy sensor NLL: +13.9746%;
- misleading-window sensor NLL: +15.2116%;
- changing-world transition NLL: +1.5532%;
- stationary combined NLL: -3.4749% (regression within declared <=5% control ceiling).

Integrity:
- episodic memory hash chain intact;
- SIMULATED provenance preserved;
- source cognition receipts unchanged.

Critical boundary:
the current learner uses auditWorldState as ORACLE_SUPERVISED_TEST_ONLY feedback. This proves deterministic memory and adaptive parameter-learning mechanics. It does NOT prove autonomous learning from ordinary cognition evidence.

Next:
MC-3 global workspace + factual self-model.
