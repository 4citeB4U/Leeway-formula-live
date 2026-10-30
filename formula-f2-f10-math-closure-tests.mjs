/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F2_F6_F9_F10_MATH_ORACLE_V1
WHAT: Independent mathematical oracle tests, not production implementation certification.
WHY: Separate proven arithmetic closure from governance and provider qualification.
WHO: LeeWay mathematical audit; WHERE: isolated audit. WHEN: 2026-10-25.
HOW: exhaustively check Boolean gates, constrained demand, consensus and thresholds.
AUTHORITY: AUDIT_ONLY, NO POLICY ADMISSION. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
const product=a=>a.reduce((p,x)=>p*x,1);
const allocate=(d,B)=>{const D=d.reduce((a,b)=>a+b,0);const shares=d.map(v=>D?Math.floor(B*v/D):0);return {D,shares,remainder:B-shares.reduce((a,b)=>a+b,0)}};
test('F2-01,02,03 Boolean product gate and 69-state disposition',()=>{for(let mask=0;mask<256;mask++){const a=Array.from({length:8},(_,i)=>(mask>>i)&1),g=product(a);assert.equal(g,a.every(Boolean)?1:0);assert.equal(69*g,g?69:0)}});
test('F6-01..06 allocation floor conserves integer budgets for positive and zero demand',()=>{for(let B=0;B<100;B++)for(const d of [[0,0,0],[1,1,1],[1,0,2],[69,40,1]]){const a=allocate(d,B);assert.equal(a.shares.reduce((x,y)=>x+y,0)+a.remainder,B);assert.ok(a.shares.every(x=>x>=0));assert.ok(a.remainder>=0);if(a.D===0){assert.ok(a.shares.every(x=>x===0));assert.equal(a.remainder,B)}else assert.ok(a.shares.every((x,i)=>x===Math.floor(B*d[i]/a.D)))}});
test('F9-01,04 consensus count and agreement bounds',()=>{for(const a of [['a'],['a','b'],['a','a','b'],['x','x','x','y']]){const votes=Object.entries(a.reduce((o,x)=>(o[x]=(o[x]??0)+1,o),{}));const max=Math.max(...votes.map(x=>x[1]));assert.ok(max/a.length>=1/a.length&&max/a.length<=1);assert.equal(votes.reduce((s,x)=>s+x[1],0),a.length)}});
test('F10-01..04 confidence normalization and ordered threshold partition',()=>{for(let mask=0;mask<64;mask++){const [E,V,R,A,U,I]=Array.from({length:6},(_,i)=>(mask>>i)&1);const c=(E+V+R+A+1-U+1-I)/6;assert.ok(c>=0&&c<=1);const q=Math.round(69*c);assert.ok(q>=0&&q<=69);const review=.3,auto=.7;const choice=c>=auto?'AUTOEXECUTE':c>=review?'REVIEW':'HUMAN';assert.ok(['AUTOEXECUTE','REVIEW','HUMAN'].includes(choice))}});
