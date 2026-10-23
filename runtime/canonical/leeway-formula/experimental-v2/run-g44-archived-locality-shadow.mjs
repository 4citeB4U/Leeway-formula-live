/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.FULLSCALE_INTEGRATED_ARCHIVE_LOCALITY_FORMULA
TAG: LEEWAY.G44.800M_SHADOW_ARCHIVE_REPLAY_WITH_TRUE_SPATIAL_LOCALITY
5WH:
WHAT = Replay exact 800MiB logical source from G43 while computing G44 contiguous 3D means and G41 Formula v1 shadow.
WHY = Prove archive + locality + Formula share one bounded streaming source rather than separate incompatible experiments.
WHO = Creator-authorized synthetic validation, not independent production Veritas.
WHERE = Formula experimental-v2/run-g44-archived-locality-shadow.mjs
WHEN = 2026-10-23
HOW = Canonical 640x320x64x16 generator, G43 archival and readback, G44 tap, independent analytic oracle and unapproved projection.
LICENSE: MIT
ASSURANCE: CPU-only synthetic CI. No real Cesium/Three data, protected ledger, LDWMD lease, Veritas signer or release admission.
*/
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {createG43SyntheticTileStream,ingestHierarchicalMacroTensor,verifyHierarchicalMacroArchive}
 from './hierarchical-macro-stream.mjs';
import {createG44LocalityPreservingFold,tapG44Locality} from './locality-preserving-fold.mjs';
import {projectTensorToFormulaShadow} from './tensor-projection.mjs';
import {evaluateG41SpatialProjectionShadow} from './formula-shadow-bridge.mjs';
const shape=[640,320,64,16], archiveDir=fs.mkdtempSync(path.join(os.tmpdir(),'leeway-g44-integrated-'));
try{
 const fold=createG44LocalityPreservingFold(shape);
 const started=performance.now();
 const archived=ingestHierarchicalMacroTensor({
  shape,tiles:tapG44Locality(createG43SyntheticTileStream(shape,{diversity:8}),fold),
  archiveDir,maxTileCount:6400,maxStoredBytes:16*1024*1024
 });
 const {workspace,receipt:locality}=fold.finish();
 const ingestMs=performance.now()-started;
 const replay=await verifyHierarchicalMacroArchive(archiveDir);
 if(!replay.passed||archived.report.tileCount!==6400||
    archived.report.sourceBytes!=='838860800'||
    locality.sourceElements!==209715200||locality.sourceSamplesPerOutputVoxel!==25600)
  throw Error('G44_FULL_SIZE_ARCHIVE_LOCALITY_SOURCE_BINDING_FAILED');
 const positions=[[0,0,0],[1,1,7],[10,20,4],[31,31,0],[17,8,6]];
 let maxAbsError=0;
 for(const [ox,oy,oz] of positions){
  let sum=0;
  for(let x=ox*20;x<(ox+1)*20;x++)for(let y=oy*10;y<(oy+1)*10;y++)
   for(let z=oz*8;z<(oz+1)*8;z++)for(let l=0;l<16;l++)
    sum+=((x%8)*3+(y%8)*5+(z%8)*7+(l%8)*11)%201/16;
  const reference=sum/25600,actual=workspace[(ox*32+oy)*8+oz];
  const error=Math.abs(actual-reference);maxAbsError=Math.max(maxAbsError,error);
  if(error>1e-11)throw Error('G44_LOCALITY_VOXEL_ORACLE_FAILED');
 }
 const weights=new Float64Array(512*6);
 for(let q=0;q<512;q++)for(let f=0;f<6;f++)
  weights[q*6+f]=q%8===f?1/64:0;
 const projection=projectTensorToFormulaShadow({
  tensor:workspace,shape:[16,64,8],weights,bias:new Float64Array(96),
  sourceId:'g44-original-archived-synthetic-stream',
  calibrationId:'g44-unapproved-candidate-mapping',
  featureNames:['SpatialX','SpatialY','SpatialZ','LocalGeometry','GeodesicState','FeatureMean'],
  featureUnits:Array(6).fill('synthetic_abstract_units'),
  tileSize:32
 });
 const evaluated=evaluateG41SpatialProjectionShadow(projection,{
  ranges:Array.from({length:6},()=>[-500,500]),
  semanticMappingId:'G44_NOT_APPROVED_MACRO_SPATIAL_FORMULA'
 });
 if(evaluated.formulaId!=='LEEWAY-FORMULA-v1.0'||
   evaluated.formulaExecutionState!=='ACTUAL_V1_EXECUTED_IN_SHADOW'||
   evaluated.productionAccepted!==false)
  throw Error('G44_ORIGINAL_FORMULA_SHADOW_MISMATCH');
 const durationMs=performance.now()-started;
 const objectDir=path.join(archiveDir,'objects');
 const exactBlobBytes=fs.readdirSync(objectDir).reduce((s,f)=>s+fs.statSync(path.join(objectDir,f)).size,0);
 const localJournalBytes=fs.statSync(path.join(archiveDir,'tile-ledger.jsonl')).size;
 console.log(JSON.stringify({
  schema:'leeway.formula.experimental-v2.g44.integrated-800m-shadow-proof.v1',
  sourceShape:shape,sourceLogicalBytes:Number(archived.report.sourceBytes),
  sourceTileCount:archived.report.tileCount,
  distinctSourceTileHashes:archived.report.distinctSourceTileHashes,
  sourceHash:archived.report.logicalSourceSha256,
  originalArchiveReadbackPassed:replay.passed,
  originalArchiveSourceDigestMatched:replay.sourceHashMatches,
  originalArchiveLocalHashChainMatched:replay.localLedgerChainMatches,
  originalArchivedObjectBytes:exactBlobBytes,
  originalUnsignedLocalJournalBytes:localJournalBytes,
  localityShape:locality.outputShape,
  localitySourceElements:locality.sourceElements,
  localitySamplesPerOutputVoxel:locality.sourceSamplesPerOutputVoxel,
  localityWorkspaceSha256:locality.reducedWorkspaceSha256,
  independentVoxelReferencesChecked:positions.length,maxAbsoluteError:maxAbsError,
  originalFormulaId:evaluated.formulaId,
  originalFormulaShadowExecuted:true,
  formulaMappedPolicyApproved:false,
  ingestArchiveAndLocalityMs:ingestMs,
  totalArchiveLocalityReplayFormulaMs:durationMs,
  peakSampledProcessRssBytes:archived.report.memory.observedPeakProcessRssBytes,
  source:'SYNTHETIC_EIGHT_REPEATED_MATH_TILES',
  independentProtectedVeritasPrePost:false,
  canonicalContinuumReceiptLearningAdmitted:false,
  productionAccepted:false
 },null,2));
}finally{fs.rmSync(archiveDir,{recursive:true,force:true});}
