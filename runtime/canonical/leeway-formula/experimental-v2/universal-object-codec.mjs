/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.PORTABLE.STORAGE
TAG: LEEWAY.UNIVERSAL_OBJECT_CODEC.V1
WHAT: Device-agnostic lossless object envelope above the exact content-part codec.
WHY: Identical source identity and reconstruction across LeeWay platforms.
WHO: LeeWay Industries. WHERE: Formula portable storage boundary.
WHEN: 2026-10-24. HOW: 256 KiB chunks, SHA-256, optional injected Brotli.
AUTHORITY: Candidate; no Continuum, Drive, or production write permission.
LICENSE: Existing LeeWay Formula repository terms.
*/
import {encodePortableExactPart,decodePortableExactPart} from './portable-exact-content-part.mjs';
const SIZE=256*1024,HEX=/^[a-f0-9]{64}$/;
const fail=s=>{throw Error(s)};
const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
async function digest(sha256,data){
 if(typeof sha256!=='function')fail('LEEWAY_HASH_PROVIDER_UNBOUND');
 const s=await sha256(new Uint8Array(data));
 if(typeof s!=='string'||!HEX.test(s))fail('LEEWAY_HASH_INVALID');
 return s;
}
export async function encodeUniversalObject(input,{sha256,compress}={}){
 if(!(input instanceof Uint8Array))fail('LEEWAY_OBJECT_BYTES_REQUIRED');
 const data=new Uint8Array(input),parts=[];
 for(let offset=0;offset<data.length;offset+=SIZE){
  const p=await encodePortableExactPart(data.slice(offset,offset+SIZE),{sha256,compress});
  parts.push(p);
 }
 const manifest=Object.freeze({schema:'leeway.formula.universal-object.v1',
  chunkBytes:SIZE,originalBytes:data.length,originalSha256:await digest(sha256,data),
  partCount:parts.length,parts:parts.map((p,i)=>Object.freeze({
   index:i,...p.manifest
  })),exact:true,productionAccepted:false});
 return {manifest,parts:parts.map(p=>new Uint8Array(p.payload))};
}
export async function decodeUniversalObject(record,{sha256,decompress,maxOutputBytes=64*1024*1024}={}){
 const m=record?.manifest,parts=record?.parts;
 if(m?.schema!=='leeway.formula.universal-object.v1'||m.chunkBytes!==SIZE||
   !Number.isSafeInteger(m.originalBytes)||m.originalBytes<0||
   m.originalBytes>maxOutputBytes||!HEX.test(m.originalSha256||'')||
   !Number.isSafeInteger(m.partCount)||m.partCount!==Math.ceil(m.originalBytes/SIZE)||
   !Array.isArray(m.parts)||m.parts.length!==m.partCount||
   !Array.isArray(parts)||parts.length!==m.partCount)fail('LEEWAY_OBJECT_MANIFEST_INVALID');
 const out=new Uint8Array(m.originalBytes);let offset=0;
 for(let i=0;i<m.partCount;i++){
  const part=m.parts[i];
  if(part?.index!==i||part.originalBytes!==Math.min(SIZE,m.originalBytes-offset))
   fail('LEEWAY_OBJECT_PART_ORDER_INVALID');
  const decoded=await decodePortableExactPart({manifest:part,payload:parts[i]},{sha256,decompress});
  out.set(decoded,offset);offset+=decoded.length;
 }
 if(offset!==m.originalBytes||await digest(sha256,out)!==m.originalSha256)fail('LEEWAY_OBJECT_RECONSTRUCTION_FAILED');
 return out;
}
export async function webCryptoSha256(bytes){
 if(typeof globalThis.crypto?.subtle?.digest!=='function')fail('LEEWAY_WEBCRYPTO_UNAVAILABLE');
 return hex(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)));
}
