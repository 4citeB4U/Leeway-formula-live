import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
const root = fileURLToPath(new URL('../', import.meta.url));
const env = { ...process.env, HOST: '127.0.0.1', PORT: '0' };
delete env.LEEWAY_FORMULA_SOURCE;
const host = spawn(process.execPath, ['runtime/server.mjs'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
try {
  const port = await new Promise((resolve, reject) => {
    let output = ''; let errors = '';
    const timer = setTimeout(() => reject(new Error(`Host timeout: ${errors}`)), 10000);
    host.stderr.on('data', part => { errors += part; });
    host.once('error', error => { clearTimeout(timer); reject(error); });
    host.once('exit', code => { clearTimeout(timer); reject(new Error(`Host exit ${code}: ${errors}`)); });
    host.stdout.on('data', part => {
      output += part;
      if (output.includes('\n')) { clearTimeout(timer); resolve(JSON.parse(output.split('\n')[0]).port); }
    });
  });
  const base = `http://127.0.0.1:${port}`;
  const tests = (await fs.readdir(new URL('./', import.meta.url))).filter(name => name.endsWith('.test.mjs')).map(name => `tests/${name}`);
  for (const args of [['--test', '--test-concurrency=1', ...tests], ['runtime/canonical/leeway-formula/v1/tests/live-endpoint-v1.mjs']]) {
    const child = spawn(process.execPath, args, { cwd: root, stdio: 'inherit', env: { ...process.env, FORMULA_TEST_BASE_URL: base, LEEWAY_FABRIC_URL: base } });
    const [code] = await once(child, 'exit');
    if (code !== 0) throw new Error(`Verification exited ${code}`);
  }
} finally {
  if (host.exitCode === null) { const closed = once(host, 'exit'); host.kill(); await closed; }
}
