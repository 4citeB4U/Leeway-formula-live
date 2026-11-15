import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {GOLDEN_MATRIX} from '../runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs';
test('G3 builder and negative handoff gates are part of normal test discovery',async()=>{
 await import('../runtime/canonical/leeway-formula/v1/tests/g3-evidence-bundle-v1.mjs');
 await import('../runtime/canonical/leeway-formula/v1/tests/g3-g4-provider-handoff-v1.mjs');
});
test('G3 keeps the exact execution when a later evaluation replaces lastResult',async()=>{
 const base=process.env.FORMULA_TEST_BASE_URL;
 assert(base,'run through tests/run-live-tests.mjs');
 const post=async(route,body)=>{const r=await fetch(`${base}/runtime/formula/v1/${route}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});return{status:r.status,body:await r.json()};};
 const first=(await post('evaluate',{adapterId:'raw-base64-v1',input:{matrix:GOLDEN_MATRIX}})).body;
 const second=structuredClone(GOLDEN_MATRIX);second[0][0]+=1;
 await post('evaluate',{adapterId:'raw-base64-v1',input:{matrix:second}});
 const sha=s=>createHash('sha256').update(s).digest('hex');
 const input={requestId:randomUUID(),producer:'formula-regression',target:{repository:'Formula',paths:['test.mjs']},formulaExecution:{executionId:first.hostTraceId,inputHash:first.inputHash,resultHash:first.resultHash},observation:{preStateSha256:sha('before'),postStateSha256:sha('after'),commandSha256:sha('command'),stdoutSha256:sha('output'),exitCode:0,observedAt:new Date().toISOString()}};
 const result=await post('g3-evidence-bundles',input);assert.equal(result.status,202);assert.equal(result.body.acceptanceVector.formula.executionId,first.hostTraceId);
 const lookup=await(await fetch(`${base}/runtime/formula/v1/executions/${first.hostTraceId}`)).json();assert.equal(lookup.inputHash,first.inputHash);
 input.formulaExecution.resultHash=sha('forged');assert.equal((await post('g3-evidence-bundles',input)).status,400);
});
