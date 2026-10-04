# MC-G9 Production-Grounded Capability LOD Benchmark — 2026-10-04

Status: VERIFIED_HOST_GROUNDED_FILE_LOADING_IMPROVEMENT
Formula: LEEWAY-FORMULA-v1.0 unchanged.
Host: Agent-Lee Windows workstation.
Workspace provider: qualified Insignia NS-PACS2B25(-C) USB / current host binding E:.

## Inventory boundary

The current Agent Skills repository audit classifies 247 skill artifacts at its semantic/audit layer. The live checkout contains 499 physical `skills/**/SKILL.md` files totaling 1,808,502 bytes. This experiment measures physical document-loading cost and therefore uses the 499 filesystem documents. It does not redefine the canonical skill-artifact count.

Agent Skills source commit:
`fe33c00cb2a466728d996fc2a9145107ca308ab5`

## Control and treatment

Control: eager full-document read of all 499 physical SKILL.md documents each iteration.

Treatment: enumerate lightweight filesystem descriptors for the full universe, then read five focal full documents per iteration.

Iterations per lane: 60.
Focal count: 5.
Execution: separate no-profile PowerShell processes on the same host/workspace.

## Reduction equation

For positive cost metric m:

`R_m = (mean(C_m) - mean(T_m)) / mean(C_m)`

`I_m = 100 * R_m`

Bootstrap: 5,000 resamples, fixed seed 20261004.

## Results

| Metric | Control mean | Treatment mean | Reduction | 95% bootstrap interval |
|---|---:|---:|---:|---:|
| Full documents read | 499 | 5 | 98.998% | [98.998%, 98.998%] |
| Payload bytes | 1,808,502 | 19,463.7 | 98.924% | [98.768%, 99.073%] |
| Wall time | 15.642 ms | 3.706 ms | 76.309% | [73.408%, 77.939%] |
| CPU time | 15.104 ms | 5.208 ms | 65.517% | [50.000%, 79.630%] |
| Working set | 92,009,199 B | 86,690,270 B | 5.781% | [5.199%, 6.393%] |
| Peak working set | 101,494,989 B | 96,589,346 B | 4.833% | [4.117%, 5.528%] |

OS process I/O read counters remained zero in both lanes and are classified NON_INFORMATIVE_OS_CACHE_COUNTER_ZERO. They are not interpreted as zero physical I/O.

## Creator >=20% gate

PASS for full-document loads, payload bytes, wall time and CPU time.
NOT >=20% for working-set and peak-working-set memory.

This is sufficient under the predeclared protocol because multiple primary system-cost metrics exceed 20%, no measured correctness degradation was introduced by this read-only benchmark, and no Formula, authority or provenance mutation was used.

## Evidence hashes

- eager.json: `664D76959F6F248F754CC4560797BC44E1D9B6BD3AB60B79AFC8299CD1B58022`
- lod.json: `F5E74C57552525E6BF2DE9104834AD043AFAE7B73AB2B976ADF407C93EAFF7B3`
- production-analysis-v2.json: `9828BC58A9C75302C6586BB2261F837B3734580BC7E8800544EF75495D1A547F`

Raw host artifacts remain under the qualified non-system workspace:
`E:\LeeWay-Work\mc-g9-production-lod\`

## Failure evidence

1. Initial benchmark attempt while E: was absent was blocked; no C: fallback was used.
2. Bootstrap analyzer v1 failed on PowerShell array multiplication precedence.
3. First corrected analyzer output path remained locked by the failed process.
4. Corrected analysis was written to a new immutable filename `production-analysis-v2.json`.

## Claim boundary

This proves substantial host-grounded reduction in skill-document loading work for the current Agent Skills checkout under warm-cache Windows conditions. It does not prove the same percentages for end-to-end agent task latency, GPU energy, cold-disk startup, model inference, or every LeeWay workload. Memory reduction is measured but below the 20% target because interpreter/runtime overhead dominates this small corpus.

## Next

Run an end-to-end Ambient Capability Field task benchmark through the real Skill Orchestrator/Universal Capability Kernel once an executable telemetry surface is identified, preserving this file-loading result as the lower-level resource proof.
