/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.STORAGE
TAG: LEEWAY.STORAGE.EXACT_CHUNK_CODEC.CANDIDATE
WHO: LeeWay Industries; WHAT: generic exact file-part reduction candidate;
WHY: reuse G42 content identity + Brotli before approved Continuum archival;
WHERE: Formula experimental-v2; WHEN: 2026-10-24;
HOW: bounded SHA-256/Brotli and exact, independent reconstruction.
AUTHORITY: Candidate only; no Continuum/Google write enrollment.
LICENSE: Existing LeeWay Formula repository terms.
*/
import {createHash} from 'node:crypto';
import {brotliCompressSync,brotliDecompressSync,constants} from 'node:zlib';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const MAX=256*1024;
const error=code=>{throw Error(code)};
export function encodeExactContentPart(input){
 if(!Buffer.isBuffer(input)||input.length<1||input.length>MAX)error('LEEWAY_PART_SIZE_INVALID');
 const source=Buffer.from(input);
 const compressed=brotliCompressSync(source,{params:{[constants.BROTLI_PARAM_QUALITY]:4}});
 const useful=compressed.length<source.length;
 const payload=Buffer.from(useful?compressed:source);
 const manifest=Object.freeze({schema:'leeway.formula.exact-content-part.v1',
  codec:useful?'BROTLI':'RAW',originalBytes:source.length,storedBytes:payload.length,
  originalSha256:hash(source),payloadSha256:hash(payload),exact:true,
  productionAccepted:false});
 return {manifest,payload};
}
export function decodeExactContentPart(record){
 const m=record?.manifest,p=record?.payload;
 if(m?.schema!=='leeway.formula.exact-content-part.v1'||!Buffer.isBuffer(p)||
  !Number.isSafeInteger(m.originalBytes)||m.originalBytes<1||m.originalBytes>MAX||
  !Number.isSafeInteger(m.storedBytes)||m.storedBytes!==p.length||p.length>MAX||
  !['RAW','BROTLI'].includes(m.codec)||!(/^[a-f0-9]{64}$/).test(m.originalSha256||'')||
  !(/^[a-f0-9]{64}$/).test(m.payloadSha256||''))error('LEEWAY_PART_MANIFEST_INVALID');
 if(hash(p)!==m.payloadSha256)error('LEEWAY_PART_PAYLOAD_CORRUPT');
 let output;
 try{output=m.codec==='BROTLI'?brotliDecompressSync(p,{maxOutputLength:m.originalBytes}):Buffer.from(p)}
 catch{error('LEEWAY_PART_DECOMPRESSION_FAILED')}
 if(output.length!==m.originalBytes||hash(output)!==m.originalSha256)error('LEEWAY_PART_RECONSTRUCTION_FAILED');
 return output;
}
