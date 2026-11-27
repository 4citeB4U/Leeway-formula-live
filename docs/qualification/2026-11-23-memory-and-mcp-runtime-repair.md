# Formula memory admission and MCP dependency repair

Timestamp: `2026-11-23T08:17:37-06:00`

## Scope

This source repair prepares the canonical Formula repository for governed local use without changing the LeeWay Formula mathematics.

- Added the byte-identical `LEEWAY.MEMORY.AUTHORITY` contract at SHA-256 `7840CAAFC60CE6185A241B56D48D800EFDF02DC33126826C6746DD0D3A3C6F11`.
- Marked `MEMORY.md` as byte-preserved in `.gitattributes`.
- Updated the direct MCP SDK from `1.28.0` to `1.32.2` and refreshed only compatible lockfile dependencies.
- Preserved the four historical Formula v1 byte identities:
  - engine `6502791BBA909D7481DB3A204F3CBF67B1DC06A4B76A73C797D709408341D63E`;
  - canonical input `4087FC14A9F1F44EB46D9D6417156176794E2ACC72EE9BF481F21A5D0ABE5236`;
  - raw adapter `2C8B477ABAD73A0B8519127B20E500BC857F6D26A2722634F23637D4EEAC6215`;
  - Formula service `59C74A850CFBACAB4408D73538C824D25687AE0FBD12F07AB5D3622661B7B1EC`.

## Evidence

- `npm ci --ignore-scripts --prefix runtime`: exit `0`.
- `npm audit --json --prefix runtime`: zero vulnerabilities, exit `0`.
- `node tests/run-live-tests.mjs`: 17 passed, 0 failed, exit `0`.
- Canonical diagnostic live-endpoint proof: PASS; golden decimal state `[4,50,63,59,48,69]`.

The golden-vector evaluation is diagnostic Formula evidence only. It is not a user-task Formula decision, Veritas acceptance, production receipt, or whole-ecosystem deployment proof.

## Boundaries

- No canonical mathematics or Formula v1 byte was changed.
- No production service was deployed.
- No independent Veritas decision was issued.
- No Receipt Authority or Learning Ledger record was created by this repair.
- The local Formula-only service may be started from this reviewed source for loopback integration qualification; that does not authorize Device Bridge execution.

## Rollback

Revert source commit `b837853eee83068e08099cdf38da2ae01417830e`. The former checkout remains preserved and was not overwritten.
