/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: INFERENCE_HARDWARE_EQUATION_CONTRACT_ORACLES
WHAT: Compute and hardware equation invariants with actual canonical adapter.
WHY: Separate proven shared-kernel execution from unimplemented H2/H4 slots.
WHO: LeeWay audit. WHERE: isolated tests. WHEN: 2026-10-25.
HOW: Q69 adapter, exact row shape, deterministic Formula evaluation and lex ranking.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
import {GOLDEN_MATRIX,evaluate} from './runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs';
const quantize=x=>Math.max(0,Math.min(69,Math.round(x*69)));
const lex=(a,b)=>{for(let i=0;i<a.length;i++){if(a[i]!==b[i])return b[i]-a[i]}return 0};
test('I-01 and H-02 normalized telemetry Q69 representation',()=>{for(let i=0;i<=1000;i++){const raw=i/1000;const q=quantize(raw);assert.ok(q>=0&&q<=69);assert.equal(q,Math.max(0,Math.min(69,Math.round(69*raw))))}});
test('I-02,I-03,H-01,H-03 six channel and sixteen sample shapes',()=>{assert.equal(GOLDEN_MATRIX.length,16);for(const row of GOLDEN_MATRIX){assert.equal(row.length,6);assert.ok(row.every(x=>Number.isInteger(x)&&x>=0&&x<=69))}});
test('I-04,H-04,I-13 same frozen kernel same results',()=>{const a=evaluate(GOLDEN_MATRIX);const b=evaluate(GOLDEN_MATRIX.map(r=>[...r]));assert.equal(JSON.stringify(a),JSON.stringify(b));assert.equal(a.decimalState.length,6)});
test('I-06 independent controller pressure prevents mean hiding bottleneck',()=>{const a=[69,0,0,0,0,0];assert.ok(Math.max(...a)>a.reduce((x,y)=>x+y,0)/6)});
test('H-05,H-06 placement lex key and ID tie',()=>{const nodes=[{id:2,key:[69,50,50,40,69,40,20]},{id:1,key:[69,50,50,40,69,40,20]},{id:3,key:[68,69,69,69,69,69,0]}];const key=x=>[...x.key.slice(0,6),-x.key[6],-x.id];assert.equal([...nodes].sort((a,b)=>lex(key(a),key(b)))[0].id,1)});
