/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.ORIGINAL_WINDOWS_DIAGNOSTICS.TEST
TAG: LEEWAY.FORMULA.NATIVE_WINDOWS_OEM_PROJECTION.TEST.V1
5WH:
WHAT = Prove source adapter matches original Windows CIM schema and never invents physical GPU/PCIe telemetry.
WHY = Integrate the original installed Brain Diagnostics into eight Formula bridges without synthetic qualification claims.
WHO = Creator / original Formula source owner; outside support contributor, not Agent Lee.
WHERE = runtime/canonical/leeway-formula/experimental-v2/tests/windows-native-diagnostics-formula-bridge.v1.test.mjs.
WHEN = 2026-11-21.
HOW = Synthetic records with exact original PowerShell Observe() output shape; source/digest/time/negative gates.
LICENSE = Existing repository terms.
AUTHORITY = CI_SYNTHETIC_FIXTURES_ONLY. No native host execution, Veritas or production receipt.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {projectNativeWindowsDiagnosticsToFormula} from '../windows-native-diagnostics-formula-bridge.v1.mjs';
const sha=s=>createHash('sha256').update(s).digest('hex');
const time=Date.now();
const observe=(source,data)=>({state:'OBSERVED',source,capturedAtMs:time-100,data});
const fixture=()=>({
 cpu:observe('Win32_Processor',[{Name:'Intel(R) Core(TM) Ultra 9 275HX',Manufacturer:'GenuineIntel',NumberOfLogicalProcessors:24,CurrentClockSpeed:2500}]),
 memoryModules:observe('Win32_PhysicalMemory',[{Manufacturer:'Micron',PartNumber:'DDR5-MODULE',Capacity:17179869184,ConfiguredClockSpeed:5600}]),
 networkAdapters:observe('Enabled physical network adapters',[{Manufacturer:'Realtek',Name:'Realtek PCIe GbE Family Controller',Speed:1000000000}]),
 cpuPerformance:observe('Win32_PerfFormattedData_PerfOS_Processor',[{Name:'_Total',PercentProcessorTime:27}]),
 pcieDevices:observe('Present PCI bus PnP endpoint descriptors',[{Status:'OK',FriendlyName:'PCIe Ethernet',InstanceId:'PCI\\VEN_10EC&DEV_0001'}]),
 gpuPerformance:observe('NVIDIA SMI fixed executable sensor query',[{Name:'NVIDIA GPU',TemperatureC:65,UtilizationPct:90}]),
 formula:{state:'NOT_EXECUTED'}
});
function project(record,other={}){
 const rawJson=JSON.stringify(record);
 return projectNativeWindowsDiagnosticsToFormula({rawJson,sourceSha256:sha(rawJson),
  deviceId:'pc-primary',observationId:'native-cim-observation-01',nowMs:time,...other});
}
test('original native Windows CIM fields join CPU, memory, network to Formula without new scanner',()=>{
 const result=project(fixture());
 assert.equal(result.sourceBytesDigestMatched,true);
 assert.equal(result.nativeScriptSource,'ORIGINAL_MACHINE_CONSCIOUSNESS_READ_DEVICE_DIAGNOSTICS_PS1');
 assert.equal(result.originalNativeSourceIndependentlyAuthenticated,false);
 assert.equal(result.projection.deviceId,'pc-primary');
 assert.equal(result.projection.bridges.length,8);
 const byKind=Object.fromEntries(result.projection.bridges.map(x=>[x.bridgeId,x]));
 assert.ok(byKind.FORMULA_CPU_EXECUTION.compatibleComponents.some(c=>c.kind==='CPU'&&c.manufacturer==='GenuineIntel'));
 assert.ok(byKind.FORMULA_MEMORY_FLOW.compatibleComponents.some(c=>c.kind==='MEMORY'&&c.manufacturer==='Micron'));
 assert.ok(byKind.FORMULA_NETWORK_FLOW.compatibleComponents.some(c=>c.kind==='NETWORK'&&c.manufacturer==='Realtek'));
 assert.equal(result.measuredOneShotMetrics.cpu_utilization_pct.value,27);
 assert.equal(result.measuredOneShotMetrics.cpu_utilization_pct.source,'Win32_PerfFormattedData_PerfOS_Processor');
 for(const b of result.bridgeReadiness)assert.equal(b.window16x6,'MISSING');
});
test('physical PCI endpoint enumeration is retained as inventory, never claimed as transfer telemetry',()=>{
 const r=project(fixture());
 assert.equal(r.observedPcieEndpointCount,1);
 assert.equal(r.physicalPcieTransferCountersObserved,false);
 assert.equal(r.projection.bridges.find(x=>x.bridgeId==='FORMULA_PCIE_TRANSFER').compatibleComponents.length,0);
 assert.equal(r.formulaEvaluationPerformed,false);
 assert.equal(r.originalSixteenBySixWindowComplete,false);
});
test('physical user graphics GPU remains invisible to LeeWay software GPU compute mapping',()=>{
 const r=project(fixture());
 assert.equal(r.gpuGraphicsComputeProviderEnrolled,false);
 assert.ok(r.projection.bridges.flatMap(x=>x.compatibleComponents).every(c=>c.kind!=='GPU'));
});
test('changed payload with existing digest is rejected before hardware projection',()=>{
 const json=JSON.stringify(fixture());
 assert.throws(()=>projectNativeWindowsDiagnosticsToFormula({
  rawJson:json+' ',sourceSha256:sha(json),deviceId:'pc-primary',
  observationId:'native-observation-01',nowMs:time
 }),/FORMULA_WINDOWS_DIAGNOSTICS_RAW_SOURCE_DIGEST_INVALID/);
});
test('stale native observations cannot be promoted as current hardware measurements',()=>{
 const data=fixture();
 for(const x of Object.values(data))if(x?.capturedAtMs)x.capturedAtMs=time-80000;
 assert.throws(()=>project(data),/FORMULA_WINDOWS_DIAGNOSTICS_NO_CURRENT_NATIVE_SOURCE/);
});
test('forged sources cannot create original native OEM mapping',()=>{
 const data=fixture();
 for(const [name,entry] of Object.entries(data))if(entry?.source)entry.source='FAKE_REPORT';
 assert.throws(()=>project(data),/FORMULA_WINDOWS_DIAGNOSTICS_NO_CURRENT_NATIVE_SOURCE/);
});
test('absent optional native OEM fields report missing instead of invented manufacturer',()=>{
 const data=fixture();
 data.cpu.data[0].Manufacturer='';
 data.memoryModules.data[0].Manufacturer='';
 const r=project(data);
 assert.equal(r.projection.bridges.find(x=>x.bridgeId==='FORMULA_MEMORY_FLOW').compatibleComponents.length,0);
 assert.ok(r.missingOriginalSources.some(x=>x.includes('OEM_FIELDS_UNAVAILABLE')));
 assert.equal(r.originalNativeSourceIndependentlyAuthenticated,false);
});
test('original CPU performance _Total counter is not a fake 16-by-6 Formula window',()=>{
 const r=project(fixture());
 assert.equal(r.measuredOneShotMetrics.cpu_utilization_pct.value,27);
 assert.equal(r.formulaEvaluationPerformed,false);
 assert.equal(r.projection.formulaDecisionExecuted,false);
 for(const b of r.projection.bridges)assert.equal(b.formulaDecisionExecuted,false);
});
