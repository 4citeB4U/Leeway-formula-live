export const LN2=Math.log(2);

export function normalize(p){
  const clean=p.map(x=>Number.isFinite(x)&&x>0?x:0);
  const s=clean.reduce((a,b)=>a+b,0);
  return s>0?clean.map(x=>x/s):clean.map(()=>1/clean.length);
}
export function entropy(p){
  return -normalize(p).reduce((s,x)=>s+(x>0?x*Math.log(x):0),0);
}
export function kl(p,q){
  const P=normalize(p),Q=normalize(q);
  return P.reduce((s,x,i)=>s+(x>0?x*Math.log(x/Math.max(Q[i],1e-12)):0),0);
}
export function jsd(p,q){
  const P=normalize(p),Q=normalize(q);
  const M=P.map((x,i)=>(x+Q[i])/2);
  return 0.5*kl(P,M)+0.5*kl(Q,M);
}
export function beliefStability(current,previous){
  return Math.max(0,Math.min(1,1-jsd(current,previous)/LN2));
}
export function selfConsistency(observed,predicted){
  return Math.max(0,Math.min(1,1-jsd(observed,predicted)/LN2));
}
export function informationGain(posterior,prior){
  return kl(posterior,prior);
}
export function valenceFromFreeEnergy(currentF,previousF,dt=1){
  if(!(dt>0))throw new Error('DT_MUST_BE_POSITIVE');
  return -(currentF-previousF)/dt;
}
export function globalAccess(acknowledged,required){
  if(!(required>0))throw new Error('REQUIRED_MUST_BE_POSITIVE');
  return Math.max(0,Math.min(1,acknowledged/required));
}
export function replayPriority(gain,need){
  if(gain<0||need<0)throw new Error('GAIN_NEED_NONNEGATIVE');
  return gain*need;
}
const sat=x=>1-Math.exp(-Math.max(0,x));
export function deliberationPressure({
  beliefEntropy,
  predictionError,
  informationGain:ig,
  selectedPolicyExpectedFreeEnergy,
  globalAccessRatio,
  selfModelConsistency,
  risk=0
}){
  const uncertainty=Math.max(0,Math.min(1,beliefEntropy/LN2));
  const pe=sat(predictionError);
  const info=sat(4*Math.max(0,ig));
  const policy=sat(Math.max(0,selectedPolicyExpectedFreeEnergy));
  const accessGap=1-Math.max(0,Math.min(1,globalAccessRatio));
  const selfGap=1-Math.max(0,Math.min(1,selfModelConsistency));
  const riskN=Math.max(0,Math.min(1,risk));
  const score=
    0.20*uncertainty+
    0.18*pe+
    0.12*info+
    0.16*policy+
    0.12*accessGap+
    0.12*selfGap+
    0.10*riskN;
  return Math.max(0,Math.min(1,score));
}
export function deliberationBudget(input,{minCycles=1,maxCycles=16}={}){
  if(minCycles<1||maxCycles<minCycles)throw new Error('INVALID_CYCLE_BOUNDS');
  const pressure=deliberationPressure(input);
  const cycles=minCycles+Math.round((maxCycles-minCycles)*pressure);
  const mode=pressure<0.25?'FAST':pressure<0.55?'NORMAL':'DELIBERATE';
  return {pressure,cycles,mode};
}

export function mechanicalEmotionState({
  beliefEntropy,
  predictionError,
  informationGain:ig,
  valence,
  globalAccessRatio,
  risk=0
}){
  const uncertainty=Math.max(0,Math.min(1,beliefEntropy/LN2));
  const surprise=sat(predictionError);
  const learning=sat(4*Math.max(0,ig));
  const posVal=sat(Math.max(0,valence));
  const negVal=sat(Math.max(0,-valence));
  const access=Math.max(0,Math.min(1,globalAccessRatio));
  const riskN=Math.max(0,Math.min(1,risk));
  const clamp=x=>Math.max(0,Math.min(1,x));
  return {
    calm:clamp(0.45*(1-surprise)+0.30*access+0.25*(1-riskN)),
    confusion:clamp(0.45*uncertainty+0.35*surprise+0.20*(1-access)),
    frustration:clamp(0.45*negVal+0.35*surprise+0.20*riskN),
    curiosity:clamp(0.50*learning+0.30*uncertainty+0.20*posVal),
    confidence:clamp(0.50*(1-uncertainty)+0.30*(1-surprise)+0.20*access),
    positiveValence:posVal,
    negativeValence:negVal
  };
}

export function rangeNorm(x,range,{invert=false}={}){
  const [lo,hi]=range;
  if(!(Number.isFinite(lo)&&Number.isFinite(hi)&&hi>lo))throw new Error('INVALID_RANGE');
  const n=Math.max(0,Math.min(1,(x-lo)/(hi-lo)));
  return invert?1-n:n;
}
export function deliberationPressureCalibrated({
  beliefEntropy,
  predictionError,
  informationGain:ig,
  selectedPolicyExpectedFreeEnergy,
  globalAccessRatio,
  selfModelConsistency,
  risk=0
},ranges){
  const uncertainty=rangeNorm(beliefEntropy,ranges.belief_entropy_nats);
  const pe=rangeNorm(predictionError,ranges.precision_weighted_prediction_error);
  const info=rangeNorm(ig,ranges.belief_information_gain_nats);
  const policy=rangeNorm(selectedPolicyExpectedFreeEnergy,ranges.selected_policy_expected_free_energy);
  const accessGap=rangeNorm(globalAccessRatio,ranges.global_access_ratio,{invert:true});
  const selfGap=1-Math.max(0,Math.min(1,selfModelConsistency));
  const riskN=Math.max(0,Math.min(1,risk));
  const score=
    0.22*uncertainty+
    0.24*pe+
    0.10*info+
    0.14*policy+
    0.12*accessGap+
    0.10*selfGap+
    0.08*riskN;
  return Math.max(0,Math.min(1,score));
}
export function deliberationBudgetCalibrated(input,ranges,{minCycles=1,maxCycles=16}={}){
  const pressure=deliberationPressureCalibrated(input,ranges);
  const cycles=minCycles+Math.round((maxCycles-minCycles)*pressure);
  const mode=pressure<0.28?'FAST':pressure<0.58?'NORMAL':'DELIBERATE';
  return {pressure,cycles,mode};
}
