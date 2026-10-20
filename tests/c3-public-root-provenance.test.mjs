import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {verifyC3PublicRootEvidence} from '../scripts/c3-verify-public-root-provenance.mjs';
const file=path.resolve('authority/c3-recovery-root-public-provenance.json');
const raw=fs.readFileSync(file,'utf8');
test('public root and issuer Ed25519 signatures and exact R2 scope verify',()=>{
 const got=verifyC3PublicRootEvidence(raw);
 assert.equal(got.verified,true);
 assert.equal(got.sha256,createHash('sha256').update(raw).digest('hex'));
 assert.equal(got.productionB8Authorization,false);
 assert.equal(got.independentVeritas,false);
});
test('tampering root key, issuer, digest, workflow or signature fails closed',()=>{
 const original=JSON.parse(raw);
 for(const part of [
  {field:'originalLedgerSha256',value:'f'.repeat(64)},
  {field:'candidateR2Sha256',value:'e'.repeat(64)},
  {field:'signerWorkflow',value:'attacker/other/.github/workflows/forge.yml'},
  {field:'rootPublicKeySpkiSha256',value:'0'.repeat(64)},
  {field:'ownerGithubAccountId',value:1},
  {field:'recoveryScope',value:'ANY'}
 ]){
  const bad=JSON.parse(JSON.stringify(original));
  const body=JSON.parse(bad.signedPayloadUtf8);body[part.field]=part.value;
  bad.signedPayloadUtf8=JSON.stringify(body);
  assert.throws(()=>verifyC3PublicRootEvidence(JSON.stringify(bad)),/C3_PROVENANCE_/,
   'changed '+part.field+' must not be accepted');
 }
 const bad=JSON.parse(JSON.stringify(original));
 bad.issuerEd25519SignatureBase64='A'+bad.issuerEd25519SignatureBase64.slice(1);
 assert.throws(()=>verifyC3PublicRootEvidence(JSON.stringify(bad)),/C3_PROVENANCE_/);
});
test('unexpected fields or secret-like material are not accepted as provenance',()=>{
 const bad=JSON.parse(raw);
 bad.privateKeyPem='SECRET';
 assert.throws(()=>verifyC3PublicRootEvidence(JSON.stringify(bad)),/UNEXPECTED_ENVELOPE_FIELDS/);
});
