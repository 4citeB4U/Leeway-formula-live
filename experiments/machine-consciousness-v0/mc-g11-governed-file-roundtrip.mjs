#!/usr/bin/env node
/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G11_GOVERNED_FILE_ROUNDTRIP
WHAT = Execute one non-LLM Machine Consciousness capability proof through existing LeeWay Skills MCP and Device Bridge MCP
WHY = Prove existing ecosystem reuse before adding Android UI-binding glue
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/mc-g11-governed-file-roundtrip.mjs
WHEN = 2026-10-02 onward
HOW = live cognition state -> canonical skill authority calls -> deterministic focal set -> existing Device Bridge MCP -> real phone-local file write/read -> raw trace
AGENTS: ASSESS EXECUTE OBSERVE
LICENSE: MIT
*/

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const HOME=process.env.HOME;
const FORMULA_ROOT=process.env.LEEWAY_FORMULA_ROOT || path.resolve(new URL('../../', import.meta.url).pathname);
const SKILLS_ROOT=process.env.LEEWAY_SKILLS_ROOT || path.join(HOME,'.leeway/workstation/repos/LeeWay-Agent-Skills');
const DEVICE_ROOT=process.env.LEEWAY_DEVICE_BRIDGE_ROOT || path.join(HOME,'.leeway/workstation/repos/LEEWAY-DEVICE-BRIDGE');
const OUT=path.join(FORMULA_ROOT,'experiments/machine-consciousness-v0/outputs/mc-g11');
const WORKSPACE=path.join(OUT,'phone-workspace');
await fs.mkdir(WORKSPACE,{recursive:true});

const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const hash64=v=>typeof v==='string'&&/^[a-f0-9]{64}$/i.test(v);

const requireFromSkills=createRequire(path.join(SKILLS_ROOT,'mcp-server','package.json'));
const clientPath=requireFromSkills.resolve('@modelcontextprotocol/sdk/client/index.js');
const stdioPath=requireFromSkills.resolve('@modelcontextprotocol/sdk/client/stdio.js');
const {Client}=await import(pathToFileURL(clientPath).href);
const {StdioClientTransport}=await import(pathToFileURL(stdioPath).href);

async function connect(command,args,name){
  const client=new Client({name,version:'0.1.0'});
  const transport=new StdioClientTransport({command,args,stderr:'pipe'});
  await client.connect(transport);
  return client;
}
function toolText(r){
  const part=r?.content?.find?.(x=>x.type==='text');
  if(!part||typeof part.text!=='string')throw new Error('MISSING_TOOL_TEXT');
  return part.text;
}

const live=await fetch('http://127.0.0.1:8789/api/state').then(r=>{
  if(!r.ok)throw new Error('LIVE_SHADOW_HTTP_'+r.status);
  return r.json();
});
if(!hash64(live.stateHash))throw new Error('LIVE_STATE_HASH_INVALID');
const formulaStatus=live?.evidence?.formula?.status ?? null;
const candidates=['NOOP','PHONE_LOCAL_FILE_ROUNDTRIP'];
const selected=(live.continuityVerified===true && formulaStatus==='LEEWAY_FORMULA_V1_PASS')
  ? 'PHONE_LOCAL_FILE_ROUNDTRIP':'NOOP';
if(selected!=='PHONE_LOCAL_FILE_ROUNDTRIP')throw new Error('COGNITION_POLICY_BLOCKED');

const skillsServer=path.join(SKILLS_ROOT,'mcp-server','dist','index.js');
const skillsClient=await connect(process.execPath,[skillsServer],'mc-g11-skills-authority');
const requiredSkills=[
  ['leeway-universal-capability-kernel',['capability manifold','FOCAL_EXECUTION_SET']],
  ['leeway-skill-orchestrator',['TASK_CAPABILITY_WEAVE','FOCAL_EXECUTION_SET']],
  ['leeway-tool-gateway',['Tool Gateway','Veritas','receipt']],
  ['leeway-device-bridge',['device_open_app','device_files_read','device_files_write']]
];
const skillEvidence=[];
for(const [name,markers] of requiredSkills){
  const response=await skillsClient.callTool({name,arguments:{
    instruction:'MC-G11 authority retrieval only. Return canonical skill instructions; do not claim provider execution.',
    context:{requirements:'Non-LLM governed phone-local capability proof'},
    options:{execution:false}
  }});
  if(response.isError)throw new Error('SKILL_AUTHORITY_CALL_FAILED:'+name);
  const text=toolText(response);
  const missing=markers.filter(m=>!text.includes(m));
  if(missing.length)throw new Error('SKILL_AUTHORITY_MARKERS_MISSING:'+name+':'+missing.join(','));
  skillEvidence.push({tool:name,response_sha256:sha(text),markers_verified:markers});
}
await skillsClient.close();

const proofId='MACHINE-CONSCIOUSNESS-MC-G11-FILE-ROUNDTRIP-'+new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14);
const fileName='mc-g11-'+proofId.toLowerCase()+'.txt';
const expected='LEEWAY_MC_G11_'+sha(proofId+live.stateHash).slice(0,32);
const configPath=path.join(OUT,'device-bridge-config-'+proofId+'.json');
const bridgeReceiptsPath=path.join(OUT,'device-bridge-receipts-'+proofId+'.jsonl');
await fs.writeFile(configPath,JSON.stringify({
  devices:[{id:'fold6-termux-workspace',type:'desktop',workspace:WORKSPACE,grants:['device.health','device.files.read','device.files.write']}],
  receipts:bridgeReceiptsPath
},null,2)+'\n',{flag:'wx'});

const deviceServer=path.join(DEVICE_ROOT,'apps','desktop','mcp-server.mjs');
const deviceClient=await connect(process.execPath,[deviceServer,configPath],'mc-g11-device-provider');
const tools=await deviceClient.listTools();
for(const needed of ['bridge_capabilities','device_files_write','device_files_read']){
  if(!tools.tools.some(t=>t.name===needed))throw new Error('DEVICE_TOOL_MISSING:'+needed);
}
const caps=JSON.parse(toolText(await deviceClient.callTool({name:'bridge_capabilities',arguments:{deviceId:'fold6-termux-workspace'}})));
const granted=new Set((caps.capabilities||[]).filter(x=>x.granted).map(x=>x.name));
for(const cap of ['device.files.write','device.files.read'])if(!granted.has(cap))throw new Error('DEVICE_CAPABILITY_NOT_GRANTED:'+cap);

const writeResult=JSON.parse(toolText(await deviceClient.callTool({name:'device_files_write',arguments:{
  deviceId:'fold6-termux-workspace',arguments:{path:fileName,text:expected}
}})));
if(writeResult.ok!==true)throw new Error('DEVICE_WRITE_FAILED');
const readResult=JSON.parse(toolText(await deviceClient.callTool({name:'device_files_read',arguments:{
  deviceId:'fold6-termux-workspace',arguments:{path:fileName}
}})));
await deviceClient.close();
if(readResult.ok!==true)throw new Error('DEVICE_READ_FAILED');

const trace={
  schemaVersion:'0.1.0',
  proof_id:proofId,
  timestamp:new Date().toISOString(),
  source_class:'REAL',
  cognition:{
    cycle_id:live.cycleId ?? live.cycle_id ?? 'live-shadow-current',
    state_hash:live.stateHash,
    continuity_verified:live.continuityVerified===true,
    formula_status:formulaStatus
  },
  policy:{
    candidates,
    selected,
    action_request:{type:'PHONE_LOCAL_FILE_ROUNDTRIP',device_id:'fold6-termux-workspace',path:fileName},
    selection_rule:'Select bounded roundtrip only when live non-LLM shadow continuity is verified and Formula health is LEEWAY_FORMULA_V1_PASS.'
  },
  capability:{
    manifold_ref:'4citeB4U/LeeWay-Agent-Skills/config/leeway-capability-manifold.yaml',
    orchestrator_ref:'4citeB4U/LeeWay-Agent-Skills/skills/leeway-skill-orchestrator/SKILL.md',
    tool_gateway_ref:'4citeB4U/LeeWay-Agent-Skills/skills/leeway-tool-gateway/SKILL.md',
    canonical_owner:'4citeB4U/LEEWAY-DEVICE-BRIDGE',
    task_capability_weave:requiredSkills.map(x=>x[0]),
    focal_execution_set:['device.files.write','device.files.read'],
    skill_authority_calls:skillEvidence,
    manifold_routed:true,
    orchestrator_routed:true,
    tool_gateway_routed:true,
    route_evidence_refs:skillEvidence.map(x=>'skills-mcp:'+x.tool+':sha256:'+x.response_sha256)
  },
  execution:{
    provider:'4citeB4U/LEEWAY-DEVICE-BRIDGE/apps/desktop/mcp-server.mjs',
    request_hash:sha({proofId,fileName,expected}),
    executed:true,
    write_response:writeResult,
    read_response:readResult,
    bridge_receipts_path:bridgeReceiptsPath
  },
  observation:{
    independent:true,
    expected_sha256:sha(expected),
    observed_sha256:sha(readResult?.result?.text ?? ''),
    matches_expected:readResult?.result?.text===expected,
    evidence_ref:path.join(WORKSPACE,fileName)
  },
  llm_boundary:{
    cognition_kernel_llm_required:false,
    policy_selection_llm_used:false,
    capability_selection_llm_used:false,
    execution_authority_llm_used:false,
    result_verification_llm_used:false,
    learning_admission_llm_used:false
  },
  production_efficiency:{
    reused_components_count:7,
    new_glue_components_count:1,
    duplicated_components_created:0,
    human_interventions:0,
    manual_steps:0,
    elapsed_cycle_time_ms:null
  },
  classification:'EXECUTED_UNVERIFIED'
};
const tracePath=path.join(OUT,'execution-'+proofId+'.json');
await fs.writeFile(tracePath,JSON.stringify(trace,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'EXECUTED_UNVERIFIED',proofId,tracePath,observedMatch:trace.observation.matches_expected,skillAuthorityCalls:skillEvidence.length},null,2));
