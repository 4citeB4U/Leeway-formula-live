import fs from 'node:fs';
import crypto from 'node:crypto';
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {simulateWorld} from '../machine-consciousness-v0/simulator.mjs';

const COUNTS=[1,2,4,8,12,16,20];

function hashReceipts(receipts){
  const h=crypto.createHash('sha256');
  for(const r of receipts)h.update(r.stateHash);
  return h.digest('hex');
}
function checksumWorldHashes(hashes){
  return crypto.createHash('sha256').update(hashes.join('|')).digest('hex');
}
async function cpuChunk({start,count,cycles,seed}){
  const worldHashes=[];
  for(let i=0;i<count;i++){
    const receipts=simulateWorld({worldIndex:start+i,scenario:'stationary',cycles,seed});
    worldHashes.push(hashReceipts(receipts));
  }
  return {worldHashes,cycles:count*cycles};
}
async function cpuParallel(workers,{worlds=200,cycles=32,seed=20261001}={}){
  if(workers===1){
    const t0=process.hrtime.bigint();
    const r=await cpuChunk({start:0,count:worlds,cycles,seed});
    return {workers,elapsedMs:Number(process.hrtime.bigint()-t0)/1e6,cycles:r.cycles,checksum:checksumWorldHashes(r.worldHashes)};
  }
  const jobs=[];let assigned=0;
  const t0=process.hrtime.bigint();
  for(let w=0;w<workers;w++){
    const count=Math.floor(worlds/workers)+(w<worlds%workers?1:0);
    if(count===0)continue;
    const start=assigned;assigned+=count;
    jobs.push(new Promise((resolve,reject)=>{
      const wk=new Worker(new URL(import.meta.url),{workerData:{kind:'cpu',start,count,cycles,seed}});
      wk.on('message',resolve);wk.on('error',reject);wk.on('exit',c=>c&&reject(new Error('worker exit '+c)));
    }));
  }
  const chunks=await Promise.all(jobs);
  const worldHashes=chunks.flatMap(c=>c.worldHashes);
  return {workers,elapsedMs:Number(process.hrtime.bigint()-t0)/1e6,cycles:chunks.reduce((s,x)=>s+x.cycles,0),checksum:checksumWorldHashes(worldHashes)};
}

function deterministicPayload(i){
  return crypto.createHash('sha256').update('leeway-io-task:'+i).digest('hex');
}
async function ioTask(i,delayMs=20){
  await new Promise(r=>setTimeout(r,delayMs));
  let x=deterministicPayload(i);
  for(let k=0;k<25;k++)x=crypto.createHash('sha256').update(x).digest('hex');
  return x;
}
async function ioPool(concurrency,{tasks=200,delayMs=20}={}){
  let next=0;const results=new Array(tasks);
  const t0=process.hrtime.bigint();
  async function runner(){
    while(true){
      const i=next++; if(i>=tasks)return;
      results[i]=await ioTask(i,delayMs);
    }
  }
  await Promise.all(Array.from({length:concurrency},()=>runner()));
  const elapsedMs=Number(process.hrtime.bigint()-t0)/1e6;
  const checksum=crypto.createHash('sha256').update(results.join('|')).digest('hex');
  return {logicalWorkers:concurrency,elapsedMs,tasks,throughput:tasks/(elapsedMs/1000),checksum};
}

if(!isMainThread){
  if(workerData.kind==='cpu') cpuChunk(workerData).then(x=>parentPort.postMessage(x));
}else{
  const cpu=[];
  for(const n of COUNTS)cpu.push(await cpuParallel(n));
  const cpuBase=cpu[0].elapsedMs;
  for(const x of cpu){x.speedup=cpuBase/x.elapsedMs;x.efficiency=x.speedup/x.workers;}
  if(new Set(cpu.map(x=>x.checksum)).size!==1)throw new Error('CPU_DETERMINISM_MISMATCH');
  const io=[];
  for(const n of COUNTS)io.push(await ioPool(n));
  const ioBase=io[0].elapsedMs;
  for(const x of io){x.speedup=ioBase/x.elapsedMs;x.efficiency=x.speedup/x.logicalWorkers;}
  if(new Set(io.map(x=>x.checksum)).size!==1)throw new Error('IO_DETERMINISM_MISMATCH');
  const out={
    schemaVersion:'0.1.0',
    status:'PARALLELISM_BASELINE_MEASURED',
    cpuBound:{workload:'machine-consciousness stationary simulator',worlds:200,cyclesPerWorld:32,results:cpu},
    waitHeavy:{workload:'synthetic training-orchestration proxy: 20ms wait + deterministic hash work',tasks:200,results:io},
    goal:'Find workload/scheduler conditions where 20 logical workers outperform one without sacrificing determinism or increasing total waste.',
    claimBoundary:'The wait-heavy workload is a synthetic orchestration proxy, not measured QLoRA/DPO training.'
  };
  fs.mkdirSync(new URL('./outputs/',import.meta.url),{recursive:true});
  fs.writeFileSync(new URL('./outputs/parallelism-baseline.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
  console.log(JSON.stringify(out,null,2));
}