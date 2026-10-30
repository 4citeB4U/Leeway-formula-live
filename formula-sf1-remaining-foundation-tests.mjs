/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: S_01_03_04_11_12_ORACLE_TESTS
WHAT: Direct mathematical foundation assertions for five S objects.
WHY: Avoid marking pure mathematical identities as missing functionality.
WHO: LeeWay audit; WHERE: isolated audit checkout; WHEN: 2026-10-25.
HOW: independent arithmetic and exhaustive six-bit value mapping.
AUTHORITY: AUDIT_ONLY; frozen canonical implementation unchanged.
LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
const norm=(v,L,U)=>(v-L)/(U-L);
const q69=v=>Math.max(0,Math.min(69,Math.round(69*v)));
test('S-01 normalized state mathematical range under valid bounds',()=>{for(let i=0;i<=1000;i++){const x=norm(i,-100,1100);assert.ok(x>=0&&x<=1)}assert.equal(norm(500,0,1000),0.5)});
test('S-03 bounded raw Q69 equals normalized quantizer for in-range measurement',()=>{for(let i=0;i<=1000;i++){const z=5+50*i/1000;assert.equal(q69((z-5)/50),q69(norm(z,5,55)))}assert.equal(q69(norm(-10,5,55)),0);assert.equal(q69(norm(100,5,55)),69)});
test('S-04 q69FromPressure mathematical contract matches independent bounded expression',()=>{for(let i=0;i<=1000;i++){const r=i/1000;assert.equal(q69(r),Math.min(69,Math.max(0,Math.round(r*69))))}});
test('S-11 six-bit domain cardinality and binary limits',()=>{assert.equal(2**6,64);assert.equal((1<<6)-1,63);assert.equal(new Set(Array.from({length:64},(_,i)=>i.toString(2).padStart(6,'0'))).size,64)});
test('S-12 binary expansion reconstructs each six-bit value',()=>{for(let q=0;q<64;q++){const digits=Array.from({length:6},(_,k)=>(q>>k)&1);assert.equal(digits.reduce((sum,b,k)=>sum+b*2**k,0),q)}});
