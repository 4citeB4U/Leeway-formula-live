/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G42.BENCHMARK
TAG: LEEWAY.G42.SILO_PERFORMANCE_COMPARED_TO_SCALAR_CPU
5WH:
WHAT = Measure exact 64x64x8 compression and compute reuse against independent direct CPU math.
WHY = Less arithmetic is not necessarily less end-to-end time; high-entropy data may not compress.
WHO = Creator-authorized LeeWay engineering; not a GPU hardware benchmark.
WHERE = Formula experimental-v2/benchmark-silos.mjs
WHEN = 2026-10-22
HOW = Warmed deterministic synthetic repeated/diverse tiles; median per-operation CPU stopwatch; numerical oracle.
LICENSE: MIT
AUTHORITY: Local CPU-only diagnostic, no physical GPU or production certification.
*/
import {performance} from 'node:perf_hooks';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {encodeExactMathSilo,decodeExactMathSilo,deriveMathTileStates,
 applyExactTileReuseOperation} from './compressive-math-silos.mjs';
const rand=x=>((Math.imul(x,1664525)+1013904223)>>>0);
function fixture(side,repeated){
 let state=123456789;
 return Float64Array.from({length:side*side*8},(_,i)=>{
  if(!repeated){state=rand(state);return state/4294967296;}
  const x=Math.floor(i/8)%side,y=Math.floor(Math.floor(i/8)/side),c=i%8;
  return (x%8*3+y%8*5+c*7)/16;
 });
}
const scales=[2,3,4,5,6,7,8,9],offsets=[-1,1,-2,2,-3,3,-4,4];
function direct(src){return Float64Array.from(src,(x,i)=>x*scales[i%8]+offsets[i%8])}
function timed(fn,runs=35){
 for(let i=0;i<5;i++)fn();
 const samples=[];
 for(let i=0;i<runs;i++){const start=performance.now();fn();samples.push(performance.now()-start)}
 samples.sort((a,b)=>a-b);
 return {medianMs:samples[Math.floor(samples.length/2)],minMs:samples[0],
  p95Ms:samples[Math.floor(.95*(samples.length-1))],runs};
}
function verifiedEqual(a,b){if(a.length!==b.length)throw Error('G42_BENCHMARK_LENGTH_DIFFERENT');
 for(let i=0;i<a.length;i++)if(!Object.is(a[i],b[i]))throw Error('G42_BENCHMARK_ORACLE_MISMATCH')}
const measurements=[];
for(const side of [32,64])for(const repeated of [true,false]){
 const src=fixture(side,repeated),archive=encodeExactMathSilo(src,{side});
 const restored=decodeExactMathSilo(archive).tensor;verifiedEqual(restored,src);
 const directResult=direct(src);
 const tiled=applyExactTileReuseOperation(archive,{scales,offsets});
 verifiedEqual(tiled.result,directResult);
 const stats=deriveMathTileStates(archive,{parameters:32});
 const directTiming=timed(()=>direct(src));
 const endToEndTiming=timed(()=>{
  const compressed=encodeExactMathSilo(src,{side});
  deriveMathTileStates(compressed,{parameters:32});
  applyExactTileReuseOperation(compressed,{scales,offsets});
 },25);
 const reuseTiming=timed(()=>applyExactTileReuseOperation(archive,{scales,offsets}),25);
 const manifestBytes=Buffer.byteLength(JSON.stringify(archive.manifest));
 const storedBytes=archive.payload.length+manifestBytes;
 measurements.push({
  shape:[side,side,8],fixture:repeated?'SYNTHETIC_REPETITIVE':'SYNTHETIC_PSEUDORANDOM',
  dtype:'float64',sourceBytes:archive.manifest.rawBytes,
  compressedPayloadBytes:archive.manifest.payloadBytes,
  metadataBytes:manifestBytes,totalStoredBytes:storedBytes,
  physicalBytesSaved:archive.manifest.rawBytes-storedBytes,
  selectedCodec:archive.manifest.codec,
  uniqueTiles:archive.manifest.uniqueTileCount,totalTiles:archive.manifest.tileCount,
  exactRoundtrip:true,independentNumericOracle:true,
  stateParametersPerTile:stats.parametersPerTile,
  scalarEvaluationsAfterReuse:tiled.receipt.scalarEvaluations,
  independentScalarEvaluations:tiled.receipt.independentScalarEvaluations,
  directCpu:directTiming,
  siloReuseFromPrepacked:reuseTiming,
  siloEncodeStateAndCompute:endToEndTiming,
  fasterThanDirectCpuEndToEnd:endToEndTiming.medianMs<directTiming.medianMs
 });
}
const report={
 schema:'leeway.formula.experimental-v2.g42.synthetic-performance.v1',
 mode:'CPU_ONLY_NOT_NVIDIA_COMPARISON',
 host:'LOCAL_NODE_WORKSTATION',sampleCount:measurements.length,
 tests:measurements,originalFormulaChanged:false,
 claims:{
  allRawStoredExact:true,fullMathStatesAreLossy:true,
  historical16x6PolicyApproved:false,noPhysicalGPUUsed:true,
  universalSpeedupClaim:false,productionReady:false
 }
};
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
 console.log(JSON.stringify(report,null,2));
export {report};
