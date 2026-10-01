import test from 'node:test';
import assert from 'node:assert/strict';
import {rankDreamCandidates,dreamReplay,selfAwarenessCheck} from '../dream-self-math.mjs';

test('dream queue ranks by expected value of backup',()=>{
  const ranked=rankDreamCandidates([
    {sourceHash:'a'.repeat(64),gain:0.2,need:0.9},
    {sourceHash:'b'.repeat(64),gain:0.8,need:0.8},
    {sourceHash:'c'.repeat(64),gain:0.9,need:0.1}
  ]);
  assert.equal(ranked[0].sourceHash,'b'.repeat(64));
  assert.ok(ranked[0].evb>ranked[1].evb);
});

test('dream replay permanently preserves simulated provenance and source hash',()=>{
  const source={sourceHash:'d'.repeat(64),gain:0.7,need:0.7};
  const before=JSON.stringify(source);
  const dream=dreamReplay(source,{alternatePolicy:'inspect',predictedOutcome:{preferred:true}});
  assert.equal(dream.provenance,'SIMULATED_DREAM');
  assert.equal(dream.sourceHash,source.sourceHash);
  assert.equal(dream.admittedToRealMemory,false);
  assert.match(dream.dreamHash,/^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(source),before);
});

test('self awareness consistency falls as predicted and observed self-state diverge',()=>{
  const exact=selfAwarenessCheck([0.8,0.2],[0.8,0.2]);
  const mild=selfAwarenessCheck([0.8,0.2],[0.65,0.35]);
  const far=selfAwarenessCheck([0.8,0.2],[0.2,0.8]);
  assert.ok(exact.consistency>mild.consistency);
  assert.ok(mild.consistency>far.consistency);
});

test('self awareness math never converts inconsistency into certainty',()=>{
  const r=selfAwarenessCheck([0.95,0.05],[0.05,0.95]);
  assert.ok(r.consistency<0.6);
  assert.ok(r.consistency>=0);
});
