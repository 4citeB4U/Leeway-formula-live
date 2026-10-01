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


## Executed E-030 — Operational workspace + factual self-model

Status:
PASS — MC-G3.

Exact source commit validated:
570fb4736eca156d96bc8a887f2a0a8e69142027

Validation host:
qualified Android workstation.

Regression + MC-3 tests:
23/23 PASS.

MC-3 acceptance evidence:
- all required module acknowledgements reference the exact same workspace-state SHA-256;
- cross-state acknowledgement is rejected;
- module dropout lowers global-access ratio rather than being hidden;
- factual self-model fields match independently inspected runtime facts;
- a forged self claim of ROOT authority fails verification;
- self-model binds current workspace, semantic-model and episodic-memory hashes;
- source cognition receipts remain unchanged;
- Formula remains NOT_EXECUTED.

Campaign:
- 5 scenario families;
- 640 simulated worlds;
- 40,960 cognition cycles;
- workspace verification: 40,960 / 40,960;
- self-model verification: 40,960 / 40,960;
- complete workspace cycles: 38,784;
- intentional dropout cycles: 2,176;
- observed global-access range: 5/7 through 1;
- campaign digest: 9a0ab1ad51ec0fa641886fd8bf38490e2106dd488295f208a1ebb6e5cdacea68.

Formula:
NOT_EXECUTED.

Documentation debt observed:
the original master plan listed contracts/machine-consciousness/cycle.schema.json, but that canonical cycle schema is not currently present. Existing MC-G1/MC-G2 qualified receipt shapes remain evidence; the missing contract is recorded as debt rather than silently invented retroactively.

Next:
MC-4 dream/replay engine.


## E-031 — MC-G3 contract-alignment requalification

Date: 2026-10-01
State: PASS_AFTER_REOPEN_AND_REPAIR

Trigger:
post-qualification source/contract audit found that the first MC-G3 implementation passed its own tests while violating two higher-authority requirements:
- source module set had 7 modules instead of the contract's 8;
- acknowledgements referenced a derived workspace hash instead of the cognition cycleStateHash.

Disposition of earlier receipt:
SUPERSEDED for gate authority. Retained as historical execution evidence.

Repair:
- required modules aligned to perception, belief, prediction, valuation, policy, memory, self-model, veritas;
- cycleStateHash restored as cognition-state identity;
- workspaceHash retained as envelope integrity;
- duplicate, unknown, wrong-state and post-seal acknowledgements explicitly rejected;
- self-model reorganized into six required factual domains;
- self-model accuracy made explicit and independently recomputable;
- operational B replaces synthetic simulator B while source value remains preserved.

Qualification harness note:
first combined regression attempt failed because isolated test fixture world-spec-v0.json was omitted. This was a harness dependency failure. The missing fixture alone was restored and the same source was retested.

Final tests:
- MC-G1: 7/7 PASS;
- MC-G2: 8/8 PASS;
- repaired MC-G3: 12/12 PASS.

Campaign:
- 5 scenario families;
- 640 worlds;
- 40,960 cycles;
- workspace verified 40,960/40,960;
- self-model verified 40,960/40,960;
- self-model accuracy 1.0 on 40,960/40,960;
- complete cycles 38,784;
- dropout cycles 2,176;
- global access range 0.75 to 1.0;
- source mutation failures 0;
- digest 172c409e061b4442fc0cdb5e25a2e3d1b872b6a749a45c69bbc79cd66550ba02.

Formula:
NOT_EXECUTED.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G3-REQUALIFIED-20261001.json


## E-040A — First dream/replay campaign

Status:
FAIL — MC-G4 not accepted.

Source commit:
2a164f954d76feba9e5219dc79193a5f6e1574c2

Unit/regression tests:
37/37 PASS.

Campaign:
- 4 scenario families;
- 512 worlds;
- 64 cognition cycles/world;
- first 32 training, last 32 held out;
- replay budget 12;
- modes NONE, RANDOM, RECENCY, EVB.

Integrity results:
- false-real-memory count = 0;
- replay-ledger failures = 0;
- source-receipt mutation failures = 0;
- Formula NOT_EXECUTED.

Predictive result:
all replay strategies worsened held-out combined NLL relative to NONE. EVB had no scenario win and aggregate combined NLL regressed by 7.2880%.

Campaign digest:
1129e6805a5ef29bb7d69be8d0e14e5084ad1ea1e7737d62a75e327971950d54

Diagnosis:
the MC-G2 chronological learning updater applies forgettingFactor to all semantic counts on every update. Reusing it during offline replay incorrectly advances environmental forgetting for each dreamed episode even though no new external time elapsed.

Repair:
separate offline replay reinforcement from chronological learning. Replay may add weighted evidence for the selected historical episode but MUST NOT apply chronological forgetting to unrelated evidence.

Gate remains:
MC-G4 OPEN.
