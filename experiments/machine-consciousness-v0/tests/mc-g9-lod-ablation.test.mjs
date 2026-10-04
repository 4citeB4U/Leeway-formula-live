import test from 'node:test';
import assert from 'node:assert/strict';
import {runLodAblation} from '../mc-g9-lod-ablation.mjs';

test('LOD ablation is deterministic for fixed seed',()=>{
 const a=runLodAblation({trials:256,capabilities:246,seed:77});
 const b=runLodAblation({trials:256,capabilities:246,seed:77});
 assert.deepEqual(a,b);
});

test('LOD treatment preserves task success in declared fixture',()=>{
 const r=runLodAblation({trials:512,capabilities:246,seed:88});
 assert.equal(r.success.control,1);
 assert.equal(r.success.treatment,1);
});

test('LOD treatment must clear the 20 percent gate with positive bootstrap lower bound',()=>{
 const r=runLodAblation({trials:1024,capabilities:246,seed:99});
 assert.equal(r.status,'VERIFIED_IMPROVEMENT');
 for(const metric of Object.values(r.metrics)){
   assert.ok(metric.reductionPct>=20);
   assert.ok(metric.bootstrap95.low>0);
 }
});
