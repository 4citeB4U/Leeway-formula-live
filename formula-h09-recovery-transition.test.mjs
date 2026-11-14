/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: H09_ORIGINAL_DISPATCH_RECOVERY_TEST
WHAT: Exercise typed GPU-loss recovery using original dispatcher and independent reference.
WHY: Verify actual recovery transitions, not only rejection paths.
WHO: LeeWay audit; WHERE: isolated synthetic runtime; WHEN: 2026-10-25.
HOW: Inject recoverable and nonrecoverable errors; require admitted independent result.
AUTHORITY: AUDIT_ONLY; no physical GPU or production admission. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
import {HybridDispatcher} from '../LeeWay-Edge-GPU/core/hybrid.dispatcher.js';
import {TensorError} from '../LeeWay-Edge-GPU/dispatch/tensor-contract.mjs';
const input={operation:'MATMUL_BIAS_RELU_V1',m:1,k:1,n:1,A:new Float32Array([3]),B:new Float32Array([4]),bias:new Float32Array([2]),activation:'identity'};
const controller={approve:async()=>true},verify=async(result)=>({valid:result[0]===14,method:'INDEPENDENT_SCALAR_REFERENCE'});
test('H-09 recoverable GPU loss routes through approved CPU fallback and verifies answer',async()=>{let gpu=0,cpu=0;const dispatcher=new HybridDispatcher({webgpu:{run:async()=>{gpu++;throw new TensorError('GPU_DEVICE_LOST')}},cpu:{run:async()=>{cpu++;return new Float32Array([14])}}});const ctx={capability:'WEBGPU',allowCpuFallback:true,controller,verify};const result=await dispatcher.dispatchTensor({type:'TENSOR',input},ctx);assert.equal(result.backend,'CPU');assert.equal(result.recoveredFrom,'GPU_DEVICE_LOST');assert.equal(result.result[0],14);assert.equal(result.verification.valid,true);assert.equal(gpu,1);assert.equal(cpu,1);assert.equal(ctx.attempts.length,2)});
test('H-09 recovery denied when fallback policy is false',async()=>{let cpu=0;const dispatcher=new HybridDispatcher({webgpu:{run:async()=>{throw new TensorError('GPU_DEVICE_LOST')}},cpu:{run:async()=>{cpu++;return new Float32Array([14])}}});await assert.rejects(()=>dispatcher.dispatchTensor({type:'TENSOR',input},{capability:'WEBGPU',allowCpuFallback:false,controller,verify}),/GPU_DEVICE_LOST/);assert.equal(cpu,0)});
test('H-09 unverified fallback result fails closed',async()=>{const dispatcher=new HybridDispatcher({webgpu:{run:async()=>{throw new TensorError('GPU_ALLOCATION_FAILED')}},cpu:{run:async()=>new Float32Array([99])}});await assert.rejects(()=>dispatcher.dispatchTensor({type:'TENSOR',input},{capability:'WEBGPU',allowCpuFallback:true,controller,verify}),/TENSOR_REFERENCE_MISMATCH/)});
