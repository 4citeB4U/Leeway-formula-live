# LEEWAY HEADER — DO NOT REMOVE
# REGION: LEEWAY.FORMULA.INDEPENDENT_VERIFY
# TAG: H08_H09_DOTNET_INDEPENDENT_HASH_VERIFIER
# WHAT: Independently validate producer SHA-256 records without using producer JS.
# WHY: Prevent self-certification of file integrity.
# WHO: LeeWay verification. WHERE: Agent-Lee audit checkout. WHEN: 2026-10-25.
# HOW: PowerShell native .NET SHA-256 and separate file readback.
# AUTHORITY: VERIFICATION_ONLY. LICENSE: Existing LeeWay terms.
$ErrorActionPreference='Stop'
$evidence='E:\LeeWay-Work\formula-storage-g42-verification-20261024\h08-h09-cryptographic-evidence-d0a20d570ae2a6f3.json'
$expected='d0a20d570ae2a6f38eabe2a5059d037a736d1adc31581a76db56bb91b0b849a2'
function Digest([string]$p) {
  $bytes=[System.IO.File]::ReadAllBytes($p)
  $sha=[System.Security.Cryptography.SHA256]::Create()
  try { $hash=$sha.ComputeHash($bytes) } finally { $sha.Dispose() }
  return ([System.BitConverter]::ToString($hash)).Replace('-','').ToLowerInvariant()
}
$actual=Digest $evidence
if($actual -ne $expected){throw "ROOT_EVIDENCE_HASH_MISMATCH $actual"}
$data=Get-Content -Raw -LiteralPath $evidence | ConvertFrom-Json
$verified=0
foreach($item in $data.pinnedArtifacts){
  if(-not [System.IO.File]::Exists($item.path)){throw "PINNED_FILE_MISSING $($item.path)"}
  $digest=Digest $item.path
  if($digest -ne $item.sha256){throw "PIN_HASH_MISMATCH $($item.path)"}
  $verified++
}
$browserPath='E:\LeeWay-Work\formula-storage-g42-verification-20261024\h08-h09-browser-acceptance\acceptance.json'
$browser=Get-Content -Raw -LiteralPath $browserPath | ConvertFrom-Json
if($browser.outcome -ne 'PASS_LOCAL_COMPONENT_TESTS' -or $browser.passCount -ne 47 -or $browser.testCount -ne 47){throw 'BROWSER_REPORT_INCONSISTENT'}
[pscustomobject]@{status='PASS_INDEPENDENT_DOTNET_INTEGRITY';rootHash=$actual;verifiedPins=$verified;browserPass=$browser.passCount;certificateStatus='NOT_CHECKED_BY_INTEGRITY_PROOF'} | ConvertTo-Json -Compress
