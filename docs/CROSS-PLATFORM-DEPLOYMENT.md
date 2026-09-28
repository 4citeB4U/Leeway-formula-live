# Cross-platform Formula deployment

The service imports the byte-preserved canonical kernel shipped in this repository. No C, D or E drive is required. Source integrity is checked before loading. Historical E-drive recovery records describe provenance, not a deployment dependency.

## Native Node host

On Windows, macOS or Linux with Node 22 or newer, clone the authority repository and run from its root:

```text
node runtime/server.mjs
```

The source defaults to `runtime/canonical/leeway-formula/v1`, resolved relative to the server module even when the current working directory is elsewhere. `LEEWAY_FORMULA_SOURCE` may override this with an approved directory; relative overrides resolve against the process working directory. All pinned hashes still must match. `HOST` defaults to `127.0.0.1` and `PORT` to `4001`. The native service needs write access to the canonical tree's `receipts` directory; the mathematics and source modules remain unchanged.

The HTTP host uses Node built-ins and needs no npm install. Stop with Control+C. Process supervision belongs to the host OS or deployment supervisor. This command alone does not install a startup service.

## Container host

From the repository root on any host with a compatible Docker engine and Compose:

```text
docker compose -f runtime/compose.yaml config
docker compose -f runtime/compose.yaml up -d
docker compose -f runtime/compose.yaml ps
```

The Compose file uses a digest-pinned Node image, a relative read-only repository mount, a managed receipt volume, resource limits and a loopback-only published port. Set `LEEWAY_FORMULA_PORT` before running Compose to select an unused host port. The container source remains repository-relative. Keep the named volume when updating; `down --volumes` destroys its receipts and is not a routine update command. Image architecture compatibility and Docker availability must be verified on each target; Windows-host validation does not certify macOS, Linux or every CPU architecture.

`runtime/Start-Formula.ps1` remains a Windows/PowerShell helper. The Compose path and native Node path do not require it. Do not launch both against the same port or assume their receipt volumes are shared.

## MCP on Windows, macOS and Linux

Install the locked MCP transport dependency once:

```text
npm ci --prefix runtime
```

Configure the MCP host to launch `node` with the absolute path to `runtime/mcp.mjs`, and set `LEEWAY_FORMULA_BASE_URL` to the authorized HTTP authority. For hosts accepting JSON server configuration, adapt this template to their actual schema:

```json
{
  "command": "node",
  "args": ["/absolute/checkout/runtime/mcp.mjs"],
  "env": {"LEEWAY_FORMULA_BASE_URL": "http://127.0.0.1:4001"}
}
```

On Windows an argument such as `C:/chosen/checkout/runtime/mcp.mjs` is valid; the drive and directory are chosen at installation, not required by LeeWay. On macOS/Linux use the actual POSIX path. This is a stdio MCP adapter, not a public MCP HTTP server. Restart/reload the MCP host as required, list the two tools, and call `formula_health` before a real authorized evaluation. A config entry is not proof that the host has loaded the tools.

## Remote, mobile and model consumers

Phones, tablets, browsers and LLM providers can consume a governed remote endpoint through an appropriate authorized client or backend adapter; they are not assumed to run Docker or Node locally. The HTTP client is model-independent and accepts measured canonical inputs, not model-specific conversation scores. Browser-origin calls to this service are deliberately rejected. A browser UI needs its own authenticated backend/bridge and explicit user authorization.

The bundled HTTP server has no remote-user authentication or TLS termination. Keep it on loopback, or behind an authenticated TLS gateway/private tunnel that enforces caller access and prevents direct bypass. The bundled generic client does not attach gateway-specific credentials; use a credential-aware `fetchImpl` when integrating with such a gateway, or a locally authenticated tunnel endpoint. Never put secrets in a URL. Setting a public `HOST` value by itself is not a secure remote deployment.

Read [portable consumer contracts](PORTABLE-CONSUMERS.md) for input mapping and verification boundaries. Every actual OS/device/model integration needs its own connection test, task execution evidence and receipt before it is called verified.
