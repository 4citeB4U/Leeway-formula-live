import test from 'node:test';
import assert from 'node:assert/strict';
import { acousticEnergyDensity, acousticPropagationDelayMs, buildVoicePhysicsObservation, channelCapacityBitsPerSecond, cmosPowerWatts, echoResidualRatio, rmsPressurePa, thermalNoiseVoltageRms } from '../voice-physics-math.mjs';
import { runtimeStateV1 } from '../../v1/adapters/runtime-state-v1.mjs';
import { evaluate } from '../../v1/leeway-formula-v1.mjs';

test('calibrated acoustic equations return finite SI measurements', () => {
  assert.equal(rmsPressurePa([1, -1, 1, -1]), 1);
  assert.ok(acousticEnergyDensity({ pressurePa: 1, particleVelocityMps: 0 }) > 0);
  assert.equal(acousticPropagationDelayMs(343.2), 1000);
  assert.equal(echoResidualRatio({ microphoneSamples: [1, 2, 3], predictedEchoSamples: [1, 1, 2] }), 2 / 14);
  assert.ok(thermalNoiseVoltageRms({ temperatureK: 300, resistanceOhms: 1000, bandwidthHz: 20000 }) > 0);
  assert.ok(cmosPowerWatts({ activityFactor: 0.5, loadCapacitanceF: 1e-9, supplyVoltageV: 1, frequencyHz: 1e6, leakageCurrentA: 1e-6 }) > 0);
  assert.ok(channelCapacityBitsPerSecond({ bandwidthHz: 16000, signalPowerW: 2, noisePowerW: 1 }) > 0);
});

test('voice physics observation is non-authorizing and preserves the physical boundary', () => {
  const observation = buildVoicePhysicsObservation({
    pressureSamplesPa: [0.5, -0.5, 0.25, -0.25],
    particleVelocityMps: 0.001,
    propagationDistanceM: 1,
    microphoneSamples: [1, 2, 3, 4],
    predictedEchoSamples: [0.9, 2.1, 2.8, 4.2],
    thermal: { temperatureK: 300, resistanceOhms: 1000, bandwidthHz: 20000, activityFactor: 0.5, loadCapacitanceF: 1e-9, supplyVoltageV: 1, frequencyHz: 1e6, leakageCurrentA: 1e-6 },
    channel: { bandwidthHz: 16000, signalPowerW: 2, noisePowerW: 1 }
  });
  assert.equal(observation.status, 'MEASUREMENT_ONLY_NO_POLICY_AUTHORITY');
  assert.equal(observation.formulaExecution, 'NOT_EXECUTED');
  assert.equal(observation.actionAuthorized, false);
  assert.equal(observation.veritasVerified, false);
  assert.equal(observation.units, 'SI');
});

test('only an explicit calibrated shadow projection may reach the unchanged v1 kernel', () => {
  const rows = Array.from({ length: 16 }, (_, index) => [
    0.1 + index * 0.01,
    0.2 + index * 0.01,
    0.3 + index * 0.01,
    0.4 + index * 0.01,
    0.5 + index * 0.01,
    0.6
  ]);
  const ranges = [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]];
  const mapped = runtimeStateV1.toMatrix({ stateRows: rows, ranges });
  const result = evaluate(mapped.matrix);
  assert.equal(result.formulaId, 'LEEWAY-FORMULA-v1.0');
  assert.match(result.resultHash, /^[a-f0-9]{64}$/);
});

test('invalid physical inputs fail closed', () => {
  assert.throws(() => acousticPropagationDelayMs(0), /NONPOSITIVE/);
  assert.throws(() => echoResidualRatio({ microphoneSamples: [1], predictedEchoSamples: [1, 2] }), /LENGTH_MISMATCH/);
  assert.throws(() => cmosPowerWatts({ activityFactor: 2, loadCapacitanceF: 1, supplyVoltageV: 1, frequencyHz: 1, leakageCurrentA: 0 }), /ACTIVITY_FACTOR_RANGE/);
});
