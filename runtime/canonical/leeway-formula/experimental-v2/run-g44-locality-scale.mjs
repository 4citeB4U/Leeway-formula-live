/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.REPRODUCIBLE_FULL_SCALE_SIMULATION
TAG: LEEWAY.G44.SYNTHETIC_640_320_64_16_ARCHIVE_REPLAY
5WH:
WHAT = Reproduce a bounded 800 MiB logical source-stream and spatial locality reduction independently.
WHY = A shape check is not a full-scale execution or durability measurement.
WHO = Creator-authorized mathematical engineering; not protected production GPU issuer.
WHERE = Formula experimental-v2/run-g44-locality-scale.mjs
WHEN = 2026-10-22
HOW = Stream G43 canonical Float32 tiles, capture WGS84-anchored per-tile 2x2 pools, independently replay both archives and report RSS/timing.
LICENSE: MIT
ASSURANCE: Synthetic repeated inputs only; not live Cesium/Three source, GPU throughput or original Receipt/Learning admission.
*/
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {ingestHierarchicalMacroTensor,createG43SyntheticTileStream,
 verifyHierarchicalMacroArchive} from './hierarchical-macro-stream.mjs';
import {openLocalityPoolRecorder,verifyLocalityPoolArchive} from './spatial-locality-pooling.mjs';
const full=process.argv.includes('--full');
const shape=full?[640,320,64,16]:[128,128,8,2];
const expectedTiles=shape[0]/64*shape[1]/64*shape[2]/8*shape[3];
const archiveDir=fs.mkdtempSync(path.join(os.tmpdir(),'leeway-g44-locality-repro-'));
const spatialReference={
 frame:'WGS84_ANCHORED_ENU_METERS',
 anchor:{latDeg:43.0389,lonDeg:-87.9065,heightM:188},
 originEastM:0,originNorthM:0,stepEastM:1,stepNorthM:1
};
let recorder,completed=false;
const start=performance.now();
try{
 const output=ingestHierarchicalMacroTensor({
  shape,archiveDir,maxTileCount:expectedTiles,maxStoredBytes:32*1024*1024,
  tiles:createG43SyntheticTileStream(shape,{diversity:8}),
  onCanonicalTile:item=>{
   if(!recorder)recorder=openLocalityPoolRecorder(archiveDir,spatialReference);
   recorder.write(item);
  }
 });
 const locality=recorder.finish(),ingested=performance.now();
 const original=await verifyHierarchicalMacroArchive(archiveDir);
 const spatial=verifyLocalityPoolArchive(archiveDir),finished=performance.now();
 if(!original.passed||!spatial.passed||locality.tileCount!==expectedTiles)
  throw Error('G44_FULL_SOURCE_AND_LOCALITY_INTEGRITY_NOT_VERIFIED');
 let bytes=0;for(const entry of fs.readdirSync(archiveDir,{withFileTypes:true})){
  const walk=dir=>{for(const f of fs.readdirSync(dir,{withFileTypes:true})){
   const p=path.join(dir,f.name);
   if(f.isDirectory())walk(p);else bytes+=fs.statSync(p).size;
  }};
  if(entry.isDirectory())walk(path.join(archiveDir,entry.name));
  else bytes+=fs.statSync(path.join(archiveDir,entry.name)).size;
 }
 const report={
  schema:'leeway.formula.experimental-v2.g44.full-scale-locality-test.v1',
  targetShape:shape,sourceBytes:output.report.sourceBytes,
  sourceTiles:expectedTiles,
  independentlyReconstructedOriginal:original.sourceHashMatches,
  independentlyVerifiedLocalPooling:spatial.spatialNeighbors2x2Verified,
  distinctTilePatterns:output.report.distinctSourceTileHashes,
  exactReusedSourceTiles:output.report.tilesWithComputationalReuse,
  storedBytesIncludingBothArchivesAndLocalJournals:bytes,
  observedPeakRssBytes:output.report.memory.observedPeakProcessRssBytes,
  elapsedIngestAndPoolMs:ingested-start,
  elapsedReplayMs:finished-ingested,
  elapsedTotalMs:finished-start,
  localityChainRootSha256:locality.localUnsignedPoolChainRootSha256,
  originalSourceSha256:output.report.logicalSourceSha256,
  originalProducer:'EIGHT_REPEATING_SYNTHETIC_TILE_PATTERNS',
  originalFrozenFormulaMutation:false,
  endToEndFormulaPolicyAuthorized:false,
  localityBeyondSingleTileQualified:false,
  originalProtectedLedgersAdmitted:false,
  productionAccepted:false
 };
 console.log(JSON.stringify(report,null,2));completed=true;
}finally{
 if(completed&&process.env.LEEWAY_G44_KEEP_EVIDENCE!=='1')
  fs.rmSync(archiveDir,{recursive:true,force:true});
 else if(!completed)console.error('G44_INCOMPLETE_ARCHIVE_RETAINED '+archiveDir);
}
