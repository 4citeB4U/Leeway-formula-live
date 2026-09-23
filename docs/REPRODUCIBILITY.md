# Reproducibility and Challenge Protocol

This repository is intended to be challenged.

## Reproduce Formula authority first

1. verify Formula ID/version,
2. verify implementation SHA,
3. run Golden input,
4. confirm Golden output:
   [
   [4,50,63,59,48,69]
   ]
5. confirm QB64:
   [
   [E,y,/,7,w,BF]
   ]
6. preserve input/result hashes and receipt.

If Golden output fails, domain experiments are not comparable.

## A/B law

Use same hardware, model/file, prompt/workload and acceptance criteria. Run native/control first, Formula-controlled second, and repeat when variance matters.

## Hardware/model measures

- load time
- TTFT
- prompt/prefill rate
- generation rate
- total time
- RAM
- VRAM/shared accelerator memory
- CPU/GPU utilization
- storage reads
- transfer bytes
- queue wait
- failures
- response correctness

## Storage/media measures

- original bytes
- represented bytes
- exact vs behavioral mode
- reconstruction hash when exact
- quality/fidelity metric when behavioral
- encode/decode cost

## Claim labels

VERIFIED | OBSERVED | INFERRED | PROPOSED | UNVERIFIED | FAILED | BLOCKED

## Receipt law

A receipt records what actually happened.

If nothing executed:

RECEIPT NOT CREATED; LEARNING LEDGER NOT UPDATED.

## Independent review questions

- What equation was used?
- What version/hash?
- What raw measurement fed it?
- What policy changed?
- What physical action executed?
- What improved?
- What regressed?
- What failed?
- What was relocated rather than reduced?
- What is still only a target?
