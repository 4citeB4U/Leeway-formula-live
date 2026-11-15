/*
LEEWAY HEADER — DO NOT REMOVE
WHO: LeeWay Formula maintainers and Creator-authorized runtime operators.
WHAT: Canonical unsigned G3 evidence bundle and Layer 7 acceptance-vector builder.
WHEN: 2026-11-15; after bounded local observation and before independent Veritas.
WHERE: runtime/canonical/leeway-formula/v1/g3-evidence-bundle.mjs.
HOW: Validate immutable observation facts, bind them to Formula output, and hash canonical JSON.
WHY: Carry honest G3 evidence across the authority boundary without minting a verdict, receipt, or ledger admission.
*/
import { createHash } from 'node:crypto';

const HEX_256 = /^[a-f0-9]{64}$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FORBIDDEN_SELF_AUTHORITY_FIELDS = new Set([
  'veritasVerdict', 'veritasSignature', 'receiptId', 'receiptSignature', 'learningAdmission', 'g4Status'
]);

function fail(code) {
  throw new Error(code);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requiredText(value, code) {
  if (typeof value !== 'string' || value.trim().length === 0) fail(code);
  return value;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (isPlainObject(value)) {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function requireSha256(value, code) {
  if (typeof value !== 'string' || !HEX_256.test(value)) fail(code);
  return value.toLowerCase();
}

function rejectSelfAuthorityClaims(value) {
  if (Array.isArray(value)) {
    for (const item of value) rejectSelfAuthorityClaims(item);
    return;
  }
  if (isPlainObject(value)) {
    for (const [key, nested] of Object.entries(value)) {
      if (FORBIDDEN_SELF_AUTHORITY_FIELDS.has(key)) fail(`G3_SELF_AUTHORITY_FIELD_FORBIDDEN:${key}`);
      rejectSelfAuthorityClaims(nested);
    }
  }
}

function validateFormulaResult(formulaResult) {
  if (!isPlainObject(formulaResult)) fail('G3_FORMULA_RESULT_REQUIRED');
  return Object.freeze({
    formulaId: requiredText(formulaResult.formulaId, 'G3_FORMULA_ID_REQUIRED'),
    ...(formulaResult.executionId ? { executionId: requiredText(formulaResult.executionId, 'G3_FORMULA_EXECUTION_ID_REQUIRED') } : {}),
    inputHash: requireSha256(formulaResult.inputHash, 'G3_FORMULA_INPUT_HASH_INVALID'),
    resultHash: requireSha256(formulaResult.resultHash, 'G3_FORMULA_RESULT_HASH_INVALID'),
    decimalState: Array.isArray(formulaResult.decimalState) ? [...formulaResult.decimalState] : fail('G3_FORMULA_DECIMAL_STATE_REQUIRED'),
    base64State: Array.isArray(formulaResult.base64State) ? [...formulaResult.base64State] : fail('G3_FORMULA_BASE64_STATE_REQUIRED')
  });
}

function validateObservation(observation) {
  if (!isPlainObject(observation)) fail('G3_OBSERVATION_REQUIRED');
  rejectSelfAuthorityClaims(observation);
  if (!Number.isInteger(observation.exitCode)) fail('G3_EXIT_CODE_REQUIRED');
  return Object.freeze({
    preStateSha256: requireSha256(observation.preStateSha256, 'G3_PRESTATE_HASH_INVALID'),
    postStateSha256: requireSha256(observation.postStateSha256, 'G3_POSTSTATE_HASH_INVALID'),
    commandSha256: requireSha256(observation.commandSha256, 'G3_COMMAND_HASH_INVALID'),
    stdoutSha256: requireSha256(observation.stdoutSha256, 'G3_STDOUT_HASH_INVALID'),
    exitCode: observation.exitCode,
    operationKind: observation.operationKind === 'READ' ? 'READ' : 'MUTATE',
    observedAt: requiredText(observation.observedAt, 'G3_OBSERVED_AT_REQUIRED')
  });
}

function validateTarget(target) {
  if (!isPlainObject(target)) fail('G3_TARGET_REQUIRED');
  const paths = Array.isArray(target.paths) ? target.paths.map(path => requiredText(path, 'G3_TARGET_PATH_INVALID')) : fail('G3_TARGET_PATHS_REQUIRED');
  if (paths.length === 0) fail('G3_TARGET_PATHS_REQUIRED');
  return Object.freeze({ repository: requiredText(target.repository, 'G3_TARGET_REPOSITORY_REQUIRED'), paths });
}

export function createLayer7AcceptanceVector({ requestId, formulaResult, observation }) {
  if (typeof requestId !== 'string' || !UUID.test(requestId)) fail('G3_REQUEST_ID_INVALID');
  const formula = validateFormulaResult(formulaResult);
  const observed = validateObservation(observation);
  const structuralReady = observed.exitCode === 0 && (observed.operationKind === 'READ'
    ? observed.preStateSha256 === observed.postStateSha256 : observed.preStateSha256 !== observed.postStateSha256);
  return Object.freeze({
    schema: 'leeway.formula.layer7.acceptance-vector.v1',
    requestId,
    formula,
    observation: {
      preStateSha256: observed.preStateSha256,
      postStateSha256: observed.postStateSha256,
      commandSha256: observed.commandSha256,
      stdoutSha256: observed.stdoutSha256,
      exitCode: observed.exitCode,
      operationKind: observed.operationKind,
      observedAt: observed.observedAt
    },
    structuralReadyForIndependentVeritas: structuralReady,
    authorityState: 'PENDING_INDEPENDENT_VERITAS',
    receiptState: 'NOT_CREATED',
    learningLedgerState: 'NOT_ADMITTED'
  });
}

export function createG3EvidenceBundle({ requestId, target, formulaResult, observation, producer }) {
  rejectSelfAuthorityClaims({ requestId, target, formulaResult, observation, producer });
  const acceptedTarget = validateTarget(target);
  const acceptanceVector = createLayer7AcceptanceVector({ requestId, formulaResult, observation });
  const unsigned = {
    schema: 'leeway.g3-evidence-bundle.v1',
    requestId,
    grade: 'G3_OBSERVED_LOCAL',
    producer: requiredText(producer, 'G3_PRODUCER_REQUIRED'),
    target: acceptedTarget,
    acceptanceVector,
    attestationState: 'PENDING_INDEPENDENT_VERITAS',
    receiptState: 'NOT_CREATED',
    learningLedgerState: 'NOT_ADMITTED'
  };
  return Object.freeze({ ...unsigned, bundleSha256: sha256(canonicalJson(unsigned)) });
}
