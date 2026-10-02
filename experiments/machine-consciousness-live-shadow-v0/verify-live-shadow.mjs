/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.L1_PHONE_SHADOW.VERITAS
WHAT = Independent verifier for the live observe-only phone consciousness shadow
WHY = Convert physical live behavior into inspectable evidence instead of trusting UI appearance
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-live-shadow-v0/verify-live-shadow.mjs
WHEN = 2026-10-01 onward
HOW = Live HTTP probes + boot journal + state journal + source/hash checks -> receipt
AGENTS: AUDIT VERIFY
LICENSE: MIT
*/

import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const HERE=fileURLToPath(new URL('.',import.meta.url));
const ROOT=fileURLToPath(new URL('../../',import.meta.url));
const shaFile=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const lines=p=>fs.readFileSync(p,'utf8').trim().split(/\n/).filter(Boolean).map(JSON.parse);
const post=async(q)=>{
  const r=await fetch('http://127.0.0.1:8789/api/ask',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({q})});
  return {status:r.status,body:await r.json()};
};

const contract=readJson(HERE+'live-shadow-contract-v0.json');
const page=await fetch('http://127.0.0.1:8789/');
const pageText=await page.text();
const stateResp=await fetch('http://127.0.0.1:8789/api/state');
const state=await stateResp.json();

const formula=await post('what is the Formula status?');
const memory=await post('do you remember the prior state?');
const arithmetic=await post('what is 17 times 6?');
const unknown=await post('tell me something impossible');

const boots=lines(HERE+'outputs/boot-sessions.jsonl');
const journal=lines(HERE+'outputs/live-state.jsonl');
const lastBoot=boots.at(-1);
const previousBoot=boots.length>1?boots.at(-2):null;
const priorExists=journal.some(x=>x.stateHash===lastBoot?.priorStateHash);
const source=fs.readFileSync(HERE+'live-shadow.mjs','utf8');

const enginePath=ROOT+'runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs';
const adapterPath=ROOT+'runtime/canonical/leeway-formula/v1/adapters/runtime-state-v1.mjs';
const checks={
  contractObserveOnly:contract.authority==='OBSERVE_ONLY',
  llmDependencyZero:state.llmDependency===0,
  livePageReachable:page.ok&&pageText.includes('LIVE PHONE SHADOW'),
  stateEndpointReachable:stateResp.ok,
  formulaHealthReal:state.evidence?.formula?.healthy===true&&state.evidence.formula.status==='LEEWAY_FORMULA_V1_PASS',
  formulaIntentCorrect:formula.status===200&&formula.body.intent==='formula',
  memoryIntentCorrect:memory.status===200&&memory.body.intent==='memory'&&memory.body.state.continuityVerified===true,
  arithmeticCorrect:arithmetic.status===200&&arithmetic.body.intent==='arithmetic'&&arithmetic.body.answer==='102',
  unknownFailsExplicitly:unknown.status===200&&unknown.body.intent==='unknown'&&unknown.body.matched===false,
  restartHasTwoBoots:boots.length>=2&&previousBoot?.pid!==lastBoot?.pid,
  latestBootContinuity:lastBoot?.continuityVerified===true&&Boolean(lastBoot?.priorStateHash)&&priorExists,
  formulaEvaluateRouteAbsent:!source.includes('/runtime/formula/v1/evaluate'),
  canonicalEnginePinned:shaFile(enginePath)==='6502791bba909d7481db3a204f3cbf67b1dc06a4b76a73c797d709408341d63e',
  canonicalAdapterPinned:shaFile(adapterPath)==='3264d0a97a76246b31c5ca759b5993188cbae10422eb153ac395e3fb5e2470e0',
  authorityObserveOnly:state.authority?.mode==='OBSERVE_ONLY'&&state.authority?.liveAnswerAuthority==='NONE',
  finitePrism:Array.isArray(state.prism?.axis)&&state.prism.axis.every(Number.isFinite)&&Number.isFinite(state.prism.balance)
};
const pass=Object.values(checks).every(Boolean);

const receipt={
  schemaVersion:'0.1.0',
  receiptId:'MACHINE-CONSCIOUSNESS-L1-PHONE-SHADOW-LIVE-TEST-20261001',
  status:pass?'PASS_LIVE_SHADOW_ONLY':'FAIL',
  gate:'L1_PREPROMOTION_SHADOW',
  mcG9GateClosure:false,
  authority:'OBSERVE_ONLY',
  host:'authorized Android workstation / Termux',
  url:'http://127.0.0.1:8789/',
  checks,
  liveState:{
    stateHash:state.stateHash,
    priorStateHash:state.priorStateHash,
    continuityVerified:state.continuityVerified,
    classification:state.prism.classification,
    balance:state.prism.balance,
    formulaStatus:state.evidence.formula.status,
    availableMemoryRatio:state.evidence.memoryResource.availableRatio,
    predictionConfidence:state.prediction.confidence,
    predictionError:state.predictionError
  },
  restartEvidence:{
    bootCount:boots.length,
    previousBoot:previousBoot?{pid:previousBoot.pid,stateHash:previousBoot.stateHash,bootHash:previousBoot.bootHash}:null,
    lastBoot:lastBoot?{pid:lastBoot.pid,stateHash:lastBoot.stateHash,priorStateHash:lastBoot.priorStateHash,bootHash:lastBoot.bootHash}:null,
    priorHashFoundInStateJournal:priorExists
  },
  questionEvidence:{
    formula:{intent:formula.body.intent,answer:formula.body.answer},
    memory:{intent:memory.body.intent,answer:memory.body.answer},
    arithmetic:{intent:arithmetic.body.intent,answer:arithmetic.body.answer},
    unknown:{intent:unknown.body.intent,matched:unknown.body.matched,answer:unknown.body.answer}
  },
  canonical:{
    engineSha256:shaFile(enginePath),
    runtimeStateAdapterSha256:shaFile(adapterPath)
  },
  claimBoundary:'This proves a real phone-side observe-only deterministic cognition shadow with persistent state and bounded question handling. It does not prove general intelligence, semantic understanding, live Agent Lee integration, autonomous learning, or phenomenal consciousness.'
};
receipt.receiptDigest=crypto.createHash('sha256').update(JSON.stringify(receipt)).digest('hex');
fs.writeFileSync(ROOT+'receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-L1-PHONE-SHADOW-LIVE-TEST-20261001.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({status:receipt.status,checks,liveState:receipt.liveState,restartEvidence:receipt.restartEvidence,receiptDigest:receipt.receiptDigest},null,2));
if(!pass)process.exitCode=1;