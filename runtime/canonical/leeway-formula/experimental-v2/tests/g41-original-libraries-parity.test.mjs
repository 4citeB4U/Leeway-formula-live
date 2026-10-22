/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.EXTERNAL_MATH_REFERENCE_VERIFICATION
TAG: LEEWAY.G41.CESIUM_THREE_REAL_LIBRARIES_PARITY
5WH:
WHAT = Compare LeeWay additive math directly against original installed Cesium and Three math engines.
WHY = Independent analytical fixtures alone do not show library compatibility.
WHO = Creator-authorized LeeWay math engineering; no production policy signer.
WHERE = experimental-v2/tests/g41-original-libraries-parity.test.mjs
WHEN = 2026-10-22
HOW = Optional existing offline library paths, 3D coordinates, quaternion/Matrix4 and geodesics.
LICENSE: MIT. Cesium Apache-2.0; Three.js MIT; no library source copied.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {join,resolve} from 'node:path';
import {existsSync} from 'node:fs';
import {
 wgs84GeodeticToEcef,wgs84EcefToEnu,wgs84SurfaceDistanceVincenty,
 composeSceneMatrix4,transformScenePoint,bounds3,triangleUnitNormal
} from '../spatial-geometry-math.mjs';
const cesiumRoot=process.env.LEEWAY_G41_CESIUM_ROOT;
const threeRoot=process.env.LEEWAY_G41_THREE_ROOT;
const cm=cesiumRoot?resolve(cesiumRoot,'Source','Cesium.js'):null;
const tm=threeRoot?resolve(threeRoot,'build','three.module.js'):null;
const eps=(a,b,tol=1e-5)=>assert.ok(Math.abs(a-b)<=tol,
 'G41_MATH_LIB_PARITY '+a+' != '+b);
test('G41 WGS84 geodesics, ECEF and ENU agree with genuine CesiumJS', {skip:!cm||!existsSync(cm)},async()=>{
 const C=await import(pathToFileURL(cm).href);
 const spots=[
  [{latDeg:0,lonDeg:0,heightM:0},{latDeg:0,lonDeg:1,heightM:0}],
  [{latDeg:40.7128,lonDeg:-74.006,heightM:3},{latDeg:40.714,lonDeg:-74.002,heightM:23}],
  [{latDeg:48.8566,lonDeg:2.3522,heightM:20},{latDeg:48.8584,lonDeg:2.2945,heightM:40}],
  [{latDeg:-33.8688,lonDeg:151.2093,heightM:4},{latDeg:-33.8703,lonDeg:151.215,heightM:7}]
 ];
 for(const [a,b] of spots){
  const cartA=C.Cartesian3.fromDegrees(a.lonDeg,a.latDeg,a.heightM);
  const cartB=C.Cartesian3.fromDegrees(b.lonDeg,b.latDeg,b.heightM);
  const oursA=wgs84GeodeticToEcef(a),oursB=wgs84GeodeticToEcef(b);
  oursA.forEach((x,i)=>eps(x,[cartA.x,cartA.y,cartA.z][i],1e-6));
  oursB.forEach((x,i)=>eps(x,[cartB.x,cartB.y,cartB.z][i],1e-6));
  const from=C.Cartographic.fromDegrees(a.lonDeg,a.latDeg);
  const to=C.Cartographic.fromDegrees(b.lonDeg,b.latDeg);
  const geo=new C.EllipsoidGeodesic(from,to);
  eps(wgs84SurfaceDistanceVincenty(a,b),geo.surfaceDistance,0.03);
  const m=C.Transforms.eastNorthUpToFixedFrame(cartA);
  const inv=C.Matrix4.inverseTransformation(m,new C.Matrix4());
  const east=C.Matrix4.multiplyByPoint(inv,cartB,new C.Cartesian3());
  const local=wgs84EcefToEnu({origin:a,target:b});
  // Both routes use Float64, but ECEF subtraction and ENU matrix multiply reorder operations.
  // Allow 10 micrometres absolute error; never infer centimeter-level calibration from this test.
  local.forEach((x,i)=>eps(x,[east.x,east.y,east.z][i],1e-5));
 }
});
test('G41 quaternion/Matrix4, bounds and triangle normal agree with genuine Three.js', {skip:!tm||!existsSync(tm)},async()=>{
 const T=await import(pathToFileURL(tm).href);
 for(const angle of [0,Math.PI/6,Math.PI/2]){
  const q=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),angle);
  const pos=[1,3,-2],scale=[2,3,4];
  const their=new T.Matrix4().compose(new T.Vector3(...pos),q,new T.Vector3(...scale));
  const ours=composeSceneMatrix4({position:pos,quaternion:[q.x,q.y,q.z,q.w],scale});
  their.elements.forEach((x,i)=>eps(ours[i],x,1e-12));
  const p=[2,5,3],native=new T.Vector3(...p).applyMatrix4(their);
  transformScenePoint(ours,p).forEach((x,i)=>eps(x,[native.x,native.y,native.z][i],1e-12));
 }
 const points=[[-1,0,3],[0,1,2],[2,3,4]];
 const box=new T.Box3().setFromPoints(points.map(x=>new T.Vector3(...x)));
 assert.deepEqual(bounds3(points),{min:box.min.toArray(),max:box.max.toArray()});
 const a=[0,0,0],b=[1,0,0],c=[0,1,0];
 const normal=new T.Vector3().crossVectors(new T.Vector3(...b).sub(new T.Vector3(...a)),
    new T.Vector3(...c).sub(new T.Vector3(...a))).normalize();
 assert.deepEqual(triangleUnitNormal(a,b,c),normal.toArray());
});
