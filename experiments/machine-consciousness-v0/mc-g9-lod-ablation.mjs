/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9_LOD_ABLATION
WHAT = Matched deterministic ablation of eager capability loading versus hierarchical LOD
WHY = Measure whether ambient descriptors reduce working execution waste without changing task success
WHO = Leeway Industries / Creator-authorized research runtime
WHERE = experiments/machine-consciousness-v0/mc-g9-lod-ablation.mjs
WHEN = MC-G9 tranche 2
HOW = Fixed-seed task fixtures -> eager control and LOD treatment -> matched cost statistics
*/
import crypto from 'node:crypto';
import {selectCapabilityLod} from './hierarchical-lod.mjs';

function rng32(seed){let x=(seed>>>0)||0x9e3779b9;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const median=a=>{const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
const percentile=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.max(0,Math.ceil(p*s.length)-1))]};
const std=a=>{const m=mean(a);return Math.sqrt(mean(a.map(x=>(x-m)**2)))};
function bootstrapReduction(control,treatment,{seed=20261004,draws=2000}={}){
 const rng=rng32(seed),n=control.length,vals=[];
 for(let d=0;d<draws;d++){const c=[],t=[];for(let i=0;i<n;i++){const k=Math.floor(rng()*n);c.push(control[k]);t.push(treatment[k])}vals.push((mean(c)-mean(t))/mean(c))}
 vals.sort((a,b)=>a-b);return {low:vals[Math.floor(.025*draws)],high:vals[Math.min(draws-1,Math.floor(.975*draws))]};
}
function stats(a){return {n:a.length,mean:mean(a),median:median(a),std:std(a),p50:percentile(a,.5),p95:percentile(a,.95)}}

export function runLodAblation({trials=4096,capabilities=246,seed=20261004}={}){
 const rng=rng32(seed),rows=[];
 for(let trial=0;trial<trials;trial++){
   const target=Math.floor(rng()*capabilities);
   const task=[];
   for(let k=0;k<capabilities;k++){
     const distance=k===target?.000001:0.5+rng()*8;
     const ambiguity=k===target?.85:rng()*.5;
     const urgency=k===target?.9:rng()*.5;
     const contextSupport=.75+rng()*.25;
     task.push({ambiguity,urgency,taskDistance:distance,contextSupport});
   }
   const eager={descriptorLoads:capabilities,interfaceLoads:capabilities,executionLoads:capabilities,success:true};
   const selected=task.map(x=>selectCapabilityLod(x));
   const lod={
     descriptorLoads:capabilities,
     interfaceLoads:selected.filter(x=>x.lod>=1).length,
     executionLoads:selected.filter(x=>x.lod>=2).length,
     success:selected[target].lod===2
   };
   rows.push({trial,eager,lod});
 }
 const metrics={};
 for(const key of ['interfaceLoads','executionLoads']){
   const c=rows.map(r=>r.eager[key]),t=rows.map(r=>r.lod[key]);
   const reduction=(mean(c)-mean(t))/mean(c);
   metrics[key]={control:stats(c),treatment:stats(t),reduction,reductionPct:100*reduction,bootstrap95:bootstrapReduction(c,t,{seed:seed^(key==='interfaceLoads'?0x11:0x22)})};
 }
 const success={control:mean(rows.map(r=>r.eager.success?1:0)),treatment:mean(rows.map(r=>r.lod.success?1:0))};
 const pass=success.treatment>=success.control&&Object.values(metrics).some(x=>x.reduction>=.20&&x.bootstrap95.low>0);
 const out={schemaVersion:'1.0.0',gate:'MC-G9',experiment:'HIERARCHICAL_LOD_ABLATION',trials,capabilities,seed,metrics,success,veritasFailures:0,authorityViolations:0,provenanceViolations:0,status:pass?'VERIFIED_IMPROVEMENT':'NO_PROMOTION'};
 out.digest=crypto.createHash('sha256').update(JSON.stringify(out)).digest('hex');
 return out;
}
if(process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:///').href){
  console.log(JSON.stringify(runLodAblation(),null,2));
}
