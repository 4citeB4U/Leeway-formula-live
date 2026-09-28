import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createFormulaClient } from '../scripts/formula-client.mjs';
const client = createFormulaClient();
const server = new Server({ name: 'leeway-formula', version: '1.0.0' }, { capabilities: { tools: {} } });
const tools = [
  { name: 'formula_health', description: 'Verify canonical Formula identity and diagnostics; not task evaluation.', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
  { name: 'formula_evaluate', description: 'Execute the central Formula with a verified 16x6 input adapter and explicit source, mapping and authorization. Never invent chat scores. Returns execution evidence; caller independently verifies receipt.', inputSchema: { type: 'object', properties: { request: { type: 'object', properties: { adapterId: { enum: ['raw-base64-v1', 'runtime-state-v1'] }, input: { type: 'object' }, caller: { type: 'string' }, traceId: { type: 'string' } }, required: ['adapterId', 'input'] }, provenance: { type: 'object', properties: { source: { type: 'string' }, mapping: { type: 'string' }, authorization: { type: 'string' } }, required: ['source', 'mapping', 'authorization'] } }, required: ['request', 'provenance'], additionalProperties: false } }
];
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
  try {
    let result;
    if (params.name === 'formula_health') result = await client.health();
    else if (params.name === 'formula_evaluate') result = await client.evaluate(params.arguments?.request, params.arguments?.provenance);
    else throw new Error('Unknown Formula tool');
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (error) { return { isError: true, content: [{ type: 'text', text: error.message }] }; }
});
await server.connect(new StdioServerTransport());
