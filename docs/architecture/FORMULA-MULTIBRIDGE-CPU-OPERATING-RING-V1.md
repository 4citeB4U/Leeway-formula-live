<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CPU.MULTIBRIDGE.OPERATING_RING
TAG: LEEWAY.FORMULA.CPU.MULTIBRIDGE.SCIENTIFIC.CANDIDATE.V1
5WH:
WHAT = Define distinct Formula-governed measurement and return bridges surrounding physical CPU computation.
WHY = Formula must shape the entire LeeWay software-GPU workload cycle, not appear only before one PCIe transfer.
WHO = Creator/Human Authority; LeeWay Formula original source owner; outside support contributor (not Agent Lee).
WHERE = docs/architecture/FORMULA-MULTIBRIDGE-CPU-OPERATING-RING-V1.md in 4citeB4U/Leeway-formula-live.
WHEN = 2026-11-21.
HOW = Reuse canonical Formula evaluator and hardware domains, define 9 scoped adapters, typed evidence envelopes, pre/post return, falsifiable research gates.
LICENSE = Existing repository terms; none newly asserted.
STATUS = SOURCE_CANDIDATE_ONLY; NOT_EXECUTED_ON_PHYSICAL_HOST; NO_PRODUCTION_FORMULA_OR_VERITAS_ISSUED.
-->

# Formula Multi-Bridge CPU Operating Ring — scientific candidate V1

## Creator's corrected premise

The **Formula is the mathematical foundation** for LeeWay's software GPU operating world, the Device Bridge's bounded movement, and the PCIe/interconnect adapter. It must surround the actual hardware's CPU-related processing paths and govern **preparation → physical execution → post-processing**, without demanding the user's physical graphics GPU or replacing the owner's operating system.

This is **one original Formula authority with multiple independently measurable domain bridges**, not nine Formula copies, drivers, control planes, GPU cards, or new agents. The CPU executes actual instructions through the host OS and system memory. Formula's bridges observe typed state, prepare representations and propose operating policies; the original authorized Runtime controls execution, the native Device Bridge presents OS permissions, the original Formula evaluator decides mathematical state, independent Veritas evaluates verified outcomes, Receipt Authority retains real evidence, and Continuum preserves experience/checkpoints.

### CPU topology and nine bridges

| ID | Formula bridge | Actual OS/CPU interaction | Proposed six measurements (must be measured, not invented) |
|---|---|---|---|
| FB-01 | Instruction & workload preparation | Workload shaping before CPU fetch/decode; algorithm selection and batching | instructions, cycles, retiredInstructions, branchMisses, batchItems, prepLatencyUs |
| FB-02 | Scheduler & core placement | OS thread scheduling, affinity, load, run queue | runnableThreads, runQueueDepth, contextSwitches, migrations, cpuUtilizationPct, queueLatencyUs |
| FB-03 | Cache & locality | Cache hierarchy and memory access patterns | l1Misses, llcMisses, cacheMissRatePct, workingSetBytes, localityScore, stallCycles |
| FB-04 | RAM, NUMA & page flow | Memory allocation, page faults, NUMA placement and bandwidth | rssBytes, majorPageFaults, minorPageFaults, numaRemoteAccesses, memoryBandwidthBytesPerSec, allocationLatencyUs |
| FB-05 | PCIe & device interconnect | Optional actual PCIe peripheral transfers and DMA, never a universal CPU instruction path | transferredBytes, transfers, syncWaitUs, linkBandwidthBytesPerSec, queueDepth, measuredLatencyUs |
| FB-06 | Storage & filesystem I/O | OS-backed file reads/writes, caches, prefetch and persistence | bytesRead, bytesWritten, readOps, writeOps, fsyncLatencyUs, ioQueueDepth |
| FB-07 | Network & IPC | Work arrival/return, RPC, sockets and cross-process message flow | bytesSent, bytesReceived, messages, retryCount, roundTripUs, ipcQueueDepth |
| FB-08 | Thermal, power & CPU operating state | OS/firmware power governor, frequency and throttling telemetry | cpuFreqMHz, thermalC, powerMilliwatts, throttleEvents, packageUtilizationPct, activeCores |
| FB-09 | Native CPU result/return | Exact native result bytes, service callback and output-state capture | outputBytes, elapsedUs, outputChunks, errors, retries, verificationLatencyUs |

Each bridge may report **OBSERVED** with a source-labelled, bounded six-channel snapshot, or **NOT_OBSERVED** with no invented zeroes. Missing performance counters must remain missing; unprivileged systems are not required to expose vendor-specific telemetry. FB-05 is **NOT_OBSERVED** when no genuine PCIe transfer occurs.

Hardware references for external semantics (not evidence that LeeWay ran them):
- Linux scheduler [EEVDF](https://docs.kernel.org/scheduler/sched-eevdf.html) and [CPUsets/NUMA](https://www.kernel.org/doc/html/v5.15/admin-guide/cgroup-v1/cpusets.html).
- Linux [PCI host-controller documentation](https://docs.kernel.org/PCI/controller/pci-controller-drivers.html): PCI addresses are for downstream devices and DMA, not the normal path to execute CPU instructions.
- Intel [Optimization Reference Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html): cache, branch, front-end and instruction/memory performance are actual CPU-specific resources.
- Original LeeWay source [CPU](../domains/CPU.md), [PCIe](../domains/PCIE-INTERCONNECT.md), [Compute & Hardware](../equations/COMPUTE-HARDWARE.md), [Storage](../domains/STORAGE-MEDIA.md), and [USB](../domains/USB-DEVICE-IO.md).

### Operational circulation

\`\`\`
Agent Lee / Machine Consciousness
         │ goal (NOT hardware authority)
Original Runtime Fabric ⇄ owner permission / lease / workId
         │
Canonical LeeWay Formula mathematical authority
         │ FB-01 prepare/representation, bound to original Formula decision
         ├─ FB-02 scheduler/core     ─┐
         ├─ FB-03 cache/locality      │
         ├─ FB-04 RAM/NUMA/page        │       Host diagnostics:
         ├─ FB-05 PCIe (if applicable) ├──>  measured OS/native adapters
         ├─ FB-06 storage/I-O         │       (no authority to execute)
         ├─ FB-07 network/IPC         │
         └─ FB-08 thermal/power       ─┘
         │
Original Device Bridge bounded OS native adapter
         │ OS grants, audited handoff; no arbitrary CPU bypass
     HOST CPU + RAM (actual instruction execution)
         │
FB-09 authenticated native result-return callback
         │ exact workId/input identity/output bytes and host observation
Original Formula evaluation/reconstruction/reconciliation
         │
Original Runtime → independent Veritas → Receipt Authority
         │
Continuum / Digital Brain / Agent Lee next state
\`\`\`

**A bridge is a domain-specific software adapter plus measurable evidence.** It is not an electrical connection around CPU transistors, a CPU interrupt hook, another physical PCIe lane or a substitute for CPU/RAM. A single CPU workload may involve all applicable bridges without requiring every metric to be observable.

### Strict roles and authority

- **Formula owns mathematical decisions, not host commands.** All bridge observations must map via owner-approved calibration/adapters to the **unchanged canonical Formula**; the six-channel shapes above are candidate measurement schemas. Do not invent Golden results by directly treating six arbitrary measurements as Q69.
- **Runtime owns work scheduling and permission.** A bridge cannot issue grants, enable a driver, spawn a process, alter affinity, touch a register or enact CPU power control.
- **Device Bridge owns native access.** Use supported OS APIs or reviewed native modules with explicit capability grants. Users' physical graphics GPUs remain outside the canonical LeeWay mathematical compute provider; GPUs may still render their own OS/browser UI.
- **CPU executes the work.** The CPU itself is normally connected to RAM/cache through processor-memory architecture; PCIe connects peripheral devices and can carry memory/DMA transactions **only where physically applicable**. Do not misrepresent userland process execution as a PCIe transaction.
- **Formula governs the post-CPU return.** Check correlation, exact data codec reconstruction, actual output integrity, memory budget release and continuity reference. CPU work may intentionally change input bytes, so output hash need not equal input hash; lossless *transport reconstruction* must equal the original payload.
- **Independent evidence remains independent.** Pre/Post Veritas, source execution receipts and Learning Ledger are not generated by the proposed bridge helpers or a model. No arbitrary callback can qualify itself as trusted physical host execution.

### State representation and measurements

An FB snapshot is \`{bridgeId, state, measurements, provenance}\`. For OBSERVED require *all six specifically named finite nonnegative measurements*, and source/time metadata; never default absent metrics to zero. Reject unknown bridge/metric, negatives, NaN/Infinity and mixed state. For NOT_OBSERVED, measurements must be empty and cannot be used as a zero-load inference.

Use original \`LW-F1\` only after a **separately approved** per-metric scaling and a 16×6 history as provided by an actual Formula owner. The candidate helper in \`experimental-v2/cpu-formula-bridge-ring.mjs\` does NOT call \`evaluate()\`, return Formula PASS, issue execution permission or write receipts; it only validates and hashes evidence and stages the **pre → post CPU return** correlation.

### Source guard and failure states

The candidate roundtrip requires source-pinned original input bytes, unique scoped workId/operationId, provenance, original Formula decision reference, and observation records. It creates **CANDIDATE_NOT_AUTHORIZED** records. After a native host produces its result, the helper accepts return data only if its provided correlation fields and output hash match. It still reports **UNVERIFIED_NATIVE_RETURN** because the source helper cannot cryptographically verify a real host/OS. Never treat this as production execution proof. If the actual native agent is absent, the post step is **NOT_EXECUTED** and tasks remain queued under original Runtime authority.

### Experiment matrix

| Gate | Experiment | Truth boundary |
|---|---|---|
| FBR-01 | Formula original Golden vectors unaffected | No duplicate evaluator or altered kernel |
| FBR-02 | All nine bridge schemas observed/not-observed | No missing-as-zero or falsely validated measurements |
| FBR-03 | Real CPU work with Formula pre and post replay | Original Runtime/Formula bindings needed |
| FBR-04 | CPU run with all external graphics-GPU compute disabled | Physical negative test required |
| FBR-05 | Cache/NUMA/scheduling comparisons on same CPU | Real counters with before/after; compare equal workloads |
| FBR-06 | PCIe peripheral transfer with measured DMA and lane topology | Physical PCIe evidence required; optional otherwise |
| FBR-07 | Bad return workId, stale operation, corrupt bytes and wrong source | Must reject before durable advancement |
| FBR-08 | Compression overhead versus saved bytes and CPU latency | Test high-entropy and compressible data; report regressions |
| FBR-09 | CPU throttling/thermal pressure and bounded degraded state | Never claim hardware governor changed without OS evidence |
| FBR-10 | Full user-device loss with durable host and same workId | Original Continuum and Runtime independent live readback |

**Current classification:** first two gates can be assessed in source CI; remaining physical tests NOT_EXECUTED here. Earlier LeeWay Formula experiments remain valid historical inputs; they are not discarded or relabelled. The Creator's 21 logical GPU components remain **CREATOR_SPECIFIED_INVENTORY_PENDING**; nine Formula bridges are **not** the same as those 21 components.

### Adversarial research assignment — Gemini pending

Gemini should challenge FB-01–FB-09 on processor architecture and real counter availability. Ask:
1. Which metrics cannot be obtained without privilege on Windows, Linux or mobile? Offer a legitimate observable alternative and label gaps.
2. Which proposed gains are actually bounded by Amdahl's law, CPI, memory bandwidth, scheduler decisions, cache topology and OS permissions?
3. Can any bridge bypass or duplicate Formula, Runtime, Veritas or Receipt Authority? Inspect exact source, not intent.
4. Can a measurement source forge physical PCIe evidence, host execution or an output digest? Design negative cases.
5. Does the return path correctly separate transport byte identity from computation result identity?
6. Are the mathematical optimizations real on representative workloads, including incompressible data, high memory pressure and high thread contention?
7. Does any implementation silently schedule a user's physical graphics GPU?
8. Return evidence FOR/AGAINST/UNKNOWN, source SHAs, reproduction commands and minimal corrective tests.

**Gemini has not reviewed this document yet.** No Gemini connector was callable at creation; this is a handoff, not a fabricated adversarial assessment.

### Go/no-go

**Source CI success ≠ physical CPU or PCIe proof ≠ Formula policy approval ≠ independent Veritas ≠ production.** Any actual CPU-native deployment requires the original Runtime and Device Bridge owner, approved Formula calibration, live OS adapter, permission, physical validation, exact receipt custody and recovery.
