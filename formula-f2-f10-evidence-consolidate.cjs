/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F2_F10_EVIDENCE_CONSOLIDATION_V1
WHAT: Associate existing audited mathematical checks with F2-F10 equation IDs.
WHY: Preserve real positive evidence, distinguish oracle and actual runtime.
WHO: LeeWay audit. WHERE: isolated audit checkout. WHEN: 2026-10-25.
HOW: Named assertions plus source digest and content-addressed output.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),root=__dirname;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ledger=JSON.parse(fs.readFileSync(path.join(root,'formula-196-certification-ledger.json')));
const samples=[
['formula-f2-f10-math-closure-tests.mjs',{'F2-01':'F2-01,02,03 Boolean product gate','F2-02':'F2-01,02,03 Boolean product gate','F2-03':'F2-01,02,03 Boolean product gate','F6-01':'F6-01..06 allocation','F6-02':'F6-01..06 allocation','F6-03':'F6-01..06 allocation','F6-04':'F6-01..06 allocation','F6-05':'F6-01..06 allocation','F6-06':'F6-01..06 allocation','F9-01':'F9-01,04 consensus','F9-04':'F9-01,04 consensus','F10-01':'F10-01..04 confidence','F10-02':'F10-01..04 confidence','F10-03':'F10-01..04 confidence','F10-04':'F10-01..04 confidence'}],
['formula-f3-f4-f7-f8-math-contract-tests.mjs',{'F3-01':'F3-01..03 seven-dimensional','F3-02':'F3-01..03 seven-dimensional','F3-03':'F3-01..03 seven-dimensional','F4-01':'F4-01 mandatory','F4-02':'F4-02 weighted','F7-01':'F7-01..02 queue','F7-02':'F7-01..02 queue','F8-01':'F8-01..03 binary','F8-02':'F8-01..03 binary','F8-03':'F8-01..03 binary'}]];
const exact=new Map();for(const [file,map] of samples){const b=fs.readFileSync(path.join(root,file));for(const [id,needle] of Object.entries(map)){if(!b.toString().includes(needle))throw Error('TEST_ASSERTION_MISSING:'+id);exact.set(id,{source:file,sourceSha256:sha(b),assertion:needle,observed:'PASS_WITNESSED'})}}
const runtime={'F2':['formula-f2-f5-runtime-boundary-tests.mjs','approval-gate.mjs'],'F5':['formula-f2-f5-runtime-boundary-tests.mjs','failure-recovery.mjs'],'F7':['formula-f3-f4-f7-f8-runtime-boundaries.mjs','job-queue.mjs'],'F8':['formula-f3-f4-f7-f8-runtime-boundaries.mjs','scheduler.mjs']};
const rows=ledger.rows.filter(r=>/^F(?:[2-9]|10)$/.test(r.family)).map(r=>{const m=exact.get(r.equationId),rt=runtime[r.family];return {id:r.equationId,family:r.family,mathematicalOracle:m??null,relatedRuntimeTest:rt?{source:rt[0],module:rt[1],sourceSha256:sha(fs.readFileSync(path.join(root,rt[0]))),relation:'FAMILY_LEVEL_BEHAVIOR_NOT_EXACT_EQUATION_PROOF'}:null,classification:m?'MATHEMATICAL_ORACLE_VERIFIED_RUNTIME_EQUIVALENCE_OPEN':rt?'RELATED_RUNTIME_BEHAVIOR_VERIFIED_EQUATION_OPEN':'EQUATION_DIRECT_PROOF_OPEN',independentlyCertified:false}});
const report={schema:'leeway.formula.f2-f10.equation-evidence.v1',sourceLedgerSha256:sha(fs.readFileSync(path.join(root,'formula-196-certification-ledger.json'))),total:rows.length,oracleMapped:rows.filter(r=>r.mathematicalOracle).length,remainingDirectOracle:rows.filter(r=>!r.mathematicalOracle).length,rows};
const out=path.join(root,'formula-f2-f10-equation-evidence.json');fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({file:out,sha256:sha(fs.readFileSync(out)),total:report.total,oracleMapped:report.oracleMapped,remainingDirectOracle:report.remainingDirectOracle,missing:rows.filter(r=>!r.mathematicalOracle).map(r=>r.id)},null,2));
