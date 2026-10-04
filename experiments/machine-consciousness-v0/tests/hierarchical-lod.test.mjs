import test from 'node:test';
import assert from 'node:assert/strict';
import {semanticRefinementScore,selectCapabilityLod,memoryShell,mayEvictFromWorkingMemory} from '../hierarchical-lod.mjs';

test('distant low-ambiguity capability remains descriptor-only',()=>{
  const out=selectCapabilityLod({ambiguity:.1,urgency:.2,taskDistance:4,contextSupport:1});
  assert.equal(out.lod,0);
});

test('direct high-ambiguity intent refines to execution candidate',()=>{
  const out=selectCapabilityLod({ambiguity:.9,urgency:.9,taskDistance:.5,contextSupport:1});
  assert.equal(out.lod,2);
});

test('LOD selection is deterministic and finite',()=>{
  const input={ambiguity:.5,urgency:.7,taskDistance:1.2,contextSupport:.9};
  assert.equal(semanticRefinementScore(input),semanticRefinementScore(input));
  assert.throws(()=>semanticRefinementScore({...input,urgency:NaN}),/LOD_NON_FINITE/);
});

test('memory shells preserve active and unresolved work',()=>{
  assert.equal(memoryShell({active:true}),'FOCUS');
  assert.equal(memoryShell({unresolvedCommitment:true}),'HORIZON');
  assert.equal(memoryShell({durableEvidence:true}),'ARCHIVE');
  assert.equal(mayEvictFromWorkingMemory({active:true}).allowed,false);
  assert.equal(mayEvictFromWorkingMemory({unresolvedCommitment:true}).allowed,false);
});

test('durable evidence may page from working memory but remains archived',()=>{
  const out=mayEvictFromWorkingMemory({durableEvidence:true});
  assert.equal(out.allowed,true);
  assert.equal(out.reason,'PAGE_DURABLE_EVIDENCE_KEEP_ARCHIVE');
});
