import fs from 'node:fs';

const [baselinePath, candidatePath] = process.argv.slice(2);
if (!baselinePath || !candidatePath)
  throw new Error('USAGE: node ablate.mjs baseline.json candidate.json');

function rows(file) {
  const trace = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (trace.mappingId !== 'personal-map-spatial-density-v0')
    throw new Error('SPATIAL_MAPPING_MISMATCH_' + file);
  return (trace.observations || [])
    .filter((row) => row.complete)
    .map((row) => row.values.map(Number))
    .filter((row) => row.length === 6 && row.every(Number.isFinite));
}

function p95(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  if (!sorted.length) return null;
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)];
}

const baseline = rows(baselinePath);
const candidate = rows(candidatePath);
if (baseline.length < 16 || candidate.length < 16)
  throw new Error('SPATIAL_ABLATION_REQUIRES_16_COMPLETE_ROWS_PER_TRACE');

const metric = (rows, index) => p95(rows.map((row) => row[index]));
const summary = {
  baseline: {
    transitRouteDeviationM: metric(baseline, 2),
    frameTimeMs: metric(baseline, 4),
    interactionLatencyMs: metric(baseline, 5),
  },
  candidate: {
    transitRouteDeviationM: metric(candidate, 2),
    frameTimeMs: metric(candidate, 4),
    interactionLatencyMs: metric(candidate, 5),
  },
};

const frameRatio = summary.candidate.frameTimeMs / summary.baseline.frameTimeMs;
const interactionRatio =
  summary.candidate.interactionLatencyMs / summary.baseline.interactionLatencyMs;
const routeRatio =
  summary.candidate.transitRouteDeviationM /
  Math.max(1e-9, summary.baseline.transitRouteDeviationM);

const acceptance = {
  frameTimeNotWorse: frameRatio <= 1.02,
  interactionNotWorse: interactionRatio <= 1.02,
  routeTruthNotWorse: routeRatio <= 1.05,
  meaningfulPerformanceGain:
    frameRatio <= 0.95 || interactionRatio <= 0.95,
};
acceptance.pass =
  acceptance.frameTimeNotWorse &&
  acceptance.interactionNotWorse &&
  acceptance.routeTruthNotWorse &&
  acceptance.meaningfulPerformanceGain;

console.log(JSON.stringify({
  status: acceptance.pass
    ? 'SPATIAL_ABLATION_ACCEPT'
    : 'SPATIAL_ABLATION_REJECT',
  summary,
  ratios: { frameRatio, interactionRatio, routeRatio },
  acceptance,
  claimBoundary:
    'This compares measured traces only. It does not by itself prove that a Formula interpretation is generally optimal across devices or workloads.',
}, null, 2));

if (!acceptance.pass) process.exitCode = 2;
