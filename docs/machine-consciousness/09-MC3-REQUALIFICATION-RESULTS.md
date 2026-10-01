# MC-G3 Contract-Aligned Requalification Results

Status: PASS_AFTER_REOPEN_AND_REPAIR

## Why the gate was reopened

The first MC-G3 implementation passed its own tests but disagreed with the MC-3 contract:
- 7 modules in code vs 8 in contract;
- derived workspace hash used as state identity instead of cycleStateHash.

The earlier receipt remains historical evidence but is superseded for gate authority.

## Final repaired acceptance

Required modules:
perception, belief, prediction, valuation, policy, memory, self-model, veritas.

Identity:
cycleStateHash.

Envelope integrity:
workspaceHash.

Tests:
7/7 MC-G1;
8/8 MC-G2;
12/12 repaired MC-G3.

Campaign:
640 worlds;
40,960 cycles;
40,960 workspace PASS;
40,960 self-model PASS;
40,960 self-model accuracy = 1.0;
2,176 intentional dropout cycles;
operational B range 0.75 to 1.0;
source mutation failures 0.

Campaign digest:
172c409e061b4442fc0cdb5e25a2e3d1b872b6a749a45c69bbc79cd66550ba02

Formula:
NOT_EXECUTED.

## Claim boundary

This proves operational global access and factual self-model consistency in the deterministic simulator.

It does not prove phenomenal consciousness or sentience.
