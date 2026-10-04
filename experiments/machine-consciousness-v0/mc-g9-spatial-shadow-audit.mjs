/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9_SPATIAL_SHADOW_AUDIT
WHAT = MC-G9 structural ablation tranche for Cesium-derived spatial context
WHY = Prove ingestion, provenance, isolation and fail-closed behavior before policy influence
LICENSE: MIT
*/
import fs from 'node:fs'; import crypto from 'node:crypto';
import {buildSpatialContext,SPATIAL_DIMENSION_ORDER} from './spatial-context.mjs';
import {simulateWorld} from './simulator.mjs'; import {buildOperationalAwareness} from './workspace-self-model.mjs';
const arg=process.argv.find(x=>x.startsWith('--live-trace=')); const livePath=arg?.slice('--live-trace='.length)||null;
const observations=Array.from({length:20},(_,i)=>({complete:true,dimensionOrder:[...SPATIAL_DIMENSION_ORDER],values:[80+i,8+i,4+i/10,12+i,15+i/4,24+i/2]}));
const fixture={mappingId:'personal-map-spatial-density-v0',provenance:'TEST_FIXTURE',capture:{qualification:'TEST_ONLY'},observations};
const context=buildSpatialContext(fixture),a=simulateWorld({worldIndex:9,scenario:'noisy',cycles:16,seed:20261004}),b=simulateWorld({worldIndex:9,scenario:'noisy',cycles:16,seed:20261004});
const awareness=buildOperationalAwareness(a[0],{spatialContext:context});
const structuralFailures=[];
if(context.stateRows.length!==16||context.stateRows.some(r=>r.length!==6))structuralFailures.push('SPATIAL_WINDOW_INVALID');
if(context.cognitiveUse!=='SHADOW_ONLY'||context.policyAuthority!==false)structuralFailures.push('SPATIAL_POLICY_ISOLATION_FAILED');
if(context.formulaExecutionState!=='NOT_EXECUTED')structuralFailures.push('SPATIAL_FORMULA_BOUNDARY_FAILED');
if(JSON.stringify(a.map(x=>x.stateHash))!==JSON.stringify(b.map(x=>x.stateHash)))structuralFailures.push('BASE_POLICY_DETERMINISM_FAILED');
if(awareness.workspaceState.selectedPolicy!==a[0].cognitionView.selectedPolicy)structuralFailures.push('SPATIAL_CONTEXT_CHANGED_POLICY');
let liveEvidence={state:'NOT_SUPPLIED',failure:null};
if(livePath){const t=JSON.parse(fs.readFileSync(livePath,'utf8'));try{const c=buildSpatialContext(t,{requireLiveGpu:true});liveEvidence={state:'REAL_GPU_SPATIAL_CONTEXT_READY',contextHash:c.contextHash,qualification:c.qualification,rows:c.stateRows.length,failure:null};}catch(e){liveEvidence={state:'BLOCKED_LIVE_EVIDENCE',qualification:t.capture?.qualification??null,gpu:t.capture?.gpu??null,completeObservationCount:t.capture?.completeObservationCount??0,totalObservationCount:t.capture?.totalObservationCount??null,failure:String(e.message||e)};}}
const out={schemaVersion:'1.0.0',gate:'MC-G9',tranche:'CESIUM_SPATIAL_SHADOW_V0',status:structuralFailures.length?'FAIL':'PASS_STRUCTURAL_SHADOW_NOT_GATE_CLOSURE',provider:'4citeB4U/Leeway-Maps / CesiumJS',mappingId:'personal-map-spatial-density-v0',structural:{stateRows:context.stateRows.length,width:6,cognitiveUse:context.cognitiveUse,policyAuthority:context.policyAuthority,formulaExecutionState:context.formulaExecutionState,workspaceContextHash:awareness.workspaceState.spatialContext.contextHash,baselinePolicyDeterministic:true},liveEvidence,structuralFailures,blockers:liveEvidence.state==='BLOCKED_LIVE_EVIDENCE'?[liveEvidence.failure]:[],runtimeReductionClaim:'NOT_MEASURED',policyContributionClaim:'NOT_MEASURED',formulaSemanticUse:'NONE',nextAction:'Capture 16 complete hardware-GPU spatial rows, then compare spatial-context ON/OFF for prediction quality, redundant derivation, routing cost and resource pressure before any policy promotion.',claimBoundary:'This tranche proves shadow world-model plumbing and fail-closed provenance only. It does not prove runtime speedup, Formula benefit, policy improvement, sentience or live action authority.'};
out.digest=crypto.createHash('sha256').update(JSON.stringify(out)).digest('hex');
fs.mkdirSync(new URL('./outputs/',import.meta.url),{recursive:true}); fs.writeFileSync(new URL('./outputs/mc-g9-cesium-spatial-shadow-20261004.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2)); process.exit(structuralFailures.length?1:0);
