import crypto from 'node:crypto';
import {replayPriority,selfConsistency} from './cognitive-math.mjs';

export function rankDreamCandidates(episodes){
  return episodes.map(e=>({
    ...e,
    evb:replayPriority(e.gain,e.need)
  })).sort((a,b)=>b.evb-a.evb || String(a.sourceHash).localeCompare(String(b.sourceHash)));
}
export function dreamReplay(sourceEpisode,{alternatePolicy,predictedOutcome}){
  if(!sourceEpisode?.sourceHash)throw new Error('SOURCE_HASH_REQUIRED');
  const payload={
    schemaVersion:'0.1.0',
    provenance:'SIMULATED_DREAM',
    sourceHash:sourceEpisode.sourceHash,
    alternatePolicy,
    predictedOutcome,
    admittedToRealMemory:false
  };
  payload.dreamHash=crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return payload;
}
export function selfAwarenessCheck(observedSelf,predictedSelf){
  return {
    consistency:selfConsistency(observedSelf,predictedSelf),
    observedSelf,
    predictedSelf
  };
}
