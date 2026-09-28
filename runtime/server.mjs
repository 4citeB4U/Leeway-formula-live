import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { validateRequest } from '../scripts/formula-client.mjs';

// Transport only: import the approved kernel, never reproduce its mathematics.
const source = process.env.LEEWAY_FORMULA_SOURCE;
if (!source || !path.isAbsolute(source)) throw new Error('LEEWAY_FORMULA_SOURCE must be an absolute approved v1 directory');
const manifest = JSON.parse(fs.readFileSync(new URL('./kernel-integrity.json', import.meta.url)));
for (const [relative, expected] of Object.entries(manifest.files)) {
  const actual = createHash('sha256').update(fs.readFileSync(path.resolve(source, relative))).digest('hex');
  if (actual !== expected) throw new Error(`Kernel integrity mismatch: ${relative}`);
}
const formula = await import(pathToFileURL(path.join(source, 'formula-service.mjs')));
if (formula.health().status !== 'LEEWAY_FORMULA_V1_PASS') throw new Error('Canonical diagnostic health failed');
const prefix = '/runtime/formula/v1/';
function send(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(data));
}
async function body(req) {
  if (!(req.headers['content-type'] || '').startsWith('application/json')) throw new Error('JSON content-type required');
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32768) throw new Error('Request exceeds 32 KiB');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
const server = http.createServer(async (req, res) => {
  // This service is for trusted local consumers. Browser-origin calls are not authorized.
  if (req.headers.origin) return send(res, 403, { error: 'Browser-origin access is not enabled' });
  try {
    if (req.method === 'GET' && req.url === '/runtime/health') {
      return send(res, 200, { scope: 'formula-only', otherRuntimeFabricServices: 'NOT_RESTORED', formula: formula.health() });
    }
    if (!req.url.startsWith(prefix)) return send(res, 404, { error: 'Unknown route' });
    const route = req.url.slice(prefix.length);
    if (req.method === 'GET') {
      const readers = { health: () => ({ ...formula.health(), hostScope: 'formula-only', kernelIntegrity: 'VERIFIED_AT_STARTUP' }), spec: formula.spec, adapters: () => ({ adapters: formula.adapters() }), last: formula.last, receipts: () => ({ receipts: formula.receipts() }) };
      if (Object.hasOwn(readers, route)) return send(res, 200, readers[route]());
    }
    if (req.method === 'POST' && ['evaluate', 'encode'].includes(route)) {
      const input = await body(req);
      if (route === 'encode') {
        if (!Array.isArray(input?.decimals) || input.decimals.length !== 6 || !input.decimals.every(x => Number.isInteger(x) && x >= 0 && x <= 69)) throw new Error('Six integers in 0..69 required');
        return send(res, 200, formula.encode(input));
      }
      validateRequest(input);
      for (const key of ['caller', 'traceId']) if (input[key]?.length > 256) throw new Error(`${key} exceeds 256 characters`);
      // Canonical receipt writer uses the first eight trace characters in filenames.
      // Allocate an unused safe prefix and retain the caller correlation separately.
      const existing = formula.receipts();
      let hostTraceId;
      do { hostTraceId = randomUUID(); } while (existing.some(name => name.endsWith(`-${hostTraceId.slice(0, 8)}.json`)));
      const result = formula.evaluate({ ...input, traceId: hostTraceId });
      return send(res, 200, { ...result, hostTraceId, requestedTraceId: input.traceId ?? null });
    }
    return send(res, 404, { error: 'Unknown route or method' });
  } catch (error) {
    send(res, 400, { error: error.message });
  }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(Number(process.env.PORT || 4001), process.env.HOST || '127.0.0.1', () => console.log(JSON.stringify({ service: 'leeway-formula', scope: 'formula-only', port: server.address().port })));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
