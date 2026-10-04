import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const argv = process.argv.slice(2);
const outIndex = argv.indexOf('--out');
const outPath =
  outIndex >= 0 && argv[outIndex + 1]
    ? argv[outIndex + 1]
    : 'experiments/personal-map-spatial-density-v0/outputs/calibration-candidate.json';
const inputs = argv.filter((value, index) => {
  if (value === '--out' || index === outIndex + 1) return false;
  return !value.startsWith('--');
});

if (inputs.length < 3)
  throw new Error('SPATIAL_CALIBRATION_REQUIRES_AT_LEAST_3_LIVE_TRACES');

const ORDER = [
  'visible_spatial_candidate_count',
  'continuous_motion_subject_count',
  'transit_route_deviation_m',
  'rendered_label_count',
  'frame_time_ms',
  'interaction_latency_ms',
];

const sha = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

function percentile(values, p) {
  const sorted = values.slice().sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1),
  );
  return sorted[index];
}

const traces = inputs.map((file) => {
  const bytes = fs.readFileSync(file);
  const data = JSON.parse(bytes);
  if (data.mappingId !== 'personal-map-spatial-density-v0')
    throw new Error('SPATIAL_MAPPING_ID_MISMATCH_' + file);
  if (data.provenance !== 'LIVE_BROWSER_MEASUREMENT')
    throw new Error('SPATIAL_LIVE_MEASUREMENT_REQUIRED_' + file);
  if (data.capture?.qualification !== 'REAL_GPU_CANDIDATE')
    throw new Error('SPATIAL_REAL_GPU_TRACE_REQUIRED_' + file);
  const rows = (data.observations || [])
    .filter((row) => row.complete === true)
    .filter(
      (row) =>
        JSON.stringify(row.dimensionOrder) === JSON.stringify(ORDER) &&
        Array.isArray(row.values) &&
        row.values.length === 6 &&
        row.values.every(Number.isFinite),
    )
    .map((row) => row.values.map(Number));
  if (rows.length < 16)
    throw new Error('SPATIAL_TRACE_NEEDS_16_COMPLETE_ROWS_' + file);
  return {
    file,
    sha256: sha(bytes),
    userAgent: data.userAgent || null,
    rows,
  };
});

const rows = traces.flatMap((trace) => trace.rows);
if (rows.length < 48)
  throw new Error('SPATIAL_CALIBRATION_NEEDS_48_ROWS');

const ranges = [];
const summaries = [];
for (let j = 0; j < 6; j++) {
  const values = rows.map((row) => row[j]);
  const p05 = percentile(values, 5);
  const p50 = percentile(values, 50);
  const p95 = percentile(values, 95);
  const width = Math.max(1e-9, p95 - p05);
  const lower = Math.max(0, p05 - width * 0.1);
  const upper = p95 + width * 0.1;
  if (!(lower < upper))
    throw new Error('SPATIAL_INVALID_RANGE_' + j);
  ranges.push([lower, upper]);
  summaries.push({
    id: ORDER[j],
    min: Math.min(...values),
    p05,
    p50,
    p95,
    max: Math.max(...values),
    range: [lower, upper],
  });
}

const output = {
  schemaVersion: '1.0.0',
  mappingId: 'personal-map-spatial-density-v0',
  profileId: 'personal-map-spatial-density-calibration-v0',
  formulaId: 'LEEWAY-FORMULA-v1.0',
  runtimeAdapterId: 'runtime-state-v1',
  status: 'CANDIDATE_CALIBRATION_REVIEW_REQUIRED',
  formulaExecutionState: 'NOT_EXECUTED',
  dimensionOrder: ORDER,
  ranges,
  summaries,
  provenance: {
    liveTraceCount: traces.length,
    observationCount: rows.length,
    traces: traces.map(({ file, sha256, userAgent }) => ({
      file,
      sha256,
      userAgent,
    })),
  },
  acceptanceRequired: [
    'At least three real-GPU live traces from materially distinct device/runtime profiles.',
    'Replay verifies every accepted row remains finite and inside the proposed ranges.',
    'Deterministic baseline and Formula-selected policy are compared on the same traces.',
    'No Formula policy may reduce evidence truth fidelity to improve performance.',
    'Creator explicitly promotes this candidate before first numeric Formula execution.',
  ],
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({
  status: output.status,
  outPath,
  liveTraceCount: traces.length,
  observationCount: rows.length,
  ranges,
}, null, 2));
