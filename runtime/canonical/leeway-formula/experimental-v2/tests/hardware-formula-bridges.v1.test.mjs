/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.HARDWARE_BRIDGE_CANDIDATES.TEST
TAG: LEEWAY.FORMULA.MULTI_BRIDGE.SOURCE_TESTS.V1
5WH:
WHAT = Test source-bounded hardware Formula bridge candidates using the unchanged Formula evaluator.
WHY = Prevent invented hardware, incomplete windows, stale samples and fake PCIe proof from passing.
WHO = Original Formula owner and bounded outside contributor, not Agent Lee.
WHERE = runtime/canonical/leeway-formula/experimental-v2/tests/hardware-formula-bridges.v1.test.mjs.
WHEN = 2026-11-21.
HOW = Explicit synthetic diagnostics, 16x6 source observations and negative controls.
LICENSE = Existing repository terms.
AUTHORITY = SYNTHETIC_SOURCE_TEST_ONLY, NO LIVE HARDWARE, VERITAS OR RECEIPT.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {HARDWARE_FORMULA_BRIDGES,inspectHardwareFormulaBridgeMap,evaluateHardwareFormulaBridgeShadow} from '../hardware-formula-bridges.v1.mjs';
const H='a'.repeat(64),NOW='2026-11-21T12:00:00Z';
const snap=(kind='CPU')=>({schema:'leeway.diagnostics.hardware-map.v1.candidate',
 authority:'DEVICE_BRIDGE_DIAGNOSTICS_OBSERVATION',deviceId:'synthetic-device',
 observationId:'synthetic-observation',observedAt:NOW,sourceSha256:H,
 components:[{componentId:'unit-1',kind,manufacturer:'Synthetic Manufacturer Ltd.',
  model:'Test CPU Revision 1',observationSource:'SYNTHETIC_FIXTURE',sourceSha256:H}]});
const cfg=id=>({mappingId:id,status:'SHADOW_CALIBRATION_ONLY',version:'test.1',
 sourceSha256:H,ranges:HARDWARE_FORMULA_BRIDGES.find(b=>b.id===id).dimensions.map(()=>[0,100])});
const samples=id=>Array.from({length:16},(_,i)=>({sampleId:'sample-'+i,
 componentId:'unit-1',sourceObservationId:'synthetic-observation',sourceSha256:H,
 observedAt:new Date(Date.parse(NOW)-(16-i)*1000).toISOString(),
 metrics:Object.fromEntries(HARDWARE_FORMULA_BRIDGES.find(b=>b.id===id).dimensions.map((d,j)=>[d.id,10+i+j]))}));
test('eight distinct 6-dimensional semantic bridge mappings share unchanged original Formula',()=>{
 assert.equal(HARDWARE_FORMULA_BRIDGES.length,8);
 assert.equal(new Set(HARDWARE_FORMULA_BRIDGES.map(x=>x.id)).size,8);
 for(const b of HARDWARE_FORMULA_BRIDGES){assert.equal(b.dimensions.length,6,b.id);
  assert.equal(new Set(b.dimensions.map(x=>x.id)).size,6,b.id);
  assert.equal(b.osActuationAuthorized,false);assert.equal(b.status,'CANDIDATE_CALIBRATION_REQUIRED');}
});
test('hardware map preserves actual-format manufacturer and device provenance; unobserved domain stays absent',()=>{
 const m=inspectHardwareFormulaBridgeMap(snap());
 assert.equal(m.bridges.length,8);
 assert.equal(m.bridges.find(x=>x.bridgeId==='FORMULA_CPU_EXECUTION').compatibleComponents[0].manufacturer,'Synthetic Manufacturer Ltd.');
 assert.equal(m.bridges.find(x=>x.bridgeId==='FORMULA_PCIE_TRANSFER').status,'NO_OBSERVED_COMPATIBLE_COMPONENT');
 assert.equal(m.physicalGpuComputeEnrollment,false);assert.equal(m.formulaDecisionExecuted,false);
});
test('observed physical graphics GPU is never enrolled as LeeWay compute',()=>{
 const a=snap('PHYSICAL_GPU');a.components[0].componentId='graphics-1';
 const m=inspectHardwareFormulaBridgeMap(a);
 assert.equal(m.physicalGpuComputeEnrollment,false);
 assert.ok(m.bridges.every(x=>x.status==='NO_OBSERVED_COMPATIBLE_COMPONENT'));
});
test('existing original Formula v1 evaluates complete CPU bridge windows in non-authoritative shadow only',()=>{
 const id='FORMULA_CPU_EXECUTION',v=evaluateHardwareFormulaBridgeShadow({
  snapshot:snap(),bridgeId:id,componentId:'unit-1',window:samples(id),calibration:cfg(id)});
 assert.equal(v.formulaId,'LEEWAY-FORMULA-v1.0');assert.equal(v.originalAdapterId,'runtime-state-v1');
 assert.equal(v.decimalState.length,6);assert.equal(v.state,'EXISTING_FORMULA_V1_EVALUATED_SHADOW_ONLY');
 for(const key of ['policyAuthorized','operatingSystemActuated','physicalPcieTransferObserved',
  'productionAccepted','independentVeritasVerified','receiptIssued'])assert.equal(v[key],false);
});
test('PCIe measurements cannot claim actual DMA or CPU transport',()=>{
 const id='FORMULA_PCIE_TRANSFER',v=evaluateHardwareFormulaBridgeShadow({
  snapshot:snap('PCIE_BUS'),bridgeId:id,componentId:'unit-1',window:samples(id),calibration:cfg(id)});
 assert.equal(v.physicalPcieTransferObserved,false);assert.equal(v.operatingSystemActuated,false);
});
test('missing manufacturer, model, provenance or hash cannot create hardware map',()=>{
 for(const key of ['manufacturer','model','observationSource','sourceSha256']){
  const a=snap();a.components[0][key]='';
  assert.throws(()=>inspectHardwareFormulaBridgeMap(a),/FORMULA_HARDWARE_COMPONENT_/);
 }
});
test('duplicate component identity or unverifiable snapshot hash is rejected',()=>{
 const a=snap();a.components.push({...a.components[0]});
 assert.throws(()=>inspectHardwareFormulaBridgeMap(a),/FORMULA_DUPLICATE_HARDWARE_COMPONENT/);
 const b=snap();b.sourceSha256='unknown';
 assert.throws(()=>inspectHardwareFormulaBridgeMap(b),/FORMULA_DIAGNOSTICS_SOURCE_HASH_REQUIRED/);
});
test('unknown bridge, absent component and missing calibration all fail closed',()=>{
 const id='FORMULA_CPU_EXECUTION',v={snapshot:snap(),bridgeId:id,componentId:'unit-1',
 window:samples(id),calibration:cfg(id)};
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,bridgeId:'UNKNOWN'}),/NOT_REGISTERED/);
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,componentId:'other'}),/COMPONENT_NOT_OBSERVED/);
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,calibration:null}),/CALIBRATION_REQUIRED/);
});
test('exactly sixteen ordered nonreplayed samples are required',()=>{
 const id='FORMULA_CPU_EXECUTION',v={snapshot:snap(),bridgeId:id,componentId:'unit-1',
 window:samples(id),calibration:cfg(id)};
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,window:v.window.slice(1)}),/EXACT_16_WINDOW_REQUIRED/);
 const dup=samples(id);dup[1].sampleId=dup[0].sampleId;
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,window:dup}),/SAMPLE_ORDER_OR_REPLAY/);
 const stale=samples(id);stale[1].observedAt=stale[0].observedAt;
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,window:stale}),/SAMPLE_ORDER_OR_REPLAY/);
});
test('missing or overcalibrated measurements cannot silently normalize',()=>{
 const id='FORMULA_CPU_EXECUTION',v={snapshot:snap(),bridgeId:id,componentId:'unit-1',
 window:samples(id),calibration:cfg(id)};
 const gap=samples(id);delete gap[0].metrics.cpu_utilization_pct;
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,window:gap}),/METRIC_SET_INVALID/);
 const high=samples(id);high[0].metrics.cpu_utilization_pct=200;
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,window:high}),/OUTSIDE_CALIBRATION/);
});
test('cross-observation readings are rejected rather than misattributed',()=>{
 const id='FORMULA_CPU_EXECUTION',v={snapshot:snap(),bridgeId:id,componentId:'unit-1',
 window:samples(id),calibration:cfg(id)};
 const wrong=samples(id);wrong[1].sourceObservationId='unrelated';
 assert.throws(()=>evaluateHardwareFormulaBridgeShadow({...v,window:wrong}),/PROVENANCE_UNVERIFIED/);
});
