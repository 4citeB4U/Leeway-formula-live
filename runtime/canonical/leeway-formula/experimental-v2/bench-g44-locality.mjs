/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.FULL_SCALE_LOCALITY_BENCHMARK
TAG: LEEWAY.G44.640X320X64X16_STREAMED_GRID_REFERENCED
5WH:
WHAT = Execute full-size 800MiB logical index-locality fold using eight synthetic repeated tiles.
WHY = Verify 6400 canonical blocks, 25600 contributions per voxel, real memory usage and numeric reference.
WHO = Creator-authorized LeeWay engineering; experimental independent machine, not owner laptop.
WHERE = Formula experimental-v2/bench-g44-locality.mjs
WHEN = 2026-10-23
HOW = Stream canonical tiles and cross-check selected voxels by independent source-index loops.
LICENSE: MIT
ASSURANCE: Synthetic benchmark; not actual Cesium or Three traces, protected provenance, original ledgers or GPU speed evidence.
*/
import {performance} from 'node:perf_hooks';
import {createG44LocalityPreservingFold} from './locality-preserving-fold.mjs';
const shape=[640,320,64,16],nPatterns=8;
const variants=Array.from({length:nPatterns},(_,v)=>Float32Array.from({length:64*64*8},(_,index)=>{
 const x=Math.floor(index/(64*8)),y=Math.floor(index/8)%64,z=index%8;
 return ((x%8)*3+(y%8)*5+z*7+v*11)%201/16;
}));
const started=performance.now();let ordinal=0,peak=process.memoryUsage().rss;
const fold=createG44LocalityPreservingFold(shape,{frame:{crs:'WGS84_LOCAL_ENU_METERS',originEcefM:[6378137,0,0],sampleSpacingM:[1,1,1]}});
for(let tx=0;tx<10;tx++)for(let ty=0;ty<5;ty++)for(let tz=0;tz<8;tz++)for(let lane=0;lane<16;lane++){
 fold.push({coord:[tx,ty,tz,lane],data:variants[ordinal%8]});ordinal++;
 if((ordinal&127)===0)peak=Math.max(peak,process.memoryUsage().rss);
}
const {workspace,receipt}=fold.finish();const durationMs=performance.now()-started;
const positions=[[0,0,0],[1,1,7],[10,20,4],[31,31,0],[17,8,6]];
let maxError=0;
for(const [ox,oy,oz] of positions){let sum=0;
 for(let x=ox*20;x<(ox+1)*20;x++)for(let y=oy*10;y<(oy+1)*10;y++)for(let z=oz*8;z<(oz+1)*8;z++)for(let l=0;l<16;l++){
  sum+=((x%8)*3+(y%8)*5+(z%8)*7+(l%8)*11)%201/16;
 }
 const expected=sum/(20*10*8*16),actual=workspace[(ox*32+oy)*8+oz];
 maxError=Math.max(maxError,Math.abs(expected-actual));
 if(Math.abs(expected-actual)>1e-11)throw Error('G44_800M_INDEPENDENT_ORACLE_MISMATCH '+[ox,oy,oz]);
}
console.log(JSON.stringify({
 schema:'leeway.formula.experimental-v2.g44.fullscale-locality-benchmark.v1',
 logicalSourceShape:shape,sourceTiles:ordinal,sourceElements:receipt.sourceElements,
 rawLogicalBytes:receipt.sourceElements*4,sourceElementsPerOutputCell:receipt.sourceSamplesPerOutputVoxel,
 outputShape:receipt.outputShape,outputHash:receipt.reducedWorkspaceSha256,
 checkedIndependentVoxelOracles:positions.length,maxAbsoluteError:maxError,
 elapsedMs:durationMs,peakRssBytes:peak,currentRssBytes:process.memoryUsage().rss,
 source:'SYNTHETIC_8_REPEATING_TILE_PATTERNS',
 originalDataArchivedHere:false,semanticMappingApproved:false,
 actualOwnerLaptop:false,productionAccepted:false
},null,2));
