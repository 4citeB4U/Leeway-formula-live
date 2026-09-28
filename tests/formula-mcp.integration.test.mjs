import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const base = process.env.FORMULA_TEST_BASE_URL;
test('MCP exposes diagnostics and rejects missing provenance without evaluating', { skip: !base }, async t => {
  const { Client } = await import('../runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js');
  const { StdioClientTransport } = await import('../runtime/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js');
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [fileURLToPath(new URL('../runtime/mcp.mjs', import.meta.url))],
    env: { ...process.env, LEEWAY_FORMULA_BASE_URL: base }, stderr: 'pipe'
  });
  const client = new Client({ name: 'formula-mcp-diagnostic-test', version: '1.0.0' });
  t.after(() => client.close());
  await client.connect(transport);
  const advertised = await client.listTools();
  assert.deepEqual(advertised.tools.map(tool => tool.name).sort(), ['formula_evaluate', 'formula_health']);
  const health = await client.callTool({ name: 'formula_health', arguments: {} });
  assert.notEqual(health.isError, true);
  assert.equal(JSON.parse(health.content[0].text).hostScope, 'formula-only');
  const receipts = async () => (await (await fetch(`${base}/runtime/formula/v1/receipts`)).json()).receipts;
  const before = await receipts();
  const rejected = await client.callTool({ name: 'formula_evaluate', arguments: {
    request: { adapterId: 'raw-base64-v1', input: { matrix: Array.from({ length: 16 }, () => [0,1,2,3,4,5]) } }
  } });
  assert.equal(rejected.isError, true);
  assert.match(rejected.content[0].text, /provenance/);
  assert.deepEqual(await receipts(), before);
  const unknown = await client.callTool({ name: 'not_a_formula_tool', arguments: {} });
  assert.equal(unknown.isError, true);
});
