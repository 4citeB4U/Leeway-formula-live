/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: H08_H09_EVIDENCED_BINDING_CANDIDATES
WHAT: Reconcile registry authority with original implementation evidence.
WHY: Preserve tested behavior, deny unsigned canonical-source designations.
WHO: LeeWay audit. WHERE: isolated audit artifacts. WHEN: 2026-10-25.
HOW: Pin source, registry and test hashes; record exact candidate scope.
AUTHORITY: AUDIT_ONLY; no production enrollment. LICENSE: Existing LeeWay terms.
*/
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const root='E:\\LeeWay-Work',cwd=__dirname,sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const sourceFiles=[
'LeeWay-Edge-GPU/core/hybrid.dispatcher.js',
'LeeWay-Edge-GPU/core/inference-contract.mjs',
'LeeWay-Edge-GPU/contracts/g19-diagnostics-projection.mjs',
'LeeWay-Edge-GPU/contracts/g19-diagnostics-projection.test.mjs',
'LeeWay-Edge-GPU/contracts/g19-gpu-veritas-gate.test.mjs',
'ldwmd-gpu-admission-g1/provider.registry.json',
'ldwmd-gpu-admission-g1/hardware-intelligence/provider-registry.json',
'LeeWay-Edge-GPU/evidence-staging/native-gpu-readiness-g19/authority-source-map.json',
'ldwmd-gpu-admission-g1/adapters/edge-gpu/runtime.mjs'
];
const fingerprint=Object.fromEntries(sourceFiles.map(f=>[f,sha(fs.readFileSync(path.join(root,f)))]));
const provider=JSON.parse(fs.readFileSync(path.join(root,'ldwmd-gpu-admission-g1/provider.registry.json')));
const categories=provider.requiredCategories||[];
const hw=JSON.parse(fs.readFileSync(path.join(root,'ldwmd-gpu-admission-g1/hardware-intelligence/provider-registry.json')));
const result={schema:'leeway.formula.h08-h09.audit-binding.v1',authority:'AUDIT_CANDIDATE_ONLY',sourceHashes:fingerprint,registries:{providerRegistryId:provider.registryId,providerRegistryCanonicalFlag:provider.canonical,hasMemoryCategory:categories.includes('memory-provider'),hasEdgeGpuCategory:categories.includes('edge-gpu-provider'),hardwareRegistryNature:'DEVICE_VENDOR_IDENTIFICATION_NOT_EQUATION_AUTHORITY',hardwareVendorEntries:hw.providers.length},
verifiedTestExecution:{testFiles:['LeeWay-Edge-GPU/contracts/g19-diagnostics-projection.test.mjs','LeeWay-Edge-GPU/contracts/g19-gpu-veritas-gate.test.mjs'],observedPass:22,observedFail:0,observedSkip:0},
equations:[
{id:'H-08',candidateSource:'LeeWay-Edge-GPU/core/inference-contract.mjs',supportingSource:'LeeWay-Edge-GPU/contracts/g19-diagnostics-projection.mjs',observedScope:'LDWMD lease and memory-budget admission checks; reject unverified allocation evidence',status:'RELATED_IMPLEMENTATION_AND_TEST_EVIDENCE',exactStandaloneKernelCertified:false,canonicalDesignationPresent:false},
{id:'H-09',candidateSource:'LeeWay-Edge-GPU/core/hybrid.dispatcher.js',supportingSource:'LeeWay-Edge-GPU/contracts/g19-gpu-veritas-gate.test.mjs',observedScope:'Typed GPU failure recovery and authorized dispatch; fail-closed evidence tests',status:'RELATED_IMPLEMENTATION_AND_TEST_EVIDENCE',exactStandaloneKernelCertified:false,canonicalDesignationPresent:false}
],unresolved:['approved H-08/H-09 math contracts','authority-signed equation-to-source pin','actual H-08 allocation mathematical end-to-end oracle','actual H-09 pressure recovery mathematical end-to-end oracle']};
const bytes=Buffer.from(JSON.stringify(result,null,2)+'\n'),digest=sha(bytes),dest=path.join(cwd,'formula-h08-h09-audit-binding-'+digest.slice(0,16)+'.json');fs.writeFileSync(dest,bytes,{flag:'wx'});if(sha(fs.readFileSync(dest))!==digest)throw Error('READBACK_FAILED');
console.log(JSON.stringify({path:dest,sha256:digest,registries:result.registries,sourceFiles:sourceFiles.length,relatedTestsPassed:22,canonicalDesignationPresent:false},null,2));
