/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G43.RECURSIVE_HIERARCHICAL_MACRO_TENSOR
TAG: LEEWAY.G43.STREAM_EXACT_SOURCE_64x64x8_TO_32x32x8
5WH:
WHAT = Process 4D macro tensors by strict 64x64x8 shards with bounded active tensor RAM, exact recoverable blobs and lossy working state.
WHY = 209715200-element source tensors cannot be replaced by a 96-value hash or summary; preserve raw math while folding only approved metrics.
WHO = Creator-authorized mathematical engineering; local experimental storage not a protected independent Ledger.
WHERE = Leeway-formula-live/runtime/canonical/leeway-formula/experimental-v2/hierarchical-macro-stream.mjs
WHEN = 2026-10-22
HOW = Canonical 4D tile enumeration, raw Float32LE hashing, existing G42 exact blob coding, reference-safe tile reuse, streaming ledger chain and mean reduction.
LICENSE: MIT
AUTHORITY: EXPERIMENTAL, NOT production software issuer/Veritas/Continuum/Receipt/Learning Ledger.
*/
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {createReadStream} from 'node:fs';
import {createInterface} from 'node:readline';
import {encodeExactMathSilo,decodeExactMathSilo} from './compressive-math-silos.mjs';
const T=64,Z=8,W=32,CHANNELS=8,INPUT_BYTES=64*64*8*4;
const OUT_ELEMENTS=32*32*8;
const sha=b=>createHash('sha256').update(b).digest('hex');
const fail=x=>{throw Error(x)};
const hexd=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
const rawView=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
const sourceShape=(shape,maxTileCount)=>{
 if(!Array.isArray(shape)||shape.length!==4||
   !shape.every(v=>Number.isSafeInteger(v)&&v>0))fail('G43_FOUR_DIMENSIONAL_POSITIVE_INTEGER_SHAPE_REQUIRED');
 const [sx,sy,sz,l]=shape;
 if(sx%64||sy%64||sz%8||l>16)fail('G43_SHAPE_NOT_ALIGNED_TO_64x64x8_OR_LANES_GT16');
 const count=sx/64*sy/64*sz/8*l;
 if(!Number.isSafeInteger(count)||count>maxTileCount)fail('G43_TILE_COUNT_EXCEEDS_EXPLICIT_BUDGET');
 const bytes=BigInt(sx)*BigInt(sy)*BigInt(sz)*BigInt(l)*4n;
 const denominator=(sx/32)*(sy/32)*(sz/8)*l;
 if(denominator*OUT_ELEMENTS!==count*64*64*8)
  fail('G43_REDUCTION_MASS_CONSERVATION_SHAPE_ERROR');
 return {count,bytes,denominator};
};
const coords=(shape)=>{const s=[];for(let x=0;x<shape[0]/64;x++)
 for(let y=0;y<shape[1]/64;y++)for(let z=0;z<shape[2]/8;z++)
 for(let lane=0;lane<shape[3];lane++)s.push([x,y,z,lane]);return s};
function partialTile(data){
 const part=new Float64Array(OUT_ELEMENTS);
 for(let x=0;x<32;x++)for(let y=0;y<32;y++){
  const base=(x*64+y)*8,upper=((x+32)*64+y)*8;
  const pos=(x*32+y)*8;
  for(let c=0;c<8;c++){
   part[pos+c]=data[base+c]+data[base+32*8+c]+
    data[upper+c]+data[upper+32*8+c];
  }
 }
 if(!part.every(Number.isFinite))fail('G43_TILE_PARTIAL_OVERFLOW');
 return part;
}
export function* createG43SyntheticTileStream(shape,{diversity=1}={}){
 sourceShape(shape,Number.MAX_SAFE_INTEGER);
 if(!Number.isInteger(diversity)||diversity<1||diversity>4096)
  fail('G43_SYNTHETIC_VARIANTS_OUTSIDE_BOUNDS');
 const variants=Array.from({length:Math.min(diversity,4096)},(_,v)=>
  Float32Array.from({length:64*64*8},(_,i)=>{
   const x=Math.floor(i/(64*8)),y=Math.floor(i/8)%64,c=i%8;
   return (((x%8)*3+(y%8)*5+c*7+v*11)%201)/16;
  }));
 let n=0;
 for(let x=0;x<shape[0]/64;x++)for(let y=0;y<shape[1]/64;y++)
 for(let z=0;z<shape[2]/8;z++)for(let lane=0;lane<shape[3];lane++)
  yield {coord:[x,y,z,lane],data:variants[n++%diversity]};
}
function outputDigest(arr){
 const b=Buffer.alloc(arr.length*8);
 arr.forEach((v,i)=>b.writeDoubleLE(v,i*8));
 return sha(b);
}
function ledgerStep(prev,entry){
 const h=sha(Buffer.from(JSON.stringify(entry),'utf8'));
 return sha(Buffer.concat([Buffer.from(prev,'hex'),Buffer.from(h,'hex')]));
}
function makeSummary(sums,denominator){
 const values=new Float64Array(OUT_ELEMENTS);
 for(let i=0;i<OUT_ELEMENTS;i++){
  values[i]=sums[i]/denominator;
  if(!Number.isFinite(values[i]))fail('G43_REDUCED_WORKSPACE_OVERFLOW');
 }
 return values;
}
const validateArchiveDir=folder=>{
 if(typeof folder!=='string'||!path.isAbsolute(folder))fail('G43_ABSOLUTE_ARCHIVE_ROOT_REQUIRED');
 if(!fs.existsSync(folder))fs.mkdirSync(folder,{recursive:true});
 if(fs.readdirSync(folder).length!==0)fail('G43_ARCHIVE_DESTINATION_MUST_BE_EMPTY');
};
export function ingestHierarchicalMacroTensor({
 shape,tiles,archiveDir,maxTileCount=10000,
 maxStoredBytes=64*1024*1024,capacityBytes=128*1024,
 verifyUniqueReadback=true
}={}){
 const {count,bytes,denominator}=sourceShape(shape,maxTileCount);
 if(!tiles||typeof tiles[Symbol.iterator]!=='function')
  fail('G43_CANONICAL_CHUNK_ITERATOR_REQUIRED');
 if(capacityBytes!==INPUT_BYTES||!Number.isSafeInteger(maxStoredBytes)||maxStoredBytes<INPUT_BYTES)
  fail('G43_EXPLICIT_CAPACITY_LIMIT_INVALID');
 validateArchiveDir(archiveDir);
 const objectDir=path.join(archiveDir,'objects');fs.mkdirSync(objectDir);
 const ledgerFile=path.join(archiveDir,'tile-ledger.jsonl');
 const fd=fs.openSync(ledgerFile,'wx');
 const iter=tiles[Symbol.iterator](),seen=new Map(),sourceHash=createHash('sha256');
 let root='00'.repeat(32),seq=0,storedBytes=0;
 let peakRss=process.memoryUsage().rss,computationReused=0,actualUniqueFoldExecutions=0;
 // Cache only eight in-flight reductions; flush accumulated partials to
 // the fixed 32x32x8 workspace before evicting an old tile.
 const contributions=new Map(),sums=new Float64Array(OUT_ELEMENTS);
 const flush=()=>{const item=contributions.entries().next().value;
  if(!item)return;
  const [key,{data,count}]=item;
  for(let i=0;i<OUT_ELEMENTS;i++)sums[i]+=data[i]*count;
  contributions.delete(key);
 };
 const t0=performance.now();
 try{
  for(let x=0;x<shape[0]/64;x++)for(let y=0;y<shape[1]/64;y++)
  for(let z=0;z<shape[2]/8;z++)for(let lane=0;lane<shape[3];lane++){
   const next=iter.next();if(next.done)fail('G43_MISSING_CANONICAL_TILE');
   const tile=next.value,expected=[x,y,z,lane];
   if(!tile||!Array.isArray(tile.coord)||tile.coord.length!==4||
     !expected.every((v,i)=>v===tile.coord[i])||
     !(tile.data instanceof Float32Array)||tile.data.length!==64*64*8||
     !tile.data.every(Number.isFinite))
     fail('G43_NONCANONICAL_MISSING_OR_NONFINITE_TILE');
   const raw=rawView(tile.data),hash=sha(raw);
   sourceHash.update(raw);
   const entry={
    seq,coord:expected,rawSha256:hash,
    sourceByteOffset:(BigInt(seq)*BigInt(INPUT_BYTES)).toString()
   };
   if(!seen.has(hash)){
    const archive=encodeExactMathSilo(tile.data,{side:64});
    if(archive.manifest.rawSha256!==hash)fail('G43_SOURCE_AND_ARCHIVE_HASH_DIVERGED');
    const blobPath=path.join(objectDir,hash+'.bin'),metaPath=path.join(objectDir,hash+'.json');
    const meta=Buffer.from(JSON.stringify(archive.manifest),'utf8');
    const additional=archive.payload.length+meta.length;
    if(storedBytes+additional>maxStoredBytes)fail('G43_DURABLE_ARCHIVE_STORAGE_BUDGET_EXCEEDED');
    fs.writeFileSync(blobPath,archive.payload,{flag:'wx'});
    fs.writeFileSync(metaPath,meta,{flag:'wx'});
    seen.set(hash,{manifest:archive.manifest,encodedBytes:additional});
    storedBytes+=additional;
   }
   if(!contributions.has(hash)){
    if(contributions.size>=8)flush();
    contributions.set(hash,{data:partialTile(tile.data),count:0});
    actualUniqueFoldExecutions++;
   }else computationReused++;
   contributions.get(hash).count++;
   const nextRoot=ledgerStep(root,entry);
   fs.writeSync(fd,JSON.stringify({...entry,previousChainHash:root,chainHash:nextRoot})+'\n');
   root=nextRoot;seq++;
   if((seq&127)===0)peakRss=Math.max(peakRss,process.memoryUsage().rss);
  }
  if(!iter.next().done)fail('G43_EXTRA_CANONICAL_TILE');
  fs.fsyncSync(fd);
 }finally{fs.closeSync(fd)}
 if(seq!==count)fail('G43_INCOMPLETE_TILE_COUNT');
 while(contributions.size)flush();
 const workspace=makeSummary(sums,denominator);
 const workspaceSha=outputDigest(workspace);
 if(verifyUniqueReadback)for(const [hash] of seen){
  const b=fs.readFileSync(path.join(objectDir,hash+'.bin'));
  const m=JSON.parse(fs.readFileSync(path.join(objectDir,hash+'.json'),'utf8'));
  const archive=decodeExactMathSilo({manifest:m,payload:b});
  if(archive.rawSha256!==hash)fail('G43_INDEPENDENT_BLOB_READBACK_HASH_MISMATCH');
 }
 const result={
  schema:'leeway.formula.experimental-v2.g43.macro-stream-checkpoint.v1',
  sourceShape:[...shape],tileShape:[64,64,8],tileCount:seq,
  sourceElementCount:(BigInt(seq)*32768n).toString(),
  sourceBytes:bytes.toString(),tileBytes:INPUT_BYTES,
  logicalSourceSha256:sourceHash.digest('hex'),
  localHashChainRootSha256:root,
  localLedgerPath:ledgerFile,archiveDir,
  distinctSourceTileHashes:seen.size,
  tilesWithComputationalReuse:computationReused,
  originalArithmeticReadsWithoutTileReuse:(BigInt(seq)*32768n).toString(),
  arithmeticReadsForUniquePartialTiles:actualUniqueFoldExecutions*32768,
  actualUniqueFoldExecutions,maximumCachedDistinctTileStates:8,
  intermediateShape:[32,32,8],
  intermediateElements:workspace.length,
  intermediateFloat64Bytes:workspace.byteLength,
  intermediateSha256:workspaceSha,
  valuesPerIntermediateElement:denominator,
  compression:{
   archiveBytesForDistinctTiles:storedBytes,
   sourceBytesSavedUnderDeduplicatedStorage:Number(bytes)-storedBytes,
   exactRawRecoverableFromLocalArchive:true,
   dataReductionLossyInWorkingState:true
  },
  memory:{
   maximumSingleLiveInputTileBytes:INPUT_BYTES,
   observedPeakProcessRssBytes:Math.max(peakRss,process.memoryUsage().rss),
   fullMonolithicTensorAllocated:false,
   metadataAndWorkingStateMemoryNotIncludedInTileLimit:true
  },
  wallMs:performance.now()-t0,
  trust:{
   inputKind:'UNTRUSTED_CALLER_TILE_STREAM',
   writtenLedgerKind:'UNSIGNED_LOCAL_EXPERIMENTAL_HASH_CHAIN',
   externalVeritasPrePostSigned:false,
   canonicalReceiptLedgerAdmitted:false,
   canonicalLearningLedgerAdmitted:false,
   policyAuthority:false,productionAccepted:false
  }
 };
 fs.writeFileSync(path.join(archiveDir,'checkpoint.json'),JSON.stringify({
  ...result,localLedgerPath:'tile-ledger.jsonl',archiveDir:'./',
  sourceKind:'CANONICAL_64x64x8_LE_TILE_ORDER_FLOAT32'
 },null,2),{flag:'wx'});
 return {report:result,workspace};
}
export async function verifyHierarchicalMacroArchive(archiveDir){
 const c=JSON.parse(fs.readFileSync(path.join(archiveDir,'checkpoint.json'),'utf8'));
 const shape=c.sourceShape,{count}=sourceShape(shape,10000000);
 if(c.tileCount!==count)fail('G43_CHECKPOINT_SOURCE_COUNT_MISMATCH');
 const objects=path.join(archiveDir,'objects');
 const src=createHash('sha256');let prev='00'.repeat(32),n=0,storedUnique=new Map();
 const rl=createInterface({input:createReadStream(path.join(archiveDir,'tile-ledger.jsonl'))});
 const sums=new Map();
 for await(const line of rl){
  const x=JSON.parse(line),expected=[
   Math.floor(n/(shape[1]/64*shape[2]/8*shape[3])),
   Math.floor(n/(shape[2]/8*shape[3]))%(shape[1]/64),
   Math.floor(n/shape[3])%(shape[2]/8),n%shape[3]];
  const e={seq:n,coord:expected,rawSha256:x.rawSha256,
   sourceByteOffset:(BigInt(n)*BigInt(INPUT_BYTES)).toString()};
  if(x.seq!==n||!expected.every((v,i)=>x.coord?.[i]===v)||
    x.sourceByteOffset!==e.sourceByteOffset||!hexd(x.rawSha256)||
    x.previousChainHash!==prev||x.chainHash!==ledgerStep(prev,e))
   fail('G43_LOCAL_LEDGER_CHAIN_OR_TILE_ORDER_INVALID');
  let raw=storedUnique.get(x.rawSha256);
  if(!raw){
   const b=fs.readFileSync(path.join(objects,x.rawSha256+'.bin'));
   const m=JSON.parse(fs.readFileSync(path.join(objects,x.rawSha256+'.json'),'utf8'));
   const restored=decodeExactMathSilo({manifest:m,payload:b});
   if(restored.rawSha256!==x.rawSha256)fail('G43_BLOB_DIGEST_MISMATCH');
   raw=rawView(restored.tensor);
   if(storedUnique.size>=8)storedUnique.delete(storedUnique.keys().next().value);
   storedUnique.set(x.rawSha256,raw);
  }
  src.update(raw);
  const state=sums.get(x.rawSha256)||0;sums.set(x.rawSha256,state+1);
  prev=x.chainHash;n++;
 }
 if(n!==count||prev!==c.localHashChainRootSha256||
   src.digest('hex')!==c.logicalSourceSha256)
  fail('G43_ARCHIVE_REPLAY_SOURCE_OR_LEDGER_HASH_MISMATCH');
 return {
  passed:true,sourceShape:shape,tileCount:n,
  independentCanonicalSourceReadbackVerified:true,
  sourceContentRecoverableExactly:true,
  sourceHashMatches:true,localLedgerChainMatches:true,
  protectedImmutableLedgerProven:false,
  productionAccepted:false
 };
}
