<!-- LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.CONTINUUM.ANDROID.QUALIFICATION
TAG: LEEWAY.FOLD6.EXISTING_CONTINUUM_ADAPTER_20261025
5WH: WHAT=Evidence of existing Android owner-bound read adapter; WHY=Reuse before build; WHO=LeeWay; WHERE=Pocket native Android; WHEN=2026-10-25; HOW=Source review + ADB read-only DB existence check.
AUTHORITY: DIAGNOSTIC ONLY; NOT production qualified. LICENSE: Existing repository terms.
-->
# Fold6 native Continuum reader — confirmed existing source

Observed active Samsung Galaxy Fold6 on ADB, SM-F956U. Pocket database files exist in app-private space: `leeway-digital-brain.db`, `leeway-continuum.db`, `leeway-working-memory.db`.

Inspected existing source (local worktree `pocket-roundbox-v45-stage/app/src/main/java/industries/leeway/pocket/`):

- `LeeWayBodyDatabases.kt`: Brain schema v3 carries nodes, provenance, sync events, experiences, diagnostics. Continuum schema v1 carries universes, links, events, federation peers. LDWMD schema carries working_set and working_events.
- `AndroidContinuumReadAdapter.kt`: native GET-only application-assets `/api/continuum/status`, `counts`, `records`, `search`, `record`, `content`. Opens existing Brain/Continuum databases read-only; checks DeviceIdentity, brain_owner key fingerprint, declared resource binding and Continuum root authority.
- This route can serve Brain descriptors and content through a Continuum API. It cannot be treated as authenticated remote phone-to-PC synchronization without an independently qualified transport.
- No equivalent PC Continuum content_parts/blob ingestion tables were present in the inspected phone schema; never overwrite or reinterpret Android existing schemas to import the PC layout.
- Current test mode: source and database presence verified. No on-device live GET route call, row-level schema consistency, PC-to-Fold6 replication, device-identity proof over network, LDWMD active workload or production signoff established.

## Next acceptance
1. Find the existing Pocket native web asset handler binding the AndroidContinuumReadAdapter; execute owner-authenticated GET counts/search/content in a real enrolled app session, capture sanitized results and elapsed milliseconds.
2. Measure real native Digital Brain diagnostics and file index records, compare readback through Continuum, preserve phone bodyId and hardware provenance.
3. Qualify an existing Device Bridge authenticated same-owner synchronization transport; replicate only admitted owner-scoped records, not raw SQLite files.
4. Test LDWMD separately with a bounded lease/working-set operation and Continuum-retained receipt.
5. Query Qwen on a non-synthetic retrieved record from each device; validate citation and answer, cold/warm latency distribution.

**Verdict: EXISTING READER DISCOVERED / LIVE ENDPOINT AND CROSS-DEVICE DATA CONVERGENCE UNVERIFIED. Production lock remains blocked.**
