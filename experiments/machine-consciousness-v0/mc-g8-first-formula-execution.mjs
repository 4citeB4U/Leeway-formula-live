/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC8_FIRST_FORMULA_EXECUTION
WHAT = Execute the first canonical Formula evaluation on one fresh qualified 16-cycle cognition window
WHY = Close MC-G8 without inventing conversational scores or changing the Golden Formula
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/mc-g8-first-formula-execution.mjs
WHEN = MC-8
HOW = Fresh deterministic world -> operational awareness -> independent six-dimension recomputation -> accepted MC-G6 ranges -> runtime-state-v1 -> canonical Formula endpoint -> receipt/hash verification
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';
import fs from 'node:fs';
import {simulateWorld} from './simulator.mjs';
import {buildOperationalAwareness} from './workspace-self-model.mjs';
import {calculateDimensionWindow,DIMENSION_ORDER} from './cognition-dimensions.mjs';

const REPO=new URL('../../',import.meta.url);
const CALIBRATION=new URL('../../contracts/domain-adapters/machine-consciousness-awareness-calibration-v0.json',import.meta.url);
const OUT=new URL('./outputs/mc-g8/',import.meta.url);
const FORMULA='http://127.0.0.1:4001/runtime/formula/v1';
const scenario='noisy';
const seed=0x6d633038; // ASCII-derived stable record for "mc08"; fresh relative to qualification campaigns
const worldIndex=8808;
const cycles=16;
const requestedTraceId='MC-G8-FIRST-COGNITION-20261001';

const sha=v=>crypto.createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v)).digest('hex');
const calibration=JSON.parse(fs.readFileSync(CALIBRATION,'utf8'));
if(calibration.status!=='MC_G6_ACCEPTED_CALIBRATION')throw new Error('MC_G6_CALIBRATION_NOT_ACCEPTED');
if(calibration.mappingId!=='machine-consciousness-awareness-v0')throw new Error('MC_G6_MAPPING_MISMATCH');
if(calibration.formulaId!=='LEEWAY-FORMULA-v1.0')throw new Error('MC_G6_FORMULA_ID_MISMATCH');
if(!Array.isArray(calibration.ranges)||calibration.ranges.length!==6)throw new Error('MC_G6_RANGES_INVALID');

const receipts=simulateWorld({worldIndex,scenario,cycles,seed});
if(receipts.length!==16)throw new Error('MC_G8_16_CYCLES_REQUIRED');
const awareness=receipts.map(r=>buildOperationalAwareness(r));
if(!awareness.every(a=>a.workspaceVerified&&a.selfModelVerified))throw new Error('MC_G8_OPERATIONAL_AWARENESS_UNVERIFIED');

const window=calculateDimensionWindow(receipts,awareness);
if(window.stateRows.length!==16||!window.stateRows.every(r=>r.length===6))throw new Error('MC_G8_16X6_INVALID');
for(let i=0;i<16;i++){
  for(let j=0;j<6;j++){
    const v=window.stateRows[i][j], [lo,hi]=calibration.ranges[j];
    if(!Number.isFinite(v))throw new Error('MC_G8_NON_FINITE_'+i+'_'+j);
    if(v<lo||v>hi)throw new Error('MC_G8_OUT_OF_RANGE_'+i+'_'+j+'_'+v);
  }
}

const sourceWindow={
  schemaVersion:'1.0.0',
  gate:'MC-G8',
  provenance:'SIMULATED',
  scenario,seed,worldIndex,cycles,
  dimensionOrder:DIMENSION_ORDER,
  sourceStateHashes:window.sourceHashes,
  stateRows:window.stateRows,
  calibrationProfile:calibration.profileId,
  calibrationRanges:calibration.ranges
};
const sourceWindowHash=sha(sourceWindow);

const healthResponse=await fetch(FORMULA+'/health',{signal:AbortSignal.timeout(5000)});
if(!healthResponse.ok)throw new Error('FORMULA_HEALTH_HTTP_'+healthResponse.status);
const health=await healthResponse.json();
if(health.status!=='LEEWAY_FORMULA_V1_PASS'||health.formula!=='LEEWAY-FORMULA-v1.0'||!health.goldenVectorPass||!health.specValid||!health.adapterRegistryPass)throw new Error('FORMULA_AUTHORITY_NOT_HEALTHY');

const request={
  adapterId:'runtime-state-v1',
  caller:'machine-consciousness-awareness-v0',
  traceId:requestedTraceId,
  input:{stateRows:window.stateRows,ranges:calibration.ranges}
};
const requestHash=sha(request);
const response=await fetch(FORMULA+'/evaluate',{
  method:'POST',
  headers:{'content-type':'application/json'},
  body:JSON.stringify(request),
  signal:AbortSignal.timeout(15000)
});
const responseText=await response.text();
if(!response.ok)throw new Error('FORMULA_EVALUATION_HTTP_'+response.status+'_'+responseText);
const result=JSON.parse(responseText);
if(result.formulaId!=='LEEWAY-FORMULA-v1.0')throw new Error('FORMULA_RESULT_ID_MISMATCH');
if(result.adapterId!=='runtime-state-v1')throw new Error('FORMULA_RESULT_ADAPTER_MISMATCH');
if(!/^[a-f0-9]{64}$/.test(result.inputHash)||!/^[a-f0-9]{64}$/.test(result.resultHash))throw new Error('FORMULA_RESULT_HASH_INVALID');
if(!result.receiptPath||!fs.existsSync(result.receiptPath))throw new Error('FORMULA_RECEIPT_MISSING');
const formulaReceiptBytes=fs.readFileSync(result.receiptPath);
const formulaReceiptSha256=sha(formulaReceiptBytes);

const output={
  schemaVersion:'1.0.0',
  gate:'MC-G8',
  status:'PASS_EXECUTION_GATE',
  runtimeExecutionState:'EXECUTED',
  verificationStatus:'UNVERIFIED',
  interpretationStatus:'NOT_PROMOTED',
  claimBoundary:'Canonical Formula execution occurred on an independently recomputed fresh 16x6 simulated cognition window. The Formula output has not yet been validated as a useful cognition/task interpretation.',
  source:{
    scenario,seed,worldIndex,cycles,
    sourceWindowHash,
    sourceStateHashes:window.sourceHashes,
    dimensionOrder:DIMENSION_ORDER
  },
  calibration:{
    profileId:calibration.profileId,
    status:calibration.status,
    ranges:calibration.ranges,
    calibrationFileSha256:sha(fs.readFileSync(CALIBRATION))
  },
  authority:{
    health,
    healthStatus:'VERIFIED_AT_EXECUTION'
  },
  request:{requestHash,requestedTraceId},
  result,
  receiptVerification:{
    exists:true,
    path:result.receiptPath,
    sha256:formulaReceiptSha256
  },
  acceptance:{
    exactly16Cycles:receipts.length===16,
    exactly6Dimensions:window.stateRows.every(r=>r.length===6),
    allOperationalAwarenessVerified:awareness.every(a=>a.workspaceVerified&&a.selfModelVerified),
    allValuesFiniteAndWithinAcceptedRanges:true,
    formulaExecuted:true,
    inputHashPreserved:true,
    resultHashPreserved:true,
    formulaReceiptPreserved:true,
    resultRemainsExecutedUnverified:true
  }
};
output.acceptance.pass=Object.values(output.acceptance).every(Boolean);

fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(new URL('source-window.json',OUT),JSON.stringify(sourceWindow,null,2)+'\n');
fs.writeFileSync(new URL('request.json',OUT),JSON.stringify(request,null,2)+'\n');
fs.writeFileSync(new URL('result.json',OUT),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(new URL('mc-g8-summary.json',OUT),JSON.stringify(output,null,2)+'\n');

console.log(JSON.stringify({
  gate:output.gate,
  status:output.status,
  runtimeExecutionState:output.runtimeExecutionState,
  verificationStatus:output.verificationStatus,
  scenario,seed,worldIndex,
  sourceWindowHash,
  inputHash:result.inputHash,
  resultHash:result.resultHash,
  decimalState:result.decimalState,
  base64State:result.base64State,
  receiptPath:result.receiptPath,
  formulaReceiptSha256,
  acceptance:output.acceptance
},null,2));

if(!output.acceptance.pass)process.exitCode=2;
