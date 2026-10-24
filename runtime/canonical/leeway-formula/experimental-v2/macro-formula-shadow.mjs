/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G43.MACRO_GOVERNOR_SHADOW
TAG: LEEWAY.G43.32X32X8_TO_16X6_FORMULA_SHADOW_WITH_512_FEATURES
5WH:
WHAT = Evaluate the result of massive exact stored macro tensor through a shape-safe 32x32x8 -> 16x6 candidate projection.
WHY = Tensor tiling, compression and logical policy must remain mathematically distinct from canonical Golden Formula v1.
WHO = Creator-authorized LeeWay experimental math engineer; Q/V/H/R/S/L mapping is not independently certified.
WHERE = Formula experimental-v2/macro-formula-shadow.mjs
WHEN = 2026-10-22
HOW = Reshape 32x32x8 to 16x64x8, apply 512x6 weights, then call unmodified Formula V1 in shadow.
LICENSE: MIT
AUTHORITY: No issuer, Veritas, Continuum or production dispatch authority.
*/
import {createHash} from 'node:crypto';
import {projectTensorToFormulaShadow} from './tensor-projection.mjs';
import {evaluateG41SpatialProjectionShadow} from './formula-shadow-bridge.mjs';
const digest=values=>{const b=Buffer.alloc(values.length*8);
 values.forEach((x,i)=>b.writeDoubleLE(x,i*8));
 return createHash('sha256').update(b).digest('hex')};
const names=['SpatialX','SpatialY','Depth','VertexTransform','GeodesicState','GeometryVariance'];
const units=['normalized','normalized','normalized','normalized','normalized','normalized'];
export function evaluateG43MacroMathShadow(checkpoint,workspace,{weights,bias,ranges,semanticMappingId}={}){
 if(!checkpoint?.report||
   checkpoint.report.schema!=='leeway.formula.experimental-v2.g43.macro-stream-checkpoint.v1'||
   checkpoint.report.trust?.productionAccepted!==false||
   !(workspace instanceof Float64Array)||workspace.length!==8192||
   !workspace.every(Number.isFinite)||
   digest(workspace)!==checkpoint.report.intermediateSha256)
  throw Error('G43_VERIFIED_MACRO_STATE_AND_DIGEST_REQUIRED');
 if(!(weights instanceof Float64Array)||weights.length!==512*6||
   !(bias instanceof Float64Array)||bias.length!==16*6)
  throw Error('G43_EXPLICIT_512x6_GOVERNED_CANDIDATE_WEIGHTS_REQUIRED');
 const projection=projectTensorToFormulaShadow({
  tensor:workspace,shape:[16,64,8],
  weights,bias,featureNames:names,featureUnits:units,
  sourceId:'g43-macro-'+checkpoint.report.logicalSourceSha256.slice(0,32),
  calibrationId:'g43-unapproved-'+checkpoint.report.logicalSourceSha256.slice(0,32),
  tileSize:32
 });
 const formula=evaluateG41SpatialProjectionShadow(projection,{
  ranges,semanticMappingId
 });
 return Object.freeze({
  schema:'leeway.formula.experimental-v2.g43.640x320-hierarchical-shadow.v1',
  sourceShape:checkpoint.report.sourceShape,
  sourceLogicalSha256:checkpoint.report.logicalSourceSha256,
  intermediateShape:[32,32,8],
  projectionReshapeShape:[16,64,8],
  actualProjectionWeightShape:[512,6],
  originalObservationShape:[16,6],
  sourceIntermediateSha256:checkpoint.report.intermediateSha256,
  projectedObservationSha256:projection.outputSha256,
  actualOriginalFormulaShadow:formula,
  mathematicalCompression:
   'EXACT_SOURCE_ARCHIVE_WITH_LOSSY_REDUCED_WORKSPACE',
  semanticMappingStatus:'EXPERIMENTAL_UNAPPROVED',
  metadataLedgerStatus:'LOCAL_UNSIGNED_HASH_CHAIN',
  originalSourceRecoverableOnlyWhenArchiveRetained:true,
  originalProtectedReceiptAndLearningLedgerAdmitted:false,
  productionAccepted:false
 });
}
