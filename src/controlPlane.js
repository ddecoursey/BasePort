import {initialServices} from './data.js';
export const MAX_AGE_MS=30*60*1000;
export const desiredFacts=s=>({tlsEnabled:true,retentionDays:14,version:s.version});
export const initialEvidence=()=>Object.fromEntries(initialServices.map((s,i)=>[s.id,{serviceId:s.id,eventId:`seed-${s.id}`,sequence:100,observedAt:new Date(Date.now()-(i===5?95:4)*60000).toISOString(),source:'aap-inventory',jobId:`AAP-${480+i}`,facts:{...desiredFacts(s),tlsEnabled:i!==1,retentionDays:i===3?7:14}}]));
export function assess(service,evidence,now=Date.now()){
 if(!evidence||now-Date.parse(evidence.observedAt)>MAX_AGE_MS)return {status:'Unknown',freshness:'Stale',findings:[],reason:'Fresh evidence required'};
 const expected=desiredFacts(service),findings=Object.entries(expected).filter(([key,value])=>evidence.facts[key]!==value).map(([key,value])=>({key,desired:value,observed:evidence.facts[key]}));
 if(service.backup!=='Protected')findings.push({key:'recoveryPolicy',desired:'Protected',observed:service.backup});
 return {status:findings.length?'Drift':'Aligned',freshness:'Fresh',findings};
}
export function validateObservation(payload,services,evidence,seenEvents,now=Date.now()){
 if(!payload||payload.schemaVersion!=='1.0')return {error:'Use schemaVersion 1.0.'};
 if(!services.some(s=>s.id===payload.serviceId))return {error:'Unknown serviceId. Register the service first.'};
 if(typeof payload.eventId!=='string'||!payload.eventId.trim())return {error:'eventId is required.'};
 if(seenEvents.includes(payload.eventId))return {error:'Duplicate event. State unchanged.'};
 if(payload.source!=='aap-inventory')return {error:'This demo binding accepts aap-inventory evidence only.'};
 if(typeof payload.jobId!=='string'||!payload.jobId.trim())return {error:'A correlated jobId is required.'};
 const time=Date.parse(payload.observedAt),previous=evidence[payload.serviceId];
 if(!Number.isFinite(time)||time>now+60000)return {error:'observedAt must be a valid timestamp, no more than one minute ahead.'};
 if(now-time>MAX_AGE_MS)return {error:'Evidence is older than the 30-minute freshness policy.'};
 if(!Number.isInteger(payload.sequence)||payload.sequence<1)return {error:'sequence must be a positive integer.'};
 if(previous&&(payload.sequence<=previous.sequence||time<Date.parse(previous.observedAt)))return {error:'Out-of-order observation. State unchanged.'};
 const f=payload.facts;
 if(!f||typeof f.tlsEnabled!=='boolean'||!Number.isInteger(f.retentionDays)||f.retentionDays<0||typeof f.version!=='string'||!f.version.trim())return {error:'Required facts: tlsEnabled (boolean), retentionDays (integer), version (string).'};
 return {record:{serviceId:payload.serviceId,eventId:payload.eventId,observedAt:payload.observedAt,sequence:payload.sequence,source:payload.source,jobId:payload.jobId,facts:{tlsEnabled:f.tlsEnabled,retentionDays:f.retentionDays,version:f.version}}};
}
export const initialPaths=[
 {id:'baseline',name:'Enforce baseline',version:'1.2',template:'42',revision:'a7c24f1',status:'Published',description:'TLS & retention policy',platforms:['postgres','oracle','sqlserver','db2','mongodb','cloudera']},
 {id:'patch',name:'Patch database',version:'1.4',template:'58',revision:'d6b28a4',status:'Published',description:'Preflight → change → AAP → evidence',platforms:['postgres','oracle','sqlserver','db2','mongodb','cloudera']},
 {id:'provision',name:'Provision service',version:'2.0',template:'73',revision:'c7f61d2',status:'Published',description:'giportal → AAP → registration',platforms:['postgres','oracle','sqlserver','db2','mongodb','cloudera']},
];
