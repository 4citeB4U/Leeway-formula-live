/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.PORTABLE.STORAGE.TEST
TAG: LEEWAY.EXACT_CONTENT_PART.PORTABILITY
WHO: LeeWay Industries; WHAT: cross-runtime and adapter interchange tests;
WHY: validate canonical bytes independently of device and codec adapter;
WHERE: Formula tests; WHEN: 2026-10-24;
HOW: WebCrypto+Node codec adapters, tamper and mutation rejection.
AUTHORITY: TEST_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash,randomBytes} from 'node:crypto';
import {brotliCompressSync,brotliDecompressSync} from 'node:zlib';
import {encodePortableExactPart,decodePortableExactPart} from '../portable-exact-content-part.mjs';
import {encodeExactContentPart,decodeExactContentPart} from '../exact-content-part.mjs';
const sha=async b=>createHash('sha256').update(b).digest('hex');
const websha=async b=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b))).map(x=>x.toString(16).padStart(2,'0')).join('');
const compress=async b=>new Uint8Array(brotliCompressSync(b));
const decompress=async (b,max)=>new Uint8Array(brotliDecompressSync(b,{maxOutputLength:max}));
for(const data of [Buffer.alloc(262144,7),randomBytes(262144),Buffer.from('portable LeeWay')]){
 test('node encodes, webcrypto verifies '+data.length,async()=>{
  const record=encodeExactContentPart(data);
  assert.deepEqual(Buffer.from(await decodePortableExactPart(record,{sha256:websha,decompress})),data);
 });
 test('portable encodes, Node verifies '+data.length,async()=>{
  const record=await encodePortableExactPart(data,{sha256:sha,compress});
  assert.deepEqual(decodeExactContentPart({...record,payload:Buffer.from(record.payload)}),data);
 });
}
test('fails closed without codec when Brotli needed',async()=>{
 const x=await encodePortableExactPart(Buffer.alloc(10000,3),{sha256:sha,compress});
 await assert.rejects(decodePortableExactPart(x,{sha256:sha}),/LEEWAY_DECOMPRESS_PROVIDER_UNBOUND/);
});
test('caller mutation does not corrupt stored payload',async()=>{
 const input=Uint8Array.from([1,2,3,4]);
 const x=await encodePortableExactPart(input,{sha256:sha});
 input[0]=99;
 assert.deepEqual(await decodePortableExactPart(x,{sha256:sha}),Uint8Array.from([1,2,3,4]));
});
test('tamper detected across runtimes',async()=>{
 const x=await encodePortableExactPart(Uint8Array.from([1,2,3]),{sha256:sha});
 x.payload[1]=8;
 await assert.rejects(decodePortableExactPart(x,{sha256:websha}),/LEEWAY_PART_PAYLOAD_CORRUPT/);
});
