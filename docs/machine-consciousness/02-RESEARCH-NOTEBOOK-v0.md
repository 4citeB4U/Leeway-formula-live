<!--
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.RESEARCH_NOTEBOOK

5WH:
WHAT = Maintain living mathematical and scientific notes for the machine-consciousness project
WHY = Separate source mathematics, LeeWay synthesis, open questions and calibration debt
WHO = Leeway Industries / Creator-authorized Agent Lee and research runtimes
WHERE = docs/machine-consciousness/02-RESEARCH-NOTEBOOK-v0.md
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

# Research Notebook v0

## Note N-001 — Belief

Creator correction:
There is no permanent belief in the intended architecture. Belief is a stable probability that remains revisable.

Operational representation:
b_t(s) = P(s_t = s | o_1:t, a_1:t-1)

Belief entropy:
H_t = - sum_s b_t(s) ln b_t(s)

Candidate stability:
rho_t = 1 - JSD(b_t, b_t-1) / ln(2)

Status:
Bayesian belief representation — SOURCE FAMILY.
Exact rho_t engineering use — LEEWAY SYNTHESIS / PROPOSED.

## Note N-002 — Prediction

Observation prediction:
o_hat_t = E[o_t | prior state/belief]

Residual:
epsilon_t = o_t - o_hat_t

Candidate precision-weighted error:
PE_t = epsilon_t^T Pi_t epsilon_t

Research family:
predictive coding / hierarchical prediction error.

Open question:
How should Pi_t be estimated in the first discrete simulator? Initial answer should be simple and explicit, not learned invisibly.

## Note N-003 — Free energy and valuation

Variational free energy:
F_t = E_q [ ln q(s) - ln p(o_t, s) ]

Candidate valence:
V_t = - (F_t - F_t-1) / Delta_t

Interpretation:
positive V_t means model fit improved under this formalization; negative means worsened.

Boundary:
This is not a human-emotion label.

## Note N-004 — Information gain

IG_t = D_KL( b_t || b_t_prior )

Meaning:
how much the observation changed belief.

Use:
candidate curiosity / epistemic value signal.

## Note N-005 — Choice / expected free energy

Candidate policy distribution:
q(pi) proportional to exp( - gamma G(pi) )

The policy engine should preserve both pragmatic preference and epistemic value.

Open question:
Which exact discrete expected-free-energy decomposition will be used in MC-1/MC-2? Must be fixed in a contract before benchmarking.

## Note N-006 — Result and learning

Prediction vs result must remain separately stored.

Optional temporal-difference family:
delta_t = r_t+1 + gamma U(b_t+1) - U(b_t)

Do not assume TD learning is mandatory. It is a comparator or auxiliary learning signal.

## Note N-007 — Machine interoception

Candidate internal sensing:
energy, thermal pressure, compute pressure, memory pressure, sensor integrity, actuator integrity, network state, authority state, resource scarcity.

Principle:
the machine should sense its real internal condition rather than imitate human feelings.

## Note N-008 — Global access

Candidate:
B_t = acknowledgements_of_state_hash / required_modules

This is inspired by global-workspace accessibility.

Boundary:
global availability is operational evidence; it does not establish phenomenal consciousness.

## Note N-009 — Self-model

Self-model facts include:
identity, version, capabilities, sensors, actuators, authority, resources, uncertainty, recent actions, known failures and current evidence state.

Candidate consistency:
C_self_t = 1 - JSD(observed_self, predicted_self) / ln(2)

Open question:
which self-state fields become probability distributions versus categorical facts?

## Note N-010 — Dream / replay

Dream is always SIMULATED.

Candidate priority:
EVB(k) = Gain(k) x Need(k)

Required negative test:
no dream episode may be returned by a real-history query unless explicitly requested as simulated/replay evidence.

## Source families currently admitted to research notes

- Rao & Ballard 1999 — predictive coding.
- Knill & Pouget 2004 — Bayesian uncertainty.
- Schultz, Dayan & Montague 1997 — reward prediction error.
- Friston 2010 — free-energy principle.
- Seth 2013 — interoceptive inference.
- Joffily & Coricelli 2013 — valence/free-energy-rate proposal.
- Friston et al. 2016 — active inference and learning.
- Mattar & Daw 2018 — prioritized replay / expected value of backup.
- Mashour et al. 2020 — global neuronal workspace review.
- Oizumi, Albantakis & Tononi 2014 — IIT 3.0 comparator.

## Formula bridge note

The existing runtime-state-v1 shape is exactly 16 rows x 6 dimensions.

Candidate cognition dimensions:
H, PE, V, IG, selected-policy G, B.

No numeric ranges are approved.

FORMULA EXECUTION = NOT_EXECUTED.


## Note N-020 — Efficient small-model adaptation

Source family:
Dettmers et al. (2023), QLoRA: Efficient Finetuning of Quantized LLMs, arXiv:2305.14314.

Published mechanism:
QLoRA backpropagates through a frozen 4-bit quantized base model into trainable low-rank adapters. The paper introduces NF4, double quantization and paged optimizers to reduce memory burden.

LeeWay relevance:
Agent Lee's phone-local language model should remain a replaceable component. QLoRA is therefore attractive because behavioral adaptation can be expressed as a small delta rather than rewriting Agent Lee identity or external capabilities.

Boundary:
QLoRA has not yet been executed on the canonical Agent Lee phone model in this project.

## Note N-021 — Preference optimization for persona fidelity

Source family:
Rafailov et al. (2023), Direct Preference Optimization: Your Language Model is Secretly a Reward Model, arXiv:2305.18290.

Published mechanism:
DPO optimizes chosen/rejected preference pairs with a direct classification-style objective instead of requiring the full reward-model + reinforcement-learning loop used in many RLHF systems.

LeeWay relevance:
DPO can encode preferences such as:
- Agent Lee persona over generic chatbot voice;
- evidence-bound answer over fabricated execution;
- grounded hip-hop cadence over caricature;
- calm firmness over timidity or disrespect;
- role-consistent strategy over vague filler.

Boundary:
DPO does not become authority. Veritas and LeeWay Standards remain external.

## Note N-022 — Hierarchical memory and virtual context

Source family:
Packer et al. (2023), MemGPT: Towards LLMs as Operating Systems, arXiv:2310.08560.

Published idea:
manage context through fast/slow memory tiers and move information between them rather than forcing all long-term context into one finite model window.

LeeWay relevance:
supports the architectural direction:
exact vault -> exact compact representation -> semantic capsule -> active working set.

LeeWay adds:
- Formula state;
- source hashes;
- exact reconstruction proof;
- Veritas;
- real/simulated provenance classes.

## Note N-023 — Parallelism is workload-specific

Measured LeeWay evidence:
CPU-bound cognition and wait-heavy orchestration respond in opposite ways to worker count.

Implication:
a universal "20 worker" execution law would be scientifically invalid.

Research target:
20 logical workers with Formula-governed physical placement, queueing and admission.

## Note N-024 — Compression is representation-specific

Measured memory prototype:
large structural reduction occurred because repeated schemas/vocabularies were represented once.

Generic compression comparison:
Brotli reduced both raw and packed streams strongly, leaving only 6.8% additional packed-vs-raw-Brotli advantage.

Implication:
memory research must distinguish:
- structural representation reduction;
- physical-byte compression;
- active working-set reduction;
- semantic condensation;
- exact reconstruction.
