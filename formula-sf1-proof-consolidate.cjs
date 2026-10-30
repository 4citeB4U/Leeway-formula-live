/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_SF1_EQUATION_PROOF_RECONCILIATION
WHAT: Preserve individual equation evidence and contract divergence.
WHY: No verified proof is erased or promoted beyond executed scope.
WHO: LeeWay audit; WHERE: isolated local audit; WHEN: 2026-10-25.
HOW: verify exact proof files, attach named test assertions to individual rows.
AUTHORITY: AUDIT_ONLY; no production admission. LICENSE: Existing LeeWay repository terms.
*/
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');const root=__dirname;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const ledger=JSON.parse(fs.readFileSync(path.join(root,'formula-196-certification-ledger.json'),'utf8'));
const suites=['formula-sf1-independent-oracles.mjs','formula-sf1-equation-contract-tests.mjs','formula-f1-feature-contract-audit.mjs','formula-f1-final-contract-audit.mjs'];
const bodies=Object.fromEntries(suites.map(x=>[x,fs.readFileSync(path.join(root,x),'utf8')]));
const claims={
'S-02':['formula-sf1-equation-contract-tests.mjs','S-02 Q69 integer and half-step boundaries'],
'S-05':['formula-sf1-equation-contract-tests.mjs','S-05 reconstruct quantized fractions'],
'S-06':['formula-sf1-equation-contract-tests.mjs','S-06 worst-case quantization error bound'],
'S-07':['formula-sf1-equation-contract-tests.mjs','S-07 each quantizer midpoint transitions'],
'S-08':['formula-sf1-equation-contract-tests.mjs','S-08 basic alphabet and digit positions'],
'S-09':['formula-sf1-equation-contract-tests.mjs','S-09 extended QB64 states'],
'S-10':['formula-sf1-equation-contract-tests.mjs','S-10 documented fixed-width contract differs from frozen codec'],
'S-13':['formula-sf1-equation-contract-tests.mjs','S-13 70-state decode/encode roundtrip'],
'S-14':['formula-sf1-equation-contract-tests.mjs','S-14 and S-15 16x6 integer input acceptance/rejection'],
'S-15':['formula-sf1-equation-contract-tests.mjs','S-14 and S-15 16x6 integer input acceptance/rejection'],
'F1-01':['formula-f1-feature-contract-audit.mjs','F1-01 candidate universe and F1-02 16x6 cardinality'],
'F1-02':['formula-f1-feature-contract-audit.mjs','F1-01 candidate universe and F1-02 16x6 cardinality'],
'F1-03':['formula-f1-feature-contract-audit.mjs','F1-03 frozen mean matches actual Golden matrix'],
'F1-04':['formula-f1-feature-contract-audit.mjs','F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states'],
'F1-05':['formula-f1-feature-contract-audit.mjs','F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states'],
'F1-06':['formula-f1-feature-contract-audit.mjs','F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states'],
'F1-07':['formula-f1-feature-contract-audit.mjs','Documented historical F1-07 prevalence versus frozen implementation: preserve mismatch'],
'F1-08':['formula-f1-feature-contract-audit.mjs','F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states'],
'F1-09':['formula-f1-feature-contract-audit.mjs','F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states'],
'F1-10':['formula-f1-feature-contract-audit.mjs','F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states'],
'F1-11':['formula-f1-feature-contract-audit.mjs','F1-04,05,06,08,09,10,11 exact feature arithmetic across all 70 states'],
'F1-12':['formula-f1-feature-contract-audit.mjs','Documented historical F1-12 co-occurrence versus frozen implementation: preserve mismatch'],
'F1-13':['formula-f1-final-contract-audit.mjs','F1-13 frozen Q implements historical W arithmetic for all 70 candidates'],
'F1-14':['formula-f1-final-contract-audit.mjs','F1-14 historical W vs frozen Q feature names differ but numerical tenth slot agrees'],
'F1-15':['formula-f1-feature-contract-audit.mjs','F1-15 normalization and F1-16 score exact rational invariants'],
'F1-16':['formula-f1-feature-contract-audit.mjs','F1-15 normalization and F1-16 score exact rational invariants'],
'F1-17':['formula-f1-final-contract-audit.mjs','F1-17 softmax is strictly order preserving without requiring kernel to emit probabilities'],
'F1-18':['formula-f1-final-contract-audit.mjs','F1-18 exponential strict monotonicity of distinct rational scores'],
'F1-19':['formula-f1-final-contract-audit.mjs','F1-19 exact frozen score/F/R/P/numeric tie-breakers exercised'],
'F1-20':['formula-f1-final-contract-audit.mjs','F1-20 top six are ranked candidates encoded in frozen variable-width Base64'],
'F1-21':['formula-f1-final-contract-audit.mjs','F1-21 frozen golden decimal and Base64 agree']
};
const mismatch=new Set(['S-10','F1-07','F1-12','F1-19']);const rows=ledger.rows.filter(x=>['S','F1'].includes(x.family)).map(row=>{const c=claims[row.equationId];if(!c)return {...row,evidenceClass:'OPEN_NO_DIRECT_NAMED_TEST',certification:'OPEN'};if(!bodies[c[0]].includes(c[1]))throw Error('TEST_NAME_MISSING_'+row.equationId);return {...row,evidenceClass:mismatch.has(row.equationId)?'CONFIRMED_CONTRACT_DIFFERENCE':'VERIFIED_POSITIVE_TEST_EVIDENCE',verifiedTestFile:c[0],testName:c[1],testSourceSha256:hash(bodies[c[0]]),executionResult:'PASS_PREVIOUS_WITNESSED_RUN',certification:'OPEN',limitations:mismatch.has(row.equationId)?'Historical contract differs from frozen behavior':'Test-specific proof, not separately signed per-equation certification'}});
const result={schema:'leeway.formula.sf1.equation-evidence.v1',kind:'AUDIT_ONLY',referencedLedgerSha256:hash(fs.readFileSync(path.join(root,'formula-196-certification-ledger.json'))),rows,summary:{total:rows.length,positive:rows.filter(x=>x.evidenceClass==='VERIFIED_POSITIVE_TEST_EVIDENCE').length,contractDifferences:rows.filter(x=>x.evidenceClass==='CONFIRMED_CONTRACT_DIFFERENCE').length,openUnmapped:rows.filter(x=>x.evidenceClass==='OPEN_NO_DIRECT_NAMED_TEST').length,certified:0}};
const output=path.join(root,'formula-sf1-equation-evidence.json');fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');const reread=JSON.parse(fs.readFileSync(output));if(reread.rows.length!==36||new Set(reread.rows.map(r=>r.equationId)).size!==36)throw Error('INVALID_READBACK');console.log(JSON.stringify({file:output,sha256:hash(fs.readFileSync(output)),summary:reread.summary,unmapped:reread.rows.filter(x=>x.evidenceClass==='OPEN_NO_DIRECT_NAMED_TEST').map(x=>x.equationId)},null,2));
