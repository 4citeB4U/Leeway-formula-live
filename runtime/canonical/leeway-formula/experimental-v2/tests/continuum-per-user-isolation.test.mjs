/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.CONTINUUM.PER_USER.QUALIFICATION
TAG: LEEWAY.PER_PERSON.CONTINUUM.ISOLATION_V1
WHAT: Isolated original-service per-person Digital Brain persistence and recovery proof.
WHY: Every Agent Lee receives separate owner records, receipts and database resources.
WHO: LeeWay Industries. WHERE: Formula acceptance tests.
WHEN: 2026-10-25. HOW: two independently scoped Continuum services, restarts, cross-access rejection.
AUTHORITY: TEST_ONLY; NOT production approval. LICENSE: Existing repository terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {ingestCompressedContinuumFile,readCompressedContinuumFile} from '../continuum-authorized-archive.mjs';
const sha256=async b=>createHash('sha256').update(b).digest('hex');
test('two independent Agent Lee owners remain isolated across restart',async t=>{
 const modulePath=process.env.LEEWAY_CONTINUUM_SERVICE_MODULE;
 if(!modulePath){t.skip('An explicit existing Continuum service module is required');return}
 const {createContinuumService}=await import(pathToFileURL(modulePath).href);
 const temp=mkdtempSync(join(tmpdir(),'leeway-two-owner-'));
 const make=(id)=>createContinuumService({
  binding:{databasePath:join(temp,id+'.sqlite'),ownerId:id,bodyId:id},
  allowTestOnlyGate:true,
  governancePreGate:async req=>({state:'ADMITTED',scope:'TEST_ONLY',requestHash:req.requestHash,
   ownerId:req.ownerId,bodyId:req.bodyId,capability:req.capability})
 });
 const context=id=>({ownerId:id,bodyId:id,capabilities:['continuum.initialize','continuum.write','continuum.read']});
 try{
  const a=make('owner-alpha'),b=make('owner-beta');
  await a.initialize(context('owner-alpha'));await b.initialize(context('owner-beta'));
  const input=new TextEncoder().encode('Digital Brain saved state: exact reconstruction fixture');
  const save=async(service,id)=>ingestCompressedContinuumFile({service,input:{
   bytes:input,universeId:'digital-brain',collection:'memory',title:'state',source:{kind:'digital-brain',id:'fixture-'+id}},
   context:context(id),sha256});
  const ra=await save(a,'owner-alpha'),rb=await save(b,'owner-beta');
  assert.equal(a.counts(context('owner-alpha')).records,1);
  assert.equal(b.counts(context('owner-beta')).records,1);
  const restartedA=make('owner-alpha'),restartedB=make('owner-beta');
  assert.deepEqual(await readCompressedContinuumFile({service:restartedA,recordId:ra.recordId,context:context('owner-alpha'),sha256}),input);
  assert.deepEqual(await readCompressedContinuumFile({service:restartedB,recordId:rb.recordId,context:context('owner-beta'),sha256}),input);
  assert.throws(()=>restartedA.getContent(ra.recordId,context('owner-beta')),/CONTINUUM_CALLER_SCOPE_MISMATCH/);
  assert.throws(()=>restartedB.getContent(rb.recordId,context('owner-alpha')),/CONTINUUM_CALLER_SCOPE_MISMATCH/);
  assert.equal(restartedA.getReceipt(ra.receiptId,context('owner-alpha')).scope,'TEST_ONLY');
  assert.equal(restartedB.getReceipt(rb.receiptId,context('owner-beta')).scope,'TEST_ONLY');
 }finally{rmSync(temp,{recursive:true,force:true})}
});
