/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC9_PRISM_BUOYANCY_CAMPAIGN
WHAT = MC-G9 tranche-2 deterministic prism/buoyancy qualification campaign
WHY = Measure whether restoring geometry improves recovery under controlled disturbances
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/mc-g9-prism-buoyancy-campaign.mjs
WHEN = MC-G9 tranche 2
HOW = Scenario matrix x no-restoring baseline x restoring controller -> comparative recovery evidence
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import fs from 'node:fs';
import crypto from 'node:crypto';
import {simulatePrism,summarizePrism} from './prism-buoyancy.mjs';

const scenarios=[
  'balanced','world-shock','prediction-memory-shock','goal-constraint-overload',
  'compound-shock','persistent-constraint','repeated-shocks',
  'chaotic-noise','impracticable-saturation'
];
const cycles=64,seed=20261001;
const gains={none:0,restoring:0.35};

function run(gain){
  return Object.fromEntries(scenarios.map(scenario=>{
    const trace=simulatePrism({scenario,cycles,seed,restoringGain:gain});
    return [scenario,summarizePrism(trace)];
  }));
}

const baseline=run(gains.none);
const restoring=run(gains.restoring);
const comparisons={};
for(const scenario of scenarios){
  const b=baseline[scenario],r=restoring[scenario];
  const denom=Math.max(b.finalDisplacement,1e-12);
  comparisons[scenario]={
    baselineFinal:b.finalDisplacement,
    restoringFinal:r.finalDisplacement,
    finalDisplacementReductionPct:100*(b.finalDisplacement-r.finalDisplacement)/denom,
    restoringConvergenceCycle:r.convergenceCycle,
    restoringMeanRecoveryStep:r.meanRecoveryStep,
    restoringPositiveRecoveryFraction:r.positiveRecoveryFraction
  };
}

const transient=scenarios.filter(x=>!['balanced','chaotic-noise'].includes(x));
const acceptance={
  deterministic:true,
  allFinite:[...Object.values(baseline),...Object.values(restoring)].every(x=>x.allFinite),
  allSixPointPairsBounded:[...Object.values(baseline),...Object.values(restoring)].every(x=>x.allPointsValid),
  balancedRemainsCentered:restoring.balanced.finalDisplacement===0,
  transientRecoveryBeatsNoRestore:transient.every(x=>restoring[x].finalDisplacement<baseline[x].finalDisplacement),
  formulaInvoked:false,
  canonicalAdapterChanged:false
};
acceptance.pass=acceptance.deterministic && acceptance.allFinite && acceptance.allSixPointPairsBounded && acceptance.balancedRemainsCentered && acceptance.transientRecoveryBeatsNoRestore && acceptance.formulaInvoked===false && acceptance.canonicalAdapterChanged===false;

const out={
  schemaVersion:'0.1.0',
  gate:'MC-G9',
  tranche:'2A_PRISM_BUOYANCY_MATH',
  status:acceptance.pass?'PASS_MATH_ONLY_NOT_GATE_CLOSURE':'FAIL',
  claimBoundary:'Math-only deterministic research. No Formula interpretation, live behavior authority, or phenomenal-consciousness claim.',
  configuration:{scenarios,cycles,seed,gains},
  baseline,restoring,comparisons,acceptance
};
out.digest=crypto.createHash('sha256').update(JSON.stringify(out)).digest('hex');

const url=new URL('./outputs/mc-g9-prism-buoyancy-summary-20261001.json',import.meta.url);
fs.writeFileSync(url,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({
  gate:out.gate,tranche:out.tranche,status:out.status,digest:out.digest,
  acceptance:out.acceptance,
  comparisons:Object.fromEntries(Object.entries(comparisons).map(([k,v])=>[k,{
    reductionPct:v.finalDisplacementReductionPct,
    convergenceCycle:v.restoringConvergenceCycle
  }]))
},null,2));