<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.VOICE_PHYSICS_SHADOW
TAG: LEEWAY.VOICE.PHYSICS_AND_CONVERSATION_V0
AUTHORITY: EXPERIMENTAL SHADOW ONLY; canonical v1 kernel unchanged
LICENSE: MIT
-->
# Voice physics and conversational state — experimental shadow

This research lane records the physics behind Agent Lee's real-time speech path
without turning physical equations into a personality, an action authority, or a
claim of subjective experience.

## Equations retained from the supplied research

- Acoustic energy density: `E = 1/2 rho v^2 + p^2/(2 rho c^2)`.
- RMS pressure: `p_rms = sqrt((1/N) sum(p_n^2))`.
- Acoustic propagation delay: `t = d/c`.
- Echo residual: `R_echo = sum((x-y)^2) / sum(x^2)` for aligned signals.
- Johnson-Nyquist voltage noise: `v_n = sqrt(4 k_B T R Delta f)`.
- CMOS power: `P = alpha C V^2 f + V I_leak`.
- Shannon-Hartley channel capacity: `C = B log2(1 + S/N)`.

The implementation is in
`runtime/canonical/leeway-formula/experimental-v2/voice-physics-math.mjs`.
It requires calibrated SI inputs where physical units are claimed and rejects
invalid or non-finite values.

## Formula boundary

These equations are measurement providers. They may inform a future calibrated
voice-runtime mapping for latency, interruption spill, echo, queue pressure and
delivery integrity. They do not independently determine what Agent Lee says or
does. The existing `LEEWAY-FORMULA-v1.0` kernel and golden vector remain frozen.

The only permitted route into the kernel at this stage is an explicit, separately
calibrated six-column shadow projection through `runtime-state-v1`. No active
adapter registration, policy intervention, Veritas approval, or Learning Ledger
admission is claimed by this document.

## Conversational behavior boundary

The supplied Gemini research also defines a candidate interaction policy:

- speech, cognition, work, and continuity run as coordinated logical loops;
- a backchannel is not automatically an interruption;
- a real interruption advances the playback epoch and stops stale speech;
- Agent Lee may acknowledge an admitted task while it works in the background;
- it may speak a verified result only after the work produces evidence;
- internal thought remains structured state until output admission permits speech;
- speculative speech may say that work is being checked, but may not claim success
  before execution and verification.

These are candidate behavior contracts and require live C3-D/C3-E qualification.
