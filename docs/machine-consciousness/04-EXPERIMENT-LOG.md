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


## E-040B — Replay temporal repair campaign

Status:
DATA SATISFIES MASTER GATE / VALIDATOR FALSE-FAIL.

Source commit:
6714dd523251b2a8f4c4668f2f209949fb19581f

Repair under test:
offline replay reinforcement no longer advances chronological forgetting.

Tests:
38/38 PASS.

Campaign:
same 512 worlds and same train/holdout/replay budgets as E-040A.

Integrity:
- false-real-memory count = 0;
- replay-ledger failures = 0;
- source-receipt mutation failures = 0;
- Formula NOT_EXECUTED.

Measured EVB result:
- noisy-world held-out sensor NLL improved by 0.6059004382% versus NONE;
- EVB combined NLL did not improve in any scenario;
- aggregate non-stationary EVB combined NLL regressed by 5.5397895371%.

Validator defect:
the campaign implementation checked only EVB combined-NLL scenario wins, while the approved MC-G4/master-plan gate requires improvement in at least one predeclared planning/learning measure. Sensor NLL is a predeclared negative-log-likelihood measure.

Repair:
change acceptance implementation only. Preserve all measured results and explicitly retain the combined-NLL regression as a limitation.

Campaign digest:
b94338d259554e73cc817735e33a8b36441ddfef330eeb1b9d880a8bd44a84b7.


## E-040C — Final corrected dream/replay campaign

Status:
PASS — MC-G4, BOUNDED.

Exact campaign source commit:
0a804cb2a69d989ed7c0b0049d82395d514a8f5d

Validation host:
qualified Android workstation.

Regression + replay tests:
38/38 PASS on repaired replay engine.

Campaign:
- 4 scenario families: stationary, changing, noisy, misleading;
- 128 worlds/scenario = 512 worlds;
- 64 cycles/world;
- first 32 cycles training;
- final 32 cycles held out;
- replay budget 12;
- modes NONE, RANDOM, RECENCY, EVB.

Integrity:
- false-real-memory count = 0;
- replay-ledger failures = 0;
- source-receipt mutation failures = 0;
- replay counterfactuals admitted to external history = 0;
- Formula NOT_EXECUTED.

Predeclared learning-measure gate:
PASS.

EVB win:
noisy scenario / sensor NLL:
NONE = 0.6939276910797596
EVB  = 0.6897231801587014
relative improvement = 0.006059004382021354 (0.6059004382%).

Limitations:
- EVB combined NLL improved in zero scenarios;
- aggregate non-stationary EVB combined NLL regressed by 5.5397895371%;
- EVB is therefore NOT promoted as generally superior;
- random replay narrowly improved noisy sensor NLL;
- recency replay improved misleading sensor NLL;
- replay-selection/update design remains an MC-G9 ablation target.

Final campaign digest:
b94338d259554e73cc817735e33a8b36441ddfef330eeb1b9d880a8bd44a84b7.

Failure/recovery history retained:
E-040A failed because replay incorrectly advanced chronological forgetting.
E-040B data met the master gate but campaign validator incorrectly narrowed acceptance to combined NLL.
E-040C repaired the validator without changing the measured campaign data.

Next:
MC-5 independent six-dimension instrumentation.


## E-060 — Math-only cognition / emotion / deliberation qualification

Date: 2026-10-01
State: PASS_AFTER_CALIBRATION_REPAIR

Scope:
mathematics only; not yet live Agent Lee behavior.

Implemented/tested:
- entropy;
- KL/JSD;
- belief stability;
- self-model consistency;
- information gain;
- free-energy-rate valence sign;
- global-access acknowledgement ratio;
- EVB replay priority;
- bounded deliberation;
- mixed mechanical emotion;
- dream source/provenance invariants.

First stress campaign:
the uncalibrated deliberation controller averaged about 7.13 cognition cycles even in a stationary world.

Classification:
candidate controller too computationally expensive for routine state.

Repair:
normalize H, PE, IG, G and B against measured simulator candidate ranges rather than treating raw values as directly comparable pressure.

Calibrated simulated mean cognition cycles:
- stationary: 4.802734375;
- misleading: 5.0654296875;
- changing: 5.17333984375;
- module-dropout: 5.19580078125;
- noisy: 5.645263671875.

Final math tests:
17/17 PASS.

Important staging failure:
dream-self-math.mjs existed while tests/dream-self.test.mjs was missing after an earlier write step. The test artifact was recreated and the combined suite was rerun.

Formula:
NOT_EXECUTED.

Receipt:
receipts/machine-consciousness/AGENT-LEE-MATH-QUALIFICATION-v0-20261001.json

## E-070 — Parallelism funnel baseline

Date: 2026-10-01
State: PASS_AFTER_EVIDENCE_REPAIR

Goal:
determine when 20 workers can be more efficient than one.

CPU-bound workload:
200 worlds x 32 cognition cycles.

Measured elapsed:
- 1 worker: 213.000573 ms;
- 2: 355.049896 ms;
- 4: 501.131614 ms;
- 8: 719.405989 ms;
- 12: 1097.813385 ms;
- 16: 1394.106145 ms;
- 20: 1534.72927 ms.

Finding:
20 physical worker threads are strongly inefficient for this small CPU-bound workload.

Wait-heavy orchestration proxy:
200 tasks, each with 20 ms simulated wait plus deterministic bounded hash work.

Measured:
- 1 logical worker: 4404.380624 ms;
- 20 logical workers: 233.197083 ms;
- speedup: 18.886945614152474x;
- parallel efficiency: 0.9443472807076236.

Evidence-repair event:
the first CPU benchmark aggregated hashes by worker chunk, which made the checksum partition-dependent. The benchmark was repaired to hash each world independently and then hash the canonical ordered world-hash list.

Final:
identical CPU output checksum for 1/2/4/8/12/16/20 worker counts.

Claim boundary:
this proves a scheduling mechanism and workload distinction; it does not prove QLoRA/DPO training speedup.

Formula:
NOT_EXECUTED.

Receipt:
receipts/machine-consciousness/AGENT-LEE-PARALLELISM-BASELINE-v0-20261001.json

## E-080 — Exact cognition-memory compaction prototype

Date: 2026-10-01
State: PASS_EXACT_PROTOTYPE

Dataset:
1,024 deterministic cognition-cycle JSON records.

Measured:
- raw JSONL: 1,167,081 bytes;
- exact packed representation: 372,727 bytes;
- structural representation reduction: 68.06%;
- raw Brotli: 143,528 bytes;
- packed Brotli: 133,762 bytes;
- packed-vs-raw-Brotli improvement: 6.8%.

Exact reconstruction:
PASS.

Source SHA-256:
5f509c26b2b14e241af9ee693fc8d0696699aed43271e7f832c6bac587af2839

Reconstructed SHA-256:
5f509c26b2b14e241af9ee693fc8d0696699aed43271e7f832c6bac587af2839

Interpretation:
structural repetition can be removed from active memory representation while preserving exact source recovery. The extra disk-size gain beyond strong generic Brotli compression is much smaller than the structural reduction.

Live integration:
NOT YET EXECUTED. Pocket MemoryStore still uses newline-appended SharedPreferences strings.

Formula:
NOT_EXECUTED.

Receipt:
receipts/machine-consciousness/AGENT-LEE-MEMORY-COMPACTION-v0-20261001.json

## E-090 — Agent Lee training-curriculum compute routing

Date: 2026-10-01
State: MEASURED_PREFILTER / WEIGHT_TRAINING_NOT_EXECUTED

Current curated examples:
56.

Routed to weight adaptation:
33.

Routed to deterministic/external capability layer:
23.

Input token proxy:
2,213.

Token proxy kept out of weight training:
958.

Estimated weight-training token-burden reduction:
43.29%.

Boundary:
this is not a measured FLOP, energy, wall-clock or gradient-step reduction.

Planned model-training mechanisms:
- teacher/student behavior distillation;
- domain-adaptive continued pretraining with rehearsal;
- QLoRA/LoRA-family supervised adaptation;
- DPO preference optimization.

No new model weights have been trained under this plan yet.


## E-050 — Independent six-dimension instrumentation

Status:
PASS — MC-G5.

Validated implementation:
feature branch agent-lee-mc5-independent-dimensions, merged to main via PR #1.

Validation host:
qualified Android workstation.

Regression + MC-5 tests:
48/48 PASS.

Campaign:
- scenarios: stationary, changing, noisy, misleading, module-dropout;
- 128 worlds/scenario;
- 640 worlds total;
- 64 cycles/world;
- 40,960 cognition cycles;
- 2,560 independently checked 16-cycle windows.

Independent dimensions:
H = belief entropy;
PE = precision-weighted prediction error;
V = free-energy-rate candidate valence;
IG = belief information gain;
G = selected-policy expected free energy;
B = operational global-access ratio from MC-G3 workspace evidence.

Results:
- all cycles recomputed: PASS;
- validation failures: 0;
- non-finite values: 0;
- window failures: 0;
- max absolute difference against existing simulator diagnostic values: exactly 0 for all six dimensions;
- REPLAY provenance rejected;
- tampered receipt hash rejected;
- mismatched awareness state rejected;
- nonconsecutive previous cycle rejected;
- Formula NOT_EXECUTED.

Campaign digest:
5fb592a303a8bdf9e405c9e606ca2a1aec0e3761ef8a0b7338fd5ca5414872f2.

Next:
MC-6 evidence-derived calibration.


## E-060 — Balanced cognition-dimension calibration

Status:
PASS — MC-G6.

Validated source branch:
agent-lee-mc6-calibration
head: 4050cf2ff537fe039d48512956ab97cea734e49e
merged implementation: 182726f232252a795e4c362a4ab4a995272957df

Validation host:
qualified Android workstation.

Tests:
54/54 PASS including all prior regression suites.

Predeclared training/holdout design:
- scenarios: stationary, changing, noisy, misleading, module-dropout;
- 200 worlds/scenario total;
- 160 training worlds/scenario;
- 40 holdout worlds/scenario;
- 64 cycles/world;
- 10,240 training cycles/scenario;
- 51,200 training rows total;
- 2,560 holdout cycles/scenario;
- 12,800 holdout rows total;
- no holdout values used to fit ranges.

Range policy:
- H: analytic [0, ln(2)];
- B: analytic [0,1];
- PE, V, IG, G: training-only min/max plus fixed 5% width margin.

Accepted ranges [H, PE, V, IG, G, B]:
[[0,0.6931471805599453],[0.13358962336732744,3.594753034238593],[-1.3511387098817755,1.209999215547055],[0.019592860275377304,0.29101704384536403],[0.62021659898203,2.3068168203712855],[0,1]]

Holdout:
- overall coverage = 1.0;
- every scenario/dimension coverage = 1.0;
- outside values = 0.

runtime-state-v1:
- 800 holdout 16x6 windows mapped;
- failures = 0;
- canonical adapter SHA-256 reverified as 3264d0a97a76246b31c5ca759b5993188cbae10422eb153ac395e3fb5e2470e0.

Campaign digest:
182eb3b38a2226bee7a5b92a25bbdb39864a0ed3a698c9564168e4c4a17433f6.

Formula:
NOT_EXECUTED.

Next:
MC-G7 live Formula authority reverification.


## E-070 — Live Formula authority reverification

Status:
PASS — MC-G7.

Host:
qualified Android workstation / Termux.

Live evaluator:
http://127.0.0.1:4001

Health:
- status = LEEWAY_FORMULA_V1_PASS;
- formula = LEEWAY-FORMULA-v1.0;
- loaded = true;
- goldenVectorPass = true;
- specValid = true;
- adapterRegistryPass = true;
- kernelIntegrity = VERIFIED_AT_STARTUP.

Independent deployed-source SHA-256:
- engine: 6502791bba909d7481db3a204f3cbf67b1dc06a4b76a73c797d709408341d63e;
- canonical input: 4087fc14a9f1f44eb46d9d6417156176794e2acc72ee9bf481f21a5d0abe5236;
- runtime-state-v1: 3264d0a97a76246b31c5ca759b5993188cbae10422eb153ac395e3fb5e2470e0;
- raw-base64-v1: 2c8b477abad73a0b8519127b20e500bc857f6d26a2722634f23637d4eeac6215;
- formula service: 59c74a850cfbacab4408d73538c824d25687ae0fbd12f07ab5d3622661b7b1ec;
- spec: 2f4604f143e2f7c3bc2fe315f2faa2c7d9b8b188151a0fab9f6cebea3e155f9b;
- spec Markdown: dd9f2f7d23dcc8076d7d3c9e1f194b596bff041e8b25dc003348c8554db7b16d.

Direct Golden self-test:
PASS.
Decimal = [4,50,63,59,48,69].
Base64 = [E,y,/,7,w,BF].
Golden input hash = 06b284a038ddbd371633b89a3358a3e7eff555c067d702fa54340c5347c69462.

Deployment provenance:
canonical Git origin; clean deployed working tree; deployed repo commit eb94a2ef141e4099d6405536ae06cfacd093b936.

Important:
Formula-byte authority is pinned-hash authority. The deployed checkout need not be the latest documentation commit when the canonical Formula bytes and live evaluator identity independently converge.

Cognition Formula execution:
NOT_EXECUTED.

Next:
MC-G8 first cognition evaluation.


## Executed E-100 — MC-G8 first canonical cognition Formula execution

Date: 2026-10-01
State: PASS_EXECUTION_GATE / RESULT_EXECUTED_UNVERIFIED

Fresh source:
- scenario: noisy;
- seed: 1835216952;
- worldIndex: 8808;
- cycles: 16.

Input:
16 x 6 independently recomputed cognition dimensions using operational workspace/self-model evidence and the accepted MC-G6 calibration profile.

Formula:
LEEWAY-FORMULA-v1.0 through runtime-state-v1.

Result:
- decimal state: [69,68,67,65,13,64];
- base64 state: [BF,BE,BD,BB,N,BA];
- input hash: 513f612ca2076bad61eab407b884b9898185608d4fd29a64541a446ed9945bbe;
- result hash: caf9cd55d7608052e1e9cbc3b00d1862ba24ebe5a40b47fab87110bc038d43a8;
- source-window hash: 9d87693c0362362646db170418a330763bc3f5ff59ae01d98b5d9989e13e289f;
- Formula receipt SHA-256: 21bdd93ce4680553137dca4c0b65e9a57c8dab28844627394a9acf444fd3451c.

Boundary:
The Formula executed. The resulting cognition state remains EXECUTED/UNVERIFIED and is not yet given semantic authority over live Agent Lee behavior.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G8-FIRST-FORMULA-EXECUTION-20261001.json

## Executed E-110 — MC-G9 contribution audit tranche 1

Date: 2026-10-01
State: PASS_TRANCHE_1 / MC-G9 NOT CLOSED

Campaign:
- 5 scenario families;
- 128 worlds per scenario;
- 64 cycles per world;
- 40,960 independently recomputed rows.

Current causal map:
- selected-policy expected free energy: direct causal input to base policy selection;
- dream/replay: indirect causal influence through learned parameters.

Current diagnostic/integrity map:
- belief entropy;
- precision-weighted prediction error;
- free-energy-rate valence;
- realized information gain;
- global-access ratio;
- factual self-model.

Replay limitation retained:
EVB produced a narrow noisy-sensor NLL improvement but no combined-NLL scenario wins. General replay superiority remains unverified.

Digest:
5e9a0a51ce177239e2d3516675a1e1764b837b8c982532ead7f7bd37fac6d1a5

Next:
controlled policy/learning ablations against simpler baselines.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G9-CONTRIBUTION-TRANCHE-1-20261001.json
