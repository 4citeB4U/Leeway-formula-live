/* LEEWAY public root evidence verifier — does not authorize B8 or issue keys. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash,createPublicKey,verify} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const REPO='4citeB4U/Leeway-formula-live';
const WORKFLOW=REPO+'/.github/workflows/c3-recovery-root-sigstore.yml';
const ORIGINAL='d03d0f1c7252f0046ef0fea3bf6aad74be5cd362bf934d428469021d0701456c';
const CANDIDATE='b1973893592c8f5740df07da6f6b29c47a87dd25a6cf6d2f8f78ada9ff5544bd';
const ROOT='1842abc132174be8bf2a4a50e0a98e92a7b9e0d03fd4d76258729d24f01c61d9';
const ISSUER='1d18c8d4ec98716fbaf7ad23e33fa4f9dcc77f9a102859ea3c71d797142e0fc6';
const SHA=x=>createHash('sha256').update(x).digest('hex');
const HEX=/^[a-f0-9]{64}$/;
function requireExact(condition,reason){if(!condition)throw Error('C3_PROVENANCE_'+reason)}
export function verifyC3PublicRootEvidence(raw){
 const envelope=JSON.parse(raw);
 const keys=Object.keys(envelope).sort();
 requireExact(JSON.stringify(keys)===JSON.stringify([
  'issuerEd25519SignatureBase64','rootEd25519SignatureBase64','signedPayloadUtf8'
 ].sort()),'UNEXPECTED_ENVELOPE_FIELDS');
 const serialized=envelope.signedPayloadUtf8;
 requireExact(typeof serialized==='string'&&Buffer.byteLength(serialized)<8192,'INVALID_SIGNED_PAYLOAD');
 const body=JSON.parse(serialized);
 requireExact(JSON.stringify(body)===serialized,'PAYLOAD_NOT_CANONICAL_JSON');
 requireExact(body.schema==='leeway.c3.public-recovery-root-provenance.v1'&&
  body.statementPurpose==='SIGSTORE_PUBLIC_WORKFLOW_ATTESTATION_SUBJECT'&&
  body.ownerGithubLogin==='4citeB4U'&&body.ownerGithubAccountId===153477522 &&
  body.signerWorkflow===WORKFLOW&&
  body.sourceRecoveryRepository==='4citeB4U/Leeway-Runtime-Fabric'&&
  body.ledgerId==='LEEWAY_RECEIPT_LEDGER_LIVE'&&
  body.recoveryScope==='LEDGER_RECOVERY_23_RECORDS'&&
  body.originalLedgerSha256===ORIGINAL&&body.candidateR2Sha256===CANDIDATE &&
  body.rootId==='LEEWAY_RECOVERY_CREATOR_ROOT_WIN_V1'&&
  body.recoveryIssuerId==='LEEWAY_RECEIPT_R2_ISSUER_WIN_V1'&&
  body.rootPublicKeySpkiSha256===ROOT&&
  body.recoveryIssuerPublicKeySpkiSha256===ISSUER,'SIGNED_SCOPE_MISMATCH');
 for(const key of ['localOwnerGrantSha256','localOwnerEnrollmentSha256'])
  requireExact(HEX.test(body[key]||''),'PROVENANCE_DIGEST_INVALID');
 requireExact(body.signingKeyStorageClass==='WINDOWS_CURRENT_USER_DPAPI'&&
  body.securityBoundary?.establishes==='OWNER_SIGNED_PUBLIC_KEY_CUSTODY_CLAIM_AND_GITHUB_WORKFLOW_PROVENANCE'&&
  Array.isArray(body.securityBoundary?.doesNotEstablish)&&
  body.securityBoundary.doesNotEstablish.includes('INDEPENDENT_VERITAS_PRODUCTION_APPROVAL')&&
  body.securityBoundary.doesNotEstablish.includes('HARDWARE_BACKED_PRIVATE_KEY')&&
  body.securityBoundary.doesNotEstablish.includes('B8_EXECUTION_AUTHORIZATION'),
  'PRODUCTION_TRUST_DISCLAIMER_MISSING');
 requireExact(!/PRIVATE KEY|\\\\n.*nonce|credential|access.token/i.test(serialized),'UNSAFE_PUBLIC_CONTENT');
 const rootPublic=createPublicKey(body.rootPublicKeyPem);
 const issuerPublic=createPublicKey(body.recoveryIssuerPublicKeyPem);
 requireExact(rootPublic.asymmetricKeyType==='ed25519'&&issuerPublic.asymmetricKeyType==='ed25519',
  'PUBLIC_ALGORITHM_NOT_ED25519');
 requireExact(SHA(rootPublic.export({format:'der',type:'spki'}))===ROOT&&
  SHA(issuerPublic.export({format:'der',type:'spki'}))===ISSUER,'SPKI_PIN_MISMATCH');
 const parseSig=val=>{
  requireExact(typeof val==='string'&&/^[A-Za-z0-9+/]{86}==$/.test(val),'INVALID_SIGNATURE_ENCODING');
  return Buffer.from(val,'base64');
 };
 const message=Buffer.from(serialized,'utf8');
 requireExact(verify(null,message,rootPublic,parseSig(envelope.rootEd25519SignatureBase64)),
  'ROOT_SIGNATURE_INVALID');
 requireExact(verify(null,message,issuerPublic,parseSig(envelope.issuerEd25519SignatureBase64)),
  'ISSUER_SIGNATURE_INVALID');
 return {verified:true,sha256:SHA(Buffer.from(raw)),rootSpkiSha256:ROOT,
  issuerSpkiSha256:ISSUER,subject:'PUBLIC_PROVENANCE_ONLY',
  productionB8Authorization:false,independentVeritas:false};
}
const self=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(self){
 const input=path.resolve(process.argv[2]||'authority/c3-recovery-root-public-provenance.json');
 const raw=fs.readFileSync(input,'utf8');
 const result=verifyC3PublicRootEvidence(raw);
 const output=process.argv[3];
 if(output){
  const dest=path.resolve(output);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,raw,{flag:'wx'});
 }
 console.log(JSON.stringify(result));
}
