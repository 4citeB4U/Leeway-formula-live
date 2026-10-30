/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CONTINUUM.ADAPTER.TEST
TAG: LEEWAY.CONTINUUM.AUTHORIZED_ARCHIVE.TEST
WHAT: Governed service API interoperability tests. WHO: LeeWay Industries.
WHY: Preserve admission boundary, exact source, no legacy alteration.
WHEN: 2026-10-25. WHERE: Formula experimental tests.
HOW: isolated service API fixture and verified reconstruction.
AUTHORITY: TEST_ONLY. LICENSE: Existing LeeWay Formula terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {brotliCompressSync,brotliDecompressSync} from 'node:zlib';
import {ingestCompressedContinuumFile,readCompressedContinuumFile} from '../continuum-authorized-archive.mjs';
const sha256=async x=>createHash('sha256').update(x).digest('hex');
const compress=async x=>new Uint8Array(brotliCompressSync(x));
const decompress=async(x,n)=>new Uint8Array(brotliDecompressSync(x,{maxOutputLength:n}));
const service=()=>{
 const records=new Map();let count=0;
 return {records,async ingestFile(i,c){
  if(!c?.capabilities?.includes('continuum.write'))throw Error('CONTINUUM_CAPABILITY_DENIED');
  const recordId='test-'+(++count),bytes=new Uint8Array(i.bytes);
  records.set(recordId,{bytes,record:{recordId,contentSha256:await sha256(bytes),mimeType:i.mimeType,receiptId:'fixture-only'}});
  return {recordId};
 },getContent(id,c){
  if(!c?.capabilities?.includes('continuum.read'))throw Error('CONTINUUM_CAPABILITY_DENIED');
  const item=records.get(id);if(!item)throw Error('NOT_FOUND');
  return structuredClone(item);
 }};
};
test('governed API preserves exact original after archive roundtrip',async()=>{
 const api=service(),context={capabilities:['continuum.write','continuum.read']};
 const original=new Uint8Array(300000).fill(21);
 const r=await ingestCompressedContinuumFile({service:api,input:{bytes:original,universeId:'test',collection:'archive',title:'example',source:{kind:'test',id:'123'}},context,sha256,compress,decompress});
 assert.equal(r.verifiedReadback,true);assert.ok(r.storedBytes<r.sourceBytes);
 assert.deepEqual(await readCompressedContinuumFile({service:api,recordId:r.recordId,context,sha256,decompress}),original);
});
test('missing real write capability stays denied',async()=>{
 const api=service();
 await assert.rejects(ingestCompressedContinuumFile({service:api,input:{bytes:Uint8Array.from([1]),source:{kind:'test',id:'t'}},context:{capabilities:['continuum.read']},sha256}),/CONTINUUM_CAPABILITY_DENIED/);
 assert.equal(api.records.size,0);
});

test('owner retention fields pass unchanged to canonical service',async()=>{
 const records=new Map();const owner='body-test';
 const app={
  async ingestFile(input,context){
   if(input.requestId!=='req-100'||input.viewId!=='knowledge'||input.source?.bodyId!==owner)throw Error('OWNER_PREFLIGHT_REQUIRED');
   if(context.bodyId!==owner||!context.capabilities.includes('continuum.write'))throw Error('OWNER_SCOPE_DENIED');
   const recordId='owner-committed-1',bytes=new Uint8Array(input.bytes);
   records.set(recordId,{record:{recordId,contentSha256:await sha256(bytes),receiptId:'owner-receipt-1',mimeType:input.mimeType},bytes});
   return {recordId};
  },
  getContent(id,context){
   if(context.bodyId!==owner||!context.capabilities.includes('continuum.read'))throw Error('OWNER_READ_SCOPE_DENIED');
   return structuredClone(records.get(id));
  }
 };
 const context={ownerId:owner,bodyId:owner,capabilities:['continuum.write','continuum.read']};
 const input={bytes:new Uint8Array(270000).fill(11),requestId:'req-100',viewId:'knowledge',
  source:{kind:'file',id:'fixture',bodyId:owner}};
 const result=await ingestCompressedContinuumFile({service:app,input,context,sha256,compress,decompress});
 assert.equal(result.receiptId,'owner-receipt-1');
 assert.deepEqual(await readCompressedContinuumFile({service:app,recordId:result.recordId,context,sha256,decompress,maxOutputBytes:input.bytes.length}),input.bytes);
 assert.equal(records.size,1);
 await assert.rejects(ingestCompressedContinuumFile({service:app,input:{...input,requestId:undefined},context,sha256,compress,decompress}),/OWNER_PREFLIGHT_REQUIRED/);
});
