<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.LOCALITY_INTEGRATION_EVIDENCE
TAG: LEEWAY.G44.SPATIAL_NEIGHBORHOODS_AND_FULL_SCALE_INDEPENDENT_RUN
5WH:
WHAT = Document the 640x320x64x16 locality-preserving reducer and checked full-size synthetic benchmark.
WHY = G43 modulo folding falsely equates distant places; full-scale correctness cannot be inferred from compression ratios.
WHO = Creator-authorized LeeWay mathematical research, not production Veritas authority.
WHERE = Leeway-formula-live/docs/math-engine/G44-LOCALITY-FULL-SCALE-20261023.md
WHEN = 2026-10-23
HOW = Bounded 64x64x8 tile iteration, contiguous 3D bins, compensated sums, G43 archive-stream integration tests and isolated full-scale CPU benchmark.
LICENSE: MIT
-->
# G44 — Full-scale locality-preserving tensor reduction

**Status:** experimental mathematical implementation; no live GPU dispatch, protected Veritas,
canonical Continuum/Receipt/Learning Ledger admission, or signed production authorization.

## Two independent execution results

**G43 source archive baseline on Agent-Lee Windows (before remote connection went offline):**
a full *synthetic* 640×320×64×16 stream (209,715,200 Float32 logical values, 800 MiB)
processed 6,400 tiles using eight repeated patterns. Exact compressed tile archive and
local unsigned journal independently replayed and source hash matched. Local measurements:
ingestion/reduction **1,383.8 ms**; replay **235.0 ms**; combined **1,618.8 ms**;
observed peak RSS **58,245,120 bytes**; total archived storage including journal and
checkpoint **1,973,602 bytes**. This **did not use spatially local pooling**: G43 used periodic folding.

**G44 locality-aware computation in isolated Node 22 test environment after desktop went offline:**
the same logical dimensions and tile count but a separately implemented contiguous-region
reducer completed in **5,350.6 ms**, with sampled process RSS peak **33,431,552 bytes**,
and produced output digest
\`8af604e3994487997366aba235478eb239e3d73019d4aea03ddd5aa7c1e940cc\`.
Five independently recomputed output cells had **zero absolute difference**.
**This test did not archive the original 800 MiB source**, and was not run on Agent-Lee.
Do not compare latency or RSS between these two machines to infer acceleration.

## Locality-preserving mathematical definition

For a source field \(T[x,y,z,l]\) with shape \(640×320×64×16\), the
32×32×8 condensed state is

\[
 S[i,j,k] =
 \frac{1}{20\cdot10\cdot8\cdot16}
 \sum_{x=20i}^{20i+19}
 \sum_{y=10j}^{10j+9}
 \sum_{z=8k}^{8k+7}
 \sum_{l=0}^{15} T[x,y,z,l].
\]

Each output voxel summarizes **25,600 spatially adjacent input values**.
Unlike G43 \((x\bmod32,y\bmod32,z\bmod8)\), distinct distant
x/y regions are not aliased into the same voxel because of coordinate periodicity.
The reducer validates all 6,400 tiles in canonical order, uses Float64
compensated sums and verifies each of 8,192 output voxels received exactly
the expected number of source values. It explicitly distinguishes:
- locality-preserving **grid index aggregation** from true survey-qualified WGS84
  geodesy or Cesium/Three original math;
- lossy working-state condensation from **exact recoverable** source storage;
- experimental recorded hashes from actual protected independent ledgers.

Only when the **same input stream** is passed through
\`tapG44Locality(G43_tiles, reducer)\` can G43 archive the original exact content
while G44 independently computes the local workspace. A dedicated combined
small-scale test exercises actual G43 write/readback plus G44 reduction.

## Reproduction

\`\`\`bash
node --test runtime/canonical/leeway-formula/experimental-v2/tests/g44-locality-preserving-fold.test.mjs
node --max-old-space-size=256 runtime/canonical/leeway-formula/experimental-v2/bench-g44-locality.mjs
\`\`\`

The full-size standalone math benchmark is intentionally excluded from routine CI.
It uses **eight synthetic repeated patterns**; high-entropy data, real geodetic
inputs, adaptive error bounds, IO and end-to-end protected software pipeline
require separate qualification.

## Next substantive engineering gates

1. Implement and test **adaptive locality/LOD** for variable-density scene meshes
   and geodetic grids, with explicit error budgets and independent Cesium/Three
   reference oracles.
2. Run **G43 exact archive + G44 locality** together on the actual owner laptop
   under full-size shapes, preserving measured RSS and durable independent replay
   after machine connectivity returns.
3. Bind output to Formula's separately calibrated Q/V/H/R/S/L semantics and
   compare fixed execution with Formula-selected execution under matched workload.
4. Reuse actual original LeeWay signed software-only Veritas PRE/POST, LDWMD leases,
   Continuum and original Receipt/Learning ledgers; no test or local hash can
   substitute for these authorities.

This is scalable **bounded-memory computation**, not infinite capacity,
lossless 25,600:1 compression, proof of energy savings or NVIDIA superiority.


## Independent GitHub full-size archive + locality + Formula proof

The new GitHub Actions job **G44 Complete 800 MiB Synthetic Macro Proof**
executed successfully on Node 24 (2026-10-23). Workflow run
[39993822265](https://github.com/4citeB4U/Leeway-formula-live/actions/runs/39993822265),
job 120552056245. Its complete integrated path used the **same**
6,400-tile synthetic generator for G43 exact archive and G44
locality-preserving fold, independently replayed G43's local archive,
compared five locality output cells against an analytic reference, then
applied a source-explicit candidate 512×6 projection through the
unchanged canonical Formula v1 evaluator **in shadow mode**.

- Combined archived-source/locality/replay/Formula elapsed time: **8,229.165259 ms**
  on the GitHub Linux runner, excluding normal job setup.
- Independently checked working-state SHA-256:
  \`8af604e3994487997366aba235478eb239e3d73019d4aea03ddd5aa7c1e940cc\`.
  This is **identical** to the separate isolated Node 22 G44 locality test.
- Original exact archive source readback: **PASS**.
- Original local unsigned hash chain and canonical source hash: **PASS**.
- Five independent reduced-cell analytical references: **PASS**.
- Real original \`LEEWAY-FORMULA-v1.0\` shadow evaluation: **PASS**.
- Protected production authority, real Cesium/Three observations,
  approved Q/V/H/R/S/L mapping, LDWMD, Veritas, Continuum,
  Receipt and Learning Ledger: **NOT PERFORMED**.

The isolated source-simulator and GitHub runner are **not the owner's
Agent-Lee laptop**; direct cross-machine speed rankings are unwarranted.
This proof does close the G44 *synthetic full-sized combined pipeline*
gate while leaving the real-world precision, provider and protected
production gates open.
