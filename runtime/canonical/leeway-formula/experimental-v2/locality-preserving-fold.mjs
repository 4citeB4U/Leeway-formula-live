/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.LOCALITY_PRESERVING_HIERARCHICAL_FOLD
TAG: LEEWAY.G44.EXACT_INPUT_LOCAL_SPATIAL_BINNING
5WH:
WHAT = Stream canonical 64x64x8 tiles into contiguous, locality-preserving 32x32x8 working cells.
WHY = G43 periodic modulo folding aliases distant geospatial regions and cannot qualify spatial compute.
WHO = LeeWay creator-authorized mathematical candidate implementation, not Veritas authority.
WHERE = Leeway-formula-live/runtime/canonical/leeway-formula/experimental-v2/locality-preserving-fold.mjs
WHEN = 2026-10-23
HOW = Explicit spatial grid coordinate ranges, finite input, Kahan sums, per-voxel occupancy proof and hashes.
LICENSE: MIT
ASSURANCE: Experimental math only. Origin metadata unverified; not native GPU, independent ledger, or policy authority.
*/
import { createHash } from 'node:crypto';

const INPUT_SHAPE=[64,64,8], TARGET_SHAPE=[32,32,8];
const fail=(s)=>{ throw new Error(s); };
const scalarHash=a=>{const b=Buffer.alloc(a.length*8);for(let i=0;i<a.length;i++)b.writeDoubleLE(a[i],8*i);return createHash('sha256').update(b).digest('hex');};
const finiteVector3=x=>Array.isArray(x)&&x.length===3&&x.every(v=>typeof v==='number'&&Number.isFinite(v));
export function createG44LocalityPreservingFold(shape,{frame=null}={}){
 if(!Array.isArray(shape)||shape.length!==4||!shape.every(x=>Number.isSafeInteger(x)&&x>0)||
   shape[0]%64!==0||shape[1]%64!==0||shape[2]%8!==0||shape[3]>1024||
   shape.some((x,i)=>i<3&&x<TARGET_SHAPE[i])||
   shape[0]%32||shape[1]%32||shape[2]%8)
  fail('G44_CANONICAL_4D_ALIGNED_SHAPE_REQUIRED');
 const [X,Y,Z,L]=shape; const [OX,OY,OZ]=TARGET_SHAPE;
 const stride=[X/OX,Y/OY,Z/OZ];
 const tileGrid=[X/64,Y/64,Z/8,L];
 const expectedTiles=tileGrid.reduce((a,b)=>a*b,1);
 if(!Number.isSafeInteger(expectedTiles)||expectedTiles>10000000)
   fail('G44_TILE_COUNT_OVERFLOW_OR_BUDGET');
 const expectedSamplesPerCell=stride[0]*stride[1]*stride[2]*L;
 if(!Number.isSafeInteger(expectedSamplesPerCell)||expectedSamplesPerCell>2**32-1)
   fail('G44_SAMPLES_PER_CELL_OVERFLOW');
 if(frame!==null&&!(frame?.crs==='WGS84_LOCAL_ENU_METERS'&&finiteVector3(frame.originEcefM)&&
    finiteVector3(frame.sampleSpacingM)&&frame.sampleSpacingM.every(x=>x>0)))
  fail('G44_GEOSPATIAL_FRAME_METADATA_INVALID');
 const sums=new Float64Array(OX*OY*OZ), correction=new Float64Array(sums.length);
 const counts=new Uint32Array(sums.length);
 let received=0,sourceSamples=0;
 function push({coord,data}={}){
  if(!Array.isArray(coord)||coord.length!==4||!coord.every(Number.isInteger)||
   !(data instanceof Float32Array)||data.length!==64*64*8||!data.every(Number.isFinite))
   fail('G44_CANONICAL_FLOAT32_TILE_REQUIRED');
  const sx=coord[0],sy=coord[1],sz=coord[2],lane=coord[3];
  const canonical=((sx*tileGrid[1]+sy)*tileGrid[2]+sz)*L+lane;
  if(canonical!==received)fail('G44_TILE_OUT_OF_ORDER_DUPLICATE_OR_MISSING');
  const xBase=sx*64,yBase=sy*64,zBase=sz*8;
  for(let x=0;x<64;x++){
   const ox=Math.floor((xBase+x)/stride[0]);
   for(let y=0;y<64;y++){
    const oy=Math.floor((yBase+y)/stride[1]);
    const base=((ox*OY)+oy)*OZ;
    const srcOffset=(x*64+y)*8;
    for(let z=0;z<8;z++){
     const oz=Math.floor((zBase+z)/stride[2]);
     const outputIndex=base+oz;
     const value=data[srcOffset+z];
     const next=value-correction[outputIndex],updated=sums[outputIndex]+next;
     correction[outputIndex]=(updated-sums[outputIndex])-next;
     sums[outputIndex]=updated;
     counts[outputIndex]++;
    }
   }
  }
  received++;sourceSamples+=data.length;
 }
 function finish(){
  if(received!==expectedTiles)fail('G44_MISSING_INPUT_TILES');
  const output=new Float64Array(sums.length);
  for(let i=0;i<sums.length;i++){
   if(counts[i]!==expectedSamplesPerCell)fail('G44_LOCALITY_BIN_MASS_NOT_CONSERVED');
   output[i]=sums[i]/counts[i];
   if(!Number.isFinite(output[i]))fail('G44_REDUCTION_OVERFLOW');
  }
  return {workspace:output,receipt:Object.freeze({
   schema:'leeway.formula.experimental-v2.g44.locality-preserving-fold.v1',
   inputShape:[...shape],inputTileShape:[...INPUT_SHAPE],outputShape:[...TARGET_SHAPE],
   sourceTiles:received,sourceElements:sourceSamples,sourceSamplesPerOutputVoxel:expectedSamplesPerCell,
   sourceFrame:frame?{...frame}:null,
   reduction:'CONTIGUOUS_GRID_CELL_MEAN_NOT_MODULO',
   reducedWorkspaceSha256:scalarHash(output),
   observedAllOutputOccupancy:true,originalInputRetainedByThisReducer:false,
   frameMetadataIndependentlyVerified:false,geodeticAccuracyQualified:false,
   mathematicalSourceKind:'UNTRUSTED_PROVIDED_CANONICAL_TILES',
   ownerApprovedFeatureMapping:false,productionAccepted:false
  })};
 }
 return {push,finish,tileShape:INPUT_SHAPE,outputShape:TARGET_SHAPE};
}
export function* tapG44Locality(tiles,reducer){
 if(!tiles||typeof tiles[Symbol.iterator]!=='function'||!reducer?.push)
   fail('G44_CANONICAL_TILE_ITERATOR_AND_REDUCER_REQUIRED');
 for(const tile of tiles){reducer.push(tile);yield tile;}
}
