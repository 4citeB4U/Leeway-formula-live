/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.SPATIAL_SCENE_TENSOR_COMPOSITION
TAG: LEEWAY.G41.MATHEMATICAL_ENGINE_FUSION_16x16x16
5WH:
WHAT = Compose WGS84/ECEF/ENU and Three-style scene geometry math into a bounded observation tensor.
WHY = Mathematical prowess must enter Formula's candidate data path, not stop at disconnected renderers.
WHO = Creator-authorized LeeWay experimental math; no independent provider or policy certificate.
WHERE = Formula experimental-v2/fused-spatial-scene-tensor.mjs
WHEN = 2026-10-22
HOW = Sixteen frames, sixteen samples per frame, sixteen explicit per-sample spatial/geometry channels.
LICENSE: MIT (independently implemented standard equations; external math comparisons separately audited)
AUTHORITY: Experimental sample preparation only, NOT production readiness.
*/
import {createHash} from 'node:crypto';
import {
 wgs84GeodeticToEcef,wgs84EcefToEnu,wgs84SurfaceDistanceVincenty,
 composeSceneMatrix4,transformScenePoint,triangleUnitNormal,bounds3
} from './spatial-geometry-math.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const hashFloat64=x=>{const buf=Buffer.allocUnsafe(x.length*8);x.forEach((v,i)=>buf.writeDoubleLE(v,8*i));return sha(buf)};
export const FUSED_G41_CHANNELS=Object.freeze([
 'ecef_x_m','ecef_y_m','ecef_z_m',
 'enu_east_m','enu_north_m','enu_up_m',
 'wgs84_surface_distance_m','ecef_slant_distance_m',
 'scene_x_units','scene_y_units','scene_z_units',
 'triangle_normal_x_unitless','triangle_normal_y_unitless','triangle_normal_z_unitless',
 'triangle_bounds_extent_x_units','triangle_bounds_extent_y_units'
]);
export function createFusedSpatialSceneTensor(frames,{sourceId}={}){
 if(typeof sourceId!=='string'||!/^[-A-Za-z0-9_.:]{4,120}$/.test(sourceId))
  throw Error('G41_FUSION_PROVENANCE_SOURCE_ID_REQUIRED');
 if(!Array.isArray(frames)||frames.length!==16)
  throw Error('G41_FUSION_16_COMPLETE_FRAMES_REQUIRED');
 const tensor=new Float64Array(4096);
 for(let i=0;i<16;i++){
  const frame=frames[i];
  if(!Array.isArray(frame)||frame.length!==16)
   throw Error('G41_FUSION_FRAME_REQUIRES_16_COMPLETE_SAMPLES');
  for(let j=0;j<16;j++){
   const record=frame[j];
   if(!record||!record.origin||!record.target||!record.scene)
    throw Error('G41_FUSION_MEASURED_SPATIAL_AND_SCENE_REQUIRED');
   const target=wgs84GeodeticToEcef(record.target);
   const origin=wgs84GeodeticToEcef(record.origin);
   const enu=wgs84EcefToEnu({origin:record.origin,target:record.target});
   const surface=wgs84SurfaceDistanceVincenty(record.origin,record.target);
   const slant=Math.hypot(...target.map((v,k)=>v-origin[k]));
   const scene=record.scene;
   const m=composeSceneMatrix4(scene);
   const transformed=transformScenePoint(m,scene.point);
   if(!Array.isArray(scene.triangle)||scene.triangle.length!==3)
    throw Error('G41_FUSION_TRIANGLE_REQUIRED');
   const normal=triangleUnitNormal(...scene.triangle);
   const bounds=bounds3(scene.triangle);
   const channels=[...target,...enu,surface,slant,...transformed,...normal,
    bounds.max[0]-bounds.min[0],bounds.max[1]-bounds.min[1]];
   if(channels.length!==16||!channels.every(Number.isFinite))
    throw Error('G41_FUSION_NONFINITE_OR_INCOMPLETE_CHANNELS');
   tensor.set(channels,(i*16+j)*16);
  }
 }
 return Object.freeze({
  schema:'leeway.formula.experimental-v2.cesium-three-math-tensor.v1',
  sourceId,inputShape:[16,16,16],channelNames:[...FUSED_G41_CHANNELS],
  tensor,tensorSha256:hashFloat64(tensor),coordinateFrame:'WGS84_ECEF_ENU_PLUS_SCENE_LOCAL',
  provenanceClass:'UNVERIFIED_CALLER_INPUT_NOT_SIGNED',
  independentCesiumAndThreeNumericalParityTestedSeparately:true,
  formulaPolicyAuthority:false,productionAccepted:false
 });
}
