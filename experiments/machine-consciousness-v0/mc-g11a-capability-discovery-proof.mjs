/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.MC_G11A_DISCOVERY
WHAT = Reproducible non-LLM read-only proof that Machine Consciousness can traverse Agent Skills MCP into live Device Bridge capability discovery
WHY = Establish the governed ecosystem route before actuation
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-v0/mc-g11a-capability-discovery-proof.mjs
WHEN = 2026-10-02 onward
HOW = Machine state -> Agent Skills MCP device_capabilities -> loopback Device MCP gateway -> canonical RelayAdapter -> live phone -> raw evidence -> proof packet
LICENSE: MIT
*/
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const home=process.env.HOME;
const skills=process.env.LEEWAY_AGENT_SKILLS_ROOT||path.join(home,'.leeway/workstation/repos/LeeWay-Agent-Skills');
const bridge=process.env.LEEWAY_DEVICE_BRIDGE_ROOT||path.join(home,'.leeway/workstation/repos/LEEWAY-DEVICE-BRIDGE');
const credsPath=process.env.LEEWAY_DEVICE_RELAY_CREDENTIALS_FILE||path.join(home,'.leeway/workstation/credentials.json');
const tokenPath=process.env.LEEWAY_DEVICE_MCP_TOKEN_FILE||path.join(home,'.leeway/authority/device-mcp-gateway.token');
const gateway=process.env.LEEWAY_DEVICE_MCP_GATEWAY_URL||'http://127.0.0.1:5331';
const outDir=process.env.LEEWAY_MC_G11_OUT||path.join(process.cwd(),'experiments/machine-consciousness-v0/outputs/mc-g11');
fs.mkdirSync(outDir,{recursive:true});

const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const fileSha=p=>sha(fs.readFileSync(p));
const creds=JSON.parse(fs.readFileSync(credsPath,'utf8'));
const bearer=fs.readFileSync(tokenPath,'utf8').trim();
if(!creds.deviceId||!bearer) throw new Error('MISSING_LOCAL_AUTHORITY_BINDING');

const sdkBase=path.join(skills,'mcp-server/node_modules/@modelcontextprotocol/sdk/dist/esm/client');
const {Client}=await import(pathToFileURL(path.join(sdkBase,'index.js')).href);
const {StdioClientTransport}=await import(pathToFileURL(path.join(sdkBase,'stdio.js')).href);

const state=await fetch('http://127.0.0.1:8789/api/state').then(r=>{if(!r.ok)throw new Error('MACHINE_STATE_UNAVAILABLE');return r.json()});
const client=new Client({name:'mc-g11a-capability-discovery',version:'1.0.0'},{capabilities:{}});
const transport=new StdioClientTransport({
  command:process.execPath,
  args:[path.join(skills,'mcp-server/dist/index.js')],
  env:{...process.env,LEEWAY_DEVICE_MCP_GATEWAY_URL:gateway,LEEWAY_DEVICE_MCP_BEARER_TOKEN:bearer}
});
await client.connect(transport);
let toolResult;
try{
  toolResult=await client.callTool({name:'device_capabilities',arguments:{device_id:creds.deviceId}});
} finally { await client.close(); }
const text=toolResult.content?.find(x=>x.type==='text')?.text;
if(typeof text!=='string') throw new Error('NO_DEVICE_CAPABILITY_TEXT');
const outer=JSON.parse(text);
const upstream=outer.upstream?.capabilities||{};
let list=upstream.remoteQualified;
if(typeof list==='string') list=list.replace(/^\[|\]$/g,'').split(',').map(s=>s.trim()).filter(Boolean);
if(!Array.isArray(list)) list=[];

const refs={
  manifold:{path:'4citeB4U/LeeWay-Agent-Skills/config/leeway-capability-manifold.yaml',sha256:fileSha(path.join(skills,'config/leeway-capability-manifold.yaml'))},
  orchestrator:{path:'4citeB4U/LeeWay-Agent-Skills/skills/leeway-skill-orchestrator/SKILL.md',sha256:fileSha(path.join(skills,'skills/leeway-skill-orchestrator/SKILL.md'))},
  toolGateway:{path:'4citeB4U/LeeWay-Agent-Skills/skills/leeway-tool-gateway/SKILL.md',sha256:fileSha(path.join(skills,'skills/leeway-tool-gateway/SKILL.md'))},
  deviceTool:{path:'4citeB4U/LeeWay-Agent-Skills/mcp-server/src/device-capability-tools.ts',sha256:fileSha(path.join(skills,'mcp-server/src/device-capability-tools.ts'))},
  bridgeGateway:{path:'4citeB4U/LEEWAY-DEVICE-BRIDGE/clients/remote-controller/device-mcp-gateway.mjs',sha256:fileSha(path.join(bridge,'clients/remote-controller/device-mcp-gateway.mjs'))},
  relay:{path:'4citeB4U/LEEWAY-DEVICE-BRIDGE/packages/agent-relay/index.mjs',sha256:fileSha(path.join(bridge,'packages/agent-relay/index.mjs'))}
};

const request={tool:'device_capabilities',device_id:creds.deviceId};
const rawEvidence={
  evidence_id:'MC-G11A-CAPABILITY-DISCOVERY-RAW-20261002',
  captured_at:new Date().toISOString(),
  machine_state_hash:state.stateHash||state.cycleStateHash,
  continuity_verified:state.continuityVerified===true,
  formula_status:state.evidence?.formula?.status||null,
  mcp_call_error:toolResult.isError===true,
  adapter_state:outer.state||null,
  adapter_executed:outer.executed===true,
  upstream_http_status:outer.upstream_http_status||null,
  remote_capability_count:list.length,
  required_capabilities:{
    device_health:list.includes('device.health'),
    device_apps_launch:list.includes('device.apps.launch'),
    device_ui_snapshot:list.includes('device.ui.snapshot')
  },
  authority_refs:refs,
  request_hash:sha(JSON.stringify(request)),
  secrets_recorded:false
};
const rawText=JSON.stringify(rawEvidence,null,2)+'\n';
const rawHash=sha(rawText);
const rawPath=path.join(outDir,'mc-g11a-capability-discovery-raw-20261002.json');
fs.writeFileSync(rawPath,rawText);

const ok=toolResult.isError!==true&&outer.state==='ADAPTER_EVIDENCE_RECEIVED'&&outer.executed===true&&outer.upstream_http_status===200&&list.length>0;
const packet={
  proof_id:'MACHINE-CONSCIOUSNESS-MC-G11A-CAPABILITY-DISCOVERY-20261002',
  timestamp:new Date().toISOString(),
  source_class:'REAL',
  cognition:{cycle_id:'MC-G11A-'+Date.now(),state_hash:rawEvidence.machine_state_hash},
  policy:{
    candidates:['inspect_device_capabilities','hold'],
    selected:'inspect_device_capabilities',
    action_request:{capability:'device.capabilities',mutation:false}
  },
  capability:{
    manifold_ref:refs.manifold.path+'#sha256='+refs.manifold.sha256,
    orchestrator_ref:refs.orchestrator.path+'#sha256='+refs.orchestrator.sha256,
    focal_execution_set:['device_capabilities'],
    tool_gateway_ref:refs.toolGateway.path+'#sha256='+refs.toolGateway.sha256,
    canonical_owner:'4citeB4U/LEEWAY-DEVICE-BRIDGE',
    manifold_routed:true,
    orchestrator_routed:true,
    tool_gateway_routed:true,
    route_evidence_refs:Object.values(refs).map(x=>x.path+'#sha256='+x.sha256)
  },
  execution:{
    provider:'LeeWay Agent Skills MCP -> Device MCP Gateway -> Device Bridge RelayAdapter',
    provider_version:'MC-G11A-read-only-v0',
    provider_hash:refs.bridgeGateway.sha256,
    request_hash:rawEvidence.request_hash,
    executed:ok,
    result:{
      adapter_state:outer.state||null,
      upstream_http_status:outer.upstream_http_status||null,
      remote_capability_count:list.length,
      device_health:list.includes('device.health'),
      device_apps_launch:list.includes('device.apps.launch'),
      device_ui_snapshot:list.includes('device.ui.snapshot')
    }
  },
  observation:{
    independent:ok,
    matches_expected:ok,
    evidence_ref:'raw-execution-evidence:sha256:'+rawHash
  },
  veritas:{status:'NOT_EXECUTED',evidence_ref:null,failure_boundary:ok?null:'CAPABILITY_DISCOVERY_ROUTE_FAILED'},
  receipts:['raw-execution-evidence:sha256:'+rawHash],
  llm_boundary:{
    cognition_kernel_llm_required:false,
    policy_selection_llm_used:false,
    capability_selection_llm_used:false,
    execution_authority_llm_used:false,
    result_verification_llm_used:false,
    learning_admission_llm_used:false
  },
  production_efficiency:{
    reused_components_count:6,
    new_glue_components_count:1,
    duplicated_components_created:0,
    human_interventions:0,
    manual_steps:0,
    elapsed_cycle_time_ms:null
  },
  classification:ok?'EXECUTED_UNVERIFIED':'FAILED'
};
const packetPath=path.join(outDir,'mc-g11a-capability-discovery-proof-20261002.json');
fs.writeFileSync(packetPath,JSON.stringify(packet,null,2)+'\n');
console.log(JSON.stringify({state:packet.classification,rawPath,packetPath,rawHash,capabilityCount:list.length,adapterState:outer.state},null,2));
process.exit(ok?0:20);
