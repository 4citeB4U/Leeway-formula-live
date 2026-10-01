import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateWorld} from '../simulator.mjs';
import {runLearningTrace} from '../memory-learning.mjs';
import {
  REQUIRED_WORKSPACE_MODULES,createWorkspaceState,acknowledgeWorkspace,
  verifyWorkspace,createSelfModel,inspectRuntimeFacts,verifySelfModel,
  buildOperationalAwareness
} from '../workspace-self-model.mjs';

const receipt=()=>simulateWorld({worldIndex:4,scenario:'stationary',cycles:8,seed:20261001})[5];

test('same receipt and context produce identical workspace state hash',()=>{
  const r=receipt();
  assert.deepEqual(createWorkspaceState(r),createWorkspaceState(r));
});

test('all required modules acknowledge exactly the same workspace state hash',()=>{
  const ws=createWorkspaceState(receipt());
  const b=acknowledgeWorkspace(ws);
  assert.equal(b.complete,true);
  assert.equal(b.globalAccessRatio,1);
  assert.deepEqual(b.acknowledgements.map(a=>a.module),REQUIRED_WORKSPACE_MODULES);
  assert.ok(b.acknowledgements.every(a=>a.workspaceStateHash===ws.workspaceStateHash));
  assert.equal(verifyWorkspace(ws,b),true);
});

test('module dropout lowers global access and remains verifiable',()=>{
  const ws=createWorkspaceState(receipt());
  const b=acknowledgeWorkspace(ws,{dropoutModules:['learning','memory']});
  assert.equal(b.complete,false);
  assert.equal(b.globalAccessRatio,5/7);
  assert.equal(verifyWorkspace(ws,b),true);
});

test('cross-state acknowledgement is rejected',()=>{
  const a=createWorkspaceState(receipt());
  const r2=simulateWorld({worldIndex:5,scenario:'stationary',cycles:8,seed:20261001})[5];
  const bState=createWorkspaceState(r2);
  const broadcast=acknowledgeWorkspace(a);
  const bad={...broadcast,acknowledgements:broadcast.acknowledgements.map((x,i)=>i?x:{...x,workspaceStateHash:bState.workspaceStateHash})};
  assert.equal(verifyWorkspace(a,bad),false);
});

test('factual self model exactly matches independently inspected runtime facts',()=>{
  const r=receipt(),ws=createWorkspaceState(r),b=acknowledgeWorkspace(ws);
  const self=createSelfModel({workspaceState:ws,broadcast:b});
  const facts=inspectRuntimeFacts({workspaceState:ws,broadcast:b,selfModel:self});
  assert.equal(verifySelfModel(self,facts),true);
  assert.equal(self.formula.executionState,'NOT_EXECUTED');
  assert.equal(self.sourceProvenance,'SIMULATED');
});

test('false self claim fails verification',()=>{
  const r=receipt(),ws=createWorkspaceState(r),b=acknowledgeWorkspace(ws);
  const self=createSelfModel({workspaceState:ws,broadcast:b});
  const facts=inspectRuntimeFacts({workspaceState:ws,broadcast:b,selfModel:self});
  const falseSelf={...self,authority:'ROOT'};
  assert.equal(verifySelfModel(falseSelf,facts),false);
});

test('operational awareness can bind semantic model and episodic memory hashes without mutating source receipt',()=>{
  const receipts=simulateWorld({worldIndex:12,scenario:'noisy',cycles:16,seed:20261001});
  const original=JSON.stringify(receipts);
  const learning=runLearningTrace(receipts);
  const awareness=buildOperationalAwareness(receipts.at(-1),{
    semanticModelHash:learning.finalModel.modelHash,
    memoryHeadHash:learning.memory.headHash
  });
  assert.equal(awareness.workspaceVerified,true);
  assert.equal(awareness.selfModelVerified,true);
  assert.equal(awareness.selfModel.semanticModelHash,learning.finalModel.modelHash);
  assert.equal(awareness.selfModel.memoryHeadHash,learning.memory.headHash);
  assert.equal(JSON.stringify(receipts),original);
});

test('Formula remains unexecuted throughout MC-3 awareness layer',()=>{
  const a=buildOperationalAwareness(receipt());
  assert.equal(a.workspaceState.formulaExecutionState,'NOT_EXECUTED');
  assert.equal(a.selfModel.formula.executionState,'NOT_EXECUTED');
});
