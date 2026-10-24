/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.SHADOW_FORMULA_INTERPRETATION
TAG: LEEWAY.G41.REAL_CANONICAL_V1_EVALUATOR_BEHIND_UNAPPROVED_MATH_PROJECTION
5WH:
WHAT = Actually evaluate the original canonical Formula v1 with six explicitly calibrated shadow observations.
WHY = Exercise the math-to-Formula connection without modifying the golden engine or inventing policy.
WHO = Creator-authorized experimental math engineer; not an independent semantic reviewer.
WHERE = Formula experimental-v2/formula-shadow-bridge.mjs
WHEN = 2026-10-22
HOW = Validate projection hashes and ranges; pass bounded 16x6 to unchanged runtime-state-v1 adapter and evaluate().
LICENSE: MIT
AUTHORITY: SHADOW ONLY; NEVER issue Formula policy approval, Veritas signatures or production dispatch.
*/
import {createHash} from 'node:crypto';
import {runtimeStateV1} from '../v1/adapters/runtime-state-v1.mjs';
import {evaluate} from '../v1/leeway-formula-v1.mjs';
const hex=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
export function evaluateG41SpatialProjectionShadow(projection,{ranges,semanticMappingId}={}){
 if(!projection||projection.schema!=='leeway.formula.experimental-v2.tensor-to-16x6-shadow.v1'||
   projection.policyAuthority!==false||projection.productionAccepted!==false||
   !hex(projection.inputSha256)||!hex(projection.weightsSha256)||
   !hex(projection.outputSha256)||!Array.isArray(projection.stateRows)||
   projection.stateRows.length!==16||
   projection.stateRows.some(r=>!Array.isArray(r)||r.length!==6||
    r.some(v=>!Number.isFinite(v))))
  throw Error('G41_ONLY_VERIFIED_SHADOW_PROJECTION_CANDIDATE');
 if(typeof semanticMappingId!=='string'||
   !/^[A-Za-z0-9_.:-]{4,120}$/.test(semanticMappingId))
  throw Error('G41_EXPLICIT_SIX_FEATURE_SEMANTICS_REQUIRED');
 if(!Array.isArray(ranges)||ranges.length!==6||
   ranges.some(x=>!Array.isArray(x)||x.length!==2||!x.every(Number.isFinite)||x[0]>=x[1]))
  throw Error('G41_6_EXPLICIT_CALIBRATION_RANGES_REQUIRED');
 for(const row of projection.stateRows){
  for(let f=0;f<6;f++){
   if(row[f]<ranges[f][0]||row[f]>ranges[f][1])
    throw Error('G41_PROJECTION_OUTSIDE_CALIBRATION_REJECT_NO_SILENT_CLAMP');
  }
 }
 const raw=Buffer.allocUnsafe(96*8);
 projection.stateRows.forEach((row,i)=>row.forEach((v,j)=>raw.writeDoubleLE(v,(i*6+j)*8)));
 const proof=createHash('sha256').update(raw).digest('hex');
 if(proof!==projection.outputSha256)
  throw Error('G41_PROJECTED_OBSERVATIONS_HASH_MISMATCH');
 const originalAdapter=runtimeStateV1.toMatrix({
  stateRows:projection.stateRows,ranges
 });
 const formula=evaluate(originalAdapter.matrix);
 return Object.freeze({
  schema:'leeway.formula.experimental-v2.shadow-evaluation.v1',
  sourceTensorSha256:projection.inputSha256,
  projectionSha256:projection.outputSha256,
  sourceWeightSha256:projection.weightsSha256,
  semanticMappingId,
  calibrationAuthority:'CANDIDATE_NOT_REVIEWED',
  canonicalAdapterId:originalAdapter.adapterId,
  canonicalInputHash:formula.inputHash,
  formulaId:formula.formulaId,
  formulaResultSha256:formula.resultHash,
  decimalState:formula.decimalState,
  base64State:formula.base64State,
  formulaExecutionState:'ACTUAL_V1_EXECUTED_IN_SHADOW',
  spatialMathAndFormulaCompositionPerformed:true,
  originalGoldenFormulaUnmodified:true,
  ownerApprovedDomainMapping:false,
  policyAuthority:false,
  productionAccepted:false
 });
}
