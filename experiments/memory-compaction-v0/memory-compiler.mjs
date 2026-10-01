import fs from 'node:fs';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {simulateWorld} from '../machine-consciousness-v0/simulator.mjs';

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const scenarios=['stationary','changing','noisy','misleading','module-dropout'];
const states=['stable','unstable'];
const actions=['inspect','commit'];

function makeSource(){
  const rows=[];
  for(let w=0;w<32;w++){
    const scenario=scenarios[w%scenarios.length];
    rows.push(...simulateWorld({worldIndex:w,scenario,cycles:32,seed:20261001}));
  }
  return rows.map(x=>JSON.stringify(x)).join('\n')+'\n';
}
function packRows(source){
  const objs=source.trim().split(/\n/).map(JSON.parse);
  const rows=objs.map(o=>[
    scenarios.indexOf(o.scenario),o.worldIndex,o.cycle,o.cognitionView.observation.red?1:0,
    o.cognitionView.prior[0],o.cognitionView.prior[1],
    o.cognitionView.posterior[0],o.cognitionView.posterior[1],
    o.cognitionView.prediction.redProbability,
    o.cognitionView.policies[0].G,o.cognitionView.policies[0].probability,
    o.cognitionView.policies[1].G,o.cognitionView.policies[1].probability,
    actions.indexOf(o.cognitionView.selectedPolicy),
    states.indexOf(o.execution.result.nextWorldState),o.execution.result.preferred?1:0,o.execution.result.changed?1:0,
    o.metrics.belief_entropy_nats,o.metrics.precision_weighted_prediction_error,o.metrics.valence_free_energy_rate,
    o.metrics.belief_information_gain_nats,o.metrics.selected_policy_expected_free_energy,o.metrics.global_access_ratio,
    states.indexOf(o.auditWorldState.before),states.indexOf(o.auditWorldState.after),o.auditWorldState.actualSensorReliability,
    o.stateHash
  ]);
  return {
    schemaVersion:'0.1.0',
    representation:'LEEWAY_MEMORY_PACK_V0_EXACT',
    fixed:{schemaVersion:'0.1.0',provenance:'SIMULATED',sensor:'binary-risk-sensor',modelReliability:0.82,executor:'SIMULATED_WORLD'},
    dictionaries:{scenarios,states,actions},
    rowOrder:[
      'scenario','worldIndex','cycle','observationRed','prior0','prior1','posterior0','posterior1','predictedRed',
      'inspectG','inspectProbability','commitG','commitProbability','selectedAction','nextState','preferred','changed',
      'H','PE','V','IG','selectedG','B','beforeState','afterState','actualSensorReliability','stateHash'
    ],
    rows
  };
}
function reconstruct(pack){
  const f=pack.fixed,d=pack.dictionaries;
  const lines=pack.rows.map(r=>{
    const selected=d.actions[r[13]];
    const o={
      schemaVersion:f.schemaVersion,provenance:f.provenance,scenario:d.scenarios[r[0]],worldIndex:r[1],cycle:r[2],
      cognitionView:{
        observation:{sensor:f.sensor,red:!!r[3],modelReliability:f.modelReliability},
        prior:[r[4],r[5]],posterior:[r[6],r[7]],prediction:{redProbability:r[8]},
        policies:[
          {action:d.actions[0],G:r[9],probability:r[10]},
          {action:d.actions[1],G:r[11],probability:r[12]}
        ],
        selectedPolicy:selected
      },
      execution:{requestedAction:selected,executor:f.executor,result:{nextWorldState:d.states[r[14]],preferred:!!r[15],changed:!!r[16]}},
      metrics:{
        belief_entropy_nats:r[17],
        precision_weighted_prediction_error:r[18],
        valence_free_energy_rate:r[19],
        belief_information_gain_nats:r[20],
        selected_policy_expected_free_energy:r[21],
        global_access_ratio:r[22]
      },
      auditWorldState:{before:d.states[r[23]],after:d.states[r[24]],actualSensorReliability:r[25]}
    };
    o.stateHash=r[26];
    return JSON.stringify(o);
  });
  return lines.join('\n')+'\n';
}

const source=makeSource();
const pack=packRows(source);
const packed=JSON.stringify(pack);
const reconstructed=reconstruct(pack);
if(source!==reconstructed)throw new Error('EXACT_RECONSTRUCTION_FAILED');

const raw=Buffer.from(source),compact=Buffer.from(packed);
const rawBr=zlib.brotliCompressSync(raw),compactBr=zlib.brotliCompressSync(compact);
const report={
  schemaVersion:'0.1.0',
  status:'EXACT_MEMORY_COMPACTION_PASS',
  records:pack.rows.length,
  rawBytes:raw.length,
  compactRepresentationBytes:compact.length,
  structuralReductionPct:Number((100*(1-compact.length/raw.length)).toFixed(2)),
  rawBrotliBytes:rawBr.length,
  compactBrotliBytes:compactBr.length,
  physicalReductionVsRawPct:Number((100*(1-compactBr.length/raw.length)).toFixed(2)),
  compactVsRawBrotliPct:Number((100*(1-compactBr.length/rawBr.length)).toFixed(2)),
  sourceSha256:sha(raw),
  reconstructedSha256:sha(Buffer.from(reconstructed)),
  exactByteEquality:source===reconstructed,
  laws:[
    'Raw event truth remains reconstructable exactly.',
    'Structural constants are stored once instead of repeated per memory event.',
    'State/action/scenario vocabularies are dictionary encoded.',
    'Semantic working-memory summaries are a separate lossy tier and must retain source hashes.'
  ],
  formulaBoundary:'This is Formula-guided representation using canonical memory/storage principles; no numeric LEEWAY-FORMULA-v1.0 evaluation is claimed.'
};
fs.writeFileSync(new URL('./outputs/source-memory.jsonl',import.meta.url),source);
fs.writeFileSync(new URL('./outputs/memory-pack-v0.json',import.meta.url),packed+'\n');
fs.writeFileSync(new URL('./outputs/reconstructed-memory.jsonl',import.meta.url),reconstructed);
fs.writeFileSync(new URL('./outputs/compaction-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));