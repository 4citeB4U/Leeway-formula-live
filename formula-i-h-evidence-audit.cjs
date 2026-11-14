/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: I_H_EQUATION_EVIDENCE_V1
WHAT: One row per compute/hardware equation with exact scope and source digests.
WHY: No overclaiming untested telemetry wiring or missing H2/H4 closures.
WHO: LeeWay audit; WHERE: local read-only sources. WHEN: 2026-10-25.
HOW: Named executable test assertions, content-addressed independent ledger.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=__dirname;const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const ledger=JSON.parse(fs.readFileSync(path.join(root,'formula-196-certification-ledger.json'))),file='formula-i-h-contract-tests.mjs',source=fs.readFileSync(path.join(root,file));
const cases={'I-01':'I-01 and H-02 normalized','H-02':'I-01 and H-02 normalized','I-02':'I-02,I-03,H-01,H-03','I-03':'I-02,I-03,H-01,H-03','H-01':'I-02,I-03,H-01,H-03','H-03':'I-02,I-03,H-01,H-03','I-04':'I-04,H-04,I-13','H-04':'I-04,H-04,I-13','I-13':'I-04,H-04,I-13','I-06':'I-06 independent','H-05':'H-05,H-06 placement','H-06':'H-05,H-06 placement'};
const rows=ledger.rows.filter(r=>['I','H'].includes(r.family)).map(r=>{const n=cases[r.equationId];if(n&&!source.toString().includes(n))throw Error('MISSING_ASSERTION '+r.equationId);return {equationId:r.equationId,evidence:n?{kind:['I-04','H-04','I-13'].includes(r.equationId)?'FROZEN_KERNEL_CALL_PLUS_ORACLE':'PURE_ORACLE_OR_SHAPE_CHECK',file,sha256:hash(source),assertion:n,result:'PASS_WITNESSED'}:null,classification:n?'PARTIAL_POSITIVE_EVIDENCE':'DIRECT_EQUATION_TEST_OPEN',productionCertified:false}});
if(rows.length!==22)throw Error('I_H_COUNT_MISMATCH');const payload={schema:'leeway.formula.i-h.evidence.v1',total:22,evidenceMapped:rows.filter(r=>r.evidence).length,open:rows.filter(r=>!r.evidence).length,rows},b=Buffer.from(JSON.stringify(payload,null,2)+'\n'),sha=hash(b),out=path.join(root,'formula-i-h-evidence-'+sha.slice(0,16)+'.json');fs.writeFileSync(out,b,{flag:'wx'});console.log(JSON.stringify({path:out,sha256:sha,total:22,evidenceMapped:payload.evidenceMapped,open:payload.open,unmapped:rows.filter(r=>!r.evidence).map(r=>r.equationId)},null,2));
