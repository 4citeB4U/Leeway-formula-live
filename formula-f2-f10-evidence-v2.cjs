/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F2_F10_EVIDENCE_V2
WHAT: Append witnessed eight mathematical tests to existing 33-row evidence.
WHY: Preserve passing evidence, avoid falsely qualifying actual runtime implementations.
WHO: LeeWay audit; WHERE: isolated audit; WHEN: 2026-10-25.
HOW: Verify input ledger digest, map exact named tests and content-address output.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=__dirname;
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const prior=fs.readFileSync(path.join(root,'formula-f2-f10-equation-evidence.json'));if(sha(prior)!=='4ba55983c9e80b1bf02e393fd3246c35068819ad83280ce53b5e4826ab96befe')throw Error('PRIOR_SOURCE_HASH_CHANGED');
const db=JSON.parse(prior),file='formula-f2-f10-eight-oracles.mjs',source=fs.readFileSync(path.join(root,file));
const names={'F4-03':'F4-03 Veritas Q69 weighted score quantization','F4-04':'F4-04 three-way Veritas PASS/REPAIR/FAIL cases','F5-01':'F5-01 recovery vector assigns lexicographic dimensions and negatives','F5-02':'F5-02 highest recovery priority wins deterministic tie','F7-03':'F7-03 Little law arithmetic on positive rates','F7-04':'F7-04 queue saturation ratio under positive service capacity','F9-02':'F9-02 consensus ranking vector and deterministic ID','F9-03':'F9-03 consensus argmax ranks votes then Veritas and stable ID'};
for(const row of db.rows){if(!names[row.id])continue;if(row.mathematicalOracle||!source.toString().includes(names[row.id]))throw Error('MAPPING_CONFLICT_'+row.id);row.mathematicalOracle={source:file,sourceSha256:sha(source),assertion:names[row.id],observed:'PASS_WITNESSED',scope:'PURE_ORACLE_ONLY',limitations:['F4-04 incomplete gate-pass below-threshold case','F7-03 arithmetic identity only','F7-04 ratio examples only'].filter(x=>x.startsWith(row.id))};row.classification='MATHEMATICAL_ORACLE_VERIFIED_RUNTIME_EQUIVALENCE_OPEN'}
const count=db.rows.filter(x=>x.mathematicalOracle).length;if(count!==33)throw Error('INCOMPLETE_33');
const record={schema:'leeway.formula.f2-f10.equation-evidence.v2',priorSha256:sha(prior),mathOracleMapped:33,independentlyCertified:0,rows:db.rows};const b=Buffer.from(JSON.stringify(record,null,2)+'\n'),digest=sha(b),dest=path.join(root,'formula-f2-f10-evidence-v2-'+digest.slice(0,16)+'.json');fs.writeFileSync(dest,b,{flag:'wx'});if(sha(fs.readFileSync(dest))!==digest)throw Error('READBACK_FAILED');console.log(JSON.stringify({path:dest,sha256:digest,total:33,mathOracleMapped:33,independentlyCertified:0},null,2));
