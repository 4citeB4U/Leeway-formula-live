# Portable canonical Formula runtime

The September 28, 2026 recovery removes the destroyed D: drive from the Formula deployment. `runtime/canonical/` preserves the existing E-drive v1 kernel and specification byte for byte in the canonical authority repository. It is not a new formula or a consumer-side implementation. The original E: source remains untouched. Source lineage: `E:/Leeway-Ecosystem v2.1.4/Leeway Runtime Fabric/leeway-formula/v1`, with adjacent `standards/formulas`. The four historical S4R/X5 hashes match the LeeWay Skills recovery contract. `runtime/kernel-integrity.json` pins every imported module and both specifications; the host refuses startup after any mismatch.

## Windows deployment

Clone this repository into a stable local directory on any available drive. Docker must be running. From that checkout:

```powershell
./runtime/Start-Formula.ps1
```

This uses a pinned Node 22 image, a read-only source mount, a persistent Docker receipt volume and localhost port 4001. It creates `leeway_formula` and does not replace the old `leeway_runtime_fabric` container. It restarts with Docker; Docker itself must be available after host reboot. To restart an existing verified deployment, use `docker restart leeway_formula`. To relocate its checkout, inspect and recreate only this Formula container with the same receipt volume and new source path.

For another host, set `LEEWAY_FORMULA_SOURCE` to the absolute `runtime/canonical/leeway-formula/v1` path and run `node runtime/server.mjs`. Default listener is 127.0.0.1:4001. The canonical writer needs write access to `runtime/canonical/receipts`. Keep source read-only when mounting into a container. Never expose this unauthenticated service publicly; use an authenticated gateway with explicit consumer authorization for remote access. Browser-origin access is disabled.

## MCP and LLM consumers

```powershell
npm ci --ignore-scripts --prefix runtime
codex mcp add leeway_formula --env LEEWAY_FORMULA_BASE_URL=http://127.0.0.1:4001 -- node ABSOLUTE_CHECKOUT/runtime/mcp.mjs
```

Any compatible MCP host can register the same command and environment. It exposes `formula_health` and `formula_evaluate`. HTTP clients use the [portable consumer](PORTABLE-CONSUMERS.md). GitHub hosts source and discovery; it is not an always-running evaluator. Each LLM host must actually register and invoke the tool. Existing chats may need a reload to discover newly configured tools.

The evaluator accepts the raw-base64-v1 or runtime-state-v1 adapter. An LLM supplies an authorized, measured 16×6 input with source/mapping provenance. No verified natural-language-question-to-matrix mapping is supplied. A successful golden-vector evaluation verifies transport and canonical mathematics, not the quality of arbitrary conversational decisions.

## Scope and evidence

`GET /runtime/health` explicitly says `scope: formula-only`, and `otherRuntimeFabricServices: NOT_RESTORED`. All Formula v1 health/spec/adapters/evaluate/encode/last/receipts endpoints retain their canonical shapes. The host assigns a safe, unused receipt trace prefix and returns `hostTraceId` plus `requestedTraceId` for correlation. Actual kernel receipts contain the host trace. Invalid requests create no receipt.

The former all-purpose container remains stopped, preserving its mounts and secrets for separate recovery. Notebook extension binding, phone pairing, Gemini Live configuration and other Runtime Fabric services are not restored by this Formula deployment. No universal claim that all ecosystem clients are already connected follows from a healthy evaluator.

Validation: canonical golden-vector and reproducibility tests; canonical live endpoint proof; portable HTTP consumer tests; host rejection and receipt correlation tests; MCP evaluation and independent receipt comparison. Store host-specific receipts outside source control; publish only scoped, non-secret evidence.
