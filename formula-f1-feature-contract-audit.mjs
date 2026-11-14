/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_F1_DOCUMENTED_VS_FROZEN_FEATURES
WHAT: Verify individual F1 feature contracts against independent arithmetic and report divergences.
WHY: Preserve passing evidence without hiding mathematically different historical equations.
WHO: LeeWay audit. WHERE: isolated audit checkout. WHEN: 2026-10-25.
HOW: compare rational features to independently computed expected values.
AUTHORITY: AUDIT_ONLY; frozen kernel unmodified. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {computeFeatures,GOLDEN_MATRIX,FEATURE_ORDER,normalizeFeatures,computeScores,rankCandidates} from './runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs';
const X=GOLDEN_MATRIX,f=computeFeatures(X),value=r=>Number(r.n)/Number(r.d),tol=1e-10;
const occurrences=x=>X.flatMap((r,i)=>r.includes(x)?[i+1]:[]);
const freq=x=>X.flat().filter(y=>y===x).length;
const mean=727/24;
const expected=x=>{const t=occurrences(x),n=t.length,F=freq(x),G=n?16-t.at(-1):16,R=n?t.at(-1)/16:0,v=n>=2?t.at(-1)-t.at(-2):0,a=n>=3?t.at(-1)-2*t.at(-2)+t.at(-3):0,D=Math.abs(x-mean),H=(v*v+D*D)/2,P=F/16,C=X.reduce((z,row)=>z+(row.includes(x)?new Set(row).size-1:0),0);return {F,G,R,P,v,a,D,H,C,Q:v+a+G+D+R}};
const match=(a,b)=>Math.abs(a-b)<tol;
test('F1-01 candidate universe and F1-02 16x6 cardinality',()=>{assert.deepEqual(f.map(z=>z.x),Array.from({length:70},(_,i)=>i));assert.equal(X.flat().length,96)});
test('F1-03 frozen mean matches actual Golden matrix',()=>{const sum=X.flat().reduce((a,b)=>a+b,0);assert.equal(sum,2908);assert.ok(match(sum/96,mean))});
test('F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states',()=>{for(const z of f){const e=expected(z.x);for(const key of ['F','G','R','v','a','D','H'])assert.ok(match(value(z[key]),e[key]),z.x+' '+key)}});
test('F1-15 normalization and F1-16 score exact rational invariants',()=>{const n=normalizeFeatures(f),s=computeScores(f,n);assert.deepEqual(FEATURE_ORDER,['F','G','R','P','v','a','D','H','C','Q']);for(const key of FEATURE_ORDER){const a=n[key].map(value);assert.ok(a.every(x=>x>=-tol&&x<=1+tol));assert.ok(a.some(x=>match(x,0)))}for(let i=0;i<s.length;i++){const avg=FEATURE_ORDER.reduce((sum,key)=>sum+value(n[key][i]),0)/10;assert.ok(match(value(s[i].score),avg))}});
test('F1 frozen ranking is sorted by scores with explicit tie breakers',()=>{const scores=computeScores(f,normalizeFeatures(f));const ranked=rankCandidates(f,scores);assert.equal(new Set(ranked).size,70);for(let i=1;i<ranked.length;i++){const a=value(scores[ranked[i-1]].score),b=value(scores[ranked[i]].score);assert.ok(a+tol>=b)}});
test('Documented historical F1-07 prevalence versus frozen implementation: preserve mismatch',()=>{const cases=f.filter(z=>!match(value(z.P),expected(z.x).P));assert.ok(cases.length>0);console.log('F1-07 mismatch count='+cases.length+' example='+JSON.stringify({x:cases[0].x,documented:expected(cases[0].x).P,frozen:value(cases[0].P)}))});
test('Documented historical F1-12 co-occurrence versus frozen implementation: preserve mismatch',()=>{const cases=f.filter(z=>!match(value(z.C),expected(z.x).C));assert.ok(cases.length>0);console.log('F1-12 mismatch count='+cases.length+' example='+JSON.stringify({x:cases[0].x,documented:expected(cases[0].x).C,frozen:value(cases[0].C)}))});
