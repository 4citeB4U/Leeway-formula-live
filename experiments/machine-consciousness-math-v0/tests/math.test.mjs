import test from 'node:test';
import assert from 'node:assert/strict';
import {
  entropy,jsd,beliefStability,selfConsistency,informationGain,
  valenceFromFreeEnergy,globalAccess,replayPriority,deliberationBudget,mechanicalEmotionState,
  deliberationBudgetCalibrated,LN2
} from '../cognitive-math.mjs';

test('entropy is zero for certainty and ln2 for balanced binary belief',()=>{
  assert.ok(Math.abs(entropy([1,0]))<1e-12);
  assert.ok(Math.abs(entropy([0.5,0.5])-LN2)<1e-12);
});

test('JSD is symmetric and bounded by ln2 for binary distributions',()=>{
  const a=jsd([0.9,0.1],[0.1,0.9]);
  const b=jsd([0.1,0.9],[0.9,0.1]);
  assert.ok(Math.abs(a-b)<1e-12);
  assert.ok(a>=0&&a<=LN2+1e-12);
});

test('belief stability is one for identical beliefs and drops when belief moves',()=>{
  assert.ok(Math.abs(beliefStability([0.7,0.3],[0.7,0.3])-1)<1e-12);
  assert.ok(beliefStability([0.95,0.05],[0.05,0.95])<0.6);
});

test('self consistency is one when predicted and observed self-state match',()=>{
  assert.ok(Math.abs(selfConsistency([0.8,0.2],[0.8,0.2])-1)<1e-12);
  assert.ok(selfConsistency([0.9,0.1],[0.1,0.9])<1);
});

test('information gain is nonnegative and zero when posterior equals prior',()=>{
  assert.ok(Math.abs(informationGain([0.6,0.4],[0.6,0.4]))<1e-12);
  assert.ok(informationGain([0.9,0.1],[0.6,0.4])>0);
});

test('valence sign follows improvement versus worsening free energy',()=>{
  assert.ok(valenceFromFreeEnergy(0.5,1.0)>0);
  assert.ok(valenceFromFreeEnergy(1.2,0.7)<0);
});

test('global access is an acknowledgement ratio',()=>{
  assert.equal(globalAccess(8,8),1);
  assert.equal(globalAccess(6,8),0.75);
});

test('dream EVB priority rises with gain or need',()=>{
  assert.ok(replayPriority(0.8,0.9)>replayPriority(0.4,0.9));
  assert.ok(replayPriority(0.8,0.9)>replayPriority(0.8,0.2));
});

test('easy state gets a smaller deliberation budget than hard state',()=>{
  const easy=deliberationBudget({
    beliefEntropy:0.08,predictionError:0.03,informationGain:0.01,
    selectedPolicyExpectedFreeEnergy:0.15,globalAccessRatio:1,selfModelConsistency:1,risk:0.05
  });
  const hard=deliberationBudget({
    beliefEntropy:LN2,predictionError:3.4,informationGain:0.27,
    selectedPolicyExpectedFreeEnergy:2.2,globalAccessRatio:0.75,selfModelConsistency:0.45,risk:0.9
  });
  assert.ok(hard.pressure>easy.pressure);
  assert.ok(hard.cycles>easy.cycles);
  assert.equal(easy.mode,'FAST');
  assert.equal(hard.mode,'DELIBERATE');
});

test('deliberation budget remains bounded',()=>{
  for(const x of [0,1,10,100]){
    const r=deliberationBudget({
      beliefEntropy:x,predictionError:x,informationGain:x,
      selectedPolicyExpectedFreeEnergy:x,globalAccessRatio:0,selfModelConsistency:0,risk:1
    });
    assert.ok(r.pressure>=0&&r.pressure<=1);
    assert.ok(r.cycles>=1&&r.cycles<=16);
  }
});

test('mechanical emotion is a mixture rather than an exclusive label',()=>{
  const e=mechanicalEmotionState({
    beliefEntropy:LN2*0.9,predictionError:2.5,informationGain:0.25,
    valence:-0.8,globalAccessRatio:0.75,risk:0.7
  });
  for(const v of Object.values(e)) assert.ok(v>=0&&v<=1);
  assert.ok(e.confusion>0.4);
  assert.ok(e.frustration>0.4);
  assert.ok(e.curiosity>0);
  assert.ok(e.confidence>0);
});

test('clean stable state is calmer and more confident than a noisy high-error state',()=>{
  const clean=mechanicalEmotionState({
    beliefEntropy:0.08,predictionError:0.03,informationGain:0.01,
    valence:0.3,globalAccessRatio:1,risk:0.05
  });
  const noisy=mechanicalEmotionState({
    beliefEntropy:LN2,predictionError:3.4,informationGain:0.27,
    valence:-1.0,globalAccessRatio:0.75,risk:0.9
  });
  assert.ok(clean.calm>noisy.calm);
  assert.ok(clean.confidence>noisy.confidence);
  assert.ok(noisy.frustration>clean.frustration);
  assert.ok(noisy.confusion>clean.confusion);
});

test('calibrated deliberation keeps low-end measured state cheap',()=>{
  const ranges={
    belief_entropy_nats:[0.08395538298515615,0.693138875100141],
    precision_weighted_prediction_error:[0.2909187794253438,3.4368373018627056],
    belief_information_gain_nats:[0.03193183018717445,0.2786373517579769],
    selected_policy_expected_free_energy:[0.696881358954609,2.2038682700088406],
    global_access_ratio:[0.75,1]
  };
  const low=deliberationBudgetCalibrated({
    beliefEntropy:ranges.belief_entropy_nats[0],
    predictionError:ranges.precision_weighted_prediction_error[0],
    informationGain:ranges.belief_information_gain_nats[0],
    selectedPolicyExpectedFreeEnergy:ranges.selected_policy_expected_free_energy[0],
    globalAccessRatio:1,selfModelConsistency:1,risk:0
  },ranges);
  const high=deliberationBudgetCalibrated({
    beliefEntropy:ranges.belief_entropy_nats[1],
    predictionError:ranges.precision_weighted_prediction_error[1],
    informationGain:ranges.belief_information_gain_nats[1],
    selectedPolicyExpectedFreeEnergy:ranges.selected_policy_expected_free_energy[1],
    globalAccessRatio:0.75,selfModelConsistency:0.4,risk:1
  },ranges);
  assert.equal(low.mode,'FAST');
  assert.ok(low.cycles<=3);
  assert.equal(high.mode,'DELIBERATE');
  assert.ok(high.cycles>=12);
});
