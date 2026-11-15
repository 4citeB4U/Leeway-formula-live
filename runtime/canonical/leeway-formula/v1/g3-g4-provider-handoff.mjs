/*
LEEWAY HEADER — DO NOT REMOVE
WHO: Formula consumers and independently configured authority services.
WHAT: Signature-checked G3 handoff with explicit Receipt and Ledger GET readbacks.
WHEN: 2026-11-15.
WHERE: runtime/canonical/leeway-formula/v1/g3-g4-provider-handoff.mjs.
HOW: Pin all three keys, correlate every request, verify hashes and preserve partial progress.
WHY: Replace the prior POST-only handoff that overstated readback verification.
*/
import {createHash,createPublicKey,verify} from 'node:crypto';
import {canonicalJson} from './g3-evidence-bundle.mjs';
const hash=x=>createHash('sha256').update(canonicalJson(x)).digest('hex');
const hex=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
function signed(record,key){
  if(!record||typeof record.signature!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(record.signature))throw Error('SIGNATURE_REQUIRED');
  const {signature,...body}=record,k=createPublicKey(key);
  if(k.asymmetricKeyType!=='ed25519'||!verify(null,Buffer.from(canonicalJson(body)),k,Buffer.from(signature,'base64')))throw Error('SIGNATURE_INVALID');
}
function binding(x){
  if(!x?.endpoint||!x.publicKeySpki)throw Error('G4_PROVIDER_BINDING_INCOMPLETE');
  const url=new URL(x.endpoint);
  if(url.username||url.password||url.search||url.hash||!(url.protocol==='https:'||(url.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(url.hostname))))throw Error('G4_PROVIDER_URL_INVALID');
  if(createPublicKey(x.publicKeySpki).asymmetricKeyType!=='ed25519')throw Error('G4_PROVIDER_KEY_INVALID');
  return x;
}
export async function transitionG3ToG4({bundle,bindings,fetchImpl=fetch}={}){
  const state={schema:'leeway.g4-transition-result.v1',status:'G4_NOT_TRANSITIONED',grade:'G3_OBSERVED_LOCAL',requestId:bundle?.requestId,bundleSha256:bundle?.bundleSha256,attestationState:'PENDING_INDEPENDENT_VERITAS',receiptState:'NOT_CREATED',learningLedgerState:'NOT_ADMITTED'};
  let stage='BINDING';
  try{
    const {bundleSha256,...unsigned}=bundle||{};
    if(bundle?.schema!=='leeway.g3-evidence-bundle.v1'||bundle.grade!=='G3_OBSERVED_LOCAL'||!hex(bundleSha256)||hash(unsigned)!==bundleSha256)throw Error('G3_BUNDLE_INVALID');
    const v=binding(bindings?.veritas),r=binding(bindings?.receipt),l=binding(bindings?.learningLedger);
    const request=async(endpoint,body)=>{
      const res=await fetchImpl(endpoint,{method:body?'POST':'GET',headers:{accept:'application/json',...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'error',signal:AbortSignal.timeout(10000)});
      if(!res.ok)throw Error(`HTTP_${res.status}`);
      const raw=await res.text();if(Buffer.byteLength(raw)>524288)throw Error('RESPONSE_TOO_LARGE');return JSON.parse(raw);
    };
    const correlate=x=>{if(x.requestId!==bundle.requestId||x.bundleSha256!==bundle.bundleSha256)throw Error('REQUEST_BINDING_MISMATCH');};
    stage='VERITAS';
    const attestation=await request(v.endpoint,{evidenceBundle:bundle});signed(attestation,v.publicKeySpki);correlate(attestation);
    if(attestation.schema!=='leeway.veritas.attestation.v1'||attestation.verdict!=='PASS')throw Error('ATTESTATION_REJECTED');
    state.attestation=attestation;state.attestationState='INDEPENDENT_VERITAS_PASS';
    stage='RECEIPT';
    const receipt=await request(r.endpoint,{schema:'leeway.receipt-authority.append-request.v1',evidenceBundle:bundle,veritasAttestation:attestation});
    state.receipt=receipt;state.receiptState='APPENDED_READBACK_PENDING';
    if(!/^ra-[a-f0-9-]{36}$/i.test(receipt.receiptId))throw Error('RECEIPT_ID_INVALID');
    const rb=await request(new URL(`/v1/receipts/${receipt.receiptId}`,r.endpoint).href);
    signed(rb,r.publicKeySpki);correlate(rb);
    const {signature,receiptHash,...receiptBody}=rb;
    if(rb.schema!=='leeway.receipt-authority.receipt.v1'||!hex(receiptHash)||hash(receiptBody)!==receiptHash||rb.veritasAttestationSha256!==hash(attestation)||canonicalJson(rb.veritasAttestation)!==canonicalJson(attestation)||canonicalJson(rb)!==canonicalJson(receipt))throw Error('RECEIPT_READBACK_REJECTED');
    state.receipt=rb;state.receiptState='READBACK_CONFIRMED';
    stage='LEDGER';
    const admission=await request(l.endpoint,{evidenceBundle:bundle,receipt:rb});
    state.admission=admission;state.learningLedgerState='ADMITTED_READBACK_PENDING';
    if(!/^ll-[a-f0-9-]{36}$/i.test(admission.admissionId))throw Error('ADMISSION_ID_INVALID');
    const lb=await request(new URL(`/v1/ledger/${admission.admissionId}`,l.endpoint).href);signed(lb,l.publicKeySpki);correlate(lb);
    if(lb.schema!=='leeway.learning-ledger.admission.v1'||lb.state!=='ADMITTED'||lb.receiptId!==rb.receiptId||lb.receiptHash!==rb.receiptHash||canonicalJson(lb)!==canonicalJson(admission))throw Error('LEDGER_READBACK_REJECTED');
    state.admission=lb;state.learningLedgerState='ADMITTED';state.status='G4_TRANSITIONED';state.grade='G4_INDEPENDENTLY_ATTESTED';
  }catch(e){state.reason=`G4_${stage}_${/^[A-Z0-9_]+$/.test(e.message)?e.message:'PROVIDER_RESPONSE_REJECTED'}`;}
  return Object.freeze(state);
}
