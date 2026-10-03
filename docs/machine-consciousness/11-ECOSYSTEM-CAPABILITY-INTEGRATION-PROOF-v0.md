<!--
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G11_ECOSYSTEM_PROOF

5WH:
WHAT = Define the falsifiable integration proof that LeeWay Machine Consciousness can select and execute existing LeeWay ecosystem capabilities without requiring an LLM in the cognition loop
WHY = Prove reuse of the existing LeeWay capability/runtime fabric instead of creating duplicate capability systems
WHO = Leeway Industries / Creator-authorized Agent Lee research runtimes
WHERE = docs/machine-consciousness/11-ECOSYSTEM-CAPABILITY-INTEGRATION-PROOF-v0.md
WHEN = 2026-10-02 onward
HOW = Existing M07 Action Dispatcher -> Universal Capability Kernel -> Skill Orchestrator -> Tool Gateway -> existing provider/runtime -> observed result -> Veritas -> cognition receipt

AGENTS:
ASSESS
AUDIT
DESIGN
EXECUTE
VERIFY

LICENSE:
MIT
-->

# MC-G11 — LeeWay Ecosystem Capability Integration Proof v0

Status: BUILD-READY / NOT YET EXECUTED  
Project: LeeWay Machine Consciousness  
Kernel constraint: NON-LLM cognition kernel  
Formula authority: LEEWAY-FORMULA-v1.0 remains frozen  
Purpose: prove integration by reusing existing LeeWay authorities and capabilities.

## Scientific question

Can the existing LeeWay Machine Consciousness choose an authorized action and cause one already-existing LeeWay ecosystem capability to execute, observe the real result, and close the cycle through Veritas and a cognition receipt with no LLM required for cognition, policy selection, capability selection, execution authority, result evaluation, or learning admission?

## Null and alternative hypotheses

H0: Machine Consciousness cannot complete the governed LeeWay execution path without an LLM or a newly invented parallel capability layer.

H1: Machine Consciousness can complete the governed LeeWay execution path using the existing LeeWay capability/runtime fabric while the cognition loop remains non-LLM.

A PASS rejects H0 only for the tested capability, runtime, host, versions and evidence packet. It does not establish universal capability coverage.

## Existing authorities to reuse

1. Machine Consciousness M07 Action Dispatcher, M10 Memory Fabric, M11 Global Workspace, M12 Self-Model and M15 Veritas/Receipt:
   - docs/machine-consciousness/01-MASTER-PLAN-v0.md
   - observed source blob before this protocol: bd16d5d813bdab15116206385632d640e4f66d26
2. Machine Consciousness Formula domain adapter:
   - contracts/domain-adapters/machine-consciousness-awareness-v0.json
   - observed source blob before this protocol: 8dc050ae9fc66016a338a72e59c00ca43566e3df
3. LeeWay Universal Capability Kernel and capability manifold:
   - 4citeB4U/LeeWay-Agent-Skills
   - skills/leeway-universal-capability-kernel/SKILL.md
   - config/leeway-capability-manifold.yaml
4. LeeWay Skill Orchestrator:
   - 4citeB4U/LeeWay-Agent-Skills
   - skills/leeway-skill-orchestrator/SKILL.md
5. LeeWay Tool Gateway:
   - 4citeB4U/LeeWay-Agent-Skills
   - skills/leeway-tool-gateway/SKILL.md
6. Runtime/receipt authority:
   - 4citeB4U/Leeway-Runtime-Fabric
7. Candidate first real capability:
   - Device: 4citeB4U/LEEWAY-DEVICE-BRIDGE
   - Voice: 4citeB4U/LeeWay-Voice-Fabric

Do not create a duplicate Runtime Fabric, Formula kernel, capability registry, Skill Orchestrator, Tool Gateway, Agent Lee identity, Veritas authority, receipt ledger or voice/device authority for this gate.

## Required path

```text
REAL USER OR TEST FIXTURE
        |
        v
Machine Consciousness observation/belief/prediction/valuation/policy
        |
        v
M07 Action Dispatcher
        |
        v
Universal Capability Kernel
        |
        v
Skill Orchestrator
        |
        v
TASK_CAPABILITY_WEAVE
        |
        v
FOCAL_EXECUTION_SET
        |
        v
Tool Gateway
        |
        v
EXISTING LeeWay capability provider/runtime
        |
        v
Observed external/runtime result
        |
        v
Result Evaluator
        |
        v
Veritas
        |
        v
Cognition receipt + existing receipt/evidence authority
        |
        v
Governed learning admission
```

## First proof case

Use one bounded capability that already has prior LeeWay evidence.

Preferred first case: Device Bridge calculator control.

Requested action:
- open calculator;
- enter 2 + 2;
- observe the displayed result;
- verify the displayed result equals 4;
- return Home.

Reason:
- prior qualified evidence exists in LEEWAY-DEVICE-BRIDGE;
- the result is externally observable;
- the action is bounded;
- success and failure are unambiguous;
- no natural-language model is required to compute or verify 2 + 2.

Fallback proof case:
- Voice Fabric speaks one fixed, predeclared sentence;
- owner/runtime evidence must verify that the intended provider executed and audio output occurred;
- audibility confirmation alone is not sufficient to prove every voice route.

## Non-LLM boundary

For MC-G11 PASS, the evidence packet must record:
- cognition_kernel_llm_required = false;
- policy_selection_llm_used = false;
- capability_selection_llm_used = false;
- execution_authority_llm_used = false;
- result_verification_llm_used = false;
- learning_admission_llm_used = false.

An LLM may not silently provide any of these functions during the proof.

Optional UI explanation after the proof is outside the cognition claim and must be marked separately.

## Required evidence packet

The machine-readable packet must conform to:
`contracts/machine-consciousness/ecosystem-capability-proof-v0.schema.json`

Minimum evidence:
- proof_id;
- timestamp;
- source_class;
- cognition cycle/state hash;
- policy candidates and selected policy;
- action request;
- authority decision;
- capability manifold reference;
- Skill Orchestrator decision;
- focal execution set;
- Tool Gateway route;
- provider/runtime identity and version/hash when available;
- execution request hash;
- real execution result;
- independent observation of result;
- Veritas status;
- receipt references/hashes;
- LLM-use declaration for every governed stage;
- failure boundary when any stage fails.

## PASS criteria

MC-G11 PASS requires all of the following:

1. Same declared Machine Consciousness policy inputs reproduce the same selected bounded policy under the same deterministic configuration.
2. Capability selection resolves through existing LeeWay Agent Skills authorities rather than a new parallel registry.
3. The selected capability has a canonical owner and provider/runtime reference.
4. A real provider/runtime executes the requested action.
5. The observed result is independently captured; generated intent is not treated as result.
6. Veritas accepts the evidence.
7. Receipt/evidence references are preserved.
8. No required cognition/control stage used an LLM.
9. No mock, placeholder, self-authored PASS file or simulated provider result is accepted as real execution.
10. Failure at any stage yields FAIL or BLOCKED with the first failed boundary recorded.

## Failure tests

At minimum perform:
- unavailable provider;
- unauthorized action;
- malformed capability request;
- capability registry/manifold entry without implementation;
- wrong observed result;
- forged success receipt;
- result present but Veritas unavailable;
- LLM-use flag true at any governed cognition/control stage.

Each must fail closed.

## Evidence classification

Before execution: PROPOSED / BUILD-READY  
After source harness creation only: SOURCE_IMPLEMENTED  
After real provider executes: EXECUTED_UNVERIFIED  
After independent Veritas acceptance: VERIFIED

Never skip states.

## Profitability / reuse measurement

MC-G11 must also record production-efficiency evidence:
- reused_components_count;
- new_glue_components_count;
- duplicated_components_created;
- human_interventions;
- manual_steps;
- elapsed_cycle_time_ms where measurable.

Target:
- duplicated_components_created = 0;
- new glue remains smaller than the reused authority/capability surface;
- the proof should graduate into a reusable integration pattern for future LeeWay products.

This is evidence for the LeeWay law:
"Build once. Verify once. Reuse many times."

## Documentation outputs

Every run must update or link:
- experiment log;
- failure/repair ledger when applicable;
- claim register;
- Learning Ledger only after Veritas-qualified reusable learning;
- proof receipt/evidence packet.

No successful or failed run is undocumented.

## Current gate

### MC-G11-A — bounded ecosystem capability

Status: VERIFIED PASS — 2026-10-03 UTC / 2026-10-02 America/Chicago.

Verified capability:
phone-local bounded workspace file write/read through existing LeeWay skill authorities and existing Device Bridge MCP.

Evidence:
- receipt: `receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G11-VERIFIED-20261003.json`;
- verified packet SHA-256: `fee10810d3018bfeb3ec44364b73ef8a2022af4af05a4cd3cc59df149c907deb`;
- Device Bridge write receipt: `a4e0225e867ff898485577d696800dfe5d1198227b229268b1ffbc4192032878`;
- Device Bridge read receipt: `c8b879a0426036bd1df439a1cbc519512d7f9d50a4f757e4e8478bc5a8c5a400`;
- structural MC-G11 validator: PASS;
- governed LLM-use fields: all false.

Production reuse:
7 existing components reused; 1 experiment-level glue harness; 0 duplicated components.

Claim boundary:
MC-G11-A proves one governed ecosystem capability. It does not generalize to all LeeWay capabilities.

### MC-G11-B — Android UI / Calculator

Status: NOT YET EXECUTED through the same governed route.

The prior direct Android VIEW baseline failed and was not promoted. The next UI proof must route through the existing LeeWay capability authorities and the canonical Device Bridge/Pocket execution path, independently observe the Calculator outcome, pass Veritas, and preserve receipts.
