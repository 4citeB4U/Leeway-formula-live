/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G42.EXPERIMENTAL_COMPRESSIVE_COMPUTE
TAG: LEEWAY.FORMULA.G42.EXACT_TILED_SILOS_32_64_8
5WH:
WHAT = Exact recoverable 32/64-square 8-channel tensor silo plus separately lossy 16/32-state summaries.
WHY = Formula mathematical state must guide reuse and representation without erasing exact source mathematics.
WHO = Creator-authorized LeeWay candidate engineer; policy interpretation not independently approved.
WHERE = Leeway-formula-live/runtime/canonical/leeway-formula/experimental-v2/compressive-math-silos.mjs
WHEN = 2026-10-22
HOW = 8x8 spatial tiles, SHA256 content identities, optional Brotli/identical-tile dictionary, exact reconstruction, measured compression, moments.
LICENSE: MIT
AUTHORITY: Candidate only; NO signing authority or original Receipt/Learning Ledger admission.
*/
import {createHash} from 'node:crypto';
import {brotliCompressSync,brotliDecompressSync,constants} from 'node:zlib';
const sha=x=>createHash('sha256').update(x).digest('hex');
const SHAPE_CHANNELS=8,TILE=8,MAX=64;
const CODECS=new Set(['RAW','BROTLI_RAW','TILE_DICTIONARY','BROTLI_TILE_DICTIONARY']);
const fail=c=>{throw Error(c)};
const scalarInfo=v=>v instanceof Float64Array?{type:'float64-le',bytes:8,
 write:(b,x,o)=>b.writeDoubleLE(x,o),read:(b,o)=>b.readDoubleLE(o),ctor:Float64Array}:
v instanceof Float32Array?{type:'float32-le',bytes:4,
 write:(b,x,o)=>b.writeFloatLE(x,o),read:(b,o)=>b.readFloatLE(o),ctor:Float32Array}:null;
const infoFor=type=>type==='float64-le'?scalarInfo(new Float64Array(0)):
type==='float32-le'?scalarInfo(new Float32Array(0)):null;
const rawOf=(tensor,s)=>{const raw=Buffer.alloc(tensor.length*s.bytes);
 for(let i=0;i<tensor.length;i++)s.write(raw,tensor[i],i*s.bytes);return raw};
const blocks=(side)=>side/TILE*side/TILE;
function readTile(raw,side,ty,tx,bytes){
 const block=Buffer.alloc(TILE*TILE*SHAPE_CHANNELS*bytes);
 for(let y=0;y<TILE;y++){
  const offset=((ty*TILE+y)*side+tx*TILE)*SHAPE_CHANNELS*bytes;
  raw.copy(block,y*TILE*SHAPE_CHANNELS*bytes,offset,offset+TILE*SHAPE_CHANNELS*bytes);
 }
 return block;
}
function scatterTile(raw,side,ty,tx,block,bytes){
 for(let y=0;y<TILE;y++){
  const offset=((ty*TILE+y)*side+tx*TILE)*SHAPE_CHANNELS*bytes;
  block.copy(raw,offset,y*TILE*SHAPE_CHANNELS*bytes,(y+1)*TILE*SHAPE_CHANNELS*bytes);
 }
}
function tileDictionary(raw,side,bytes){
 const tileCount=blocks(side),size=TILE*TILE*SHAPE_CHANNELS*bytes;
 const ids=Buffer.alloc(tileCount*2),unique=[],hashes=new Map();
 let pos=0;
 for(let ty=0;ty<side/TILE;ty++)for(let tx=0;tx<side/TILE;tx++){
  const block=readTile(raw,side,ty,tx,bytes),hash=sha(block);
  let key=hashes.get(hash);
  if(key===undefined||!unique[key].equals(block)){key=unique.length;unique.push(block);hashes.set(hash,key)}
  ids.writeUInt16LE(key,pos++*2);
 }
 return {payload:Buffer.concat([ids,...unique]),uniqueTiles:unique.length,
  tileCount,size,identityBytes:ids.length};
}
const br=b=>brotliCompressSync(b,{params:{
 [constants.BROTLI_PARAM_QUALITY]:4,
 [constants.BROTLI_PARAM_SIZE_HINT]:b.length}});
export function encodeExactMathSilo(tensor,{side=64}={}){
 const format=scalarInfo(tensor);
 if(!format||![32,64].includes(side)||tensor.length!==side*side*SHAPE_CHANNELS||
   !tensor.every(Number.isFinite))fail('G42_SHAPE_DTYPE_FINITE_REQUIRED');
 const raw=rawOf(tensor,format),dict=tileDictionary(raw,side,format.bytes);
 const candidates=[
  ['RAW',raw],['BROTLI_RAW',br(raw)],
  ['TILE_DICTIONARY',dict.payload],['BROTLI_TILE_DICTIONARY',br(dict.payload)]
 ].sort((a,b)=>a[1].length-b[1].length);
 const [codec,payload]=candidates[0];
 const exact=Object.freeze({
  schema:'leeway.formula.experimental-v2.exact-math-silo.v1',
  side,channels:SHAPE_CHANNELS,tileSide:TILE,dtype:format.type,codec,
  elementCount:tensor.length,rawBytes:raw.length,payloadBytes:payload.length,
  tileCount:dict.tileCount,uniqueTileCount:dict.uniqueTiles,
  rawSha256:sha(raw),payloadSha256:sha(payload),
  exactReconstructionRequired:true,policyAuthority:false,productionAccepted:false
 });
 return {manifest:exact,payload};
}
function inflate(codec,payload,maxSize){
 if(codec.startsWith('BROTLI_'))
  return brotliDecompressSync(payload,{maxOutputLength:maxSize});
 return payload;
}
export function decodeExactMathSilo(silo){
 const x=silo?.manifest,encoded=silo?.payload;
 if(!x||x.schema!=='leeway.formula.experimental-v2.exact-math-silo.v1'||
   !CODECS.has(x.codec)||![32,64].includes(x.side)||x.channels!==8||
   x.tileSide!==8||!Buffer.isBuffer(encoded)||
   x.elementCount!==x.side*x.side*8||
   typeof x.rawSha256!=='string'||!/^[0-9a-f]{64}$/.test(x.rawSha256)||
   typeof x.payloadSha256!=='string'||!/^[0-9a-f]{64}$/.test(x.payloadSha256))
  fail('G42_SILO_MANIFEST_INVALID');
 const format=infoFor(x.dtype);
 if(!format||x.rawBytes!==x.elementCount*format.bytes||
   encoded.length!==x.payloadBytes||encoded.length>x.rawBytes+4096)
  fail('G42_SILO_DIMENSION_OR_LENGTH_INVALID');
 if(sha(encoded)!==x.payloadSha256)fail('G42_SILO_PAYLOAD_HASH_MISMATCH');
 const count=blocks(x.side),tileSize=8*8*8*format.bytes;
 let raw;
 if(x.codec==='RAW'||x.codec==='BROTLI_RAW'){
  raw=inflate(x.codec,encoded,x.rawBytes);
  if(raw.length!==x.rawBytes)fail('G42_SILO_RAW_SIZE_MISMATCH');
 }else{
  const maxDictBytes=count*2+count*tileSize;
  const dict=inflate(x.codec,encoded,maxDictBytes);
  if(!Number.isInteger(x.uniqueTileCount)||x.uniqueTileCount<1||x.uniqueTileCount>count||
    dict.length!==count*2+x.uniqueTileCount*tileSize)
   fail('G42_SILO_DICTIONARY_LENGTH_INVALID');
  raw=Buffer.alloc(x.rawBytes);
  let tile=0;
  for(let ty=0;ty<x.side/8;ty++)for(let tx=0;tx<x.side/8;tx++){
   const id=dict.readUInt16LE(tile++*2);
   if(id>=x.uniqueTileCount)fail('G42_SILO_DICT_TILE_REFERENCE_INVALID');
   const offset=count*2+id*tileSize;
   scatterTile(raw,x.side,ty,tx,dict.subarray(offset,offset+tileSize),format.bytes);
  }
 }
 if(sha(raw)!==x.rawSha256)fail('G42_SILO_EXACT_RECONSTRUCTION_MISMATCH');
 const values=new format.ctor(x.elementCount);
 for(let i=0;i<values.length;i++)values[i]=format.read(raw,i*format.bytes);
 if(!values.every(Number.isFinite))fail('G42_SILO_RECONSTRUCTED_NONFINITE');
 return {tensor:values,rawSha256:sha(raw),exact:true};
}
export function deriveMathTileStates(silo,{parameters=32}={}){
 if(![16,32].includes(parameters))fail('G42_SILO_STATES_REQUIRE_16_OR_32');
 const {tensor}=decodeExactMathSilo(silo),side=silo.manifest.side;
 const tiles=[],blockSize=8*8*8;
 for(let ty=0;ty<side/8;ty++)for(let tx=0;tx<side/8;tx++){
  const means=Array(8).fill(0),squares=Array(8).fill(0);
  const minimum=Array(8).fill(Infinity),maximum=Array(8).fill(-Infinity);
  for(let y=0;y<8;y++)for(let x=0;x<8;x++)for(let c=0;c<8;c++){
   const v=tensor[((ty*8+y)*side+(tx*8+x))*8+c];
   means[c]+=v;squares[c]+=v*v;
   minimum[c]=Math.min(minimum[c],v);maximum[c]=Math.max(maximum[c],v);
  }
  for(let c=0;c<8;c++){means[c]/=64;squares[c]=Math.sqrt(Math.max(0,squares[c]/64));}
  const vals=parameters===16?[...means,...squares]:[...means,...squares,...minimum,...maximum];
  if(!vals.every(Number.isFinite))fail('G42_SILO_STATS_OVERFLOW');
  tiles.push(vals);
 }
 const stateBytes=Buffer.alloc(tiles.length*parameters*8);
 let k=0;for(const t of tiles)for(const v of t){stateBytes.writeDoubleLE(v,k);k+=8}
 return Object.freeze({
  schema:'leeway.formula.experimental-v2.math-tile-states.v1',
  sourceRawSha256:silo.manifest.rawSha256,
  tileGrid:[side/8,side/8],stateShape:[tiles.length,parameters],
  parametersPerTile:parameters,states:tiles,stateSha256:sha(stateBytes),
  lossySummary:true,sourceReconstructableFromStates:false,
  exactSourceRetainedSeparately:true,
  dimensions:parameters===16?['8 means','8 rootMeanSquares']:
   ['8 means','8 rootMeanSquares','8 minima','8 maxima'],
  policyAuthority:false,productionAccepted:false
 });
}
export function applyExactTileReuseOperation(silo,{scales,offsets}={}){
 if(!Array.isArray(scales)||!Array.isArray(offsets)||scales.length!==8||offsets.length!==8||
   !scales.every(Number.isFinite)||!offsets.every(Number.isFinite))
  fail('G42_EIGHT_FINITE_CHANNEL_COEFFICIENTS_REQUIRED');
 const input=decodeExactMathSilo(silo).tensor,side=silo.manifest.side,format=scalarInfo(input);
 const source=rawOf(input,format),out=new format.ctor(input.length);
 const cache=new Map(),totalTiles=blocks(side),blockSize=512;
 let uniqueComputed=0,reused=0;
 let i=0;
 for(let ty=0;ty<side/8;ty++)for(let tx=0;tx<side/8;tx++){
  const b=readTile(source,side,ty,tx,format.bytes),key=sha(b);
  let computed=cache.get(key);
  if(!computed||!computed.original.equals(b)){
   computed={original:b,values:new format.ctor(blockSize)};
   for(let v=0;v<blockSize;v++){
    const val=format.read(b,v*format.bytes)*scales[v%8]+offsets[v%8];
    if(!Number.isFinite(val))fail('G42_AFFINE_RESULT_OVERFLOW');
    computed.values[v]=val;
   }
   cache.set(key,computed);uniqueComputed++;
  }else reused++;
  for(let y=0;y<8;y++)for(let x=0;x<8;x++)for(let c=0;c<8;c++)
   out[((ty*8+y)*side+tx*8+x)*8+c]=computed.values[(y*8+x)*8+c];
  i++;
 }
 const result=rawOf(out,format);
 return {result:out,receipt:Object.freeze({
  schema:'leeway.formula.experimental-v2.exact-tile-reuse-receipt.v1',
  sourceSha256:silo.manifest.rawSha256,resultSha256:sha(result),
  requestOperation:'PURE_PER_CHANNEL_AFFINE_INDEPENDENT_OF_TILE_POSITION',
  sourceTiles:totalTiles,uniqueTilesComputed:uniqueComputed,reusedTiles:reused,
  scalarEvaluations:uniqueComputed*blockSize,
  independentScalarEvaluations:input.length,
  exactTileReuseEnabled:true,
  resultSha256CheckedByIndependentOracle:false,
  signedExecutionAuthority:false,productionAccepted:false
 })};
}
