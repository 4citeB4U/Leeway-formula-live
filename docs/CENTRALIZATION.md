# Formula Centralization

## Required topology

```text
Consumer -> Formula Client -> LeeWay Formula Live -> Veritas -> Receipt
```

A consumer may contain transport code, schemas, retry/error handling, and an authorized adapter. It must not contain a private fork of the Formula engine.

## Consumers
Agent Lee, Agent Skills, Runtime Fabric, Harness, MCPs, Blender/Game Gateway, model workers, storage/compute fabrics, voice/vision, applications, and phone/device clients all use the same authority boundary.

## Offline behavior
A client that cannot reach an authorized evaluator reports UNEXPOSED/BLOCKED/FAILED as appropriate. It must not silently substitute a copied or reconstructed Formula.

## Engine promotion
Engine publication is intentionally gated. Recover the host authority, calculate SHA-256, compare it with the pinned engine identity, verify adapter and service identities, execute acceptance vectors, then promote. A mismatch is a blocker requiring reconciliation, not permission to overwrite the authority.
