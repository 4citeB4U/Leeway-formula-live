/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F3_F4_F7_F8_PURE_EQUATION_CONTRACTS
WHAT: Independent mathematical contracts; no runtime binding or authorization.
WHY: Prove deterministic ordering, fail-closed weighted mean, queue priority and firing logic.
WHO: LeeWay owner audit. WHERE: isolated test file. WHEN: 2026-10-25.
HOW: Enumerated Boolean cases and adversarial lexicographic ties.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
const compare=(a,b)=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]>b[i]?-1:1;return 0};
const choose=(items,key)=>[...items].sort((a,b)=>compare(key(a),key(b)))[0];
const weighted=(w,q)=>{const d=w.reduce((a,b)=>a+b,0);if(d<=0)throw Error('ZERO_TOTAL_WEIGHT');if(w.length!==q.length||w.some(x=>x<0)||q.some(x=>x<0||x>1))throw Error('INVALID_EVIDENCE');return w.reduce((s,x,i)=>s+x*q[i],0)/d};
test('F3-01..03 seven-dimensional routing lexicographic preference and deterministic ID tie',()=>{const candidates=[{id:9,v:[69,69,60,60,0,0,0]},{id:2,v:[69,69,61,0,69,69,69]},{id:1,v:[69,69,61,0,69,69,69]}];const k=a=>[a.v[0],a.v[1],a.v[2],a.v[3],-a.v[4],-a.v[5],-a.v[6],-a.id];assert.equal(choose(candidates,k).id,1)});
test('F4-01 mandatory evidence product exhaustively enforces rejection',()=>{for(let n=0;n<256;n++){const a=Array.from({length:8},(_,i)=>(n>>i)&1);assert.equal(a.reduce((p,v)=>p*v,1),a.every(Boolean)?1:0)}});
test('F4-02 weighted evidence mean and zero-total fail-closed contract',()=>{assert.equal(weighted([1,3],[0,1]),.75);assert.equal(weighted([2,2],[.25,.75]),.5);assert.throws(()=>weighted([0,0],[1,1]),/ZERO_TOTAL_WEIGHT/)});
test('F7-01..02 queue priority order respects earliest high-priority dimension',()=>{const jobs=[{id:4,v:[5,5,0,0,0,3]},{id:7,v:[5,6,0,0,0,3]},{id:2,v:[5,6,0,0,0,3]}];const k=j=>[...j.v.slice(0,5),-j.v[5],-j.id];assert.equal(choose(jobs,k).id,2)});
test('F8-01..03 binary trigger, governance and constraint firing exhaustively',()=>{for(let m=0;m<32;m++){const a=Array.from({length:5},(_,i)=>(m>>i)&1);const fire=a.reduce((p,v)=>p*v,1);assert.equal(fire,a.every(Boolean)?1:0);assert.equal(69*fire,fire?69:0)}});
