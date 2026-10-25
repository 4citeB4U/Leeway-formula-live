/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.STORAGE.TEST
TAG: LEEWAY.EXACT_PART.CANDIDATE_TEST
WHO: LeeWay Industries; WHAT: independent byte-exact codec tests;
WHY: prevent lossy/damaged data from entering durable storage;
WHERE: Formula experimental-v2 tests; WHEN: 2026-10-24;
HOW: deterministic data + hash + tamper and bounded decompression checks.
AUTHORITY: TEST_ONLY. LICENSE: Existing LeeWay Formula terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {encodeExactContentPart,decodeExactContentPart} from '../exact-content-part.mjs';
for(const source of [Buffer.alloc(256*1024,65),randomBytes(256*1024),Buffer.from('LeeWay Continuum exact reconstruction')]){
 test('exact part roundtrip '+source.length,()=>{
  const record=encodeExactContentPart(source);
  assert.deepEqual(decodeExactContentPart(record),source);
  assert.equal(record.manifest.originalBytes,source.length);
  assert.ok(record.manifest.storedBytes<=source.length);
 });
}
test('compression chosen only when smaller',()=>{
 const record=encodeExactContentPart(Buffer.alloc(100000,7));
 assert.equal(record.manifest.codec,'BROTLI');
 assert.ok(record.payload.length<record.manifest.originalBytes);
});
test('tampered content rejected',()=>{
 const record=encodeExactContentPart(Buffer.alloc(2000,3));
 const payload=Buffer.from(record.payload);payload[0]^=1;
 assert.throws(()=>decodeExactContentPart({...record,payload}),/LEEWAY_PART_PAYLOAD_CORRUPT/);
});
test('forged original digest rejected',()=>{
 const record=encodeExactContentPart(Buffer.from('source bytes'));
 assert.throws(()=>decodeExactContentPart({manifest:{...record.manifest,originalSha256:'0'.repeat(64)},payload:record.payload}),/LEEWAY_PART_RECONSTRUCTION_FAILED/);
});
test('oversize input rejected',()=>{
 assert.throws(()=>encodeExactContentPart(Buffer.alloc(256*1024+1)),/LEEWAY_PART_SIZE_INVALID/);
});
