/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.CALIBRATION
5WH:
WHAT = Deterministic calibration helpers for the six independently recomputed cognition dimensions
WHY = Produce finite evidence-derived ranges for runtime-state-v1 without leaking holdout data into range fitting
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/calibration.mjs
WHEN = MC-6 calibration qualification
HOW = Analytic bounds where justified; otherwise training-only min/max plus fixed 5% width margin; separate holdout coverage verification
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import {DIMENSION_ORDER} from './cognition-dimensions.mjs';

export const CALIBRATION_MARGIN_FRACTION=0.05;
export const ANALYTIC_BOUNDS=Object.freeze({
  belief_entropy_nats:[0,Math.log(2)],
  global_access_ratio:[0,1]
});
const NONNEGATIVE=new Set([
  'belief_entropy_nats',
  'precision_weighted_prediction_error',
  'belief_information_gain_nats',
  'selected_policy_expected_free_energy',
  'global_access_ratio'
]);

function finite(v){return Number.isFinite(v);}
function dimensionValues(rows,index){
  if(!Array.isArray(rows)||!rows.length)throw new Error('CALIBRATION_ROWS_REQUIRED');
  return rows.map((row,i)=>{
    if(!Array.isArray(row)||row.length!==6)throw new Error('CALIBRATION_ROW_'+i+'_INVALID');
    const v=Number(row[index]);
    if(!finite(v))throw new Error('CALIBRATION_NON_FINITE_'+index);
    return v;
  });
}
export function validateRanges(ranges){
  if(!Array.isArray(ranges)||ranges.length!==6)throw new Error('CALIBRATION_SIX_RANGES_REQUIRED');
  for(let i=0;i<6;i++){
    const r=ranges[i];
    if(!Array.isArray(r)||r.length!==2||!finite(r[0])||!finite(r[1])||!(r[0]<r[1])){
      throw new Error('CALIBRATION_RANGE_'+i+'_INVALID');
    }
  }
  return true;
}
export function deriveCalibrationRanges(rows,{marginFraction=CALIBRATION_MARGIN_FRACTION}={}){
  if(!(marginFraction>=0&&finite(marginFraction)))throw new Error('CALIBRATION_MARGIN_INVALID');
  const ranges=[],details=[];
  for(let i=0;i<DIMENSION_ORDER.length;i++){
    const id=DIMENSION_ORDER[i];
    const values=dimensionValues(rows,i);
    const observedMin=Math.min(...values),observedMax=Math.max(...values);
    let lo,hi,policy;
    if(ANALYTIC_BOUNDS[id]){
      [lo,hi]=ANALYTIC_BOUNDS[id];
      policy='ANALYTIC_BOUND';
    }else{
      const width=observedMax-observedMin;
      const margin=Math.max(1e-12,width*marginFraction,Math.abs(observedMax)*1e-12,Math.abs(observedMin)*1e-12);
      lo=observedMin-margin;
      hi=observedMax+margin;
      if(NONNEGATIVE.has(id))lo=Math.max(0,lo);
      if(!(lo<hi))hi=lo+Math.max(1e-12,Math.abs(lo)*1e-9);
      policy='TRAINING_MINMAX_PLUS_FIXED_MARGIN';
    }
    ranges.push([lo,hi]);
    details.push({index:i,id,observedMin,observedMax,range:[lo,hi],policy,marginFraction:policy==='ANALYTIC_BOUND'?0:marginFraction});
  }
  validateRanges(ranges);
  return Object.freeze({ranges:Object.freeze(ranges.map(r=>Object.freeze(r))),details:Object.freeze(details)});
}
export function coverageForRows(rows,ranges){
  validateRanges(ranges);
  const perDimension=DimensionCoverage(rows,ranges);
  const total=perDimension.reduce((s,d)=>s+d.total,0);
  const inside=perDimension.reduce((s,d)=>s+d.inside,0);
  return Object.freeze({perDimension,overall:total?inside/total:0,total,inside,outside:total-inside});
}
function DimensionCoverage(rows,ranges){
  return DIMENSION_ORDER.map((id,i)=>{
    const values=dimensionValues(rows,i),[lo,hi]=ranges[i];
    let inside=0,below=0,above=0;
    for(const v of values){
      if(v<lo)below++;
      else if(v>hi)above++;
      else inside++;
    }
    return Object.freeze({index:i,id,total:values.length,inside,below,above,coverage:inside/values.length,min:Math.min(...values),max:Math.max(...values)});
  });
}
export function createCalibrationProfile({
  ranges,details,training,holdout,mappingId='machine-consciousness-awareness-v0',
  profileId='machine-consciousness-awareness-calibration-v0'
}={}){
  validateRanges(ranges);
  return Object.freeze({
    schemaVersion:'0.1.0',
    profileId,
    status:'CANDIDATE_HOLDOUT_VALIDATED',
    mappingId,
    formulaId:'LEEWAY-FORMULA-v1.0',
    evaluatorAdapterId:'runtime-state-v1',
    formulaExecutionState:'NOT_EXECUTED',
    rangePolicy:{
      analyticBounds:['belief_entropy_nats','global_access_ratio'],
      empirical:'training min/max plus fixed 5% width margin',
      holdoutLeakage:false,
      marginFraction:CALIBRATION_MARGIN_FRACTION
    },
    dimensions:DIMENSION_ORDER.map((id,index)=>({index,id,range:[...ranges[index]],detail:details[index]})),
    ranges:ranges.map(r=>[...r]),
    training,
    holdout
  });
}
