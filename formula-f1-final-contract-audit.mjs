/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F1_13_21_INDEPENDENT_CONTRACT_CHECK_V1
WHAT: Verify frozen Formula scoring/ranking/result and characterize historical divergences.
WHY: Preserve positive mathematical evidence and report contract differences.
WHO: LeeWay authorized audit. WHERE: isolated audit checkout. WHEN: 2026-10-25.
HOW: independent arithmetic, adversarial constructed ties, softmax monotonicity.
AUTHORITY: AUDIT_ONLY; frozen canonical source unchanged.
LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {computeFeatures,normalizeFeatures,computeScores,rankCandidates,evaluate,GOLDEN_MATRIX,GOLDEN_DECIMAL,GOLDEN_BASE64,FEATURE_ORDER} from './runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs';
import {rat} from './runtime/canonical/leeway-formula/v1/rational.mjs';
const f=computeFeatures(GOLDEN_MATRIX),v=r=>Number(r.n)/Number(r.d);
const near=(a,b)=>Math.abs(a-b)<1e-10;
test('F1-13 frozen Q implements historical W arithmetic for all 70 candidates',()=>{for(const z of f)assert.ok(near(v(z.Q),v(z.v)+v(z.a)+v(z.G)+v(z.D)+v(z.R)))});
test('F1-14 historical W vs frozen Q feature names differ but numerical tenth slot agrees',()=>{assert.equal(FEATURE_ORDER[9],'Q');assert.equal(f.length,70);assert.ok(f.every(z=>z.Q&& !('W' in z)))});
test('F1-17 softmax is strictly order preserving without requiring kernel to emit probabilities',()=>{const s=computeScores(f,normalizeFeatures(f));const arr=s.map(z=>v(z.score)),mx=Math.max(...arr),exp=arr.map(x=>Math.exp(x-mx)),sum=exp.reduce((a,b)=>a+b,0),prob=exp.map(x=>x/sum);assert.ok(near(prob.reduce((a,b)=>a+b,0),1));for(let i=0;i<arr.length;i++)for(let j=0;j<arr.length;j++){if(arr[i]>arr[j]+1e-12)assert.ok(prob[i]>prob[j])}assert.equal('probabilities' in evaluate(GOLDEN_MATRIX),false)});
test('F1-18 exponential strict monotonicity of distinct rational scores',()=>{const s=computeScores(f,normalizeFeatures(f));const arr=s.map(z=>v(z.score));for(let i=0;i<arr.length;i++)for(let j=0;j<i;j++){if(arr[i]!==arr[j])assert.equal(arr[i]>arr[j],Math.exp(arr[i])>Math.exp(arr[j]))}});
test('F1-19 exact frozen score/F/R/P/numeric tie-breakers exercised',()=>{const z=Array.from({length:5},(_,x)=>({x,F:rat(x===1||x===2?3:1),R:rat(x===2?2:1),P:rat(x===3?2:1)}));const scores=z.map(y=>({x:y.x,score:rat(y.x===4?2:1)}));const actual=rankCandidates(z,scores);assert.deepEqual(actual,[4,2,1,3,0]);const onlyP=[{x:9,F:rat(1),R:rat(1),P:rat(2)},{x:2,F:rat(1),R:rat(1),P:rat(1)}];assert.deepEqual(rankCandidates(onlyP,onlyP.map(x=>({x:x.x,score:rat(1)}))),[9,2])});
test('F1-20 top six are ranked candidates encoded in frozen variable-width Base64',()=>{const r=evaluate(GOLDEN_MATRIX),s=computeScores(f,normalizeFeatures(f)),ranked=rankCandidates(f,s);assert.deepEqual(r.decimalState,ranked.slice(0,6));assert.equal(r.base64State.length,6);assert.equal(r.top10.length,10)});
test('F1-21 frozen golden decimal and Base64 agree',()=>{const r=evaluate(GOLDEN_MATRIX);assert.deepEqual(r.decimalState,GOLDEN_DECIMAL);assert.deepEqual(r.base64State,GOLDEN_BASE64)});
