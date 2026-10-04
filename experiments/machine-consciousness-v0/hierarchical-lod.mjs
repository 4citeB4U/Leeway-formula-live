/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.HIERARCHICAL_LOD
5WH:
WHAT = Deterministic LOD selection for capability descriptors and memory shells
WHY = Keep the full LeeWay universe addressable while bounding working execution cost
WHO = Leeway Industries / Creator-authorized Machine Consciousness research runtime
WHERE = experiments/machine-consciousness-v0/hierarchical-lod.mjs
WHEN = MC-G9 spatial/efficiency ablation tranche
HOW = Measured relevance, ambiguity, context support, cost and evidence-protection constraints
AGENTS: ASSESS AUDIT VERIFY
LICENSE: MIT
*/

const finite=v=>Number.isFinite(v);
const clamp01=v=>Math.max(0,Math.min(1,v));

export function semanticRefinementScore({ambiguity,urgency,taskDistance,contextSupport}){
  for(const [k,v] of Object.entries({ambiguity,urgency,taskDistance,contextSupport}))
    if(!finite(v))throw new Error('LOD_NON_FINITE_'+k);
  const distance=Math.max(1e-6,taskDistance);
  const context=Math.max(1e-6,contextSupport);
  return (clamp01(ambiguity)*clamp01(urgency))/(distance*context);
}

export function selectCapabilityLod(input,{interfaceThreshold=0.35,executionThreshold=0.8}={}){
  const score=semanticRefinementScore(input);
  if(score>=executionThreshold)return Object.freeze({lod:2,score,state:'EXECUTION_CANDIDATE'});
  if(score>=interfaceThreshold)return Object.freeze({lod:1,score,state:'INTERFACE_CANDIDATE'});
  return Object.freeze({lod:0,score,state:'DESCRIPTOR_ONLY'});
}

export function memoryShell({active=false,recent=false,durableEvidence=false,unresolvedCommitment=false}={}){
  if(active)return 'FOCUS';
  if(recent||unresolvedCommitment)return 'HORIZON';
  if(durableEvidence)return 'ARCHIVE';
  return 'ARCHIVE';
}

export function mayEvictFromWorkingMemory(item={}){
  if(item.active===true)return Object.freeze({allowed:false,reason:'ACTIVE_STATE'});
  if(item.unresolvedCommitment===true)return Object.freeze({allowed:false,reason:'UNRESOLVED_COMMITMENT'});
  return Object.freeze({
    allowed:true,
    reason:item.durableEvidence===true?'PAGE_DURABLE_EVIDENCE_KEEP_ARCHIVE':'OUT_OF_TASK'
  });
}
