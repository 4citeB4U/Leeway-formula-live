/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_SF1_INDEPENDENT_ORACLES_V1
WHAT: Independent checks for canonical Base64, rational arithmetic, canonical input and F1 rank invariants.
WHY: Test against separate simple numerical definitions without modifying frozen sources.
WHO: LeeWay audit; WHERE: isolated local proof suite; WHEN: 2026-10-25.
HOW: Independent integer arithmetic, known vectors and metamorphic tests.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {encode,decode} from './runtime/canonical/leeway-formula/v1/base64-codec.mjs';
import {rat,rAdd,rSub,rMul,rDiv,rCmp} from './runtime/canonical/leeway-formula/v1/rational.mjs';
import {canonicalize} from './runtime/canonical/leeway-formula/v1/canonical-input.mjs';
import {evaluate,GOLDEN_MATRIX,GOLDEN_DECIMAL} from './runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs';
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function independentEncode(n){if(n===0)return 'A';let s='';while(n){s=alphabet[n%64]+s;n=Math.floor(n/64)}return s}
test('S Base64 all 70 Q states and boundary transitions',()=>{for(let n=0;n<=69;n++){assert.equal(encode(n),independentEncode(n));assert.equal(decode(encode(n)),n)}assert.equal(encode(64),'BA');assert.equal(encode(69),'BF')});
test('S invalid Base64 inputs fail closed',()=>{for(const x of [-1,1.5,NaN])assert.throws(()=>encode(x));for(const x of ['', '?', ' '])assert.throws(()=>decode(x))});
test('S canonical input identity and reject invalid dimensions',()=>{const original=GOLDEN_MATRIX.map(r=>[...r]);assert.deepEqual(canonicalize(original).matrix,original);assert.throws(()=>canonicalize(original.slice(1)));assert.throws(()=>canonicalize(original.map(r=>r.slice(1))))});
test('F1 rational exactness against independent integer equalities',()=>{const a=rat(1,3),b=rat(1,6);assert.equal(rAdd(a,b).toJSON(),'1/2');assert.equal(rSub(a,b).toJSON(),'1/6');assert.equal(rMul(a,b).toJSON(),'1/18');assert.equal(rDiv(a,b).toJSON(),'2');assert.equal(rCmp(rat(2,3),rat(4,6)),0);assert.throws(()=>rat(1,0));assert.throws(()=>rDiv(a,rat(0)))});
test('F1 original golden output remains fixed',()=>{assert.deepEqual(evaluate(GOLDEN_MATRIX).decimalState,GOLDEN_DECIMAL)});
test('F1 deterministic rerun identical serialized output',()=>{const a=evaluate(GOLDEN_MATRIX),b=evaluate(GOLDEN_MATRIX);assert.equal(JSON.stringify(a),JSON.stringify(b))});
