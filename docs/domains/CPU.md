# CPU — LeeWay Formula Domain

## Question

How can LeeWay improve CPU-bound execution without pretending CPU physics are GPU physics?

## Foundational CPU mathematics

These are established/external mathematics:

[
T_{CPU}=\frac{InstructionCount\times CPI}{ClockRate}
]

[
AMAT=HitTime+MissRate\times MissPenalty
]

[
S_{total}=\frac1{(1-P)+P/S}
]

Neural-network arithmetic ultimately includes:

[
\mathbf y=A\mathbf x,qquad c_{ij}=\sum_k a_{ik}b_{kj}
]

## LeeWay CPU adapter

Measured CPU state:

[
CPUState_t=[Utility,Frequency,Privileged,Pages,Queue,ContextSwitches]
]

Each channel is bounded/normalized, mapped into Q69, accumulated into a 16×6 history, then evaluated by the unchanged Golden kernel.

## Proven isolated CPU campaign

Model: qwen2.5-coder:1.5b in a CPU-only Ollama laboratory.

| Threads | Client ms | Gen TPS | Prompt TPS | Pages/s | Context switches/s |
|---:|---:|---:|---:|---:|---:|
| 4 | 1773 | 39.95 | 287.30 | 38,740 | 58,423 |
| 6 | 1127 | 53.04 | 398.75 | 3,201 | 53,406 |
| 8 | **1043** | 50.70 | 460.11 | 20,109 | 78,557 |
| 10 | 1117 | **58.11** | 473.32 | 24,076 | 133,202 |
| 12 | 1344 | 58.53 | **492.25** | 17,269 | 128,988 |

### Interpretation

- **6 threads:** strongest efficiency mode.
- **8 threads:** lowest measured client latency.
- **10 threads:** strong throughput mode with better tail than 12.
- **12 threads:** only marginal mean-generation gain over 10 with worse client/tail and high scheduling overhead.
- **16 threads:** prior campaign reached unacceptable duration/timeout; preserved as failure.

Compared with 4 threads, 6 threads delivered about 1.57× faster completion, 1.33× generation throughput and 91.7% lower paging in that campaign.

## Formula role

The Formula does not make the ALU/transistors faster. It identifies state and selects operating policy:

[
CPUHistory\to LW-F1\to Mode\to ThreadPolicy\to Execution\to Measurement
]

A universal state→mode law remains a research gate.

## Evidence files

- experiments/real-model-qwen3-v1/GOLDEN-FORMULA-CPU-PHYSICS-FUNNEL-V0-20260922.json
- experiments/real-model-qwen3-v1/GOLDEN-FORMULA-DUAL-CPU-GPU-20260922.json
- experiments/real-model-qwen3-v1/GOLDEN-FORMULA-GENERATION-TAIL-REPAIR-20260922.json

## Failure lessons

Sibling CPU models contaminated early results; fixed 8-thread policy was not universal; high thread counts can increase paging/context switching; CPU therefore needs CPU-native observables.
