import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateWorld} from '../simulator.mjs';
import {runLearningTrace} from '../memory-learning.mjs';
import {
  REQUIRED_WORKSPACE_MODULES,createWorkspaceState,createWorkspaceSession,
  submitAcknowledgement,sealWorkspace,acknowledgeWorkspace,verifyWorkspace,
  createRuntimeContext,createSelfModel,inspectRuntimeFacts,evaluateSelfModel,
  verifySelfModel,buildOperationalAwareness
} from '../workspace-self-model.mjs';

const receipt=()=>simulateWorld({worldIndex:4,scenario:'stationary',cycles:8,seed:20261001})[5];
const EXPECTED_MODULES=[
  'perception','belief','prediction','valuation',
  'policy','memory','self-model','veritas'
];

test('required workspace modules match the MC-3 contract exactly',()=>{
  assert.deepEqual(REQUIRED_WORKSPACE_MODULES,EXPECTED_MODULES);
});

test('same receipt and context produce identical cycle/workspace hashes',()=>{
  const r=receipt(),a=createWorkspaceState(r),b=createWorkspaceState(r);
  assert.equal(a.cycleStateHash,r.stateHash);
  assert.deepEqual(a,b);
});

test('all required modules acknowledge the exact cognition cycleStateHash',()=>{
  const ws=createWorkspaceState(receipt());
  const b=acknowledgeWorkspace(ws);
  assert.equal(b.complete,true);
  assert.equal(b.globalAccessRatio,1);
  assert.deepEqual(b.acknowledgements.map(a=>a.module),EXPECTED_MODULES);
  assert.ok(b.acknowledgements.every(a=>a.cycleStateHash===ws.cycleStateHash));
  assert.ok(b.acknowledgements.every(a=>a.workspaceHash===ws.workspaceHash));
  assert.equal(verifyWorkspace(ws,b),true);
});

test('module dropout lowers operational global access and remains verifiable',()=>{
  const ws=createWorkspaceState(receipt());
  const b=acknowledgeWorkspace(ws,{dropoutModules:['belief','valuation']});
  assert.equal(b.complete,false);
  assert.equal(b.globalAccessRatio,6/8);
  assert.deepEqual(b.missingModules,['belief','valuation']);
  assert.equal(verifyWorkspace(ws,b),true);
});

test('wrong state hash acknowledgement is rejected',()=>{
  const ws=createWorkspaceState(receipt()),s=createWorkspaceSession(ws);
  assert.deepEqual(
    submitAcknowledgement(s,{module:'perception',cycleStateHash:'f'.repeat(64)}),
    {accepted:false,reason:'STATE_HASH_MISMATCH'}
  );
});

test('duplicate and unknown module acknowledgements are rejected',()=>{
  const ws=createWorkspaceState(receipt()),s=createWorkspaceSession(ws);
  assert.equal(submitAcknowledgement(s,{module:'memory'}).accepted,true);
  assert.deepEqual(submitAcknowledgement(s,{module:'memory'}),{accepted:false,reason:'DUPLICATE_MODULE'});
  assert.deepEqual(submitAcknowledgement(s,{module:'imaginary-module'}),{accepted:false,reason:'UNKNOWN_MODULE'});
});

test('acknowledgement after workspace seal is rejected',()=>{
  const ws=createWorkspaceState(receipt()),s=createWorkspaceSession(ws);
  submitAcknowledgement(s,{module:'perception'});
  const b=sealWorkspace(s);
  assert.equal(b.sealed,true);
  assert.deepEqual(submitAcknowledgement(s,{module:'belief'}),{accepted:false,reason:'WORKSPACE_SEALED'});
});

test('cross-state acknowledgement fails broadcast verification',()=>{
  const a=createWorkspaceState(receipt());
  const other=createWorkspaceState(simulateWorld({worldIndex:5,scenario:'stationary',cycles:8,seed:20261001})[5]);
  const b=acknowledgeWorkspace(a);
  const badAck={...b.acknowledgements[0],cycleStateHash:other.cycleStateHash};
  const bad={...b,acknowledgements:[badAck,...b.acknowledgements.slice(1)]};
  assert.equal(verifyWorkspace(a,bad),false);
});

test('factual self model reaches accuracy 1.0 against independent runtime facts',()=>{
  const ws=createWorkspaceState(receipt()),b=acknowledgeWorkspace(ws);
  const ctx=createRuntimeContext();
  const self=createSelfModel({workspaceState:ws,broadcast:b,runtimeContext:ctx});
  const facts=inspectRuntimeFacts({workspaceState:ws,broadcast:b,runtimeContext:ctx});
  const e=evaluateSelfModel(self,facts);
  assert.equal(e.accuracy,1);
  assert.equal(e.hashValid,true);
  assert.deepEqual(e.mismatches,[]);
  assert.equal(verifySelfModel(self,facts),true);
});

test('deliberately false authority self-claim is detected',()=>{
  const ws=createWorkspaceState(receipt()),b=acknowledgeWorkspace(ws);
  const ctx=createRuntimeContext();
  const self=createSelfModel({workspaceState:ws,broadcast:b,runtimeContext:ctx});
  const facts=inspectRuntimeFacts({workspaceState:ws,broadcast:b,runtimeContext:ctx});
  const falseSelf=structuredClone(self);
  falseSelf.claims.authority.value.authorityClass='ROOT';
  const e=evaluateSelfModel(falseSelf,facts);
  assert.ok(e.accuracy<1||!e.hashValid);
  assert.equal(verifySelfModel(falseSelf,facts),false);
});

test('operational awareness binds semantic/memory hashes and replaces synthetic B',()=>{
  const receipts=simulateWorld({worldIndex:12,scenario:'module-dropout',cycles:16,seed:20261001});
  const original=JSON.stringify(receipts);
  const learning=runLearningTrace(receipts);
  const awareness=buildOperationalAwareness(receipts.at(-1),{
    semanticModelHash:learning.finalModel.modelHash,
    memoryHeadHash:learning.memory.headHash,
    dropoutModules:['belief']
  });
  assert.equal(awareness.workspaceVerified,true);
  assert.equal(awareness.selfModelVerified,true);
  assert.equal(awareness.selfModelEvaluation.accuracy,1);
  assert.equal(awareness.awarenessMetrics.global_access_ratio,7/8);
  assert.equal(awareness.awarenessMetrics.source_global_access_ratio,receipts.at(-1).metrics.global_access_ratio);
  assert.equal(awareness.selfModel.claims.resources.value.semanticModelHash,learning.finalModel.modelHash);
  assert.equal(awareness.selfModel.claims.resources.value.memoryHeadHash,learning.memory.headHash);
  assert.equal(JSON.stringify(receipts),original);
});

test('Formula remains unexecuted throughout MC-3 awareness layer',()=>{
  const a=buildOperationalAwareness(receipt());
  assert.equal(a.workspaceState.formulaExecutionState,'NOT_EXECUTED');
  assert.equal(a.selfModel.formula.executionState,'NOT_EXECUTED');
  assert.equal(a.selfModel.claims.authority.value.formulaExecutionState,'NOT_EXECUTED');
});
