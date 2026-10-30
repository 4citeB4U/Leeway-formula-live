/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F3_F4_F7_F8_RUNTIME_NEGATIVE_PATHS
WHAT: Read-only checks of actual Runtime Fabric interfaces, no dispatch.
WHY: Distinguish callable runtime safety behavior from missing exact equation bindings.
WHO: LeeWay audit; WHERE: isolated checkout; WHEN: 2026-10-25.
HOW: Only invalid-input paths avoiding queues, events, recovery and provider mutation.
AUTHORITY: AUDIT_ONLY; production authorization untouched.
LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
import {routeTrigger} from '../runtime-c3-clean-formula-20261007/automation-runtime/trigger-router.mjs';
import {scheduleTask} from '../runtime-c3-clean-formula-20261007/automation-runtime/scheduler.mjs';
import {enqueueJob} from '../runtime-c3-clean-formula-20261007/automation-runtime/job-queue.mjs';
import {executeWorkflow} from '../runtime-c3-clean-formula-20261007/automation-runtime/workflow-engine.mjs';
test('F8 trigger router blocks missing trigger',async()=>{assert.deepEqual(await routeTrigger({payload:{}}),{status:'BLOCKED',reason:'MISSING_TRIGGER_TYPE'})});
test('F8 scheduler blocks missing recurring cron without persistence',async()=>{const r=await scheduleTask({schedule:{type:'recurring'}});assert.equal(r.status,'BLOCKED');assert.equal(r.reason,'MISSING_CRON_EXPRESSION')});
test('F8 scheduler blocks missing one-time timestamp without persistence',async()=>{const r=await scheduleTask({schedule:{type:'one-time'}});assert.equal(r.status,'BLOCKED');assert.equal(r.reason,'MISSING_TIMESTAMP')});
test('F7 queue blocks unserializable task before touching disk',()=>{const r=enqueueJob({execute:()=>true});assert.equal(r.status,'BLOCKED');assert.equal(r.reason,'NON_SERIALIZABLE_EXECUTE_HANDLER')});
test('Workflow no-steps path blocks without execution',async()=>{const r=await executeWorkflow({steps:[]});assert.equal(r.status,'BLOCKED');assert.equal(r.reason,'NO_WORKFLOW_STEPS')});
test('Workflow missing named step blocks without execution',async()=>{const r=await executeWorkflow({steps:[{}]});assert.equal(r.status,'BLOCKED');assert.equal(r.reason,'WORKFLOW_STEP_MISSING_NAME')});
