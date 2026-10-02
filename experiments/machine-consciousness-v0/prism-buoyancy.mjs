/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.PRISM_BUOYANCY
5WH:
WHAT = Deterministic six-point prism balance and recovery mathematics
WHY = Test spatial cognitive balance, bounded disturbance and recovery before live integration
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/prism-buoyancy.mjs
WHEN = MC-G9 tranche 2
HOW = Six opposing points -> three-axis resultant -> perturbation -> restoring field -> measured recovery
AGENTS: ASSESS AUDIT DESIGN VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';
import {rng32} from './simulator.mjs';

export const PRISM_AXES=Object.freeze([
  {id:'world_self',positive:'world',negative:'self'},
  {id:'prediction_memory',positive:'prediction',negative:'memory'},
  {id:'goal_constraint',positive:'goal',negative:'constraint'}
]);

const EPS=1e-12;
const clamp=(x,lo=-1,hi=1)=>Math.max(lo,Math.min(hi,x));
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const scale=(a,k)=>a.map(x=>x*k);
export const norm=a=>Math.sqrt(a.reduce((s,x)=>s+x*x,0));

function assertVector(v,label){
  if(!Array.isArray(v)||v.length!==3||v.some(x=>!Number.isFinite(x)))throw new Error(label+'_INVALID_VECTOR');
}
function boundedVector(v){return v.map(x=>clamp(x));}

export function axisToSixPoints(axis){
  assertVector(axis,'AXIS');
  const out={};
  PRISM_AXES.forEach((pair,i)=>{
    const x=clamp(axis[i]);
    out[pair.positive]=(1+x)/2;
    out[pair.negative]=(1-x)/2;
  });
  return Object.freeze(out);
}

export function sixPointsToAxis(points){
  return PRISM_AXES.map(pair=>{
    const p=Number(points?.[pair.positive]),n=Number(points?.[pair.negative]);
    if(!Number.isFinite(p)||!Number.isFinite(n))throw new Error('POINT_INVALID_'+pair.id);
    return clamp(p-n);
  });
}

export function validateSixPoints(points,tolerance=1e-12){
  for(const pair of PRISM_AXES){
    const p=points?.[pair.positive],n=points?.[pair.negative];
    if(!Number.isFinite(p)||!Number.isFinite(n)||p<0||p>1||n<0||n>1)return false;
    if(Math.abs((p+n)-1)>tolerance)return false;
  }
  return true;
}

function scenarioDisturbance(name,cycle,rng){
  if(name==='balanced')return [0,0,0];
  if(name==='world-shock')return cycle===8?[0.85,0,0]:[0,0,0];
  if(name==='prediction-memory-shock')return cycle===8?[0,-0.85,0]:[0,0,0];
  if(name==='goal-constraint-overload')return cycle===8?[0,0,-0.85]:[0,0,0];
  if(name==='compound-shock')return cycle===8?[0.70,-0.60,-0.75]:[0,0,0];
  if(name==='persistent-constraint')return cycle>=8&&cycle<32?[0,0,-0.10]:[0,0,0];
  if(name==='repeated-shocks'){
    if(cycle===8)return [0.55,0,0];
    if(cycle===16)return [0,-0.55,0];
    if(cycle===24)return [0,0,-0.55];
    if(cycle===32)return [-0.45,0.45,0.45];
    return [0,0,0];
  }
  if(name==='chaotic-noise'){
    return cycle<4?[0,0,0]:[0,1,2].map(()=>((rng()*2)-1)*0.12);
  }
  if(name==='impracticable-saturation')return cycle===8?[3,-3,-3]:[0,0,0];
  throw new Error('UNKNOWN_PRISM_SCENARIO_'+name);
}

export function simulatePrism({
  scenario='balanced',cycles=64,seed=20261001,restoringGain=0.35,target=[0,0,0]
}={}){
  if(!Number.isInteger(cycles)||cycles<1)throw new Error('CYCLES_INVALID');
  if(!Number.isFinite(restoringGain)||restoringGain<0||restoringGain>1)throw new Error('RESTORING_GAIN_INVALID');
  assertVector(target,'TARGET');
  const rng=rng32(seed>>>0);
  let axis=[0,0,0];
  const trace=[];

  for(let cycle=0;cycle<cycles;cycle++){
    const disturbance=scenarioDisturbance(scenario,cycle,rng);
    const displaced=boundedVector(add(axis,disturbance));
    const error=displaced.map((x,i)=>x-target[i]);
    const restoring=scale(error,-restoringGain);
    const next=boundedVector(add(displaced,restoring));
    const before=norm(error);
    const after=norm(next.map((x,i)=>x-target[i]));
    const points=axisToSixPoints(next);
    trace.push(Object.freeze({
      cycle,scenario,target:[...target],axisBefore:[...axis],
      disturbance:[...disturbance],displacedAxis:displaced,
      restoring:[...restoring],axisAfter:next,points,
      displacementBefore:before,displacementAfter:after,
      recoveryStep:before>EPS?1-(after/(before+EPS)):0,
      validPoints:validateSixPoints(points)
    }));
    axis=next;
  }
  return Object.freeze(trace);
}

export function summarizePrism(trace,{convergenceTolerance=0.05}={}){
  if(!Array.isArray(trace)||!trace.length)throw new Error('TRACE_REQUIRED');
  const lastDisturbance=Math.max(-1,...trace.filter(r=>norm(r.disturbance)>EPS).map(r=>r.cycle));
  const eligible=trace.filter(r=>r.displacementBefore>EPS);
  const convergence=trace.find(r=>r.cycle>=lastDisturbance&&r.displacementAfter<=convergenceTolerance);
  const summary={
    cycles:trace.length,
    maxDisplacement:Math.max(...trace.map(r=>r.displacementAfter)),
    finalDisplacement:trace.at(-1).displacementAfter,
    meanRecoveryStep:eligible.length?eligible.reduce((s,r)=>s+r.recoveryStep,0)/eligible.length:0,
    positiveRecoveryFraction:eligible.length?eligible.filter(r=>r.recoveryStep>0).length/eligible.length:1,
    lastDisturbanceCycle:lastDisturbance,
    convergenceCycle:convergence?.cycle??null,
    allFinite:trace.every(r=>[
      ...r.axisAfter,...r.disturbance,...r.restoring,r.displacementBefore,r.displacementAfter,r.recoveryStep
    ].every(Number.isFinite)),
    allPointsValid:trace.every(r=>r.validPoints)
  };
  summary.digest=crypto.createHash('sha256').update(JSON.stringify(trace)).digest('hex');
  return Object.freeze(summary);
}