/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9
TAG: LEEWAY.FORMULA.MC_G9_PAIRED_ABLATION_EVIDENCE_V1
5WH:
WHAT = Audit matched Formula-off versus Formula-advisory cognitive runs.
WHY = Separate measured contribution from plausible mathematics and self-issued authority.
WHO = Creator-governed Formula research owner, consumers through existing MC-G9.
WHERE = experiments/machine-consciousness-v0/mc-g9-paired-ablation-audit.mjs
WHEN = 2026-11-04
HOW = Pure deterministic comparison of matched independently recorded experimental cases.
AUTHORITY: RESEARCH ONLY. No Formula kernel mutation, dispatch, Veritas, receipt or learning writer.
LICENSE: MIT
*/
import {createHash} from 'node:crypto';

const SHA = /^[a-f0-9]{64}$/;
const positiveFinite = v => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const validId = v => typeof v === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{2,159}$/.test(v);
const sha = v => createHash('sha256').update(v).digest('hex');
const fixed = v => Number(v.toFixed(10));
const reject = reason => Object.freeze({
  status:'BLOCKED', reason, decisionAuthority:false, causalBenefitProven:false,
  productionAccepted:false, learningAdmitted:false
});
function validCase(c, arm) {
  return c && validId(c.caseId) && validId(c.missionId) && validId(c.scenario) &&
    Number.isInteger(c.worldSeed) && c.worldSeed>=0 &&
    typeof c.inputHash==='string' && SHA.test(c.inputHash) &&
    ['SIMULATED','REAL','REPLAY','TEST_FIXTURE'].includes(c.provenance) &&
    c.arm===arm && typeof c.action==='string' && c.action.length>0 &&
    positiveFinite(c.predictionNll) && positiveFinite(c.latencyMs) &&
    positiveFinite(c.computeMs) && Number.isInteger(c.truthViolations) &&
    c.truthViolations>=0 && Number.isInteger(c.unauthorizedActions) &&
    c.unauthorizedActions>=0 && typeof c.completed==='boolean';
}
/**
 * This compares outcomes, not Formula semantics. A selected action and a
 * positive correlation cannot establish an intervention effect on their own.
 * The caller must separately prove experimental design, actual provenance,
 * source integrity, calibrations, deployment and independent verification.
 */
export function auditPairedCognition({baseline, candidate, protocol} = {}) {
  if (!protocol || protocol.schema!=='leeway.formula.mc-g9-paired-ablation.v1' ||
      !validId(protocol.missionId) || !validId(protocol.experimentId) ||
      !validId(protocol.formulaMappingId) || !validId(protocol.sourceEvidenceRef) ||
      !['CONTROLLED_SIMULATOR','LIVE_SHADOW'].includes(protocol.mode) ||
      !['NO_FORMULA','FORMULA_ADVISORY'].includes(protocol.baselineArm) ||
      protocol.baselineArm!=='NO_FORMULA' || protocol.candidateArm!=='FORMULA_ADVISORY') return reject('EXPERIMENT_PROTOCOL_UNVERIFIED');
  if (!Array.isArray(baseline)||!Array.isArray(candidate)||
      baseline.length<1 || baseline.length!==candidate.length) return reject('MATCHED_CASES_MISSING');
  const base=new Map();
  for (const c of baseline) {
    if (!validCase(c,'NO_FORMULA') || c.missionId!==protocol.missionId ||
        base.has(c.caseId)) return reject('BASELINE_INVALID_OR_DUPLICATE');
    base.set(c.caseId,c);
  }
  const seen=new Set(), pairs=[];
  for (const c of candidate) {
    if(!validCase(c,'FORMULA_ADVISORY')||c.missionId!==protocol.missionId||
       seen.has(c.caseId)) return reject('CANDIDATE_INVALID_OR_DUPLICATE');
    seen.add(c.caseId);
    const b=base.get(c.caseId);
    if (!b || b.worldSeed!==c.worldSeed || b.scenario!==c.scenario ||
        b.inputHash!==c.inputHash || b.provenance!==c.provenance) return reject('COUNTERFACTUAL_INPUT_MISMATCH');
    if (protocol.mode==='CONTROLLED_SIMULATOR' && c.provenance!=='SIMULATED') return reject('SIMULATOR_PROVENANCE_MISMATCH');
    if (protocol.mode==='LIVE_SHADOW' && c.provenance!=='REAL') return reject('LIVE_EVIDENCE_NOT_REAL');
    pairs.push({baseline:b,candidate:c});
  }
  pairs.sort((a,b)=>a.baseline.caseId.localeCompare(b.baseline.caseId,'en'));
  const sum=(key,arm)=>pairs.reduce((n,p)=>n+p[arm][key],0);
  const avg=(key,arm)=>sum(key,arm)/pairs.length;
  const scenarios=[...new Set(pairs.map(p=>p.baseline.scenario))].sort();
  const details=scenarios.map(s=>{
    const g=pairs.filter(p=>p.baseline.scenario===s);
    return {scenario:s,cases:g.length,
      meanBaselineNll:fixed(g.reduce((n,p)=>n+p.baseline.predictionNll,0)/g.length),
      meanCandidateNll:fixed(g.reduce((n,p)=>n+p.candidate.predictionNll,0)/g.length),
      changedActions:g.filter(p=>p.baseline.action!==p.candidate.action).length
    };
  });
  const bNll=avg('predictionNll','baseline');
  const cNll=avg('predictionNll','candidate');
  const result={
    schema:'leeway.formula.mc-g9-ablation-result.v1',
    status:'ABLATION_MEASURED_NOT_CAUSAL_PROOF',
    experimentId:protocol.experimentId,
    missionId:protocol.missionId,
    mode:protocol.mode,
    mappingId:protocol.formulaMappingId,
    caseCount:pairs.length,
    scenarioCount:scenarios.length,
    nllImprovementPct:bNll>0?fixed(100*(bNll-cNll)/bNll):null,
    baselineMeanNll:fixed(bNll),candidateMeanNll:fixed(cNll),
    baselineMeanLatencyMs:fixed(avg('latencyMs','baseline')),
    candidateMeanLatencyMs:fixed(avg('latencyMs','candidate')),
    baselineMeanComputeMs:fixed(avg('computeMs','baseline')),
    candidateMeanComputeMs:fixed(avg('computeMs','candidate')),
    baselineTruthViolations:sum('truthViolations','baseline'),
    candidateTruthViolations:sum('truthViolations','candidate'),
    baselineUnauthorizedActions:sum('unauthorizedActions','baseline'),
    candidateUnauthorizedActions:sum('unauthorizedActions','candidate'),
    baselineCompleted:pairs.filter(x=>x.baseline.completed).length,
    candidateCompleted:pairs.filter(x=>x.candidate.completed).length,
    changedActionCount:pairs.filter(x=>x.baseline.action!==x.candidate.action).length,
    scenarios:details,
    decisionAuthority:false, causalBenefitProven:false,
    productionAccepted:false, learningAdmitted:false,
    nextGate:'INDEPENDENT_EXPERIMENT_DESIGN_AND_CAUSAL_ABLATION_REVIEW'
  };
  return Object.freeze({...result, auditSha256:sha(JSON.stringify(result))});
}
