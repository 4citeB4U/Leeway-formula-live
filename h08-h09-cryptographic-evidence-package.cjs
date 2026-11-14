/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.EVIDENCE
TAG: H08_H09_CRYPTOGRAPHIC_EVIDENCE_PACKAGE
WHAT: Bind verified original execution evidence to exact source and test hashes.
WHY: Carry established positive results into qualified approval without inventing signatures.
WHO: LeeWay audit. WHERE: Audit checkout. WHEN: 2026-10-25.
HOW: SHA256 strict source/readback and predecessor pinning.
AUTHORITY: AUDIT_ONLY; NOT A PRODUCTION SIGNATURE. LICENSE: Existing LeeWay terms.
*/
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),root='E:\\LeeWay-Work',out=__dirname;
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const files=['LeeWay-Edge-GPU/core/hybrid.dispatcher.js','LeeWay-Edge-GPU/core/inference-contract.mjs','ldwmd-gpu-admission-g1/automation-runtime/src/vtensor/vram-database.mjs','LeeWay-Edge-GPU/tests/virtual-gpu/tensor-unit.test.mjs','LeeWay-Edge-GPU/tests/virtual-gpu/governed-inference.test.mjs'];
const audits=['formula-h08-original-ldwmd.test.mjs','formula-h09-recovery-transition.test.mjs','formula-h08-h09-audit-binding-5ab2021462471e2b.json','formula-i-h-evidence-v2-254872a10f4b68b7.json','h08-h09-browser-acceptance/acceptance.json'];
const pins=[...files.map(f=>({path:path.join(root,f),sha256:hash(fs.readFileSync(path.join(root,f)))})),...audits.map(f=>({path:path.join(out,f),sha256:hash(fs.readFileSync(path.join(out,f)))}))];
const browser=JSON.parse(fs.readFileSync(path.join(out,'h08-h09-browser-acceptance/acceptance.json')));
if(browser.outcome!=='PASS_LOCAL_COMPONENT_TESTS'||browser.passCount!==47||browser.testCount!==47)throw Error('BROWSER_RECORD_INCONSISTENT');
const pkg={schema:'leeway.h08-h09.cryptographic-integrity-evidence.v1',authority:'LEEWAY_AUDIT_INTEGRITY_ONLY',sourceHashAlgorithm:'SHA-256',pinnedArtifacts:pins,observations:[
{scope:'ORIGINAL_LDWMD_MOCK_ADAPTER',status:'PASS',tests:1},
{scope:'ORIGINAL_HYBRID_DISPATCH_SYNTHETIC_RECOVERY',status:'PASS',tests:3},
{scope:'GPU_ORIGINAL_REGRESSION_NODE',status:'PASS',tests:66},
{scope:'GPU_BROWSER_COMPONENT_ACCEPTANCE',status:'PASS',tests:47,reportedAdapter:browser.browserTests?.adapter||null}
],verifiedClaim:'EVIDENCE_FILES_AND_CURRENT_SOURCES_HASH_PINNED',notVerified:['PRODUCTION_CRYPTOGRAPHIC_ISSUER_SIGNATURE','H08_H09_APPROVED_CANONICAL_FORMULA_SOURCE_DESIGNATION','PRODUCTION_FULL_CHAIN_EXECUTION']};
const bytes=Buffer.from(JSON.stringify(pkg,null,2)+'\n'),digest=hash(bytes),dest=path.join(out,'h08-h09-cryptographic-evidence-'+digest.slice(0,16)+'.json');fs.writeFileSync(dest,bytes,{flag:'wx'});if(hash(fs.readFileSync(dest))!==digest)throw Error('READBACK_HASH_MISMATCH');console.log(JSON.stringify({path:dest,sha256:digest,pins:pins.length,testsPreserved:117,scope:pkg.verifiedClaim,productionSignature:'NOT_VERIFIED'},null,2));
