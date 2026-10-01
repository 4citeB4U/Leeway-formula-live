/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC6_CALIBRATION_CAMPAIGN
5WH:
WHAT = Balanced train/holdout calibration campaign for the six independently recomputed cognition dimensions
WHY = Earn finite versioned ranges without holdout leakage before any numeric Formula cognition execution
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/calibration-campaign.mjs
WHEN = MC-6
HOW = 5 balanced scenarios x 200 worlds; first 160 worlds/scenario fit ranges; final 40/scenario hold out; verify coverage and runtime-state mapping only
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';
import fs from 'node:fs';
import {simulateWorld} from './simulator.mjs';
import {buildOperationalAwareness} from './workspace-self-model.mjs';
import {calculateCognitionDimensions} from './cognition-dimensions.mjs';
import {deriveCalibrationRanges,coverageForRows,createCalibrationProfile} from './calibration.mjs';
import {runtimeStateV1} from '../../runtime/canonical/leeway-formula/v1/adapters/runtime-state-v1.mjs';

const scenarios=['stationary','changing','noisy','misleading','module-dropout'];
const totalWorldsPerScenario=200,trainingWorldsPerScenario=160,holdoutWorldsPerScenario=40;
const cycles=64,seed=20261001;
const trainingRows=[],holdoutRows=[];
const trainingByScenario=Object.fromEntries(scenarios.map(s=>[s,[]]));
const holdoutByScenario=Object.fromEntries(scenarios.map(s=>[s,[]]));
let validationFailures=0;
const digest=crypto.createHash('sha256');

function dropoutFor(scenario,cycle){
  if(scenario!=='module-dropout')return [];
  if(cycle%5===2)return ['belief','valuation'];
  if(cycle%11===7)return ['memory'];
  return [];
}
function collectWorld(scenario,worldIndex,target,targetByScenario){
  const receipts=simulateWorld({worldIndex,scenario,cycles,seed});
  for(let i=0;i<receipts.length;i++){
    try{
      const awareness=buildOperationalAwareness(receipts[i],{dropoutModules:dropoutFor(scenario,receipts[i].cycle)});
      const calc=calculateCognitionDimensions({receipt:receipts[i],previousReceipt:i?receipts[i-1]:null,awareness});
      target.push([...calc.vector]);
      targetByScenario[scenario].push([...calc.vector]);
      digest.update(calc.sourceStateHash);
      digest.update(JSON.stringify(calc.vector));
    }catch{validationFailures++;}
  }
}

for(const scenario of scenarios){
  for(let worldIndex=0;worldIndex<totalWorldsPerScenario;worldIndex++){
    if(worldIndex<trainingWorldsPerScenario)collectWorld(scenario,worldIndex,trainingRows,trainingByScenario);
    else collectWorld(scenario,worldIndex,holdoutRows,holdoutByScenario);
  }
}

const derived=deriveCalibrationRanges(trainingRows);
const holdoutCoverage=coverageForRows(holdoutRows,derived.ranges);
const scenarioCoverage=Object.fromEntries(scenarios.map(s=>[s,coverageForRows(holdoutByScenario[s],derived.ranges)]));
const trainingSummary={
  worldsPerScenario:trainingWorldsPerScenario,
  cyclesPerScenario:trainingWorldsPerScenario*cycles,
  totalRows:trainingRows.length,
  balanced:scenarios.every(s=>trainingByScenario[s].length===trainingWorldsPerScenario*cycles)
};
const holdoutSummary={
  worldsPerScenario:holdoutWorldsPerScenario,
  cyclesPerScenario:holdoutWorldsPerScenario*cycles,
  totalRows:holdoutRows.length,
  coverage:holdoutCoverage,
  scenarioCoverage
};

let adapterWindowFailures=0,adapterWindows=0;
for(const scenario of scenarios){
  const rows=holdoutByScenario[scenario];
  for(let start=0;start+16<=rows.length;start+=16){
    try{
      const mapped=runtimeStateV1.toMatrix({
        stateRows:rows.slice(start,start+16),
        ranges:derived.ranges
      });
      if(mapped.matrix.length!==16||mapped.matrix.some(r=>r.length!==6||r.some(v=>!Number.isInteger(v)||v<0||v>69)))throw new Error('BAD_MATRIX');
    }catch{adapterWindowFailures++;}
    adapterWindows++;
  }
}

const minimumOverallCoverage=.9995;
const minimumScenarioDimensionCoverage=.999;
const scenarioCoveragePass=scenarios.every(s=>scenarioCoverage[s].perDimension.every(d=>d.coverage>=minimumScenarioDimensionCoverage));
const acceptance={
  trainingAtLeastTenThousandCyclesPerScenario:trainingSummary.cyclesPerScenario>=10000,
  balancedTraining:trainingSummary.balanced,
  noDimensionValidationFailures:validationFailures===0,
  finiteSixRanges:derived.ranges.length===6&&derived.ranges.every(r=>Number.isFinite(r[0])&&Number.isFinite(r[1])&&r[0]<r[1]),
  holdoutOverallCoverage:holdoutCoverage.overall>=minimumOverallCoverage,
  holdoutPerScenarioPerDimensionCoverage:scenarioCoveragePass,
  runtimeStateAdapterWindowsValid:adapterWindowFailures===0&&adapterWindows>0,
  formulaNotExecuted:true
};
acceptance.pass=Object.values(acceptance).every(Boolean);

const profile=createCalibrationProfile({
  ranges:derived.ranges,details:derived.details,
  training:trainingSummary,
  holdout:holdoutSummary
});
const out={
  schemaVersion:'0.1.0',
  campaignId:'MC-G6-CALIBRATION-20261001',
  scenarios,totalWorldsPerScenario,trainingWorldsPerScenario,holdoutWorldsPerScenario,
  cyclesPerWorld:cycles,validationFailures,
  ranges:derived.ranges,rangeDetails:derived.details,
  holdoutCoverage,scenarioCoverage,
  adapterWindows,adapterWindowFailures,
  thresholds:{minimumOverallCoverage,minimumScenarioDimensionCoverage},
  digest:digest.digest('hex'),
  formulaExecutionState:'NOT_EXECUTED',
  acceptance
};

fs.mkdirSync(new URL('./outputs/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('./outputs/mc-g6-calibration-summary.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
fs.writeFileSync(new URL('./outputs/mc-g6-calibration-profile-candidate.json',import.meta.url),JSON.stringify(profile,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(!acceptance.pass)process.exitCode=2;
