# LeeWay Formula Domain Adapter Contract v1

Domain adapters translate real measured domain observations into the existing canonical `runtime-state-v1` request. They do **not** modify or duplicate the Golden Formula kernel.

## Required mapping identity

Every domain mapping MUST define:

- mapping ID and version;
- domain;
- exactly six ordered dimensions;
- units and directionality;
- observation cadence/window;
- finite calibration range for each dimension or an explicitly pre-quantized matrix;
- source/provenance requirements;
- authorization class;
- calibration evidence/status;
- Veritas acceptance criteria.

## Output

A mapper outputs:

```json
{
  "adapterId": "runtime-state-v1",
  "caller": "<domain adapter>",
  "traceId": "<correlation>",
  "input": {
    "stateRows": [[d1,d2,d3,d4,d5,d6], "... 16 rows total ..."],
    "ranges": [[L1,U1],[L2,U2],[L3,U3],[L4,U4],[L5,U5],[L6,U6]]
  }
}
```

The centralized Formula evaluator performs Q69 normalization and canonical evaluation.

## Hard rules

- Six dimensions are a mapping contract, not arbitrary values chosen per request.
- Ranges must have units and calibration provenance.
- Historical test fixtures are not live task observations.
- A domain mapper may be CANDIDATE before calibration, but numeric task Formula execution must remain NOT_EXECUTED until the mapping is authorized.
- Formula output remains EXECUTED/UNVERIFIED until Veritas accepts the task interpretation and execution evidence.

## Adapter registry

Domain mappings live under `contracts/domain-adapters/` and are referenced by stable mapping identity. Runtime/provider adapters remain owned by Runtime Fabric.

<!-- LEEWAY UNIVERSAL FORMULA GOVERNANCE BEGIN -->

# LeeWay Universal Formula Governance

Authority: Creator and LeeWay Standards.
Formula identity: LEEWAY-FORMULA-v1.0.

The canonical LeeWay Formula is mandatory throughout
the entire LeeWay ecosystem.

Every current and future application, capability,
agent, worker, employee, model, provider, adapter,
automation and integration inherits this requirement.

All applicable interactions, responses, decisions,
actions, revisions, executions, computations, model
inferences, resource allocations, information transfers,
memory operations, storage operations and deployments
must consume the canonical Formula through their
authorized and qualified domain contracts.

Formula availability, documentation, configuration,
health and historical results do not constitute actual
Formula consumption for a new operation.

Recover relevant authorized memory before substantive
work. Preserve identity, provenance, Formula integrity,
authorization, original receipts and verified learning.

Never invent observations, adapter mappings, mathematical
results, execution evidence or independent verification.

No application may bypass applicable Formula governance
by dispatching directly to a provider.

Every new application and capability must demonstrate
applicable Formula consumption before production admission.

Preserve the existing authority hierarchy:

Creator > Standards > Root of Trust > Runtime Fabric >
Agent Lee > Harness > Formula > skills/models/tools >
execution > Veritas > Receipt Authority > Learning Ledger.

Execute the complete engineering loop:

INVESTIGATE > DIAGNOSE > PLAN > IMPLEMENT > TEST >
VALIDATE > REPAIR > RETEST > VERIFY > EVIDENCE >
CHECKPOINT > CONTINUE.

Documentation compliance does not establish executable
enforcement or production admission.

<!-- LEEWAY UNIVERSAL FORMULA GOVERNANCE END -->
