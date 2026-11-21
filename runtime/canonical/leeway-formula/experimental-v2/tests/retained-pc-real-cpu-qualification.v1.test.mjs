/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.PC_RETAINED_AND_CPU_AB.TEST
TAG: LEEWAY.FORMULA.REAL_EVIDENCE_BOUNDARY.TEST.V1
5WH:
WHAT = Validate actual previously observed PC inventory and a CPU-executed buffer representation comparison.
WHY = Distinguish source-custodied hardware identity, CPU computation on CI, and absent live PCIe measurements.
WHO = Creator / original Formula source authority; bounded outside support contributor (not Agent Lee).
WHERE = runtime/canonical/leeway-formula/experimental-v2/tests/retained-pc-real-cpu-qualification.v1.test.mjs.
WHEN = 2026-11-21.
HOW = Original Bridge-retained digest, source qualification gates, local CPU A/B, negative controls.
LICENSE = Existing Formula repository terms.
AUTHORITY = SOURCE_AND_REAL_CI_CPU_ONLY_NOT_PC_NATIVE_OR_VERITAS.
*/
import {readFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import test from 'node:test';
import {qualifyRetainedHardwareForFormula} from '../retained-hardware-qualification.v1.mjs';
import {executeRealCpuRepresentationAB} from '../real-cpu-representation-ab.v1.mjs';
const record=JSON.parse(readFileSync(new URL('../../../../docs/evidence/pc-primary-retained-hardware-20261121.v1.json',import.meta.url),'utf8'));

test('real PC hardware record has original retained Bridge hash/date, not a newly invented live readback',()=>{
 assert.equal(record.schema,'leeway.formula.pc-retained-hardware-evidence.v1');
 assert.equal(record.sourceReport.contentSha256,'dec65d739e412d59d81895ec6ebee8b669d711a12604bcca0ba969eaf1377ad8');
 assert.equal(record.sourceReport.originalGeneratedAt,'2026-10-04T23:55:37.693Z');
 assert.equal(record.sourceReport.readbackDate,'2026-11-21');
 assert.equal(record.actualRetainedObservations.cpu.model,'Intel(R) Core(TM) Ultra 9 275HX');
 assert.equal(record.actualRetainedObservations.cpu.logicalProcessors,24);
 assert.equal(record.actualRetainedObservations.ram.totalMemoryGb,31.43);
 assert.equal(record.formulaExecutionOnPc,'NOT_EXECUTED');
});
test('eight Formula bridges consume actual historical hardware inventory as partial readiness; no 16x6 invented',()=>{
 const q=qualifyRetainedHardwareForFormula(record);
 assert.equal(q.gateCount,8);assert.equal(q.hardwareObservedHistorically,true);
 assert.equal(q.real16x6FormulaMeasurementComplete,false);
 for(const gate of q.gates){
   assert.equal(gate.realSixBySixteenSampleWindow,'MISSING');
   assert.equal(gate.calibratedFormulaEvaluation,'NOT_EXECUTED');
   assert.equal(gate.independentPhysicalQualification,false);
   assert.equal(gate.cpuBeforeAfterBenchmarkMeasured,false);
 }
 const byId=Object.fromEntries(q.gates.map(x=>[x.bridgeId,x]));
 for(const id of ['FORMULA_CPU_EXECUTION','FORMULA_MEMORY_FLOW','FORMULA_PCIE_TRANSFER',
  'FORMULA_STORAGE_IO','FORMULA_NETWORK_FLOW','FORMULA_SCHEDULER'])
  assert.equal(byId[id].inventoryState,'RETAINED_PHYSICAL_HARDWARE_INVENTORY_PRESENT',id);
 for(const id of ['FORMULA_CPU_CACHE','FORMULA_POWER_THERMAL'])
  assert.equal(byId[id].inventoryState,'REQUIRED_HARDWARE_FIELDS_NOT_PRESENT',id);
 assert.equal(q.physicalPcieTransferMeasured,false);
});
test('tampering with CPU metadata, source custody or execution state fails closed',()=>{
 for(const f of [
  v=>v.sourceReport.contentSha256='missing',
  v=>v.sourceReport.originalGeneratedAt='2026-11-22T00:00:00Z',
  v=>v.actualRetainedObservations.cpu.logicalProcessors=0,
  v=>v.actualRetainedObservations.ram.totalMemoryGb=-1,
  v=>v.formulaExecutionOnPc='VERIFIED'
 ]){
  const bad=structuredClone(record);f(bad);
  assert.throws(()=>qualifyRetainedHardwareForFormula(bad),/FORMULA_RETAINED_HARDWARE_/);
 }
});
test('a real running CPU completes exact reversible packing while physical PCIe stays unclaimed',()=>{
 const r=executeRealCpuRepresentationAB();
 assert.equal(r.cases.length,2);
 assert.ok(r.executionHost.logicalProcessors>0);
 assert.equal(r.physicalPcieTransferMeasured,false);
 assert.equal(r.nativeUserPcExecuted,false);
 assert.equal(r.userPhysicalGpuUsed,false);
 assert.equal(r.independentlyVeritasCertified,false);
 for(const c of r.cases){
  assert.equal(c.allExactReconstruction,true);
  assert.ok(c.baseline.medianWallMs>=0&&Number.isFinite(c.baseline.medianWallMs));
  assert.ok(c.formulaCandidate.medianWallMs>=0&&Number.isFinite(c.formulaCandidate.medianWallMs));
  assert.ok(c.formulaCandidate.payloadBytes<=c.baseline.payloadBytes);
  assert.equal(c.physicalPcieTransferMeasured,false);
  assert.equal(c.measuredHostCpuExecution,true);
 }
});
