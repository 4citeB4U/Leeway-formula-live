/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.MATH_TO_FORMULA_SHADOW_TEST
TAG: LEEWAY.G41.WGS84_THREE_TO_DENSE_TENSOR_TO_ORIGINAL_FORMULA
5WH:
WHAT = Verify actual additive geodesy + scene math 16x16x16 -> 16x6 -> unchanged Formula evaluator.
WHY = Prevent mathematical engines remaining disconnected from Formula or inventing signed policy.
WHO = Creator-authorized engineering; synthetic measurements carry no real-world provenance.
WHERE = experimental-v2/tests/g41-fusion-shadow.test.mjs
WHEN = 2026-10-22
HOW = Deterministic 256 spatial/scene samples and explicit unapproved weights/ranges.
LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createFusedSpatialSceneTensor,FUSED_G41_CHANNELS}
 from '../fused-spatial-scene-tensor.mjs';
import {projectTensorToFormulaShadow} from '../tensor-projection.mjs';
import {evaluateG41SpatialProjectionShadow} from '../formula-shadow-bridge.mjs';
function makeInputs(){
 const frames=Array.from({length:16},(_,i)=>
  Array.from({length:16},(_,j)=>({
   origin:{latDeg:0,lonDeg:0,heightM:0},
   target:{latDeg:0,lonDeg:0.01+j*1e-6,heightM:0},
   scene:{
    position:[i,j,2],quaternion:[0,0,0,1],scale:[1,1,1],
    point:[2,0,0],triangle:[[0,0,0],[1,0,0],[0,1,0]]
   }
  }))
 );
 const fused=createFusedSpatialSceneTensor(frames,{sourceId:'g41-synthetic-fused-input'});
 const columns=[3,4,5,8,6,13];
 const weights=new Float64Array(256*6);
 for(let j=0;j<16;j++)for(let f=0;f<6;f++)weights[(j*16+columns[f])*6+f]=1/16;
 const projection=projectTensorToFormulaShadow({
  tensor:fused.tensor,shape:fused.inputShape,
  weights,bias:new Float64Array(96),
  featureNames:['enuEast','enuNorth','enuUp','localSceneX','surfaceM','normalZ'],
  featureUnits:['m','m','m','model_units','m','unitless'],
  sourceId:'g41-synthetic-fused-input',calibrationId:'g41-shadow-unapproved-v0'
 });
 return {frames,fused,projection};
}
test('G41 256 spatial plus Three-like scene samples create genuine 4096-element fused math tensor',()=>{
 const x=makeInputs();
 assert.deepEqual(x.fused.inputShape,[16,16,16]);
 assert.equal(x.fused.tensor.length,4096);
 assert.equal(FUSED_G41_CHANNELS.length,16);
 assert.ok(x.fused.tensor[3]>1100&&x.fused.tensor[3]<1200);
 assert.equal(x.fused.tensor[13],1);
 assert.equal(x.fused.tensor[8],2);
 assert.equal(x.fused.tensor[16*16*16+8],undefined); // fixed 16-frame bound
 assert.equal(x.fused.formulaPolicyAuthority,false);
 assert.equal(x.fused.productionAccepted,false);
});
test('G41 fused WGS84 and Three math is projected and actually evaluated by original Formula V1 shadow',()=>{
 const x=makeInputs();
 const a=x.projection;
 assert.deepEqual(a.outputShape,[16,6]);
 assert.equal(a.stateRows.length,16);
 assert.equal(a.stateRows[0][3],2);
 assert.equal(a.stateRows[1][3],3);
 assert.equal(a.stateRows[0][5],1);
 assert.ok(a.stateRows[0][0]>1100&&a.stateRows[0][0]<1200);
 const shadow=evaluateG41SpatialProjectionShadow(a,{
  semanticMappingId:'G41_EXPERIMENTAL_UNAPPROVED_FUSION_MAPPING',
  ranges:[[0,5000],[-5000,5000],[-500,500],[0,32],[0,5000],[-1,1]]
 });
 assert.equal(shadow.formulaExecutionState,'ACTUAL_V1_EXECUTED_IN_SHADOW');
 assert.equal(shadow.formulaId,'LEEWAY-FORMULA-v1.0');
 assert.equal(shadow.canonicalAdapterId,'runtime-state-v1');
 assert.equal(shadow.spatialMathAndFormulaCompositionPerformed,true);
 assert.equal(shadow.decimalState.length,6);
 assert.equal(shadow.ownerApprovedDomainMapping,false);
 assert.equal(shadow.policyAuthority,false);
 assert.equal(shadow.productionAccepted,false);
});
test('G41 missing physical spatial measurements and invalid numeric mapping fail closed',()=>{
 const x=makeInputs();
 assert.throws(()=>createFusedSpatialSceneTensor(x.frames.slice(0,15),{sourceId:'g41-incomplete'}),/16_COMPLETE_FRAMES/);
 const modified=structuredClone(x.frames);delete modified[0][0].target;
 assert.throws(()=>createFusedSpatialSceneTensor(modified,{sourceId:'g41-missing'}),/MEASURED_SPATIAL_AND_SCENE_REQUIRED/);
 assert.throws(()=>evaluateG41SpatialProjectionShadow(x.projection,{
  semanticMappingId:'g41-unapproved',ranges:Array.from({length:6},()=>[0,1])
 }),/OUTSIDE_CALIBRATION/);
 const tampered=structuredClone(x.projection);tampered.stateRows[0][0]+=0.5;
 assert.throws(()=>evaluateG41SpatialProjectionShadow(tampered,{
  semanticMappingId:'g41-unapproved',ranges:[[-5000,5000],[-5000,5000],[-500,500],[0,32],[0,5000],[-1,1]]
 }),/HASH_MISMATCH/);
});
