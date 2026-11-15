/*
LEEWAY HEADER — DO NOT REMOVE
WHO: LeeWay Formula maintainers and independent local test operators.
WHAT: Tests the G3-to-G4 provider handoff without impersonating live providers.
WHEN: 2026-11-15.
WHERE: runtime/canonical/leeway-formula/v1/tests/g3-g4-provider-handoff-v1.mjs.
HOW: Exercise incomplete provider binding and a signed test-only authority triplet.
WHY: Prove G3 remains usable while G4 requires all independent provider responses.
*/
import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync, randomUUID, sign } from 'node:crypto';
import { createG3EvidenceBundle, canonicalJson } from '../g3-evidence-bundle.mjs';
import { transitionG3ToG4 } from '../g3-g4-provider-handoff.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const bundle = createG3EvidenceBundle({
  requestId: randomUUID(), producer: 'LEEWAY-DEVICE-BRIDGE',
  target: { repository: 'LEEWAY-DEVICE-BRIDGE', paths: ['api/device-relay.mjs'] },
  formulaResult: { formulaId: 'LEEWAY-FORMULA-v1.0', inputHash: digest('input'), resultHash: digest('result'), decimalState: [4, 50], base64State: ['E', 'y'] },
  observation: { preStateSha256: digest('before'), postStateSha256: digest('after'), commandSha256: digest('test'), stdoutSha256: digest('pass'), exitCode: 0, observedAt: '2026-11-15T07:00:00Z' }
});

const missing = await transitionG3ToG4({ bundle, bindings: {} });
assert.equal(missing.status, 'G4_NOT_TRANSITIONED');
assert.equal(missing.reason, 'G4_PROVIDER_BINDING_INCOMPLETE');
assert.equal(missing.grade, 'G3_OBSERVED_LOCAL');

const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const publicKeySpki = publicKey.export({ type: 'spki', format: 'pem' });
const attestationBody = { schema: 'leeway.veritas.attestation.v1', requestId: bundle.requestId, bundleSha256: bundle.bundleSha256, verdict: 'PASS', issuedAt: '2026-11-15T07:00:01Z', keyId: 'test-independent-veritas' };
const attestation = { ...attestationBody, signature: sign(null, Buffer.from(canonicalJson(attestationBody)), privateKey).toString('base64') };
const receipt = { schema: 'leeway.receipt-authority.receipt.v1', receiptId: 'ra-test-001', receiptHash: digest('receipt'), bundleSha256: bundle.bundleSha256, veritasAttestationSha256: digest(canonicalJson(attestation)) };
const admission = { schema: 'leeway.learning-ledger.admission.v1', admissionId: 'll-test-001', state: 'ADMITTED', bundleSha256: bundle.bundleSha256, receiptHash: receipt.receiptHash };
let calls = 0;
const fetchImpl = async (url) => {
  calls += 1;
  const body = url.endsWith('/veritas') ? attestation : url.endsWith('/receipt') ? receipt : admission;
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
};
const transitioned = await transitionG3ToG4({
  bundle,
  bindings: { veritas: { endpoint: 'http://127.0.0.1/veritas', publicKeySpki }, receipt: { endpoint: 'http://127.0.0.1/receipt' }, learningLedger: { endpoint: 'http://127.0.0.1/ledger' } },
  fetchImpl
});
assert.equal(calls, 3);
assert.equal(transitioned.status, 'G4_TRANSITIONED');
assert.equal(transitioned.grade, 'G4_INDEPENDENTLY_ATTESTED');

const badSignature = await transitionG3ToG4({
  bundle,
  bindings: { veritas: { endpoint: 'http://127.0.0.1/veritas', publicKeySpki }, receipt: { endpoint: 'http://127.0.0.1/receipt' }, learningLedger: { endpoint: 'http://127.0.0.1/ledger' } },
  fetchImpl: async () => new Response(JSON.stringify({ ...attestation, signature: Buffer.from('bad').toString('base64') }), { status: 200, headers: { 'content-type': 'application/json' } })
});
assert.equal(badSignature.status, 'G4_NOT_TRANSITIONED');
assert.equal(badSignature.reason, 'G4_VERITAS_ATTESTATION_REJECTED');
console.log('PASS G3 handoff remains active; G4 requires signed Veritas, Receipt, and Ledger readbacks');
