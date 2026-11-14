/*
 LEEWAY HEADER — DO NOT REMOVE
 REGION: LEEWAY.FORMULA.HARDWARE; TAG: H08_H09_STANDALONE_CANDIDATE
 WHAT: Deterministic closed resource allocation and pressure recovery kernels.
 WHY: Make both historically open roles executable and independently testable.
 WHO: LeeWay creator-authorized implementation; WHERE: canonical Formula candidate source.
 WHEN: 2026-10-25; HOW: integer capacity invariants and conservative recovery bounds.
 AUTHORITY: IMPLEMENTATION_CANDIDATE; standalone source is not a signed production certification.
 LICENSE: Existing LeeWay repository terms.
*/
const integer=(x,name)=>{if(!Number.isSafeInteger(x)||x<0)throw new RangeError(name+'_NONNEGATIVE_SAFE_INTEGER_REQUIRED');return x;};
const positive=(x,name)=>{integer(x,name);if(x===0)throw new RangeError(name+'_MUST_BE_POSITIVE');return x;};
/** H-08 / LW-H2: a=min(requested,max(0,capacity-reserved-used)); deny partial allocation unless permitted. */
export function executeH08({capacity,reserved=0,used=0,requested,allowPartial=false}={}) {
 for(const [k,v] of Object.entries({capacity,reserved,used,requested}))integer(v,k);
 if(reserved>capacity||used>capacity-reserved)throw new RangeError('H08_INVALID_ACCOUNTING');
 if(typeof allowPartial!=='boolean')throw new TypeError('H08_PARTIAL_POLICY_INVALID');
 const available=capacity-reserved-used;
 const granted=Math.min(requested,available);
 const admitted=requested===0||granted===requested||(allowPartial&&granted>0);
 const allocation=admitted?granted:0;
 return Object.freeze({equationId:'H-08',available,requested,allocation,remaining:available-allocation,admitted,reason:admitted?'ADMITTED':'CAPACITY_INSUFFICIENT'});
}
/** H-09 / LW-H4: pressure=(used+reserved)/capacity; hysteretic controller with bounded reclaim. */
export function executeH09({capacity,reserved=0,used,highPermille=900,lowPermille=700,maxReclaim=0}={}) {
 for(const [k,v] of Object.entries({capacity,reserved,used,highPermille,lowPermille,maxReclaim}))integer(v,k);
 positive(capacity,'capacity');
 if(reserved>capacity||used>capacity-reserved||lowPermille>=highPermille||highPermille>1000)throw new RangeError('H09_INVALID_PRESSURE_POLICY');
 const occupied=used+reserved;
 // Compare integers; avoid floating-point decision errors.
 const overloaded=BigInt(occupied)*1000n>=BigInt(highPermille)*BigInt(capacity);
 const targetUsed=Math.max(0,Number(BigInt(lowPermille)*BigInt(capacity)/1000n)-reserved);
 const reclaim=overloaded?Math.min(maxReclaim,Math.max(0,used-targetUsed)):0;
 const nextUsed=used-reclaim;
 return Object.freeze({equationId:'H-09',overloaded,reclaim,nextUsed,remainingCapacity:capacity-reserved-nextUsed,pressurePermille:Number(BigInt(occupied)*1000n/BigInt(capacity)),reason:overloaded?'RECOVERY_REQUIRED':'WITHIN_THRESHOLD'});
}