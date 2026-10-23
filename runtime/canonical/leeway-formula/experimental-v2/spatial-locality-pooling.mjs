/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.LOCALITY_PRESERVING_TENSOR_REDUCTION
TAG: LEEWAY.G44.ENUMERATED_ENU_LOCAL_NEIGHBORS_2X2
5WH:
WHAT = Preserve x/y adjacency and spatial coordinates while reducing 64x64x8 source blocks to 32x32x8.
WHY = G43's periodic x modulo 32 folding aliases distant cells and is not a qualified geospatial pooling kernel.
WHO = Creator-authorized LeeWay engineering. Real coordinate provenance and math policy remain separate.
WHERE = Formula experimental-v2/spatial-locality-pooling.mjs
WHEN = 2026-10-22
HOW = Within-block 2x2 box averaging, explicit ENU-origin metadata, exact G42 pooled block archive and independent neighbor oracle.
LICENSE: MIT
AUTHORITY: Experimental CPU numerical kernel, not a signed GPU execution policy or Cesium/Three.js runtime.
*/
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {encodeExactMathSilo,decodeExactMathSilo} from './compressive-math-silos.mjs';
import {wgs84GeodeticToEcef} from './spatial-geometry-math.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const fail=s=>{throw Error(s)};
const codecValue=(x)=>x instanceof Float32Array||x instanceof Float64Array;
const FLOATS_PER_BLOCK=32*32*8;
const asRaw=(v)=>{const b=Buffer.alloc(v.length*8);
 v.forEach((n,i)=>b.writeDoubleLE(n,i*8));return b};
export function reduceLocal2x2(source,{sourceSide=64}={}){
 if(!codecValue(source)||sourceSide!==64||source.length!==64*64*8||
    !source.every(Number.isFinite))
  fail('G44_64x64x8_FINITE_INPUT_REQUIRED');
 const output=new Float64Array(FLOATS_PER_BLOCK);
 for(let x=0;x<32;x++)for(let y=0;y<32;y++)for(let c=0;c<8;c++){
  const first=(x*2*64+y*2)*8+c;
  const total=source[first]+source[first+8]+
    source[first+64*8]+source[first+64*8+8];
  output[(x*32+y)*8+c]=total/4;
 }
 return output;
}
export function localTileReference(coord,reference){
 if(!Array.isArray(coord)||coord.length!==4||!coord.every(x=>Number.isSafeInteger(x)&&x>=0))
  fail('G44_TILE_COORDINATE_REQUIRED');
 if(!reference||reference.frame!=='WGS84_ANCHORED_ENU_METERS'||
   !reference.anchor||!['originEastM','originNorthM','stepEastM','stepNorthM']
     .every(k=>typeof reference[k]==='number'&&Number.isFinite(reference[k]))||
   reference.stepEastM<=0||reference.stepNorthM<=0)
  fail('G44_WGS84_ENU_REFERENCE_AND_POSITIVE_STEP_REQUIRED');
 const ecef=wgs84GeodeticToEcef(reference.anchor);
 return {
  coordinateFrame:'WGS84_ANCHORED_ENU_METERS',
  anchorWgs84:{...reference.anchor},
  anchorEcefMeters:ecef,
  tileCoordinate:[...coord],
  sourceOriginEastM:reference.originEastM+coord[0]*64*reference.stepEastM,
  sourceOriginNorthM:reference.originNorthM+coord[1]*64*reference.stepNorthM,
  reducedCellEastM:reference.stepEastM*2,
  reducedCellNorthM:reference.stepNorthM*2,
  altitudeChannelGroup:coord[2],
  logicalLane:coord[3],
  sampleFootprint:'LOCAL_CONTIGUOUS_2x2_NO_PERIODIC_WRAP'
 };
}
const hashEntry=(prior,entry)=>sha(Buffer.from(prior+sha(Buffer.from(JSON.stringify(entry)))));
export function openLocalityPoolRecorder(archiveDir,reference){
 const folder=path.join(archiveDir,'locality-pools');
 if(!fs.existsSync(archiveDir)||fs.existsSync(folder))
  fail('G44_ORIGINAL_ARCHIVE_FIRST_NO_EXISTING_LOCALITY_POOL');
 fs.mkdirSync(folder);
 const objects=path.join(folder,'objects');fs.mkdirSync(objects);
 const stream=fs.openSync(path.join(folder,'pool-ledger.jsonl'),'wx');
 const sources=new Map();
 let prev='00'.repeat(32),seq=0,ledgerClosed=false;
 const cache=new Map();
 const write=({seq:tileSeq,coord,data,rawSha256})=>{
  if(ledgerClosed||tileSeq!==seq||typeof rawSha256!=='string'||
    !/^[a-f0-9]{64}$/.test(rawSha256))fail('G44_INVALID_OR_OUT_OF_ORDER_POOL_TILE');
  const ref=localTileReference(coord,reference);
  const sourceBytes=Buffer.from(data.buffer,data.byteOffset,data.byteLength);
  if(sha(sourceBytes)!==rawSha256)fail('G44_SOURCE_TILE_SHA_MISMATCH');
  let item=cache.get(rawSha256);
  if(!item){
   const reduced=reduceLocal2x2(data);
   const exact=encodeExactMathSilo(reduced,{side:32});
   const blob=rawSha256+'.bin',manifest=rawSha256+'.json';
   fs.writeFileSync(path.join(objects,blob),exact.payload,{flag:'wx'});
   fs.writeFileSync(path.join(objects,manifest),JSON.stringify(exact.manifest),{flag:'wx'});
   item={reducedSha256:sha(asRaw(reduced)),storedBytes:exact.payload.length,
     manifestSha256:sha(Buffer.from(JSON.stringify(exact.manifest)))};
   sources.set(rawSha256,item);
   cache.set(rawSha256,item);
  }
  const entry={seq,coord:[...coord],sourceRawSha256:rawSha256,
   reducedSha256:item.reducedSha256,
   sourceOriginEastM:ref.sourceOriginEastM,
   sourceOriginNorthM:ref.sourceOriginNorthM,
   reducedCellEastM:ref.reducedCellEastM,
   reducedCellNorthM:ref.reducedCellNorthM,
   logicalLane:ref.logicalLane,altitudeChannelGroup:ref.altitudeChannelGroup};
  const next=hashEntry(prev,entry);
  fs.writeSync(stream,JSON.stringify({...entry,previousHash:prev,chainHash:next})+'\n');
  prev=next;seq++;
 };
 const finish=()=>{
  if(ledgerClosed)fail('G44_POOL_RECORDER_ALREADY_CLOSED');
  fs.fsyncSync(stream);fs.closeSync(stream);ledgerClosed=true;
  const result={
   schema:'leeway.formula.experimental-v2.g44.locality-pools.v1',
   tileCount:seq,uniqueSourceTileCount:sources.size,
   reducedTileShape:[32,32,8],reducedTileFloat64Bytes:FLOATS_PER_BLOCK*8,
   originalTileShape:[64,64,8],neighborStencil:'2x2_CONTIGUOUS_MEAN',
   spatialReference:{...reference},
   localUnsignedPoolChainRootSha256:prev,
   originalSourceArchiveRequiredForExactReconstruction:true,
   reducedWorkspaceLossy:true,
   noPeriodicCoordinateAliasing:true,
   originalFrozenFormulaV1Unmodified:true,
   noProtectedExecutionEvidence:true,productionAccepted:false
  };
  fs.writeFileSync(path.join(folder,'manifest.json'),JSON.stringify(result,null,2));
  return result;
 };
 return {folder,write,finish};
}
export function verifyLocalityPoolArchive(archiveDir){
 const folder=path.join(archiveDir,'locality-pools'),
  m=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
 const raw=fs.readFileSync(path.join(folder,'pool-ledger.jsonl'),'utf8');
 const lines=raw.trimEnd().split('\n');
 if(lines.length!==m.tileCount)fail('G44_POOL_ENTRY_COUNT_MISMATCH');
 const loaded=new Map();let prev='00'.repeat(32),lastSeq=-1;
 for(const line of lines){
  const e=JSON.parse(line);
  const {previousHash,chainHash,...data}=e;
  if(e.seq!==++lastSeq||previousHash!==prev||
     !/^[a-f0-9]{64}$/.test(e.sourceRawSha256)||
     !/^[a-f0-9]{64}$/.test(e.reducedSha256)||
     chainHash!==hashEntry(prev,data))
   fail('G44_POOL_LEDGER_HASH_OR_ORDER_MISMATCH');
  const ref=localTileReference(e.coord,m.spatialReference);
  if(ref.sourceOriginEastM!==e.sourceOriginEastM||
     ref.sourceOriginNorthM!==e.sourceOriginNorthM||
     ref.reducedCellEastM!==e.reducedCellEastM||
     ref.reducedCellNorthM!==e.reducedCellNorthM)
   fail('G44_POOL_SPATIAL_POSITION_CHANGED');
  if(!loaded.has(e.sourceRawSha256)){
   const files=path.join(folder,'objects',e.sourceRawSha256);
   const b=fs.readFileSync(files+'.bin');
   const manifest=JSON.parse(fs.readFileSync(files+'.json'),'utf8');
   const decoded=decodeExactMathSilo({manifest,payload:b});
   const hash=sha(asRaw(decoded.tensor));
   if(hash!==e.reducedSha256)fail('G44_POOL_RECONSTRUCTION_SHA_MISMATCH');
   // Independently obtain the original exact Float32 tile from the G43 archive,
   // then recompute spatially adjacent 2x2 means.
   const sourceRoot=path.join(archiveDir,'objects',e.sourceRawSha256);
   const src=decodeExactMathSilo({
    manifest:JSON.parse(fs.readFileSync(sourceRoot+'.json','utf8')),
    payload:fs.readFileSync(sourceRoot+'.bin')
   });
   const independent=reduceLocal2x2(src.tensor);
   if(sha(asRaw(independent))!==hash)
    fail('G44_ORIGINAL_SOURCE_NEIGHBOR_REFERENCE_MISMATCH');
   loaded.set(e.sourceRawSha256,hash);
  }else if(loaded.get(e.sourceRawSha256)!==e.reducedSha256)
   fail('G44_REUSED_TILE_POOL_HASH_MISMATCH');
  prev=chainHash;
 }
 if(prev!==m.localUnsignedPoolChainRootSha256)
  fail('G44_POOL_CHAIN_ROOT_MISMATCH');
 return {passed:true,tileCount:m.tileCount,uniqueVerifiedTiles:loaded.size,
  originalExactSourceRevalidated:true,spatialNeighbors2x2Verified:true,
  preservedTileCoordinates:true,physicalGpuExecuted:false,
  productionAccepted:false};
}
