import fs from 'node:fs';
import crypto from 'node:crypto';

const argv = process.argv.slice(2);
const tracePath = argv[0];
const calibrationPath =
  argv[1] ||
  'contracts/domain-adapters/personal-map-spatial-density-calibration-v0.json';
const formulaBase =
  process.env.LEEWAY_FORMULA_URL ||
  'http://127.0.0.1:4001/runtime/formula/v1';

if (!tracePath)
  throw new Error('SPATIAL_FRESH_TRACE_REQUIRED');

const calibration = JSON.parse(fs.readFileSync(calibrationPath, 'utf8'));
if (
  calibration.status !== 'PERSONAL_MAP_SPATIAL_DENSITY_ACCEPTED_CALIBRATION'
)
  throw new Error('SPATIAL_CALIBRATION_NOT_ACCEPTED');
if (calibration.mappingId !== 'personal-map-spatial-density-v0')
  throw new Error('SPATIAL_MAPPING_MISMATCH');
if (!Array.isArray(calibration.ranges) || calibration.ranges.length !== 6)
  throw new Error('SPATIAL_CALIBRATION_RANGES_INVALID');

const traceBytes = fs.readFileSync(tracePath);
const trace = JSON.parse(traceBytes);
if (trace.provenance !== 'LIVE_BROWSER_MEASUREMENT')
  throw new Error('SPATIAL_LIVE_TRACE_REQUIRED');
const rows = (trace.observations || [])
  .filter((row) => row.complete)
  .slice(-16)
  .map((row) => row.values.map(Number));
if (rows.length !== 16 || rows.some((row) => row.length !== 6))
  throw new Error('SPATIAL_16X6_REQUIRED');

for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 6; j++) {
    const value = rows[i][j];
    const [low, high] = calibration.ranges[j];
    if (!Number.isFinite(value) || value < low || value > high)
      throw new Error('SPATIAL_OUT_OF_RANGE_' + i + '_' + j);
  }
}

const traceId = 'SPATIAL-' + Date.now();
const request = {
  adapterId: 'runtime-state-v1',
  caller: 'personal-map-spatial-density-v0',
  traceId,
  input: { stateRows: rows, ranges: calibration.ranges },
};
const healthResponse = await fetch(formulaBase + '/health', {
  signal: AbortSignal.timeout(5000),
});
if (!healthResponse.ok)
  throw new Error('SPATIAL_FORMULA_HEALTH_FAILED');
const health = await healthResponse.json();
if (
  health.formula !== 'LEEWAY-FORMULA-v1.0' ||
  health.goldenVectorPass !== true
)
  throw new Error('SPATIAL_FORMULA_AUTHORITY_INVALID');

const response = await fetch(formulaBase + '/evaluate', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(request),
  signal: AbortSignal.timeout(15000),
});
const text = await response.text();
if (!response.ok)
  throw new Error('SPATIAL_FORMULA_HTTP_' + response.status + '_' + text);
const result = JSON.parse(text);
const sha = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

console.log(JSON.stringify({
  status: 'EXECUTED_UNVERIFIED',
  interpretationStatus: 'NOT_PROMOTED',
  mappingId: 'personal-map-spatial-density-v0',
  traceId,
  sourceTraceSha256: sha(traceBytes),
  calibrationProfileId: calibration.profileId,
  inputHash: result.inputHash,
  resultHash: result.resultHash,
  decimalState: result.decimalState,
  base64State: result.base64State,
  receiptPath: result.receiptPath,
  claimBoundary:
    'Canonical Formula executed on one fresh accepted-calibration live spatial window. Policy usefulness is still unverified until ablation/replay acceptance.',
}, null, 2));
