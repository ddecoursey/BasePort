import {platforms} from './data.js';
import {assess} from './controlPlane.js';
export const demoUsers={Developer:{id:'jamie-davis',name:'Jamie Davis'},DBRE:{id:'avery-patel',name:'Avery Patel'},Management:{id:'binaya',name:'Binaya'}};
export const spaces=[
 {id:'personal',name:'My databases',kind:'Personal',role:'Developer',ownerId:'jamie-davis',description:'Databases assigned to Jamie Davis.'},
 ...platforms.map(p=>({id:`platform-${p.id}`,name:p.name,kind:'Platform',role:'DBRE',platform:p.id,description:`Assigned ${p.name} services and platform operations.`})),
 {id:'fleet',name:'Enterprise fleet',kind:'Fleet',role:'Management',description:'Read-only service portfolio across the enterprise.'},
 {id:'business-policy',name:'Policy Servicing',kind:'Business',role:'Management',team:'Policy Servicing',description:'Read-only business portfolio for Policy Servicing.'},
];
export const availableSpaces=role=>spaces.filter(s=>s.role===role);
export function resolveSpace(role,id){return availableSpaces(role).find(s=>s.id===id)||availableSpaces(role)[0]}
export function belongsToSpace(service,space){
 if(!space)return false;
 if(space.role==='Developer')return service.ownerId===space.ownerId;
 if(space.role==='DBRE')return service.platform===space.platform;
 return space.id==='fleet'||service.team===space.team;
}
export function scopeStore(store,space){
 const services=store.services.filter(s=>belongsToSpace(s,space)),ids=new Set(services.map(s=>s.id));
 const requests=store.requests.filter(r=>r.action==='Provision'?space.role==='Developer'?r.ownerId===space.ownerId:space.role==='DBRE'?r.platform===space.platform:space.id==='fleet'||r.team===space.team:ids.has(r.serviceId));
 return {...store,services,requests,backups:store.backups.filter(b=>ids.has(b.serviceId)),evidence:Object.fromEntries(Object.entries(store.evidence).filter(([id])=>ids.has(id))),changes:Object.fromEntries(Object.entries(store.changes).filter(([id])=>ids.has(id))),paths:(store.spacePaths?.[space.id]||store.paths).map(p=>({...p,platforms:space.platform?[space.platform]:p.platforms}))};
}
export function canAct(store,space,serviceId,action){
 if(!space||space.role==='Management')return false;
 if(action==='Provision')return true;
 const service=store.services.find(s=>s.id===serviceId);
 if(!service||!belongsToSpace(service,space)||service.status==='Retired')return false;
 return space.role==='DBRE'||['Backup','Restore clone','Schema update','Schema rollback'].includes(action);
}
export function fleetSummary(store,space){
 const scoped=scopeStore(store,space),active=scoped.services.filter(s=>s.status!=='Retired');
 const rollup=services=>({count:services.length,production:services.filter(s=>s.environment==='Production').length,protected:services.filter(s=>s.backup==='Protected').length,attention:services.filter(s=>assess(s,store.evidence[s.id]).status!=='Aligned').length,storage:services.reduce((sum,s)=>sum+s.storage,0)});
 return {total:rollup(active),requests:scoped.requests.filter(r=>r.status!=='Completed').length,platforms:platforms.map(p=>({id:p.id,name:p.name,...rollup(active.filter(s=>s.platform===p.id))})),teams:[...new Set(active.map(s=>s.team))].map(name=>({name,...rollup(active.filter(s=>s.team===name))})),environments:['Production','Staging','Development'].map(name=>({name,count:active.filter(s=>s.environment===name).length}))};
}
