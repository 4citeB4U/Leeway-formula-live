param(
  [string]$BaseUrl = $(if ($env:LEEWAY_FORMULA_BASE_URL) { $env:LEEWAY_FORMULA_BASE_URL } else { 'http://127.0.0.1:4001' }),
  [ValidateSet('health','evaluate')][string]$Action = 'health',
  [string]$InputJson
)
$ErrorActionPreference = 'Stop'
if ($Action -eq 'health') {
  Invoke-RestMethod "$BaseUrl/runtime/formula/v1/health" -Method Get | ConvertTo-Json -Depth 20
  exit
}
if (-not $InputJson) { throw 'evaluate requires -InputJson containing the authorized evaluator request body.' }
Invoke-RestMethod "$BaseUrl/runtime/formula/v1/evaluate" -Method Post -ContentType 'application/json' -Body $InputJson | ConvertTo-Json -Depth 20
