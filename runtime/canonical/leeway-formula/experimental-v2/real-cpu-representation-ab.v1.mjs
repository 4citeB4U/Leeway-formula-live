/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CPU_REAL_EXECUTION.EXPERIMENT
TAG: LEEWAY.FORMULA.REPRESENTATION_AB.REAL_CPU.V1
5WH:
WHAT = Run genuine CPU/RAM exact-payload packing A/B on the actual executing host.
WHY = Measure Formula-candidate byte savings and their CPU/time cost instead of inferring PCIe gains.
WHO = Creator / original Formula source owners; outside reviewer (not Agent Lee).
WHERE = runtime/canonical/leeway-formula/experimental-v2/real-cpu-representation-ab.v1.mjs.
WHEN = 2026-11-21.
HOW = Paired raw vs bounded exact deflate, 16 chunks, seven rounds, byte/hash checks and CPU timings.
LICENSE = Existing Formula repository terms.
AUTHORITY = RESEARCH_CPU_BENCHMARK_ONLY. No real PCIe, user PC, native Device Bridge, Formula policy grant, Veritas or Receipt Authority.
*/
import {createHash,randomBytes} from 'node:crypto';
import {cpus,arch,platform,totalmem} from 'node:os';
import {performance} from 'node:perf_hooks';
import {deflateRawSync,inflateRawSync} from 'node:zlib';
const sha=b=>createHash('sha256').update(b).digest('hex');
const median=a=>{const b=[...a].sort((x,y)=>x-y);return b[Math.floor(b.length/2)];};
function runCase(name,chunks,rounds=7){
 const input=Buffer.concat(chunks), expectedHash=sha(input);
 const paired=[],order=[];let mismatch=false;
 for(let i=0;i<rounds;i++){
  const outcomes={};
  for(const mode of (i%2===0?['RAW','FORMULA_EXACT_CANDIDATE']:['FORMULA_EXACT_CANDIDATE','RAW'])){
   const before=process.cpuUsage(),t=performance.now();
   let encoded,decoded,representation='RAW',attemptedCompressionBytes=null;
   if(mode==='RAW'){
     // Raw 16-block transfer capsule without compression.
     encoded=Buffer.concat(chunks.map(b=>Buffer.from(b)));
     decoded=encoded;
   }else{
     const original=Buffer.concat(chunks);
     const compressed=deflateRawSync(original,{level:1});
     attemptedCompressionBytes=compressed.length;
     if(compressed.length<original.length){
       representation='LOSSLESS_DEFLATE';
       encoded=compressed;
       decoded=inflateRawSync(encoded);
     }else{
       representation='RAW_INCOMPRESSIBLE_FALLBACK';
       encoded=original;
       decoded=encoded;
     }
   }
   const wallMs=performance.now()-t,cpu=process.cpuUsage(before);
   const hash=sha(decoded);
   if(hash!==expectedHash||decoded.length!==input.length||!decoded.equals(input))mismatch=true;
   outcomes[mode]={representation,encodedBytes:encoded.length,originalBytes:input.length,
    attemptedCompressionBytes,wallMs,cpuUserMs:cpu.user/1000,cpuSystemMs:cpu.system/1000,
    restoredSha256:hash,exactReconstruction:hash===expectedHash&&decoded.equals(input)};
   }
   paired.push(outcomes);order.push(i%2===0?'RAW_FIRST':'CANDIDATE_FIRST');
 }
 const raw=paired.map(p=>p.RAW),cand=paired.map(p=>p.FORMULA_EXACT_CANDIDATE);
 return {
  dataset:name,sourceContentSha256:expectedHash,chunkCount:chunks.length,inputBytes:input.length,
  rounds,order,allExactReconstruction:!mismatch,
  baseline:{payloadBytes:raw[0].encodedBytes,medianWallMs:median(raw.map(x=>x.wallMs)),
    medianCpuUserMs:median(raw.map(x=>x.cpuUserMs)),medianCpuSystemMs:median(raw.map(x=>x.cpuSystemMs))},
  formulaCandidate:{representation:cand[0].representation,payloadBytes:cand[0].encodedBytes,
    attemptedCompressionBytes:cand[0].attemptedCompressionBytes,
    medianWallMs:median(cand.map(x=>x.wallMs)),
    medianCpuUserMs:median(cand.map(x=>x.cpuUserMs)),
    medianCpuSystemMs:median(cand.map(x=>x.cpuSystemMs))},
  percentPayloadBytesReduced:100*(1-cand[0].encodedBytes/raw[0].encodedBytes),
  wallTimeReduced:false,candidatePolicyQualified:false,
  physicalPcieTransferMeasured:false,
  ownerPcPrimaryCpuExecuted:false,
  measuredHostCpuExecution:true,
  vendorGpuComputeDispatched:false
 };
}
export function executeRealCpuRepresentationAB(){
 const cpu=cpus();
 const size=32768,count=16;
 const redundant=Array.from({length:count},(_,i)=>Buffer.alloc(size,i%4===0?0x53:0x53));
 const random=Buffer.from(randomBytes(size*count));
 const highEntropy=Array.from({length:count},(_,i)=>random.subarray(i*size,(i+1)*size));
 const cases=[runCase('REDUNDANT_REPEATABLE_BYTES',redundant),runCase('HIGH_ENTROPY_RANDOM_BYTES',highEntropy)];
 if(cases.some(c=>!c.allExactReconstruction))throw Error('FORMULA_EXACT_ROUNDTRIP_FAILED');
 return {
  schema:'leeway.formula.real-cpu-representation-ab.v1',
  status:'MEASURED_CPU_ON_EXECUTING_HOST_NO_PCIE',
  executionEnvironment:process.env.GITHUB_ACTIONS==='true'?'GITHUB_ACTIONS_RUNNER':'OTHER_NODE_HOST',
  executionHost:{platform:platform(),architecture:arch(),cpuModel:cpu[0]?.model??'UNKNOWN',
    logicalProcessors:cpu.length,totalRamBytes:totalmem(),node:process.version},
  comparedPolicy:'RAW_TRANSFER_CAPSULE_VS_EXACT_COMPRESSION_WITH_RAW_FALLBACK',
  sampleCount:16,physicalPcieTransferMeasured:false,
  nativeUserPcExecuted:false,userPhysicalGpuUsed:false,
  sourceResultClassification:'PHYSICAL_CPU_EXECUTION_ONLY_NOT_LEEWAY_GPU_PRODUCTION',
  cases,
  independentlyVeritasCertified:false,canonicalReceiptAuthorityIssued:false
 };
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 console.log(JSON.stringify(executeRealCpuRepresentationAB(),null,2));
}
