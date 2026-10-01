/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.COGNITION_DIMENSIONS
5WH:
WHAT = Independently recompute the six candidate cognition dimensions from cognition receipts and operational workspace evidence
WHY = Prevent the Formula bridge from trusting prefilled metric fields
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/cognition-dimensions.mjs
WHEN = MC-5 instrumentation qualification
HOW = Validate receipt integrity/provenance -> recompute H,PE,V,IG,G -> verify MC-G3 awareness -> derive operational B -> emit Formula-independent vector
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';
import {entropy,kl,freeEnergy} from './simulator.mjs';

export const DIMENSION_ORDER=Object.freeze([
  'belief_entropy_nats',
  'precision_weighted_prediction_error',
  'valence_free_energy_rate',
  'belief_information_gain_nats',
  'selected_policy_expected_free_energy',
  'global_access_ratio'
]);

const ALLOWED_PROVENANCE=new Set(['SIMULATED','REAL','TEST_FIXTURE']);
const sha=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const near=(a,b,tol=1e-12)=>Math.abs(a-b)<=tol;

function assertDistribution(v,label){
  if(!Array.isArray(v)||v.length<2)throw new Error(label+'_INVALID');
  if(!v.every(x=>Number.isFinite(x)&&x>=0&&x<=1))throw new Error(label+'_NON_PROBABILITY');
  if(!near(v.reduce((a,b)=>a+b,0),1))throw new Error(label+'_NOT_NORMALIZED');
}

export function verifyCognitionReceiptHash(receipt){
  if(!receipt||!/^[a-f0-9]{64}$/.test(receipt.stateHash??''))return false;
  const {stateHash,...core}=receipt;
  return sha(core)===stateHash;
}

function validateReceipt(receipt){
  if(!receipt)throw new Error('COGNITION_RECEIPT_REQUIRED');
  if(!ALLOWED_PROVENANCE.has(receipt.provenance))throw new Error('COGNITION_PROVENANCE_NOT_ELIGIBLE_'+receipt.provenance);
  if(!verifyCognitionReceiptHash(receipt))throw new Error('COGNITION_RECEIPT_HASH_INVALID');
  assertDistribution(receipt.cognitionView?.prior,'PRIOR');
  assertDistribution(receipt.cognitionView?.posterior,'POSTERIOR');
  const p=receipt.cognitionView?.prediction?.redProbability;
  if(!Number.isFinite(p)||p<0||p>1)throw new Error('PREDICTION_INVALID');
  if(typeof receipt.cognitionView?.observation?.red!=='boolean')throw new Error('OBSERVATION_INVALID');
  const rel=receipt.cognitionView?.observation?.modelReliability;
  if(!Number.isFinite(rel)||rel<=0||rel>=1)throw new Error('MODEL_RELIABILITY_INVALID');
}

function validatePrevious(receipt,previousReceipt){
  if(receipt.cycle===0){
    if(previousReceipt!==null&&previousReceipt!==undefined)throw new Error('CYCLE_ZERO_PREVIOUS_NOT_ALLOWED');
    return;
  }
  if(!previousReceipt)throw new Error('PREVIOUS_RECEIPT_REQUIRED');
  validateReceipt(previousReceipt);
  if(previousReceipt.worldIndex!==receipt.worldIndex||previousReceipt.scenario!==receipt.scenario)throw new Error('PREVIOUS_RECEIPT_CONTEXT_MISMATCH');
  if(previousReceipt.cycle!==receipt.cycle-1)throw new Error('PREVIOUS_RECEIPT_NOT_CONSECUTIVE');
}

function freeEnergyFromReceipt(receipt){
  const o=receipt.cognitionView.observation;
  return freeEnergy(receipt.cognitionView.posterior,receipt.cognitionView.prior,o.red,o.modelReliability);
}

function selectedPolicyG(receipt){
  const chosen=receipt.cognitionView?.policies?.find(p=>p.action===receipt.cognitionView.selectedPolicy);
  if(!chosen||!Number.isFinite(chosen.G))throw new Error('SELECTED_POLICY_G_MISSING');
  return chosen.G;
}

function operationalB(receipt,awareness){
  if(!awareness)throw new Error('OPERATIONAL_AWARENESS_REQUIRED');
  if(!awareness.workspaceVerified||!awareness.selfModelVerified)throw new Error('OPERATIONAL_AWARENESS_UNVERIFIED');
  if(awareness.workspaceState?.cycleStateHash!==receipt.stateHash)throw new Error('AWARENESS_CYCLE_HASH_MISMATCH');
  const b=awareness.broadcast?.globalAccessRatio;
  if(!Number.isFinite(b)||b<0||b>1)throw new Error('OPERATIONAL_B_INVALID');
  return b;
}

export function calculateCognitionDimensions({receipt,previousReceipt=null,awareness}={}){
  validateReceipt(receipt);
  validatePrevious(receipt,previousReceipt);

  const prior=receipt.cognitionView.prior;
  const posterior=receipt.cognitionView.posterior;
  const predicted=receipt.cognitionView.prediction.redProbability;
  const observed=receipt.cognitionView.observation.red?1:0;

  const H=entropy(posterior);
  const residual=observed-predicted;
  const variance=Math.max(0.05,predicted*(1-predicted));
  const PE=(residual*residual)/variance;
  const currentF=freeEnergyFromReceipt(receipt);
  const previousF=previousReceipt?freeEnergyFromReceipt(previousReceipt):currentF;
  const V=receipt.cycle===0?0:-(currentF-previousF);
  const IG=kl(posterior,prior);
  const G=selectedPolicyG(receipt);
  const B=operationalB(receipt,awareness);

  const dimensions={
    belief_entropy_nats:H,
    precision_weighted_prediction_error:PE,
    valence_free_energy_rate:V,
    belief_information_gain_nats:IG,
    selected_policy_expected_free_energy:G,
    global_access_ratio:B
  };
  for(const [k,v] of Object.entries(dimensions))if(!Number.isFinite(v))throw new Error('DIMENSION_NON_FINITE_'+k);

  return Object.freeze({
    schemaVersion:'0.1.0',
    sourceStateHash:receipt.stateHash,
    provenance:receipt.provenance,
    formulaExecutionState:'NOT_EXECUTED',
    dimensions:Object.freeze(dimensions),
    vector:Object.freeze(DIMENSION_ORDER.map(k=>dimensions[k]))
  });
}

export function calculateDimensionWindow(receipts,awarenessByCycle,{previousReceipt=null}={}){
  if(!Array.isArray(receipts)||receipts.length!==16)throw new Error('DIMENSION_WINDOW_REQUIRES_16_CYCLES');
  if(!Array.isArray(awarenessByCycle)||awarenessByCycle.length!==16)throw new Error('DIMENSION_WINDOW_REQUIRES_16_AWARENESS_STATES');
  for(let i=1;i<receipts.length;i++){
    if(receipts[i].worldIndex!==receipts[0].worldIndex||receipts[i].scenario!==receipts[0].scenario)throw new Error('DIMENSION_WINDOW_CONTEXT_MISMATCH');
    if(receipts[i].cycle!==receipts[i-1].cycle+1)throw new Error('DIMENSION_WINDOW_NOT_CONSECUTIVE');
  }
  if(receipts[0].cycle>0&&!previousReceipt)throw new Error('DIMENSION_WINDOW_PREVIOUS_REQUIRED');
  const rows=receipts.map((receipt,i)=>calculateCognitionDimensions({
    receipt,
    previousReceipt:i===0?previousReceipt:receipts[i-1],
    awareness:awarenessByCycle[i]
  }).vector);
  return Object.freeze({
    schemaVersion:'0.1.0',
    adapterCandidate:'machine-consciousness-awareness-v0',
    formulaExecutionState:'NOT_EXECUTED',
    sourceHashes:Object.freeze(receipts.map(r=>r.stateHash)),
    stateRows:Object.freeze(rows.map(r=>Object.freeze([...r])))
  });
}
