/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CONTINUUM.SQLITE.TEST
TAG: LEEWAY.SQLITE_COMPRESSED_OBJECT_CANDIDATE_TEST
WHAT: Isolated real SQLite transaction/reopen and corruption checks.
WHO: LeeWay Industries. WHEN: 2026-10-25. WHERE: Formula tests.
WHY: Prove candidate persistence without touching live Continuum.
HOW: temporary DB; store/reopen/legacy table and tamper rejection.
AUTHORITY: TEST_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {createIsolatedSqliteObjectStore} from '../continuum-sqlite-object-transport.mjs';
import {stageExactObject,recoverExactObject} from '../continuum-exact-store-boundary.mjs';
const sha256=async b=>createHash('sha256').update(b).digest('hex');
test('real SQLite committed object survives restart with exact readback',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'leeway-standalone-codec-')),p=join(dir,'isolated.sqlite');
 try{
  let store=createIsolatedSqliteObjectStore({databasePath:p});
  const input=new Uint8Array(524303).fill(47);
  const r=await stageExactObject(input,{store,sha256,ownerScope:'lee:test'});
  assert.equal(r.verifiedReadback,true);
  store.close();store=createIsolatedSqliteObjectStore({databasePath:p});
  assert.deepEqual(await recoverExactObject({store,identity:r.identity,ownerScope:'lee:test',sha256,maxOutputBytes:input.length}),input);
  assert.equal((await store.putIfAbsent({identity:r.identity,ownerScope:'lee:test',object:await store.get({identity:r.identity,ownerScope:'lee:test'})})).deduplicated,true);
  store.close();
 }finally{rmSync(dir,{recursive:true,force:true})}
});
test('legacy raw table is unchanged; tampered persisted bytes fail closed',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'leeway-legacy-test-')),p=join(dir,'isolated.sqlite');
 try{
  const legacy=new DatabaseSync(p);legacy.exec('CREATE TABLE continuum_blobs(content_sha256 TEXT,byte_length INTEGER);INSERT INTO continuum_blobs VALUES(\'prior-raw-record\',123);');legacy.close();
  const store=createIsolatedSqliteObjectStore({databasePath:p});
  const r=await stageExactObject(Uint8Array.from([1,2,3,4]),{store,sha256,ownerScope:'lee:test'});store.close();
  const db=new DatabaseSync(p);
  assert.equal(db.prepare('SELECT byte_length FROM continuum_blobs WHERE content_sha256=?').get('prior-raw-record').byte_length,123);
  db.prepare('UPDATE leeway_compressed_parts SET payload=? WHERE identity=? AND part_index=0').run(Buffer.from([9,2,3,4]),r.identity);db.close();
  const again=createIsolatedSqliteObjectStore({databasePath:p});
  await assert.rejects(recoverExactObject({store:again,identity:r.identity,ownerScope:'lee:test',sha256,maxOutputBytes:4}),/LEEWAY_PART_PAYLOAD_CORRUPT/);
  again.close();
 }finally{rmSync(dir,{recursive:true,force:true})}
});
