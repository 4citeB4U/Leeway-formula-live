/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.ADAPTIVE_SPATIAL_TRUST
WHAT = Train adaptive spatial trust lambda_t for policy valuation
WHY = Prevent fixed over-trust while retaining spatial policy gains
WHO = Leeway Industries / Machine Consciousness MC-G9
WHERE = experiments/machine-consciousness-v0/mc-g9-adaptive-spatial-trust.mjs
WHEN = 2026-10-04
HOW = Predeclared parameter grid -> train contexts -> frozen holdout -> canonical Formula execution
*/
import fs from 'node:fs';import crypto from 'node:crypto';
import {rng32,entropy,kl,freeEnergy,sensorRedLikelihood,transitionBelief,updateBelief,predictedRed,evaluatePolicies,policyDistribution,STATES} from './simulator.mjs';
import {buildOperationalAwareness} from './workspace-self-model.mjs';
import {calculateDimensionWindow} from './cognition-dimensions.mjs';
const FORMULA='http://127.0.0.1:4001/runtime/formula/v1';
const calibration=JSON.parse(fs.readFileSync(new URL('../../contracts/domain-adapters/machine-consciousness-awareness-calibration-v0.json',import.meta.url)));
const reliabilities=[0.55,0.65,0.75,0.90,0.97],cycles=64,seed=20261004,lambdaMax=2;
const candidates=[];for(const p of [1,2,3])for(const a of [0,0.5,1])for(const b of [0,0.5,1])for(const c of [0,0.5])candidates.push({p,a,b,c});
const sha=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const cat=(p,u)=>{let s=0;for(let i=0;i<p.length;i++){s+=p[i];if(u<=s)return i}return p.length-1};
const transitions={inspect:[[.94,.06],[.28,.72]],commit:[[.74,.26],[.12,.88]]};
const HMAX=Math.log(2);
function adaptiveLambda({r,U,R,E,qualified,params}){if(!qualified)return 0;const raw=lambdaMax*(r**params.p)*(1+params.a*U+params.b*R+params.c*E)/(1+params.a+params.b+params.c);return Math.max(0,Math.min(lambdaMax,raw));}
function world({worldIndex,r,mode='adaptive',params={p:1,a:0,b:0,c:0},qualified=true}){
 const rng=rng32((seed+worldIndex*2654435761+Math.round(r*1000)*97)>>>0);let hidden=cat([.7,.3],rng()),post=[.5,.5],last=null,prevF=null,prevPE=0;let preferred=0,brier=0,lambdaSum=0;const receipts=[];
 for(let t=0;t<cycles;t++){const uObs=rng(),uSpatial=rng(),uAction=rng(),uTrans=rng();const prior=last?transitionBelief(post,last):post.slice();const red=uObs<sensorRedLikelihood(hidden,.82);let next=updateBelief(prior,red,.82);const spatialRed=uSpatial<sensorRedLikelihood(hidden,r);if(qualified)next=updateBelief(next,spatialRed,r);brier+=(next[1]-(hidden===1?1:0))**2;
 const pred=predictedRed(prior,.82),res=(red?1:0)-pred,variance=Math.max(.05,pred*(1-pred)),PE=(res*res)/variance,F=freeEnergy(next,prior,red,.82),V=prevF===null?0:-(F-prevF),IG=kl(next,prior),U=entropy(next)/HMAX,R=next[1],E=Math.min(1,prevPE/4);
 const lambda=mode==='fixed'?2:adaptiveLambda({r,U,R,E,qualified,params});lambdaSum+=lambda;
 const policies=evaluatePolicies(next,.82).map(p=>({...p,baseG:p.G,spatialConsequence:p.action==='commit'?R:-R,G:p.G+lambda*(p.action==='commit'?R:-R)}));const dist=policyDistribution(policies,3),chosen=policies[cat(dist,uAction)],before=hidden;hidden=cat(transitions[chosen.action][hidden],uTrans);preferred+=hidden===0?1:0;
 const payload={schemaVersion:'0.1.0',provenance:'SIMULATED',scenario:'adaptive-spatial-trust',worldIndex,cycle:t,cognitionView:{observation:{sensor:'binary-risk-sensor',red,modelReliability:.82},prior,posterior:next,prediction:{redProbability:pred},policies:policies.map((p,i)=>({action:p.action,G:p.G,probability:dist[i]})),selectedPolicy:chosen.action},execution:{requestedAction:chosen.action,executor:'SIMULATED_WORLD',result:{nextWorldState:STATES[hidden],preferred:hidden===0,changed:hidden!==before}},metrics:{belief_entropy_nats:entropy(next),precision_weighted_prediction_error:PE,valence_free_energy_rate:V,belief_information_gain_nats:IG,selected_policy_expected_free_energy:chosen.G,global_access_ratio:1},auditWorldState:{before:STATES[before],after:STATES[hidden],spatialReliability:r,spatialQualified:qualified,adaptiveLambda:lambda}};payload.stateHash=sha(payload);receipts.push(payload);post=next;last=chosen.action;prevF=F;prevPE=PE}
 return{preferredRate:preferred/cycles,brier:brier/cycles,meanLambda:lambdaSum/cycles,receipts};
}
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
function evalSet(worlds,mode,params,qualified=true){const byReliability={};for(const r of reliabilities){const runs=worlds.map(i=>world({worldIndex:i,r,mode,params,qualified}));byReliability[r]={preferredRate:mean(runs.map(x=>x.preferredRate)),brier:mean(runs.map(x=>x.brier)),meanLambda:mean(runs.map(x=>x.meanLambda)),sample:runs[0]}}return byReliability}
const trainWorlds=Array.from({length:64},(_,i)=>i),holdoutWorlds=Array.from({length:64},(_,i)=>i+64);
const fixedTrain=evalSet(trainWorlds,'fixed',{});
const scored=candidates.map(params=>{const x=evalSet(trainWorlds,'adaptive',params);const low=(x[.55].preferredRate+x[.65].preferredRate)/2,high=(x[.9].preferredRate+x[.97].preferredRate)/2,score=mean(Object.values(x).map(v=>v.preferredRate));return{params,x,score,low,high}});
scored.sort((a,b)=>b.score-a.score||b.low-a.low||b.high-a.high||a.params.p-b.params.p||a.params.a-b.params.a||a.params.b-b.params.b||a.params.c-b.params.c);
const selected=scored[0].params,fixed=evalSet(holdoutWorlds,'fixed',{}),adaptive=evalSet(holdoutWorlds,'adaptive',selected),unqualified=evalSet([128],'adaptive',selected,false);
const agg=o=>({preferredRate:mean(Object.values(o).map(v=>v.preferredRate)),brier:mean(Object.values(o).map(v=>v.brier))});
const F=agg(fixed),A=agg(adaptive),lowFixed=mean([fixed[.55].preferredRate,fixed[.65].preferredRate]),lowAdaptive=mean([adaptive[.55].preferredRate,adaptive[.65].preferredRate]),highFixed=mean([fixed[.9].preferredRate,fixed[.97].preferredRate]),highAdaptive=mean([adaptive[.9].preferredRate,adaptive[.97].preferredRate]);
async function formulaEval(run){const slice=run.receipts.slice(0,16),aw=slice.map(buildOperationalAwareness),win=calculateDimensionWindow(slice,aw);const res=await fetch(FORMULA+'/evaluate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({adapterId:'runtime-state-v1',caller:'machine-consciousness-awareness-v0',traceId:'MC-G9-ADAPTIVE-SPATIAL',input:{stateRows:win.stateRows,ranges:calibration.ranges}})});if(!res.ok)throw new Error(await res.text());return await res.json()}
const formula=await formulaEval(adaptive[.9].sample);
const acceptance={aggregateNoRegression:A.preferredRate>=F.preferredRate,lowReliabilityNoRegression:lowAdaptive>=lowFixed,highReliabilityWithinOnePoint:100*(highAdaptive-highFixed)>=-1,brierWithinFivePct:(A.brier-F.brier)/F.brier<=.05,unqualifiedLambdaZero:Object.values(unqualified).every(v=>v.meanLambda===0),formulaExecuted:Boolean(formula.resultHash)};acceptance.pass=Object.values(acceptance).every(Boolean);
const out={schemaVersion:'1.0.0',gate:'MC-G9',experiment:'ADAPTIVE_SPATIAL_TRUST',selected,holdout:{fixed:F,adaptive:A,aggregatePolicyDeltaPctPoints:100*(A.preferredRate-F.preferredRate),brierRelativeChangePct:100*(A.brier-F.brier)/F.brier,lowReliabilityPolicyDeltaPctPoints:100*(lowAdaptive-lowFixed),highReliabilityPolicyDeltaPctPoints:100*(highAdaptive-highFixed),fixedByReliability:Object.fromEntries(reliabilities.map(r=>[r,{preferredRate:fixed[r].preferredRate,brier:fixed[r].brier,meanLambda:fixed[r].meanLambda}])),adaptiveByReliability:Object.fromEntries(reliabilities.map(r=>[r,{preferredRate:adaptive[r].preferredRate,brier:adaptive[r].brier,meanLambda:adaptive[r].meanLambda}]))},unqualifiedMeanLambdas:Object.fromEntries(reliabilities.map(r=>[r,unqualified[r].meanLambda])),formula,acceptance,authority:{formulaMutation:false},classification:acceptance.pass?'ADAPTIVE_TRUST_CANDIDATE_PASS':'ADAPTIVE_TRUST_NO_PROMOTION'};out.digest=sha(out);fs.writeFileSync(new URL('./outputs/mc-g9-adaptive-spatial-trust.json',import.meta.url),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({classification:out.classification,selected,outcome:out.holdout,unqualifiedMeanLambdas:out.unqualifiedMeanLambdas,acceptance,digest:out.digest},null,2));
