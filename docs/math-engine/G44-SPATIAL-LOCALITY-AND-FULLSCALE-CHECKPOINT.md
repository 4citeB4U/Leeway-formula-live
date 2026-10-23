<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G44.SPATIAL_HIERARCHY_QUALIFICATION
TAG: LEEWAY.G44.LOCALITY_CORRECTION_AND_800_MIB_REPLAY
5WH:
WHAT = Record corrected spatially local reduction and measured full-scale synthetic 4D archive replay.
WHY = G43 modulo-32 folding aliases distant cells; high-performance claims must reflect real source replay and memory.
WHO = Creator-authorized LeeWay engineering; not independent Veritas or certified GPU production.
WHERE = Formula docs/math-engine/G44-SPATIAL-LOCALITY-AND-FULLSCALE-CHECKPOINT.md
WHEN = 2026-10-22
HOW = Adjacency oracles, source G43 + exact G42 readback, WGS84/ENU anchored spatial metadata, 6400-tile real execution.
LICENSE: MIT
-->
# G44 — Spatially local macro-tensor streaming, honest 800 MiB campaign

## Mathematical correction

G43's existing `(x mod 32, y mod 32)` periodic reduction merged
distant spatial source cells. It remains a valid *global diagnostic
fold* but is **not** locality-preserving geodetic pooling.

G44 adds separate `spatial-locality-pooling.mjs`. Its first
reduction level maps each 64×64×8 tile to its own 32×32×8 Float64
tile using four *contiguous* source neighbors:

```text
Y[i,j,c] = (
    X[2i,2j,c] + X[2i+1,2j,c]
  + X[2i,2j+1,c] + X[2i+1,2j+1,c]
) / 4
```

The local reduced tile is linked to the exact original content hash,
and each local grid has explicit source-tile (x,y,z,lane), WGS84 anchor,
East/North origin and positive metre-per-cell resolution. Coordinates
are not silently wrapped. These metadata provide a spatial reference;
the pixel scalar channels have NOT yet been calibrated against actual
Cesium WGS84/ENU measurements or Three.js geometry semantics.

The G43 existing `ingestHierarchicalMacroTensor` now accepts a
read-only **copy** of each validated tile for the G44 optional
pool recorder. Original G42 blobs and the legacy G43 results remain
unchanged. The optional G44 path retains exact G42-encoded per-tile
pool values, a coordinate-linked local SHA-256 journal, and an
independent verification step that reconstructs original source
blocks and recomputes the local numerical pooling.

G44's `spatial-parent-pooling.mjs` additionally joins exactly four
adjacent reduced child tiles with identical z group and logical lane
into a second local parent. Independent 128×128 source-coordinate
oracles confirm each resulting cell averages the correct 4×4 source
neighborhood. Missing neighbors, boundary padding, odd parent
origins and lane mixing are rejected.

## Full-scale executed evidence on Agent-Lee Windows laptop

The G43 original streaming architecture was actually exercised with
G44 locality pooling on the entire requested logical source size
**640×320×64×16**: 209,715,200 Float32 elements, **838,860,800 bytes**
or **800 MiB**. There were **6,400** separate source chunks of 128 KiB.
The synthetic generator emitted **eight repeating source-tile patterns**.

| Metric | First run | Reproducible scripted run |
| --- | ---: | ---: |
| Original source stream tiles | 6,400 | 6,400 |
| Distinct source and local pooled tile patterns | 8 | 8 |
| Independently verified original source replay | PASS | PASS |
| Independently verified local spatial pool reconstruction | PASS | PASS |
| Measured ingest and pool time | 1,826.8 ms | Repeated, included in total |
| Measured independent readback | 282.1 ms | Repeated, included in total |
| Total elapsed | 2,108.9 ms | 2,105.7 ms |
| Observed process peak RSS | 61,972,480 B | 63,684,608 B |
| Both content-addressed archives, metadata, journals, checkpoint | 5,133,245 B | 5,133,245 B |

Source SHA-256 (both runs):
`d098d36a32dbcb5b5c9bbefecef91714f33f6313e4bc0e444e09dc2fe6fee21c`

Repeatable test:

```powershell
Set-Location 'C:\Users\Leona\workspaces\leeway-formula-g44-locality-and-full-scale'
node runtime/canonical/leeway-formula/experimental-v2/run-g44-locality-scale.mjs --full
```

The default script exercises a smaller test workload; `--full`
opts into the entire 800 MiB logical stream. By default it deletes
temporary synthetic archives after successful two-path verification;
set `LEEWAY_G44_KEEP_EVIDENCE=1` if preservation for later inspection
is specifically required. No canonical Receipt or Learning Ledger entry
is written. The local G43/G44 SHA hash chains are **unsigned** and
are not independently protected production receipts.

## Performance and scaling boundaries

The 5.13 MB recorded storage result reflects **eight repeated
synthetic Float32 patterns**, not any claim of universal lossless
compression. A separate G44 diverse-input test confirms no source
deduplication for eight distinct pseudorandom source tiles. The
logical source still requires reading every raw byte once; full
numerical calculation is not made free by hashing.

The first-level locality archive contains **6,400 separately
positioned 32×32×8 reduced tiles**, not one global location-free
32×32×8 tile. The second-level four-child reducer is tested
independently but the **full 6,400-tile recursive parent tree is
not yet assembled or persisted**. Non-power-of-two grid dimensions
(10×5 source tiles per z/lane) leave an incomplete edge row;
the parent stage must preserve that edge explicitly rather than
silently invent missing neighbors.

G44's local spatial reduction does NOT automatically promote the
unapproved geodetic/scene measurement channels into Formula's
historical Q/V/H/R/S/L semantics. G43's older global 32×32×8
diagnostic fold and Formula v1 shadow remain separate; real per-region
G44 states still require semantic mapping, calibration, authenticated
source inputs, valid Formula policy and Veritas pre/post.

No physical GPU or NVIDIA run is part of this campaign.
The ~2.1-second result is **for repeated synthetic tiling, archive,
pooling and replay only**, not dense arithmetic throughput or a
CUDA comparison. One measured peak RSS is not an enforced hard
memory cap; disk capacity, source complexity and upper-level
working-state metadata still consume resources.

## Next engineering gates

1. Persist hierarchy parents for complete 2×2 spatial
   neighborhoods and explicitly retain irregular boundary tiles;
   independently verify parent replay and topology.
2. Use original LeeWay Maps/Agent Lee spatial/geometry observations
   with real WGS84/ENU/scene units and explicit edge/precision policy.
3. Measure repeated, high-entropy and real-spatial workloads with
   compression metadata, CPU time, memory, disk and numerical error.
4. Derive and independently qualify the six operational Formula
   dimensions; compare routing OFF/ON on the same hardware and
   same requests.
5. Bind qualified execution to actual LDWMD lease, software-only
   independent Veritas PRE/POST, owner Continuum, canonical Receipt
   Ledger and Learning Ledger. The GPU remains **not production
   certified**.

**Acceptance:** G44 independent synthetic full-scale stream and
first-level locality readback PASS. Second-level numerical parent
tests PASS. Real-world spatial semantics, multi-level persisted
hierarchy and production authority remain unqualified.
