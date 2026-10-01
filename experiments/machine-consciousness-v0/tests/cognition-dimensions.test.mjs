import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {simulateWorld} from '../simulator.mjs';
import {buildOperationalAwareness} from '../workspace-self-model.mjs';
import {DIMENSION_ORDER,verifyCognitionReceiptHash,calculateCognitionDimensions,calculateDimensionWindow} from '../cognition-dimensions.mjs';

function dropoutFor(scenario,cycle){
  if(scenario!=='module-dropout')return [];
  if(cycle%5===2)return ['belief','valuation'];
  if(cycle%11===7)return ['memory'];
  return [];
}
const awarenessFor=r=>buildOperationalAwareness(r,{dropoutModules:dropoutFor(r.scenario,r.cycle)});
const close=(a,b,tol=1e-12)=>Math.abs(a-b)<=tol;

test('dimension order matches candidate domain contract',()=>{
  assert.deepEqual(DIMENSION_ORDER,['belief_entropy_nats','precision_weighted_prediction_error','valence_free_energy_rate','belief_information_gain_nats','selected_policy_expected_free_energy','global_access_ratio']);
});

test('cognition receipt hash is independently verifiable',()=>{
  const r=simulateWorld({cycles:2,seed:20261001})[0];
  assert.equal(verifyCognitionReceiptHash(r),true);
  assert.equal(verifyCognitionReceiptHash({...r,cycle:99}),false);
});

test('all six dimensions recompute from underlying evidence',()=>{
  const rs=simulateWorld({worldIndex:2,scenario:'stationary',cycles:8,seed:20261001});
  for(let i=0;i<rs.length;i++){
    const calc=calculateCognitionDimensions({receipt:rs[i],previousReceipt:i?rs[i-1]:null,awareness:awarenessFor(rs[i])});
    for(const k of DIMENSION_ORDER)assert.ok(close(calc.dimensions[k],rs[i].metrics[k]),k);
    assert.equal(calc.formulaExecutionState,'NOT_EXECUTED');
  }
});

test('operational B comes from MC-G3 workspace and represents dropout',()=>{
  const rs=simulateWorld({worldIndex:3,scenario:'module-dropout',cycles:16,seed:20261001});
  const target=rs.find(r=>r.cycle%5===2);
  const calc=calculateCognitionDimensions({receipt:target,previousReceipt:rs[target.cycle-1],awareness:awarenessFor(target)});
  assert.equal(calc.dimensions.global_access_ratio,6/8);
});

test('REPLAY provenance is rejected as Formula-bridge cognition',()=>{
  const r=simulateWorld({cycles:2,seed:20261001})[0];
  const replay={...r,provenance:'REPLAY'};
  const {stateHash,...core}=replay;
  replay.stateHash=crypto.createHash('sha256').update(JSON.stringify(core)).digest('hex');
  assert.throws(()=>calculateCognitionDimensions({receipt:replay,awareness:awarenessFor(r)}),/COGNITION_PROVENANCE_NOT_ELIGIBLE_REPLAY/);
});

test('tampered receipt content is rejected by hash verification',()=>{
  const r=simulateWorld({cycles:2,seed:20261001})[0],bad=structuredClone(r);
  bad.cognitionView.posterior=[.99,.01];
  assert.throws(()=>calculateCognitionDimensions({receipt:bad,awareness:awarenessFor(r)}),/COGNITION_RECEIPT_HASH_INVALID/);
});

test('mismatched awareness state is rejected',()=>{
  const rs=simulateWorld({worldIndex:4,cycles:3,seed:20261001});
  assert.throws(()=>calculateCognitionDimensions({receipt:rs[1],previousReceipt:rs[0],awareness:awarenessFor(rs[2])}),/AWARENESS_CYCLE_HASH_MISMATCH/);
});

test('nonconsecutive previous receipt is rejected',()=>{
  const rs=simulateWorld({worldIndex:5,cycles:4,seed:20261001});
  assert.throws(()=>calculateCognitionDimensions({receipt:rs[3],previousReceipt:rs[0],awareness:awarenessFor(rs[3])}),/PREVIOUS_RECEIPT_NOT_CONSECUTIVE/);
});

test('16-cycle window is finite, ordered and Formula remains unexecuted',()=>{
  const rs=simulateWorld({worldIndex:6,scenario:'module-dropout',cycles:16,seed:20261001});
  const w=calculateDimensionWindow(rs,rs.map(awarenessFor));
  assert.equal(w.stateRows.length,16);
  assert.ok(w.stateRows.every(row=>row.length===6&&row.every(Number.isFinite)));
  assert.equal(w.formulaExecutionState,'NOT_EXECUTED');
});

test('window rejects wrong length',()=>{
  const rs=simulateWorld({cycles:15,seed:20261001});
  assert.throws(()=>calculateDimensionWindow(rs,rs.map(awarenessFor)),/REQUIRES_16_CYCLES/);
});
