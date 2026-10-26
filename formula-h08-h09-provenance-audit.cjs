/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: H08_H09_CANONICAL_PROVENANCE_AUDIT
WHAT: Evidence-based canonical source designation check for H-08/LW-H2 and H-09/LW-H4.
WHY: Separate working subsystems from a separately approved formula specification.
WHO: LeeWay audit. WHERE: isolated audit utility. WHEN: 2026-10-25.
HOW: Hash exact candidate modules and inspect scoped authority/designation documents.
AUTHORITY: AUDIT_ONLY, NO PRODUCTION ENROLLMENT. LICENSE: Existing LeeWay terms.
*/
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const root='E:\\LeeWay-Work',fRoot=__dirname;
const candidates=[
'LeeWay-Edge-GPU/core/hybrid.dispatcher.js',
'LeeWay-Edge-GPU/core/inference-contract.mjs',
'LeeWay-Edge-GPU/core/state-window-statistics.mjs',
'LeeWay-Edge-GPU/L2_Controller_VRM/mosfet.regulator.ts',
'LeeWay-Edge-GPU/contracts/g19-diagnostics-projection.mjs',
'runtime-c3-clean-formula-20261007/automation-runtime/failure-recovery.mjs',
'ldwmd-gpu-admission-g1/adapters/edge-gpu/runtime.mjs'
];
const files=candidates.map(file=>{const body=fs.readFileSync(path.join(root,file));return {file,sha256:sha(body),bytes:body.length,designationMatches:[...body.toString().matchAll(/(?:LW-H2|LW-H4|H-08|H-09)/g)].length}});
const authorityFiles=[
'LeeWay-Edge-GPU/contracts/application-runtime-contract.json',
'LeeWay-Edge-GPU/contracts/execution-node-contract.v1.json',
'ldwmd-gpu-admission-g1/contracts/execution-node-contract.v1.json'
];
const docs=authorityFiles.map(file=>{const full=path.join(root,file);if(!fs.existsSync(full))return {file,exists:false};const body=fs.readFileSync(full);return {file,exists:true,sha256:sha(body),designations:[...body.toString().matchAll(/(?:LW-H2|LW-H4|H-08|H-09)/g)].length}});
const report={schema:'leeway.formula.h08-h09.provenance-audit.v1',kind:'AUDIT_ONLY',files,authorityDocuments:docs,findings:[
{equation:'H-08',existingCapability:'Authenticated LDWMD memory admission / resource budget consumer',directFormalDesignationEstablished:false,classification:'PARTIALLY_BUILT_OR_MISSING_CANONICAL_BINDING',required:'Approved H-08 mathematical contract and signed authority record with exact source path/digest; per-equation executable proof'},
{equation:'H-09',existingCapability:'Typed GPU failure handling / bounded fallback with post-verification gates',directFormalDesignationEstablished:false,classification:'PARTIALLY_BUILT_OR_MISSING_CANONICAL_BINDING',required:'Approved H-09 pressure-recovery mathematical contract and signed authority record with exact source path/digest; per-equation executable proof'}]};
const target=path.join(fRoot,'formula-h08-h09-provenance-audit.json');fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');const b=fs.readFileSync(target);console.log(JSON.stringify({file:target,sha256:sha(b),candidateSourceFiles:files.length,authorityDocumentsChecked:docs.length,explicitDesignationMatches:files.reduce((a,x)=>a+x.designationMatches,0)+docs.reduce((a,x)=>a+(x.designations||0),0),conclusion:'AUTHORITATIVE_STANDALONE_KERNEL_NOT_PROVEN_BY_INSPECTED_SOURCES'},null,2));
