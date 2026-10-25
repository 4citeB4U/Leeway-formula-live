/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.CONTINUUM.DEVICE_RECOVERY.TEST
TAG: LEEWAY.DEVICE_BRAIN_NOT_TRANSFERABLE.V1
WHAT: Test device-specific diagnostics, shared logical owner retention and replacement-brain recovery.
WHY: New devices must not inherit old physical identity or live diagnostic authority.
WHO: LeeWay Industries. WHERE: isolated Continuum tests. WHEN: 2026-10-25.
HOW: real Continuum service, separate simulated devices, hash-verified recovery and wrong-scope refusal.
AUTHORITY: TEST_ONLY; no production credentials or DB writes. LICENSE: repository terms.
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
const hash=b=>createHash('sha256').update(b).digest('hex');
const encoder=new TextEncoder(),decoder=new TextDecoder();
const servicePath=process.env.LEEWAY_CONTINUUM_SERVICE_MODULE;
for(const round of [1,2,3]){
 test('replacement device and owner isolation qualification round '+round,async t=>{
  if(!servicePath){t.skip('Explicit original Continuum service required');return}
  const {createContinuumService}=await import(pathToFileURL(servicePath).href);
  const dir=mkdtempSync(join(tmpdir(),'leeway-device-recovery-'));
  const owner='owner-'+round,other='unrelated-'+round;
  const ctx=id=>({ownerId:id,bodyId:id,capabilities:['continuum.initialize','continuum.write','continuum.read']});
  const gate=async req=>({state:'ADMITTED',scope:'TEST_ONLY',requestHash:req.requestHash,ownerId:req.ownerId,bodyId:req.bodyId,capability:req.capability});
  const make=id=>createContinuumService({binding:{databasePath:join(dir,id+'.db'),ownerId:id,bodyId:id},allowTestOnlyGate:true,governancePreGate:gate});
  try{
   const initial=make(owner),intruder=make(other);
   await initial.initialize(ctx(owner));await intruder.initialize(ctx(other));
   const laptop={deviceId:'laptop-'+round,hardware:{type:'PC',ramGiB:32},current:true};
   const phone={deviceId:'fold6-'+round,hardware:{type:'Fold6',ramGiB:12},current:true};
   const original=encoder.encode(JSON.stringify({schema:'leeway.brain.observation.v1',ownerId:owner,logicalMemory:'Continuum keeps owner facts',history:[
    {deviceId:laptop.deviceId,hardware:laptop.hardware,observedAt:'2026-10-01T00:00:00Z'},
    {deviceId:phone.deviceId,hardware:phone.hardware,observedAt:'2026-10-02T00:00:00Z'}]}));
   const stored=await ingestCompressedContinuumFile({service:initial,input:{bytes:original,
    universeId:'owner-history',collection:'brain-history',title:'historical device evidence',mimeType:'application/json',
    source:{kind:'digital-brain-history',id:'fixture-'+round}},context:ctx(owner),sha256});
   const isolated=make(owner);const retrieved=await readCompressedContinuumFile({service:isolated,recordId:stored.recordId,context:ctx(owner),sha256});
   assert.equal(hash(retrieved),hash(original));assert.deepEqual(retrieved,original);
   const newDevice={deviceId:'replacement-'+round,hardware:{type:'NewPhone',ramGiB:16},current:true};
   const history=JSON.parse(decoder.decode(retrieved));
   assert.notEqual(newDevice.deviceId,phone.deviceId);
   assert.equal(history.history.some(x=>x.deviceId===phone.deviceId),true);
   assert.equal(history.history.some(x=>x.deviceId===newDevice.deviceId),false);
   assert.equal(newDevice.hardware.type,'NewPhone'); // live readings originate from replacement, not archival record
   assert.throws(()=>isolated.getContent(stored.recordId,ctx(other)),/CONTINUUM_CALLER_SCOPE_MISMATCH/);
   assert.throws(()=>intruder.getContent(stored.recordId,ctx(other)),/CONTINUUM_RECORD_NOT_FOUND/);
   assert.equal(isolated.getReceipt(stored.receiptId,ctx(owner)).scope,'TEST_ONLY');
  }finally{rmSync(dir,{recursive:true,force:true})}
 });
}
