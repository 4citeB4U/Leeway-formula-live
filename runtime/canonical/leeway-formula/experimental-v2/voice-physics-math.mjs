/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.VOICE_PHYSICS_SHADOW
TAG: LEEWAY.FORMULA.VOICE_PHYSICS_MEASUREMENT_V0
WHAT = Compute source-proven physical measurements for real-time speech paths
WHY = Keep acoustic/electrical/thermal constraints explicit before any Formula mapping
WHO = Creator-authorized LeeWay Formula research
WHERE = runtime/canonical/leeway-formula/experimental-v2/voice-physics-math.mjs
WHEN = 2026-11-04
HOW = SI-unit equations with fail-closed validation; no policy authority
AUTHORITY = EXPERIMENTAL SHADOW ONLY; canonical v1 kernel unchanged
LICENSE = MIT
*/

const BOLTZMANN_CONSTANT = 1.380649e-23;
export const DEFAULT_AIR_DENSITY_KG_M3 = 1.2041;
export const DEFAULT_SOUND_SPEED_M_S = 343.2;

function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`VOICE_PHYSICS_NONFINITE_${name}`);
  return value;
}

function positive(value, name) {
  finite(value, name);
  if (value <= 0) throw new Error(`VOICE_PHYSICS_NONPOSITIVE_${name}`);
  return value;
}

function samples(values, name) {
  if (!Array.isArray(values) || values.length === 0) throw new Error(`VOICE_PHYSICS_SAMPLES_REQUIRED_${name}`);
  values.forEach((value, index) => finite(value, `${name}_${index}`));
  return values;
}

/** RMS of calibrated acoustic pressure samples in pascals. */
export function rmsPressurePa(pressureSamplesPa) {
  const values = samples(pressureSamplesPa, 'PRESSURE');
  return Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);
}

/**
 * Mean acoustic energy density for a calibrated pressure/particle-velocity pair.
 * E = 1/2 rho v^2 + p^2/(2 rho c^2), in joules per cubic metre.
 */
export function acousticEnergyDensity({ pressurePa, particleVelocityMps, densityKgM3 = DEFAULT_AIR_DENSITY_KG_M3, soundSpeedMps = DEFAULT_SOUND_SPEED_M_S } = {}) {
  positive(densityKgM3, 'DENSITY');
  positive(soundSpeedMps, 'SOUND_SPEED');
  finite(pressurePa, 'PRESSURE_PA');
  finite(particleVelocityMps, 'PARTICLE_VELOCITY_MPS');
  return 0.5 * densityKgM3 * particleVelocityMps ** 2 + (pressurePa ** 2) / (2 * densityKgM3 * soundSpeedMps ** 2);
}

/** One-way acoustic propagation delay in milliseconds. */
export function acousticPropagationDelayMs(distanceM, soundSpeedMps = DEFAULT_SOUND_SPEED_M_S) {
  positive(distanceM, 'DISTANCE_M');
  positive(soundSpeedMps, 'SOUND_SPEED');
  return (distanceM / soundSpeedMps) * 1000;
}

/**
 * Normalized echo residual energy. The input arrays must be aligned and use the
 * same calibrated signal scale. This is a measurement, not an AEC decision.
 */
export function echoResidualRatio({ microphoneSamples, predictedEchoSamples } = {}) {
  const mic = samples(microphoneSamples, 'MICROPHONE');
  const echo = samples(predictedEchoSamples, 'PREDICTED_ECHO');
  if (mic.length !== echo.length) throw new Error('VOICE_PHYSICS_ECHO_LENGTH_MISMATCH');
  const signalEnergy = mic.reduce((sum, value) => sum + value ** 2, 0);
  if (signalEnergy <= 0) throw new Error('VOICE_PHYSICS_SIGNAL_ENERGY_ZERO');
  const residualEnergy = mic.reduce((sum, value, index) => sum + (value - echo[index]) ** 2, 0);
  return residualEnergy / signalEnergy;
}

/** Johnson-Nyquist RMS voltage noise in volts. */
export function thermalNoiseVoltageRms({ temperatureK, resistanceOhms, bandwidthHz } = {}) {
  positive(temperatureK, 'TEMPERATURE_K');
  positive(resistanceOhms, 'RESISTANCE_OHMS');
  positive(bandwidthHz, 'BANDWIDTH_HZ');
  return Math.sqrt(4 * BOLTZMANN_CONSTANT * temperatureK * resistanceOhms * bandwidthHz);
}

/** CMOS dynamic plus leakage power in watts. */
export function cmosPowerWatts({ activityFactor, loadCapacitanceF, supplyVoltageV, frequencyHz, leakageCurrentA } = {}) {
  finite(activityFactor, 'ACTIVITY_FACTOR');
  if (activityFactor < 0 || activityFactor > 1) throw new Error('VOICE_PHYSICS_ACTIVITY_FACTOR_RANGE');
  positive(loadCapacitanceF, 'LOAD_CAPACITANCE_F');
  positive(supplyVoltageV, 'SUPPLY_VOLTAGE_V');
  positive(frequencyHz, 'FREQUENCY_HZ');
  finite(leakageCurrentA, 'LEAKAGE_CURRENT_A');
  if (leakageCurrentA < 0) throw new Error('VOICE_PHYSICS_LEAKAGE_CURRENT_NEGATIVE');
  return activityFactor * loadCapacitanceF * supplyVoltageV ** 2 * frequencyHz + supplyVoltageV * leakageCurrentA;
}

/** Shannon-Hartley upper bound in bits per second. */
export function channelCapacityBitsPerSecond({ bandwidthHz, signalPowerW, noisePowerW } = {}) {
  positive(bandwidthHz, 'BANDWIDTH_HZ');
  positive(signalPowerW, 'SIGNAL_POWER_W');
  positive(noisePowerW, 'NOISE_POWER_W');
  return bandwidthHz * Math.log2(1 + signalPowerW / noisePowerW);
}

/**
 * Build a source-provenanced observation bundle. It intentionally contains no
 * behavioral thresholds, Formula weights, or action authority.
 */
export function buildVoicePhysicsObservation({ pressureSamplesPa, particleVelocityMps, propagationDistanceM, microphoneSamples, predictedEchoSamples, thermal, channel } = {}) {
  const pressureRmsPa = rmsPressurePa(pressureSamplesPa);
  const observation = {
    schema: 'leeway.formula.voice-physics-observation.v0',
    status: 'MEASUREMENT_ONLY_NO_POLICY_AUTHORITY',
    units: 'SI',
    pressureRmsPa,
    acousticEnergyDensityJm3: acousticEnergyDensity({ pressurePa: pressureRmsPa, particleVelocityMps }),
    acousticPropagationDelayMs: acousticPropagationDelayMs(propagationDistanceM),
    echoResidualRatio: echoResidualRatio({ microphoneSamples, predictedEchoSamples }),
    thermalNoiseVoltageRmsV: thermalNoiseVoltageRms(thermal),
    cmosPowerW: cmosPowerWatts(thermal),
    channelCapacityBps: channelCapacityBitsPerSecond(channel),
    formulaExecution: 'NOT_EXECUTED',
    actionAuthorized: false,
    veritasVerified: false
  };
  return Object.freeze(observation);
}
