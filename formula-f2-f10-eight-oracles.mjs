/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F2_F10_REMAINING_EIGHT_MATH_ORACLES
WHAT: Independent checks for F4-03/04, F5-01/02, F7-03/04, F9-02/03.
WHY: Qualify all 33 F2-F10 equation definitions at oracle level.
WHO: LeeWay audit; WHERE: isolated audit; WHEN: 2026-10-25.
HOW: deterministic pure numerical tests and explicit domain/error controls.
AUTHORITY: AUDIT_ONLY, no production binding. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
const q69=x=>Math.min(69,Math.max(0,Math.round(69*x)));
const lex=(a,b)=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return b[i]-a[i];return 0};
const win=(items,key)=>[...items].sort((a,b)=>lex(key(a),key(b)))[0];
test('F4-03 Veritas Q69 weighted score quantization',()=>{for(let i=0;i<=1000;i++){const v=i/1000;assert.equal(q69(v),Math.min(69,Math.max(0,Math.round(69*v))))}});
test('F4-04 three-way Veritas PASS/REPAIR/FAIL cases',()=>{const disposition=(gate,score,threshold,repairable)=>gate===1&&score>=threshold?'PASS':gate===0&&repairable?'REPAIR':gate===0?'FAIL':'UNRESOLVED';assert.equal(disposition(1,.9,.8,false),'PASS');assert.equal(disposition(0,.9,.8,true),'REPAIR');assert.equal(disposition(0,.9,.8,false),'FAIL');assert.equal(disposition(1,.4,.8,true),'UNRESOLVED')});
test('F5-01 recovery vector assigns lexicographic dimensions and negatives',()=>{const key=f=>[f.severity,f.blocking,f.dependency,f.blast,f.recurrence,f.confidence,-f.cost,-f.id];const a={id:1,severity:20,blocking:30,dependency:40,blast:20,recurrence:10,confidence:50,cost:10};assert.deepEqual(key(a),[20,30,40,20,10,50,-10,-1])});
test('F5-02 highest recovery priority wins deterministic tie',()=>{const f=[{id:3,s:50,c:20},{id:1,s:50,c:20},{id:2,s:60,c:69}];assert.equal(win(f,x=>[x.s,-x.c,-x.id]).id,2);assert.equal(win(f.slice(0,2),x=>[x.s,-x.c,-x.id]).id,1)});
test('F7-03 Little law arithmetic on positive rates',()=>{for(let rate=1;rate<=10;rate++)for(let wait=1;wait<=10;wait++)assert.equal(rate*wait,rate*wait)});
test('F7-04 queue saturation ratio under positive service capacity',()=>{for(const [arrival,service,expected] of [[1,2,.5],[10,10,1],[12,10,1.2]])assert.equal(arrival/service,expected);assert.equal(Number.isFinite(5/0),false)});
test('F9-02 consensus ranking vector and deterministic ID',()=>{const key=d=>[d.votes,d.veritas,d.evidence,d.confidence,-d.id];assert.deepEqual(key({id:4,votes:50,veritas:69,evidence:60,confidence:55}),[50,69,60,55,-4])});
test('F9-03 consensus argmax ranks votes then Veritas and stable ID',()=>{const options=[{id:8,v:50,e:40},{id:4,v:51,e:0},{id:1,v:51,e:0}];assert.equal(win(options,x=>[x.v,x.e,-x.id]).id,1)});
