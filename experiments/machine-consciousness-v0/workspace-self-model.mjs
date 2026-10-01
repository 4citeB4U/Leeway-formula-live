/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.WORKSPACE_SELF_MODEL
5WH:
WHAT = Deterministic operational global-workspace and factual self-model layer
WHY = Qualify same-state-hash accessibility and runtime-verifiable self representation for MC-G3
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/workspace-self-model.mjs
WHEN = MC-3
HOW = Canonical state packet -> SHA-256 workspace hash -> required-module acknowledgements -> factual self snapshot -> verification
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';

export const REQUIRED_WORKSPACE_MODULES=Object.freeze([
  'perception','memory','prediction','policy','self-model','veritas','learning'
]);

const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');

function canonicalWorkspaceState(receipt,{semanticModelHash='NONE',memoryHeadHash='NONE'}={}){
  return {
    schemaVersion:'0.1.0',
    provenance:receipt.provenance,
    scenario:receipt.scenario,
    worldIndex:receipt.worldIndex,
    cycle:receipt.cycle,
    cognitionReceiptHash:receipt.stateHash,
    observation:receipt.cognitionView.observation,
    prior:receipt.cognitionView.prior,
    posterior:receipt.cognitionView.posterior,
    prediction:receipt.cognitionView.prediction,
    selectedPolicy:receipt.cognitionView.selectedPolicy,
    execution:receipt.execution,
    metrics:receipt.metrics,
    semanticModelHash,
    memoryHeadHash,
    formulaExecutionState:'NOT_EXECUTED'
  };
}

export function createWorkspaceState(receipt,options={}){
  const state=canonicalWorkspaceState(receipt,options);
  return Object.freeze({...state,workspaceStateHash:sha(state)});
}

export function acknowledgeWorkspace(workspaceState,{
  requiredModules=REQUIRED_WORKSPACE_MODULES,
  dropoutModules=[]
}={}){
  const drop=new Set(dropoutModules);
  const acknowledgements=requiredModules
    .filter(module=>!drop.has(module))
    .map(module=>Object.freeze({
      module,
      workspaceStateHash:workspaceState.workspaceStateHash,
      acknowledgementHash:sha({module,workspaceStateHash:workspaceState.workspaceStateHash})
    }));
  const ratio=requiredModules.length?acknowledgements.length/requiredModules.length:0;
  return Object.freeze({
    requiredModules:[...requiredModules],
    acknowledgements,
    globalAccessRatio:ratio,
    complete:ratio===1
  });
}

export function verifyWorkspace(workspaceState,broadcast){
  if(!/^[a-f0-9]{64}$/.test(workspaceState.workspaceStateHash))return false;
  const modules=new Set();
  for(const ack of broadcast.acknowledgements){
    if(ack.workspaceStateHash!==workspaceState.workspaceStateHash)return false;
    if(!broadcast.requiredModules.includes(ack.module))return false;
    if(modules.has(ack.module))return false;
    if(ack.acknowledgementHash!==sha({module:ack.module,workspaceStateHash:ack.workspaceStateHash}))return false;
    modules.add(ack.module);
  }
  const expected=broadcast.requiredModules.length?modules.size/broadcast.requiredModules.length:0;
  return Math.abs(expected-broadcast.globalAccessRatio)<1e-15 &&
    broadcast.complete===(expected===1);
}

export function createSelfModel({
  workspaceState,
  broadcast,
  semanticModelHash='NONE',
  memoryHeadHash='NONE',
  activeModules=REQUIRED_WORKSPACE_MODULES,
  authority='SIMULATED_RESEARCH_ONLY'
}={}){
  if(!workspaceState||!broadcast)throw new Error('SELF_MODEL_WORKSPACE_REQUIRED');
  const self={
    schemaVersion:'0.1.0',
    identity:'Agent Lee non-LLM machine cognition research runtime',
    runtimeClass:'DETERMINISTIC_RESEARCH_SIMULATOR',
    authority,
    sourceProvenance:workspaceState.provenance,
    scenario:workspaceState.scenario,
    worldIndex:workspaceState.worldIndex,
    cycle:workspaceState.cycle,
    currentWorkspaceStateHash:workspaceState.workspaceStateHash,
    activeModules:[...activeModules],
    requiredWorkspaceModules:[...broadcast.requiredModules],
    acknowledgedWorkspaceModules:broadcast.acknowledgements.map(a=>a.module),
    globalAccessRatio:broadcast.globalAccessRatio,
    semanticModelHash,
    memoryHeadHash,
    formula:{
      id:'LEEWAY-FORMULA-v1.0',
      executionState:'NOT_EXECUTED'
    },
    knownLimitations:[
      'SIMULATED research environment',
      'MC-G2 learning evidence is ORACLE_SUPERVISED_TEST_ONLY',
      'awareness dimensions are not an accepted Formula calibration',
      'no claim of sentience or phenomenal consciousness'
    ]
  };
  return Object.freeze({...self,selfModelHash:sha(self)});
}

export function inspectRuntimeFacts({workspaceState,broadcast,selfModel}){
  return {
    identity:'Agent Lee non-LLM machine cognition research runtime',
    runtimeClass:'DETERMINISTIC_RESEARCH_SIMULATOR',
    authority:selfModel.authority,
    sourceProvenance:workspaceState.provenance,
    scenario:workspaceState.scenario,
    worldIndex:workspaceState.worldIndex,
    cycle:workspaceState.cycle,
    currentWorkspaceStateHash:workspaceState.workspaceStateHash,
    activeModules:[...selfModel.activeModules],
    requiredWorkspaceModules:[...broadcast.requiredModules],
    acknowledgedWorkspaceModules:broadcast.acknowledgements.map(a=>a.module),
    globalAccessRatio:broadcast.globalAccessRatio,
    semanticModelHash:selfModel.semanticModelHash,
    memoryHeadHash:selfModel.memoryHeadHash,
    formula:{id:'LEEWAY-FORMULA-v1.0',executionState:'NOT_EXECUTED'}
  };
}

export function verifySelfModel(selfModel,runtimeFacts){
  const fields=[
    'identity','runtimeClass','authority','sourceProvenance','scenario',
    'worldIndex','cycle','currentWorkspaceStateHash','globalAccessRatio',
    'semanticModelHash','memoryHeadHash'
  ];
  for(const field of fields){
    if(JSON.stringify(selfModel[field])!==JSON.stringify(runtimeFacts[field]))return false;
  }
  for(const field of ['activeModules','requiredWorkspaceModules','acknowledgedWorkspaceModules']){
    if(JSON.stringify(selfModel[field])!==JSON.stringify(runtimeFacts[field]))return false;
  }
  if(JSON.stringify(selfModel.formula)!==JSON.stringify(runtimeFacts.formula))return false;
  const {selfModelHash,...core}=selfModel;
  return selfModelHash===sha(core);
}

export function buildOperationalAwareness(receipt,options={}){
  const workspaceState=createWorkspaceState(receipt,options);
  const broadcast=acknowledgeWorkspace(workspaceState,options);
  const selfModel=createSelfModel({
    workspaceState,broadcast,
    semanticModelHash:options.semanticModelHash??'NONE',
    memoryHeadHash:options.memoryHeadHash??'NONE',
    activeModules:options.activeModules??REQUIRED_WORKSPACE_MODULES,
    authority:options.authority??'SIMULATED_RESEARCH_ONLY'
  });
  const runtimeFacts=inspectRuntimeFacts({workspaceState,broadcast,selfModel});
  return Object.freeze({
    workspaceState,broadcast,selfModel,runtimeFacts,
    workspaceVerified:verifyWorkspace(workspaceState,broadcast),
    selfModelVerified:verifySelfModel(selfModel,runtimeFacts)
  });
}
