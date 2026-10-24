/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.EXPERIMENTAL_DENSE_PROJECTION
TAG: LEEWAY.FORMULA.G41.16XSC_TO_16X6_CONTROL_CANDIDATE
5WH:
WHAT = Project bounded 16xSxC mathematical observations to candidate 16x6 using explicit coefficients.
WHY = Permit higher-dimensional Cesium/Three math without changing or impersonating Golden Formula v1.
WHO = Creator-authorized math engineering; policy weights and calibration not independently approved.
WHERE = Formula runtime/canonical/leeway-formula/experimental-v2/tensor-projection.mjs
WHEN = 2026-10-22
HOW = Shape-safe 16x(S*C) by (S*C)x6 double-precision compensated summation in tiles.
LICENSE: MIT
AUTHORITY: Shadow projection only. Never canonical Formula/policy approval.
*/
import {createHash} from 'node:crypto';
export const PROJECTION_ID='LEEWAY_MATH_G41_TENSOR_OBSERVATION_CANDIDATE_V1';
const sha=b=>createHash('sha256').update(b).digest('hex');
const sameShape=(v,n)=>v instanceof Float64Array&&v.length===n&&v.every(Number.isFinite);
const bufferSha=v=>{const b=Buffer.allocUnsafe(v.length*8);for(let i=0;i<v.length;i++)b.writeDoubleLE(v[i],i*8);return sha(b)};
const finiteId=x=>typeof x==='string'&&/^[A-Za-z0-9._:-]{4,120}$/.test(x);
export function projectTensorToFormulaShadow({
 tensor,shape,weights,bias,featureNames,featureUnits,
 sourceId,calibrationId,activation='IDENTITY',tileSize=16
}={}){
 if(!Array.isArray(shape)||shape.length!==3||!shape.every(Number.isInteger))
  throw Error('G41_TENSOR_SHAPE_REQUIRED');
 const [rows,samples,channels]=shape;
 if(rows!==16||samples<1||samples>64||channels<1||channels>64||
    samples*channels>4096)throw Error('G41_16_ROWS_BOUNDED_SAMPLE_CHANNEL_SHAPE_REQUIRED');
 const k=samples*channels;
 if(!sameShape(tensor,rows*k)||!sameShape(weights,k*6)||!sameShape(bias,rows*6))
  throw Error('G41_TENSOR_WEIGHT_BIAS_FINITE_FLOAT64_AND_SHAPES_REQUIRED');
 if(![16,32].includes(tileSize))throw Error('G41_TILE_SIZE_MUST_BE_16_OR_32');
 if(!Array.isArray(featureNames)||featureNames.length!==6||
   new Set(featureNames).size!==6||!featureNames.every(finiteId)||
   !Array.isArray(featureUnits)||featureUnits.length!==6||
   !featureUnits.every(u=>typeof u==='string'&&u.length>0&&u.length<=48))
  throw Error('G41_SIX_MEASURED_FEATURE_NAMES_UNITS_REQUIRED');
 if(!finiteId(sourceId)||!finiteId(calibrationId))
  throw Error('G41_SOURCE_AND_CALIBRATION_ID_REQUIRED');
 if(!['IDENTITY','TANH'].includes(activation))
  throw Error('G41_UNQUALIFIED_ACTIVATION');
 for(let f=0;f<6;f++){
  let active=false;for(let a=0;a<k;a++){if(weights[a*6+f]!==0){active=true;break}}
  if(!active)throw Error('G41_EMPTY_PROJECTION_FEATURE_'+f);
 }
 // One output lane per row and measured feature. Stable reduction order
 // across tiles, explicit cancellation correction, no GPU provider required.
 const out=new Float64Array(96);
 for(let i=0;i<16;i++){
  for(let f=0;f<6;f++){
   let sum=bias[i*6+f],compensation=0;
   for(let start=0;start<k;start+=tileSize){
    const end=Math.min(k,start+tileSize);
    for(let q=start;q<end;q++){
     const product=tensor[i*k+q]*weights[q*6+f];
     if(!Number.isFinite(product))throw Error('G41_OVERFLOW_AT_TENSOR_PRODUCT');
     const y=product-compensation,t=sum+y;
     compensation=(t-sum)-y;
     sum=t;
    }
   }
   if(!Number.isFinite(sum))throw Error('G41_NONFINITE_PROJECTION_RESULT');
   out[i*6+f]=activation==='TANH'?Math.tanh(sum):sum;
 }
 }
 const projection={
   schema:'leeway.formula.experimental-v2.tensor-to-16x6-shadow.v1',
   projectionId:PROJECTION_ID,sourceId,calibrationId,
   inputShape:[rows,samples,channels],weightShape:[k,6],
   outputShape:[16,6],featureNames:[...featureNames],
   featureUnits:[...featureUnits],activation,tileSize,
   inputSha256:bufferSha(tensor),weightsSha256:bufferSha(weights),
   biasSha256:bufferSha(bias),outputSha256:bufferSha(out),
   stateRows:Array.from({length:16},(_,i)=>Array.from(out.slice(i*6,i*6+6))),
   lossyProjection:true,allTensorValuesRecoverable:false,
   mappedToCanonicalQVHRSL:false,ownerApprovedCalibration:false,
   policyAuthority:false,formulaExecutionState:'NOT_EXECUTED',
   productionAccepted:false
 };
 return Object.freeze(projection);
}
