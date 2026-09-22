# LeeWay Formula Live

Canonical publication and service boundary for the LeeWay Formula.

## Authority law
There is one Formula authority. LeeWay applications, skills, MCPs, runtimes, model workers, storage systems, device clients, and future consumers MUST call this authority through a versioned client/service contract. They MUST NOT carry divergent Formula implementations.

## Current promotion state
The repository is being established from the recovered LeeWay Agent Skills Formula governance contract. The canonical engine bytes are not yet published here because the pinned host engine must first be re-verified against its SHA-256 identity.

Formula ID: `LEEWAY-FORMULA-v1.0`

Local compatibility base: `http://127.0.0.1:4001`

Endpoints:
- `GET /runtime/formula/v1/health`
- `POST /runtime/formula/v1/evaluate`

## Permanent evidence law
Mounted != executed. Running != healthy. Configured != proven. Generated != executed. Executed != verified. No Formula output, Q69 value, C64 value, score, ranking, decision hash, runtime result, receipt, or authority hash may be invented.

## Promotion gate
The canonical engine, adapter, canonical input, and service must match the pinned identities in `authority/formula-authority.json` before engine publication or VERIFIED status.

Consumers should depend on the service/client contract, not copy Formula source into their own repositories.
