/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.NATIVE_DIAGNOSTICS.ORIGINAL_BRIDGE
TAG: LEEWAY.FORMULA.WINDOWS_DIAGNOSTICS_REAL_SOURCE_ADAPTER.V1
5WH:
WHAT = Convert existing Windows Brain Read-DeviceDiagnostics.ps1 raw observations to original eight Formula bridge candidates.
WHY = Join real host OEM and measured CPU data to original Formula without a second scanner or invented physical PCIe metrics.
WHO = Creator and original Formula/Diagnostics owners; outside support contributor, not Agent Lee.
WHERE = runtime/canonical/leeway-formula/experimental-v2/windows-native-diagnostics-formula-bridge.v1.mjs.
WHEN = 2026-11-21.
HOW = Exact JSON digest, native source labels, bounded timestamp, actual OEM fields, original bridge map.
LICENSE = Existing repository terms.
AUTHORITY = ORIGINAL_NATIVE_SOURCE_PROJECTION. NO ATTESTED DEVICE / VERIFIED RUNTIME GRANT / FORMULA PRODUCTION EXECUTION.
*/
import {createHash} from 'node:crypto';
import {inspectHardwareFormulaBridgeMap,HARDWARE_FORMULA_BRIDGES} from './hardware-formula-bridges.v1.mjs';

const SHA=/^[a-f0-9]{64}$/;
const ID=/^[A-Za-z0-9][A-Za-z0-9_.:-]{1,127}$/;
const fail=code=>{throw Object.assign(new Error(code),{code});};
const hash=b=>createHash('sha256').update(b).digest('hex');
const good=s=>typeof s==='string'&&s.trim().length>0&&s.length<=160&&!/[\x00-\x1f\x7f]/.test(s);
const originalSources=Object.freeze({
 cpu:'Win32_Processor',
 memoryModules:'Win32_PhysicalMemory',
 networkAdapters:'Enabled physical network adapters',
 cpuPerformance:'Win32_PerfFormattedData_PerfOS_Processor',
 pcieDevices:'Present PCI bus PnP endpoint descriptors'
});
function observed(raw,source,nowMs,maxAgeMs){
 if(raw?.state!=='OBSERVED'||raw.source!==originalSources[source]||
    !Number.isSafeInteger(raw.capturedAtMs)||raw.capturedAtMs>nowMs+3000||
    nowMs-raw.capturedAtMs>maxAgeMs||!Array.isArray(raw.data))
  return null;
 return raw.data;
}
function identifier(kind,row){
 return (kind.toLowerCase()+'-'+hash(JSON.stringify(row)).slice(0,24));
}
/**
 * Exact raw source JSON must originate from existing authenticated Diagnostics
 * execution and must be independently qualified by original Device Bridge.
 * This function verifies bytes but cannot authenticate the caller/device.
 */
export function projectNativeWindowsDiagnosticsToFormula({
 rawJson,deviceId,observationId,sourceSha256,nowMs=Date.now(),maxAgeMs=15000
}={}){
 if(!ID.test(deviceId||'')||!ID.test(observationId||'')||
    !Number.isSafeInteger(nowMs)||!Number.isSafeInteger(maxAgeMs)||
    maxAgeMs<1000||maxAgeMs>60000)
   fail('FORMULA_WINDOWS_DIAGNOSTICS_ARGUMENTS_INVALID');
 if(typeof rawJson!=='string'||Buffer.byteLength(rawJson,'utf8')>1024*1024||
    Buffer.byteLength(rawJson,'utf8')<20||!SHA.test(sourceSha256||'')||
    hash(Buffer.from(rawJson,'utf8'))!==sourceSha256)
   fail('FORMULA_WINDOWS_DIAGNOSTICS_RAW_SOURCE_DIGEST_INVALID');
 let record;
 try{record=JSON.parse(rawJson);}catch{fail('FORMULA_WINDOWS_DIAGNOSTICS_JSON_INVALID');}
 if(!record||typeof record!=='object'||Array.isArray(record))
   fail('FORMULA_WINDOWS_DIAGNOSTICS_JSON_INVALID');
 const components=[];
 const missing=[];
 const exactObservations={};
 for(const [field,kind,sourceModel,modelKey] of [
  ['cpu','CPU','REAL_WINDOWS_CIM_WIN32_PROCESSOR','Name'],
  ['memoryModules','MEMORY','REAL_WINDOWS_CIM_WIN32_PHYSICALMEMORY','PartNumber'],
  ['networkAdapters','NETWORK','REAL_WINDOWS_CIM_WIN32_NETWORKADAPTER','Name']]){
  const rows=observed(record[field],field,nowMs,maxAgeMs);
  if(!rows||!rows.length){missing.push(field);continue;}
  let count=0;
  for(const entry of rows.slice(0,32)){
   if(!entry||!good(entry.Manufacturer)||!good(entry[modelKey]))continue;
   const c={componentId:identifier(kind,entry),kind,
     manufacturer:entry.Manufacturer.trim(),model:entry[modelKey].trim(),
     observationSource:sourceModel,
     sourceSha256:hash(Buffer.from(JSON.stringify({field,entry,at:record[field].capturedAtMs}),'utf8'))};
   if(!components.some(x=>x.componentId===c.componentId)){components.push(c);count++;}
  }
  if(!count)missing.push(field+':OEM_FIELDS_UNAVAILABLE');
 }
 const perf=observed(record.cpuPerformance,'cpuPerformance',nowMs,maxAgeMs);
 if(Array.isArray(perf)&&perf.length){
  const candidate=perf.find(x=>x?.Name==='_Total');
  const v=Number(candidate?.PercentProcessorTime);
  if(candidate&&Number.isFinite(v)&&v>=0&&v<=100){
   exactObservations.cpu_utilization_pct=Object.freeze({
    value:v,unit:'percent',source:'Win32_PerfFormattedData_PerfOS_Processor',
    capturedAtMs:record.cpuPerformance.capturedAtMs
   });
  }else missing.push('cpuPerformance:CPU_COUNTER_INVALID');
 }else missing.push('cpuPerformance');
 const pcie=observed(record.pcieDevices,'pcieDevices',nowMs,maxAgeMs);
 const observedPcieEndpointCount=Array.isArray(pcie)?pcie.filter(x=>
   typeof x?.InstanceId==='string'&&x.InstanceId.startsWith('PCI\\')).length:null;
 // Win32 PnP enumeration is not PCIe link telemetry and does not reveal the
 // original CPU instructions or memory copies. Deliberately do not create
 // a PCIE_BUS Formula component from this information.
 if(observedPcieEndpointCount===null)missing.push('pcieDevices');
 const fresh=[record.cpu,record.memoryModules,record.networkAdapters,record.cpuPerformance,record.pcieDevices]
  .filter(x=>x&&Number.isSafeInteger(x.capturedAtMs)&&
    x.state==='OBSERVED'&&nowMs-x.capturedAtMs<=maxAgeMs&&x.capturedAtMs<=nowMs+3000);
 if(!fresh.length)fail('FORMULA_WINDOWS_DIAGNOSTICS_NO_CURRENT_NATIVE_SOURCE');
 const actualObservationTime=Math.max(...fresh.map(x=>x.capturedAtMs));
 const snapshot={
  schema:'leeway.diagnostics.hardware-map.v1.candidate',
  authority:'DEVICE_BRIDGE_DIAGNOSTICS_OBSERVATION',
  deviceId,observationId,observedAt:new Date(actualObservationTime).toISOString(),
  sourceSha256,components
 };
 const map=inspectHardwareFormulaBridgeMap(snapshot);
 return Object.freeze({
  schema:'leeway.formula.windows-native-diagnostics-projection.v1',
  deviceId,sourceSha256,observationId,
  nativeScriptSource:'ORIGINAL_MACHINE_CONSCIOUSNESS_READ_DEVICE_DIAGNOSTICS_PS1',
  sourceBytesDigestMatched:true,
  originalNativeSourceIndependentlyAuthenticated:false,
  windowsPcPhysicalExecutionPerformedByThisAdapter:false,
  formulaEvaluationPerformed:false,
  gpuGraphicsComputeProviderEnrolled:false,
  observedPcieEndpointCount,
  physicalPcieTransferCountersObserved:false,
  originalSixteenBySixWindowComplete:false,
  missingOriginalSources:Object.freeze(missing),
  measuredOneShotMetrics:Object.freeze(exactObservations),
  bridgeReadiness:Object.freeze(map.bridges.map(x=>Object.freeze({
    bridgeId:x.bridgeId,
    observedComponentCount:x.compatibleComponents.length,
    window16x6:'MISSING',
    state:x.status
  }))),
  projection:map
 });
}
