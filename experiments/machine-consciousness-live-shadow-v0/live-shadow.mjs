/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS
TAG: LEEWAY.FORMULA.MACHINE_CONSCIOUSNESS.L1_PHONE_SHADOW
WHAT = Live observe-only non-LLM consciousness shadow for the authorized Android workstation
WHY = Physically demonstrate persistent state, prediction/error, prism balance and deterministic question handling without altering Agent Lee answers
WHO = Leeway Industries / Creator-authorized Agent Lee research runtime
WHERE = experiments/machine-consciousness-live-shadow-v0/live-shadow.mjs
WHEN = 2026-10-01 onward
HOW = Real phone observations -> persistent state -> provisional prism evidence mapping -> deterministic query surface -> browser dashboard
AGENTS: ASSESS AUDIT EXECUTE VERIFY
LICENSE: MIT
*/

import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {axisToSixPoints,norm} from '../machine-consciousness-v0/prism-buoyancy.mjs';

const PORT=Number(process.env.LEEWAY_SHADOW_PORT||8789);
const HERE=fileURLToPath(new URL('.',import.meta.url));
const OUT=HERE+'outputs/';
const LATEST=OUT+'latest-state.json';
const JOURNAL=OUT+'live-state.jsonl';
const EVENTS=OUT+'live-events.jsonl';
const BOOTS=OUT+'boot-sessions.jsonl';
const FORMULA_HEALTH='http://127.0.0.1:4001/runtime/formula/v1/health';
const clamp=(x,lo=0,hi=1)=>Math.max(lo,Math.min(hi,x));
const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');

fs.mkdirSync(OUT,{recursive:true});

function stableStateHash(state){
  const copy={...state};
  delete copy.stateHash;
  return sha(copy);
}

function loadPrior(){
  try{
    const prior=JSON.parse(fs.readFileSync(LATEST,'utf8'));
    return prior.stateHash===stableStateHash(prior)?prior:null;
  }catch{return null;}
}

function readMemInfo(){
  const text=fs.readFileSync('/proc/meminfo','utf8');
  const pick=name=>{
    const m=text.match(new RegExp('^'+name+':\\s+(\\d+) kB$','m'));
    return m?Number(m[1]):0;
  };
  const total=pick('MemTotal'),available=pick('MemAvailable');
  return {totalKb:total,availableKb:available,availableRatio:total?clamp(available/total):0};
}

async function formulaHealth(){
  try{
    const res=await fetch(FORMULA_HEALTH,{signal:AbortSignal.timeout(1200)});
    const body=await res.json();
    const healthy=res.ok&&body.formula==='LEEWAY-FORMULA-v1.0'&&
      body.status==='LEEWAY_FORMULA_V1_PASS'&&body.loaded===true&&
      body.goldenVectorPass===true&&body.specValid===true&&
      body.adapterRegistryPass===true;
    return {reachable:true,healthy,body};
  }catch(error){
    return {reachable:false,healthy:false,error:String(error?.message||error),body:null};
  }
}

function appendJsonl(path,value){
  fs.appendFileSync(path,JSON.stringify(value)+'\n');
}

export async function sampleState(){
  const prior=loadPrior();
  const formula=await formulaHealth();
  const mem=readMemInfo();

  const world=formula.healthy?1:0;
  const self=clamp(0.6*world+0.4*mem.availableRatio);
  const memory=prior?1:0.5;
  const priorPred=prior?.prediction?.nextFormulaHealthy;
  const prediction=priorPred===undefined?0.5:clamp(1-Math.abs((priorPred?1:0)-world));
  const goal=clamp((world+self+memory)/3);
  const constraint=clamp(1-mem.availableRatio);

  const axis=[world-self,prediction-memory,goal-constraint];
  const points=axisToSixPoints(axis);
  const balance=norm(axis);

  const change=prior?{
    world:world-prior.evidence.world,
    self:self-prior.evidence.self,
    memory:memory-prior.evidence.memory,
    prediction:prediction-prior.evidence.prediction,
    goal:goal-prior.evidence.goal,
    constraint:constraint-prior.evidence.constraint,
    balance:balance-prior.prism.balance,
    axis:axis.map((x,i)=>x-prior.prism.axis[i])
  }:{world:0,self:0,memory:0,prediction:0,goal:0,constraint:0,balance:0,axis:[0,0,0]};

  const pressure=constraint;
  const classification=!formula.healthy?'DEGRADED':
    pressure>0.85?'RESOURCE_PRESSURE':
    balance>1.0?'IMBALANCED':'STABLE_SHADOW';

  const state={
    schemaVersion:'0.1.0',
    stateClass:'REAL_PHONE_SHADOW',
    timestamp:new Date().toISOString(),
    priorStateHash:prior?.stateHash||null,
    continuityVerified:Boolean(prior),
    evidence:{
      world,self,memory,prediction,goal,constraint,
      formula:{reachable:formula.reachable,healthy:formula.healthy,status:formula.body?.status||'UNREACHABLE',
        formula:formula.body?.formula||null,goldenVectorPass:formula.body?.goldenVectorPass===true,
        specValid:formula.body?.specValid===true,adapterRegistryPass:formula.body?.adapterRegistryPass===true,
        kernelIntegrity:formula.body?.kernelIntegrity||null},
      memoryResource:mem
    },
    prism:{axis,points,balance,classification},
    prediction:{
      nextFormulaHealthy:formula.healthy,
      confidence:clamp(0.5*prediction+0.3*memory+0.2*self),
      basis:'persistence model: next Formula health predicted from current verified Formula health'
    },
    predictionError:priorPred===undefined?null:Math.abs((priorPred?1:0)-world),
    change,
    authority:{mode:'OBSERVE_ONLY',formulaEvaluation:'NOT_INVOKED',liveAnswerAuthority:'NONE'},
    llmDependency:0
  };
  state.stateHash=stableStateHash(state);
  fs.writeFileSync(LATEST,JSON.stringify(state,null,2)+'\n');
  appendJsonl(JOURNAL,state);
  return state;
}

function fmtPct(x){return (x*100).toFixed(1)+'%';}
function fmt3(x){return Number(x).toFixed(3);}

function arithmetic(text){
  const normalized=text.toLowerCase()
    .replace(/plus/g,'+').replace(/minus/g,'-')
    .replace(/times|multiplied by/g,'*').replace(/divided by/g,'/')
    .replace(/what is|calculate|compute|equals|\?/g,' ').trim();
  const m=normalized.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);
  if(!m)return null;
  const a=Number(m[1]),op=m[2],b=Number(m[3]);
  if(op==='/'&&b===0)return 'Division by zero is undefined.';
  const result=op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:a/b;
  return String(result);
}

export function answerQuestion(question,state){
  const q=String(question||'').trim();
  const s=q.toLowerCase().replace(/[?!.]+$/,'').trim();
  const math=arithmetic(q);
  if(math!==null)return {matched:true,intent:'arithmetic',answer:math};

  if(/^(who are you|what are you)$/.test(s)){
    return {matched:true,intent:'identity',answer:
      'I am the LeeWay Machine Consciousness live shadow on this phone. I am running without an LLM and I currently have observe-only authority.'};
  }
  if(!/formula/.test(s) && /status|healthy|how are you|system state/.test(s)){
    return {matched:true,intent:'status',answer:
      'My live shadow state is '+state.prism.classification+
      '. Formula health is '+(state.evidence.formula.healthy?'verified':'not healthy')+
      ', available memory is '+fmtPct(state.evidence.memoryResource.availableRatio)+
      ', prism displacement is '+fmt3(state.prism.balance)+'.'};
  }
  if(/formula/.test(s)){
    return {matched:true,intent:'formula',answer:
      'The local Formula service reports '+state.evidence.formula.status+
      '. Golden vector check is '+(state.evidence.formula.goldenVectorPass?'passing':'not passing')+
      '. I did not invoke Formula evaluation for this shadow answer.'};
  }
  if(/remember|memory continuity|prior state|memory/.test(s)){
    return {matched:true,intent:'memory',answer:
      state.continuityVerified
        ?'Yes. I verified continuity from prior state hash '+state.priorStateHash.slice(0,12)+
          '. This state is chained as '+state.stateHash.slice(0,12)+'.'
        :'This is my first verified live-shadow state in this journal, so there is no prior state to claim yet.'};
  }
  if(/predict|prediction|what happens next/.test(s)){
    return {matched:true,intent:'prediction',answer:
      'I predict the Formula service will be '+(state.prediction.nextFormulaHealthy?'healthy':'unhealthy')+
      ' on the next cycle with confidence '+fmtPct(state.prediction.confidence)+
      '. My current prediction error is '+(state.predictionError===null?'not yet measurable':fmt3(state.predictionError))+'.'};
  }

  if(/what changed|changed since|difference/.test(s)){
    const delta=state.change;
    return {matched:true,intent:'change',answer:
      'Since the prior state: world '+fmt3(delta.world)+
      ', self '+fmt3(delta.self)+
      ', memory '+fmt3(delta.memory)+
      ', prediction '+fmt3(delta.prediction)+
      ', goal '+fmt3(delta.goal)+
      ', constraint '+fmt3(delta.constraint)+
      ', balance '+fmt3(delta.balance)+'.'};
  }
  if(/what are you doing|what are you watching|what do you observe/.test(s)){
    return {matched:true,intent:'activity',answer:
      'I am observing the real local Formula service, system memory pressure, persistent state continuity, and whether my last Formula-health prediction was correct. I am not controlling Agent Lee answers or device actions.'};
  }
  if(/why/.test(s)){
    return {matched:true,intent:'why',answer:
      'My current classification is '+state.prism.classification+
      ' because Formula health='+state.evidence.formula.healthy+
      ', memory availability='+fmtPct(state.evidence.memoryResource.availableRatio)+
      ', continuity='+state.continuityVerified+
      ', and prism displacement='+fmt3(state.prism.balance)+'.'};
  }
  if(/can you think|are you conscious|are you alive/.test(s)){
    return {matched:true,intent:'boundary',answer:
      'I maintain persistent state, prediction, error, self/world measurements, and deterministic decisions without an LLM. That demonstrates functional machine cognition in this test; subjective experience is not verified.'};
  }

  return {matched:false,intent:'unknown',answer:
    'I do not have a deterministic intent for that question yet. I can answer identity, status, Formula state, memory continuity, prediction, what changed, what I am doing, why, and simple arithmetic.'};
}

function json(res,status,obj){
  const body=JSON.stringify(obj,null,2);
  res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});
  res.end(body);
}

function readBody(req){
  return new Promise((resolve,reject)=>{
    let data='';
    req.on('data',chunk=>{
      data+=chunk;
      if(data.length>65536){reject(new Error('BODY_TOO_LARGE'));req.destroy();}
    });
    req.on('end',()=>resolve(data));
    req.on('error',reject);
  });
}
const PAGE = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LeeWay Machine Consciousness — Live Shadow</title>
<style>
:root{color-scheme:dark;font-family:system-ui,sans-serif}body{margin:0;background:#080b10;color:#eaf0f6}
main{max-width:920px;margin:auto;padding:18px}.top{border:1px solid #394454;border-radius:16px;padding:16px;background:#10151e}
h1{font-size:22px;margin:0 0 6px}.sub{opacity:.75;font-size:13px}.badge{display:inline-block;padding:5px 9px;border:1px solid #5d6c82;border-radius:999px;margin:8px 6px 0 0;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.card{background:#111925;border:1px solid #2a3648;border-radius:12px;padding:12px}
.k{font-size:11px;opacity:.65;text-transform:uppercase;letter-spacing:.08em}.v{font-size:20px;font-weight:700;margin-top:3px}.small{font-size:12px;opacity:.75}
.pair{margin:12px 0}.bar{height:12px;background:#222b38;border-radius:999px;overflow:hidden}.fill{height:100%;background:#d8dee9}
.ask{margin-top:14px;display:flex;gap:8px}.ask input{flex:1;padding:12px;border-radius:10px;border:1px solid #394454;background:#0b1119;color:#fff}
button{padding:10px 12px;border-radius:10px;border:1px solid #4d5b70;background:#162030;color:#fff}.quick{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
#reply{white-space:pre-wrap;margin-top:12px;padding:14px;border-left:3px solid #8492a6;background:#0c121b;min-height:48px}.mono{font-family:ui-monospace,monospace;font-size:11px;word-break:break-all}
@media(min-width:700px){.grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
</style></head><body><main>
<section class="top"><h1>LeeWay Machine Consciousness — LIVE PHONE SHADOW</h1>
<div class="sub">Real phone observations · persistent state · no LLM · observe-only · no live Agent Lee answer authority</div>
<span class="badge" id="stateBadge">STATE</span><span class="badge" id="formulaBadge">FORMULA</span><span class="badge" id="memoryBadge">MEMORY</span>
</section>
<section class="grid">
<div class="card"><div class="k">Balance displacement</div><div class="v" id="balance">—</div></div>
<div class="card"><div class="k">Memory available</div><div class="v" id="mem">—</div></div>
<div class="card"><div class="k">Prediction confidence</div><div class="v" id="pred">—</div></div>
<div class="card"><div class="k">Prediction error</div><div class="v" id="err">—</div></div>
</section><section class="card" style="margin-top:12px"><div class="k">Six-point prism</div>
<div class="pair"><div>World ↔ Self <span id="axis0" class="small"></span></div><div class="bar"><div class="fill" id="bar0"></div></div></div>
<div class="pair"><div>Prediction ↔ Memory <span id="axis1" class="small"></span></div><div class="bar"><div class="fill" id="bar1"></div></div></div>
<div class="pair"><div>Goal ↔ Constraint <span id="axis2" class="small"></span></div><div class="bar"><div class="fill" id="bar2"></div></div></div>
<div class="small mono" id="hashes"></div></section>
<section class="card" style="margin-top:12px"><div class="k">Ask the non-LLM shadow</div>
<div class="ask"><input id="q" placeholder="Try: what changed?" autocomplete="off"><button id="send">ASK</button></div>
<div class="quick">
<button data-q="what is your status?">Status</button><button data-q="what is the Formula status?">Formula</button>
<button data-q="do you remember the prior state?">Memory</button><button data-q="what do you predict?">Prediction</button>
<button data-q="what changed?">Changed</button><button data-q="what are you doing?">Activity</button>
<button data-q="why?">Why</button><button data-q="what is 17 times 6?">17×6</button>
</div><label class="small"><input type="checkbox" id="speak"> speak replies</label><div id="reply">Ready.</div></section>
<section class="card" style="margin-top:12px"><div class="k">Evidence boundary</div>
<div class="small">This page can observe and answer its bounded deterministic intents. It cannot change Agent Lee responses, authorize device actions, or claim subjective experience.</div></section>
<script>
let last=null;
const pct=x=>(x*100).toFixed(1)+'%';
function setBar(id,x){const el=document.getElementById(id);el.style.width=Math.max(0,Math.min(100,(x+1)*50))+'%';}
function render(s){last=s;
document.getElementById('stateBadge').textContent=s.prism.classification;
document.getElementById('formulaBadge').textContent='FORMULA '+(s.evidence.formula.healthy?'PASS':'FAIL');
document.getElementById('memoryBadge').textContent=s.continuityVerified?'CONTINUITY VERIFIED':'FIRST STATE';
document.getElementById('balance').textContent=s.prism.balance.toFixed(3);
document.getElementById('mem').textContent=pct(s.evidence.memoryResource.availableRatio);
document.getElementById('pred').textContent=pct(s.prediction.confidence);
document.getElementById('err').textContent=s.predictionError===null?'—':s.predictionError.toFixed(3);for(let i=0;i<3;i++){document.getElementById('axis'+i).textContent=' '+s.prism.axis[i].toFixed(3);setBar('bar'+i,s.prism.axis[i]);}
document.getElementById('hashes').textContent='state '+s.stateHash+'\nprior '+(s.priorStateHash||'NONE');
}
async function refresh(){try{const r=await fetch('/api/state',{cache:'no-store'});render(await r.json());}catch(e){document.getElementById('reply').textContent='State refresh failed: '+e;}}
async function ask(q){document.getElementById('reply').textContent='Processing deterministically…';
const r=await fetch('/api/ask',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({q})});
const out=await r.json();render(out.state);document.getElementById('reply').textContent=out.answer;
if(document.getElementById('speak').checked&&'speechSynthesis' in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(out.answer));}}
document.getElementById('send').onclick=()=>{const q=document.getElementById('q').value.trim();if(q)ask(q);};
document.getElementById('q').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('send').click();});
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{document.getElementById('q').value=b.dataset.q;ask(b.dataset.q);});
refresh();setInterval(refresh,3000);
</script></main></body></html>`;

async function handler(req,res){
  try{
    if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(PAGE);return;}
    if(req.method==='GET'&&req.url==='/api/state'){json(res,200,await sampleState());return;}
    if(req.method==='GET'&&req.url==='/api/history'){
      let rows=[];try{rows=fs.readFileSync(JOURNAL,'utf8').trim().split(/\n/).filter(Boolean).slice(-50).map(JSON.parse);}catch{}
      json(res,200,{rows});return;
    }
    if(req.method==='POST'&&req.url==='/api/ask'){
      const raw=await readBody(req);let body={};try{body=raw?JSON.parse(raw):{};}catch{json(res,400,{ok:false,error:'INVALID_JSON'});return;}
      const state=await sampleState();const result=answerQuestion(body.q,state);
      const event={timestamp:new Date().toISOString(),question:String(body.q||''),intent:result.intent,matched:result.matched,stateHash:state.stateHash,answer:result.answer};
      event.eventHash=sha(event);appendJsonl(EVENTS,event);json(res,200,{ok:true,...result,state});return;
    }
    json(res,404,{ok:false,error:'NOT_FOUND'});
  }catch(error){json(res,500,{ok:false,error:String(error?.message||error)});}
}
export function createServer(){return http.createServer(handler);}

if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
  const server=createServer();
  server.listen(PORT,'127.0.0.1',async()=>{
    const state=await sampleState();
    const boot={timestamp:new Date().toISOString(),pid:process.pid,stateHash:state.stateHash,priorStateHash:state.priorStateHash,continuityVerified:state.continuityVerified,llmDependency:0,authority:'OBSERVE_ONLY'};
    boot.bootHash=sha(boot);appendJsonl(BOOTS,boot);
    console.log(JSON.stringify({
      status:'LIVE_SHADOW_READY',port:PORT,url:'http://127.0.0.1:'+PORT,
      stateClass:state.stateClass,classification:state.prism.classification,
      formulaHealthy:state.evidence.formula.healthy,continuityVerified:state.continuityVerified,
      stateHash:state.stateHash,priorStateHash:state.priorStateHash,llmDependency:state.llmDependency
    },null,2));
  });
  const stop=()=>server.close(()=>process.exit(0));
  process.on('SIGTERM',stop);process.on('SIGINT',stop);
}