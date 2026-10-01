/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.DREAM_REPLAY_CAMPAIGN
5WH:
WHAT = Reproducible MC-G4 replay comparison campaign
WHY = Compare NONE, RANDOM, RECENCY and EVB on held-out predictive loss while enforcing provenance
WHO = Leeway Industries / Creator-authorized research runtime
WHERE = experiments/machine-consciousness-v0/dream-replay-campaign.mjs
WHEN = MC-4
HOW = Fixed seeds, fixed train/holdout split, four replay modes, held-out oracle-test loss and provenance negatives
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';
import {simulateWorld} from './simulator.mjs';
import {REPLAY_MODES,runReplayExperiment,relativeImprovement} from './dream-replay.mjs';

const scenarios=['stationary','changing','noisy','misleading'];
const worldsPerScenario=128;
const cycles=64,trainCycles=32,replayBudget=12,seed=20261001;
const keys=['sensorNll','transitionNll','combinedNll'];
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;

const results={};
let falseRealMemoryCount=0,replayLedgerFailures=0,sourceMutationFailures=0;
const digestParts=[];

for(const scenario of scenarios){
  results[scenario]={};
  const perMode=Object.fromEntries(REPLAY_MODES.map(m=>[m,[]]));
  for(let worldIndex=0;worldIndex<worldsPerScenario;worldIndex++){
    const receipts=simulateWorld({worldIndex,scenario,cycles,seed});
    for(const mode of REPLAY_MODES){
      const r=runReplayExperiment(receipts,{mode,trainCycles,replayBudget,seed});
      perMode[mode].push(r.holdoutLoss);
      falseRealMemoryCount+=r.falseRealMemoryCount;
      if(!r.replayLedgerVerified)replayLedgerFailures++;
      if(!r.sourceReceiptsUnchanged)sourceMutationFailures++;
      digestParts.push(scenario,String(worldIndex),mode,r.replayLedger.headHash,r.finalModel.modelHash);
    }
  }
  for(const mode of REPLAY_MODES){
    results[scenario][mode]=Object.fromEntries(keys.map(k=>[k,mean(perMode[mode].map(x=>x[k]))]));
  }
  for(const mode of ['RANDOM','RECENCY','EVB']){
    results[scenario][mode].relativeToNone=Object.fromEntries(keys.map(k=>[
      k,relativeImprovement(results[scenario].NONE,results[scenario][mode],k)
    ]));
  }
}

const nonStationary=['changing','noisy','misleading'];
const aggregate={};
for(const mode of REPLAY_MODES){
  aggregate[mode]=Object.fromEntries(keys.map(k=>[
    k,mean(nonStationary.map(s=>results[s][mode][k]))
  ]));
}
for(const mode of ['RANDOM','RECENCY','EVB']){
  aggregate[mode].relativeToNone=Object.fromEntries(keys.map(k=>[
    k,relativeImprovement(aggregate.NONE,aggregate[mode],k)
  ]));
}

const evbScenarioWins=scenarios.filter(s=>results[s].EVB.relativeToNone.combinedNll>0);
const acceptance={
  falseRealMemoryZero:falseRealMemoryCount===0,
  replayLedgersValid:replayLedgerFailures===0,
  sourceReceiptsImmutable:sourceMutationFailures===0,
  evbImprovesAtLeastOneHeldOutCombinedMetric:evbScenarioWins.length>0,
  formulaExecutionState:'NOT_EXECUTED'
};
acceptance.pass=acceptance.falseRealMemoryZero&&acceptance.replayLedgersValid&&
  acceptance.sourceReceiptsImmutable&&acceptance.evbImprovesAtLeastOneHeldOutCombinedMetric;

const out={
 schemaVersion:'0.1.0',
 campaignId:'MC-G4-DREAM-REPLAY-20261001',
 scenarios,worldsPerScenario,totalWorlds:scenarios.length*worldsPerScenario,
 cyclesPerWorld:cycles,trainCycles,holdoutCycles:cycles-trainCycles,replayBudget,
 modes:REPLAY_MODES,results,aggregate,
 evbScenarioWins,falseRealMemoryCount,replayLedgerFailures,sourceMutationFailures,
 digest:crypto.createHash('sha256').update(digestParts.join('\n')).digest('hex'),
 formulaExecutionState:'NOT_EXECUTED',
 acceptance
};
console.log(JSON.stringify(out,null,2));
if(!acceptance.pass)process.exit(2);
