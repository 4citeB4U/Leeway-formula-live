<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.G43.HIERARCHICAL_TENSOR_RESEARCH
TAG: LEEWAY.G43.MACRO_4D_STREAM_AND_EXACT_SOURCE_RECEIPTS
5WH:
WHAT = Experimentally process four-dimensional macro tensors without monolithic allocation.
WHY = Separate exact retained information, compact statistical workspaces, and Formula policy control.
WHO = LeeWay creator-authorized engineering; no independent production authority.
WHERE = docs/math-engine/G43-HIERARCHICAL-MACRO-TENSOR-CHECKPOINT.md
WHEN = 2026-10-22
HOW = 64×64×8 streamed Float32 blocks, content-addressed exact G42 archival, local hash chain, reduced 32×32×8 workspace, unchanged Formula v1 shadow.
LICENSE: MIT
-->
# G43 — Hierarchical Tensor Silo checkpoint

## Intended 4D logical workload

Requested shape: **640×320×64×16**. Total **209,715,200 Float32 elements**.
At four bytes per element this is **838,860,800 bytes**, or **800 MiB**
(0.78125 GiB). The shape has **6,400 separate 64×64×8 tile instances**,
each **32,768 values and 128 KiB**.

The proposed 32×32×8 workspace contains **8,192 values**, a
**25,600:1 ratio of input to working-state element counts**.
A 16×6 Formula window is **96 values**, a
**2,184,533.333...:1 input-to-summary count ratio**.
Neither ratio by itself establishes *lossless storage compression*.
Compression and reconstruction depend on actual data structure and
whether exact source blobs remain available.

The canonical Formula v1 historical 16×6 engine is unchanged. A
32×32×8 workspace is flattened to **16×64×8**, so the mathematical
projection is a **(16×512)·(512×6) + (16×6)** candidate. A 1024×6
weight matrix would require a distinct, explicitly defined 1024-feature
per-row representation and cannot multiply the current 8192-element
workspace as written.

## What is implemented

- An explicit 4D tile iterator in `hierarchical-macro-stream.mjs`,
  checking complete canonical tile order, dimensions and finite input.
- Hashes and exact G42 compressed blobs retained for each distinct tile.
  Each tile is recorded with coordinates and hash in an **unsigned local
  experimental hash chain**. An SHA-256 digest alone is not a retained
  tensor or an independently immutable Receipt Ledger.
- Tile-exact computational reuse for location-invariant reductions.
  The implementation maintains **at most eight cached 32×32×8 partial
  reductions**; flushed partials are added into bounded workspace
  accumulators.
- A 32×32×8 Float64 reduced working state, with its own digest and
  explicit mathematical provenance. The original archived Float32
  tile content is independently reconstructable.
- A real invocation of G41's 16×64×8 projection and unchanged canonical
  Formula v1 evaluator, marked **SHADOW ONLY**, with no authorized
  Q/V/H/R/S/L semantic mapping.
- A second verification path reads the local tile journal and compressed
  objects, checks tile ordering, hashes and chain continuity, and verifies
  the exact canonical tile-stream content digest.

## Important limits and design corrections

The current G43 reducer is a **periodic coordinate fold**:
`(x,y,z) → (x mod 32, y mod 32, z mod 8)`, averaging all corresponding
samples and the final lane axis. This exercises repeatable bounded
reduction and exactly preserved tile replay, but DOES NOT provide
locality-preserving geodetic pooling or known visual quality/error
guarantees. It is **not yet an approved spatial/shader kernel**.

Full retained content plus working-state condensation are separate
representations. Hash commitments establish content identity only when
the source bytes are actually retained and read back. The journal is
local and unsigned: no protected independent Veritas PRE/POST, no
canonical Continuum, Receipt Ledger or Learning Ledger admission.

Input ingestion and source hashing still require reading every input
byte once. With low redundancy, exact compression may save little space
or cost more CPU than straightforward execution. This does not make
arbitrary tensors free to compute, resolve NP-hard/undecidable problems,
or allow physically infinite memory. Large modern physical GPUs can
already handle 800 MiB data when sufficient VRAM is available;
advantages must be measured per operation, hardware and dataset.

**Local tests:** six G43 tests PASS on small explicit shapes, including
numerical oracle, exact blob recovery, chain-tampering rejection and
original Formula shadow. The 640×320×64×16 benchmark runner was
attempted but its file operation was blocked; **the full-scale simulation
has NOT been executed or qualified in this checkpoint**.

## Next engineering acceptance targets

1. Execute the complete 6,400-tile workload with a user-approved,
   resource-bounded runner, measure peak **process RSS** and wall time,
   preserve exact sources, and perform an independent full archive
   replay. Do not infer a memory guarantee from one tile's size alone.
2. Implement **geodetically locality-preserving hierarchical pooling**,
   with explicit WGS84/ECEF/ENU units, tile boundary handling, reference
   oracle and loss/error budget.
3. Measure repetitive vs high-entropy vs real Maps/Three geometry data,
   including compression metadata, ledger bytes, CPU cycles,
   decompression, IO and timing. Evaluate repeated-state cache
   invalidation and source/operation-specific semantics.
4. Only after owner-reviewed mathematical semantics and real input
   provenance, qualify original Formula scheduling, LDWMD leases,
   independent software Veritas PRE/POST, Continuum and both ledgers.
5. Make P2P/edge partitions an **optional future transport protocol**,
   governed by node identity, signatures and consistency checks—not an
   assertion that available computation or capacity becomes infinite.

**Acceptance: G43 experimental source and small tests pass. Full macro
tensor benchmark and production governance remain NOT VERIFIED.**
