/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G43.MACRO_STREAM_TEST
TAG: LEEWAY.G43.EXACT_ARCHIVE_LAYERED_REDUCTION_AND_FORMULA_PROVENANCE
5WH:
WHAT = Test bounded hierarchical tensor ingestion, exact saved blobs, correct reduction and unchanged Golden Formula.
WHY = High-dimensional compression ratios must be checked against real retained content, not hash-only assertions.
WHO = Creator-authorized LeeWay math engineering; no independent production certificate.
WHERE = Formula experimental-v2/tests/g43-hierarchical-macro-stream.test.mjs
WHEN = 2026-10-22
HOW = Small canonical 4D tile streams, explicit numeric oracles, corrupted ledger/blob failures and shadow policy assertions.
LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {ingestHierarchicalMacroTensor,verifyHierarchicalMacroArchive,
 createG43SyntheticTileStream} from '../hierarchical-macro-stream.mjs';
import {evaluateG43MacroMathShadow} from '../macro-formula-shadow.mjs';
const fresh=t=>{const p=fs.mkdtempSync(path.join(os.tmpdir(),'leeway-g43-'));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p};
const mean4=(data,x,y,c)=>{
 const a=(x*64+y)*8+c,b=((x+32)*64+y)*8+c;
 return (data[a]+data[a+32*8]+data[b]+data[b+32*8])/4;
};
test('G43 64x64x8x2 exact storage, archive replay and arithmetic mean match independent oracle',async t=>{
 const shape=[64,64,8,2],archiveDir=fresh(t);
 const generator=createG43SyntheticTileStream(shape);
 const {report,workspace}=ingestHierarchicalMacroTensor({shape,tiles:generator,archiveDir});
 assert.equal(report.tileCount,2);
 assert.equal(report.distinctSourceTileHashes,1);
 assert.equal(report.tilesWithComputationalReuse,1);
 assert.equal(report.sourceBytes,String(2*64*64*8*4));
 assert.equal(report.intermediateElements,8192);
 const tile=createG43SyntheticTileStream(shape).next().value.data;
 for(const [x,y,c] of [[0,0,0],[3,17,4],[31,31,7]])
  assert.equal(workspace[(x*32+y)*8+c],mean4(tile,x,y,c));
 const restored=await verifyHierarchicalMacroArchive(archiveDir);
 assert.equal(restored.independentCanonicalSourceReadbackVerified,true);
 assert.equal(restored.localLedgerChainMatches,true);
 assert.equal(restored.protectedImmutableLedgerProven,false);
 assert.equal(report.trust.productionAccepted,false);
});
test('G43 128x64x16x2 streams 8 tiles with 2 exact content identities',async t=>{
 const shape=[128,64,16,2],archiveDir=fresh(t);
 const {report,workspace}=ingestHierarchicalMacroTensor({
  shape,tiles:createG43SyntheticTileStream(shape,{diversity:2}),archiveDir
 });
 assert.equal(report.tileCount,8);
 assert.equal(report.distinctSourceTileHashes,2);
 assert.equal(report.tilesWithComputationalReuse,6);
 const variants=[...createG43SyntheticTileStream(shape,{diversity:2})];
 const expected=Array.from({length:8192},(_,index)=>{
  const xy=Math.floor(index/8),x=Math.floor(xy/32),y=xy%32,c=index%8;
  return variants.reduce((s,v)=>s+mean4(v.data,x,y,c),0)/variants.length;
 });
 for(const i of [0,3,4512,8191])assert.equal(workspace[i],expected[i]);
 assert.equal((await verifyHierarchicalMacroArchive(archiveDir)).sourceHashMatches,true);
});
test('G43 full reduction workspace can feed actual original Formula v1 under unapproved mapping',t=>{
 const shape=[64,64,8,2],archiveDir=fresh(t);
 const checkpoint=ingestHierarchicalMacroTensor({shape,archiveDir,
  tiles:createG43SyntheticTileStream(shape)});
 const weights=new Float64Array(512*6);
 for(let q=0;q<512;q++)for(let f=0;f<6;f++)
  weights[q*6+f]=(q%8===f)?1/64:0;
 const bias=new Float64Array(96);
 const result=evaluateG43MacroMathShadow(checkpoint,checkpoint.workspace,{
  weights,bias,
  ranges:Array.from({length:6},()=>[-100,100]),
  semanticMappingId:'G43_UNAPPROVED_TEST_ONLY'
 });
 assert.deepEqual(result.intermediateShape,[32,32,8]);
 assert.deepEqual(result.projectionReshapeShape,[16,64,8]);
 assert.deepEqual(result.actualProjectionWeightShape,[512,6]);
 assert.equal(result.actualOriginalFormulaShadow.formulaId,'LEEWAY-FORMULA-v1.0');
 assert.equal(result.actualOriginalFormulaShadow.formulaExecutionState,'ACTUAL_V1_EXECUTED_IN_SHADOW');
 assert.equal(result.productionAccepted,false);
 assert.equal(result.originalProtectedReceiptAndLearningLedgerAdmitted,false);
});
test('G43 rejects missing/misordered chunk, mutable false manifest and unapproved shape',t=>{
 const shape=[64,64,8,1];
 assert.throws(()=>ingestHierarchicalMacroTensor({shape:[63,64,8,1],
  archiveDir:fresh(t),tiles:[]}),/SHAPE_NOT_ALIGNED/);
 assert.throws(()=>ingestHierarchicalMacroTensor({shape,
  archiveDir:fresh(t),tiles:[]}),/MISSING_CANONICAL_TILE/);
 function* wrong(){yield {coord:[0,1,0,0],data:new Float32Array(64*64*8)}}
 assert.throws(()=>ingestHierarchicalMacroTensor({shape,
  archiveDir:fresh(t),tiles:wrong()}),/NONCANONICAL/);
 assert.throws(()=>ingestHierarchicalMacroTensor({shape,
  archiveDir:fresh(t),tiles:createG43SyntheticTileStream(shape),
  maxTileCount:0}),/TILE_COUNT_EXCEEDS/);
});
test('G43 detects changed local ledger chain and changed exact archived blob',async t=>{
 const shape=[64,64,8,2],dir=fresh(t);
 const {report}=ingestHierarchicalMacroTensor({shape,archiveDir:dir,
  tiles:createG43SyntheticTileStream(shape)});
 const ledger=path.join(dir,'tile-ledger.jsonl'),original=fs.readFileSync(ledger,'utf8');
 const tampered=original.replace('"seq":0','"seq":44');
 fs.writeFileSync(ledger,tampered);
 await assert.rejects(verifyHierarchicalMacroArchive(dir),/LEDGER_CHAIN_OR_TILE_ORDER/);
 fs.writeFileSync(ledger,original);
 const objDir=path.join(dir,'objects');
 const blob=path.join(objDir,fs.readdirSync(objDir).find(x=>x.endsWith('.bin')));
 const source=fs.readFileSync(blob),bad=Buffer.from(source);bad[0]^=0x40;
 fs.writeFileSync(blob,bad);
 await assert.rejects(verifyHierarchicalMacroArchive(dir),/PAYLOAD_HASH_MISMATCH/);
});
test('G43 discloses that hash alone is NOT independent immutable protected Receipt Ledger',t=>{
 const shape=[64,64,8,1],archiveDir=fresh(t);
 const {report}=ingestHierarchicalMacroTensor({shape,archiveDir,tiles:createG43SyntheticTileStream(shape)});
 assert.equal(report.trust.writtenLedgerKind,'UNSIGNED_LOCAL_EXPERIMENTAL_HASH_CHAIN');
 assert.equal(report.trust.canonicalReceiptLedgerAdmitted,false);
 assert.equal(report.trust.canonicalLearningLedgerAdmitted,false);
 assert.equal(report.trust.externalVeritasPrePostSigned,false);
 assert.equal(report.memory.fullMonolithicTensorAllocated,false);
});

test('G43 requested 640x320x64x16 workload has 6400 logical bounded tiles without materializing macro source',()=>{
 const shape=[640,320,64,16];
 const count=shape[0]/64*shape[1]/64*shape[2]/8*shape[3];
 const elements=BigInt(shape[0])*BigInt(shape[1])*BigInt(shape[2])*BigInt(shape[3]);
 assert.equal(count,6400);
 assert.equal(elements,209715200n);
 assert.equal(elements*4n,838860800n);
 assert.equal(Number(elements/8192n),25600);
 const generator=createG43SyntheticTileStream(shape,{diversity:8});
 const first=generator.next().value;
 assert.deepEqual(first.coord,[0,0,0,0]);
 assert.equal(first.data.byteLength,131072);
 assert.equal(first.data.length,32768);
 // This exercises shape, generator and first bounded tile only;
 // it must NOT be presented as full-scale execution.
});
