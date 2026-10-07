import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ArrowRight, ArrowLeft, X, Check, Play, Layers3, Zap, ShieldCheck, ChartNoAxesCombined, RotateCcw, CircleHelp} from 'lucide-react';
import './tour.css';

export const managerSteps = [
 {title:'Binaya, meet connected DBaaS for MetLife.',chapter:'ONE SERVICE · EVERY LAYER',description:'A database service spans infrastructure, recovery, engine operations and delivery. BasePort connects that service journey across the existing enterprise stack, giving teams consistent ownership, policy, workflow and execution context.',next:'See how it fits'},
 {title:'Keep the tools. Connect the service.',chapter:'01 · WHY BASEPORT EXISTS',description:'Vendor consoles remain the experts for engine management. Grafana and Elastic remain the observability layer. BasePort coordinates service work across them: request here, invoke giportal and Ansible, retain ServiceNow context, use Rubrik where configured, and connect Git and Liquibase delivery.',benefit:'Reduce repeated context gathering and handoffs between systems. A specialist workspace can launch from giportal with shared identity; a separate enterprise front door is optional.',target:'.connected-stack',next:'Explore the database estate'},
 {title:'A service record across six data platforms.',chapter:'02 · METLIFE SERVICE INVENTORY',description:'These fictional MetLife scenarios span policy servicing, finance, claims, actuarial, group benefits and underwriting. Choose a platform. Its service record connects the owner, environment, version, recovery provider and provisioning reference.',benefit:'A shared record makes it easier to answer who owns a service, which policies apply and which tool executes the next step.',target:'.inventory-panel',next:'Protect the service'},
 {title:'Recovery through the configured provider.',chapter:'03 · RUBRIK & NATIVE RECOVERY',description:'BasePort can front Rubrik for supported services, exposing recovery policy, restore points and restore requests. Other services retain platform-native recovery. The provider binding in this POC is illustrative, not a claim about MetLife coverage.',benefit:'Bring recovery readiness into the service journey while backup platforms continue to execute and own recovery jobs.',target:'.backup-panel',next:'Take a demo backup'},
 {title:'Coordinate lifecycle work across the stack.',chapter:'04 · GOVERNED MAINTENANCE',description:'Select a service, target version and maintenance window. Retain the ServiceNow change reference and preflight context, then route execution to native tooling or approved automation. Restart, patch, upgrade and retirement follow the same service experience.',benefit:'Consistent process and correlated outcomes across engines, with engine-specific execution staying in its existing layer.',target:'.lifecycle-plan',next:'Run a simulated patch'},
 {title:'Connect the migration journey.',chapter:'05 · MIGRATION & VALIDATION',description:'Coordinate source and target services, approach, owner, change and validation. This demo models a same-engine move into staging. Engine-specific migration tools still perform the transfer; cross-engine moves require a reviewed compatibility assessment.',benefit:'Keep readiness, cutover decisions and reconciliation attached to the service instead of scattered across requests and job records.',target:'.migration-workbench',next:'Simulate migration & validation'},
 {title:'Hook schema delivery into DBaaS.',chapter:'06 · GIT & LIQUIBASE',description:'Versioned changelogs, previews, approval context, validation and runner outcomes join the service lifecycle. Relational engines use the proposed Liquibase workflow; MongoDB and Cloudera require appropriate extensions or native pipelines.',benefit:'Connect application delivery to the right service, environment and recovery context. Git and Liquibase retain their delivery roles.',target:'.liquibase-workbench',next:'Simulate a reviewed schema update'},
 {title:'Follow an action across system boundaries.',chapter:'07 · CORRELATED SERVICE HISTORY',description:'Backup, maintenance, migration and schema delivery share a service activity trail. Open a record outside the tour to preview its execution route and change context. Detailed job records remain in the executing systems.',benefit:'Managers see service delivery and policy gaps at estate level; DBAs investigate performance and logs in native consoles, Grafana and Elastic.',target:'.audit-panel',next:'See the management value'},
 {title:'A consistent DBaaS experience across the stack.',chapter:'THE TAKEAWAY',description:'BasePort provides the service layer connecting MetLife’s existing capabilities: a clear service record, consistent lifecycle workflows, policy context, contextual handoffs and cross-tool execution history.',next:'Finish & explore'},
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
   {index===0&&<><div className="tour-promise"><span><Zap size={16}/>One service record</span><span><ShieldCheck size={16}/>Connected workflows</span><span><ChartNoAxesCombined size={16}/>Existing tool integrations</span></div><div className="tour-scenario"><strong>Your scenario</strong><p>Explore a fictional MetLife service through inventory, configured recovery, maintenance, migration and schema delivery. After the tour, try a new service request routed through giportal and Ansible.</p></div></>}
   {index===2&&<div className="tour-platform-picker" aria-label="Demo platform">{platforms.map(p=><button key={p.id} aria-pressed={selectedPlatform===p.id} className={selectedPlatform===p.id?'selected':''} onClick={()=>onPlatformChange(p.id)}>{p.name}{selectedPlatform===p.id&&<Check size={12}/>}</button>)}</div>}
   {step.benefit&&<div className="tour-benefit"><span><Zap size={14}/>WHY THIS IS USEFUL</span><p>{step.benefit}</p></div>}
   {index===8&&<><div className="tour-outcomes"><div><Zap size={20}/><strong>Shared service context</strong><p>Carry identity, ownership and policy across the enterprise stack.</p></div><div><ShieldCheck size={20}/><strong>Consistent service workflows</strong><p>Coordinate requests, recovery, lifecycle work and schema delivery.</p></div><div><ChartNoAxesCombined size={20}/><strong>Existing tools retain their roles</strong><p>Use giportal, Ansible, native tools, Rubrik, ServiceNow, Grafana and Elastic.</p></div></div><div className="tour-next-phase"><strong>What this POC demonstrates</strong><p>A cross-stack DBaaS service experience with provisioning routes, tool handoffs and lifecycle workflows.</p><strong>What a production version would need</strong><p>Shared identity, approved integration contracts, policy checks, service mappings and reliable execution callbacks.</p><strong>How we would measure its value</strong><p>Service ownership coverage, policy compliance, request-to-ready time, handoff effort and lifecycle completion rates. Baselines would need validation with teams.</p></div></>}
   <p className="tour-disclaimer"><CircleHelp size={13}/>{index===0?'About 3 minutes · No setup needed · All data and actions are mocked.':index===8?'No real infrastructure was created. Demo changes are removed when you finish.':'Prototype demo · Backups, maintenance, migrations, and schema changes are simulated.'}</p>
   <div className="tour-controls"><button className="tour-back" onClick={onBack} disabled={index===0}><ArrowLeft size={15}/><span>Back</span></button><span className="tour-step-count">{index+1} / {managerSteps.length}</span><button className="button primary" onClick={onNext}>{step.next}<ArrowRight size={15}/></button></div>
   {index===8&&<button className="tour-restart" onClick={onRestart}><RotateCcw size={13}/>Replay the demo</button>}
  </section>
 </div>
}
