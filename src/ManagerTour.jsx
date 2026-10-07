import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ArrowRight, ArrowLeft, X, Check, Play, Layers3, Zap, ShieldCheck, ChartNoAxesCombined, RotateCcw, CircleHelp} from 'lucide-react';
import './tour.css';

export const managerSteps = [
 {title:'Binaya, meet the DBaaS management workspace.',chapter:'BEYOND PROVISIONING',description:'giportal already handles infrastructure requests and provisioning. BasePort brings the ongoing database lifecycle together: inventory, backup, recovery, maintenance, migrations, and database change delivery.',next:'See how it fits'},
 {title:'giportal stays the enterprise front door.',chapter:'01 · FIT WITH THE EXISTING PORTAL',description:'There is no need for another independent enterprise website. BasePort could be a DBaaS module inside giportal, or an SSO-linked specialist workspace. This standalone site is a frontend preview of that experience.',benefit:'Keep existing infrastructure workflows while giving database teams a purpose-built place for detailed, day-two management.',target:'.portal-relationship',next:'Explore the database estate'},
 {title:'Know what exists, who owns it, and its posture.',chapter:'02 · DATABASE INVENTORY',description:'Inventory covers Oracle, SQL Server, Db2, PostgreSQL, MongoDB, and Cloudera. Choose a platform to follow through the demo. Every service retains ownership, environment, version, backup posture, and its giportal reference.',benefit:'A shared service inventory could reduce fragmented records and expose protection or version gaps after provisioning.',target:'.inventory-panel',next:'Protect the service'},
 {title:'Backups are part of service management.',chapter:'03 · BACKUP & RECOVERY',description:'Teams can inspect restore points, verification, and restore-test history. An on-demand backup and isolated restore clone support recovery planning without overwriting the source.',benefit:'Put recovery readiness beside the service it protects, rather than treating a successful backup job as proof of recoverability.',target:'.backup-panel',next:'Take a demo backup'},
 {title:'Maintain databases through a controlled process.',chapter:'04 · RESTART, PATCH & UPGRADE',description:'Plan lifecycle work with an explicit database, target version, maintenance window, and change reference. A preflight checks the restore point and captures compatibility and rollback review.',benefit:'Controlled operations could make maintenance easier to coordinate while retaining ownership, approvals, and an execution trail.',target:'.lifecycle-plan',next:'Run a simulated patch'},
 {title:'Make migration a managed journey.',chapter:'05 · DATA MIGRATION',description:'Source, target, approach, and reconciliation belong in one plan. This example demonstrates a same-platform move to staging. Cross-engine migrations require a separate compatibility and schema-mapping assessment.',benefit:'Track readiness and validation before cutover, and keep the migration history connected to the source service.',target:'.migration-workbench',next:'Simulate migration & validation'},
 {title:'Database changes belong in the lifecycle too.',chapter:'06 · LIQUIBASE CHANGE DELIVERY',description:'For relational platforms, the proposed Liquibase workspace shows versioned changesets, statement previews, validation, production review, and defined rollback. If you selected MongoDB or Cloudera, this step uses PostgreSQL to demonstrate the relational workflow.',benefit:'Connect schema releases to database ownership, environment, recovery, and audit context. Platform-native or extension-specific workflows need their own integrations.',target:'.liquibase-workbench',next:'Simulate a reviewed schema update'},
 {title:'Connect every action to its outcome.',chapter:'07 · OPERATIONS & AUDIT',description:'The demo backup, patch, migration, and schema update now share an activity trail. Records retain the database, actor, change context, and outcome. These are simulated records, not a production audit system.',benefit:'Give operators and managers one place to investigate service history and understand who changed what.',target:'.audit-panel',next:'See the management value'},
 {title:'One DBaaS lifecycle. Part of giportal.',chapter:'THE TAKEAWAY',description:'The reason for BasePort is depth of database management after provisioning. Its production home can be within giportal; the design is a specialist DBaaS control surface, not a competing infrastructure portal.',next:'Finish & explore'},
];

export default function ManagerTour({index,onNext,onBack,onClose,onRestart,platforms,selectedPlatform,onPlatformChange}) {
 const step=managerSteps[index],panel=useRef(null),[rect,setRect]=useState(null);
 const centered=index===0||index===managerSteps.length-1;
 useLayoutEffect(()=>{
  if(!step.target){setRect(null);return}
  const target=document.querySelector(step.target);
  if(!target){setRect(null);return}
  if(!target.closest('.overlay'))target.scrollIntoView({block:innerWidth<=760?'start':'center',behavior:'instant'});
  const update=()=>{
   const r=target.getBoundingClientRect(),bounds=target.closest('.modal')?.getBoundingClientRect();
   const top=Math.max(8,r.top-6,bounds?bounds.top+2:8);
   const left=Math.max(8,r.left-6);
   const bottom=Math.min(r.bottom+6,innerHeight-8,bounds?bounds.bottom-2:innerHeight-8,innerWidth<=760?(panel.current?.getBoundingClientRect().top||innerHeight)-12:innerHeight-8);
   setRect({top,left,width:Math.max(16,Math.min(r.right+6,innerWidth-8)-left),height:Math.max(16,bottom-top)});
  };
  update();const frame=requestAnimationFrame(update);
  window.addEventListener('resize',update);window.addEventListener('scroll',update,true);
  const observer=new ResizeObserver(update);observer.observe(target);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true)};
 },[index,step.target,selectedPlatform]);
 useEffect(()=>{panel.current?.querySelector('h2')?.focus({preventScroll:true})},[index]);
 useEffect(()=>{
  const handler=e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();onClose();return}
   if(e.key==='Tab'){
    const items=[...panel.current.querySelectorAll('button:not(:disabled),a[href],select')];
    if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&(document.activeElement===first||document.activeElement.tagName==='H2')){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&(document.activeElement===last||document.activeElement.tagName==='H2')){e.preventDefault();first.focus()}
   }
  };
  document.addEventListener('keydown',handler,true);return()=>document.removeEventListener('keydown',handler,true);
 },[onClose]);
 return <div className={`manager-tour ${centered?'tour-centered':''} `}>
  {centered?<div className="tour-shade"/>:rect?<div className="tour-spotlight" style={rect}/>:<div className="tour-shade"/>}
  <section className="tour-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description">
   <div className="tour-topline"><span className="tour-badge"><Play size={11} fill="currentColor"/>GUIDED MANAGER DEMO</span><button className="tour-close" aria-label="Exit guided demo" onClick={onClose}><X size={18}/></button></div>
   <div className="tour-progress" aria-label={`Step ${index+1} of ${managerSteps.length}`}>{managerSteps.map((_,i)=><span key={i} className={i<=index?'done':''}/>)}</div>
   <div className="tour-chapter">{step.chapter}</div>
   {centered&&<span className="tour-main-icon">{index===0?<Layers3 size={28}/>:<Check size={28}/>}</span>}
   <h2 id="tour-title" tabIndex={-1}>{step.title}</h2>
   <p id="tour-description" className="tour-description">{step.description}</p>
   {index===0&&<><div className="tour-promise"><span><Zap size={16}/>Database lifecycle coverage</span><span><ShieldCheck size={16}/>Controlled operations</span><span><ChartNoAxesCombined size={16}/>Connected service history</span></div><div className="tour-scenario"><strong>Your scenario</strong><p>A database is already provisioned through giportal. Follow its inventory, backup, maintenance, migration, and schema release journey in BasePort.</p></div></>}
   {index===2&&<div className="tour-platform-picker" aria-label="Demo platform">{platforms.map(p=><button key={p.id} aria-pressed={selectedPlatform===p.id} className={selectedPlatform===p.id?'selected':''} onClick={()=>onPlatformChange(p.id)}>{p.name}{selectedPlatform===p.id&&<Check size={12}/>}</button>)}</div>}
   {step.benefit&&<div className="tour-benefit"><span><Zap size={14}/>WHY THIS IS USEFUL</span><p>{step.benefit}</p></div>}
   {index===8&&<><div className="tour-outcomes"><div><Zap size={20}/><strong>A useful database workspace</strong><p>Manage existing services through their full database lifecycle.</p></div><div><ShieldCheck size={20}/><strong>Controlled lifecycle work</strong><p>Connect recovery readiness, maintenance, and change delivery.</p></div><div><ChartNoAxesCombined size={20}/><strong>A clear role beside giportal</strong><p>Keep enterprise provisioning in giportal; add DBaaS management depth.</p></div></div><div className="tour-next-phase"><strong>What this POC demonstrates</strong><p>An inventory-to-maintenance DBaaS experience, with simulated operations and Liquibase delivery.</p><strong>What a production version would need</strong><p>giportal integration and shared identity, database adapters, policy and approval workflows, backup tooling, migration validation, and Liquibase runners.</p><strong>How we would measure its value</strong><p>Inventory coverage, restore-test success, patch currency, migration validation, and database change failure rate.</p></div></>}
   <p className="tour-disclaimer"><CircleHelp size={13}/>{index===0?'About 3 minutes · No setup needed · All data and actions are mocked.':index===8?'No real infrastructure was created. Demo changes are removed when you finish.':'Prototype demo · Backups, maintenance, migrations, and schema changes are simulated.'}</p>
   <div className="tour-controls"><button className="tour-back" onClick={onBack} disabled={index===0}><ArrowLeft size={15}/><span>Back</span></button><span className="tour-step-count">{index+1} / {managerSteps.length}</span><button className="button primary" onClick={onNext}>{step.next}<ArrowRight size={15}/></button></div>
   {index===8&&<button className="tour-restart" onClick={onRestart}><RotateCcw size={13}/>Replay the demo</button>}
  </section>
 </div>
}
