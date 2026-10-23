/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G42.EXPERIMENTAL_COMPRESSIVE_MATH_TEST
TAG: LEEWAY.G42.EXACT_SILO_LOSSY_STATE_ORACLE_64x64x8
5WH:
WHAT = Verify exact reconstruction, honest compression and reused pure computation with 16/32 state summaries.
WHY = 64x64x8 cannot be represented by 16x6 without information loss or a separately retained source.
WHO = Creator-authorized LeeWay math candidate engineer, no protected issuer authority.
WHERE = experimental-v2/tests/g42-compressive-math-silos.test.mjs
WHEN = 2026-10-22
HOW = Deterministic spatial tile patterns, hash tampering, Float32/64 and independent scalar oracle.
LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyGolden} from '../../v1/leeway-formula-v1.mjs';
import {encodeExactMathSilo,decodeExactMathSilo,deriveMathTileStates,
 applyExactTileReuseOperation} from '../compressive-math-silos.mjs';
import {evaluateG42CompressedMathShadow} from '../silo-formula-shadow.mjs';
function repeated(side=64,type='f64'){
 const c=type==='f32'?Float32Array:Float64Array;
 return c.from({length:side*side*8},(_,i)=>{
  const channel=i%8,spatial=Math.floor(i/8),x=spatial%side,y=Math.floor(spatial/side);
  return ((x%8)*3+(y%8)*5+channel*7)/16;
 });
}
function distinct(side=64){
 let seed=0x88aabbcc;
 return Float64Array.from({length:side*side*8},()=>{
  seed=(Math.imul(1664525,seed)+1013904223)>>>0;
  return seed/2**32;
 });
}
const settings=()=>{
 const name=['valueMean0','valueMean1','valueMean2','valueRms0','valueRms1','valueRms2'];
 return {parameters:32,selectors:[0,1,2,8,9,10],
   featureNames:name,featureUnits:Array(6).fill('abstract_units'),
   ranges:Array.from({length:6},()=>[-1000,1000]),
   mappingId:'g42-shadow-six-feature-candidate'};
};
test('G42 64x64x8 float64 has 32768 numbers and 262144 exact source bytes',()=>{
 const source=repeated(),silo=encodeExactMathSilo(source);
 assert.equal(source.length,32768);
 assert.equal(silo.manifest.rawBytes,262144);
 assert.equal(silo.manifest.tileCount,64);
 assert.equal(silo.manifest.uniqueTileCount,1);
 assert.ok(silo.manifest.payloadBytes<silo.manifest.rawBytes/4);
 const unpack=decodeExactMathSilo(silo);
 assert.deepEqual(unpack.tensor,source);
 assert.equal(unpack.rawSha256,silo.manifest.rawSha256);
});
test('G42 supports 32x32x8 and float32 with exact bitwise reconstructed values',()=>{
 const source=repeated(32,'f32'),silo=encodeExactMathSilo(source,{side:32});
 assert.equal(silo.manifest.elementCount,8192);
 assert.equal(silo.manifest.rawBytes,32768);
 assert.equal(silo.manifest.dtype,'float32-le');
 assert.equal(silo.manifest.tileCount,16);
 assert.deepEqual(decodeExactMathSilo(silo).tensor,source);
});
test('G42 for nonrepeating input never claims impossible compression savings',()=>{
 const source=distinct(),silo=encodeExactMathSilo(source);
 assert.equal(silo.manifest.uniqueTileCount,64);
 assert.ok(silo.manifest.payloadBytes<=silo.manifest.rawBytes);
 assert.deepEqual(decodeExactMathSilo(silo).tensor,source);
});
test('G42 content address rejects altered or truncated source payload',()=>{
 const silo=encodeExactMathSilo(repeated());
 const altered={manifest:{...silo.manifest},payload:Buffer.from(silo.payload)};
 altered.payload[0]^=1;
 assert.throws(()=>decodeExactMathSilo(altered),/PAYLOAD_HASH_MISMATCH/);
 const short={manifest:silo.manifest,payload:silo.payload.subarray(1)};
 assert.throws(()=>decodeExactMathSilo(short),/LENGTH_INVALID/);
});
test('G42 16- and 32-parameter states remain lossy while original values survive',()=>{
 const silo=encodeExactMathSilo(repeated());
 const a=deriveMathTileStates(silo,{parameters:16});
 const b=deriveMathTileStates(silo,{parameters:32});
 assert.deepEqual(a.stateShape,[64,16]);
 assert.deepEqual(b.stateShape,[64,32]);
 assert.equal(a.states[0].length,16);
 assert.equal(b.states[0].length,32);
 assert.equal(a.lossySummary,true);
 assert.equal(a.sourceReconstructableFromStates,false);
 assert.equal(b.exactSourceRetainedSeparately,true);
 assert.throws(()=>deriveMathTileStates(silo,{parameters:8}),/REQUIRE_16_OR_32/);
});
test('G42 tile equality requires exact bytes, not same statistical summaries',()=>{
 const src=repeated();
 const side=64;
 // Swap two channels at different sample sites in exactly one 8x8 block:
 // distributional mean/RMS/min/max are unchanged; bytewise identity differs.
 const a=((0*side+0)*8),b=((0*side+1)*8);
 const before=src[a];src[a]=src[b];src[b]=before;
 const silo=encodeExactMathSilo(src);
 assert.equal(silo.manifest.uniqueTileCount,2);
 const states=deriveMathTileStates(silo,{parameters:32});
 assert.deepEqual(states.states[0],states.states[1]);
 assert.deepEqual(decodeExactMathSilo(silo).tensor,src);
});
test('G42 repeated pure per-channel compute reuses 63 exact tiles, matches naive full oracle',()=>{
 const src=repeated(),silo=encodeExactMathSilo(src);
 const scales=[2,3,4,5,6,7,8,9],offsets=[-1,1,-2,2,-3,3,-4,4];
 const out=applyExactTileReuseOperation(silo,{scales,offsets});
 const independent=Float64Array.from(src,(x,i)=>x*scales[i%8]+offsets[i%8]);
 assert.deepEqual(out.result,independent);
 assert.equal(out.receipt.sourceTiles,64);
 assert.equal(out.receipt.uniqueTilesComputed,1);
 assert.equal(out.receipt.reusedTiles,63);
 assert.equal(out.receipt.scalarEvaluations,512);
 assert.equal(out.receipt.independentScalarEvaluations,32768);
 assert.equal(out.receipt.resultSha256CheckedByIndependentOracle,false);
 assert.equal(out.receipt.productionAccepted,false);
});
test('G42 unstructured compute cannot invent redundant-work speedup',()=>{
 const src=distinct(),silo=encodeExactMathSilo(src);
 const params={scales:Array(8).fill(2),offsets:Array(8).fill(1)};
 const out=applyExactTileReuseOperation(silo,params);
 assert.equal(out.receipt.uniqueTilesComputed,64);
 assert.equal(out.receipt.reusedTiles,0);
 assert.deepEqual(out.result,Float64Array.from(src,x=>x*2+1));
});
test('G42 64 tiles -> 16x6 -> authentic original Formula v1 shadow output',()=>{
 const silo=encodeExactMathSilo(repeated());
 const shadow=evaluateG42CompressedMathShadow(silo,settings());
 assert.deepEqual(shadow.observationWindowShape,[16,6]);
 assert.equal(shadow.parametersPerTile,32);
 assert.equal(shadow.sourceTileCount,64);
 assert.equal(shadow.tilesPerFormulaRow,4);
 assert.equal(shadow.originalAdapterId,'runtime-state-v1');
 assert.equal(shadow.originalFormulaId,'LEEWAY-FORMULA-v1.0');
 assert.equal(shadow.originalDecimalState.length,6);
 assert.equal(shadow.formulaExecutionState,'ACTUAL_ORIGINAL_V1_EXECUTED_IN_SHADOW');
 assert.equal(shadow.productionAccepted,false);
 assert.equal(shadow.ownerApprovedMapping,false);
});
test('G42 invalid mappings, ranges and NaN reject without silently authorizing',()=>{
 const silo=encodeExactMathSilo(repeated());
 assert.throws(()=>evaluateG42CompressedMathShadow(silo,{...settings(),selectors:[0,1,2]}),/SIX_STATE_SELECTORS/);
 assert.throws(()=>evaluateG42CompressedMathShadow(silo,{...settings(),ranges:Array.from({length:6},()=>[0,1])}),/OUT_OF_RANGE/);
 const src=repeated();src[30]=NaN;
 assert.throws(()=>encodeExactMathSilo(src),/FINITE_REQUIRED/);
 assert.throws(()=>encodeExactMathSilo(src,{side:16}),/FINITE_REQUIRED/);
});
test('G42 frozen original Formula v1 golden-vector invariant remains exact',()=>{
 const x=verifyGolden();
 assert.equal(x.pass,true);
 assert.deepEqual(x.computedDecimal,[4,50,63,59,48,69]);
});
