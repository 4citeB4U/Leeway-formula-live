import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createFormulaClient, resolveBaseUrl, validateRequest, FORMULA_ID } from '../scripts/formula-client.mjs';

const matrix = Array.from({ length: 16 }, () => [0, 1, 2, 3, 68, 69]);
const request = { adapterId: 'raw-base64-v1', input: { matrix }, caller: 'test', traceId: 'test-trace' };
const provenance = { source: 'test fixture', mapping: 'raw-base64-v1 fixture, not real task', authorization: 'unit test' };
const healthy = { formula: FORMULA_ID, status: 'LEEWAY_FORMULA_V1_PASS', goldenVectorPass: true, specValid: true, adapterRegistryPass: true };

async function fixture(t, respond) {
  const server = http.createServer(respond);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  return `http://127.0.0.1:${server.address().port}`;
}
function json(response, value) { response.setHeader('content-type', 'application/json'); response.end(JSON.stringify(value)); }

test('discovery honors explicit endpoint, environment and local fallback without drive paths', () => {
  assert.equal(resolveBaseUrl('http://localhost:4321/', {}), 'http://localhost:4321');
  assert.equal(resolveBaseUrl(undefined, { LEEWAY_FORMULA_BASE_URL: 'https://formula.example' }), 'https://formula.example');
  assert.equal(resolveBaseUrl(undefined, {}), 'http://127.0.0.1:4001');
  for (const url of ['file:///D:/formula', 'https://user:secret@example.com', 'https://example.com?x=y']) {
    assert.throws(() => resolveBaseUrl(url));
  }
});
test('invalid observations and ranges fail before network use', async () => {
  let calls = 0;
  const client = createFormulaClient({ fetchImpl: () => { calls++; throw new Error('unexpected network'); } });
  await assert.rejects(client.evaluate({ ...request, input: { matrix: [[70]] } }, provenance));
  await assert.rejects(client.evaluate(request, {}));
  assert.equal(calls, 0);
  const runtime = { adapterId: 'runtime-state-v1', input: { stateRows: matrix, ranges: Array(6).fill([0, 100]) } };
  assert.doesNotThrow(() => validateRequest(runtime));
  assert.throws(() => validateRequest({ ...runtime, input: { ...runtime.input, ranges: Array(6).fill([10, 0]) } }));
  assert.throws(() => validateRequest({ adapterId: 'conversation-score-v1', input: {} }));
});
test('unhealthy or wrong-identity authority prevents evaluation POST', async t => {
  let posts = 0;
  const baseUrl = await fixture(t, (req, res) => { if (req.method === 'POST') posts++; json(res, { ...healthy, formula: 'other' }); });
  await assert.rejects(createFormulaClient({ baseUrl }).evaluate(request, provenance), /health gate/);
  assert.equal(posts, 0);
});
test('HTTP consumer sends unchanged request and preserves unverified execution evidence', async t => {
  const calls = [];
  const baseUrl = await fixture(t, async (req, res) => {
    calls.push(req.url);
    if (req.method === 'GET') return json(res, healthy);
    let body = ''; for await (const chunk of req) body += chunk;
    assert.deepEqual(JSON.parse(body), request);
    json(res, { formulaId: FORMULA_ID, adapterId: request.adapterId, decimalState: [0,1,2,3,4,5], base64State: ['A','B','C','D','E','F'], inputHash: 'test-input', resultHash: 'test-result', receiptPath: 'test-only', evaluatedAt: new Date().toISOString() });
  });
  const result = await createFormulaClient({ baseUrl }).evaluate(request, provenance);
  assert.equal(result.runtimeExecutionState, 'EXECUTED');
  assert.equal(result.verificationStatus, 'UNVERIFIED');
  assert.deepEqual(result.inputProvenance, provenance);
  assert.deepEqual(calls, ['/runtime/formula/v1/health', '/runtime/formula/v1/evaluate']);
});
test('missing receipt is rejected after execution instead of claiming verification', async t => {
  const baseUrl = await fixture(t, (req, res) => json(res, req.method === 'GET' ? healthy : { formulaId: FORMULA_ID, adapterId: request.adapterId }));
  await assert.rejects(createFormulaClient({ baseUrl }).evaluate(request, provenance), /evidence missing/);
});
test('HTTP failure and a stalled authority fail with a bounded deadline', async t => {
  const failed = await fixture(t, (_req, res) => { res.statusCode = 503; res.end('unavailable'); });
  await assert.rejects(createFormulaClient({ baseUrl: failed }).health(), /HTTP 503/);
  const stalled = await fixture(t, () => {});
  await assert.rejects(createFormulaClient({ baseUrl: stalled, timeoutMs: 30 }).health(), error => error.name === 'TimeoutError');
});
