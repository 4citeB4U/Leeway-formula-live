# Real Model Qualification — Qwen3 1.1B Q4_K_M

This experiment tests a real executable quantized language model against native execution, ordinary compression, and the LeeWay Formula Stack.

## Canonical model identity

- Bytes: 688,065,920
- SHA-256: `81b64d05a23b17b34c475f42b3e72fbde62d4b92cc34541f7a8031d0752deafa`
- Format: GGUF
- Quantization: Q4_K_M
- Parameters: 1.1B

## Completed controls

Native inference executed successfully. Ordinary ZIP compression reduced the artifact to 673,409,465 bytes: **2.130095%** reduction (1.021765x). Reconstruction restored the exact source SHA-256.

## Active gate

L2 tests whether a Formula-governed representation can materially outperform the ordinary compression control while preserving exact reconstruction and later executable/behavioral equivalence.

## Live/mobile meaning

GitHub Pages is the distribution and evidence surface, not the native inference server. A later mobile PASS requires the phone to obtain the GitHub-published artifact identity, verify it, and execute that same authorized model locally. No cloud substitute counts as mobile model execution.

## Evidence ladder

L0 Native baseline — PASS  
L1 Standard compression control — PASS  
L2 Formula representation — ACTIVE  
L3 Exact reconstruction — PENDING  
L4 Executable preservation — PENDING  
L5 Behavioral preservation — PENDING  
L6 Runtime improvement — PENDING  
L7 Working-set reduction — PENDING  
L8 Hardware-boundary expansion — PENDING  
L9 Mobile execution — PENDING  
L10 Offline mobile — PENDING
