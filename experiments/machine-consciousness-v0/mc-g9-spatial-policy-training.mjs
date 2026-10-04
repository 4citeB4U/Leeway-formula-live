/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9_SPATIAL_POLICY_TRAINING
WHAT = Train/holdout ablation for spatially informed policy valuation
WHY = Determine whether better spatial belief can improve action outcomes without modifying the Golden Formula
WHO = Leeway Industries / Creator-authorized Machine Consciousness research runtime
WHERE = experiments/machine-consciousness-v0/mc-g9-spatial-policy-training.mjs
WHEN = MC-G9
HOW = Matched simulator worlds -> spatial posterior -> bounded policy consequence term -> train lambda -> frozen holdout -> canonical Formula evaluation
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/
import fs from 'node:fs';
import crypto from 'node:crypto';
import {rng32,entropy,kl,freeEnergy,sensorRedLikelihood,transitionBelief,updateBelief,predictedRed,evaluatePolicies,policyDistribution,STATES} from './simulator.mjs';
import {buildOperationalAwareness} from './workspace-self-model.mjs';
import {calculateDimensionWindow} from './cognition-dimensions.mjs';

const FORMULA='http://127.0.0.1:4001/runtime/formula/v1';
const calibration=JSON.parse(fs.readFileSync(new URL('../../contracts/domain-adapters/machine-consciousness-awareness-calibration-v0.json',import.meta.url)));
const lambdas=[0,0.05,0.10,0.20,0.35,0.50,0.75,1.00,1.50,2.00];
const cycles=64,seed=20261004,spatialReliability=0.90;
const sha=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const categorical=(p,u)=>{let c=0;for(let i=0;i<p.length;i++){c+=p[i];if(u<=c)return i;}return p.length-1;};
const transitions={inspect:[[0.94,0.06],[0.28,0.72]],commit:[[0.74,0.26],[0.12,0.88]]};

function runWorld({worldIndex,lambda}){
 const rng=rng32((seed+worldIndex*2654435761)>>>0);
 let hidden=categorical([0.7,0.3],rng()),posterior=[0.5,0.5],lastAction=null,prevF=null;
 let brier=0,preferred=0;const receipts=[];
 for(let t=0;t<cycles;t++){
   const uObs=rng(),uSpatial=rng(),uAction=rng(),uTransition=rng();
   const prior=lastAction?transitionBelief(posterior,lastAction):posterior.slice();
   const observationRed=uObs<sensorRedLikelihood(hidden,0.82);
   let nextPosterior=updateBelief(prior,observationRed,0.82);
   const spatialRed=uSpatial<sensorRedLikelihood(hidden,spatialReliability);
   nextPosterior=updateBelief(nextPosterior,spatialRed,spatialReliability);
   brier+=(nextPosterior[1]-(hidden===1?1:0))**2;

   const predicted=predictedRed(prior,0.82);
   const residual=(observationRed?1:0)-predicted;
   const variance=Math.max(0.05,predicted*(1-predicted));
   const PE=(residual*residual)/variance;
   const F=freeEnergy(nextPosterior,prior,observationRed,0.82);
   const V=prevF===null?0:-(F-prevF);
   const IG=kl(nextPosterior,prior);

   const base=evaluatePolicies(nextPosterior,0.82);
   const pUnstable=nextPosterior[1];
   const policies=base.map(p=>{
     const spatialConsequence=p.action==='commit'?pUnstable:-pUnstable;
     return {...p,baseG:p.G,spatialConsequence,G:p.G+lambda*spatialConsequence};
   });
   const dist=policyDistribution(policies,3);
   const chosenIndex=categorical(dist,uAction),chosen=policies[chosenIndex];
   const before=hidden;
   hidden=categorical(transitions[chosen.action][hidden],uTransition);
   preferred+=hidden===0?1:0;

   const payload={
     schemaVersion:'0.1.0',provenance:'SIMULATED',scenario:'spatial-policy-training',worldIndex,cycle:t,
     cognitionView:{
       observation:{sensor:'binary-risk-sensor',red:observationRed,modelReliability:0.82},
       prior,posterior:nextPosterior,prediction:{redProbability:predicted},
       policies:policies.map((p,i)=>({action:p.action,G:p.G,baseG:p.baseG,spatialConsequence:p.spatialConsequence,probability:dist[i]})),
       selectedPolicy:chosen.action
     },
     execution:{requestedAction:chosen.action,executor:'SIMULATED_WORLD',result:{nextWorldState:STATES[hidden],preferred:hidden===0,changed:hidden!==before}},
     metrics:{belief_entropy_nats:entropy(nextPosterior),precision_weighted_prediction_error:PE,valence_free_energy_rate:V,belief_information_gain_nats:IG,selected_policy_expected_free_energy:chosen.G,global_access_ratio:1},
     auditWorldState:{before:STATES[before],after:STATES[hidden],spatialObservationEnabled:true,spatialReliability,lambda}
   };
   payload.stateHash=sha(payload);receipts.push(payload);
   posterior=nextPosterior;lastAction=chosen.action;prevF=F;
 }
 return {worldIndex,lambda,brier:brier/cycles,preferredRate:preferred/cycles,receipts};
}
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
function evaluateWorlds(indices,lambda){const runs=indices.map(worldIndex=>runWorld({worldIndex,lambda}));return {lambda,runs,brier:mean(runs.map(x=>x.brier)),preferredRate:mean(runs.map(x=>x.preferredRate))};}
const trainWorlds=Array.from({length:96},(_,i)=>i),holdoutWorlds=Array.from({length:96},(_,i)=>i+96);
const train=lambdas.map(lambda=>evaluateWorlds(trainWorlds,lambda));
train.sort((a,b)=>b.preferredRate-a.preferredRate||a.brier-b.brier||a.lambda-b.lambda);
const selectedLambda=train[0].lambda;
const holdoutBaseline=evaluateWorlds(holdoutWorlds,0);
const holdoutTrained=evaluateWorlds(holdoutWorlds,selectedLambda);
const policyGainPctPoints=100*(holdoutTrained.preferredRate-holdoutBaseline.preferredRate);
const brierRelativeChange=(holdoutTrained.brier-holdoutBaseline.brier)/holdoutBaseline.brier;

async function formulaEval(run,label){
 const slice=run.receipts.slice(0,16),awareness=slice.map(r=>buildOperationalAwareness(r));
 const window=calculateDimensionWindow(slice,awareness);
 const req={adapterId:'runtime-state-v1',caller:'machine-consciousness-awareness-v0',traceId:'MC-G9-SPATIAL-POLICY-'+label,input:{stateRows:window.stateRows,ranges:calibration.ranges}};
 const res=await fetch(FORMULA+'/evaluate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(req)});
 if(!res.ok)throw new Error('FORMULA_'+label+'_'+res.status+'_'+await res.text());
 return await res.json();
}
const formulaBaseline=await formulaEval(holdoutBaseline.runs[0],'BASELINE');
const formulaTrained=await formulaEval(holdoutTrained.runs[0],'TRAINED');
const acceptance={
 trainHoldoutSeparated:true,
 selectedLambda,
 holdoutPolicyGainPctPoints:policyGainPctPoints,
 holdoutBrierRelativeChangePct:100*brierRelativeChange,
 policyGainAtLeastOnePoint:policyGainPctPoints>=1,
 brierRegressionWithinFivePct:brierRelativeChange<=0.05,
 formulaExecuted:true,
 formulaOutputsChanged:formulaBaseline.resultHash!==formulaTrained.resultHash
};
acceptance.pass=acceptance.policyGainAtLeastOnePoint&&acceptance.brierRegressionWithinFivePct&&acceptance.formulaExecuted;
const out={
 schemaVersion:'1.0.0',gate:'MC-G9',experiment:'SPATIAL_BELIEF_TO_POLICY_TRAINING',
 authority:{formulaId:'LEEWAY-FORMULA-v1.0',formulaMutation:false},
 design:{cycles,seed,spatialReliability,lambdas,trainWorlds:[0,95],holdoutWorlds:[96,191]},
 train:train.map(x=>({lambda:x.lambda,brier:x.brier,preferredRate:x.preferredRate})),
 selectedLambda,
 holdout:{baseline:{lambda:0,brier:holdoutBaseline.brier,preferredRate:holdoutBaseline.preferredRate},trained:{lambda:selectedLambda,brier:holdoutTrained.brier,preferredRate:holdoutTrained.preferredRate},policyGainPctPoints,brierRelativeChangePct:100*brierRelativeChange},
 formula:{baseline:formulaBaseline,trained:formulaTrained},
 acceptance,
 classification:acceptance.pass?'POLICY_TRAINING_CANDIDATE_PASS':'NO_POLICY_GAIN',
 claimBoundary:'Training modifies only experimental candidate-policy valuation in the simulator. Golden Formula bytes and canonical adapter are unchanged. Live hardware spatial qualification remains a separate evidence gate.'
};
out.digest=sha(out);
fs.writeFileSync(new URL('./outputs/mc-g9-spatial-policy-training.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({classification:out.classification,selectedLambda,outcome:out.holdout,acceptance:out.acceptance,formula:{baselineResultHash:formulaBaseline.resultHash,trainedResultHash:formulaTrained.resultHash},digest:out.digest},null,2));
