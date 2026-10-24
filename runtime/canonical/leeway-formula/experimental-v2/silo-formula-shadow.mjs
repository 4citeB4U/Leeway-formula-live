/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G42.EXPERIMENTAL_SILO_GOVERNOR
TAG: LEEWAY.FORMULA.G42.32_STATE_TO_FROZEN_16X6_FORMULA_SHADOW
5WH:
WHAT = Derive bounded Formula observations from exact 32/64-square tiled math and 16/32 state summaries.
WHY = Keep compressive math + inference state together without confusing summary with exact source data.
WHO = Creator-authorized LeeWay research; six output semantics not yet independently calibrated.
WHERE = Formula experimental-v2/silo-formula-shadow.mjs
WHEN = 2026-10-22
HOW = Exact decompression -> tile statistical states -> 16x6 grouping -> unchanged v1 adapter/evaluate.
LICENSE: MIT
AUTHORITY: Unapproved shadow assessment only; do not promote into protected production policy.
*/
import {createHash} from 'node:crypto';
import {runtimeStateV1} from '../v1/adapters/runtime-state-v1.mjs';
import {evaluate} from '../v1/leeway-formula-v1.mjs';
import {deriveMathTileStates} from './compressive-math-silos.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const fail=x=>{throw Error(x)};
export function evaluateG42CompressedMathShadow(silo,{
 parameters=32,selectors,featureNames,featureUnits,ranges,mappingId
}={}){
 const state=deriveMathTileStates(silo,{parameters});
 if(!Array.isArray(selectors)||selectors.length!==6||
   selectors.some(x=>!Number.isInteger(x)||x<0||x>=parameters))
  fail('G42_SIX_STATE_SELECTORS_REQUIRED');
 if(!Array.isArray(featureNames)||featureNames.length!==6||
   new Set(featureNames).size!==6||featureNames.some(x=>typeof x!=='string'||x.length<2))
  fail('G42_SIX_FEATURE_NAMES_REQUIRED');
 if(!Array.isArray(featureUnits)||featureUnits.length!==6||
   featureUnits.some(x=>typeof x!=='string'||x.length<1))
  fail('G42_SIX_FEATURE_UNITS_REQUIRED');
 if(!Array.isArray(ranges)||ranges.length!==6||
   ranges.some(x=>!Array.isArray(x)||x.length!==2||!x.every(Number.isFinite)||x[0]>=x[1]))
  fail('G42_EXPLICIT_SIX_CALIBRATION_RANGES_REQUIRED');
 if(typeof mappingId!=='string'||!/^[a-zA-Z0-9._:-]{5,100}$/.test(mappingId))
  fail('G42_CALIBRATION_MAPPING_ID_REQUIRED');
 const stride=state.states.length/16;
 if(!Number.isInteger(stride))fail('G42_TILE_COUNT_NOT_DIVISIBLE_BY_16');
 const rows=Array.from({length:16},(_,i)=>
  selectors.map((selector,f)=>{
   let sum=0;
   for(let k=0;k<stride;k++)sum+=state.states[i*stride+k][selector];
   const val=sum/stride;
   if(!Number.isFinite(val)||val<ranges[f][0]||val>ranges[f][1])
    fail('G42_CALIBRATION_OUT_OF_RANGE_NO_SILENT_CLAMP');
   return val;
  })
 );
 const original=runtimeStateV1.toMatrix({stateRows:rows,ranges});
 const formula=evaluate(original.matrix);
 const b=Buffer.alloc(96*8);
 rows.forEach((r,i)=>r.forEach((v,f)=>b.writeDoubleLE(v,(i*6+f)*8)));
 return Object.freeze({
  schema:'leeway.formula.experimental-v2.compressed-silo-v1-shadow.v1',
  mappingId,calibrationStatus:'UNAPPROVED',
  sourceRawSha256:silo.manifest.rawSha256,
  compressedPayloadSha256:silo.manifest.payloadSha256,
  stateSha256:state.stateSha256,parametersPerTile:parameters,
  sourceTileCount:state.states.length,tilesPerFormulaRow:stride,
  selectedFeatureIndexes:[...selectors],featureNames:[...featureNames],
  featureUnits:[...featureUnits],
  observationWindowShape:[16,6],observationSha256:sha(b),
  originalAdapterId:original.adapterId,
  originalFormulaId:formula.formulaId,
  originalInputSha256:formula.inputHash,
  originalResultSha256:formula.resultHash,
  originalDecimalState:formula.decimalState,
  originalBase64State:formula.base64State,
  formulaExecutionState:'ACTUAL_ORIGINAL_V1_EXECUTED_IN_SHADOW',
  exactRawSourceReconstructable:true,
  parameterReductionIsLossy:true,
  ownerApprovedMapping:false,
  verifiedRuntimePolicy:false,productionAccepted:false
 });
}
