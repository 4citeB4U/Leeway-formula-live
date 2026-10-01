import fs from 'node:fs';
import os from 'node:os';
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {simulateWorld} from './simulator.mjs';

const METRICS=[
 'belief_entropy_nats',
 'precision_weighted_prediction_error',
 'valence_free_energy_rate',
 'belief_information_gain_nats',
 'selected_policy_expected_free_energy',
 'global_access_ratio'
];
const SCENARIOS=['stationary','changing','noisy','misleading','module-dropout'];

function flatten(worlds){
  const out=Object.fromEntries(METRICS.map(k=>[k,[]]));
  for(const receipts of worlds)for(const r of receipts)for(const k of METRICS)out[k].push(r.metrics[k]);
  return out;
}
function quantile(values,q){
  const a=[...values].sort((x,y)=>x-y);
  if(!a.length)return NaN;
  const pos=(a.length-1)*q,lo=Math.floor(pos),hi=Math.ceil(pos);
  return lo===hi?a[lo]:a[lo]+(a[hi]-a[lo])*(pos-lo);
}
function stats(v){
  const mean=v.reduce((a,b)=>a+b,0)/v.length;
  return {n:v.length,min:Math.min(...v),max:Math.max(...v),mean,
    q005:quantile(v,.005),q01:quantile(v,.01),q50:quantile(v,.5),q99:quantile(v,.99),q995:quantile(v,.995)};
}
function aggregateMetrics(chunks){
  const out=Object.fromEntries(METRICS.map(k=>[k,[]]));
  for(const c of chunks)for(const k of METRICS)out[k].push(...c.metrics[k]);
  return out;
}
function rangeSnapshot(metrics){
  return Object.fromEntries(METRICS.map(k=>[k,{low:quantile(metrics[k],.005),high:quantile(metrics[k],.995)}]));
}
function rangeDelta(a,b){
  let worst=0;
  for(const k of METRICS){
    const span=Math.max(1e-9,Math.abs(a[k].high-a[k].low),Math.abs(b[k].high-b[k].low));
    worst=Math.max(worst,Math.abs(a[k].low-b[k].low)/span,Math.abs(a[k].high-b[k].high)/span);
  }
  return worst;
}
async function runChunk({start,count,cycles,seed,scenarios}){
  const worlds=[];
  for(let i=0;i<count;i++){
    const index=start+i;
    const scenario=scenarios[index%scenarios.length];
    worlds.push(simulateWorld({worldIndex:index,scenario,cycles,seed}));
  }
  return {metrics:flatten(worlds),sample:worlds.slice(0,2).flat().slice(0,8)};
}
async function runParallel({worlds,cycles,seed,workers,offset=0}){
  const n=Math.max(1,Math.min(workers,worlds));
  if(n===1)return [await runChunk({start:offset,count:worlds,cycles,seed,scenarios:SCENARIOS})];
  const jobs=[];let assigned=0;
  for(let w=0;w<n;w++){
    const count=Math.floor(worlds/n)+(w<worlds%n?1:0);
    const start=offset+assigned;assigned+=count;
    jobs.push(new Promise((resolve,reject)=>{
      const worker=new Worker(new URL(import.meta.url),{workerData:{start,count,cycles,seed,scenarios:SCENARIOS}});
      worker.on('message',resolve);worker.on('error',reject);worker.on('exit',c=>c&&reject(new Error('worker exit '+c)));
    }));
  }
  return Promise.all(jobs);
}
if(!isMainThread){
  runChunk(workerData).then(x=>parentPort.postMessage(x)).catch(e=>{throw e});
}else{
  const cycles=32,seed=20261001;
  const available=Math.max(1,typeof os.availableParallelism==='function'?os.availableParallelism():os.cpus().length||1);
  const candidateWorkers=[1,2,4].filter(x=>x<=available);
  const bench=[];
  let reference=null;
  for(const workers of candidateWorkers){
    const t0=process.hrtime.bigint();
    const chunks=await runParallel({worlds:320,cycles,seed,workers});
    const elapsedMs=Number(process.hrtime.bigint()-t0)/1e6;
    const metrics=aggregateMetrics(chunks);
    const checksum=METRICS.map(k=>metrics[k].reduce((a,b)=>a+b,0).toFixed(9)).join('|');
    if(reference===null)reference=checksum;
    if(checksum!==reference)throw new Error('WORKER_DETERMINISM_MISMATCH');
    bench.push({workers,elapsedMs:Number(elapsedMs.toFixed(3)),cycles:320*cycles,checksum});
  }
  bench.sort((a,b)=>a.elapsedMs-b.elapsedMs);
  const selectedWorkers=bench[0].workers;
  const batches=[];let all=Object.fromEntries(METRICS.map(k=>[k,[]]));
  let previous=null,stableRuns=0,worldOffset=0;
  const minBatches=4,maxBatches=32,batchWorlds=128,tolerance=.02,stableNeeded=3;
  const samples=[];
  for(let batch=1;batch<=maxBatches;batch++){
    const t0=process.hrtime.bigint();
    const chunks=await runParallel({worlds:batchWorlds,cycles,seed,workers:selectedWorkers,offset:worldOffset});
    worldOffset+=batchWorlds;
    const m=aggregateMetrics(chunks);
    for(const k of METRICS)all[k].push(...m[k]);
    if(samples.length<24)for(const c of chunks)samples.push(...c.sample.slice(0,Math.max(0,24-samples.length)));
    const snap=rangeSnapshot(all);
    const delta=previous?rangeDelta(previous,snap):null;
    if(batch>=minBatches && delta!==null && delta<=tolerance)stableRuns++;else stableRuns=0;
    const elapsedMs=Number(process.hrtime.bigint()-t0)/1e6;
    batches.push({batch,worldsTotal:worldOffset,cyclesTotal:worldOffset*cycles,elapsedMs:Number(elapsedMs.toFixed(3)),rangeDelta:delta,stableRuns});
    previous=snap;
    if(stableRuns>=stableNeeded)break;
  }
  const metricStats=Object.fromEntries(METRICS.map(k=>[k,stats(all[k])]));
  const ranges=Object.fromEntries(METRICS.map(k=>[k,[metricStats[k].q005,metricStats[k].q995]]));
  const summary={
    schemaVersion:'0.1.0',status:'CALIBRATION_CANDIDATE_MEASURED_NOT_FORMULA_EXECUTED',
    seed,cyclesPerWorld:cycles,scenarioFamilies:SCENARIOS,
    workerBenchmark:bench,selectedWorkers,batchWorlds,batches,
    totalWorlds:worldOffset,totalCycles:worldOffset*cycles,metricStats,
    convergence:{tolerance,stableNeeded,achieved:stableRuns>=stableNeeded},
    formulaExecution:'NOT_EXECUTED',
    claimBoundary:'Measured simulator distributions only. Ranges are candidate calibration evidence pending Veritas, ablation and domain-adapter promotion.'
  };
  const calibration={
    mappingId:'machine-consciousness-awareness-v0',
    status:'CANDIDATE_RANGES_FROM_SIMULATOR',
    provenance:{seed,totalWorlds:worldOffset,totalCycles:worldOffset*cycles,scenarioFamilies:SCENARIOS},
    ranges,
    formulaExecutionState:'NOT_EXECUTED',
    nextGate:'Veritas tests, ablations, malformed-input tests, then explicit authorization before runtime-state-v1 Formula evaluation.'
  };
  fs.mkdirSync(new URL('./outputs/',import.meta.url),{recursive:true});
  fs.writeFileSync(new URL('./outputs/compute-benchmark.json',import.meta.url),JSON.stringify({selectedWorkers,bench},null,2)+'\n');
  fs.writeFileSync(new URL('./outputs/campaign-summary.json',import.meta.url),JSON.stringify(summary,null,2)+'\n');
  fs.writeFileSync(new URL('./outputs/calibration-candidate.json',import.meta.url),JSON.stringify(calibration,null,2)+'\n');
  fs.writeFileSync(new URL('./outputs/sample-cycles.jsonl',import.meta.url),samples.map(x=>JSON.stringify(x)).join('\n')+'\n');
  console.log(JSON.stringify({selectedWorkers,totalWorlds:worldOffset,totalCycles:worldOffset*cycles,batches:batches.length,converged:stableRuns>=stableNeeded,ranges},null,2));
}