/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC3_CAMPAIGN
5WH:
WHAT = Reproducible MC-G3 operational workspace and factual self-model qualification campaign
WHY = Verify repaired contract alignment across scenario families and thousands of cognition cycles
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/workspace-campaign.mjs
WHEN = MC-G3 requalification
HOW = MC-1 receipts + non-learning episodic trace -> 8-module cycle-hash workspace -> sealed broadcast -> factual self-model -> independent verification
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import crypto from 'node:crypto';
import fs from 'node:fs';
import {simulateWorld} from './simulator.mjs';
import {runLearningTrace} from './memory-learning.mjs';
import {
  REQUIRED_WORKSPACE_MODULES,
  buildOperationalAwareness
} from './workspace-self-model.mjs';

const SCENARIOS=['stationary','changing','noisy','misleading','module-dropout'];
const WORLDS_PER_SCENARIO=128;
const CYCLES=64;
const SEED=20261001;

function dropoutFor(scenario,cycle){
  if(scenario!=='module-dropout')return [];
  if(cycle%5===2)return ['belief','valuation'];
  if(cycle%11===7)return ['memory'];
  return [];
}

const digest=crypto.createHash('sha256');
const summary={
  schemaVersion:'0.1.0',
  status:'MC3_REQUALIFICATION_CAMPAIGN',
  sourceIdentity:'cycleStateHash',
  envelopeIntegrity:'workspaceHash',
  requiredModules:[...REQUIRED_WORKSPACE_MODULES],
  formulaExecutionState:'NOT_EXECUTED',
  worlds:0,
  cycles:0,
  workspaceVerified:0,
  selfModelVerified:0,
  selfModelAccuracyOne:0,
  completeWorkspaceCycles:0,
  dropoutCycles:0,
  sourceMutationFailures:0,
  minGlobalAccess:1,
  maxGlobalAccess:0,
  scenarios:{}
};

for(const scenario of SCENARIOS){
  const s={
    worlds:0,cycles:0,workspaceVerified:0,selfModelVerified:0,
    completeWorkspaceCycles:0,dropoutCycles:0,minGlobalAccess:1,maxGlobalAccess:0
  };
  for(let worldIndex=0;worldIndex<WORLDS_PER_SCENARIO;worldIndex++){
    const receipts=simulateWorld({worldIndex,scenario,cycles:CYCLES,seed:SEED});
    const before=JSON.stringify(receipts);
    const memory=runLearningTrace(receipts,{learningMode:'NONE'});
    for(let i=0;i<receipts.length;i++){
      const receipt=receipts[i],record=memory.records[i];
      const dropoutModules=dropoutFor(scenario,receipt.cycle);
      const awareness=buildOperationalAwareness(receipt,{
        semanticModelHash:record.modelAfter.modelHash,
        memoryHeadHash:record.memoryEntryHash,
        dropoutModules
      });
      const B=awareness.awarenessMetrics.global_access_ratio;
      summary.cycles++;s.cycles++;
      if(awareness.workspaceVerified){summary.workspaceVerified++;s.workspaceVerified++;}
      if(awareness.selfModelVerified){summary.selfModelVerified++;s.selfModelVerified++;}
      if(awareness.selfModelEvaluation.accuracy===1)summary.selfModelAccuracyOne++;
      if(awareness.broadcast.complete){summary.completeWorkspaceCycles++;s.completeWorkspaceCycles++;}
      else {summary.dropoutCycles++;s.dropoutCycles++;}
      summary.minGlobalAccess=Math.min(summary.minGlobalAccess,B);
      summary.maxGlobalAccess=Math.max(summary.maxGlobalAccess,B);
      s.minGlobalAccess=Math.min(s.minGlobalAccess,B);
      s.maxGlobalAccess=Math.max(s.maxGlobalAccess,B);
      digest.update(awareness.workspaceState.cycleStateHash);
      digest.update(awareness.workspaceState.workspaceHash);
      digest.update(awareness.selfModel.selfModelHash);
      digest.update(String(B));
    }
    if(JSON.stringify(receipts)!==before)summary.sourceMutationFailures++;
    summary.worlds++;s.worlds++;
  }
  summary.scenarios[scenario]=s;
}

summary.digest=digest.digest('hex');
summary.acceptance={
  exactRequiredModuleSet:JSON.stringify(summary.requiredModules)===JSON.stringify([
    'perception','belief','prediction','valuation','policy','memory','self-model','veritas'
  ]),
  everyWorkspaceVerified:summary.workspaceVerified===summary.cycles,
  everySelfModelVerified:summary.selfModelVerified===summary.cycles,
  everySelfModelAccuracyOne:summary.selfModelAccuracyOne===summary.cycles,
  dropoutRepresented:summary.dropoutCycles>0&&summary.minGlobalAccess<1,
  fullAccessRepresented:summary.completeWorkspaceCycles>0&&summary.maxGlobalAccess===1,
  sourceReceiptsUnchanged:summary.sourceMutationFailures===0,
  formulaNotExecuted:summary.formulaExecutionState==='NOT_EXECUTED'
};
summary.pass=Object.values(summary.acceptance).every(Boolean);

fs.mkdirSync(new URL('./outputs/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('./outputs/mc-g3-workspace-summary.json',import.meta.url),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
if(!summary.pass)process.exitCode=2;
