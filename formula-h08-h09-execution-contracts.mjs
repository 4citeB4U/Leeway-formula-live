/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: H08_H09_EXECUTION_CONTRACT_CHECK
WHAT: Test original LDWMD admission and GPU dispatcher recovery boundaries.
WHY: Establish actual implementation behavior without asserting missing canonical math.
WHO: LeeWay audit. WHERE: isolated audit checkout. WHEN: 2026-10-25.
HOW: import original contracts and exercise fail-closed paths with synthetic inputs.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
import {validateInferenceGrant,InferenceContractError} from '../LeeWay-Edge-GPU/core/inference-contract.mjs';
import {HybridDispatcher} from '../LeeWay-Edge-GPU/core/hybrid.dispatcher.js';
test('H-08 original LDWMD grant denies missing memory and owner request',()=>{assert.throws(()=>validateInferenceGrant(null,{},'x'),/INFERENCE_GRANT_SUBJECT_MISMATCH/)});
test('H-09 original dispatcher refuses unbound inference authorization',async()=>{const dispatcher=new HybridDispatcher({});await assert.rejects(()=>dispatcher.dispatchInference({type:'AI_INFERENCE',requestId:'r1',sessionId:'s1'},{}),e=>e instanceof InferenceContractError)});
test('H-09 original dispatcher routing distinguishes explicit compute capacity',()=>{const dispatcher=new HybridDispatcher({});assert.equal(dispatcher._selectPath({type:'COMPUTE'},{capability:'WEBGPU'}),'WEBGPU');assert.equal(dispatcher._selectPath({type:'COMPUTE'},{capability:'WEBGL'}),'WEBGL');assert.equal(dispatcher._selectPath({type:'COMPUTE'},{capability:'CPU'}),'CPU')});
