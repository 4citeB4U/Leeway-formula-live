import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('repository-default source starts from an unrelated working directory without a drive binding', async t => {
  const env = { ...process.env, HOST: '127.0.0.1', PORT: '0' };
  delete env.LEEWAY_FORMULA_SOURCE;
  const processHandle = spawn(process.execPath, [fileURLToPath(new URL('../runtime/server.mjs', import.meta.url))], {
    cwd: path.dirname(process.execPath), env, stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(async () => {
    if (processHandle.exitCode === null) {
      const exited = once(processHandle, 'exit');
      processHandle.kill();
      await exited;
    }
  });
  const port = await new Promise((resolve, reject) => {
    let output = ''; let errors = '';
    const timer = setTimeout(() => reject(new Error(`Startup timeout: ${errors}`)), 5000);
    processHandle.stderr.on('data', chunk => { errors += chunk; });
    processHandle.once('error', error => { clearTimeout(timer); reject(error); });
    processHandle.once('exit', code => { clearTimeout(timer); reject(new Error(`Premature exit ${code}: ${errors}`)); });
    processHandle.stdout.on('data', chunk => {
      output += chunk;
      if (output.includes('\n')) {
        clearTimeout(timer);
        try { resolve(JSON.parse(output.split('\n')[0]).port); } catch (error) { reject(error); }
      }
    });
  });
  assert.ok(Number.isInteger(port) && port > 0);
  const response = await fetch(`http://127.0.0.1:${port}/runtime/formula/v1/health`, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, 200);
  const health = await response.json();
  assert.equal(health.kernelIntegrity, 'VERIFIED_AT_STARTUP');
  assert.equal(health.hostScope, 'formula-only');
  assert.equal(health.status, 'LEEWAY_FORMULA_V1_PASS');
});
