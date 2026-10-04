/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.WORKSPACE_SELF_MODEL
5WH:
WHAT = Deterministic operational global-workspace and factual self-model layer
WHY = Qualify same-cycle-state accessibility and independently verifiable self representation for MC-G3
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/workspace-self-model.mjs
WHEN = MC-3
HOW = Cognition cycleStateHash -> workspace envelope -> governed acknowledgements -> seal -> operational B -> factual self-model -> independent runtime verification
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';

export const REQUIRED_WORKSPACE_MODULES=Object.freeze([
  'perception','belief','prediction','valuation',
  'policy','memory','self-model','veritas'
]);

const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');

function assertHash(v,label){
  if(!/^[a-f0-9]{64}$/.test(v))throw new Error(label+'_INVALID_HASH');
}
function unique(list){return [...new Set(list)];}

function canonicalWorkspaceState(receipt,{semanticModelHash='NONE',memoryHeadHash='NONE',spatialContext=null}={}){
  assertHash(receipt.stateHash,'CYCLE_STATE');
  if(spatialContext)assertHash(spatialContext.contextHash,'SPATIAL_CONTEXT');
  return {
    schemaVersion:'0.1.0',
    provenance:receipt.provenance,
    scenario:receipt.scenario,
    worldIndex:receipt.worldIndex,
    cycle:receipt.cycle,
    cycleStateHash:receipt.stateHash,
    observation:receipt.cognitionView.observation,
    prior:receipt.cognitionView.prior,
    posterior:receipt.cognitionView.posterior,
    prediction:receipt.cognitionView.prediction,
    selectedPolicy:receipt.cognitionView.selectedPolicy,
    execution:receipt.execution,
    sourceMetrics:receipt.metrics,
    semanticModelHash,
    memoryHeadHash,
    spatialContext,
    formulaExecutionState:'NOT_EXECUTED'
  };
}

export function createWorkspaceState(receipt,options={}){
  const state=canonicalWorkspaceState(receipt,options);
  return Object.freeze({...state,workspaceHash:sha(state)});
}

export function createWorkspaceSession(workspaceState,{requiredModules=REQUIRED_WORKSPACE_MODULES}={}){
  if(!workspaceState)throw new Error('WORKSPACE_STATE_REQUIRED');
  const modules=unique(requiredModules);
  if(!modules.length||modules.length!==requiredModules.length)throw new Error('WORKSPACE_REQUIRED_MODULES_INVALID');
  return {workspaceState,requiredModules:modules,acknowledgements:[],sealed:false};
}

export function submitAcknowledgement(session,{module,cycleStateHash=session.workspaceState.cycleStateHash}={}){
  if(session.sealed)return {accepted:false,reason:'WORKSPACE_SEALED'};
  if(!session.requiredModules.includes(module))return {accepted:false,reason:'UNKNOWN_MODULE'};
  if(cycleStateHash!==session.workspaceState.cycleStateHash)return {accepted:false,reason:'STATE_HASH_MISMATCH'};
  if(session.acknowledgements.some(a=>a.module===module))return {accepted:false,reason:'DUPLICATE_MODULE'};
  const ack=Object.freeze({
    module,
    cycleStateHash,
    workspaceHash:session.workspaceState.workspaceHash,
    acknowledgementHash:sha({module,cycleStateHash,workspaceHash:session.workspaceState.workspaceHash})
  });
  session.acknowledgements.push(ack);
  return {accepted:true,ack};
}

function snapshotBroadcast(session){
  const acknowledged=session.acknowledgements.map(a=>a.module);
  const missing=session.requiredModules.filter(m=>!acknowledged.includes(m));
  const ratio=session.requiredModules.length?acknowledged.length/session.requiredModules.length:0;
  return Object.freeze({
    cycleStateHash:session.workspaceState.cycleStateHash,
    workspaceHash:session.workspaceState.workspaceHash,
    requiredModules:[...session.requiredModules],
    acknowledgements:[...session.acknowledgements],
    missingModules:missing,
    globalAccessRatio:ratio,
    complete:missing.length===0,
    sealed:session.sealed
  });
}

export function sealWorkspace(session){
  session.sealed=true;
  return snapshotBroadcast(session);
}

export function acknowledgeWorkspace(workspaceState,{
  requiredModules=REQUIRED_WORKSPACE_MODULES,
  dropoutModules=[]
}={}){
  for(const module of dropoutModules){
    if(!requiredModules.includes(module))throw new Error('DROPOUT_MODULE_UNKNOWN_'+module);
  }
  const drop=new Set(dropoutModules);
  const session=createWorkspaceSession(workspaceState,{requiredModules});
  for(const module of requiredModules){
    if(!drop.has(module))submitAcknowledgement(session,{module});
  }
  return sealWorkspace(session);
}

export function verifyWorkspace(workspaceState,broadcast){
  if(!workspaceState||!broadcast)return false;
  const {workspaceHash,...core}=workspaceState;
  if(sha(core)!==workspaceHash)return false;
  if(broadcast.workspaceHash!==workspaceHash)return false;
  if(broadcast.cycleStateHash!==workspaceState.cycleStateHash)return false;
  if(!broadcast.sealed)return false;
  if(unique(broadcast.requiredModules).length!==broadcast.requiredModules.length)return false;

  const modules=new Set();
  for(const ack of broadcast.acknowledgements){
    if(ack.cycleStateHash!==workspaceState.cycleStateHash)return false;
    if(ack.workspaceHash!==workspaceHash)return false;
    if(!broadcast.requiredModules.includes(ack.module))return false;
    if(modules.has(ack.module))return false;
    if(ack.acknowledgementHash!==sha({
      module:ack.module,
      cycleStateHash:ack.cycleStateHash,
      workspaceHash:ack.workspaceHash
    }))return false;
    modules.add(ack.module);
  }

  const missing=broadcast.requiredModules.filter(m=>!modules.has(m));
  if(JSON.stringify(missing)!==JSON.stringify(broadcast.missingModules))return false;
  const expected=broadcast.requiredModules.length?modules.size/broadcast.requiredModules.length:0;
  return Math.abs(expected-broadcast.globalAccessRatio)<1e-15 &&
    broadcast.complete===(missing.length===0);
}

export function createRuntimeContext({
  activeModules=REQUIRED_WORKSPACE_MODULES,
  authority='SIMULATED_RESEARCH_ONLY',
  semanticModelHash='NONE',
  memoryHeadHash='NONE'
}={}){
  return Object.freeze({
    activeModules:[...activeModules],
    authority,
    semanticModelHash,
    memoryHeadHash
  });
}

function factualClaims(workspaceState,broadcast,runtimeContext){
  return {
    identity:{
      claimClass:'VERIFIED_FROM_RUNTIME',
      value:{
        systemIdentity:'Agent Lee non-LLM machine cognition research runtime',
        runtimeClass:'DETERMINISTIC_RESEARCH_SIMULATOR'
      }
    },
    capabilities:{
      claimClass:'VERIFIED_FROM_RUNTIME',
      value:{
        activeModules:[...runtimeContext.activeModules],
        requiredWorkspaceModules:[...broadcast.requiredModules],
        acknowledgedWorkspaceModules:broadcast.acknowledgements.map(a=>a.module),
        missingWorkspaceModules:[...broadcast.missingModules]
      }
    },
    authority:{
      claimClass:'VERIFIED_FROM_RUNTIME',
      value:{
        authorityClass:runtimeContext.authority,
        formulaExecutionState:'NOT_EXECUTED'
      }
    },
    resources:{
      claimClass:'VERIFIED_FROM_RUNTIME',
      value:{
        semanticModelHash:runtimeContext.semanticModelHash,
        memoryHeadHash:runtimeContext.memoryHeadHash,
        spatialContextHash:workspaceState.spatialContext?.contextHash??null,
        globalAccessRatio:broadcast.globalAccessRatio
      }
    },
    epistemic:{
      claimClass:'DERIVED',
      value:{
        prior:[...workspaceState.prior],
        posterior:[...workspaceState.posterior],
        beliefEntropy:workspaceState.sourceMetrics.belief_entropy_nats,
        predictionError:workspaceState.sourceMetrics.precision_weighted_prediction_error
      }
    },
    history:{
      claimClass:'VERIFIED_FROM_RUNTIME',
      value:{
        provenance:workspaceState.provenance,
        scenario:workspaceState.scenario,
        worldIndex:workspaceState.worldIndex,
        cycle:workspaceState.cycle,
        cycleStateHash:workspaceState.cycleStateHash,
        workspaceHash:workspaceState.workspaceHash,
        selectedPolicy:workspaceState.selectedPolicy,
        requestedAction:workspaceState.execution.requestedAction,
        result:workspaceState.execution.result
      }
    }
  };
}

export function createSelfModel({workspaceState,broadcast,runtimeContext=createRuntimeContext()}={}){
  if(!workspaceState||!broadcast)throw new Error('SELF_MODEL_WORKSPACE_REQUIRED');
  const claims=factualClaims(workspaceState,broadcast,runtimeContext);
  const self={
    schemaVersion:'0.1.0',
    currentCycleStateHash:workspaceState.cycleStateHash,
    currentWorkspaceHash:workspaceState.workspaceHash,
    globalAccessRatio:broadcast.globalAccessRatio,
    claims,
    formula:{id:'LEEWAY-FORMULA-v1.0',executionState:'NOT_EXECUTED'},
    knownLimitations:[
      'SIMULATED research environment',
      'MC-G2 learning evidence is ORACLE_SUPERVISED_TEST_ONLY',
      'awareness dimensions are not an accepted Formula calibration',
      'no claim of sentience or phenomenal consciousness'
    ]
  };
  return Object.freeze({...self,selfModelHash:sha(self)});
}

export function inspectRuntimeFacts({workspaceState,broadcast,runtimeContext=createRuntimeContext()}={}){
  return Object.freeze({
    currentCycleStateHash:workspaceState.cycleStateHash,
    currentWorkspaceHash:workspaceState.workspaceHash,
    globalAccessRatio:broadcast.globalAccessRatio,
    claims:factualClaims(workspaceState,broadcast,runtimeContext),
    formula:{id:'LEEWAY-FORMULA-v1.0',executionState:'NOT_EXECUTED'}
  });
}

export function evaluateSelfModel(selfModel,runtimeFacts){
  const requiredDomains=['identity','capabilities','authority','resources','epistemic','history'];
  const mismatches=[];
  let correct=0;
  for(const domain of requiredDomains){
    if(JSON.stringify(selfModel.claims?.[domain])===JSON.stringify(runtimeFacts.claims?.[domain]))correct++;
    else mismatches.push(domain);
  }
  for(const field of ['currentCycleStateHash','currentWorkspaceHash','globalAccessRatio','formula']){
    if(JSON.stringify(selfModel[field])!==JSON.stringify(runtimeFacts[field]))mismatches.push(field);
  }
  const {selfModelHash,...core}=selfModel;
  const hashValid=selfModelHash===sha(core);
  if(!hashValid)mismatches.push('selfModelHash');
  return Object.freeze({
    verifiableClaims:requiredDomains.length,
    correctClaims:correct,
    accuracy:requiredDomains.length?correct/requiredDomains.length:0,
    hashValid,
    mismatches
  });
}

export function verifySelfModel(selfModel,runtimeFacts){
  const e=evaluateSelfModel(selfModel,runtimeFacts);
  return e.accuracy===1 && e.hashValid && e.mismatches.length===0;
}

export function buildOperationalAwareness(receipt,options={}){
  const workspaceState=createWorkspaceState(receipt,options);
  const broadcast=acknowledgeWorkspace(workspaceState,options);
  const runtimeContext=createRuntimeContext({
    activeModules:options.activeModules??REQUIRED_WORKSPACE_MODULES,
    authority:options.authority??'SIMULATED_RESEARCH_ONLY',
    semanticModelHash:options.semanticModelHash??'NONE',
    memoryHeadHash:options.memoryHeadHash??'NONE'
  });
  const selfModel=createSelfModel({workspaceState,broadcast,runtimeContext});
  const runtimeFacts=inspectRuntimeFacts({workspaceState,broadcast,runtimeContext});
  const selfModelEvaluation=evaluateSelfModel(selfModel,runtimeFacts);
  const awarenessMetrics=Object.freeze({
    ...receipt.metrics,
    source_global_access_ratio:receipt.metrics.global_access_ratio,
    global_access_ratio:broadcast.globalAccessRatio
  });
  return Object.freeze({
    workspaceState,broadcast,runtimeContext,selfModel,runtimeFacts,selfModelEvaluation,
    awarenessMetrics,
    workspaceVerified:verifyWorkspace(workspaceState,broadcast),
    selfModelVerified:verifySelfModel(selfModel,runtimeFacts)
  });
}
