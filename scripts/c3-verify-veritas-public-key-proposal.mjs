/*
LEEWAY C3 — validate public proposal for separately keyed Veritas signer.
No private-key or B8 authority touched. GitHub Actions Sigstore provides
public artifact provenance, NOT independent key custody or B8 authorization.
*/
import fs from 'node:fs';
import {createHash,createPublicKey} from 'node:crypto';
const file=process.argv[2]||'authority/c3-veritas-root-public-proposal.json';
const data=fs.readFileSync(file);
const x=JSON.parse(data.toString('utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const digest=k=>sha(createPublicKey(k).export({type:'spki',format:'der'}));
const owner='1842abc132174be8bf2a4a50e0a98e92a7b9e0d03fd4d76258729d24f01c61d9';
const issuer='1d18c8d4ec98716fbaf7ad23e33fa4f9dcc77f9a102859ea3c71d797142e0fc6';
const root='98260467ad8bce597bb6dd154d221ae815003992b3e1a8125276ca7f58cfbe76';
const signer='dfffe5a7aa915341fa24737fb35c3a9fde9d04268555f81ff22ed3be312c1aac';
function require(x,reason){if(!x)throw Error('LEEWAY_C3_B8_'+reason)}
require(x.schema==='leeway.c3.b8.independent-veritas-root-public-proposal.v1','WRONG_SCHEMA');
require(x.ledgerId==='LEEWAY_RECEIPT_LEDGER_LIVE'&&
 x.scope==='LEDGER_RECOVERY_23_RECORDS'&&
 x.capability==='INDEPENDENT_VERITAS_SIGNED_B8_DECISION',
 'WRONG_SCOPE');
require(x.ownerRootSpkiSha256===owner&&
 x.independentRootSpkiSha256===root&&
 x.independentVerifierSpkiSha256===signer&&
 new Set([owner,issuer,root,signer]).size===4,
 'PUBLIC_ROOT_NOT_SEPARATED');
require(digest(x.independentRootPublicKeyPem)===root&&
 digest(x.independentVerifierPublicKeyPem)===signer,
 'PUBLIC_KEY_SPKI_MISMATCH');
require(x.externalCustodyVerified===false &&
 x.externalEnrollmentReceiptId===null &&
 x.productionRecoveryB8Authorized===false,
 'FORGED_INDEPENDENT_AUTHORITY');
console.log(JSON.stringify({
 status:'PUBLIC_VERITAS_PROPOSAL_VALID_NOT_ENROLLED',
 sha256:sha(data),rootSpkiSha256:root,verifierSpkiSha256:signer,
 signedB8DecisionIssued:false,externalCustodyVerified:false,
 productionRecoveryB8Authorized:false
}));
