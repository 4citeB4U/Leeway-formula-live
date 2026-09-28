# Portable Formula consumers

Formula identity belongs to verified source bytes and contracts, not a drive letter. A consumer only needs an authorized HTTP endpoint. Source directories, runtime startup and receipt storage belong to the host deployment. Do not restore obsolete D-drive paths by creating empty directories or replacement secrets.

Discovery order in `scripts/formula-client.mjs` is an explicit `baseUrl`, then `LEEWAY_FORMULA_BASE_URL`, then the local compatibility endpoint `http://127.0.0.1:4001`. In containers, localhost means that container; set the endpoint to an authorized reachable host. Remote transport and authorization must be provided by the deployment. The client does not provision credentials or infer permission from connectivity.

```javascript
import { createFormulaClient } from './scripts/formula-client.mjs';
const client = createFormulaClient();
const diagnostic = await client.health();
// Health verifies returned identity and diagnostic flags, not a task decision.
// Only continue with real authorized observations and their verified mapping.
const evidence = await client.evaluate(request, {
  source: 'measurement source and observation interval',
  mapping: 'approved mapping identity/version and units',
  authorization: 'task authorization reference'
});
```

`request` follows [the request schema](../contracts/evaluate-request.schema.json). `raw-base64-v1` accepts a 16×6 integer matrix in 0..69. `runtime-state-v1` accepts 16×6 observations plus six increasing finite ranges, or a canonical matrix alongside the observations. The client deliberately rejects coercible strings and malformed numbers. The runtime remains the authoritative adapter and evaluator.

The health gate expects `formula = LEEWAY-FORMULA-v1.0`, `status = LEEWAY_FORMULA_V1_PASS`, and true golden/spec/adapter checks. This is an identity assertion from the selected endpoint; source-hash and deployment provenance must be independently verified before trusting that endpoint. A successful evaluation preserves the returned input/result hashes and receipt path. The consumer labels it EXECUTED and UNVERIFIED: receipt existence, mathematical replay, task validity and Veritas acceptance remain separate checks. A receipt path can be host-local; it is not automatically a downloadable URL.

## LLM and skill consumers

An LLM may invoke this same consumer with measured, authorized input. Neither this client nor the existing two adapters converts a conversation into validated mathematical scores. Golden input is a diagnostic fixture, not evidence that a user question was evaluated. Conversation-specific scoring requires a separately recovered or approved mapping, calibrated dimensions and outcome validation. Until then, use the Formula Funnel for context/evidence governance and report numeric task evaluation as NOT_EXECUTED.

## Tests

Run `node --test tests/formula-client.test.mjs`. Tests start ephemeral loopback mock servers and verify request transmission, the identity gate, validation and evidence boundaries. Their outputs are transport-test fixtures, not canonical Formula evaluations or ecosystem binding receipts.
