/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.SPATIAL_CONTEXT.TEST
WHAT = Verify fail-closed Cesium spatial-context ingestion and shadow-only workspace integration
LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSpatialContext,SPATIAL_DIMENSION_ORDER} from '../spatial-context.mjs';
import {simulateWorld} from '../simulator.mjs';
import {buildOperationalAwareness} from '../workspace-self-model.mjs';

function fixture(provenance='TEST_FIXTURE',qualification='TEST_ONLY'){
  const observations=Array.from({length:18},(_,i)=>({complete:true,dimensionOrder:[...SPATIAL_DIMENSION_ORDER],values:[100+i,10+i,5+i/10,20+i,16+i/5,30+i/3]}));
  return {schemaVersion:'1.0.0',mappingId:'personal-map-spatial-density-v0',provenance,createdAt:'2026-10-04T00:00:00.000Z',capture:{qualification},observations};
}
test('16x6 spatial context is deterministic and never gains policy or Formula authority',()=>{
  const a=buildSpatialContext(fixture()),b=buildSpatialContext(fixture());
  assert.equal(a.stateRows.length,16); assert.equal(a.stateRows[0].length,6);
  assert.equal(a.contextHash,b.contextHash); assert.equal(a.cognitiveUse,'SHADOW_ONLY');
  assert.equal(a.policyAuthority,false); assert.equal(a.formulaExecutionState,'NOT_EXECUTED');
});
test('test fixtures cannot masquerade as real GPU evidence',()=>assert.throws(()=>buildSpatialContext(fixture(),{requireLiveGpu:true}),/SPATIAL_REAL_GPU_EVIDENCE_REQUIRED/));
test('incomplete live trace blocks rather than zero-filling route deviation',()=>{
  const t=fixture('LIVE_BROWSER_MEASUREMENT','REAL_GPU_CANDIDATE'); t.observations=t.observations.map(r=>({...r,complete:false,values:[0,0,null,0,4.3,3.1]}));
  assert.throws(()=>buildSpatialContext(t,{requireLiveGpu:true}),/SPATIAL_16_COMPLETE_OBSERVATIONS_REQUIRED/);
});
test('spatial context enters workspace/self-model without changing cognition policy',()=>{
  const receipt=simulateWorld({worldIndex:2,scenario:'stationary',cycles:1,seed:44})[0],ctx=buildSpatialContext(fixture());
  const base=buildOperationalAwareness(receipt),withSpatial=buildOperationalAwareness(receipt,{spatialContext:ctx});
  assert.notEqual(base.workspaceState.workspaceHash,withSpatial.workspaceState.workspaceHash);
  assert.equal(base.workspaceState.cycleStateHash,withSpatial.workspaceState.cycleStateHash);
  assert.equal(withSpatial.workspaceState.selectedPolicy,receipt.cognitionView.selectedPolicy);
  assert.equal(withSpatial.selfModel.claims.resources.value.spatialContextHash,ctx.contextHash);
});
