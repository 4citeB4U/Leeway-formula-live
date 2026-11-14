/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.AUDIT
TAG: H08_ORIGINAL_LDWMD_ALLOCATION_LIFECYCLE
WHAT: Test original LDWMD lease conservation using isolated bounded hardware callbacks.
WHY: Direct executable allocation/free proof for H-08-related behavior.
WHO: LeeWay audit. WHERE: isolated fixture. WHEN: 2026-10-25.
HOW: 2-slot memory capacity, idempotent admit, protected lease, eviction and release.
AUTHORITY: AUDIT_ONLY; mock hardware, not live VRAM. LICENSE: Existing LeeWay terms.
*/
import test from 'node:test';import assert from 'node:assert/strict';
import {LeeWayDeviceWorkingMemoryDatabase as Database} from '../ldwmd-gpu-admission-g1/automation-runtime/src/vtensor/vram-database.mjs';
test('H-08 original LDWMD conserves admitted memory across eviction and release',async()=>{
 const size=16384,hash='a'.repeat(64);let alloc=0,free=0;const handles=new Set();
 const hardwareAdapter={async allocate(){const handle='h'+(++alloc);handles.add(handle);return {handle,evidence:{state:'TEST_ALLOCATION'}}},async free({handle}){assert.ok(handles.delete(handle));free++;return {freed:true}}};
 const db=new Database({deviceId:'AUDIT_H08',deviceGeneration:'TEST',totalVramBytes:size*2,hardwareAdapter,headroomPolicy:{minimumBytes:0}});
 const rec=id=>({tensorId:id,contentHash:hash,blockHash:hash,shape:[4096],dtype:'u32',logicalBytes:size,physicalBytes:size,deviceId:'AUDIT_H08',deviceGeneration:'TEST',memoryClass:'TEST',residencyState:'UNBOUND',trustState:'TEST_FIXTURE',pinState:false});
 for(const id of ['a','b','c'])db.register(rec(id));
 await db.admit('a');assert.equal(db.activePhysicalBytes,size);
 await db.admit('a');assert.equal(alloc,1);
 await db.admit('b');db.get('b').executing=true;await assert.rejects(()=>db.evict('b'),/EVICTION_INELIGIBLE/);
 await db.admit('c');assert.equal(db.activePhysicalBytes,size*2);assert.equal(db.get('a').residencyState,'EVICTED');
 db.get('b').executing=false;await db.evict('b');await db.evict('c');
 assert.equal(db.activePhysicalBytes,0);assert.equal(handles.size,0);assert.equal(alloc,free);
});
