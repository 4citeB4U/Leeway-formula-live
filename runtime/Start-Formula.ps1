param(
  [string]$Name = 'leeway_formula',
  [string]$ReceiptVolume = 'leeway-formula-receipts',
  [int]$Port = 4001
)
$ErrorActionPreference = 'Stop'
$repository = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$image = 'node@sha256:d649c27dae7ba0137b3cef5dd75baa422c08dc3d9e3fc0c23dfb172dc3cc6436'
if ($Name -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]+$' -or $ReceiptVolume -notmatch '^[a-zA-Z0-9][a-zA-Z0-9_.-]+$') { throw 'Invalid Docker name' }
if ($Port -lt 1024 -or $Port -gt 65535) { throw 'Invalid port' }
$existing = docker ps -aq --filter "name=^/$Name`$"
if ($LASTEXITCODE -ne 0) { throw 'Docker unavailable' }
if ($existing) { throw "Container $Name already exists. Inspect its mounts and restart it explicitly; this script does not replace existing services." }
docker run -d --name $Name --restart unless-stopped --read-only --cap-drop ALL --security-opt no-new-privileges --memory 256m --cpus 1 --pids-limit 64 --mount "type=bind,source=$repository,target=/transport,readonly" --mount "type=volume,source=$ReceiptVolume,target=/transport/runtime/canonical/receipts" -e LEEWAY_FORMULA_SOURCE=/transport/runtime/canonical/leeway-formula/v1 -e HOST=0.0.0.0 -p "127.0.0.1:${Port}:4001" $image node /transport/runtime/server.mjs
if ($LASTEXITCODE -ne 0) { throw 'Formula container start failed' }
Write-Output "Formula-only listener requested at http://127.0.0.1:$Port; verify health and an evaluation before claiming readiness."
