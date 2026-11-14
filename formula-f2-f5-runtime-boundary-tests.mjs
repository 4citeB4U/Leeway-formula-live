/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: F2_F5_EXISTING_RUNTIME_NEGATIVE_BOUNDARIES
WHAT: Read-only behavioral tests against original Runtime Fabric approval and recovery modules.
WHY: Confirm authenticated fail-closed behavior and distinguish recovery stub from repaired execution.
WHO: LeeWay audit; WHERE: isolated local audit; WHEN: 2026-10-25.
HOW: Import original modules and execute negative-path assertions.
AUTHORITY: AUDIT_ONLY; no production authorization. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
import {evaluateApproval} from '../runtime-c3-clean-formula-20261007/automation-runtime/approval-gate.mjs';
import {recoverFromFailure} from '../runtime-c3-clean-formula-20261007/automation-runtime/failure-recovery.mjs';
const base={approver:'audit-test',policy:{allowAutomation:true},intent:'normal'};
test('F2 existing approval gate rejects missing metadata',()=>{assert.equal(evaluateApproval({policy:base.policy,intent:'normal'}).status,'BLOCKED')});
test('F2 existing approval gate rejects prohibited automation',()=>{assert.equal(evaluateApproval({...base,policy:{allowAutomation:false}}).status,'DENIED')});
test('F2 existing approval gate rejects dangerous intent',()=>{assert.equal(evaluateApproval({...base,intent:'dangerous'}).status,'DENIED')});
test('F2 existing approval gate rejects absent signed owner approval',()=>{const r=evaluateApproval(base);assert.equal(r.status,'BLOCKED');assert.equal(r.reason,'UNAUTHENTICATED_OWNER_AUTHORIZATION')});
test('F5 recovery helper blocks no failure payload',()=>{assert.equal(recoverFromFailure(null).status,'BLOCKED')});
test('F5 recovery helper returns PASS on error record without proving repair',()=>{const r=recoverFromFailure({error:'SIMULATED_TEST_FAILURE'});assert.equal(r.status,'PASS');assert.equal(r.recovered,true);assert.equal(r.details.error,'SIMULATED_TEST_FAILURE')});
