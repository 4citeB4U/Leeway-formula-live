import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

test('host refuses altered source before importing the kernel or listening', () => {
  const runtime = fileURLToPath(new URL('../runtime/', import.meta.url));
  const temp = fs.mkdtempSync(path.join(fileURLToPath(new URL('./', import.meta.url)), '.kernel-rejection-'));
  // First manifest artifact is deliberately wrong. No canonical source is modified.
  const manifest = JSON.parse(fs.readFileSync(path.join(runtime, 'kernel-integrity.json'), 'utf8'));
  const relative = Object.keys(manifest.files)[0];
  assert.equal(path.dirname(relative), '.');
  const fixture = path.join(temp, relative);
  try {
    fs.writeFileSync(fixture, '// intentionally altered diagnostic fixture');
    const processResult = spawnSync(process.execPath, [path.join(runtime, 'server.mjs')], {
      encoding: 'utf8', timeout: 5000,
      env: { ...process.env, LEEWAY_FORMULA_SOURCE: temp, PORT: '0', HOST: '127.0.0.1' }
    });
    assert.equal(processResult.status, 1);
    assert.match(processResult.stderr, /Kernel integrity mismatch/);
    assert.equal(processResult.stdout, '');
  } finally {
    fs.unlinkSync(fixture);
    fs.rmdirSync(temp);
  }
});
