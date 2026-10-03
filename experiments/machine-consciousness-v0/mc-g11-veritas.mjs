#!/usr/bin/env node
/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G11_VERITAS
WHAT = Independently verify one MC-G11 raw execution trace and emit the final evidence packet
WHY = Separate provider execution from acceptance and prevent self-authored PASS
WHO = Leeway Industries / Creator-authorized Veritas lane
WHERE = experiments/machine-consciousness-v0/mc-g11-veritas.mjs
WHEN = 2026-10-02 onward
HOW = Recompute Device Bridge receipt hashes, chain, roundtrip observation and route evidence invariants
AGENTS: VERIFY
LICENSE: MIT
*/

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const file=process.argv[2];
if(!file){console.error('Usage: node mc-g11-veritas.mjs <execution-trace.json>');process.exit(2)}
const t=JSON.parse(await fs.readFile(file,'utf8'));
const canonical=v=>{
  if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';
  if(v!==null&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
  return JSON.stringify(v);
};
const digest=v=>crypto.createHash('sha256').update(canonical(v)).digest('hex');
const hashText=v=>crypto.createHash('sha256').update(String(v)).digest('hex');
const failures=[];
function verifyReceipt(label,r){
  if(!r||typeof r!=='object'){failures.push(label+'_RECEIPT_MISSING');return}
  const {sha256,...body}=r;
  if(!/^[a-f0-9]{64}$/i.test(sha256||''))failures.push(label+'_RECEIPT_HASH_MISSING');
  else if(digest(body)!==sha256)failures.push(label+'_RECEIPT_HASH_MISMATCH');
  if(r.outcome!=='PASS')failures.push(label+'_OUTCOME_NOT_PASS');
}
const write=t?.execution?.write_response;
const read=t?.execution?.read_response;
if(write?.ok!==true)failures.push('WRITE_NOT_OK');
if(read?.ok!==true)failures.push('READ_NOT_OK');
verifyReceipt('WRITE',write?.receipt);
verifyReceipt('READ',read?.receipt);
if(write?.receipt?.previousHash===null||!write?.receipt?.previousHash)failures.push('WRITE_PREEXEC_CHAIN_MISSING');
if(read?.receipt?.previousHash===null||!read?.receipt?.previousHash)failures.push('READ_PREEXEC_CHAIN_MISSING');
if(t?.observation?.matches_expected!==true)failures.push('ROUNDTRIP_RESULT_MISMATCH');
if(hashText(read?.result?.text??'')!==t?.observation?.observed_sha256)failures.push('OBSERVED_HASH_MISMATCH');
if(t?.observation?.observed_sha256!==t?.observation?.expected_sha256)failures.push('EXPECTED_HASH_MISMATCH');
if(t?.capability?.manifold_routed!==true)failures.push('MANIFOLD_ROUTE_NOT_PROVEN');
if(t?.capability?.orchestrator_routed!==true)failures.push('ORCHESTRATOR_ROUTE_NOT_PROVEN');
if(t?.capability?.tool_gateway_routed!==true)failures.push('TOOL_GATEWAY_ROUTE_NOT_PROVEN');
if(!Array.isArray(t?.capability?.skill_authority_calls)||t.capability.skill_authority_calls.length<4)failures.push('SKILL_AUTHORITY_EVIDENCE_INCOMPLETE');
for(const [k,v] of Object.entries(t?.llm_boundary||{}))if(v!==false)failures.push('LLM_BOUNDARY_'+k.toUpperCase());
if(t?.production_efficiency?.duplicated_components_created!==0)failures.push('DUPLICATE_COMPONENT_CREATED');
if(t?.classification!=='EXECUTED_UNVERIFIED')failures.push('INPUT_CLASSIFICATION_INVALID');

const pass=failures.length===0;
const packet={
  proof_id:t.proof_id,
  timestamp:new Date().toISOString(),
  source_class:t.source_class,
  cognition:t.cognition,
  policy:t.policy,
  capability:{
    manifold_ref:t.capability.manifold_ref,
    orchestrator_ref:t.capability.orchestrator_ref,
    focal_execution_set:t.capability.focal_execution_set,
    tool_gateway_ref:t.capability.tool_gateway_ref,
    canonical_owner:t.capability.canonical_owner,
    manifold_routed:t.capability.manifold_routed,
    orchestrator_routed:t.capability.orchestrator_routed,
    tool_gateway_routed:t.capability.tool_gateway_routed,
    route_evidence_refs:t.capability.route_evidence_refs
  },
  execution:{
    provider:t.execution.provider,
    provider_version:null,
    provider_hash:null,
    request_hash:t.execution.request_hash,
    executed:t.execution.executed===true,
    result:{
      write_ok:write?.ok===true,
      read_ok:read?.ok===true,
      write_receipt_sha256:write?.receipt?.sha256??null,
      read_receipt_sha256:read?.receipt?.sha256??null
    }
  },
  observation:t.observation,
  veritas:{
    status:pass?'PASS':'FAIL',
    evidence_ref:file,
    failure_boundary:pass?null:failures[0]
  },
  receipts:[write?.receipt?.sha256,read?.receipt?.sha256].filter(Boolean),
  llm_boundary:t.llm_boundary,
  production_efficiency:t.production_efficiency,
  classification:pass?'VERIFIED':'FAILED',
  veritas_failures:failures,
  claim_boundary:'MC-G11 PASS, if present, proves one governed non-LLM phone-local file capability roundtrip through existing LeeWay skill authorities and Device Bridge MCP. It does not yet prove Android UI/Calculator control through the same path or general natural-language capability.'
};
const out=path.join(path.dirname(file),'verified-'+t.proof_id+'.json');
await fs.writeFile(out,JSON.stringify(packet,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({gate:'MC-G11',status:packet.veritas.status,classification:packet.classification,failures,out},null,2));
process.exit(pass?0:1);
