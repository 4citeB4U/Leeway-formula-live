/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.EXPERIMENTAL_MATH_TEST
TAG: LEEWAY.G41.WGS84_THREE_TENSOR_DIMENSIONAL_VALIDATION
5WH:
WHAT = Verify Formula-additive Cesium/Three-style equations and 16xSxC to 16x6 projection.
WHY = Prevent invalid 16x16x16 matmul shapes, missing calibration or accidental v1 mutations.
WHO = Creator-authorized LeeWay engineering; local math fixtures not production signing proofs.
WHERE = experimental-v2/tests/g41-math-core.test.mjs
WHEN = 2026-10-22
HOW = Analytical geodesy and geometry invariants, tile equivalence and unchanged original golden vector.
LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {
 wgs84GeodeticToEcef,wgs84EcefToEnu,wgs84SurfaceDistanceVincenty,
 composeSceneMatrix4,transformScenePoint,triangleUnitNormal,
 triangleBarycentricSample,bounds3
} from '../spatial-geometry-math.mjs';
import {projectTensorToFormulaShadow} from '../tensor-projection.mjs';
import {verifyGolden} from '../../v1/leeway-formula-v1.mjs';
const close=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance,
 'got '+actual+' expected '+expected+' tolerance '+tolerance);
const dims=['visibleCandidates','movementCount','routeDeviationM','labels','frameMs','latencyMs'];
const units=['count','count','m','count','ms','ms'];
function example(shape=[16,16,16]){
 const [r,s,c]=shape,k=s*c;
 const tensor=Float64Array.from({length:r*k},(_,idx)=>{
   const i=Math.floor(idx/k),j=Math.floor(idx%k/c),ch=idx%c;return i+j+ch;
 });
 const weights=new Float64Array(k*6);
 for(let q=0;q<k;q++)for(let f=0;f<6;f++)weights[q*6+f]=(f+1)/k;
 const bias=new Float64Array(96);
 return {tensor,shape,weights,bias,featureNames:dims,featureUnits:units,
  sourceId:'g41-fixture-tensor',calibrationId:'g41-NOT-APPROVED-calibration'};
}
test('G41 WGS84 ECEF equator and 1 degree geodesic math have correct meter units',()=>{
 const o={latDeg:0,lonDeg:0,heightM:0},t={latDeg:0,lonDeg:1,heightM:0};
 assert.deepEqual(wgs84GeodeticToEcef(o),[6378137,0,0]);
 close(wgs84SurfaceDistanceVincenty(o,t),111319.4907932264,1e-5);
 const [east,north,up]=wgs84EcefToEnu({origin:o,target:t});
 close(east,111313.83923667614,1e-5);close(north,0,1e-6);
 close(up,-971.4211582998931,0.01);
});
test('G41 WGS84 zero path, pole and invalid coordinate remain finite and bounded',()=>{
 const p={latDeg:48.85,lonDeg:2.35,heightM:35};
 close(wgs84SurfaceDistanceVincenty(p,p),0,0);
 assert.ok(wgs84GeodeticToEcef({latDeg:90,lonDeg:0,heightM:0}).every(Number.isFinite));
 assert.throws(()=>wgs84GeodeticToEcef({latDeg:95,lonDeg:0}),/OUT_OF_RANGE/);
 assert.throws(()=>wgs84EcefToEnu({origin:p,target:{latDeg:0,lonDeg:NaN}}),/NON_FINITE/);
});
test('G41 Three-compatible Matrix4 affine math and local 3D frames',()=>{
 const q=[0,0,Math.sin(Math.PI/4),Math.cos(Math.PI/4)];
 const m=composeSceneMatrix4({position:[4,5,6],quaternion:q,scale:[1,1,1]});
 const actual=transformScenePoint(m,[2,0,0]);
 [4,7,6].forEach((v,i)=>close(actual[i],v,1e-12));
 assert.throws(()=>composeSceneMatrix4({quaternion:[0,0,0,2]}),/UNNORMALIZED/);
});
test('G41 normals, barycentric mesh sample and bounding box',()=>{
 assert.deepEqual(triangleUnitNormal([0,0,0],[1,0,0],[0,1,0]),[0,0,1]);
 assert.deepEqual(triangleBarycentricSample([0,0,0],[2,0,0],[0,2,0],1,0.5),[1,1,0]);
 const bbox=bounds3([[0,1,2],[2,3,4],[-1,0,3]]);
 assert.deepEqual(bbox,{min:[-1,0,2],max:[2,3,4]});
 assert.throws(()=>triangleUnitNormal([0,0,0],[1,1,1],[2,2,2]),/DEGENERATE/);
});
test('G41 16x16x16=4096 to 16x6=96 valid dense projection and TILE16 matches TILE32',()=>{
 const args=example();
 const a=projectTensorToFormulaShadow({...args,tileSize:16});
 const b=projectTensorToFormulaShadow({...args,tileSize:32});
 assert.deepEqual(a.inputShape,[16,16,16]);
 assert.deepEqual(a.weightShape,[256,6]);
 assert.deepEqual(a.outputShape,[16,6]);
 assert.equal(args.tensor.length,4096);
 assert.equal(a.stateRows.flat().length,96);
 close(a.stateRows[2][5],(2+7.5+7.5)*6,1e-9);
 assert.deepEqual(a.stateRows,b.stateRows);
 assert.equal(a.inputSha256,b.inputSha256);
 assert.equal(a.outputSha256,b.outputSha256);
 assert.equal(a.allTensorValuesRecoverable,false);
 assert.equal(a.mappedToCanonicalQVHRSL,false);
 assert.equal(a.policyAuthority,false);
 assert.equal(a.formulaExecutionState,'NOT_EXECUTED');
 assert.equal(a.productionAccepted,false);
});
test('G41 shapes larger than 16x16x16 are representable without inventing tensor core hardware',()=>{
 const x=projectTensorToFormulaShadow(example([16,32,16]));
 assert.deepEqual(x.inputShape,[16,32,16]);
 assert.deepEqual(x.weightShape,[512,6]);
 assert.equal(x.stateRows.length,16);
 assert.equal(x.featureNames[2],'routeDeviationM');
});
test('G41 invalid shapes/weights/calibration and nonfinite tensor refuse rather than invent evidence',()=>{
 const x=example();
 assert.throws(()=>projectTensorToFormulaShadow({...x,weights:new Float64Array(16*6)}),/SHAPES_REQUIRED/);
 assert.throws(()=>projectTensorToFormulaShadow({...x,shape:[15,16,16]}),/BOUNDED_SAMPLE/);
 const copy=example();copy.tensor[0]=NaN;
 assert.throws(()=>projectTensorToFormulaShadow(copy),/FINITE_FLOAT64/);
 assert.throws(()=>projectTensorToFormulaShadow({...x,calibrationId:''}),/CALIBRATION_ID/);
 const y=example();for(let q=0;q<256;q++)y.weights[q*6+2]=0;
 assert.throws(()=>projectTensorToFormulaShadow(y),/EMPTY_PROJECTION_FEATURE_2/);
});
test('G41 math is additive: original exact frozen Formula v1 passes untouched',()=>{
 const v=verifyGolden();
 assert.equal(v.pass,true);
 assert.equal(v.formulaId,'LEEWAY-FORMULA-v1.0');
 assert.deepEqual(v.computedDecimal,[4,50,63,59,48,69]);
});
