import fs from 'node:fs';
import {simulateWorld} from '../machine-consciousness-v0/simulator.mjs';
import {deliberationBudgetCalibrated,mechanicalEmotionState,beliefStability,replayPriority} from './cognitive-math.mjs';

const scenarios=['stationary','changing','noisy','misleading','module-dropout'];
const calibration=JSON.parse(fs.readFileSync(new URL('../machine-consciousness-v0/outputs/calibration-candidate.json',import.meta.url),'utf8'));
const ranges=calibration.ranges;
const summary={schemaVersion:'0.2.0',status:'CALIBRATED_MATH_STRESS_CAMPAIGN',worldsPerScenario:128,cyclesPerWorld:32,scenarios:{},calibrationSource:'machine-consciousness-v0/outputs/calibration-candidate.json'};

function mean(a){return a.reduce((s,x)=>s+x,0)/Math.max(1,a.length);}
for(const scenario of scenarios){
  const budgets=[],pressures=[],stabilities=[],replay=[],emotions=[];
  const modes={FAST:0,NORMAL:0,DELIBERATE:0};
  for(let w=0;w<128;w++){
    const rows=simulateWorld({worldIndex:w,scenario,cycles:32,seed:20261001});
    let prev=[0.5,0.5];
    for(const r of rows){
      const m=r.metrics;
      const budget=deliberationBudgetCalibrated({
        beliefEntropy:m.belief_entropy_nats,
        predictionError:m.precision_weighted_prediction_error,
        informationGain:m.belief_information_gain_nats,
        selectedPolicyExpectedFreeEnergy:m.selected_policy_expected_free_energy,
        globalAccessRatio:m.global_access_ratio,
        selfModelConsistency:1,
        risk:0.10
      },ranges);
      budgets.push(budget.cycles);pressures.push(budget.pressure);modes[budget.mode]++;
      const e=mechanicalEmotionState({
        beliefEntropy:m.belief_entropy_nats,
        predictionError:m.precision_weighted_prediction_error,
        informationGain:m.belief_information_gain_nats,
        valence:m.valence_free_energy_rate,
        globalAccessRatio:m.global_access_ratio,
        risk:Math.min(1,m.selected_policy_expected_free_energy/2.25)
      });
      emotions.push(e);
      const current=r.cognitionView.posterior;
      stabilities.push(beliefStability(current,prev));
      const gain=Math.min(1,1-Math.exp(-m.precision_weighted_prediction_error));
      const need=Math.min(1,0.55*m.belief_information_gain_nats/0.28+0.45*(1-m.global_access_ratio));
      replay.push(replayPriority(gain,need));
      prev=current;
    }
  }
  summary.scenarios[scenario]={
    meanDeliberationCycles:mean(budgets),
    meanPressure:mean(pressures),
    modeDistribution:modes,
    meanBeliefStability:mean(stabilities),
    meanReplayPriority:mean(replay),
    meanEmotion:{
      calm:mean(emotions.map(x=>x.calm)),
      confusion:mean(emotions.map(x=>x.confusion)),
      frustration:mean(emotions.map(x=>x.frustration)),
      curiosity:mean(emotions.map(x=>x.curiosity)),
      confidence:mean(emotions.map(x=>x.confidence))
    }
  };
}
const rank=Object.entries(summary.scenarios).sort((a,b)=>b[1].meanDeliberationCycles-a[1].meanDeliberationCycles).map(([scenario,v])=>({scenario,meanDeliberationCycles:v.meanDeliberationCycles,meanPressure:v.meanPressure}));
summary.deliberationRanking=rank;
summary.claimBoundary='This campaign tests candidate mathematical response-depth behavior on simulated worlds only; it is not yet wired to Agent Lee language, skills, or real-world actions.';
fs.writeFileSync(new URL('./outputs/math-stress-campaign.json',import.meta.url),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));