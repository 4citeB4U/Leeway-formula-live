/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CONTINUUM.ADAPTER
TAG: LEEWAY.CONTINUUM.AUTHORIZED_ARCHIVE.V1
WHAT: Versioned portable compressed archive through original Continuum ingestFile/getContent.
WHY: Preserve Continuum governance and legacy raw records without replacing databases.
WHO: LeeWay Industries. WHERE: Formula experimental candidate.
WHEN: 2026-10-25. HOW: injected codec, authorized service, exact post-commit readback.
AUTHORITY: Candidate, no credential or owner admission minted here.
LICENSE: Existing LeeWay Formula repository terms.
*/
import {encodeUniversalObject,decodeUniversalObject} from './universal-object-codec.mjs';
const fail=code=>{throw Error(code)};
const textEncoder=new TextEncoder(),textDecoder=new TextDecoder();
const b64=(bytes)=>{let raw='';for(let i=0;i<bytes.length;i++)raw+=String.fromCharCode(bytes[i]);if(typeof btoa!=='function')fail('LEEWAY_BASE64_ADAPTER_UNAVAILABLE');return btoa(raw)};
const unb64=(value)=>{if(typeof value!=='string'||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value))fail('LEEWAY_ARCHIVE_BASE64_INVALID');try{return Uint8Array.from(atob(value),c=>c.charCodeAt(0))}catch{fail('LEEWAY_ARCHIVE_BASE64_INVALID')}};
const seal=(obj)=>textEncoder.encode(JSON.stringify({schema:'leeway.continuum.compressed-archive.v1',manifest:obj.manifest,parts:obj.parts.map(b64)}));
const unseal=(bytes)=>{let e;try{e=JSON.parse(textDecoder.decode(bytes))}catch{fail('LEEWAY_ARCHIVE_INVALID')}if(e?.schema!=='leeway.continuum.compressed-archive.v1'||!Array.isArray(e.parts)||e.parts.length>256)fail('LEEWAY_ARCHIVE_INVALID');return {manifest:e.manifest,parts:e.parts.map(unb64)}};
export async function ingestCompressedContinuumFile({service,input,context,sha256,compress,decompress}={}){
 if(typeof service?.ingestFile!=='function'||typeof service?.getContent!=='function')fail('LEEWAY_CONTINUUM_SERVICE_UNBOUND');
 if(!(input?.bytes instanceof Uint8Array))fail('LEEWAY_ARCHIVE_SOURCE_REQUIRED');
 const original=new Uint8Array(input.bytes);
 const obj=await encodeUniversalObject(original,{sha256,compress});
 const archive=seal(obj);
 const checked=await decodeUniversalObject(unseal(archive),{sha256,decompress,maxOutputBytes:original.length});
 if(checked.length!==original.length)fail('LEEWAY_ARCHIVE_PRECOMMIT_MISMATCH');
 const result=await service.ingestFile({...input,bytes:archive,mimeType:'application/vnd.leeway.compressed-archive+json',
  source:{...input.source,codec:'leeway.continuum.compressed-archive.v1',originalSha256:obj.manifest.originalSha256}},context);
 const returned=service.getContent(result.recordId,context);
 const verified=await decodeUniversalObject(unseal(returned.bytes),{sha256,decompress,maxOutputBytes:original.length});
 if(verified.length!==original.length||await sha256(verified)!==obj.manifest.originalSha256||returned.record?.contentSha256!==await sha256(archive))fail('LEEWAY_CONTINUUM_ARCHIVE_READBACK_INVALID');
 return {recordId:result.recordId,sourceSha256:obj.manifest.originalSha256,
  storedBytes:archive.length,sourceBytes:original.length,verifiedReadback:true,
  scope:'CANONICAL_CONTINUUM_GOVERNANCE_REQUIRED',receiptId:returned.record?.receiptId};
}
export async function readCompressedContinuumFile({service,recordId,context,sha256,decompress,maxOutputBytes=32*1024*1024}={}){
 if(typeof service?.getContent!=='function')fail('LEEWAY_CONTINUUM_SERVICE_UNBOUND');
 const result=service.getContent(recordId,context);
 if(result.record?.mimeType!=='application/vnd.leeway.compressed-archive+json')fail('LEEWAY_ARCHIVE_RECORD_TYPE_MISMATCH');
 return decodeUniversalObject(unseal(result.bytes),{sha256,decompress,maxOutputBytes});
}
