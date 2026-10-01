/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC5_DIMENSION_CAMPAIGN
5WH:
WHAT = Reproducible MC-G5 independent six-dimension qualification campaign
WHY = Prove all candidate cognition dimensions can be independently recomputed from receipt/workspace evidence
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/dimension-campaign.mjs
WHEN = MC-5
HOW = Generate receipts -> build operational workspace -> independently recalculate H,PE,V,IG,G,B -> compare to embedded diagnostics
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';
import fs from 'node:fs';
import {simulateWorld} from './simulator.mjs';
import {buildOperationalAwareness} from './workspace-self-model.mjs';
import {DIMENSION_ORDER,calculateCognitionDimensions,calculateDimensionWindow} from './cognition-dimensions.mjs';

const scenarios=['stationary','changing','noisy','misleading','module-dropout'];
const worldsPerScenario=128,cycles=64,seed=20261001;
const maxAbsDifference=Object.fromEntries(DIMENSION_ORDER.map(k=>[k,0]));
let worlds=0,totalCycles=0,validationFailures=0,nonFinite=0,windowFailures=0;
const digest=crypto.createHash('sha256');

function dropoutFor(scenario,cycle){
  if(scenario!=='module-dropout')return [];
  if(cycle%5===2)return ['belief','valuation'];
  if(cycle%11===7)return ['memory'];
  return [];
}

for(const scenario of scenarios){
  for(let worldIndex=0;worldIndex<worldsPerScenario;worldIndex++){
    const receipts=simulateWorld({worldIndex,scenario,cycles,seed});
    const awareness=receipts.map(r=>buildOperationalAwareness(r,{dropoutModules:dropoutFor(scenario,r.cycle)}));
    for(let i=0;i<receipts.length;i++){
      let calc;
      try{
        calc=calculateCognitionDimensions({receipt:receipts[i],previousReceipt:i?receipts[i-1]:null,awareness:awareness[i]});
      }catch{validationFailures++;continue;}
      totalCycles++;
      for(const k of DIMENSION_ORDER){
        const v=calc.dimensions[k];
        if(!Number.isFinite(v))nonFinite++;
        maxAbsDifference[k]=Math.max(maxAbsDifference[k],Math.abs(v-receipts[i].metrics[k]));
      }
      digest.update(calc.sourceStateHash);
      digest.update(JSON.stringify(calc.vector));
    }
    for(let start=0;start<cycles;start+=16){
      try{
        calculateDimensionWindow(receipts.slice(start,start+16),awareness.slice(start,start+16),{previousReceipt:start?receipts[start-1]:null});
      }catch{windowFailures++;}
    }
    worlds++;
  }
}

const tolerance=1e-12;
const acceptance={
  allCyclesRecomputed:totalCycles===worlds*cycles,
  noValidationFailures:validationFailures===0,
  allFinite:nonFinite===0,
  allSixMatchEmbeddedDiagnosticWithinTolerance:DIMENSION_ORDER.every(k=>maxAbsDifference[k]<=tolerance),
  all16CycleWindowsValid:windowFailures===0,
  formulaNotExecuted:true
};
acceptance.pass=Object.values(acceptance).every(Boolean);

const out={schemaVersion:'0.1.0',campaignId:'MC-G5-INDEPENDENT-DIMENSIONS-20261001',scenarios,worldsPerScenario,worlds,cyclesPerWorld:cycles,totalCycles,dimensionOrder:DIMENSION_ORDER,maxAbsDifference,tolerance,validationFailures,nonFinite,windowFailures,digest:digest.digest('hex'),formulaExecutionState:'NOT_EXECUTED',acceptance};
fs.mkdirSync(new URL('./outputs/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('./outputs/mc-g5-dimension-summary.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(!acceptance.pass)process.exitCode=2;
