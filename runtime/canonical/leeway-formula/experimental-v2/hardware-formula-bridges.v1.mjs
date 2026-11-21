/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.HARDWARE_BRIDGE_CANDIDATES
TAG: LEEWAY.FORMULA.HARDWARE_DOMAIN_BRIDGE.V1
5WH:
WHAT = Map real-format hardware observations into eight non-authoritative Formula bridge candidates.
WHY = Model CPU-adjacent hardware flows without cloning Formula, inventing measurements or controlling drivers.
WHO = Creator/Formula source authority; outside support contributor, not Agent Lee.
WHERE = runtime/canonical/leeway-formula/experimental-v2/hardware-formula-bridges.v1.mjs.
WHEN = 2026-11-21.
HOW = Component provenance, 16x6 typed windows, candidate calibration and unchanged Formula v1 evaluation.
LICENSE = Existing Formula repository terms.
AUTHORITY = SOURCE_CANDIDATE_SHADOW_ONLY; NO OS ACTION, FORMULA TASK GRANT, VERITAS OR PRODUCTION RECEIPT.
*/
import {createHash} from 'node:crypto';
import {runtimeStateV1} from '../v1/adapters/runtime-state-v1.mjs';
import {evaluate} from '../v1/leeway-formula-v1.mjs';
const ID=/^[A-Za-z0-9][A-Za-z0-9_.:-]{1,127}$/,HEX=/^[a-f0-9]{64}$/;
const fail=code=>{throw Object.assign(Error(code),{code});};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const dim=(id,unit,direction='lower_is_better')=>Object.freeze({id,unit,direction});
const domain=(id,kinds,dimensions,objective)=>Object.freeze({
 id,componentKinds:Object.freeze(kinds),dimensions:Object.freeze(dimensions),objective,
 status:'CANDIDATE_CALIBRATION_REQUIRED',osActuationAuthorized:false
});
export const HARDWARE_FORMULA_BRIDGES=Object.freeze([
 domain('FORMULA_CPU_EXECUTION',['CPU'],[
  dim('cpu_utilization_pct','percent'),dim('effective_frequency_mhz','MHz','higher_is_better'),
  dim('instruction_stall_pct','percent'),dim('run_queue_depth','count'),
  dim('context_switches_per_sec','per_second'),dim('instructions_per_cycle','ratio','higher_is_better')],'CPU instructions and execution pressure'),
 domain('FORMULA_CPU_CACHE',['CPU','CACHE'],[
  dim('l1_miss_pct','percent'),dim('l2_miss_pct','percent'),
  dim('last_level_cache_miss_pct','percent'),dim('memory_access_latency_ns','ns'),
  dim('remote_numa_pct','percent'),dim('coherency_traffic_mb_s','MB/s')],'Cache and locality'),
 domain('FORMULA_MEMORY_FLOW',['MEMORY'],[
  dim('memory_pressure_pct','percent'),dim('page_faults_per_sec','per_second'),
  dim('read_bandwidth_mb_s','MB/s','higher_is_better'),dim('memory_latency_ns','ns'),
  dim('allocation_rate_per_sec','per_second'),dim('swap_io_mb_s','MB/s')],'RAM and page pressure'),
 domain('FORMULA_PCIE_TRANSFER',['PCIE_BUS'],[
  dim('pcie_link_utilization_pct','percent'),dim('transfer_bytes','bytes'),
  dim('copy_count','count'),dim('synchronization_wait_ms','ms'),
  dim('pcie_queue_depth','count'),dim('transfer_locality_pct','percent','higher_is_better')],'Actual physical PCIe transfer, when observed'),
 domain('FORMULA_STORAGE_IO',['STORAGE'],[
  dim('read_throughput_mb_s','MB/s','higher_is_better'),dim('write_throughput_mb_s','MB/s','higher_is_better'),
  dim('p95_io_latency_ms','ms'),dim('io_queue_depth','count'),
  dim('read_iops','per_second','higher_is_better'),dim('storage_cache_hit_pct','percent','higher_is_better')],'Storage access and buffering'),
 domain('FORMULA_NETWORK_FLOW',['NETWORK'],[
  dim('receive_mb_s','MB/s','higher_is_better'),dim('transmit_mb_s','MB/s','higher_is_better'),
  dim('rtt_ms','ms'),dim('jitter_ms','ms'),
  dim('retransmissions_per_sec','per_second'),dim('packet_loss_pct','percent')],'CPU-facing network flow'),
 domain('FORMULA_POWER_THERMAL',['CPU','POWER','THERMAL'],[
  dim('cpu_temperature_c','C'),dim('cpu_power_w','W'),
  dim('thermal_throttle_pct','percent'),dim('effective_frequency_mhz','MHz','higher_is_better'),
  dim('fan_rpm','rpm'),dim('power_headroom_pct','percent','higher_is_better')],'Thermal headroom and throttling'),
 domain('FORMULA_SCHEDULER',['CPU','SCHEDULER'],[
  dim('runnable_threads','count'),dim('context_switches_per_sec','per_second'),
  dim('queue_wait_ms','ms'),dim('active_workers','count'),
  dim('cpu_utilization_pct','percent'),dim('scheduling_overhead_ms','ms')],'Work queue and OS scheduling')
]);
const byId=new Map(HARDWARE_FORMULA_BRIDGES.map(x=>[x.id,x]));
function requireId(x,code){if(typeof x!=='string'||!ID.test(x))fail(code);}
function requireTime(x,code){if(typeof x!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x)||!Number.isFinite(Date.parse(x)))fail(code);}
function component(c){
 if(!c||typeof c!=='object'||Array.isArray(c))fail('FORMULA_HARDWARE_COMPONENT_INVALID');
 for(const key of ['componentId','kind','observationSource'])
  requireId(c[key],'FORMULA_HARDWARE_COMPONENT_IDENTITY_UNVERIFIED');
 for(const key of ['manufacturer','model'])
  if(typeof c[key]!=='string'||c[key].trim().length===0||c[key].length>160||/[\x00-\x1f\x7f]/.test(c[key]))
   fail('FORMULA_HARDWARE_COMPONENT_IDENTITY_UNVERIFIED');
 if(!HEX.test(c.sourceSha256||''))fail('FORMULA_HARDWARE_COMPONENT_SOURCE_HASH_REQUIRED');
 return Object.freeze({componentId:c.componentId,kind:c.kind,manufacturer:c.manufacturer,
  model:c.model,observationSource:c.observationSource,sourceSha256:c.sourceSha256});
}
export function inspectHardwareFormulaBridgeMap(snapshot){
 if(snapshot?.schema!=='leeway.diagnostics.hardware-map.v1.candidate'||
  snapshot.authority!=='DEVICE_BRIDGE_DIAGNOSTICS_OBSERVATION'||
  !Array.isArray(snapshot.components)||snapshot.components.length>256)
  fail('FORMULA_DIAGNOSTICS_SNAPSHOT_INVALID');
 requireId(snapshot.deviceId,'FORMULA_DIAGNOSTICS_DEVICE_ID_REQUIRED');
 requireId(snapshot.observationId,'FORMULA_DIAGNOSTICS_OBSERVATION_ID_REQUIRED');
 requireTime(snapshot.observedAt,'FORMULA_DIAGNOSTICS_TIME_INVALID');
 if(!HEX.test(snapshot.sourceSha256||''))fail('FORMULA_DIAGNOSTICS_SOURCE_HASH_REQUIRED');
 const components=snapshot.components.map(component),seen=new Set();
 for(const c of components){if(seen.has(c.componentId))fail('FORMULA_DUPLICATE_HARDWARE_COMPONENT');seen.add(c.componentId);}
 const bridges=HARDWARE_FORMULA_BRIDGES.map(b=>{
  const matches=components.filter(c=>b.componentKinds.includes(c.kind));
  return Object.freeze({bridgeId:b.id,sourceObservationId:snapshot.observationId,
   compatibleComponents:matches.map(c=>({componentId:c.componentId,kind:c.kind,manufacturer:c.manufacturer,
    model:c.model,observationSource:c.observationSource})),
   status:matches.length?'OBSERVED_COMPONENT_REQUIRES_CALIBRATED_16X6_WINDOW':'NO_OBSERVED_COMPATIBLE_COMPONENT',
   formulaDecisionExecuted:false,osActuationAuthorized:false});
 });
 return Object.freeze({schema:'leeway.formula.hardware-bridge-map.v1.candidate',
  deviceId:snapshot.deviceId,observationId:snapshot.observationId,sourceSha256:snapshot.sourceSha256,
  status:'DIAGNOSTICS_PROJECTION_ONLY_NOT_HOST_VERIFIED',physicalGpuComputeEnrollment:false,
  formulaDecisionExecuted:false,bridges:Object.freeze(bridges)});
}
export function evaluateHardwareFormulaBridgeShadow({snapshot,bridgeId,componentId,window,calibration}={}){
 const map=inspectHardwareFormulaBridgeMap(snapshot),bridge=byId.get(bridgeId);
 if(!bridge)fail('FORMULA_HARDWARE_BRIDGE_NOT_REGISTERED');
 if(!map.bridges.find(b=>b.bridgeId===bridgeId)?.compatibleComponents.some(c=>c.componentId===componentId))
  fail('FORMULA_BRIDGE_COMPONENT_NOT_OBSERVED');
 if(calibration?.mappingId!==bridgeId||calibration.status!=='SHADOW_CALIBRATION_ONLY'||
  !ID.test(calibration.version||'')||!HEX.test(calibration.sourceSha256||'')||
  !Array.isArray(calibration.ranges)||calibration.ranges.length!==6||
  calibration.ranges.some(r=>!Array.isArray(r)||r.length!==2||!r.every(Number.isFinite)||r[0]>=r[1]))
  fail('FORMULA_BRIDGE_CALIBRATION_REQUIRED');
 if(!Array.isArray(window)||window.length!==16)fail('FORMULA_BRIDGE_EXACT_16_WINDOW_REQUIRED');
 let prior=0;const seen=new Set(),rows=[];
 for(const w of window){
  if(w?.componentId!==componentId||w.sourceObservationId!==snapshot.observationId||
   !HEX.test(w.sourceSha256||''))fail('FORMULA_BRIDGE_PROVENANCE_UNVERIFIED');
  requireId(w.sampleId,'FORMULA_BRIDGE_SAMPLE_ID_INVALID');
  requireTime(w.observedAt,'FORMULA_BRIDGE_SAMPLE_TIME_INVALID');
  const ms=Date.parse(w.observedAt);
  if(ms<=prior||ms>Date.parse(snapshot.observedAt)||seen.has(w.sampleId))
   fail('FORMULA_BRIDGE_SAMPLE_ORDER_OR_REPLAY');
  prior=ms;seen.add(w.sampleId);
  if(!w.metrics||typeof w.metrics!=='object'||Array.isArray(w.metrics)||
   Object.keys(w.metrics).length!==6)fail('FORMULA_BRIDGE_METRIC_SET_INVALID');
  rows.push(bridge.dimensions.map((d,i)=>{
   const v=w.metrics[d.id];
   if(!Number.isFinite(v)||v<calibration.ranges[i][0]||v>calibration.ranges[i][1])
    fail('FORMULA_BRIDGE_METRIC_OUTSIDE_CALIBRATION');
   return v;
  }));
 }
 const adapted=runtimeStateV1.toMatrix({stateRows:rows,ranges:calibration.ranges});
 const result=evaluate(adapted.matrix);
 return Object.freeze({schema:'leeway.formula.hardware-shadow-evaluation.v1',bridgeId,
  componentId,deviceId:map.deviceId,observationId:map.observationId,
  formulaId:result.formulaId,formulaInputHash:result.inputHash,formulaResultHash:result.resultHash,
  originalAdapterId:adapted.adapterId,rawWindowSha256:digest(JSON.stringify(rows)),
  calibrationSourceSha256:calibration.sourceSha256,
  decimalState:Object.freeze([...result.decimalState]),base64State:Object.freeze([...result.base64State]),
  state:'EXISTING_FORMULA_V1_EVALUATED_SHADOW_ONLY',
  sourceHardwareIndependentlyVerified:false,policyAuthorized:false,operatingSystemActuated:false,
  physicalPcieTransferObserved:false,productionAccepted:false,independentVeritasVerified:false,receiptIssued:false});
}