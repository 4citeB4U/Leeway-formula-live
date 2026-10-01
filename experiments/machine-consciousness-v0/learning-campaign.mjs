/*
LEEWAY HEADER — DO NOT REMOVE

REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC2_CAMPAIGN

5WH:
WHAT = Compare no-learning control against oracle-supervised semantic learning across deterministic simulator scenario families
WHY = Qualify memory + learning before policy integration, dream replay or Formula execution
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/learning-campaign.mjs
WHEN = MC-2 gate
HOW = Replay identical MC-1 receipts through fixed and adaptive semantic models, measure pre-update predictive log loss, verify memory provenance

AGENTS:
ASSESS
AUDIT
EXECUTE
VERIFY

LICENSE:
MIT
*/

import fs from 'node:fs';
import {simulateWorld} from './simulator.mjs';
import {runLearningTrace,summarizeLoss,relativeImprovement,verifyMemoryChain} from './memory-learning.mjs';

const SCENARIOS={
  stationary:{window:[20,64]},
  changing:{window:[20,64]},
  noisy:{window:[12,64]},
  misleading:{window:[10,16]}
};
const WORLDS_PER_SCENARIO=256;
const CYCLES=64;
const SEED=20261001;

function avg(rows,key){
  return rows.reduce((s,r)=>s+r[key],0)/rows.length;
}
function aggregate(losses){
  return {
    sensorNll:avg(losses,'sensorNll'),
    transitionNll:avg(losses,'transitionNll'),
    combinedNll:avg(losses,'combinedNll')
  };
}

const summary={
  schemaVersion:'0.1.0',
  status:'MC2_LEARNING_CAMPAIGN',
  learningFeedbackClass:'ORACLE_SUPERVISED_TEST_ONLY',
  claimBoundary:'Oracle audit feedback is test-only evidence used to prove memory/learning mechanics. It is not an autonomous-awareness or production-learning claim.',
  seed:SEED,
  worldsPerScenario:WORLDS_PER_SCENARIO,
  cyclesPerWorld:CYCLES,
  formulaExecutionState:'NOT_EXECUTED',
  scenarios:{},
  integrity:{memoryChainFailures:0,provenanceViolations:0,sourceMutationFailures:0}
};

for(const [scenario,{window}] of Object.entries(SCENARIOS)){
  const baselineLosses=[],learningLosses=[];
  let finalSensor=0,finalSensorCount=0;
  for(let worldIndex=0;worldIndex<WORLDS_PER_SCENARIO;worldIndex++){
    const receipts=simulateWorld({worldIndex,scenario,cycles:CYCLES,seed:SEED});
    const baseline=runLearningTrace(receipts,{learningMode:'NONE'});
    const learned=runLearningTrace(receipts,{learningMode:'ORACLE_SUPERVISED_TEST_ONLY'});

    if(!verifyMemoryChain(baseline.memory)||!verifyMemoryChain(learned.memory))summary.integrity.memoryChainFailures++;
    if([...baseline.memory.entries,...learned.memory.entries].some(e=>e.provenance!=='SIMULATED'))summary.integrity.provenanceViolations++;
    if(!baseline.sourceReceiptsUnchanged||!learned.sourceReceiptsUnchanged)summary.integrity.sourceMutationFailures++;

    baselineLosses.push(summarizeLoss(baseline.records,{startCycle:window[0],endCycle:window[1]}));
    learningLosses.push(summarizeLoss(learned.records,{startCycle:window[0],endCycle:window[1]}));
    finalSensor+=learned.finalModel.sensorReliability;
    finalSensorCount++;
  }
  const baseline=aggregate(baselineLosses),learned=aggregate(learningLosses);
  summary.scenarios[scenario]={
    evaluationWindow:{startCycle:window[0],endCycleExclusive:window[1]},
    baseline,
    learned,
    improvement:{
      sensorNll:relativeImprovement(baseline,learned,'sensorNll'),
      transitionNll:relativeImprovement(baseline,learned,'transitionNll'),
      combinedNll:relativeImprovement(baseline,learned,'combinedNll')
    },
    meanFinalLearnedSensorReliability:finalSensor/finalSensorCount
  };
}

const stationaryRegression=-summary.scenarios.stationary.improvement.combinedNll;
summary.acceptance={
  noisySensorImprovementAtLeast5Pct:summary.scenarios.noisy.improvement.sensorNll>=.05,
  misleadingWindowSensorImprovementAtLeast5Pct:summary.scenarios.misleading.improvement.sensorNll>=.05,
  changingTransitionImprovementPositive:summary.scenarios.changing.improvement.transitionNll>0,
  stationaryCombinedRegressionAtMost5Pct:stationaryRegression<=.05,
  memoryChainIntact:summary.integrity.memoryChainFailures===0,
  provenancePreserved:summary.integrity.provenanceViolations===0,
  sourceReceiptsUnchanged:summary.integrity.sourceMutationFailures===0,
  formulaNotExecuted:summary.formulaExecutionState==='NOT_EXECUTED'
};
summary.pass=Object.values(summary.acceptance).every(Boolean);
summary.stationaryCombinedRegression=stationaryRegression;
summary.totalWorlds=WORLDS_PER_SCENARIO*Object.keys(SCENARIOS).length;
summary.totalCycles=summary.totalWorlds*CYCLES;

fs.mkdirSync(new URL('./outputs/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('./outputs/mc-g2-learning-summary.json',import.meta.url),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
if(!summary.pass)process.exitCode=2;
