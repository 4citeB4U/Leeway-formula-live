/* WHO: Formula maintainers. WHAT: Handoff negative gates. WHEN: 2026-11-15. WHERE: canonical tests. HOW: Actual Formula output. WHY: Prevent fabricated positive authority tests. */
import assert from 'node:assert/strict';import {randomUUID,createHash} from 'node:crypto';
import {evaluate,GOLDEN_MATRIX} from '../leeway-formula-v1.mjs';import {createG3EvidenceBundle} from '../g3-evidence-bundle.mjs';import {transitionG3ToG4} from '../g3-g4-provider-handoff.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const bundle=createG3EvidenceBundle({requestId:randomUUID(),producer:'formula-test',target:{repository:'Formula',paths:['test.mjs']},formulaResult:evaluate(GOLDEN_MATRIX),observation:{preStateSha256:hash('before'),postStateSha256:hash('after'),commandSha256:hash('test'),stdoutSha256:hash('test-output'),exitCode:0,observedAt:new Date().toISOString()}});
const pending=await transitionG3ToG4({bundle,bindings:{}});assert.equal(pending.status,'G4_NOT_TRANSITIONED');assert.match(pending.reason,/BINDING/);
const tampered=await transitionG3ToG4({bundle:{...bundle,producer:'forged'},bindings:{}});assert.equal(tampered.reason,'G4_BINDING_G3_BUNDLE_INVALID');
console.log('PASS handoff rejects incomplete bindings and changed evidence; real multi-process positive chain belongs to Bridge qualification test');
