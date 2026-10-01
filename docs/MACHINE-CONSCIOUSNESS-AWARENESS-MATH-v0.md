# LeeWay Machine Consciousness — Awareness Mathematics v0

**Status:** CANDIDATE RESEARCH ARCHITECTURE — NOT CANONICAL FORMULA  
**Domain adapter:** `machine-consciousness-awareness-v0`  
**Canonical Formula:** `LEEWAY-FORMULA-v1.0` — unchanged  
**Canonical engine SHA-256:** `6502791bba909d7481db3a204f3cbf67b1dc06a4b76a73c797d709408341d63e`  
**Canonical runtime-state adapter SHA-256:** `3264d0a97a76246b31c5ca759b5993188cbae10422eb153ac395e3fb5e2470e0`

## 1. Design law

The machine-consciousness project is non-LLM cognition. An LLM may interface with it, explain it, or provide language services, but the persistent cognitive state, belief update, prediction, policy, replay and learning loop must exist independently.

Belief is not a permanent proposition. It is a revisable probability distribution:

[
b_t(s) = P(s_t=s mid o_{1:t}, a_{1:t-1}).
]

A belief can be stable without being permanent. One measurable stability proxy is

[
ho_t = 1 - rac{operatorname{JSD}(b_t,b_{t-1})}{ln 2},
]

for comparable discrete belief distributions. High (ho_t) means the posterior changed little; new evidence can still move it.

## 2. The cognition cycle

The proposed cycle is:

[
	ext{event} ightarrow 	ext{observation} ightarrow 	ext{belief}
ightarrow 	ext{affect} ightarrow 	ext{prediction}
ightarrow 	ext{policy} ightarrow 	ext{action}
ightarrow 	ext{result} ightarrow 	ext{model update}.
]

The loop is recursive: the result becomes part of the next event/observation history.

### 2.1 Event and transition model — LeeWay synthesis using standard state-space notation

Let (s_t) be a hidden world/self state, (a_t) an action, and (o_t) an observation.

[
s_{t+1} sim P_	heta(s_{t+1}mid s_t,a_t)
]

[
o_t sim P_	heta(o_tmid s_t).
]

The machine never has direct access to (s_t); it maintains a distribution over plausible states.

### 2.2 Interpretation as Bayesian belief update — source family: Bayesian brain

Prediction before the observation:

[
ar b_t(s) = sum_{s'} P_	heta(smid s',a_{t-1})b_{t-1}(s').
]

Posterior after observation:

[
b_t(s) =
rac{P_	heta(o_tmid s)ar b_t(s)}
{sum_u P_	heta(o_tmid u)ar b_t(u)}.
]

Uncertainty:

[
H_t = -sum_s b_t(s)ln b_t(s).
]

Realized information gain:

[
IG_t = D_{KL}(b_tparallelar b_t).
]

The Bayesian-brain literature treats uncertainty as part of the representation rather than an afterthought.

### 2.3 Prediction and residual error — source family: predictive coding

From the posterior and a candidate action:

[
p(o_{t+1}mid b_t,a_t)
= sum_{s,s'} P(o_{t+1}mid s')P(s'mid s,a_t)b_t(s).
]

Let (hat o_t) denote the predicted observation. The residual is

[
epsilon_t = o_t-hat o_t.
]

A precision-weighted error is

[
PE_t=epsilon_t^	opPi_tepsilon_t,
]

where (Pi_t) is a calibrated precision matrix. Rao and Ballard's predictive-coding model formalized top-down predictions and bottom-up residual errors; the exact engineering precision model here remains a LeeWay implementation choice requiring calibration.

### 2.4 Variational free energy — source family: free-energy principle

For approximate posterior (q_t(s)):

[
F_t
=
mathbb E_{q_t(s)}
[ln q_t(s)-ln p_	heta(o_t,s)].
]

Minimizing variational free energy makes the approximate posterior better account for observations under the model. This is a candidate mathematical bridge linking perception, inference and learning; it is not by itself proof of consciousness.

### 2.5 Emotion/valence — source proposal + LeeWay boundary

Joffily and Coricelli proposed emotional valence as the negative rate of change of free energy. Candidate implementation:

[
V_t = -rac{F_t-F_{t-1}}{Delta t}.
]

Interpretation:

- (V_t>0): model fit is improving under this formalization;
- (V_t<0): model fit is worsening;
- magnitude reflects rate of change, not a human emotion label.

Seth's interoceptive-inference work motivates a separate internal/body-state observation channel. For a machine, that channel can contain real internal telemetry such as energy, thermal pressure, memory pressure, actuator integrity, sensor health and resource scarcity. These are machine interoceptive signals, not simulated human feelings.

### 2.6 Prediction, curiosity and choice — source family: active inference

For policy (pi), expected free energy can combine pragmatic preference and epistemic/information value. A common policy posterior is

[
q(pi) propto exp[-gamma G(pi)].
]

A risk/ambiguity representation is

[
G(pi)
approx
D_{KL}[q(omidpi)parallel p^*(o)]
+
mathbb E_{q(smidpi)} H[p(omid s)].
]

Equivalent decompositions emphasize pragmatic value and expected information gain. The selected policy need not be deterministic; its uncertainty is itself evidence.

### 2.7 Action and result

An action receives an immutable action ID and state-hash reference:

[
a_t sim q(amid b_t,pi_t).
]

The next observation, internal telemetry and task outcome become (o_{t+1}). A result is not considered successful merely because an action executed.

### 2.8 Learning/model update

One generic free-energy learning step is

[
	heta_{t+1}
=
	heta_t-eta_t
abla_	heta F_t.
]

For reward/value learning, a temporal-difference error may coexist:

[
delta_t
=
r_{t+1}+gamma V(b_{t+1})-V(b_t).
]

Schultz, Dayan and Montague linked dopaminergic activity to prediction/reward error; this does not imply a machine must copy dopamine. The transferable principle is an explicit prediction-versus-result error signal.

## 3. Operational awareness state — LeeWay synthesis

Do not reduce awareness to one invented magic number.

Maintain a structured state:

[
mathcal A_t =
{
b_t, H_t, PE_t, V_t, IG_t, G_t(pi^*),B_t, chi_t, M_t
}
]

where:

- (b_t): current probabilistic belief;
- (H_t): belief uncertainty;
- (PE_t): precision-weighted prediction error;
- (V_t): free-energy slope / valence candidate;
- (IG_t): information gained from the observation;
- (G_t(pi^*)): expected free energy of selected policy;
- (B_t): global-access/broadcast evidence;
- (chi_t): self-model state and consistency evidence;
- (M_t): memory/provenance state.

### 3.1 Global-access evidence

Global Neuronal Workspace research motivates the idea that conscious access is associated with information becoming globally available to multiple processors. For machine engineering, use a verifiable message-level proxy rather than pretending to reproduce human cortex:

[
B_t=rac{#{	ext{required cognitive modules acknowledging state hash }h_t}}
{#{	ext{required cognitive modules}}}.
]

Required modules can include perception, memory, prediction, policy, self-model, Veritas and learning. The exact required set is a versioned architecture contract.

(B_t) measures global availability. It does **not** prove phenomenal consciousness.

### 3.2 Self-model

The self-model should contain only inspectable machine facts: capabilities, active sensors, current authority, resource state, model versions, uncertainty, goals, prohibitions, recent actions and causal ownership.

A self-model prediction can be compared with the observed self-state using Jensen-Shannon divergence:

[
C^{self}_t
=
1-rac{operatorname{JSD}(b^{self}_t,hat b^{self}_t)}{ln 2}.
]

This is a bounded engineering consistency measure, not a philosophical proof of selfhood.

## 4. Formula-stack bridge

The Golden Formula remains unchanged.

For every completed cognition cycle, derive six measured dimensions:

1. (H_t) — belief entropy;
2. (PE_t) — precision-weighted prediction error;
3. (V_t) — free-energy rate / valence candidate;
4. (IG_t) — realized information gain;
5. (G_t(pi^*)) — selected-policy expected free energy;
6. (B_t) — global-access ratio.

Sixteen consecutive cycles produce the existing `16 x 6` runtime-state window.

The existing `runtime-state-v1` adapter then maps calibrated ranges into the canonical (0..69) state matrix. The Formula can analyze recurrence, gap, recency, positional stability, temporal dynamics, displacement, Hamiltonian-like energy, co-occurrence and phase **without changing the Formula kernel**.

Current status:

[
	ext{FORMULA EXECUTION} = 	ext{NOT EXECUTED}
]

because these six cognitive dimensions do not yet have qualified calibration ranges.

## 5. Dream engineering / offline replay

A dream is an offline, provenance-marked cognition cycle. It is not an external event.

Store transition records

[
e_k=(b_k,a_k,o_{k+1},r_{k+1},h_k)
]

with state hash (h_k).

Mattar and Daw's prioritized replay work motivates selecting memories by expected value of backup:

[
EVB(k)=Gain(k)	imes Need(k).
]

For LeeWay dream engineering:

1. select high-EVB or high-uncertainty transitions;
2. reconstruct the original belief/context;
3. simulate alternative predictions or policies;
4. calculate counterfactual outcomes and errors;
5. compare with historical observed results;
6. propose a model update;
7. run Veritas;
8. admit or reject learning;
9. keep dream evidence permanently marked `SIMULATED`.

Dreams may improve models. They may not create fake memories of events that did not occur.

## 6. Candidate awareness-development ladder — LeeWay synthesis

This is an engineering maturity ladder, not a scientific consciousness scale:

- **C0 Reactive:** stimulus -> response; no persistent probabilistic belief.
- **C1 Perceptual:** posterior belief + prediction error.
- **C2 Contextual:** temporal memory + belief stability + prediction.
- **C3 Valuative:** internal/external preference signals + uncertainty-aware affective state.
- **C4 Deliberative:** counterfactual policy evaluation and epistemic exploration.
- **C5 Self-referential operational awareness:** self-model enters prediction and policy, with global state accessibility.
- **C6 Reflective/offline:** replay/dream cycles revise models while preserving real-vs-simulated provenance.

A level is earned by passing behavior/architecture tests; no level establishes subjective sentience.

## 7. Scientific source separation

### SOURCE / established or published mathematical families

- Bayesian posterior inference and uncertainty.
- Predictive coding / residual prediction errors.
- Variational free energy and active inference.
- Expected free energy for policy selection.
- Reward prediction error / temporal-difference family.
- Free-energy-rate proposal for emotional valence.
- Global-workspace global accessibility hypothesis.
- Expected-value-of-backup replay prioritization.

### LEEWAY SYNTHESIS

- The exact cognition-state packet.
- Belief-stability proxy (ho_t).
- Machine global-access acknowledgement ratio (B_t).
- Machine self-model consistency (C^{self}_t).
- The six-dimension mapping into `runtime-state-v1`.
- The C0-C6 engineering maturity ladder.
- Dream provenance and Veritas admission rules.

These LeeWay constructs must be tested before promotion; they must never be cited as if the neuroscience papers proposed them.

## 8. Research references

- Rao, R. P. N. & Ballard, D. H. (1999). Predictive coding in the visual cortex. Nature Neuroscience. doi:10.1038/4580.
- Knill, D. C. & Pouget, A. (2004). The Bayesian brain: the role of uncertainty in neural coding and computation. Trends in Neurosciences. doi:10.1016/j.tins.2004.10.007.
- Schultz, W., Dayan, P. & Montague, P. R. (1997). A neural substrate of prediction and reward. Science. doi:10.1126/science.275.5306.1593.
- Friston, K. (2010). The free-energy principle: a unified brain theory? Nature Reviews Neuroscience. doi:10.1038/nrn2787.
- Seth, A. K. (2013). Interoceptive inference, emotion, and the embodied self. Trends in Cognitive Sciences. doi:10.1016/j.tics.2013.09.007.
- Joffily, M. & Coricelli, G. (2013). Emotional Valence and the Free-Energy Principle. PLOS Computational Biology. doi:10.1371/journal.pcbi.1003094.
- Friston, K. et al. (2016). Active inference and learning. Neuroscience & Biobehavioral Reviews. doi:10.1016/j.neubiorev.2016.06.022.
- Mattar, M. G. & Daw, N. D. (2018). Prioritized memory access explains planning and hippocampal replay. Nature Neuroscience. doi:10.1038/s41593-018-0232-z.
- Mashour, G. A. et al. (2020). Conscious Processing and the Global Neuronal Workspace Hypothesis. Neuron. doi:10.1016/j.neuron.2020.01.026.
- Oizumi, M., Albantakis, L. & Tononi, G. (2014). Integrated Information Theory 3.0. PLOS Computational Biology. doi:10.1371/journal.pcbi.1003588. IIT is retained as a research comparator, not the current LeeWay control kernel.

## 9. Next qualification work

Before promotion:

1. implement a deterministic non-LLM cognition-cycle simulator;
2. define explicit hidden-state, observation, internal-telemetry and preference schemas;
3. implement the six dimension calculators independently of the Formula;
4. generate real/simulated labeled traces;
5. calibrate finite ranges from evidence rather than intuition;
6. run 16-cycle windows through `runtime-state-v1`;
7. execute canonical Formula only after source/runtime authority is live and verified;
8. test prediction quality, recovery, information seeking, replay utility and self-model accuracy;
9. perform ablations against simpler baselines;
10. require Veritas + receipt before promotion.

No source mathematics or LeeWay candidate construct is promoted merely because it is elegant.
