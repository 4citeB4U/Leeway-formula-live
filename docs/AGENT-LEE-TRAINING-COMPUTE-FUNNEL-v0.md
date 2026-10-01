# Agent Lee Training Compute Funnel v0

Status: CANDIDATE / FORMULA NOT EXECUTED

## Goal

Reduce wasted small-model training compute by separating deterministic capability from behavioral weight adaptation and by measuring compute before scaling it.

## Training law

Agent Lee is larger than the model. Skills, tools, Formula facts, current ecosystem state, device actions, memory and Discovery remain external governed capabilities. Only compressed behavioral tendencies that benefit from parameter adaptation enter the weight-training lane.

Current measured curriculum routing:
- 56 total curated examples;
- 33 weight-adaptation candidates;
- 23 deterministic harness/Formula/Discovery/tool candidates;
- 2,213 input token proxy;
- 958 token proxy kept out of weight training;
- estimated weight-training token-burden reduction: 43.29%.

This is not a measured FLOP, energy, wall-clock or gradient-step reduction.

## Six-channel training state

Each comparable training micro-batch emits:
1. token load;
2. optimization-step compute time;
3. memory pressure;
4. queue wait;
5. frozen validation gain;
6. interference/general-capability loss.

Sixteen comparable steps form the candidate 16×6 training window for runtime-state-v1 after calibration.

## Compute funnel

1. Discover and classify each example.
2. Route deterministic/external capability away from weights.
3. Deduplicate and cluster.
4. Build small bounded batches.
5. Benchmark concurrency on the actual training host.
6. Execute one bounded training block.
7. Run frozen persona/truth/strategy/retention evaluation.
8. Measure gain, interference and resource pressure.
9. Continue only while verified marginal gain justifies compute.
10. Stop, reduce batch size or reroute when overhead dominates.

## Parallelism rule

Parallelism is conditional. The machine-consciousness compute campaign on the Fold demonstrated the control principle: 1 worker beat 2 and 4 workers for a small deterministic kernel. Agent Lee training must therefore benchmark each training phase rather than assume maximum concurrency.

## Formula boundary

No numeric Formula training decision is claimed yet. `agent-lee-training-compute-v0` has no calibrated ranges. The canonical Formula remains unchanged and Formula execution remains NOT_EXECUTED until measured training traces satisfy the domain adapter and Veritas gates.