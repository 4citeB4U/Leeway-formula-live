<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G41.MATH_ENGINE_REPORT
TAG: LEEWAY.FORMULA.G41.CESIUM_THREE_NUMERICAL_MATH_FUSION
5WH:
WHAT = Document Formula-side WGS84/Three math integration and high-dimensional 16x6 projection.
WHY = Historical 16x6 input is not all of LeeWay's math and does not represent GPU tiles.
WHO = Creator-authorized LeeWay engineering; independent Formula policy custodian not enrolled.
WHERE = Leeway-formula-live/docs/math-engine/G41-CESIUM-THREE-MATH-INSIDE-FORMULA.md
WHEN = 2026-10-22
HOW = Add math primitives, 16x16x16 fused tensor, compensated dense projection and shadow Formula evaluation.
LICENSE: MIT (independent source; Cesium Apache-2.0 and Three.js MIT attribution)
-->
# G41 — Mathematical engine composition inside LeeWay Formula

## Status

**EXPERIMENTAL FORMULA-SIDE MATH IMPLEMENTATION.** A standalone
versioned toolkit is added under
`runtime/canonical/leeway-formula/experimental-v2/`. The original
frozen `v1/leeway-formula-v1.mjs`, its `runtime-state-v1` adapter and
golden 16x6 vectors remain byte-identical and are never overwritten.
The candidate invokes the actual original Formula v1 evaluator for a
**SHADOW-ONLY preview**, with `policyAuthority:false` and
`productionAccepted:false`. No issuer grants, Veritas signatures,
Continuum records, Receipt Ledger or Learning Ledger writes.

## Reusing Cesium and Three mathematical prowess, not importing renderers

- **Cesium-derived, independently implemented standard geospatial
  equations:** WGS84 geodetic longitude/latitude/height → ECEF,
  WGS84 east/north/up local basis, Vincenty ellipsoid surface
  distance. Input geodetic coordinates are degrees with heights
  in metres, outputs metres. Vincenty nonconvergence rejects rather
  than silently substituting a spherical approximation.
- **Three-style independent mathematical primitives:** column-major
  affine Matrix4 compose from position, unit quaternion and scale;
  perspective homogeneous point transform; surface triangle normal,
  barycentric sample, and 3D bounding extents. Scene-local
  coordinates retain the caller's model-unit basis and are **not**
  conflated with Cesium ECEF metres.
- Cesium and Three themselves are **not required as runtime
  dependencies** of the new Formula math candidate. Their existing
  installed implementations were used as separate numerical
  references. These equations are independently implemented and
  do not copy their source modules. Respect Cesium Apache-2.0
  and Three.js MIT licenses when distributing original libraries.

## Higher-dimensional tensor and the correct projection

For one window there are 16 frames `i`; each frame contains 16
fully present spatial/scene samples `j`; each sample produces
16 explicitly named channels `c`. The 4096-element fused
tensor is `T[i,j,c]`. It retains both ECEF and ENU, geodesic and
chord distance, local transformed point, triangle normal and
local X/Y geometry extents (with explicit per-channel units).
Incomplete frames or nonfinite output fail closed.

The experimental projection implements

```text
K = samples * channels
A: 16 × K  (T flattened over spatial sample and channel)
W: K × 6   (explicit, source-provenanced feature weights)
B: 16 × 6  (explicit bias)
M[i,f] = activation( B[i,f] + Σ(q=0..K−1) A[i,q] W[q,f] )
```

For `samples=16`, `channels=16`, `K=256` and this is
`(16×256)·(256×6)+(16×6) = 16×6`.
There are 4096 input tensor values and 96 projected measurements.
These are different quantities: **4096 is not a GPU speed claim,
and a 16×16×16 WMMA tile is an instruction operand layout, not
LeeWay's 16-row historical observation schema.**

The projector accepts larger S/C dimensions, bounded to
`16×(S*C)` with `S,C<=64`, `S*C<=4096`,
and computes the six output lanes with deterministic scalar loops,
16-/32-wide tiles and compensated summation. It rejects
mismatched nonfinite tensor, weight or bias, missing calibration
identity and empty output coefficients.

**Information is compressed, not losslessly preserved.**
A 4096-to-96 projection discards information unless a separately
proven structured model provides reconstruction guarantees.
Always retain original data hashes, source geometry and
calibration provenance. `sigma` is currently an explicit
`IDENTITY` or `TANH` choice; no implicit clipping or
self-certifying learned weights.

## Actual experimental end-to-end mathematical call path

```text
Complete 16×16 spatial and local-scene samples
    -> Formula-side independent WGS84 + geometry math (16 channels)
    -> 16×16×16 fused source tensor
    -> user-supplied explicit candidate W (256×6) and B (16×6)
    -> 16×6 raw shadow measurements, with source/weight/result digests
    -> explicit six per-feature calibration ranges (reject out-of-range)
    -> unchanged canonical runtime-state-v1 adapter
    -> unchanged canonical LEEWAY-FORMULA-v1.0 evaluate()
    -> SHADOW-ONLY result hash, decimal and Base64 values
```

The output features are **not** automatically the historical
`Q,V,H,R,S,L` semantics. Those dimensions require independent
mapping from real engineering evidence, with signed authority
and source/calibration review before operational use. This
candidate does not qualify approval/safety/cost semantics.
Both maths' source tests and synthetic samples are allowed
only in this shadow pipeline.

## Verified evidence on Agent-Lee Windows laptop

- 8 standalone mathematical and projection tests PASS.
- 2 direct numerical reference tests PASS against **CesiumJS
  1.138.0** and **Three.js 0.186.1** from already available
  locally installed/offline-cached packages.
- Cesium WGS84 ECEF, geodesic and ENU match original APIs
  for multiple global coordinate pairs; ENU tolerance is
  **1e-5 metre (10 micrometres)** because operation ordering in
  ECEF subtraction causes a small double-precision difference.
  This is numerical library parity, not absolute geospatial
  survey accuracy or field calibration.
- Three Matrix4, Quaternion, Vector3, Box3 and triangle
  normal comparisons agree with original library.
- 3 full fused tensor / projection / original canonical Formula
  SHADOW tests PASS with deterministic synthetic samples;
  missing 16×16 observations, invalid ranges and result
  digest tampering fail closed.
- **Total 13/13 tests PASS** with external-library paths
  provided. Without optional library paths, CI tests must
  pass the 11 self-contained tests and honestly report the
  2 skipped external-reference comparisons.
- Canonical frozen Formula v1 golden-vector output
  remains `[4,50,63,59,48,69]`.

## Qualify before any operational promotion

1. Independently compare additional geodetic extrema and
   double-precision error budgets, especially near poles,
   antimeridian and Vincenty antipodal nonconvergence.
2. Acquire actual source-provenanced Cesium/Three observations
   from LeeWay Maps and Agent Lee, not synthetic samples.
3. Qualify the six-feature mathematical-to-operational
   mapping, normalization and weights with a separate
   source-signed owner/domain review; retain original 16×6
   Formula authority and original higher-dimensional data.
4. Run controlled `Formula OFF/ON` routing comparison
   against identical recorded workloads and same hardware,
   including overhead, correctness, retries, total duration,
   cost and resource use. Formula mathematical output itself
   is not proof of a faster or safer route.
5. Enroll new software-only protected Veritas authority and
   integrate actual LDWMD memory leases, PRE/POST,
   durable Continuum, Receipt Ledger and Learning Ledger
   per single request. Release as optional math capability
   only after all platform, ownership and original governance
   checks pass.

The G41 mathematics can support both LeeWay software CPU
compute and separately qualified physical GPU backends.
Adding mathematical breadth does not create an OS-enumerated
GPU or demonstrate NVIDIA throughput superiority.
