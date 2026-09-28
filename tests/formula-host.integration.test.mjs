import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createFormulaClient } from '../scripts/formula-client.mjs';

// Opt-in only: these tests create diagnostic receipts on the selected test host.
// Never point this suite at production without authorizing that receipt creation.
const base = process.env.FORMULA_TEST_BASE_URL;
const prefix = '/runtime/formula/v1/';
test('canonical host transport, evidence correlation and rejection boundaries', { skip: !base }, async t => {
  const request = {
    adapterId: 'raw-base64-v1',
    input: { matrix: Array.from({ length: 16 }, () => [0, 1, 2, 3, 4, 5]) },
    caller: 'formula-host-integration-diagnostic', traceId: 'same-repeat-test-trace'
  };
  async function get(route) {
    const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 200);
    return response.json();
  }
  async function post(input, headers = {}) {
    return fetch(`${base}${prefix}evaluate`, {
      method: 'POST', headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(input), signal: AbortSignal.timeout(10000)
    });
  }
  await t.test('health reports Formula-only scope and never fabric recovery', async () => {
    const status = await get('/runtime/health');
    assert.equal(status.scope, 'formula-only');
    assert.equal(status.otherRuntimeFabricServices, 'NOT_RESTORED');
    const health = await get(`${prefix}health`);
    assert.equal(health.hostScope, 'formula-only');
    assert.equal(health.kernelIntegrity, 'VERIFIED_AT_STARTUP');
    assert.equal(health.goldenVectorPass, true);
    const adapters = await get(`${prefix}adapters`);
    assert.deepEqual(adapters.adapters.map(a => a.adapterId).sort(), ['raw-base64-v1', 'runtime-state-v1']);
  });
  await t.test('repeated correlation ID produces two unique receipts and identical mathematical results', async () => {
    const before = (await get(`${prefix}receipts`)).receipts;
    const client = createFormulaClient({ baseUrl: base });
    const provenance = { source: 'synthetic transport diagnostic', mapping: 'raw-base64-v1 fixture', authorization: 'authorized isolated host integration test' };
    const first = await client.evaluate(request, provenance);
    const second = await client.evaluate(request, provenance);
    for (const result of [first.result, second.result]) {
      assert.equal(result.requestedTraceId, request.traceId);
      assert.match(result.hostTraceId, /^[0-9a-f-]{36}$/);
      assert.ok(path.basename(result.receiptPath).endsWith(`-${result.hostTraceId.slice(0, 8)}.json`));
    }
    assert.notEqual(first.result.receiptPath, second.result.receiptPath);
    assert.notEqual(first.result.hostTraceId, second.result.hostTraceId);
    assert.equal(first.result.inputHash, second.result.inputHash);
    assert.equal(first.result.resultHash, second.result.resultHash);
    assert.deepEqual(first.result.decimalState, second.result.decimalState);
    const after = (await get(`${prefix}receipts`)).receipts;
    for (const result of [first.result, second.result]) {
      assert.ok(after.includes(path.basename(result.receiptPath)));
      assert.ok(!before.includes(path.basename(result.receiptPath)));
    }
    const last = await get(`${prefix}last`);
    assert.equal(last.traceId, second.result.hostTraceId);
    assert.equal(last.resultHash, second.result.resultHash);
    assert.equal(last.receiptPath, second.result.receiptPath);
    assert.equal(second.verificationStatus, 'UNVERIFIED');
  });
  await t.test('invalid input, oversized correlation and browser origin create no receipts', async () => {
    const before = (await get(`${prefix}receipts`)).receipts;
    const invalid = [
      { ...request, input: { matrix: [[70]] } },
      { ...request, adapterId: 'conversation-score-v1' },
      { ...request, traceId: 'a'.repeat(257) },
      { adapterId: 'runtime-state-v1', input: { stateRows: request.input.matrix, ranges: Array(6).fill([5, 1]) } }
    ];
    for (const body of invalid) assert.equal((await post(body)).status, 400);
    assert.equal((await post(request, { origin: 'https://untrusted.example' })).status, 403);
    const badJson = await fetch(`${base}${prefix}evaluate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{', signal: AbortSignal.timeout(10000) });
    assert.equal(badJson.status, 400);
    assert.deepEqual((await get(`${prefix}receipts`)).receipts, before);
  });
  await t.test('unsupported route/method is rejected; no browser CORS exposure', async () => {
    for (const [route, method] of [['/runtime/admin', 'GET'], [`${prefix}__proto__`, 'GET'], [`${prefix}evaluate`, 'GET']]) {
      assert.equal((await fetch(`${base}${route}`, { method, signal: AbortSignal.timeout(10000) })).status, 404);
    }
    const response = await fetch(`${base}${prefix}health`, { headers: { origin: 'https://untrusted.example' }, signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('access-control-allow-origin'), null);
  });
});
