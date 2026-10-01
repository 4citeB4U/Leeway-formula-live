/*
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MEMORY_LEARNING

5WH:
WHAT = Deterministic episodic-memory and semantic-model learning layer for the MC-1 simulator
WHY = Prove that stored experience can update an inspectable predictive model before integrating learning into policy control
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/memory-learning.mjs
WHEN = MC-2 memory + learning qualification
HOW = Hash-chained episodic memory plus decayed supervised Beta/Dirichlet-style counts over audited simulator feedback

AGENTS:
ASSESS
AUDIT
EXECUTE
VERIFY

LICENSE:
MIT
*/

import crypto from 'node:crypto';
import fs from 'node:fs';
import {STATES,ACTIONS} from './simulator.mjs';

const WORLD_SPEC=JSON.parse(fs.readFileSync(new URL('./world-spec-v0.json',import.meta.url),'utf8'));
const BASE_SENSOR_RELIABILITY=WORLD_SPEC.agentModel.sensorReliability;
const BASE_TRANSITIONS=WORLD_SPEC.agentModel.transition;
const ZERO_HASH='0'.repeat(64);
const LEARNING_MODES=new Set(['NONE','ORACLE_SUPERVISED_TEST_ONLY']);

function sha(v){
  return crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
}
function clampProbability(v){
  return Math.min(1-1e-12,Math.max(1e-12,v));
}
function normalizeRow(row){
  const total=row.reduce((a,b)=>a+b,0);
  if(!(total>0))throw new Error('SEMANTIC_MODEL_ROW_NON_POSITIVE');
  return row.map(x=>x/total);
}
function transitionSnapshot(counts){
  return Object.fromEntries(ACTIONS.map(action=>[
    action,
    counts[action].map(normalizeRow)
  ]));
}
export function createSemanticModel({priorStrength=20,forgettingFactor=.96}={}){
  if(!(priorStrength>0))throw new Error('PRIOR_STRENGTH_MUST_BE_POSITIVE');
  if(!(forgettingFactor>0&&forgettingFactor<=1))throw new Error('FORGETTING_FACTOR_OUT_OF_RANGE');
  return {
    schemaVersion:'0.1.0',
    mode:'SEMANTIC_ENVIRONMENT_MODEL',
    priorStrength,
    forgettingFactor,
    sensorCounts:[
      BASE_SENSOR_RELIABILITY*priorStrength,
      (1-BASE_SENSOR_RELIABILITY)*priorStrength
    ],
    transitionCounts:Object.fromEntries(ACTIONS.map(action=>[
      action,
      BASE_TRANSITIONS[action].map(row=>row.map(p=>p*priorStrength))
    ])),
    updates:0
  };
}
export function semanticSnapshot(model){
  const sensorTotal=model.sensorCounts.reduce((a,b)=>a+b,0);
  const snapshot={
    schemaVersion:'0.1.0',
    sensorReliability:model.sensorCounts[0]/sensorTotal,
    transitionModel:transitionSnapshot(model.transitionCounts),
    updates:model.updates,
    priorStrength:model.priorStrength,
    forgettingFactor:model.forgettingFactor
  };
  snapshot.modelHash=sha(snapshot);
  return snapshot;
}
export class EpisodicMemory{
  constructor(){
    this.entries=[];
    this.headHash=ZERO_HASH;
  }
  append(receipt,{learningMode,feedbackClass,modelBeforeHash,modelAfterHash}){
    const core={
      sequence:this.entries.length,
      cycleStateHash:receipt.stateHash,
      provenance:receipt.provenance,
      scenario:receipt.scenario,
      worldIndex:receipt.worldIndex,
      cycle:receipt.cycle,
      selectedPolicy:receipt.cognitionView.selectedPolicy,
      requestedAction:receipt.execution.requestedAction,
      observationRed:receipt.cognitionView.observation.red,
      resultPreferred:receipt.execution.result.preferred,
      learningMode,
      feedbackClass,
      modelBeforeHash,
      modelAfterHash
    };
    const previousHash=this.headHash;
    const entryHash=sha({previousHash,core});
    const entry=Object.freeze({...core,previousHash,entryHash});
    this.entries.push(entry);
    this.headHash=entryHash;
    return entry;
  }
}
export function verifyMemoryChain(memory){
  let previous=ZERO_HASH;
  for(let i=0;i<memory.entries.length;i++){
    const e=memory.entries[i];
    const {previousHash,entryHash,...core}=e;
    if(previousHash!==previous)return false;
    if(entryHash!==sha({previousHash,core}))return false;
    if(e.sequence!==i)return false;
    previous=entryHash;
  }
  return previous===memory.headHash;
}
export function oracleLoss(snapshot,receipt){
  const before=STATES.indexOf(receipt.auditWorldState.before);
  const after=STATES.indexOf(receipt.auditWorldState.after);
  if(before<0||after<0)throw new Error('AUDIT_STATE_UNKNOWN');
  const expectedRed=before===STATES.indexOf('unstable');
  const matched=receipt.cognitionView.observation.red===expectedRed;
  const sensorP=clampProbability(matched?snapshot.sensorReliability:1-snapshot.sensorReliability);
  const action=receipt.execution.requestedAction;
  if(!ACTIONS.includes(action))throw new Error('ACTION_UNKNOWN');
  const transitionP=clampProbability(snapshot.transitionModel[action][before][after]);
  const sensorNll=-Math.log(sensorP);
  const transitionNll=-Math.log(transitionP);
  return {
    sensorNll,
    transitionNll,
    combinedNll:sensorNll+transitionNll,
    sensorMatched:matched,
    beforeIndex:before,
    afterIndex:after
  };
}
export function updateSemanticModel(model,receipt,feedbackClass){
  if(feedbackClass!=='ORACLE_SUPERVISED_TEST_ONLY'){
    throw new Error('LEARNING_FEEDBACK_NOT_AUTHORIZED');
  }
  const loss=oracleLoss(semanticSnapshot(model),receipt);
  const f=model.forgettingFactor;
  model.sensorCounts=model.sensorCounts.map(x=>x*f);
  model.sensorCounts[loss.sensorMatched?0:1]+=1;

  for(const action of ACTIONS){
    model.transitionCounts[action]=model.transitionCounts[action].map(row=>row.map(x=>x*f));
  }
  const action=receipt.execution.requestedAction;
  model.transitionCounts[action][loss.beforeIndex][loss.afterIndex]+=1;
  model.updates++;
  return {
    feedbackClass,
    sensorMatched:loss.sensorMatched,
    transition:{
      action,
      before:receipt.auditWorldState.before,
      after:receipt.auditWorldState.after
    }
  };
}
export function runLearningTrace(receipts,{
  learningMode='ORACLE_SUPERVISED_TEST_ONLY',
  priorStrength=20,
  forgettingFactor=.96
}={}){
  if(!LEARNING_MODES.has(learningMode))throw new Error('LEARNING_MODE_UNKNOWN');
  const originalHashes=receipts.map(r=>r.stateHash);
  const model=createSemanticModel({priorStrength,forgettingFactor});
  const memory=new EpisodicMemory();
  const records=[];

  for(const receipt of receipts){
    if(receipt.provenance!=='SIMULATED')throw new Error('MC2_EXPECTS_SIMULATED_RECEIPT');
    const before=semanticSnapshot(model);
    const loss=oracleLoss(before,receipt);
    const feedbackClass=learningMode==='NONE'?'NONE':'ORACLE_SUPERVISED_TEST_ONLY';
    const update=learningMode==='NONE'
      ? {feedbackClass:'NONE',applied:false}
      : {...updateSemanticModel(model,receipt,feedbackClass),applied:true};
    const after=semanticSnapshot(model);
    const memoryEntry=memory.append(receipt,{
      learningMode,feedbackClass,
      modelBeforeHash:before.modelHash,
      modelAfterHash:after.modelHash
    });
    records.push({
      cycle:receipt.cycle,
      scenario:receipt.scenario,
      worldIndex:receipt.worldIndex,
      provenance:receipt.provenance,
      loss,
      modelBefore:before,
      modelAfter:after,
      update,
      memoryEntryHash:memoryEntry.entryHash
    });
  }

  const unchanged=receipts.every((r,i)=>r.stateHash===originalHashes[i]);
  return {
    schemaVersion:'0.1.0',
    learningMode,
    feedbackClass:learningMode==='NONE'?'NONE':'ORACLE_SUPERVISED_TEST_ONLY',
    formulaExecutionState:'NOT_EXECUTED',
    memory,
    records,
    finalModel:semanticSnapshot(model),
    sourceReceiptsUnchanged:unchanged
  };
}
export function summarizeLoss(records,{startCycle=0,endCycle=Infinity}={}){
  const chosen=records.filter(r=>r.cycle>=startCycle&&r.cycle<endCycle);
  if(!chosen.length)throw new Error('LOSS_WINDOW_EMPTY');
  const mean=key=>chosen.reduce((s,r)=>s+r.loss[key],0)/chosen.length;
  return {
    n:chosen.length,
    sensorNll:mean('sensorNll'),
    transitionNll:mean('transitionNll'),
    combinedNll:mean('combinedNll')
  };
}
export function relativeImprovement(baseline,learned,key){
  return (baseline[key]-learned[key])/baseline[key];
}
