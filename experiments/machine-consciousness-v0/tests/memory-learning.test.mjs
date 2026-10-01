import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateWorld} from '../simulator.mjs';
import {
  createSemanticModel,semanticSnapshot,runLearningTrace,
  verifyMemoryChain,summarizeLoss,relativeImprovement
} from '../memory-learning.mjs';

const opts={worldIndex:9,scenario:'noisy',cycles:64,seed:20261001};

test('semantic model starts from the MC-1 declared agent model',()=>{
  const s=semanticSnapshot(createSemanticModel());
  assert.ok(Math.abs(s.sensorReliability-.82)<1e-12);
  assert.ok(Math.abs(s.transitionModel.inspect[0][0]-.94)<1e-12);
  assert.ok(Math.abs(s.transitionModel.commit[1][1]-.88)<1e-12);
});

test('fixed receipts produce deterministic learning trace and memory head',()=>{
  const receipts=simulateWorld(opts);
  const a=runLearningTrace(receipts),b=runLearningTrace(receipts);
  assert.deepEqual(a.records,b.records);
  assert.equal(a.memory.headHash,b.memory.headHash);
  assert.deepEqual(a.finalModel,b.finalModel);
});

test('episodic memory is hash chained and preserves simulated provenance',()=>{
  const trace=runLearningTrace(simulateWorld(opts));
  assert.equal(verifyMemoryChain(trace.memory),true);
  assert.ok(trace.memory.entries.length===64);
  assert.ok(trace.memory.entries.every(e=>e.provenance==='SIMULATED'));
  assert.match(trace.memory.headHash,/^[a-f0-9]{64}$/);
});

test('learning does not mutate the source cognition receipts',()=>{
  const receipts=simulateWorld(opts);
  const before=JSON.stringify(receipts);
  const trace=runLearningTrace(receipts);
  assert.equal(trace.sourceReceiptsUnchanged,true);
  assert.equal(JSON.stringify(receipts),before);
});

test('no-learning control leaves semantic model at its prior',()=>{
  const trace=runLearningTrace(simulateWorld(opts),{learningMode:'NONE'});
  assert.equal(trace.finalModel.updates,0);
  assert.ok(Math.abs(trace.finalModel.sensorReliability-.82)<1e-12);
});

test('oracle feedback is explicitly test-only and Formula stays unexecuted',()=>{
  const trace=runLearningTrace(simulateWorld(opts));
  assert.equal(trace.feedbackClass,'ORACLE_SUPERVISED_TEST_ONLY');
  assert.equal(trace.formulaExecutionState,'NOT_EXECUTED');
  assert.ok(trace.records.every(r=>r.update.feedbackClass==='ORACLE_SUPERVISED_TEST_ONLY'));
});

test('learning improves noisy-sensor predictive log loss after warmup',()=>{
  const learned=[],baseline=[];
  for(let worldIndex=0;worldIndex<64;worldIndex++){
    const receipts=simulateWorld({worldIndex,scenario:'noisy',cycles:64,seed:20261001});
    const l=runLearningTrace(receipts);
    const b=runLearningTrace(receipts,{learningMode:'NONE'});
    learned.push(summarizeLoss(l.records,{startCycle:12,endCycle:64}).sensorNll);
    baseline.push(summarizeLoss(b.records,{startCycle:12,endCycle:64}).sensorNll);
  }
  const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
  assert.ok(relativeImprovement({sensorNll:mean(baseline)},{sensorNll:mean(learned)},'sensorNll')>.05);
});

test('learning improves transition prediction after changing-world drift',()=>{
  const learned=[],baseline=[];
  for(let worldIndex=0;worldIndex<64;worldIndex++){
    const receipts=simulateWorld({worldIndex,scenario:'changing',cycles:64,seed:20261001});
    const l=runLearningTrace(receipts);
    const b=runLearningTrace(receipts,{learningMode:'NONE'});
    learned.push(summarizeLoss(l.records,{startCycle:20,endCycle:64}).transitionNll);
    baseline.push(summarizeLoss(b.records,{startCycle:20,endCycle:64}).transitionNll);
  }
  const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
  assert.ok(mean(learned)<mean(baseline));
});
