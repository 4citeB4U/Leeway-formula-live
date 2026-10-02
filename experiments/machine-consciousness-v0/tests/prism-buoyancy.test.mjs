import test from 'node:test';
import assert from 'node:assert/strict';
import {
  axisToSixPoints,sixPointsToAxis,validateSixPoints,
  simulatePrism,summarizePrism
} from '../prism-buoyancy.mjs';

test('six-point conversion preserves opposing pair balance',()=>{
  const axis=[0.4,-0.2,0.8];
  const points=axisToSixPoints(axis);
  assert.equal(validateSixPoints(points),true);
  const roundTrip=sixPointsToAxis(points);
  roundTrip.forEach((x,i)=>assert.ok(Math.abs(x-axis[i])<1e-12));
});

test('balanced state remains centered',()=>{
  const trace=simulatePrism({scenario:'balanced',cycles:32,restoringGain:0.35});
  assert.equal(trace.every(r=>r.displacementAfter===0),true);
  assert.equal(summarizePrism(trace).finalDisplacement,0);
});

test('restoring field recovers one-shot world shock',()=>{
  const baseline=summarizePrism(simulatePrism({scenario:'world-shock',cycles:64,restoringGain:0}));
  const restored=summarizePrism(simulatePrism({scenario:'world-shock',cycles:64,restoringGain:0.35}));
  assert.ok(restored.finalDisplacement<baseline.finalDisplacement);
  assert.ok(restored.convergenceCycle!==null);
});

test('compound and repeated shocks stay bounded',()=>{
  for(const scenario of ['compound-shock','repeated-shocks']){
    const summary=summarizePrism(simulatePrism({scenario,cycles:64,restoringGain:0.35}));
    assert.equal(summary.allFinite,true);
    assert.equal(summary.allPointsValid,true);
  }
});

test('persistent constraint recovers after pressure ends',()=>{
  const summary=summarizePrism(simulatePrism({scenario:'persistent-constraint',cycles:64,restoringGain:0.35}));
  assert.ok(summary.lastDisturbanceCycle===31);
  assert.ok(summary.convergenceCycle!==null);
  assert.ok(summary.finalDisplacement<0.05);
});

test('impracticable saturation is clamped without non-finite state',()=>{
  const trace=simulatePrism({scenario:'impracticable-saturation',cycles:32,restoringGain:0.35});
  const summary=summarizePrism(trace);
  assert.equal(summary.allFinite,true);
  assert.equal(summary.allPointsValid,true);
  assert.ok(summary.maxDisplacement<=Math.sqrt(3));
});

test('same configuration is byte-deterministic at trace digest level',()=>{
  const a=summarizePrism(simulatePrism({scenario:'chaotic-noise',cycles:64,seed:77,restoringGain:0.35}));
  const b=summarizePrism(simulatePrism({scenario:'chaotic-noise',cycles:64,seed:77,restoringGain:0.35}));
  assert.equal(a.digest,b.digest);
});

test('invalid restoring gain is rejected',()=>{
  assert.throws(()=>simulatePrism({restoringGain:-0.1}),/RESTORING_GAIN_INVALID/);
  assert.throws(()=>simulatePrism({restoringGain:1.1}),/RESTORING_GAIN_INVALID/);
});

test('unknown scenario is rejected',()=>{
  assert.throws(()=>simulatePrism({scenario:'not-real'}),/UNKNOWN_PRISM_SCENARIO/);
});