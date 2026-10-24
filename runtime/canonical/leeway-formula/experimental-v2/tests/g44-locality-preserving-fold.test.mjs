/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.LOCALITY_PROOF_TEST
TAG: LEEWAY.G44.CONTIGUOUS_3D_AGGREGATION_TEST
5WH:
WHAT = Compare contiguous binning against independent oracle and reject invalid tile order.
WHY = Periodic folding mixes distant regions and creates misleading scientific states.
WHO = LeeWay engineering test candidate, not independent signed authority.
WHERE = Leeway-formula-live/runtime/canonical/leeway-formula/experimental-v2/tests/g44-locality-preserving-fold.test.mjs
WHEN = 2026-10-23
HOW = Direct coordinate-volume oracle, constant slices, range checks, trusted hashes.
LICENSE: MIT
*/
import test from 'node:test';import assert from 'node:assert/strict';
import {createG44LocalityPreservingFold,tapG44Locality} from '../locality-preserving-fold.mjs';
import {ingestHierarchicalMacroTensor,verifyHierarchicalMacroArchive,createG43SyntheticTileStream} from '../hierarchical-macro-stream.mjs';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
function* tiles(shape,fn){const [X,Y,Z,L]=shape;for(let a=0;a<X/64;a++)for(let b=0;b<Y/64;b++)for(let c=0;c<Z/8;c++)for(let lane=0;lane<L;lane++)yield {coord:[a,b,c,lane],data:Float32Array.from({length:64*64*8},(_,i)=>{const x=Math.floor(i/(64*8)),y=Math.floor(i/8)%64,z=i%8;return fn(a*64+x,b*64+y,c*8+z,lane);})};}
test('G44 preserves contiguous spatial locality; analytic 4D linear field exactly',()=>{
 const shape=[64,64,8,2],r=createG44LocalityPreservingFold(shape,{frame:{crs:'WGS84_LOCAL_ENU_METERS',originEcefM:[6378137,0,0],sampleSpacingM:[1,2,0.5]}});
 for(const t of tiles(shape,(x,y,z,lane)=>2*x+3*y+5*z+7*lane))r.push(t);
 const out=r.finish();assert.deepEqual(out.receipt.outputShape,[32,32,8]);assert.equal(out.receipt.sourceSamplesPerOutputVoxel,8);
 for(const [x,y,z] of [[0,0,0],[10,3,7],[31,31,2]]){
  const expected=2*(x*2+0.5)+3*(y*2+0.5)+5*z+3.5;
  assert.equal(out.workspace[(x*32+y)*8+z],expected)
 }
 assert.equal(out.receipt.productionAccepted,false)
});
test('G44 does not alias distant x/y/z regions as periodic fold does',()=>{
 const shape=[128,64,16,1],r=createG44LocalityPreservingFold(shape);
 for(const t of tiles(shape,(x,y,z)=>x<64?1:100))r.push(t);
 const {workspace}=r.finish();
 for(let x=0;x<32;x++)for(let y=0;y<32;y++)for(let z=0;z<8;z++)
  assert.equal(workspace[(x*32+y)*8+z],x<16?1:100)
});
test('G44 fails closed on out-of-order, missing, malformed and nonfinite data',()=>{
 const r=createG44LocalityPreservingFold([64,64,8,2]);assert.throws(()=>r.finish(),/MISSING_INPUT/);
 assert.throws(()=>r.push({coord:[0,0,0,1],data:new Float32Array(32768)}),/OUT_OF_ORDER/);
 const f=new Float32Array(32768);f[0]=NaN;
 assert.throws(()=>r.push({coord:[0,0,0,0],data:f}),/CANONICAL_FLOAT32/);
 assert.throws(()=>createG44LocalityPreservingFold([60,64,8,1]),/CANONICAL_4D/);
 assert.throws(()=>createG44LocalityPreservingFold([64,64,8,1],{frame:{crs:'WGS84_LOCAL_ENU_METERS',originEcefM:[0,0,0],sampleSpacingM:[0,1,1]}}),/FRAME_METADATA/)
});
test('G44 tap preserves stream while computing the same locality proof',()=>{
 const r=createG44LocalityPreservingFold([64,64,8,1]),base=tiles([64,64,8,1],()=>7);
 let n=0;for(const t of tapG44Locality(base,r)){n++;assert.equal(t.coord[0],0)}
 assert.equal(n,1);const x=r.finish();assert.equal(x.workspace.length,8192);
 assert.ok(x.workspace.every(v=>v===7));assert.equal(x.receipt.observedAllOutputOccupancy,true)
});
test('G44 streams the original G43 archive while independently folding grid-locality',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'leeway-g44-integrated-'));
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const shape=[128,64,16,2],fold=createG44LocalityPreservingFold(shape);
 const original=ingestHierarchicalMacroTensor({
  shape,archiveDir:dir,
  tiles:tapG44Locality(createG43SyntheticTileStream(shape,{diversity:2}),fold)
 });
 const state=fold.finish(),replay=await verifyHierarchicalMacroArchive(dir);
 assert.equal(original.report.tileCount,8);
 assert.equal(state.receipt.sourceElements,original.report.sourceElementCount==='262144'?262144:8*32768);
 assert.equal(replay.sourceHashMatches,true);
 assert.equal(replay.sourceContentRecoverableExactly,true);
 assert.equal(state.receipt.productionAccepted,false)
});
