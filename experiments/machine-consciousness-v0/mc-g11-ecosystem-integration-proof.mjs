#!/usr/bin/env node
/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G11_VALIDATOR
WHAT = Deterministically validate MC-G11 evidence invariants without creating provider success
WHY = Reject incomplete, simulated, LLM-dependent or self-asserted integration proof packets
WHO = Leeway Industries / Creator-authorized Agent Lee research runtimes
WHERE = experiments/machine-consciousness-v0/mc-g11-ecosystem-integration-proof.mjs
WHEN = 2026-10-02 onward
HOW = Parse one JSON evidence packet, test hard invariants, emit PASS/FAIL to stdout only
*/

import fs from 'node:fs';
import crypto from 'node:crypto';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node mc-g11-ecosystem-integration-proof.mjs <proof.json>');
  process.exit(2);
}
const raw = fs.readFileSync(file, 'utf8');
const p = JSON.parse(raw);
const failures = [];
const required = ['proof_id','timestamp','source_class','cognition','policy','capability','execution','observation','veritas','receipts','llm_boundary','production_efficiency','classification'];
for (const k of required) if (!(k in p)) failures.push('MISSING_'+k.toUpperCase());

const hash64 = v => typeof v === 'string' && /^[a-f0-9]{64}$/i.test(v);
if (!hash64(p?.cognition?.state_hash)) failures.push('BAD_COGNITION_STATE_HASH');
if (!hash64(p?.execution?.request_hash)) failures.push('BAD_EXECUTION_REQUEST_HASH');

const llm = p?.llm_boundary || {};
for (const k of [
  'cognition_kernel_llm_required',
  'policy_selection_llm_used',
  'capability_selection_llm_used',
  'execution_authority_llm_used',
  'result_verification_llm_used',
  'learning_admission_llm_used'
]) if (llm[k] !== false) failures.push('LLM_BOUNDARY_'+k.toUpperCase());

if (!Array.isArray(p?.policy?.candidates) || p.policy.candidates.length < 1) failures.push('NO_POLICY_CANDIDATES');
if (!p?.policy?.selected) failures.push('NO_SELECTED_POLICY');
if (!p?.capability?.manifold_ref) failures.push('NO_MANIFOLD_REF');
if (!p?.capability?.orchestrator_ref) failures.push('NO_ORCHESTRATOR_REF');
if (!Array.isArray(p?.capability?.focal_execution_set) || p.capability.focal_execution_set.length < 1) failures.push('NO_FOCAL_EXECUTION_SET');
if (!p?.capability?.tool_gateway_ref) failures.push('NO_TOOL_GATEWAY_REF');
if (!p?.capability?.canonical_owner) failures.push('NO_CANONICAL_OWNER');
if (p?.execution?.executed !== true) failures.push('REAL_EXECUTION_NOT_PROVEN');
if (p?.observation?.independent !== true) failures.push('INDEPENDENT_OBSERVATION_NOT_PROVEN');
if (p?.observation?.matches_expected !== true) failures.push('OBSERVED_RESULT_MISMATCH');
if (p?.veritas?.status !== 'PASS') failures.push('VERITAS_NOT_PASS');
if (!Array.isArray(p?.receipts) || p.receipts.length < 1) failures.push('NO_RECEIPT_REFERENCE');
if (p?.production_efficiency?.duplicated_components_created !== 0) failures.push('DUPLICATE_COMPONENT_CREATED');

const packetHash = crypto.createHash('sha256').update(raw).digest('hex');
const result = {
  gate: 'MC-G11',
  packetHash,
  status: failures.length ? 'FAIL' : 'PASS',
  failures
};
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
process.exit(failures.length ? 1 : 0);
