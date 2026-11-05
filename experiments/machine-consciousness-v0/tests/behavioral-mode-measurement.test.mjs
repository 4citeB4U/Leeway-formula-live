/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G9.BEHAVIOR.TEST
TAG: LEEWAY.FORMULA.MC_G9_BEHAVIORAL_MODE_TEST_V1
WHO: Formula research. WHAT: Verify bounded behavioral measurements, simulated dream and flow candidate semantics.
WHY: Neither inner thought nor autonomic routine may bypass original mission or independent authorization.
WHERE: experiments/machine-consciousness-v0/tests/behavioral-mode-measurement.test.mjs.
WHEN: 2026-11-04. HOW: Deterministic Node tests with synthetic data. LICENSE: MIT
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {BEHAVIORAL_MODES,measureBehavioralState,stageInnerThought,stageBehavioralMode} from '../behavioral-mode-measurement.mjs';
const H='a'.repeat(64);
const input=()=>({missionId:'mission-alpha',cycleStateHash:H,observationProvenance:'SIMULATED',
 metrics:{uncertainty:.2,predictionMismatch:.3,taskFamiliarity:.8,novelty:.1,
 urgency:.5,risk:.2,workspaceAccess:1},
 resources:{computePressure:.4,memoryPressure:.5,energyPressure:.1,foregroundDemand:.2}});
const observed=()=>measureBehavioralState(input());
const stage=(mode,extra={})=>stageBehavioralMode({
 observation:observed(),requestedMode:mode,sourceReceiptHash:H,candidateId:'candidate-alpha',...extra});
test('behavioral modes reflect proposed cognitive operating patterns, not actual sleep',()=>{
 assert.deepEqual(BEHAVIORAL_MODES,['FOREGROUND_DELIBERATION','FLOW_CANDIDATE','IDLE_CONSOLIDATION','OFFLINE_DREAM_REPLAY']);
});
test('deterministic measured state retains all actual inputs and exact mission',()=>{
 const a=observed(),b=observed();assert.deepEqual(a,b);
 assert.equal(a.status,'OBSERVATION_ONLY_NO_BEHAVIORAL_AUTHORITY');
 assert.equal(a.cognitive.taskFamiliarity,.8);assert.equal(a.interoception.energyPressure,.1);
 assert.equal(a.modeSelected,null);assert.equal(a.actionAuthorized,false);
 assert.equal(a.formulaExecution,'NOT_EXECUTED');assert.match(a.observationHash,/^[a-f0-9]{64}$/);
});
test('reject uncalibrated out of range and nonfinite measurements',()=>{
 const a=input();a.metrics.uncertainty=1.01;
 assert.equal(measureBehavioralState(a).reason,'MEASUREMENTS_INVALID_OR_UNCALIBRATED');
 const b=input();b.resources.foregroundDemand=NaN;
 assert.equal(measureBehavioralState(b).reason,'MEASUREMENTS_INVALID_OR_UNCALIBRATED');
 const c=input();c.metrics.risk=Infinity;
 assert.equal(measureBehavioralState(c).reason,'MEASUREMENTS_INVALID_OR_UNCALIBRATED');
});
test('missing mission/observation hash or provenance fails closed',()=>{
 const a=input();a.missionId='';
 assert.equal(measureBehavioralState(a).reason,'OBSERVATION_PROVENANCE_INVALID');
 const b=input();b.observationProvenance='VERIFIED_REAL';
 assert.equal(measureBehavioralState(b).reason,'OBSERVATION_PROVENANCE_INVALID');
});
test('private inner thought remains hypothesis and cannot claim separate executive identity',()=>{
 const x=stageInnerThought({observation:observed(),thoughtId:'thought-alpha',
 parentMissionId:'mission-alpha',kind:'PREDICTION',beliefHypothesis:'Need to inspect earlier evidence.',
 sourceRefs:['evidence-alpha']});
 assert.equal(x.status,'UNVERIFIED_PRIVATE_CANDIDATE');
 assert.equal(x.externalFact,false);assert.equal(x.spoken,false);
 assert.equal(x.actionAuthorized,false);assert.equal(x.verifiedLearning,false);
 assert.match(x.thoughtHash,/^[a-f0-9]{64}$/);
});
test('inner thought cannot drift to new parent mission or use unauthorized type',()=>{
 const a={observation:observed(),thoughtId:'thought-alpha',parentMissionId:'different-mission',
  kind:'QUESTION',beliefHypothesis:'What changed?'};
 assert.equal(stageInnerThought(a).reason,'INNER_THOUGHT_INVALID');
 a.parentMissionId='mission-alpha';a.kind='AUTHORITY_GRANT';
 assert.equal(stageInnerThought(a).reason,'INNER_THOUGHT_INVALID');
});
test('dream EVB is recorded as a synthetic replay candidate, never external history',()=>{
 const a=stage('OFFLINE_DREAM_REPLAY',{replayPriority:{gain:.2,need:.3}});
 assert.equal(a.priorityEVB,.06);
 assert.equal(a.replayProvenance,'SIMULATED_DREAM');
 assert.equal(a.advancesExternalTime,false);
 assert.equal(a.changesExternalWorld,false);
 assert.equal(a.actionAuthorized,false);
 assert.equal(a.liveModeSelected,false);
});
test('dream mode requires valid replay priority, not arbitrary confidence',()=>{
 assert.equal(stage('OFFLINE_DREAM_REPLAY').reason,'REPLAY_PRIORITY_INVALID');
 assert.equal(stage('OFFLINE_DREAM_REPLAY',{replayPriority:{gain:-1,need:1}}).reason,'REPLAY_PRIORITY_INVALID');
 assert.equal(stage('OFFLINE_DREAM_REPLAY',{replayPriority:{gain:1e308,need:1e308}}).reason,'REPLAY_PRIORITY_NONFINITE');
});
test('flow may be suggested but never authorizes physical action',()=>{
 const a=stage('FLOW_CANDIDATE');assert.equal(a.status,'UNAUTHORIZED_RESEARCH_MODE_CANDIDATE');
 assert.equal(a.actionAuthorized,false);assert.equal(a.authorityClass,'NO_NATIVE_DISPATCH');
 assert.equal(a.replayProvenance,null);
});
test('idle consolidation is not proof of human sleep or automatic task execution',()=>{
 const a=stage('IDLE_CONSOLIDATION');assert.equal(a.liveModeSelected,false);
 assert.equal(a.verifiedLearning,false);assert.equal(a.changesExternalWorld,false);
});
test('unsupported or duplicate authority-bearing mode names rejected',()=>{
 assert.equal(stage('ROOT_EXECUTION').reason,'MODE_CANDIDATE_INVALID');
 assert.equal(stage('AWAKE_AS_HUMAN').reason,'MODE_CANDIDATE_INVALID');
});
