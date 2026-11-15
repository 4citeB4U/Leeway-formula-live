# G3 → G4 authority handoff checkpoint

- **Timestamp:** 2026-11-15 America/Chicago
- **Identity / project:** `feature/g3-g4-attestation-bridge-20261115` / LeeWay Formula Fabric
- **Commit:** `d7eba63b3a092379731dc8e3bd795698c68c8df1`
- **Current gate:** G3 evidence production is implemented and observed through Formula HTTP. G4 authority transition is implemented but not live-qualified.

## Accepted implementation

- `POST /runtime/formula/v1/g3-evidence-bundles` creates an unsigned `leeway.g3-evidence-bundle.v1` only when the caller's Formula execution hashes match the Formula service's last canonical result.
- `g3-g4-provider-handoff.mjs` requires explicit endpoint bindings for Veritas, Receipt Authority, and Learning Ledger; verifies an Ed25519 Veritas attestation before submitting Receipt and Ledger requests.
- Incomplete bindings return the exact `G4_NOT_TRANSITIONED` reason while preserving the G3 bundle. They do not manufacture an approval, receipt, or global shutdown.
- `runtime/kernel-integrity.json` pins the changed Formula service and both new G3/G4 modules.

## Evidence executed

- Focused G3 builder test: PASS.
- Focused G3→G4 provider handoff test: PASS. Its signer/authorities are test-only fixtures, not live authority evidence.
- Formula regression: 14 passed, 0 failed.
- Live local Formula HTTP round trip on port `4015`: evaluation returned result hash `5f1d72e38285d9f111f4454bfbea157f01ed3c10a4ec907a4e6bb71ba39af3aa`; G3 endpoint returned `G3_OBSERVED_LOCAL`, `PENDING_INDEPENDENT_VERITAS`, `NOT_CREATED`, `NOT_ADMITTED`; bundle SHA-256 `b61d9bb2d3ffb17ddd8740d70a0c459929ccba59251072cc9c6465a376b1dd99`.

## Provider truth at checkpoint

- Formula health: observed at `http://127.0.0.1:4001/runtime/formula/v1/health` as `LEEWAY_FORMULA_V1_PASS`.
- Veritas source exposes an authenticated review intake; its own source states that intake cannot issue an independent signed verdict. No signer endpoint was bound in this run.
- Receipt service health was observed at `http://127.0.0.1:4104/health`; its running source exposes health/summary, not an append-and-readback route matching the new contract.
- Learning Ledger source identifies itself as a non-production candidate vault, not a production admission writer. No Ledger endpoint was bound in this run.

## Next executable action

Bind the separately owned live endpoint URLs and Veritas public key through `ProviderBindings`, then run one same-request end-to-end submission and preserve the returned Veritas attestation, Receipt readback, and Ledger admission. Only that evidence may change the transition result to `G4_TRANSITIONED`.
