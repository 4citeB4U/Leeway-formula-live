/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.PORTABLE.STORAGE
TAG: LEEWAY.EXACT_CONTENT_PART.PORTABLE_V1
WHO: LeeWay Industries; WHAT: cross-runtime exact content envelope;
WHY: no Windows, Node, browser, or physical host may own canonical storage semantics;
WHERE: Formula experimental-v2; WHEN: 2026-10-24;
HOW: Uint8Array and injected SHA-256/compression implementations with exact replay.
AUTHORITY: Candidate only; storage/Google writes must be separately authorized.
LICENSE: Existing LeeWay Formula repository terms.
*/
const MAX=256*1024;
const SHA=/^[a-f0-9]{64}$/;
const fail=code=>{throw Error(code)};
const copy=value=>new Uint8Array(value);
function validate(bytes){if(!(bytes instanceof Uint8Array)||bytes.byteLength<1||bytes.byteLength>MAX)fail('LEEWAY_PART_SIZE_INVALID')}
async function digest(hash,bytes){if(typeof hash!=='function')fail('LEEWAY_HASH_PROVIDER_UNBOUND');const value=await hash(copy(bytes));if(typeof value!=='string'||!SHA.test(value))fail('LEEWAY_HASH_INVALID');return value}
export async function encodePortableExactPart(input,{sha256,compress}={}){
 validate(input);
 const raw=copy(input),originalSha256=await digest(sha256,raw);
 let stored=raw,codec='RAW';
 if(typeof compress==='function'){
  const candidate=await compress(copy(raw));
  if(!(candidate instanceof Uint8Array))fail('LEEWAY_CODEC_OUTPUT_INVALID');
  if(candidate.length>0&&candidate.length<raw.length){stored=copy(candidate);codec='BROTLI'}
 }
 const payloadSha256=await digest(sha256,stored);
 return {manifest:Object.freeze({schema:'leeway.formula.exact-content-part.v1',codec,
  originalBytes:raw.length,storedBytes:stored.length,originalSha256,payloadSha256,
  exact:true,productionAccepted:false}),payload:stored};
}
export async function decodePortableExactPart(record,{sha256,decompress}={}){
 const m=record?.manifest,p=record?.payload;
 if(m?.schema!=='leeway.formula.exact-content-part.v1'||!(p instanceof Uint8Array)||
  !Number.isSafeInteger(m.originalBytes)||m.originalBytes<1||m.originalBytes>MAX||
  !Number.isSafeInteger(m.storedBytes)||m.storedBytes!==p.length||p.length>MAX||
  !['RAW','BROTLI'].includes(m.codec)||!SHA.test(m.originalSha256||'')||
  !SHA.test(m.payloadSha256||''))fail('LEEWAY_PART_MANIFEST_INVALID');
 if(await digest(sha256,p)!==m.payloadSha256)fail('LEEWAY_PART_PAYLOAD_CORRUPT');
 let raw;
 if(m.codec==='RAW')raw=copy(p);
 else{
  if(typeof decompress!=='function')fail('LEEWAY_DECOMPRESS_PROVIDER_UNBOUND');
  try{raw=await decompress(copy(p),m.originalBytes)}catch{fail('LEEWAY_PART_DECOMPRESSION_FAILED')}
  if(!(raw instanceof Uint8Array))fail('LEEWAY_CODEC_OUTPUT_INVALID');
 }
 if(raw.length!==m.originalBytes||await digest(sha256,raw)!==m.originalSha256)fail('LEEWAY_PART_RECONSTRUCTION_FAILED');
 return copy(raw);
}
