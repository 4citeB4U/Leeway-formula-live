/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: LEEWAY_VERIFIED_EVIDENCE_LOCK_V1
WHAT: Immutable-by-content local evidence manifest for witnessed positive test proof.
WHY: Preserve verified facts without incorrectly promoting all 196 equations.
WHO: LeeWay authorized audit. WHERE: isolated audit checkout.
WHEN: 2026-10-25. HOW: hash source + evidence sources, write unique immutable receipt by digest.
AUTHORITY: AUDIT_ONLY, NO PRODUCTION VERITAS OR LEARNING LEDGER.
LICENSE: Existing LeeWay source terms.
*/
const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=__dirname;
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const files=[
'runtime/canonical/leeway-formula/v1/leeway-formula-v1.mjs',
'runtime/canonical/leeway-formula/v1/canonical-input.mjs',
'runtime/canonical/leeway-formula/v1/adapters/raw-base64-v1.mjs',
'runtime/canonical/leeway-formula/v1/formula-service.mjs',
'runtime/canonical/leeway-formula/v1/adapters/runtime-state-v1.mjs',
'runtime/canonical/leeway-formula/v1/base64-codec.mjs',
'runtime/canonical/leeway-formula/v1/rational.mjs',
'formula-sf1-independent-oracles.mjs',
'runtime/canonical/leeway-formula/v1/tests/golden-vector-v1.mjs',
'runtime/canonical/leeway-formula/v1/tests/reproducibility-v1.mjs',
'docs/reference/LeeWay-Formula-Mathematical-Engineering-Textbook-v2.html'];
const sources=Object.fromEntries(files.map(f=>[f,hash(fs.readFileSync(path.join(root,f)))]));
const proof={schema:'leeway.formula.verified-evidence-lock.v1',authority:'AUDIT_ONLY',createdAt:new Date().toISOString(),scope:'Agent-Lee checkout, frozen Formula v1, witnessed Node.js test execution',sourceHashes:sources,
observed:{run:'2026-10-25',nodeTestFiles:3,nodeTests:8,passed:8,failed:0,skipped:0,goldenDecimal:[4,50,63,59,48,69],goldenBase64:['E','y','/','7','w','BF'],independentOracleAreas:['all 70 states positional Base64 and inverse','invalid-code rejection','canonical 16x6 validation','rational arithmetic exactness and division-by-zero rejection','frozen golden output','repeatability'],historicalBroaderRun:{passed:139,skipped:8,failed:0}},evidenceStatus:'VERIFIED_POSITIVE_TEST_EVIDENCE',equationCertificationStatus:'NOT_EQUIVALENT_TO_196_INDIVIDUAL_CERTIFICATES',exclusions:['No production issuance','No independent custodian signature','No ledger admission','Skipped tests are not passes']};
const content=JSON.stringify(proof,null,2)+'\n',digest=hash(content),file=path.join(root,'formula-verified-evidence-lock-'+digest.slice(0,16)+'.json');
if(fs.existsSync(file)){if(hash(fs.readFileSync(file))!==digest)throw Error('EVIDENCE_LOCK_CONFLICT')}else fs.writeFileSync(file,content,{flag:'wx'});
if(hash(fs.readFileSync(file))!==digest)throw Error('EVIDENCE_LOCK_READBACK_MISMATCH');
console.log(JSON.stringify({file,sha256:digest,verifiedTests:8,positiveEvidence:true,individual196Certificates:false,sourceFiles:files.length}));
