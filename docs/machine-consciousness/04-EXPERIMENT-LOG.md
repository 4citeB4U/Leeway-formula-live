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


## E-120 — MC-G11 governed ecosystem integration baseline

Date: 2026-10-02
State: FAILED_BASELINE / MC-G11 NOT PASSED

Observed on the authorized Android workstation:
- the existing non-LLM physical-loop test invoked Android VIEW through a direct phone-side action;
- activity-manager exit code = 0;
- expected localhost browser callback was not observed;
- observation therefore did not match prediction;
- Formula health remained LEEWAY_FORMULA_V1_PASS but Formula evaluation was NOT_INVOKED;
- LLM dependency = 0.

Critical integration finding:
the baseline did not traverse the existing Universal Capability Kernel, Skill Orchestrator, Tool Gateway or governed Device Bridge path. Therefore it cannot count as proof that Machine Consciousness can use the full LeeWay ecosystem.

Scientific use:
this negative result establishes the MC-G11 baseline and the first failed boundary. The next test must route the same bounded action through the existing LeeWay capability authorities and independently observe the real result.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G11-BASELINE-DIRECT-ACTION-FAIL-20261002.json

Claim boundary:
executed command != observed outcome; named capability authority != proven capability routing.


## E-121 — MC-G11 first governed LeeWay ecosystem capability PASS

Date: 2026-10-03 UTC / 2026-10-02 America/Chicago
State: PASS — MC-G11 bounded file-capability proof

Live host:
authorized Galaxy Z Fold6 Android/Termux workstation.

Cognition precondition:
- live non-LLM shadow state hash: 90f826749fdb1997d1a0e25c8782bf212772f05822962d87ef05481d92ae25a4;
- continuityVerified = true;
- Formula health = LEEWAY_FORMULA_V1_PASS;
- Formula task evaluation was not used for the Device Bridge provider receipts.

Deterministic policy:
- candidates: NOOP, PHONE_LOCAL_FILE_ROUNDTRIP;
- selected: PHONE_LOCAL_FILE_ROUNDTRIP;
- rule: select the bounded roundtrip only while continuity is verified and Formula health is PASS.

Governed LeeWay route actually exercised:
- LeeWay Universal Capability Kernel via Skills MCP;
- LeeWay Skill Orchestrator via Skills MCP;
- LeeWay Tool Gateway via Skills MCP;
- LeeWay Device Bridge authority via Skills MCP;
- focal execution set: device.files.write + device.files.read;
- provider: existing LEEWAY-DEVICE-BRIDGE apps/desktop/mcp-server.mjs.

Provider result:
- write PASS;
- read PASS;
- expected/observed payload SHA-256 both 299de1cfbacff713e6a5147ac9a6477b61a39fe918e064252b8a510b1f6862bb;
- Device Bridge write receipt SHA-256: a4e0225e867ff898485577d696800dfe5d1198227b229268b1ffbc4192032878;
- Device Bridge read receipt SHA-256: c8b879a0426036bd1df439a1cbc519512d7f9d50a4f757e4e8478bc5a8c5a400.

Independent Veritas:
PASS; provider receipt hashes were recomputed, provider outcomes checked, route evidence checked, roundtrip bytes rehashed, and all six LLM-boundary fields were false.

Structural MC-G11 validator:
PASS.
Verified packet SHA-256:
fee10810d3018bfeb3ec44364b73ef8a2022af4af05a4cd3cc59df149c907deb.

Production-efficiency evidence:
- reused components: 7;
- new glue components: 1;
- duplicated components created: 0;
- human interventions during executed roundtrip: 0;
- manual steps inside executed roundtrip: 0.

Claim boundary:
This proves one governed, real, phone-local file capability traversed existing LeeWay skill authorities and existing Device Bridge MCP without an LLM in cognition, policy selection, capability selection, execution authority, result verification or learning admission. It does not yet prove Android UI/Calculator control through the same governed route, general natural-language understanding or phenomenal consciousness.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G11-VERIFIED-20261003.json


## E-122 — MC-G11A live ecosystem-path requalification and MC-G11B provider-state probe

Date: 2026-10-03 UTC / 2026-10-02 America/Chicago
State: MC-G11A VERIFIED_REQUALIFICATION / MC-G11B BLOCKED_AT_PROVIDER_POSTCONDITION

Requalification:
- Agent Skills MCP protocol: 592 tools; 49 bounded capability tools; 7 device tools; PROTOCOL_VERIFIED;
- live Device Bridge local health: PASS;
- authority: PHONE_LOCAL_RUNTIME;
- agent access: enabled;
- remote relay: enabled, connected, lastEvent=AUTHENTICATED;
- live remote capability count: 26;
- Agent Skills device_capabilities -> loopback Device MCP gateway -> canonical RelayAdapter -> live phone returned ADAPTER_EVIDENCE_RECEIVED, executed=true, HTTP 200;
- independent MC-G11 validator: PASS / VERIFIED;
- all six governed LLM-use fields: false;
- duplicate components created: 0.

MC-G11B actuation probe:
- device.apps.launch for Samsung Calculator returned LAUNCH_REQUESTED;
- independent device.ui.snapshot returned ACCESSIBILITY_SERVICE_NOT_ACTIVE;
- therefore foreground/postcondition verification did not pass and Calculator control was not promoted;
- fallback voice.speak returned VOICE_UNAVAILABLE;
- voice.status confirmed canonical LeeWay Voice Fabric authority but native phone adapter remains unqualified and fallbackAllowed=false.

Interpretation:
Lane C / Device Bridge itself is live. The current actuation blocker is provider-specific Android accessibility state, not loss of the LeeWay ecosystem route. Voice is a separate provider qualification gap.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G11A-REQUALIFICATION-20261003.json

Claim boundary:
read-only capability traversal is reverified; UI actuation and voice execution remain unverified.


## E-130 — MC-G9 spatial cortex + hierarchical LOD staging

Date: 2026-10-04
State: PASS_STAGING / LIVE SIX-DIMENSION TRACE BLOCKED

Authority:
- LEEWAY-FORMULA-v1.0 unchanged.
- Cesium/LeeWay Maps is an external spatial observation/simulation provider, not Formula authority.
- No spatial state has been promoted to live policy authority.

Implementation:
- added provenance-bound spatial observation contract;
- added deterministic spatial ingestion/comparison lane;
- added three-level capability LOD selector;
- added Focus/Horizon/Archive memory-shell paging rules;
- added explicit protection for unresolved commitments and durable evidence.

Validation on Agent-Lee Windows workstation:
- Machine Consciousness tests: 63/63 PASS.
- Golden Formula vector: PASS [4,50,63,59,48,69] / [E,y,/,7,w,BF].
- hardware-backed browser rendering observed: WebGL 2.0, ANGLE Intel Graphics, Direct3D11.

Live LeeWay Maps observation:
- visible spatial candidates = 100;
- moving subjects = 0;
- transit route deviation = null;
- rendered labels = 0;
- p95 frame time = 29.20000000001164 ms;
- interaction latency = 3.099999997764826 ms.

Fail-closed boundary:
the live observation is incomplete because transit_route_deviation_m is null. Current deployed runtime also reports transit-routes `routeGeometryIndex is not defined`; canonical source contains the declaration, so this is retained as a Maps deployment/cache/runtime mismatch until independently isolated. No zero substitution and no Formula execution were permitted.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G9-SPATIAL-CORTEX-STAGING-20261004.json

Next:
repair/qualify the Maps route-deviation evidence source, capture >=16 complete real-GPU observations, then run the MC-G9 spatial ablation against simpler baselines and the >=20% efficiency objective without degrading correctness or Veritas.


## E-131 — MC-G9 hierarchical LOD ablation tranche 2

Date: 2026-10-04
State: VERIFIED_FIXTURE_LEVEL_IMPROVEMENT / PRODUCTION GENERALIZATION NOT YET VERIFIED

Protocol:
docs/machine-consciousness/12-MC-G9-SPATIAL-LOD-ABLATION-PROTOCOL-v0.md

Predeclared formula:
For positive cost metric m,
R_m = (mean(C_m) - mean(T_m)) / mean(C_m)
and I_m = 100 * R_m.

Controlled deterministic campaign:
- 4,096 matched trials;
- 246 available capabilities;
- fixed seed 20261004;
- eager control loads all interfaces/executables;
- LOD treatment keeps descriptors ambient and refines only intersecting capabilities.

Results:
- interface loads: 246.0 -> 1.314697265625 mean;
- interface-load reduction: 99.4655702172256%;
- 95% bootstrap interval: [99.45872237042683%, 99.47241806402439%];
- execution loads: 246.0 -> 1.0 mean;
- execution-load reduction: 99.59349593495935%;
- 95% bootstrap interval: [99.59349593495935%, 99.59349593495935%];
- task success: control 1.0, treatment 1.0;
- Veritas failures: 0;
- authority violations: 0;
- provenance violations: 0.

Classification:
VERIFIED improvement for this deterministic fixture. This does not yet prove the same percentage reduction in production CPU, RAM, energy, latency or end-to-end task cost.

Regression:
66/66 Machine Consciousness tests PASS.
Golden Formula PASS.

Spatial provider update:
Leeway-Maps commit b81109e9f2ac071027e56567497ef7c4d9e2d761 repaired route geometry initialization and deployed successfully through GitHub Pages workflow 37224615674. Post-deploy transit-routes loaded 100 mapped routes with error=null. The live six-vector remains blocked because transit_route_deviation_m requires live vehicle/map-match evidence; MCTS feed is unavailable and live Transitland vehicles require a server key. Static route geometry was not substituted.

Failure evidence retained:
multiple artifact/entrypoint persistence failures occurred and were repaired before result promotion; see the tranche receipt.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G9-LOD-ABLATION-TRANCHE-2-20261004.json

Next:
production-grounded resource benchmark for LOD, plus either a separately calibrated static-spatial observation contract or restored live vehicle/map-match evidence.


## E-132 — MC-G9 production-grounded skill-document LOD benchmark

Date: 2026-10-04
State: VERIFIED_HOST_GROUNDED_FILE_LOADING_IMPROVEMENT

Storage precondition:
The returned E: provider was independently identified as Insignia NS-PACS2B25(-C), serial 47B2500000001CE5, USB, healthy/online/writable NTFS, with 861,021,351,936 bytes free. A 22-byte write/hash/delete probe passed. E: is a host binding only; canonical identity remains <LEEWAY_ROOT>.

Agent Skills source:
fe33c00cb2a466728d996fc2a9145107ca308ab5.

Inventory distinction:
repository audit layer reports 247 skill artifacts; live filesystem contains 499 physical skills/**/SKILL.md documents totaling 1,808,502 bytes. This benchmark measures physical document-loading cost and uses the 499-document universe without redefining the semantic audit count.

Matched host experiment:
- eager control: read all 499 full documents;
- LOD treatment: enumerate descriptors for the universe and read 5 focal full documents;
- 60 iterations per lane;
- separate no-profile PowerShell processes;
- 5,000 bootstrap resamples, seed 20261004.

Results:
- full document loads: 499 -> 5, reduction 98.99799599198397%;
- payload: 1,808,502 -> 19,463.7 mean bytes, reduction 98.92376674175644%, 95% CI [98.76796284070095%, 99.07321823992085%];
- wall time: 15.641558333333331 -> 3.705605 ms, reduction 76.30923389453416%, 95% CI [73.40774948286793%, 77.93947254721041%];
- CPU: 15.104166666666666 -> 5.208333333333333 ms, reduction 65.51724137931035%, 95% CI [50%, 79.62962962962963%];
- working set reduction 5.780866618043907%;
- peak working set reduction 4.833384115479263%;
- OS I/O read counter remained zero in both lanes and is NON_INFORMATIVE_OS_CACHE_COUNTER_ZERO.

Creator >=20% gate:
PASS for document loads, payload bytes, wall time and CPU time. Memory metrics do not clear 20%.

Failures preserved:
the first bootstrap analyzer failed on PowerShell array precedence; a corrected attempt hit a locked failed output; final evidence was written to production-analysis-v2.json rather than overwriting failed evidence.

Evidence hashes:
- eager 664D76959F6F248F754CC4560797BC44E1D9B6BD3AB60B79AFC8299CD1B58022
- LOD F5E74C57552525E6BF2DE9104834AD043AFAE7B73AB2B976ADF407C93EAFF7B3
- analysis 9828BC58A9C75302C6586BB2261F837B3734580BC7E8800544EF75495D1A547F

Claim boundary:
verified host-grounded warm-cache skill-document loading improvement; not yet an end-to-end Skill Orchestrator/Universal Capability Kernel task-latency proof.

Receipt:
receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G9-PRODUCTION-LOD-BENCHMARK-20261004.json
