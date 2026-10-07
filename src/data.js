export const platforms = [
 {id:'postgres',name:'PostgreSQL',color:'#347fa9',bg:'#edf5fa',glyph:'postgres',patch:'16.6',upgrade:'17.2',relational:true},
 {id:'oracle',name:'Oracle',color:'#d75a55',bg:'#fdf0ef',glyph:'oracle',patch:'19.24',upgrade:'23ai',relational:true},
 {id:'sqlserver',name:'SQL Server',color:'#a8628d',bg:'#f9eff5',glyph:'sql',patch:'2022 CU17',upgrade:'2025',relational:true},
 {id:'mongodb',name:'MongoDB',color:'#338467',bg:'#edf7f1',glyph:'mongo',patch:'7.0.16',upgrade:'8.0',relational:false},
 {id:'db2',name:'IBM Db2',color:'#5273c5',bg:'#eef2fc',glyph:'db2',patch:'11.5.9',upgrade:'12.1',relational:true},
 {id:'cloudera',name:'Cloudera',color:'#d48743',bg:'#fff4e9',glyph:'cloudera',patch:'7.1.9 SP2',upgrade:'7.3',relational:false},
];
export const initialServices=[
 {id:'DB-1024',name:'policy-servicing-prod',platform:'postgres',version:'16.4',environment:'Production',status:'Active',team:'Policy Servicing',storage:64,backup:'Protected',patch:'Patch available',origin:'GIP-1842',schema:'v121'},
 {id:'DB-1023',name:'finance-core-db',platform:'oracle',version:'19.22',environment:'Production',status:'Active',team:'Finance & Operations',storage:128,backup:'Protected',patch:'Patch available',origin:'GIP-1836',schema:'v84'},
 {id:'DB-1022',name:'claims-documents-dev',platform:'mongodb',version:'7.0.12',environment:'Development',status:'Active',team:'Claims Technology',storage:32,backup:'Protected',patch:'Patch available',origin:'GIP-1831',schema:'Document model'},
 {id:'DB-1021',name:'actuarial-lakehouse',platform:'cloudera',version:'7.1.9 SP1',environment:'Staging',status:'Maintenance',team:'Actuarial & Data',storage:256,backup:'Overdue',patch:'Patch available',origin:'GIP-1824',schema:'Dataset catalog'},
 {id:'DB-1020',name:'group-benefits-db',platform:'sqlserver',version:'2022 CU12',environment:'Production',status:'Active',team:'Group Benefits',storage:64,backup:'Protected',patch:'Patch available',origin:'GIP-1816',schema:'v67'},
 {id:'DB-1019',name:'underwriting-warehouse',platform:'db2',version:'11.5.8',environment:'Production',status:'Active',team:'Underwriting Technology',storage:128,backup:'Protected',patch:'Patch available',origin:'GIP-1809',schema:'v42'},
];
export const initialBackups=initialServices.map((s,i)=>({id:`BKP-${301+i}`,serviceId:s.id,name:s.name,type:s.platform==='cloudera'?'Dataset snapshot':'Full backup',created:i===3?'2 days ago':'Today, 02:00 UTC',status:i===3?'Overdue':'Verified',size:`${Math.round(s.storage*.63)} GB`,retention:'14 days',restoreTest:i===3?'Due':'Passed'}));
export const initialChanges=[{id:'2026.10-001',description:'Add policy event index',author:'policy-data-team',status:'Pending',rollback:true,sql:'CREATE INDEX idx_policy_events_created\nON policy_events (created_at);',rollbackSql:'DROP INDEX idx_policy_events_created;'}, {id:'2026.10-002',description:'Add event source column',author:'policy-data-team',status:'Pending',rollback:true,sql:"ALTER TABLE policy_events\nADD COLUMN source VARCHAR(64);",rollbackSql:'ALTER TABLE policy_events DROP COLUMN source;'}, {id:'2026.09-014',description:'Create policy events table',author:'policy-data-team',status:'Applied',rollback:false,sql:'-- Previously applied migration',rollbackSql:'No rollback supplied for this changeset.'}];
export const platformById=id=>platforms.find(p=>p.id===id);

// Illustrative service bindings, not a claim about MetLife production coverage.
export const backupProvider=s=>['oracle','sqlserver','postgres'].includes(s.platform)?'Rubrik':'Platform-native';
export const nativeConsole=s=>({oracle:'Oracle Enterprise Manager',sqlserver:'SQL Server Management Studio',db2:'IBM Db2 Data Management Console',postgres:'pgAdmin',mongodb:'MongoDB Ops Manager',cloudera:'Cloudera Manager'}[s.platform]);
