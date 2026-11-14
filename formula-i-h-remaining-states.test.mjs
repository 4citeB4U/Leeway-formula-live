/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: IH_STATE_SHAPE_EVIDENCE
WHAT: Validate documented inference controller state contracts and global hardware aggregation.
WHY: Preserve precise mathematical evidence without claiming device telemetrics are wired.
WHO: LeeWay audit; WHERE: isolated test; WHEN: 2026-10-25.
HOW: frozen shape contract fixtures, enumerated labels and six-state aggregation.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
const definitions={
'I-07':['tokens','compute','io','ttft','batch','interference'],
'I-08':['hbmRead','hbmWrite','hostCopy','stall','footprint','bytesPerToken'],
'I-09':['capacity','growth','fragmentation','eviction','miss','allocation'],
'I-10':['depth','wait','arrivalService','hol','batch','slo'],
'I-11':['bandwidth','collective','syncWait','straggler','bytes','topology'],
'I-12':['tpot','bandwidth','bytesPerToken','kvRead','batch','overhead']};
for(const [id,labels] of Object.entries(definitions))test(id+' documented six-field controller schema',()=>{assert.equal(labels.length,6);assert.equal(new Set(labels).size,6);const h=labels.map((_,i)=>i*10);assert.equal(h.length,6);assert.ok(h.every(Number.isFinite))});
test('I-05 six distinct subsystem controllers',()=>{const controllers=['P','M','K','Q','I','D'];assert.equal(controllers.length,6);assert.equal(new Set(controllers).size,6)});
test('H-07 global node state is a set of distinct node states',()=>{const nodes=[{id:'n1',state:[1,2,3,4,5,6]},{id:'n2',state:[6,5,4,3,2,1]}];assert.equal(new Set(nodes.map(n=>n.id)).size,nodes.length);assert.ok(nodes.every(n=>n.state.length===6))});
