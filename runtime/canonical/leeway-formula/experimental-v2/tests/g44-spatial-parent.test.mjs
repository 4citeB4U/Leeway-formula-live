/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.SECOND_LEVEL_SPATIAL_POOL_TEST
TAG: LEEWAY.G44.SPATIAL_PARENT_NEIGHBOR_TRUTH
5WH:
WHAT = Test second-level local 128x128 x 8 source area to 32x32x8 parent.
WHY = True recursive hierarchy needs four contiguous tiles and no silently padded edges.
WHO = LeeWay creator-authorized experimental engineer; not approved geospatial semantics.
WHERE = Formula experimental-v2/tests/g44-spatial-parent.test.mjs
WHEN = 2026-10-22
HOW = Independent global-coordinate analytical oracle and rejection of topology/coordinate violations.
LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {reduceLocal2x2} from '../spatial-locality-pooling.mjs';
import {poolAdjacentSpatialChildren} from '../spatial-parent-pooling.mjs';
const create=(bx,by,z=1,l=3)=>{
 const src=Float32Array.from({length:64*64*8},(_,idx)=>{
  const lx=Math.floor(idx/(64*8)),ly=Math.floor(idx/8)%64,ch=idx%8;
  return (bx*64+lx)*100+(by*64+ly)*10+ch;
 });
 return {coord:[bx,by,z,l],data:reduceLocal2x2(src)};
};
test('G44 exact two-level local pooling matches independent 4x4 reference on 128x128',()=>{
 const children=[create(0,0),create(0,1),create(1,0),create(1,1)];
 const parent=poolAdjacentSpatialChildren(children);
 assert.deepEqual(parent.parentCoord,[0,0,1,3]);
 assert.deepEqual(parent.parentShape,[32,32,8]);
 assert.equal(parent.cellsFromOriginalSource,16);
 for(const [x,y,ch] of [[0,0,0],[0,31,7],[31,0,2],[31,31,5]]){
  const expected=(x*4+1.5)*100+(y*4+1.5)*10+ch;
  assert.equal(parent.data[(x*32+y)*8+ch],expected);
 }
 assert.equal(parent.noSyntheticEdgePadding,true);
});
test('G44 second-level pool cannot combine noncontiguous sources or mismatched time lane',()=>{
 const chunks=[create(2,4),create(2,5),create(3,4),create(3,5)];
 const parent=poolAdjacentSpatialChildren(chunks);
 assert.deepEqual(parent.parentCoord,[1,2,1,3]);
 assert.throws(()=>poolAdjacentSpatialChildren(chunks.slice(0,3)),/EXACT_FOUR_CHILDREN/);
 assert.throws(()=>poolAdjacentSpatialChildren([chunks[0],chunks[2],chunks[1],chunks[3]]),
  /CONTIGUOUS_FINITE_CHILDREN/);
 const wrong=[...chunks];wrong[3]=create(3,5,1,4);
 assert.throws(()=>poolAdjacentSpatialChildren(wrong),/SAME_Z_AND_LANE/);
 const odd=[create(1,0),create(1,1),create(2,0),create(2,1)];
 assert.throws(()=>poolAdjacentSpatialChildren(odd),/EVEN_SPATIAL_TILE_ORIGIN/);
});
