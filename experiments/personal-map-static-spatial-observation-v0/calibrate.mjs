import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const argv=process.argv.slice(2);
const outIndex=argv.indexOf('--out');
const outPath=outIndex>=0&&argv[outIndex+1]?argv[outIndex+1]:'experiments/personal-map-static-spatial-observation-v0/outputs/calibration-candidate.json';
const inputs=argv.filter((value,index)=>value!=='--out'&&index!==outIndex+1&&!value.startsWith('--'));
if(inputs.length<3) throw new Error('STATIC_SPATIAL_REQUIRES_AT_LEAST_3_LIVE_TRACES');

const ORDER=['visible_static_candidate_count','rendered_static_label_count','enabled_static_layer_count','camera_height_m','frame_time_ms','interaction_latency_ms'];
const sha=(v)=>crypto.createHash('sha256').update(v).digest('hex');
const percentile=(values,p)=>{const a=values.slice().sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.max(0,Math.ceil(a.length*p/100)-1))]};

const traces=inputs.map((file)=>{
 const bytes=fs.readFileSync(file); const data=JSON.parse(bytes);
 if(data.contractId!=='personal-map-static-spatial-observation-v0') throw new Error('STATIC_SPATIAL_CONTRACT_MISMATCH_'+file);
 if(data.provenance!=='LIVE_BROWSER_STATIC_SPATIAL_MEASUREMENT') throw new Error('STATIC_SPATIAL_LIVE_EVIDENCE_REQUIRED_'+file);
 const rows=(data.observations||[]).filter((r)=>r.complete&&JSON.stringify(r.dimensionOrder)===JSON.stringify(ORDER)&&Array.isArray(r.values)&&r.values.length===6&&r.values.every(Number.isFinite)).map((r)=>r.values.map(Number));
 if(rows.length<16) throw new Error('STATIC_SPATIAL_TRACE_NEEDS_16_ROWS_'+file);
 return {file,sha256:sha(bytes),userAgent:data.userAgent||null,viewportRegime:data.capture?.viewportRegime||null,deviceProfile:data.capture?.deviceProfile||data.userAgent||null,rows};
});
const deviceProfiles=new Set(traces.map((t)=>t.deviceProfile).filter(Boolean));
if(deviceProfiles.size<2) throw new Error('STATIC_SPATIAL_REQUIRES_2_DEVICE_PROFILES');
const regimes=new Set(traces.map((t)=>t.viewportRegime));
for(const regime of ['street','neighborhood','city']) if(!regimes.has(regime)) throw new Error('STATIC_SPATIAL_MISSING_REGIME_'+regime);
const rows=traces.flatMap((t)=>t.rows);
if(rows.length<48) throw new Error('STATIC_SPATIAL_REQUIRES_48_ROWS');

const ranges=[]; const summaries=[];
for(let j=0;j<6;j++){
 const values=rows.map((r)=>r[j]); const p05=percentile(values,5),p50=percentile(values,50),p95=percentile(values,95);
 const width=Math.max(1e-9,p95-p05); const lower=Math.max(0,p05-width*.1),upper=p95+width*.1;
 ranges.push([lower,upper]); summaries.push({id:ORDER[j],min:Math.min(...values),p05,p50,p95,max:Math.max(...values),range:[lower,upper]});
}
const output={
 schemaVersion:'1.0.0',contractId:'personal-map-static-spatial-observation-v0',
 profileId:'personal-map-static-spatial-calibration-v0',
 formulaId:'LEEWAY-FORMULA-v1.0',runtimeAdapterId:'runtime-state-v1',
 status:'CANDIDATE_STATIC_SPATIAL_CALIBRATION_REVIEW_REQUIRED',
 formulaExecutionState:'NOT_EXECUTED',dimensionOrder:ORDER,ranges,summaries,
 provenance:{liveTraceCount:traces.length,observationCount:rows.length,deviceProfileCount:deviceProfiles.size,viewportRegimes:[...regimes],traces:traces.map(({file,sha256,userAgent,viewportRegime,deviceProfile})=>({file,sha256,userAgent,viewportRegime,deviceProfile}))},
 separationRule:'Do not combine these ranges with personal-map-spatial-density-v0 dynamic ranges.'
};
fs.mkdirSync(path.dirname(outPath),{recursive:true});fs.writeFileSync(outPath,JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({status:output.status,outPath,ranges,deviceProfileCount:deviceProfiles.size,viewportRegimes:[...regimes]},null,2));
