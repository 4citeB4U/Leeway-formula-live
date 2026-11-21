/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.RETAINED_PHYSICAL_HARDWARE.QUALIFICATION
TAG: LEEWAY.FORMULA.RETAINED_PC.INVENTORY_GATE.V1
5WH:
WHAT = Classify actual PC Diagnostics inventory against the eight existing Formula bridge domains.
WHY = Use true retained physical observations without turning an October report into today's CPU/PCIe measurements.
WHO = Creator and original Formula/Diagnostics owners; outside support contributor, not Agent Lee.
WHERE = runtime/canonical/leeway-formula/experimental-v2/retained-hardware-qualification.v1.mjs.
WHEN = 2026-11-21.
HOW = Validate Bridge custody fields, detect bounded inventory facts, report absent measurement windows honestly.
LICENSE = Existing repository terms.
AUTHORITY = RETAINED_HARDWARE_READBACK_ONLY; NO PHYSICAL_EXECUTION, FORMULA_TASK_GRANT, VERITAS OR RECEIPT_ISSUE.
*/
import {HARDWARE_FORMULA_BRIDGES} from './hardware-formula-bridges.v1.mjs';
const SHA=/^[a-f0-9]{64}$/;
const problem=(code)=>{throw Object.assign(new Error(code),{code});};
export function qualifyRetainedHardwareForFormula(evidence){
 if(evidence?.schema!=='leeway.formula.pc-retained-hardware-evidence.v1'||
    evidence.origin!=='OWNER_SCOPED_BRIDGE_BOUNDED_FILE_READ'||
    evidence.bodyId!=='pc-primary')problem('FORMULA_RETAINED_HARDWARE_SOURCE_INVALID');
 const s=evidence.sourceReport,o=evidence.actualRetainedObservations;
 if(s?.reportId!=='LEEWAY_REPORT::DEVICE::SYSTEM_HEALTH'||
    !SHA.test(s.contentSha256||'')||
    typeof s.bridgeObservationReceiptId!=='string'||
    !Number.isFinite(Date.parse(s.originalGeneratedAt))||
    s.originalGeneratedAt.slice(0,10)>=s.readbackDate||
    !/^\d{4}-\d\d-\d\d$/.test(s.readbackDate||'')||
    s.readbackAuthority!=='EXECUTED_NOT_INDEPENDENTLY_VERIFIED')
    problem('FORMULA_RETAINED_HARDWARE_CUSTODY_INVALID');
 if(!o?.cpu||o.cpu.model!=='Intel(R) Core(TM) Ultra 9 275HX'||
    !Number.isInteger(o.cpu.logicalProcessors)||o.cpu.logicalProcessors<1||
    !Number.isFinite(o.cpu.averageSpeedMHz)||o.cpu.averageSpeedMHz<=0||
    !Number.isFinite(o.ram?.totalMemoryGb)||o.ram.totalMemoryGb<=0||
    !Number.isFinite(o.ram?.freeMemoryGbAtSourceCapture)||
    o.ram.freeMemoryGbAtSourceCapture<0||
    o.ram.freeMemoryGbAtSourceCapture>o.ram.totalMemoryGb)
   problem('FORMULA_RETAINED_HARDWARE_FIELDS_INVALID');
 if(Object.keys(o).filter(k=>k.endsWith('Samples')||k.endsWith('Counters')||k.endsWith('Readings')||k.endsWith('Windows')).some(k=>o[k]!==true))
   problem('FORMULA_RETAINED_HARDWARE_MISSING_FIELD_FALSE');
 if(evidence.formulaExecutionOnPc!=='NOT_EXECUTED'||
    evidence.currentDeviceMeasurementOnPc!=='BLOCKED_EXECUTION_TOOL_NOT_REGISTERED'||
    evidence.productionAuthority!=='NOT_CONFERRED'||
    evidence.userPhysicalGpuAsLeewayProvider!==false)
   problem('FORMULA_RETAINED_HARDWARE_FALSE_EXECUTION_CLAIM');
 const catalog=new Map([
  ['FORMULA_CPU_EXECUTION',['cpu.model','cpu.logicalProcessors','cpu.averageSpeedMHz']],
  ['FORMULA_CPU_CACHE',[]],
  ['FORMULA_MEMORY_FLOW',['ram.totalMemoryGb','ram.freeMemoryGbAtSourceCapture']],
  ['FORMULA_PCIE_TRANSFER',['network.observedPhysicalPcieNic (inventory only, not bus telemetry)']],
  ['FORMULA_STORAGE_IO',['storage.volumeCount']],
  ['FORMULA_NETWORK_FLOW',['network.observedPhysicalPcieNic','network.historicalReportedEthernetLinkSpeed']],
  ['FORMULA_POWER_THERMAL',[]],
  ['FORMULA_SCHEDULER',['cpu.logicalProcessors']]
 ]);
 const gates=HARDWARE_FORMULA_BRIDGES.map(b=>{
  const observedFields=catalog.get(b.id)||[];
  return Object.freeze({bridgeId:b.id,retainedInventoryFields:observedFields,
   inventoryState:observedFields.length?'RETAINED_PHYSICAL_HARDWARE_INVENTORY_PRESENT':'REQUIRED_HARDWARE_FIELDS_NOT_PRESENT',
   realSixBySixteenSampleWindow:'MISSING',
   calibratedFormulaEvaluation:'NOT_EXECUTED',pciTransferMeasured:false,
   cpuBeforeAfterBenchmarkMeasured:false,liveDeviceReadback:false,
   independentPhysicalQualification:false});
 });
 return Object.freeze({
  schema:'leeway.formula.retained-hardware-gates.v1',
  sourceSha256:s.contentSha256,originalReportGeneratedAt:s.originalGeneratedAt,
  readbackDate:s.readbackDate,
  bodyId:evidence.bodyId,hardwareObservedHistorically:true,
  real16x6FormulaMeasurementComplete:false,
  cpuMathExecutedOnOriginalDevice:false,
  physicalPcieTransferMeasured:false,
  gpuGraphicsProviderUsed:false,gateCount:gates.length,gates:Object.freeze(gates)
 });
}
