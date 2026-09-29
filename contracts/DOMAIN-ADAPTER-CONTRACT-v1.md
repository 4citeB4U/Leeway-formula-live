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
