import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveCalibrationRanges,coverageForRows,validateRanges,createCalibrationProfile,CALIBRATION_MARGIN_FRACTION} from '../calibration.mjs';

const rows=[
  [0.1,1,-.2,.01,.5,.75],
  [0.2,2,.3,.02,.7,1],
  [0.3,3,.1,.03,.9,.875]
];

test('analytic H and B ranges are fixed independently of sample extrema',()=>{
  const c=deriveCalibrationRanges(rows);
  assert.deepEqual(c.ranges[0],[0,Math.log(2)]);
  assert.deepEqual(c.ranges[5],[0,1]);
});

test('empirical dimensions use training min/max plus fixed 5 percent margin',()=>{
  const c=deriveCalibrationRanges(rows);
  assert.equal(CALIBRATION_MARGIN_FRACTION,.05);
  assert.ok(c.ranges[1][0]<1&&c.ranges[1][1]>3);
  assert.ok(c.ranges[2][0]<-.2&&c.ranges[2][1]>.3);
  assert.ok(c.ranges[3][0]>=0&&c.ranges[3][1]>.03);
});

test('same rows produce identical calibration ranges',()=>{
  assert.deepEqual(deriveCalibrationRanges(rows),deriveCalibrationRanges(structuredClone(rows)));
});

test('coverage reports holdout outliers without modifying ranges',()=>{
  const c=deriveCalibrationRanges(rows),holdout=[...rows,[.2,99,.1,.02,.7,1]];
  const before=JSON.stringify(c.ranges);
  const cov=coverageForRows(holdout,c.ranges);
  assert.ok(cov.perDimension[1].above>0);
  assert.equal(JSON.stringify(c.ranges),before);
});

test('invalid ranges fail closed',()=>{
  assert.throws(()=>validateRanges([[0,1]]),/SIX_RANGES_REQUIRED/);
  assert.throws(()=>validateRanges([[0,1],[0,1],[1,1],[0,1],[0,1],[0,1]]),/RANGE_2_INVALID/);
});

test('profile remains candidate and Formula unexecuted',()=>{
  const c=deriveCalibrationRanges(rows),cov=coverageForRows(rows,c.ranges);
  const p=createCalibrationProfile({ranges:c.ranges,details:c.details,training:{rows:3},holdout:cov});
  assert.equal(p.status,'CANDIDATE_HOLDOUT_VALIDATED');
  assert.equal(p.formulaExecutionState,'NOT_EXECUTED');
  assert.equal(p.rangePolicy.holdoutLeakage,false);
});
