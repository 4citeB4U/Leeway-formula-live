/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC9_PRISM_VERITAS
WHAT = Independent contract/regression verifier for MC-G9 prism tranche 2A
WHY = Prevent experiment self-assertion from being treated as gate evidence
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/mc-g9-prism-veritas.mjs
WHEN = MC-G9 tranche 2A
HOW = Re-read contract/output -> re-run tests -> hash canonical Formula -> inspect changed paths -> issue receipt
AGENTS: AUDIT VERIFY
LICENSE: MIT
*/

import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const readJson=url=>JSON.parse(fs.readFileSync(url,'utf8'));
const sha=url=>crypto.createHash('sha256').update(fs.readFileSync(url)).digest('hex');
const contractUrl=new URL('../../contracts/machine-consciousness-prism-v0.json',import.meta.url);
const outputUrl=new URL('./outputs/mc-g9-prism-buoyancy-summary-20261001.json',import.meta.url);
const engineUrl=new URL('../../runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs',import.meta.url);
const adapterUrl=new URL('../../runtime/canonical/leeway-formula/v1/adapters/runtime-state-v1.mjs',import.meta.url);
const sourceUrl=new URL('./prism-buoyancy.mjs',import.meta.url);
const campaignUrl=new URL('./mc-g9-prism-buoyancy-campaign.mjs',import.meta.url);
const testUrl=new URL('./tests/prism-buoyancy.test.mjs',import.meta.url);
const planUrl=new URL('../../docs/machine-consciousness/11-CONSCIOUSNESS-PRISM-EXPERIMENT-PLAN-v0.md',import.meta.url);

const contract=readJson(contractUrl);
const output=readJson(outputUrl);
const testFiles=fs.readdirSync(new URL('./tests/',import.meta.url))
  .filter(x=>x.endsWith('.test.mjs'))
  .map(x=>new URL('./tests/'+x,import.meta.url).pathname);
const tests=spawnSync(process.execPath,['--test',...testFiles],{encoding:'utf8'});
const testText=(tests.stdout||'')+(tests.stderr||'');
const countMatch=testText.match(/tests\s+(\d+)/);
const passMatch=testText.match(/pass\s+(\d+)/);
const failMatch=testText.match(/fail\s+(\d+)/);
const testCount=countMatch?Number(countMatch[1]):null;
const passCount=passMatch?Number(passMatch[1]):null;
const failCount=failMatch?Number(failMatch[1]):null;

const git=spawnSync('git',['status','--porcelain=v1'],{
  cwd:new URL('../../',import.meta.url).pathname,encoding:'utf8'
});
const changedPaths=(git.stdout||'').split(/\r?\n/).filter(Boolean).map(x=>x.slice(3));
const canonicalTouched=changedPaths.some(p=>p.startsWith('runtime/canonical/leeway-formula/v1/'));
const engineHash=sha(engineUrl),adapterHash=sha(adapterUrl);

const checks={
  contractExperimental:contract.status==='EXPERIMENTAL_MATH_ONLY',
  outputMathOnlyPass:output.status==='PASS_MATH_ONLY_NOT_GATE_CLOSURE'&&output.acceptance?.pass===true,
  testProcessPass:tests.status===0,
  testMinimumMet:Number.isInteger(testCount)&&testCount>=contract.acceptance.fullRegressionTestsMinimum,
  allTestsPassed:failCount===0&&passCount===testCount,
  engineHashPinned:engineHash===contract.formulaBoundary.engineSha256,
  runtimeAdapterHashPinned:adapterHash===contract.formulaBoundary.runtimeStateAdapterSha256,
  canonicalRuntimeUntouched:canonicalTouched===false,
  formulaNotInvoked:output.acceptance?.formulaInvoked===false,
  acceptedAdapterNotChanged:output.acceptance?.canonicalAdapterChanged===false,
  bounded:output.acceptance?.allSixPointPairsBounded===true,
  finite:output.acceptance?.allFinite===true
};
const pass=Object.values(checks).every(Boolean);

const receipt={
  schemaVersion:'0.1.0',
  receiptId:'MACHINE-CONSCIOUSNESS-MC-G9-PRISM-BUOYANCY-TRANCHE-2A-20261001',
  gate:'MC-G9',
  tranche:'2A_PRISM_BUOYANCY_MATH',
  status:pass?'PASS_MATH_ONLY_NOT_GATE_CLOSURE':'FAIL',
  authority:'Creator/Human Authority > LeeWay Standards',
  repository:'4citeB4U/Leeway-formula-live',
  branch:'mc-g9-prism-buoyancy-tranche2',
  sourceBaseCommit:'94967b9c4b50bbfe959dd3b94aa38be090de83e3',
  tests:{exitCode:tests.status,testCount,passCount,failCount},
  canonical:{engineSha256:engineHash,runtimeStateAdapterSha256:adapterHash,canonicalRuntimeTouched:canonicalTouched},
  experiment:{campaignDigest:output.digest,scenarios:output.configuration.scenarios,acceptance:output.acceptance},
  checks,

  artifactSha256:{
    contract:sha(contractUrl),
    source:sha(sourceUrl),
    campaign:sha(campaignUrl),
    tests:sha(testUrl),
    plan:sha(planUrl),
    output:sha(outputUrl)
  },
  changedPaths,
  formulaExecutionInThisTranche:'NOT_INVOKED',
  formulaInterpretationPromotion:'NONE',
  liveBehaviorAuthority:'NONE',
  claimBoundary:'This receipt verifies deterministic math/regression/hash conditions only. It does not close MC-G9 or establish subjective consciousness.'
};
receipt.receiptDigest=crypto.createHash('sha256').update(JSON.stringify(receipt)).digest('hex');

const receiptUrl=new URL('../../receipts/machine-consciousness/MACHINE-CONSCIOUSNESS-MC-G9-PRISM-BUOYANCY-TRANCHE-2A-20261001.json',import.meta.url);
const veritasUrl=new URL('./outputs/mc-g9-prism-veritas-20261001.json',import.meta.url);
fs.writeFileSync(receiptUrl,JSON.stringify(receipt,null,2)+'\n');
fs.writeFileSync(veritasUrl,JSON.stringify({status:receipt.status,checks,receiptDigest:receipt.receiptDigest},null,2)+'\n');
console.log(JSON.stringify({
  status:receipt.status,tests:receipt.tests,canonical:receipt.canonical,
  campaignDigest:receipt.experiment.campaignDigest,checks,receiptDigest:receipt.receiptDigest
},null,2));
if(!pass)process.exitCode=1;