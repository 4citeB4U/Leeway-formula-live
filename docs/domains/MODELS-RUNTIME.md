# Models / Runtime — LeeWay Formula Domain

## Three different model weights

A model has at least:

1. stored artifact size,
2. runtime working set (RAM/VRAM/KV/temp),
3. effective execution burden (transfer, latency, queueing, compute).

Reducing one does not automatically reduce the others.

## Real-model storage experiment

A real ~688 MB quantized GGUF produced:

- ordinary ZIP reduction: 2.130095%
- Formula-governed M4-R2 gzip representation: 2.135058%
- exact SHA reconstruction: PASS
- material compression breakthrough: FAIL

Large tensor regions measured close to byte-level incompressible; exact 1 MiB dedupe found no duplicates; simple adjacent-layer XOR residuals got worse.

[
ByteCompression\ne ModelStateRepresentation
]

## Runtime results

Golden Formula runtime campaigns exposed different physical policies:

- keep-resident can reduce load/prefill,
- CPU thread count has a non-monotonic optimum,
- GPU context/residency create performance/capacity regimes.

## GPU working-set achievement

[
\boxed{11.18\times}
]

verified VRAM working-set reduction in the current ladder.

This is not total model compression.

## Targets

[
16×\Rightarrow199.47\ MB
]

[
32×\Rightarrow99.74\ MB
]

[
64×\Rightarrow49.87\ MB
]

Whole-layer granularity cannot reach 16× because one measured CUDA model buffer was already ~243.44 MiB.

Next gate: sub-layer tensor/block paging/streaming.

## Phone milestone

The Fold6 gate requires live local conversation:

[
ModelIdentity\to LeeWayRepresentation\to PhoneRuntime\to RealPrompt\to RealAnswer
]

The Gemma 27B gate remains preflight/acquisition until actual local inference executes.
