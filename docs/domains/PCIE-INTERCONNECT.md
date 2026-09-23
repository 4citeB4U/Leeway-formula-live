# PCIe / Interconnect — LeeWay Formula Domain

## Physical truth

Software cannot manufacture additional PCIe lanes. An x8 electrical interface does not become x32 through software.

External throughput model:

[
BW\approx Lanes\times TransferRate\times EncodingEfficiency
]

Effective application bandwidth is lower because of protocol overhead, transfer size, synchronization, copies, queueing and locality.

[
PhysicalBandwidth\ne EffectiveBandwidth
]

## LeeWay role

LeeWay targets avoidable interconnect work:

- host↔device copies,
- copy frequency,
- batch size,
- synchronization gaps,
- residency,
- prefetch,
- placement/locality,
- queue pressure.

Candidate adapter:

[
I_t=[Utilization,CopyBytes,CopyRate,SyncWait,Queue,Locality]
]

The six channels may be normalized/Q69-encoded into a 16×6 history for the Golden kernel.

## Engineering objective

[
\boxed{Increase\ useful\ work/physical\ byte\ by\ reducing\ unnecessary\ movement\ and\ waits}
]

not “make x8 physically x32.”

## Evidence status

The broader LeeWay Computational Fabric promoted GPU/PCIe telemetry and used it during runtime investigations, but this repository does **not yet contain a dedicated isolated PCIe A/B campaign with a frozen numerical result comparable to the CPU/GPU chapters**.

Classification: **OBSERVED / OPEN DEDICATED PROOF GATE**.

## Required dedicated campaign

Same model/workload/hardware:

1. baseline H2D/D2H transfer bytes,
2. current generation/lane width,
3. measured bandwidth,
4. copy count,
5. sync time,
6. Formula policy,
7. post-policy measurements,
8. correctness,
9. receipt.

No “effective x32” claim is valid without an explicit metric and receipt.
