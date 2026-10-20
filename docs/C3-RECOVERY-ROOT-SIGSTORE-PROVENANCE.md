# LeeWay C3 — GitHub Actions / Sigstore public provenance

**Artifact:** `authority/c3-recovery-root-public-provenance.json`

**Workflow:** `.github/workflows/c3-recovery-root-sigstore.yml`

**Expected signer:** `4citeB4U/Leeway-formula-live/.github/workflows/c3-recovery-root-sigstore.yml`

The artifact contains a minimal public statement about the exact C3 Receipt Ledger R2 recovery scope and SHA-256 hashes. The Windows owner-local Ed25519 root and recovery issuer each signed the canonical JSON statement. It contains their *public* SPKI keys and public SHA-256 fingerprints; it contains no private key, bearer token, raw nonce, or plaintext grant.

The GitHub-hosted workflow validates both Ed25519 signatures and the scope pins, then attests the exact artifact with `actions/attest@v4`. GitHub Actions' short-lived OIDC certificate and Sigstore bind the resulting signed build-provenance statement to this public workflow identity and its source revision.

## Independent verification

Download the workflow's `c3-sigstore-public-root-provenance` artifact, or use the checked-out repository's public evidence artifact:

```sh
node scripts/c3-verify-public-root-provenance.mjs authority/c3-recovery-root-public-provenance.json
gh attestation verify authority/c3-recovery-root-public-provenance.json \
  --repo 4citeB4U/Leeway-formula-live \
  --signer-workflow 4citeB4U/Leeway-formula-live/.github/workflows/c3-recovery-root-sigstore.yml \
  --cert-oidc-issuer https://token.actions.githubusercontent.com \
  --deny-self-hosted-runners
```

For a specific run, also provide `--source-ref refs/heads/<verified-branch>` and `--source-digest <verified-commit-sha>` to lock source provenance. Verification must fail closed on any wrong signer, key, workflow, source commit, changed artifact, or original/R2 digest.

## Acceptance boundaries

**Proves:** possession of the local owner root and issuer keys when the public statement was signed, public key pin equality, the artifact's exact byte digest, and third-party Sigstore/GitHub Actions signing of the artifact by the expected public workflow identity.

**Does not prove:** that the Windows DPAPI keys are hardware-backed, a legally independent second party approved the key, that the issuer existed before the locally recorded bootstrap date, that Runtime Fabric's private production host is correctly bound, or that an independent Veritas judge approved B8.

A verifier must not turn `gh attestation verify` success into an automatic B8 migration grant. Formula decision, host grant/nonce replay admission, exclusive writer-control, health, durable append/restart, and independent Veritas remain separate gates.

The evidence is hosted in the already-public canonical LeeWay Formula repository because Runtime Fabric is private. Do not publish Windows-local authority files or DPAPI blobs in this repository.
