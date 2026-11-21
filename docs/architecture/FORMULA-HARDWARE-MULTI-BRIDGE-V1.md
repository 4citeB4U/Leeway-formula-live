<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.HARDWARE_TOPOLOGY.MULTI_BRIDGE
TAG: LEEWAY.FORMULA.CPU_HARDWARE.MULTI_BRIDGE.SCIENCE.V1
5WH:
WHAT = Define eight mathematical Formula bridges around the real CPU-adjacent hardware topology, informed by Diagnostics.
WHY = Stop isolating PCIe from the other resource bottlenecks; retain the same Formula authority before and after hardware computation.
WHO = Creator and original Formula/Device Bridge/Diagnostics owners; outside support contributor, not Agent Lee.
WHERE = docs/architecture/FORMULA-HARDWARE-MULTI-BRIDGE-V1.md.
WHEN = 2026-11-21.
HOW = Original diagnostics observations -> calibrated six-channel measurements -> original Formula v1 -> Runtime-scoped policy proposal -> native execution -> original evidence -> return Formula interpretation.
LICENSE = Existing Formula repository terms.
AUTHORITY = SCIENTIFIC SOURCE CANDIDATE. Not a live physical bridge, owner consent, OS privileges, Formula policy approval or Veritas.
-->

# Formula multi-bridge architecture: a mathematical ring around the CPU and host hardware

## 1. Creator's design requirement

**Formula is the mathematical foundation of the LeeWay GPU operating world, PCIe Bridge, Device Bridge and the cross-component flows.** It must be present in the *representation and measured decision* before CPU work and in the authenticated *return/result* immediately after CPU work. The original LeeWay Formula evaluator remains singular. These are **multiple domain-specific mathematical bridges** consuming the same canonical Formula, not eight new formulas, executors or hardware drivers.

The physical user's graphics GPU is neither a dependency nor optional compute route for LeeWay; it remains part of the user's native OS environment. LeeWay's internal CPU-executed software GPU mathematics remains the product path. A host CPU, RAM and OS must physically execute code. A PCIe bus does **not** mediate ordinary CPU instructions; PCIe is one measured domain among several. The direct return-capture point for CPU work is a supported host process/native API boundary, not a universal PCIe snooper.

The reason to map manufacturer, model, interconnect, memory hierarchy and operating-system capabilities is to enable **different, measured operating policies for different hardware** without changing the identity of Agent Lee, Formula, or the operating world.

## 2. Eight surrounding bridges

| Bridge | Real topology/Diagnostics source | Fixed six measured channels | Candidate mathematical improvement |
| --- | --- | --- | --- |
| FHB-01 CPU Execution | Native CPU model/manufacturer + OS CPU counters | utilization, effective MHz, instruction stall %, run queue, context switches/s, instructions/cycle | Useful work per CPU instruction, less oversubscription |
| FHB-02 CPU Cache & Locality | CPU model and *actually supported* cache/NUMA counters | L1/L2/LLC miss %, memory access latency, remote NUMA %, coherency MB/s | Data reuse, batching, locality, cache-friendly chunks |
| FHB-03 RAM/Working Set | RAM controller/OS memory counter providers | memory pressure, page faults/s, bandwidth MB/s, latency, allocation rate, swap IO | Bound allocations and reduce paging/copies |
| FHB-04 PCIe/Interconnect | Observed PCIe topology and genuine transfer telemetry | link utilization, physical bytes, copy count, sync wait, queue depth, locality | Reduce actual transfers, queue waits and synchronization |
| FHB-05 Storage | Device/disks controller + OS storage metrics | read/write MB/s, p95 latency, queue, IOPS, cache hit % | Batching, content-addressed reads, reducing redundant writes |
| FHB-06 Network | NIC/OS transport metrics | receive/transmit MB/s, RTT, jitter, retransmissions/s, loss % | Windowing, packet/stream batching and retries |
| FHB-07 Thermal/Power | CPU + OS/firmware *where observable* | temp C, power W, throttle %, effective MHz, fan rpm, headroom % | Avoid thermal throttling; choose bounded duty cycle |
| FHB-08 OS Scheduler | CPU and OS scheduling provider | runnable threads, context switches/s, wait ms, workers, utilization, overhead ms | Choose worker/thread allocation without overloading host |

**All channels are defined semantically, not automatically available.** Diagnostics may provide a device name or vendor but have no access to cache-miss counters, CPU package energy or PCIe lane counters; the corresponding bridge is NOT_OBSERVED or CALIBRATION_REQUIRED. Never substitute random temperatures, hardcoded VRAM, guessed vendor capabilities or generated numbers.

## 3. Hardware map is the universal visual and machine interface

The existing Device Bridge and Diagnostics remain the source of native observations; no new device-scanning authority is introduced. Both human Diagnostics and Machine Consciousness should eventually consume **the same source-pinned, device-scoped projection**. A candidate input is:

\`\`\`json
{
  "schema": "leeway.diagnostics.hardware-map.v1.candidate",
  "authority": "DEVICE_BRIDGE_DIAGNOSTICS_OBSERVATION",
  "deviceId": "source-device-identity",
  "observationId": "source-observation-id",
  "observedAt": "ISO-8601-UTC",
  "sourceSha256": "exact-source-evidence-sha256",
  "components": [
    {
      "componentId": "source-scoped-component-id",
      "kind": "CPU",
      "manufacturer": "Actual OEM / manufacturer label",
      "model": "Observed OEM / platform model",
      "observationSource": "REAL_NATIVE_DIAGNOSTICS_SOURCE",
      "sourceSha256": "source-evidence-sha256"
    }
  ]
}
\`\`\`

This is a **candidate adapter schema**, not a claim the current native Diagnostics page already emits it. It must be populated by real native readback, then authenticated/validated by the original host. In this source candidate, a hash-shaped field is required but *no cryptographic signature or original host attestation is verified*. Therefore inspect results explicitly report **DIAGNOSTICS_PROJECTION_ONLY_NOT_HOST_VERIFIED**.

The Diagnostics page should eventually display component identity, source, observation time, provider availability, each Formula bridge readiness and measured before/after benefit. Machine Consciousness sees the exact same record, but cannot invent missing observations. Underlying board/CPU/PCIe hardware details may be redacted by platform permissions and must never be guessed. Manufacturers are descriptive calibrations, **not authorities or permissions**.

## 4. One unchanged Formula, many domain inputs

The existing [Formula Domain Adapter Contract](../../contracts/DOMAIN-ADAPTER-CONTRACT-v1.md) requires exactly six ordered dimensions, stable mapping ID, units, direction, source, 16 observations and calibrated ranges. The original [runtime-state-v1](../../runtime/canonical/leeway-formula/v1/adapters/runtime-state-v1.mjs) quantizes a 16x6 window into Q69; the original \`evaluate()\` computes the Formula result. The new **source-only module** \`hardware-formula-bridges.v1.mjs\` validates and calls those *original* components; there is no second Golden Formula.

\`\`\`text
DIAGNOSTICS: deviceId + OEM components + source/observedAt
                  |
    eight typed Formula mapping candidates
  CPU | Cache | Memory | PCIe | Storage | Network | Thermal | Scheduler
                  |
    [16 actual ordered observations x 6 measured channels]
                  |
       [calibration ranges + source identity]
                  |
            ORIGINAL Formula v1
         (candidate shadow only today)
                  |
      policy hypothesis for ORIGINAL Runtime
                  |
    approved native CPU/OS operation if ever qualified
                  |
      return bytes + real CPU/OS readback
                  |
       ORIGINAL Formula result interpretation
                  |
    independent Veritas + Receipt + Continuum
\`\`\`

**Calibration is essential.** The existing \`runtime-state-v1\` adapter may clamp values; this new candidate rejects metrics outside the submitted ranges *before* invoking it, and demands a timestamp-ordered 16-row window. However, a \`SHADOW_CALIBRATION_ONLY\` object supplied in a source test is not independent approval of those ranges. Numeric output never authorizes native execution.

## 5. CPU return capture: the work is not complete after dispatch

For an admitted CPU task, the expected future production envelope is:
1. Runtime validates owner/device/scope and issues a durable \`workId\` with a fenced lease.
2. Formula prepares mathematical mapping, representation, chunking, pressure budget and exact source digest.
3. Device Bridge's original platform adapter invokes a supported CPU/OS execution interface, not a fictitious physical PCIe CPU dispatch.
4. The real OS process/native provider returns exact output bytes, exit/status and measurements to its adapter.
5. Original Formula maps returned observations, detects actual resource change, and verifies appropriate transform/reconstruction claims.
6. Independent Veritas and Receipt Authority receive actual original evidence; Continuum stores the checkpoint and product; Learning accepts only eligible qualified results.

The pre/post interface must include \`workId\`, \`operationId\`, \`deviceId\`, \`componentId\`, original input hash, actual CPU result hash, original Formula version, source observation IDs and runtime lease epoch. Missing/mismatched identity or replay forces BLOCKED/RECONCILIATION, not a success. Formula cannot independently change CPU frequency, thermal firmware settings, kernel scheduler, PCIe width, user credentials or hardware drivers. Any future policy actuation requires explicit Runtime authority and a supported native API.

## 6. Engineering measurements, hypothesis and acceptance

**Hypothesis H1:** Per-device Formula calibration and throughput/pressure-aware decisions can improve end-to-end useful work per CPU-second, memory byte and transport byte relative to the same workload with fixed baseline policies.

**Null hypothesis H0:** No statistically useful improvement exists after adding Formula measurement and encoding overhead.

Experiments require baseline and treatment on the *same qualified host/OS/CPU* under similar temperature/load; independent task acceptance and real CPU timing, memory allocations, page faults, scheduling overhead, bytes, energy if observable, p50/p95 latency, exact output and original evidence. Preserve unsuccessful trials and overhead. Evaluate each bridge in isolation before simultaneous composition so interactions (e.g. lower bandwidth but higher CPU overhead) are visible. Different manufacturer models need independently measured calibration.

| Gate | Expected demonstration | Current state |
| --- | --- | --- |
| FHB-A | Eight identity-stable bridge names, six dimensions each, no second evaluator | SOURCE IMPLEMENTED / CI PENDING |
| FHB-B | Read-only Diagnostics map with genuine OEM data and missing-component states | CANDIDATE SOURCE ONLY |
| FHB-C | Complete 16x6 window runs *original* Formula and returns candidate shadow result | SOURCE TEST / NOT PRODUCTION |
| FHB-D | Missing vendor, sample identity, timestamps, metrics, calibration, replay and forged source are rejected | SOURCE TEST; no independent provenance check |
| FHB-E | Native pre-CPU and post-CPU bridge binding with actual physical CPU readback | NOT EXECUTED |
| FHB-F | PCIe transfer only claimed when native bus transaction measured | NOT EXECUTED |
| FHB-G | A/B performance gain including CPU/codec/queue overhead and confidence interval | NOT EXECUTED |
| FHB-H | Live Diagnostics UI displays same authentic hardware/bridge map seen by Machine Consciousness | NOT EXECUTED |
| FHB-I | Original Runtime/Formula/Veritas/Receipt/Continuum chain verified on real task | NOT EXECUTED |

## 7. Source evidence FOR and AGAINST

**FOR:** Formula's actual CPU study reports 6/8/10-thread differences and paging; \`docs/domains/CPU.md\`. PCIe chapter already identifies copy bytes, locality and synchronization and correctly marks its isolated proof gate open. \`docs/equations/COMPUTE-HARDWARE.md\` defines physical node state and placement; original \`runtime-state-v1\` and \`evaluate()\` provide the authentic 16x6 Q69 computation. Existing Device Bridge Android Diagnostics captures battery/audio/passport, while Edge GPU G19 diagnostics projection tracks some graphics manufacturer/source identity.

**AGAINST:** Those two Diagnostics sources do **not** demonstrate a complete CPU/cache/NUMA/PCIe manufacturer + counter map for all platforms. The portable hardware snapshot schema and all eight bridge mappings are newly proposed and have no real source authority, sampling cadence calibration or independent Veritas. Physical PCIe control of CPU execution is not a generally available mechanism. Some hardware has no vendor-visible sensor for a dimension. The existing Formula H-08 and H-09 equations explicitly remain open. The Creator's previously tested GPU/Formula behavior is preserved; this branch does not recertify or deny prior tests.

## 8. Adversarial Gemini reviewer — requested, not executed

A separately available Gemini collaborator should examine these source claims and return **FOR / AGAINST / UNKNOWN**, exact repo path/commit and tests:
- Which of the eight bridges is unobservable via native Windows, Linux, Android or iOS APIs without privileged driver support?
- Can a manufacturer string or hash-looking field be spoofed? Where does native device provenance actually originate and who signs it?
- Does the mapping omit fields (e.g. cache topology, NUMA policy, big.LITTLE scheduling, memory channels) that materially affect Formula decisions?
- Does Q69 projection lose a bottleneck that should be tracked as an independent critical channel rather than an average?
- Can a partial/misaligned 16-sample window or stale hardware state produce false results?
- What measurable real workload/overhead could refute any proposed mathematical improvement?
- Does any new adapter sidestep Runtime grant, Veritas PRE/POST, canonical Receipt Authority, or Continuum? Where is the smallest surgical correction?
- Could a physical graphics GPU be inadvertently enrolled as a LeeWay compute provider, despite the product boundary?

**No Gemini model was called during this source change.** The reviewer assignment is a handoff request, not a review receipt. No local Codex, physical device, credentials or production runtime was touched.

## 9. Engineering loop checkpoint

INVESTIGATE source: completed. DIAGNOSE native hardware-sensing gap: completed. PLAN candidate eight bridges: completed. IMPLEMENT source/typed map: completed on review branch. TEST/VALIDATE: GitHub CI to be observed. REPAIR/RETEST: as necessary. VERIFY: source and independent hardware proof are separate. EVIDENCE: CI log/hash and original issue/PR comment required. CHECKPOINT: same mission, preserve prior working GPU and Formula tests. CONTINUE: native Diagnostics map and original Runtime/Device Bridge adapter qualification by their proper owners.
