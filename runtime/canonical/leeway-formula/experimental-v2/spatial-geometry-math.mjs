/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.EXPERIMENTAL_SPATIAL_GEOMETRY
TAG: LEEWAY.FORMULA.G41.CESIUM_THREE_MATH_INDEPENDENT_REFERENCE
5WH:
WHAT = Bring WGS84, ENU, quaternion, Matrix4 and mesh arithmetic into Formula's additive math toolkit.
WHY = Preserve Cesium/Three mathematical capabilities without adding WebGL, rendering or GPU dependencies.
WHO = Creator-authorized LeeWay mathematical research; no Formula v1 or policy replacement authority.
WHERE = Formula runtime/canonical/leeway-formula/experimental-v2/spatial-geometry-math.mjs
WHEN = 2026-10-22
HOW = Standard WGS84 ellipsoid/ENU equations and column-major scene transforms; verify separately against original libraries.
LICENSE: MIT (independent equations; Cesium Apache-2.0 and Three.js MIT attribution retained in G41 report)
AUTHORITY: Experimental mathematical toolkit only; NOT signed Formula policy.
*/
export const LEEWAY_SPATIAL_MATH_VERSION='G41_SPATIAL_GEOMETRY_MATH_CANDIDATE_V1';
const A=6378137, INVERSE_FLATTENING=298.257223563;
const F=1/INVERSE_FLATTENING, B=A*(1-F), E2=F*(2-F);
const toRad=Math.PI/180;
const finite=(x,name)=>{if(typeof x!=='number'||!Number.isFinite(x))throw Error('G41_NON_FINITE_'+name);return x};
const vector=(x,n,name)=>{
 if(!Array.isArray(x)||x.length!==n||x.some(v=>typeof v!=='number'||!Number.isFinite(v)))
  throw Error('G41_INVALID_'+name);
 return x;
};
function latLon(latDeg,lonDeg,heightM=0){
 finite(latDeg,'LAT');finite(lonDeg,'LON');finite(heightM,'HEIGHT');
 if(Math.abs(latDeg)>90||Math.abs(lonDeg)>180||Math.abs(heightM)>1e9)
  throw Error('G41_WGS84_COORDINATES_OUT_OF_RANGE');
 return [latDeg*toRad,lonDeg*toRad,heightM];
}
export function wgs84GeodeticToEcef({latDeg,lonDeg,heightM=0}={}){
 const [p,l,h]=latLon(latDeg,lonDeg,heightM);
 const cp=Math.cos(p),sp=Math.sin(p),cl=Math.cos(l),sl=Math.sin(l);
 const n=A/Math.sqrt(1-E2*sp*sp);
 return [(n+h)*cp*cl,(n+h)*cp*sl,(n*(1-E2)+h)*sp];
}
export function wgs84EcefToEnu({origin,target}={}){
 if(!origin||!target)throw Error('G41_WGS84_ORIGIN_TARGET_REQUIRED');
 const [p,l]=latLon(origin.latDeg,origin.lonDeg,origin.heightM??0);
 const a=wgs84GeodeticToEcef(origin),b=wgs84GeodeticToEcef(target);
 const x=b[0]-a[0],y=b[1]-a[1],z=b[2]-a[2];
 const sp=Math.sin(p),cp=Math.cos(p),sl=Math.sin(l),cl=Math.cos(l);
 return [
   -sl*x+cl*y,
   -sp*cl*x-sp*sl*y+cp*z,
   cp*cl*x+cp*sl*y+sp*z
 ];
}
export function wgs84SurfaceDistanceVincenty(start,end){
 if(!start||!end)throw Error('G41_VINCENTY_POINTS_REQUIRED');
 const [p1,l1]=latLon(start.latDeg,start.lonDeg,0);
 const [p2,l2]=latLon(end.latDeg,end.lonDeg,0);
 if(p1===p2&&l1===l2)return 0;
 const u1=Math.atan((1-F)*Math.tan(p1)),u2=Math.atan((1-F)*Math.tan(p2));
 const su1=Math.sin(u1),cu1=Math.cos(u1),su2=Math.sin(u2),cu2=Math.cos(u2);
 const L=l2-l1;let lambda=L,sigma=0,sina=0,cosa2=0,cos2sm=0,coss=0,sins=0;
 let converged=false;
 for(let i=0;i<200;i++){
  const sl=Math.sin(lambda),cl=Math.cos(lambda);
  sins=Math.hypot(cu2*sl,cu1*su2-su1*cu2*cl);
  if(sins===0)return 0;
  coss=su1*su2+cu1*cu2*cl;
  sigma=Math.atan2(sins,coss);
  sina=cu1*cu2*sl/sins;cosa2=1-sina*sina;
  cos2sm=cosa2<1e-18?0:coss-2*su1*su2/cosa2;
  const C=F/16*cosa2*(4+F*(4-3*cosa2));
  const next=L+(1-C)*F*sina*(sigma+C*sins*(cos2sm+
     C*coss*(-1+2*cos2sm*cos2sm)));
  if(Math.abs(next-lambda)<1e-12){lambda=next;converged=true;break}
  lambda=next;
 }
 if(!converged)throw Error('G41_VINCENTY_UNCONVERGED_USE_QUALIFIED_FALLBACK');
 const u2n=cosa2*(A*A-B*B)/(B*B);
 const av=1+u2n/16384*(4096+u2n*(-768+u2n*(320-175*u2n)));
 const bv=u2n/1024*(256+u2n*(-128+u2n*(74-47*u2n)));
 const ds=bv*sins*(cos2sm+bv/4*(coss*(-1+2*cos2sm**2)-
   bv/6*cos2sm*(-3+4*sins*sins)*(-3+4*cos2sm**2)));
 const result=B*av*(sigma-ds);
 if(!Number.isFinite(result)||result<0)throw Error('G41_INVALID_GEODESIC_RESULT');
 return result;
}
export function composeSceneMatrix4({position=[0,0,0],quaternion=[0,0,0,1],scale=[1,1,1]}={}){
 const p=vector(position,3,'POSITION'),q=vector(quaternion,4,'QUATERNION');
 const s=vector(scale,3,'SCALE');
 const len=Math.hypot(...q);
 if(Math.abs(len-1)>1e-8)throw Error('G41_UNNORMALIZED_QUATERNION');
 const [x,y,z,w]=q, [sx,sy,sz]=s;
 const x2=x+x,y2=y+y,z2=z+z;
 const xx=x*x2,xy=x*y2,xz=x*z2,yy=y*y2,yz=y*z2,zz=z*z2;
 const wx=w*x2,wy=w*y2,wz=w*z2;
 // Three.Matrix4.compose compatible column-major order; no renderer dependency.
 return [
  (1-(yy+zz))*sx,(xy+wz)*sx,(xz-wy)*sx,0,
  (xy-wz)*sy,(1-(xx+zz))*sy,(yz+wx)*sy,0,
  (xz+wy)*sz,(yz-wx)*sz,(1-(xx+yy))*sz,0,
  p[0],p[1],p[2],1
 ];
}
export function transformScenePoint(matrix4,point){
 const m=vector(matrix4,16,'MATRIX4'),p=vector(point,3,'POINT');
 const w=m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15];
 if(!Number.isFinite(w)||Math.abs(w)<1e-12)throw Error('G41_INVALID_HOMOGENEOUS_W');
 return [
  (m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12])/w,
  (m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13])/w,
  (m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14])/w
 ];
}
export function triangleUnitNormal(a,b,c){
 const p=vector(a,3,'TRIANGLE_A'),q=vector(b,3,'TRIANGLE_B'),r=vector(c,3,'TRIANGLE_C');
 const u=q.map((v,i)=>v-p[i]),v=r.map((x,i)=>x-p[i]);
 const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
 const len=Math.hypot(...cross);
 if(len<1e-12)throw Error('G41_DEGENERATE_TRIANGLE');
 return cross.map(v=>v/len);
}
export function triangleBarycentricSample(a,b,c,u,v){
 vector(a,3,'TRIANGLE_A');vector(b,3,'TRIANGLE_B');vector(c,3,'TRIANGLE_C');
 finite(u,'SAMPLE_U');finite(v,'SAMPLE_V');
 if(u<0||u>1||v<0||v>1)throw Error('G41_SAMPLE_NOT_UNIT_INTERVAL');
 const su=Math.sqrt(u),wa=1-su,wb=su*(1-v),wc=su*v;
 return a.map((x,i)=>wa*x+wb*b[i]+wc*c[i]);
}
export function bounds3(points){
 if(!Array.isArray(points)||points.length===0||points.length>65536)
  throw Error('G41_BOUNDS_POINT_COUNT_INVALID');
 const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(const point of points){
  const p=vector(point,3,'BOUNDS_POINT');
  for(let i=0;i<3;i++){lo[i]=Math.min(lo[i],p[i]);hi[i]=Math.max(hi[i],p[i]);}
 }
 return {min:lo,max:hi};
}
