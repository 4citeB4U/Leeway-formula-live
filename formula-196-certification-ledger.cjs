/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_196_EQUATION_EVIDENCE_LEDGER
WHAT: Read-only equation inventory and evidence mapping; never self-certifies.
WHY: Require one individually reviewable row per documented equation.
WHO: Creator-authorized LeeWay audit operator.
WHERE: Local audit script, outside frozen canonical runtime.
WHEN: 2026-10-25
HOW: Source parsing, SHA256, test evidence references, status OPEN until independent oracle.
AUTHORITY: AUDIT_ONLY; not a production authorization, Veritas, or Learning Ledger writer.
LICENSE: Existing LeeWay repository terms.
*/
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=__dirname;
const source='docs/reference/LeeWay-Formula-Mathematical-Engineering-Textbook-v2.html';
const html=fs.readFileSync(path.join(root,source),'utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const ids=[...html.matchAll(/<article\s+class="study"\s+id="eq-([^"]+)"/g)].map(m=>m[1]);
if(ids.length!==196||new Set(ids).size!==196)throw Error('INVENTORY_MISMATCH');
const known=[
['S', 'runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs','runtime/canonical/leeway-formula/v1/tests/golden-vector-v1.mjs'],
['F1', 'runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs','runtime/canonical/leeway-formula/v1/tests/reproducibility-v1.mjs']
];
const rows=ids.map((id,i)=>{const family=id.replace(/-\d+$/,'');const a=known.find(x=>x[0]===family);return {equationId:id,index:i+1,family,definitionSource:source,definitionSha256:sha(html),candidateImplementation:a?.[1]||null,candidateTest:a?.[2]||null,implementationVerified:false,independentOracleExecuted:false,edgeCasesPassed:false,productionAuthorityVerified:false,certification:'OPEN',reason:a?'FAMILY_LEVEL_CANDIDATE_ONLY_NO_PER_EQUATION_PROOF':'INDIVIDUAL_IMPLEMENTATION_AND_ORACLE_NOT_MAPPED'}});
const report={schema:'leeway.formula.equation-certification-audit.v1',authority:'AUDIT_ONLY',generatedAt:new Date().toISOString(),objects:rows.length,certified:rows.filter(x=>x.certification==='CERTIFIED').length,open:rows.filter(x=>x.certification==='OPEN').length,source,sourceSha256:sha(html),rows};
const out=path.join(root,'formula-196-certification-ledger.json');fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
const reread=JSON.parse(fs.readFileSync(out,'utf8'));if(reread.rows.length!==196||new Set(reread.rows.map(x=>x.equationId)).size!==196)throw Error('LEDGER_READBACK_FAILED');
console.log(JSON.stringify({ledger:out,objects:report.objects,certified:report.certified,open:report.open,sourceSha256:report.sourceSha256,ledgerSha256:sha(fs.readFileSync(out)),families:Object.fromEntries([...new Set(rows.map(x=>x.family))].map(f=>[f,rows.filter(x=>x.family===f).length]))},null,2));
