import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateWorld} from '../simulator.mjs';

const opts={worldIndex:7,scenario:'stationary',cycles:24,seed:20261001};

test('fixed seed and config replay exactly',()=>{
  const a=simulateWorld(opts),b=simulateWorld(opts);
  assert.deepEqual(a,b);
});

test('belief probabilities normalize and remain finite',()=>{
  for(const r of simulateWorld(opts)){
    const p=r.cognitionView.posterior;
    assert.ok(p.every(Number.isFinite));
    assert.ok(p.every(x=>x>=0&&x<=1));
    assert.ok(Math.abs(p.reduce((a,b)=>a+b,0)-1)<1e-12);
  }
});

test('prediction and observation are distinct receipt fields',()=>{
  for(const r of simulateWorld(opts)){
    assert.equal(typeof r.cognitionView.prediction.redProbability,'number');
    assert.equal(typeof r.cognitionView.observation.red,'boolean');
    assert.notEqual(r.cognitionView.prediction,r.cognitionView.observation);
  }
});

test('requested action and result are distinct',()=>{
  for(const r of simulateWorld(opts)){
    assert.ok(['inspect','commit'].includes(r.execution.requestedAction));
    assert.ok(r.execution.result && typeof r.execution.result.preferred==='boolean');
  }
});

test('all six candidate metrics are finite and access ratio is bounded',()=>{
  for(const r of simulateWorld({...opts,scenario:'module-dropout'})){
    assert.equal(Object.keys(r.metrics).length,6);
    for(const [k,v] of Object.entries(r.metrics)) assert.ok(Number.isFinite(v),k);
    assert.ok(r.metrics.global_access_ratio>=0&&r.metrics.global_access_ratio<=1);
  }
});

test('simulated provenance is immutable in every cycle',()=>{
  for(const r of simulateWorld(opts)) assert.equal(r.provenance,'SIMULATED');
});

test('every cognition cycle carries an immutable receipt hash',()=>{
  for(const r of simulateWorld(opts)) assert.match(r.stateHash,/^[a-f0-9]{64}$/);
});