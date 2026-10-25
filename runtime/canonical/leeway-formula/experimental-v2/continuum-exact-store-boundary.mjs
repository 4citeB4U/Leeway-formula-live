/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CONTINUUM
TAG: LEEWAY.PORTABLE_STORE_BOUNDARY.V1
WHAT: Versioned portable storage object adapter, separate from legacy Continuum blobs.
WHY: Existing SQLite content-parts are raw bytes with original SHA identities.
WHO: LeeWay Industries. WHERE: Formula experimental-v2.
WHEN: 2026-10-25. HOW: injected owner-admitted atomic store + exact independent readback.
AUTHORITY: Candidate only; no live Continuum or Google write authority.
LICENSE: Existing LeeWay Formula repository terms.
*/
import {encodeUniversalObject,decodeUniversalObject} from './universal-object-codec.mjs';
const fail=code=>{throw Error(code)};
function requireStore(store){
 if(!store||typeof store.putIfAbsent!=='function'||typeof store.get!=='function')
  fail('LEEWAY_VERSIONED_STORE_UNBOUND');
}
export async function stageExactObject(input,{store,sha256,compress,decompress,ownerScope}={}){
 requireStore(store);
 if(typeof ownerScope!=='string'||!ownerScope.trim())fail('LEEWAY_OWNER_SCOPE_REQUIRED');
 const object=await encodeUniversalObject(input,{sha256,compress});
 // Verify codec before any persistent write or accepted receipt.
 const reconstructed=await decodeUniversalObject(object,{sha256,decompress,maxOutputBytes:input.length});
 const m=object.manifest;
 if(reconstructed.length!==input.length)fail('LEEWAY_OBJECT_RECONSTRUCTION_FAILED');
 const identity=JSON.stringify([ownerScope,m.originalSha256]);
 const result=await store.putIfAbsent({identity,ownerScope,object});
 if(result?.committed!==true)fail('LEEWAY_STORE_COMMIT_NOT_VERIFIED');
 const readback=await store.get({identity,ownerScope});
 if(!readback)fail('LEEWAY_STORE_READBACK_MISSING');
 const verified=await decodeUniversalObject(readback,{sha256,decompress,maxOutputBytes:input.length});
 if(verified.length!==input.length||readback.manifest.originalSha256!==m.originalSha256)
  fail('LEEWAY_STORE_READBACK_MISMATCH');
 return Object.freeze({identity,originalSha256:m.originalSha256,originalBytes:m.originalBytes,
  storedPayloadBytes:readback.parts.reduce((sum,p)=>sum+p.length,0),
  version:m.schema,verifiedReadback:true,
  scope:'CANDIDATE_ONLY_NOT_CONTINUUM_ADMISSION'});
}
export async function recoverExactObject({store,identity,ownerScope,sha256,decompress,maxOutputBytes}={}){
 requireStore(store);
 if(typeof identity!=='string'||typeof ownerScope!=='string'||!ownerScope.trim())fail('LEEWAY_OWNER_SCOPE_REQUIRED');
 const object=await store.get({identity,ownerScope});
 if(!object)fail('LEEWAY_STORE_READBACK_MISSING');
 if(identity!==JSON.stringify([ownerScope,object.manifest?.originalSha256]))fail('LEEWAY_STORE_IDENTITY_MISMATCH');
 return decodeUniversalObject(object,{sha256,decompress,maxOutputBytes});
}
