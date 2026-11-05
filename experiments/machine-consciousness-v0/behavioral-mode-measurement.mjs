/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9.BEHAVIOR
TAG: LEEWAY.FORMULA.MC_G9_BEHAVIORAL_MODE_MEASUREMENT_V1
5WH: WHO = Creator-governed Formula research; WHAT = Describe sleep/rest/dream/flow/inner thought behavior;
WHY = Test the Creator's dual inner-cognitive and bounded autonomous-body analogy without inventing authority;
WHERE = experiments/machine-consciousness-v0/behavioral-mode-measurement.mjs;
WHEN = 2026-11-04; HOW = Pure finite mathematical measurements and fail-closed typed intent proposal.
AUTHORITY = RESEARCH_OBSERVATION_ONLY. No clocks, autonomous action, Veritas, memory or Formula grants.
LICENSE: MIT
*/
import {createHash} from 'node:crypto';
const sha = x => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const id = x => typeof x==='string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{2,159}$/.test(x);
const hash = x => typeof x==='string' && /^[a-f0-9]{64}$/.test(x);
const finite = x => typeof x==='number' && Number.isFinite(x);
const ratio = x => finite(x) && x>=0 && x<=1;
const deny = reason => Object.freeze({status:'BLOCKED',reason,actionAuthorized:false,
  verifiedLearning:false,liveModeSelected:false});
export const BEHAVIORAL_MODES = Object.freeze([
  'FOREGROUND_DELIBERATION','FLOW_CANDIDATE','IDLE_CONSOLIDATION','OFFLINE_DREAM_REPLAY'
]);
/**
 * Only operational measurements; human sleep stages, emotion and subjective
 * thought must NOT be inferred from these machine measurements.
 */
export function measureBehavioralState({
  missionId,cycleStateHash,observationProvenance,metrics,resources
}={}) {
  if(!id(missionId)||!hash(cycleStateHash)||
     !['REAL','SIMULATED','REPLAY','TEST_FIXTURE'].includes(observationProvenance))return deny('OBSERVATION_PROVENANCE_INVALID');
  if(!metrics || !ratio(metrics.uncertainty)||!ratio(metrics.predictionMismatch)||
     !ratio(metrics.taskFamiliarity)||!ratio(metrics.novelty)||
     !ratio(metrics.urgency)||!ratio(metrics.risk)||
     !ratio(metrics.workspaceAccess)||
     !resources || !ratio(resources.computePressure)||
     !ratio(resources.memoryPressure)||!ratio(resources.energyPressure)||
     !ratio(resources.foregroundDemand))return deny('MEASUREMENTS_INVALID_OR_UNCALIBRATED');
  // No invented weighted score or transition threshold. Values remain
  // independently inspectable until original Formula calibration and MC-G9.
  const state={schema:'leeway.formula.mc-g9.behavioral-observation.v1',
    status:'OBSERVATION_ONLY_NO_BEHAVIORAL_AUTHORITY',
    missionId,cycleStateHash,observationProvenance,
    cognitive:{uncertainty:metrics.uncertainty,predictionMismatch:metrics.predictionMismatch,
      taskFamiliarity:metrics.taskFamiliarity,novelty:metrics.novelty,urgency:metrics.urgency,
      risk:metrics.risk,workspaceAccess:metrics.workspaceAccess},
    interoception:{computePressure:resources.computePressure,memoryPressure:resources.memoryPressure,
      energyPressure:resources.energyPressure,foregroundDemand:resources.foregroundDemand},
    formulaExecution:'NOT_EXECUTED',
    modeSelected:null,actionAuthorized:false,verifiedLearning:false,liveModeSelected:false};
  return Object.freeze({...state,observationHash:sha(state)});
}
/** An inner thought is a structured internal candidate, not a self-issued
 * authority, another Agent Lee, or proof of internal subjective experience. */
export function stageInnerThought({
  observation,thoughtId,parentMissionId,kind,beliefHypothesis,sourceRefs=[]
}={}) {
  if(observation?.status!=='OBSERVATION_ONLY_NO_BEHAVIORAL_AUTHORITY'||
     !id(thoughtId)||parentMissionId!==observation.missionId||
     !['QUESTION','PREDICTION','COUNTERFACTUAL','REPAIR_HYPOTHESIS'].includes(kind)||
     typeof beliefHypothesis!=='string'||!beliefHypothesis.trim()||
     !Array.isArray(sourceRefs)||!sourceRefs.every(id))
    return deny('INNER_THOUGHT_INVALID');
  const candidate={schema:'leeway.formula.mc-g9.inner-thought.v1',
    provenance:observation.observationProvenance,
    status:'UNVERIFIED_PRIVATE_CANDIDATE',thoughtId,parentMissionId,kind,
    beliefHypothesis,sourceObservationHash:observation.observationHash,
    sourceRefs:[...sourceRefs],
    spoken:false,externalFact:false,actionAuthorized:false,verifiedLearning:false};
  return Object.freeze({...candidate,thoughtHash:sha(candidate)});
}
/** Flow and dream requests are observations of a proposed mode. Existing
 * Runtime must grant every real action; no state threshold can override it. */
export function stageBehavioralMode({observation,requestedMode,sourceReceiptHash,
  candidateId, replayPriority}={}) {
  if(observation?.status!=='OBSERVATION_ONLY_NO_BEHAVIORAL_AUTHORITY'||
     !BEHAVIORAL_MODES.includes(requestedMode)||!id(candidateId)||!hash(sourceReceiptHash))
    return deny('MODE_CANDIDATE_INVALID');
  if(requestedMode==='OFFLINE_DREAM_REPLAY' &&
     (!replayPriority||!finite(replayPriority.gain)||replayPriority.gain<0||
     !finite(replayPriority.need)||replayPriority.need<0))
    return deny('REPLAY_PRIORITY_INVALID');
  const priority=requestedMode==='OFFLINE_DREAM_REPLAY'
    ? replayPriority.gain*replayPriority.need:null;
  if(priority!==null&&!finite(priority))return deny('REPLAY_PRIORITY_NONFINITE');
  const candidate={schema:'leeway.formula.mc-g9.behavioral-candidate.v1',
    status:'UNAUTHORIZED_RESEARCH_MODE_CANDIDATE',candidateId,
    missionId:observation.missionId,sourceObservationHash:observation.observationHash,
    requestedMode,sourceReceiptHash,
    priorityEVB:priority,
    observationProvenance:observation.observationProvenance,
    replayProvenance:requestedMode==='OFFLINE_DREAM_REPLAY'?'SIMULATED_DREAM':null,
    changesExternalWorld:false,advancesExternalTime:false,
    authorityClass:'NO_NATIVE_DISPATCH',
    actionAuthorized:false,verifiedLearning:false,liveModeSelected:false};
  return Object.freeze({...candidate,candidateHash:sha(candidate)});
}
