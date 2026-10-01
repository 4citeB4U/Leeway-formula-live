import crypto from 'node:crypto';

export const STATES=['stable','unstable'];
export const ACTIONS=['inspect','commit'];
const BASE_TRANSITIONS={
  inspect:[[0.94,0.06],[0.28,0.72]],
  commit:[[0.74,0.26],[0.12,0.88]]
};
const DRIFT_TRANSITIONS={
  inspect:[[0.82,0.18],[0.18,0.82]],
  commit:[[0.58,0.42],[0.06,0.94]]
};

export function rng32(seed){
  let x=(seed>>>0)||0x9e3779b9;
  return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
}
export function normalize(v){
  const clean=v.map(x=>Number.isFinite(x)&&x>0?x:0);
  const s=clean.reduce((a,b)=>a+b,0);
  return s>0?clean.map(x=>x/s):clean.map(()=>1/clean.length);
}
export const entropy=p=>-normalize(p).reduce((s,x)=>s+(x>0?x*Math.log(x):0),0);
export function kl(p,q){
  const P=normalize(p),Q=normalize(q);
  return P.reduce((s,x,i)=>s+(x>0?x*Math.log(x/Math.max(Q[i],1e-12)):0),0);
}
export function categorical(p,rng){
  const P=normalize(p);let u=rng(),c=0;
  for(let i=0;i<P.length;i++){c+=P[i];if(u<=c)return i;}
  return P.length-1;
}
const bernEntropy=p=>-(p>0?p*Math.log(p):0)-((1-p)>0?(1-p)*Math.log(1-p):0);
export function sensorRedLikelihood(stateIndex,reliability){
  return stateIndex===1?reliability:1-reliability;
}
export function transitionBelief(belief,action,matrixSet=BASE_TRANSITIONS){
  const m=matrixSet[action];
  return [belief[0]*m[0][0]+belief[1]*m[1][0],belief[0]*m[0][1]+belief[1]*m[1][1]];
}
export function updateBelief(prior,obsRed,reliability){
  const likelihood=STATES.map((_,i)=>obsRed?sensorRedLikelihood(i,reliability):1-sensorRedLikelihood(i,reliability));
  return normalize(prior.map((p,i)=>p*likelihood[i]));
}
export function predictedRed(prior,reliability){
  return prior.reduce((s,p,i)=>s+p*sensorRedLikelihood(i,reliability),0);
}
export function freeEnergy(posterior,prior,obsRed,reliability){
  const q=normalize(posterior),p=normalize(prior);
  return q.reduce((s,x,i)=>{
    if(x<=0)return s;
    const like=obsRed?sensorRedLikelihood(i,reliability):1-sensorRedLikelihood(i,reliability);
    return s+x*(Math.log(x)-Math.log(Math.max(p[i]*like,1e-12)));
  },0);
}
function expectedInfoGain(nextBelief,reliability){
  const pRed=predictedRed(nextBelief,reliability);
  const redPost=updateBelief(nextBelief,true,reliability);
  const greenPost=updateBelief(nextBelief,false,reliability);
  return Math.max(0,entropy(nextBelief)-(pRed*entropy(redPost)+(1-pRed)*entropy(greenPost)));
}
export function evaluatePolicies(posterior,reliability=0.82){
  const preference=[0.88,0.12];
  return ACTIONS.map(action=>{
    const next=transitionBelief(posterior,action);
    const risk=-next.reduce((s,p,i)=>s+p*Math.log(preference[i]),0);
    const ambiguity=next.reduce((s,p,i)=>s+p*bernEntropy(sensorRedLikelihood(i,reliability)),0);
    const epistemic=expectedInfoGain(next,reliability);
    const G=risk+ambiguity-0.7*epistemic;
    return {action,nextBelief:next,risk,ambiguity,epistemic,G};
  });
}
export function policyDistribution(policies,gamma=3){
  const z=policies.map(p=>Math.exp(-gamma*p.G));
  return normalize(z);
}
function actualTransitionSet(scenario,cycle){
  return scenario==='changing'&&cycle>=16?DRIFT_TRANSITIONS:BASE_TRANSITIONS;
}
function actualSensorReliability(scenario,cycle){
  if(scenario==='noisy')return 0.60;
  if(scenario==='misleading'&&cycle>=10&&cycle<16)return 0.18;
  return 0.82;
}
function acknowledgementRatio(scenario,cycle){
  if(scenario==='module-dropout' && cycle%5===2)return 6/8;
  if(scenario==='module-dropout' && cycle%11===7)return 7/8;
  return 1;
}
function hashObject(v){
  return crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
}
export function simulateWorld({worldIndex=0,scenario='stationary',cycles=32,seed=1}={}){
  const rng=rng32((seed+worldIndex*2654435761)>>>0);
  let hidden=categorical([0.7,0.3],rng);
  let posterior=[0.5,0.5],lastAction=null,prevF=null;
  const receipts=[];
  for(let t=0;t<cycles;t++){
    const prior=lastAction?transitionBelief(posterior,lastAction):posterior.slice();
    const actualRel=actualSensorReliability(scenario,t);
    const redProb=sensorRedLikelihood(hidden,actualRel);
    const observationRed=rng()<redProb;
    const predictedObsRed=predictedRed(prior,0.82);
    const nextPosterior=updateBelief(prior,observationRed,0.82);
    const H=entropy(nextPosterior);
    const residual=(observationRed?1:0)-predictedObsRed;
    const variance=Math.max(0.05,predictedObsRed*(1-predictedObsRed));
    const PE=(residual*residual)/variance;
    const F=freeEnergy(nextPosterior,prior,observationRed,0.82);
    const V=prevF===null?0:-(F-prevF);
    const IG=kl(nextPosterior,prior);
    const policies=evaluatePolicies(nextPosterior,0.82);
    const policyProb=policyDistribution(policies,3);
    const chosenIndex=categorical(policyProb,rng);
    const chosen=policies[chosenIndex];
    const requestedAction=chosen.action;
    const beforeHidden=hidden;
    const actualMatrix=actualTransitionSet(scenario,t)[requestedAction];
    hidden=categorical(actualMatrix[hidden],rng);
    const result={nextWorldState:STATES[hidden],preferred:hidden===0,changed:hidden!==beforeHidden};
    const B=acknowledgementRatio(scenario,t);
    const payload={
      schemaVersion:'0.1.0',provenance:'SIMULATED',scenario,worldIndex,cycle:t,
      cognitionView:{
        observation:{sensor:'binary-risk-sensor',red:observationRed,modelReliability:0.82},
        prior,posterior:nextPosterior,prediction:{redProbability:predictedObsRed},
        policies:policies.map((p,i)=>({action:p.action,G:p.G,probability:policyProb[i]})),
        selectedPolicy:requestedAction
      },
      execution:{requestedAction,executor:'SIMULATED_WORLD',result},
      metrics:{
        belief_entropy_nats:H,
        precision_weighted_prediction_error:PE,
        valence_free_energy_rate:V,
        belief_information_gain_nats:IG,
        selected_policy_expected_free_energy:chosen.G,
        global_access_ratio:B
      },
      auditWorldState:{before:STATES[beforeHidden],after:STATES[hidden],actualSensorReliability:actualRel}
    };
    payload.stateHash=hashObject(payload);
    receipts.push(payload);
    posterior=nextPosterior;lastAction=requestedAction;prevF=F;
  }
  return receipts;
}
export function summarizeMetrics(receipts){
  const keys=Object.keys(receipts[0].metrics),out={};
  for(const k of keys)out[k]=receipts.map(r=>r.metrics[k]);
  return out;
}