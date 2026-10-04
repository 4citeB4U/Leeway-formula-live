/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.SPATIAL_CORTEX
5WH:
WHAT = Validate and summarize Cesium-derived spatial observations for Machine Consciousness
WHY = Reuse LeeWay Maps GPU/spatial work as bounded evidence without duplicating Formula or granting unverified spatial state policy authority
WHO = Leeway Industries / Creator-authorized Machine Consciousness research runtime
WHERE = experiments/machine-consciousness-v0/spatial-cortex.mjs
WHEN = MC-G9 spatial ablation tranche
HOW = Provenance-bound six-value observations -> deterministic summaries -> diagnostic candidate only
AGENTS: ASSESS AUDIT VERIFY
LICENSE: MIT
*/
import crypto from 'node:crypto';

export const SPATIAL_DIMENSION_ORDER=Object.freeze([
  'visible_spatial_candidate_count',
  'continuous_motion_subject_count',
  'transit_route_deviation_m',
  'rendered_label_count',
  'frame_time_ms',
  'interaction_latency_ms'
]);
export const SOURCE_CLASSES=Object.freeze(['REAL_BROWSER_MEASUREMENT','TEST_FIXTURE','SIMULATED']);

const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const finite6=values=>Array.isArray(values)&&values.length===6&&values.every(Number.isFinite);

export function validateSpatialObservation(row){
  const failures=[];
  if(!row||typeof row!=='object')return {status:'FAIL',failures:['OBSERVATION_REQUIRED']};
  if(!SOURCE_CLASSES.includes(row.sourceClass))failures.push('INVALID_SOURCE_CLASS');
  if(row.mappingId!=='personal-map-spatial-density-v0')failures.push('MAPPING_ID_MISMATCH');
  if(JSON.stringify(row.dimensionOrder)!==JSON.stringify(SPATIAL_DIMENSION_ORDER))failures.push('DIMENSION_ORDER_MISMATCH');
  if(row.complete!==true)failures.push('OBSERVATION_INCOMPLETE');
  if(!finite6(row.values))failures.push('VALUES_REQUIRE_SIX_FINITE_NUMBERS');
  return {status:failures.length?'FAIL':'PASS',failures};
}

export function ingestSpatialObservation(row){
  const validation=validateSpatialObservation(row);
  if(validation.status!=='PASS')throw new Error('SPATIAL_OBSERVATION_REJECTED:'+validation.failures.join(','));
  const [visible,moving,deviation,labels,frameMs,latencyMs]=row.values;
  const measurement={
    schemaVersion:'0.1.0',
    sourceClass:row.sourceClass,
    mappingId:row.mappingId,
    sourceHash:digest(row),
    dimensions:Object.freeze(Object.fromEntries(SPATIAL_DIMENSION_ORDER.map((key,index)=>[key,row.values[index]]))),
    derived:Object.freeze({
      motionDensity:visible>0?moving/visible:0,
      labelDensity:visible>0?labels/visible:0,
      responsivenessPressure:frameMs+latencyMs,
      routeDeviationM:deviation
    }),
    formulaAuthority:'LEEWAY-FORMULA-v1.0_UNCHANGED',
    formulaMutation:false,
    formulaExecutionState:'NOT_EXECUTED_BY_SPATIAL_CORTEX',
    policyAuthority:row.sourceClass==='REAL_BROWSER_MEASUREMENT'?'CANDIDATE_ABLATION':'DIAGNOSTIC_ONLY'
  };
  return Object.freeze(measurement);
}

export function compareSpatialLoad(a,b){
  const A=ingestSpatialObservation(a),B=ingestSpatialObservation(b);
  return Object.freeze({
    sourceHashes:[A.sourceHash,B.sourceHash],
    delta:{
      visibleSpatialCandidates:B.dimensions.visible_spatial_candidate_count-A.dimensions.visible_spatial_candidate_count,
      movingSubjects:B.dimensions.continuous_motion_subject_count-A.dimensions.continuous_motion_subject_count,
      routeDeviationM:B.derived.routeDeviationM-A.derived.routeDeviationM,
      renderedLabels:B.dimensions.rendered_label_count-A.dimensions.rendered_label_count,
      frameTimeMs:B.dimensions.frame_time_ms-A.dimensions.frame_time_ms,
      interactionLatencyMs:B.dimensions.interaction_latency_ms-A.dimensions.interaction_latency_ms,
      responsivenessPressure:B.derived.responsivenessPressure-A.derived.responsivenessPressure
    },
    interpretationState:'DIAGNOSTIC_ONLY'
  });
}
