/*
LEEWAY HEADER — DO NOT REMOVE
WHO: LeeWay Formula maintainers and independent local test operators.
WHAT: Deterministic tests for the unsigned G3 evidence bundle boundary.
WHEN: 2026-11-15; Formula Fabric G3-to-G4 bridge foundation.
WHERE: runtime/canonical/leeway-formula/v1/tests/g3-evidence-bundle-v1.mjs.
HOW: Build a golden Formula-bound observation bundle and assert authority claims fail closed.
WHY: Prove the producer can stage evidence without impersonating Veritas, Receipt Authority, or Learning Ledger.
*/
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { evaluate, GOLDEN_MATRIX } from '../leeway-formula-v1.mjs';
import { createG3EvidenceBundle } from '../g3-evidence-bundle.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const formulaResult = evaluate(GOLDEN_MATRIX);
const input = {
  requestId: randomUUID(),
  producer: 'LEEWAY-DEVICE-BRIDGE',
  target: { repository: 'LEEWAY-DEVICE-BRIDGE', paths: ['api/device-relay.mjs'] },
  formulaResult,
  observation: {
    preStateSha256: digest('before'),
    postStateSha256: digest('after'),
    commandSha256: digest('node --test tests/g3-evidence-bundle-v1.mjs'),
    stdoutSha256: digest('G3 observed'),
    exitCode: 0,
    observedAt: '2026-11-15T06:40:00Z'
  }
};

const bundle = createG3EvidenceBundle(input);
assert.equal(bundle.grade, 'G3_OBSERVED_LOCAL');
assert.equal(bundle.acceptanceVector.structuralReadyForIndependentVeritas, true);
assert.equal(bundle.attestationState, 'PENDING_INDEPENDENT_VERITAS');
assert.equal(bundle.receiptState, 'NOT_CREATED');
assert.equal(bundle.learningLedgerState, 'NOT_ADMITTED');
assert.match(bundle.bundleSha256, /^[a-f0-9]{64}$/);

assert.throws(
  () => createG3EvidenceBundle({ ...input, observation: { ...input.observation, veritasVerdict: 'PASS' } }),
  /G3_SELF_AUTHORITY_FIELD_FORBIDDEN:veritasVerdict/
);
const noChange = createG3EvidenceBundle({ ...input, observation: { ...input.observation, postStateSha256: input.observation.preStateSha256 } });
assert.equal(noChange.acceptanceVector.structuralReadyForIndependentVeritas, false);
console.log('PASS g3 evidence bundle is unsigned, Formula-bound, and authority-separated');
