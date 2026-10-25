/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CONTINUUM.INTEGRATION.TEST
TAG: LEEWAY.CONTINUUM.REAL_SERVICE.ISOLATED
WHAT: Verify the original Continuum service is the sole application storage read/write API.
WHO: LeeWay Industries. WHY: Ensure app retrieval is through Continuum, not database tables.
WHERE: isolated disposable SQLite fixture. WHEN: 2026-10-25.
HOW: import owner service only when explicitly located; TEST_ONLY grant, restart, receipt, byte replay.
AUTHORITY: TEST_ONLY; never production. LICENSE: Existing LeeWay Formula terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {brotliCompressSync,brotliDecompressSync} from 'node:zlib';
import {ingestCompressedContinuumFile,readCompressedContinuumFile} from '../continuum-authorized-archive.mjs';
const sha256=async x=>createHash('sha256').update(x).digest('hex');
const compress=async x=>new Uint8Array(brotliCompressSync(x));
const decompress=async(x,n)=>new Uint8Array(brotliDecompressSync(x,{maxOutputLength:n}));
test('original Continuum service: admitted archive, restart, read and receipt',async t=>{
 const servicePath=process.env.LEEWAY_CONTINUUM_SERVICE_MODULE;
 if(!servicePath){t.skip('Explicit original Continuum service module path required');return}
 const {createContinuumService}=await import(pathToFileURL(servicePath).href);
 const dir=mkdtempSync(join(tmpdir(),'leeway-real-continuum-')),databasePath=join(dir,'isolated.sqlite');
 const binding={databasePath,ownerId:'test-owner',bodyId:'test-device'};
 const context={ownerId:'test-owner',bodyId:'test-device',actorId:'test-worker',capabilities:['continuum.initialize','continuum.write','continuum.read']};
 const gate=async request=>({state:'ADMITTED',scope:'TEST_ONLY',requestHash:request.requestHash,
  ownerId:request.ownerId,bodyId:request.bodyId,capability:request.capability});
 const make=()=>createContinuumService({binding,allowTestOnlyGate:true,governancePreGate:gate});
 try{
  const first=make();
  const initialized=await first.initialize(context);
  assert.equal(initialized.state,'INITIALIZED');
  const input=new Uint8Array(312000).fill(67);
  const result=await ingestCompressedContinuumFile({service:first,input:{
    bytes:input,universeId:'test-universe',collection:'documents',title:'recovered bytes',
    source:{kind:'test',id:'isolated-fixture'}},context,sha256,compress,decompress});
  assert.equal(result.verifiedReadback,true);
  const receipt=first.getReceipt(result.receiptId,context);
  assert.equal(receipt.scope,'TEST_ONLY');
  const second=make();
  const restored=await readCompressedContinuumFile({service:second,recordId:result.recordId,context,sha256,decompress,maxOutputBytes:input.length});
  assert.deepEqual(restored,input);
  const record=second.inspect(result.recordId,context);
  assert.equal(record.recordId,result.recordId);
  assert.equal(record.verification.governanceScope,'TEST_ONLY');
  await assert.rejects(second.ingestFile({bytes:new Uint8Array([1]),universeId:'test-universe',collection:'documents',title:'denied',mimeType:'application/octet-stream',source:{kind:'test',id:'blocked'}},
    {...context,capabilities:['continuum.read']}),/CONTINUUM_CAPABILITY_DENIED/);
 }finally{rmSync(dir,{recursive:true,force:true})}
});

test('application-facing durable Continuum adapter routes compressed archive through canonical service',async t=>{
 const modulePath=process.env.LEEWAY_CONTINUUM_SERVICE_MODULE;
 const adapterPath=process.env.LEEWAY_CONTINUUM_DURABLE_ADAPTER_MODULE;
 if(!modulePath||!adapterPath){t.skip('Explicit canonical modules required');return}
 const {createContinuumService}=await import(pathToFileURL(modulePath).href);
 const {createDurableContinuumProvider}=await import(pathToFileURL(adapterPath).href);
 const dir=mkdtempSync(join(tmpdir(),'leeway-continuum-public-adapter-')),databasePath=join(dir,'isolated.sqlite');
 const binding={databasePath,ownerId:'test-owner',bodyId:'test-device'};
 const context={ownerId:'test-owner',bodyId:'test-device',actorId:'test-worker',capabilities:['continuum.initialize','continuum.write','continuum.read']};
 const gate=async request=>({state:'ADMITTED',scope:'TEST_ONLY',requestHash:request.requestHash,
  ownerId:request.ownerId,bodyId:request.bodyId,capability:request.capability});
 const make=()=>createDurableContinuumProvider({service:createContinuumService({
  binding,allowTestOnlyGate:true,governancePreGate:gate}),views:[{id:'knowledge',universeId:'test-universe'}]});
 try{
  const app=make();
  await app.initialize(context);
  const original=new Uint8Array(270000).fill(83);
  const stored=await ingestCompressedContinuumFile({service:app,input:{
    bytes:original,viewId:'knowledge',collection:'knowledge',title:'canonical app route',
    source:{kind:'test',id:'public-adapter'}},context,sha256,compress,decompress});
  assert.equal(stored.verifiedReadback,true);
  const resumed=make();
  assert.deepEqual(await readCompressedContinuumFile({service:resumed,recordId:stored.recordId,context,sha256,decompress,maxOutputBytes:original.length}),original);
  const list=resumed.list({viewId:'knowledge'},context);
  assert.equal(list.records.length,1);
  assert.equal(list.records[0].viewId,'knowledge');
  assert.equal(resumed.getReceipt(stored.receiptId,context).scope,'TEST_ONLY');
  await assert.rejects(resumed.ingestFile({
    bytes:new Uint8Array([1]),viewId:'not-mapped',collection:'knowledge',title:'deny',mimeType:'application/octet-stream',source:{kind:'test',id:'deny'}},context),/CONTINUUM_VIEW_PROVIDER_UNBOUND/);
 }finally{rmSync(dir,{recursive:true,force:true})}
});
