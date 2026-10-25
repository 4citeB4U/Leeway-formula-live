/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.PORTABLE.STORAGE.TEST
TAG: LEEWAY.UNIVERSAL_OBJECT_CODEC.V1.TEST
WHAT: Exact cross-provider binary object proof. WHO: LeeWay Industries.
WHY: Detect platform drift, truncation, wrong order and corrupted content.
WHERE: Formula experimental tests. WHEN: 2026-10-24.
HOW: SHA-256 WebCrypto/Node, Brotli option, multiple chunks.
AUTHORITY: TEST_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash,randomBytes} from 'node:crypto';
import {brotliCompressSync,brotliDecompressSync} from 'node:zlib';
import {encodeUniversalObject,decodeUniversalObject,webCryptoSha256} from '../universal-object-codec.mjs';
const sha=async x=>createHash('sha256').update(x).digest('hex');
const compress=async x=>new Uint8Array(brotliCompressSync(x));
const decompress=async(x,n)=>new Uint8Array(brotliDecompressSync(x,{maxOutputLength:n}));
for(const data of [new Uint8Array(),new Uint8Array(262144*2+29).fill(5),randomBytes(262144+3)]){
 test('cross-runtime exact object '+data.length,async()=>{
  const encoded=await encodeUniversalObject(data,{sha256:sha,compress});
  assert.deepEqual(await decodeUniversalObject(encoded,{sha256:webCryptoSha256,decompress}),new Uint8Array(data));
  const cross=await encodeUniversalObject(data,{sha256:webCryptoSha256,compress});
  assert.deepEqual(await decodeUniversalObject(cross,{sha256:sha,decompress}),new Uint8Array(data));
  assert.deepEqual(encoded.manifest,cross.manifest);
 });
}
test('reordered objects fail',async()=>{
 const e=await encodeUniversalObject(randomBytes(262145),{sha256:sha});
 e.parts.reverse();
 await assert.rejects(decodeUniversalObject(e,{sha256:sha}),/LEEWAY_PART_(PAYLOAD_CORRUPT|MANIFEST_INVALID)/);
});
test('forged output hash fails',async()=>{
 const e=await encodeUniversalObject(Uint8Array.from([10,20]),{sha256:sha});
 await assert.rejects(decodeUniversalObject({...e,manifest:{...e.manifest,originalSha256:'0'.repeat(64)}},{sha256:sha}),/LEEWAY_OBJECT_RECONSTRUCTION_FAILED/);
});
test('bounded output rejects oversized declared size',async()=>{
 const e=await encodeUniversalObject(Uint8Array.from([1]),{sha256:sha});
 await assert.rejects(decodeUniversalObject(e,{sha256:sha,maxOutputBytes:0}),/LEEWAY_OBJECT_MANIFEST_INVALID/);
});
