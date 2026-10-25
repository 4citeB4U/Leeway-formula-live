/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CONTINUUM.TEST
TAG: LEEWAY.PORTABLE_STORE_BOUNDARY.TEST
WHAT: Owner-scoped atomic mock transport contract tests.
WHO: LeeWay Industries. WHERE: Formula experimental-v2 tests.
WHEN: 2026-10-25. HOW: independent readback, corruption, refusal, recovery.
AUTHORITY: TEST_ONLY. LICENSE: Existing LeeWay Formula terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {brotliCompressSync,brotliDecompressSync} from 'node:zlib';
import {stageExactObject,recoverExactObject} from '../continuum-exact-store-boundary.mjs';
const sha256=async b=>createHash('sha256').update(b).digest('hex');
const compress=async b=>new Uint8Array(brotliCompressSync(b));
const decompress=async(b,n)=>new Uint8Array(brotliDecompressSync(b,{maxOutputLength:n}));
const makeStore=()=>{
 const data=new Map();
 return {data,async putIfAbsent({identity,object}){if(!data.has(identity))data.set(identity,structuredClone(object));return {committed:true}},
 async get({identity}){return structuredClone(data.get(identity))}};
};
test('owner-scoped compressed object survives verified readback',async()=>{
 const store=makeStore(),input=new Uint8Array(524290).fill(42);
 const result=await stageExactObject(input,{store,sha256,compress,decompress,ownerScope:'leeway:test'});
 assert.equal(result.verifiedReadback,true);
 assert.ok(result.storedPayloadBytes<input.length);
 assert.deepEqual(await recoverExactObject({store,identity:result.identity,ownerScope:'leeway:test',sha256,decompress,maxOutputBytes:input.length}),input);
});
test('different owners cannot read same identity',async()=>{
 const store=makeStore(),x=await stageExactObject(Uint8Array.from([1,2]),{store,sha256,ownerScope:'leeway:one'});
 await assert.rejects(recoverExactObject({store,identity:x.identity,ownerScope:'leeway:two',sha256,maxOutputBytes:2}),/LEEWAY_STORE_IDENTITY_MISMATCH/);
});
test('failed storage commit cannot claim acceptance',async()=>{
 const store={putIfAbsent:async()=>({committed:false}),get:async()=>null};
 await assert.rejects(stageExactObject(Uint8Array.from([1]),{store,sha256,ownerScope:'leeway:test'}),/LEEWAY_STORE_COMMIT_NOT_VERIFIED/);
});
test('tampered persisted data cannot pass readback',async()=>{
 const store=makeStore(),get=store.get.bind(store);
 store.get=async x=>{const o=await get(x);if(o?.parts[0])o.parts[0][0]^=1;return o};
 await assert.rejects(stageExactObject(Uint8Array.from([1,2,3]),{store,sha256,ownerScope:'leeway:test'}),/LEEWAY_PART_PAYLOAD_CORRUPT/);
});
