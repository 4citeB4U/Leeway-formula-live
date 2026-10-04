import test from 'node:test';
import assert from 'node:assert/strict';
import {SPATIAL_DIMENSION_ORDER,ingestSpatialObservation,compareSpatialLoad} from '../spatial-cortex.mjs';

const fixture=(values,sourceClass='TEST_FIXTURE')=>({
  schemaVersion:'0.1.0',
  sourceClass,
  mappingId:'personal-map-spatial-density-v0',
  dimensionOrder:[...SPATIAL_DIMENSION_ORDER],
  values,
  complete:true,
  formulaAuthority:'LEEWAY-FORMULA-v1.0_UNCHANGED',
  policyAuthority:'DIAGNOSTIC_ONLY'
});

test('spatial cortex accepts six finite Maps measurements without executing Formula',()=>{
  const out=ingestSpatialObservation(fixture([30,14,7.5,8,20,32]));
  assert.equal(out.formulaMutation,false);
  assert.equal(out.formulaExecutionState,'NOT_EXECUTED_BY_SPATIAL_CORTEX');
  assert.equal(out.policyAuthority,'DIAGNOSTIC_ONLY');
  assert.equal(out.derived.motionDensity,14/30);
  assert.equal(out.derived.responsivenessPressure,52);
});

test('real browser evidence is candidate ablation, not automatic policy authority',()=>{
  const out=ingestSpatialObservation(fixture([50,10,4,12,17,25],'REAL_BROWSER_MEASUREMENT'));
  assert.equal(out.policyAuthority,'CANDIDATE_ABLATION');
});

test('incomplete or non-finite spatial evidence fails closed',()=>{
  assert.throws(()=>ingestSpatialObservation({...fixture([1,2,3,4,5,6]),complete:false}),/SPATIAL_OBSERVATION_REJECTED/);
  assert.throws(()=>ingestSpatialObservation(fixture([1,2,NaN,4,5,6])),/SPATIAL_OBSERVATION_REJECTED/);
});

test('comparison exposes load deltas without inventing Formula meaning',()=>{
  const out=compareSpatialLoad(fixture([20,5,10,6,16,20]),fixture([40,8,7,9,24,30]));
  assert.equal(out.delta.visibleSpatialCandidates,20);
  assert.equal(out.delta.routeDeviationM,-3);
  assert.equal(out.delta.responsivenessPressure,18);
  assert.equal(out.interpretationState,'DIAGNOSTIC_ONLY');
});
