/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: IH_EVIDENCE_V2
WHAT: Preserve eight additional structural oracle passes with source hashes.
WHY: No previously recorded proof overwritten.
WHO: LeeWay audit; WHERE: isolated audit; WHEN: 2026-10-25.
HOW: digest-verified predecessor and content-addressed append-only successor.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=__dirname,hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const parentName='formula-i-h-evidence-05c8c8dff14ce08c.json',parent=fs.readFileSync(path.join(root,parentName)),pin='05c8c8dff14ce08c03c60224046c6d11a66c49928122b18fd3649cee315d4761';
if(hash(parent)!==pin)throw Error('PARENT_HASH_MISMATCH');
const rows=JSON.parse(parent).rows,file='formula-i-h-remaining-states.test.mjs',src=fs.readFileSync(path.join(root,file));
const ids=['I-05','I-07','I-08','I-09','I-10','I-11','I-12','H-07'];
for(const row of rows)if(ids.includes(row.equationId)){if(row.evidence)throw Error('OVERWRITE_ATTEMPT');const assertion=row.equationId==='I-05'?'I-05 six distinct subsystem':row.equationId==='H-07'?'H-07 global node':row.equationId+' documented six-field';if(!src.toString().includes(row.equationId==='I-05'?'I-05 six distinct subsystem':row.equationId==='H-07'?'H-07 global node':"'"+row.equationId+"'"))throw Error('MISSING_TEST '+assertion);row.evidence={kind:'STRUCTURAL_ORACLE_ONLY',file,sha256:hash(src),assertion,result:'PASS_WITNESSED'};row.classification='PARTIAL_POSITIVE_EVIDENCE'}
const found=rows.filter(r=>r.evidence).length;if(found!==20)throw Error('COUNT_MISMATCH');
const result={schema:'leeway.formula.i-h.evidence.v2',parentSha256:pin,total:22,evidenceMapped:20,open:2,rows};const bytes=Buffer.from(JSON.stringify(result,null,2)+'\n'),digest=hash(bytes),target=path.join(root,'formula-i-h-evidence-v2-'+digest.slice(0,16)+'.json');
fs.writeFileSync(target,bytes,{flag:'wx'});if(hash(fs.readFileSync(target))!==digest)throw Error('READBACK_MISMATCH');console.log(JSON.stringify({path:target,sha256:digest,covered:20,open:rows.filter(r=>!r.evidence).map(r=>r.equationId)}));
