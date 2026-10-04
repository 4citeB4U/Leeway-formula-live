/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.SPATIAL_CONTEXT
5WH:
WHAT = Convert provenance-bound LeeWay Maps/Cesium spatial measurements into a shadow world-model context
WHY = Reuse measured GPU/spatial work without making Cesium a Formula or policy authority
WHO = Leeway Industries / Creator-authorized research runtimes
WHERE = experiments/machine-consciousness-v0/spatial-context.mjs
WHEN = MC-G9
HOW = Validate mapping/provenance/order -> require 16 finite rows -> summarize -> hash -> expose SHADOW_ONLY context
AGENTS: ASSESS AUDIT VERIFY
LICENSE: MIT
*/
import crypto from 'node:crypto';

export const SPATIAL_MAPPING_ID='personal-map-spatial-density-v0';
export const SPATIAL_DIMENSION_ORDER=Object.freeze([
  'visible_spatial_candidate_count','continuous_motion_subject_count','transit_route_deviation_m',
  'rendered_label_count','frame_time_ms','interaction_latency_ms'
]);
function canonical(v){if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';if(v!==null&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';return JSON.stringify(v);}
const digest=v=>crypto.createHash('sha256').update(canonical(v)).digest('hex');
const sameOrder=v=>Array.isArray(v)&&v.length===SPATIAL_DIMENSION_ORDER.length&&v.every((x,i)=>x===SPATIAL_DIMENSION_ORDER[i]);
function classify(p){if(p==='LIVE_BROWSER_MEASUREMENT')return 'REAL';if(p==='SIMULATED')return 'SIMULATED';if(p==='TEST_FIXTURE')return 'TEST_FIXTURE';throw new Error('SPATIAL_PROVENANCE_UNAUTHORIZED');}
function summarize(rows){return Object.fromEntries(SPATIAL_DIMENSION_ORDER.map((key,j)=>{const v=rows.map(r=>r[j]).sort((a,b)=>a-b);const mean=v.reduce((a,b)=>a+b,0)/v.length;const p95=v[Math.min(v.length-1,Math.ceil(v.length*.95)-1)];return [key,{min:v[0],max:v.at(-1),mean,p95}];}));}

export function buildSpatialContext(trace,{requireLiveGpu=false}={}){
  if(!trace||trace.mappingId!==SPATIAL_MAPPING_ID)throw new Error('SPATIAL_MAPPING_MISMATCH');
  const sourceClass=classify(trace.provenance),qualification=trace.capture?.qualification??null;
  if(requireLiveGpu&&(sourceClass!=='REAL'||qualification!=='REAL_GPU_CANDIDATE'))throw new Error('SPATIAL_REAL_GPU_EVIDENCE_REQUIRED');
  const complete=[];
  for(const row of trace.observations||[]){if(row?.complete!==true)continue;if(!sameOrder(row.dimensionOrder))throw new Error('SPATIAL_DIMENSION_ORDER_MISMATCH');if(!Array.isArray(row.values)||row.values.length!==6||!row.values.every(Number.isFinite))throw new Error('SPATIAL_NON_FINITE_COMPLETE_ROW');complete.push(row.values.map(Number));}
  if(complete.length<16)throw new Error('SPATIAL_16_COMPLETE_OBSERVATIONS_REQUIRED');
  const stateRows=complete.slice(-16),sourceTraceHash=digest(trace);
  const state=sourceClass==='REAL'?'REAL_SPATIAL_CONTEXT_READY':sourceClass==='SIMULATED'?'SIMULATED_SPATIAL_CONTEXT_READY':'TEST_SPATIAL_CONTEXT_READY';
  const core={schemaVersion:'0.1.0',state,sourceClass,mappingId:SPATIAL_MAPPING_ID,qualification,dimensionOrder:[...SPATIAL_DIMENSION_ORDER],stateRows,summary:summarize(stateRows),sourceTraceHash,cognitiveUse:'SHADOW_ONLY',policyAuthority:false,formulaExecutionState:'NOT_EXECUTED'};
  return Object.freeze({...core,contextHash:digest(core)});
}
