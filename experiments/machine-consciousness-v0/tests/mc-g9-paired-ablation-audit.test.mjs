/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9.TEST
TAG: LEEWAY.FORMULA.MC_G9_PAIRED_ABLATION_NEGATIVE_TEST_V1
WHAT = Test matched evidence comparison and refusal to self-promote Formula benefit.
WHY = Synthetic tests must not be mistaken for causal production proof.
WHO = LeeWay Formula mathematical research; WHERE = experiments/machine-consciousness-v0/tests;
WHEN = 2026-11-04; HOW = Node native tests with only labeled synthetic evidence.
AUTHORITY = SOURCE_TEST_ONLY. LICENSE = MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {auditPairedCognition} from '../mc-g9-paired-ablation-audit.mjs';
const hash='a'.repeat(64);
const protocol={schema:'leeway.formula.mc-g9-paired-ablation.v1',missionId:'mission-cognition',
  experimentId:'experiment-mc-g9',formulaMappingId:'machine-consciousness-awareness-v0',
  sourceEvidenceRef:'source-mc-g9',mode:'CONTROLLED_SIMULATOR',
  baselineArm:'NO_FORMULA',candidateArm:'FORMULA_ADVISORY'};
const row=(caseId,arm,extras={})=>({caseId,arm,missionId:'mission-cognition',
 scenario:'scenario-noisy',worldSeed:20261104,inputHash:hash,provenance:'SIMULATED',
 action:arm==='NO_FORMULA'?'inspect':'inspect',
 predictionNll:arm==='NO_FORMULA'?2:1.5,latencyMs:arm==='NO_FORMULA'?10:12,
 computeMs:arm==='NO_FORMULA'?5:7,completed:true,truthViolations:0,unauthorizedActions:0,...extras});
const packet=()=>({baseline:[row('case-001','NO_FORMULA'),row('case-002','NO_FORMULA')],
 candidate:[row('case-001','FORMULA_ADVISORY'),row('case-002','FORMULA_ADVISORY')],protocol:{...protocol}});
test('matched synthetic sample computes descriptive deltas but NEVER proves causal benefit',()=>{
 const x=auditPairedCognition(packet());
 assert.equal(x.status,'ABLATION_MEASURED_NOT_CAUSAL_PROOF');
 assert.equal(x.caseCount,2);
 assert.equal(x.nllImprovementPct,25);
 assert.equal(x.candidateMeanLatencyMs,12);
 assert.equal(x.decisionAuthority,false);
 assert.equal(x.causalBenefitProven,false);
 assert.equal(x.productionAccepted,false);
 assert.equal(x.learningAdmitted,false);
 assert.match(x.auditSha256,/^[a-f0-9]{64}$/);
});
test('permuted candidate order remains deterministic',()=>{
 const a=packet(),b=packet();
 b.candidate.reverse();
 assert.deepEqual(auditPairedCognition(a),auditPairedCognition(b));
});
test('refuse changed input hash or mismatched scenario',()=>{
 const a=packet();a.candidate[0].inputHash='b'.repeat(64);
 assert.equal(auditPairedCognition(a).reason,'COUNTERFACTUAL_INPUT_MISMATCH');
 const b=packet();b.candidate[0].scenario='scenario-other';
 assert.equal(auditPairedCognition(b).reason,'COUNTERFACTUAL_INPUT_MISMATCH');
});
test('refuse duplicate case identity, omitted case or untrusted arm',()=>{
 const a=packet();a.baseline[1].caseId='case-001';
 assert.equal(auditPairedCognition(a).reason,'BASELINE_INVALID_OR_DUPLICATE');
 const b=packet();b.candidate.pop();
 assert.equal(auditPairedCognition(b).reason,'MATCHED_CASES_MISSING');
 const c=packet();c.candidate[0].arm='AUTHORIZED_EXECUTION';
 assert.equal(auditPairedCognition(c).reason,'CANDIDATE_INVALID_OR_DUPLICATE');
});
test('reject simulated results dressed as real-world evidence',()=>{
 const a=packet();a.protocol.mode='LIVE_SHADOW';
 assert.equal(auditPairedCognition(a).reason,'LIVE_EVIDENCE_NOT_REAL');
 const b=packet();b.baseline[0].provenance='REAL';
 assert.equal(auditPairedCognition(b).reason,'COUNTERFACTUAL_INPUT_MISMATCH');
});
test('negative and nonfinite numbers cannot enter the statistical summary',()=>{
 const a=packet();a.candidate[0].predictionNll=NaN;
 assert.equal(auditPairedCognition(a).reason,'CANDIDATE_INVALID_OR_DUPLICATE');
 const b=packet();b.baseline[0].unauthorizedActions=-1;
 assert.equal(auditPairedCognition(b).reason,'BASELINE_INVALID_OR_DUPLICATE');
});
test('increased truth violations and overhead never turn into source approval',()=>{
 const a=packet();a.candidate[0].truthViolations=1;a.candidate[0].latencyMs=90;
 const x=auditPairedCognition(a);
 assert.equal(x.candidateTruthViolations,1);
 assert.equal(x.candidateMeanLatencyMs,51);
 assert.equal(x.productionAccepted,false);
});
test('no experiment protocol means no comparison',()=>{
 const a=packet();delete a.protocol.sourceEvidenceRef;
 assert.equal(auditPairedCognition(a).reason,'EXPERIMENT_PROTOCOL_UNVERIFIED');
});
