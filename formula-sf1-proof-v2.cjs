/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_SF1_EVIDENCE_V2
WHAT: Integrate five witnessed passing mathematical foundation tests without rewriting past evidence.
WHY: Maintain append-only audit provenance and distinguish mathematical oracle from production binding.
WHO: LeeWay audit; WHERE: isolated local audit; WHEN: 2026-10-25.
HOW: verify past map, check named tests, generate content-addressed new evidence artifact.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),root=__dirname;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const oldPath=path.join(root,'formula-sf1-equation-evidence.json'),previous=fs.readFileSync(oldPath);
const expected='8d38482d7730fb57919a75f574165fed20a8f26445d46ed047de4830f5d0ce51';
if(sha(previous)!==expected)throw Error('PREVIOUS_EVIDENCE_HASH_MISMATCH');
const original=JSON.parse(previous),name='formula-sf1-remaining-foundation-tests.mjs',source=fs.readFileSync(path.join(root,name));
const cases={'S-01':'S-01 normalized state mathematical range under valid bounds','S-03':'S-03 bounded raw Q69 equals normalized quantizer for in-range measurement','S-04':'S-04 q69FromPressure mathematical contract matches independent bounded expression','S-11':'S-11 six-bit domain cardinality and binary limits','S-12':'S-12 binary expansion reconstructs each six-bit value'};
for(const row of original.rows)if(cases[row.equationId]){if(row.evidenceClass!=='OPEN_NO_DIRECT_NAMED_TEST'||!source.toString().includes(cases[row.equationId]))throw Error('UNEXPECTED_ROW_OR_MISSING_TEST_'+row.equationId);Object.assign(row,{evidenceClass:'VERIFIED_MATHEMATICAL_ORACLE_ONLY',testName:cases[row.equationId],verifiedTestFile:name,testSourceSha256:sha(source),executionResult:'PASS_PREVIOUS_WITNESSED_RUN',certification:'OPEN',limitations:'Mathematical check; original production binding not independently executed'})}
const counts={total:original.rows.length,positiveOriginalBehavior:original.rows.filter(r=>r.evidenceClass==='VERIFIED_POSITIVE_TEST_EVIDENCE').length,mathematicalOracleOnly:original.rows.filter(r=>r.evidenceClass==='VERIFIED_MATHEMATICAL_ORACLE_ONLY').length,contractDifferences:original.rows.filter(r=>r.evidenceClass==='CONFIRMED_CONTRACT_DIFFERENCE').length,unmapped:original.rows.filter(r=>r.evidenceClass==='OPEN_NO_DIRECT_NAMED_TEST').length,independentlyCertified:0};
if(counts.total!==36||counts.positiveOriginalBehavior!==27||counts.mathematicalOracleOnly!==5||counts.contractDifferences!==4||counts.unmapped!==0)throw Error('CLASSIFICATION_MISMATCH');
const record={schema:'leeway.formula.sf1.equation-evidence.v2',previousEvidenceSha256:expected,scope:'S and F1 mathematical proof',counts,rows:original.rows};
const bytes=Buffer.from(JSON.stringify(record,null,2)+'\n'),digest=sha(bytes),target=path.join(root,'formula-sf1-equation-evidence-v2-'+digest.slice(0,16)+'.json');
fs.writeFileSync(target,bytes,{flag:'wx'});if(sha(fs.readFileSync(target))!==digest)throw Error('READBACK_HASH_MISMATCH');
console.log(JSON.stringify({file:target,sha256:digest,counts},null,2));
