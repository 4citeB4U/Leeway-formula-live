<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.SCIENTIFIC_EVIDENCE.PC_INVENTORY_CPU_AB
TAG: LEEWAY.FORMULA.PC_HARDWARE_RETAINED_AND_REAL_CPU_AB.20261121
5WH:
WHAT = Record authenticated retained primary-PC hardware readback and real CPU mathematical transfer-representation experiment.
WHY = Promote measured source and measured CPU evidence without inventing fresh PC execution or PCIe DMA.
WHO = Creator / original Formula and Device Bridge authorities; bounded outside support author, not Agent Lee.
WHERE = docs/evidence/FORMULA-PC-RETAINED-DIAGNOSTICS-AND-CPU-AB-20261121.md.
WHEN = 2026-11-21.
HOW = Original owner-scoped Bridge file read, original SHA, eight bridge readiness checks, paired raw vs exact compression CPU A/B on CI runner, source log hashes and negative controls.
LICENSE = Existing Formula repository terms.
AUTHORITY = ORIGINAL SOURCE-CI EVIDENCE; NO VERITAS, RECEIPT AUTHORITY, PRODUCTION GPU, LIVE PC PERFORMANCE OR REAL PCIe TRANSFER CLAIM.
-->

# Experimental checkpoint — actual PC hardware inventory + measured CPU Formula-candidate transfers

## Original mission and governing hypothesis

This continues the single LeeWay GPU operating world / Formula multiple CPU-adjacent bridges / Device Bridge / Continuum mission. It does not reset proven 11/11 original Formula hardware bridge source tests or earlier G41/G44/GPU experiments. We correct the previous overly broad claim that all physical-device evidence was absent: **authenticated primary-PC retained physical inventory readback was in fact performed**. However **fresh host CPU/PCIe benchmark execution** via current ChatGPT Device Bridge remains unregistered.

Hypothesis H1: A Formula-governed exact representation policy can reduce the *payload bytes* of compressible data (possible benefit for transfer), while detecting incompressible data avoids unnecessary CPU compression overhead. Null H0: added compression, decoding and detection overhead outweighs benefits, especially with PCIe-class bandwidth or high-entropy data. This experiment measures **representation bytes, exactness, elapsed time and CPU time** without claiming a physical PCIe transfer.

## 1. Physical PC baseline — actual retained native observations

- 2026-11-21 managed LeeWay Device Bridge returned \`runtimeFabric.status:AVAILABLE\`, \`authentication:OIDC_ACCESS_TOKEN_VERIFIED\`, PC \`device.health\` PASS with \`physicalProbe:EXECUTED_NOT_INDEPENDENTLY_VERIFIED\`.
- Actual bounded workspace \`device.files.read\` successfully read original physical PC report \`pc-consciousness-live/runtime/adapters/edge-device/reports/device-system-health-report.json\`.
- Source SHA256: \`dec65d739e412d59d81895ec6ebee8b669d711a12604bcca0ba969eaf1377ad8\`; Bridge read receipt ID \`6abc19bc-3957-4d40-bd1f-f9b7a1d8fb49\` (source read observation, **not** independent Veritas or canonical production Receipt Authority).
- Original report \`generatedAt:2026-10-04T23:55:37.693Z\`, successfully retrieved in November; not new measurement of 2026-11-21 CPU pressure.
- Original reported \`Intel(R) Core(TM) Ultra 9 275HX\`, **24 logical processors**, approximate \`3072 MHz\`, RAM \`31.43 GiB total\`, \`0.72 GiB free at Oct 4 report generation\`, historical two volumes and \`Realtek PCIe GbE Family Controller\` inventory.
- Sensitive host names, MAC addresses, serials, absolute personal paths and full raw system file are intentionally **not** duplicated in the public Formula PR. The minimized exact fields, source digest, original receipt reference and clear age are recorded in \`docs/evidence/pc-primary-retained-hardware-20261121.v1.json\`.
- Native PC \`bridge_pc_diagnostics_read\` and even read-only \`bridge_device_process_execute\` returned \`LEEWAY_BRIDGE_EXECUTION_TOOL_NOT_REGISTERED\`. Original Runtime upstream \`tools/list\` name binding therefore stops the new native calculation BEFORE the local process is called. No bypass attempted.

### Eight bridge readiness gates from actual retained data

| Original bridge | What actual report covers | Status of 16×6 live Formula metrics |
| --- | --- | --- |
| CPU execution | CPU model, 24 logical processors, recorded MHz | MISSING |
| CPU cache/locality | No L1/L2/LLC miss/NUMA channel readings | MISSING |
| RAM working set | Retained total/free capacity | MISSING |
| PCIe | Historical PCIe NIC identity, not bus counters | MISSING |
| Storage | Two retained volumes; no IOPS/latency series | MISSING |
| Network | NIC and historical link status; no RTT/loss sequence | MISSING |
| Thermal/power | No qualified CPU temperature source | MISSING |
| OS scheduling | Logical processor count, not queue/contexts window | MISSING |

**Result:** Real inventory evidence qualifies the identity/topology *input* for certain bridges, but cannot be promoted into sixteen historical time-ordered measurements per six channels, a CPU benchmark, a measured physical PCIe transfer, or a Formula decision. The \`qualifyRetainedHardwareForFormula()\` source emits eight explicit gates and refuses altered provenance/execution claims.

## 2. Real CPU work performed independently in GitHub Actions

The original Formula source PR runs a real CPU mathematical/data-representation experiment under Node 22 on GitHub Actions using the runner's CPU (reported **AMD EPYC 7763 64-Core Processor**), not the Creator's Windows PC. The host's graphics GPU is never invoked. Source: \`runtime/canonical/leeway-formula/experimental-v2/real-cpu-representation-ab.v1.mjs\`.

For each input, the experiment takes 16 blocks of 32 KiB = **524,288 original bytes** and runs seven alternating-order paired trials:
- A: raw copied 16-block payload.
- B: Formula-candidate (NOT approved canonical Formula policy) samples exact byte entropy; where low, packs and reconstructs through Node \`zlib\` deflate; where high, skips compression and preserves raw representation. Exact original SHA256 and byte content are checked after reconstruction.
- Measures individual real wall/CPU time samples and payload bytes. Every trial's original measurements are retained in CI logs and artifact, alongside a fixed deterministic high-entropy dataset generator embedded in source. No PCIe, DMA, physical GPU, remote PC CPU or actual network transport occurs.

### Latest stable measured-run baseline

[CI run #44923960599](https://github.com/4citeB4U/Leeway-formula-live/actions/runs/44923960599), source SHA \`2ea20609768ca4ed052ed578c096139f92cf5722\`:
- Existing hardware bridge tests **11/11 PASS**, real inventory/CPU research tests **4/4 PASS**, original Formula golden vectors **PASS**.
- Repeated-byte dataset: 524,288 → **2,305 bytes** payload, **99.560356% payload reduction**, exact reconstruction. Median raw copy \`0.490043 ms\`; Formula-candidate \`1.722652 ms\`. **Candidate cost more CPU wall time without transfer**, important result AGAINST net latency.
- High-entropy SHA256-generated deterministic dataset: 524,288 bytes raw → **524,288 bytes** after preflight; estimated entropy **7.976508 bits/byte**; compression skipped, exact data preserved. Median raw \`0.670901 ms\`, candidate \`0.419292 ms\`. Variance from small submillisecond trials and runner scheduling precludes a general speedup conclusion.
- Actual original CPU execution took place on the CI runner. Source count and independent operation on the Creator's Windows PC are **not proven by that**.
- No measured physical PCIe transfer; physical link speed, DMA bytes, host copy overhead and driver counter data remain missing.

The previous initial run [#44923769517](https://github.com/4citeB4U/Leeway-formula-live/actions/runs/44923769517) deliberately attempted deflate on random data and recorded **0% saved bytes**, \`9.193472 ms\` candidate versus \`0.343548 ms\` raw median on its runner. This negative result prompted the preflight policy repair. It remains retained as evidence AGAINST unconditional compression; different CI runs are not a same-host controlled comparison for the new-vs-old algorithm.

### Limits of performance claims

These tests do **not** prove an inherently faster "LeeWay GPU" than the Creator's host GPU or CPU, a live PCIe bridge, or the 21 original logical GPU components. They demonstrate (1) genuine stored PC hardware discovery, (2) original Formula mathematical/source continuity, (3) CPU-executed exact representation with measured byte benefit and measured CPU cost, and (4) an experimental entropy policy rejecting a known wasteful path. Any Formula candidate policy promotion requires original owner review, real Windows CPU/PCIe measurements, and independent Veritas/Receipt custody.

## 3. Evidence for, against and remaining engineering work

**FOR:** Original PC Diagnostics hardware report exists with exact source/Bridge read custody. One working Device Bridge file read route reaches the actual PC bounded workspace. Source code maps eight hardware domains to original unchanged Formula v1; 11/11 tests pass. Real experimental CPU code executed on GitHub Actions and reconstructs every sample exactly, measuring concrete compression and CPU overhead. Golden regression unchanged.

**AGAINST:** PC report is dated October 4. Live native read still fails upstream registration. No fresh 16×6 metrics, Formula policy grant, user-PC CPU trial, bus DMA/probe, performance improvement under actual PCIe, independent Veritas PRE/POST, original production Receipt Authority or Continuum runtime checkpoint has been observed. Real CI CPU ≠ enrolled \`pc-primary\`. No user device/software settings were modified.

**Next executable bridge qualification:** Restore only the original authenticated \`pc_diagnostics_read\` / \`digital_brain_read\` native read registrations with correct owner/device scopes. Capture actual 16 samples with available OEM counters in the existing Diagnostics provider (unavailable metrics remain unavailable). Execute a paired real on-PC baseline/treatment with exact workId, CPU/RAM time, hash, input bytes and native PCIe counters only where a genuine bus transfer occurs. Original Veritas and Receipt Authority then independently qualify results.

**Scientific status:** RESEARCH_SOURCE_PASS / REAL_RETAINED_PC_INVENTORY_READ_PASS / REAL_CI_HOST_CPU_AB_PASS / LIVE_PC_CPU_BRIDGE_MEASUREMENT_NOT_EXECUTED / PHYSICAL_PCIE_TRANSFER_NOT_EXECUTED / NO_PRODUCTION_ADMISSION.
