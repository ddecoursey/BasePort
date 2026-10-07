import assert from 'node:assert/strict';
import {createStore,reduceStore,validateRequest,executionProblem,observationFor,serviceChanges,serviceState} from '../src/serviceStore.js';
import {assess,MAX_AGE_MS} from '../src/controlPlane.js';
const form=(action='Backup',serviceId='DB-1024',extra={})=>({action,serviceId,window:'Run now',...extra});
const create=(state,f,persona='DBRE')=>reduceStore(state,{type:'CREATE',form:f,persona});
const approve=(state,id=state.requests[0].id)=>reduceStore(state,{type:'APPROVE',id});
const complete=(state,id=state.requests[0].id)=>reduceStore(reduceStore(state,{type:'START',id}),{type:'COMPLETE',id});
let store=createStore();
assert.equal(serviceState(store.services[1],store.evidence).label,'Needs attention');
assert.equal(serviceState(store.services[5],store.evidence).label,'Needs sync');
assert(validateRequest(store,form('Patch'),'Developer'));
assert(validateRequest(store,form('Backup','DB-1023'),'Developer'));
assert(validateRequest(store,form('Retire'),'DBRE').includes('Confirm'));
assert(validateRequest(store,form('Schema update','DB-1022'),'DBRE'));
store=create(store,form());const id=store.requests[0].id;
assert.equal(store.requests[0].status,'Awaiting approval');
assert.equal(store.requests[0].path,null,'Recovery incorrectly uses an AAP lifecycle binding');
assert.equal(reduceStore(store,{type:'START',id}),store,'Approval gate bypassed');
store=complete(approve(store),id);assert.equal(store.requests[0].status,'Completed');assert.equal(store.backups.length,7);
// Pin automation at request creation; revision publication affects future requests only.
store=create(store,form('Apply baseline','DB-1023'));const pinned=store.requests[0].path;
store=reduceStore(store,{type:'PUBLISH',id:'baseline',binding:{template:'99',revision:'abcdef1'}});
assert.equal(store.requests[0].path.template,pinned.template);assert.equal(store.paths[0].template,'99');
store=complete(approve(store));assert.equal(assess(store.services[1],store.evidence['DB-1023']).status,'Aligned');
// Patching preserves unrelated drift.
let patch=create(createStore(),form('Patch','DB-1023'));patch=complete(approve(patch));
assert.equal(patch.services[1].version,'19.24');assert.equal(patch.evidence['DB-1023'].facts.tlsEnabled,false);assert.equal(assess(patch.services[1],patch.evidence['DB-1023']).status,'Drift');
// Stale or missing facts gate execution; refresh does not silently resolve existing drift.
let stale=approve(create(createStore(),form('Restart','DB-1019')));assert(executionProblem(stale,stale.requests[0]).includes('Refresh'));assert.equal(reduceStore(stale,{type:'START',id:stale.requests[0].id}),stale);
stale=reduceStore(stale,{type:'INGEST',payload:observationFor(stale,stale.services[5])});assert.equal(executionProblem(stale,stale.requests[0]),'');
const before=stale;stale=reduceStore(stale,{type:'INGEST',payload:observationFor(stale,stale.services[5],{jobId:'test'})});assert.notEqual(stale,before);const duplicate=observationFor(stale,stale.services[5]);stale=reduceStore(stale,{type:'INGEST',payload:duplicate});assert.equal(reduceStore(stale,{type:'INGEST',payload:duplicate}),stale);
// Recheck prerequisites even if they become invalid while a runner is active.
let mid=approve(create(createStore(),form('Upgrade')));mid=reduceStore(mid,{type:'START',id:mid.requests[0].id});mid={...mid,evidence:{...mid.evidence,'DB-1024':{...mid.evidence['DB-1024'],observedAt:new Date(Date.now()-MAX_AGE_MS-1).toISOString()}}};mid=reduceStore(mid,{type:'COMPLETE',id:mid.requests[0].id});assert.equal(mid.requests[0].status,'Approved');assert.equal(mid.services[0].version,'16.4');
// Restore validation, isolated clone, and target readiness.
let restore=createStore();assert(validateRequest(restore,form('Restore clone','DB-1021',{target:'lake-clone',backupId:'BKP-304'}),'DBRE'));
restore=create(restore,form('Restore clone','DB-1024',{target:'policy-clone',backupId:'BKP-301'}));restore=complete(approve(restore));const clone=restore.services[0];assert.equal(clone.name,'policy-clone');assert.equal(clone.backup,'Unprotected');assert.equal(serviceState(clone,restore.evidence).label,'Needs sync');assert.equal(restore.services.find(s=>s.id==='DB-1024').backup,'Protected');assert.equal(restore.requests[0].resultServiceId,clone.id);
// Pending targets and execution-time races cannot register duplicate names.
let conflict=createStore();conflict=create(conflict,form('Migrate','DB-1024',{target:'policy-migration'}));assert(validateRequest(conflict,form('Restore clone','DB-1024',{target:'policy-migration',backupId:'BKP-301'}),'DBRE'));conflict=approve(conflict);conflict={...conflict,services:[{...conflict.services[0],id:'race',name:'policy-migration'},...conflict.services]};assert(executionProblem(conflict,conflict.requests[0]).includes('already registered'));
// Schema state is scoped per database and rollback affects only supplied inverses.
let schema=create(createStore(),form('Schema update'));schema=complete(approve(schema));assert.equal(schema.services[0].schema,'v123');assert.equal(serviceChanges(schema,'DB-1023').filter(c=>c.status==='Pending').length,2);assert.equal(schema.requests[0].path,null);
schema=create(schema,form('Schema rollback'));schema=complete(approve(schema));assert.equal(schema.services[0].schema,'v121');assert.equal(serviceChanges(schema,'DB-1024').find(c=>!c.rollback).status,'Applied');
// Provisioning is routed, approval gated, registered without invented protection.
let provision=create(createStore(),{action:'Provision',name:'new-policy-service',platform:'postgres',environment:'Development',storage:64,team:'Policy Servicing',window:'Run now'},'Developer');assert.equal(provision.requests[0].path.id,'provision');provision=complete(approve(provision));assert.equal(provision.services[0].name,'new-policy-service');assert.equal(provision.services[0].backup,'Unprotected');assert.equal(serviceState(provision.services[0],provision.evidence).label,'Needs sync');
let retire=create(createStore(),form('Retire','DB-1024',{confirmed:true}));retire=complete(approve(retire));assert.equal(retire.services[0].status,'Retired');assert.equal(retire.backups.length,6);assert(validateRequest(retire,form(),'DBRE'));
console.log('Service workflow checks passed: persona scope, approval gates, pinned bindings, callbacks, freshness, restores, provisioning, schema scope, retirement and execution races.');
