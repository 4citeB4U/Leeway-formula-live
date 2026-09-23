# GPU / VRAM — LeeWay Formula Domain

## Question

Can LeeWay reduce accelerator working set while preserving useful inference?

## Core distinction

[
GPUWorkingSetReduction\ne TotalModelCompression
]

Moving weights from VRAM to RAM is relocation and must be reported as such.

## Proven GPU lane

Model: leeway/opencode-tool-worker:latest, 2.0B Q4_K_M.

The Docker GPU path itself had to be repaired first: NVIDIA environment variables were present but Docker DeviceRequests was null. After canonical Compose repair the model became genuinely VRAM-resident.

## Closed-loop performance window

One paired campaign measured:

- client: 15.67% better
- load: 17.48% better
- prompt throughput: 37.38% better
- generation: 9.87% better
- minimum generation: 20.14% better

This is a measured window, not a universal theorem.

## VRAM achievement ladder

Baseline:

[
W_0=3,191,582,227\ bytes
]

| Mode | VRAM | Gain |
|---|---:|---:|
| default warm | 3.192 GB | 1.00× |
| context 1024 | 1.347 GB | 2.37× |
| context 512 | 1.288 GB | 2.48× |
| context 256 | 1.233 GB | 2.59× |
| context 128 | 1.220 GB | 2.62× |
| 20 GPU layers | 930 MB | 3.43× |
| 10 GPU layers | 596 MB | 5.35× |
| 5 GPU layers | 428 MB | 7.46× |
| 1 GPU layer | **285 MB** | **11.18×** |
| 0 GPU layers | 0 | CPU-only, not GPU proof |

Targets:

[
16×\Rightarrow199,473,889\ bytes
]

[
32×\Rightarrow99,736,945\ bytes
]

[
64×\Rightarrow49,868,472\ bytes
]

## 16× blocker

Runtime memory accounting at one GPU layer showed roughly:

- CUDA model buffer: 243.44 MiB
- CUDA compute buffer: 28.75 MiB
- CPU-mapped model buffer: 1047.20 MiB

The single-layer model buffer already exceeds the complete 16× VRAM budget.

Therefore the next step must break whole-layer granularity:

[
Layer\to Tensor\to Block\to ActiveWorkingSet
]

Candidate working-set equation:

[
VRAM_t=W(A_t)+KV_t+Compute_t
]

Target:

[
VRAM_t\le199,473,889
]

without hiding equivalent burden in RAM/storage/transfer.

## Evidence

- GOLDEN-FORMULA-GPU-ACHIEVEMENT-LADDER-20260922.json
- GPU-FORMULA-FUNNEL-11X-TO-16X-BOUNDARY-20260922.json
- GOLDEN-FORMULA-CLOSED-LOOP-V0-20260922.json

## Retained failures

No actual Docker GPU binding at first; mislabeled CPU lane after GPU enablement; context-only floor; zero-layer CPU fallback; 16× not reached.
