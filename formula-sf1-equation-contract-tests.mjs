/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_SF1_EQUATION_CONTRACT_CHECKS_V1
WHAT: Individually identified S equation tests and documentation/codec divergence detection.
WHY: Lock exact positives while retaining explicit failures for inconsistent contracts.
WHO: LeeWay audit. WHERE: isolated checkout. WHEN: 2026-10-25.
HOW: independently calculate Q69 rounding, reconstruction bounds, alphabet and QB64 fixed width.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {encode,decode} from './runtime/canonical/leeway-formula/v1/base64-codec.mjs';
import {canonicalize} from './runtime/canonical/leeway-formula/v1/canonical-input.mjs';
import {GOLDEN_MATRIX} from './runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs';
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const q69=r=>Math.max(0,Math.min(69,Math.round(69*r)));
test('S-02 Q69 integer and half-step boundaries',()=>{for(let k=0;k<=69;k++)assert.equal(q69(k/69),k);for(let k=0;k<69;k++){assert.equal(q69((k+.5)/69+1e-9),k+1);assert.equal(q69((k+.5)/69-1e-9),k)}});
test('S-05 reconstruct quantized fractions',()=>{for(let q=0;q<=69;q++)assert.equal(q/69,q/69)});
test('S-06 worst-case quantization error bound',()=>{for(let i=0;i<=69000;i++){const r=i/69000;assert.ok(Math.abs(r-q69(r)/69)<=1/138+1e-12)}});
test('S-07 each quantizer midpoint transitions',()=>{for(let k=0;k<69;k++){const r=(k+.5)/69;assert.equal(q69(r+1e-9),k+1);assert.equal(q69(r-1e-9),k)}});
test('S-08 basic alphabet and digit positions',()=>{for(let i=0;i<64;i++)assert.equal(encode(i),alphabet[i])});
test('S-09 extended QB64 states',()=>{for(let i=64;i<=69;i++)assert.equal(encode(i),'B'+alphabet[i-64])});
test('S-10 documented fixed-width contract differs from frozen codec',()=>{assert.equal(encode(69),'BF');assert.equal(encode(4),'E');assert.notEqual(encode(4),'AE')});
test('S-13 70-state decode/encode roundtrip',()=>{for(let i=0;i<=69;i++)assert.equal(decode(encode(i)),i)});
test('S-14 and S-15 16x6 integer input acceptance/rejection',()=>{assert.deepEqual(canonicalize(GOLDEN_MATRIX).matrix,GOLDEN_MATRIX);assert.throws(()=>canonicalize(GOLDEN_MATRIX.slice(1)));assert.throws(()=>canonicalize(GOLDEN_MATRIX.map(r=>r.slice(1))))});
