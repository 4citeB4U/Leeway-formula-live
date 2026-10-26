/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F3_F8_CALLGRAPH_AUDIT
WHAT: Reproducible source-linked decision callgraph.
WHY: Distinguish existing operational routing/queue logic from unbound equation specs.
WHO: LeeWay audit; WHERE: isolated evidence; WHEN: 2026-10-25.
HOW: Pin original source modules and record witnessed direct calls.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay terms.
*/
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root='E:\\LeeWay-Work\\runtime-c3-clean-formula-20261007',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const edges=[['provider-fabric/provider-router.mjs','provider-fabric/provider-binder.mjs','routeProviderRequest -> bindCapabilityRequest','F3'],['provider-fabric/provider-binder.mjs','provider-fabric/provider-contract-validator.mjs','bindCapabilityRequest -> validateProviderRegistry','F3/F4 source boundary'],['provider-fabric/provider-binder.mjs','provider-fabric/provider-fallback-policy.mjs','bindCapabilityRequest -> selectFallbackProvider','F3'],['automation-runtime/scheduler.mjs','automation-runtime/job-queue.mjs','scheduleTask -> enqueueJob','F7/F8']];
const modules=[...new Set(edges.flatMap(x=>[x[0],x[1]]))].map(rel=>{const b=fs.readFileSync(path.join(root,rel));return {rel,sha256:sha(b)}});
const report={schema:'leeway.formula.callgraph-evidence.v1',mode:'AUDIT_ONLY',modules,edges,conclusions:{F3:'REAL_PROVIDER_ROUTING; SEVEN_DIMENSION_LEXICOGRAPHIC_EQUIVALENCE_NOT_ESTABLISHED',F4:'REGISTRY_VALIDATION_NOT_INDEPENDENT_VERITAS_EVIDENCE_SCORING',F7:'REAL_QUEUE; PRIORITY_VECTOR_NOT_ESTABLISHED',F8:'SCHEDULER_AND_TRIGGER_VALIDATION; MATHEMATICAL_FIRING_RULE_NOT_ESTABLISHED'}};
const dest=path.join(__dirname,'formula-f3-f8-callgraph-evidence.json');fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');const data=fs.readFileSync(dest);console.log(JSON.stringify({path:dest,sha256:sha(data),modules:modules.length,edges:edges.length,conclusions:report.conclusions},null,2));
