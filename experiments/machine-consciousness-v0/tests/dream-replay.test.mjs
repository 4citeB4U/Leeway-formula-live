import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateWorld} from '../simulator.mjs';
import {
  REPLAY_MODES,runReplayExperiment,verifyReplayLedger,relativeImprovement,
  updateSemanticModelFromReplay
} from '../dream-replay.mjs';
import {createSemanticModel} from '../memory-learning.mjs';

const receipts=()=>simulateWorld({worldIndex:19,scenario:'changing',cycles:64,seed:20261001});

test('all four replay modes are explicit',()=>{
  assert.deepEqual(REPLAY_MODES,['NONE','RANDOM','RECENCY','EVB']);
});

test('NONE creates no dream receipts',()=>{
  const r=runReplayExperiment(receipts(),{mode:'NONE'});
  assert.equal(r.replayCount,0);
  assert.equal(r.replayEvents.length,0);
  assert.equal(r.formulaExecutionState,'NOT_EXECUTED');
});

test('dream receipts are REPLAY and permanently point to immutable source hashes',()=>{
  const r=runReplayExperiment(receipts(),{mode:'EVB'});
  assert.ok(r.replayEvents.length>0);
  assert.ok(r.replayEvents.every(e=>e.provenance==='REPLAY'));
  assert.ok(r.replayEvents.every(e=>/^[a-f0-9]{64}$/.test(e.sourceStateHash)));
  assert.equal(verifyReplayLedger(r.replayLedger),true);
});

test('counterfactual branches are explicitly excluded from external history',()=>{
  const r=runReplayExperiment(receipts(),{mode:'EVB'});
  assert.ok(r.replayEvents.every(e=>e.counterfactual.kind==='MODEL_COUNTERFACTUAL'));
  assert.ok(r.replayEvents.every(e=>e.counterfactual.admittedAsExternalHistory===false));
  assert.equal(r.falseRealMemoryCount,0);
});

test('replay never mutates source cognition receipts',()=>{
  const src=receipts(),before=JSON.stringify(src);
  const r=runReplayExperiment(src,{mode:'RECENCY'});
  assert.equal(r.sourceReceiptsUnchanged,true);
  assert.equal(JSON.stringify(src),before);
});

test('same source and seed reproduce identical EVB replay',()=>{
  const a=runReplayExperiment(receipts(),{mode:'EVB',seed:77});
  const b=runReplayExperiment(receipts(),{mode:'EVB',seed:77});
  assert.deepEqual(a.replayEvents,b.replayEvents);
  assert.equal(a.replayLedger.headHash,b.replayLedger.headHash);
  assert.deepEqual(a.holdoutLoss,b.holdoutLoss);
});

test('RANDOM replay is deterministic for a fixed seed',()=>{
  const a=runReplayExperiment(receipts(),{mode:'RANDOM',seed:99});
  const b=runReplayExperiment(receipts(),{mode:'RANDOM',seed:99});
  assert.deepEqual(a.replayEvents,b.replayEvents);
});

test('EVB priorities are finite and non-negative',()=>{
  const r=runReplayExperiment(receipts(),{mode:'EVB'});
  assert.ok(r.replayEvents.every(e=>Number.isFinite(e.priority)&&e.priority>=0));
});

test('Formula remains unexecuted in every replay mode',()=>{
  for(const mode of REPLAY_MODES){
    const r=runReplayExperiment(receipts(),{mode});
    assert.equal(r.formulaExecutionState,'NOT_EXECUTED');
  }
});

test('replay result exposes held-out predictive loss for baseline comparison',()=>{
  const base=runReplayExperiment(receipts(),{mode:'NONE'});
  const evb=runReplayExperiment(receipts(),{mode:'EVB'});
  for(const k of ['sensorNll','transitionNll','combinedNll']){
    assert.ok(Number.isFinite(base.holdoutLoss[k]));
    assert.ok(Number.isFinite(evb.holdoutLoss[k]));
  }
  assert.ok(Number.isFinite(relativeImprovement(base.holdoutLoss,evb.holdoutLoss)));
});


test('offline replay reinforces selected evidence without chronological forgetting',()=>{
  const source=receipts()[0];
  const model=createSemanticModel({forgettingFactor:.5});
  const untouchedBefore=model.transitionCounts.commit[0][0];
  const matchedBefore=model.sensorCounts[0]+model.sensorCounts[1];
  const out=updateSemanticModelFromReplay(model,source);
  assert.equal(out.chronologicalForgettingApplied,false);
  assert.equal(out.updateClass,'OFFLINE_REPLAY_REINFORCEMENT');
  assert.equal(model.transitionCounts.commit[0][0],untouchedBefore);
  assert.equal(model.sensorCounts[0]+model.sensorCounts[1],matchedBefore+1);
});
