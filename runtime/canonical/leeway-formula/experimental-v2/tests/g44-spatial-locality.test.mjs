/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.SPATIAL_NUMERIC_TEST
TAG: LEEWAY.G44.LOCAL_2X2_NEIGHBOR_ORACLE_BOUNDED_SOURCE
5WH:
WHAT = Verify spatially adjacent cell arithmetic, ENU coordinate extents, exact archive replay and tamper rejection.
WHY = Periodic modulo-32 folding used to mix distant cells; this must remain distinguishable.
WHO = LeeWay creator-authorized engineering; experimental synthetic data only.
WHERE = Formula experimental-v2/tests/g44-spatial-locality.test.mjs
WHEN = 2026-10-22
HOW = Analytic spatial ramps, impulse separation, G43 bounded stream hook and G42 bit-verified readback.
LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {reduceLocal2x2,localTileReference,openLocalityPoolRecorder,
 verifyLocalityPoolArchive} from '../spatial-locality-pooling.mjs';
import {ingestHierarchicalMacroTensor,createG43SyntheticTileStream,
 verifyHierarchicalMacroArchive} from '../hierarchical-macro-stream.mjs';
const ref={
 frame:'WGS84_ANCHORED_ENU_METERS',
 anchor:{latDeg:43.0389,lonDeg:-87.9065,heightM:188},
 originEastM:0,originNorthM:0,stepEastM:0.5,stepNorthM:0.5
};
const temp=t=>{const p=fs.mkdtempSync(path.join(os.tmpdir(),'leeway-g44-test-'));
 t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p};
test('G44 local contiguous 2x2 averages preserve x-y gradients and exact neighborhood stencil',()=>{
 const src=Float32Array.from({length:64*64*8},(_,i)=>{
  const x=Math.floor(i/(64*8)),y=Math.floor(i/8)%64,c=i%8;
  return x*100+y*10+c;
 });
 const out=reduceLocal2x2(src);
 assert.equal(out.length,8192);
 for(const [x,y,c] of [[0,0,0],[1,0,7],[16,16,4],[31,31,0]]){
  const expected=(2*x+0.5)*100+(2*y+0.5)*10+c;
  assert.equal(out[(x*32+y)*8+c],expected);
 }
 assert.throws(()=>reduceLocal2x2(new Float32Array(32*32*8)),/FINITE_INPUT_REQUIRED/);
});
test('G44 distant cell impulse does not alias into same 32x32 bin',()=>{
 const src=new Float32Array(64*64*8);
 src[(0*64+0)*8]=8;src[(32*64+32)*8]=12;
 const pooled=reduceLocal2x2(src);
 assert.equal(pooled[(0*32+0)*8],2);
 assert.equal(pooled[(16*32+16)*8],3);
 assert.equal(pooled[(0*32+16)*8],0);
});
test('G44 WGS84 anchor and ENU tile position preserve physical coordinate origins',()=>{
 const a=localTileReference([0,0,0,0],ref);
 const b=localTileReference([2,3,1,5],ref);
 assert.equal(a.reducedCellEastM,1);
 assert.equal(a.reducedCellNorthM,1);
 assert.equal(b.sourceOriginEastM,64);
 assert.equal(b.sourceOriginNorthM,96);
 assert.equal(b.altitudeChannelGroup,1);
 assert.equal(b.logicalLane,5);
 assert.ok(a.anchorEcefMeters.every(Number.isFinite));
 assert.throws(()=>localTileReference([0,0,0,0],{...ref,stepEastM:0}),/POSITIVE_STEP/);
});
test('G44 original G43 source, per-tile ENU pooling, and two replay paths agree',async t=>{
 const dir=temp(t),shape=[128,64,16,2];let recorder;
 const x=ingestHierarchicalMacroTensor({
  shape,tiles:createG43SyntheticTileStream(shape,{diversity:2}),
  archiveDir:dir,onCanonicalTile:item=>{
   if(!recorder)recorder=openLocalityPoolRecorder(dir,ref);
   recorder.write(item);
  }
 });
 const info=recorder.finish();
 assert.equal(info.tileCount,8);
 assert.equal(info.uniqueSourceTileCount,2);
 assert.equal(x.report.tileCount,8);
 const a=await verifyHierarchicalMacroArchive(dir);
 const b=verifyLocalityPoolArchive(dir);
 assert.equal(a.passed,true);
 assert.equal(b.passed,true);
 assert.equal(b.uniqueVerifiedTiles,2);
 assert.equal(b.spatialNeighbors2x2Verified,true);
 assert.equal(b.productionAccepted,false);
});
test('G44 altered spatial position or pooled blob is detected',t=>{
 const dir=temp(t),shape=[64,64,8,1];let rec;
 ingestHierarchicalMacroTensor({
  shape,tiles:createG43SyntheticTileStream(shape),archiveDir:dir,
  onCanonicalTile:item=>{
   if(!rec)rec=openLocalityPoolRecorder(dir,ref);
   rec.write(item);
  }
 });
 rec.finish();
 const journal=path.join(dir,'locality-pools','pool-ledger.jsonl');
 const original=fs.readFileSync(journal,'utf8');
 fs.writeFileSync(journal,original.replace('"sourceOriginEastM":0','"sourceOriginEastM":9999'));
 assert.throws(()=>verifyLocalityPoolArchive(dir),/POOL_LEDGER_HASH_OR_ORDER/);
 fs.writeFileSync(journal,original);
 const obj=path.join(dir,'locality-pools','objects');
 const blob=path.join(obj,fs.readdirSync(obj).find(f=>f.endsWith('.bin')));
 const bytes=fs.readFileSync(blob),changed=Buffer.from(bytes);changed[0]^=1;
 fs.writeFileSync(blob,changed);
 assert.throws(()=>verifyLocalityPoolArchive(dir),/PAYLOAD_HASH_MISMATCH/);
});

test('G44 high-entropy tiles do not receive invented deduplication or compression success',async t=>{
 const shape=[128,128,8,2],dir=temp(t);
 let rec,seed=0xace44120;
 function* chunks(){
  for(let x=0;x<2;x++)for(let y=0;y<2;y++)for(let lane=0;lane<2;lane++){
   const data=new Float32Array(32768);
   for(let k=0;k<data.length;k++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    data[k]=seed/2**32;
   }
   yield {coord:[x,y,0,lane],data};
  }
 }
 const output=ingestHierarchicalMacroTensor({
  shape,archiveDir:dir,tiles:chunks(),maxStoredBytes:32*1024*1024,
  onCanonicalTile:item=>{
   if(!rec)rec=openLocalityPoolRecorder(dir,ref);
   rec.write(item);
  }
 });
 rec.finish();
 assert.equal(output.report.tileCount,8);
 assert.equal(output.report.distinctSourceTileHashes,8);
 assert.equal(output.report.tilesWithComputationalReuse,0);
 assert.ok(output.report.compression.archiveBytesForDistinctTiles>0);
 assert.equal((await verifyHierarchicalMacroArchive(dir)).passed,true);
 assert.equal(verifyLocalityPoolArchive(dir).passed,true);
});
