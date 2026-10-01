<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.RAPIDWEB_PUBLICATION
WHAT = Publication contract for exposing Agent Lee cognition research on RapidWebDevelop
WHY = Preserve scientific evidence state when translating research into public presentation
WHO = Leeway Industries
WHERE = docs/machine-consciousness/09-RAPIDWEBDEVELOP-PUBLICATION-PLAN-v0.md
WHEN = 2026-10-01 onward
HOW = Evidence-backed content manifest, public claim boundaries and interactive research views
-->

# RapidWebDevelop Publication Plan — Agent Lee Research

Status: PLANNED / NOT YET DEPLOYED

Target:
RapidWebDevelop.com

Source authority:
4citeB4U/Leeway-formula-live

Persona source:
4citeB4U/Agent-Lee-The-Sum-of-All-Systems

## 1. Publication objective

RapidWebDevelop should present Agent Lee as an inspectable engineering/research system, not as a marketing claim.

The public experience should let a visitor move from a high-level Agent Lee introduction into progressively deeper evidence:

overview
-> architecture
-> mathematics
-> experiments
-> gates
-> failures/repairs
-> receipts
-> source repositories

## 2. Proposed page structure

### /research/agent-lee

Public overview:
- what Agent Lee is;
- model != agent;
- LeeWay authority hierarchy;
- current maturity gate;
- verified versus candidate capabilities.

### /research/agent-lee/persona

Source:
Agent Lee persona authority repository.

Show:
- identity principles;
- communication style;
- role/mission;
- why persona is constitutional rather than decorative.

Do not expose private prompts verbatim if they contain non-public implementation detail.

### /research/agent-lee/cognition

Show:
- event -> observation -> belief -> prediction -> valuation -> policy -> action -> result -> learning;
- probabilistic belief;
- entropy;
- prediction error;
- information gain;
- global access;
- self-model.

### /research/agent-lee/emotion

Show:
- mechanical emotion is a state mixture;
- valence is operational math;
- emotion affects register/deliberation but never truth authority.

### /research/agent-lee/dreams

Show:
- EVB replay;
- source hash;
- SIMULATED provenance;
- real-vs-dream separation;
- current MC-G4 status.

### /research/agent-lee/memory

Show:
- T0 raw vault;
- T1 exact compact pack;
- T2 semantic capsule;
- T3 active working set;
- exact reconstruction experiment;
- memory compaction measurements.

### /research/agent-lee/parallelism

Interactive chart:
worker count vs elapsed time.

Display both:
- CPU-bound thread case;
- wait-heavy logical-worker case.

Primary lesson:
20 logical workers may outperform one; 20 OS threads are not automatically better.

### /research/agent-lee/training

Show:
- current local phone model;
- curriculum routing;
- QLoRA;
- DPO;
- external skills vs weight adaptation;
- frozen evaluation requirement;
- training-compute Formula adapter status.

### /research/agent-lee/evidence

Show:
- gate timeline MC-G0 onward;
- experiment IDs;
- receipt hashes;
- current claims by evidence class;
- superseded evidence.

### /research/agent-lee/failures

Public engineering ledger:
- failures;
- root cause;
- repair;
- lesson.

This is important because LeeWay's "No claims without receipts" standard should be visible externally.

## 3. Required evidence labels

Every public claim SHALL render a visible state:

VERIFIED
OBSERVED
INFERRED
PROPOSED
UNVERIFIED
FAILED
BLOCKED
SUPERSEDED

Color is supplemental only. Text labels must remain present for accessibility and screenshots.

## 4. Data source strategy

RapidWebDevelop should not hard-code research numbers into components.

Preferred data path:

GitHub repository
-> versioned public research manifest
-> RapidWebDevelop loader
-> rendered research views

Candidate manifest:

docs/machine-consciousness/public-research-manifest-v0.json

The manifest should include:
- research version;
- source commit;
- gate state;
- experiments;
- metrics;
- receipts;
- claim labels;
- source paths.

## 5. Immutable-source rule

Each published experiment should include:

- repository;
- source commit;
- experiment path;
- receipt path;
- artifact SHA-256 where applicable.

If a result is superseded, the page keeps the old result visible with a SUPERSEDED label and links to the repair.

## 6. Interactive visualizations

Candidate visuals:

1. Cognition loop graph
2. 16x6 Formula matrix animation
3. Belief probability over time
4. Entropy and prediction-error timeline
5. Mechanical emotion mixture radar/bar view
6. Deliberation budget by scenario
7. C0-C6 engineering maturity ladder
8. Parallelism speedup chart
9. Memory representation size chart
10. Gate/receipt timeline
11. Dream/replay decision flow
12. Agent architecture diagram

Visuals must use measured data files whenever measurements are claimed.

## 7. Public claim boundary

RapidWebDevelop may say:

"LeeWay is researching operational machine-awareness mechanisms."

It may say:

"Agent Lee has a deterministic cognition research runtime with measured belief, prediction, workspace and self-model mechanisms."

It may not say:

"Agent Lee is conscious/sentient"

unless a future evidence standard explicitly justifies that claim and independent review supports it.

Current research does not establish subjective experience.

## 8. Production vs research separation

The public site should visibly separate:

PRODUCTION CAPABILITIES
from
RESEARCH CANDIDATES

Example:

Production:
- Phone-local model;
- Device Bridge;
- Agent Lee voice/persona components;
- verified workstation authority lanes.

Research:
- consciousness metrics;
- dream/replay efficacy;
- Formula cognition interpretation;
- 20-worker training scheduling;
- automatic memory compiler integration.

## 9. Privacy/security

Do not publish:
- pairing tokens;
- API keys;
- phone-private paths containing secrets;
- personal memory content;
- private conversations;
- live device identifiers not already intentionally public;
- credential-bearing receipts.

Public receipts should be sanitized or specifically produced for publication.

## 10. Future agent catalog integration

When other LeeWay agents adopt the reference template, RapidWebDevelop can render each agent from a common schema:

agent
- identity
- mission
- persona authority
- maturity gate
- Formula adapter
- skills
- evidence
- experiments
- limitations
- live project

Agent Lee remains the canonical reference implementation.

## 11. Publication acceptance

Before deployment:

- all research pages build from versioned source;
- claim labels render;
- superseded evidence remains visible;
- receipt/source links resolve;
- no secret scanning failures;
- math renders correctly;
- mobile layout passes;
- data values match source artifacts;
- no candidate result is styled as verified;
- RapidWebDevelop page has a visible source commit.

Deployment remains a future gate and is not claimed by this document.
