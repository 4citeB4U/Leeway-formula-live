/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F3_F8_ORIGINAL_RUNTIME_SOURCE_BOUNDARIES
WHAT: Content-addressed inventory of original routing, Veritas, queue, automation bindings.
WHY: Preserve verified source evidence without claiming mathematical equivalence.
WHO: LeeWay audit; WHERE: isolated audit; WHEN: 2026-10-25.
HOW: Hash original source, record witnessed exports and unresolved equation links.
AUTHORITY: AUDIT_ONLY. LICENSE: Existing LeeWay repository terms.
*/
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const root='E:\\LeeWay-Work\\runtime-c3-clean-formula-20261007';
const rel=['provider-fabric/provider-binder.mjs','provider-fabric/provider-router.mjs','provider-fabric/provider-fallback-policy.mjs','provider-fabric/provider-readiness-gate.mjs','automation-runtime/job-queue.mjs','automation-runtime/scheduler.mjs','automation-runtime/trigger-router.mjs','automation-runtime/workflow-engine.mjs','automation-runtime/approval-gate.mjs','automation-runtime/veritas/VeritasGate.OwnerLocalHostRead.v1.psm1'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sources=rel.map(f=>{const b=fs.readFileSync(path.join(root,f));return {path:f,sha256:sha(b),bytes:b.length}});
const findings=[{equations:['F3-01','F3-02','F3-03'],source:'provider-fabric/provider-binder.mjs',observed:'Provider candidate selection uses IDs/categories/capabilities and declared priority; exact seven-component lexicographic formula not established',status:'SOURCE_PRESENT_EQUATION_EQUIVALENCE_OPEN'},{equations:['F4-01','F4-02','F4-03','F4-04'],source:'automation-runtime/veritas/VeritasGate.OwnerLocalHostRead.v1.psm1',observed:'Original host Veritas module located, independently enrolled provider not qualified',status:'SOURCE_PRESENT_EQUATION_EQUIVALENCE_OPEN'},{equations:['F7-01','F7-02'],source:'automation-runtime/job-queue.mjs',observed:'Original persistent queue has verified non-serializable-task fail-closed check; lexicographic priority formula not qualified',status:'NEGATIVE_BOUNDARY_PASS_EQUATION_EQUIVALENCE_OPEN'},{equations:['F8-01','F8-02','F8-03'],source:'automation-runtime/scheduler.mjs',observed:'Original scheduler and trigger validation fail closed on missing fields; exact firing product and signed dispatch unqualified',status:'NEGATIVE_BOUNDARY_PASS_EQUATION_EQUIVALENCE_OPEN'}];
const report={schema:'leeway.formula.f3-f8-source-audit.v1',kind:'AUDIT_ONLY',root,sources,findings};
const dest=path.join(__dirname,'formula-f3-f8-source-boundary.json');fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({file:dest,sha256:sha(fs.readFileSync(dest)),sourceFiles:sources.length,findings:findings.length}));
