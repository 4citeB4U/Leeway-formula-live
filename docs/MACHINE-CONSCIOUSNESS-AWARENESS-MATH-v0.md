<!--
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.AWARENESS_MATH

5WH:
WHAT = Define the candidate mathematics for probabilistic belief, prediction, valuation, policy, awareness, self-model and replay
WHY = Provide a readable scientific/engineering bridge into the existing Formula stack without mutating the Formula
WHO = Leeway Industries / Creator-authorized Agent Lee and research runtimes
WHERE = docs/MACHINE-CONSCIOUSNESS-AWARENESS-MATH-v0.md
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

# LeeWay Machine Consciousness — Awareness Mathematics v0

Status: CANDIDATE RESEARCH ARCHITECTURE — NOT CANONICAL FORMULA
Domain adapter: machine-consciousness-awareness-v0
Canonical Formula: LEEWAY-FORMULA-v1.0 — unchanged
Canonical engine SHA-256: 6502791bba909d7481db3a204f3cbf67b1dc06a4b76a73c797d709408341d63e
Canonical runtime-state adapter SHA-256: 3264d0a97a76246b31c5ca759b5993188cbae10422eb153ac395e3fb5e2470e0

Repair note:
This revision repairs Markdown escaping/control-character corruption in the first generated human-readable version. The candidate mathematics and Formula boundary are not changed by this repair.

## 1. Design law

The project is non-LLM cognition. An LLM may interface with it, explain it or provide language services, but persistent cognitive state, belief update, prediction, policy, replay and learning must exist independently.

Belief is a revisable probability distribution:

b_t(s) = P(s_t = s | o_1:t, a_1:t-1)

A belief can be stable without being permanent.

Candidate stability:

rho_t = 1 - JSD(b_t, b_t-1) / ln(2)

High rho_t means the posterior changed little; new evidence can still move it.

## 2. Cognition cycle

event -> observation -> belief -> affect/valuation -> prediction -> policy -> action -> result -> model update -> memory/continuity update

The result becomes part of the next event/observation history.

### 2.1 Hidden state and observation

s_t is hidden world/self state.
a_t is action.
o_t is observation.

Transition:
s_t+1 ~ P_theta(s_t+1 | s_t, a_t)

Observation:
o_t ~ P_theta(o_t | s_t)

The machine maintains a distribution over plausible states rather than direct access to hidden state.

### 2.2 Bayesian belief update

Prior prediction:

b_prior_t(s) = sum over s' of P_theta(s | s', a_t-1) * b_t-1(s')

Posterior:

b_t(s) =
P_theta(o_t | s) * b_prior_t(s)
/
sum over u of P_theta(o_t | u) * b_prior_t(u)

Belief entropy:

H_t = - sum_s b_t(s) ln b_t(s)

Information gain:

IG_t = D_KL(b_t || b_prior_t)

### 2.3 Prediction error

Predicted observation:
o_hat_t = E[o_t | current model/belief]

Residual:
epsilon_t = o_t - o_hat_t

Candidate precision-weighted prediction error:

PE_t = transpose(epsilon_t) * Pi_t * epsilon_t

Pi_t is a calibrated precision model.

### 2.4 Variational free energy

For approximate posterior q_t(s):

F_t = E_q [ ln q_t(s) - ln p_theta(o_t, s) ]

This is a candidate bridge for perception, inference and learning. It is not proof of consciousness.

### 2.5 Candidate valence

Following the free-energy-rate proposal:

V_t = - (F_t - F_t-1) / Delta_t

V_t > 0 means model fit improved under this operationalization.
V_t < 0 means model fit worsened.

This is a control signal, not a human feeling label.

### 2.6 Machine interoception

Internal observation channels may include:

energy budget;
thermal pressure;
compute pressure;
memory pressure;
sensor integrity;
actuator integrity;
network state;
authority/permission state;
resource scarcity.

These are real machine internal conditions.

### 2.7 Policy / expected free energy

For policy pi:

q(pi) proportional to exp( - gamma * G(pi) )

A candidate decomposition:

G(pi) approximately =
risk relative to preferred outcomes
+
ambiguity of observations under predicted states

Equivalent active-inference formulations emphasize pragmatic value plus epistemic/information value.

### 2.8 Action and result

Action:
a_t ~ q(a | b_t, pi_t)

Each action carries an immutable action ID and state-hash reference.

Result/new observation:
o_t+1

Optional reward/preference signal:
r_t+1

Execution is not success; predicted and actual outcomes remain separate.

### 2.9 Learning

Generic free-energy parameter update:

theta_t+1 = theta_t - eta_t * gradient_theta(F_t)

Optional temporal-difference family:

delta_t = r_t+1 + gamma * U(b_t+1) - U(b_t)

The initial runtime need not use every learning family.

## 3. Operational awareness state

Do not reduce awareness to one invented scalar.

Maintain:

A_t = {
  b_t,
  H_t,
  PE_t,
  V_t,
  IG_t,
  G_t(selected_policy),
  B_t,
  self_model_t,
  memory_provenance_t
}

## 4. Global-access evidence

Candidate machine workspace metric:

B_t =
number of required modules acknowledging cognition state hash h_t
/
number of required modules

Possible required modules:
perception, memory, prediction, policy, self-model, Veritas and learning.

B_t measures global availability, not phenomenal consciousness.

## 5. Self-model

Self-model contains inspectable facts:
identity, version, capabilities, sensors, actuators, authority, resources, uncertainty, goals/preferences, recent actions, known failures and evidence state.

Candidate self-consistency:

C_self_t =
1 - JSD(observed_self_distribution, predicted_self_distribution) / ln(2)

## 6. Formula-stack bridge

Every completed cognition cycle emits six candidate measured dimensions:

1. H_t — belief entropy
2. PE_t — precision-weighted prediction error
3. V_t — candidate free-energy-rate valence
4. IG_t — realized information gain
5. G_t(selected_policy) — selected-policy expected free energy
6. B_t — global-access ratio

Sixteen compatible cycles produce a 16 x 6 observation window.

The existing runtime-state-v1 adapter maps calibrated finite ranges into the canonical 0..69 matrix.

The Golden Formula remains unchanged.

Current state:

FORMULA EXECUTION = NOT_EXECUTED

Reason:
the six cognition dimensions do not yet have qualified calibration ranges and task interpretation has not been Veritas-qualified.

## 7. Dream engineering / offline replay

Stored transition:

e_k = (belief_k, action_k, next_observation_k, result_k, state_hash_k)

Candidate replay priority:

EVB(k) = Gain(k) * Need(k)

Dream cycle:

select episode
-> reconstruct original belief/context
-> simulate alternate prediction/policy
-> calculate counterfactual outcome/error
-> compare with observed history
-> propose model update
-> Veritas
-> admit or reject learning

Hard rule:
dream/replay evidence remains SIMULATED.

## 8. Candidate maturity ladder

C0 Reactive:
stimulus -> response; no persistent probabilistic belief.

C1 Perceptual:
posterior belief + prediction error.

C2 Contextual:
temporal memory + belief stability + prediction.

C3 Valuative:
internal/external preferences + uncertainty-aware valuation.

C4 Deliberative:
counterfactual policy evaluation + epistemic exploration.

C5 Operational self-awareness:
self-model participates in prediction/policy and cognition state is globally available.

C6 Reflective/offline:
replay/dream cycles revise models while preserving real-vs-simulated provenance.

These are engineering maturity levels, not a scientific consciousness scale.

## 9. Source separation

Published/source mathematical families:

- Bayesian posterior inference and uncertainty.
- Predictive coding / residual prediction error.
- Variational free energy and active inference.
- Expected free energy for policy selection.
- Reward prediction error / temporal-difference family.
- Free-energy-rate proposal for emotional valence.
- Global-workspace accessibility hypothesis.
- Expected-value-of-backup replay prioritization.

LeeWay synthesis:

- cognition-state packet;
- rho_t belief-stability diagnostic;
- B_t global-access acknowledgement ratio;
- C_self_t self-model-consistency diagnostic;
- six-dimension mapping into runtime-state-v1;
- C0-C6 engineering maturity ladder;
- dream provenance and Veritas admission rules.

## 10. References

Rao & Ballard (1999), Predictive coding in the visual cortex. doi:10.1038/4580.
Knill & Pouget (2004), The Bayesian brain. doi:10.1016/j.tins.2004.10.007.
Schultz, Dayan & Montague (1997), A neural substrate of prediction and reward. doi:10.1126/science.275.5306.1593.
Friston (2010), The free-energy principle. doi:10.1038/nrn2787.
Seth (2013), Interoceptive inference, emotion, and the embodied self. doi:10.1016/j.tics.2013.09.007.
Joffily & Coricelli (2013), Emotional Valence and the Free-Energy Principle. doi:10.1371/journal.pcbi.1003094.
Friston et al. (2016), Active inference and learning. doi:10.1016/j.neubiorev.2016.06.022.
Mattar & Daw (2018), Prioritized memory access explains planning and hippocampal replay. doi:10.1038/s41593-018-0232-z.
Mashour et al. (2020), Conscious Processing and the Global Neuronal Workspace Hypothesis. doi:10.1016/j.neuron.2020.01.026.
Oizumi, Albantakis & Tononi (2014), IIT 3.0. doi:10.1371/journal.pcbi.1003588. Comparator only.

## 11. Next qualification

Implement deterministic non-LLM cognition-cycle simulator;
define explicit schemas;
implement six metric calculators;
generate labeled traces;
calibrate finite ranges;
run 16-cycle windows through runtime-state-v1;
reverify live Formula authority;
execute canonical Formula only after calibration;
run ablations;
require Veritas + receipt before promotion.
