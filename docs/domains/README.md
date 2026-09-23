# LeeWay Formula Domain Index

Each domain gets its **own physics, its own adapter, its own actuator, its own evidence, and its own failures** under one Formula authority.

- [CPU](CPU.md) — CPU time, AMAT, Amdahl, paging, context switching, thread modes.
- [GPU / VRAM](GPU-VRAM.md) — VRAM working set, context/KV, layer residency, 11.18× ladder, 16× boundary.
- [PCIe / Interconnect](PCIE-INTERCONNECT.md) — physical bandwidth vs effective bandwidth, transfers, locality, synchronization.
- [USB / Device I/O](USB-DEVICE-IO.md) — Fold6/ADB, verified device path, transfer/reconstruction scope.
- [Storage / Media](STORAGE-MEDIA.md) — exact reconstruction vs behavioral representation, images/audio/video.
- [Models / Runtime](MODELS-RUNTIME.md) — file size vs runtime working set vs execution burden.
- [Context / Decision Engineering](CONTEXT-DECISION.md) — behavioral and knowledge/epistemic Formula use for LLMs/agents.

## Domain law

[
\boxed{Same\ Formula\ authority\;\ne\;same\ domain\ physics}
]

The CPU chapter must not inherit GPU assumptions. PCIe math must not be presented as storage math. Behavioral media representation must not be presented as exact-byte reconstruction. Every domain chapter therefore carries:

1. foundational/external math,
2. LeeWay state adapter,
3. Formula relationship,
4. actuator,
5. successes,
6. failures,
7. evidence paths,
8. next falsifiable gate.
