/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC9_CONTRIBUTION_AUDIT
WHAT = First MC-G9 contribution audit separating causal control from diagnostic information
WHY = Prevent non-causal state metrics from being credited for policy outcomes
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/mc-g9-contribution-audit.mjs
WHEN = MC-9
HOW = Qualified simulator traces -> independently recomputed dimensions -> outcome association -> source-path causal classification -> prior replay evidence synthesis
*/

import fs from 'node:fs';
import crypto from 'node:crypto';
import {simulateWorld} from './simulator.mjs';
import {buildOperationalAwareness} from './workspace-self-model.mjs';
import {calculateCognitionDimensions,DIMENSION_ORDER} from './cognition-dimensions.mjs';

const scenarios=['stationary','changing','noisy','misleading','module-dropout'];
const worldsPerScenario=128,cycles=64,seed=20261001;

function mean(a){return a.reduce((s,x)=>s+x,0)/Math.max(1,a.length);}
function variance(a){
  const m=mean(a); return mean(a.map(x=>(x-m)**2));
}
function corr(a,b){
  const ma=mean(a),mb=mean(b);
  let num=0,da=0,db=0;
  for(let i=0;i<a.length;i++){
    const x=a[i]-ma,y=b[i]-mb; num+=x*y;da+=x*x;db+=y*y;
  }
  return da&&db?num/Math.sqrt(da*db):0;
}
function dropoutFor(scenario,cycle){
  if(scenario!=='module-dropout')return [];
  if(cycle%5===2)return ['belief','valuation'];
  if(cycle%11===7)return ['memory'];
  return [];
}

const rows=[];
for(const scenario of scenarios){
  for(let worldIndex=0;worldIndex<worldsPerScenario;worldIndex++){
    const receipts=simulateWorld({worldIndex,scenario,cycles,seed});
    const awareness=receipts.map(r=>buildOperationalAwareness(r,{dropoutModules:dropoutFor(scenario,r.cycle)}));
    for(let i=0;i<receipts.length;i++){
      const receipt=receipts[i];
      const calc=calculateCognitionDimensions({
        receipt,
        previousReceipt:i?receipts[i-1]:null,
        awareness:awareness[i]
      });
      const predicted=receipt.cognitionView.prediction.redProbability;
      const observed=receipt.cognitionView.observation.red?1:0;
      rows.push({
        scenario,
        dimensions:calc.dimensions,
        unstableOutcome:receipt.execution.result.nextWorldState==='unstable'?1:0,
        observationSurprise:Math.abs(observed-predicted),
        accessIncomplete:awareness[i].broadcast.complete?0:1,
        policyG:calc.dimensions.selected_policy_expected_free_energy
      });
    }
  }
}

const diagnostics={};
for(const key of DIMENSION_ORDER){
  const x=rows.map(r=>r.dimensions[key]);
  diagnostics[key]={
    n:x.length,
    mean:mean(x),
    variance:variance(x),
    corrWithUnstableOutcome:corr(x,rows.map(r=>r.unstableOutcome)),
    corrWithObservationSurprise:corr(x,rows.map(r=>r.observationSurprise)),
    corrWithAccessIncomplete:corr(x,rows.map(r=>r.accessIncomplete)),
    scenarioMeans:Object.fromEntries(scenarios.map(s=>[s,mean(rows.filter(r=>r.scenario===s).map(r=>r.dimensions[key]))]))
  };
}

const contributionMap={
  belief_entropy_nats:{
    currentRole:'DIAGNOSTIC',
    causalInBasePolicy:false,
    contribution:'Quantifies posterior uncertainty and separates clean from ambiguous/noisy states.',
    limitation:'Current base policy does not directly consume realized H.'
  },
  precision_weighted_prediction_error:{
    currentRole:'DIAGNOSTIC_AND_LEARNING_SIGNAL',
    causalInBasePolicy:false,
    contribution:'Measures prediction mismatch and supports learning/recovery diagnostics.',
    limitation:'Current base action selector does not directly consume realized PE.'
  },
  valence_free_energy_rate:{
    currentRole:'DIAGNOSTIC_CANDIDATE_VALUATION',
    causalInBasePolicy:false,
    contribution:'Tracks direction of model-fit change and supports mechanical-emotion state.',
    limitation:'Current base policy does not yet use V to choose actions.'
  },
  belief_information_gain_nats:{
    currentRole:'DIAGNOSTIC_REALIZED_INFORMATION',
    causalInBasePolicy:false,
    contribution:'Measures realized belief update after observation.',
    limitation:'Policy uses expected information value inside candidate G; realized IG is not itself a direct policy input.'
  },
  selected_policy_expected_free_energy:{
    currentRole:'CAUSAL_POLICY_CONTROL',
    causalInBasePolicy:true,
    contribution:'Candidate policy G directly shapes softmax policy probabilities and therefore action selection.',
    limitation:'Its useful task interpretation still requires comparative/ablation validation.'
  },
  global_access_ratio:{
    currentRole:'DIAGNOSTIC_WORKSPACE_INTEGRITY',
    causalInBasePolicy:false,
    contribution:'Measures verified module availability and exposes dropout/incomplete access.',
    limitation:'Current base policy does not yet slow, stop, or reroute based on B.'
  },
  selfModel:{
    currentRole:'INTEGRITY_AND_CAUSAL_OWNERSHIP',
    causalInBasePolicy:false,
    contribution:'Verifies factual identity/capability/authority state and prevents fabricated self claims.',
    limitation:'Current simulator does not use self-model consistency to optimize task policy.'
  },
  dreamReplay:{
    currentRole:'LEARNING_MODIFIER',
    causalInBasePolicy:'INDIRECT',
    contribution:'Replay can modify learned sensor/transition parameters before future prediction/policy.',
    limitation:'MC-G4 evidence is mixed: EVB narrowly improves noisy sensor NLL but regresses combined NLL in all tested scenarios.'
  }
};

const replaySummary=JSON.parse(fs.readFileSync(new URL('./outputs/mc-g4-dream-replay-summary-20261001.json',import.meta.url),'utf8'));
const mc8Summary=JSON.parse(fs.readFileSync(new URL('./outputs/mc-g8/mc-g8-summary.json',import.meta.url),'utf8'));

const out={
  schemaVersion:'1.0.0',
  gate:'MC-G9',
  status:'TRANCHE_1_CONTRIBUTION_AUDIT',
  rows:rows.length,
  scenarios,
  worldsPerScenario,
  cyclesPerWorld:cycles,
  contributionMap,
  diagnosticAssociations:diagnostics,
  priorReplayEvidence:{
    evbMetricWins:replaySummary.evbMetricWins,
    evbCombinedScenarioWins:replaySummary.evbCombinedScenarioWins,
    falseRealMemoryCount:replaySummary.integrity.falseRealMemoryCount
  },
  formulaEvidence:{
    mc8ExecutionState:mc8Summary.runtimeExecutionState,
    mc8VerificationStatus:mc8Summary.verificationStatus,
    interpretationStatus:mc8Summary.interpretationStatus,
    semanticUseInThisAudit:'NONE'
  },
  conclusion:{
    causalToday:['selected_policy_expected_free_energy','dreamReplay (indirect through learned model)'],
    diagnosticToday:['belief_entropy_nats','precision_weighted_prediction_error','valence_free_energy_rate','belief_information_gain_nats','global_access_ratio','selfModel'],
    promotionBoundary:'Diagnostic usefulness does not grant action authority. Next tranche must run controlled policy/learning ablations against simpler baselines.'
  }
};
out.digest=crypto.createHash('sha256').update(JSON.stringify(out)).digest('hex');

fs.writeFileSync(new URL('./outputs/mc-g9-contribution-audit.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({
  gate:out.gate,status:out.status,rows:out.rows,digest:out.digest,
  causalToday:out.conclusion.causalToday,
  diagnosticToday:out.conclusion.diagnosticToday,
  replay:out.priorReplayEvidence
},null,2));
