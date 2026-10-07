import {initialServices,initialBackups,initialChanges,platformById,backupProvider} from './data.js';
import {initialEvidence,initialPaths,desiredFacts,assess,validateObservation} from './controlPlane.js';
export const developerTeam='Policy Servicing';
export const actions=['Apply baseline','Backup','Restore clone','Restart','Patch','Upgrade','Migrate','Schema update','Schema rollback','Retire'];
export function createStore(){
 const evidence=initialEvidence();
 return {services:initialServices.map(s=>({...s})),backups:initialBackups.map(b=>({...b})),evidence,seenEvents:Object.values(evidence).map(e=>e.eventId),paths:initialPaths.map(p=>({...p})),changes:{},counter:100,requests:[
  {id:'BP-0099',serviceId:'DB-1023',serviceName:'finance-core-db',action:'Patch',status:'Scheduled',change:'CHG-2084',environment:'Production',team:'Finance & Operations',window:'Next maintenance window',target:'19.24',path:{...initialPaths[1]},created:'Today',history:[{label:'Change created',actor:'BasePort',detail:'CHG-2084'},{label:'Approved',actor:'Demo reviewer',detail:'Next maintenance window'}]},
  {id:'BP-0098',serviceId:'DB-1024',serviceName:'policy-servicing-prod',action:'Schema update',status:'Awaiting approval',change:'CHG-2081',environment:'Production',team:developerTeam,window:'Run now',created:'Today',history:[{label:'Change created',actor:'BasePort',detail:'CHG-2081'}]},
  {id:'BP-0097',serviceId:'DB-1024',serviceName:'policy-servicing-prod',action:'Backup',status:'Completed',change:'POL-BACKUP-14D',environment:'Production',team:developerTeam,window:'Run now',created:'Today',jobId:'RUB-DEMO-301',history:[{label:'Backup verified',actor:'Recovery policy',detail:'Rubrik · demo provider'}]}
 ]};
}
export const serviceState=(s,evidence)=>s.status==='Retired'?{label:'Retired',tone:'muted'}:({Aligned:{label:'Ready',tone:'good'},Drift:{label:'Needs attention',tone:'attention'},Unknown:{label:'Needs sync',tone:'muted'}}[assess(s,evidence[s.id]).status]);
export const serviceChanges=(store,id)=>store.changes[id]||initialChanges;
export function validateRequest(store,form,persona){
 if(form.action==='Provision'){
  if(!/^[a-z][a-z0-9-]{2,47}$/.test(form.name)||store.services.some(s=>s.name===form.name)||store.requests.some(r=>r.action==='Provision'&&r.serviceName===form.name&&r.status!=='Completed'))return 'Use a unique name with 3–48 lowercase letters, numbers or hyphens.';
  if(!platformById(form.platform))return 'Select a supported platform.';
  if(!form.team?.trim())return 'Choose an owning team.';
  if(!['Development','Staging','Production'].includes(form.environment))return 'Choose an environment.';
  if(![32,64,128,256].includes(Number(form.storage)))return 'Choose a storage size.';
  if(persona==='Developer'&&form.team!==developerTeam)return 'Developer requests belong to Policy Servicing.';
  return '';
 }
 const s=store.services.find(s=>s.id===form.serviceId);
 if(!s||s.status==='Retired')return 'Select an active service.';
 if(!actions.includes(form.action))return 'Choose a supported action.';
 if(persona==='Developer'&&(s.team!==developerTeam||!['Backup','Restore clone','Schema update','Schema rollback'].includes(form.action)))return 'This action requires the DBRE view.';
 if(['Schema update','Schema rollback'].includes(form.action)&&!platformById(s.platform).relational)return 'This platform uses native change tooling.';
 if(['Restore clone','Migrate'].includes(form.action)&&(!/^[a-z][a-z0-9-]{2,47}$/.test(form.target)||store.services.some(s=>s.name===form.target)||store.requests.some(r=>r.target===form.target&&['Restore clone','Migrate'].includes(r.action)&&r.status!=='Completed')))return 'Choose a unique target name using lowercase letters, numbers or hyphens.';
 if(form.action==='Restore clone'&&!store.backups.some(b=>b.id===form.backupId&&b.serviceId===s.id&&b.status==='Verified'))return 'Select a verified restore point.';
 if(form.action==='Retire'&&!form.confirmed)return 'Confirm that you intend to retire this service.';
 if(!['Run now','Next maintenance window','Weekend window'].includes(form.window))return 'Choose a valid execution window.';
 if(form.action==='Schema update'&&!serviceChanges(store,s.id).some(c=>c.status==='Pending'))return 'No pending changes to apply.';
 if(form.action==='Schema rollback'&&!serviceChanges(store,s.id).some(c=>c.status==='Applied'&&c.rollback))return 'No applied changes have a defined rollback.';
 return '';
}
export function executionProblem(store,request){
 if(!request||!['Approved','Scheduled'].includes(request.status))return 'Reviewer approval is required.';
 if(request.path?.status&&request.path.status!=='Published')return 'A published automation path is required.';
 if(request.action==='Provision')return store.services.some(s=>s.name===request.serviceName)?'A service already uses this name.':'';
 const s=store.services.find(s=>s.id===request.serviceId);
 if(!s||s.status==='Retired')return 'The service is retired or unavailable.';
 if(['Apply baseline','Restart','Patch','Upgrade','Migrate','Retire','Schema update','Schema rollback'].includes(request.action)&&assess(s,store.evidence[s.id]).freshness!=='Fresh')return 'Refresh this service before execution.';
 if(['Patch','Upgrade','Migrate','Retire','Restore clone'].includes(request.action)&&!store.backups.some(b=>b.serviceId===s.id&&b.status==='Verified'&&(request.action!=='Restore clone'||b.id===request.backupId)))return 'A verified restore point is required.';
 if(['Migrate','Restore clone'].includes(request.action)&&store.services.some(s=>s.name===request.target))return 'The target name is already registered.';
 if(request.path?.status&&request.path.status!=='Published')return 'A published automation path is required.';
 if(request.action==='Schema update'&&!serviceChanges(store,s.id).some(c=>c.status==='Pending'))return 'The changes are already applied.';
 if(request.action==='Schema rollback'&&!serviceChanges(store,s.id).some(c=>c.status==='Applied'&&c.rollback))return 'No applied changes have a defined rollback.';
 return '';
}
export function observationFor(store,service,{align=false,version,jobId='AAP-DEMO-RECONCILE'}={}){
 const previous=store.evidence[service.id];return {schemaVersion:'1.0',serviceId:service.id,eventId:`evt-${service.id}-${Date.now()}-${(previous?.sequence||0)+1}`,sequence:(previous?.sequence||0)+1,observedAt:new Date().toISOString(),source:'aap-inventory',jobId,facts:{...(align?desiredFacts(service):previous?.facts||desiredFacts(service)),...(version?{version}:{})}};
}
export function reduceStore(store,event){
 if(event.type==='RESET')return event.store;
 if(event.type==='INGEST'){
  const result=validateObservation(event.payload,store.services,store.evidence,store.seenEvents);
  if(result.error)return store;
  return {...store,evidence:{...store.evidence,[result.record.serviceId]:result.record},seenEvents:[...store.seenEvents,result.record.eventId]};
 }
 if(event.type==='PUBLISH')return {...store,paths:store.paths.map(p=>p.id===event.id?{...p,...event.binding,version:`${p.version.split('.')[0]}.${Number(p.version.split('.')[1])+1}`}:p)};
 if(event.type==='CREATE'){
  if(validateRequest(store,event.form,event.persona))return store;
  const f=event.form,s=store.services.find(s=>s.id===f.serviceId),counter=store.counter+1,id=`BP-${String(counter).padStart(4,'0')}`,change=`CHG-${3000+counter}`;
  const pathId=f.action==='Provision'?'provision':f.action==='Apply baseline'?'baseline':['Restart','Patch','Upgrade','Migrate','Retire'].includes(f.action)?'patch':null;
  const path=store.paths.find(p=>p.id===pathId);
  const request={...f,id,serviceName:f.action==='Provision'?f.name:s.name,team:f.action==='Provision'?f.team:s.team,environment:f.action==='Provision'?f.environment:s.environment,status:'Awaiting approval',change,created:'Just now',path:path?{...path}:null,history:[{label:'Change created',actor:'BasePort',detail:`${change} · owner, scope and rollback context populated`}],schemaBefore:s?.schema};
  return {...store,counter,requests:[request,...store.requests]};
 }
 const request=store.requests.find(r=>r.id===event.id);if(!request)return store;
 const update=(patch,entry)=>({...store,requests:store.requests.map(r=>r.id===request.id?{...r,...patch,history:entry?[...r.history,entry]:r.history}:r)});
 if(event.type==='APPROVE'&&request.status==='Awaiting approval')return update({status:'Approved'},{label:'Approved',actor:'Demo reviewer',detail:'Explicit simulated approval'});
 if(event.type==='SCHEDULE'&&request.status==='Approved'&&!executionProblem(store,request))return update({status:'Scheduled'},{label:'Scheduled',actor:'BasePort',detail:request.window});
 if(event.type==='START'&&!executionProblem(store,request))return update({status:'Running',error:''},{label:'Execution started',actor:'Automation',detail:request.action==='Provision'?'giportal → AAP':request.action==='Backup'||request.action==='Restore clone'?'Configured recovery provider':request.action.startsWith('Schema')?'Git + Liquibase':'AAP / native adapter'});
 if(event.type!=='COMPLETE'||request.status!=='Running')return store;
 // Recheck prerequisites at completion; a callback must not clear unrelated drift.
 const problem=executionProblem(store,{...request,status:'Approved'});
 if(problem)return update({status:'Approved',error:problem},{label:'Execution blocked',actor:'BasePort',detail:problem});
 let next={...store},s=store.services.find(s=>s.id===request.serviceId),result='Completed',jobId=`AAP-DEMO-${request.id}`;
 if(request.action==='Provision'){
  s={id:`DB-${request.id}`,name:request.serviceName,platform:request.platform,version:platformById(request.platform).patch,environment:request.environment,team:request.team,storage:Number(request.storage),backup:'Unprotected',patch:'Up to date',origin:`GIP-DEMO-${request.id}`,schema:platformById(request.platform).relational?'v0':'Platform-managed',status:'Active'};
  next.services=[s,...store.services];result='Service registered. Protection and fresh evidence are required.';
 }
 if(request.action==='Apply baseline'||['Patch','Upgrade'].includes(request.action)){
  const version=request.action==='Patch'?platformById(s.platform).patch:request.action==='Upgrade'?platformById(s.platform).upgrade:s.version;
  const payload=observationFor(store,s,{align:request.action==='Apply baseline',version,jobId});
  const validated=validateObservation(payload,store.services,store.evidence,store.seenEvents);
  if(validated.error)return update({status:'Approved',error:validated.error},{label:'Evidence rejected',actor:'BasePort',detail:validated.error});
  next.evidence={...store.evidence,[s.id]:validated.record};next.seenEvents=[...store.seenEvents,validated.record.eventId];
  if(request.action!=='Apply baseline')next.services=store.services.map(item=>item.id===s.id?{...item,version,patch:'Up to date'}:item);
  result=request.action==='Apply baseline'?'Configuration reconciled. Recovery policy checked separately.':`Version ${version}; fresh callback accepted.`;
 }
 if(request.action==='Backup'){
  jobId=`RECOVERY-DEMO-${request.id}`;next.backups=[{id:`BKP-${request.id}`,serviceId:s.id,name:s.name,type:'On-demand backup',created:'Just now',status:'Verified',size:`${Math.round(s.storage*.63)} GB`,retention:'14 days',restoreTest:'Not tested'},...store.backups];next.services=store.services.map(item=>item.id===s.id?{...item,backup:'Protected'}:item);result=`${backupProvider(s)} backup verified.`;
 }
 if(['Restore clone','Migrate'].includes(request.action)){
  const target={...s,id:`DB-${request.id}`,name:request.target,environment:request.action==='Migrate'?'Staging':'Development',backup:'Unprotected',origin:request.id,status:'Active'};
  next.services=[target,...store.services];result=`${request.target} registered. Source unchanged; target needs protection and evidence.`;
  if(request.action==='Restore clone'){jobId=`RECOVERY-DEMO-${request.id}`;next.backups=store.backups.map(b=>b.id===request.backupId?{...b,restoreTest:'Passed'}:b)}
 }
 if(request.action.startsWith('Schema')){
  jobId=`LIQUIBASE-DEMO-${request.id}`;const rollback=request.action==='Schema rollback',changes=serviceChanges(store,s.id);const affected=changes.filter(c=>rollback?c.status==='Applied'&&c.rollback:c.status==='Pending');
  next.changes={...store.changes,[s.id]:changes.map(c=>affected.some(a=>a.id===c.id)?{...c,status:rollback?'Pending':'Applied'}:c)};
  const currentNumber=Number.parseInt(s.schema.replace('v',''))||0;next.services=store.services.map(item=>item.id===s.id?{...item,schema:`v${currentNumber+(rollback?-affected.length:affected.length)}`} :item);result=rollback?'Defined rollback simulated.':'Validated changesets applied in the simulation.';
 }
 if(request.action==='Retire'){next.services=store.services.map(item=>item.id===s.id?{...item,status:'Retired'}:item);result='Service retired; history retained.'}
 next.requests=store.requests.map(r=>r.id===request.id?{...r,status:'Completed',error:'',result,jobId,resultServiceId:s?.id,history:[...r.history,{label:'Completed',actor:'Execution layer',detail:result}]}:r);
 if(['Restore clone','Migrate'].includes(request.action))next.requests=next.requests.map(r=>r.id===request.id?{...r,resultServiceId:`DB-${request.id}`}:r);
 return next;
}
