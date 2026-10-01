<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.AGENT_LEE_DOSSIER
WHAT = Scientific and engineering dossier for Agent Lee cognition, training, memory, emotion, dream, parallelism and deployment
WHY = Make Agent Lee the reproducible reference architecture for future LeeWay agents
WHO = Leeway Industries / Creator-authorized Agent Lee research
WHERE = docs/machine-consciousness/06-AGENT-LEE-SCIENTIFIC-DOSSIER-v0.md
WHEN = 2026-10-01 onward
HOW = Authority separation, mathematical definitions, experiments, failures, receipts, Veritas and claim boundaries
-->

# Agent Lee Scientific Dossier v0

Status: ACTIVE SCIENTIFIC / ENGINEERING RECORD  
Canonical Formula: LEEWAY-FORMULA-v1.0 — unchanged  
Primary research repository: 4citeB4U/Leeway-formula-live  
Persona authority: 4citeB4U/Agent-Lee-The-Sum-of-All-Systems  
Numeric Formula cognition interpretation: NOT YET PROMOTED

## 1. Purpose

Agent Lee is the reference design for how future LeeWay agents are to be built.

The design goal is not a large language model pretending to be a complete agent. The design goal is a persistent governed agent whose language model is one replaceable reasoning component inside a larger deterministic and evidence-aware system.

The reference architecture combines:

- canonical persona and identity;
- LeeWay Formula state control;
- probabilistic belief;
- prediction and prediction error;
- mechanical emotion / valuation;
- adaptive deliberation depth;
- factual self-model;
- global workspace state;
- exact and semantic memory tiers;
- dream / replay;
- Discovery;
- skills and device capabilities;
- QLoRA / preference optimization for small-model behavior;
- Veritas, receipts and learning admission.

## 2. Authority boundaries

### 2.1 Formula authority

LEEWAY-FORMULA-v1.0 remains frozen.

New cognition, training, memory and parallelism domains enter through domain adapters. They do not mutate F1-F10.

### 2.2 Persona authority

Agent Lee persona/voice identity remains in 4citeB4U/Agent-Lee-The-Sum-of-All-Systems, including:

- Agent_Lee_Persona_System/01_SUPERIOR_PROMPT/Agent_Lee_Superior_Prompt.md
- Agent_Lee_Persona_System/02_ENGINE/agentlee_persona_engine_v1_1.js
- src/core/agent_lee_persona.ts
- src/core/agent_lee_voice_profile.ts
- src/core/agent_lee_identity_manifest.ts
- Docs/canon/agent-lee-bible.md
- src/core/brain/modules/slang_engine.py

This dossier references those sources. It does not replace them.

### 2.3 Model boundary

Agent Lee != model.

A local model may be changed, quantized, adapted or replaced without replacing Agent Lee identity, memory, authority, skills, Formula, receipts or self-model.

## 3. Reference architecture

Creator / Human Authority
-> LeeWay Standards
-> Runtime Fabric
-> Agent Lee identity/persona
-> cognition state
-> Formula-governed policy
-> skills / tools / device operatives
-> execution
-> Veritas
-> receipt
-> admitted learning

Cross-cutting state:
- memory;
- emotional state;
- self-model;
- Discovery;
- dream/replay;
- resource pressure;
- capability registry.

## 4. Core cognition recurrence

Candidate non-LLM recurrence:

C_(t+1) = Psi(C_t, o_(t+1), a_t, r_(t+1); theta_t)

where:
- C_t = complete cognition state;
- o_t = observation;
- a_t = action;
- r_t = result/preference signal;
- theta_t = current learned model;
- Psi = deterministic update machinery.

Observation is never equated with world truth.

## 5. Probabilistic belief

Belief:

b_t(s) = P(s_t=s | o_1:t, a_1:t-1)

Prior prediction:

b_prior_t(s) = sum over s' P_theta(s | s',a_t-1) b_t-1(s')

Posterior:

b_t(s) proportional to P_theta(o_t | s) b_prior_t(s)

### 5.1 Belief entropy

H_t = -sum_s b_t(s) ln b_t(s)

### 5.2 Belief stability

M_t = (b_t + b_t-1)/2

JSD(b_t,b_t-1) =
0.5 KL(b_t || M_t) + 0.5 KL(b_t-1 || M_t)

rho_t = 1 - JSD / ln(2)

Interpretation:
- rho near 1: belief changed little;
- lower rho: new evidence is materially moving belief;
- no belief becomes constitutionally permanent.

## 6. Prediction

Predicted observation:

o_hat_t = E[o_t | current belief/model]

Residual:

epsilon_t = o_t - o_hat_t

Precision-weighted prediction error:

PE_t = epsilon_t^T Pi_t epsilon_t

Prediction is stored separately from observation and result.

## 7. Valuation and mechanical emotion

Candidate free energy:

F_t = E_q[ln q_t(s) - ln p_theta(o_t,s)]

Candidate valence:

V_t = -(F_t - F_t-1) / Delta_t

Scientific inspiration:
Joffily & Coricelli, Emotional Valence and the Free-Energy Principle, PLOS Computational Biology, 2013, DOI 10.1371/journal.pcbi.1003094.

LeeWay interpretation:
V is a machine control signal about whether model fit is improving or worsening. It is not proof of a human feeling.

### 7.1 Mechanical emotional mixture

Emotion is not one exclusive label.

Current candidate dimensions include:
- calm;
- confusion;
- frustration;
- curiosity;
- confidence;
- positive valence;
- negative valence.

The system may be uncertain but composed, frustrated but rational, or internally negative while deliberately presenting a professional register.

Emotion informs policy. Emotion does not outrank evidence, Creator authority or Veritas.

## 8. Information gain

IG_t = KL(b_t || b_prior_t)

Purpose:
measure how much an event changed belief.

Low IG:
event was expected / redundant.

High IG:
event changed the internal model materially.

This provides a measurable curiosity / surprise channel.

## 9. Policy and choice

For policy pi:

q(pi) proportional to exp(-gamma G(pi))

Candidate expected-free-energy decomposition:

G(pi) approximately risk + ambiguity - epistemic value

Choice should consider:
- goal;
- uncertainty;
- information value;
- risk;
- future consequence;
- authority;
- resource cost.

## 10. Deliberation budget — response-time mathematics

Agent Lee must not think at maximum depth for every request.

The current candidate computes a deliberation pressure from normalized:

- belief entropy;
- prediction error;
- information gain;
- selected-policy expected free energy;
- global-access gaps;
- self-model inconsistency;
- risk.

It maps pressure to a bounded cognition budget:

1 <= cognition_cycles <= 16

Modes:
- FAST;
- NORMAL;
- DELIBERATE.

Math-only tests verify:
- easy state receives less cognition than difficult state;
- budget remains bounded;
- calibrated low-end measured state remains FAST;
- high uncertainty/error/access loss buys more cycles.

Measured simulated stress campaign after calibration:

| Scenario | Mean cognition cycles |
|---|---:|
| stationary | 4.8027 |
| misleading | 5.0654 |
| changing | 5.1733 |
| module-dropout | 5.1958 |
| noisy | 5.6453 |

Interpretation:
the controller differentiates state difficulty instead of applying one fixed latency policy.

This is not yet wired into live Agent Lee language generation.

## 11. Global access / workspace

Candidate:

B_t = N_ack / N_required

Current higher MC-3 contract uses 8 required modules:
- perception;
- belief;
- prediction;
- valuation;
- policy;
- memory;
- self-model;
- Veritas.

A valid acknowledgement binds the original cognition cycleStateHash and workspace envelope hash.

Incomplete access lowers B. Missing acknowledgements are never fabricated.

## 12. Self-model

The self-model contains inspectable machine facts:
- identity/version;
- active modules;
- sensors;
- actuators;
- authority;
- resource state;
- goals/preferences;
- uncertainty;
- recent actions;
- known failures;
- current evidence/Formula state.

Candidate consistency:

C_self_t = 1 - JSD(observed_self, predicted_self) / ln(2)

Math-only tests verify consistency falls as predicted and observed self-state diverge.

## 13. Dream / replay engineering

Replay is permanently distinct from real events.

Candidate priority:

EVB(k) = Gain(k) * Need(k)

Scientific inspiration:
Mattar & Daw, Prioritized memory access explains planning and hippocampal replay, Nature Neuroscience 21, 1609-1617 (2018), DOI 10.1038/s41593-018-0232-z.

Dream flow:

stored episode
-> rank by expected value of backup
-> reconstruct source belief/context
-> simulate alternate policy
-> predict alternate outcome
-> compute counterfactual error/gain
-> propose update
-> Veritas
-> admit/reject learning

Hard invariant:

DREAM / REPLAY == SIMULATED

A replay record preserves source hash and may never masquerade as an external event that occurred.

Math-only dream/self tests currently PASS.

Formal MC-G4 dream-engine gate remains separate and must still be earned against no-replay, random, recency and EVB baselines.

## 14. Awareness state

Candidate operational state:

A_t = {
 b_t,
 H_t,
 PE_t,
 V_t,
 IG_t,
 G_t(pi*),
 B_t,
 self_model_t,
 memory_provenance_t
}

This is operational instrumentation.

It is not a claim of phenomenal consciousness or sentience.

## 15. Formula bridge

Per completed cognition cycle:

d_t = [H_t, PE_t, V_t, IG_t, G_t(pi*), B_t]

Sixteen compatible cycles:

X_t in R^(16 x 6)

Then, after approved calibration:

16 x 6
-> runtime-state-v1
-> Q69
-> canonical Formula state
-> policy
-> Veritas

The Golden Formula remains unchanged.

## 16. Awareness maturity ladder

These are LeeWay engineering levels, not a scientific consciousness scale.

C0 — Reactive  
input -> response

C1 — Perceptual  
belief + prediction error

C2 — Contextual  
belief + time + memory + prediction

C3 — Valuative  
uncertainty + internal state + valuation

C4 — Deliberative  
multiple futures + epistemic exploration + policy choice

C5 — Operational self-awareness  
factual self-model + global state availability + causal ownership

C6 — Reflective / Dreaming  
offline replay + counterfactual simulation + guarded model revision

A level is earned by tests and receipts.

## 17. Agent Lee model training

### 17.1 Current phone model

Verified phone-local model:
litert-community/SmolLM2-360M-Instruct

runtime: LiteRT-LM  
backend: CPU  
authority: PHONE_LOCAL_MODEL

### 17.2 Training principle

Only compressed behavioral tendencies belong in weights.

Do not store skills, tools, current files, current ecosystem state, device actions, canonical Formula facts, receipts or Discovery registry as if they must all be memorized in parameters.

Those remain external governed capabilities.

### 17.3 Current curriculum routing

Measured current corpus:
- 56 curated examples;
- 33 weight-adaptation candidates;
- 23 deterministic/external capability candidates;
- 2,213 input token proxy;
- 958 token proxy routed away from weight training;
- 43.29% estimated weight-training token-burden reduction.

Claim boundary:
43.29% is a curriculum token-proxy reduction, not yet a measured FLOP or elapsed-training reduction.

### 17.4 QLoRA

Scientific basis:
Dettmers et al., QLoRA: Efficient Finetuning of Quantized LLMs, arXiv:2305.14314.

Relevant mechanisms:
- frozen quantized base model;
- trainable low-rank adapters;
- 4-bit NormalFloat (NF4);
- double quantization;
- paged optimizers.

LeeWay intended use:
small bounded behavior adapters for persona, reasoning style, truth discipline and routing.

### 17.5 DPO

Scientific basis:
Rafailov et al., Direct Preference Optimization: Your Language Model is Secretly a Reward Model, arXiv:2305.18290.

LeeWay intended use:
prefer authentic Agent Lee responses over:
- generic chatbot tone;
- timid identity drift;
- excessive slang caricature;
- fabricated execution;
- weak evidence discipline;
- persona-inconsistent answers.

DPO does not replace Veritas or LeeWay authority.

## 18. Parallelism research

Goal:
find conditions where 20 logical workers outperform one.

Critical distinction:

20 logical workers != 20 OS threads.

### 18.1 CPU-bound cognition baseline

6,400 deterministic simulator cycles:

| Workers/threads | elapsed |
|---:|---:|
| 1 | 213.0006 ms |
| 2 | 355.0499 ms |
| 4 | 501.1316 ms |
| 8 | 719.4060 ms |
| 12 | 1097.8134 ms |
| 16 | 1394.1061 ms |
| 20 | 1534.7293 ms |

All final repaired runs produced identical deterministic checksums.

Conclusion:
20 physical worker threads are substantially worse for this small CPU-bound kernel.

### 18.2 Wait-heavy orchestration baseline

Synthetic proxy:
200 deterministic tasks, each with 20 ms wait plus bounded hash work.

| Logical workers | elapsed | speedup vs 1 |
|---:|---:|---:|
| 1 | 4404.3806 ms | 1.00x |
| 2 | 2172.8878 ms | 2.03x |
| 4 | 1071.2158 ms | 4.11x |
| 8 | 547.3081 ms | 8.05x |
| 12 | 365.0416 ms | 12.07x |
| 16 | 286.4269 ms | 15.38x |
| 20 | 233.1971 ms | 18.89x |

Identical output checksum across all logical-worker counts.

Conclusion:
20 logical workers can be highly effective when latency can be overlapped.

Claim boundary:
this is a training-orchestration proxy, not QLoRA/DPO gradient training.

## 19. Memory compaction research

Goal:
make Formula-guided compaction automatic while preserving truth.

### 19.1 Memory tiers

T0 — exact raw/provenance vault  
T1 — exact structural Formula Memory Pack  
T2 — semantic capsule with source hashes  
T3 — active working set

Lossy summaries may never erase the exact source memory.

### 19.2 Prototype result

1,024 simulator cognition records:

raw JSONL: 1,167,081 bytes  
exact packed structural representation: 372,727 bytes  
structural reduction: 68.06%

raw Brotli: 143,528 bytes  
packed Brotli: 133,762 bytes  
extra improvement versus Brotli(raw): 6.8%

Exact reconstruction: PASS

source SHA-256 == reconstructed SHA-256:
5f509c26b2b14e241af9ee693fc8d0696699aed43271e7f832c6bac587af2839

Interpretation:
the principal demonstrated benefit is reducing repeated structure in the active representation while preserving exact reconstruction. It is not a claim of magical universal file compression.

### 19.3 Live Pocket insertion point

Current Pocket MemoryStore uses unbounded newline-appended strings in Android SharedPreferences for:
- conversations;
- personal memory;
- notebook.

Future integration target:
preserve the public MemoryStore API while replacing the backing write path with automatic segmented, hashed, reconstructable compaction.

## 20. Memory retrieval

Canonical candidate:

MemoryRelevant_t = Retrieve(Goal_t, State_t, Observation_t)

Working-context law:
retrieve only memory that can materially alter the current state.

This aligns with hierarchical-memory systems such as MemGPT's virtual-context approach, while LeeWay adds Formula state, authority, provenance and exact reconstruction boundaries.

## 21. Scientific references used by this architecture

- Knill & Pouget (2004), The Bayesian brain.
- Rao & Ballard (1999), Predictive coding in the visual cortex.
- Friston (2010), The free-energy principle.
- Joffily & Coricelli (2013), Emotional Valence and the Free-Energy Principle.
- Seth (2013), Interoceptive inference, emotion, and the embodied self.
- Friston et al. (2016), Active inference and learning.
- Mashour et al. (2020), Global Neuronal Workspace review.
- Mattar & Daw (2018), prioritized replay / expected value of backup.
- Dettmers et al. (2023), QLoRA.
- Rafailov et al. (2023), DPO.
- Packer et al. (2023), MemGPT / virtual context management.

LeeWay synthesis is explicitly separated from published source mathematics.

## 22. Current mathematical qualification

Math-only tests:
17/17 PASS.

Verified test families:
- entropy;
- JSD;
- belief stability;
- self-consistency;
- information gain;
- valence direction;
- global-access ratio;
- EVB monotonicity;
- bounded deliberation budget;
- calibrated fast-path behavior;
- mixed mechanical emotion;
- dream provenance;
- dream source immutability;
- self-awareness consistency.

This does not yet constitute full Agent Lee behavioral integration.

## 23. Generalization to all LeeWay agents

Future LeeWay agents should inherit the same architecture pattern:

1. unique canonical persona/mission;
2. common LeeWay authority hierarchy;
3. probabilistic belief state;
4. state-specific Formula adapter;
5. bounded deliberation;
6. mechanical valuation/emotion appropriate to role;
7. self-model;
8. memory compiler;
9. dream/replay where useful;
10. Discovery and capability registry;
11. skills external to weights;
12. Veritas + receipts;
13. agent-specific training adapters;
14. no unsupported consciousness claim.

The Agent Lee implementation becomes the reference, not a monolithic code copy.

## 24. Publication boundary

This dossier is suitable as the source for a future RapidWebDevelop research presentation, but publication must preserve evidence labels.

RapidWebDevelop must visibly distinguish:
VERIFIED / OBSERVED / PROPOSED / UNVERIFIED / FAILED / BLOCKED.

No public page may convert a candidate metric, dream experiment or Formula research target into a scientific claim of sentience or human-equivalent consciousness.
