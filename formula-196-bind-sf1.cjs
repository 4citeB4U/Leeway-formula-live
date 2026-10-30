/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_196_SF1_SOURCE_BINDING
WHAT: Trace candidate S/F1 functions to pinned, actual source with no certificate promotion.
WHY: Separate direct source evidence from independent mathematical certification.
WHO: LeeWay owner-authorized audit; WHERE: local standalone audit utility.
WHEN: 2026-10-25
HOW: Extract exported functions and validate ledger equations/record hashes.
AUTHORITY: AUDIT ONLY; never alters canonical files or grants execution.
LICENSE: Existing LeeWay repository terms.
*/
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=__dirname, ledgerPath=path.join(root,'formula-196-certification-ledger.json');
const db=JSON.parse(fs.readFileSync(ledgerPath,'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const refs=[
['S','runtime/canonical/leeway-formula/v1/canonical-input.mjs','runtime/canonical/leeway-formula/v1/tests/reproducibility-v1.mjs'],
['F1','runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs','runtime/canonical/leeway-formula/v1/tests/golden-vector-v1.mjs']
];
const extra=[
'runtime/canonical/leeway-formula/v1/base64-codec.mjs',
'runtime/canonical/leeway-formula/v1/rational.mjs',
'runtime/canonical/leeway-formula/v1/adapters/runtime-state-v1.mjs'
];
const evidence={};
for(const f of [...refs.map(x=>x[1]),...extra]){
 const data=fs.readFileSync(path.join(root,f),'utf8');
 evidence[f]={sha256:hash(data),exports:[...data.matchAll(/export (?:async )?(?:function|const|class) ([A-Za-z0-9_]+)/g)].map(x=>x[1])};
}
let n=0;for(const row of db.rows){
 if(!['S','F1'].includes(row.family))continue;
 const ref=refs.find(x=>x[0]===row.family);
 row.candidateImplementation=ref[1];row.candidateImplementationSha256=evidence[ref[1]].sha256;
 row.candidateTest=ref[2];row.candidateEvidenceType='FAMILY_LEVEL_SOURCE_EXPORTS_AND_TEST_FILES';
 row.relatedExports=evidence[ref[1]].exports;
 row.certification='OPEN';row.independentOracleExecuted=false;
 row.reason='EQUATION_SPECIFIC_FUNCTION_AND_INDEPENDENT_ORACLE_NOT_YET_ESTABLISHED';
 n++;
}
if(n!==36)throw Error('SF1_COUNT_MISMATCH');
const target=path.join(root,'formula-196-sf1-source-mapping.json');
fs.writeFileSync(target,JSON.stringify({schema:'leeway.formula.sf1-source-evidence.v1',sourceLedgerSha256:hash(fs.readFileSync(ledgerPath)),mapped:n,notCertified:n,evidence,rows:db.rows.filter(x=>['S','F1'].includes(x.family))},null,2)+'\n');
const readback=JSON.parse(fs.readFileSync(target,'utf8'));
if(readback.rows.length!==36||readback.rows.some(r=>r.certification!=='OPEN'))throw Error('SOURCE_MAP_READBACK_MISMATCH');
console.log(JSON.stringify({file:target,mapped:36,certified:0,filesVerified:Object.keys(evidence).length,mapSha256:hash(fs.readFileSync(target)),exports:evidence},null,2));
