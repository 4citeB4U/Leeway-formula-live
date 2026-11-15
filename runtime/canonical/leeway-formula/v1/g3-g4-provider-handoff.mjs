/*
LEEWAY HEADER — DO NOT REMOVE
WHO: LeeWay Formula, Device Bridge, and separately governed authority providers.
WHAT: Typed G3 evidence handoff and conditional G4 transition client.
WHEN: 2026-11-15; after Formula-bound G3 observation and before any G4 claim.
WHERE: runtime/canonical/leeway-formula/v1/g3-g4-provider-handoff.mjs.
HOW: Validate the unsigned G3 bundle, call explicitly bound providers, verify the
     independent Veritas signature, then require Receipt and Ledger readbacks.
WHY: Keep the road alive for evidence while refusing an unproven G4 promotion.
*/
import { createHash, verify } from 'node:crypto';
import { canonicalJson } from './g3-evidence-bundle.mjs';

const HEX_256 = /^[a-f0-9]{64}$/i;
const ABSOLUTE_ENDPOINT = /^(https:|http:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/)/i;

/** @typedef {{ endpoint: string, publicKeySpki?: string }} ProviderBinding */
/** @typedef {{ veritas?: ProviderBinding, receipt?: ProviderBinding, learningLedger?: ProviderBinding }} ProviderBindings */

function fail(code) { throw new Error(code); }
function isObject(value) { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function isSha256(value) { return typeof value === 'string' && HEX_256.test(value); }
function digest(value) { return createHash('sha256').update(value).digest('hex'); }

function validateEndpoint(binding, name, needsKey = false) {
  if (!isObject(binding) || typeof binding.endpoint !== 'string' || !ABSOLUTE_ENDPOINT.test(binding.endpoint)) return null;
  if (needsKey && (typeof binding.publicKeySpki !== 'string' || !binding.publicKeySpki.includes('BEGIN PUBLIC KEY'))) return null;
  return Object.freeze({ endpoint: binding.endpoint, ...(needsKey ? { publicKeySpki: binding.publicKeySpki } : {}) });
}

function providerAvailability(bindings = {}) {
  return Object.freeze({
    veritas: Boolean(validateEndpoint(bindings.veritas, 'veritas', true)),
    receipt: Boolean(validateEndpoint(bindings.receipt, 'receipt')),
    learningLedger: Boolean(validateEndpoint(bindings.learningLedger, 'learningLedger'))
  });
}

function validateG3Bundle(bundle) {
  if (!isObject(bundle) || bundle.schema !== 'leeway.g3-evidence-bundle.v1' || bundle.grade !== 'G3_OBSERVED_LOCAL') fail('G4_G3_BUNDLE_INVALID');
  if (bundle.attestationState !== 'PENDING_INDEPENDENT_VERITAS' || bundle.receiptState !== 'NOT_CREATED' || bundle.learningLedgerState !== 'NOT_ADMITTED') fail('G4_G3_AUTHORITY_STATE_INVALID');
  const { bundleSha256, ...unsigned } = bundle;
  if (!isSha256(bundleSha256) || digest(canonicalJson(unsigned)) !== bundleSha256) fail('G4_G3_BUNDLE_HASH_INVALID');
  return bundle;
}

function pending(bundle, availability, reason) {
  return Object.freeze({
    schema: 'leeway.g4-transition-result.v1',
    status: 'G4_NOT_TRANSITIONED',
    reason,
    grade: 'G3_OBSERVED_LOCAL',
    requestId: bundle.requestId,
    bundleSha256: bundle.bundleSha256,
    providerAvailability: availability,
    attestationState: 'PENDING_INDEPENDENT_VERITAS',
    receiptState: 'NOT_CREATED',
    learningLedgerState: 'NOT_ADMITTED'
  });
}

async function postJson(fetchImpl, endpoint, body) {
  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000)
    });
  } catch {
    return { ok: false, reason: 'PROVIDER_TRANSPORT_UNAVAILABLE' };
  }
  if (!response.ok) return { ok: false, reason: `PROVIDER_HTTP_${response.status}` };
  try { return { ok: true, body: await response.json() }; }
  catch { return { ok: false, reason: 'PROVIDER_RESPONSE_INVALID_JSON' }; }
}

function signedAttestationBody(attestation) {
  const { signature, ...body } = attestation;
  return body;
}

function validateAttestation(attestation, bundle, publicKeySpki) {
  if (!isObject(attestation) || attestation.schema !== 'leeway.veritas.attestation.v1' || attestation.requestId !== bundle.requestId || attestation.bundleSha256 !== bundle.bundleSha256 || attestation.verdict !== 'PASS' || typeof attestation.signature !== 'string') return null;
  const signed = Buffer.from(canonicalJson(signedAttestationBody(attestation)), 'utf8');
  let signature;
  try { signature = Buffer.from(attestation.signature, 'base64'); }
  catch { return null; }
  try {
    if (!verify(null, signed, publicKeySpki, signature)) return null;
  } catch { return null; }
  return Object.freeze(attestation);
}

function validateReceipt(receipt, bundle, attestation) {
  if (!isObject(receipt) || receipt.schema !== 'leeway.receipt-authority.receipt.v1' || typeof receipt.receiptId !== 'string' || !isSha256(receipt.receiptHash) || receipt.bundleSha256 !== bundle.bundleSha256 || receipt.veritasAttestationSha256 !== digest(canonicalJson(attestation))) return null;
  return Object.freeze(receipt);
}

function validateLedgerAdmission(admission, bundle, receipt) {
  if (!isObject(admission) || admission.schema !== 'leeway.learning-ledger.admission.v1' || typeof admission.admissionId !== 'string' || admission.state !== 'ADMITTED' || admission.bundleSha256 !== bundle.bundleSha256 || admission.receiptHash !== receipt.receiptHash) return null;
  return Object.freeze(admission);
}

/**
 * Performs a live authority handoff only when all three endpoints are explicitly
 * bound. An unbound or failing provider preserves G3 and returns its exact stage;
 * it never turns a missing provider into a fabricated G4 refusal or approval.
 *
 * @param {{ bundle: object, bindings: ProviderBindings, fetchImpl?: typeof fetch }} input
 */
export async function transitionG3ToG4({ bundle, bindings, fetchImpl = fetch } = {}) {
  const accepted = validateG3Bundle(bundle);
  const availability = providerAvailability(bindings);
  if (!availability.veritas || !availability.receipt || !availability.learningLedger) return pending(accepted, availability, 'G4_PROVIDER_BINDING_INCOMPLETE');
  if (typeof fetchImpl !== 'function') return pending(accepted, availability, 'G4_FETCH_UNAVAILABLE');

  const veritas = validateEndpoint(bindings.veritas, 'veritas', true);
  const receiptAuthority = validateEndpoint(bindings.receipt, 'receipt');
  const ledger = validateEndpoint(bindings.learningLedger, 'learningLedger');
  const veritasResponse = await postJson(fetchImpl, veritas.endpoint, {
    schema: 'leeway.veritas.attestation-request.v1', evidenceBundle: accepted
  });
  if (!veritasResponse.ok) return pending(accepted, availability, `G4_VERITAS_${veritasResponse.reason}`);
  const attestation = validateAttestation(veritasResponse.body, accepted, veritas.publicKeySpki);
  if (!attestation) return pending(accepted, availability, 'G4_VERITAS_ATTESTATION_REJECTED');

  const receiptResponse = await postJson(fetchImpl, receiptAuthority.endpoint, {
    schema: 'leeway.receipt-authority.append-request.v1', evidenceBundle: accepted, veritasAttestation: attestation
  });
  if (!receiptResponse.ok) return pending(accepted, availability, `G4_RECEIPT_${receiptResponse.reason}`);
  const receipt = validateReceipt(receiptResponse.body, accepted, attestation);
  if (!receipt) return pending(accepted, availability, 'G4_RECEIPT_READBACK_REJECTED');

  const ledgerResponse = await postJson(fetchImpl, ledger.endpoint, {
    schema: 'leeway.learning-ledger.admission-request.v1', evidenceBundle: accepted, receipt
  });
  if (!ledgerResponse.ok) return pending(accepted, availability, `G4_LEDGER_${ledgerResponse.reason}`);
  const admission = validateLedgerAdmission(ledgerResponse.body, accepted, receipt);
  if (!admission) return pending(accepted, availability, 'G4_LEDGER_READBACK_REJECTED');

  return Object.freeze({
    schema: 'leeway.g4-transition-result.v1',
    status: 'G4_TRANSITIONED',
    grade: 'G4_INDEPENDENTLY_ATTESTED',
    requestId: accepted.requestId,
    bundleSha256: accepted.bundleSha256,
    providerAvailability: availability,
    attestationState: 'INDEPENDENT_VERITAS_PASS',
    receiptState: 'READBACK_CONFIRMED',
    learningLedgerState: 'ADMITTED',
    attestation,
    receipt,
    admission
  });
}
