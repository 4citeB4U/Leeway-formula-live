/*
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.DREAM_REPLAY

5WH:
WHAT = Deterministic memory replay and counterfactual dream engine for MC-4
WHY = Test whether prioritized offline replay improves predictive learning while preserving real-vs-simulated provenance
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/dream-replay.mjs
WHEN = MC-4 dream/replay qualification
HOW = Train -> select stored episodes -> create REPLAY receipts -> counterfactual projection -> supervised test-only replay update -> held-out evaluation

AGENTS:
ASSESS
AUDIT
EXECUTE
VERIFY

LICENSE:
MIT
*/

import crypto from 'node:crypto';
import {
  STATES,ACTIONS,rng32,kl
} from './simulator.mjs';
import {
  createSemanticModel,semanticSnapshot,oracleLoss,updateSemanticModel
} from './memory-learning.mjs';

export const REPLAY_MODES=Object.freeze(['NONE','RANDOM','RECENCY','EVB']);
const ZERO_HASH='0'.repeat(64);
const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');

function deepClone(v){ return structuredClone(v); }
function mean(a){ return a.reduce((x,y)=>x+y,0)/a.length; }

function jsd(p,q){
  const m=p.map((x,i)=>(x+q[i])/2);
  return .5*kl(p,m)+.5*kl(q,m);
}

function modelCounterfactual(source,snapshot){
  const sourceAction=source.execution.requestedAction;
  const alternateAction=ACTIONS.find(a=>a!==sourceAction);
  const belief=source.cognitionView.posterior;
  const matrix=snapshot.transitionModel[alternateAction];
  const next=[
    belief[0]*matrix[0][0]+belief[1]*matrix[1][0],
    belief[0]*matrix[0][1]+belief[1]*matrix[1][1]
  ];
  return {
    kind:'MODEL_COUNTERFACTUAL',
    admittedAsExternalHistory:false,
    sourceAction,
    alternateAction,
    predictedNextState:{
      [STATES[0]]:next[0],
      [STATES[1]]:next[1]
    }
  };
}

function hypotheticalGain(model,source){
  const before=semanticSnapshot(model);
  const beforeLoss=oracleLoss(before,source).combinedNll;
  const clone=deepClone(model);
  updateSemanticModel(clone,source,'ORACLE_SUPERVISED_TEST_ONLY');
  const after=semanticSnapshot(clone);
  const afterLoss=oracleLoss(after,source).combinedNll;
  return Math.max(0,beforeLoss-afterLoss);
}

function contextNeed(source,currentPosterior){
  const distance=jsd(source.cognitionView.posterior,currentPosterior);
  return Math.exp(-4*distance);
}

function priorityFor(mode,source,index,total,model,currentPosterior,rng){
  if(mode==='RANDOM')return rng();
  if(mode==='RECENCY')return (index+1)/total;
  if(mode==='EVB'){
    const gain=hypotheticalGain(model,source);
    const need=contextNeed(source,currentPosterior);
    return gain*need;
  }
  return -Infinity;
}

class ReplayLedger{
  constructor(){ this.entries=[]; this.headHash=ZERO_HASH; }
  append(event){
    const core={sequence:this.entries.length,...event};
    const previousHash=this.headHash;
    const replayHash=sha({previousHash,core});
    const entry=Object.freeze({...core,previousHash,replayHash});
    this.entries.push(entry);
    this.headHash=replayHash;
    return entry;
  }
}

export function verifyReplayLedger(ledger){
  let previous=ZERO_HASH;
  for(let i=0;i<ledger.entries.length;i++){
    const e=ledger.entries[i];
    const {previousHash,replayHash,...core}=e;
    if(e.sequence!==i||previousHash!==previous)return false;
    if(replayHash!==sha({previousHash,core}))return false;
    if(e.provenance!=='REPLAY')return false;
    if(!/^[a-f0-9]{64}$/.test(e.sourceStateHash))return false;
    if(e.counterfactual?.admittedAsExternalHistory!==false)return false;
    previous=replayHash;
  }
  return previous===ledger.headHash;
}

export function selectReplayEpisodes({
  mode,trainingReceipts,model,replayBudget,currentPosterior,seed=1
}){
  if(!REPLAY_MODES.includes(mode))throw new Error('REPLAY_MODE_UNKNOWN');
  if(mode==='NONE'||replayBudget<=0)return [];
  const rng=rng32(seed>>>0);
  const pool=trainingReceipts.map((source,index)=>({
    source,index,
    priority:priorityFor(mode,source,index,trainingReceipts.length,model,currentPosterior,rng)
  }));
  pool.sort((a,b)=>b.priority-a.priority||b.index-a.index);
  return pool.slice(0,Math.min(replayBudget,pool.length));
}

function makeReplayEvent({mode,source,priority,replayIndex,modelSnapshot}){
  const counterfactual=modelCounterfactual(source,modelSnapshot);
  const event={
    schemaVersion:'0.1.0',
    provenance:'REPLAY',
    sourceProvenance:source.provenance,
    sourceStateHash:source.stateHash,
    sourceScenario:source.scenario,
    sourceWorldIndex:source.worldIndex,
    sourceCycle:source.cycle,
    replayMode:mode,
    replayIndex,
    priority,
    feedbackClass:'ORACLE_SUPERVISED_TEST_ONLY',
    learningBasis:'SOURCE_EPISODE_REPLAY_ONLY',
    counterfactual,
    formulaExecutionState:'NOT_EXECUTED'
  };
  return Object.freeze({...event,eventHash:sha(event)});
}

function trainOnline(model,receipts){
  for(const r of receipts)updateSemanticModel(model,r,'ORACLE_SUPERVISED_TEST_ONLY');
  return model;
}

function evaluateHeldOut(snapshot,receipts){
  const losses=receipts.map(r=>oracleLoss(snapshot,r));
  return {
    n:losses.length,
    sensorNll:mean(losses.map(x=>x.sensorNll)),
    transitionNll:mean(losses.map(x=>x.transitionNll)),
    combinedNll:mean(losses.map(x=>x.combinedNll))
  };
}

export function runReplayExperiment(receipts,{
  mode='NONE',
  trainCycles=32,
  replayBudget=12,
  seed=20261001,
  priorStrength=20,
  forgettingFactor=.96
}={}){
  if(!REPLAY_MODES.includes(mode))throw new Error('REPLAY_MODE_UNKNOWN');
  if(receipts.length<=trainCycles)throw new Error('HOLDOUT_REQUIRED');
  if(!receipts.every(r=>r.provenance==='SIMULATED'))throw new Error('MC4_EXPECTS_SIMULATED_SOURCE');

  const sourceHashes=receipts.map(r=>r.stateHash);
  const sourceJson=JSON.stringify(receipts);
  const training=receipts.slice(0,trainCycles);
  const holdout=receipts.slice(trainCycles);
  const model=createSemanticModel({priorStrength,forgettingFactor});
  trainOnline(model,training);
  const onlineSnapshot=semanticSnapshot(model);
  const currentPosterior=training.at(-1).cognitionView.posterior;

  const selected=selectReplayEpisodes({
    mode,trainingReceipts:training,model,
    replayBudget,currentPosterior,
    seed:(seed+receipts[0].worldIndex*2654435761)>>>0
  });

  const replayLedger=new ReplayLedger();
  const replayEvents=[];
  for(let i=0;i<selected.length;i++){
    const {source,priority}=selected[i];
    const before=semanticSnapshot(model);
    const event=makeReplayEvent({
      mode,source,priority,replayIndex:i,modelSnapshot:before
    });
    replayLedger.append(event);
    replayEvents.push(event);
    updateSemanticModel(model,source,'ORACLE_SUPERVISED_TEST_ONLY');
  }

  const finalSnapshot=semanticSnapshot(model);
  const holdoutLoss=evaluateHeldOut(finalSnapshot,holdout);
  const noReplayLoss=evaluateHeldOut(onlineSnapshot,holdout);

  const falseRealMemoryCount=replayEvents.filter(e=>e.provenance!=='REPLAY'||e.counterfactual.admittedAsExternalHistory!==false).length;
  const sourceReceiptsUnchanged=JSON.stringify(receipts)===sourceJson &&
    receipts.every((r,i)=>r.stateHash===sourceHashes[i]);

  return {
    schemaVersion:'0.1.0',
    mode,
    feedbackClass:'ORACLE_SUPERVISED_TEST_ONLY',
    sourceProvenance:'SIMULATED',
    formulaExecutionState:'NOT_EXECUTED',
    trainCycles,
    holdoutCycles:holdout.length,
    replayBudget,
    replayCount:replayEvents.length,
    onlineModel:onlineSnapshot,
    finalModel:finalSnapshot,
    noReplayHoldoutLoss:noReplayLoss,
    holdoutLoss,
    replayLedger,
    replayEvents,
    replayLedgerVerified:verifyReplayLedger(replayLedger),
    falseRealMemoryCount,
    sourceReceiptsUnchanged
  };
}

export function relativeImprovement(baseline,candidate,key='combinedNll'){
  return (baseline[key]-candidate[key])/baseline[key];
}
